---
title: Set up federated data connectors in Microsoft Sentinel data lake
titleSuffix: Microsoft Security
description: Learn how to configure federated data connectors for Azure Databricks, ADLS Gen 2, and Microsoft Fabric in Microsoft Sentinel data lake.
author: EdB-MSFT
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform
ms.topic: how-to
ms.date: 03/29/2026
ms.author: edbaynash
ms.collection: ms-security

#Customer intent: As a security administrator, I want to set up federated data connectors so that I can query external data sources from the Microsoft Sentinel data lake.
---

# Set up federated data connectors in Microsoft Sentinel data lake

This article explains how to configure federated data connectors to enable querying of external data sources from the Microsoft Sentinel data lake. You can federate with Azure Databricks, Azure Data Lake Storage (ADLS) Gen 2, and Microsoft Fabric.

## Prerequisites

Before setting up data federation, ensure you meet the following requirements:

- **Sentinel data lake onboarding**: Your tenant must be onboarded to the Sentinel data lake. For more information, see [Onboard to Microsoft Sentinel data lake](sentinel-lake-onboard-defender.md).

- **Public accessibility**: The external source must be publicly accessible. Private endpoints aren't currently supported.
- **Service principal**: A service principal with appropriate permissions in the data source you want to connect with is required for Azure Databricks and Azure Data Lake Storage Gen2 sources. For more information, see [Microsoft Entra ID app registrations](/entra/identity-platform/quickstart-register-app).
- **Azure Key Vault**: An Azure Key Vault configured with the Service principal client secret is required. The Microsoft Sentinel application identity needs permissions assigned to the key vault. For more information on configuring Azure Key vaults, see [Azure Key Vaults](/azure/key-vault/general/basic-concepts).
- **Microsoft Sentinel permissions**: **Data (manage)** permissions on System tables to configure a data federation connector. For more information, see [Roles and permissions in the Microsoft Sentinel platform](/azure/sentinel/roles).


## Create a service principal

For Azure Databricks and ADLS Gen 2 federation, you need a service principal with access credentials stored in Azure Key Vault. You can use an existing service principal or use the following steps to create a new service principal.

1. **Create a Microsoft Entra ID application registration**:
   1. In the Azure portal, navigate to **Microsoft Entra ID** > **App registrations**.
   1. Select **New registration**.
   1. Enter a name for the application.
   1. Leave the redirect URI empty (not required for this scenario).
   1. Select **Register**.

1. **Create a client secret**:
   1. In your app registration, go to **Certificates & secrets**.
   1. Select **New client secret**.
   1. Enter a description and select an expiration period.
   1. Select **Add**.
   1. Copy the client secret value immediately for use in the next section. You can't retrieve this value after you leave the page.

1. **Note the application details**:
   - Application (client) ID
   - Object ID
   - Directory (tenant) ID

For more information on creating service principals, see [Microsoft Entra ID app registrations](/entra/identity-platform/quickstart-register-app).


## Create an Azure Key Vault and store credentials

You can use an existing Azure Key Vault and follow the steps below to configure Key Vault access, or create a new Key Vault using the following steps:

1. **Create an Azure Key Vault**:
   1. In the Azure portal, create a new Azure Key Vault.
   1. Use the **Azure role-based access control (recommended)** permission model.
   1. Enable soft delete and purge protection settings for the key vault. 
   1. Note the Key Vault URI after creation.

1. **Configure Key Vault access**: 
    1. Assign the **Key Vault Secrets User** role to the Microsoft Sentinel platform's managed identity. The identity is prefixed with `msg-resources-`.
    1. If you're using access policies for Key Vaults instead of Azure role-based access control, provide the permissions for Get and List for Secret Management Operations.

1. **Store the client secret in Key Vault**:
   1. In your Key Vault, go to **Secrets** > **Generate/Import**.
   1. Create a new secret containing the service principal's client secret.
   1. Note the secret name. It's used when configuring the data federation connector instance.

