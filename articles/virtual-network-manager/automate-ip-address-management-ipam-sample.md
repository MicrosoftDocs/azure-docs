---
title: Automate virtual network IP Address Management with Azure IPAM Pools
description: This article provides a sample PowerShell script to automate the creation and management of VNets using IPAM pools in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: sample
ms.date: 03/14/2025
ms.custom: template-concept
---

# Automate virtual network IP Address Management with Azure IPAM Pools

IPAM Pools in Azure Virtual Network Manager allow you to manage IP address spaces for your virtual networks. This feature helps you avoid overlapping address spaces and ensures that your VNets are created with the correct IP address ranges.

In this article, we provide a sample PowerShell script that demonstrates how to create multiple VNets, associate existing VNets with IPAM pools, and disassociate VNets from IPAM pools.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure PowerShell](/powershell/azure/new-azureps-module-az?view=azps-7.4.0&preserve-view=true) installed locally or use [Azure Cloud Shell](/azure/cloud-shell/overview).
- A virtual network manager instance with an IPAM pool created. For more information, see [Create a virtual network manager](./create-virtual-network-manager-powershell.md) and [Create an IPAM pool](./how-to-manage-ip-addresses-network-manager.md).
- An existing resource group where you want to create the VNets. It's recommended to use the same resource group as the virtual network manager instance for better organization and management.


## Review the sample script

The script is located in the Azure Samples repository on GitHub. You can view and download the script from the following link:
[automate-vnet-ip-address-management.ps1](https://github.com/Azure-Samples/azure-docs-powershell-samples/blob/main/virtual-network-manager/automate-vnet-ip-address-management.ps1)

### Sample script

[!Code-powershell[main](../../azure_powershell_scripts/virtual-network-manager/automate-vnet-ip-address-management.ps1?range=19-80)]

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

Download the script to a local directory or your preferred PowerShell environment include [Azure Cloud Shell](https://shell.azure.com). You can use the following command to download the script directly from the Azure Samples repository:

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
| `$ipamPoolARMId` | The Azure Resource Manager ID of the IPAM pool you want to use for the VNets similar to `"/subscriptions/<your subscription id>/resourceGroups/<your resource group>/providers/Microsoft.Network/ipamPools/<your ipam pool name>"`. |
| `$numberIPaddresses` | The number of IP addresses to allocate from the IPAM pool. This should be a valid number based on your IPAM pool configuration. |

For Visual Studio Code or another PowerShell editor, enter the following code to open the script in your editor:

```powershell
# Open the script in Azure Cloud Shell editor or Visual Studio Code
code ./automate-vnet-ip-address-management.ps1
```

For Azure Cloud Shell, enter the following code to open the script in your editor:

```powershell
# Open the script in Azure Cloud Shell editor
code automate-vnet-ip-address-management.ps1
```

Remember to save your script before running it.

## Run the Script

After updating the script variables, you can run the script in your PowerShell environment. The script creates 10 VNets using the IPAM pool reference, disassociate existing VNets from the IPAM pool, and then re-associate them with the IPAM pool.

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

HasMoreData          : True
Location             : localhost
StatusMessage        : Completed
CurrentPSTransaction : 
Host                 : System.Management.Automation.Internal.Host.InternalHost
Command              : New-AzVirtualNetwork
JobStateInfo         : Completed
Finished             : System.Threading.ManualResetEvent
InstanceId           : b05bce55-99b6-4a91-b1b7-cf6da245def1
Id                   : 3
Name                 : Long Running Operation for 'New-AzVirtualNetwork' on resource 'bulk-ipam-vnet-0'
ChildJobs            : {}
PSBeginTime          : 3/12/2025 6:49:06 PM
PSEndTime            : 3/12/2025 6:49:22 PM
PSJobTypeName        : AzureLongRunningJob`1
Output               : {Microsoft.Azure.Commands.Network.Models.PSVirtualNetwork}
Error                : {}
Progress             : {}
Verbose              : {}
Debug                : {[AzureLongRunningJob]: Starting cmdlet execution, setting for cmdlet confirmation required: 'False', [AzureLongRunningJob]: Completing cmdlet execution in RunJob}
Warning              : {}
Information          : {}
State                : Completed

Starting creation of new VNets with IpamPool reference at: 
18:49:37
Starting bulk disassociation for existing VNets at: 
18:49:37

HasMoreData          : True
Location             : localhost
StatusMessage        : Completed
CurrentPSTransaction : 
Host                 : System.Management.Automation.Internal.Host.InternalHost
Command              : Set-AzVirtualNetwork
JobStateInfo         : Completed
Finished             : System.Threading.ManualResetEvent
InstanceId           : cccccccc-2222-3333-4444-dddddddddddd
Id                   : 5
Name                 : Long Running Operation for 'Set-AzVirtualNetwork'
ChildJobs            : {}
PSBeginTime          : 3/12/2025 6:49:37 PM
PSEndTime            : 3/12/2025 6:49:48 PM
PSJobTypeName        : AzureLongRunningJob`1
Output               : {Microsoft.Azure.Commands.Network.Models.PSVirtualNetwork}
Error                : {}
Progress             : {}
Verbose              : {}
Debug                : {[AzureLongRunningJob]: Starting cmdlet execution, setting for cmdlet confirmation required: 'False', [AzureLongRunningJob]: Completing cmdlet execution in RunJob}
Warning              : {}
Information          : {}
State                : Completed

Starting bulk disassociation for existing VNets at: 
18:49:59
Starting bulk association for existing VNets at: 
18:49:59

HasMoreData          : True
Location             : localhost
StatusMessage        : Completed
CurrentPSTransaction : 
Host                 : System.Management.Automation.Internal.Host.InternalHost
Command              : Set-AzVirtualNetwork
JobStateInfo         : Completed
Finished             : System.Threading.ManualResetEvent
InstanceId           : bbbbbbbb-1111-2222-3333-cccccccccccc
Id                   : 7
Name                 : Long Running Operation for 'Set-AzVirtualNetwork'
ChildJobs            : {}
PSBeginTime          : 3/12/2025 6:49:59 PM
PSEndTime            : 3/12/2025 6:50:16 PM
PSJobTypeName        : AzureLongRunningJob`1
Output               : {Microsoft.Azure.Commands.Network.Models.PSVirtualNetwork}
Error                : {}
Progress             : {}
Verbose              : {}
Debug                : {[AzureLongRunningJob]: Starting cmdlet execution, setting for 
                       cmdlet confirmation required: 'False', [AzureLongRunningJob]: 
                       Completing cmdlet execution in RunJob}
Warning              : {}
Information          : {}
State                : Completed

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
Get-AzVirtualNetwork -ResourceGroupName $rgname | Select-Object Name, Location, AddressSpace, IpamPoolPrefixAllocations
```

This command displays the name, location, address space, and IPAM pool prefix allocations for each virtual network in the specified resource group. You should see the VNets you created with the IPAM pool reference.

## Next steps

> [!div class="nextstepaction"]
> [Prevent overlapping IP Address space with Azure Policy and IPAM pools](./prevent-overlapping-ip-address-space-policy-ipam.md)
