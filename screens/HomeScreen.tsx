import { StyleSheet, Image, View, ScrollView } from "react-native";
import { Text } from "../components/Themed";
import { AppColors } from "../constants/AppColors";
import { RootTabScreenProps } from "../types";
import { Key } from "react";
import Badge from "../components/Badge";
import ListItem from "../components/ListItem";

const user = require("../data/user.json");

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View>
        <View style={styles.profileHeaderContainer}>
          <Image
            source={require("../assets/images/profile.jpg")}
            style={styles.profileHeaderImage}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.userName}>Malin</Text>
          <Text style={styles.eMail}>fin.ja@hotmail.com</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Deine Genres</Text>
            <View style={styles.genres}>
              {user.genres.map(
                (genre: string | undefined, index: Key | null | undefined) => (
                  <Badge key={index} text={genre} style={styles.genreBadge} />
                )
              )}
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Deine Top Künstler</Text>
            <View style={styles.artists}>
              {user.artists.map(
                (artist: string | undefined, index: Key | null | undefined) => (
                  <ListItem
                    key={index}
                    text={artist}
                    imageSource={require("../assets/images/profile2.jpeg")}
                  />
                )
              )}
            </View>
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
    height: "40%",
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
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  userName: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
    marginTop: 25,
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
  },
});
