---
title: Manage Azure Cosmos DB resources using Azure Storage Explorer
description: Learn how to connect to Azure Cosmos DB and manage its resources by using Azure Storage Explorer.
author: deborahc
ms.service: cosmos-db
ms.topic: how-to
ms.date: 08/24/2020
ms.author: dech
ms.custom: seodec18, has-adal-ref
---
# Work with data using Azure Storage Explorer

Using Azure Cosmos DB in Azure Storage Explorer enables users to manage Azure Cosmos DB entities, manipulate data, update stored procedures and triggers along with other Azure entities like Storage blobs and queues. Now you can use the same tool to manage your different Azure entities in one place. At this time, Azure Storage Explorer supports Cosmos accounts configured for SQL, MongoDB, Graph, and Table APIs.


## Prerequisites

A Cosmos account with SQL API or Azure Cosmos DB's API for MongoDB. If you don't have an account, you can create one in the Azure portal, as described in [Azure Cosmos DB: Build a SQL API web app with .NET and the Azure portal](create-sql-api-dotnet.md).

## Installation

Install the newest Azure Storage Explorer bits here: [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), now we support Windows, Linux, and MAC version.

## Connect to an Azure subscription

1. After installing the **Azure Storage Explorer**, select the **plug-in** icon on the left as shown in the following image:

   :::image type="content" source="./media/storage-explorer/plug-in-icon.png" alt-text="Select the plug-in icon to connect":::

2. Select **Add an Azure Account**, and then select **Sign-in**.

   :::image type="content" source="./media/storage-explorer/connect-to-azure-subscription.png" alt-text="Connect to the required Azure subscription":::

2. In the **Azure Sign-in** dialog box, select **Sign in**, and then enter your Azure credentials.

    :::image type="content" source="./media/storage-explorer/sign-in.png" alt-text="Sign into your Azure subscription":::

3. Select your subscription from the list and then select **Apply**.

    :::image type="content" source="./media/storage-explorer/apply-subscription.png" alt-text="Choose a subscription ID from the list to filter":::

    The Explorer pane updates and displays the accounts in the selected subscription.

    :::image type="content" source="./media/storage-explorer/account-list.png" alt-text="Select an Azure Cosmos DB account from the list available":::

    You have successfully connected to your **Cosmos DB account** to your Azure subscription.

## Connect to Azure Cosmos DB by using a connection string

An alternative way of connecting to an Azure Cosmos DB is to use a connection string. Use the following steps to connect using a connection string.

1. Find **Local and Attached** in the left tree, right-click **Cosmos DB Accounts**, choose **Connect to Cosmos DB...**

    :::image type="content" source="./media/storage-explorer/connect-to-db-by-connection-string.png" alt-text="Connect to Azure Cosmos DB by using a connection string":::

