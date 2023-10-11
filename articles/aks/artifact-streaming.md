---
title: Reduce image pull time with Artifact Streaming on Azure Kubernetes Service (AKS) (Preview)
description: Learn how to enable Artifact Streaming on Azure Kubernetes Service (AKS) to reduce image pull time.
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.custom: devx-track-azurecli
ms.topic: article
ms.date: 10/11/2023
---

# Reduce image pull time with Artifact Streaming on Azure Kubernetes Service (AKS) (Preview)

High performance compute workloads often involve large images, which can cause long image pull times and slow down your workload deployments. Artifact Streaming on AKS allows you to stream container images from Azure Container Registry (ACR) to AKS. AKS only pulls the necessary layers for initial pod startup, reducing the time it takes to pull images and deploy your workloads.

This article describes how to enable the Artifact Streaming feature on your AKS node pools to stream artifacts from ACR.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

* [Enable Artifact Streaming on ACR][enable-artifact-streaming-acr].
* This article assumes you have existing AKS cluster with ACR integration. If you don't have one, see [Authenticate with ACR from AKS][acr-auth-aks] to create an AKS cluster with ACR integration.
* This feature requires Kubernetes version 1.25 or later. To check your AKS cluster version, see [Check for available AKS cluster upgrades][aks-upgrade].
* [Install the `aks-preview` CLI extension](#install-the-aks-preview-cli-extension).
* [Register the `ArtifactStreamingPreview` feature flag in your subscription](#register-the-artifactstreamingpreview-feature-flag-in-your-subscription).

> [!NOTE]
> Artifact Streaming is only supported on Ubuntu 22.04, Ubuntu 20.04, and Azure Linux node pools. Windows node pools aren't supported.

### Install the `aks-preview` CLI extension

1. Install the `aks-preview` CLI extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update the extension to ensure you have the latest version installed using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Register the `ArtifactStreamingPreview` feature flag in your subscription

* Register the `ArtifactStreamingPreview` feature flag in your subscription using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace Microsoft.ContainerService --name ArtifactStreamingPreview
    ```

## Enable Artifact Streaming on AKS

### Enable Artifact Streaming on a new node pool

* Create a new node pool with Artifact Streaming enabled using the [`az aks nodepool add`][az-aks-nodepool-add] command with the `--enable-artifact-streaming` flag set to `true`.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myNodePool \
        --enable-artifact-streaming true
    ```

### Enable Artifact Streaming on an existing node pool

* Enable Artifact Streaming on an existing node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command with the `--enable-artifact-streaming` flag set to `true`.

    ```azurecli-interactive
    az aks nodepool update \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myNodePool \
        --enable-artifact-streaming true
    ```

## Disable Artifact Streaming on AKS

You can disable Artifact Streaming at the node pool level. The change takes effect on the next node pool upgrade.

> [!NOTE]
> Artifact Streaming requires connection to and enablement on an ACR. If you disconnect or disable from ACR, Artifact Streaming is automatically disabled on the node pool. If you don't disable Artifact Streaming at the node pool level, it begins working immediately once you resume the connection to and enablement on ACR.

### Disable Artifact Streaming on an existing node pool

* Disable Artifact Streaming on an existing node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command with the `--enable-artifact-streaming` flag set to `false`.

    ```azurecli-interactive
    az aks nodepool update \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myNodePool \
        --enable-artifact-streaming false
    ```

## Next steps

This article described how to enable Artifact Streaming on your AKS node pools to stream artifacts from ACR and reduce image pull time. To learn more about working with container images in AKS, see [Best practices for container image management and security in AKS][aks-image-management].

<!-- LINKS -->
[enable-artifact-streaming-acr]: TBD
[acr-auth-aks]: ./cluster-container-registry-integration.md
[aks-upgrade]: ./upgrade-cluster.md#check-for-available-aks-cluster-upgrades
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update
[aks-image-management]: ./operator-best-practices-container-image-management.md
