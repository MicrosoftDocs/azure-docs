---
title: Customize scraping of Prometheus metrics in Azure Monitor (preview)
description: Customize metrics scraping for a Kubernetes cluster with the metrics add-on in Azure Monitor.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Customize scraping of Prometheus metrics in Azure Monitor (preview)

This article provides instructions on customizing metrics scraping for a Kubernetes cluster with the [metrics add-on](prometheus-metrics-enable.md) in Azure Monitor.

## Configmaps

Three different configmaps can be configured to change the default settings of the metrics add-on:

- `ama-metrics-settings-configmap`
- `ama-metrics-prometheus-config`
- `ama-metrics-prometheus-config-node`

## Metrics add-on settings configmap

The [ama-metrics-settings-configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) can be downloaded, edited, and applied to the cluster to customize the out-of-the-box features of the metrics add-on.

### Enable and disable default targets
The following table has a list of all the default targets that the Azure Monitor metrics add-on can scrape by default and whether it's initially enabled. Default targets are scraped every 30 seconds.

| Key | Type | Enabled | Description |
|-----|------|----------|-------------|
| kubelet | bool | `true` | Scrape kubelet in every node in the K8s cluster without any extra scrape config. |
| cadvisor | bool | `true` | Scrape cadvisor in every node in the K8s cluster without any extra scrape config.<br>Linux only. |
| kubestate | bool | `true` | Scrape kube-state-metrics in the K8s cluster (installed as a part of the add-on) without any extra scrape config. |
| nodeexporter | bool | `true` | Scrape node metrics without any extra scrape config.<br>Linux only. |
| coredns | bool | `false` | Scrape coredns service in the K8s cluster without any extra scrape config. |
| kubeproxy | bool | `false` | Scrape kube-proxy in every Linux node discovered in the K8s cluster without any extra scrape config.<br>Linux only. |
| apiserver | bool | `false` | Scrape the Kubernetes API server in the K8s cluster without any extra scrape config. |
| windowsexporter | bool | `false` | Scrape windows-exporter in every node in the K8s cluster without any extra scrape config.<br>Windows only. |
| windowskubeproxy | bool | `false` | Scrape windows-kube-proxy in every node in the K8s cluster without any extra scrape config.<br>Windows only. |
| prometheuscollectorhealth | bool | `false` | Scrape information about the prometheus-collector container, such as the amount and size of time series scraped. |

If you want to turn on the scraping of the default targets that aren't enabled by default, edit the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap` to update the targets listed under `default-scrape-settings-enabled` to `true`. Apply the configmap to your cluster.

### Customize metrics collected by default targets
By default, for all the default targets, only minimal metrics used in the default recording rules, alerts, and Grafana dashboards are ingested as described in [minimal-ingestion-profile](prometheus-metrics-scrape-configuration-minimal.md). To collect all metrics from default targets, in the configmap under `default-targets-metrics-keep-list`, set `minimalingestionprofile` to `false`.

To filter in more metrics for any default targets, edit the settings under `default-targets-metrics-keep-list` for the corresponding job you want to change.

For example, `kubelet` is the metric filtering setting for the default target kubelet. Use the following script to filter *in* metrics collected for the default targets by using regex-based filtering.

```
kubelet = "metricX|metricY"
apiserver = "mymetric.*"
```

> [!NOTE]
> If you use quotation marks or backslashes in the regex, you need to escape them by using a backslash like the examples `"test\'smetric\"s\""` and `testbackslash\\*`.

