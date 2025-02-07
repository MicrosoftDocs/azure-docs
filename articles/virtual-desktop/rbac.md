---
title: Built-in Azure RBAC roles Azure Virtual Desktop
description: An overview of built-in Azure RBAC roles for Azure Virtual Desktop available.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 09/23/2024
---

# Built-in Azure RBAC roles for Azure Virtual Desktop

Azure Virtual Desktop uses Azure role-based access control (RBAC) to control access to resources. There are many built-in roles for use with Azure Virtual Desktop  that are a collection of permissions. You assign roles to users and admins and these roles give permission to carry out certain tasks. To learn more about Azure RBAC, see [What is Azure RBAC](../role-based-access-control/overview.md).

The standard built-in roles for Azure are *Owner*, *Contributor*, and *Reader*. However, Azure Virtual Desktop has more roles that let you separate management roles for host pools, application groups, and workspaces. This separation lets you have more granular control over administrative tasks. These roles are named in compliance with Azure's standard roles and least-privilege methodology. Azure Virtual Desktop doesn't have a specific Owner role, but you can use the general Owner role for the service objects.

The built-in roles for Azure Virtual Desktop and the permissions for each one are detailed in this article. You can assign each role to the scope you need. Some Azure Desktop features have specific requirements for the assigned scope, which you can find in the documentation for the relevant feature. For more information, see [Understand Azure role definitions](../role-based-access-control/role-definitions.md) and [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

For a full list of all the built-in roles available, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

## Desktop Virtualization Contributor

The Desktop Virtualization Contributor role allows managing all your Azure Virtual Desktop resources, apart from user or group assignment. If you want to assign user accounts or user groups to resources, you also need the *User Access Administrator* role. The Desktop Virtualization Contributor role doesn't grant users access to compute resources.

**ID**: 082f0a83-3be5-4ba1-904c-961cca79b387

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Reader

The Desktop Virtualization Reader role allows viewing all your Azure Virtual Desktop resources, but doesn't allow changes.

**ID**: 49a72310-ab8d-41df-bbb0-79b649203868

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/\*/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization User

The Desktop Virtualization User role allows users to use an application on a session host from an application group as a non-administrative user.

**ID**: 1d18fff3-a72a-46b5-b4a9-0b38a3cd7e63

| Action type | Permissions |
|--|--|
| actions | None |
| notActions | None |
| dataActions | <ul><li>Microsoft.DesktopVirtualization/applicationGroups/useApplications/action</li></ul> |
| notDataActions | None |

## Desktop Virtualization Host Pool Contributor

The Desktop Virtualization Host Pool Contributor role allows managing all aspects of a host pool. You also need the *Virtual Machine Contributor* role to create virtual machines and the *Desktop Virtualization Application Group Contributor* and *Desktop Virtualization Workspace Contributor* roles to deploy Azure Virtual Desktop using the portal, or you can use the *Desktop Virtualization Contributor* role.

**ID**: e307426c-f9b6-4e81-87de-d99efb3c32bc

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Host Pool Reader

The Desktop Virtualization Host Pool Reader role allows viewing all aspects of a host pool, but doesn't allow changes.

**ID**: ceadfde2-b300-400a-ab7b-6143895aa822

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/\*/read</li><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Application Group Contributor

The Desktop Virtualization Application Group Contributor role allows managing all aspects of an application group, apart from user or group assignment. If you want to assign user accounts or user groups to application groups too, you also need the *User Access Administrator* role.

**ID**: 86240b0e-9422-4c43-887b-b61143f32ba8

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/applicationgroups/\*</li><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</ul></li> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Application Group Reader

The Desktop Virtualization Application Group Reader role allows viewing all aspects of an application group, but doesn't allow changes.

**ID**: aebf23d0-b568-4e86-b8f9-fe83a2c6ab55

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/applicationgroups/\*/read</li><li>Microsoft.DesktopVirtualization/applicationgroups/read</li><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Workspace Contributor

The Desktop Virtualization Workspace Contributor role allows managing all aspects of workspaces. To get information on applications added to a related application group, you also need the *Desktop Virtualization Application Group Reader* role.

**ID**: 21efdde3-836f-432b-bf3d-3e8e734d4b2b

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/workspaces/\*</li><li>Microsoft.DesktopVirtualization/applicationgroups/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Workspace Reader

The Desktop Virtualization Workspace Reader role allows users to viewing all aspects of a workspace, but doesn't allow changes.

**ID**: 0fa44ee9-7a7d-466b-9bb2-2bf446b1204d

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/workspaces/read</li><li>Microsoft.DesktopVirtualization/applicationgroups/read</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/read</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization User Session Operator

The Desktop Virtualization User Session Operator role allows sending messages, disconnecting sessions, and using the *logoff* function to sign users out of a session host. However, this role doesn't allow host pool or session host management like removing a session host, changing drain mode, and so on. This role can see assignments, but can't modify members. We recommend you assign this role to specific host pools. If you assign this role at a resource group level, it provides read permission on all host pools under a resource group.

**ID**: ea4bfff8-7fb4-485a-aadd-d4129a0ffaa6

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Session Host Operator

The Desktop Virtualization Session Host Operator role allows viewing and removing session hosts, and changing drain mode. This role can't add session hosts using the Azure portal because it doesn't have write permission for host pool objects. For adding session hosts outside of the Azure portal, if the registration token is valid (generated and not expired), this role can add session hosts to the host pool if the *Virtual Machine Contributor* role is also assigned.

**ID**: 2ad6aaab-ead9-4eaa-8ac5-da422f562408

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Support/\*</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Power On Contributor

The Desktop Virtualization Power On Contributor role is used to allow the Azure Virtual Desktop Resource Provider to start virtual machines.

**ID**: 489581de-a3bd-480d-9518-53dea7416b33

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.Compute/virtualMachines/start/action</li><li>Microsoft.Compute/virtualMachines/read</li><li>Microsoft.Compute/virtualMachines/instanceView/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/read</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/start/action</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/stop/action</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/restart/action</li><li>Microsoft.HybridCompute/machines/read</li><li>Microsoft.HybridCompute/operations/read</li><li>Microsoft.HybridCompute/locations/operationresults/read</li><li>Microsoft.HybridCompute/locations/operationstatus/read</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Power On Off Contributor

The Desktop Virtualization Power On Off Contributor role is used to allow the Azure Virtual Desktop Resource Provider to start and stop virtual machines.

**ID**: 40c5ff49-9181-41f8-ae61-143b0e78555e

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.Compute/virtualMachines/start/action</li><li>Microsoft.Compute/virtualMachines/read</li><li>Microsoft.Compute/virtualMachines/instanceView/read</li><li>Microsoft.Compute/virtualMachines/deallocate/action</li><li>Microsoft.Compute/virtualMachines/restart/action</li><li>Microsoft.Compute/virtualMachines/powerOff/action</li><li>Microsoft.Insights/eventtypes/values/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/write</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/write</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/delete</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/sendMessage/action</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/read</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/start/action</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/stop/action</li><li>Microsoft.AzureStackHCI/virtualMachineInstances/restart/action</li><li>Microsoft.HybridCompute/machines/read</li><li>Microsoft.HybridCompute/operations/read</li><li>Microsoft.HybridCompute/locations/operationresults/read</li><li>Microsoft.HybridCompute/locations/operationstatus/read</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |

## Desktop Virtualization Virtual Machine Contributor

The Desktop Virtualization Virtual Machine Contributor role is used to allow the Azure Virtual Desktop Resource Provider to create, delete, update, start, and stop virtual machines.

**ID**: a959dbd1-f747-45e3-8ba6-dd80f235f97c

| Action type | Permissions |
|--|--|
| actions | <ul><li>Microsoft.DesktopVirtualization/hostpools/read</li><li>Microsoft.DesktopVirtualization/hostpools/write</li><li>Microsoft.DesktopVirtualization/hostpools/retrieveRegistrationToken/action</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/write</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/delete</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/disconnect/action</li><li>Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/sendMessage/action</li><li>Microsoft.DesktopVirtualization/hostpools/sessionHostConfigurations/read</li><li>Microsoft.Compute/availabilitySets/read</li><li>Microsoft.Compute/availabilitySets/write</li><li>Microsoft.Compute/availabilitySets/vmSizes/read</li><li>Microsoft.Compute/disks/read</li><li>Microsoft.Compute/disks/write</li><li>Microsoft.Compute/disks/delete</li><li>Microsoft.Compute/galleries/read</li><li>Microsoft.Compute/galleries/images/read</li><li>Microsoft.Compute/galleries/images/versions/read</li><li>Microsoft.Compute/images/read</li><li>Microsoft.Compute/locations/usages/read</li><li>Microsoft.Compute/locations/vmSizes/read</li><li>Microsoft.Compute/operations/read</li><li>Microsoft.Compute/skus/read</li><li>Microsoft.Compute/virtualMachines/read</li><li>Microsoft.Compute/virtualMachines/write</li><li>Microsoft.Compute/virtualMachines/delete</li><li>Microsoft.Compute/virtualMachines/start/action</li><li>Microsoft.Compute/virtualMachines/powerOff/action</li><li>Microsoft.Compute/virtualMachines/restart/action</li><li>Microsoft.Compute/virtualMachines/deallocate/action</li><li>Microsoft.Compute/virtualMachines/runCommand/action</li><li>Microsoft.Compute/virtualMachines/extensions/read</li><li>Microsoft.Compute/virtualMachines/extensions/write</li><li>Microsoft.Compute/virtualMachines/extensions/delete</li><li>Microsoft.Compute/virtualMachines/runCommands/read</li><li>Microsoft.Compute/virtualMachines/runCommands/write</li><li>Microsoft.Compute/virtualMachines/vmSizes/read</li><li>Microsoft.Network/networkSecurityGroups/read</li><li>Microsoft.Network/networkInterfaces/write</li><li>Microsoft.Network/networkInterfaces/read</li><li>Microsoft.Network/networkInterfaces/join/action</li><li>Microsoft.Network/networkInterfaces/delete</li><li>Microsoft.Network/virtualNetworks/subnets/read</li><li>Microsoft.Network/virtualNetworks/subnets/join/action</li><li>Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read</li><li>Microsoft.KeyVault/vaults/deploy/action</li><li>Microsoft.Storage/storageAccounts/read</li><li>Microsoft.Authorization/\*/read</li><li>Microsoft.Insights/alertRules/\*</li><li>Microsoft.Resources/deployments/\*</li><li>Microsoft.Resources/subscriptions/resourceGroups/read</li></ul> |
| notActions | None |
| dataActions | None |
| notDataActions | None |
