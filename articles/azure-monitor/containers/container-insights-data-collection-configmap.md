---
title: Configure Container insights data collection using ConfigMap
description: Describes how you can configure other data collection for Container insights using ConfigMap.
ms.topic: conceptual
ms.date: 12/19/2023
ms.reviewer: aul
---

# Configure data collection in Container insights using ConfigMap

This article describes how to configure data collection in Container insights using ConfigMap. [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) are a Kubernetes mechanism that allow you to store non-confidential data such as configuration file or environment variables. 

The ConfigMap is primarily used to configure data collection of the container logs and environment variables of the cluster. You can individually configure the stdout and stderr logs and also enable multiline logging.
l
Specific configuration you can perform with the ConfigMap includes:

- Enable/disable and namespace filtering for stdout and stderr logs
- Enable/disable collection of environment variables for the cluster
- Filter for Normal Kube events
- Select log schema
- Enable/disable multiline logging
- Ignore proxy settings  

> [!IMPORTANT]
> Complete configuration of data collection in Container insights may require editing of both the ConfigMap and the data collection rule (DCR) for the cluster since each method allows configuration of a different set of settings. 
> 
> See [Configure data collection in Container insights using data collection rule](./container-insights-data-collection-dcr.md) for a list of settings and the process to configure data collection using the DCR.

## Prerequisites 
- ConfigMap is a global list and there can be only one ConfigMap applied to the agent for Container insights. Applying another ConfigMap will overrule the previous ConfigMap collection settings.
- The minimum agent version supported to collect stdout, stderr, and environmental variables from container workloads is **ciprod06142019** or later. To verify your agent version, on the **Node** tab, select a node. On the **Properties** pane, note the value of the **Agent Image Tag** property. For more information about the agent versions and what's included in each release, see [Agent release notes](https://github.com/microsoft/Docker-Provider/tree/ci_feature_prod).

## Configure and deploy ConfigMap

Use the following procedure to configure and deploy your ConfigMap configuration file to your cluster:

