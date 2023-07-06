---
title: Remove Microsoft Sentinel | Microsoft Docs
description: How to delete your Microsoft Sentinel instance.
author: yelevin
ms.topic: conceptual
ms.date: 07/05/2023
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Remove Microsoft Sentinel from your workspace

If you no longer want to use Microsoft Sentinel, this article explains how to remove it from your workspace.

## How to remove Microsoft Sentinel

Follow this process to remove Microsoft Sentinel from your workspace:

1. From the Microsoft Sentinel navigation menu, under **Configuration**, select **Settings**.

1. In the **Settings** pane, select the **Settings** tab.

1. Locate and expand the **Remove Microsoft Sentinel** expander (at the bottom of the list of expanders).

    :::image type="content" source="media/offboard/locate-remove-sentinel.png" alt-text="Screenshot to find the setting to remove Microsoft Sentinel from your workspace.":::

1. Read the **Know before you go...** section and the rest of this document carefully, making sure that you understand the implications of removing Microsoft Sentinel, and that you take all the necessary actions before proceeding.

1. Before you remove Microsoft Sentinel, please mark the relevant checkboxes to let us know why you're removing it. Enter any additional details in the space provided, and indicate whether you want Microsoft to email you in response to your feedback.

1. Select **Remove Microsoft Sentinel from your workspace**.
    
    :::image type="content" source="media/offboard/remove-sentinel-reasons.png" alt-text="Screenshot to remove the Microsoft Sentinel solution from your workspace and specify reasons.":::

## Consider pricing changes
When Microsoft Sentinel is removed from a workspace, there may still be costs associated with the data in Azure Monitor Log Analytics. For more information on the effect to commitment tier costs, see [Simplified billing offboarding behavior](enroll-simplified-pricing-tier.md#offboarding-behavior).

## What happens behind the scenes?

When you remove the solution, Microsoft Sentinel takes up to 48 hours to complete the first phase of the deletion process.

After the disconnection is identified, the offboarding process begins.

**The configuration of these connectors is removed:**
-   Office 365

-   AWS

-   Microsoft services security alerts: Microsoft Defender for Identity, Microsoft Defender for Cloud Apps (*formerly Microsoft Cloud App Security*) including Cloud Discovery Shadow IT reporting, Azure AD Identity Protection, Microsoft Defender for Endpoint, security alerts from Microsoft Defender for Cloud (*formerly Azure Defender*)

-   Threat Intelligence

-   Common security logs (including CEF-based logs, Barracuda, and Syslog) (If you get security alerts from Microsoft Defender for Cloud, these logs will continue to be collected.)

-   Windows Security Events (If you get security alerts from Microsoft Defender for Cloud, these logs will continue to be collected.)

Within the first 48 hours, the data and analytics rules (including real-time automation configuration) will no longer be accessible or queryable in Microsoft Sentinel.

**After 30 days these resources are removed:**

-   Incidents (including investigation metadata)

-   Analytics rules

-   Bookmarks

Your playbooks, saved workbooks, saved hunting queries, and notebooks are not removed. **Some may break due to the removed data. Remove those manually.**

After you remove the service, there is a grace period of 30 days to re-enable the solution. Your data and analytics rules will be restored, but the configured connectors that were disconnected must be reconnected.

> [!NOTE]
> If you remove the solution, your subscription will continue to be registered with the Microsoft Sentinel resource provider. **You can remove it manually.**


## Next steps
In this document, you learned how to remove the Microsoft Sentinel service. If you change your mind and want to install it again:
- Get started [on-boarding Microsoft Sentinel](quickstart-onboard.md).
