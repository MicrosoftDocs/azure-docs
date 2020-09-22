---
title: Manage Azure Cosmos DB resources by using Azure Storage Explorer
description: Learn how to connect to Azure Cosmos DB and manage its resources by using Azure Storage Explorer.
author: deborahc
ms.service: cosmos-db
ms.topic: how-to
ms.date: 08/24/2020
ms.author: dech
ms.custom: seodec18, has-adal-ref
---
# Manage Azure Cosmos DB resources by using Azure Storage Explorer

You can use Azure Storage explorer to connect to Azure Cosmos DB. It lets you connect to Azure Cosmos DB accounts hosted on Azure and sovereign clouds from Windows, macOS, or Linux.

Use the same tool to manage your different Azure entities in one place. You can manage Azure Cosmos DB entities, manipulate data, update stored procedures and triggers along with other Azure entities like storage blobs and queues.

Azure Storage Explorer supports Cosmos accounts configured for SQL, MongoDB, Graph, and Table APIs. Go to [Azure Cosmos DB in Azure Storage Explorer](https://docs.microsoft.com/azure/cosmos-db/storage-explorer) for more information.

## Prerequisites

A Cosmos account with a SQL API or an Azure Cosmos DB API for MongoDB. If you don't have an account, you can create one in the Azure portal. See [Azure Cosmos DB: Build a SQL API web app with .NET and the Azure portal](create-sql-api-dotnet.md) for more information.

## Installation

To install the newest Azure Storage Explorer bits, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). We support Windows, Linux, and macOS versions.

## Connect to an Azure subscription

1. After you install **Azure Storage Explorer**, select the **plug-in** icon on the left pane.

   :::image type="content" source="./media/storage-explorer/plug-in-icon.png" alt-text="Screenshot showing the plug-in icon on the left pane.":::

1. Select **Add an Azure Account**, and then select **Sign-in**.

   :::image type="content" source="./media/storage-explorer/connect-to-azure-subscription.png" alt-text="Screenshot of the Connect to Azure Storage window showing the Add an Azure Account radio button selected, and the Azure Environment drop-down menu.":::

1. In the **Azure Sign-in** dialog box, select **Sign in**, and then enter your Azure credentials.

    :::image type="content" source="./media/storage-explorer/sign-in.png" alt-text="Screenshot of the Sign in window showing where to enter your credentials for your Azure subscription.":::

1. Select your subscription from the list, and then select **Apply**.

    :::image type="content" source="./media/storage-explorer/apply-subscription.png" alt-text="Screenshot of the Account Management pane, showing a list of subscriptions and the Apply button.":::

    The Explorer pane updates and shows the accounts in the selected subscription.

    :::image type="content" source="./media/storage-explorer/account-list.png" alt-text="Screenshot of the Explorer pane, updated to show the accounts in the selected subscription.":::

    Your **Cosmos DB account** is connected to your Azure subscription.

## Use a connection string to connect to Azure Cosmos DB

You can use a connection string to connect to an Azure Cosmos DB. This method only supports SQL and Table APIs. Follow these steps to connect with a connection string:

1. Find **Local and Attached** in the left tree, right-click **Cosmos DB Accounts**, and then select **Connect to Cosmos DB**.

    :::image type="content" source="./media/storage-explorer/connect-to-db-by-connection-string.png" alt-text="Screenshot showing the drop-down menu after you right-click, with Connect to Azure Cosmos D B highlighted.":::

