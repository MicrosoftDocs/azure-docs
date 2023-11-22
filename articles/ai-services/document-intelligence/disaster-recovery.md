---
title: Disaster recovery guidance - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Learn how to use the copy model API to back up your Document Intelligence resources.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: lajanuar
---

<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD033 -->

# Disaster recovery

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [applies to v4.0](includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v21.md)]
::: moniker-end

::: moniker range=">= doc-intel-2.1.0"

When you create a Document Intelligence resource in the Azure portal, you specify a region. From then on, your resource and all of its operations stay associated with that particular Azure server region. It's rare, but not impossible, to encounter a network issue that hits an entire region. If your solution needs to always be available, then you should design it to either fail-over into another region or split the workload between two or more regions. Both approaches require at least two Document Intelligence resources in different regions and the ability to sync custom models across regions.

The Copy API enables this scenario by allowing you to copy custom models from one Document Intelligence account or into others, which can exist in any supported geographical region. This guide shows you how to use the Copy REST API with cURL. You can also use an HTTP request service like Postman to issue the requests.

## Business scenarios

If your app or business depends on the use of a Document Intelligence custom model, we recommend you copy your model to another Document Intelligence account in another region. If a regional outage occurs, you can then access your model in the region where it was copied.

## Prerequisites

1. Two Document Intelligence Azure resources in different Azure regions. If you don't have them, go to the Azure portal and [create a new Document Intelligence resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer).
1. The key, endpoint URL, and subscription ID for your Document Intelligence resource. You can find these values on the resource's **Overview** tab in the [Azure portal](https://portal.azure.com/#home).

::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

## Copy API overview

The process for copying a custom model consists of the following steps:

1. First you issue a copy authorization request to the target resource&mdash;that is, the resource that receives the copied model. You receive back the URL of the newly created target model that receives the copied model.
1. Next you send the copy request to the source resource&mdash;the resource that contains the model to be copied with the payload (copy authorization) returned from the previous call. You receive back a URL that you can query to track the progress of the operation.
1. You use your source resource credentials to query the progress URL until the operation is a success. With v3.0, you can also query the new model ID in the target resource to get the status of the new model.

## Generate Copy authorization request

The following HTTP request gets copy authorization from your target resource. You need to enter the endpoint and key of your target resource as headers.

```http
POST https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/documentModels:authorizeCopy?api-version=2023-07-31
Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_KEY}
```

Request body

```json
{
  "modelId": "target-model-name",
  "description": "Copied from SCUS"
}
```

You receive a `200` response code with response body that contains the JSON payload required to initiate the copy.

```json
{
  "targetResourceId": "/subscriptions/{targetSub}/resourceGroups/{targetRG}/providers/Microsoft.CognitiveServices/accounts/{targetService}",
  "targetResourceRegion": "region",
  "targetModelId": "target-model-name",
  "targetModelLocation": "model path",
  "accessToken": "access token",
  "expirationDateTime": "timestamp"
}
```

## Start Copy operation

The following HTTP request starts the copy operation on the source resource. You need to enter the endpoint and key of your source resource as the url and header. Notice that the request URL contains the model ID of the source model you want to copy.

```http
POST {{source-endpoint}}formrecognizer/documentModels/{model-to-be-copied}:copyTo?api-version=2023-07-31
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_KEY}
```

The body of your request is the response from the previous step.

```json
{
  "targetResourceId": "/subscriptions/{targetSub}/resourceGroups/{targetRG}/providers/Microsoft.CognitiveServices/accounts/{targetService}",
  "targetResourceRegion": "region",
  "targetModelId": "target-model-name",
  "targetModelLocation": "model path",
  "accessToken": "access token",
  "expirationDateTime": "timestamp"
}
```

You receive a `202\Accepted` response with an Operation-Location header. This value is the URL that you use to track the progress of the operation. Copy it to a temporary location for the next step.

```http
HTTP/1.1 202 Accepted
Operation-Location: https://{source-resource}.cognitiveservices.azure.com/formrecognizer/operations/{operation-id}?api-version=2023-07-31
```