2. Only support SQL and Table API currently. Choose API, paste **Connection String**, input **Account label**, select **Next** to check the summary, and then select **Connect** to connect Azure Cosmos DB account. For information on retrieving the primary connection string, see [Get the connection string](manage-with-powershell.md#list-keys).

    :::image type="content" source="./media/storage-explorer/connection-string.png" alt-text="Enter your connection string":::

## Connect to Azure Cosmos DB by using local emulator

Use the following steps to connect to an Azure Cosmos DB by Emulator, only support SQL account currently.

1. Install Emulator and launch. For how to install Emulator, see
 [Cosmos DB Emulator](https://docs.microsoft.com/azure/cosmos-db/local-emulator)

2. Find **Local and Attached** in the left tree, right-click **Cosmos DB Accounts**, choose **Connect to Cosmos DB Emulator...**

    :::image type="content" source="./media/storage-explorer/emulator-entry.png" alt-text="Connect to Azure Cosmos DB from the emulator":::

3. Only support SQL API currently. Paste **Connection String**, input **Account label**, select **Next** to check the summary, and then select **Connect** to connect Azure Cosmos DB account. For information on retrieving the primary connection string, see [Get the connection string](manage-with-powershell.md#list-keys).

    :::image type="content" source="./media/storage-explorer/emulator-dialog.png" alt-text="Connect to Cosmos DB from the emulator dialog":::


## Azure Cosmos DB resource management

You can manage an Azure Cosmos DB account by doing following operations:
* Open the account in the Azure portal
* Add the resource to the Quick Access list
* Search and refresh resources
* Create and delete databases
* Create and delete collections
* Create, edit, delete, and filter documents
* Manage stored procedures, triggers, and user-defined functions

### Quick access tasks

By right-clicking on a subscription in the Explorer pane, you can perform many quick action tasks:

* Right-click an Azure Cosmos DB account or a database, you can choose **Open in Portal** and manage the resource in the browser on the Azure portal.

  :::image type="content" source="./media/storage-explorer/open-in-portal.png" alt-text="Open in portal":::

* You can also add Azure Cosmos DB account, database, collection to **Quick Access**.
* **Search from Here** enables keyword search under the selected path.

    :::image type="content" source="./media/storage-explorer/search-from-here.png" alt-text="search from here":::

### Database and collection management

#### Create a database

- Right-click the Azure Cosmos DB account, choose **Create Database**, input the database name, and press **Enter** to complete.

  :::image type="content" source="./media/storage-explorer/create-database.png" alt-text="Create a database in your Azure Cosmos account":::

#### Delete a database

- Right-click the database, select **Delete Database**, and select **Yes** in the pop-up window. The database node is deleted, and the Azure Cosmos DB account refreshes automatically.

  :::image type="content" source="./media/storage-explorer/delete-database1.png" alt-text="Delete the first database":::

  :::image type="content" source="./media/storage-explorer/delete-database2.png" alt-text="Delete the second databases":::

#### Create a collection

1. Right-click your database, choose **Create Collection**, and then provide the following information like **Collection ID**, **Storage capacity**, etc. Click **OK** to finish.

   :::image type="content" source="./media/storage-explorer/create-collection.png" alt-text="Create first collection in the database":::

   :::image type="content" source="./media/storage-explorer/create-collection2.png" alt-text="Create second collection in the database":::

2. Select **Unlimited** to be able to specify partition key, then select **OK** to finish.

    If a partition key is used when creating a collection, once creation is completed, the partition key value can't be changed on the collection.

    :::image type="content" source="./media/storage-explorer/partitionkey.png" alt-text="Configure a partition key":::

#### Delete a collection

- Right-click the collection, select **Delete Collection**, and then select **Yes** in the pop-up window.

    The collection node is deleted, and the database refreshes automatically.

    :::image type="content" source="./media/storage-explorer/delete-collection.png" alt-text="Delete one of the collections":::

### Document management

#### Create and modify documents

- To create a new document, open **Documents** in the left window, select **New Document**, edit the contents in the right pane, then select **Save**. You can also update an existing document, and then select **Save**. Changes can be discarded by clicking **Discard**.

  :::image type="content" source="./media/storage-explorer/document.png" alt-text="Create a new document":::

#### Delete a document

- Click the **Delete** button to delete the selected document.

#### Query for documents

- Edit the document filter by entering a [SQL query](how-to-sql-query.md) and then select **Apply**.

  :::image type="content" source="./media/storage-explorer/document-filter.png" alt-text="Query for specific documents":::

### Graph management

#### Create and modify vertex

1. To create a new vertex, open **Graph** from the left window, select **New Vertex**, edit the contents, then select **OK**.
2. To modify an existing vertex, select the pen icon in the right pane.

   :::image type="content" source="./media/storage-explorer/vertex.png" alt-text="Modify a graph's vertex":::

#### Delete a graph

- To delete a vertex, select the recycle bin icon beside the vertex name.

#### Filter for graph

- Edit the graph filter by entering a [gremlin query](gremlin-support.md) and then select **Apply Filter**.

   :::image type="content" source="./media/storage-explorer/graph-filter.png" alt-text="Run a graph query":::

### Table management

#### Create and modify table

1. To create a new table, open **Entities** from the left window, select **Add**, edit the content in **Add Entity** dialog, add property by clicking button **Add Property**, then select **Insert**.
2. To modify a table, select **Edit**, modify the content, then select **Update**.

   :::image type="content" source="./media/storage-explorer/table.png" alt-text="Create and modify a table":::

#### Import and export table

1. To import, select **Import** button and choose an existing table.
2. To export, select **Export** button and choose a destination.

   :::image type="content" source="./media/storage-explorer/table-import-export.png" alt-text="Import or export a table":::

#### Delete entities

- Select the entities and select button **Delete**.

  :::image type="content" source="./media/storage-explorer/table-delete.png" alt-text="Delete a table":::

#### Query table

- Click **Query** button, input query condition, then select **Execute Query** button. Close Query pane by clicking **Close Query** button.

  :::image type="content" source="./media/storage-explorer/table-query.png" alt-text="Query data from the table":::

### Manage stored procedures, triggers, and UDFs

* To create a stored procedure, in the left tree, right-click **Stored Procedure**, choose **Create Stored Procedure**, enter a name in the left, type the stored procedure scripts in the right window, and then select **Create**.
* You can also edit existing stored procedures by double-clicking, making the update, and then clicking **Update** to save, or select **Discard** to cancel the change.

  :::image type="content" source="./media/storage-explorer/stored-procedure.png" alt-text="Create and manage stored procedures":::

* The operations for **Triggers** and **UDF** are similar with **Stored Procedures**.

## Troubleshooting

[Azure Cosmos DB in Azure Storage Explorer](https://docs.microsoft.com/azure/cosmos-db/storage-explorer) is a standalone app that allows you to connect to Azure Cosmos DB accounts hosted on Azure and Sovereign Clouds from Windows, macOS, or Linux. It enables you to manage Azure Cosmos DB entities, manipulate data, update stored procedures and triggers along with other Azure entities like Storage blobs and queues.

These are solutions for common issues seen for Azure Cosmos DB in Storage Explorer.

### Sign in issues

Before proceeding further, try restarting your application and see if the problems can be fixed.

#### Self-signed certificate in certificate chain

There are a few reasons you may be seeing this error, the two most common ones are:

+ You're behind a *transparent proxy*, which means someone (such as your IT department) is intercepting HTTPS traffic, decrypting it, and then encrypting it using a self-signed certificate.

+ You're running software, such as anti-virus software, which is injecting a self-signed TLS/SSL certificate into the HTTPS messages you receive.

When Storage Explorer encounters one of these "self-signed certificates", it can no longer know if the HTTPS message it's receiving has been tampered with. If you have a copy of the self-signed certificate though, then you can tell Storage Explorer to trust it. If you're unsure of who is injecting the certificate, then you can try to find it yourself by doing the following steps:

1. Install OpenSSL
     - [Windows](https://slproweb.com/products/Win32OpenSSL.html) (any of the light versions is ok)
     - Mac and Linux: Should be included with your operating system
2. Run OpenSSL
    - Windows: Go to the install directory, then **/bin/**, then double-click on **openssl.exe**.
    - Mac and Linux: execute **openssl** from a terminal
3. Execute `s_client -showcerts -connect microsoft.com:443`
4. Look for self-signed certificates. If you're unsure, which are self-signed, then look for anywhere the subject ("s:") and issuer ("i:") are the same.
5.	Once you have found any self-signed certificates, copy and paste everything from and including **-----BEGIN CERTIFICATE-----** to **-----END CERTIFICATE-----** to a new .cer file for each one.
6.	Open Storage Explorer and then go to **Edit** > **SSL Certificates** > **Import Certificates**. Using the file picker, find, select, and open the .cer files you created.

If you're unable to find any self-signed certificates using the above steps, could send feedback for more help.

#### Unable to retrieve subscriptions

If you're unable to retrieve your subscriptions after you successfully signed in:

- Verify your account has access to the subscriptions by signing into the [Azure portal](https://portal.azure.com/)
- Make sure you have signed in using the correct environment ([Azure](https://portal.azure.com/), [Azure China](https://portal.azure.cn/), [Azure Germany](https://portal.microsoftazure.de/), [Azure US Government](https://portal.azure.us/), or Custom Environment/Azure Stack)
- If you're behind a proxy, make sure that you have configured the Storage Explorer proxy properly
- Try removing and readding the account
- Try deleting the following files from your home directory (such as: C:\Users\ContosoUser), and then readding the account:
  - .adalcache
  - .devaccounts
  - .extaccounts
- Watch the developer tools console (f12) while signing in for any error messages

:::image type="content" source="./media/storage-explorer/console.png" alt-text="Check the developer tools console for any errors":::

#### Unable to see the authentication page

If you're unable to see the authentication page:

- Depending on the speed of your connection, it may take a while for the sign-in page to load, wait at least one minute before closing the authentication dialog
- If you're behind a proxy, make sure that you have configured the Storage Explorer proxy properly
- Bring up the developer console by pressing F12 key. Watch the responses from developer console and see if you can find any clue for why authentication is not working

#### Cannot remove account

If you're unable to remove an account, or if the reauthenticate link does not do anything

- Try deleting the following files from your home directory, and then readding the account:
  - .adalcache
  - .devaccounts
  - .extaccounts
- If you want to remove SAS attached Storage resources, delete:
  - %AppData%/StorageExplorer folder for Windows
  - /Users/<your_name>/Library/Application SUpport/StorageExplorer for Mac
  - ~/.config/StorageExplorer for Linux
  - **You will have to reenter all your credentials** if you delete these files


### Http/Https proxy issue

You cannot list Azure Cosmos DB nodes in left tree when configuring http/https proxy in ASE. You could use Azure Cosmos DB data explorer in Azure portal as a work-around at this moment.

### "Development" node under "Local and Attached" node issue

There is no response after selecting the "Development" node under "Local and Attached" node in left tree.  The behavior is expected. Azure Cosmos DB local emulator will be supported in next release.

:::image type="content" source="./media/storage-explorer/development.png" alt-text="Development node":::

### Attaching Azure Cosmos DB account in "Local and Attached" node error

If you see below error after attaching Azure Cosmos DB account in "Local and Attached" node, then check if you're using the right connection string.

:::image type="content" source="./media/storage-explorer/attached-error.png" alt-text="Attaching Azure Cosmos DB in Local and Attached error":::

### Expand Azure Cosmos DB node error

You may see below error while trying to expand the tree nodes in left.

:::image type="content" source="./media/storage-explorer/expand-error.png" alt-text="Expand Azure Cosmos DB node error":::

Try the following suggestions:

- Check if the Azure Cosmos DB account is in provision progress and try again when the account is being created successfully.
- If the account is under "Quick Access" node or "Local and Attached" nodes, then check if the account has been deleted. If so, you need to remove the node manually.

## Next steps

* Watch the following video to see how to use Azure Cosmos DB in Azure Storage Explorer: [Use Azure Cosmos DB in Azure Storage Explorer](https://www.youtube.com/watch?v=iNIbg1DLgWo&feature=youtu.be).
* Learn more about Storage Explorer and connect more services in [Get started with Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer).
