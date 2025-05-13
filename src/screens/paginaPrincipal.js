import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaginaPrincipal = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground 
            source={require('../../assets/wallpaper.jpg')} // Substitua por sua imagem
            style={styles.background}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Página Principal</Text>

                <Pressable style={styles.button} onPress={() => navigation.navigate('EditarUsuario')}>
                    <Text style={styles.buttonText}>Perfil</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('ListarJogadores')}>
                    <Text style={styles.buttonText}>Lista de Jogadores</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('Lampada')}>
                    <Text style={styles.buttonText}>Lâmpada</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('CalculoIMC')}>
                    <Text style={styles.buttonText}>Cálculo do IMC</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('SobreNos')}>
                    <Text style={styles.buttonText}>Sobre Nós</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('UploadIMG')}>
                    <Text style={styles.buttonText}>Escolha Imagens</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('ListarIMG')}>
                    <Text style={styles.buttonText}>Vizualizar Imagens</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => navigation.navigate('ListarVideo')}>
                    <Text style={styles.buttonText}>Escolha Vídeos</Text>
                </Pressable> 

                <Pressable style={styles.button} onPress={() => navigation.navigate('UploadVideo')}>
                    <Text style={styles.buttonText}>Vizualizar Vídeos</Text>
                </Pressable> 

                <Pressable style={styles.button} onPress={() => navigation.navigate('AdicionarUsuario')}>
                    <Text style={styles.buttonText}>Adicionar Usuário</Text>
                </Pressable>                     

                <Pressable style={styles.logoutButton} onPress={() => navigation.replace('RealizarLogin')}>
                    <Text style={styles.buttonText}>Logout</Text>
                </Pressable>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8ff',
        padding: 20,
    },
    background:{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 50,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#1E90FF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: '#DC143C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default PaginaPrincipal;
