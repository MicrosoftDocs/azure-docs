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

Azure Lab Services provides built-in Azure role-based access control (Azure RBAC) for common management scenarios in Azure Lab Services. An individual who has a profile in Azure Active Directory can assign these Azure roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Lab Services resources. 

In this article ...

## Azure role-based access control

Azure role-based access control (RBAC) is an authorization system built on [Azure Resource Manager](/azure/azure-resource-manager/management/overview) that provides fine-grained access management of Azure resources.

With Azure RBAC, you create a *role definition* that outlines the permissions to be applied. You then assign a user or group this role definition via a role assignment for a particular scope. The scope can be an individual resource, a resource group, or across the subscription.

For more information, see [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview)?

## Roles types

## Resource assignment level

Determines the scope of the role assignment
Add cross-ref to [resource group structure](#resource-group-and-lab-plan-structure)


As shown by the arrows in the graphic below, roles can be assigned to users on resource groups, lab plans, and labs:

Resource groups are logical containers for grouping together resources.  Role assignment at the resource group level grants permission to the resource group and all resources within the resource group, such as labs and lab plans.
Lab plans are used to apply common configuration settings when you create a lab. Role assignment at the lab plan level grants permission only to a specific lab plan.
Lab role assignment grants permission only to a specific lab.

TODO: add image

IMPORTANT – Lab plans and labs are sibling resources to each other.  As a result, labs don’t inherit any roles/permissions that are assigned at the lab plan level.  However, roles/permissions assigned at the resource group level are inherited by both lab plans and labs.

## Built-in roles

The following are the built-in roles supported by Azure Lab Services:

| Built-in role | Description |
| ------------- | ----------- |
| Owner | |
| Contributor | |
| Lab Services Contributor | |

| Built-in role | Description |
| ------------- | ----------- |
| Lab Creator | |
| Lab Contributor | |
| Lab Assistant | |
| Lab Services Reader | |


## Identity and access management (IAM)

The **Access control (IAM)** page in the Azure portal is used to configure Azure role-based access control on Azure Lab Services resources. The roles are applied to users, groups, service principals, and managed identities in Active Directory. You can use built-in roles or custom roles for individuals and groups. The following screenshot shows Active Directory integration (Azure RBAC) using access control (IAM) in the Azure portal:

**TODO: add screenshot of IAM**

For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Roles for common lab activities

## Administrative roles

## Lab management roles

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