> [!NOTE]
> The Copy API transparently supports the [AEK/CMK](https://msazure.visualstudio.com/Cognitive%20Services/_wiki/wikis/Cognitive%20Services.wiki/52146/Customer-Managed-Keys) feature. This doesn't require any special treatment, but note that if you're copying between an unencrypted resource to an encrypted resource, you need to include the request header `x-ms-forms-copy-degrade: true`. If this header is not included, the copy operation will fail and return a `DataProtectionTransformServiceError`.

## Track Copy progress

```console
GET https://{source-resource}.cognitiveservices.azure.com/formrecognizer/operations/{operation-id}?api-version=2023-07-31
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_KEY}
```

### Track the target model ID

You can also use the **[Get model](/rest/api/aiservices/document-models/get-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)** API to track the status of the operation by querying the target model. Call the API using the target model ID that you copied down from the [Generate Copy authorization request](#generate-copy-authorization-request) response.

```http
GET https://{YOUR-ENDPOINT}/formrecognizer/documentModels/{modelId}?api-version=2023-07-31" -H "Ocp-Apim-Subscription-Key: {YOUR-KEY}
```

In the response body, you see information about the model. Check the `"status"` field for the status of the model.

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"modelInfo":{"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","status":"ready","createdDateTime":"2020-02-26T16:59:28Z","lastUpdatedDateTime":"2020-02-26T16:59:34Z"},"trainResult":{"trainingDocuments":[{"documentName":"0.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"1.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"2.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"3.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"4.pdf","pages":1,"errors":[],"status":"succeeded"}],"errors":[]}}
```

## cURL sample code

The following code snippets use cURL to make API calls. You also need to fill in the model IDs and subscription information specific to your own resources.

### Generate Copy authorization

**Request**

```bash
curl -i -X POST "{YOUR-ENDPOINT}formrecognizer/documentModels:authorizeCopy?api-version=2023-07-31"
-H "Content-Type: application/json"
-H "Ocp-Apim-Subscription-Key: {YOUR-KEY}"
--data-ascii "{
  'modelId': '{modelId}',
  'description': '{description}'
}"
```

**Successful response**

```json
{
  "targetResourceId": "string",
  "targetResourceRegion": "string",
  "targetModelId": "string",
  "targetModelLocation": "string",
  "accessToken": "string",
  "expirationDateTime": "string"
}
```

### Begin Copy operation

**Request**

```bash
curl -i -X POST "{YOUR-ENDPOINT}/formrecognizer/documentModels/{modelId}:copyTo?api-version=2023-07-31"
-H "Content-Type: application/json"
-H "Ocp-Apim-Subscription-Key: {YOUR-KEY}"
--data-ascii "{
  'targetResourceId': '{targetResourceId}',
  'targetResourceRegion': {targetResourceRegion}',
  'targetModelId': '{targetModelId}',
  'targetModelLocation': '{targetModelLocation}',
  'accessToken': '{accessToken}',
  'expirationDateTime': '{expirationDateTime}'
}"

