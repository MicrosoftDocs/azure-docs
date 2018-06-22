---
title: Send events to Azure Event Hubs using Go | Microsoft Docs
description: Get started sending events to Event Hubs using Go
services: event-hubs
author: joshgav
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 06/30/2018
ms.author: joshgav

---

# Send events to Event Hubs using Go

Azure Event Hubs is a highly scalable event management system that can handle
millions of events per second, enabling applications to process and analyze
massive amounts of data produced by connected devices and other systems. Once
collected in a hub, you can receive and handle events using in-process handlers
or by forwarding to other analytics systems.

See the [Event Hubs overview][Event Hubs overview] to learn more about Event Hubs.

This tutorial shows how to send events to an event hub from applications
written in Go. To receive events, use the Go eph (EventProcessorHost) package
as described in [this corresponding article](event-hubs-go-get-started-receive-eph.md).

Code in this tutorial is taken from [these
samples](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/eventhubs),
which you can examine to see the full working application including import
statements and variable declarations.

Other examples are available [in the Event Hubs package
repo](https://github.com/Azure/azure-event-hubs-go/tree/master/_examples).

## Prerequisites

To complete this tutorial you'll need the following:

* Go installed locally, follow [these
  instructions](https://golang.org/doc/install) if necessary.
* An active Azure account. If you don't have an Azure subscription, create a
  [free account][] before you begin.
* An existing event hub. You can create a new one with the following script
  using [Azure CLI](https://github.com/Azure/azure-cli).

```bash
AZURE_GROUP=mygroup
AZURE_LOCATION=westus2
# for namespace choose something globally unique!
AZURE_EVENTHUB_NAMESPACE=my-namespace-001
AZURE_EVENTHUB_HUB=my-hub-001

az group create \
    --name ${AZURE_GROUP} \
    --location ${AZURE_LOCATION}

az eventhubs namespace create \
    --name ${AZURE_EVENTHUB_NAMESPACE} \
    --resource-group ${AZURE_GROUP} \
    --location ${AZURE_LOCATION}

az eventhubs eventhub create \
    --name ${AZURE_EVENTHUB_HUB} \
    --namespace-name ${AZURE_EVENTHUB_NAMESPACE} \
    --resource-group ${AZURE_GROUP}
```

## Send Events

Get the Go package for Event Hubs with `go get` or `dep`:

```bash
go get -u github.com/Azure/azure-event-hubs-go
go get -u github.com/Azure/azure-amqp-common-go/...

# or

dep ensure -add github.com/Azure/azure-event-hubs-go
dep ensure -add github.com/Azure/azure-amqp-common-go
```

Import packages in your code file:

```go
import (
    aad "github.com/Azure/azure-amqp-common-go/aad"
    eventhubs "github.com/Azure/azure-event-hubs-go"
)
```

Create a new service principal using the Azure CLI command `az ad sp
create-for-rbac` and save the provided credentials in your environment with the
following names. Both the Azure SDK for Go and the Event Hubs packages are
preconfigured to look for these variable names.

```bash
export AZURE_CLIENT_ID=
export AZURE_CLIENT_SECRET=
export AZURE_TENANT_ID=
export AZURE_SUBSCRIPTION_ID= 
```

Create an authorization provider for your Event Hubs client that utilizes
these credentials:

```go
tokenProvider, err := aad.NewJWTProvider(aad.JWTProviderWithEnvironmentVars())
if err != nil {
    log.Fatalf("failed to configure AAD JWT provider: %s\n", err)
}
```

Create an Event Hubs client:

```go
hub, err := eventhubs.NewHub("namespaceName", "hubName", tokenProvider)
ctx := context.WithTimeout(context.Background(), 10 * time.Second)
defer hub.Close(ctx)
if err != nil {
	log.Fatalf("failed to get hub %s\n", err)
}
```

It's finally time to send a message! In the following snippet use (1) to send
messages interactively from a terminal, or (2) to send messages within your
program.

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

Get the IDs of the partitions in your Hub.

```go
info, err := hub.GetRuntimeInformation(ctx)
if err != nil {
	log.Fatalf("failed to get runtime info: %s\n", err)
}
log.Printf("got partition IDs: %s\n, info.PartitionIDs)
```

## Next steps

Visit these pages to learn more about Event Hubs.

* [Receive events using EventProcessorHost](event-hubs-go-get-started-receive-eph.md)
* [Event Hubs overview][Event Hubs overview]
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[Event Hubs overview]: event-hubs-overview.md
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
