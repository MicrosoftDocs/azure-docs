---
title: Configure elastic search integration for Prometheus metrics in Azure Monitor
description: Describes how to configure elastic search monitoring using Prometheus metrics in Azure Monitor to Kubernetes cluster.
ms.topic: conceptual
ms.date: 3/19/2024
ms.reviewer: rashmy
---
# ElasticSearch
Elasticsearch is the distributed search and analytics engine at the heart of the Elastic Stack. It is where the indexing, search, and analysis magic happen.
This article describes how to configure Azure Managed Prometheus with Azure Kubernetes Service(AKS) to monitor elastic search clusters by scraping prometheus metrics. 

## Prerequisites

+ ElasticSearch cluster running on AKS
+ Azure Managed prometheus enabled on the AKS cluster - [Enable Azure Managed Prometheus on AKS](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)


### Install Elastic Search Exporter -
Install the [elastic search exporter](https://github.com/prometheus-community/elasticsearch_exporter) as a deployment using the following yaml configuration - 

> [!NOTE] 
> The container can be configured with arguments as described in the [Flags](https://github.com/prometheus-community/elasticsearch_exporter#configuration) section.
Please specify the right server address where the elasticsearch server can be reached. Based on your configuration set the username,password or certs used to authenticate with the elasticsearch server. For the following configuration, the server address is set to "quickstart-es-internal-http" using the argument "es.uri"

```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: azmon-elasticsearch-exporter
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: azmon-elasticsearch-exporter
  labels:
    app.kubernetes.io/instance: azmon-elasticsearch-exporter
    app.kubernetes.io/name: azmon-elasticsearch-exporter
  namespace: azmon-elasticsearch-exporter
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/instance: azmon-elasticsearch-exporter
      app.kubernetes.io/name: azmon-elasticsearch-exporter
  template:
    metadata:
      labels:
        app.kubernetes.io/instance: azmon-elasticsearch-exporter
        app.kubernetes.io/name: azmon-elasticsearch-exporter
    spec:
      containers:
      - name: azmon-elasticsearch-exporter
        command: ["elasticsearch_exporter",
        "--es.uri=https://username:password@quickstart-es-internal-http.namespace:9200",
        "--web.listen-address=:9108",
        "--web.telemetry-path=/metrics"]
        image: quay.io/prometheuscommunity/elasticsearch-exporter:latest
        imagePullPolicy: IfNotPresent
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sleep
              - "20"
        ports:
        - containerPort: 9108
          name: metrics
          protocol: TCP
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/os
                    operator: In
                    values:
                      - linux
```
### Deploy Pod Monitor
Deploy the following pod monitor to configure azure managed prometheus addon to scrape prometheus metrics from the exporter.
```yaml
apiVersion: azmonitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: azmon-elasticsearch-exporter-pod-monitor
  namespace: azmon-elasticsearch-exporter
spec:
  labelLimit: 63
  labelNameLengthLimit: 511
  labelValueLengthLimit: 1023
  selector:
    matchLabels:
      app.kubernetes.io/name: azmon-elasticsearch-exporter
  namespaceSelector:
    matchNames:
    - azmon-elasticsearch-exporter
  podMetricsEndpoints:
  - port: metrics
    interval: 30s
  ```


### Deploy Rules
1. Download the template and parameter files

    **Recording Rules**
   - [Template file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/ElasticSearch/elasticsearch-recording-rules.json)
   - [Parameter file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/Recording-Rules-Parameters.json)

    **Alerting Rules**
   - [Template file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/ElasticSearch/elasticsearch-alerting-rules.json)
   - [Parameter file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/Alert-Rules-Parameters.json)


2. Edit the following values in the parameter files. Retrieve the resource ID of the resources from the **JSON View** of their **Overview** page.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspace` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `location` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterName` | Name of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `actionGroupId` | Resource ID for the alert action group. Retrieve from the **JSON view** on the **Overview** page for the action group. Learn more about [action groups](../alerts/action-groups.md) |

3. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md).

4. Once deployed, you can view the rules in the Azure Portal as described in - [Prometheus Alerts](../essentials/prometheus-rule-groups.md#view-prometheus-rule-groups)

> [!Note] 
> 1. Review the alert thresholds to make sure it suits your cluster/worklaods and update it accordingly.</br>
> 2. Please note that the above rules are not scoped to a cluster. If you would like to scope the rules to a specific cluster, see [Limiting rules to a specific cluster](../essentials/prometheus-rule-groups.md#limiting-rules-to-a-specific-cluster) for more details.</br>
> 3. Learn more about [Prometheus Alerts](../essentials/prometheus-rule-groups.md).</br>
> 4. If you want to use any other OSS prometheus alerting/recording rules please use the converter here to create the azure equivalent prometheus rules [az-prom-rules-converter](https://aka.ms/az-prom-rules-converter)

### Import the Grafana Dashboard

Follow the instructions on [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-grafana-dashboard) to import the grafana dashboards using the ID or JSON.</br>

[Elastic Search Overview](https://github.com/grafana/jsonnet-libs/blob/master/elasticsearch-mixin/dashboards/elasticsearch-overview.json)(ID-2322)</br>
[Elasticsearch Exporter Quickstart and Dashboard](https://grafana.com/grafana/dashboards/14191-elasticsearch-overview/)(ID-14191)


### Troubleshooting
When the service monitors is successfully applied, if you want to make sure that the service monitor targets get picked up by the addon, follow the instructions [here](prometheus-metrics-troubleshoot.md#prometheus-interface). 