2. In the **Connect to Cosmos DB** window:
   1. Select the API from the drop-down menu.
   1. Paste your connection string in the **Connection string** box. For how to retrieve the primary connection string, see [Get the connection string](manage-with-powershell.md#list-keys).
   1. Enter an **Account label**, and then select **Next** to check the summary.
   1. Select **Connect** to connect the Azure Cosmos DB account.

      :::image type="content" source="./media/storage-explorer/connection-string.png" alt-text="Screenshot of the Connect to Cosmos D B window, showing the API drop-down menu, the Connection String box and the Account label box.":::

## Use a local emulator to connect to Azure Cosmos DB

Use the following steps to connect to an Azure Cosmos DB with an emulator. This method only supports SQL accounts.

1. Install Cosmos DB Emulator, and then open it. For how to install the emulator, see
 [Cosmos DB Emulator](https://docs.microsoft.com/azure/cosmos-db/local-emulator).

1. Find **Local and Attached** in the left tree, right-click **Cosmos DB Accounts**, and then select **Connect to Cosmos DB Emulator**.

    :::image type="content" source="./media/storage-explorer/emulator-entry.png" alt-text="Screenshot showing the menu that displays after you right-click, with Connect to Azure Cosmos D B Emulator highlighted.":::

1. In the **Connect to Cosmos DB** window:
   1. Paste your connection string in the **Connection string** box. For information on retrieving the primary connection string, see [Get the connection string](manage-with-powershell.md#list-keys).
   1. Enter an **Account label**, and then select **Next** to check the summary.
   1. Select **Connect** to connect the Azure Cosmos DB account.

      :::image type="content" source="./media/storage-explorer/emulator-dialog.png" alt-text="Screenshot of the Connect to Cosmos D B window, showing the Connection String box and the Account label box.":::

## Azure Cosmos DB resource management

Use the following operations to manage an Azure Cosmos DB account:

* Open the account in the Azure portal.
* Add the resource to the Quick Access list.
* Search and refresh resources.
* Create and delete databases.
* Create and delete collections.
* Create, edit, delete, and filter documents.
* Manage stored procedures, triggers, and user-defined functions.

### Quick access tasks

You can right-click a subscription on the Explorer pane to perform many quick action tasks, for example:

* Right-click an Azure Cosmos DB account or database, and then select **Open in Portal** to manage the resource in the browser on the Azure portal.

  :::image type="content" source="./media/storage-explorer/open-in-portal.png" alt-text="Screenshot showing the menu that displays after you right-click, with Open in Portal highlighted.":::

* Right-click an Azure Cosmos DB account, database, or collection, and then select **Add to Quick Access** to add it to the Quick Access menu.

* Select **Search from Here** to enable keyword search under the selected path.

    :::image type="content" source="./media/storage-explorer/search-from-here.png" alt-text="Screenshot showing the search box highlighted.":::

### Database and collection management

#### Create a database

1. Right-click the Azure Cosmos DB account, and then select **Create Database**.

   :::image type="content" source="./media/storage-explorer/create-database.png" alt-text="Screenshot showing the menu that displays after you right-click, with Create Database highlighted.":::

1. Enter the database name, and then press **Enter** to complete.

#### Delete a database

1. Right-click the database, and then select **Delete Database**. 

   :::image type="content" source="./media/storage-explorer/delete-database1.png" alt-text="Screenshot showing the menu that displays after you right-click, with Delete Database highlighted.":::

1. Select **Yes** in the pop-up window. The database node is deleted, and the Azure Cosmos DB account refreshes automatically.

   :::image type="content" source="./media/storage-explorer/delete-database2.png" alt-text="Screenshot of the confirmation window with the Yes button highlighted.":::

#### Create a collection

1. Right-click your database, and then select **Create Collection**.

   :::image type="content" source="./media/storage-explorer/create-collection.png" alt-text="Screenshot showing the menu that displays after you right-click, with Create Collection highlighted.":::

1. In the Create Collection window, enter the requested information, like **Collection ID** and **Storage capacity**, and so on. Select **OK** to finish.

   :::image type="content" source="./media/storage-explorer/create-collection2.png" alt-text="Screenshot of the Create Collection window, showing the Collection I D box and the Storage capacity buttons.":::

1. Select **Unlimited** so you can specify a partition key, then select **OK** to finish.

   > [!NOTE]
   > If a partition key is used when you create a collection, once creation is completed, you can't change the partition key value on the collection.

    :::image type="content" source="./media/storage-explorer/partitionkey.png" alt-text="Screenshot of the Create Collection window, showing Unlimited selected for Storage Capacity, and the Partition key box highlighted.":::

#### Delete a collection

- Right-click the collection, select **Delete Collection**, and then select **Yes** in the pop-up window.

    The collection node is deleted, and the database refreshes automatically.

    :::image type="content" source="./media/storage-explorer/delete-collection.png" alt-text="Screenshot showing the menu that displays after you right-click, with Delete Collection highlighted.":::

### Document management

#### Create and modify documents

- Open **Documents** on the left pane, select **New Document**, edit the contents on the right pane, and then select **Save**.
- You can also update an existing document, and then select **Save**. To discard changes, select **Discard**.

  :::image type="content" source="./media/storage-explorer/document.png" alt-text="Screenshot showing Documents highlighted on the left pane. On the right pane, New Document, Save and Discard are highlighted.":::

#### Delete a document

* Select the **Delete** button to delete the selected document.

#### Query for documents

* To edit the document filter, enter a [SQL query](how-to-sql-query.md), and then select **Apply**.

  :::image type="content" source="./media/storage-explorer/document-filter.png" alt-text="Screenshot of the right pane, showing Filter and Apply buttons, the ID number, and the query box highlighted.":::

### Graph management

#### Create and modify a vertex

* To create a new vertex, open **Graph** from the left pane, select **New Vertex**, edit the contents, and then select **OK**.
* To modify an existing vertex, select the pen icon on the right pane.

   :::image type="content" source="./media/storage-explorer/vertex.png" alt-text="Screenshot showing Graph selected on the left pane, and showing New Vertex and the pen icon highlighted on the right pane.":::

#### Delete a graph

* To delete a vertex, select the recycle bin icon beside the vertex name.

#### Filter for graph

* To edit the graph filter, enter a [gremlin query](gremlin-support.md), and then select **Apply Filter**.

   :::image type="content" source="./media/storage-explorer/graph-filter.png" alt-text="Screenshot showing Graph selected on the left pane, and showing Apply Filter and the query box highlighted on the right pane.":::

### Table management

#### Create and modify a table

* To create a new table:
   1. On the left pane, open **Entities**, and then select **Add**.
   1. In the **Add Entity** dialog box, edit the content.
   1. Select the **Add Property** button to add a property.
   1. Select **Insert**.

      :::image type="content" source="./media/storage-explorer/table.png" alt-text="Screenshot showing Entities highlighted on the left pane, and showing Add, Edit, Add Property, and Insert highlighted on the right pane.":::

* To modify a table, select **Edit**, modify the content, and then select **Update**.

   

#### Import and export table

* To import, select the **Import** button, and then choose an existing table.
* To export, select the **Export** button, and then choose a destination.

   :::image type="content" source="./media/storage-explorer/table-import-export.png" alt-text="Screenshot showing the Import and Export buttons highlighted on the right pane.":::

#### Delete entities

* Select the entities, and then select the **Delete** button.

  :::image type="content" source="./media/storage-explorer/table-delete.png" alt-text="Screenshot showing the Delete button highlighted on the right pane, and a confirmation pop-up window with Yes highlighted.":::

#### Query a table

- Select the **Query** button, input a query condition, and then select the **Execute Query** button. To close the query pane, select the **Close Query** button.

  :::image type="content" source="./media/storage-explorer/table-query.png" alt-text="Screenshot of the right pane, showing the Execute Query button and the Close Query button highlighted.":::

### Manage stored procedures, triggers, and UDFs

* To create a stored procedure:
  1. In the left tree, right-click **Stored Procedures**, and then select **Create Stored Procedure**.
  
     :::image type="content" source="./media/storage-explorer/stored-procedure.png" alt-text="Screenshot of the left pane, showing the menu that displays after you right-click, with Create Stored Procedure highlighted.":::
  
  1. Enter a name in the left, enter the stored procedure scripts on the right pane, and then select **Create**.
  
* To edit an existing stored procedure, double-click the procedure, make the update, and then select **Update** to save. You can also select **Discard** to cancel the change.

* The operations for **Triggers** and **UDF** are similar to **Stored Procedures**.

## Troubleshooting

The following are solutions to common issues that arise when you use Azure Cosmos DB in Storage Explorer.

### Sign in issues

First, restart your application to see if that fixes the problem. If the problem persists, continue troubleshooting.

#### Self-signed certificate in certificate chain

There are a few reasons you might be seeing this error, the two most common ones are:

* You're behind a *transparent proxy*. Someone, like your IT department, intercepts HTTPS traffic, decrypts it, and then encrypts it by using a self-signed certificate.

* You're running software, such as antivirus software. The software injects a self-signed TLS/SSL certificate into the HTTPS messages you receive.

When Storage Explorer finds a self-signed certificate, it doesn't know if the HTTPS message it receives is tampered with. If you have a copy of the self-signed certificate, you can tell Storage Explorer to trust it. If you're unsure of who injected the certificate, then you can follow these steps to try to find out:

1. Install OpenSSL:

     - [Windows](https://slproweb.com/products/Win32OpenSSL.html): Any of the light versions are OK.
     - macOS and Linux: Should be included with your operating system.

1. Run OpenSSL:
    * Windows: Go to the install directory, then **/bin/**, then double-click **openssl.exe**.
    * Mac and Linux: Execute **openssl** from a terminal.
1. Execute `s_client -showcerts -connect microsoft.com:443`.
1. Look for self-signed certificates. If you're unsure, which are self-signed, then look for anywhere that the subject ("s:") and issuer ("i:") are the same.
1. If you find any self-signed certificates, copy and paste everything from and including **-----BEGIN CERTIFICATE-----** to **-----END CERTIFICATE-----** to a new .CER file for each one.
1. Open Storage Explorer, and then go to **Edit** > **SSL Certificates** > **Import Certificates**. Use the file picker to find, select, and then open the .CER files you created.

If you don't find any self-signed certificates, you can send feedback for more help.

#### Unable to retrieve subscriptions

If you're unable to retrieve your subscriptions after you sign in, try these suggestions:

* Verify that your account has access to the subscriptions. To do this, sign in to the [Azure portal](https://portal.azure.com/).
* Make sure you signed in to the correct environment:
  * [Azure](https://portal.azure.com/)
  * [Azure China](https://portal.azure.cn/)
  * [Azure Germany](https://portal.microsoftazure.de/)
  * [Azure US Government](https://portal.azure.us/)
  * Custom Environment/Azure Stack
* If you're behind a proxy, make sure that the Storage Explorer proxy is properly configured.
* Remove the account, and then add it again.
* Delete the following files from your home directory (such as: C:\Users\ContosoUser), and then add the account again:
  * .adalcache
  * .devaccounts
  * .extaccounts
* Press the F12 key to open the developer console. Watch the console for any error messages when you sign in.

   :::image type="content" source="./media/storage-explorer/console.png" alt-text="Screenshot of the developer tools console, showing Console highlighted.":::

#### Unable to see the authentication page

If you're unable to see the authentication page:

* Depending on the speed of your connection, it might take a while for the sign-in page to load. Wait at least one minute before you close the authentication dialog box.
* If you're behind a proxy, make sure that the Storage Explorer proxy is properly configured.
* On the developer tools console (F12), watch the responses to see if you can find any clue for why authentication isn't working.

#### Can't remove an account

If you're unable to remove an account, or if the reauthenticate link doesn't do anything:

* Delete the following files from your home directory, and then add the account again:
  * .adalcache
  * .devaccounts
  * .extaccounts

* If you want to remove SAS attached Storage resources, delete:
  * %AppData%/StorageExplorer folder for Windows
  * /Users/<your_name>/Library/Application SUpport/StorageExplorer for macOS
  * ~/.config/StorageExplorer for Linux
  
  > [!NOTE]
  > If you delete these files, **you must reenter all your credentials**.

### HTTP/HTTPS proxy issue

You can't list Azure Cosmos DB nodes in the left tree when you configure an HTTP/HTTPS proxy in ASE. You can use Azure Cosmos DB data explorer in the Azure portal as a work-around.

### "Development" node under "Local and Attached" node issue

There's no response after you select the **Development** node under the **Local and Attached** node in the left tree. The behavior is expected.

:::image type="content" source="./media/storage-explorer/development.png" alt-text="Screenshot showing the Development node selected.":::

### Attach an Azure Cosmos DB account in the **Local and Attached** node error

If you see the following error after you attach an Azure Cosmos DB account in **Local and Attached** node, then make sure you're using the correct connection string.

:::image type="content" source="./media/storage-explorer/attached-error.png" alt-text="Screenshot of the Unable to retrieve child resources error pop-up window, indicating getaddrinfo ENOTFOUND.":::

### Expand Azure Cosmos DB node error

You might see the following error when you try to expand nodes in the left tree.

:::image type="content" source="./media/storage-explorer/expand-error.png" alt-text="Screenshot of the Unable to retrieve child resources error pop-up window, indicating Cannot connect to this Cosmos D B account.":::

Try these suggestions:

* Check if the Azure Cosmos DB account is in provision progress. Try again when the account is being created successfully.
* If the account is under the **Quick Access** or **Local and Attached** nodes, check if the account is deleted. If so, you need to manually remove the node.

## Next steps

* Watch this video to see how to use Azure Cosmos DB in Azure Storage Explorer: [Use Azure Cosmos DB in Azure Storage Explorer](https://www.youtube.com/watch?v=iNIbg1DLgWo&feature=youtu.be).
* Learn more about Storage Explorer and connect more services in [Get started with Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer).
