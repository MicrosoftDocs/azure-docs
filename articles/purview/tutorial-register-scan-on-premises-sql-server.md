---
title: Register and scan an on-premises SQL server.
description: This tutorial describes how to scan on-prem SQL server using a self-hosted IR. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 09/15/2021
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Register and scan an on-premises SQL server

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

[Add your introductory paragraph]

<!-- 3. Tutorial outline 
Required. Use the format provided in the list below.
-->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Sign in to the Purview Studio.
> * Create a collection in Azure Purview.
> * Create a self-hosted integration runtime.
> * Store credentials in an Azure Key Vault.
> * Register an on-premises SQL Server to your collection.
> * Scan the SQL Server.
> * Browse your data catalog to view assets in your SQL Server.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active [Azure Key Vault](../key-vault/certificates/quick-create-portal.md#create-a-vault).
- An Azure Purview account. If you don't already have one, you can [follow our quickstart guide to create one](create-catalog-portal.md).
- An [on-premises SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads).

## Sign in to Purview Studio

In order to create and manage collections in Purview, you will need to be a **Collection Admin** within Purview. We can check these permissions in the [Purview Studio](use-purview-studio.md). You can find the studio by going to your Purview resource in the [Azure portal](https://portal.azure.com), and selecting the **Open Purview Studio** tile on the overview page.

<!-- Add a screenshot -->

## Create a collection
<!-- Introduction paragraph -->

### Check permissions

In order to create and manage collections in Purview, you will need to be a **Collection Admin** within Purview. We can check these permissions in the [Purview Studio](use-purview-studio.md). You can find the studio by going to your Purview resource in the [Azure portal](https://portal.azure.com), and selecting the Open Purview Studio tile on the overview page.

1. Select Data Map > Collections from the left pane to open collection management page.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/find-collections.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the Collections tab selected." border="true":::

1. Select your root collection. This is the top collection in your collection list and will have the same name as your Purview resource. In our example below, it is called Contoso Purview. Alternatively, if collections already exist you can select any collection where you want to create a subcollection.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/select-root-collection.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the root collection highlighted." border="true":::

1. Select **Role assignments** in the collection window.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/role-assignments.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the role assignments tab highlighted." border="true":::

1. To create a collection, you will need to be in the collection admin list under role assignments. If you created the Purview resource, you should be listed as a collection admin under the root collection already. If not, you will need to contact the collection admin to grant you permission.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/collection-admins.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the collection admin section highlighted." border="true":::

### Create a collection

1. Select Data Map > Collections from the left pane to open collection management page.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/find-collections.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the Collections tab selected and open." border="true":::

1. Select **+ Add a collection**. Again, note that only [collection admins](#check-permissions) can manage collections.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/select-add-a-collection.png" alt-text="Screenshot of Purview studio window, showing the new collection window, with the add a collection buttons highlighted." border="true":::

1. In the right panel, enter the collection name and description. If needed you can also add users or groups as collection admins to the new collection.
1. Select **Create**.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/create-collection.png" alt-text="Screenshot of Purview studio window, showing the new collection window, with a display name and collection admins selected, and the create button highlighted." border="true":::

1. The new collection's information will reflect on the page.
<!-- Fix Image -->
    :::image type="content" source="./media/how-to-create-and-manage-collections/created-collection.png" alt-text="Screenshot of Purview studio window, showing the newly created collection window." border="true":::

## Create a self-hosted integration runtime
<!-- Introduction paragraph -->

This tutorial assumes the machine where you'll install your self-hosted integration runtime is able to make network connections to the internet. If your machine has a restricted firewall, or if you would like to secure your firewall, look into the [network requirements for the self-hosted integration runtime](manage-integration-runtimes.md#networking-requirements).

1. On the home page of Purview Studio, select **Data Map** from the left navigation pane.

1. Under **Source management** on the left pane, select **Integration runtimes**, and then select **+ New**.

      :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-integration-runtime.png" alt-text="Select the Integration Runtimes button.":::

1. On the **Integration runtime setup** page, select **Self-Hosted** to create a Self-Hosted IR, and then select **Continue**.
<!-- Fix Image -->
   :::image type="content" source="media/manage-integration-runtimes/select-self-hosted-ir.png" alt-text="Create new SHIR.":::

1. Enter a name for your IR, and select Create.

1. On the **Integration Runtime settings** page, follow the steps under the **Manual setup** section. You will have to download the integration runtime from the download site onto a VM or machine where you intend to run it.
<!-- Fix Image -->
   :::image type="content" source="media/manage-integration-runtimes/integration-runtime-settings.png" alt-text="get key":::

   - Copy and paste the authentication key.

   - Download the self-hosted integration runtime from [Microsoft Integration Runtime](https://www.microsoft.com/download/details.aspx?id=39717) on a local Windows machine. Run the installer. Self-hosted integration runtime versions such as 5.4.7803.1 and 5.6.7795.1 are supported. 

   - On the **Register Integration Runtime (Self-hosted)** page, paste one of the two keys you saved earlier, and select **Register**.
<!-- Fix Image -->
     :::image type="content" source="media/manage-integration-runtimes/register-integration-runtime.png" alt-text="input key.":::

   - On the **New Integration Runtime (Self-hosted) Node** page, select **Finish**.

1. After the Self-hosted integration runtime is registered successfully, you see the following window:
<!-- Fix Image -->
   :::image type="content" source="media/manage-integration-runtimes/successfully-registered.png" alt-text="successfully registered.":::

## Set up SQL authentication

There is only one way to set up authentication for SQL server on-premises:

- SQL Authentication

### SQL authentication

The SQL account must have access to the **master** database. This is because the `sys.databases` is in the master database. The Purview scanner needs to enumerate `sys.databases` in order to find all the SQL databases on the server.

#### Using an existing server administrator

If you plan to use an existing server admin (sa) user to scan your on-premises SQL server, ensure the following:

1. `sa` is not a Windows authentication account.

1. The server level login that you are planning to use must have server roles of public and sysadmin. You can verify this by connecting to the server, navigating to SQL Server Management Studio (SSMS), navigating to security, selecting the login you are planning to use, right-clicking **Properties** and then selecting **Server roles**.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/server-level-login.png" alt-text="Server level login.":::

#### Creating a new login and user

If you would like to create a new login and user to be able to scan your SQL server, follow the steps below:

> [!Note]
   > All the steps below can be executed using the code provided [here](https://github.com/Azure/Purview-Samples/blob/master/TSQL-Code-Permissions/grant-access-to-on-prem-sql-databases.sql)

1. Navigate to SQL Server Management Studio (SSMS), connect to the server, navigate to security, right-click on login and create New login. Make sure to select SQL authentication.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/create-new-login-user.png" alt-text="Create new login and user.":::

1. Select Server roles on the left navigation and ensure that public role is assigned.

1. Select User mapping on the left navigation, select all the databases in the map and select the Database role: **db_datareader**.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/user-mapping.png" alt-text="user mapping.":::

1. Click OK to save.

1. Navigate again to the user you created, by right clicking and selecting **Properties**. Enter a new password and confirm it. Select the 'Specify old password' and enter the old password. **It is required to change your password as soon as you create a new login.**

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/change-password.png" alt-text="change password.":::

#### Storing your SQL login password in a key vault and creating a credential in Purview

1. Navigate to your key vault in the Azure portal. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your SQL server login
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. In Azure Purview, go to the Credentials page.
<!-- Add Image-->
1. Create your new Credential by selecting **+ New**.

1. Provide the required information. Select the **Authentication method** and a **Key Vault connection** from which to select a secret from.

1. Once all the details have been filled in, select **Create**.
<!-- Fix Image -->
   :::image type="content" source="media/manage-credentials/new-credential.png" alt-text="New credential":::

1. Verify that your new credential shows up in the list view and is ready to use.
<!-- Fix Image -->
   :::image type="content" source="media/manage-credentials/view-credentials.png" alt-text="View credential":::

## Register SQL Server

1. Navigate to your Purview acccount in the [Azure portal](https://portal.azure.com), and select select the [Purview Studio](#sign-in-to-purview-studio).

1. Under Sources and scanning in the left navigation, select **Integration runtimes**. Make sure a self-hosted integration runtime is set up. If it is not set up, follow the steps mentioned [here](manage-integration-runtimes.md) to create a self-hosted integration runtime for scanning on an on-premises or Azure VM that has access to your on-premises network.

1. Select **Data Map** on the left navigation.

1. Select **Register**

1. Select **SQL server** and then **Continue**

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/set-up-sql-data-source.png" alt-text="Set up the SQL data source.":::

1. Provide a friendly name and server endpoint and then select **Finish** to register the data source. If, for example, your SQL server FQDN is **foobar.database.windows.net**, then enter *foobar* as the server endpoint.

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the Purview Studio.

1. Select the SQL Server source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/on-premises-sql-set-up-scan.png" alt-text="Set up scan":::

1. You can scope your scan to specific tables by choosing the appropriate items in the list.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/on-premises-sql-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/on-premises-sql-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Remove SHIR from Purview -->
<!-- 7. Delete Purview Resource -->
<!-- 7. Remove SQL Credentials from Key Vault -->
<!-- 7. Uninstall SHIR -->

### Remove SHIR from Purview

1. On the home page of Purview Studio, select **Data Map** from the left navigation pane.

1. Under **Source management** on the left pane, select **Integration runtimes**.

      :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/select-integration-runtime.png" alt-text="Select the Integration Runtimes button.":::

1. Select the checkbox next to your integration runtime, then select the **delete** button.

<!-- 7. Add image -->

### Remove SQL Credentials

### Uninstall self-hosted integration runtime

1. Log in to the machine where your self-hosted integration runtime is installed.
1. Open the control panel, and under *Uninstall a Program* search for "Microsoft Integration Runtime"

1. Uninstall the existing integration runtime.

[!IMPORTANT] In the following process, select Yes. Do not keep data during the uninstallation process.
<!-- Fix Image -->
:::image type="content" source="media/self-hosted-integration-runtime-troubleshoot-guide/delete-data.png" alt-text="Screenshot of the "Yes" button for deleting all user data from the integration runtime.":::

### Delete Purview account

If you would like to delete your Purview account after completing this tutorial, follow these steps.

1. Go to the [Azure portal](https://portal.azure.com) and navigate to your purview account.

1. At the top of the page, select the **Delete** button.

   :::image type="content" source="media/tutorial-register-scan-on-premises-sql-server/trigger-scan.png" alt-text="Delete button on the Purview account page in the azure portal is selected.":::

1. When the process is complete, you will receive a notification in the Azure Portal.

## Next steps

> [!div class="nextstepaction"]
> [Use Purview REST APIs](tutorial-using-rest-apis.md)