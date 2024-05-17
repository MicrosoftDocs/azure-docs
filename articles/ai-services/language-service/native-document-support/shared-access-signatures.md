---
title: Shared access signature (SAS) tokens for storage blobs
description: Create shared access signature tokens (SAS) for containers and blobs with Azure portal.
ms.service: azure-ai-language
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 01/31/2024
---

# SAS tokens for your storage containers

Learn to create user delegation, shared access signature (SAS) tokens, using the Azure portal. User delegation SAS tokens are secured with Microsoft Entra credentials. SAS tokens provide secure, delegated access to resources in your Azure storage account.

:::image type="content" source="media/sas-url-token.png" alt-text="Screenshot of a storage url with SAS token appended.":::

>[!TIP]
>
> [Role-based access control (managed identities)](../concepts/role-based-access-control.md) provide an alternate method for granting access to your storage data without the need to include SAS tokens with your HTTP requests.
>
> * You can use managed identities to grant access to any resource that supports Microsoft Entra authentication, including your own applications.
> * Using managed identities replaces the requirement for you to include shared access signature tokens (SAS) with your source and target URLs.
> * There's no added cost to use managed identities in Azure.

At a high level, here's how SAS tokens work:

* Your application submits the SAS token to Azure Storage as part of a REST API request.

* If the storage service verifies that the SAS is valid, the request is authorized.

* If the SAS token is deemed invalid, the request is declined, and the error code 403 (Forbidden) is returned.

Azure Blob Storage offers three resource types:

* **Storage** accounts provide a unique namespace in Azure for your data.
* **Data storage containers** are located in storage accounts and organize sets of blobs (files, text, or images).
* **Blobs** are located in containers and store text and binary data such as files, text, and images.

> [!IMPORTANT]
>
> * SAS tokens are used to grant permissions to storage resources, and should be protected in the same manner as an account key.
>
> * Operations that use SAS tokens should be performed only over an HTTPS connection, and SAS URIs should only be distributed on a secure connection such as HTTPS.

## Prerequisites

To get started, you need the following resources:

* An active [Azure account](https://azure.microsoft.com/free/cognitive-services/). If you don't have one, you can [create a free account](https://azure.microsoft.com/free/).

* An [Azure AI Language](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) resource.

* A **standard performance** [Azure Blob Storage account](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You also need to create containers to store and organize your files within your storage account. If you don't know how to create an Azure storage account with a storage container, follow these quickstarts:

  * [Create a storage account](../../../storage/common/storage-account-create.md). When you create your storage account, select **Standard** performance in the **Instance details** > **Performance** field.
  * [Create a container](../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). When you create your container, set **Public access level** to **Container** (anonymous read access for containers and files) in the **New Container** window.

## Create SAS tokens in the Azure portal

<!-- markdownlint-disable MD024 -->

Go to the [Azure portal](https://portal.azure.com/#home) and navigate to your container or a specific file as follows and continue with these steps:

Workflow: **Your storage account** → **containers** → **your container** → **your file**

1. Right-click the container or file and select **Generate SAS** from the drop-down menu.

1. Select **Signing method** → **User delegation key**.

1. Define **Permissions** by checking and/or clearing the appropriate check box:

    * Your **source** file must designate **read** and **list** access.

    * Your **target** file must designate **write** and **list** access.

1. Specify the signed key **Start** and **Expiry** times.

    * When you create a shared access signature (SAS), the default duration is 48 hours. After 48 hours, you'll need to create a new token.
    * Consider setting a longer duration period for the time you're using your storage account for Language Service operations.
    * The value of the expiry time is determined by whether you're using an **Account key** or **User delegation key** **Signing method**:
       * **Account key**: No imposed maximum time limit; however, best practices recommended that you configure an expiration policy to limit the interval and minimize compromise. [Configure an expiration policy for shared access signatures](/azure/storage/common/sas-expiration-policy).
       * **User delegation key**: The value for the expiry time is a maximum of seven days from the creation of the SAS token. The SAS is invalid after the user delegation key expires, so a SAS with an expiry time of greater than seven days will still only be valid for seven days. For more information,*see* [Use Microsoft Entra credentials to secure a SAS](/azure/storage/blobs/storage-blob-user-delegation-sas-create-cli#use-azure-ad-credentials-to-secure-a-sas).

1. The **Allowed IP addresses** field is optional and specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, authorization fails. The IP address or a range of IP addresses must be public IPs, not private. For more information,*see*, [**Specify an IP address or IP range**](/rest/api/storageservices/create-account-sas#specify-an-ip-address-or-ip-range).

1. The **Allowed protocols** field is optional and specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.

1. Review then select **Generate SAS token and URL**.

1. The **Blob SAS token** query string and **Blob SAS URL** are displayed in the lower area of window.

1. **Copy and paste the Blob SAS token and URL values in a secure location. They'll only be displayed once and cannot be retrieved once the window is closed.**

1. To [construct a SAS URL](#use-your-sas-url-to-grant-access), append the SAS token (URI) to the URL for a storage service.

### Use your SAS URL to grant access

The SAS URL includes a special set of [query parameters](/rest/api/storageservices/create-user-delegation-sas#assign-permissions-with-rbac). Those parameters indicate how the client accesses the resources.

You can include your SAS URL with REST API requests in two ways:

* Use the **SAS URL** as your sourceURL and targetURL values.

* Append the **SAS query string** to your existing sourceURL and targetURL values.

Here's a sample REST API request:

```json
{
  "analysisInput": {
    "documents": [
      {
        "id": "doc_0",
        "language": "en",
        "source": {
          "location": "myaccount.blob.core.windows.net/sample-input/input.pdf?{SAS-Token}"
        },
        "target": {
          "location": "https://myaccount.blob.core.windows.net/sample-output?{SAS-Token}"
        }
      }
    ]
  }
}
```

That's it! You learned how to create SAS tokens to authorize how clients access your data.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about native document support](use-native-documents.md "Learn how to process and analyze native documents.") [Learn more about granting access with SAS ](/azure/storage/common/storage-sas-overview "Grant limited access to Azure Storage resources using shared access SAS.")
>
