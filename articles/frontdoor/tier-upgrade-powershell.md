---
title: Upgrade from Azure Front Door Standard to Premium with Azure PowerShell
description: This article shows you how to upgrade from an Azure Front Door Standard to an Azure Front Door Premium profile with Azure PowerShell.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.custom: devx-track-azurepowershell
ms.topic: conceptual
ms.date: 06/05/2023
ms.author: duau
---

# Upgrade from Azure Front Door Standard to Premium with Azure PowerShell

Azure Front Door supports upgrading from Standard to Premium for more advanced capabilities and an increase in quota limit. The upgrade doesn't cause any downtime to your services or applications. For more information about the differences between Standard and Premium, see [Tier comparison](standard-premium/tier-comparison.md).

This article walks you through how to perform the tier upgrade for an Azure Front Door Standard profile. Once upgraded, you're charged for the Azure Front Door Premium monthly base fee at an hourly rate.

> [!IMPORTANT]
> Downgrading from **Premium** to **Standard** isn't supported.

## Prerequisite

* Confirm you have an Azure Front Door Standard profile available in your subscription to upgrade.
* Latest Azure PowerShell module installed locally or Azure Cloud Shell. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

## Upgrade tier

Run the [Update-AzFrontDoorCdnProfile](/powershell/module/az.cdn/update-azfrontdoorcdnprofile) command to upgrade your Azure Front Door Standard profile to Premium. The following example shows the command to upgrade a profile named **myAzureFrontDoor** in the resource group **myAFDResourceGroup**.

### No WAF policies associated

```powershell-interactive
Update-AzFrontDoorCdnProfile -ProfileName myAzureFrontDoor -ResourceGroupName myAFDResourceGroup -ProfileUpgradeParameter @{}
```

The following example shows the output of the command:

```
Location Name              Kind      ResourceGroupName
-------- ----              ----      -----------------
Global   myAzureFrontDoor  frontdoor myAFDResourceGroup
```

### WAF policies associated

1. Run the [New-AzFrontDoorCdnProfileChangeSkuWafMappingObject](/powershell/module/az.cdn/new-azfrontdoorcdnprofilechangeskuwafmappingobject) command to create a new object for the WAF policy mapping. This command maps the standard WAF policy to the premium WAF policy resource ID. The premium WAF policy can be an existing one or a new one. If you're using an existing one, replace the WafPolicyId value with the resource ID of the premium WAF policy. If you're creating a new one, replace the `premiumWAFPolicyName` value with the name of the premium WAF policy. In this example, we're creating two premium WAF policies named **myPremiumWAFPolicy1** and **myPremiumWAFPolicy2**.

    ```powershell-interactive

    Replace the following values in the command:

    * `<subscriptionId>`: Your subscription ID.
    * `<resourceGroupName>`: The resource group name of the WAF policy.
    * `<standardWAFPolicyName>`: The name of the standard WAF policy.

    ```powershell-interactive
    $waf1 = New-AzFrontDoorCdnProfileChangeSkuWafMappingObject SecurityPolicyName <standardWAFPolicyName> -WafPolicyId /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/frontDoorWebApplicationFirewallPolicies/myPremiumWAFPolicy1

    $waf2 = New-AzFrontDoorCdnProfileChangeSkuWafMappingObject SecurityPolicyName <standardWAFPolicyName> -WafPolicyId /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/frontDoorWebApplicationFirewallPolicies/myPremiumWAFPolicy2
    ```

1. Run the [New-AzFrontDoorCdnProfileUpgradeParametersObject](/powershell/module/az.cdn/new-azfrontdoorcdnprofileupgradeparametersobject) command to create a new object for the upgrade parameters.

    ```powershell-interactive
    $upgradeParams = New-AzFrontDoorCdnProfileUpgradeParametersObject -WafPolicyMapping @{$waf1, $waf2}
    ```

1. Run the [Update-AzFrontDoorCdnProfile](/powershell/module/az.cdn/update-azfrontdoorcdnprofile) command to upgrade your Azure Front Door Standard profile to Premium. The following example shows the command to upgrade a profile named **myAzureFrontDoor** in the resource group **myAFDResourceGroup**.

    ```powershell-interactive
    Update-AzFrontDoorCdnProfile -ProfileName myAzureFrontDoor -ResourceGroupName myAFDResourceGroup -ProfileUpgradeParameter $upgradeParams
    ```

    The following example shows the output of the command:

    ```
    Location Name              Kind      ResourceGroupName
    -------- ----              ----      -----------------
    Global   myAzureFrontDoor  frontdoor myAFDResourceGroup
    ```

> [!NOTE]
> You're now being billed for the Azure Front Door Premium at an hourly rate.

## Next steps

* Learn more about [Managed rule for Azure Front Door WAF policy](../web-application-firewall/afds/waf-front-door-drs.md).
* Learn how to enable [Private Link to origin resources in Azure Front Door](private-link.md).
