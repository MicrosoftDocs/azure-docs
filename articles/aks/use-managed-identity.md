---
title: Use a managed identity in Azure Kubernetes Service (AKS)
description: Learn how to use a system-assigned or user-assigned managed identity in Azure Kubernetes Service (AKS).
author: tamram

ms.topic: article
ms.subservice: aks-security
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.date: 05/29/2024
ms.author: tamram
---

# Use a managed identity in Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) clusters require an identity to access Azure resources like load balancers and managed disks. Managed identities for Azure resources are the recommended way to authorize access from an AKS cluster to other Azure services.

To learn more about managed identities, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

This article shows how to enable the following types of managed identity on a new or existing AKS cluster:

* System-assigned managed identity. A system-assigned managed identity is associated with a single Azure resource, such as an AKS cluster.
* User-assigned managed identity. A user-assigned managed identity is a standalone Azure resource that can be assigned to an Azure resource
* Pre-created Kubelet managed identity

## Overview

When you deploy an AKS cluster, a system-assigned managed identity is automatically created, and it's managed by the Azure platform, so it doesn't require you to provision or rotate any secrets. For more information about system-assigned managed identities, see [Managed identities for Azure resources][managed-identity-resources-overview].

AKS uses both system-assigned and user-assigned managed identity types, and these identities are immutable. These identity types shouldn't be confused with a [Microsoft Entra Workload identity][workload-identity-overview], which is intended for use by an application running on a pod.

