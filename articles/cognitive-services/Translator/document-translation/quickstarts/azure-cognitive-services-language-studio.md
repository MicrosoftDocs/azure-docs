---
title: Try Azure Cognitive Services Language Studio
description: "Use Document Translation in Azure Cognitive Services Language Studio."
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 02/07/2023
ms.author: lajanuar
recommendations: false
---

# Document Translation in Azure Cognitive Services Language Studio

Document Translation in [**Azure Cognitive Services Language Studio**](https://language.cognitive.azure.com/home) is a user interface that lets you explore, build, and integrate document translation into your workflows and applications. In this quickstart, you'll learn to translate documents from local storage or Azure Blob Storage, interactively, without the need to write code.

## Prerequisites

> [!NOTE]
>
> * Document Translation is currently supported in the Translator (single-service) resource only, and is **not** included in the Cognitive Services (multi-service) resource.
>
> * Document Translation is **only** supported in the S1 Standard Service Plan (Pay-as-you-go) or in the D3 Volume Discount Plan. *See* [Cognitive Services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).
>

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) enabled with a system-assigned managed identity. For more information, *see* [**Managed identities for Document Translation**](../how-to-guides/create-use-managed-identities.md).

  * An Azure blob storage account and managed identity are required to use Document Translation in Language Studio**.
  * You'll also need to create source and target containers for your Azure blob storage account.

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource):

    **Complete the Translator project and instance details fields as follows:**
  
    1. **Subscription**. Select one of your available Azure subscriptions.
    1. **Resource Group**. You can create a new resource group or add your resource to a pre-existing resource group that shares the same lifecycle, permissions, and policies.
    1. **Resource Region**. For this project, choose a **non-global** region. We'll use a [system-assigned managed identity](../how-to-guides/create-use-managed-identities.md) for authentication. Currently, Document Translation doesn't support managed identity in the global region.
    1. **Name**. Enter the name you have chosen for your resource. The name you choose must be unique within Azure.
    1. **Pricing tier**. Select Standard S1 to try the service. Document Translation isn't supported in the free tier.
    1. Select **Review + Create**.

* A **source document**. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.docx) for this quickstart.

Now that you've completed the prerequisites, let's start translating documents!

## Get started

1. Navigate to [Language Studio](https://language.cognitive.azure.com/home).

1. If you're using the Language Studio for the first time, you'll need to complete the sections:

    * **Choose a language resource** or create a new language resource in the Azure portal.

    * **Select your Azure Blob storage account**.

   :::image type="content" source="../media/language-studio/choose-language-resource.png" alt-text="Screenshot of the language studio choose your resource dialog window.":::

    > [!TIP]
    > You can update your selected directory and resource by selecting the Translator settings icon located in the left navigation section.
    > :::image type="content" source="../media/language-studio/translator-settings.png" alt-text="Screenshot of Translator settings.":::

1. Navigate to Language Studio and select the **Document translation** tile:

    :::image type="content" source="../media/language-studio/welcome-home-page.png" alt-text="Screenshot of the language studio home page.":::

1. If you're using the Document Translation feature for the first time, you'll start with the **Initial Configuration** to select your **Azure Translator resource** and **Document storage** account:

    :::image type="content" source="../media/language-studio/initial-configuration.png" alt-text="Screenshot of the initial configuration page.":::

1. In the **Basic information** section, choose the language to **Translate from** (source) or keep the default **Auto-detect language** and select the language to **Translate to** (target). You can select a maximum of 10 target languages. Once you've selected your source and target language(s), select **Next**:

    :::image type="content" source="../media/language-studio/basic-information.png" alt-text="Screenshot of the language studio basic information page.":::

1. In the **files and destination** section, select the files for translation. You can either upload the provided source document, upload your own document, or select files from your Azure Blob storage container:

    :::image type="content" source="../media/language-studio/files-destination-page.png" alt-text="Screenshot of the select files for translation page.":::

1. While still in the **files and destination** section, select the destination for translated files. You can choose to download the translated files or upload to your Azure blob storage container. Once you have made your choice, select **Next**:

    :::image type="content" source="../media/language-studio/target-file-destination.png" alt-text="Screenshot of the select destination for target files page.":::

1. (Optional) You can add **additional options** for custom translation and/or a glossary file. If you don't require these options, just select **Next**:

1. On the **Review and finish** page, check to make sure that your selections are correct. If not, you can go back. If everything looks good, select the **Start translation job** button.

    :::image type="content" source="../media/language-studio/start-translation.png" alt-text="Screenshot of the start translation job page.":::

1. On the **Job history** page, you'll find the **Translation job id** and the job status.

  > [!NOTE]
  > The list of translation jobs on the job history page includes all the jobs that were submitted through the chosen translator resource. If your colleague used the same translator resource to submit a job, you will see the status of that job on the job history page.

  :::image type="content" source="../media/language-studio/job-history.png" alt-text="Screenshot of the job history page.":::

That's it! You now know how to translate documents using Azure Cognitive Services Language Studio.

## Next steps

> [!div class="nextstepaction"]
>
> [Use Document Translation REST APIs programmatically](../how-to-guides/use-rest-api-programmatically.md)
