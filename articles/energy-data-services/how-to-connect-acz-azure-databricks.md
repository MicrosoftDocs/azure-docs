---
title: Connect Azure Databricks to Analytics Consumption Zone
description: Learn how to configure Azure Databricks to query Analytics Consumption Zone (ACZ) data from Azure Data Manager for Energy using external tables and Delta Lake.
author: nsannala
ms.author: nsannala
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 5/5/2026
ms.custom: template-how-to-pattern
---

# Connect Azure Databricks to Analytics Consumption Zone

This article shows you how to connect Azure Databricks to Analytics Consumption Zone (ACZ) data in Azure Data Manager for Energy. After completing these steps, you'll be able to query OSDU data using Databricks SQL and notebooks.

## Prerequisites

- An Azure Data Manager for Energy instance with ACZ enabled
- ACZ provisioned with at least one data kind (for example, `osducatalog`)
- An Azure Databricks workspace in the same Azure region as your ACZ storage account
- Contributor or Owner permissions on the ACZ storage account
- Permissions to create resources in Azure Databricks

## Setup overview

Complete the following steps to connect Azure Databricks to your ACZ data. After setup, you can create external tables for multiple ACZ datasets using the same storage credential and external location.

| Step | Task | Description |
|------|------|-------------|
| 1 | Create an Access Connector for Azure Databricks | Provides managed identity for secure storage access |
| 2 | Grant permissions to the Access Connector | Assigns storage and event notification permissions |
| 3 | Create a storage credential in Databricks | Links the Access Connector to Databricks |
| 4 | Create an external location | Defines the ACZ storage path and validates permissions |
| 5 | Create a schema and external table | Registers ACZ datasets as queryable tables |

## Step 1: Create an Access Connector for Azure Databricks

The Access Connector provides a managed identity that Databricks uses to authenticate to Azure Storage.

