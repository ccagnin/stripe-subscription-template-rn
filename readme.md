## Método `Payments`

O método `Payments` é o componente principal responsável por gerenciar a tela de pagamento. Utiliza hooks do React como `useState` e `useEffect` para controlar o estado da tela e suas interações com o usuário.

### Estado Local

- `ready`: Controla se o pagamento está pronto para ser inicializado.
- `loadingPayment`: Indica se o pagamento está sendo inicializado.
- `subscriptionId`: Armazena o ID da assinatura do usuário.

### Método `initPayment`

Este método é chamado no início para inicializar o processo de pagamento. Ele obtém os parâmetros vindo da requisição do backend, chamando o `fetchPaymentSheetParams`, para iniciar a sessão de pagamento com o Stripe. O parametro `returnURL` é obrigatório mas não necessariamente precisa ser passado um verdadeiro pois não irá redirecionar para o mesmo.

### Método `fetchPaymentSheetParams`

Este método é responsável pela requisição que vai obter os parâmetros do pagamento do servidor backend e passar para o `initPayment` Ele envia uma solicitação POST para o endpoint `/pay` do serviço de pagamentos e trata a resposta, extraindo os parâmetros necessários para a sessão de pagamento. Nele também obtemos o `subscriptionId` que é o ID da assinatura do usuário, precisaremos dela no front apenas para salvar a associar a assinatura ao usuário no serviço principal da aplicação.

### Método `createSubscription`

Quando o usuário pressiona o botão "Subscribe", este método é chamado para iniciar o processo de criação da assinatura. Ele utiliza a função `presentPaymentSheet` do Stripe para iniciar a tela de pagamento e lida com erros caso ocorram durante o processo. o PaymentSheet é uma tela de pagamento que é exibida ao usuário para que ele possa inserir os dados do cartão de crédito e concluir a assinatura, ele é uma tela padrão do Stripe e quem controla o seu comportamento é o próprio Stripe.

### Método `saveSubscription`

Após o usuário concluir o processo de pagamento, este método é chamado para salvar o ID da assinatura no servidor backend. Ele envia uma solicitação POST para o endpoint `/save-subscription` do serviço principal, com o ID da assinatura e o ID do usuário, e trata os erros caso ocorram durante o processo.
