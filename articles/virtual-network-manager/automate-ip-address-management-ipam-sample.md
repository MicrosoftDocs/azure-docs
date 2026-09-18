---
title: Automate virtual network IPAM with Azure IPAM pools
description: This article provides a sample PowerShell script to automate the creation and management of VNets using IPAM pools in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: sample
ms.date: 07/29/2026
ai-usage: ai-generated
ms.custom:
  - references_regions
---

# Automate virtual network IPAM with Azure IPAM pools

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

IPAM pools in Azure Virtual Network Manager help you manage IP address spaces for your virtual networks. This feature helps you avoid overlapping address spaces and ensures that your VNets are created with the correct IP address ranges.

This article provides a sample PowerShell script that demonstrates how to create multiple VNets, associate existing VNets with IPAM pools, and disassociate VNets from IPAM pools.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Azure PowerShell](/powershell/azure/new-azureps-module-az) installed locally or use [Azure Cloud Shell](/azure/cloud-shell/overview). This sample script only uses virtual network cmdlets, which Azure Cloud Shell supports. Use PowerShell locally instead of Azure Cloud Shell when you [create your virtual network manager instance](create-virtual-network-manager-powershell.md#prerequisites), because Azure Cloud Shell's version of *Az.Network* doesn't currently support Azure Virtual Network Manager cmdlets.
- A virtual network manager instance with an IPAM pool created. For more information, see [Create a virtual network manager](./create-virtual-network-manager-powershell.md) and [Create an IPAM pool](./how-to-manage-ip-addresses-network-manager.md).
- An existing resource group where you want to create the VNets. It's recommended to use the same resource group as the virtual network manager instance for better organization and management.


## Review the sample script

The script is located in the Azure Samples repository on GitHub. You can view and download the script from the following link:
[automate-vnet-ip-address-management.ps1](https://github.com/Azure-Samples/azure-docs-powershell-samples/blob/main/virtual-network-manager/automate-vnet-ip-address-management.ps1)

After you set the location, resource group, subscription, IPAM pool resource ID, and number of IP addresses at the top of the script, it performs three operations in order:

1. **Bulk create virtual networks from the pool.** For each of 10 virtual networks, the script builds a subnet configuration with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) and creates the virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork), passing the IPAM pool reference to the `-IpamPoolPrefixAllocation` parameter on both. The pool allocates the address space.
1. **Bulk disassociate existing virtual networks from the pool.** The script retrieves the virtual networks in the resource group with [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork), clears `IpamPoolPrefixAllocations` on each virtual network's address space and on each of its subnets, and saves the change with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork).
1. **Bulk reassociate those virtual networks with the pool.** The script restores the IPAM pool reference on the same address spaces and subnets and saves the change with `Set-AzVirtualNetwork`.

Each operation runs its updates as jobs and waits for each job to finish before starting the next, so the API calls complete in order rather than needing to be retried.

### Sample script

[!Code-powershell[main](~/azure_powershell_scripts/virtual-network-manager/automate-vnet-ip-address-management.ps1?range=19-80)]

## Sign in to your Azure account and select your subscription

If you're using Azure PowerShell locally, sign in to your Azure account:

```powershell
# Sign in to your Azure account
Connect-AzAccount

# Select your subscription
Set-AzContext -Subscription <subscriptionId>
```

Or sign in to [Azure Cloud Shell](https://shell.azure.com) and select your subscription:

```powershell
# Select your subscription
Set-AzContext -Subscription <subscriptionId>
```

## Download the script

Download the script to a local directory or your preferred PowerShell environment, including [Azure Cloud Shell](https://shell.azure.com). To download the script directly from the Azure Samples repository, use the following command:

```powershell
# Download the script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Azure-Samples/azure-docs-powershell-samples/main/virtual-network-manager/automate-vnet-ip-address-management.ps1" -OutFile "automate-vnet-ip-address-management.ps1"

```

## Update the script variables

After you download the script, open it in your preferred PowerShell editor and update the following variables to match your environment:

| **Variable** | **Description** |
|----------|-------------|
| `$location` | Enter the Azure region where you want to create the VNets such as *East US*. |
| `$rgname` | Enter the name of the resource group where you want to create the VNets. You can use `"*"` to fetch all VNets from all resource groups within the subscription. |
| `$sub` | Enter the subscription ID where you want to create the VNets. You can use `"*"` to fetch all VNets from all subscriptions within the tenant. |
| `$ipamPoolARMId` | The Azure Resource Manager ID of the IPAM pool you want to use for the VNets, similar to `"/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/networkManagers/<networkManagerName>/ipamPools/<ipAddressPoolName>"`. You can copy this resource ID from the pool's JSON view in the Azure portal. |
| `$numberIPaddresses` | The number of IP addresses to allocate from the IPAM pool. This should be a valid number based on your IPAM pool configuration. |

For Visual Studio Code, enter the following command to open the script in your editor:

```powershell
# Open the script in Visual Studio Code
code ./automate-vnet-ip-address-management.ps1
```

For Azure Cloud Shell, enter the following code to open the script in your editor:

```powershell
# Open the script in Azure Cloud Shell editor
code automate-vnet-ip-address-management.ps1
```

Remember to save your script before running it.

## Run the script

After updating the script variables, run the script in your PowerShell environment. The script creates 10 VNets using the IPAM pool reference, disassociates existing VNets from the IPAM pool, and then reassociates them with the IPAM pool.

```powershell
# Run the script
./automate-vnet-ip-address-management.ps1
```

### Sample output

```powershell

PS /home/michael/clouddrive/avnm-script> ./automate-vnet-ip-address-management.ps1

   Tenant: aaaabbbb-0000-cccc-1111-dddd2222eeee

SubscriptionName      SubscriptionId                       Account   Environment
----------------      --------------                       -------   -----------
Azure Subscription    aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e user@azure AzureCloud
Starting creation of new VNets with IpamPool reference at: 
18:49:06

Starting creation of new VNets with IpamPool reference at: 
18:49:37
Starting bulk disassociation for existing VNets at: 
18:49:37

Starting bulk disassociation for existing VNets at: 
18:49:59
Starting bulk association for existing VNets at: 
18:49:59

Finished bulk association for existing VNets at: 
18:50:32

PS /home/michael/clouddrive/avnm-script> 
```

> [!NOTE]
> The script runs synchronously to ensure that no API calls fail. Because of this, the script can take some time to complete, depending on the number of VNets being created and managed.

## Verify the virtual networks

To verify that the VNets were created and associated with the IPAM pool, you can use the following command:

```powershell
# List all VNets in the specified resource group
Get-AzVirtualNetwork -ResourceGroupName $rgname | Select-Object Name, Location, AddressSpace, @{Name = "IpamPoolPrefixAllocations"; Expression = { $_.AddressSpace.IpamPoolPrefixAllocations }}
```

This command displays the name, location, address space, and IPAM pool prefix allocations for each virtual network in the specified resource group. You should see the VNets you created with the IPAM pool reference.

## Next steps

> [!div class="nextstepaction"]
> [Prevent overlapping IP Address space with Azure Policy and IPAM pools](./prevent-overlapping-ip-address-space-policy-ipam.md)
