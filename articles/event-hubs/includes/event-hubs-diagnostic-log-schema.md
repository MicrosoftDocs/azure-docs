---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 06/11/2021
ms.author: spelluru
ms.custom: "include file"

---

Event Hubs captures diagnostic logs for the following categories:

| Category | Description | 
| -------- | ----------- | 
| Archive Logs | Captures information about [Event Hubs Capture](../event-hubs-capture-overview.md) operations, specifically, logs related to capture errors. |
| Operational Logs | Capture all management operations that are performed on the Azure Event Hubs namespace. Data operations aren't captured, because of the high volume of data operations that are conducted on Azure Event Hubs. |
| Auto scale logs | Captures auto-inflate operations done on an Event Hubs namespace. |
| Kafka coordinator logs | Captures Kafka coordinator operations related to Event Hubs. |
| Kafka user error logs | Captures information about Kafka APIs called on Event Hubs. |
| Event Hubs virtual network (VNet) connection event | Captures information about IP addresses and virtual networks sending traffic to Event Hubs. |
| Customer-managed key user logs | Captures operations related to customer-managed key. |


All logs are stored in JavaScript Object Notation (JSON) format. Each entry has string fields that use the format described in the following sections.

### Archive logs schema

Archive log JSON strings include elements listed in the following table:

Name | Description
------- | -------
`TaskName` | Description of the task that failed
`ActivityId` | Internal ID, used for tracking
`trackingId` | Internal ID, used for tracking
`resourceId` | Azure Resource Manager resource ID
`eventHub` | Event hub full name (includes namespace name)
`partitionId` | Event Hub partition being written to
`archiveStep` | possible values: ArchiveFlushWriter, DestinationInit
`startTime` | Failure start time
`failures` | Number of times the failure occurred
`durationInSeconds` | Duration of failure
`message` | Error message
`category` | ArchiveLogs

The following code is an example of an archive log JSON string:

