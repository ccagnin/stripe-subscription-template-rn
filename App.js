import { StripeProvider } from '@stripe/stripe-react-native'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Payment from './components/Payments';

const stripe_key = process.env.STRIPE_KEY;

export default function App() {
  return (
    <View style={styles.container}>
      <StripeProvider publishableKey={stripe_key} />
      <Payment />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
