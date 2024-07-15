---
title: Workspaces in Azure API Management | Microsoft Docs
description: Learn about Azure API Management workspaces. With workspaces, decentralized API development teams manage and productize APIs in a common service infrastructure.
services: api-management
author: dlepow
 
ms.service: api-management
ms.topic: concept-article
ms.date: 07/10/2024
ms.author: danlep
#customer intent: As administrator of an API Management instance, I want to learn about using workspaces to manage APIs in a decentralized way, so that I can enable my development teams to manage and productize their own APIs.

---

# What are workspaces in Azure API Management?

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

In API Management, *workspaces* bring a new level of autonomy to an organization's API teams, enabling them to create, manage, and publish APIs faster, more reliably, securely, and productively within an API Management service. By providing isolated administrative access and API runtime, workspaces empower API teams while allowing the API platform team to retain oversight. This includes central monitoring, enforcement of API policies and compliance, and publishing APIs for discovery through a unified developer portal. 

[!INCLUDE [api-management-workspace-intro-note](../../includes/api-management-workspace-intro-note.md)]

Workspaces function like "folders" within an API Management service. Each workspace contains APIs, products, subscriptions, named values, and related resources. Access to resources within a workspace is managed through Azure's role-based access control (RBAC) with built-in or custom roles assignable to Microsoft Entra accounts. Each workspace has a dedicated API gateway for routing API traffic to the backend services of APIs in the workspace.

:::image type="content" source="media/workspaces-overview/workspace-concept.png" alt-text="Conceptual diagram of API Management service with workspaces.":::

## Federated API management with workspaces

Workspaces add first-class support for a *federated model* of managing APIs in API Management, in addition to already supported centralized and siloed models. See the following table for a comparison of these models.

|Model|Description  |
|---------|---------|
|**Centralized**<br/><br/>:::image type="content" source="media/workspaces-overview/centralized.png" alt-text="Diagram of the centralized model of Azure API Management." border="false" lightbox="media/workspaces-overview/centralized.png":::      |API teams work in a single platform without separation of permissions, workflows, or runtime.​<br/><br/>Prioritizes platform governance over agility and risks bottleneck at API gateway.     | 
|**Siloed**<br/><br/>:::image type="content" source="media/workspaces-overview/siloed.png"  alt-text="Diagram of the siloed model of Azure API Management." border="false" lightbox="media/workspaces-overview/siloed.png":::       |API teams own and operate in dedicated API Management services.​<br/><br/>Prioritizes team agility but complicates governance and discovery and may increase costs.​    |  
|**Federated**<br/><br/>:::image type="content" source="media/workspaces-overview/federated.png" alt-text="Diagram of the federated model of Azure API Management." border="false" lightbox="media/workspaces-overview/federated.png":::       |API teams own and publish their own APIs in a portion of a shared API Management service. API runtime is isolated from other teams.​ Platform team centrally administers the service, manages resiliency, and applies all-APIs policies.<br/><br/>Enables both team agility and platform governance.     |
 
## Example scenario overview

An organization that manages APIs using Azure API Management may have multiple development teams that develop, define, maintain, and productize different sets of APIs. Workspaces allow these teams to use API Management to manage, access, and secure their APIs separately, and independently of managing the service infrastructure.

The following is a sample workflow for creating and using a workspace.

1. A central API platform team that manages the API Management instance creates a workspace and assigns permissions to workspace collaborators using RBAC roles - for example, permissions to create or read resources in the workspace. A dedicated API gateway is also created for the workspace.

1. A central API platform team uses DevOps tools to create a DevOps pipeline for APIs in that workspace. 

1. Workspace members develop, publish, productize, and maintain APIs in the workspace. 

1. The central API platform team manages the infrastructure of the service, such as monitoring, resiliency, and enforcement of all-APIs policies. 

## API management in a workspace

The following resources can be managed in workspaces.
 
### APIs and policies

* Create and manage APIs and API operations, including API version sets, API revisions, and API policies.

* Manage API backends.

* Apply a policy for all APIs in a workspace. 

* Describe APIs with tags from the workspace level. 

* Define named values, policy fragments, and schemas for request and response validation for use in workspace-scoped policies. 

> [!NOTE]
> In a workspace, policy scopes are as follows:
> All APIs (service) > All APIs (workspace) > Product > API > API operation

### Users and groups

* Organize users (from the service level) into groups in a workspace. 

### Products and subscriptions

