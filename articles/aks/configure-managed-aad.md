---
title: Configure AKS-managed Azure Active Directory integration for your clusters
description: Learn how to configure Azure AD in your Azure Kubernetes Service (AKS) clusters.
ms.topic: article
ms.date: 04/20/2023
ms.custom: devx-track-azurecli
---

# Configure AKS-managed Azure Active Directory integration for your clusters

## Before you begin

* Make sure Azure CLI version 2.29.0 or later is installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* You need `kubectl`, with a minimum version of [1.18.1](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1181) or [`kubelogin`](https://github.com/Azure/kubelogin). The difference between the minor versions of Kubernetes and `kubectl` shouldn't be more than 1 version. You'll experience authentication issues if you don't use the correct version.
* If you're using [helm](https://github.com/helm/helm), you need a minimum version of helm 3.3.
* This article requires that you have an Azure AD group for your cluster. This group will be registered as an admin group on the cluster to grant cluster admin permissions. If you don't have an existing Azure AD group, you can create one using the [`az ad group create`](/cli/azure/ad/group#az_ad_group_create) command.

## Create an AKS cluster with Azure AD enabled

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location centralus
    ```

2. Create an AKS cluster and enable administration access for your Azure AD group using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
    ```

    A successful creation of an AKS-managed Azure AD cluster has the following section in the response body:

    ```output
    "AADProfile": {
        "adminGroupObjectIds": [
        "5d24****-****-****-****-****afa27aed"
        ],
        "clientAppId": null,
        "managed": true,
        "serverAppId": null,
        "serverAppSecret": null,
        "tenantId": "72f9****-****-****-****-****d011db47"
    }
    ```

## Enable AKS-managed Azure AD integration on your existing cluster

Enable AKS-managed Azure AD integration on your existing Kubernetes RBAC enabled cluster using the [`az aks update`][az-aks-update] command. Make sure to set your admin group to keep access on your cluster.

```azurecli-interactive
az aks update -g MyResourceGroup -n MyManagedCluster --enable-aad --aad-admin-group-object-ids <id-1> [--aad-tenant-id <id>]
```

A successful activation of an AKS-managed Azure AD cluster has the following section in the response body:

```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

Download user credentials again to access your cluster by following the steps in [access an Azure AD enabled cluster][access-cluster].

## Upgrade to AKS-managed Azure AD integration

If your cluster uses legacy Azure AD integration, you can upgrade to AKS-managed Azure AD integration with no downtime using the [`az aks update`][az-aks-update] command.

```azurecli-interactive
az aks update -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
```

A successful migration of an AKS-managed Azure AD cluster has the following section in the response body:

```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

In order to access the cluster, follow the steps in [access an Azure AD enabled cluster][access-cluster] to update kubeconfig.

## Access an Azure AD enabled cluster

Before you access the cluster using an Azure AD defined group, you need the [Azure Kubernetes Service Cluster User](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) built-in role.

1. Get the user credentials to access the cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

2. Follow the instructions to sign in.

3. Use the `kubectl get nodes` command to view nodes in the cluster.

    ```azurecli-interactive
    kubectl get nodes
    ```

4. Set up [Azure role-based access control (Azure RBAC)](./azure-ad-rbac.md) to configure other security groups for your clusters.

## Troubleshooting access issues with Azure AD

> [!IMPORTANT]
> The steps described in this section bypass the normal Azure AD group authentication. Use them only in an emergency.

If you're permanently blocked by not having access to a valid Azure AD group with access to your cluster, you can still obtain the admin credentials to access the cluster directly. You need to have access to the [Azure Kubernetes Service Cluster Admin](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) built-in role.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myManagedCluster --admin
```

