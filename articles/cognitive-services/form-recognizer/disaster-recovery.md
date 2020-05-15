---
title: Disaster recovery guidance for Azure Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to use the copy model API to back up your Form Recognizer resources.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 04/20/2020
ms.author: pafarley
---

# Back up and recover your Form Recognizer data

The Form Recognizer service allows you to train custom models. In many cases you may want to move or copy your models from one subscription to another. The Copy API feature enables these scenarios by allowing you to copy custom models within your `Form Recognizer` account or across other accounts, which can exist in any supported region.


##  Prerequisites

1. A Form Recognizer Azure resource. If you don't have one, go to the Azure portal and <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a new Form Recognizer resource" target="_blank">create a new Form Recognizer resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
2. The subscription ID of your Form Recognizer resource. You can find this value on the resource's **Overview** tab on the Azure portal.


## Terminology

1. Source - The `Form Recognizer` resource that owns a model to be copied.
1. Target - The `Form Recognizer` resource that will receive a model from the `Source` resource.

# Process Flow

The section below describes the end to end flow of a typical Copy operation.

![image.png](/.attachments/image-29dab1c6-cd90-4012-8d11-e35a1da6da37.png =500x400)

1. First you issue a copy authorization request to the target resource - the resource that will received the copied model. You get back the URI of the new model metadata that will receive the copy data.
1. Next you send the copy request to the source resource - the resource that contains the model to be copied. You'll get back the URL that you can query to track the progress.
1. query the progress URL against the source resource
1. You can also query the modelID in the target resource to get the status of the new model.

## Generate Copy Authorization [Target]


```
POST https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/copyAuthorization HTTP/1.1
Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}


HTTP/1.1 201 Created
Location: https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/33f4d42c-cd2f-4e74-b990-a1aeafab5a5d
{"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","accessToken":"1855fe23-5ffc-427b-aab2-e5196641502f","expirationDateTimeTicks":637233481531659440}

```

1. The copy process begins with the user issuing a `copyAuthorization` request against the target resource.

2. This request yields a `201/Created` response with the with the `Location` returning the URI of the new model that will be copied into. In addition, the response body contains a JSON authorization payload that must be saved for use with the copy API. 

## Start Copy Operation [Source]

```
POST https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copy HTTP/1.1
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_API_KEY}

{
   "targetResourceId": "{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_ID}",  
   "targetResourceRegion": "{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_REGION_NAME}",
   "copyAuthorization": {"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","accessToken":"1855fe23-5ffc-427b-aab2-e5196641502f","expirationDateTimeTicks":637233481531659440}
}


HTTP/1.1 202 Accepted
Operation-Location: https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copyresults/02989ba8-1296-499f-aaf4-55cfff41b8f1

```

1. User initiates the actual model copy by invoking the copy API against a model in the source resource. The user supplies the following information as part of the request body:

       a. targetAzureResourceId: The Azure Resource ID of the target resource
       b. targetAzureRegion: The region of the target Azure Resource
       c. copyAuthorization: The entire response JSON from the `copyAuthorization` response.

2. A successful response to the copy request is a `202\Accepted` with the `Operation-Location` header containing the URI to an operation that can be used to track the progress.


## Track Model Copy Progress [Source | Target]

The copy operation can independently be tracked at the source and target resources.

1. Source: In the source resource the copy progress is tracked by querying the `copyResult` URI against the source resource endpoint. The `copyResult` URI is returned with the `copy` response's `Operation-Location` header.

```
GET https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copyresults/02989ba8-1296-499f-aaf4-55cfff41b8f1 HTTP/1.1
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_API_KEY}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"status":"succeeded","createdDateTime":"2020-04-23T18:18:01.0275043Z","lastUpdatedDateTime":"2020-04-23T18:18:01.0275048Z","copyResult":{}}
```

2. Target: In the target resource the progress is tracked by directly checking the status of the model that be created. The URI for the GET models/{modelId} is returned by the `Location` header of the `copyAuthorization` API.

```
GET https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/33f4d42c-cd2f-4e74-b990-a1aeafab5a5d HTTP/1.1
Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}


HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"modelInfo":{"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","status":"ready","createdDateTime":"2020-02-26T16:59:28Z","lastUpdatedDateTime":"2020-02-26T16:59:34Z"},"trainResult":{"trainingDocuments":[{"documentName":"0.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"1.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"2.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"3.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"4.pdf","pages":1,"errors":[],"status":"succeeded"}],"errors":[]}}

```

## Samples

### Generate Copy Authorization

```bash
curl -i -X POST "https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/copyAuthorization" -H "Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}" 

```

### Copy Model

```bash
curl -i -X POST "https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/copyAuthorization" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}" --data-ascii "{ \"targetResourceId\": \"{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_ID}\",   \"targetResourceRegion\": \"{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_REGION_NAME}\", \"copyAuthorization\": "{\"modelId\":\"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d\",\"accessToken\":\"1855fe23-5ffc-427b-aab2-e5196641502f\",\"expirationDateTimeTicks\":637233481531659440}"}"

```

### Get Copy Model Result

```bash
curl -i GET "https://<SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT>/formrecognizer/v2.0-preview/custom/models/{SOURCE_MODELID}/copyResults/{RESULT_ID}" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_API_KEY}"

```


