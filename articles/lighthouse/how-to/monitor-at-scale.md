---
title: Monitor delegated resources at scale
description: Learn how to effectively use Azure Monitor Logs in a scalable way across the customer tenants you're managing.
ms.date: 02/11/2021
ms.topic: how-to
---

# Monitor delegated resources at scale

As a service provider, you may have onboarded multiple customer tenants to [Azure Lighthouse](../overview.md). Azure Lighthouse allows service providers to perform operations at scale across several tenants at once, making management tasks more efficient.

This topic shows you how to use [Azure Monitor Logs](../../azure-monitor/logs/data-platform-logs.md) in a scalable way across the customer tenants you're managing. Though we refer to service providers and customers in this topic, this guidance also applies to [enterprises using Azure Lighthouse to manage multiple tenants](../concepts/enterprise.md).

> [!NOTE]
> Be sure that users in your managing tenants have been granted the [necessary roles for managing Log Analytics workspaces](../../azure-monitor/logs/manage-access.md#manage-access-using-azure-permissions) on your delegated customer subscriptions.

## Create Log Analytics workspaces

In order to collect data, you'll need to create Log Analytics workspaces. These Log Analytics workspaces are unique environments for data collected by Azure Monitor. Each workspace has its own data repository and configuration, and data sources and solutions are configured to store their data in a particular workspace.

We recommend creating these workspaces directly in the customer tenants. This way their data remains in their tenants rather than being exported into yours. This also allows centralized monitoring of any resources or services supported by Log Analytics, giving you more flexibility on what types of data you monitor.

> [!TIP]
> Any automation account used to access data from a Log Analytics workspace must be created in the same tenant as the workspace.

You can create a Log Analytics workspace by using the [Azure portal](../../azure-monitor/logs/quick-create-workspace.md), by using [Azure CLI](../../azure-monitor/logs/quick-create-workspace-cli.md), or by using [Azure PowerShell](../../azure-monitor/logs/powershell-workspace-configuration.md).

> [!IMPORTANT]
> Even if all of the workspaces are created in the customer tenant, the Microsoft.Insights resource provider must also be registered on a subscription in the managing tenant.

## Deploy policies that log data

Once you've created your Log Analytics workspaces, you can deploy [Azure Policy](../../governance/policy/index.yml) across your customer hierarchies so that diagnostic data is sent to the appropriate workspace in each tenant. The exact policies you deploy may vary depending on the resource types that you want to monitor.

To learn more about creating policies, see [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md). This [community tool](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/tools/azure-diagnostics-policy-generator) provides a script to help you create policies to monitor the specific resource types that you choose.

When you've determined which policies to deploy, you can [deploy them to your delegated subscriptions at scale](policy-at-scale.md).

## Analyze the gathered data

After you've deployed your policies, data will be logged in the Log Analytics workspaces you've created in each customer tenant. To gain insights across all managed customers, you can use tools such as [Azure Monitor Workbooks](../../azure-monitor/visualize/workbooks-overview.md) to gather and analyze information from multiple data sources.

## View alerts across customers

You can view [alerts](../../azure-monitor/alerts/alerts-overview.md) for the delegated subscriptions in customer tenants that your manage.

From your managing tenant, you can [create, view, and manage activity log alerts](../../azure-monitor/alerts/alerts-activity-log.md) in the Azure portal or through APIs and management tools.

To refresh alerts automatically across multiple customers, use an [Azure Resource Graph](../../governance/resource-graph/overview.md) query to filter for alerts. You can pin the query to your dashboard and select all of the appropriate customers and subscriptions. For example, the query below will display severity 0 and 1 alerts, refreshing every 60 minutes.

```kusto
alertsmanagementresources
| where type == "microsoft.alertsmanagement/alerts"
| where properties.essentials.severity =~ "Sev0" or properties.essentials.severity =~ "Sev1"
| where properties.essentials.monitorCondition == "Fired"
| where properties.essentials.startDateTime > ago(60m)
| project StartTime=properties.essentials.startDateTime,name,Description=properties.essentials.description, Severity=properties.essentials.severity, subscriptionId
| sort by tostring(StartTime)
```

## Next steps

- Try out the [Activity Logs by Domain](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/workbook-activitylogs-by-domain) workbook on GitHub.
- Explore this [MVP-built sample workbook](https://github.com/scautomation/Azure-Automation-Update-Management-Workbooks), which tracks patch compliance reporting by [querying Update Management logs](../../automation/update-management/query-logs.md) across multiple Log Analytics workspaces. 
- Learn about other [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).