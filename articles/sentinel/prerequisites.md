---
title: Prerequisites for deploying Azure Sentinel
description: Learn about pre-deployment activities and prerequisites for deploying Azure Sentinel.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 07/21/2021
---

# Pre-deployment activities and prerequisites for deploying Azure Sentinel

This article describes the pre-deployment activities, prerequisites, and architectural best practices for deploying Azure Sentinel.

## Pre-deployment activities

Before deploying Azure Sentinel, we recommend taking the following steps to help focus your deployment on providing maximum value, as soon as possible.

1. Determine which [data sources](connect-data-sources.md) you need and the data size requirements to help you accurately project your deployment's budget and timeline.

    You might determine this information during your business use case review, or by evaluating a current SIEM that you already have in place. If you already have a SIEM in place, analyze your data to understand which data sources provide the most value and should be ingested into Azure Sentinel.

1. After the business use cases, data sources, and data size requirements have been identified, [start planning your budget](azure-sentinel-billing.md). Use a budget for your Azure Sentinel workspace to help ensure a smooth deployment, without stalls or unplanned costs. Your budget should cover the cost of:

    - Data ingestion for both Azure Sentinel and Azure Log Analytics
    - Playbooks that will be deployed
    - Any [long-term retention solutions](store-logs-in-azure-data-explorer.md) you may have planned.

1. Nominate an engineer or architect lead the deployment, based on requirements and timelines. This individual should lead the deployment and be the main point of contact on your team.

## Azure tenant requirements

Before deploying Azure Sentinel, make sure that your Azure tenant has the following requirements:

