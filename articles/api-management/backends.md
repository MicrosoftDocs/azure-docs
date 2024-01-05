---
title: Azure API Management backends | Microsoft Docs
description: Learn about custom backends in Azure API Management
services: api-management
documentationcenter: ''
author: dlepow
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 01/05/2024
ms.author: danlep 
ms.custom:
---

# Backends in API Management

A *backend* (or *API backend*) in API Management is an HTTP service that implements your front-end API and its operations.

When importing certain APIs, API Management configures the API backend automatically. For example, API Management configures the backend web service when importing:
* An [OpenAPI specification](import-api-from-oas.md).
* A [SOAP API](import-soap-api.md).
* Azure resources, such as an HTTP-triggered [Azure Function App](import-function-app-as-api.md) or [Logic App](import-logic-app-as-api.md).

API Management also supports using other Azure resources as an API backend, such as:
* A [Service Fabric cluster](how-to-configure-service-fabric-backend.md).
* A custom service. 

API Management supports custom backends so you can manage the backend services of your API. Use custom backends, for example, to authorize the credentials of requests to the backend service, to protect your backend from too many requests, or to load-balance requests to multiple backends. Configure and manage custom backends in the Azure portal, or using Azure APIs or tools.

After creating a backend, you can reference the backend in your APIs. Use the [`set-backend-service`](set-backend-service-policy.md) policy to direct an incoming API request to the custom backend. If you already configured a backend web service for an API, you can use the `set-backend-service` policy to redirect the request to a custom backend instead of the default backend web service configured for that API.

## Benefits of backends

A custom backend has several benefits, including:

* Abstracts information about the backend service, promoting reusability across APIs and improved governance.  
* Easily used by configuring a transformation policy on an existing API.
* Takes advantage of API Management functionality to maintain secrets in Azure Key Vault if [named values](api-management-howto-properties.md) are configured for header or query parameter authentication.

## Circuit breaker (preview)

Starting in API version 2023-03-01 preview, API Management exposes a [circuit breaker](/rest/api/apimanagement/current-preview/backend/create-or-update?tabs=HTTP#backendcircuitbreaker) property in the backend resource to protect a backend service from being overwhelmed by too many requests.

* The circuit breaker property defines rules to trip the circuit breaker, such as the number or percentage of failure conditions during a defined time interval and a range of status codes that indicate failures. 
* When the circuit breaker trips, API Management stops sending requests to the backend service for a defined time, and returns a 503 Service Unavailable response to the client. 
* After the configured trip duration, the circuit resets and traffic resumes to the backend.

The backend circuit breaker is an implementation of the [circuit breaker pattern](/azure/architecture/patterns/circuit-breaker) to allow the backend to recover from overload situations. It augments general [rate-limiting](rate-limit-policy.md) and [concurrency-limiting](limit-concurrency-policy.md) policies that you can implement to protect the API Management gateway and your backend services.

### Example

Use the API Management [REST API](/rest/api/apimanagement/backend) or a Bicep or ARM template to configure a circuit breaker in a backend. In the following example, the circuit breaker in *myBackend* in the API Management instance *myAPIM* trips when there are three or more `5xx` status codes indicating server errors in a day. The circuit breaker resets after one hour.

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template:

```bicep
resource symbolicname 'Microsoft.ApiManagement/service/backends@2023-03-01-preview' = {
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
            interval: 'P1D'
            statusCodeRanges: [
              {
                min: 500
                max: 599
              }
            ]
          }
          name: 'myBreakerRule'
          tripDuration: 'PT1H'
        }
      ]
    }
}
  }
[...]
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your ARM template:

```JSON
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion":"1.0.0.0",
    "resources": [
    {
      "type": "Microsoft.ApiManagement/service/backends",
      "apiVersion": "2023-03-01-preview",
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
                "interval": "P1D",
                "statusCodeRanges": [
                  {
                    "min": "500",
                    "max": "599"
                  }
                ]
              },
              "name": "myBreakerRule",
              "tripDuration": "PT1H"
            }
          ]
        }
      }
    }
    [...]
  ]
}
```

---

## Load-balanced pool (preview)

Starting in API version 2023-05-01 preview, API Management supports backends of the *pool* type, when you want to implement multiple backends for an API and load balance requests across those backends. Currently, the backend pool supports round-robin load balancing.

Use a backend pool for scenarios such as the following:

* Spread the load to multiple backends, which may have individual backend circuit breakers.
* Shift the load from one set of backends to another for upgrade (blue-green deployment).
* Fall back to a different region when the backend in the current region fails or is overloaded.

To create a backend pool, set the `type` property of the backend to `pool`  and specify a list of single backends in the pool.

### Example

Use the API Management [REST API](/rest/api/apimanagement/backend) or a Bicep or ARM template to configure a backend pool. In the following example, the backend *myBackendPool* in the API Management instance *myAPIM* is configured with a pool consisting of two existing backends. Example backends in the pool are named *backend-1* and *backend-2*. 

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template:

```bicep
resource symbolicname 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  name: 'myAPIM/myBackendPool'
  properties: {
    description: 'Load balancer for multiple backends'
    type: 'Pool'
    protocol: 'http'
    url: 'http://does-not-matter'
    pool: {
      services: [
        {
          id: '/backends/backend-1'
        }
        {
          id: '/backends/backend-2'
        }
      ]
    }
  }
}
[...]
```
#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your ARM template:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion":"1.0.0.0",
    "resources": [    
    {
      "type": "Microsoft.ApiManagement/service/backends",
      "apiVersion": "2023-05-01-preview",
      "name": "myAPIM/myBackendPool",
      "properties": {
        "description": "Load balancer for multiple backends",
        "type": "Pool",
        "protocol": "http",
        "url": "http://does-not-matter",
        "pool": {
          "services": [
            {
              "id": "/backends/backend-1"
            },
            {
              "id": "/backends/backend-2"
            }
          ]
        }
      }
    }
    [...]
   ]
}
```

### Use backend pool for an API

To use the pool at runtime, configure the [`set-backend-service`](set-backend-service-policy.md) policy to direct an incoming API request to the backend of type `pool`:

```xml

<policies>
    <inbound>
        <base />
        <set-backend-service backend-id="myBackendPool" />
    </inbound>
    [...]
<policies/>
```


---
## Limitation

For **Developer** and **Premium** tiers, an API Management instance deployed in an [internal virtual network](api-management-using-with-internal-vnet.md) can throw HTTP 500 `BackendConnectionFailure` errors when the gateway endpoint URL and backend URL are the same. If you encounter this limitation, follow the instructions in the [Self-Chained API Management request limitation in internal virtual network mode](https://techcommunity.microsoft.com/t5/azure-paas-blog/self-chained-apim-request-limitation-in-internal-virtual-network/ba-p/1940417) article in the Tech Community blog. 

## Related content

* Set up a [Service Fabric backend](how-to-configure-service-fabric-backend.md) using the Azure portal.

