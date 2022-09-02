---
title: 'Tutorial: Register and scan an on-premises SQL Server'
description: This tutorial describes how to register an on-prem SQL Server to Microsoft Purview, and scan the server using a self-hosted IR. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 09/27/2021
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Register and scan an on-premises SQL Server

Microsoft Purview is designed to connect to data sources to help you manage sensitive data, simplify data discovery, and ensure right use. Microsoft Purview can connect to sources across your entire landscape, including multi-cloud and on-premises. For this scenario, you'll use a self-hosted integration runtime to connect to data on an on-premises SQL server. Then you'll use Microsoft Purview to scan and classify that data.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Sign in to the Microsoft Purview governance portal.
> * Create a collection in Microsoft Purview.
> * Create a self-hosted integration runtime.
> * Store credentials in an Azure Key Vault.
> * Register an on-premises SQL Server to Microsoft Purview.
> * Scan the SQL Server.
> * Browse your data catalog to view assets in your SQL Server.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active [Azure Key Vault](../key-vault/general/quick-create-portal.md).
- A Microsoft Purview account. If you don't already have one, you can [follow our quickstart guide to create one](create-catalog-portal.md).
- An [on-premises SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads).

## Sign in to the Microsoft Purview governance portal

To interact with Microsoft Purview, you'll connect to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/) through the Azure portal. You can find the studio by going to your Microsoft Purview account in the [Azure portal](https://portal.azure.com), and selecting the **Open Microsoft Purview governance portal** tile on the overview page.

:::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/open-purview-studio.png" alt-text="Screenshot of Microsoft Purview window in Azure portal, with the Microsoft Purview governance portal button highlighted." border="true":::

## Create a collection

Collections in Microsoft Purview are used to organize assets and sources into a custom hierarchy for organization and discoverability. They're also the tool used to manage access across Microsoft Purview. In this tutorial, we'll create one collection to house your SQL Server source and all its assets. This tutorial won't cover information about assigning permissions to other users, so for more information you can follow our [Microsoft Purview permissions guide](catalog-permissions.md).

### Check permissions

To create and manage collections in Microsoft Purview, you'll need to be a **Collection Admin** within Microsoft Purview. We can check these permissions in the [Microsoft Purview governance portal](use-azure-purview-studio.md).

1. Select **Data Map > Collections** from the left pane to open the collection management page.

    :::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/find-collections.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the Collections tab selected." border="true":::

1. Select your root collection. The root collection is the top collection in your collection list and will have the same name as your Microsoft Purview account. In our example below, it is called Microsoft Purview Account.

    :::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/select-root-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the root collection highlighted." border="true":::

1. Select **Role assignments** in the collection window.

    :::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/role-assignments.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the role assignments tab highlighted." border="true":::

1. To create a collection, you'll need to be in the collection admin list under role assignments. If you created the Microsoft Purview account, you should be listed as a collection admin under the root collection already. If not, you'll need to contact the collection admin to grant you permission.

    :::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/collection-admins.png" alt-text="Screenshot of the Microsoft Purview governance portal window, opened to the Data Map, with the collection admin section highlighted." border="true":::

### Create the collection

