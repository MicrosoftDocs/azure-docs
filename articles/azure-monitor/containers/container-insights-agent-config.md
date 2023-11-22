---
title: Configure Container insights agent data collection | Microsoft Docs
description: This article describes how you can configure the Container insights agent to control stdout/stderr and environment variables log collection.
ms.topic: conceptual
ms.date: 11/14/2023
ms.reviewer: aul
---

# Configure agent data collection for Container insights

Container insights collects stdout, stderr, and environmental variables from container workloads deployed to managed Kubernetes clusters from the containerized agent. You can configure agent data collection settings by creating a custom Kubernetes ConfigMap to control this experience.

This article demonstrates how to create ConfigMaps and configure data collection based on your requirements.

## ConfigMap file settings overview

A template ConfigMap file is provided so that you can easily edit it with your customizations without having to create it from scratch. Before you start, review the Kubernetes documentation about [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/). Familiarize yourself with how to create, configure, and deploy ConfigMaps. You need to know how to filter stderr and stdout per namespace or across the entire cluster. You also need to know how to filter environment variables for any container running across all pods/nodes in the cluster.

>[!IMPORTANT]
>The minimum agent version supported to collect stdout, stderr, and environmental variables from container workloads is **ciprod06142019** or later. To verify your agent version, on the **Node** tab, select a node. On the **Properties** pane, note the value of the **Agent Image Tag** property. For more information about the agent versions and what's included in each release, see [Agent release notes](https://github.com/microsoft/Docker-Provider/tree/ci_feature_prod).

### Data collection settings

The following table describes the settings you can configure to control data collection.

>[!NOTE]
>For clusters enabling container insights using Azure CLI version 2.54.0 or greater, the default setting for `[log_collection_settings.schema]` will be set to "v2"

| Key | Data type | Value | Description |
|--|--|--|--|
| `schema-version` | String (case sensitive) | v1 | This schema version is used by the agent<br> when parsing this ConfigMap.<br> Currently supported schema-version is v1.<br> Modifying this value isn't supported and will be<br> rejected when the ConfigMap is evaluated. |
| `config-version` | String |  | Supports the ability to keep track of this config file's version in your source control system/repository.<br> Maximum allowed characters are 10, and all other characters are truncated. |
| `[log_collection_settings.stdout] enabled =` | Boolean | True or false | Controls if stdout container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection<br> (`log_collection_settings.stdout.exclude_namespaces` setting), stdout logs will be collected from all containers across all pods/nodes in the cluster. If not specified in the ConfigMap,<br> the default value is `enabled = true`. |
| `[log_collection_settings.stdout] exclude_namespaces =` | String | Comma-separated array | Array of Kubernetes namespaces for which stdout logs won't be collected. This setting is effective only if<br> `log_collection_settings.stdout.enabled`<br> is set to `true`.<br> If not specified in the ConfigMap, the default value is<br> `exclude_namespaces = ["kube-system","gatekeeper-system"]`. |
| `[log_collection_settings.stderr] enabled =` | Boolean | True or false | Controls if stderr container log collection is enabled.<br> When set to `true` and no namespaces are excluded for stdout log collection<br> (`log_collection_settings.stderr.exclude_namespaces` setting), stderr logs will be collected from all containers across all pods/nodes in the cluster.<br> If not specified in the ConfigMap, the default value is<br> `enabled = true`. |
| `[log_collection_settings.stderr] exclude_namespaces =` | String | Comma-separated array | Array of Kubernetes namespaces for which stderr logs won't be collected.<br> This setting is effective only if<br> `log_collection_settings.stdout.enabled` is set to `true`.<br> If not specified in the ConfigMap, the default value is<br> `exclude_namespaces = ["kube-system","gatekeeper-system"]`. |
| `[log_collection_settings.env_var] enabled =` | Boolean | True or false | This setting controls environment variable collection<br> across all pods/nodes in the cluster<br> and defaults to `enabled = true` when not specified<br> in the ConfigMap.<br> If collection of environment variables is globally enabled, you can disable it for a specific container<br> by setting the environment variable<br> `AZMON_COLLECT_ENV` to `False` either with a Dockerfile setting or in the [configuration file for the Pod](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) under the `env:` section.<br> If collection of environment variables is globally disabled, you can't enable collection for a specific container. The only override that can be applied at the container level is to disable collection when it's already enabled globally. |
| `[log_collection_settings.enrich_container_logs] enabled =` | Boolean | True or false | This setting controls container log enrichment to populate the `Name` and `Image` property values<br> for every log record written to the **ContainerLog** table for all container logs in the cluster.<br> It defaults to `enabled = false` when not specified in the ConfigMap. |
| `[log_collection_settings.collect_all_kube_events] enabled =` | Boolean | True or false | This setting allows the collection of Kube events of all types.<br> By default, the Kube events with type **Normal** aren't collected. When this setting is set to `true`, the **Normal** events are no longer filtered, and all events are collected.<br> It defaults to `enabled = false` when not specified in the ConfigMap. |
| `[log_collection_settings.schema] enabled =` | String (case sensitive) | v2 or v1 [(retired)](./container-insights-v2-migration.md) | This setting sets the log ingestion format to ContainerLogV2 |
| `[log_collection_settings.enable_multiline_logs] enabled =` | Boolean | True or False | This setting controls whether multiline container logs are enabled. They are disabled by default. See [Multi-line logging in Container Insights](./container-insights-logging-v2.md) to learn more. |

