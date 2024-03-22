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
| Custom role<sup>1</sup> | Supported | Supported | Not applicable |

<sup>1</sup> The custom role must have the **Microsoft.Insights/createNotifications/*** permission.

 > [!NOTE]
  > - If a user is not a member of the above Role Memberships with the correct permissions to generate this notification, the minimum permission required to test an action group is "**Microsoft.Insights/createNotifications/***"
  > - You can run a limited number of tests per time period. To check which limits apply to your situation, see [Azure Monitor service limits](../service-limits.md).
  > - When you configure an action group in the portal, you can opt in or out of the common alert schema.
  >     - To find common schema samples for all sample types, see [Common alert schema definitions for Test Action Group](./alerts-common-schema-test-action-definitions.md).
  >     - To find non-common schema alert definitions, see [Non-common alert schema definitions for Test Action Group](./alerts-non-common-schema-definitions.md).
## Create an action group with a Resource Manager template
You can use an [Azure Resource Manager template](../../azure-resource-manager/templates/syntax.md) to configure action groups. Using templates, you can automatically set up action groups that can be reused in certain types of alerts. These action groups ensure that all the correct parties are notified when an alert is triggered.

The basic steps are:

1. Create a template as a JSON file that describes how to create the action group.
2. Deploy the template by using [any deployment method](../../azure-resource-manager/templates/deploy-powershell.md).

### Action group Resource Manager templates

To create an action group by using a Resource Manager template, you create a resource of the type `Microsoft.Insights/actionGroups`. Then you fill in all related properties. Here are two sample templates that create an action group.

The first template describes how to create a Resource Manager template for an action group where the action definitions are hard-coded in the template. The second template describes how to create a template that takes the webhook configuration information as input parameters when the template is deployed.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "actionGroupName": {
      "type": "string",
      "metadata": {
        "description": "Unique name (within the Resource Group) for the Action group."
      }
    },
    "actionGroupShortName": {
      "type": "string",
      "metadata": {
        "description": "Short name (maximum 12 characters) for the Action group."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/actionGroups",
      "apiVersion": "2021-09-01",
      "name": "[parameters('actionGroupName')]",
      "location": "Global",
      "properties": {
        "groupShortName": "[parameters('actionGroupShortName')]",
        "enabled": true,
        "smsReceivers": [
          {
            "name": "contosoSMS",
            "countryCode": "1",
            "phoneNumber": "5555551212"
          },
          {
            "name": "contosoSMS2",
            "countryCode": "1",
            "phoneNumber": "5555552121"
          }
        ],
        "emailReceivers": [
          {
            "name": "contosoEmail",
            "emailAddress": "devops@contoso.com",
            "useCommonAlertSchema": true

          },
          {
            "name": "contosoEmail2",
            "emailAddress": "devops2@contoso.com",
            "useCommonAlertSchema": true
          }
        ],
        "webhookReceivers": [
          {
            "name": "contosoHook",
            "serviceUri": "http://requestb.in/1bq62iu1",
            "useCommonAlertSchema": true
          },
          {
            "name": "contosoHook2",
            "serviceUri": "http://requestb.in/1bq62iu2",
            "useCommonAlertSchema": true
          }
        ],
         "SecurewebhookReceivers": [
          {
            "name": "contososecureHook",
            "serviceUri": "http://requestb.in/1bq63iu1",
            "useCommonAlertSchema": false
          },
          {
            "name": "contososecureHook2",
            "serviceUri": "http://requestb.in/1bq63iu2",
            "useCommonAlertSchema": false
          }
        ],
        "eventHubReceivers": [
          {
            "name": "contosoeventhub1",
            "subscriptionId": "replace with subscription id GUID",
            "eventHubNameSpace": "contosoeventHubNameSpace",
            "eventHubName": "contosoeventHub",
            "useCommonAlertSchema": true
          }
        ]
      }
    }
  ],
  "outputs":{
      "actionGroupId":{
          "type":"string",
          "value":"[resourceId('Microsoft.Insights/actionGroups',parameters('actionGroupName'))]"
      }
  }
}
```

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "actionGroupName": {
      "type": "string",
      "metadata": {
        "description": "Unique name (within the Resource Group) for the Action group."
      }
    },
    "actionGroupShortName": {
      "type": "string",
      "metadata": {
        "description": "Short name (maximum 12 characters) for the Action group."
      }
    },
    "webhookReceiverName": {
      "type": "string",
      "metadata": {
        "description": "Webhook receiver service Name."
      }
    },    
    "webhookServiceUri": {
      "type": "string",
      "metadata": {
        "description": "Webhook receiver service URI."
      }
    }    
  },
  "resources": [
    {
      "type": "Microsoft.Insights/actionGroups",
      "apiVersion": "2021-09-01",
      "name": "[parameters('actionGroupName')]",
      "location": "Global",
      "properties": {
        "groupShortName": "[parameters('actionGroupShortName')]",
        "enabled": true,
        "smsReceivers": [
        ],
        "emailReceivers": [
        ],
        "webhookReceivers": [
          {
            "name": "[parameters('webhookReceiverName')]",
            "serviceUri": "[parameters('webhookServiceUri')]",
            "useCommonAlertSchema": true
          }
        ]
      }
    }
  ],
  "outputs":{
      "actionGroupResourceId":{
          "type":"string",
          "value":"[resourceId('Microsoft.Insights/actionGroups',parameters('actionGroupName'))]"
      }
  }
}
```
## Manage action groups

After you create an action group, you can view it in the portal:

1. Go to the [Azure portal](https://portal.azure.com).
1. From the **Monitor** page, select **Alerts**.
1. Select **Action groups**.
1. Select the action group that you want to manage. You can:

   - Add, edit, or remove actions.
   - Delete the action group.

## Service limits for notifications

A phone number or email can be included in action groups in many subscriptions. Azure Monitor uses rate limiting to suspend notifications when too many notifications are sent to a particular phone number, email address or device. Rate limiting ensures that alerts are manageable and actionable.

Rate limiting applies to SMS, voice, and email notifications. All other notification actions aren't rate limited. For information about rate limits, see [Azure Monitor service limits](../service-limits.md).

Rate limiting applies across all subscriptions. Rate limiting is applied as soon as the threshold is reached, even if messages are sent from multiple subscriptions.

When an email address is rate limited, a notification is sent to communicate that rate limiting was applied and when the rate limiting expires.

## Email Azure Resource Manager

When you use Azure Resource Manager for email notifications, you can send email to the members of a subscription's role. Email is only sent to Microsoft Entra ID **user** members of the role. Email isn't sent to Microsoft Entra groups or service principals.

A notification email is sent only to the primary email address.

If your primary email doesn't receive notifications, configure the email address for the Email Azure Resource Manager role:

1. In the Azure portal, go to **Microsoft Entra ID**.
1. On the left, select **All users**. On the right, a list of users appears.
1. Select the user whose *primary email* you want to review.

   :::image type="content" source="media/action-groups/active-directory-user-profile.png" alt-text="Screenshot that shows the Azure portal All users page. Information about one user is visible but is indecipherable." border="true":::

1. In the user profile, look under **Contact info** for an **Email** value. If it's blank:

   1. At the top of the page, select **Edit**.
   1. Enter an email address.
   1. At the top of the page, select **Save**.

   :::image type="content" source="media/action-groups/active-directory-add-primary-email.png" alt-text="Screenshot that shows a user profile page in the Azure portal. The Edit button and the Email box are called out." border="true":::

You may have a limited number of email actions per action group. To check which limits apply to your situation, see [Azure Monitor service limits](../service-limits.md).

When you set up the Resource Manager role:

1. Assign an entity of type **User** to the role.
1. Make the assignment at the **subscription** level.
1. Make sure an email address is configured for the user in their **Microsoft Entra profile**.
> - If a user is not a member of the above Role Memberships with the correct permissions to generate this notification, the minimum permission required to test an action group is "**Microsoft.Insights/createNotifications/***"
> - You can run a limited number of tests per time period. To check which limits, apply to your situation, see [Azure Monitor service limits](../service-limits.md).
> - When you configure an action group in the portal, you can opt in or out of the common alert schema.
>   - To find common schema samples for all sample types, see [Common alert schema definitions for Test Action Group](./alerts-common-schema-test-action-definitions.md).
>   - To find non-common schema alert definitions, see [Non-common alert schema definitions for Test Action Group](./alerts-non-common-schema-definitions.md).
> [!NOTE]
>
> It can take up to 24 hours for a customer to start receiving notifications after they add a new Azure Resource Manager role to their subscription.
## SMS

For information about rate limits, see [Rate limiting for voice, SMS, emails, Azure App Service push notifications, and webhook posts](./alerts-rate-limiting.md).

For important information about using SMS notifications in action groups, see [SMS alert behavior in action groups](./alerts-sms-behavior.md).

You might have a limited number of SMS actions per action group.

> [!NOTE]
>
> If you can't select your country/region code in the Azure portal, SMS isn't supported for your country/region. If your country/region code isn't available, you can vote to have your country/region added at [Share your ideas](https://feedback.azure.com/d365community/idea/e527eaa6-2025-ec11-b6e6-000d3a4f09d0). In the meantime, as a workaround, configure your action group to call a webhook to a third-party SMS provider that offers support in your country/region.
### SMS replies

These replies are supported for SMS notifications. The recipient of the SMS can reply to the SMS with these values:

| REPLY | Description |
| ----- | ----------- |
| DISABLE `<Action Group Short name>` | Disables further SMS from the Action Group |
| ENABLE `<Action Group Short name>` | Re-enables SMS from the Action Group |
| STOP | Disables further SMS from all Action Groups |
| START | Re-enables SMS from ALL Action Groups |
| HELP | A response is sent to the user with a link to this article. |

>[!NOTE]
>If a user has unsubscribed from SMS alerts, but is then added to a new action group; they WILL receive SMS alerts for that new action group, but remain unsubscribed from all previous action groups.
You might have a limited number of Azure app actions per action group.
### Countries/Regions with SMS notification support

| Country code | Country |
|:---|:---|
| 61 | Australia |
| 43 | Austria |
| 32 | Belgium |
| 55 | Brazil |
| 1    |Canada |
| 56 | Chile |
| 86 | China |
| 420 | Czech Republic |
| 45 | Denmark |
| 372 | Estonia |
| 358 | Finland |
| 33 | France |
| 49 | Germany |
| 852 | Hong Kong Special Administrative Region|
| 91 | India |
| 353 | Ireland |
| 972 | Israel |
| 39 | Italy |
| 81 | Japan |
| 352 | Luxembourg |
| 60 | Malaysia |
| 52 | Mexico |
| 31 | Netherlands |
| 64 | New Zealand |
| 47 | Norway |
| 351 | Portugal |
| 1 | Puerto Rico |
| 40 | Romania |
| 7  | Russia  |
| 65 | Singapore |
| 27 | South Africa |
| 82 | South Korea |
| 34 | Spain |
| 41 | Switzerland |
| 886 | Taiwan |
| 971 | UAE    |
| 44 | United Kingdom |
| 1 | United States |

## Voice

For important information about rate limits, see [Rate limiting for voice, SMS, emails, Azure App Service push notifications, and webhook posts](./alerts-rate-limiting.md).

You might have a limited number of voice actions per action group.

> [!NOTE]
>
> If you can't select your country/region code in the Azure portal, voice calls aren't supported for your country/region. If your country/region code isn't available, you can vote to have your country/region added at [Share your ideas](https://feedback.azure.com/d365community/idea/e527eaa6-2025-ec11-b6e6-000d3a4f09d0). In the meantime, as a workaround, configure your action group to call a webhook to a third-party voice call provider that offers support in your country/region.
### Countries/Regions with Voice notification support
| Country code | Country |
|:---|:---|
| 61 | Australia |
| 43 | Austria |
| 32 | Belgium |
| 55 | Brazil |
| 1    |Canada |
| 56 | Chile |
| 420 | Czech Republic |
| 45 | Denmark |
| 358 | Finland |
| 353 | Ireland |
| 972 | Israel |
| 352 | Luxembourg |
| 60 | Malaysia |
| 52 | Mexico |
| 31 | Netherlands |
| 64 | New Zealand |
| 47 | Norway |
| 351 | Portugal |
| 65 | Singapore |
| 27 | South Africa |
| 46 | Sweeden |
| 44 | United Kingdom |
| 1 | United States |

For information about pricing for supported countries/regions, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).
## Webhook

> [!NOTE]
>
> If you use the webhook action, your target webhook endpoint must be able to process the various JSON payloads that different alert sources emit. You can't pass security certificates through a webhook action. To use basic authentication, you must pass your credentials through the URI. If the webhook endpoint expects a specific schema, for example, the Microsoft Teams schema, use the Logic Apps action to transform the alert schema to meet the target webhook's expectations.
Webhook action groups generally follow these rules when called:
- When a webhook is invoked, if the first call fails, it is retried at least 1 more time, and up to 5 times (5 retries) at various delay intervals (5, 20, 40 seconds).
    - The delay between 1st and 2nd attempt is 5 seconds
    - The delay between 2nd and 3rd attempt is 20 seconds
    - The delay between 3rd and 4th attempt is 5 seconds
    - The delay between 4th and 5th attempt is 40 seconds
    - The delay between 5th and 6th attempt is 5 seconds
- After retries attempted to call the webhook fail, no action group calls the endpoint for 15 minutes.
- The retry logic assumes that the call can be retried. The status codes: 408, 429, 503, 504, or HttpRequestException, WebException, `TaskCancellationException` allow for the call to be retried”.

### Configure authentication for Secure webhook

The secure webhook action authenticates to the protected API by using a Service Principal instance in the Microsoft Entra tenant of the "AZNS Microsoft Entra Webhook" Microsoft Entra application. To make the action group work, this Microsoft Entra Webhook Service Principal must be added as a member of a role on the target Microsoft Entra application that grants access to the target endpoint.

For an overview of Microsoft Entra applications and service principals, see [Microsoft identity platform (v2.0) overview](../../active-directory/develop/v2-overview.md). Follow these steps to take advantage of the secure webhook functionality.

> [!NOTE]
>
> Basic authentication isn't supported for `SecureWebhook`. To use basic authentication, you must use `Webhook`.
If you use the webhook action, your target webhook endpoint must be able to process the various JSON payloads that different alert sources emit. If the webhook endpoint expects a specific schema, for example, the Microsoft Teams schema, use the Logic Apps action to transform the alert schema to meet the target webhook's expectations.

1. Create a Microsoft Entra application for your protected web API. For more information, see [Protected web API: App registration](../../active-directory/develop/scenario-protected-web-api-app-registration.md). Configure your protected API to be called by a daemon app and expose application permissions, not delegated permissions. For more information about these permissions, see [If your web API is called by a service or daemon app](../../active-directory/develop/scenario-protected-web-api-app-registration.md#if-your-web-api-is-called-by-a-service-or-daemon-app).

   > [!NOTE]
   >
   > Configure your protected web API to accept V2.0 access tokens. For more information about this setting, see [Microsoft Entra app manifest](../../active-directory/develop/reference-app-manifest.md#accesstokenacceptedversion-attribute).
1. To enable the action group to use your Microsoft Entra application, use the PowerShell script that follows this procedure.

   > [!NOTE]
   >
   > You must be assigned the [Microsoft Entra Application Administrator role](../../active-directory/roles/permissions-reference.md#all-roles) to run this script.
   1. Modify the PowerShell script's `Connect-AzureAD` call to use your Microsoft Entra tenant ID.
   1. Modify the PowerShell script's `$myAzureADApplicationObjectId` variable to use the object ID of your Microsoft Entra application.
   1. Run the modified script.

   > [!NOTE]
   >
   > The service principal must be assigned an **owner role** of the Microsoft Entra application to be able to create or modify the secure webhook action in the action group.
1. Configure the secure webhook action.

   1. Copy the `$myApp.ObjectId` value that's in the script.
   1. In the webhook action definition, in the **Object Id** box, enter the value that you copied.

   :::image type="content" source="./media/action-groups/action-groups-secure-webhook.png" alt-text="Screenshot that shows the Secured Webhook dialog in the Azure portal with the Object ID box." border="true":::

### Secure webhook PowerShell script

```PowerShell
Connect-AzureAD -TenantId "<provide your Azure AD tenant ID here>"
# Define your Azure AD application's ObjectId.
$myAzureADApplicationObjectId = "<the Object ID of your Azure AD Application>"
# Define the action group Azure AD AppId.
$actionGroupsAppId = "461e8683-5575-4561-ac7f-899cc907d62a"
# Define the name of the new role that gets added to your Azure AD application.
$actionGroupRoleName = "ActionGroupsSecureWebhook"
# Create an application role with the given name and description.
Function CreateAppRole([string] $Name, [string] $Description)
{
    $appRole = New-Object Microsoft.Open.AzureAD.Model.AppRole
    $appRole.AllowedMemberTypes = New-Object System.Collections.Generic.List[string]
    $appRole.AllowedMemberTypes.Add("Application");
    $appRole.DisplayName = $Name
    $appRole.Id = New-Guid
    $appRole.IsEnabled = $true
    $appRole.Description = $Description
    $appRole.Value = $Name;
    return $appRole
}
# Get your Azure AD application, its roles, and its service principal.
$myApp = Get-AzureADApplication -ObjectId $myAzureADApplicationObjectId
$myAppRoles = $myApp.AppRoles
$actionGroupsSP = Get-AzureADServicePrincipal -Filter ("appId eq '" + $actionGroupsAppId + "'")
Write-Host "App Roles before addition of new role.."
Write-Host $myAppRoles
# Create the role if it doesn't exist.
if ($myAppRoles -match "ActionGroupsSecureWebhook")
{
    Write-Host "The Action Group role is already defined.`n"
}
else
{
    $myServicePrincipal = Get-AzureADServicePrincipal -Filter ("appId eq '" + $myApp.AppId + "'")
    # Add the new role to the Azure AD application.
    $newRole = CreateAppRole -Name $actionGroupRoleName -Description "This is a role for Action Group to join"
    $myAppRoles.Add($newRole)
    Set-AzureADApplication -ObjectId $myApp.ObjectId -AppRoles $myAppRoles
}
# Create the service principal if it doesn't exist.
if ($actionGroupsSP -match "AzNS AAD Webhook")
{
    Write-Host "The Service principal is already defined.`n"
}
else
{
    # Create a service principal for the action group Azure AD application and add it to the role.
    $actionGroupsSP = New-AzureADServicePrincipal -AppId $actionGroupsAppId
}
New-AzureADServiceAppRoleAssignment -Id $myApp.AppRoles[0].Id -ResourceId $myServicePrincipal.ObjectId -ObjectId $actionGroupsSP.ObjectId -PrincipalId $actionGroupsSP.ObjectId
Write-Host "My Azure AD Application (ObjectId): " + $myApp.ObjectId
Write-Host "My Azure AD Application's Roles"
Write-Host $myApp.AppRoles
```
### Migrate Runbook action from "Run as account" to "Run as Managed Identity"  
> [!NOTE]
>
> Azure Automation "Run as account" has [retired](https://azure.microsoft.com/updates/azure-automation-runas-account-retiring-on-30-september-2023/) on 30 September 2023, which affects actions created with action type "Automation Runbook". Existing actions linking to "Run as account" runbooks won't be supported after retirement. However, those runbooks would continue to execute until the expiry of "Run as" certificate of the Automation account.
To ensure you can continue using the runbook actions, you need to:
1.  Edit the action group by adding a new action with action type "Automation Runbook" and choose the same runbook from the dropdown. (All 5 runbooks in the dropdown have been reconfigured at the backend to authenticate using Managed Identity instead of Run as account. System-assigned Managed Identity in Automation account would be enabled with VM Contributor role at the subscription level would be assigned automatically.)

    :::image type="content" source="./media/action-groups/action-group-runbook-add.png" alt-text="Screenshot of adding a runbook action to an action group.":::

    :::image type="content" source="./media/action-groups/action-group-runbook-configure.png" alt-text="Screenshot of configuring the runbook action.":::

2. Delete old runbook action which links to a "Run as account" runbook.
3. Save the action group.

## Next steps

- Get an [overview of alerts](./alerts-overview.md) and learn how to receive alerts.
- Learn more about the [ITSM Connector](./itsmc-overview.md).
- Learn about the [activity log alert webhook schema](./activity-log-alerts-webhook.md).
