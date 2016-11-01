<properties 
   pageTitle="Monitor usage and statistics in an Azure Search service | Microsoft Azure" 
   description="Track resource consumption and index size for Azure Search, a hosted cloud search service on Microsoft Azure." 
   services="search" 
   documentationCenter="" 
   authors="HeidiSteen" 
   manager="jhubbard" 
   editor=""
   tags="azure-portal"/>

<tags
   ms.service="search"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required" 
   ms.date="10/29/2016"
   ms.author="heidist"/>

# Monitor usage and query metrics in an Azure Search service

Azure Search collects statistics about query execution at the service level, including Queries per Second (QPS), latency, and the percentage of queries dropped if volume exceeds capacity. Metrics are visible in the portal via the Monitoring blade.

   ![Screenshot of QPS activity][5]

This article describes metrics for the service all-up. For insights into activity at the index level, enable search traffic analytics and use Power BI to view the analysis. Visit [Search Traffic Analytics for Azure Search](search-traffic-analytics.md) to get started.

## View query throughput statistics

Click the Monitoring tile on the service dashboard to open the Monitoring blade.

   ![Monitoring tile][2]


Query activity at the service level is recorded for query execution, latency, and throttling. Metrics are collected continuously, but it can take several minutes for the portal to show the most recent activity. 

Click a metric tile to view details, add alerts, enable diagnostics, or edit the chart.

  ![Commands on the Metric blade][4]

### Set up alerts

From the metric detail page, you can configure alerts to trigger an email notification if query execution, latency, or throttling activity exceeds criteria defined for it.

### Enable diagnostics

When you turn on diagnostics, you can configure where diagnostic data is stored, whether to include operation logs and metrics, and how long to retain the data.

### Change chart type and data collection interval

For each metric, you can click **edit** to change the visualization from line graph to a bar chart, or modify the x-axis to cover a different time range.

  ![Time range configuration][3]

##View counts and resource usage in the portal 

Tracking the growth of indexes and document size can help you proactively adjust capacity before hitting the upper limit you've established for your service. 

To monitor resource usage, view the counts and statistics for your service in the [portal](https://portal.azure.com). You can also obtain the information programmatically if you are building a custom service administration tool.

1. Sign in to the [portal](https://portal.azure.com). 

2. Open the service dashboard of your Azure Search service. Tiles for the service can be found on the Home page, or you can browse to the service from Browse on the JumpBar. 

The Usage section includes a meter that tells you what portion of available resources are currently in use. For information on per-service limits for indexes, documents, and storage, see [Service limits](search-limits-quotas-capacity.md).

  ![Usage tile][1]

> [AZURE.NOTE] The screenshot above is for the Free service, which has a maximum of one replica and partition each, and can only host 3 indexes, 10,000 documents, or 50 MB of data, whichever comes first. Services created at a Basic or Standard tier have much larger service limits. For more information on choosing a tier, see [Choose a tier or SKU](search-sku-tier.md).

### Get index statistics using the REST API

Both the Azure Search REST API and the .NET SDK provide programmatic access to service metrics.  If you are using [indexers](https://msdn.microsoft.com/library/azure/dn946891.aspx) to load an index from Azure SQL Database or DocumentDB, an additional API is available to get the numbers you require. 

  + [Get Index Statistics](https://msdn.microsoft.com/library/azure/dn798942.aspx)
  + [Count Documents](https://msdn.microsoft.com/library/azure/dn798924.aspx)
  + [Get Indexer Status](https://msdn.microsoft.com/library/azure/dn946884.aspx)

## Next steps

Review [Scale replicas and partitions](search-limits-quotas-capacity.md) for guidance on how to balance the allocation of partitions and replicas for an existing service. 

Visit [Manage your Search service on Microsoft Azure](search-manage.md) for more information on service administration, or [Performance and optimization](search-performance-optimization.md) for tuning guidance.

<!--Image references-->
[1]: ./media/search-monitor-usage/AzureSearch-Monitor1.PNG
[2]: ./media/search-monitor-usage/AzSearch-Monitor-Tile.PNG
[3]: ./media/search-monitor-usage/AzSearch-Monitor-Intervals.PNG
[4]: ./media/search-monitor-usage/AzSearch-Monitor-AlertCmd.PNG
[5]: ./media/search-monitor-usage/AzSearch-Monitor-BarChart.PNG




 
