---
title: Suppressing false positives or other unwanted security alerts
description: This article explains how to use Microsoft Defender for Cloud's suppression rules to hide unwanted security alerts, such as false positives
ms.date: 01/09/2023
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
---
# Suppress alerts from Microsoft Defender for Cloud

This page explains how you can use alerts suppression rules to suppress false positives or other unwanted security alerts from Defender for Cloud.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Required roles and permissions:|**Security admin** and **Owner** can create/delete rules.<br>**Security reader** and **Reader** can view rules.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)|

## What are suppression rules?

The Microsoft Defender plans detect threats in your environment and generate security alerts. When a single alert isn't interesting or relevant, you can manually dismiss it. Suppression rules let you automatically dismiss similar alerts in the future.

Just like when you identify an email as spam, you want to review your suppressed alerts periodically to make sure you're not missing any real threats.

Some examples of how to use suppression rule are:

- Suppress alerts that you've identified as false positives
- Suppress alerts that are being triggered too often to be useful

:::image type="content" source="./media/alerts-suppression-rules/create-suppression-rule.gif" alt-text="Create alert suppression rule.":::

## Create a suppression rule

You can apply suppression rules to management groups or to subscriptions.

- To suppress alerts for a management group, use [Azure Policy](../governance/policy/overview.md).
- To suppress alerts for subscriptions, use the Azure portal or the [REST API](#create-and-manage-suppression-rules-with-the-api).

Alert types that were never triggered on a subscription or management group before the rule was created won't be suppressed.

To create a rule for a specific alert in the Azure portal:

1. From Defender for Cloud's security alerts page, select the alert you want to suppress.
1. From the details pane, select **Take action**.
1. In the **Suppress similar alerts** section of the Take action tab, select **Create suppression rule**.
1. In the **New suppression rule** pane, enter the details of your new rule.

    - **Entities** - The resources that the rule applies to. You can specify a single resource, multiple resources, or resources that contain a partial resource ID. If you don't specify any resources, the rule applies to all resources in the subscription.
    - **Name** - A name for the rule. Rule names must begin with a letter or a number, be between 2 and 50 characters, and contain no symbols other than dashes (-) or underscores (_).
    - **State** - Enabled or disabled.
    - **Reason** - Select one of the built-in reasons or 'other' to specify your own reason in the comment.
    - **Expiration date** - An end date and time for the rule. Rules can run for without any time limit as set in Expiration date.

1. You select **Simulate** to see the number of previously received alerts that would have been dismissed if the rule was active.
1. Save the rule.

You can also select the **Suppression rules** button in the Security Alerts page and select **Create suppression rule** to enter the details of your new rule.

:::image type="content" source="media/alerts-suppression-rules/create-new-suppression-rule.png" alt-text="Screenshot of the Create suppression rule button in the Suppression rules page.":::

> [!NOTE]
> For some alerts, suppression rules are not applicable for certain entities. If the rule is not available, a message will display at the end of the **Create a suppression rule** process.

## Edit a suppression rule

To edit a rule you've created from the suppression rules page:

1. From Defender for Cloud's security alerts page, select **Suppression rules** at the top of the page.

    :::image type="content" source="media/alerts-suppression-rules/suppression-rules-button.png" alt-text="Screenshot of the suppression rule button in the Security Alerts page.":::

1. The suppression rules page opens with all the rules for the selected subscriptions.

    :::image type="content" source="media/alerts-suppression-rules/suppression-rules-page.png" alt-text="Screenshot of the Suppression rules page where you can review the suppression rules and create new ones." lightbox="media/alerts-suppression-rules/suppression-rules-page.png":::

1. To edit a single rule, open the three dots (...) at the end of the rule and select **Edit**.
1. Change the details of the rule and select **Apply**.

To delete a rule, use the same three dots menu and select **Remove**.

## Create and manage suppression rules with the API

You can create, view, or delete alert suppression rules using the Defender for Cloud REST API.

The relevant HTTP methods for suppression rules in the REST API are:

- **PUT**: To create or update a suppression rule in a specified subscription.
- **GET**:

  - To list all rules configured for a specified subscription. This method returns an array of the applicable rules.
  - To get the details of a specific rule on a specified subscription. This method returns one suppression rule.
  - To simulate the impact of a suppression rule still in the design phase. This call identifies which of your existing alerts would have been dismissed if the rule had been active.

- **DELETE**: Deletes an existing rule (but doesn't change the status of alerts already dismissed by it).

For details and usage examples, see the [API documentation](/rest/api/defenderforcloud/).

## Next steps

This article described the suppression rules in Microsoft Defender for Cloud that automatically dismiss unwanted alerts.

Learn more about security alerts:

- [Security alerts generated by Defender for Cloud](alerts-reference.md)
