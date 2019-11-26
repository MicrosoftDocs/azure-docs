---
title: View service provider activity
description: Customers can view logged activity to see actions performed by service providers through Azure delegated resource management.
ms.date: 11/26/2019
ms.topic: conceptual
---

# View service provider activity

Customers who have delegated subscriptions for Azure delegated resource management can [view Azure Activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview) data to see all actions taken. This gives customers full visibility into operations that service providers are performing through Azure delegated resource management, along with those done by users within the customer's own Azure Active Directory (Azure AD) tenant.

## View activity log data

You can [view the activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview#view-the-activity-log) from the **Monitor** menu in the Azure portal. To limit results to a specific subscription, you can use the filters to select a specific subscription. You can also [view and retrieve activity log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view) programmatically.

> [!NOTE]
> Users in a service provider's tenant can view activity log results for a delegated subscription in a customer tenant if they were granted the [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) role (or another built-in role which includes Reader access) when that subscription was onboarded for Azure delegated resource management.

In the activity log, you'll see the name of the operation and its status, along with the date and time it was performed. The **Event initiated by** column shows which user performed the operation, whether it was a user in a service provider's tenant acting through Azure delegated resource management, or a user in the customer's own tenant.

## Set up alerts for critical operations

To stay aware of critical operations that service providers (or users in your own tenant) are performing, we recommend creating [activity log alerts](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-alerts). These alerts will include actions taken by users in the customer's own tenant and in any managing tenants.

For more info, see [Create and manage activity log alerts](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log).

## Next steps

- Learn more about [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/).
- Learn how to [view and manage service provider offers](view-manage-service-providers.md) in the Azure portal.