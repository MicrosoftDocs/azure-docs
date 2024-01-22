---
title: How to tag utterances in an orchestration workflow project
titleSuffix: Azure AI services
description: Use this article to tag utterances
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-orchestration
---

# Add utterances in Language Studio

Once you have [built a schema](build-schema.md), you should add training and testing utterances to your project. The utterances should be similar to what your users will use when interacting with the project. When you add an utterance, you have to assign which intent it belongs to.

Adding utterances is a crucial step in project development lifecycle; this data will be used in the next step when training your model so that your model can learn from the added data. If you already have utterances, you can directly [import it into your project](create-project.md#import-an-orchestration-workflow-project), but you need to make sure that your data follows the [accepted data format](../concepts/data-formats.md). Labeled data informs the model how to interpret text, and is used for training and evaluation.

## Prerequisites

* A successfully [created project](create-project.md).

See the [project development lifecycle](../overview.md#project-development-lifecycle) for more information.


## How to add utterances

Use the following steps to add utterances:

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. From the left side menu, select **Add utterances**.

3. From the top pivots, you can change the view to be **training set** or **testing set**.  Learn more about [training and testing sets](train-model.md#data-splitting) and how they're used for model training and evaluation.

3. From the **Select intent** dropdown menu, select one of the intents. Type in your utterance, and press the enter key in the utterance's text box to add the utterance. You can also upload your utterances directly by clicking on **Upload utterance file** from the top menu, make sure it follows the [accepted format](../concepts/data-formats.md#utterance-format).
    
    > [!Note]
    > If you are planning on using **Automatically split the testing set from training data** splitting, add all your utterances to the training set.
    > You can add training utterances to **non-connected** intents only.
        
    :::image type="content" source="../media/tag-utterances.png" alt-text="A screenshot of the page for tagging utterances in Language Studio." lightbox="../media/tag-utterances.png":::
   
5. Under **Distribution** you can view the distribution across training and testing sets. You can **view utterances per intent**:

* Utterance per non-connected intent
* Utterances per connected intent

## Next Steps
* [Train Model](./train-model.md)
