---
title: Get started with Azure Service Bus queues (Go)
description: This tutorial shows you how to send messages to and receive messages from Azure Service Bus queues using the Go programming language.
documentationcenter: go 
author: Duffney 
ms.author: jduffney 
ms.date: 04/19/2022
ms.topic: quickstart
ms.devlang: golang
ms.custom: devx-track-go
---

# Send messages to and receive messages from Azure Service Bus queues (Go)
> [!div class="op_single_selector" title1="Select the programming language:"]
> * [Go](service-bus-go-how-to-use-queues.md)
> * [C#](service-bus-dotnet-get-started-with-queues.md)
> * [Java](service-bus-java-how-to-use-queues.md)
> * [JavaScript](service-bus-nodejs-how-to-use-queues.md)
> * [Python](service-bus-python-how-to-use-queues.md)

In this tutorial, you'll learn how to send messages to and receive messages from Azure Service Bus queues using the Go programming language.

Azure Service Bus is a fully managed enterprise message broker with message queues and publish/subscribe capabilities. Service Bus is used to decouple applications and services from each other, providing a distributed, reliable, and high performance message transport.

The Azure SDK for Go's [azservicebus](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus) package allows you to send and receive messages from Azure Service Bus and using the Go programming language. 

By the end of this tutorial, you'll be able to: send a single message or batch of messages to a queue, receive messages, and dead-letter messages that aren't processed.

## Prerequisites

- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue.
- Go version 1.18 or [above](https://go.dev/dl/)


## Create the sample app

To begin, create a new Go module.

1. Create a new directory for the module named `service-bus-go-how-to-use-queues`.
1. In the `azservicebus` directory, initialize the module and install the required packages.
  
    ```bash
    go mod init service-bus-go-how-to-use-queues

    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    
    go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus
    ```
1. Create a new file named `main.go`.

## Authenticate and create a client

In the `main.go` file, create a new function named `GetClient` and add the following code:

```go
func GetClient() *azservicebus.Client {
	namespace, ok := os.LookupEnv("AZURE_SERVICEBUS_HOSTNAME") //ex: myservicebus.servicebus.windows.net
	if !ok {
		panic("AZURE_SERVICEBUS_HOSTNAME environment variable not found")
	}

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		panic(err)
	}

	client, err := azservicebus.NewClient(namespace, cred, nil)
	if err != nil {
		panic(err)
	}
	return client
}
```

The `GetClient` function returns a new `azservicebus.Client` object that's created by using an Azure Service Bus namespace and a credential. The namespace is provided by the `AZURE_SERVICEBUS_HOSTNAME` environment variable. And the credential is created by using the `azidentity.NewDefaultAzureCredential` function. 

For local development, the `DefaultAzureCredential` used the access token from Azure CLI, which can be created by running the `az login` command to authenticate to Azure. 

> [!TIP]
> To authenticate with a connection string use the [NewClientFromConnectionString](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus#NewClientFromConnectionString) function.

## Send messages to a queue

In the `main.go` file, create a new function named `SendMessage` and add the following code:

```go
func SendMessage(message string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		panic(err)
	}
	defer sender.Close(context.TODO())

	sbMessage := &azservicebus.Message{
		Body: []byte(message),
	}
	err = sender.SendMessage(context.TODO(), sbMessage, nil)
	if err != nil {
		panic(err)
	}
}
```

`SendMessage` takes two parameters: a message string and a `azservicebus.Client` object. It then creates a new `azservicebus.Sender` object and sends the message to the queue. To send bulk messages, add the `SendMessageBatch` function to your `main.go` file.

```go
func SendMessageBatch(messages []string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		panic(err)
	}
	defer sender.Close(context.TODO())
	
	batch, err := sender.NewMessageBatch(context.TODO(), nil)
	if err != nil {
		panic(err)
	}

	for _, message := range messages {
		if err := batch.AddMessage(&azservicebus.Message{Body: []byte(message)}, nil); err != nil {
			panic(err)
		}
	}
	if err := sender.SendMessageBatch(context.TODO(), batch, nil); err != nil {
		panic(err)
	}
}
```

`SendMessageBatch` takes two parameters: a slice of messages and a `azservicebus.Client` object. It then creates a new `azservicebus.Sender` object and sends the messages to the queue.



## Receive messages from a queue

After you've sent messages to the queue, you can receive them with the `azservicebus.Receiver` type. To receive messages from a queue, add the `GetMessage` function to your `main.go` file.

```go
func GetMessage(count int, client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue("myqueue", nil) //Change myqueue to env var
	if err != nil {
		panic(err)
	}
	defer receiver.Close(context.TODO())

	messages, err := receiver.ReceiveMessages(context.TODO(), count, nil)
	if err != nil {
		panic(err)
	}

	for _, message := range messages {
		body := message.Body
		fmt.Printf("%s\n", string(body))

		err = receiver.CompleteMessage(context.TODO(), message, nil)
		if err != nil {
			panic(err)
		}
	}
}
```

`GetMessage` takes an `azservicebus.Client` object and creates a new `azservicebus.Receiver` object. It then receives the messages from the queue. The `Receiver.ReceiveMessages` function takes two parameters: a context and the number of messages to receive. The `Receiver.ReceiveMessages` function returns a slice of `azservicebus.ReceivedMessage` objects. 

Next, a `for` loop iterates through the messages and prints the message body. Then the `CompleteMessage` function is called to complete the message, removing it from the queue.

Messages that exceed length limits, are sent to an invalid queue, or aren't successfully processed can be sent to the dead letter queue. To send messages to the dead letter queue, add the `SendDeadLetterMessage` function to your `main.go` file.


```go
func DeadLetterMessage(client *azservicebus.Client) {
	deadLetterOptions := &azservicebus.DeadLetterOptions{
		ErrorDescription: to.Ptr("exampleErrorDescription"),
		Reason:           to.Ptr("exampleReason"),
	}

	receiver, err := client.NewReceiverForQueue("myqueue", nil)
	if err != nil {
		panic(err)
	}
	defer receiver.Close(context.TODO())

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		panic(err)
	}

	if len(messages) == 1 {
		err := receiver.DeadLetterMessage(context.TODO(), messages[0], deadLetterOptions)
		if err != nil {
			panic(err)
		}
	}
}
```

`DeadLetterMessage` takes an `azservicebus.Client` object and a `azservicebus.ReceivedMessage` object. It then sends the message to the dead letter queue. The function takes two parameters: a context and a `azservicebus.DeadLetterOptions` object. The `Receiver.DeadLetterMessage` function returns an error if the message fails to be sent to the dead letter queue.

To receive messages from the dead letter queue, add the `ReceiveDeadLetterMessage` function to your `main.go` file.

```go
func GetDeadLetterMessage(client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue(
		"myqueue",
		&azservicebus.ReceiverOptions{
			SubQueue: azservicebus.SubQueueDeadLetter,
		},
	)
	if err != nil {
		panic(err)
	}
	defer receiver.Close(context.TODO())

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		panic(err)
	}

	for _, message := range messages {
		fmt.Printf("DeadLetter Reason: %s\nDeadLetter Description: %s\n", *message.DeadLetterReason, *message.DeadLetterErrorDescription) //change to struct an unmarshal into it
		err := receiver.CompleteMessage(context.TODO(), message, nil)
		if err != nil {
			panic(err)
		}
	}
}
```

`GetDeadLetterMessage` takes a `azservicebus.Client` object and creates a new `azservicebus.Receiver` object with options for the dead letter queue. It then receives the messages from the dead letter queue. The function then receives one message from the dead letter queue. Then it prints the dead letter reason and description for that message.

## Sample code

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
)

func GetClient() *azservicebus.Client {
	namespace, ok := os.LookupEnv("AZURE_SERVICEBUS_HOSTNAME") //ex: myservicebus.servicebus.windows.net
	if !ok {
		panic("AZURE_SERVICEBUS_HOSTNAME environment variable not found")
	}

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		panic(err)
	}

	client, err := azservicebus.NewClient(namespace, cred, nil)
	if err != nil {
		panic(err)
	}
	return client
}

func SendMessage(message string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		panic(err)
	}
	defer sender.Close(context.TODO())

	sbMessage := &azservicebus.Message{
		Body: []byte(message),
	}
	err = sender.SendMessage(context.TODO(), sbMessage, nil)
	if err != nil {
		panic(err)
	}
}

func SendMessageBatch(messages []string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		panic(err)
	}
	defer sender.Close(context.TODO())

	batch, err := sender.NewMessageBatch(context.TODO(), nil)
	if err != nil {
		panic(err)
	}

	for _, message := range messages {
		err := batch.AddMessage(&azservicebus.Message{Body: []byte(message)}, nil)
		if errors.Is(err, azservicebus.ErrMessageTooLarge) {
			fmt.Printf("Message batch is full. We should send it and create a new one.\n")
		}
	}

	if err := sender.SendMessageBatch(context.TODO(), batch, nil); err != nil {
		panic(err)
	}
}

func GetMessage(count int, client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue("myqueue", nil) 
	if err != nil {
		panic(err)
	}
	defer receiver.Close(context.TODO())

	messages, err := receiver.ReceiveMessages(context.TODO(), count, nil)
	if err != nil {
		panic(err)
	}

	for _, message := range messages {
		body := message.Body
		fmt.Printf("%s\n", string(body))

		err = receiver.CompleteMessage(context.TODO(), message, nil)
		if err != nil {
			panic(err)
		}
	}
}

func DeadLetterMessage(client *azservicebus.Client) {
	deadLetterOptions := &azservicebus.DeadLetterOptions{
		ErrorDescription: to.Ptr("exampleErrorDescription"),
		Reason:           to.Ptr("exampleReason"),
	}

	receiver, err := client.NewReceiverForQueue("myqueue", nil)
	if err != nil {
		panic(err)
	}
	defer receiver.Close(context.TODO())

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		panic(err)
	}

	if len(messages) == 1 {
		err := receiver.DeadLetterMessage(context.TODO(), messages[0], deadLetterOptions)
		if err != nil {
			panic(err)
		}
	}
}

func GetDeadLetterMessage(client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue(
		"myqueue",
		&azservicebus.ReceiverOptions{
			SubQueue: azservicebus.SubQueueDeadLetter,
		},
	)
	if err != nil {
		panic(err)
	}
	defer receiver.Close(context.TODO())

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		panic(err)
	}

	for _, message := range messages {
		fmt.Printf("DeadLetter Reason: %s\nDeadLetter Description: %s\n", *message.DeadLetterReason, *message.DeadLetterErrorDescription) 
		err := receiver.CompleteMessage(context.TODO(), message, nil)
		if err != nil {
			panic(err)
		}
	}
}

func main() {
	client := GetClient()

	fmt.Println("send a single message...")
	SendMessage("firstMessage", client)

	fmt.Println("send two messages as a batch...")
	messages := [2]string{"secondMessage", "thirdMessage"}
	SendMessageBatch(messages[:], client)

	fmt.Println("\nget all three messages:")
	GetMessage(3, client)

	fmt.Println("\nsend a message to the Dead Letter Queue:")
	SendMessage("Send message to Dead Letter", client)
	DeadLetterMessage(client)
	GetDeadLetterMessage(client)
}

```

## Run the code

Before you run the code, create an environment variable named `AZURE_SERVICEBUS_HOSTNAME`. Set the environment variable's value to the Service Bus namespace.

# [Bash](#tab/bash)

```bash
export AZURE_SERVICEBUS_HOSTNAME=<YourServiceBusHostName>
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_SERVICEBUS_HOSTNAME=<YourServiceBusHostName>
```

---

Next, run the following `go run` command to run the app:

```bash
go run main.go
```

## Next steps
For more information, check out the following links:

- [Azure Service Bus SDK for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus)
- [Azure Service Bus SDK for Go on GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azservicebus)
