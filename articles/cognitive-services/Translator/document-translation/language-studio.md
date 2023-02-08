---
title: Try Document Translation in Language Studio
description: "Document Translation in Azure Cognitive Services Language Studio."
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 02/08/2023
ms.author: lajanuar
recommendations: false
---

# Document Translation in Language Studio

 Document Translation in [**Azure Cognitive Services Language Studio**](https://language.cognitive.azure.com/home) is a no-code user interface that lets you translate documents from local storage or Azure Blob Storage interactively.

## Prerequisites

> [!NOTE]
>
> * Document Translation is currently supported in the Translator (single-service) resource only, and is **not** included in the Cognitive Services (multi-service) resource.
>
> * Document Translation is **only** supported in the S1 Standard Service Plan (Pay-as-you-go) or in the D3 Volume Discount Plan. *See* [Cognitive Services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).
>

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource) with [**system-assigned managed identity**](how-to-guides/create-use-managed-identities.md#enable-a-system-assigned-managed-identity) enabled and a [**Storage Blob Data Contributor**](how-to-guides/create-use-managed-identities.md#grant-access-to-your-storage-account) role assigned. For more information, *see* [**Managed identities for Document Translation**](how-to-guides/create-use-managed-identities.md). Also, make sure the region and pricing sections are completed as follows:

  * **Resource Region**. For this project, choose a **non-global** region. For Document Translation, [system-assigned managed identity](how-to-guides/create-use-managed-identities.md) isn't supported in the global region.
  * **Pricing tier**. Select Standard S1 or D3 to try the service. Document Translation isn't supported in the free tier.

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). An active Azure blob storage account is required to use Document Translation in the Language Studio.

* A **source document**. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.docx).

Now that you've completed the prerequisites, let's start translating documents!

## Get started

1. Navigate to [Language Studio](https://language.cognitive.azure.com/home).

1. If you're using the Language Studio for the first time, select your Azure directory, Azure subscription, and Translator resource:

   :::image type="content" source="media/language-studio/choose-language-resource.png" alt-text="Screenshot of the language studio choose your resource dialog window.":::

    > [!TIP]
    > You can update your selected directory and resource by selecting the Translator settings icon located in the left navigation section.

1. Navigate to Language Studio and select the **Document translation** tile:

    :::image type="content" source="media/language-studio/welcome-home-page.png" alt-text="Screenshot of the language studio home page.":::

1. If you're using the Document Translation feature for the first time, start with the **Initial Configuration** to select your **Azure Translator resource** and **Document storage** account:

    :::image type="content" source="media/language-studio/initial-configuration.png" alt-text="Screenshot of the initial configuration page.":::

1. In the **Basic information** section, choose the language to **Translate from** (source) or keep the default **Auto-detect language** and select the language to **Translate to** (target). You can select a maximum of 10 target languages. Once you've selected your source and target language(s), select **Next**:

    :::image type="content" source="media/language-studio/basic-information.png" alt-text="Screenshot of the language studio basic information page.":::

1. In the **files and destination** section, select the files for translation. You can either upload the provided source document, upload your own document, or select files from your Azure Blob storage [container](../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container):

    :::image type="content" source="media/language-studio/files-destination-page.png" alt-text="Screenshot of the select files for translation page.":::

1. While still in the **files and destination** section, select the destination for translated files. You can choose to download the translated files or upload to your Azure blob storage [container](../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). Once you have made your choice, select **Next**:

    :::image type="content" source="media/language-studio/target-file-destination.png" alt-text="Screenshot of the select destination for target files page.":::

1. (Optional) You can add **additional options** for custom translation and/or a glossary file. If you don't require these options, just select **Next**.

1. On the **Review and finish** page, check to make sure that your selections are correct. If not, you can go back. If everything looks good, select the **Start translation job** button.

    :::image type="content" source="media/language-studio/start-translation.png" alt-text="Screenshot of the start translation job page.":::

1. The **Job history** page contains the **Translation job id** and job status.

  > [!NOTE]
  > The list of translation jobs on the job history page includes all the jobs that were submitted through the chosen translator resource. If your colleague used the same translator resource to submit a job, you will see the status of that job on the job history page.

  :::image type="content" source="media/language-studio/job-history.png" alt-text="Screenshot of the job history page.":::

That's it! You now know how to translate documents using Azure Cognitive Services Language Studio.

## Next steps

> [!div class="nextstepaction"]
>
> [Use Document Translation REST APIs programmatically](how-to-guides/use-rest-api-programmatically.md)
