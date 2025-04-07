---
title: Azure Virtual Desktop terminology - Azure
description: Learn about the basic elements of Azure Virtual Desktop, like host pools, application groups, and workspaces.
author: dknappettmsft
ms.topic: conceptual
ms.date: 10/01/2024
ms.author: daknappe
ms.custom: docs_inherited
---

# Azure Virtual Desktop terminology

Azure Virtual Desktop is a service that gives users easy and secure access to their virtualized desktops and applications. This article tells you a bit more about the terminology and general structure of Azure Virtual Desktop.

## Host pools

A host pool is a collection of Azure virtual machines that are registered to Azure Virtual Desktop as session hosts. All session host virtual machines in a host pool should be sourced from the same image for a consistent user experience. You control the resources published to users through application groups.

A host pool can be one of two types:

- *Personal*, where each session host is assigned to an individual user. Personal host pools provide dedicated desktops to end-users that optimize environments for performance and data separation.

- *Pooled*, where user sessions can be load balanced to any session host in the host pool. There can be multiple different users on a single session host at the same time. Pooled host pools provide a shared remote experience to end-users, which ensures lower costs and greater efficiency.

The following table goes into more detail about the differences between each type of host pool:

| Feature | Personal host pools | Pooled host pools |
|--|--|--|
| Load balancing | User sessions are always load-balanced to the session host the user is assigned to. If the user isn't currently assigned to a session host, the user session is load balanced to the next available session host in the host pool. | User sessions are load balanced to session hosts in the host pool based on user session count. You can choose which [load balancing algorithm](host-pool-load-balancing.md) to use: breadth-first or depth-first. |
| Maximum session limit | One. | As configured by the [maximum session limit](configure-host-pool-load-balancing.md) value of the properties of a host pool. Under high concurrent connection load, when multiple users connect to the host pool at the same time, the number of sessions created on a session host can exceed the maximum session limit. |
| User assignment process | Users can either be directly assigned to session hosts or be automatically assigned to the first available session host. Users always have sessions on the session hosts they're assigned to. | Users aren't assigned to session hosts. After a user signs out and signs back in, their user session might get load balanced to a different session host. To learn more, see [Configure personal desktop assignment](configure-host-pool-personal-desktop-assignment-type.md). |
| Scaling | [Autoscale](autoscale-scaling-plan.md) for personal host pools starts session host virtual machines according to schedule or using Start VM on Connect and then deallocates/hibernates session host virtual machines based on the user session state (log off/disconnect). | [Autoscale](autoscale-scaling-plan.md) for pooled host pools turns VMs on and off based on the capacity thresholds and schedules the customer defines. |
| Windows Updates | Updated with Windows Updates, [Microsoft Configuration Manager](configure-automatic-updates.md), or other software distribution configuration tools. | Updated by redeploying session hosts from updated images instead of traditional updates. |
| User data | Each user only ever uses one session host, so they can store their user profile data on the operating system (OS) disk of the VM. | Users can connect to different session hosts every time they connect, so they should store their user profile data in [FSLogix](/fslogix/configure-profile-container-tutorial). |

There are also two management approaches for host pools:

- *Session host configuration* (preview), where Azure Virtual Desktop manages the lifecycle of session hosts in a host pool for you using a combination of native features.

- *Standard*, where you manage creating, updating, and scaling session hosts in a host pool.

For more information, see [host pool management approaches](host-pool-management-approaches.md).

### Validation environment

You can set a host pool to be a [validation environment](configure-validation-environment.md). Validation environments let you monitor service updates before the service applies them to your production or non-validation environment. Without a validation environment, you might not discover changes that introduce errors, which could result in downtime for users in your production environment.

To ensure your apps work with the latest updates, the validation environment should be as similar to host pools in your non-validation environment as possible. Users should connect as frequently to the validation environment as they do to the production environment. If you automate testing on your host pool, you should include automated testing on the validation environment.

## Application groups

An application group controls access to a full desktop or a logical grouping of applications that are available on session hosts in a single host pool. Users can be assigned to multiple application groups across multiple host pools, which enable you to vary the applications and desktops that users can access.

When you create an application group, it can be one of two types:

- **Desktop**: users access the full Windows desktop from a session host. Available with pooled or personal host pools.

- **RemoteApp**: users access individual applications you select and publish to the application group. Available with pooled host pools only.

With pooled host pools, you can assign both application group types to the same host pool at the same time. You can only assign a single desktop application group per host pool, but you can also assign multiple RemoteApp application groups to the same host pool.

Host pools have a preferred application group type setting. If an end user has both a desktop and RemoteApp application groups assigned to them on the same host pool, they only see the resources from the preferred application group type. Users assigned to multiple RemoteApp application groups assigned to the same host pool have access to an aggregate of all the applications in the application groups they're assigned to.

To learn more about application groups, see [Preferred application group type behavior for pooled host pools](preferred-application-group-type.md).

## Workspaces

A workspace is a logical grouping of application groups. Each application group must be associated with a workspace for users to see the desktops and applications published to them. An application group can only be assigned to a single workspace.

## End users

After you assign users to their application groups, they can connect to an Azure Virtual Desktop deployment with any of the Azure Virtual Desktop clients.

## User sessions

In this section, we cover each of the three types of user sessions that end users can have.

### Active user session

A user session is considered *active* when a user signs in and connects to their desktop or RemoteApp resource.

### Disconnected user session

A disconnected user session is an inactive session that the user hasn't signed out of yet. When a user closes the remote session window without signing out, the session becomes disconnected. When a user reconnects to their remote resources, they're redirected to their disconnected session on the session host they were working on. At this point, the disconnected session becomes an active session again.

### Pending user session

A pending user session is a placeholder session that reserves a spot on the load-balanced virtual machine for the user. Because the sign-in process can take anywhere from 30 seconds to five minutes depending on the user profile, this placeholder session ensures that the user isn't kicked out of their session if another user completes their sign-in process first.

## Next step

Learn about [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).
