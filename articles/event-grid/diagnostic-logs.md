---
title: Azure Event Grid - Diagnostic logs for Azure Event Grid topics and Event Grid domains
description: This article provides conceptual information about diagnostic logs for an Azure Event Grid topic or a domain.
ms.topic: conceptual
ms.date: 11/11/2021
---

# Diagnostic logs for Event Grid Topics and Event Grid Domains

Diagnostic settings allow Event Grid users to capture and view **publish and delivery failure** logs in either a Storage account, an event hub, or a Log Analytics Workspace. This article provides schema for the logs and an example log entry.

## Schema for publish/delivery failure logs

| Property name | Data type | Description |
| ------------- | --------- | ----------- |
| Time | DateTime | The time when the log entry was generated <p>**Example value:**  01-29-2020 09:52:02.700</p> |
| EventSubscriptionName | String | The name of the event subscription <p>**Example value:** "EVENTSUB1"</p> <p>This property exists only for delivery failure logs.</p>  |
| Category | String | The log category name. <p>**Example values:** "DeliveryFailures" or "PublishFailures" | 
| OperationName | String | The name of the operation caused the failure.<p>**Example Values:** "Deliver" for delivery failures. |
| Message | String | The log message for the user explaining the reason for the failure and other additional details. |
| ResourceId | String | The resource ID for the topic/domain resource<p>**Example Values:** `/SUBSCRIPTIONS/SAMPLE-SUBSCRIPTION-ID/RESOURCEGROUPS/SAMPLE-RESOURCEGROUP/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/TOPIC1` |

## Example - Schema for publish/delivery failure logs

```json
{
    "time": "2019-11-01T00:17:13.4389048Z",
    "resourceId": "/SUBSCRIPTIONS/SAMPLE-SUBSCTIPTION-ID /RESOURCEGROUPS/SAMPLE-RESOURCEGROUP-NAME/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/SAMPLE-TOPIC-NAME ",
    "eventSubscriptionName": "SAMPLEDESTINATION",
    "category": "DeliveryFailures",
    "operationName": "Deliver",
    "message": "Message:outcome=NotFound, latencyInMs=2635, id=xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx, systemId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx, state=FilteredFailingDelivery, deliveryTime=11/1/2019 12:17:10 AM, deliveryCount=0, probationCount=0, deliverySchema=EventGridEvent, eventSubscriptionDeliverySchema=EventGridEvent, fields=InputEvent, EventSubscriptionId, DeliveryTime, State, Id, DeliverySchema, LastDeliveryAttemptTime, SystemId, fieldCount=, requestExpiration=1/1/0001 12:00:00 AM, delivered=False publishTime=11/1/2019 12:17:10 AM, eventTime=11/1/2019 12:17:09 AM, eventType=Type, deliveryTime=11/1/2019 12:17:10 AM, filteringState=FilteredWithRpc, inputSchema=EventGridEvent, publisher=DIAGNOSTICLOGSTEST-EASTUS.EASTUS-1.EVENTGRID.AZURE.NET, size=363, fields=Id, PublishTime, SerializedBody, EventType, Topic, Subject, FilteringHashCode, SystemId, Publisher, FilteringTopic, TopicCategory, DataVersion, MetadataVersion, InputSchema, EventTime, fieldCount=15, url=sb://diagnosticlogstesting-eastus.servicebus.windows.net/, deliveryResponse=NotFound: The messaging entity 'sb://diagnosticlogstesting-eastus.servicebus.windows.net/eh-diagnosticlogstest' could not be found. TrackingId:c98c5af6-11f0-400b-8f56-c605662fb849_G14, SystemTracker:diagnosticlogstesting-eastus.servicebus.windows.net:eh-diagnosticlogstest, Timestamp:2019-11-01T00:17:13, referenceId: ac141738a9a54451b12b4cc31a10dedc_G14:"
}
```

The possible values of `Outcome` are `NotFound`, `Aborted`, `TimedOut`, `GenericError`, and `Busy`. Event Grid logs any information it receives from the event handler in the `message`. For example, for `GenericError`, it logs the HTTP status code, error code, and the error message.

## Schema for data plane requests

| Property name | Data type | Description |
| ------------- | --------- | ----------- |
| NetworkAccess | String | Allowed values are: <ul><li>`PublicAccess` - when connecting via public IP</li><li>`PrivateAccess` - when connecting via private link</li></ul> |
| ClientIpAddress | String | Source IP of incoming requests |
| TlsVersion | String | The transport layer security (TLS) version used by the client connection. Possible values are: **1.0**, **1.1** and **1.2** |
| Authentication/Type | String | The type of secret used for authentication when publishing messages. <ul><li>`Key` – request uses the SAS key</li><li>`SASToken` – request uses a SAS token generated from SAS key</li><li>`AADAccessToken` – Azure Active Directory issued JSON Web Token (JWT) token</li><li>`Unknown` – None of the above authentication types. OPTIONS requests will have this authentication type </li></ul> |
| Authentication/ObjectId | String | ObjectId of the service principal used when the authentication type is set to `AADAccessToken` |
| OperationResult | String | Result of the publish. Possible values are: <ul><li>Success</li><li>Unauthorized</li><li>Forbidden</li><li>RequestEntityTooLarge</li><li>BadRequest</li><li>InternalServerError</li></ul> |
| TotalOperations | String | These traces aren't emitted for each publish request. An aggregate for each unique combination of above values is emitted every minute |

## Example - Schema for data plane requests

```json
{
    "time": "2021-10-26T21:44:16.8117322Z",
    "resourceId": "/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/BMT-TEST/PROVIDERS/MICROSOFT.EVENTGRID/DOMAINS/BMTAUDITLOGDOMAIN",
    "operationName": "Microsoft.EventGrid/events/send",
    "category": "DataPlaneRequests",
    "level": "Information",
    "region": "CENTRALUSEUAP",
    "properties": {
        "aggregatedRequests": [
            {
                "networkAccess": "PublicAccess",
                "clientIpAddress": "xx.xx.xx.xxx",
                "tlsVersion": "1.2",
                "authentication": {
                            "type": "AADAccessToken",
                            "objectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx"
                },
                "operationResult": "Success",
                "totalOperations": 1
            }
        ]
    }
}
```

Once the `DataPlaneRequests` diagnostic setting is selected, Event Grid resources will start publishing audit traces for data plane operations including public and private access operations. This trace may log one or more requests if needed.

## Next steps

To learn how to enable diagnostic logs for topics or domains, see [Enable diagnostic logs](enable-diagnostic-logs-topic.md).
