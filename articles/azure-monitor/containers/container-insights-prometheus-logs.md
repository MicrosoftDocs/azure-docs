---
title: Collect Prometheus metrics with Container insights
description: Describes different methods for configuring the Container insights agent to scrape Prometheus metrics from your Kubernetes cluster.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 03/01/2023
ms.reviewer: aul
---

# Send Prometheus metrics to Log Analytics workspace with Container insights
This article describes how to send Prometheus metrics from your Kubernetes cluster monitored by Container insights to a Log Analytics workspace. Before you perform this configuration, you should first ensure that you're [scraping Prometheus metrics from your cluster using Azure Monitor managed service for Prometheus](), which is the recommended method for monitoring your clusters. Use the configuration described in this article only if you also want to send this same data to a Log Analytics workspace where you can analyze it using [log queries](../logs/log-query-overview.md) and [log alerts](../alerts/alerts-log-query.md).

This configuration requires configuring the *monitoring addon* for the Azure Monitor agent, which is the same one used by Container insights to send data to a Log Analytics workspace. It requires exposing the Prometheus metrics endpoint through your exporters or pods and then configuring the monitoring addon for the Azure Monitor agent used by Container insights as shown the following diagram. 


:::image type="content" source="media/container-insights-prometheus/monitoring-kubernetes-architecture.png" lightbox="media/container-insights-prometheus/monitoring-kubernetes-architecture.png" alt-text="Diagram of container monitoring architecture sending Prometheus metrics to Azure Monitor Logs." border="false":::


## Prometheus scraping settings (for metrics stored as logs)

Active scraping of metrics from Prometheus is performed from one of two perspectives below and metrics are sent to configured log analytics workspace :

- **Cluster-wide**: Defined in the ConfigMap section *[Prometheus data_collection_settings.cluster]*.
- **Node-wide**: Defined in the ConfigMap section *[Prometheus_data_collection_settings.node]*.

| Endpoint | Scope | Example |
|----------|-------|---------|
| Pod annotation | Cluster-wide | `prometheus.io/scrape: "true"` <br>`prometheus.io/path: "/mymetrics"` <br>`prometheus.io/port: "8000"` <br>`prometheus.io/scheme: "http"` |
| Kubernetes service | Cluster-wide | `http://my-service-dns.my-namespace:9100/metrics` <br>`http://metrics-server.kube-system.svc.cluster.local/metrics`​ |
| URL/endpoint | Per-node and/or cluster-wide | `http://myurl:9101/metrics` |

When a URL is specified, Container insights only scrapes the endpoint. When Kubernetes service is specified, the service name is resolved with the cluster DNS server to get the IP address. Then the resolved service is scraped.

|Scope | Key | Data type | Value | Description |
|------|-----|-----------|-------|-------------|
| Cluster-wide | | | | Specify any one of the following three methods to scrape endpoints for metrics. |
| | `urls` | String | Comma-separated array | HTTP endpoint (either IP address or valid URL path specified). For example: `urls=[$NODE_IP/metrics]`. ($NODE_IP is a specific Container insights parameter and can be used instead of a node IP address. Must be all uppercase.) |
| | `kubernetes_services` | String | Comma-separated array | An array of Kubernetes services to scrape metrics from kube-state-metrics. Fully qualified domain names must be used here. For example,`kubernetes_services = ["http://metrics-server.kube-system.svc.cluster.local/metrics",http://my-service-dns.my-namespace.svc.cluster.local:9100/metrics]`|
| | `monitor_kubernetes_pods` | Boolean | true or false | When set to `true` in the cluster-wide settings, the Container insights agent scrapes Kubernetes pods across the entire cluster for the following Prometheus annotations:<br> `prometheus.io/scrape:`<br> `prometheus.io/scheme:`<br> `prometheus.io/path:`<br> `prometheus.io/port:` |
| | `prometheus.io/scrape` | Boolean | true or false | Enables scraping of the pod, and `monitor_kubernetes_pods` must be set to `true`. |
| | `prometheus.io/scheme` | String | http | Defaults to scraping over HTTP. | 
| | `prometheus.io/path` | String | Comma-separated array | The HTTP resource path from which to fetch metrics. If the metrics path isn't `/metrics`, define it with this annotation. |
| | `prometheus.io/port` | String | 9102 | Specify a port to scrape from. If the port isn't set, it defaults to 9102. |
| | `monitor_kubernetes_pods_namespaces` | String | Comma-separated array | An allowlist of namespaces to scrape metrics from Kubernetes pods.<br> For example, `monitor_kubernetes_pods_namespaces = ["default1", "default2", "default3"]` |
| Node-wide | `urls` | String | Comma-separated array | HTTP endpoint (either IP address or valid URL path specified). For example: `urls=[$NODE_IP/metrics]`. ($NODE_IP is a specific Container insights parameter and can be used instead of a node IP address. Must be all uppercase.) |
| Node-wide or cluster-wide | `interval` | String | 60s | The collection interval default is one minute (60 seconds). You can modify the collection for either the *[prometheus_data_collection_settings.node]* and/or *[prometheus_data_collection_settings.cluster]* to time units such as s, m, and h. |
| Node-wide or cluster-wide | `fieldpass`<br> `fielddrop`| String | Comma-separated array | You can specify certain metrics to be collected or not from the endpoint by setting the allow (`fieldpass`) and disallow (`fielddrop`) listing. You must set the allowlist first. |

