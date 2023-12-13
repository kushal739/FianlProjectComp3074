import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RestaurantLinkScreen = () => {
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [modalRestaurant, setModalRestaurant] = useState(null);
  const [newRating, setNewRating] = useState(0);

  const fetchRestaurants = async () => {
    try {
      const storedRestaurants = await AsyncStorage.getItem('restaurants');
      if (storedRestaurants) {
        setRestaurants(JSON.parse(storedRestaurants));
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const saveRestaurants = async (updatedRestaurants) => {
    try {
      await AsyncStorage.setItem(
        'restaurants',
        JSON.stringify(updatedRestaurants)
      );
    } catch (error) {
      console.error('Error saving restaurants:', error);
    }
  };

  const handleRateRestaurant = (restaurant) => {
    setRatingModalVisible(true);
    setModalRestaurant(restaurant);
  };

  const handleShowMap = (restaurant) => {
    const {queryLocation} = getRestaurantLocation(restaurants);
    const url = `https://www.google.com/maps/search/?api=1&query=${queryLocation}`;

    Linking.openURL(url).catch((err) => {
      console.error('Error opening map:', err);
      Alert.alert('Error', 'Could not open map app for directions.');
    });
  };

  const handleGetDirections = (restaurant) => {
    const {restaurantLocation} = getRestaurantDirection(restaurants);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurantLocation}`;

    Linking.openURL(url).catch((err) => {
      console.error('Error opening map:', err);
      Alert.alert('Error', 'Could not open map app for directions.');
    });
  };

  const getRestaurantDirection = 
  (restaurants) => {
    return{
      restaurantLocation : "Chipotle+Mexican+Grill,+1072+Don+Mills+Rd.,+Toronto,+ON+M3C+0H`",
    }
  };
  
  const getRestaurantLocation = (restaurant) => {
    return {
      queryLocation : "Chipotle+Mexican+Grill"
    };
  };

  const handleRatingSubmit = () => {
    if (newRating >= 0 && newRating <= 5) {
      const updatedRestaurants = restaurants.map((r) =>
        r.id === modalRestaurant.id ? { ...r, rating: newRating } : r
      );

      setRestaurants(updatedRestaurants);
      setRatingModalVisible(false);
    } else {
      Alert.alert('Invalid Rating', 'Please enter a rating between 1 and 5.');
    }
  };

  const handleModalClose = () => {
    setRatingModalVisible(false);
  };

  const handleAddRestaurant = (newRestaurant) => {
    const updatedRestaurants = [...restaurants, newRestaurant];
    setRestaurants(updatedRestaurants);
    saveRestaurants(updatedRestaurants);
    navigation.goBack();
  };

  const handleBackToHome = () => {
    navigation.goBack();
  };

  const handleNavigateToAddRestaurant = () => {
    navigation.navigate('AddRestaurant', {
      onAddRestaurant: handleAddRestaurant,
      restaurants,
    });
  };

  const handleEditRestaurant = (editedRestaurant) => {
    const updatedRestaurants = restaurants.map((r) =>
      r.id === editedRestaurant.id ? editedRestaurant : r
    );

    setRestaurants(updatedRestaurants);
    saveRestaurants(updatedRestaurants);
    navigation.goBack();
  };

  const handleRemoveRestaurant = (restaurantId) => {
    console.log('Removing restaurant with ID:', restaurantId);

    const updatedRestaurants = restaurants.filter((r) => r.id !== restaurantId);

    console.log('Updated Restaurants:', updatedRestaurants);

    setRestaurants(updatedRestaurants);
    saveRestaurants(updatedRestaurants);
    console.log('Restaurant removed successfully.');
  };

  const handleEditResturant = (restaurant) => {
    navigation.navigate('EditRestaurant', {
      restaurant,
      onEditResturant: handleEditResturant,
      onRemoveRestaurant: handleRemoveRestaurant,
    });
  };

  const renderRestaurantItem = ({ item }) => (
    <View style={styles.restaurantItem}>
      <Text>{item.name}</Text>
      <Text>Tags: {item.tags.join(', ')}</Text>
      <Text>Rating: {item.rating}/5</Text>
      <View style={styles.space} />
      <Button
        title="Rate"
        onPress={() => handleRateRestaurant(item)}
        style={styles.button}
      />
      <View style={styles.space} />
      <Button
        title="Show Map"
        onPress={() => handleShowMap(item)}
        style={styles.button}
      />
      <View style={styles.space} />
      <Button
        title="Get Directions"
        onPress={() => handleGetDirections(item)}
        style={styles.button}
      />
      <View style={styles.space} />
      <Button
        title="Edit Restaurant"
        onPress={() => handleEditResturant(item)}
        style={styles.button}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>Restaurant Link Screen</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurantItem}
      />
      <Modal visible={ratingModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Rate {modalRestaurant?.name}</Text>
            <TextInput
              placeholder="Enter your rating (1-5)"
              keyboardType="numeric"
              value={newRating.toString()}
              onChangeText={(text) => setNewRating(parseInt(text))}
              style={styles.input}
            />
            <Button title="Submit" onPress={handleRatingSubmit} />
            <Button title="Cancel" onPress={handleModalClose} />
          </View>
        </View>
      </Modal>
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.fullButton, styles.button]}
          onPress={handleBackToHome}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity
          style={[styles.fullButton, styles.button]}
          onPress={handleNavigateToAddRestaurant}>
          <Text style={styles.buttonText}>Add Restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    marginVertical: 10,
  },
  space: {
    height: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    width: 200,
  },
  fullButton: {
    width: '100%',
    backgroundColor: '#007BFF',
    paddingVertical: 25,
    borderRadius: 5,
    paddingHorizontal: 100,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'Bold',
    fontSize: 16,
  },
  gap: {
    marginVertical: 10,
  },
});

export default RestaurantLinkScreen;
