---
title: Import an Azure AI Foundry API - Azure API Management
description: How to import an API from Azure AI Foundry as a REST API in Azure API Management.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/16/2025
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to, build-2024
---

# Import an Azure AI Foundry API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

You can import AI model endpoints deployed in Azure AI Foundry to your API Management instance as APIs. Use AI gateway policies and other capabilities in API Management to simplify integration, improve observability, and enhance control over the model endpoints.

Learn more about managing AI APIs in API Management:

* [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)


## Client compatibility options

API Management supports two client compatibility options for AI APIs. Choose the option suitable for your model deployment. The option determines how clients call the API and how the API Management instance routes requests to the AI service.

* **Azure AI** - Manage model endpoints in Azure AI Foundry that are exposed through the [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api).

    Clients call the deployment at a `/models` endpoint such as `/my-model/models/chat/completions`. Deployment name is passed in the request body. Use this option if you want flexibility to switch between models exposed through the Azure AI Model Inference API and those deployed in Azure OpenAI in Foundry Models.

* **Azure OpenAI** - Manage model endpoints deployed in Azure OpenAI. 

    Clients call the deployment at an `/openai` endpoint such as `/openai/deployments/my-deployment/chat/completions`. Deployment name is passed in the request path. Use this option if your AI service only includes Azure OpenAI model deployments. 

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An Azure AI service in your subscription with one or more models deployed. Examples include Azure OpenAI or other models deployed in Azure AI Foundry.

## Import AI Foundry API using the portal

Use the following steps to import an AI API to API Management. 

When you import the API, API Management automatically configures:

* Operations for each of the API's REST API endpoints
* A system-assigned identity with the necessary permissions to access the AI service deployment.
* A [backend](backends.md) resource and a [set-backend-service](set-backend-service-policy.md) policy that direct API requests to the AI service endpoint.
* Authentication to the backend using the instance's system-assigned managed identity.
* (optionally) Policies to help you monitor and manage the API.

To import an AI Foundry API to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Create from Azure resource**, select **Azure AI Foundry**.

    :::image type="content" source="media/azure-ai-foundry-api/ai-foundry-api.png" alt-text="Screenshot of creating an OpenAI-compatible API in the portal." :::
1. On the **Select AI service** tab:
    1. Select the **Subscription** in which to search for AI services. To get information about the model deployments in a service, select the **deployments** link next to the service name.
       :::image type="content" source="media/azure-ai-foundry-api/deployments.png" alt-text="Screenshot of deployments for an AI service in the portal.":::
    1. Select an AI service. 
    1. Select **Next**.
1. On the **Configure API** tab:
    1. Enter a **Display name** and optional **Description** for the API.
    1. In **Base path**, enter a path that your API Management instance uses to access the deployment endpoint.
    1. Optionally select one or more **Products** to associate with the API.  
    1. In **Client compatibility**, select either of the following based on the types of client you intend to support. See [Client compatibility options](#client-compatibility-options) for more information.
        * **Azure OpenAI** - Select this option if your clients only need to access Azure OpenAI model deployments.
        * **Azure AI** - Select this option if your clients need to access other models in Azure AI Foundry. 
    1. Select **Next**.

        :::image type="content" source="media/azure-ai-foundry-api/client-compatibility.png" alt-text="Screenshot of AI Foundry API configuration in the portal.":::

1. On the **Manage token consumption** tab, optionally enter settings or accept defaults that define the following policies to help monitor and manage the API:
    * [Manage token consumption](llm-token-limit-policy.md)
    * [Track token usage](llm-emit-token-metric-policy.md) 
1. On the **Apply semantic caching** tab, optionally enter settings or accept defaults that define the policies to help optimize performance and reduce latency for the API:
    * [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
1. On the **AI content safety**, optionally enter settings or accept defaults to configure the Azure AI Content Safety service to block prompts with unsafe content:
    * [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
1. Select **Review**.
1. After settings are validated, select **Create**. 

## Test the AI API

To ensure that your AI API is working as expected, test it in the API Management test console. 
1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation that's compatible with the model deployment.
    The page displays fields for parameters and headers.
1. Enter parameters and headers as needed. Depending on the operation, you might need to configure or update a **Request body**.
    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.
1. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data. Appended to the response is token usage data to help you monitor and manage your language model token consumption.


[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
