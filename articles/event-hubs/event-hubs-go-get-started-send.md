---
title: 'Quickstart: Send and receive events using Go - Azure Event Hubs'
description: 'Quickstart: This article provides a walkthrough for creating a Go application that sends events to and receive events from Azure Event Hubs.'
ms.topic: quickstart
ms.date: 11/16/2022
ms.devlang: golang
ms.custom: mode-api, devx-track-go
---

# Quickstart: Send events to or receive events from Event Hubs using Go
Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This quickstart describes how to write Go applications to send events to or receive events from an event hub. 

> [!NOTE]
> This quickstart is based on samples on GitHub at [https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azeventhubs](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azeventhubs). The send one is based on the **example_producing_events_test.go** sample and the receive one is based on the **example_processor_test.go** sample. The code is simplified for the quickstart and all the detailed comments are removed, so look at the samples for more details and explanations. 

## Prerequisites

To complete this quickstart, you need the following prerequisites:

- Go installed locally. Follow [these instructions](https://go.dev/doc/install) if necessary.
- An active Azure account. If you don't have an Azure subscription, create a [free account][] before you begin.
- **Create an Event Hubs namespace and an event hub**. Use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md).

## Send events
This section shows you how to create a Go application to send events to an event hub. 

### Install Go package

Get the Go package for Event Hubs as shown in the following example.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs
```

### Code to send events to an event hub

Here's the code to send events to an event hub. The main steps in the code are:

1. Create an Event Hubs producer client using a connection string to the Event Hubs namespace and the event hub name. 
1. Create a batch object and add sample events to the batch.
1. Send the batch of events to th events.

> [!IMPORTANT]
> Replace `NAMESPACE CONNECTION STRING` with the connection string to your Event Hubs namespace and `EVENT HUB NAME` with the event hub name in the sample code. 

```go
package main

import (
    "context"

    "github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs"
)

func main() {

    // create an Event Hubs producer client using a connection string to the namespace and the event hub
    producerClient, err := azeventhubs.NewProducerClientFromConnectionString("NAMESPACE CONNECTION STRING", "EVENT HUB NAME", nil)

    if err != nil {
        panic(err)
    }

    defer producerClient.Close(context.TODO())

    // create sample events
    events := createEventsForSample()

    // create a batch object and add sample events to the batch
    newBatchOptions := &azeventhubs.EventDataBatchOptions{}

    batch, err := producerClient.NewEventDataBatch(context.TODO(), newBatchOptions)

    for i := 0; i < len(events); i++ {
        err = batch.AddEventData(events[i], nil)
    }

    // send the batch of events to the event hub
    producerClient.SendEventDataBatch(context.TODO(), batch, nil)
}

func createEventsForSample() []*azeventhubs.EventData {
    return []*azeventhubs.EventData{
        {
            Body: []byte("hello"),
        },
        {
            Body: []byte("world"),
        },
    }
}
```


Don't run the application yet. You first need to run the receiver app and then the sender app. 

## Receive events

### Create a Storage account and container

State such as leases on partitions and checkpoints in the event stream are shared between receivers using an Azure Storage container. You can create a storage account and container with the Go SDK, but you can also create one by following the instructions in [About Azure storage accounts](../storage/common/storage-account-create.md).

[!INCLUDE [storage-checkpoint-store-recommendations](./includes/storage-checkpoint-store-recommendations.md)]

### Go packages

To receive the messages, get the Go packages for Event Hubs as shown in the following example. 

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs
```

### Code to receive events from an event hub

Here's the code to receive events from an event hub. The main steps in the code are:

1. Check a checkpoint store object that represents the Azure Blob Storage used by the event hub for checkpointing.
1. Create an Event Hubs consumer client using a connection string to the Event Hubs namespace and the event hub name. 
1. Create an event processor using the client object and the checkpoint store object. The processor receives and processes events.
1. For each partition in the event hub, create a partition client with processEvents as the function to process events.
1. Run all partition clients to receive and process events.

> [!IMPORTANT]
> Replace the following placeholder values with actual values:
> - `AZURE STORAGE CONNECTION STRING` with the connection string for your Azure storage account
> - `BLOB CONTAINER NAME` with the name of the blob container you created in the storage account
> - `NAMESPACE CONNECTION STRING` with the connection string for your Event Hubs namespace
> - `EVENT HUB NAME` with the event hub name in the sample code. 

```go
package main

import (
    "context"
    "errors"
    "fmt"
    "time"

    "github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs"
    "github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs/checkpoints"
)

func main() {

    // create a container client using a connection string and container name
    checkClient, err := container.NewClientFromConnectionString("AZURE STORAGE CONNECTION STRING", "CONTAINER NAME", nil)
    
    // create a checkpoint store that will be used by the event hub
    checkpointStore, err := checkpoints.NewBlobStore(checkClient, nil)

    if err != nil {
        panic(err)
    }

    // create a consumer client using a connection string to the namespace and the event hub
    consumerClient, err := azeventhubs.NewConsumerClientFromConnectionString("NAMESPACE CONNECTION STRING", "EVENT HUB NAME", azeventhubs.DefaultConsumerGroup, nil)

    if err != nil {
        panic(err)
    }

    defer consumerClient.Close(context.TODO())

    // create a processor to receive and process events
    processor, err := azeventhubs.NewProcessor(consumerClient, checkpointStore, nil)

    if err != nil {
        panic(err)
    }

    //  for each partition in the event hub, create a partition client with processEvents as the function to process events
    dispatchPartitionClients := func() {
        for {
            partitionClient := processor.NextPartitionClient(context.TODO())

            if partitionClient == nil {
                break
            }

            go func() {
                if err := processEvents(partitionClient); err != nil {
                    panic(err)
                }
            }()
        }
    }

    // run all partition clients
    go dispatchPartitionClients()

    processorCtx, processorCancel := context.WithCancel(context.TODO())
    defer processorCancel()

    if err := processor.Run(processorCtx); err != nil {
        panic(err)
    }
}

func processEvents(partitionClient *azeventhubs.ProcessorPartitionClient) error {
    defer closePartitionResources(partitionClient)
    for {
        receiveCtx, receiveCtxCancel := context.WithTimeout(context.TODO(), time.Minute)
        events, err := partitionClient.ReceiveEvents(receiveCtx, 100, nil)
        receiveCtxCancel()

        if err != nil && !errors.Is(err, context.DeadlineExceeded) {
            return err
        }

        fmt.Printf("Processing %d event(s)\n", len(events))

        for _, event := range events {
            fmt.Printf("Event received with body %v\n", string(event.Body))
        }

        if len(events) != 0 {
            if err := partitionClient.UpdateCheckpoint(context.TODO(), events[len(events)-1]); err != nil {
                return err
            }
        }
    }
}

func closePartitionResources(partitionClient *azeventhubs.ProcessorPartitionClient) {
    defer partitionClient.Close(context.TODO())
}

```

## Run receiver and sender apps

1. Run the receiver app first.
1. Run the sender app.
1. Wait for a minute to see the following output in the receiver window.

    ```bash
    Processing 2 event(s)
    Event received with body hello
    Event received with body world
    ```

## Next steps
See samples on GitHub at [https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azeventhubs](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/messaging/azeventhubs).


<!-- Links -->
[Event Hubs overview]: event-hubs-about.md
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
