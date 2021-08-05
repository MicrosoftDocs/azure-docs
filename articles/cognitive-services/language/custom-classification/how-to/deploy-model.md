---
title: how to deploy a Custom text classification model
titleSuffix: Azure Cognitive Services
description: Learn about deploying a model for Custom Text Classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Deploy your model

Use this article to deploy a custom text classification model. Deploying a [model](../definitions.md#model) means making it available for use via the Analyze API. 

## Prerequisites

* Successfully created a [Custom text classification project](create-project.md)

* Completed [tagging your data](tag-data.md).

* Completed [model training](train-model.md) successfully. 

>[!NOTE]
> * You can only have one deployed model per project so deploying another model will remove the one that was already deployed. See the [data limits](../data-limits.md) article for more information.
> * Deployment may take few minutes to complete.

# [Using Language Studio](#tab/language-studio)

## Deploy a model using Language studio

1. Go to your project in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

2. Select **Deploy model** from the left side menu.

3. Select the model you want to deploy and from the top menu select **Deploy model**. You can only see models that have completed training successfully.

    :::image type="content" source="../media/deploy-model-1.png" alt-text="Deploy the model" lightbox="../media/deploy-model-1.png":::

# [Using the APIs](#tab/api)

## Deploy using APIs

### Get your resource keys endpoint

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home).

2. From the left side menu, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../media/get-endpoint-azure.png" alt-text="Get the endpoint" lightbox="../media/get-endpoint-azure.png":::

### Trigger Deploy

> [!NOTE]
> Project names are case sensitive.

Use the following **POST** request to trigger the deployment process: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/publish`

Replace `{YOUR-ENDPOINT}` by the endpoint you got from the previous step and `{projectName}` with the name of the project that contains the model you want to publish.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key, which provides access to this API.|

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
|trainingModelName|"MyModel"|Name of the model you want to publish|

#### Response

You will receive a 202 response indicating success. Extract `location` from the response headers.
`location` is formatted like this: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/publish/jobs/{jobId}`. 

You will use this endpoint in the next to get the publishing status.

### Get Deploy Status

Use the following **GET** request to query the status of the publishing process. You can use the endpoint you received from the previous step.

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/publish/jobs/{jobId}`.

Replace `{YOUR-ENDPOINT}` by the endpoint you got earlier, replace `{projectName}` with your project name and `{jobID}` with the jobID you received in the previous step.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key, which provides access to this API.|

#### Response Body

```json
    {
  "tasks": [
    {
      "modelId": "string",
      "status": "notStarted",
      "lastUpdatedDateTime": "2021-05-19T12:09:58.301Z",
      "error": {
        "code": "NotFound",
        "message": "string"
      }
    }
  ],
  "inProgress": 0,
  "completed": 0,
  "failed": 0,
  "total": 0,
  "jobId": "string",
  "createdDateTime": "2021-05-19T12:09:58.301Z",
  "lastUpdatedDateTime": "2021-05-19T12:09:58.301Z",
  "expirationDateTime": "2021-05-19T12:09:58.301Z",
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
|modelId|"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_Extraction_latest"|Your model ID|
|status|"notStarted"|Publishing status|
|lastUpdatedDateTime|"2021-03-29T17:44:18.9863934Z"|Timestamp of last update to your model|
|errors|[]|list of errors in training|
|inProgress|0|Count of tasks with status inProgress|
|completed|0|Count of tasks with status completed|
|failed|0|Count of tasks with status failed|
|total|0|Total tasks of jobs|
|jobId|"123456789"|Your Job ID|
|createdDateTime|"2021-03-29T17:44:18.8469889Z"|Timestamp for job creation|
|lastUpdatedDateTime|"2021-03-29T17:44:18.9863934Z"|Timestamp of last update to your model|
|status|"inProgress"|General status of all your tasks|
|errors|[]|list of errors of all your tasks|

---

## Clean up resources

# [Using Language Studio](#tab/language-studio)

When no longer needed, delete the project. To do so, go to your projects page in [Language Studio](https://language.azure.com/customTextNext/projects/classification), select the project you want to delete and select the **Delete** button.

:::image type="content" source="../media/delete-project.png" alt-text="Delete the project" lightbox="../media/delete-project.png":::

# [Using the APIs](#tab/api)

You can also delete you project using the Authoring API.

Use the following **DELETE** request to delete your project: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}`

Replace `{YOUR-ENDPOINT}` with the endpoint of your resource and `{projectName}` with name of the project you want to delete. Refer to the **Get your resource keys endpoint** above for information about getting your resource key and endpoint.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key, which provides access to this API.|

---

## Next steps

* [Test your model](test-model.md).
* [Run custom text classification task](run-inference.md)