## Configure ConfigMaps to specify Prometheus scrape configuration (for metrics stored as logs)
Perform the following steps to configure your ConfigMap configuration file for your cluster. ConfigMaps is a global list and there can be only one ConfigMap applied to the agent. You can't have another ConfigMaps overruling the collections.



1. [Download](https://aka.ms/container-azm-ms-agentconfig) the template ConfigMap YAML file and save it as c*ontainer-azm-ms-agentconfig.yaml*. If you've already deployed a ConfigMap to your cluster and you want to update it with a newer configuration, you can edit the ConfigMap file you've previously used. 
1. Edit the ConfigMap YAML file with your customizations to scrape Prometheus metrics.


    ### [Cluster-wide](#tab/cluster-wide)

    To collect Kubernetes services cluster-wide, configure the ConfigMap file by using the following example:

    ```
    prometheus-data-collection-settings: |- ​
    # Custom Prometheus metrics data collection settings
    [prometheus_data_collection_settings.cluster] ​
    interval = "1m"  ## Valid time units are s, m, h.
    fieldpass = ["metric_to_pass1", "metric_to_pass12"] ## specify metrics to pass through ​
    fielddrop = ["metric_to_drop"] ## specify metrics to drop from collecting
    kubernetes_services = ["http://my-service-dns.my-namespace:9102/metrics"]
    ```

    ### [Specific URL](#tab/url)

    To configure scraping of Prometheus metrics from a specific URL across the cluster, configure the ConfigMap file by using the following example:

    ```
    prometheus-data-collection-settings: |- ​
    # Custom Prometheus metrics data collection settings
    [prometheus_data_collection_settings.cluster] ​
    interval = "1m"  ## Valid time units are s, m, h.
    fieldpass = ["metric_to_pass1", "metric_to_pass12"] ## specify metrics to pass through ​
    fielddrop = ["metric_to_drop"] ## specify metrics to drop from collecting
    urls = ["http://myurl:9101/metrics"] ## An array of urls to scrape metrics from
    ```

    ### [DaemonSet](#tab/deamonset)

    To configure scraping of Prometheus metrics from an agent's DaemonSet for every individual node in the cluster, configure the following example in the ConfigMap:

    ```
    prometheus-data-collection-settings: |- ​
    # Custom Prometheus metrics data collection settings ​
    [prometheus_data_collection_settings.node] ​
    interval = "1m"  ## Valid time units are s, m, h. 
    urls = ["http://$NODE_IP:9103/metrics"] ​
    fieldpass = ["metric_to_pass1", "metric_to_pass2"] ​
    fielddrop = ["metric_to_drop"] ​
    ```

    `$NODE_IP` is a specific Container insights parameter and can be used instead of a node IP address. It must be all uppercase.

    ### [Pod annotation](#tab/pod)

    To configure scraping of Prometheus metrics by specifying a pod annotation:

      1. In the ConfigMap, specify the following configuration:

    ```
    prometheus-data-collection-settings: |- ​
    # Custom Prometheus metrics data collection settings
    [prometheus_data_collection_settings.cluster] ​
    interval = "1m"  ## Valid time units are s, m, h
    monitor_kubernetes_pods = true 
    ```

      2. Specify the following configuration for pod annotations:

    ```
    - prometheus.io/scrape:"true" #Enable scraping for this pod ​
    - prometheus.io/scheme:"http" #If the metrics endpoint is secured then you will need to set this to `https`, if not default ‘http’​
    - prometheus.io/path:"/mymetrics" #If the metrics path is not /metrics, define it with this annotation. ​
    - prometheus.io/port:"8000" #If port is not 9102 use this annotation​
    ```
	
    If you want to restrict monitoring to specific namespaces for pods that have annotations, for example, only include pods dedicated for production workloads, set the `monitor_kubernetes_pod` to `true` in ConfigMap. Then add the namespace filter `monitor_kubernetes_pods_namespaces` to specify the namespaces to scrape from. An example is `monitor_kubernetes_pods_namespaces = ["default1", "default2", "default3"]`.

2. Run the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.
    
    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`.

The configuration change can take a few minutes to finish before taking effect. All ama-logs pods in the cluster will restart. When the restarts are finished, a message appears that's similar to the following and includes the result `configmap "container-azm-ms-agentconfig" created`.


## Verify configuration

To verify the configuration was successfully applied to a cluster, use the following command to review the logs from an agent pod: `kubectl logs ama-logs-fdf58 -n=kube-system`.


If there are configuration errors from the Azure Monitor Agent pods, the output shows errors similar to the following example:

``` 
***************Start Config Processing******************** 
config::unsupported/missing config schema version - 'v21' , using defaults
```

Errors related to applying configuration changes are also available for review. The following options are available to perform additional troubleshooting of configuration changes and scraping of Prometheus metrics:

- From an agent pod logs using the same `kubectl logs` command.

- From Live Data. Live Data logs show errors similar to the following example:

    ```
    2019-07-08T18:55:00Z E! [inputs.prometheus]: Error in plugin: error making HTTP request to http://invalidurl:1010/metrics: Get http://invalidurl:1010/metrics: dial tcp: lookup invalidurl on 10.0.0.10:53: no such host
    ```

- From the **KubeMonAgentEvents** table in your Log Analytics workspace. Data is sent every hour with *Warning* severity for scrape errors and *Error* severity for configuration errors. If there are no errors, the entry in the table has data with severity *Info*, which reports no errors. The **Tags** property contains more information about the pod and container ID on which the error occurred and also the first occurrence, last occurrence, and count in the last hour.
- For Azure Red Hat OpenShift v3.x and v4.x, check the Azure Monitor Agent logs by searching the **ContainerLog** table to verify if log collection of openshift-azure-logging is enabled.

Errors prevent Azure Monitor Agent from parsing the file, causing it to restart and use the default configuration. After you correct the errors in ConfigMap on clusters other than Azure Red Hat OpenShift v3.x, save the YAML file and apply the updated ConfigMaps by running the command `kubectl apply -f <configmap_yaml_file.yaml`.

For Azure Red Hat OpenShift v3.x, edit and save the updated ConfigMaps by running the command `oc edit configmaps container-azm-ms-agentconfig -n openshift-azure-logging`.

## Query Prometheus metrics data

To view Prometheus metrics scraped by Azure Monitor and any configuration/scraping errors reported by the agent, review [Query Prometheus metrics data](container-insights-log-query.md#prometheus-metrics).

## View Prometheus metrics in Grafana

Container insights supports viewing metrics stored in your Log Analytics workspace in Grafana dashboards. We've provided a template that you can download from Grafana's [dashboard repository](https://grafana.com/grafana/dashboards?dataSource=grafana-azure-monitor-datasource&category=docker). Use the template to get started and reference it to help you learn how to query other data from your monitored clusters to visualize in custom Grafana dashboards.


## Next steps

- [See the default configuration for Prometheus metrics](../essentials/prometheus-metrics-scrape-default.md).
- [Customize Prometheus metric scraping for the cluster](../essentials/prometheus-metrics-scrape-configuration.md).
