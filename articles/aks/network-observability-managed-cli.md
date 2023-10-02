---
title: Use Azure-managed Prometheus and Grafana with the Network Observability add-on for Azure Kubernetes Service (AKS) (Preview)
description: Learn how to use Azure-managed Prometheus and Grafana with the Network Observability add-on for AKS.
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 10/02/2023
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Use Azure-managed Prometheus and Grafana with the Network Observability add-on for Azure Kubernetes Service (AKS) (Preview)

The Network Observability add-on for AKS collects the network traffic data from your clusters and enables a centralized platform for monitoring application and network health. Prometheus collects the network metrics and Grafana visualizes them. Network Observability supports Cilium and non-Cilium data planes. In this article, you learn how to enable the Network Observability add-on for AKSf and use Azure-managed Prometheus and Grafana to visualize the scraped metrics.

> [!IMPORTANT]
> AKS Network Observability is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For more information, see [What is AKS Network Observability?](network-observability-overview.md)

## Before you begin

- You need an Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires Azure CLI version 2.44.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
- [Install or update the `aks-preview` Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
- [Register the `NetworkObservabilityPreview` feature flag](#register-the-networkobservabilitypreview-feature-flag).

### Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

- Install or update to the latest version of the `aks-preview` extension using the [`az extension add`](/cli/azure/extension#az-extension-add) or [`az extension update`](/cli/azure/extension#az-extension-update) command.

    ```azurecli-interactive
    # Install the aks-preview extension
    az extension add --name aks-preview
    
    # Update the aks-preview extension to make sure you have the latest version installed
    az extension update --name aks-preview
    ```

### Register the `NetworkObservabilityPreview` feature flag

1. Register the `NetworkObservabilityPreview` feature flag using the [`az feature register`](/cli/azure/feature#az-feature-register) command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "NetworkObservabilityPreview"
    ```

2. Check the registration status using the [`az feature show`](/cli/azure/feature#az-feature-show) command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "NetworkObservabilityPreview"
    ```

    Wait for the state in the output to change from *Registering* to *Registered* before preceding with the article.

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

3. Once the feature shows as *Registered*, refresh the registration of the resource provider using the [`az provider register`](/cli/azure/provider#az-provider-register) command.

    ```azurecli-interactive
    az provider register -n Microsoft.ContainerService
    ```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named **myResourceGroup** in the **eastus** location:

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus
```

## Create AKS cluster

Create an AKS cluster with [az aks create](/cli/azure/aks#az-aks-create). The following example creates an AKS cluster named **myAKSCluster** in the **myResourceGroup** resource group:

# [**Non-Cilium**](#tab/non-cilium)

Non-Cilium clusters support the enablement of Network Observability on an existing cluster or during the creation of a new cluster. 

Use [az aks create](/cli/azure/aks#az-aks-create) in the following example to create an AKS cluster with Network Observability and non-Cilium.

## New cluster

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

Use [az aks update](/cli/azure/aks#az-aks-update) to enable Network Observability for an existing cluster.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-network-observability 
```

# [**Cilium**](#tab/cilium)

Use [az aks create](/cli/azure/aks#az-aks-create) in the following example to create an AKS cluster with Network Observability and Cilium.

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

---

## Get cluster credentials 

```azurecli-interactive
az aks get-credentials --name myAKSCluster --resource-group myResourceGroup
```


## Enable visualization on Grafana

# [**Non-Cilium**](#tab/non-cilium)

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

1. Use the ID [18814]( https://grafana.com/grafana/dashboards/18814/) to import the dashboard from Grafana's public dashboard repo.

1. Verify the Grafana dashboard is visible.

# [**Cilium**](#tab/cilium)

> [!NOTE]
> The following section requires deployments of Azure managed Prometheus and Grafana.

1. Use the following example to create a file named **`prometheus-config`**. Copy the code in the example into the file created.

    ```yaml
    global:
      scrape_interval: 30s
    scrape_configs:
      - job_name: "cilium-pods"
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_container_name]
            action: keep
            regex: cilium-agent
          - source_labels:
              [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            separator: ":"
            regex: ([^:]+)(?::\d+)?
            target_label: __address__
            replacement: ${1}:${2}
            action: replace
          - source_labels: [__meta_kubernetes_pod_node_name]
            action: replace
            target_label: instance
          - source_labels: [__meta_kubernetes_pod_label_k8s_app]
            action: replace
            target_label: k8s_app
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            regex: (.*)
            target_label: pod
        metric_relabel_configs:
          - source_labels: [__name__]
            action: keep
            regex: (.*)
    ```

1. To create the `configmap`, use the following example:

    ```azurecli-interactive
    kubectl create configmap ama-metrics-prometheus-config \
        --from-file=./prometheus-config \
        --namespace kube-system
    ```

1. Azure Monitor pods should restart themselves, if they don't, rollout restart with following command:
    
```azurecli-interactive
    kubectl rollout restart deploy -n kube-system ama-metrics
    ```

1. Once the Azure Monitor pods have been deployed on the cluster, port forward to the `ama` pod to verify the pods are being scraped. Use the following example to port forward to the pod:

    ```azurecli-interactive
    kubectl port-forward -n kube-system $(kubectl get po -n kube-system -l rsName=ama-metrics -oname | head -n 1) 9090:9090
    ```

1. In **Targets** of prometheus, verify the **cilium-pods** are present.

1. Sign in to Grafana and import dashboards with the following ID [16611-cilium-metrics](https://grafana.com/grafana/dashboards/16611-cilium-metrics/).

---

## Clean up resources

If you're not going to continue to use this application, delete
the AKS cluster and the other resources created in this article with the following example:

```azurecli-interactive
  az group delete \
    --name myResourceGroup
```

## Next steps

In this how-to article, you learned how to install and enable AKS Network Observability for your AKS cluster.

- For more information about AKS Network Observability, see [What is Azure Kubernetes Service (AKS) Network Observability?](network-observability-overview.md).

- To create an AKS cluster with Network Observability and BYO Prometheus and Grafana, see [Setup Network Observability for Azure Kubernetes Service (AKS) BYO Prometheus and Grafana](network-observability-byo-cli.md).
