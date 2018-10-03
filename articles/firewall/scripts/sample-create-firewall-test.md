---
title: Azure PowerShell script sample - Create Azure Firewall test environment
description: Azure PowerShell script sample - Create Azure Firewall test enviroment.
services: virtual-network
author: vhorne
ms.service: firewall
ms.devlang: powershell
ms.topic: sample
ms.date: 8/13/2018
ms.author: victorh
---

# Create an Azure Firewall test environment

This script sample creates a firewall and a test network environment. The network has one VNet, with three subnets: an *AzureFirewallSubnet*, and *ServersSubnet*, and a *JumpboxSubnet*. The ServersSubnet and JumpboxSubnet each have one 2-core Windows Server in them.

The firewall is in the AzureFirewallSubnet and is configured with an Application Rule Collection with a single rule that allows access to www.microsoft.com.

A user defined route is created that points the network traffic from the ServersSubnet through the firewall, where the firewall rules are applied.

You can run the script from the Azure [Cloud Shell](https://shell.azure.com/powershell), or from a local PowerShell installation. 

If you run PowerShell locally, this script requires the latest AzureRM PowerShell module version (6.9.0 or greater). To find the installed version, run `Get-Module -ListAvailable AzureRM`. 

You can use `PowerShellGet` if you need to upgrade, which is built into Windows 10 and Windows Server 2016.

> [!NOTE]
>Other Windows version require you to install `PowerShellGet` before you can use it. 
>You can run `Get-Module -Name PowerShellGet -ListAvailable | Select-Object -Property Name,Version,Path` to determine if it is installed on your system. If the output is blank, you need to install the latest [Windows Management framework](https://www.microsoft.com/download/details.aspx?id=54616).

For more information, see [Install Azure PowerShell on Windows with PowerShellGet](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-6.4.0)

Any existing Azure PowerShell installation done with the Web Platform installer will conflict with the PowerShellGet installation and needs to be removed.

Remember that if you run PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script


[!code-azurepowershell-interactive[main](../../../powershell_scripts/firewall/create-fw-test.ps1  "Create a firewall test environment")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources:

```powershell
Remove-AzureRmResourceGroup -Name AzfwSampleScriptEastUS -Force
```

## Script explanation

This script uses the following commands to create a resource group, virtual network, and network security groups. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates a subnet configuration object |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates an Azure virtual network and front-end subnet. |
| [New-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/new-azurermnetworksecurityruleconfig) | Creates security rules to be assigned to a network security group. |
| [New-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/new-azurermnetworksecuritygroup) |Creates NSG rules that allow or block specific ports to specific subnets. |
| [Set-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig) | Associates NSGs to subnets. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address to access the VM from the internet. |
| [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) | Creates virtual network interfaces and attaches them to the virtual network's front-end and back-end subnets. |
| [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) | Create a virtual machine. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |
|[New-AzureRmFirewall](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermfirewall?view=azurermps-6.9.0)| Creates a new Azure Firewall.|
|[Get-AzureRmFirewall](https://docs.microsoft.com/powershell/module/azurerm.network/get-azurermfirewall?view=azurermps-6.9.0)|Gets an Azure Firewall object.|
|[New-AzureRmFirewallApplicationRule](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermfirewallapplicationrule?view=azurermps-6.9.0)|Creates a new Azure Firewall application rule.|
|[Set-AzureRmFirewall](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermfirewall?view=azurermps-6.9.0)|Commits changes to the Azure Firewall object.|


## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

