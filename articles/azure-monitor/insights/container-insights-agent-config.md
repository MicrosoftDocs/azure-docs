---
title: Configure Azure Monitor for containers agent data collection | Microsoft Docs
description: This article describes how you can configure the Azure Monitor for containers agent to control stdout/stderr and environment variables log collection.
ms.topic: conceptual
ms.date: 01/13/2020
---

# Configure agent data collection for Azure Monitor for containers

Azure Monitor for containers collects stdout, stderr, and environmental variables from container workloads deployed to managed Kubernetes clusters from the containerized agent. You can configure agent data collection settings by creating a custom Kubernetes ConfigMaps to control this experience. 

This article demonstrates how to create ConfigMap and configure data collection based on your requirements.

>[!NOTE]
>For Azure Red Hat OpenShift, a template ConfigMap file is created in the *openshift-azure-logging* namespace. 
>

## ConfigMap file settings overview

A template ConfigMap file is provided that allows you to easily edit it with your customizations without having to create it from scratch. Before starting, you should review the Kubernetes documentation about [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) and familiarize yourself with how to create, configure, and deploy ConfigMaps. This will allow you to filter stderr and stdout per namespace or across the entire cluster, and environment variables for any container running across all pods/nodes in the cluster.

>[!IMPORTANT]
>The minimum agent version supported to collect stdout, stderr, and environmental variables from container workloads is ciprod06142019 or later. To verify your agent version, from the **Node** tab select a node, and in the properties pane note value of the **Agent Image Tag** property. For additional information about the agent versions and what's included in each release, see [agent release notes](https://github.com/microsoft/Docker-Provider/tree/ci_feature_prod).

### Data collection settings

The following are the settings that can be configured to control data collection.

