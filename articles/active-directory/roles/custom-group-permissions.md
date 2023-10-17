---
title: Group management permissions for Microsoft Entra custom roles
description: Group management permissions for Microsoft Entra custom roles in the Microsoft Entra admin center, PowerShell, or Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 05/24/2022
ms.author: rolyon
ms.reviewer: 
ms.custom: it-pro
---

# Group management permissions for Microsoft Entra custom roles

Group management permissions can be used in custom role definitions in Microsoft Entra ID to grant fine-grained access such as the following:

- Manage group properties like name and description
- Manage members and owners
- Create or delete groups
- Read audit logs
- Manage a specific type of group

This article lists the permissions you can use in your custom roles for different group management scenarios. For information about how to create custom roles, see [Create and assign a custom role in Microsoft Entra ID](custom-create.md).

## License requirements

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## How to interpret group management permissions

To interpret the group management permissions, it helps to understand what the different permission subtypes mean.

> [!div class="mx-tableFixed"]
> | Permission subtype | Permission subtype description |
> | --- | --- |
> | groups | Manage security groups and Microsoft 365 groups, excluding role-assignable groups |
> | groups.unified | Manage Microsoft 365 groups of both dynamic and assigned membership type, excluding role-assignable groups |
> | groups.unified.assignedMembership | Manage Microsoft 365 groups of only assigned membership type, excluding role-assignable groups |
> | groups.security | Manage security groups of both dynamic and assigned membership type, excluding role-assignable groups |
> | groups.security.assignedMembership | Manage security groups of only assigned membership type, excluding role-assignable groups |

The following table has example permissions for updating group members of different subtypes. 

> [!div class="mx-tableFixed"]
> | Permission example | Permission description |
> | --- | --- |
> | microsoft.directory/**groups**/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/**groups.unified**/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/**groups.unified.assignedMembership**/members/update | Update members of Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/**groups.security**/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/**groups.security.assignedMembership**/members/update | Update members of Security groups of assigned membership type, excluding role-assignable groups |

## Read group information

The following permissions are available to read properties, members, and owners of groups.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/allProperties/read | Read all properties (including privileged properties) on Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/standard/read | Read standard properties of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/members/read | Read members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/memberOf/read | Read the memberOf property on Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/owners/read | Read owners of Security groups and Microsoft 365 groups, including role-assignable groups |

## Create groups

The following permissions are available to create groups of different types.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/create | Create Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified.assignedMembership/create | Create Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups.security/create | Create Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security.assignedMembership/create | Create Security groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups/createAsOwner | Create Security groups and Microsoft 365 groups, excluding role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.unified/createAsOwner | Create Microsoft 365 groups, excluding role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.unified.assignedMembership/createAsOwner | Create Microsoft 365 groups of assigned membership type, excluding role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.security/createAsOwner | Create Security groups, excluding role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.security.assignedMembership/createAsOwner | Create Security groups of assigned membership type, excluding role-assignable groups. Creator is added as the first owner. |

## Update group information

The following permissions are available to update properties and members of groups.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/allProperties/update | Update all properties (including privileged properties) on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/allProperties/update | Update all properties (including privileged properties) on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified.assignedMembership/allProperties/update | Update all properties (including privileged properties) on Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups.security/allProperties/update | Update all properties (including privileged properties) on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security.assignedMembership/allProperties/update | Update all properties (including privileged properties) on Security groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups/basic/update | Update basic properties on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified.assignedMembership/basic/update | Update basic properties on Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups.security/basic/update | Update basic properties on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security.assignedMembership/basic/update | Update basic properties on Security groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups/classification/update | Update the classification property on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/classification/update | Update the classification property on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified.assignedMembership/classification/update | Update the classification property on Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups.security/classification/update | Update the classification property on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security.assignedMembership/classification/update | Update the classification property on Security groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update the dynamic membership rule on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/dynamicMembershipRule/update | Update the dynamic membership rule on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/dynamicMembershipRule/update | Update the dynamic membership rule on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified.assignedMembership/members/update | Update members of Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security.assignedMembership/members/update | Update members of Security groups of assigned membership type, excluding role-assignable groups |

## Update members of different group types

The following permissions are available to update members of different group types.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified.assignedMembership/members/update | Update members of Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security.assignedMembership/members/update | Update members of Security groups of assigned membership type, excluding role-assignable groups |
 
## Delete groups

The following permissions are available to delete groups.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/delete | Delete Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified.assignedMembership/members/update | Update members of Microsoft 365 groups of assigned membership type, excluding role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security.assignedMembership/members/update | Update members of Security groups of assigned membership type, excluding role-assignable groups |

## Next steps

- [Create and assign a custom role in Microsoft Entra ID](custom-create.md)
- [List Microsoft Entra role assignments](view-assignments.md)
