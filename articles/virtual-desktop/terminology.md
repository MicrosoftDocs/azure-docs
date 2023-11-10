---
title: Azure Virtual Desktop terminology - Azure
description: Learn about the basic elements of Azure Virtual Desktop, like host pools, application groups, and workspaces.
author: Heidilohr
ms.topic: conceptual
ms.date: 11/01/2023
ms.author: helohr
manager: femila
---
# Azure Virtual Desktop terminology

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/environment-setup-2019.md).

Azure Virtual Desktop is a service that gives users easy and secure access to their virtualized desktops and applications. This topic will tell you a bit more about the terminology and general structure of Azure Virtual Desktop.

## Host pools

A host pool is a collection of Azure virtual machines that register to Azure Virtual Desktop as session hosts when you run the Azure Virtual Desktop agent. All session host virtual machines in a host pool should be sourced from the same image for a consistent user experience. You control the resources published to users through application groups.

A host pool can be one of two types:

- Personal, where each session host is assigned to an individual user. Personal host pools provide dedicated desktops to end-users that optimize environments for performance and data separation. 

- Pooled, where user sessions can be load balanced to any session host in the host pool. There can be multiple different users on a single session host at the same time. Pooled host pools provide a shared remote experience to end-users, which ensures lower costs and greater efficiency. 

The following table goes into more detail about the differences between each type of host pool:

|Feature|Personal host pools|Pooled host pools|
|---|---|---|
|Load balancing| User sessions are always load balanced to the session host the user is assigned to. If the user isn't currently assigned to a session host, the user session is load balanced to the next available session host in the host pool. | User sessions are load balanced to session hosts in the host pool based on user session count. You can choose which [load balancing algorithm](host-pool-load-balancing.md) to use: breadth-first or depth-first. |
|Maximum session limit| One. | As configured by the **Max session limit** value of the properties of a host pool. Under high concurrent connection load when multiple users connect to the host pool at the same time, the number of sessions created on a session host can exceed the maximum session limit. |
|User assignment process| Users can either be directly assigned to session hosts or be automatically assigned to the first available session host. Users always have sessions on the session hosts they are assigned to. | Users aren't assigned to session hosts. After a user signs out and signs back in, their user session might get load balanced to a different session host. |
|Scaling| [Autoscale](autoscale-scaling-plan.md) for personal host pools starts session host virtual machines according to schedule or using Start VM on Connect and then deallocates/hibernates session host virtual machines based on the user session state (log off/disconnect). | [Autoscale](autoscale-scaling-plan.md) for pooled host pools turns VMs on and off based on the capacity thresholds and schedules the customer defines. |
|Windows Updates|Updated with Windows Updates, [System Center Configuration Manager (SCCM)](configure-automatic-updates.md), or other software distribution configuration tools.|Updated by redeploying session hosts from updated images instead of traditional updates.|
|User data| Each user only ever uses one session host, so they can store their user profile data on the operating system (OS) disk of the VM. | Users can connect to different session hosts every time they connect, so they should store their user profile data in [FSLogix](/fslogix/configure-profile-container-tutorial). |

### Validation environment

You can set a host pool to be a *validation environment*. Validation environments let you monitor service updates before the service applies them to your production or non-validation environment. Without a validation environment, you may not discover changes that introduce errors, which could result in downtime for users in your production environment.

To ensure your apps work with the latest updates, the validation environment should be as similar to host pools in your non-validation environment as possible. Users should connect as frequently to the validation environment as they do to the production environment. If you have automated testing on your host pool, you should include automated testing on the validation environment.

## Application groups

An application group is a logical grouping of applications installed on session hosts in the host pool.

An application group can be one of two types: 

- RemoteApp, where users access the applications you individually select and publish to the application group. Available with pooled host pools only.

- Desktop, where users access the full desktop. Available with pooled or personal host pools.
 
Pooled host pools have a preferred application group type that dictates whether users see RemoteApp or Desktop apps in their feed if both resources have been published to the same user. By default, Azure Virtual Desktop automatically creates a Desktop application group with the friendly name **Default Desktop** whenever you create a host pool and sets the host pool's preferred application group type to **Desktop**. You can remove the Desktop application group at any time. If you want your users to only see applications in their feed, you should set the **preferred application group type** value to **RemoteApp**. If you want your users to only see session desktops in their feed, you should set the **preferred application group type** value to **Desktop**. You can't create another Desktop application group in a host pool while a Desktop application group exists.

To publish resources to users, you must assign them to application groups. When assigning users to application groups, consider the following things:

- We don't support assigning both the RemoteApp and desktop application groups in a single host pool to the same user. Doing so will cause a single user to have two user sessions in a single host pool. Users aren't supposed to have two active user sessions at the same time, as this can cause the following things to happen:

    - The session hosts become overloaded
    - Users get stuck when trying to login
    - Connections won't work
    - The screen turns black
    - The application crashes
    - Other negative effects on end-user experience and session performance

- A user can be assigned to multiple application groups within the same host pool, and their feed will be an accumulation of both application groups.

- Personal host pools only allow and support Desktop application groups.

>[!NOTE]
>If your host pool’s *preferred application group type* is set to **Undefined**, that means you haven’t set the value yet. You must finish configuring your host pool by setting its *preferred application group type* before you start using it to prevent app incompatibility and session host overload issues.

## Workspaces

A workspace is a logical grouping of application groups in Azure Virtual Desktop. Each Azure Virtual Desktop application group must be associated with a workspace for users to see the desktops and applications published to them.

## End users

After you've assigned users to their application groups, they can connect to an Azure Virtual Desktop deployment with any of the Azure Virtual Desktop clients.

## User sessions

In this section, we'll go over each of the three types of user sessions that end users can have.

### Active user session

A user session is considered *active* when a user signs in and connects to their desktop or RemoteApp resource.

### Disconnected user session

A disconnected user session is an inactive session that the user hasn't signed out of yet. When a user closes the remote session window without signing out, the session becomes disconnected. When a user reconnects to their remote resources, they'll be redirected to their disconnected session on the session host they were working on. At this point, the disconnected session becomes an active session again.

### Pending user session

A pending user session is a placeholder session that reserves a spot on the load-balanced virtual machine for the user. Because the sign-in process can take anywhere from 30 seconds to five minutes depending on the user profile, this placeholder session ensures that the user won't be kicked out of their session if another user completes their sign-in process first.

## Next steps

Learn more about delegated access and how to assign roles to users at [Delegated Access in Azure Virtual Desktop](delegated-access-virtual-desktop.md).

To learn how to set up your Azure Virtual Desktop host pool, see [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

To learn how to connect to Azure Virtual Desktop, see one of the following articles:

- [Connect with Windows](./users/connect-windows.md)
- [Connect with the Azure Virtual Desktop Store app for Windows](./users/connect-windows-azure-virtual-desktop-app.md)
- [Connect with a web browser](./users/connect-web.md)
- [Connect with the Android client](./users/connect-android-chrome-os.md)
- [Connect with the macOS client](./users/connect-macos.md)
- [Connect with the iOS client](./users/connect-ios-ipados.md)
- [Connect with the Remote Desktop app for Windows](./users/connect-microsoft-store.md)
