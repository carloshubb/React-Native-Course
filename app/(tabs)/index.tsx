import { Link } from "expo-router";
import { Button, Text, View } from "react-native";
import { useAuth } from "../../lib/auth-context";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Sign Out" onPress={signOut} />
      <Link href="/login" style={{ marginTop: 20, fontSize: 18 }}>
        Go to Login
      </Link>
    </View>
  );
}
