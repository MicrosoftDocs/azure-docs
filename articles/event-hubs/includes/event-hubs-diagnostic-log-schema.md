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
| Runtime Audit Logs | Capture aggregated diagnostic information for all data plane access operations (such as send or receive events) in Event Hubs. |
| Application Metric Logs | Capture the aggregated information on certain metrics related to data plane operations. |


All logs are stored in JavaScript Object Notation (JSON) format. Each entry has string fields that use the format described in the following sections.

### Archive logs schema

Archive log JSON strings include elements listed in the following table:

Name | Description | Supported in Azure Diagnostics | Supported in AZMSArchiveLogs (Resource specific table)
------- | ------- | ------| ------
`TaskName` | Description of the task that failed | Yes | Yes
`ActivityId` | Internal ID, used for tracking | Yes | Yes
`trackingId` | Internal ID, used for tracking | Yes | Yes
`resourceId` | Azure Resource Manager resource ID | yes | Yes
`eventHub` | Event hub full name (includes namespace name)| Yes | No
`EventhubName`| Name of event hub entity | No | Yes
`partitionId` | Event Hub partition being written to | Yes | Yes
`archiveStep` | possible values: ArchiveFlushWriter, DestinationInit | Yes | Yes
`startTime` | Failure start time | Yes | No
`Time Generated (UTC)` | Timestamp of operation | No | Yes
`failures` | Number of times the failure occurred | Yes | Yes
`durationInSeconds` | Duration of failure | Yes | Yes
`message` | Error message | Yes | Yes
`category` | Log Category | Yes | No
 `Provider`|Name of Service emitting the logs e.g., Event Hubs | No | Yes 
 `Type`  | Type of log emitted| No | Yes

The following code is an example of an archive log JSON string:

