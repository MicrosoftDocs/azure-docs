---
title: Monitor delegated resources at scale
description: Learn how to effectively use Azure Monitor Logs in a scalable way across the customer tenants you're managing.
ms.date: 02/03/2020
ms.topic: how-to
---

# Monitor delegated resources at scale

As a service provider, you may have onboarded multiple customer tenants for Azure delegated resource management. [Azure Lighthouse](../overview.md) allows service providers to perform operations at scale across several tenants at once, making management tasks more efficient.

This topic shows you how to use [Azure Monitor Logs](../../azure-monitor/platform/data-platform-logs.md) in a scalable way across the customer tenants you're managing.

## Create Log Analytics workspaces

In order to collect data, you'll need to create Log Analytics workspaces. These Log Analytics workspaces are unique environments for data collected by Azure Monitor. Each workspace has its own data repository and configuration, and data sources and solutions are configured to store their data in a particular workspace.

We recommend creating these workspaces directly in the customer tenants. This way their data remains in their tenants rather than being exported into yours. This also allows centralized monitoring of any resources or services supported by Log Analytics, giving you more flexibility on what types of data you monitor.

You can create a Log Analytics workspace by using the [Azure portal](../../azure-monitor/learn/quick-create-workspace.md), by using [Azure CLI](../../azure-monitor/learn/quick-create-workspace-cli.md), or by using [Azure PowerShell](../../azure-monitor/learn/quick-create-workspace-posh.md).

## Deploy policies that log data

Once you've created your Log Analytics workspaces, you can deploy [Azure Policy](../../governance/policy/index.yml) across your customer hierarchies so that diagnostic data is sent to the appropriate workspace in each tenant. The exact policies you deploy may vary depending on the resource types that you want to monitor.

To learn more about creating policies, see [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md). This [community tool](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/tools/azure-diagnostics-policy-generator) provides a script to help you create policies to monitor the specific resource types that you choose.

When you've determined which policies to deploy, you can [deploy them to your delegated subscriptions at scale](policy-at-scale.md).

## Analyze the gathered data

After you've deployed your policies, data will be logged in the Log Analytics workspaces you've created in each customer tenant. To gain insights across all managed customers, you can use tools such as [Azure Monitor Workbooks](../../azure-monitor/platform/workbooks-overview.md) to gather and analyze information from multiple data sources.

## Next steps

- Learn about [Azure Monitor](../../azure-monitor/index.yml).
- Learn about [Azure Monitor Logs](../../azure-monitor/platform/data-platform-logs.md).
- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