```json
{
   "TaskName": "EventHubArchiveUserError",
   "ActivityId": "000000000-0000-0000-0000-0000000000000",
   "trackingId": "0000000-0000-0000-0000-00000000000000000",
   "resourceId": "/SUBSCRIPTIONS/000000000-0000-0000-0000-0000000000000/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event Hubs Namespace Name>",
   "eventHub": "<Event Hub full name>",
   "partitionId": "1",
   "archiveStep": "ArchiveFlushWriter",
   "startTime": "9/22/2016 5:11:21 AM",
   "failures": 3,
   "durationInSeconds": 360,
   "message": "Microsoft.WindowsAzure.Storage.StorageException: The remote server returned an error: (404) Not Found. ---> System.Net.WebException: The remote server returned an error: (404) Not Found.\r\n   at Microsoft.WindowsAzure.Storage.Shared.Protocol.HttpResponseParsers.ProcessExpectedStatusCodeNoException[T](HttpStatusCode expectedStatusCode, HttpStatusCode actualStatusCode, T retVal, StorageCommandBase`1 cmd, Exception ex)\r\n   at Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob.<PutBlockImpl>b__3e(RESTCommand`1 cmd, HttpWebResponse resp, Exception ex, OperationContext ctx)\r\n   at Microsoft.WindowsAzure.Storage.Core.Executor.Executor.EndGetResponse[T](IAsyncResult getResponseResult)\r\n   --- End of inner exception stack trace ---\r\n   at Microsoft.WindowsAzure.Storage.Core.Util.StorageAsyncResult`1.End()\r\n   at Microsoft.WindowsAzure.Storage.Core.Util.AsyncExtensions.<>c__DisplayClass4.<CreateCallbackVoid>b__3(IAsyncResult ar)\r\n--- End of stack trace from previous location where exception was thrown ---\r\n   at System.",
   "category": "ArchiveLogs"
}
```

### Operational logs schema

Operational log JSON strings include elements listed in the following table:

Name | Description
------- | -------
`ActivityId` | Internal ID, used for tracking purposes |
`EventName` | Operation name. For a list of values for this element, see the [Event names](#event-names) |
`resourceId` | Azure Resource Manager resource ID |
`SubscriptionId` | Subscription ID |
`EventTimeString` | Operation time |
`EventProperties` |Properties for the operation. This element provides more information about the event as shown in the following example. |
`Status` | Operation status. The value can be either **Succeeded** or **Failed**.  |
`Caller` | Caller of operation (Azure portal or management client) |
`Category` | OperationalLogs |

The following code is an example of an operational log JSON string:

```json
Example:
{
   "ActivityId": "00000000-0000-0000-0000-00000000000000",
   "EventName": "Create EventHub",
   "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-0000000000000/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event Hubs namespace name>",
   "SubscriptionId": "000000000-0000-0000-0000-000000000000",
   "EventTimeString": "9/28/2016 8:40:06 PM +00:00",
   "EventProperties": "{\"SubscriptionId\":\"0000000000-0000-0000-0000-000000000000\",\"Namespace\":\"<Namespace Name>\",\"Via\":\"https://<Namespace Name>.servicebus.windows.net/f8096791adb448579ee83d30e006a13e/?api-version=2016-07\",\"TrackingId\":\"5ee74c9e-72b5-4e98-97c4-08a62e56e221_G1\"}",
   "Status": "Succeeded",
   "Caller": "ServiceBus Client",
   "category": "OperationalLogs"
}
```

#### Event names
Event name is populated as operation type + resource type from the following enumerations. For example, `Create Queue`, `Retrieve Event Hu`, or `Delete Rule`. 

| Operation type | Resource type | 
| -------------- | ------------- | 
| <ul><li>Create</li><li>Update</li><li>Delete</li><li>Retrieve</li><li>Unknown</li></ul> | <ul><li>Namespace</li><li>Queue</li><li>Topic</li><li>Subscription</li><li>EventHub</li><li>EventHubSubscription</li><li>NotificationHub</li><li>NotificationHubTier</li><li>SharedAccessPolicy</li><li>UsageCredit</li><li>NamespacePnsCredentials</li>Rule</li>ConsumerGroup</li> |

### Autoscale logs schema
Autoscale log JSON includes elements listed in the following table:

| Name | Description |
| ---- | ----------- | 
| `TrackingId` | Internal ID, which is used for tracing purposes |
| `ResourceId` | Azure Resource Manager resource ID. |
| `Message` | Informational message, which provides details about auto-inflate action. The message contains previous and current value of throughput unit for a given namespace and what triggered the inflate of the TU. |

Here's an example autoscale event: 

```json
{
    "TrackingId": "fb1b3676-bb2d-4b17-85b7-be1c7aa1967e",
    "Message": "Scaled-up EventHub TUs (UpdateStartTimeUTC: 5/13/2021 7:48:36 AM, PreviousValue: 1, UpdatedThroughputUnitValue: 2, AutoScaleReason: 'IncomingMessagesPerSecond reached 2170')",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name"
}
```

### Kafka coordinator logs schema
Kafka coordinator log JSON includes elements listed in the following table:

| Name | Description |
| ---- | ----------- | 
| `RequestId` | Request ID, which is used for tracing purposes |
| `ResourceId` | Azure Resource Manager resource ID |
| `Operation` | Name of the operation that's done during the group coordination |
| `ClientId` | Client ID |
| `NamespaceName` | Namespace name | 
| `SubscriptionId` | Azure subscription ID |
| `Message` | Informational or warning message, which provides details about actions done during the group coordination. |

#### Example

```json
{
    "RequestId": "FE01001A89E30B020000000304620E2A_KafkaExampleConsumer#0",
    "Operation": "Join.Start",
    "ClientId": "KafkaExampleConsumer#0",
    "Message": "Start join group for new member namespace-name:c:$default:I:KafkaExampleConsumer#0-cc40856f7f3c4607915a571efe994e82, current group size: 0, API version: 2, session timeout: 10000ms, rebalance timeout: 300000ms.",
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "Category": "KafkaCoordinatorLogs"
}
```

### Kafka user error logs schema
Kafka user error log JSON includes elements listed in the following table:

| Name | Description |
| ---- | ----------- |
| `TrackingId` | Tracking ID, which is used for tracing purposes. |
| `NamespaceName` | Namespace name |
| `Eventhub` | Event hub name |
| `PartitionId` | Partition ID |
| `GroupId` | Group ID |
| `ClientId` | Client ID |
| `ResourceId` | Azure Resource Manager resource ID. |
| `Message` | Informational message, which provides details about an error |

### Event Hubs virtual network connection event schema
Event Hubs virtual network (VNet) connection event JSON includes elements listed in the following table:

| Name | Description |
| ---  | ----------- | 
| `SubscriptionId` | Azure subscription ID |
| `NamespaceName` | Namespace name |
| `IPAddress` | IP address of a client connecting to the Event Hubs service |
| `Action` | Action done by the Event Hubs service when evaluating connection requests. Supported actions are **Accept Connection** and **Deny Connection**. |
| `Reason` | Provides a reason why the action was done |
| `Count` | Number of occurrences for the given action |
| `ResourceId` | Azure Resource Manager resource ID. |

Virtual network logs are generated only if the namespace allows access from **selected networks** or from **specific IP addresses** (IP filter rules). If you don't want to restrict the access to your namespace using these features and still want to get virtual network logs to track IP addresses of clients connecting to the Event Hubs namespace, you could use the following workaround. [Enable IP filtering](../event-hubs-ip-filtering.md), and add the total addressable IPv4 range (1.0.0.0/1 - 255.0.0.0/1). Event Hubs IP filtering doesn't support IPv6 ranges. You may see private endpoint addresses in the IPv6 format in the log. 

#### Example

```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "IPAddress": "1.2.3.4",
    "Action": "Deny Connection",
    "Reason": "IPAddress doesn't belong to a subnet with Service Endpoint enabled.",
    "Count": "65",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "Category": "EventHubVNetConnectionEvent"
}
```

### Customer-managed key user logs schema
Customer-managed key user log JSON includes elements listed in the following table:

| Name | Description |
| ---- | ----------- | 
| `Category` | Type of category for a message. It's one of the following values: **error** and **info**. For example, if the key from your key vault is being disabled, then it would be an information category or if a key can't be unwrapped, it could fall under error.|
| `ResourceId` | Internal resource ID, which includes Azure subscription ID and namespace name |
| `KeyVault` | Name of the Key Vault resource |
| `Key` | Name of the Key Vault key that's used to encrypt the Event Hubs namespace. |
| `Version` | Version of the Key Vault key.|
| `Operation` | The operation that's performed on the key in your key vault. For example, disable/enable the key, wrap, or unwrap. |
| `Code` | The code that's associated with the operation. Example: Error code, 404 means that key wasn't found. |
| `Message` | Message, which provides details about an error or informational message |

Here's an example of the  log for a customer managed key:

```json
{
   "TaskName": "CustomerManagedKeyUserLog",
   "ActivityId": "11111111-1111-1111-1111-111111111111",
   "category": "error"
   "resourceId": "/SUBSCRIPTIONS/11111111-1111-1111-1111-11111111111/RESOURCEGROUPS/DEFAULT-EVENTHUB-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/FBETTATI-OPERA-EVENTHUB",
   "keyVault": "https://mykeyvault.vault-int.azure-int.net",
   "key": "mykey",
   "version": "1111111111111111111111111111111",
   "operation": "wrapKey",
   "code": "404",
   "message": "Key not found: ehbyok0/111111111111111111111111111111",
}



