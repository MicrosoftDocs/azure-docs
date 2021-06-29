---
title: Azure Virtual Desktop environment - Azure
description: Learn about the basic elements of a Azure Virtual Desktop environment, like host pools and app groups.
author: Heidilohr
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: femila
---
# Azure Virtual Desktop environment

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/environment-setup-2019.md).

Azure Virtual Desktop is a service that gives users easy and secure access to their virtualized desktops and RemoteApps. This topic will tell you a bit more about the general structure of the Azure Virtual Desktop environment.

## Host pools

A host pool is a collection of Azure virtual machines that register to Azure Virtual Desktop as session hosts when you run the Azure Virtual Desktop agent. All session host virtual machines in a host pool should be sourced from the same image for a consistent user experience.

A host pool can be one of two types:

- Personal, where each session host is assigned to individual users.
- Pooled, where session hosts can accept connections from any user authorized to an app group within the host pool.

You can set additional properties on the host pool to change its load-balancing behavior, how many sessions each session host can take, and what the user can do to session hosts in the host pool while signed in to their Azure Virtual Desktop sessions. You control the resources published to users through app groups.

## App groups

An app group is a logical grouping of applications installed on session hosts in the host pool. An app group can be one of two types:

- RemoteApp, where users access the RemoteApps you individually select and publish to the app group
- Desktop, where users access the full desktop

By default, a desktop app group (named "Desktop Application Group") is automatically created whenever you create a host pool. You can remove this app group at any time. However, you can't create another desktop app group in the host pool while a desktop app group exists. To publish RemoteApps, you must create a RemoteApp app group. You can create multiple RemoteApp app groups to accommodate different worker scenarios. Different RemoteApp app groups can also contain overlapping RemoteApps.

To publish resources to users, you must assign them to app groups. When assigning users to app groups, consider the following things:

- A user can be assigned to both a desktop app group and a RemoteApp app group in the same host pool. However, users can only launch one type of app group per session. Users can't launch both types of app groups at the same time in a single session.
- A user can be assigned to multiple app groups within the same host pool, and their feed will be an accumulation of both app groups.

## Workspaces

A workspace is a logical grouping of application groups in Azure Virtual Desktop. Each Azure Virtual Desktop application group must be associated with a workspace for users to see the remote apps and desktops published to them.

## End users

After you've assigned users to their app groups, they can connect to a Azure Virtual Desktop deployment with any of the Azure Virtual Desktop clients.

## Next steps

Learn more about delegated access and how to assign roles to users at [Delegated Access in Azure Virtual Desktop](delegated-access-virtual-desktop.md).

To learn how to set up your Azure Virtual Desktop host pool, see [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

To learn how to connect to Azure Virtual Desktop, see one of the following articles:

- [Connect with Windows 10 or Windows 7](./user-documentation/connect-windows-7-10.md)
- [Connect with a web browser](./user-documentation/connect-web.md)
- [Connect with the Android client](./user-documentation/connect-android.md)
- [Connect with the macOS client](./user-documentation/connect-macos.md)
- [Connect with the iOS client](./user-documentation/connect-ios.md)