---
title: Stream the Azure Activity Log to Event Hubs | Microsoft Docs
description: Learn how to stream the Azure Activity Log to Event Hubs.
author: johnkemnetz
manager: orenr
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: ec4c2d2c-8907-484f-a910-712403a06829
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/30/2018
ms.author: johnkem

---
# Stream the Azure Activity Log to Event Hubs
You can stream the [Azure Activity Log](monitoring-overview-activity-logs.md) in near real time to any application by either:

* Using the built-in **Export** option in the portal
* Enabling the Azure Service Bus rule ID in a log profile via the Azure PowerShell cmdlets or Azure CLI

## What you can do with the Activity Log and Event Hubs
Here are two ways you might use the streaming capability for the Activity Log:

* **Stream to third-party logging and telemetry systems**: Over time, Azure Event Hubs streaming will become the mechanism to pipe your Activity Log into third-party SIEMs and log analytics solutions.
* **Build a custom telemetry and logging platform**: If you already have a custom-built telemetry platform or are thinking about building one, the highly scalable publish-subscribe nature of Event Hubs enables you to flexibly ingest the activity log. For more information, see [Dan Rosanova’s video about using Event Hubs in a global-scale telemetry platform](https://azure.microsoft.com/documentation/videos/build-2015-designing-and-sizing-a-global-scale-telemetry-platform-on-azure-event-Hubs/).

## Enable streaming of the Activity Log
You can enable streaming of the Activity Log either programmatically or via the portal. Either way, you pick a Service Bus namespace and a shared access policy for that namespace. An event hub is created in that namespace when the first new Activity Log event occurs. 

If you don't have a Service Bus namespace, you first need to create one. If you previously streamed Activity Log events to this Service Bus namespace, the event hub that was previously created will be reused. 

The shared access policy defines the permissions that the streaming mechanism has. Today, streaming to Event Hubs requires **Manage**, **Send**, and **Listen** permissions. You can create or modify shared access policies for the Service Bus namespace in the Azure portal under the **Configure** tab for your Service Bus namespace. 

To update the Activity Log log profile to include streaming, the user who's making the change must have the ListKey permission on that Service Bus authorization rule. The Service Bus or Event Hubs namespace does not have to be in the same subscription as the subscription that's emitting logs, as long as the user who configures the setting has appropriate RBAC access to both subscriptions.

### Via the Azure portal
1. Browse to the **Activity Log** pane by using the **All services** search on the left side of the portal.
   
   ![Selecting Activity Log from the list of services in the portal](./media/monitoring-stream-activity-logs-event-hubs/activity.png)
2. Select the **Export** button at the top of **Activity Log** pane.
   
   ![Export button in the portal](./media/monitoring-stream-activity-logs-event-hubs/export.png)
3. In the pane that appears, select the regions for which you want to stream events. Also select the Service Bus namespace in which you want to create an event hub for streaming these events. Select **All regions**.
   
   ![Export Activity Log pane](./media/monitoring-stream-activity-logs-event-hubs/export-audit.png)
4. Select **Save** to save these settings. The settings are immediately applied to your subscription.
5. If you have several subscriptions, repeat this action and send all the data to the same event hub.

### Via PowerShell cmdlets
If a log profile already exists, you first need to remove that profile.

1. Use `Get-AzureRmLogProfile` to identify if a log profile exists.
2. If so, use `Remove-AzureRmLogProfile` to remove it.
3. Use `Set-AzureRmLogProfile` to create a profile:

   ```powershell

   Add-AzureRmLogProfile -Name my_log_profile -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Locations global,westus,eastus -RetentionInDays 90 -Categories Write,Delete,Action

   ```

The Service Bus rule ID is a string with this format: `{service bus resource ID}/authorizationrules/{key name}`. 

### Via Azure CLI
If a log profile already exists, you first need to remove that profile.

1. Use `azure insights logprofile list` to identify if a log profile exists.
2. If so, use `azure insights logprofile delete` to remove it.
3. Use `azure insights logprofile add` to create a profile:

   ```azurecli-interactive
   azure insights logprofile add --name my_log_profile --storageId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Storage/storageAccounts/my_storage --serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey --locations global,westus,eastus,northeurope --retentionInDays 90 –categories Write,Delete,Action
   ```

The Service Bus rule ID is a string with this format: `{service bus resource ID}/authorizationrules/{key name}`.

## Consume the log data from Event Hubs
The schema for the Activity Log is available in [Monitor subscription activity with the Azure Activity Log](monitoring-overview-activity-logs.md). Each event is in an array of JSON blobs called *records*.

## Next steps
* [Archive the Activity Log to a storage account](monitoring-archive-activity-log.md)
* [Read the overview of the Azure Activity Log](monitoring-overview-activity-logs.md)
* [Set up an alert based on an Activity Log event](insights-auditlog-to-webhook-email.md)

