---
title: Try Azure Cognitive Services Language Studio
description: "Use Document Translation in Azure Cognitive Services Language Studio."
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 02/02/2023
ms.author: lajanuar
recommendations: false
---

# Document Translation in Azure Cognitive Services Language Studio

 The Document Translation feature in Azure Cognitive Services Language Studio is a user interface that lets you explore, build, and integrate document translation into your workflows and applications. In this quickstart you'll learn to translate documents from local storage or Azure Blob Storage interactively, and without the need to write code.

## Prerequisites

> [!NOTE]
>
> * Document Translation is currently supported in the Translator (single-service) resource only, and is **not** included in the Cognitive Services (multi-service) resource.
>
> * Document Translation is **only** supported in the S1 Standard Service Plan (Pay-as-you-go) or in the D3 Volume Discount Plan. *See* [Cognitive Services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).
>

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll create containers to store and organize your blob data within your storage account.

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource):

  **Complete the Translator project and instance details fields as follows:**

  1. **Subscription**. Select one of your available Azure subscriptions.

  1. **Resource Group**. You can create a new resource group or add your resource to a pre-existing resource group that shares the same lifecycle, permissions, and policies.

  1. **Resource Region**. For this project, we will use a [system-assigned managed identity](../how-to-guides/create-use-managed-identities.md) for authentication. Currently, Document Translation doesn't support managed identity in the global region;choose a **non-global** region.

  1. **Name**. Enter the name you have chosen for your resource. The name you choose must be unique within Azure.

     > [!NOTE]
     > Document Translation requires a custom domain endpoint. The value that you enter in the Name field will be the custom domain name parameter for your endpoint.

  1. **Pricing tier**. Document Translation isn't supported in the free tier. **Select Standard S1 to try the service**.

  1. Select **Review + Create**.

  1. Review the service terms and select **Create** to deploy your resource.

  1. After your resource has successfully deployed, select **Go to resource**.

## Your custom domain name and key

The custom domain endpoint is a URL formatted with your resource name, hostname, and Translator subdirectories and is available in the Azure portal.

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * Don't use the Text Translation endpoint found on your Azure portal resource *Keys and Endpoint* page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

### Retrieve your key and endpoint

Requests to the Translator service require a read-only key and custom endpoint to authenticate access.

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing Document Translation resource, navigate directly to your resource page.

1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

1. Copy and paste your **`key`** and **`document translation endpoint`** in a convenient location, such as *Microsoft Notepad*. Only one key is necessary to make an API call.

1. You'll paste it into the code sample to authenticate your request to the Document Translation service.

    :::image type="content" source="../media/document-translation-key-endpoint.png" alt-text="Screenshot showing the get your key field in Azure portal.":::

## Create Azure blob storage containers

You'll need to  [**create containers**](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). The source files container is required; the target files container is optional.

* **Source container**. This container is where you upload your files for translation (required).
* **Target container**. This container is where your translated files can be stored (optional) or uou can choose to download your translated documents to your local environment.

## Grant access with a system-assigned managed identity

You need to grant Translator access to your storage account before it can create, read, or delete blobs. You will need to enable a system-assigned managed identity for Translator and then you can use Azure role-based access control (`Azure RBAC`), to give Translator access to your Azure storage containers.

To learn how to enable a system-assigned managed identity and grant access to your storage account, see [**Managed identities for Document Translation**](../how-to-guides/create-use-managed-identities.md).

Now that you've completed the initial configurations, you should be able to start translating documents!

## Get started

1. Navigate to [Language Studio](https://language.cognitive.azure.com/home).

1. If this is your first visit to Language Studio, you'll need to choose your language resource or create a new language resource in the Azure portal:

   :::image type="content" source="../media/language-studio/choose-language-resource.png" alt-text="Screenshot of the language studio choose your resource dialog window.":::

  > [!TIP]
  > You can update your selected directory and resource on the settings page:
  > :::image type="content" source="../media/language-studio/studio-settings-page.png" alt-text="Screenshot of the studio settings page.":::

1. Navigate to the Language Studio and select the Document translation tile:

  :::image type="content" source="../media/language-studio/welcome-home-page.png" alt-text="Screenshot of the language studio home page.":::

1. Starting with the **Basic information** section, choose the language to **Translate from** (source) or keep the default **Auto-detect language** and select the language to **Translate to** (target). You can select a maximum of 10 target languages:

  :::image type="content" source="../media/language-studio/basic-information.png" alt-text="Screenshot of the language studio basic information page.":::