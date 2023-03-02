---
title: Receive activity log alerts on Azure service notifications using Azure portal
description: Learn how to use the Azure portal to set up activity log alerts for service health notifications by using the Azure portal.
ms.topic: quickstart
ms.date: 06/27/2019
---

# Create activity log alerts on service notifications using the Azure portal

This article shows you how to use the Azure portal to set up activity log alerts for service health notifications by using the Azure portal.  

Service health notifications are stored in the [Azure activity log](../azure-monitor/essentials/platform-logs-overview.md). Given the large volume of information stored in the activity log, there is a separate user interface to make it easier to view and set up alerts on service health notifications. 

You can receive an alert when Azure sends service health notifications to your Azure subscription. You can configure the alert based on:

- The class of service health notification (Service issues, Planned maintenance, Health advisories, Security advisories).
- The subscription affected.
- The service(s) affected.
- The region(s) affected.

> [!NOTE]
> Service health notifications do not send alerts for resource health events.

You also can configure who the alert should be sent to:

- Select an existing action group.
- Create a new action group (that can be used for future alerts).

To learn more about action groups, see [Create and manage action groups](../azure-monitor/alerts/action-groups.md).

For information on how to configure service health notification alerts by using Azure Resource Manager templates, see [Resource Manager templates](../azure-monitor/alerts/alerts-activity-log.md).

## Watch a video on setting up your first Azure Service Health alert

>[!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2OaXt]

## Create a Service Health alert using the Azure portal
1. In the [portal](https://portal.azure.com), select **Service Health**.

    ![The "Service Health" service](media/alerts-activity-log-service-notifications/home-servicehealth.png)

1. In the **Alerts** section, select **Health alerts**.

    ![The "Health alerts" tab](media/alerts-activity-log-service-notifications/alerts-blades-sh.png)

1. Select **Add service health alert**.

    ![The "Create service health alert" command](media/alerts-activity-log-service-notifications/service-health-alert.png)

1. The **Create an alert rule wizard** opens to the **Conditions** tab, with the **Scope** tab already populated. Follow the steps for Service Health alerts, starting from the **Conditions** tab, in the [create a new alert rule wizard](../azure-monitor/alerts/alerts-create-new-alert-rule.md).


Learn how to [Configure webhook notifications for existing problem management systems](service-health-alert-webhook-guide.md). For information on the webhook schema for activity log alerts, see [Webhooks for Azure activity log alerts](../azure-monitor/alerts/activity-log-alerts-webhook.md).


## Next steps
- Learn about [best practices for setting up Azure Service Health alerts](https://www.microsoft.com/en-us/videoplayer/embed/RE2OtUa).
- Learn how to [setup mobile push notifications for Azure Service Health](https://www.microsoft.com/en-us/videoplayer/embed/RE2OtUw).
- Learn how to [configure webhook notifications for existing problem management systems](service-health-alert-webhook-guide.md).
- Learn about [service health notifications](service-notifications.md).
- Learn about [notification rate limiting](../azure-monitor/alerts/alerts-rate-limiting.md).
- Review the [activity log alert webhook schema](../azure-monitor/alerts/activity-log-alerts-webhook.md).
- Get an [overview of activity log alerts](../azure-monitor/alerts/alerts-overview.md), and learn how to receive alerts.
- Learn more about [action groups](../azure-monitor/alerts/action-groups.md).
