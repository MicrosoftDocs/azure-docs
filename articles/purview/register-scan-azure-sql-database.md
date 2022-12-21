---
title: 'Discover and govern Azure SQL DB'
description: Learn how to register, authenticate with, and interact with an Azure SQL database in Microsoft Purview.
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: how-to
ms.date: 12/05/2022
ms.custom: template-how-to
---
# Discover and govern Azure SQL Database in Microsoft Purview

This article outlines the process to register an Azure SQL database source in Microsoft Purview. It includes instructions to authenticate and interact with the SQL database.

## Supported capabilities

|Metadata extraction| Full scan |Incremental scan|Scoped scan|Classification|Access policy|Lineage|Data sharing|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)|[Yes](#scan) | [Yes](#scan)|[Yes](#scan)| [Yes (preview)](#access-policy) | [Yes (preview)](#lineagepreview) | No |

> [!NOTE]
> Data lineage extraction is currently supported only for stored procedure runs. Lineage is also supported if Azure SQL tables or views are used as a source/sink in [Data Factory Copy and Data Flow activities](how-to-link-azure-data-factory.md) 

When you're scanning Azure SQL Database, Microsoft Purview supports extracting technical metadata from these sources:

- Server
- Database
- Schemas
- Tables, including the columns
- Views, including the columns
- Stored procedures (with lineage extraction enabled)
- Stored procedure runs (with lineage extraction enabled)

When you're setting up scan, you can further scope the scan after providing the database name by selecting tables and views as needed. 

### Known limitations

* Microsoft Purview supports a maximum of 800 columns on the schema tab. If there are more than 800 columns, Microsoft Purview will show **Additional-Columns-Truncated**.
* Column-level lineage is currently not supported on the lineage tab. However, the `columnMapping` attribute on the properties tab for SQL stored rrocedure runs captures column lineage in plain text.
* Data lineage extraction is currently not supported for functions or triggers.
* The lineage extraction scan is scheduled and defaulted to run every six hours. The frequency can't be changed.
* If SQL views are referenced in stored procedures, they're currently captured as SQL tables.
* Lineage extraction is currently not supported if your logical server in Azure disables public access or doesn't allow Azure services to access it.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You'll need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. For details, see [Access control in the Microsoft Purview governance portal](catalog-permissions.md).

## Register the data source

Before you scan, it's important to register the data source in Microsoft Purview:

1. In the [Azure portal](https://portal.azure.com), go to the **Microsoft Purview accounts** page and select your Microsoft Purview account.

1. Under **Open Microsoft Purview Governance Portal**, select **Open**, and then select **Data Map**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-open-purview-studio.png" alt-text="Screenshot that shows the area for opening a Microsoft Purview governance portal.":::

1. Create the [collection hierarchy](./quickstart-create-collection.md) by using the **Collections** menu. Assign permissions to individual subcollections as required.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-collections.png" alt-text="Screenshot that shows the collection menu to assign access control permissions to the collection hierarchy.":::

1. Go to the appropriate collection under the **Sources** menu, and then select the **Register** icon to register a new SQL database.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-data-source.png" alt-text="Screenshot that shows the collection that's used to register the data source.":::

1. Select the **Azure SQL Database** data source, and then select **Continue**.

1. For **Name**, provide a suitable name for the data source. Select relevant names for **Azure subscription**, **Server name**, and **Select a collection**, and then select **Apply**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-ds-details.png" alt-text="Screenshot that shows details entered to register a data source.":::

1. Confirm that the SQL database appears under the selected collection.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-ds-collections.png" alt-text="Screenshot that shows a data source mapped to a collection to initiate scanning.":::

## Update firewall settings

If your database server has a firewall enabled, you need to update the firewall to allow access in one of the following ways:

- [Allow Azure connections through the firewall](#allow-azure-connections). This is a straightforward option to route traffic through Azure networking, without needing to manage virtual machines.
- [Install a self-hosted integration runtime on a machine in your network and give it access through the firewall](#self-hosted-integration-runtime). If you have a private virtual network set up within Azure, or have any other closed network set up, using a self-hosted integration runtime on a machine within that network will allow you to fully manage traffic flow and utilize your existing network.
- [Use a managed virtual network](catalog-managed-vnet.md). Setting up a managed virtual network with your Microsoft Purview account will allow you to connect to Azure SQL by using the Azure integration runtime in a closed network.

For more information about the firewall, see the [SQL Database firewall documentation](/azure/azure-sql/database/firewall-configure). 

### Allow Azure connections

Enabling Azure connections will allow Microsoft Purview to connect to the server without requiring you to updateing the firewall itself. 

1. Go to your database account.
1. On the **Overview** page, select the server name.
1. Select **Security** > **Firewalls and virtual networks**.
1. For **Allow Azure services and resources to access this server**, select **Yes**.

:::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-firewall.png" alt-text="Screenshot that shows selections in the Azure portal to allow Azure connections to a server." border="true.":::

For more information about allowing connections from inside Azure, see the [how-to guide](/azure/azure-sql/database/firewall-configure#connections-from-inside-azure).

### Install a self-hosted integration runtime

You can install a self-hosted integration runtime on a machine to connect with a resource in a private network:

1. [Create and install a self-hosted integration runtime](./manage-integration-runtimes.md) on a personal machine, or on a machine inside the same virtual network as your database server.
1. Check your database server's networking configuration to confirm that a private endpoint is accessible to the machine that contains the self-hosted integration runtime. Add the IP of the machine if it doesn't already have access.
1. If your logical server is behind a private endpoint or in a virtual network, you can use an [ingestion private endpoint](catalog-private-link-ingestion.md#deploy-self-hosted-integration-runtime-ir-and-scan-your-data-sources) to ensure end-to-end network isolation.

## Configure authentication for a scan

To scan your data source, you'll need to configure an authentication method in the Azure SQL Database.

>[!IMPORTANT]
> If you're using a [self-hosted integration runtime](manage-integration-runtimes.md) to connect to your resource, system-assigned and user-assigned managed identities will not work. You need to use service principal authentication or SQL authentication.

The following options are supported:

* **System-assigned managed identity (SAMI)** (recommended). This is an identity that's associated directly with your Microsoft Purview account. It allows you to authenticate directly with other Azure resources without needing to manage a go-between user or credential set. 

  The SAMI is created when your Microsoft Purview resource is created. It's managed by Azure and uses your Microsoft Purview account's name. The SAMI can't currently be used with a self-hosted integration runtime for Azure SQL. 
  
  For more information, see the [managed identity overview](../active-directory/managed-identities-azure-resources/overview.md).

* **User-assigned managed identity (UAMI)** (preview). Similar to a SAMI, a UAMI is a credential resource that allows Microsoft Purview to authenticate against Azure Active Directory (Azure AD). 

  The UAMI is managed by users in Azure, rather than by Azure itself, which gives you more control over security. The UAMI can't currently be used with a self-hosted integration runtime for Azure SQL. 
  
  For more information, see the [guide for user-assigned managed identities](manage-credentials.md#create-a-user-assigned-managed-identity).

* **Service principal**. A service principal is an application that can be assigned permissions like any other group or user, without being associated directly with a person. Authentication for service principals has an expiration date, so it can be useful for temporary projects. 

  For more information, see the [service principal documentation](../active-directory/develop/app-objects-and-service-principals.md).

* **SQL authentication**. Connect to the SQL database with a username and password. For more information about SQL authentication, you can [follow the SQL authentication documentation](/sql/relational-databases/security/choose-an-authentication-mode#connecting-through-sql-server-authentication). 

  If you need to create a login, follow [this guide to query a SQL database](/azure/azure-sql/database/connect-query-portal). Use [this guide to create a login by using T-SQL](/sql/t-sql/statements/create-login-transact-sql).
    
  > [!NOTE]
  > Be sure to select the **Azure SQL Database** option on the page.

For steps to authenticate with your SQL database, select your chosen method of authentication from the following tabs.

# [SQL authentication](#tab/sql-authentication)

> [!Note]
> Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. About 15 minutes after the Microsoft Purview account gets permissions, it should be able to scan the resources.

1. You'll need a SQL login with at least `db_datareader` permissions to be able to access the information that Microsoft Purview needs to scan the database. You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a sign-in for Azure SQL Database. You'll need to save the *username* and *password* for the next steps.

1. Go to your key vault in the Azure portal.

1. Select **Settings** > **Secrets**, and then select **+ Generate/Import**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-secret.png" alt-text="Screenshot that shows the key vault option to generate a secret.":::

1. For **Name** and **Value**, use the username and password (respectively) from your SQL database.

1. Select **Create**.

1. If your key vault isn't connected to Microsoft Purview yet, [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account).

1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) by using the key to set up your scan.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-credentials.png" alt-text="Screenshot that shows the key vault option to set up credentials.":::

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-key-vault-options.png" alt-text="Screenshot that shows the key vault option to create a secret.":::

# [Managed identity](#tab/managed-identity)

>[!IMPORTANT]
> If you're using a [self-hosted integration runtime](manage-integration-runtimes.md) to connect to your resource, system-assigned and user-assigned managed identities will not work. You need to use SQL authentication or service principal authentication.

### Configure Azure AD authentication in the database account

The managed identity needs permission to get metadata for the database, schemas, and tables. It must also be authorized to query the tables to sample for classification.

1. If you haven't already, [configure Azure AD authentication with Azure SQL](/azure/azure-sql/database/authentication-aad-configure).
1. Create an Azure AD user in Azure SQL Database with the exact managed identity from Microsoft Purview. Follow the steps in [Create the service principal user in Azure SQL Database](/azure/azure-sql/database/authentication-aad-service-principal-tutorial#create-the-service-principal-user-in-azure-sql-database). 
1. Assign proper permission (for example: `db_datareader`) to the identity. Here's example SQL syntax to create the user and grant permission:

    ```sql
    CREATE USER [Username] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [Username]
    GO
    ```

    > [!Note]
    > The `Username` value is your managed identity name from Microsoft Purview. You can [read more about fixed-database roles and their capabilities](/sql/relational-databases/security/authentication-access/database-level-roles#fixed-database-roles).

### Configure portal authentication

It's important to give your Microsoft Purview account's system-managed identity or [user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity) the permission to scan the SQL databse. You can add the SAMI or UAMI at the subscription, resource group, or resource level, depending on the breadth of the scan.

> [!Note]
> To add a managed identity on an Azure resource, you need to be an owner of the subscription.

1. From the [Azure portal](https://portal.azure.com), find the subscription, resource group, or resource (for example, a SQL database) that the catalog should scan.

1. Select **Access Control (IAM)** on the left menu, and then select **+ Add** > **Add role assignment**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sql-ds.png" alt-text="Screenshot that shows selections for adding a role assignment for access control.":::

1. Set **Role** to **Reader**. In the **Select** box, enter your Microsoft Purview account name or [user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity). Then, select **Save** to give this role assignment to your Microsoft Purview account.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-access-managed-identity.png" alt-text="Screenshot that shows the details to assign permissions for the Microsoft Purview account.":::

# [Service principal](#tab/service-principal)

### Create a new service principal

If you don't have a service principal, you can [follow the service principal guide to create one](./create-service-principal-azure.md).

> [!NOTE]
> To create a service principal, you must register an application in your Azure AD tenant. If you don't have the required access, your Azure AD Global Administrator or Application Administrator can perform this operation.

### Grant the service principal access to your SQL database

The service principal needs permission to get metadata for the database, schemas, and tables. It must also be authorized to query the tables to sample for classification.

1. If you haven't already, [configure Azure AD authentication with Azure SQL](/azure/azure-sql/database/authentication-aad-configure).
1. Create an Azure AD user in Azure SQL Database with your service principal. Follow the steps in [Create the service principal user in Azure SQL Database](/azure/azure-sql/database/authentication-aad-service-principal-tutorial#create-the-service-principal-user-in-azure-sql-database). 
1. Assign proper permission (for example: `db_datareader`) to the identity. Here's example SQL syntax to create the user and grant permission:

    ```sql
    CREATE USER [Username] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [Username]
    GO
    ```

    > [!Note]
    > The `Username` value is your own service principal's name. You can [read more about fixed-database roles and their capabilities](/sql/relational-databases/security/authentication-access/database-level-roles#fixed-database-roles).

### Create the credential

1. Go to your key vault in the Azure portal.

1. Select **Settings** > **Secrets**, and then select **+ Generate/Import**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-secret.png" alt-text="Screenshot that shows the key vault option to generate a secret for a service principal.":::

1. For **Name**, give the secret a name of your choice.

1. For **Value**, use the service principal's secret value. If you've already created a secret for your service principal, you can find its value in **Client credentials** on your secret's overview page.

    If you need to create a secret, you can follow the steps in the [service principal guide](create-service-principal-azure.md#adding-a-secret-to-the-client-credentials).

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-client-credentials.png" alt-text="Screenshot that shows the client credentials for a service principal.":::

1. Select **Create** to create the secret.

1. If your key vault isn't connected to Microsoft Purview yet, [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account).

1. [Create a new credential](manage-credentials.md#create-a-new-credential).

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-credentials.png" alt-text="Screenshot that shows the key vault option to add a credential for a service principal.":::

1. For **Service Principal ID**, use the application ID of your service principal. 

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-appln-id.png" alt-text="Screenshot that shows the application (client) ID for a service principal.":::

1. For **Secret name**, use the name of the secret that you created in previous steps.
    
    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-cred.png" alt-text="Screenshot that shows the key vault option to create a secret for a service principal.":::

---

## Create the scan

1. Open your Microsoft Purview account and select **Open Microsoft Purview governance portal**.
1. Go to **Data map** > **Sources** to view the collection hierarchy.
1. Select the **New Scan** icon under the SQL database that you registered earlier.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-new-scan.png" alt-text="Screenshot that shows the pane for creating a new scan.":::

To learn more about data lineage in Azure SQL Database, see the [Extract lineage (preview)](#lineagepreview) section.

For scanning steps, select your method of authentication from the following tabs.

# [SQL authentication](#tab/sql-authentication)

1. Provide a **Name** for the scan, select **Database selection method** as _Enter manually_, enter the **Database name** and the **Credential** created earlier, choose the appropriate collection for the scan.

1. Select **Test connection** to validate the connection. Once the connection is successful, select **Continue**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sql-auth.png" alt-text="Screenshot that shows the SQL Authentication option for scanning.":::

# [Managed identity](#tab/managed-identity)

1. Provide a **Name** for the scan, select the SAMI or UAMI under **Credential**, choose the appropriate collection for the scan.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-managed-id.png" alt-text="Screenshot that shows the managed identity option to run the scan.":::

1. Select **Test connection**. On a successful connection, select **Continue**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-test.png" alt-text="Screenshot that allows the managed identity option to run the scan.":::

# [Service principal](#tab/service-principal)

1. Provide a **Name** for the scan, choose the appropriate collection for the scan, and select the **Credential** dropdown to select the credential created earlier.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp.png" alt-text="Screenshot that shows the option for service principal to enable scanning.":::

1. Select **Test connection**. On a successful connection, select **Continue**.

---

## Scope and run the scan

1. You can scope your scan to specific database objects by choosing the appropriate items in the list.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scope-scan.png" alt-text="Scope your scan.":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scan-rule-set.png" alt-text="Scan rule set.":::

1. If creating a new _scan rule set_.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-new-scan-rule-set.png" alt-text="New Scan rule set.":::

1. You can select the **classification rules** to be included in the scan rule.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-classification.png" alt-text="Scan rule set classification rules.":::

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sel-scan-rule.png" alt-text="Scan rule set selection.":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

1. Review your scan and select **Save and run**.

### View a scan

1. Go to the data source in the collection, and select **View Details** to check the status of the scan.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-view-scan.png" alt-text="view scan.":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets scanned and classified.

1. The **Last run status** will be updated to **In progress** and then **Completed** after the entire scan has run successfully.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scan-complete.png" alt-text="view scan completed.":::

## Manage a scan

Scans can be managed or run again on completion:

1. Select the **Scan name** to manage the scan.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-manage scan.png" alt-text="manage scan.":::

1. You can _run the scan_ again, _edit the scan_, _delete the scan_.  

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-manage-scan-options.png" alt-text="manage scan options.":::

1. You can _run an incremental scan_ or a _full scan_ again.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-full-inc.png" alt-text="full or incremental scan.":::

> [!TIP]
> To troubleshoot any issues with scanning:
> 1. Confirm you have followed all [**prerequisites**](#prerequisites).
> 1. Check network by confirming [firewall](#firewall-settings), [Azure connections](#allow-azure-connections), or [integration runtime](#self-hosted-integration-runtime) settings.
> 1. Confirm [authentication](#authentication-for-a-scan) is properly set up.
> 1. Review our [**scan troubleshooting documentation**](troubleshoot-connections.md).

## Set up access policies

### Supported policies
The following types of policies are supported on this data resource from Microsoft Purview:
- [DevOps policies](concept-policies-devops.md)
- [Data owner policies](concept-policies-data-owner.md)
- [self-service policies](concept-self-service-data-access-policy.md)

### Access policy prerequisites on Azure SQL Database
[!INCLUDE [Access policies specific Azure SQL DB pre-requisites](./includes/access-policies-prerequisites-azure-sql-db.md)]

### Configure the Microsoft Purview account for policies
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data source and enable data use management
The Azure SQL Database resource needs to be registered first with Microsoft Purview before you can create access policies. 
To register your resources, follow the **Prerequisites** and **Register** sections of this guide:
[Register Azure SQL Database in Microsoft Purview](./register-scan-azure-sql-database.md#prerequisites).

After you've registered the data source, you'll need to enable Data Use Management. This is a pre-requisite before you can create policies on the data source. Data Use Management can impact the security of your data, as it delegates to certain Microsoft Purview roles managing access to the data sources. **Go through the secure practices related to Data Use Management in this guide**: [How to enable Data Use Management](./how-to-enable-data-use-management.md).

Once your data source has the **Data Use Management** option *Enabled*, it will look like this screenshot.
![Screenshot shows how to register a data source for policy](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-azure-sql-db.png).

### Create a policy
To create an access policy for Azure SQL Database, follow these guides:

* [DevOps policy on a single Azure SQL Database](./how-to-policies-devops-azure-sql-db.md#create-a-new-devops-policy)
* [Data owner policy on a single Azure SQL Database](./how-to-policies-data-owner-azure-sql-db.md#create-and-publish-a-data-owner-policy). This guide will allow you to provision access on a single Azure SQL Database account in your subscription.
* [Data owner policy covering all sources in a subscription or resource group](./how-to-policies-data-owner-resource-group.md). This guide will allow you to provision access on all enabled data sources in a resource group, or across an Azure subscription. The pre-requisite is that the subscription or resource group is registered with the Data use management option enabled. 
* [self-service policy for Azure SQL Database](./how-to-policies-self-service-azure-sql-db.md). This guide will allow data consumers to request access to data assets using self-service workflow.

## Extract lineage (preview) 
<a id="lineagepreview"></a>

Microsoft Purview supports lineage from Azure SQL Database. At the time of setting up a scan, enable lineage extraction toggle button to extract lineage.  

### Prerequisites for setting up a scan with lineage extraction

1. Follow steps under [authentication for a scan using Managed Identity](#authentication-for-a-scan) section to authorize Microsoft Purview to scan your SQL database.

2. Sign in to Azure SQL Database with your Azure AD account, and assign `db_owner` permissions to the Microsoft Purview Managed identity. Use the following example SQL syntax to create user and grant permission. Replace 'purview-account' with your account name.

    ```sql
    Create user <purview-account> FROM EXTERNAL PROVIDER
    GO
    EXEC sp_addrolemember 'db_owner', <purview-account> 
    GO
    ```
3. Run the following command on your SQL database to create a master key:

    ```sql
    Create master key
    Go
    ```

### Create a scan with the lineage extraction toggle turned on

1. Enable lineage extraction toggle in the scan screen.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction.png" alt-text="Screenshot that shows the screen to create a new scan with lineage extraction." lightbox="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction-expanded.png":::

2. Select your method of authentication by following steps in the [scan section](#creating-the-scan).
3. Once the scan is successfully set up from previous step, a new scan type called **Lineage extraction** will run incremental scans every 6 hours to extract lineage from Azure SQL Database. Lineage is extracted based on the actual stored procedure runs in the Azure SQL Database.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction-runs.png" alt-text="Screenshot that shows the screen that runs lineage extraction every 6 hours."lightbox="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction-runs-expanded.png":::

### Search Azure SQL Database assets and view runtime lineage

You can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view asset details for Azure SQL Database. The following steps describe how-to view runtime lineage details.

1. Go to asset -> lineage tab, you can see the asset lineage when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported Azure SQL Database lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).


    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage.png" alt-text="Screenshot that shows the screen with lineage from stored procedures.":::

2. Go to stored procedure asset -> Properties -> Related assets to see the latest run details of stored procedures.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-stored-procedure-properties.png" alt-text="Screenshot that shows the screen with stored procedure properties containing runs.":::

3. Select the stored procedure hyperlink next to Runs to see Azure SQL Stored Procedure Run Overview. Go to properties tab to see enhanced run time information from stored procedure. For example: executedTime, rowcount, Client Connection, and so on. 

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-stored-procedure-run-properties.png" alt-text="Screenshot that shows the screen with stored procedure run properties."lightbox="media/register-scan-azure-sql-database/register-scan-azure-sql-db-stored-procedure-run-properties-expanded.png":::

### Troubleshoot

* If no lineage is captured after a successful **Lineage extraction** run, it's possible that no stored procedures have run at least once since the scan is set up.
* Lineage is captured for stored procedure runs that happened after a successful scan is set up. Lineage from past Stored procedure runs isn't captured.
* If your database is processing heavy workloads with lots of stored procedure runs, lineage extraction will filter only the most recent runs. Stored procedure runs early in the 6 hour window or the run instances that create heavy query load won't be extracted. Contact support if you're missing lineage from any stored procedure runs.

## Next steps

To learn more about Microsoft Purview and your data, use these guides:
- [DevOps policies in Microsoft Purview](concept-policies-devops.md)
- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
