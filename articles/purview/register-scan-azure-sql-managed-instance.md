---
title: 'Connect to and manage Azure SQL Managed Instance'
description: This guide describes how to connect to Azure SQL Managed Instance in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Azure SQL Managed Instance source.
author: heniot
ms.author: shjia
ms.service: purview
ms.subservice: purview-data-map
ms.topic: tutorial
ms.date: 12/13/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage an Azure SQL Managed Instance in Microsoft Purview

This article outlines how to register and Azure SQL Managed Instance, as well as how to authenticate and interact with the Azure SQL Managed Instance in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|--|
| [Yes](#register) | [Yes](#scan)| [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | [Yes](create-sensitivity-label.md)| No | Limited** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md)

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You'll need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

* [Configure public endpoint in Azure SQL Managed Instance](/azure/azure-sql/managed-instance/public-endpoint-configure)

    > [!Note]
    > We now support scanning Azure SQL Managed Instances over the private connection using Microsoft Purview ingestion private endpoints and a self-hosted integration runtime VM.
    > For more information related to prerequisites, see [Connect to your Microsoft Purview and scan data sources privately and securely](./catalog-private-link-end-to-end.md)

## Register

This section describes how to register an Azure SQL Managed Instance in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

If you need to create new authentication, you need to [authorize database access to SQL Database SQL Managed Instance](/azure/azure-sql/database/logins-create-manage). There are three authentication methods that Microsoft Purview supports today:

- [System or user assigned managed identity](#system-or-user-assigned-managed-identity-to-register)
- [Service Principal](#service-principal-to-register)
- [SQL authentication](#sql-authentication-to-register)

#### System or user assigned managed identity to register

You can use either your Microsoft Purview system-assigned managed identity (SAMI), or a [user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity) (UAMI) to authenticate. Both options allow you to assign authentication directly to Microsoft Purview, like you would for any other user, group, or service principal. The Microsoft Purview system-assigned managed identity is created automatically when the account is created and has the same name as your Microsoft Purview account. A user-assigned managed identity is a resource that can be created independently. To create one, you can follow our [user-assigned managed identity guide](manage-credentials.md#create-a-user-assigned-managed-identity).

You can find your managed identity Object ID in the Azure portal by following these steps:

For Microsoft Purview account’s system-assigned managed identity: 
1. Open the Azure portal, and navigate to your Microsoft Purview account.
1. Select the **Properties** tab on the left side menu.
1. Select the **Managed identity object ID** value and copy it.

For user-assigned managed identity (preview): 
1. Open the Azure portal, and navigate to your Microsoft Purview account. 
1. Select the Managed identities tab on the left side menu 
1. Select the user assigned managed identities, select the intended identity to view the details. 
1. The object (principal) ID is displayed in the overview essential section.

Either managed identity will need permission to get metadata for the database, schemas and tables, and to query the tables for classification.
- Create an Azure AD user in Azure SQL Managed Instance by following the prerequisites and tutorial on [Create contained users mapped to Azure AD identities](/azure/azure-sql/database/authentication-aad-configure?tabs=azure-powershell#create-contained-users-mapped-to-azure-ad-identities)
- Assign `db_datareader` permission to the identity.

#### Service Principal to register

There are several steps to allow Microsoft Purview to use service principal to scan your Azure SQL Managed Instance.

#### Create or use an existing service principal

To use a service principal, you can use an existing one or create a new one. If you're going to use an existing service principal, skip to the next step.
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
- [Configure and manage Azure AD authentication with Azure SQL](/azure/azure-sql/database/authentication-aad-configure)
- Create an Azure AD user in Azure SQL Managed Instance by following the prerequisites and tutorial on [Create contained users mapped to Azure AD identities](/azure/azure-sql/database/authentication-aad-configure?tabs=azure-powershell#create-contained-users-mapped-to-azure-ad-identities)
- Assign `db_datareader` permission to the identity.

#### Add service principal to key vault and Microsoft Purview's credential

It's required to get the service principal's application ID and secret:

1. Navigate to your Service Principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault isn't connected to Microsoft Purview yet, you'll need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to set up your scan.

#### SQL authentication to register

> [!Note]
> Only the server-level principal login (created by the provisioning process) or members of the `loginmanager` database role in the master database can create new logins. It takes about **15 minutes** after granting permission, the Microsoft Purview account should have the appropriate permissions to be able to scan the resource(s).

You can follow the instructions in [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true#examples-1) to create a login for Azure SQL Managed Instance if you don't have this login available. You'll need **username** and **password** for the next steps.

1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure SQL Managed Instance
1. Select **Create** to complete
1. If your key vault isn't connected to Microsoft Purview yet, you'll need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the **username** and **password** to set up your scan.

### Steps to register

1. Open the Microsoft Purview governance portal by:

   - Browsing directly to [https://web.purview.azure.com](https://web.purview.azure.com) and selecting your Microsoft Purview account.
   - Opening the [Azure portal](https://portal.azure.com), searching for and selecting the Microsoft Purview account. Select the [**the Microsoft Purview governance portal**](https://web.purview.azure.com/) button.

1. Navigate to the **Data Map**.

1. Select **Register**

1. Select **Azure SQL Managed Instance** and then **Continue**.

1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.

1. Provide the **public endpoint fully qualified domain name** and **port number**. Then select **Register** to register the data source.

    :::image type="content" source="media/register-scan-azure-sql-managed-instance/add-azure-sql-database-managed-instance.png" alt-text="Screenshot of register sources screen, with Name, subscription, server name, and endpoint filled out.":::

    For Example: `foobar.public.123.database.windows.net,3342`

## Scan

Follow the steps below to scan an Azure SQL Managed Instance to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

To create and run a new scan, complete the following steps:

1. Select the **Data Map** tab on the left pane in the Microsoft Purview governance portal.

1. Select the Azure SQL Managed Instance source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

   :::image type="content" source="media/register-scan-azure-sql-managed-instance/set-up-scan-sql-mi.png" alt-text="Screenshot of new scan window, with the Purview MSI selected as the credential, but a service principal, or SQL authentication also available.":::

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-sql-managed-instance/scope-your-scan.png" alt-text="Screenshot of the scope your scan window, with a subset of tables selected for scanning.":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-sql-managed-instance/scan-rule-set.png" alt-text="Screenshot of scan rule set window, with the system default scan rule set selected.":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-sql-managed-instance/trigger-scan.png" alt-text="Screenshot of the set scan trigger window, with the recurring tab selected.":::

1. Review your scan and select **Save and run**.

If you're having trouble connecting to your data source, or running your scan, you scan see our [troubleshooting guide for scans and connections.](troubleshoot-connections.md)

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
