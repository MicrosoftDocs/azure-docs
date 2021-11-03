---
title: 'Manage Data Lake Storage Gen1 resources - Azure Storage Explorer'
description: Learn how to access and manage your Azure Data Lake Storage Gen1 data and resources in Azure Storage Explorer

author: jejiang
ms.service: data-lake-store
ms.topic: how-to
ms.date: 06/04/2021
ms.author: jejiang

---
# Manage Data Lake Storage Gen1 resources by using Storage Explorer

[Azure Data Lake Storage Gen1](./data-lake-store-overview.md) is a service for storing large amounts of unstructured data, such as text or binary data. You can get access to the data from anywhere via HTTP or HTTPS. Data Lake Storage Gen1 in Azure Storage Explorer enables you to access and manage Data Lake Storage Gen1 data and resources, along with other Azure entities like blobs and queues. Now you can use the same tool to manage your different Azure entities in one place.

Another advantage is that you don't need to have subscription permission to manage Data Lake Storage Gen1 data. In Storage Explorer, you can attach the Data Lake Storage Gen1 path to the **Local & Attached** node as long as someone grants the permission.

## Prerequisites

To complete the steps in this article, you need the following prerequisites:

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial).
* A Data Lake Storage Gen1 account. For instructions on how to create one, see [Get started with Azure Data Lake Storage Gen1](./data-lake-store-get-started-portal.md).

## Install Storage Explorer

