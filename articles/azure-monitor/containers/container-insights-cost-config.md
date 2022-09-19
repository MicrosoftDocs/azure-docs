---
title: Configure Container insights cost optimization data collection rules | Microsoft Docs
description: This article describes how you can configure the Container insights agent to control data collection.
ms.topic: conceptual
ms.date: 09/12/2022
ms.reviewer: aul
---

# Container Insights - Cost Optimization DCR Settings

This private preview supports the data collection settings such as data collection interval and namespaces to exclude for the data collection through [Azure Monitor Data Collection Rules (DCR)](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/data-collection-rule-overview).

This feature reduces the volume of data being ingested and in turn helps to reduce the total cost.

The container insights agent periodically checks for the data collection settings, validates, and applies the applicable settings to applicable Container Insights Log Analytics tables and Custom Metrics. The data collection settings should be applied in the subsequent configured Data collection interval.

The following table describes about supported data collection settings

| **Data collection setting** | **Description** |
| --- | --- |
| **interval** | Allowed values are 1m, 2m … 30m. If the value outside this range [1m, 30m], then default value is set to be 1m (i.e., 60 seconds) and **m** suffix denotes the minutes. |
| **excludeNameSpaces** | Array of comma separated Kubernetes namespaces for which inventory and perf data will not be collected. For example, **excludeNameSpaces** = ["kube-system", "default"] |

## Log Analytics

The below table outlines the list of the container insights Log Analytics tables for which data collection settings applied and what data collection settings applicable.

| ContainerInsights Table Name | Is Data collection setting: interval applicable? | Is Data collection setting: excludeNameSpaces applicable? | Remarks |
| --- | --- | --- | --- |
| ContainerInventory | Yes | Yes | |
| ContainerNodeInventory | Yes | No | Data collection setting for excludeNameSpaces is not applicable since Kubernetes Node is not a namespace scoped resource |
| KubeNodeInventory | Yes | No | Data collection setting excludeNameSpaces is not applicable Kubernetes Node is not a namespace scoped resource |
| KubePodInventory | Yes | Yes ||
| KubePVInventory | Yes | Yes | |
| KubeServices | Yes | Yes | |
| KubeEvents | No | Yes | Data collection setting interval is not applicable for the Kubernetes Events |
| Perf | Yes | Yes\* | \*Data collection setting excludeNameSpaces is not applicablefor the Kubernetes Node related metrics since the Kubernetes Node is not a namespace scoped object. |
| InsightsMetrics| Yes\*\* | Yes\*\* | \*\*Data collection settings only applicable for the metrics which collected with following namespaces: container.azm.ms/kubestate, container.azm.ms/pv and container.azm.ms/gpu |

## Custom Metrics

| Metric namespace | Is Data collection setting: interval applicable? | Is Data collection setting: excludeNameSpaces applicable? | Remarks |
| --- | --- | --- | --- |
| Insights.container/nodes| Yes | No | Node is not a namespace scoped resource |
|Insights.container/pods | Yes | Yes| |
| Insights.container/containers | Yes | Yes | |
| Insights.container/persistentvolumes | Yes | Yes | |

## Pre-requisites

- AKS Cluster MUST be using either System or User Assigned Managed Identity
    - If the AKS Cluster is using Service Principal, it MUST be upgraded to use Managed Identity [https://docs.microsoft.com/en-us/azure/aks/use-managed-identity#update-an-aks-cluster-to-use-a-managed-identity](https://docs.microsoft.com/en-us/azure/aks/use-managed-identity#update-an-aks-cluster-to-use-a-managed-identity)

- AKS Cluster or AKS Cluster subscription MUST be allow-listed to use this feature
    - The current recommendation is to allow-list at a per cluster level, unless using a test subscription for allow-listing
- Install latest version of the Azure CLI as per the instructions in [https://docs.microsoft.com/en-us/cli/azure/install-azure-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

## Onboarding to an existing AKS Cluster

1. Download the Azure Resource Manager Template and Parameter files

```bash
curl -L https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-file -o existingClusterOnboarding.json
```

```bash
curl -L https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-parameter-file -o existingClusterParam.json
```

2. Edit the values in the parameter file: existingClusterParam.json

- For _aksResourceId_ and _aksResourceLocation_, use the values on the  **AKS Overview**  page for the AKS cluster.
- For _workspaceResourceId_, use the resource ID of your Log Analytics workspace.
- For _workspaceLocation_, use the Location of your Log Analytics workspace
- For _resourceTagValues_, use the existing tag values specified for the AKS cluster
- For _dataCollectionInterval_, specifythe interval to use for the data collection interval. Allowed values are 1m, 2m … 30m where m suffix indicates the minutes.
- For _excludeNamespacesForDataCollection_, specify array of the namespaces to exclude for the Data collection. For example, to exclude "kube-system" and "default" namespaces, you can specify the value as ["kube-system", "default"]

3. Deploy the ARM template

```azcli
az login

az account set --subscription"Cluster Subscription Name"

az deployment group create --resource-group <ClusterResourceGroupName> --template-file ./existingClusterOnboarding.json --parameters @./existingClusterParam.json
```

### Onboarding to an existing Azure Arc K8s Clusters

1. Download the Azure Resource Manager Template and Parameter files

```bash
curl -L https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-file -o existingClusterOnboarding.json
```

```bash
curl -L https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-parameter-file -o existingClusterParam.json
```

2. Edit the values in the parameter file: existingClusterParam.json

- For _clusterResourceId_ and _clusterRegion_, use the values of Azure Arc Kubernetes cluster resource id and location
- For _workspaceResourceId_, use the resource ID of your Log Analytics workspace.
- For _workspaceRegion_, use the Location of your Log Analytics workspace
- For _workspaceDomain_, use _opinsights.azure.com_for Azure Public Cloud and for Azure China Cloud, use _opinsights.azure.cn_and for Azure Government Cloud, use _opinsights.azure.us_
- For _resourceTagValues_, use the existing tag values specified for the Azure Arc Kubernetes cluster
- For _dataCollectionInterval_, specifythe interval to use for the data collection interval. Allowed values are 1m, 2m … 30m where m suffix indicates the minutes.
- For _excludeNamespacesForDataCollection_, specify array of the Kubernetes namespaces to exclude for the Data collection. For example, to exclude "kube-system" and "default" namespaces, you can specify the value as ["kube-system", "default"]

3. Deploy the ARM template

```azcli
az login

az account set --subscription "Cluster's Subscription Name"

az deployment group create --resource-group <ClusterResourceGroupName> --template-file ./existingClusterOnboarding.json --parameters @./existingClusterParam.json
```

## **Data Collection Settings Updates**

To update your data collection Settings, modify the values in parameter files, and re-deploy the Azure Resource Manager Templates to your corresponding AKS or Azure Arc Kubernetes cluster.

## Portal Experience

- Navigate to Azure Portal [https://aka.ms/cicostsettings](https://aka.ms/cicostsettings) for Container Insights experience

## Known Issues/Limitations

- Recommended alerts will not work as expected if the Data collection interval is configured more than 1 minute interval. Plan is to migrate to Metrics addon for the metrics once it becomes available.
- There will be gaps in Trend Line Charts of Deployments workbook if configured Data collection interval more than time granularity of the selected Time Range.
- Configuring the Data Collection Settings through Azure Portal and Azure CLI not available in private preview and this will be available in public preview & GA release of this feature

## **For Help**

Please reach out to [coinsupport@microsoft.com](mailto:coinsupport@microsoft.com) if you are facing any issues.
