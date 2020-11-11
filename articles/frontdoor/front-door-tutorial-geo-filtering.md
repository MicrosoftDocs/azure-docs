---
title: Tutorial - Configure geo-filtering WAF policy - Azure Front Door
description: In this tutorial, you learn how to create a geo-filtering WAF policy and associate the policy with your existing Front Door frontend host.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/14/2020
ms.author: duau

---
# Tutorial: How to set up a geo-filtering WAF policy for your Front Door
This tutorial shows how to use Azure PowerShell to create a sample geo-filtering policy and associate the policy with your existing Front Door frontend host. This sample geo-filtering policy will block requests from all other countries/regions except United States.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Define geo-filtering match condition.
> - Add geo-filtering match condition to a rule.
> - Add rules to a policy.
> - Link WAF policy to FrontDoor frontend host.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites
* Before you begin to set up a geo-filter policy, set up your PowerShell environment and create a Front Door profile.
* Create a Front Door by following the instructions described in [Quickstart: Create a Front Door profile](quickstart-create-front-door.md).

## Define geo-filtering match condition

Create a sample match condition that selects requests not coming from "US" using [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject) on parameters when creating a match condition. 
Two letter country/region codes to country/region mapping are provided [here](front-door-geo-filtering.md).

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
Find the name of the resource group that contains the Front Door profile using `Get-AzResourceGroup`. Next, create a `geoPolicy` policy object containing `nonUSBlockRule`  using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy) in the specified resource group that contains the Front Door profile. You must provide a unique name for the geo-filtering policy. 

The below example uses the Resource Group name *FrontDoorQS_rg0* with the assumption that you have created the Front Door profile using instructions provided in the [Quickstart: Create a Front Door](quickstart-create-front-door.md) article. In the below example, replace the policy name *geoPolicyAllowUSOnly* with a unique policy name.

```
$geoPolicy = New-AzFrontDoorWafPolicy `
-Name "geoPolicyAllowUSOnly" `
-resourceGroupName FrontDoorQS_rg0 `
-Customrule $nonUSBlockRule  `
-Mode Prevention `
-EnabledState Enabled
```
## Link WAF policy to a Front Door frontend host
Link the WAF policy object to the existing Front Door frontend host and update Front Door properties. 

To do so, first retrieve your Front Door object using [Get-AzFrontDoor](/powershell/module/az.frontdoor/get-azfrontdoor). 

```
$geoFrontDoorObjectExample = Get-AzFrontDoor -ResourceGroupName FrontDoorQS_rg0
$geoFrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $geoPolicy.Id
```
Next, set the frontend WebApplicationFirewallPolicyLink property to the resourceId of the `geoPolicy`using [Set-AzFrontDoor](/powershell/module/az.frontdoor/set-azfrontdoor).

```
Set-AzFrontDoor -InputObject $geoFrontDoorObjectExample[0]
```

> [!NOTE] 
> You only need to set WebApplicationFirewallPolicyLink property once to link a WAF policy to a Front Door frontend host. Subsequent policy updates are automatically applied to the frontend host.

## Clean up resources

In the preceding steps, you configured a geo-filtering rule that is associated to a WAF policy. You then linked the policy to a frontend host of your Front Door. If you no longer need the geo-filtering rule or WAF policy, you must first disassociate the policy from the frontend host before the WAF policy can be deleted.

:::image type="content" source="media/front-door-geo-filtering/front-door-disassociate-policy.png" alt-text="Disassociate WAF policy":::

## Next steps

To learn how to configure a Web Application Firewall for your Front Door, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Web Application Firewall and Front Door](front-door-waf.md)
