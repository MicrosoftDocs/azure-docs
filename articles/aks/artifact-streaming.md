---
title: Reduce image pull time with Artifact Streaming on Azure Kubernetes Service (AKS) (Preview)
description: Learn how to enable Artifact Streaming on Azure Kubernetes Service (AKS) to reduce image pull time.
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.custom: devx-track-azurecli
ms.topic: article
ms.date: 11/16/2023
---

# Reduce image pull time with Artifact Streaming on Azure Kubernetes Service (AKS) (Preview)

High performance compute workloads often involve large images, which can cause long image pull times and slow down your workload deployments. Artifact Streaming on AKS allows you to stream container images from Azure Container Registry (ACR) to AKS. AKS only pulls the necessary layers for initial pod startup, reducing the time it takes to pull images and deploy your workloads.

Artifact Streaming can reduce time to pod readiness by over 15%, depending on the size of the image, and it works best for images <30GB. Based on our testing, we saw reductions in pod start-up times for images <10GB from minutes to seconds. If you have a pod that needs access to a large file (>30GB), then you should mount it as a volume instead of building it as a layer. This is because if your pod requires that file to start, it congests the node. Artifact Streaming isn't ideal for read heavy images from your filesystem if you need that on startup. With Artifact Streaming, pod start-up becomes concurrent, whereas without it, pods start in serial.

This article describes how to enable the Artifact Streaming feature on your AKS node pools to stream artifacts from ACR.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

* You need an existing AKS cluster with ACR integration. If you don't have one, you can create one using [Authenticate with ACR from AKS][acr-auth-aks].
* [Enable Artifact Streaming on ACR][enable-artifact-streaming-acr].
* This feature requires Kubernetes version 1.25 or later. To check your AKS cluster version, see [Check for available AKS cluster upgrades][aks-upgrade].

> [!NOTE]
> Artifact Streaming is only supported on Ubuntu 22.04, Ubuntu 20.04, and Azure Linux node pools. Windows node pools aren't supported.

## Install the `aks-preview` CLI extension

1. Install the `aks-preview` CLI extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update the extension to ensure you have the latest version installed using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

## Register the `ArtifactStreamingPreview` feature flag in your subscription

* Register the `ArtifactStreamingPreview` feature flag in your subscription using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace Microsoft.ContainerService --name ArtifactStreamingPreview
    ```

## Enable Artifact Streaming on ACR

Enablement on ACR is a prerequisite for Artifact Streaming on AKS. For more information, see [Artifact Streaming on ACR](https://aka.ms/acr/artifact-streaming).

1. Create an Azure resource group to hold your ACR instance using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myStreamingTest --location westus
    ```

2. Create a new premium SKU Azure Container Registry using the [`az acr create`][az-acr-create] command with the `--sku Premium` flag.

    ```azurecli-interactive
    az acr create --resource-group myStreamingTest --name mystreamingtest --sku Premium
    ```

3. Configure the default ACR instance for your subscription using the [`az configure`][az-configure] command.

    ```azurecli-interactive
    az configure --defaults acr="mystreamingtest"
    ```

4. Push or import an image to the registry using the [`az acr import`][az-acr-import] command.

    ```azurecli-interactive
    az acr import -source docker.io/jupyter/all-spark-notebook:latest -t jupyter/all-spark-notebook:latest
    ```

5. Create a streaming artifact from the image using the [`az acr artifact-streaming create`][az-acr-artifact-streaming-create] command.

    ```azurecli-interactive
    az acr artifact-streaming create --image jupyter/all-spark-notebook:latest
    ```

6. Verify the generated Artifact Streaming using the [`az acr manifest list-referrers`][az-acr-manifest-list-referrers] command.

    ```azurecli-interactive
    az acr manifest list-referrers -n jupyter/all-spark-notebook:latest
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

## Check if Artifact Streaming is enabled

Now that you enabled Artifact Streaming on a premium ACR and connected that to an AKS node pool with Artifact Streaming enabled, any new pod deployments on this cluster with an image pull from the ACR with Artifact Streaming enabled will see reductions in image pull times.

* Check if your node pool has Artifact Streaming enabled using the [`az aks nodepool show`][az-aks-nodepool-show] command.

    ```azurecli-interactive
    az aks nodepool show --resource-group myResourceGroup --cluster-name myAKSCluster --name myNodePool grep ArtifactStreamingConfig
    ```

    In the output, check that the `Enabled` field is set to `true`.

## Next steps

This article described how to enable Artifact Streaming on your AKS node pools to stream artifacts from ACR and reduce image pull time. To learn more about working with container images in AKS, see [Best practices for container image management and security in AKS][aks-image-management].

<!-- LINKS -->
[enable-artifact-streaming-acr]: #enable-artifact-streaming-on-acr
[acr-auth-aks]: ./cluster-container-registry-integration.md
[aks-upgrade]: ./upgrade-cluster.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update
[aks-image-management]: ./operator-best-practices-container-image-management.md
[az-group-create]: /cli/azure/group#az-group-create
[az-acr-create]: /cli/azure/acr#az-acr-create
[az-configure]: /cli/azure#az_configure
[az-acr-import]: /cli/azure/acr#az-acr-import
[az-acr-artifact-streaming-create]: /cli/azure/acr/artifact-streaming#az-acr-artifact-streaming-create
[az-acr-manifest-list-referrers]: /cli/azure/acr/manifest#az-acr-manifest-list-referrers
[az-aks-nodepool-show]: /cli/azure/aks/nodepool#az-aks-nodepool-show
