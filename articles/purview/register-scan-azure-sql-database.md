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

1. Authentication to scan Azure SQL Database. There are three authentication methods that Purview supports today:

   > [!Note]
   > Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about 15 minutes after granting permission, the Purview account should have the appropriate permissions to be able to scan the resource(s).

   1. **SQL authentication:** You can follow the instructions in [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a login for Azure SQL Database. 

   1. **Service Principal:** You need to [create an Azure AD application and service principal that can access resources if you don't have one already](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal). In addition, you must also create an Azure AD user in Azure SQL Database by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-service-principal-tutorial). Example SQL syntax to create user and grant permission:

      ```sql
      CREATE USER [ServicePrincipalName] FROM EXTERNAL PROVIDER
      GO

      EXEC sp_addrolemember 'db_owner', [ServicePrincipalName]
      GO
      ```

      > [!Note]
      > Purview will need the **Application (client) ID** and the **client secret** in order to scan.

   1. **Managed Identity:** Your Purview account has its own Managed Identity which is basically your Purview name when you created it. You must create an Azure AD user in Azure SQL Database with the exact Babylon's Managed Identity name by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-service-principal-tutorial). Example SQL syntax to create user and grant permission:

      ```sql
      CREATE USER [BabylonManagedIdentity] FROM EXTERNAL PROVIDER
      GO

      EXEC sp_addrolemember 'db_owner', [BabylonManagedIdentity]
      GO
      ```

1. The authentication must have permission to get metadata for the database, schemas and tables. It must also be able to query the tables to sample for classification. The recommendation is to assign `db_owner` permission to the identity.

## Register an Azure SQL Database data source

To register a new Azure SQL Database in your data catalog, do the following:

1. Navigate to your Purview Data Catalog.
1. Select **Management center** on the left navigation.
1. Select **Data sources** under **Sources and scanning**.
1. Select **+ New**.
1. On **Register sources**, select **Azure SQL Database**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-files/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure SQL Database)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.
   1. Or, you can select **Enter manually** and enter a **Server name**.
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-files/register-sources.png" alt-text="register sources options" border="true":::

[!INCLUDE [create and manage scans](includes/manage-scans.md)]

> [!NOTE]
> Deleting your scan does not delete your assets from previous Azure SQL Database scans.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)