* Publish APIs with products. APIs in a workspace can only be part of a workspace-level product. Visibility can be configured based on user membership in a workspace-level or a service-level group. 

* Manage access to APIs with subscriptions. Subscriptions requested to an API or product within a workspace are created in that workspace. 

* Publish APIs and products with the developer portal. 

* Manage administrative email notifications related to resources in the workspace. 

## Workspace gateway

Each workspace has a dedicated API gateway for use by the workspace collaborators, with the same core functionality as the gateway built into your API Management service. The workspace gateway provides runtime isolation by routing API traffic only to the backend services for the workspace's APIs. 

The workspace gateway is a top-level Azure resource that's managed independently of the API Management instance and the gateways for other workspaces. Key features and constraints of workspace gateways are in the following sections. For a detailed comparison of API Management gateways, see [API Management gateways](api-management-gateways-overview.md).

### Gateway hostname

Each workspace gateway is configured with a default hostname for API traffic in the format `<workspace-name>.gateway.<region>.azure-api.net`. Currently, custom hostnames aren't supported for workspace gateways.

### Network isolation

A workspace gateway can optionally be configured in a private virtual network to isolate inbound and/or outbound traffic. If configured, the workspace gateway must use a dedicated subnet in the virtual network. 

For detailed requirements, see [Network resource requirements for workspace gateways](virtual-network-workspaces-resources.md).

[!INCLUDE [api-management-virtual-network-workspaces-alert](../../includes/api-management-virtual-network-workspaces-alert.md)]

### Scale capacity

Manage gateway capacity by manually adding or removing scale units, similar to the [units](upgrade-and-scale.md) that can be added to the API Management instance in certain service tiers. The costs of a workspace gateway are based on the number of units you select.

### Observability

* **Application Insights logging** - Enable Application Insights logging specifically for your workspace gateway and configure logging settings for the APIs in your workspace.

### Regional availability

Workspace gateways need to be in the same Azure region and subscription as the API Management service. Currently, workspace gateways are available in a subset of the regions where API Management is available.

### Gateway constraints
The following constraints currently apply to workspace gateways:

* A gateway can be associated only with one workspace
* A workspace can't be associated with a self-hosted gateway
* Workspace gateways don't support inbound private endpoints
* Workspace gateways can't be assigned custom hostnames
* APIs in workspaces aren't covered by Defender for APIs
* Workspace gateways don't support the API Management service's credential manager
* Workspace gateways support only internal cache; external cache isn't supported 
* Workspace gateways don't support synthetic GraphQL APIs and WebSocket APIs
* Workspace gateways don't support APIs created from Azure resources such as Azure OpenAI Service, App Service, Function Apps, and so on
* Request metrics can't be split by workspace in Azure Monitor; all workspace metrics are aggregated at the service level
* Azure Monitor logs are aggregated at the service level; workspace-level logs aren't available
* Workspace gateways don't support CA certificates
* Workspace gateways don't support autoscaling
* Workspace gateways don't support managed identities, including related features including storing secrets in Azure Key Vault and using the `authentication-managed-identity` policy

## RBAC roles for workspaces

Azure RBAC is used to configure workspace collaborators' permissions to read and edit entities in the workspace. For a list of roles, see [How to use role-based access control in API Management](api-management-role-based-access-control.md).

To manage APIs and other resources in the workspace, workspace members must be assigned roles (or equivalent permissions using custom roles) scoped to the API Management service, the workspace, and the workspace gateway. The service-scoped role enables referencing certain service-level resources from workspace-level resources. For example, organize a user into a workspace-level group to control API and product visibility.  

> [!NOTE]
> For easier management, set up Microsoft Entra groups to assign workspace permissions to multiple users.
> 

## Workspaces and other API Management features

Certain features of API Management aren't available in workspaces or have constraints:
    
* **Resource references** - Resources in a workspace can reference other resources in the workspace and users from the service level. They can't reference resources from another workspace.

    For security reasons, it's not possible to reference service-level resources from workspace-level policies (for example, named values) or by resource names, such as `backend-id` in the [set-backend-service](set-backend-service-policy.md) policy. 

    > [!IMPORTANT]
    > All resources in an API Management service (for example, APIs, products, tags, or subscriptions) need to have unique names, even if they are located in different workspaces. There can't be any resources of the same type and with the same Azure resource name in the same workspace, in other workspaces, or on the service level.
    > 

* **Managed identity** - To enhance the security of your API Management instance and workspaces, you can't use service-level managed identities in a workspace. 

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
