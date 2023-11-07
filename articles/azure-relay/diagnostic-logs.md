---
title: Diagnostics logs for Hybrid Connections
description: This article provides an overview of all the activity and diagnostics logs that are available for Azure Relay. 
ms.topic: how-to
ms.date: 06/21/2022
---
# Enable diagnostics logs for Azure Relay Hybrid Connections
When you start using your Azure Relay Hybrid Connections, you might want to monitor how and when your listeners and senders are opened and closed, and how your Hybrid Connections are created and messages are sent. This article provides an overview of activity and diagnostics logs provided by the Azure Relay service. 

You can view two types of logs for Azure Relay:

- [Activity logs](../azure-monitor/essentials/platform-logs-overview.md): These logs have information about operations performed against your namespace in the Azure portal or through Azure Resource Manager template. These logs are always enabled. For example: "Create or update namespace", "Create or update hybrid connection". 
- [Diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md): You can configure diagnostic logs for a richer view of everything that happens with operations and actions that are conducted against your namespace by using the API, or through language SDK.

## View activity logs
To view activity logs for your Azure Relay namespace, switch to the **Activity log** page in the Azure portal.

![Azure Relay - activity log](./media/diagnostic-logs/activity-log.png)

## Enable diagnostic logs

> [!NOTE]
> Diagnostic logs are available only for Hybrid Connections, not for Windows Communication Foundation (WCF) Relay.

To enable diagnostics logs, do the following steps:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Relay namespace and then, under **Monitoring**, select  **Diagnostic settings**.
1. On the **Diagnostics settings** page, select **Add diagnostic setting**.  

   ![The "Add diagnostic setting" link](./media/diagnostic-logs/add-diagnostic-setting.png)

1. Configure the diagnostics settings by doing the following steps:
    1. In the **Name** box, enter a name for the diagnostics settings.  
    2. Select **HybridConnectionsEvent** for the type of log. 
    3. Select one of the following three **destinations** for your diagnostics logs:  
        1. If you select **Archive to a storage account**, configure the storage account where the diagnostics logs will be stored.  
        2. If you select **Stream to an event hub**, configure the event hub that you want to stream the diagnostics logs to.
        3. If you select **Send to Log Analytics**, specify which instance of Log Analytics the diagnostics will be sent to.  

        ![Sample diagnostic settings](./media/diagnostic-logs/sample-diagnostic-settings.png)
1. Select **Save** on the toolbar to save the settings.

The new settings take effect in about 10 minutes. The logs are displayed in the configured archival target, in the **Diagnostics logs** pane. For more information about configuring diagnostics settings, see the [overview of Azure diagnostics logs](../azure-monitor/essentials/platform-logs-overview.md).


## Schema for hybrid connections events
Hybrid Connections event log JSON strings include the elements listed in the following table:

| Name | Description |
| ------- | ------- |
| ResourceId | Azure Resource Manager resource ID |
| ActivityId | Internal ID, used to identify the specified operation. May also be known as "TrackingId" |
| Endpoint | The address of the Relay resource |
| OperationName | The type of the Hybrid Connections operation that’s  being logged |
| EventTimeString | The UTC timestamp of the log record |
| Message | The detailed message of the event |
| Category | Category of the event. Currently, there is only `HybridConnectionsEvents`. 


## Sample hybrid connections event
Here's a sample hybrid connections event in JSON format. 

```json
{
    "resourceId": "/SUBSCRIPTIONS/0000000000-0000-0000-0000-0000000000000/RESOURCEGROUPS/MyResourceGroup/PROVIDERS/MICROSOFT.RELAY/NAMESPACES/MyRelayNamespace",
    "ActivityId": "7006a0db-27eb-445c-939b-ce86133014cc",
    "endpoint": "sb://myrelaynamespace.servicebus.windows.net/myhybridconnection/7006a0db-27eb-445c-939b-ce86133014cc_G5",
    "operationName": "Microsoft.Relay/HybridConnections/NewSenderRegistering",
    "EventTimeString": "2020-04-27T20:27:57.3842810Z",
    "message": "A new sender is registering.",
    "category": "HybridConnectionsEvent"
}
```


