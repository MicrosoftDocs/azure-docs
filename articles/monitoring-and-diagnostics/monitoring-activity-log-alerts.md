---
title: Create activity log alerts | Microsoft Docs
description: Be notified via SMS, webhook, and email when certain events occur in the activity log.
author: johnkemnetz
manager: orenr
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid:
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/03/2017
ms.author: johnkem

---
# Create activity log alerts

## Overview
Activity log alerts are alerts that activate when a new activity log event occurs that matches the conditions specified in the alert. They are Azure resources, so they can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal. This article introduces the concepts behind activity log alerts. It then shows you how to use the Azure portal to set up an alert on activity log events.

Typically, you create activity log alerts to receive notifications when:

* Specific changes occur on resources in your Azure subscription, often scoped to particular resource groups or resources. For example, you might want to be notified when any virtual machine in myProductionResourceGroup is deleted. Or, you might want to be notified if any new roles are assigned to a user in your subscription.
* A service health event occurs. Service health events include notification of incidents and maintenance events that apply to resources in your subscription.

In either case, an activity log alert monitors only for events in the subscription in which the alert is created.

You can configure an activity log alert based on any top-level property in the JSON object for an activity log event. However, the portal shows the most common options:

- **Category**: Administrative, Service Health, Autoscale, and Recommendation. For more information, see [Overview of the Azure activity log](./monitoring-overview-activity-logs.md#categories-in-the-activity-log). To learn more about service health events, see [Receive activity log alerts on service notifications](./monitoring-activity-log-alerts-on-service-notifications.md).
- **Resource group**
- **Resource**
- **Resource type**
- **Operation name**: The Resource Manager Role-Based Access Control operation name.
- **Level**: The severity level of the event (Verbose, Informational, Warning, Error, or Critical).
- **Status**: The status of the event, typically Started, Failed, or Succeeded.
- **Event initiated by**: Also known as the "caller." The email address or Azure Active Directory identifier of the user who performed the operation.

>[!NOTE]
>You must specify at least two of the preceding criteria in your alert, with one being the category. You may not create an alert that activates every time an event is created in the activity logs.
>
>

When an activity log alert is activated, it uses an action group to generate actions or notifications. An action group is a reusable set of notification receivers, such as email addresses, webhook URLs, or SMS phone numbers. The receivers can be referenced from multiple alerts to centralize and group your notification channels. When you define your activity log alert, you have two options. You can:

* Use an existing action group in your activity log alert. 
* Create a new action group. 

To learn more about action groups, see [Create and manage action groups in the Azure portal](monitoring-action-groups.md).

To learn more about service health notifications, see [Receive activity log alerts on service health notifications](monitoring-activity-log-alerts-on-service-notifications.md).

## Create an alert on an activity log event with a new action group by using the Azure portal
1. In the [portal](https://portal.azure.com), select **Monitor**.

    ![The "Monitor" service](./media/monitoring-activity-log-alerts/home-monitor.png)
2. In the **Activity log** section, select **Alerts**.

    ![The "Alerts" tab](./media/monitoring-activity-log-alerts/alerts-blades.png)
3. Select **Add activity log alert**, and fill in the fields.

4. Enter a name in the **Activity log alert name** box, and select a **Description**.

    ![The "Add activity log alert" command](./media/monitoring-activity-log-alerts/add-activity-log-alert.png)

5. The **Subscription** box autofills with your current subscription. This subscription is the one in which the action group is saved. The alert resource is deployed to this subscription and monitors activity log events from it.

    ![The "Add activity log alert" dialog box](./media/monitoring-activity-log-alerts/activity-log-alert-new-action-group.png)

6. Select the **Resource group** in which the alert resource is created. This is not the resource group that's monitored by the alert. Instead, it's the resource group where the alert resource is located.

7. Optionally, select an **Event category** to modify the additional filters that are shown. For Administrative events, the filters include **Resource group**, **Resource**, **Resource type**, **Operation name**, **Level**, **Status**, and **Event initiated by**. These values identify which events this alert should monitor.

    >[!NOTE]
    >You must specify at least one of the preceding criteria in your alert. You may not create an alert that activates every time an event is created in the activity logs.
    >
    >

8. Enter a name in the **Action group name** box, and enter a name in the **Short name** box. The short name is used in place of a full action group name when notifications are sent using this group.

9.	Define a list of actions by providing the action’s:

    a. **Name**: Enter the action’s name, alias, or identifier.

    b. **Action Type**: Select SMS, email, or webhook.

    c. **Details**: Based on the action type, enter a phone number, email address, or webhook URI.

10.	Select **OK** to create the alert.

The alert takes a few minutes to fully propagate and then become active. It triggers when new events match the alert's criteria.

For more information, see [Understand the webhook schema used in activity log alerts](monitoring-activity-log-alerts-webhook.md).

>[!NOTE]
>The action group defined in these steps is reusable as an existing action group for all future alert definitions.
>
>

## Create an alert on an activity log event for an existing action group by using the Azure portal
1. Follow steps 1 through 7 in the previous section to create your activity log alert.

2. Under **Notify via**, select the **Existing** action group button. Select an existing action group from the list.

3. Select **OK** to create the alert.

The alert takes a few minutes to fully propagate and then become active. It triggers when new events match the alert's criteria.

## Manage your alerts

After you create an alert, it's visible in the Alerts section of the Monitor blade. Select the alert you want to manage to:

* Edit it.
* Delete it.
* Disable or enable it, if you want to temporarily stop or resume receiving notifications for the alert.

## Next steps
- Get an [overview of alerts](monitoring-overview-alerts.md).
- Learn about [notification rate limiting](monitoring-alerts-rate-limiting.md).
- Review the [activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md).
- Learn more about [action groups](monitoring-action-groups.md).  
- Learn about [service health notifications](monitoring-service-notifications.md).
- Create an [activity log alert to monitor all autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert).
- Create an [activity log alert to monitor all failed autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert).
