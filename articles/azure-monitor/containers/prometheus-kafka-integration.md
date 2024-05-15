---
title: Configure Kafka integration for Prometheus metrics in Azure Monitor
description: Describes how to configure Kafka monitoring using Prometheus metrics in Azure Monitor to Kubernetes cluster.
ms.topic: conceptual
ms.date: 3/19/2024
ms.reviewer: rashmy
ms.service: azure-monitor
ms.subservice: containers
---
# Apache Kafka
Apache Kafka is an open-source distributed event streaming platform used by high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.
This article describes how to configure Azure Managed Prometheus with Azure Kubernetes Service(AKS) to monitor kafka clusters by scraping prometheus metrics. 

## Prerequisites

+ Kafka cluster running on AKS
+ Azure Managed prometheus enabled on the AKS cluster - [Enable Azure Managed Prometheus on AKS](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)


### Install Kafka Exporter
Install the [Kafka Exporter](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-kafka-exporter) using the helm chart.

```bash
helm install azmon-kafka-exporter --namespace=azmon-kafka-exporter --create-namespace --version 2.10.0 prometheus-community/prometheus-kafka-exporter --set kafkaServer="{kafka-server.namespace.svc:9092,.....}" --set prometheus.serviceMonitor.enabled=true --set prometheus.serviceMonitor.apiVersion=azmonitoring.coreos.com/v1
```

> [!NOTE] 
> Managed prometheus pod/service monitor configuration with helm chart installation is only supported with the helm chart version >=2.10.0.
>
> The [prometheus kafka exporter](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-kafka-exporter) helm chart can be configured with [values](https://github.com/prometheus-community/helm-charts/blob/main/charts/prometheus-kafka-exporter/values.yaml) yaml.
Please specify the right server addresses where the kafka servers can be reached. Set the server address(es) using the argument "kafkaServer".
>
> If you want to configure any other service or pod monitors, please follow the instructions [here](prometheus-metrics-scrape-crd.md#create-a-pod-or-service-monitor).


### Import the Grafana Dashboard

To import the Grafana Dashboards using the ID or JSON, follow the instructions to [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-grafana-dashboard). </br>

[Kafka Exporter Grafana Dashboard](https://grafana.com/grafana/dashboards/7589-kafka-exporter-overview/)(ID-7589)

### Deploy Rules
1. Download the template and parameter files

    **Alerting Rules**
   - [Template file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/Kafka/kafka-alerting-rules.json)
   - [Parameter file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/Alert-Rules-Parameters.json)


2. Edit the following values in the parameter files. Retrieve the resource ID of the resources from the **JSON View** of their **Overview** page.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspace` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `location` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterName` | Name of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `actionGroupId` | Resource ID for the alert action group. Retrieve from the **JSON view** on the **Overview** page for the action group. Learn more about [action groups](../alerts/action-groups.md) |

3. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md).

4. Once deployed, you can view the rules in the Azure portal as described in - [Prometheus Alerts](../essentials/prometheus-rule-groups.md#view-prometheus-rule-groups)

> [!Note] 
> Review the alert thresholds to make sure it suits your cluster/workloads and update it accordingly.
>
> Please note that the above rules are not scoped to a cluster. If you would like to scope the rules to a specific cluster, see [Limiting rules to a specific cluster](../essentials/prometheus-rule-groups.md#limiting-rules-to-a-specific-cluster) for more details.
>
> Learn more about [Prometheus Alerts](../essentials/prometheus-rule-groups.md).
>
> If you want to use any other OSS prometheus alerting/recording rules please use the converter here to create the azure equivalent prometheus rules [az-prom-rules-converter](https://aka.ms/az-prom-rules-converter)


### More jmx_exporter metrics using strimzi
If you are using the [strimzi operator](https://github.com/strimzi/strimzi-kafka-operator.git) for deploying the kafka clusters, deploy the pod monitors to get more jmx_exporter metrics.
> [!Note] 
> Metrics need to be exposed by the kafka cluster deployments like the examples [here](https://github.com/strimzi/strimzi-kafka-operator/tree/main/examples/metrics). Refer to the kafka-.*-metrics.yaml files to configure metrics to be exposed. 
>
>The pod monitors here also assume that the namespace where the kafka workload is deployed in 'kafka'. Update it accordingly if the workloads are deployed in another namespace.

```yaml
apiVersion: azmonitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: azmon-cluster-operator-metrics
  labels:
    app: strimzi
spec:
  selector:
    matchLabels:
      strimzi.io/kind: cluster-operator
  namespaceSelector:
    matchNames:
      - kafka
  podMetricsEndpoints:
  - path: /metrics
    port: http
---
apiVersion: azmonitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: azmon-entity-operator-metrics
  labels:
    app: strimzi
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: entity-operator
  namespaceSelector:
    matchNames:
      - kafka
  podMetricsEndpoints:
  - path: /metrics
    port: healthcheck
---
apiVersion: azmonitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: azmon-bridge-metrics
  labels:
    app: strimzi
spec:
  selector:
    matchLabels:
      strimzi.io/kind: KafkaBridge
  namespaceSelector:
    matchNames:
      - kafka
  podMetricsEndpoints:
  - path: /metrics
    port: rest-api
---
apiVersion: azmonitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: azmon-kafka-resources-metrics
  labels:
    app: strimzi
spec:
  selector:
    matchExpressions:
      - key: "strimzi.io/kind"
        operator: In
        values: ["Kafka", "KafkaConnect", "KafkaMirrorMaker", "KafkaMirrorMaker2"]
  namespaceSelector:
    matchNames:
      - kafka
  podMetricsEndpoints:
  - path: /metrics
    port: tcp-prometheus
    relabelings:
    - separator: ;
      regex: __meta_kubernetes_pod_label_(strimzi_io_.+)
      replacement: $1
      action: labelmap
    - sourceLabels: [__meta_kubernetes_namespace]
      separator: ;
      regex: (.*)
      targetLabel: namespace
      replacement: $1
      action: replace
    - sourceLabels: [__meta_kubernetes_pod_name]
      separator: ;
      regex: (.*)
      targetLabel: kubernetes_pod_name
      replacement: $1
      action: replace
    - sourceLabels: [__meta_kubernetes_pod_node_name]
      separator: ;
      regex: (.*)
      targetLabel: node_name
      replacement: $1
      action: replace
    - sourceLabels: [__meta_kubernetes_pod_host_ip]
      separator: ;
      regex: (.*)
      targetLabel: node_ip
      replacement: $1
      action: replace
```

#### Alerts with strimzi
Rich set of alerts based off of strimzi metrics can also be configured by refering to the [examples](https://github.com/strimzi/strimzi-kafka-operator/blob/main/examples/metrics/prometheus-install/prometheus-rules.yaml).

> [!NOTE] 
> If using any other way of exposing the jmx_exporter on your kafka cluster, please follow the instructions [here](prometheus-metrics-scrape-crd.md) on how to configure the pod or service monitors accordingly.

### Grafana Dashboards for more jmx metrics with strimzi
Please also see the [grafana-dashboards-for-strimzi](https://github.com/strimzi/strimzi-kafka-operator/tree/main/examples/metrics/grafana-dashboards) to view dashboards for metrics exposed by strimzi operator.


### Troubleshooting
When the service monitors or pod monitors are successfully applied, if you want to make sure that the service monitor targets get picked up by the addon, follow the instructions [here](prometheus-metrics-troubleshoot.md#prometheus-interface). 

