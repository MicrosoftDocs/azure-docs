---
title: Back up and recover your custom text classification models
titleSuffix: Azure Cognitive Services
description: Learn how to save and recover your custom text classification models.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 02/07/2022
ms.author: aahi
ms.custom: language-service-custom-classification
---

# Back up and recover your custom text classification models

When you create a Language resource, you specify a region for it to be created in. From then on, your resource and all of the operations related to it take place in the specified Azure server region. It's rare, but not impossible, to encounter a network issue that hits an entire region. If your solution needs to always be available, then you should design it to either fail-over into another region. This requires two Azure Language resources in different regions and the ability to sync custom models across regions. 

If your app or business depends on the use of a custom text classification model, we recommend that you create a replica of your project into another supported region. So that if a regional outage occurs, you can then access your model in the other fail-over region where you replicated your project.

Replicating a project means that you export your project metadata and assets and import them into a new project. This only makes a copy of your project settings and tagged data. You still need to [train](./how-to/train-model.md) and [deploy](how-to/call-api.md#deploy-your-model) the models to be available for use with [prediction APIs](https://aka.ms/ct-runtime-swagger).

In this article, you will learn to how to use the export and import APIs to replicate your project from one resource to another existing in different supported geographical regions, guidance on keeping your projects in sync and changes needed to your runtime consumption.

##  Prerequisites

* Two Azure Language resources in different Azure regions. Follow the instructions mentioned [here](./how-to/create-project.md#azure-resources) to create your resources and link it to Azure storage account. It is recommended that you link both your Language resources to the same storage account, this might introduce a bit higher latency in importing and training.

## Get your resource keys endpoint

Use the following steps to get the keys and endpoint of your primary and secondary resources. These will be used in the following steps.

* Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

* From the menu of the left side of the screen, select **Keys and Endpoint**. Use endpoint for the API requests and you’ll need the key for `Ocp-Apim-Subscription-Key` header.
:::image type="content" source="../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint screen for an Azure resource." lightbox="../media/azure-portal-resource-credentials.png":::

> [!TIP]
> Keep a note of keys and endpoints for both primary and secondary resources. Use these values to replace the following placeholders:
`{YOUR-PRIMARY-ENDPOINT}`, `{YOUR-PRIMARY-RESOURCE-KEY}`, `{YOUR-SECONDARY-ENDPOINT}` and `{YOUR-SECONDARY-RESOURCE-KEY}`.
> Also take note of your project name, your model name and your deployment name. Use these values to replace the following placeholders:  `{PROJECT-NAME}`, `{MODEL-NAME}` and `{DEPLOYMENT-NAME}`.

## Export your primary project assets

Start by exporting the project assets from the project in your primary resource.

### Submit export job

Create a **POST** request using the following URL, headers, and JSON body to export project metadata and assets.

Use the following URL to export your primary project assets. Replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/:export?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

#### Headers

Use the following headers to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |
|`format`| The format you want to use for the exported assets. | `JSON` |

#### Body

Use the following JSON in your request body specifying that you want to export all the assets.

```json
{
  "assetsToExport": ["*"]
}
```

Once you send your API request, you’ll receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/export/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You’ll use this URL in the next step to get the export job status. 

### Get export job status

Use the following **GET** request to query the status of your export job status. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/export/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your export job status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

#### Response body

```json
{
  "resultUrl": "{RESULT-URL}",
  "jobId": "string",
      "createdDateTime": "2021-10-19T23:24:41.572Z",
      "lastUpdatedDateTime": "2021-10-19T23:24:41.572Z",
      "expirationDateTime": "2021-10-19T23:24:41.572Z",
  "status": "unknown",
  "errors": [
    {
      "code": "unknown",
      "message": "string"
    }
  ]
}
```

Use the url from the `resultUrl` key in the body to view the exported assets from this job.

### Get export results

Submit a **GET** request using the `{RESULT-URL}` you received from the previous step to view the results of the export job.

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

Copy the response body as you will use it as the body for the next import job.

## Import to a new project 

Now go ahead and import the exported project assets in your new project in the secondary region so you can replicate it.

### Submit import job

Create a **POST** request using the following URL, headers, and JSON body to create your project and import the tags file.

Use the following URL to create a project and import your tags file. Replace the placeholder values below with your own values. 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/:import?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

### Body

Use the response body you got from the previous export step. It will have a format similar to this:

```json
{
    "api-version": "2021-11-01-preview",
    "metadata": {
        "name": "myProject",
        "multiLingual": true,
        "description": "Trying out custom text classification",
        "modelType": "multiClassification",
        "language": "string",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "settings": {}
    },
    "assets": {
        "classifiers": [
            {
                "name": "Class1"
            }
        ],
        "documents": [
            {
                "location": "doc1.txt",
                "language": "en-us",
                "classifiers": [
                    {
                        "classifierName": "Class1"
                    }
                ]
            }
        ]
    }
}
```
Once you send your API request, you’ll receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/import/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You’ll use this URL in the next step to get the import status. 

### Get import job status

Use the following **GET** request to query the status of your import job status. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/import/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your export job status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

#### Response body

```json
{
    "jobId": "string",
    "createdDateTime": "2021-10-19T23:24:41.572Z",
    "lastUpdatedDateTime": "2021-10-19T23:24:41.572Z",
    "expirationDateTime": "2021-10-19T23:24:41.572Z",
    "status": "unknown",
    "errors": [
      {
        "code": "unknown",
        "message": "string"
      }
    ]
}
```

Now you have replicated your project into another resource in another region. 

## Train your model

After importing your project, you only have copied the project's assets and metadata and assets. You still need to train your model, which will incur usage on your account. 

### Submit training job

Create a **POST** request using the following URL, headers, and JSON body to start training an NER model. Replace the placeholder values below with your own values. 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/:train?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`    | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

### Request body

Use the following JSON in your request. Use the same model name and `runValidation` setting you have in your primary project for consistency.

```json
{
  "modelLabel": "{MODEL-NAME}",
  "runValidation": true
}
```

|Key  |Value  | Example |
|---------|---------|---------|
|`modelLabel  `    | Your Model name.   | {MODEL-NAME} |
|`runValidation`     | Boolean value to run validation on the test set.   | true |

Once you send your API request, you’ll receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You’ll use this URL in the next step to get the training status. 

### Get Training Status

Use the following **GET** request to query the status of your model's training process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

## Deploy your model

This is the step where you make your trained model available form consumption via the [runtime prediction API](https://aka.ms/ct-runtime-swagger). 

> [!TIP]
> Use the same deployment name as your primary project for easier maintenance and minimal changes to your system to handle redirecting your traffic.

## Submit deploy job 

Create a **PUT** request using the following URL, headers, and JSON body to start deploying a custom NER model.

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `prod` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

#### Request body

Use the following JSON in your request. Use the name of the model you wan to deploy.  

```json
{
  "trainedModelLabel": "{MODEL-NAME}",
  "deploymentName": "{DEPLOYMENT-NAME}"
}
```

Once you send your API request, you’ll receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You will use this URL in the next step to get the publishing status.

### Get the deployment status

Use the following **GET** request to query the status of your model's publishing process. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `prod` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

At this point you have replicated your project into another resource, which is in another region, trained and deployed the model. Now you would want to make changes to your system to handle traffic redirection in case of failure.

## Changes in calling the runtime

Within your system, at the step where you call [runtime prediction API](https://aka.ms/ct-runtime-swagger) check for the response code returned from the submit task API. If you observe a **consistent** failure in submitting the request, this could indicate an outage in your primary region. Failure once doesn't mean an outage, it may be transient issue. Retry submitting the job through the secondary resource you have created. For the second request use your `{YOUR-SECONDARY-ENDPOINT}` and secondary key, if you have followed the steps above, `{PROJECT-NAME}` and `{DEPLOYMENT-NAME}` would be the same so no changes are required to the request body. 

In case you revert to using your secondary resource you will observe slight increase in latency because of the difference in regions where your model is deployed. 

## Check if your projects are out of sync

Maintaining the freshness of both projects is an important part of process. You need to frequently check if any updates were made to your primary project so that you move them over to your secondary project. This way if your primary region fail and you move into the secondary region you should expect similar model performance since it already contains the latest updates. Setting the frequency of checking if your projects are in sync is an important choice, we recommend that you do this check daily in order to guarantee the freshness of data in your secondary model.

### Get project details

Use the following url to get your project details, one of the keys returned in the body

Use the following **GET** request to get your project details. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

#### Response body

```json
    {
        "createdDateTime": "2021-10-19T23:24:41.572Z",
        "lastModifiedDateTime": "2021-10-19T23:24:41.572Z",
        "lastTrainedDateTime": "2021-10-19T23:24:41.572Z",
        "lastDeployedDateTime": "2021-10-19T23:24:41.572Z",
        "modelType": "multiClassification",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "name": "myProject",
        "multiLingual": true,
        "description": "string",
        "language": "en-us",
        "settings": {}
    }
```

Repeat the same steps for your replicated project using `{YOUR-SECONDARY-ENDPOINT}` and `{YOUR-SECONDARY-RESOURCE-KEY}`. Compare the returned `lastModifiedDateTime` from both project. If your primary project was modified sooner than your secondary one, you need to repeat the steps of [exporting](#export-your-primary-project-assets), [importing](#import-to-a-new-project), [training](#train-your-model) and [deploying](#deploy-your-model).


## Next steps

In this article, you have learned how to use the export and import APIs to replicate your project to a secondary Language resource in other region. Next, explore the API reference docs to see what else you can do with authoring APIs.

* [Authoring REST API reference ](https://westus.dev.cognitive.microsoft.com/docs/services/language-authoring-clu-apis-2022-03-01-preview/operations/Projects_TriggerImportProjectJob)

* [Runtime prediction REST API reference ](https://aka.ms/ct-runtime-swagger)
