---
title: Azure Event Grid on Kubernetes - event handlers and destinations
description: This article describes different types of event handlers and destinations supported by Event Grid on Kubernetes
author: jfggdl
ms.author: jafernan
ms.subservice: kubernetes
ms.date: 05/25/2021
ms.topic: conceptual
---

# Event handlers destinations in Event Grid on Kubernetes
An event handler is any system that exposes an endpoint and is the destination for events sent by Event Grid. An event handler receiving an event acts upon it and uses the event payload to execute some logic, which might lead to the occurrence of new events.

The way to configure Event Grid to send events to a destination is through the creation of an event subscription. It can be done through [Azure CLI](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create), [management SDK](../sdk-overview.md#management-sdks), or using direct HTTPs calls using the [2020-10-15-preview API](/rest/api/eventgrid/controlplane-version2023-06-01-preview/event-subscriptions/create-or-update) version.

In general, Event Grid on Kubernetes can send events to any destination via **Webhooks**. Webhooks are HTTP(s) endpoints exposed by a service or workload to which Event Grid has access. The webhook can be a workload hosted in the same cluster, in the same network space, on the cloud, on-premises or anywhere that Event Grid can reach.

[!INCLUDE [preview-feature-note.md](../includes/preview-feature-note.md)]

Through Webhooks, Event Grid supports the following destinations **hosted on a Kubernetes cluster**:

* Azure App Service on Kubernetes with Azure Arc.
* Azure Functions on Kubernetes with Azure Arc.
* Azure Logic Apps on Kubernetes with Azure Arc.

In addition to Webhooks, Event Grid on Kubernetes can send events to the following destinations **hosted on Azure**:

- Azure Event Grid **using Webhooks**
- Azure Functions **using Webhooks only**
- Azure Event Hubs using its Azure Resource Manager resource ID
- Azure Service Bus topics or queues using its Azure Resource Manager resource ID
- Azure Storage queue using its Azure Resource Manager resource ID



## Feature parity
Event Grid on Kubernetes offers a good level of feature parity with Azure Event Grid's support for event subscriptions. The following list enumerates the main differences in event subscription functionality. Apart from those differences, you can use Azure Event Grid's [REST api version 2020-10-15-preview](/rest/api/eventgrid/controlplane-version2023-06-01-preview/event-subscriptions) as a reference when managing event subscriptions on Event Grid on Kubernetes.

1. Use [REST api version 2020-10-15-preview](/rest/api/eventgrid/controlplane-version2023-06-01-preview/event-subscriptions).
2. [Azure Event Grid trigger for Azure Functions](../../azure-functions/functions-bindings-event-grid-trigger.md?tabs=csharp%2Cconsole) isn't supported. You can use a WebHook destination type to deliver events to Azure Functions.
3. There's no [dead letter location](../manage-event-delivery.md#set-dead-letter-location) support. That means that you can't use ``properties.deadLetterDestination`` in your event subscription payload.
4. Azure Relay's Hybrid Connections as a destination isn't supported yet.
5. Only CloudEvents schema is supported. The supported schema value is "[CloudEventSchemaV1_0](/rest/api/eventgrid/controlplane-version2023-06-01-preview/event-subscriptions/create-or-update#eventdeliveryschema)". Cloud Events schema is extensible and based on open standards.
6. Labels ([properties.labels](/rest/api/eventgrid/controlplane-version2023-06-01-preview/event-subscriptions/create-or-update#request-body)) aren't applicable to Event Grid on Kubernetes. Hence, they aren't available.
7. [Delivery with resource identity](/rest/api/eventgrid/controlplane-version2023-06-01-preview/event-subscriptions/create-or-update#deliverywithresourceidentity) isn't supported. So, all properties for [Event Subscription Identity](/rest/api/eventgrid/controlplane-version2023-06-01-preview/event-subscriptions/create-or-update#eventsubscriptionidentity) aren't supported.
8. [Destination endpoint validation](../webhook-event-delivery.md#endpoint-validation-with-event-grid-events) isn't supported yet.

## Event filtering in event subscriptions
The other important aspect of configuring an event subscription is selecting the events that are meant to be delivered to a destination. For more information, see [Event Filtering](filter-events.md).

## Sample destination configurations

Following are some basic sample configurations depending on the intended destination.

## WebHook
To publish to a WebHook endpoint, set the `endpointType` to `WebHook` and provide:

* **endpointUrl**: The WebHook endpoint URL

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

To publish to an Azure Event Grid cloud endpoint, set the `endpointType` to `WebHook` and provide:

* **endpointUrl**: Azure Event Grid topic URL in the cloud with the API version parameter set to **2018-01-01** and `aeg-sas-key` set to the URL encoded SAS key.

   ```json
    {
      "properties": {
        "destination": {
          "endpointType": "WebHook",
          "properties": {
            "endpointUrl": "<your-event-grid-cloud-topic-endpoint-url>?api-version=2018-01-01&aeg-sas-key=urlencoded(sas-key-value)"
          }
        }
      }
    }
   ```

## Event Hubs

To publish to an Event Hubs, set the `endpointType` to `eventHub` and provide:

* **resourceId**: resource ID for the specific event hub.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "eventHub",
              "properties": {
                "resourceId": "<Azure Resource ID of your event hub>"
              }
            }
          }
        }
    ```

## Service Bus queues

To publish to a Service Bus queue, set the `endpointType` to `serviceBusQueue` and provide:

* **resourceId**: resource ID for the specific Service Bus queue.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "serviceBusQueue",
              "properties": {
                "resourceId": "<Azure Resource ID of your Service Bus queue>"
              }
            }
          }
        }
    ```

## Service Bus topics

To publish to a Service Bus topic, set the `endpointType` to `serviceBusTopic` and provide:

* **resourceId**: resource ID for the specific Service Bus topic.

    ```json
    {
      "properties": {
        "destination": {
          "endpointType": "serviceBusTopic",
          "properties": {
            "resourceId": "<Azure Resource ID of your Service Bus topic>"
          }
        }
      }
    }
    ```

## Storage Queues

To publish to a Storage Queue, set the  `endpointType` to `storageQueue` and provide:

* **queueName**: Name of the Azure Storage queue you're publishing to.
* **resourceID**: Azure resource ID of the storage account that contains the queue.

    ```json
    {
      "properties": {
        "destination": {
          "endpointType": "storageQueue",
          "properties": {
            "queueName": "<your-storage-queue-name>",
            "resourceId": "<Azure Resource ID of your Storage account>"
          }
        }
      }
    }
    ```

## Next steps

* Add [filter configuration](filter-events.md) to your event subscription to select the events to be delivered.
* To learn about schemas supported by Event Grid on Azure Arc for Kubernetes, see [Event Grid on Kubernetes - Event schemas](event-schemas.md).
