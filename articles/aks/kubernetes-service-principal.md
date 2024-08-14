---
title: Use a service principal with AKS
description: Learn how to create and manage a Microsoft Entra service principal with a cluster in Azure Kubernetes Service (AKS).
author: tamram
ms.topic: article
ms.subservice: aks-security
ms.date: 05/30/2024
ms.author: tamram
ms.custom: devx-track-azurepowershell, devx-track-azurecli

#Customer intent: As a cluster operator, I want to understand how to create a service principal and delegate permissions for AKS to access required resources. In large enterprise environments, the user that deploys the cluster (or CI/CD system), may not have permissions to create this service principal automatically when the cluster is created.
---

# Use a service principal with Azure Kubernetes Service (AKS)

An AKS cluster requires either a [Microsoft Entra service principal][aad-service-principal] or a [managed identity][managed-identity-resources-overview] to dynamically create and manage other Azure resources, such as an Azure Load Balancer or Azure Container Registry (ACR).

For optimal security and ease of use, Microsoft recommends using managed identities rather than service principals to authorize access from an AKS cluster to other resources in Azure. A managed identity is a special type of service principal that can be used to obtain Microsoft Entra credentials without the need to manage and secure credentials. For more information about using a managed identity with your cluster, see [Use a managed identity in AKS][use-managed-identity].

This article shows you how to create and use a service principal with your AKS clusters.

## Before you begin

To create a Microsoft Entra service principal, you must have permissions to register an application with your Microsoft Entra tenant and to assign the application to a role in your subscription. If you don't have the necessary permissions, you need to ask your Microsoft Entra ID or subscription administrator to assign the necessary permissions or pre-create a service principal for use with your AKS cluster.

If you're using a service principal from a different Microsoft Entra tenant, there are other considerations around the permissions available when you deploy the cluster. You may not have the appropriate permissions to read and write directory information. For more information, see [What are the default user permissions in Microsoft Entra ID?][azure-ad-permissions]

## Prerequisites

* If using Azure CLI, you need Azure CLI version 2.0.59 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* If using Azure PowerShell, you need Azure PowerShell version 5.0.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install the Azure Az PowerShell module][install-the-azure-az-powershell-module].

## Create a service principal

Create a service principal before you create your cluster.

### [Azure CLI](#tab/azure-cli)

1. Create a service principal using the [`az ad sp create-for-rbac`][az-ad-sp-create] command.

    ```azurecli-interactive
    az ad sp create-for-rbac --name myAKSClusterServicePrincipal
    ```

    Your output should be similar to the following example output:

    ```json
    {
      "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "displayName": "myAKSClusterServicePrincipal",
      "name": "http://myAKSClusterServicePrincipal",
      "password": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
    ```

2. Copy the values for `appId` and `password` from the output. You use these when creating an AKS cluster in the next section.

### [Azure PowerShell](#tab/azure-powershell)

1. Create a service principal using the [`New-AzADServicePrincipal`][new-azadserviceprincipal] command.

    ```azurepowershell-interactive
    New-AzADServicePrincipal -DisplayName myAKSClusterServicePrincipal -OutVariable sp
    ```

    Your output should be similar to the following example output:

    ```output
    Secret                : System.Security.SecureString
    ServicePrincipalNames : {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, http://myAKSClusterServicePrincipal}
    ApplicationId         : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ObjectType            : ServicePrincipal
    DisplayName           : myAKSClusterServicePrincipal
    Id                    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    Type                  :
    ```

    The values are stored in a variable that you use when creating an AKS cluster in the next section.

2. Decrypt the value stored in the **Secret** secure string using the following command.

    ```azurepowershell-interactive
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
    [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    ```

---

## Specify a service principal for an AKS cluster

### [Azure CLI](#tab/azure-cli)

* Use an existing service principal for a new AKS cluster using the [`az aks create`][az-aks-create] command and use the `--service-principal` and `--client-secret` parameters to specify the `appId` and `password` from the output you received the previous section.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --service-principal <appId> \
        --client-secret <password> \
        --generate-ssh-keys
    ```

    > [!NOTE]
    > If you're using an existing service principal with customized secret, make sure the secret isn't longer than 190 bytes.

### [Azure PowerShell](#tab/azure-powershell)

1. Convert the service principal `ApplicationId` and `Secret` to a **PSCredential** object using the following command.

    ```azurepowershell-interactive
    $Cred = New-Object -TypeName System.Management.Automation.PSCredential ($sp.ApplicationId, $sp.Secret)
    ```

2. Use an existing service principal for a new AKS cluster using the [`New-AzAksCluster`][new-azakscluster] command and specify the `ServicePrincipalIdAndSecret` parameter with the previously created **PSCredential** object as its value.

    ```azurepowershell-interactive
    New-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -ServicePrincipalIdAndSecret $Cred
    ```

    > [!NOTE]
    > If you're using an existing service principal with customized secret, make sure the secret isn't longer than 190 bytes.

---

## Delegate access to other Azure resources

You can use the service principal for the AKS cluster to access other resources. For example, if you want to deploy your AKS cluster into an existing Azure virtual network subnet, connect to Azure Container Registry (ACR), or access keys or secrets in a key vault from your cluster, then you need to delegate access to those resources to the service principal. To delegate access, assign an Azure role-based access control (Azure RBAC) role to the service principal.

> [!IMPORTANT]
> Permissions granted to a service principal associated with a cluster may take up 60 minutes to propagate.

### [Azure CLI](#tab/azure-cli)

* Create a role assignment using the [`az role assignment create`][az-role-assignment-create] command. Provide the value of the service principal's appID for the `appId` parameter. Specify the scope for the role assignment, such as a resource group or virtual network resource. The role assignment determines what permissions the service principal has on the resource and at what scope.

    For example, to assign the service principal permissions to access secrets in a key vault, you might use the following command:

    ```azurecli-interactive
    az role assignment create \
        --assignee <appId> \
        --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.KeyVault/vaults/<vault-name>" \
        --role "Key Vault Secrets User"
    ```

    > [!NOTE]
    > The `--scope` for a resource needs to be a full resource ID, such as */subscriptions/\<guid\>/resourceGroups/myResourceGroup* or */subscriptions/\<guid\>/resourceGroups/myResourceGroupVnet/providers/Microsoft.Network/virtualNetworks/myVnet*.

### [Azure PowerShell](#tab/azure-powershell)

* Create a role assignment using the [`New-AzRoleAssignment`][new-azroleassignment] command. Provide the value of the service principal's appID for the `ApplicationId` parameter. Specify the scope for the role assignment, such as a resource group or virtual network resource. The role assignment determines what permissions the service principal has on the resource and at what scope.

    For example, to assign the service principal permissions to access secrets in a key vault, you might use the following command:

    ```azurepowershell-interactive
    New-AzRoleAssignment -ApplicationId <ApplicationId> `
        -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.KeyVault/vaults/<vault-name>" `
        -RoleDefinitionName "Key Vault Secrets User"
    ```

    > [!NOTE]
    > The `Scope` for a resource needs to be a full resource ID, such as */subscriptions/\<guid\>/resourceGroups/myResourceGroup* or */subscriptions/\<guid\>/resourceGroups/myResourceGroupVnet/providers/Microsoft.Network/virtualNetworks/myVnet*

---

The following sections detail common delegations that you may need to assign to a service principal.

### Azure Container Registry

### [Azure CLI](#tab/azure-cli)

If you use Azure Container Registry (ACR) as your container image store, you need to grant permissions to the service principal for your AKS cluster to read and pull images. We recommend using the [`az aks create`][az-aks-create] or [`az aks update`][az-aks-update] command to integrate with a registry and assign the appropriate role for the service principal. For detailed steps, see [Authenticate with Azure Container Registry from Azure Kubernetes Service][aks-to-acr].

### [Azure PowerShell](#tab/azure-powershell)

If you use Azure Container Registry (ACR) as your container image store, you need to grant permissions to the service principal for your AKS cluster to read and pull images. We recommend using the [`New-AzAksCluster`][new-azakscluster] or [`Set-AzAksCluster`][set-azakscluster] command to integrate with a registry and assign the appropriate role for the service principal. For detailed steps, see [Authenticate with Azure Container Registry from Azure Kubernetes Service][aks-to-acr].

---

### Networking

You may use advanced networking where the virtual network and subnet or public IP addresses are in another resource group. Assign the [Network Contributor][rbac-network-contributor] built-in role on the subnet within the virtual network. Alternatively, you can create a [custom role][rbac-custom-role] with permissions to access the network resources in that resource group. For more information, see [AKS service permissions][aks-permissions].

### Storage

If you need to access existing disk resources in another resource group, assign one of the following sets of role permissions:

* Create a [custom role][rbac-custom-role] and define the *Microsoft.Compute/disks/read* and *Microsoft.Compute/disks/write* role permissions, or
* Assign the [Virtual Machine Contributor][rbac-disk-contributor] built-in role on the resource group.

### Azure Container Instances

If you use Virtual Kubelet to integrate with AKS and choose to run Azure Container Instances (ACI) in resource group separate from the AKS cluster, the AKS cluster service principal must be granted *Contributor* permissions on the ACI resource group.

## Other considerations

### [Azure CLI](#tab/azure-cli)

When using AKS and a Microsoft Entra service principal, consider the following:

* The service principal for Kubernetes is a part of the cluster configuration, but don't use this identity to deploy the cluster.
* By default, the service principal credentials are valid for one year. You can [update or rotate the service principal credentials][update-credentials] at any time.
* Every service principal is associated with a Microsoft Entra application. You can associate the service principal for a Kubernetes cluster with any valid Microsoft Entra application name (for example: *https://www.contoso.org/example*). The URL for the application doesn't have to be a real endpoint.
* When you specify the service principal **Client ID**, use the value of the `appId`.
* On the agent node VMs in the Kubernetes cluster, the service principal credentials are stored in the `/etc/kubernetes/azure.json` file.
* When you delete an AKS cluster that was created using the [`az aks create`][az-aks-create] command, the service principal created isn't automatically deleted.
  * To delete the service principal, query for your cluster's *servicePrincipalProfile.clientId* and delete it using the [`az ad sp delete`][az-ad-sp-delete] command. Replace the values for the `-g` parameter for the resource group name and `-n` parameter for the cluster name:

      ```azurecli
      az ad sp delete --id $(az aks show \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --query servicePrincipalProfile.clientId \
        --output tsv)
      ```

### [Azure PowerShell](#tab/azure-powershell)

When using AKS and a Microsoft Entra service principal, consider the following:

* The service principal for Kubernetes is a part of the cluster configuration, but don't use this identity to deploy the cluster.
* By default, the service principal credentials are valid for one year. You can [update or rotate the service principal credentials][update-credentials] at any time.
* Every service principal is associated with a Microsoft Entra application. You can associate the service principal for a Kubernetes cluster with any valid Microsoft Entra application name (for example: *https://www.contoso.org/example*). The URL for the application doesn't have to be a real endpoint.
* When you specify the service principal **Client ID**, use the value of the `ApplicationId`.
* On the agent node VMs in the Kubernetes cluster, the service principal credentials are stored in the `/etc/kubernetes/azure.json` file.
* When you delete an AKS cluster that was created using the [`New-AzAksCluster`][new-azakscluster], the service principal created isn't automatically deleted.
  * To delete the service principal, query for your cluster's *ServicePrincipalProfile.ClientId* and delete it using the [`Remove-AzADServicePrincipal`][remove-azadserviceprincipal] command. Replace the values for the `-ResourceGroupName` parameter for the resource group name and `-Name` parameter for the cluster name:

      ```azurepowershell-interactive
      $ClientId = (Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster ).ServicePrincipalProfile.ClientId
      Remove-AzADServicePrincipal -ApplicationId $ClientId
      ```

---

## Troubleshoot

### [Azure CLI](#tab/azure-cli)

Azure CLI caches the service principal credentials for AKS clusters. If these credentials expire, you can encounter errors during AKS cluster deployment. If you run the [`az aks create`][az-aks-create] command and receive an error message similar to the following, it may indicate a problem with the cached service principal credentials:

```azurecli
Operation failed with status: 'Bad Request'.
Details: The credentials in ServicePrincipalProfile were invalid. Please see https://aka.ms/aks-sp-help for more details.
(Details: adal: Refresh request failed. Status Code = '401'.
```

You can check the expiration date of your service principal credentials using the [`az ad app credential list`][az-ad-app-credential-list] command with the `"[].endDateTime"` query.

```azurecli
az ad app credential list \
    --id <app-id> \
    --query "[].endDateTime" \
    --output tsv
```

The default expiration time for the service principal credentials is one year. If your credentials are older than one year, you can [reset the existing credentials][reset-credentials] or [create a new service principal][new-service-principal].

**General Azure CLI troubleshooting**

[!INCLUDE [azure-cli-troubleshooting.md](~/reusable-content/ce-skilling/azure/includes/azure-cli-troubleshooting.md)]

### [Azure PowerShell](#tab/azure-powershell)

Azure PowerShell caches the service principal credentials for AKS clusters. If these credentials expire, you encounter errors during AKS cluster deployment. If you run the [`New-AzAksCluster`][new-azakscluster] command and receive an error message similar to the following, it may indicate a problem with the cached service principal credentials:

```azurepowershell-interactive
Operation failed with status: 'Bad Request'.
Details: The credentials in ServicePrincipalProfile were invalid. Please see https://aka.ms/aks-sp-help for more details.
(Details: adal: Refresh request failed. Status Code = '401'.
```

You can check the expiration date of your service principal credentials using the [Get-AzADAppCredential][get-azadappcredential] command. The output shows you the `StartDateTime` of your credentials.

```azurepowershell-interactive
Get-AzADAppCredential -ApplicationId <ApplicationId> 
```

The default expiration time for the service principal credentials is one year. If your credentials are older than one year, you can [reset the existing credentials](update-credentials.md#reset-the-existing-service-principal-credentials) or [create a new service principal](update-credentials.md#create-a-new-service-principal).

---

## Next steps

For more information about Microsoft Entra service principals, see [Application and service principal objects][service-principal].

For information on how to update the credentials, see [Update or rotate the credentials for a service principal in AKS][update-credentials].

<!-- LINKS - internal -->
[aad-service-principal]: /entra/identity-platform/app-objects-and-service-principals
[az-ad-sp-create]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac
[az-ad-sp-delete]: /cli/azure/ad/sp#az_ad_sp_delete
[az-ad-app-credential-list]: /cli/azure/ad/app/credential#az_ad_app_credential_list
[install-azure-cli]: /cli/azure/install-azure-cli
[service-principal]: /entra/identity-platform/app-objects-and-service-principals
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[rbac-network-contributor]: ../role-based-access-control/built-in-roles.md#network-contributor
[rbac-custom-role]: ../role-based-access-control/custom-roles.md
[rbac-disk-contributor]: ../role-based-access-control/built-in-roles.md#virtual-machine-contributor
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[aks-to-acr]: cluster-container-registry-integration.md
[update-credentials]: ./update-credentials.md
[reset-credentials]: ./update-credentials.md#reset-the-existing-service-principal-credentials
[new-service-principal]: ./update-credentials.md#create-a-new-service-principal
[azure-ad-permissions]: ../active-directory/fundamentals/users-default-permissions.md
[aks-permissions]: concepts-identity.md#aks-service-permissions
[install-the-azure-az-powershell-module]: /powershell/azure/install-az-ps
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[new-azadserviceprincipal]: /powershell/module/az.resources/new-azadserviceprincipal
[get-azadappcredential]: /powershell/module/az.resources/get-azadappcredential
[new-azroleassignment]: /powershell/module/az.resources/new-azroleassignment
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[remove-azadserviceprincipal]: /powershell/module/az.resources/remove-azadserviceprincipal
[use-managed-identity]: use-managed-identity.md
[managed-identity-resources-overview]: ..//active-directory/managed-identities-azure-resources/overview.md

