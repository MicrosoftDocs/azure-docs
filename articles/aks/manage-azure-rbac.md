---
title: Use Azure RBAC for Kubernetes Authorization
titleSuffix: Azure Kubernetes Service
description: Learn how to use Azure role-based access control (Azure RBAC) for Kubernetes Authorization with Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/02/2023
ms.author: jpalma
author: palma21
#Customer intent: As a cluster operator or developer, I want to learn how to leverage Azure RBAC permissions to authorize actions within the AKS cluster.
---

# Use Azure role-based access control for Kubernetes Authorization

When you leverage [integrated authentication between Azure Active Directory (Azure AD) and AKS](managed-azure-ad.md), you can use Azure AD users, groups, or service principals as subjects in [Kubernetes role-based access control (Kubernetes RBAC)][kubernetes-rbac]. This feature frees you from having to separately manage user identities and credentials for Kubernetes. However, you still have to set up and manage Azure RBAC and Kubernetes RBAC separately.

This article covers how to use Azure RBAC for Kubernetes Authorization, which allows for the unified management and access control across Azure resources, AKS, and Kubernetes resources. For more information, see [Azure RBAC for Kubernetes Authorization][kubernetes-rbac].

## Before you begin

* You need the Azure CLI version 2.24.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* You need `kubectl`, with a minimum version of [1.18.3](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1183).
* You need managed Azure AD integration enabled on your cluster before you can add Azure RBAC for Kubernetes authorization. If you need to enable managed Azure AD integration, see [Use Azure AD in AKS](managed-azure-ad.md).
* If you have CRDs and are making custom role definitions, the only way to cover CRDs today is to use `Microsoft.ContainerService/managedClusters/*/read`. For the remaining objects, you can use the specific API groups, such as `Microsoft.ContainerService/apps/deployments/read`.
* New role assignments can take up to five minutes to propagate and be updated by the authorization server.
* Azure RBAC for Kubernetes Authorization requires that the Azure AD tenant configured for authentication is same as the tenant for the subscription that holds your AKS cluster.

## Create a new AKS cluster with managed Azure AD integration and Azure RBAC for Kubernetes Authorization

Create an Azure resource group using the [`az group create`][az-group-create] command.

```azurecli-interactive
az group create --name myResourceGroup --location westus2
```

Create an AKS cluster with managed Azure AD integration and Azure RBAC for Kubernetes Authorization using the [`az aks create`][az-aks-create] command.

```azurecli-interactive
az aks create -g myResourceGroup -n myManagedCluster --enable-aad --enable-azure-rbac
```

The output will look similar to the following example output:

```json
"AADProfile": {
    "adminGroupObjectIds": null,
    "clientAppId": null,
    "enableAzureRbac": true,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "****-****-****-****-****"
}
```

## Enable Azure RBAC on an existing AKS cluster

Add Azure RBAC for Kubernetes Authorization into an existing AKS cluster using the [`az aks update`][az-aks-update] command with the `enable-azure-rbac` flag.

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster --enable-azure-rbac
```

## Disable Azure RBAC for Kubernetes Authorization from an AKS cluster

Remove Azure RBAC for Kubernetes Authorization from an existing AKS cluster using the [`az aks update`][az-aks-update] command with the `disable-azure-rbac` flag.

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster --disable-azure-rbac
```

## Create role assignments for users to access the cluster

AKS provides the following built-in roles:

| Role                                | Description  |
|-------------------------------------|--------------|
| Azure Kubernetes Service RBAC Reader  | Allows read-only access to see most objects in a namespace. It doesn't allow viewing roles or role bindings. This role doesn't allow viewing `Secrets`, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation).  |
| Azure Kubernetes Service RBAC Writer | Allows read/write access to most objects in a namespace. This role doesn't allow viewing or modifying roles or role bindings. However, this role allows accessing `Secrets` and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. |
| Azure Kubernetes Service RBAC Admin  | Allows admin access, intended to be granted within a namespace. Allows read/write access to most resources in a namespace (or cluster scope), including the ability to create roles and role bindings within the namespace. This role doesn't allow write access to resource quota or to the namespace itself. |
| Azure Kubernetes Service RBAC Cluster Admin  | Allows super-user access to perform any action on any resource. It gives full control over every resource in the cluster and in all namespaces. |

Roles assignments scoped to the **entire AKS cluster** can be done either on the Access Control (IAM) blade of the cluster resource on Azure portal or by using the following Azure CLI commands:

Get your AKS resource ID using the [`az aks show`][az-aks-show] command.

```azurecli
AKS_ID=$(az aks show -g myResourceGroup -n myManagedCluster --query id -o tsv)
```

