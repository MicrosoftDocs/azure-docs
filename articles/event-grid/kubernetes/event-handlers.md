---
title: Azure Event Grid on Kubernetes - event handlers and destinations
description: This article describes different types of event handlers and destinations supported by Event Grid on Kubernetes
author: spelluru
manager: JasonWHowell
ms.author: spelluru
ms.subservice: kubernetes
ms.date: 05/04/2021
ms.topic: conceptual
---

# Event handlers and destinations in Event Grid on Kubernetes
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

## Parity with event subscriptions on Azure 
Event Grid on Kubernetes offers a good level of feature parity with respect to Azure Event Grid's support for event subscriptions. The following list enumerates the main differences in event subscription functionality. Apart from those differences, you may use Azure Event Grid's [REST API](/rest/api/eventgrid/version2020-10-15-preview/eventsubscriptions) to manage event subscriptions as reference documentation when managing event subscriptions on Event Grid on Kubernetes.

1. Use the api version `2020-10-15-preview`.
2. [Azure Event Grid trigger for Azure Functions](../../azure-functions/functions-bindings-event-grid-trigger.md?tabs=csharp%2Cconsole) isn't supported. You can use a WebHook destination type to deliver events to Azure Functions.
3. There is no dead letter support.
4. Azure Relay's Hybrid Connections as a destination isn't supported yet.
5. Only CloudEvents schema is supported. The supported schema value is "[CloudEventSchemaV1_0](/rest/api/eventgrid/version2020-10-15-preview/eventsubscriptions/createorupdate#eventdeliveryschema)". 
6. Labels ([properties.labels](/rest/api/eventgrid/version2020-10-15-preview/eventsubscriptions/createorupdate#request-body)) aren't applicable to Event Grid on Kubernetes, so they are not available.
7. [Delivery with resource identity](/rest/api/eventgrid/version2020-10-15-preview/eventsubscriptions/createorupdate#deliverywithresourceidentity) isn't supported. Therefore, all properties for [Event Subscription Identity](/rest/api/eventgrid/version2020-10-15-preview/eventsubscriptions/createorupdate#eventsubscriptionidentity) aren't supported.
8. [Destination endpoint validation](../webhook-event-delivery.md#endpoint-validation-with-event-grid-events) is not supported yet.

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
