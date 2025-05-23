import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Alert, FlatList, Pressable,
    Modal, TextInput
} from 'react-native';
import {
    collection, getDocs, doc, addDoc, updateDoc, deleteDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from "../../firebaseConfig";
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Notifications from 'expo-notifications';

const App = ({ navigation }) => {
    const [dados, setDados] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [jogadorEditando, setJogadorEditando] = useState(null);

    const [nome, setNome] = useState('');
    const [camisa, setCamisa] = useState('');
    const [altura, setAltura] = useState('');
    const [nascimento, setNascimento] = useState('');

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("Notificação recebida: ", notification);
            }
        );
        return () => subscription.remove();
    }, []);

    const requestLocalNotificationPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                "Permissão negada",
                "Ative as notificações para visualizar os avisos."
            );
            return false;
        }
        return true;
    };

    const buscarDados = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "real-madrid"));
            const lista = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDados(lista);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        }
    };

    useEffect(() => {
        buscarDados();
    }, []);

    const addJogador = async () => {
        if (!nome || !camisa || !altura || !nascimento) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        try {
            const jogadoresCollection = collection(db, "real-madrid");

            const [day, month, year] = nascimento.split("/");
            const nascimentoDate = new Date(`${year}-${month}-${day}T00:00:00`);
            const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

            await addDoc(jogadoresCollection, {
                nome,
                camisa,
                altura: parseFloat(altura),
                nascimento: nascimentoTimestamp,
            });

            const permissao = await requestLocalNotificationPermission();

            if (permissao) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Novo jogador adicionado!",
                        body: `${nome} foi incluído no elenco`,
                        sound: true,
                    },
                    trigger: null,
                });
            }

            Alert.alert("Sucesso", "Jogador adicionado com sucesso!");
            setModalAddVisible(false);
            limparCampos();
            buscarDados();
        } catch (error) {
            console.error("Erro ao adicionar", error);
        }
    };

    const abrirModalEdicao = (item) => {
        setJogadorEditando(item);
        setNome(item.nome || '');
        setCamisa(item.camisa?.toString() || '');
        setAltura(item.altura?.toString() || '');
        setNascimento(item.nascimento ? format(item.nascimento.toDate(), 'dd/MM/yyyy') : '');
        setModalVisible(true);
    };

    const salvarEdicao = async () => {
        if (!jogadorEditando) return;

        try {
            const [day, month, year] = nascimento.split('/');
            const nascimentoDate = new Date(`${year}-${month}-${day}T00:00:00`);
            const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

            const jogadorRef = doc(db, "real-madrid", jogadorEditando.id);
            await updateDoc(jogadorRef, {
                nome,
                camisa: parseInt(camisa),
                altura: parseFloat(altura),
                nascimento: nascimentoTimestamp,
            });

            Alert.alert("Sucesso", "Jogador editado com sucesso!");
            setModalVisible(false);
            setJogadorEditando(null);
            limparCampos();
            buscarDados();
        } catch (error) {
            console.error("Erro ao editar", error);
        }
    };

    const limparCampos = () => {
        setNome('');
        setCamisa('');
        setAltura('');
        setNascimento('');
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "real-madrid", id));
            await buscarDados();
            Alert.alert("Sucesso", "Jogador excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar jogador:", error);
            Alert.alert("Erro", "Não foi possível excluir o jogador.");
        }
    };

    return (
        <View style={styles.container}>

            <Pressable
                onPress={() => setModalAddVisible(true)}
                style={({ pressed }) => [
                    styles.addButton,
                    pressed && styles.addButtonPressed
                ]}
            >
                <Icon name="plus" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Adicionar Jogador</Text>
            </Pressable>

            <FlatList
                data={dados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.userCard}>
                        <Text style={styles.text}>Nome: {item.nome}</Text>
                        <Text style={styles.text}>Camisa: {item.camisa}</Text>
                        <Text style={styles.text}>Altura: {item.altura}</Text>
                        <Text style={styles.text}>
                            Nascimento: {item.nascimento ? format(item.nascimento.toDate(), 'dd/MM/yyyy') : 'Data inválida'}
                        </Text>

                        <View style={styles.iconsContainer}>
                            <Pressable
                                onPress={() => abrirModalEdicao(item)}
                                style={({ pressed }) => [
                                    styles.iconButton,
                                    pressed && styles.iconPressed
                                ]}
                            >
                                <Icon name="pencil" size={24} color="blue" />
                            </Pressable>

                            <Pressable
                                onPress={() => handleDelete(item.id)}
                                style={({ pressed }) => [
                                    styles.iconButton,
                                    pressed && styles.iconPressed
                                ]}
                            >
                                <Icon name="trash" size={24} color="red" />
                            </Pressable>
                        </View>
                    </View>
                )}
            />

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Jogador</Text>
                        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
                        <TextInput placeholder="Camisa" value={camisa} onChangeText={setCamisa} keyboardType="numeric" style={styles.input} />
                        <TextInput placeholder="Altura" value={altura} onChangeText={setAltura} keyboardType="numeric" style={styles.input} />
                        <TextInput placeholder="Nascimento (dd/MM/yyyy)" value={nascimento} onChangeText={setNascimento} style={styles.input} />

                        <View style={styles.modalButtons}>
                            <Pressable onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable onPress={salvarEdicao} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Salvar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={modalAddVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adicionar Jogador</Text>
                        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
                        <TextInput placeholder="Camisa" value={camisa} onChangeText={setCamisa} keyboardType="numeric" style={styles.input} />
                        <TextInput placeholder="Altura" value={altura} onChangeText={setAltura} keyboardType="numeric" style={styles.input} />
                        <TextInput placeholder="Nascimento (dd/MM/yyyy)" value={nascimento} onChangeText={setNascimento} style={styles.input} />

                        <View style={styles.modalButtons}>
                            <Pressable onPress={() => setModalAddVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable onPress={addJogador} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Adicionar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#191970',
    },
    userCard: {
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        marginLeft: 3,
        marginTop: 7,
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
    },
    iconsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end',
    },
    iconButton: {
        marginLeft: 5,
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#D3D3D3'
    },
    iconPressed: {
        backgroundColor: '#D3D3D3',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#32CD32',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 15,
        alignSelf: 'center',
        gap: 8,
    },
    addButtonPressed: {
        backgroundColor: '#1c86ee',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 12,
        padding: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonPressed: {
        backgroundColor: '#1c86ee',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonPressed: {
        backgroundColor: '#1c86ee',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    modalButtonText2: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: '#32CD32',
    },
});
