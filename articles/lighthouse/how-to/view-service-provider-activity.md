---
title: View actions performed by service providers
description: Customers can view logged activity including all actions taken by users in a managing tenant.
ms.date: 11/26/2019
ms.topic: conceptual
---

# View actions performed by service providers

Customers who have delegated subscriptions for Azure delegated resource management can [view Azure Activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview) data to see all actions taken, including those initiated by users in the managing tenant. This gives customers full visibility into the actions that service providers are performing through Azure delegated resource management, as well as visibility into actions from users within the customer tenant.

You can [view the activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview#view-the-activity-log) for all resources from the Monitor menu in the Azure portal. Select a specific subscription to show only results for that subscription (or you can navigate to that subscription in the Azure portal and then select **Activity log** in its menu). for a particular resource from the Activity Log option in that resource's menu. You can also [view and retrieve activity log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view) programmatically.

> [!NOTE]
> Users in a managing tenant can view activity log results for a subscription in a customer tenant if they were granted the [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) role (or another built-in role which includes Reader access) when that subscription was onboarded for Azure delegated resource management.

While there is no ability to filter results based on whether actions were taken by users in the customer's tenant or in the managing tenant, the **Event initiated by** column will show which user performed an action. This provides visibility into actions taken by users in the service provider's tenant.

## Set up alerts for critical operations

You can create [activity log alerts](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-alerts) to be notified when critical operations are performed. These alerts will include operations performed by users in the managing tenant as well as in the customer tenant. For more info, see [Create and manage activity log alerts](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log).

## Next steps

- Learn more about [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/).
- Learn how to [view and manage service provider offers](view-manage-service-providers.md) in the Azure portal.