---
title: "Setup of Network Observability for Azure Kubernetes Service (AKS) - BYO Prometheus and Grafana"
description: Get started with AKS Network Observability for your AKS cluster using BYO Prometheus and Grafana.
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 06/20/2023
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Setup of Network Observability for Azure Kubernetes Service (AKS) - BYO Prometheus and Grafana

AKS Network Observability is used to collect the network traffic data of your AKS cluster. Network Observability enables a centralized platform for monitoring application and network health. Prometheus collects AKS Network Observability metrics, and Grafana visualizes them. Both Cilium and non-Cilium data plane are supported. In this article, learn how to enable the Network Observability add-on and use BYO Prometheus and Grafana to visualize the scraped metrics.

> [!IMPORTANT]
> AKS Network Observability is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For more information about AKS Network Observability, see [What is Azure Kubernetes Service (AKS) Network Observability?](network-observability-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Installations of BYO Prometheus and Grafana.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- Minimum version of **Azure CLI** required for the steps in this article is **2.44.0**. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `NetworkObservabilityPreview` feature flag

```azurecli-interactive 
az feature register --namespace "Microsoft.ContainerService" --name "NetworkObservabilityPreview"
```

Use [az feature show](/cli/azure/feature#az-feature-show) to check the registration status of the feature flag:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "NetworkObservabilityPreview"
```

Wait for the feature to say **Registered** before preceding with the article.

```output
{
  "id": "/subscriptions/23250d6d-28f0-41dd-9776-61fc80805b6e/providers/Microsoft.Features/providers/Microsoft.ContainerService/features/NetworkObservabilityPreview",
  "name": "Microsoft.ContainerService/NetworkObservabilityPreview",
  "properties": {
    "state": "Registering"
  },
  "type": "Microsoft.Features/providers/features"
}
```
When the feature is registered, refresh the registration of the Microsoft.ContainerService resource provider with [az provider register](/cli/azure/provider#az-provider-register):

```azurecli-interactive
az provider register -n Microsoft.ContainerService
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group with [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named **myResourceGroup** in the **eastus** location:

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus
```

## Create AKS cluster

Create an AKS cluster with [az aks create](/cli/azure/aks#az-aks-create) command. The following example creates an AKS cluster named **myAKSCluster** in the **myResourceGroup** resource group:

# [**Non-Cilium**](#tab/non-cilium)

Non-Cilium clusters support the enablement of Network Observability on an existing cluster or during the creation of a new cluster. 

## New cluster

Use [az aks create](/cli/azure/aks#az-aks-create) in the following example to create an AKS cluster with Network Observability and non-Cilium.

```azurecli-interactive
az aks create \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --location eastus \
    --generate-ssh-keys \
    --network-plugin azure \
    --network-plugin-mode overlay \
    --pod-cidr 192.168.0.0/16 \
    --enable-network-observability
```

## Existing cluster

Use [az aks update](/cli/azure/aks#az-aks-update) to enable Network Observability on an existing cluster.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-network-observability 
```

# [**Cilium**](#tab/cilium)

Use the following example to create an AKS cluster with Network Observability and Cilium.

```azurecli-interactive
az aks create \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --generate-ssh-keys \
    --location eastus \
    --max-pods 250 \
    --network-plugin azure \
    --network-plugin-mode overlay \
    --network-dataplane cilium \
    --node-count 2 \
    --pod-cidr 192.168.0.0/16
```

---

## Get cluster credentials 

```azurecli-interactive
az aks get-credentials --name myAKSCluster --resource-group myResourceGroup
```

## Enable Visualization on Grafana

Use the following example to configure scrape jobs on Prometheus and enable visualization on Grafana for your AKS cluster.


# [**Non-Cilium**](#tab/non-cilium)

> [!NOTE]
> The following section requires installations of Prometheus and Grafana.

1. Add the following scrape job to your existing Prometheus configuration and restart your Prometheus server:

    ```yml
    scrape_configs:
      - job_name: "network-obs-pods"
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_container_name]
            action: keep
            regex: kappie(.*)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            separator: ":"
            regex: ([^:]+)(?::\d+)?
            target_label: __address__
            replacement: ${1}:${2}
            action: replace
          - source_labels: [__meta_kubernetes_pod_node_name]
            action: replace
            target_label: instance
        metric_relabel_configs:
          - source_labels: [__name__]
            action: keep
            regex: (.*)
    ``` 

1. In **Targets** of Prometheus, verify the **network-obs-pods** are present.

1. Sign in to Grafana and import Network Observability dashboard with ID [18814](https://grafana.com/grafana/dashboards/18814/).

# [**Cilium**](#tab/cilium)

> [!NOTE]
> The following section requires installations of Prometheus and Grafana.

1. Add the following scrape job to your existing Prometheus configuration and restart your prometheus server. 

    ```yml
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
          action: keep
          regex: true
        - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
          action: replace
          regex: (.+):(?:\d+);(\d+)
          replacement: ${1}:${2}
          target_label: __address__
    ```

1. In **Targets** of prometheus, verify the **kubernetes-pods** are present.

1. Sign in to Grafana and import dashboards with the following ID [16611-cilium-metrics](https://grafana.com/grafana/dashboards/16611-cilium-metrics/)

---

## Clean up resources

If you're not going to continue to use this application, delete the AKS cluster and the other resources created in this article with the following example:

```azurecli-interactive
  az group delete \
    --name myResourceGroup
```

## Next steps

In this how-to article, you learned how to install and enable AKS Network Observability for your AKS cluster.

- For more information about AKS Network Observability, see [What is Azure Kubernetes Service (AKS) Network Observability?](network-observability-overview.md).

- To create an AKS cluster with Network Observability and managed Prometheus and Grafana, see [Setup Network Observability for Azure Kubernetes Service (AKS) Azure managed Prometheus and Grafana](network-observability-managed-cli.md).