## Schema for VNet/IP Filtering Connection Logs
Hybrid Connections VNet/IP Filtering Connection Logs include elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSVnetConnectionEvents (Resource specific table) 
| ---  | ----------- |---| ---| 
| `SubscriptionId` | Azure subscription ID | Yes | Yes
| `NamespaceName` | Namespace name | Yes | Yes
| `IPAddress` | IP address of a client connecting to the Service Bus service | Yes | Yes 
| `AddressIP` | IP address of client connecting to service bus | Yes | Yes
| `TimeGenerated [UTC]`|Time of executed operation (in UTC) | Yes | Yes 
| `Action` | Action done by the Service Bus service when evaluating connection requests. Supported actions are **Accept Connection** and **Deny Connection**. | Yes | Yes 
| `Reason` | Provides a reason why the action was done | Yes | Yes
| `Count` | Number of occurrences for the given action | Yes | Yes
| `ResourceId` | Azure Resource Manager resource ID. | Yes | Yes
| `Category` |  Log Category | Yes | No
| `Provider`|Name of Service emitting the logs e.g., ServiceBus | No | Yes 
|  `Type`  | Type of Logs Emitted | No | Yes

> [!NOTE] 
> Virtual network logs are generated only if the namespace allows access from selected networks or from specific IP addresses (IP filter rules).

## Sample VNet and IP Filtering Logs
Here's an example of a virtual network log JSON string:

AzureDiagnostics:
```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "IPAddress": "1.2.3.4",
    "Action": "Accept Connection",
    "Reason": "IP is accepted by IPAddress filter.",
    "Count": 1,
    "ResourceId": "/SUBSCRIPTIONS/<AZURE SUBSCRIPTION ID>/RESOURCEGROUPS/<RESOURCE GROUP NAME>/PROVIDERS/MICROSOFT.RELAY/NAMESPACES/<RELAY NAMESPACE NAME>",
    "Category": "VNetAndIPFilteringLogs"
}
```
Resource specific table entry:
```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "AddressIp": "1.2.3.4",
    "Action": "Accept Connection",
    "Message": "IP is accepted by IPAddress filter.",
    "Count": 1,
    "ResourceId": "/SUBSCRIPTIONS/<AZURE SUBSCRIPTION ID>/RESOURCEGROUPS/<RESOURCE GROUP NAME>/PROVIDERS/MICROSOFT.RELAY/NAMESPACES/<RELAY NAMESPACE NAME>",
    "Provider" : "RELAY",
    "Type": "AZMSVNetConnectionEvents"
}
```


## Events and operations captured in diagnostic logs

| Operation                           | Description                                                     |
|-------------------------------------|-----------------------------------------------------------------|
| AuthorizationFailed                 | Authorization failed.                                           |
| InvalidSasToken                     | Invalid SAS token.                                              |
| ListenerAcceptingConnection         | The listener is accepting connection.                           |
| ListenerAcceptingConnectionTimeout  | The listener accepting connection has timed out.                |
| ListenerAcceptingHttpRequestFailed  | The listener accepting HTTP request failed due to an exception. |
| ListenerAcceptingRequestTimeout     | The listener accepting request has timed out.                   |
| ListenerClosingFromExpiredToken     | The listener is closing because the security token has expired. |
| ListenerRejectedConnection          | The listener has rejected the connection.                       |
| ListenerReturningHttpResponse       | The listener is returning an HTTP response.                     |
| ListenerReturningHttpResponseFailed | The listener is returning an HTTP response with a failure code. |
| ListenerSentHttpResponse            | Relay service has received an HTTP response from the listener.  |
| ListenerUnregistered                | The listener is unregistered.                                   |
| ListenerUnresponsive                | The listener is unresponsive when returning a response.         |
| MessageSendingToListener            | Message is being sent to listener.                              |
| MessageSentToListener               | Message is sent to listener.                                    |
| NewListenerRegistered               | New listener registered.                                        |
| NewSenderRegistering                | New sender is registering.                                      |
| ProcessingRequestFailed             | The processing of a Hybrid Connection operation has failed.     |
| SenderConnectionClosed              | The sender connection is closed.                                |
| SenderListenerConnectionEstablished | The sender and listener established connection successfully.    |
| SenderSentHttpRequest               | The sender sent an HTTP request.                                |


## Next steps

To learn more about Azure Relay, see:

* [Introduction to Azure Relay](relay-what-is-it.md)
* [Get started with Relay Hybrid Connections](relay-hybrid-connections-dotnet-get-started.md)
