---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

### Load model data 

Create a **POST** request using the following URL, headers, and JSON body to load your model data to your project.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/models/{MODEL-NAME}:load-snapshot?stringIndexType=Utf16CodeUnit&api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `EmailApp` |
|`{API-VERSION}`     | The version of the API you are calling. | `2022-10-01-preview` |
|`{MODEL-NAME}`       | The name of your model. This value is case-sensitive. | `v1` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `operation-location` value. It is formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/models/{MODEL-NAME}/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. Use this URL to get the status of your model data loading, using the same authentication method.


### Export model data

Create a **POST** request using the following URL, headers, and JSON body to export your model data.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/:export?stringIndexType=Utf16CodeUnit&api-version={API-VERSION}&trainedModelLabel={MODEL-NAME}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `EmailApp` |
|`{API-VERSION}`     | The version of the API you are calling. | `2022-10-01-preview` |
|`{MODEL-NAME}`       | The name of your model. This value is case-sensitive. | `v1` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `operation-location` value. It is formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. Use this URL to get the exported project JSON, using the same authentication method.
