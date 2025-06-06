---
title: Get started with Storage Explorer
description: Start managing Azure storage resources with Storage Explorer. Download and install Azure Storage Explorer, connect to a storage account or service, and more.
services: storage
author: jinglouMSFT
ms.service: azure-storage
ms.topic: article
ms.date: 11/08/2019
ms.author: jinglou
ms.reviewer: cralvord,richardgao
---

# Get started with Storage Explorer

## Overview

Microsoft Azure Storage Explorer is a standalone app that makes it easy to work with Azure Storage data on Windows, macOS, and Linux.

In this article, we demonstrate several ways of connecting to and managing your Azure storage accounts.

:::image type="content" alt-text="Microsoft Azure Storage Explorer" source="./media/vs-azure-tools-storage-manage-with-storage-explorer/vs-storage-explorer-overview.png":::

## Prerequisites

# [Windows](#tab/windows)

The following versions of Windows support the latest versions of Storage Explorer:

* Windows 11
* Windows 10

Other requirements include:
- Your Windows installation must support 64-bit applications (starting with Storage Explorer 1.30.0).
- You must have a .NET 8 runtime installed (starting with Storage Explorer 1.34.0) which matches the architecture of your Storage Explorer install. The Storage Explorer installer installs a .NET 8 runtime if you don't already have one installed, but it might not be the latest version available. It is your responsibility to keep your .NET install up to date. You can download the latest .NET 8 runtime from [here](https://dotnet.microsoft.com/download/dotnet/8.0). 

# [macOS](#tab/macos)

The following versions of macOS support Storage Explorer:

* macOS 10.15 Catalina and later versions

Both x64 (Intel) and ARM64 (Apple Silicon) versions of Storage Explorer are available for download starting with Storage Explorer 1.31.0.

# [Ubuntu](#tab/linux-ubuntu)

