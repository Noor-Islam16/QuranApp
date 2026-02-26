import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const SplashScreen = ({ navigation }: any) => {
  const animationRef = useRef<LottieView>(null);

  const handleAnimationFinish = () => {
    navigation.replace("Main"); // ✅ Navigate after animation COMPLETES
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../../assets/Koran im Ramadan lesen.json")}
        autoPlay
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: width * 0.7,
    height: width * 0.7,
  },
});

export default SplashScreen;
