---
title: Azure Event Grid on Kubernetes - event Handlers and destinations
description: This article describes different types of event handlers and destinations supported by Event Grid on Kubernetes
author: spelluru
manager: JasonWHowell
ms.author: spelluru
ms.date: 05/04/2021
ms.topic: conceptual
---

# Event Handlers and destinations in Event Grid on Kubernetes
An event handler is the place where the event for further action or to process the event. Event subscriptions support the following kind of destinations.

- Webhooks. The following destinations are supported through webhooks:
    - Azure Event Grid
    - Azure Functions
    - Functions on Kubernetes
    - App Service on Kubernetes
    - Logic Apps on Kubernetes
- Azure Event Grid
- Azure Event Hubs
- Azure Service Bus topics and queues
- Azure Storage queues

## WebHook

To publish to a WebHook endpoint, set the `endpointType` to `WebHook` and provide:

* endpointUrl: The WebHook endpoint URL

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "<your-webhook-endpoint>"
              }
            }
          }
        }
    ```

## Azure Event Grid

To publish to an Azure Event Grid cloud endpoint, set the `endpointType` to `eventGrid` and provide:

* endpointUrl: Event Grid Topic URL in the cloud
* sasKey: Event Grid Topic's SAS key
* topicName: Name to stamp all outgoing events to Event Grid. Topic name is useful when posting to an Event Grid Domain topic.

   ```json
        {
          "properties": {
            "destination": {
              "endpointType": "eventGrid",
              "properties": {
                 "endpointUrl": "<your-event-grid-cloud-topic-endpoint-url>?api-version=2018-01-01",
                 "sasKey": "<your-event-grid-topic-saskey>",
                 "topicName": null
              }
            }
          }
    }
   ```

## Event Hubs

To publish to an Event Hub, set the `endpointType` to `eventHub` and provide:

* connectionString: Connection string for the specific Event Hub you're targeting generated via a Shared Access Policy.

    >[!NOTE]
    > The connection string must be entity specific. Using a namespace connection string will not work. You can generate an entity specific connection string by navigating to the specific Event Hub you would like to publish to in the Azure Portal and clicking **Shared access policies** to generate a new entity specific connecection string.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "eventHub",
              "properties": {
                "connectionString": "<your-event-hub-connection-string>"
              }
            }
          }
        }
    ```

## Service Bus Queues

To publish to a Service Bus Queue, set the `endpointType` to `serviceBusQueue` and provide:

* connectionString: Connection string for the specific Service Bus Queue you're targeting generated via a Shared Access Policy.

    >[!NOTE]
    > The connection string must be entity specific. Using a namespace connection string will not work. Generate an entity specific connection string by navigating to the specific Service Bus Queue you would like to publish to in the Azure Portal and clicking **Shared access policies** to generate a new entity specific connecection string.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "serviceBusQueue",
              "properties": {
                "connectionString": "<your-service-bus-queue-connection-string>"
              }
            }
          }
        }
    ```

## Service Bus Topics

To publish to a Service Bus Topic, set the `endpointType` to `serviceBusTopic` and provide:

* connectionString: Connection string for the specific Service Bus Topic you're targeting generated via a Shared Access Policy.

    >[!NOTE]
    > The connection string must be entity specific. Using a namespace connection string will not work. Generate an entity specific connection string by navigating to the specific Service Bus Topic you would like to publish to in the Azure Portal and clicking **Shared access policies** to generate a new entity specific connecection string.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "serviceBusTopic",
              "properties": {
                "connectionString": "<your-service-bus-topic-connection-string>"
              }
            }
          }
        }
    ```

## Storage Queues

To publish to a Storage Queue, set the  `endpointType` to `storageQueue` and provide:

* queueName: Name of the Storage Queue you're publishing to.
* connectionString: Connection string for the Storage Account the Storage Queue is in.

    >[!NOTE]
    > Unline Event Hubs, Service Bus Queues, and Service Bus Topics, the connection string used for Storage Queues is not entity specific. Instead, it must but the connection string for the Storage Account.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "storageQueue",
              "properties": {
                "queueName": "<your-storage-queue-name>",
                "connectionString": "<your-storage-account-connection-string>"
              }
            }
          }
        }
    ```

## Next steps
To learn about schemas supported by Event Grid on Azure Arc for Kubernetes, see [Event Grid on Kubernetes - Event schemas](event-schemas.md).