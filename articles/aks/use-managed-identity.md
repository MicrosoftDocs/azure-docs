---
title: Use a managed identity in Azure Kubernetes Service (AKS)
description: Learn how to use a system-assigned or user-assigned managed identity in Azure Kubernetes Service (AKS).
author: tamram

ms.topic: article
ms.subservice: aks-security
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.date: 06/07/2024
ms.author: tamram
---

# Use a managed identity in Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) clusters require a Microsoft Entra identity to access Azure resources like load balancers and managed disks. Managed identities for Azure resources are the recommended way to authorize access from an AKS cluster to other Azure services.

You can use a managed identity to authorize access from an AKS cluster to any service that supports Microsoft Entra authorization, without needing to manage credentials or include them in your code. You assign to the managed identity an Azure role-based access control (Azure RBAC) role to grant it permissions to a particular resource in Azure. For example, you can grant permissions to a managed identity to access secrets in an Azure key vault for use by the cluster. For more information about Azure RBAC, see [What is Azure role\-based access control \(Azure RBAC\)?](../role-based-access-control/overview.md).

This article shows how to enable the following types of managed identity on a new or existing AKS cluster:

* **System-assigned managed identity.** A system-assigned managed identity is associated with a single Azure resource, such as an AKS cluster. It exists for the lifecycle of the cluster only.
* **User-assigned managed identity.** A user-assigned managed identity is a standalone Azure resource that an AKS cluster can use to authorize access to other Azure services. It persists separately from the AKS cluster and can be used by multiple Azure resources.
* **Pre-created kubelet managed identity.** A pre-created kubelet managed identity is an optional user-assigned identity that kubelet can use to access other resources in Azure. If you don't specify a user-assigned managed identity for kubelet, AKS creates a system-assigned kubelet identity in the node resource group.

To learn more about managed identities, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

## Overview

An AKS cluster uses a managed identity to request tokens from Microsoft Entra. These tokens are used to authorize access to other resources running in Azure. You can assign an Azure RBAC role to a managed identity to grant your cluster permissions to access specific resources. For example, if your cluster needs to access secrets in an Azure key vault, you can assign to the cluster's managed identity an Azure RBAC role that grants those permissions.

A managed identity can be either system-assigned or user-assigned. These two types of managed identities are similar in that you can use either type to authorize access to Azure resources from your AKS cluster. The key difference between them is that a system-assigned managed identity is associated with a single Azure resource like an AKS cluster, while a user-assigned managed identity is itself a standalone Azure resource. For more details on the differences between types of managed identities, see **Managed identity types** in [Managed identities for Azure resources][managed-identity-resources-overview].

Both types of managed identities are managed by the Azure platform, so that you can authorize access from your applications without needing to provision or rotate any secrets. Azure manages the identity's credentials for you.

When you deploy an AKS cluster, a system-assigned managed identity is created for you by default. You can also create the cluster with a user-assigned managed identity.

It's also possible to create a cluster with an application service principal rather that a managed identity. Managed identities are recommended over service principals for security and ease of use. For more information about creating a cluster with a service principal, see [Use a service principal with Azure Kubernetes Service (AKS)](kubernetes-service-principal.md).

You can update an existing cluster to use a managed identity from an application service principal. You can also update an existing cluster to a different type of managed identity. If your cluster is already using a managed identity and the identity was changed, for example if you updated the cluster identity type from system-assigned to user-assigned, then there is a delay while control plane components switch to the new identity. Control plane components continue to use the old identity until its token expires. After the token is refreshed, they switch to the new identity. This process can take several hours.

The system-assigned and user-assigned identity types differ a [Microsoft Entra Workload identity][workload-identity-overview], which is intended for use by an application running on a pod.

## Before you begin

* Make sure you have Azure CLI version 2.23.0 or later installed. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

* To [use a pre-created kubelet managed identity][use-a-pre-created-kubelet-managed-identity], you need Azure CLI version 2.26.0 or later installed.

* To update an existing cluster to use a [system-assigned managed identity][update-system-assigned-managed-identity-on-an-existing-cluster] or [a user-assigned managed identity][update-user-assigned-managed-identity-on-an-existing-cluster], you need Azure CLI version 2.49.0 or later installed.

