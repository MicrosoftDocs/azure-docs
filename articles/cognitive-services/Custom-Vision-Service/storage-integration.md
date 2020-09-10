---
title: tbd
titleSuffix: Azure Cognitive Services
description: tbd
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: how-to
ms.date: 09/09/2020
ms.author: pafarley
---

# Integrate Azure storage queue and backup

You can integrate your Custom Vision project with an Azure blob storage queue to get push notifications of project activity and backup copies of published models.

You can get notifications in an Azure Storage queue when ever a project is updated, or model iteration is trained or published. 

This guide shows you how to use these REST APIs with cURL. You can also use an HTTP request service like Postman to issue the requests.

> [!NOTE]
> Push notifications depend on the optional _notificationQueueUri_ parameter in the **CreateProject** API. Model backup copies require that you also use the optional _exportModelContainerUri_ parameter. This guide will show you how to use both for the full set of features.

## Prerequisites

- A Custom Vision resource in Azure. If you don't have one, go to the Azure portal and <a href="https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_customvision#create/Microsoft.CognitiveServicesCustomVision" title="Create a new Custom Vision resource" target="_blank">create a new Custom Vision resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>. This feature does not currently support the Cognitive Service resource (all in one key).
- An Azure Storage account with a blob container. Follow [Exercises 1 of the Azure Storage Lab](https://github.com/Microsoft/computerscience/blob/master/Labs/Azure%20Services/Azure%20Storage/Azure%20Storage%20and%20Cognitive%20Services%20(MVC).md#Exercise1) if you need help with this step.

## Set up Azure storage integration

Go to your Custom Vision training resource on the Azure portal, select the **Identity** page, and enable system assigned managed identity.

Next, go to your storage resource in the Azure portal. Go to the **Access control (IAM)** page and add a role assignment for each integration feature:
* Select your Custom Vision training resource and assign the **Storage Blob Data Contributor** role if you plan to use the model backup feature. 
* Select your Custom Vision training resource and assign the **Storage Queue Data Contributor** if you plan to use the notification queue feature.

### Get integration URLs

Next, you'll get the URLs that were just generated when you assigned these roles.

For the notification queue integration URL, go to the **Queues** page of your storage account, find the queue you just set up, and copy its URL.

"https://testcmkcanarystorage.queue.core.windows.net/test-mi-queue"
 

For the model backup integration URL, go to the **Containers** page of your storage account and select the container titled **aaa**. Copy the URL from its **Properties** page. 
 
"https://testcmkcanarystorage.blob.core.windows.net/aaa"

## Integrate Custom Vision project

Now that you have the integration URLs, you can create a new Custom Vision project that integrates these Azure Storage features. You can also update an existing project to add the features.


### Create new

When you call the [CreateProject](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddeae) API, add the optional parameters _exportModelContainerUri_ and _notificationQueueUri_. Assign the URL values you got in the previous section. 

```curl
curl -v -X POST "{endpoint}/customvision/v3.3/Training/projects?exportModelContainerUri={inputUri}&notificationQueueUri={inputUri}&name={inputName}"
-H "Training-key: {subscription key}"
```

If you receive a `200/OK` response, that means the URLs have been set up successfully. You should see your URL values in the JSON response as well:

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
},
"exportModelContainerUri": {url}
"notificationQueueUri": {url}
  },
  "created": "string",
  "lastModified": "string",
  "thumbnailUri": "string",
  "drModeEnabled": true,
  "status": "Succeeded"
}
```

### Update existing

To update an existing project with Azure storage feature integration, call the [UpdateProject](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddeb1) API, using the ID of the project you want to update. 

```curl
curl -v -X PATCH "{endpoint}/customvision/v3.3/Training/projects/{projectId}"
-H "Content-Type: application/json"
-H "Training-key: {subscription key}"

--data-ascii "{body}" 
```

Set the request body (`body`) to the following JSON format, filling in the appropriate values for _exportModelContainerUri_ and _notificationQueueUri_:

```json
{
  "name": "string",
  "description": "string",
  "settings": {
    "domainId": "00000000-0000-0000-0000-000000000000",
    "classificationType": "Multiclass",
    "targetExportPlatforms": [
      "CoreML"
    ],
    "imageProcessingSettings": {
      "augmentationMethods": {}
},
"exportModelContainerUri": {url}
"notificationQueueUri": {url}

  },
  "status": "Succeeded"
}
```

If you receive a `200/OK` response, that means the URLs have been set up successfully.

## Verify the connection 

Your API call in the previous section should have already triggered new information in your Azure storage account. 

In your **aaa** container, there should be a test blob inside a **CustomVision-TestPermission** folder. This will only exist temporarily.

In your notification queue, you should see a test notification in the following format:
 
```json
{
"version": "1.0" ,
"type": "ConnectionTest",
"Content":
    {
    "projectId": "00000000-0000-0000-0000-000000000000"
    }
}
```

## Get event notifications

When you're ready, call the [TrainProject](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc7548b571998fddee1) API to do an ordinary train on your project.

In your Storage notification queue, you'll receive a notification once training finishes:
 
```json
{
"version": "1.0" ,
"type": "Training",
"Content":
    {
    "projectId": "00000000-0000-0000-0000-000000000000",
    "iterationId": "00000000-0000-0000-0000-000000000000",
    "trainingStatus": "TrainingCompleted"
    }
}
```

The `"trainingStatus"` field can be either `"TrainingCompleted"` or `"TrainingFailed"`. The `"iterationId"` field is the ID of the trained model.

## Get model export backups

When you're ready, call the [ExportIteration](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddece) API to export a trained model into a specified platform.

In your **aaa** storage container, a backup copy of the exported model will appear. The blob name will have the format:

```
{projectId} - {iterationId}.{platformType}
```

Also, you'll receive a notification in your queue when the export finishes. 

```json
{
"version": "1.0" ,
"type": "Export",
"Content":
    {
    "projectId": "00000000-0000-0000-0000-000000000000",
    "iterationId": "00000000-0000-0000-0000-000000000000",
    "exportStatus": "ExportCompleted",
    "modelUri": {url}
    }
}
```

The `"exportStatus"` field can be either `"ExportCompleted"` or `"ExportFailed"`. The `"modelUri"` field will contain the URL of the backup model stored in your container, assuming you integrated queue notifications in the beginning. If you did not, the `"modelUri"` field will show the SAS URL for your custom vision model blob.

## Next steps

In this guide, you learned how to copy and move a project between Custom Vision resources. Next, explore the API reference docs to see what else you can do with Custom Vision.
* [REST API reference documentation](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddeb3)