{
   "TaskName": "CustomerManagedKeyUserLog",
   "ActivityId": "11111111111111-1111-1111-1111111111111",
   "category": "info"
   "resourceId": "/SUBSCRIPTIONS/111111111-1111-1111-1111-11111111111/RESOURCEGROUPS/DEFAULT-EVENTHUB-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/FBETTATI-OPERA-EVENTHUB",
   "keyVault": "https://mykeyvault.vault-int.azure-int.net",
   "key": "mykey",
   "version": "111111111111111111111111111111",
   "operation": "disable" | "restore",
   "code": "",
   "message": "",
}
```

Following are the common errors codes to look for when BYOK encryption is enabled.

| Action | Error code |	Resulting state of data |
| ------ | ---------- | ----------------------- | 
| Remove wrap/unwrap permission from a key vault | 403 |	Inaccessible |
| Remove AAD role membership from an AAD principal that granted the wrap/unwrap permission | 403 |	Inaccessible |
| Delete an encryption key from the key vault | 404 | Inaccessible |
| Delete the key vault | 404 | Inaccessible (assumes soft-delete is enabled, which is a required setting.) |
| Changing the expiration period on the encryption key such that it's already expired | 403 |	Inaccessible  |
| Changing the NBF (not before) such that key encryption key isn't active | 403 | Inaccessible  |
| Selecting the **Allow MSFT Services** option for the key vault firewall or otherwise blocking network access to the key vault that has the encryption key | 403 | Inaccessible |
| Moving the key vault to a different tenant | 404 | Inaccessible |  
| Intermittent network issue or DNS/AAD/MSI outage |  | Accessible using cached data encryption key |