AzureDiagnostics: 

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
Resource specific table entry:
```json
{
   "TaskName": "EventHubArchiveUserError",
   "ActivityId": "000000000-0000-0000-0000-0000000000000",
   "trackingId": "0000000-0000-0000-0000-00000000000000000",
   "resourceId": "/SUBSCRIPTIONS/000000000-0000-0000-0000-0000000000000/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event Hubs Namespace Name>",
   "EventHubName": "<Event Hub full name>",
   "partitionId": "1",
   "archiveStep": "ArchiveFlushWriter",
   "TimeGenerated(UTC)": "9/22/2016 5:11:21 AM",
   "failures": 3,
   "durationInSeconds": 360,
   "message": "Microsoft.WindowsAzure.Storage.StorageException: The remote server returned an error: (404) Not Found. ---> System.Net.WebException: The remote server returned an error: (404) Not Found.\r\n   at Microsoft.WindowsAzure.Storage.Shared.Protocol.HttpResponseParsers.ProcessExpectedStatusCodeNoException[T](HttpStatusCode expectedStatusCode, HttpStatusCode actualStatusCode, T retVal, StorageCommandBase`1 cmd, Exception ex)\r\n   at Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob.<PutBlockImpl>b__3e(RESTCommand`1 cmd, HttpWebResponse resp, Exception ex, OperationContext ctx)\r\n   at Microsoft.WindowsAzure.Storage.Core.Executor.Executor.EndGetResponse[T](IAsyncResult getResponseResult)\r\n   --- End of inner exception stack trace ---\r\n   at Microsoft.WindowsAzure.Storage.Core.Util.StorageAsyncResult`1.End()\r\n   at Microsoft.WindowsAzure.Storage.Core.Util.AsyncExtensions.<>c__DisplayClass4.<CreateCallbackVoid>b__3(IAsyncResult ar)\r\n--- End of stack trace from previous location where exception was thrown ---\r\n   at System.",
   "Provider":"EVENTHUB",
   "Type":"AZMSArchiveLogs"
}
```

### Operational logs schema

Operational log JSON strings include elements listed in the following table:

Name | Description | Supported in AzureDiagnostics | Supported in AZMSOperationalLogs (Resource specific table) 
------- | -------| ----| -----| 
`ActivityId` | Internal ID, used for tracking purposes | Yes | Yes 
`EventName` | Operation name. For a list of values for this element, see the [Event names](#event-names) | Yes | Yes
`resourceId` | Azure Resource Manager resource ID | Yes | Yes
`SubscriptionId` | Subscription ID | Yes | Yes 
`EventTimeString` | Operation time | Yes | No
`Time Generated (UTC)` | Timestamp of operation | No | Yes
`EventProperties` |Properties for the operation. This element provides more information about the event as shown in the following example. | Yes | Yes
`Status` | Operation status. The value can be either **Succeeded** or **Failed**.  | Yes | Yes
`Caller` | Caller of operation (Azure portal or management client) | Yes | Yes
`Category` | Log Category | Yes | No
`Provider`|Name of Service emitting the logs e.g., Event Hubs | No | Yes 
 `Type`  | Type of logs emitted | No | Yes

The following code is an example of an operational log JSON string:

AzureDiagnostics:

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
Resource specific table entry:

```json
Example:
{
   "ActivityId": "00000000-0000-0000-0000-00000000000000",
   "EventName": "Create EventHub",
   "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-0000000000000/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event Hubs namespace name>",
   "SubscriptionId": "000000000-0000-0000-0000-000000000000",
   "TimeGenerated (UTC)": "9/28/2016 8:40:06 PM +00:00",
   "EventProperties": "{\"SubscriptionId\":\"0000000000-0000-0000-0000-000000000000\",\"Namespace\":\"<Namespace Name>\",\"Via\":\"https://<Namespace Name>.servicebus.windows.net/f8096791adb448579ee83d30e006a13e/?api-version=2016-07\",\"TrackingId\":\"5ee74c9e-72b5-4e98-97c4-08a62e56e221_G1\"}",
   "Status": "Succeeded",
   "Caller": "ServiceBus Client",
   "Provider": "EVENTHUB",
   "Type":"AZMSOperationalLogs"
}
```

#### Event names
Event name is populated as operation type + resource type from the following enumerations. For example, `Create Queue`, `Retrieve Event Hub`, or `Delete Rule`. 

| Operation type | Resource type |
| -------------- | ------------- |
|- Create<br>- Update<br>- Delete<br>- Retrieve<br>- Unknown | - Namespace<br>- Queue<br>- Topic<br>- Subscription<br>- EventHub<br>- SharedAccessPolicy<br>- UsageCredit<br>- Rule<br>- ConsumerGroup |


### Autoscale logs schema
Autoscale log JSON includes elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSAutoscaleLogs (Resource specific table) 
| ---- | ----------- |----| ----|  
| `TrackingId` | Internal ID, which is used for tracing purposes | Yes | Yes
| `ResourceId` | Azure Resource Manager resource ID. | Yes | Yes
| `Message` | Informational message, which provides details about auto-inflate action. The message contains previous and current value of throughput unit for a given namespace and what triggered the inflate of the TU. | Yes | Yes
|`Time Generated (UTC)` | Timestamp of operation | No | Yes
|`Provider`|Name of Service emitting the logs e.g., Event Hubs | No | Yes 
|`Type`  | Type of logs emitted | No | Yes

Here's an example autoscale event: 

AzureDiagnostics:

```json
{
    "TrackingId": "fb1b3676-bb2d-4b17-85b7-be1c7aa1967e",
    "Message": "Scaled-up EventHub TUs (UpdateStartTimeUTC: 5/13/2021 7:48:36 AM, PreviousValue: 1, UpdatedThroughputUnitValue: 2, AutoScaleReason: 'IncomingMessagesPerSecond reached 2170')",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name"
}
```
Resource specific table entry:

```json
{
    "TrackingId": "fb1b3676-bb2d-4b17-85b7-be1c7aa1967e",
    "Message": "Scaled-up EventHub TUs (UpdateStartTimeUTC: 5/13/2021 7:48:36 AM, PreviousValue: 1, UpdatedThroughputUnitValue: 2, AutoScaleReason: 'IncomingMessagesPerSecond reached 2170')",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "timeGenerated (UTC) : "9/28/2022 8:40:06 PM +00:00",
    "Provider" : "EVENTHUB",
    "Type" : "AZMSAutoscaleLogs"
}
```
### Kafka coordinator logs schema
Kafka coordinator log JSON includes elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSKafkaCoordinatorLogs (Resource specific table) 
| ---- | ----------- |----|----| 
| `RequestId` | Request ID, which is used for tracing purposes | Yes | Yes
| `ResourceId` | Azure Resource Manager resource ID | Yes | Yes
| `Operation` | Name of the operation that's done during the group coordination | Yes | Yes
| `ClientId` | Client ID | Yes | Yes
| `NamespaceName` | Namespace name | Yes | Yes
| `SubscriptionId` | Azure subscription ID | Yes | Yes
| `Message` | Informational or warning message, which provides details about actions done during the group coordination. | Yes | Yes 
|`Time Generated (UTC)` | Timestamp of operation | No | Yes
|`Provider`|Name of Service emitting the logs e.g., ServiceBus | No | Yes 
|`Type`  | Type of log emitted | No | Yes

#### Example

AzureDiagnostics:

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
Resource Specific table entry:

```json
{
    "RequestId": "FE01001A89E30B020000000304620E2A_KafkaExampleConsumer#0",
    "Operation": "Join.Start",
    "ClientId": "KafkaExampleConsumer#0",
    "Message": "Start join group for new member namespace-name:c:$default:I:KafkaExampleConsumer#0-cc40856f7f3c4607915a571efe994e82, current group size: 0, API version: 2, session timeout: 10000ms, rebalance timeout: 300000ms.",
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "Time Generated (UTC) ": "9/28/2022 8:40:06 PM +00:00", 
    "Provider" : "EVENTHUB",
    "Type" : "AZMSKafkaCoordinatorLogs"
}
```

### Kafka user error logs schema

Kafka user error log JSON includes elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSKafkaUserErrorLogs (Resource specific table)
| ---- | ----------- |----| ----| 
| `TrackingId` | Tracking ID, which is used for tracing purposes. | Yes | Yes 
| `NamespaceName` | Namespace name | Yes | Yes
| `Eventhub` | Event hub name | Yes | Yes 
| `PartitionId` | Partition ID | Yes | Yes 
| `GroupId` | Group ID | Yes | Yes 
| `ClientId` | Client ID | Yes | Yes
| `ResourceId` | Azure Resource Manager resource ID. | Yes | Yes 
| `Message` | Informational message, which provides details about an error | Yes | Yes 
|`TimeGenerated (UTC)` | Timestamp for executed operation | No | Yes 
|`Provider` | Name of service emitting the logs e.g., Event Hubs | No | Yes 
| `Type` | Type of log emitted | NO | Yes 

### Event Hubs virtual network connection event schema
Event Hubs virtual network (VNet) connection event JSON includes elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSVNetConnectionevents (Resource specific table) | 
| ---  | ----------- |-----| -----|
| `SubscriptionId` | Azure subscription ID | Yes | Yes 
| `NamespaceName` | Namespace name | Yes | Yes 
| `IPAddress` | IP address of a client connecting to the Event Hubs service | Yes | Yes
| `Action` | Action done by the Event Hubs service when evaluating connection requests. Supported actions are **Accept Connection** and **Deny Connection**. | Yes | Yes
| `Reason` | Provides a reason why the action was done | Yes | No
| `Message` | Provides a reason why the action was done | No | Yes 
| `Count` | Number of occurrences for the given action | Yes | Yes
| `ResourceId` | Azure Resource Manager resource ID. | Yes | Yes 
|`Time Generated (UTC)` | Timestamp of operation | No | Yes
|`Provider`|Name of Service emitting the logs e.g., ServiceBus | No | Yes 
|`Type`  | AZMSVNetConnectionevents | No | Yes

Virtual network logs are generated only if the namespace allows access from **selected networks** or from **specific IP addresses** (IP filter rules). If you don't want to restrict the access to your namespace using these features and still want to get virtual network logs to track IP addresses of clients connecting to the Event Hubs namespace, you could use the following workaround. [Enable IP filtering](../event-hubs-ip-filtering.md), and add the total addressable IPv4 range (1.0.0.0/1 - 255.0.0.0/1). Event Hubs IP filtering doesn't support IPv6 ranges. You may see private endpoint addresses in the IPv6 format in the log. 

#### Example

AzureDiagnostics:

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
Resource specific table entry:

```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "IPAddress": "1.2.3.4",
    "Action": "Deny Connection",
    "Message": "IPAddress doesn't belong to a subnet with Service Endpoint enabled.",
    "Count": "65",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "Provider": "EVENTHUB",
    "Time Generated (UTC) ": "9/28/2022 8:40:06 PM +00:00",
    "Type" : "AZMSKafkauserErrorlogs"
     
}
```
### Customer-managed key user logs schema
Customer-managed key user log JSON includes elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSCustomerManagedKeyUserLogs (Resource specific table) 
| ---- | ----------- |-----|-----| 
| `Category` | Type of category for a message. It's one of the following values: **error** and **info**. For example, if the key from your key vault is being disabled, then it would be an information category or if a key can't be unwrapped, it could fall under error.| Yes | Yes
| `ResourceId` | Internal resource ID, which includes Azure subscription ID and namespace name | Yes | Yes
| `KeyVault` | Name of the Key Vault resource | Yes | Yes 
| `Key` | Name of the Key Vault key that's used to encrypt the Event Hubs namespace. | Yes | Yes 
| `Version` | Version of the Key Vault key.| Yes | Yes
| `Operation` | The operation that's performed on the key in your key vault. For example, disable/enable the key, wrap, or unwrap. | Yes | Yes 
| `Code` | The code that's associated with the operation. Example: Error code, 404 means that key wasn't found. | Yes | Yes 
| `Message` | Message, which provides details about an error or informational message | Yes | Yes 
|`Time Generated (UTC)` | Timestamp of operation | No | Yes
|`Provider`|Name of Service emitting the logs e.g., ServiceBus | No | Yes 
|`Type`  | Type of log emitted | No | Yes

Here's an example of the  log for a customer managed key:

AzureDiagnostics:

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
   "message": "Key not found: ehbyok0/111111111111111111111111111111"
}
{
   "TaskName": "CustomerManagedKeyUserLog",
   "ActivityId": "11111111111111-1111-1111-1111111111111",
   "category": "info"
   "resourceId": "/SUBSCRIPTIONS/111111111-1111-1111-1111-11111111111/RESOURCEGROUPS/DEFAULT-EVENTHUB-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/FBETTATI-OPERA-EVENTHUB",
   "keyVault": "https://mykeyvault.vault-int.azure-int.net",
   "key": "mykey",
   "version": "111111111111111111111111111111",
   "operation": "disable | restore",
   "code": "",
   "message": ""
}
```
Resource specific table entry:

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
   "Provider": "EVENTHUB",
   "Time Generated (UTC) ": "9/28/2022 8:40:06 PM +00:00",
   "Type" : "AZMSCustomerManagedKeyUserLogs"
}
{
   "TaskName": "CustomerManagedKeyUserLog",
   "ActivityId": "11111111111111-1111-1111-1111111111111",
   "category": "info"
   "resourceId": "/SUBSCRIPTIONS/111111111-1111-1111-1111-11111111111/RESOURCEGROUPS/DEFAULT-EVENTHUB-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/FBETTATI-OPERA-EVENTHUB",
   "keyVault": "https://mykeyvault.vault-int.azure-int.net",
   "key": "mykey",
   "version": "111111111111111111111111111111",
   "operation": "disable | restore",
   "code": "",
   "message": "",
   "Provider": "EVENTHUB",
   "Time Generated (UTC) ": "9/28/2022 8:40:06 PM +00:00",
   "Type" : "AZMSCustomerManagedKeyUserLogs"
  
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

