---
title: Workspaces in Azure API Management | Microsoft Docs
description: Learn about Azure API Management workspaces. With workspaces, decentralized API development teams manage and productize APIs in a common service infrastructure.
services: api-management
author: dlepow
 
ms.service: api-management
ms.topic: conceptual
ms.date: 06/10/2024
ms.author: danlep
ms.custom:
---

# Workspaces in Azure API Management

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

In API Management, *workspaces* allow decentralized API development teams to manage and productize their own APIs, while a central API platform team maintains the API Management infrastructure. Each workspace in an API Management instance contains APIs, products, subscriptions, and related entities that are accessible only to the workspace collaborators. The workspace also has its own gateway for runtime API traffic. Access is controlled through Azure role-based access control (RBAC). 

> [!NOTE]
> For pricing considerations, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

## Example scenario overview

An organization that manages APIs using Azure API Management may have multiple development teams that develop, define, maintain, and productize different sets of APIs. Workspaces allow these teams to use API Management to manage, access, and secure their APIs separately, and independently of managing the service infrastructure.

The following is a sample workflow for creating and using a workspace.

1. A central API platform team that manages the API Management instance creates a workspace and assigns permissions to workspace collaborators using RBAC roles - for example, permissions to create or read resources in the workspace, or to create a workspace gateway.

1. A central API platform team uses DevOps tools to create a DevOps pipeline for APIs in that workspace. 

1. Workspace members develop, publish, productize, and maintain APIs in the workspace. They also manage their API runtime traffic using the workspace gateway.

1. The central API platform team manages the infrastructure of the service, such as monitoring, resiliency, and enforcement of all-APIs policies. 

## Workspace features

The following resources can be managed in workspaces.
 
### APIs and policies

* Create and manage APIs and API operations, including API version sets, API revisions, and API policies.

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

A dedicated gateway is created for each workspace, managed by the workspace collaborators and separate from the service gateway and other workspace gateways. The gateway is used to route API traffic to the backend services for the workspace APIs.

### Supported gateway features

* Optionally configure the workspace gateway in a private virtual network to isolate inbound and outbound traffic
* Monitor APIs with workspace-specific configuration
* Manage API backends and import APIs from Azure services 
* Support API types that are supported by the service gateway (except for GraphQL and WebSocket APIs)
* Validate client certificates 

### Gateway constraints

* A gateway can be associated only with one workspace
* A workspace can't be associated with a self-hosted gateway
* Workspace gateways need to be in the same Azure region and subscription as the API Management service
* Autoscale can't be configured on a workspace gateway
* APIs in workspaces aren't covered by Defender for APIs
* Workspace gateways don't support credential manager
* Workspace gateways support only internal cache; external cache isn't supported 

## RBAC roles 

Azure RBAC is used to configure workspace collaborators' permissions to read and edit entities in the workspace. For a list of roles, see [How to use role-based access control in API Management](api-management-role-based-access-control.md).

Workspace members must be assigned roles (or equivalent permissions using custom roles) scoped to the API Management service, the workspace, and the workspace gateway. The service-scoped role enables referencing certain service-level resources from workspace-level resources. For example, organize a user into a workspace-level group to control API and product visibility.  

> [!NOTE]
> For easier management, set up Microsoft Entra groups to assign workspace permissions to multiple users.
> 

## Workspaces and other API Management features
    
* **Resource references** - Resources in a workspace can reference other resources in the workspace and users from the service level. They can't reference resources from another workspace.

    For security reasons, it's not possible to reference service-level resources from workspace-level policies (for example, named values) or by resource names, such as `backend-id` in the [set-backend-service](set-backend-service-policy.md) policy. 

    > [!IMPORTANT]
    > All resources in an API Management service need to have unique names, even if they are located in different workspaces.
    > 

* **Managed identity** - You can't use service-level managed identities in a workspace. 

* **Developer portal** - Workspaces are an administrative concept and aren't surfaced as such to developer portal consumers, including through the developer portal UI and the underlying API. However, APIs and products can be published from a workspace to the developer portal. Because of this, any resource that's used by the developer portal (for example, an API, product, tag, or subscription) needs to have a unique Azure resource name in the service. There can't be any resources of the same type and with the same Azure resource name in the same workspace, in other workspaces, or on the service level.

    > [!NOTE]
    > Specifying API authorization server information (for example, for the developer portal) isn't supported in workspaces.
    >    

* **Deleting a workspace** - Deleting a workspace deletes all its child resources (APIs, products, and so on).
    

## Related content

* [Tutorial: Create a workspace](how-to-create-workspace.md)
* [Workspaces breaking changes - June 2024](breaking-changes/workspaces-breaking-changes-june-2024.md)
