---
title: how to create a Custom text classification project
titleSuffix: Azure Cognitive Services
description: Learn about creating a project for Custom Text Classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# How to create a Custom Text Classification Project

To create a custom text classification [project](../definitions.md#project), you need to connect it to a blob container where you already uploaded your data. Within your project you can view your files, tag data, train, evaluate, improve and deploy your model.

You can have up to 500 projects per resource, and up to 10 [models](../definitions.md#model) per project. However, you can only have one deployed model per project. See the [data limits](../data-limits.md) for more information about custom entity extraction limits.

Custom text classification supports two types of project

* **Single class classification**: In this project you can only assign a single classification for each file of your dataset.

* **Multiple class classification**: In this project you can assign *multiple* classifications for each file of your dataset.

## Prerequisites

* A Language Services resource in **West US 2** or **West Europe** with the **S** pricing tier. You will also need to configure permissions for a storage account. See [Service requirements](../../concepts/service-requirements.md) for more information.

# [Using Language Studio](#tab/language-studio)

## Create new project using Language studio

Login through the [Language studio portal](https://language.azure.com/) and select **Custom text classification**.

![language-studio](../media/ctc-language-studio.png)

### Connect your storage account to your resource

>[!IMPORTANT]
> * You only need to do this step once for each resource.
> * This process is irreversible, if you connect a storage account to your resource you cannot disconnect it later.
> * You can only connect your resource to one storage account.

1. Select your storage account from the drop down. If you cannot find your storage account, see [required permissions](../../concepts/service-requirements.md#set-permissions).

    ![connect-storage](../media/ctc-connect-storage.png)

2. Click **Next**

### If resource is already connected to a storage account

1. Select project type, for this project we will create a multi label classification project. You can learn more about the different project types [here](../definitions.md#project).

    ![connect-storage](../media/ctc-project-type.png)

2. Click **Next**

3. Enter the project information
    
    | Key | Description |
    | -- | -- |
    | Name | Name of your project. **Note** that there is no option to rename your project after creation. |
    | Description | Description of your project |
    | Language | Language of the files in your project.|
    
    > [!NOTE]
    > If your files will be in multiple languages select the **multiple languages** option in project creation and set the **language** option to the language of the majority of your files.
    
    ![create-project-1](../media/ctc-create-project-2.png)

4. Choose storage container

    ![create-project-3](../media/ctc-create-project-3.png)

5. Review the data you entered and select **Create Project**.

# [Using the APIs](#tab/api)

## Create a project through APIs

Before proceeding with the following steps make sure that:

* Your resource and storage account are [connected](../../concepts/service-requirements.md#set-storage-account) successfully.
* Your resource has **Storage blob data owner** or **Storage blob data contributor** [role on the storage account](../../concepts/service-requirements.md#set-permissions).

### Get your resource keys endpoint

1. Go to your resource overview page in the [Azure Portal](https://ms.portal.azure.com/#home)

2. From the left side menu select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    ![get-endpoint-azure](../../media/get-endpoint-azure.png)

## Create project

> [!NOTE]
> Project names are case sensitive.

Use the following **POST** request to create your project: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects`

Replace `{YOUR-ENDPOINT}` with the endpoint you got from the previous step.

### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key which provides access to this API.|

### Body

```json
    {
        "name": "MyProject",
        "modelType": "MultiClassification",
        "multiLingual": false,
        "description": "My new CT project",
        "culture": "string",
        "storageInputContainerName": "MyContainer",
        "labelsLocation": "myLabels.json"
    }
```

|Key|Sample Value|Description|
|--|--|--|
|name|"MyProject"|Your Project Name.|
|modelType|"MultiClassification"|Your model type. Accepted values are `SingleClassification` or `MultiClassification`|
|multiLingual|false|Set to true if your dataset has multilingual documents|
|description|"mystoragecontainer"|Description for your project|
|culture|"en-us"|[Culture](../language-support.md) for your documents. |
|storageInputContainerName|"MyContainer"|Name of the container with your training documents|
|labelsLocation|"myLabels.json"|Absolute path to your labels file|

> [!NOTE]
> If your files will be in multiple languages set **multiLingual** to `true` and set **culture** to the culture of the majority of your files.

This request will return an error if:

* The resource selected doesn't have proper [permissions](../../concepts/service-requirements.md#set-permissions) for the storage account.
* The labels file location is not valid.

---

## View project details

# [Using Language Studio](#tab/language-studio)

## View project details from Language studio

* Go to your project in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

* Select **Project settings** from the left side menu.

![project-details](../media/ctc-project-details.png)

# [Using the APIs](#tab/api)

### View project details using APIs

Use this [**GET**] request to get your project details: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}`. Replace `{YOUR-ENDPOINT}` with the endpoint of your resource and `{projectName}` with name of the project you want to view details. Refer to this [section](#get-your-resource-keys-endpoint) to get your endpoint and keys.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key which provides access to this API.|

#### Response Body

```json
    {
  "lastModifiedDateTime": "2021-07-26T12:06:05.270Z",
  "createdDateTime": "2021-07-26T12:06:05.270Z",
  "name": "string",
  "modelType": "MultiClassification",
  "multiLingual": true,
  "description": "string",
  "culture": "en-us",
  "storageInputContainerName": "string",
  "labelsLocation": "string"
}
```

|Key|Sample Value|Description|
|--|--|--|
|lastModifiedDateTime|2021-07-26T12:06:05.270Z|Timestamp of last modification for the project.|
|createdDateTime|2021-07-26T12:06:05.270Z|Timestamp of project creation.|
|name|MyProject|Project name.|
|modelType|MultiClassification|Type of model. This value can be `SingleClassification` based on model type|
|multiLingual|true|This is option is set at creation and it indicates that your dataset includes file in multiple languages.|
|description|TEXT|description for your project.|
|culture|"en-us"| [Culture](../language-support.md) for your documents. |
|storageInputContainerName|"MyContainer"|Name of the container with your training documents|
|labelsLocation|"myLabels.json"|Absolute path to your labels file|

## Update project description

After you create your project you can only change its description. You cannot rename your project or change the tags file connected to it.

### Update project description from Language studio

* Go to your project in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

* Select **Project settings** from the left side menu.

* Enter the updated description in the description text box.

* Click on **Save**

![update-project-description](../media/ctc-update-project-description.png)

## Update project description using APIs

Use this [**PATCH**] request to update your project description: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}`. Replace `{YOUR-ENDPOINT}` with the endpoint of your resource and `{projectName}` with name of the project you want to view details. Refer to this [section](#get-your-resource-keys-endpoint) to get your endpoint and keys.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key which provides access to this API.|

#### Body

```json
    {
  "description": "string"
}
```

You will receive a 204 response indicating success.

---

# [Using Language Studio](#tab/language-studio)

### View trained models in a project from Language studio

* Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

* Select **View model details** from the left side menu.

* View your model training status in the **Status** column, and the F1 score for the model in the **F1 score** column.

![model-details](../media/ctc-model-details-1.png)

# [Using the APIs](#tab/api)

## View trained models in a project using APIs

Use this [**GET**] request to get your project details: `{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}/trainedModels`. Replace `{YOUR-ENDPOINT}` with the endpoint of your resource and `{projectName}` with name of the project you want to view details. Refer to this [section](#get-your-resource-keys-endpoint) to get your endpoint and keys.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key which provides access to this API.|

#### Response Body

```json
    {
    "trainingModelsInfo": [
        {
            "trainingModelName": "MyModel",
            "trainingJobInfo": {
                "status": "succeeded",
                "startDateTime": "2021-07-15T22:45:50.060262Z",
                "endDateTime": "2021-07-15T22:50:01.2501457Z"
            },
            "evaluationJobInfo": {
                "status": "succeeded",
                "startDateTime": "2021-07-15T22:45:50.1151679Z",
                "endDateTime": "2021-07-15T22:50:01.345025Z"
            },
            "publishingJobInfo": {
                "modelId": "xxxxxxxx-xxxx-xxxx-xxxx-MultiClassification_latest",
                "status": "succeeded",
                "startDateTime": "2021-07-15T23:59:26.0789913Z",
                "endDateTime": "2021-07-15T23:59:39.5576288Z"
            }
        }
    ]
}
```

|Key|Sample Value|Description|
|--|--|--|
|trainingModelsInfo|[]|list of all models in your project|
|trainingModelName|MyModel|Your model name|
|trainingJobInfo|{}|Information about training job for this model|
|evaluationJobInfo|{}|Information about model evaluation job. For thi job to be successful you have to have at least 10 file in your dataset|
|publishingJobInfo|{}|Information about model deployment|

---

# [Using Language Studio](#tab/language-studio)

## Delete a project from Language studio

1. Go to your projects page in [Language Studio](https://language.azure.com/customTextNext/projects/classification)

2. Select the project you want to delete and click on **Delete** button.

# [Using the APIs](#tab/api)

## Delete project using APIs

You can also delete your project using the Authoring API.

Use the following **DELETE** request to delete your project: 

`{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{projectName}`

Replace `{YOUR-ENDPOINT}` with the endpoint of your resource and `{projectName}` with name of the project you want to delete.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your subscription key which provides access to this API.|

---

## Next steps

* [Tag data](tag-data.md)
* [Train your model](train-model.md)