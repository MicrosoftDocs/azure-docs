---
title: Configure cross-tenant connection in Azure Virtual Network Manager - PowerShell
description: Learn to connect Azure subscriptions in Azure Virtual Network Manager using cross-tenant connections for the management of virtual networks across subscriptions using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 11/02/2022
ms.custom: template-how-to 
#customerintent: As a cloud admin, in need to manage multi tenants from a single network manager instance. Cross tenant functionality will give me this so I manage all network resources governed by azure virtual network manager
---


# Configure cross-tenant connection in Azure Virtual Network Manager - PowerShell

In this article, you'll learn to create [cross-tenant connections](concept-cross-tenant.md) in the Azure Virtual Network Manager with Azure PowerShell. First, you'll create the scope connection on the central network manager. Then you'll create the network manager connection on the connecting tenant, and verify connection. Last, you'll add virtual networks from different tenants and verify. Once completed, You can centrally manage the resources of other tenants from single network manager instance. Once completed, You can centrally manage the resources of other tenants from a central network manager instance.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Two Azure tenants with virtual networks needing to be managed by Azure Virtual Network Manager Deploy. During the how-to, the tenants will be referred to as follows:
  - **Central management tenant** - The tenant where an Azure Virtual Network Manager instance is installed, and you'll centrally manage network groups from cross-tenant connections.
  - **Target managed tenant** - The tenant containing virtual networks to be managed. This tenant will be connected to the central management tenant.
- Azure Virtual Network Manager deployed in the central management tenant.
- Required permissions include:
  - Administrator of central management tenant has guest account in target managed tenant.
  - Administrator guest account has *Network Contributor* permissions applied at appropriate scope level(Management group, subscription, or virtual network).

Need help with setting up permissions? Check out how to [add guest users in the Azure portal](../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md), and how to [assign user roles to resources in Azure portal](../role-based-access-control/role-assignments-portal.md)

## Create scope connection within network manager
Creation of the scope connection begins on the central network manager. This is the network manager where you plan to manager all of your resources. In this task, you'll set up a scope connection with [New-AzNetworkManagerSubscriptionConnection](/powershell/module/az.network/new-aznetworkmanagersubscriptionconnection)

```azurepowershell

# Create scope connection to target tenant
New-AzNetworkManagerScopeConnection -Name ToTargetManagedTenant -ResourceGroup "myAVNMResourceGroup" -NetworkManagerName "myAVNM" -ResourceId "/subscriptions/87654321-abcd-1234-1def-0987654321ab" -Description "This is a connection to manage resources in the target managed tenant" -TenantId "12345678-12a3-4abc-5cde-678909876543"


```

## Create network manager connection on subscription in other tenant 
Once the scope connection is created, you'll switch to your target managed tenant for the network manager connection. During this task, you'll connect the target manged tenant to the scope connection created previously.

```azurepowershell

# Change context to use target managed tenant
Set-AzContext -TenantId 12345678-12a3-4abc-5cde-678909876543

# Select subscription to use on target managed tenant
Select-AzSubscription 87654321-abcd-1234-1def-0987654321ab

# 
New-AzNetworkManagerSubscriptionConnection -Name toCentralManagementTenant -Description "This connection allows management of the tenant by a central management tenant" -NetworkManagerId "/subscriptions/13579864-1234-5678-abcd-0987654321ab/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/"myAVNM""

#
Get-AzNetworkManagerSubscriptionConnection -Name toCentralManagementTenant
```

## Verify the connection state is ‘Connected’ (via grid item ‘Status’)

Switch back to the central management tenant, and verify the subscription is added to the virtual network manager via the cross tenant scopes property.

```azurepowershell

Get-AzNetworkManager -ResourceGroup "myAVNMResourceGroup" -Name "myAVNM"

```

## Generate auth tokens for PowerShell
For Azure Portal and Azure CLI, we generate the auth tokens needed for the put static member request behind the scenes. Unfortunately, this is not possible (yet) via AVNM’s pPowershell cmdlets, so the tokens must be generated manually and the request must be sent via the ‘Invoke-RestMethod’ cmdlet


### Get the group you want to add the static members to
$group = Get-AzNetworkManagerGroup -NetworkManagerName "myAVN" -ResourceGroup myAVNMResourceGroup -Name containsCrossTenantResources

# Need to be modified

```azurepowershell

$networkManagerTenant = "24680975-1234-abcd-56fg-121314ab5643"
$targetTenant = "12345678-12a3-4abc-5cde-678909876543"
$staticMemberName = "crossTenantMember"
$targetResourceID = “/subscriptions/87654321-abcd-1234-1def-0987654321ab/resourceGroups/temp/providers/Microsoft.Network/virtualNetworks/targetVnet01”

# Everything after this can be copy/pasted
$networkManagerToken = Get-AzAccessToken -TenantId $networkManagerTenant
$targetToken = Get-AzAccessToken -TenantId $targetTenant

$authHeader = @{
   'Content-Type'='application/json'
   'Authorization'='Bearer ' + $networkManagerToken.Token
   'x-ms-authorization-auxiliary'='Bearer ' + $targetToken.Token
}

$body = (@{
	‘properties'= @{
		'resourceId'=$targetResourceID
	}
} | ConvertTo-Json)

$restUri = "https://management.azure.com" + $group.Id + "/staticMembers/" + $staticMemberName + "?api-version=2022-01-01"
Invoke-RestMethod -Uri $restUri -Method Put -Headers $authHeader -Body $body

```

## Delete virtual network manager configurations

Now that the virtual network is in the network group, configurations will be applied. To remove the static member or cross-tenant resources, using the commands below:

```azurepowershell

# delete connection on target managed tenant
Remove-AzNetworkManagerScopeConnection -Name ToTargetManagedTenant -ResourceGroup "myAVNMResourceGroup" -NetworkManagerName "myAVNM"

# delete static member group
Remove-AzNetworkManagerStaticMember -Name crossTenantMember -ResourceGroup "myAVNMResourceGroup" -NetworkManagerName "myAVNM"–NetworkGroupName containsCrossTenantResources

# Switch to ‘managed tenant’ if needed

# delete connection on central management tenant

Remove-AzNetworkManagerSubscriptionConnection -Name toCentralManagementTenant 

```
## Next steps

> [!div class="nextstepaction"]

- Learn more about [Security admin rules](concept-security-admins.md).

- Learn how to [create a mesh network topology with Azure Virtual Network Manager using the Azure portal](how-to-create-mesh-network.md)

- Check out the [Azure Virtual Network Manager FAQ](faq.md)