Before running the examples in this article, set your subscription as the current active subscription by calling the [az account set][az-account-set] command and passing in your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

Also create an Azure resource group if you don't already have one by calling the [`az group create`][az-group-create] command.

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location westus2
```

## Enable a system-assigned managed identity

A system-assigned managed identity is an identity that is associated with an AKS cluster or another Azure resource. The system-assigned managed identity is tied to the lifecycle of the cluster. When the cluster is deleted, the system-assigned managed identity is also deleted.

The AKS cluster can use the system-assigned managed identity to authorize access to other resources running in Azure. You can assign an Azure RBAC role to the system-assigned managed identity to grant the cluster permissions to access specific resources. For example, if your cluster needs to access secrets in an Azure key vault, you can assign to the system-assigned managed identity an Azure RBAC role that grants those permissions.

### Enable a system-assigned managed identity on a new AKS cluster

To enable a system-assigned managed identity on a new cluster, call the [`az aks create`][az-aks-create]. A system-assigned managed identity is enabled on the new cluster by default.

Create an AKS cluster using the [`az aks create`][az-aks-create] command.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --generate-ssh-keys
```

To verify that a system-assigned managed identity is enabled for the cluster after it has been created, see [Determine which type of managed identity a cluster is using](#determine-which-type-of-managed-identity-a-cluster-is-using).

### Update an existing AKS cluster to use a system-assigned managed identity

To update an existing AKS cluster that is using a service principal to use a system-assigned managed identity instead, run the [`az aks update`][az-aks-update] command with the `--enable-managed-identity` parameter.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --enable-managed-identity
```

After you update the cluster to use a system-assigned managed identity instead of a service principal, the control plane and pods use the system-assigned managed identity for authorization when accessing other services in Azure. Kubelet continues using a service principal until you also upgrade your agentpool. You can use the `az aks nodepool upgrade --resource-group myResourceGroup --cluster-name myAKSCluster --name mynodepool --node-image-only` command on your nodes to update to a managed identity. A node pool upgrade causes downtime for your AKS cluster as the nodes in the node pools are cordoned, drained, and re-imaged.

> [!NOTE]
>
> Keep the following information in mind when updating your cluster:
>
> * An update only works if there's a VHD update to consume. If you're running the latest VHD, you need to wait until the next VHD is available in order to perform the update.
>
> * The Azure CLI ensures your addon's permission is correctly set after migrating. If you're not using the Azure CLI to perform the migrating operation, you need to handle the addon identity's permission by yourself. For an example using an Azure Resource Manager (ARM) template, see [Assign Azure roles using ARM templates](../role-based-access-control/role-assignments-template.md).
>
> * If your cluster was using `--attach-acr` to pull from images from Azure Container Registry (ACR), you need to run the `az aks update --resource-group myResourceGroup --name myAKSCluster --attach-acr <ACR resource ID>` command after updating your cluster to let the newly-created kubelet used for managed identity get the permission to pull from ACR. Otherwise, you won't be able to pull from ACR after the update.

### Add a role assignment for a system-assigned managed identity

You can assign an Azure RBAC role to the system-assigned managed identity to grant the cluster permissions on another Azure resource. Azure RBAC supports both built-in and custom role definitions that specify levels of permissions. For more information about assigning Azure RBAC roles, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

When you assign an Azure RBAC role to a managed identity, you must define the scope for the role. In general, it's a best practice to limit the scope of a role to the minimum privileges required by the managed identity. For more information on scoping Azure RBAC roles, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

When you create and use your own VNet, attached Azure disks, static IP address, route table, or user-assigned kubelet identity where the resources are outside of the worker node resource group, the Azure CLI adds the role assignment automatically. If you're using an ARM template or another method, use the principal ID of the managed identity to perform a role assignment.

If you're not using the Azure CLI, but you're using your own VNet, attached Azure disks, static IP address, route table, or user-assigned kubelet identity that's outside of the worker node resource group, we recommend using a [user-assigned managed identity for the control plane][bring-your-own-control-plane-managed-identity]. When the control plane uses a system-assigned managed identity, the identity is created at the same time as the cluster, so the role assignment can't be performed until the cluster has been created.

#### Get the principal ID of the system-assigned managed identity

To assign an Azure RBAC role to a cluster's system-assigned managed identity, you first need the principal ID for the managed identity. Get the principal ID for the cluster's system-assigned managed identity by calling the [`az aks show`](/cli/azure/identity#az-identity-show) command.

```azurecli-interactive
# Get the principal ID for a system-assigned managed identity.
CLIENT_ID=$(az aks show \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --query identity.principalId \
    --output tsv)
```

#### Assign an Azure RBAC role to the system-assigned managed identity

To grant a system-assigned managed identity permissions to a resource in Azure, call the [`az role assignment create`][az-role-assignment-create] command to assign an Azure RBAC role to the managed identity.

For a VNet, attached Azure disk, static IP address, or route table outside the default worker node resource group, you need to assign the ` Network Contributor` role on the custom resource group.

For example, assign the `Network Contributor` role on the custom resource group using the [`az role assignment create`][az-role-assignment-create] command. For the `--scope` parameter, provide the resource ID for the resource group for the cluster.

```azurecli-interactive
az role assignment create \
    --assignee $CLIENT_ID \
    --role "Network Contributor" \
    --scope "<resource-group-id>"
```

> [!NOTE]
> It can take up to 60 minutes for the permissions granted to your cluster's managed identity to propagate.

## Enable a user-assigned managed identity

A user-assigned managed identity is a standalone Azure resource. When you create a cluster with a user-assigned managed identity for the control plane, the user-assigned managed identity resource must exist prior to cluster creation. This feature enables scenarios such as creating the cluster with a custom VNet or with an outbound type of [user-defined routing (UDR)](egress-outboundtype.md#outbound-type-of-userdefinedrouting).

### Create a user-assigned managed identity

If you don't yet have a user-assigned managed identity resource, create one using the [`az identity create`][az-identity-create] command.

```azurecli-interactive
az identity create \
    --name myIdentity \
    --resource-group myResourceGroup
```

Your output should resemble the following example output:

```output
{                                  
  "clientId": "<client-id>",
  "clientSecretUrl": "<clientSecretUrl>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity", 
  "location": "westus2",
  "name": "myIdentity",
  "principalId": "<principal-id>",
  "resourceGroup": "myResourceGroup",                       
  "tags": {},
  "tenantId": "<tenant-id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

#### Get the principal ID of the user-assigned managed identity

To get the principal ID of the user-assigned managed identity, call [az identity show][az-identity-show] and query on the `principalId` property:

```azurecli-interactive
CLIENT_ID=$(az identity show \
    --name myIdentity \
    --resource-group myResourceGroup \
    --query principalId \
    --output tsv)
```

#### Get the resource ID of the user-assigned managed identity

To create a cluster with a user-assigned managed identity, you will need the resource ID for the new managed identity. To get the resource ID of the user-assigned managed identity, call [az aks show][az-aks-show] and query on the `id` property:

```azurecli-interactive
RESOURCE_ID=$(az identity show \
    --name myIdentity \
    --resource-group myResourceGroup \
    --query id \
    --output tsv)
```

### Assign an Azure RBAC role to the user-assigned managed identity

Before you create the cluster, add a role assignment for the managed identity by calling the [`az role assignment create`][az-role-assignment-create] command.

The following example assigns the **Key Vault Secrets User** role to the user-assigned managed identity to grant it permissions to access secrets in a key vault. The role assignment is scoped to the key vault resource:

```azurecli-interactive
az role assignment create \
    --assignee $CLIENT_ID \
    --role "Key Vault Secrets User" \
    --scope "<keyvault-resource-id>"
```

> [!NOTE]
>
> It may take up to 60 minutes for the permissions granted to your cluster's managed identity to propagate.

### Create a cluster with the user-assigned managed identity

To create an AKS cluster with the user-assigned managed identity, call the [`az aks create`][az-aks-create] command. Include the `--assign-identity` parameter and pass in the resource ID for the user-assigned managed identity:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --network-plugin azure \
    --vnet-subnet-id <subnet-id> \
    --dns-service-ip 10.2.0.10 \
    --service-cidr 10.2.0.0/24 \
    --assign-identity $RESOURCE_ID \
    --generate-ssh-keys
```

> [!NOTE]
>
> The USDOD Central, USDOD East, and USGov Iowa regions in Azure US Government cloud don't support creating a cluster with a user-assigned managed identity.

### Update an existing cluster to use a user-assigned managed identity

To update an existing cluster to use a user-assigned managed identity, call the [`az aks update`][az-aks-update] command. Include the `--assign-identity` parameter and pass in the resource ID for the user-assigned managed identity:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --enable-managed-identity \
    --assign-identity $RESOURCE_ID
```

The output for a successful cluster update to use a user-assigned managed identity should resemble the following example output:

```output
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {
        "clientId": "<client-id>",
        "principalId": "<principal-id>"
      }
    }
  },
```

> [!NOTE]
> Migrating a managed identity for the control plane from system-assigned to user-assigned doesn't result in any downtime for control plane and agent pools. Control plane components continue to the old system-assigned identity for up to several hours, until the next token refresh.

## Determine which type of managed identity a cluster is using

To determine which type of managed identity your existing AKS cluster is using, call the [az aks show][az-aks-show] command and query for the identity's *type* property.

```azurecli
az aks show \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --query identity.type \
    --output tsv       
```

If the cluster is using a managed identity, the value of the *type* property will be either **SystemAssigned** or **UserAssigned**.

If the cluster is using a service principal, the value of the *type* property will be null. Consider upgrading your cluster to use a managed identity.

## Use a pre-created kubelet managed identity

A pre-created kubelet identity is a user-assigned managed identity that exists prior to cluster creation. This feature enables scenarios such as connection to Azure Container Registry (ACR) during cluster creation.

> [!NOTE]
> AKS creates a user-assigned kubelet identity in the node resource group if you don't [specify your own kubelet managed identity][use-a-pre-created-kubelet-managed-identity].

For a user-assigned kubelet identity outside the default worker node resource group, you need to assign the [Managed Identity Operator][managed-identity-operator] role on the kubelet identity for control plane managed identity.

### kubelet managed identity

If you don't have a kubelet managed identity, create one using the [`az identity create`][az-identity-create] command.

```azurecli-interactive
az identity create \
    --name myKubeletIdentity \
    --resource-group myResourceGroup
```

Your output should resemble the following example output:

```output
{
  "clientId": "<client-id>",
  "clientSecretUrl": "<clientSecretUrl>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity", 
  "location": "westus2",
  "name": "myKubeletIdentity",
  "principalId": "<principal-id>",
  "resourceGroup": "myResourceGroup",                       
  "tags": {},
  "tenantId": "<tenant-id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

### Assign an RBAC role to the kubelet managed identity

Assign the `Managed Identity Operator` role on the kubelet identity using the [`az role assignment create`][az-role-assignment-create] command. Provide the kubelet identity's principal ID for the $KUBELET_CLIENT_ID variable.

```azurecli-interactive
az role assignment create \
    --assignee $KUBELET_CLIENT_ID \
    --role "Managed Identity Operator" \
    --scope "<kubelet-identity-resource-id>"
```

### Create a cluster to use the kubelet identity

Now you can create your AKS cluster with your existing identities. Make sure to provide the resource ID of the managed identity for the control plane by including the `assign-identity` argument, and the kubelet managed identity using the `assign-kubelet-identity` argument.

Create an AKS cluster with your existing identities using the [`az aks create`][az-aks-create] command.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --network-plugin azure \
    --vnet-subnet-id <subnet-id> \
    --dns-service-ip 10.2.0.10 \
    --service-cidr 10.2.0.0/24 \
    --assign-identity <identity-resource-id> \
    --assign-kubelet-identity <kubelet-identity-resource-id> \
    --generate-ssh-keys
```

A successful AKS cluster creation using a kubelet managed identity should result in output similar to the following:

```output
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {
        "clientId": "<client-id>",
        "principalId": "<principal-id>"
      }
    }
  },
  "identityProfile": {
    "kubeletidentity": {
      "clientId": "<client-id>",
      "objectId": "<object-id>",
      "resourceId": "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity"
    }
  },
```

### Update an existing cluster to use the kubelet identity

To update an existing cluster to use the kubelet managed identity, first get the current control plane managed identity for your AKS cluster.

> [!WARNING]
> Updating the kubelet managed identity upgrades your AKS cluster's node pools, which causes downtime for the cluster as the nodes in the node pools are cordoned/drained and reimaged.

1. Confirm your AKS cluster is using the user-assigned managed identity using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show \
        --resource-group <RGName> \
        --name <ClusterName> \
        --query "servicePrincipalProfile"
    ```

    If your cluster is using a managed identity, the output shows `clientId` with a value of **msi**. A cluster using a service principal shows an object ID. For example:

    ```output
    # The cluster is using a managed identity.
    {
      "clientId": "msi"
    }
    ```

1. After confirming your cluster is using a managed identity, find the managed identity's resource ID using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show --resource-group <RGName> \
        --name <ClusterName> \
        --query "identity"
    ```

    For a user-assigned managed identity, your output should look similar to the following example output:

    ```output
    {
      "principalId": null,
      "tenantId": null,
      "type": "UserAssigned",
      "userAssignedIdentities": <identity-resource-id>
          "clientId": "<client-id>",
          "principalId": "<principal-id>"
    },
    ```

1. Update your cluster with your existing identities using the [`az aks update`][az-aks-update] command. Provide the resource ID of the user-assigned managed identity for the control plane for the `assign-identity` argument. Provide the resource ID of the kubelet managed identity for the `assign-kubelet-identity` argument.

    ```azurecli-interactive
    az aks update \
        --resource-group myResourceGroup \
        --name myManagedCluster \
        --enable-managed-identity \
        --assign-identity <identity-resource-id> \
        --assign-kubelet-identity <kubelet-identity-resource-id>
    ```

Your output for a successful cluster update using your own kubelet managed identity should resemble the following example output:

```output
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {
        "clientId": "<client-id>",
        "principalId": "<principal-id>"
      }
    }
  },
  "identityProfile": {
    "kubeletidentity": {
      "clientId": "<client-id>",
      "objectId": "<object-id>",
      "resourceId": "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity"
    }
  },
```

> [!NOTE]
> If your cluster was using `--attach-acr` to pull from images from Azure Container Registry, run the `az aks update --resource-group myResourceGroup --name myAKSCluster --attach-acr <ACR Resource ID>` command after updating your cluster to let the newly-created kubelet used for managed identity get the permission to pull from ACR. Otherwise, you won't be able to pull from ACR after the upgrade.

### Get the properties of the kubelet identity

To get the properties of the kubelet identity, call [az aks show][az-aks-show] and query on the `identityProfile.kubeletidentity` property.

```azurecli-interactive
az aks show \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --query "identityProfile.kubeletidentity"
```

### Pre-created kubelet identity limitations

Note the following limitations for the pre-created kubelet identity:

* A pre-created kubelet identity must be a user-assigned managed identity.
* The China East and China North regions in Microsoft Azure operated by 21Vianet aren't supported.

## Summary of managed identities used by AKS

AKS uses several managed identities for built-in services and add-ons.

| Identity | Name | Use case | Default permissions | Bring your own identity |
|--|--|--|
| Control plane | AKS Cluster Name | Used by AKS control plane components to manage cluster resources including ingress load balancers and AKS-managed public IPs, Cluster Autoscaler, Azure Disk, File, Blob CSI drivers. | Contributor role for Node resource group | Supported |
| Kubelet | AKS Cluster Name-agentpool | Authentication with Azure Container Registry (ACR). | N/A (for kubernetes v1.15+) | Supported |
| Add-on | AzureNPM | No identity required. | N/A | No |
| Add-on | AzureCNI network monitoring | No identity required. | N/A | No |
| Add-on | azure-policy (gatekeeper) | No identity required. | N/A | No |
| Add-on | azure-policy | No identity required. | N/A | No |
| Add-on | Calico | No identity required. | N/A | No |
| Add-on | application-routing | Manages Azure DNS and Azure Key Vault certificates | Key Vault Secrets User role for Key Vault, DNZ Zone Contributor role for DNS zones, Private DNS Zone Contributor role for private DNS zones | No |
| Add-on | HTTPApplicationRouting | Manages required network resources. | Reader role for node resource group, contributor role for DNS zone | No |
| Add-on | Ingress application gateway | Manages required network resources. | Contributor role for node resource group | No |
| Add-on | omsagent | Used to send AKS metrics to Azure Monitor. | Monitoring Metrics Publisher role | No |
| Add-on | Virtual-Node (ACIConnector) | Manages required network resources for Azure Container Instances (ACI). | Contributor role for node resource group | No |
| Add-on | Cost analysis | Used to gather cost allocation data |  |
| Workload identity | Microsoft Entra workload ID | Enables applications to access cloud resources securely with Microsoft Entra workload ID. | N/A | No |

> [!IMPORTANT]
> The open source [Microsoft Entra pod-managed identity][entra-id-pod-managed-identity] (preview) in Azure Kubernetes Service was deprecated on 10/24/2022, and the project archived in Sept. 2023. For more information, see the [deprecation notice](https://github.com/Azure/aad-pod-identity#-announcement). The AKS Managed add-on begins deprecation in Sept. 2024.
>
> We recommend that you review [Microsoft Entra Workload ID][workload-identity-overview]. Entra Workload ID authentication replaces the deprecated pod-managed identity (preview) feature. Entra Workload ID is the recommended method to enable an application running on a pod to authenticate itself against other Azure services that support it.

## Limitations

* Moving or migrating a managed identity-enabled cluster to a different tenant isn't supported.

* If the cluster has Microsoft Entra pod-managed identity (`aad-pod-identity`) enabled, Node-Managed Identity (NMI) pods modify the iptables of the nodes to intercept calls to the Azure Instance Metadata (IMDS) endpoint. This configuration means any request made to the IMDS endpoint is intercepted by NMI, even if a particular pod doesn't use `aad-pod-identity`.

    The AzurePodIdentityException custom resource definition (CRD) can be configured to specify that requests to the IMDS endpoint that originate from a pod matching labels defined in the CRD should be proxied without any processing in NMI. Exclude the system pods with the `kubernetes.azure.com/managedby: aks` label in *kube-system* namespace in `aad-pod-identity` by configuring the AzurePodIdentityException CRD. For more information, see [Use Microsoft Entra pod-managed identities in Azure Kubernetes Service](use-azure-ad-pod-identity.md).
  
    To configure an exception, install the [mic-exception YAML](https://github.com/Azure/aad-pod-identity/blob/master/deploy/infra/mic-exception.yaml).

* AKS doesn't support the use of a system-assigned managed identity when using a custom private DNS zone.

## Next steps

* Use [Azure Resource Manager templates][aks-arm-template] to create a managed identity-enabled cluster.
* Learn how to [use kubelogin][kubelogin-authentication] for all supported Microsoft Entra authentication methods in AKS.

<!-- LINKS - external -->
[aks-arm-template]: /azure/templates/microsoft.containerservice/managedclusters
[entra-id-pod-managed-identity]: https://github.com/furkanyildiz/azure-docs/blob/feature/inform-deprecated-aks-identity/articles/aks/use-azure-ad-pod-identity.md

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-identity-show]: /cli/azure/identity#az_identity_show
[managed-identity-resources-overview]: ../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types
[bring-your-own-control-plane-managed-identity]: use-managed-identity.md#enable-a-user-assigned-managed-identity
[use-a-pre-created-kubelet-managed-identity]: use-managed-identity.md#use-a-pre-created-kubelet-managed-identity
[update-system-assigned-managed-identity-on-an-existing-cluster]: use-managed-identity.md#update-an-existing-aks-cluster-to-use-a-system-assigned-managed-identity
[update-user-assigned-managed-identity-on-an-existing-cluster]: use-managed-identity.md#update-an-existing-cluster-to-use-a-user-assigned-managed-identity
[workload-identity-overview]: workload-identity-overview.md
[az-account-set]: /cli/azure/account#az-account-set
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[managed-identity-operator]: ../role-based-access-control/built-in-roles.md#managed-identity-operator
[kubelogin-authentication]: kubelogin-authentication.md
