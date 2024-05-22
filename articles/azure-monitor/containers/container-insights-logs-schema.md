---
title: Configure the ContainerLogV2 schema for Container Insights
description: Switch your ContainerLog table to the ContainerLogV2 schema.
author: aul
ms.author: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 08/28/2023
ms.reviewer: aul
---

# Container insights log schema
Container insights stores log data it collects in a table called *ContainerLogV2* in an Azure Monitor workspace. This article describes the schema of this table and configuration options for it. It also compares this table to the legacy *ContainerLog* table and provides detail for migrating from it.


## Table comparison

ContainerLogV2 is the default schema for CLI version 2.54.0 and greater. ContainerLogV2 is the default table for customers who will be onboarding Container insights with managed identity authentication. ContainerLogV2 can be explicitly enabled through CLI version 2.51.0 or higher using data collection settings.

>[!IMPORTANT]
> Support for the *ContainerLog* table will be retired on 30th September 2026.

The following table highlights the key differences between using ContainerLogV2 and ContainerLog schema.

| Feature differences  | ContainerLog | ContainerLogV2 |
| ------------------- | ----------------- | ------------------- |
| Schema | Details at [ContainerLog](/azure/azure-monitor/reference/tables/containerlog). | Details at [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2).<br>Additional columns are:<br>- `ContainerName`<br>- `PodName`<br>- `PodNamespace`<br>- `LogLevel`<sup>1</sup><br>- `KubernetesMetadata`<sup>2</sup> |
| Onboarding | Only configurable through ConfigMap. | Configurable through both ConfigMap and DCR. <sup>3</sup>|
| Pricing | Only compatible with full-priced analytics logs. | Supports the low cost [basic logs](../logs/basic-logs-configure.md) tier in addition to analytics logs. |
| Querying | Requires multiple join operations with inventory tables for standard queries. | Includes additional pod and container metadata to reduce query complexity and join operations. |
| Multiline | Not supported, multiline entries are split into multiple rows. | Support for multiline logging to allow consolidated, single entries for multiline output. |

<sup>1</sup> If `LogMessage` is valid JSON and has a key named `level`, its value will be used. Otherwise, regex based keyword matching is used to infer `LogLevel` from `LogMessage`. This inference may results in some misclassifications.

<sup>2</sup> `KubernetesMetadata` is an optional column that is enabled with [Kubernetes metadata](). The value of this field is JSON with the fields `podLabels`, `podAnnotations`, `podUid`, `Image`, `ImageTag`, and `Image repo`.

<sup>3</sup> DCR configuration requires [managed identity authentication](./container-insights-authentication.md).

>[!NOTE]
> [Export](../logs/logs-data-export.md) to Event Hub and Storage Account is not supported if the incoming `LogMessage` is not valid JSON. For best performance, emit container logs in JSON format.

## Enable the ContainerLogV2 schema
Enable the **ContainerLogV2** schema for a cluster either using the cluster's [Data Collection Rule (DCR)](./container-insights-data-collection-filter.md#configure-using-data-collection-rule-dcr) or [ConfigMap](./container-insights-data-collection-filter.md#configure-using-configmap). If both settings are enabled, the ConfigMap takes precedence. The `ContainerLog` table is used only when both the DCR and ConfigMap are explicitly set to off.

Before you enable the **ContainerLogsV2** schema, you should assess whether you have any alert rules that rely on the **ContainerLog** table. Any such alerts need to be updated to use the new table. Run the following Azure Resource Graph query to scan for alert rules that reference the `ContainerLog` table.

```Kusto
resources
| where type in~ ('microsoft.insights/scheduledqueryrules') and ['kind'] !in~ ('LogToMetric')
| extend severity = strcat("Sev", properties["severity"])
| extend enabled = tobool(properties["enabled"])
| where enabled in~ ('true')
| where tolower(properties["targetResourceTypes"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["targetResourceType"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["scopes"]) matches regex 'providers/microsoft.operationalinsights/workspaces($|/.*)?'
| where properties contains "ContainerLog"
| project id,name,type,properties,enabled,severity,subscriptionId
| order by tolower(name) asc
```


## Kubernetes metadata
When Kubernetes Logs Metadata is enabled, it adds a column to `ContainerLogV2` called `KubernetesMetadata` that enhances troubleshooting with simple Log Analytics queries and removes the need for joining with other tables. 
The field in this column include: `PodLabels`, `PodAnnotations`, `PodUid`, `Image`, `ImageID`, `ImageRepo`, `ImageTag`.