1. In the [Azure portal](https://portal.azure.com), search for **Access Connector for Azure Databricks**.
2. Select **Create**.
3. On the **Basics** tab, configure these settings:
   - **Subscription**: Select your subscription
   - **Resource group**: Select or create a resource group
   - **Name**: Enter a name (for example, `acz-databricks-access-connector`)
   - **Region**: Select the same region as your ACZ storage account

4. Select **Review + create**, then **Create**.
5. After deployment completes, go to the Access Connector resource.
6. On the **Overview** page, copy the **Resource ID**. You'll use this in Step 3.

   The Resource ID has this format:
   ```text
   /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Databricks/accessConnectors/{connector-name}
   ```

## Step 2: Grant permissions to the Access Connector

The Access Connector requires permissions at both the storage account level and resource group level to enable Delta Lake table management and event-driven data refresh.

### Grant storage account permissions

1. In the Azure portal, navigate to your ACZ storage account (for example, `aczstorage`).
2. In the left menu, select **Access Control (IAM)**.
3. Select **Add** > **Add role assignment**.
4. Assign the following three roles to the Access Connector's managed identity. For each role:
   - On the **Role** tab, search for and select the role
   - Select **Next**
   - On the **Members** tab:
     - For **Assign access to**, select **Managed identity**
     - Select **+ Select members**
     - Under **Managed identity**, select **Access Connector for Azure Databricks**
     - Select your access connector from the list
     - Select **Select**
   - Select **Review + assign**

   **Required roles**:
   - **Storage Blob Data Contributor** — Enables reading and writing blob data
   - **Storage Queue Data Contributor** — Enables reading storage queue messages for event notifications
   - **Storage Account Contributor** — Enables managing storage account configuration

### Grant resource group permissions

5. Navigate to the **Resource Group** that contains your Azure Databricks workspace and Access Connector.
6. In the left menu, select **Access Control (IAM)**.
7. Assign the following two roles to the Access Connector's managed identity (using the same steps as above):

   **Required roles**:
   - **EventGrid EventSubscription Contributor** — Enables creating and managing Event Grid subscriptions
   - **EventGrid Data Contributor** — Enables sending events to Event Grid topics

> [!NOTE]
> These EventGrid permissions enable Databricks to automatically detect when new Delta files are written to ACZ storage, improving query performance by avoiding full folder scans.

> [!IMPORTANT]
> Wait 2-3 minutes after assigning all roles for the permissions to propagate before proceeding to the next step.

## Step 3: Create a storage credential in Databricks

Storage credentials securely store authentication information for cloud storage.

1. Sign in to your Azure Databricks workspace.
2. In the left sidebar, select **Catalog**.
3. In the **Catalog** page, select **Create**, then select **Create a credential**.
4. Configure the credential:
   - **Credential type**: Select **Azure Managed Identity**
   - **Credential name**: Enter a name (for example, `acz_cred`)
   - **Access Connector ID**: Paste the Resource ID from Step 1
5. Select **Create**.

## Step 4: Create an external location

External locations define storage paths that Databricks can access using the storage credential. This step validates that all required permissions are correctly configured.

> [!TIP]
> Point the external location to the ACZ root folder (not a specific dataset folder). This allows you to create multiple tables for different ACZ datasets using the same location.

1. In the **Catalog** page, select **Create**, then select **Create an external location**.
2. Configure the location:
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
3. Select **Create**.
4. After creation, select the external location from the list, then select **Test connection** to validate that all permissions are correctly configured.
   
   The test checks for:
   - **Read** — Access to read blob data
   - **List** — Access to list folders and files
   - **Path exists** — Verification that the ACZ path is accessible
   - **Hierarchical namespace enabled** — Confirmation that ADLS Gen2 features are enabled
   - **File events read** — Access to storage event notifications (requires EventGrid permissions)

   **Example configuration**:
   - **Location name**: `acz_location`
   - **URL**: `abfss://aczcontainer@aczstorage.dfs.core.windows.net/acz-bea199c0690b/`
   - **Storage credential**: `acz_cred`

**Alternatively, create the external location using SQL**:

```sql
CREATE EXTERNAL LOCATION acz_location
URL 'abfss://aczcontainer@aczstorage.dfs.core.windows.net/acz-bea199c0690b/'
WITH (STORAGE CREDENTIAL acz_cred);
```

> [!NOTE]
> To find your ACZ instance ID, navigate to your ACZ storage container in the Azure portal. The ACZ folder follows the pattern `acz-{instance-id}`.

## Step 5: Create a schema and external table

Create a schema to organize your tables, then register the ACZ Delta Lake dataset as an external table.

1. In Databricks, open a SQL editor or notebook.
2. Create a schema (also called a database):

   ```sql
   CREATE SCHEMA IF NOT EXISTS `{catalog-name}`.osdudata;
   ```

   Replace `{catalog-name}` with your Databricks catalog name.

3. Create an external table pointing to the ACZ dataset:

   ```sql
   CREATE EXTERNAL TABLE IF NOT EXISTS `{catalog-name}`.osdudata.catalogdata
   USING DELTA
   LOCATION 'abfss://{container-name}@{storage-account}.dfs.core.windows.net/acz-{instance-id}/osducatalog';
   ```

   This example creates a table for the `osducatalog` dataset. To create tables for other ACZ datasets, change `osducatalog` to the dataset name (for example, `wellboreDDMS`).

   **Example for a catalog named `acz-catalog`**:

   ```sql
   CREATE SCHEMA IF NOT EXISTS `acz-catalog`.osdudata;

   CREATE EXTERNAL TABLE IF NOT EXISTS `acz-catalog`.osdudata.catalogdata
   USING DELTA
   LOCATION 'abfss://aczcontainer@aczstorage.dfs.core.windows.net/acz-bea199c0690b/osducatalog';
   ```

## Query the ACZ data

After creating your external tables, you can query the ACZ data using standard SQL queries in Databricks notebooks or SQL editor.

**SQL query template**:

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

**Example queries for osducatalog**:

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

## Understanding external locations vs external tables

| Component | Path | Purpose |
|-----------|------|---------|
| **External Location** | `abfss://container@storage.dfs.core.windows.net/acz-{id}/` | Defines the access boundary—the root folder where Databricks can read data |
| **External Table** | `abfss://container@storage.dfs.core.windows.net/acz-{id}/osducatalog` | Points to a specific Delta Lake dataset within the external location |

**Why this matters:**
- The external location grants broad access to the ACZ root folder
- You can create multiple tables (for example, `osducatalog`, `wellboreDDMS`) using the same location
- This follows Unity Catalog best practices for organizing multi-dataset access

## Troubleshooting

### Access denied errors

If you see `403 Forbidden` or `Access Denied` errors:

1. Verify the Access Connector has all required roles:
   - **On the storage account**: Storage Blob Data Contributor, Storage Queue Data Contributor, Storage Account Contributor
   - **On the resource group**: EventGrid EventSubscription Contributor, EventGrid Data Contributor
2. Wait 2-3 minutes after role assignment for permissions to propagate
3. Verify the storage credential Resource ID is correct
4. Check that the ACZ instance ID in the path exactly matches the folder name in storage (including any suffix like `b`)

### External location test connection failures

If the **Test connection** button in the External Location setup shows failures:

1. Verify all five role assignments are in place (three on storage account, two on resource group)
2. Check that the resource group permissions are assigned to the same resource group containing both the Databricks workspace and Access Connector
3. Ensure hierarchical namespace is enabled on the storage account (required for ADLS Gen2)
4. Wait a few minutes and retry — role propagation can take time

### Path not found errors

If you see `Path does not exist` errors:

1. In the Azure portal, navigate to your ACZ storage account
2. Browse to **Containers** > `{container-name}`
3. Verify the ACZ folder name exactly matches your SQL path (for example, `acz-bea199c0690b` not `acz-bea199c0690`)
4. Verify the dataset folder exists (for example, `osducatalog`)

### Delta table metadata errors

If you see errors about missing `_delta_log`:

1. Verify ACZ has completed at least one data sync for the dataset
2. Check that the LOCATION path points to the Delta root folder (not a subfolder)
3. Confirm the dataset exists in ACZ by checking the storage container

**Verify Delta folder structure using Azure CLI**:

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

## Next steps

- [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md)
- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)

## Related content

- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Azure Databricks Unity Catalog](/azure/databricks/data-governance/unity-catalog/)
- [Access Connector for Azure Databricks](/azure/databricks/security/network/classic/access-connector)
