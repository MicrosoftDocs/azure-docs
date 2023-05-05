---
title: Enable Microsoft Defender for Cloud's integrated workload protections
titleSuffix: Microsoft Defender for Cloud
description: Learn how to enable enhanced security features to extend the protections of Microsoft Defender for Cloud to your hybrid and multicloud resources
ms.topic: quickstart
ms.date: 04/23/2023
ms.custom: mode-other, ignite-2022
---

# Quickstart: Enable enhanced security features

In this quickstart, you'll learn how to enable the enhanced security features by enabling the Defender for Cloud plans through the Azure portal.

Microsoft Defender for Cloud uses [monitoring components](monitoring-components.md) to collect data from your resources. These extensions are automatically deployed when you turn on a Defender plan. Each Defender plan has its own requirements for monitoring components, so it's important that the required extensions are deployed to your resources to get all of the benefits of each plan.

The Defender plans show you the monitoring coverage for each Defender plan. If the monitoring coverage is **Full**, all of the necessary extensions are installed. If the monitoring coverage is **Partial**, the information tooltip tells you what extensions are missing. For some plans, you can configure specific monitoring settings.

:::image type="content" source="media/enable-data-collection/defender-plans.png" alt-text="Screenshot of monitoring coverage of Microsoft Defender for Cloud extensions." lightbox="media/enable-data-collection/defender-plans.png":::

To learn more about the benefits of enhanced security features, see [Microsoft Defender for Cloud's enhanced security features](enhanced-security-features-overview.md).

## Prerequisites

To get started with Defender for Cloud, you'll need a Microsoft Azure subscription with [Defender for Cloud enabled](get-started.md). If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

## Enable Defender plans to get the enhanced security features

To get all of the Defender for Cloud protections, you'll need to enable the Defender plans that protect for each of the workloads that you want to protect.

> [!NOTE]
> - You can enable **Microsoft Defender for Storage accounts** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for SQL** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for open-source relational databases** at the resource level only.
> - The Microsoft Defender plans available at the workspace level are: Microsoft Defender for Servers, Microsoft Defender for SQL servers on machines

When you enabled Defender plans on an entire Azure subscription, the protections are inherited by all resources in the subscription.

### Enable enhanced security features on a subscription

**To enable enhanced security features on a subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.
    
1. Select the subscription or workspace that you want to protect.

1. Select **Enable all** to enable all of the plans for Defender for Cloud.

    :::image type="content" source="media/enable-enhanced-security/enable-all-plans.png" alt-text="Screenshot that shows where to select the enable all button on the plans page." lightbox="media/enable-enhanced-security/enable-all-plans.png":::
    
1. Select **Save**.

All of the plans are turned on and the monitoring components required by each plan are deployed to the protected resources.

If you want to disable any of the plans, turn off the plan. The extensions used by the plan aren't uninstalled but, after a short time, the extensions stop collecting data.

### Enable enhanced security on multiple subscriptions or workspaces

**To enable enhanced security on multiple subscriptions or workspaces**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Getting started**.

    The Upgrade tab lists subscriptions and workspaces that you can onboard the Defender plan to.

    :::image type="content" source="./media/enable-enhanced-security/getting-started-upgrade.png" alt-text="Screenshot of enabling Defender plans for multiple subscriptions." lightbox="media/enable-enhanced-security/getting-started-upgrade.png"::: 

1. Select the desired subscriptions and workspaces from the list and select **Upgrade**.

    :::image type="content" source="./media/enable-enhanced-security/upgrade-workspaces-and-subscriptions.png" alt-text="Screenshot that shows where the upgrade button is located on the screen." lightbox="media/enable-enhanced-security/upgrade-workspaces-and-subscriptions-full.png":::

    > [!NOTE]
    > - If you select subscriptions and workspaces that aren't eligible for trial, the next step will upgrade them and charges will begin.
    > - If you select a workspace that's eligible for a free trial, the next step will begin a trial.   

If you want to disable any of the plans, turn off the plan. The extensions used by the plan aren't uninstalled but, after a short time, the extensions stop collecting data.

## Next steps

Certain plans allow you to customize your protection.

- Learn about the [Defender for Servers plans](plan-defender-for-servers-select-plan.md#plan-features) to help you choose which plan you want to apply to your subscription.
- Defender for Databases lets you [select which type of resources you want to protect](quickstart-enable-database-protections.md).
- Learn more about [how to enable Defender for Containers](defender-for-containers-enable.md) for different Kubernetes environments.
- Learn about the [monitoring components](monitoring-components.md) that the Defender plans use to collect data from your Azure, hybrid, and multicloud resources.
