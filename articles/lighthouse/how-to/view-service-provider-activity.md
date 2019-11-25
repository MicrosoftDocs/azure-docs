---
title: View activity from service providers
description: Customers can view logged activity including all actions taken by users in a managing tenant.
ms.date: 11/26/2019
ms.topic: conceptual
---
# View activity from service providers

Customers who have delegated subscriptions for Azure delegated resource management can [view Azure Activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview) data, which shows all actions taken by users in the managing tenant. This gives customers full visibility into the actions that service providers are performing through Azure delegated resource management, as well as visibility into actions from users within the customer tenant.

> [!NOTE]
> While Azure delegated resource management can also be used [within an enterprise which has multiple Azure AD tenants of its own](enterprise.md) to simplify cross-tenant management.

[How to view the log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview#view-the-activity-log)You can filter by subscription

> [!NOTE]
> Users in a managing tenant can also view logged activity for a subscription in a customer tenant, as long as they were granted the [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) role (or another built-in role which includes Reader access) when the subscription was onboarded for Azure delegated resource management.

While there is no ability to filter based on whether actions were taken by users in the customer's tenant or in the managing tenant, the **Event initiated by** column will show which user performed an action.

## Set up alerts for critical operations

Can put alerts on critical operations. New alert rule

## Next steps

- Learn more about [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/).
- Learn how to [view and manage service provider offers](view-manage-service-providers.md) in the Azure portal.