---
title: View a custom classification model evaluation - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a custom classification model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# View the model evaluation

After model training is completed, you can view the model details and see how well does it perform against the test set, which contains 10% of your data at random, which is created during [training](train-model.md#data-groups). The test set is a blind set that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 files in your dataset.

## Prerequisites

* Successfully created a [Custom extraction project](create-project.md)

* Completed [model training](train-model.md) successfully.

## View the model details

1. Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

2. Select **View model details** from the left side menu.

3. View your model training status in the **Status** column, and the F1 score for the model in the **F1 score** column.

:::image type="content" source="../media/model-details-1.png" alt-text="View model details button" lightbox="../media/model-details-1.png":::

1. Click on the model name for more details.

2. You can find the **model-level** evaluation metrics under the **Overview** section and the **class-level** evaluation metrics  under the **Class performance metrics** section. See [Evaluation metrics](../concepts/evaluation.md#model-level-and-class-level-evaluation-metrics) for more information.

:::image type="content" source="../media/model-details-2.png" alt-text="Model performance metrics" lightbox="../media/model-details-2.png":::

> [!NOTE]
> If you don't find all the classes displayed here, it is because there were no tagged files of this class in the test set.

Under the **Test set confusion matrix**, you can find the confusion matrix for the model.

**Single Class Classification**

:::image type="content" source="../media/conf-matrix-single.png" alt-text="Confusion matrix for single class classification" lightbox="../media/conf-matrix-single.png":::

**Multiple Class Classification**

:::image type="content" source="../media/conf-matrix-multi.png" alt-text="Confusion matrix for multiple class classification" lightbox="../media/conf-matrix-multi.png":::

## View evaluation details using APIs

### Get your resource keys endpoint

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use the endpoint for the API requests. You will need the key for `Ocp-Apim-Subscription-Key` header.

:::image type="content" source="../media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../media/get-endpoint-azure.png":::

### Get evaluation details

Use this [**GET**] request to get you model evaluation results `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/evaluation`.
Replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name. Pass `trainingModelName` as a parameter and for the value indicate the model name you are requesting evaluation for (model name is case-sensitive). For your request to be successful, make sure that the model has completed training successfully on more than 10 files to be able to query evaluation results. Evaluation is performed only on the [test set](train-model.md#data-groups).

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

#### Response Body

```json
    "modelType": "MultiClassification",
    "singleClassificationEvaluation": null,
    "multiClassificationEvaluation": {
        "classes": {
            "Class_1": {
                "f1": 0,
                "precision": 0,
                "recall": 0,
                "countTruePositives": 0,
                "countTrueNegatives": 0,
                "countFalsePositives": 0,
                "countFalseNegatives": 1
            },
            "Class_2": {
                "f1": 1,
                "precision": 1,
                "recall": 1,
                "countTruePositives": 0,
                "countTrueNegatives": 0,
                "countFalsePositives": 0,
                "countFalseNegatives": 0
            }
        },
        "microF1": 0.33333334,
        "microPrecision": 0.2857143,
        "microRecall": 0.4,
        "macroF1": 0.26666668,
        "macroPrecision": 0.2,
        "macroRecall": 0.4
    }
}
```

|Key|Sample Value|Description|
|--|--|--|
|modelType|`MultiClassification`|Type of the model. This value can be `SingleClassification` based on model type|
|`multiClassificationEvaluation`|{}| Object for `multiClassification` results of the test set|
|`singleClassificationEvaluation`|{}| Object for `singleClassification` results of the test set|
|classes|[]| list of all classes with their class-level evaluation metrics. |
|`microF1`, `microPrecision`, `microRecall`|0.33, 0.28, 0.4| These are model-level evaluation metrics. |
|`macroF1`, `macroPrecision`, `macroRecall`|0.26, 0.2, 0.4|These are model-level evaluation metrics. Macro metrics are calculated as the average of class-level metrics for all classes.|

## Next steps

* [Improve model](improve-model.md)
* [Evaluation metrics](../concepts/evaluation.md)