To further customize the default jobs to change properties like collection frequency or labels, disable the corresponding default target by setting the configmap value for the target to `false`. Then apply the job by using a custom configmap. For details on custom configuration, see [Customize scraping of Prometheus metrics in Azure Monitor](prometheus-metrics-scrape-configuration.md#configure-custom-prometheus-scrape-jobs).

### Cluster alias
The cluster label appended to every time series scraped uses the last part of the full AKS cluster's Azure Resource Manager resource ID. For example, if the resource ID is `/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/rg-name/providers/Microsoft.ContainerService/managedClusters/clustername`, the cluster label is `clustername`.

To override the cluster label in the time series scraped, update the setting `cluster_alias` to any string under `prometheus-collector-settings` in the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap`. You can either create this configmap or edit an existing one.

The new label also shows up in the cluster parameter dropdown in the Grafana dashboards instead of the default one.

> [!NOTE]
> Only alphanumeric characters are allowed. Any other characters are replaced with `_`. This change is to ensure that different components that consume this label adhere to the basic alphanumeric convention.

### Debug mode
To view every metric that's being scraped for debugging purposes, the metrics add-on agent can be configured to run in debug mode by updating the setting `enabled` to `true` under the `debug-mode` setting in the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap`. You can either create this configmap or edit an existing one. For more information, see the [Debug mode section in Troubleshoot collection of Prometheus metrics](prometheus-metrics-troubleshoot.md#debug-mode).

### Scrape interval settings
To update the scrape interval settings for any target, you can update the duration in the setting `default-targets-scrape-interval-settings` for that target in the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap`. You have to set the scrape intervals in the correct format specified in [this website](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file). Otherwise, the default value of 30 seconds is applied to the corresponding targets.

## Configure custom Prometheus scrape jobs

You can configure the metrics add-on to scrape targets other than the default ones by using the same configuration format as the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file).

Follow the instructions to [create, validate, and apply the configmap](prometheus-metrics-scrape-validate.md) for your cluster.

### Advanced setup: Configure custom Prometheus scrape jobs for the DaemonSet

The `ama-metrics` ReplicaSet pod consumes the custom Prometheus config and scrapes the specified targets. For a cluster with a large number of nodes and pods and a large volume of metrics to scrape, some of the applicable custom scrape targets can be off-loaded from the single `ama-metrics` ReplicaSet pod to the `ama-metrics` DaemonSet pod.

The [ama-metrics-prometheus-config-node configmap](https://aka.ms/azureprometheus-addon-ds-configmap), similar to the regular configmap, can be created to have static scrape configs on each node. The scrape config should only target a single node and shouldn't use service discovery. Otherwise, each node tries to scrape all targets and makes many calls to the Kubernetes API server.

The following `node-exporter` config is one of the default targets for the DaemonSet pods. It uses the `$NODE_IP` environment variable, which is already set for every `ama-metrics` add-on container to target a specific port on the node.

  ```yaml
  - job_name: node
    scrape_interval: 30s
    scheme: http
    metrics_path: /metrics
    relabel_configs:
    - source_labels: [__metrics_path__]
      regex: (.*)
      target_label: metrics_path
    - source_labels: [__address__]
      replacement: '$NODE_NAME'
      target_label: instance
    static_configs:
    - targets: ['$NODE_IP:9100']
  ```

Custom scrape targets can follow the same format by using `static_configs` with targets and using the `$NODE_IP` environment variable and specifying the port to scrape. Each pod of the DaemonSet takes the config, scrapes the metrics, and sends them for that node.

## Prometheus configuration tips and examples

Learn some tips from examples in this section.

### Configuration file for custom scrape config

The configuration format is the same as the [Prometheus configuration file](https://aka.ms/azureprometheus-promioconfig). Currently, the following sections are supported:

```yaml
global:
  scrape_interval: <duration>
  scrape_timeout: <duration>
  external_labels:
    <labelname1>: <labelvalue>
    <labelname2>: <labelvalue>
scrape_configs:
  - <job-x>
  - <job-y>
```

Any other unsupported sections must be removed from the config before they're applied as a configmap. Otherwise, the custom configuration fails validation and isn't applied.

See the [Apply config file](prometheus-metrics-scrape-validate.md#apply-config-file) section to create a configmap from the Prometheus config.

> [!NOTE]
> When custom scrape configuration fails to apply because of validation errors, default scrape configuration continues to be used.

## Scrape configs
Currently, the supported methods of target discovery for a [scrape config](https://aka.ms/azureprometheus-promioconfig-scrape) are either [`static_configs`](https://aka.ms/azureprometheus-promioconfig-static) or [`kubernetes_sd_configs`](https://aka.ms/azureprometheus-promioconfig-sdk8s) for specifying or discovering targets.

#### Static config

A static config has a list of static targets and any extra labels to add to them.

```yaml
scrape_configs:
  - job_name: example
    - targets: [ '10.10.10.1:9090', '10.10.10.2:9090', '10.10.10.3:9090' ... ]
    - labels: [ label1: value1, label1: value2, ... ]
```

#### Kubernetes Service Discovery config

Targets discovered using [`kubernetes_sd_configs`](https://aka.ms/azureprometheus-promioconfig-sdk8s) each have different `__meta_*` labels depending on what role is specified. You can use the labels in the `relabel_configs` section to filter targets or replace labels for the targets.

See the [Prometheus examples](https://aka.ms/azureprometheus-promsampleossconfig) of scrape configs for a Kubernetes cluster.

### Relabel configs
The `relabel_configs` section is applied at the time of target discovery and applies to each target for the job. The following examples show ways to use `relabel_configs`.

#### Add a label
Add a new label called `example_label` with the value `example_value` to every metric of the job. Use `__address__` as the source label only because that label always exists and adds the label for every target of the job.

```yaml
relabel_configs:
- source_labels: [__address__]
  target_label: example_label
  replacement: 'example_value'
```

#### Use Kubernetes Service Discovery labels

If a job is using [`kubernetes_sd_configs`](https://aka.ms/azureprometheus-promioconfig-sdk8s) to discover targets, each role has associated `__meta_*` labels for metrics. The `__*` labels are dropped after discovering the targets. To filter by using them at the metrics level, first keep them using `relabel_configs` by assigning a label name. Then use `metric_relabel_configs` to filter.

```yaml
# Use the kubernetes namespace as a label called 'kubernetes_namespace'
relabel_configs:
- source_labels: [__meta_kubernetes_namespace]
  action: replace
  target_label: kubernetes_namespace

# Keep only metrics with the kubernetes namespace 'default'
metric_relabel_configs:
- source_labels: [kubernetes_namespace]
  action: keep
  regex: 'default'
```

#### Job and instance relabeling

You can change the `job` and `instance` label values based on the source label, just like any other label.

```yaml
# Replace the job name with the pod label 'k8s app'
relabel_configs:
- source_labels: [__meta_kubernetes_pod_label_k8s_app]
  target_label: job

# Replace the instance name with the node name. This is helpful to replace a node IP
# and port with a value that is more readable
relabel_configs:
- source_labels: [__meta_kubernetes_node_name]]
  target_label: instance
```

### Metric relabel configs

Metric relabel configs are applied after scraping and before ingestion. Use the `metric_relabel_configs` section to filter metrics after scraping. The following examples show how to do so.

#### Drop metrics by name

```yaml
# Drop the metric named 'example_metric_name'
metric_relabel_configs:
- source_labels: [__name__]
  action: drop
  regex: 'example_metric_name'
```

#### Keep only certain metrics by name

```yaml
# Keep only the metric named 'example_metric_name'
metric_relabel_configs:
- source_labels: [__name__]
  action: keep
  regex: 'example_metric_name'
```

```yaml
# Keep only metrics that start with 'example_'
metric_relabel_configs:
- source_labels: [__name__]
  action: keep
  regex: '(example_.*)'
```

#### Rename metrics
Metric renaming isn't supported.

#### Filter metrics by labels

```yaml
# Keep metrics only where example_label = 'example'
metric_relabel_configs:
- source_labels: [example_label]
  action: keep
  regex: 'example'
```

```yaml
# Keep metrics only if `example_label` equals `value_1` or `value_2`
metric_relabel_configs:
- source_labels: [example_label]
  action: keep
  regex: '(value_1|value_2)'
```

```yaml
# Keep metrics only if `example_label_1 = value_1` and `example_label_2 = value_2`
metric_relabel_configs:
- source_labels: [example_label_1, example_label_2]
  separator: ';'
  action: keep
  regex: 'value_1;value_2'
```

```yaml
# Keep metrics only if `example_label` exists as a label
metric_relabel_configs:
- source_labels: [example_label_1]
  action: keep
  regex: '.+'
```

### Pod annotation-based scraping

If you're currently using Azure Monitor Container insights Prometheus scraping with the setting `monitor_kubernetes_pods = true`, adding this job to your custom config allows you to scrape the same pods and metrics.

The following scrape config uses the `__meta_*` labels added from the `kubernetes_sd_configs` for the `pod` role to filter for pods with certain annotations.

To scrape certain pods, specify the port, path, and scheme through annotations for the pod and the following job scrapes only the address specified by the annotation:

- `prometheus.io/scrape`: Enable scraping for this pod.
- `prometheus.io/scheme`: If the metrics endpoint is secured, you need to set scheme to `https` and most likely set the TLS config.
- `prometheus.io/path`: If the metrics path isn't /metrics, define it with this annotation.
- `prometheus.io/port`: Specify a single port that you want to scrape.

```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'

    kubernetes_sd_configs:
    - role: pod

    relabel_configs:
    # Scrape only pods with the annotation: prometheus.io/scrape = true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true

    # If prometheus.io/path is specified, scrape this path instead of /metrics
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)

    # If prometheus.io/port is specified, scrape this port instead of the default
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__

    # If prometheus.io/scheme is specified, scrape with this scheme instead of http
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scheme]
      action: replace
      regex: (http|https)
      target_label: __scheme__

    # Include the pod namespace as a label for each metric
    - source_labels: [__meta_kubernetes_namespace]
      action: replace
      target_label: kubernetes_namespace

    # Include the pod name as a label for each metric
    - source_labels: [__meta_kubernetes_pod_name]
      action: replace
      target_label: kubernetes_pod_name

    # [Optional] Include all pod labels as labels for each metric
    - action: labelmap
      regex: __meta_kubernetes_pod_label_(.+)
```

See the [Apply config file](prometheus-metrics-scrape-validate.md#apply-config-file) section to create a configmap from the Prometheus config.

## Next steps

[Learn more about collecting Prometheus metrics](prometheus-metrics-overview.md)
