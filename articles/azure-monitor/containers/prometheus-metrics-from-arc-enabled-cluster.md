---
title: Collect Prometheus metrics from an Arc-enabled Kubernetes cluster (preview)
description: How to configure your Azure Arc-enabled Kubernetes cluster (preview) to send data to Azure Monitor managed service for Prometheus.
author: EdB-MSFT
ms.author: edbaynash 
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 05/07/2023
---

# Collect Prometheus metrics from an Arc-enabled Kubernetes cluster (preview)

This article describes how to configure your Azure Arc-enabled Kubernetes cluster (preview) to send data to Azure Monitor managed service for Prometheus. When you configure your Azure Arc-enabled Kubernetes cluster to send data to Azure Monitor managed service for Prometheus, a containerized version of the Azure Monitor agent is installed with a metrics extension. You then specify the Azure Monitor workspace where the data should be sent.

> [!NOTE]
> The process described here doesn't enable [Container insights](../containers/container-insights-overview.md) on the cluster even though the Azure Monitor agent installed in this process is the same agent used by Container insights.
> For different methods to enable Container insights on your cluster, see [Enable Container insights](../containers/container-insights-onboard.md). For details on adding Prometheus collection to a cluster that already has Container insights enabled, see [Collect Prometheus metrics with Container insights](../containers/container-insights-prometheus.md).

## Supported configurations

The following configurations are supported:

+ Azure Monitor Managed Prometheus supports monitoring Azure Arc-enabled Kubernetes. For more information, see [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).
+ Docker
+ Moby
+ CRI compatible container runtimes such CRI-O

The following configurations are not supported:

+ Windows
+ Azure Red Hat OpenShift 4

## Prerequisites

