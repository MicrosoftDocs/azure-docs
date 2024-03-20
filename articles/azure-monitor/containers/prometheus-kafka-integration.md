---
title: Configure kafka integration for Prometheus metrics in Azure Monitor
description: Describes how to configure kafka monitoring using Prometheus metrics in Azure Monitor to Kubernetes cluster.
ms.topic: conceptual
ms.date: 3/19/2024
ms.reviewer: aul
---
# Apache Kafka
Apache Kafka is an open-source distributed event streaming platform used by high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.
This article describes how to configure Azure Managed Prometheus with AKS to monitor kafka clusters by scraping prometheus metrics. 

## Prerequisites

+ Kafka cluster running on AKS
+ Azure Managed prometheus is enabled on the AKS cluster - [Enable Azure Managed Prometheus on AKS](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)


### Install Kafka Exporter -
Install the [kafka exporter](https://github.com/danielqsj/kafka_exporter/tree/master) as a deployment and service using the following yaml configuration - 

> [!NOTE] 
> The container can be configured with arguments as described in the [Flags](https://github.com/danielqsj/kafka_exporter/tree/master#flags) section.
Please specify the right server address where the kafka server can be reached. For the following configuration, the server address is "my-cluster-kafka-0.my-cluster-kafka-brokers.kafka.svc:9092"

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
Deploy the following service monitor to configure azure managed prometheus addon to scrape prometheus metrics from the exporter
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

Follow the instructions on [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-dashboard-from-grafana-labs)
with Grafana Dashboard ID: 7589  from your grafana instance used during managed prometheus onboarding.
[kafka_exporter grafana dashboard](https://github.com/danielqsj/kafka_exporter#grafana-dashboard)

### Deploy alerts for kafka exporter metrics
1. Deploy the following ARM template to deploy alerts on the kafka-exporter metrics
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "clusterName": {
            "type": "string",
            "metadata": {
                "description": "Cluster name"
            }
        },
        "clusterResourceId": {
            "type": "string",
            "metadata": {
                "description": "Cluster Resource Id"
            }
        },
        "actionGroupResourceId": {
            "type": "string",
            "metadata": {
                "description": "Action Group ResourceId"
            }
        },
        "azureMonitorWorkspaceResourceId": {
            "type": "string",
            "metadata": {
                "description": "ResourceId of Azure Monitor Workspace (AMW) to associate to"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "variables": {
        "kubernetesAlertRuleGroup": "KubernetesAlert-KafkaExporterAlerts",
        "kubernetesAlertRuleGroupName": "[concat(variables('kubernetesAlertRuleGroup'), parameters('clusterName'))]",
        "kubernetesAlertRuleGroupDescription": "Kubernetes Alert RuleGroup-KafkaExporterAlerts",
        "version": " - 0.1"
    },
    "resources": [
        {
            "name": "[variables('kubernetesAlertRuleGroupName')]",
            "type": "Microsoft.AlertsManagement/prometheusRuleGroups",
            "apiVersion": "2023-03-01",
            "location": "[parameters('location')]",
            "properties": {
                "description": "[concat(variables('kubernetesAlertRuleGroupDescription'), variables('version'))]",
                "scopes": [
                    "[parameters('azureMonitorWorkspaceResourceId')]",
                    "[parameters('clusterResourceId')]"
                ],
                "clusterName": "[parameters('clusterName')]",
                "interval": "PT1M",
                "rules": [
                    {
                        "alert": "KafkaUnderReplicatedPartition",
                        "expression": "kafka_topic_partition_under_replicated_partition > 0",
                        "for": "PT5M",
                        "annotations": {
                            "description": "Cluster {{ $labels.cluster}} has under replicated kafka partitions."
                        },
                        "labels": {
                            "severity": "warning"
                        },
                        "enabled": true,
                        "severity": 3,
                        "resolveConfiguration": {
                            "autoResolved": true,
                            "timeToResolve": "PT10M"
                        },
                        "actions": [
                            {
                                "actionGroupId": "[parameters('actionGroupResourceId')]"
                            }
                        ]
                    },
                    {
                        "alert": "KafkaTooLargeConsumerGroupLag",
                        "expression": "sum(kafka_consumergroup_lag) by (consumergroup) > 50",
                        "for": "PT5M",
                        "annotations": {
                            "summary": "Kafka consumers group (instance {{ $labels.instance }})",
                            "description": "Kafka consumers group\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }} Cluster {{ $labels.cluster}}"
                        },
                        "enabled": true,
                        "severity": 3,
                        "resolveConfiguration": {
                            "autoResolved": true,
                            "timeToResolve": "PT10M"
                        },
                        "labels": {
                            "severity": "warning"
                        },
                        "actions": [
                            {
                                "actionGroupId": "[parameters('actionGroupResourceId')]"
                            }
                        ]
                    },
                    {
                        "alert": "KafkaNoMessageForTooLong",
                        "expression": "changes(kafka_topic_partition_current_offset[10m]) == 0",
                        "for": "PT5M",
                        "annotations": {
                            "description": "No messages are seen for more than 10 minutes in Cluster {{ $labels.cluster}}"
                        },
                        "enabled": true,
                        "severity": 4,
                        "resolveConfiguration": {
                            "autoResolved": true,
                            "timeToResolve": "PT10M"
                        },
                        "labels": {
                            "severity": "warning"
                        },
                        "actions": [
                            {
                                "actionGroupId": "[parameters('actionGroupResourceId')]"
                            }
                        ]
                    },
                    {
                        "alert": "KafkaBrokerDown",
                        "expression": "kafka_brokers < 1",
                        "for": "PT5M",
                        "annotations": {
                            "summary": "Kafka broker *{{ $labels.instance }}* alert status",
                            "description": "One or more of the Kafka broker *{{ $labels.instance }}* is down in Cluster {{ $labels.cluster}}"
                        },
                        "enabled": true,
                        "severity": 3,
                        "resolveConfiguration": {
                            "autoResolved": true,
                            "timeToResolve": "PT10M"
                        },
                        "labels": {
                            "severity": "warning"
                        },
                        "actions": [
                            {
                                "actionGroupId": "[parameters('actionGroupResourceId')]"
                            }
                        ]
                    },
                    {
                        "alert": "KafkaTopicsReplicas",
                        "expression": "sum(kafka_topic_partition_in_sync_replica) by (topic) < 1",
                        "for": "PT5M",
                        "annotations": {
                            "summary": "Kafka topics replicas (instance {{ $labels.instance }})",
                            "description": "Kafka topic in-sync partition\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }} Cluster {{ $labels.cluster}}"
                        },
                        "enabled": true,
                        "severity": 4,
                        "resolveConfiguration": {
                            "autoResolved": true,
                            "timeToResolve": "PT15M"
                        },
                        "labels": {
                            "severity": "warning"
                        },
                        "actions": [
                            {
                                "actionGroupId": "[parameters('actionGroupResourceId')]"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```
2. Edit the following values in the parameter file. Retrieve the resource ID of the resources from the **JSON View** of their **Overview** page.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `location` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterResourceId` | Resource ID for the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `clusterName` | Name of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `actionGroupResourceId` | Resource ID for the alert action group. Retrieve from the **JSON view** on the **Overview** page for the action group. Learn more about [action groups](../alerts/action-groups.md) |

3. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md).

> [!Note] 
> Learn more about [Prometheus Alerts](../containers/container-insights-metric-alerts.md#prometheus-alert-rules)



### Additional jmx_exporter metrics using strimzi
If you are using the [strimzi operator](https://github.com/strimzi/strimzi-kafka-operator.git) for deploying the kafka clusters, deploy the pod monitor below to get additional jmx_exporter metrics
Please note that the metrics need to exposed by the kafka cluster deloyments as described [here](https://github.com/strimzi/strimzi-kafka-operator/blob/main/examples/metrics/kafka-metrics.yaml) for the podmonitor to be able to successfully scrape the metrics

```yaml
apiVersion: azmonitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: kafka-resources-metrics
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
> [!NOTE] - If using any other way of exposing the jmx_exporter on your kafka cluster, please follow the instructions [here](prometheus-metrics-scrape-crd.md) on how to configure the pod or service monitors accordingly

### Grafana dashboard for additional jmx metrics
Follow the instructions on [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-dashboard-from-grafana-labs)
with Grafana Dashboard ID: 11962 from your grafana instance used during managed prometheus onboardin


### Troubleshooting
When the service monitors is successfully applied, if you want to make sure that the service monitor targets get picked up by the addon, follow the instructions [here](prometheus-metrics-troubleshoot.md#prometheus-interface) for general troubleshooting of custom resources 

  :::image type="content" source="media/prometheus-metrics-troubleshoot/service-monitor-kafka.png" alt-text="Screenshot showing targets for pod/service monitor" lightbox="media/prometheus-metrics-troubleshoot/service-monitor-kafka.png":::

<!-- ## Next steps

- [Learn more about collecting Prometheus metrics](../essentials/prometheus-metrics-overview.md). -->
