---
title: 'How to scan Azure Synapse Analytics'
description: This how to guide describes details of how to scan Azure Synapse Analytics. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 10/22/2020
---
# Register and scan Azure Synapse Analytics

This article discusses how to register and scan an instance of Azure Synapse Analytics (formerly SQL DW) in Purview.

## Supported capabilities

Azure Synapse Analytics (formerly SQL DW) supports full and incremental scans to capture the metadata and schema. Scans also classify the data automatically based on system and custom classification rules.

### Known limitations

Azure Purview doesn't support scanning of [views](/sql/relational-databases/views/views?view=azure-sqldw-latest&preserve-view=true) in Azure Synapse Analytics

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be an Azure Purview Data Source Admin
- Networking access between the Purview account and Azure Synapse Analytics.
 
## Setting up authentication for a scan

There are three ways to set up authentication for Azure Synapse Analytics:

- Managed Identity
- SQL Authentication
- Service Principal

    > [!Note]
    > Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about 15 minutes after granting permission, the Purview account should have the appropriate permissions to be able to scan the resource(s).

### Managed Identity (Recommended) 
   
Your Purview account has its own Managed Identity which is basically your Purview name when you created it. You must create an Azure AD user in Azure Synapse Analytics (formerly SQL DW) with the exact Purview's Managed Identity name by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](../azure-sql/database/authentication-aad-service-principal-tutorial.md).

Example SQL syntax to create user and grant permission:

```sql
CREATE USER [PurviewManagedIdentity] FROM EXTERNAL PROVIDER
GO

EXEC sp_addrolemember 'db_owner', [PurviewManagedIdentity]
GO
```

The authentication must have permission to get metadata for the database, schemas and tables. It must also be able to query the tables to sample for classification. The recommendation is to assign `db_owner` permission to the identity.

### Service Principal

To use service principal authentication for scans, you can use an existing one or create a new one. 

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

It is required to get the Service Principal's application ID and secret:

1. Navigate to your Service Principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to setup your scan 

#### Granting the Service Principal access to your Azure Synapse Analytics (formerly SQL DW)

In addition, you must also create an Azure AD user in Azure Synapse Analytics by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](../azure-sql/database/authentication-aad-service-principal-tutorial.md). Example SQL syntax to create user and grant permission:

```sql
CREATE USER [ServicePrincipalName] FROM EXTERNAL PROVIDER
GO

ALTER ROLE db_owner ADD MEMBER [ServicePrincipalName]
GO
```

> [!Note]
> Purview will need the **Application (client) ID** and the **client secret** in order to scan.

### SQL authentication

You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true#examples-1) to create a login for Azure Synapse Analytics (formerly SQL DW) if you don't already have one.

When authentication method selected is **SQL Authentication**, you need to get your password and store in the key vault:

1. Get the password for your SQL login
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* for your SQL login
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to setup your scan

## Register an Azure Synapse Analytics instance (formerly SQL DW)

To register a new Azure Synapse Analytics server in your Data Catalog, do the following:

1. Navigate to your Purview account
1. Select **Sources** on the left navigation
1. Select **Register**
1. On **Register sources**, select **Azure Synapse Analytics (formerly SQL DW)**
1. Select **Continue**

On the **Register sources (Azure Synapse Analytics)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired logical SQL Server:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop down box and the appropriate server from the **Server name** drop down box.
   1. Or, you can select **Enter manually** and enter a **Server name**.
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-synapse-analytics/register-sources.png" alt-text="register sources options" border="true":::

[!INCLUDE [create and manage scans](includes/manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
