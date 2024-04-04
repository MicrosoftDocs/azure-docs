---
title: Azure PowerShell Script Sample - Create WAF custom  rules
description: Azure PowerShell Script Sample - Create Web Application Firewall custom  rules
author: greg-lindsay
ms.service: application-gateway
ms.topic: sample
ms.date: 6/7/2019
ms.author: greglin 
ms.custom: devx-track-azurepowershell
---

# Create Web Application Firewall (WAF) custom rules with Azure PowerShell

This script creates an Application Gateway Web Application Firewall that uses custom rules. The custom rule blocks traffic if the request header contains User-Agent *evilbot*.

## Prerequisites

### Azure PowerShell module

If you choose to install and use Azure PowerShell locally, this script requires the Azure PowerShell module version 2.1.0 or later.

1. To find the version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).
2. To create a connection with Azure, run `Connect-AzAccount`.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/application-gateway/waf-rules/waf-custom-rules.ps1 "Custom WAF rules")]

## Clean up deployment

Run the following command to remove the resource group, application gateway, and all related resources.

```powershell
Remove-AzResourceGroup -Name CustomRulesTest
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
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |
|[New-AzApplicationGatewayAutoscaleConfiguration](/powershell/module/az.network/New-AzApplicationGatewayAutoscaleConfiguration)|Creates an autoscale configuration for the Application Gateway.|
|[New-AzApplicationGatewayFirewallMatchVariable](/powershell/module/az.network/New-AzApplicationGatewayFirewallMatchVariable)|Creates a match variable for firewall condition.|
|[New-AzApplicationGatewayFirewallCondition](/powershell/module/az.network/New-AzApplicationGatewayFirewallCondition)|Creates a match condition for custom rule.|
|[New-AzApplicationGatewayFirewallCustomRule](/powershell/module/az.network/New-AzApplicationGatewayFirewallCustomRule)|Creates a new custom rule for the application gateway firewall policy.|
|[New-AzApplicationGatewayFirewallPolicy](/powershell/module/az.network/New-AzApplicationGatewayFirewallPolicy)|Creates a application gateway firewall policy.|
|[New-AzApplicationGatewayWebApplicationFirewallConfiguration](/powershell/module/az.network/New-AzApplicationGatewayWebApplicationFirewallConfiguration)|Creates a WAF configuration for an application gateway.|

## Next steps

- For more information about WAF custom rules, see [Custom rules for Web Application Firewall](../../web-application-firewall/ag/custom-waf-rules-overview.md)
- For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).
- Additional application gateway PowerShell script samples can be found in the [Azure Application Gateway documentation](../powershell-samples.md).