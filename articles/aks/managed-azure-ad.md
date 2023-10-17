---
title: AKS-managed Microsoft Entra integration
description: Learn how to configure Microsoft Entra ID for your Azure Kubernetes Service (AKS) clusters.
ms.topic: article
ms.date: 07/28/2023
ms.custom: devx-track-azurecli
ms.author: miwithro
---

# AKS-managed Microsoft Entra integration

AKS-managed Microsoft Entra integration simplifies the Microsoft Entra integration process. Previously, you were required to create a client and server app, and the Microsoft Entra tenant had to grant Directory Read permissions. Now, the AKS resource provider manages the client and server apps for you.

Cluster administrators can configure Kubernetes role-based access control (Kubernetes RBAC) based on a user's identity or directory group membership. Microsoft Entra authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [OpenID Connect documentation][open-id-connect].

Learn more about the Microsoft Entra integration flow in the [Microsoft Entra documentation](concepts-identity.md#azure-ad-integration).

## Limitations

* AKS-managed Microsoft Entra integration can't be disabled.
* Changing an AKS-managed Microsoft Entra integrated cluster to legacy Microsoft Entra ID isn't supported.
* Clusters without Kubernetes RBAC enabled aren't supported with AKS-managed Microsoft Entra integration.

## Before you begin

* Make sure you have Azure CLI version 2.29.0 or later is installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* You need `kubectl` with a minimum version of [1.18.1](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1181) or [`kubelogin`][kubelogin]. With the Azure CLI and the Azure PowerShell module, these two commands are included and automatically managed. Meaning, they are upgraded by default and running `az aks install-cli` isn't required or recommended. If you are using an automated pipeline, you need to manage upgrading to the correct or latest version. The difference between the minor versions of Kubernetes and `kubectl` shouldn't be more than *one* version. Otherwise, you'll experience authentication issues if you don't use the correct version.
* If you're using [helm](https://github.com/helm/helm), you need a minimum version of helm 3.3.
* This configuration requires you have a Microsoft Entra group for your cluster. This group is registered as an admin group on the cluster to grant admin permissions. If you don't have an existing Microsoft Entra group, you can create one using the [`az ad group create`](/cli/azure/ad/group#az_ad_group_create) command.

> [!NOTE]
> Microsoft Entra integrated clusters using a Kubernetes version newer than version 1.24 automatically use the `kubelogin` format. Starting with Kubernetes version 1.24, the default format of the clusterUser credential for Microsoft Entra ID clusters is `exec`, which requires [`kubelogin`][kubelogin] binary in the execution PATH. There is no behavior change for non-Microsoft Entra clusters, or Microsoft Entra ID clusters running a version older than 1.24.
> Existing downloaded `kubeconfig` continues to work. An optional query parameter **format** is included when getting clusterUser credential to overwrite the default behavior change. You can explicitly specify format to **azure** if you need to maintain the old `kubeconfig` format .

<a name='enable-aks-managed-azure-ad-integration-on-your-aks-cluster'></a>

## Enable AKS-managed Microsoft Entra integration on your AKS cluster

### Create a new cluster

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location centralus
    ```

2. Create an AKS cluster and enable administration access for your Microsoft Entra group using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
    ```

    A successful creation of an AKS-managed Microsoft Entra ID cluster has the following section in the response body:

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

### Use an existing cluster

Enable AKS-managed Microsoft Entra integration on your existing Kubernetes RBAC enabled cluster using the [`az aks update`][az-aks-update] command. Make sure to set your admin group to keep access on your cluster.

```azurecli-interactive
az aks update -g MyResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id-1>,<id-2> [--aad-tenant-id <id>]
```

A successful activation of an AKS-managed Microsoft Entra ID cluster has the following section in the response body:

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

<a name='upgrade-a-legacy-azure-ad-cluster-to-aks-managed-azure-ad-integration'></a>

### Upgrade a legacy Microsoft Entra ID cluster to AKS-managed Microsoft Entra integration

If your cluster uses legacy Microsoft Entra integration, you can upgrade to AKS-managed Microsoft Entra integration using the [`az aks update`][az-aks-update] command.

> [!WARNING]
> Free tier clusters may experience API server downtime during the upgrade. We recommend upgrading during your nonbusiness hours. 
> After the upgrade, the kubeconfig content changes. You need to run `az aks get-credentials --resource-group <AKS resource group name> --name <AKS cluster name>` to merge the new credentials into the kubeconfig file. 

```azurecli-interactive
az aks update -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
```

A successful migration of an AKS-managed Microsoft Entra ID cluster has the following section in the response body:

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

<a name='access-your-aks-managed-azure-ad-enabled-cluster'></a>

## Access your AKS-managed Microsoft Entra ID enabled cluster

1. Get the user credentials to access your cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

2. Follow the instructions to sign in.

3. View the nodes in the cluster using the `kubectl get nodes` command.

    ```azurecli-interactive
    kubectl get nodes
    ```

## Non-interactive sign-in with kubelogin

There are some non-interactive scenarios, such as continuous integration pipelines, that aren't currently available with `kubectl`. You can use [`kubelogin`][kubelogin] to connect to the cluster with a non-interactive service principal credential.

> [!NOTE]
> Microsoft Entra integrated clusters using a Kubernetes version newer than version 1.24 automatically use the `kubelogin` format. Starting with Kubernetes version 1.24, the default format of the clusterUser credential for Microsoft Entra ID clusters is `exec`, which requires [`kubelogin`][kubelogin] binary in the execution PATH. There is no behavior change for non-Microsoft Entra clusters, or Microsoft Entra ID clusters running a version older than 1.24.
> Existing downloaded `kubeconfig` continues to work. An optional query parameter **format** is included when getting clusterUser credential to overwrite the default behavior change. You can explicitly specify format to **azure** if you need to maintain the old `kubeconfig` format .

* When getting the clusterUser credential, you can use the `format` query parameter to overwrite the default behavior. You can set the value to `azure` to use the original kubeconfig format:

    ```azurecli-interactive
    az aks get-credentials --format azure
    ```

* If your Microsoft Entra integrated cluster uses Kubernetes version 1.24 or lower, you need to manually convert the kubeconfig format.

    ```azurecli-interactive
    export KUBECONFIG=/path/to/kubeconfig
    kubelogin convert-kubeconfig
    ```

> [!NOTE]
> If you receive the message **error: The Azure auth plugin has been removed.**, you need to run the command `kubelogin convert-kubeconfig` to convert the kubeconfig format manually.
>
> For more information, you can refer to [Azure Kubelogin Known Issues][azure-kubelogin-known-issues].

<a name='troubleshoot-access-issues-with-aks-managed-azure-ad'></a>

## Troubleshoot access issues with AKS-managed Microsoft Entra ID

> [!IMPORTANT]
> The steps described in this section bypass the normal Microsoft Entra group authentication. Use them only in an emergency.

If you're permanently blocked by not having access to a valid Microsoft Entra group with access to your cluster, you can still get admin credentials to directly access the cluster. You need to have access to the [Azure Kubernetes Service Cluster Admin](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) built-in role.

## Next steps

* Learn about [Microsoft Entra integration with Kubernetes RBAC][azure-ad-rbac].
* Learn more about [AKS and Kubernetes identity concepts][aks-concepts-identity].
* Use [Azure Resource Manager (ARM) templates][aks-arm-template] to create AKS-managed Microsoft Entra ID enabled clusters.

<!-- LINKS - external -->
[aks-arm-template]: /azure/templates/microsoft.containerservice/managedclusters
[kubelogin]: https://github.com/Azure/kubelogin
[azure-kubelogin-known-issues]: https://azure.github.io/kubelogin/known-issues.html

<!-- LINKS - Internal -->
[aks-concepts-identity]: concepts-identity.md
[azure-ad-rbac]: azure-ad-rbac.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-group-create]: /cli/azure/group#az_group_create
[open-id-connect]:../active-directory/develop/v2-protocols-oidc.md
[az-aks-update]: /cli/azure/aks#az_aks_update
