---
title: Get started with Azure Service Bus queues (Go)
description: This tutorial shows you how to send messages to and receive messages from Azure Service Bus queues using the Go programming language.
documentationcenter: go 
author: Duffney 
ms.author: jduffney 
ms.date: 04/19/2022
ms.topic: quickstart
ms.devlang: golang
---

# Send messages to and receive messages from Azure Service Bus queues (Python)
> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-get-started-with-queues.md)
> * [Java](service-bus-java-how-to-use-queues.md)
> * [JavaScript](service-bus-nodejs-how-to-use-queues.md)
> * [Python](service-bus-python-how-to-use-queues.md)
> * [Go](service-bus-go-how-to-use-queues.md)

In this tutorial, you will learn how to send messages to and receive messages from Azure Service Bus queues using the Go programming language.

Azure Service Bus is a fully managed enterprise message broker with message queues and publish/subscribe capabilities. Service bus is used to decouple applications and services from each other, providing a distributed, reliable, and high performance message transport. The Azure SDK for GO's [azservicebus](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus) package allows you to send and receive messages from Azure Service Bus and using the Go programming language.

By the end of this tutorial, you will be able to: send a single or bulk messages to a queue, recieve those message, and dead letter messages that are not processed.

## Prerequisites

- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue.
- Go version 1.18 or [above](https://go.dev/dl/)


## Create the sample app

To begin, create a new Go module.

1. Create a new directory for the module named `service-bus-go-how-to-use-queues`.
1. In the `azservicebus` directory, initalize the module and install the required packages.
  
    ```bash
    go mod init service-bus-go-how-to-use-queues

    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    
    go get github.com/Azure/azure-sdk-for-go/sdk/azservicebus
    ```
1. Next, create a new file named `main.go` with the following code:
  
     ```go
    package main

    import (
      "context"
      "fmt"
      "log"
      "os"

      "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
      "github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
    )

    func main() {

    }
    ```

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
		log.Fatalf("%v", err)
	}

	client, err := azservicebus.NewClient(namespace, cred, nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
	return client
}
```

The `GetClient` function returns a new `azservicebus.Client` object that's created by using an Azure Service Bus namespace and a credential. The name space is provided by the `AZURE_SERVICEBUS_HOSTNAME` environment variable. And the credential is created by using the `azidentity.NewDefaultAzureCredential` function. 

For local development the `DefaultAzureCredential` used the access token from azure cli, which can be created by running the `az login` command to authenticate to Azure. 

To learn more about other authentication methods, see [Azure authentication with the Azure SDK for Go](/azure/developer/go/azure-sdk-authentication).

## Send messages to a queue

In the `main.go` file, create a new function named `SendMessage` and add the following code:

```go
func SendMessage(message string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
	sbMessage := &azservicebus.Message{
		Body: []byte(message),
	}
	err = sender.SendMessage(context.TODO(), sbMessage, nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
}
```

`SendMessage` takes two parameters: a message string and a `azservicebus.Client` object. It then creates a new `azservicebus.Sender` object and sends the message to the queue. To send bulk messages, add the `SendMessageBatch` function to your `main.go` file.

```go
func SendMessageBatch(messages []string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	batch, err := sender.NewMessageBatch(context.TODO(), nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	for _, message := range messages {
		if err := batch.AddMessage(&azservicebus.Message{Body: []byte(message)}, nil); err != nil {
			log.Fatal("%v", err)
		}
	}
	if err := sender.SendMessageBatch(context.TODO(), batch, nil); err != nil {
		log.Fatal("%v", err)
	}
}
```

`SendMessageBatch` takes two parameters: a slice of messages and a `azservicebus.Client` object. It then creates a new `azservicebus.Sender` object and sends the messages to the queue.



## Receive messages from a queue

After you've sent messages to the queue, you can receive them with the `receiver` type. To recieve messaged from a queue, add the `ReceiveMessage` function to your `main.go` file.

```go
func ReceiveMessage(client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue("myqueue", nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
	messages, err := receiver.ReceiveMessages(context.TODO(), 3, nil)
	if err != nil {
		log.Fatalf("%v", err)
	}

	for _, message := range messages {
		body, err := message.Body()
		if err != nil {
			log.Fatalf("%v", err)
		}
		fmt.Printf("%s\n", string(body))

		err = receiver.CompleteMessage(context.TODO(), message, nil)
		if err != nil {
			log.Fatalf("%v", err)
		}
	}
}
```

`RecieveMessage` takes a `azservicebus.Client` object and creates a new `azservicebus.Receiver` object. It then receives the messages from the queue. The `ReceiveMessages` function takes two parameters: a context and the number of messages to receive. The `ReceiveMessages` function returns a slice of `azservicebus.Message` objects. 

Next, a `for` loop iterates through the messages and prints the message body. After printing the message body, the `CompleteMessage` function is called to complete the message, removing it from the queue.

Messages that exceede lenght limits, are sent to an invalid queue, or are not successfully processed can be sent to the dead letter queue. To send messages to the dead letter queue, add the `SendDeadLetterMessage` function to your `main.go` file.


```go
func DeadLetterMessage(client *azservicebus.Client) {

	receiver, err := client.NewReceiverForQueue("myqueue", nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	for _, message := range messages {
		reason := "exampleReason"
		errorDesc := "exampleErrorDescription"

		deadLetterOptions := &azservicebus.DeadLetterOptions{
			ErrorDescription: &errorDesc,
			Reason:           &reason,
		}
		if err := receiver.DeadLetterMessage(context.TODO(), message, deadLetterOptions); err != nil {
			log.Fatal("%v", err)
		}
	}
}
```

`DeadLetterMessage` takes a `azservicebus.Client` object and a `azservicebus.Message` object. It then sends the message to the dead letter queue. The function takes two parameters: a context and a `azservicebus.DeadLetterOptions` object. The `DeadLetterMessage` function returns an error if the message fails to be sent to the dead letter queue.

To receive messages from the dead letter queue, add the `ReceiveDeadLetterMessage` function to your `main.go` file.

```go
func ReceiveDeadLetterMessage(client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue(
		"myqueue",
		&azservicebus.ReceiverOptions{
			ReceiveMode: azservicebus.ReceiveModePeekLock,
			SubQueue:    azservicebus.SubQueueDeadLetter,
		},
	)
	if err != nil {
		log.Fatal("%v", err)
	}

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	for _, message := range messages {
		fmt.Printf("DeadLetter Reason: %s\nDeadLetter Description: %s\n", *message.DeadLetterReason, *message.DeadLetterErrorDescription)
	}
}
```

`ReceiveDeadLetterMessage` takes a `azservicebus.Client` object and creates a new `azservicebus.Receiver` object with options for the dead letter queue. It then receives the messages from the dead letter queue. The function then receives 1 message from the dead letter queue. Then it prints the dead letter reason and description for that message.

## Sample code

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

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
		log.Fatalf("%v", err)
	}

	client, err := azservicebus.NewClient(namespace, cred, nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
	return client
}

func SendMessage(message string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
	sbMessage := &azservicebus.Message{
		Body: []byte(message),
	}
	err = sender.SendMessage(context.TODO(), sbMessage, nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
}

func SendMessageBatch(messages []string, client *azservicebus.Client) {
	sender, err := client.NewSender("myqueue", nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	batch, err := sender.NewMessageBatch(context.TODO(), nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	for _, message := range messages {
		if err := batch.AddMessage(&azservicebus.Message{Body: []byte(message)}, nil); err != nil {
			log.Fatal("%v", err)
		}
	}
	if err := sender.SendMessageBatch(context.TODO(), batch, nil); err != nil {
		log.Fatal("%v", err)
	}
}

func ReceiveMessage(client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue("myqueue", nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
	messages, err := receiver.ReceiveMessages(context.TODO(), 3, nil)
	if err != nil {
		log.Fatalf("%v", err)
	}

	for _, message := range messages {
		body, err := message.Body()
		if err != nil {
			log.Fatalf("%v", err)
		}
		fmt.Printf("%s\n", string(body))

		err = receiver.CompleteMessage(context.TODO(), message, nil)
		if err != nil {
			log.Fatalf("%v", err)
		}
	}
}

func DeadLetterMessage(client *azservicebus.Client) {

	receiver, err := client.NewReceiverForQueue("myqueue", nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	for _, message := range messages {
		reason := "exampleReason"
		errorDesc := "exampleErrorDescription"

		deadLetterOptions := &azservicebus.DeadLetterOptions{
			ErrorDescription: &errorDesc,
			Reason:           &reason,
		}
		if err := receiver.DeadLetterMessage(context.TODO(), message, deadLetterOptions); err != nil {
			log.Fatal("%v", err)
		}
	}
}

func ReceiveDeadLetterMessage(client *azservicebus.Client) {
	receiver, err := client.NewReceiverForQueue(
		"myqueue",
		&azservicebus.ReceiverOptions{
			ReceiveMode: azservicebus.ReceiveModePeekLock,
			SubQueue:    azservicebus.SubQueueDeadLetter,
		},
	)
	if err != nil {
		log.Fatal("%v", err)
	}

	messages, err := receiver.ReceiveMessages(context.TODO(), 1, nil)
	if err != nil {
		log.Fatal("%v", err)
	}

	for _, message := range messages {
		fmt.Printf("DeadLetter Reason: %s\nDeadLetter Description: %s\n", *message.DeadLetterReason, *message.DeadLetterErrorDescription) 
	}
}

func main() {
	client := GetClient()
	SendMessage("singleMessage", client)

	messages := [2]string{"batchMessage1", "batchMessage2"}
	SendMessageBatch(messages[:], client)

	ReceiveMessage(client)

	SendMessage("Send message to deadletter", client)
	DeadLetterMessage(client)
	ReceiveDeadLetterMessage(client)
}

```

## Run the code

Before you run the code, create an environment variable named `AZURE_SERVICEBUS_HOSTNAME`. Set the environment variable's value to the service bus namespace.

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
See the following links for more information.

- [Azure Service Bus SDK for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus)
- [Azure Service Bus SDK for Go on GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azservicebus)