```

**Successful response**

```http
HTTP/1.1 202 Accepted
Operation-Location: https://{source-resource}.cognitiveservices.azure.com/formrecognizer/operations/{operation-id}?api-version=2023-07-31
```

### Track copy operation progress

You can use the [**Get operation**](https://w/rest/api/aiservices/miscellaneous/get-operation?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) API to list all document model operations (succeeded, in-progress, or failed) associated with your Document Intelligence resource. Operation information only persists for 24 hours. Here's a list of the operations (operationId) that can be returned:

* documentModelBuild
* documentModelCompose
* documentModelCopyTo

### Track the target model ID

If the operation was successful, the document model can be accessed using the [**getModel**](/rest/api/aiservices/document-models/get-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) (get a single model), or [**GetModels**](/rest/api/aiservices/document-models/get-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTPs) (get a list of models) APIs.

::: moniker-end

::: moniker range="doc-intel-2.1.0"

## Copy model overview

The process for copying a custom model consists of the following steps:

1. First you issue a copy authorization request to the target resource&mdash;that is, the resource that receives the copied model. You receive back the URL of the newly created target model that receives the copied model.
1. Next you send the copy request to the source resource&mdash;the resource that contains the model to be copied with the payload (copy authorization) returned from the previous call. You receive back a URL that you can query to track the progress of the operation.
1. You use your source resource credentials to query the progress URL until the operation is a success.

## Generate authorization request

The following HTTP request generates a copy authorization from your target resource. You need to enter the endpoint and key of your target resource as headers.

```http
POST https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/copyAuthorization
Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_KEY}
```

You receive a `201\Created` response with a `modelId` value in the body. This string is the ID of the newly created (blank) model. The `accessToken` is needed for the API to copy data to this resource, and the `expirationDateTimeTicks` value is the expiration of the token. Save all three of these values to a secure location.

```http
HTTP/1.1 201 Created
Location: https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/33f4d42c-cd2f-4e74-b990-a1aeafab5a5d
{"modelId":"<your model ID>","accessToken":"<your access token>","expirationDateTimeTicks":637233481531659440}
```

## Start the copy operation

The following HTTP request starts the Copy operation on the source resource. You need to enter the endpoint and key of your source resource as headers. Notice that the request URL contains the model ID of the source model you want to copy.

```http
POST https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/<your model ID>/copy HTTP/1.1
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_KEY}
```

The body of your request needs to have the following format. You need to enter the resource ID and region name of your target resource. You can find your resource ID on the **Properties** tab of your resource in the Azure portal, and you can find the region name on the **Keys and endpoint** tab. You also need the model ID, access token, and expiration value that you copied from the previous step.

```json
{
   "targetResourceId": "{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_ID}",  
   "targetResourceRegion": "{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_REGION_NAME}",
   "copyAuthorization": {"modelId":"<your model ID>","accessToken":"<your access token>","expirationDateTimeTicks":637233481531659440}
}
```

You receive a `202\Accepted` response with an Operation-Location header. This value is the URL that you use to track the progress of the operation. Copy it to a temporary location for the next step.

```http
HTTP/1.1 202 Accepted
Operation-Location: https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copyresults/02989ba8-1296-499f-aaf4-55cfff41b8f1
```

> [!NOTE]
> The Copy API transparently supports the [AEK/CMK](https://msazure.visualstudio.com/Cognitive%20Services/_wiki/wikis/Cognitive%20Services.wiki/52146/Customer-Managed-Keys) feature. This operation doesn't require any special treatment, but note that if you're copying between an unencrypted resource to an encrypted resource, you need to include the request header `x-ms-forms-copy-degrade: true`. If this header is not included, the copy operation will fail and return a `DataProtectionTransformServiceError`.

### Track operation progress

Track your progress by querying the **Get Copy Model Result** API against the source resource endpoint.

```http
GET https://{SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/eccc3f13-8289-4020-ba16-9f1d1374e96f/copyresults/02989ba8-1296-499f-aaf4-55cfff41b8f1 HTTP/1.1
Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_KEY}
```

The response varies depending on the status of the operation. Look for the `"status"` field in the JSON body. If you're automating this API call in a script, we recommend querying the operation once every second.

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"status":"succeeded","createdDateTime":"2020-04-23T18:18:01.0275043Z","lastUpdatedDateTime":"2020-04-23T18:18:01.0275048Z","copyResult":{}}
```

### Track operation status with modelID

You can also use the **Get Custom Model** API to track the status of the operation by querying the target model. Call this API using the target model ID that you copied down in the first step.

```http
GET https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/33f4d42c-cd2f-4e74-b990-a1aeafab5a5d HTTP/1.1
Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_KEY}
```

