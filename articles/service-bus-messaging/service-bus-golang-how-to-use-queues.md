---
title: Get started with Azure Service Bus queues (Golang)
description: This tutorial shows you how to send messages to and receive messages from Azure Service Bus queues using the Golang programming language.
documentationcenter: golang
author: ankur021188
ms.date: 04/11/2023
ms.topic: quickstart
ms.devlang: golang
---

# Send messages to and receive messages from Azure Service Bus queues (Golang)
> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-get-started-with-queues.md)
> * [Java](service-bus-java-how-to-use-queues.md)
> * [JavaScript](service-bus-nodejs-how-to-use-queues.md)
> * [Python](service-bus-python-how-to-use-queues.md)
> * [Golang](service-bus-golang-how-to-use-queues.md)


In this tutorial, you complete the following steps: 

1. Create a Service Bus namespace, using the Azure portal.
1. Create a Service Bus queue, using the Azure portal.
1. Write Golang code to use the [azure-servicebus](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus) package to:
    1. Send a set of messages to the queue.
    1. Receive those messages from the queue.

> [!NOTE]
> This quick start provides step-by-step instructions for a simple scenario of sending messages to a Service Bus queue and receiving them. You can find pre-built JavaScript and TypeScript samples for Azure Service Bus in the [Azure SDK for Go repository on GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azservicebus).


## Prerequisites

If you're new to the service, see [Service Bus overview](service-bus-messaging-overview.md) before you do this quickstart.

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).

- Go version 1.18 or [above](https://go.dev/dl/) or higher

### [Passwordless (Recommended)](#tab/passwordless)

To use this quickstart with your own Azure account:
* Install [Azure CLI](/cli/azure/install-azure-cli), which provides the passwordless authentication to your developer machine.
* Sign in with your Azure account at the terminal or command prompt with `az login`. 
* Use the same account when you add the appropriate data role to your resource.
* Run the code in the same terminal or command prompt.
* Note the **queue** name for your Service Bus namespace. You'll need that in the code. 

### [Connection string](#tab/connection-string)

Note the following, which you'll use in the code below:
* Service Bus namespace **connection string** 
* Service Bus namespace **queue** you created

---

>[!NOTE]
> This tutorial works with samples that you can copy and run using Python. For instructions on how to create a Golang application, see [Create and deploy a Go application to an Azure Website](../app-service/quickstart-golang.md). For more information about installing packages used in this tutorial.
[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-queue-portal](./includes/service-bus-create-queue-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]


## Use go get to install packages

1. Install the following packages: 

    ```bash
    go mod init service-bus-go-how-to-use-queues

    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity

    go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus
    ```

---

## Send messages to a queue

The following sample code shows you how to send a message to a queue. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/), create a file *send.go*, and add the following code into it.

### [Connection string](#tab/connection-string)

1. Add import statements.

    ```golang
    package main

    import (
      "context"
      "fmt"
      "strconv"

      "github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
    )
    ```
    
1. Add constants. 

    ```golang
    CONNECTION_STR = "CONNECTION_STR"
    TOPIC_NAME = "TOPIC_NAME"
    SUBSCRIPTION_NAME = "SUBSCRIPTION_NAME"
    ```

    > [!IMPORTANT]
    > - Replace `CONNECTION_STR` with the connection string for your Service Bus namespace.
    > - Replace `TOPIC_NAME` with the name of the topic.
    > - Replace `SUBSCRIPTION_NAME` with the name of the subscription.    
    
1. Add a method to send a single message.

    ```golang
    func send_single_message(sender *azservicebus.Sender) {
      //Create a Service Bus message
      message := &azservicebus.Message{
        Body: []byte("Single Message"),
      }
      //send the message to the topic
      err := sender.SendMessage(context.TODO(), message, nil)
      if err != nil {
        panic(err)
      }
      fmt.Println("Sent a single message")
    }
    ```
