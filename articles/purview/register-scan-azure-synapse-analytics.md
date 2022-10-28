---
title: 'Connect to and manage dedicated SQL pools (formerly SQL DW)'
description: This guide describes how to connect to dedicated SQL pools (formerly SQL DW) in Microsoft Purview, and use Microsoft Purview's features to scan and manage your dedicated SQL pools source.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/10/2021
ms.custom: template-how-to, ignite-fall-2021, fasttrack-edit
---

# Connect to and manage dedicated SQL pools in Microsoft Purview

This article outlines how to register dedicated SQL pools (formerly SQL DW), and how to authenticate and interact with dedicated SQL pools in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md)

> [!NOTE]
> If you are looking to register and scan a dedicated SQL database within a Synapse workspace, you must follow instructions [here](register-scan-synapse-workspace.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)| [Yes](#scan)| [Yes](#scan)| [Yes](#scan)| No | Limited** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

### Known limitations

* Microsoft Purview doesn't support over 800 columns in the Schema tab and it will show "Additional-Columns-Truncated".

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register dedicated SQL pools in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

There are three ways to set up authentication:

- [System or user assigned managed identity](#system-or-user-assigned-managed-identity-to-register) (Recommended)
- [Service Principal](#service-principal-to-register)
- [SQL authentication](#sql-authentication-to-register)

    > [!Note]
    > Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about 15 minutes after granting permission, the Microsoft Purview account should have the appropriate permissions to be able to scan the resource(s).

#### System or user assigned managed identity to register

You can use either your Microsoft Purview system-assigned managed identity (SAMI), or a [User-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity) (UAMI) to authenticate. Both options allow you to assign authentication directly to Microsoft Purview, like you would for any other user, group, or service principal. The Microsoft Purview SAMI is created automatically when the account is created. A UAMI is a resource that can be created independently, and to create one you can follow our [user-assigned managed identity guide](manage-credentials.md#create-a-user-assigned-managed-identity). Create an Azure AD user in the dedicated SQL pool using your managed identity object name by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](/azure/azure-sql/database/authentication-aad-service-principal-tutorial).

Example SQL syntax to create user and grant permission:

```sql
CREATE USER [PurviewManagedIdentity] FROM EXTERNAL PROVIDER
GO

EXEC sp_addrolemember 'db_datareader', [PurviewManagedIdentity]
GO
```

The authentication must have permission to get metadata for the database, schemas, and tables. It must also be able to query the tables to sample for classification. The recommendation is to assign `db_datareader` permission to the identity.

#### Service Principal to register

To use service principal authentication for scans, you can use an existing one or create a new one.

If you need to create a new Service Principal, follow these steps:
 1. Navigate to the [Azure portal](https://portal.azure.com).
 1. Select **Azure Active Directory** from the left-hand side menu.
 1. 1. Select **App registrations**.
 1. Select **+ New application registration**.
 1. Enter a name for the **application** (the service principal name).
 1. Select **Accounts in this organizational directory only**.
 1. For Redirect URI, select **Web** and enter any URL you want; it doesn't have to be real or work.
 1. Then select **Register**.

It is required to get the Service Principal's application ID and secret:

1. Navigate to your Service Principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault is not connected to Microsoft Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to set up your scan.

##### Granting the Service Principal access

In addition, you must also create an Azure AD user in the dedicated pool by following the prerequisites and tutorial on [Create Azure AD users using Azure AD applications](/azure/azure-sql/database/authentication-aad-service-principal-tutorial). Example SQL syntax to create user and grant permission:

```sql
CREATE USER [ServicePrincipalName] FROM EXTERNAL PROVIDER
GO

ALTER ROLE db_datareader ADD MEMBER [ServicePrincipalName]
GO
```

> [!Note]
> Microsoft Purview will need the **Application (client) ID** and the **client secret** in order to scan.

#### SQL authentication to register

You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true#examples-1) to create a login for your dedicated SQL pool (formerly SQL DW) if you don't already have one.

When authentication method selected is **SQL Authentication**, you need to get your password and store in the key vault:

1. Get the password for your SQL login
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* for your SQL login
1. Select **Create** to complete
1. If your key vault is not connected to Microsoft Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to set up your scan.

### Steps to register

To register a new SQL dedicated pool in Microsoft Purview, complete the following steps:

1. Navigate to your Microsoft Purview account.
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On **Register sources**, select **Azure Dedicated SQL Pool (formerly SQL DW)**.
1. Select **Continue**

On the **Register sources** screen, complete the following steps:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your Azure subscription to filter down dedicated SQL pools.
3. Select your dedicated SQL pool.
4. Select a collection or create a new one (Optional).
5. Select **Register** to register the data source.

## Scan

Follow the steps below to scan dedicated SQL pools to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, complete the following steps:

1. Select the **Data Map** tab on the left pane in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Select the SQL dedicated pool source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

   :::image type="content" source="media/register-scan-azure-synapse-analytics/sql-dedicated-pool-set-up-scan.png" alt-text="Set up scan":::

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-synapse-analytics/scope-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-synapse-analytics/select-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-synapse-analytics/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
