---
title: Extend Microsoft Sentinel across workspaces and tenants
description: How to use Microsoft Sentinel to query and analyze data across workspaces and tenants.
author: yelevin
ms.topic: conceptual
ms.date: 07/14/2022
ms.author: yelevin
#Customer intent: As a security operator, I want to extend my workspace so I can query and analyze data across workspaces and tenants.
---

# Extend Microsoft Sentinel across workspaces and tenants

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

## The need to use multiple Microsoft Sentinel workspaces

When you onboard Microsoft Sentinel, your first step is to select your Log Analytics workspace. While you can get the full benefit of the Microsoft Sentinel experience with a single workspace, in some cases, you might want to extend your workspace to query and analyze your data across workspaces and tenants.

This table lists some of these scenarios and, when possible, suggests how you may use a single workspace for the scenario.

| Requirement | Description | Ways to reduce workspace count |
|-------------|-------------|--------------------------------|
| Sovereignty and regulatory compliance | A workspace is tied to a specific region. To keep data in different [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/) to satisfy regulatory requirements, split up the data into separate workspaces. |  |
| Data ownership | The boundaries of data ownership, for example by subsidiaries or affiliated companies, are better delineated using separate workspaces. |  |
| Multiple Azure tenants | Microsoft Sentinel supports data collection from Microsoft and Azure SaaS resources only within its own Azure Active Directory (Azure AD) tenant boundary. Therefore, each Azure AD tenant requires a separate workspace. |  |
| Granular data access control | An organization may need to allow different groups, within or outside the organization, to access some of the data collected by Microsoft Sentinel. For example:<br><ul><li>Resource owners' access to data pertaining to their resources</li><li>Regional or subsidiary SOCs' access to data relevant to their parts of the organization</li></ul> | Use [resource Azure RBAC](resource-context-rbac.md) or [table level Azure RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043) |
| Granular retention settings | Historically, multiple workspaces were the only way to set different retention periods for different data types. This is no longer needed in many cases, thanks to the introduction of table level retention settings. | Use [table level retention settings](https://techcommunity.microsoft.com/t5/azure-sentinel/new-per-data-type-retention-is-now-available-for-azure-sentinel/ba-p/917316) or automate [data deletion]([Managing personal data in Log Analytics and Application Insights](../azure-monitor/logs/personal-data-mgmt.md#exporting-and-deleting-personal-data) |
| Split billing | By placing workspaces in separate subscriptions, they can be billed to different parties. | Usage reporting and cross-charging |
| Legacy architecture | The use of multiple workspaces may stem from a historical design that took into consideration limitations or best practices which don't hold true anymore. It might also be an arbitrary design choice that can be modified to better accommodate Microsoft Sentinel.<br><br>Examples include:<br><ul><li>Using a per-subscription default workspace when deploying Microsoft Defender for Cloud</li><li>The need for granular access control or retention settings, the solutions for which are relatively new</li></ul> | Re-architect workspaces |

### Managed Security Service Provider (MSSP)

In case of an MSSP, many if not all of the above requirements apply, making multiple workspaces, across tenants, the best practice. The MSSP can use [Azure Lighthouse](../lighthouse/overview.md) to extend Microsoft Sentinel cross-workspace capabilities across tenants.

## Microsoft Sentinel multiple workspace architecture

As implied by the requirements above, there are cases where a single SOC needs to centrally manage and monitor multiple Microsoft Sentinel workspaces, potentially across Azure Active Directory (Azure AD) tenants.

- An MSSP Microsoft Sentinel Service.

- A global SOC serving multiple subsidiaries, each having its own local SOC.

- A SOC monitoring multiple Azure AD tenants within an organization.

To address these cases, Microsoft Sentinel offers multiple-workspace capabilities that enable central monitoring, configuration, and management, providing a single pane of glass across everything covered by the SOC. This diagram shows an example architecture for such use cases. 

:::image type="content" source="media/extend-sentinel-across-workspaces-tenants/cross-workspace-architecture.png" alt-text="Diagram showing extend workspace across multiple tenants: architecture.":::

This model offers significant advantages over a fully centralized model in which all data is copied to a single workspace:

- Flexible role assignment to the global and local SOCs, or to the MSSP its customers.

- Fewer challenges regarding data ownerships, data privacy and regulatory compliance.

- Minimal network latency and charges.

- Easy onboarding and offboarding of new subsidiaries or customers.

In the following sections, we'll explain how to operate this model, and particularly how to:

- Centrally monitor multiple workspaces, potentially across tenants, providing the SOC with a single pane of glass.

- Centrally configure and manage multiple workspaces, potentially across tenants, using automation.

## Cross-workspace monitoring

### Manage incidents on multiple workspaces

Microsoft Sentinel supports a [multiple workspace incident view](./multiple-workspace-view.md) where you can centrally manage and monitor incidents across multiple workspaces. The centralized incident view lets you manage incidents directly or drill down transparently to the incident details in the context of the originating workspace.

### Cross-workspace querying

You can query [multiple workspaces](../azure-monitor/logs/cross-workspace-query.md), allowing you to search and correlate data from multiple workspaces in a single query.

- Use the [workspace() expression](../azure-monitor/logs/workspace-expression.md) to refer to a table in a different workspace.

- Use the [union operator](/azure/data-explorer/kusto/query/unionoperator?pivots=azuremonitor) alongside the workspace() expression to apply a query across tables in multiple workspaces.

You can use saved [functions](../azure-monitor/logs/functions.md) to simplify cross-workspace queries. For example, if a reference to a workspace is long, you may want to save the expression `workspace("customer-A's-hard-to-remember-workspace-name").SecurityEvent` as a function called `SecurityEventCustomerA`. You can then write queries as `SecurityEventCustomerA | where ...` .

A function can also simplify a commonly used union. For example, you can save the following expression as a function called `unionSecurityEvent`:

`union workspace("hard-to-remember-workspace-name-1").SecurityEvent, workspace("hard-to-remember-workspace-name-2").SecurityEvent`

You can then write a query across both workspaces by beginning with `unionSecurityEvent | where ...` .

#### Cross-workspace analytics rules<a name="scheduled-alerts"></a>
<!-- Bookmark added for backward compatibility with old heading -->
You can now include cross-workspace queries in scheduled analytics rules. You can use cross-workspace analytics rules in a central SOC, and across tenants (using Azure Lighthouse), suitable for MSSPs. Note these limitations:

- You can include **up to 20 workspaces** in a single query.
- You must deploy Microsoft Sentinel **on every workspace** referenced in the query.
- Alerts generated by a cross-workspace analytics rule, and the incidents created from them, exist **only in the workspace where the rule was defined**. The alerts won't be displayed in any of the other workspaces referenced in the query.

Alerts and incidents created by cross-workspace analytics rules contain all the related entities, including those from all the referenced workspaces and the "home" workspace (where the rule was defined). This way, analysts get a full picture of alerts and incidents.

> [!NOTE]
> Querying multiple workspaces in the same query might affect performance, and therefore is recommended only when the logic requires this functionality.

#### Cross-workspace workbooks<a name="using-cross-workspace-workbooks"></a>
<!-- Bookmark added for backward compatibility with old heading -->

Workbooks provide dashboards and apps to Microsoft Sentinel. When working with multiple workspaces, workbooks provide monitoring and actions across workspaces.

Workbooks can provide cross-workspace queries in one of three methods, suitable for different levels of end-user expertise:

| Method  | Description | When should I use? |
|---------|-------------|--------------------|
| Write cross-workspace queries | The workbook creator can write cross-workspace queries (described above) in the workbook. | I want the workbook creator to create a workspace structure that is transparent to the user. |
| Add a workspace selector to the workbook | The workbook creator can [implement a workspace selector as part of the workbook](https://techcommunity.microsoft.com/t5/azure-sentinel/making-your-azure-sentinel-workbooks-multi-tenant-or-multi/ba-p/1402357). | I want to allow the user to control the workspaces shown by the workbook, with an easy-to-use dropdown box. |
| Edit the workbook interactively | An advanced user modifying an existing workbook can edit the queries in it, selecting the target workspaces using the workspace selector in the editor. | I want to allow a power user to easily modify existing workbooks to work with multiple workspaces. |

#### Cross-workspace hunting

Microsoft Sentinel provides preloaded query samples designed to get you started and get you familiar with the tables and the query language. Microsoft security researchers constantly add new built-in queries and fine-tune existing queries. You can use these queries to look for new detections and identify signs of intrusion that your security tools may have missed.  

Cross-workspace hunting capabilities enable your threat hunters to create new hunting queries, or adapt existing ones, to cover multiple workspaces, by using the union operator and the workspace() expression as shown [above](#cross-workspace-querying).

## Cross-workspace management using automation

To configure and manage multiple Microsoft Sentinel workspaces, you need to automate the use of the Microsoft Sentinel management API. 

- Learn how to [automate the deployment of Microsoft Sentinel resources](https://techcommunity.microsoft.com/t5/azure-sentinel/extending-azure-sentinel-apis-integration-and-management/ba-p/1116885), including alert rules, hunting queries, workbooks and playbooks.
- Learn how to [deploy custom content from your repository](ci-cd.md). This resource provides a consolidated methodology for managing Microsoft Sentinel as code and for deploying and configuring resources from a private Azure DevOps or GitHub repository.

## Manage workspaces across tenants using Azure Lighthouse

As mentioned above, in many scenarios, the different Microsoft Sentinel workspaces can be located in different Azure AD tenants. You can use [Azure Lighthouse](../lighthouse/overview.md) to extend all cross-workspace activities across tenant boundaries, allowing users in your managing tenant to work on Microsoft Sentinel workspaces across all tenants. 

Once Azure Lighthouse is [onboarded](../lighthouse/how-to/onboard-customer.md), use the [directory + subscription selector](./multiple-tenants-service-providers.md#how-to-access-microsoft-sentinel-in-managed-tenants) on the Azure portal to select all the subscriptions containing workspaces you want to manage, in order to ensure that they'll all be available in the different workspace selectors in the portal.

When using Azure Lighthouse, it's recommended to create a group for each Microsoft Sentinel role and delegate permissions from each tenant to those groups.

## Next steps

In this article, you learned how Microsoft Sentinel's capabilities can be extended across multiple workspaces and tenants. For practical guidance on implementing Microsoft Sentinel's cross-workspace architecture, see the following articles:

- Learn how to [work with multiple tenants](./multiple-tenants-service-providers.md) in Microsoft Sentinel, using Azure Lighthouse.
- Learn how to [view and manage incidents in multiple workspaces](./multiple-workspace-view.md) seamlessly.
