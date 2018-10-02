---
title: Stream the Azure Activity Log to Event Hubs
description: Learn how to stream the Azure Activity Log to Event Hubs.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 07/25/2018
ms.author: johnkem
ms.component: activitylog
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
You can enable streaming of the Activity Log either programmatically or via the portal. Either way, you pick an Event Hubs namespace and a shared access policy for that namespace. An event hub with the name insights-logs-operationallogs is created in that namespace when the first new Activity Log event occurs. 

If you don't have an Event Hubs namespace, you first need to create one. If you previously streamed Activity Log events to this Event Hubs namespace, the event hub that was previously created will be reused. 

The shared access policy defines the permissions that the streaming mechanism has. Today, streaming to Event Hubs requires **Manage**, **Send**, and **Listen** permissions. You can create or modify shared access policies for the Event Hubs namespace in the Azure portal under the **Configure** tab for your Event Hubs namespace. 

To update the Activity Log log profile to include streaming, the user who's making the change must have the ListKey permission on that Event Hubs authorization rule. The Event Hubs namespace does not have to be in the same subscription as the subscription that's emitting logs, as long as the user who configures the setting has appropriate RBAC access to both subscriptions and both subscriptions are in the same AAD tenant.

### Via the Azure portal
1. Browse to the **Activity Log** section by using the **All services** search on the left side of the portal.
   
   ![Selecting Activity Log from the list of services in the portal](./media/monitoring-stream-activity-logs-event-hubs/activity.png)
2. Select the **Export** button at the top of the log.
   
   ![Export button in the portal](./media/monitoring-stream-activity-logs-event-hubs/export.png)

   Note that the filter settings you had applied while viewing the Activity Log in the previous view have no impact on your export settings. Those are only for filtering what you see while browsing through your Activity Log in the portal.
3. In the section that appears, select **All regions**. Do not select particular regions.
   
   ![Export section](./media/monitoring-stream-activity-logs-event-hubs/export-audit.png)

   > [!WARNING]  
   > If you select anything other than **All regions**, you'll miss key events that you expect to receive. The Activity Log is a global (non-regional) log, so most events do not have a region associated with them. 
   >

4. Click the **Azure Event Hubs** option, and select an event hubs namespace to which logs should be sent, then click **OK**.
5. Select **Save** to save these settings. The settings are immediately applied to your subscription.
6. If you have several subscriptions, repeat this action and send all the data to the same event hub.

### Via PowerShell cmdlets
If a log profile already exists, you first need to remove the existing log profile and then create a new log profile.

1. Use `Get-AzureRmLogProfile` to identify if a log profile exists.  If a log profile does exist, locate the *name* property.
2. Use `Remove-AzureRmLogProfile` to remove the log profile using the value from the *name* property.

    ```powershell
    # For example, if the log profile name is 'default'
    Remove-AzureRmLogProfile -Name "default"
    ```
3. Use `Add-AzureRmLogProfile` to create a new log profile:

   ```powershell
   # Settings needed for the new log profile
   $logProfileName = "default"
   $locations = (Get-AzureRmLocation).Location
   $locations += "global"
   $subscriptionId = "<your Azure subscription Id>"
   $resourceGroupName = "<resource group name your event hub belongs to>"
   $eventHubNamespace = "<event hub namespace>"

   # Build the service bus rule Id from the settings above
   $serviceBusRuleId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.EventHub/namespaces/$eventHubNamespace/authorizationrules/RootManageSharedAccessKey"

   Add-AzureRmLogProfile -Name $logProfileName -Location $locations -ServiceBusRuleId $serviceBusRuleId
   ```

### Via Azure CLI
If a log profile already exists, you first need to remove the existing log profile and then create a new log profile.

1. Use `az monitor log-profiles list` to identify if a log profile exists.
2. Use `az monitor log-profiles delete --name "<log profile name>` to remove the log profile using the value from the *name* property.
3. Use `az monitor log-profiles create` to create a new log profile:

   ```azurecli-interactive
   az monitor log-profiles create --name "default" --location null --locations "global" "eastus" "westus" --categories "Delete" "Write" "Action"  --enabled false --days 0 --service-bus-rule-id "/subscriptions/<YOUR SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventHub/namespaces/<EVENT HUB NAME SPACE>/authorizationrules/RootManageSharedAccessKey"
   ```

## Consume the log data from Event Hubs
The schema for the Activity Log is available in [Monitor subscription activity with the Azure Activity Log](monitoring-overview-activity-logs.md). Each event is in an array of JSON blobs called *records*.

## Next steps
* [Archive the Activity Log to a storage account](monitoring-archive-activity-log.md)
* [Read the overview of the Azure Activity Log](monitoring-overview-activity-logs.md)
* [Set up an alert based on an Activity Log event](insights-auditlog-to-webhook-email.md)

