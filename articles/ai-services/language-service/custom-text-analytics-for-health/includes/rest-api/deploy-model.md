---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

Submit a **PUT** request using the following URL, headers, and JSON body to submit a deployment job. Replace the placeholder values below with your own values. 

```rest
{Endpoint}/language/authoring/analyze-text/projects/{projectName}/deployments/{deploymentName}?api-version={API-VERSION}
```

| Placeholder |Value | Example |
|---------|---------|---------|
| `{ENDPOINT}` | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{PROJECT-NAME}` | The name of your project. This value is case-sensitive.   | `myProject` |
| `{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `staging` |
|`{API-VERSION}`     | The version of the API you're calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

#### Request body

Use the following JSON in the body of your request. Use the name of the model you to assign to the deployment.  

```json
{
  "trainedModelLabel": "{MODEL-NAME}"
}
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|-----|----|
| trainedModelLabel | `{MODEL-NAME}` | The model name that will be assigned to your deployment. You can only assign successfully trained models. This value is case-sensitive.   | `myModel` |

Once you send your API request, you’ll receive a `202` response indicating that the job was submitted correctly. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`{JOB-ID}` is used to identify your request, since this operation is asynchronous. You can use this URL to get the deployment status.
