---
title: Azure Event Grid on Kubernetes - create topics and subscriptions
description: This article describes how to create an Event Grid topic on a Kubernetes cluster connected to Azure Arc and then create a subscription for the topic. 
author: spelluru
manager: JasonWHowell
ms.author: spelluru
ms.date: 05/05/2021
ms.topic: how-to
---

# Azure Event Grid on kubernetes - Create a topic and subscriptions

## Prerequisites

1. [Connect your Kubernetes cluster to Azure Arc](..azure-arc/kubernetes/quickstart-connect-cluster.md)
1. Deploy the Event Grid Kubernetes extension. 
1. Create a custom location.
1. Download and install [Azure Resource Manager client (armclient)](https://github.com/yangl900/armclient-go). This command-line tool will allow you to send request to Azure to create and manage resources.

## Create a Topic
1. Create a file called ```topic-1.json``` containing the following request payload that defines the topic you want to create.  

```json
{
  "name": "<TOPIC-NAME>",
  "location": "<REGION>",
  "kind": "AzureArc",
  "extendedLocation": {
    "name": "<YOUR-CUSTOMLOCATION-RESOURCE-ID>",
    "type": "CustomLocation"
  },
  "properties": {
          "inputschema": "cloudeventschemav1_0"
  }
}
 ```
2. Create a topic by sending the following request.

    ```console
    armclient put "https://<REGION>.management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroup}/providers/Microsoft.EventGrid/topics/{topic-name}?api-version=2020-10-15-preview" @topic-1.json -verbose
    ```
3. Verify that the provisioning state of the topic is ```Succeeded```.

   ```console
   armclient get "https://<REGION>.management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroup}/providers/Microsoft.EventGrid/topics/{topicName}?api-version=2020-10-15-preview"
   ```
### Create an Event Subscription

An event subscription defines the filtering criteria to select the events to be routed and the destination to which those events are sent.

Event Subscriptions support the following kind of destinations.
* [Webhooks](#WebHook). The following are supported throught webhooks (endpoints):
  * Azure Event Grid
  * Azure Functions 
  * Functions on Kubernetes
  * App Service on Kubernetes
  * Logic Apps on Kubernetes
* [Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/)
* [Azure Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/)
* [Azure Service Bus topics](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)
* [Azure Service Bus queues](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)
* [Azure Storage queues](https://docs.microsoft.com/en-us/azure/storage/queues/)


### Event Subscriptions on K8s and parity to event subscriptions on Azure 

Event Grid on Kubernetes offers a good level of feature parity with respect to Azure Event Grid's support for event subscriptions. The following list enumerates the main differences in event subscription functionality. Apart from those differences, you may use Azure Event Grid's [REST API to manage event subscriptions](https://docs.microsoft.com/en-us/rest/api/eventgrid/version2020-04-01-preview/eventsubscriptions) as reference documentation when managing event subscription on Event Grid on Kubernetes.

1. The api version to use is ```2020-10-15-preview``` as opposed to ```2020-04-01-preview```.
2. [Azure Event Grid trigger for Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid-trigger?tabs=csharp%2Cconsole) is not supported. You can use a WebHook destination type to deliver events to Azure Functions.
3. There is no Dead Letter support.
4. Azure Relay's Hybrid Connections as a destination is not supported yet.
5. The supported schema value is "[CloudEventSchemaV1_0](https://docs.microsoft.com/en-us/rest/api/eventgrid/version2020-04-01-preview/eventsubscriptions/createorupdate#eventdeliveryschema)".
6. Labels ([properties.labels](https://docs.microsoft.com/en-us/rest/api/eventgrid/version2020-04-01-preview/eventsubscriptions/createorupdate#request-body)) are not a feature applicable to Event Grid on Kubernetes and hence are not available.
7. [Delivery with resource identity](https://docs.microsoft.com/en-us/rest/api/eventgrid/version2020-04-01-preview/eventsubscriptions/createorupdate#deliverywithresourceidentity) is not supported. Hence, all properties for [Event Subscription Identity](https://docs.microsoft.com/en-us/rest/api/eventgrid/version2020-04-01-preview/eventsubscriptions/createorupdate#eventsubscriptionidentity) are not supported.
8. [Destination endpoint validation](https://docs.microsoft.com/en-us/azure/event-grid/webhook-event-delivery#endpoint-validation-with-event-grid-events) is not supported yet.


#### WebHook

1. To create an event subscription with a WebHook (HTTPS endpoint) destination
create a file called ```event-subscription-1.json``` that will contain the following request payload that defines a basic filter criteria that selects events for routing based on prefix and suffix strings in the event's subject attribute. You should change the values in  ```subjectBeginsWith``` and ```subjectEndsWith``` to suit your needs. You migth also remove the fitler criteria. If you do, Event Grid will send all events to the defined destination in ```endpointUrl```.

```json
{
  "properties": {
          "destination": {
             "endpointType": "WebHook",
             "properties": {
                     "endpointUrl": "{provide-a-full-url-to-an-http-endpoint}"
             }
          },
          "filter": {
             "isSubjectCaseSensitive": false,
             "subjectBeginsWith": "ExamplePrefix",
             "subjectEndsWith": "ExampleSuffix"
         }
  }
}
```
2. Create an event subscription by sending the following HTTP PUT request with the entity  body defined above:
  ```console
  armclient put "https://eastus2euap.management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}/providers/Microsoft.EventGrid/eventSubscriptions/{eventSubscriptionName}?api-version=2020-10-15-preview" @event-subscription-1.json -verbose
  ```

<br/><br/>
Following are some request payload examples for different type of destinations.

### Azure Event Hubs
```json
{
  "properties": {
    "destination": {
            "endpointType": "EventHub",
            "properties": {
                    "resourceId": "/subscriptions/{subscription id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventHub/namespaces/{event-hubs-namespace-instance-name}/eventhubs/{event-hubs-instance-name}"
            }
    },
    "filter": {
            "isSubjectCaseSensitive": false,
            "subjectBeginsWith": "ExamplePrefix",
            "subjectEndsWith": "ExampleSuffix"
    }
  }
}
```
### Service Bus 

The following is a request payload example for creating a event subscription to an **Service Bus Queue** destination.
```json
{
  "properties": {
    "destination": {
            "endpointType": "ServiceBusQueue",
            "properties": {
                    "resourceId": "/subscriptions/{subscription id}/resourceGroups/{resource-group-name}/providers/Microsoft.ServiceBus/namespaces/{service-bus-namespace-instance-name}/queues/{queue-instance-name}"
            }
    },
    "filter": {
            "isSubjectCaseSensitive": false,
            "subjectBeginsWith": "ExamplePrefix",
            "subjectEndsWith": "ExampleSuffix"
    }
  }
}
```
The following is a request payload example for creating a event subscription to an **Service Bus Topic** destination.
```json
{
  "properties": {
    "destination": {
            "endpointType": "ServiceBusTopic",
            "properties": {
                    "resourceId": "/subscriptions/{subscription id}/resourceGroups/{resource-group-name}/providers/Microsoft.ServiceBus/namespaces/{service-bus-namespace-instance-name}/topics/{topic-instance-name}"
            }
    },
    "filter": {
            "isSubjectCaseSensitive": false,
            "subjectBeginsWith": "ExamplePrefix",
            "subjectEndsWith": "ExampleSuffix"
    }
  }
}
```

### Azure Storage Queues

```json
{
  "properties": {
    "destination": {
            "endpointType": "StorageQueue",
            "properties": {
                    "resourceId": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-instance-name}",
                    "queueName": "{queue-instance-name}"
            }
    },
    "filter": {
            "isSubjectCaseSensitive": false,
            "subjectBeginsWith": "ExamplePrefix",
            "subjectEndsWith": "ExampleSuffix"
    }
  }
}
```