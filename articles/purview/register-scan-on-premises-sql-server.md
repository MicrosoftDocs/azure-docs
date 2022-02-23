---
title: Connect to and manage on-premises SQL server instances
description: This guide describes how to connect to on-premises SQL server instances in Azure Purview, and use Azure Purview's features to scan and manage your on-premises SQL server source.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage an on-premises SQL server instance in Azure Purview

This article outlines how to register on-premises SQL server instances, and how to authenticate and interact with an on-premises SQL server instance in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | No| Yes** |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

## Register

This section describes how to register an on-premises SQL server instance in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Authentication for registration

There is only one way to set up authentication for SQL server on-premises:

- SQL Authentication

#### SQL Authentication to register

The SQL account must have access to the **master** database. This is because the `sys.databases` is in the master database. The Azure Purview scanner needs to enumerate `sys.databases` in order to find all the SQL databases on the server.

##### Creating a new login and user

If you would like to create a new login and user to be able to scan your SQL server, follow the steps below:

> [!Note]
> All the steps below can be executed using the code provided [here](https://github.com/Azure/Purview-Samples/blob/master/TSQL-Code-Permissions/grant-access-to-on-prem-sql-databases.sql)

1. Navigate to SQL Server Management Studio (SSMS), connect to the server, navigate to security, select and hold (or right-click) on login and create New login. Make sure to select SQL authentication.

   :::image type="content" source="media/register-scan-on-premises-sql-server/create-new-login-user.png" alt-text="Create new login and user.":::

1. Select Server roles on the left navigation and ensure that public role is assigned.

1. Select User mapping on the left navigation, select all the databases in the map and select the Database role: **db_datareader**.

   :::image type="content" source="media/register-scan-on-premises-sql-server/user-mapping.png" alt-text="user mapping.":::

1. Select OK to save.

1. Navigate again to the user you created, by selecting and holding (or right-clicking) and selecting **Properties**. Enter a new password and confirm it. Select the 'Specify old password' and enter the old password. **It is required to change your password as soon as you create a new login.**

   :::image type="content" source="media/register-scan-on-premises-sql-server/change-password.png" alt-text="change password.":::

##### Storing your SQL login password in a key vault and creating a credential in Azure Purview

1. Navigate to your key vault in the Azure portal1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your SQL server login
1. Select **Create** to complete
1. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the **username** and **password** to setup your scan

### Steps to register

1. Navigate to your Azure Purview account

1. Under Sources and scanning in the left navigation, select **Integration runtimes**. Make sure a self-hosted integration runtime is set up. If it is not set up, follow the steps mentioned [here](manage-integration-runtimes.md) to create a self-hosted integration runtime for scanning on an on-premises or Azure VM that has access to your on-premises network.

1. Select **Data Map** on the left navigation.

1. Select **Register**

1. Select **SQL server** and then **Continue**

   :::image type="content" source="media/register-scan-on-premises-sql-server/set-up-sql-data-source.png" alt-text="Set up the SQL data source.":::

1. Provide a friendly name, which will be a short name you can use to identify your server, and the server endpoint.

1. Select **Finish** to register the data source.

## Scan

Follow the steps below to scan on-premises SQL server instances to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the SQL Server source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

   :::image type="content" source="media/register-scan-on-premises-sql-server/on-premises-sql-set-up-scan.png" alt-text="Set up scan":::

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-on-premises-sql-server/on-premises-sql-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-on-premises-sql-server/on-premises-sql-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-on-premises-sql-server/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
