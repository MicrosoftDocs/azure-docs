---
title: 'Register and scan Azure SQL Database'
description: This tutorial describes how to scan Azure SQL Database 
author: hophan
ms.author: hophan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 10/02/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Register and scan an Azure SQL Database

This article outlines how to register an Azure SQL Database data source in Purview and set up a scan on it.

## Supported Capabilities

The Azure SQL Database data source supports the following functionality:

- **Full and incremental scans** to capture metadata and classification in Azure SQL Database.

- **Lineage** between data assets for ADF copy and dataflow activities.

## Prerequisites

1. Create a new Purview account if you don't already have one.

1. Networking access between the Purview account and Azure SQL Database.


### Set up authentication for a scan

Authentication to scan Azure SQL Database. If you need to create new authentication, you need to [authorize database access to SQL Database](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage). There are three authentication methods that Purview supports today:

- SQL authentication
- Service Principal
- Managed Identity

#### SQL authentication

> [!Note]
> Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about **15 minutes** after granting permission, the Purview account should have the appropriate permissions to be able to scan the resource(s).

You can follow the instructions in [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a login for Azure SQL Database if you don't have this available. You will need **username** and **password** for the next steps.

1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure SQL Database
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the **username** and **password** to setup your scan

#### Service principal and managed identity

There are several steps to allow Purview to use service principal or Purview's **managed identity** to scan your Azure SQL Database

   > [!Note]
   > Purview will need the **Application (client) ID** and the **client secret** in order to scan.

##### Create or use an existing service principal

> [!Note]
> Skip this step if you are using Purview's **managed identity**

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

- [Configure and manage Azure AD authentication with Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-configure)
- If you are using managed identity, your Purview account has its own managed identity which is basically your Purview name when you created it. You must create an Azure AD user in Azure SQL Database with the exact Purview's managed identity or your own service principal by following tutorial on [Create the service principal user in Azure SQL Database](https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-service-principal-tutorial#create-the-service-principal-user-in-azure-sql-database). You need to assign `db_owner` (**recommended**) permission to the identity. Example SQL syntax to create user and grant permission:

    ```sql
    CREATE USER [Username] FROM EXTERNAL PROVIDER
    GO
    
    EXEC sp_addrolemember 'db_owner', [Username]
    GO
    ```

    > [!Note]
    > The `Username` is your own service principal or Purview's managed identity
    
##### Add service principal to key vault and Purview's credential

> [!Note]
> If you are planning to use Purview's **managed identity**, you can skip this step because the default Purview's managed identity is already in **Purview-MSI** credential.

It is required to get the service principal's application ID and secret:

1. Navigate to your service principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to setup your scan

## Register an Azure SQL Database data source

To register a new Azure SQL Database in your data catalog, do the following:

1. Navigate to your Purview account

1. Select **Sources** on the left navigation

1. Select **Register**

1. On **Register sources**, select **Azure SQL Database**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-sql-database/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure SQL Database)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.
   1. Or, you can select **Enter manually** and enter a **Server name**.
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-sql-database/add-azure-sql-database.png" alt-text="register sources options" border="true":::

[!INCLUDE [create and manage scans](includes/manage-scans.md)]

> [!NOTE]
> Deleting your scan does not delete your assets from previous Azure SQL Database scans.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)