---
title: Create, validate and troubleshoot custom configuration file for Prometheus metrics in Azure Monitor
description: Describes how to create custom configuration file Prometheus metrics in Azure Monitor and use validation tool before applying to Kubernetes cluster.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Create and validate custom configuration file for Prometheus metrics in Azure Monitor

In addition to the default scrape targets that Azure Monitor Prometheus agent scrapes by default, use the following steps to provide more scrape config to the agent using a configmap. The Azure Monitor Prometheus agent doesn't understand or process operator [CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for scrape configuration, but instead uses the native Prometheus configuration as defined in [Prometheus configuration](https://aka.ms/azureprometheus-promioconfig-scrape).

The three configmaps that can be used for custom target scraping are -
- ama-metrics-prometheus-config - When a configmap with this name is created, scrape jobs defined in it are run from the Azure monitor metrics replica pod running in the cluster.
- ama-metrics-prometheus-config-node - When a configmap with this name is created, scrape jobs defined in it are run from each **Linux** DaemonSet pod running in the cluster. For more information, see [Advanced Setup](prometheus-metrics-scrape-configuration.md#advanced-setup-configure-custom-prometheus-scrape-jobs-for-the-daemonset).
- ama-metrics-prometheus-config-node-windows - When a configmap with this name is created, scrape jobs defined in it are run from each **windows** DaemonSet. For more information, see [Advanced Setup](prometheus-metrics-scrape-configuration.md#advanced-setup-configure-custom-prometheus-scrape-jobs-for-the-daemonset).

## Create Prometheus configuration file

One easier way to author Prometheus scrape configuration jobs: 
- Step:1 Use a config file (yaml) to author/define scrape jobs 
- Step:2 Validate the scrape config file using a custom tool (as specified in this article) and then convert that configfile to configmap 
- Step:3 Deploy the scrape config file as configmap to your clusters. 
  
Doing this way is easier to author yaml config (which is extremely space sensitive), and not add unintended spaces by directly authoring scrape config inside config map.

Create a Prometheus scrape configuration file named `prometheus-config`. For more information, see [configuration tips and examples](prometheus-metrics-scrape-configuration.md#prometheus-configuration-tips-and-examples) which gives more details on authoring scrape config for Prometheus. You can also refer to [Prometheus.io](https://aka.ms/azureprometheus-promio) scrape configuration [reference](https://aka.ms/azureprometheus-promioconfig-scrape). Your config file lists the scrape configs under the section `scrape_configs`  section and can optionally use the global section for setting the global `scrape_interval`, `scrape_timeout`, and `external_labels`. 


> [!TIP]
> Changes to global section will impact the default configs and the custom config.

Here is a sample Prometheus scrape config file:

```
global:
  scrape_interval: 30s
scrape_configs:
- job_name: my_static_config
  scrape_interval: 60s
  static_configs:
    - targets: ['my-static-service.svc.cluster.local:1234']

- job_name: prometheus_example_app
  scheme: http
  kubernetes_sd_configs:
    - role: service
  relabel_configs:
    - source_labels: [__meta_kubernetes_service_name]
      action: keep
      regex: "prometheus-example-service"
```

## Validate the scrape config file

The agent uses a custom `promconfigvalidator` tool to validate the Prometheus config given to it through the configmap. If the config isn't valid, then the custom configuration given gets rejected by the addon agent. Once you have your Prometheus config file, you can *optionally* use the `promconfigvalidator` tool to validate your config before creating a configmap that the agent consumes.

The `promconfigvalidator` tool is shipped inside the Azure Monitor metrics addon pod(s). You can use any of the `ama-metrics-node-*` pods in `kube-system` namespace in your cluster to download the tool for validation. Use `kubectl cp` to download the tool and its configuration:

```
for podname in $(kubectl get pods -l rsName=ama-metrics -n=kube-system -o json | jq -r '.items[].metadata.name'); do kubectl cp -n=kube-system "${podname}":/opt/promconfigvalidator ./promconfigvalidator;  kubectl cp -n=kube-system "${podname}":/opt/microsoft/otelcollector/collector-config-template.yml ./collector-config-template.yml; chmod 500 promconfigvalidator; done
```

After copying the executable and the yaml, locate the path of your Prometheus configuration file that you authored. Then replace `<config path>`  in the command and run the validator with the command:

```
./promconfigvalidator/promconfigvalidator --config "<config path>" --otelTemplate "./promconfigvalidator/collector-config-template.yml"
```

Running the validator generates the merged configuration file `merged-otel-config.yaml` if no path is provided with the optional `output` parameter. Don't use this autogenerated merged file as config to the metrics collector agent, as it's only used for tool validation and debugging purposes.

### Deploy config file as configmap
Your custom Prometheus configuration file is consumed as a field named `prometheus-config` inside metrics addon configmap(s) `ama-metrics-prometheus-config` (or) `ama-metrics-prometheus-config-node` (or) `ama-metrics-prometheus-config-node-windows`  in the `kube-system` namespace. You can create a configmap from the scrape config file you created above, by renaming your Prometheus configuration file to `prometheus-config` (with no file extension) and running one or more of the following commands, depending on which configmap you want to create for your custom scrape job(s) config.

Ex;- to create configmap to be used by replicsset
```
kubectl create configmap ama-metrics-prometheus-config --from-file=prometheus-config -n kube-system
```
This creates a configmap named `ama-metrics-prometheus-config` in `kube-system` namespace. The Azure Monitor metrics replica pod restarts in 30-60 secs to apply the new config. To see if there any issues with the config validation, processing, or merging, you can look at the `ama-metrics` replica pods

Ex;- to create configmap to be used by linux DaemonSet
```
kubectl create configmap ama-metrics-prometheus-config-node --from-file=prometheus-config -n kube-system
```
This creates a configmap named `ama-metrics-prometheus-config-node` in `kube-system` namespace. Every Azure Monitor metrics Linux DaemonSet pod restarts in 30-60 secs to apply the new config. To see if there any issues with the config validation, processing, or merging, you can look at the `ama-metrics-node` linux deamonset pods


Ex;- to create configmap to be used by windows DaemonSet
```
kubectl create configmap ama-metrics-prometheus-config-node-windows --from-file=prometheus-config -n kube-system
```

This creates a configmap named `ama-metrics-prometheus-config-node-windows` in `kube-system` namespace. Every Azure Monitor metrics Windows DaemonSet pod restarts in 30-60 secs to apply the new config. To see if there any issues with the config validation, processing, or merging, you can look at the `ama-metrics-win-node` windows deamonset pods


*Ensure that the Prometheus config file is named `prometheus-config` before running the following command since the file name is used as the configmap setting name.*

This creates a configmap named `ama-metrics-prometheus-config` in `kube-system` namespace. The Azure Monitor metrics pod restarts to apply the new config. To see if there any issues with the config validation, processing, or merging, you can look at the `ama-metrics` pods.

A sample of the `ama-metrics-prometheus-config` configmap is [here](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-configmap.yaml).

### Troubleshooting
If you successfully created the configmap (ama-metrics-prometheus-config or ama-metrics-prometheus-config-node) in the **kube-system** namespace and still don't see the custom targets being scraped, check for errors in the **replica pod** logs for **ama-metrics-prometheus-config** configmap or **DaemonSet pod** logs for **ama-metrics-prometheus-config-node** configmap) using *kubectl logs* and make sure there are no errors in the *Start Merging Default and Custom Prometheus Config* section with prefix *prometheus-config-merger*

## Next steps

- [Learn more about collecting Prometheus metrics](../essentials/prometheus-metrics-overview.md).
