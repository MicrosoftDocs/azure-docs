---
title: Configure ContainerLogv2 schema (preview) for Container Insights
description: Switch your ContainerLog table to the ContainerLogv2 schema
author: aul
ms.author: bwren
ms.reviewer: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 05/11/2022

---

# Enable ContainerLogV2 schema (preview)
Azure Monitor Container Insights is now in Public Preview of new schema for container logs called ContainerLogV2. As part of this schema, there new fields to make common queries to view AKS (Azure Kubernetes Service) and Azure Arc enabled Kubernetes data. In addition, this schema is compatible as a part of [Basic Logs](../logs/basic-logs-configure.md), which offer a low cost alternative to standard analytics logs.

> [!NOTE]
> The ContainerLogv2 schema is currently a preview feature.

>[!NOTE]
>The new fields are:
>* ContainerName
>* PodName
>* PodNamespace

## ContainerLogV2 schema
```kusto
 Computer: string,
 ContainerId: string,
 ContainerName: string,
 PodName: string,
 PodNamespace: string,
 LogMessage: dynamic,
 LogSource: string,
 TimeGenerated: datetime
```
## Enable ContainerLogV2 schema
1. Customers can enable ContainerLogV2 schema at cluster level. 
2. To enable ContainerLogV2 schema, configure the cluster's configmap, Learn more about [configmap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) in Kubernetes documentation & [Azure Monitor configmap](./container-insights-agent-config.md#configmap-file-settings-overview).
3. Follow the instructions accordingly when configuring an existing ConfigMap or using a new one.

### Configuring an existing ConfigMap
* When configuring an existing ConfigMap, we have to append the following section in your existing ConfigMap yaml file:
```yml
[log_collection_settings.schema]
          # In the absense of this configmap, default value for containerlog_schema_version is "v1"
          # Supported values for this setting are "v1","v2"
          # See documentation for benefits of v2 schema over v1 schema before opting for "v2" schema
          containerlog_schema_version = "v2"
```
### Configuring a new ConfigMap
* Download the new ConfigMap from [here](https://aka.ms/container-azm-ms-agentconfig).
* For new downloaded configmapdefault the value for containerlog_schema_version is "v1"
* Update the "containerlog_schema_version = "v2""

```yml
[log_collection_settings.schema]
# In the absense of this configmap, default value for containerlog_schema_version is "v1"
# Supported values for this setting are "v1","v2"
# See documentation for benefits of v2 schema over v1 schema before opting for "v2" schema
containerlog_schema_version = "v2"
```
* Once you have finished configuring the configmap Run the following kubectl command: kubectl apply -f `<configname>`
>[!TIP]
>Example: kubectl apply -f container-azm-ms-agentconfig.yaml.

>[!NOTE]
>* The configuration change can take a few minutes to complete before taking effect, all omsagent pods in the cluster will restart. 
>* The restart is a rolling restart for all omsagent pods, it will not restart all of them at the same time.

## Next steps
* Configure [Basic Logs](../logs/basic-logs-configure.md) for ContainerLogv2
