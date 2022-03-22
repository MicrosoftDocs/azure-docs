---
title: Built-in Azure RBAC roles Azure Virtual Desktop
description: An overview of built-in Azure RBAC roles for Azure Virtual Desktop available.
services: virtual-desktop
author: Heidilohr
ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/22/2022
ms.author: helohr
manager: femila
---
# Built-in Azure RBAC roles for Azure Virtual Desktop

Azure Virtual Desktop uses Azure role-based access control (RBAC) to control access to resources. There are a number of built-in roles for use with Azure Virtual Desktop  which is a collection of permissions. You assign roles to users and admins and these roles give permission to carry out certain tasks. To learn more about Azure RBAC, see [What is Azure RBAC?](../role-based-access-control/overview.md).

The standard built-in roles for Azure are Owner, Contributor, and Reader. However, Azure Virtual Desktop has additional roles that let you separate management roles for host pools, app groups, and workspaces. This separation lets you have more granular control over administrative tasks. These roles are named in compliance with Azure's standard roles and least-privilege methodology.

Azure Virtual Desktop doesn't have a specific Owner role. However, you can use the general Owner role for the service objects.

The built-in roles for Azure Virtual Desktop and the permissions for each one are detailed below. The assignable scope for all built-in roles are set to the root scope ("/"). The root scope indicates that the role is available for assignment in all scopes, for example management groups, subscriptions, or resource groups. For more information, see [Understand Azure role definitions](../role-based-access-control/role-definitions.md).

## Desktop Virtualization Contributor

The Desktop Virtualization Contributor role allows you to manage all aspects of the deployment. However, it doesn't grant you access to compute resources. You'll also need the User Access Administrator role to publish app groups to users or user groups.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Reader

The Desktop Virtualization Reader role allows you to view everything in the deployment but doesn't let you make any changes.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/\*/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization User

The Desktop Virtualization User role allows users to use the applications in an application group.

| Action type | Permissions |
|--|--|
| actions | None |
| notActions | None |
| dataActions | <ul><li>Microsoft.DesktopVirtualization/applicationGroups/useApplications/action</li></ul> |
| notDataActions | None |

## Desktop Virtualization Host Pool Contributor

The Host Pool Contributor role allows you to manage all aspects of host pools, including access to resources. You'll need an extra contributor role, Virtual Machine Contributor, to create virtual machines. You will need AppGroup and Workspace contributor roles to create host pool using the portal or you can use Desktop Virtualization Contributor role.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Host Pool Reader

The Host Pool Reader role allows you to view everything in the host pool, but won't allow you to make any changes.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/\*/read</li><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Application Group Contributor

The Application Group Contributor role allows you to manage all aspects of app groups. If you want to publish app groups to users or user groups, you'll need the User Access Administrator role.

The following table describes which permissions this role can access:

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/applicationgroups/\*</li><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</ul></li> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Application Group Reader

The Application Group Reader role allows you to view everything in the app group and will not allow you to make any changes.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/applicationgroups/\*/read</li><li>Microsoft.DesktopVirtualization/applicationgroups/read</li><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Workspace Contributor

The Workspace Contributor role allows you to manage all aspects of workspaces. To get information on applications added to the app groups, you'll also need to be assigned the Application Group Reader role.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/workspaces/\*</li><li>Microsoft.DesktopVirtualization/applicationgroups/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Workspace Reader

The Workspace Reader role allows you to view everything in the workspace, but won't allow you to make any changes.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/workspaces/read</li><li>Microsoft.DesktopVirtualization/applicationgroups/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization User Session Operator

The User Session Operator role allows you to send messages, disconnect sessions, and use the "logoff" function to sign sessions out of the session host. However, this role doesn't let you perform session host management like removing session host, changing drain mode, and so on. This role can see assignments, but can't modify admins. We recommend you assign this role to specific host pools. If you give this permission at a resource group level, the admin will have read permission on all host pools under a resource group.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Session Host Operator

The Session Host Operator role allows you to view and remove session hosts, as well as change drain mode. They can't add session hosts using the Azure portal because they don't have write permission for host pool objects. If the registration token is valid (generated and not expired), you can use this role to add session hosts to the host pool outside of Azure portal if the admin has compute permissions  through the Virtual Machine Contributor role.

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |
