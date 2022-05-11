---
title: How to train your custom text classification model - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about how to train your model for custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 04/05/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# How to train a custom text classification model


Training is the process where the model learns from your [tagged data](tag-data.md). After training is completed, you will be able to [use the model evaluation metrics](../how-to/view-model-evaluation.md) to determine if you need to [improve your model](../how-to/improve-model.md).

## Prerequisites

Before you train your model you need:

* [A successfully created project](create-project.md) with a configured Azure blob storage account, 
* Text data that has [been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md)

See the [application development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Train model in Language Studio

1. Go to your project page in [Language Studio](https://aka.ms/LanguageStudio).

2. Select **Train** from the left side menu.

3. Select **Start a training job** from the top menu.

4. To train a new model, select **Train a new model** and type in the model name in the text box below. You can **overwrite an existing model** by selecting this option and select the model you want from the dropdown below.

    :::image type="content" source="../media/train-model.png" alt-text="Create a new model" lightbox="../media/train-model.png":::

If you have enabled the [**Split project data manually** selection](tag-data.md#tag-your-data) when you were tagging your data, you will see two training options:

* **Automatic split the testing**: The data will be randomly split for each class between training and testing sets, according to the percentages you choose. The default value is 80% for training and 20% for testing. To change these values, choose which set you want to change and write the new value.

* **Use a manual split**: Assign each document to either the training or testing set, this required first adding files in the test dataset.

5. Click on the **Train** button.

6. You can check the status of the training job in the same page. Only successfully completed training jobs will generate models.

You can only have one training job running at a time. You cannot create or start other tasks in the same project. 

<!-- After training has completed successfully, keep in mind:

* [View the model's evaluation details](../how-to/view-model-evaluation.md) After model training, model evaluation is done against the [test set](../how-to/train-model.md#data-splits), which was not introduced to the model during training. By viewing the evaluation, you can get a sense of how the model performs in real-life scenarios.

* [Examine data distribution](../how-to/improve-model.md#examine-data-distribution-from-language-studio) Make sure that all classes are well represented and that you have a balanced data distribution to make sure that all your classes are adequately represented. If a certain class is tagged far less frequent than the others, this class is likely under-represented and most occurrences probably won't be recognized properly by the model at runtime. In this case, consider adding more files that belong to this class to your dataset.
 -->
* [Improve performance (optional)](../how-to/improve-model.md) Other than revising [tagged data](tag-data.md) based on error analysis, you may want to increase the number of tags for under-performing entity types, or improve the diversity of your tagged data. This will help your model learn to give correct predictions, over potential linguistic phenomena that cause failure.

<!-- * Define your own test set: If you are using a random split option and the resulting test set was not comprehensive enough, consider defining your own test to include a variety of data layouts and balanced tagged classes.
 -->
## Next steps

After training is completed, you will be able to [use the model evaluation metrics](../how-to/view-model-evaluation.md) to optionally [improve your model](../how-to/improve-model.md). Once you're satisfied with your model, you can deploy it, making it available to use for [classifying text](call-api.md).
