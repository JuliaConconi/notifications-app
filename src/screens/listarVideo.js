import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Video } from "expo-av";
import s3 from "../screens/awsConfig";

const BUCKET_NAME = "bucket-storage-senai-13";

export default function ListarVideosPorCategoria({ navigation }) {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await s3
        .listObjectsV2({
          Bucket: BUCKET_NAME,
          Prefix: "videos/",
          Delimiter: "/",
        })
        .promise();

      const folders =
        response.CommonPrefixes?.map((prefix) => {
          const folderPath = prefix.Prefix;
          return folderPath.replace("videos/", "").replace("/", "");
        }) || [];

      setCategories(folders);
      if (folders.length > 0) {
        setCategory(folders[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias: ", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchVideos = async () => {
    if (!category) return;

    setLoading(true);
    const prefix = `videos/${category}/`;

    try {
      const response = await s3
        .listObjectsV2({
          Bucket: BUCKET_NAME,
          Prefix: prefix,
        })
        .promise();

      const videoFiles =
        response.Contents?.filter(
          (file) => file.Size > 0 && !file.Key.endsWith("/")
        ) || [];

      const videoUrls = videoFiles.map((file) => ({
        key: file.Key,
        name: file.Key.split("/").pop(),
        url: `https://${BUCKET_NAME}.s3.amazonaws.com/${encodeURI(file.Key)}`,
      }));

      setVideos(videoUrls);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      fetchVideos();
    }
  }, [category]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Selecionar Categoria</Text>

      {loadingCategories ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          {categories.map((cat, index) => (
            <Picker.Item label={cat} value={cat} key={index} />
          ))}
        </Picker>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        videos.map((video, index) => (
          <View key={index} style={styles.videoContainer}>
            <Text style={styles.videoName}>{video.name}</Text>
            <Video
              source={{ uri: video.url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay={false}
              useNativeControls
              style={styles.video}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "stretch",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  videoContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  videoName: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  video: {
    width: "100%",
    height: 200,
  },
});
