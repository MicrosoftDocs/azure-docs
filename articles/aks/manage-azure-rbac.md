---
title: Use Azure RBAC for Kubernetes Authorization
titleSuffix: Azure Kubernetes Service
description: Learn how to use Azure role-based access control (Azure RBAC) for Kubernetes Authorization with Azure Kubernetes Service (AKS).
ms.topic: article
ms.subservice: aks-security
ms.custom: devx-track-azurecli
ms.date: 03/02/2023
ms.author: jpalma
author: palma21
#Customer intent: As a cluster operator or developer, I want to learn how to leverage Azure RBAC permissions to authorize actions within the AKS cluster.
---

# Use Azure role-based access control for Kubernetes Authorization

This article covers how to use Azure RBAC for Kubernetes Authorization, which allows for the unified management and access control across Azure resources, AKS, and Kubernetes resources. For more information, see [Azure RBAC for Kubernetes Authorization][kubernetes-rbac].

> [!NOTE]
> When using [integrated authentication between Microsoft Entra ID and AKS](managed-azure-ad.md), you can use Microsoft Entra users, groups, or service principals as subjects in [Kubernetes role-based access control (Kubernetes RBAC)][kubernetes-rbac]. With this feature, you don't need to separately manage user identities and credentials for Kubernetes. However, you still need to set up and manage Azure RBAC and Kubernetes RBAC separately.

## Before you begin

* You need the Azure CLI version 2.24.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* You need `kubectl`, with a minimum version of [1.18.3](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1183).
* You need managed Microsoft Entra integration enabled on your cluster before you can add Azure RBAC for Kubernetes authorization. If you need to enable managed Microsoft Entra integration, see [Use Microsoft Entra ID in AKS](managed-azure-ad.md).
* If you have CRDs and are making custom role definitions, the only way to cover CRDs today is to use `Microsoft.ContainerService/managedClusters/*/read`. For the remaining objects, you can use the specific API groups, such as `Microsoft.ContainerService/apps/deployments/read`.
* New role assignments can take *up to five minutes* to propagate and be updated by the authorization server.
* Azure RBAC for Kubernetes Authorization requires that the Microsoft Entra tenant configured for authentication is same as the tenant for the subscription that holds your AKS cluster.

<a name='create-a-new-aks-cluster-with-managed-azure-ad-integration-and-azure-rbac-for-kubernetes-authorization'></a>

## Create a new AKS cluster with managed Microsoft Entra integration and Azure RBAC for Kubernetes Authorization

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    export RESOURCE_GROUP=<resource-group-name>
    export LOCATION=<azure-region>

    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

2. Create an AKS cluster with managed Microsoft Entra integration and Azure RBAC for Kubernetes Authorization using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    export CLUSTER_NAME=<cluster-name>

    az aks create \
        --resource-group $RESOURCE_GROUP \
        --name $CLUSTER_NAME \
        --enable-aad \
        --enable-azure-rbac \
        --generate-ssh-keys
    ```

    Your output should look similar to the following example output:

    ```output
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

* Enable Azure RBAC for Kubernetes Authorization on an existing AKS cluster using the [`az aks update`][az-aks-update] command with the `--enable-azure-rbac` flag.

    ```azurecli-interactive
    az aks update --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --enable-azure-rbac
    ```

## Disable Azure RBAC for Kubernetes Authorization from an AKS cluster

* Remove Azure RBAC for Kubernetes Authorization from an existing AKS cluster using the [`az aks update`][az-aks-update] command with the `--disable-azure-rbac` flag.

    ```azurecli-interactive
    az aks update --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --disable-azure-rbac
    ```

## AKS built-in roles

AKS provides the following built-in roles:

| Role                                | Description  |
|-------------------------------------|--------------|
| Azure Kubernetes Service RBAC Reader  | Allows read-only access to see most objects in a namespace. It doesn't allow viewing roles or role bindings. This role doesn't allow viewing `Secrets`, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation).  |
| Azure Kubernetes Service RBAC Writer | Allows read/write access to most objects in a namespace. This role doesn't allow viewing or modifying roles or role bindings. However, this role allows accessing `Secrets` and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. |
| Azure Kubernetes Service RBAC Admin  | Allows admin access, intended to be granted within a namespace. Allows read/write access to most resources in a namespace (or cluster scope), including the ability to create roles and role bindings within the namespace. This role doesn't allow write access to resource quota or to the namespace itself. |
| Azure Kubernetes Service RBAC Cluster Admin  | Allows super-user access to perform any action on any resource. It gives full control over every resource in the cluster and in all namespaces. |

## Create role assignments for cluster access

### [Azure CLI](#tab/azure-cli)

1. Get your AKS resource ID using the [`az aks show`][az-aks-show] command.

    ```azurecli
    AKS_ID=$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query id --output tsv)
    ```

2. Create a role assignment using the [`az role assignment create`][az-role-assignment-create] command. `<AAD-ENTITY-ID>` can be a username or the client ID of a service principal. The following example creates a role assignment for the *Azure Kubernetes Service RBAC Admin* role.

    ```azurecli-interactive
    az role assignment create --role "Azure Kubernetes Service RBAC Admin" --assignee <AAD-ENTITY-ID> --scope $AKS_ID
    ```

    > [!NOTE]
    > You can create the *Azure Kubernetes Service RBAC Reader* and *Azure Kubernetes Service RBAC Writer* role assignments scoped to a specific namespace within the cluster using the [`az role assignment create`][az-role-assignment-create] command and setting the scope to the desired namespace.
    >
    > ```azurecli-interactive
    > az role assignment create --role "Azure Kubernetes Service RBAC Reader" --assignee <AAD-ENTITY-ID> --scope $AKS_ID/namespaces/<namespace-name>
    > ```

### [Azure portal](#tab/azure-portal)

1. Navigate to your AKS cluster resource and select **Access control (IAM)** > **Add role assignment**.
2. On the **Role** tab, select the desired role, such as *Azure Kubernetes Service RBAC Admin*, and then select **Next**.
3. On the **Members** tab, configure the following settings:

    * **Assign access to**: Select **User, group, or service principal**.
    * **Members**: Select **+ Select members**, search for and select the desired members, and then select **Select**.

4. Select **Review + assign** > **Assign**.

    > [!NOTE]
    > In Azure portal, after creating role assignments scoped to a desired namespace, you won't be able to see "role assignments" for namespace [at a scope][list-role-assignments-at-a-scope-at-portal]. You can find it by using the [`az role assignment list`][az-role-assignment-list] command, or [list role assignments for a user or group][list-role-assignments-for-a-user-or-group-at-portal], which you assigned the role to.
    >
    > ```azurecli-interactive
    > az role assignment list --scope $AKS_ID/namespaces/<namespace-name>
    > ```

---

## Create custom roles definitions

