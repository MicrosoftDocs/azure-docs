---
title: Configure Container insights data collection
description: This article describes how you can configure the Container insights agent to control stdout/stderr and environment variables log collection.
ms.topic: conceptual
ms.date: 11/14/2023
ms.reviewer: aul
---

# Configure data collection in Container insights

This article describes how to configure data collection in Container insights. You may want to collect additional data from your containerized workloads to support your DevOps or operational processes and procedures. Or you may want to reduce the amount of data collected to reduce costs.

You can configure data collection either using the Azure portal, which modifies the data collection rule (DCR) used by the agent, or by creating a custom Kubernetes ConfigMap.




## Methods
There are two methods to configure data collection in Container insights, the ConfigMap for the cluster and the data collection rule (DCR) used by the agent. While there is some overlap, each method provides different configuration options as shown in the following table.

### Data collection rule (DCR)
A [DCR](../essentials/data-collection-rule-overview.md) is created when you onboard a cluster to Container insights. This DCR is used by the containerized agent to define data collection for the cluster.

The DCR is primarily used to configure data collection of performance and inventory data and to configure cost optimization.

Specific configuration you can perform with the DCR includes:

- Enable/disable collection and namespace filtering for performance and inventory data
- Define collection interval for performance and inventory data
- Enable/disable collection of stdout and stderr logs
- Enable/disable Syslog collection
- Select log schema



### ConfigMap

[ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) are a Kubernetes mechanism that allow you to store non-confidential data such as configuration file or environment variables. You can configure Container insights data collection by modifying settings in its ConfigMap. ConfigMap is a global list and there can be only one ConfigMap applied to the agent for Container insights. You can't have another ConfigMap overruling the collections.

The ConfigMap is primarily used to configure data collection of the container logs and environment variables of the cluster. You can individually configure the stdout and stderr logs and also enable multiline logging.

Specific configuration you can perform with the ConfigMap includes:

- Enable/disable and namespace filtering for stdout and stderr logs
- Enable/disable collection of environment variables for the cluster
- Filter for Normal Kube events
- Select log schema
- Enable/disable multiline logging
- Ignore proxy settings  


## Data Collection Rule


>[!NOTE]
> DCR based configuration is not supported for service principal based clusters. [Migrate your clusters with service principal to managed identity](./container-insights-authentication.md) to use this experience.

1. In the Insights section of your Kubernetes cluster, select the **Monitoring Settings** button from the top toolbar

:::image type="content" source="./media/container-insights-logging-v2/container-insights-v2-monitoring-settings.png" lightbox="./media/container-insights-logging-v2/container-insights-v2-monitoring-settings.png" alt-text="Screenshot that shows monitoring settings.":::

2. Select **Edit collection settings** to open the advanced settings

:::image type="content" source="./media/container-insights-logging-v2/container-insights-v2-monitoring-settings-open.png" lightbox="./media/container-insights-logging-v2/container-insights-v2-monitoring-settings-open.png" alt-text="Screenshot that shows advanced collection settings.":::

3. Select the checkbox with **Enable ContainerLogV2** and choose the **Save** button below

:::image type="content" source="./media/container-insights-logging-v2/container-insights-v2-collection-settings.png" lightbox="./media/container-insights-logging-v2/container-insights-v2-collection-settings.png" alt-text="Screenshot that shows ContainerLogV2 checkbox.":::

4. The summary section should display the message "ContainerLogV2 enabled", click the **Configure** button to complete your configuration change

:::image type="content" source="./media/container-insights-logging-v2/container-insights-v2-monitoring-settings-configured.png" lightbox="./media/container-insights-logging-v2/container-insights-v2-monitoring-settings-configured.png" alt-text="Screenshot that shows ContainerLogV2 enabled.":::

## ConfigMap



>[!IMPORTANT]
>The minimum agent version supported to collect stdout, stderr, and environmental variables from container workloads is **ciprod06142019** or later. To verify your agent version, on the **Node** tab, select a node. On the **Properties** pane, note the value of the **Agent Image Tag** property. For more information about the agent versions and what's included in each release, see [Agent release notes](https://github.com/microsoft/Docker-Provider/tree/ci_feature_prod).

To configure and deploy your ConfigMap configuration file to your cluster:

