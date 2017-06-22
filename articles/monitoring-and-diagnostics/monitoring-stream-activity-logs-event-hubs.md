---
title: Stream the Azure Activity Log to Event Hubs | Microsoft Docs
description: Learn how to stream the Azure Activity Log to Event Hubs.
author: johnkemnetz
manager: rboucher
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: ec4c2d2c-8907-484f-a910-712403a06829
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 6/06/2017
ms.author: johnkem

---
# Stream the Azure Activity Log to Event Hubs
The [**Azure Activity Log**](monitoring-overview-activity-logs.md) can be streamed in near real time to any application using the built-in “Export” option in the portal, or by enabling the Service Bus Rule Id in a Log Profile via the Azure PowerShell Cmdlets or Azure CLI.

## What you can do with the Activity Log and Event Hubs
Here are just a few ways you might use the streaming capability for the Activity Log:

* **Stream to third-party logging and telemetry systems** – Over time, Event Hubs streaming will become the mechanism to pipe your Activity Log into third-party SIEMs and log analytics solutions.
* **Build a custom telemetry and logging platform** – If you already have a custom-built telemetry platform or are just thinking about building one, the highly scalable publish-subscribe nature of Event Hubs allows you to flexibly ingest the activity log. [See Dan Rosanova’s guide to using Event Hubs in a global scale telemetry platform here.](https://azure.microsoft.com/documentation/videos/build-2015-designing-and-sizing-a-global-scale-telemetry-platform-on-azure-event-Hubs/)

## Enable streaming of the Activity Log
You can enable streaming of the Activity Log either programmatically or via the portal. Either way, you pick a Service Bus Namespace and a shared access policy for that namespace, and an Event Hub is created in that namespace when the first new Activity Log event occurs. If you do not have a Service Bus Namespace, you first need to create one. If you have previously streamed Activity Log events to this Service Bus Namespace, the Event Hub that was previously created will be reused. The shared access policy defines the permissions that the streaming mechanism has. Today, streaming to an Event Hubs requires **Manage**, **Send**, and **Listen** permissions. You can create or modify Service Bus Namespace shared access policies in the classic portal under the “Configure” tab for your Service Bus Namespace. To update the Activity Log log profile to include streaming, the user making the change must have the ListKey permission on that Service Bus Authorization Rule.

The service bus or event hub namespace does not have to be in the same subscription as the subscription emitting logs as long as the user who configures the setting has appropriate RBAC access to both subscriptions.

### Via Azure portal
1. Navigate to the **Activity Log** blade using the menu on the left side of the portal.
   
    ![Navigate to Activity Log in portal](./media/monitoring-overview-activity-logs/activity-logs-portal-navigate.png)
2. Click the **Export** button at the top of the blade.
   
    ![Export button in portal](./media/monitoring-overview-activity-logs/activity-logs-portal-export.png)
3. In the blade that appears, you can select the regions for which you would like to stream events and the Service Bus Namespace in which you would like an Event Hub to be created for streaming these events.
   
    ![Export Activity Log blade](./media/monitoring-overview-activity-logs/activity-logs-portal-export-blade.png)
4. Click **Save** to save these settings. The settings are immediately be applied to your subscription.

### Via PowerShell Cmdlets
If a log profile already exists, you first need to remove that profile.

1. Use `Get-AzureRmLogProfile` to identify if a log profile exists
2. If so, use `Remove-AzureRmLogProfile` to remove it.
3. Use `Set-AzureRmLogProfile` to create a profile:

```
Add-AzureRmLogProfile -Name my_log_profile -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Locations global,westus,eastus -RetentionInDays 90 -Categories Write,Delete,Action
```

The Service Bus Rule ID is a string with this format: {service bus resource ID}/authorizationrules/{key name}, for example 

### Via Azure CLI
If a log profile already exists, you first need to remove that profile.

1. Use `azure insights logprofile list` to identify if a log profile exists
2. If so, use `azure insights logprofile delete` to remove it.
3. Use `azure insights logprofile add` to create a profile:

```
azure insights logprofile add --name my_log_profile --storageId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Storage/storageAccounts/my_storage --serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey --locations global,westus,eastus,northeurope --retentionInDays 90 –categories Write,Delete,Action
```

The Service Bus Rule ID is a string with this format: `{service bus resource ID}/authorizationrules/{key name}`.

## How do I consume the log data from Event Hubs?
[The schema for the Activity Log is available here](monitoring-overview-activity-logs.md). Each event is in an array of JSON blobs called “records.”

## Next Steps
* [Archive the Activity Log to a storage account](monitoring-archive-activity-log.md)
* [Read the overview of the Azure Activity Log](monitoring-overview-activity-logs.md)
* [Set up an alert based on an Activity Log event](insights-auditlog-to-webhook-email.md)

