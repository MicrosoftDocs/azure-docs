---
title: Configure a geo-filtering WAF policy for Azure Front Door
description: In this tutorial, you learn how to create a geo-filtering policy and associate the policy with your existing Azure Front Door front-end host.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 03/10/2020
ms.author: victorh 
ms.custom: devx-track-azurepowershell

---

# Set up a geo-filtering WAF policy for Azure Front Door

This tutorial shows how to use Azure PowerShell to create a sample geo-filtering policy and associate the policy with your existing Azure Front Door front-end host. This sample geo-filtering policy blocks requests from all other countries or regions except the United States.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

## Prerequisites

Before you begin to set up a geo-filter policy, set up your PowerShell environment and create an Azure Front Door profile.

### Set up your PowerShell environment
Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) model for managing your Azure resources.

You can install [Azure PowerShell](/powershell/azure/) on your local machine and use it in any PowerShell session. Follow the instructions on the page to sign in with your Azure credentials. Then install the Az PowerShell module.

#### Connect to Azure with an interactive dialog for sign-in

```
Install-Module -Name Az
Connect-AzAccount
```

Make sure you have the current version of PowerShellGet installed. Run the following command and reopen PowerShell.

```
Install-Module PowerShellGet -Force -AllowClobber
``` 

#### Install the Az.FrontDoor module

```
Install-Module -Name Az.FrontDoor
```

### Create an Azure Front Door profile

Create an Azure Front Door profile by following the instructions described in [Quickstart: Create an Azure Front Door profile](../../frontdoor/quickstart-create-front-door.md).

## Define a geo-filtering match condition

Create a sample match condition that selects requests not coming from "US" by using [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject) on parameters when you create a match condition.

Two-letter country or region codes to country or region mapping are provided in [What is geo-filtering on a domain for Azure Front Door?](waf-front-door-geo-filtering.md).

```azurepowershell-interactive
$nonUSGeoMatchCondition = New-AzFrontDoorWafMatchConditionObject `
-MatchVariable SocketAddr `
-OperatorProperty GeoMatch `
-NegateCondition $true `
-MatchValue "US"
```

## Add a geo-filtering match condition to a rule with an action and a priority

Create a `CustomRule` object `nonUSBlockRule` based on the match condition, an action, and a priority by using [New-AzFrontDoorWafCustomRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafcustomruleobject). A custom rule can have multiple match conditions. In this example, `Action` is set to `Block`. `Priority` is set to `1`, which is the highest priority.

```
$nonUSBlockRule = New-AzFrontDoorWafCustomRuleObject `
-Name "geoFilterRule" `
-RuleType MatchRule `
-MatchCondition $nonUSGeoMatchCondition `
-Action Block `
-Priority 1
```

## Add rules to a policy

Find the name of the resource group that contains the Azure Front Door profile by using `Get-AzResourceGroup`. Next, create a `geoPolicy` object that contains `nonUSBlockRule` by using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy) in the specified resource group that contains the Azure Front Door profile. You must provide a unique name for the geo policy.

The following example uses the resource group name `myResourceGroupFD1` with the assumption that you've created the Azure Front Door profile by using instructions provided in [Quickstart: Create an Azure Front Door](../../frontdoor/quickstart-create-front-door.md). In the following example, replace the policy name `geoPolicyAllowUSOnly` with a unique policy name.

```
$geoPolicy = New-AzFrontDoorWafPolicy `
-Name "geoPolicyAllowUSOnly" `
-resourceGroupName myResourceGroupFD1 `
-Customrule $nonUSBlockRule  `
-Mode Prevention `
-EnabledState Enabled
```

## Link a WAF policy to an Azure Front Door front-end host

Link the WAF policy object to the existing Azure Front Door front-end host. Update Azure Front Door properties.

To do so, first retrieve your Azure Front Door object by using [Get-AzFrontDoor](/powershell/module/az.frontdoor/get-azfrontdoor).

```
$geoFrontDoorObjectExample = Get-AzFrontDoor -ResourceGroupName myResourceGroupFD1
$geoFrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $geoPolicy.Id
```

Next, set the front-end `WebApplicationFirewallPolicyLink` property to the resource ID of the geo policy by using [Set-AzFrontDoor](/powershell/module/az.frontdoor/set-azfrontdoor).

```
Set-AzFrontDoor -InputObject $geoFrontDoorObjectExample[0]
```

> [!NOTE]
> You only need to set the `WebApplicationFirewallPolicyLink` property once to link a WAF policy to an Azure Front Door front-end host. Subsequent policy updates are automatically applied to the front-end host.

## Next steps

- Learn about [Azure Web Application Firewall](../overview.md).
- Learn how to [create an instance of Azure Front Door](../../frontdoor/quickstart-create-front-door.md).