1. Select **+ Add a collection**. Again, only [collection admins](#check-permissions) can manage collections.

    :::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/select-add-a-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, showing the new collection window, with the 'add a collection' buttons highlighted." border="true":::

1. In the right panel, enter the collection name and description. If needed you can also add users or groups as collection admins to the new collection.
1. Select **Create**.

    :::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/create-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, showing the new collection window, with a display name and collection admins selected, and the create button highlighted." border="true":::

1. The new collection's information will reflect on the page.

    :::image type="content" source="./media/tutorial-register-scan-on-premises-sql-server/created-collection.png" alt-text="Screenshot of the Microsoft Purview governance portal window, showing the newly created collection window." border="true":::

## Create a self-hosted integration runtime

The Self-Hosted Integration Runtime (SHIR) is the compute infrastructure used by Microsoft Purview to connect to on-premises data sources. The SHIR is downloaded and installed on a machine within the same network as the on-premises data source.

This tutorial assumes the machine where you'll install your self-hosted integration runtime can make network connections to the internet. This connection allows the SHIR to communicate between your source and Microsoft Purview. If your machine has a restricted firewall, or if you would like to secure your firewall, look into the [network requirements for the self-hosted integration runtime](manage-integration-runtimes.md#networking-requirements).

1. On the home page of the Microsoft Purview governance portal, select **Data Map** from the left navigation pane.

1. Under **Source management** on the left pane, select **Integration runtimes**, and then select **+ New**.

      :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-integration-runtime.png" alt-text="Select the Integration Runtimes button.":::

1. On the **Integration runtime setup** page, select **Self-Hosted** to create a Self-Hosted IR, and then select **Continue**.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-self-hosted-ir.png" alt-text="Create new SHIR.":::

1. Enter a name for your IR, and select Create.

1. On the **Integration Runtime settings** page, follow the steps under the **Manual setup** section. You'll have to download the integration runtime from the download site onto a VM or machine that is in the same network as your on-premises SQL Server. For information about the kind of machine needed, you can follow our [guide to manage integration runtimes](manage-integration-runtimes.md#prerequisites).

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/integration-runtime-settings.png" alt-text="get key":::

   - Copy and paste the authentication key.

   - Download the self-hosted integration runtime from [Microsoft Integration Runtime](https://www.microsoft.com/download/details.aspx?id=39717) on a local Windows machine. Run the installer. Self-hosted integration runtime versions such as 5.4.7803.1 and 5.6.7795.1 are supported. 

   - On the **Register Integration Runtime (Self-hosted)** page, paste one of the two keys you saved earlier, and select **Register**.

     :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/register-integration-runtime.png" alt-text="input key.":::

   - On the **New Integration Runtime (Self-hosted) Node** page, select **Finish**.

1. After the Self-hosted integration runtime is registered successfully, you'll see this window:

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/successfully-registered.png" alt-text="successfully registered.":::

## Set up SQL authentication

There is only one way to set up authentication for SQL server on-premises:

- SQL Authentication

### SQL authentication

The SQL account must have access to the **master** database. This is because the `sys.databases` is in the database. The Microsoft Purview scanner needs to enumerate `sys.databases` in order to find all the SQL databases on the server.

#### Create a new login and user

If you would like to create a new login and user to be able to scan your SQL server, follow the steps below:

> [!Note]
> All the steps below can be executed using the code provided [here](https://github.com/Azure/Purview-Samples/blob/master/TSQL-Code-Permissions/grant-access-to-on-prem-sql-databases.sql).

1. Navigate to SQL Server Management Studio (SSMS), connect to the server, navigate to security, select and hold (or right-click) login and create New login. Make sure to select SQL authentication.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/create-new-login-user.png" alt-text="Create new login and user.":::

1. Select Server roles on the left navigation and ensure that public role is assigned.

1. Select User mapping on the left navigation, select all the databases in the map and select the Database role: **db_datareader**.

1. Select **OK** to save.

1. Navigate again to the user you created, by selecting and holding (or right-clicking) on the user and selecting **Properties**. Enter a new password and confirm it. Select the 'Specify old password' and enter the old password. **It's required to change your password as soon as you create a new login.**

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/change-password.png" alt-text="change password.":::

#### Create a Key Vault credential

1. Navigate to your key vault in the Azure portal. Select **Settings > Secrets**.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-secrets.png" alt-text="Select Secrets from Left Menu":::

1. Select **+ Generate/Import**

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-generate-import.png" alt-text="Select Generate/Import from the top menu.":::

1. For upload options, select **Manual** and enter the **Name** and **Value** as the *password* from your SQL server login. Ensure **Enabled** is set to **Yes**. If you set an activation and expiration date, ensure that today's date is between the two, or you won't be able to use the credential.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/create-credential-secret.png" alt-text="Add values to key vault credential.":::

1. Select **Create** to complete.
1. In the [Microsoft Purview governance portal](#sign-in-to-the-microsoft-purview-governance-portal), navigate to the **Management** page in the left menu.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-management.png" alt-text="Select Management page on left menu.":::

1. Select the **Credentials** page.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-credentials.png" alt-text="The credentials button on the Management page is highlighted.":::

1. From the **Credentials** page, select **Manage Key Vault connections**.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/manage-key-vault-connections.png" alt-text="Manage Azure Key Vault connections.":::

1. Select **+ New** from the Manage Key Vault connections page.

1. Provide the required information, then select **Create**.

1. Confirm that your Key Vault has been successfully associated with your Microsoft Purview account as shown in this example:

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/view-kv-connections.png" alt-text="View Azure Key Vault connections to confirm.":::

1. Create a new Credential for SQL Server by selecting **+ New**.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-new.png" alt-text="Select +New to create credential.":::

1. Provide the required information. Select the **Authentication method** and a **Key Vault connection** from which to select a secret from.

1. Once all the details have been filled in, select **Create**.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/new-credential.png" alt-text="New credential":::

1. Verify that your new credential shows up in the list view and is ready to use.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/view-credentials.png" alt-text="View credential":::

## Register SQL Server

1. Navigate to your Microsoft Purview account in the [Azure portal](https://portal.azure.com), and select the [Microsoft Purview governance portal](#sign-in-to-the-microsoft-purview-governance-portal).

1. Under Sources and scanning in the left navigation, select **Integration runtimes**. Make sure a self-hosted integration runtime is set up. If it's not set up, follow the steps mentioned [here](manage-integration-runtimes.md) to create a self-hosted integration runtime for scanning on an on-premises or Azure VM that has access to your on-premises network.

1. Select **Data Map** on the left navigation.

1. Select **Register**

1. Select **SQL server** and then **Continue**

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/set-up-sql-data-source.png" alt-text="Set up the SQL data source.":::

1. Provide a friendly name and server endpoint and then select **Finish** to register the data source. If, for example, your SQL server FQDN is **foobar.database.windows.net**, then enter *foobar* as the server endpoint.

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the Microsoft Purview governance portal.

1. Select the SQL Server source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/on-premises-sql-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/on-premises-sql-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Clean up resources

If you're not going to continue to use this Microsoft Purview or SQL source moving forward, you can follow the steps below to delete the integration runtime, SQL credential, and purview resources.

### Remove SHIR from Microsoft Purview

1. On the home page of [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/), select **Data Map** from the left navigation pane.

1. Under **Source management** on the left pane, select **Integration runtimes**.

      :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-integration-runtime.png" alt-text="Select the Integration Runtimes button.":::

1. Select the checkbox next to your integration runtime, then select the **delete** button.

      :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/delete-integration-runtime.png" alt-text="Check box next to integration runtime and delete button highlighted.":::

1. Select **Confirm** on the next window to confirm the delete.

1. The window will self-refresh and you should no longer see your SHIR listed under Integration runtimes.

### Uninstall self-hosted integration runtime

1. Sign in to the machine where your self-hosted integration runtime is installed.
1. Open the control panel, and under *Uninstall a Program* search for "Microsoft Integration Runtime"

1. Uninstall the existing integration runtime.

> [!IMPORTANT] 
> In the following process, select Yes. Do not keep data during the uninstallation process.

:::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-yes.png" alt-text="Screenshot of the 'Yes' button for deleting all user data from the integration runtime.":::

### Remove SQL credentials

1. Go to the [Azure portal](https://portal.azure.com) and navigate to the Key Vault resource where you stored your Microsoft Purview credentials.

1. Under **Settings** in the left menu, select **Secrets**

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-secrets.png" alt-text="Select Secrets from Left Menu in Azure Key Vault.":::

1. Select the SQL Server credential secret you created for this tutorial.
1. Select **Delete**

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-delete-credential.png" alt-text="Delete Secret from top Menu in Azure Key Vault Secret.":::

1. Select **Yes** to permanently delete the resource.

### Delete Microsoft Purview account

If you would like to delete your Microsoft Purview account after completing this tutorial, follow these steps.

1. Go to the [Azure portal](https://portal.azure.com) and navigate to your purview account.

1. At the top of the page, select the **Delete** button.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-delete.png" alt-text="Delete button on the Microsoft Purview account page in the Azure portal is selected.":::

1. When the process is complete, you'll receive a notification in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Use Microsoft Purview REST APIs](tutorial-using-rest-apis.md)