---
title: Create shared access signature (SAS) tokens for storage containers and blobs
description: How to create Shared Access Signature tokens (SAS) for containers and blobs with Microsoft Storage Explorer and the Azure portal.
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 03/24/2023
---

# Create SAS tokens for your storage containers

In this article, you learn how to create user delegation, shared access signature (SAS) tokens, using the Azure portal or Azure Storage Explorer. User delegation SAS tokens are secured with Azure AD credentials. SAS tokens provide secure, delegated access to resources in your Azure storage account.

>[!TIP]
>
> [Managed identities](create-use-managed-identities.md) provide an alternate method for you to grant access to your storage data without the need to include SAS tokens with your HTTP requests. *See*, [Managed identities for Document Translation](create-use-managed-identities.md).
>
> * You can use managed identities to grant access to any resource that supports Azure AD authentication, including your own applications.
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

* A [Translator](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) resource.

* A **standard performance** [Azure Blob Storage account](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You also need to create containers to store and organize your files within your storage account. If you don't know how to create an Azure storage account with a storage container, follow these quickstarts:

  * [Create a storage account](../../../../storage/common/storage-account-create.md). When you create your storage account, select **Standard** performance in the **Instance details** > **Performance** field.
  * [Create a container](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). When you create your container, set **Public access level** to **Container** (anonymous read access for containers and files) in the **New Container** window.

## Create SAS tokens in the Azure portal

<!-- markdownlint-disable MD024 -->

Go to the [Azure portal](https://portal.azure.com/#home) and navigate to your container or a specific file as follows and continue with these steps:

| Create SAS token for a container| Create SAS token for a specific file|
|:-----:|:-----:|
**Your storage account** → **containers** → **your container** |**Your storage account** → **containers** → **your container**→ **your file** |

1. Right-click the container or file and select **Generate SAS** from the drop-down menu.

1. Select **Signing method** → **User delegation key**.

1. Define **Permissions** by checking and/or clearing the appropriate check box:

    * Your **source** container or file must have designated  **read** and **list** access.

    * Your **target** container or file must have designated  **write** and **list** access.

1. Specify the signed key **Start** and **Expiry** times.

    * When you create a shared access signature (SAS), the default duration is 48 hours. After 48 hours, you'll need to create a new token.
    * Consider setting a longer duration period for the time you're using your storage account for Translator Service operations.
    * The value for the expiry time is a maximum of seven days from the creation of the SAS token.

1. The **Allowed IP addresses** field is optional and specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, authorization fails.

1. The **Allowed protocols** field is optional and specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.

1. Review then select **Generate SAS token and URL**.

1. The **Blob SAS token** query string and **Blob SAS URL** are displayed in the lower area of window.

1. **Copy and paste the Blob SAS token and URL values in a secure location. They'll only be displayed once and cannot be retrieved once the window is closed.**

1. To [construct a SAS URL](#use-your-sas-url-to-grant-access), append the SAS token (URI) to the URL for a storage service.

## Create SAS tokens with Azure Storage Explorer

Azure Storage Explorer is a free standalone app that enables you to easily manage your Azure cloud storage resources from your desktop.

* You need the [**Azure Storage Explorer**](../../../../vs-azure-tools-storage-manage-with-storage-explorer.md) app installed in your Windows, macOS, or Linux development environment.

* After the Azure Storage Explorer app is installed, [connect it to the storage account](../../../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows#connect-to-a-storage-account-or-service) you're using for Document Translation. Follow these steps to create tokens for a storage container or specific blob file:

### [SAS tokens for storage containers](#tab/Containers)

1. Open the Azure Storage Explorer app on your local machine and navigate to your connected **Storage Accounts**.
1. Expand the Storage Accounts node and select **Blob Containers**.
1. Expand the Blob Containers node and right-click a storage **container** node to display the options menu.
1. Select **Get Shared Access Signature...** from options menu.
1. In the **Shared Access Signature** window, make the following selections:
    * Select your **Access policy** (the default is none).
    * Specify the signed key **Start** and **Expiry** date and time. A short lifespan is recommended because, once generated, a SAS can't be revoked.
    * Select the **Time zone** for the Start and Expiry date and time (default is Local).
    * Define your container **Permissions** by checking and/or clearing the appropriate check box.
    * Review and select **Create**.

1. A new window appears with the **Container** name, **URI**, and **Query string** for your container.
1. **Copy and paste the container, URI, and query string values in a secure location. They'll only be displayed once and can't be retrieved once the window is closed.**
1. To [construct a SAS URL](#use-your-sas-url-to-grant-access), append the SAS token (URI) to the URL for a storage service.

### [SAS tokens for specific blob file](#tab/blobs)

1. Open the Azure Storage Explorer app on your local machine and navigate to your connected **Storage Accounts**.
1. Expand your storage node and select **Blob Containers**.
1. Expand the Blob Containers node and select a **container** node to display the contents in the main window.
1. Select the file where you wish to delegate SAS access and right-click to display the options menu.
1. Select **Get Shared Access Signature...** from options menu.
1. In the **Shared Access Signature** window, make the following selections:
    * Select your **Access policy** (the default is none).
    * Specify the signed key **Start** and **Expiry** date and time. A short lifespan is recommended because, once generated, a SAS can't be revoked.
    * Select the **Time zone** for the Start and Expiry date and time (default is Local).
    * Define your container **Permissions** by checking and/or clearing the appropriate check box.
        * Your **source** container or file must have designated  **read** and **list** access.
        * Your **target** container or file must have designated  **write** and **list** access.
    * Select **key1** or **key2**.
    * Review and select **Create**.

1. A new window appears with the **Blob** name, **URI**, and **Query string** for your blob.
1. **Copy and paste the blob, URI, and query string values in a secure location. They will only be displayed once and cannot be retrieved once the window is closed.**
1. To [construct a SAS URL](#use-your-sas-url-to-grant-access), append the SAS token (URI) to the URL for a storage service.

---

### Use your SAS URL to grant access

The SAS URL includes a special set of [query parameters](/rest/api/storageservices/create-user-delegation-sas#assign-permissions-with-rbac). Those parameters indicate how the client accesses the resources.

You can include your SAS URL with REST API requests in two ways:

* Use the **SAS URL** as your sourceURL and targetURL values.

* Append the **SAS query string** to your existing sourceURL and targetURL values.

Here's a sample REST API request:

```json
{
    "inputs": [
        {
            "storageType": "File",
            "source": {
                "sourceUrl": "https://my.blob.core.windows.net/source-en/source-english.docx?sv=2019-12-12&st=2021-01-26T18%3A30%3A20Z&se=2021-02-05T18%3A30%3A00Z&sr=c&sp=rl&sig=d7PZKyQsIeE6xb%2B1M4Yb56I%2FEEKoNIF65D%2Fs0IFsYcE%3D"
            },
            "targets": [
                {
                    "targetUrl": "https://my.blob.core.windows.net/target/try/Target-Spanish.docx?sv=2019-12-12&st=2021-01-26T18%3A31%3A11Z&se=2021-02-05T18%3A31%3A00Z&sr=c&sp=wl&sig=AgddSzXLXwHKpGHr7wALt2DGQJHCzNFF%2F3L94JHAWZM%3D",
                    "language": "es"
                },
                {
                    "targetUrl": "https://my.blob.core.windows.net/target/try/Target-German.docx?sv=2019-12-12&st=2021-01-26T18%3A31%3A11Z&se=2021-02-05T18%3A31%3A00Z&sr=c&sp=wl&sig=AgddSzXLXwHKpGHr7wALt2DGQJHCzNFF%2F3L94JHAWZM%3D",
                    "language": "de"
                }
            ]
        }
    ]
}
```

That's it! You've learned how to create SAS tokens to authorize how clients access your data.

## Next steps

> [!div class="nextstepaction"]
> [Get Started with Document Translation](../quickstarts/get-started-with-rest-api.md)
>