Enable Kubernetes metadata using [ConfigMap](./container-insights-data-collection-filter.md#configure-using-configmap) with the following settings. All metadata fields are collected by default when the `metadata_collection` is enabled. Uncomment `include_fields` to specify individual fields to be collected.

    ```yaml
    [log_collection_settings.metadata_collection]
      # kube_meta_cache_ttl_secs is a configurable option for K8s cached metadata. Default is 60s. You may adjust it in below section [agent_settings.k8s_metadata_config]. Reference link: https://docs.fluentbit.io/manual/pipeline/filters/kubernetes#configuration-parameters
      # if enabled will collect kubernetes metadata for ContainerLogv2 schema. Default is false.
      enabled = true
      # if include_fields commented out or empty, all fields will be included. If include_fields is set, only the fields listed will be included.
      include_fields = ["podLabels","podAnnotations","podUid","image","imageID","imageRepo","imageTag"]
    ```
    

## Annotation based filtering for workloads
Annotation-based filtering enables you to exclude log collection for certain pods and containers by annotating the pod. This can reduce your logs ingestion cost significantly and allow you to focus on relevant information without sifting through noise. 

Enable annotation based filtering using [ConfigMap](./container-insights-data-collection-filter.md#configure-using-configmap) with the following settings. 

```yml
[log_collection_settings.filter_using_annotations]
  # if enabled will exclude logs from pods with annotations fluenbit.io/exclude: "true".
  # Read more: https://docs.fluentbit.io/manual/pipeline/filters/kubernetes#kubernetes-annotations
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

Here is an example of `fluentbit.io/exclude: "true"` annotation in Pod spec:

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





## Kubernetes metadata and logs filtering

- **Enhanced ContainerLogV2 schema with log level:** Users can now assess application health based on color coded severity levels such as CRITICAL, ERROR, WARNING, INFO, DEBUG, TRACE, or UNKNOWN. It’s a crucial tool for incident response and proactive monitoring. By visually distinguishing severity levels, users can quickly pinpoint affected resources. The color-coded system streamlines the investigation process and allows users to drill down even further by selecting the panel for an explore experience for further debugging. However, it’s important to note that this functionality is only applicable when using Grafana. If you’re using Log Analytics Workspace, the LogLevel is simply another column in the ContainerLogV2 table.


- **ConfigMap based log filtering for platform logs (System Kubernetes Namespaces):** Platform logs are emitted by containers in the system (or similar restricted) namespaces. By default, all the container logs from the system namespace are excluded to minimize the Log Analytics cost. However, in specific troubleshooting scenarios, container logs of system container play a crucial role. For instance, consider the coredns container within the kube-system namespace. To collect logs (stdout and stderr) exclusively from the coredns container form kube-system, you can enable the following settings in the [configmap](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml).

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/configmap-filtering.png" lightbox="./media/container-insights-logging-v2/configmap-filtering.png" alt-text="Screenshot that shows filtering fields." border="false":::

- **Grafana dashboard for visualization:** The Grafana dashboard not only displays color-coded visualizations of log levels ranging from CRITICAL to UNKNOWN, but also dives into Log Volume, Log Rate, Log Records, Logs. Users can get Time-Sensitive Analysis, dynamic insights into log level trends over time, and crucial real-time monitoring. We also provide a Detailed breakdown by Computer, Pod, and Container, which empowers in-depth analysis and pinpointed troubleshooting.​ And finally in the new Logs table experience, users can view in depth details with expand view, and view the data in each column and zoom into the information they want to see.

Here's a video showcasing the Grafana Dashboard:

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=15c1c297-9e96-47bf-a31e-76056d026bd1]

### How to enable Kubernetes metadata and logs filtering

#### Prerequisites

1. Migrate to Managed Identity Authentication. [Learn More](./container-insights-authentication.md#migrate-to-managed-identity-authentication).

2. Ensure that the ContainerLogV2 is enabled. Managed Identity Auth clusters have this schema enabled by default. If not, [enable the ContainerLogV2 schema](./container-insights-logs-schema.md#enable-the-containerlogv2-schema).

#### Limitations

The [ContainerLogV2 Grafana Dashboard](https://grafana.com/grafana/dashboards/20995-azure-monitor-container-insights-containerlogv2/) is not supported with the Basic Logs SKU on the ContainerLogV2 table.

#### Enable Kubernetes metadata

1. Download the [configmap](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml) and modify the settings from **false** to **true** as seen in the below screenshot. Note that all the supported metadata fields are collected by default. If you wish to collect specific fields, specify the required fields in `include_fields`.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/configmap-enable-metadata.png" lightbox="./media/container-insights-logging-v2/configmap-enable-metadata.png" alt-text="Screenshot that shows enabling metadata fields." border="false":::

2. Apply the ConfigMap. See [configure configmap](./container-insights-data-collection-configmap.md#configure-and-deploy-configmap) to learn more about deploying and configuring the ConfigMap.

3. After a few minutes, data should be flowing into your ContainerLogV2 table with Kubernetes Logs Metadata, as shown in the below screenshot.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/container-log-v2.png" lightbox="./media/container-insights-logging-v2/container-log-v2.png" alt-text="Screenshot that shows containerlogv2." border="false":::

#### Onboard to the Grafana dashboard experience

1. Under the Insights tab, select monitor settings and onboard to Grafana Dashboard with version 10.3.4+

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/configure-ci.png" lightbox="./media/container-insights-logging-v2/configure-ci.png" alt-text="Screenshot that shows grafana onboarding." border="false":::

2. Ensure that you have one of the Grafana Admin/Editor/Reader roles by checking Access control (IAM). If not, add them.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/grafana-1.png" lightbox="./media/container-insights-logging-v2/grafana-1.png" alt-text="Screenshot that shows grafana roles." border="false":::

3. Ensure your Grafana instance has access to the Azure Logs Analytics(LA) workspace. If it doesn’t have access, you need to grant Grafana Instance Monitoring Reader role access to your LA workspace.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/grafana-2.png" lightbox="./media/container-insights-logging-v2/grafana-2.png" alt-text="Screenshot that shows grafana." border="false":::

4. Navigate to your Grafana workspace and import the [ContainerLogV2 Dashboard](https://grafana.com/grafana/dashboards/20995-azure-monitor-container-insights-containerlogv2/) from Grafana gallery.

5. Select your information for DataSource, Subscription, ResourceGroup, Cluster, Namespace, and Labels. The dashboard then populates as depicted in the below screenshot.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/grafana-3.png" lightbox="./media/container-insights-logging-v2/grafana-3.png" alt-text="Screenshot that shows grafana dashboard." border="false":::

>[!NOTE]
> When you initially load the Grafana Dashboard, it could throw some errors due to variables not yet being selected. To prevent this from recurring, save the dashboard after selecting a set of variables so that it becomes default on the first open.


```
#### ConfigMap based log filtering for platform logs (System Kubernetes Namespaces)

1. Download the [configmap](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml) and modify the settings related to `collect_system_pod_logs` and `exclude_namespaces`.

For example, in order to collect stdout & stderr logs of coredns container in the kube-system namespace, make sure that kube-system namespace is not in `exclude_namespaces` and this feature is restricted only to the following system namespaces:  kube-system, gatekeeper-system, calico-system, azure-arc, kube-public and kube-node-lease namespaces.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/configmap-filtering.png" lightbox="./media/container-insights-logging-v2/configmap-filtering.png" alt-text="Screenshot that shows filtering fields." border="false":::



2. Apply the ConfigMap. See [configure configmap](./container-insights-data-collection-configmap.md#configure-and-deploy-configmap) to learn more about deploying and configuring the ConfigMap.


## Multi-line logging in Container Insights
With multiline logging enabled, previously split container logs are stitched together and sent as single entries to the ContainerLogV2 table. If the stitched log line is larger than 64 KB, it will be truncated due to Log Analytics workspace limits. This feature also has support for .NET, Go, Python and Java stack traces, which appear as single entries in the ContainerLogV2 table. Enable multiline logging with ConfigMap as described in [Configure data collection in Container insights using ConfigMap](container-insights-data-collection-configmap.md).

>[!NOTE]
> The configmap now features a language specification option, wherein the customers can select only the languages that they are interested in. This feature can be enabled by editing the languages in the stacktrace_languages option in the [configmap](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml).

The following screenshots show multi-line logging for Go exception stack trace:

**Multi-line logging disabled**

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/multi-line-disabled-go.png" lightbox="./media/container-insights-logging-v2/multi-line-disabled-go.png" alt-text="Screenshot that shows Multi-line logging disabled." border="false":::

**Multi-line logging enabled**

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/multi-line-enabled-go.png" lightbox="./media/container-insights-logging-v2/multi-line-enabled-go.png" alt-text="Screenshot that shows Multi-line enabled." border="false":::

**Java stack trace**

:::image type="content" source="./media/container-insights-logging-v2/multi-line-enabled-java.png" lightbox="./media/container-insights-logging-v2/multi-line-enabled-java.png" alt-text="Screenshot that shows Multi-line enabled for Java.":::

**Python stack trace**

:::image type="content" source="./media/container-insights-logging-v2/multi-line-enabled-python.png" lightbox="./media/container-insights-logging-v2/multi-line-enabled-python.png" alt-text="Screenshot that shows Multi-line enabled for Python.":::


## Next steps
* Configure [Basic Logs](../logs/basic-logs-configure.md) for ContainerLogv2.
* Learn how [query data](./container-insights-log-query.md#container-logs) from ContainerLogV2
