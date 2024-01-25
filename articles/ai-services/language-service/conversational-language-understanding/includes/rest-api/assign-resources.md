---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---


Assigning deployment resources programmatically requires Microsoft Entra authentication**. Microsoft Entra ID is used to confirm you have access to the resources you are interested in assigning to your project for multi-region deployment. To programmatically use Microsoft Entra authentication when making REST API calls, see the [Azure AI services authentication documentation](../../../../authentication.md?source=docs&tabs=powershell&tryIt=true#authenticate-with-azure-active-directory).

### Assign resource 

Submit a **POST** request using the following URL, headers, and JSON body to assign deployment resources.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/resources/:assign?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you're calling.  | `2022-10-01-preview` |

### Headers

Use [Microsoft Entra authentication](../../../../authentication.md#authenticate-with-azure-active-directory) to authenticate this API.

### Body

Use the following sample JSON as your body.

```json
{
  "resourcesMetadata": [
    {
      "azureResourceId": "{AZURE-RESOURCE-ID}",
      "customDomain": "{CUSTOM-DOMAIN}",
      "region": "{REGION-CODE}"
    }
  ]
}
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `azureResourceId` | `{AZURE-RESOURCE-ID}` | The full resource ID path you want to assign. Found in the Azure portal under the **Properties** tab for the resource, within the **Resource ID** field. | `/subscriptions/12345678-0000-0000-0000-0000abcd1234/resourceGroups/ContosoResourceGroup/providers/Microsoft.CognitiveServices/accounts/ContosoResource` |
| `customDomain` | `{CUSTOM-DOMAIN}` | The custom subdomain of the resource you want to assign. Found in the Azure portal under the **Keys and Endpoint** tab for the resource, part of the **Endpoint** field in the URL `https://<your-custom-subdomain>.cognitiveservices.azure.com/` | `contosoresource`  |
| `region` | `{REGION-CODE}` |  A region code specifying the region of the resource you want to assign. Found in the Azure portal under the **Keys and Endpoint** tab for the resource, as part of the **Location/Region** field. |`eastus`|

### Get assign resource status

Use the following **GET** request to get the status of your assign deployment resource job. Replace the placeholder values below with your own values. 

### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/resources/assign/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{JOB-ID}`     | The job ID for getting your assign deployment status. This is in the `operation-location` header value you received from the API in response to your assign deployment resource request.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |
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
