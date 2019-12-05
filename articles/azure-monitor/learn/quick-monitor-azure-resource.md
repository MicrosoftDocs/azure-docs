---
title: Collect data from an Azure virtual machine with Azure Monitor | Microsoft Docs
description: Learn how to enable the Log Analytics agent VM Extension and enable collection of data from your Azure VMs with Log Analytics.
ms.service:  azure-monitor
ms. subservice: logs
ms.topic: quickstart
author: bwren
ms.author: bwren
ms.date: 12/05/2019
---

# Quickstart: Monitor an Azure resource with Azure Monitor
[Azure Monitor](../overview.md) starts collecting data from Azure resources the moment that they're created. This quickstart shows you how to view metrics and logs that are automatically collected in the Azure portal and how to create diagnostic settings that allow you to collect more detailed information about the resource's operation.

This quickstart uses an Azure storage account as an example, but you can use these procedures with just about any Azure resource. Azure Monitor collects data from all together so you can analyze them using a common set of tools. You can quickly create a new storage account if you want to follow along with this procedure.


## Sign in to Azure portal

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 


## View Activity log
The Azure Activity log collects from your Azure subscription including operations performed on each Azure resource. You can view the Activity log from your resource's menu or from the Azure Monitor menu.

1. In the Azure portal, select **All services** found in the upper left-hand corner. In the list of resources, type **Storage accounts** (or the service that you're using).
2. Select an account from the list.
3. On the left-hand menu, select **Activity log**. This allows you to view the Activity log for the subscription your storage account is in.
4. If you don't see any event, try increasing the **Timespan**.


## View and analyze metrics
Metrics explorer is a tool in the Azure portal that allows you to analyze your collected metrics.

1. Under **Monitoring**, select **Metrics**. This opens metrics explorer with the scope set to your storage account.
2. Metrics are grouped into namespaces. Click **Metric namepspace** to view the list of namespaces for this service. Select **Account**.
4. Click **Metric** to view the metrics in the selected namespace. Select **Transactions**. This graphs the number of transactions for the current storage account over the last 24 hours.


## Create an alert rule
Use alert rules to proactively notify you when a metric value indicates a potential problem.

1. Click **New alert rule**.
2. The resource for the rule is already set to the storage account.
3. Under **Condition** click **Add**. A list of the available metrics is displayed.
4. Select **Queue Count**. A graph is displayed of this value over the last several hours to help you select an appropriate threshold.
5. In **Threshold value**, type *10*.
6. Under **Actions**, click **Create action group** 


## Next steps
In this quickstart, you viewed the metrics and logs for an Azure resource collected in Azure Monitor, created an alert rule based on a metric value, created diagnostic settings to collect resource logs, and then analyzed those resource logs with a log query.  See the following article read more about monitoring Azure resources and discover documentation for more advanced alerting analysis. 

> [!div class="nextstepaction"]
> [Monitoring Azure resources with Azure Monitor](../platform/monitor-azure-resource.md)
