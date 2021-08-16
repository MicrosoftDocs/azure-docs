# View model evaluation

After model training is completed, you can view model details and see how well does it perform against the test set. The [test set](ct-concept-training.md#test-set) is composed of 10% of your data, this split is done at random before training. The test set is a blind set that was not introduced to the model during the training process. You can learn more about data splitting [here](ct-concept-training.md#data-splitting). For the evaluation process to complete there must be at least 10 files in your dataset.

## Prerequisites

* Successfully created a [Custom extraction project](ct-how-to-create-project.md)

* Completed model training successfully. Learn more about training [here](ct-how-to-train-model.md).

* Learn more about evaluation metrics [here](ct-concept-evaluation.md).

## View model details

* Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/extraction).

* Select **View model details** from the left side menu.

* View your model training status in the **Status** column, and the F1 score for the model in the **F1 score** column.

![model-details](../../media/extraction/ct-model-details-1.png)

* Click on the model name for more details.

* You can find the **model-level** evaluation metrics under the **Overview** section and the **entity-level** evaluation metrics  under the **Entity performance metrics** section. You can learn more about this [here](ct-concept-evaluation.md#Model-level-and-Entity-level-evaluation-metrics)

![model-details-2](../../media/extraction/ct-model-details-2.png)

> [!NOTE]
> If you don't find all the entities displayed here, it is because they were not there in any of the files in the test set.

* Under the **Test set confusion matrix** you can find confusion matrix for the model. You can learn more about the confusion matrix [here](ct-concept-evaluation.md#Confusion-matrix).

![model-details-3](../../media/extraction/ct-model-details-3.png)

## View evaluation details using APIs

### Get your resource keys endpoint

* Go to your resource overview page in the [Azure Portal](https://ms.portal.azure.com/#home)

* From the left side menu select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

![get-endpoint-azure](../../media/get-endpoint-azure.png)

### Get evaluation details

Use this [**GET**] request to get you model evaluation results `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/evaluation`.
Replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name. Pass `trainingModelName` as a parameter and for the value indicate the model name you are requesting evaluation for (model name is case sensitive). For your request to be successful make sure that the model has completed training successfully on more than 10 files to be able to query evaluation results. Evaluation is performed only on the [test set](ct-concept-training.md#test-set).

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key which provides access to this API.|

You can learn more about API response codes [here](ct-reference-api.md#API-Response-Codes).

#### Response Body

```json
    {
    "modelType": "Extraction",
    "extractionEvaluation": {
        "confusionMatrix": {
            "Entity_1": {
                "Entity_2": 1
            },
            "Entity_2": {
                "Entity_2": 1
            }
        },
        "entities": {
            "Entity_1": {
                "f1": 0.6666666865348816,
                "precision": 0.5,
                "recall": 1,
                "countTruePositives": 0,
                "countTrueNegatives": 0,
                "countFalsePositives": 1,
                "countFalseNegatives": 0
            },
            "Entity_2": {
                "f1": 0.6666666865348816,
                "precision": 0.5,
                "recall": 1,
                "countTruePositives": 0,
                "countTrueNegatives": 0,
                "countFalsePositives": 1,
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
|modelType|"Extraction"|Type of the model.|
|extractionEvaluation|{}| Object for the results.|
|confusionMatrix|[]|list of all available entities in your test set and under each entity the count of the times is predicted as itself or as other entities. In the above example `Entity_1` was predicted as `Entity_2` once, and `Entity_2` was identified as `Entity_2` once. You can learn more about confusion matrix [here](ct-concept-evaluation.md#confusion-matrix)|
|entities|[]| list of all entities with their entity-level evaluation metrics. You can learn more about evaluation metrics [here](ct-concept-evaluation.md)|
|microF1, microPrecision, microRecall|0.33, 0.28, 0.4| These are model-level evaluation metrics. You can learn more about evaluation metrics [here](ct-concept-evaluation.md)|
|macroF1, macroPrecision, macroRecall|0.26, 0.2, 0.4|These are model-level evaluation metrics. Macro metrics are calculated as the average of entity-level metrics for all entities.|

## Next steps

* [Improve model](ct-how-to-improve-model.md)
