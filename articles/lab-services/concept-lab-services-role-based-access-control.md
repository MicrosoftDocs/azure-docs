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

Azure Lab Services provides built-in Azure role-based access control (Azure RBAC) for common management scenarios in Azure Lab Services. An individual who has a profile in Microsoft Entra ID can assign these Azure roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Lab Services resources. This article describes the different built-in roles that Azure Lab Services supports.

Azure role-based access control (RBAC) is an authorization system built on [Azure Resource Manager](/azure/azure-resource-manager/management/overview) that provides fine-grained access management of Azure resources.

Azure RBAC specifies built-in role definitions that outline the permissions to be applied. You assign a user or group this role definition via a role assignment for a particular scope. The scope can be an individual resource, a resource group, or across the subscription. In the next section, you learn which [built-in roles](#built-in-roles) Azure Lab Services supports.

For more information, see [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview)?

> [!NOTE]
> When you make role assignment changes, it can take a few minutes for these updates to propagate.

## Built-in roles

In this article, the Azure built-in roles are logically grouped into two role types, based on their scope of influence:

- Administrator roles: influence permissions for lab plans and labs
- Lab management roles: influence permissions for labs

The following are the built-in roles supported by Azure Lab Services:

| Role type | Built-in role | Description |
| --------- | ------------- | ----------- |
| Administrator | Owner | Grant full control to create/manage lab plans and labs, and grant permissions to other users. Learn more about the [Owner role](#owner-role). |
| Administrator | Contributor | Grant full control to create/manage lab plans and labs, except for assigning roles to other users. Learn more about the [Contributor role](#contributor-role). |
| Administrator | Lab Services Contributor | Grant the same permissions as the Owner role, except for assigning roles. Learn more about the [Lab Services Contributor role](#lab-services-contributor-role). |
| Lab management | Lab Creator | Grant permission to create labs and have full control over the labs that they create. Learn more about the [Lab Creator role](#lab-creator-role). |
| Lab management | Lab Contributor | Grant permission to help manage an existing lab, but not create new labs. Learn more about the [Lab Contributor role](#lab-contributor-role). |
| Lab management | Lab Assistant | Grant permission to view an existing lab. Can also start, stop, or reimage any VM in the lab. Learn more about the [Lab Assistant role](#lab-assistant-role). |
| Lab management | Lab Services Reader | Grant permission to view existing labs. Learn more about the [Lab Services Reader role](#lab-services-reader-role). |

## Role assignment scope

In Azure RBAC, *scope* is the set of resources that access applies to. When you assign a role, it's important to understand scope so that you grant just the access that is needed.

In Azure, you can specify a scope at four levels: management group, subscription, resource group, and resource. Scopes are structured in a parent-child relationship. Each level of hierarchy makes the scope more specific. You can assign roles at any of these levels of scope. The level you select determines how widely the role is applied. Lower levels inherit role permissions from higher levels. Learn more about [scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

For Azure Lab Services, consider the following scopes:

| Scope | Description |
| ----- | ----------- |
| Subscription | Used to manage billing and security for all Azure resources and services. Typically, only administrators have subscription-level access because this role assignment grants access to all resources in the subscription. |
| Resource group | A logical container for grouping together resources. Role assignment for the resource group grants permission to the resource group and all resources within it, such as labs and lab plans. |
| Lab plan | An Azure resource used to apply common configuration settings when you create a lab. Role assignment for the lab plan grants permission only to a specific lab plan. |
| Lab | An Azure resource used to apply common configuration settings for creating and running lab virtual machines. Role assignment for the lab grants permission only to a specific lab. |

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-role-assignment-scopes.png" alt-text="Diagram that shows the role assignment scopes for Azure Lab Services.":::

> [!IMPORTANT]
> In Azure Lab Services, lab plans and labs are *sibling* resources to each other.  As a result, labs don’t inherit any roles assignments from the *lab plan*. However, role assignments from the *resource group* are inherited by lab plans and labs in that resource group.

## Roles for common lab activities

The following table shows common lab activities and the role that's needed for a user to perform that activity.

| Activity | Role type | Role | Scope |
| -------- | --------- | ---- | ----- |
| Grant permission to create a resource group. A resource group is a logical container in Azure to hold the lab plans and labs. *Before* you can create a lab plan or lab, this resource group needs to exist. | Administrator | [Owner](#owner-role) or [Contributor](#contributor-role) | Subscription |
| Grant permission to submit a Microsoft support ticket, including to [request capacity](./capacity-limits.md). | Administrator | [Owner](#owner-role), [Contributor](#contributor-role), [Support Request Contributor](/azure/role-based-access-control/built-in-roles#support-request-contributor) | Subscription |
| Grant permission to: <br/>- Assign roles to other users.<br/>- Create/manage lab plans, labs, and other resources within the resource group.<br/>- Enable/disable marketplace and custom images on a lab plan.<br/>- Attach/detach compute gallery on a lab plan. | Administrator | [Owner](#owner-role) | Resource group |
| Grant permission to: <br/>- Create/manage lab plans, labs, and other resources within the resource group.<br/>- Enable or disable Azure Marketplace and custom images on a lab plan.<br/><br/>However, *not* the ability to assign roles to other users. | Administrator | [Contributor](#contributor-role) | Resource group |
| Grant permission to create or manage your own labs for *all* lab plans within a resource group. | Lab management | [Lab Creator](#lab-creator-role) | Resource group |
| Grant permission to create or manage your own labs for a specific lab plan. | Lab management | [Lab Creator](#lab-creator-role) | Lab plan |
| Grant permission to co-manage a lab, but *not* the ability to create labs. | Lab management | [Lab Contributor](#lab-contributor-role) | Lab |
| Grant permission to only start/stop/reimage VMs for *all* labs within a resource group. | Lab management | [Lab Assistant](#lab-assistant-role) | Resource group |
| Grant permission to only start/stop/reimage VMs for a specific lab. | Lab management | [Lab Assistant](#lab-assistant-role) | Lab |

> [!IMPORTANT]
> An organization’s subscription is used to manage billing and security for all Azure resources and services. You can assign the Owner or Contributor role on the [subscription](./administrator-guide.md#subscription). Typically, only administrators have subscription-level access because this includes full access to all resources in the subscription.

## Administrator roles

To grant users permission to manage Azure Lab Services within your organization’s subscription, you should assign them the [Owner](#owner-role), [Contributor](#contributor-role), or the [Lab Services Contributor](#lab-services-contributor-role) role.

Assign these roles on the *resource group*. The lab plans and labs within the resource group inherit these role assignments.

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-administrator-roles.png" alt-text="Diagram that shows the resource hierarchy and the three administrator roles, assigned to the resource group.":::

The following table compares the different administrator roles when they're assigned on the resource group.

| Lab plan/Lab | Activity | Owner | Contributor | Lab Services Contributor |
| ------------ | -------- | :-----: | :-----------: | :------------------------: |
| Lab plan | View all lab plans within the resource group | Yes | Yes | Yes |
| Lab plan | Create, change or delete all lab plans within the resource group | Yes | Yes | Yes |
| Lab plan | Assign roles to lab plans within the resource group | Yes | No | No |
| Lab | Create labs within the resource group** | Yes | Yes | Yes |
| Lab | View other users’ labs within the resource group | Yes | Yes | Yes |
| Lab | Change or delete other users’ labs within the resource group | Yes | Yes | No |
| Lab | Assign roles to other users’ labs within the resource group | Yes | No | No |

** Users are automatically granted permission to view, change settings, delete, and assign roles for the labs that they create.
 
### Owner role

Assign the Owner role to give a user full control to create or manage lab plans and labs, and grant permissions to other users. When a user has the Owner role on the resource group, they can do the following activities across all resources within the resource group:

- Assign roles to administrators, so they can manage lab-related resources.
- Assign roles to lab managers, so they can create and manage labs.
- Create lab plans and labs.
- View, delete, and change settings for all lab plans, including attaching or detaching the compute gallery and enabling or disabling Azure Marketplace and custom images on lab plans.
- View, delete, and change settings for all labs.

> [!CAUTION]
> When you assign the Owner or Contributor role on the resource group, then these permissions also apply to non-lab related resources that exist in the resource group. For example, resources such as virtual networks, storage accounts, compute galleries, and more.

### Contributor role

Assign the Contributor role to give a user full control to create or manage lab plans and labs within a resource group. The Contributor role has the same permissions as the Owner role, *except* for:

- Performing role assignments

### Lab Services Contributor role

The Lab Services Contributor is the most restrictive of the administrator roles. Assign the Lab Services Contributor role to enable the same activities as the Owner role, *except* for:

- Performing role assignments
- Changing or deleting other users’ labs

> [!NOTE]
> The Lab Services Contributor role doesn't allow changes to resources that unrelated to Azure Lab Services. On the other hand, the *Contributor* role allows changes to all Azure resources within the resource group.

## Lab management roles

Use the following roles to grant users permissions to create and manage labs:

- Lab Creator
- Lab Contributor
- Lab Assistant
- Lab Services Reader

These lab management roles only grant permission to view lab plans. These roles don't allow creating, changing, deleting, or assigning roles to lab plans. In addition, users with these roles can’t attach or detach a compute gallery and enable or disable virtual machine images.

### Lab Creator role

Assign the Lab Creator role to give a user permission to create labs and have full control over the labs that they create. For example, they can change their labs’ settings, delete their labs, and even grant other users permission to their labs. 

Assign the Lab Creator role on either the *resource group or lab plan*.

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-lab-creator-role.png" alt-text="Diagram that shows the resource hierarchy and the Lab Creator role, assigned to the resource group and lab plan.":::

The following table compares the Lab Creator role assignment for the resource group or lab plan.

| Activity | Resource group | Lab plan |
| -------- | :--------------: | :--------: |
| Create labs within the resource group** | Yes | Yes |
| View labs they created | Yes | Yes |
| View other users’ labs within the resource group | Yes | No |
| Change or delete labs the user created | Yes | Yes |
| Change or delete other users’ labs within the resource group | No | No |
| Assign roles to other users’ labs within the resource group | No | No |

** Users are automatically granted permission to view, change settings, delete, and assign roles for the labs that they create.

### Lab Contributor role

Assign the Lab Contributor role to give a user permission to help manage an existing lab.

Assign the Lab Contributor role on the *lab*.

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-lab-contributor-role.png" alt-text="Diagram that shows the resource hierarchy and the Lab Contributor role, assigned to the lab.":::

When you assign the Lab Contributor role on the lab, the user can manage the assigned lab. Specifically, the user:

- Can view, change all settings, or delete the assigned lab.
- The user can’t view other users’ labs.
- Can’t create new labs.

### Lab Assistant role

Assign the Lab Assistant role to grant a user permission to view a lab, and start, stop, and reimage lab virtual machines for the lab.

Assign the Lab Assistant role on the *resource group or lab*.

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-lab-assistant-role.png" alt-text="Diagram that shows the resource hierarchy and the Lab Assistant role, assigned to the resource group and lab.":::

When you assign the Lab Assistant role on the resource group, the user:

- Can view all labs within the resource group and start, stop, or reimage lab virtual machines for each lab.
- Can’t delete or make any other changes to the labs.

When you assign the Lab Assistant role on the lab, the user:

- Can view the assigned lab and start, stop, or reimage lab virtual machines.
- Can’t delete or make any other changes to the lab.
- Can’t create new labs.

When you have the Lab Assistant role, to view other labs you're granted access to, make sure to choose the **All labs** filter in the Azure Lab Services website.

### Lab Services Reader role

Assign the Lab Services Reader role to grant a user permission view existing labs. The user can’t make any changes to existing labs.

Assign the Lab Services Reader role on the *resource group or lab*.

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-lab-services-reader-role.png" alt-text="Diagram that shows the resource hierarchy and the Lab Services Reader role, assigned to the resource group and lab.":::

When you assign the Lab Services Reader role on the resource group, the user can:

- View all labs within the resource group.

When you assign the Lab Services Reader role on the lab, the user can:

- Only view the specific lab.

## Identity and access management (IAM)

The **Access control (IAM)** page in the Azure portal is used to configure Azure role-based access control on Azure Lab Services resources. You can use built-in roles for individuals and groups in Active Directory. The following screenshot shows Active Directory integration (Azure RBAC) using access control (IAM) in the Azure portal:

:::image type="content" source="./media/concept-lab-services-role-based-access-control/azure-portal-access-control.png" alt-text="Screenshot that shows the Access Control page in the Azure portal to manage role assignments.":::

For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Resource group and lab plan structure

Your organization should invest time up front to plan the structure of resource groups and lab plans. This is especially important when you assign roles on the resource group because it also applies permissions to all resources in the resource group.

To ensure that users are only granted permission to the appropriate resources:

- Create resource groups that only contain lab-related resources. 

- Organize lab plans and labs into separate resource groups according to the users that should have access. 

For example, you might create separate resource groups for different departments to isolate each department’s lab resources. Lab creators in one department can then be granted permissions on the resource group, which only grants them access to the lab resources of their department.

> [!IMPORTANT]
> Plan the resource group and lab plan structure upfront because it’s not possible to move lab plans or labs to a different resource group after they're created.

### Access to multiple resource groups

You can grant users access to multiple resource groups. In the [Azure Lab Services website](https://labs.azure.com), the user can then choose from the list of resource groups to view their labs.

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-choose-resource-group.png" alt-text="Screenshot that shows how to choose between resource groups in the Azure Lab Services website.":::

### Access to multiple lab plans

You can grant users access to multiple lab plans. For example, when you assign the Lab Creator role to a user on a resource group that contains more than one lab plan. The user can then choose from the list of lab plans when creating a new lab.

:::image type="content" source="./media/concept-lab-services-role-based-access-control/lab-services-choose-lab-plan.png" alt-text="Screenshot that shows how to choose between lab plans when creating a lab in the Azure Lab Services website.":::

## Next steps

- [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview)
- [Move role assignments from lab accounts to lab plans](./concept-migrate-from-lab-accounts-roles.md)
- [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview)
