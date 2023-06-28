---
title: Authoring API - question answering
titleSuffix: Azure AI services
description: Use the question answering Authoring API to automate common tasks like adding new question answer pairs, and creating, and publishing projects. 
ms.service: cognitive-services
ms.subservice: language-service
author: jboback
ms.author: jboback
ms.topic: how-to
ms.date: 11/23/2021
---

# Authoring API

The question answering Authoring API is used to automate common tasks like adding new question answer pairs, as well as creating, publishing, and maintaining projects. 

> [!NOTE]
> Authoring functionality is available via the REST API and [Authoring SDK (preview)](/dotnet/api/overview/azure/ai.language.questionanswering-readme). This article provides examples of using the REST API with cURL. For full documentation of all parameters and functionality available consult the [REST API reference content](/rest/api/cognitiveservices/questionanswering/question-answering-projects).

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/). Several command-line switches are used in this article, which are noted in the [cURL documentation](https://curl.haxx.se/docs/manpage.html).
* The commands in this article are designed to be executed in a Bash shell. These commands will not always work in a Windows command prompt or in PowerShell without modification. If you do not have a Bash shell installed locally, you can use the [Azure Cloud Shell's bash environment](../../../../cloud-shell/overview.md).

## Create a project

To create a project programmatically:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If the prior example was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively, you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `NEW-PROJECT-NAME` | The name for your new question answering project.|

You can also adjust additional values like the project language, the default answer given when no answer can be found that meets or exceeds the confidence threshold, and whether this language resource will support multiple languages.

### Example query

```bash
curl -X PATCH -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '{
      "description": "proj1 is a test project.",
      "language": "en",
      "settings": {
        "defaultAnswer": "No good match found for your question in the project."
      },
      "multilingualResource": true
    }
  }'  'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{NEW-PROJECT-NAME}?api-version=2021-10-01'
```

### Example response

```json
{
 "200": {
      "headers": {},
      "body": {
        "projectName": "proj1",
        "description": "proj1 is a test project.",
        "language": "en",
        "settings": {
          "defaultAnswer": "No good match found for your question in the project."
        },
        "multilingualResource": true,
        "createdDateTime": "2021-05-01T15:13:22Z",
        "lastModifiedDateTime": "2021-05-01T15:13:22Z",
        "lastDeployedDateTime": "2021-05-01T15:13:22Z"
      }
 }
}
```

## Delete Project

To delete a project programmatically:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If the prior example was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to delete.|

### Example query

```bash
curl -X DELETE -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}?api-version=2021-10-01'
```

A successful call to delete a project results in an `Operation-Location` header being returned, which can be used to check the status of the delete project job. In most our examples, we haven't needed to look at the response headers and thus haven't been displaying them. To retrieve the response headers our curl command uses `-i`. Without this parameter prior to the endpoint address, the response to this command would appear empty as if no response occurred.

### Example response

```bash
HTTP/2 202
content-length: 0
operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/deletion-jobs/{JOB-ID-GUID}
x-envoy-upstream-service-time: 324
apim-request-id:
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Tue, 23 Nov 2021 20:56:18 GMT
```

If the project was already deleted or could not be found, you would receive a message like:

```json
{
  "error": {
    "code": "ProjectNotFound",
    "message": "The specified project was not found.",
    "details": [
      {
        "code": "ProjectNotFound",
        "message": "{GUID}"
      }
    ]
  }
}
```

### Get project deletion status

To check on the status of your delete project request:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to check on the deployment status for.|
| `JOB-ID` | When you delete a project programmatically, a `JOB-ID` is generated as part of the `operation-location` response header to the deletion request. The `JOB-ID` is the guid at the end of the `operation-location`. For example: `operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/deletion-jobs/{THIS GUID IS YOUR JOB ID}` |

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/deletion-jobs/{JOB-ID}?api-version=2021-10-01'
```

### Example response

```json
{
  "createdDateTime": "2021-11-23T20:56:18+00:00",
  "expirationDateTime": "2021-11-24T02:56:18+00:00",
  "jobId": "GUID",
  "lastUpdatedDateTime": "2021-11-23T20:56:18+00:00",
  "status": "succeeded"
}
```

## Get project settings

To retrieve information about a given project, update the following values in the query below:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to retrieve information about.|

### Example query

```bash

curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}?api-version=2021-10-01'
```

### Example response

```json
 {
    "200": {
      "headers": {},
      "body": {
        "projectName": "proj1",
        "description": "proj1 is a test project.",
        "language": "en",
        "settings": {
          "defaultAnswer": "No good match found for your question in the project."
        },
        "createdDateTime": "2021-05-01T15:13:22Z",
        "lastModifiedDateTime": "2021-05-01T15:13:22Z",
        "lastDeployedDateTime": "2021-05-01T15:13:22Z"
      }
    }
  }
```

## Get question answer pairs

To retrieve question answer pairs and related information for a given project, update the following values in the query below:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to retrieve all the question answer pairs for.|

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/qnas?api-version=2021-10-01'

```

### Example response

```json
{
    "200": {
      "headers": {},
      "body": {
        "value": [
          {
            "id": 1,
            "answer": "ans1",
            "source": "source1",
            "questions": [
              "question 1.1",
              "question 1.2"
            ],
            "metadata": {
              "k1": "v1",
              "k2": "v2"
            },
            "dialog": {
              "isContextOnly": false,
              "prompts": [
                {
                  "displayOrder": 1,
                  "qnaId": 11,
                  "displayText": "prompt 1.1"
                },
                {
                  "displayOrder": 2,
                  "qnaId": 21,
                  "displayText": "prompt 1.2"
                }
              ]
            },
            "lastUpdatedDateTime": "2021-05-01T17:21:14Z"
          },
          {
            "id": 2,
            "answer": "ans2",
            "source": "source2",
            "questions": [
              "question 2.1",
              "question 2.2"
            ],
            "lastUpdatedDateTime": "2021-05-01T17:21:14Z"
          }
        ]
      }
    }
  }
```

## Get sources

To retrieve the sources and related information for a given project, update the following values in the query below:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to retrieve all the source information for.|

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT_NAME}/sources?api-version=2021-10-01'
```

### Example response

```json
{
    "200": {
      "headers": {},
      "body": {
        "value": [
          {
            "displayName": "source1",
            "sourceUri": "https://learn.microsoft.com/azure/ai-services/qnamaker/overview/overview",
            "sourceKind": "url",
            "lastUpdatedDateTime": "2021-05-01T15:13:22Z"
          },
          {
            "displayName": "source2",
            "sourceUri": "https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf",
            "sourceKind": "file",
            "contentStructureKind": "unstructured",
            "lastUpdatedDateTime": "2021-05-01T15:13:22Z"
          }
        ]
      }
    }
  }
