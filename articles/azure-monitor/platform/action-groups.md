---
title: Create and manage action groups in the Azure portal
description: Learn how to create and manage action groups in the Azure portal.
author: dkamstra
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 5/30/2019
ms.author: dukek
ms.subservice: alerts
---
# Create and manage action groups in the Azure portal
## Overview ##
An action group is a collection of notification preferences defined by the owner of an Azure subscription. Azure Monitor and Service Health alerts use action groups to notify users that an alert has been triggered. Various alerts may use the same action group or different action groups depending on the user's requirements. You may configure up to 2,000 action groups in a subscription.

You configure an action to notify a person by email or SMS, they receive a confirmation indicating they have been added to the action group.

This article shows you how to create and manage action groups in the Azure portal.

Each action is made up of the following properties:

* **Name**: A unique identifier within the action group.  
* **Action type**: The action performed. Examples include sending a voice call, SMS, email; or triggering various types of automated actions. See types later in this article.
* **Details**: The corresponding details that vary by *action type*.

For information on how to use Azure Resource Manager templates to configure action groups, see [Action group Resource Manager templates](../../azure-monitor/platform/action-groups-create-resource-manager-template.md).

## Create an action group by using the Azure portal ##
1. In the [portal](https://portal.azure.com), select **Monitor**. The **Monitor** pane consolidates all your monitoring settings and data in one view.

    ![The "Monitor" service](./media/action-groups/home-monitor.png)
1. Select **Alerts** then select **Manage actions**.

    ![Manage Actions button](./media/action-groups/manage-action-groups.png)
1. Select **Add action group**, and fill in the fields.

    ![The "Add action group" command](./media/action-groups/add-action-group.png)
1. Enter a name in the **Action group name** box, and enter a name in the **Short name** box. The short name is used in place of a full action group name when notifications are sent using this group.

      ![The Add action group" dialog box](./media/action-groups/action-group-define.png)

1. The **Subscription** box autofills with your current subscription. This subscription is the one in which the action group is saved.

1. Select the **Resource group** in which the action group is saved.

1. Define a list of actions. Provide the following for each action:

    a. **Name**: Enter a unique identifier for this action.

    b. **Action Type**: Select Email/SMS/Push/Voice, Logic App, Webhook, ITSM, or Automation Runbook.

    c. **Details**: Based on the action type, enter a phone number, email address, webhook URI, Azure app, ITSM connection, or Automation runbook. For ITSM Action, additionally specify **Work Item** and other fields your ITSM tool requires.

1. Select **OK** to create the action group.

## Manage your action groups ##
After you create an action group, it's visible in the **Action groups** section of the **Monitor** pane. Select the action group you want to manage to:

* Add, edit, or remove actions.
* Delete the action group.

## Action specific information
> [!NOTE]
> See [Subscription Service Limits for Monitoring](https://docs.microsoft.com/azure/azure-subscription-service-limits#monitor-limits) for numeric limits on each of the items below.  

**Azure app Push** - You may have a limited number of Azure app actions in an Action Group.

**Email** - Emails will be sent from the following email addresses. Ensure that your email filtering is configured appropriately
- azure-noreply@microsoft.com
- azureemail-noreply@microsoft.com
- alerts-noreply@mail.windowsazure.com

You may have a limited number of email actions in an Action Group. See the [rate limiting information](./../../azure-monitor/platform/alerts-rate-limiting.md) article

**ITSM** - You may have a limited number of ITSM actions in an Action Group. ITSM Action requires an ITSM Connection. Learn how to create an [ITSM Connection](../../azure-monitor/platform/itsmc-overview.md).

**Logic App** - You may have a limited number of Logic App actions in an Action Group.

**Function App** - The function keys for Function Apps configured as actions are read through the Functions API, which currently requires v2 function apps to configure the app setting “AzureWebJobsSecretStorageType” to “files”. For more information, see [Changes to Key Management in Functions V2]( https://aka.ms/funcsecrets).

**Runbook** - You may have a limited number of Runbook actions in an Action Group. Refer to the [Azure subscription service limits](../../azure-subscription-service-limits.md) for limits on Runbook payloads.

**SMS** - You may have a limited number of SMS actions in an Action Group. Also see the [rate limiting information](./../../azure-monitor/platform/alerts-rate-limiting.md) and [SMS alert behavior](../../azure-monitor/platform/alerts-sms-behavior.md) for additional important information. 

**Voice** - You may have a limited number of Voice actions in an Action Group. See the [rate limiting information](./../../azure-monitor/platform/alerts-rate-limiting.md) article.

**Webhook** - You may have a limited number of Webhook actions in an Action Group. Webhooks are retried using the following rules. The webhook call is retried a maximum of 2 times when the following HTTP status codes are returned: 408, 429, 503, 504 or the HTTP endpoint does not respond. The first retry happens after 10 seconds. The second retry happens after 100 seconds. After two failures, no action group will call the endpoint for 30 minutes. 

Source IP address ranges
 - 13.72.19.232
 - 13.106.57.181
 - 13.106.54.3
 - 13.106.54.19
 - 13.106.38.142
 - 13.106.38.148
 - 13.106.57.196
 - 52.244.68.117
 - 52.244.65.137
 - 52.183.31.0
 - 52.184.145.166
 - 51.4.138.199
 - 51.5.148.86
 - 51.5.149.19

To receive updates about changes to these IP addresses, we recommend you configure a Service Health alert, which monitors for Informational notifications about the Action Groups service.

## Next steps ##
* Learn more about [SMS alert behavior](../../azure-monitor/platform/alerts-sms-behavior.md).  
* Gain an [understanding of the activity log alert webhook schema](../../azure-monitor/platform/activity-log-alerts-webhook.md).  
* Learn more about [ITSM Connector](../../azure-monitor/platform/itsmc-overview.md)
* Learn more about [rate limiting](../../azure-monitor/platform/alerts-rate-limiting.md) on alerts.
* Get an [overview of activity log alerts](../../azure-monitor/platform/alerts-overview.md), and learn how to receive alerts.  
* Learn how to [configure alerts whenever a service health notification is posted](../../azure-monitor/platform/alerts-activity-log-service-notifications.md).
