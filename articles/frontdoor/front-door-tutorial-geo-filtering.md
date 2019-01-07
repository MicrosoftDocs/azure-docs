---
title: Tutorial - Configure geo-filtering on a domain for Azure Front Door Service | Microsoft Docs
description: In this tutorial, you learn how to create a simple geo-filtering policy and associate the policy with your existing Front Door frontend host
services: frontdoor
documentationcenter: ''
author: sharad4u
editor: ''
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/20/2018
ms.author: sharadag

---
# How to set up a geo-filtering policy for your Front Door
This tutorial shows how to use Azure PowerShell to create a sample geo-filtering policy and associate the policy with your existing Front Door frontend host. This sample geo-filtering policy will block requests from all other countries except United States.

## 1. Set up your PowerShell environment
Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) model for managing your Azure resources. 

You can install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) on your local machine and use it in any PowerShell session. Follow the instructions on the page, to sign in with your Azure credentials, and install AzureRM.
```
# Connect to Azure with an interactive dialog for sign-in
Connect-AzureRmAccount
Install-Module -Name AzureRM
```
> [!NOTE]
>  [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) support is coming soon.

Before install Front Door module, make sure you have the current version of PowerShellGet installed. Run below command and reopen PowerShell.

```
Install-Module PowerShellGet -Force -AllowClobber
``` 

Install AzureRM.FrontDoor module. 

```
Install-Module -Name AzureRM.FrontDoor -AllowPrerelease
```

## 2. Define geo-filtering match condition(s)
First create a sample match condition that selects requests not coming from "US". Refer to PowerShell [guide](https://docs.microsoft.com/azure/frontdoor/new-azurermfrontdoormatchconditionobject) on parameters when creating a match condition. 
Two letter country code to country mapping is provided [here](/Protection/GeoFiltering).

```
$nonUSGeoMatchCondition = New-AzureRmFrontDoorMatchConditionObject -MatchVariable RemoteAddr -OperatorProperty GeoMatch -NegateCondition $true -MatchValue "US"
```
 
## 3. Add geo-filtering match condition to a rule with Action and Priority

Then create a CustomRule object `nonUSBlockRule` based on the match condition, an Action, and a Priority.  A CustomRule can have multiple MatchCondition.  In this example, Action is set to Block and Priority to 1, the highest priority.

```
$nonUSBlockRule = New-AzureRmFrontDoorCustomRuleObject -Name "geoFilterRule" -RuleType MatchRule -MatchCondition $nonUSGeoMatchCondition -Action Block -Priority 1
```

Refer to PowerShell [guide](https://docs.microsoft.com/azure/frontdoor/new-azurermfrontdoorcustomruleobject) on parameters when creating a CustomRuleObject.

## 4. Add Rules to a Policy
This step creates a `geoPolicy` policy object containing `nonUSBlockRule` from previous step in the specified resource group. Use `Get-AzureRmResourceGroup` to find your ResourceGroupName $resourceGroup.

```
$geoPolicy = New-AzureRmFrontDoorFireWallPolicy -Name "geoPolicyAllowUSOnly" -resourceGroupName $resourceGroup -Customrule $nonUSBlockRule  -Mode Prevention -EnabledState Enabled
```

Refer to PowerShell [guide](https://docs.microsoft.com/azure/frontdoor/new-azurermfrontdoorfirewallpolicy) on parameters when creating a policy.

## 5. Link Policy to a Front Door frontend host
Last steps are to link the protection policy object to an existing Front Door frontend host and update Front Door properties. 
 You first retrieve your Front Door object by using [Get-AzureRmFrontDoor](https://docs.microsoft.com/azure/frontdoor/get-azurermfrontdoor), followed by setting its frontend WebApplicationFirewallPolicyLink property to resourceId of  the `geoPolicy`.

```
$geoFrontDoorObjectExample = Get-AzureRmFrontDoor -ResourceGroupName $resourceGroup
$geoFrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $geoPolicy.Id
```

Use the following [command](https://docs.microsoft.com/azure/frontdoor/set-azurermfrontdoor) to update your  Front Door object.

```
Set-AzureRmFrontDoor -InputObject $geoFrontDoorObjectExample[0]
```

> [!NOTE] 
> You only need to set WebApplicationFirewallPolicyLink property once to link a protection policy to a Front Door frontend host. Subsequent policy updates will automatically apply to the frontend host.

## Next steps

- Learn about [application layer security with Front Door](front-door-application-security.md).
- Learn how to [create a Front Door](quickstart-create-front-door.md).
