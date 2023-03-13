---
title: Azure API Management - Overview and key concepts | Microsoft Docs
description: Introduction to key scenarios, capabilities, and concepts of the Azure API Management service. API Management supports the full API lifecycle.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''
 
ms.service: api-management
ms.topic: overview
ms.date: 06/27/2022
ms.author: danlep
ms.custom: mvc

robots: noindex
---

# What is Azure API Management?

This article provides an overview of common scenarios and key components of Azure API Management. Azure API Management is a hybrid, multicloud management platform for APIs across all environments. As a platform-as-a-service, API Management supports the complete API lifecycle.

> [!TIP]
> If you're already familiar with API Management and ready to start, see these resources:
> * [Features and service tiers](api-management-features.md)
> * [Create an API Management instance](get-started-create-service-instance.md)
> * [Import and publish an API](import-and-publish.md)
> * [API Management policies](api-management-howto-policies.md)

## Scenarios 

APIs enable digital experiences, simplify application integration, underpin new digital products, and make data and services reusable and universally accessible. ​With the proliferation and increasing dependency on APIs, organizations need to manage them as first-class assets throughout their lifecycle.​

:::image type="content" source="media/api-management-key-concepts-experiment/apis-connected-experiences.png" alt-text="Diagram showing role of APIs in connected experiences.":::


Azure API Management helps customers meet these challenges:

* Abstract backend architecture diversity and complexity from API consumers
* Securely expose services hosted on and outside of Azure as APIs
* Protect, accelerate, and observe APIs
* Enable API discovery and consumption by internal and external users

Common scenarios include:

* **Unlocking legacy assets** - APIs are used to abstract and modernize legacy backends and make them accessible from new cloud services and modern applications. APIs allow innovation without the risk, cost, and delays of migration.
* **API-centric app integration** - APIs are easily consumable, standards-based, and self-describing mechanisms for exposing and accessing data, applications, and processes. They simplify and reduce the cost of app integration.
* **Multi-channel user experiences** - APIs are frequently used to enable user experiences such as web, mobile, wearable, or Internet of Things applications. Reuse APIs to accelerate development and ROI.
* **B2B integration** - APIs exposed to partners and customers lower the barrier to integrate business processes and exchange data between business entities. APIs eliminate the overhead inherent in point-to-point integration. Especially with self-service discovery and onboarding enabled, APIs are the primary tools for scaling B2B integration.

## API Management components

Azure API Management is made up of an API *gateway*, a *management plane*, and a *developer portal*. These components are Azure-hosted and fully managed by default. API Management is available in various [tiers](api-management-features.md) differing in capacity and features.

:::image type="content" source="media/api-management-key-concepts-experiment/api-management-components.png" alt-text="Diagram showing key components of Azure API Management.":::

## API gateway

All requests from client applications first reach the API gateway, which then forwards them to respective backend services. The API gateway acts as a façade to the backend services, allowing API providers to abstract API implementations and evolve backend architecture without impacting API consumers. The gateway enables consistent configuration of routing, security, throttling, caching, and observability.

The API gateway:
  
  * Accepts API calls and routes them to configured backends
  * Verifies API keys, JWT tokens, certificates, and other credentials
  * Enforces usage quotas and rate limits
  * Optionally transforms requests and responses as specified in [policy statements](#policies)
  * If configured, caches responses to improve response latency and minimize the load on backend services
  * Emits logs, metrics, and traces for monitoring, reporting, and troubleshooting

### Self-hosted gateway
With the [self-hosted gateway](self-hosted-gateway-overview.md), customers can deploy the API gateway to the same environments where they host their APIs, to optimize API traffic and ensure compliance with local regulations and guidelines. The self-hosted gateway enables customers with hybrid IT infrastructure to manage APIs hosted on-premises and across clouds from a single API Management service in Azure.

The self-hosted gateway is packaged as a Linux-based Docker container and is commonly deployed to Kubernetes, including to Azure Kubernetes Service and [Azure Arc-enabled  Kubernetes](how-to-deploy-self-hosted-gateway-azure-arc.md). 

## Management plane

API providers interact with the service through the management plane, which provides full access to the API Management service capabilities. 

Customers interact with the management plane through Azure tools including the Azure portal, Azure PowerShell, Azure CLI, a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview), or client SDKs in several popular programming languages.

