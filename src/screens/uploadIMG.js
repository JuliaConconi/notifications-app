import React, { useState } from "react";
import { Pressable, Image, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import s3 from "./awsConfig";

const S3_BUCKET = "bucket-storage-senai-13";

const UploadImagens = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos da permissão para acessar suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("Erro", "Nenhuma imagem selecionada.");
      return;
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `imagens/${Date.now()}.jpg`;
      const params = {
        Bucket: S3_BUCKET,
        Key: filename,
        Body: blob,
        ContentType: "image/jpeg",
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Erro no upload:", err);
          Alert.alert("Erro", "Falha no envio da imagem.");
        } else {
          console.log("Imagem disponível em:", data.Location);
          Alert.alert("Sucesso", "Imagem salva com sucesso!");
          setImageUri(null);
        }
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro", "Falha no envio da imagem.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload de Imagens</Text>

      <Pressable style={styles.button} onPress={escolherImagem}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </Pressable>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Pressable style={[styles.button, styles.uploadButton]} onPress={() => navigation.navigate('uploadImage')}>
        <Text style={styles.buttonText}>Enviar Imagem</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: "#00b894",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: '200',
    height: 'auto',
    marginTop: 20,
    borderRadius: 10,
    borderColor: "#ccc",
  },
});

export default UploadImagens;


