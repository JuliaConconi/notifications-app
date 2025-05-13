import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

const SobreNos = () => {
    return (
        <ImageBackground
            source={require('../../assets/real-madrid-fundo.jpg')} 
            style={styles.background}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Real Madrid</Text>
                <Text style={styles.description}>
                    O Real Madrid Club de Fútbol, fundado em 1902, é um dos clubes mais vitoriosos e famosos do futebol mundial.
                    Com sede em Madri, Espanha, o clube conquistou múltiplas Champions League e La Ligas, sendo reconhecido pela sua grandeza, história e elenco estelar ao longo dos anos.
                    Seu estádio, o Santiago Bernabéu, é um dos templos do futebol mundial.
                </Text>
            </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: '400'
    },
});

export default SobreNos;
