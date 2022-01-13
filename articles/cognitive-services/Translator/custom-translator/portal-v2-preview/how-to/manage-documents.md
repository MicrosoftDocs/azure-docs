---
title: How to manage documents - Custom Translator
titleSuffix: Azure Cognitive Services
description: The document upload feature uploads parallel documents (two documents where one is the origin and the other is the translation) into the service.  
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 08/17/2020
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to know how to create and upload documents, so that I can train custom model.
---
# Manage documents

[Custom Translator](https://portal.customtranslator.azure.ai) enables you to upload the parallel document types, listed in `Training material`, to train your translation systems. [Parallel documents](what-are-parallel-documents.md) are pairs of documents where one is a translation of the other. One document in the pair contains sentences in the source language and the other document contains these sentences translated into the target language.

Before uploading your documents, review the [document formats and naming convention guidance](document-formats-naming-convention.md) to make sure your file format is supported in Custom Translator.

## How to create document types

### Source your data

Finding in-domain quality data is often a challenging task which varies based on the customer classification. There are three common types, an enterprise customer who tends to have data in translation memory accumulated over many years, a customer with monolingual data that needs to be synthesized to a target language to form sentence-pair (a source sentence and its target translation), or long tail customer who would need to crawl online portals, e.g., own portal, competition, government, NGO, judicial, etc. to collect source sentences and synthesis to target sentences.

### Training material for each document types

| What goes in | What it does | Rules to follow |
|---|---|---|
| Training documents | Teaches the system your terminology and style | Be liberal. Any in-domain human translation is better then machine translation. Add and remove documents as you go and try to improve the [BLEU score](https://docs.microsoft.com/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma). |
| Tuning documents | Train the Neural Machine Translation parameters | Be strict. Compose them to be optimally respresntative of what you are going to translation in the future. | 
| Test documents | Calculate the [BLEU score](https://docs.microsoft.com/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma) - just for you | Be strict. Compose them to be optimally respresntative of what you are going to translation in the future. |
| Phrase dictionary | Forces the given translation with a probability of 1. | Be restrictive. Case-sensitive and safe to use only for compound nouns and named entities. Better to not use and let the system learn. |
| Sentence dictionary | Forces the given translation with a probability of 1. | Case-insensitive and good for common in domain short sentences. |

## How to upload documents

Document types are associated with the language pair selected when you create a project. To upload documents,

1.  Sign-in to [Custom Translator](https://portal.customtranslator.azure.ai) portal. Your default workspace is loaded and a list of previously created projects are displayed. 
2.  Select on the desired project `Name`. By default, **Manage documents** blade is selected and a list of all relevent documents are displayed.
3.  Select **Add document set** and Choose the document type:
    -  Training set: These document(s) will be used for training set.
    -  Testing set: These document(s) will be used for testing set.
    -  Tuning set: These document(s) will be used for tuning set.
    -  Dictionary set:
        - Phrase Dictionary: These document(s) will be used for phrase dictionary.
        - Sentence Dictionary: These document(s) will be used for sentence dictionary

4.  Select **Next**

![Document upload link](media/how-to/how-to-upload-1.png)

>[!Note]
>Choosing **Dictionary set** launches **Choose type of dictionary** dialog. 
>Choose one and select **Next**

5.  Select on document format dial.

    ![Upload document page](media/how-to/how-to-upload-2.png)

    - For **Parallel documents**, fill in the `Document set name` and select **Browse files** to select source and target documents.
    - For **Translation memory (TM)** file or **Upload multiple sets with ZIP**, select **Browse files** to select the file 

6. Select **Upload**

At this point, we're processing your documents and attempting to extract sentences as indecated in the upload notification. Once done processing, you will see upload successful notification.

![Upload document processing dialog](media/quickstart/document-upload-notification.png)

## Next steps

- Learn [how to train a model](how-to-train-model.md).
- Learn [how to view model details](how-to-model-details.md).
- Learn [how to test and evaluate model quality](how-to-test-model-details.md).
- Learn [how to publish model](how-to-publish-model.md).
- Learn [how to translate with custom models](how-to-translate.md).
