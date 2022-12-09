//save favourite movies to local storage and retrieve them

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFavourites = async () => {
  try {
    const favouriteMovies = await AsyncStorage.getItem("@favouriteMovies");
    return favouriteMovies ? JSON.parse(favouriteMovies) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const saveFavourite = async (movie) => {
  try {
    const favouriteMovies = await getFavourites();
    const newFavouriteMovies = [...favouriteMovies, movie];
    await AsyncStorage.setItem(
      "@favouriteMovies",
      JSON.stringify(newFavouriteMovies)
    );
  } catch (e) {
    console.log(e);
  }
};

export const removeFavourite = async (id) => {
  try {
    const favouriteMovies = await getFavourites();
    const newFavouriteMovies = favouriteMovies.filter((m) => m.id !== id);
    await AsyncStorage.setItem(
      "@favouriteMovies",
      JSON.stringify(newFavouriteMovies)
    );
  } catch (e) {
    console.log(e);
  }
};

//check if movie is in favourites
export const isFavourite = async (id) => {
  const favouriteMovies = await getFavourites();
  const fav = favouriteMovies.find((m) => m.id === id);
  return fav ? true : false;
};
