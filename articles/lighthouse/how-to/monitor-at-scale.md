---
title: Monitor delegated resources at scale
description: Azure Lighthouse helps you use Azure Monitor Logs in a scalable way across customer tenants.
ms.date: 05/23/2023
ms.topic: how-to
ms.custom:
---

# Monitor delegated resources at scale

As a service provider, you may have onboarded multiple customer tenants to [Azure Lighthouse](../overview.md). Azure Lighthouse allows service providers to perform operations at scale across several tenants at once, making management tasks more efficient.

This topic shows you how to use [Azure Monitor Logs](../../azure-monitor/logs/data-platform-logs.md) in a scalable way across the customer tenants you're managing. Though we refer to service providers and customers in this topic, this guidance also applies to [enterprises using Azure Lighthouse to manage multiple tenants](../concepts/enterprise.md).

> [!NOTE]
> Be sure that users in your managing tenants have been granted the [necessary roles for managing Log Analytics workspaces](../../azure-monitor/logs/manage-access.md#azure-rbac) on your delegated customer subscriptions.

## Create Log Analytics workspaces

In order to collect data, you'll need to create Log Analytics workspaces. These Log Analytics workspaces are unique environments for data collected by Azure Monitor. Each workspace has its own data repository and configuration, and data sources and solutions are configured to store their data in a particular workspace.

We recommend creating these workspaces directly in the customer tenants. This way their data remains in their tenants rather than being exported into yours. Creating the workspaces in the customer tenants allows centralized monitoring of any resources or services supported by Log Analytics, giving you more flexibility on what types of data you monitor. Workspaces created in customer tenants are required in order to collect information from [diagnostic settings](../..//azure-monitor/essentials/diagnostic-settings.md).

> [!TIP]
> Any automation account used to access data from a Log Analytics workspace must be created in the same tenant as the workspace.

You can create a Log Analytics workspace by using the [Azure portal](../../azure-monitor/logs/quick-create-workspace.md), by using [Azure Resource Manager templates](../../azure-monitor/logs/resource-manager-workspace.md), or by using [Azure PowerShell](../../azure-monitor/logs/powershell-workspace-configuration.md).

> [!IMPORTANT]
> If all workspaces are created in customer tenants, the Microsoft.Insights resource providers must also be [registered](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) on a subscription in the managing tenant. If your managing tenant doesn't have an existing Azure subscription, you can register the resource provider manually by using the following PowerShell commands:
>
> ```powershell
> $ManagingTenantId = "your-managing-Azure-AD-tenant-id"
>
> # Authenticate as a user with admin rights on the managing tenant
> Connect-AzAccount -Tenant $ManagingTenantId
>
> # Register the Microsoft.Insights resource providers Application Ids
> New-AzADServicePrincipal -ApplicationId 1215fb39-1d15-4c05-b2e3-d519ac3feab4 -Role Contributor
> New-AzADServicePrincipal -ApplicationId 6da94f3c-0d67-4092-a408-bb5d1cb08d2d -Role Contributor
> New-AzADServicePrincipal -ApplicationId ca7f3f0b-7d91-482c-8e09-c5d840d0eac5 -Role Contributor
> ```

## Deploy policies that log data

Once you've created your Log Analytics workspaces, you can deploy [Azure Policy](../../governance/policy/overview.md) across your customer hierarchies so that diagnostic data is sent to the appropriate workspace in each tenant. The exact policies you deploy may vary, depending on the resource types that you want to monitor.

To learn more about creating policies, see [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md). This [community tool](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/tools/azure-diagnostics-policy-generator) provides a script to help you create policies to monitor the specific resource types that you choose.

When you've determined which policies to deploy, you can [deploy them to your delegated subscriptions at scale](policy-at-scale.md).

## Analyze the gathered data

After you've deployed your policies, data will be logged in the Log Analytics workspaces you've created in each customer tenant. To gain insights across all managed customers, you can use tools such as [Azure Monitor Workbooks](../../azure-monitor/visualize/workbooks-overview.md) to gather and analyze information from multiple data sources.

## Query data across customer workspaces

You can run [log queries](../../azure-monitor/logs/log-query-overview.md) to retrieve data across Log Analytics workspaces in different customer tenants by creating a union that includes multiple workspaces. By including the TenantID column, you can see which results belong to which tenants.

The following example query creates a union on the AzureDiagnostics table across workspaces in two separate customer tenants. The results show the Category, ResourceGroup, and TenantID columns.

``` Kusto
union AzureDiagnostics,
workspace("WS-customer-tenant-1").AzureDiagnostics,
workspace("WS-customer-tenant-2").AzureDiagnostics
| project Category, ResourceGroup, TenantId
```

For more examples of queries across multiple Log Analytics workspaces, see [Create a log query across multiple workspaces and apps in Azure Monitor](../../azure-monitor/logs/cross-workspace-query.md).

> [!IMPORTANT]
> If you use an automation account used to query data from a Log Analytics workspace, that automation account must be created in the same tenant as the workspace.

## View alerts across customers

You can view [alerts](../../azure-monitor/alerts/alerts-overview.md) for delegated subscriptions in the customer tenants that you manage.

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
