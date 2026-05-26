---
title: Connect Analytics Consumption Zone (ACZ) data to Microsoft Fabric - Azure Data Manager for Energy
description: Learn how to connect ACZ data in ADLS Gen2 to Microsoft Fabric by using OneLake shortcuts for analytics and reporting.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 05/17/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to connect ACZ data to Microsoft Fabric so that I can analyze and visualize energy data.

---

# How to connect Analytics Consumption Zone (ACZ) data to Microsoft Fabric


This article shows how to connect your ACZ data to Microsoft Fabric by using OneLake shortcuts. ACZ stores data in Azure Data Lake Storage (ADLS) Gen2. After you create shortcuts, you can query, transform, and visualize your Azure Data Manager for Energy data in Fabric lakehouses, notebooks, and Power BI.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> During the preview, ACZ is only available on Developer Tier instances and requires allowlisting. Follow the guidance in [How to enable the Analytics Consumption Zone (ACZ)](how-to-enable-analytics-consumption-zone.md) and contact your Microsoft representative.

## Prerequisites

- An Azure subscription with an Azure Data Manager for Energy (Developer Tier) instance. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- ACZ enabled with at least one ACZ in `ACTIVE` status and `historicalSnapshotStatus` set to `COMPLETED`. See [How to enable the Analytics Consumption Zone (ACZ)](how-to-enable-analytics-consumption-zone.md).
- A [Microsoft Fabric capacity](/fabric/enterprise/licenses) (F2 or higher) or a Fabric trial.
- A [Fabric workspace](/fabric/get-started/create-workspaces).
- You have at least **Storage Blob Data Reader** permissions on the ADLS Gen2 storage account.

## Step 1: Verify ACZ data in ADLS Gen2

Before you connect Microsoft Fabric, confirm that ACZ synced data to your ADLS Gen2 storage account.