- An [Azure Active Directory license and tenant](/azure/active-directory/develop/quickstart-create-new-tenant), or an [individual account with a valid payment method](https://azure.microsoft.com/en-us/free/), are required to access Azure and deploy resources.

- After you have a tenant, you must have an [Azure subscription](/azure/cost-management-billing/manage/create-subscription) to track resource creation and billing.

- After you have a subscription, you'll need the [relevant permissions](/azure/role-based-access-control/) to begin using your subscription. If you are using a new subscription, an admin or higher from the AAD tenant should be designated as the [owner/contributor](/azure/role-based-access-control/rbac-and-directory-admin-roles) for the subscription.

    - To maintain the least privileged access available, assign roles at the level of the resource group.
    - For more control over permissions and access, set up custom roles. For more information, see [Role-based access control](/azure/role-based-access-control/custom-roles).
    - For extra separation between users and security users, you might want to use [resource-context](resource-context-rbac.md) or [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043).

    For more information about other roles and permissions supported for Azure Sentinel, see [Permissions in Azure Sentinel](roles.md).

- A [Log Analytics workspace](/azure/azure-monitor/learn/quick-create-workspace) is required to house all of the data that Azure Sentinel will be ingesting and using for its detections, analytics, and other features. For more information, see [Workspace best practices](#workspace-best-practices).

> [!TIP]
> When setting up your Azure Sentinel workspace, [create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) that's dedicated to Azure Sentinel and the resources that Azure Sentinel users including the Log Analytics workspace, any playbooks, workbooks, and so on.
>
> A dedicated resource group allows for permissions to be assigned once, at the resource group level, with permissions automatically applied to any relevant resources. Managing access via a resource group helps to ensure that you're using Azure Sentinel efficiently without potentially issuing improper permissions. Without a resource group for Azure Sentinel, where resources are scattered among multiple resource groups, a user or service principal may find themselves unable to perform a required action or view data due to insufficient permissions.
>
> To implement more access control to resources by tiers, use extra resource groups to house the resources that should be accessed only by those groups. Using multiple tiers of resource groups enables you to separate access between those tiers.
>

## Workspace best practices

Use the following best practice guidance when creating the Log Analytics workspace you'll use for Azure Sentinel:

- **When naming your workspace**, include *Azure Sentinel* or some other indicator in the name, so that it's easily identified among your other workspaces.

- **Use the same workspace for both Azure Sentinel and Azure Security Center**, so that all logs collected by Azure Security Center can also be ingested and used by Azure Sentinel. The default workspace created by Azure Security Center will not appear as an available workspace for Azure Sentinel.

- **Use a dedicated workspace cluster if your projected data ingestion is around or more than 1 TB per day**. A [dedicated cluster](/azure/azure-monitor/logs/logs-dedicated-clusters) enables you to secure resources for your Azure Sentinel data, which enables better query performance for large data sets. Dedicated clusters also provide the option for more encryption and control of your organization's keys.

- **Use a single workspace, unless you have a specific need for multiple tenants and workspaces**. Most Azure Sentinel features operate by using a single workspace per Azure Sentinel instance.

    Keep in mind that Azure Sentinel ingests all logs housed within the workspace. Therefore, if you have both security-related and non-security logs, or logs that should not be ingested by Azure Sentinel, create an extra workspace to store the non-Azure Sentinel logs and avoid unwanted costs.

    The following image shows an architecture where security and non-security logs go to separate workspaces, with Azure Sentinel ingesting only the security-related logs.

    :::image type="content" source="media/best-practices/separate-workspaces-for-different-logs.png" alt-text="Separate workspaces for security-related logs and non-security logs.":::

### Multiple tenants and working across workspaces

If you are using Azure Sentinel across multiple tenants, such as if you're a managed security service provider (MSSP), use [Azure Lighthouse](/azure/lighthouse/how-to/onboard-customer) to help manage multiple Azure Sentinel instances in different tenants.

- To reference data that's held in other Azure Sentinel workspaces, such as in [cross-workspace workbooks](extend-sentinel-across-workspaces-tenants.md#cross-workspace-workbooks), use [cross-workspace queries](extend-sentinel-across-workspaces-tenants.md).
- To simplify incident management and investigation, [condense and list all incidents from each Azure Sentinel instance in a single location](multiple-workspace-view.md).

The best time to use cross-workspace queries is when valuable information is stored in a different workspace, subscription or tenant, and can provide value to your current action. For example, the following code shows a sample cross-workspace query:

```Kusto
union Update, workspace("contosoretail-it").Update, workspace("WORKSPACE ID").Update
| where TimeGenerated >= ago(1h)
| where UpdateState == "Needed"
| summarize dcount(Computer) by Classification
```

For more information, see [Protecting MSSP intellectual property in Azure Sentinel](mssp-protect-intellectual-property.md).

### Working with multiple regions

If you are deploying Azure Sentinel in multiple regions, consider the following best practice recommendations:

- Use templates for your analytics rules, custom queries, workbooks, and other resources to make your deployments more efficient. Deploy the templates instead of manually deploying each resource in each region.

- Use separate Azure Sentinel instances for each region. While Azure Sentinel can be used in multiple regions, you may have requirements to separate data by team, region, or site, or regulations and controls that make multi-region models impossible or more complex than needed.

    Using separate instances and workspaces for each region helps to avoid bandwidth / egress costs for moving data across regions.

For more information, see [Data residency in Azure](https://azure.microsoft.com/en-us/global-infrastructure/data-residency/).

## Consider cost and data retention plans

When structuring your Azure Sentinel instance, consider Azure Sentinel's cost and billing structure.

For more information, see:

- [Azure Sentinel costs and billing](azure-sentinel-billing.md)
- [Azure Sentinel pricing](https://azure.microsoft.com/en-us/pricing/details/azure-sentinel/)
- [Log Analytics pricing](https://azure.microsoft.com/en-us/pricing/details/monitor/)
- [Logic apps (playbooks) pricing](https://azure.microsoft.com/en-us/pricing/details/logic-apps/)
- [Integrating Azure Data Explorer for long-term log retention](store-logs-in-azure-data-explorer.md)

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
