import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Lampada = () => {
    const [acesa, setAcesa] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: acesa ? '#FFFF00' : '#212121' }]}>
            <Text style={[styles.text, { color: acesa ? '#000' : '#fff' }]}>
                Lâmpada {acesa ? 'Acesa' : 'Apagada'}
            </Text>

            <Pressable style={styles.button} onPress={() => setAcesa(!acesa)}>
                <Text style={styles.buttonText}>Alternar</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Lampada;
