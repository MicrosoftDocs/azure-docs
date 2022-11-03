---
title: Upgrade from Azure Front Door Standard to Premium tier (Preview)
description: This article provides step-by-step instructions on how to upgrade from an Azure Front Door Standard to an Azure Front Door Premium tier profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 11/2/2022
ms.author: duau
---

# Upgrade from Azure Front Door Standard to Premium tier (Preview)

Azure Front Door supports upgrading from Standard to Premium tier for more advanced capabilities and an increase in quota limits. The upgrade won't cause any downtime to your services and applications. For more information about the differences between Standard and Premium tier, see [Tier comparison](standard-premium/tier-comparison.md).

This article shows you how to perform the tier upgrade through the configuration page of a Front Door Standard profile. Once upgraded, you'll be charge for the Azure Front Door Premium monthly base fee at an hourly rate.

> [!IMPORTANT]
> Downgrading from Premium to Standard tier is not supported.

## Prerequisite

Confirm you have an Azure Front Door Standard profile available in your subscription to upgrade.

## Upgrade tier

1. Go to the Azure Front Door Standard profile you want to upgrade and select **Configuration (preview)** from under *Settings*

    :::image type="content" source="./media/tier-upgrade/overview.png" alt-text="Screenshot of the configuration button under settings for a Front Door standard profile.":::

1. Select **Upgrade** to begin the upgrade process. If you don't have any WAF policies associated to your Front Door Standard profile, then you'll be prompted with a confirmation to proceed with the upgrade.

    :::image type="content" source="./media/tier-upgrade/upgrade-button.png" alt-text="Screenshot of the upgrade button on the configuration page a Front Door Standard profile.":::

1. If you have WAF policies associated to the Front Door Standard profile, then you'll be taken to the *Upgrade WAF policies* page. On this page, you'll decide whether you want to make copies of the WAF policies or use an existing premium WAF policy. You can also change the name of the new WAF policy copy during this step.

    :::image type="content" source="./media/tier-upgrade/upgrade-waf.png" alt-text="Screenshot of the upgrade WAF policies page.":::

    > [!NOTE]
    > To use managed WAF rules for the new premium WAF policy copies, you'll need to manually enable them after the upgrade.

1. Select **Upgrade** once you done setting up the WAF policies. Select **Yes** to confirm you would like to proceed with the upgrade.

    :::image type="content" source="./media/tier-upgrade/confirm-upgrade.png" alt-text="Screenshot of the confirmation message from upgrade WAF policies page.":::

1. The upgrade process will create new premium WAF policies if you chose to create copies and associate them to the upgraded Front Door profile. The upgrade can take a few minutes to complete depending on the complexity of your Front Door profile.

    :::image type="content" source="./media/tier-upgrade/upgrade-in-progress.png" alt-text="Screenshot of the configuration page with upgrade in progress status.":::

1. Once the upgrade completes, you'll see **Tier: Premium** display on the *Configuration* page.

    :::image type="content" source="./media/tier-upgrade/upgrade-complete.png" alt-text="Screenshot of the Front Door tier upgraded to premium on the configuration page.":::

    > [!NOTE]
    > You're now being billed for the Azure Front Door Premium base fee at an hourly rate.

## Next steps

* Learn more about [Managed rule for WAF policy](../web-application-firewall/afds/waf-front-door-drs.md).
* Learn how to enable [Private Link to origin resources](private-link.md).
