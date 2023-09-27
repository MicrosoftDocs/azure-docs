---
title: Install the Kubernetes Event-driven Autoscaling (KEDA) add-on using the Azure CLI
description: Use the Azure CLI to deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS).
author: raorugan
ms.author: raorugan
ms.topic: article
ms.date: 09/26/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Install the Kubernetes Event-driven Autoscaling (KEDA) add-on using the Azure CLI

This article shows you how to install the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS) using the Azure CLI.

[!INCLUDE [Current version callout](./includes/keda/current-version-callout.md)]

## Before you begin

- You need an Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- You need the [Azure CLI installed](/cli/azure/install-azure-cli).
- Ensure you have firewall rules configured to allow access to the Kubernetes API server. For more information, see [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters][aks-firewall-requirements].
- [Install the `aks-preview` Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
- [Register the `AKS-KedaPreview` feature flag](#register-the-aks-kedapreview-feature-flag).

### Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the `aks-preview` extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the `aks-preview` extension using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Register the `AKS-KedaPreview` feature flag

1. Register the `AKS-KedaPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "AKS-KedaPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "AKS-KedaPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Enable the KEDA add-on on your AKS cluster

> [!NOTE]
> While KEDA provides various customization options, the KEDA add-on currently provides basic common configuration.
>
> If you require custom configurations, you can manually edit the KEDA YAML files to customize the installation. **Azure doesn't offer support for custom configurations**.

### Create a new AKS cluster with KEDA add-on enabled

1. Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

2. Create a new AKS cluster using the [`az aks create`][az-aks-create] command and enable the KEDA add-on using the `--enable-keda` flag.

    ```azurecli-interactive
    az aks create \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --enable-keda 
    ```

### Enable the KEDA add-on on an existing AKS cluster

- Update an existing cluster using the [`az aks update`][az-aks-update] command and enable the KEDA add-on using the `--enable-keda` flag.

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --enable-keda 
    ```

## Get the credentials for your cluster

- Get the credentials for your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Verify the KEDA add-on is installed on your cluster

- Verify the KEDA add-on is installed on your cluster using the [`az aks show`][az-aks-show] command and set the `--query` parameter to `workloadAutoScalerProfile.keda.enabled`.

    ```azurecli-interactive
    az aks show -g myResourceGroup --name myAKSCluster --query "workloadAutoScalerProfile.keda.enabled" 
    ```

    The following example output shows the KEDA add-on is installed on the cluster:

    ```output
    true
    ```

## Verify KEDA is running on your cluster

- Verify the KEDA add-on is running on your cluster using the [`kubectl get pods`][kubectl] command.

    ```azurecli-interactive
    kubectl get pods -n kube-system 
    ```

    The following example output shows the KEDA operator and metrics API server are installed on the cluster:

    ```output
    keda-operator-********-k5rfv                     1/1     Running   0          43m
    keda-operator-metrics-apiserver-*******-sj857    1/1     Running   0          43m
    ```

## Verify the KEDA version on your cluster

- Verify the KEDA version using the `kubectl get crd/scaledobjects.keda.sh -o yaml` command.

    ```azurecli-interactive
    kubectl get crd/scaledobjects.keda.sh -o yaml 
    ```

    The following condensed example output shows the configuration of KEDA in the `app.kubernetes.io/version` label:

    ```output
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    metadata:
      annotations:
        controller-gen.kubebuilder.io/version: v0.9.0
        meta.helm.sh/release-name: aks-managed-keda
        meta.helm.sh/release-namespace: kube-system
      creationTimestamp: "2023-09-26T10:31:06Z"
      generation: 1
      labels:
        app.kubernetes.io/component: operator
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: keda-operator
        app.kubernetes.io/part-of: keda-operator
        app.kubernetes.io/version: 2.10.1
    ...
    ```

## Disable the KEDA add-on on your AKS cluster

- Disable the KEDA add-on on your cluster using the [`az aks update`][az-aks-update] command with the `--disable-keda` flag.

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --disable-keda 
    ```

## Next steps

This article showed you how to install the KEDA add-on on an AKS cluster using the Azure CLI.

With the KEDA add-on installed on your cluster, you can [deploy a sample application][keda-sample] to start scaling apps.

For information on KEDA troubleshooting, see [Troubleshoot the Kubernetes Event-driven Autoscaling (KEDA) add-on][keda-troubleshoot].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-aks-create]: /cli/azure/aks#az-aks-create
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context
[aks-firewall-requirements]: outbound-rules-control-egress.md#azure-global-required-network-rules
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-group-create]: /cli/azure/group#az-group-create
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
