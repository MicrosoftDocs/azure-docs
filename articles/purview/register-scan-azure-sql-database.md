---
title: 'Discover and govern Azure SQL Database'
description: Learn how to register, authenticate with, and interact with an Azure SQL database in Microsoft Purview.
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/04/2023
ms.custom: template-how-to
---
# Discover and govern Azure SQL Database in Microsoft Purview

This article outlines the process to register an Azure SQL database source in Microsoft Purview. It includes instructions to authenticate and interact with the SQL database.

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register-the-data-source) | [Yes](#scope-and-run-the-scan)|[Yes](#scope-and-run-the-scan) | [Yes](#scope-and-run-the-scan)|[Yes](#scope-and-run-the-scan)| [Yes](create-sensitivity-label.md)| [Yes](#set-up-access-policies) | [Yes (preview)](#extract-lineage-preview) | No |

> [!NOTE]
> [Data lineage extraction is currently supported only for stored procedure runs.](#troubleshoot-lineage-extraction) Lineage is also supported if Azure SQL tables or views are used as a source/sink in [Azure Data Factory Copy and Data Flow activities](how-to-link-azure-data-factory.md).

When you're scanning Azure SQL Database, Microsoft Purview supports extracting technical metadata from these sources:

- Server
- Database
- Schemas
- Tables, including columns
- Views, including columns
- Stored procedures (with lineage extraction enabled)
- Stored procedure runs (with lineage extraction enabled)

When you're setting up a scan, you can further scope it after providing the database name by selecting tables and views as needed. 

### Known limitations

* Microsoft Purview supports a maximum of 800 columns on the schema tab. If there are more than 800 columns, Microsoft Purview will show **Additional-Columns-Truncated**.
* Column-level lineage is currently not supported on the lineage tab. However, the `columnMapping` attribute on the properties tab for SQL stored procedure runs captures column lineage in plain text.
* Data lineage extraction is currently not supported for functions or triggers.
* The lineage extraction scan is scheduled to run every six hours by default. The frequency can't be changed.
* If SQL views are referenced in stored procedures, they're currently captured as SQL tables.
* Lineage extraction is currently not supported if your logical server in Azure disables public access or doesn't allow Azure services to access it.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* Data Source Administrator and Data Reader permissions, so you can register a source and manage it in the Microsoft Purview governance portal. For details, see [Access control in the Microsoft Purview governance portal](catalog-permissions.md).

## Register the data source

Before you scan, it's important to register the data source in Microsoft Purview:

1. Open the Microsoft Purview governance portal by:

   - Browsing directly to [https://web.purview.azure.com](https://web.purview.azure.com) and selecting your Microsoft Purview account.
   - Opening the [Azure portal](https://portal.azure.com), searching for and selecting the Microsoft Purview account. Select the [**the Microsoft Purview governance portal**](https://web.purview.azure.com/) button.

1. Navigate to the **Data Map**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-open-purview-studio.png" alt-text="Screenshot that shows the area for opening a Microsoft Purview governance portal.":::

1. Create the [collection hierarchy](./quickstart-create-collection.md) by going to **Collections** and then selecting **Add a collection**. Assign permissions to individual subcollections as required.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-collections.png" alt-text="Screenshot that shows selections for assigning access control permissions to the collection hierarchy.":::

1. Go to the appropriate collection under **Sources**, and then select the **Register** icon to register a new SQL database.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-data-source.png" alt-text="Screenshot that shows the collection that's used to register the data source.":::

1. Select the **Azure SQL Database** data source, and then select **Continue**.

1. For **Name**, provide a suitable name for the data source. Select relevant names for **Azure subscription**, **Server name**, and **Select a collection**, and then select **Apply**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-ds-details.png" alt-text="Screenshot that shows details entered to register a data source.":::

1. Confirm that the SQL database appears under the selected collection.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-ds-collections.png" alt-text="Screenshot that shows a data source mapped to a collection to initiate scanning.":::

## Update firewall settings

If your database server has a firewall enabled, you need to update the firewall to allow access in one of the following ways:

- [Allow Azure connections through the firewall](#allow-azure-connections). This is a straightforward option to route traffic through Azure networking, without needing to manage virtual machines.
- [Install a self-hosted integration runtime on a machine in your network and give it access through the firewall](#install-a-self-hosted-integration-runtime). If you have a private virtual network set up within Azure, or have any other closed network set up, using a self-hosted integration runtime on a machine within that network will allow you to fully manage traffic flow and utilize your existing network.
- [Use a managed virtual network](catalog-managed-vnet.md). Setting up a managed virtual network with your Microsoft Purview account will allow you to connect to Azure SQL by using the Azure integration runtime in a closed network.

For more information about the firewall, see the [Azure SQL Database firewall documentation](/azure/azure-sql/database/firewall-configure). 

### Allow Azure connections

Enabling Azure connections will allow Microsoft Purview to connect to the server without requiring you to update the firewall itself. 

1. Go to your database account.
1. On the **Overview** page, select the server name.
1. Select **Security** > **Firewalls and virtual networks**.
1. For **Allow Azure services and resources to access this server**, select **Yes**.

:::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-firewall.png" alt-text="Screenshot that shows selections in the Azure portal to allow Azure connections to a server." border="true.":::

For more information about allowing connections from inside Azure, see the [how-to guide](/azure/azure-sql/database/firewall-configure#connections-from-inside-azure).

### Install a self-hosted integration runtime

You can install a self-hosted integration runtime on a machine to connect with a resource in a private network:

1. [Create and install a self-hosted integration runtime](./manage-integration-runtimes.md) on a personal machine, or on a machine inside the same virtual network as your database server.
1. Check your database server's networking configuration to confirm that a private endpoint is accessible to the machine that contains the self-hosted integration runtime. Add the IP address of the machine if it doesn't already have access.
1. If your logical server is behind a private endpoint or in a virtual network, you can use an [ingestion private endpoint](catalog-private-link-ingestion.md#deploy-self-hosted-integration-runtime-ir-and-scan-your-data-sources) to ensure end-to-end network isolation.

## Configure authentication for a scan

To scan your data source, you need to configure an authentication method in Azure SQL Database.

>[!IMPORTANT]
> If you're using a [self-hosted integration runtime](manage-integration-runtimes.md) to connect to your resource, system-assigned and user-assigned managed identities won't work. You need to use service principal authentication or SQL authentication.

Microsoft Purview supports the following options:

* **System-assigned managed identity (SAMI)** (recommended). This is an identity that's associated directly with your Microsoft Purview account. It allows you to authenticate directly with other Azure resources without needing to manage a go-between user or credential set. 

  The SAMI is created when your Microsoft Purview resource is created. It's managed by Azure and uses your Microsoft Purview account's name. The SAMI can't currently be used with a self-hosted integration runtime for Azure SQL. 
  
  For more information, see the [managed identity overview](../active-directory/managed-identities-azure-resources/overview.md).

* **User-assigned managed identity (UAMI)** (preview). Similar to a SAMI, a UAMI is a credential resource that allows Microsoft Purview to authenticate against Azure Active Directory (Azure AD). 

  The UAMI is managed by users in Azure, rather than by Azure itself, which gives you more control over security. The UAMI can't currently be used with a self-hosted integration runtime for Azure SQL. 
  
  For more information, see the [guide for user-assigned managed identities](manage-credentials.md#create-a-user-assigned-managed-identity).

* **Service principal**. A service principal is an application that can be assigned permissions like any other group or user, without being associated directly with a person. Authentication for service principals has an expiration date, so it can be useful for temporary projects. 

  For more information, see the [service principal documentation](../active-directory/develop/app-objects-and-service-principals.md).

* **SQL authentication**. Connect to the SQL database with a username and password. For more information, see the [SQL authentication documentation](/sql/relational-databases/security/choose-an-authentication-mode#connecting-through-sql-server-authentication). 

  If you need to create a login, follow [this guide to query a SQL database](/azure/azure-sql/database/connect-query-portal). Use [this guide to create a login by using T-SQL](/sql/t-sql/statements/create-login-transact-sql).
    
  > [!NOTE]
  > Be sure to select the **Azure SQL Database** option on the page.

For steps to authenticate with your SQL database, select your chosen method of authentication from the following tabs.

# [SQL authentication](#tab/sql-authentication)

> [!Note]
> Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. The Microsoft Purview account should be able to scan the resources about 15 minutes after it gets permissions.

1. You need a SQL login with at least `db_datareader` permissions to be able to access the information that Microsoft Purview needs to scan the database. You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a sign-in for Azure SQL Database. Save the username and password for the next steps.

1. Go to your key vault in the Azure portal.

1. Select **Settings** > **Secrets**, and then select **+ Generate/Import**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-secret.png" alt-text="Screenshot that shows the key vault option to generate a secret.":::

1. For **Name** and **Value**, use the username and password (respectively) from your SQL database.

1. Select **Create**.

1. If your key vault isn't connected to Microsoft Purview yet, [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account).

1. [Create a new credential](manage-credentials.md#create-a-new-credential) by using the key to set up your scan.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-credentials.png" alt-text="Screenshot that shows the key vault option to set up credentials.":::

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-key-vault-options.png" alt-text="Screenshot that shows the key vault option to create a secret.":::

# [Managed identity](#tab/managed-identity)

>[!IMPORTANT]
> If you're using a [self-hosted integration runtime](manage-integration-runtimes.md) to connect to your resource, system-assigned and user-assigned managed identities won't work. You need to use SQL authentication or service principal authentication.

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
    > The `[Username]` value is your managed identity name from Microsoft Purview. You can [read more about fixed-database roles and their capabilities](/sql/relational-databases/security/authentication-access/database-level-roles#fixed-database-roles).

### Configure portal authentication

It's important to give your Microsoft Purview account's system-assigned managed identity or [user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity) the permission to scan the SQL database. You can add the SAMI or UAMI at the subscription, resource group, or resource level, depending on the breadth of the scan.

> [!Note]
> To add a managed identity on an Azure resource, you need to be an owner of the subscription.

1. From the [Azure portal](https://portal.azure.com), find the subscription, resource group, or resource (for example, a SQL database) that the catalog should scan.

1. Select **Access control (IAM)** on the left menu, and then select **+ Add** > **Add role assignment**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sql-ds.png" alt-text="Screenshot that shows selections for adding a role assignment for access control.":::

1. Set **Role** to **Reader**. In the **Select** box, enter your Microsoft Purview account name or UAMI. Then, select **Save** to give this role assignment to your Microsoft Purview account.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-access-managed-identity.png" alt-text="Screenshot that shows the details to assign permissions for the Microsoft Purview account.":::

# [Service principal](#tab/service-principal)

### Create a new service principal

If you don't have a service principal, you can follow the [service principal guide](./create-service-principal-azure.md) to create one.

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
    > The `[Username]` value is your own service principal's name. You can [read more about fixed-database roles and their capabilities](/sql/relational-databases/security/authentication-access/database-level-roles#fixed-database-roles).

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

1. For **Service Principal ID**, use the application (client) ID of your service principal. 

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-appln-id.png" alt-text="Screenshot that shows the application ID for a service principal.":::

1. For **Secret name**, use the name of the secret that you created in previous steps.
    
    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-cred.png" alt-text="Screenshot that shows the key vault option to create a secret for a service principal.":::

---

## Create the scan

1. Open your Microsoft Purview account and select **Open Microsoft Purview governance portal**.
1. Go to **Data map** > **Sources** to view the collection hierarchy.
1. Select the **New Scan** icon under the SQL database that you registered earlier.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-new-scan.png" alt-text="Screenshot that shows the pane for creating a new scan.":::

To learn more about data lineage in Azure SQL Database, see the [Extract lineage (preview)](#extract-lineage-preview) section of this article.

For scanning steps, select your method of authentication from the following tabs.

# [SQL authentication](#tab/sql-authentication)

1. For **Name**, provide a name for the scan. 

1. For **Database selection method**, select **Enter manually**.

1. For **Database name** and **Credential**, enter the values that you created earlier.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sql-auth.png" alt-text="Screenshot that shows database and credential information for the SQL authentication option to run a scan.":::

1. For **Select a connection**, choose the appropriate collection for the scan.

1. Select **Test connection** to validate the connection. After the connection is successful, select **Continue**.    

# [Managed identity](#tab/managed-identity)

1. For **Name**, provide a name for the scan.

1. Select the SAMI or UAMI under **Credential**, and choose the appropriate collection for the scan.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-managed-id.png" alt-text="Screenshot that shows credential and collection information for the managed identity option to run a scan.":::

1. Select **Test connection**. After the connection is successful, select **Continue**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-test.png" alt-text="Screenshot that shows the message for a successful connection for the managed identity option to run a scan.":::

# [Service principal](#tab/service-principal)

1. For **Name**, provide a name for the scan.

1. Choose the appropriate collection for the scan, and select the credential that you created earlier under **Credential**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp.png" alt-text="Screenshot that shows collection and credential information for the service principal option to enable scanning.":::

1. Select **Test connection**. After the connection is successful, select **Continue**.

---

## Scope and run the scan

1. You can scope your scan to specific database objects by choosing the appropriate items in the list.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scope-scan.png" alt-text="Screenshot that shows options for scoping a scan.":::

1. Select a scan rule set. You can use the system default, choose from existing custom rule sets, or create a new rule set inline. Select **Continue** when you're finished.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scan-rule-set.png" alt-text="Screenshot that shows options for selecting a scan rule set.":::

    If you select **New scan rule set**, a pane opens so that you can enter the source type, the name of the rule set, and a description. Select **Continue** when you're finished.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-new-scan-rule-set.png" alt-text="Screenshot that shows information for creating a new scan rule set.":::
    
    For **Select classification rules**, choose the classification rules that you want to include in the scan rule set, and then select **Create**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-classification.png" alt-text="Screenshot that shows a list of classification rules for a scan rule set.":::

    The new scan rule set then appears in the list of available rule sets.
   
    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sel-scan-rule.png" alt-text="Screenshot that shows the selection of a new scan rule set.":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

1. Review your scan, and then select **Save and run**.

### View a scan

To check the status of a scan, go to the data source in the collection, and then select **View details**.

:::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-view-scan.png" alt-text="Screenshot that shows the button for viewing details of a scan.":::

The scan details indicate the progress of the scan in **Last run status**, along with the number of assets scanned and classified. 
**Last run status** is updated to **In progress** and then **Completed** after the entire scan has run successfully.

:::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scan-complete.png" alt-text="Screenshot that shows a completed status for the last scan run.":::

### Manage a scan

After you run a scan, you can use the run history to manage it:

1. Under **Recent scans**, select a scan. 

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-manage scan.png" alt-text="Screenshot that shows the selection of a recently completed scan.":::

1. In the run history, you have options for running the scan again, editing it, or deleting it.  

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-manage-scan-options.png" alt-text="Screenshot that shows options for running, editing, and deleting a scan.":::

    If you select **Run scan now** to rerun the scan, you can then choose either **Incremental scan** or **Full scan**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-full-inc.png" alt-text="Screenshot that shows options for full or incremental scan.":::


### Troubleshoot scanning

If you have problems with scanning, try these tips:

- Confirm that you followed all [prerequisites](#prerequisites).
- Check the network by confirming [firewall](#update-firewall-settings), [Azure connections](#allow-azure-connections), or [integration runtime](#install-a-self-hosted-integration-runtime) settings.
- Confirm that [authentication](#configure-authentication-for-a-scan) is properly set up.

For more information, review [Troubleshoot your connections in Microsoft Purview](troubleshoot-connections.md).

## Set up access policies

The following types of policies are supported on this data resource from Microsoft Purview:
- [DevOps policies](concept-policies-devops.md)
- [Data owner policies](concept-policies-data-owner.md)
- [Self-service policies](concept-self-service-data-access-policy.md)

### Access policy prerequisites on Azure SQL Database

[!INCLUDE [Access policies specific Azure SQL Database prerequisites](./includes/access-policies-prerequisites-azure-sql-db.md)]

### Configure the Microsoft Purview account for policies

[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data source and enable Data use management

The Azure SQL Database resource needs to be registered with Microsoft Purview before you can create access policies. To register your resources, follow the "Prerequisites" and "Register the data source" sections in [Enable Data use management on your Microsoft Purview sources](./register-scan-azure-sql-database.md#prerequisites).

After you register the data source, you need to enable **Data use management**. This is a prerequisite before you can create policies on the data source. **Data use management** can affect the security of your data, because it delegates to certain Microsoft Purview roles that manage access to the data sources. Go through the security practices in [Enable Data use management on your Microsoft Purview sources](./how-to-enable-data-use-management.md).

After your data source has the **Data use management** option set to **Enabled**, it will look like this screenshot:

![Screenshot that shows the panel for registering a data source for a policy, including areas for name, server name, and data use management.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-azure-sql-db.png)

[!INCLUDE [Access policies Azure SQL Database pre-requisites](./includes/access-policies-configuration-azure-sql-db.md)]

### Create a policy

To create an access policy for Azure SQL Database, follow these guides:

* [Provision access to system health, performance and audit information in Azure SQL Database](./how-to-policies-devops-azure-sql-db.md#create-a-new-devops-policy). Use this guide to apply a DevOps policy on a single SQL database.
* [Provision read/modify access on a single Azure SQL Database](./how-to-policies-data-owner-azure-sql-db.md#create-and-publish-a-data-owner-policy). Use this guide to provision access on a single SQL database account in your subscription.
* [Self-service access policies for Azure SQL Database](./how-to-policies-self-service-azure-sql-db.md). Use this guide to allow data consumers to request access to data assets by using a self-service workflow.

To create policies that cover all data sources inside a resource group or Azure subscription, see [Discover and govern multiple Azure sources in Microsoft Purview](register-scan-azure-multiple-sources.md#access-policy).



## Extract lineage (preview) 
<a id="lineagepreview"></a>

Microsoft Purview supports lineage from Azure SQL Database. When you're setting up a scan, you turn on the **Lineage extraction** toggle to extract lineage.  

### Prerequisites for setting up a scan with lineage extraction

1. Follow the steps in the [Configure authentication for a scan](#configure-authentication-for-a-scan) section of this article to authorize Microsoft Purview to scan your SQL database.

2. Sign in to Azure SQL Database with your Azure AD account, and assign `db_owner` permissions to the Microsoft Purview managed identity. 

    Use the following example SQL syntax to create a user and grant permission. Replace `<purview-account>` with your account name.

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

### Create a scan with lineage extraction turned on

1. On the pane for setting up a scan, turn on the **Enable lineage extraction** toggle.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction.png" alt-text="Screenshot that shows the pane for creating a new scan, with lineage extraction turned on." lightbox="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction-expanded.png":::

2. Select your method of authentication by following the steps in the [Create the scan](#create-the-scan) section of this article.
3. After you successfully set up the scan, a new scan type called **Lineage extraction** will run incremental scans every six hours to extract lineage from Azure SQL Database. Lineage is extracted based on the stored procedure runs in the SQL database.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction-runs.png" alt-text="Screenshot that shows the screen that runs lineage extraction every six hours."lightbox="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-extraction-runs-expanded.png":::

    > [!Note]
    > Toggle on  **Lineage extraction** will trigger daily scan.

### Search Azure SQL Database assets and view runtime lineage

You can [browse through the data catalog](how-to-browse-catalog.md) or [search the data catalog](how-to-search-catalog.md) to view asset details for Azure SQL Database. The following steps describe how to view runtime lineage details:

1. Go to the **Lineage** tab for the asset. When applicable, the asset lineage appears here. 


    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage.png" alt-text="Screenshot that shows lineage details from stored procedures.":::

    When applicable, you can further drill down to see the lineage at SQL statement level within a stored procedure, along with column level lineage. When using Self-hosted Integration Runtime for scan, retrieving the lineage drilldown information during scan is supported since version 5.25.8374.1.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-lineage-drilldown.png" alt-text="Screenshot that shows stored procedure lineage drilldown.":::

    For information about supported Azure SQL Database lineage scenarios, refer to the [Supported capabilities](#supported-capabilities) section of this article. For more information about lineage in general, see [Data lineage in Microsoft Purview](concept-data-lineage.md) and [Microsoft Purview Data Catalog lineage user guide](catalog-lineage-user-guide.md).

2. Go to the stored procedure asset. On the **Properties** tab, go to **Related assets** to get the latest run details of stored procedures.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-stored-procedure-properties.png" alt-text="Screenshot that shows run details for stored procedure properties.":::

3. Select the stored procedure hyperlink next to **Runs** to see the **Azure SQL Stored Procedure Run** overview. Go to the **Properties** tab to see enhanced runtime information from the stored procedure, such as **executedTime**, **rowCount**, and **Client Connection**. 

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-stored-procedure-run-properties.png" alt-text="Screenshot that shows run properties for a stored procedure."lightbox="media/register-scan-azure-sql-database/register-scan-azure-sql-db-stored-procedure-run-properties-expanded.png":::

### Troubleshoot lineage extraction

The following tips can help you solve problems related to lineage: 

* If no lineage is captured after a successful **Lineage extraction** run, it's possible that no stored procedures have run at least once since you set up the scan.
* Lineage is captured for stored procedure runs that happen after a successful scan is set up. Lineage from past stored procedure runs isn't captured.
* If your database is processing heavy workloads with lots of stored procedure runs, lineage extraction will filter only the most recent runs. Stored procedure runs early in the six-hour window, or the run instances that create heavy query load, won't be extracted. Contact support if you're missing lineage from any stored procedure runs.

## Next steps

To learn more about Microsoft Purview and your data, use these guides:

- [Concepts for Microsoft Purview DevOps policies](concept-policies-devops.md)
- [Understand the Microsoft Purview Data Estate Insights application](concept-insights.md)
- [Microsoft Purview Data Catalog lineage user guide](catalog-lineage-user-guide.md)
- [Search the Microsoft Purview Data Catalog](how-to-search-catalog.md)
