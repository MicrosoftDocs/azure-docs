---
title: Manage usage and costs for Azure Monitor Logs
description: Learn how to change the pricing plan and manage data volume and retention policy for your Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Estimate your Azure Monitor costs

## Estimating the costs to manage your environment 

If you're not yet using Azure Monitor Logs, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate the cost of using Log Analytics. In the **Search** box, enter "Azure Monitor", and then select the resulting Azure Monitor tile. Scroll down the page to **Azure Monitor**, and then expand the **Log Analytics** section. Here you can enter the GB of data that you expect to collect. If you're already evaluating Azure Monitor Logs, you can use data statistics from your own environment. See below for how to determine the [number of monitored VMs](#understanding-nodes-sending-data) and the [volume of data your workspace is ingesting](#understanding-ingested-data-volume). If you're not yet running Log Analytics, here is some guidance for estimating data volumes:

1. **Monitoring VMs:** with typical monitoring enabled, 1 GB to 3 GB of data month is ingested per monitored VM. 
2. **Monitoring Azure Kubernetes Service (AKS) clusters:** details on expected data volumes for monitoring a typical AKS cluster are available [here](../containers/container-insights-cost.md#estimating-costs-to-monitor-your-aks-cluster). Follow these [best practices](../containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) to control your AKS cluster monitoring costs. 
3. **Application monitoring:** the Azure Monitor pricing calculator includes a data volume estimator using on your application's usage and based on a statistical analysis of  Application Insights data volumes. In the Application Insights section of the pricing calculator, toggle the switch next to "Estimate data volume based on application activity" to use this. 

### Estimate the costs to manage your environment

If you're not yet using Azure Monitor Logs, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate the cost of using Azure Monitor. Start by entering **Azure Monitor** in the **Search** box, and then selecting the **Azure Monitor** tile. Scroll down the page to **Azure Monitor**, and select one of the options from the **Type** dropdown list:

- **Metrics queries and Alerts**  
- **Log Analytics**
- **Application Insights**

In each of these types, the pricing calculator will help you estimate your likely costs based on your expected utilization.

For example, with Log Analytics, you can enter the number of virtual machines (VMs) and the gigabytes of data that you expect to collect from each VM. Typically, 1 GB to 3 GB of data per month is ingested from an Azure VM. If you're already evaluating Azure Monitor Logs, you can use your data statistics from your own environment. You can determine the [number of monitored VMs](logs/manage-cost-storage.md#understanding-nodes-sending-data) and the [volume of data that your workspace is ingesting](logs/manage-cost-storage.md#understanding-ingested-data-volume).

For Application Insights, if you enable the **Estimate data volume based on application activity** functionality, you can provide inputs about your application (requests per month and page views per month, if you'll collect client-side telemetry). Then the calculator will tell you the median and 90th percentile amount of data that similar applications collect. 

These applications span the range of Application Insights configurations. For example, some have default sampling, some have no sampling, and some have custom sampling. So you still have the control to reduce the volume of data that you ingest to far below the median level by using sampling. But this is a starting point to understand what similar customers are seeing. [Learn more about estimating costs for Application Insights](app/pricing.md#estimating-the-costs-to-manage-your-application).
