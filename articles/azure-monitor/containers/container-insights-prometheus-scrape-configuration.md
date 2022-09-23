---
title: Container insights Prometheus scraping configuration
description: 
ms.topic: conceptual
ms.date: 09/16/2022
ms.reviewer: aul
---

# Container insights Prometheus scraping configuration

The Azure Monitor Prometheus agent does not understand or process operator [CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for scrape configuration, but instead uses the native Prometheus configuration as defined in [Prometheus configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config). Following are instructions how to provide custom scrape configuration for the Azure Monitor Prometheus agent.

## Custom scrape configuration

In addition to the default scrape targets that Azure Monitor Prometheus agent scrapes by default, use the following steps to provide additional scrape config to the agent using a configmap. 

## Create configuration file
Create a Prometheus scrape configuration file named *prometheus-config*. See [Prometheus Configuration Tips](https://github.com/Azure/prometheus-collector/blob/temp/documentation/otelcollector/docs/publicpreviewdocs/grace/custom-config-tips.md) for some samples and tips on authoring scrape config for Prometheus. You can also refer to [Prometheus.io](https://prometheus.io/) scrape configuration [reference](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config).

In *prometheus-config*, configuration file, add any custom scrape jobs. See the [Prometheus configuration docs](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) for more information. Your config file will list the scrape configs under the section scrape_configs and can optionally use the global section for setting the global scrape_interval, scrape_timeout, and evaluation_interval. 

> [!TIP]
> Changes to global section will impact default config and custom config.

Following is a sample scrape config file.

```
global:
  evaluation_interval: 60s
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

Once you have a custom Prometheus scrape configuration, you can use the **promconfigvalidator** tool to validate your config before creating it as a configmap that the agent addon can consume. This same tool is used by the agent to validate the config given to it thru the configmap. If the config is not valid then the custom configuration given will not be used by the agent.

The promconfigvalidator tool is inside the Container insights addon container. You can use any of the `ama-metrics-node-*` pods in `kube-system` namespace in your cluster to download the tool for validation. Use `kubectl cp` for to download the tool and its configuration as shown below.

```
for podname in $(kubectl get pods -l rsName=ama-metrics -n=kube-system -o json | jq -r '.items[].metadata.name'); do kubectl cp -n=kube-system "${podname}":/opt/promconfigvalidator ./promconfigvalidator/promconfigvalidator;  kubectl cp -n=kube-system "${podname}":/opt/microsoft/otelcollector/collector-config-template.yml ./promconfigvalidator/collector-config-template.yml; done
```

This generates the merged configuration file *merged-otel-config.yaml* if no parameter is provided using the optional *--output* parameter. Do not use this merged file as config to the metrics collector agent, as it's only used for tool validation and debugging purposes.

## Apply config file
Apply the config file as a config map *ama-metrics-prometheus-config* to the cluster in `kube-system` namespace. Ensure the config file is named *prometheus-metrics* before running the following command since it uses file name as config map setting name.

```
kubectl create configmap ama-metrics-prometheus-config --from-file="full-path-to-prometheus-config-file" -n kube-system
```

This will create a config map `ama-metrics-prometheus-config` in `kube-system` namespace. The azure monitor metrics pod will then restart to apply the new config. You can look at any errors in config processing/merging by looking at logs of the pod.


## Next steps

