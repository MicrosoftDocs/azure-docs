---
title: Generate shared access signature (SAS) token for containers and blobs with Azure portal.
description: How to generate a Shared Access Token (SAS) for containers and blobs in the Azure portal
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

 In this article, you'll learn how to generate user delegation shared access signature (SAS) tokens for Azure Blob Storage containers. A user delegation SAS token is signed with Azure Active Directory (Azure AD) credentials instead of Azure storage keys. It provides superior secure and delegated access to resources in your Azure storage account.
At a high level, here's how it works: your application provides the SAS token to Azure storage as part of a request. If the storage service verifies that the SAS is valid, the request is authorized. If the SAS is deemed invalid, the request is declined with error code 403 (Forbidden).

Azure blob storage offers three types of resources:

* **Storage** accounts provide a unique namespace in Azure for your data.
* **Containers** are located in storage accounts and organize sets of blobs.
* **Blobs** are located in containers and store text and binary data.

> [!NOTE]
>
> * If your Azure storage account is protected by a Virtual Network (VNet) or firewall, you cannot grant access using a SAS token. You'll have to use a [**managed identity**](managed-identity-byos.md) to grant access to your storage resource.
>
> * [**Managed identity**](managed-identity-byos.md) supports both privately and publicly accessible Azure blob storage accounts.
>

## When to use a shared access signature

* If you're using storage containers with public access, you can opt to use a SAS token to grant limited access to your storage resources.

* When you're training a custom model, your assembled set of training documents **must** be uploaded to an Azure blob storage container. You can grant permission to your training resources with a user delegation SAS token.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).
* A [**Form Recognizer**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [**Cognitive Services multi-service**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource.
* A **standard performance** [**Azure Blob Storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll create containers to store and organize your blob data within your storage account. If you don't know how to create an Azure storage account with a container, following these quickstarts:

  * [**Create a storage account**](/azure/storage/common/storage-account-create). When creating your storage account, make sure to select **Standard** performance in the **Instance details → Performance** field.
  * [**Create a container**](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container). When creating your container, set the **Public access level** field to **Container** (anonymous read access for containers and blobs) in the **New Container** window.

## Upload your documents

1. Go to the [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:  **Your storage account** → **Data storage** → **Containers**

   :::image type="content" source="media/sas-tokens/data-storage-menu.png" alt-text="Screenshot: Data storage menu in the Azure portal.":::

1. Select a **container** from the list.
1. Select **Upload** from the menu at the top of the page.

    :::image type="content" source="media/sas-tokens/container-upload-button.png" alt-text="Screenshot: container upload button in the Azure portal.":::

1. The **Upload blob** window will appear.
1. Select your file(s) to upload.

    :::image type="content" source="media/sas-tokens/upload-blob-window.png" alt-text="Screenshot: upload blob window in the Azure portal.":::

> [!NOTE]
> By default, the REST API will use form documents that are located at the root of your container. However, you can use data organized in subfolders if specified in the API call. *See* [**Organize your data in subfolders**](/azure/applied-ai-services/form-recognizer/build-training-data-set#organize-your-data-in-subfolders-optional)

## Create a SAS with the Azure portal

> [!IMPORTANT]
>
> Generate and retrieve the SAS for your container, not for the storage account itself.

1. In the [Azure portal](https://ms.portal.azure.com/#home), navigate as follows:

     **Your storage account** → **Containers**
1. Select a container from the list.
1. Navigate to the right of the main window and select the three ellipses associated with your chosen container.
1. Select **Generate SAS** from the drop-down menu to open the **Generate SAS Window**.

    :::image type="content" source="media/sas-tokens/generate-sas.png" alt-text="Screenshot (Azure portal): generate sas token drop-down menu.":::

1. Select **Signing method** → **User delegation key**.

1. Define **Permissions** by checking or clearing the appropriate checkbox. Make sure the **Read**, **Write**, **Delete**, and **List** permissions are selected.

    :::image type="content" source="media/sas-tokens/sas-permissions.png" alt-text="Screenshot (Azure portal): SAS permission fields.":::

    >[!IMPORTANT]
    >
    > * If you receive a message, similar to the one below, you'll need to assign access to the blob data in your storage account:
    >
    >     :::image type="content" source="media/sas-tokens/need-permissions.png" alt-text="Screenshot: lack of of permissions warning.":::
    >
     > * [**Azure role-based access control**](/azure/role-based-access-control/overview) (Azure RBAC) is the authorization system used to manage access to Azure resources. Azure RBAC helps you manage access and permissions for your Azure resources.
    > * Follow our [**Assign an Azure role for access to blob data**](/azure/role-based-access-control/role-assignments-portal?tabs=current) guide to assign a role, that allows for read, write, and delete permissions for your Azure storage container, e.g., [**Storage Blob Data Contributor**](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor),.

1. Specify the signed key **Start** and **Expiry** times. **The value for the expiry time is a maximum of seven days from the start of the SAS**.

1. The **Allowed IP addresses** field is optional and specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, it won't be authorized.

1. The **Allowed protocols** field is optional and specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.

1. Review then select **Generate SAS token and URL**.

1. The **Blob SAS token** query string and **Blob SAS URL** will be displayed in the lower area of window. To use the **Blob SAS token**, append it a storage service URI.

1. **Copy and paste the Blob SAS token and URL values in a secure location. They'll only be displayed once and cannot be retrieved once the window is closed.**

## Create a SAS with Azure Command-Line Interface (CLI)

1. To create a user delegation SAS for a container using the Azure CLI, make sure that you have installed version 2.0.78 or later. To check your installed version, use the `az --version` command.

1. Call the [az storage container generate-sas](/cli/azure/storage/container?view=azure-cli-latest&preserve-view=true#az_storage_container_generate_sas) command.

1. The following parameters are required:

    * `auth-mode login`. This parameter ensures that requests made to Azure storage are authorized with your Azure AD credentials.
    * `as-user`.  This parameter indicates that the generated SAS is a user delegation SAS.

1. Supported permissions for a user delegation SAS on a container include Add (a), Create (c), Delete (d), List (l), Read (r), and Write (w).  Make sure **r**, **w**, **d**, and **l** are included as part of the permissions parameters.

1. When you create a user delegation SAS with the Azure CLI, the maximum interval during which the user delegation key is valid is seven days from the start date. Therefore, you should specify an expiry time for the SAS that is within seven days of the start time. *See* [**Create a user delegation SAS for a container or blob with the Azure CLI**](/azure/storage/blobs/storage-blob-user-delegation-sas-create-cli#use-azure-ad-credentials-to-secure-a-sas)

### Example

Generate a user delegation SAS.  Replace the placeholder values in the brackets with your own values:

```azurecli-interactive
az storage container generate-sas \
    --account-name <storage-account> \
    --name <container> \
    --permissions rwdl \
    --expiry <date-time> \
    --auth-mode login \
    --as-user
```

## How to use your Blob SAS URL

* To use your Blob SAS URL with the [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/TrainCustomModelAsync), add the SAS URL to the request body:

  ```json
  {
      "source":"<BLOB SAS URL>"
  }
  ```

* To use your **Blob SAS URL** with the [**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/connections/create), add the SAS URL to the **Connections Settings** → **Azure blob container** → **SAS URI** field:

  :::image type="content" source="media/sas-tokens/fott-add-sas-uri.png" alt-text="{alt-text}":::

That's it. You've learned how to generate SAS tokens to authorize how clients access your data.

> [!div class="nextstepaction"]
> [Build a training data set](build-training-data-set.md)
