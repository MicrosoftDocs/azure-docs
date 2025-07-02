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

#Customer intent: As a Microsoft Sentinel user, I want to enable and manage data connectors in the Microsoft Sentinel data lake so that I can ingest and analyze security-related data from various sources.
---

# Enable asset data in the Microsoft Sentinel data lake (preview)

Asset data refers to structured information about digital or physical entities, such as devices, services, applications, or infrastructure components, that are relevant to an organization’s operations, security, or analytics. This article explains how to enable and manage asset data in Microsoft Sentinel's data lake. Data in the data lake is ingested and managed through data connectors. These data connectors allow you to integrate various data sources into Microsoft Sentinel, enabling enhanced security monitoring and threat detection capabilities.

Asset data connectors are automatically enabled for anyone with the appropriate permissions in Microsoft Sentinel. The data is ingested into the Microsoft Sentinel data lake tier only (not in the analytis tier) and can only be configured for the default workspace.

The following table describes the various asset data sources and their data connectors that are available in the Microsoft Sentinel data lake (Public Preview):

| Data Source    | Tables                                                                                                                                                                                                                                         | Enablement                                                                                                                        | Data Connector                                 | Data Freshness                  | Retention Period                                 |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|-------------------------------|--------------------------------------------------|
| **Azure Resource Graph (ARG)**   | [ARGResources](./data-source-tables.md#argresources), [ARGResourceContainers](./data-source-tables.md#argresourcecontainers), [ARGAuthorizationResources](./data-source-tables.md#argauthorizationresources)                           | Automatic onboarding for users with owner role permissions or higher.                                                             | Azure Resource Graph                            | Snapshot taken every 90 minutes. | Default 30 days. Up to 12 years.   |
| **Microsoft Entra ID**           | [EntraApplications](./data-source-tables.md#entraapplications), [EntraGroupMemberships](./data-source-tables.md#entragroupmemberships), [EntraGroups](./data-source-tables.md#entragroups), [EntraMembers](./data-source-tables.md#entramembers), [EntraOrganizations](./data-source-tables.md#entraorganizations), [EntraServicePrincipals](./data-source-tables.md#entraserviceprincipals), [EntraUsers](./data-source-tables.md#entrausers) | Automatic onboarding for Sentinel contributors and higher.  | Currently, none.<sup>*</sup> | Snapshot taken every 4 hours.   | Default 30 days. Up to 12 years.   |
| **Microsoft 365**                | [SharePointSitesAndLists](./data-source-tables.md#sharepointsitesandlists)                                                                                                                              | Automatic onboarding for users with security administrator roles or higher. Microsoft 365 activity log connector must be enabled in the Sentinel data lake connected workspace. | Microsoft 365 Assets (formerly, Office 365)     | Snapshot taken every 24 hours.   | Default 30 days. Up to 12 years. |

<sup>*</sup> The Microsoft Entra ID data connector is not yet available. The user is automatically connected when onboarding and can't disconnect.

## Prerequisites

To enable and manage data connectors in the Microsoft Sentinel data lake, you need to meet the following prerequisites:

- Ensure you have the necessary [access and permissions](../roles.md#microsoft-sentinel-roles-permissions-and-allowed-actions) to Microsoft Sentinel, as specified *Enablement* column of the previous table.
- Search for the relevant data connector in the **Sentintel** menu under **Configuration** > **Data connectors**, and install if necessary from the content Hub.

:::image type="content" source="./media/enable-data-connectors/data-connectors.png" alt-text="Screenshot of Sentinel Defender data connectors page with the Azure Resource Graph data connector displayed.":::

## Configure and Manage

1. Enable Data Connectors

    - Data connectors are automatically enabled on login, if the user has the right permissions. Disconnect or reconnect from the Asset home page (not yet available for Microsoft Entra ID). Enable or disable ingesting data.
    - Review prerequisites for each data connector to see permission requirements.

    :::image type="content" source="./media/enable-data-connectors/disconnect.png" alt-text="Screenshot of asset home page with connect button.":::

1. Find and Manage Data

    - See the [Table Management documentation](https://aka.ms/manage-tables-defender-portal) for details on tiering options and retention settings.
    - Query data in the Microsoft Sentinel data lake.
