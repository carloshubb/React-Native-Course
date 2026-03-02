import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../lib/auth-context";

export default function AutoScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6  characters long.");
      return;
    }

    // perform sign up / sign in depending on mode
    setError(null);
    try {
      if (isSignUp) {
        const signupError = await signUp(email, password);
        if (signupError) {
          setError(signupError);
          return;
        }
      } else {
        const signinError = await signIn(email, password);
        if (signinError) {
          setError(signinError);
          return;
        }
      }

      // navigate to a protected route or home after successful auth
      router.replace("/");
    } catch (err) {
      // just in case, although signUp/signIn already return messages
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          label="password"
          placeholder="Enter your password"
          autoCapitalize="none"
          secureTextEntry={true}
          keyboardType="default"
          mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
        />
        {error && (
          <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
        )}
        <Button style={styles.button} mode="contained" onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <Button
          mode="text"
          onPress={handleSwitchMode}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  } as ViewStyle,
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  switchModeButton: {
    marginTop: 8,
  },
});