```

## Get synonyms

To retrieve synonyms and related information for a given project, update the following values in the query below:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to retrieve synonym information for.|

### Example query

```bash

curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/synonyms?api-version=2021-10-01'
```

### Example response

```json
 {
    "200": {
      "headers": {},
      "body": {
        "value": [
          {
            "alterations": [
              "qnamaker",
              "qna maker"
            ]
          },
          {
            "alterations": [
              "botframework",
              "bot framework"
            ]
          }
        ]
      }
    }
  }
```

## Deploy project

To deploy a project to production, update the following values in the query below:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to deploy to production.|

### Example query

```bash
curl -X PUT -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/deployments/production?api-version=2021-10-01'  
```

A successful call to deploy a project results in an `Operation-Location` header being returned which can be used to check the status of the deployment job. In most our examples, we haven't needed to look at the response headers and thus haven't been displaying them. To retrieve the response headers our curl command uses `-i`. Without this parameter prior to the endpoint address, the response to this command would appear empty as if no response occurred.

### Example response

```bash
0HTTP/2 202
content-length: 0
operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/deployments/production/jobs/{JOB-ID-GUID}
x-envoy-upstream-service-time: 31
apim-request-id:
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Tue, 23 Nov 2021 20:35:00 GMT
```

### Get project deployment status

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to check on the deployment status for.|
| `JOB-ID` | When you deploy a project programmatically, a `JOB-ID` is generated as part of the `operation-location` response header to the deployment request. The `JOB-ID` is the guid at the end of the `operation-location`. For example: `operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/deployments/production/jobs/{THIS GUID IS YOUR JOB ID}` |

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/deployments/production/jobs/{JOB-ID}?api-version=2021-10-01' 
```

