import { Camera, CameraType } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function App() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const camRef = useRef(null);

    const toggleCameraType = () => {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
    };

    async function takePicture() {
        if (camRef) {
            const data = await camRef.current.takePictureAsync();
            setPhoto(data.uri);
            setOpenModal(true);
        }
    }

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            requestPermission(status === "granted");
        })();
    }, []);

    if (permission === null) {
        return <View />;
    }

    if (permission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={camRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraType}
                    >
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={takePicture}
                    >
                        <FontAwesome name="camera" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </Camera>
            {photo && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={openModal}
                >
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setOpenModal(false)}
                        >
                            <FontAwesome name="close" size={50} color="#fff" />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: photo }}
                            style={styles.modalImage}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    cameraButton: {
        alignItems: "center",
        position: "absolute",
        bottom: 50,
        left: 80,
        justifyContent: "center",
        backgroundColor: "white",
        margin: 20,
        height: 60,
        width: 60,
        borderRadius: 50,
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
    },
    modalButton: {
        position: "absolute",
        top: 10,
        left: 2,
        margin: 10,
    },
    modalImage: {
        width: "100%",
        height: 400,
    },
});
