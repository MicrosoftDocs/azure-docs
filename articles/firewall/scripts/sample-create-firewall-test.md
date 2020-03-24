---
title: Create an Azure Firewall test environment
description: This script sample creates a firewall and a test network environment. The network has one VNet, with three subnets.
services: virtual-network
author: vhorne
ms.service: firewall
ms.devlang: powershell
ms.topic: sample
ms.date: 11/19/2019
ms.author: victorh
---

# Create an Azure Firewall test environment

This script sample creates a firewall and a test network environment. The network has one VNet, with three subnets: an *AzureFirewallSubnet*, and *ServersSubnet*, and a *JumpboxSubnet*. The ServersSubnet and JumpboxSubnet each have one 2-core Windows Server in them.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

The firewall is in the AzureFirewallSubnet and is configured with an Application Rule Collection with a single rule that allows access to `www.microsoft.com`.

A user defined route is created that points the network traffic from the ServersSubnet through the firewall, where the firewall rules are applied.

You can run the script from the Azure [Cloud Shell](https://shell.azure.com/powershell), or from a local PowerShell installation. 

If you run PowerShell locally, this script requires Azure PowerShell. To find the installed version, run `Get-Module -ListAvailable Az`. 

You can use `PowerShellGet` if you need to upgrade, which is built into Windows 10 and Windows Server 2016.

> [!NOTE]
>Other Windows version require you to install `PowerShellGet` before you can use it. 
>You can run `Get-Module -Name PowerShellGet -ListAvailable | Select-Object -Property Name,Version,Path` to determine if it is installed on your system. If the output is blank, you need to install the latest [Windows Management framework](https://www.microsoft.com/download/details.aspx?id=54616).

For more information, see [Install Azure PowerShell](/powershell/azure/install-Az-ps)

Any existing Azure PowerShell installation done with the Web Platform installer will conflict with the PowerShellGet installation and needs to be removed.

Remember that if you run PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script


[!code-azurepowershell-interactive[main](../../../powershell_scripts/firewall/create-fw-test.ps1  "Create a firewall test environment")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources:

```powershell
Remove-AzResourceGroup -Name AzfwSampleScriptEastUS -Force
```

## Script explanation

This script uses the following commands to create a resource group, virtual network, and network security groups. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration object |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates an Azure virtual network and front-end subnet. |
| [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) | Creates security rules to be assigned to a network security group. |
| [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) |Creates NSG rules that allow or block specific ports to specific subnets. |
| [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) | Associates NSGs to subnets. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates a public IP address to access the VM from the internet. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates virtual network interfaces and attaches them to the virtual network's front-end and back-end subnets. |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzVM](/powershell/module/az.compute/new-azvm) | Create a virtual machine. |
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |
|[New-AzFirewall](https://docs.microsoft.com/powershell/module/az.network/new-azfirewall)| Creates a new Azure Firewall.|
|[Get-AzFirewall](https://docs.microsoft.com/powershell/module/az.network/get-azfirewall)|Gets an Azure Firewall object.|
|[New-AzFirewallApplicationRule](https://docs.microsoft.com/powershell/module/az.network/new-azfirewallapplicationrule)|Creates a new Azure Firewall application rule.|
|[Set-AzFirewall](https://docs.microsoft.com/powershell/module/az.network/set-azfirewall)|Commits changes to the Azure Firewall object.|

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

