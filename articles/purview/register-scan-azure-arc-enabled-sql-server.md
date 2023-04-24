---
title: Connect to and manage Azure Arc-enabled SQL Server
description: This guide describes how to connect to Azure Arc-enabled SQL Server in Microsoft Purview, and use Microsoft Purview features to scan and manage your Azure Arc-enabled SQL Server source.
author: heniot
ms.author: shjia
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/05/2023
ms.custom: template-how-to
---

# Connect to and manage Azure Arc-enabled SQL Server in Microsoft Purview

This article shows how to register an Azure Arc-enabled SQL Server instance. It also shows how to authenticate and interact with Azure Arc-enabled SQL Server in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register)(GA) | [Yes](#scan)(preview) | [Yes](#scan)(preview) | [Yes](#scan)(preview) | [Yes](#scan)(preview) | No | [Yes](#access-policy)(GA) | Limited** | No |

\** Lineage is supported if the dataset is used as a source/sink in the [Azure Data Factory copy activity](how-to-link-azure-data-factory.md). 

The supported SQL Server versions are 2012 and later. SQL Server Express LocalDB is not supported.

When you're scanning Azure Arc-enabled SQL Server, Microsoft Purview supports extracting the following technical metadata:

- Instances
- Databases
- Schemas
- Tables, including the columns
- Views, including the columns

When you're setting up a scan, you can choose to specify the database name to scan one database. You can further scope the scan by selecting tables and views as needed. The whole Azure Arc-enabled SQL Server instance will be scanned if you don't provide a database name.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. See [Access control in the Microsoft Purview governance portal](catalog-permissions.md) for details.

* The latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [Create and manage a self-hosted integration runtime](manage-integration-runtimes.md).

## Register

This section describes how to register an Azure Arc-enabled SQL Server instance in Microsoft Purview by using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

There are two ways to set up authentication for scanning Azure Arc-enabled SQL Server with a self-hosted integration runtime:

- Windows authentication
- SQL Server authentication

To configure authentication for the SQL Server deployment:

1. In SQL Server Management Studio (SSMS), go to **Server Properties**, and then select **Security** on the left pane. 
1. Under **Server authentication**:

   - For Windows authentication, select either **Windows Authentication mode** or **SQL Server and Windows Authentication mode**.
   - For SQL Server authentication, select **SQL Server and Windows Authentication mode**.   

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/enable-sql-server-authentication.png" alt-text="Screenshot that shows the Security page of the Server Properties window, with options for selecting authentication mode.":::

A change to the server authentication requires you to restart the SQL Server instance and SQL Server Agent. In SSMS, go to the SQL Server instance and select **Restart** on the right-click options pane.

#### Create a new login and user

If you want to create a new login and user to scan your SQL Server instance, use the following steps.

The account must have access to the master database, because `sys.databases` is in the master database. The Microsoft Purview scanner needs to enumerate `sys.databases` in order to find all the SQL databases on the server.

> [!Note]
> You can run all the following steps by using [this code](https://github.com/Azure/Purview-Samples/blob/master/TSQL-Code-Permissions/grant-access-to-on-prem-sql-databases.sql).

1. Go to SSMS, connect to the server, and then select **Security** on the left pane.

1. Select and hold (or right-click) **Login**, and then select **New login**. If Windows authentication is applied, select **Windows authentication**. If SQL Server authentication is applied, select **SQL Server authentication**.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/create-new-login-user.png" alt-text="Screenshot that shows selections for creating a new login and user.":::

1. Select **Server Roles** on the left pane, and ensure that a public role is assigned.

1. Select **User Mapping** on the left pane, select all the databases in the map, and then select the **db_datareader** database role.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/user-mapping.png" alt-text="Screenshot that shows user mapping.":::

1. Select **OK** to save.

1. If SQL Server authentication is applied, you must change your password as soon as you create a new login:

   1. Select and hold (or right-click) the user that you created, and then select **Properties**. 
   1. Enter a new password and confirm it. 
   1. Select the **Specify old password** checkbox and enter the old password.
   1. Select **OK**.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/change-password.png" alt-text="Screenshot that shows selections for changing a password.":::

#### Store your SQL Server login password in a key vault and create a credential in Microsoft Purview

1. Go to your key vault in the Azure portal. Select **Settings** > **Secrets**.
1. Select **+ Generate/Import**. For **Name** and **Value**, enter the password from your SQL Server login.
1. Select **Create**.
1. If your key vault is not connected to Microsoft Purview yet, [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account).
1. [Create a new credential](manage-credentials.md#create-a-new-credential) by using the username and password to set up your scan. 

   Be sure to select the right authentication method when you're creating a new credential. If Windows authentication is applied, select **Windows authentication**. If SQL Server authentication is applied, select **SQL Server authentication**.

### Steps to register

1. Go to your Microsoft Purview account.

1. Under **Sources and scanning** on the left pane, select **Integration runtimes**. Make sure that a self-hosted integration runtime is set up. If it isn't set up, [follow the steps to create a self-hosted integration runtime](manage-integration-runtimes.md) for scanning on an on-premises or Azure virtual machine that has access to your on-premises network.

1. Select **Data Map** on the left pane.

1. Select **Register**.

1. Select **Azure Arc-enabled SQL Server**, and then select **Continue**.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/set-up-azure-arc-enabled-sql-data-source.png" alt-text="Screenshot that shows selecting a SQL data source.":::

1. Provide a friendly name, which is a short name that you can use to identify your server. Also provide the server endpoint.

1. Select **Finish** to register the data source.

## Scan

Use the following steps to scan Azure Arc-enabled SQL Server instances to automatically identify assets and classify your data. For more information about scanning in general, see [Scans and ingestion in Microsoft Purview](concept-scans-and-ingestion.md).

To create and run a new scan:

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), select the **Data Map** tab on the left pane.

1. Select the Azure Arc-enabled SQL Server source that you registered.

1. Select **New scan**.

1. Select the credential to connect to your data source. Credentials are grouped and listed under the authentication methods.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/azure-arc-enabled-sql-set-up-scan-win-auth.png" alt-text="Screenshot that shows selecting a credential for a scan.":::

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/azure-arc-enabled-sql-scope-your-scan.png" alt-text="Screenshot that shows selected assets for scoping a scan.":::

1. Select a scan rule set. You can choose between the system default, existing custom rule sets, or creation of a new rule set inline.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/azure-arc-enabled-sql-scan-rule-set.png" alt-text="Screenshot that shows selecting a scan rule set.":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-arc-enabled-sql-server/trigger-scan.png" alt-text="Screenshot that shows setting up a recurring scan trigger.":::

1. Review your scan, and then select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Access policy

### Supported policies

The following types of policies are supported on this data resource from Microsoft Purview:

- [DevOps policies](concept-policies-devops.md)
- [Data Owner policies](concept-policies-data-owner.md) (preview)

### Access policy prerequisites on Azure Arc-enabled SQL Server

[!INCLUDE [Access policies Azure Arc-enabled SQL Server prerequisites](./includes/access-policies-prerequisites-arc-sql-server.md)]

### Configure the Microsoft Purview account for policies

[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data source and enable Data use management

Before you can create policies, you must register the Azure Arc-enabled SQL Server data source with Microsoft Purview:

1. Sign in to Microsoft Purview Studio.

1. Go to **Data map** on the left pane, select **Sources**, and then select **Register**. Enter **Azure Arc** in the search box and select **SQL Server on Azure Arc**. Then select **Continue**.

   ![Screenshot that shows selecting a source for registration.](./media/how-to-policies-data-owner-sql/select-arc-sql-server-for-registration.png)

1. For **Name**, enter a name for this registration. It's best practice to make the name of the registration the same as the server name in the next step.

1. Select values for **Azure subscription**, **Server name**, and **Server endpoint**.

1. For **Select a collection**, choose a collection to put this registration in. 

1. Enable **Data use management**. **Data use management** needs certain permissions and can affect the security of your data, because it delegates to certain Microsoft Purview roles to manage access to the data sources. Go through the secure practices related to **Data use management** in this guide: [Enable Data use management on your Microsoft Purview sources](./how-to-enable-data-use-management.md).

1. Upon enabling Data Use Management, Microsoft Purview will automatically capture the **Application ID** of the App Registration related to this Azure Arc-enabled SQL Server if one has been configured. Come back to this screen and hit the refresh button on the side of it to refresh, in case the association between the Azure Arc-enabled SQL Server and the App Registration changes in the future.

1. Select **Register** or **Apply**.

![Screenshot that shows selections for registering a data source for a policy.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-arc-sql.png)

### Enable policies in Azure Arc-enabled SQL Server
[!INCLUDE [Access policies Arc enabled SQL Server configuration](./includes/access-policies-configuration-arc-sql-server.md)]

### Create a policy

To create an access policy for Azure Arc-enabled SQL Server, follow these guides:

* [Provision access to system health, performance and audit information in SQL Server 2022](./how-to-policies-devops-arc-sql-server.md#create-a-new-devops-policy)
* [Provision read/modify access on a single SQL Server 2022](./how-to-policies-data-owner-arc-sql-server.md#create-and-publish-a-data-owner-policy)

To create policies that cover all data sources inside a resource group or Azure subscription, see [Discover and govern multiple Azure sources in Microsoft Purview](register-scan-azure-multiple-sources.md#access-policy).

## Next steps

Now that you've registered your source, use the following guides to learn more about Microsoft Purview and your data:

- [DevOps policies in Microsoft Purview](concept-policies-devops.md)
- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search the data catalog](how-to-search-catalog.md)
