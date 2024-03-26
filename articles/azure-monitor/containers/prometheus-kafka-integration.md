---
title: Configure kafka integration for Prometheus metrics in Azure Monitor
description: Describes how to configure kafka monitoring using Prometheus metrics in Azure Monitor to Kubernetes cluster.
ms.topic: conceptual
ms.date: 3/19/2024
ms.reviewer: aul
---
# Apache Kafka
Apache Kafka is an open-source distributed event streaming platform used by high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.
This article describes how to configure Azure Managed Prometheus with Azure Kubernetes Service(AKS) to monitor kafka clusters by scraping prometheus metrics. 

## Prerequisites

+ Kafka cluster running on AKS
+ Azure Managed prometheus enabled on the AKS cluster - [Enable Azure Managed Prometheus on AKS](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)


### Install Kafka Exporter -
Install the [kafka exporter](https://github.com/danielqsj/kafka_exporter/tree/master) as a deployment and service using the following yaml configuration - 

> [!NOTE] 
> The container can be configured with arguments as described in the [Flags](https://github.com/danielqsj/kafka_exporter/tree/master#flags) section.
Please specify the right server address where the kafka server can be reached. For the following configuration, the server address is set to "my-cluster-kafka-0.my-cluster-kafka-brokers.kafka.svc:9092" using the argument "kafka.server"

```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: azmon-kafka-exporter
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: azmon-kafka-exporter
  labels:
    app.kubernetes.io/instance: azmon-kafka-exporter
    app.kubernetes.io/name: azmon-kafka-exporter
  namespace: azmon-kafka-exporter
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/instance: azmon-kafka-exporter
      app.kubernetes.io/name: azmon-kafka-exporter
  template:
    metadata:
      labels:
        app.kubernetes.io/instance: azmon-kafka-exporter
        app.kubernetes.io/name: azmon-kafka-exporter
    spec:
      containers:
      - name: azmon-kafka-exporter
        args:
        - --kafka.server=my-cluster-kafka-0.my-cluster-kafka-brokers.kafka.svc:9092
        image: danielqsj/kafka-exporter:latest
        imagePullPolicy: IfNotPresent
        livenessProbe:
          failureThreshold: 1
          httpGet:
            path: /healthz
            port: metrics
            scheme: HTTP
          initialDelaySeconds: 3
          periodSeconds: 30
          successThreshold: 1
          timeoutSeconds: 9
        ports:
        - containerPort: 9308
          name: metrics
          protocol: TCP
        readinessProbe:
          failureThreshold: 1
          httpGet:
            path: /healthz
            port: metrics
            scheme: HTTP
          initialDelaySeconds: 3
          periodSeconds: 15
          successThreshold: 1
          timeoutSeconds: 9
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/os
                    operator: In
                    values:
                      - linux
---
apiVersion: v1
kind: Service
metadata:
  name: azmon-kafka-exporter
  namespace: azmon-kafka-exporter
  labels:
    app.kubernetes.io/name: azmon-kafka-exporter
    app.kubernetes.io/instance: azmon-kafka-exporter
spec:
  type: ClusterIP
  ports:
    - port: 9308
      targetPort: metrics
      protocol: TCP
      name: metrics
  selector:
    app.kubernetes.io/name: azmon-kafka-exporter
    app.kubernetes.io/instance: azmon-kafka-exporter
```

Once deployed, verify that the service is able to export metrics by running the command - 
```bash
kubectl port-forward svc/azmon-kafka-exporter -n azmon-kafka-exporter 9308
```

### Deploy Service Monitor
Deploy the following service monitor to configure azure managed prometheus addon to scrape prometheus metrics from the exporter.
```yaml
apiVersion: azmonitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: azmon-kafka-exporter-svc-monitor
  namespace: azmon-kafka-exporter
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: azmon-kafka-exporter
  namespaceSelector:
    matchNames:
    - azmon-kafka-exporter
  endpoints:
  - port: metrics
    interval: 30s
  ```

### Import the Grafana Dashboard

To import the grafana dashboards using the ID or JSON, follow the instructions to [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-grafana-dashboard). </br>

[kafka_exporter grafana dashboard](https://grafana.com/grafana/dashboards/7589-kafka-exporter-overview/)(ID-7589)

### Deploy Rules
1. Deploy the following alerting rules to alert based on the metrics ingested.

[Alerting Rules](https://github.com/Azure/prometheus-collector/blob/rashmi/rules/Azure-ARM-templates/Workload-Rules/Kafka/kafka-alerting-rules.json)

2. Edit the following values in the parameter files for the [alerting rules](https://github.com/Azure/prometheus-collector/blob/rashmi/rules/Azure-ARM-templates/Workload-Rules/Alert-Rules-Parameters.json). Retrieve the resource ID of the resources from the **JSON View** of their **Overview** page.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `location` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterName` | Name of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `actionGroupResourceId` | Resource ID for the alert action group. Retrieve from the **JSON view** on the **Overview** page for the action group. Learn more about [action groups](../alerts/action-groups.md) |

3. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md).

4. Once deployed, you can view the rules in the Azure Portal as described in - [Prometheus Alerts](../essentials/prometheus-rule-groups.md#view-prometheus-rule-groups)

> [!Note] 
> Review the alert thresholds to make sure it suits your cluster/worklaods and update it accordingly.</br>
> Learn more about [Prometheus Alerts](../essentials/prometheus-rule-groups.md).</br>
> If you want to use any other OSS prometheus alerting/recording rules please use the converter here to create the azure equivalent prometheus rules [az-prom-rules-converter](https://aka.ms/az-prom-rules-converter).</br>
> Please note that the above rules are not scoped to a cluster. If you would like to scope the rules to a specific cluster, see [Limiting rules to a specific cluster](../essentials/prometheus-rule-groups.md#limiting-rules-to-a-specific-cluster) for more details.


### More jmx_exporter metrics using strimzi
If you are using the [strimzi operator](https://github.com/strimzi/strimzi-kafka-operator.git) for deploying the kafka clusters, deploy the pod monitors to get more jmx_exporter metrics.
Note that the metrics need to exposed by the kafka cluster deployments like the examples [here](https://github.com/strimzi/strimzi-kafka-operator/tree/main/examples/metrics). Refer to the kafka-.*-metrics.yaml files to configure metrics to be exposed. 
The pod monitors here also assume that the namespace where the kafka workload is deployed in 'kafka'. Update it accordingly if the workloads are deployed in another namespace.

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
> [!NOTE] 
> If using any other way of exposing the jmx_exporter on your kafka cluster, please follow the instructions [here](prometheus-metrics-scrape-crd.md) on how to configure the pod or service monitors accordingly.

### Grafana dashboard for more jmx metrics
Please also see the [grafana-dashboards-for-strimzi](https://github.com/strimzi/strimzi-kafka-operator/tree/main/examples/metrics/grafana-dashboards) to view dashboards for metrics exposed by strimzi operator.


### Troubleshooting
When the service monitors or pod monitors are successfully applied, if you want to make sure that the service monitor targets get picked up by the addon, follow the instructions [here](prometheus-metrics-troubleshoot.md#prometheus-interface). 

  :::image type="content" source="media/prometheus-metrics-troubleshoot/service-monitor-kafka.png" alt-text="Screenshot showing targets for pod/service monitor" lightbox="media/prometheus-metrics-troubleshoot/service-monitor-kafka.png":::

