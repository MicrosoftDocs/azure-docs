---
title: Configure WAF custom rules and the Default Rule Set for Azure Front Door
description: Learn how to configure a web application firewall (WAF) policy that consists of custom and managed rules for an existing Azure Front Door endpoint.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: article
ms.date: 09/05/2019
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Configure a WAF policy by using Azure PowerShell

A web application firewall (WAF) policy defines the inspections that are required when a request arrives at Azure Front Door.

This article shows how to configure a WAF policy that consists of some custom rules and has the Azure-managed Default Rule Set enabled.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

Before you begin to set up a rate limit policy, set up your PowerShell environment and create an Azure Front Door profile.

### Set up your PowerShell environment

Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) model for managing your Azure resources.

You can install [Azure PowerShell](/powershell/azure/) on your local machine and use it in any PowerShell session. Follow the instructions on the page to sign in with your Azure credentials. Then install the Az PowerShell module.

#### Sign in to Azure

```
Connect-AzAccount

```
Before you install the Azure Front Door module, make sure you have the current version of PowerShellGet installed. Run the following command and reopen PowerShell.

```
Install-Module PowerShellGet -Force -AllowClobber
``` 

#### Install the Az.FrontDoor module

```
Install-Module -Name Az.FrontDoor
```

### Create an Azure Front Door profile

Create an Azure Front Door profile by following the instructions described in [Quickstart: Create an Azure Front Door profile](../../frontdoor/quickstart-create-front-door.md).

## Custom rule based on HTTP parameters

The following example shows how to configure a custom rule with two match conditions by using [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject). Requests are from a specified site as defined by referrer, and the query string doesn't contain `password`.

```powershell-interactive
$referer = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestHeader -OperatorProperty Equal -Selector "Referer" -MatchValue "www.mytrustedsites.com/referpage.html"
$password = New-AzFrontDoorWafMatchConditionObject -MatchVariable QueryString -OperatorProperty Contains -MatchValue "password"
$AllowFromTrustedSites = New-AzFrontDoorWafCustomRuleObject -Name "AllowFromTrustedSites" -RuleType MatchRule -MatchCondition $referer,$password -Action Allow -Priority 1
```

## Custom rule based on an HTTP request method

Create a rule blocking a PUT method by using [New-AzFrontDoorWafCustomRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafcustomruleobject).

```powershell-interactive
$put = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestMethod -OperatorProperty Equal -MatchValue PUT
$BlockPUT = New-AzFrontDoorWafCustomRuleObject -Name "BlockPUT" -RuleType MatchRule -MatchCondition $put -Action Block -Priority 2
```

## Create a custom rule based on size constraint

The following example creates a rule blocking requests with a URL that's longer than 100 characters by using Azure PowerShell.

```powershell-interactive
$url = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestUri -OperatorProperty GreaterThanOrEqual -MatchValue 100
$URLOver100 = New-AzFrontDoorWafCustomRuleObject -Name "URLOver100" -RuleType MatchRule -MatchCondition $url -Action Block -Priority 3
```

## Add a managed Default Rule Set

The following example creates a managed Default Rule Set by using Azure PowerShell.

```powershell-interactive
$managedRules =  New-AzFrontDoorWafManagedRuleObject -Type DefaultRuleSet -Version 1.0
```

## Configure a security policy

Find the name of the resource group that contains the Azure Front Door profile by using `Get-AzResourceGroup`. Next, configure a security policy with created rules in the previous steps by using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy) in the specified resource group that contains the Azure Front Door profile.

```powershell-interactive
$myWAFPolicy=New-AzFrontDoorWafPolicy -Name $policyName -ResourceGroupName $resourceGroupName -Customrule $AllowFromTrustedSites,$BlockPUT,$URLOver100 -ManagedRule $managedRules -EnabledState Enabled -Mode Prevention
```

## Link policy to an Azure Front Door front-end host

Link the security policy object to an existing Azure Front Door front-end host and update Azure Front Door properties. First, retrieve the Azure Front Door object by using [Get-AzFrontDoor](/powershell/module/Az.FrontDoor/Get-AzFrontDoor).
Next, set the front-end `WebApplicationFirewallPolicyLink` property to the `resourceId` of the `$myWAFPolicy$` created in the previous step by using [Set-AzFrontDoor](/powershell/module/Az.FrontDoor/Set-AzFrontDoor).

The following example uses the resource group name `myResourceGroupFD1` with the assumption that you've created the Azure Front Door profile by using instructions provided in [Quickstart: Create an Azure Front Door](../../frontdoor/quickstart-create-front-door.md). Also, in the following example, replace `$frontDoorName` with the name of your Azure Front Door profile.

```powershell-interactive
   $FrontDoorObjectExample = Get-AzFrontDoor `
     -ResourceGroupName myResourceGroupFD1 `
     -Name $frontDoorName
   $FrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $myWAFPolicy.Id
   Set-AzFrontDoor -InputObject $FrontDoorObjectExample[0]
 ```

> [!NOTE]
> You only need to set the `WebApplicationFirewallPolicyLink` property once to link a security policy to an Azure Front Door front end. Subsequent policy updates are automatically applied to the front end.

## Next steps

- Learn more about [Azure Front Door](../../frontdoor/front-door-overview.md).
- Learn more about [Azure Web Application Firewall on Azure Front Door](afds-overview.md).
