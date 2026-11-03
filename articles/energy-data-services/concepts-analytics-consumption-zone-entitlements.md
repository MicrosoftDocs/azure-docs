---
title: Entitlements export in Analytics Consumption Zone (preview) - Azure Data Manager for Energy
description: Learn how Analytics Consumption Zone exports OSDU entitlement membership data for use in downstream data and AI platforms.
ms.service: azure-data-manager-energy
ms.topic: concept-article
ms.date: 10/30/2026
ms.author: nsannala
author: NSannala
---

# Entitlements export in Analytics Consumption Zone (preview)

> [!IMPORTANT]
> ACZ entitlements export is currently in preview. For legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Analytics Consumption Zone (ACZ) can export entitlement membership data alongside OSDU catalog data. Data and AI platforms that support Delta Parquet, including Microsoft Fabric, Azure Databricks, and Snowflake, can consume this data. You can use the exported memberships and OSDU record access control lists to implement entitlement-aware filtering by using your platform's security capabilities.

## Enable entitlements export

Entitlements export is in preview and is disabled by default. To enable it for your Azure Data Manager for Energy instance, [create a support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade). The feature and the table schema might change before general availability.

For information about setting up ACZ, see [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md).

## How entitlement export works

OSDU entitlement information is maintained as a graph of principals, groups, and membership relationships. When entitlement export is enabled, ACZ:

1. Reads principals and their group relationships from the OSDU Entitlements service.
1. Resolves both direct and inherited membership in parent groups.
1. Filters the results by data partition.
1. Flattens the relationships into one row for each principal-to-group membership.
1. Writes the results as a Delta Lake table to every active ACZ in the partition.

The entitlement data is stored in an `entitlements` folder next to the existing `osducatalog` table:

```text
<acz-base-path>/
|-- osducatalog/
|   `-- _delta_log/
`-- entitlements/
    `-- _delta_log/
```

Entitlement export replaces the previous entitlement snapshot. It runs separately from the historical and incremental synchronization of OSDU records.

## Entitlements table schema

Each row represents the membership of one Microsoft Entra principal in one OSDU group.

| Field | Type | Description |
|---|---|---|
| `OSDUGroupName` | String | Display name of the OSDU group. |
| `OSDUGroupId` | String | OSDU group identifier, typically the group email stored in the entitlement graph. |
| `AADOid` | String | Microsoft Entra object ID of the user or application principal. |

A principal that belongs to multiple groups has one row for each resolved group membership.

## Use exported entitlements

ACZ exports the data required to implement entitlement-aware filtering, but it doesn't configure or enforce row-level security in downstream data and AI platforms. Use the exported entitlement memberships together with the access control lists on catalog records to implement filtering by using your platform's security capabilities.

Use Azure role-based access control and Data Lake Storage Gen2 permissions to secure access to the exported data.

## Data freshness

ACZ refreshes the entitlements table on a regular schedule and replaces the previous snapshot. Changes to users, groups, or memberships appear in the table after the next refresh. The entitlements table isn't a real-time authorization endpoint.

## Related content

- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md)
- [Connect ACZ data to Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