The following example custom role definition allows a user to only read deployments and nothing else. For the full list of possible actions, see [Microsoft.ContainerService operations](../role-based-access-control/resource-provider-operations.md#microsoftcontainerservice).

1. To create your own custom role definitions, copy the following file, replacing `<YOUR SUBSCRIPTION ID>` with your own subscription ID, and then save it as `deploy-view.json`.

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

2. Create the role definition using the [`az role definition create`][az-role-definition-create] command, setting the `--role-definition` to the `deploy-view.json` file you created in the previous step.

    ```azurecli-interactive
    az role definition create --role-definition @deploy-view.json 
    ```

3. Assign the role definition to a user or other identity using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --role "AKS Deployment Reader" --assignee <AAD-ENTITY-ID> --scope $AKS_ID
    ```

## Use Azure RBAC for Kubernetes Authorization with `kubectl`

1. Make sure you have the [Azure Kubernetes Service Cluster User](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) built-in role, and then get the kubeconfig of your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
    ```

2. You can now use `kubectl` to manage your cluster. For example, you can list the nodes in your cluster using `kubectl get nodes`.

    ```azurecli-interactive
    kubectl get nodes
    ```

    Example output:

    ```output
    NAME                                STATUS   ROLES   AGE    VERSION
    aks-nodepool1-93451573-vmss000000   Ready    agent   3h6m   v1.15.11
    aks-nodepool1-93451573-vmss000001   Ready    agent   3h6m   v1.15.11
    aks-nodepool1-93451573-vmss000002   Ready    agent   3h6m   v1.15.11
    ```

## Use Azure RBAC for Kubernetes Authorization with `kubelogin`

AKS created the [`kubelogin`](https://github.com/Azure/kubelogin) plugin to help unblock scenarios such as non-interactive logins, older `kubectl` versions, or leveraging SSO across multiple clusters without the need to sign in to a new cluster.

1. Use the `kubelogin` plugin by running the following command:

    ```azurecli-interactive
    export KUBECONFIG=/path/to/kubeconfig
    kubelogin convert-kubeconfig
    ```

2. You can now use `kubectl` to manage your cluster. For example, you can list the nodes in your cluster using `kubectl get nodes`.

    ```azurecli-interactive
    kubectl get nodes
    ```

    Example output:

    ```output
    NAME                                STATUS   ROLES   AGE    VERSION
    aks-nodepool1-93451573-vmss000000   Ready    agent   3h6m   v1.15.11
    aks-nodepool1-93451573-vmss000001   Ready    agent   3h6m   v1.15.11
    aks-nodepool1-93451573-vmss000002   Ready    agent   3h6m   v1.15.11
    ```

## Clean up resources

### Delete role assignment

### [Azure CLI](#tab/azure-cli)

1. List role assignments using the [`az role assignment list`][az-role-assignment-list] command.

    ```azurecli-interactive
    az role assignment list --scope $AKS_ID --query [].id --output tsv
    ```

2. Delete role assignments using the [`az role assignment delete`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment delete --ids <LIST OF ASSIGNMENT IDS>
    ```

### [Azure portal](#tab/azure-portal)

1. Navigate to your AKS cluster resource and select **Access control (IAM)** > **Role assignments**.
2. Select the role assignment you want to delete, and then select **Delete** > **Yes**.

---

### Delete role definition

* Delete the custom role definition using the [`az role definition delete`][az-role-definition-create] command.

    ```azurecli-interactive
    az role definition delete --name "AKS Deployment Reader"
    ```

### Delete resource group and AKS cluster

### [Azure CLI](#tab/azure-cli)

* Delete the resource group and AKS cluster using the [`az group delete`][az-group-create] command.

    ```azurecli-interactive
    az group delete --name $RESOURCE_GROUP --yes --no-wait
    ```

### [Azure portal](#tab/azure-portal)

1. Navigate to the resource group that contains your AKS cluster and select **Delete resource group**.
2. On the **Delete a resource group** page, enter the resource group name, and then select **Delete** > **Delete**.

---

## Next steps

To learn more about AKS authentication, authorization, Kubernetes RBAC, and Azure RBAC, see:

* [Access and identity options for AKS](/azure/aks/concepts-identity)
* [What is Azure RBAC?](../role-based-access-control/overview.md)
* [Microsoft.ContainerService operations](../role-based-access-control/resource-provider-operations.md#microsoftcontainerservice)

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-show]: /cli/azure/aks#az-aks-show
[list-role-assignments-at-a-scope-at-portal]: ../role-based-access-control/role-assignments-list-portal.yml#list-role-assignments-at-a-scope
[list-role-assignments-for-a-user-or-group-at-portal]: ../role-based-access-control/role-assignments-list-portal.yml#list-role-assignments-for-a-user-or-group
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-role-assignment-list]: /cli/azure/role/assignment#az-role-assignment-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[managed-aad]: ./managed-azure-ad.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-role-definition-create]: /cli/azure/role/definition#az-role-definition-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[kubernetes-rbac]: /azure/aks/concepts-identity#azure-rbac-for-kubernetes-authorization
