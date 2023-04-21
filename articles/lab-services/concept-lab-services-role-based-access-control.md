---
title: Azure role-based access control
titleSuffix: Azure Lab Services
description: Learn how Azure Lab Services provides protection with Azure role-based access control (Azure RBAC) integration.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 04/20/2023
---

# Azure role-based access control in Azure Lab Services

Azure Lab Services provides built-in Azure role-based access control (Azure RBAC) for common management scenarios in Azure Lab Services. An individual who has a profile in Azure Active Directory can assign these Azure roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Lab Services resources. This article describes the different built-in roles that Azure Lab Services supports.

Azure role-based access control (RBAC) is an authorization system built on [Azure Resource Manager](/azure/azure-resource-manager/management/overview) that provides fine-grained access management of Azure resources.

With Azure RBAC, you create a *role definition* that outlines the permissions to be applied. You then assign a user or group this role definition via a role assignment for a particular scope. The scope can be an individual resource, a resource group, or across the subscription.

For more information, see [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview)?

## Built-in roles

In this article, the Azure built-in roles are logically grouped into two role types, based on their scope of influence:

- Administrator roles: influence permissions for lab plans and labs
- Lab management roles: influence permissions for labs

The following are the built-in roles supported by Azure Lab Services:

| Role type | Built-in role | Description |
| --------- | ------------- | ----------- |
| Administrator | Owner | Grant full control to create/manage lab plans and labs, and grant permissions to other users. Learn more about the [Owner role](#owner-role). |
| Administrator | Contributor | Grant full control to create/manage lab plans and labs, except for assigning roles to other users. Learn more about the [Contributor role](#contributor-role). |
| Administrator | Lab Services Contributor | Grant the same permissions as the Owner role, except for assigning roles or modifying other users' labs. Learn more about the [Lab Services Contributor role](#lab-services-contributor-role). |
| Lab management | Lab Creator | Grant permission to create labs and have full control over the labs that they create. Learn more about the [Lab Creator role](#lab-creator-role). |
| Lab management | Lab Contributor | Grant permission to help manage an existing lab, but not create new labs. Learn more about the [Lab Contributor role](#lab-contributor-role). |
| Lab management | Lab Assistant | Grant permission to view, start, stop, or reset an existing lab. Learn more about the [Lab Assistant role](#lab-assistant-role). |
| Lab management | Lab Services Reader | Grant permission to view existing labs. Learn more about the [Lab Reader role](#lab-reader-role). |

## Role assignment scope

In Azure RBAC, *scope* is the set of resources that access applies to. When you assign a role, it's important to understand scope so that you grant just the access that is really needed.

In Azure, you can specify a scope at four levels: management group, subscription, resource group, and resource. Scopes are structured in a parent-child relationship. Each level of hierarchy makes the scope more specific. You can assign roles at any of these levels of scope. The level you select determines how widely the role is applied. Lower levels inherit role permissions from higher levels. Learn more about [scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

For Azure Lab Services, consider the following scopes:

| Scope | Description |
| ----- | ----------- |
| Subscription | Used to manage billing and security for all Azure resources and services. Typically, only administrators have subscription-level access because this role assigment for the subscription grants access to all resources in the subscription. |
| Resource group | A logical container for grouping together resources. Role assignment for the resource group grants permission to the resource group and all resources within it, such as labs and lab plans. |
| Lab plan | An Azure resource used to apply common configuration settings when you create a lab. Role assignment for the lab plan grants permission only to a specific lab plan. |
| Lab | An Azure resource used to apply common configuration settings for creating and running lab virtual machines. Role assignment for the lab grants permission only to a specific lab. |

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-role-assignment-scopes.png" alt-text="Diagram that shows the role assignment scopes for Azure Lab Services.":::

> [!IMPORTANT]
> In Azure Lab Services, lab plans and labs are *sibling* resources to each other.  As a result, labs don’t inherit any roles assignments from the lab plan. However, role assignments from the resource group are inherited by lab plans and labs in that resource group.

## Roles for common lab activities

The following table shows common lab activities and the role that's needed for a user to perform that activity.

| Activity | Role type | Role | Scope |
| -------- | --------- | ---- | ----- |
| Grant permission to create a resource group. The resource group needs to exist *before* a lab plan or lab can be created. | Administrator | [Owner](#owner-role) or [Contributor](#contributor-role) | Subscription |
| Grant permission to submit a Microsoft support ticket, including to [request capacity](./capacity-limits.md). | Administrator | [Owner](#owner-role), [Contributor](#contributor-role), [Support Request Contributor](/azure/role-based-access-control/built-in-roles#support-request-contributor) | Subscription |
| Grant permission to: <br/>- Assign roles to other users.<br/>- Create/manage lab plans, labs, and other resources within the resource group.<br/>- Enable/disable marketplace and custom images on a lab plan.<br/>- Attach/detach compute gallery on a lab plan. | Administrator | [Owner](#owner-role) | Resource group |
| Grant permission to: <br/>- Create/manage lab plans, labs, and other resources within the resource group.<br/>- Enable or disable Azure Marketplace and custom images on a lab plan.<br/>- Attach or detach a compute gallery on a lab plan.<br/><br/>However, *not* the ability to assign roles to other users. | Administrator | [Contributor](#contributor-role) | Resource group |
| Grant permission to create or manage your own labs:<br/>- Using *all* lab plans within a resource group.<br/>- Or, only for a specific lab plan. | Lab management | [Lab Creator](#lab-creator-role) | Resource group or Lab plan |
| Grant permission to co-manage a lab, but *not* the ability to create labs. | Lab management | [Lab Contributor](#lab-contributor-role) | Lab |
| Grant permission to only start/stop/reset VMs for: <br/>- All labs within a resource group.<br/>- Or, only for a specific lab. | Lab management | [Lab Assistant](#lab-assistant-role) | Resource group or Lab |

> [!IMPORTANT]
> An organization’s subscription is used to manage billing and security for all Azure resources and services. You can assign the Owner or Contributor role at the [subscription](./administrator-guide.md#subscription) level. Typically, only administrators have subscription-level access because this includes full access to all resources in the subscription.

## Administrative roles

### Owner role

### Contributor role

### Lab Services Contributor role

## Lab management roles

### Lab Creator role

### Lab Contributor role

### Lab Assistant role

### Lab Reader role

## Identity and access management (IAM)

The **Access control (IAM)** page in the Azure portal is used to configure Azure role-based access control on Azure Lab Services resources. The roles are applied to users, groups, service principals, and managed identities in Active Directory. You can use built-in roles or custom roles for individuals and groups. The following screenshot shows Active Directory integration (Azure RBAC) using access control (IAM) in the Azure portal:

**TODO: add screenshot of IAM**

For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Resource group and lab plan structure

Your organization should invest time up front to plan the structure of your resource groups and lab plans.  This is especially important when users are assigned roles at the resource group level because they automatically will have permission to use all resources within the resource group.  To ensure that users are only granted permission to the appropriate resources, we recommend that you: 

Create resource groups that only contain lab-related resources. 

Organize lab plans and labs into separate resource groups according to the users that should have access. 

For example, you may want to create separate resource groups for different departments, such as one for Math and another for Engineering, so that each department’s lab resources are isolated from one another.  Educators in the Engineering department can then be granted permission at the resource group level, which will only give them access to their department’s lab resources. 

IMPORTANT – You should plan the structure of resource groups and labs plans up front because it’s not possible to move lab plans or labs to a different resource group once they are created. 

### Access to multiple resource groups

Administrators and educators can be granted permission to more than one resource group.  For example, when an educator is assigned the Lab Contributor role on labs from different resource groups, the educator will be prompted to choose from the list of resource groups to view their labs: 

TODO: add image

### Access to multiple lab plans

Likewise, administrators and educators can be granted permission to more than one lab plan.  For example, when an educator is assigned the Lab Creator role on a resource group that contains more than one lab plan, the educator will be prompted to choose from the list of lab plans during lab creation. 

TODO: add image

## Next steps

- [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview)
- [Move role assignments from lab accounts to lab plans](./concept-migrate-from-lab-accounts-roles.md)
- [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview)
