---
title: Advance notifications (Preview) for planned maintenance events
description: Get notification before planned maintenance for Azure SQL Database.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 03/02/2021
---
# Advance notifications for planned maintenance events (Preview)
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

Advance notifications (Preview), is available to databases configured for [Maintenance Window (Preview)](maintenance-window.md). Advance notifications enable customers to configure notifications to be sent up to 24 hours in advance of any planned event.

Notifications can be configured so you can get texts, emails, Azure push notifications, and voicemails when planned maintenance is due to begin in the next 24 hours. Additional notifications are sent when maintenance begins and when maintenance ends.

> [!Note]
> While the ability to choose a maintenance window is available for Azure SQL managed instances, advance notifications are not currently available for Azure SQL managed instances.

## Create an advance notification

Advance notifications are available for Azure SQL databases that have their maintenance window configured. 

Complete the following steps to enable a notification.  

1. Go to the [Planned maintenance](https://portal.azure.com/#blade/Microsoft_Azure_Health/AzureHealthBrowseBlade/plannedMaintenance) page, select **Health alerts**, then **Add service health alert**.

    :::image type="content" source="media/advance-notifications/health-alerts.png" alt-text="create a new health alert menu option":::

2. In the **Actions** section, select **Add action groups**. 

    :::image type="content" source="media/advance-notifications/add-action-group.png" alt-text="add an action group menu option":::

3. Complete the **Create action group** form, then select **Next: Notifications**.  

    :::image type="content" source="media/advance-notifications/create-action-group.png" alt-text="create action group form":::

1. On the **Notifications** tab, select the **Notification type**. The **Email/SMS message/Push/Voice** option offers the most flexibility and is the recommended option. Select the pen to configure the notification.  

    :::image type="content" source="media/advance-notifications/notifications.png" alt-text="configure notifications":::



   1. Complete the *Add or edit notification* form that opens and select **OK**: 

   2. Actions and Tags are optional. Here you can configure additional actions to be triggered or use tags to categorize and organize your Azure resources. 

   4. Check the details on the **Review + create** tab and select **Create**. 

7. After selecting create, the alert rule configuration screen opens and the action group will be selected. Give a name to your new alert rule, then choose the resource group for it, and select **Create alert rule**. 

8. Click the **Health alerts** menu item again, and the list of alerts now contains your new alert. 


You're all set. Next time there's a planned Azure SQL maintenance event, you'll receive an advance notification.

## Receiving notifications

The following table shows the general-information notifications you may receive: 

|Status|Description|
|:---|:---|
|**Planned Deployment**| Received 24 hours prior to the maintenance event. Maintenance is planned on DATE between 5pm - 8am (local time) for DB xyz.|
|**In-Progress** | Maintenance for database *xyz* is starting.| 
|**Complete** | Maintenance of database *xyz* is complete. |

The following table shows additional notifications that may be sent while maintenance is ongoing: 

|Status|Description|
|:---|:---|
|**Extended** | Maintenance is in progress but didn't complete for database *xyz*. Maintenance will continue at the next maintenance window.| 
|**Canceled**| Maintenance for database *xyz* is canceled and will be rescheduled later. |
|**Blocked**|There was a problem during maintenance for database *xyz*. We'll notify you when we resume.| 
|**Resumed**|The problem has been resolved and maintenance will continue at the next maintenance window.|


## Next steps

- [Maintenance window](maintenance-window.md)
- [Maintenance window FAQ](maintenance-window-faq.yml)
- [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md)
- [Email Azure Resource Manager Role](../../azure-monitor/alerts/action-groups.md#email-azure-resource-manager-role)