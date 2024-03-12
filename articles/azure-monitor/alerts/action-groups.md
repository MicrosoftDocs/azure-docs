---
title: Azure Monitor action groups
description: Find out how to create and manage action groups. Learn about notifications and actions that action groups enable, such as email, webhooks, and Azure functions.
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/02/2023
ms.reviewer: jagummersall
ms.custom: references_regions, devx-track-arm-template, has-azure-ad-ps-ref
---

# Action groups

When Azure Monitor data indicates that there might be a problem with your infrastructure or application, an alert is triggered. Alerts can contain action groups, which are a collection of notification preferences. Azure Monitor, Azure Service Health, and Azure Advisor use action groups to notify users about the alert and take an action.

This article shows you how to create and manage action groups. 

Each action is made up of:

- **Type**: The notification that's sent or action that's performed. Examples include sending a voice call, SMS, or email. You can also trigger various types of automated actions.
- **Name**: A unique identifier within the action group.
- **Details**: The corresponding details that vary by type.

In general, an action group is a global service. Efforts to make them more available regionally are in development. 
Global requests from clients can be processed by action group services in any region. If one region of the action group service is down, the traffic is automatically routed and processed in other regions. As a global service, an action group helps provide a disaster recovery solution. Regional requests rely on availability zone redundancy to meet privacy requirements and offer a similar disaster recovery solution.

- You can add up to five action groups to an alert rule.
- Action groups are executed concurrently, in no specific order.
- Multiple alert rules can use the same action group.

## Create an action group in the Azure portal

1. Go to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Monitor**. The **Monitor** pane consolidates all your monitoring settings and data in one view.
1. Select **Alerts**, and then select **Action groups**.

    :::image type="content" source="./media/action-groups/manage-action-groups.png" alt-text="Screenshot of the Alerts page in the Azure portal with the action groups button highlighter.":::

1. Select **Create**.

    :::image type="content" source="./media/action-groups/create-action-group.png" alt-text="Screenshot that shows the Action groups page in the Azure portal. The Create button is called out.":::

