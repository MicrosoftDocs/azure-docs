---
title: Manage Azure RBAC in Kubernetes From Azure
titleSuffix: Azure Kubernetes Service
description: Learn how to use Azure RBAC for Kubernetes Authorization with Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 09/21/2020
ms.author: jpalma
author: palma21

#Customer intent: As a cluster operator or developer, I want to learn how to leverage Azure RBAC permissions to authorize actions within the AKS cluster.
---

# Use Azure RBAC for Kubernetes Authorization (preview)

Today you can already leverage [integrated authentication between Azure Active Directory (Azure AD) and AKS](managed-aad.md). When enabled, this integration allows customers to use Azure AD users, groups, or service principals as subjects in Kubernetes RBAC, see more [here](azure-ad-rbac.md).
This feature frees you from having to separately manage user identities and credentials for Kubernetes. However, you still have to set up and manage Azure RBAC and Kubernetes RBAC separately. For more details on authentication and authorization with RBAC on AKS, see [here](concepts-identity.md).

This document covers a new approach that allows for the unified management and access control across Azure Resources, AKS, and Kubernetes resources.

## Before you begin

The ability to manage RBAC for Kubernetes resources from Azure gives you the choice to manage RBAC for the cluster resources either using Azure or native Kubernetes mechanisms. When enabled, Azure AD principals will be validated exclusively by Azure RBAC while regular Kubernetes users and service accounts are exclusively validated by Kubernetes RBAC. For more details on authentication and authorization with RBAC on AKS, see [here](concepts-identity.md#azure-rbac-for-kubernetes-authorization-preview).

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Prerequisites 
- Ensure you have the Azure CLI version 2.9.0 or later
- Ensure you have the `EnableAzureRBACPreview` feature flag enabled.
- Ensure you have the `aks-preview` [CLI extension][az-extension-add] v0.4.55 or higher installed
- Ensure you have installed [kubectl v1.18.3+][az-aks-install-cli].

#### Register `EnableAzureRBACPreview` preview feature

To create an AKS cluster that uses Azure RBAC for Kubernetes Authorization, you must enable the `EnableAzureRBACPreview` feature flag on your subscription.

Register the `EnableAzureRBACPreview` feature flag using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EnableAzureRBACPreview"
```

 You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableAzureRBACPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

#### Install aks-preview CLI extension

To create an AKS cluster that uses Azure RBAC, you need the *aks-preview* CLI extension version 0.4.55 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, or install any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Limitations

- Requires [Managed Azure AD integration](managed-aad.md).
- You can't integrate Azure RBAC for Kubernetes authorization into existing clusters during preview, but you will be able to at General Availability (GA).
- Use [kubectl v1.18.3+][az-aks-install-cli].
- If you have CRDs and are making custom role definitions, the only way to cover CRDs today is to provide `Microsoft.ContainerService/managedClusters/*/read`. AKS is working on providing more granular permissions for CRDs. For the remaining objects you can use the specific API Groups, for example: `Microsoft.ContainerService/apps/deployments/read`.
- New role assignments can take up to 5min to propagate and be updated by the authorization server.
- Requires the Azure AD tenant configured for authentication to be the same as the tenant for the subscription that holds the AKS cluster. 

## Create a new cluster using Azure RBAC and managed Azure AD integration

Create an AKS cluster by using the following CLI commands.

Create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location westus2
```

Create the AKS cluster with managed Azure AD integration and Azure RBAC for Kubernetes Authorization.

```azurecli-interactive
# Create an AKS-managed Azure AD cluster
az aks create -g MyResourceGroup -n MyManagedCluster --enable-aad --enable-azure-rbac
```

A successful creation of a cluster with Azure AD integration and Azure RBAC for Kubernetes Authorization has the following section in the response body:

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

## Create role assignments for users to access cluster

AKS provides the following four built-in roles:


| Role                                | Description  |
|-------------------------------------|--------------|
| Azure  Kubernetes Service RBAC Reader  | Allows read-only access to see most objects in a namespace. It doesn't allow viewing roles or role bindings. This role doesn't allow viewing `Secrets`, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation)  |
| Azure Kubernetes Service RBAC  Writer | Allows read/write access to most objects in a namespace. This role doesn't allow viewing or modifying roles or role bindings. However, this role allows accessing `Secrets` and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. |
| Azure Kubernetes Service RBAC Admin  | Allows admin access, intended to be granted within a namespace. Allows read/write access to most resources in a namespace (or cluster scope), including the ability to create roles and role bindings within the namespace. This role doesn't allow write access to resource quota or to the namespace itself. |
| Azure Kubernetes Service RBAC Cluster Admin  | Allows super-user access to perform any action on any resource. It gives full control over every resource in the cluster and in all namespaces. |


Roles assignments scoped to the **entire AKS cluster** can be done either on the Access Control (IAM) blade of the cluster resource on Azure portal or by using Azure CLI commands as shown below:

```bash
# Get your AKS Resource ID
AKS_ID=$(az aks show -g MyResourceGroup -n MyManagedCluster --query id -o tsv)
```

```azurecli-interactive
az role assignment create --role "Azure Kubernetes Service RBAC Admin" --assignee <AAD-ENTITY-ID> --scope $AKS_ID
```

where `<AAD-ENTITY-ID>` could be a username (for example, user@contoso.com) or even the ClientID of a service principal.

You can also create role assignments scoped to a specific **namespace** within the cluster:

```azurecli-interactive
az role assignment create --role "Azure Kubernetes Service RBAC Viewer" --assignee <AAD-ENTITY-ID> --scope $AKS_ID/namespaces/<namespace-name>
```

Today, role assignments scoped to namespaces need to be configured via Azure CLI.


### Create custom roles definitions

Optionally you may choose to create your own role definition and then assign as above.

Below is an example of a role definition that allows a user to only read deployments and nothing else. You can check the full list of possible actions [here](../role-based-access-control/resource-provider-operations.md#microsoftcontainerservice).


Copy the below json into a file called `deploy-view.json`.

```json
{
    "Name": "AKS Deployment Viewer",
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

Replace `<YOUR SUBSCRIPTION ID>` by the ID from your subscription, which you can get by running:

```azurecli-interactive
az account show --query id -o tsv
```


Now we can create the role definition by running the below command from the folder where you saved `deploy-view.json`:

```azurecli-interactive
az role definition create --role-definition @deploy-view.json 
```

Now that you have your role definition, you can assign it to a user or other identity by running:

```azurecli-interactive
az role assignment create --role "AKS Deployment Viewer" --assignee <AAD-ENTITY-ID> --scope $AKS_ID
```

## Use Azure RBAC for Kubernetes Authorization with `kubectl`

> [!NOTE]
> Ensure you have the latest kubectl by running the below command:
>
> ```azurecli-interactive
> az aks install-cli
> ```
> You might need to run it with `sudo` privileges. 

Now that you have assigned your desired role and permissions. You can start calling the Kubernetes API, for example,  from `kubectl`.

For this purpose, let's first get the cluster's kubeconfig using the below command:

```azurecli-interactive
az aks get-credentials -g MyResourceGroup -n MyManagedCluster
```

> [!IMPORTANT]
> You'll need the [Azure Kubernetes Service Cluster User](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) built-in role to perform the step above.

Now, you can use kubectl to, for example,  list the nodes in the cluster. The first time you run it you'll need to sign in, and subsequent commands will use the respective access token.

```azurecli-interactive
kubectl get nodes
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.

NAME                                STATUS   ROLES   AGE    VERSION
aks-nodepool1-93451573-vmss000000   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000001   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000002   Ready    agent   3h6m   v1.15.11
```


## Use Azure RBAC for Kubernetes Authorization with `kubelogin`

To unblock additional scenarios like non-interactive logins, older `kubectl` versions or leveraging SSO across multiple clusters without the need to sign in to new cluster, granted that your token is still valid, AKS created an exec plugin called [`kubelogin`](https://github.com/Azure/kubelogin).

You can use it by running:

```bash
export KUBECONFIG=/path/to/kubeconfig
kubelogin convert-kubeconfig
``` 

The first time, you'll have to sign in interactively like with regular kubectl, but afterwards you'll no longer need to, even for new Azure AD clusters (as long as your token is still valid).

```bash
kubectl get nodes
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.

NAME                                STATUS   ROLES   AGE    VERSION
aks-nodepool1-93451573-vmss000000   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000001   Ready    agent   3h6m   v1.15.11
aks-nodepool1-93451573-vmss000002   Ready    agent   3h6m   v1.15.11
```


## Clean up

### Clean Role assignment

```azurecli-interactive
az role assignment list --scope $AKS_ID --query [].id -o tsv
```
Copy the ID or IDs from all the assignments you did and then.

```azurecli-interactive
az role assignment delete --ids <LIST OF ASSIGNMENT IDS>
```

### Clean up role definition

```azurecli-interactive
az role definition delete -n "AKS Deployment Viewer"
```

### Delete cluster and resource group

```azurecli-interactive
az group delete -n MyResourceGroup
```

## Next steps

- Read more about AKS Authentication, Authorization, Kubernetes RBAC, and Azure RBAC [here](concepts-identity.md).
- Read more about Azure RBAC [here](../role-based-access-control/overview.md).
- Read more about the all the actions you can use to granularly define custom Azure roles for Kubernetes authorization [here](../role-based-access-control/resource-provider-operations.md#microsoftcontainerservice).


<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-provider-register]: /cli/azure/provider#az_provider_register
