---
title: Workspaces in Azure API Management | Microsoft Docs
description: Learn about Azure API Management workspaces. With workspaces, decentralized API development teams manage and productize APIs in a common service infrastructure.
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 05/20/2026
ms.author: danlep
#customer intent: As administrator of an API Management instance, I want to learn about using workspaces to manage APIs in a decentralized way, so that I can enable my development teams to manage and productize their own APIs.
ms.custom:
  - build-2025
---

# Federated API management with workspaces

[!INCLUDE [api-management-availability-basicv2-standardv2-premium-premium-v2](../../includes/api-management-availability-basicv2-standardv2-premium-premiumv2.md)]

This article provides an overview of API Management *workspaces* and how they empower decentralized API development teams to manage and productize their APIs in a common service infrastructure. 

## Why should organizations federate API management?

Today, organizations increasingly face challenges in managing a proliferation of APIs. As the number of APIs and API development teams grows, so does the complexity of managing them. This complexity can lead to increased operational overhead, security risks, and reduced agility. On the one hand, organizations want to establish a centralized API infrastructure to ensure API governance, security, and compliance. On the other hand, they want their API teams to innovate and respond quickly to business needs, without the overhead of managing an API platform. 

A *federated* model of API management addresses these needs. Federated API management allows decentralized API management by development teams with appropriate isolation of control and data planes, while maintaining centralized governance, monitoring, and API discovery managed by an API platform team. This model overcomes the limitations of alternative approaches such as fully centralized API management by the platform team or siloed API management by each development team.

Federated API management provides:

* Centralized API governance and observability
* A unified developer portal for effective API discovery and onboarding
* Segregated administrative permissions between API teams, enhancing productivity and security
* Segregated API runtime between API teams, improving reliability, resiliency, and security

## How workspaces enable federated API management

In Azure API Management, use *workspaces* to implement federated API management. Workspaces function like "folders" within an API Management service:

* Each workspace contains APIs, products, subscriptions, named values, and related resources. See the API Management [REST API reference](/rest/api/apimanagement/workspace?view=rest-apimanagement-2023-09-01-preview&preserve-view=true) for a full list of resources and operations supported in workspaces.
* Teams' access to resources within a workspace is managed through Azure's role-based access control (RBAC) with built-in or custom roles assignable to Microsoft Entra accounts and scoped to a workspace. 
* Each workspace is associated with one or more gateways for routing API traffic to the backend services of APIs in the workspace. Depending on the service tier and your requirements, a workspace can use the service's default managed gateway or one or more [workspace gateways](#workspace-gateway). 
* The platform team can apply policies spanning APIs and products in workspaces to govern API runtime across the organization. A built-in [Azure Policy definition](policy-reference.md) (`API Management policies should inherit parent scope policies using <base/>`) lets you audit or enforce that these policies are applied across all workspace resources.
* The platform team can implement a centralized API discovery experience with a developer portal.
* Each workspace team can gather and analyze gateway resource logs to monitor their own workspace APIs, while the platform team has federated access to logs across all workspaces in the API Management service, providing oversight, security, and compliance across their API ecosystem.


:::image type="content" source="media/workspaces-overview/workspace-concept.png" alt-text="Conceptual diagram of API Management service with workspaces.":::

[!INCLUDE [api-management-workspace-intro-note](../../includes/api-management-workspace-intro-note.md)]

