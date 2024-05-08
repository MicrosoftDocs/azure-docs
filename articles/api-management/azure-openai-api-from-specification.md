---
title: Import an Azure OpenAI API as REST API - Azure API Management
description: How to import an Azure OpenAI API as a REST API from its OpenAPI specification.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/07/2024
ms.custom: template-how-to
---

# Import an Azure OpenAI API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows two options to import an [Azure OpenAI Service](/azure/ai-services/openai/overview) API into an Azure API Management instance as a REST API:

- [Import an Azure OpenAI API directly to API Management](#option-1-import-the-azure-openai-api-directly-to-api-management)
- [Download and add the OpenAPI specification](#option-2-add-an-openapi-specification-to-api-management) for an Azure OpenAI endpoint and add it to API Management as an OpenAPI API.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- Access granted to Azure OpenAI in the desired Azure subscription.
    You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../ai-services/openai/how-to/create-resource.md).

    Make a note of the deployment ID (name). You'll need it when you test the imported API in API Management.

## Option 1. Import the Azure OpenAI API directly to API Management

You can import an Azure OpenAI API directly to API Management from the Azure OpenAI resource that contains the model you want to import. When you import the API, API Management automatically configures:

* operations for each of the API endpoints
* a system-assigned identity with the necessary permissions to access the Azure OpenAI resource
* an [authentication-managed-identity](authentication-managed-identity-policy.md) policy that authenticates to the Azure OpenAI resource using the instance's system-assigned identity
* (optionally) a token limit policy to limit the usage of the Azure OpenAI API

To import an Azure OpenAI API directly to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Create from Azure resource**, select **Azure OpenAI service**.
    :::image type="content" source="media/azure-openai-api-from-specification/azure-openai-api.png" alt-text="Screenshot of creating an API from Azure OpenAI Service in the portal." :::
1. On the **Basics** tab:
    1. Select the Azure OpenAI resource that contains the model you want to import.
    1. Optionally select an **Azure OpenAI API version**. If you don't select one, the latest production-ready API version is used by default.
    1. Enter a **Display name** and optional **Description** for the API.
    1. In **Base URL**, append a path ending with `/openai` that will be used to access the Azure OpenAI API endpoints in your API Management instance. 
    
      For example, if your API Management gateway endpoint is `https://contoso.azure-api.net`, set a **Base URL** similar to `https://contoso.azure-api.net/my/path/openai`.
    1. Optionally select one or more products to associate with the API. Select **Next**
1. On the **Policies** tab, optionally select **Manage token consumption**. 

    If selected, enter settings that define the `azure-openai-token-limit` policy. Select **Review + Create**.
1. After settings are validated, select **Create**. 


## Option 2. Add an OpenAPI specification to API Management

Alternatively, manually download the OpenAPI specification for an Azure OpenAI endpoint that your model supports and add it to API Management as an OpenAPI API.

### Download the OpenAPI specification

Download the OpenAPI specification for an endpoint that your model supports. For example, download the OpenAPI specification for the [chat completion endpoint](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json) of the GPT-35-Turbo and GPT-4 models.

1. In a text editor, open the specification file that you downloaded.
1. In the `servers` element in the specification, substitute the name of your Azure OpenAI resource endpoint in the placeholder values of `url` and `default` in the specification. For example, if your Azure OpenAI resource endpoint is `contoso.openai.azure.com`, update the `servers` element with the following values:
  
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
1. Make a note of the value of the API `version` in the specification. You'll need it to test the API. Example: `2024-02-01`.

### Add OpenAPI specification to API Management

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **OpenAPI**. Enter a **Display name** and **Name** for the API and enter an **API URL suffix**.  
1. Select **Create**.

The API is imported and displays operations from the OpenAPI specification.

[!INCLUDE [api-management-test-api-portal](../../includes/api-management-test-api-portal.md)]

> [!IMPORTANT]
> Authentication to the OpenAI API requires an API key or a managed identity. If you imported the Azure OpenAI API directly to your API Management instance, authentication using a managed identity is automatically configured. For more information about configuring authentication using API Management policies, see [Authenticate and authorize to Azure OpenAI API](api-management-authenticate-authorize-azure-openai.md).

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Related content

* [API Management policy reference](api-management-policies.md)
* [Azure OpenAI Service as a central capability with Azure API Management](/samples/azure/enterprise-azureai/enterprise-azureai/)
* [Azure API Management - Azure OpenAI sample](https://github.com/galiniliev/apim-azure-openai-sample)
