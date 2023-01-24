---
title: Syslog collection with Container Insights | Microsoft Docs
description: This article describes how to collect Syslog from AKS nodes using Container insights.
ms.topic: conceptual
ms.date: 01/31/2023
ms.reviewer: damendo
---

# Syslog collection with Container Insights

Container Insights offers the ability to collect Syslog events from your Linux nodes in AKS. Customers can use Syslog for monitoring security and health events, typically by ingesting syslog into SIEM systems like [Microsoft Sentinel](https://azure.microsoft.com/products/microsoft-sentinel/#overview).  

## Pre-requisites 

1.	You will need to have managed identity authentication enabled on your cluster. To enable, see [migrate your AKS cluster to managed identity authentication](container-insights-enable-existing-clusters.md?tabs=azure-cli#migrate-to-managed-identity-authentication). Note: This which will create a Data Collection Rule (DCR) named `MSCI-<WorkspaceRegion>-<ClusterName` 
2.	Minimum versions of Azure components
  - **Azure CLI**: Minimum version required for Azure CLI is [2.44.1 (link to release notes)](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#january-11-2023). See [How to update the Azure CLI](https://learn.microsoft.com/cli/azure/update-azure-cli)) for upgrade instructions. 
  - **Azure CLI AKS-Preview Extension**: Minimum version required for AKS-Preview Azure CLI extension is [ 0.5.125 (link to release notes)](https://github.com/Azure/azure-cli-extensions/blob/main/src/aks-preview/HISTORY.rst#05125). See [How to update extensions](https://learn.microsoft.com/cli/azure/azure-cli-extensions-overview#how-to-update-extensions) for upgrade guidance. 
  - **Linux image version**: Minimum version for AKS node linux image is 2022.11.01. See [Upgrade Azure Kubernetes Service (AKS) node images](https://learn.microsoft.com/azure/aks/node-image-upgrade) for upgrade help. 

## How to enable Syslog
  
## [CLI](#tab/azure-cli)

New cluster

```azurecli
az aks create -g syslog-rg -n new-cluster --enable-managed-identity --node-count 1 --enable-addons monitoring --enable-msi-auth-for-monitoring --enable-syslog --generate-ssh-key`
```
  
Existing cluster

```azurecli
az aks enable-addons -a monitoring --enable-msi-auth-for-monitoring --enable-syslog -g syslog-rg -n existing-cluster`
```


## How to access Syslog data
 
### Azure Monitor 

Syslog can be accessed from your Log Analytics workspace using the portal by selecting the relevant subscription. 

Image 1 - Azure Monitor overerview

:::image type="content" source="media/container-insights-syslog/AzMon1.png" lightbox="media/container-insights-syslog/AzMon1.png" alt-text="Azure Monitor overerview in Azure Portal" border="false":::  

Image 2 - Pre-built queries in portal

:::image type="content" source="media/container-insights-syslog/AzMon2.png" lightbox="media/container-insights-syslog/AzMon2.png" alt-text="Logs tab in the Azure Monitor Portal UI" border="false":::  
  
Image 3 - Syslog query loaded in the query editor 

:::image type="content" source="media/container-insights-syslog/AzMon3.png" lightbox="media/container-insights-syslog/AzMon3.png" alt-text="Syslog query loaded in the query editor in the Azure Monitor Portal UI" border="false":::    
  
### AKS Cluster view

Image 1 - AKS Cluster overview

:::image type="content" source="media/container-insights-syslog/AKS1.png" lightbox="media/container-insights-syslog/AKS1.png" alt-text="Overview tab for an AKS Cluster " border="false":::  
  
Image 2 - Logs tab under Monitoring section

:::image type="content" source="media/container-insights-syslog/AKS2.png" lightbox="media/container-insights-syslog/AKS2.png" alt-text="Logs tab under Monitoring section in the AKS Cluster Portal UI" border="false":::  
  
Image 3 - Query editor

:::image type="content" source="media/container-insights-syslog/AKS3.png" lightbox="media/container-insights-syslog/AKS3.png" alt-text="Query editor under Monitoring section in the AKS Cluster Portal UI" border="false":::  
  
Image 4 - Syslog query loaded in the query editor 
  
:::image type="content" source="media/container-insights-syslog/AKS4.png" lightbox="media/container-insights-syslog/AKS4.png" alt-text="Query editor with Syslog query." border="false":::
  
### Sample queries
  
The following table provides different examples of log queries that retrieve Syslog records.

| Query | Description |
|:--- |:--- |
| Syslog |All Syslogs |
| Syslog </br> &#124; where SeverityLevel == "error" |All Syslog records with severity of error |
| Syslog </br> &#124; summarize AggregatedValue = count() by Computer |Count of Syslog records by computer |
| Syslog </br> &#124; summarize AggregatedValue = count() by Facility |Count of Syslog records by facility |  

## Editing your Syslog collection settings

Image 1 - Data Collection Rules under Azure Monitor

:::image type="content" source="media/container-insights-syslog/DCR1.png" lightbox="media/container-insights-syslog/DCR1.png" alt-text="Data Collection Rules tab in the Azure Monitor portal UI" border="false":::

Image 2 - Editing an individual Syslog data collection rule 

:::image type="content" source="media/container-insights-syslog/DCR2.png" lightbox="media/container-insights-syslog/DCR2.png" alt-text="Overview of individual Syslog data collection rule" border="false":::

Image 3 - Data Sources tab for Syslog data collection rule

:::image type="content" source="media/container-insights-syslog/DCR3.png" lightbox="media/container-insights-syslog/DCR3.png" alt-text="Data Sources tab for Syslog data collection rule" border="false":::

Image 4 -  Configuration panel for Syslog data collection rule

:::image type="content" source="media/container-insights-syslog/DCR4.png" lightbox="media/container-insights-syslog/DCR4.png" alt-text="Configuration panel for Syslog data collection rule" border="false":::


## How Syslog data is collected

## Known limitations

- *Onboarding* - Syslog collection can only be enabled from command line. Enablement from the Azure Portal will be added before GA release. 
- *Container restart data loss* – Agent Container restarts can lead to syslog data loss, this is a known issue and will be fixed before GA release. 

## Next steps

- Read more about [Syslog record properties](https://docs.microsoft.com/azure/azure-monitor/agents/data-sources-syslog#syslog-record-properties)
- See more sample [log queries with Syslog records](https://docs.microsoft.com/azure/azure-monitor/agents/data-sources-syslog#log-queries-with-syslog-records)
- Learn about [log queries](https://learn.microsoft.com/azure/azure-monitor/logs/log-query-overview) to analyze the data collected from data sources and solutions.
- Use [custom fields](https://learn.microsoft.com/azure/azure-monitor/logs/custom-fields) to parse data from Syslog records into individual fields.


