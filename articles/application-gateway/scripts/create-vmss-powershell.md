---
title: Azure PowerShell Script Sample - Manage web traffic | Microsoft Docs
description: Azure PowerShell Script Sample - Manage web traffic with an application gateway and a virtual machine scale set.
services: application-gateway
documentationcenter: networking
author: vhorne
manager: jpconnock
editor: tysonn
tags: azure-resource-manager

ms.service: application-gateway
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 01/29/2018
ms.author: victorh
ms.custom: mvc
---

# Manage web traffic with Azure PowerShell

This script creates an application gateway that uses a virtual machine scale set for backend servers. The application gateway can then be configured to manage web traffic. After running the script, you can test the application gateway using its public IP address.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/application-gateway/create-vmss/create-vmss.ps1 "Create application gateway")]

## Clean up deployment 

Run the following command to remove the resource group, application gateway, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroupAG
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates the subnet configuration. |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates the virtual network using with the subnet configurations. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates the public IP address for the application gateway. |
| [New-AzureRmApplicationGatewayIPConfiguration](/powershell/module/azurerm.network/new-azurermapplicationgatewayipconfiguration) | Creates the configuration that associates a subnet with the application gateway. |
| [New-AzureRmApplicationGatewayFrontendIPConfig](/powershell/module/azurerm.network/new-azurermapplicationgatewayfrontendipconfig) | Creates the configuration that assigns a public IP address to the application gateway. |
| [New-AzureRmApplicationGatewayFrontendPort](/powershell/module/azurerm.network/new-azurermapplicationgatewayfrontendport) | Assigns a port to be used to access the application gateway. |
| [New-AzureRmApplicationGatewayBackendAddressPool](/powershell/module/azurerm.network/new-azurermapplicationgatewaybackendaddresspool) | Creates a backend pool for an application gateway. |
| [New-AzureRmApplicationGatewayBackendHttpSettings](/powershell/module/azurerm.network/new-azurermapplicationgatewaybackendhttpsettings) | Configures settings for a backend pool. |
| [New-AzureRmApplicationGatewayHttpListener](/powershell/module/azurerm.network/new-azurermapplicationgatewayhttplistener) | Creates a listener. |
| [New-AzureRmApplicationGatewayRequestRoutingRule](/powershell/module/azurerm.network/new-azurermapplicationgatewayrequestroutingrule) | Creates a routing rule. |
| [New-AzureRmApplicationGatewaySku](/powershell/module/azurerm.network/new-azurermapplicationgatewaysku) | Specify the tier and capacity for an application gateway. |
| [New-AzureRmApplicationGateway](/powershell/module/azurerm.network/new-azurermapplicationgateway) | Create an application gateway. |
| [Set-AzureRmVmssStorageProfile](/powershell/module/azurerm.compute/set-azurermvmssstorageprofile) | Create a storage profile for the scale set. |
| [Set-AzureRmVmssOsProfile](/powershell/module/azurerm.compute/set-azurermvmssosprofile) | Define the operating system for the scale set. |
| [Add-AzureRmVmssNetworkInterfaceConfiguration](/powershell/module/azurerm.compute/add-azurermvmssnetworkinterfaceconfiguration) | Define the network interface for the scale set. |
| [New-AzureRmVmss](/powershell/module/azurerm.compute/new-azurermvm) | Create a virtual machine scale set. |
| [Get-AzureRmPublicIPAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) | Gets the public IP address of an application gateway. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. | 

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional application gateway PowerShell script samples can be found in the [Azure Application Gateway documentation](../powershell-samples.md).