### Metric collection settings

The following table describes the settings you can configure to control metric collection.

| Key | Data type | Value | Description |
|--|--|--|--|
| `[metric_collection_settings.collect_kube_system_pv_metrics] enabled =` | Boolean | True or false | This setting allows persistent volume (PV) usage metrics to be collected in the kube-system namespace. By default, usage metrics for persistent volumes with persistent volume claims in the kube-system namespace aren't collected. When this setting is set to `true`, PV usage metrics for all namespaces are collected. By default, this setting is set to `false`. |

ConfigMap is a global list and there can be only one ConfigMap applied to the agent. You can't have another ConfigMap overruling the collections.

### Agent settings for outbound proxy with Azure Monitor Private Link Scope (AMPLS)

| Key | Data type | Value | Description |
|--|--|--|--|
| `[agent_settings.proxy_config] ignore_proxy_settings =` | Boolean | True or false | Set this value to true to ignore proxy settings. On both AKS & Arc K8s environments, if your cluster is configured with forward proxy, then proxy settings are automatically applied and used for the agent. For certain configurations, such as, with AMPLS + Proxy, you might with for the proxy config to be ignored. . By default, this setting is set to `false`. |

## Configure and deploy ConfigMaps

To configure and deploy your ConfigMap configuration file to your cluster:

1. Download the [template ConfigMap YAML file](https://aka.ms/container-azm-ms-agentconfig) and save it as *container-azm-ms-agentconfig.yaml*.

1. Edit the ConfigMap YAML file with your customizations to collect stdout, stderr, and environmental variables:

    - To exclude specific namespaces for stdout log collection, configure the key/value by using the following example:
    `[log_collection_settings.stdout] enabled = true exclude_namespaces = ["my-namespace-1", "my-namespace-2"]`.
    - To disable environment variable collection for a specific container, set the key/value `[log_collection_settings.env_var] enabled = true` to enable variable collection globally. Then follow the steps [here](container-insights-manage-agent.md#disable-environment-variable-collection-on-a-container) to complete configuration for the specific container.
    - To disable stderr log collection cluster-wide, configure the key/value by using the following example: `[log_collection_settings.stderr] enabled = false`.
    
    Save your changes in the editor.

1. Create a ConfigMap by running the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.
    
    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`

The configuration change can take a few minutes to finish before taking effect. Then all Azure Monitor Agent pods in the cluster will restart. The restart is a rolling restart for all Azure Monitor Agent pods, so not all of them restart at the same time. When the restarts are finished, a message similar to this example includes the following result: `configmap "container-azm-ms-agentconfig" created`.


## Verify configuration

To verify the configuration was successfully applied to a cluster, use the following command to review the logs from an agent pod: `kubectl logs ama-logs-fdf58 -n kube-system`. If there are configuration errors from the Azure Monitor Agent pods, the output will show errors similar to the following example:

``` 
***************Start Config Processing******************** 
config::unsupported/missing config schema version - 'v21' , using defaults
```

Errors related to applying configuration changes are also available for review. The following options are available to perform more troubleshooting of configuration changes:

- From an agent pod log by using the same `kubectl logs` command.
- From live logs. Live logs show errors similar to the following example:

    ```
    config::error::Exception while parsing config map for log collection/env variable settings: \nparse error on value \"$\" ($end), using defaults, please check config map for errors
    ```

- From the **KubeMonAgentEvents** table in your Log Analytics workspace. Data is sent every hour with error severity for configuration errors. If there are no errors, the entry in the table will have data with severity info, which reports no errors. The **Tags** property contains more information about the pod and container ID on which the error occurred and also the first occurrence, last occurrence, and count in the last hour.

After you correct the errors in the ConfigMap, save the YAML file and apply the updated ConfigMap by running the following command: `kubectl apply -f <configmap_yaml_file.yaml`.

## Apply updated ConfigMap

If you've already deployed a ConfigMap on clusters and you want to update it with a newer configuration, you can edit the ConfigMap file you've previously used. Then you can apply it by using the same command as before: `kubectl apply -f <configmap_yaml_file.yaml`.

The configuration change can take a few minutes to finish before taking effect. Then all Azure Monitor Agent pods in the cluster will restart. The restart is a rolling restart for all Azure Monitor Agent pods, so not all of them restart at the same time. When the restarts are finished, a message similar to this example includes the following result: `configmap "container-azm-ms-agentconfig" updated`.

## Verify schema version

Supported config schema versions are available as pod annotation (schema-versions) on the Azure Monitor Agent pod. You can see them with the following kubectl command: `kubectl describe pod ama-logs-fdf58 -n=kube-system`.

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