1. Add a method to send a batch of messages.

    ```golang
    func send_batch_message(sender *azservicebus.Sender) {
      //Create a batch of messages
      batch, err := sender.NewMessageBatch(context.TODO(), nil)
      if err != nil {
        panic(err)
      }
      for i := 1; i <= 10; i++ {
        message := &azservicebus.Message{
          Body: []byte(strconv.Itoa(i) + ") Message in list"),
        }
        //Add a message to the batch
        err = batch.AddMessage(message, nil)
        if err != nil {
          panic(err)
        }
      }
      //Send the batch of messages to the topic
      err = sender.SendMessageBatch(context.TODO(), batch, nil)
      if err != nil {
        panic(err)
      }
      fmt.Println("Sent a batch of 10 messages")
    }
    ```

1. Create a Service Bus client and then a queue sender object to send messages.

    ```golang
    func main() {
      // create a Service Bus client using the connection string
      servicebus_client, err := azservicebus.NewClientFromConnectionString(CONNECTION_STR, nil)
      if err != nil {
        panic(err)
      }
      //Get a Topic Sender object to send messages to the topic
      sender, err := servicebus_client.NewSender(TOPIC_NAME, nil)
      if err != nil {
        panic(err)
      }
      defer sender.Close(context.TODO())
      //Send one message
      send_single_message(sender)
      //Send a batch of messages
      send_batch_message(sender)
      fmt.Println("Done sending messages")
      fmt.Println("-----------------------")
    }
    ```
 
1. run the following go run command to run the app.

    ```bash
    go run send.go
    ```

---
You should see the following output: 
```console
Sent a single message
Sent a batch of 10 messages
Done sending messages
-----------------------
```

## Receive messages from a queue

The following sample code shows you how to receive messages from a queue.

Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/), create a file *recv.go*, and add the following code into it.

### [Connection string](#tab/connection-string)

1. Similar to the send sample, add `import` statements and define constants that you should replace with your own values.

    ```golang
    package main

    import (
      "context"
      "fmt"
      "strconv"

      "github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
    )
    ```
    
1. Create a Service Bus client and then a queue receiver object to receive messages.

   ```golang
    func main() {
      // create a Service Bus client using the connection string
      servicebus_client, err := azservicebus.NewClientFromConnectionString(CONNECTION_STR, nil)
      if err != nil {
        panic(err)
      }
      //get the Subscription Receiver object for the subscription
      receiver, err := servicebus_client.NewReceiverForSubscription(TOPIC_NAME, SUBSCRIPTION_NAME, nil)
      if err != nil {
        panic(err)
      }
      defer receiver.Close(context.TODO())
      messages, err := receiver.ReceiveMessages(context.TODO(), 40, nil)
      for _, message := range messages {
        fmt.Println("Received: " + string(message.Body))
        //complete the message so that the message is removed from the subscription
        err = receiver.CompleteMessage(context.TODO(), message, nil)
        if err != nil {
          panic(err)
        }
	   }
    }
    ``` 
1. run the following go run command to run the app.

    ```bash
    go run send.go
    ```

---

You should see the following output: 

```console
Received: Single Message
Received: 1) Message in list
Received: 2) Message in list
Received: 3) Message in list
Received: 4) Message in list
Received: 5) Message in list
Received: 6) Message in list
Received: 7) Message in list
Received: 8) Message in list
Received: 9) Message in list
Received: 10) Message in list
```

In the Azure portal, navigate to your Service Bus namespace. On the **Overview** page, verify that the **incoming** and **outgoing** message counts are 16. If you don't see the counts, refresh the page after waiting for a few minutes. 

:::image type="content" source="./media/service-bus-python-how-to-use-queues/overview-incoming-outgoing-messages.png" alt-text="Incoming and outgoing message count":::

Select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You can also see the **incoming** and **outgoing** message count on this page. You also see other information such as the **current size** of the queue and **active message count**. 

:::image type="content" source="./media/service-bus-python-how-to-use-queues/queue-details.png" alt-text="Queue details":::


## Next steps
For more information, check out the following links:

- [Azure Service Bus SDK for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus)
- [Azure Service Bus SDK for Go on GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azservicebus)
