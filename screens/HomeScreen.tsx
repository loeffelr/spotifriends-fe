import * as React from "react";
import { StyleSheet, Image, View, ScrollView } from "react-native";
import { Text } from "../components/Themed";
import { useScrollToTop } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { AppColors } from "../constants/AppColors";
import { RootTabScreenProps } from "../types";
import { Key } from "react";
import Badge from "../components/Badge";
import ListItem from "../components/ListItem";
import SecondaryButton from "../components/SecondaryButton";
import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

const user = require("../data/user.json");

export default function HomeScreen({ navigation }: any) {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const [usersData, setUsersData] = useState<any>([]);
  const [topArtists, setTopArtists] = useState<any>([]);
  const [topGenres, setTopGenres] = useState<any>([]);

  useEffect(() => {
    const getProfileData = async () => {
      const token = await SecureStore.getItemAsync("token");

      axios("http://192.168.178.26:8080/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setUsersData(response.data);
          setTopArtists(response.data.topArtists);
          setTopGenres(response.data.topGenres);
        })
        .catch(error => {
          console.log("error", error.message);
        });
    };
    getProfileData();
  }, []);

  return (
    <ScrollView ref={ref} style={styles.scrollContainer}>
      <View style={styles.profileHeaderContainer}>
        <Image
          source={{ uri: usersData.profilePictureUrl }}
          style={styles.profileHeaderImage}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.userData}>
          <View>
            <Text style={styles.userName}>
              {usersData.name}, {usersData.age}
            </Text>
            <Text style={styles.eMail}>{usersData.contactInfo}</Text>
          </View>
          <View>
            <SecondaryButton
              title="Ändern"
              onPress={() =>
                navigation.navigate("UserInfo", { isLogin: false })
              }
            />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.genreHeadline}>Deine Genres</Text>
          <View style={styles.genres}>
            {topGenres.map(
              (genre: any | undefined, index: Key | null | undefined) => (
                <Badge
                  key={index}
                  text={genre.name}
                  style={styles.genreBadge}
                />
              )
            )}
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.genreHeadline}>Deine Top Künstler</Text>
          <View style={styles.artists}>
            {topArtists.map((artist: any, index: Key | null | undefined) => (
              <ListItem
                key={index}
                text={artist.name}
                imageSource={{ uri: artist.imageUrl }}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  profileHeaderContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
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
    borderRadius: 30,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  contentContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  userData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  userName: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
  },
  eMail: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.GREY_500,
    marginTop: 8,
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
    paddingBottom: 20,
  },
});
