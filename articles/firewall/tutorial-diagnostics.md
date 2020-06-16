---
title: Tutorial - Monitor Azure Firewall logs and metrics
description: In this tutorial, you learn how to enable and manage Azure Firewall logs and metrics.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: tutorial
ms.date: 10/24/2018
ms.author: victorh
#Customer intent: As an administrator, I want monitor Azure Firewall logs and metrics so that I can track firewall activity.
---
# Tutorial: Monitor Azure Firewall logs and metrics

You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources. Using metrics, you can view performance counters in the portal.

You can access some of these logs through the portal. Logs can be sent to [Azure Monitor logs](../azure-monitor/insights/azure-networking-analytics.md), Storage, and Event Hubs and analyzed in Azure Monitor logs or by different tools such as Excel and Power BI.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enable logging through the Azure portal
> * Enable logging with PowerShell
> * View and analyze the activity log
> * View and analyze the network and application rule logs
> * View metrics


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before starting this tutorial, you should read [Azure Firewall logs and metrics](logs-and-metrics.md) for an overview of the diagnostics logs and metrics available for Azure Firewall.


## Enable diagnostic logging through the Azure portal

It can take a few minutes for the data to appear in your logs after you complete this procedure to turn on diagnostic logging. If you don't see anything at first, check again in  a few more minutes.

1. In the Azure portal, open your firewall resource group and click the firewall.
2. Under **Monitoring**, click **Diagnostic settings**.

   For Azure Firewall, two service-specific logs are available:

   * AzureFirewallApplicationRule
   * AzureFirewallNetworkRule

3. To start collecting data, click **Turn on diagnostics**.
4. The **Diagnostics settings** page provides the settings for the diagnostic logs.
5. In this example, Azure Monitor logs stores the logs, so type **Firewall log analytics** for the name.
6. Click **Send to Log Analytics** to configure your workspace. You can also use event hubs and a storage account to save the diagnostic logs.
7. Under **Log Analytics**, click **Configure**.
8. In the Log Analytics workspaces page, click **Create New Workspace**.
9. On the **Log analytics workspace** page, type **firewall-oms** for the new **Log Analytics workspace** name.
10. Select your subscription, use the existing firewall resource group (**Test-FW-RG**), select **East US** for the location, and select the **Free** pricing tier.
11. Click **OK**.
   ![Starting the configuration process][1]
   OMS workspaces are now referred to as Log Analytics workspaces.  
12. Under **Log**, click **AzureFirewallApplicationRule** and **AzureFirewallNetworkRule** to collect logs for application and network rules.
   ![Save diagnostics settings][2]
13. Click **Save**.

## Enable logging with PowerShell

Activity logging is automatically enabled for every Resource Manager resource. Diagnostic logging must be enabled to start collecting the data available through those logs.

To enable diagnostic logging, use the following steps:

1. Note your storage account's resource ID, where the log data is stored. This value is of the form: */subscriptions/\<subscriptionId\>/resourceGroups/\<resource group name\>/providers/Microsoft.Storage/storageAccounts/\<storage account name\>*.

   You can use any storage account in your subscription. You can use the Azure portal to find this information. The information is located in the resource **Property** page.

2. Note your Firewall's resource ID for which logging is enabled. This value is of the form: */subscriptions/\<subscriptionId\>/resourceGroups/\<resource group name\>/providers/Microsoft.Network/azureFirewalls/\<Firewall name\>*.

   You can use the portal to find this information.

3. Enable diagnostic logging by using the following PowerShell cmdlet:

    ```powershell
    Set-AzDiagnosticSetting  -ResourceId /subscriptions/<subscriptionId>/resourceGroups/<resource group name>/providers/Microsoft.Network/azureFirewalls/<Firewall name> `
   -StorageAccountId /subscriptions/<subscriptionId>/resourceGroups/<resource group name>/providers/Microsoft.Storage/storageAccounts/<storage account name> `
   -Enabled $true     
    ```

> [!TIP]
>Diagnostic logs do not require a separate storage account. The use of storage for access and performance logging incurs service charges.

## View and analyze the activity log

You can view and analyze activity log data by using any of the following methods:

* **Azure tools**: Retrieve information from the activity log through Azure PowerShell, the Azure CLI, the Azure REST API, or the Azure portal. Step-by-step instructions for each method are detailed in the [Activity operations with Resource Manager](../azure-resource-manager/management/view-activity-logs.md) article.
* **Power BI**: If you don't already have a [Power BI](https://powerbi.microsoft.com/pricing) account, you can try it for free. By using the [Azure Activity Logs content pack for Power BI](https://powerbi.microsoft.com/en-us/documentation/powerbi-content-pack-azure-audit-logs/), you can analyze your data with preconfigured dashboards that you can use as is or customize.

## View and analyze the network and application rule logs

[Azure Monitor logs](../azure-monitor/insights/azure-networking-analytics.md) collects the counter and event log files. It includes visualizations and powerful search capabilities to analyze your logs.

For Azure Firewall log analytics sample queries, see [Azure Firewall log analytics samples](log-analytics-samples.md).

You can also connect to your storage account and retrieve the JSON log entries for access and performance logs. After you download the JSON files, you can convert them to CSV and view them in Excel, Power BI, or any other data-visualization tool.

> [!TIP]
> If you are familiar with Visual Studio and basic concepts of changing values for constants and variables in C#, you can use the [log converter tools](https://github.com/Azure-Samples/networking-dotnet-log-converter) available from GitHub.

## View metrics
Browse to an Azure Firewall, under **Monitoring** click **Metrics**. To view the available values, select the **METRIC** drop-down list.

## Next steps

Now that you've configured your firewall to collect logs, you can explore Azure Monitor logs to view your data.

> [!div class="nextstepaction"]
> [Networking monitoring solutions in Azure Monitor logs](../azure-monitor/insights/azure-networking-analytics.md)

[1]: ./media/tutorial-diagnostics/figure1.png
[2]: ./media/tutorial-diagnostics/figure2.png
