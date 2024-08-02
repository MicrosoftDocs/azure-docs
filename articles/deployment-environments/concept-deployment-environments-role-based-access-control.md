---
title: Azure role-based access control
titleSuffix: Azure Deployment Environments
description: Learn how Azure Deployment Environments provides protection with Azure role-based access control (Azure RBAC) integration.
services: lab-services
ms.service: azure-lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: concept-article
ms.date: 07/27/2024

#Customer intent: As a platform engineer, I want to understand how to assign permissions in ADE so that I can give dev managers and developers only the permissions they need.
---
# Azure role-based access control in Azure Deployment Environments

This article describes the different built-in roles that Azure Deployment Environments supports, and how they map to organizational roles like platform engineer and dev manager.

Azure role-based access control (RBAC) specifies built-in role definitions that outline the permissions to be applied. You assign a user or group this role definition via a role assignment for a particular scope. The scope can be an individual resource, a resource group, or across the subscription. In the next section, you learn which built-in roles Azure Deployment Environments supports.

For more information, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

> [!NOTE]
>  When you make role assignment changes, it can take a few minutes for these updates to propagate.

## Built-in roles

In this article, the Azure built-in roles are logically grouped into three organizational role types, based on their scope of influence:

- Platform engineer roles: influence permissions for dev centers, catalogs, and projects
- Dev Manager: influence permissions for project-based resources
- Developer roles: influence permissions for users

The following are the built-in roles supported by Azure Deployment Environments:

| **Organizational role type** | **Built-in role** | **Description** |
|---|---|---|
| Platform engineer | Owner | Grant full control to create/manage dev centers, catalogs, and projects, and grant permissions to other users. Learn more about the [Owner role](#owner-role). |
| Platform engineer | Contributor | Grant full control to create/manage dev centers, catalogs, and projects, except for assigning roles to other users. Learn more about the [Contributor role](#contributor-role). |
| Dev Manager | DevCenter Project Admin | Grant permission to manage certain aspects of projects and environments. Learn more about the [DevCenter Project Admin role](#devcenter-project-admin-role). |
| Developer | Deployment Environments Reader | Grant permission to view all environments in a project. Learn more about the [Deployment Environments Reader role](#deployment-environments-reader). |
| Developer | Deployment Environments User | Grant permission to create environments and have full control over the environments that they create. Learn more about the [Deployment Environments User role](#deployment-environments-user). |

## Role assignment scope

In Azure RBAC, *scope* is the set of resources that access applies to. When you assign a role, it's important to understand scope so that you grant just the access that is needed.

In Azure, you can specify a scope at four levels: management group, subscription, resource group, and resource. Scopes are structured in a parent-child relationship. Each level of hierarchy makes the scope more specific. You can assign roles at any of these levels of scope. The level you select determines how widely the role is applied. Lower levels inherit role permissions from higher levels. Learn more about [scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

For Azure Deployment Environments, consider the following scopes:

| **Scope** | **Description** |
|---|---|
| Subscription | Used to manage billing and security for all Azure resources and services. Typically, only Platform engineers have subscription-level access because this role assignment grants access to all resources in the subscription. |
| Resource group | A logical container for grouping together resources. Role assignment for the resource group grants permission to the resource group and all resources within it, such as dev centers, projects, and deployment environments. |
| Dev center (resource) | A collection of projects that require similar settings. Role assignment for the dev center grants permission to the dev center itself. Projects and deployment environments don't inherit permissions assigned to the dev centers. |
| Project (resource) | An Azure resource used to apply common configuration settings when you create deployment environments. Role assignment for the project grants permission only to that specific project. |
| Environment Type (resource) | An Azure resource used to define the types of environments that you can create, like sandbox, dev, test, or production. Environment types are defined at dev center level and configured at project level. Role assignment for the deployment environment type grants permission to that environment type within the project, not to other environment types in the same project. |

:::image type="content" source="media/concept-deployment-environments-role-based-access-control/deployment-environments-scopes.png" alt-text="Diagram that shows the role assignment scopes for Azure Deployment Environments":::

## Roles for common Deployment Environments activities

The following table shows common Deployment Environments activities and the role needed for a user to perform that activity.

| **Activity** | **Role type** | **Role** | **Scope** |
|---|---|---|---|
| Grant permission to create a resource group. | Platform engineer | Owner or Contributor | Subscription |
| Grant permission to submit a Microsoft support ticket, including to [request a quota limit increase](how-to-request-quota-increase.md). | Platform engineer | Owner, Contributor, Support Request Contributor | Subscription |
| Grant permission to create environment types in a project. | Platform engineer | [Custom role](/azure/role-based-access-control/custom-roles-portal): Microsoft.Authorization/roleAssignments/write </br></br> Owner, Contributor, or Project Admin | Subscription </br></br></br> Project|
| Grant permission to assign roles to other users. | Platform engineer | Owner | Resource group |
| Grant permission to: </br>- Create / manage dev centers and projects.</br>- Attach / detach catalog to a dev center or project.| Platform engineer | Owner, Contributor | Resource group |
| Grant permission to enable / disable project catalogs. | Dev Manager | Owner, Contributor | Dev center |
| Grant permission to create and manage all environments in a project. </br>- Add, sync, remove catalog (project-level catalogs must be enabled on the dev center).</br>- Configure expiry date and time to trigger automatic deletion.</br>- Update & delete environment types.</br>- Delete environments.| Dev Manager | DevCenter Project Admin | Project |
| View all environments in a project. | Dev Manager | Deployment Environments Reader | Project |
| Create and manage your own environments in a project. | User | Deployment Environments User | Project |
| Create and manage catalogs in a GitHub or Azure Repos repository. | Dev Manager | Not governed by RBAC.<br>The user must be assigned permissions through Azure DevOps or GitHub. | Repository |

> [!IMPORTANT]
>  An organization's subscription is used to manage billing and security for all Azure resources and services. You can assign the Owner or Contributor role on the subscription. Typically, only Platform engineers have subscription-level access because this includes full access to all resources in the subscription.

## Platform engineer roles

To grant users permission to manage Azure Deployment Environments within your organization's subscription, you should assign them the [Owner](#) or [Contributor](#) role.

Assign these roles to the *resource group*. The dev center and projects within the resource group inherit these role assignments. Environment types inherit role assignments through projects.

:::image type="icon" source="media/concept-deployment-environments-role-based-access-control/deployment-environments-administrator-scopes.png" alt-text="Diagram that shows the administrator role assignments at the subscription for Azure Deployment Environments.":::

### Owner role

Assign the Owner role to give a user full control to create or manage dev centers and projects, and grant permissions to other users. When a user has the Owner role in the resource group, they can do the following activities across all resources within the resource group:

- Assign roles to platform engineers, so they can manage Deployment Environments resources.
- Create dev centers, projects, and environment types.
- Attach and detach catalogs.
- View, delete, and change settings for all dev centers, projects, and environment types.

> [!CAUTION]
>  When you assign the Owner or Contributor role on the resource group, then these permissions also apply to non-deployment environment related resources that exist in the resource group. For example, resources such as virtual networks, storage accounts, compute galleries, and more.

### Contributor role

Assign the Contributor role to give a user full control to create or manage dev centers and projects within a resource group. The Contributor role has the same permissions as the Owner role, *except* for:

- Performing role assignments

### Custom role

To create a project-level environment type in Deployment Environments, you must assign the Owner role or the User Access Administrator role, for the subscription that is being mapped in the environment type in the project. Alternatively, to avoid assigning broad permissions at the subscription level, you can create and assign a custom role that applies Write permissions. Apply the custom role at the subscription that is being mapped in the environment type in the project.

To learn how to Create a custom role with *Microsoft.Authorization/roleAssignments/write* and assign it at subscription level, see: [Create a custom role](/azure/role-based-access-control/custom-roles-portal).

:::image type="icon" source="media/concept-deployment-environments-role-based-access-control/deployment-environments-custom-scopes.png" alt-text="Diagram that shows the custom role assignment at the subscription for Azure Deployment Environments.":::

In addition to the custom role, the user must be assigned the Owner, Contributor, or Project Admin role on the project where the environment type is created.

## Dev Manager roles

There is one dev manager role: DevCenter Project Admin. This role has more restricted permissions at lower-level scopes than the platform engineer roles. You can assign this role to dev managers to enable them to perform administrative tasks for their team. 

:::image type="icon" source="media/concept-deployment-environments-role-based-access-control/deployment-environments-project-scopes.png" alt-text="Diagram that shows the dev manager role assignment at the project level scopes for Azure Deployment Environments.":::


### DevCenter Project Admin role

Assign the DevCenter Project Admin role to enable the user to:

- Manage all environments within the project.
- Add, sync, remove catalog (project-level catalogs must be enabled on the dev center)
- Update & delete environment types.
- Configure expiry date and time to trigger automatic deletion.
- Delete environments.

## Developer roles

These roles give developers the permissions they require to view, create, and manage environments.

:::image type="icon" source="media/concept-deployment-environments-role-based-access-control/deployment-environments-user-scopes.png" alt-text="Diagram that shows the user role assignments at the project for Azure Deployment Environments.":::

### Deployment Environments User

Assign the Deployment Environments User role to give users permission to create environments and have full control over the environments that they create.

- Create
- Delete
- Set expiry date and time.
- Redeploy environment.

### Deployment Environments Reader

Assign the Deployment Environments Reader role to give a user permission to view all environments within the project. 

A project environment type defines two sets of roles for environment resources, the role assigned to the creator, and the role assigned to additional users and groups.

When a developer creates an environment based on an environment type, they're assigned the role specified for the creator to the environment resources. Other developers are assigned whatever roles are specified for the groups they belong to, if any. They have permission to the environment resources, but not to the environment itself. In this situation, assigning the Deployment Environments Reader role allows the developers to view the environment.  

## Identity and access management (IAM)

The **Access control (IAM)** page in the Azure portal is used to configure Azure role-based access control on Azure Deployment Environments resources. You can use built-in roles for individuals and groups in Active Directory. The following screenshot shows Active Directory integration (Azure RBAC) using access control (IAM) in the Azure portal:

:::image type="icon" source="media/concept-deployment-environments-role-based-access-control/access-control-page.png" alt-text="Screenshot that shows the Access control (IAM) page for a dev center.":::

For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Dev center, resource group, and project structure

Your organization should invest time up front to plan the placement of your dev centers, and the structure of resource groups and projects.

**Dev centers:** organize dev centers by the set of projects you would like to manage together, applying similar settings, and providing similar templates. 

Organizations can use one or more dev centers. Typically, each suborganization within the organization has its own dev center. You might consider creating multiple dev centers in the following cases:

  - Specific configurations are available to a subset of projects.
  - Different teams own and maintain the dev center resource in Azure.

**Projects:** associated with each dev team or group of people working on one app or product. 

**Environment types:** reflect the stage of development or type of environment - dev, test, staging, preprod, prod, staging, etc. You can choose the naming convention best suited to your environment.

Planning is especially important when you assign roles to the resource group because it also applies permissions to all resources in the resource group, including projects and environment types. 

To ensure that users are only granted permission to the appropriate resources:

- Create resource groups that only contain Deployment Environment resources.
- Organize projects according to environment types required and the developers who should have access. 

For example, you might create separate projects for different developer teams to isolate each team's resources. Dev Managers in a project can then be assigned to the Project Admin role, which only grants them access to the resources of their team.

> [!IMPORTANT]
>  Plan the structure upfront because it's not possible to move Deployment Environments resources like projects or environments to a different resource group after they're created.

## Catalog structure

Azure Deployment Environments uses environment definitions to deploy Azure resources for developers. An environment definition comprises an IaC template and an environment file that acts as a manifest. The template defines the environment, and the environment file provides metadata about the template. 

Azure Deployment Environments stores environment definitions in either a [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/about-repositories) or an [Azure DevOps Services repository](/azure/devops/repos/get-started/what-is-repos), known as a catalog. You can attach a catalog to a dev center or to a project. Development teams use the items that you provide in the catalog to create environments in Azure.

You can attach catalogs to your dev center or project to manage environment definitions at different levels. Consider the needs of each development team when deciding where to attach catalogs. 

## Related content

- [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview)
- [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview)

