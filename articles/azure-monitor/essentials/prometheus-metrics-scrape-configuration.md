---
title: Customize scraping of Prometheus metrics in Azure Monitor (preview)
description: Customize metrics scraping for a Kubernetes cluster with the metrics addon in Azure Monitor.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Customize scraping of Prometheus metrics in Azure Monitor (preview)

This article provides instructions on customizing metrics scraping for a Kubernetes cluster with the [metrics addon](../containers/container-insights-prometheus-metrics-addon.md) in Azure Monitor.

## Configmaps

Three different configmaps can be configured to change the default settings of the metrics addon:

- ama-metrics-settings-configmap
- ama-metrics-prometheus-config
- ama-metrics-prometheus-config-node

## Metrics addon settings configmap

The [ama-metrics-settings-configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) can be downloaded, edited, and applied to the cluster to customize the out-of-the-box features of the metrics addon.

### Enabling and disabling default targets
The following table has a list of all the default targets that the Azure Monitor metrics addon can scrape by default and whether it's initially enabled. Default targets are scraped every 30 seconds.

| Key | Type | Enabled | Description |
|-----|------|----------|-------------|
| kubelet | bool | `true` | Scrape kubelet in every node in the k8s cluster without any extra scrape config. |
| cadvisor | bool | `true` | Scrape cAdvisor in every node in the k8s cluster without any extra scrape config.<br>Linux only. |
| kubestate | bool | `true` | Scrape kube-state-metrics in the k8s cluster (installed as a part of the addon) without any extra scrape config. |
| nodeexporter | bool | `true` | Scrape node metrics without any extra scrape config.<br>Linux only. |
| coredns | bool | `false` | Scrape coredns service in the k8s cluster without any extra scrape config. |
| kubeproxy | bool | `false` | Scrape kube-proxy in every linux node discovered in the k8s cluster without any extra scrape config.<br>Linux only. |
| apiserver | bool | `false` | Scrape the kubernetes api server in the k8s cluster without any extra scrape config. |
| prometheuscollectorhealth | bool | `false` | Scrape info about the prometheus-collector container such as the amount and size of timeseries scraped. |

If you want to turn on the scraping of the default targets that aren't enabled by default, edit the configmap `ama-metrics-settings-configmap` [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) to update the targets listed under `default-scrape-settings-enabled` to `true`, and apply the configmap to your cluster.

### Customizing metrics collected by default targets
By default, for all the default targets, only minimal metrics used in the default recording rules, alerts, and Grafana dashboards are ingested as described in [minimal-ingestion-profile](prometheus-metrics-scrape-configuration-minimal.md). To collect all metrics from default targets, in the configmap under `default-targets-metrics-keep-list`, set `minimalingestionprofile` to `false`.

To filter in additional metrics for any default targets, edit the settings under `default-targets-metrics-keep-list` for the corresponding job you'd like to change.

For example, `kubelet` is the metric filtering setting for the default target kubelet. Use the following to filter IN metrics collected for the default targets using regex based filtering. 

```
kubelet = "metricX|metricY"
apiserver = "mymetric.*"
```

> [!NOTE]
> If you use quotes or backslashes in the regex, you'll need to escape them using a backslash. For example `"test\'smetric\"s\""` and `testbackslash\\*`.

