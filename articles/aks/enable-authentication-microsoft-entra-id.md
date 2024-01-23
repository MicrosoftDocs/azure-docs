---
title: Enable managed identity authentication on Azure Kubernetes Service
description: Learn how to enable Microsoft Entra ID on Azure Kubernetes Service with kubelogin and authenticate Azure users with credentials or managed roles.
ms.topic: article
ms.date: 11/22/2023
ms.custom: devx-track-azurecli
ms.author: miwithro
---

# Enable Azure managed identity authentication for Kubernetes clusters with kubelogin

The AKS-managed Microsoft Entra integration simplifies the Microsoft Entra integration process. Previously, you were required to create a client and server app, and the Microsoft Entra tenant had to grant Directory Read permissions. Now, the AKS resource provider manages the client and server apps for you.

Cluster administrators can configure Kubernetes role-based access control (Kubernetes RBAC) based on a user's identity or directory group membership. Microsoft Entra authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [OpenID Connect documentation][open-id-connect].

Learn more about the Microsoft Entra integration flow in the [Microsoft Entra documentation](concepts-identity.md#azure-ad-integration).

## Limitations

The following are constraints integrating Azure managed identity authentication on AKS.

* Integration can't be disabled once added.
* Downgrades from an integrated cluster to the legacy Microsoft Entra ID clusters aren't supported.
* Clusters without Kubernetes RBAC support are unable to add the integration.

## Before you begin

The following requirements need to be met in order to properly install the AKS addon for managed identity.

* You have Azure CLI version 2.29.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* You need `kubectl` with a minimum version of [1.18.1](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1181) or [`kubelogin`][kubelogin]. With the Azure CLI and the Azure PowerShell module, these two commands are included and automatically managed. Meaning, they're upgraded by default and running `az aks install-cli` isn't required or recommended. If you're using an automated pipeline, you need to manage upgrades for the correct or latest version. The difference between the minor versions of Kubernetes and `kubectl` shouldn't be more than *one* version. Otherwise,  authentication issues occur on the wrong version.
* If you're using [helm](https://github.com/helm/helm), you need a minimum version of helm 3.3.
* This configuration requires you have a Microsoft Entra group for your cluster. This group is registered as an admin group on the cluster to grant admin permissions. If you don't have an existing Microsoft Entra group, you can create one using the [`az ad group create`](/cli/azure/ad/group#az_ad_group_create) command.

> [!NOTE]
> Microsoft Entra integrated clusters using a Kubernetes version newer than version 1.24 automatically use the `kubelogin` format. Starting with Kubernetes version 1.24, the default format of the clusterUser credential for Microsoft Entra ID clusters is `exec`, which requires [`kubelogin`][kubelogin] binary in the execution PATH. There is no behavior change for non-Microsoft Entra clusters, or Microsoft Entra ID clusters running a version older than 1.24.
> Existing downloaded `kubeconfig` continues to work. An optional query parameter **format** is included when getting clusterUser credential to overwrite the default behavior change. You can explicitly specify format to **azure** if you need to maintain the old `kubeconfig` format .

<a name='enable-the-integration-on-your-aks-cluster'></a>

## Enable the integration on your AKS cluster

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

<a name='migrate-a-legacy-azure-ad-cluster-to-integration'></a>

### Migrate legacy cluster to integration

If your cluster uses legacy Microsoft Entra integration, you can upgrade to AKS-managed Microsoft Entra integration through the [`az aks update`][az-aks-update] command.

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

<a name='access-your-enabled-cluster'></a>

## Access your enabled cluster

1. Get the user credentials to access your cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

2. Follow your instructions to sign in.

3. Set `kubelogin` to use the Azure CLI.

    ```azurecli-interactive
    kubelogin convert-kubeconfig -l azurecli
    ```

4. View the nodes in the cluster with the `kubectl get nodes` command.

    ```azurecli-interactive
    kubectl get nodes
    ```

## Non-interactive sign-in with kubelogin

There are some non-interactive scenarios that don't support `kubectl`. In these cases, use [`kubelogin`][kubelogin] to connect to the cluster with a non-interactive service principal credential to perform continuous integration pipelines.

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

<a name='troubleshoot-access-issues'></a>

## Troubleshoot access issues

> [!IMPORTANT]
> The step described in this section suggests an alternative authentication method compared to the normal Microsoft Entra group authentication. Use this option only in an emergency.

If you lack administrative access to a valid Microsoft Entra group, you can follow this workaround. Sign in with an account that is a member of the [Azure Kubernetes Service Cluster Admin](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) role and grant your group or tenant admin credentials to access your cluster.

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
