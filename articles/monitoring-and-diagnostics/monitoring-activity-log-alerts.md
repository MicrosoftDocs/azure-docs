---
title: Create Activity Log Alerts | Microsoft Docs
description: Be notified via SMS, webhook, and email when certain events occur in the Activity log.
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
# Create Activity Log Alerts

## Overview
Activity Log Alerts are alerts that activate when a new Activity Log event occurs that matches the conditions specified in the alert. They are Azure resources, so they can be created using a Resource Manager template and created, update, or deleted in the Azure portal. This article introduces the concepts behind Activity Log alerts and then shows you how to use the Azure portal to set up an alert on Activity Log events.

Activity Log alerts are typically created for one of two purposes:
1. To receive a notification when specific changes occur on resources in your Azure subscription, often scoped to particular resource groups or resources. For example, you may want to be notified when any Virtual Machine in myProductionResourceGroup is deleted. Or, you may want to be notified if any new roles are assigned to a user in your subscription.
2. To receive a notification when a Service Health event occurs. Service Health events include notification of incidents and maintenance events that apply to resources in your subscription.

In either case, the Activity Log alert will only monitor for events in the subscription in which the alert is created.

You can configure an Activity Log alert based on any top-level property in the JSON object for an Activity Log event, however the portal shows the most common options:
- **Category** - one of Administrative, Service Health, Autoscale, Recommendation. [See this article for information on Activity Log categories](./monitoring-overview-activity-logs.md#categories-in-the-activity-log) and [for more information on service health events click here](monitoring-activity-log-alerts-on-service-notifications.md))
- **Resource Group**
- **Resource**
- **Resource Type**
- **Operation name** - the Resource Manager RBAC operation name.
- **Level** - the severity level of the event (Verbose, Informational, Warning, Error, Critical)
- **Status** - the status of the event, typically "Started," "Failed," or "Succeeded"
- **Event initiated by** - Also known as the "caller." The email address or Active Directory identifier of the user who performed the operation.

>[!NOTE]
>You must specify at least two of the above criteria in your alert, with one being the category. You may not create an alert that activates every time an event is created in the Activity Logs.
>
>

When an Activity Log alert becomes activated, it uses an Action Group to generate actions or notifications. An Action Group is a reusable set of notification receivers (email addresses, webhook URLs, or SMS phone numbers) that can be referenced from multiple alerts to centralize and group your notification channels. You can either use an existing Action Group in your Activity Log alert, or create a new Action Group while defining your Activity Log alert. You can learn more about [Action Groups here](monitoring-action-groups.md)

You can learn more about Activity Log Alerts for service health notifications [here](monitoring-activity-log-alerts-on-service-notifications.md)

## Create an alert on an activity log event with a new action group with the Azure Portal
1.	In the [portal](https://portal.azure.com), navigate to the **Monitor** blade.

    ![Monitor](./media/monitoring-activity-log-alerts/home-monitor.png)
2.	Click the **Monitor** option to open the Monitor blade. It first opens to the **Activity log** blade.

3.	Now click on the **Alerts** blade.

    ![Alerts](./media/monitoring-activity-log-alerts/alerts-blades.png)
4.	Select the **Add activity log alert** command and fill in the fields.

5.	**Name** your activity log alert, and choose a **Description**.

    ![Add-Alert](./media/monitoring-activity-log-alerts/add-activity-log-alert.png)

6.	The **Subscription** selected is the one the Activity log alert is saved in. It is auto-filled to the subscription you are currently working in. This is the subscription the alert resource is deployed to and monitors Activity Log events from.

    ![Add-Alert-New-Action-Group](./media/monitoring-activity-log-alerts/activity-log-alert-new-action-group.png)

7.	Choose the **Resource Group** in which this alert resource will be created. Note that this is not the resource group that will be monitored *by* the alert, but rather the resource group where the *alert resource itself will be deployed.*

8.	Optionally select an **Event Category**, which modifies the set of additional filters shown. For Administrative events, this  includes options to filter by **Resource Group**, **Resource**, **Resource Type**, **Operation Name**, **Level**, **Status** and **Event intiated by** values to identify which events this alert should monitor.

>[!NOTE]
>You must specify at least one of the above criteria in your alert. You may not create an alert that activates every time an event is created in the Activity Logs.
>
>

9.	Create a **New** Action Group by giving it **Name** and **Short Name**; the short name will be referenced in the notifications sent when this alert is activated.

10.	Then, define a list of actions by providing the action’s

    a. **Name:** Action’s name, alias or identifier.

    b. **Action Type:** Choose the action type: SMS, Email, or Webhook

    c. **Details:** Based on the action type chosen, provide a phone number, email address or webhook URI.

11.	Select **OK** when done to create the alert.

The alert will take a few minutes to fully propagate, after which time it will become active and trigger when new events match the alert's criteria.

For details on the webhook schema for Activity Log alerts [click here](monitoring-activity-log-alerts-webhook.md)

>[!NOTE]
>The action group defined in these steps will be reusable, as an existing action group, for all future alert definition.
>
>

## Create an alert on an Activity Log event for an existing action group with the Azure Portal
1.	In the [portal](https://portal.azure.com), navigate to the **Monitor** blade.

    ![Monitor](./media/monitoring-activity-log-alerts/home-monitor.png)
2.	Click the **Monitor** option to open the Monitor blade. It first opens to the **Activity log** section.

3.	Now click on the **Alerts** section.

    ![Alerts](./media/monitoring-activity-log-alerts/alerts-blades.png)
4.	Select the **Add activity log alert** command and fill in the fields.

5.	**Name** your Activity Log alert, and choose a **Description**. These appear in the notifications sent when this alert fires.

    ![Add-Alert](./media/monitoring-activity-log-alerts/add-activity-log-alert.png)
6.	The **Subscription** selected is the one the Activity log alert is saved in. It is auto-filled to the subscription you are currently working in. This is the subscription the alert resource is deployed to and monitors Activity Log events from.

    ![Add-Alert-Existing-Action-Group](./media/monitoring-activity-log-alerts/activity-log-alert-existing-action-group.png)
7.	Choose the **Resource Group** in which this alert resource will be created. Note that this is not the resource group that will be monitored *by* the alert, but rather the resource group where the *alert resource itself will be deployed.*

8.	Optionally select an **Event Category**, which modifies the set of additional filters shown. For Administrative events, this  includes options to filter by **Resource Group**, **Resource**, **Resource Type**, **Operation Name**, **Level**, **Status** and **Event intiated by** values to identify which events this alert should monitor.

9.	Choose to **Notify Via** an **Existing action group**. Select an existing Action Group from the list.

10.	Select **OK** when done to create the alert.

The alert will take a few minutes to fully propagate, after which time it will become active and trigger when new events match the alert's criteria.

## Managing your alerts

Once you have created an alert, it is visible in the Alerts section of the Monitor blade. Select the alert you wish to manage and you can:
* **Edit** it.
* **Delete** it.
* **Disable** or **Enable** it if you want to temporarily stop of resume receiving notifications for the alert.

## Next Steps
- Get an [overview of alerts](monitoring-overview-alerts.md)
- Learn about [notification rate limiting](monitoring-alerts-rate-limiting.md)
- Review the [activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md)
- Learn more about [action groups](monitoring-action-groups.md)  
- Learn about [Service Health Notifications](monitoring-service-notifications.md)
- [Create an Activity Log Alert to monitor all autoscale engine operations on your subscription.](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed autoscale scale in/scale out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert)
