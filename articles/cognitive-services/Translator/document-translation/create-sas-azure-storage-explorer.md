---
title: Create shared access signature (SAS) token for containers and blobs with Microsoft Storage Explorer
description: How to create a Shared Access Token (SAS) for containers and blobs with Microsoft Storage Explorer
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 02/09/2021
---

# Create SAS tokens with Azure Storage Explorer

In this article, you'll learn how to create a shared access signature (SAS) token containers and blobs using the Azure Storage Explorer. An SAS token provides secure, delegated access to resources in your Azure storage account. 
## Prerequisites

* You'll need a [**Azure Storage Explorer**](/azure/vs-azure-tools-storage-manage-with-storage-explorer) app installed in your Windows, macOS, or Linux development environment. Azure Storage Explorer is a free tool that enables you to easily manage your Azure cloud storage resources.
* After the Azure Storage Explorer app is installed, [connect it the storage account](/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows#connect-to-a-storage-account-or-service) you're using for Document Translation.

## [SAS tokens for containers](#tab/Containers)

1. Open the Azure Storage Explorer app on your local machine and navigate to your connected **Storage Accounts**.
1. Expand the Storage Accounts node and select **Blob Containers**.
1. Expand the Blob Containers node and right-click on a storage **container** node or to display the options menu.
1. Select **Get Shared Access Signature...** from options menu.
1. In the **Shared Access Signature** window, make the following selections:
    * Select your **Access policy** (the default is none).
    * Specify the signed key **Start** and **Expiry** date and time. A short lifespan is recommended because, once generated, an SAS can't be revoked.
    * Select the **Time zone** for the Start and Expiry date and time (default is Local).
    * Define your container **Permissions** by checking and/or clearing the appropriate check box.
    * Review and select **Create**.

1. A new window will appear with the **Container** name, **URI**, and **Query string** for your container.  
1. **Copy and paste the container, URI, and query string values in a secure location. They'll only be displayed once and can't be retrieved once the window is closed.**
1. To construct an SAS URL, append the SAS token (URI) to the URL for a storage service.

## [SAS tokens for blobs](#tab/blobs)

1. Open the Azure Storage Explorer app on your local machine and navigate to your connected **Storage Accounts**.
1. Expand your storage node and select **Blob Containers**.
1. Expand the Blob Containers node and select a **container** node to display the contents in the main window.
1. Select the blob where you wish to delegate SAS access and right-click to display the options menu.
1. Select **Get Shared Access Signature...** from options menu.
1. In the **Shared Access Signature** window, make the following selections:
    * Select your **Access policy** (the default is none).
    * Specify the signed key **Start** and **Expiry** date and time. A short lifespan is recommended because, once generated, an SAS can't be revoked.
    * Select the **Time zone** for the Start and Expiry date and time (default is Local).
    * Define your container **Permissions** by checking and/or clearing the appropriate check box.
    * Review and select **Create**.
1. A new window will appear with the **Blob** name, **URI**, and **Query string** for your blob.  
1. **Copy and paste the blob, URI, and query string values in a secure location. They will only be displayed once and cannot be retrieved once the window is closed.**
1. To construct an SAS URL, append the SAS token (URI) to the URL for a storage service.

---

## Learn more

* [Create SAS tokens for blobs or containers programmatically](/azure/storage/blobs/sas-service-create)
* [Permissions for a directory, container, or blob](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)
>
>