---
title: Azure API Management - Overview and Key Concepts
description: Introduction to key scenarios, capabilities, and concepts of the Azure API Management service. API Management supports the full API lifecycle.
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: overview
ms.date: 10/13/2025
ms.author: danlep
ms.custom: mvc
#customer intent: As an API platform owner, I want a concise overview of Azure API Management’s scenarios, components, and tiers so that I can evaluate and plan the right API management solution for my organization.
---

# What is Azure API Management?

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article provides an overview of common scenarios and key components of Azure API Management. Azure API Management is a hybrid, multicloud management platform for APIs across all environments. As a platform-as-a-service, API Management supports the complete API lifecycle.

> [!TIP]
> If you're already familiar with API Management and ready to start, see these resources:
> - [Features and service tiers](api-management-features.md)
> - [Create an API Management instance](get-started-create-service-instance.md)
> - [Import and publish an API](import-and-publish.md)
> - [API Management policies](api-management-howto-policies.md)

## Scenarios 

APIs enable digital experiences, simplify application integration, underpin new digital products, and make data and services reusable and universally accessible. ​With the proliferation and increasing dependency on APIs, organizations need to manage them as first-class assets throughout their lifecycle.​

:::image type="content" source="media/api-management-key-concepts/apis-connected-experiences.png" alt-text="Diagram showing role of APIs in connected experiences.":::

Azure API Management helps organizations meet these challenges:

- Provide a comprehensive API platform for different stakeholders and teams to produce and manage APIs 
- Abstract backend architecture diversity and complexity from API consumers
- Securely expose services hosted on and outside of Azure as APIs
- Protect, accelerate, and observe APIs
- Enable API discovery and consumption by internal and external users

Common scenarios include:

- **Unlocking legacy assets** - APIs are used to abstract and modernize legacy backends and make them accessible from new cloud services and modern applications. APIs allow innovation without the risk, cost, and delays of migration.
- **API-centric app integration** - APIs are easily consumable, standards-based, and self-describing mechanisms for exposing and accessing data, applications, and processes. They simplify and reduce the cost of app integration.
- **Multi-channel user experiences** - APIs are frequently used to enable user experiences such as web, mobile, wearable, or Internet of Things applications. Reuse APIs to accelerate development and ROI.
- **B2B integration** - APIs exposed to partners and customers lower the barrier to integrate business processes and exchange data between business entities. APIs eliminate the overhead inherent in point-to-point integration. Especially with self-service discovery and onboarding enabled, APIs are the primary tools for scaling B2B integration.

