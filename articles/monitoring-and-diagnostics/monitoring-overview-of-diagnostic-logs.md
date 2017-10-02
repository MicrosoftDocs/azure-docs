---
title: Overview of Azure Diagnostic Logs | Microsoft Docs
description: Learn what Azure diagnostic logs are and how you can use them to understand events occurring within an Azure resource.
author: johnkemnetz
manager: orenr
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: fe8887df-b0e6-46f8-b2c0-11994d28e44f
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2017
ms.author: johnkem; magoedte

---
# Collect and consume log data from your Azure resources

## What are Azure resource diagnostic logs
**Azure resource-level diagnostic logs** are logs emitted by a resource that provide rich, frequent data about the operation of that resource. The content of these logs varies by resource type. For example, Network Security Group rule counters and Key Vault audits are two categories of resource logs.

Resource-level diagnostic logs differ from the [Activity Log](monitoring-overview-activity-logs.md). The Activity Log provides insight into the operations that were performed on resources in your subscription using Resource Manager, for example, creating a virtual machine or deleting a logic app. The Activity Log is a subscription-level log. Resource-level diagnostic logs provide insight into operations that were performed within that resource itself, for example, getting a secret from a Key Vault.

Resource-level diagnostic logs also differ from guest OS-level diagnostic logs. Guest OS diagnostic logs are those collected by an agent running inside of a virtual machine or other supported resource type. Resource-level diagnostic logs require no agent and capture resource-specific data from the Azure platform itself, while guest OS-level diagnostic logs capture data from the operating system and applications running on a virtual machine.

Not all resources support the new type of resource diagnostic logs described here. This article contains a section listing which resource types support the new resource-level diagnostic logs.

![Resource diagnostics logs vs other types of logs ](./media/monitoring-overview-of-diagnostic-logs/Diagnostics_Logs_vs_other_logs_v5.png)

## What you can do with resource-level diagnostic logs
Here are some of the things you can do with resource diagnostic logs:

![Logical placement of Resource Diagnostic Logs](./media/monitoring-overview-of-diagnostic-logs/Diagnostics_Logs_Actions.png)


* Save them to a [**Storage Account**](monitoring-archive-diagnostic-logs.md) for auditing or manual inspection. You can specify the retention time (in days) using **resource diagnostic settings**.
* [Stream them to **Event Hubs**](monitoring-stream-diagnostic-logs-to-event-hubs.md) for ingestion by a third-party service or custom analytics solution such as PowerBI.
* Analyze them with [OMS Log Analytics](../log-analytics/log-analytics-azure-storage.md)

You can use a storage account or Event Hubs namespace that is not in the same subscription as the one emitting logs. The user who configures the setting must have the appropriate RBAC access to both subscriptions.

## Resource diagnostic settings
Resource diagnostic logs for non-Compute resources are configured using resource diagnostic settings. **Resource diagnostic settings** for a resource control:

* Where resource diagnostic logs and metrics are sent (Storage Account, Event Hubs, and/or OMS Log Analytics).
* Which log categories are sent and whether metric data is also sent.
* How long each log category should be retained in a storage account
    - A retention of zero days means logs are kept forever. Otherwise, the value can be any number of days between 1 and 2147483647.
    - If retention policies are set but storing logs in a Storage Account is disabled (for example, if only Event Hubs or OMS options are selected), the retention policies have no effect.
    - Retention policies are applied per-day, so at the end of a day (UTC), logs from the day that is now beyond the retention policy are deleted. For example, if you had a retention policy of one day, at the beginning of the day today the logs from the day before yesterday would be deleted.

These settings are easily configured via the diagnostic settings for a resource in the Azure portal, via Azure PowerShell and CLI commands, or via the [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931943.aspx).

> [!WARNING]
> Diagnostic logs and metrics for from the guest OS layer of Compute resources (for example, VMs or Service Fabric) use [a separate mechanism for configuration and selection of outputs](../azure-diagnostics.md).
>
>

## How to enable collection of resource diagnostic logs
Collection of resource diagnostic logs can be enabled [as part of creating a resource in a Resource Manager template](./monitoring-enable-diagnostic-logs-using-template.md) or after a resource is created from that resource's page in the portal. You can also enable collection at any point using Azure PowerShell or CLI commands, or using the Azure Monitor REST API.

> [!TIP]
> These instructions may not apply directly to every resource. See the schema links at the bottom of this page to understand special steps that may apply to certain resource types.
>
>

### Enable collection of resource diagnostic logs in the portal
You can enable collection of resource diagnostic logs in the Azure portal after a resource has been created either by going to a specific resource or by navigating to Azure Monitor. To enable this via Azure Monitor:

