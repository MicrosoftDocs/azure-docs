---
title: Using Azure Sentinel across workspaces and tenants | Microsoft Docs
description:  How to work with multiple tenants to Azure Sentinel for MSSP service providers.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/03/2020
ms.author: yelevin

---
# Using Azure Sentinel across workspaces and tenants

## The need to use multiple Azure Sentinel workspaces

Azure Sentinel is built on top of a Log Analytics workspace. As such, the first thing you'll do in setting up Azure Sentinel will be selecting the Log Analytics workspace you wish to work with.

You can benefit from the full Azure Sentinel experience when using a single workspace. However, there are some reasons to have multiple workspaces. The following table lists situations that may require the use of multiple Azure Sentinel workspaces, and, when possible, suggests how the requirement may be satisfied with a single workspace:

| Requirement | Description | Ways to reduce workspace count |
|-------------|-------------|--------------------------------|
| Sovereignty and regulatory compliance | A workspace is deployed in a region. If data needs to be kept in a different geography due to regulatory requirements, it needs to be split to multiple workspaces. |  |
| Data ownership | Data ownership, for example by subsidiaries or affiliated companies, is better delineated using workspace boundaries. |  |
| Multiple Azure tenants | Azure Sentinel supports collection from Microsoft and Azure resources only within an Azure AD tenant boundary. Therefore, each Azure AD tenant requires a separate workspace. |  |
| Granular data access control | Some organizations may need to provide access to some of the data collected by Azure Sentinel to different groups in, or outside of, the organization. For example:<br><ul><li>Provide access to resource owners to data pertaining to their resources.</li><li>Providing a regional or subsidiary SOC access to data relevant to their part of the organization.</li></ul> | Use [resource RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/controlling-access-to-azure-sentinel-data-resource-rbac/ba-p/1301463) or [table level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043) |
| Granular retention settings | Historically, multiple workspaces were used to set different retention periods to different data types. This is no longer needed in many cases due to the introduction of table level retention settings. | Use [table level retention setting](https://techcommunity.microsoft.com/t5/azure-sentinel/new-per-data-type-retention-is-now-available-for-azure-sentinel/ba-p/917316) or automate [data deletion](../azure-monitor/platform/personal-data-mgmt.md#how-to-export-and-delete-private-data) |
| Split billing | By placing workspaces in separate subscriptions, they can be billed to different parties. | Usage reporting and cross-charging |
| Legacy architecture | The use of multiple workspaces may stem from a historical design that took into consideration limitations or best practices which do not hold true anymore. It might also be an arbitrary design choice that can be modified to better accommodate Azure Sentinel.<br><br>Examples include:<br><ul><li>Using a per-subscription default workspace when deploying Azure Security Center</li><li>The need for granular access control or retention settings, the solutions for which are relatively new</li></ul> | Re-architect workspaces |

### Managed Security Service Provider (MSSP)

A particular use case that mandates multiple workspaces is an MSSP Azure Sentinel service. In this case, many if not all of the above requirements apply, making multiple workspaces, across tenants, the best practice.

## Azure Sentinel multiple workspace architecture

In some scenarios, as implied by the requirements above, multiple Azure Sentinel workspaces, potentially across Azure AD tenants, need to be centrally monitored and managed by a single SOC.

- An MSSP Azure Sentinel Service.

- A global SOC serving multiple subsidiaries, each with their own local SOC.

- A SOC monitoring multiple Azure AD tenants within an organization.

To address this requirement, Azure Sentinel offers multi-workspace capabilities that enable central monitoring, configuration, and management, providing a single pane of glass across multiple workspaces, as presented in the diagram below.

:::image type="content" source="media/using-sentinel-across-workspaces-tenants/cross-ws-architecture.png" alt-text="Cross Workspace Architecture":::

This model offers significant advantages over a fully centralized model in which all data is copied to a single workspace:

- Flexible role assignment to the global and local SOCs (or MSSP and customer for an MSSP scenario).

- Less data ownership, data privacy and regulatory challenges.

- Minimal network latency and charges.

- Easy onboarding and offboarding of new subsidiaries or customers.

In the following sections, we will explain how to operate this model, and particularly how to:

- Centrally monitor multiple workspaces, potentially across tenants, providing the SOC with a single pane of glass.

- Centrally configure and manage multiple workspaces, potentially across tenants, using automation.

## Cross-workspace monitoring

### Manage incidents on multiple workspaces

Azure Sentinel supports a [multiple workspace incident view](./multiple-workspace-view.md) facilitating central incident monitoring and management across multiple workspaces. The central incident view let you manage incidents directly or drill down transparently to the incident details in the context of the originating workspace.

### Cross-workspace querying

Azure Sentinel supports querying [multiple workspaces in a single query](../azure-monitor/log-query/cross-workspace-query.md), allowing you to search and correlate data from multiple workspaces in a single query. Use the [workspace() expression](../azure-monitor/log-query/workspace-expression.md) to refer to a table in a different workspace. Use the [union operator](https://docs.microsoft.com/azure/data-explorer/kusto/query/unionoperator?pivots=azuremonitor) alongside the workspace() expression to apply a query across tables in multiple workspaces.

You can use saved [functions](../azure-monitor/log-query/functions.md) to simplify cross-workspace queries. For example, if a reference to a workspace is long, you may want to save the expression `workspace(“customer-A's-hard-to-remember-workspace-name”).SecurityEvent` as a function called `SecurityEventCustomerA`. You can then write queries as `SecurityEventCustomerA | where` … .

A function can also simplify a commonly used union. For example, by saving the following query as a function called `unionSecurityEvent`:

`union workspace(“hard-to-remember-workspace-name-1”).SecurityEvent, workspace(“hard-to-remember-workspace-name-2”).SecurityEvent`

> [!NOTE] Querying multiple workspaces in the same query might affect performance, and therefore is recommended only when the logic requires this capability.

### Use cross-workspace workbooks

[Workbooks](./overview.md#workbooks) provide dashboards and apps to Azure Sentinel. As such, when working with multiple workspaces they provide an overview across workspaces.

Workbooks can provide cross workspace queries in one of three methods, which cater to different levels of end user expertise:

| Method  | Description | When should I use? |
|---------|-------------|--------------------|
| Use cross-workspace queries | The workbook creator can use cross-workspace queries in the workbook. | This option enables Workbook creators to shield the user entirely from the workspace structure. |
| Add a workspace selector to the workbook | The Workspace creator can implement a workspace selector as part of the workbook as described [here](https://techcommunity.microsoft.com/t5/azure-sentinel/making-your-azure-sentinel-workbooks-multi-tenant-or-multi/ba-p/1402357). | This option provides the user with control over the workspaces the Workbook applies to, using an easy to use dropdown box. |
| Edit the workbook interactively | An advanced user that modifies the workbook can select as part of query editing the workspaces it applies to even if the creator did not add a workspace selector | This option enables a power user to easily modify existing Workbooks to work with multiple workspaces. |
|

## Cross-workspace management using automation

To configure and manage multiple Azure Sentinel workspaces you will need to automate the use of the Azure Sentinel management API. For more information on how to automate the deployment of Azure Sentinel resources, including alert rules, hunting queries, workbooks and playbooks refer to [Extending Azure Sentinel: APIs, Integration and management automation](https://techcommunity.microsoft.com/t5/azure-sentinel/extending-azure-sentinel-apis-integration-and-management/ba-p/1116885).

A consolidated community contributed methodology for managing Azure Sentinel as code, deploying and configuring resources from a private GitHub repository, is described in the articles [Deploying and Managing Azure Sentinel as Code](https://techcommunity.microsoft.com/t5/azure-sentinel/deploying-and-managing-azure-sentinel-as-code/ba-p/1131928) and [Combining Azure Lighthouse with Sentinel’s DevOps capabilities](https://techcommunity.microsoft.com/t5/azure-sentinel/combining-azure-lighthouse-with-sentinel-s-devops-capabilities/ba-p/1210966). 


## What's not supported across workspaces?

The following features are not supported across workspaces:

- A scheduled alert rule cannot run across workspaces using a cross-workspace query.

- Hunting queries do not support cross-workspace queries.


## Extending across tenants using Azure Lighthouse

As mentioned above, in many scenarios, the different Azure Sentinel workspaces are located in different Azure AD tenants. Use [Azure Lighthouse](../lighthouse/overview.md) to extend all cross-workspace activities over tenant boundaries. Once Azure Lighthouse is [onboarded](../lighthouse/how-to/onboard-customer.md), to ensure the all workspaces are available in the different workspace selectors in the portal use the [directory + subscription selector](./multiple-tenants-service-providers.md#how-to-access-azure-sentinel-from-other-tenants). 

When using Azure Lighthouse, it is recommended to create a group for each Azure Sentinel role and delegate permissions from each tenant to those groups.

