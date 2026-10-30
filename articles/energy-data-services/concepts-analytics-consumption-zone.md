---
title: Analytics Consumption Zone Concepts in Azure Data Manager for Energy
description: Learn about Analytics Consumption Zone in Azure Data Manager for Energy. ACZ mirrors Azure Data Manager for Energy data to Azure Data Lake Storage Gen2.
ms.service: azure-data-manager-energy
ms.topic: concept-article
ms.date: 10/30/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to understand the Analytics Consumption Zone capability so that I can export Azure Data Manager for Energy data to Azure Data Lake Storage Gen2 for analytics.

---

# Analytics Consumption Zone concepts

Native analytics capabilities in Azure Data Manager for Energy, delivered through an analytics consumption zone (ACZ), make energy data readily accessible for analytics and AI. ADME synchronizes selected OSDU® data into customer-owned storage in open Delta Parquet format, enabling use with Microsoft Fabric, Azure Databricks, Snowflake, and other compatible analytics platforms without the need to build and maintain custom data pipelines.

Analytics Consumption Zone (ACZ) exports selected entity data from Azure Data Manager for Energy to your Azure Data Lake Storage Gen2 account. ACZ writes Azure Data Manager for Energy data in open Delta Parquet format. Services like Microsoft Fabric and Azure Databricks can read this format directly.

To enable ACZ, see [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md).

## What is ACZ?

ACZ is a managed sync layer. It exports entity data from your Azure Data Manager for Energy instance to an Azure Data Lake Storage Gen2 storage account that you own. You can then connect that data to analytics, reporting, and machine learning tools.

Setting up ACZ has two parts. You *enable ACZ* once on an Azure Data Manager for Energy resource in the Azure portal. Then you create one or more *ACZ instances* by using the ACZ APIs. Each ACZ instance is an export configuration in a data partition that defines which kinds ACZ exports and where it writes them. ACZ exports data only for the ACZ instances that you create.

Key characteristics of ACZ:

- **Customer-owned storage**: You create and manage a Data Lake Storage Gen2 storage account where your data goes. We recommend a storage account in the same region as your Azure Data Manager for Energy instance. If you have data residency requirements, you're responsible for selecting a storage account in the appropriate region.
- **Open format**: Your data exports in Delta Parquet format. Analytics engines widely support this format.
- **Selective sync**: You choose which entity types to sync. Options include catalog kinds and Wellbore Domain Data Management Service (DDMS) kinds (preview).
- **Historical and incremental sync**: You get an initial snapshot of existing data from ACZ. Then ACZ synchronizes changes as they occur.
- **Portal and API management**: You enable ACZ in the Azure portal, and you create and manage ACZ instances by using REST APIs.

### Architecture

The following diagram shows the ACZ data flow.

:::image type="content" source="media/concepts-analytics-consumption-zone/analytics-consumption-zone-architecture.png" alt-text="Diagram that shows data moving from Azure Data Manager for Energy to Data Lake Storage Gen2 to analytics tools.":::

## How ACZ works

### Supported entity types

> [!NOTE]
> Wellbore DDMS export is currently in preview. Catalog export is generally available. For legal terms that apply to Azure features that are in preview, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

ACZ synchronizes two categories of Azure Data Manager for Energy entity types.

| Category | Description | Example kinds |
|---|---|---|
| Catalog kinds | Primary data and reference data from the storage service | `osdu:wks:master-data--Well:*`, `osdu:wks:reference-data--UnitOfMeasure:*` |
| Wellbore DDMS kinds (preview) | Entities from Wellbore DDMS | `osdu:wks:work-product-component--WellLog:*` |

ACZ can also export OSDU entitlement membership data through [entitlements export (preview)](concepts-analytics-consumption-zone-entitlements.md).

When you create an ACZ instance, you specify which entity types to synchronize by providing:

- `catalogKinds`: A list of catalog kind patterns (for example, `osdu:wks:master-data--Well:*`).
- `wellboreDDMSKinds`: A list of Wellbore DDMS kind patterns (for example, `osdu:wks:work-product-component--WellLog:*`).

These kind patterns act as filters that determine which Azure Data Manager for Energy records ACZ exports and keeps synchronized.

### Use the allCatalogSync flag