### Example response

```json
    {
    "200": {
      "headers": {},
      "body": {
        "errors": [],
        "createdDateTime": "2021-05-01T17:21:14Z",
        "expirationDateTime": "2021-05-01T17:21:14Z",
        "jobId": "{JOB-ID-GUID}",
        "lastUpdatedDateTime": "2021-05-01T17:21:14Z",
        "status": "succeeded"
      }
    }
  }
```

## Export project metadata and assets

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to export.|

### Example query

```bash
curl -X POST -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '{exportAssetTypes": ["qnas","synonyms"]}' -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/:export?api-version=2021-10-01&format=tsv'
```

### Example response

```bash
HTTP/2 202
content-length: 0
operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/Sample-project/export/jobs/{JOB-ID_GUID}
x-envoy-upstream-service-time: 214
apim-request-id:
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Tue, 23 Nov 2021 21:24:03 GMT
```

### Check export status

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to check on the export status for.|
| `JOB-ID` | When you export a project programmatically, a `JOB-ID` is generated as part of the `operation-location` response header to the export request. The `JOB-ID` is the guid at the end of the `operation-location`. For example: `operation-location: https://southcentralus.api.cognitive.microsoft.com/language/query-knowledgebases/projects/sample-proj1/export/jobs/{THIS GUID IS YOUR JOB ID}` |

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/sample-proj1/export/jobs/{JOB-ID}?api-version=2021-10-01' 
```

### Example response

```json
{
  "createdDateTime": "2021-11-23T21:24:03+00:00",
  "expirationDateTime": "2021-11-24T03:24:03+00:00",
  "jobId": "JOB-ID-GUID",
  "lastUpdatedDateTime": "2021-11-23T21:24:08+00:00",
  "status": "succeeded",
  "resultUrl": "https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/export/jobs/{JOB-ID_GUID}/result"
}
```

If you try to access the resultUrl directly, you will get a 404 error. You must append `?api-version=2021-10-01` to the path to make it accessible by an authenticated request: `https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/export/jobs/{JOB-ID_GUID}/result?api-version=2021-10-01`

## Import project

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to be the destination for the import.|
| `FILE-URI-PATH` | When you export a project programmatically, and then check the status the export a `resultUrl` is generated as part of the response. For example: `"resultUrl": "https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/export/jobs/{JOB-ID_GUID}/result"` you can use the resultUrl with the API version appended as a source file to import a project from: `https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/export/jobs/{JOB-ID_GUID}/result?api-version=2021-10-01`.|

### Example query

```bash
curl -X POST -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '{
      "fileUri": "FILE-URI-PATH"
  }' -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/:import?api-version=2021-10-01&format=tsv'
