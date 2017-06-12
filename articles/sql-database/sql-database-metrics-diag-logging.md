---
title: Azure SQL database metrics & diagnostics logging | Microsoft Docs
description: Learn about configuring Azure SQL Database resource to store resource usage, connectivity, and query execution statistics.
services: sql-database
documentationcenter: ''
author: vvasic
manager: jhubbard
editor: 

ms.assetid: 89c2a155-c2fb-4b67-bc19-9b4e03c6d3bc
ms.service: sql-database
ms.custom: monitor & tune
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/24/2017
ms.author: vvasic

---
# Azure SQL Database metrics and diagnostics logging 
Azure SQL Database can emit metrics and diagnostic logs for easier monitoring. You can configure Azure SQL Database to store resource usage, workers and sessions, and connectivity into one of these Azure resources:
- **Azure Storage**: For archiving vast amounts of telemetry for a small price
- **Azure Event Hub**: For integrating Azure SQL Database telemetry with your custom monitoring solution or hot pipelines
- **Azure Log Analytics**: For out of the box monitoring solution with reporting, alerting, and mitigating capabilities 

    ![architecture](./media/sql-database-metrics-diag-logging/architecture.png)

## Enable logging

Metrics and diagnostics logging is not enabled by default. You can enable and manage metrics and diagnostics logging using one of the following methods:
- Azure portal
- PowerShell
- Azure CLI
- REST API 
- Resource Manager template

When you enable metrics and diagnostics logging, you need to specify the Azure resource where selected data is collected. Options available:
- Log analytics
- Event Hub
- Azure Storage 

You can provision a new Azure resource or select an existing resource. After selecting the storage resource, you need to specify which data to collect. Options available include:

