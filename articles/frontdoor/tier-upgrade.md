---
title: Upgrade from Azure Front Door Standard to Premium
description: This article shows you how to upgrade from an Azure Front Door Standard to an Azure Front Door Premium profile.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/18/2024
ms.author: duau
---

# Upgrade from Azure Front Door Standard to Premium

Upgrade your Azure Front Door Standard to Premium for advanced capabilities and increased quota limits without any downtime. For a detailed comparison, see [Tier comparison](standard-premium/tier-comparison.md).

This guide explains how to upgrade your Azure Front Door Standard profile. After upgrading, you'll be billed for the Azure Front Door Premium monthly base fee at an hourly rate.

> [!IMPORTANT]
> Downgrading from **Premium** to **Standard** isn't supported.

## Prerequisite

Ensure you have an Azure Front Door Standard profile in your subscription.

## Upgrade tier

1. Navigate to the Azure Front Door Standard profile you want to upgrade and select **Configuration** under *Settings*.

    :::image type="content" source="./media/tier-upgrade/overview.png" alt-text="Screenshot of the configuration button under settings for an Azure Front Door Standard profile.":::

2. Select **Upgrade** to start the upgrade process. If no WAF policies are associated with your profile, confirm to proceed.

    :::image type="content" source="./media/tier-upgrade/upgrade-button.png" alt-text="Screenshot of the upgrade button on the configuration page of an Azure Front Door Standard profile.":::

3. If WAF policies are associated, you're directed to the *Upgrade WAF policies* page. Choose to copy the WAF policies or use an existing premium WAF policy. You can rename the new WAF policy copy.

    :::image type="content" source="./media/tier-upgrade/upgrade-waf.png" alt-text="Screenshot of the upgrade WAF policies page.":::

    > [!NOTE]
    > Enable managed WAF rules manually for the new premium WAF policy copies after upgrading.

4. Select **Upgrade** after setting up WAF policies. Confirm by selecting **Yes**.

    :::image type="content" source="./media/tier-upgrade/confirm-upgrade.png" alt-text="Screenshot of the confirmation message on the upgrade WAF policies page.":::

5. The upgrade process creates a new premium WAF policy and associates it with the Azure Front Door Premium profile. The process can take a few minutes.

    :::image type="content" source="./media/tier-upgrade/upgrade-in-progress.png" alt-text="Screenshot of the configuration page with upgrade in progress status.":::

6. Once the upgrade is complete, **Tier: Premium** is displayed on the *Configuration* page.

    :::image type="content" source="./media/tier-upgrade/upgrade-complete.png" alt-text="Screenshot of the Azure Front Door tier upgraded to premium on the configuration page.":::

    > [!NOTE]
    > Billing for Azure Front Door Premium is at an hourly rate.

## Next steps

* Learn more about [Managed rule for Azure Front Door WAF policy](../web-application-firewall/afds/waf-front-door-drs.md).
* Enable [Private Link to origin resources in Azure Front Door](private-link.md).
