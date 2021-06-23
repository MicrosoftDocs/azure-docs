---
title: Group management permissions for Azure AD custom roles (Preview) - Azure Active Directory
description: Group management permissions for Azure AD custom roles (Preview) in the Azure portal, PowerShell, or Microsoft Graph API.
services: active-directory
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: overview
ms.date: 06/23/2021
ms.author: rolyon
ms.reviewer: 
ms.custom: it-pro
---

# Group management permissions for Azure AD custom roles (Preview)

> [!IMPORTANT]
> Group management permissions for Azure AD custom roles is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Group management permissions can be used in custom role definitions in Azure Active Directory (Azure AD) to grant fine-grained access such as the following:

- Manage group properties like name and description
- Manage members and owners
- Create or delete groups
- Read audit logs
- Manage a specific type of group

This article lists the permissions you can use in your custom roles for different group management scenarios. For information about how to create custom roles, see [Create and assign a custom role](custom-create.md).

## Read group information

The following permissions are available to read properties, members, and owners of groups.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/allProperties/read | Read all properties of Security groups and Microsoft 365 groups, including role-assignable groups. |
> | microsoft.directory/groups/standard/read | Read standard properties of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups/members/read | Read members property of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups/memberOf/read | Read memberOf property of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups/owners/read | Read owners property of Security groups and Microsoft 365 groups. |

## Create groups

The following permissions are available to create groups of different types.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/create | Create Security groups and Microsoft 365 groups with the exclusion of role-assignable groups. |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups with the exclusion of role-assignable groups. |
> | microsoft.directory/groups.unified.assignedMembership/create | Create Microsoft 365 groups of assigned membership type with the exclusion of role-assignable groups. |
> | microsoft.directory/groups.security/create | Create Security groups with the exclusion of role-assignable groups. |
> | microsoft.directory/groups.security.assignedMembership/create | Create Security groups of assigned membership type with the exclusion of role-assignable groups. |
> | microsoft.directory/groups/createAsOwner | Create as a owner Security groups and Microsoft 365 groups with the exclusion of role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.unified/createAsOwner | Create Microsoft 365 groups with the exclusion of role-assignable groups. |
> | microsoft.directory/groups.unified.assignedMembership/createAsOwner | Create Microsoft 365 groups of assigned membership type with the exclusion of role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.security/createAsOwner | Create Security groups with the exclusion of role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.security.assignedMembership/createAsOwner | Create Security groups of assigned membership type with the exclusion of role-assignable groups. Creator is added as the first owner. |

## Update group information

The following permissions are available to update properties and members of groups.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/allProperties/update | Update all properties of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups.unified/allProperties/update | Update all properties of Microsoft 365 groups. |
> | microsoft.directory/groups.unified.assignedMembership/allProperties/update | Update all properties of Microsoft 365 groups of Assigned membership type. |
> | microsoft.directory/groups.security/allProperties/update | Update all properties of Security groups. |
> | microsoft.directory/groups.security.assignedMembership/allProperties/update | Update all properties of security groups of Assigned membership type. |
> | microsoft.directory/groups/basic/update | Update basic properties of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups.unified /basic/update | Update basic properties of Microsoft 365 groups. |
> | microsoft.directory/groups.unified.assignedMembership /basic/update | Update basic properties of Microsoft 365 groups of Assigned membership type. |
> | microsoft.directory/groups.security/basic/update | Update basic properties of Security groups. |
> | microsoft.directory/groups.security.assignedMembership /basic/update | Update basic properties of security groups of Assigned membership type. |
> | microsoft.directory/groups/classification/update | Update classification property of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups.unified/classification/update | Update classification property of Microsoft 365 groups |
> | microsoft.directory/groups.unified.assignedMembership/classification/update | Update classification property of Microsoft 365 groups of Assigned membership type |
> | microsoft.directory/groups.security/classification/update | Update classification property of security groups |
> | microsoft.directory/groups.security.assignedMembership/classification/update | Update classification property of security groups of Assigned membership type. |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update dynamic membership rules for Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups.unified/dynamicMembershipRule/update | Update dynamicMembershipRule property of Microsoft 365 groups |
> | microsoft.directory/groups.security/dynamicMembershipRule/update | Update dynamicMembershipRule property of security groups |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups. |
> | microsoft.directory/groups.unified.assignedMembership/members/update | Update members of Microsoft 365 groups of Assigned membership type. |
> | microsoft.directory/groups.security/members/update | Update members of Security groups. |
> | microsoft.directory/groups.security.assignedMembership/members/update | Update members of security groups of Assigned membership type. |

## Update members of different group types

There are different types of groups, for example, security groups, security groups with an assigned membership type, Microsoft 365 groups, Microsoft 365 groups with an assigned membership type. The following permissions are available to update members of different group types.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/members/update | Update member of Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups. |
> | microsoft.directory/groups.unified.assignedMembership/members/update | Update members of Microsoft 365 groups of assigned membership type. |
> | microsoft.directory/groups.security/members/update | Update members property of security groups in Azure Active Directory. |
> | microsoft.directory/groups.security.assignedMembership/members/update | Update members of Security groups of assigned membership type. |
 
## Delete groups

The following permissions are available to delete groups.

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/groups/delete | Delete Security groups and Microsoft 365 groups. |
> | microsoft.directory/groups.unified/members/update | Delete Microsoft 365 groups. |
> | microsoft.directory/groups.unified.assignedMembership/members/update | Delete Microsoft 365 groups of Assigned membership type. |
> | microsoft.directory/groups.security/members/update | Delete Security groups. |
> | microsoft.directory/groups.security.assignedMembership/members/update | Delete Security groups of Assigned membership type. |

## Next steps

- [Create custom roles using the Azure portal, Azure AD PowerShell, and Graph API](custom-create.md)
- [View the assignments for a custom role](../roles/view-assignments.md)
