---  
title: Asset data in Microsoft Sentinel data lake
titleSuffix: Microsoft Security  
description: Asset data in security data lake 
author: mberdugo  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-graph
ms.date: 11/04/2025
ms.author: monaberdugo  

ms.collection: ms-security

#Customer intent: As a Microsoft Sentinel user, I want to understand the ingestion of asset data and analysis of security-related data from various sources.
---

# Asset data ingestion in the Microsoft Sentinel data lake

Asset data in cybersecurity refers to an organization’s physical and digital entities such as computers, identities, software, cloud services, and networks. It shows what exists so you know what must be protected. Microsoft Sentinel’s data lake adds powerful value by storing this asset data in a scalable, cost-efficient way that supports long-term retention, advanced analytics, and AI-driven threat detection. With unified visibility across systems and flexible data management, Sentinel lake helps security teams understand their environment, spot unusual activity, and respond to threats.

## How is asset data ingestion enabled in Sentinel data lake?

* When you onboard to Sentinel lake, asset data is automatically ingested if you have appropriate permissions. For more information, see [Required permissions for asset sources](#required-permissions-for-asset-sources).

* If you don't have sufficient permissions, asset tables are created but no data is ingested. Manually enable asset data ingestion as follows:

  1. Go to the Microsoft Sentinel workspace in the Azure portal.
  1. Navigate to the **Data connectors** page.
  1. Find the relevant asset data source connector.
  1. Select the connector and follow the prompts to enable ingestion.

* Asset data is ingested into the Microsoft Sentinel data lake tier only. After onboarding, asset data, it can take up to 24 hours to arrive in the lake.

* Asset data is retained for 30 days by default. Retention can be expanded for up to 12 years. For more information on managing table retention, see [Table Management documentation](../manage-table-tiers-retention.md).

## Billing considerations

* Customers incur charges for asset data ingestion.

* Customers incur charges for asset data retention.

Asset data snapshots are taken once every 24 hours.

Since asset data ingestion is enabled by default when onboarding to Sentinel data lake, it’s important to understand the foundational role of asset Sentinel data connectors that facilitate asset data ingestion. These data connectors are responsible for bringing asset-related data into Sentinel data lake and are bundled within their respective Sentinel Solution packages. You can discover and manage these solutions through the Content Hub.

## Required permissions for asset sources

The following table describes the various asset data sources and their data connectors:

| Data Source | Tables | Permission | Data Connector Solution |
|-------------|--------|------------|------------------------|
| **Azure Resource Graph (ARG)** | [ARGResources](./asset-data-tables.md#argresources) <br> [ARGResourceContainers](./asset-data-tables.md#argresourcecontainers) <br> [ARGAuthorizationResources](./asset-data-tables.md#argauthorizationresources) | Subscription Owner | Azure Resource Graph  |
| **Microsoft Entra ID** | [EntraApplications](./asset-data-tables.md#entraapplications) <br> [EntraGroupMemberships](./asset-data-tables.md#entragroupmemberships) <br> [EntraGroups](./asset-data-tables.md#entragroups) <br> [EntraMembers](./asset-data-tables.md#entramembers) <br> [EntraOrganizations](./asset-data-tables.md#entraorganizations) <br> [EntraServicePrincipals](./asset-data-tables.md#entraserviceprincipals) <br> [EntraUsers](./asset-data-tables.md#entrausers) | None | Microsoft Entra ID Asset |

> [!NOTE]
> Certain data connectors, including but not limited to asset connectors, contribute to the construction of data risk graphs in Purview. If these graphs are active, disabling the associated connectors interrupts their generation. Connector descriptions indicate if they're involved in building data risk graphs.

## Prerequisites

To manage asset data connectors, you need to meet the following prerequisites:

* Ensure you have the necessary [access and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake) to Microsoft Sentinel, as specified *Permissions* column of the [previous table](#required-permissions-for-asset-sources).
* Search for the relevant solution containing the data connector in the Content Hub. Content Hub can be found under the **Microsoft Sentinel** menu **Content Management** > **Content Hub**. Install the solution if not already installed.

:::image type="content" source="./media/enable-data-connectors/data-connectors.png" alt-text="Screenshot of Sentinel Defender data connectors page with the Azure Resource Graph data connector displayed." lightbox="./media/enable-data-connectors/data-connectors.png":::

## Configure and Manage

Access the connector page in one of the following ways:

* From the installed solution:
  * Select **Manage**
  * Select the connector and then **Open connector page**

* From the Connector gallery:
  * The Connector gallery can be found under the **Microsoft Sentinel** menu **Configuration** > **Data connectors**

To edit the table retention period, select on the three dots (…) to the right of the table name in the table manage grid. Select a retention period for up to 12 years.
When asset data connector shows a *Connected* status, the toggle button text shows *Disconnect*. This indicates that ingestion is enabled. To disable the ingestion, select the *Disconnect* button. Once disconnected, the connector status shows *Disconnected* and the button text toggles to *Connect*.

:::image type="content" source="./media/enable-data-connectors/disconnect.png" alt-text="Screenshot of asset home page with connect button." lightbox="./media/enable-data-connectors/disconnect.png":::

## Use asset data to enrich activity data

Asset data adds valuable context and insights that might not be evident from activity logs alone.
For example, when investigating risky sign-ins in the `SigninLogs` table, you can enhance the analysis by joining it with the `EntraUsers` table to include user-specific attributes such as department and hire date. This extra context helps security teams better understand user behavior and assess potential threats more accurately.

```kql
SigninLogs
| where IsRisky == true
| join kind=leftouter (
   EntraUsers
   | summarize arg_max(TimeGenerated, userPrincipalName, department, employeeHireDate) by userPrincipalName
) on $left.UserPrincipalName == $right.userPrincipalName
| project Identity, UserPrincipalName, IsRisky, IPAddress, department, employeeHireDate
```

## Execute KQL queries on asset data

To execute KQL queries on asset data in the Sentinel data lake, ensure that you are querying within the correct workspace scope. Follow these steps:

1. Navigate to the **Microsoft Sentinel** menu **Data lake exploration** > **KQL queries**
1. Select the **Selected workspace** button.

    :::image type="content" source="./media/enable-data-connectors/select-workspace.png" alt-text="Screenshot of the KQL queries information bar showing a button to select the workspace.":::

1. Ensure that the *System tables* workspace is selected.

    :::image type="content" source="./media/enable-data-connectors/workspace-scope.png" alt-text="Screenshot of the KQL queries information bar showing the System tables workspace selected.":::

Asset data tables are shown under the Asset category:

:::image type="content" source="./media/enable-data-connectors/kql-queries.png" alt-text="Screenshot of the KQL queries table picker showing asset data tables under the Asset category." lightbox="./media/enable-data-connectors/kql-queries.png":::

## Next Steps

* See the [Table Management documentation](./asset-data-tables.md) for details on data tiering options and retention settings.
* See how asset data enriches [Purview Data Risk graphs](/graph/security-datasecurityandgovernance-overview).
* How to query [Sentinel data lake](../datalake/sentinel-lake-overview.md#flexible-querying-with-kusto-query-language)
