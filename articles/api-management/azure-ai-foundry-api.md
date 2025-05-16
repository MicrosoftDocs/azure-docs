---
title: Import an Azure AI Foundry API - Azure API Management
description: How to import an API from Azure AI Foundry as a REST API in Azure API Management.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/15/2025
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to, build-2024
---

# Import an LLM API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

[INTRO]

Learn more about managing AI APIs in API Management:

* [Generative AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)


## AI service options
* **Azure OpenAI service** - Deployment name of a model is passed in the URL path of the API request.

* **Azure AI** - These are models that are available in Azure AI Foundry through the [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api). Deployment name of a model is passed in the request body of the API request. 


## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- One or more Azure AI services with models deployed, such as:
    - An Azure OpenAI resource. For information about model deployment in Azure OpenAI service, see the [resource deployment guide](/azure/ai-services/openai/how-to/create-resource).
    -  An Azure AI Foundry project. For information about creating a project, see [Create a project in the Azure AI Foundry portal](/azure/ai-foundry/how-to/create-projects). 
    


## Import AI Foundry API using the portal

Use the following steps to import an AI Foundry API directly to API Management. 

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

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
    1. Select the **Subscription** in which to search for AI services (Azure OpenAI services or Azure AI Foundry projects). To get information about the deployments in a service, select the **deployments** link next to the service name.
       :::image type="content" source="media/azure-ai-foundry-api/deployments.png" alt-text="Screenshot of deployments for an AI service in the portal.":::
    1. Select an AI service. 
    1. Select **Next**.
1. On the **Configure API** tab:
    1. Enter a **Display name** and optional **Description** for the API.
    1. In **Path**, enter a path that your API Management instance uses to access the API endpoints.
    1. Optionally select one or more **Products** to associate with the API.  
    1. In **Client compatibility**, select either of the following based on the types of client you intend to support:
        * **Azure OpenAI** - Clients call the model deployment using the OpenAI API format. Select this option if you use only Azure OpenAI deployments.
        * **Azure AI** - Clients call the model deployment by passing 
    1. In **Access key**, optionally enter the authorization header name and API key used to access the LLM API. 
    1. Select **Next**.
1. On the **Manage token consumption** tab, optionally enter settings or accept defaults that define the following policies to help monitor and manage the API:
    * [Manage token consumption](llm-token-limit-policy.md)
    * [Track token usage](llm-emit-token-metric-policy.md) 
1. On the **Apply semantic caching** tab, optionally enter settings or accept defaults that define the policies to help optimize performance and reduce latency for the API:
    * [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
On the **AI content safety**, optionally enter settings or accept defaults to configure the Azure AI Content Safety service checks for API requests:
    * [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
1. Select **Review**.
1. After settings are validated, select **Create**. 

## Test the LLM API

To ensure that your LLM API is working as expected, test it in the API Management test console. 
1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation that's compatible with the model in the LLM API.
    The page displays fields for parameters and headers.
1. Enter parameters and headers as needed. Depending on the operation, you may need to configure or update a **Request body**.
    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.
1. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data. Appended to the response is token usage data to help you monitor and manage your Azure OpenAI API token consumption.


[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
