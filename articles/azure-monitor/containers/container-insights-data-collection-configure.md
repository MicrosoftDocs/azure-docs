---
title: Configure Container insights data collection and filtering
description: Details on configuring data collection in Azure Monitor Container insights including filtering data you don't require.
ms.topic: conceptual
ms.date: 05/14/2024
ms.reviewer: aul
---

# Configuring and filtering log collection in Container insights

This article provides details on how to configure data collection in Azure Monitor Container insights for your Kubernetes cluster, including how to filter data that you don't require. Kubernetes clusters generate a large amount of log data. You can collect all of this data in Container insights, but since you're charged for the ingestion and retention of this data, that may result in charges for data that you don't use. You can significantly reduce your monitoring costs by filtering out data that you don't need and also by optimizing the configuration of the Log Analytics workspace where you're storing your data.

## Configuration methods
There are two methods use to configure data being collected in Container insights, including filters applied to that data. Depending on the filtering that you want to implement, you may be able to choose between the two methods or you may be required to use one or the other.

The two methods are described in the table below with detailed information on each in the following sections.

| Method | Description |
|:---|:---| 
| [Data collection rule (DCR)](#configure-using-data-collection-rule-dcr) | [Data collection rules](../essentials/data-collection-rule-overview.md) are sets of instructions supporting data collection using the [Azure Monitor pipeline](../essentials/pipeline-overview.md). A DCR is created when you enable Container insights, and you can modify the settings in this DCR either using the Azure portal or other methods.<br><br>Using the DCR, you can enable collection of container logs and filter them by namespace. You can also collect inventory data, enable Syslog collection, and define the collection frequency. The DCR allows you to select from a collection of preset configurations instead of defining settings for individual tables. You can optionally add a transformation to the DCR to filter data according to custom criteria. | 
| [ConfigMap](#configure-using-configmap) | [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) are a Kubernetes mechanism that allow you to store non-confidential data such as a configuration file or environment variables. Container insights looks for a ConfigMap on each cluster with particular settings that define data that it should collect.<br><br>Using ConfigMap, you can enable enable collection of container logs and filter them by namespace the same as you can with the DCR. You can also perform additional configuration such as configure environment variable collection, enable metadata collection, and configure annotation based filtering. |

## Configure data collection with DCR


## [DCR (Azure portal)](#tab/portal)
The DCR is named *MSCI-\<cluster-region\>-\<cluster-name\>*. Rather than directly modifying the DCR, you should use one of the methods described below to configure data collection.


## Configure DCR with Azure portal
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
    | Enable ContainerLogV2 | Boolean flag to enable [ContainerLogV2 schema](./container-insights-logs-schema.md). If set to true, the stdout/stderr Logs are ingested to [ContainerLogV2](container-insights-logs-schema.md) table. If not, the container logs are ingested to **ContainerLog** table, unless otherwise specified in the ConfigMap. When specifying the individual streams, you must include the corresponding table for ContainerLog or ContainerLogV2. |
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

## [DCR (CLI)](#tab/cli)

## Configure DCR with Azure CLI

When you use CLI to configure monitoring for your AKS cluster, you provide the configuration as a JSON file using the following format. See the section below for how to use CLI to apply these settings to different cluster configurations.

```json
{
  "interval": "1m",
  "namespaceFilteringMode": "Include",
  "namespaces": ["kube-system"],
  "enableContainerLogV2": true, 
  "streams": ["Microsoft-Perf", "Microsoft-ContainerLogV2"]
}
```

Each of the settings in the configuration is described in the following table.

| Name | Description |
|:---|:---|
| `interval` | Determines how often the agent collects data.  Valid values are 1m - 30m in 1m intervals The default value is 1m. If the value is outside the allowed range, then it defaults to *1 m*. |
| `namespaceFilteringMode` | *Include*: Collects only data from the values in the *namespaces* field.<br>*Exclude*: Collects data from all namespaces except for the values in the *namespaces* field.<br>*Off*: Ignores any *namespace* selections and collect data on all namespaces.
| `namespaces` | Array of comma separated Kubernetes namespaces to collect inventory and perf data based on the _namespaceFilteringMode_.<br>For example, *namespaces = ["kube-system", "default"]* with an _Include_ setting collects only these two namespaces. With an _Exclude_ setting, the agent collects data from all other namespaces except for _kube-system_ and _default_. With an _Off_ setting, the agent collects data from all namespaces including _kube-system_ and _default_. Invalid and unrecognized namespaces are ignored. |
|  `enableContainerLogV2` | Boolean flag to enable ContainerLogV2 schema. If set to true, the stdout/stderr Logs are ingested to [ContainerLogV2](container-insights-logs-schema.md) table. If not, the container logs are ingested to **ContainerLog** table, unless otherwise specified in the ConfigMap. When specifying the individual streams, you must include the corresponding table for ContainerLog or ContainerLogV2. |
| `streams` | An array of container insights table streams. See the supported streams above to table mapping. |

### Prerequisites

- Azure CLI minimum version 2.51.0.
- For AKS clusters, [aks-preview](../../aks/cluster-configuration.md) version 0.5.147 or higher
- For Arc enabled Kubernetes and AKS hybrid, [k8s-extension](../../azure-arc/kubernetes/extensions.md#prerequisites) version 1.4.3 or higher



### AKS cluster

#### New AKS cluster

Use the following command to create a new AKS cluster with monitoring enabled. This assumes a configuration file named **dataCollectionSettings.json**.

```azcli
az aks create -g <clusterResourceGroup> -n <clusterName> --enable-managed-identity --node-count 1 --enable-addons monitoring --data-collection-settings dataCollectionSettings.json --generate-ssh-keys 
```

#### Existing AKS Cluster

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

### Arc-enabled Kubernetes cluster
Use the following command to add monitoring to an existing Arc-enabled Kubernetes cluster. See [Data collection parameters](#data-collection-parameters) for definitions of the available settings.

```azcli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true dataCollectionSettings='{"interval":"1m","namespaceFilteringMode": "Include", "namespaces": [ "kube-system"],"enableContainerLogV2": true,"streams": ["<streams to be collected>"]}'
```

>[!NOTE]
> When deploying on a Windows machine, the dataCollectionSettings field must be escaped. For example, dataCollectionSettings={\"interval\":\"1m\",\"namespaceFilteringMode\": \"Include\", \"namespaces\": [ \"kube-system\"]} instead of dataCollectionSettings='{"interval":"1m","namespaceFilteringMode": "Include", "namespaces": [ "kube-system"]}'

### AKS hybrid Cluster
Use the following command to add monitoring to an existing AKS hybrid cluster. See [Data collection parameters](#data-collection-parameters) for definitions of the available settings.

```azcli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type provisionedclusters --cluster-resource-provider "microsoft.hybridcontainerservice" --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true dataCollectionSettings='{"interval":"1m","namespaceFilteringMode":"Include", "namespaces": ["kube-system"],"enableContainerLogV2": true,"streams": ["<streams to be collected>"]}'
```

>[!NOTE]
> When deploying on a Windows machine, the dataCollectionSettings field must be escaped. For example, dataCollectionSettings={\"interval\":\"1m\",\"namespaceFilteringMode\": \"Include\", \"namespaces\": [ \"kube-system\"]} instead of dataCollectionSettings='{"interval":"1m","namespaceFilteringMode": "Include", "namespaces": [ "kube-system"]}'

## [ARM](#tab/arm)

## Configure DCR with ARM template

The following template and parameter files are available for different cluster configurations.

**AKS cluster**
- Template: https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-file
- Parameter: https://aka.ms/aks-enable-monitoring-costopt-onboarding-template-parameter-file 

**Arc-enabled Kubernetes**
- Template: https://aka.ms/arc-k8s-enable-monitoring-costopt-onboarding-template-file
- Parameter: https://aka.ms/arc-k8s-enable-monitoring-costopt-onboarding-template-parameter-file

**AKS hybrid cluster**
- Template: https://aka.ms/existingClusterOnboarding.json
- Parameter: https://aka.ms/existingClusterParam.json



| Name | Description |
|:---|:---|
| `aksResourceId` | Resource ID for the cluster.|
| `aksResourceLocation` | Location of the cluster.|
| `workspaceRegion` | Location of the Log Analytics workspace. | 
| `enableContainerLogV2` | Boolean flag to enable ContainerLogV2 schema. If set to true, the stdout/stderr Logs are ingested to [ContainerLogV2](container-insights-logs-schema.md) table. If not, the container logs are ingested to **ContainerLog** table, unless otherwise specified in the ConfigMap. When specifying the individual streams, you must include the corresponding table for ContainerLog or ContainerLogV2. |
| `enableSyslog` | Specifies whether Syslog collection should be enabled. |
| `syslogLevels` | If Syslog collection is enabled, specifies the log levels to collect. |
| `dataCollectionInterval` | Determines how often the agent collects data.  Valid values are 1m - 30m in 1m intervals The default value is 1m. If the value is outside the allowed range, then it defaults to *1 m*. |
| `namespaceFilteringModeForDataCollection` | *Include*: Collects only data from the values in the *namespaces* field.<br>*Exclude*: Collects data from all namespaces except for the values in the *namespaces* field.<br>*Off*: Ignores any *namespace* selections and collect data on all namespaces.
| `namespacesForDataCollection` | Array of comma separated Kubernetes namespaces to collect inventory and perf data based on the _namespaceFilteringMode_.<br>For example, *namespaces = ["kube-system", "default"]* with an _Include_ setting collects only these two namespaces. With an _Exclude_ setting, the agent collects data from all other namespaces except for _kube-system_ and _default_. With an _Off_ setting, the agent collects data from all namespaces including _kube-system_ and _default_. Invalid and unrecognized namespaces are ignored. |
| `streams` | An array of container insights table streams. See the supported streams above to table mapping. |
| `useAzureMonitorPrivateLinkScope` | Specifies whether to use private link for the cluster connection to Azure Monitor. |
| `azureMonitorPrivateLinkScopeResourceId` | If private link is used, resource ID of the private link scope.  |

---

### Applicable tables and metrics
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



### Stream values
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

## Configure data collection using ConfigMap

[ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) are a Kubernetes mechanism that allow you to store non-confidential data such as a configuration file or environment variables. Container insights looks for a ConfigMap on each cluster with particular settings that define data that it should collect. 

You can use settings in ConfigMap to enable or disable collection of stdout and stderr logs and filter specific namespaces from collection of stdout and stderr logs.

### Prerequisites 
- ConfigMap is a global list and there can be only one ConfigMap applied to the agent for Container insights. Applying another ConfigMap will overrule the previous ConfigMap collection settings.
- The minimum agent version supported to collect stdout, stderr, and environmental variables from container workloads is **ciprod06142019** or later. 

### Configure and deploy ConfigMap

Use the following procedure to configure and deploy your ConfigMap configuration file to your cluster:

1. If you don't already have a ConfigMap for Container insights, download the [template ConfigMap YAML file](https://aka.ms/container-azm-ms-agentconfig) and open it in an editor.

1. Edit the ConfigMap YAML file with your customizations. The template includes all valid settings with descriptions. To enable a setting, remove the comment character (#) and set its value. See [Data collection settings](#data-collection-settings) below for a description of each setting.

1. Create a ConfigMap by running the following kubectl command: 

    ```azurecli
    kubectl apply -f <configmap_yaml_file.yaml>
    
    # Example: 
    kubectl apply -f container-azm-ms-agentconfig.yaml
    ```


    The configuration change can take a few minutes to finish before taking effect. Then all Azure Monitor Agent pods in the cluster will restart. The restart is a rolling restart for all Azure Monitor Agent pods, so not all of them restart at the same time. When the restarts are finished, you'll receive a message similar to the following result: 
    
    ```output
    configmap "container-azm-ms-agentconfig" created`.
    ```

### Verify configuration

To verify the configuration was successfully applied to a cluster, use the following command to review the logs from an agent pod.

```azurecli
kubectl logs ama-logs-fdf58 -n kube-system
```

If there are configuration errors from the Azure Monitor Agent pods, the output will show errors similar to the following:

```output
***************Start Config Processing******************** 
config::unsupported/missing config schema version - 'v21' , using defaults
```

Use the following options to perform more troubleshooting of configuration changes:

- Use the same `kubectl logs` command from an agent pod.
- Review live logs for errors similar to the following:

    ```
    config::error::Exception while parsing config map for log collection/env variable settings: \nparse error on value \"$\" ($end), using defaults, please check config map for errors
    ```

- Data is sent to the `KubeMonAgentEvents` table in your Log Analytics workspace every hour with error severity for configuration errors. If there are no errors, the entry in the table will have data with severity info, which reports no errors. The `Tags` column contains more information about the pod and container ID on which the error occurred and also the first occurrence, last occurrence, and count in the last hour.

### Verify schema version

Supported config schema versions are available as pod annotation (schema-versions) on the Azure Monitor Agent pod. You can see them with the following kubectl command. 

```bash
kubectl describe pod ama-logs-fdf58 -n=kube-system.
```


### Enable and filter container logs
Container logs are stderr and stdout logs generated by containers in your Kubernetes cluster. These logs are stored in the [ContainerLogV2 table](./container-insights-logs-schema.md) in your Log Analytics workspace. By default all container logs are collected, but you can filter out logs from specific namespaces or disable collection of container logs entirely.

You can use either [ConfigMap](#configuration-methods) or [Data collection rule (DCR)](#configuration-methods) to enable or disable stdout and stderr logs and filter specific namespaces from each. Enable the `log_collection_settings.enrich_container_logs` setti9ng to add the container Name and Image to each log record. This applies to both stderr and stdout logs if they're enabled.

The following example shows the ConfigMap settings to collect stdout and stderr excluding the `kube-system` and `gatekeeper-system` namespaces. 

```yml
[log_collection_settings]
    [log_collection_settings.stdout]
        enabled = true
        exclude_namespaces = ["kube-system","gatekeeper-system"]

    [log_collection_settings.stderr]
        enabled = true
        exclude_namespaces = ["kube-system","gatekeeper-system"]

    [log_collection_settings.enrich_container_logs]
        enabled = true
```

If you use the Azure portal to configure the DCR, you can indirectly configure collection of container logs as part of a cost preset or set of collected data.



### Platform log filtering (System Kubernetes Namespaces)
By default, container logs from the system namespace are excluded from collection to minimize the Log Analytics cost. Container logs of system containers can be critical though in specific troubleshooting scenarios. This feature is restricted to the following system namespaces:  `kube-system`, `gatekeeper-system`, `calico-system`, `azure-arc`, `kube-public`, and `kube-node-lease`.

Enable platform logs using [ConfigMap](#configuration-methods) with the `collect_system_pod_logs` setting. You must also ensure that the system namespace is not in the `exclude_namespaces` setting. 

The following example shows the ConfigMap settings to collect stdout and stderr logs of `coredns` container in the `kube-system` namespace. 

```yaml
[log_collection_settings]
    [log_collection_settings.stdout]
        enabled = true
        exclude_namespaces = ["gatekeeper-system"]
        collect_system_pod_logs = ["kube-system:coredns"]

    [log_collection_settings.stderr]
        enabled = true
        exclude_namespaces = ["kube-system","gatekeeper-system"]
        collect_system_pod_logs = ["kube-system:coredns"]
```

### Enable Kubernetes metadata
When Kubernetes Logs Metadata is enabled, it adds a column to `ContainerLogV2` called `KubernetesMetadata` that enhances troubleshooting with simple log queries and removes the need for joining with other tables. The fields in this column include: `PodLabels`, `PodAnnotations`, `PodUid`, `Image`, `ImageID`, `ImageRepo`, `ImageTag`.

Enable Kubernetes metadata using [ConfigMap](#configuration-methods) with the following settings. All metadata fields are collected by default when the `metadata_collection` is enabled. Uncomment `include_fields` to specify individual fields to be collected.

```yaml
[log_collection_settings.metadata_collection]
    enabled = true
    include_fields = ["podLabels","podAnnotations","podUid","image","imageID","imageRepo","imageTag"]
```

### Annotation based filtering for workloads
Annotation-based filtering enables you to exclude log collection for certain pods and containers by annotating the pod. This can reduce your logs ingestion cost significantly and allow you to focus on relevant information without sifting through noise. 

Enable annotation based filtering using [ConfigMap](#configuration-methods) with the following settings. 

```yml
[log_collection_settings.filter_using_annotations]
   enabled = true
```

You must also add the required annotations on your workload pod spec. The following table highlights different possible pod annotations.

| Annotation | Description |
| ------------ | ------------- |
| `fluentbit.io/exclude: "true"` | Excludes both stdout & stderr streams on all the containers in the Pod |
| `fluentbit.io/exclude_stdout: "true"` | Excludes only stdout stream on all the containers in the Pod |
| `fluentbit.io/exclude_stderr: "true"` | Excludes only stderr stream on all the containers in the Pod |
| `fluentbit.io/exclude_container1: "true"` | Exclude both stdout & stderr streams only for the container1 in the pod |
| `fluentbit.io/exclude_stdout_container1: "true"` | Exclude only stdout only for the container1 in the pod |

>[!NOTE]
>These annotations are fluent bit based. If you use your own fluent-bit based log collection solution with the Kubernetes plugin filter and annotation based exclusion, it will stop collecting logs from both Container Insights and your solution.

Following is an example of `fluentbit.io/exclude: "true"` annotation in a Pod spec:

```
apiVersion: v1 
kind: Pod 
metadata: 
 name: apache-logs 
 labels: 
  app: apache-logs 
 annotations: 
  fluentbit.io/exclude: "true" 
spec: 
 containers: 
 - name: apache 
  image: edsiper/apache_logs 
```

### Enable and filter environment variables
Enable collection of environment variables across all pods and nodes in the cluster using [ConfigMap](#configuration-methods) with the following settings. 

```yaml
[log_collection_settings.env_var]
    enabled = true
```

If collection of environment variables is globally enabled, you can disable it for a specific container by setting the environment variable `AZMON_COLLECT_ENV` to `False` either with a Dockerfile setting or in the [configuration file for the Pod](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) under the `env:` section. If collection of environment variables is globally disabled, you can't enable collection for a specific container. The only override that can be applied at the container level is to disable collectdion when it's already enabled globally.




### Data collection settings

The following table describes the settings you can configure to control data collection with ConfigMap.


| Setting | Data type | Value | Description |
|:---|:---|:---|:---|
| `schema-version` | String (case sensitive) | v1 | Used by the agent when parsing this ConfigMap. Currently supported schema-version is v1. Modifying this value isn't supported and will be rejected when the ConfigMap is evaluated. |
| `config-version` | String |  | Allows you to keep track of this config file's version in your source control system/repository. Maximum allowed characters are 10, and all other characters are truncated. |
| **[log_collection_settings]** | | | |
| `[stdout]`<br>`enabled` | Boolean | true<br>false | Controls whether stdout container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection, stdout logs will be collected from all containers across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. |
| `[stdout]`<br>`exclude_namespaces` | String | Comma-separated array | Array of Kubernetes namespaces for which stdout logs won't be collected. This setting is effective only if `enabled` is set to `true`. If not specified in the ConfigMap, the default value is<br> `["kube-system","gatekeeper-system"]`. |
| `[stderr]`<br>`enabled` | Boolean | true<br>false | Controls whether stderr container log collection is enabled. When set to `true` and no namespaces are excluded for stderr log collection, stderr logs will be collected from all containers across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. |
| `[stderr]`<br>`exclude_namespaces` | String | Comma-separated array | Array of Kubernetes namespaces for which stderr logs won't be collected. This setting is effective only if `enabled` is set to `true`. If not specified in the ConfigMap, the default value is<br> `["kube-system","gatekeeper-system"]`. |
| `[env_var]`<br>`enabled` | Boolean | true<br>false | Controls environment variable collection across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`.  |
| `[enrich_container_logs]`<br>`enabled` | Boolean | true<br>false | Controls container log enrichment to populate the `Name` and `Image` property values for every log record written to the **ContainerLog** table for all container logs in the cluster. If not specified in the ConfigMap, the default value is `false`. |
| `[collect_all_kube_events]`<br>`enabled` | Boolean | true<br>false| Controls whether Kube events of all types are collected. By default, the Kube events with type **Normal** aren't collected. When this setting is `true`, the **Normal** events are no longer filtered, and all events are collected. If not specified in the ConfigMap, the default value is `false`. |
| `[schema]`<br>`containerlog_schema_version` | String (case sensitive) | v2<br>v1 | Sets the log ingestion format. If `v2`, the **ContainerLogV2** table is used. If `v1`, the **ContainerLog** table is used (this table has been deprecated). For clusters enabling container insights using Azure CLI version 2.54.0 or greater, the default setting is `v2`. See [Container insights log schema](./container-insights-logs-schema.md) for details. |
| `[enable_multiline_logs]`<br>`enabled` | Boolean | true<br>false | Controls whether multiline container logs are enabled. See [Multi-line logging in Container Insights](./container-insights-logs-schema.md#multi-line-logging-in-container-insights) for details. If not specified in the ConfigMap, the default value is `false`. This requires the `schema` setting to be `v2`. |
| `[metadata_collection]`<br>`enabled` | Boolean | true<br>false | Controls whether metadata is collected in the `KubernetesMetadata` column of the `ContainerLogV2` table. |
| `[metadata_collection]`<br>`include_fields` | String | Comma-separated array | List of metadata fields to include. If the setting isn't used then all fields are collected. Valid values are  `["podLabels","podAnnotations","podUid","image","imageID","imageRepo","imageTag"]` |
| **[metric_collection_settings]** | | | |
| `[collect_kube_system_pv_metrics]`<br>`enabled` | Boolean | true<br>false | Allows persistent volume (PV) usage metrics to be collected in the kube-system namespace. By default, usage metrics for persistent volumes with persistent volume claims in the kube-system namespace aren't collected. When this setting is set to `true`, PV usage metrics for all namespaces are collected. If not specified in the ConfigMap, the default value is `false`. |
| **[agent_settings]** | | | |
| `[proxy_config]`<br>`ignore_proxy_settings` | Boolean | true<br>false | When `true`, proxy settings are ignored. For both AKS and Arc-enabled Kubernetes environments, if your cluster is configured with forward proxy, then proxy settings are automatically applied and used for the agent. For certain configurations, such as with AMPLS + Proxy, you might want the proxy configuration to be ignored. If not specified in the ConfigMap, the default value is `false`. |



## Next steps

- See [Configure data collection in Container insights using data collection rule](container-insights-data-collection-dcr.md) to configure data collection using DCR instead of ConfigMap.

