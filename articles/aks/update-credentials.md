---
title: Reset the credentials for an Azure Kubernetes Service (AKS) cluster
description: Learn how update or reset the service principal credentials for a cluster in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 01/29/2019
ms.author: iainfou
---

# Update or rotate the credentials for a service principal in Azure Kubernetes Service (AKS)

By default, AKS clusters are created with a service principal that has a one-year expiration time. As you near the expiration date, you can reset the credentials to extend the service principal for an additional period of time. You may also want to update, or rotate, the credentials as part of a defined security policy. This article details how to update these credentials for an AKS cluster.

## Before you begin

You need the Azure CLI version 2.0.56 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Get the service principal ID

You can choose to update the existing service principal, or specify a new service principal and associated secret. If you wish to specify a different service principal ID, skip this step. If you want to update the credentials for the existing service principal, get the service principal ID of your cluster using the [az aks show][az-aks-show] command.

The following example gets the ID for the cluster named *myAKSCluster* in the *myResourceGroup* resource group. The service principal ID is set a variable for use in additional command.

```azurecli-interactive
AKS_SP=$(az aks show -g myResourceGroup -n myAKSCluster --query servicePrincipalProfile.clientId -o tsv)
```

## Update the service principal credentials

You update the credentials for an AKS cluster using the [az aks update-credentials][az-aks-update-credentials] command. The following example uses the *$AKS-SP* variable defined in the previous step for the *--service-principal* ID. If you want to specify a different service principal, provide that resource ID. Specify the new *--client-secret* for the AKS cluster to use:

```azurecli-interactive
az aks update-credentials \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --reset-service-principal \
    --service-principal $AKS_SP \
    --client-secret <new secret>
```

It takes a few moments for the service principal credentials to be updated in the AKS.

## Next steps

In this article, the service principal for the AKS cluster itself was updated. For more information on how to manage identity for workloads within a cluster, see [Best practices for authentication and authorization in AKS][best-practices-identity].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-update-credentials]: /cli/azure/aks#az-aks-update-credentials
[best-practices-identity]: operator-best-practices-identity.md
