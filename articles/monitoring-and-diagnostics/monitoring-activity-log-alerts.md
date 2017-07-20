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
ms.date: 07/06/2017
ms.author: johnkem

---
# Create Activity Log Alerts

## Overview
Activity Log Alerts are alerts that activate when a new Activity Log event matches the conditions specified in the alert. They are Azure resources so they can be managed using the Azure portal or the Azure Resource Manager (ARM). This article shows you how to use the Azure portal to set up alerts on activity log events.

You can receive alerts about operations that were performed on resources in your subscription or about service health events that may impact the health of your resources. An Activity Log Alert monitors the activity log events for the specific subscription the alert is deployed to.

You can configure the alert based on:
* Event Category (for [service health events click here](monitoring-activity-log-alerts-on-service-notifications.md))
- Resource Group
- Resource
- Resource Type
- Operation name
- The level of the notifications (Verbose, Informational, Warning, Error, Critical)
- Status
- Event initiated by

>[!NOTE]
>You must specify at least one of the above criteria in your alert. You may not create an alert that activates every time an event is created in the Activity Logs.
>
>

You can also the configure the actions that will be executed when the alert is activated:
* Select an existing Action Group
- Create a new Action Group (that can be later used for future alerts)

You can learn more about [Action Groups here](monitoring-action-groups.md)

You can learn about Activity Log Alerts for service health notification [here](monitoring-activity-log-alerts-on-service-notifications.md)

## Create an alert on an activity log event with a new action group with the Azure Portal
1.	In the [portal](https://portal.azure.com), navigate to the **Monitor** service

    ![Monitor](./media/monitoring-activity-log-alerts/home-monitor.png)
2.	Click the **Monitor** option to open the Monitor blade. It first opens to the **Activity log** section.

3.	Now click on the **Alerts** section.

    ![Alerts](./media/monitoring-activity-log-alerts/alerts-blades.png)
4.	Select the **Add activity log alert** command and fill in the fields

5.	**Name** your activity log alert, and choose a **Description**.

    ![Add-Alert](./media/monitoring-activity-log-alerts/add-activity-log-alert.png)

6.	The **Subscription** is the one the Activity log alert will be saved in. It will be auto filled to the subscription you are currently operating under. This is the subscription the alert resource will be deployed to and monitor.

    ![Add-Alert-New-Action-Group](./media/monitoring-activity-log-alerts/activity-log-alert-new-action-group.png)

7.	Choose the **Resource Group** this alert will be associated with in the **Subscription**.

8.	Provide the **Event Category**, **Resource Group**, **Resource**, **Resource Type**, **Operation Name**, **Level**, **Status** and **Event intiated by** values to identify which events this alert should monitor.

>[!NOTE]
>You must specify at least one of the above criteria in your alert. You may not create an alert that activates every time an event is created in the Activity Logs.
>
>

9.	Create a **New** Action Group by giving it **Name** and **Short Name**; the Short Name will be referenced in the notifications sent when this alert is activated.

10.	Then, define a list of actions by providing the action’s

    a. **Name:** Action’s name, alias or identifier.

    b. **Action Type:** Choose the action type: SMS, Email, or Webhook

    c. **Details:** Based on the action type chosen, provide a phone number, email address or webhook URI.

11.	Select **OK** when done to create the alert.

Within a few minutes, the alert is active and triggers as previously described.

For details on the webhook schema for activity log alerts [click here](monitoring-activity-log-alerts-webhook.md)

>[!NOTE]
>The action group defined in these steps will be reusable, as an existing action group, for all future alert definition.
>
>

## Create an alert on an activity log event for an existing action group with the Azure Portal
1.	In the [portal](https://portal.azure.com), navigate to the **Monitor** service

    ![Monitor](./media/monitoring-activity-log-alerts/home-monitor.png)
2.	Click the **Monitor** option to open the Monitor blade. It first opens to the **Activity log** section.

3.	Now click on the **Alerts** section.

    ![Alerts](./media/monitoring-activity-log-alerts/alerts-blades.png)
4.	Select the **Add activity log alert** command and fill in the fields

5.	**Name** your activity log alert, and choose a **Description**. These will appear in the notifications sent when this alert fires.

    ![Add-Alert](./media/monitoring-activity-log-alerts/add-activity-log-alert.png)
6.	The **Subscription** is the one the Activity log alert will be saved in. It will be auto filled to the subscription you are currently operating under. This is the subscription the alert resource will be deployed to and monitor.

    ![Add-Alert-Existing-Action-Group](./media/monitoring-activity-log-alerts/activity-log-alert-existing-action-group.png)
7.	Choose the **Resource Group** this alert will be associated with in the **Subscription**.

8.	Provide the **Event Category**, **Resource Group**, **Resource**, **Resource Type**, **Operation Name**, **Level**, **Status** and **Event intiated by** values to scope for what events this alert should apply.

9.	Choose to **Notify Via** an **Existing action group**. Select the respective action group.

10.	Select **OK** when done to create the alert.

Within a few minutes, the alert is active and triggers as previously described.

## Managing your alerts

Once you have created an alert, it will be visible in the Alerts section of the Monitor service. Select the alert you wish to manage, you will be able to:
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
