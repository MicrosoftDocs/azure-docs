---
title: Connect Analytics Consumption Zone to Azure Databricks
description: Learn how to configure Analytics Consumption Zone to export Azure Data Manager for Energy data to Azure Databricks by using external tables and Delta Lake.
author: nsannala
ms.author: nsannala
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 05/17/2026
ms.custom: template-how-to-pattern
---

# Connect Analytics Consumption Zone to Azure Databricks

This article shows you how to connect Analytics Consumption Zone (ACZ) to Azure Databricks for querying Azure Data Manager for Energy data. After you finish these steps, you can query OSDU® data by using Azure Databricks, SQL, and notebooks.

> [!NOTE]
> During the preview, ACZ is available only on Developer tier instances and requires the use of allow lists. Follow the guidance in [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md), and contact your Microsoft representative.

## Prerequisites

- An Azure subscription with an Azure Data Manager for Energy (Developer tier) instance that has ACZ enabled.
- ACZ provisioned with at least one data kind.
- An Azure Databricks workspace in the same Azure region as your ACZ storage account.
- Contributor or Owner permissions on the ACZ storage account.
- Permissions to create resources in Azure Databricks.

## Setup overview

Use the following steps to connect your ACZ data to Azure Databricks. After setup, you can create external tables for multiple ACZ datasets by using the same storage credential and external location.

| Step | Task | Description |
|------|------|-------------|
| 1 | Create an access connector for Azure Databricks | Provides managed identity for secure storage access. |
| 2 | Grant permissions to the access connector | Assigns storage and event notification permissions. |
| 3 | Create a storage credential in Azure Databricks | Links the access connector to Azure Databricks. |
| 4 | Create an external location | Defines the ACZ storage path and validates permissions. |
| 5 | Create a schema and external table | Registers ACZ datasets as queryable tables. |

## Step 1: Create an access connector for Azure Databricks

The access connector provides a managed identity that Azure Databricks uses to authenticate to Azure Storage.

