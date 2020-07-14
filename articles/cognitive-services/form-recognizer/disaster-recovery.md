---
title: Disaster recovery guidance for Azure Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to use the copy model API to back up your Form Recognizer resources.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 05/27/2020
ms.author: pafarley
---

# Back up and recover your Form Recognizer models

When you create a Form Recognizer resource in the Azure portal, you specify a region. From then on, your resource and all of its operations stay associated with that particular Azure server region. It's rare, but not impossible, to encounter a network issue that hits an entire region. If your solution needs to always be available, then you should design it to either fail-over into another region or split the workload between two or more regions. Both approaches require at least two Form Recognizer resources in different regions and the ability to sync [custom models](./quickstarts/curl-train-extract.md) across regions.

The Copy API enables this scenario by allowing you to copy custom models from one Form Recognizer account or into others, which can exist in any supported geographical region. This guide shows you how to use the Copy REST API with cURL. You can also use an HTTP request service like Postman to issue the requests.

## Business scenarios

If your app or business depends on the use of a Form Recognizer custom model, we recommend you copy your model to another Form Recognizer account in another region. If a regional outage occurs, you can then access your model in the region where it was copied.

##  Prerequisites

1. Two Form Recognizer Azure resources in different Azure regions. If you don't have them, go to the Azure portal and <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a new Form Recognizer resource" target="_blank">create a new Form Recognizer resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
1. The subscription key, endpoint URL, and subscription ID of your Form Recognizer resource. You can find these values on the resource's **Overview** tab on the Azure portal.


## Copy API overview

The process for copying a custom model consists of the following steps:

1. First you issue a copy authorization request to the target resource&mdash;that is, the resource that will receive the copied model. You get back the URL of the newly created target model, which will receive the copied data.
1. Next you send the copy request to the source resource&mdash;the resource that contains the model to be copied. You'll get back a URL that you can query to track the progress of the operation.
1. You'll use your source resource credentials to query the progress URL until the operation is a success. You can also query the new model ID in the target resource to get the status of the new model.

## Generate Copy authorization request

The following HTTP request gets copy authorization from your target resource. You'll need to enter the endpoint and key of your target resource as headers.

```
POST https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/copyAuthorization HTTP/1.1
Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}
```

You'll get a `201\Created` response with a `modelId` value in the body. This string is the ID of the newly created (blank) model. The `accessToken` is needed for the API to copy data to this resource, and the `expirationDateTimeTicks` value is the expiration of the token. Save all three of these values to a secure location.

```
HTTP/1.1 201 Created
Location: https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/33f4d42c-cd2f-4e74-b990-a1aeafab5a5d
{"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","accessToken":"1855fe23-5ffc-427b-aab2-e5196641502f","expirationDateTimeTicks":637233481531659440}
```

## Start Copy operation

The following HTTP request starts the Copy operation on the source resource. You'll need to enter the endpoint and key of your source resource as headers. Notice that the request URL contains the model ID of the source model you want to copy.

```
POST https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copy HTTP/1.1
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_API_KEY}
```

The body of your request needs to have the following format. You'll need to enter the resource ID and region name of your target resource. You'll also need the model ID, access token, and expiration value that you copied from the previous step.

```json
{
   "targetResourceId": "{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_ID}",  
   "targetResourceRegion": "{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_REGION_NAME}",
   "copyAuthorization": {"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","accessToken":"1855fe23-5ffc-427b-aab2-e5196641502f","expirationDateTimeTicks":637233481531659440}
}
```

You'll get a `202\Accepted` response with an Operation-Location header. This value is the URL that you'll use to track the progress of the operation. Copy it to a temporary location for the next step.

```
HTTP/1.1 202 Accepted
Operation-Location: https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copyresults/02989ba8-1296-499f-aaf4-55cfff41b8f1
```

## Track Copy progress

Track your progress by querying the **Get Copy Model Result** API against the source resource endpoint.

```
GET https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copyresults/02989ba8-1296-499f-aaf4-55cfff41b8f1 HTTP/1.1
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_API_KEY}
```

Your response will vary depending on the status of the operation. Look for the `"status"` field in the JSON body. If you're automating this API call in a script, we recommend querying the operation once every second.

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"status":"succeeded","createdDateTime":"2020-04-23T18:18:01.0275043Z","lastUpdatedDateTime":"2020-04-23T18:18:01.0275048Z","copyResult":{}}
```

### [Optional] Track the target model ID 

You can also use the **Get Custom Model** API to track the status of the operation by querying the target model. Call this API using the target model ID that you copied down in the first step.

```
GET https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/33f4d42c-cd2f-4e74-b990-a1aeafab5a5d HTTP/1.1
Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}
```

In the response body, you'll see information about the model. Check the `"status"` field for the status of the model.

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"modelInfo":{"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","status":"ready","createdDateTime":"2020-02-26T16:59:28Z","lastUpdatedDateTime":"2020-02-26T16:59:34Z"},"trainResult":{"trainingDocuments":[{"documentName":"0.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"1.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"2.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"3.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"4.pdf","pages":1,"errors":[],"status":"succeeded"}],"errors":[]}}
```

## cURL sample code

The following code snippets use cURL to make the API calls outlined in the steps above. You'll still need to fill in the model IDs and subscription information specific to your own resources.

### Generate Copy authorization request

```bash
curl -i -X POST "https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/copyAuthorization" -H "Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}" 
```

### Start Copy operation

```bash
curl -i -X POST "https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.0-preview/custom/models/copyAuthorization" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_API_KEY}" --data-ascii "{ \"targetResourceId\": \"{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_ID}\",   \"targetResourceRegion\": \"{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_REGION_NAME}\", \"copyAuthorization\": "{\"modelId\":\"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d\",\"accessToken\":\"1855fe23-5ffc-427b-aab2-e5196641502f\",\"expirationDateTimeTicks\":637233481531659440}"}"
```

### Track Copy progress

```bash
curl -i GET "https://<SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT>/formrecognizer/v2.0-preview/custom/models/{SOURCE_MODELID}/copyResults/{RESULT_ID}" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_API_KEY}"
```

## Next steps

In this guide, you learned how to use the Copy API to back up your custom models to a secondary Form Recognizer resource. Next, explore the API reference docs to see what else you can do with Form Recognizer.
* [REST API reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/AnalyzeWithCustomForm)