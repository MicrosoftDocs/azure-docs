---
title: Enable Microsoft Defender for Cloud's integrated workload protections
titleSuffix: Microsoft Defender for Cloud
description: Learn how to enable enhanced security features to extend the protections of Microsoft Defender for Cloud to your hybrid and multicloud resources
ms.topic: quickstart
ms.date: 07/14/2022
ms.custom: mode-other
---

# Quickstart: Enable enhanced security features

Get started with Defender for Cloud by using its enhanced security features to protect your hybrid and multicloud environments.

In this quickstart, you'll learn how to enable the enhanced security features by enabling the different Defender for Cloud plans through the Azure portal.

To learn more about the benefits of enhanced security features, see [Microsoft Defender for Cloud's enhanced security features](enhanced-security-features-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). For pricing details in your local currency or region, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

- You must have [enabled Defender for Cloud](get-started.md) on your Azure subscription. 

## Enable enhanced security features from the Azure portal

To enable all Defender for Cloud features including threat protection capabilities, you must enable enhanced security features on the subscription containing the applicable workloads. 

If you only enable Defender for Cloud at the workspace level, Defender for Cloud won't enable just-in-time VM access, adaptive application controls, and network detections for Azure resources. In addition, the only Microsoft Defender plans available at the workspace level are Microsoft Defender for Servers and Microsoft Defender for SQL servers on machines.

> [!NOTE]
> - You can enable **Microsoft Defender for Storage accounts** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for SQL** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for open-source relational databases** at the resource level only.

You can protect an entire Azure subscription with Defender for Cloud's enhanced security features and the protections will be inherited by all resources within the subscription.

**To enable enhanced security features on one subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. From Defender for Cloud's main menu, select **Environment settings**.
    
1. Select the subscription or workspace that you want to protect.
    
1. Select **Enable all** to enable all of the plans for Defender for Cloud.

    :::image type="content" source="./media/enhanced-security-features-overview/pricing-tier-page.png" alt-text="Screenshot of the Defender for Cloud's pricing page in the Azure portal." lightbox="media/enhanced-security-features-overview/pricing-tier-page.png":::
    
1. Select **Save**.

**To enable enhanced security on multiple subscriptions or workspaces**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. From Defender for Cloud's menu, select **Getting started**.

    The Upgrade tab lists subscriptions and workspaces eligible for onboarding.

    :::image type="content" source="./media/enable-enhanced-security/get-started-upgrade-tab.png" alt-text="Screenshot of the upgrade tab of the getting started page." lightbox="media/enable-enhanced-security/get-started-upgrade-tab.png"::: 

1. Select the desired subscriptions and workspace from the list.

1. Select **Upgrade**.

    :::image type="content" source="./media/enable-enhanced-security/upgrade-selected-workspaces-and-subscriptions.png" alt-text="Screenshot that shows where the upgrade button is located on the screen." lightbox="media/enable-enhanced-security/upgrade-selected-workspaces-and-subscriptions.png":::

    > [!NOTE]
    > - If you select subscriptions and workspaces that aren't eligible for trial, the next step will upgrade them and charges will begin.
    > - If you select a workspace that's eligible for a free trial, the next step will begin a trial.   

## Customize plans

Certain plans allow you to customize your protection.

You can learn about the differences between the [Defender for Servers plans](defender-for-servers-introduction.md#defender-for-servers-plans) to help you choose which one you would like to apply to your subscription.

Defender for Databases allows you to [select which type of resources you want to protect](quickstart-enable-database-protections.md). You can learn about the different types of protections offered.

Defender for Containers is available on hybrid and multicloud environments. You can learn more about the [enablement process](defender-for-containers-enable.md) for Defender for Containers for each environment type.

## Disable enhanced security features

If you choose to disable the enhanced security features for a subscription, you'll just need to change the plan to **Off**.
 
**To disable enhanced security features**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. From Defender for Cloud's menu, select **Environment settings**.

1. Select the relevant subscriptions and workspaces.

1. Find the plan you wish to turn off and select **Off**.

    :::image type="content" source="./media/enable-enhanced-security/disable-plans.png" alt-text="Screenshot that shows you how to enable or disable Defender for Cloud's enhanced security features." lightbox="media/enable-enhanced-security/disable-plans.png":::

    > [!NOTE]
    > After you disable enhanced security features - whether you disable a single plan or all plans at once - data collection may continue for a short period of time. 

## Next steps

Now that you've enabled enhanced security features, enable the necessary agents and extensions to perform automatic data collection as described in [auto provisioning agents and extensions](enable-data-collection.md).
