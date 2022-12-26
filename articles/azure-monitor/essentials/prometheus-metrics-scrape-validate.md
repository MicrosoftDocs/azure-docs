---
title: Create, validate and troubleshoot custom configuration file for Prometheus metrics in Azure Monitor (preview)
description: Describes how to create custom configuration file Prometheus metrics in Azure Monitor and use validation tool before applying to Kubernetes cluster.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Create and validate custom configuration file for Prometheus metrics in Azure Monitor (preview)

In addition to the default scrape targets that Azure Monitor Prometheus agent scrapes by default, use the following steps to provide additional scrape config to the agent using a configmap. The Azure Monitor Prometheus agent doesn't understand or process operator [CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for scrape configuration, but instead uses the native Prometheus configuration as defined in [Prometheus configuration](https://aka.ms/azureprometheus-promioconfig-scrape).

The 2 configmaps that can be used for custom target scraping are -
- ama-metrics-prometheus-config - When a configmap with this name is created, the scraping of custom targets is done by the replicaset.
- ama-metrics-prometheus-config-node - When a configmap with this name is created, the scraping of custom targets is done by each daemonset. See [Advanced Setup](prometheus-metrics-scrape-configuration.md#advanced-setup-configure-custom-prometheus-scrape-jobs-for-the-daemonset) for more details .

## Create Prometheus configuration file
Create a Prometheus scrape configuration file named `prometheus-config`. See the [configuration tips and examples](prometheus-metrics-scrape-configuration.md#prometheus-configuration-tips-and-examples) for more details on authoring scrape config for Prometheus. You can also refer to [Prometheus.io](https://aka.ms/azureprometheus-promio) scrape configuration [reference](https://aka.ms/azureprometheus-promioconfig-scrape). Your config file will list the scrape configs under the section `scrape_configs` and can optionally use the global section for setting the global `scrape_interval`, `scrape_timeout`, and `external_labels`. 


> [!TIP]
> Changes to global section will impact the default configs and the custom config.

Below is a sample Prometheus scrape config file:

```
global:
  scrape_interval: 60s
scrape_configs:
- job_name: node
  scrape_interval: 30s
  scheme: http
  kubernetes_sd_configs:
    - role: endpoints
      namespaces:
        names:
        - node-exporter
  relabel_configs:
    - source_labels: [__meta_kubernetes_endpoints_name]
      action: keep
      regex: "dev-cluster-node-exporter-release-prometheus-node-exporter"
    - source_labels: [__metrics_path__]
      regex: (.*)
      target_label: metrics_path
    - source_labels: [__meta_kubernetes_endpoint_node_name]
      regex: (.*)
      target_label: instance

- job_name: kube-state-metrics
  scrape_interval: 30s
  static_configs:
    - targets: ['dev-cluster-kube-state-metrics-release.kube-state-metrics.svc.cluster.local:8080']

- job_name: prometheus_ref_app
  scheme: http
  kubernetes_sd_configs:
    - role: service
  relabel_configs:
    - source_labels: [__meta_kubernetes_service_name]
      action: keep
      regex: "prometheus-reference-service"
```

## Validate the scrape config file

The agent uses the `promconfigvalidator` tool to validate the Prometheus config given to it through the configmap. If the config isn't valid, then the custom configuration given won't be used by the agent. Once you have your Prometheus config file, you can *optionally* use the `promconfigvalidator` tool to validate your config before creating a configmap that the agent consumes.

The `promconfigvalidator` tool is inside the Azure Monitor metrics addon. You can use any of the `ama-metrics-node-*` pods in `kube-system` namespace in your cluster to download the tool for validation. Use `kubectl cp` to download the tool and its configuration as shown below:

```
for podname in $(kubectl get pods -l rsName=ama-metrics -n=kube-system -o json | jq -r '.items[].metadata.name'); do kubectl cp -n=kube-system "${podname}":/opt/promconfigvalidator ./promconfigvalidator;  kubectl cp -n=kube-system "${podname}":/opt/microsoft/otelcollector/collector-config-template.yml ./collector-config-template.yml; chmod 500 promconfigvalidator; done
```

After copying the executable and the yaml, locate the path of your Prometheus configuration file. Then replace `<config path>` below and run the validator with the command:

```
./promconfigvalidator/promconfigvalidator --config "<config path>" --otelTemplate "./promconfigvalidator/collector-config-template.yml"
```

Running the validator generates the merged configuration file `merged-otel-config.yaml` if no path is provided with the optional `output` parameter. Don't use this merged file as config to the metrics collector agent, as it's only used for tool validation and debugging purposes.

### Apply config file
Your custom Prometheus configuration file is consumed as a field named `prometheus-config` in a configmap called `ama-metrics-prometheus-config` in the `kube-system` namespace. You can create a configmap from a file by renaming your Prometheus configuration file to `prometheus-config` (with no file extension) and running the following command:

```
kubectl create configmap ama-metrics-prometheus-config --from-file=prometheus-config -n kube-system
```

*Ensure that the Prometheus config file is named `prometheus-config` before running the following command since the file name is used as the configmap setting name.*

This will create a configmap named `ama-metrics-prometheus-config` in `kube-system` namespace. The Azure Monitor metrics pod will then restart to apply the new config. To see if there any issues with the config validation, processing, or merging, you can look at the `ama-metrics` pods.

A sample of the `ama-metrics-prometheus-config` configmap is [here](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-configmap.yaml).

### Troubleshooting
If you successfully created the configmap (ama-metrics-prometheus-config or ama-metrics-prometheus-config-node) in the **kube-system** namespace and still don't see the custom targets being scraped, check for errors in the **replicaset pod** logs for **ama-metrics-prometheus-config** configmap or **daemonset pod** logs for **ama-metrics-prometheus-config-node** configmap) using *kubectl logs* and make sure there are no errors in the *Start Merging Default and Custom Prometheus Config* section with prefix *prometheus-config-merger*

## Next steps

- [Learn more about collecting Prometheus metrics](prometheus-metrics-overview.md).
