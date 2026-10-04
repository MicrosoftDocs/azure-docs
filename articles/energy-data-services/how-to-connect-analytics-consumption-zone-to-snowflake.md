---
title: Connect Analytics Consumption Zone data to Snowflake
description: Learn how to connect Analytics Consumption Zone Delta Lake data in Azure Data Lake Storage Gen2 to Snowflake by using Delta Direct and an Iceberg table.
author: nsannala
ms.author: nsannala
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 09/25/2026
ms.custom: template-how-to-pattern
---

# Connect Analytics Consumption Zone data to Snowflake

This article shows you how to connect Analytics Consumption Zone (ACZ) data to Snowflake. ACZ writes Azure Data Manager for Energy data to Azure Data Lake Storage Gen2 in Delta Lake format. Snowflake Delta Direct exposes the Delta data as a read-only Apache Iceberg table without copying the source data into Snowflake.

> [!NOTE]
> During the preview, ACZ is available only on Developer tier instances and requires the use of allow lists. Follow the guidance in [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md), and contact your Microsoft representative.

## Prerequisites

- An Azure subscription with an Azure Data Manager for Energy (Developer tier) instance that has ACZ enabled.
- An ACZ instance in `ACTIVE` status with `historicalSnapshotStatus` set to `COMPLETED`.
- An Azure Data Lake Storage Gen2 account that contains the ACZ Delta Lake data.
- Permission to grant an Azure role at the storage account scope.
- A Snowflake account and a role with permission to create an external volume, a catalog integration, and an Iceberg table. You can use the `ACCOUNTADMIN` role for setup.

## Setup overview

Use the following steps to connect Snowflake to ACZ data:

| Step | Task | Description |
|------|------|-------------|
| 1 | Create an external volume | Defines read-only access to the ACZ storage location. |
| 2 | Grant and verify storage access | Grants the Snowflake service principal access to the storage account. |
| 3 | Create a catalog integration | Configures Snowflake to read Delta Lake metadata and poll for updates. |
| 4 | Create an Iceberg table | Exposes one ACZ Delta table in Snowflake and enables automatic refresh. |
| 5 | Query the table | Verifies that Snowflake can read the ACZ data. |

## Step 1: Create an external volume

Open a SQL file in Snowsight:

1. Sign in to [Snowsight](https://app.snowflake.com/).
1. In the navigation menu, select **Projects**.
1. In the **Workspaces** pane, select **+ Add new** > **SQL file**.
1. In the SQL file toolbar, select a role that can create external volumes, such as **ACCOUNTADMIN**, and select a running warehouse.

Paste and run the following statement to create a read-only external volume that points to the ACZ root folder in Data Lake Storage Gen2:

```sql
CREATE OR REPLACE EXTERNAL VOLUME acz_delta_volume
  STORAGE_LOCATIONS =
    (
      (
        NAME = 'acz-storage-location'
        STORAGE_PROVIDER = 'AZURE'
        STORAGE_BASE_URL = 'azure://<storage-account>.dfs.core.windows.net/<container>/<acz-id>/'
        AZURE_TENANT_ID = '<tenant-id>'
      )
    )
  ALLOW_WRITES = FALSE;
```

Replace the placeholders:

- `<storage-account>`: Name of the Data Lake Storage Gen2 account that contains the ACZ data.
- `<container>`: Container that you selected when you created the ACZ instance.
- `<acz-id>`: ACZ output folder, such as `acz-8a0aa7433085`.
- `<tenant-id>`: Microsoft Entra tenant ID for the storage account.

Use the `azure://` prefix in `STORAGE_BASE_URL`. The `ALLOW_WRITES = FALSE` setting keeps the connection read-only and must match the Azure role that you assign in the next step.

## Step 2: Grant and verify storage access

Describe the external volume to retrieve the Snowflake identity and consent URL:

```sql
DESCRIBE EXTERNAL VOLUME acz_delta_volume;
```

In the command output, locate these properties in the `STORAGE_LOCATIONS` row:

- `AZURE_CONSENT_URL`: Microsoft permissions request page for the Snowflake application.
- `AZURE_MULTI_TENANT_APP_NAME`: Generated name for the Snowflake service principal that needs storage access.

Grant access:

1. Open the `AZURE_CONSENT_URL`, and then select **Accept**.
1. In the Azure portal, go to **Microsoft Entra ID** > **Enterprise applications** > **All applications**.
1. Search by the application (client) ID from the `client_id` parameter in `AZURE_CONSENT_URL`, and note the enterprise application's **Display name**. The display name can omit the numeric suffix shown in `AZURE_MULTI_TENANT_APP_NAME`.
1. In the Azure portal, go to the storage account that contains the ACZ data.
1. Select **Access Control (IAM)** > **Add role assignment**.
1. Assign **Storage Blob Data Reader** to the enterprise application display name that you identified in the previous steps.
1. Assign the role at the **storage account** scope. A container-scoped assignment alone doesn't grant the account-level permission that Snowflake uses to generate a user delegation key.
1. Wait for the role assignment to propagate.

Verify that Snowflake can access the external volume:

```sql
SELECT SYSTEM$VERIFY_EXTERNAL_VOLUME('ACZ_DELTA_VOLUME');
```

The result should indicate that the storage location passed the connection test.

For a read-only external volume, the write, read, list, and delete results can be reported as unverified because `ALLOW_WRITES` is `FALSE`. The `storageLocationSelectionResult` and `azureGetUserDelegationKeyResult` values must be `PASSED`.

## Step 3: Create a Delta catalog integration

Create an object-store catalog integration for the ACZ Delta Lake data:

```sql
CREATE OR REPLACE CATALOG INTEGRATION acz_delta_catalog
  CATALOG_SOURCE = OBJECT_STORE
  TABLE_FORMAT = DELTA
  ENABLED = TRUE
  REFRESH_INTERVAL_SECONDS = 60;
```

The refresh interval controls how frequently Snowflake checks the ACZ storage location for new Delta metadata. Supported values range from 30 through 86,400 seconds.

## Step 4: Create an Iceberg table

Create a database and schema, and then create an Iceberg table that points to an ACZ Delta table:

```sql
CREATE DATABASE IF NOT EXISTS acz_data;
CREATE SCHEMA IF NOT EXISTS acz_data.osdu;

USE DATABASE acz_data;
USE SCHEMA osdu;

CREATE OR REPLACE ICEBERG TABLE osdu_catalog
  CATALOG = 'ACZ_DELTA_CATALOG'
  EXTERNAL_VOLUME = 'ACZ_DELTA_VOLUME'
  BASE_LOCATION = 'osducatalog/'
  AUTO_REFRESH = TRUE;
```

`BASE_LOCATION` is relative to the `STORAGE_BASE_URL` in the external volume. It must point to a single Delta table directory that contains a `_delta_log` subfolder. For example, if the external volume points to the `<acz-id>/` folder, use `osducatalog/` for the ACZ catalog table.

To expose another ACZ dataset, create another Iceberg table and set `BASE_LOCATION` to that dataset's Delta table directory.

## Step 5: Query the ACZ data

Query the Iceberg table by using standard Snowflake SQL:

```sql
-- Preview ACZ records.
SELECT *
FROM acz_data.osdu.osdu_catalog
LIMIT 10;

-- Count all records.
SELECT COUNT(*) AS total_records
FROM acz_data.osdu.osdu_catalog;

-- Count records by OSDU kind.
SELECT kind, COUNT(*) AS record_count
FROM acz_data.osdu.osdu_catalog
GROUP BY kind
ORDER BY record_count DESC;
```

With `AUTO_REFRESH = TRUE`, Snowflake polls the Delta transaction log according to `REFRESH_INTERVAL_SECONDS`. You can also request an immediate refresh:

```sql
ALTER ICEBERG TABLE acz_data.osdu.osdu_catalog REFRESH;
```

## Troubleshooting

### External volume verification fails

- Confirm that you accepted the `AZURE_CONSENT_URL`.
- Confirm that **Storage Blob Data Reader** is assigned to the Snowflake service principal at the storage account scope.
- Wait up to 10 minutes for a new Azure role assignment to propagate.
- If `azureGetUserDelegationKeyResult` reports an authorization permission mismatch, confirm the role assignment scope and wait for role propagation before running `SYSTEM$VERIFY_EXTERNAL_VOLUME` again.
- If the storage account uses a firewall, allow Snowflake network access according to your organization's network policy.

### Delta log isn't found

- Confirm that `BASE_LOCATION` is relative to the external volume's `STORAGE_BASE_URL`.
- Confirm that the target directory contains `_delta_log` and Parquet data files.
- Point each Iceberg table to one Delta table directory, not to a parent directory that contains multiple Delta tables.

### New ACZ data isn't visible

- Confirm that the catalog integration is enabled and the Iceberg table has `AUTO_REFRESH = TRUE`.
- Run `ALTER ICEBERG TABLE ... REFRESH` to request an immediate refresh.
- Confirm that ACZ completed the corresponding synchronization operation.

## Related content

- [Connect Analytics Consumption Zone to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Connect Analytics Consumption Zone data to Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Snowflake: Create an Iceberg table from Delta files](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-delta)
