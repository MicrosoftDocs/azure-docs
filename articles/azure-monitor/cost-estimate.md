---
title: Estimate Azure Monitor cost and usage
description: Estimate your usage and costs for Azure Monitor.
services: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.reviewer: Dale.Koetke
ms.date: 03/11/2022
---

# Estimate Azure Monitor cost and usage
If you're not yet using Azure Monitor, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate your costs. In the **Search** box, enter "Azure Monitor", and then select the **Azure Monitor** tile. The pricing calculator will help you estimate your likely costs based on your expected utilization.

The bulk of your costs will typically be from data ingestion and retention for Log Analytics and Application Insights. 

## Estimating log ingestion and retention charges
If you're already evaluating Azure Monitor Logs, you can use your data statistics from your own environment. You can determine the [number of monitored VMs](logs/manage-cost-storage.md#understanding-nodes-sending-data) and the [volume of data that your workspace is ingesting](logs/manage-cost-storage.md#understanding-ingested-data-volume).


For example, with Log Analytics, you can enter the number of virtual machines (VMs) and the gigabytes of data that you expect to collect from each VM. Typically, 1 GB to 3 GB of data per month is ingested from an Azure VM. 

1. **Monitoring VMs:** with typical monitoring enabled, 1 GB to 3 GB of data month is ingested per monitored VM. 
2. **Monitoring Azure Kubernetes Service (AKS) clusters:** details on expected data volumes for monitoring a typical AKS cluster are available [here](containers/container-insights-cost.md#estimating-costs-to-monitor-your-aks-cluster). Follow these [best practices](containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) to control your AKS cluster monitoring costs. 
3. **Application monitoring:** the Azure Monitor pricing calculator includes a data volume estimator using on your application's usage and based on a statistical analysis of  Application Insights data volumes. In the Application Insights section of the pricing calculator, toggle the switch next to "Estimate data volume based on application activity" to use this. 

## Estimating application charges
If you're not yet using Application Insights, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate the cost of using Application Insights. Start by entering "Azure Monitor" in the Search box, and clicking on the resulting Azure Monitor tile. Scroll down the page to Azure Monitor, and expand the Application Insights section. Your estimated costs depend on the amount of log data ingested.  There are two approaches to estimate data volumes:

1. estimate your likely data ingestion based on what other similar applications generate, or 
2. use of default monitoring and adaptive sampling, which is available in the ASP.NET SDK.

### Learn from what similar applications collect

In the Azure Monitoring Pricing calculator for Application Insights, click to enable the **Estimate data volume based on application activity**. Here you can provide inputs about your application (requests per month and page views per month, in case you'll collect client-side telemetry), and then the calculator will tell you the median and 90th percentile amount of data collected by similar applications. These applications span the range of Application Insights configuration (e.g some have default [sampling](app/sampling.md), some have no sampling etc.), so you still have the control to reduce the volume of data you ingest far below the median level using sampling. 

### Data collection when using sampling

With the ASP.NET SDK's [adaptive sampling](app/sampling.md#adaptive-sampling), the data volume is adjusted automatically to keep within a specified maximum rate of traffic for default Application Insights monitoring. If the application produces a low amount of telemetry, such as when debugging or due to low usage, items won't be dropped by the sampling processor as long as volume is below the configured events per second level. For a high volume application, with the default threshold of five events per second, adaptive sampling will limit the number of daily events to 432,000. Considering a typical average event size of 1 KB, this corresponds to 13.4 GB of telemetry per 31-day month per node hosting your application since the sampling is done local to each node.

For SDKs that don't support adaptive sampling, you can employ [ingestion sampling](app/sampling.md#ingestion-sampling), which samples when the data is received by Application Insights based on a percentage of data to retain, or [fixed-rate sampling for ASP.NET, ASP.NET Core, and Java websites](app/sampling.md#fixed-rate-sampling) to reduce the traffic sent from your web server and web browsers



## Next steps

