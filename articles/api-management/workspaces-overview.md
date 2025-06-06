---
title: Workspaces in Azure API Management | Microsoft Docs
description: Learn about Azure API Management workspaces. With workspaces, decentralized API development teams manage and productize APIs in a common service infrastructure.
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 06/03/2025
ms.author: danlep
#customer intent: As administrator of an API Management instance, I want to learn about using workspaces to manage APIs in a decentralized way, so that I can enable my development teams to manage and productize their own APIs.
ms.custom:
  - build-2025
---

# Federated API management with workspaces

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

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
* Each workspace is associated with one or more [workspace gateways](#workspace-gateway) for routing API traffic to the backend services of APIs in the workspace.
* The platform team can apply API policies spanning APIs in workspaces and implement a centralized API discovery experience with a developer portal.
* Each workspace team can gather and analyze gateway resource logs to monitor their own workspace APIs, while the platform team has federated access to logs across all workspaces in the API Management service, providing oversight, security, and compliance across their API ecosystem.


:::image type="content" source="media/workspaces-overview/workspace-concept.png" alt-text="Conceptual diagram of API Management service with workspaces.":::

[!INCLUDE [api-management-workspace-intro-note](../../includes/api-management-workspace-intro-note.md)]

While workspaces are managed independently from the API Management service and other workspaces, by design they can reference selected service-level resources. See [Workspaces and other API Management features](#workspaces-and-other-api-management-features), later in this article.

## Example scenario overview

An organization that manages APIs using Azure API Management may have multiple development teams that develop, define, maintain, and productize different sets of APIs. Workspaces allow these teams to use API Management to manage, access, and secure their APIs separately, and independently of managing the service infrastructure.

The following is a sample workflow for creating and using a workspace.

1. A central API platform team that manages the API Management instance creates a workspace and assigns permissions to workspace collaborators using RBAC roles - for example, permissions to create or read resources in the workspace. A workspace-scoped API gateway is also created for the workspace.

1. A central API platform team uses DevOps tools to create a DevOps pipeline for APIs in that workspace. 

1. Workspace members develop, publish, productize, and maintain APIs in the workspace. 

1. The central API platform team manages the infrastructure of the service, such as monitoring, resiliency, and enforcement of all-APIs policies. 

## Workspace gateway

Each workspace is configured with one or more *workspace gateways* to enable runtime of APIs managed within the workspace. A workspace gateway is a standalone Azure resource (*workspace gateway premium*) with the same core functionality as the gateway built into your API Management service. 

Workspace gateways are managed independently from the API Management service and from each other. They allow for isolation of runtime between workspaces or use cases, increasing API reliability, resiliency, and security and enabling attribution of runtime issues to workspaces. 

* For information on the cost of workspace gateways, see [API Management pricing](https://aka.ms/apimpricing).
* For a detailed comparison of API Management gateways, see [API Management gateways overview](api-management-gateways-overview.md).

### Associate workspaces with a workspace gateway

 Depending on your organization's needs, you can associate one workspace or multiple workspaces with a workspace gateway. 

> [!NOTE]
> Associating multiple workspaces with a workspace gateway is available only for workspace gateways created after April 15, 2025. 

* A workspace gateway has certain configuration (such as virtual network, scale, hostname) and allocated computing resources (CPU, memory, networking resources).
* Configuration and computing resources are shared by all workspaces deployed on a gateway.
* Bugs in an API or anomalous traffic may cause exhaustion of these resources, affecting all workspaces on that gateway. In other words, the more workspaces are deployed on a gateway, the higher the risk that an API from a workspace will experience reliability issues caused by an API from another workspace.
* Monitor your gateway's performance using [built-in metrics](api-management-howto-use-azure-monitor.md#view-metrics-of-your-apis) for CPU and memory utilization. 

Consider reliability, security, and cost when choosing a deployment model for workspaces.

* **Use dedicated gateways for mission-critical workloads** - To maximize API reliability and security, assign each mission-critical workspace to its own gateway, avoiding shared use with other workspaces.
* **Balance reliability, security, and cost** - Associate multiple workspaces with a gateway to balance reliability, security, and cost for non-critical workloads. Distributing workspaces across at least two gateways helps prevent issues, such as resource exhaustion or configuration errors, from impacting all APIs within the organization.
* **Use distinct gateways for different use cases** - Group workspaces on a gateway based on a use case or network requirements. For instance, you can distinguish between internal and external APIS by assigning them to separate gateways, each with its own network configuration.
* **Prepare to quarantine troubled workspaces** - Use a proxy, such as Azure Application Gateway or Azure Front Door, in front of shared workspace gateways to simplify moving a workspace that's causing resource exhaustion to a different gateway, preventing impact on other workspaces sharing the gateway.

> [!NOTE]
> * A workspace gateway needs to be in the same region as the API Management instance's primary Azure region and in the same subscription
> * All workspaces associated with a workspace gateway must be in the same API Management instance
> * A workspace gateway can be associated with up to 30 workspaces (contact support to increase this limit)

### Gateway hostname

Each workspace gateway provides a unique hostname for APIs managed in an associated workspace. Default hostnames follow the pattern `<gateway-name>-<hash>.gateway.<region>.azure-api.net`. Use the gateway hostname to route API requests to your workspace's APIs.

Currently, custom hostnames aren't supported for workspace gateways. You can configure Azure Application Gateway or Azure Front Door with a custom hostname in front of a workspace gateway.

### Network isolation

A workspace gateway can optionally be configured in a private virtual network to isolate inbound and/or outbound traffic. If configured, the workspace gateway must use a dedicated subnet in the virtual network. 

For detailed requirements, see [Network resource requirements for workspace gateways](virtual-network-workspaces-resources.md).

[!INCLUDE [api-management-virtual-network-workspaces-alert](../../includes/api-management-virtual-network-workspaces-alert.md)]

### Scale capacity

Manage gateway capacity by adding or removing scale units, similar to the [units](upgrade-and-scale.md) that can be added to the API Management instance in certain service tiers. The costs of a workspace gateway are based on the number of units you select.

### Regional availability

For a current list of regions where workspace gateways are available, see [Availability of v2 tiers and workspace gateways](api-management-region-availability.md).

### Gateway constraints
The following constraints currently apply to workspace gateways:

* A workspace can't be associated with a self-hosted gateway
* Workspace gateways don't support inbound private endpoints
* APIs in workspace gateways can't be assigned custom hostnames
* APIs in workspaces aren't covered by Defender for APIs
* Workspace gateways don't support the API Management service's credential manager
* Workspace gateways support only internal cache; external cache isn't supported 
* Workspace gateways don't support synthetic GraphQL APIs
* Workspace gateways don't support creating APIs directly from Azure resources such as Azure OpenAI Service, App Service, Function Apps, and so on
* Request metrics can't be split by workspace in Azure Monitor; all workspace metrics are aggregated at the service level
* Workspace gateways don't support CA certificates
* Workspace gateways don't support managed identities, including related features like storing secrets in Azure Key Vault and using the `authentication-managed-identity` policy

## RBAC roles for workspaces

Azure RBAC is used to configure workspace collaborators' permissions to read and edit entities in the workspace. For a list of roles, see [How to use role-based access control in API Management](api-management-role-based-access-control.md).

To manage APIs and other resources in the workspace, workspace members must be assigned roles (or equivalent permissions using custom roles) scoped to the API Management service, the workspace, and the workspace gateway. The service-scoped role enables referencing certain service-level resources from workspace-level resources. For example, organize a user into a workspace-level group to control API and product visibility.  

> [!NOTE]
> For easier management, set up Microsoft Entra groups to assign workspace permissions to multiple users.
> 

## Workspaces and other API Management features

Workspaces are designed to be self-contained to maximize segregation of administrative access and API runtime. There are several exceptions to ensure higher productivity and enable platform-wide governance, observability, reusability, and API discovery.

    
* **Resource references** - Resources in a workspace can reference other resources in the workspace and selected resources from the service level, such as users, authorization servers, or built-in user groups. They can't reference resources from another workspace.

    For security reasons, it's not possible to reference service-level resources from workspace-level policies (for example, named values) or by resource names, such as `backend-id` in the [set-backend-service](set-backend-service-policy.md) policy. 

    > [!IMPORTANT]
    > All resources in an API Management service (for example, APIs, products, tags, or subscriptions) need to have unique names, even if they're located in different workspaces. There can't be any resources of the same type and with the same Azure resource name in the same workspace, in other workspaces, or on the service level.
    >  

* **Developer portal** - Workspaces are an administrative concept and aren't surfaced as such to developer portal consumers, including through the developer portal UI and the underlying API. APIs and products within a workspace can be published to the developer portal, just like APIs and products on the service level.  

    > [!NOTE]
    > API Management supports assigning authorization servers defined on the service level to APIs within workspaces.
    >    

## Migrate from preview workspaces

If you created preview workspaces in Azure API Management and want to continue using them, migrate your workspaces to the generally available version by associating a workspace gateway with each workspace.

For details and to learn about other changes that could affect your preview workspaces, see [Workspaces breaking changes (March 2025)](breaking-changes/workspaces-breaking-changes-march-2025.md).

## Deleting a workspace

Deleting a workspace deletes all its child resources (APIs, products, and so on) and its associated gateway, if you're deleting the workspace using the Azure portal interface. It doesn't delete the API Management instance or other workspaces.
    

## Related content

* [Create a workspace](how-to-create-workspace.md)
* [Workspaces breaking changes - June 2024](breaking-changes/workspaces-breaking-changes-june-2024.md)
* [Workspaces breaking changes - March 2025](breaking-changes/workspaces-breaking-changes-march-2025.md)
* [Limits - API Management workspaces](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-management/toc.json&bc=/azure/api-management/breadcrumb/toc.json#limits---api-management-workspaces)
