---
title: Deploy observability resources
description: How to get started with configuring observability features with a script in Azure IoT Operations, so that you can monitor your solution.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/22/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data on the health of my industrial assets and edge environment.
---

# Deploy observability resources and set up logs

Observability provides visibility into every layer of your Azure IoT Operations configuration. It gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards that are hosted in Azure. These dashboards are powered by Azure Monitor managed service for Prometheus and by Container Insights. This guide shows you how to set up Azure Managed Prometheus and Grafana and enable monitoring for your Azure Arc cluster.

Complete the steps in this article *before* deploying Azure IoT Operations to your cluster.

## Prerequisites

* An Arc-enabled Kubernetes cluster.
* Azure CLI installed on your cluster machine. For instructions, see [How to install the Azure CLI](/cli/azure/install-azure-cli).
* Helm installed on your cluster machine. For instructions, see [Install Helm](https://helm.sh/docs/intro/install/).
* Kubectl installed on your cluster machine. For instructions, see [Install Kubernetes tools](https://kubernetes.io/docs/tasks/tools/).

## Create resources in Azure

1. Register providers with the subscription where your cluster is located.

   >[!NOTE]
   >This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az account set -s <SUBSCRIPTION_ID>
   az provider register --namespace Microsoft.AlertsManagement
   az provider register --namespace Microsoft.Monitor
   az provider register --namespace Microsoft.Dashboard
   az provider register --namespace Microsoft.Insights
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Install Azure CLI extensions for Metrics collection for Azure Arc-enabled clusters and Azure Managed Grafana.

   ```azurecli
   az extension add --name k8s-extension
   az extension add --name amg
   ```

1. Create an Azure Monitor workspace to enable metric collection for your Azure Arc-enabled Kubernetes cluster.

   ```azurecli
   az monitor account create --name <WORKSPACE_NAME> --resource-group <RESOURCE_GROUP> --location <LOCATION> --query id -o tsv
   ```

   Save the Azure Monitor workspace ID from the output of this command. You use the ID when you enable metrics collection in the next section.

1. Create an Azure Managed Grafana instance to visualize your Prometheus metrics.

   ```azurecli
   az grafana create --name <GRAFANA_NAME> --resource-group <RESOURCE_GROUP> --query id -o tsv
   ```

   Save the Grafana ID from the output of this command. You use the ID when you enable metrics collection in the next section.

1. Create a Log Analytics workspace for Container Insights.

   ```azurecli
   az monitor log-analytics workspace create -g <RESOURCE_GROUP> -n <LOGS_WORKSPACE_NAME> --query id -o tsv
   ```

   Save the Log Analytics workspace ID from the output of this command. You use the ID when you enable metrics collection in the next section.

## Enable metrics collection for the cluster

Update the Azure Arc cluster to collect metrics and send them to the previously created Azure Monitor workspace. You also link this workspace with the Grafana instance.

```azurecli
az k8s-extension create --name azuremonitor-metrics --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers.Metrics --configuration-settings azure-monitor-workspace-resource-id=<AZURE_MONITOR_WORKSPACE_ID> grafana-resource-id=<GRAFANA_ID>
```

Enable Container Insights logs for logs collection.

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings logAnalyticsWorkspaceResourceID=<LOG_ANALYTICS_WORKSPACE_ID>
```

Once these steps are completed, you have both Azure Monitor and Grafana set up and linked to your cluster for observability and metric collection.


## Deploy OpenTelemetry Collector

Define and deploy an [OpenTelemetry (OTel) Collector](https://opentelemetry.io/docs/collector/) to your Arc-enabled Kubernetes cluster.

1. Create a file called `otel-collector-values.yaml` and paste the following code into it to define an OpenTelemetry Collector:

   ```yml
   mode: deployment
   fullnameOverride: aio-otel-collector
   image:
     repository: otel/opentelemetry-collector
     tag: 0.107.0
   config:
     processors:
       memory_limiter:
         limit_percentage: 80
         spike_limit_percentage: 10
         check_interval: '60s'
     receivers:
       jaeger: null
       prometheus: null
       zipkin: null
       otlp:
         protocols:
           grpc:
             endpoint: ':4317'
           http:
             endpoint: ':4318'
     exporters:
       prometheus:
         endpoint: ':8889'
         resource_to_telemetry_conversion:
           enabled: true
         add_metric_suffixes: false
     service:
       extensions:
         - health_check
       pipelines:
         metrics:
           receivers:
             - otlp
           exporters:
             - prometheus
         logs: null
         traces: null
       telemetry: null
     extensions:
       memory_ballast:
         size_mib: 0
   resources:
     limits:
       cpu: '100m'
       memory: '512Mi'
   ports:
     metrics:
       enabled: true
       containerPort: 8889
       servicePort: 8889
       protocol: 'TCP'
     jaeger-compact:
       enabled: false
     jaeger-grpc:
       enabled: false
     jaeger-thrift:
       enabled: false
     zipkin:
       enabled: false
   ```

1. In the `otel-collector-values.yaml` file, make a note of the following values that you use in the `az iot ops create` command when you deploy Azure IoT Operations on the cluster:

   * **fullnameOverride**
   * **grpc.endpoint**
   * **check_interval**

1. Save and close the file.

1. Deploy the collector by running the following commands:

   ```shell
   kubectl get namespace azure-iot-operations || kubectl create namespace azure-iot-operations
   helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts

   helm repo update
   helm upgrade --install aio-observability open-telemetry/opentelemetry-collector -f otel-collector-values.yaml --namespace azure-iot-operations
   ```

## Configure Prometheus metrics collection

Configure Prometheus metrics collection on your cluster.

1. Create a file named `ama-metrics-prometheus-config.yaml` and paste the following configuration:

   ```yml
   apiVersion: v1
   data:
     prometheus-config: |2-
       scrape_configs:
         - job_name: otel
           scrape_interval: 1m
           static_configs:
             - targets:
               - aio-otel-collector.azure-iot-operations.svc.cluster.local:8889
         - job_name: aio-annotated-pod-metrics
           kubernetes_sd_configs:
             - role: pod
           relabel_configs:
             - action: drop
               regex: true
               source_labels:
                 - __meta_kubernetes_pod_container_init
             - action: keep
               regex: true
               source_labels:
                 - __meta_kubernetes_pod_annotation_prometheus_io_scrape
             - action: replace
               regex: ([^:]+)(?::\\d+)?;(\\d+)
               replacement: $1:$2
               source_labels:
                 - __address__
                 - __meta_kubernetes_pod_annotation_prometheus_io_port
               target_label: __address__
             - action: replace
               source_labels:
                 - __meta_kubernetes_namespace
               target_label: kubernetes_namespace
             - action: keep
               regex: 'azure-iot-operations'
               source_labels:
                 - kubernetes_namespace
           scrape_interval: 1m
   kind: ConfigMap
   metadata:
     name: ama-metrics-prometheus-config
     namespace: kube-system
   ```

1. Apply the configuration file by running the following command:

   ```shell
   kubectl apply -f ama-metrics-prometheus-config.yaml
   ```

## Deploy dashboards to Grafana

Azure IoT Operations provides a [sample dashboard](https://github.com/Azure/azure-iot-operations/tree/main/samples/grafana-dashboard) designed to give you many of the visualizations you need to understand the health and performance of your Azure IoT Operations deployment.

Complete the following steps to install the Azure IoT Operations curated Grafana dashboards.

1. Clone or download the **azure-iot-operations** repository to get the sample Grafana Dashboard json file locally: [https://github.com/Azure/azure-iot-operations](https://github.com/Azure/azure-iot-operations).

1. Sign in to the Grafana console. You can access the console through the Azure portal or use the `az grafana show` command to retrieve the URL.

   ```azurecli-interactive
   az grafana show --name <GRAFANA_NAME> --resource-group <RESOURCE_GROUP> --query url -o tsv
   ```

1. In the Grafana application, select the **+** icon.

1. Select **Import dashboard**.

1. Browse to the sample dashboard directory in your local copy of the Azure IoT Operations repository, **azure-iot-operations** > **samples** > **grafana-dashboard**, then select the  `aio.sample.json` dashboard file.

1. When the application prompts, select your managed Prometheus data source.

1. Select **Import**.
