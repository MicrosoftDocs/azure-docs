---
title: Configure cross-tenant connection in Azure Virtual Network Manager - PowerShell
description: #Required; article description that is displayed in search results. 
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 11/02/2022
ms.custom: template-how-to 
#customerintent: As a cloud admin, in need to manage multi tenants from a single network manager instance. Cross tenant functionality will give me this so I manage all network resources governed by azure virtual network manager
---


# Configure cross-tenant connection in Azure Virtual Network Manager - PowerShell

In this article, you'll learn to create [cross-tenant connections](concept-cross-tenant.md) in the Azure Virtual Network Manager with Azure PowerShell. First, you'll create the scope connection on the central network manager. Then you'll create the network manager connection on the connecting tenant, and verify connection. Last, you'll add virtual networks from different tenants and verify. Once completed, You can centrally manage the resources of other tenants from single network manager instance.

To learn more, see [how cross-tenant connections work in [Azure Virtual Network Manager](concept-cross-tenant.md).

## Prerequisites

- Two Azure tenants with virtual networks needing to be managed by Azure Virtual Network Manager Deploy
- Azure Virtual Network Manager deployed in tenant
- Permissions <>
- Tenant-specific information including:
    - Resource ID
    - Tenant IDs
    - Resource Group name
    - Network manager name
    - 


## Create scope connection within network manager
Creation of the scope connection begins on the central network manager. This is the network manager where you plan to manager all of your resources. In this task, you'll set up a scope connection with [New-AzNetworkManagerSubscriptionConnection](/powershell/module/az.network/new-aznetworkmanagersubscriptionconnection)

```azurepowershell

# Create scope connection to target tenant
New-AzNetworkManagerScopeConnection -Name toFabrikamTenantSub -ResourceGroup $rg.name -NetworkManagerName jaredgorthy -ResourceId "/subscriptions/87654321-abcd-1234-1def-0987654321ab" -Description "this is to manage fabrikam's vnets" -TenantId "12345678-12a3-4abc-5cde-678909876543"


```

## Create network manager connection on subscription in other tenant 
Once the scope connection is created, you'll switch to your target tenant for the network manager connection. During this task, you'll connect the target tenant to the scope connection created previously

```azurepowershell

Set-AzContext -TenantId 12345678-12a3-4abc-5cde-678909876543

Select-AzSubscription 87654321-abcd-1234-1def-0987654321ab

New-AzNetworkManagerSubscriptionConnection -Name toContosoTenantNM -Description "this is to be managed by a contoso network manager" -NetworkManagerId "/subscriptions/13579864-1234-5678-abcd-0987654321ab/resourceGroups/$rg.name/providers/Microsoft.Network/networkManagers/jaredgorthy"



Get-AzNetworkManagerSubscriptionConnection -Name toContosoTenantNM
```

## Verify the connection state is ‘Connected’ (via grid item ‘Status’)

Switch back to the Contoso tenant, and performing a get on the network manager should show the subscription added via the cross tenant scopes property.

```azurepowershell

Get-AzNetworkManager -ResourceGroup $rg.name -Name jaredgorthy

```

## Generate auth tokens for PowerShell
From Azure Portal and Azure CLI we generate the auth tokens needed for the put static member request behind the scenes. Unfortunately, this is not possible (yet) via AVNM’s powershell cmdlets, so the tokens must be generated manually and the request must be sent via the ‘Invoke-RestMethod’ cmdlet


# Get the group you want to add the static members to
$group = Get-AzNetworkManagerGroup -NetworkManagerName jaredgorthy -ResourceGroup $rg.name -Name containsCrossTenantResources

# Need to be modified
$networkManagerTenant = "24680975-1234-abcd-56fg-121314ab5643"
$vnetTenant = "12345678-12a3-4abc-5cde-678909876543"
$staticMemberName = "crossTenantMember"
$vnetResourceId = “/subscriptions/795fe552-a2fc-466a-b436-de4520b73dd2/resourceGroups/temp/providers/Microsoft.Network/virtualNetworks/Vnet1”

# Everything after this can be copy/pasted
$networkManagerToken = Get-AzAccessToken -TenantId $networkManagerTenant
$vnetToken = Get-AzAccessToken -TenantId $vnetTenant

$authHeader = @{
   'Content-Type'='application/json'
   'Authorization'='Bearer ' + $networkManagerToken.Token
   'x-ms-authorization-auxiliary'='Bearer ' + $vnetToken.Token
}

$body = (@{
	‘properties'= @{
		'resourceId'=$vnetResourceId
	}
} | ConvertTo-Json)

$restUri = "https://management.azure.com" + $group.Id + "/staticMembers/" + $staticMemberName + "?api-version=2022-01-01"
Invoke-RestMethod -Uri $restUri -Method Put -Headers $authHeader -Body $body

