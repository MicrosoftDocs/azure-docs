---
title: Use a Windows VM user assigned MSI to access Azure Resource Manager
description: A tutorial that walks you through the process of using a User Assigned Managed Service Identity (MSI) on a Windows VM, to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: daveba
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2018
ms.author: arluca
---

# Use a User Assigned Managed Service Identity (MSI) on a Windows VM, to access Azure Resource Manager

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This tutorial explains how to create a user assigned Managed Service Identity (MSI), assign it to a Windows Virtual Machine (VM), and then use that identity to access the Azure Resource Manager API. 

Managed Service Identities are automatically managed by Azure. They enable authentication to services that support Azure AD authentication, without needing to embed credentials into your code.

You learn how to:

> [!div class="checklist"]
> * Create a Windows VM 
> * Create a user assigned MSI
> * Assign your user assigned MSI to your Windows VM
> * Grant the MSI access to a Resource Group in Azure Resource Manager 
> * Get an access token using the MSI and use it to call Azure Resource Manager 
> * Read the properties of a Resource Group

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]


[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

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

## Create a user assigned MSI

A user assigned MSI is create as a standalone Azure resource.  Using the [New-AzureRmUserAssignedIdentity](/powershell/module/azurerm.managedserviceidentity/get-azurermuserassignedidentity), Azure creates an identity in your Azure AD tenant that can be assigned to one or more Azure service instances.

```azurepowershell-interactive
Get-AzureRmUserAssignedIdentity -ResourceGroupName myResourceGroupVM -Name ID1
```

The response contains details for the user assigned MSI created, similar to the following example. Note the `Id` value for your MSI, as it will be used in the next step:

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

## Assign the user assigned MSI to a Windows VM

A user assigned MSI can be used by clients on multiple Azure resources. Use the following commands to assign the user assigned identity to a single VM. Use the `Id` property returned in the previous step for the `-IdentityID` parameter.

```azurepowershell-interactive
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
Update-AzureRmVM -ResourceGroupName TestRG -VM $vm -IdentityType "UserAssigned" -IdentityID "/subscriptions/<SUBSCRIPTIONID>/resourcegroups/myResourceGroupVM/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"
```

## Grant your user assigned MSI access to a Resource Group in Azure Resource Manager 

MSI provides your code with an access token to authenticate to resource APIs that support Azure AD authentication. In this tutorial, your code accesses the Azure Resource Manager API. 

Before your code can access the API though, you need to grant the MSI's identity access to a resource in Azure Resource Manager. In this case, the Resource Group in which the VM is contained. Update the value for `<SUBSCRIPTION ID>` as appropriate for your environment.

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

For the remainder of the tutorial, we will work from the VM we created earlier.

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com)

In the portal, navigate to **Virtual Machines** and go to the Windows virtual machine and in the **Overview**, click **Connect**.

Enter in the **Username** and **Password** you used when you created the Windows VM.

Now that you have created a **Remote Desktop Connection** with the virtual machine, open **PowerShell** in the remote session.

Using PowerShell’s `Invoke-WebRequest`, make a request to the local MSI endpoint to get an access token for Azure Resource Manager.

```azurepowershell
$response = Invoke-WebRequest -Uri http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01 -Body @{resource="https://management.azure.com/"} -Method GET -Headers @{Metadata="true"}
$content = $response.Content | ConvertFrom-Json
$ArmToken = $content.access_token
```
## Read the properties of a Resource Group

Use the access token retrieved in the previous step to access Azure Resource Manager, and read the properties of the Resource Group you granted your user assigned MSI access. Replace <SUBSCRIPTION ID> with the subscription id of your environment.

```azurepowershell
(Invoke-WebRequest -Uri https://management.azure.com/subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourceGroups/myResourceGroupVM?api-version=2016-06-01 -Method GET -ContentType "application/json" -Headers @{Authorization ="Bearer $ArmToken"}).content
```
The response contains the specific Resource Group information, similar to the following example:

```json
{"id":"/subscriptions/<SUBSCRIPTIONID>/resourceGroups/TestRG","name":"myResourceGroupVM","location":"eastus","properties":{"provisioningState":"Succeeded"}}
```

## Next steps

- For an overview of MSI, see [Managed Service Identity overview](overview.md).
