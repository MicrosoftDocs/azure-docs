---
title: Use a Windows VM user-assigned managed identity to access Azure Resource Manager
description: A tutorial that walks you through the process of using a user-assigned managed identity on a Windows VM, to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: daveba
ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2018
ms.author: markvi
ms.collection: M365-identity-device-management
---

# Tutorial: Use a User-assigned Managed Identity on a Windows VM, to access Azure Resource Manager

[!INCLUDE [preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This tutorial explains how to create a user-assigned identity, assign it to a Windows Virtual Machine (VM), and then use that identity to access the Azure Resource Manager API. Managed Service Identities are automatically managed by Azure. They enable authentication to services that support Azure AD authentication, without needing to embed credentials into your code. 

You learn how to:

> [!div class="checklist"]
> * Create a user-assigned managed identity
> * Assign your user-assigned identity to your Windows VM
> * Grant the user-assigned identity access to a Resource Group in Azure Resource Manager 
> * Get an access token using the user-assigned identity and use it to call Azure Resource Manager 
> * Read the properties of a Resource Group

[!INCLUDE [az-powershell-update](../../../includes/updated-for-az.md)]

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

- [Sign in to Azure portal](https://portal.azure.com)

- [Create a Windows virtual machine](/azure/virtual-machines/windows/quick-create-portal)

- To perform the required resource creation and role management steps in this tutorial, your account needs "Owner" permissions at the appropriate scope (your subscription or resource group). If you need assistance with role assignment, see [Use Role-Based Access Control to manage access to your Azure subscription resources](/azure/role-based-access-control/role-assignments-portal).
- [Install the latest version of the Azure PowerShell module](/powershell/azure/install-az-ps). 
- Run `Connect-AzAccount` to create a connection with Azure.
- Install the [latest version of PowerShellGet](/powershell/gallery/installing-psget#for-systems-with-powershell-50-or-newer-you-can-install-the-latest-powershellget).
- Run `Install-Module -Name PowerShellGet -AllowPrerelease` to get the pre-release version of the `PowerShellGet` module (you may need to `Exit` out of the current PowerShell session after you run this command to install the `Az.ManagedServiceIdentity` module).
- Run `Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease` to install the prerelease version of the `Az.ManagedServiceIdentity` module to perform the user-assigned identity operations in this article.

## Create a user-assigned identity

A user-assigned identity is created as a standalone Azure resource. Using the [New-AzUserAssignedIdentity](/powershell/module/az.managedserviceidentity/get-azuserassignedidentity),  Azure creates an identity in your Azure AD tenant that can be assigned to one or more Azure service instances.

[!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```azurepowershell-interactive
New-AzUserAssignedIdentity -ResourceGroupName myResourceGroupVM -Name ID1
```

The response contains details for the user-assigned identity created, similar to the following example. Note the `Id` and `ClientId` values for your user-assigned identity, because they are used in subsequent steps:

```azurepowershell
{
Id: /subscriptions/<SUBSCRIPTIONID>/resourcegroups/myResourceGroupVM/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1
ResourceGroupName : myResourceGroupVM
Name: ID1
Location: westus
TenantId: 733a8f0e-ec41-4e69-8ad8-971fc4b533f8
PrincipalId: e591178e-b785-43c8-95d2-1397559b2fb9
ClientId: af825a31-b0e0-471f-baea-96de555632f9
ClientSecretUrl: https://control-westus.identity.azure.net/subscriptions/<SUBSCRIPTIONID>/resourcegroups/myResourceGroupVM/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1/credentials?tid=733a8f0e-ec41-4e69-8ad8-971fc4b533f8&oid=e591178e-b785-43c8-95d2-1397559b2fb9&aid=af825a31-b0e0-471f-baea-96de555632f9
Type: Microsoft.ManagedIdentity/userAssignedIdentities
}
```

## Assign the user-assigned identity to a Windows VM

A user-assigned identity can be used by clients on multiple Azure resources. Use the following commands to assign the user-assigned identity to a single VM. Use the `Id` property returned in the previous step for the `-IdentityID` parameter.

```azurepowershell-interactive
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM
Update-AzVM -ResourceGroupName TestRG -VM $vm -IdentityType "UserAssigned" -IdentityID "/subscriptions/<SUBSCRIPTIONID>/resourcegroups/myResourceGroupVM/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"
```

## Grant your user-assigned identity access to a Resource Group in Azure Resource Manager 

Managed identities for Azure resources provides identities that your code can use to request access tokens to authenticate to resource APIs that support Azure AD authentication. In this tutorial, your code will access the Azure Resource Manager API. 

Before your code can access the API, you need to grant the identity access to a resource in Azure Resource Manager. In this case, the Resource Group in which the VM is contained. Update the value for `<SUBSCRIPTION ID>` as appropriate for your environment.

```azurepowershell-interactive
$spID = (Get-AzUserAssignedIdentity -ResourceGroupName myResourceGroupVM -Name ID1).principalid
New-AzRoleAssignment -ObjectId $spID -RoleDefinitionName "Reader" -Scope "/subscriptions/<SUBSCRIPTIONID>/resourcegroups/myResourceGroupVM/"
```

The response contains details for the role assignment created, similar to the following example:

```azurepowershell
RoleAssignmentId: /subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourcegroups/myResourceGroupVM/providers/Microsoft.Authorization/roleAssignments/f9cc753d-265e-4434-ae19-0c3e2ead62ac
Scope: /subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourcegroups/myResourceGroupVM
DisplayName: ID1
SignInName:
RoleDefinitionName: Reader
RoleDefinitionId: acdd72a7-3385-48ef-bd42-f606fba81ae7
ObjectId: e591178e-b785-43c8-95d2-1397559b2fb9
ObjectType: ServicePrincipal
CanDelegate: False
```

## Get an access token using the VM's identity and use it to call Resource Manager 

For the remainder of the tutorial, you will work from the VM we created earlier.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com)

2. In the portal, navigate to **Virtual Machines** and go to the Windows virtual machine and in the **Overview**, click **Connect**.

3. Enter the **Username** and **Password** you used when you created the Windows VM.

4. Now that you have created a **Remote Desktop Connection** with the virtual machine, open **PowerShell** in the remote session.

5. Using PowerShell’s `Invoke-WebRequest`, make a request to the local managed identities for Azure resources endpoint to get an access token for Azure Resource Manager.  The `client_id` value is the value returned when you [created the user-assigned managed identity](#create-a-user-assigned-identity).

    ```azurepowershell
    $response = Invoke-WebRequest -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&client_id=af825a31-b0e0-471f-baea-96de555632f9&resource=https://management.azure.com/' -Method GET -Headers @{Metadata="true"}
    $content = $response.Content | ConvertFrom-Json
    $ArmToken = $content.access_token
    ```

## Read the properties of a Resource Group

Use the access token retrieved in the previous step to access Azure Resource Manager, and read the properties of the Resource Group you granted your user-assigned identity access. Replace `<SUBSCRIPTION ID>` with the subscription id of your environment.

```azurepowershell
(Invoke-WebRequest -Uri https://management.azure.com/subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourceGroups/myResourceGroupVM?api-version=2016-06-01 -Method GET -ContentType "application/json" -Headers @{Authorization ="Bearer $ArmToken"}).content
```
The response contains the specific Resource Group information, similar to the following example:

```json
{"id":"/subscriptions/<SUBSCRIPTIONID>/resourceGroups/myResourceGroupVM","name":"myResourceGroupVM","location":"eastus","properties":{"provisioningState":"Succeeded"}}
```

## Next steps

In this tutorial, you learned how to create a user-assigned identity and attach it to an Azure Virtual Machine to access the Azure Resource Manager API.  To learn more about Azure Resource Manager see:

> [!div class="nextstepaction"]
>[Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview)
