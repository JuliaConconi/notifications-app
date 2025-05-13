import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebaseConfig';

const realizarLogin = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const tentarLogar = () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.navigate('PaginaPrincipal');
            })
            .catch(error => {
                console.error('Login failed:', error);
            });
    };

    return (
        <ImageBackground 
            source={require('../../assets/fundo_realmadrid.jpg')} 
            style={styles.background}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />
                    <TouchableOpacity style={styles.button} onPress={tentarLogar}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        maxWidth: 350,
        backgroundColor: 'rgba(255, 255, 255, 0.69)', // Fundo semi-transparente para melhorar a visibilidade
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default realizarLogin;




// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import app from '../../firebaseConfig';

// const realizarLogin = ({ navigation }) => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const tentarLogar = () => {
//         const auth = getAuth(app);
//         signInWithEmailAndPassword(auth, email, password)
//             .then(() => {
//                 navigation.navigate('Vizualizar');
//             })
//             .catch(error => {
//                 console.error('Login failed:', error);
//             });
//     };
//     return (
//         <View style={styles.container}>
//             <ImageBackground source={require('../../assets/fundo_realmadrid.jpg')} style={styles.background}>
//                 <Text style={styles.title}>Login</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Email"
//                     value={email}
//                     onChangeText={setEmail}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                 />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Senha"
//                     value={password}
//                     onChangeText={setPassword}
//                     secureTextEntry
//                 />
//                 <TouchableOpacity style={styles.button} onPress={tentarLogar}>
//                     <Text styles={styles.buttontext}>Entrar</Text>
//                 </TouchableOpacity>
//             </ImageBackground>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: [{ translateX: -150 }, { translateY: -100 }],
//         width: 300,
//         height: 200,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 10,
//         borderRadius: 6,
//     },
//     background: {
//         flex: 1,
//         resizeMode: 'cover', // Ajusta a imagem para cobrir toda a tela
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     input: {
//         width: '100%',
//         height: 40,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         marginBottom: 10,
//         paddingHorizontal: 10,
//         borderRadius: 5,
//     },
//     button: {
//         backgroundColor: '#007BFF',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         width: '100%',
//     },
//     buttontext: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });

// export default realizarLogin;