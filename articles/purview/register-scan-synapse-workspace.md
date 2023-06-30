---
title: Connect to and manage Azure Synapse Analytics workspaces
description: This guide describes how to connect to Azure Synapse Analytics workspaces in Microsoft Purview, and how to use Microsoft Purview features to scan and manage your Azure Synapse Analytics workspace source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 05/15/2023
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Azure Synapse Analytics workspaces in Microsoft Purview

This article outlines how to register Azure Synapse Analytics workspaces. It also describes how to authenticate and interact with Azure Synapse Analytics workspaces in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|Metadata extraction|Full scan|Incremental scan|Scoped scan|Classification|Labeling|Access policy|Lineage|Data sharing|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)| [Yes](#scan) | No| [Yes](#scan)| No| No| [Yes - pipelines](how-to-lineage-azure-synapse-analytics.md)| No|

Currently, Azure Synapse Analytics lake databases are not supported.

For external tables, Azure Synapse Analytics doesn't currently capture the relationship of those tables to their original files.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* Data source administrator and data reader permissions to register a source and manage it in the Microsoft Purview governance portal. For details, see [Access control in the Microsoft Purview governance portal](catalog-permissions.md).

## Register

The following procedure describes how to register Azure Synapse Analytics workspaces in Microsoft Purview by using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

Only a user who has at least a data reader role on the Azure Synapse Analytics workspace and who is also a data source administrator in Microsoft Purview can register an Azure Synapse Analytics workspace.

1. Open the [Microsoft Purview governance portal](https://web.purview.azure.com) and select your Microsoft Purview account.

   Alternatively, go to the [Azure portal](https://portal.azure.com), search for and select the Microsoft Purview account, and then select the **Microsoft Purview governance portal** button.
1. On the left pane, select **Sources**.
1. Select **Register**.
1. Under **Register sources**, select **Azure Synapse Analytics (multiple)**.
1. Select **Continue**.

   :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source.png" alt-text="Screenshot of a selection of sources in Microsoft Purview, including Azure Synapse Analytics.":::

1. On the **Register sources (Azure Synapse Analytics)** page, do the following:

    1. For **Name**, enter a name for the data source to be listed in the data catalog.  
    1. Optionally, for **Azure subscription**, choose a subscription to filter down to.  
    1. For **Workspace name**, select the workspace that you're working with.

       The boxes for the SQL endpoints are automatically filled in based on your workspace selection.  
    1. For **Select a collection**, choose the collection that you're working with, or create a new one.  
    1. Select **Register** to finish registering the data source.

    :::image type="content" source="media/register-scan-synapse-workspace/register-synapse-source-details.png" alt-text="Screenshot of the page for entering details about the Azure Synapse source.":::

## Scan

Use the following steps to scan Azure Synapse Analytics workspaces to automatically identify assets and classify your data. For more information about scanning in general, see [Scans and ingestion in Microsoft Purview](concept-scans-and-ingestion.md).

1. Set up authentication for enumerating your [dedicated](#authentication-for-enumerating-dedicated-sql-database-resources) or [serverless](#authentication-for-enumerating-serverless-sql-database-resources) resources. This step will allow Microsoft Purview to enumerate your workspace assets and perform scans.
1. Apply [permissions to scan the contents of the workspace](#apply-permissions-to-scan-the-contents-of-the-workspace).
1. Confirm that your [network is set up to allow access for Microsoft Purview](#set-up-firewall-access-for-the-azure-synapse-analytics-workspace).

### Enumeration authentication

Use the following procedures to set up authentication. You must be an owner or a user access administrator to add the specified roles.

#### Authentication for enumerating dedicated SQL database resources

1. In the Azure portal, go to the Azure Synapse Analytics workspace resource.  
1. On the left pane, select **Access Control (IAM)**.
1. Select the **Add** button.
1. Set the **Reader** role and enter your Microsoft Purview account name, which represents its managed service identity (MSI).
1. Select **Save** to finish assigning the role.

> [!NOTE]
> If you're planning to register and scan multiple Azure Synapse Analytics workspaces in your Microsoft Purview account, you can also assign the role from a higher level, such as a resource group or a subscription.

#### Authentication for enumerating serverless SQL database resources

There are three places where you need to set authentication to allow Microsoft Purview to enumerate your serverless SQL database resources.

To set authentication for the Azure Synapse Analytics workspace:

1. In the Azure portal, go to the Azure Synapse Analytics workspace resource.  
1. On the left pane, select **Access Control (IAM)**.
1. Select the **Add** button.
1. Set the **Reader** role and enter your Microsoft Purview account name, which represents its MSI.
1. Select **Save** to finish assigning the role.

To set authentication for the storage account:

1. In the Azure portal, go to the resource group or subscription that contains the storage account associated with the Azure Synapse Analytics workspace.
1. On the left pane, select **Access Control (IAM)**.
1. Select the **Add** button.
1. Set the **Storage blob data reader** role and enter your Microsoft Purview account name (which represents its MSI) in the **Select** box.
1. Select **Save** to finish assigning the role.

To set authentication for the Azure Synapse Analytics serverless database:

1. Go to your Azure Synapse Analytics workspace and open Synapse Studio.
1. On the left pane, select **Data**.
1. Select the ellipsis (**...**) next to one of your databases, and then start a new SQL script.
1. Run the following command in your SQL script to add the Microsoft Purview account MSI (represented by the account name) on the serverless SQL databases:

    ```sql
    CREATE LOGIN [PurviewAccountName] FROM EXTERNAL PROVIDER;
    ```

### Apply permissions to scan the contents of the workspace

You must set up authentication on each SQL database that you want to register and scan from your Azure Synapse Analytics workspace. Select from the following scenarios for steps to apply permissions.

> [!IMPORTANT]
> The following steps for serverless databases *do not* apply to replicated databases. In Azure Synapse Analytics, serverless databases that are replicated from Spark databases are currently read-only. For more information, see [Operation isn't allowed for a replicated database](../synapse-analytics/sql/resources-self-help-sql-on-demand.md#operation-isnt-allowed-for-a-replicated-database).

# [Managed identity](#tab/MI)

#### Use a managed identity for dedicated SQL databases

To run the commands in the following procedure, you must be an Azure Synapse administrator on the workspace. For more information about Azure Synapse Analytics permissions, see [Set up access control for your Azure Synapse Analytics workspace](../synapse-analytics/security/how-to-set-up-access-control.md).

1. Go to your Azure Synapse Analytics workspace.
1. Go to the **Data** section, and then look for one of your dedicated SQL databases.
1. Select the ellipsis (**...**) next to the database name, and then start a new SQL script.
1. Run the following command in your SQL script to add the Microsoft Purview account MSI (represented by the account name) as `db_datareader` on the dedicated SQL database:

    ```sql
    CREATE USER [PurviewAccountName] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [PurviewAccountName]
    GO
    ```

1. Run the following command in your SQL script to verify the addition of the role:

    ```sql
    SELECT p.name AS UserName, r.name AS RoleName
    FROM sys.database_principals p
    LEFT JOIN sys.database_role_members rm ON p.principal_id = rm.member_principal_id
    LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
    WHERE p.authentication_type_desc = 'EXTERNAL'
    ORDER BY p.name;
    ```

Follow the same steps for each database that you want to scan.

#### Use a managed identity for serverless SQL databases

1. Go to your Azure Synapse Analytics workspace.
1. Go to the **Data** section, and select one of your SQL databases.
1. Select the ellipsis (**...**) next to the database name, and then start a new SQL script.
1. Run the following command in your SQL script to add the Microsoft Purview account MSI (represented by the account name) as `db_datareader` on the serverless SQL databases:

    ```sql
    CREATE USER [PurviewAccountName] FOR LOGIN [PurviewAccountName];
    ALTER ROLE db_datareader ADD MEMBER [PurviewAccountName]; 
    ```

1. Run the following command in your SQL script to verify the addition of the role:

    ```sql
    SELECT p.name AS UserName, r.name AS RoleName
    FROM sys.database_principals p
    LEFT JOIN sys.database_role_members rm ON p.principal_id = rm.member_principal_id
    LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
    WHERE p.authentication_type_desc = 'EXTERNAL'
    ORDER BY p.name;
    ```

Follow the same steps for each database that you want to scan.

#### Grant permission to use credentials for external tables

If the Azure Synapse Analytics workspace has any external tables, you must give the Microsoft Purview managed identity References permission on the external table's scoped credentials. With the References permission, Microsoft Purview can read data from external tables.

1. Run the following command in your SQL script to get the list of database scoped credentials:

    ```sql
    Select name, credential_identity
    from sys.database_scoped_credentials;
    ```

1. To grant the access to database scoped credentials, run the following command. Replace `scoped_credential` with the name of the database scoped credential.

    ```sql
    GRANT REFERENCES ON DATABASE SCOPED CREDENTIAL::[scoped_credential] TO [PurviewAccountName];
    ```

1. To verify the permission assignment, run the following command in your SQL script:

    ```sql
    SELECT dp.permission_name, dp.grantee_principal_id, p.name AS grantee_principal_name
    FROM sys.database_permissions AS dp
    JOIN sys.database_principals AS p ON dp.grantee_principal_id = p.principal_id
    JOIN sys.database_scoped_credentials AS c ON dp.major_id = c.credential_id;
    ```

# [Service principal](#tab/SP)

#### Use a service principal for dedicated SQL databases

1. Set up a new credential of type *service principal* by following the instructions in [Credentials for source authentication in Microsoft Purview](manage-credentials.md).
1. Go to your Azure Synapse Analytics workspace.
1. Go to the **Data** section, and then look for one of your dedicated SQL databases.
1. Select the ellipsis (**...**) next to the database name, and then start a new SQL script.
1. Run the following command in your SQL script to add the service principal ID as `db_datareader` on the dedicated SQL database:

    ```sql
    CREATE USER [ServicePrincipalID] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [ServicePrincipalID]
    GO
    ```

Repeat the previous steps for all dedicated SQL databases in your Azure Synapse Analytics workspace.

#### Use a service principal for serverless SQL databases

1. Go to your Azure Synapse Analytics workspace.
1. Go to the **Data** section, and then look for one of your serverless SQL databases.
1. Select the ellipsis (**...**) next to the database name, and then start a new SQL script.
1. Run the following command in your SQL script to add the service principal ID on the serverless SQL databases:

    ```sql
    CREATE LOGIN [ServicePrincipalID] FROM EXTERNAL PROVIDER;
    ```

1. Run the following command in your SQL script to add the service principal ID as `db_datareader` on each of the serverless SQL databases that you want to scan:

   ```sql
    CREATE USER [ServicePrincipalID] FOR LOGIN [ServicePrincipalID];
    ALTER ROLE db_datareader ADD MEMBER [ServicePrincipalID]; 
    ```

# [SQL authentication](#tab/SQLAuth)

#### Use SQL authentication for dedicated SQL databases

1. Set up a new credential of type *SQL authentication* by following the instructions in [Credentials for source authentication in Microsoft Purview](manage-credentials.md).
1. Go to your Azure Synapse Analytics workspace.
1. Go to the **Data** section, and then look for one of your dedicated SQL databases.
1. Select the ellipsis (**...**) next to the database name, and then start a new SQL script.
1. Run the following command in your SQL script to add the SQL authentication login name as `db_datareader` on the dedicated SQL database:

    ```sql
    CREATE USER [SQLUser] FROM LOGIN [SQLUser];
    GO
    
    EXEC sp_addrolemember 'db_datareader', [SQLUser]; 
    GO
    ```

Repeat the previous steps for all dedicated SQL databases in your Azure Synapse Analytics workspace.

#### Use SQL authentication for serverless SQL databases

1. Go to your Azure Synapse Analytics workspace.
1. Go to the **Data** section, and then look for one of your serverless SQL databases.
1. Select the ellipsis (**...**) next to the database name, and then start a new SQL script.
1. Run the following command in your SQL script to add the SQL authentication login name on the serverless SQL databases:

    ```sql
    CREATE USER [SQLUser] FROM LOGIN [SQLUser];
    GO
    ```

1. Run the following command in your SQL script to add the service principal ID as `db_datareader` on each of the serverless SQL databases that you want to scan:

   ```sql
   ALTER ROLE db_datareader ADD MEMBER [SQLUser];
   GO
    ```

---

### Set up firewall access for the Azure Synapse Analytics workspace

1. In the Azure portal, go to the Azure Synapse Analytics workspace.

1. On the left pane, select **Networking**.

1. For **Allow Azure services and resources to access this workspace** control, select **ON**.

1. Select **Save**.

> [!IMPORTANT]
> If you can't enable **Allow Azure services and resources to access this workspace** on your Azure Synapse Analytics workspaces, you'll get a serverless database enumeration failure when you set up a scan in the Microsoft Purview governance portal. In this case, you can choose the [Enter manually](#create-and-run-a-scan) option to specify the database names that you want to scan, and then proceed.

### Create and run a scan

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), on the left pane, select **Data Map**.

1. Select the data source that you registered.

1. Select **View details**, and then select **New scan**. Alternatively, you can select the **Scan quick action** icon on the source tile.

1. On the **Scan** details pane, in the **Name** box, enter a name for the scan.

1. In the **Credential** dropdown list, select the credential to connect to the resources within your data source.

1. For **Database selection method**, select **From Synapse workspace** or **Enter manually**. By default, Microsoft Purview tries to enumerate the databases under the workspace, and you can select the ones that you want to scan.

    :::image type="content" source="media/register-scan-synapse-workspace/synapse-scan-setup.png" alt-text="Screenshot of the details pane for the Azure Synapse source scan.":::

    If you get an error that says Microsoft Purview failed to load the serverless databases, you can select **Enter manually** to specify the type of database (dedicated or serverless) and the corresponding database name.

    :::image type="content" source="media/register-scan-synapse-workspace/synapse-scan-setup-enter-manually.png" alt-text="Screenshot of the selection for manually entering database names when setting up a scan.":::

1. Select **Test connection** to validate the settings. If you get any error, on the report page, hover over the connection status to see details.

1. Select **Continue**.

1. Select **Scan rule sets** of type **Azure Synapse SQL**. You can also create scan rule sets inline.

1. Choose your scan trigger. You can schedule it to run **weekly/monthly** or **once**.

1. Review your scan, and then select **Save** to complete the setup.  

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

### Set up a scan by using an API

Here's an example of creating a scan for a serverless database by using the Microsoft Purview REST API. Replace the placeholders in braces (`{}`) with your actual settings. Learn more from [Scans - Create Or Update](/rest/api/purview/scanningdataplane/scans/create-or-update/).

```http
PUT https://{purview_account_name}.purview.azure.com/scan/datasources/<data_source_name>/scans/{scan_name}?api-version=2022-02-01-preview
```

In the following code, `collection_id` is not the friendly name for the collection, a five-character ID. For the root collection, `collection_id` is the name of the collection. For all subcollections, it's instead the ID that you can find in one of these places:

- The URL in the Microsoft Purview governance portal. Select the collection, and check the URL to find where it says **collection=**. That's your ID. In the following example, the **Investment** collection has the ID **50h55c**.

  :::image type="content" source="media/register-scan-synapse-workspace/find-collection-id.png" alt-text="Screenshot of a collection ID in a URL." lightbox="media/register-scan-synapse-workspace/find-collection-id.png" :::
- You can [list child collection names](/rest/api/purview/accountdataplane/collections/list-child-collection-names) of the root collection to list the collections, and then use the name instead of the friendly name.

```json
{
    "properties":{
        "resourceTypes":{
            "AzureSynapseServerlessSql":{
                "scanRulesetName":"AzureSynapseSQL",
                "scanRulesetType":"System",
                "resourceNameFilter":{
                    "resources":[ "{serverless_database_name_1}", "{serverless_database_name_2}", ...]
                }
            }
        },
        "credential":{
            "referenceName":"{credential_name}",
            "credentialType":"SqlAuth | ServicePrincipal | ManagedIdentity (if UAMI authentication)"
        },
        "collection":{
            "referenceName":"{collection_id}",
            "type":"CollectionReference"
        },
        "connectedVia":{
            "referenceName":"{integration_runtime_name}",
            "integrationRuntimeType":"SelfHosted (if self-hosted IR) | Managed (if VNet IR)"
        }
    },
    "kind":"AzureSynapseWorkspaceCredential | AzureSynapseWorkspaceMsi (if system-assigned managed identity authentication)"
}
```

To schedule the scan, create a trigger for it after scan creation. For more information, see [Triggers - Create Trigger](/rest/api/purview/scanningdataplane/triggers/create-trigger).

### Troubleshooting

If you have any problems with scanning:

- Confirm that you followed all [prerequisites](#prerequisites).
- Confirm that you set up [enumeration authentication](#enumeration-authentication) for your resources.
- Confirm that you set up [authentication](#apply-permissions-to-scan-the-contents-of-the-workspace).
- Check the network by confirming [firewall settings](#set-up-firewall-access-for-the-azure-synapse-analytics-workspace).
- Review the [scan troubleshooting documentation](troubleshoot-connections.md).

## Next steps

Now that you've registered your source, use the following guides to learn more about Microsoft Purview and your data:

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search the Microsoft Purview Data Catalog](how-to-search-catalog.md)
