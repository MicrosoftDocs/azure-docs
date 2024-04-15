---
title: Get started with observability
description: How to get started with configuring observability features in Azure IoT Operations so that you can monitor your solution.
author: timlt
ms.author: timlt
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 02/27/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data on the health of my industrial assets and edge environment.
---

# Get started: configure observability in Azure IoT Operations Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Observability provides visibility into every layer of your Azure IoT Operations configuration. It gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards that are hosted in Azure. These dashboards are powered by Azure Monitor managed service for Prometheus and by Container Insights. This article shows you how to configure the services you need for observability. 

## Prerequisites

- Azure IoT Operations Preview installed. For more information, see [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).
- [Git](https://git-scm.com/downloads) for cloning the repository.

## Configure your subscription

Run the following code to register providers with the subscription where your cluster is located:

```azurecli
az account set -s <subscription-id>
az provider register -n "Microsoft.Insights"
az provider register -n "Microsoft.AlertsManagement"
```

## Install observability components
The steps in this section install shared monitoring resources and configure your Arc enabled cluster to emit observability signals to these resources. The shared monitoring resources include Azure Managed Grafana, Azure Monitor Workspace, Azure Managed Prometheus, Azure Log Analytics, and Container Insights. 

1. In your console, navigate to a local folder where you want to clone the Azure IoT Operations repo: 
    > [!NOTE]
    > The repo contains the deployment definition of Azure IoT Operations, and samples that include the sample dashboards used in this article.

1. Clone the repo to your local machine, using the following command:

    ```shell
    git clone https://github.com/Azure/azure-iot-operations.git
    ```

1. Navigate to the following path in your local copy of the repo:

    *azure-iot-operations\tools\setup-3p-obs-infra*

1. To deploy the observability components, run the following command. Use the subscription ID and resource group of your Arc-enabled cluster that you want to monitor.

    > [!NOTE]
    > To discover other optional parameters you can set, see the [bicep file](https://github.com/Azure/azure-iot-operations/blob/main/tools/setup-3p-obs-infra/observability-full.bicep). The optional parameters can specify things like alternative locations for cluster resources.
    
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
        
    The previous command grants admin access for the newly created Grafana instance to the user who runs it. If that access isn't what you want, run the following command instead. You need to set up permissions manually before anyone can access the Grafana instance. 
        
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

    To set up permissions manually, [add a role assignment](../../managed-grafana/how-to-share-grafana-workspace.md#add-a-grafana-role-assignment) to the Grafana instance for any users who should have access. Assign one of the Grafana roles (Grafana Admin, Grafana Editor, Grafana Viewer) depending on the level of access desired.

If the deployment succeeds, a few pieces of information are printed at the end of the command output. The information includes the Grafana URL and the resource IDs for both the Log Analytics and Azure Monitor resources that were created. The Grafana URL allows you to navigate to the Grafana instance that you configure in [Deploy dashboards to Grafana](#deploy-dashboards-to-grafana). The two resource IDs enable you to configure other Arc enabled clusters by following the steps in [Add an Arc-enabled cluster to existing observability infrastructure](howto-add-cluster.md).

## Configure Prometheus metrics collection
1. Copy and paste the following configuration to a new file named *ama-metrics-prometheus-config.yaml*, and save the file:
    
    ```yml
    apiVersion: v1
    data:
      prometheus-config: |2-
            scrape_configs:
            - job_name: e4k
              scrape_interval: 1m
              static_configs:
              - targets:
                - aio-mq-diagnostics-service.azure-iot-operations.svc.cluster.local:9600
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

1. To apply the configuration file you created, run the following command:

    `kubectl apply -f ama-metrics-prometheus-config.yaml`

## Deploy dashboards to Grafana
Azure IoT Operations provides a collection of dashboards designed to give you many of the visualizations you need to understand the health and performance of your Azure IoT Operations deployment.

Complete the following steps to install the Azure IoT Operations curated Grafana dashboards. 

1. Sign in to the Grafana console, then in the upper right area of the Grafana application, select the **+** icon

1. Select **Import dashboard**, follow the prompts to browse to the *samples\grafana-dashboards* path in your local cloned copy of the repo, and select a JSON dashboard file

1. When the application prompts, select your managed Prometheus data source

1. Select **Import**

## Related content

- [Azure Monitor overview](../../azure-monitor/overview.md)
- [How to configure observability manually](howto-configure-observability-manual.md)
