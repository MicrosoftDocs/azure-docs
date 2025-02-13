---
title: API gateway overview | Azure API Management
description: Learn more about the features of the API gateway component of Azure API Management. API Management offers both Azure-managed and self-hosted gateways.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.custom:
  - build-2024
ms.topic: concept-article
ms.date: 07/11/2024
ms.author: danlep
---

# API gateway in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article provides information about the roles and features of the API Management *gateway* component and compares the gateways you can deploy.

Related information:

* For an overview of API Management scenarios, components, and concepts, see [What is Azure API Management?](api-management-key-concepts.md)

* For more information about the API Management service tiers and features, see:
    * [API Management tiers](api-management-key-concepts.md#api-management-tiers)
    * [Feature-based comparison of the Azure API Management tiers](api-management-features.md).

## Role of the gateway

The API Management *gateway* (also called *data plane* or *runtime*) is the service component that's responsible for proxying API requests, applying policies, and collecting telemetry. 

[!INCLUDE [api-management-gateway-role](../../includes/api-management-gateway-role.md)]


> [!NOTE]
> All requests to the API Management gateway, including those rejected by policy configurations, count toward configured rate limits, quotas, and billing limits if applied in the service tier. 


## Managed and self-hosted

API Management offers both managed and self-hosted gateways:

* **Managed** - The managed gateway is the default gateway component that is deployed in Azure for every API Management instance in every service tier. A standalone managed gateway can also be associated with a [workspace](workspaces-overview.md) in an API Management instance. With the managed gateway, all API traffic flows through Azure regardless of where backends implementing the APIs are hosted. 

    > [!NOTE]
    > Because of differences in the underlying service architecture, the gateways provided in the different API Management service tiers have some differences in capabilities. For details, see the section [Feature comparison: Managed versus self-hosted gateways](#feature-comparison-managed-versus-self-hosted-gateways).
    >    
 

* **Self-hosted** - The [self-hosted gateway](self-hosted-gateway-overview.md) is an optional, containerized version of the default managed gateway that is available in select service tiers. It's useful for hybrid and multicloud scenarios where there's a requirement to run the gateways off of Azure in the same environments where API backends are hosted. The self-hosted gateway enables customers with hybrid IT infrastructure to manage APIs hosted on-premises and across clouds from a single API Management service in Azure. 

    * The self-hosted gateway is [packaged](self-hosted-gateway-overview.md#packaging) as a Linux-based Docker container and is commonly deployed to Kubernetes, including to [Azure Kubernetes Service](how-to-deploy-self-hosted-gateway-azure-kubernetes-service.md) and [Azure Arc-enabled Kubernetes](how-to-deploy-self-hosted-gateway-azure-arc.md).

    * Each self-hosted gateway is associated with a **Gateway** resource in a cloud-based API Management instance from which it receives configuration updates and communicates status. 

## Feature comparison: Managed versus self-hosted gateways

The following tables compare features available in the following API Management gateways:

* **Classic** - the managed gateway available in the Developer, Basic, Standard, and Premium service tiers (formerly grouped as *dedicated* tiers)
* **V2** - the managed gateway available in the Basic v2, Standard v2, and Premium v2 tiers
* **Consumption** - the managed gateway available in the Consumption tier
* **Self-hosted** - the optional self-hosted gateway available in select service tiers
* **Workspace** - the managed gateway available in a [workspace](workspaces-overview.md) in select service tiers

> [!NOTE]
> * Some features of managed and self-hosted gateways are supported only in certain [service tiers](api-management-features.md) or with certain [deployment environments](self-hosted-gateway-overview.md#packaging) for self-hosted gateways.
> * For the current supported features of the self-hosted gateway, ensure that you have upgraded to the latest major version of the self-hosted gateway [container image](self-hosted-gateway-overview.md#container-images).
> * See also self-hosted gateway [limitations](self-hosted-gateway-overview.md#limitations).

### Infrastructure

| Feature support  | Classic  | V2  | Consumption | Self-hosted  | Workspace |
| --- | --- | ----- | ----- | ---------- |  ----- |
| [Custom domains](configure-custom-domain.md) | ✔️ | ✔️ | ✔️ | ✔️ | ❌ |
| [Built-in cache](api-management-howto-cache.md) | ✔️ | ✔️ | ❌ | ❌ | ✔️ |
| [External Redis-compatible cache](api-management-howto-cache-external.md) | ✔️ | ✔️ |✔️ | ✔️ | ❌ |
| [Virtual network injection](virtual-network-concepts.md)  |  Developer, Premium | Premium v2 | ❌ | ✔️<sup>1,2</sup> | ✔️ |
| [Inbound private endpoints](private-endpoint.md)  |  Developer, Basic, Standard, Premium | Standard v2 | ❌ | ❌ | ❌ |
| [Outbound virtual network integration](integrate-vnet-outbound.md)  | ❌ | Standard  v2, Premium v2  |  ❌ | ❌ | ✔️ |
| [Availability zones](zone-redundancy.md)  |  Premium | ❌  | ❌ | ✔️<sup>1</sup> | ✔️<sup>3</sup> |
| [Multi-region deployment](api-management-howto-deploy-multi-region.md) |  Premium | ❌ |  ❌ | ✔️<sup>1</sup> | ❌ |
| [CA root certificates](api-management-howto-ca-certificates.md) for certificate validation |  ✔️ | ✔️ | ❌ | ✔️<sup>3</sup> |  ❌ |
| [Managed domain certificates](configure-custom-domain.md?tabs=managed#domain-certificate-options) |  Developer, Basic, Standard, Premium | ❌ | ✔️ | ❌ | ❌ |
| [TLS settings](api-management-howto-manage-protocols-ciphers.md) |  ✔️ | ✔️ | ✔️ | ✔️ | ❌ |
| **HTTP/2** (Client-to-gateway) | ✔️<sup>4</sup> | ✔️<sup>4</sup> |❌ | ✔️ | ❌ |
| **HTTP/2** (Gateway-to-backend) |  ❌ | ❌ | ❌ | ✔️ | ❌ |
| API threat detection with [Defender for APIs](protect-with-defender-for-apis.md) | ✔️ | ✔️ |  ❌ | ❌ | ❌ |

<sup>1</sup> Depends on how the gateway is deployed, but is the responsibility of the customer.<br/>
<sup>2</sup> Connectivity to the self-hosted gateway v2 [configuration endpoint](self-hosted-gateway-overview.md#fqdn-dependencies) requires DNS resolution of the endpoint hostname.<br/>
<sup>3</sup> CA root certificates for self-hosted gateway are managed separately per gateway<br/>
<sup>4</sup> Client protocol needs to be enabled.

### Backend APIs

| Feature support  | Classic  |  V2  | Consumption | Self-hosted  | Workspace |
| --- | --- | ----- | ----- | ---------- | ----- |
| [OpenAPI specification](import-api-from-oas.md) |  ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [WSDL specification](import-soap-api.md) |  ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| WADL specification |  ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [Logic App](import-logic-app-as-api.md) |  ✔️ | ✔️ | ✔️ |✔️ | ✔️ | 
| [App Service](import-app-service-as-api.md) |  ✔️ | ✔️ |  ✔️ | ✔️ | ✔️ |
| [Function App](import-function-app-as-api.md) |  ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [Container App](import-container-app-with-oas.md) |  ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [Service Fabric](/azure/service-fabric/service-fabric-api-management-overview) |  Developer, Premium |  ❌ |❌ | ❌ | ❌ | 
| [Pass-through GraphQL](graphql-apis-overview.md) |  ✔️ | ✔️ |✔️ | ✔️ | ✔️ |
| [Synthetic GraphQL](graphql-apis-overview.md)|  ✔️ |  ✔️ | ✔️<sup>1</sup> | ✔️<sup>1</sup> | ❌ |
| [Pass-through WebSocket](websocket-api.md) |  ✔️ |  ✔️ | ❌ | ✔️ | ❌ |
| [Pass-through gRPC](grpc-api.md)  |  ❌ | ❌ | ❌ | ✔️ | ❌ |
| [OData](import-api-from-odata.md)  |  ✔️ |  ✔️ | ✔️ | ✔️ | ✔️ |
| [Azure OpenAI and LLM](azure-openai-api-from-specification.md) | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [Circuit breaker in backend](backends.md#circuit-breaker)  |  ✔️ | ✔️ | ❌ | ✔️ | ✔️ |
| [Load-balanced backend pool](backends.md#load-balanced-pool)  |  ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

<sup>1</sup> Synthetic GraphQL subscriptions (preview) aren't supported.

### Policies

Managed and self-hosted gateways support all available [policies](api-management-policies.md) in policy definitions with the following exceptions. See the policy reference for details about each policy.

| Feature support  | Classic  |  V2  | Consumption | Self-hosted<sup>1</sup>  | Workspace |
| --- | --- | ----- | ----- | ---------- | ----- |
| [Dapr integration](api-management-policies.md#integration-and-external-communication) |  ❌ | ❌ |❌ | ✔️ | ❌ |
| [GraphQL resolvers](api-management-policies.md#graphql-resolvers) and [GraphQL validation](api-management-policies.md#content-validation)|  ✔️ | ✔️ |✔️ | ❌ | ❌ |
| [Get authorization context](get-authorization-context-policy.md) |  ✔️ |  ✔️ |✔️ | ❌ | ❌ |
| [Authenticate with managed identity](authentication-managed-identity-policy.md) |  ✔️ |  ✔️ |✔️ | ✔️ | ❌ |
| [Azure OpenAI and LLM semantic caching](api-management-policies.md#caching) |  ✔️ | ✔️ |✔️ | ❌ | ❌ |
| [Quota and rate limit](api-management-policies.md#rate-limiting-and-quotas) |  ✔️ | ✔️<sup>2</sup> | ✔️<sup>3</sup> | ✔️<sup>4</sup> | ✔️ |

<sup>1</sup> Configured policies that aren't supported by the self-hosted gateway are skipped during policy execution.<br/>
<sup>2</sup> The quota by key policy isn't available in the v2 tiers.<br/>
<sup>3</sup> The rate limit by key, quota by key, and Azure OpenAI token limit policies aren't available in the Consumption tier.<br/>
<sup>4</sup> [!INCLUDE [api-management-self-hosted-gateway-rate-limit](../../includes/api-management-self-hosted-gateway-rate-limit.md)] [Learn more](how-to-self-hosted-gateway-on-kubernetes-in-production.md#request-throttling)


### Monitoring

For details about monitoring options, see [Observability in Azure API Management](observability.md).

| Feature support  | Classic  |  V2  | Consumption | Self-hosted  | Workspace |
| --- | --- | ----- | ----- | ---------- | ----- |
| [API analytics](howto-use-analytics.md) | ✔️ | ✔️<sup>1</sup> | ❌ | ❌ | ❌ | 
| [Application Insights](api-management-howto-app-insights.md) | ✔️ | ✔️ | ✔️ | ✔️<sup>2</sup> | ✔️ | 
| [Logging through Event Hubs](api-management-howto-log-event-hubs.md) | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [Metrics in Azure Monitor](api-management-howto-use-azure-monitor.md#view-metrics-of-your-apis) | ✔️ | ✔️ |✔️ | ✔️ | ❌ |
| [OpenTelemetry Collector](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md) |  ❌ | ❌ | ❌ | ✔️ | ❌ |
| [Request logs in Azure Monitor and Log Analytics](api-management-howto-use-azure-monitor.md#resource-logs) | ✔️ | ✔️ | ❌ | ❌<sup>3</sup> | ❌ |
| [Local metrics and logs](how-to-configure-local-metrics-logs.md) |  ❌ | ❌ | ❌ | ✔️ | ❌ |  
| [Request tracing](api-management-howto-api-inspector.md) | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

<sup>1</sup> The v2 tiers support Azure Monitor-based analytics.<br/>
<sup>2</sup> Gateway uses [Azure Application Insight's built-in memory buffer](/azure/azure-monitor/app/telemetry-channels#built-in-telemetry-channels) and does not provide delivery guarantees.<br/>
<sup>3</sup> The self-hosted gateway currently doesn't send resource logs (diagnostic logs) to Azure Monitor. Optionally [send metrics](how-to-configure-cloud-metrics-logs.md) to Azure Monitor, or [configure and persist logs locally](how-to-configure-local-metrics-logs.md) where the self-hosted gateway is deployed.<br/>

### Authentication and authorization

Managed and self-hosted gateways support all available [API authentication and authorization options](authentication-authorization-overview.md) with the following exceptions.

| Feature support  | Classic  |  V2  | Consumption | Self-hosted  | Workspace |
| --- | --- | ----- | ----- | ---------- | ----- |
| [Credential manager](credentials-overview.md) |  ✔️ | ✔️ | ✔️ | ❌ | ❌ |


## Gateway throughput and scaling

> [!IMPORTANT]
> Throughput is affected by the number and rate of concurrent client connections, the kind and number of configured policies, payload sizes, backend API performance, and other factors. Self-hosted gateway throughput is also dependent on the compute capacity (CPU and memory) of the host where it runs. Perform gateway load testing using anticipated production conditions to determine expected throughput accurately.

### Managed gateway

For estimated maximum gateway throughput in the API Management service tiers, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

> [!IMPORTANT]
> Throughput figures are presented for information only and must not be relied upon for capacity and budget planning. See [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/) for details.

* **Classic tiers**
    * Scale gateway capacity by adding and removing scale [units](upgrade-and-scale.md), or upgrade the service tier. (Scaling not available in the Developer tier.)
    * In the Basic, Standard, and Premium tiers, optionally configure [Azure Monitor autoscale](api-management-howto-autoscale.md).
    * In the Premium tier, optionally add and distribute gateway capacity across multiple [regions](api-management-howto-deploy-multi-region.md).

* **v2 tiers**
    * Scale gateway capacity by adding and removing scale [units](upgrade-and-scale.md), or upgrade the service tier.

* **Consumption tier**
    * API Management instances in the Consumption tier scale automatically based on the traffic.

### Self-hosted gateway
* In environments such as [Kubernetes](how-to-self-hosted-gateway-on-kubernetes-in-production.md), add multiple gateway replicas to handle expected usage.
* Optionally [configure autoscaling](how-to-self-hosted-gateway-on-kubernetes-in-production.md#autoscaling) to meet traffic demands.

### Workspace gateway

Scale capacity by adding and removing scale [units](upgrade-and-scale.md) in the workspace gateway.

## Related content

Lear more about:

-   [API Management in a Hybrid and multicloud World](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   [Capacity metric](api-management-capacity.md) for scaling decisions
-   [Observability capabilities](observability.md) in API Management
-   [GenAI gateway capabilities](genai-gateway-capabilities.md) in API Management