Create a role assignment using the [`az role assignment create`][az-role-assignment-create] command. `<AAD-ENTITY-ID>` can be a username or the client ID of a service principal.

```azurecli-interactive
az role assignment create --role "Azure Kubernetes Service RBAC Admin" --assignee <AAD-ENTITY-ID> --scope $AKS_ID
```

> [!NOTE]
> You can create the *Azure Kubernetes Service RBAC Reader* and *Azure Kubernetes Service RBAC Writer* role assignments scoped to a specific namespace within the cluster using the [`az role assignment create`][az-role-assignment-create] command and setting the scope to the desired namespace.
>
> ```azurecli-interactive
> az role assignment create --role "Azure Kubernetes Service RBAC Reader" --assignee <AAD-ENTITY-ID> --scope $AKS_ID/namespaces/<namespace-name>
> ```

## Create custom roles definitions

The following example custom role definition allows a user to only read deployments and nothing else. For the full list of possible actions, see [Microsoft.ContainerService operations](../role-based-access-control/resource-provider-operations.md#microsoftcontainerservice).

To create your own custom role definitions, copy the following file, replacing `<YOUR SUBSCRIPTION ID>` with your own subscription ID, and then save it as `deploy-view.json`.

```json
{
    "Name": "AKS Deployment Reader",
    "Description": "Lets you view all deployments in cluster/namespace.",
    "Actions": [],
    "NotActions": [],
    "DataActions": [
        "Microsoft.ContainerService/managedClusters/apps/deployments/read"
    ],
    "NotDataActions": [],
    "assignableScopes": [
        "/subscriptions/<YOUR SUBSCRIPTION ID>"
    ]
}
```

Create the role definition using the [`az role definition create`][az-role-definition-create] command, setting the `--role-definition` to the `deploy-view.json` file you created in the previous step.

```azurecli-interactive
az role definition create --role-definition @deploy-view.json 
```

Assign the role definition to a user or other identity using the [`az role assignment create`][az-role-assignment-create] command.

```azurecli-interactive
az role assignment create --role "AKS Deployment Reader" --assignee <AAD-ENTITY-ID> --scope $AKS_ID
```

## Use Azure RBAC for Kubernetes Authorization with `kubectl`

Make sure you have the [Azure Kubernetes Service Cluster User](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) built-in role, and then get the kubeconfig of your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

```azurecli-interactive
az aks get-credentials -g myResourceGroup -n myManagedCluster
```

Now, you can use `kubectl` manage your cluster. For example, you can list the nodes in your cluster using `kubectl get nodes`. The first time you run it, you'll need to sign in, as shown in the following example:

```azurecli-interactive
kubectl get nodes
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.

NAME                                STATUS   ROLES   AGE    VERSION
aks-nodepool1-93451573-vmss000000   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000001   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000002   Ready    agent   3h6m   v1.15.11
```

## Use Azure RBAC for Kubernetes Authorization with `kubelogin`

AKS created the [`kubelogin`](https://github.com/Azure/kubelogin) plugin to help unblock additional scenarios, such as non-interactive logins, older `kubectl` versions, or leveraging SSO across multiple clusters without the need to sign in to a new cluster.

You can use the `kubelogin` plugin by running the following command:

```bash
export KUBECONFIG=/path/to/kubeconfig
kubelogin convert-kubeconfig
```

Similar to `kubectl`, you need to log in the first time you run it, as shown in the following example:

```bash
kubectl get nodes
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.

NAME                                STATUS   ROLES   AGE    VERSION
aks-nodepool1-93451573-vmss000000   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000001   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000002   Ready    agent   3h6m   v1.15.11
```

## Clean up resources

### Delete role assignment

```azurecli-interactive
# List role assignments
az role assignment list --scope $AKS_ID --query [].id -o tsv

# Delete role assignments
az role assignment delete --ids <LIST OF ASSIGNMENT IDS>
```

### Delete role definition

```azurecli-interactive
az role definition delete -n "AKS Deployment Reader"
```

### Delete resource group and AKS cluster

```azurecli-interactive
az group delete -n myResourceGroup
```

## Next steps

To learn more about AKS authentication, authorization, Kubernetes RBAC, and Azure RBAC, see:

* [Access and identity options for AKS](/azure/aks/concepts-identity)
* [What is Azure RBAC?](../role-based-access-control/overview.md)
* [Microsoft.ContainerService operations](../role-based-access-control/resource-provider-operations.md#microsoftcontainerservice)

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[managed-aad]: ./managed-azure-ad.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-role-definition-create]: /cli/azure/role/definition#az_role_definition_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get-credentials
[kubernetes-rbac]: /azure/aks/concepts-identity#azure-rbac-for-kubernetes-authorization
