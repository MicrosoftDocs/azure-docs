---
title: Enable Microsoft Defender for Cloud's integrated workload protections
description: Learn how to enable enhanced security features to extend the protections of Microsoft Defender for Cloud to your hybrid and multicloud resources
ms.topic: quickstart
ms.author: benmansheim
author: bmansheim
ms.date: 11/09/2021
ms.custom: mode-other
---

# Quickstart: Enable enhanced security features

To learn about the benefits of enhanced security features, see [Microsoft Defender for Cloud's enhanced security features](enhanced-security-features-overview.md).

## Prerequisites

For the purpose of the Defender for Cloud quickstarts and tutorials you must enable the enhanced security features. 

You can protect an entire Azure subscription with Defender for Cloud's enhanced security features and the protections will be inherited by all resources within the subscription.

A free 30-day trial is available. For pricing details in your local currency or region, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Enable enhanced security features from the Azure portal

To enable all Defender for Cloud features including threat protection capabilities, you must enable enhanced security features on the subscription containing the applicable workloads. Enabling it at the workspace level doesn't enable just-in-time VM access, adaptive application controls, and network detections for Azure resources. In addition, the only Microsoft Defender plans available at the workspace level are Microsoft Defender for Servers and Microsoft Defender for SQL servers on machines.

- You can enable **Microsoft Defender for Storage accounts** at either the subscription level or resource level
- You can enable **Microsoft Defender for SQL** at either the subscription level or resource level
- You can enable **Microsoft Defender for open-source relational databases** at the resource level only

### To enable enhanced security features on your subscriptions and workspaces:

- To enable enhanced security features on one subscription:

    1. From Defender for Cloud's main menu, select **Environment settings**.
    1. Select the subscription or workspace that you want to protect.
    1. Select **Enable all Microsoft Defender plans** to upgrade.
    1. Select **Save**.

    > [!TIP]
    > You'll notice that each Microsoft Defender plan is priced separately and can be individually set to on or off. For example, you might want to turn off Defender for App Service on subscriptions that don't have an associated Azure App Service plan. 

    :::image type="content" source="./media/enhanced-security-features-overview/pricing-tier-page.png" alt-text="Defender for Cloud's pricing page in the portal":::

- To enable enhanced security on multiple subscriptions or workspaces:

    1. From Defender for Cloud's menu, select **Getting started**.

        The **Upgrade** tab lists subscriptions and workspaces eligible for onboarding.

        :::image type="content" source="./media/enable-enhanced-security/get-started-upgrade-tab.png" alt-text="Upgrade tab of the getting started page."::: 

    1. From the **Select subscriptions and workspaces to protect with Microsoft Defender for Cloud** list, select the subscriptions and workspaces to upgrade and select **Upgrade** to enable all Microsoft Defender for Cloud security features.

       - If you select subscriptions and workspaces that aren't eligible for trial, the next step will upgrade them and charges will begin.
       - If you select a workspace that's eligible for a free trial, the next step will begin a trial.

        :::image type="content" source="./media/enable-enhanced-security/upgrade-selected-workspaces-and-subscriptions.png" alt-text="Upgrade all selected workspaces and subscriptions from the getting started page.":::


## Disable enhanced security features

If you need to disable enhanced security features for a subscription, the procedure is the same but you select **Enhanced security off**:
 
1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant subscription.
1. Select **Defender plans** and select **Enhanced security off**.

    :::image type="content" source="./media/enable-enhanced-security/disable-plans.png" alt-text="Enable or disable Defender for Cloud's enhanced security features.":::

1. Select **Save**.

> [!NOTE]
> After you disable enhanced security features - whether you disable a single plan or all plans at once - data collection may continue for a short period of time. 

## Next steps

Now that you've enabled enhanced security features, enable the necessary agents and extensions to perform automatic data collection as described in [auto provisioning agents and extensions](enable-data-collection.md).