```

A successful call to import a project results in an `Operation-Location` header being returned, which can be used to check the status of the import job. In many of our examples, we haven't needed to look at the response headers and thus haven't been displaying them. To retrieve the response headers our curl command uses `-i`. Without this additional parameter prior to the endpoint address, the response to this command would appear empty as if no response occurred.

### Example response

```bash
HTTP/2 202
content-length: 0
operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/sample-proj1/import/jobs/{JOB-ID-GUID}
x-envoy-upstream-service-time: 417
apim-request-id: 
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Wed, 24 Nov 2021 00:35:11 GMT
```

### Check import status

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to be the destination for the import.|
| `JOB-ID` | When you import a project programmatically, a `JOB-ID` is generated as part of the `operation-location` response header to the export request. The `JOB-ID` is the GUID at the end of the `operation-location`. For example: `operation-location: https://southcentralus.api.cognitive.microsoft.com/language/query-knowledgebases/projects/sample-proj1/import/jobs/{THIS GUID IS YOUR JOB ID}` |

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' 'https://southcentralus.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME/import/jobs/{JOB-ID-GUID}?api-version=2021-10-01' 
```

### Example query response

```bash
{
  "errors": [],
  "createdDateTime": "2021-05-01T17:21:14Z",
  "expirationDateTime": "2021-05-01T17:21:14Z",
  "jobId": "JOB-ID-GUID",
  "lastUpdatedDateTime": "2021-05-01T17:21:14Z",
  "status": "succeeded"
}
```

## List deployments

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to generate a deployment list for.|

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/deployments?api-version=2021-10-01' 
```

### Example response

```json
[
  {
    "deploymentName": "production",
    "lastDeployedDateTime": "2021-10-26T15:12:02Z"
  }
]
```

## List Projects

Retrieve a list of all question answering projects your account has access to.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects?api-version=2021-10-01' 
```

### Example response

```json
{
  "value": [
    {
      "projectName": "Sample-project",
      "description": "My first question answering project",
      "language": "en",
      "multilingualResource": false,
      "createdDateTime": "2021-10-07T04:51:15Z",
      "lastModifiedDateTime": "2021-10-27T00:42:01Z",
      "lastDeployedDateTime": "2021-11-24T01:34:18Z",
      "settings": {
        "defaultAnswer": "No good match found in KB"
      }
    }
  ]
}
```

## Update sources

In this example, we will add a new source to an existing project. You can also replace and delete existing sources with this command depending on what kind of operations you pass as part of your query body.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project where you would like to update sources.|
|`METHOD`| PATCH |

### Example query

```bash
curl -X PATCH -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '[
  {
    "op": "add",
    "value": {
      "displayName": "source5",
      "sourceKind": "url",
      "sourceUri": "https://download.microsoft.com/download/7/B/1/7B10C82E-F520-4080-8516-5CF0D803EEE0/surface-book-user-guide-EN.pdf",
      "sourceContentStructureKind": "semistructured"
    }
  }
]'  -i '{LanguageServiceName}.cognitiveservices.azure.com//language/query-knowledgebases/projects/{projectName}/sources?api-version=2021-10-01'
```

A successful call to update a source results in an `Operation-Location` header being returned which can be used to check the status of the import job. In many of our examples, we haven't needed to look at the response headers and thus haven't always been displaying them. To retrieve the response headers our curl command uses `-i`. Without this parameter prior to the endpoint address, the response to this command would appear empty as if no response occurred.

### Example response

```bash
HTTP/2 202
content-length: 0
operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/Sample-project/sources/jobs/{JOB_ID_GUID}
x-envoy-upstream-service-time: 412
apim-request-id: dda23d2b-f110-4645-8bce-1a6f8d504b33
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Wed, 24 Nov 2021 02:47:53 GMT
```

### Get update source status

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to be the destination for the import.|
| `JOB-ID` | When you update a source programmatically, a `JOB-ID` is generated as part of the `operation-location` response header to the update source request. The `JOB-ID` is the GUID at the end of the `operation-location`. For example: `operation-location: https://southcentralus.api.cognitive.microsoft.com/language/query-knowledgebases/projects/sample-proj1/sources/jobs/{THIS GUID IS YOUR JOB ID}` |

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/sources/jobs/{JOB-ID}?api-version=2021-10-01' 
```

### Example response

```bash
{
  "createdDateTime": "2021-11-24T02:47:53+00:00",
  "expirationDateTime": "2021-11-24T08:47:53+00:00",
  "jobId": "{JOB-ID-GUID}",
  "lastUpdatedDateTime": "2021-11-24T02:47:56+00:00",
  "status": "succeeded",
  "resultUrl": "/knowledgebases/Sample-project"
}

