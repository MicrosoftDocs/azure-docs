---
title: Enable all of the paid plan on your subscription - Microsoft Defender for Cloud
titleSuffix: Microsoft Defender for Cloud
description: Learn how to enable all of Microsoft Defender for Cloud's paid plans on your subscription.
ms.topic: tutorial
ms.date: 06/22/2023
ms.custom: mode-other
---

# Protect all of your resources with Defender for Cloud

In this deployment guide, you learn how to enable all of Microsoft Defender for Cloud's paid plans to your environments.

## Enable all paid plans on your subscription

To enable all of the Defender for Cloud's protections, you need to enable the other paid plans for each of the workloads that you want to protect.

> [!NOTE]
> - You can enable **Microsoft Defender for Storage accounts** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for SQL** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for open-source relational databases** at the resource level only.
> - The Microsoft Defender plans available at the workspace level are: **Microsoft Defender for Servers**, **Microsoft Defender for SQL servers on machines**.

When you enabled Defender plans on an entire Azure subscription, the protections are applied to all other resources in the subscription.

**To enable additional paid plans on a subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

    :::image type="content" source="media/get-started/environmental-settings.png" alt-text="Screenshot that shows where to navigate to, to select environmental settings from.":::
    
1. Select the subscription or workspace that you want to protect.

1. Select **Enable all** to enable all of the plans for Defender for Cloud.

    :::image type="content" source="media/get-started/enable-all-plans.png" alt-text="Screenshot that shows where the enable button is located on the plans page." lightbox="media/get-started/enable-all-plans.png":::
    
1. Select **Save**.

All of the plans are turned on and the monitoring components required by each plan are deployed to the protected resources.

If you want to disable any of the plans, toggle the individual plan to **off**. The extensions used by the plan aren't uninstalled but, after a short time, the extensions stop collecting data.

> [!TIP]
> To access Defender for Cloud on all subscriptions within a management group, see [Enable Defender for Cloud on multiple Azure subscriptions](onboard-management-group.md).

## Next steps

Learn more about [Microsoft Defender for Cloud's overview page](overview-page.md).
