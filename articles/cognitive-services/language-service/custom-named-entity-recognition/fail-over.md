---
title: Back up and recover your custom Named Entity Recognition (NER) models
titleSuffix: Azure Cognitive Services
description: Learn how to save and recover your custom NER models.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 02/07/2022
ms.author: aahi
ms.custom: language-service-custom-ner
---

# Back up and recover your custom NER models

When you create a Language resource, you specify a region for it to be created in. From then on, your resource and all of the operations related to it take place in the specified Azure server region. It's rare, but not impossible, to encounter a network issue that affects an entire region. If your solution needs to always be available, then you should design it to fail over into another region. This requires two Azure Language resources in different regions and synchronizing custom models across them. 

If your app or business depends on the use of a custom NER model, we recommend that you create a replica of your project in an additional supported region. If a regional outage occurs, you can then access your model in the other fail-over region where you replicated your project.

Replicating a project means that you export your project metadata and assets, and import them into a new project. This only makes a copy of your project settings and tagged data. You still need to [train](./how-to/train-model.md) and [deploy](how-to/call-api.md#deploy-your-model) the models to be available for use with [prediction APIs](https://aka.ms/ct-runtime-swagger).

In this article, you will learn to how to use the export and import APIs to replicate your project from one resource to another existing in different supported geographical regions, guidance on keeping your projects in sync and changes needed to your runtime consumption.

##  Prerequisites

* Two Azure Language resources in different Azure regions. [Create your resources](./how-to/create-project.md#azure-resources) and link them to an Azure storage account. It's recommended that you link both of your Language resources to the same storage account, though this might introduce slightly higher latency when importing your project, and training a model. 

## Get your resource keys and endpoint

Use the following steps to get the keys and endpoint of your primary and secondary resources. These will be used in the following steps.

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu of the left side of the screen, select **Keys and Endpoint**. Use endpoint for the API requests and you’ll need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint screen for an Azure resource." lightbox="../media/azure-portal-resource-credentials.png":::

    > [!TIP]
    > Keep a note of the keys and endpoints for both your primary and secondary resources. You will use these values to replace the placeholder values in the following examples.

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
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request. This is the endpoint for your primary resource.  | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

#### Headers

Use the following headers to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your primary resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |
|`format`| The format you want to use for the exported assets. | `JSON` |

#### Body

Use the following JSON in your request body, specifying that you want to export all the assets.

```json
{
  "assetsToExport": ["*"]
}
```

Once you send your API request, you’ll receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/export/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You’ll use this URL in the next step to get the export status. 

### Get export job status

Use the following **GET** request to query the status of your export job status. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/export/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request. This is the endpoint for your primary resource.  | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your export job status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your primary resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

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
|`Ocp-Apim-Subscription-Key`| The key to your primary resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

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
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request. This is the endpoint for your secondary resource.  | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |


#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your secondary resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

#### Body

Use the response body you got from the previous export step. It will be formatted like this:

```json
{
    "api-version": "2021-11-01-preview",
    "metadata": {
        "name": "myProject",
        "multiLingual": true,
        "description": "Trying out custom NER",
        "modelType": "Extraction",
        "language": "en-us",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "settings": {}
    },
    "assets": {
        "extractors": [
        {
            "name": "Entity1"
        },
        {
            "name": "Entity2"
        }
    ],
    "documents": [
        {
            "location": "doc1.txt",
            "language": "en-us",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 500,
                    "labels": [
                        {
                            "extractorName": "Entity1",
                            "offset": 25,
                            "length": 10
                        },                    
                        {
                            "extractorName": "Entity2",
                            "offset": 120,
                            "length": 8
                        }
                    ]
                }
            ]
        },
        {
            "location": "doc2.txt",
            "language": "en-us",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 100,
                    "labels": [
                        {
                            "extractorName": "Entity2",
                            "offset": 20,
                            "length": 5
                        }
                    ]
                }
            ]
        }
    ]
    }
}
```

Now you have replicated your project into another resource in another region. 

## Train your model

Importing a project only copies its assets and metadata. You still need to train your model, which will incur usage on your account.

### Submit training job

Create a **POST** request using the following URL, headers, and JSON body to start training an NER model. Replace the placeholder values below with your own values. 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/:train?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`    | The endpoint for authenticating your API request. This is the endpoint for your secondary resource.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your secondary resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

### Request body

Use the following JSON in your request. Use the same model name and the `runValidation` setting if you ran validation in your primary project, for consistency.

```json
{
  "modelLabel": "{MODEL-NAME}",
  "runValidation": true
}
```

|Key  |Value  | Example |
|---------|---------|---------|
|`modelLabel`    | Your Model name.   | {MODEL-NAME} |
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
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request. This is the endpoint for your secondary resource.  | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your secondary resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

## Deploy your model

This is the step where you make your trained model available form consumption via the [runtime prediction API](https://aka.ms/ct-runtime-swagger). 

> [!TIP]
> Use the same deployment name as your primary project for easier maintenance, and more minimal changes to your system for redirecting your traffic.

## Submit deploy job 

Create a **PUT** request using the following URL, headers, and JSON body to start deploying a custom NER model.

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request. This is the endpoint for your secondary resource.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `prod` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your secondary resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

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
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request. This is the endpoint for your secondary resource.  | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `prod` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your secondary resource. Used for authenticating your API requests.| `{YOUR-SECONDARY-RESOURCE-KEY}` |

At this point you have:
* Replicated your project into another resource, which is in another region
* Trained and deployed the model. 

Now you should make changes to your system to handle traffic redirection in case of failure.

## Changes in calling the runtime

Within your system, at the step where you call [runtime prediction API](https://aka.ms/ct-runtime-swagger) check for the response code returned from the submit task API. If you observe a **consistent** failure in submitting the request, this could indicate an outage in your primary region. Failure once doesn't mean an outage, it may be transient issue. Retry submitting the job through the secondary resource you have created. For the second request use your `{YOUR-SECONDARY-ENDPOINT}` and secondary key, if you have followed the steps above, `{PROJECT-NAME}` and `{DEPLOYMENT-NAME}` would be the same so no changes are required to the request body. 

If you revert to using your secondary resource, you will observe a slight increase in latency because of the difference in regions where your model is deployed. 

## Check if your projects are out of sync

It's important to maintain the freshness of both projects. You need to frequently check if any updates were made to your primary project, so that you move them over to your secondary project. This way if your primary region fails and you move into the secondary region, you can expect similar model performance since it already contains the latest updates. It's important to determining the frequency at which you check if your projects are in sync. We recommend that you check daily in order to guarantee the freshness of data in your secondary model.

### Get project details

Use the following url to get your project details, one of the keys returned in the body

Use the following **GET** request to get your project details. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request. This is the endpoint for your primary resource.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your primary resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

#### Response body

```json
    {
        "createdDateTime": "2021-10-19T23:24:41.572Z",
        "lastModifiedDateTime": "2021-10-19T23:24:41.572Z",
        "lastTrainedDateTime": "2021-10-19T23:24:41.572Z",
        "lastDeployedDateTime": "2021-10-19T23:24:41.572Z",
        "modelType": "Extraction",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "name": "myProject",
        "multiLingual": true,
        "description": "string",
        "language": "en-us",
        "settings": {}
    }
```

Repeat the same steps for your replicated project using your secondary endpoint and resource key. Compare the returned `lastModifiedDateTime` from both projects. If your primary project was modified later than your secondary one, you need to repeat the process of: 
1. [Exporting your primary project information](#export-your-primary-project-assets)
2. [Importing the project information to a secondary project](#import-to-a-new-project)
3. [Training your model](#train-your-model)
4. [Deploying your model](#deploy-your-model)

## Next steps

In this article, you have learned how to use the export and import APIs to replicate your project to a secondary Language resource in other region. Next, explore the API reference docs to see what else you can do with authoring APIs.

* [Authoring REST API reference ](https://westus.dev.cognitive.microsoft.com/docs/services/language-authoring-clu-apis-2022-03-01-preview/operations/Projects_TriggerImportProjectJob)

* [Runtime prediction REST API reference ](https://aka.ms/ct-runtime-swagger)
