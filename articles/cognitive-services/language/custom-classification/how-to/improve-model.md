---
title: How to improve custom text classification model performance
titleSuffix: Azure Cognitive Services
description: Learn about improving a model for Custom Text Classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Improve model performance

After you've trained your model you reviewed its evaluation details, you can start to improve model performance. In this article, you will review inconsistencies between the predicted classes and classes tagged by the model, and examine data distribution.

## Prerequisites

* Successfully created a [Custom text classification project](create-project.md).
* Completed [model training](train-model.md) successfully.
* Viewed [model evaluation details](view-model-evaluation.md).

> [!NOTE]
> This guide focuses on data from the [validation set](train-model.md#data-groups) that was created during training.

# [Using Language Studio](#tab/language-studio)

## Review the validation set using the Language Studio

Using Language Studio, you can review how your model performs vs how you expected it to perform. You can review predicted and tagged classes side by side for each model you have trained.

1. Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

2. Select **Improve model** from the left side menu.

3. Select **Review validation set**.

4. Choose your trained model from the **Model** drop-down menu.

5. For easier analysis, you can toggle on **Show incorrect predictions only** to view mistakes only.

    :::image type="content" source="../media/review-validation-set.png" alt-text="Review the validation set" lightbox="../media/review-validation-set.png":::

6. If a file that should belong to class  `X` is constantly classified as class `Y`, it means that there is ambiguity between these classes and you need to reconsider your schema.

### Examine data distribution

By examining data distribution in your files, you can decide if any class is underrepresented. Data imbalance happens when the files used for training are not distributed equally among the classes and this introduces a risk to model performance. For example, if `class 1` has 50 tagged files while `class 2` has 10 tagged files only, this is a data imbalance where `class 1` is over represented and `class 2` is underrepresented. 

In this case, the model is biased towards classifying your file as `class 1` and might overlook `class 2`. A more complex issue may arise from data imbalance if the schema is ambiguous. If the two classes don't have clear distinction between them and `class 2` is underrepresented the model most likely will classify the text as `class 1`.

In the [evaluation metrics](../concepts/evaluation.md), when a class is over represented it tends to have a higher recall than other classes while under represented classes have lower recall.

To examine data distribution in your dataset:

1. Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

2. Select **Improve model** from the left side menu.

3. Select **Examine data distribution**

    :::image type="content" source="../media/examine-data-distribution.png" alt-text="Examine the data distribution" lightbox="../media/examine-data-distribution.png":::

4. Go back to the **Tag data** page, and make adjustments once you have formed an idea on how you should tag your data differently.

You can [view recommended practices](../concepts/recommended-practices.md#data-tagging) for data tagging to help you improve your model.

# [Using APIs](#tab/api)

## Review validation set using APIs

### Get your resource keys endpoint

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../media/get-endpoint-azure.png" alt-text="Get the endpoint" lightbox="../media/get-endpoint-azure.png":::

### Review validation set

Use the following **GET** request to get you model evaluation results: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/validation`

Replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name. Pass `trainingModelName` as a parameter with the model name you are requesting validation data for (the model name is case-sensitive). For your request to be successful make sure that the model has completed training successfully on more than 10 files to be able to query validation results. 

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key that provides access to this API.|

#### Response Body

```json
    {
    "modelType": "MultiClassification",
    "singleClassificationValidation": null,
    "multiClassificationValidation": {
        "documents": [
            {
                "classes": {
                    "labeledClasses": [
                        "Class_1",
                        "Class_2"
                    ],
                    "predictedClasses": [
                        "Class_1",
                    ]
                },
                "location": "file.txt",
                "culture": "en-us"
            }
        ]
    }
}
```

|Key|Sample Value|Description|
|--|--|--|
|modelType|"MultiClassification"|Type of the model. This value can be `SingleClassification` based on model type|
|multiClassificationValidation|{}| Object for multiClassification results of the validation set|
|singleClassificationValidation|{}| Object for singleClassification results of the validation set|
|documents|[]|list of files in validation set|
|labeledClasses|[]| list of classes tagged for this file|
|predictedClasses|[]| list of classes predicted for this file|

---

## Next steps

* [Deploy model](deploy-model.md)
* [view recommended practices](../concepts/recommended-practices.md)
