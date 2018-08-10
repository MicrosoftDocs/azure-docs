---
title: Create a Custom Vision Service REST API tutorial - Azure Cognitive Services | Microsoft Docs
description: Use the REST API to create, train, test, and export a custom vision model.
services: cognitive-services
author: blackmist
manager: cgronlun
ms.service: cognitive-services
ms.component: custom-vision
ms.topic: article
ms.date: 08/07/2018
ms.author: larryfr
# As a developer, I want to use the custom vision REST API to create, train, and export a model
---
# Tutorial: Use the Custom Vision REST API

Learn how to use the Custom Vision REST API to create, train, score, and export a model.

The information in this document demonstrates how to use a REST client to work with the REST API for training the Custom Vision service. The examples show how to use the API using the [curl]() utility from a bash environment, or Windows PowerShell.

> [!div class="checklist"]
> * Get keys
> * Create a project
> * Add images
> * Use your own model

## Prerequisites

* A basic familiarity with Representational State Transfer (REST). This document does not go into details on things like HTTP verbs, JSON, or other things commonly used with REST.

* Either a bash (Bourne Again Shell) with the [curl]() utility or Windows PowerShell 3.0 (or greater).

* An Custom Vision account. For more information, see the [Build a classifier](getting-started-build-a-classifier.md) document.

## Get keys

When using the REST API, you must authenticate using a key. When performing management or training operations, you use the __training key__. When using the model to make predictions, you use the __prediction key__.

When making a request, the key is sent as a request header.

To get the keys for your account, visit the [Custom Vision web page](https://customvision.ai) and select the __gear icon__ in the upper right. In the __Accounts__ section, copy the values from the __Training Key__ and __Prediction Key__ fields.

![Image of the keys UI](./media/rest-api-tutorial/training-prediction-keys.png)

> [!IMPORTANT]
> Since the keys are used to authenticate every request, the examples in this document assume that the key values are contained in environment variables. Use the following commands to store the keys to environment variables before using any other snippets in this document:
>
> ```bash
> read -p "Enter the training key: " TRAININGKEY
> read -p "Enter the prediction key: " PREDICTIONKEY
> ```
>
> ```powershell
> $trainingKey = Read-Host 'Enter the training key'
> $predictionKey = Read-Host 'Enter the prediction key'
> ```

## Create a new project

The following examples create a new project named `myproject` in your Custom Vision service instance. This service defaults to the `General` domain. For more information on this request, see [CreateProject](https://southcentralus.dev.cognitive.microsoft.com/docs/services/d0e77c63c39c4259a298830c15188310/operations/5a59953940d86a0f3c7a8290).

```bash
curl -X POST "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Training/projects?name=myproject" -H "Training-Key: $TRAININGKEY" --data-ascii ""
```

```powershell
$resp = Invoke-WebRequest -Method 'POST' `
    -Uri "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Training/projects?name=myproject" `
    -UseBasicParsing `
    -Headers @{ "Training-Key"=$trainingKey }
$resp.Content
```

The response to the request is similar to the following JSON document:

```json
{
  "id":"45d1b19b-69b6-4a22-8e7e-d1ca37504686",
  "name":"myproject",
  "description":"",
  "settings":{
    "domainId":"ee85a72c-405e-4adc-bb47-ffa8ca0c9f31",
    "useNegativeSet":true,
    "classificationType":"Multilabel",
    "detectionParameters":null
  },
  "created":"2018-08-10T17:39:02.5633333",
  "lastModified":"2018-08-10T17:39:02.5633333",
  "thumbnailUri":null
}
```

### Specific domains

To create a project for a specific domain, you can provide the __domain Id__ as an optional paramter. The following examples show how to retrieve a list of available domains:

```bash
curl -X GET "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Training/domains" -H "Training-Key: $TRAININGKEY" --data-ascii ""
```

```powershell
$resp = Invoke-WebRequest -Method 'GET' `
    -Uri "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Training/domains" `
    -UseBasicParsing `
    -Headers @{ "Training-Key"=$trainingKey }
$resp.Content
```

The response to the request is similar to the following JSON document:

```json
[
    {
        "id": "ee85a74c-405e-4adc-bb47-ffa8ca0c9f31",
        "name": "General",
        "type": "Classification",
        "exportable": false,
        "enabled": true
    },
    {
        "id": "c151d5b5-dd07-472a-acc8-15d29dea8518",
        "name": "Food",
        "type": "Classification",
        "exportable": false,
        "enabled": true
    },
    {
        "id": "ca455789-012d-4b50-9fec-5bb63841c793",
        "name": "Landmarks",
        "type": "Classification",
        "exportable": false,
        "enabled": true
    },
    ...
]
```

The following example demonstrates creating a new project that uses the __Landmarks__ domain:

```bash
curl -X POST "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Training/projects?name=myproject&domainId=ca455789-012d-4b50-9fec-5bb63841c793" -H "Training-Key: $TRAININGKEY" --data-ascii ""
```

```powershell
$resp = Invoke-WebRequest -Method 'POST' `
    -Uri "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Training/projects?name=myproject&domainId=ca455789-012d-4b50-9fec-5bb63841c793" `
    -UseBasicParsing `
    -Headers @{ "Training-Key"=$trainingKey }
$resp.Content
```

## Add images

Images can be added from files or from URLs. The following examples demonstrate 
