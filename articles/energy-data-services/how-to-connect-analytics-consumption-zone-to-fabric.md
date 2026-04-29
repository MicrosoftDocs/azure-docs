---
title: How to connect ACZ data to Microsoft Fabric - Azure Data Manager for Energy
description: Learn how to connect ACZ data in ADLS Gen2 to Microsoft Fabric by using OneLake shortcuts for analytics and reporting.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 03/31/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to connect ACZ data to Microsoft Fabric so that I can analyze and visualize energy data.

---

# Connect Analytics Consumption Zone (ACZ) data to Microsoft Fabric


This article shows how to connect your ACZ data to Microsoft Fabric by using OneLake shortcuts. ACZ stores data in Azure Data Lake Storage (ADLS) Gen2. After you create shortcuts, you can query, transform, and visualize your Azure Data Manager for Energy (ADME) data in Fabric lakehouses, notebooks, and Power BI.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure subscription with an [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) instance.
- ACZ enabled with at least one ACZ in `ACTIVE` status and `historicalSnapshotStatus` set to `COMPLETED`. See [How to enable the Analytics Consumption Zone (ACZ)](how-to-enable-analytics-consumption-zone.md).
- A [Microsoft Fabric capacity](/fabric/enterprise/licenses) (F2 or higher) or a Fabric trial.
- A [Fabric workspace](/fabric/get-started/create-workspaces).
- At least **Storage Blob Data Reader** permissions on the ADLS Gen2 storage account.

## Step 1: Verify ACZ data in ADLS Gen2

Before you connect Microsoft Fabric, confirm that ACZ synced data to your ADLS Gen2 storage account.

