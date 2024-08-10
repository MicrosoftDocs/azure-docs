---
title: High scale logs collection in Container Insights (Preview) 
description: Enable high scale logs collection in Container Insights (Preview).
ms.topic: conceptual
ms.date: 08/06/2024
---

# High scale logs collection in Container Insights (Preview) 
High scale mode is a feature in Container Insights that enables you to collect container console (stdout & stderr) logs with high throughput from your Azure Kubernetes Service (AKS) cluster nodes. This feature is intended for AKS clusters sending more than 5,000 logs/sec per node.

## Overview
When high scale mode is enabled, Container Insights performs multiple configuration changes resulting in a higher overall throughput. This includes using an upgraded agent and Azure Monitor data pipeline with scale improvements. These changes are all made in the background by Azure Monitor and don't require input or configuration after the feature is enabled.   

High scale mode impacts only the data collection layer. The rest of the Container insights experience remains the same, with logs being ingested into same `ContainerLogV2` table. Existing queries and alerts continue to work since the same data is being collected.

To achieve the maximum supported logs throughput, you should use high-end VM SKUs with 16 CPU cores or more for your AKS cluster nodes. Using low end VM SKUs will impact your logs throughput.  

## Does my cluster qualify?
High scale logs collection is suited for environments sending more than 5,000 logs/sec per node in their Kubernetes clusters and has been designed and tested for sending up to 50,000 logs/sec per node. Use the following [log queries](../logs/log-query-overview.md) to determine whether your cluster is suitable for high scale logs collection.


**Logs per second and per node**

```kusto
ContainerLogV2 
| where _ResourceId = "<cluster-resource-id>" 
| summarize count() by bin(TimeGenerated, 1s), Computer 
| render timechart 
```

**Log size (in MB) per second per node**

```kusto
 ContainerLogV2 
| where _ResourceId = "<cluster-resource-id>"
| summarize BillableDataMB = sum(_BilledSize)/1024/1024 by bin(TimeGenerated, 1s), Computer 
| render timechart 
```

## Prerequisites 

- Azure CLI version 2.63.0 or higher.
- AKS-preview CLI extension version must be 7.0.0b4 or higher if an aks-preview CLI extension is installed.
- Cluster schema must be [configured for ContainerLogV2](./container-insights-logs-schema.md#enable-the-containerlogv2-schema).

## Network firewall requirements
In addition to the [network firewall requirements](./kubernetes-monitoring-firewall.md) for monitoring a Kubernetes cluster, additional configurations are needed for enabling High scale Mode. 

Get the **Logs Ingestion** endpoint from the data collection endpoint (DCE) for the data collection rule (DCR) used by the cluster. The DCR name is in the form `MSCI-<region>-<clusterName>`.  

The endpoint has a different format depending on the cloud as shown in the following table.

| Cloud | Endpoint | Port |
|:---|:--|:--|
| Azure Public Cloud | `<dce-name>-<suffix>.<cluster-region-name>-<suffix>.ingest.monitor.azure.com` | 443 |
| Microsoft Azure operated by 21Vianet cloud | `<dce-name>-<suffix>.<cluster-region-name>-<suffix>.ingest.monitor.azure.cn` | 443 |
| Azure Government cloud | `<dce-name>-<suffix>.<cluster-region-name>-<suffix>.ingest.monitor.azure.us` | 443 |


## Limitations 

The following scenarios aren't supported during the preview release. These will be addressed when the feature becomes generally available.

- AKS Clusters with Arm64 nodes 
- Azure Arc-enabled Kubernetes
- HTTP proxy with trusted certificate
- Onboarding through Azure portal, Azure Policy, Terraform and Bicep 
- Configuring through **Monitor Settings** in the AKS Insights portal experience  
- Automatic migration from existing Container Insights   

## Enable high scale logs collection
The following two steps are required to enable high scale mode for your cluster.

### Update configmap
The first step is to update configmap for the cluster to instruct the container insights ama-logs deamonset pods to run in high scale mode. 

Follow the guidance in [Configure and deploy ConfigMap](./container-insights-data-collection-configmap.md#configure-and-deploy-configmap) to download and update ConfigMap for the cluster. The only change you need to make for high scale logs is to add the following entry under `agent-settings`: 

```yml
[agent_settings.high_log_scale] 
  enabled = true 
```

After applying this configmap, `ama-logs-*` pods will get restarted automatically and configure the ama-logs daemonset pods to run in high scale mode. 

### Enable high scale mode for Monitoring add-on
Once the ama-logs pods are running in high log scale mode, you can enable the Monitoring Add-on with high scale mode. Use the following Azure CLI commands to enable high scale logs mode for the Monitoring add-on depending on your AKS configuration.

> [!NOTE]
> Instead of CLI, you can use an ARM template to enable high scale mode for the Monitoring add-on. See [Enable Container insights](./kubernetes-monitoring-enable.md?tabs=arm#enable-container-insights) for guidance on enabling Container Insights using an ARM template. To enable high scale mode, use `Microsoft-ContainerLogV2-HighScale` in the `streams` parameter.
>
> Don't use both `Microsoft-ContainerLogV2` and `Microsoft-ContainerLogV2-HighScale` in the `streams` parameter. This will result in logs being collected in the standard mode.


**Existing AKS cluster**

```azurecli
az aks enable-addons -a monitoring -g <resource-group-name> -n <cluster-name> --enable-high-log-scale-mode  
```

**Existing AKS Private cluster**

```azurecli
az aks enable-addons -a monitoring -g  <resource-group-name> -n <cluster-name> --enable-high-scale-mode --ampls-resource-id /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/microsoft.insights/privatelinkscopes/<resourceName> 
```

**New AKS cluster**

```azurecli
az aks create -g <cluster-name> -n <cluster-name> enable-addons -a monitoring --enable-high-log-scale-mode  
```

**New AKS Private cluster**

See [Create a private Azure Kubernetes Service (AKS) cluster](/azure/aks/private-clusters?tabs=azure-portal) for details on creating an AKS Private cluster. Use the additional parameters `--enable-high-scale-mode` and `--ampls-resource-id` to configure high log scale mode with Azure Monitor Private Link Scope Resource ID. 

## Migration
If Container insights is already enabled for your cluster, then you need to disable it and then re-enable it with high scale mode.

- Since high scale mode uses a different data pipeline, you must ensure that pipeline endpoints are not blocked by a firewall or other network connections.
- High scale mode uses a different DCR for data collection. If you've created any DCRs that use *Microsoft.ContainerLogV2*, you must replace this with *Microsoft.ContainerLogV2-HighScale* or data will be duplicated. 


## Next steps
- Share any feedback or issues with High Scale mode at [https://aka.ms/cihsfeedback](https://aka.ms/cihsfeedback).

