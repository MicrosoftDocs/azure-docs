---
title: API gateway overview | Azure API Management
description: Learn more about the features of the API gateway component of Azure API Management. API Management offers both Azure-managed and self-hosted gateways.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 07/19/2022
ms.author: danlep
---

# API gateway in Azure API Management

This article provides information about the roles and features of the API Management *gateway* component.

Related information:

* For an overview of API Management scenarios, components, and concepts, see [What is Azure API Management?](api-management-key-concepts.md)

* For more information about the API Management service tiers and features, see [Feature-based comparison of the Azure API Management tiers](api-management-features.md).

## Role of the gateway

The API Management *gateway* (also called data plane) is the service component that's responsible for proxying API requests, applying policies, and collecting telemetry. 

Specifically, the gateway:

* Acts as a façade to backend services by accepting API calls and routing them to appropriate backends
* Verifies [API keys](api-management-subscriptions.md) and other credentials such as [JWT tokens and certificates](api-management-access-restriction-policies.md) presented with requests
* Enforces [usage quotas and rate limits](api-management-access-restriction-policies.md)
* Optionally transforms requests and responses as specified in [policy statements](api-management-howto-policies.md)
* If configured, [caches responses](api-management-howto-cache.md) to improve response latency and minimize the load on backend services
* Emits logs, metrics, and traces for [monitoring, reporting, and troubleshooting](observability.md) 

## Managed and self-hosted

API Management offers both managed and self-hosted gateways for handling requests to backend APIs:

* **Managed** - The managed gateway is the default gateway component that is deployed in Azure for every API Management instance in every service tier. With the managed gateway, all API traffic flows through Azure regardless of where backends implementing the APIs are hosted. 

    > [!NOTE]
    > Because of differences in the underlying service architecture, the Consumption tier gateway currently lacks some capabilities of the dedicated gateway. For details, see the section [Feature comparison: Managed versus self-hosted gateways](#feature-comparison-managed-versus-self-hosted-gateways).
    >    
 

* **Self-hosted** - The [self-hosted gateway](self-hosted-gateway-overview.md) is an optional, containerized version of the default managed gateway. It's useful for scenarios such as placing gateways in the same environments where you host your APIs. Available in the Developer and Premium service tiers, the self-hosted gateway enables customers with hybrid IT infrastructure to manage APIs hosted on-premises and across clouds from a single API Management service in Azure. 

    * The self-hosted gateway is [packaged](self-hosted-gateway-overview.md#packaging) as a Linux-based Docker container and is commonly deployed to Kubernetes, including to [Azure Kubernetes Service](how-to-deploy-self-hosted-gateway-azure-kubernetes-service.md) and [Azure Arc-enabled Kubernetes](how-to-deploy-self-hosted-gateway-azure-arc.md).

    * Each self-hosted gateway is associated with a **Gateway** resource in a cloud-based API Management instance from which it receives configuration updates and communicates status. 


## Feature comparison: Managed versus self-hosted gateways

The following table compares features available in the managed gateway versus those in the self-hosted gateway. Differences are also shown between the managed gateway for dedicated service tiers (Developer, Basic, Standard, Premium) and for the Consumption tier.

> [!NOTE]
> * Some features of managed and self-hosted gateways are supported only in certain [service tiers](api-management-features.md) or with certain [deployment environments](self-hosted-gateway-overview.md#packaging) for self-hosted gateways.
> * See also self-hosted gateway [limitations](self-hosted-gateway-overview.md#limitations).


### Infrastructure

| Feature support  | Managed (Dedicated)  | Managed (Consumption) | Self-hosted  |
| --- | ----- | ----- | ---------- |
| [Custom domains](configure-custom-domain.md) | ✔️ | ✔️ | ✔️ |
| [Built-in cache](api-management-howto-cache.md) | ✔️ |  ❌ | ❌ |
| [External Redis-compatible cache](api-management-howto-cache-external.md) | ✔️ | ✔️ | ✔️ |
| [Virtual network injection](virtual-network-concepts.md)  |  Developer, Premium |  ❌ | ✔️<sup>1</sup> |
| [Private endpoints](private-endpoint.md)  |  ✔️ |  ✔️ | ❌ |
| [Availability zones](zone-redundancy.md)  |  Premium |  ❌ | ✔️<sup>1</sup> |
| [Multi-region deployment](api-management-howto-deploy-multi-region.md) |  Premium |  ❌ | ✔️<sup>1</sup> |
| [CA root certificates](api-management-howto-ca-certificates.md) for certificate validation |  ✔️ |  ❌ | ✔️<sup>2</sup> |  
| [Managed domain certificates](configure-custom-domain.md?tabs=managed#domain-certificate-options) |  ✔️ | ✔️ | ❌ |
| [TLS settings](api-management-howto-manage-protocols-ciphers.md) |  ✔️ | ✔️ | ✔️ |

<sup>1</sup> Depends on how the gateway is deployed, but is the responsibility of the customer.<br/>
<sup>2</sup> Requires configuration of local CA certificates.<br/>

### Backend APIs

| API | Managed (Dedicated)  | Managed (Consumption) | Self-hosted  |
| --- | ----- | ----- | ---------- |
| [OpenAPI specification](import-api-from-oas.md) |  ✔️ | ✔️ | ✔️ |
| [WSDL specification)](import-soap-api.md) |  ✔️ | ✔️ | ✔️ |
| WADL specification |  ✔️ | ✔️ | ✔️ |
| [Logic App](import-logic-app-as-api.md) |  ✔️ | ✔️ | ✔️ |
| [App Service](import-app-service-as-api.md) |  ✔️ | ✔️ | ✔️ |
| [Function App](import-function-app-as-api.md) |  ✔️ | ✔️ | ✔️ |
| [Container App](import-container-app-with-oas.md) |  ✔️ | ✔️ | ✔️ |
| [Service Fabric](../service-fabric/service-fabric-api-management-overview.md) |  Developer, Premium |  ❌ | ❌ |
| [Passthrough GraphQL](graphql-api.md) |  ✔️ | ✔️<sup>1</sup> | ❌ |
| [Synthetic GraphQL](graphql-schema-resolve-api.md) |  ✔️ |  ❌ | ❌ |
| [Passthrough WebSocket](websocket-api.md) |  ✔️ |  ❌ | ❌ |

<sup>1</sup> GraphQL subscriptions aren't supported in the Consumption tier.

### Policies

Managed and self-hosted gateways support all available [policies](api-management-howto-policies.md) in policy definitions with the following exceptions.

| Policy | Managed (Dedicated)  | Managed (Consumption) | Self-hosted  |
| --- | ----- | ----- | ---------- |
| [Dapr integration](api-management-dapr-policies.md) |  ❌ | ❌ | ✔️ |
| [Get authorization context](api-management-access-restriction-policies.md#GetAuthorizationContext) |  ✔️ |  ❌ | ❌ |
| [Quota and rate limit](api-management-access-restriction-policies.md) |  ✔️ |  ✔️<sup>1</sup> | ✔️<sup>2</sup>
| [Set GraphQL resolver](graphql-policies.md#set-graphql-resolver) |  ✔️ |  ❌ | ❌ |

<sup>1</sup> The rate limit by key and quota by key policies aren't available in the Consumption tier.<br/>
<sup>2</sup> By default, rate limit counts in self-hosted gateways are per-gateway, per-node.

### Monitoring

For details about monitoring options, see [Observability in Azure API Management](observability.md).

| Feature  | Managed (Dedicated)  | Managed (Consumption) | Self-hosted  |
| --- | ----- | ----- | ---------- |
| [API analytics](howto-use-analytics.md) | ✔️ |  ❌ | ❌ |
| [Application Insights](api-management-howto-app-insights.md) | ✔️ |  ✔️ | ✔️ |
| [Logging through Event Hubs](api-management-howto-log-event-hubs.md) | ✔️ |  ✔️ | ✔️ |
| [Metrics in Azure Monitor](api-management-howto-use-azure-monitor.md#view-metrics-of-your-apis) | ✔️ | ❌ | ✔️ |
| [OpenTelemetry Collector](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md) |  ❌ |  ❌ | ✔️ |
| [Request logs in Azure Monitor](api-management-howto-use-azure-monitor.md#resource-logs) | ✔️ |  ❌ | ❌<sup>1</sup> |
| [Local metrics and logs](how-to-configure-local-metrics-logs.md) |  ❌ |  ❌ | ✔️ |
| [Request tracing](api-management-howto-api-inspector.md) | ✔️ |  ✔️ | ✔️ |

<sup>1</sup> The self-hosted gateway currently doesn't send resource logs (diagnostic logs) to Azure Monitor. Optionally [send metrics](how-to-configure-cloud-metrics-logs.md) to Azure Monitor, or [configure and persist logs locally](how-to-configure-local-metrics-logs.md) where the self-hosted gateway is deployed.

### Authentication and authorization

| Feature  | Managed (Dedicated)  | Managed (Consumption) | Self-hosted  |
| --- | ----- | ----- | ---------- |
| [Authorizations](authorizations-overview.md) |  ✔️ | ✔️ | ❌ |


## Gateway throughput and scaling

> [!IMPORTANT]
> Throughput is affected by the number and rate of concurrent client connections, the kind and number of configured policies, payload sizes, backend API performance, and other factors. Perform gateway load testing using anticipated production conditions to determine expected throughput accurately.

### Managed gateway

For estimated gateway throughput in the API Management service tiers, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

* **Dedicated service tiers**
    * Scale gateway capacity by adding and removing scale [units](upgrade-and-scale.md), or upgrade the service tier. (Scaling not available in the Developer tier.)
    * In the Standard and Premium tiers, optionally configure [Azure Monitor autoscale](api-management-howto-autoscale.md).
    * In the Premium tier, optionally add and distribute gateway capacity across multiple [regions](api-management-howto-deploy-multi-region.md).

* **Consumption tier**
    * API Management instances in the Consumption tier scale automatically based on the traffic.

### Self-hosted gateway
* In environments such as [Kubernetes](how-to-self-hosted-gateway-on-kubernetes-in-production.md), add multiple gateway replicas to handle expected usage.
* Optionally [configure autoscaling](how-to-self-hosted-gateway-on-kubernetes-in-production.md#autoscaling) to meet traffic demands.

## Next steps

-   Learn more about [API Management in a Hybrid and Multi-Cloud World](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   Learn more about using the [capacity metric](api-management-capacity.md) for scaling decisions
-   Learn about [observability capabilities](observability.md) in API Management