1. Navigate to your ADLS Gen2 storage account in the [Azure portal](https://portal.azure.com/).
2. Select **Containers** from the left menu.
3. Open the container and navigate to the base path you specified when you created the ACZ (or the root if you didn't set a base path).
4. Verify that Delta Parquet folders exist for the entity types you configured (for example, folders named after the OSDU kind patterns).

You can also confirm the ACZ status by using the API:

```bash
curl --request GET \
  --url https://{base_url}/api/acz/v1/aczs/{acz_id} \
  --header 'Authorization: Bearer {access_token}' \
  --header 'data-partition-id: {data_partition_id}'
```

The response should show `"status": "ACTIVE"` and `"historicalSnapshotStatus": "COMPLETED"`.

## Step 2: Create a Fabric lakehouse

1. Go to [Microsoft Fabric](https://app.fabric.microsoft.com/).
2. Select your workspace.
3. Select **+ New item** > **Lakehouse**.
4. Enter a name for your lakehouse (for example, `EnergyDataLakehouse`) and select **Create**.

## Step 3: Create an ADLS Gen2 shortcut to ACZ data

An ADLS Gen2 shortcut makes ACZ data available in your Fabric lakehouse without copying data. You get direct access to the Delta Parquet files that ACZ writes.

1. Open your lakehouse.
2. In the **Explorer** pane, right-click on the **Tables** or **Files** folder.
3. Select **New shortcut**.
4. Under **External sources**, select **Azure Data Lake Storage Gen2**.
5. Enter the connection settings:

   | Setting | Value |
   |---|---|
   | **URL** | The Distributed File System (DFS) endpoint for your storage account: `https://<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net` |
   | **Connection** | Select an existing connection or create a new one. |
   | **Authentication kind** | Select **Organizational account**, **Service principal**, or **Account key** as appropriate. |

6. Select **Next**.
7. Browse to the ACZ output folder in your storage account. If you set a `basePath` when you created the ACZ, navigate to that path.
8. Select the entity type folders you want to add as shortcuts (for example, `master-data--Well`, `master-data--Field`, `work-product-component--WellLog`).
9. Select **Next** to review your selections.
10. Select **Create**.

The shortcuts appear in your lakehouse Explorer pane. Fabric recognizes Delta Parquet data as Delta tables automatically.

> [!NOTE]
> ADLS shortcuts use delegated authorization. The credential you set during shortcut creation applies to all access. The identity must have at least **Storage Blob Data Reader** on the ADLS Gen2 account.

## Step 4: Query ACZ data in Fabric

### Use the SQL analytics endpoint

After you create the shortcuts, query ACZ data from the SQL analytics endpoint:

1. In your lakehouse, select the **SQL analytics endpoint** view.
2. Write SQL queries against the ACZ tables:

```sql
-- Count wells in the ACZ data
SELECT COUNT(*) AS well_count
FROM [EnergyDataLakehouse].[dbo].[master-data--Well]

-- Query well details
SELECT *
FROM [EnergyDataLakehouse].[dbo].[master-data--Well]
LIMIT 100
```

### Use a Fabric notebook

For advanced analytics, use a Fabric notebook:

1. From the lakehouse, select **Open notebook** > **New notebook**.
2. Use PySpark to read ACZ data:

```python
# Read well data from ACZ shortcut
df_wells = spark.read.format("delta").load("Tables/master-data--Well")

# Display sample data
display(df_wells.limit(10))

# Count records
print(f"Total wells: {df_wells.count()}")
```

```python
# Read well log data from ACZ shortcut
df_welllogs = spark.read.format("delta").load("Tables/work-product-component--WellLog")

# Display schema
df_welllogs.printSchema()

# Show sample records
display(df_welllogs.limit(10))
```

### Connect to Power BI

After ACZ data is accessible in your lakehouse, you can build Power BI reports and dashboards.

#### Create a semantic model

1. In your Fabric lakehouse, select the **Tables** folder in the explorer pane.
1. Verify that the ACZ Delta tables (for example, `master-data--Well`, `work-product-component--WellLog`) appear in the table list.
1. On the top ribbon, select **New semantic model**.
1. Enter a name for the semantic model (for example, `ACZ Energy Data`).
1. Select the ACZ tables you want to include in the model, then select **Confirm**.

#### Build a report in the Power BI web experience

1. After you create the semantic model, select **New report** to open the Power BI report editor.
1. In the **Data** pane, expand the ACZ tables to see columns.
1. Drag columns onto the canvas to build visuals. For example:
   - Drag `FacilityName` from the Wells table to create a table visual of well names.
   - Use the `Basin` column to create a bar chart showing wells grouped by basin.
   - Drag `CreatedDate` to create a timeline chart showing when records were ingested.
1. Add filters, slicers, and more pages as needed.
1. Select **File** > **Save** to save the report to your Fabric workspace.

#### Use Power BI Desktop (optional)

If you prefer Power BI Desktop for advanced modeling:

1. Open Power BI Desktop and select **Get data** > **Microsoft Fabric** > **Lakehouses**.
1. Sign in with your Microsoft Entra credentials and select your Fabric workspace.
1. Select the lakehouse containing your ACZ shortcuts.
1. Choose the ACZ tables you want to import or connect to by using DirectLake mode.
1. Build your report by using Power BI Desktop features (calculated columns, measures, relationships, and so on).
1. Publish the report to your Fabric workspace by selecting **Home** > **Publish**.

> [!TIP]
> DirectLake mode provides the best performance for Delta tables in Fabric. It reads data directly from the lakehouse files without importing a copy. Your reports always reflect the latest ACZ data.

## Considerations

- **Data freshness**: ACZ synchronizes changes incrementally after the initial snapshot. New and updated OSDU records appear in ADLS Gen2 and show through Fabric shortcuts with no extra steps.
- **Schema evolution**: If the OSDU schema changes, the Delta Parquet files reflect those changes. To see schema updates, refresh your lakehouse metadata.
- **Cross-tenant access**: If your Fabric tenant and ADLS Gen2 account are in different Microsoft Entra tenants, use a service principal or SAS token for authentication. See [ADLS Gen2 shortcut limitations](/fabric/onelake/create-adls-shortcut#limitations).

## Related content

- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Create an Azure Data Lake Storage Gen2 shortcut](/fabric/onelake/create-adls-shortcut)