> [!TIP]
> Visit [aka.ms/apimlove](https://aka.ms/apimlove) for a library of useful resources, including videos, blogs, and customer stories about using Azure API Management.

## API Management components

Azure API Management is made up of an API *gateway*, a *management plane*, and a *developer portal*, with features designed for different audiences in the API ecosystem. These components are Azure-hosted and fully managed by default. API Management is available in various [tiers](#api-management-tiers) differing in capacity and features.

:::image type="content" source="media/api-management-key-concepts/api-management-components.png" alt-text="Diagram showing key components of Azure API Management.":::

## API gateway

All requests from client applications first reach the API gateway (also called *data plane* or *runtime*), which then forwards them to respective backend services. The API gateway acts as a facade to the backend services, allowing API providers to abstract API implementations and evolve backend architecture without impacting API consumers. The gateway enables consistent configuration of routing, security, throttling, caching, and observability.

[!INCLUDE [api-management-gateway-role](../../includes/api-management-gateway-role.md)]

### Self-hosted gateway
With the [self-hosted gateway](self-hosted-gateway-overview.md), an API provider can deploy the API gateway to the same environments where they host their APIs, to optimize API traffic and ensure compliance with local regulations and guidelines. The self-hosted gateway enables organizations with hybrid IT infrastructure to manage APIs hosted on-premises and across clouds from a single API Management service in Azure.

The self-hosted gateway is packaged as a Linux-based Docker container and is commonly deployed to Kubernetes, including to Azure Kubernetes Service and [Azure Arc-enabled Kubernetes](how-to-deploy-self-hosted-gateway-azure-arc.md). 

More information:
- [API gateway in Azure API Management](api-management-gateways-overview.md)

## Management plane

API providers interact with the service through the management plane (also called *control plane*), which provides full access to the API Management service capabilities. 

Customers interact with the management plane through Azure tools that include the Azure portal, Azure PowerShell, Azure CLI, a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview), and a REST API. Or they can interact through client SDKs in several popular programming languages.

Use the management plane to:

- Provision and configure API Management service settings.
- Define or import API schemas from a wide range of sources. Including, OpenAPI, WSDL, OData definitions, Azure compute services, WebSocket, GraphQL, and gRPC backends.
- Package APIs into products.
- Set up [policies](#policies) like quotas or transformations on the APIs.
- Get insights from analytics.
- Manage users such as app developers.

## Developer portal

The open-source [developer portal][Developer portal] is an automatically generated, fully customizable website with the documentation of your APIs. 

:::image type="content" source="media/api-management-key-concepts/cover.png" alt-text="Screenshot of API Management developer portal - administrator mode." border="false":::

API providers can customize the look and feel of the developer portal by adding custom content, customizing styles, and adding their branding. Extend the developer portal further by [self-hosting](developer-portal-self-host.md).

API consumers such as app developers access the open-source developer portal to discover the APIs, onboard to use them, and learn how to consume them in applications. (APIs can also be exported to the [Power Platform](export-api-power-platform.md) for discovery and use by citizen developers.)

When they use the developer portal, API consumers can:

- Read API documentation
- Call an API via the interactive console
- Create an account and subscribe to get API keys
- Access analytics on their own usage
- Download API definitions
- Manage API keys

## Federated API management with workspaces

For organizations that want to empower decentralized teams to develop and manage their own APIs with the advantages of centralized API governance and discovery, API Management offers first-class support for a federated API management model with *workspaces*.

[!INCLUDE [workspaces-benefits](../../includes/workspaces-benefits.md)]

**More information**:

- [Workspaces in API Management](workspaces-overview.md)

## API Management tiers

API Management is offered in various pricing tiers to meet the needs of different customers. Each tier offers a distinct combination of features, performance, capacity limits, scalability, SLA, and pricing for different scenarios. The tiers are grouped as follows:

- **Classic** - The original API Management offering, including the Developer, Basic, Standard, and Premium tiers. The Premium tier is designed for enterprises that require access to private backends, enhanced security features, multi-region deployments, availability zones, and high scalability. The Developer tier is an economical option for nonproduction use, while the Basic, Standard, and Premium tiers are production-ready tiers. 
- **V2** - A new set of tiers that offer fast provisioning and scaling, including Basic v2 for development and testing, and Standard v2 and Premium v2 for production workloads. Standard v2 and Premium v2 support virtual network integration for simplified connection to network-isolated backends. Premium v2 also supports virtual network injection for full isolation of network traffic to and from the gateway.
- **Consumption** - A serverless gateway for managing APIs that scales based on demand and bills per execution. This tier is designed for applications with serverless compute, microservices-based architectures, and variable traffic patterns.

**More information**:
- [Feature-based comparison of the Azure API Management tiers](api-management-features.md)
- [V2 service tiers](v2-service-tiers-overview.md)
- [Understanding API Management limits](service-limits.md)
- [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/)

## Integration with Azure services

API Management integrates with many complementary Azure services to create enterprise solutions, including:

- **[Azure API Center](../api-center/overview.md)** to build a complete inventory of APIs​ in the organization - regardless of their type, lifecycle stage, or deployment location​ - for API discovery, reuse, and governance
- **[Copilot in Azure](/azure/copilot/overview)** to help author API Management policies or explain already configured policies​
- **[Azure Key Vault](/azure/key-vault/general/overview)** for secure safekeeping and management of [client certificates](api-management-howto-mutual-certificates.md) and [secrets​](api-management-howto-properties.md)
- **[Azure Monitor](api-management-howto-use-azure-monitor.md)** for logging, reporting, and alerting on management operations, systems events, and API requests​
- **[Application Insights](api-management-howto-app-insights.md)** for live metrics, end-to-end tracing, and troubleshooting
- **[Virtual networks](virtual-network-concepts.md)**, **[private endpoints](private-endpoint.md)**, **[Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)**, and **[Azure Front Door](front-door-api-management.md)** for network-level protection​
- **[Microsoft Defender for APIs](protect-with-defender-for-apis.md)** and **[Azure DDoS Protection](protect-with-ddos-protection.md)** for runtime protection against malicious attacks​
- **Microsoft Entra ID** for [developer authentication](api-management-howto-aad.md) and [request authorization](api-management-howto-protect-backend-with-aad.md)​
- **[Event Hubs](api-management-howto-log-event-hubs.md)** for streaming events​
- **[Azure Redis](api-management-howto-cache-external.md)** for caching responses​ with Azure Cache for Redis or Azure Managed Redis​
- Several Azure compute offerings commonly used to build and host APIs on Azure, including **[Functions](import-function-app-as-api.md)**, **[Logic Apps](import-logic-app-as-api.md)**, **[Web Apps](import-app-service-as-api.md)**, **[Service Fabric](how-to-configure-service-fabric-backend.yml)**, and others including **[Azure OpenAI](azure-openai-api-from-specification.md)** service.​
- Azure database offerings, including [Azure Cosmos DB](cosmosdb-data-source-policy.md), enabling direct CRUD (Create, Read, Update, Delete) operations without requiring intermediate compute resources.

**More information**:
- [Basic enterprise integration](/azure/architecture/reference-architectures/enterprise-integration/basic-enterprise-integration?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=/azure/api-management/breadcrumb/toc.json)
- [Landing zone accelerator](/azure/cloud-adoption-framework/scenarios/app-platform/api-management/landing-zone-accelerator?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=/azure/api-management/breadcrumb/toc.json)
- [AI gateway capabilities in API Management](genai-gateway-capabilities.md)
- [Synchronize APIs to API Center from API Management](../api-center/synchronize-api-management-apis.md?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=/azure/api-management/breadcrumb/toc.json)

## Key concepts

### APIs

APIs are the foundation of an API Management service instance. Each API represents a set of *operations* available to app developers. Each API contains a reference to the backend service that implements the API, and its operations map to backend operations. 

Operations in API Management are highly configurable. You have control over URL mapping, query and path parameters, request and response content, and operation response caching. 

**More information**:
- [Import and publish your first API][How to create APIs]
- [Mock API responses][How to add operations to an API]

### Products

Products are how APIs are surfaced to API consumers such as app developers. Products in API Management have one or more APIs and can be *open* or *protected*. Protected products require a subscription key, while open products can be consumed freely.

When a product is ready for use by consumers, it can be published. Once published, it can be viewed or subscribed to by users through the developer portal. Subscription approval is configured at the product level and can either require an administrator's approval or be automatic.

**More information**:
- [Create and publish a product][How to create and publish a product]
- [Subscriptions in API Management](api-management-subscriptions.md)

### Users and groups

Users (API consumers) can be created or invited to join by service administrators, or they can sign up from the [developer portal][Developer portal]. Each user is a member of one or more groups, and can subscribe to the products that grant visibility to those groups.

API Management has the following built-in groups: 

- **Developers** - Authenticated developer portal users that build applications using your APIs. Developers are granted access to the developer portal and build applications that call the operations of an API. 

- **Guests** - Unauthenticated developer portal users, such as prospective customers visiting the developer portal. They can be granted certain read-only access, such as the ability to view APIs but not call them.

API Management service owners can also create custom groups or use external groups in an [associated Microsoft Entra tenant](api-management-howto-aad.md) to give users visibility and access to API products. For example, create a custom group for developers in a partner organization to access a specific subset of APIs in a product. A user can belong to more than one group.

**More information**: 
- [How to create and use groups][How to create and use groups]
- [How to manage user accounts](api-management-howto-create-or-invite-developers.md)

### Workspaces

Workspaces support a federated API management model by allowing decentralized API development teams to manage and productize their own APIs, while a central API platform team maintains the API Management infrastructure. Each workspace contains APIs, products, subscriptions, and related entities that are accessible only to the workspace collaborators. Access is controlled through Azure role-based access control (RBAC). Each workspace is associated with one or more workspace gateways that route API traffic to its backend services.

**More information**:

- [Workspaces in API Management](workspaces-overview.md)

### Policies

With [policies][API Management policies], an API provider can change the behavior of an API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Popular statements include format conversion from XML to JSON and call-rate limiting to restrict the number of incoming calls from a developer. For a complete list, see [API Management policies][Policy reference].

Policy expressions can be used as attribute values or text values in many of the API Management policies. Some policies such as the [Control flow](./choose-policy.md) and [Set variable](./set-variable-policy.md) policies are based on policy expressions. 

Policies can be applied at different scopes, depending on your needs: global (all APIs), a workspace, a product, a specific API, or an API operation. 

**More information**:

- [Transform and protect your API][How to create and configure advanced product settings].
- [Policy expressions](./api-management-policy-expressions.md)

## Next steps

Complete the following quickstart and start using Azure API Management:

> [!div class="nextstepaction"]
> [Create an Azure API Management instance by using the Azure portal](get-started-create-service-instance.md)

[APIs and operations]: #apis
[Products]: #products
[Groups]: #groups
[Developers]: #developers
[Policies]: #policies
[Developer portal]: #developer-portal

[How to create APIs]: ./import-and-publish.md
[How to add operations to an API]: ./mock-api-responses.md
[How to create and publish a product]: api-management-howto-add-products.md
[How to create and use groups]: api-management-howto-create-groups.md
[How to associate groups with developers]: api-management-howto-create-groups.md#associate-group-developer
[How to create and configure advanced product settings]: transform-api.md
[How to create or invite developers]: api-management-howto-create-or-invite-developers.md
[Policy reference]: ./api-management-policies.md
[API Management policies]: api-management-howto-policies.md
[Create an API Management service instance]: get-started-create-service-instance.md