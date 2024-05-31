---
title: Azure API Management backends | Microsoft Docs
description: Learn about backends in Azure API Management. Backend entities encapsulate information about backend services, promoting reusability across APIs and governance.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: concept-article
ms.date: 05/13/2024
ms.author: danlep
ms.custom:
  - build-2024
---

# Backends in API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

A *backend* (or *API backend*) in API Management is an HTTP service that implements your front-end API and its operations.

When importing certain APIs, API Management configures the API backend automatically. For example, API Management configures the backend web service when importing:
* An [OpenAPI specification](import-api-from-oas.md).
* A [SOAP API](import-soap-api.md).
* Azure resources, such as an HTTP-triggered [Azure Function App](import-function-app-as-api.md) or [Logic App](import-logic-app-as-api.md).

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

## Reference backend using set-backend-service policy

After creating a backend, you can reference the backend in your APIs. Use the [`set-backend-service`](set-backend-service-policy.md) policy to direct an incoming API request to the backend. If you already configured a backend web service for an API, you can use the `set-backend-service` policy to redirect the request to a backend entity instead. For example:

```xml
<policies>
    <inbound>
        <base />
        <set-backend-service backend-id="myBackend" />
    </inbound>
    [...]
<policies/>
```

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

### Example

Use the API Management [REST API](/rest/api/apimanagement/backend) or a Bicep or ARM template to configure a circuit breaker in a backend. In the following example, the circuit breaker in *myBackend* in the API Management instance *myAPIM* trips when there are three or more `5xx` status codes indicating server errors in 1 hour. 

The circuit breaker resets after 1 hour. If a `Retry-After` header is present in the response, the circuit breaker accepts the value and waits for the specified time before sending requests to the backend again.

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template for a backend resource with a circuit breaker:

```bicep
resource symbolicname 'Microsoft.ApiManagement/service/backends@2023-09-01-preview' = {
  name: 'myAPIM/myBackend'
  properties: {
    url: 'https://mybackend.com'
    protocol: 'https'
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
    "protocol": "https",
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

API Management supports backend *pools*, when you want to implement multiple backends for an API and load-balance requests across those backends. 

Use a backend pool for scenarios such as the following:

* Spread the load to multiple backends, which may have individual backend circuit breakers.
* Shift the load from one set of backends to another for upgrade (blue-green deployment).

To create a backend pool, set the `type` property of the backend to `pool` and specify a list of backends that make up the pool.

> [!NOTE]
> * Currently, you can only include single backends in a backend pool. You can't add a backend of type `pool` to another backend pool. You can include up to 30 backends in a pool.
> * Because of the distributed nature of the API Management architecture, backend load balancing is approximate. Different instances of the gateway do not synchronize and will load balance based on the information on the same instance.


### Load balancing options

API Management supports the following load balancing options for backend pools:

* **Round-robin**: By default, requests are distributed evenly across the backends in the pool.
* **Weighted**: Weights are assigned to the backends in the pool, and requests are distributed across the backends based on the relative weight assigned to each backend. Use this option for scenarios such as conducting a blue-green deployment.
* **Priority-based**: Backends are organized in priority groups, and requests are sent to the backends in order of the priority groups. Within a priority group, requests are distributed either evenly across the backends, or (if assigned) according to the relative weight assigned to each backend.
    
> [!NOTE]
> Backends in lower priority groups will only be used when all backends in higher priority groups are unavailable because circuit breaker rules are tripped.

### Example

Use the API Management [REST API](/rest/api/apimanagement/backend) or a Bicep or ARM template to configure a backend pool. In the following example, the backend *myBackendPool* in the API Management instance *myAPIM* is configured with a backend pool. Example backends in the pool are named *backend-1* and *backend-2*. Both backends are in the highest priority group; within the group, *backend-1* has a greater weight than *backend-2* .

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template for a backend resource with a load-balanced pool:

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
      ]
    }
  }
}
```
#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your ARM template for a backend resource with a load-balanced pool. 

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
      ]
    }
  }
}
```

---


## Limitation

For **Developer** and **Premium** tiers, an API Management instance deployed in an [internal virtual network](api-management-using-with-internal-vnet.md) can throw HTTP 500 `BackendConnectionFailure` errors when the gateway endpoint URL and backend URL are the same. If you encounter this limitation, follow the instructions in the [Self-Chained API Management request limitation in internal virtual network mode](https://techcommunity.microsoft.com/t5/azure-paas-blog/self-chained-apim-request-limitation-in-internal-virtual-network/ba-p/1940417) article in the Tech Community blog. 

## Related content

* Set up a [Service Fabric backend](how-to-configure-service-fabric-backend.yml) using the Azure portal.
