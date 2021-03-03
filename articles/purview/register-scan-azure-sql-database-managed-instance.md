---
title: 'Register and scan Azure SQL Database Managed Instance'
description: This tutorial describes how to scan Azure SQL Database Managed Instance 
author: hophanms
ms.author: hophan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 12/01/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Register and scan an Azure SQL Database Managed Instance

This article outlines how to register an Azure SQL Database Managed Instance data source in Purview and set up a scan on it.

## Supported capabilities

The Azure SQL Database Managed Instance data source supports the following functionality:

- **Full and incremental scans** to capture metadata and classification in Azure SQL Database Managed Instance.

- **Lineage** between data assets for ADF copy and dataflow activities.

### Known limitations

Azure Purview doesn't support scanning of [views](/sql/relational-databases/views/views?view=azuresqldb-mi-current&preserve-view=true) in Azure SQL Managed Instance.

## Prerequisites

- Create a new Purview account if you don't already have one.

- [Configure public endpoint in Azure SQL Managed Instance](../azure-sql/managed-instance/public-endpoint-configure.md)
    > [!Note]
    > Your organization must be able to allow public endpoint as **private endpoint is not yet supported** by Purview. If you use private endpoint, the scan will not be successful.

### Setting up authentication for a scan

Authentication to scan Azure SQL Database Managed Instance. If you need to create new authentication, you need to [authorize database access to SQL Database Managed Instance](../azure-sql/database/logins-create-manage.md). There are three authentication methods that Purview supports today:

- SQL authentication
- Service Principal
- Managed Identity

#### SQL authentication

> [!Note]
> Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about **15 minutes** after granting permission, the Purview account should have the appropriate permissions to be able to scan the resource(s).

You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a login for Azure SQL Database Managed Instance if you don't have this available. You will need **username** and **password** for the next steps.

1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure SQL Database Managed Instance
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the **username** and **password** to setup your scan

#### Service principal and managed identity

There are several steps to allow Purview to use service principal to scan your Azure SQL Database Managed Instance

##### Create or use an existing service principal

> [!Note]
> Skip this step if you are using **managed identity**

To use a service principal, you can use an existing one or create a new one. 

> [!Note]
> If you have to create a new Service Principal, please follow these steps:
> 1. Navigate to the [Azure portal](https://portal.azure.com).
> 1. Select **Azure Active Directory** from the left-hand side menu.
> 1. Select **App registrations**.
> 1. Select **+ New application registration**.
> 1. Enter a name for the **application** (the service principal name).
> 1. Select **Accounts in this organizational directory only**.
> 1. For Redirect URI select **Web** and enter any URL you want; it doesn't have to be real or work.
> 1. Then select **Register**.

##### Configure Azure AD authentication in the database account

The service principal or managed identity must have permission to get metadata for the database, schemas and tables. It must also be able to query the tables to sample for classification.
- [Configure and manage Azure AD authentication with Azure SQL](../azure-sql/database/authentication-aad-configure.md)
- Create an Azure AD user in Azure SQL Database Managed Instance by following the prerequisites and tutorial on [Create contained users mapped to Azure AD identities](../azure-sql/database/authentication-aad-configure.md?tabs=azure-powershell#create-contained-users-mapped-to-azure-ad-identities)
- Assign `db_owner` (**recommended**) permission to the identity

##### Add service principal to key vault and Purview's credential

> [!Note]
> If you are planning to use **managed identity**, you can skip this step because the default Purview identity is already in **Purview-MSI**

It is required to get the service principal's application ID and secret:

1. Navigate to your Service Principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to setup your scan

## Register an Azure SQL Database Managed Instance data source

1. Navigate to your Purview account

1. Select **Sources** on the left navigation

1. Select **Register**

1. Select **Azure SQL Database Managed Instance** and then **Continue**

    :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/set-up-the-sql-data-source.png" alt-text="Set up the SQL data source":::

1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.

1. Provide the **public endpoint fully qualified domain name** and **port number**. Then select **Finish** to register the data source.

    :::image type="content" source="media/register-scan-azure-sql-database-managed-instance/add-azure-sql-database-managed-instance.png" alt-text="Add Azure SQL Database Managed Instance":::

    E.g. `foobar.public.123.database.windows.net,3342`

[!INCLUDE [create and manage scans](includes/manage-scans.md)]

> [!NOTE]
> Deleting your scan does not delete your assets from previous Azure SQL Database Managed Instance scans.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)