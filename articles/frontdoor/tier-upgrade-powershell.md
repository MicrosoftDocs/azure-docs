---
title: Upgrade from Azure Front Door Standard to Premium with Azure PowerShell
description: This article shows you how to upgrade from an Azure Front Door Standard to an Azure Front Door Premium profile with Azure PowerShell.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 11/18/2024
ms.author: duau
---

# Upgrade from Azure Front Door Standard to Premium with Azure PowerShell

Azure Front Door allows upgrading from Standard to Premium for enhanced capabilities and increased quota limits. This upgrade doesn't cause any downtime to your services or applications. For more information on the differences between Standard and Premium, see [Tier comparison](standard-premium/tier-comparison.md).

This guide explains how to upgrade an Azure Front Door Standard profile to Premium. After the upgrade, you'll be charged the Azure Front Door Premium monthly base fee at an hourly rate.

> [!IMPORTANT]
> Downgrading from **Premium** to **Standard** is not supported.

## Prerequisites

* Ensure you have an Azure Front Door Standard profile in your subscription.
* Install the latest Azure PowerShell module locally or use Azure Cloud Shell. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

## Upgrade Tier

Run the [Update-AzFrontDoorCdnProfile](/powershell/module/az.cdn/update-azfrontdoorcdnprofile) command to upgrade your Azure Front Door Standard profile to Premium. The following example upgrades a profile named **myAzureFrontDoor** in the resource group **myAFDResourceGroup**.

### No WAF Policies Associated

```powershell-interactive
Update-AzFrontDoorCdnProfile -ProfileName myAzureFrontDoor -ResourceGroupName myAFDResourceGroup -ProfileUpgradeParameter @{}
```

Example output:

```
Location Name              Kind      ResourceGroupName
-------- ----              ----      -----------------
Global   myAzureFrontDoor  frontdoor myAFDResourceGroup
```

### WAF Policies Associated

1. Run the [New-AzFrontDoorCdnProfileChangeSkuWafMappingObject](/powershell/module/az.cdn/new-azfrontdoorcdnprofilechangeskuwafmappingobject) command to create a WAF policy mapping object. This maps the standard WAF policy to the premium WAF policy resource ID. Replace the `WafPolicyId` value with the resource ID of the premium WAF policy. If creating a new one, replace `premiumWAFPolicyName` with the name of the new premium WAF policy. This example creates two premium WAF policies named **myPremiumWAFPolicy1** and **myPremiumWAFPolicy2**.

    ```powershell-interactive
    # Replace the following values:
    # <subscriptionId>: Your subscription ID.
    # <resourceGroupName>: The resource group name of the WAF policy.
    # <standardWAFPolicyName>: The name of the standard WAF policy.

    $waf1 = New-AzFrontDoorCdnProfileChangeSkuWafMappingObject SecurityPolicyName <standardWAFPolicyName> -WafPolicyId /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/frontDoorWebApplicationFirewallPolicies/myPremiumWAFPolicy1

    $waf2 = New-AzFrontDoorCdnProfileChangeSkuWafMappingObject SecurityPolicyName <standardWAFPolicyName> -WafPolicyId /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/frontDoorWebApplicationFirewallPolicies/myPremiumWAFPolicy2
    ```

2. Run the [New-AzFrontDoorCdnProfileUpgradeParametersObject](/powershell/module/az.cdn/new-azfrontdoorcdnprofileupgradeparametersobject) command to create an upgrade parameters object.

    ```powershell-interactive
    $upgradeParams = New-AzFrontDoorCdnProfileUpgradeParametersObject -WafPolicyMapping @{$waf1, $waf2}
    ```

3. Run the [Update-AzFrontDoorCdnProfile](/powershell/module/az.cdn/update-azfrontdoorcdnprofile) command to upgrade your Azure Front Door Standard profile to Premium. The following example upgrades a profile named **myAzureFrontDoor** in the resource group **myAFDResourceGroup**.

    ```powershell-interactive
    Update-AzFrontDoorCdnProfile -ProfileName myAzureFrontDoor -ResourceGroupName myAFDResourceGroup -ProfileUpgradeParameter $upgradeParams
    ```

    Example output:

    ```
    Location Name              Kind      ResourceGroupName
    -------- ----              ----      -----------------
    Global   myAzureFrontDoor  frontdoor myAFDResourceGroup
    ```

> [!NOTE]
> You will now be billed for Azure Front Door Premium at an hourly rate.

## Next Steps

* Learn more about [Managed rule for Azure Front Door WAF policy](../web-application-firewall/afds/waf-front-door-drs.md).
* Learn how to enable [Private Link to origin resources in Azure Front Door](private-link.md).
