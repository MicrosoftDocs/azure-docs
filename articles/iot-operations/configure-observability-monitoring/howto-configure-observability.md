---
title: Deploy observability resources
description: Learn how to deploy Azure IoT Operations observability resources, configure Prometheus metrics, and set up Grafana dashboards to monitor your industrial IoT solution effectively.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 01/27/2026

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data on the health of my industrial assets and edge environment.
---

# Deploy observability resources and set up logs

Azure IoT Operations observability provides visibility into every layer of your configuration and gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards hosted in Azure, powered by Azure Monitor managed service for Prometheus and Container Insights.

This article shows you how to deploy Azure IoT Operations observability resources, set up Azure Managed Prometheus and Grafana, and enable comprehensive monitoring for your Azure Arc cluster.

## Prerequisites

* An Arc-enabled Kubernetes cluster.
* Azure CLI installed on your cluster machine. For instructions, see [How to install the Azure CLI](/cli/azure/install-azure-cli).
* Helm installed on your cluster machine. For instructions, see [Install Helm](https://helm.sh/docs/intro/install/).
* Kubectl installed on your cluster machine. For instructions, see [Install Kubernetes tools](https://kubernetes.io/docs/tasks/tools/).

## Create resources in Azure

1. Register providers with the subscription where your cluster is located.

   > [!NOTE]
   > Run this step only once per subscription. To register resource providers, you need permission to perform the `/register/action` operation, which is included in the subscription **Contributor** and **Owner** roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az account set -s <SUBSCRIPTION_ID>
   az provider register --namespace Microsoft.AlertsManagement
   az provider register --namespace Microsoft.Monitor
   az provider register --namespace Microsoft.Dashboard
   az provider register --namespace Microsoft.Insights
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Install Azure CLI extensions for Metrics collection for Azure Arc-enabled clusters and Azure Managed Grafana:

   ```azurecli
   az extension add --upgrade --name k8s-extension
   az extension add --upgrade --name amg
   ```

1. Create an Azure Monitor workspace to enable metric collection for your Azure Arc-enabled Kubernetes cluster:

   ```azurecli
   az monitor account create --name <WORKSPACE_NAME> --resource-group <RESOURCE_GROUP> --location <LOCATION> --query id -o tsv
   ```

   Save the Azure Monitor workspace ID from the output of this command. You use the ID when you enable metrics collection in the next section.

1. Create an Azure Managed Grafana instance to visualize your Prometheus metrics:

   ```azurecli
   az grafana create --name <GRAFANA_NAME> --resource-group <RESOURCE_GROUP> --query id -o tsv
   ```

   Save the Grafana ID from the output of this command. You use the ID when you enable metrics collection in the next section.

1. Create a Log Analytics workspace for Container Insights:

   ```azurecli
   az monitor log-analytics workspace create -g <RESOURCE_GROUP> -n <LOGS_WORKSPACE_NAME> --query id -o tsv
   ```

   Save the Log Analytics workspace ID from the output of this command. You use the ID when you enable metrics collection in the next section.

## Enable metrics collection for the cluster

Update the Azure Arc cluster to collect metrics and send them to the Azure Monitor workspace that you created. You also link this workspace to the Grafana instance:

```azurecli
az k8s-extension create --name azuremonitor-metrics --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers.Metrics --configuration-settings azure-monitor-workspace-resource-id=<AZURE_MONITOR_WORKSPACE_ID> grafana-resource-id=<GRAFANA_ID>
```

Enable Container Insights logs for logs collection:

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings logAnalyticsWorkspaceResourceID=<LOG_ANALYTICS_WORKSPACE_ID>
```

After you complete these steps, you have both Azure Monitor and Grafana set up and linked to your cluster for observability and metric collection.


## Deploy OpenTelemetry Collector

Define and deploy an [OpenTelemetry (OTel) Collector](https://opentelemetry.io/docs/collector/) to your Arc-enabled Kubernetes cluster.

1. Create a file called `otel-collector-values.yaml` and paste the following code into it to define an OpenTelemetry Collector:

   ```yaml
   mode: deployment
   fullnameOverride: aio-otel-collector
   image:
     repository: otel/opentelemetry-collector
     tag: 0.143.0

   config:
     processors:
       memory_limiter:
         limit_percentage: 80
         spike_limit_percentage: 10
         check_interval: 60s

     receivers:
       otlp:
         protocols:
           grpc:
             endpoint: ":4317"
           http:
             endpoint: ":4318"

     exporters:
       prometheus:
         endpoint: ":8889"
         resource_to_telemetry_conversion:
           enabled: true
         add_metric_suffixes: false

     service:
       extensions:
         - health_check

       telemetry:
         metrics:
           level: none

       pipelines:
         metrics:
           receivers:
             - otlp
           exporters:
             - prometheus

   resources:
     limits:
       cpu: "100m"
       memory: "512Mi"

   ports:
     metrics:
       enabled: true
       containerPort: 8889
       servicePort: 8889
       protocol: TCP
   ```

1. In the `otel-collector-values.yaml` file, make a note of the following values that you use in the `az iot ops create` command when you deploy Azure IoT Operations on the cluster:

   * `fullnameOverride`
   * `grpc.endpoint`
   * `check_interval`

1. Save and close the file.

1. Deploy the collector by running the following commands:

   ```bash
   kubectl get namespace azure-iot-operations || kubectl create namespace azure-iot-operations
   helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts

   helm repo update
   helm upgrade --install aio-observability open-telemetry/opentelemetry-collector -f otel-collector-values.yaml --namespace azure-iot-operations
   ```

## Configure Prometheus metrics collection

Configure Prometheus metrics collection on your cluster.

1. Create a file named `ama-metrics-prometheus-config.yaml` and paste the following configuration:

   ```yaml
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

   ```bash
   kubectl apply -f ama-metrics-prometheus-config.yaml
   ```


## Set up observability configuration

You can set up the observability configuration of your Azure IoT Operations deployment at any time. Once observability resources are configured, you can upgrade the observability configuration by running the `az iot ops upgrade` command with the `--ops-config` parameter to specify the new configuration values:

```azurecli
az iot ops upgrade --resource-group <rg name> -n <instance name> --ops-config observability.metrics.openTelemetryCollectorAddress=<>
```

| Parameter | Value | Description |    
| --------- | ----- | ----------- |
| `--ops-config` | `observability.metrics.openTelemetryCollectorAddress=<FULLNAMEOVERRIDE>.azure-iot-operations.svc.cluster.local:<GRPC_ENDPOINT>` | Provide the OpenTelemetry (OTel) collector address you configured in the otel-collector-values.yaml file.<br><br>The [instructions in this article](#deploy-opentelemetry-collector) use the sample values `fullnameOverride=aio-otel-collector` and `grpc.endpoint=4317`. |
| `--ops-config` | `observability.metrics.exportInternalSeconds=<CHECK_INTERVAL>` | Provide the `check_interval` value you configured in the otel-collector-values.yaml file.<br><br>The [instructions in this article](#deploy-opentelemetry-collector) use the sample value `check_interval=60`. |

> [!NOTE]
> In preview releases, the `az iot ops upgrade` command doesn't work for upgrading to a preview version, but it works for configuring the Azure IoT Operations for observability.

## Deploy dashboards to Grafana

Azure IoT Operations provides a [sample dashboard](https://github.com/Azure/azure-iot-operations/tree/main/samples/grafana-dashboard) designed to give you many of the visualizations you need to understand the health and performance of your Azure IoT Operations deployment.

Complete the following steps to install the Azure IoT Operations curated Grafana dashboards:

1. Clone or download the **azure-iot-operations** repository to get the sample Grafana Dashboard json file locally: [https://github.com/Azure/azure-iot-operations](https://github.com/Azure/azure-iot-operations).
1. Sign in to the Grafana console. You can access the console through the Azure portal or use the `az grafana show` command to retrieve the URL.

   ```azurecli
   az grafana show --name <GRAFANA_NAME> --resource-group <RESOURCE_GROUP> --query url -o tsv
   ```

1. On the Grafana landing page, select the **Create your first dashboard** tile.
1. Select **Import Dashboard**.
1. Browse to the sample dashboard directory in your local copy of the Azure IoT Operations repository, **azure-iot-operations > samples > grafana-dashboard**, then select the  **aio.sample.json** dashboard file.
1. When the application prompts, select your managed Prometheus data source.
1. Select **Import**.

## Next steps

- [How to clean up observability resources](howto-clean-up-observability-resources.md)
