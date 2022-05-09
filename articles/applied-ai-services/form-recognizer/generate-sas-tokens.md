---
title: Generate SAS tokens for containers and blobs with the Azure portal
description: Learn how to generate shared access signature (SAS) tokens for containers and blobs in the Azure portal.
ms.topic: how-to
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.date: 09/23/2021
ms.author: lajanuar
recommendations: false
---

# Generate SAS tokens for storage containers

In this article, you'll learn how to generate user delegation shared access signature (SAS) tokens for Azure Blob Storage containers. A user delegation SAS token is signed with Azure Active Directory (Azure AD) credentials instead of Azure Storage keys. It provides superior secure and delegated access to resources in your Azure storage account.

At a high level, here's how it works: your application provides the SAS token to Azure Storage as part of a request. If the storage service verifies that the shared access signature is valid, the request is authorized. If the shared access signature is considered invalid, the request is declined with error code 403 (Forbidden).

Azure Blob Storage offers three types of resources:

* **Storage** accounts provide a unique namespace in Azure for your data.
* **Containers** are located in storage accounts and organize sets of blobs.
* **Blobs** are located in containers and store text and binary data.

> [!NOTE]
>
> * If your Azure storage account is protected by a virtual network or firewall, you can't grant access by using a SAS token. You'll have to use a [managed identity](managed-identity-byos.md) to grant access to your storage resource.
> * [Managed identity](managed-identity-byos.md) supports both privately and publicly accessible Azure Blob Storage accounts.
>

## When to use a shared access signature

* If you're using storage containers with public access, you can opt to use a SAS token to grant limited access to your storage resources.
* When you're training a custom model, your assembled set of training documents *must* be uploaded to an Azure Blob Storage container. You can grant permission to your training resources with a user delegation SAS token.

## Prerequisites

To get started, you'll need:

