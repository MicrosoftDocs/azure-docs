---
title: Configure Azure Monitor for containers Prometheus Integration Overview | Microsoft Docs
description: This article describes how you can configure the Azure Monitor for containers agent to scrape metrics from Prometheus with your Kubernetes or Red Hat OpenShift cluster.
ms.topic: conceptual
ms.date: 04/16/2020
---

# Configure Azure Monitor for containers Prometheus Integration Overview

[Prometheus](https://prometheus.io/) is a popular open source metric monitoring solution and is a part of the [Cloud Native Compute Foundation](https://www.cncf.io/). Azure Monitor for containers provides a seamless onboarding experience to collect Prometheus metrics. Typically, to use Prometheus, you need to set up and manage a Prometheus server with a store. By integrating with Azure Monitor, a Prometheus server is not required. You just need to expose the Prometheus metrics endpoint through your exporters or pods (application), and the containerized agent for Azure Monitor for containers can scrape the metrics for you.

![Container monitoring architecture for Prometheus](./media/container-insights-prometheus-integration/monitoring-kubernetes-architecture.png)

> [!NOTE]
> The minimum agent version supported for scraping Prometheus metrics is `ciprod07092019` or later, and the agent version supported for writing configuration and agent errors in the `KubeMonAgentEvents` table is `ciprod10112019`. For more information about the agent versions and what's included in each release, see [agent release notes](https://github.com/microsoft/Docker-Provider/tree/ci_feature_prod).
> To verify your agent version, from the **Node** tab select a node, and in the properties pane note value of the **Agent Image Tag** property or run `kubectl get deploy omsagent-rs -n kube-system -o jsonpath="{.spec.template.spec.containers[*].image}"`.

Scraping of Prometheus metrics is supported with Kubernetes clusters hosted on:

- [Azure Kubernetes Service (AKS)](container-insights-prometheus-configuration-aks.md)
- [Azure Stack or on-premises](container-insights-prometheus-configuration-aks.md)
- [Azure Red Hat OpenShift](container-insights-prometheus-configuration-aro.md)

## Configure Prometheus scraping settings

Azure Monitor for Containers does not scrape Prometheus metrics by default. To activate and configure Prometheus metrics scraping for Azure Monitor, a configuration in form of a Kubernetes `ConfigMap` needs to be added to the cluster.
This `ConfigMap` is a global list and there can be only one applied to the agent. You cannot have another `ConfigMap` overruling the collections.

Active scraping of metrics from Prometheus is performed from one of two perspectives:

- Cluster-wide - HTTP URL and discover targets from listed endpoints of a service. For example, k8s services such as kube-dns and kube-state-metrics, and pod annotations specific to an application. Metrics collected in this context will be defined in the ConfigMap section _[Prometheus data_collection_settings.cluster]_.
- Node-wide - HTTP URL and discover targets from listed endpoints of a service. Metrics collected in this context will be defined in the ConfigMap section _[Prometheus_data_collection_settings.node]_.

| Endpoint           | Scope                        | Example                                                                                                                                                    |
| ------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pod annotation     | Cluster-wide                 | annotations: <br>`prometheus.io/scrape: "true"` <br>`prometheus.io/path: "/mymetrics"` <br>`prometheus.io/port: "8000"` <br>`prometheus.io/scheme: "http"` |
| Kubernetes service | Cluster-wide                 | `http://my-service-dns.my-namespace:9100/metrics` <br>`https://metrics-server.kube-system.svc.cluster.local/metrics`​                                      |
| url/endpoint       | Per-node and/or cluster-wide | `http://myurl:9101/metrics`                                                                                                                                |

When a URL is specified, Azure Monitor for containers only scrapes the endpoint. When Kubernetes service is specified, the service name is resolved with the cluster DNS server to get the IP address and then the resolved service is scraped.

| Scope                     | Key                                  | Data type | Value                 | Description                                                                                                                                                                                                                                                                                     |
| ------------------------- | ------------------------------------ | --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster-wide              |                                      |           |                       | Specify any one of the following three methods to scrape endpoints for metrics.                                                                                                                                                                                                                 |
|                           | `urls`                               | String    | Comma-separated array | HTTP endpoint (Either IP address or valid URL path specified). For example: `urls=[$NODE_IP/metrics]`. (\$NODE_IP is a specific Azure Monitor for containers parameter and can be used instead of node IP address. Must be all uppercase.)                                                      |
|                           | `kubernetes_services`                | String    | Comma-separated array | An array of Kubernetes services to scrape metrics from kube-state-metrics. For example,`kubernetes_services = ["https://metrics-server.kube-system.svc.cluster.local/metrics",http://my-service-dns.my-namespace:9100/metrics]`.                                                                |
|                           | `monitor_kubernetes_pods`            | Boolean   | true or false         | When set to `true` in the cluster-wide settings, Azure Monitor for containers agent will scrape Kubernetes pods across the entire cluster for the following Prometheus annotations:<br> `prometheus.io/scrape:`<br> `prometheus.io/scheme:`<br> `prometheus.io/path:`<br> `prometheus.io/port:` |
|                           | `prometheus.io/scrape`               | Boolean   | true or false         | Enables scraping of the pod. `monitor_kubernetes_pods` must be set to `true`.                                                                                                                                                                                                                   |
|                           | `prometheus.io/scheme`               | String    | http or https         | Defaults to scrapping over HTTP. If necessary, set to `https`.                                                                                                                                                                                                                                  |
|                           | `prometheus.io/path`                 | String    | Comma-separated array | The HTTP resource path on which to fetch metrics from. If the metrics path is not `/metrics`, define it with this annotation.                                                                                                                                                                   |
|                           | `prometheus.io/port`                 | String    | 9102                  | Specify a port to scrape from. If port is not set, it will default to 9102.                                                                                                                                                                                                                     |
|                           | `monitor_kubernetes_pods_namespaces` | String    | Comma-separated array | An allow list of namespaces to scrape metrics from Kubernetes pods.<br> For example, `monitor_kubernetes_pods_namespaces = ["default1", "default2", "default3"]`                                                                                                                                |
| Node-wide                 | `urls`                               | String    | Comma-separated array | HTTP endpoint (Either IP address or valid URL path specified). For example: `urls=[$NODE_IP/metrics]`. (\$NODE_IP is a specific Azure Monitor for containers parameter and can be used instead of node IP address. Must be all uppercase.)                                                      |
| Node-wide or Cluster-wide | `interval`                           | String    | 60s                   | The collection interval default is one minute (60 seconds). You can modify the collection for either the _[prometheus_data_collection_settings.node]_ and/or _[prometheus_data_collection_settings.cluster]_ to time units such as s, m, h.                                                     |
| Node-wide or Cluster-wide | `fieldpass`<br> `fielddrop`          | String    | Comma-separated array | You can specify certain metrics to be collected or not from the endpoint by setting the allow (`fieldpass`) and disallow (`fielddrop`) listing. You must set the allow list first.                                                                                                              |

### Collect metrics form cluster-wide services

To collect of Kubernetes services cluster-wide, configure the Config Map file using the following example.

```
prometheus-data-collection-settings: |- ​
# Custom Prometheus metrics data collection settings
[prometheus_data_collection_settings.cluster] ​
interval = "1m"  ## Valid time units are s, m, h.
fieldpass = ["metric_to_pass1", "metric_to_pass12"] ## specify metrics to pass through ​
fielddrop = ["metric_to_drop"] ## specify metrics to drop from collecting
kubernetes_services = ["http://my-service-dns.my-namespace:9102/metrics"]
```

### Collect metrics form a from a specific URL

To configure scraping of Prometheus metrics from a specific URL across the cluster, configure the Config Map file using the following example.

```
prometheus-data-collection-settings: |- ​
# Custom Prometheus metrics data collection settings
[prometheus_data_collection_settings.cluster] ​
interval = "1m"  ## Valid time units are s, m, h.
fieldpass = ["metric_to_pass1", "metric_to_pass12"] ## specify metrics to pass through ​
fielddrop = ["metric_to_drop"] ## specify metrics to drop from collecting
urls = ["http://myurl:9101/metrics"] ## An array of urls to scrape metrics from
```

### Collect metrics form a DeamonSet

To configure scraping of Prometheus metrics from an agent's DaemonSet for every individual node in the cluster, configure the following in the ConfigMap:

```
prometheus-data-collection-settings: |- ​
# Custom Prometheus metrics data collection settings ​
[prometheus_data_collection_settings.node] ​
interval = "1m"  ## Valid time units are s, m, h.
urls = ["http://$NODE_IP:9103/metrics"] ​
fieldpass = ["metric_to_pass1", "metric_to_pass2"] ​
fielddrop = ["metric_to_drop"] ​
```

> [!NOTE] > \$NODE_IP is a specific Azure Monitor for containers parameter and can be used instead of node IP address. It must be all uppercase.

### Collect metrics from Pods via Annotations

To configure scraping of Prometheus metrics by specifying a pod annotation, perform the following steps:

1. In the Config Map, specify the following:

   ```
   prometheus-data-collection-settings: |- ​
   # Custom Prometheus metrics data collection settings
   [prometheus_data_collection_settings.cluster] ​
   interval = "1m"  ## Valid time units are s, m, h
   monitor_kubernetes_pods = true
   ```

2. Specify the following configuration for pod annotations (optional):

   ```
   - prometheus.io/scrape:"true" #Enable scraping for this pod ​
   - prometheus.io/scheme:"http:" #If the metrics endpoint is secured then you will need to set this to `https`, if not default ‘http’​
   - prometheus.io/path:"/mymetrics" #If the metrics path is not /metrics, define it with this annotation. ​
   - prometheus.io/port:"8000" #If port is not 9102 use this annotation​
   ```

3. Restrict monitoring to specific namespaces (optional):

   If you want to restrict monitoring to specific namespaces for pods that have annotations, for example only include pods dedicated for production workloads, add the namespace filter `monitor_kubernetes_pods_namespaces` specifying the namespaces to scrape from.

   ```
   monitor_kubernetes_pods_namespaces = ["default1", "default2", "default3"]
   ```

## Next steps

- [Configure Azure Monitor for containers Prometheus Integration for AKS on on-premises Kubernetes](container-insights-prometheus-configuration-aks.md)
- [Configure Azure Monitor for containers Prometheus Integration for Azure Red Hat OpenShift](container-insights-prometheus-configuration-aro.md)
- [Query Prometheus Metrics from Azure Monitor](container-insights-prometheus-configuration-query.md)
- [Learn more about configuring the agent collection settings for stdout, stderr, and environmental variables from container workloads](container-insights-agent-config.md)
