---
title: Import a Microsoft Foundry API - Azure API Management
description: How to import an API from Microsoft Foundry as a REST API in Azure API Management.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 03/30/2026
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to, build-2024
---

# Import a Microsoft Foundry API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

You can import AI model endpoints deployed in Microsoft Foundry to your API Management instance as APIs. Use AI gateway policies and other capabilities in API Management to simplify integration, improve observability, and enhance control over the model endpoints.

To learn more about managing AI APIs in API Management, see:

* [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)

## Client compatibility options

API Management supports the following client compatibility options for AI APIs from Microsoft Foundry. When you import the API by using the wizard, choose the option suitable for your model deployment. The option determines how clients call the API and how the API Management instance routes requests to the Foundry tool.

* **Azure OpenAI**: Manage Azure OpenAI in Microsoft Foundry model deployments.

    Clients call the deployment at an `/openai` endpoint such as `/openai/deployments/my-deployment/chat/completions`. The request path includes the deployment name. Use this option if your Foundry tool only includes Azure OpenAI model deployments. 

* **Azure AI**: Manage model endpoints in Microsoft Foundry that are exposed through the [Azure AI Model Inference API](/rest/api/aifoundry/modelinference/).

    Clients call the deployment at a `/models` endpoint such as `/my-model/models/chat/completions`. The request body includes the deployment name. Use this option if you want flexibility to switch between models exposed through the Azure AI Model Inference API and those deployed in Azure OpenAI in Foundry Models.

* **Azure OpenAI v1** - Manage Azure OpenAI in Microsoft Foundry model deployments, using the [Azure OpenAI API version 1 API](/azure/foundry/openai/api-version-lifecycle). 

    Clients call the deployment at an Azure OpenAI v1 model endpoint such as `openai/v1/my-model/chat/completions`. The request body includes the deployment name. 

## Prerequisites

* An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).

* A Foundry tool in your subscription with one or more models deployed. Examples include models deployed in Microsoft Foundry or Azure OpenAI.

- If you want to enable semantic caching for the API, see [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md) for prerequisites.

- If you want to enforce content safety checks on the API, see [Enforce content safety checks on LLM requests](llm-content-safety-policy.md) for prerequisites.

## Import Microsoft Foundry API by using the portal

Use the following steps to import an AI API to API Management.

When you import the API, API Management automatically configures:

* Operations for each of the API's REST API endpoints.
* A system-assigned identity with the necessary permissions to access the Foundry tool deployment.
* A [backend](backends.md) resource and a [set-backend-service](set-backend-service-policy.md) policy that direct API requests to the Azure AI Services endpoint.
* Authentication to the backend by using the instance's system-assigned managed identity.
* (optionally) Policies to help you monitor and manage the API.

To import a Microsoft Foundry API to API Management:

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Create from Azure resource**, select **Microsoft Foundry**.

    :::image type="content" source="media/azure-ai-foundry-api/ai-foundry-api.png" alt-text="Screenshot of creating an OpenAI-compatible API in the portal." :::
1. On the **Select AI Service** tab:
    1. Select the **Subscription** in which to search for Foundry Tools. To get information about the model deployments in a service, select the **deployments** link next to the service name.
       :::image type="content" source="media/azure-ai-foundry-api/deployments.png" alt-text="Screenshot of deployments for an AI service in the portal." lightbox="media/azure-ai-foundry-api/deployments.png":::
    1. Select a Foundry tool. 
    1. Select **Next**.
1. On the **Configure API** tab:
    1. Enter a **Display name** and optional **Description** for the API.
    1. In **Base path**, enter a path that your API Management instance uses to access the deployment endpoint.
    1. Optionally select one or more **Products** to associate with the API.  
    1. In **Client compatibility**, select one of the following options based on the types of client you intend to support. See [Client compatibility options](#client-compatibility-options) for more information.
        * **Azure OpenAI** - Select this option if your clients only need to access Azure OpenAI in Microsoft Foundry model deployments.
        * **Azure AI** - Select this option if your clients need to access other models in Microsoft Foundry.
        * **Azure OpenAI v1** - Select this option if you want to use the Azure OpenAI API version 1 with your Foundry model deployments. 
    1. Select **Next**.

        :::image type="content" source="media/azure-ai-foundry-api/client-compatibility.png" alt-text="Screenshot of Microsoft Foundry API configuration in the portal.":::

1. On the **Manage token consumption** tab, optionally enter settings, or accept defaults that define the following policies to help monitor and manage the API:
    * [Manage token consumption](llm-token-limit-policy.md)
    * [Track token usage](llm-emit-token-metric-policy.md)
1. On the **Apply semantic caching** tab, optionally enter settings, or accept defaults that define the policies to help optimize performance and reduce latency for the API:
    * [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
1. On the **AI content safety** tab, optionally enter settings or accept defaults to configure the Azure AI Content Safety service to block prompts with unsafe content:
    * [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
1. Select **Review**.
1. After the portal validates the settings, select **Create**. 

## Test the AI API

To make sure your AI API works as expected, test it in the API Management test console. 
1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation that's compatible with the model deployment.
    The page displays fields for parameters and headers.
1. Enter parameters and headers as needed. Depending on the operation, you might need to configure or update a **Request body**. Here's a basic example request body for a chat completions operation:

    ```json
    {
      "model": "any",
      "messages": [
        {
          "role": "user",
          "content": "Help me plan a trip to Paris",
          "max_tokens": 100
        }
      ]
    }
    ```

    > [!NOTE]
    > In the test console, API Management automatically adds an **Ocp-Apim-Subscription-Key** header and sets the subscription key for the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key provides access to every API in the API Management instance. To optionally display the **Ocp-Apim-Subscription-Key** header, select the "eye" icon next to the **HTTP Request**.
1. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data. The response includes token usage data to help you monitor and manage your language model token consumption.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
