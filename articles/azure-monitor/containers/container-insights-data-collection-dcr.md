---
title: Configure Container insights data collection using data collection rule
description: Describes how you can configure cost optimization and other data collection for Container insights using a data collection rule.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 12/19/2023
ms.reviewer: aul
---

# Configure data collection in Container insights using data collection rule

This article describes how to configure data collection in Container insights using the [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) for the cluster. A DCR is created when you onboard a cluster to Container insights. This DCR is used by the containerized agent to define data collection for the cluster.

The DCR is primarily used to configure data collection of performance and inventory data and to configure cost optimization.

Specific configuration you can perform with the DCR includes:

- Enable/disable collection and namespace filtering for performance and inventory data (Use [ConfigMap](./container-insights-data-collection-configmap.md) for namespace filtering of logs.)
- Define collection interval for performance and inventory data
- Enable/disable Syslog collection
- Select log schema

> [!NOTE]
> See [Configure data collection in Container insights using ConfigMap](./container-insights-data-collection-configmap.md) to configure data collection using a DCR which allows you to configure different settings.

## Prerequisites

- AKS clusters must use either System or User Assigned Managed Identity. If cluster is using a Service Principal, you must [upgrade to Managed Identity](../../aks/use-managed-identity.md#enable-managed-identities-on-an-existing-aks-cluster).



## Configure data collection
The DCR that gets created when you enable Container insights is named *MSCI-\<cluster-region\>-\<cluster-name\>*. You can view it in the Azure portal by selecting the **Data Collection Rules** option in the **Monitor** menu in the Azure portal. Rather than directly modifying the DCR, you should use one of the methods described below to configure data collection. See [Data collection parameters](#data-collection-parameters) for details about the different available settings used by each method.

> [!WARNING]
> The default Container insights experience depends on all the existing data streams. Removing one or more of the default streams makes the Container insights experience unavailable, and you need to use other tools such as Grafana dashboards and log queries to analyze collected data.

## [Azure portal](#tab/portal)
You can use the Azure portal to enable cost optimization on your existing cluster after Container insights has been enabled, or you can enable Container insights on the cluster along with cost optimization.

1. Select the cluster in the Azure portal.
2. Select the **Insights** option in the **Monitoring** section of the menu.
3. If Container insights has already been enabled on the cluster, select the **Monitoring Settings** button. If not, select **Configure Azure Monitor** and see [Enable monitoring on your Kubernetes cluster with Azure Monitor](container-insights-onboard.md) for details on enabling monitoring. 

    :::image type="content" source="media/container-insights-cost-config/monitor-settings-button.png" alt-text="Screenshot of AKS cluster with monitor settings button." lightbox="media/container-insights-cost-config/monitor-settings-button.png" :::


4. For AKS and Arc-enabled Kubernetes, select **Use managed identity** if you haven't yet migrated the cluster to [managed identity authentication](../containers/container-insights-onboard.md#authentication).
5. Select one of the cost presets described in [Cost presets](#cost-presets).

    :::image type="content" source="media/container-insights-cost-config/cost-settings-onboarding.png" alt-text="Screenshot that shows the onboarding options." lightbox="media/container-insights-cost-config/cost-settings-onboarding.png" :::

1. If you want to customize the settings, click **Edit collection settings**. See [Data collection parameters](#data-collection-parameters) for details on each setting. For **Collected data**, see [Collected data](#collected-data) below.

    :::image type="content" source="media/container-insights-cost-config/advanced-collection-settings.png" alt-text="Screenshot that shows the collection settings options." lightbox="media/container-insights-cost-config/advanced-collection-settings.png" :::

1. Click **Configure** to save the settings.


### Cost presets
When you use the Azure portal to configure cost optimization, you can select from the following preset configurations. You can select one of these or provide your own customized settings. By default, Container insights uses the *Standard* preset.

| Cost preset | Collection frequency | Namespace filters | Syslog collection | Collected data |
| --- | --- | --- | --- | --- |
| Standard | 1 m | None | Not enabled | All standard container insights tables |
| Cost-optimized | 5 m | Excludes kube-system, gatekeeper-system, azure-arc | Not enabled | All standard container insights tables |
| Syslog | 1 m | None | Enabled by default | All standard container insights tables |
| Logs and Events | 1 m | None | Not enabled | ContainerLog/ContainerLogV2<br> KubeEvents<br>KubePodInventory |

### Collected data
The **Collected data** option allows you to select the tables that are populated for the cluster. This is the equivalent of the `streams` parameter when performing the configuration with CLI or ARM. If you select any option other than **All (Default)**, the Container insights experience becomes unavailable, and you must use Grafana or other methods to analyze collected data.

:::image type="content" source="media/container-insights-cost-config/collected-data-options.png" alt-text="Screenshot that shows the collected data options." lightbox="media/container-insights-cost-config/collected-data-options.png" :::

| Grouping | Tables | Notes |
| --- | --- | --- |
| All (Default) | All standard container insights tables | Required for enabling the default Container insights visualizations |
| Performance | Perf, InsightsMetrics | |
| Logs and events | ContainerLog or ContainerLogV2, KubeEvents, KubePodInventory | Recommended if you have enabled managed Prometheus metrics |
| Workloads, Deployments, and HPAs | InsightsMetrics, KubePodInventory, KubeEvents, ContainerInventory, ContainerNodeInventory, KubeNodeInventory, KubeServices | |
| Persistent Volumes | InsightsMetrics, KubePVInventory | |



## [CLI](#tab/cli)

> [!NOTE]
> Minimum version required for Azure CLI is 2.51.0.
```
- For AKS clusters, [aks-preview](../../aks/cluster-configuration.md) version 0.5.147 or higher
- For Arc enabled Kubernetes and AKS hybrid, [k8s-extension](../../azure-arc/kubernetes/extensions.md#prerequisites) version 1.4.3 or higher
```## AKS cluster

When you use CLI to configure monitoring for your AKS cluster, you provide the configuration as a JSON file using the following format. Each of these settings is described in [Data collection parameters](#data-collection-parameters).

```json
{
  "interval": "1m",
  "namespaceFilteringMode": "Include",
  "namespaces": ["kube-system"],
  "enableContainerLogV2": true, 
  "streams": ["Microsoft-Perf", "Microsoft-ContainerLogV2"]
}
```

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
    


1. Deploy the ARM template with the following commands:

    ```azcli
    az login
    az account set --subscription"Cluster Subscription Name"
    az deployment group create --resource-group <ClusterResourceGroupName> --template-file ./existingClusterOnboarding.json --parameters @./existingClusterParam.json
    ```




---

## Data collection parameters

The following table describes the supported data collection settings and the name used for each for different onboarding options.


| Name | Description |
|:---|:---|
| Collection frequency<br>CLI: `interval`<br>ARM: `dataCollectionInterval` | Determines how often the agent collects data.  Valid values are 1m - 30m in 1m intervals The default value is 1m. If the value is outside the allowed range, then it defaults to *1 m*. |
| Namespace filtering<br>CLI: `namespaceFilteringMode`<br>ARM: `namespaceFilteringModeForDataCollection` | *Include*: Collects only data from the values in the *namespaces* field.<br>*Exclude*: Collects data from all namespaces except for the values in the *namespaces* field.<br>*Off*: Ignores any *namespace* selections and collect data on all namespaces.
| Namespace filtering<br>CLI: `namespaces`<br>ARM: `namespacesForDataCollection` | Array of comma separated Kubernetes namespaces to collect inventory and perf data based on the _namespaceFilteringMode_.<br>For example, *namespaces = ["kube-system", "default"]* with an _Include_ setting collects only these two namespaces. With an _Exclude_ setting, the agent collects data from all other namespaces except for _kube-system_ and _default_. With an _Off_ setting, the agent collects data from all namespaces including _kube-system_ and _default_. Invalid and unrecognized namespaces are ignored. |
| Enable ContainerLogV2<br>CLI: `enableContainerLogV2`<br>ARM: `enableContainerLogV2` | Boolean flag to enable ContainerLogV2 schema. If set to true, the stdout/stderr Logs are ingested to [ContainerLogV2](container-insights-logs-schema.md) table. If not, the container logs are ingested to **ContainerLog** table, unless otherwise specified in the ConfigMap. When specifying the individual streams, you must include the corresponding table for ContainerLog or ContainerLogV2. |
| Collected Data<br>CLI: `streams`<br>ARM: `streams` | An array of container insights table streams. See the supported streams above to table mapping. |

## Applicable tables and metrics
The settings for **collection frequency** and **namespace filtering** don't apply to all Container insights data. The following tables list the tables in the Log Analytics workspace used by Container insights and the metrics it collects along with the settings that apply to each. 

>[!NOTE]
>This feature configures settings for all container insights tables except for ContainerLog and ContainerLogV2. To configure settings for these tables, update the ConfigMap described in [agent data collection settings](../containers/container-insights-data-collection-configmap.md).


| Table name | Interval? | Namespaces? | Remarks |
|:---|:---:|:---:|:---|
| ContainerInventory | Yes | Yes | |
| ContainerNodeInventory | Yes | No | Data collection setting for namespaces isn't applicable since Kubernetes Node isn't a namespace scoped resource |
| KubeNodeInventory | Yes | No | Data collection setting for namespaces isn't applicable Kubernetes Node isn't a namespace scoped resource |
| KubePodInventory | Yes | Yes ||
| KubePVInventory | Yes | Yes | |
| KubeServices | Yes | Yes | |
| KubeEvents | No | Yes | Data collection setting for interval isn't applicable for the Kubernetes Events |
| Perf | Yes | Yes | Data collection setting for namespaces isn't applicable for the Kubernetes Node related metrics since the Kubernetes Node isn't a namespace scoped object. |
| InsightsMetrics| Yes | Yes | Data collection settings are only applicable for the metrics collecting the following namespaces: container.azm.ms/kubestate, container.azm.ms/pv and container.azm.ms/gpu |


| Metric namespace | Interval? | Namespaces? | Remarks |
|:---|:---:|:---:|:---|
| Insights.container/nodes| Yes | No | Node isn't a namespace scoped resource |
|Insights.container/pods | Yes | Yes| |
| Insights.container/containers | Yes | Yes | |
| Insights.container/persistentvolumes | Yes | Yes | |



## Stream values
When you specify the tables to collect using CLI or ARM, you specify a stream name that corresponds to a particular table in the Log Analytics workspace. The following table lists the stream name for each table.

> [!NOTE]
> If you're familiar with the [structure of a data collection rule](../essentials/data-collection-rule-structure.md), the stream names in this table are specified in the [dataFlows](../essentials/data-collection-rule-structure.md#dataflows) section of the DCR.

| Stream | Container insights table |
| --- | --- |
| Microsoft-ContainerInventory | ContainerInventory |
| Microsoft-ContainerLog | ContainerLog |
| Microsoft-ContainerLogV2 | ContainerLogV2 |
| Microsoft-ContainerNodeInventory | ContainerNodeInventory |
| Microsoft-InsightsMetrics | InsightsMetrics |
| Microsoft-KubeEvents | KubeEvents |
| Microsoft-KubeMonAgentEvents | KubeMonAgentEvents |
| Microsoft-KubeNodeInventory | KubeNodeInventory |
| Microsoft-KubePodInventory | KubePodInventory |
| Microsoft-KubePVInventory | KubePVInventory |
| Microsoft-KubeServices | KubeServices |
| Microsoft-Perf | Perf |


## Impact on visualizations and alerts

If you're currently using the above tables for other custom alerts or charts, then modifying your data collection settings might degrade those experiences. If you're excluding namespaces or reducing data collection frequency, review your existing alerts, dashboards, and workbooks using this data.

To scan for alerts that reference these tables, run the following Azure Resource Graph query:

```Kusto
resources
| where type in~ ('microsoft.insights/scheduledqueryrules') and ['kind'] !in~ ('LogToMetric')
| extend severity = strcat("Sev", properties["severity"])
| extend enabled = tobool(properties["enabled"])
| where enabled in~ ('true')
| where tolower(properties["targetResourceTypes"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["targetResourceType"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["scopes"]) matches regex 'providers/microsoft.operationalinsights/workspaces($|/.*)?'
| where properties contains "Perf" or properties  contains "InsightsMetrics" or properties  contains "ContainerInventory" or properties  contains "ContainerNodeInventory" or properties  contains "KubeNodeInventory" or properties  contains"KubePodInventory" or properties  contains "KubePVInventory" or properties  contains "KubeServices" or properties  contains "KubeEvents" 
| project id,name,type,properties,enabled,severity,subscriptionId
| order by tolower(name) asc
```



## Next steps

- See [Configure data collection in Container insights using ConfigMap](container-insights-data-collection-configmap.md) to configure data collection using ConfigMap instead of the DCR.
