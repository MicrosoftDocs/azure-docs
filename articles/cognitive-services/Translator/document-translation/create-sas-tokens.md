---
title: Create shared access signature (SAS) token for containers and blobs with Microsoft Storage Explorer 
description: How to create a Shared Access Token (SAS) for containers and blobs with Microsoft Storage Explorer and the Azure portal
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 03/05/2021
---

# Create SAS tokens for Document Translation processing

In this article, you'll learn how to create shared access signature (SAS) tokens using the Azure Storage Explorer or the Azure portal. An SAS token provides secure, delegated access to resources in your Azure storage account.

## Create your SAS tokens with Azure Storage Explorer

### Prerequisites

* You'll need a [**Azure Storage Explorer**](../../../vs-azure-tools-storage-manage-with-storage-explorer.md) app installed in your Windows, macOS, or Linux development environment. Azure Storage Explorer is a free tool that enables you to easily manage your Azure cloud storage resources.
* After the Azure Storage Explorer app is installed, [connect it the storage account](../../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows#connect-to-a-storage-account-or-service) you're using for Document Translation.

### Create your tokens

### [SAS tokens for containers](#tab/Containers)

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

### [SAS tokens for blobs](#tab/blobs)

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

## Create SAS tokens for blobs in the Azure portal

> [!NOTE]
> Creating SAS tokens for containers directly in the Azure portal is currently not supported. However, you can create an SAS token with [**Azure Storage Explorer**](#create-your-sas-tokens-with-azure-storage-explorer) or complete the task [programmatically](../../../storage/blobs/sas-service-create.md).

<!-- markdownlint-disable MD024 -->
### Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).
* A [**Translator**](https://ms.portal.azure.com/#create/Microsoft) service resource (**not** a Cognitive Services multi-service resource.  *See* [Create a new Azure  resource](../../cognitive-services-apis-create-account.md#create-a-new-azure-cognitive-services-resource).  
* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You will create containers to store and organize your blob data within your storage account.

### Create your tokens

Go to the [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:  

 **Your storage account** → **containers** → **your container** → **your blob**

1. Select **Generate SAS** from the menu near the top of the page.

1. Select **Signing method** → **User delegation key**.

1. Define **Permissions** by checking and/or clearing the appropriate check box.

1. Specify the signed key **Start** and **Expiry** times.

1. The **Allowed IP addresses** field is optional and specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, it won't be authorized.

1. The **Allowed protocols** field is optional and specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.

1. Review then select **Generate SAS token and URL**.

1. The **Blob SAS token** query string and **Blob SAS URL** will be displayed in the lower area of window.  

1. **Copy and paste the Blob SAS token and URL values in a secure location. They'll only be displayed once and cannot be retrieved once the window is closed.**

1. To construct an SAS URL, append the SAS token (URI) to the URL for a storage service.

## Learn more

* [Create SAS tokens for blobs or containers programmatically](../../../storage/blobs/sas-service-create.md)
* [Permissions for a directory, container, or blob](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)

## Next steps

> [!div class="nextstepaction"]
> [Get Started with Document Translation](get-started-with-document-translation.md)
>
>