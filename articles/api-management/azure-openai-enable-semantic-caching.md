---
title: Enable semantic caching for Azure OpenAI APIs in Azure API Management
description: Prerequisites and configuration steps to enable semantic caching for Azure OpenAI APIs in Azure API Management.
author: dlepow
ms.service: api-management
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 05/13/2024
ms.author: danlep
---

# Enable semantic caching for Azure OpenAI APIs in Azure API Management

Enable semantic caching of responses to Azure OpenAI API requests to reduce bandwidth and processing requirements imposed on the backend APIs and lower latency perceived by API consumers. With semantic caching, you can return cached responses for identical prompts and also for prompts that are similar in meaning, even if the text isn't the same. For background, see [Tutorial: Use Azure Cache for Redis as a semantic cache](../azure-cache-for-redis/cache-tutorial-semantic-cache.md).

## Prerequisites

* One or more Azure OpenAI Service APIs must be added to your API Management instance. For more information, see [Add an Azure OpenAI Service API to Azure API Management](azure-openai-api-from-specification.md).
* The Azure OpenAI service must have deployments for the following:
    * Chat Completion API (or Completion API) - Deployment used for API consumer calls 
    * Embeddings API - Deployment used for semantic caching
* The API Management instance must be configured to use managed identity authentication to the Azure OpenAI APIs. For more information, see [Authenticate and authorize access to Azure OpenAI APIs using Azure API Management ](api-management-authenticate-authorize-azure-openai.md#authenticate-with-managed-identity).
* [Azure Cache for Redis Enterprise](../azure-cache-for-redis/quickstart-create-redis-enterprise.md). The **RediSearch** module must be enabled on the Redis Enterprise cache.
    > [!NOTE]
    > You can only enable the **RediSearch** module when creating a new Redis Enterprise cache. You can't add a module to an existing cache. [Learn more](../azure-cache-for-redis/cache-redis-modules.md)
* External cache configured in the Azure API Management instance. For steps, see [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md).


## Test Chat API deployment

First, test the Azure OpenAI deployment to ensure that the Chat Completion API or Chat API is working as expected. For steps, see [Import an Azure OpenAI API to Azure API Management](azure-openai-api-from-specification.md#test-the-azure-openai-api).

For example, test the Azure OpenAI Chat API by sending a POST request to the API endpoint with a prompt in the request body. The response should include the completion of the prompt. Example request:

```rest
POST https://my-api-management.azure-api.net/my-api/openai/deployments/chat-deployment/chat/completions?api-version=2024-02-01
```

with request body:

```json
{"messages":[{"role":"user","content":"Hello"}]}
```

When the request succeeds, the response includes a completion for the chat message.

## Create a backend for Embeddings API

Configure a [backend](backends.md) resource for the Embeddings API deployment with the following settings:

* **Name** - A name of your choice, such as `embeddings-backend`. You use this name to reference the backend in policies.
* **Type** - Select **Custom URL**.
* **Runtime URL** - The URL of the Embeddings API deployment in the Azure OpenAI Service, similar to:
        ```
        https://my-aoai.openai.azure.com/openai/deployments/embeddings-deployment/embeddings
        ```
### Test backend 

To test the backend, create an API operation for your Azure OpenAI Service API:

1. On the **Design** tab of your API, select **+ Add operation**.
1. Enter a **Display name** and optionally a **Name** for the operation.
1. In the **Frontend** section, in **URL**, select **POST** and enter the path `/`.
1. On the **Headers** tab, add a required header with the name `Content-Type` and value `application/json`.
1. Select **Save**

Configure the following policies in the **Inbound processing** section of the API operation. In the [set-backend-service](set-backend-service-policy.md) policy, substitute the name of the backend you created.

```xml
<policies>
    <inbound>
        <set-backend-service backend-id="embeddings-backend" />
        <authentication-managed-identity resource="https://cognitiveservices.azure.com/" />
        [...]
    </inbound>
    [...]
</policies>
```
 
On the **Test** tab, test the operation by adding an `api-version` query parameter with value such as `2024-02-01`. Provide a valid request body. For example:

```json
{"input":"Hello"}
```        

If the request is successful, the response includes a vector representation of the input text:

```json
{
    "object": "list",
    "data": [{
        "object": "embedding",
        "index": 0,
        "embedding": [
            -0.021829502,
            -0.007157768,
            -0.028619017,
            [...]
        ]
    }]
}

```

## Configure semantic caching policies

Configure the following policies to enable semantic caching for Azure OpenAI APIs in Azure API Management:
* In the **Inbound processing** section for the API, add the [azure-openai-semantic-cache-lookup](azure-openai-semantic-cache-lookup-policy.md) policy. In the `embeddings-backend-id` attribute, specify the Embeddings API backend you created.

    Example:

    ```xml
    <azure-openai-semantic-cache-lookup
        score-threshold="0.8"
        embeddings-backend-id="embeddings-deployment"
        embeddings-backend-auth="system-assigned"
        ignore-system-messages="true"
        max-message-count="10">
        <vary-by>@(context.Subscription.Id)</vary-by>
    </azure-openai-semantic-cache-lookup>
    
* In the **Outbound processing** section for the API, add the [azure-openai-semantic-cache-store](azure-openai-semantic-cache-store-policy.md) policy.

    Example:

    ```xml
    <azure-openai-semantic-cache-store duration="60" />
    ```

## Confirm caching

To confirm that semantic caching is working as expected, trace a test Completion or Chat Completion operation using the test console in the portal. Confirm that the cache was used on subsequent tries by inspecting the trace. [Learn more about tracing API calls in Azure API Management](api-management-howto-api-inspector.md).

For example, if the cache was used, the **Output** section includes entries similar to ones in the following screenshot:

:::image type="content" source="media/azure-openai-enable-semantic-caching/cache-lookup.png" alt-text="Screenshot of request trace in the Azure portal.":::

## Related content

* [Caching policies](api-management-policies.md#caching)
* [Azure Cache for Redis](../azure-cache-for-redis/cache-overview.md)
