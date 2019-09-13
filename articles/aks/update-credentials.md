---
title: Reset the credentials for an Azure Kubernetes Service (AKS) cluster
description: Learn how update or reset the service principal credentials for a cluster in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 05/31/2019
ms.author: mlearned
---

# Update or rotate the credentials for a service principal in Azure Kubernetes Service (AKS)

By default, AKS clusters are created with a service principal that has a one-year expiration time. As you near the expiration date, you can reset the credentials to extend the service principal for an additional period of time. You may also want to update, or rotate, the credentials as part of a defined security policy. This article details how to update these credentials for an AKS cluster.

## Before you begin

You need the Azure CLI version 2.0.65 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Choose to update or create a service principal

When you want to update the credentials for an AKS cluster, you can choose to:

* update the credentials for the existing service principal used by the cluster, or
* create a service principal and update the cluster to use these new credentials.

If you want to create a service principal and then update the AKS cluster, skip the rest of the steps in this section and continue to [create a service principal](#create-a-service-principal). If you want to update the credentials for the existing service principal used by the AKS cluster, continue with the steps in this section.

### Get the service principal ID

To update the credentials for the existing service principal, get the service principal ID of your cluster using the [az aks show][az-aks-show] command. The following example gets the ID for the cluster named *myAKSCluster* in the *myResourceGroup* resource group. The service principal ID is set as a variable named *SP_ID* for use in additional command.

```azurecli-interactive
SP_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)
```

### Update the service principal credentials

With a variable set that contains the service principal ID, now reset the credentials using [az ad sp credential reset][az-ad-sp-credential-reset]. The following example lets the Azure platform generate a new secure secret for the service principal. This new secure secret is also stored as a variable.

```azurecli-interactive
SP_SECRET=$(az ad sp credential reset --name $SP_ID --query password -o tsv)
```

Now continue on to [update AKS cluster with new credentials](#update-aks-cluster-with-new-credentials).

## Create a service principal

If you chose to update the existing service principal credentials in the previous section, skip this step. Continue to [update AKS cluster with new credentials](#update-aks-cluster-with-new-credentials).

To create a service principal and then update the AKS cluster to use these new credentials, use the [az ad sp create-for-rbac][az-ad-sp-create] command. In the following example, the `--skip-assignment` parameter prevents any additional default assignments being assigned:

```azurecli-interactive
az ad sp create-for-rbac --skip-assignment
```

The output is similar to the following example. Make a note of your own `appId` and `password`. These values are used in the next step.

```json
{
  "appId": "7d837646-b1f3-443d-874c-fd83c7c739c5",
  "name": "7d837646-b1f3-443d-874c-fd83c7c739c",
  "password": "a5ce83c9-9186-426d-9183-614597c7f2f7",
  "tenant": "a4342dc8-cd0e-4742-a467-3129c469d0e5"
}
```

Now define variables for the service principal ID and client secret using the output from your own [az ad sp create-for-rbac][az-ad-sp-create] command, as shown in the following example. The *SP_ID* is your *appId*, and the *SP_SECRET* is your *password*:

```azurecli-interactive
SP_ID=7d837646-b1f3-443d-874c-fd83c7c739c5
SP_SECRET=a5ce83c9-9186-426d-9183-614597c7f2f7
```

## Update AKS cluster with new credentials

Regardless of whether you chose to update the credentials for the existing service principal or create a service principal, you now update the AKS cluster with your new credentials using the [az aks update-credentials][az-aks-update-credentials] command. The variables for the *--service-principal* and *--client-secret* are used:

```azurecli-interactive
az aks update-credentials \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --reset-service-principal \
    --service-principal $SP_ID \
    --client-secret $SP_SECRET
```

It takes a few moments for the service principal credentials to be updated in the AKS.

## Next steps

In this article, the service principal for the AKS cluster itself was updated. For more information on how to manage identity for workloads within a cluster, see [Best practices for authentication and authorization in AKS][best-practices-identity].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-update-credentials]: /cli/azure/aks#az-aks-update-credentials
[best-practices-identity]: operator-best-practices-identity.md
[az-ad-sp-create]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az-ad-sp-credential-reset]: /cli/azure/ad/sp/credential#az-ad-sp-credential-reset
