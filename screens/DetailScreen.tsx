import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Text } from "../components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

import ListItem from "../components/ListItem";
import PrimaryButton from "../components/PrimaryButton";
import Badge from "../components/Badge";
import { AppColors } from "../constants/AppColors";

import { useScrollToTop } from "@react-navigation/native";
import { Key } from "react";

const user = require("../data/user.json");

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function HomeScreen({ route, navigation }: Props | any) {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const [matchData, setMatchData] = useState<any>([]);
  const [topArtists, setTopArtists] = useState<any>([]);
  const [topGenres, setTopGenres] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);

  const profileId = route.params;

  useEffect(() => {
    const getMatchData = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      axios(`http://82.165.77.87:8080/api/profile/${profileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setMatchData(response.data);
          setTopArtists(response.data.topArtists);
          setTopGenres(response.data.topGenres);
        })
        .catch(error => {
          console.log("error", error.message);
        })
        .finally(() => setLoading(false));
    };
    getMatchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator style={styles.loading} />
  ) : (
    <View style={styles.scrollContainer}>
      <ScrollView ref={ref} style={styles.scrollContainer}>
        <View style={styles.profileHeaderContainer}>
          <SafeAreaView></SafeAreaView>
          <ImageBackground
            source={
              matchData.profilePictureUrl
                ? { uri: matchData.profilePictureUrl }
                : require("../assets/images/avatar.png")
            }
            style={styles.profileHeaderImage}
            imageStyle={{
              borderRadius: 30,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={AppColors.GREY_900}
            />
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.userName}>
            {matchData.name}, {matchData.age}
          </Text>
          <View style={styles.instaInfo}>
            <Ionicons
              name="logo-instagram"
              size={18}
              color={AppColors.GREY_500}
            />
            <Text style={styles.eMail}>{matchData.contactInfo}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Top Genres</Text>
            <View style={styles.genres}>
              {topGenres.map(
                (genre: string | undefined, index: Key | null | undefined) => (
                  <Badge key={index} text={genre} style={styles.genreBadge} />
                )
              )}
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Top Künstler</Text>
            <View style={styles.artists}>
              {topArtists.map(
                (artist: string | undefined, index: Key | null | undefined) => (
                  <ListItem
                    key={index}
                    text={artist}
                    imageSource={require("../assets/images/artist.jpg")}
                  />
                )
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title="Sag Hallo auf Instagram"
        style={styles.chatButton}
        onPress={() => {
          Linking.openURL(
            `instagram://user?username=${matchData.contactInfo}`
          ).catch(() => {
            Linking.openURL(
              `https://www.instagram.com/${matchData.contactInfo}`
            );
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  profileHeaderContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "transparent",
    shadowColor: "black",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  profileHeaderImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  backButton: {
    backgroundColor: "white",
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 10,
    borderColor: AppColors.GREY_300,
    borderWidth: 0.5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  userName: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
    marginTop: 25,
  },
  instaInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  eMail: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.GREY_500,
    marginLeft: 6,
  },
  infoContainer: {
    backgroundColor: "white",
    marginTop: 35,
  },
  genreHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
  },
  genres: {
    marginTop: 12,
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreBadge: {
    marginRight: 10,
    marginBottom: 10,
  },
  artists: {
    marginTop: 12,
    backgroundColor: "white",
    paddingBottom: 110,
  },
  chatButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: "90%",
  },
});
