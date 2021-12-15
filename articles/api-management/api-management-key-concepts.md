---
title: Azure API Management overview and key concepts | Microsoft Docs
description: Learn about key scenarios, capabilities, and concepts of the Azure API Management service.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''
 
ms.service: api-management
ms.topic: overview
ms.date: 12/14/2021
ms.author: danlep
ms.custom: mvc
---

# About API Management

Azure API Management is a hybrid, multicloud management platform for APIs across all environments. This article provides an overview of common scenarios and key components of API Management.

## Scenarios 

APIs enable digital experiences, simplify application integration, underpin new digital products, and make data and services reusable and universally accessible. ​With the proliferation and increasing dependency on APIs, organizations need to manage them as first-class assets throughout their lifecycle.​

Azure API Management helps customers meet these challenges:

* Securely expose services hosted on and outside of Azure as APIs
* Control, distribute, and observe APIs
* Enable API discovery and consumption by internal and external users

Common scenarios include:

* **Secure mobile infrastructure** by gating access with API keys, preventing denial of service attacks, or using advanced security policies like JWT token validation
* **Enable ISV partner ecosystems** by offering fast partner onboarding through the developer portal and building an API façade to decouple API consumption from internal implementations
* **Run an internal API program** by offering a centralized location to communicate about APIs, gate access based on organizational accounts, and provide a secure channel between the API gateway and the backend

## API Management components

Azure API Management is made up of an API *gateway*, a *management plane*, and a *developer portal*. These components are Azure-hosted and fully managed by default. Different capabilities are available in the API Management [service tiers](api-management-features.md).

:::image type="content" source="media/api-management-key-concepts/api-management-components.png" alt-text="Key components of Azure API Management":::

### API gateway

All requests from client applications first reach the API gateway, which forwards a valid request to a configured backend service. The API gateway acts as a façade to the backend services, allowing API providers to abstract API implementations and evolve backend architecture without impacting API consumers. The gateway enables consistent configuration of routing, security, throttling, caching, and observability.

The API gateway:
  
  * Accepts API calls and routes them to a wide range of backends
  * Verifies API keys, JWT tokens, certificates, and other credentials
  * Enforces usage quotas and rate limits
  * Can transform your API on the fly without code modifications
  * Can cache backend responses
  * Logs call metadata for troubleshooting and analysis

With the [self-hosted gateway](self-hosted-gateway-overview.md), customers can optionally deploy the API gateway to the same environments where they host their APIs, while optimizing API traffic and ensuring compliance with regulations and policies. The self-hosted gateway enables customers with hybrid IT infrastructure to manage APIs hosted on-premises and across clouds from a single API Management service in Azure.

The self-hosted gateway is packaged as a Linux-based Docker container and is commonly deployed to Kubernetes, including to Azure Kubernetes Service and [Azure Arc-enabled  Kubernetes](how-to-deploy-self-hosted-gateway-azure-arc.md). 

### Management plane

API providers interact with the service through the management plane, which provides full access to the API Management service capabilities. 

Customers interact with the management plane through Azure tools including the Azure portal, Azure PowerShell, Azure CLI, a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview), or client SDKs in several popular programming languages.

