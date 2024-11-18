---
title: Azure role-based access control
titleSuffix: Microsoft Dev Box
description: Learn how Microsoft Dev Box provides protection with Azure role-based access control (Azure RBAC) integration.
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: concept-article
ms.date: 07/31/2024

#Customer intent: As a platform engineer, I want to understand how to assign permissions in Dev Box so that I can give dev managers and developers only the permissions they need.
---
# Azure role-based access control in Microsoft Dev Box

This article describes the different built-in roles that Microsoft Dev
Box supports, and how they map to organizational roles like platform
engineer and dev manager.

Azure role-based access control (RBAC) specifies built-in role
definitions that outline the permissions to be applied. You assign a
user or group this role definition via a role assignment for a
particular scope. The scope can be an individual resource, a resource
group, or across the subscription. In the next section, you learn which
[built-in roles](#built-in-roles) Microsoft Dev Box supports.

For more information, see [What is Azure role-based access control (Azure RBAC)](https://microsoft-my.sharepoint.com/azure/role-based-access-control/overview)?

> [!Note]
> When you make role assignment changes, it can take a few minutes for these updates to propagate.

## Built-in roles

In this article, the Azure built-in roles are logically grouped into
three organizational role types, based on their scope of influence:

-   Platform engineer roles: influence permissions for dev centers,
    catalogs, and projects

-   Dev manager: influence permissions for project-based resources

-   Developer roles: influence permissions for users

The following are the built-in roles supported by Microsoft Dev Box:

| Organizational role type | Built-in role         | Description                                                                                       |
|--------------------------|-----------------------|---------------------------------------------------------------------------------------------------|
| Platform engineer        | Owner                 | Grant full control to create/manage dev centers, catalogs, and projects, and grant permissions to other users. Learn more about the [Owner role](#owner-role). |
| Platform engineer        | Contributor           | Grant full control to create/manage dev centers, catalogs, and projects, except for assigning roles to other users. Learn more about the [Contributor role](#contributor-role). |
| Dev Manager              | DevCenter Project Admin | Grant permission to manage certain aspects of projects and dev boxes. Learn more about the [DevCenter Project Admin role](#devcenter-project-admin-role). |
| Developer                | Dev Box User          | Grant permission to create dev boxes and have full control over the dev boxes that they create. Learn more about the [Dev Box User role](#dev-box-user). |

## Role assignment scope

In Azure RBAC, *scope* is the set of resources that access applies to.
When you assign a role, it\'s important to understand scope so that you
grant just the access that is needed.

In Azure, you can specify a scope at four levels: management group,
subscription, resource group, and resource. Scopes are structured in a
parent-child relationship. Each level of hierarchy makes the scope more
specific. You can assign roles at any of these levels of scope. The
level you select determines how widely the role is applied. Lower levels
inherit role permissions from higher levels. Learn more about [scope for Azure RBAC](https://microsoft-my.sharepoint.com/azure/role-based-access-control/scope-overview).

For Microsoft Dev Box, consider the following scopes:

  | Scope           | Description                                                                                       |
  |-----------------|---------------------------------------------------------------------------------------------------|
  | Subscription    | Used to manage billing and security for all Azure resources and services. Typically, only Platform engineers have subscription-level access because this role assignment grants access to all resources in the subscription. |
  | Resource group  | A logical container for grouping together resources. Role assignment for the resource group grants permission to the resource group and all resources within it, such as dev centers, dev box definitions, dev box pools, projects, and dev boxes. |
  | Dev center (resource) | A collection of projects that require similar settings. Role assignment for the dev center grants permission to the dev center itself. Permissions assigned for the dev centers aren't inherited by other dev box resources. |
  | Project (resource) | An Azure resource used to apply common configuration settings when you create a dev box. Role assignment for the project grants permission only to that specific project. |
  | Dev box pool (resource) | A collection of dev boxes that you manage together and to which you apply similar settings. Role assignment for the dev box pool grants permission only to that specific dev box pool. |
  | Dev box definition (resource) | An Azure resource that specifies a source image and size, including compute size and storage size. Role assignment for the dev box definition grants permission only to that specific dev box definition. |

:::image type="content" source="media/concept-dev-box-role-based-access-control/dev-box-scopes.png" lightbox="media/concept-dev-box-role-based-access-control/dev-box-scopes.png" alt-text="Diagram that shows the role assignment scopes for Microsoft Dev Box.":::

## Roles for common Dev Box activities

The following table shows common Dev Box activities and the role needed for a user to perform that activity.

| Activity                                                                                                              | Role type        | Role                                      | Scope          |
|-----------------------------------------------------------------------------------------------------------------------|------------------|-------------------------------------------|----------------|
| Grant permission to create a resource group.                                                                          | Platform engineer| Owner or Contributor                      | Subscription   |
| Grant permission to submit a Microsoft support ticket, including to request capacity.                                 | Platform engineer| Owner, Contributor, Support Request Contributor | Subscription   |
| Grant permission to create virtual networks and subnets.                                                              | Platform engineer| Network Contributor                       | Resource group |
| Grant permission to create a network connection.                                                                      | Platform engineer| Owner or Contributor                      | Resource group |
| Grant permission to assign roles to other users.                                                                      | Platform engineer| Owner                                     | Resource group |
| Grant permission to: </br> - Create / manage dev centers. </br> - Add / remove network connections. </br> - Add / remove Azure compute galleries. </br> - Create / manage dev box definitions. </br> - Create / manage projects. </br> - Attach / manage catalog to a dev center or project (project-level catalogs must be enabled on the dev center). </br> - Configure dev box limits. | Platform engineer| Contributor                               | Resource group |
| Grant permission to add or remove a network connection for a dev center.                                              | Platform engineer| Contributor                               | Dev center     |
| Grant permission to enable / disable project catalogs.                                                                | Dev Manager      | Contributor                               | Dev center     |
| Grant permission to: </br> - Add, sync, remove catalog (project-level catalogs must be enabled on the dev center). </br> - Create dev box pools. </br> - Stop, start, delete dev boxes in pools. | Dev Manager      | DevCenter Project Admin                   | Project        |
| Create and manage your own dev boxes in a project.                                                                    | User             | Dev Box User                              | Project        |
| Create and manage catalogs in a GitHub or Azure Repos repository.                                                     | Dev Manager      | Not governed by RBAC. </br> - The user must be assigned permissions through Azure DevOps or GitHub. | Repository     |

> [!Important] 
> An organization's subscription is used to manage billing and security for all Azure resources and services. You
> can assign the Owner or Contributor role on the subscription.
> Typically, only Platform engineers have subscription-level access because this includes full access to all resources in the subscription.

## Platform engineer roles

To grant users permission to manage Microsoft Dev Box within your
organization's subscription, you should assign them the
[Owner](#owner-role) or [Contributor](#contributor-role) role.

Assign these roles to the *resource group*. The dev centers, network
connections, dev box definitions, dev box pools, and projects within the
resource group inherit these role assignments.

:::image type="content" source="media/concept-dev-box-role-based-access-control/dev-box-administrator-scope.png" lightbox="media/concept-dev-box-role-based-access-control/dev-box-administrator-scope.png" alt-text="Diagram that shows the administrator role assignments at the subscription for Azure Deployment Environments.":::

### Owner role

Assign the Owner role to give a user full control to create or manage
Dev Box resources and grant permissions to other users. When a user has
the Owner role in the resource group, they can do the following
activities across all resources within the resource group:

-   Assign roles to platform engineers, so they can manage Dev Box
    resources.

-   Create dev centers, network connections, dev box definitions, dev
    box pools, and projects.

-   View, delete, and change settings for all dev centers, network
    connections, dev box definitions, dev box pools, and projects.

-   Attach and detach catalogs.

> [!Caution]
> When you assign the Owner or Contributor role on the resource group, then these permissions also apply to non-Dev Box related resources that exist in the resource group.

### Contributor role

Assign the Contributor role to give a user full control to create or
manage dev centers and projects within a resource group. The Contributor
role has the same permissions as the Owner role, *except* for:

-   Performing role assignments.

## Dev Manager role

There's one dev manager role: DevCenter Project Admin. This role has
more restricted permissions at lower-level scopes than the platform
engineer roles. You can assign this role to dev managers to enable them
to perform administrative tasks for their team.

:::image type="content" source="media/concept-dev-box-role-based-access-control/dev-box-project-scope.png" lightbox="media/concept-dev-box-role-based-access-control/dev-box-project-scope.png" alt-text="Diagram that shows the dev manager role assignment at the project level scopes for Microsoft Dev Box.":::

### DevCenter Project Admin role

Assign the DevCenter Project Admin to enable:

-   Add, sync, remove catalog (project-level catalogs must be enabled on
    the dev center).

-   Create dev box pools.

-   Stop, start, delete dev boxes in pools.

## Developer role

There's one developer role: Dev Box User. This role enables developers
to create and manage their own dev boxes.

:::image type="content" source="media/concept-dev-box-role-based-access-control/dev-box-user-scope.png" lightbox="media/concept-dev-box-role-based-access-control/dev-box-user-scope.png" alt-text="Diagram that shows the user role assignments at the project for Microsoft Dev Box.":::

### Dev Box User

Assign the Dev Box User role to give users permission to create dev
boxes and have full control over the dev boxes that they create.
Developers can perform the following actions on any dev box they create:

-   Create
-   Start / stop
-   Restart
-   Delay scheduled shutdown
-   Delete

## Identity and access management (IAM)

The **Access control (IAM)** page in the Azure portal is used to
configure Azure role-based access control on Microsoft Dev Box
resources. You can use built-in roles for individuals and groups in
Active Directory. The following screenshot shows Active Directory
integration (Azure RBAC) using access control (IAM) in the Azure portal:

:::image type="content" source="media/concept-dev-box-role-based-access-control/access-control-page.png" alt-text="Screenshot that shows the Access control (IAM) page for a dev center.":::

For detailed steps, see [Assign Azure roles using the Azure portal](https://microsoft-my.sharepoint.com/azure/role-based-access-control/role-assignments-portal).

## Dev center, resource group, and project structure

Your organization should invest time up front to plan the placement of
your dev centers, and the structure of resource groups and projects.

**Dev centers:** Organize dev centers by the set of projects you would
like to manage together, applying similar settings, and providing
similar templates.

Organizations can use one or more dev center. Typically, each sub-organization within the organization has its own dev center. You might consider creating multiple dev centers in the following cases:

-   If you want specific configurations to be available to a subset of
    projects.

-   If different teams need to own and maintain the dev center resource
    in Azure.

**Projects:** Associated with each dev team or group of people working
on one app or product.

Planning is especially important when you assign roles to the resource
group because it also applies permissions to all resources in the
resource group, including dev centers, network connections, dev box
definitions, dev box pools, and projects.

To ensure that users are only granted permission to the appropriate
resources:

-   Create resource groups that only contain Dev Box resources.

-   Organize projects according to the dev box definition and dev box
    pools required and the developers who should have access. It\'s
    important to note that dev box pools determine the location of dev
    box creation. Developers should create dev boxes in a location close
    to them for the least latency.

For example, you might create separate projects for different developer
teams to isolate each team's resources. Dev Managers in a project can
then be assigned to the Project Admin role, which only grants them
access to the resources of their team.

> [!Important] 
> Plan the structure upfront because it's not possible to move Dev Box resources like projects to a different resource group after they\'re created.

## Catalog structure

Microsoft Dev Box uses catalogs to enable developers to deploy
customizations for dev boxes by using a catalog of tasks and a
configuration file to install software, add extensions, clone
repositories, and more. 

Microsoft Dev Box stores catalogs in either a [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/about-repositories) or an [Azure DevOps Services repository](/azure/devops/repos/get-started/what-is-repos). You can attach a catalog to a dev center or to a project.

You can attach one or more catalogs to your dev center and manage all
customizations at that level. To provide more granularity in how
developers access customizations, you can attach catalogs at the project
level. In planning where to attach catalogs, you should consider the
needs of each development team.

## Related content

-   [What is Azure role-based access control (Azure RBAC)](https://microsoft-my.sharepoint.com/azure/role-based-access-control/overview)
-   [Understand scope for Azure RBAC](https://microsoft-my.sharepoint.com/azure/role-based-access-control/scope-overview)
