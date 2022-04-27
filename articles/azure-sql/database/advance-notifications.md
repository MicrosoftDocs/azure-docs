---
title: Advance notifications (Preview) for planned maintenance events
description: Get notification before planned maintenance for Azure SQL Database.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service-overview
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: scott-kim-sql
ms.author: scottkim
ms.reviewer: kendralittle, mathoma, wiassaf, urosmil
ms.date: 04/04/2022
---
# Advance notifications for planned maintenance events (Preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Advance notifications (Preview) are available for databases configured to use a non-default [maintenance window](maintenance-window.md) and managed instances with any configuration (including the default one). Advance notifications enable customers to configure notifications to be sent up to 24 hours in advance of any planned event. 

Notifications can be configured so you can get texts, emails, Azure push notifications, and voicemails when planned maintenance is due to begin in the next 24 hours. Additional notifications are sent when maintenance begins and when maintenance ends.

> [!IMPORTANT]
> For Azure SQL Database, advance notifications cannot be configured for the **System default** maintenance window option. Choose a maintenance window other than the **System default** to configure and enable Advance notifications.

> [!NOTE]
> While [maintenance windows](maintenance-window.md) are generally available, advance notifications for maintenance windows are in public preview for Azure SQL Database and Azure SQL Managed Instance.

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

## Permissions

While Advance Notifications can be sent to any email address, Azure subscription RBAC (role-based access control) policy determines who can access the links in the email. Querying resource graph is covered by [Azure RBAC](../../role-based-access-control/overview.md) access management.  To enable read access, each recipient should have resource group level read access. For more information, see [Steps to assign an Azure role](../../role-based-access-control/role-assignments-steps.md).

## Retrieve the list of impacted resources

[Azure Resource Graph](../../governance/resource-graph/overview.md) is an Azure service designed to extend Azure Resource Management. The Azure Resource Graph Explorer provides efficient and performant resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment. 

You can use the Azure Resource Graph Explorer to query for maintenance events. For an introduction on how to run these queries, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md).

When the advanced notification for planned maintenance is received, you will get a link that opens Azure Resource Graph and executes the query for the exact event, similar to the following. Note that the `notificationId` value is unique per maintenance event.  

```kusto
resources
| project resource = tolower(id)
| join kind=inner (
    maintenanceresources
    | where type == "microsoft.maintenance/updates"
    | extend p = parse_json(properties)
    | mvexpand d = p.value
    | where d has 'notificationId' and d.notificationId == 'LNPN-R9Z'
    | project resource = tolower(name), status = d.status, resourceGroup, location, startTimeUtc = d.startTimeUtc, endTimeUtc = d.endTimeUtc, impactType = d.impactType
) on resource
| project resource, status, resourceGroup, location, startTimeUtc, endTimeUtc, impactType
```

For the full reference of the sample queries and how to use them across tools like PowerShell or Azure CLI, visit [Azure Resource Graph sample queries for Azure Service Health](../../service-health/resource-graph-samples.md).


## Next steps

- [Maintenance window](maintenance-window.md)
- [Maintenance window FAQ](maintenance-window-faq.yml)
- [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md)
- [Email Azure Resource Manager Role](../../azure-monitor/alerts/action-groups.md#email-azure-resource-manager-role)
