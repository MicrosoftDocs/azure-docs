---
title: Use a Windows VM user assigned Managed Service Identity to access Azure Resource Manager
description: A tutorial that walks you through the process of using a User Assigned Managed Service Identity on a Windows VM, to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: daveba
ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2018
ms.author: daveba
---

# Tutorial: Use a User Assigned Managed Service Identity on a Windows VM, to access Azure Resource Manager

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This tutorial explains how to create a user assigned identity, assign it to a Windows Virtual Machine (VM), and then use that identity to access the Azure Resource Manager API. Managed Service Identities are automatically managed by Azure. They enable authentication to services that support Azure AD authentication, without needing to embed credentials into your code. 

You learn how to:

> [!div class="checklist"]
> * Create a Windows VM 
> * Create a user assigned identity
> * Assign your user assigned identity to your Windows VM
> * Grant the user assigned identity access to a Resource Group in Azure Resource Manager 
> * Get an access token using the user assigned identity and use it to call Azure Resource Manager 
> * Read the properties of a Resource Group

## Prerequisites

- If your are unfamiliar with Managed Service Identity, check out the [overview](overview.md) section. **Be sure to review the [differences between system and user assigned identities](overview.md#how-does-it-work)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the required resource creation and role management steps in this tutorial, your account needs "Owner" permissions at the appropriate scope (your subscription or resource group). If you need assistance with role assignment, see [Use Role-Based Access Control to manage access to your Azure subscription resources](/azure/role-based-access-control/role-assignments-portal).

If you choose to install and use PowerShell locally, this tutorial requires the Azure PowerShell module version 5.7 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Create resource group

In the following example, a resource group named, *myResourceGroupVM* is created in the *EastUS* region.

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName "myResourceGroupVM" -Location "EastUS"
```

## Create virtual machine

After the resource group is created, create a Windows VM.

Set the username and password needed for the administrator account on the virtual machine with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell-interactive
$cred = Get-Credential
```
Create the virtual machine with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm).

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroupVM" `
    -Name "myVM" `
    -Location "East US" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -Credential $cred
```

## Create a user assigned identity

A user assigned identity is created as a standalone Azure resource. Using the [New-AzureRmUserAssignedIdentity](/powershell/module/azurerm.managedserviceidentity/get-azurermuserassignedidentity),  Azure creates an identity in your Azure AD tenant that can be assigned to one or more Azure service instances.

[!INCLUDE[ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```azurepowershell-interactive
Get-AzureRmUserAssignedIdentity -ResourceGroupName myResourceGroupVM -Name ID1
```

The response contains details for the user assigned identity created, similar to the following example. Note the `Id` value for your user assigned identity, as it will be used in the next step:

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

## Assign the user assigned identity to a Windows VM

A user assigned identity can be used by clients on multiple Azure resources. Use the following commands to assign the user assigned identity to a single VM. Use the `Id` property returned in the previous step for the `-IdentityID` parameter.

```azurepowershell-interactive
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
Update-AzureRmVM -ResourceGroupName TestRG -VM $vm -IdentityType "UserAssigned" -IdentityID "/subscriptions/<SUBSCRIPTIONID>/resourcegroups/myResourceGroupVM/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"
```

## Grant your user assigned Managed Service Identity access to a Resource Group in Azure Resource Manager 

Managed Service Identity Managed Service Identity provides identities that your code can use to request access tokens to authenticate to resource APIs that support Azure AD authentication. In this tutorial, your code will access the Azure Resource Manager API. 

Before your code can access the API, you need to grant the identity access to a resource in Azure Resource Manager. In this case, the Resource Group in which the VM is contained. Update the value for `<SUBSCRIPTION ID>` as appropriate for your environment.

```azurepowershell-interactive
$spID = (Get-AzureRmUserAssignedIdentity -ResourceGroupName myResourceGroupVM -Name ID1).principalid
New-AzureRmRoleAssignment -ObjectId $spID -RoleDefinitionName "Reader" -Scope "/subscriptions/<SUBSCRIPTIONID>/resourcegroups/myResourceGroupVM/"
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

5. Using PowerShell’s `Invoke-WebRequest`, make a request to the local Managed Service Identity endpoint to get an access token for Azure Resource Manager.

    ```azurepowershell
    $response = Invoke-WebRequest -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&client_id=73444643-8088-4d70-9532-c3a0fdc190fz&resource=https://management.azure.com' -Method GET -Headers @{Metadata="true"}
    $content = $response.Content | ConvertFrom-Json
    $ArmToken = $content.access_token
    ```

## Read the properties of a Resource Group

Use the access token retrieved in the previous step to access Azure Resource Manager, and read the properties of the Resource Group you granted your user assigned identity access. Replace <SUBSCRIPTION ID> with the subscription id of your environment.

```azurepowershell
(Invoke-WebRequest -Uri https://management.azure.com/subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourceGroups/myResourceGroupVM?api-version=2016-06-01 -Method GET -ContentType "application/json" -Headers @{Authorization ="Bearer $ArmToken"}).content
```
The response contains the specific Resource Group information, similar to the following example:

```json
{"id":"/subscriptions/<SUBSCRIPTIONID>/resourceGroups/TestRG","name":"myResourceGroupVM","location":"eastus","properties":{"provisioningState":"Succeeded"}}
```

## Next steps

In this tutorial, you learned how to create a user assigned identity and attach it to a Azure Virtual Machine to access the Azure Resource Manager API.  To learn more about Azure Resource Manager see:

> [!div class="nextstepaction"]
>[Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview)