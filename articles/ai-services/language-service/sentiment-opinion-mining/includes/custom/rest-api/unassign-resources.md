---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 07/19/2023
ms.author: haelhamm
---


### Unassign resource

Submit a **POST** request using the following URL, headers, and JSON body to unassign or remove deployment resources from your project.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/resources/:unassign?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you're calling.  | `2022-10-01-preview` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Body

Use the following sample JSON as your body.

```json
{
  "assignedResourceIds": [
    "{AZURE-RESOURCE-ID}"
  ]
}
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `assignedResourceIds` | `{AZURE-RESOURCE-ID}` | The full resource ID path you want to unassign. Found in the Azure portal under the _Properties_ tab for the resource as the _Resource ID_ field. | `/subscriptions/d73a1925-0000-0000-0000-0000c5fe888e/resourceGroups/ContosoResourceGroup/providers/Microsoft.CognitiveServices/accounts/ContosoResource` |

### Get unassign resource status

Use the following **GET** request to get the status of your unassign deployment resources job. Replace the placeholder values below with your own values. 

### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/resources/unassign/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{JOB-ID}`     | The job ID for getting your assign deployment status. This is in the `operation-location` header value you received from the API in response to your unassign deployment resource request.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |
|`{API-VERSION}`     | The version of the API you're calling.  | `2022-10-01-preview` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Response Body

Once you send the request, you will get the following response. Keep polling this endpoint until the **status** parameter changes to "succeeded". 

```json
{
    "jobId":"{JOB-ID}",
    "createdDateTime":"{CREATED-TIME}",
    "lastUpdatedDateTime":"{UPDATED-TIME}",
    "expirationDateTime":"{EXPIRATION-TIME}",
    "status":"running"
}
```
