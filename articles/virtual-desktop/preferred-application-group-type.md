---
title: Preferred application group type behavior for pooled host pools in Azure Virtual Desktop
description: Learn how setting a preferred application group type for pooled host pools determines the desktops and applications users can connect to.
ms.topic: concept-article
author: dknappettmsft
ms.author: daknappe
ms.date: 06/07/2024
---

# Preferred application group type behavior for pooled host pools in Azure Virtual Desktop

An application group is a logical grouping of applications that are available on session hosts in a host pool. Application groups control whether a full desktop or which applications from a host pool are available to users to connect to. An application group can only be assigned to a single host pool, but you can assign multiple application groups to the same host pool. Users can be assigned to multiple application groups across multiple host pools, which enable you to vary the applications and desktops that users can access.

When you create an application group, it can be one of two types:

- **Desktop**: users access the full Windows desktop from a session host. Available with pooled or personal host pools.

- **RemoteApp**: users access individual applications you select and publish to the application group. Available with pooled host pools only.

With pooled host pools, you can assign both application group types to the same host pool at the same time. You can only assign a single desktop application group with a host pool, but you can also assign multiple RemoteApp application groups to the same host pool.

Users assigned to multiple RemoteApp application groups assigned to the same host pool have access to an aggregate of all the applications in the application groups they're assigned to.

To help prevent users from connecting to a desktop and RemoteApp application at the same time from application groups assigned to the same host pool, pooled host pools have the setting **Preferred application group type**. This setting determines whether users have access to the full desktop or RemoteApp applications from this host pool in Windows App or the Remote Desktop app, should they be assigned to an application group of each type to the same host pool.

> [!IMPORTANT]
> Users who have access to both a desktop application group and RemoteApp application group assigned to the same host pool only have access to the type of applications from the application group determined by the preferred application group type for the host pool. It doesn't prevent a user from having access to the full desktop and RemoteApp applications from different host pools, or different users from having access to different application group types from the same host pool.

You must specify the preferred application group type for a host pool at the point of creation. Additionally, when creating a host pool using the Azure portal there are two default behaviors, which don't happen when creating a host pool using a different method, such as Azure PowerShell or Azure CLI. These default behaviors are:

- The default preferred application group type selected using the Azure portal is **Desktop**. You can change this setting when you create the host pool or after the host pool is created.

- A desktop application group is automatically created and assigned to the host pool, regardless of whether you select the preferred application group type as **Desktop** or **RemoteApp**. The name of the application group is formed of the host pool name with the suffix `-DAG`, for example `hp01-DAG`. You can remove this application group after the host pool is created if you only want to use RemoteApp applications. You can only have one desktop application group associated with a host pool at a time.

## Enforcing a preferred application group type

Previously, host pools could be created without a preferred application group type set. In this scenario, a user who has access to both a desktop application group and RemoteApp application group assigned to the same host pool has access to both sets of resources in Windows App or the Remote Desktop app. If that user connects to a desktop and a RemoteApp application from those application groups at the same time, they can end up with two different sessions to the same host pool.

To prevent this scenario, set the preferred application group type for each host pool to either **Desktop** or **RemoteApp**. To learn how to set the preferred application group type, see [Set the preferred application group type for a pooled host pool in Azure Virtual Desktop](set-preferred-application-group-type.md).

For host pools that still don't have a preferred application group type set, where a user has access to both a desktop application group and RemoteApp application group assigned to the same host pool, Windows App or the Remote Desktop app now only shows the desktop resource. The **Desktop** preferred application group type is enforced. Windows App or the Remote Desktop app doesn't show the RemoteApp applications from the RemoteApp application group.

> [!IMPORTANT]
> The enforcement of the **Desktop** preferred application group type for host pools that don't have a preferred application group type set is currently rolling out to all Azure regions.

It's still possible to connect to both the desktop and RemoteApp applications from the same host pool using the [ms-avd:connect URI scheme](uri-scheme.md) regardless of the preferred application group type, but we don't recommend this approach. If a user ends up with two different sessions to the same host pool, it can cause a negative experience and session performance for that user and other users, including:

- Session hosts become overloaded
- Users get stuck when trying to sign in
- Connections to a remote session aren't successful
- The remote session turns black
- Applications crash

## Expected behavior

Here's a matrix of the expected behavior for the resources users see in Windows App or the Remote Desktop app based on the preferred application group type setting of a host pool, the application groups assigned to the host pool and their type, and user assignments to the application groups:

| Application group types assigned to a single host pool | User assigned to application group types | Host pool preferred application group type setting | Resources shown |
|--|--|--|--|
| Desktop only | Desktop | Desktop or RemoteApp | Desktop |
| RemoteApp only | RemoteApp | Desktop or RemoteApp | RemoteApp applications |
| Desktop and RemoteApp | Desktop | Desktop or RemoteApp | Desktop |
| Desktop and RemoteApp | RemoteApp | Desktop or RemoteApp | RemoteApp applications |
| Desktop and RemoteApp | Both desktop and RemoteApp | Desktop | Desktop |
| Desktop and RemoteApp | Both desktop and RemoteApp | RemoteApp | RemoteApp applications |
| Desktop and RemoteApp | Both desktop and RemoteApp | None | Desktop |

## Example scenarios

Here are some example scenarios that show how the preferred application group type setting affects which types of remote resources are shown to users.

### Scenario 1

In this scenario, a desktop application group and a RemoteApp application group are assigned to the same host pool `hp01`. User Tim is in the *finance* security group, which is assigned to the desktop application group. User Gabriella is in the *legal* security group, which is assigned to the RemoteApp application group.

The preferred application group type for host pool `hp01` isn't relevant as users in the finance security group only have access to the desktop application group and users in the legal security group only have access to the RemoteApp application group. In Windows App or the Remote Desktop app, Tim is shown the desktop, and Gabriella is shown the RemoteApp applications.

### Scenario 2

In this scenario, a desktop application group and a RemoteApp application group are assigned to the same host pool `hp01`. User Tim is in the *finance* security group, which is assigned to the desktop application group. User Gabriella is in the *legal* security group, which is assigned to both the desktop and RemoteApp application groups.

The preferred application group type for host pool `hp01` is set to **Desktop**. In Windows App or the Remote Desktop app, both Tim and Gabriella are shown the desktop. Gabriella isn't shown any RemoteApp applications.

### Scenario 3

In this scenario, a desktop application group is assigned to host pool `hp01` and a RemoteApp application group is assigned to host pool `hp02`. User Tim is in the *finance* security group and user Gabriella is in the *legal* security group. Both security groups are assigned to the desktop application group and RemoteApp application group.

The preferred application group type for host pool `hp01` is set to **Desktop** and the preferred application group type for host pool `hp02` is set to **RemoteApp**. In Windows App or the Remote Desktop app, Tim and Gabriella are shown both desktop and RemoteApp applications.

## Next step

To learn how to set the preferred application group type, see [Set the preferred application group type for a pooled host pool in Azure Virtual Desktop](set-preferred-application-group-type.md).