1. Download the [template ConfigMap YAML file](https://aka.ms/container-azm-ms-agentconfig) and open it in an editor. If you already have a ConfigMap file, then you can use that one.
1. Edit the ConfigMap YAML file with your customizations to collect stdout, stderr, and environmental variables:

    - To exclude specific namespaces for stdout log collection, configure the key/value by using the following example:
    `[log_collection_settings.stdout] enabled = true exclude_namespaces = ["my-namespace-1", "my-namespace-2"]`.
    - To disable environment variable collection for a specific container, set the key/value `[log_collection_settings.env_var] enabled = true` to enable variable collection globally. Then follow the steps [here](container-insights-manage-agent.md#disable-environment-variable-collection-on-a-container) to complete configuration for the specific container.
    - To disable stderr log collection cluster-wide, configure the key/value by using the following example: `[log_collection_settings.stderr] enabled = false`.
    
    Save your changes in the editor.

1. Create a ConfigMap by running the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.
    
    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`

The configuration change can take a few minutes to finish before taking effect. Then all Azure Monitor Agent pods in the cluster will restart. The restart is a rolling restart for all Azure Monitor Agent pods, so not all of them restart at the same time. When the restarts are finished, a message similar to this example includes the following result: `configmap "container-azm-ms-agentconfig" created`.



### Data collection settings

The following table describes the settings you can configure to control data collection.

>[!NOTE]
>For clusters enabling container insights using Azure CLI version 2.54.0 or greater, the default setting for `[log_collection_settings.schema]` will be set to "v2"

| Key | Data type | Value | Description |
|--|--|--|--|
| `schema-version` | String (case sensitive) | v1 | Used by the agent when parsing this ConfigMap. Currently supported schema-version is v1. Modifying this value isn't supported and will be rejected when the ConfigMap is evaluated. |
| `config-version` | String |  | Allows you to keep track of this config file's version in your source control system/repository. Maximum allowed characters are 10, and all other characters are truncated. |
| `[log_collection_settings.stdout]`<br>`enabled` | Boolean | true<br>false | Controls whether stdout container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection, stdout logs will be collected from all containers across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. |
| `[log_collection_settings.stdout]`<br>`exclude_namespaces` | String | Comma-separated array | Array of Kubernetes namespaces for which stdout logs won't be collected. This setting is effective only if `enabled` is set to `true`. If not specified in the ConfigMap, the default value is<br> `["kube-system","gatekeeper-system"]`. |
| `[log_collection_settings.stderr]`<br>`enabled` | Boolean | true<br>false | Controls whether stderr container log collection is enabled. When set to `true` and no namespaces are excluded for stderr log collection, stderr logs will be collected from all containers across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. |
| `[log_collection_settings.stderr]`<br>`exclude_namespaces` | String | Comma-separated array | Array of Kubernetes namespaces for which stderr logs won't be collected. This setting is effective only if `enabled` is set to `true`. If not specified in the ConfigMap, the default value is<br> `["kube-system","gatekeeper-system"]`. |
| `[log_collection_settings.env_var]`<br>`enabled` | Boolean | true<br>false | This setting controls environment variable collection across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. If collection of environment variables is globally enabled, you can disable it for a specific container by setting the environment variable `AZMON_COLLECT_ENV` to `False` either with a Dockerfile setting or in the [configuration file for the Pod](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) under the `env:` section. If collection of environment variables is globally disabled, you can't enable collection for a specific container. The only override that can be applied at the container level is to disable collection when it's already enabled globally. |
| `[log_collection_settings.enrich_container_logs]`<br>`enabled` | Boolean | true<br>false | Controls container log enrichment to populate the `Name` and `Image` property values for every log record written to the **ContainerLogV2** or **ContainerLog** table for all container logs in the cluster. If not specified in the ConfigMap, the default value is `false`. |
| `[log_collection_settings.collect_all_kube_events]`<br>`enabled` | Boolean | true<br>false| Controls whether Kube events of all types are collected. By default, the Kube events with type **Normal** aren't collected. When this setting is `true`, the **Normal** events are no longer filtered, and all events are collected. If not specified in the ConfigMap, the default value is `false`. |
| `[log_collection_settings.schema]`<br>`enabled` | String (case sensitive) | v2<br>v1 | Sets the log ingestion format. If `v2`, the **ContainerLogV2** table is used. If `v1`, the **ContainerLog** table is used (this table has been deprecated). See [Container insights log schema](./container-insights-logs-schema.md) for details. |
| `[log_collection_settings.enable_multiline_logs] enabled` | Boolean | true<br>false | Controls whether multiline container logs are enabled. See [Multi-line logging in Container Insights](./container-insights-logs-schema.md#multi-line-logging-in-container-insights) for details. If not specified in the ConfigMap, the default value is `false`. |

### Metric collection settings

The following table describes the settings you can configure to control metric collection.

| Key | Data type | Value | Description |
|--|--|--|--|
| `[metric_collection_settings.collect_kube_system_pv_metrics]`<br>`enabled` | Boolean | true<br>false | Allows persistent volume (PV) usage metrics to be collected in the kube-system namespace. By default, usage metrics for persistent volumes with persistent volume claims in the kube-system namespace aren't collected. When this setting is set to `true`, PV usage metrics for all namespaces are collected. If not specified in the ConfigMap, the default value is `false`. |



### Agent settings for outbound proxy with Azure Monitor Private Link Scope (AMPLS)

| Key | Data type | Value | Description |
|--|--|--|--|
| `[agent_settings.proxy_config]`<br>`ignore_proxy_settings` | Boolean | true<br>false | When `true`, proxy settings are ignored. For both AKS and Arc-enabled Kubernetes environments, if your cluster is configured with forward proxy, then proxy settings are automatically applied and used for the agent. For certain configurations, such as with AMPLS + Proxy, you might want the proxy configuration to be ignored. If not specified in the ConfigMap, the default value is `false`. |



## Verify configuration

To verify the configuration was successfully applied to a cluster, use the following command to review the logs from an agent pod. 

```bash
kubectl logs ama-logs-fdf58 -n kube-system
```

If there are configuration errors from the Azure Monitor Agent pods, the output will show errors similar to the following example:

``` 
***************Start Config Processing******************** 
config::unsupported/missing config schema version - 'v21' , using defaults
```

Errors related to applying configuration changes are also available for review. The following options are available to perform more troubleshooting of configuration changes:

- From an agent pod log using the same `kubectl logs` command.
- From live logs. Live logs show errors similar to the following example:

    ```
    config::error::Exception while parsing config map for log collection/env variable settings: \nparse error on value \"$\" ($end), using defaults, please check config map for errors
    ```

- From the **KubeMonAgentEvents** table in your Log Analytics workspace. Data is sent every hour with error severity for configuration errors. If there are no errors, the entry in the table will have data with severity info, which reports no errors. The **Tags** property contains more information about the pod and container ID on which the error occurred and also the first occurrence, last occurrence, and count in the last hour.


## Verify schema version

Supported config schema versions are available as pod annotation (schema-versions) on the Azure Monitor Agent pod. You can see them with the following kubectl command. 

```bash
`kubectl describe pod ama-logs-fdf58 -n=kube-system`.
```

Output similar to the following example appears with the annotation schema-versions:

```
    Name:           ama-logs-fdf58
    Namespace:      kube-system
    Node:           aks-agentpool-95673144-0/10.240.0.4
    Start Time:     Mon, 10 Jun 2019 15:01:03 -0700
    Labels:         controller-revision-hash=589cc7785d
                    dsName=ama-logs-ds
                    pod-template-generation=1
    Annotations:    agentVersion=1.10.0.1
                  dockerProviderVersion=5.0.0-0
                    schema-versions=v1 
```

## Frequently asked questions

This section provides answers to common questions.

### How do I enable log collection for containers in the kube-system namespace through Helm?

The log collection from containers in the kube-system namespace is disabled by default. You can enable log collection by setting an environment variable on Azure Monitor Agent. See the [Container insights](https://aka.ms/azuremonitor-containers-helm-chart) GitHub page.
          


## Next steps

- Container insights doesn't include a predefined set of alerts. Review the [Create performance alerts with Container insights](./container-insights-log-alerts.md) to learn how to create recommended alerts for high CPU and memory utilization to support your DevOps or operational processes and procedures.
- With monitoring enabled to collect health and resource utilization of your Azure Kubernetes Service or hybrid cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.
- View [log query examples](container-insights-log-query.md) to see predefined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.






### Prerequisites 

Customers must [enable ContainerLogV2](./container-insights-logs-schema.md#enable-the-containerlogv2-schema) for multi-line logging to work.

### How to enable 
Multi-line logging feature can be enabled by setting **enabled** flag to "true" under the `[log_collection_settings.enable_multiline_logs]` section in the [config map](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml)

```yaml
[log_collection_settings.enable_multiline_logs]
# fluent-bit based multiline log collection for go (stacktrace), dotnet (stacktrace)
# if enabled will also stitch together container logs split by docker/cri due to size limits(16KB per log line)
  enabled = "true"
```




Before you start, review the Kubernetes documentation about . Familiarize yourself with how to create, configure, and deploy ConfigMaps. You need to know how to filter stderr and stdout per namespace or across the entire cluster. You also need to know how to filter environment variables for any container running across all pods/nodes in the cluster.