The `allCatalogSync` flag is an optional Boolean parameter that you can specify when you create an ACZ instance. When set to `true`, it synchronizes all catalog kinds from the data partition.

Key behaviors:
- `allCatalogSync` is specified *outside* the `configuration` section in the request body.
- When `allCatalogSync: true`, ACZ exports all catalog kinds automatically.
- The `catalogKinds` and `wellboreDDMSKinds` arrays in the configuration are ignored for catalog data.
- Wellbore DDMS bulk file downloads are *not affected* by this flag. Files are only downloaded for kinds explicitly listed in `wellboreDDMSKinds`.

**Example configurations:**

```json
// Selective catalog sync - only Wells and Fields
{
  "allCatalogSync": false,
  "configuration": {
    "catalogKinds": [
      "osdu:wks:master-data--Well:*",
      "osdu:wks:master-data--Field:*"
    ]
  }
}

// Sync all catalog kinds using allCatalogSync flag
{
  "allCatalogSync": true,
  "configuration": {
    // catalogKinds is ignored when allCatalogSync is true
  }
}

// Sync all catalog kinds, but Wellbore DDMS files only for specified kinds
{
  "allCatalogSync": true,
  "configuration": {
    "wellboreDDMSKinds": [
      "osdu:wks:work-product-component--WellLog:*"
    ]
  }
}
```

### Version types

When you create an ACZ instance, you choose how to handle entity versions.

| Type | Description |
|---|---|
| **LATEST_VERSION** | Exports only the latest version of each entity. Default and recommended. |
| **ALL_VERSIONS** | Exports all versions of each entity. Keeps the full version history. |

### Lifecycle states

Each ACZ goes through these states:

| Status | Description |
|---|---|
| **ACTIVE** | Operational. ACZ synchronizes changes incrementally. |
| **FAILED** | An error stopped setup or sync. |
| **ACCESS_DENIED** | ACZ can't reach the destination Data Lake Storage Gen2 storage account. |

### Historical snapshot

When you create a new ACZ instance, the service takes a historical snapshot. This snapshot exports all existing records that match the configured entity types (`catalogKinds` and `wellboreDDMSKinds`). The snapshot progresses through the following states:

| Status | Description |
|---|---|
| **PROCESSING** | Actively exporting data. |
| **COMPLETED** | All historical data exported. |
| **FAILED** | An error occurred. |

After the snapshot finishes, ACZ switches to incremental mode. It captures new and updated records in near real time.

### How ACZ handles data changes

ACZ propagates created, updated, and deleted records from Azure Data Manager for Energy to the Delta tables.

- **Creations and updates**: When you create a record or change its data block, Azure Data Manager for Energy creates a new version. ACZ detects the change and writes a new row to the Delta table.
- **Metadata-only updates**: When a PATCH operation changes the access control list, legal, or tags without creating a new version, ACZ updates the row for the existing version.
- **Soft deletes**: When you soft-delete a record in Azure Data Manager for Energy, ACZ sets the `isActive` field to `False` instead of removing the row. For ACZ instances that use `ALL_VERSIONS`, all stored versions of the record are marked inactive. Soft deletes preserve history for auditing and time-travel queries.
- **Purges**: When you purge a record in Azure Data Manager for Energy, ACZ permanently removes the record from the Delta table. The row is deleted and can't be recovered from the ACZ data.

> [!NOTE]
> ACZ writes a raw (bronze) layer, and a table can contain more than one row for the same record ID and version. ACZ doesn't remove these duplicates. When you build downstream tables, select the latest active row for each `id`.

> [!WARNING]
> ACZ is a *one-way, read-only sync* from Azure Data Manager for Energy to Data Lake Storage Gen2:
>
> - Data flows only from Azure Data Manager for Energy to Data Lake Storage Gen2.
> - *Do not modify, delete, or add files* directly in the ACZ folders in Data Lake Storage Gen2.
> - Manual changes to ACZ data corrupt the sync and cause data inconsistencies.
> - ACZ manages all Delta Lake operations (transaction logs, checkpoints, and compaction).
>
> For analytics and reporting, treat the exported data as read-only. All data modifications must occur in Azure Data Manager for Energy.

### Identify new, updated, and deleted records

