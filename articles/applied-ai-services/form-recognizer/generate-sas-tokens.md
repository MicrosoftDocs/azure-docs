---
title: Generate shared access signature (SAS) token for containers and blobs with Azure portal and Microsoft Storage Explorer
description: How to generate a Shared Access Token (SAS) for containers and blobs in the Azure portal
ms.topic: how-to
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.date: 09/16/2021
ms.author: lajanuar
recommendations: false
---

# Generate SAS tokens for storage containers

In this article, you'll learn how to generate shared access signature (SAS) tokens using the Azure portal. A SAS token is a string that provides secure, delegated access to resources in your Azure storage account. Your application provides the SAS token to Azure storage as part of a request. If the storage service verifies that the SAS is valid, the request is authorized. If not, the request is declined with error code 403 (Forbidden).

Azure blob storage offers three types of resources:

* **Storage** accounts provide a unique namespace in Azure for your data.
* **Containers** in storage accounts organize sets of blobs.
* **Blobs**—block blobs in a container store text and binary data.

> [!NOTE]
>
> * If your Azure storage account is protected by a Virtual Network (VNet) or firewall, you cannot grant access using a SAS token. You'll have to use a [**managed identity**](managed-identity-byos.md) to grant access to your storage resource.
>
> * If you will analyze your storage data with the [**Form Recognizer sample labeling tool (FOTT)**](https://fott-2-1.azurewebsites.net/), you must deploy the tool behind your VNet or firewall.
>
> * [**Managed identity**](managed-identity-byos.md) supports both privately and publicly accessible Azure blob storage accounts.

## When to use a shared access signature

* If you're using storage containers with public access, you can opt to use a SAS token to grant limited access.

* If you are training a custom model, your assembled set of training documents must be uploaded to an Azure blob storage container. Additionally, if you're using manually labeled data, you'll also have to upload the _labels.json_ and _ocr.json_ files that correspond to your training documents.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).
* A [**Form Recognizer**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [**Cognitive Services multi-service**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource.
* A **standard performance** [**Azure Blob Storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll create containers to store and organize your blob data within your storage account. If you don't know how to create an Azure storage account with a container, following these quickstarts:

  * [**Create a storage account**](/azure/storage/common/storage-account-create). Under **Instance details**, select **Standard** performance. You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.
  * [**Create a container**](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container). In the **New Container** window, set the **Public access level** to **Container** (anonymous read access for containers and blobs).

## Upload your documents

1. Go to the [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:

 **Your storage account** → **containers** → **your container**

1. Select **Upload** from the menu at the top of the page.
1. The **Upload blob** window will appear.
1. Select the file(s) to upload.

> [!NOTE]
> By default, the REST API will use form documents that are located at the root of your container. However, you can use data organized in subfolders if you specify it in the API call. *See* [**Organize your data in subfolders**](/azure/applied-ai-services/form-recognizer/build-training-data-set.md#organize-your-data-in-subfolders-optional)

## Generate your SAS tokens

### [SAS tokens for containers](#tab/Containers)

Go to the [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:

 **Your storage account** → **containers**

> [!IMPORTANT]
> Generate and retrieve the SAS for your container, not for the storage account itself.

1. Select a container from the list.
1. Navigate to the far right area of the main window and select the three ellipses associated with your chosen container.
1. Select **Generate SAS** from the drop-down menu to open the **Generate SAS Window**.

### [SAS tokens for blobs](#tab/blobs)

You can generate the SAS URL for an individual document in a blob storage container.

Go to the [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:

 **Your storage account** → **containers** → **your container** → **your document**

1. Select a document from the list.
1. Navigate to the far right area of the main window and select the three ellipses associated with your chosen document.
1. Select **Generate SAS** from the drop-down menu to open the **Generate SAS Window**.

---

4. Select **Signing method** → **User delegation key**.

1. Under  **Signing key**, select the access key that will be used to sign the SAS token. The access keys are located in the left menu under **Security + networking**.

1. Define **Permissions** by checking and/or clearing the appropriate check box. Make sure the **Read**, **Write**, **Delete**, and **List** permissions are checked

1. Specify the signed key **Start** and **Expiry** times.

1. The **Allowed IP addresses** field is optional and specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, it won't be authorized.

1. The **Allowed protocols** field is optional and specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.

1. Review then select **Generate SAS token and URL**.

1. The **Blob SAS token** query string and **Blob SAS URL** will be displayed in the lower area of window. To use the **Blob SAS token**, append it a storage service URI.

1. **Copy and paste the Blob SAS token and URL values in a secure location. They'll only be displayed once and cannot be retrieved once the window is closed.**

* To use the **Blob SAS URL**, add it to your API call as follows:

```json
{
  "source":"<BLOB SAS URL>"
}
```

That's it. You have learned how to generate a SAS token to authorize how clients can access your data.

> [!div class="nextstepaction"]
> [Build a training data set](build-training-data-set.md)