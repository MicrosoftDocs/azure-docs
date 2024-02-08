---
title: Import an Azure OpenAI API from specification - Azure API Management
description: How to import an Azure OpenAI API from its OpenAPI specification.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 02/07/2024
ms.custom: template-how-to
---

# Import an Azure OpenAI API from OpenAPI specification


## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- Access granted to Azure OpenAI in the desired Azure subscription.
    You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue.

- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../ai-services/openai/how-to/create-resource.md).

    Make a note of the deployment ID. You'll need it when you test the imported API in API Management.

## Import OpenAI API from OpenAPI specification

### Download the OpenAPI specification

Download the OpenAPI specification for an endpoint supported by a model deployed in your service. For example, you can download the OpenAPI specification for the [chat completion endpoint](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2023-05-15/inference.json) of the GPT-35-Turbo and GPT-4 models.

1. Open the specification file that you downloaded in a text editor.
1. In the `servers` element in the specification, substitute the name of your Azure OpenAI resource endpoint for the placeholder values shows. For example:

```json
[...]
"servers": [
    {
      "url": "https://contoso.openai.azure.com/openai",
      "variables": {
        "endpoint": {
          "default": "contoso.openai.azure.com"
        }
      }
    }
  ],
[...]
```
1. Make a note of the value of the API `version`. You'll need it for testing the API.

## Add OpenAPI specification to API Management


1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select  
1. Click **Create**.



### Test your API

## Add OpenAI endpoint as HTTP API with custom backend

### Add HTTP API

1. In the Azure portal, navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **HTTP**. Enter a **Display name** and **Name** for the API. Leave the **Web service URL** blank for now.

### Add operations

1. In the **Design** tab, select **+ Add operation**.
1. Enter a URL `POST /openai/deployments/{deployment}/chat/completions` for the Completions API.

### Add custom backend

1. In the **Design** tab, select **All operations**, then select **Backend** and then edit **HTTP(s) endpoint** to set one backend. Enter the endpoint URL for the Azure OpenAI resource. For example, `https://contoso.openai.azure.com/` (without the trailing `/openai`). Select **Override**
1. Select **Save**.






[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Related content