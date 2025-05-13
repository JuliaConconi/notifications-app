import React, {useState} from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import * as ImagePicker from 'expo-image-picker';
import AWS from 'aws-sdk';
import s3 from '../../src/screens/awsConfig';
import * as Notifications from 'expo-notifications';


const registerUser = async (email, password, name, imageUri) => {
    const auth = getAuth(getApp());
    const firestore = getFirestore(getApp());
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
  
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const filePath = `profile_images/${user.uid}/${filename}`;
  
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: filePath,
        Body: blob,
        ContentType: "image/jpeg",
      };
  
      const uploadResult = await s3.upload(uploadParams).promise();
      const photoURL = uploadResult	.Location;
  
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: email,
        nome: name,
        photoURL: photoURL,
      });
  
      console.log("Usuário registrado e imagem salva no S3");
      return user;
    } catch (error) {
      console.error("Erro ao registrar usuário: ", error);
      Alert.alert("Erro", "Não foi possível registrar o usuário.");
    }
  };
  
export default function Cadastro({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [imageUri, setImageUri] = useState("null");
}

    const pickImage = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled){
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        if (email && password && nome && imageUri) {
            await registerUser(email, password, nome, imageUri);
            Alert.alert("Sucessc", "Usuário registrado com sucesso.");
        } else{
            Alert.alert("Erro", "Por favor, preencha todos os campos corretamente.")
        }
    };