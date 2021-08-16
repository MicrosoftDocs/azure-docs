# Train your model

After you have completed tagging your data, you can proceed to training. You can create and train multiple [models](ct-concept-definitions.md#entity) within the same [project](ct-concept-definitions.md#project). However, if you re-train a specific model it overwrites the last state.
The training process takes quite some time but as a rough estimate the expected training time for your files with a combined length of 12,800,000 chars is 6 hours.
You can only train one model at a time, you cannot create or train other models if another one is already training in the same project. You can learn more about custom entity extraction limits [here](ct-reference-limits.md). While training, your tagged files will be spilt into 3 parts; 80% for training, 10% for validation and 10% for testing. You must have minimum of **10** docs in your project for the **evaluation** process to be successful. You can learn more about data splitting [here](ct-concept-training.md)

## Prerequisites

* Successfully created a [Custom extraction project](ct-how-to-create-project.md)

* Completed data tagging. You can learn more about tagging your data [here](ct-how-to-tag-data.md).

## Train model in Language studio

* Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/extraction).

* Select **Train** from the left side menu.

* Enter a new model name or select an existing model from the **Model name** dropdown.

>[!NOTE]
> You can only have up to 10 models per project.

![train-model-1](../../media/extraction/ct-train-model-1.png)

* Click on the **Train** button at the bottom of the page.

* If the model you selected is already trained, a pop up will appear to confirm overwriting the last model state.

![train-model-2](../../media/extraction/ct-train-model-2.png)

>[!NOTE]
> Training can take up to few hours so please be patient 😊.

* After training is completed, you can [view model evaluation details](ct-how-to-view-model-evaluation.md) and [improve your model](ct-how-to-improve-model.md)

## Train using APIs

### Get your resource keys endpoint

* Go to your resource overview page in the [Azure Portal](https://ms.portal.azure.com/#home)

* From the left side menu select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

![get-endpoint-azure](../../media/get-endpoint-azure.png)

### Trigger Train

Use this [**POST**] request to create your project: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train`. Replace `{YOUR-ENDPOINT}` by the endpoint you got from the previous step and `{projectName}` with the name of the project that contains the model you want to publish. You can learn more about the authoring API [here](../../extras/Microsoft.CustomText.Authoring.v1.0-preview.2.json)

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key which provides access to this API.|

#### Body

```json
    {
        "tasks": [
            {
                "trainingModelName": "MyModel"
        }
        ]
    }
```

|Key|Sample Value|Description|
|--|--|--|
|trainingModelName|"MyModel"|Name of the model you want to train|

#### Response

You will receive a 202 response indicating success. In the response **headers**, extract `location`.
`location` is formatted like this `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train/jobs/{jobId}`. You will use this endpoint in the next step to get the training status. You can learn more about API response codes [here](ct-reference-api.md#API-Response-Codes).

### Get Training Status

Use the following [**GET**] request to query the status of the training process. You can use the endpoint you received from the previous step. `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/train/jobs/{jobId}`. Or you can replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name and `{jobID}` with the jobID you received in the previous step.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key which provides access to this API.|

You can learn more about API response codes [here](ct-reference-api.md#API-Response-Codes).

#### Response Body

```json
    {
        "tasks": [
            {
            "trainingModelName": "MyModel",
            "evaluationStatus": {
                "status": "notStarted",
                "lastUpdatedDateTime": "2021-05-18T20:31:04.592Z",
                "error": {
                "code": "NotFound",
                "message": "Error Message"
                }
            },
            "status": "notStarted",
            "lastUpdatedDateTime": "2021-05-18T20:31:04.592Z",
            "error": {
                "code": "NotFound",
                "message": "Error Message"
            }
            }
        ],
        "inProgress": 0,
        "completed": 0,
        "failed": 0,
        "total": 0,
        "jobId": "123456789",
        "createdDateTime": "2021-05-18T20:31:04.592Z",
        "lastUpdatedDateTime": "2021-05-18T20:31:04.592Z",
        "expirationDateTime": "2021-05-19T11:44:08.555Z",
        "status": "notStarted",
        "errors": [
            {
            "code": "NotFound",
            "message": "string"
            }
        ]
    }
```

|Key|Sample Value|Description|
|--|--|--|
|tasks|[]|List of tasks you are running|
|trainingModelName|"MyModel"| Name of the model being trained|
|evaluationStatus| [] | Object containing the status, create time and errors of the evaluation process. Evaluation process starts after training is completed.|
|status|"notStarted"|Training Status|
|lastUpdatedDateTime|"2021-03-29T17:44:18.9863934Z"|Timestamp of last update to your model|
|errors|[]|list of errors in training|
|inProgress|0|Count of tasks with status inProgress|
|completed|0|Count of tasks with status completed|
|failed|0|Count of tasks with status failed|
|total|0|Total count of tasks|
|jobId|"123456789"|Your Job ID|
|createdDateTime|"2021-03-29T17:44:18.8469889Z"|Timestamp for job creation|
|lastUpdatedDateTime|"2021-03-29T17:44:18.9863934Z"|Timestamp of last update to your model|
|status|"inProgress"|General status of all your tasks|
|errors|[]|list of errors of all your tasks|

## Next steps

* [View model evaluation details](ct-how-to-view-model-evaluation.md)
* [Improve model](ct-how-to-improve-model.md)
