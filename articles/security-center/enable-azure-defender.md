---
title: Enable Azure Security Center's integrated workload protections
description: Learn how to enable Azure Defender to extend the protections of Azure Security Center to your hybrid and multi-cloud resources
author: memildin
ms.author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: quickstart
ms.date: 06/07/2021
---

# Quickstart: Enable Azure Defender

To learn about the benefits of Azure Defender, see [Security Center free vs Azure Defender enabled](security-center-pricing.md).

## Prerequisites

For the purpose of the Security Center quickstarts and tutorials you must enable Azure Defender. 

You can protect an entire Azure subscription with Azure Defender and the protections will be inherited by all resources within the subscription.

A free 30-day trial is available. For pricing details in your currency of choice and according to your region, see [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/).

## Enable Azure Defender from the Azure portal

To enable all Security Center features including threat protection capabilities, you must enable Azure Defender on the subscription containing the applicable workloads. Enabling it at the workspace level doesn't enable just-in-time VM access, adaptive application controls, and network detections for Azure resources. In addition, the only Azure Defender plans available at the workspace level are Azure Defender for servers and Azure Defender for SQL servers on machines.

- You can enable **Azure Defender for Storage accounts** at either the subscription level or resource level
- You can enable **Azure Defender for SQL** at either the subscription level or resource level
- You can enable **Azure Defender for open-source relational databases** at the resource level only

### To enable Azure Defender on your subscriptions and workspaces:

- To enable Azure Defender on one subscription:

    1. From Security Center's main menu, select **Pricing & settings**.
    1. Select the subscription or workspace that you want to protect.
    1. Select **Azure Defender on** to upgrade.
    1. Select **Save**.

    > [!TIP]
    > You'll notice that each plan in Azure Defender is priced separately and can be individually set to on or off. For example, you might want to turn off Azure Defender for App Service on subscriptions that don't have an associated Azure App Service plan. 

    :::image type="content" source="./media/security-center-pricing/pricing-tier-page.png" alt-text="Security Center's pricing page in the portal":::

- To enable Azure Defender on multiple subscriptions or workspaces:

    1. From Security Center's sidebar, select **Getting started**.

        The **Upgrade** tab lists subscriptions and workspaces eligible for onboarding.

        :::image type="content" source="./media/enable-azure-defender/get-started-upgrade-tab.png" alt-text="Upgrade tab of the getting started page."::: 

    1. From the **Select subscriptions and workspaces to enable Azure Defender on** list, select the subscriptions and workspaces to upgrade and select **Upgrade** to enable Azure Defender.

       - If you select subscriptions and workspaces that aren't eligible for trial, the next step will upgrade them and charges will begin.
       - If you select a workspace that's eligible for a free trial, the next step will begin a trial.

        :::image type="content" source="./media/enable-azure-defender/upgrade-selected-workspaces-and-subscriptions.png" alt-text="Upgrade all selected workspaces and subscriptions from the getting started page.":::


## Disable Azure Defender

If you need to disable Azure Defender for a subscription, the procedure is the same but you select **Azure Defender off**:
 
1. From Security Center's menu, select **Pricing & settings**.
1. Select the relevant subscription.
1. If your subscription has Azure Defender enabled, open **Azure Defender plans** and select **Azure Defender off**.

    :::image type="content" source="./media/enable-azure-defender/disable-plans.png" alt-text="Enable or disable Azure Defender.":::

1. Select **Save**.

> [!NOTE]
> After you disable Azure Defender - whether you disable a single plan or all plans at once - data collection may continue for a short period of time. 

## Next steps

Now that you've enabled Azure Defender, enable automatic data collection by the necessary agents and extensions described in [auto provisioning agents and extensions](security-center-enable-data-collection.md).