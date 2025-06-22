---
title: Configure Notifications for Azure Load Testing
titleSuffix: Azure Load Testing
description: Learn how to configure notifications for events in Azure Load Testing, enabling notifications for test completions, scheduled tests, and other key events.
services: load-testing
ms.service: azure-load-testing
author: ninallam
ms.author: ninallam
ms.topic: how-to
ms.date: 01/09/2025
---


# Configure notifications for Azure Load Testing

Learn how to configure notifications for events in Azure Load Testing. For example, you can set up notifications to alert you when a test run completes or when a scheduled test run begins. Notifications enable you to stay informed about test run updates, schedules, and test results through email or webhooks.

## Overview

Azure Load Testing allows you to configure notifications to receive updates for key events, such as test completion or schedule changes. These notifications can help you automate follow-up actions and improve team collaboration.

## Supported events

Azure Load Testing supports the following events for notifications:

- Test Run Started: Notifications for all test runs when they start.

- Test Run Completed: Notifications when a test run is completed, including failed tests or failed results.

- Schedule Events: Notifications when schedules complete or are disabled.

## Supported notification channels

### Action groups

[Action Groups](/azure/azure-monitor/alerts/action-groups) are collections of notification preferences and actions that can be triggered by events. In the context of Azure Load Testing, they enable users to route notifications to email recipients, webhooks, or integrated tools like Azure Logic Apps.

> [!NOTE]
>  Action groups might incur additional costs. To view associated costs, refer to the [Azure Monitor pricing details.](https://azure.microsoft.com/pricing/details/monitor/)

## Prerequisites

To configure notifications, ensure you meet the following requirements:

- Permissions: You should have at least the "Load Test Owner" or "Owner/Contributor" role at the resource level.

- Action Group Creation: To create Action Groups, ensure you have the required permissions or contact your system administrator.

## Configure notifications in the Azure portal

1. In the [Azure portal](https://portal.azure.com/), navigate to your Load Test Resource. In the left navigation menu, select **Notifications**.

    :::image type="content" source="media/how-to-create-notification-rules/notification-blade.png" alt-text="Screenshot that shows the Notification menu item in the resource overview page in the Azure portal.":::
   
2. Click **Create notification rule**.
   
3. In the **Scope** tab, provide a name for the notification rule. Select from one of the following scopes:

    - All tests: The notification rule is applicable for all current and future tests.
    
    - Specific Test: Select one or more tests in the resource on which the notification rule is applicable by clicking on Add Test.
    
:::image type="content" source="media/how-to-create-notification-rules/scope-selection.png" alt-text="Screenshot that shows the added test in the scope of a notification rule.":::

> [!NOTE]
>  A maximum of 20 tests can be selected in this scope. 

4. Under the **Events** tab, choose one or more events from the available list:

  - Test Run Started (All Runs)
  
  - Test Run Completed (All Runs, Failed Status, Failed Test Results)
  
  - Schedule Events (Schedule Completed, Schedule Disabled)

5. Choose an existing Action Group or create a new Action Group. To select an Action Group, select **Add action group** and choose from the available ones in the tenant.

   If you need to create one, refer to the Action Group [creation guide](/azure/azure-monitor/alerts/action-groups#create-an-action-group-in-the-azure-portal). Ensure you have at least write permissions for the resource group where you are creating the Action Group.

:::image type="content" source="media/how-to-create-notification-rules/selected-action-group-list.png" alt-text="Screenshot that shows the added action groups in the notification rule.":::

> [!NOTE]
> A maximum of 5 Action Groups can be added to a Notification Rule.
  
6. Click **Save** to create the notification rule. The new rule appears in the notification rules table.

:::image type="content" source="media/how-to-create-notification-rules/notification-rules-list.png" alt-text="Screenshot that shows the list of notification rules added.":::

## Linking notification rules to tests

You can associate existing Notification Rules with specific tests or create new Notification Rules as needed. Follow the steps below.

1. For an existing test, go to the **Test** page, and click **Notifications**. A right context-pane pops up.

:::image type="content" source="media/how-to-create-notification-rules/link-notification-rule-to-test.png" alt-text="Screenshot that shows the list of notification rules associated with a test.":::

2. You can associate a test with a rule by selecting it, and remove the test from the rule by deselecting it. 
   
3. If you do not wish to select an existing Notification Rule, you can click on **Create Notification Rule**.
   
4. After making the changes, click on **Apply**.

## Edit a notification rule

1. In the Azure portal, navigate to your Load Test Resource. In the left navigation menu, select **Notifications**.

2. Select the rule you want to edit and click **Edit**.

3. Make changes to the subscribed events, channels, or test filters.

4. Save your changes.

## Delete a notification rule

1. In the Azure portal, navigate to your Load Test Resource. In the left navigation menu, select **Notifications**.

2. Select the rule to delete and click **Delete**.

## Related content

- Learn how to [schedule load test runs](./how-to-schedule-tests.md).
- Learn how to [add tests in your CI/CD workflows](./how-to-configure-load-test-cicd.md).
