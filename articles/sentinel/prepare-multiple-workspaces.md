---
title: Prepare for multiple workspaces and tenants in Microsoft Sentinel
description: To prepare for your deployment, learn how Microsoft Sentinel can extend across multiple workspaces and tenants.
author: batamig
ms.topic: conceptual
ms.date: 08/15/2024
ms.author: bagol
ms.service: microsoft-sentinel
#Customer intent: As a SOC architect, I want to learn about how Microsoft Sentinel can extend across workspaces so I can determine whether I need this capability and prepare accordingly.
---

# Prepare for multiple workspaces and tenants in Microsoft Sentinel

To prepare for your deployment, you need to determine whether a multiple workspace architecture is relevant for your environment. In this article, you learn how Microsoft Sentinel can extend across multiple workspaces and tenants so you can determine whether this capability suits your organization's needs. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

If you've decided to set up your environment to extend across workspaces, see [Extend Microsoft Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md) and [Centrally manage multiple Microsoft Sentinel workspaces with workspace manager](workspace-manager.md). 

## The need to use multiple Microsoft Sentinel workspaces

When you onboard Microsoft Sentinel, your first step is to select your Log Analytics workspace. While you can get the full benefit of the Microsoft Sentinel experience with a single workspace, in some cases, you might want to extend your workspace to query and analyze your data across workspaces and tenants.

This table lists some of these scenarios and, when possible, suggests how you might use a single workspace for the scenario.

| Requirement | Description | Ways to reduce workspace count |
|-------------|-------------|--------------------------------|
| **Sovereignty and regulatory compliance** | A workspace is tied to a specific region. To keep data in different [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/) to satisfy regulatory requirements, split up the data into separate workspaces. <br><br>In Microsoft Sentinel, data is mostly stored and processed in the same geography or region, with some exceptions, such as when using detection rules that leverage Microsoft's Machine learning. In such cases, data might be copied outside your workspace geography for processing. |  |
| **Data ownership** | The boundaries of data ownership, for example by subsidiaries or affiliated companies, are better delineated using separate workspaces. |  |
| **Multiple Azure tenants** | Microsoft Sentinel supports data collection from Microsoft and Azure SaaS resources only within its own Microsoft Entra tenant boundary. Therefore, each Microsoft Entra tenant requires a separate workspace. |  |
| **Granular data access control** | An organization might need to allow different groups, within or outside the organization, to access some of the data collected by Microsoft Sentinel. For example:<br><ul><li>Resource owners' access to data pertaining to their resources</li><li>Regional or subsidiary SOCs' access to data relevant to their parts of the organization</li></ul> | Use [resource Azure RBAC](resource-context-rbac.md) or [table level Azure RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043) |
| **Granular retention settings** | Historically, multiple workspaces were the only way to set different retention periods for different data types. This is no longer needed in many cases, thanks to the introduction of table level retention settings. | Use [table level retention settings](https://techcommunity.microsoft.com/t5/azure-sentinel/new-per-data-type-retention-is-now-available-for-azure-sentinel/ba-p/917316) or automate [data deletion](../azure-monitor/logs/personal-data-mgmt.md#exporting-and-deleting-personal-data) |
| **Split billing** | By placing workspaces in separate subscriptions, they can be billed to different parties. | Usage reporting and cross-charging |
| **Legacy architecture** | The use of multiple workspaces might stem from a historical design that took into consideration limitations or best practices which don't hold true anymore. It might also be an arbitrary design choice that can be modified to better accommodate Microsoft Sentinel.<br><br>Examples include:<br><ul><li>Using a per-subscription default workspace when deploying Microsoft Defender for Cloud</li><li>The need for granular access control or retention settings, the solutions for which are relatively new</li></ul> | Re-architect workspaces |

When determining how many tenants and workspaces to use, consider that most Microsoft Sentinel features operate by using a single workspace or Microsoft Sentinel instance, and Microsoft Sentinel ingests all logs housed within the workspace.

### Managed Security Service Provider (MSSP)

In case of an MSSP, many if not all of the above requirements apply, making multiple workspaces, across tenants, the best practice. Specifically, we recommend that you create at least one workspace for each Microsoft Entra tenant to support built-in, [service to service data connectors](connect-data-sources.md#service-to-service-integration-for-data-connectors) that work only within their own Microsoft Entra tenant.

- Connectors that are based on diagnostics settings can't be connected to a workspace that isn't located in the same tenant where the resource resides. This applies to connectors such as [Azure Firewall](./data-connectors/azure-firewall.md), [Azure Storage](./data-connectors/azure-storage-account.md), [Azure Activity](./data-connectors/azure-activity.md) or [Microsoft Entra ID](connect-azure-active-directory.md).

- [Partner data connectors](data-connectors-reference.md) are often based on API or agent collections, and therefore are not attached to a specific Microsoft Entra tenant.

Use [Azure Lighthouse](../lighthouse/how-to/onboard-customer.md) to help manage multiple Microsoft Sentinel instances in different tenants.u

## Microsoft Sentinel multiple workspace architecture

As implied by the requirements above, there are cases where a single SOC needs to centrally manage and monitor multiple Microsoft Sentinel workspaces, potentially across Microsoft Entra tenants.

- An MSSP Microsoft Sentinel Service.
- A global SOC serving multiple subsidiaries, each having its own local SOC.
- A SOC monitoring multiple Microsoft Entra tenants within an organization.

To address these cases, Microsoft Sentinel offers multiple-workspace capabilities that enable central monitoring, configuration, and management, providing a single pane of glass across everything covered by the SOC. This diagram shows an example architecture for such use cases. 

:::image type="content" source="media/extend-sentinel-across-workspaces-tenants/cross-workspace-architecture.png" alt-text="Diagram showing extend workspace across multiple tenants: architecture.":::

This model offers significant advantages over a fully centralized model in which all data is copied to a single workspace:

- Flexible role assignment to the global and local SOCs, or to the MSSP its customers.
- Fewer challenges regarding data ownerships, data privacy and regulatory compliance.
- Minimal network latency and charges.
- Easy onboarding and offboarding of new subsidiaries or customers.

## Next steps

In this article, you learned how Microsoft Sentinel can extend across multiple workspaces and tenants.

> [!div class="nextstepaction"]
> [Prioritize data connectors](prioritize-data-connectors.md)
