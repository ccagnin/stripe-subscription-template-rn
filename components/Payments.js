import { View, Alert, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaymentSheet, StripeProvider } from "@stripe/stripe-react-native";
import { useRoute } from '@react-navigation/native';

const api_key = process.env.STRIPE_KEY;

const Payments = () => {
  // Definição dos estados locais
  const [ready, setReady] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = usePaymentSheet();
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Obtenção dos parâmetros da rota, esses parâmetros são passados pelas telas anteriores
  const route = useRoute();
  const { userId, name, email, price_id } = route.params;

  // Efeito para inicializar o pagamento ao carregar a tela
  useEffect(() => {
    initPayment();
  }, []);

  // Função para inicializar o pagamento
  const initPayment = async () => {
    setLoadingPayment(true);
    // Obtenção dos parâmetros do pagamento do servidor backend
    const {setupIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
    // Inicialização da sessão de pagamento com o Stripe
    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      merchantDisplayName: 'Pine App',
      allowsDelayedPaymentMethods: true,
      returnURL: 'example://stripe-redirect',
    });
    if (error) {
      // Exibição de alerta em caso de erro
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setReady(true); // Marca o pagamento como pronto
    }
    setLoadingPayment(false); // Marca o pagamento como carregado
  };

  // Função para obter os parâmetros do pagamento do servidor backend
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch('http://192.168.15.2:4000/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Corpo da requisição com os parâmetros do usuário
        body: JSON.stringify({
          name,
          email,
          price_id,
        }),
      });

      console.log('response', response);

      if (!response.ok) {
        throw new Error('Erro ao buscar parâmetros do pagamento');
      }

      // Extração dos parâmetros da resposta da requisição
      const { setupIntent, ephemeralKey, customer, subscriptionId } = await response.json();
      setSubscriptionId(subscriptionId);

      return {
        setupIntent,
        ephemeralKey,
        customer,
        subscriptionId,
      };
    } catch (error) {
      console.error('Erro ao buscar parâmetros do pagamento:', error);
      throw error;
    }
  }

  // Função para criar a assinatura ao pressionar o botão "Subscribe"
  const createSubscription = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      try {
        await saveSubscription(subscriptionId);
        Alert.alert('Success', 'Payment successfully processed');
      } catch (error) {
        console.error('Erro ao salvar a assinatura:', error);
        Alert.alert('Error', 'Failed to save subscription');
      }
    }
  };

  // Função para salvar a assinatura no servidor backend e associar o subscriptionId ao ID do usuário
  const saveSubscription = async (subscriptionId) => {
    try {
      const response = await fetch('http://rota.com/save-subscription', { //Essa rota é a da API principal, não da API de pagamentos
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          userId: userId,
        }),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar a assinatura no banco de dados');
      }
    } catch (error) {
      console.error('Erro ao salvar a assinatura no banco de dados:', error);
      throw error;
    }
  };

  // Renderização da tela de pagamento
  return (
    <View>
      <StripeProvider publishableKey="pk_test_51Or2CoJb0HiN0pQ4JmPUUk5Xa2MO4kCsMTT7UcodyNt8Nigd8SoB5IO1egCTWOrVUDk0VbygKybfbCtm38RUid4y00dPJP7Iio">
        {loadingPayment ? ( // Indicador de carregamento enquanto o pagamento está sendo inicializado
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

export default Payments;
