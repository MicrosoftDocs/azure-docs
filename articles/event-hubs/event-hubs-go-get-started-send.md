---
title: Send events to Azure Event Hubs using Go | Microsoft Docs
description: Get started sending events to Event Hubs using Go
services: event-hubs
author: ShubhaVijayasarathy
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 10/18/2018
ms.author: shvija

---

# Send events to Event Hubs using Go

Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This tutorial describes how to send events to an event hub from an application written in Go. 

> [!NOTE]
> You can download this quickstart as a sample from the [GitHub](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/eventhubs), replace `EventHubConnectionString` and `EventHubName` strings with your event hub values, and run it. Alternatively, you can follow the steps in this tutorial to create your own.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

* Go installed locally. Follow [these instructions](https://golang.org/doc/install) if necessary.
* An existing Event Hubs namespace and event hub. You can create these entities by following the instructions in [this article](event-hubs-create.md).

## Create an Event Hubs namespace and an event hub
The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md), then proceed with the following steps in this tutorial.

## Install Go package

Get the Go package for Event Hubs with `go get` or `dep`. For example:

```bash
go get -u github.com/Azure/azure-event-hubs-go
go get -u github.com/Azure/azure-amqp-common-go/...

# or

dep ensure -add github.com/Azure/azure-event-hubs-go
dep ensure -add github.com/Azure/azure-amqp-common-go
```

## Import packages in your code file

To import the Go packages, use the following code example:

```go
import (
    aad "github.com/Azure/azure-amqp-common-go/aad"
    eventhubs "github.com/Azure/azure-event-hubs-go"
)
```

## Create service principal

Create a new service principal by following the instructions in [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli). Save the provided credentials in your environment with the following names. Both the Azure SDK for Go and the Event Hubs packages are preconfigured to look for these variable names:

```bash
export AZURE_CLIENT_ID=
export AZURE_CLIENT_SECRET=
export AZURE_TENANT_ID=
export AZURE_SUBSCRIPTION_ID= 
```

Now, create an authorization provider for your Event Hubs client that uses these credentials:

```go
tokenProvider, err := aad.NewJWTProvider(aad.JWTProviderWithEnvironmentVars())
if err != nil {
    log.Fatalf("failed to configure AAD JWT provider: %s\n", err)
}
```

## Create Event Hubs client

The following code creates an Event Hubs client:

```go
hub, err := eventhubs.NewHub("namespaceName", "hubName", tokenProvider)
ctx := context.WithTimeout(context.Background(), 10 * time.Second)
defer hub.Close(ctx)
if err != nil {
	log.Fatalf("failed to get hub %s\n", err)
}
```

## Send messages

In the following snippet, use (1) to send messages interactively from a terminal, or (2) to send messages within your program:

```go
// 1. send messages at the terminal
ctx = context.Background()
reader := bufio.NewReader(os.Stdin)
for {
	fmt.Printf("Input a message to send: ")
	text, _ := reader.ReadString('\n')
	hub.Send(ctx, eventhubs.NewEventFromString(text))
}

// 2. send messages within program
ctx = context.Background()
hub.Send(ctx, eventhubs.NewEventFromString("hello Azure!")
```

## Extras

Get the IDs of the partitions in your event hub:

```go
info, err := hub.GetRuntimeInformation(ctx)
if err != nil {
	log.Fatalf("failed to get runtime info: %s\n", err)
}
log.Printf("got partition IDs: %s\n, info.PartitionIDs)
```

Run the application to send events to the event hub. 

Congratulations! You have now sent messages to an event hub.

## Next steps
In this quickstart, you have sent messages to an event hub using Go. To learn how to receive events from an event hub using Go, see [Receive events from event hub - Go](event-hubs-go-get-started-receive-eph.md).

<!-- Links -->
[Event Hubs overview]: event-hubs-about.md
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