For more information on configuring Azure Key vaults, see [Azure Key Vaults](/azure/key-vault/general/basic-concepts).

## Federated data connectors

Federated connectors are managed on the Data connectors page in Microsoft Sentinel on the Defender portal.

1. Navigate to **Microsoft Sentinel** > **Configuration** > **Data connectors**.
1. Under **Data federation**, select **Catalog** to view the available federated connectors.

    The catalog page displays:
    - Available federation connector types
    - Number of configured instances for each connector
    - Publisher and support information

   :::image type="content" source="./media/data-federation-setup/federation-catalog.png" alt-text="Screenshot showing the data federation catalog with available connectors." lightbox="./media/data-federation-setup/federation-catalog.png":::


1. Select **My connectors page** to view all configured connector instances.
    The page lists your tenant's data federation connector instances along with their display name, version, status, and support provider. 
1. Select each instance to view details, edit configurations, or delete the instance.

  :::image type="content" source="./media/data-federation-setup/my-connectors.png" alt-text="Screenshot showing the My connectors page with configured federation instances." lightbox="./media/data-federation-setup/my-connectors.png":::

## Create a connector instance

The process for creating a connector instance varies based on the external data source you're connecting to. Follow the instructions for your specific data source type.

# [Microsoft Fabric](#tab/fabric)

## Create a Microsoft Fabric connector instance

Before configuring the Fabric connector instance, you must set up permissions within the Microsoft Fabric environment to allow Microsoft Sentinel to access the data.

+ Configure the admin settings within Microsoft Fabric so that the tenant is enabled for External data sharing,  For more information, see [Create an external data share](/fabric/governance/external-data-sharing-create)

