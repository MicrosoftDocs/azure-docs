---
title: Prepare for multiple workspaces and tenants in Microsoft Sentinel
description: To prepare for your deployment, learn how Microsoft Sentinel can extend across multiple workspaces and tenants.
author: limwainstein
ms.topic: conceptual
ms.date: 06/28/2023
ms.author: lwainstein
ms.service: microsoft-sentinel
#Customer intent: As a SOC architect, I want to learn about how Microsoft Sentinel can extend across workspaces so I can determine whether I need this capability and prepare accordingly.
---

# Prepare for multiple workspaces and tenants in Microsoft Sentinel

To prepare for your deployment, you need to determine whether a multiple workspace architecture is relevant for your environment. In this article, you learn how Microsoft Sentinel can extend across multiple workspaces and tenants so you can determine whether this capability suits your organization's needs.

If you've determined and set up your environment to extend across workspaces, you can [manage and monitor cross-workspace architecture](extend-sentinel-across-workspaces-tenants.md) or [manage multiple workspaces with workspace manager](workspace-manager.md). 

## The need to use multiple Microsoft Sentinel workspaces

When you onboard Microsoft Sentinel, your first step is to select your Log Analytics workspace. While you can get the full benefit of the Microsoft Sentinel experience with a single workspace, in some cases, you might want to extend your workspace to query and analyze your data across workspaces and tenants.

This table lists some of these scenarios and, when possible, suggests how you may use a single workspace for the scenario.

| Requirement | Description | Ways to reduce workspace count |
|-------------|-------------|--------------------------------|
| Sovereignty and regulatory compliance | A workspace is tied to a specific region. To keep data in different [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/) to satisfy regulatory requirements, split up the data into separate workspaces. |  |
| Data ownership | The boundaries of data ownership, for example by subsidiaries or affiliated companies, are better delineated using separate workspaces. |  |
| Multiple Azure tenants | Microsoft Sentinel supports data collection from Microsoft and Azure SaaS resources only within its own Azure Active Directory (Azure AD) tenant boundary. Therefore, each Azure AD tenant requires a separate workspace. |  |
| Granular data access control | An organization may need to allow different groups, within or outside the organization, to access some of the data collected by Microsoft Sentinel. For example:<br><ul><li>Resource owners' access to data pertaining to their resources</li><li>Regional or subsidiary SOCs' access to data relevant to their parts of the organization</li></ul> | Use [resource Azure RBAC](resource-context-rbac.md) or [table level Azure RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043) |
| Granular retention settings | Historically, multiple workspaces were the only way to set different retention periods for different data types. This is no longer needed in many cases, thanks to the introduction of table level retention settings. | Use [table level retention settings](https://techcommunity.microsoft.com/t5/azure-sentinel/new-per-data-type-retention-is-now-available-for-azure-sentinel/ba-p/917316) or automate [data deletion](../azure-monitor/logs/personal-data-mgmt.md#exporting-and-deleting-personal-data) |
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

## Next steps

In this article, you learned how Microsoft Sentinel can extend across multiple workspaces and tenants.

> [!div class="nextstepaction"]
>>[Prioritize data connectors](prioritize-data-connectors.md)