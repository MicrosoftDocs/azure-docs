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
Container insights stores log data it collects in a table called *ContainerLogV2*. This article describes the schema of this table and its comparison and migration from the legacy *ContainerLog* table.


>[!IMPORTANT]
> ContainerLogV2 will be the default schema via the ConfigMap for CLI version 2.54.0 and greater. ContainerLogV2 will be default ingestion format for customers who will be onboarding container insights with Managed Identity Auth using ARM, Bicep, Terraform, Policy and Portal onboarding. ContainerLogV2 can be explicitly enabled through CLI version 2.51.0 or higher using Data collection settings.
> 
> Support for the *ContainerLog* table will be retired on 30th September 2026.

 
## Table comparison
The following table highlights the key differences between using ContainerLogV2 and ContainerLog schema.

| Feature differences  | ContainerLog | ContainerLogV2 |
| ------------------- | ----------------- | ------------------- |
| Schema | Details at [ContainerLog](/azure/azure-monitor/reference/tables/containerlog). | Details at [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2).<br>Additional columns are:<br>- `ContainerName`<br>- `PodName`<br>- `PodNamespace`<br>- `LogLevel`<sup>1</sup><br>- `KubernetesMetadata`<sup>2</sup> |
| Onboarding | Only configurable through ConfigMap. | Configurable through both ConfigMap and DCR. <sup>3</sup>|
| Pricing | Only compatible with full-priced analytics logs. | Supports the low cost [basic logs](../logs/basic-logs-configure.md) tier in addition to analytics logs. |
| Querying | Requires multiple join operations with inventory tables for standard queries. | Includes additional pod and container metadata to reduce query complexity and join operations. |
| Multiline | Not supported, multiline entries are split into multiple rows. | Support for multiline logging to allow consolidated, single entries for multiline output. |

<sup>1</sup>If LogMessage is a valid JSON and has a key named *level*, its value will be used. Otherwise we use a regex based keyword matching approach to infer LogLevel from the LogMessage itself. Note that you might see some misclassifications as this value is inferred.

<sup>2</sup>KubernetesMetadata is optional column and collection of this field can be enabled with Kubernetes Metadata feature. Value of this field is JSON and it contains fields such as *podLabels, podAnnotations, podUid, Image, ImageTag and Image repo*.

<sup>3</sup>DCR configuration not supported for clusters using service principal authentication based clusters. To use this experience, [migrate your clusters with service principal to managed identity](./container-insights-authentication.md).

>[!NOTE]
> [Export](../logs/logs-data-export.md) to Event Hub and Storage Account is not supported if the incoming LogMessage is not a valid JSON. For best performance, we recommend emitting container logs in JSON format.


## Assess the impact on existing alerts
Before you enable the **ContainerLogsV2** schema, you should assess whether you have any alert rules that rely on the **ContainerLog** table. Any such alerts need to be updated to use the new table.

To scan for alerts that reference the **ContainerLog** table, run the following Azure Resource Graph query:

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

## Enable the ContainerLogV2 schema
You can enable the **ContainerLogV2** schema for a cluster either using the cluster's Data Collection Rule (DCR) or ConfigMap. If both settings are enabled, the ConfigMap takes precedence. Stdout and stderr logs are only ingested to the ContainerLog table when both the DCR and ConfigMap are explicitly set to off.

## Kubernetes metadata and logs filtering 
Kubernetes Metadata and Logs Filtering enhances the ContainerLogsV2 schema with more Kubernetes metadata such as *PodLabels, PodAnnotations, PodUid, Image, ImageID, ImageRepo, and ImageTag*. Additionally, the **Logs Filtering** feature provides filtering capabilities for both workload and platform (that is system namespaces) containers. With these features, users gain richer context and improved visibility into their workloads.

### Key features 
- **Enhanced ContainerLogV2 schema with Kubernetes metadata fields:** Kubernetes Logs Metadata introduces other optional metadata fields that enhance troubleshooting experience with simple Log Analytics queries and removes the need for joining with other tables. These fields include essential information such as *"PodLabels," "PodAnnotations," "PodUid," "Image," "ImageID," "ImageRepo," and "ImageTag"*. By having this context readily available, users can expediate their troubleshooting and identify the issues quickly.

- **Customized include list configuration:**  Users can tailor new metadata fields they want to see through editing the [configmap](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml). Note that all metadata fields are collected by default when the `metadata_collection` is enabled and if you want to select specific fields, uncomment `include_fields` and specify the fields that need to be collected.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/configmap-list-config.png" lightbox="./media/container-insights-logging-v2/configmap-list-config.png" alt-text="Screenshot that shows metadata fields." border="false":::

- **Enhanced ContainerLogV2 schema with log level:** Users can now assess application health based on color coded severity levels such as CRITICAL, ERROR, WARNING, INFO, DEBUG, TRACE, or UNKNOWN. It’s a crucial tool for incident response and proactive monitoring. By visually distinguishing severity levels, users can quickly pinpoint affected resources. The color-coded system streamlines the investigation process and allows users to drill down even further by selecting the panel for an explore experience for further debugging. However, it’s important to note that this functionality is only applicable when using Grafana. If you’re using Log Analytics Workspace, the LogLevel is simply another column in the ContainerLogV2 table.

- **Annotation based log filtering for workloads:** Efficient log filtering technique through Pod Annotations. Users can focus on relevant information without sifting through noise. Annotation-based filtering enables users to exclude log collection for certain pods and containers by annotating the pod, which would help reduce the log analytics cost significantly.

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

#### Enable annotation based filtering

Follow the below mentioned steps to enable annotation based filtering. Find the link *here* once the related filtering documentation is published.

1. Download the [configmap](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml) and modify the settings from false to true as seen in the below screenshot.

<!-- convertborder later -->
:::image type="content" source="./media/container-insights-logging-v2/config-annotations.png" lightbox="./media/container-insights-logging-v2/config-annotations.png" alt-text="Screenshot that shows annotations." border="false":::

2. Apply the ConfigMap. See [configure configmap](./container-insights-data-collection-configmap.md#configure-and-deploy-configmap) to learn more about deploying and configuring the ConfigMap.

3. Add the required annotations on your workload pod spec. Following table highlights different possible Pod annotations and descriptions of what they do.

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
