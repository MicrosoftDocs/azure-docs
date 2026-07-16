---
title: Connect Analytics Consumption Zone Data to Fabric - Azure Data Manager for Energy
description: Learn how to connect Analytics Consumption Zone data in Data Lake Storage Gen2 to Microsoft Fabric by using Microsoft OneLake shortcuts for analytics and reporting.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 05/17/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to connect Analytics Consumption Zone data to Microsoft Fabric so that I can analyze and visualize energy data.

---

# Connect Analytics Consumption Zone data to Fabric

This article shows you how to connect your Analytics Consumption Zone (ACZ) data to Microsoft Fabric by using Microsoft OneLake shortcuts. ACZ stores data in Azure Data Lake Storage Gen2. After you create shortcuts, you can query, transform, and visualize your Azure Data Manager for Energy data in Fabric lakehouses, notebooks, and Azure Power BI.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. For legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

During the preview, ACZ is available only on Developer tier instances and requires the use of allow lists. Follow the guidance in [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md), and contact your Microsoft representative.

## Prerequisites

- An Azure subscription with an Azure Data Manager for Energy (Developer tier) instance. See [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- ACZ enabled with at least one ACZ instance in `ACTIVE` status and `historicalSnapshotStatus` set to `COMPLETED`. For more information, see [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md).
- A [Fabric capacity](/fabric/enterprise/licenses) (F2 or higher) or a Fabric trial.
- A [Fabric workspace](/fabric/get-started/create-workspaces).
- At least Storage Blob Data Reader permissions on the Data Lake Storage Gen2 storage account.

## Step 1: Verify ACZ data in Data Lake Storage Gen2

Before you connect Fabric, confirm that ACZ synced data to your Data Lake Storage Gen2 storage account.

1. Go to your Data Lake Storage Gen2 storage account in the [Azure portal](https://portal.azure.com/).
1. Select **Containers** from the left menu.
1. Open the container and go to the `<aczId>/osducatalog/` folder. The `aczId` is the identifier returned when you created the ACZ instance (for example, `acz-8a0aa7433085`).
1. Verify that Delta Parquet folders exist for the catalog entity types that you configured (for example, `master-data--Well`, `master-data--Field`).

## Step 2: Create or use an existing Fabric lakehouse

If you don't already have a Fabric lakehouse in your workspace, you need to create one:

1. Go to [Fabric](https://app.fabric.microsoft.com/).
1. Select your workspace.
1. Select **+ New item** > **Lakehouse**.
1. Enter a name for your lakehouse (for example, `EnergyDataLakehouse`), and select **Create**.

If you already have a lakehouse, you can use it for ACZ data shortcuts.

> [!IMPORTANT]
  > **Schema-enabled workspaces**: If your Fabric workspace is schema-enabled, the standard folder shortcut approach might not work correctly because schema-enabled workspaces require a clean schema → tables structure. If you encounter errors such as "Unable to identify these objects as tables or views," use one of the schema-enabled workspaces approaches described in Step 3.

## Step 3: Create a Data Lake Storage Gen2 shortcut to ACZ data

The approach for connecting ACZ data depends on whether your Fabric workspace is schema enabled or nonschema enabled.

### For schema-enabled workspaces

Schema-enabled workspaces require that data follows a structured schema → tables organization. Create a table shortcut at the schema level:

1. Open your lakehouse.
1. In the **Explorer** pane, expand the schema (for example, **dbo**).
1. Right-click the schema name and select **New shortcut**.
1. Under **External sources**, select **Azure Data Lake Storage Gen2**.
1. Enter the following connection settings:

   | Setting | Value |
   |---|---|
   | **URL** | Use the Distributed File System (DFS) endpoint for your storage account: `https://<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net`. |
   | **Connection** | Select an existing connection or create a new one. |
   | **Authentication kind** | Select **Organizational account**, **Service principal**, or **Account key** as appropriate. |

1. Select **Next**.
1. Browse to the container where your ACZ data is stored.
1. Go to the `<aczId>/osducatalog/` folder. The `aczId` is the identifier from your ACZ instance creation (for example, `acz-8a0aa7433085`).
1. Select **osducatalog** to add as a table shortcut.
1. Select **Next** to review your selections, and then select **Create**.

After you create the shortcut, the `osducatalog` table appears in your schema, and you can query it directly.

### For nonschema-enabled workspaces

A Data Lake Storage Gen2 shortcut makes ACZ data available in your Fabric lakehouse without copying data. You get direct access to the Delta Parquet files that ACZ writes.

1. Open your lakehouse.
1. In the **Explorer** pane, right-click the **Tables** or **Files** folder.
1. Select **New shortcut**.
1. Under **External sources**, select **Azure Data Lake Storage Gen2**.
1. Enter the following connection settings:

   | Setting | Value |
   |---|---|
   | **URL** | Use the DFS endpoint for your storage account: `https://<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net`. |
   | **Connection** | Select an existing connection or create a new one. |
   | **Authentication kind** | Select **Organizational account**, **Service principal**, or **Account key** as appropriate. |

   > [!NOTE]
   > If your Fabric tenant and Data Lake Storage Gen2 account are in different Microsoft Entra tenants, you must use a service principal or SAS token for authentication. For more information, see [Data Lake Storage Gen2 shortcut limitations](/fabric/onelake/create-adls-shortcut#limitations).

1. Select **Next**.
1. Browse to the `<aczId>/osducatalog/` folder in your container. The `aczId` is the identifier from your ACZ instance creation (for example, `acz-8a0aa7433085`).
1. Select **osducatalog** to add as a shortcut for catalog data.
1. Select **Next** to review your selections.
1. Select **Create**.

The shortcuts appear in your lakehouse **Explorer** pane. Fabric recognizes Delta Parquet data as Delta tables automatically.

> [!NOTE]
> Data Lake Storage shortcuts use delegated authorization. The credential you set during shortcut creation applies to all access. The identity you use for authentication (organizational account, service principal, or account key) must have at least **Storage Blob Data Reader** permissions on the Data Lake Storage Gen2 account.

## Step 4: Query ACZ data in Fabric

### Use the SQL analytics endpoint

After you create the shortcuts, query ACZ data from the SQL analytics endpoint.

1. In your lakehouse, select the **SQL analytics endpoint** view.
1. Write SQL queries against the ACZ tables:

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

For advanced analytics, use a Fabric notebook.

1. From the lakehouse, select **Open notebook** > **New notebook**.
1. Use PySpark to explore ACZ data:

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

1. In your Fabric lakehouse, select the **Tables** folder in the **Explorer** pane.
1. Verify that the ACZ catalog table (`osducatalog`) appears in the table list.
1. On the top ribbon, select **New semantic model**.
1. Enter a name for the semantic model (for example, **ACZ Energy Data**).
1. Select the ACZ tables that you want to include in the model, and then select **Confirm**.

#### Build a report in the Power BI web experience

1. After you create the semantic model, select **New report** to open the Power BI report editor.
1. In the **Data** pane, expand the ACZ tables to see columns.
1. To create a visualization record that shows counts by entity type:
   - Select **Line chart** from the **Visualizations** pane.
   - Drag the `kind` field to the **X-axis**.
   - Drag the `id` field to the **Y-axis** and set aggregation to **Count**.

    The chart shows the distribution of records across different OSDU® entity types in your ACZ instance.
1. Add filters, slicers, and other pages as appropriate.
1. Select **File** > **Save** to save the report to your Fabric workspace.

> [!TIP]
> For advanced modeling in Power BI Desktop, connect to your Fabric lakehouse by using DirectLake mode for best performance. DirectLake reads data directly from lakehouse files without importing a copy, so reports always reflect the latest ACZ data.

## Related content

- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Create an Azure Data Lake Storage Gen2 shortcut](/fabric/onelake/create-adls-shortcut)