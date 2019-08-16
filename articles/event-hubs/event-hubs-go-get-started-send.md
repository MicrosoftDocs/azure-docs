---
title: Send and receive events using Go - Azure Event Hubs | Microsoft Docs
description: This article provides a walkthrough for creating a Go application that sends events from Azure Event Hubs. 
services: event-hubs
author: ShubhaVijayasarathy
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.custom: seodec18
ms.date: 04/15/2019
ms.author: shvija

---

# Send events to or receive events from Event Hubs using Go
Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This tutorial describes how to write Go applications to send events to or receive events from an event hub. 

> [!NOTE]
> You can download this quickstart as a sample from the [GitHub](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/eventhubs), replace `EventHubConnectionString` and `EventHubName` strings with your event hub values, and run it. Alternatively, you can follow the steps in this tutorial to create your own.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- Go installed locally. Follow [these instructions](https://golang.org/doc/install) if necessary.
- An active Azure account. If you don't have an Azure subscription, create a [free account][] before you begin.
- **Create an Event Hubs namespace and an event hub**. Use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md).

## Send events
This section shows you how to create a Go application to send events to an event hub. 

### Install Go package

Get the Go package for Event Hubs with `go get` or `dep`. For example:

```bash
go get -u github.com/Azure/azure-event-hubs-go
go get -u github.com/Azure/azure-amqp-common-go/...

# or

dep ensure -add github.com/Azure/azure-event-hubs-go
dep ensure -add github.com/Azure/azure-amqp-common-go
```

### Import packages in your code file

To import the Go packages, use the following code example:

```go
import (
    aad "github.com/Azure/azure-amqp-common-go/aad"
    eventhubs "github.com/Azure/azure-event-hubs-go"
)
```

### Create service principal

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

### Create Event Hubs client

The following code creates an Event Hubs client:

```go
hub, err := eventhubs.NewHub("namespaceName", "hubName", tokenProvider)
ctx := context.WithTimeout(context.Background(), 10 * time.Second)
defer hub.Close(ctx)
if err != nil {
	log.Fatalf("failed to get hub %s\n", err)
}
```

### Write code to send messages

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
hub.Send(ctx, eventhubs.NewEventFromString("hello Azure!"))
```

### Extras

Get the IDs of the partitions in your event hub:

```go
info, err := hub.GetRuntimeInformation(ctx)
if err != nil {
	log.Fatalf("failed to get runtime info: %s\n", err)
}
log.Printf("got partition IDs: %s\n", info.PartitionIDs)
```

Run the application to send events to the event hub. 

Congratulations! You have now sent messages to an event hub.

## Receive events

### Create a Storage account and container

State such as leases on partitions and checkpoints in the event stream are shared between receivers using an Azure Storage container. You can create a storage account and container with the Go SDK, but you can also create one by following the instructions in [About Azure storage accounts](../storage/common/storage-create-storage-account.md).

Samples for creating Storage artifacts with the Go SDK are available in the [Go samples repo](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/storage) and in the sample corresponding to this tutorial.

### Go packages

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

### Import packages in your code file

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

### Create service principal

Create a new service principal by following the instructions in [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli). Save the provided credentials in your environment with the following names: Both Azure SDK for Go and Event Hubs package are preconfigured to look for these variable names.

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

### Get metadata struct

Get a struct with metadata about your Azure environment using the Azure Go SDK. Later operations use this struct to find correct endpoints.

```go
azureEnv, err := azure.EnvironmentFromName("AzurePublicCloud")
if err != nil {
	log.Fatalf("could not get azure.Environment struct: %s\n", err)
}
```

### Create credential helper 

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

### Create a check pointer and a leaser 

Create a **leaser**, responsible for leasing a partition to a particular receiver, and a **check pointer**, responsible for writing checkpoints for the message stream so that other receivers can begin reading from the correct offset.

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

### Construct Event Processor Host

You now have the pieces needed to construct an EventProcessorHost, as follows. The same **StorageLeaserCheckpointer** is used as both a leaser and check pointer, as described previously:

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

### Create handler 

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

### Write code to receive messages

With everything set up, you can start the Event Processor Host with `Start(context)` to keep it permanently running, or with `StartNonBlocking(context)` to run only as long as messages are available.

This tutorial starts and runs as follows; see the GitHub sample for an example using `StartNonBlocking`:

```go
ctx := context.Background()
err = p.Start()
if err != nil {
	log.Fatalf("failed to start EPH: %s\n", err)
}
```

## Next steps
Read the following articles:

- [EventProcessorHost](event-hubs-event-processor-host.md)
- [Features and terminology in Azure Event Hubs](event-hubs-features.md)
- [Event Hubs FAQ](event-hubs-faq.md)


<!-- Links -->
[Event Hubs overview]: event-hubs-about.md
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
