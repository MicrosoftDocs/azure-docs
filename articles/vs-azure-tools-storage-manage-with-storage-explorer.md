---
title: Get started with Storage Explorer | Microsoft Docs
description: Manage Azure storage resources with Storage Explorer
services: storage
author: cawaMS

ms.service: storage
ms.devlang: multiple
ms.topic: article
ms.date: 04/22/2019
ms.author: cawa
---

# Get started with Storage Explorer

## Overview

Microsoft Azure Storage Explorer is a standalone app that makes it easy to work with Azure Storage data on Windows, macOS, and Linux. In this article, you'll learn several ways of connecting to and managing your Azure Storage accounts.

![Microsoft Azure Storage Explorer][0]

## Prerequisites

# [Windows](#tab/windows)

Storage Explorer is supported on the following versions of Windows:

* Windows 10 (recommended)
* Windows 8
* Windows 7

For all versions of Windows, .NET Framework 4.6.2 or later is required.

# [macOS](#tab/macos)

Storage Explorer is supported on the following versions of macOS:

* macOS 10.12 "Sierra" and later versions

# [Linux](#tab/linux)

Storage Explorer is available in the [Snap Store](https://snapcraft.io/storage-explorer) for most common distributions of Linux and is the recommended method of installation. The Storage Explorer snap automatically installs all of its dependencies and updates when new versions are published to the Snap Store.

For a list of supported distributions, go to the [snapd installation page](https://snapcraft.io/docs/installing-snapd).

Storage Explorer requires the use of a password manager, which you might have to connect manually before Storage Explorer will work correctly. You can connect Storage Explorer to your system's password manager by running the following command:

```bash
snap connect storage-explorer:password-manager-service :password-manager-service
```

Storage Explorer is also available as a .tar.gz download, but you'll have to install dependencies manually. The .tar.gz installation is supported on the following distributions of Linux:

* Ubuntu 18.04 x64
* Ubuntu 16.04 x64
* Ubuntu 14.04 x64

The .tar.gz installation might work on other distributions, but only these listed ones are officially supported.

For more help installing Storage Explorer on Linux, see the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting#linux-dependencies).

---

## Download and install

[Download and install Storage Explorer](https://www.storageexplorer.com)

## Connect to a Storage account or service

Storage Explorer provides several ways to connect to Storage accounts. In general you can either:

* [Sign in to Azure to access your subscriptions and their resources](#sign-in-to-azure)
* [Attach a specific Storage or CosmosDB resource](#attach-a-specific-resource)

### Sign in to Azure

> [!NOTE]
> To fully access resources after you sign in, Storage Explorer requires both management (Azure Resource Manager) and data layer permissions. This means that you need Azure Active Directory (Azure AD) permissions, which give you access to your Storage account, the containers in the account, and the data in the containers. If you have permissions only at the data layer, consider [adding a resource through Azure AD](#add-a-resource-via-azure-ad). For more information about the specific permissions Storage Explorer requires, see the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting?tabs=1804#role-based-access-control-permission-issues).

1. In Storage Explorer, select **Manage Accounts** to go to the Account Management panel.

    ![Manage Accounts][1]

2. The left pane now displays all the Azure accounts you've signed in to. To connect to another account, select **Add an account**.

3. If you want to sign in to a national cloud or an Azure Stack, select the **Azure environment** drop-down list to choose the Azure cloud you want to use. After you've chosen your environment, select the **Sign-in** button. For more information, see [Connect Storage Explorer to an Azure Stack subscription](/azure-stack/user/azure-stack-storage-connect-se).

    ![Sign in option][2]

4. After you successfully sign in with an Azure account, the account and the Azure subscriptions associated with that account are added to the left pane. Select the Azure subscriptions that you want to work with, and then select **Apply**. (Selecting **All subscriptions** toggles your selection between all or none of the listed Azure subscriptions.)

    ![Select Azure subscriptions][3]

    The left pane displays the Storage accounts associated with the selected Azure subscriptions.

    ![Selected Azure subscriptions][4]

### Attach a specific resource

There are multiple ways to attach to a resource in Storage Explorer:

* [Add a resource via Azure AD](#add-a-resource-via-azure-ad). If you have permissions only at the data layer, use this option to add a blob container or an Azure Data Lake Storage Gen2 Blob storage container.
* [Use a connection string](#use-a-connection-string). Use this option if you have a connection string to a Storage account. Storage Explorer supports both key and [SAS](storage/common/storage-dotnet-shared-access-signature-part-1.md) connection strings.
* [Use a SAS URI](#use-a-sas-uri). If you have a [SAS URI](storage/common/storage-dotnet-shared-access-signature-part-1.md) to a blob container, file share, queue, or table, use it to attach to the resource. To get a SAS URI, you can either use [Storage Explorer](#generate-a-sas-in-storage-explorer) or the [Azure portal](https://portal.azure.com).
* [Use a name and key](#use-a-name-and-key). If you know either of the account keys to your Storage account, you can use this option to quickly connect. The keys for your Storage account are located on the Storage account **Access keys** panel in the [Azure portal](https://portal.azure.com).
* [Attach to a local emulator](#attach-to-a-local-emulator). If you're using one of the available Azure Storage emulators, use this option to easily connect to your emulator.
* [Connect to an Azure Cosmos DB account by using a connection string](#connect-to-an-azure-cosmos-db-account-by-using-a-connection-string). Use this option if you have a connection string to a CosmosDB instance.
* [Connect to Azure Data Lake Store by URI](#connect-to-azure-data-lake-store-by-uri). Use this option if you have a URI to an Azure Data Lake Store.

#### Add a resource via Azure AD

1. Open the **Connect** dialog box by selecting the **Connect** button on the vertical toolbar on the left:

    ![Connect to Azure storage option][9]

2. If you haven't already done so, use the **Add an Azure Account** option to sign in to the Azure account that has access to the resource. After you sign in, return to the **Connect** dialog box.

3. Select **Add a resource via Azure Active Directory (Azure AD)**, and then select **Next**.

4. Select the Azure account and tenant that have access to the Storage resource you want to attach to. Select **Next**.

5. Choose the resource type you want to attach, and then enter the information needed to connect. The information you enter on this page depends on what type of resource you're adding. Make sure to choose the correct type of resource. After you've entered the required information, select **Next**.

6. Review the connection summary and make sure all the information is correct. If it is, select **Connect**. Otherwise, use the **Back** button to return to the previous pages to fix any incorrect information.

After the connection is successfully added, the resource tree automatically navigates to the node that represents the connection. If it doesn't go to that node, look under **Local & Attached** → **Storage Accounts** → **(Attached Containers)** → **Blob Containers**. If Storage Explorer couldn't add your connection, or if you can't access your data after successfully adding the connection, see the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting).

#### Use a connection string

1. Open the **Connect** dialog box by selecting the **Connect** button on the vertical toolbar on the left:

    ![Connect to Azure storage option][9]

2. Select **Use a connection string**, and then select **Next**.

3. Choose a display name for your connection and enter your connection string. Then, select **Next**.

4. Review the connection summary and make sure all the information is correct. If it is, select **Connect**. Otherwise, use the **Back** button to return to the previous pages to fix any incorrect information.

After the connection is successfully added, the resource tree will automatically navigate to the node that represents the connection. If it doesn't go to that node, look under **Local & Attached** → **Storage Accounts**. If Storage Explorer couldn't add your connection, or if you can't access your data after successfully adding the connection, see the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting).

#### Use a SAS URI

1. Open the **Connect** dialog box by selecting the **Connect** button on the vertical toolbar on the left:

    ![Connect to Azure storage option][9]

2. Select **Use a shared access signature (SAS) URI**, and then select **Next**.

3. Choose a display name for your connection and enter your SAS URI. The service endpoint for the type of resource you're attaching should autofill. If you're using a custom endpoint, it's possible it might not. Select **Next**.

4. Review the connection summary and make sure all the information is correct. If it is, select **Connect**. Otherwise, use the **Back** button to return to the previous pages to fix any incorrect information.

After the connection is successfully added, the resource tree will automatically navigate to the node that represents the connection. If it doesn't go to that node, look under **Local & Attached** → **Storage Accounts** → **(Attached Containers)** → **the service node for the type of container you attached**. If Storage Explorer couldn't add your connection, or if you can't access your data after successfully adding the connection, see the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting).

#### Use a name and key

1. Open the **Connect** dialog box by selecting the **Connect** button on the vertical toolbar on the left:

    ![Connect to Azure storage option][9]

2. Select **Use a storage account name and key**, and then select **Next**.

3. Choose a display name for your connection.

4. Enter your Storage account name and either of its access keys.

5. Choose the **Storage domain** to use and then select **Next**.

6. Review the connection summary and make sure all the information is correct. If it is, select **Connect**. Otherwise, use the **Back** button to return to the previous pages to fix any incorrect information.

After the connection is successfully added, the resource tree will automatically navigate to the node that represents the connection. If it doesn't go to that node, look under **Local & Attached** → **Storage Accounts**. If Storage Explorer couldn't add your connection, or if you can't access your data after successfully adding the connection, see the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting).

#### Attach to a local emulator

Storage Explorer currently supports two official Storage emulators:
* [Azure storage emulator](storage/common/storage-use-emulator.md) (Windows only)
* [Azurite](https://github.com/azure/azurite) (Windows, macOS, or Linux)

If your emulator is listening on the default ports, you can use the **Emulator - Default Ports** node (found under **Local & Attached** → **Storage Accounts**) to quickly access your emulator.

If you want to use a different name for your connection, or if your emulator isn't running on the default ports, follow these steps:

1. Start your emulator. When you do, make a note of the ports the emulator is listening on for each service type.

   > [!IMPORTANT]
   > Storage Explorer doesn't automatically start your emulator. You must start it manually.

2. Open the **Connect** dialog box by selecting the **Connect** button on the vertical toolbar on the left:

    ![Connect to Azure storage option][9]

3. Select **Attach to a local emulator**, and then select **Next**.

4. Choose a display name for your connection and enter the ports your emulator is listening on for each service type. The text boxes will start with the default port values for most emulators. The **Files port** box is left blank, because neither of the official emulators currently support the Files service. If the emulator you're using does support Files, you can enter the port that's being used. Then, select **Next**.

5. Review the connection summary and make sure all the information is correct. If it is, select **Connect**. Otherwise, use the **Back** button to return to the previous pages to fix any incorrect information.

After the connection is successfully added, the resource tree will automatically navigate to the node that represents the connection. If it doesn't go to that node, look under **Local & Attached** → **Storage Accounts**. If Storage Explorer couldn't add your connection, or if you can't access your data after successfully adding the connection, see the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting).

#### Connect to an Azure Cosmos DB account by using a connection string

As an alternative to managing Azure Cosmos DB accounts through an Azure subscription, you can also connect to Azure Cosmos DB by using a connection string. To do this, follow these steps:

1. On the left side of the resource tree, expand **Local and Attached**, right-click **Azure Cosmos DB Accounts**, and select **Connect to Azure Cosmos DB**.

    ![connect to Azure Cosmos DB by connection string][21]

2. Select the Azure Cosmos DB API, enter your **Connection String** data, and then select **OK** to connect the Azure Cosmos DB account. For information about how to retrieve the connection string, see [Get the connection string](https://docs.microsoft.com/azure/cosmos-db/manage-account).

    ![connection-string][22]

#### Connect to Azure Data Lake Store by URI

If you want to access a resource that's not in your subscription, you'll need someone who can access that resource to give you the resource URI. After you sign in, you can connect to Data Lake Store by using the URI. To do this, follow these steps:

1. Open Storage Explorer.
2. In the left pane, expand **Local and Attached**.
3. Right-click **Data Lake Store**. From the shortcut menu, select **Connect to Data Lake Store**.

    ![connect to Data Lake Store context menu](./media/vs-azure-tools-storage-manage-with-storage-explorer/storageexplorer-adls-uri-attach.png)

4. Enter the URI. The tool navigates to the location of the URL that you just entered.

    ![connect to Data Lake Store context dialog](./media/vs-azure-tools-storage-manage-with-storage-explorer/storageexplorer-adls-uri-attach-dialog.png)

    ![connect to Data Lake Store result](./media/vs-azure-tools-storage-manage-with-storage-explorer/storageexplorer-adls-attach-finish.png)


## Generate a SAS in Storage Explorer

### Account level SAS

1. Right-click the Storage account you want share, and then select **Get Shared Access Signature**.

    ![Get SAS context menu option][14]

2. In the **Generate Shared Access Signature** dialog box, specify the time frame and permissions you want for the account, and then select **Create**.

    ![Get SAS dialog box][15]

3. You can now either copy the **Connection string** or the raw **Query string** to your clipboard.

### Service level SAS

[How to get a SAS for a blob container in Storage Explorer](vs-azure-tools-storage-explorer-blobs.md#get-the-sas-for-a-blob-container)

## Search for storage accounts

If you need to find a storage resource and don't know where it is, you can use the search box at the top of the left pane to search for the resource.

As you type in the search box, the left pane displays all resources that match the search value you've entered up to that point. For example, a search for **endpoints** is shown in the following screenshot:

![Storage account search][23]

> [!NOTE]
> To speed up your search, use the Account Management panel to deselect any subscriptions that don't contain the item you're searching for. You can also right-click a node and select **Search From Here** to start searching from a specific node.
>
>

## Next steps

* [Manage Azure Blob storage resources with Storage Explorer](vs-azure-tools-storage-explorer-blobs.md)
* [Manage Azure Cosmos DB in Storage Explorer (Preview)](./cosmos-db/storage-explorer.md)
* [Manage Azure Data Lake Store resources with Storage Explorer](./data-lake-store/data-lake-store-in-storage-explorer.md)

[0]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Overview.png
[1]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ManageAccounts.png
[2]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog-SignInSelected.png
[3]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/AccountPanel.png
[4]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/SubscriptionNode.png
[5]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog.png
[7]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/PortalAccessKeys.png
[8]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/AccessKeys.png
[9]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog.png
[10]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog-AddWithKeySelected.png
[11]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog-NameAndKeyPage.png
[12]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/AttachedWithKeyAccount.png
[13]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/AttachedWithKeyAccount-Detach.png
[14]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/GetSharedAccessSignature.png
[15]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/SharedAccessSignatureDialog.png
[16]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog-WithConnStringOrSASSelected.png
[17]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog-ConnStringOrSASPage-1.png
[18]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/AttachedWithSASAccount.png
[19]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ConnectDialog-ConnStringOrSASPage-2.png
[20]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ServiceAttachedWithSAS.png
[21]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/connect-to-db-by-connection-string.png
[22]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/connection-string.png
[23]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Search.png
