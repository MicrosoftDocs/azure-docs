---
title: Device maintenance notification walkthrough
titleSuffix: Internet Peering
description: Get started with device maintenance notification
services: internet-peering
author: jsaraco
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/23/2023
ms.author: jsaraco
ms.custom: template-how-to, engagement-fy23
---

# Azure Peering maintenance notification

This arrticle explains the maintenance notifications that are sent to Azure Peering partners and Peering Service customers.

## Service Health

Partners who have peering and/or peering service resources in Azure will receive notifications through the Azure Service Health page. You can get to this page by searching for it in the Azure Portal.

:::image type="content" source="media/azure-peering-service-serviceHealthSearch.png" alt-text="Service Health search" :::

### Seeing maintenances

Notifications for active maintenance will appear in the Planned Maintenance section of Service Health, and will be listed under Azure Peering Service. The highlighted entry in the image below is an example of a maintenance notification.

:::image type="content" source="media/azure-peering-service-serviceHealthPage.png" alt-text="Service Health page" :::

The summary page gives you information about your resource that is affected by maintenance, such as its region, and its peering location.

:::image type="content" source="media/azure-peering-service-maintenanceSummary.png" alt-text="Maintenance summary" :::

When maintenance has completed, a status update will be sent. At this time, the maintenance event will no longer be active, so it will no longer appear in the Planned Maintenances section of Service Health. Instead, it will appear in the Health History page.

:::image type="content" source="media/azure-peering-service-serviceHealthHistory.png" alt-text="Service Health history" :::

Clicking on an entry in the Health History page summarizes the maintenance, displaying the exact start and an estimated end time.

**NOTE:** At this time, the end time listed for the maintenance is an estimate. Many maintenances will complete before the end time that is shown in Service Health, but this is not guaranteed. Future developments to our maintenance notification service will allow for more accurate maintenance end times.

:::image type="content" source="media/azure-peering-service-healthHistorySummary.png" alt-text="Service Health history summary" :::

### Notification forwarding

Service Health has support for forwarding rules, so you can set up your own alerts when maintenances occur. To set up a forwarding rule, go to the Planned Maintenance section of Service Health, and click on Add service health alert.

:::image type="content" source="media/azure-peering-service-addServiceHealthAlert.png" alt-text="Add Service Health alert" :::

Then, choose the Azure subscription your peering and/or peering services are associated with. When a resource is affected by maintenance, the alert in Service Health is associated with the subscription ID that the resource is part of.

:::image type="content" source="media/azure-peering-service-createAlertRule1.png" alt-text="Choose Azure subscription" :::

In the Condition section, choose Azure Peering Service as the Service, the Regions you'd like to receive notifications for (selecting all is recommended), and Planned maintenance as the Event type.

:::image type="content" source="media/azure-peering-service-createAlertRule2.png" alt-text="Alert condition" :::

In the Actions section, create a new action group. In the Basics section, choose your Azure subscription and resource group, choose Global as the region, and choose an action group name and display name.

:::image type="content" source="media/azure-peering-service-createActionGroup1.png" alt-text="Action group actions" :::

In the notifications section, choose Email/SMS Message/Push/Voice as the Notification type, and choose a name for this notification. Click the pencil to edit the notification action, and choose the email you'd like notifications to be forwarded to, and/or any other forwarding methods you'd like to receive, such as SMS or Azure mobile app notifications.

:::image type="content" source="media/azure-peering-service-createActionGroup2.png" alt-text="Action group notifications" :::

Go to Review + create, and finish your action group.

:::image type="content" source="media/azure-peering-service-createActionGroup3.png" alt-text="Create action group" :::

After creating an action group, you should return to the Create an alert rule page, and your action group will appear in the list.

:::image type="content" source="media/azure-peering-service-createAlertRule3.png" alt-text="Alert rule with action group" :::

If you click on the Action group name of your newly created action group, you can edit it or send test notifications.

:::image type="content" source="media/azure-peering-service-testActionGroup.png" alt-text="Test action group notifications" :::

In the Details section, choose the resource group name to save the alert rule in, and choose an alert rule name and description. Open Advanced options and enable the alert rule upon creation.

:::image type="content" source="media/azure-peering-service-createAlertRule4.png" alt-text="Create alert rule details" :::

Go to Review + create, and finish your alert rule.

:::image type="content" source="media/azure-peering-service-createAlertRule5.png" alt-text="Create alert rule" :::

Azure Peering Service notifications will now be forwarded to you based on your alert rule whenever maintenances start, and whenever they are resolved.

#### More information

For more information on the notification platform Service Health and forwarding notifications, more information can be found at: [Create activity log alerts on service notifications using the Azure portal](../../articles/service-health/alerts-activity-log-service-notifications-portal.md).

## Legacy peerings

Peering partners who have not onboarded their peerings as Azure resources, as a result, do not have subscriptions associated with their peerings. This means they cannot receive notifications in Service Health. Instead, these partners will receive maintenance notifications via your NOC contact email. Partners with legacy peerings do not have to opt-in to receive these email notifications, they are sent automatically. Below is an example of an maintenance notification email.

:::image type="content" source="media/azure-peering-service-legacyPeeringMaintenanceEmail.png" alt-text="Legacy peering maintenance email" :::