> [!IMPORTANT]
> The open source [Microsoft Entra pod-managed identity][entra-id-pod-managed-identity] (preview) in Azure Kubernetes Service was deprecated on 10/24/2022, and the project archived in Sept. 2023. For more information, see the [deprecation notice](https://github.com/Azure/aad-pod-identity#-announcement). The AKS Managed add-on begins deprecation in Sept. 2024.
>
> We recommend that you review [Microsoft Entra Workload ID][workload-identity-overview]. Entra Workload ID authentication replaces the deprecated pod-managed identity (preview) feature. Entra Workload ID is the recommended method to enable an application running on a pod to authenticate itself against other Azure services that support it.

## Before you begin

* Make sure you have Azure CLI version 2.23.0 or later installed. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

* To [use a pre-created kubelet managed identity][use-a-pre-created-kubelet-managed-identity], you need Azure CLI version 2.26.0 or later installed.

* To [update managed identity on an existing cluster][update-managed-identity-on-an-existing-cluster], you need Azure CLI version 2.49.0 or later installed.

## Limitations

* Moving or migrating a managed identity-enabled cluster to a different tenant isn't supported.

* If the cluster has Microsoft Entra pod-managed identity (`aad-pod-identity`) enabled, Node-Managed Identity (NMI) pods modify the iptables of the nodes to intercept calls to the Azure Instance Metadata (IMDS) endpoint. This configuration means any request made to the IMDS endpoint is intercepted by NMI, even if a particular pod doesn't use `aad-pod-identity`.

    The AzurePodIdentityException custom resource definition (CRD) can be configured to specify that requests to the IMDS endpoint that originate from a pod matching labels defined in the CRD should be proxied without any processing in NMI. Exclude the system pods with the `kubernetes.azure.com/managedby: aks` label in *kube-system* namespace in `aad-pod-identity` by configuring the AzurePodIdentityException CRD. For more information, see [Use Microsoft Entra pod-managed identities in Azure Kubernetes Service](use-azure-ad-pod-identity.md).
  
    To configure an exception, install the [mic-exception YAML](https://github.com/Azure/aad-pod-identity/blob/master/deploy/infra/mic-exception.yaml).

* AKS doesn't support the use of a system-assigned managed identity when using a custom private DNS zone.

## Summary of managed identities

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
| Add-on | Dashboard | No identity required. | N/A | No |
| Add-on | application-routing | Manages Azure DNS and Azure Key Vault certificates | Key Vault Secrets User role for Key Vault, DNZ Zone Contributor role for DNS zones, Private DNS Zone Contributor role for private DNS zones | No |
| Add-on | HTTPApplicationRouting | Manages required network resources. | Reader role for node resource group, contributor role for DNS zone | No |
| Add-on | Ingress application gateway | Manages required network resources. | Contributor role for node resource group | No |
| Add-on | omsagent | Used to send AKS metrics to Azure Monitor. | Monitoring Metrics Publisher role | No |
| Add-on | Virtual-Node (ACIConnector) | Manages required network resources for Azure Container Instances (ACI). | Contributor role for node resource group | No |
| Add-on | Cost analysis | Used to gather cost allocation data |  |
| Workload identity | Microsoft Entra workload ID | Enables applications to access cloud resources securely with Microsoft Entra workload ID. | N/A | No |

## Set the active subscription

First, set your subscription as the current active subscription by calling the [az account set][az-account-set] command and passing in your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

## Enable a system-assigned managed identity on a new AKS cluster

To enable a system-assigned managed identity on a new cluster, call the [`az aks create`][az-aks-create] with the `--enable-managed-identity` parameter.

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location westus2
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myManagedCluster --enable-managed-identity --generate-ssh-keys
    ```

3. Get credentials to access the cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

> [!NOTE]
> AKS creates a user-assigned kubelet identity in the node resource group if you don't [specify your own kubelet managed identity][use-a-pre-created-kubelet-managed-identity].
>
> If your cluster is already using a managed identity and the identity was changed, for example if you updated the cluster identity type from system-assigned to user-assigned, then there is a delay for control plane components to switch to the new identity. Control plane components continue to use the old identity until its token expires. After the token is refreshed, they switch to the new identity. This process can take several hours.

## Enable a system-assigned managed identity on an existing AKS cluster

To update an existing AKS cluster to use a system-assigned managed identity, run the [`az aks update`][az-aks-update] command with the `--enable-managed-identity` parameter.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --enable-managed-identity
```

After you update the cluster, the control plane and pods use the system-assigned managed identity for authorization. Kubelet continues using a service principal until you upgrade your agentpool. You can use the `az aks nodepool upgrade --resource-group myResourceGroup --cluster-name myAKSCluster --name mynodepool --node-image-only` command on your nodes to update to a managed identity. A node pool upgrade causes downtime for your AKS cluster as the nodes in the node pools are cordoned, drained, and re-imaged.

> [!NOTE]
>
> Keep the following information in mind when updating your cluster:
>
> * An update only works if there's a VHD update to consume. If you're running the latest VHD, you need to wait until the next VHD is available in order to perform the update.
>
> * The Azure CLI ensures your addon's permission is correctly set after migrating. If you're not using the Azure CLI to perform the migrating operation, you need to handle the addon identity's permission by yourself. For an example using an Azure Resource Manager (ARM) template, see [Assign Azure roles using ARM templates](../role-based-access-control/role-assignments-template.md).
>
> * If your cluster was using `--attach-acr` to pull from images from Azure Container Registry (ACR), you need to run the `az aks update --resource-group myResourceGroup --name myAKSCluster --attach-acr <ACR resource ID>` command after updating your cluster to let the newly-created kubelet used for managed identity get the permission to pull from ACR. Otherwise, you won't be able to pull from ACR after the update.

## Add a role assignment for the managed identity

When you create and use your own VNet, attached Azure disks, static IP address, route table, or user-assigned kubelet identity where the resources are outside of the worker node resource group, the Azure CLI adds the role assignment automatically. If you're using an ARM template or another method, you need to use the principal ID of the cluster managed identity to perform a role assignment.

If you're not using the Azure CLI, but you're using your own VNet, attached Azure disks, static IP address, route table, or user-assigned kubelet identity that's outside of the worker node resource group, we recommend using a [user-assigned managed identity for the control plane][bring-your-own-control-plane-managed-identity]. When the control plane uses a system-assigned managed identity, the identity ID isn't known before creating the cluster, which delays the role assignment from taking effect.

### Get the principal ID of the managed identity

* Get the principal ID for the cluster's system-assigned managed identity by calling the [`az aks show`](/cli/azure/identity#az-identity-show) command.

    ```azurecli-interactive
    az aks show \
        --resource-group myResourceGroup \
        --name myManagedCluster \
        --query identity.principalId
    ```

    Your output should resemble the following example output:

    ```output
    {
      "delegatedResources": null,
      "principalId": "<identity-principal-id>",
      "tenantId": "<tenant-id>",
      "type": "SystemAssigned",
      "userAssignedIdentities": null
    }
    ```

### Add role assignment

For a VNet, attached Azure disk, static IP address, or route table outside the default worker node resource group, you need to assign the `Contributor` role on the custom resource group.

* Assign the `Contributor` role on the custom resource group using the [`az role assignment create`][az-role-assignment-create] command. For the `--scope` parameter, provide the resource ID for the resource group for the cluster.

    ```azurecli-interactive
    az role assignment create \
        --assignee <control-plane-identity-principal-id> \
        --role "Contributor" \
        --scope "<custom-resource-group-resource-id>"
    ```

For a user-assigned kubelet identity outside the default worker node resource group, you need to assign the [Managed Identity Operator][managed-identity-operator] role on the kubelet identity for control plane managed identity.

* Assign the `Managed Identity Operator` role on the kubelet identity using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create \
        --assignee  <control-plane-identity-principal-id> \
        --role "Managed Identity Operator" \
        --scope "<kubelet-identity-resource-id>"
    ```

> [!NOTE]
> It can take up to 60 minutes for the permissions granted to your cluster's managed identity to propagate.

## Bring your own managed identity

### Create a cluster using user-assigned managed identity

A custom user-assigned managed identity for the control plane enables access to the existing identity prior to cluster creation. This feature enables scenarios such as using a custom VNet or outboundType of UDR with a pre-created managed identity.

> [!NOTE]
>
> USDOD Central, USDOD East, and USGov Iowa regions in Azure US Government cloud aren't supported.
>
> AKS creates a user-assigned kubelet identity in the node resource group if you don't [specify your own kubelet managed identity][use-a-pre-created-kubelet-managed-identity].

* If you don't have a managed identity, create one using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name myIdentity --resource-group myResourceGroup
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

> [!NOTE]
> It may take up to 60 minutes for the permissions granted to your cluster's managed identity to populate.

* Before creating the cluster, [add the role assignment for managed identity][add-a-role-assignment-for-the-managed-identity] using the [`az role assignment create`][az-role-assignment-create] command.

* Create the cluster with user-assigned managed identity.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myManagedCluster \
        --network-plugin azure \
        --vnet-subnet-id <subnet-id> \
        --dns-service-ip 10.2.0.10 \
        --service-cidr 10.2.0.0/24 \
        --enable-managed-identity \
        --assign-identity <identity-resource-id>
    ```

### Update managed identity on an existing cluster

> [!NOTE]
> Migrating a managed identity for the control plane, from system-assigned to user-assigned, doesn't cause any downtime for control plane and agent pools. Meanwhile, control plane components keep using the old system-assigned identity for several hours until the next token refresh.

* If you don't have a managed identity, create one using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name myIdentity --resource-group myResourceGroup
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
  
* After creating the custom user-assigned managed identity for the control plane, [add the role assignment for the managed identity][add-a-role-assignment-for-the-managed-identity] using the [`az role assignment create`][az-role-assignment-create] command.

* Update your cluster with your existing identities using the [`az aks update`][az-aks-update] command. Make sure to provide the resource ID of the managed identity for the control plane by including the `assign-identity` argument.

    ```azurecli-interactive
    az aks update \
        --resource-group myResourceGroup \
        --name myManagedCluster \
        --enable-managed-identity \
        --assign-identity <identity-resource-id> 
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
    ```

## Use a pre-created kubelet managed identity

A kubelet identity enables access to the existing identity prior to cluster creation. This feature enables scenarios such as connection to ACR with a pre-created managed identity.

### Pre-created kubelet identity limitations

* Only works with a user-assigned managed identity.
* The China East and China North regions in Microsoft Azure operated by 21Vianet aren't supported.

### Create user-assigned managed identities

#### Control plane managed identity

* If you don't have a managed identity for the control plane, create one using the [`az identity create`][az-identity-create].

    ```azurecli-interactive
    az identity create --name myIdentity --resource-group myResourceGroup
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

#### kubelet managed identity

* If you don't have a kubelet managed identity, create one using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name myKubeletIdentity --resource-group myResourceGroup
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

### Create a cluster using user-assigned kubelet identity

Now you can create your AKS cluster with your existing identities. Make sure to provide the resource ID of the managed identity for the control plane by including the `assign-identity` argument, and the kubelet managed identity using the `assign-kubelet-identity` argument.

* Create an AKS cluster with your existing identities using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myManagedCluster \
        --network-plugin azure \
        --vnet-subnet-id <subnet-id> \
        --dns-service-ip 10.2.0.10 \
        --service-cidr 10.2.0.0/24 \
        --enable-managed-identity \
        --assign-identity <identity-resource-id> \
        --assign-kubelet-identity <kubelet-identity-resource-id>
    ```

    A successful AKS cluster creation using your own kubelet managed identity should resemble the following example output:

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

### Update an existing cluster using kubelet identity

> [!WARNING]
> Updating kubelet managed identity upgrades node pools, which causes downtime for your AKS cluster as the nodes in the node pools are cordoned/drained and reimaged.

> [!NOTE]
> If your cluster was using `--attach-acr` to pull from images from Azure Container Registry, you need to run the `az aks update --resource-group myResourceGroup --name myAKSCluster --attach-acr <ACR Resource ID>` command after updating your cluster to let the newly-created kubelet used for managed identity get the permission to pull from ACR. Otherwise, you won't be able to pull from ACR after the upgrade.

#### Get the current control plane managed identity for your AKS cluster

1. Confirm your AKS cluster is using the user-assigned managed identity using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show --resource-group <RGName> --name <ClusterName> --query "servicePrincipalProfile"
    ```

    If your cluster is using a managed identity, the output shows `clientId` with a value of **msi**. A cluster using a service principal shows an object ID. For example:

    ```output
    {
      "clientId": "msi"
    }
    ```

2. After confirming your cluster is using a managed identity, find the managed identity's resource ID using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show --resource-group <RGName> --name <ClusterName> --query "identity"
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

#### Update your cluster with kubelet identity

1. If you don't have a kubelet managed identity, create one using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name myKubeletIdentity --resource-group myResourceGroup
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

2. Update your cluster with your existing identities using the [`az aks update`][az-aks-update] command. Make sure to provide the resource ID of the managed identity for the control plane by including the `assign-identity` argument, and the kubelet managed identity for `assign-kubelet-identity` argument.

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
[bring-your-own-control-plane-managed-identity]: use-managed-identity.md#bring-your-own-managed-identity
[use-a-pre-created-kubelet-managed-identity]: use-managed-identity.md#use-a-pre-created-kubelet-managed-identity
[update-managed-identity-on-an-existing-cluster]: use-managed-identity.md#update-managed-identity-on-an-existing-cluster
[workload-identity-overview]: workload-identity-overview.md
[add-a-role-assignment-for-the-managed-identity]: use-managed-identity.md#add-a-role-assignment-for-the-managed-identity
[az-account-set]: /cli/azure/account#az-account-set
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[managed-identity-operator]: ../role-based-access-control/built-in-roles.md#managed-identity-operator
[kubelogin-authentication]: kubelogin-authentication.md
