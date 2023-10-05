---
title: Azure API Management backends | Microsoft Docs
description: Learn about custom backends in API Management
services: api-management
documentationcenter: ''
author: dlepow
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 08/16/2023
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

API Management supports custom backends so you can manage the backend services of your API. Use custom backends, for example, to authorize the credentials of requests to the backend service. Configure and manage custom backends in the Azure portal, or using Azure APIs or tools.

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

Use the API Management REST API or a Bicep or ARM template to configure a circuit breaker in a backend. In the following example, the circuit breaker trips when there are three or more `5xx` status codes indicating server errors in a day. The circuit breaker resets after one hour.

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template:

```bicep
resource symbolicname 'Microsoft.ApiManagement/service/backends@2023-03-01-preview' = {
  name: 'myBackend'
  parent: resourceSymbolicName
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
            percentage: int
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
[...]
}
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your ARM template:

```JSON
{
  "type": "Microsoft.ApiManagement/service/backends",
  "apiVersion": "2023-03-01-preview",
  "name": "myBackend",
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
[...]
}
```

---


## Limitation

For **Developer** and **Premium** tiers, an API Management instance deployed in an [internal virtual network](api-management-using-with-internal-vnet.md) can throw HTTP 500 `BackendConnectionFailure` errors when the gateway endpoint URL and backend URL are the same. If you encounter this limitation, follow the instructions in the [Self-Chained API Management request limitation in internal virtual network mode](https://techcommunity.microsoft.com/t5/azure-paas-blog/self-chained-apim-request-limitation-in-internal-virtual-network/ba-p/1940417) article in the Tech Community blog. 

## Next steps

* Set up a [Service Fabric backend](how-to-configure-service-fabric-backend.md) using the Azure portal.
* Backends can also be configured using the API Management [REST API](/rest/api/apimanagement), [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementbackend), or [Azure Resource Manager templates](../service-fabric/service-fabric-tutorial-deploy-api-management.md).