While workspaces are managed independently from the API Management service and other workspaces, by design they can reference selected service-level resources. See [Workspaces and other API Management features](#workspaces-and-other-api-management-features), later in this article.

## Example scenario overview

An organization that manages APIs by using Azure API Management might have multiple development teams that develop, define, maintain, and productize different sets of APIs. By using workspaces, these teams can use API Management to manage, access, and secure their APIs separately and independently of managing the service infrastructure.

The following workflow shows a sample process for creating and using a workspace.

1. A central API platform team that manages the API Management instance creates a workspace and assigns permissions to workspace collaborators by using RBAC roles. For example, assign permissions to create or read resources in the workspace. The team either creates or associates an API gateway with the workspace to route API traffic.

1. A central API platform team uses DevOps tools to create a DevOps pipeline for APIs in that workspace. 

1. Workspace members develop, publish, productize, and maintain APIs in the workspace. 

1. The central API platform team manages the infrastructure of the service, such as monitoring, resiliency, and enforcement of all-APIs policies. 

## Workspace gateway

Each workspace is configured with one or more gateways to enable runtime of APIs managed within the workspace. Depending on the service tier and your requirements, you can use the service's **default managed gateway** and/or one or more **workspace gateways** (separate gateway resources).

| Option | Availability | Benefits | Considerations |
|---|---|---|---|
| Default managed gateway | Currently only in v2 tiers | No extra gateway resource or cost; workspaces benefit from most capabilities of the default gateway including private endpoints if available in the service tier | Less isolation; all workspaces share the gateway's capacity and configuration |
| Workspace gateway | Premium, Basic v2, Standard v2, Premium v2 | Strong runtime isolation; independent scaling, hostname, and network configuration per workspace | Extra cost; longer deployment time|

### Default managed gateway

In the v2 tiers, you can configure a workspace to route API traffic through the service's default managed gateway, in addition to one or more separate workspace gateway resources. When a workspace uses the default managed gateway:

- API traffic routes through the service's default hostname (for example, `<service-name>.azure-api.net`).
- The workspace shares the gateway's capacity and configuration with other workspaces and service-level APIs.

> [!NOTE]
> You can configure a workspace to use the default managed gateway only in the v2 service tiers and through the [API Management Workspace - Create or Update](/rest/api/apimanagement/workspace/create-or-update) REST API.

### Workspace gateway

A workspace gateway is a standalone Azure resource (*workspace gateway premium*) with the same core functionality as the default managed gateway.

You manage workspace gateways independently from the API Management service and from each other. They allow for isolation of runtime between workspaces or use cases, which increases API reliability, resiliency, and security. They also enable attribution of runtime issues to workspaces.

* For information on the cost of workspace gateways, see [API Management pricing](https://aka.ms/apimpricing).
* For a detailed comparison of API Management gateways, see [API Management gateways overview](api-management-gateways-overview.md).

### Associate workspaces with a workspace gateway

 Depending on your organization's needs, you can associate one workspace or multiple workspaces with a workspace gateway. 

> [!NOTE]
> Associating multiple workspaces with a workspace gateway is available only for workspace gateways created after April 15, 2025. 

* A workspace gateway has certain configuration settings, such as virtual network, scale, and hostname, and allocated computing resources, including CPU, memory, and networking resources.
* All workspaces deployed on a gateway share the configuration and computing resources.
* Bugs in an API or anomalous traffic can cause exhaustion of these resources, which affects all workspaces on that gateway. In other words, the more workspaces you deploy on a gateway, the higher the risk that an API from one workspace experiences reliability problems caused by an API from another workspace.
* Monitor your workspace gateway's performance by using [built-in metrics](api-management-howto-use-azure-monitor.md#view-metrics-of-your-apis) for CPU and memory utilization. 

Consider reliability, security, and cost when choosing a deployment model for workspaces.

* **Assign a workspace to its own dedicated workspace gateway for mission-critical workloads** - To maximize API reliability and security, assign each mission-critical workspace to its own gateway, avoiding shared use with other workspaces.
* **Balance reliability, security, and cost** - Associate multiple workspaces with a workspace gateway (or, if applicable, the default managed gateway) to balance reliability, security, and cost for non-critical workloads. Distribute workspaces across at least two gateways to help prevent problems, such as resource exhaustion or configuration errors, from affecting all APIs within the organization.
* **Use distinct gateways for different use cases** - Group workspaces on a workspace gateway based on a use case or network requirements. For example, you can distinguish between internal and external APIs by assigning them to separate gateways, each with its own network configuration.
* **Prepare to quarantine troubled workspaces** - Use a proxy, such as Azure Application Gateway or Azure Front Door, in front of shared workspace gateways to simplify moving a workspace that's causing resource exhaustion to a different gateway. This approach prevents impact on other workspaces sharing the gateway.

> [!NOTE]
> * A workspace gateway needs to be in the same region as the API Management instance's primary Azure region and in the same subscription.
> * All workspaces associated with a workspace gateway must be in the same API Management instance.
> * You can associate up to 30 workspaces with a workspace gateway. Contact support to increase this limit.

<!-- Is this limit also valid for workspaces in Basic v2 and Standard v2 tiers? -->

### Workspace gateway hostname

Each workspace gateway provides a unique hostname for APIs managed in an associated workspace. Default hostnames follow the pattern `<gateway-name>-<hash>.gateway.<region>.azure-api.net`. Use the gateway hostname to route API requests to your workspace's APIs.

Currently, workspace gateways don't support custom hostnames. You can configure Azure Application Gateway or Azure Front Door with a custom hostname in front of a workspace gateway.

### Network isolation for workspace gateways

You can optionally configure a workspace gateway resource in a private virtual network to isolate inbound and outbound traffic. If you configure this isolation, the workspace gateway must use a dedicated subnet in the virtual network. 

For detailed requirements, see [Network resource requirements for workspace gateways](virtual-network-workspaces-resources.md).

[!INCLUDE [api-management-virtual-network-workspaces-alert](../../includes/api-management-virtual-network-workspaces-alert.md)]

### Scale capacity for workspace gateways

Manage the capacity of a dedicated workspace gateway by adding or removing scale units, similar to the [units](upgrade-and-scale.md) that you can add to the API Management instance in certain service tiers. The costs of a workspace gateway are based on the number of units you select.

### Regional availability of workspace gateways

For a current list of regions where workspace gateways are available, see [Availability of v2 tiers and workspace gateways](api-management-region-availability.md).

### Workspaces constraints

<!-- Need to clarify which of these are specific to workspace gateways vs. workspaces in general -->

* A workspace can't be associated with a self-hosted gateway
* Workspace gateways don't support inbound private endpoints
* APIs in workspace gateways can't be assigned custom hostnames
* APIs in workspaces aren't covered by Defender for APIs
* Workspace gateways don't support the API Management service's credential manager
* Workspace gateways support only internal cache; external cache isn't supported 
* Workspace gateways don't support synthetic GraphQL APIs
* Workspace gateways don't support creating APIs directly from Azure resources such as Azure OpenAI Service, App Service, Function Apps, and so on
* Workspace gateways don't support MCP servers
* Request metrics can't be split by workspace in Azure Monitor; all workspace metrics are aggregated at the service level
* Workspace gateways don't support CA certificates
* Workspace gateways don't support managed identities, including related features like storing secrets in Azure Key Vault and using the `authentication-managed-identity` policy

### Global policy inheritance in workspace gateways

Workspace gateways execute the full policy chain, including the service-level global policy (`global.policy.xml`). This behavior means that any policies defined at the global scope are evaluated and executed for API calls processed by workspace gateways, just as they are for the default gateway. This behavior is by design and consistent with the API Management policy evaluation model, where you apply policies hierarchically at the following [scopes](api-management-howto-policies.md#scopes): global (service) > workspace > product > API > operation.

##### Recommendations for global policies with workspace gateways

- Review your global policy to ensure it contains only policies intended to apply across all gateways, including workspace gateways.

- If you need different behavior per gateway, use the [choose](choose-policy.md) policy with `context.Deployment.Gateway.Id` to conditionally execute policies based on the gateway processing the request.

- If you define an [authentication-managed-identity](authentication-managed-identity-policy.md) at the global scope but the token shouldn't be available to workspace-scoped APIs, move the policy to a narrower scope (for example, product or API level) rather than the global policy. 

## RBAC roles for workspaces

Azure RBAC is used to configure workspace collaborators' permissions to read and edit entities in the workspace. For a list of roles, see [How to use role-based access control in API Management](api-management-role-based-access-control.md).

To manage APIs and other resources in the workspace, assign roles to workspace members (or equivalent permissions through custom roles) that are scoped to the API Management service and the workspace. The service-scoped role enables referencing certain service-level resources from workspace-level resources. For example, organize a user into a workspace-level group to control API and product visibility.

If the workspace uses a dedicated workspace gateway, members who manage the gateway should also be assigned a role scoped to the workspace gateway resource.  

> [!NOTE]
> For easier management, set up Microsoft Entra groups to assign workspace permissions to multiple users.
> 

## Workspaces and other API Management features

Workspaces are self-contained to maximize segregation of administrative access and API runtime. To ensure higher productivity and enable platform-wide governance, observability, reusability, and API discovery, several exceptions exist.

    
* **Resource references** - Resources in a workspace can reference other resources in the workspace and selected resources from the service level, such as users, authorization servers, or built-in user groups. They can't reference resources from another workspace.

    For security reasons, you can't reference service-level resources from workspace-level policies (for example, named values) or by resource names, such as `backend-id` in the [set-backend-service](set-backend-service-policy.md) policy. 

    > [!IMPORTANT]
    > All resources in an API Management service (for example, APIs, products, tags, or subscriptions) need to have unique names, even if they're located in different workspaces. You can't have resources of the same type and with the same Azure resource name in the same workspace, in other workspaces, or on the service level.
    >  

* **Developer portal** - Workspaces are an administrative concept and aren't surfaced as such to developer portal consumers, including through the developer portal UI and the underlying API. You can publish APIs and products within a workspace to the developer portal, just like APIs and products on the service level.  

    > [!NOTE]
    > API Management supports assigning authorization servers defined on the service level to APIs within workspaces.
    >    

## Migrate from preview workspaces

If you created preview workspaces in Azure API Management and want to continue using them, migrate your workspaces to the generally available version by associating a workspace gateway with each workspace.

For details and to learn about other changes that could affect your preview workspaces, see [Workspaces breaking changes (March 2025)](breaking-changes/workspaces-breaking-changes-march-2025.md).

## Deleting a workspace

When you delete a workspace by using the Azure portal interface, you also delete all its child resources (APIs, products, and so on) and a dedicated workspace gateway if one is associated. It doesn't delete the API Management instance or other workspaces.
    

## Related content

* [Create a workspace](how-to-create-workspace.md)
* [Workspaces breaking changes - June 2024](breaking-changes/workspaces-breaking-changes-june-2024.md)
* [Workspaces breaking changes - March 2025](breaking-changes/workspaces-breaking-changes-march-2025.md)
* [Limits - API Management workspaces](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-management/toc.json&bc=/azure/api-management/breadcrumb/toc.json#limits---api-management-workspaces)