+ Configure the admin settings within Microsoft Fabric so that the setting is enabled for **Service principals can call Fabric public APIs**. For more information, see [Service principals can call Fabric public APIs](/fabric/admin/service-admin-portal-developer#service-principals-can-call-fabric-public-apis)

+ Add the Sentinel platform identity, prefixed with `msg-resources-` as a Workspace Member on the Lakehouse from which you want to federate tables. For more information, see [Give access to workspaces](/fabric/fundamentals/give-access-workspaces).

1. On the **Data federation** > **Catalog** page, select the **Microsoft Fabric** row.
1. In the side panel, select **Connect a connector**.

1. Enter the following information:

    | Field | Description |
    |-------|-------------|
    | **Instance name** | A friendly name for this connector instance. This instance name is appended to the tables represented in the lake from this instance. |
    | **Fabric workspace ID** | ID of the Fabric workspace to federate. When you navigate to the Fabric workspace or Lakehouse, the workspace ID is in the URL after `/groups/` |
    | **Lakehouse table ID** |ID of the Fabric Lakehouse table to federate. When you navigate to the Fabric lakehouse, the lakehouse ID is shown in the URL after `/lakehouses/`.|

1. Select **Next**.

    :::image type="content" source="./media/data-federation-setup/fabric-connection-details.png" alt-text="Screenshot of the Microsoft Fabric connection details form." lightbox="./media/data-federation-setup/fabric-connection-details.png":::

1. Select the tables you want to federate.
1. Select **Next**.


1. Review the federation target configuration.

1. Select **Connect** to create the connection instance.

> [!NOTE]
> The files in your target data source must be in delta parquet format to be read from the Sentinel data lake.

# [Azure Data Lake Storage Gen 2](#tab/adls)

## Create an ADLS Gen 2 connector instance

Before creating the connector, prepare your storage account:

1. If you're creating a new storage account, ensure the **Hierarchical namespaces** setting is enabled.
1. Assign the **Storage Blob Data Reader** role to the service principal you created earlier. For more information on granting access through the Azure portal, see [Assign Azure roles using the Azure portal - Azure RBAC](/azure/role-based-access-control/role-assignments-portal).





1. On the **Data federation** > **Catalog** page, select **Azure Data Lake Storage**.
1. Select **Connect a connector**.

1. Configure the following name and connection details:

   | Field | Description |
   |-------|-------------|
   | **Instance name** | A friendly name for this connector instance. The instance name is appended to the table names in the lake. |
   | **Application (client) ID** | GUID of the service principal with access to the Key Vault and the target data source. |
   | **Azure Key Vault URI** | URI of the Key Vault containing the authentication secret for the service principal. |
   | **Secret name** | Name of the secret in Key Vault containing the service principal client secret |
   | **Azure Data Lake Storage URL** | URL of the ADLS Gen 2 endpoint (must be publicly accessible) |


1. Select **Next** to continue.

   :::image type="content" source="./media/data-federation-setup/adls-connection-details.png" alt-text="Screenshot of the ADLS Gen 2 connection details form." lightbox="./media/data-federation-setup/adls-connection-details.png":::


1. Select the tables you want to federate from your ADLS Gen 2 storage account.

1. Browse the available tables in your ADLS Gen 2 storage.
1. Select at least one table to federate.
1. Select **Next** to continue.

   :::image type="content" source="./media/data-federation-setup/adls-select-tables.png" alt-text="Screenshot showing table selection for ADLS Gen 2 federation." lightbox="./media/data-federation-setup/adls-select-tables.png":::


1. Once you have selected the tables, review the configuration settings.
1. Select **Connect** to create the connector instance.
1. If you need to make changes, select **Back** to return to previous steps.

   :::image type="content" source="./media/data-federation-setup/adls-review.png" alt-text="Screenshot of the ADLS Gen 2 configuration review page." lightbox="./media/data-federation-setup/adls-review.png":::

Select **Connect**, to complete the setup for the ADLS Gen 2 connector instance. The wizard closes and the instance count for Azure Data Lake Storage Gen2 increases.

# [Azure Databricks](#tab/databricks)

## Create an Azure Databricks connector instance

Before creating the connector, configure access in your Databricks environment as follows:

1. In Azure Databricks, select the catalog you want to connect to from Microsoft Sentinel data lake.

1. Select the gear icon for the catalog and select **Metastore**. 
1. In your metastore details page, set **External data access** to **Enabled**.
1.	In the catalog that you're federating with, select **Permissions** and then select **Grant**.
1. Search for the service principal you created earlier.
1. Grant the service principal the **Data Reader** privilege preset, and select **External Use Schema** permission and select **Confirm**.
1.	In the top right of your Azure Databricks screen, select your account and select **Settings**.
1. Under **Identity and access**, select the **Manage** button next to **Service principals**.
1. Select Add service principal
1.	Use the Service principal box to select an existing principal.
1.	Select the service principal you created earlier and select Add.

### Create the connector instance

1. On the **Data federation** > **Catalog** page, select the **Azure Databricks** row.
1. In the side panel, select **Connect a connector**.

1. Enter the following details:

    | Field | Description |
    |-------|-------------|
    | **Instance name** | A friendly name for this connector instance |
    | **Principal ID** | GUID of the service principal with Key Vault access |
    | **Azure Key Vault URI** | URI of the Key Vault containing the authentication secret |
    | **Secret name** | Name of the secret in Key Vault containing the Databricks connection information |
    | **Databricks URL** | URL of the Azure Databricks instance (must be publicly accessible) |
    | **Catalog name** | Name of the catalog in Azure Databricks to federate |
    | **Schema name** | Name of the schema in Azure Databricks to federate |

    :::image type="content" source="./media/data-federation-setup/databricks-connection-details.png" alt-text="Screenshot of the Azure Databricks connection details form." lightbox="./media/data-federation-setup/databricks-connection-details.png":::

1. Select **Next**.

1. Select the tables you want to federate from your Azure Databricks instance.

1. Select **Next** to continue.

    :::image type="content" source="./media/data-federation-setup/databricks-select-tables.png" alt-text="Screenshot showing table selection for Azure Databricks federation." lightbox="./media/data-federation-setup/databricks-select-tables.png":::

1. Review the configuration settings.
1. Select **Connect** to create the connector instance.
1. If you need to make changes, select **Back** to return to previous steps.

:::image type="content" source="./media/data-federation-setup/databricks-review.png" alt-text="Screenshot of the Azure Databricks configuration review page." lightbox="./media/data-federation-setup/databricks-review.png":::

After selecting **Connect**, the wizard closes and the instance count for Databricks increases.

---

## Verify tables from your connector instance

After creating a connector instance check that the tables you federated are available in Microsoft Sentinel.

1.	Navigate to **Microsoft Sentinel > Configuration > Tables**. 

1.	Filter by Type **Federated** to see all federated tables.
1.	Search by your connector instance name.
1.	Tables from your connector instance are listed with their name followed by `_instance name`. For example if your data connector instance name was `GlobalHRData` and your table was called `hrlogs`, your table name is shown as `hrlogs_GlobalHRData`.
1.	Select a table from the list to open the details panel. 
1. Select the **Overview** tab to see the table type and federation provider.
1. Select the **Data source** tab to see the connector instance data provider and source product for the table. Selecting the connector instance name takes you to that instance in **My Connectors** within **Data Connectors**.
1. Select the **Schema** tab to see the table schema.
1. On the **Schema** tab, select **Refresh** to refresh the table schema associated with the federated table.

:::image type="content" source="./media/data-federation-setup/verify-tables.png" lightbox="./media/data-federation-setup/verify-tables.png" alt-text="Screenshot showing the federated table schema.":::


## Manage connector instances

To modify or delete a connector instance:

1. Navigate to **Data federation** > **My connectors page**.
1. Select the connector instance you want to manage.
1. In the details panel, use the available options to:
   - Edit connection settings
   - Add or remove federated tables
   - Delete the connector instance
    
> [!NOTE]
> Microsoft Fabric connection instances don't support editing. You can create a new federated connection to add more tables, or you can delete the Fabric connection instance and recreate it with the same instance name and a different set of tables selected.

:::image type="content" source="./media/data-federation-setup/my-connectors.png" alt-text="Screenshot showing the My Connectors page." lightbox="./media/data-federation-setup/my-connectors.png":::

## Troubleshooting

### Connection fails

- Verify the Sentinel platform managed identity prefixed by `msg-resources-` has the correct permissions on Azure Key Vault.

- If your connection source is Azure Databricks or Azure Data Lake Storage Gen2, ensure the Key Vault secret contains the correct client secret for your service principal.
- The Key Vault networking must be set to **Allow public access from all networks** during the connector configuration, which is the default configuration of Key Vault. It can be changed after connector creation or editing. 
- Confirm the external data source is publicly accessible.
- Check that the service principal has appropriate permissions on the target data source for Azure Databricks and ADLS.
- If the target data source is Fabric, check that the `msg-resources-` prefixed identity for Microsoft Sentinel was granted permission as Workspace Member.
- Check to ensure you don't have more than 100 connection instances.

> [!NOTE]
> ADLS and Azure Databricks use one connection instance per federated connection. Fabric may use more instances per federated connection. For Fabric, each lakehouse schema in your federated connection counts against the 100-instance limit. 

### Tables don't appear

- Verify the service principal has read access to the target tables for ADLS and Azure Databricks, and the service principal is in the same tenant as these data sources.

- For Databricks, ensure you granted both the built-in Data Reader privilege preset plus the External Use Schema permission to the service principal.
- For ADLS Gen 2, confirm the Storage Blob Data Reader role is assigned to the service principal.


### Query performance issues

- Consider the size of data being queried from external sources.
 
- Optimize queries to filter data early.
- Check network connectivity between Sentinel and the external source.

## Next steps

- [Data federation overview](data-federation-overview.md)
- [Query federated tables with KQL](kql-jobs-summary-rules-search-jobs.md)