ACZ doesn't turn on Delta Lake change data feed on its tables. If you turn it on yourself, each record update appears as a delete followed by an insert. To process changes incrementally, use `ingestTime` as a watermark. ACZ refreshes `ingestTime` whenever it writes a change to a row, including:

- New records and new record versions.
- Metadata-only updates, such as changes to tags, that don't create a new record version.
- Soft deletes. ACZ sets `isActive` to `False`.

Purged records are removed from the Delta table. To remove purged records from downstream tables, periodically reconcile them against the current ACZ table or rebuild them.

> [!NOTE]
> Use `ingestTime` rather than `modifyTime` to detect changes. `modifyTime` reflects updates to the record in Azure Data Manager for Energy and doesn't change when a record is soft-deleted.

For a reference implementation, see the [ADME Analytics Accelerator](https://github.com/microsoft/adme-acz-silverlayer).

## Data output format

ACZ writes data in [Delta Lake](https://delta.io/) format with Parquet-encoded files (`DELTA_PARQUET`). Delta Lake supports atomicity, consistency, isolation, and durability transactions. It also supports time travel and efficient incremental reads.

### Data Lake Storage Gen2 folder structure

ACZ writes data to the storage account that you specify when you create an ACZ instance. The first segment of the optional `basePath` property is the container, and any additional segments are folders in that container. The first segment must be a valid container name. For naming rules, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata). If you don't specify a base path, ACZ uses a container named `<aczId>`. ACZ creates the container if it doesn't exist and writes its data to a folder named `<aczId>`. For examples, see [Create an ACZ instance](how-to-enable-analytics-consumption-zone.md#create-an-acz-instance).

```text
<storage-account>/
└── <container>/                      ← first segment of basePath, or <aczId>
    └── [<more basePath folders>/]
        └── <aczId>/
            ├── osducatalog/          ← Delta table, partitioned by kind
            │   └── _delta_log/
            ├── wellboreDDMS/         ← Wellbore DDMS bulk files (Parquet and JSON)
            │   ├── work-product-component--WellLog/
            │   └── work-product-component--WellboreTrajectory/
            └── entitlements/         ← Delta table (preview), only when entitlements export is enabled
```

> [!NOTE]
> Starting with the October 2026 release, new ACZ instances store Wellbore DDMS entity folders under a `wellboreDDMS` folder. ACZ instances created before the October 2026 release keep the earlier layout, with Wellbore DDMS entity folders directly under `<aczId>/`. To check when an ACZ instance was created, see the `createdTs` value in the Get ACZ API response.

For more information about the entitlements table, see [Entitlements export in Analytics Consumption Zone (preview)](concepts-analytics-consumption-zone-entitlements.md).

#### Key details

| Element | Description |
|---|---|
| Top-level folder | A folder named `<aczId>`, one per ACZ instance, in the container and folders defined by `basePath`. |
| `osducatalog/` | One Delta table for all catalog kinds. Partitioned by kind (for example, `kind=osdu:wks:master-data--Well:1.0.0`). |
| `_delta_log/` | The Delta Lake transaction log. Tracks all table changes for ACID transactions and time travel. |
| DDMS entity folders | One folder per Wellbore DDMS entity type (for example, `work-product-component--WellLog`). Starting with the October 2026 release, these folders are under `wellboreDDMS/`. Holds Parquet and JSON files by entity type and record ID. These folders aren't Delta tables; to find a record's files, use the `fileDownloadFolder` column in `osducatalog`. |
| Parquet files | Snappy-compressed data files. Updates create new files. ACZ runs `VACUUM` and `OPTIMIZE` to compact small files and remove old ones. The `maintenance` property in the ACZ API response shows the status and last successful run of these maintenance activities. |

ACZ regularly runs maintenance on its Delta tables, including `VACUUM`, which removes older data files. Time-travel queries can read only recent table versions. To keep a longer history, copy the data to your own storage on a schedule. If you have specific requirements for table history, [create a support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade).

### Delta table schema

The Delta table has the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | String | OSDU® record ID. |
| `version` | String | Version number. |
| `kind` | String | Fully qualified OSDU® kind. |
| `data` | String | Data block (JSON). |
| `meta` | String | Metadata (JSON). |
| `acl` | String | Access control list. |
| `legal` | String | Legal tags. |
| `tags` | String | User-defined tags. |
| `createUser` | String | User who created the record. |
| `createTime` | Timestamp | When the record was created. |
| `modifyUser` | String | User who last modified the record. Schema version 2 only. |
| `modifyTime` | Timestamp | When the record was last modified. Schema version 2 only. |
| `ingestTime` | Timestamp | When ACZ ingested the record. |
| `isActive` | Boolean | `True` if active. `False` if soft-deleted. |

> [!NOTE]
> Rows for Wellbore DDMS kinds also include `fileDownloadTime`, `fileDownloadState`, and `fileDownloadFolder`, which track the record's bulk files in the Wellbore DDMS entity folders.

#### Schema versions

The `catalogSchemaVersion` property in the ACZ API response shows which schema an ACZ instance uses:

| Version | Description |
| --- | --- |
| 1 | Earlier schema. `modifyUser` and `modifyTime` aren't separate columns. They're available only within the JSON in the `data` column. |
| 2 | Current schema for new ACZ instances. Adds top-level `modifyUser` and `modifyTime` columns. |

Existing ACZ instances keep their schema version. To use the current schema, create a new ACZ instance. There's no migration from version 1 to version 2.

## Entitlements export (preview)

ACZ can optionally export OSDU entitlement membership data to an `entitlements` Delta Lake table alongside the catalog data. You can use this data to implement entitlement-aware filtering in downstream analytics platforms. ACZ doesn't configure or enforce downstream row-level security.

Entitlements export is disabled by default. To enable it, [create a support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade). For details, see [Entitlements export in Analytics Consumption Zone (preview)](concepts-analytics-consumption-zone-entitlements.md).

## Limits and access

### Limits

| Constraint | Limit |
|---|---|
| Maximum ACZ instances per data partition | Three |
| ACZ name uniqueness | Must be unique within a data partition |
| Target format | Delta Parquet only |
| Storage type | Data Lake Storage Gen2 only |
| Tier support | Developer and Standard tiers |
| Historical snapshots in progress | One at a time per data partition. Wait for an ACZ instance's historical snapshot to complete before you create another. |
| ACZ definition changes | Not supported. To change kinds or other settings, create a new ACZ instance. Each ACZ instance has its own identifier and output path. |
| Destination storage network access | ACZ currently requires the destination storage account to allow public network access. Storage accounts that restrict access by using firewall IP rules, disabled public network access, or private endpoints aren't supported. Azure Data Manager for Energy instances that use [private endpoints](how-to-set-up-private-links.md) are supported. |

### Authentication and authorization

ACZ requires:

- **API access**: To call ACZ APIs, you must belong to the `users@{data-partition-id}.dataservices.energy`, `users.datalake.ops@{data-partition-id}.dataservices.energy`, and `service.entitlements.user@{data-partition-id}.dataservices.energy` groups.
- **Storage access**: The managed identity needs the Storage Blob Data Contributor role (or equivalent) on the Data Lake Storage Gen2 container.
- **Azure Data Manager for Energy access**: The managed identity is assigned to the Azure Data Manager for Energy resource when you enable ACZ in the Azure portal. For steps, see [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md).

### Backup and restore

ACZ isn't included in Azure Data Manager for Energy backup and restore. If you restore an Azure Data Manager for Energy resource or data partition from a backup, ACZ data in your storage account no longer matches the restored data. Create new ACZ instances after the restore finishes, which take a new historical snapshot.

### Business continuity and disaster recovery

ACZ isn't included in Azure Data Manager for Energy cross-region disaster recovery. After a regional failover, ACZ might not resume synchronization or might be missing changes from the failover window. A historical snapshot that's in progress during a failover might not complete. To restore ACZ, create new ACZ instances, which take a new historical snapshot.

To prepare:

- Configure redundancy for your destination Data Lake Storage Gen2 account. ACZ writes to the storage account that you specify and doesn't replicate it. For options, see [Azure Storage redundancy](/azure/storage/common/storage-redundancy).
- Keep the ACZ configurations, such as kinds, `basePath`, and storage account, that you need to recreate your ACZ instances.

For more information, see [Reliability in Azure Data Manager for Energy](reliability-energy-data-services.md).

## Related content

- [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md)
- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Entitlements export in Analytics Consumption Zone (preview)](concepts-analytics-consumption-zone-entitlements.md)
