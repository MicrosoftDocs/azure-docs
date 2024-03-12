---
title: Import an Azure OpenAI API as REST API - Azure API Management
description: How to import an Azure OpenAI API as a REST API from its OpenAPI specification.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 02/22/2024
ms.custom: template-how-to
---

# Import an Azure OpenAI API as a REST API

This article shows how to import an [Azure OpenAI](/azure/ai-services/openai/overview) API into an Azure API Management instance from its OpenAPI specification. After importing the API as a REST API, you can manage and secure it, and publish it to developers.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- Access granted to Azure OpenAI in the desired Azure subscription.
    You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../ai-services/openai/how-to/create-resource.md).

    Make a note of the deployment ID (name). You'll need it when you test the imported API in API Management.

## Download the OpenAPI specification

Download the OpenAPI specification for an endpoint that your model supports. For example, download the OpenAPI specification for the [chat completion endpoint](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2023-05-15/inference.json) of the GPT-35-Turbo and GPT-4 models.

1. In a text editor, open the specification file that you downloaded.
1. In the `servers` element in the specification, substitute the name of your Azure OpenAI resource endpoint for the placeholder values in the specification. The following example `servers` element is updated with the `contoso.openai.azure.com` resource endpoint.
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
1. Make a note of the value of the API `version` in the specification. You'll need it to test the API. Example: `2023-05-15`.

## Add OpenAPI specification to API Management


1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **OpenAPI**. Enter a **Display name** and **Name** for the API and enter an **API URL suffix**.  
1. Select **Create**.

The API is imported and displays operations from the OpenAPI specification.

[!INCLUDE [api-management-test-api-portal](../../includes/api-management-test-api-portal.md)]

> [!IMPORTANT]
> Authentication to the OpenAI API requires an API key or a managed identity. To configure authentication using API Management policies, see [Authenticate and authorize to Azure OpenAI API](api-management-authenticate-authorize-azure-openai.md).

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Related content

* [Azure OpenAI Service as a central capability with Azure API Management](/samples/azure/enterprise-azureai/enterprise-azureai/)
* [Azure API Management - Azure OpenAI sample](https://github.com/galiniliev/apim-azure-openai-sample)
