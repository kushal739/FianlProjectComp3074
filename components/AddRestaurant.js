import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Picker, FlatList, TouchableOpacity } from 'react-native';

const AddRestaurant = ({ navigation, route }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [restaurantRating, setRestaurantRating] = useState('');

  const { onAddRestaurant, restaurants } = route.params || {};
  const fieldTags = ['None', 'Vegetarian', 'Vegan', 'Organic', 'Italian', 'Thai'];

  const toggleTag = (tag) => {
    const isSelected = selectedTags.includes(tag);
    const newSelectedTags = isSelected
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
  };

  const handleAddRestaurant = () => {
    if (!restaurantName || selectedTags.length === 0) {
      alert('Please enter restaurant name and tags.');
      return;
    }

    const rating = parseFloat(restaurantRating);

    if (isNaN(rating) || rating <= 0 || rating >= 5) {
      alert('Please enter a valid rating between 0 and 5.');
      return;
    }

    const newRestaurant = {
      id: (restaurants.length + 1).toString(),
      name: restaurantName,
      tags: selectedTags,
      rating: rating,
    };

    onAddRestaurant(newRestaurant);
    navigation.goBack();
  };

  const handleBackToHome = () => {
    navigation.goBack();
  };

  const renderTagItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tagItem, selectedTags.includes(item) && styles.selectedTagItem]}
      onPress={() => toggleTag(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>Add Restaurant</Text>
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name"
        value={restaurantName}
        onChangeText={(text) => setRestaurantName(text)}
      />
      <Text>Select Tags:</Text>
      <FlatList
        data={fieldTags}
        keyExtractor={(item) => item}
        renderItem={renderTagItem}
        vertical
      />
      <TextInput
        style={styles.input}
        placeholder="Restaurant Rating"
        value={restaurantRating}
        onChangeText={(text) => setRestaurantRating(text)}
      />
      <Button title="Add Restaurant" onPress={handleAddRestaurant} />
      <View style={styles.space} />
      <Button title="Back" onPress={handleBackToHome} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    width: 200,
  },
  tagItem: {
    backgroundColor: '#eee',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedTagItem: {
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  space: {
    height: 10,
  },
});

export default AddRestaurant;
