---
title: Azure PowerShell Script Sample - Manage web traffic | Microsoft Docs
description: Azure PowerShell Script Sample - Manage web traffic with an application gateway and a virtual machine scale set.
services: application-gateway
documentationcenter: networking
author: greg-lindsay


tags: azure-resource-manager

ms.service: application-gateway
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 01/29/2018
ms.author: greglin
ms.custom: mvc, devx-track-azurepowershell
---

# Manage web traffic with Azure PowerShell

This script creates an application gateway that uses a virtual machine scale set for backend servers. The application gateway can then be configured to manage web traffic. After running the script, you can test the application gateway using its public IP address.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/application-gateway/create-vmss/create-vmss.ps1 "Create application gateway")]

## Clean up deployment 

Run the following command to remove the resource group, application gateway, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroupAG
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates the subnet configuration. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates the virtual network using with the subnet configurations. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates the public IP address for the application gateway. |
| [New-AzApplicationGatewayIPConfiguration](/powershell/module/az.network/new-azapplicationgatewayipconfiguration) | Creates the configuration that associates a subnet with the application gateway. |
| [New-AzApplicationGatewayFrontendIPConfig](/powershell/module/az.network/new-azapplicationgatewayfrontendipconfig) | Creates the configuration that assigns a public IP address to the application gateway. |
| [New-AzApplicationGatewayFrontendPort](/powershell/module/az.network/new-azapplicationgatewayfrontendport) | Assigns a port to be used to access the application gateway. |
| [New-AzApplicationGatewayBackendAddressPool](/powershell/module/az.network/new-azapplicationgatewaybackendaddresspool) | Creates a backend pool for an application gateway. |
| [New-AzApplicationGatewayBackendHttpSettings](/powershell/module/az.network/new-azapplicationgatewaybackendhttpsetting) | Configures settings for a backend pool. |
| [New-AzApplicationGatewayHttpListener](/powershell/module/az.network/new-azapplicationgatewayhttplistener) | Creates a listener. |
| [New-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/new-azapplicationgatewayrequestroutingrule) | Creates a routing rule. |
| [New-AzApplicationGatewaySku](/powershell/module/az.network/new-azapplicationgatewaysku) | Specify the tier and capacity for an application gateway. |
| [New-AzApplicationGateway](/powershell/module/az.network/new-azapplicationgateway) | Create an application gateway. |
| [Set-AzVmssStorageProfile](/powershell/module/az.compute/set-azvmssstorageprofile) | Create a storage profile for the scale set. |
| [Set-AzVmssOsProfile](/powershell/module/az.compute/set-azvmssosprofile) | Define the operating system for the scale set. |
| [Add-AzVmssNetworkInterfaceConfiguration](/powershell/module/az.compute/add-azvmssnetworkinterfaceconfiguration) | Define the network interface for the scale set. |
| [New-AzVmss](/powershell/module/az.compute/new-azvm) | Create a virtual machine scale set. |
| [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress) | Gets the public IP address of an application gateway. |
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. | 

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional application gateway PowerShell script samples can be found in the [Azure Application Gateway documentation](../powershell-samples.md).