Use the management plane to:

  * Define or import API schemas from a wide range of sources, including OpenAPI specifications, Azure compute services, or WebSocket or GraphQL backends
  * Package APIs into products
  * Set up [policies](#policies) like quotas or transformations on the APIs
  * Get insights from analytics
  * Manage users


### Developer portal

App developers use the open-source [developer portal][Developer portal] to discover the APIs, onboard to use them, and learn how to consume them in applications. (APIs can also be exported to the [Power Platform](export-api-power-platform.md) for discovery and use by citizen developers.)

Using the developer portal, developers can:

  * Read API documentation
  * Call an API via the interactive console
  * Create an account and subscribe to get API keys
  * Access analytics on their own usage

Customize the look and feel of the developer portal by adding custom content, customizing styles, and adding your branding. Extend the developer portal further by [self-hosting](developer-portal-self-host.md).

## Integration with Azure services

API Management integrates with many complementary Azure services, including:

* [Azure Key Vault](../key-vault/general/overview.md) for secure safekeeping and management of [client certificates](api-management-howto-mutual-certificates.md) and [secrets​](api-management-howto-properties.md)
* [Azure Monitor](api-management-howto-use-azure-monitor.md) for logging, reporting, and alerting on management operations, systems events, and API requests​
* [Application Insights](api-management-howto-app-insights.md) for live metrics, end-to-end tracing, and troubleshooting
* [Virtual networks](virtual-network-concepts.md) and [Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md) for network-level protection​
* Azure Active Directory for [developer authentication](api-management-howto-aad.md) and [request authorization](api-management-howto-protect-backend-with-aad.md)​
* [Event Hub](api-management-howto-log-event-hubs.md) for streaming events​
* Several Azure compute offerings commonly used to build and host APIs on Azure, including [Functions](import-function-app-as-api.md), [Logic Apps](import-logic-app-as-api.md), [Web Apps](import-app-service-as-api.md), [Service Fabric](how-to-configure-service-fabric-backend.md), and others.​

## Key concepts

### APIs

APIs are the foundation of an API Management service instance. Each API represents a set of *operations* available to developers. Each API contains a reference to the backend service that implements the API, and its operations map to backend operations. 

Operations in API Management are highly configurable, with control over URL mapping, query and path parameters, request and response content, and operation response caching. Rate limit, quotas, and other policies can also be implemented at the API or individual operation level.

More information:
* [Import and publish your first API][How to create APIs]
* [Mock API responses][How to add operations to an API]

### Products

Products are how APIs are surfaced to developers. Products in API Management have one or more APIs, and can be *open* or *protected*. Protected products require a subscription, while open products can be used without a subscription. 

When a product is ready for use by developers, it can be published. Once published, it can be viewed or subscribed to by developers. Subscription approval is configured at the product level and can either require an administrator's approval or be automatic.

More information:
* [Create and publish a product][How to create and publish a product]

### Groups

Groups are used to manage the visibility of products to developers. API Management has the following built-in groups:

* **Administrators** -  Manage API Management service instances and create the APIs, operations, and products that are used by developers.

    Azure subscription administrators are members of this group. 

* **Developers** - Authenticated developer portal users that build applications using your APIs. Developers are granted access to the developer portal and build applications that call the operations of an API. 

* **Guests** - Unauthenticated developer portal users, such as prospective customers visiting the developer portal. They can be granted certain read-only access, such as the ability to view APIs but not call them.

Administrators can also create custom groups or use external groups in an [associated Azure Active Directory tenant](api-management-howto-aad.md) to give developers visibility and access to API products. For example, create a custom group for developers in a partner organization to access a specific subset of APIs in a product. A user can belong to more than one group.

More information: 
* [How to create and use groups][How to create and use groups]

### Developers

Developers represent the user accounts in an API Management service instance. Developers can be created or invited to join by administrators, or they can sign up from the [developer portal][Developer portal]. Each developer is a member of one or more groups, and can subscribe to the products that grant visibility to those groups.

When developers subscribe to a product, they are granted the primary and secondary key for the product for use when calling the product's APIs.

More information:
* [How to manage user accounts][How to create or invite developers]

### Policies

With [policies][API Management policies], an API publisher can change the behavior of an API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Popular statements include format conversion from XML to JSON and call-rate limiting to restrict the number of incoming calls from a developer. For a complete list, see [API Management policies][Policy reference].

Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise. Some policies such as the [Control flow](./api-management-advanced-policies.md#choose) and [Set variable](./api-management-advanced-policies.md#set-variable) policies are based on policy expressions. 

Policies can be applied at different scopes, depending on your needs: global (all APIs), a product, a specific API, or an API operation. 

More information:

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
