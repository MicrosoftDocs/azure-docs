---
title: Use OIDC Issuer on Azure Kubernetes Service (AKS)
description: Learn about OIDC Issuer for Azure Kubernetes Service (AKS).  
services: container-service
ms.topic: article
ms.date: 12/20/2022
---

# Use OIDC Issuer on Azure Kubernetes Service (AKS)

You can enable an OIDC Issuer URL of the provider, which allows the API server to discover public signing keys. The maximum lifetime of the token issued by the OIDC provider is 1 day.

> [!WARNING]
> Enable or disable OIDC Issuer changes the current service account token issuer to a new value, which can cause down time and restarts the API server. If the application pods using a service token remain in a failed state after you enable or disable the OIDC Issuer, we recommend you manually restart the pods.

## Prerequisites

* The Azure CLI version 2.42.0 or higher. Run `az --version` to find your version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* AKS version 1.22 and higher. If your cluster is running version 1.21 and the OIDC Issuer preview is enabled, we recommend you upgrade the cluster to the minimum required version supported.

## Create an AKS cluster with OIDC Issuer

Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer (preview). The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

```azurecli-interactive
az aks create -g myResourceGroup -n myAKSCluster --node-count 1 --enable-oidc-issuer
```

## Update an AKS cluster with OIDC Issuer

Update an AKS cluster using the [az aks update][az-aks-update] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer (preview). The following example updates a cluster named *myAKSCluster*:

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster --enable-oidc-issuer 
```

## Show the OIDC Issuer URL

To get the OIDC Issuer URL, run the following command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks show -n myAKScluster -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv
```

## Rotate the OIDC key

To rotate the OIDC key, perform the following command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks oidc-issuer rotate-signing-keys -n myAKSCluster -g myResourceGroup
```

> [!IMPORTANT]
> Once you rotate the key, the old key (key1) expires after 24 hours. This means that both the old key (key1) and the new key (key2) are valid within the 24-hour period. If you want to invalidate the old key (key1) immediately, you need to rotate the OIDC key twice. Then key2 and key3 are valid, and key1 is invalid.
