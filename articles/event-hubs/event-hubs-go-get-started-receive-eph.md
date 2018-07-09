---
title: Receive events from Azure Event Hubs using Go | Microsoft Docs
description: Get started receiving events from Event Hubs using Go
services: event-hubs
author: joshgav
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 06/12/2018
ms.author: sethm

---

# Receive events from Event Hubs using Go

Azure Event Hubs is a highly scalable event management system that can handle
millions of events per second, enabling applications to process and analyze
massive amounts of data produced by connected devices and other systems. Once
collected in a hub, you can receive and handle events using in-process handlers
or by forwarding to other analytics systems.

See the [Event Hubs overview][Event Hubs overview] to learn more about Event Hubs.

This tutorial shows how to receive events from an event hub in a Go
application. To learn how to send events see [this corresponding Send
article](event-hubs-go-get-started-send.md).

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
* To receive messages, there must be messages in the target hub. Learn how to
  send messages in the [send tutorial](event-hubs-go-get-started-send.md).
* An existing event hub (see following section).
* An existing storage account and container (see next following section).

### Create an event hub

This exercise starts with an existing event hub. You can create a new one with the
following script using [Azure CLI](https://github.com/Azure/azure-cli).

```bash
AZURE_GROUP=ehtest0001
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

### Create a Storage account and container

State such as leases on partitions and checkpoints in the event stream are
shared amongst receivers through an Azure Storage container. You can create a
storage account and container with the Go SDK, but you may prefer to create one
via the [Azure CLI](https://github.com/Azure/azure-cli)as follows.

Samples for creating Storage artifacts with the Go SDK are available in the [Go
samples
repo](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/storage)
and in the sample corresponding to this tutorial.

```bash
AZURE_GROUP=ehtest0001
AZURE_LOCATION=westus2
AZURE_STORAGE_ACCOUNT_NAME=mystorageaccountname0001
AZURE_STORAGE_CONTAINER_NAME=eventhubs0001leasercheckpointer

az storage account create \
	--name ${AZURE_STORAGE_ACCOUNT_NAME} \
	--resource-group ${AZURE_GROUP} \
	--location ${AZURE_LOCATION}

az storage container create \
	--name ${AZURE_STORAGE_CONTAINER_NAME} \
	--account-name ${AZURE_STORAGE_ACCOUNT_NAME}
```

## Receive messages

Time to receive the messages!

Get the Go packages for Event Hubs with `go get` or `dep`:

```bash
go get -u github.com/Azure/azure-event-hubs-go/...
go get -u github.com/Azure/azure-amqp-common-go/...
go get -u github.com/Azure/go-autorest/...

# or

dep ensure -add github.com/Azure/azure-event-hubs-go
dep ensure -add github.com/Azure/azure-amqp-common-go
dep ensure -add github.com/Azure/go-autorest
```

Import packages in your code file:

```go
import (
    aad "github.com/Azure/azure-amqp-common-go/aad"
    eventhubs "github.com/Azure/azure-event-hubs-go"
    eph "github.com/Azure/azure-event-hubs-go/eph"
    storageLeaser "github.com/Azure/azure-event-hubs-go/storage"
    azure "github.com/Azure/go-autorest/autorest/azure"
)
```

Create a new service principal using the Azure CLI command `az ad sp
create-for-rbac` and save the provided credentials in your environment with the
following names. Both the Azure SDK for Go and the Event Hubs package are
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

Get a struct with metadata about your Azure environment using the Azure Go SDK.
Later operations will use this struct to find correct endpoints.

```go
azureEnv, err := azure.EnvironmentFromName("AzurePublicCloud")
if err != nil {
	log.Fatalf("could not get azure.Environment struct: %s\n", err)
}
```

Create a credential helper that will utilize the Azure Active Directory (AAD)
credentials from above to create a Shared Access Signature (SAS) credential for
Storage. The last parameter tells this constructor to use the same environment
variables used above.

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

Create a **Leaser**, responsible for leasing a partition to a particular receiver;
and a **Checkpointer**, responsible for writing checkpoints for the message stream
so other receivers can begin from the correct offset.

Currently, a single StorageLeaserCheckpointer is available that uses the same
Storage container to manage both leases and checkpoints. In addition to the
storage account and container names, the StorageLeaserCheckpointer needs the
credential created in the previous step and the Azure environment struct to
correctly access the container.

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

We now have the pieces needed to construct an EventProcessorHost, as follows.
The same StorageLeaserCheckpointer is used as a Leaser *and* Checkpointer, as
described above.

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

We'll now create a handler and register it with our EventProcessorHost. When
the host is started it will apply this and any other specified handlers to
incoming messages.

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

With everything set up, you can start the EventProcessorHost with
`Start(context)` to keep it permanently running, or with
`StartNonBlocking(context)` to run only as long as messages are available.

In this tutorial we will start and keep running as follows; see the GitHub
sample for an example using `StartNonBlocking`.

```go
ctx := context.Background()
err = p.Start()
if err != nil {
	log.Fatalf("failed to start EPH: %s\n", err)
}
```

## Notes

This tutorial uses a single instance of EventProcessorHost. To increase
throughput and reliability, you should run multiple instances of
EventProcessorHost on different systems. The Leaser system ensures that only
one receiver is associated with and receives messages from a given partition at
a given time.

## Next steps

Visit these pages to learn more about Event Hubs.

* [Send events](event-hubs-go-get-started-send.md)
* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
