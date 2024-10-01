---
title: Deploy observability resources with a script
description: How to get started with configuring observability features with a script in Azure IoT Operations, so that you can monitor your solution.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 09/26/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data on the health of my industrial assets and edge environment.
---

# Get started: configure observability with a script in Azure IoT Operations Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Observability provides visibility into every layer of your Azure IoT Operations configuration. It gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards that are hosted in Azure. These dashboards are powered by Azure Monitor managed service for Prometheus and by Container Insights. This article shows you how to configure the services you need for observability.

## Prerequisites

* An Arc-enabled Kubernetes cluster.
* Helm installed on your development machine. For instructions, see [Install Helm](https://helm.sh/docs/intro/install/).
* Kubectl installed on your development machine. For instructions, see [Install Kubernetes tools](https://kubernetes.io/docs/tasks/tools/).
* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Configure your subscription

Run the following code to register providers with the subscription where your cluster is located.

>[!NOTE]
>This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

```azurecli
az account set -s <subscription-id>
az provider register -n "Microsoft.Insights"
az provider register -n "Microsoft.AlertsManagement"
```

## Install observability components

The steps in this section deploy an [OpenTelemetry (OTel) Collector](https://opentelemetry.io/docs/collector/) and then install shared monitoring resources and configure your Arc enabled cluster to emit observability signals to these resources. The shared monitoring resources include Azure Managed Grafana, Azure Monitor Workspace, Azure Managed Prometheus, Azure Log Analytics, and Container Insights.

### Deploy OpenTelemetry Collector

[!INCLUDE [deploy-otel-collector.md](../includes/deploy-otel-collector.md)]

### Deploy observability components

- Deploy the observability components by running one of the following commands. Use the subscription ID and resource group of the Arc-enabled cluster that you want to monitor.

   > [!NOTE]
   > To discover other optional parameters you can set, see the [bicep file](https://github.com/Azure/azure-iot-operations/blob/main/tools/setup-3p-obs-infra/observability-full.bicep). The optional parameters can specify things like alternative locations for cluster resources.

   The following command grants admin access for the newly created Grafana instance to the user:

   ```azurecli
   az deployment group create \
       --subscription <subscription-id> \
       --resource-group <cluster-resource-group> \
       --template-file observability-full.bicep \
       --parameters grafanaAdminId=$(az ad user show --id $(az account show --query user.name --output tsv) --query=id --output tsv) \
                    clusterName=<cluster-name> \
                    sharedResourceGroup=<shared-resource-group> \
                    sharedResourceLocation=<shared-resource-location> \
       --query=properties.outputs
   ```

   If that access isn't what you want, the following command that doesn't configure permissions. Then, set up permissions manually using [role assignments](../../managed-grafana/how-to-share-grafana-workspace.md#add-a-grafana-role-assignment) before anyone can access the Grafana instance. Assign one of the Grafana roles (Grafana Admin, Grafana Editor, Grafana Viewer) depending on the level of access desired.

   ```azurecli
   az deployment group create \
       --subscription <subscription-id> \
       --resource-group <cluster-resource-group> \
       --template-file observability-full.bicep \
       --parameters clusterName=<cluster-name> \
                    sharedResourceGroup=<shared-resource-group> \
                    sharedResourceLocation=<shared-resource-location> \
        --query=properties.outputs
   ```

   If the deployment succeeds, a few pieces of information are printed at the end of the command output. The information includes the Grafana URL and the resource IDs for both the Log Analytics and Azure Monitor resources that were created. The Grafana URL allows you to go to the Grafana instance that you configure in [Deploy dashboards to Grafana](#deploy-dashboards-to-grafana). The two resource IDs enable you to configure other Arc enabled clusters by following the steps in [Add an Arc-enabled cluster to existing observability infrastructure](howto-add-cluster.md).

## Configure Prometheus metrics collection

1. Copy and paste the following configuration to a new file named `ama-metrics-prometheus-config.yaml`, and save the file:

   ```yml
   apiVersion: v1
   data:
     prometheus-config: |2-
       scrape_configs:
         - job_name: e4k
           scrape_interval: 1m
           static_configs:
             - targets:
               - aio-internal-diagnostics-service.azure-iot-operations.svc.cluster.local:9600
             - job_name: nats
               scrape_interval: 1m
               static_configs:
               - targets:
                 - aio-dp-msg-store-0.aio-dp-msg-store-headless.azure-iot-operations.svc.cluster.local:7777
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

Azure IoT Operations provides a collection of dashboards designed to give you many of the visualizations you need to understand the health and performance of your Azure IoT Operations deployment.

Complete the following steps to install the Azure IoT Operations curated Grafana dashboards.

1. Sign in to the Grafana console, then in the upper right area of the Grafana application, select the **+** icon

1. Select **Import dashboard**, follow the prompts to browse to the *samples\grafana-dashboards* path in your local cloned copy of the repo, and select a JSON dashboard file

1. When the application prompts, select your managed Prometheus data source

1. Select **Import**

## Related content

- [Azure Monitor overview](/azure/azure-monitor/overview)
- [How to deploy observability resources manually](howto-configure-observability-manual.md)