Use the management plane to:

  * Provision and configure API Management service settings
  * Define or import API schemas from a wide range of sources, including OpenAPI specifications, Azure compute services, or WebSocket or GraphQL backends
  * Package APIs into products
  * Set up [policies](#policies) like quotas or transformations on the APIs
  * Get insights from analytics
  * Manage users


## Developer portal

The open-source [developer portal][Developer portal] is an automatically generated, fully customizable website with the documentation of your APIs. 

:::image type="content" source="media/api-management-key-concepts-experiment/cover.png" alt-text="Screenshot of API Management developer portal - administrator mode." border="false":::

API providers can customize the look and feel of the developer portal by adding custom content, customizing styles, and adding their branding. Extend the developer portal further by [self-hosting](developer-portal-self-host.md).

App developers use the open-source developer portal to discover the APIs, onboard to use them, and learn how to consume them in applications. (APIs can also be exported to the [Power Platform](export-api-power-platform.md) for discovery and use by citizen developers.)

Using the developer portal, developers can:

  * Read API documentation
  * Call an API via the interactive console
  * Create an account and subscribe to get API keys
  * Access analytics on their own usage
  * Download API definitions
  * Manage API keys

## Integration with Azure services

API Management integrates with many complementary Azure services to create enterprise solutions, including:

* [Azure Key Vault](../key-vault/general/overview.md) for secure safekeeping and management of [client certificates](api-management-howto-mutual-certificates.md) and [secrets​](api-management-howto-properties.md)
* [Azure Monitor](api-management-howto-use-azure-monitor.md) for logging, reporting, and alerting on management operations, systems events, and API requests​
* [Application Insights](api-management-howto-app-insights.md) for live metrics, end-to-end tracing, and troubleshooting
* [Virtual networks](virtual-network-concepts.md), [private endpoints](private-endpoint.md), and [Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md) for network-level protection​
* Azure Active Directory for [developer authentication](api-management-howto-aad.md) and [request authorization](api-management-howto-protect-backend-with-aad.md)​
* [Event Hubs](api-management-howto-log-event-hubs.md) for streaming events​
* Several Azure compute offerings commonly used to build and host APIs on Azure, including [Functions](import-function-app-as-api.md), [Logic Apps](import-logic-app-as-api.md), [Web Apps](import-app-service-as-api.md), [Service Fabric](how-to-configure-service-fabric-backend.md), and others.​

**More information**:
* [Basic enterprise integration](/azure/architecture/reference-architectures/enterprise-integration/basic-enterprise-integration?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=/azure/api-management/breadcrumb/toc.json)
* [Landing zone accelerator](/azure/cloud-adoption-framework/scenarios/app-platform/api-management/landing-zone-accelerator?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=/azure/api-management/breadcrumb/toc.json)


## Key concepts

### APIs

APIs are the foundation of an API Management service instance. Each API represents a set of *operations* available to app developers. Each API contains a reference to the backend service that implements the API, and its operations map to backend operations. 

Operations in API Management are highly configurable, with control over URL mapping, query and path parameters, request and response content, and operation response caching. 

**More information**:
* [Import and publish your first API][How to create APIs]
* [Mock API responses][How to add operations to an API]

### Products

Products are how APIs are surfaced to developers. Products in API Management have one or more APIs, and can be *open* or *protected*. Protected products require a subscription key, while open products can be consumed freely. 

When a product is ready for use by developers, it can be published. Once published, it can be viewed or subscribed to by developers. Subscription approval is configured at the product level and can either require an administrator's approval or be automatic.

**More information**:
* [Create and publish a product][How to create and publish a product]
* [Subscriptions in API Management](api-management-subscriptions.md)

### Groups

Groups are used to manage the visibility of products to developers. API Management has the following built-in groups:

* **Administrators** -  Manage API Management service instances and create the APIs, operations, and products that are used by developers.

    Azure subscription administrators are members of this group. 

* **Developers** - Authenticated developer portal users that build applications using your APIs. Developers are granted access to the developer portal and build applications that call the operations of an API. 

* **Guests** - Unauthenticated developer portal users, such as prospective customers visiting the developer portal. They can be granted certain read-only access, such as the ability to view APIs but not call them.

Administrators can also create custom groups or use external groups in an [associated Azure Active Directory tenant](api-management-howto-aad.md) to give developers visibility and access to API products. For example, create a custom group for developers in a partner organization to access a specific subset of APIs in a product. A user can belong to more than one group.

**More information**: 
* [How to create and use groups][How to create and use groups]

### Developers

Developers represent the user accounts in an API Management service instance. Developers can be created or invited to join by administrators, or they can sign up from the [developer portal][Developer portal]. Each developer is a member of one or more groups, and can subscribe to the products that grant visibility to those groups.

When developers subscribe to a product, they're granted the primary and secondary key for the product for use when calling the product's APIs.

**More information**:
* [How to manage user accounts][How to create or invite developers]

### Policies

With [policies][API Management policies], an API publisher can change the behavior of an API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Popular statements include format conversion from XML to JSON and call-rate limiting to restrict the number of incoming calls from a developer. For a complete list, see [API Management policies][Policy reference].

Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise. Some policies such as the [Control flow](./choose-policy.md) and [Set variable](./set-variable-policy.md) policies are based on policy expressions. 

Policies can be applied at different scopes, depending on your needs: global (all APIs), a product, a specific API, or an API operation. 

**More information**:

* [Transform and protect your API][How to create and configure advanced product settings].
* [Policy expressions](./api-management-policy-expressions.md)

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
