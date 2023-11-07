---
title: Monitor service provider activity
description: Customers can monitor logged activity to see actions performed by service providers through Azure Lighthouse.
ms.date: 05/23/2023
ms.topic: how-to
---

# Monitor service provider activity

Customers who have delegated subscriptions to service providers through [Azure Lighthouse](../overview.md) can [view Azure Activity log](../../azure-monitor/essentials/activity-log.md) data to see all actions taken. This data provides full visibility for actions that service providers take on delegated customer resources. The activity log also shows operations from users within the customer's own Microsoft Entra tenant.

## View activity log data

[View the activity log](../../azure-monitor/essentials/activity-log.md#view-the-activity-log) from the **Monitor** menu in the Azure portal. Use the filters if you want to show results from a specific subscription.

You can also [view and retrieve activity log events](../../azure-monitor/essentials/activity-log.md#other-methods-to-retrieve-activity-log-events) programmatically.

> [!NOTE]
> Users in a service provider's tenant can view activity log results for a delegated subscription if they were granted the [Reader](../../role-based-access-control/built-in-roles.md#reader) role (or another built-in role which includes Reader access) when that subscription was onboarded to Azure Lighthouse.

In the activity log, you'll see the name of the operation and its status, along with the date and time it was performed. The **Event initiated by** column shows which user performed the operation, whether it was a user in a service provider's tenant acting through Azure Lighthouse, or a user in the customer's own tenant. Note that the name of the user is shown, rather than the tenant or the role that the user has been assigned for that subscription.

> [!NOTE]
> Users from the service provider appear in the activity log, but these users and their role assignments aren't shown in **Access Control (IAM)** or when retrieving role assignment info via APIs.

Logged activity is available in the Azure portal for the past 90 days. You can also [store this data for a longer period](../../azure-monitor/essentials/activity-log.md#retention-period) if needed.

## Set alerts for critical operations

To stay aware of critical operations that service providers (or users in the customer's own tenant) are performing, we recommend creating [activity log alerts](../../azure-monitor/alerts/alerts-types.md#activity-log-alerts). For example, you may want to track all administrative actions for a subscription, or be notified when any virtual machine in a particular resource group is deleted. When you create alerts, they'll include actions performed by users both in the customer's tenant and in any managing tenants.

For more information, see [Create, view, and manage activity log alerts](../../azure-monitor/alerts/alerts-activity-log.md).

## Create log queries

Log queries can help you analyze your logged activity or focus on specific items. For example, an audit might require you to report on all administrative-level actions performed on a subscription. You can create a query to filter on only these actions and sort the results by user, date, or another value.

For more information, see [Log queries in Azure Monitor](../../azure-monitor/logs/log-query-overview.md).

## View user activity across domains

To view activity from individual users across multiple domains, use the [Activity Logs by Domain](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/workbook-activitylogs-by-domain) sample workbook.

Results can be filtered by domain name. You can also apply additional filters such as category, level, or resource group.

## Next steps

- Learn how to [audit and restrict delegations](view-manage-service-providers.md#audit-and-restrict-delegations-in-your-environment).
- Learn more about [Azure Monitor](../../azure-monitor/index.yml).
- Learn how to [view and manage service provider offers](view-manage-service-providers.md) in the Azure portal.
