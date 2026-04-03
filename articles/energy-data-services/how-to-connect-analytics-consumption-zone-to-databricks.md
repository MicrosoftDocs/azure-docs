---
title: How to connect ACZ data to Azure Databricks - Azure Data Manager for Energy
description: Learn how to connect ACZ data stored in ADLS Gen2 to Azure Databricks for advanced analytics and machine learning workloads.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 03/31/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to connect ACZ data to Azure Databricks so that I can run analytics and machine learning on energy data.

---

# Connect Analytics Consumption Zone (ACZ) data to Azure Databricks


This article shows how to connect your Analytics Consumption Zone (ACZ) data, stored in Azure Data Lake Storage (ADLS) Gen2, to Azure Databricks. You can then query, transform, and apply machine learning models to your Azure Data Manager for Energy data from Databricks notebooks.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure subscription with an [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) instance.
- ACZ enabled and at least one ACZ in `ACTIVE` status with `historicalSnapshotStatus` of `COMPLETED`. See [How to enable the Analytics Consumption Zone (ACZ)](how-to-enable-analytics-consumption-zone.md).
- An [Azure Databricks workspace](/azure/databricks/getting-started/).
- A Databricks cluster running Databricks Runtime 11.3 or later (with Delta Lake support).
- Appropriate permissions on the ADLS Gen2 storage account.

## Step 1: Configure ADLS Gen2 access in Databricks

You can connect Azure Databricks to your ACZ ADLS Gen2 storage account using one of the following methods.

### Option A: Unity Catalog with external location (Recommended)

If you're using [Unity Catalog](/azure/databricks/data-governance/unity-catalog/), configure an external location pointing to your ACZ storage:

1. Create a storage credential in Unity Catalog that references a managed identity or service principal with **Storage Blob Data Reader** access to the ADLS Gen2 account.
2. Create an external location that maps to the ACZ output path:

```sql
CREATE EXTERNAL LOCATION acz_data
URL 'abfss://<container>@<storage_account>.dfs.core.windows.net/<base_path>'
WITH (STORAGE CREDENTIAL <credential_name>);
```

### Option B: Direct access with service principal

Configure Spark to authenticate using a service principal:

```python
# Configure service principal access
service_credential = dbutils.secrets.get(scope="<secret-scope>", key="<service-credential-key>")

spark.conf.set("fs.azure.account.auth.type.<storage_account>.dfs.core.windows.net", "OAuth")
spark.conf.set("fs.azure.account.oauth.provider.type.<storage_account>.dfs.core.windows.net",
               "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
spark.conf.set("fs.azure.account.oauth2.client.id.<storage_account>.dfs.core.windows.net", "<application-id>")
spark.conf.set("fs.azure.account.oauth2.client.secret.<storage_account>.dfs.core.windows.net", service_credential)
spark.conf.set("fs.azure.account.oauth2.client.endpoint.<storage_account>.dfs.core.windows.net",
               "https://login.microsoftonline.com/<tenant-id>/oauth2/token")
```

Replace the placeholder values:
- `<storage_account>`: Your ADLS Gen2 storage account name.
- `<application-id>`: The client ID of your service principal.
- `<tenant-id>`: Your Microsoft Entra ID tenant ID.
- `<secret-scope>` and `<service-credential-key>`: The Databricks secret scope and key containing the service principal secret.

### Option C: Access key (for development/testing only)

```python
spark.conf.set(
    "fs.azure.account.key.<storage_account>.dfs.core.windows.net",
    dbutils.secrets.get(scope="<secret-scope>", key="<storage-account-key>")
)
```

> [!WARNING]
> Using access keys grants full access to the storage account. Use this option only for development and testing. For production, use Option A or Option B.

## Step 2: Read ACZ Delta Parquet data

ACZ writes data in Delta Lake format. Use Spark to read the Delta tables directly:

```python
# Define the ACZ output path
acz_base_path = "abfss://<container>@<storage_account>.dfs.core.windows.net/<base_path>"

# Read well master data
df_wells = spark.read.format("delta").load(f"{acz_base_path}/master-data--Well")
display(df_wells.limit(10))

# Read field master data
df_fields = spark.read.format("delta").load(f"{acz_base_path}/master-data--Field")
display(df_fields.limit(10))

# Read well log data
df_welllogs = spark.read.format("delta").load(f"{acz_base_path}/work-product-component--WellLog")
display(df_welllogs.limit(10))
```

## Step 3: Register ACZ tables in the metastore

Register ACZ data as tables for easier SQL access:

```sql
-- Create a database for ACZ data
CREATE DATABASE IF NOT EXISTS energy_acz;

-- Register well data as an external table
CREATE TABLE IF NOT EXISTS energy_acz.wells
USING DELTA
LOCATION 'abfss://<container>@<storage_account>.dfs.core.windows.net/<base_path>/master-data--Well';

-- Register field data as an external table
CREATE TABLE IF NOT EXISTS energy_acz.fields
USING DELTA
LOCATION 'abfss://<container>@<storage_account>.dfs.core.windows.net/<base_path>/master-data--Field';

-- Register well log data as an external table
CREATE TABLE IF NOT EXISTS energy_acz.welllogs
USING DELTA
LOCATION 'abfss://<container>@<storage_account>.dfs.core.windows.net/<base_path>/work-product-component--WellLog';
```

## Step 4: Query and analyze ACZ data

Once the tables are registered, run SQL queries directly:

```sql
-- Count wells
SELECT COUNT(*) AS total_wells FROM energy_acz.wells;

-- Query well details
SELECT * FROM energy_acz.wells LIMIT 100;

-- Join wells with well logs
SELECT
    w.*,
    wl.*
FROM energy_acz.wells w
JOIN energy_acz.welllogs wl
    ON w.id = wl.wellbore_id
LIMIT 50;
```

Or use PySpark for more advanced analytics:

```python
from pyspark.sql.functions import col, count, desc

# Analyze well data
df_wells = spark.table("energy_acz.wells")

# Count records by kind
df_wells.groupBy("kind").agg(count("*").alias("record_count")).orderBy(desc("record_count")).display()
```

## Considerations

- **Incremental updates**: ACZ continuously syncs changes to ADLS Gen2 in Delta format. Delta Lake transactions ensure that Databricks always reads consistent data, even while new data is being written.
- **Time travel**: Since ACZ uses Delta format, you can use [Delta Lake time travel](/azure/databricks/delta/history) to query historical versions of the data.
- **Schema evolution**: If OSDU schemas change, the Delta tables reflect those changes. Use `mergeSchema` option if needed when reading updated tables.
- **Performance**: For large datasets, consider using [Z-ordering](/azure/databricks/delta/optimize) on frequently queried columns to improve query performance.

## Related content

- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)

