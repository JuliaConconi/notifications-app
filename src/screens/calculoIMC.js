import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const CalculoIMC = () => {
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [resultado, setResultado] = useState(null);
    const [classificacao, setClassificacao] = useState('');

    const calcularIMC = () => {
        const pesoNum = parseFloat(peso);
        const alturaNum = parseFloat(altura);

        if (!pesoNum || !alturaNum || alturaNum <= 0) {
            setResultado(null);
            setClassificacao('Insira valores válidos!');
            return;
        }

        const imc = pesoNum / (alturaNum * alturaNum);
        setResultado(imc.toFixed(2));

        if (imc < 18.5) setClassificacao('Abaixo do Peso');
        else if (imc < 24.9) setClassificacao('Peso Normal');
        else if (imc < 29.9) setClassificacao('Sobrepeso');
        else if (imc < 34.9) setClassificacao('Obesidade Grau 1');
        else if (imc < 39.9) setClassificacao('Obesidade Grau 2');
        else setClassificacao('Obesidade Grau 3');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calculadora de IMC</Text>

            <TextInput
                style={styles.input}
                placeholder="Peso (kg)"
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
            />

            <TextInput
                style={styles.input}
                placeholder="Altura (m)"
                keyboardType="numeric"
                value={altura}
                onChangeText={setAltura}
            />

            <Pressable style={styles.button} onPress={calcularIMC}>
                <Text style={styles.buttonText}>Calcular</Text>
            </Pressable>

            {resultado && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>IMC: {resultado}</Text>
                    <Text style={styles.resultText}>Classificação: {classificacao}</Text>
                </View>
            )}
        </View>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 18,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '80%',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default CalculoIMC;
