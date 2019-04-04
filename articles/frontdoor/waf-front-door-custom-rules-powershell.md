---
title: Configure a WAF policy with custom rules and Default Ruse Set for Front Door - Azure PowerShell
description: Learn how to configure a WAF policy consist of both custom and managed rules for an existing Front Door endpoint.
services: frontdoor
documentationcenter: ''
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/03/2019
ms.author: kumud;tyao
---

# Configure a web application firewall policy using Azure PowerShell
Azure web application firewall (WAF) policy defines inspections requried when a request arrives at Front Door.
This article shows how to configure a WAF policy consists of some custom rules and with Azure managed Default Ruse Set enabled.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
Before you begin to set up a rate limit policy, set up your PowerShell environment and create a Front Door profile.
### Set up your PowerShell environment
Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) model for managing your Azure resources. 

You can install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) on your local machine and use it in any PowerShell session. Follow the instructions on the page, to sign in with your Azure credentials, and install Az PowerShell module.

#### Connect to Azure with an interactive dialog for sign-in
```
Connect-AzAccount

```
Before install Front Door module, make sure you have the current version of PowerShellGet installed. Run below command and reopen PowerShell.

```
Install-Module PowerShellGet -Force -AllowClobber
``` 

#### Install Az.FrontDoor module 

```
Install-Module -Name Az.FrontDoor -AllowPrerelease
```
### Create a Front Door profile
Create a Front Door profile by following the instructions described in [Qucikstart: Create a Front Door profile](quickstart-create-front-door.md)

## Define url match conditions
Define a URL match condition (URL contains /promo) using [New-AzFrontDoorMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoormatchconditionobject).
The following example matches */promo* as the value of the *RequestUri* variable:

```powershell-interactive
   $promoMatchCondition = New-AzFrontDoorMatchConditionObject `
     -MatchVariable RequestUri `
     -OperatorProperty Contains `
     -MatchValue "/promo"
```
## Create a custom rate limit rule
Set a rate limit using [New-AzFrontDoorCustomRuleObject](/powershell/module/Az.FrontDoor/New-AzFrontDoorCustomRuleObject). 
In the following example, the limit is set to 1000. Requests from any client to the promo page exceeding 1000 during one minute are blocked until the next minute starts.

```powershell-interactive
   $promoRateLimitRule = New-AzFrontDoorCustomRuleObject `
     -Name "rateLimitRule" `
     -RuleType RateLimitRule `
     -MatchCondition $promoMatchCondition `
     -RateLimitThreshold 1000 `
     -Action Block -Priority 1
```


## Configure a security policy

Find the name of the resource group that contains the Front Door profile using `Get-AzureRmResourceGroup`. Next, configure a security policy with a custom rate limit rule using [New-AzFrontDoorFireWallPolicy](/powershell/module/az.frontdoor/new-azfrontdoorfirewallPolicy) in the specified resource group that contains the Front Door profile.

The below example uses the Resource Group name *myResourceGroupFD1* with the assumption that you have created the Front Door profile using instructions provided in the [Quickstart: Create a Front Door](quickstart-create-front-door.md) article.

 using [New-AzFrontDoorFireWallPolicy](/powershell/module/Az.FrontDoor/New-AzFrontDoorFireWallPolicy).

```powershell-interactive
   $ratePolicy = New-AzFrontDoorFireWallPolicy `
     -Name "RateLimitPolicyExamplePS" `
     -resourceGroupName myResourceGroupFD1 `
     -Customrule $promoRateLimitRule `
     -Mode Prevention `
     -EnabledState Enabled
```
## Link policy to a Front Door front-end host
Link the security policy object to an existing Front Door front-end host and update Front Door properties. First retrieve the Front Door object using [Get-AzFrontDoor](/powershell/module/Az.FrontDoor/Get-AzFrontDoor) command.
Next, set the front-end *WebApplicationFirewallPolicyLink* property to the *resourceId* of the "$ratePolicy" created in the previous step using [Set-AzFrontDoor](/powershell/module/Az.FrontDoor/Set-AzFrontDoor) command. 

The below example uses the Resource Group name *myResourceGroupFD1* with the assumption that you have created the Front Door profile using instructions provided in the [Quickstart: Create a Front Door](quickstart-create-front-door.md) article. Also, in the below example, replace $frontDoorName with the name of your Front Door profile. 

```powershell-interactive
   $FrontDoorObjectExample = Get-AzFrontDoor `
     -ResourceGroupName myResourceGroupFD1 `
     -Name $frontDoorName
   $FrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $ratePolicy.Id
   Set-AzFrontDoor -InputObject $FrontDoorObjectExample[0]
 ```

> [!NOTE]
> You only need to set *WebApplicationFirewallPolicyLink* property once to link a security policy to a Front Door front-end. Subsequent policy updates are automatically applied to the front-end.

## Next steps

- Learn more about [Front Door](front-door-overview.md) 
- Learn more about [WAF for Front Door](waf-overview.md)