Storage Explorer is available in the [Snap Store](https://snapcraft.io/storage-explorer). The Storage Explorer snap installs all of its dependencies and updates when new versions are published to the Snap Store.

Ubuntu comes preinstalled with `snapd`, which allows you to run snaps. You can learn more on the [`snapd` installation page](https://snapcraft.io/docs/installing-snapd).

Storage Explorer requires the use of a password manager. You can connect Storage Explorer to your system's password manager by running the following command:

```bash
snap connect storage-explorer:password-manager-service :password-manager-service
```

Installing the Storage Explorer snap is recommended, but Storage Explorer is also available as a *.tar.gz* download. If you use the *.tar.gz*, you must install all of Storage Explorer's dependencies manually.

For more help installing Storage Explorer on Ubuntu, see [Storage Explorer dependencies](../common/storage-explorer-troubleshooting.md#storage-explorer-dependencies) in the Azure Storage Explorer troubleshooting guide.

# [Red Hat Enterprise Linux (RHEL)](#tab/linux-rhel)

Storage Explorer is available in the [Snap Store](https://snapcraft.io/storage-explorer). The Storage Explorer snap installs all of its dependencies and updates when new versions are published to the Snap Store.

To run snaps, you need to install `snapd`. For installation instructions, see the [`snapd` installation page](https://snapcraft.io/docs/installing-snapd).

Storage Explorer requires the use of a password manager. You can connect Storage Explorer to your system's password manager by running the following command:

```bash
snap connect storage-explorer:password-manager-service :password-manager-service
```

For more help installing Storage Explorer on RHEL, see [Storage Explorer dependencies](../common/storage-explorer-troubleshooting.md#storage-explorer-dependencies) in the Azure Storage Explorer troubleshooting guide.

# [SUSE Linux Enterprise Server (SLES)](#tab/linux-sles)

> [!NOTE]
> Storage Explorer hasn't been tested for SLES. You can try using Storage Explorer on your system, but we can't guarantee that Storage Explorer works as expected.

Storage Explorer is available in the [Snap Store](https://snapcraft.io/storage-explorer). The Storage Explorer snap installs all of its dependencies and updates when new versions are published to the Snap Store.

To run snaps, you need to install `snapd`. For installation instructions, see the [`snapd` installation page](https://snapcraft.io/docs/installing-snapd).

Storage Explorer requires the use of a password manager. You can connect Storage Explorer to your system's password manager by running the following command:

```bash
snap connect storage-explorer:password-manager-service :password-manager-service
```

For more help installing Storage Explorer on Ubuntu, see [Storage Explorer dependencies](../common/storage-explorer-troubleshooting.md#storage-explorer-dependencies) in the Azure Storage Explorer troubleshooting guide.

---

## Download and install

To download and install Storage Explorer, see [Azure Storage Explorer](https://www.storageexplorer.com).

## Connect to a storage account or service

Storage Explorer provides several ways to connect to Azure resources:

* [Sign in to Azure to access your subscriptions and their resources](#sign-in-to-azure)
* [Attach to an individual Azure Storage resource](#attach-to-an-individual-resource)

### Sign in to Azure

> [!NOTE]
> To fully access resources after you sign in, Storage Explorer requires both management (Azure Resource Manager) and data layer permissions. This means that you need Microsoft Entra permissions to access your storage account, the containers in the account, and the data in the containers. If you have permissions only at the data layer, consider choosing the **Sign in using Microsoft Entra ID** option when attaching to a resource. For more information about the specific permissions Storage Explorer requires, see the [Azure Storage Explorer troubleshooting guide](../common/storage-explorer-troubleshooting.md#azure-rbac-permissions-issues).

1. In Storage Explorer, select **View** > **Account Management** or select the **Manage Accounts** button.

    :::image type="content" alt-text="Manage Accounts" source ="./media/vs-azure-tools-storage-manage-with-storage-explorer/vs-storage-explorer-manage-accounts.png":::

1. **ACCOUNT MANAGEMENT** now displays all the Azure accounts you're signed in to. To connect to another account, select **Add an account...**.

1. The **Connect to Azure Storage** dialog opens. In the **Select Resource** panel, select **Subscription**.

    :::image type="content" alt-text="Connect dialog" source="./media/vs-azure-tools-storage-manage-with-storage-explorer/vs-storage-explorer-connect-dialog.png":::

1. In the **Select Azure Environment** panel, select an Azure environment to sign in to. You can sign in to global Azure, a national cloud or an Azure Stack instance. Then select **Next**.

    :::image type="content" alt-text="Option to sign in" source="./media/vs-azure-tools-storage-manage-with-storage-explorer/vs-storage-explorer-connect-environment.png":::

    > [!TIP]
    > For more information about Azure Stack, see [Connect Storage Explorer to an Azure Stack subscription or storage account](/azure-stack/user/azure-stack-storage-connect-se).

1. Storage Explorer opens a webpage for you to sign in.

1. After you successfully sign in with an Azure account, the account and the Azure subscriptions associated with that account appear under **ACCOUNT MANAGEMENT**. Select the Azure subscriptions that you want to work with, and then select **Apply**.

    :::image type="content" alt-text="Select Azure subscriptions" source="./media/vs-azure-tools-storage-manage-with-storage-explorer/vs-storage-explorer-account-panel.png":::

1. **EXPLORER** displays the storage accounts associated with the selected Azure subscriptions.

    :::image type="content" alt-text="Selected Azure subscriptions" source="./media/vs-azure-tools-storage-manage-with-storage-explorer/vs-storage-explorer-subscription-node.png":::

### Attach to an individual resource

Storage Explorer lets you connect to individual resources, such as an Azure Data Lake Storage container, using various authentication methods. Some authentication methods are only supported for certain resource types.

| Resource type                 | Microsoft Entra ID | Account Name and Key | Shared Access Signature (SAS)  | Public (anonymous) |
|-------------------------------|--------------------|----------------------|--------------------------------|--------------------|
| Storage accounts              | Yes                | Yes                  | Yes (connection string or URL) | No                 |
| Blob containers               | Yes                | No                   | Yes (URL)                      | Yes                |
| Data Lake Storage containers  | Yes                | No                   | Yes (URL)                      | Yes                |
| Data Lake Storage directories | Yes                | No                   | Yes (URL)                      | Yes                |
| File shares                   | Yes                | No                   | Yes (URL)                      | No                 |
| Queues                        | Yes                | No                   | Yes (URL)                      | No                 |
| Tables                        | Yes                | No                   | Yes (URL)                      | No                 |

Storage Explorer can also connect to a [local storage emulator](#local-storage-emulator) using the emulator's configured ports.

To connect to an individual resource, select the **Connect** button in the left-hand toolbar. Then follow the instructions for the resource type you want to connect to.

:::image type="content" alt-text="Connect to Azure storage option" source="./media/vs-azure-tools-storage-manage-with-storage-explorer/vs-storage-explorer-connect-button.png":::

When a connection to a storage account is successfully added, a new tree node appears under **Local & Attached** > **Storage Accounts**.

For other resource types, a new node is added under **Local & Attached** > **Storage Accounts** > **(Attached Containers)**. The node appears under a group node matching its type. For example, a new connection to an Azure Data Lake Storage container appears under **Blob Containers**.

If Storage Explorer couldn't add your connection, or if you can't access your data after successfully adding the connection, see the [Azure Storage Explorer troubleshooting guide](../common/storage-explorer-troubleshooting.md).

The following sections describe the different authentication methods you can use to connect to individual resources.

<a name='azure-ad'></a>

#### Microsoft Entra ID

Storage Explorer can use your Azure account to connect to the following resource types:
* Blob containers
* Azure Data Lake Storage containers
* Azure Data Lake Storage directories
* Queues

Microsoft Entra ID is the preferred option if you have data layer access to your resource but no management layer access.

1. Sign in to at least one Azure account using the [sign-in steps](#sign-in-to-azure).
1. In the **Select Resource** panel of the **Connect to Azure Storage** dialog, select **Blob container**, **ADLS Gen2 container**, or **Queue**.
1. Select **Sign in using Microsoft Entra ID** and select **Next**.
1. Select an Azure account and tenant. The account and tenant must have access to the Storage resource you want to attach to. Select **Next**.
1. Enter a display name for your connection and the URL of the resource. Select **Next**.
1. Review your connection information in the **Summary** panel. If the connection information is correct, select **Connect**.

#### Account name and key

Storage Explorer can connect to a storage account using the storage account's name and key.

You can find your account keys in the [Azure portal](https://portal.azure.com). Open your storage account page and select **Settings** > **Access keys**.

1. In the **Select Resource** panel of the **Connect to Azure Storage** dialog, select **Storage account**.
1. Select **Account name and key** and select **Next**.
1. Enter a display name for your connection, the name of the account, and one of the account keys. Select the appropriate Azure environment. Select **Next**.
1. Review your connection information in the **Summary** panel. If the connection information is correct, select **Connect**.

#### Shared access signature (SAS) connection string

Storage Explorer can connect to a storage account using a connection string with a Shared Access Signature (SAS). A SAS connection string looks like this:

```text
SharedAccessSignature=sv=2020-04-08&ss=btqf&srt=sco&st=2021-03-02T00%3A22%3A19Z&se=2020-03-03T00%3A22%3A19Z&sp=rl&sig=fFFpX%2F5tzqmmFFaL0wRffHlhfFFLn6zJuylT6yhOo%2FY%3F;
BlobEndpoint=https://contoso.blob.core.windows.net/;
FileEndpoint=https://contoso.file.core.windows.net/;
QueueEndpoint=https://contoso.queue.core.windows.net/;
TableEndpoint=https://contoso.table.core.windows.net/;
```

1. In the **Select Resource** panel of the **Connect to Azure Storage** dialog, select **Storage account**.
1. Select **Shared access signature (SAS)** and select **Next**.
1. Enter a display name for your connection and the SAS connection string for the storage account. Select **Next**.
1. Review your connection information in the **Summary** panel. If the connection information is correct, select **Connect**.

#### Shared access signature (SAS) URL

Storage Explorer can connect to the following resource types using a SAS URI:
* Blob container
* Azure Data Lake Storage container or directory
* File share
* Queue
* Table

A SAS URI looks like this:

```text
https://contoso.blob.core.windows.net/container01?sv=2020-04-08&st=2021-03-02T00%3A30%3A33Z&se=2020-03-03T00%3A30%3A33Z&sr=c&sp=rl&sig=z9VFdWffrV6FXU51T8b8HVfipZPOpYOFLXuQw6wfkFY%3F
```

1. In the **Select Resource** panel of the **Connect to Azure Storage** dialog, select the resource you want to connect to.
1. Select **Shared access signature (SAS)** and select **Next**.
1. Enter a display name for your connection and the SAS URI for the resource. Select **Next**.
1. Review your connection information in the **Summary** panel. If the connection information is correct, select **Connect**.

#### Local storage emulator

Storage Explorer can connect to an Azure Storage emulator. Currently, there are two supported emulators:

* [Azure Storage Emulator](../common/storage-use-emulator.md) (Windows only)
* [Azurite](https://github.com/azure/azurite) (Windows, macOS, or Linux)

If your emulator is listening on the default ports, you can use the **Local & Attached** > **Storage Accounts** > **Emulator - Default Ports** node to access your emulator.

If you want to use a different name for your connection, or if your emulator isn't running on the default ports:

1. Start your emulator.

   > [!IMPORTANT]
   > Storage Explorer doesn't automatically start your emulator. You must start it manually.

1. In the **Select Resource** panel of the **Connect to Azure Storage** dialog, select **Local storage emulator**.
1. Enter a display name for your connection and the port number for each emulated service you want to use. If you don't want to use to a service, leave the corresponding port blank. Select **Next**.
1. Review your connection information in the **Summary** panel. If the connection information is correct, select **Connect**.

## Generate a shared access signature in Storage Explorer<a name="generate-a-sas-in-storage-explorer"></a>

### Account level shared access signature

1. Right-click the storage account you want share, and then select **Get Shared Access Signature**.

    ![Get shared access signature context menu option][14]

1. In **Shared Access Signature**, specify the time frame and permissions you want for the account, and then select **Create**.

    ![Get a shared access signature][15]

1. Copy either the **Connection string** or the raw **Query string** to your clipboard.

### Service level shared access signature

You can get a shared access signature at the service level. For more information, see [Get the SAS for a blob container](vs-azure-tools-storage-explorer-blobs.md#get-the-sas-for-a-blob-container).

## Search for storage accounts

To find a storage resource, you can search in the **EXPLORER** pane.

As you enter text in the search box, Storage Explorer displays all resources that match the search value you entered up to that point. This example shows a search for **endpoints**:

![Storage account search][23]

> [!NOTE]
> To speed up your search, use **Account Management** to deselect any subscriptions that don't contain the item you're searching for. You can also right-click a node and select **Search From Here** to start searching from a specific node.

## Next steps

* [Manage Azure Blob storage resources with Storage Explorer](vs-azure-tools-storage-explorer-blobs.md)
* [Manage Azure Data Lake Store resources with Storage Explorer](../../data-lake-store/data-lake-store-in-storage-explorer.md)

[14]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/get-shared-access-signature-for-storage-explorer.png
[15]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/create-shared-access-signature-for-storage-explorer.png
[23]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/storage-explorer-search-for-resource.png
