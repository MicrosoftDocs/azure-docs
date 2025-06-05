---
title: Azure API Management backends | Microsoft Docs
description: Learn about backends in Azure API Management. Backend entities encapsulate information about backend services, promoting reusability across APIs and governance.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 05/20/2025
ms.author: danlep
ms.custom:
  - build-2024
  - build-2025
---

# Backends in API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

A *backend* (or *API backend*) in API Management is an HTTP service that implements your front-end API and its operations.

When importing certain APIs, API Management configures the API backend automatically. For example, API Management configures the backend web service when importing:
* An [OpenAPI specification](import-api-from-oas.md).
* A [SOAP API](import-soap-api.md).
* Azure resources, such as an [Azure OpenAI API](azure-openai-api-from-specification.md), an HTTP-triggered [Azure Function App](import-function-app-as-api.md), or a [Logic App](import-logic-app-as-api.md).

API Management also supports using other Azure resources as an API backend, such as:
* A [Service Fabric cluster](how-to-configure-service-fabric-backend.yml).
* A custom service. 

## Benefits of backends

API Management supports backend entities so you can manage the backend services of your API. A backend entity encapsulates information about the backend service, promoting reusability across APIs and improved governance.

Use backends for one or more of the following:

* Authorize the credentials of requests to the backend service
* Take advantage of API Management functionality to maintain secrets in Azure Key Vault if [named values](api-management-howto-properties.md) are configured for header or query parameter authentication.
* Define circuit breaker rules to protect your backend from too many requests
* Route or load-balance requests to multiple backends

Configure and manage backend entities in the Azure portal, or using Azure APIs or tools.

## Create a backend

You can create a backend in the Azure portal, or using Azure APIs or tools.

