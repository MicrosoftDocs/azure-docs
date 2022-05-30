---
title: Driving your organization to remediate security issues with recommendation governance
description: Learn how to assign owners and due dates to security recommendations and create rules to automatically assign owners and due dates
services: defender-for-cloud
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 05/29/2022
---
# Drive your organization to remediate security recommendations with governance

Security teams are responsible for improving the security posture of their organizations but they don't have the resources to actually implement security recommendations. [Assigning owners with due dates](#manually-assigning-owners-and-due-dates-for-recommendation-remediation) and [defining governance rules](#defining-governance-rules-to-automatically-set-the-owner-and-due-date-of-recommendations-preview) create transparency and accountability so you can drive the process of improving the security posture in your organization.

Weekly email notifications update resource owners on the recommendations they're responsible for and, if their manager is found in the organizational Azure Active Directory(AAD), the owner's manager receives an email showing any overdue recommendations.

After you assign owners and due dates, you can track how many recommendations are overdue in your security posture and recommendations.

## Manually assigning owners and due dates for recommendation remediation

For every resource affected by a recommendation, you can assign an owner and a due date so that you know who needs to implement the security changes to improve your security posture and when they're expected to do it by. You can also apply a grace period so that the resources that are given a due date don't impact your secure score unless they become overdue.

To manually assign owners and due dates to recommendations:

1. Go to the list of recommendations:
    - In the Defender for Cloud overview, select **Security posture** and then select **View recommendations** for the environment that you want to improve.
    - Go to **Recommendations** in the Defender for Cloud menu.
1. In the list of recommendations, use the **Potential score increase** to identify the security control that contains recommendations that will increase your secure score.
    - You can also use the search box and filters above the list of recommendations to find specific recommendations.
1. Select a recommendation to see the affected resources.
1. For any resource that doesn't have an owner or due date, select the resources and select **Assign owner**.
1. Enter the email address of the owner that needs to make the changes that remediate the recommendation for those resources.
1. Select the date by which to remediate the recommendation for the resources.
1. You can select **Apply grace period** to keep the resource from impacting the secure score until it's overdue.
1. Select **Save**.

The recommendation is now shown as assigned and on time.

## Building a process for improving security with governance rules

To make sure your organization is systematically improving its security posture, you can define rules that assign an owner and set the due date for resources in the specified recommendations. That way resource owners have a clear set of tasks and deadlines for remediating recommendations.

You can then review the progress of the tasks by subscription, recommendation, or owner so you can follow up with tasks that need more attention.

### Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview.<br>[!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]|
|Pricing:|Free|
|Supported environments:|Microsoft Azure, Amazon AWS, Google GCP|
|Required roles and permissions:|Azure - **Contributor**, **Security Admin**, or **Owner** on the subscription<br>AWS, GCP – **Contributor**, **Security Admin**, or **Owner** on the connector|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts|

### Defining governance rules to automatically set the owner and due date of recommendations (Preview)

When you define governance rules, you can either identify recommendations by severity or by name. Many governance rules can apply to the same resources, so the higher priority rule is the one that takes precedence.

The due date set for the recommendation to be remediated is based on a timeframe 7, 14, 30, 90 days). Resources that are already identified as affected by the recommendation are given a due date that is the specified number of days from the date that the rule is defined. Resources that are found after the rule is defined are given a due date from the date they're found. You can apply a grace period so that the resources that are given a due date don't impact your secure score unless they become overdue.

You can also set the owner of the resources that are affected by the specified recommendations. In organizations that use resource tags to associate resources with an owner, you can specify the tag key and the governance rule reads the name of the resource owner from the tag.

By default, email notifications are sent to the resource owners weekly to provide a list of the on time and overdue tasks. If the owner's manager is found in the organizational Azure Active Directory(AAD), the owner's manager receives an email showing any overdue recommendations by default.

To define a governance rule that assigns an owner and due date:

1. In the **Environment settings**, select the subscription that you want to define the rule for.
1. In **Governance rules (preview)**, select **Add rule**.
1. Enter a name for the rule.
1. Set a priority for the rule. You can see the priority for the existing rules in the list of governance rules.
1. Select the recommendations that the rule applies to, either:
    1. **By severity** - The rule assigns the owner and due date to any recommendation in the subscription that doesn't already have them assigned.
    1. **By name** - Select the specific recommendations that the rule applies to.
1. Set the owner to assign to the recommendations:
    - **By resource tag** - Enter the resource tag on your resources that defines the resource owner.
    - **By email address** - Enter the email address of the owner to assign to the recommendations.
1. Set the remediation timeframe, which is the time from when the resources is identified to require remediation to the time that the remediation is due.
    For example, if the rule identifies the resource on Jan 1 and the remediation timeframe is 14 days, Jan 15 is the due date.
1. If you don't want the resources to affect your secure score until they're overdue, select **Apply grace period**.
1. If you don't want either the owner or the owner's manager to receive weekly emails, clear the notification options.
1. Select **Create**.

Any recommendations that match the definition of the governance rule and don't already have an owner or due date are now assigned an owner and due date.

### Reviewing governance status for each rule (Preview)

After you define governance rules, you'll want to review the progress that the owners are making in remediating the recommendations. The governance report lets you select subscriptions that have governance rules and, for each rule and owner, shows you how many recommendations are completed, on time, overdue, or unassigned.

To review the status of the recommendations in a rule:

1. In the **Environment settings**, select the subscription that you want to define the rule for.
1. In **Governance rules (preview)**, select **Governance report (preview)**.

    :::image type="content" source="{source}" alt-text="{alt-text}":::

1. Select the subscriptions that you want to review.
1. Select the rules that you want to see details about.

You can see the list of owners and recommendations for the selected rules, and their status.

To see the list of recommendations for each owner:

1. Select **Security posture**.
1. Select the **Owner (preview)** tab to see the list of owners and the number of overdue recommendations for each owner.

    - Hover over the (i) in the overdue recommendations to see the breakdown of overdue recommendations by severity.

    - If the owner email address is found in the organizational Azure Active Directory (AAD), you'll see the full name and picture of the owner.

1. Select **View recommendations** to go to the list of recommendations associated with the owner.

## Next steps
