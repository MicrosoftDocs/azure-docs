---
title: Configure a custom response for web application firewall at Azure Front Door
description: Learn how to configure a custom response code and message when web application firewall (WAF) blocks a request.
services: frontdoor
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/21/2019
ms.author: kumud
ms.reviewer: tyao
---

# Configure a custom response for Azure web application firewall

By default, when Azure web application firewall (WAF) with Azure Front Door blocks a request because of a matched rule, it returns a 403 status code with **The request is blocked** message. This article describes how to configure a custom response status code and response message when a request is blocked by WAF.

## Set up your PowerShell environment
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

## Create a resource group

In Azure, you allocate related resources to a resource group. In this example, you create a resource group by using [New-AzResourceGroup](/powershell/module/Az.resources/new-Azresourcegroup).

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroupWAF
```

## Create a new WAF policy with custom response 

Below is an example of creating a new WAF policy with custom response status code set to 405 and message to **You are blocked.** using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy).

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
-CustomBlockResponseBody "<html><head><title> Forbidden</title></head><body></body></html>"
```

## Next steps
- Learn more about [Front Door](front-door-overview.md)