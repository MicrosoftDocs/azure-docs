<properties
	pageTitle="Stream Azure Activity Logs to Event Hubs | Microsoft Azure"
	description="Learn how to stream Azure Activity Logs to Event Hubs."
	authors="johnkemnetz"
	manager="rboucher"
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/17/2016"
	ms.author="johnkem"/>

# Stream Azure Activity Logs to Event Hubs
[**Azure Activity Logs**](./monitoring-overview-of-activity-logs.md) can be streamed in near real-time to any application using the built-in “Export” option in the Portal, or by enabling the Service Bus Rule Id in a Log Profile via the Azure PowerShell Cmdlets or Azure CLI.

## What you can do with Activity Logs and Event Hubs
Here are just a few ways you might use the streaming capability for Activity Logs:

- **Stream logs to 3rd party logging and telemetry systems** – Over time, Event Hubs streaming will become the mechanism to pipe your Activity Logs into 3rd party SIEMs and log analytics solutions.
- **Build a custom telemetry and logging platform** – If you already have a custom-built telemetry platform or are just thinking about building one, the highly scalable publish-subscribe nature of Event Hubs allows you to flexibly ingest activity logs. [See Dan Rosanova’s guide to using Event Hubs in a global scale telemetry platform here.](https://azure.microsoft.com/documentation/videos/build-2015-designing-and-sizing-a-global-scale-telemetry-platform-on-azure-event-Hubs/)

## Enable streaming of Activity Logs
You can enable streaming of Activity Logs either programmatically or via the portal. Either way, you will pick a Service Bus Namespace (create on if none exist) the namespace selected will be where the Event Hubs is created (if this is your first time streaming Activity Logs) or streamed to (if you have previously streamed Activity Logs to this namespace), and the policy defines the permissions that the streaming mechanism has. Today, streaming to an Event Hubs requires **Manage**, **Read**, and **Send** permissions. You can create or modify Service Bus Namespace shared access policies in the classic portal under the “Configure” tab for your Service Bus Namespace. To update the Activity Log log profile to include streaming, the client must have the ListKey permission on the Service Bus Authorization Rule.

### Via Azure Portal 
1. Navigate to the **Activity Logs** blade using the menu on the left side of the Portal.
![Navigate to Activity Logs in Portal](./media/monitoring-overview-of-activity-logs/activity-logs-portal-navigate.png)
2. Click the **Export** button at the top of the blade.
![Export button in Portal](./media/monitoring-overview-of-activity-logs/activity-logs-portal-export.png)
3. In the blade that appears, you can select the regions for which you would like to stream events and the Service Bus Namespace in which you would like an Event Hub to be created for streaming these events.
![Export Activity Logs blade](./media/monitoring-overview-of-activity-logs/activity-logs-portal-export-blade.png)
4. Click **Save** to save these settings. The settings will immediately be applied to your subscription.


### Via PowerShell Cmdlets
If a log profile already exists, you will first need to remove that profile.
1. Use `Get-AzureRmLogProfile` to identify if a log profile exists
2. If so, use `Remove-AzureRmLogProfile` to remove it.
3. Use `Set-AzureRmLogProfile` to create a new profile:

```
Add-AzureRmLogProfile -Name my_log_profile -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Locations global,westus,eastus -RetentionInDays 90 -Categories Write,Delete,Action
```

The Service Bus Rule ID will be a string with this format: {service bus resource ID}/authorizationrules/{key name}, for example 

### Via Azure CLI
If a log profile already exists, you will first need to remove that profile.
1. Use `azure insights logprofile list` to identify if a log profile exists
2. If so, use `azure insights logprofile delete` to remove it.
3. Use `azure insights logprofile add` to create a new profile:

```
azure insights logprofile add --name my_log_profile --storageId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Storage/storageAccounts/my_storage --serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey --locations global,westus,eastus,northeurope --retentionInDays 90 –categories Write,Delete,Action
```

The Service Bus Rule ID will be a string with this format: {service bus resource ID}/authorizationrules/{key name}.
 
## How do I consume the log data from Event Hubs?
[The schema for Activity Logs is available here](./monitoring-overview-of-activity-logs.md). Each event is in an array of JSON blobs called “records.”

## Next Steps
- [Read the overview of Activity Logs](../overview-of-activity-logs.md)
- [article2](./insights-auditlog-to-webhook-email.md)