1. In the [Azure portal](https://portal.azure.com), search for **Access Connector for Azure Databricks**.
1. Select **Create**.
1. On the **Basics** tab, configure these settings:
   - **Subscription**: Select your subscription.
   - **Resource group**: Select or create a resource group.
   - **Name**: Enter a name (for example, `acz-databricks-access-connector`).
   - **Region**: Select the same region as your ACZ storage account.

1. Select **Review + create**, and then select **Create**.
1. After deployment finishes, go to the access connector resource.
1. On the **Overview** page, copy the resource ID. You use this resource ID in Step 3.

   The resource ID has the following format:

   ```text
   /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Databricks/accessConnectors/{connector-name}
   ```

## Step 2: Grant permissions to the access connector

The access connector requires permissions at both the storage account level and resource group level to enable Delta Lake table management and event-driven data refresh.

### Grant storage account permissions

1. In the Azure portal, go to your ACZ storage account (for example, `aczstorage`).
1. In the left menu, select **Access Control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. Assign the following three roles to the access connector's managed identity. For each role:
   1. On the **Role** tab, search for and select the role.
   1. Select **Next**.
   1. On the **Members** tab:
      1. For **Assign access to**, select **Managed identity**.
      1. Choose **+ Select members**.
      1. Under **Managed identity**, select **Access Connector for Azure Databricks**.
      1. Select your access connector from the list.
      1. Choose **Select**.
   1. Select **Review + assign**.

   Required roles:
   - **Storage Blob Data Contributor**: Enables reading and writing blob data.
   - **Storage Queue Data Contributor**: Enables reading storage queue messages for event notifications.
   - **Storage Account Contributor**: Enables managing storage account configuration.

### Grant resource group permissions

1. Go to the resource group that contains your Azure Databricks workspace and the access connector.
1. In the left menu, select **Access Control (IAM)**.
1. Assign the following two roles to the access connector's managed identity (repeat the role assignment process):

   Required roles:
   - **EventGrid EventSubscription Contributor**: Enables creating and managing Azure Event Grid subscriptions.
   - **EventGrid Data Contributor**: Enables sending events to Event Grid topics.

   These Event Grid permissions enable Azure Databricks to automatically detect when new Delta files are written to ACZ storage, which improves query performance by avoiding full folder scans.

   > [!IMPORTANT]
   > Wait two to three minutes after you assign all roles for the permissions to propagate before you proceed to the next step.

## Step 3: Create a storage credential in Databricks

Storage credentials securely store authentication information for cloud storage.

1. Sign in to your Azure Databricks workspace.
1. In the left sidebar, select **Catalog**.
1. On the **Catalog** page, select **Create**, and then select **Create a credential**.
1. Configure the credential:
   - **Credential type**: Select **Azure Managed Identity**.
   - **Credential name**: Enter a name (for example, `acz_cred`).
   - **Access Connector ID**: Paste the resource ID from Step 1.
1. Select **Create**.

## Step 4: Create an external location

External locations define storage paths that Azure Databricks can access by using the storage credential. This step validates that all required permissions are correctly configured.

> [!TIP]
> Point the external location to the ACZ root folder (not a specific dataset folder). You can use this configuration to create multiple tables for different ACZ datasets by using the same location.

1. On the **Catalog** page, select **Create**, and then select **Create an external location**.
1. Configure the location:
   - **Location name**: Enter a name (for example, `acz_location`)
   - **URL**: Enter the ACZ root path:
     ```text
     abfss://{container-name}@{storage-account}.dfs.core.windows.net/acz-{instance-id}/
     ```
     Replace:
     - `{container-name}`: Your ACZ container name (for example, `aczcontainer`)
     - `{storage-account}`: Your storage account name (for example, `aczstorage`)
     - `{instance-id}`: Your ACZ instance ID (for example, `bea199c0690b`)
   - **Storage credential**: Select the credential created in Step 3 (for example, `acz_cred`)
1. Select **Create**.
1. After creation, select the external location from the list, and then select **Test connection** to validate that all permissions are correctly configured.

   The test checks for:
   - **Read**: Access to read blob data.
   - **List**: Access to list folders and files.
   - **Path exists**: Verification that the ACZ path is accessible.
   - **Hierarchical namespace enabled**: Confirmation that Data Lake Storage Gen2 features are enabled.
   - **File events read**: Access to storage event notifications (requires Event Grid permissions).

   Example configuration:
   - **Location name**: `acz_location`
   - **URL**: `abfss://aczcontainer@aczstorage.dfs.core.windows.net/acz-bea199c0690b/`
   - **Storage credential**: `acz_cred`

Alternatively, create the external location by using SQL:

```sql
CREATE EXTERNAL LOCATION acz_location
URL 'abfss://aczcontainer@aczstorage.dfs.core.windows.net/acz-bea199c0690b/'
WITH (STORAGE CREDENTIAL acz_cred);
```

> [!NOTE]
> To find your ACZ instance ID, go to your ACZ storage container in the Azure portal. The ACZ folder follows the pattern `acz-{instance-id}`.

## Step 5: Create a schema and external table

Create a schema to organize your tables, and then register the ACZ Delta Lake dataset as an external table.

1. In Azure Databricks, open a SQL editor or notebook.
1. Create a schema (also called a database):

   ```sql
   CREATE SCHEMA IF NOT EXISTS `{catalog-name}`.osdudata;
   ```

   Replace `{catalog-name}` with your Azure Databricks catalog name.

1. Create an external table that points to the ACZ dataset:

   ```sql
   CREATE EXTERNAL TABLE IF NOT EXISTS `{catalog-name}`.osdudata.catalogdata
   USING DELTA
   LOCATION 'abfss://{container-name}@{storage-account}.dfs.core.windows.net/acz-{instance-id}/osducatalog';
   ```

   This example creates a table for the `osducatalog` dataset. To create tables for other ACZ datasets, change `osducatalog` to the dataset name (for example, `wellboreDDMS`).

   Example for a catalog named `acz-catalog`:

   ```sql
   CREATE SCHEMA IF NOT EXISTS `acz-catalog`.osdudata;

   CREATE EXTERNAL TABLE IF NOT EXISTS `acz-catalog`.osdudata.catalogdata
   USING DELTA
   LOCATION 'abfss://aczcontainer@aczstorage.dfs.core.windows.net/acz-bea199c0690b/osducatalog';
   ```

## Query the ACZ data

After you create your external tables, you can query the ACZ data by using standard SQL queries in Azure Databricks notebooks or a SQL editor.

SQL query template:

```sql
-- Count total records
SELECT COUNT(*) AS total_records
FROM `<catalog-name>`.<schema-name>.<table-name>;

-- Count records by kind
SELECT kind, COUNT(*) AS record_count
FROM `<catalog-name>`.<schema-name>.<table-name>
GROUP BY kind
ORDER BY record_count DESC;

-- Preview data
SELECT *
FROM `<catalog-name>`.<schema-name>.<table-name>
LIMIT 10;

-- Show table schema
DESCRIBE TABLE `<catalog-name>`.<schema-name>.<table-name>;

-- Show table details including storage location
DESCRIBE TABLE EXTENDED `<catalog-name>`.<schema-name>.<table-name>;
```

Example queries for `osducatalog`:

```sql
-- Count records
SELECT COUNT(*) AS total_records
FROM `acz-catalog`.osdudata.catalogdata;

-- Count records by kind
SELECT kind, COUNT(*) AS record_count
FROM `acz-catalog`.osdudata.catalogdata
GROUP BY kind
ORDER BY record_count DESC;

-- Preview data
SELECT *
FROM `acz-catalog`.osdudata.catalogdata
LIMIT 10;

-- Query specific columns (adjust based on your schema)
SELECT id, kind, createTime
FROM `acz-catalog`.osdudata.catalogdata
LIMIT 10;
```

## Understand external locations vs. external tables

| Component | Path | Purpose |
|-----------|------|---------|
| External location | `abfss://container@storage.dfs.core.windows.net/acz-{id}/` | Defines the access boundary, which is the root folder where Azure Databricks can read data. |
| External table | `abfss://container@storage.dfs.core.windows.net/acz-{id}/osducatalog` | Points to a specific Delta Lake dataset within the external location. |

Why location matters:

- The external location grants broad access to the ACZ root folder.
- By using the same location, you can create multiple tables (for example, `osducatalog` and `wellboreDDMS`).
- This configuration follows Unity Catalog best practices for organizing multi-dataset access.

## Troubleshooting

### Access denied errors

If you see "403 Forbidden" or "Access denied" errors:

1. Verify that the access connector has all the required roles:
   - **On the storage account**: Storage Blob Data Contributor, Storage Queue Data Contributor, and Storage Account Contributor
   - **On the resource group**: EventGrid EventSubscription Contributor and EventGrid Data Contributor
1. Wait two to three minutes after role assignment for permissions to propagate.
1. Verify that the storage credential resource ID is correct.
1. Check that the ACZ instance ID in the path exactly matches the folder name in storage (including any suffix like `b`).

### External location test connection failures

If **Test connection** in the external location setup shows failures:

- Verify that all five role assignments are in place (three on storage account and two on resource group).
- Check that the resource group permissions are assigned to the same resource group that contains both the Azure Databricks workspace and the access connector.
- Ensure that the hierarchical namespace is enabled on the storage account (required for Data Lake Storage Gen2).
- Wait a few minutes and retry. Role propagation can take time.

### Path not found errors

If you see "Path does not exist" errors:

1. In the Azure portal, go to your ACZ storage account.
1. Browse to **Containers** > `{container-name}`.
1. Verify that the ACZ folder name exactly matches your SQL path (for example, `acz-bea199c0690b` and not `acz-bea199c0690`).
1. Verify that the dataset folder exists (for example, `osducatalog`).

### Delta table metadata errors

If you see errors about missing `_delta_log`:

1. Verify that ACZ finished at least one data sync for the dataset.
1. Check that the `LOCATION` path points to the Delta root folder (not a subfolder).
1. Confirm that the dataset exists in ACZ by checking the storage container.

Verify Delta folder structure by using the Azure CLI:

```azurecli
# List ACZ datasets
az storage fs directory list \
  --account-name <storage-account> \
  --file-system <container-name> \
  --path "acz-<instance-id>" \
  --auth-mode login \
  --query "[].name" -o table

# Check for _delta_log folder in a specific dataset
az storage fs directory list \
  --account-name <storage-account> \
  --file-system <container-name> \
  --path "acz-<instance-id>/<dataset-folder>" \
  --auth-mode login \
  --query "[?name=='_delta_log'].name" -o table
```

## Related content

- [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md)
- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Azure Databricks Unity Catalog](/azure/databricks/data-governance/unity-catalog/)
- [Use Azure managed identities in Unity Catalog](/azure/databricks/connect/unity-catalog/cloud-storage/azure-managed-identities)
