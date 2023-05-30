---
title: Workspaces in Azure API Management | Microsoft Docs
description: Learn about workspaces (preview) in Azure API Management. Workspaces allow decentralized API development teams to manage and productize their own APIs, while a central API platform team maintains the API Management infrastructure. 
services: api-management
documentationcenter: ''
author: dlepow
 
ms.service: api-management
ms.topic: conceptual
ms.date: 03/10/2023
ms.author: danlep
ms.custom:
---

# Workspaces in Azure API Management

In API Management, *workspaces* allow decentralized API development teams to manage and productize their own APIs, while a central API platform team maintains the API Management infrastructure. Each workspace contains APIs, products, subscriptions, and related entities that are accessible only to the workspace collaborators. Access is controlled through Azure role-based access control (RBAC). 

[!INCLUDE [api-management-availability-premium-dev-standard](../../includes/api-management-availability-premium-dev-standard.md)]


> [!NOTE]
> * Workspaces are a preview feature of API Management and subject to certain [limitations](#preview-limitations).
> * Workspaces are supported in API Management REST API version 2022-09-01-preview or later.
> * For pricing considerations, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).


## Example scenario overview

An organization that manages APIs using Azure API Management may have multiple development teams that develop, define, maintain, and productize different sets of APIs. Workspaces allow these teams to use API Management to manage and access their APIs separately, and independently of managing the service infrastructure.

The following is a sample workflow for creating and using a workspace.

1. A central API platform team that manages the API Management instance creates a workspace and assigns permissions to workspace collaborators using RBAC roles - for example, permissions to create or read resources in the workspace.

1. A central API platform team uses DevOps tools to create a DevOps pipeline for APIs in that workspace. 

1. Workspace members develop, publish, productize, and maintain APIs in the workspace. 

1. The central API platform team manages the infrastructure of the service, such as network connectivity, monitoring, resiliency, and enforcement of all-APIs policies. 

## Workspace features

The following resources can be managed in the workspaces preview.

### APIs and policies

* Create and manage APIs and API operations, including API version sets, API revisions, and API policies.

* Apply a policy for all APIs in a workspace. 

* Use `context.Api.Workspace` and `context.Product.Workspace` objects in workspace-scoped policies and in the all-APIs policy on the service level. 

* Describe APIs with tags from the workspace level or from the service level. 

* Define named values, policy fragments, and schemas for request and response validation for use in workspace-scoped policies. 

> [!NOTE]
> In a workspace, policy scopes are as follows:
> All APIs (service) > All APIs (workspace) > Product > API > API operation

### Users and groups

* Organize users (from the service level) into groups in a workspace. 

### Products and subscriptions

* Publish APIs with products. APIs in a workspace can be part of a service-level product or a workspace-level product. 

    * Workspace-level product -  Visibility can be configured based on user membership in a workspace-level or a service-level group. 

    * Service-level product - Visibility can be configured only for service-level groups. 

* Manage access to APIs with subscriptions. Subscriptions requested to an API or product within a workspace are created in that workspace. 

* Publish APIs and products with the developer portal. 

* Manage administrative email notifications related to resources in the workspace. 

## RBAC roles 

Azure RBAC is used to configure workspace collaborators' permissions to read and edit entities in the workspace. For a list of roles, see [How to use role-based access control in API Management](api-management-role-based-access-control.md).

Workspace members must be assigned both a service-scoped role and a workspace-scoped role, or granted equivalent permissions using custom roles. The service-scoped role enables referencing service-level resources from workspace-level resources. For example, publish an API from a workspace with a service-level product, assign a service-level tag to an API, or organize a user into a workspace-level group to control API and product visibility.  

> [!NOTE]
> For easier management, set up Azure AD groups to assign workspace permissions to multiple users.
> 

## Workspaces and other API Management features

* **Infrastructure features** - API Management platform infrastructure features are managed on the service level only, not at the workspace level. These features include:

    * Private network connectivity
    
    * API gateways, including scaling, locations, and self-hosted gateways
    
    
* **Resource references** - Resources in a workspace can reference other resources in the workspace and the following resources from the service level: products, tags, and users. They can't reference resources from another workspace. 

    For security reasons, it's not possible to reference service-level resources from workspace-level policies (for example, named values) or by resource names, such as `backend-id` in the [set-backend-service](set-backend-service-policy.md) policy.

* **Developer portal** - Workspaces are an administrative concept and aren't surfaced as such to developer portal consumers, including through the developer portal UI and the underlying API. However, APIs and products can be published from a workspace to the developer portal. Because of this, any resource that's used by the developer portal (for example, an API, product, tag, or subscription) needs to have a unique Azure resource name in the service. There can't be any resources of the same type and with the same Azure resource name in the same workspace, in other workspaces, or on the service level.

* **Deleting a workspace** - Deleting a workspace deletes all its child resources (APIs, products, and so on).

## Preview limitations 

The following resources aren't currently supported in workspaces: 

* Authorization servers

* Authorizations 

* Backends 

* Client certificates 

* Current DevOps tooling for API Management

* Diagnostics 

* Loggers 

* Synthetic GraphQL APIs

* User-assigned managed identity 

Therefore, the following sample scenarios aren't currently supported in workspaces: 

* Monitoring APIs with workspace-specific configuration

* Managing API backends and importing APIs from Azure services 

* Validating client certificates 

* Using the authorizations feature 

* Specifying API authorization server information (for example, for the developer portal)
   
Workspace APIs can't be published to self-hosted gateways.

All resources in an API Management service need to have unique names, even if they are located in different workspaces.

## Next steps

* [Create a workspace](how-to-create-workspace.md)