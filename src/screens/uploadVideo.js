import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import s3 from "./awsConfig";

const S3_BUCKET = "bucket-app-firestore";

export default function UploadVideo({ navigation }) {
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*"],
        copyToCacheDirectory: true,
      });

      const asset =
        result.assets && result.assets.length > 0 ? result.assets[0] : result;

      if (asset && asset.uri) {
        setVideo({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "video/mp4",
        });
        setModalVisible(true); 
      } else {
        Alert.alert("Erro", "Nenhum vídeo selecionado.");
      }
    } catch (error) {
      console.error("Erro ao selecionar vídeo: ", error);
      Alert.alert("Erro", "Não foi possível selecionar o vídeo.");
    }
  };

  const handleUploadVideo = async () => {
    if (!video) {
      Alert.alert("Erro", "Por favor, selecione um vídeo");
      return;
    }

    if (!category.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome de categoria.");
      return;
    }

    try {
      setUploading(true);
      console.log("Iniciando upload de vídeo...", video);

      const response = await fetch(video.uri);
      const blob = await response.blob();
      const filePath = `videos/${category}/${Date.now()}_${video.name}`;

      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: filePath,
        Body: blob,
        ContentType: video.type,
      };

      s3.upload(uploadParams, (err, data) => {
        setUploading(false);
        if (err) {
          console.error("Erro no upload: ", err);
          Alert.alert("Erro", "Falha no envio do vídeo");
        } else {
          console.log("Vídeo enviado! URL: ", data.Location);
          Alert.alert("Sucesso", "Vídeo enviado com sucesso!");
          setVideo(null);
          setCategory("");
          setModalVisible(false);
        }
      });
    } catch (error) {
      console.error("Erro no upload: ", error);
      Alert.alert("Erro", "Falha no envio do vídeo");
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Pressable style={styles.button} onPress={pickVideo}>
            <Text style={styles.buttonText}>Escolha um vídeo</Text>
        </Pressable>
      {/* <Button title="Selecionar Vídeo" onPress={pickVideo} /> */}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Digite a categoria:</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: aula, tutorial..."
          />

          <View style={styles.modalButtons}>
            <Pressable style={styles.button} onPress={handleUploadVideo}>
              <Text style={styles.buttonText}>
                {uploading ? "Enviando..." : "Enviar"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setVideo(null);
                setCategory("");
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modalView: {
    marginTop: "50%",
    marginHorizontal: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 500,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});