To further customize the default jobs to change properties such as collection frequency or labels, disable the corresponding default target by setting the configmap value for the target to `false`,  and then apply the job using custom configmap. For details on custom configuration, see [Customize scraping of Prometheus metrics in Azure Monitor](prometheus-metrics-scrape-configuration.md#configure-custom-prometheus-scrape-jobs).

### Cluster alias
The cluster label appended to every time series scraped will use the last part of the full AKS cluster's ARM resourceID. For example, if the resource ID is `/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/rg-name/providers/Microsoft.ContainerService/managedClusters/clustername`, the cluster label is `clustername`. 

To override the cluster label in the time series scraped, update the setting `cluster_alias` to any string under `prometheus-collector-settings` in the `ama-metrics-settings-configmap` [configmap](https://aka.ms/azureprometheus-addon-settings-configmap). You can either create this configmap or edit an existing one.

The new label will also show up in the cluster parameter dropdown in the Grafana dashboards instead of the default one.

> [!NOTE]
> Only alphanumeric characters are allowed. Any other characters else will be replaced with `_`. This is to ensure that different components that consume this label will adhere to the basic alphanumeric convention.

### Debug mode 
To view every metric that is being scraped for debugging purposes, the metrics addon agent can be configured to run in debug mode by updating the setting `enabled` to `true` under the `debug-mode` setting in `ama-metrics-settings-configmap` [configmap](https://aka.ms/azureprometheus-addon-settings-configmap). You can either create this configmap or edit an existing one. See [the Debug Mode section in Troubleshoot collection of Prometheus metrics](prometheus-metrics-troubleshoot.md#debug-mode) for more details.

## Configure custom Prometheus scrape jobs

You can configure the metrics addon to scrape targets other than the default ones, using the same configuration format as the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file).

Follow the instructions to [create, validate, and apply the configmap](prometheus-metrics-scrape-validate.md) for your cluster.

### Advanced Setup: Configure custom Prometheus scrape jobs for the daemonset

The `ama-metrics` replicaset pod consumes the custom Prometheus config and scrapes the specified targets. For a cluster with a large number of nodes and pods and a large volume of metrics to scrape, some of the applicable custom scrape targets can be off-loaded from the single `ama-metrics` replicaset pod to the `ama-metrics` daemonset pod. The [ama-metrics-prometheus-config-node configmap](https://aka.ms/azureprometheus-addon-ds-configmap), similar to the regular configmap, can be created to have static scrape configs on each node. The scrape config should only target a single node and shouldn't use service discovery; otherwise each node will try to scrape all targets and will make many calls to the Kubernetes API server. The `node-exporter` config below is one of the default targets for the daemonset pods. It uses the `$NODE_IP` environment variable, which is already set for every ama-metrics addon container to target a specific port on the node:

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

Custom scrape targets can follow the same format using `static_configs` with targets using the `$NODE_IP` environment variable and specifying the port to scrape. Each pod of the daemonset will take the config, scrape the metrics, and send them for that node.

## Prometheus configuration tips and examples

### Configuration File for custom scrape config

The configuration format is the same as the [Prometheus configuration file](https://aka.ms/azureprometheus-promioconfig). Currently supported are the following sections:

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

Any other unsupported sections need to be removed from the config before applying as a configmap. Otherwise the custom configuration will fail validation and won't be applied.

> [!NOTE]
> When custom scrape configuration fails to apply due to validation errors, default scrape configuration will continue to be used.

## Scrape Configs
The currently supported methods of target discovery for a [scrape config](https://aka.ms/azureprometheus-promioconfig-scrape) are either [`static_configs`](https://aka.ms/azureprometheus-promioconfig-static) or [`kubernetes_sd_configs`](https://aka.ms/azureprometheus-promioconfig-sdk8s) for specifying or discovering targets.

#### Static config

A static config has a list of static targets and any extra labels to add to them.

```yaml
scrape_configs:
  - job_name: example
    - targets: [ '10.10.10.1:9090', '10.10.10.2:9090', '10.10.10.3:9090' ... ]
    - labels: [ label1: value1, label1: value2, ... ]
```

#### Kubernetes Service Discovery config

Targets discovered using [`kubernetes_sd_configs`](https://aka.ms/azureprometheus-promioconfig-sdk8s) will each have different `__meta_*` labels depending on what role is specified. These can be used in the `relabel_configs` section to filter targets or replace labels for the targets.

See the [Prometheus examples](https://aka.ms/azureprometheus-promsampleossconfig) of scrape configs for a Kubernetes cluster.

### Relabel configs
The `relabel_configs` section is applied at the time of target discovery and applies to each target for the job. Below are examples showing ways to use `relabel_configs`.

#### Adding a label
Add a new label called `example_label` with value `example_value` to every metric of the job. Use `__address__` as the source label only because that label will always exist. This will add the label for every target of the job.

```yaml
relabel_configs:
- source_labels: [__address__]
  target_label: example_label
  replacement: 'example_value'
```

#### Use Kubernetes Service Discovery labels

If a job is using [`kubernetes_sd_configs`](https://aka.ms/azureprometheus-promioconfig-sdk8s) to discover targets, each role has associated `__meta_*` labels for metrics. The `__*` labels are dropped after discovering the targets. To filter by them at the metrics level, first keep them using `relabel_configs` by assigning a label name and then use `metric_relabel_configs` to filter.

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

The `job` and `instance` label values can be changed based on the source label, just like any other label.

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

Metric relabel configs are applied after scraping and before ingestion. Use the `metric_relabel_configs` section to filter metrics after scraping. Below are examples of how to do so.

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

#### Rename Metrics
Metric renaming isn't supported.

#### Filter Metrics by Labels

```yaml
# Keep only metrics with where example_label = 'example'
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
# Keep metric only if `example_label_1 = value_1` and `example_label_2 = value_2`
metric_relabel_configs:
- source_labels: [example_label_1, example_label_2]
  separator: ';'
  action: keep
  regex: 'value_1;value_2'
```

```yaml
# Keep metric only if `example_label` exists as a label
metric_relabel_configs:
- source_labels: [example_label_1]
  action: keep
  regex: '.+'
```

### Pod Annotation Based Scraping

If you're currently using Azure Monitor Container Insights Prometheus scraping with the setting `monitor_kubernetes_pods = true`, adding this job to your custom config will allow you to scrape the same pods and metrics.

The scrape config below uses the `__meta_*` labels added from the `kubernetes_sd_configs` for the `pod` role to filter for pods with certain annotations.

To scrape certain pods, specify the port, path, and scheme through annotations for the pod and the below job will scrape only the address specified by the annotation:
- `prometheus.io/scrape`: Enable scraping for this pod
- `prometheus.io/scheme`: If the metrics endpoint is secured, then you'll need to set this to `https` & most likely set the tls config.
- `prometheus.io/path`: If the metrics path isn't /metrics, define it with this annotation.
- `prometheus.io/port`: Specify a single, desired port to scrape

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



## Next steps

- [Learn more about collecting Prometheus metrics](prometheus-metrics-overview.md).
