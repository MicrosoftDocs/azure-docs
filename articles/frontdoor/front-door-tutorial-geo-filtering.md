---
title: Tutorial - Configure geo-filtering web application firewall policy for Azure Front Door service
description: In this tutorial, you learn how to create a simple geo-filtering policy and associate the policy with your existing Front Door frontend host
services: frontdoor
documentationcenter: ''
author: KumudD
manager: twooley
editor: ''
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/21/2019
ms.author: kumud
ms.reviewer: tyao

---
# How to set up a geo-filtering WAF policy for your Front Door
This tutorial shows how to use Azure PowerShell to create a sample geo-filtering policy and associate the policy with your existing Front Door frontend host. This sample geo-filtering policy will block requests from all other countries/regions except United States.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

## Prerequisites
Before you begin to set up a geo-filter policy, set up your PowerShell environment and create a Front Door profile.
### Set up your PowerShell environment
Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) model for managing your Azure resources. 

You can install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) on your local machine and use it in any PowerShell session. Follow the instructions on the page, to sign in with your Azure credentials, and install the Az PowerShell module.

#### Connect to Azure with an interactive dialog for sign-in
```
Connect-AzAccount
Install-Module -Name Az
```
Make sure you have the current version of PowerShellGet installed. Run below command and reopen PowerShell.

```
Install-Module PowerShellGet -Force -AllowClobber
``` 
#### Install Az.FrontDoor module 

```
Install-Module -Name Az.FrontDoor
```

### Create a Front Door profile
Create a Front Door profile by following the instructions described in [Quickstart: Create a Front Door profile](quickstart-create-front-door.md).

## Define geo-filtering match condition

Create a sample match condition that selects requests not coming from "US" using [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject) on parameters when creating a match condition. 
Two letter country codes to country mapping are provided [here](front-door-geo-filtering.md).

```azurepowershell-interactive
$nonUSGeoMatchCondition = New-AzFrontDoorWafMatchConditionObject `
-MatchVariable RemoteAddr `
-OperatorProperty GeoMatch `
-NegateCondition $true `
-MatchValue "US"
```
 
## Add geo-filtering match condition to a rule with Action and Priority

Create a CustomRule object `nonUSBlockRule` based on the match condition, an Action, and a Priority using [New-AzFrontDoorWafCustomRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafcustomruleobject).  A CustomRule can have multiple MatchCondition.  In this example, Action is set to Block and Priority to 1, the highest priority.

```
$nonUSBlockRule = New-AzFrontDoorWafCustomRuleObject `
-Name "geoFilterRule" `
-RuleType MatchRule `
-MatchCondition $nonUSGeoMatchCondition `
-Action Block `
-Priority 1
```

## Add rules to a policy
Find the name of the resource group that contains the Front Door profile using `Get-AzResourceGroup`. Next, create a `geoPolicy` policy object containing `nonUSBlockRule`  using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy) in the specified resource group that contains the Front Door profile. You must provide a unique name for the geo policy. 

The below example uses the Resource Group name *myResourceGroupFD1* with the assumption that you have created the Front Door profile using instructions provided in the [Quickstart: Create a Front Door](quickstart-create-front-door.md) article. In the below example, replace the policy name *geoPolicyAllowUSOnly* with a unique policy name.

```
$geoPolicy = New-AzFrontDoorWafPolicy `
-Name "geoPolicyAllowUSOnly" `
-resourceGroupName myResourceGroupFD1 `
-Customrule $nonUSBlockRule  `
-Mode Prevention `
-EnabledState Enabled
```

## Link WAF policy to a Front Door frontend host
Link the WAF policy object to the existing Front Door frontend host and update Front Door properties. 

To do so, first retrieve your Front Door object using [Get-AzFrontDoor](/powershell/module/az.frontdoor/get-azfrontdoor). 

```
$geoFrontDoorObjectExample = Get-AzFrontDoor -ResourceGroupName myResourceGroupFD1
$geoFrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $geoPolicy.Id
```

Next, set the frontend WebApplicationFirewallPolicyLink property to the resourceId of the `geoPolicy`using [Set-AzFrontDoor](/powershell/module/az.frontdoor/set-azfrontdoor).

```
Set-AzFrontDoor -InputObject $geoFrontDoorObjectExample[0]
```

> [!NOTE] 
> You only need to set WebApplicationFirewallPolicyLink property once to link a WAF policy to a Front Door frontend host. Subsequent policy updates are automatically applied to the frontend host.

## Next steps
- Learn about [Azure web application firewall](waf-overview.md).
- Learn how to [create a Front Door](quickstart-create-front-door.md).
