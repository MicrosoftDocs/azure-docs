---
title: "Set up Network Observability for Azure Kubernetes Service (AKS) - Azure managed Prometheus and Grafana"
description: Get started with AKS Network Observability for your AKS cluster using Azure managed Prometheus and Grafana.
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 06/20/2023
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Set up Network Observability for Azure Kubernetes Service (AKS) - Azure managed Prometheus and Grafana

AKS Network Observability is used to collect the network traffic data of your AKS cluster. Network Observability enables a centralized platform for monitoring application and network health. Prometheus collects AKS Network Observability metrics, and Grafana visualizes them. Both Cilium and non-Cilium data plane are supported. In this article, learn how to enable the Network Observability add-on and use Azure managed Prometheus and Grafana to visualize the scraped metrics.

For more information about AKS Network Observability, see [What is Azure Kubernetes Service (AKS) Network Observability?](network-observability-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- Minimum version of **Azure CLI** required for the steps in this article is **2.44.0**. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create cluster

> [!NOTE]
>For Kubernetes version >= 1.29, Network Observability is included in clusters with Azure Managed Prometheus. Metric scraping is defined via the [AMA metrics profile](/azure/azure-monitor/containers/prometheus-metrics-scrape-configuration).
>
>For lower Kubernetes versions, extra steps are required to enable Network Observability.

### [**Kubernetes version >= 1.29**](#tab/newer-k8s-versions)

#### Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group with [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named **myResourceGroup** in the **eastus** location:

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus
```

#### Create AKS cluster

Create an AKS cluster with [az aks create](/cli/azure/aks#az-aks-create).
The following examples each create an AKS cluster named **myAKSCluster** in the **myResourceGroup** resource group.

##### Example 1: **Non-Cilium**

Use [az aks create](/cli/azure/aks#az-aks-create) in the following example to create a non-Cilium AKS cluster.

```azurecli-interactive
az aks create \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --location eastus \
    --generate-ssh-keys \
    --network-plugin azure \
    --network-plugin-mode overlay \
    --pod-cidr 192.168.0.0/16 \
    --kubernetes-version 1.29
```

#### Example 2: **Cilium**

Use [az aks create](/cli/azure/aks#az-aks-create) in the following example to create a Cilium AKS cluster.

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

### [**Kubernetes version < 1.29**](#tab/older-k8s-versions)

#### Install the `aks-preview` Azure CLI extension

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

#### Register the `NetworkObservabilityPreview` feature flag

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

#### Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group with [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named **myResourceGroup** in the **eastus** location:

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus
```

#### Create or Update AKS cluster

The following examples each create or update an AKS cluster named **myAKSCluster** in the **myResourceGroup** resource group.

##### Example 1: **Non-Cilium**

###### Create cluster

Use [az aks create](/cli/azure/aks#az-aks-create) in the following example to create a non-Cilium AKS cluster with Network Observability.

```azurecli-interactive
az aks create \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --location eastus \
    --generate-ssh-keys \
    --network-plugin azure \
    --network-plugin-mode overlay \
    --pod-cidr 192.168.0.0/16 \
    --enable-advanced-network-observability
```

###### Update Existing cluster

Use [az aks update](/cli/azure/aks#az-aks-update) to enable Network Observability for an existing non-Cilium cluster.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-advanced-network-observability
```

##### Example 2: **Cilium**

Use [az aks create](/cli/azure/aks#az-aks-create) in the following example to create a Cilium AKS cluster.

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

## Azure managed Prometheus and Grafana

Use the following example to install and enable Prometheus and Grafana for your AKS cluster.

### Create Azure Monitor resource

```azurecli-interactive
az resource create \
    --resource-group myResourceGroup \
    --namespace microsoft.monitor \
    --resource-type accounts \
    --name myAzureMonitor \
    --location eastus \
    --properties '{}'
```

### Create Grafana instance

Use [az grafana create](/cli/azure/grafana#az-grafana-create) to create a Grafana instance. The name of the Grafana instance must be unique. Replace **myGrafana** with a unique name for your Grafana instance.

```azurecli-interactive
az grafana create \
    --name myGrafana \
    --resource-group myResourceGroup 
```

### Place the Grafana and Azure Monitor resource IDs in variables

Use [az grafana show](/cli/azure/grafana#az-grafana-show) to place the Grafana resource ID in a variable. Use [az resource show](/cli/azure/resource#az-resource-show) to place the Azure Monitor resource ID in a variable. Replace **myGrafana** with the name of your Grafana instance.

```azurecli-interactive
grafanaId=$(az grafana show \
                --name myGrafana \
                --resource-group myResourceGroup \
                --query id \
                --output tsv)

azuremonitorId=$(az resource show \
                    --resource-group myResourceGroup \
                    --name myAzureMonitor \
                    --resource-type "Microsoft.Monitor/accounts" \
                    --query id \
                    --output tsv)
```

### Link Azure Monitor and Grafana to AKS cluster

Use [az aks update](/cli/azure/aks#az-aks-update) to link the Azure Monitor and Grafana resources to your AKS cluster.

```azurecli-interactive
az aks update \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --enable-azure-monitor-metrics \
    --azure-monitor-workspace-resource-id $azuremonitorId \
    --grafana-resource-id $grafanaId
```

## Get cluster credentials

```azurecli-interactive
az aks get-credentials --name myAKSCluster --resource-group myResourceGroup
```

## Visualize using Grafana

> [!NOTE]
> The following section requires deployments of Azure managed Prometheus and Grafana.

1. Use the following example to verify the Azure Monitor pods are running. 

    ```azurecli-interactive
    kubectl get po -owide -n kube-system | grep ama-
    ```

    ```output
    ama-metrics-5bc6c6d948-zkgc9          2/2     Running   0 (21h ago)   26h
    ama-metrics-ksm-556d86b5dc-2ndkv      1/1     Running   0 (26h ago)   26h
    ama-metrics-node-lbwcj                2/2     Running   0 (21h ago)   26h
    ama-metrics-node-rzkzn                2/2     Running   0 (21h ago)   26h
    ama-metrics-win-node-gqnkw            2/2     Running   0 (26h ago)   26h
    ama-metrics-win-node-tkrm8            2/2     Running   0 (26h ago)   26h
    ```

1. Navigate to your Grafana instance in a web browser.

1. We have created a sample dashboard. It can be found under **Dashboards > Azure Managed Prometheus > Kubernetes / Networking / Clusters**.

1. Check if the metrics in the **Kubernetes / Networking / Clusters** Grafana dashboard are visible. If metrics aren't shown, change time range to last 15 minutes in top right dropdown box.

---

## Clean up resources

If you're not going to continue to use this application, delete
the AKS cluster and the other resources created in this article with the following example:

```azurecli-interactive
  az group delete \
    --name myResourceGroup
```

## Next steps

In this how-to article, you learned how to set up AKS Network Observability for your AKS cluster.

- For more information about AKS Network Observability, see [What is Azure Kubernetes Service (AKS) Network Observability?](network-observability-overview.md).

- If you're interested in more granular Network Observability and other advanced features, see [What is Advanced Container Networking Services for Azure Kubernetes Service (AKS)?](advanced-container-networking-services-overview.md).
