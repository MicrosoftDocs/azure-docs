---
title: Build and upload training documents
titleSuffix: Azure Cognitive Services
description: How to build and upload parallel documents (two documents where one is the origin and the other is the translation) using Custom Translator.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 01/20/2022
ms.author: lajanuar
ms.topic: how-to
---

# Build and manage training documents 

[Custom Translator](../overview.md) enables you to build translation models that reflect your business, industry, and domain-specific terminology and style. Training and deploying a custom model is easy and doesn't require any programming skills. Custom Translator allows you to upload parallel files, translation memory files, or zip files.

[Parallel documents](../what-are-parallel-documents.md) are pairs of documents where one (target) is a translation of the other (source). One document in the pair contains sentences in the source language and the other document contains those sentences translated into the target language.

Before uploading your documents, review the [document formats and naming convention guidance](../document-formats-naming-convention.md) to make sure your file format is supported by Custom Translator.

## How to create document sets

Finding in-domain quality data is often a challenging task that varies based on user classification. Here are some questions you can ask yourself as you evaluate what data may be available to you:

- Enterprises often have a wealth of translation data that has accumulated over many years of using human translation. Does your company have previous translation data available that you can use?

- Do you have a vast amount of monolingual data? Monolingual data is data in only one language. If so, can you get translations for this data?

- Can you crawl online portals to collect source sentences and synthesize target sentences?

### Training material for each document types

| Source | What it does | Rules to follow |
|---|---|---|
| Bilingual training documents | Teaches the system your terminology and style. | **Be liberal**. Any in-domain human translation is better than machine translation. Add and remove documents as you go and try to improve the [BLEU score](../what-is-bleu-score.md?WT.mc_id=aiml-43548-heboelma). |
| Tuning documents | Trains the Neural Machine Translation parameters. | **Be strict**. Compose them to be optimally representative of what you are going to translation in the future. |
| Test documents | Calculate the [BLEU score](../beginners-guide.md#what-is-a-bleu-score).| **Be strict**. Compose test documents to be optimally representative of what you plan to translate in the future. |
| Phrase dictionary | Forces the given translation 100% of the time. | **Be restrictive**. A phrase dictionary is case-sensitive and any word or phrase listed is translated in the way you specify. In many cases, it's better to not use a phrase dictionary and let the system learn. |
| Sentence dictionary | Forces the given translation 100% of the time. | **Be strict**. A sentence dictionary is case-insensitive and good for common in domain short sentences. For a sentence dictionary match to occur, the entire submitted sentence must match the source dictionary entry. If only a portion of the sentence matches, the entry won't match. |

## How to upload documents

Document types are associated with the language pair selected when you create a project.

1. Sign-in to [Custom Translator](https://portal.customtranslator.azure.ai) portal. Your default workspace is loaded and a list of previously created projects are displayed.

1. Select the desired project **Name**. By default, the **Manage documents** blade is selected and a list of previously uploaded documents is displayed.

1. Select **Add document set** and choose the document type:

    - Training set
    - Testing set
    - Tuning set
    - Dictionary set:
        - Phrase Dictionary
        - Sentence Dictionary

1. Select **Next**.

   :::image type="content" source="../media/how-to/upload-1.png" alt-text="Screenshot illustrating the document upload link.":::

   >[!Note]
   >Choosing **Dictionary set** launches **Choose type of dictionary** dialog.
   >Choose one and select **Next**

1. Select your documents format from the radio buttons.

   :::image type="content" source="../media/how-to/upload-2.png" alt-text="Screenshot illustrating the upload document page.":::

    - For **Parallel documents**, fill in the `Document set name` and select **Browse files** to select source and target documents.
    - For **Translation memory (TM)** file or **Upload multiple sets with ZIP**, select **Browse files** to select the file

1. Select **Upload**.

At this point, Custom Translator is processing your documents and attempting to extract sentences as indicated in the upload notification. Once done processing, you'll see the upload successful notification.

   :::image type="content" source="../media/quickstart/document-upload-notification.png" alt-text="Screenshot illustrating the upload document processing dialog window.":::

## Next steps

- Learn [how to train a model](train-custom-model.md).
- Learn [how to test and evaluate model quality](view-model-test-translation.md).
- Learn [how to publish model](publish-model.md).
- Learn [how to translate with custom models](translate-with-custom-model.md).