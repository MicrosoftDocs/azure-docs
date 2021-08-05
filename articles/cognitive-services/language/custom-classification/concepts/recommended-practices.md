---
title: Recommended custom classification practices 
titleSuffix: Azure Cognitive Services
description: Learn about recommended practices when using custom classification, which is a part of Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
---

# Recommended practices for Custom text classification

Use this article to learn more about recommended practices when using custom text classification.

## Development life cycle

Follow the recommended development life cycle for best results:

* **Define schema**: Know your data and identify the classes you want differentiate between, avoid ambiguity.

* **Tag data**: The quality of data tagging is a key factor in determining model performance. Tag all the files you want to include in training. Files that belong to the same class should always have the same class, if you have a file that can fall into two classes use  **Multiple class classification** projects. Avoid class ambiguity, make sure that your classes are clearly separable from each other, especially with Single class classification projects.

* **Train model**: Your model starts learning from your tagged data.

* **View model evaluation details**: View the evaluation details for your model to determine how well it performs when introduced to new data.

* **Improve model**: Work on improving your model performance by examining the incorrect model predictions and examining data distribution.

* **Deploy model**: Deploying a model makes it available for use via the Analyze API.

* **Classify text**: Use your custom modeled for text classification tasks.

:::image type="content" source="../media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="../media/development-lifecycle.png":::

## Recommendations

### Schema design

The schema defines the classes that you need your model to classify your text into at runtime.

* Review files in your dataset to become familiar with their format and structure.

* Identify the classes/categories you want to extract from the data.

    For example, if you are classifying support tickets, your classes might be: *sign in issues*, *hardware issue*, *software issue*, and *new hardware request*.

* Avoid class ambiguity. Ambiguity happens when your classes are similar to each other. If your schema is ambiguous, you'll need more tagged data to train your model.
    
    For example, if you are classifying food recipes, they are similar to an extent, so to differentiate between *dessert recipe* and *main dish recipe* you will need to add more examples to overcome ambiguity since both files are similar. Avoiding ambiguity saves time, effort, and yields better results.
    
### Data selection

The quality of data you train your model with affects model performance greatly.

* Use real life data that reflects your domain problem space to effectively train your model.

    What about synthetic data? Whenever possible, use **real data** to train your model. Synthetic data will never have the variation found in real life data created by humans.
    If you need to start your model with synthetic data, you can do that - but note that you’ll need to add real data later to improve model performance.

* Use diverse data as much as you can to avoid overfitting your model.

    Overfitting happens when you train your model with similar data so that it's unable to make accurate predictions outside of what it was trained on. This makes the model useful only to the initial dataset, and not to any other datasets.

* Balance data distribution to represent expected data at runtime.
Make sure that all the scenarios/classes are adequately represented in your dataset.
Include less frequent classes in your data, if the model was not exposed a certain scenario/class in training it won't be able to recognize it in runtime.

> [!NOTE]
> If your files are in multiple languages, select the **multiple languages** option during [project creation](../how-to/create-project.md) and set the **language** option to the language of the majority of your files.


* Avoid duplicate files in your data. Duplicate data has a negative effect on training process, model metrics, and model performance.

* Consider where your data comes from. If you are collecting data from one person or department, you are likely missing diversity that will be important for your model to learn about all usage scenarios.

### Data Tagging

* As a general rule, more tagged data leads to better results.

* The number of tags you need depends on your data. Consider starting with 20 tags per class. This is highly dependent on your schema and class ambiguity; with ambiguous classes you need more tags. This also depends on the quality of your tagging.

* [View model evaluation details](../how-to/view-model-evaluation.md) after training is completed. The model is evaluated against the [test set](../how-to/train-model.md#data-groups), which is a set that was not introduced to the model during training. By doing this you get sense of how the model performs in real scenarios.

* [Improve your model](../how-to/improve-model.md). View the incorrect predictions your model made against the [validation set](../how-to/train-model.md#data-groups) to determine how you can tag your data better. Examine the data distribution to make sure each class is well represented in your dataset.

## Next steps

* [Create a project](../how-to/create-project.md)
* [Tag data](../how-to/tag-data.md)