- **[1-minute metrics](sql-database-metrics-diag-logging.md#1-minute-metrics)** - contains DTU percentage, DTU limit, CPU percentage, Physical data read percentage, Log write percentage, Successful/Failed/Blocked by firewall connections, sessions percentage, workers percentage, storage, storage percentage, XTP storage percentage

If you specify Event Hub or an AzureStorage account, you can specify a retention policy to specify that data that is older than a selected time period is deleted. If you specify Log Analytics, the retention policy depends on the selected pricing tier. Read more about [Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/). 

We recommend that you read both the [Overview of metrics in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview-metrics.md) and [Overview of Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) articles to gain an understanding of not only how to enable logging, but the metrics and log categories supported by the various Azure services.

### Azure portal

To enable metrics and diagnostic logs collection in the Azure portal, navigate to your Azure SQL database or elastic pool page, and then click **Diagnostic settings**.

   ![enable in the Azure portal](./media/sql-database-metrics-diag-logging/enable-portal.png)

### PowerShell

To enable metrics and diagnostics logging using PowerShell, use the following commands:

- To enable storage of Diagnostic Logs in a Storage Account, use this command:

   ```powershell
   Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -StorageAccountId [your storage account id] -Enabled $true
   ```

   The Storage Account ID is the resource id for the storage account to which you want to send the logs.

- To enable streaming of Diagnostic Logs to an Event Hub, use this command:

   ```powershell
   Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -ServiceBusRuleId [your service bus rule id] -Enabled $true
   ```

   The Service Bus Rule ID is a string with this format:

   ```powershell
   {service bus resource ID}/authorizationrules/{key name}
   ``` 

- To enable sending of Diagnostic Logs to a Log Analytics workspace, use this command:

   ```powershell
   Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -WorkspaceId [resource id of the log analytics workspace] -Enabled $true
   ```

- You can obtain the resource id of your Log Analytics workspace using the following command:

   ```powershell
   (Get-AzureRmOperationalInsightsWorkspace).ResourceId
   ```

You can combine these parameters to enable multiple output options.

### CLI

To enable metrics and diagnostics logging using the Azure CLI, use the following commands:

- To enable storage of Diagnostic Logs in a Storage Account, use this command:

   ```azurecli-interactive
   azure insights diagnostic set --resourceId <resourceId> --storageId <storageAccountId> --enabled true
   ```

   The Storage Account ID is the resource id for the storage account to which you want to send the logs.

- To enable streaming of Diagnostic Logs to an Event Hub, use this command:

   ```azurecli-interactive
   azure insights diagnostic set --resourceId <resourceId> --serviceBusRuleId <serviceBusRuleId> --enabled true
   ```

   The Service Bus Rule ID is a string with this format:

   ```azurecli-interactive
   {service bus resource ID}/authorizationrules/{key name}
   ```

- To enable sending of Diagnostic Logs to a Log Analytics workspace, use this command:

   ```azurecli-interactive
   azure insights diagnostic set --resourceId <resourceId> --workspaceId <resource id of the log analytics workspace> --enabled true
   ```

You can combine these parameters to enable multiple output options.

### REST API

Read about how to [change Diagnostic settings using the Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931931.aspx). 

### Resource Manager template

Read about how to [enable Diagnostic settings at resource creation using Resource Manager template](../monitoring-and-diagnostics/monitoring-enable-diagnostic-logs-using-template.md). 

## Stream into Log Analytics 
Azure SQL Database metrics and diagnostic logs can be streamed into Log Analytics using the built-in “Send to Log Analytics” option in the portal, or by enabling Log Analytics in a diagnostic setting via Azure PowerShell cmdlets, Azure CLI, or Azure Monitor REST API.

### Installation overview

Monitoring Azure SQL Database fleet is simple with Log Analytics. Three steps are required:

1.	Create Log Analytics resource
2.	Configure databases to record metrics and diagnostic logs into the created Log Analytics
3.	Install **Azure SQL Analytics** solution from gallery in Log Analytics

### Create Log Analytics resource

1. Click **New** in the left-hand menu.
2. Click **Monitoring + Management**
3. Click **Log Analytics**
4. Fill in the Log Analytics form with the additional information required: workspace name, subscription, resource group, location, and pricing tier.

   ![log analytics](./media/sql-database-metrics-diag-logging/log-analytics.png)

### Configure databases to record metrics and diagnostic logs

The easiest way to configure where databases record their metrics is through the Azure portal. In the Azure portal, navigate to your Azure SQL Database resource and click **Diagnostics settings**. 

### Install the Azure SQL Analytics solution from gallery  

1. Once the Log Analytics resource is created and your data is flowing into it, install Azure SQL Analytics solution. This can be done through the **Solutions Gallery** that you can find on the OMS homepage and in the side menu. In the gallery, find and click **Azure SQL Analytics** solution and click **Add**.

   ![monitoring solution](./media/sql-database-metrics-diag-logging/monitoring-solution.png)

2. On your OMS homepage, a new tile called **Azure SQL Analytics** appears. Selecting this tile opens the Azure SQL Analytics dashboard.

### Using Azure SQL Analytics Solution

Azure SQL Analytics is a hierarchical dashboard that allows you to navigate through the hierarchy of Azure SQL Database resources. This capability enables you to do high-level monitoring but it also enables you to scope your monitoring to just the right set of resources.
Dashboard contains the lists of different resources under the selected resource. For example, for a selected subscription you can see the all servers, elastic pools and databases that belong to the selected subscription. Additionally, for Elastic Pools and databases, you can see the resource usage metrics of that resource. This includes charts for DTU, CPU, IO, LOG, sessions, workers, connections, and storage in GB.

## Stream into Azure Event Hub

Azure SQL Database metrics and diagnostic logs can be streamed into Event Hub using the built-in “Stream to an event hub” option in the portal, or by enabling Service Bus Rule Id in a diagnostic setting via Azure PowerShell Cmdlets, Azure CLI, or Azure Monitor REST API. 

### What to do with metrics and diagnostic logs in Event Hub?
Once the selected data is streamed into Event Hub, you are one step closer to enabling advanced monitoring scenarios. Event Hubs acts as the "front door" for an event pipeline, and once data is collected into an Event Hub, it can be transformed and stored using any real-time analytics provider or batching/storage adapters. Event Hubs decouples the production of a stream of events from the consumption of those events, so that event consumers can access the events on their own schedule. For more information on Event Hub, see:

- [What are Azure Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md)?
- [Get started with Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md)


Here are just a few ways you might use the streaming capability:

-	View service health by streaming “hot path” data to PowerBI - Using Event Hubs, Stream Analytics, and PowerBI, you can easily transform your metrics and diagnostics data into near real-time insights on your Azure services. For an overview of how to set up an Event Hubs, process data with Stream Analytics, and use PowerBI as an output, see [Stream Analytics and Power BI](../stream-analytics/stream-analytics-power-bi-dashboard.md).
-	Stream logs to third-party logging and telemetry streams – Using Event Hubs streaming you can get your metrics and diagnostic logs in to different third-party monitoring and log analytics solutions. 
-	Build a custom telemetry and logging platform – If you already have a custom-built telemetry platform or are just thinking about building one, the highly scalable publish-subscribe nature of Event Hubs allows you to flexibly ingest diagnostic logs. See [Dan Rosanova’s guide to using Event Hubs in a global scale telemetry platform](https://azure.microsoft.com/documentation/videos/build-2015-designing-and-sizing-a-global-scale-telemetry-platform-on-azure-event-Hubs/).

## Stream into Azure Storage

Azure SQL Database metrics and diagnostic logs can be stored into Azure Storage using the built-in "Archive to a storage account” option in the Azure portal, or by enabling Azure Storage in a diagnostic setting via Azure PowerShell Cmdlets, Azure CLI, or Azure Monitor REST API.

### Schema of metrics and diagnostic logs in the storage account

Once you have set up metrics and diagnostic logs collection, a storage container is created in the storage account you selected when the first rows of data are available. The structure of these blobs is:

```powershell
insights-{metrics|logs}-{category name}/resourceId=/SUBSCRIPTIONS/{subscription ID}/ RESOURCEGROUPS/{resource group name}/PROVIDERS/Microsoft.SQL/servers/{resource_server}/ databases/{database_name}/y={four-digit numeric year}/m={two-digit numeric month}/d={two-digit numeric day}/h={two-digit 24-hour clock hour}/m=00/PT1H.json
```
    
Or, more simply:

```powershell
insights-{metrics|logs}-{category name}/resourceId=/{resource Id}/y={four-digit numeric year}/m={two-digit numeric month}/d={two-digit numeric day}/h={two-digit 24-hour clock hour}/m=00/PT1H.json
```

For example, a blob name for 1-minute metrics might be:

```powershell
insights-metrics-minute/resourceId=/SUBSCRIPTIONS/s1id1234-5679-0123-4567-890123456789/RESOURCEGROUPS/TESTRESOURCEGROUP/PROVIDERS/MICROSOFT.SQL/ servers/Server1/databases/database1/y=2016/m=08/d=22/h=18/m=00/PT1H.json
```

In case you want to record the data from the Elastic Pool, blob name is a bit different:

```powershell
insights-{metrics|logs}-{category name}/resourceId=/SUBSCRIPTIONS/{subscription ID}/ RESOURCEGROUPS/{resource group name}/PROVIDERS/Microsoft.SQL/servers/{resource_server}/ elasticPools/{elastic_pool_name}/y={four-digit numeric year}/m={two-digit numeric month}/d={two-digit numeric day}/h={two-digit 24-hour clock hour}/m=00/PT1H.json
```

### Download metrics and logs from Azure storage

See [Download metrics and diagnostic logs from Azure Storage](../storage/storage-dotnet-how-to-use-blobs.md#download-blobs)

## 1-minute metrics

| |  |
|---|---|
|**Resource**|**Metrics**|
|Database|DTU percentage, DTU used, DTU limit, CPU percentage, Physical data read percentage, Log write percentage, Successful/Failed/Blocked by firewall connections, sessions percentage, workers percentage, storage, storage percentage, XTP storage percentage, deadlocks |
|Elastic pool|eDTU percentage, eDTU used, eDTU limit, CPU percentage, Physical data read percentage, Log write percentage, sessions percentage, workers percentage, storage, storage percentage, storage limit, XTP storage percentage |
|||

## Next steps

- Read both the [Overview of metrics in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview-metrics.md) and [Overview of Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) articles to gain an understanding of not only how to enable logging, but the metrics and log categories supported by the various Azure services.
- Read these articles to learn about event hubs:
   - [What are Azure Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md)?
   - [Get started with Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md)
- See [Download metrics and diagnostic logs from Azure Storage](../storage/storage-dotnet-how-to-use-blobs.md#download-blobs)
