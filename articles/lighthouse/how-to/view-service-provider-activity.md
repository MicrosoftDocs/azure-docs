---
title: View actions performed by service providers
description: Customers can view logged activity including all actions taken by users in a managing tenant.
ms.date: 11/26/2019
ms.topic: conceptual
---

# View actions performed by service providers

Customers who have delegated subscriptions for Azure delegated resource management can [view Azure Activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview) data to see all actions taken, including those initiated by service providers. This gives customers full visibility into the actions that service providers are performing through Azure delegated resource management, as well as seeing actions performed by users within the customer's own Azure Active Directory (Azure AD) tenant.

You can [view the activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview#view-the-activity-log) for all resources from the **Monitor** menu in the Azure portal. Near the top of the screen, you can select a specific subscription to show only results for that subscription (or navigate directly to that subscription in the Azure portal, then select **Activity log** in its menu). You can also [view and retrieve activity log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view) programmatically.

> [!NOTE]
> Users in a service provider's tenant can view activity log results for a delegated subscription in a customer tenant if they were granted the [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) role (or another built-in role which includes Reader access) when that subscription was onboarded for Azure delegated resource management.

In the activity log, you'll see the name of the operation and its status, along with the date and time it was performed. The **Event initiated by** column shows which user performed the operation, whether it was a user in a service provider's tenant acting through Azure delegated resource management, or a user in the customer's own tenant.

## Set up alerts for critical operations

You can create [activity log alerts](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-alerts) to be notified when critical operations are performed. These alerts will include operations performed by users in any managing tenants as well as those in the customer's own tenant. For more info, see [Create and manage activity log alerts](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log).

## Next steps

- Learn more about [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/).
- Learn how to [view and manage service provider offers](view-manage-service-providers.md) in the Azure portal.