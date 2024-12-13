import { Modal, View, Text, Button, StyleSheet, Platform } from 'react-native';

const CustomModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent,
          Platform.OS === 'ios' ? styles.modalIOS : styles.modalAndroid
        ]}>
          <Text style={styles.modalText}>
            Tem certeza que deseja criar essa watchlist?
          </Text>
          <View style={styles.buttonContainer}>
            <Button 
              title="Sim" 
              onPress={onConfirm}
              color="#9b7db8"
            />
            <View style={styles.buttonSpacer} />
            <Button 
              title="Não" 
              onPress={onCancel}
              color="#9b7db8" 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 500,
    alignItems: 'center',
  },
  modalIOS: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalAndroid: {
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: Platform.OS === 'ios' ? 'row' : 'column',
    width: '100%',
    justifyContent: 'center',
  },
  buttonSpacer: {
    width: Platform.OS === 'ios' ? 20 : 0,
    height: Platform.OS === 'ios' ? 0 : 10,
  },
});

export default CustomModal;