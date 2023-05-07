---
title: Collect Prometheus metrics from an Arc-enabled Kubernetes cluster (preview).
description: How to configure your Azure Arc-enabled Kubernetes cluster to send data to Azure Monitor managed service for Prometheus.
author: EdB-MSFT
ms.author: edbaynash 
ms.topic: conceptual
ms.date: 05/07/2023
---

# Collect Prometheus metrics from an Arc-enabled Kubernetes cluster (preview) 

This article describes how to configure your Azure Arc-enabled Kubernetes cluster to send data to Azure Monitor managed service for Prometheus. When you configure your Azure Arc-enabled Kubernetes cluster to send data to Azure Monitor managed service for Prometheus, a containerized version of the Azure Monitor agent is installed with a metrics extension. Then you specify the Azure Monitor workspace where the data should be sent. 

[!NOTE]
The process described here doesn't enable Container insights on the cluster even though the Azure Monitor agent installed in this process is the same one used by Container insights. 
For different methods to enable Container insights on your cluster, see Enable Container insights. For details on adding Prometheus collection to a cluster that already has Container insights enabled, see Collect Prometheus metrics with Container insights.  

## Supported configurations 

The following configurations are supported:
+ Azure Monitor Managed Prometheus supports monitoring Azure Arc-enabled Kubernetes. For more information see [Azure Monitor managed service for Prometheus](./prometheus-metrics-overview.md).
+ Docker.
+ Moby.
+ CRI compatible container runtimes such CRI-O.

Windows is not currently supported. 

## Pre-requisites listed under the generic cluster extensions documentation. 

+ An Azure Monitor workspace. To create new workspace, see [Manage an Azure Monitor workspace (preview)](./azure-monitor-workspace-manage.md). 
+ The cluster must use managed identity authentication. 
+ The following resource providers must be registered in the subscription of the Arc-enabled Kubernetes cluster and the Azure Monitor workspace: 
    + Microsoft.Kubernetes 
    + Microsoft.Insights 
    + Microsoft.AlertsManagement 
+ The following endpoints must be enabled for outbound access in addition to the [Azure Arc-enabled Kubernetes network requirements](https://learn.microsoft.com/azure/azure-arc/kubernetes/network-requirements?tabs=azure-cloud)  
   + Azure public cloud

   |Endpoint|Port|
   |---|--|
   |*.ods.opinsights.azure.com |443 |
   |*.oms.opinsights.azure.com |443 |
   |dc.services.visualstudio.com |443 |
   |*.monitoring.azure.com |443 |
   |login.microsoftonline.com |443 |
   |global.handler.control.monitor.azure.com |443 |
   |<cluster-region-name>.handler.control.monitor.azure.com |443 |

# Create extension instance 

### [CLI](#tab/cli)

### Create with default values
+ A default Azure Monitor workspace is created in the DefaultRG-<cluster_region> following the format `DefaultAzureMonitorWorkspace-<mapped_region>`.
+ Auto-upgrade is enabled for the extension. 

```azurecli
az k8s-extension create \
--name azuremonitor-metrics \
--cluster-name <cluster-name> \
--resource-group <resource-group> \
--cluster-type connectedClusters \
--extension-type Microsoft.AzureMonitor.Containers.Metrics 
```

### Create with an existing Azure Monitor workspace 

If the Azure Monitor workspace is already linked to one or more Grafana workspaces, the data is available in Grafana. 

```azurecli
az k8s-extension create\
--name azuremonitor-metrics\
--cluster-name <cluster-name>\
--resource-group <resource-group>\
--cluster-type connectedClusters\
--extension-type Microsoft.AzureMonitor.Containers.Metrics\
--azure-monitor-workspace-resource-id <workspace-name-resource-id> 
```

### Create with an existing Azure Monitor workspace and link with an existing Grafana workspace 

This option creates a link between the Azure Monitor workspace and the Grafana workspace. 

```azurecli
az k8s-extension create\
--name azuremonitor-metrics\
--cluster-name <cluster-name>\
--resource-group <resource-group>\
--cluster-type connectedClusters\
--extension-type Microsoft.AzureMonitor.Containers.Metrics\
--azure-monitor-workspace-resource-id <azure-monitor-workspace-name-resource-id>\
--grafana-resource-id <grafana-workspace-name-resource-id> 
```

### With Optional Parameters 

You can use the following optional parameters with the previous commands: 

--configurationsettings. AzureMonitorMetrics.KubeStateMetrics.MetricsLabelsAllowlist is a comma-separated list of Kubernetes annotations keys used in the resource's labels metric. By default, the metric contains only name and namespace labels. To include more annotations, provide a list of resource names in their plural form and Kubernetes annotation keys that you want to allow for them. A single * can be provided per resource instead to allow any annotations, but it has severe performance implications. 

--configurationSettings. AzureMonitorMetrics.KubeStateMetrics.MetricAnnotationsAllowList is a comma-separated list of more Kubernetes label keys that is used in the resource's labels metric. By default the metric contains only name and namespace labels. To include more labels, provide a list of resource names in their plural form and Kubernetes label keys that you want to allow for them. A single asterisk (*) can be provided per resource instead to allow any labels, but it has severe performance implications. 

 
```azurecli
az k8s-extension create \
--name azuremonitor-metrics \
--cluster-name <cluster-name> \
--resource-group <resource-group> \
--cluster-type connectedClusters \
--extension-type Microsoft.AzureMonitor.Containers.Metrics \
--configurationsettings.AzureMonitorMetrics.KubeStateMetrics.MetricsLabelsAllowlist "namespaces=[k8s-label-1,k8s-label-n]" \
--configurationSettings.AzureMonitorMetrics.KubeStateMetrics.MetricAnnotationsAllowList "pods=[k8s-annotation-1,k8s-annotation-n]" 
```

### [Portal](#tab/portal)


### Onboard from Azure Monitor workspace 

1. Open the **Azure Monitor workspaces** menu in the Azure portal and select your cluster. 

1. Select **Managed Prometheus** to display a list of AKS and Arc clusters. 
1. Select **Configure** next to the cluster you want to enable. 

:::image type="content" source="./media/prometheus-metrics-from-arc-enabled-cluster/azure-monitor-workspace-monitored-clusters.png" alt-text="A screenshot showing the Managed clusters page for an Azure monitor workspace." lightbox="./media/prometheus-metrics-from-arc-enabled-cluster/azure-monitor-workspace-monitored-clusters.png":::
---

