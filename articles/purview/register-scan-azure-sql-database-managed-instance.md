---
title: 'Connect to and manage Azure SQL Database Managed Instance'
description: This guide describes how to connect to Azure SQL Database Managed Instance in Azure Purview, and use Azure Purview's features to scan and manage your Azure SQL Database Managed Instance source.
author: hophanms
ms.author: hophan
ms.service: purview
ms.subservice: purview-data-map
ms.topic: tutorial
ms.date: 11/02/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage an Azure SQL Database Managed Instance in Azure Purview

This article outlines how to register and Azure SQL Database Managed Instance, as well as how to authenticate and interact with the Azure SQL Database Managed Instance in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md)

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)| [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | No | No** |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* [Configure public endpoint in Azure SQL Managed Instance](../azure-sql/managed-instance/public-endpoint-configure.md)

    > [!Note]
    > We now support scanning Azure SQL Database Managed Instances that are configured with private endpoints using Azure Purview ingestion private endpoints and a self-hosted integration runtime VM.
    > For more information related to prerequisites, see [Connect to your Azure Purview and scan data sources privately and securely](./catalog-private-link-end-to-end.md)

## Register

This section describes how to register an Azure SQL Database Managed Instance in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Authentication for registration

If you need to create new authentication, you need to [authorize database access to SQL Database Managed Instance](../azure-sql/database/logins-create-manage.md). There are three authentication methods that Azure Purview supports today:

- [System or user assigned managed identity](#system-or-user-assigned-managed-identity-to-register)
- [Service Principal](#service-principal-to-register)
- [SQL authentication](#sql-authentication-to-register)

#### System or user assigned managed identity to register

You can use either your Azure Purview system-assigned managed identity (SAMI), or a [user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity) (UAMI) to authenticate. Both options allow you to assign authentication directly to Azure Purview, like you would for any other user, group, or service principal. The Azure Purview system-assigned managed identity is created automatically when the account is created and has the same name as your Azure Purview account. A user-assigned managed identity is a resource that can be created independently. To create one you can follow our [user-assigned managed identity guide](manage-credentials.md#create-a-user-assigned-managed-identity).

You can find your managed identity Object ID in the Azure portal by following these steps:

For Azure Purview account’s system-assigned managed identity: 
1. Open the Azure portal, and navigate to your Azure Purview account.
1. Select the **Properties** tab on the left side menu.
1. Select the **Managed identity object ID** value and copy it.

For user-assigned managed identity (preview): 
1. Open the Azure portal, and navigate to your Azure Purview account. 
1. Select the Managed identities tab on the left side menu 
1. Select the user assigned managed identities, select the intended identity to view the details. 
1. The object (principal) ID is displayed in the overview essential section.

Either managed identity will need permission to get metadata for the database, schemas and tables, and to query the tables for classification.
- Create an Azure AD user in Azure SQL Database Managed Instance by following the prerequisites and tutorial on [Create contained users mapped to Azure AD identities](../azure-sql/database/authentication-aad-configure.md?tabs=azure-powershell#create-contained-users-mapped-to-azure-ad-identities)
- Assign `db_datareader` permission to the identity.

#### Service Principal to register

There are several steps to allow Azure Purview to use service principal to scan your Azure SQL Database Managed Instance.

#### Create or use an existing service principal

To use a service principal, you can use an existing one or create a new one. If you are going to use an existing service principal, skip to the next step.
If you have to create a new Service Principal, follow these steps:

 1. Navigate to the [Azure portal](https://portal.azure.com).
 1. Select **Azure Active Directory** from the left-hand side menu.
 1. Select **App registrations**.
 1. Select **+ New application registration**.
 1. Enter a name for the **application** (the service principal name).
 1. Select **Accounts in this organizational directory only**.
 1. For Redirect URI, select **Web** and enter any URL you want; it doesn't have to be real or work.
 1. Then select **Register**.

#### Configure Azure AD authentication in the database account

The service principal must have permission to get metadata for the database, schemas, and tables. It must also be able to query the tables to sample for classification.
- [Configure and manage Azure AD authentication with Azure SQL](../azure-sql/database/authentication-aad-configure.md)
- Create an Azure AD user in Azure SQL Database Managed Instance by following the prerequisites and tutorial on [Create contained users mapped to Azure AD identities](../azure-sql/database/authentication-aad-configure.md?tabs=azure-powershell#create-contained-users-mapped-to-azure-ad-identities)
- Assign `db_datareader` permission to the identity.

#### Add service principal to key vault and Azure Purview's credential

It is required to get the service principal's application ID and secret:

1. Navigate to your Service Principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to set up your scan.

#### SQL authentication to register

> [!Note]
> Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about **15 minutes** after granting permission, the Azure Purview account should have the appropriate permissions to be able to scan the resource(s).

You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a login for Azure SQL Database Managed Instance if you don't have this login available. You will need **username** and **password** for the next steps.

1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure SQL Database Managed Instance
1. Select **Create** to complete
1. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the **username** and **password** to set up your scan.

### Steps to register

1. Navigate to your [Azure Purview Studio](https://web.purview.azure.com/resource/)

1. Select **Data Map** on the left navigation.

1. Select **Register**

1. Select **Azure SQL Database Managed Instance** and then **Continue**.

    :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/set-up-the-sql-data-source.png" alt-text="Set up the SQL data source":::

1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.

1. Provide the **public endpoint fully qualified domain name** and **port number**. Then select **Register** to register the data source.

    :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/add-azure-sql-database-managed-instance.png" alt-text="Add Azure SQL Database Managed Instance":::

    For Example: `foobar.public.123.database.windows.net,3342`

## Scan

Follow the steps below to scan an Azure SQL Database Managed Instance to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, complete the following steps:

1. Select the **Data Map** tab on the left pane in the Azure Purview Studio.

1. Select the Azure SQL Database Managed Instance source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

   :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/set-up-scan-sql-mi.png" alt-text="Set up scan":::

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