1. Configure basic action group settings. In the **Project details** section:
   - Select values for **Subscription** and **Resource group**.
   - Select the region.
  
   > [!NOTE]
   > Service Health Alerts are only supported in public clouds within the global region. For Action Groups to properly function in response to a Service Health Alert the region of the action group must be set as "Global".

      | Option | Behavior |
      | ------ | -------- |
      | Global | The action groups service decides where to store the action group. The action group is persisted in at least two regions to ensure regional resiliency. Processing of actions may be done in any [geographic region](https://azure.microsoft.com/explore/global-infrastructure/geographies/#overview).<br></br>Voice, SMS, and email actions performed as the result of [service health alerts](../../service-health/alerts-activity-log-service-notifications-portal.md) are resilient to Azure live-site incidents. |
      | Regional | The action group is stored within the selected region. The action group is [zone-redundant](../../availability-zones/az-region.md#highly-available-services). Use this option if you want to ensure that the processing of your action group is performed within a specific [geographic boundary](https://azure.microsoft.com/explore/global-infrastructure/geographies/#overview). You can select one of these regions for regional processing of action groups: <br> - South Central US <br> - North Central US<br> - Sweden Central<br> - Germany West Central<br> We're continually adding more regions for regional data processing of action groups.|

    The action group is saved in the subscription, region, and resource group that you select.

1. In the **Instance details** section, enter values for **Action group name** and **Display name**. The display name is used in place of a full action group name when the group is used to send notifications.

    :::image type="content" source="./media/action-groups/action-group-1-basics.png" alt-text="Screenshot that shows the Create action group dialog. Values are visible in the Subscription, Resource group, Action group name, and Display name boxes.":::

1. Configure notifications. Select **Next: Notifications**, or select the **Notifications** tab at the top of the page.
1. Define a list of notifications to send when an alert is triggered.
1. For each notification:
    1. Select the **Notification type**, and then fill in the appropriate fields for that notification. The available options are:

        |Notification type|Description  |Fields|
        |---------|---------|---------|
        |Email Azure Resource Manager role|Send an email to the subscription members, based on their role.<br>A notification email is sent only to the primary email address configured for the Microsoft Entra user.<br>The email is only sent to Microsoft Entra ID **user** members of the selected role, not to Microsoft Entra groups or service principals.<br> See [Email](#email-azure-resource-manager).|Enter the primary email address configured for the Microsoft Entra user. See [Email](#email-azure-resource-manager).|
        |Email| Ensure that your email filtering and any malware/spam prevention services are configured appropriately. Emails are sent from the following email addresses:<br> * azure-noreply@microsoft.com<br> * azureemail-noreply@microsoft.com<br> * alerts-noreply@mail.windowsazure.com|Enter the email where the notification should be sent.|
        |SMS|SMS notifications support bi-directional communication. The SMS contains the following information:<br> * Shortname of the action group this alert was sent to<br> * The title of the alert.<br> A user can respond to an SMS to:<br> * Unsubscribe from all SMS alerts for all action groups or a single action group.<br> * Resubscribe to alerts<br> * Request help.<br> For more information about supported SMS replies, see [SMS replies](#sms-replies).|Enter the **Country code** and the **Phone number** for the SMS recipient. If you can't select your country/region code in the Azure portal, SMS isn't supported for your country/region. If your country/region code isn't available, you can vote to have your country/region added at [Share your ideas](https://feedback.azure.com/d365community/idea/e527eaa6-2025-ec11-b6e6-000d3a4f09d0). As a workaround until your country is supported, configure the action group to call a webhook to a third-party SMS provider that supports your country/region.|
        |Azure app Push notifications|Send notifications to the Azure mobile app. To enable push notifications to the Azure mobile app, provide the For more information about the Azure mobile app, see [Azure mobile app](https://azure.microsoft.com/features/azure-portal/mobile-app/).|In the **Azure account email** field, enter the email address that you use as your account ID when you configure the Azure mobile app. |
        |Voice | Voice notification.|Enter the **Country code** and the **Phone number** for the recipient of the notification. If you can't select your country/region code in the Azure portal, voice notifications aren't supported for your country/region. If your country/region code isn't available, you can vote to have your country/region added at [Share your ideas](https://feedback.azure.com/d365community/idea/e527eaa6-2025-ec11-b6e6-000d3a4f09d0). As a workaround until your country is supported, configure the action group to call a webhook to a third-party voice call provider that supports your country/region. |

    1. Select if you want to enable the **Common alert schema**. The common alert schema is a single extensible and unified alert payload that can be used across all the alert services in Azure Monitor. For more information about the common schema, see [Common alert schema](./alerts-common-schema.md).

        :::image type="content" source="./media/action-groups/action-group-2-notifications.png" alt-text="Screenshot that shows the Notifications tab of the Create action group dialog. Configuration information for an email notification is visible.":::

    1. Select **OK**.
1. Configure actions. Select **Next: Actions**. or select the **Actions** tab at the top of the page.
1. Define a list of actions to trigger when an alert is triggered. Select an action type and enter a name for each action.

    |Action type|Details  |
    |---------|---------|
    |Automation Runbook|For information about limits on Automation runbook payloads, see [Automation limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits). |
    |Event hubs |An Event Hubs action publishes notifications to Event Hubs. For more information about Event Hubs, see [Azure Event Hubs—A big data streaming platform and event ingestion service](../../event-hubs/event-hubs-about.md). You can subscribe to the alert notification stream from your event receiver.         |
    |Functions |Calls an existing HTTP trigger endpoint in functions. For more information, see [Azure Functions](../../azure-functions/functions-get-started.md).<br>When you define the function action, the function's HTTP trigger endpoint and access key are saved in the action definition, for example, `https://azfunctionurl.azurewebsites.net/api/httptrigger?code=<access_key>`. If you change the access key for the function, you must remove and re-create the function action in the action group.<br>Your endpoint must support the HTTP POST method.<br>The function must have access to the storage account. If it doesn't have access, keys aren't available and the function URI isn't accessible.<br>[Learn about restoring access to the storage account](../../azure-functions/functions-recover-storage-account.md).|
    |ITSM  |An ITSM action requires an ITSM connection. To learn how to create an ITSM connection, see [ITSM integration](./itsmc-overview.md). |
    |Logic apps     |You can use [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) to build and customize workflows for integration and to customize your alert notifications.|
    |Secure webhook|When you use a secure webhook action, you must use Microsoft Entra ID to secure the connection between your action group and your endpoint, which is a protected web API. See [Configure authentication for Secure webhook](#configure-authentication-for-secure-webhook). Secure webhook doesn't support basic authentication. If you're using basic authentication, use the Webhook action.|
    |Webhook| If you use the webhook action, your target webhook endpoint must be able to process the various JSON payloads that different alert sources emit.<br>You can't pass security certificates through a webhook action. To use basic authentication, you must pass your credentials through the URI.<br>If the webhook endpoint expects a specific schema, for example, the Microsoft Teams schema, use the **Logic Apps** action type to manipulate the alert schema to meet the target webhook's expectations.<br> For information about the rules used for retrying webhook actions, see [Webhook](#webhook).|

    :::image type="content" source="./media/action-groups/action-group-3-actions.png" alt-text="Screenshot that shows the Actions tab of the Create action group dialog. Several options are visible in the Action type list.":::
1. (Optional.) If you'd like to assign a key-value pair to the action group to categorize your Azure resources, select **Next: Tags** or the **Tags** tab. Otherwise, skip this step. 

    :::image type="content" source="./media/action-groups/action-group-4-tags.png" alt-text="Screenshot that shows the Tags tab of the Create action group dialog. Values are visible in the Name and Value boxes.":::

1. Select **Review + create** to review your settings. This step quickly checks your inputs to make sure you've entered all required information. If there are issues, they're reported here. After you've reviewed the settings, select **Create** to create the action group.

    :::image type="content" source="./media/action-groups/action-group-5-review.png" alt-text="Screenshot that shows the Review + create tab of the Create action group dialog. All configured values are visible.":::

> [!NOTE]
>
> When you configure an action to notify a person by email or SMS, they receive a confirmation that indicates they were added to the action group.

### Test an action group in the Azure portal

When you create or update an action group in the Azure portal, you can test the action group.

1.  [Create an action group in the Azure portal](#create-an-action-group-in-the-azure-portal). 

    > [!NOTE]
    > If you're editing an existing action group, save the changes to the action group before testing.

1. On the action group page, select **Test action group**.

    :::image type="content" source="./media/action-groups/test-action-group.png" alt-text="Screenshot that shows the test action group page with the Test option.":::

1. Select a sample type and the notification and action types that you want to test. Then select **Test**.

    :::image type="content" source="./media/action-groups/test-sample-action-group.png" alt-text="Screenshot that shows the Test sample action group page with an email notification type and a webhook action type.":::

1. If you close the window or select **Back to test setup** while the test is running, the test is stopped, and you don't get test results.

    :::image type="content" source="./media/action-groups/stop-running-test.png" alt-text="Screenshot that shows the Test Sample action group page. A dialog contains a Stop button and asks the user about stopping the test.":::

1. When the test is finished, a test status of either **Success** or **Failed** appears. If the test failed and you want to get more information, select **View details**.

    :::image type="content" source="./media/action-groups/test-sample-failed.png" alt-text="Screenshot that shows the Test sample action group page showing a test that failed.":::

You can use the information in the **Error details** section to understand the issue. Then you can edit, save changes, and test the action group again.

When you run a test and select a notification type, you get a message with "Test" in the subject. The tests provide a way to check that your action group works as expected before you enable it in a production environment. All the details and links in test email notifications are from a sample reference set.

### Role requirements for test action groups

The following table describes the role membership requirements that are needed for the *test actions* functionality:

| Role membership | Existing action group | Existing resource group and new action group | New resource group and new action group |
| ---------- | ------------- | ----------- | ------------- |
| Subscription contributor | Supported | Supported | Supported |
| Resource group contributor | Supported | Supported | Not applicable |
| Action group resource contributor | Supported | Not applicable | Not applicable |
| Azure Monitor contributor | Supported | Supported | Not applicable |
| Custom role | Supported | Supported | Not applicable |

 > [!NOTE]
> - If a user is not a member of the above Role Memberships with the correct permissions to generate this notification, the minimum permission required to test an action group is "**Microsoft.Insights/createNotifications/***"
> - You can run a limited number of tests per time period. To check which limits, apply to your situation, see [Azure Monitor service limits](../service-limits.md).
> - When you configure an action group in the portal, you can opt in or out of the common alert schema.
>   - To find common schema samples for all sample types, see [Common alert schema definitions for Test Action Group](./alerts-common-schema-test-action-definitions.md).
>   - To find non-common schema alert definitions, see [Non-common alert schema definitions for Test Action Group](./alerts-non-common-schema-definitions.md).

