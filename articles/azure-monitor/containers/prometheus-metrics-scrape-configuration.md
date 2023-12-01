---
title: Customize scraping of Prometheus metrics in Azure Monitor
description: Customize metrics scraping for a Kubernetes cluster with the metrics add-on in Azure Monitor.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus

This article provides instructions on customizing metrics scraping for a Kubernetes cluster with the [metrics addon](prometheus-metrics-enable.md) in Azure Monitor.

## Configmaps

Four different configmaps can be configured to provide scrape configuration and other settings for the metrics add-on. All config-maps should be applied to `kube-system` namespace for any cluster.

> [!NOTE]
> None of the four configmaps exist by default in the cluster when Managed Prometheus is enabled. Depending on what needs to be customized, you need to deploy any or all of these four configmaps with the same name specified, in `kube-system` namespace. AMA-Metrics pods will pick up these configmaps after you deploy them to `kube-system` namespace, and will restart in 2-3 minutes to apply the configuration settings specified in the configmap(s).

1. [`ama-metrics-settings-configmap`](https://aka.ms/azureprometheus-addon-settings-configmap)
   This config map has below simple settings that can be configured. You can take the configmap from the above git hub repo, change the settings are required and apply/deploy the configmap to `kube-system` namespace for your cluster
      * cluster alias (to change the value of `cluster` label in every time-series/metric that's ingested from a cluster)
      * enable/disable default scrape targets - Turn ON/OFF default scraping based on targets. Scrape configuration for these default targets are already pre-defined/built-in
      * enable pod annotation based scraping per namespace
      * metric keep-lists - this setting is used to control which metrics are listed to be allowed from each default target and to change the default behavior
      * scrape intervals for default/pre-definetargets. `30 secs` is the default scrape frequency and it can be changed per default target using this configmap
      * debug-mode - turning this ON helps to debug missing metric/ingestion issues - see more on [troubleshooting](prometheus-metrics-troubleshoot.md#debug-mode)
2. [`ama-metrics-prometheus-config`](https://aka.ms/azureprometheus-addon-rs-configmap) (**Recommended**)
   This config map can be used to provide Prometheus scrape config for addon replica. Addon runs a singleton replica, and any cluster level services can be discovered and scraped by providing scrape jobs in this configmap. You can take the sample configmap from the above git hub repo, add scrape jobs that you  would need and apply/deploy the config map to `kube-system` namespace for your cluster.
3. [`ama-metrics-prometheus-config-node`](https://aka.ms/azureprometheus-addon-ds-configmap) (**Advanced**)
    This config map can be used to provide Prometheus scrape config for addon DaemonSet that runs on every **Linux** node in the cluster, and any node level targets on each node can be scraped by providing scrape jobs in this configmap. When you use this configmap, you can use `$NODE_IP` variable in your scrape config, which gets substituted by corresponding  node's ip address in DaemonSet pod running on each node. This way you get access to scrape anything that runs on that node from the metrics addon DaemonSet. **Please be careful when you use discoveries in scrape config in this node level config map, as every node in the cluster will setup & discover the target(s) and will collect redundant metrics**. 
    You can take the sample configmap from the above git hub repo, add scrape jobs that you  would need and apply/deploy the config map to `kube-system` namespace for your cluster
4. [`ama-metrics-prometheus-config-node-windows`](https://aka.ms/azureprometheus-addon-ds-configmap-windows) (**Advanced**)
    This config map can be used to provide Prometheus scrape config for addon DaemonSet that runs on every **Windows** node in the cluster, and node level targets on each node can be scraped by providing scrape jobs in this configmap. When you use this configmap, you can use `$NODE_IP` variable in your scrape config, which will be substituted by corresponding  node's ip address in DaemonSet pod running on each node. This way you get access to scrape anything that runs on that node from the metrics addon DaemonSet. **Please be careful when you use discoveries in scrape config in this node level config map, as every node in the cluster will setup & discover the target(s) and will collect redundant metrics**. 
    You can take the sample configmap from the above git hub repo, add scrape jobs that you  would need and apply/deploy the config map to `kube-system` namespace for your cluster

## Metrics add-on settings configmap

The [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) can be downloaded, edited, and applied to the cluster to customize the out-of-the-box features of the metrics add-on.

### Enable and disable default targets
The following table has a list of all the default targets that the Azure Monitor metrics add-on can scrape by default and whether it's initially enabled. Default targets are scraped every 30 seconds. A replica is deployed to scrape cluster-wide targets such as kube-state-metrics. A DaemonSet is also deployed to scrape node-wide targets such as kubelet.

| Key | Type | Enabled | Pod | Description |
|-----|------|----------|----|-------------|
| kubelet | bool | `true` | Linux DaemonSet | Scrape kubelet in every node in the K8s cluster without any extra scrape config. |
| cadvisor | bool | `true` | Linux DaemonSet | Scrape cadvisor in every node in the K8s cluster without any extra scrape config.<br>Linux only. |
| kubestate | bool | `true` | Linux replica | Scrape kube-state-metrics in the K8s cluster (installed as a part of the add-on) without any extra scrape config. |
| nodeexporter | bool | `true` | Linux DaemonSet | Scrape node metrics without any extra scrape config.<br>Linux only. |
| coredns | bool | `false` | Linux replica | Scrape coredns service in the K8s cluster without any extra scrape config. |
| kubeproxy | bool | `false` | Linux DaemonSet | Scrape kube-proxy in every Linux node discovered in the K8s cluster without any extra scrape config.<br>Linux only. |
| apiserver | bool | `false` | Linux replica | Scrape the Kubernetes API server in the K8s cluster without any extra scrape config. |
| windowsexporter | bool | `false` | Windows DaemonSet | Scrape windows-exporter in every node in the K8s cluster without any extra scrape config.<br>Windows only. |
| windowskubeproxy | bool | `false` | Windows DaemonSet | Scrape windows-kube-proxy in every node in the K8s cluster without any extra scrape config.<br>Windows only. |
| prometheuscollectorhealth | bool | `false` | Linux replica | Scrape information about the prometheus-collector container, such as the amount and size of time series scraped. |

If you want to turn on the scraping of the default targets that aren't enabled by default, edit the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap` to update the targets listed under `default-scrape-settings-enabled` to `true`. Apply the configmap to your cluster.

### Customize metrics collected by default targets
By default, for all the default targets, only minimal metrics used in the default recording rules, alerts, and Grafana dashboards are ingested as described in [minimal-ingestion-profile](prometheus-metrics-scrape-configuration-minimal.md). To collect all metrics from default targets, update the keep-lists in the settings configmap under `default-targets-metrics-keep-list`, and set `minimalingestionprofile` to `false`.

To allowlist more metrics in addition to default metrics that are listed to be allowed, for any default targets, edit the settings under `default-targets-metrics-keep-list` for the corresponding job you want to change.

For example, `kubelet` is the metric filtering setting for the default target kubelet. Use the following script to filter *in* metrics collected for the default targets by using regex-based filtering.

```
kubelet = "metricX|metricY"
apiserver = "mymetric.*"
```

> [!NOTE]
> If you use quotation marks or backslashes in the regex, you need to escape them by using a backslash like the examples `"test\'smetric\"s\""` and `testbackslash\\*`.

To further customize the default jobs to change properties like collection frequency or labels, disable the corresponding default target by setting the configmap value for the target to `false`. Then apply the job by using a custom configmap. For details on custom configuration, see [Customize scraping of Prometheus metrics in Azure Monitor](prometheus-metrics-scrape-configuration.md#configure-custom-prometheus-scrape-jobs).

### Cluster alias
The cluster label appended to every time series scraped uses the last part of the full AKS cluster's Azure Resource Manager resource ID. For example, if the resource ID is `/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/rg-name/providers/Microsoft.ContainerService/managedClusters/myclustername`, the cluster label is `myclustername`.

To override the cluster label in the time series scraped, update the setting `cluster_alias` to any string under `prometheus-collector-settings` in the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap`. You can create this configmap if it doesn't exist in the cluster or you can edit the existing one if its already exists in your cluster.

The new label also shows up in the cluster parameter dropdown in the Grafana dashboards instead of the default one.

> [!NOTE]
> Only alphanumeric characters are allowed. Any other characters are replaced with `_`. This change is to ensure that different components that consume this label adhere to the basic alphanumeric convention.

### Debug mode
To view every metric that's being scraped for debugging purposes, the metrics add-on agent can be configured to run in debug mode by updating the setting `enabled` to `true` under the `debug-mode` setting in the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap`. You can either create this configmap or edit an existing one. For more information, see the [Debug mode section in Troubleshoot collection of Prometheus metrics](prometheus-metrics-troubleshoot.md#debug-mode).

### Scrape interval settings
To update the scrape interval settings for any target, you can update the duration in the setting `default-targets-scrape-interval-settings` for that target in the [configmap](https://aka.ms/azureprometheus-addon-settings-configmap) `ama-metrics-settings-configmap`. You have to set the scrape intervals in the correct format specified in [this website](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file). Otherwise, the default value of 30 seconds is applied to the corresponding targets. For example - If you want to update the scrape interval for the `kubelet` job to `60s` then you can update the following section in the YAML:

```
default-targets-scrape-interval-settings: |-
    kubelet = "60s"
    coredns = "30s"
    cadvisor = "30s"
    kubeproxy = "30s"
    apiserver = "30s"
    kubestate = "30s"
    nodeexporter = "30s"
    windowsexporter = "30s"
    windowskubeproxy = "30s"
    kappiebasic = "30s"
    prometheuscollectorhealth = "30s"
    podannotations = "30s"
```
and apply the YAML using the following command: `kubectl apply -f .\ama-metrics-settings-configmap.yaml`

## Configure custom Prometheus scrape jobs

You can configure the metrics add-on to scrape targets other than the default ones by using the same configuration format as the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file).

Follow the instructions to [create, validate, and apply the configmap](prometheus-metrics-scrape-validate.md) for your cluster.



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

See the [Apply config file](prometheus-metrics-scrape-validate.md#deploy-config-file-as-configmap) section to create a configmap from the Prometheus config.

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

The following scrape config uses the `__meta_*` labels added from the `kubernetes_sd_configs` for the `pod` role to filter for pods with certain annotations.

To scrape certain pods, specify the port, path, and scheme through annotations for the pod and the following job scrapes only the address specified by the annotation:

- `prometheus.io/scrape`: Enable scraping for this pod.
- `prometheus.io/scheme`: If the metrics endpoint is secured, you need to set scheme to `https` and most likely set the TLS config.
- `prometheus.io/path`: If the metrics path isn't /metrics, define it with this annotation.
- `prometheus.io/port`: Specify a single port that you want to scrape.

```yaml
scrape_configs:
  - job_name: 'kubernetespods-sample'

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

See the [Apply config file](prometheus-metrics-scrape-validate.md#deploy-config-file-as-configmap) section to create a configmap from the Prometheus config.

## Next steps

[Learn more about collecting Prometheus metrics](../essentials/prometheus-metrics-overview.md)
