---
title: Train model
titleSuffix: Azure AI services
description: How to train a custom model
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: how-to
---
# Train a custom model

A model provides translations for a specific language pair. The outcome of a successful training is a model. To train a custom model, three mutually exclusive document types are required: training, tuning, and testing. If only training data is provided when queuing a training, Custom Translator will automatically assemble tuning and testing data. It will use a random subset of sentences from your training documents, and exclude these sentences from the training data itself. A minimum of 10,000 parallel training sentences are required to train a full model.

## Create model

1. Select the **Train model** blade.

1. Type the **Model name**.

1. Keep the default **Full training** selected or select **Dictionary-only training**.

   >[!Note]
   >Full training displays all uploaded document types. Dictionary-only displays dictionary documents only.

1. Under **Select documents**, select the documents you want to use to train the model, for example, `sample-English-German` and review the training cost associated with the selected number of sentences.

1. Select **Train now**.

1. Select **Train** to confirm.

    >[!Note]
    >**Notifications** displays model training in progress, e.g., **Submitting data** state. Training model takes few hours, subject to the number of selected sentences.

   :::image type="content" source="../media/quickstart/train-model.png" alt-text="Screenshot illustrating the train model blade.":::

## When to select dictionary-only training

For better results, we recommended letting the system learn from your training data. However, when you don't have enough parallel sentences to meet the 10,000 minimum requirements, or sentences and compound nouns must be rendered as-is, use dictionary-only training. Your model will typically complete training much faster than with full training. The resulting models will use the baseline models for translation along with the dictionaries you've added. You won't see BLEU scores or get a test report.

> [!Note] 
>Custom Translator doesn't sentence-align dictionary files. Therefore, it is important that there are an equal number of source and target phrases/sentences in your dictionary documents and that they are precisely aligned. If not, the document upload will fail.

## Model details

1. After successful model training, select the **Model details** blade.

1. Select the **Model Name** to review training date/time, total training time, number of sentences used for training, tuning, testing, dictionary, and whether the system generated the test and tuning sets. You'll use `Category ID` to make translation requests.

1. Evaluate the model [BLEU score](../beginners-guide.md#what-is-a-bleu-score). Review the test set: the **BLEU score** is the custom model score and the **Baseline BLEU** is the pre-trained baseline model used for customization. A higher **BLEU score** means higher translation quality using the custom model.

   :::image type="content" source="../media/quickstart/model-details.png" alt-text="Screenshot illustrating model details fields.":::

## Duplicate model

1. Select the **Model details** blade.

1. Hover over the model name and check the selection button.

1. Select **Duplicate**.

1. Fill in **New model name**.

1. Keep **Train immediately** checked if no further data will be selected or uploaded, otherwise, check **Save as draft**

1. Select **Save**

   > [!Note]
   >
   > If you save the model as `Draft`, **Model details** is updated with the model name in `Draft` status.
   >
   > To add more documents, select on the model name and follow `Create model` section above.

   :::image type="content" source="../media/how-to/duplicate-model.png" alt-text="Screenshot illustrating the duplicate model blade.":::

## Next steps

- Learn [how to test and evaluate model quality](test-your-model.md).
- Learn [how to publish model](publish-model.md).
- Learn [how to translate with custom models](translate-with-custom-model.md).