To create a backend in the portal:

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **APIs** > **Backends** > **+ Create new backend**.
1. On the **Backend** page, do the following:
    1. Enter a **Name** for the backend and optional **Description**.
    1. Select a **Backend hosting type**, for example, **Azure resource** for an Azure resource such as a Function App or Logic App, **Custom URL** for a custom service, or a **Service Fabric** cluster. 
    1. In **Runtime URL**, enter the URL of the backend service that API requests are forwarded to.
    1. Under **Advanced**, optionally disable certificate chain or certificate name validation for the backend.
    1. Under **Add this backend service to a backend pool**, optionally select or create a [load-balanced pool](#load-balanced-pool) for the backend.
    1. Under **Circuit breaker rule**, optionally configure a [circuit breaker](#circuit-breaker) for the backend.
    1. Under **Authorization credentials**, optionally configure credentials to authorize access to the backend. Options include a request header, query parameter, [client certificate](api-management-howto-mutual-certificates-for-clients.md), or system-assigned or user-assigned [managed identity](#configure-managed-identity-for-authorization-credentials) configured in the API Management instance.
    1. Select **Create**.
    
After creating a backend, you can update the backend settings at any time. For example, add a circuit breaker rule, change the runtime URL, or add authorization credentials.

### Configure managed identity for authorization credentials

You can use a system-assigned or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md) configured in the API Management instance to authorize access to the backend service. To configure a managed identity for authorization credentials, do the following:

1. In the **Authorization credentials** section of the backend configuration, select the **Managed identity** tab, and select **Enable**.
1. In **Client identity**, select either **System assigned identity** or a user-assigned identity that is configured in your instance.
1. In **Resource ID**, enter a target Azure service or the application ID of your own Microsoft Entra application representing the backend. Example: `https://cognitiveservices.azure.com` for Azure OpenAI service. 

    For more examples, see the [authentication-managed-identity](authentication-managed-identity-policy.md) policy reference.
1. Select **Create**.

> [!NOTE]
> Also assign the managed identity the appropriate permissions or an RBAC role to access the backend service. For example, if the backend is an Azure OpenAI service, you might assign the managed identity the `Cognitive Services User` role.

## Reference backend using set-backend-service policy

After creating a backend, you can reference the backend identifier (name) in your APIs. Use the [`set-backend-service`](set-backend-service-policy.md) policy to direct an incoming API request to the backend. If you already configured a backend web service for an API, you can use the `set-backend-service` policy to redirect the request to a backend entity instead. For example:

```xml
<policies>
    <inbound>
        <base />
        <set-backend-service backend-id="myBackend" />
    </inbound>
    [...]
<policies/>
```
> [!NOTE]
> Alternatively, you can use `base-url`. Usually, the format is `https://backend.com/api`. Avoid adding a slash at the end to prevent misconfigurations. Typically, the `base-url` and HTTP(S) endpoint value in the backend should match to enable seamless integration between frontend and backend. Note that API Management instances append the backend service name to the `base-url`.

You can use conditional logic with the `set-backend-service` policy to change the effective backend based on location, gateway that was called, or other expressions.

For example, here is a policy to route traffic to another backend based on the gateway that was called:

```xml
<policies>
    <inbound>
        <base />
        <choose>
            <when condition="@(context.Deployment.Gateway.Id == "factory-gateway")">
                <set-backend-service backend-id="backend-on-prem" />
            </when>
            <when condition="@(context.Deployment.Gateway.IsManaged == false)">
                <set-backend-service backend-id="self-hosted-backend" />
            </when>
            <otherwise />
        </choose>
    </inbound>
    [...]
<policies/>
```


## Circuit breaker

API Management exposes a [circuit breaker](/rest/api/apimanagement/current-preview/backend/create-or-update?tabs=HTTP#backendcircuitbreaker) property in the backend resource to protect a backend service from being overwhelmed by too many requests.

* The circuit breaker property defines rules to trip the circuit breaker, such as the number or percentage of failure conditions during a defined time interval and a range of status codes that indicate failures. 
* When the circuit breaker trips, API Management stops sending requests to the backend service for a defined time, and returns a 503 Service Unavailable response to the client. 
* After the configured trip duration, the circuit resets and traffic resumes to the backend.

The backend circuit breaker is an implementation of the [circuit breaker pattern](/azure/architecture/patterns/circuit-breaker) to allow the backend to recover from overload situations. It augments general [rate-limiting](rate-limit-policy.md) and [concurrency-limiting](limit-concurrency-policy.md) policies that you can implement to protect the API Management gateway and your backend services.

> [!NOTE]
> * Currently, the backend circuit breaker isn't supported in the **Consumption** tier of API Management.
> * Because of the distributed nature of the API Management architecture, circuit breaker tripping rules are approximate. Different instances of the gateway do not synchronize and will apply circuit breaker rules based on the information on the same instance.
> * Currently, only one rule can be configured for a backend circuit breaker.

### Example

Use the Azure portal, API Management [REST API](/rest/api/apimanagement/backend), or a Bicep or ARM template to configure a circuit breaker in a backend. In the following example, the circuit breaker in *myBackend* in the API Management instance *myAPIM* trips when there are three or more `5xx` status codes indicating server errors in 1 hour. 

The circuit breaker in this example resets after 1 hour. If a `Retry-After` header is present in the response, the circuit breaker accepts the value and waits for the specified time before sending requests to the backend again.

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left menu, select **APIs** > **Backends** > your backend.
1. In the backend page, select **Settings** > **Circuit breaker settings** > **Add new**.
1. In the **Create new circuit breaker** page, configure the rule:
    * **Rule name**: Enter a name for the rule, such as *myBackend*.
    * **Failure count**: Enter *3*.
    * **Failure interval**: Leave the default value of **1 hour**.
    * **Failure status code range**: Select **500 - 599**.
    * **Trip duration**: Leave the default value of **1 hour**.
    * **Check 'Retry-After' header in HTTP response**: Select **True (Accept)**.

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep file for a backend resource with a circuit breaker:

```bicep
resource symbolicname 'Microsoft.ApiManagement/service/backends@2023-09-01-preview' = {
  name: 'myAPIM/myBackend'
  properties: {
    url: 'https://mybackend.com'
    protocol: 'http'
    circuitBreaker: {
      rules: [
        {
          failureCondition: {
            count: 3
            errorReasons: [
              'Server errors'
            ]
            interval: 'PT1H' 
            statusCodeRanges: [
              {
                min: 500
                max: 599
              }
            ]
          }
          name: 'myBreakerRule'
          tripDuration: 'PT1H'  
          acceptRetryAfter: true
        }
      ]
    }
   }
 }
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your ARM template for a backend resource with a circuit breaker:

```JSON
{
  "type": "Microsoft.ApiManagement/service/backends",
  "apiVersion": "2023-09-01-preview",
  "name": "myAPIM/myBackend",
  "properties": {
    "url": "https://mybackend.com",
    "protocol": "http",
    "circuitBreaker": {
      "rules": [
        {
          "failureCondition": {
            "count": "3",
            "errorReasons": [ "Server errors" ],
            "interval": "PT1H",
            "statusCodeRanges": [
              {
                "min": "500",
                "max": "599"
              }
            ]
          },
          "name": "myBreakerRule",
          "tripDuration": "PT1H",
          "acceptRetryAfter": true
        }
      ]
    }
  }
}
```

---

## Load-balanced pool

API Management supports backend *pools*, when you want to implement multiple backends for an API and load-balance requests across those backends. A pool is a collection of backends that are treated as a single entity for load balancing.

Use a backend pool for scenarios such as the following:

* Spread the load to multiple backends, which may have individual backend circuit breakers.
* Shift the load from one set of backends to another for upgrade (blue-green deployment).


> [!NOTE]
> * You can include up to 30 backends in a pool. 
> * Because of the distributed nature of the API Management architecture, backend load balancing is approximate. Different instances of the gateway do not synchronize and will load balance based on the information on the same instance.


### Load balancing options

API Management supports the following load balancing options for backend pools:

| Load balancing option      | Description |
|------------------|-------------|
| **Round-robin**  | Requests are distributed evenly across the backends in the pool by default. |
| **Weighted**     | Weights are assigned to the backends in the pool, and requests are distributed based on the relative weight of each backend. Useful for scenarios such as blue-green deployments. |
| **Priority-based** | Backends are organized into priority groups. Requests are sent to higher priority groups first; within a group, requests are distributed evenly or according to assigned weights. |    

> [!NOTE]
> Backends in lower priority groups will only be used when all backends in higher priority groups are unavailable because circuit breaker rules are tripped.

### Session awareness

With any of the preceding load balancing options, optionally enable **session awareness** (session affinity) to ensure that all requests from a specific user during a session are directed to the same backend in the pool. API Management sets a session ID cookie to maintain session state. This option is useful, for example, in scenarios with backends such as AI chat assistants or other conversational agents to route requests from the same session to the same endpoint.

> [!NOTE]
> Session awareness in load-balanced pools is being released first to the **AI Gateway Early** [update group](configure-service-update-settings.md).

#### Manage cookies for session awareness

When using session awareness, the client must handle cookies appropriately. The client needs to store the `Set-Cookie` header value and send it with subsequent requests to maintain session state.

You can use API Management policies to help set cookies for session awareness. For example, for the case of the Assistants API (a feature of [Azure OpenAI in Azure AI Foundry Models](/azure/ai-services/openai/concepts/models)), the client needs to keep the session ID, extract the thread ID from the body, and keep the pair and send the right cookie for each call. Moreover, the client needs to know when to send a cookie or when not to send a cookie header. These requirements can be handled appropriately by defining the following example policies:


```xml
<policies>
  <inbound>
    <base />
    <set-backend-service backend-id="APIMBackend" />
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
    <set-variable name="gwSetCookie" value="@{
      var payload = context.Response.Body.As<JObject>();
      var threadId = payload["id"];
      var gwSetCookieHeaderValue = context.Request.Headers.GetValueOrDefault("SetCookie", string.Empty);
      if(!string.IsNullOrEmpty(gwSetCookieHeaderValue))
      {
        gwSetCookieHeaderValue = gwSetCookieHeaderValue + $";Path=/threads/{threadId};";
      }
      return gwSetCookieHeaderValue;
    }" />
    <set-header name="Set-Cookie" exists-action="override">
      <value>Cookie=gwSetCookieHeaderValue</value>
    </set-header>
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>
```

### Example

Use the portal, API Management [REST API](/rest/api/apimanagement/backend), or a Bicep or ARM template to configure a backend pool. In the following example, the backend *myBackendPool* in the API Management instance *myAPIM* is configured with a backend pool. Example backends in the pool are named *backend-1* and *backend-2*. Both backends are in the highest priority group; within the group, *backend-1* has a greater weight than *backend-2*.


#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left menu, select **APIs** > **Backends** > your backend.
1. In the **Backends** page, select the **Load balancer** tab.
1. Select **+ Create new pool**.
1. In the **Create new load-balanced pool** page, do the following:
    * **Name**: Enter a name for the pool such as *myBackendPool*.
    * **Description**: Optionally enter a description.
    * **Add backends to pool**: Select one or more backends to add to the pool.
    * **Backend weight and priority**: Select **Customize weight and priority** to configure the weight and priority of each backend in the pool. For example, if you added two backends named *backend-1* and *backend-2*, set the weight of *backend-1* to 3 and the weight of *backend-2* to 1, and set the priority of both backends to 1.
    * Select **Create**.

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep file for a load-balanced pool. Set the `type` property of the backend entity to `Pool` and specify the backends in the pool.

This example includes an optional `sessionAffinity` pool configuration for session awareness. It sets a cookie so that requests from a user session are routed to a specific backend in the pool. 

```bicep
resource symbolicname 'Microsoft.ApiManagement/service/backends@2023-09-01-preview' = {
  name: 'myAPIM/myBackendPool'
  properties: {
    description: 'Load balancer for multiple backends'
    type: 'Pool'
    pool: {
      services: [
        {
          id: '/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ApiManagement/service/<APIManagementName>/backends/backend-1'
          priority: 1
          weight: 3
        }
        {
          id: '/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ApiManagement/service/<APIManagementName>/backends/backend-2'
          priority: 1
          weight: 1
        }
      ],
      "sessionAffinity": { 
        "sessionId": { 
          "source": "Cookie", 
          "name": "SessionId" 
        } 
      } 
    }
  }
}
```
#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your ARM template for a load-balanced pool. Set the `type` property of the backend resource to `Pool` and specify the backends in the pool.

This example includes an optional `sessionAffinity` pool configuration for session awareness. It sets a cookie so that requests from a user session are routed to a specific backend in the pool. 


```json
{
  "type": "Microsoft.ApiManagement/service/backends",
  "apiVersion": "2023-09-01-preview",
  "name": "myAPIM/myBackendPool",
  "properties": {
    "description": "Load balancer for multiple backends",
    "type": "Pool",
    "pool": {
      "services": [
        {
          "id": "/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ApiManagement/service/<APIManagementName>/backends/backend-1",
          "priority": "1", 
          "weight": "3" 
        },
        {
          "id": "/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ApiManagement/service/<APIManagementName>/backends/backend-2",
          "priority": "1",
          "weight": "1"    
        }
      ],
        "sessionAffinity": { 
        "sessionId": { 
          "source": "Cookie", 
          "name": "SessionId" 
        } 
      } 
    }
  }
}
```

---


## Limitations

- For **Developer** and **Premium** tiers, an API Management instance deployed in an [internal virtual network](api-management-using-with-internal-vnet.md) can throw HTTP 500 `BackendConnectionFailure` errors when the gateway endpoint URL and backend URL are the same. If you encounter this limitation, follow the instructions in the [Self-Chained API Management request limitation in internal virtual network mode](https://techcommunity.microsoft.com/t5/azure-paas-blog/self-chained-apim-request-limitation-in-internal-virtual-network/ba-p/1940417) article in the Tech Community blog.
- Currently, only one rule can be configured for a backend circuit breaker.  

## Related content

* Blog: [Using Azure API Management circuit breaker and load balancing with Azure OpenAI Service](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/using-azure-api-management-circuit-breaker-and-load-balancing/ba-p/4041003)
* Set up a [Service Fabric backend](how-to-configure-service-fabric-backend.yml) using the Azure portal.
* Quickstart [Create a Backend Pool in Azure API Management using Bicep for load balance OpenAI requests](https://github.com/Azure-Samples/apim-lbpool-openai-quickstart)
* See [Azure API Management as an Event Grid source](/azure/event-grid/event-schema-api-management) for information about Event Grid events that are generated by the gateway when a circuit breaker is tripped or reset. Use these events to take action before backend issues escalate. 