* An active [Azure account](https://azure.microsoft.com/free/cognitive-services/). If you don't have one, you can [create a free account](https://azure.microsoft.com/free/).
* A [Form Recognizer](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [Cognitive Services multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource.
* A **standard performance** [Azure Blob Storage account](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll create containers to store and organize your blob data within your storage account. If you don't know how to create an Azure storage account with a container, following these quickstarts:

  * [Create a storage account](../../storage/common/storage-account-create.md). When you create your storage account, select **Standard** performance in the **Instance details** > **Performance** field.
  * [Create a container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). When you create your container, set **Public access level** to **Container** (anonymous read access for containers and blobs) in the **New Container** window.

## Upload your documents

1. Go to the [Azure portal](https://portal.azure.com/#home). Select **Your storage account** > **Data storage** > **Containers**.

   :::image type="content" source="media/sas-tokens/data-storage-menu.png" alt-text="Screenshot that shows the Data storage menu in the Azure portal.":::

1. Select a container from the list.
1. Select **Upload** from the menu at the top of the page.

    :::image type="content" source="media/sas-tokens/container-upload-button.png" alt-text="Screenshot that shows the container Upload button in the Azure portal.":::

   The **Upload blob** window appears.
1. Select your files to upload.

    :::image type="content" source="media/sas-tokens/upload-blob-window.png" alt-text="Screenshot that shows the Upload blob window in the Azure portal.":::

> [!NOTE]
> By default, the REST API uses form documents located at the root of your container. You can also use data organized in subfolders if specified in the API call. For more information, see [Organize your data in subfolders](./build-training-data-set.md#organize-your-data-in-subfolders-optional).

## Create a shared access signature with the Azure portal

> [!IMPORTANT]
>
> Generate and retrieve the shared access signature for your container, not for the storage account itself.

1. In the [Azure portal](https://portal.azure.com/#home), select **Your storage account** > **Containers**.
1. Select a container from the list.
1. Go to the right of the main window, and select the three ellipses associated with your chosen container.
1. Select **Generate SAS** from the dropdown menu to open the **Generate SAS** window.

    :::image type="content" source="media/sas-tokens/generate-sas.png" alt-text="Screenshot that shows the  Generate SAS token dropdown menu in the Azure portal.":::

1. Select **Signing method** > **User delegation key**.

1. Define **Permissions** by selecting or clearing the appropriate checkbox. Make sure the **Read**, **Write**, **Delete**, and **List** permissions are selected.

    :::image type="content" source="media/sas-tokens/sas-permissions.png" alt-text="Screenshot that shows the SAS permission fields in the Azure portal.":::

    >[!IMPORTANT]
    >
    > * If you receive a message similar to the following one, you'll need to assign access to the blob data in your storage account:
    >
    >     :::image type="content" source="media/sas-tokens/need-permissions.png" alt-text="Screenshot that shows the lack of permissions warning.":::
    >
     > * [Azure role-based access control](../../role-based-access-control/overview.md) (Azure RBAC) is the authorization system used to manage access to Azure resources. Azure RBAC helps you manage access and permissions for your Azure resources.
    > * [Assign an Azure role for access to blob data](../../role-based-access-control/role-assignments-portal.md?tabs=current) shows you how to assign a role that allows for read, write, and delete permissions for your Azure storage container. For example, see [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor).

1. Specify the signed key **Start** and **Expiry** times. The value for the expiry time is a maximum of seven days from the start of the shared access signature.

1. The **Allowed IP addresses** field is optional and specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, it won't be authorized.

1. The **Allowed protocols** field is optional and specifies the protocol permitted for a request made with the shared access signature. The default value is HTTPS.

1. Select **Generate SAS token and URL**.

1. The **Blob SAS token** query string and **Blob SAS URL** appear in the lower area of the window. To use the Blob SAS token, append it to a storage service URI.

1. Copy and paste the **Blob SAS token** and **Blob SAS URL** values in a secure location. They're displayed only once and can't be retrieved after the window is closed.

## Create a shared access signature with the Azure CLI

1. To create a user delegation SAS for a container by using the Azure CLI, make sure that you've installed version 2.0.78 or later. To check your installed version, use the `az --version` command.

1. Call the [az storage container generate-sas](/cli/azure/storage/container#az-storage-container-generate-sas) command.

1. The following parameters are required:

    * `auth-mode login`. This parameter ensures that requests made to Azure Storage are authorized with your Azure AD credentials.
    * `as-user`. This parameter indicates that the generated SAS is a user delegation SAS.

1. Supported permissions for a user delegation SAS on a container include Add (a), Create (c), Delete (d), List (l), Read (r), and Write (w). Make sure **r**, **w**, **d**, and **l** are included as part of the permissions parameters.

1. When you create a user delegation SAS with the Azure CLI, the maximum interval during which the user delegation key is valid is seven days from the start date. Specify an expiry time for the shared access signature that's within seven days of the start time. For more information, see [Create a user delegation SAS for a container or blob with the Azure CLI](../../storage/blobs/storage-blob-user-delegation-sas-create-cli.md#use-azure-ad-credentials-to-secure-a-sas).

### Example

Generate a user delegation SAS. Replace the placeholder values in the brackets with your own values:

```azurecli-interactive
az storage container generate-sas \
    --account-name <storage-account> \
    --name <container> \
    --permissions rwdl \
    --expiry <date-time> \
    --auth-mode login \
    --as-user
```

## Use your Blob SAS URL

Two options are available:

* To use your Blob SAS URL with the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/TrainCustomModelAsync), add the SAS URL to the request body:

  ```json
  {
      "source":"<BLOB SAS URL>"
  }
  ```

* To use your Blob SAS URL with the [Form Recognizer labeling tool](https://fott-2-1.azurewebsites.net/connections/create), add the SAS URL to the **Connection Settings** > **Azure blob container** > **SAS URI** field:

  :::image type="content" source="media/sas-tokens/fott-add-sas-uri.png" alt-text="Screenshot that shows the SAS URI field.":::

That's it. You've learned how to generate SAS tokens to authorize how clients access your data.

## Next step

> [!div class="nextstepaction"]
> [Build a training data set](build-training-data-set.md)