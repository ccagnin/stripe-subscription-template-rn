import { View, TextInput, Alert, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaymentSheet, StripeProvider } from "@stripe/stripe-react-native";

const Payments = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false); // novo estado para indicar se o pagamento está sendo inicializado
  const {initPaymentSheet, presentPaymentSheet} = usePaymentSheet();

  useEffect(() => {
    initPayment();
  }, []);

  const initPayment = async () => {
    setLoadingPayment(true); // Indicar que o pagamento está sendo inicializado
    const {setupIntent, ephemeralKey, customer} = await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      merchantDisplayName: 'Pine App',
      allowsDelayedPaymentMethods: true,
      returnURL: 'example://stripe-redirect',
    });
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setReady(true); // Definir ready como verdadeiro após o pagamento ser inicializado com sucesso
    }
    setLoadingPayment(false); // Indicar que o pagamento foi inicializado
  };

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch('http://192.168.15.2:4000/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      console.log('response', response);

      if (!response.ok) {
        throw new Error('Failed to fetch payment sheet params');
      }

      const { setupIntent, ephemeralKey, customer } = await response.json();
      console.log('setupIntent', setupIntent);

      return {
        setupIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error('Erro ao buscar parâmetros do pagamento:', error);
      throw error; // Re-lança o erro para que possa ser tratado no componente que chamou a função
    }
  }

  const createSubscription = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Payment successfully processed');
    }
  }

  return (
    <View>
      <StripeProvider publishableKey={process.env.STRIPE_KEY}>
        <TextInput
      value={name}
      onChangeText={text => setName(text)}
      placeholder='Name'
      style={{
        width: 300,
        fontSize: 20,
        padding: 10,
        borderWidth: 1
      }} />
      <TextInput value={email}
        onChangeText={text => setEmail(text)}
        style={{
          width: 300,
          fontSize: 20,
          padding: 10,
          borderWidth: 1}} />
      {loadingPayment ? ( // Exibir indicador de carregamento se o pagamento estiver sendo inicializado
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title='Subscribe'
          onPress={createSubscription}
          disabled={!ready} // Desabilita o botão se o pagamento não estiver pronto
        />
      )}
      </StripeProvider>
    </View>
  )
}

CardFormStyle = {
  width: '90%',
  height: 35,
  marginBottom: 30,
}

export default Payments
