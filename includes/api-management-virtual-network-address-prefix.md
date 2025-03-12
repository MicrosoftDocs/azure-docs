---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 11/21/2024
ms.author: danlep
---

### addressPrefix property

Virtual network injection in the Premium v2 tier requires that the `addressPrefix` subnet property is set to a valid CIDR block. 

If you configure the subnet using the Azure portal, the subnet sets an `addressPrefixes` (plural) property consisting of a list of address prefixes. However, API Management requires a single CIDR block as the value of the `addressPrefix` property. 

To create or update a subnet with `addressPrefix`, use a tool such as Azure PowerShell, an Azure Resource Manager template, or the [REST API](/rest/api/virtualnetwork/subnets/create-or-update). For example, update a subnet using the [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) Azure PowerShell cmdlet:

```powershell
# Set values for the variables that are appropriate for your environment.

$resourceGroupName = "MyResourceGroup"
$virtualNetworkName = "MyVirtualNetwork"
$subnetName = "ApimSubnet"
$addressPrefix = "10.0.3.0/24"


$virtualNetwork = Get-AzVirtualNetwork -Name $virtualNetworkName -ResourceGroupName $resourceGroupName

Set-AzVirtualNetworkSubnetConfig -Name $subnetName -VirtualNetwork $virtualNetwork -AddressPrefix $addressPrefix

$virtualNetwork | Set-AzVirtualNetwork
```