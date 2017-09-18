---
title: Receive activity log alerts on service notifications | Microsoft Docs
description: Get notified via SMS, email, or webhook when Azure service occurs.
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
ms.date: 03/31/2017
ms.author: johnkem

---
# Create activity log alerts on service notifications
## Overview
This article shows you how to set up activity log alerts for service health notifications by using the Azure portal.  

You can receive an alert when Azure sends service health notifications to your Azure subscription. You can configure the alert based on:

- The class of service health notification (incident, maintenance, information, etc.).
- The service(s) affected.
- The region(s) affected.
- The status of the notification (active vs. resolved).
- The level of the notifications (informational, warning, error).

You also can configure who the alert should be sent to:

- Select an existing action group.
- Create a new action group (that can be used for future alerts).

To learn more about action groups, see [Create and manage action groups](monitoring-action-groups.md).

For information on how to configure service health notification alerts by using Azure Resource Manager templates, see [Resource Manager templates](monitoring-create-activity-log-alerts-with-resource-manager-template.md).

## Create an alert on a service health notification for a new action group by using the Azure portal
1. In the [portal](https://portal.azure.com), select **Monitor**.

    ![The "Monitor" service](./media/monitoring-activity-log-alerts-on-service-notifications/home-monitor.png)

2. In the **Activity log** section, select **Alerts**.

    ![The "Alerts" tab](./media/monitoring-activity-log-alerts-on-service-notifications/alerts-blades.png)

3. Select **Add activity log alert**, and fill in the fields.

    ![The "Add activity log alert" command](./media/monitoring-activity-log-alerts-on-service-notifications/add-activity-log-alert.png)

4. Enter a name in the **Activity log alert name** box, and provide a **Description**.

    ![The "Add activity log alert" dialog box](./media/monitoring-activity-log-alerts-on-service-notifications/activity-log-alert-service-notification-new-action-group.png)

5. The **Subscription** box autofills with your current subscription. This subscription is used to save the activity log alert. The alert resource is deployed to this subscription and monitors events in the activity log for it.

6. Select the **Resource group** in which the alert resource is created. This isn't the resource group that's monitored by the alert. Instead, it's the resource group where the alert resource is located.

7. In the **Event category** box, select **Service Health**. Optionally, select the **Service**, **Region**, **Type**, **Status**, and **Level** of service health notifications that you want to receive.

8. Under **Alert via**, select the **New** action group button. Enter a name in the **Action group name** box, and enter a name in the **Short name** box. The short name is referenced in the notifications that are sent when this alert fires.

9. Define a list of receivers by providing the receiver's:

    a. **Name**: Enter the receiver’s name, alias, or identifier.

    b. **Action Type**: Select SMS, email, or webhook.

    c. **Details**: Based on the action type chosen, enter a phone number, email address, or webhook URI.

10.	Select **OK** to create the alert.

Within a few minutes, the alert is active and begins to trigger based on the conditions you specified during creation.

For information on the webhook schema for activity log alerts, see [Webhooks for Azure activity log alerts](monitoring-activity-log-alerts-webhook.md).

>[!NOTE]
>The action group defined in these steps is reusable as an existing action group for all future alert definitions.
>
>

## Create an alert on a service health notification for an existing action group by using the Azure portal

1. Follow steps 1 through 7 in the previous section to create your service health notification. 

2. Under **Alert via**, select the **Existing** action group button. Select the appropriate action group.

3. Select **OK** to create the alert.

Within a few minutes, the alert is active and begins to trigger based on the conditions you specified during creation.

## Manage your alerts

After you create an alert, it's visible in the **Alerts** section of the **Monitor** blade. Select the alert you want to manage to:

* Edit it.
* Delete it.
* Disable or enable it, if you want to temporarily stop or resume receiving notifications for the alert.

## Next steps
- Learn about [service health notifications](monitoring-service-notifications.md).
- Learn about [notification rate limiting](monitoring-alerts-rate-limiting.md).
- Review the [activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md).
- Get an [overview of activity log alerts](monitoring-overview-alerts.md), and learn how to receive alerts. 
- Learn more about [action groups](monitoring-action-groups.md).
