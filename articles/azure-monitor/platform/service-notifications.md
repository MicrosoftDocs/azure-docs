---
title: View service health notifications by using the Azure portal
description: Service health notifications allow you to view service health messages published by Microsoft Azure.
author: dkamstra
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 4/12/2018
ms.author: dukek
ms.subservice: logs
---
# View service health notifications by using the Azure portal

Service health notifications are published by the Azure infrastructure. They contain information about the resources under your subscription. These notifications are a sub-class of activity log events, and so can also be found in the activity log. Service health notifications can be informational or actionable, depending on the class.

For more information on the various classes of service health notifications, see [Service health notifications properties](../../service-health/service-health-notifications-properties.md).

## View your service health notifications in the Azure portal

1. In the [Azure portal](https://portal.azure.com), select **Monitor**.

    ![Screenshot of Azure portal menu, with Monitor selected](./media/service-notifications/home-monitor.png)

    Azure Monitor brings together all your monitoring settings and data into one consolidated view. It first opens to the **Activity log** section.

1. Select **Alerts**.

    ![Screenshot of Monitor Activity log, with Alerts selected](./media/service-notifications/service-health-summary.png)

1. Select **+Add activity log alert**, and set up an alert to ensure you are notified for future service notifications. For more information, see [Create activity log alerts on service notifications](../../azure-monitor/platform/alerts-activity-log-service-notifications.md).

## Next steps

* Receive [alert notifications whenever a service health notification](../../azure-monitor/platform/alerts-activity-log-service-notifications.md) is posted.  
* Learn more about [activity log alerts](../../azure-monitor/platform/activity-log-alerts.md).