```

## Update question and answer pairs

In this example, we will add a question answer pair to an existing source. You can also modify, or delete existing question answer pairs with this query depending on what operation you pass in the query body. If you don't have a source named `source5`, this example query will fail. You can adjust the source value in the body of the query to a source that exists for your target project.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to be the destination for the import.|

```bash
curl -X PATCH -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '[
    {
        "op": "add",
        "value":{
            "id": 1,
            "answer": "The latest question answering docs are on https://learn.microsoft.com",
            "source": "source5",
            "questions": [
                "Where do I find docs for question answering?"
            ],
            "metadata": {},
            "dialog": {
                "isContextOnly": false,
                "prompts": []
            }
        }
    }
]'  -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/qnas?api-version=2021-10-01'
```

A successful call to update a question answer pair results in an `Operation-Location` header being returned which can be used to check the status of the update job. In many of our examples, we haven't needed to look at the response headers and thus haven't always been displaying them. To retrieve the response headers our curl command uses `-i`. Without this parameter prior to the endpoint address, the response to this command would appear empty as if no response occurred.

### Example response

```bash
HTTP/2 202
content-length: 0
operation-location: https://southcentralus.api.cognitive.microsoft.com:443/language/query-knowledgebases/projects/Sample-project/qnas/jobs/{JOB-ID-GUID}
x-envoy-upstream-service-time: 507
apim-request-id: 
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Wed, 24 Nov 2021 03:16:01 GMT
```

### Get update question answer pairs status

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to be the destination for the question answer pairs updates.|
| `JOB-ID` | When you update a question answer pair programmatically, a `JOB-ID` is generated as part of the `operation-location` response header to the update request. The `JOB-ID` is the GUID at the end of the `operation-location`. For example: `operation-location: https://southcentralus.api.cognitive.microsoft.com/language/query-knowledgebases/projects/sample-proj1/qnas/jobs/{THIS GUID IS YOUR JOB ID}` |

### Example query

```bash
curl -X GET -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '' 'https://southcentralus.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/qnas/jobs/{JOB-ID}?api-version=2021-10-01' 
```

### Example response

```bash
  "createdDateTime": "2021-11-24T03:16:01+00:00",
  "expirationDateTime": "2021-11-24T09:16:01+00:00",
  "jobId": "{JOB-ID-GUID}",
  "lastUpdatedDateTime": "2021-11-24T03:16:06+00:00",
  "status": "succeeded",
  "resultUrl": "/knowledgebases/Sample-project"
```

## Update Synonyms

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to add synonyms.|

### Example query

```bash
curl -X PUT -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '{
"value": [
    {
      "alterations": [
        "qnamaker",
        "qna maker"
      ]
    },
    {
      "alterations": [
        "botframework",
        "bot framework"
      ]
    }
  ]
}' -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/synonyms?api-version=2021-10-01'
```

### Example response

```bash
0HTTP/2 200
content-length: 17
content-type: application/json; charset=utf-8
x-envoy-upstream-service-time: 39
apim-request-id: 5deb2692-dac8-43a8-82fe-36476e407ef6
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Wed, 24 Nov 2021 03:59:09 GMT

{
  "value": []
}
```

## Update active learning feedback

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the code sample below, you would only need to add the region specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project you would like to be the destination for the active learning feedback updates.|

### Example query

```bash
curl -X POST -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '{
records": [
    {
      "userId": "user1",
      "userQuestion": "hi",
      "qnaId": 1
    },
    {
      "userId": "user1",
      "userQuestion": "hello",
      "qnaId": 2
    }
  ]
}' -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/feedback?api-version=2021-10-01' 
```

### Example response

```bash
HTTP/2 204
x-envoy-upstream-service-time: 37
apim-request-id: 92225e03-e83f-4c7f-b35a-223b1b0f29dd
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
date: Wed, 24 Nov 2021 04:02:56 GMT
```