+ Prerequisites listed in [Deploy and manage Azure Arc-enabled Kubernetes cluster extensions](../../azure-arc/kubernetes/extensions.md#prerequisites)
+ An Azure Monitor workspace. To create new workspace, see [Manage an Azure Monitor workspace ](../essentials/azure-monitor-workspace-manage.md).
+ The cluster must use [managed identity authentication](../../aks/use-managed-identity.md).
+ The following resource providers must be registered in the subscription of the Arc-enabled Kubernetes cluster and the Azure Monitor workspace:
  + Microsoft.Kubernetes
  + Microsoft.Insights
  + Microsoft.AlertsManagement
+ The following endpoints must be enabled for outbound access in addition to the [Azure Arc-enabled Kubernetes network requirements](../../azure-arc/kubernetes/network-requirements.md?tabs=azure-cloud):  
   **Azure public cloud**

   |Endpoint|Port|
   |---|--|
   |*.ods.opinsights.azure.com |443 |
   |*.oms.opinsights.azure.com |443 |
   |dc.services.visualstudio.com |443 |
   |*.monitoring.azure.com |443 |
   |login.microsoftonline.com |443 |
   |global.handler.control.monitor.azure.com |443 |
   | \<cluster-region-name\>.handler.control.monitor.azure.com |443 |

## Create an extension instance

### [Portal](#tab/portal)

### Onboard from Azure Monitor workspace

1. Open the **Azure Monitor workspaces** menu in the Azure portal and select your cluster.

1. Select **Managed Prometheus** to display a list of AKS and Arc clusters.
1. Select **Configure** for the cluster you want to enable.

:::image type="content" source="./media/prometheus-metrics-from-arc-enabled-cluster/azure-monitor-workspace-monitored-clusters.png" lightbox="./media/prometheus-metrics-from-arc-enabled-cluster/azure-monitor-workspace-monitored-clusters.png" alt-text="A screenshot showing the Managed clusters page for an Azure monitor workspace." :::

### Onboard from Container insights

1. In the Azure portal, select the Azure Arc-enabled Kubernetes cluster that you wish to monitor.

1. From the resource pane on the left, select **Insights** under the **Monitoring** section.
1. On the onboarding page, select **Configure monitoring**.
1. On the **Configure Container insights** page, select the **Enable Prometheus metrics** checkbox.
1. Select **Configure**.

:::image type="content" source="./media/prometheus-metrics-from-arc-enabled-cluster/configure-container-insights.png" lightbox="./media/prometheus-metrics-from-arc-enabled-cluster/configure-container-insights.png" alt-text="A screenshot of the monitoring onboarding page for Azure Arc-enabled kubernetes clusters.":::

### [CLI](#tab/cli)

### Prerequisites

+ The k8s-extension extension must be installed. Install the extension  using the command `az extension add --name k8s-extension`.
+ The k8s-extension version 1.4.1 or higher is required. Check the k8s-extension version by using the `az version` command.

### Create an extension with default values

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

### Create an extension with an existing Azure Monitor workspace

If the Azure Monitor workspace is already linked to one or more Grafana workspaces, the data is available in Grafana. 

```azurecli
az k8s-extension create\
--name azuremonitor-metrics\
--cluster-name <cluster-name>\
--resource-group <resource-group>\
--cluster-type connectedClusters\
--extension-type Microsoft.AzureMonitor.Containers.Metrics\
--configuration-settings azure-monitor-workspace-resource-id=<workspace-name-resource-id>  
```

### Create an extension with an existing Azure Monitor workspace and link with an existing Grafana workspace

This option creates a link between the Azure Monitor workspace and the Grafana workspace. 

```azurecli
az k8s-extension create\
--name azuremonitor-metrics\
--cluster-name <cluster-name>\
--resource-group <resource-group>\
--cluster-type connectedClusters\
--extension-type Microsoft.AzureMonitor.Containers.Metrics\
--configuration-settings azure-monitor-workspace-resource-id=<workspace-name-resource-id> \
grafana-resource-id=<grafana-workspace-name-resource-id>
```

### Create an extension with optional parameters

You can use the following optional parameters with the previous commands:

`--configurationsettings.AzureMonitorMetrics.KubeStateMetrics.MetricsLabelsAllowlist` is a comma-separated list of Kubernetes label keys that will be used in the resource' labels metric. By default the metric contains only name and namespace labels. To include additional labels, provide a list of resource names in their plural form and Kubernetes label keys you would like to allow for them. For example, `=namespaces=[kubernetes.io/team,...],pods=[kubernetes.io/team],...`

`--configurationSettings.AzureMonitorMetrics.KubeStateMetrics.MetricAnnotationsAllowList` is a comma-separated list of Kubernetes annotations keys that will be used in the resource' labels metric. By default the metric contains only name and namespace labels. To include additional annotations, provide a list of resource names in their plural form and Kubernetes annotation keys you would like to allow for them. For example, `=namespaces=[kubernetes.io/team,...],pods=[kubernetes.io/team],...`.

> [!NOTE]
> A single `*`, for example `'=pods=[*]'` can be provided per resource to allow any labels, however, this has severe performance implications.


```azurecli
az k8s-extension create\
--name azuremonitor-metrics\
--cluster-name <cluster-name>\
--resource-group <resource-group>\
--cluster-type connectedClusters\
--extension-type Microsoft.AzureMonitor.Containers.Metrics\
--configuration-settings azure-monitor-workspace-resource-id=<workspace-name-resource-id> \
grafana-resource-id=<grafana-workspace-name-resource-id> \
AzureMonitorMetrics.KubeStateMetrics.MetricAnnotationsAllowList="pods=[k8s-annotation-1,k8s-annotation-n]" \
AzureMonitorMetrics.KubeStateMetrics.MetricsLabelsAllowlist "namespaces=[k8s-label-1,k8s-label-n]" 
```

### [Resource Manager](#tab/resource-manager)

### Prerequisites

+ If the Azure Managed Grafana instance is in a subscription other than the Azure Monitor Workspaces subscription, register the Azure Monitor Workspace subscription with the `Microsoft.Dashboard` resource provider by following the steps in the [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) section of the Azure resource providers and types article.

+ The Azure Monitor workspace and Azure Managed Grafana workspace must already exist.
+ The template must be deployed in the same resource group as the Azure Managed Grafana workspace.
+ Users with the User Access Administrator role in the subscription of the AKS cluster can enable the Monitoring Data Reader role directly by deploying the template.

### Create an extension

1. Retrieve required values for the Grafana resource

    > [!NOTE]
    > Azure Managed Grafana is not currently available in the Azure US Government cloud.

    On the Overview page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

    If you're using an existing Azure Managed Grafana instance that's already linked to an Azure Monitor workspace, you need the list of already existing Grafana integrations. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If the field doesn't exist, the instance hasn't been linked with any Azure Monitor workspace.

    ```json
    "properties": { 
        "grafanaIntegrations": { 
            "azureMonitorWorkspaceIntegrations": [ 
                { 
                    "azureMonitorWorkspaceResourceId": "full_resource_id_1" 
                }, 
                { 
                    "azureMonitorWorkspaceResourceId": "full_resource_id_2" 
                } 
            ] 
        } 
    } 
    ```

1. Download and edit the template and the parameter file  


    1. Download the template at https://aka.ms/azureprometheus-arc-arm-template and save it as *existingClusterOnboarding.json*.

     1. Download the parameter file at https://aka.ms/azureprometheus-arc-arm-template-parameters and save it as *existingClusterParam.json*.

1. Edit the following fields' values in the parameter file.

   |Parameter|Value |
   |---|---|
   |`azureMonitorWorkspaceResourceId` |Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the Overview page for the Azure Monitor workspace. |
   |`azureMonitorWorkspaceLocation`|Location of the Azure Monitor workspace. Retrieve from the JSON view on the Overview page for the Azure Monitor workspace. |
   |`clusterResourceId` |Resource ID for the Arc cluster. Retrieve from the **JSON view** on the Overview page for the cluster. |
   |`clusterLocation` |Location of the Arc cluster. Retrieve from the **JSON view** on the Overview page for the cluster. |
   |`metricLabelsAllowlist` |Comma-separated list of Kubernetes labels keys to be used in the resource's labels metric.|
   |`metricAnnotationsAllowList` |Comma-separated list of more Kubernetes label keys to be used in the resource's labels metric. |
   |`grafanaResourceId` |Resource ID for the managed Grafana instance. Retrieve from the **JSON view** on the Overview page for the Grafana instance. |
   |`grafanaLocation` |Location for the managed Grafana instance. Retrieve from the **JSON view** on the Overview page for the Grafana instance. |
   |`grafanaSku` |SKU for the managed Grafana instance. Retrieve from the **JSON view** on the Overview page for the Grafana instance. Use the `sku.name`. |

1. Open the template file and update the `grafanaIntegrations` property at the end of the file with the values that you retrieved from the Grafana instance. For example:

    ```json
    { 
        "type": "Microsoft.Dashboard/grafana", 
        "apiVersion": "2022-08-01", 
        "name": "[split(parameters('grafanaResourceId'),'/')[8]]", 
        "sku": { 
            "name": "[parameters('grafanaSku')]" 
        }, 
        "location": "[parameters('grafanaLocation')]", 
        "properties": { 
            "grafanaIntegrations": { 
            "azureMonitorWorkspaceIntegrations": [ 
                { 
                    "azureMonitorWorkspaceResourceId": "full_resource_id_1" 
                }, 
                { 
                    "azureMonitorWorkspaceResourceId": "full_resource_id_2" 
                }, 
                { 
                    "azureMonitorWorkspaceResourceId": "[parameters    ('azureMonitorWorkspaceResourceId')]" 
                } 
            ] 
            } 
        } 
    }
    ```

    In the example JSON above, `full_resource_id_1` and `full_resource_id_2` are already in the Azure Managed Grafana resource JSON. They're added here to the Azure Resource Manager template (ARM template). If you don't have any existing Grafana integrations, don't include these entries.  

    The final `azureMonitorWorkspaceResourceId` entry is in the template by default and is used to link to the Azure Monitor workspace resource ID provided in the parameters file.

### Verify extension installation status

Once you have successfully created the Azure Monitor extension for your Azure Arc-enabled Kubernetes cluster, you can check the status of the installation using the Azure portal or CLI. Successful installations show the status as `Installed`.

#### Azure portal

1. In the Azure portal, select the Azure Arc-enabled Kubernetes cluster with the extension installation.

1. From the resource pane on the left, select the **Extensions** item under the **Setting**' section.

1. An extension with the name **azuremonitor-metrics** is listed, with the current status in the **Install status** column.

#### Azure CLI

Run the following command to show the latest status of the` Microsoft.AzureMonitor.Containers.Metrics` extension.

```azurecli
az k8s-extension show \
--name azuremonitor-metrics \
--cluster-name <cluster-name> \
--resource-group <resource-group> \
--cluster-type connectedClusters 
```
---

### Delete the extension instance

To delete the extension instance, use the following CLI command:

```azurecli
az k8s-extension delete --name azuremonitor-metrics -g <cluster_resource_group> -c<cluster_name> -t connectedClusters
```

The command only deletes the extension instance. The Azure Monitor workspace and its data are not deleted.

## Disconnected clusters

If your cluster is disconnected from Azure for more than 48 hours, Azure Resource Graph won't have information about your cluster. As a result, your Azure Monitor Workspace may have incorrect information about your cluster state.

## Troubleshooting

For issues with the extension, see the [Troubleshooting Guide](./prometheus-metrics-troubleshoot.md).

## Next Steps 

+ [Default Prometheus metrics configuration in Azure Monitor ](prometheus-metrics-scrape-default.md)
+ [Customize scraping of Prometheus metrics in Azure Monitor](prometheus-metrics-scrape-configuration.md)
+ [Use Azure Monitor managed service for Prometheus as data source for Grafana using managed system identity](../essentials/prometheus-grafana.md)
+ [Configure self-managed Grafana to use Azure Monitor managed service for Prometheus with Microsoft Entra ID](../essentials/prometheus-self-managed-grafana-azure-active-directory.md)
