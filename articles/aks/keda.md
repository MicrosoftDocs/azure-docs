---
title: KEDA add-on on Azure Kubernetes Service (AKS) (Preview)
description: Use the KEDA add-on to deploy a managed KEDA instance on Azure Kubernetes Service (AKS).
services: container-service
author: jahabibi
ms.topic: article
ms.custom: event-tier1-build-2022
ms.date: 05/13/2021
ms.author: jahabibi
---

# Simplified application autoscaling with Kubernetes Event-driven Autoscaling (KEDA) add-on (Preview)

Kubernetes Event-driven Autoscaling (KEDA) is a single-purpose and lightweight component that strives to make application autoscaling simple and is a CNCF Incubation project.

The KEDA add-on makes it even easier by deploying a managed KEDA installation, providing you with [a rich catalog of 40+ KEDA scalers](https://keda.sh/docs/latest/scalers/) that you can scale your applications with on your Azure Kubernetes Services (AKS) cluster.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## KEDA add-on overview

[KEDA][keda] provides two main components:

- **KEDA operator** allows end-users to scale workloads in/out from 0 to N instances with support for Kubernetes Deployments, Jobs, StatefulSets or any custom resource that defines `/scale` subresource.
- **Metrics server** exposes external metrics to HPA in Kubernetes for autoscaling purposes such as messages in a Kafka topic, or number of events in an Azure event hub. Due to upstream limitations, this must be the only installed metric adapter.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).

## Deploy the KEDA add-on with Azure CLI

The KEDA add-on can be enabled with the Azure CLI when deploying an AKS cluster.

To do so, use the [az aks create][az-aks-create] command with the `--enable-keda` argument.

```azurecli
az aks create --resource-group MyResourceGroup --name MyAKSCluster --enable-keda
```

Additionally, KEDA can be deployed to an existing cluster via the [az aks update][az aks update] command.

```azure cli
az aks update --resource-group MyResourceGroup --name MyAKSCluster --enable-keda
```

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [az aks install-cli][az aks install-cli] command:

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az aks get-credentials] command. The following example gets credentials for the AKS cluster named *MyAKSCluster* in the *MyResourceGroup*:

```azurecli
az aks get-credentials --resource-group MyResourceGroup --name MyAKSCluster
```

## Use KEDA
KEDA scaling will only work once a custom resource definition has been defined (CRD). To learn more about KEDA CRDs, follow the official [KEDA documentation][keda-scalers] to define your scaler.

## Clean Up
To remove KEDA, utilize the `--disable-keda` flag.

```azurecli
az aks update --resource-group MyResourceGroup --name MyAKSCluster --disable-keda
```

To remove the resource group, and all related resources, use the [az group delete][az-group-delete] command:

```azurecli
az group delete --name MyResourceGroup
```


<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks update]: /cli/azure/aks#az-aks-update
[az-group-delete]: /cli/azure/group#az-group-delete

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda]: https://keda.sh/
[keda-scalers]: https://keda.sh/docs/scalers/
