import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const EditRestaurant = ({ route, navigation }) => {
  const { restaurant, onRemoveRestaurant, onEditRestaurant } = route.params;
  const [editedName, setEditedName] = useState(restaurant.name);
  const [editedTags, setEditedTags] = useState(restaurant.tags.join(', '));
  const [editedRating, setEditedRating] = useState(restaurant.rating.toString());
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

  const handleSaveChanges = () => {
    const editedRestaurant = {
      ...restaurant,
      name: editedName,
      tags: editedTags.split(',').map((tag) => tag.trim()),
      rating: parseInt(editedRating),
    };
    onEditRestaurant(editedRestaurant); // Add this line to handle editing the restaurant
    navigation.goBack();
  };

  const handleRemoveRestaurant = () => {
    setConfirmationModalVisible(true);
  };

  const confirmRemoveRestaurant = () => {
    onRemoveRestaurant(restaurant.id);
    navigation.goBack();
  };

  const cancelRemoveRestaurant = () => {
    setConfirmationModalVisible(false);
  };

  const handleBackToHome = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Edit Restaurant</Text>
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name"
        value={editedName}
        onChangeText={(text) => setEditedName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Restaurant Tags (comma-separated)"
        value={editedTags}
        onChangeText={(text) => setEditedTags(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Restaurant Rating"
        value={editedRating}
        onChangeText={(text) => setEditedRating(text)}
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
      <View style={styles.space} />
      <Button title="Remove Restaurant" onPress={handleRemoveRestaurant} color="red" />
      <View style={styles.space} />
      <Button title="Back" onPress={handleBackToHome} />
      <Modal
        transparent
        animationType="slide"
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to remove {restaurant.name}?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={confirmRemoveRestaurant}>
                <Text style={styles.confirmButton}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelRemoveRestaurant}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmButton: {
    color: 'red',
    fontSize: 16,
  },
  cancelButton: {
    color: 'blue',
    fontSize: 16,
  },
});

export default EditRestaurant;
