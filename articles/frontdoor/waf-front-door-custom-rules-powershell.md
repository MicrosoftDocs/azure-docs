---
title: Configure a web application firewall (WAF) policy with custom rules and Default Ruse Set for Front Door - Azure PowerShell
description: Learn how to configure a WAF policy consist of both custom and managed rules for an existing Front Door endpoint.
services: frontdoor
documentationcenter: ''
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

# Configure a web application firewall policy using Azure PowerShell
Azure web application firewall (WAF) policy defines inspections required when a request arrives at Front Door.
This article shows how to configure a WAF policy that consists of some custom rules and with Azure-managed Default Ruse Set enabled.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
Before you begin to set up a rate limit policy, set up your PowerShell environment and create a Front Door profile.
### Set up your PowerShell environment
Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) model for managing your Azure resources. 

You can install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) on your local machine and use it in any PowerShell session. Follow the instructions on the page, to sign in with your Azure credentials, and install Az PowerShell module.

#### Sign in to Azure
```
Connect-AzAccount

```
Before install Front Door module, make sure you have the current version of PowerShellGet installed. Run below command and reopen PowerShell.

```
Install-Module PowerShellGet -Force -AllowClobber
``` 

#### Install Az.FrontDoor module 

```
Install-Module -Name Az.FrontDoor
```
### Create a Front Door profile
Create a Front Door profile by following the instructions described in [Quickstart: Create a Front Door profile](quickstart-create-front-door.md)

## Custom rule based on http parameters

The following example shows how to configure a custom rule with two match conditions using [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject). Requests are from a specified site as defined by referrer, and query string does not contain "password". 

```powershell-interactive
$referer = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestHeader -OperatorProperty Equal -Selector "Referer" -MatchValue "www.mytrustedsites.com/referpage.html"
$password = New-AzFrontDoorWafMatchConditionObject -MatchVariable QueryString -OperatorProperty Contains -MatchValue "password"
$AllowFromTrustedSites = New-AzFrontDoorWafCustomRuleObject -Name "AllowFromTrustedSites" -RuleType MatchRule -MatchCondition $referer,$password -Action Allow -Priority 1
```

## Custom rule based on http request method
Create a rule blocking "PUT" method using [New-AzFrontDoorWafCustomRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafcustomruleobject) as follows:

```powershell-interactive
$put = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestMethod -OperatorProperty Equal -MatchValue PUT
$BlockPUT = New-AzFrontDoorWafCustomRuleObject -Name "BlockPUT" -RuleType MatchRule -MatchCondition $put -Action Block -Priority 2
```

## Create a custom rule based on size constraint

The following example creates a rule blocking requests with Url that is longer than 100 characters using Azure PowerShell:
```powershell-interactive
$url = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestUri -OperatorProperty GreaterThanOrEqual -MatchValue 100
$URLOver100 = New-AzFrontDoorWafCustomRuleObject -Name "URLOver100" -RuleType MatchRule -MatchCondition $url -Action Block -Priority 3
```
## Add managed Default Rule Set

The following example creates a managed Default Rule Set using Azure PowerShell:
```powershell-interactive
$managedRules =  New-AzFrontDoorWafManagedRuleObject -Type DefaultRuleSet -Version 1.0
```
## Configure a security policy

Find the name of the resource group that contains the Front Door profile using `Get-AzResourceGroup`. Next, configure a security policy with created rules in the previous steps using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy) in the specified resource group that contains the Front Door profile.

```powershell-interactive
$myWAFPolicy=New-AzFrontDoorWafPolicy -Name $policyName -ResourceGroupName $resourceGroupName -Customrule $AllowFromTrustedSites,$BlockPUT,$URLOver100 -ManagedRule $managedRules -EnabledState Enabled -Mode Prevention
```

## Link policy to a Front Door front-end host
Link the security policy object to an existing Front Door front-end host and update Front Door properties. First, retrieve the Front Door object using [Get-AzFrontDoor](/powershell/module/Az.FrontDoor/Get-AzFrontDoor).
Next, set the front-end *WebApplicationFirewallPolicyLink* property to the *resourceId* of the "$myWAFPolicy$" created in the previous step using [Set-AzFrontDoor](/powershell/module/Az.FrontDoor/Set-AzFrontDoor). 

The below example uses the Resource Group name *myResourceGroupFD1* with the assumption that you have created the Front Door profile using instructions provided in the [Quickstart: Create a Front Door](quickstart-create-front-door.md) article. Also, in the below example, replace $frontDoorName with the name of your Front Door profile. 

```powershell-interactive
   $FrontDoorObjectExample = Get-AzFrontDoor `
     -ResourceGroupName myResourceGroupFD1 `
     -Name $frontDoorName
   $FrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $myWAFPolicy.Id
   Set-AzFrontDoor -InputObject $FrontDoorObjectExample[0]
 ```

> [!NOTE]
> You only need to set *WebApplicationFirewallPolicyLink* property once to link a security policy to a Front Door front-end. Subsequent policy updates are automatically applied to the front-end.

## Next steps

- Learn more about [Front Door](front-door-overview.md) 
- Learn more about [WAF for Front Door](waf-overview.md)
