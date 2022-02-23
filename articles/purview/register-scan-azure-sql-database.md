---
title: 'Register and scan Azure SQL DB'
description: This article outlines the process to register an Azure SQL database in Azure Purview including instructions to authenticate and interact with the Azure SQL DB source
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: how-to
ms.date: 11/10/2021
ms.custom: template-how-to, ignite-fall-2021
---
# Connect to Azure SQL Database in Azure Purview

This article outlines the process to register an Azure SQL data source in Azure Purview including instructions to authenticate and interact with the Azure SQL database source

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)|[Yes](#scan) | [Yes](#scan)|[Yes](#scan)| No | No** |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

### Known limitations

* Azure Purview doesn't support over 300 columns in the Schema tab and it will show "Additional-Columns-Truncated".

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You'll need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

## Register

This section will enable you to register the Azure SQL DB data source and set up authentication to scan.

### Steps to register

It's important to register the data source in Azure Purview before setting up a scan.

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Azure Purview accounts** page and select your _Purview account_

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-purview-acct.png" alt-text="Screenshot that shows the Azure Purview account used to register the data source":::

1. **Open Azure Purview Studio** and navigate to the **Data Map**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-open-purview-studio.png" alt-text="Screenshot that navigates to the Sources link in the Data Map":::

1. Create the [Collection hierarchy](./quickstart-create-collection.md) using the **Collections** menu and assign permissions to individual subcollections, as required

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-collections.png" alt-text="Screenshot that shows the collection menu to assign access control permissions to the collection hierarchy":::

1. Navigate to the appropriate collection under the **Sources** menu and select the **Register** icon to register a new Azure SQL DB

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-data-source.png" alt-text="Screenshot that shows the collection used to register the data source":::

1. Select the **Azure SQL Database** data source and select **Continue**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-select-ds.png" alt-text="Screenshot that allows selection of the data source":::

1. Provide a suitable **Name** for the data source, select the relevant **Azure subscription**, **Server name** for the SQL server and the **collection** and select on **Apply**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-ds-details.png" alt-text="Screenshot that shows the details to be entered in order to register the data source":::

1. The Azure SQL Server Database will be shown under the selected Collection

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-ds-collections.png" alt-text="Screenshot that shows the data source mapped to the collection to initiate scanning":::

## Scan

### Authentication for a scan

To scan your data source, you'll need to configure an authentication method in the Azure SQL Database.
The following options are supported:

* [**SQL Authentication**](#using-sql-authentication-for-scanning)

* [**System-assigned managed identity**](#using-a-system-or-user-assigned-managed-identity-for-scanning) - As soon as the Azure Purview account is created, a system-assigned managed identity (SAMI) is created automatically in Azure AD tenant, and has the same name as your Azure Purview account. Depending on the type of resource, specific RBAC role assignments are required for the Azure Purview SAMI to be able to scan.

* [**User-assigned managed identity**](#using-a-system-or-user-assigned-managed-identity-for-scanning) (preview) - Similar to a SAMI, a user-assigned managed identity (UAMI) is a credential resource that can be used to allow Azure Purview to authenticate against Azure Active Directory. Depending on the type of resource, specific RBAC role assignments are required when using a UAMI credential to run scans.

* [**Service Principal**](#using-service-principal-for-scanning) - In this method, you can create a new or use an existing service principal in your Azure Active Directory tenant.

>[!IMPORTANT]
> If you are using a [self-hosted integration runtime](manage-integration-runtimes.md) to connect to your resource, system-assigned and user-assigned managed identities will not work. You need to use SQL Authentication or Service Principal Authentication.

#### Using SQL Authentication for scanning

> [!Note]
> Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about **15 minutes** after granting permission, the Azure Purview account should have the appropriate permissions to be able to scan the resource(s).

You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a login for Azure SQL Database. You'll' need **username** and **password** for the next steps.

1. Navigate to your key vault in the Azure portal

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-key-vault.png" alt-text="Screenshot that shows the key vault":::

1. Select **Settings > Secrets** and select **+ Generate/Import**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-secret.png" alt-text="Screenshot that shows the key vault option to generate a secret":::

1. Enter the **Name** and **Value** as the *password* from your Azure SQL Database

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-secret-sql.png" alt-text="Screenshot that shows the key vault option to enter the sql secret values":::

1. Select **Create** to complete

1. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)

1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to set up your scan

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-credentials.png" alt-text="Screenshot that shows the key vault option to set up credentials":::

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-key-vault-options.png" alt-text="Screenshot that shows the key vault option to create a secret":::

#### Using a system or user assigned managed identity for scanning

>[!IMPORTANT]
> If you are using a [self-hosted integration runtime](manage-integration-runtimes.md) to connect to your resource, system-assigned and user-assigned managed identities will not work. You need to use SQL Authentication or Service Principal Authentication.

##### Configure Azure AD authentication in the database account

The managed identity needs permission to get metadata for the database, schemas, and tables. It must also be authorized to query the tables to sample for classification.

- If you haven't already, [configure Azure AD authentication with Azure SQL](../azure-sql/database/authentication-aad-configure.md)
- Create Azure AD user in Azure SQL Database with the exact Azure Purview's managed identity by following tutorial on [create the user in Azure SQL Database](../azure-sql/database/authentication-aad-service-principal-tutorial.md#create-the-service-principal-user-in-azure-sql-database). Assign proper permission (for example: `db_datareader`) to the identity. Example SQL syntax to create user and grant permission:

    ```sql
    CREATE USER [Username] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [Username]
    GO
    ```

    > [!Note]
    > The `Username` is your Azure Purview's managed identity name. You can read more about [fixed-database roles and their capabilities](/sql/relational-databases/security/authentication-access/database-level-roles#fixed-database-roles).

##### Configure Portal Authentication

It is important to give your Azure Purview account's system-managed identity or [user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity) the permission to scan the Azure SQL DB. You can add the SAMI or UAMI at the Subscription, Resource Group, or Resource level, depending on the breadth of the scan.

> [!Note] 
> You need to be an owner of the subscription to be able to add a managed identity on an Azure resource.

1. From the [Azure portal](https://portal.azure.com), find either the subscription, resource group, or resource (for example, an Azure SQL Database) that the catalog should scan.

1. Select **Access Control (IAM)** in the left navigation and then select **+ Add** --> **Add role assignment**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sql-ds.png" alt-text="Screenshot that shows the Azure SQL database":::

1. Set the **Role** to **Reader** and enter your _Azure Purview account name_ or _[user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity)_ under **Select** input box. Then, select **Save** to give this role assignment to your Azure Purview account.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-access-managed-identity.png" alt-text="Screenshot that shows the details to assign permissions for the Azure Purview account":::

#### Using Service Principal for scanning

##### Creating a new service principal

If you do not have a service principal, you can [follow the service principal guide to create one.](./create-service-principal-azure.md)

> [!NOTE]
> To create a service principal, it's required to register an application in your Azure AD tenant. If you do not have access to do this, your Azure AD Global Administrator, or other roles like Application Administrator can perform this operation.

##### Granting the Service Principal access to your Azure SQL Database

The service principal needs permission to get metadata for the database, schemas, and tables. It must also be authorized to query the tables to sample for classification.

- If you haven't already, [configure Azure AD authentication with Azure SQL](../azure-sql/database/authentication-aad-configure.md)
- Create Azure AD user in Azure SQL Database with your service principal by following tutorial on [Create the service principal user in Azure SQL Database](../azure-sql/database/authentication-aad-service-principal-tutorial.md#create-the-service-principal-user-in-azure-sql-database). Assign proper permission (for example: `db_datareader`) to the identity. Example SQL syntax to create user and grant permission:

    ```sql
    CREATE USER [Username] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_datareader', [Username]
    GO
    ```

    > [!Note]
    > The `Username` is your own service principal's name. You can read more about [fixed-database roles and their capabilities](/sql/relational-databases/security/authentication-access/database-level-roles#fixed-database-roles).

##### Create the credential

1. Navigate to your key vault in the Azure portal

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-key-vault.png" alt-text="Screenshot that shows the key vault to add a secret for for Service Principal":::

1. Select **Settings > Secrets** and select **+ Generate/Import**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-secret.png" alt-text="Screenshot that shows the key vault option to generate a secret for Service Principal":::

1. Give the secret a **Name** of your choice. 

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-create-secret.png" alt-text="Screenshot that shows the key vault option to enter the secret values":::

1. The secret's **Value** will be the Service Principal's **Secret Value**. If you have already created a secret for your service principal, you can find its value in **Client credentials** on your secret's overview page.

    If you need to create a secret, you can follow the steps in the [service principal guide](create-service-principal-azure.md#adding-a-secret-to-the-client-credentials).

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-client-credentials.png" alt-text="Screenshot that shows the Client credentials for the Service Principal":::

1. Select **Create** to create the secret.

    :::image type="content" source="media/register-scan-azure-sql-database/select-create.png" alt-text="Screenshot that shows the Key Vault Create a secret menu, with the Create button highlighted.":::

1. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)

1. Then, [create a new credential](manage-credentials.md#create-a-new-credential).

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-credentials.png" alt-text="Screenshot that shows the key vault option to add a credentials for Service Principal":::

1. The **Service Principal ID** will be the **Application ID** of your service principal. The **Secret name** will be the name of the secret you created in the previous steps.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-appln-id.png" alt-text="Screenshot that shows the Application (client) ID for the Service Principal":::

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp-cred.png" alt-text="Screenshot that shows the key vault option to create a secret for Service Principal":::

### Firewall settings

If your database server has a firewall enabled, you will need to update the firewall to allow access in one of two ways:

1. Allow Azure connections through the firewall.
1. Install a Self-Hosted Integration Runtime and give it access through the firewall.

#### Allow Azure Connections

Enabling Azure connections will allow Azure Purview to reach and connect the server without updating the firewall itself. You can follow the How-to guide for [Connections from inside Azure](../azure-sql/database/firewall-configure.md#connections-from-inside-azure).

1. Navigate to your database account
1. Select the server name in the **Overview** page
1. Select **Security > Firewalls and virtual networks**
1. Select **Yes** for **Allow Azure services and resources to access this server**
:::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-firewall.png" alt-text="Allow Azure services and resources to access this server." border="true":::

#### Self-Hosted Integration Runtime

A self-hosted integration runtime (SHIR) can be installed on a machine to connect with a resource in a private network.

1. [Create and install a self-hosted integration runtime](./manage-integration-runtimes.md) on a personal machine, or a machine inside the same VNet as your database server.
1. Check your database server firewall to confirm that the SHIR machine has access through the firewall. Add the IP of the machine if it does not already have access.
1. If your Azure SQL Server is behind a private endpoint or in a VNet, you can use an [ingestion private endpoint](catalog-private-link-ingestion.md#deploy-self-hosted-integration-runtime-ir-and-scan-your-data-sources) to ensure end-to-end network isolation.

### Creating the scan

1. Open your **Azure Purview account** and select the **Open Azure Purview Studio**
1. Navigate to the **Data map** --> **Sources** to view the collection hierarchy
1. Select the **New Scan** icon under the **Azure SQL DB** registered earlier

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-new-scan.png" alt-text="Screenshot that shows the screen to create a new scan":::

#### If using SQL Authentication

1. Provide a **Name** for the scan, select **Database selection method** as _Enter manually_, enter the **Database name** and the **Credential** created earlier, choose the appropriate collection for the scan and select **Test connection** to validate the connection. Once the connection is successful, select **Continue**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sql-auth.png" alt-text="Screenshot that shows the SQL Authentication option for scanning":::

#### If using a system or user assigned managed identity

1. Provide a **Name** for the scan, select the SAMI or UAMI under **Credential**, choose the appropriate collection for the scan.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-managed-id.png" alt-text="Screenshot that shows the managed identity option to run the scan":::

1. Select **Test connection**. On a successful connection, select **Continue**

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-test.png" alt-text="Screenshot that allows the managed identity option to run the scan":::

#### If using Service Principal

1. Provide a **Name** for the scan, choose the appropriate collection for the scan, and select the **Credential** dropdown to select the credential created earlier.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sp.png" alt-text="Screenshot that shows the option for service principal to enable scanning":::

1. Select **Test connection**. On a successful connection, select **Continue**.

### Scoping and running the scan

1. You can scope your scan to specific folders and subfolders by choosing the appropriate items in the list.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scope-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scan-rule-set.png" alt-text="Scan rule set":::

1. If creating a new _scan rule set_

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-new-scan-rule-set.png" alt-text="New Scan rule set":::

1. You can select the **classification rules** to be included in the scan rule

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-classification.png" alt-text="Scan rule set classification rules":::

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-sel-scan-rule.png" alt-text="Scan rule set selection":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scan-trigger.png" alt-text="scan trigger":::

1. Review your scan and select **Save and run**.

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-review-scan.png" alt-text="review scan":::

### View Scan

1. Navigate to the _data source_ in the _Collection_ and select **View Details** to check the status of the scan

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-view-scan.png" alt-text="view scan":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets _scanned_ and _classified_

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-view-scan-details.png" alt-text="view scan details":::

1. The **Last run status** will be updated to **In progress** and then **Completed** once the entire scan has run successfully

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-scan-complete.png" alt-text="view scan completed":::

### Manage Scan

Scans can be managed or run again on completion

1. Select the **Scan name** to manage the scan

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-manage scan.png" alt-text="manage scan":::

1. You can _run the scan_ again, _edit the scan_, _delete the scan_  

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-manage-scan-options.png" alt-text="manage scan options":::

1. You can _run an incremental scan_ or a _full scan_ again

    :::image type="content" source="media/register-scan-azure-sql-database/register-scan-azure-sql-db-full-inc.png" alt-text="full or incremental scan":::

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
