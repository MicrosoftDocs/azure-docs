---
title: Dead lettering for event subscriptions to namespace topics
description: Describes the dead lettering feature for event subscriptions to namespace topics in Azure Event Grid.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 09/29/2023
---

# Dead lettering for event subscriptions to namespaces topics in Azure Event Grid
This article describes dead lettering for event subscriptions to namespace topics. The dead lettering process moves events in event subscriptions that couldn't be delivered or processed to a supported destination. Currently, Azure Blob Storage is the only supported dead-letter destination.  

Here are a couple of scenarios where dead lettering would happen. 

- [Poison messages](/azure/architecture/guide/technology-choices/messaging#dead-letter-queue-dlq) (pull delivery and push delivery).
- Consumer applications can't handle an event before its lock (pull) or retention expires (pull and push).
- Maximum delivery attempts (pull and push) or time allowed to retry an event (push) has been reached. 

The dead-lettered events are stored in Azure Blob Storage in the CloudEvents JSON format, both structured content and binary content modes. 

## Use cases
Here are a few use cases where you might want to use the dead-letter feature in your applications. 

1. You might want to rehydrate events that can't be processed or delivered so that the expected processing on those events can be done. Rehydrate means to flow the events back into Event Grid in a way that dead-letter events are now delivered as originally intended or as you now see fit. For example, you might decide that some of the dead-letter events might not be critical business-wise to be put back into the data pipeline and hence those events aren't rehydrated.
1. You might want to archive events so that they can be read and analyzed later for audit purposes.
1. You might want to send dead-letter events to data stores or specialized tools that provide a simpler user interface to analyze dead-letter events more quickly.

## Dead-letter format

The format used when storing dead-letter events is the [CloudEvents JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). The dead lettering preserves the schema and format of the event. However, besides the original published event, extra metadata information is persisted with a dead-lettered event. 

- `brokerProperties`: Metadata that describes the error condition that led the event to be dead-lettered. This information is always present. This metadata is described using an object whose key name is `brokerProperties`.
    - `deadletterreason` - The reason for which the event was dead-lettered.
    - `deliveryattempts` - Number of delivery attempts before event was dead-lettered.
    - `deliveryresult` - The last result during the last time the service attempted to deliver the event.
    - `publishutc` - The UTC time at which the event was persisted and accepted (HTTP 200 OK, for example) by Event Grid.
    - `deliveryattemptutc` - The UTC time of the last delivery attempt.
- `customDeliveryProperties` - Headers (custom push delivery properties) configured on the event subscription to go with every outgoing HTTP push delivery request. One or more of these custom properties might be present in the persisted dead-letter JSON. Custom properties identified as secrets aren't stored. This metadata are described using a separate object whose key name is `customDeliveryProperties`. The property key names inside that object and their values are exactly the same as the ones set in the event subscription. Here's an exmaple: 

    ```
    Custom-Header-1: value1
    Custom-Header-2: 32
    ```
    
    They're persisted in the blob using the following object:
    
    ```json
    "customDeliveryProperties" : {
        "custom-header-1": "value1",
        "custom-header-2": "34"
    }
    ```

    The persisted dead lettered event JSON would be: 

    ```json
    {
        "event": {
            "specversion": "1.0",
            "type": "com.example.someevent",
            "source": "/mycontext",
            "id": "A234-1234-1234",
            "time": "2018-04-05T17:31:00Z",
            "comexampleextension1": "value",
            "comexampleothervalue": 5,
            "datacontenttype": "application/json",
            "data": {
                // Event's objects/properties
            }
        },
        "customDeliveryProperties": {
            "custom-header-1": "value1",
            "custom-header-2": "34"
        },
        "deadletterProperties": {
            "deadletterreason": "Undeliverable due to client error",
            "deliveryattempts": 3,
            "deliveryresult": "Unauthorized",
            "publishutc": "2023-06-19T23:28:08.3063899Z",
            "deliveryattemptutc": "2023-06-09T23:28:08.3220145Z"
        }
    }
    ```

The dead-lettered events can be stored in either CloudEvents **structured** mode or **binary** mode. 


### Events that are published using CloudEvents structured mode

With an event published in CloudEvents structured mode:

```http
POST / HTTP/1.1
HOST jfgnspsc2.eastus-1.eventgrid.azure.net/topics/mytopic1
content-type: application/cloudevents+json

{
    "specversion": "1.0",
    "type": "com.example.someevent",
    "source": "/mycontext",
    "id": "A234-1234-1234",
    "time": "2018-04-05T17:31:00Z",
    "comexampleextension1": "value",
    "comexampleothervalue": 5,
    "datacontenttype": "application/json",
    "data": {
        // json event object goes here        
    }
}
```

The following custom delivery properties configured on a push event subscription.

```
Custom-Header-1: value1
Custom-Header-1: 34
```

When the event is dead lettered, the blob created in the Azure Blob Storage with the following JSON format content:

```json
{
    "specversion": "1.0",
    "type": "com.example.someevent",
    "source": "/mycontext",
    "id": "A234-1234-1234",
    "time": "2018-04-05T17:31:00Z",
    "comexampleextension1": "value",
    "comexampleothervalue": 5,
    "datacontenttype": "application/json",
    "data": {
        // Event's objects/properties
    },
    "customDeliveryProperties": {
        "custom-header-1": "value1",
        "custom-header-2": "34"
    },
    "deadletterProperties": {
        "deadletterreason": "Undeliverable due to client error",
        "deliveryattempts": 3,
        "deliveryresult": "Unauthorized",
        "publishutc": "2023-06-19T23:28:08.3063899Z",
        "deliveryattemptutc": "2023-06-09T23:28:08.3220145Z"
    }
}
```

### Events that are published using CloudEvents binary mode

With an event published in CloudEvents binary mode:

```http
POST / HTTP/1.1
HOST jfgnspsc2.eastus-1.eventgrid.azure.net/topics/mytopic1
ce-specversion: 1.0
ce-type: com.example.someevent
ce-source: /mycontext
ce-id: A234-1234-1234
ce-time: 2018-04-05T17:31:00Z
ce-comexampleextension1: value
ce-comexampleothervalue: 5
content-type: application/vnd.apache.thrift.binary

<raw binary data according to encoding specs for media type application/vnd.apache.thrift.binary>
```

The following custom delivery properties configured on a push event subscription.

```
Custom-Header-1: value1
Custom-Header-1: 34
```

The blob created in the Azure Blob Storage is in the following JSON format (same as the one for structured mode). This example demonstrates the use of context attribute `data_base64` that's' used when the HTTP’s `content-type` or `datacontenttype` refers to a binary media type. If the `content-type` or `datacontenttype` refers to a JSON-formatted content (has to be the form `*/json` or `*/*+json`), `data` is used instead of `data_base64`. 

```json
{
    "event": {
        "specversion": "1.0",
        "type": "com.example.someevent",
        "source": "/mycontext",
        "id": "A234-1234-1234",
        "time": "2018-04-05T17:31:00Z",
        "comexampleextension1": "value",
        "comexampleothervalue": 5,
        "datacontenttype": "application/vnd.apache.thrift.binary",
        "data_base64": "...base64 - encoded of binary data encoded according to application / vnd.apache.thrift.binary specs..."
    },
    "customDeliveryProperties": {
        "Custom-Header-1": "value1",
        "Custom-Header-2": "34"
    },
    "deadletterProperties": {
        "deadletterreason": "Undeliverable due to client error",
        "deliveryattempts": 3,
        "deliveryresult": "Unauthorized",
        "publishutc": "2023-06-19T23:28:08.3063899Z",
        "deliveryattemptutc": "2023-06-09T23:28:08.3220145Z"
    }
}
```

## Blob name and folder location

The blob is a JSON file whose filename is a globally unique identifier (GUID). For example, `480b2295-0c38-40d0-b25a-f34b30aac1a9.json`. One or more events can be contained in a single blob. 

The folder structure is as follows: `<container_name>/<namespace_name>/<topic_name>/<event_subscription_name>/<year>/<month>/<day>/<UTC_hour>`. For example: `/<mycontainer/mynamespace/mytopic/myeventsubscription/2023/9/23/2/480b2295-0c38-40d0-b25a-f34b30aac1a9.json`.


## Dead-letter retry logic
You might want to have access to dead-letter events soon after an Azure Storage outage so that you can act on those dead-letters as soon as possible. The retry schedule follows a simple logic and it's not configurable by you. 

- 10 seconds
- 1 minute
- 5 minutes

After the first 5 minutes retry, the service keeps on retrying every 5 minutes up to the maximum retry period. The maximum retry period is 2 days and it's configurable in the event subscriptions property `deliveryRetryPeriodInDays` in event subscription, whichever is met first. If the event isn't successfully stored on the blob after the maximum retry period, the event is dropped and reported as failed dead letter event.

In case the dead-letter retry logic starts before the configured time to live event retention in the event subscription and the remaining time to live is less than the retry period configured (say, there are just 4 hours remaining for the event and there are 2 days configured as `deliverRetryPeriod` for the dead-letter), the broker keeps the event to honor the retry logic up to the maximum configured dead-letter’s delivery retry period.

## Configure dead-letter 
Here are the steps to configure dead-letter on your event subscriptions. 

1. [Enable managed identity for the namespace](event-grid-namespace-managed-identity.md).
1. Grant identity the write access to the Azure storage account. Use the **Access control** page of the storage account in the Azure portal to add the identity of the namespace to the **Storage Blob Data Contributor** role.
1. Configure dead letter as shown in the following sections. 

### Use Resource Manager template

Here's an example **Resource manager template** JSON snippet. You can also use the system assigned managed identity (`SystemAssigned`).

```json
{
    "deadLetterDestinationWithResourceIdentity": {
    "deliveryRetryPeriodInDays": 2,
    "endpointType": "StorageBlob",
    "StorageBlob": {
        "blobContainerName": "data",
        "resourceId": "/subscriptions/0000000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentity": "/subscriptions/0000000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myusermsi"
		}
	}
}
```

### Use Azure portal

When creating an event subscription, you can enable dead-lettering and configure it as shown in the following image.

:::image type="content" source="./media/dead-letter-event-subscriptions-namespace-topics/create-subscription-dead-letter-setting.png" alt-text="Screenshot that shows the Create Subscription page that shows the dead letter settings.":::

For an existing subscription: 

1. Navigate to the **Event Subscription** page for your namespace topic.
1. Select **Configuration** on the left menu.
1. Select **Enable dead-lettering** to enable the feature.
1. Select the **Azure subscription** that has the Azure Storage account where the dead-lettered events are stored. 
1. Select the **blob container** that holds the blobs with dead-lettered events.
1. To use a managed identity, for **Managed identity type**, select the type of managed identity that you want to use to connect to the storage account, and configure it. 

    :::image type="content" source="./media/dead-letter-event-subscriptions-namespace-topics/existing-subscription-dead-letter-settings.png" alt-text="Screenshot that shows the Configuration tab of Event Subscription page that shows the dead letter settings.":::


## Next steps

- For an introduction to Event Grid, see [About Event Grid](overview.md).
- To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
