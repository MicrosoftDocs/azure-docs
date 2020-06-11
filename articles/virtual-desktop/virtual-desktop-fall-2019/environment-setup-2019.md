---
title: Windows Virtual Desktop environment - Azure
description: The basic elements of a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: helohr
manager: lizross
---
# Windows Virtual Desktop environment

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects. If you're trying to manage Azure Resource Manager Windows Virtual Desktop objects introduced in the Spring 2020 update, see [this article](../environment-setup.md).

Windows Virtual Desktop is a service that gives users easy and secure access to their virtualized desktops and RemoteApps. This topic will tell you a bit more about the general structure of the Windows Virtual Desktop environment.

## Tenants

The Windows Virtual Desktop tenant is the primary interface for managing your Windows Virtual Desktop environment. Each Windows Virtual Desktop tenant must be associated with the Azure Active Directory containing the users who will sign in to the environment. From the Windows Virtual Desktop tenant, you can begin creating host pools to run your users' workloads.

## Host pools

A host pool is a collection of Azure virtual machines that register to Windows Virtual Desktop as session hosts when you run the Windows Virtual Desktop agent. All session host virtual machines in a host pool should be sourced from the same image for a consistent user experience.

A host pool can be one of two types:

- Personal, where each session host is assigned to individual users.
- Pooled, where session hosts can accept connections from any user authorized to an app group within the host pool.

You can set additional properties on the host pool to change its load-balancing behavior, how many sessions each session host can take, and what the user can do to session hosts in the host pool while signed in to their Windows Virtual Desktop sessions. You control the resources published to users through app groups.

## App groups

An app group is a logical grouping of applications installed on session hosts in the host pool. An app group can be one of two types:

- RemoteApp, where users access the RemoteApps you individually select and publish to the app group
- Desktop, where users access the full desktop

By default, a desktop app group (named "Desktop Application Group") is automatically created whenever you create a host pool. You can remove this app group at any time. However, you can't create another desktop app group in the host pool while a desktop app group exists. To publish RemoteApps, you must create a RemoteApp app group. You can create multiple RemoteApp app groups to accommodate different worker scenarios. Different RemoteApp app groups can also contain overlapping RemoteApps.

To publish resources to users, you must assign them to app groups. When assigning users to app groups, consider the following things:

- A user can't be assigned to both a desktop app group and a RemoteApp app group in the same host pool.
- A user can be assigned to multiple app groups within the same host pool, and their feed will be an accumulation of both app groups.

## Tenant groups

In Windows Virtual Desktop, the Windows Virtual Desktop tenant is where most of the setup and configuration happens. The Windows Virtual Desktop tenant contains the host pools, app groups, and app group user assignments. However, there may be certain situations where you need to manage multiple Windows Virtual Desktop tenants at once, particularly if you're a Cloud Service Provider (CSP) or a hosting partner. In these situations, you can use a custom Windows Virtual Desktop tenant group to place each of the customers' Windows Virtual Desktop tenants and centrally manage access. However, if you're only managing a single Windows Virtual Desktop tenant, the tenant group concept doesn't apply and you can continue to operate and manage your tenant that exists in the default tenant group.

## End users

After you've assigned users to their app groups, they can connect to a Windows Virtual Desktop deployment with any of the Windows Virtual Desktop clients.

## Next steps

Learn more about delegated access and how to assign roles to users at [Delegated Access in Windows Virtual Desktop](delegated-access-virtual-desktop-2019.md).

To learn how to set up your Windows Virtual Desktop tenant, see [Create a tenant in Windows Virtual Desktop](tenant-setup-azure-active-directory.md).

To learn how to connect to Windows Virtual Desktop, see one of the following articles:

- [Connect from Windows 10 or Windows 7](../connect-windows-7-and-10.md)
- [Connect from a web browser](connect-web-2019.md)
