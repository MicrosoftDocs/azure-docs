---
title: Copy and back up Custom Vision projects
titleSuffix: Azure AI services
description: Learn how to use the ExportProject and ImportProject APIs to copy and back up your Custom Vision projects.
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-custom-vision
ms.topic: how-to
ms.date: 01/20/2022
ms.author: pafarley
---

# Copy and back up your Custom Vision projects

After you've created and trained a Custom Vision project, you may want to copy your project to another resource. If your app or business depends on the use of a Custom Vision project, we recommend you copy your model to another Custom Vision account in another region. Then if a regional outage occurs, you can access your project in the region where it was copied.

The **[ExportProject](https://westus2.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddeb3)** and **[ImportProject](https://westus2.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc7548b571998fddee3)** APIs enable this scenario by allowing you to copy projects from one Custom Vision account into others. This guide shows you how to use these REST APIs with cURL. You can also use an HTTP request service like Postman to issue the requests.

> [!TIP]
> For an example of this scenario using the Python client library, see the [Move Custom Vision Project](https://github.com/Azure-Samples/custom-vision-move-project/tree/master/) repository on GitHub.


##  Prerequisites

- Two Azure AI Custom Vision resources. If you don't have them, go to the Azure portal and [create a new Custom Vision resource](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_customvision#create/Microsoft.CognitiveServicesCustomVision?azure-portal=true).
- The training keys and endpoint URLs of your Custom Vision resources. You can find these values on the resource's **Overview** tab on the Azure portal.
- A created Custom Vision project. See [Build a classifier](./getting-started-build-a-classifier.md) for instructions on how to do this.
* [PowerShell version 6.0+](/powershell/scripting/install/installing-powershell-core-on-windows), or a similar command-line utility.

## Process overview

The process for copying a project consists of the following steps:

1. First, you get the ID of the project in your source account you want to copy.
1. Then you call the **ExportProject** API using the project ID and the training key of your source account. You'll get a temporary token string.
1. Then you call the **ImportProject** API using the token string and the training key of your target account. The project will then be listed under your target account.

## Get the project ID

First call **[GetProjects](https://westus2.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddead)** to see a list of your existing Custom Vision projects and their IDs. Use the training key and endpoint of your source account.

```curl
curl -v -X GET "{endpoint}/customvision/v3.3/Training/projects"
-H "Training-key: {training key}"
```

You'll get a `200\OK` response with a list of projects and their metadata in the body. The `"id"` value is the string to copy for the next steps.

```json
[
  {
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "string",
    "description": "string",
    "settings": {
      "domainId": "00000000-0000-0000-0000-000000000000",
      "classificationType": "Multiclass",
      "targetExportPlatforms": [
        "CoreML"
      ],
      "useNegativeSet": true,
      "detectionParameters": "string",
      "imageProcessingSettings": {
        "augmentationMethods": {}
      }
    },
    "created": "string",
    "lastModified": "string",
    "thumbnailUri": "string",
    "drModeEnabled": true,
    "status": "Succeeded"
  }
]
```

## Export the project

Call **[ExportProject](https://westus2.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddeb3)** using the project ID and your source training key and endpoint.

```curl
curl -v -X GET "{endpoint}/customvision/v3.3/Training/projects/{projectId}/export"
-H "Training-key: {training key}"
```

You'll get a `200/OK` response with metadata about the exported project and a reference string `"token"`. Copy the value of the token.

```json
{
  "iterationCount": 0,
  "imageCount": 0,
  "tagCount": 0,
  "regionCount": 0,
  "estimatedImportTimeInMS": 0,
  "token": "string"
}
```

> [!TIP]
> If you get an "Invalid Token" error when you import your project, it could be that the token URL string isn't web encoded. You can encode the token using a [URL Encoder](https://meyerweb.com/eric/tools/dencoder/).

## Import the project

Call **[ImportProject](https://westus2.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc7548b571998fddee3)** using your target training key and endpoint, along with the reference token. You can also give your project a name in its new account.

```curl
curl -v -G -X POST "{endpoint}/customvision/v3.3/Training/projects/import"
--data-urlencode "token={token}" --data-urlencode "name={name}"
-H "Training-key: {training key}" -H "Content-Length: 0"
```

You'll get a `200/OK` response with metadata about your newly imported project.

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "string",
  "description": "string",
  "settings": {
    "domainId": "00000000-0000-0000-0000-000000000000",
    "classificationType": "Multiclass",
    "targetExportPlatforms": [
      "CoreML"
    ],
    "useNegativeSet": true,
    "detectionParameters": "string",
    "imageProcessingSettings": {
      "augmentationMethods": {}
    }
  },
  "created": "string",
  "lastModified": "string",
  "thumbnailUri": "string",
  "drModeEnabled": true,
  "status": "Succeeded"
}
```

## Next steps

In this guide, you learned how to copy and move a project between Custom Vision resources. Next, explore the API reference docs to see what else you can do with Custom Vision.
* [REST API reference documentation](/rest/api/custom-vision/)
