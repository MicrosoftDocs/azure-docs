---
title: Configure Container insights data collection and filtering
description: Details on configuring data collection in Azure Monitor Container insights including filtering data you don't require.
ms.topic: conceptual
ms.date: 05/14/2024
ms.reviewer: aul
---

# Filtering Container logs in Container insights

Kubernetes clusters generate a large amount of logging information. You can collect all of this data in Container insights, but since you're charged for the ingestion and retention of this data, this may result in charges for data that you don't use. You can significantly reduce your monitoring cost by filtering out data that you don't need and also by optimizing the configuration of the Log Analytics workspace where you're storing your data.



| Table | DCR | ConfigMap |
|:---|:---|:---|
| ContainerLog<br>ContainerLogV2 | Select  | Use `[log_collection_settings]` to either disable collection of stdout/stderr logs or exclude specific namespaces from collection. |

## Filter using ConfigMap

[ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) are a Kubernetes mechanism that allow you to store non-confidential data such as a configuration file or environment variables. Container insights looks for a ConfigMap on each cluster with particular settings that define data that it should collect. 

You can use settings in ConfigMap to enable or disable collection of stdout and stderr logs and filter specific namespaces from collection of stdout and stderr logs.



## Data collection rule

The DCR that gets created when you enable Container insights is named *MSCI-\<cluster-region\>-\<cluster-name\>*. You can view it in the Azure portal by selecting the **Data Collection Rules** option in the **Monitor** menu in the Azure portal. Rather than directly modifying the DCR, you should use one of the methods described below to configure data collection. See [Data collection parameters](#data-collection-parameters) for details about the different available settings used by each method.


## [Azure portal](#tab/portal)
You can use the Azure portal to enable cost optimization on your existing cluster after Container insights has been enabled, or you can enable Container insights on the cluster along with cost optimization.

1. Select the cluster in the Azure portal.
2. Select the **Insights** option in the **Monitoring** section of the menu.
3. If Container insights has already been enabled on the cluster, select the **Monitoring Settings** button. If not, select **Configure Azure Monitor** and see [Enable monitoring on your Kubernetes cluster with Azure Monitor](container-insights-onboard.md) for details on enabling monitoring. 

    :::image type="content" source="media/container-insights-cost-config/monitor-settings-button.png" alt-text="Screenshot of AKS cluster with monitor settings button." lightbox="media/container-insights-cost-config/monitor-settings-button.png" :::


4. For AKS and Arc-enabled Kubernetes, select **Use managed identity** if you haven't yet migrated the cluster to [managed identity authentication](../containers/container-insights-onboard.md#authentication).
5. Select one of the cost presets.

    :::image type="content" source="media/container-insights-cost-config/cost-settings-onboarding.png" alt-text="Screenshot that shows the onboarding options." lightbox="media/container-insights-cost-config/cost-settings-onboarding.png" :::

    | Cost preset | Collection frequency | Namespace filters | Syslog collection | Collected data |
    | --- | --- | --- | --- | --- |
    | Standard | 1 m | None | Not enabled | All standard container insights tables |
    | Cost-optimized | 5 m | Excludes kube-system, gatekeeper-system, azure-arc | Not enabled | All standard container insights tables |
    | Syslog | 1 m | None | Enabled by default | All standard container insights tables |
    | Logs and Events | 1 m | None | Not enabled | ContainerLog/ContainerLogV2<br> KubeEvents<br>KubePodInventory |

6. If you want to customize the settings, click **Edit collection settings**. See [Data collection parameters](#data-collection-parameters) for details on each setting. For **Collected data**, see [Collected data](#collected-data) below.

    :::image type="content" source="media/container-insights-cost-config/advanced-collection-settings.png" alt-text="Screenshot that shows the collection settings options." lightbox="media/container-insights-cost-config/advanced-collection-settings.png" :::

    | Name | Description |
    |:---|:---|
    | Collection frequency | Determines how often the agent collects data.  Valid values are 1m - 30m in 1m intervals The default value is 1m.|
    | Namespace filtering | *Off*: Collects data on all namespaces.<br>*Include*: Collects only data from the values in the *namespaces* field.<br>*Exclude*: Collects data from all namespaces except for the values in the *namespaces* field.<br><br>Array of comma separated Kubernetes namespaces to collect inventory and perf data based on the _namespaceFilteringMode_. For example, *namespaces = ["kube-system", "default"]* with an _Include_ setting collects only these two namespaces. With an _Exclude_ setting, the agent collects data from all other namespaces except for _kube-system_ and _default_.  |
    | Collected Data | An array of container insights table streams. See the supported streams above to table mapping. |
    | Enable ContainerLogV2 | Boolean flag to enable ContainerLogV2 schema. If set to true, the stdout/stderr Logs are ingested to [ContainerLogV2](container-insights-logs-schema.md) table. If not, the container logs are ingested to **ContainerLog** table, unless otherwise specified in the ConfigMap. When specifying the individual streams, you must include the corresponding table for ContainerLog or ContainerLogV2. |
    | Enable ContainerLogV2 | Enables the [ContainerLogV2 schema](./container-insights-logs-schema.md) for the cluster. |
    | Enable Syslog collection | Enables Syslog collection from the cluster. |
    

    The **Collected data** option allows you to select the tables that are populated for the cluster. This is the equivalent of the `streams` parameter when performing the configuration with CLI or ARM. If you select any option other than **All (Default)**, the Container insights experience becomes unavailable, and you must use Grafana or other methods to analyze collected data.
    
    :::image type="content" source="media/container-insights-cost-config/collected-data-options.png" alt-text="Screenshot that shows the collected data options." lightbox="media/container-insights-cost-config/collected-data-options.png" :::
    
    | Grouping | Tables | Notes |
    | --- | --- | --- |
    | All (Default) | All standard container insights tables | Required for enabling the default Container insights visualizations |
    | Performance | Perf, InsightsMetrics | |
    | Logs and events | ContainerLog or ContainerLogV2, KubeEvents, KubePodInventory | Recommended if you have enabled managed Prometheus metrics |
    | Workloads, Deployments, and HPAs | InsightsMetrics, KubePodInventory, KubeEvents, ContainerInventory, ContainerNodeInventory, KubeNodeInventory, KubeServices | |
    | Persistent Volumes | InsightsMetrics, KubePVInventory | |
    
1. Click **Configure** to save the settings.

## [CLI](#tab/cli)


### Prerequisites

- Azure CLI minimum version 2.51.0.
- For AKS clusters, [aks-preview](../../aks/cluster-configuration.md) version 0.5.147 or higher
- For Arc enabled Kubernetes and AKS hybrid, [k8s-extension](../../azure-arc/kubernetes/extensions.md#prerequisites) version 1.4.3 or higher

## AKS cluster

When you use CLI to configure monitoring for your AKS cluster, you provide the configuration as a JSON file using the following format. Each of these settings is described in the following table.

```json
{
  "interval": "1m",
  "namespaceFilteringMode": "Include",
  "namespaces": ["kube-system"],
  "enableContainerLogV2": true, 
  "streams": ["Microsoft-Perf", "Microsoft-ContainerLogV2"]
}
```

| Name | Description |
|:---|:---|
| `interval` | Determines how often the agent collects data.  Valid values are 1m - 30m in 1m intervals The default value is 1m. If the value is outside the allowed range, then it defaults to *1 m*. |
| `namespaceFilteringMode` | *Include*: Collects only data from the values in the *namespaces* field.<br>*Exclude*: Collects data from all namespaces except for the values in the *namespaces* field.<br>*Off*: Ignores any *namespace* selections and collect data on all namespaces.
| `namespaces` | Array of comma separated Kubernetes namespaces to collect inventory and perf data based on the _namespaceFilteringMode_.<br>For example, *namespaces = ["kube-system", "default"]* with an _Include_ setting collects only these two namespaces. With an _Exclude_ setting, the agent collects data from all other namespaces except for _kube-system_ and _default_. With an _Off_ setting, the agent collects data from all namespaces including _kube-system_ and _default_. Invalid and unrecognized namespaces are ignored. |
|  `enableContainerLogV2` | Boolean flag to enable ContainerLogV2 schema. If set to true, the stdout/stderr Logs are ingested to [ContainerLogV2](container-insights-logs-schema.md) table. If not, the container logs are ingested to **ContainerLog** table, unless otherwise specified in the ConfigMap. When specifying the individual streams, you must include the corresponding table for ContainerLog or ContainerLogV2. |
| `streams` | An array of container insights table streams. See the supported streams above to table mapping. |


### New AKS cluster

Use the following command to create a new AKS cluster with monitoring enabled. This assumes a configuration file named **dataCollectionSettings.json**.

```azcli
az aks create -g <clusterResourceGroup> -n <clusterName> --enable-managed-identity --node-count 1 --enable-addons monitoring --data-collection-settings dataCollectionSettings.json --generate-ssh-keys 
```

### Existing AKS Cluster

**Cluster without the monitoring addon**
Use the following command to add monitoring to an existing cluster without Container insights enabled. This assumes a configuration file named **dataCollectionSettings.json**.

```azcli
az aks enable-addons -a monitoring -g <clusterResourceGroup> -n <clusterName> --data-collection-settings dataCollectionSettings.json
```

**Cluster with an existing monitoring addon**
Use the following command to add a new configuration to an existing cluster with Container insights enabled. This assumes a configuration file named **dataCollectionSettings.json**.

```azcli    
# get the configured log analytics workspace resource id
az aks show -g <clusterResourceGroup> -n <clusterName> | grep -i "logAnalyticsWorkspaceResourceID"

# disable monitoring 
az aks disable-addons -a monitoring -g <clusterResourceGroup> -n <clusterName>

# enable monitoring with data collection settings
az aks enable-addons -a monitoring -g <clusterResourceGroup> -n <clusterName> --workspace-resource-id <logAnalyticsWorkspaceResourceId> --data-collection-settings dataCollectionSettings.json
```

## Arc-enabled Kubernetes cluster
Use the following command to add monitoring to an existing Arc-enabled Kubernetes cluster. See [Data collection parameters](#data-collection-parameters) for definitions of the available settings.

```azcli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true dataCollectionSettings='{"interval":"1m","namespaceFilteringMode": "Include", "namespaces": [ "kube-system"],"enableContainerLogV2": true,"streams": ["<streams to be collected>"]}'
```

>[!NOTE]
> When deploying on a Windows machine, the dataCollectionSettings field must be escaped. For example, dataCollectionSettings={\"interval\":\"1m\",\"namespaceFilteringMode\": \"Include\", \"namespaces\": [ \"kube-system\"]} instead of dataCollectionSettings='{"interval":"1m","namespaceFilteringMode": "Include", "namespaces": [ "kube-system"]}'

## AKS hybrid Cluster
Use the following command to add monitoring to an existing AKS hybrid cluster. See [Data collection parameters](#data-collection-parameters) for definitions of the available settings.

```azcli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type provisionedclusters --cluster-resource-provider "microsoft.hybridcontainerservice" --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true dataCollectionSettings='{"interval":"1m","namespaceFilteringMode":"Include", "namespaces": ["kube-system"],"enableContainerLogV2": true,"streams": ["<streams to be collected>"]}'
```

>[!NOTE]
> When deploying on a Windows machine, the dataCollectionSettings field must be escaped. For example, dataCollectionSettings={\"interval\":\"1m\",\"namespaceFilteringMode\": \"Include\", \"namespaces\": [ \"kube-system\"]} instead of dataCollectionSettings='{"interval":"1m","namespaceFilteringMode": "Include", "namespaces": [ "kube-system"]}'

## [ARM](#tab/arm)


1. Download the Azure Resource Manager template and parameter files using the following commands. See below for the template and parameter files for each cluster configuration.

    ```bash
    curl -L <template file> -o existingClusterOnboarding.json
    curl -L <parameter file> -o existingClusterParam.json
    ```

    **AKS cluster**
    - Template: https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-file
    - Parameter: https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-parameter-file 

    **Arc-enabled Kubernetes**
    - Template: https://aka.ms/arc-k8s-enable-monitoring-costopt-onboarding-template-file
    - Parameter: https://aka.ms/arc-k8s-enable-monitoring-costopt-onboarding-template-parameter-file

    **AKS hybrid cluster**
    - Template: https://aka.ms/existingClusterOnboarding.json
    - Parameter: https://aka.ms/existingClusterParam.json

1. Edit the values in the parameter file. See [Data collection parameters](#data-collection-parameters) for details on each setting. See below for settings unique to each cluster configuration.

    **AKS cluster**<br>
    - For _aksResourceId_ and _aksResourceLocation_, use the values on the  **AKS Overview**  page for the AKS cluster.

    **Arc-enabled Kubernetes**
    - For _clusterResourceId_ and _clusterResourceLocation_, use the values on the  **Overview**  page for the AKS hybrid cluster.

    **AKS hybrid cluster**
    - For _clusterResourceId_ and  _clusterRegion_, use the values on the  **Overview**  page for the Arc enabled Kubernetes cluster.
    

| Name | Description |
|:---|:---|
| `dataCollectionInterval` | Determines how often the agent collects data.  Valid values are 1m - 30m in 1m intervals The default value is 1m. If the value is outside the allowed range, then it defaults to *1 m*. |
| `namespaceFilteringModeForDataCollection` | *Include*: Collects only data from the values in the *namespaces* field.<br>*Exclude*: Collects data from all namespaces except for the values in the *namespaces* field.<br>*Off*: Ignores any *namespace* selections and collect data on all namespaces.
| `namespacesForDataCollection` | Array of comma separated Kubernetes namespaces to collect inventory and perf data based on the _namespaceFilteringMode_.<br>For example, *namespaces = ["kube-system", "default"]* with an _Include_ setting collects only these two namespaces. With an _Exclude_ setting, the agent collects data from all other namespaces except for _kube-system_ and _default_. With an _Off_ setting, the agent collects data from all namespaces including _kube-system_ and _default_. Invalid and unrecognized namespaces are ignored. |
| `enableContainerLogV2` | Boolean flag to enable ContainerLogV2 schema. If set to true, the stdout/stderr Logs are ingested to [ContainerLogV2](container-insights-logs-schema.md) table. If not, the container logs are ingested to **ContainerLog** table, unless otherwise specified in the ConfigMap. When specifying the individual streams, you must include the corresponding table for ContainerLog or ContainerLogV2. |
| `streams` | An array of container insights table streams. See the supported streams above to table mapping. |


## Filtering options
There are multiple ways to filter data in Container insights using different methods of configuration. 


| Data | Description | Filtering method |
|:---|:---|:---|
| Container logs | Includes stdout and stderr logs from each monitored cluster. | - Use `[log_collection_settings]` in ConfigMap to either disable collection of stdout/stderr logs or exclude specific namespaces from collection.<br>- Use  |

## ConfigMap

    - [log_collection_settings]
      - enable/disable stdout/stderr
      - exclude specific namespaces for stdout/stderr

## DCR

    - Cost presets
      - Syslog
      - Exlude specific tables
      - 


## Data collected by Container insights

| Table | Contents | Filtering method |
|:---|:---|:---|
| ContainerLog | Contains stdout and stderr logs from each monitored cluster | - Use `[log_collection_settings]` in ConfigMap to either disable collection of stdout/stderr logs or exclude specific namespaces from collection.<br>- Use data collection rules (DCRs) to exclude specific tables from collection. |



## Next steps

- See [Configure data collection in Container insights using data collection rule](container-insights-data-collection-dcr.md) to configure data collection using DCR instead of ConfigMap.

