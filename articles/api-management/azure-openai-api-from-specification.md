---
title: Import an Azure OpenAI API as REST API - Azure API Management
description: How to import an Azure OpenAI API as a REST API from the Azure OpenAI Service or from an OpenAPI specification.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/10/2024
ms.custom: template-how-to, build-2024
---

# Import an Azure OpenAI API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows two options to import an [Azure OpenAI Service](/azure/ai-services/openai/overview) API into an Azure API Management instance as a REST API:

- [Import an Azure OpenAI API directly from Azure OpenAI Service](#option-1-import-api-from-azure-openai-service)
- [Download and add the OpenAPI specification](#option-2-add-an-openapi-specification-to-api-management) for Azure OpenAI and add it to API Management as an OpenAPI API.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- Access granted to Azure OpenAI in the desired Azure subscription.
    You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../ai-services/openai/how-to/create-resource.md).

    Make a note of the ID (name) of the deployment. You'll need it when you test the imported API in API Management.
- Permissions to grant access to the Azure OpenAI resource from the API Management instance.

## Option 1. Import API from Azure OpenAI Service

You can import an Azure OpenAI API directly to API Management from the Azure OpenAI Service. When you import the API, API Management automatically configures:

* Operations for each of the Azure OpenAI [REST API endpoints](/azure/ai-services/openai/reference).
* A system-assigned identity with the necessary permissions to access the Azure OpenAI resource.
* A [backend](backends.md) resource and [set-backend-service](set-backend-service-policy.md) policy that direct API requests to the Azure OpenAI Service endpoint.
* An [authentication-managed-identity](authentication-managed-identity-policy.md) policy that can authenticate to the Azure OpenAI resource using the instance's system-assigned identity.
* (optionally) Policies to help you monitor and manage token consumption by the Azure OpenAI API.

To import an Azure OpenAI API to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Create from Azure resource**, select **Azure OpenAI Service**.

    :::image type="content" source="media/azure-openai-api-from-specification/azure-openai-api.png" alt-text="Screenshot of creating an API from Azure OpenAI Service in the portal." :::

1. On the **Basics** tab:
    1. Select the Azure OpenAI resource that you want to import.
    1. Optionally select an **Azure OpenAI API version**. If you don't select one, the latest production-ready REST API version is used by default.
    1. Enter a **Display name** and optional **Description** for the API.
    1. In **Base URL**, append a path that your API Management instance uses to access the Azure OpenAI API endpoints. If you enable **Ensure OpenAI SDK compatibility** (recommended), `/openai` is automatically appended to the base URL.
    
        For example, if your API Management gateway endpoint is `https://contoso.azure-api.net`, set a **Base URL** similar to `https://contoso.azure-api.net/my-openai-api/openai`.
    1. Optionally select one or more products to associate with the API. Select **Next**.
1. On the **Policies** tab, optionally enable policies to monitor and manage Azure OpenAI API token consumption. 
    If selected, enter settings or accept defaults that define the `azure-openai-token-limit` and `azure-openai-emit-token-metric` policies for your API. You can also set or update the policy configuration later. Select **Review + Create**.
1. After settings are validated, select **Create**. 

## Option 2. Add an OpenAPI specification to API Management

Alternatively, manually download the OpenAPI specification for the Azure OpenAI REST API and add it to API Management as an OpenAPI API.

### Download the OpenAPI specification

Download the OpenAPI specification for the Azure OpenAI REST API, such as the [2024-02-01 GA version](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json).

1. In a text editor, open the specification file that you downloaded.
1. In the `servers` element in the specification, substitute the name of your Azure OpenAI Service endpoint in the placeholder values of `url` and `default` endpoint in the specification. For example, if your Azure OpenAI Service endpoint is `contoso.openai.azure.com`, update the `servers` element with the following values:

    * url: `https://contoso.openai.azure.com/openai`
    * default endpoint: `contoso.openai.azure.com`
  
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
1. Under **Define a new API**, select **OpenAPI**. Enter a **Display name** and **Name** for the API.
1. Enter an **API URL suffix** ending in `/openai` to access the Azure OpenAI API endpoints in your API Management instance. Example: `my-openai-api/openai`.  
1. Select **Create**.

The API is imported and displays operations from the OpenAPI specification.

## Configure authentication to Azure OpenAI API

To authenticate to the Azure OpenAI API, you supply an API key or a managed identity. If you imported the Azure OpenAI API directly to your API Management instance, authentication using the API Management instance's managed identity is automatically configured. 

If you added the Azure OpenAI API from its OpenAPI specification, you need to configure authentication. For more information about configuring authentication using API Management policies, see [Authenticate and authorize to Azure OpenAI API](api-management-authenticate-authorize-azure-openai.md).

## Test the Azure OpenAI API

To ensure that your Azure OpenAI API is working as expected, test it in the API Management test console. You need to supply a model deployment ID (name) configured in the Azure OpenAI resource to test the API.

1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation that's compatible with the model you deployed in the Azure OpenAI resource. 
    The page displays fields for parameters and headers.
1. In **Template parameters**, enter the following values:
    * `deployment-id` - the ID of a deployment in the Azure OpenAI service 
    * `api-version` - a valid Azure OpenAI API version, such as the API version you selected when you imported the API.
      :::image type="content" source="media/azure-openai-api-from-specification/test-azure-openai-api.png" alt-text="Screenshot of testing an Azure OpenAI Service API in the portal." lightbox="media/azure-openai-api-from-specification/test-azure-openai-api.png" :::
1. Enter other parameters and headers as needed. Depending on the operation, you may need to configure or update a **Request body**.
    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.
1. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data. Appended to the response is token usage data to help you monitor and manage your Azure OpenAI API consumption.
    :::image type="content" source="media/azure-openai-api-from-specification/api-response-usage.png" alt-text="Screenshot of token usage data in API response in the portal." :::

## Caching policies for Azure OpenAI APIs

In addition to the `azure-openai-token-limit` and `azure-openai-emit-token-metric` policies that you can configure when importing an Azure OpenAI Service API, API Management provides the following caching policies to help you optimize performance and reduce latency for Azure OpenAI APIs: 

* `azure-openai-semantic-cache-store`
* `azure-openai-semantic-cache-lookup` 

## Related content

* [API Management policy reference](api-management-policies.md)
* [Azure OpenAI Service as a central capability with Azure API Management](/samples/azure/enterprise-azureai/enterprise-azureai/)
* [Azure API Management - Azure OpenAI sample](https://github.com/galiniliev/apim-azure-openai-sample)

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
