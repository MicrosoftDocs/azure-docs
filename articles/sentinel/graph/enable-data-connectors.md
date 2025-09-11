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

Asset data ingestion is automatically enabled for anyone with the appropriate permissions in Microsoft Sentinel upon successful provision of the data lake. The asset data is ingested into the Microsoft Sentinel data lake tier only (not in the analytics tier). It can take up to 24 hours for the initial snapshot data to arrive at the lake. If automatic provisioning of the asset data fails due to insufficient permission, only the asset data tables are created in the data lake, but no data is ingested. Users can manually enable ingestion by *using various asset data sources* connector.

Ingestion of newly released data sources after onboarding to the Microsoft Sentinel data lake is not enabled by default. To ingest these sources, install the corresponding connector package and [explicitly enable the connector](#configure-and-manage).

Data in the Sentinel data lake can be stored up to 12 years, but the default retention is 30 days.

Asset data snapshots are taken once every 24 hours.

The various connectors are packaged in their respective solutions and can be found in Content Hub.

The following table describes the various asset data sources and their data connectors:

| Data Source | Tables | Permission | Data Connector Solution |
|-------------|--------|------------|------------------------|
| **Azure Resource Graph (ARG)** | [ARGResources](./asset-data-tables.md#argresources) <br> [ARGResourceContainers](./asset-data-tables.md#argresourcecontainers) <br> [ARGAuthorizationResources](./asset-data-tables.md#argauthorizationresources) | Subscription Owner | Azure Resource Graph  |
| **Microsoft Entra ID** | [EntraApplications](./asset-data-tables.md#entraapplications) <br> [EntraGroupMemberships](./asset-data-tables.md#entragroupmemberships) <br> [EntraGroups](./asset-data-tables.md#entragroups) <br> [EntraMembers](./asset-data-tables.md#entramembers) <br> [EntraOrganizations](./asset-data-tables.md#entraorganizations) <br> [EntraServicePrincipals](./asset-data-tables.md#entraserviceprincipals) <br> [EntraUsers](./asset-data-tables.md#entrausers) | None | Microsoft Entra ID Asset |
| **Microsoft 365**<sup>1</sup> | [SharePointSitesAndLists](./asset-data-tables.md#sharepointsitesandlists) | <ul> <li> Global Admin/Security Admin</li> <li> Sentinel workspace contributor</li> </ul> | Microsoft 365 Assets  |

<sup>1</sup> Microsoft 365 Activity log connector must be already enabled in the same workspace.

> [!NOTE]
> Certain data connectors, including but not limited to asset connectors, contribute to the construction of data risk graphs in Purview. If these graphs are active, disabling the associated connectors interrupts their generation. Connector descriptions indicate if they are involved in building data risk graphs.

## Prerequisites

To manage asset data connectors, you need to meet the following prerequisites:

- Ensure you have the necessary [access and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake) to Microsoft Sentinel, as specified *Permissions* column of the previous table.
- Search for the relevant solution containing the data connector in the Content Hub. Content Hub can be found under the **Microsoft Sentinel** menu **Content Management** > **Content Hub**. Install the solution if not already installed.  

:::image type="content" source="./media/enable-data-connectors/data-connectors.png" alt-text="Screenshot of Sentinel Defender data connectors page with the Azure Resource Graph data connector displayed.":::

## Configure and Manage

Access the connector page in one of the following ways:

- From the installed solution:
  - Select **Manage**
  - Select the connector and then **Open connector page**

- From the Connector gallery:
  - The Connector gallery can be found under the **Microsoft Sentinel** menu **Configuration** > **Data connectors**

To edit the table retention period, select on the three dots (…) to the right of the table name in the table manage grid. Select a retention period for up to 12 years.
When asset data connector shows a *Connected* status, the toggle button text shows *Disconnect*. This indicates that ingestion is enabled. To disable the ingestion, select the *Disconnect* button. Once disconnected, the connector status shows *Disconnected* and the button text toggles to *Connect*.

:::image type="content" source="./media/enable-data-connectors/disconnect.png" alt-text="Screenshot of asset home page with connect button.":::

## Use asset data to enrich activity data

Asset data adds valuable context and insights that may not be evident from activity logs alone.
For example, when investigating risky sign-ins in the `SigninLogs` table, you can enhance the analysis by joining it with the `EntraUsers` table to include user-specific attributes such as department and hire date. This additional context helps security teams better understand user behavior and assess potential threats more accurately.

```kql
SigninLogs
| where IsRisky == true
| join kind=leftouter (
     EntraUsers
     | summarize topRecord = arg_max(TimeGenerated, *) by userPrincipalName
) on $left.UserPrincipalName = $right.userPrincipalName
| project Identity, UserPrincipalName, IsRisky, IPAddress, department, employeeHireDate
```

## Next Steps

- See the [Table Management documentation](./asset-data-tables.md) for details on tiering options and retention settings.
- See how asset data enriches [Purview Data Risk graphs](/graph/security-datasecurityandgovernance-overview).
- How to query [Sentinel data lake](../datalake/sentinel-lake-overview.md#flexible-querying-with-kusto-query-language)
