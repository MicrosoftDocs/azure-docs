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