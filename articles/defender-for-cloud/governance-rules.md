---
title: Driving your organization to remediate security issues with recommendation governance in Microsoft Defender for Cloud
description: Learn how to assign owners and due dates to security recommendations and create rules to automatically assign owners and due dates
services: defender-for-cloud
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 07/21/2022
---
# Drive your organization to remediate security recommendations with governance

Security teams are responsible for improving the security posture of their organizations but they may not have the resources or authority to actually implement security recommendations. [Assigning owners with due dates](#manually-assigning-owners-and-due-dates-for-recommendation-remediation) and [defining governance rules](#building-an-automated-process-for-improving-security-with-governance-rules) creates accountability and transparency so you can drive the process of improving the security posture in your organization.

Stay on top of the progress on the recommendations in the security posture. Weekly email notifications to the owners and managers make sure that they take timely action on the recommendations that can improve your security posture and recommendations.

You can learn more by watching this video from the Defender for Cloud in the Field video series:
- [Remediate Security Recommendations with Governance](episode-fifteen.md)

## Building an automated process for improving security with governance rules

To make sure your organization is systematically improving its security posture, you can define rules that assign an owner and set the due date for resources in the specified recommendations. That way resource owners have a clear set of tasks and deadlines for remediating recommendations.

You can then review the progress of the tasks by subscription, recommendation, or owner so you can follow up with tasks that need more attention.

### Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview.<br>[!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]|
|Pricing:|Free while in preview and will be a paid service after preview|
|Required roles and permissions:|Azure - **Contributor**, **Security Admin**, or **Owner** on the subscription<br>AWS, GCP – **Contributor**, **Security Admin**, or **Owner** on the connector|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP accounts|

### Defining governance rules to automatically set the owner and due date of recommendations

Governance rules can identify resources that require remediation according to specific recommendations or severities, and the rule assigns an owner and due date to make sure the recommendations are handled. Many governance rules can apply to the same recommendations, so the rule with lower priority value is the one that assigns the owner and due date.

The due date set for the recommendation to be remediated is based on a timeframe of 7, 14, 30, or 90 days from when the recommendation is found by the rule. For example, if the rule identifies the resource on March 1st and the remediation timeframe is 14 days, March 15th is the due date. You can apply a grace period so that the resources that are given a due date don't impact your secure score until they're overdue.

You can also set the owner of the resources that are affected by the specified recommendations. In organizations that use resource tags to associate resources with an owner, you can specify the tag key and the governance rule reads the name of the resource owner from the tag.

By default, email notifications are sent to the resource owners weekly to provide a list of the on time and overdue tasks. If an email for the owner's manager is found in the organizational Azure Active Directory (Azure AD), the owner's manager receives a weekly email showing any overdue recommendations by default.

:::image type="content" source="./media/governance-rules/add-governance-rules.png" alt-text="Screenshot of fields required to add a governance rule." lightbox="media/governance-rules/add-governance-rules.png":::

To define a governance rule that assigns an owner and due date:

1. In the **Environment settings**, select the Azure subscription, AWS account, or Google project that you want to define the rule for.
1. In **Governance rules (preview)**, select **Add rule**.
1. Enter a name for the rule.
1. Set a priority for the rule. You can see the priority for the existing rules in the list of governance rules.
1. Select the recommendations that the rule applies to, either:
    - **By severity** - The rule assigns the owner and due date to any recommendation in the subscription that doesn't already have them assigned.
    - **By name** - Select the specific recommendations that the rule applies to.
1. Set the owner to assign to the recommendations either:
    - **By resource tag** - Enter the resource tag on your resources that defines the resource owner.
    - **By email address** - Enter the email address of the owner to assign to the recommendations.
1. Set the **remediation timeframe**, which is the time between when the resources are identified to require remediation and the time that the remediation is due.
1. If you don't want the resources to affect your secure score until they're overdue, select **Apply grace period**.
1. If you don't want either the owner or the owner's manager to receive weekly emails, clear the notification options.
1. Select **Create**.

If there are existing recommendations that match the definition of the governance rule, you can either:

- Assign an owner and due date to recommendations that don't already have an owner or due date.
- Overwrite the owner and due date of existing recommendations.

> [!NOTE]
> When you delete or disable a rule, all existing assignments and notifications will remain.

## Manually assigning owners and due dates for recommendation remediation

For every resource affected by a recommendation, you can assign an owner and a due date so that you know who needs to implement the security changes to improve your security posture and when they're expected to do it by. You can also apply a grace period so that the resources that are given a due date don't impact your secure score unless they become overdue.

To manually assign owners and due dates to recommendations:

1. Go to the list of recommendations:
    - In the Defender for Cloud overview, select **Security posture** and then select **View recommendations** for the environment that you want to improve.
    - Go to **Recommendations** in the Defender for Cloud menu.
1. In the list of recommendations, use the **Potential score increase** to identify the security control that contains recommendations that will increase your secure score.

    > [!TIP]
    > You can also use the search box and filters above the list of recommendations to find specific recommendations.

1. Select a recommendation to see the affected resources.
1. For any resource that doesn't have an owner or due date, select the resources and select **Assign owner**.
1. Enter the email address of the owner that needs to make the changes that remediate the recommendation for those resources.
1. Select the date by which to remediate the recommendation for the resources.
1. You can select **Apply grace period** to keep the resource from impacting the secure score until it's overdue.
1. Select **Save**.

The recommendation is now shown as assigned and on time.

## Tracking the status of recommendations for further action

After you define governance rules, you'll want to review the progress that the owners are making in remediating the recommendations.

You can track the assigned and overdue recommendations in:

- The security posture shows the number of unassigned and overdue recommendations.

    :::image type="content" source="./media/governance-rules/governance-in-security-posture.png" alt-text="Screenshot of governance status in the security posture.":::

- The list of recommendations shows the governance status of each recommendation.

    :::image type="content" source="./media/governance-rules/governance-in-recommendations.png" alt-text="Screenshot of recommendations with their governance status." lightbox="media/governance-rules/governance-in-recommendations.png":::

- The governance report in the governance rules settings lets you drill down into recommendations by rule and owner.

    :::image type="content" source="./media/governance-rules/governance-in-workbook.png" alt-text="Screenshot of governance status by rule and owner in the governance workbook." lightbox="media/governance-rules/governance-in-workbook.png":::

### Tracking progress by rule with the governance report

The governance report lets you select subscriptions that have governance rules and, for each rule and owner, shows you how many recommendations are completed, on time, overdue, or unassigned.

> [!NOTE]
> Manual assignments will not appear on this report. To see all assignments by owner, use the Owner tab on the Security Posture page.

**To review the status of the recommendations in a rule**:

1. In **Recommendations**, select **Governance report (preview)**.
1. Select the subscriptions that you want to review.
1. Select the rules that you want to see details about.

You can see the list of owners and recommendations for the selected rules, and their status.

**To see the list of recommendations for each owner**:

1. Select **Security posture**.
1. Select the **Owner (preview)** tab to see the list of owners and the number of overdue recommendations for each owner.

    - Hover over the (i) in the overdue recommendations to see the breakdown of overdue recommendations by severity.

    - If the owner email address is found in the organizational Azure Active Directory (Azure AD), you'll see the full name and picture of the owner.

1. Select **View recommendations** to go to the list of recommendations associated with the owner.

## Next steps

In this article, you learned how to set up a process for assigning owners and due dates to tasks so that owners are accountable for taking steps to improve your security posture.

Check out how owners can [set ETAs for tasks](review-security-recommendations.md#manage-the-owner-and-eta-of-recommendations-that-are-assigned-to-you) so that they can manage their progress.
