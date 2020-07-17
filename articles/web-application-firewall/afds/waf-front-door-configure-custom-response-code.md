---
title: Configure custom responses for Web Application Firewall (WAF) with Azure Front Door
description: Learn how to configure a custom response code and message when WAF blocks a request.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: article
ms.date: 06/10/2020
ms.author: victorh
ms.reviewer: tyao
---

# Configure a custom response for Azure Web Application Firewall (WAF)

By default, when WAF blocks a request because of a matched rule, it returns a 403 status code with **The request is blocked** message. The default message also includes the tracking reference string that can be used to link to [log entries](https://docs.microsoft.com/azure/web-application-firewall/afds/waf-front-door-monitor) for the request.  You can configure a custom response status code and a custom message with reference string for your use case. This article describes how to configure a custom response page when a request is blocked by WAF.

## Configure custom response status code and message use portal

You can configure a custom response status code and body under "Policy settings" from the WAF portal.

:::image type="content" source="../media/waf-front-door-configure-custom-response-code/custom-response-settings.png" alt-text="WAF Policy settings":::

In the above example, we kept the response code as 403, and configured a short "Please contact us" message as shown in the below image:

:::image type="content" source="../media/waf-front-door-configure-custom-response-code/custom-response.png" alt-text="Custom response example":::

"{{azure-ref}}" inserts the unique reference string in the response body. The value matches the TrackingReference field in the `FrontdoorAccessLog` and
`FrontdoorWebApplicationFirewallLog` logs.

## Configure custom response status code and message use PowerShell

### Set up your PowerShell environment

Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) model for managing your Azure resources. 

You can install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) on your local machine and use it in any PowerShell session. Follow the instructions on the page, to sign in with your Azure credentials, and install the Az PowerShell module.

### Connect to Azure with an interactive dialog for sign-in

```
Connect-AzAccount
Install-Module -Name Az

```
Make sure you have the current version of PowerShellGet installed. Run below command and reopen PowerShell.
```
Install-Module PowerShellGet -Force -AllowClobber
``` 
### Install Az.FrontDoor module 

```
Install-Module -Name Az.FrontDoor
```

### Create a resource group

In Azure, you allocate related resources to a resource group. Here we create a resource group by using [New-AzResourceGroup](/powershell/module/Az.resources/new-Azresourcegroup).

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroupWAF
```

### Create a new WAF policy with custom response 

Below is an example of creating a new WAF policy with custom response status code set to 405, and message to **You are blocked.**, using
[New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy)

```azurepowershell
# WAF policy setting
New-AzFrontDoorWafPolicy `
-Name myWAFPolicy `
-ResourceGroupName myResourceGroupWAF `
-EnabledState enabled `
-Mode Detection `
-CustomBlockResponseStatusCode 405 `
-CustomBlockResponseBody "<html><head><title>You are blocked.</title></head><body></body></html>"
```

Modify custom response code or response body settings of an existing WAF policy, using [Update-AzFrontDoorFireWallPolicy](/powershell/module/az.frontdoor/Update-AzFrontDoorWafPolicy).

```azurepowershell
# modify WAF response code
Update-AzFrontDoorFireWallPolicy `
-Name myWAFPolicy `
-ResourceGroupName myResourceGroupWAF `
-EnabledState enabled `
-Mode Detection `
-CustomBlockResponseStatusCode 403
```

```azurepowershell
# modify WAF response body
Update-AzFrontDoorFireWallPolicy `
-Name myWAFPolicy `
-ResourceGroupName myResourceGroupWAF `
-CustomBlockResponseBody "<html><head><title>Forbidden</title></head><body>{{azure-ref}}</body></html>"
```

## Next steps
- Learn more about [Web Application Firewall with Azure Front Door](../afds/afds-overview.md)