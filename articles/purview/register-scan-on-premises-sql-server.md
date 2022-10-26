---
title: Connect to and manage on-premises SQL server instances
description: This guide describes how to connect to on-premises SQL server instances in Microsoft Purview, and use Microsoft Purview's features to scan and manage your on-premises SQL server source.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage an on-premises SQL server instance in Microsoft Purview

This article outlines how to register on-premises SQL server instances, and how to authenticate and interact with an on-premises SQL server instance in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | No| Limited** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

The supported SQL Server versions are 2005 and above. SQL Server Express LocalDB is not supported.

When scanning on-premises SQL server, Microsoft Purview supports:

- Extracting technical metadata including:

    - Instance
    - Databases
    - Schemas
    - Tables including the columns
    - Views including the columns

When setting up scan, you can choose to specify the database name to scan one database, and you can further scope the scan by selecting tables and views as needed. The whole SQL Server instance will be scanned if database name is not provided.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

## Register

This section describes how to register an on-premises SQL server instance in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

There are two ways to set up authentication for SQL server on-premises:

- SQL Authentication
- Windows Authentication

#### Set up SQL server authentication

If SQL Authentication is applied, ensure the SQL Server deployment is configured to allow SQL Server and Windows Authentication.

To enable this, within SQL Server Management Studio (SSMS), navigate to "Server Properties" and change from "Windows Authentication Mode" to "SQL Server and Windows Authentication mode".

:::image type="content" source="media/register-scan-on-premises-sql-server/enable-sql-server-authentication.png" alt-text="The Server Properties window is open with the security page selected. Under Server authentication, S Q L Server and Windows Authentication mode is selected.":::

If Windows Authentication is applied, configure the SQL Server deployment to use Windows Authentication mode.

A change to the Server Authentication will require a restart of the SQL Server Instance and SQL Server Agent, this can be triggered within SSMS by navigating to the SQL Server instance and selecting "Restart" within the right-click options pane.

##### Creating a new login and user

If you would like to create a new login and user to be able to scan your SQL server, follow the steps below:

The account must have access to the **master** database. This is because the `sys.databases` is in the master database. The Microsoft Purview scanner needs to enumerate `sys.databases` in order to find all the SQL databases on the server.

> [!Note]
> All the steps below can be executed using the code provided [here](https://github.com/Azure/Purview-Samples/blob/master/TSQL-Code-Permissions/grant-access-to-on-prem-sql-databases.sql)

1. Navigate to SQL Server Management Studio (SSMS), connect to the server, navigate to security, select and hold (or right-click) on login and create New login. If Windows Authentication is applied, select "Windows authentication". If SQL Authentication is applied, make sure to select "SQL authentication".

   :::image type="content" source="media/register-scan-on-premises-sql-server/create-new-login-user.png" alt-text="Create new login and user.":::

1. Select Server roles on the left navigation and ensure that public role is assigned.

1. Select User mapping on the left navigation, select all the databases in the map and select the Database role: **db_datareader**.

   :::image type="content" source="media/register-scan-on-premises-sql-server/user-mapping.png" alt-text="user mapping.":::

1. Select OK to save.

1. If SQL Authentication is applied, navigate again to the user you created, by selecting and holding (or right-clicking) and selecting **Properties**. Enter a new password and confirm it. Select the 'Specify old password' and enter the old password. **It is required to change your password as soon as you create a new login.**

   :::image type="content" source="media/register-scan-on-premises-sql-server/change-password.png" alt-text="change password.":::

##### Storing your SQL login password in a key vault and creating a credential in Microsoft Purview

1. Navigate to your key vault in the Azure portal1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your SQL server login
1. Select **Create** to complete
1. If your key vault is not connected to Microsoft Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the **username** and **password** to set up your scan. Make sure the right authentication method is selected when creating a new credential. If SQL Authentication is applied, select "SQL authentication" as the authentication method. If Windows Authentication is applied, then select "Windows authentication".

### Steps to register

1. Navigate to your Microsoft Purview account

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

1. Select the **Data Map** tab on the left pane in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Select the SQL Server source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source. The credentials are grouped and listed under different authentication methods.

   :::image type="content" source="media/register-scan-on-premises-sql-server/on-premises-sql-set-up-scan-win-auth.png" alt-text="Set up scan":::

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-on-premises-sql-server/on-premises-sql-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-on-premises-sql-server/on-premises-sql-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-on-premises-sql-server/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
