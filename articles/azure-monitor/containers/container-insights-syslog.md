---
title: Syslog collection with Container Insights | Microsoft Docs
description: This article describes how to collect Syslog from AKS nodes using Container insights.
ms.topic: conceptual
ms.date: 01/31/2023
ms.reviewer: damendo
---

# Syslog collection with Container Insights

Container Insights offers the ability to collect Syslog events from your Linux nodes in AKS. Customers can use Syslog for monitoring security and health events. 

## Pre-requisites 

1.	You will need to have managed identity authentication enabled on your cluster. See [migrate your AKS cluster to managed identity authentication](https://docs.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-enable-existing-clusters?tabs=azure-cli#migrate-to-managed-identity-authentication). Note: This which will create a Data Collection Rule (DCR) named “MSCI-<WorkspaceRegion>-<ClusterName>” 
2.	Minimum versions of Azure components
  - **Azure CLI**: Az CLI minimum version required is >= 2.43.0 See [Release notes & updates – Azure CLI | Microsoft Learn](https://learn.microsoft.com/en-us/cli/azure/release-notes-azure-cli#aks-1)
  - **Azure CLI AKS-Preview Extension**: AKS-Preview CLI extension minimum version required is >= 0.5.121 See [azure-cli-extensions/HISTORY.rst at main · Azure/azure-cli-extensions (github.com)](https://github.com/Azure/azure-cli-extensions/blob/main/src/aks-preview/HISTORY.rst#05121)
  - **Linux image version**: The AKS node linux image min version should be >= 2022.11.01. See [Upgrade Azure Kubernetes Service (AKS) node images - Azure Kubernetes Service | Microsoft Learn](https://learn.microsoft.com/en-us/azure/aks/node-image-upgrade)

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

* Image 1 - Log query section in Azure Monitor
* Image 2 - Pre-built queries in portal
* Image 3 - Syslog query loaded in the query editor 

### AKS Cluster view
 
* Image 1 - Cluster overview
* Image 2 - Logs tab under Monitoring section
* Image 3 - Query editor
* Image 4 - Syslog query loaded in the query editor 
  
### Sample queries
  
The following table provides different examples of log queries that retrieve Syslog records.

| Query | Description |
|:--- |:--- |
| Syslog |All Syslogs |
| Syslog </br> &#124; where SeverityLevel == "error" |All Syslog records with severity of error |
| Syslog </br> &#124; summarize AggregatedValue = count() by Computer |Count of Syslog records by computer |
| Syslog </br> &#124; summarize AggregatedValue = count() by Facility |Count of Syslog records by facility |  

## Editing you Syslog collection settings

* Image 1 - Data Collection Rules under Azure Monitor
* Image 2 - Editing an individual Syslog data collection rule 

## How Syslog data is collected

## Known limitations

- During Public Preview, Syslog collection can only be enabled from command line. Enablement from the Azure Portal will be added before GA release. 
- Container restart data loss – Container restarts can lead to syslog data loss, this is a known issue and will be fixed before GA release. 

## Next steps

- Read more about [Syslog record properties](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/data-sources-syslog#syslog-record-properties)
- See more sample [log queries with Syslog records](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/data-sources-syslog#log-queries-with-syslog-records)
- Learn about [log queries](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview) to analyze the data collected from data sources and solutions.
- Use [custom fields](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/custom-fields) to parse data from Syslog records into individual fields.


