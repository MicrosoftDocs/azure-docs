---  
title: Asset data in Microsoft Sentinel data lake  (Preview)
titleSuffix: Microsoft Security  
description: Asset data in security data lake 
author: mberdugo  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-graph
ms.date: 06/11/2025
ms.author: monaberdugo  

ms.collection: ms-security  
---

# Manage data connectors in the Microsoft Sentinel data lake (preview)

This article explains how to enable and manage asset data (data connectors) from the data lake in Microsoft Sentinel. Data in the data lake can be ingested and managed through data connectors. These connectors allow you to integrate various data sources into Microsoft Sentinel, enabling enhanced security monitoring and threat detection capabilities.

## Data connectors overview

Enabling data connectors involves integrating and managing various data sources to enhance security monitoring and threat detection capabilities.

The following data sources and data connectors are available in the Microsoft Sentinel data lake (Public Preview):

### Azure Resource Graph (ARG) Asset Data

- **Tables**: [ARGResources](./data-source-tables.md#arg-resources), [ARGResourceContainers](./data-source-tables.md#arg-resource-containers), [ARGAuthorizationResources](./data-source-tables.md#arg-authorization-resources).
- **Enablement**: Automatic onboarding for users with owner role permissions or higher.
- **Data Connector**: Azure Resource Graph
- **Data Freshness**: Snapshot taken every 90 minutes.
- **Retention Period**: Default is 30 days, adjustable up to 12 years.

### Microsoft Entra ID Asset Data

- **Tables:** [EntraApplications](./data-source-tables.md#microsoft-entra-applications), [EntraGroupMemberships](./data-source-tables.md#microsoft-entra-group-memberships), [EntraGroups](./data-source-tables.md#microsoft-entra-groups), [EntraMembers](./data-source-tables.md#microsoft-entra-members), [EntraOrganizations](./data-source-tables.md#microsoft-entra-organizations), [EntraServicePrincipals](./data-source-tables.md#microsoft-entra-service-principals), [EntraUsers](./data-source-tables.md#microsoft-entra-users).
- **Enablement:** Automatic onboarding for Sentinel contributors.
- **Data Connector:** None for Microsoft Sentinel data lake’s Public Preview. ????
- **Data Freshness:** Snapshot taken every 4 hours.
- **Retention Period:** Default is 30 days, adjustable up to 12 years.

### Microsoft 365 Asset Data

- **Tables:** [SharePointSitesAndLists](./data-source-tables.md#sharepoint-sites-and-lists).
- **Enablement:** Automatic onboarding for users with security administrator roles or higher. Microsoft 365 (formerly, Office 365) activity log connector must be enabled in the Sentinel data lake connected workspace.
- **Data Connector:** Microsoft 365 Assets (formerly, Office 365)
- **Data Freshness:** Snapshot taken every 24 hours.
- **Retention Period:** Default is 30 days, adjustable up to 12 years.

| Data Source                  | Tables                                                                                                                                                                                                                                         | Enablement                                                                                                                        | Data Connector                                 | Data Freshness                  | Retention Period                                 |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|-------------------------------|--------------------------------------------------|
| Azure Resource Graph (ARG)   | [ARGResources](./data-source-tables.md#arg-resources), [ARGResourceContainers](./data-source-tables.md#arg-resource-containers), [ARGAuthorizationResources](./data-source-tables.md#arg-authorization-resources)                           | Automatic onboarding for users with owner role permissions or higher.                                                             | Azure Resource Graph                            | Snapshot taken every 90 minutes. | Default is 30 days, adjustable up to 12 years.   |
| Microsoft Entra ID           | [EntraApplications](./data-source-tables.md#microsoft-entra-applications), [EntraGroupMemberships](./data-source-tables.md#microsoft-entra-group-memberships), [EntraGroups](./data-source-tables.md#microsoft-entra-groups), [EntraMembers](./data-source-tables.md#microsoft-entra-members), [EntraOrganizations](./data-source-tables.md#microsoft-entra-organizations), [EntraServicePrincipals](./data-source-tables.md#microsoft-entra-service-principals), [EntraUsers](./data-source-tables.md#microsoft-entra-users) | Automatic onboarding for Sentinel contributors.                                                                                   | None for Microsoft Sentinel data lake’s Public Preview. | Snapshot taken every 4 hours.   | Default is 30 days, adjustable up to 12 years.   |
| Microsoft 365                | [SharePointSitesAndLists](./data-source-tables.md#sharepoint-sites-and-lists)                                                                                                                              | Automatic onboarding for users with security administrator roles or higher. Microsoft 365 (formerly, Office 365) activity log connector must be enabled in the Sentinel data lake connected workspace. | Microsoft 365 Assets (formerly, Office 365)     | Snapshot taken every 24 hours.   | Default is 30 days, adjustable up to 12 years.   |

## Prerequisites

To enable and manage data connectors in the Microsoft Sentinel data lake, you need to meet the following prerequisites:

- Ensure you have the necessary [access and permissions](../roles.md#microsoft-sentinel-roles-permissions-and-allowed-actions) to Microsoft Sentinel.
- Install the [necessary solutions](../sentinel-solutions-catalog.md) from the Content Hub in Microsoft Sentinel.

## Configure and Manage

1. Enable Data Connectors

    - Enable the data connector and use it to enable / disable ingesting data.
    - Review prerequisites for each data connector.

1. Find and Manage Data

    - Use the Table Management documentation for details on tiering options and retention settings.
    - Query data in the Microsoft Sentinel data lake.
