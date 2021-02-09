---
title: Create shared access signature (SAS) token in the Azure portal.
description: How to create a Shared Access Token (SAS) for blobs with in Azure portal
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 02/09/2021
---

# Create SAS tokens in the Azure portal

In this article, you'll learn how to create a shared access signature (SAS) token for your blob in the Azure portal. An SAS token provides secure, delegated access to resources in your Azure storage account.

> [!NOTE]
> Creating SAS tokens for **containers** directly in the Azure portal is currently not supported. You can create an SAS token with [**Azure Storage Explorer**](create-sas-azure-storage-explorer.md?tabs=containers) or complete the task [programmatically](/azure/storage/blobs/sas-service-create).

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).
* A [**Translator**](https://ms.portal.azure.com/#create/Microsoft) service resource (**not** a Cognitive Services multi-service resource. It's currently not supported for Document Translation). *See* [Create a new Azure  resource](../../cognitive-services-apis-create-account.md#create-a-new-azure-cognitive-services-resource).  
* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). All access to Azure Storage takes place through a storage account.

## Create your tokens

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

* [Permissions for a directory, container, or blob](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)
>
>