Install the latest Azure Storage Explorer bits from the [product webpage](https://azure.microsoft.com/features/storage-explorer/). The installation supports Windows, Linux, and Mac versions.

## Connect to an Azure subscription

1. In Storage Explorer, select the plug-in icon.

   ![Screenshot that shows where the plug-in icon is located in the user interface](./media/data-lake-store-in-storage-explorer/plug-in-icon.png)

   This opens the **Connect to Azure Storage** dialog box.
1. On the **Select Resource** page, select **Subscription**.
1. On the **Select Azure Environment** page, select the Azure environment to sign in to, and then select **Next**.
1. In the **Sign in** dialog box, enter your Azure credentials, and then select **Next**.

1. In Storage Explorer, in the **ACCOUNT MANAGEMENT** pane, select the subscription that contains the Data Lake Storage Gen1 account that you want to manage, and then select **Open Explorer**.
1. In the **EXPLORER** pane, expand your subscription. The pane updates and displays the accounts in the selected subscription. This includes any Data Lake Storage Gen1 accounts, for example:

     ![Screenshot that shows an example account in the Data Lake Storage Gen1 node](./media/data-lake-store-in-storage-explorer/account-list.png)

## Connect to Data Lake Storage Gen1

You can access resources that don't exist in your subscription if someone gives you the URI for the resources. You can then connect to Data Lake Storage Gen1 by using the URI after you sign in.

1. Open Storage Explorer.
1. Expand **Local & Attached**.
1. Right-click **Data Lake Storage Gen1 (Preview)**, and then select **Connect to Data Lake Storage Gen1**.
1. Enter the URI, for example:

      ![Screenshot that shows the "Connect to Data Lake Store" dialog box, with the text box for entering the URI](./media/data-lake-store-in-storage-explorer/storageexplorer-adls-uri-attach-dialog.png)

   The tool browses to the location of the URL that you just entered.

      ![Shows the Data Lake Storage Gen1 account listed under the Data Lake Storage Gen1 (Preview) node in the UI](./media/data-lake-store-in-storage-explorer/storageexplorer-adls-attach-finish.png)

## View the contents of a Data Lake Storage Gen1 account

A Data Lake Storage Gen1 account's resources contain folders and files. The following steps show how to view the contents of a Data Lake Storage Gen1 account within Storage Explorer.

1. Open Storage Explorer.
1. Expand the subscription that contains the Data Lake Storage Gen1 account that you want to view.
1. Expand **Data Lake Storage Gen1 (Preview)**.
1. Select the Data Lake Storage Gen1 account that you want to view.

   The main pane displays the contents of the Data Lake Storage Gen1 account.

   ![Shows the main pane with the Data Lake Storage Gen1 account selected and a list of folders in the account](./media/data-lake-store-in-storage-explorer/storageexplorer-adls-toolbar-mainpane.png)

## Manage resources in Data Lake Storage Gen1

You can manage Data Lake Storage Gen1 resources by doing following operations:

* Browse through Data Lake Storage Gen1 resources across multiple Data Lake Storage Gen1 accounts.  
* Use a connection string to connect to and manage Data Lake Storage Gen1 directly.
* View Data Lake Storage Gen1 resources shared by others through an ACL under **Local & Attached**.
* Perform file and folder CRUD operations: support recursive folders and multi-selected files.
* Drag, drop, and add a folder to quickly access recent locations. This operation mirrors the desktop File Explorer experience.
* Copy and open a Data Lake Storage Gen1 hyperlink in Storage Explorer with one click.
* Display the **Activities** log in the lower pane to view activity status.
* Display folder statistics and file properties.

## Manage resources in Azure Storage Explorer

After you create a Data Lake Storage Gen1 account, you can:

* Upload folders and files, download folders and files, and open resources on your local computer.
* Pin to **Quick Access**, create a new folder, copy a URL, and select all.
* Copy and paste, rename, delete, get folder statistics, and refresh.

The following items show how to manage resources in a Data Lake Storage Gen1 account. Follow the steps for the task that you want to do.

### Upload files

1. On the main pane's toolbar, select **Upload**, and then select **Upload Files**.
1. In the **Select files to upload** dialog box, select the files that you want to upload.
1. Select **Open** to begin the upload.

> [!NOTE]
> You can also directly drag the files on a local computer to start uploading.

### Upload a folder

1. On the main pane's toolbar, select **Upload**, and then select **Upload Folder**.
1. In the **Select folder to upload** dialog box, select the folder that you want to upload.
1. Select **Select Folder** to begin the upload.

> [!NOTE]
> You can also directly drag a folder on a local computer to start uploading.

### Download folders or files to your local computer

1. Select the folders or files that you want to download.
1. On the main pane's toolbar, select **Download**.
1. In the **Select a folder to save the downloaded files into** dialog box, specify the location and the name.
1. Select **Save**.

### Open a folder or file from your local computer

1. Select the folder or file that you want to open.
1. On the main pane's toolbar, select **Open**. Or, right-click the selected folder or file, and then select **Open** on the shortcut menu.

The file is downloaded and opened through the application that's associated with the underlying file type. Or, the folder is opened in the main pane.

### Copy folders or files to the clipboard

You can copy Data Lake Storage Gen1 folders or files and paste them in another Data Lake Storage Gen1 account. Copy and paste operations across storage types aren't supported. For example, you can't copy Data Lake Storage Gen1 folders or files and paste them to Azure Blob storage or the other way around.

1. Select the folders or files that you want to copy.
1. On the main pane's toolbar, select **Copy**. Or, right-click the selected folders or files, and then select **Copy** on the shortcut menu.
1. In the navigation pane, browse to another Data Lake Storage Gen1 account, and select it to view it in the main pane.
1. On the main pane's toolbar, select **Paste** to create a copy. Or, select **Paste** on the destination's shortcut menu.

> [!NOTE]
> The copy/paste operation works by downloading the folders or files to the local computer and then uploading them to the destination. The tool doesn't perform the action in the back end. The copy/paste operation on large files is slow.

### Delete folders or files

1. Select the folders or files that you want to delete.
1. On the main pane's toolbar, select **Delete**. Or, right-click the selected folders or files, and then select **Delete** on the shortcut menu.
1. Select **Yes** in the confirmation dialog box.

### Pin to Quick Access

1. Select the folder that you want to pin so that you can easily access the resources.
1. On the main pane's toolbar, select **Pin to Quick access**.

   In the navigation pane, the selected folder is added to the **Quick Access** node.

   ![Shows the folder listed under the Quick Access node in the UI](./media/data-lake-store-in-storage-explorer/storageexplorer-adls-quick-access.png)

### Use deep links

If you have a URL, you can enter the URL into the address path in File Explorer or a browser. Then Storage Explorer opens automatically and goes to the location of the URL.

![Shows the URL of a folder in a Data Lake Storage Gen1 account that's copied into the File Explorer window](./media/data-lake-store-in-storage-explorer/storageexplorer-adls-deep-link.png)

## Next steps

* View the [latest Storage Explorer release notes and videos](https://www.storageexplorer.com).
* [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md)
* [Get started with Azure Data Lake Storage Gen1](./data-lake-store-overview.md)
