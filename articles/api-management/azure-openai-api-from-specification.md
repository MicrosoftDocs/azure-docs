---
title: Import an Azure OpenAI API as REST API - Azure API Management
description: How to import an Azure OpenAI API as a REST API from Azure OpenAI in Foundry Models or from an OpenAPI specification.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/16/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to, build-2024
---

# Import an Azure OpenAI API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

You can import AI model endpoints deployed in [Azure OpenAI in Foundry Models](/azure/ai-services/openai/overview) to your API Management instance as a REST API. Use AI gateway policies and other capabilities in API Management to simplify integration, improve observability, and enhance control over the model endpoints.


This article shows two options to import an Azure OpenAI API into an Azure API Management instance as a REST API:

- [Import an Azure OpenAI API directly from Azure OpenAI](#option-1-import-api-from-azure-openai) (recommended)
 
- [Download and add the OpenAPI specification](#option-2-add-an-openapi-specification-to-api-management) for Azure OpenAI and add it to API Management as an OpenAPI API.

Learn more about managing AI APIs in API Management:

* [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An Azure OpenAI resource with a model deployed. For more information about model deployment in Azure OpenAI, see the [resource deployment guide](/azure/ai-services/openai/how-to/create-resource).

    Make a note of the ID (name) of the deployment. You'll need it when you test the imported API in API Management.

    > [!NOTE]
    > API Management policies such as [azure-openai-token-limit](azure-openai-token-limit-policy.md) and [azure-openai-emit-token-metric](azure-openai-emit-token-metric-policy.md) are supported for certain API endpoints exposed through specific Azure OpenAI models. For more information, see [Supported Azure OpenAI models](azure-openai-token-limit-policy.md#supported-azure-openai-service-models).

- Permissions to grant access to the Azure OpenAI resource from the API Management instance.

## Option 1. Import API from Azure OpenAI 
 
You can import an Azure OpenAI API directly from Azure OpenAI to API Management. 

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

When you import the API, API Management automatically configures:

* Operations for each of the Azure OpenAI [REST API endpoints](/azure/ai-services/openai/reference)
* A system-assigned identity with the necessary permissions to access the Azure OpenAI resource.
* A [backend](backends.md) resource and a [set-backend-service](set-backend-service-policy.md) policy that direct API requests to the Azure OpenAI endpoint.
* Authentication to the Azure OpenAI backend using the instance's system-assigned managed identity.
* (optionally) Policies to help you monitor and manage the Azure OpenAI API.

To import an Azure OpenAI API to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Create from Azure resource**, select **Azure OpenAI**.

    :::image type="content" source="media/azure-openai-api-from-specification/azure-openai-api.png" alt-text="Screenshot of creating an API from Azure OpenAI in the portal." :::

1. On the **Basics** tab:
    1. Select the Azure OpenAI resource that you want to import.
    1. Optionally select an **Azure OpenAI API version**. If you don't select one, the latest production-ready REST API version is used by default. Make a note of the version you selected. You'll need it to test the API.
    1. Enter a **Display name** and optional **Description** for the API.
    1. In **Base URL**, append a path that your API Management instance uses to access the Azure OpenAI API endpoints. If you enable **Ensure OpenAI SDK compatibility** (recommended), `/openai` is automatically appended to the base URL.
    
        For example, if your API Management gateway endpoint is `https://contoso.azure-api.net`, set a **Base URL** similar to `https://contoso.azure-api.net/my-openai-api/openai`.
    1. Optionally select one or more products to associate with the API. Select **Next**.
1. On the **Policies** tab, optionally enable policies to help monitor and manage the API. You can also set or edit policies later.

    If selected, enter settings or accept defaults that define the following policies (see linked articles for prerequisites and configuration details):
    * [Manage token consumption](azure-openai-token-limit-policy.md)
    * [Track token usage](azure-openai-emit-token-metric-policy.md) 
    * [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
    * [Configure AI Content Safety](llm-content-safety-policy.md) for the API.
    
    Select **Review + Create**.
1. After settings are validated, select **Create**. 

## Option 2. Add an OpenAPI specification to API Management

Alternatively, manually download the OpenAPI specification for the Azure OpenAI REST API and add it to API Management as an OpenAPI API.

### Download the OpenAPI specification

Download the OpenAPI specification for the Azure OpenAI REST API, such as the [2024-10-21 GA version](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-10-21/inference.json).

1. In a text editor, open the specification file that you downloaded.
1. In the `servers` element in the specification, substitute the name of your Azure OpenAI endpoint in the placeholder values of `url` and `default` endpoint in the specification. For example, if your Azure OpenAI endpoint is `contoso.openai.azure.com`, update the `servers` element with the following values:

    * **url**: `https://contoso.openai.azure.com/openai`
    * **default** endpoint: `contoso.openai.azure.com`
  
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
1. Make a note of the value of the API `version` in the specification. You'll need it to test the API. Example: `2024-10-21`.

### Add OpenAPI specification to API Management

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **OpenAPI**. Enter a **Display name** and **Name** for the API.
1. Enter an **API URL suffix** ending in `/openai` to access the Azure OpenAI API endpoints in your API Management instance. Example: `my-openai-api/openai`.  
1. Select **Create**.

The API is imported and displays operations from the OpenAPI specification.

## Configure authentication to Azure OpenAI API

To authenticate to the Azure OpenAI API, you supply an API key or a managed identity. If you imported the Azure OpenAI API directly to your API Management instance, authentication using the API Management instance's managed identity is automatically configured. 

If you added the Azure OpenAI API from its OpenAPI specification, you need to configure authentication. For more information about configuring authentication using API Management policies, see [Authenticate and authorize to Azure OpenAI API](api-management-authenticate-authorize-azure-openai.md).

## Test the Azure OpenAI API

To ensure that your Azure OpenAI API is working as expected, test it in the API Management test console. You need to supply a model deployment ID (name) configured in the Azure OpenAI resource and the API version to test the API.

1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation that's compatible with the model you deployed in the Azure OpenAI resource. 
    The page displays fields for parameters and headers.
1. In **Template parameters**, enter the following values:
     * `deployment-id` - the ID of a deployment in Azure OpenAI   
     * `api-version` - a valid Azure OpenAI API version, such as the API version you selected when you imported the API.
      :::image type="content" source="media/azure-openai-api-from-specification/test-azure-openai-api.png" alt-text="Screenshot of testing an Azure OpenAI API in the portal." lightbox="media/azure-openai-api-from-specification/test-azure-openai-api.png" :::
1. Enter other parameters and headers as needed. Depending on the operation, you might need to configure or update a **Request body**.
    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.
1. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data. Appended to the response is token usage data to help you monitor and manage your Azure OpenAI API token consumption.

    :::image type="content" source="media/azure-openai-api-from-specification/api-response-usage.png" alt-text="Screenshot of token usage data in API response in the portal." :::

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