1. In the [Azure portal](http://portal.azure.com), navigate to Azure Monitor and click on **Diagnostic Settings**

    ![Monitoring section of Azure Monitor](media/monitoring-overview-of-diagnostic-logs/diagnostic-settings-blade.png)

2. Optionally filter the list by resource group or resource type, then click on the resource for which you would like to set a diagnostic setting.

3. If no settings exist on the resource you have selected, you are prompted to create a setting. Click "Turn on diagnostics."

   ![Add diagnostic setting - no existing settings](media/monitoring-overview-of-diagnostic-logs/diagnostic-settings-none.png)

   If there are existing settings on the resource, you will see a list of settings already configured on this resource. Click "Add diagnostic setting."

   ![Add diagnostic setting - existing settings](media/monitoring-overview-of-diagnostic-logs/diagnostic-settings-multiple.png)

3. Give your setting a name, check the boxes for each destination to which you would like to send data, and configure which resource is used for each destination. Optionally, set a number of days to retain these logs by using the **Retention (days)** sliders (only applicable to the storage account destination). A retention of zero days stores the logs indefinitely.
   
   ![Add diagnostic setting - existing settings](media/monitoring-overview-of-diagnostic-logs/diagnostic-settings-configure.png)
    
4. Click **Save**.

After a few moments, the new setting appears in your list of settings for this resource, and diagnostic logs are sent to the specified destinations as soon as new event data is generated.

### Enable collection of resource diagnostic logs via PowerShell
To enable collection of resource diagnostic logs via Azure PowerShell, use the following commands:

To enable storage of diagnostic logs in a storage account, use this command:

```powershell
Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -StorageAccountId [your storage account id] -Enabled $true
```

The storage account ID is the resource ID for the storage account to which you want to send the logs.

To enable streaming of diagnostic logs to an event hub, use this command:

```powershell
Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -ServiceBusRuleId [your Service Bus rule id] -Enabled $true
```

The service bus rule ID is a string with this format: `{Service Bus resource ID}/authorizationrules/{key name}`.

To enable sending of diagnostic logs to a Log Analytics workspace, use this command:

```powershell
Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -WorkspaceId [resource id of the log analytics workspace] -Enabled $true
```

You can obtain the resource ID of your Log Analytics workspace using the following command:

```powershell
(Get-AzureRmOperationalInsightsWorkspace).ResourceId
```

You can combine these parameters to enable multiple output options.

### Enable collection of resource diagnostic logs via CLI
To enable collection of resource diagnostic logs via the Azure CLI, use the following commands:

To enable storage of diagnostic logs in a Storage Account, use this command:

```azurecli
azure insights diagnostic set --resourceId <resourceId> --storageId <storageAccountId> --enabled true
```

The storage account ID is the resource ID for the storage account to which you want to send the logs.

To enable streaming of diagnostic logs to an event hub, use this command:

```azurecli
azure insights diagnostic set --resourceId <resourceId> --serviceBusRuleId <serviceBusRuleId> --enabled true
```

The service bus rule ID is a string with this format: `{Service Bus resource ID}/authorizationrules/{key name}`.

To enable sending of diagnostic logs to a Log Analytics workspace, use this command:

```azurecli
azure insights diagnostic set --resourceId <resourceId> --workspaceId <resource id of the log analytics workspace> --enabled true
```

You can combine these parameters to enable multiple output options.

### Enable collection of resource diagnostic logs via REST API
To change diagnostic settings using the Azure Monitor REST API, see [this document](https://msdn.microsoft.com/library/azure/dn931931.aspx).

## Manage resource diagnostic settings in the portal
Ensure that all of your resources are set up with diagnostic settings. Navigate to **Monitor** in the portal and open **Diagnostic settings**.

![Diagnostic Logs blade in the portal](./media/monitoring-overview-of-diagnostic-logs/diagnostic-settings-nav.png)

You may have to click "More services" to find the Monitor section.

Here you can view and filter all resources that support diagnostic settings to see if they have diagnostics enabled. You can also drill down to see if multiple settings are set on a resource and check which storage account, Event Hubs namespace, and/or Log Analytics workspace that data are flowing to.

![Diagnostic Logs results in portal](./media/monitoring-overview-of-diagnostic-logs/diagnostic-settings-blade.png)

Adding a diagnostic setting brings up the Diagnostic Settings view, where you can enable, disable, or modify your diagnostic settings for the selected resource.

## Supported services, categories, and schemas for resource diagnostic logs
[See this article](monitoring-diagnostic-logs-schema.md) for a complete list of supported services and the log categories and schemas used by those services.

## Next steps

* [Stream resource diagnostic logs to **Event Hubs**](monitoring-stream-diagnostic-logs-to-event-hubs.md)
* [Change resource diagnostic settings using the Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931931.aspx)
* [Analyze logs from Azure storage with Log Analytics](../log-analytics/log-analytics-azure-storage.md)