1. Download the [template ConfigMap YAML file](https://aka.ms/container-azm-ms-agentconfig) and open it in an editor. If you already have a ConfigMap file, then you can use that one.
1. Edit the ConfigMap YAML file with your customizations using the settings described in [Data collection settings](#data-collection-settings)
1. Create a ConfigMap by running the following kubectl command: 

    ```azurecli
    kubectl apply -f <configmap_yaml_file.yaml>
    ```
    
    Example: 
    
    ```output
    kubectl apply -f container-azm-ms-agentconfig.yaml
    ```


    The configuration change can take a few minutes to finish before taking effect. Then all Azure Monitor Agent pods in the cluster will restart. The restart is a rolling restart for all Azure Monitor Agent pods, so not all of them restart at the same time. When the restarts are finished, you'll receive a message similar to the following result: 
    
    ```output
    configmap "container-azm-ms-agentconfig" created`.
    ``````


### Data collection settings

The following table describes the settings you can configure to control data collection.


| Setting | Data type | Value | Description |
|:---|:---|:---|:---|
| `schema-version` | String (case sensitive) | v1 | Used by the agent when parsing this ConfigMap. Currently supported schema-version is v1. Modifying this value isn't supported and will be rejected when the ConfigMap is evaluated. |
| `config-version` | String |  | Allows you to keep track of this config file's version in your source control system/repository. Maximum allowed characters are 10, and all other characters are truncated. |
| **[log_collection_settings]** | | | |
| `[stdout] enabled` | Boolean | true<br>false | Controls whether stdout container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection, stdout logs will be collected from all containers across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. |
| `[stdout] exclude_namespaces` | String | Comma-separated array | Array of Kubernetes namespaces for which stdout logs won't be collected. This setting is effective only if `enabled` is set to `true`. If not specified in the ConfigMap, the default value is<br> `["kube-system","gatekeeper-system"]`. |
| `[stderr] enabled` | Boolean | true<br>false | Controls whether stderr container log collection is enabled. When set to `true` and no namespaces are excluded for stderr log collection, stderr logs will be collected from all containers across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. |
| `[stderr] exclude_namespaces` | String | Comma-separated array | Array of Kubernetes namespaces for which stderr logs won't be collected. This setting is effective only if `enabled` is set to `true`. If not specified in the ConfigMap, the default value is<br> `["kube-system","gatekeeper-system"]`. |
| `[env_var] enabled` | Boolean | true<br>false | This setting controls environment variable collection across all pods and nodes in the cluster. If not specified in the ConfigMap, the default value is `true`. If collection of environment variables is globally enabled, you can disable it for a specific container by setting the environment variable `AZMON_COLLECT_ENV` to `False` either with a Dockerfile setting or in the [configuration file for the Pod](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) under the `env:` section. If collection of environment variables is globally disabled, you can't enable collection for a specific container. The only override that can be applied at the container level is to disable collection when it's already enabled globally. |
| `[enrich_container_logs] enabled` | Boolean | true<br>false | Controls container log enrichment to populate the `Name` and `Image` property values for every log record written to the **ContainerLog** table for all container logs in the cluster. If not specified in the ConfigMap, the default value is `false`. |
| `[collect_all_kube_events] enabled` | Boolean | true<br>false| Controls whether Kube events of all types are collected. By default, the Kube events with type **Normal** aren't collected. When this setting is `true`, the **Normal** events are no longer filtered, and all events are collected. If not specified in the ConfigMap, the default value is `false`. |
| `[schema] containerlog_schema_version` | String (case sensitive) | v2<br>v1 | Sets the log ingestion format. If `v2`, the **ContainerLogV2** table is used. If `v1`, the **ContainerLog** table is used (this table has been deprecated). For clusters enabling container insights using Azure CLI version 2.54.0 or greater, the default setting is `v2`. See [Container insights log schema](./container-insights-logs-schema.md) for details. |
| `[enable_multiline_logs] enabled` | Boolean | true<br>false | Controls whether multiline container logs are enabled. See [Multi-line logging in Container Insights](./container-insights-logs-schema.md#multi-line-logging-in-container-insights) for details. If not specified in the ConfigMap, the default value is `false`. This requires the `schema` setting to be `v2`. |
| **[metric_collection_settings]** | | | |
| `[collect_kube_system_pv_metrics] enabled` | Boolean | true<br>false | Allows persistent volume (PV) usage metrics to be collected in the kube-system namespace. By default, usage metrics for persistent volumes with persistent volume claims in the kube-system namespace aren't collected. When this setting is set to `true`, PV usage metrics for all namespaces are collected. If not specified in the ConfigMap, the default value is `false`. |
| **[agent_settings]** | | | |
| `[proxy_config] ignore_proxy_settings` | Boolean | true<br>false | When `true`, proxy settings are ignored. For both AKS and Arc-enabled Kubernetes environments, if your cluster is configured with forward proxy, then proxy settings are automatically applied and used for the agent. For certain configurations, such as with AMPLS + Proxy, you might want the proxy configuration to be ignored. If not specified in the ConfigMap, the default value is `false`. |



## Verify configuration

To verify the configuration was successfully applied to a cluster, use the following command to review the logs from an agent pod.

```azurecli
kubectl logs ama-logs-fdf58 -n kube-system
```

If there are configuration errors from the Azure Monitor Agent pods, the output will show errors similar to the following example:

```output
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
kubectl describe pod ama-logs-fdf58 -n=kube-system.
```

Output similar to the following example appears with the annotation schema-versions:

```output
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

### How do I enable log collection for containers in the kube-system namespace through Helm?

The log collection from containers in the kube-system namespace is disabled by default. You can enable log collection by setting an environment variable on Azure Monitor Agent. See the [Container insights GitHub page](https://aka.ms/azuremonitor-containers-helm-chart).

## Next steps

- See [Configure data collection in Container insights using data collection rule](container-insights-data-collection-dcr.md) to configure data collection using DCR instead of ConfigMap.