In the response body, you receive information about the model. Check the `"status"` field for the status of the model.

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"modelInfo":{"modelId":"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d","status":"ready","createdDateTime":"2020-02-26T16:59:28Z","lastUpdatedDateTime":"2020-02-26T16:59:34Z"},"trainResult":{"trainingDocuments":[{"documentName":"0.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"1.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"2.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"3.pdf","pages":1,"errors":[],"status":"succeeded"},{"documentName":"4.pdf","pages":1,"errors":[],"status":"succeeded"}],"errors":[]}}
```

## cURL code samples

The following code snippets use cURL to make API calls. You also need to fill in the model IDs and subscription information specific to your own resources.

### Generate copy authorization

```bash
curl -i -X POST "https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/copyAuthorization" -H "Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_KEY}" 
```

### Start copy operation

```bash
curl -i -X POST "https://{TARGET_FORM_RECOGNIZER_RESOURCE_ENDPOINT}/formrecognizer/v2.1/custom/models/copyAuthorization" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {TARGET_FORM_RECOGNIZER_RESOURCE_KEY}" --data-ascii "{ \"targetResourceId\": \"{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_ID}\",   \"targetResourceRegion\": \"{TARGET_AZURE_FORM_RECOGNIZER_RESOURCE_REGION_NAME}\", \"copyAuthorization\": "{\"modelId\":\"33f4d42c-cd2f-4e74-b990-a1aeafab5a5d\",\"accessToken\":\"1855fe23-5ffc-427b-aab2-e5196641502f\",\"expirationDateTimeTicks\":637233481531659440}"}"
```

### Track copy progress

```bash
curl -i GET "https://<SOURCE_FORM_RECOGNIZER_RESOURCE_ENDPOINT>/formrecognizer/v2.1/custom/models/{SOURCE_MODELID}/copyResults/{RESULT_ID}" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {SOURCE_FORM_RECOGNIZER_RESOURCE_KEY}"
```

::: moniker-end

::: moniker range=">=doc-intel-2.1.0"

### Common error code messages

|Error|Resolution|
|:--|:--|
| 400 / Bad Request with `"code:" "1002"` | Indicates validation error or badly formed copy request. Common issues include: a) Invalid or modified `copyAuthorization` payload. b) Expired value for `expirationDateTimeTicks` token (`copyAuthorization` payload is valid for 24 hours). c) Invalid or unsupported `targetResourceRegion`. d) Invalid or malformed `targetResourceId` string.
|*Authorization failure due to missing or invalid authorization claims*.| Occurs when the `copyAuthorization` payload or content is modified from the `copyAuthorization` API. Ensure that the payload is the same exact content that was returned from the earlier `copyAuthorization` call.|
|*Couldn't retrieve authorization metadata*.| Indicates that the `copyAuthorization` payload is being reused with a copy request. A copy request that succeeds doesn't allow any further requests that use the same `copyAuthorization` payload. If you raise a separate error and you later retry the copy with the same authorization payload, this error gets raised. The resolution is to generate a new `copyAuthorization` payload and then reissue the copy request.|
|*Data transfer request isn't allowed as it downgrades to a less secure data protection scheme*.| Occurs when copying between an `AEK` enabled resource to a non `AEK` enabled resource. To allow copying encrypted model to the target as unencrypted specify `x-ms-forms-copy-degrade: true` header with the copy request.|
|"Couldn't fetch information for Cognitive resource with ID...". | Indicates that the Azure resource indicated by the `targetResourceId` isn't a valid Cognitive resource or doesn't exist. Verify and reissue the copy request to resolve this issue.</br> Ensure the resource is valid and exists in the specified region, such as, `westus2`|

::: moniker-end

## Next steps

::: moniker range=">=doc-intel-3.0.0"

In this guide, you learned how to use the Copy API to back up your custom models to a secondary Document Intelligence resource. Next, explore the API reference docs to see what else you can do with Document Intelligence.

* [REST API reference documentation](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)

::: moniker-end

::: moniker range="doc-intel-2.1.0"
In this guide, you learned how to use the Copy API to back up your custom models to a secondary Document Intelligence resource. Next, explore the API reference docs to see what else you can do with Document Intelligence.

* [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)

::: moniker-end
