import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, Pressable, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {  
  getAuth,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import app from '../../firebaseConfig';
import s3 from './awsConfig';
import * as Notifications from 'expo-notifications';

const S3_BUCKET = 'bucket-app-firestore';

const EditarPerfil = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore(app);
  const user = auth.currentUser;
  const userDocRef = doc(db, 'users', user.uid);

  const [nome, setNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [fotoAtual, setFotoAtual] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setNome(userDoc.data().nome);
        setNovoEmail(user.email);
        setFotoAtual(userDoc.data().photoURL);
      }
    };

    fetchUserData();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const filePath = `profile_images/${user.uid}/${filename}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: filePath,
        Body: blob,
        ContentType: "image/jpeg"
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      const photoURL = uploadResult.Location;

      await updateDoc(userDocRef, { photoURL });
      setFotoAtual(photoURL);

      Alert.alert("Sucesso", "Foto de perfil atualizada.");
    } catch (error) {
      console.error("Erro ao enviar imagem: ", error);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const credential = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, credential);

      await updateDoc(userDocRef, { nome });

      if (novoEmail !== user.email) {
        await updateEmail(user, novoEmail);
      }

      if (novaSenha) {
        await updatePassword(user, novaSenha);
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar o perfil: ", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar o perfil.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
        {fotoAtual ? (
          <Image source={{ uri: fotoAtual }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </TouchableOpacity>

      <Text style={styles.selectText}>Selecionar Foto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={novoEmail}
        onChangeText={setNovoEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
      />

      <Pressable style={styles.button1} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F8F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFFAFA',
    borderRadius: 5,
    marginBottom: 10,
  },
  button1: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
  },
  selectText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#007bff',
    textAlign: 'center',
    margin: 8,
  },
});

export default EditarPerfil;
