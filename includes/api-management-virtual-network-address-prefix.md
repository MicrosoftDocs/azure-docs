---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 11/21/2024
ms.author: danlep
---

### addressPrefix property

To configure networking in the Premium v2 tier, the `addressPrefix` subnet property is required and must be set to a valid CIDR block. 

If you configure the subnet using the Azure portal, the subnet sets an `addressPrefixes` (plural) property consisting of a list of address prefixes. However, the API Management service currently requires a single CIDR block as the value of the `addressPrefix` property. 

To create or update a subnet with the `addressPrefix` property, use a tool such as Azure PowerShell, an Azure Resource Manager template, or the [REST API](/rest/api/virtualnetwork/subnets/create-or-update). For example, update a subnet using the [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) Azure PowerShell cmdlet:

```powershell
$virtualNetwork = "MyVirtualNetwork"
$subnetName = "apimSubnet"
$addressPrefix = "10.0.3.0/24"

Set-AzVirtualNetworkSubnetConfig -Name $subnetName -VirtualNetwork $virtualNetwork -AddressPrefix $addressPrefix

$virtualNetwork | Set-AzVirtualNetwork
```