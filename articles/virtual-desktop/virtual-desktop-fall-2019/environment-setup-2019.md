---
title: Azure Virtual Desktop (classic) terminology - Azure
description: The terminology used for basic elements of a Azure Virtual Desktop (classic) environment.
author: Heidilohr
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
# Azure Virtual Desktop (classic) terminology

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../environment-setup.md).

Azure Virtual Desktop is a service that gives users easy and secure access to their virtualized desktops and applications. This topic will tell you a bit more about the general structure of the Azure Virtual Desktop environment.

## Tenants

The Azure Virtual Desktop tenant is the primary interface for managing your Azure Virtual Desktop environment. Each Azure Virtual Desktop tenant must be associated with the Azure Active Directory containing the users who will sign in to the environment. From the Azure Virtual Desktop tenant, you can begin creating host pools to run your users' workloads.

## Host pools

A host pool is a collection of Azure virtual machines that register to Azure Virtual Desktop as session hosts when you run the Azure Virtual Desktop agent. All session host virtual machines in a host pool should be sourced from the same image for a consistent user experience.

A host pool can be one of two types:

- Personal, where each session host is assigned to individual users.
- Pooled, where session hosts can accept connections from any user authorized to an application group within the host pool.

You can set additional properties on the host pool to change its load-balancing behavior, how many sessions each session host can take, and what the user can do to session hosts in the host pool while signed in to their Azure Virtual Desktop sessions. You control the resources published to users through application groups.

## Application groups

An application group is a logical grouping of applications installed on session hosts in the host pool. An application group can be one of two types:

- RemoteApp, where users access the applications you individually select and publish to the application group
- Desktop, where users access the full desktop

By default, a desktop application group (named "Desktop Application Group") is automatically created whenever you create a host pool. You can remove this application group at any time. However, you can't create another desktop application group in the host pool while a desktop application group exists. To publish an application, you must create a RemoteApp application group. You can create multiple RemoteApp application groups to accommodate different worker scenarios. Different RemoteApp application groups can also contain overlapping applications.

To publish resources to users, you must assign them to application groups. When assigning users to application groups, consider the following things:

- A user can't be assigned to both a desktop application group and a RemoteApp application group in the same host pool.
- A user can be assigned to multiple application groups within the same host pool, and their feed will be an accumulation of both application groups.

## Tenant groups

In Azure Virtual Desktop, the Azure Virtual Desktop tenant is where most of the setup and configuration happens. The Azure Virtual Desktop tenant contains the host pools, application groups, and application group user assignments. However, there may be certain situations where you need to manage multiple Azure Virtual Desktop tenants at once, particularly if you're a Cloud Service Provider (CSP) or a hosting partner. In these situations, you can use a custom Azure Virtual Desktop tenant group to place each of the customers' Azure Virtual Desktop tenants and centrally manage access. However, if you're only managing a single Azure Virtual Desktop tenant, the tenant group concept doesn't apply and you can continue to operate and manage your tenant that exists in the default tenant group.

## End users

After you've assigned users to their application groups, they can connect to a Azure Virtual Desktop deployment with any of the Azure Virtual Desktop clients.

## Next steps

Learn more about delegated access and how to assign roles to users at [Delegated Access in Azure Virtual Desktop](delegated-access-virtual-desktop-2019.md).

To learn how to set up your Azure Virtual Desktop tenant, see [Create a tenant in Azure Virtual Desktop](tenant-setup-azure-active-directory.md).

To learn how to connect to Azure Virtual Desktop, see one of the following articles:

- [Connect from the Windows Desktop client](connect-windows-2019.md)
- [Connect from a web browser](connect-web-2019.md)
