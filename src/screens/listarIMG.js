import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Image, ActivityIndicator } from "react-native";
import s3 from './awsConfig';

const BUCKET_NAME = "bucket-storage-senai-13";
const FOLDER = "imagens/";

export default function ListarImagens({ navigation }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await s3.listObjectsV2({
          Bucket: BUCKET_NAME,
          Prefix: FOLDER,
        }).promise();

        const imageFiles = response.Contents.filter((file) => file.Key.match(/\.(jpg|jpeg|png)$/));
        const imageURLs = imageFiles.map((file) => ({
          name: file.Key.split("/").pop(),
          url: `https://${BUCKET_NAME}.s3.amazonaws.com/${file.Key}`,
        }));

        setImages(imageURLs);
      } catch (error) {
        console.error("Erro ao listar imagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#4A90E2" style={styles.loading} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Imagens</Text>
      <View style={styles.line} />
      <View style={styles.gallery}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image.url }} style={styles.image} />
            <Text style={styles.imageName}>{image.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 15,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  imageContainer: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageName: {
    textAlign: "center",
    padding: 8,
    fontSize: 14,
    color: "#555",
    backgroundColor: "#f9f9f9",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
});