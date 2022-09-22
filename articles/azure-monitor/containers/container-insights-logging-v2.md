---
title: Configure the ContainerLogV2 schema (preview) for Container Insights
description: Switch your ContainerLog table to the ContainerLogV2 schema.
author: aul
ms.author: bwren
ms.subservice: logs
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 05/11/2022
ms.reviewer: aul
---

# Enable the ContainerLogV2 schema (preview)
Azure Monitor Container insights is now in public preview of a new schema for container logs, called ContainerLogV2. As part of this schema, there are new fields to make common queries to view Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes data. In addition, this schema is compatible with [Basic Logs](../logs/basic-logs-configure.md), which offers a low-cost alternative to standard analytics logs.

The ContainerLogV2 schema is a preview feature. Container insights does not yet support the **View in Analytics** option, but the data is available when it's queried directly from the [Log Analytics](./container-insights-log-query.md) interface.

The new fields are:
* `ContainerName`
* `PodName`
* `PodNamespace`

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
## Enable the ContainerLogV2 schema
Customers can enable the ContainerLogV2 schema at the cluster level. To enable the ContainerLogV2 schema, configure the cluster's ConfigMap. Learn more about ConfigMap in [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)  and in [Azure Monitor documentation](./container-insights-agent-config.md#configmap-file-settings-overview).
Follow the instructions to configure an existing ConfigMap or to use a new one.

### Configure an existing ConfigMap
If your ConfigMap doesn't yet have the `log_collection_settings.schema` field, you'll need to append the following section in your existing ConfigMap .yaml file:

```yaml
[log_collection_settings.schema]
          # In the absence of this ConfigMap, the default value for containerlog_schema_version is "v1"
          # Supported values for this setting are "v1","v2"
          # See documentation at https://aka.ms/ContainerLogv2 for benefits of v2 schema over v1 schema before opting for "v2" schema
          containerlog_schema_version = "v2"
```

### Configure a new ConfigMap
1. [Download the new ConfigMap](https://aka.ms/container-azm-ms-agentconfig). For the newly downloaded ConfigMap, the default value for `containerlog_schema_version` is `"v1"`.
1. Update `containerlog_schema_version` to `"v2"`:

    ```yaml
    [log_collection_settings.schema]
        # In the absence of this ConfigMap, the default value for containerlog_schema_version is "v1"
        # Supported values for this setting are "v1","v2"
        # See documentation at https://aka.ms/ContainerLogv2 for benefits of v2 schema over v1 schema before opting for "v2" schema
        containerlog_schema_version = "v2"
    ```

3. After you finish configuring the ConfigMap, run the following kubectl command: `kubectl apply -f <configname>`.

   Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`

>[!NOTE]
>* The configuration change can take a few minutes to complete before it takes effect. All OMS agent pods in the cluster will restart. 
>* The restart is a rolling restart for all OMS agent pods. It won't restart all of them at the same time.

## Next steps
* Configure [Basic Logs](../logs/basic-logs-configure.md) for ContainerLogv2.
