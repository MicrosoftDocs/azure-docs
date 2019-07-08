---
title: Configure Azure Monitor for containers agent data collection | Microsoft Docs
description: This article describes how you can configure the Azure Monitor for containers agent to control stdout/stderr and environment variables log collection.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/14/2019
ms.author: magoedte
---

# Configure agent data collection for Azure Monitor for containers

Azure Monitor for containers collects stdout, stderr, and environmental variables from container workloads deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS) from the containerized agent. This agent can also collect time series data (also referred to as metrics) from Prometheus using the containerized agent without having to setup and manage a Prometheus server and database. You can configure agent data collection settings by creating a custom Kubernetes ConfigMaps to control this experience. This article demonstrates how to create ConfigMap and configure data collection based on your requirements.

## Collecting metrics from Prometheus

Active scraping of metrics from Prometheus are performed from two perspectives:

* Cluster-wide - HTTP URL and discover targets from listed endpoints of a service, k8s services such as kube-dns and kube-state-metrics, and pod annotations specific to an application. Metrics collected in this context will be defined in the ConfigMap section *Prometheus data_collection_settings.cluster*.
* Node-wide - HTTP URL and discover targets from listed endpoints of a service. Metrics collected in this context will be defined in the ConfigMap section  *Prometheus_data_collection_settings.node*.

|Scope | Description |
|------|-------------|
| Cluster-wide | Specify any one of the following three to scrape endpoints for that metric. |
| |HTTP endpoint (Either IP address or valid URL path specified). For example: $NODE_IP/metrics. ($NODE_IP is a specific Azure Monitor for containers parameter and can be used as instead of node IP address).<br> K8s service, such as kube-dns and kube-state-metrics. For example: `http://my-service-dns.my-namespace:9100/metrics` or ` https://metrics-server.kube-system.svc.cluster.local/metrics`.<br> Pod annotations (applications specifically).<br> `Promethues.io/scrap = true` needs to be added to pod annotation for it to start scraping the IP address.<br> When `monitor_kubernetes_pods = true` in the cluster-wide settings, Azure Monitor for containers agent will scrape Kubernetes pods across the entire cluster for the following prometheus annotations:<br> `# - prometheus.io/scrape`: Enable scraping for this pod.<br> `# - prometheus.io/scheme`: If the metrics endpoint is secured then you will need to set this to `https` (default is `http`).<br> `# - prometheus.io/path`: If the metrics path is not `/metrics`, define it with this annotation.<br>  `# - prometheus.io/port`: If port is not `9102` define it with this annotation. |
||
| Node-wide | HTTP endpoint scraping method only.<br> For example: $NODE_IP/metrics .| 

## Configure your cluster with custom data collection settings

A template ConfigMap file is provided that allows you to easily edit it with your customizations without having to create it from scratch. Before starting, you should review the Kubernetes documentation about [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) and familiarize yourself with how to create, configure, and deploy ConfigMaps. This will allow you to filter stderr and stdout per namespace or across the entire cluster, and environment variables for any container running across all pods/nodes in the cluster.

>[!IMPORTANT]
>The minimum agent version supported by this feature is microsoft/oms:ciprod06142019 or later. 

### Overview of configurable data collection settings

The following are the settings that can be configured to control data collection.

|Key |Data type |Value |Description |
|----|----------|------|------------|
|`schema-version` |String (case sensitive) |v1 |This is the schema version used by the agent when parsing this ConfigMap. Currently supported schema-version is v1. Modifying this value is not supported and will be rejected when ConfigMap is evaluated.|
|`config-version` |String | | Supports ability to keep track of this config file's version in your source control system/repository. Maximum allowed characters are 10, and all other characters are truncated. |
|`[log_collection_settings.stdout] enabled =` |Boolean | true or false | This controls if stdout container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection (`log_collection_settings.stdout.exclude_namespaces` setting below), stdout logs will be collected from all containers across all pods/nodes in the cluster. If not specified in ConfigMaps, the default value is `enabled = true`. |
|`[log_collection_settings.stdout] exclude_namespaces =`|String | Comma-separated array |Array of Kubernetes namespaces for which stdout logs will not be collected. This setting is effective only if `log_collection_settings.stdout.enabled` is set to `true`. If not specified in ConfigMap, the default value is `exclude_namespaces = ["kube-system"]`.|
|`[log_collection_settings.stderr] enabled =` |Boolean | true or false |This controls if stderr container log collection is enabled. When set to `true` and no namespaces are excluded for stdout log collection (`log_collection_settings.stderr.exclude_namespaces` setting), stderr logs will be collected from all containers across all pods/nodes in the cluster. If not specified in ConfigMaps, the default value is `enabled = true`. |
|`[log_collection_settings.stderr] exclude_namespaces =` |String |Comma-separated array |Array of Kubernetes namespaces for which stderr logs will not be collected. This setting is effective only if `log_collection_settings.stdout.enabled` is set to `true`. If not specified in ConfigMap, the default value is `exclude_namespaces = ["kube-system"]`. |
| `[log_collection_settings.env_var] enabled =` |Boolean | true or false | This controls if environment variable collection is enabled. When set to `false`, no environment variables are collected for any container running across all pods/nodes in the cluster. If not specified in ConfigMap, the default value is `enabled = true`. |

### Configure and deploy ConfigMaps

Perform the following steps to configure and deploy your ConfigMap configuration file to your cluster.

1. [Download](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/Kubernetes/container-azm-ms-agentconfig.yaml) the template ConfigMap yaml file and save it as container-azm-ms-agentconfig.yaml.  
1. Edit the ConfigMap yaml file with your customizations. 

    - To exclude specific namespaces for stdout log collection, you configure the key/value using the following example: `[log_collection_settings.stdout] enabled = true exclude_namespaces = ["my-namespace-1", "my-namespace-2"]`.
    - To disable environment variable collection for a specific container, set the key/value `[log_collection_settings.env_var] enabled = true` to enable variable collection globally, and then follow the steps [here](container-insights-manage-agent.md#how-to-disable-environment-variable-collection-on-a-container) to complete configuration for the specific container.
    - To disable stderr log collection cluster-wide, you configure the key/value using the following example: `[log_collection_settings.stderr] enabled = false`.

1. Create ConfigMap by running the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.
    
    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`. 
    
    The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, not all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following and includes the result: `configmap "container-azm-ms-agentconfig" created`.

To verify the configuration was successfully applied, use the following command to review the logs from an agent pod: `kubectl logs omsagent-fdf58 -n=kube-system`. If there are configuration errors from the osmagent pods, the output will show errors similar to the following:

``` 
***************Start Config Processing******************** 
config::unsupported/missing config schema version - 'v21' , using defaults
```

Errors prevent omsagent from parsing the file, causing it to restart and use the default configuration. After you correct the error(s) in ConfigMap, save the yaml file and apply the updated ConfigMaps by running the command: `kubectl apply -f <configmap_yaml_file.yaml`.

## Applying updated ConfigMap

If you have already deployed a ConfigMap for your cluster and you want to update it with a newer configuration, you can simply edit the ConfigMap file you've previously used and then apply using the same command as before, `kubectl apply -f <configmap_yaml_file.yaml`.

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

- To continue learning how to use Azure Monitor and monitor other aspects of your AKS cluster, see [View Azure Kubernetes Service health](container-insights-analyze.md).
- View [log query examples](container-insights-log-search.md#search-logs-to-analyze-data) to see pre-defined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.