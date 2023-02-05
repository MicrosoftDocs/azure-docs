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

 The Document Translation feature in Azure Cognitive Services Language Studio is a user interface that lets you explore, build, and integrate document translation into your workflows and applications. In this quickstart, you'll learn to translate documents from local storage or Azure Blob Storage interactively without the need to write code.

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

  1. **Resource Region**. For this project, we'll use a [system-assigned managed identity](../how-to-guides/create-use-managed-identities.md) for authentication. Currently, Document Translation doesn't support managed identity in the global region;choose a **non-global** region.

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

### Get your key and endpoint

Requests to the Translator service require a read-only key and custom endpoint to authenticate access.

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing Document Translation resource, navigate directly to your resource page.

1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

1. Copy and paste your **`key`** and **`document translation endpoint`** in a convenient location, such as *Microsoft Notepad*. Only one key is necessary to make an API call.

1. You'll paste it into the code sample to authenticate your request to the Document Translation service.

    :::image type="content" source="../media/document-translation-key-endpoint.png" alt-text="Screenshot showing the get your key field in Azure portal.":::

## Retrieve your source document(s)

For this project, you'll need a **source document** downloaded to your local environment. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.docx) for this quickstart.

  > [!NOTE]
  > Optionally, you can use your Azure blob storage account to store your source and target documents. If you choose to do so, you'll need to setup a managed identity for your Translator resource. For more information, *see* [Managed identities for Document Translation](../how-to-guides/create-use-managed-identities.md).

Now that you've completed the initial configurations, you should be able to start translating documents!

## Get started

1. Navigate to [Language Studio](https://language.cognitive.azure.com/home).

1. If you're using the Language Studio for the first time, initially, you'll need to choose your language resource or create a new language resource in the Azure portal:

   :::image type="content" source="../media/language-studio/choose-language-resource.png" alt-text="Screenshot of the language studio choose your resource dialog window.":::

  > [!TIP]
  > You can update your selected directory and resource on the settings page:
  > :::image type="content" source="../media/language-studio/studio-settings-page.png" alt-text="Screenshot of the studio settings page.":::

1. Navigate to the Language Studio and select the Document translation tile:

  :::image type="content" source="../media/language-studio/welcome-home-page.png" alt-text="Screenshot of the language studio home page.":::

1. Starting with the **Basic information** section, choose the language to **Translate from** (source) or keep the default **Auto-detect language** and select the language to **Translate to** (target). You can select a maximum of 10 target languages. Once you've selected your source and target language(s), select **Next** from the lower-left area of the page:

  :::image type="content" source="../media/language-studio/basic-information.png" alt-text="Screenshot of the language studio basic information page.":::

1. In the **files and destination** section, select the files for translation. You can either upload local files or select files from your blob storage container:

  :::image type="content" source="../media/language-studio/files-destination-page.png" alt-text="Screenshot of the select files for translation page.":::

1. While still in the **files and destination** section, select the destination for translated files. You can choose to download translated files or upload them to your Azure blob storage container. Once you have made your choice, select **Next**:

  :::image type="content" source="../media/language-studio/target-file-destination.png" alt-text="Screenshot of the select destination for target files page.":::

1. Optionally, you can add **additional options** for custom translation and/or a glossary file. If you don't require those options, select **Next**:

  :::image type="content" source="../media/language-studio/additional-options.png" alt-text="Screenshot of the additional options page.":::

1. On the **Review and finish** page, check to make sure that your selections are correct. If not, you can go back, If so, select the **Start translation job** button.

  :::image type="content" source="../media/language-studio/start-translation.png" alt-text="Screenshot of the start translation job page.":::

1. On the **Job history** page, you can find the **Translation job id** and the job status.

  > [!NOTE]
  > The list of translation jobs on the job history page includes all the jobs that were submitted through the chosen translator resource. If your colleague used the same translator resource to submit a job, you will see the status of that job on the job history page.

  :::image type="content" source="../media/language-studio/job-history.png" alt-text="Screenshot of the job history page.":::

## Troubleshooting

* **Managed identity error**. If you're using source documents located in your Azure blob storage container, make sure that **managed identity** is enabled and you've selected the **Storage blob data contributor** role identity:

  :::image type="content" source="../media/language-studio/troubleshoot-managed-identity.png" alt-text="Screenshot of the managed identity failed connection error.":::

That's it! You now know how to translate documents using Azure Cognitive Services Language Studio.

## Next steps

> [!div class="nextstepaction"]
>
> [Use Document Translation REST APIs programmatically](../how-to-guides/use-rest-api-programmatically.md)
