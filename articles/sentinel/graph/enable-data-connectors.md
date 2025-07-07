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

# Enable asset data ingestion in the Microsoft Sentinel data lake (preview)

Asset data refers to structured information about digital or physical entities, such as devices, services, applications, or infrastructure components, that are relevant to an organization’s operations, security, or analytics. This article explains how to enable and manage asset data in Microsoft Sentinel's data lake. Data in the data lake is ingested and managed through data connectors. These data connectors allow you to integrate various data sources into Microsoft Sentinel, enabling enhanced security monitoring and threat detection capabilities.

Asset data ingestion is automatically enabled for anyone with the appropriate permissions in Microsoft Sentinel upon successful provision of the data lake.  The asset data is ingested into the Microsoft Sentinel data lake tier only (not in the analytics tier). If automatic provisioning of the asset data fails due to insufficient permission, only the asset data tables are created in the data lake, but no data is ingested. Users can manually enable ingestion through the *use various asset data sources* connector in the default workspace.

The various connectors are packaged in their respective solutions and can be found in Content Hub.

The following table describes the various asset data sources and their data connectors during Public Preview:

| Data Source    | Tables                                                                                                                                                                                                                                         | Permission                                                                                                                        | Data Connector                                 | Data Freshness                  | Retention Period                                 |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|-------------------------------|--------------------------------------------------|
| **Azure Resource Graph (ARG)**   | [ARGResources](./asset-data-tables.md#argresources), [ARGResourceContainers](./asset-data-tables.md#argresourcecontainers), [ARGAuthorizationResources](./asset-data-tables.md#argauthorizationresources)                           | Tenant Administrator and Subscription Owner                                                             | Azure Resource Graph                            | Snapshot taken every 90 minutes. | Default 30 days. Up to 12 years.   |
| **Microsoft Entra ID**           | [EntraApplications](./asset-data-tables.md#entraapplications), [EntraGroupMemberships](./asset-data-tables.md#entragroupmemberships), [EntraGroups](./asset-data-tables.md#entragroups), [EntraMembers](./asset-data-tables.md#entramembers), [EntraOrganizations](./asset-data-tables.md#entraorganizations), [EntraServicePrincipals](./asset-data-tables.md#entraserviceprincipals), [EntraUsers](./asset-data-tables.md#entrausers) | Security Administrator or higher, and Sentinel Contributor with workspace write permissions  | Currently, none.<sup>1</sup> | Snapshot taken every 4 hours.   | Default 30 days. Up to 12 years.   |
| **Microsoft 365**                | [SharePointSitesAndLists](./asset-data-tables.md#sharepointsitesandlists)                                                                                                                              | Security Administrator or higher<sup>2</sup> | Microsoft 365 Assets (formerly, Office 365)     | Snapshot taken every 24 hours.   | Default 30 days. Up to 12 years. |

<sup>1</sup> The Microsoft Entra ID data connector isn't yet available. The user is automatically connected when onboarding and can't disconnect.
<sup>2</sup> Microsoft 365 Activity log connector must be already enabled in the same workspace.

## Prerequisites

To enable and manage asset data connectors, you need to meet the following prerequisites:

- Ensure you have the necessary [access and permissions](../roles.md#microsoft-sentinel-roles-permissions-and-allowed-actions) to Microsoft Sentinel, as specified *Permissions* column of the previous table.
- Search for the relevant solution containing the data connector in the Content Hub. Content Hub can be found under the **Microsoft Sentinel** menu **Content Management** > **Content Hub**. Install the solution if not already installed.  

:::image type="content" source="./media/enable-data-connectors/data-connectors.png" alt-text="Screenshot of Sentinel Defender data connectors page with the Azure Resource Graph data connector displayed.":::

## Configure and Manage

Access the connector page in one of the following ways:

- From the installed solution:
  - From the installed solution select **Manage**
  - Select the connector and then **Open connector page**

- From the Connector gallery:
  - The Connector gallery can be found under the **Microsoft Sentinel** menu **Configuration** > **Data connectors**

1. Enable Data Connectors

    Review the prerequisites on the connector page to ensure you meet the permission requirements to manage the connector

    :::image type="content" source="./media/enable-data-connectors/disconnect.png" alt-text="Screenshot of asset home page with connect button.":::

1. Find and Manage Data

    - See the [Table Management documentation](https://aka.ms/manage-tables-defender-portal) for details on tiering options and retention settings.
    - Query data in the Microsoft Sentinel data lake.
