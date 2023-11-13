---
title: Tutorial - Investigate the health of your resources
description: 'Tutorial: Learn how to investigate the health of your resources using Microsoft Defender for Cloud.'
ms.topic: tutorial
ms.date: 01/24/2023
---

# Tutorial: Investigate the health of your resources

The resource health page provides a snapshot view of the overall health of a single resource. You can review detailed information about the resource and all recommendations that apply to that resource. Also, if you're using any of the [advanced protection plans of Microsoft Defender for Cloud](defender-for-cloud-introduction.md), you can see outstanding security alerts for that specific resource too.

This single page, currently in preview, in Defender for Cloud's portal pages shows:

1. **Resource information** - The resource group and subscription it's attached to, the geographic location, and more.
1. **Applied security feature** - Whether a Microsoft Defender plan is enabled for the resource.
1. **Counts of outstanding recommendations and alerts** - The number of outstanding security recommendations and Defender for Cloud alerts.
1. **Actionable recommendations and alerts** - Two tabs list the recommendations and alerts that apply to the resource.

:::image type="content" source="media/investigate-resource-health/resource-health-page-virtual-machine.gif" alt-text="Microsoft Defender for Cloud's resource health page showing the health information for a virtual machine":::

In this tutorial you'll learn how to:

> [!div class="checklist"]
> - Access the resource health page for all resource types
> - Evaluate the outstanding security issues for a resource
> - Improve the security posture for the resource

## Prerequisites

To step through the features covered in this tutorial:

- You need an Azure subscription. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- To apply security recommendations, you must be signed in with an account that has the relevant permissions (Resource Group Contributor, Resource Group Owner, Subscription Contributor, or Subscription Owner)
- To dismiss alerts, you must be signed in with an account that has the relevant permissions (Security Admin, Subscription Contributor, or Subscription Owner)

## Access the health information for a resource

> [!TIP]
> In the following screenshots, we're opening a virtual machine, but the resource health page can show you the details for all resource types.

To open the resource health page for a resource:

1. Select any resource from the [asset inventory page](asset-inventory.md).

    :::image type="content" source="media/investigate-resource-health/inventory-select-resource.png" alt-text="Select a resource from the asset inventory to view the resource health page." lightbox="./media/investigate-resource-health/inventory-select-resource.png":::

1. Use the left pane of the resource health page for an overview of the subscription, status, and monitoring information about the resource. You can also see whether enhanced security features are enabled for the resource:

    :::image type="content" source="media/investigate-resource-health/resource-health-left-pane.png" alt-text="The left pane of Microsoft Defender for Cloud's resource health page shows the subscription, status, and monitoring information about the resource. It also includes the total number of outstanding security recommendations and security alerts.":::

1. Use the two tabs on the right pane to review the lists of security recommendations and alerts that apply to this resource:

    :::image type="content" source="media/investigate-resource-health/resource-health-right-pane.png" alt-text="The right pane of Microsoft Defender for Cloud's resource health page has two tabs: recommendations and alerts." lightbox="./media/investigate-resource-health/resource-health-right-pane.png":::

    > [!NOTE]
    > Microsoft Defender for Cloud uses the terms "healthy" and "unhealthy" to describe the security status of a resource. These terms relate to whether the resource is compliant with a specific [security recommendation](security-policy-concept.md#what-is-a-security-recommendation).
    >
    > In the screenshot above, you can see that recommendations are listed even when this resource is "healthy". One advantage of the resource health page is that all recommendations are listed so you can get a complete picture of your resources' health.

## Evaluate the outstanding security issues for a resource

The resource health page lists the recommendations for which your resource is "unhealthy" and the alerts that are active.

- To ensure your resource is hardened according to the policies applied to your subscriptions, fix the issues described in the recommendations:
    1. From the right pane, select a recommendation.
    1. Continue as instructed on screen.

        > [!TIP]
        > The instructions for fixing issues raised by security recommendations differ for each of Defender for Cloud's recommendations.
        >
        > To decide which recommendations to resolve first, look at the severity of each one and its [potential impact on your secure score](secure-score-security-controls.md#security-controls-and-their-recommendations).

- To investigate a security alert:
    1. From the right pane, select an alert.
    1. Follow the instructions in [Respond to security alerts](managing-and-responding-alerts.md#respond-to-security-alerts).

## Next steps

In this tutorial, you learned about using Defender for Cloud’s resource health page.

To learn more, see these related pages:

- [Respond to security alerts](managing-and-responding-alerts.md#respond-to-security-alerts)
- [Review your security recommendations](review-security-recommendations.md)