1. Navigate to your ADLS Gen2 storage account in the [Azure portal](https://portal.azure.com/).
2. Select **Containers** from the left menu.
3. Open the container and navigate to the `<aczId>/osducatalog/` folder. The `aczId` is the identifier returned when you created the ACZ (for example, `acz-8a0aa7433085`).
4. Verify that Delta Parquet folders exist for the catalog entity types you configured (for example, `master-data--Well`, `master-data--Field`).

## Step 2: Create or use an existing Fabric lakehouse

If you don't already have a Fabric lakehouse in your workspace, create one:

1. Go to [Microsoft Fabric](https://app.fabric.microsoft.com/).
2. Select your workspace.
3. Select **+ New item** > **Lakehouse**.
4. Enter a name for your lakehouse (for example, `EnergyDataLakehouse`) and select **Create**.

If you already have a lakehouse, you can use it for ACZ data shortcuts.

> [!IMPORTANT]
  > **Schema-enabled workspaces**: If your Fabric workspace is schema-enabled, the standard folder shortcut approach might not work correctly because schema-enabled workspaces require a clean schema → tables structure. If you encounter errors such as "Unable to identify these objects as tables or views," use one of the schema-enabled workspaces approaches described in Step 3.
## Step 3: Create an ADLS Gen2 shortcut to ACZ data

The approach for connecting ACZ data depends on whether your Fabric workspace is schema-enabled or non-schema-enabled.

### For schema-enabled workspaces

Schema-enabled workspaces require that data follows a structured schema → tables organization. Choose one of the following options:

#### Option 1: Create a table shortcut at the schema level

This approach creates a shortcut directly to the `osducatalog` table within your lakehouse schema:

1. Open your lakehouse.
2. In the **Explorer** pane, expand the schema (for example, **dbo**).
3. Right-click on the schema name and select **New shortcut**.
4. Under **External sources**, select **Azure Data Lake Storage Gen2**.
5. Enter the connection settings:

   | Setting | Value |
   |---|---|
   | **URL** | The Distributed File System (DFS) endpoint for your storage account: `https://<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net` |
   | **Connection** | Select an existing connection or create a new one. |
   | **Authentication kind** | Select **Organizational account**, **Service principal**, or **Account key** as appropriate. |

6. Select **Next**.
7. Browse to the container where your ACZ data is stored.
8. Navigate to the `<aczId>/osducatalog/` folder. The `aczId` is the identifier from your ACZ creation (for example, `acz-8a0aa7433085`).
9. Select **osducatalog** to add as a table shortcut.
10. Select **Next** to review your selections, then select **Create**.

After you create the shortcut, the `osducatalog` table appears in your schema and can be queried directly.

#### Option 2: Load to table from Files

This approach creates a shortcut in the Files section, then loads it as a table:

1. Open your lakehouse.
2. In the **Explorer** pane, right-click on **Files** in OneLake.
3. Select **New shortcut**.
4. Under **External sources**, select **Azure Data Lake Storage Gen2**.
5. Enter the connection settings as described in Option 1.
6. Select **Next**.
7. Browse to the container and select the base folder that contains your ACZ data (the folder containing the `<aczId>` subfolder).
8. Select **Next** to review your selections, then select **Create**.
9. After the shortcut is created, expand the shortcut in the **Files** pane to navigate to the `osducatalog` folder.
10. Right-click on **osducatalog** and select **Load to Table** > **New table**.
11. In the dialog:
    - Select the target schema (for example, **dbo**).
    - Enter a table name (for example, `osducatalog`).
    - Set the file type to **Parquet**.
12. Select **Load**.

The ACZ data now appears as a table in your schema's Tables section.

### For non-schema-enabled workspaces

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

   > [!NOTE]
   > If your Fabric tenant and ADLS Gen2 account are in different Microsoft Entra tenants, you must use a service principal or SAS token for authentication. See [ADLS Gen2 shortcut limitations](/fabric/onelake/create-adls-shortcut#limitations).

6. Select **Next**.
7. Browse to the `<aczId>/osducatalog/` folder in your container. The `aczId` is the identifier from your ACZ creation (for example, `acz-8a0aa7433085`).
8. Select **osducatalog** to add as a shortcut for catalog data.
9. Select **Next** to review your selections.
10. Select **Create**.

The shortcuts appear in your lakehouse Explorer pane. Fabric recognizes Delta Parquet data as Delta tables automatically.

> [!NOTE]
> ADLS shortcuts use delegated authorization. The credential you set during shortcut creation applies to all access. The identity you use for authentication (organizational account, service principal, or account key) must have at least **Storage Blob Data Reader** permissions on the ADLS Gen2 account.

## Step 4: Query ACZ data in Fabric

### Use the SQL analytics endpoint

After you create the shortcuts, query ACZ data from the SQL analytics endpoint:

1. In your lakehouse, select the **SQL analytics endpoint** view.
2. Write SQL queries against the ACZ tables:

```sql
-- Count records by entity type
SELECT kind, COUNT(*) AS record_count
FROM [EnergyDataLakehouse].[dbo].[osducatalog]
GROUP BY kind
ORDER BY record_count DESC

-- Query record details
SELECT *
FROM [EnergyDataLakehouse].[dbo].[osducatalog]
LIMIT 100
```

### Use a Fabric notebook

For advanced analytics, use a Fabric notebook:

1. From the lakehouse, select **Open notebook** > **New notebook**.
2. Use PySpark to explore ACZ data:

```python
# Read data from ACZ shortcut
df = spark.read.format("delta").load("Tables/osducatalog")

# Display schema
df.printSchema()

# Show sample records
display(df.limit(10))

# Filter by kind (for example, find specific entity types)
df_filtered = df.filter(df.kind.contains("Well"))
print(f"Records matching 'Well' in kind: {df_filtered.count()}")
display(df_filtered.limit(10))
```

### Connect to Power BI

After ACZ data is accessible in your lakehouse, you can build Power BI reports and dashboards.

#### Create a semantic model

1. In your Fabric lakehouse, select the **Tables** folder in the explorer pane.
1. Verify that the ACZ catalog table (`osducatalog`) appears in the table list.
1. On the top ribbon, select **New semantic model**.
1. Enter a name for the semantic model (for example, `ACZ Energy Data`).
1. Select the ACZ tables you want to include in the model, then select **Confirm**.

#### Build a report in the Power BI web experience

1. After you create the semantic model, select **New report** to open the Power BI report editor.
1. In the **Data** pane, expand the ACZ tables to see columns.
1. To create a visualization showing record counts by entity type:
   - Select **Line chart** from the Visualizations pane.
   - Drag the `kind` field to the **X-axis**.
   - Drag the `id` field to the **Y-axis** and set aggregation to **Count**.
   - This chart shows the distribution of records across different OSDU® entity types in your ACZ.
1. Add filters, slicers, and other pages as appropriate.
1. Select **File** > **Save** to save the report to your Fabric workspace.

> [!TIP]
> For advanced modeling in Power BI Desktop, connect to your Fabric lakehouse using DirectLake mode for best performance. DirectLake reads data directly from lakehouse files without importing a copy, so reports always reflect the latest ACZ data.

## Related content

- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Create an Azure Data Lake Storage Gen2 shortcut](/fabric/onelake/create-adls-shortcut)

