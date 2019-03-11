---
title: Windows Virtual Desktop environment - Azure
description: The basic elements of a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/20/2019
ms.author: helohr
---
# Windows Virtual Desktop environment and concepts (Preview)

Windows Virtual Desktop is a service that gives users easy and secure access to their virtualized desktops and RemoteApps. This topic will tell you a bit more about the general structure of the Windows Virtual Desktop environment.

## Tenants

A Windows Virtual Desktop tenant is the primary interface for managing your Windows Virtual Desktop environment. Each Windows Virtual Desktop tenant must be associated with the Azure Active Directory containing the users who will login to the environment. From the Windows Virtual Desktop tenant, you can begin creating host pools to run your users' workloads.

## Host pools

A host pool is a collection of Azure virtual machines that register to Windows Virtual Desktop as session hosts by running the Windows Virtual Desktop agent. All session host virtual machines in a host pool should be sourced from the same image for a consistent user experience across the host pool.

A host pool can be one of two types:

- Personal, where each session host will be assigned to individual users.
- Pooled, where session hosts can accept connections from any user that is authorized to an app group within the host pool.

You can set additional properties on the host pool which will change the load balancing behavior, how many sessions each session host can take, and what the user can do in their Windows Virtual Desktop sessions to session hosts in the host pool. You control the resources that are published to users through app groups.

## App groups

An app group is a logical grouping of applications that are installed on the session hosts in the host pool. An app group can be one of two types:

- RemoteApp, where users will access the RemoteApps you individually select and publish to the app group
- Desktop, where users will access the full desktop

By default, a desktop app group (named "Desktop Application Group") is automatically created whenever you create a host pool. You can remove this app group at any time. While a desktop app group exists, you cannot create another desktop app group in the host pool. To publish RemoteApps, you must create a RemoteApp app group. You can create multiple RemoteApp app groups to accommodate different worker scenarios. Different RemoteApp app groups can even contain overlapping RemoteApps.

To publish resources to user, you must assign users to app groups. When assigning users to app groups, consider the following:

- A user cannot be assigned to both a desktop app group and a RemoteApp app group in the same host pool.
- A user can be assigned to multiple app groups within the same host pool, and their feed will be an accumulation of both app groups.

## Tenant groups

In Windows Virtual Desktop, the Windows Virtual Desktop tenant is where most of the setup and configuration happens, since it contains the host pools, app groups, and app group user assignments. However, there may be certain instances where you need to manage multiple Windows Virtual Desktop tenants, like if you are a Cloud Service Provider (CSP) or a hosting partner. If you fall into this category, you can use a custom Windows Virtual Desktop tenant group to place each of the customers' Windows Virtual Desktop tenants and centrally manage access. Otherwise, if you are only managing a single Windows Virtual Desktop tenant, the tenant group concept does not apply and you will continue to operate and manage your tenant that exists in the "Default Tenant Group."

## End users

Once users are assigned to their app groups, users can connect to a Windows Virtual Desktop deployment with any of the Windows Virtual Desktop clients.

## Next steps

Learn more about delegated access and how to assign roles to users at [Delegated Access in Windows Virtual Desktop](delegated-access-virtual-desktop.md).

To learn how to set up your Windows Virtual Desktop tenant, see [Set up Windows Virtual Desktop tenants](tenant-setup-azure-active-directory.md).

To learn how to connect to Windows Virtual Desktop, see one of the following articles:

- [Connect to the Remote Desktop client on Windows 7 and Windows 10](connect-windows-7-and-10.md)
- [Connect to Microsoft Remote Desktop on macOS](connect-macos.md)
- [Connect to the Windows Virtual Desktop web client](connect-web.md)