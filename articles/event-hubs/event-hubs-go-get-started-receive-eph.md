---
title: Receive events from Azure Event Hubs using Go | Microsoft Docs
description: Get started receiving events from Event Hubs using Go
services: event-hubs
author: ShubhaVijayasarathy
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 07/23/2018
ms.author: shvija

---

# Receive events from Event Hubs using Go

Azure Event Hubs is a highly scalable event management system that can handle millions of events per second, enabling applications to process and analyze massive amounts of data produced by connected devices and other systems. Once collected into an event hub, you can receive and handle events using in-process handlers or by forwarding to other analytics systems.

To learn more about Event Hubs, see the [Event Hubs overview][Event Hubs overview].

This tutorial describes how to receive events from an event hub in a Go application. To learn how to send events see [the corresponding Send article](event-hubs-go-get-started-send.md).

Code in this tutorial is taken from [these GitHub samples](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/eventhubs), which you can examine to see the full working application including import
statements and variable declarations.

Other examples are available [in the Event Hubs package repo](https://github.com/Azure/azure-event-hubs-go/tree/master/_examples).

## Prerequisites

To complete this tutorial you'll need the following prerequisites:

* Go installed locally. Follow [these instructions](https://golang.org/doc/install) if necessary.
* An active Azure account. If you don't have an Azure subscription, create a [free account][] before you begin.
* To receive messages, there must be messages in the target event hub. Learn how to send messages in the [send tutorial](event-hubs-go-get-started-send.md).
* An existing event hub (see the following section).
* An existing storage account and container (see the section after the next section).

### Create an event hub

This tutorial starts with an existing Event Hubs namespace and event hub. You can create these entities by following the instructions in [this article](event-hubs-create.md).

### Create a Storage account and container

State such as leases on partitions and checkpoints in the event stream are shared between receivers using an Azure Storage container. You can create a storage account and container with the Go SDK, but you can also create one by following the instructions in [About Azure storage accounts](../storage/common/storage-create-storage-account.md).

Samples for creating Storage artifacts with the Go SDK are available in the [Go samples repo](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/storage) and in the sample corresponding to this tutorial.

## Receive messages

To receive the messages, get the Go packages for Event Hubs with `go get` or `dep`:

```bash
go get -u github.com/Azure/azure-event-hubs-go/...
go get -u github.com/Azure/azure-amqp-common-go/...
go get -u github.com/Azure/go-autorest/...

# or

dep ensure -add github.com/Azure/azure-event-hubs-go
dep ensure -add github.com/Azure/azure-amqp-common-go
dep ensure -add github.com/Azure/go-autorest
```

## Import packages in your code file

To import the Go packages, use the following code example:

```go
import (
    aad "github.com/Azure/azure-amqp-common-go/aad"
    eventhubs "github.com/Azure/azure-event-hubs-go"
    eph "github.com/Azure/azure-event-hubs-go/eph"
    storageLeaser "github.com/Azure/azure-event-hubs-go/storage"
    azure "github.com/Azure/go-autorest/autorest/azure"
)
```

## Create service principal

Create a new service principal by following the instructions in [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli). Save the provided credentials in your environment with the following names. Both the Azure SDK for Go and the Event Hubs package are
preconfigured to look for these variable names.

```bash
export AZURE_CLIENT_ID=
export AZURE_CLIENT_SECRET=
export AZURE_TENANT_ID=
export AZURE_SUBSCRIPTION_ID= 
```

Next, create an authorization provider for your Event Hubs client that uses these credentials:

```go
tokenProvider, err := aad.NewJWTProvider(aad.JWTProviderWithEnvironmentVars())
if err != nil {
    log.Fatalf("failed to configure AAD JWT provider: %s\n", err)
}
```

## Get metadata struct

Get a struct with metadata about your Azure environment using the Azure Go SDK. Later operations use this struct to find correct endpoints.

```go
azureEnv, err := azure.EnvironmentFromName("AzurePublicCloud")
if err != nil {
	log.Fatalf("could not get azure.Environment struct: %s\n", err)
}
```

## Create credential helper 

Create a credential helper that uses the previous Azure Active Directory (AAD) credentials to create a Shared Access Signature (SAS) credential for Storage. The last parameter tells this constructor to use the same environment variables as used previously:

```go
cred, err := storageLeaser.NewAADSASCredential(
	subscriptionID,
	resourceGroupName,
	storageAccountName,
	storageContainerName,
	storageLeaser.AADSASCredentialWithEnvironmentVars())
if err != nil {
	log.Fatalf("could not prepare a storage credential: %s\n", err)
}
```

## Create Checkpointer and Leaser 

Create a **Leaser**, responsible for leasing a partition to a particular receiver, and a **Checkpointer**, responsible for writing checkpoints for the message stream so that other receivers can begin reading from the correct offset.

Currently, a single **StorageLeaserCheckpointer** is available that uses the same Storage container to manage both leases and checkpoints. In addition to the storage account and container names, the **StorageLeaserCheckpointer** needs the credential created in the previous step and the Azure environment struct to correctly access the container.

```go
leaserCheckpointer, err := storageLeaser.NewStorageLeaserCheckpointer(
	cred,
	storageAccountName,
	storageContainerName,
	azureEnv)
if err != nil {
	log.Fatalf("could not prepare a storage leaserCheckpointer: %s\n", err)
}
```

## Construct Event Processor Host

You now have the pieces needed to construct an EventProcessorHost, as follows. The same **StorageLeaserCheckpointer** is used as both a Leaser and Checkpointer, as described previously:

```go
ctx := context.Background()
p, err := eph.New(
	ctx,
	nsName,
	hubName,
	tokenProvider,
	leaserCheckpointer,
	leaserCheckpointer)
if err != nil {
	log.Fatalf("failed to create EPH: %s\n", err)
}
defer p.Close(context.Background())
```

## Create handler 

Now create a handler and register it with the Event Processor Host. When the host is started, it applies this and any other specified handlers to incoming messages:

```go
handler := func(ctx context.Context, event *eventhubs.Event) error {
	fmt.Printf("received: %s\n", string(event.Data))
	return nil
}

// register the handler with the EPH
_, err := p.RegisterHandler(ctx, handler)
if err != nil {
	log.Fatalf("failed to register handler: %s\n", err)
}
```

## Receive messages

With everything set up, you can start the Event Processor Host with `Start(context)` to keep it permanently running, or with `StartNonBlocking(context)` to run only as long as messages are available.

This tutorial starts and runs as follows; see the GitHub sample for an example using `StartNonBlocking`:

```go
ctx := context.Background()
err = p.Start()
if err != nil {
	log.Fatalf("failed to start EPH: %s\n", err)
}
```

## Notes

This tutorial uses a single instance of **EventProcessorHost**. To increase throughput and reliability, you should run multiple instances of **EventProcessorHost** on different systems. The Leaser system ensures that only one receiver is associated with, and receives messages from, a specified partition at a specified time.

## Next steps

Visit these pages to learn more about Event Hubs:

* [Send events with Go](event-hubs-go-get-started-send.md)
* [Event Hubs overview](event-hubs-about.md)
* [Create an Event Hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[Event Hubs overview]: event-hubs-about.md
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
