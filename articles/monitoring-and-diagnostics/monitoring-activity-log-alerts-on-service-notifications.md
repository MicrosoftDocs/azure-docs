---
title: Receive activity log alerts on Azure service notifications
description: Get notified via SMS, email, or webhook when Azure service occurs.
author: shawntabrizi
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 06/09/2018
ms.author: shtabriz
ms.component: alerts
---

# Create activity log alerts on service notifications
## Overview
This article shows you how to set up activity log alerts for service health notifications by using the Azure portal.  

You can receive an alert when Azure sends service health notifications to your Azure subscription. You can configure the alert based on:

- The class of service health notification (Service issues, Planned maintenance, Health advisories).
- The subscription affected.
- The service(s) affected.
- The region(s) affected.

> [!NOTE]
> Service health notifications does not send an alert regarding resource health events.

You also can configure who the alert should be sent to:

- Select an existing action group.
- Create a new action group (that can be used for future alerts).

To learn more about action groups, see [Create and manage action groups](monitoring-action-groups.md).

For information on how to configure service health notification alerts by using Azure Resource Manager templates, see [Resource Manager templates](monitoring-create-activity-log-alerts-with-resource-manager-template.md).

## Create an alert on a service health notification for a new action group by using the Azure portal
1. In the [portal](https://portal.azure.com), select **Service Health**.

    ![The "Service Health" service](./media/monitoring-activity-log-alerts-on-service-notifications/home-servicehealth.png)

2. In the **Alerts** section, select **Health alerts**.

    ![The "Health alerts" tab](./media/monitoring-activity-log-alerts-on-service-notifications/alerts-blades-sh.png)

3. Select **Create service health alert** and fill in the fields.

    ![The "Create service health alert" command](./media/monitoring-activity-log-alerts-on-service-notifications/service-health-alert.png)

4. Select the **Subscription**, **Services**, and **Regions** you want to be alerted for.

    ![The "Add activity log alert" dialog box](./media/monitoring-activity-log-alerts-on-service-notifications/activity-log-alert-new-ux.png)

> [!NOTE]
> This subscription is used to save the activity log alert. The alert resource is deployed to this subscription and monitors events in the activity log for it.

5. Choose the **Event types** you want to be alerted for: *Service issue*, *Planned maintenance*, and *Health advisories* 

6. Define your alert details by entering an **Alert rule name** and **Description**.

7. Select the **Resource group** where you want the alert to be saved.

8. Create a new action group by selecting **New action group**. Enter a name in the **Action group name** box and enter a name in the **Short name** box. The short name is referenced in the notifications that are sent when this alert fires.

    ![Create a new action group](./media/monitoring-activity-log-alerts-on-service-notifications/action-group-creation.png)

9. Define a list of receivers by providing the receiver's:

    a. **Name**: Enter the receiver’s name, alias, or identifier.

    b. **Action Type**: Select SMS, email, webhook, Azure app, and more.

    c. **Details**: Based on the action type chosen, enter a phone number, email address, webhook URI, etc.

10. Select **OK** to create the action group, and then **Create alert rule** to complete your alert.

Within a few minutes, the alert is active and begins to trigger based on the conditions you specified during creation.

Learn how to [Configure webhook notifications for existing problem management systems](../service-health/service-health-alert-webhook-guide.md). For information on the webhook schema for activity log alerts, see [Webhooks for Azure activity log alerts](monitoring-activity-log-alerts-webhook.md).

>[!NOTE]
>The action group defined in these steps is reusable as an existing action group for all future alert definitions.
>
>

## Create an alert on a service health notification for an existing action group by using the Azure portal

1. Follow steps 1 through 7 in the previous section to create your service health notification. 

2. Under **Define action group**, click the **Select action group** button. Select the appropriate action group.

3. Select **Add** to add the action group, and then **Create alert rule** to complete your alert.

Within a few minutes, the alert is active and begins to trigger based on the conditions you specified during creation.

## Manage your alerts

After you create an alert, it's visible in the **Alerts** section of **Monitor**. Select the alert you want to manage to:

* Edit it.
* Delete it.
* Disable or enable it, if you want to temporarily stop or resume receiving notifications for the alert.

## Next steps
- Learn how to [configure webhook notifications for existing problem management systems](../service-health/service-health-alert-webhook-guide.md).
- Learn about [service health notifications](monitoring-service-notifications.md).
- Learn about [notification rate limiting](monitoring-alerts-rate-limiting.md).
- Review the [activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md).
- Get an [overview of activity log alerts](monitoring-overview-alerts.md), and learn how to receive alerts. 
- Learn more about [action groups](monitoring-action-groups.md).