|Key |Data type |Value |Description |
|----|----------|------|------------|
|`schema-version` |String (case sensitive) |v1 |This is the schema version used by the agent when parsing this ConfigMap. Currently supported schema-version is v1. Modifying this value is not supported and will be rejected when ConfigMap is evaluated.|
|`config-version` |String | | Supports ability to keep track of this config file's version in your source control system/repository. Maximum allowed characters are 10, and all other characters are truncated. |
|`[log_collection_settings.stdout] enabled =` |Boolean | true or false | This controls if stdout container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection (`log_collection_settings.stdout.exclude_namespaces` setting below), stdout logs will be collected from all containers across all pods/nodes in the cluster. If not specified in ConfigMaps, the default value is `enabled = true`. |
|`[log_collection_settings.stdout] exclude_namespaces =`|String | Comma-separated array |Array of Kubernetes namespaces for which stdout logs will not be collected. This setting is effective only if `log_collection_settings.stdout.enabled` is set to `true`. If not specified in ConfigMap, the default value is `exclude_namespaces = ["kube-system"]`.|
|`[log_collection_settings.stderr] enabled =` |Boolean | true or false |This controls if stderr container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection (`log_collection_settings.stderr.exclude_namespaces` setting), stderr logs will be collected from all containers across all pods/nodes in the cluster. If not specified in ConfigMaps, the default value is `enabled = true`. |
|`[log_collection_settings.stderr] exclude_namespaces =` |String |Comma-separated array |Array of Kubernetes namespaces for which stderr logs will not be collected. This setting is effective only if `log_collection_settings.stdout.enabled` is set to `true`. If not specified in ConfigMap, the default value is `exclude_namespaces = ["kube-system"]`. |
| `[log_collection_settings.env_var] enabled =` |Boolean | true or false | This setting controls environment variable collection across all pods/nodes in the cluster and defaults to `enabled = true` when not specified in ConfigMaps. If collection of environment variables is globally enabled, you can disable it for a specific container by setting the environment variable `AZMON_COLLECT_ENV` to **False** either with a Dockerfile setting or in the [configuration file for the Pod](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) under the **env:** section. If collection of environment variables is globally disabled, then you cannot enable collection for a specific container (that is, the only override that can be applied at the container level is to disable collection when it's already enabled globally.). |
| `[log_collection_settings.enrich_container_logs] enabled =` |Boolean | true or false | This setting controls container log enrichment to populate the Name and Image property values for every log record written to the ContainerLog table for all container logs in the cluster. It defaults to `enabled = false` when not specified in ConfigMap. |

ConfigMaps is a global list and there can be only one ConfigMap applied to the agent. You cannot have another ConfigMaps overruling the collections.

## Configure and deploy ConfigMaps

Perform the following steps to configure and deploy your ConfigMap configuration file to your cluster.

1. [Download](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/Kubernetes/container-azm-ms-agentconfig.yaml) the template ConfigMap yaml file and save it as container-azm-ms-agentconfig.yaml. 

   >[!NOTE]
   >This step is not required when working with Azure Red Hat OpenShift since the ConfigMap template already exists on the cluster.

2. Edit the ConfigMap yaml file with your customizations to collect stdout, stderr, and/or environmental variables. If you are editing the ConfigMap yaml file for Azure Red Hat OpenShift, first run the command `oc edit configmaps container-azm-ms-agentconfig -n openshift-azure-logging` to open the file in a text editor.

    - To exclude specific namespaces for stdout log collection, you configure the key/value using the following example: `[log_collection_settings.stdout] enabled = true exclude_namespaces = ["my-namespace-1", "my-namespace-2"]`.
    
    - To disable environment variable collection for a specific container, set the key/value `[log_collection_settings.env_var] enabled = true` to enable variable collection globally, and then follow the steps [here](container-insights-manage-agent.md#how-to-disable-environment-variable-collection-on-a-container) to complete configuration for the specific container.
    
    - To disable stderr log collection cluster-wide, you configure the key/value using the following example: `[log_collection_settings.stderr] enabled = false`.

3. For clusters other than Azure Red Hat OpenShift, create ConfigMap by running the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>` on clusters other than Azure Red Hat OpenShift. 
    
    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`. 

    For Azure Red Hat OpenShift, save your changes in the editor.

The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, not all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following and includes the result: `configmap "container-azm-ms-agentconfig" created`.

## Verify configuration

To verify the configuration was successfully applied to a cluster other than Azure Red Hat OpenShift, use the following command to review the logs from an agent pod: `kubectl logs omsagent-fdf58 -n=kube-system`. If there are configuration errors from the omsagent pods, the output will show errors similar to the following:

``` 
***************Start Config Processing******************** 
config::unsupported/missing config schema version - 'v21' , using defaults
```

Errors related to applying configuration changes are also available for review. The following options are available to perform additional troubleshooting of configuration changes:

- From an agent pod logs using the same `kubectl logs` command. 

    >[!NOTE]
    >This command is not applicable to Azure Red Hat OpenShift cluster.
    > 

- From Live logs. Live logs show errors similar to the following:

    ```
    config::error::Exception while parsing config map for log collection/env variable settings: \nparse error on value \"$\" ($end), using defaults, please check config map for errors
    ```

- From the **KubeMonAgentEvents** table in your Log Analytics workspace. Data is sent every hour with *Error* severity for configuration errors. If there are no errors, the entry in the table will have data with severity *Info*, which reports no errors. The **Tags** property contains more information about the pod and container ID on which the error occurred and also the first occurrence, last occurrence and count in the last hour.

- With Azure Red Hat OpenShift, check the omsagent logs by searching the **ContainerLog** table to verify if log collection of openshift-azure-logging is enabled.

After you correct the error(s) in ConfigMap on clusters other than Azure Red Hat OpenShift, save the yaml file and apply the updated ConfigMaps by running the command: `kubectl apply -f <configmap_yaml_file.yaml`. For Azure Red Hat OpenShift, edit and save the updated ConfigMaps by running the command:

``` bash
oc edit configmaps container-azm-ms-agentconfig -n openshift-azure-logging
```

## Applying updated ConfigMap

If you have already deployed a ConfigMap on clusters other than Azure Red Hat OpenShift and you want to update it with a newer configuration, you can edit the ConfigMap file you've previously used and then apply using the same command as before, `kubectl apply -f <configmap_yaml_file.yaml`. For Azure Red Hat OpenShift, edit and save the updated ConfigMaps by running the command:

``` bash
oc edit configmaps container-azm-ms-agentconfig -n openshift-azure-logging
```

The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, not all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following and includes the result: `configmap "container-azm-ms-agentconfig" updated`.

## Verifying schema version

Supported config schema versions are available as pod annotation (schema-versions) on the omsagent pod. You can see them with the following kubectl command: `kubectl describe pod omsagent-fdf58 -n=kube-system`

The output will show similar to the following with the annotation schema-versions:

```
	Name:           omsagent-fdf58
	Namespace:      kube-system
	Node:           aks-agentpool-95673144-0/10.240.0.4
	Start Time:     Mon, 10 Jun 2019 15:01:03 -0700
	Labels:         controller-revision-hash=589cc7785d
	                dsName=omsagent-ds
	                pod-template-generation=1
	Annotations:    agentVersion=1.10.0.1
	              dockerProviderVersion=5.0.0-0
	                schema-versions=v1 
```

## Next steps

- Azure Monitor for containers does not include a predefined set of alerts. Review the [Create performance alerts with Azure Monitor for containers](container-insights-alerts.md) to learn how to create recommended alerts for high CPU and memory utilization to support your DevOps or operational processes and procedures.

- With monitoring enabled to collect health and resource utilization of your AKS or hybrid cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Azure Monitor for containers.

- View [log query examples](container-insights-log-search.md#search-logs-to-analyze-data) to see pre-defined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.
