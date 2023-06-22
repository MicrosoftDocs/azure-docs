---
title: Get started with Global Secure Access (preview)
description: Get started with Global Secure Access (preview) for Microsoft Entra.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/09/2023
ms.service: network-access
ms.custom: 
---
# Get started with Global Secure Access

Global Secure Access (preview) is the centralized location in the Microsoft Entra admin center where you can configure and manage Microsoft Entra Private Access and Microsoft Entra Internet Access. Many features and settings apply to both services, but some are specific to one or the other.

This guide helps you get started configuring both services for the first time.

## Prerequisites

Administrators who interact with **Global Secure Access preview** features must have the [Global Secure Access Administrator role](../active-directory/roles/permissions-reference.md). Some features may also require the [Global Administrator role](../active-directory/roles/permissions-reference.md#global-administrator). To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-configure.md) to activate just-in-time privileged role assignments.

A working Microsoft Entra ID tenant with the appropriate license is required. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Global Secure Access is dependent upon some features that require additional licensing.

### Known limitations

- Global Secure Access is currently available in North America and Europe.
- At this time, only IPv4 addresses are supported.

## Microsoft Entra Internet Access

Microsoft Entra Internet Access isolates the traffic for Microsoft 365 applications and resources, such as Exchange Online and SharePoint Online. Users can access these resources by connecting to the Global Secure Access Client or through a remote network, such as in a branch office location.

To set up Microsoft Entra Internet Access, complete the following steps:

1. [Enable the Microsoft 365 traffic forwarding profile](how-to-manage-microsoft-365-profile.md).
1. [Install and configure the Global Secure Access Client on end-user devices](how-to-install-windows-client.md).
1. [Enable universal tenant restrictions](how-to-universal-tenant-restrictions.md).
1. [Enable enhanced Global Secure Access signaling](how-to-source-ip-restoration.md#enable-global-secure-access-signaling-for-conditional-access).

Optionally: 

- [Create a remote network](how-to-manage-remote-networks.md).
- [Target the Microsoft 365 traffic profile with Conditional Access policy](how-to-target-resource-microsoft-365-profile.md).
- [Review the Global Secure Access logs](concept-global-secure-access-logs-monitoring.md).

## Microsoft Entra Private Access

Microsoft Entra Private Access provides a secure, zero-trust access solution for accessing internal resources without requiring a VPN. Configure Quick Access and enable the Private access traffic forwarding profile to specify the sites and apps you want routed through Microsoft Entra Private Access. At this time, the Global Secure Access Client must be installed on end-user devices to use Microsoft Entra Private Access.

To set up Quick Access for broader access to your network using Microsoft Entra Private Access, complete the following steps:

1. [Configure an App Proxy connector and connector group](how-to-configure-connectors.md).
1. [Configure Quick Access to your private resources](how-to-configure-quick-access.md).
1. [Enable the Private Access traffic forwarding profile](how-to-manage-private-access-profile.md).
1. [Install and configure the Global Secure Access Client on end-user devices](how-to-install-windows-client.md).

To create specific private apps for granular segmented access to private access resources using Microsoft Entra Private Access, complete the following steps:

1. [Configure an App Proxy connector and connector group](how-to-configure-connectors.md).
1. [Create a private Global Secure Access application](how-to-configure-per-app-access.md).
1. [Enable the Private Access traffic forwarding profile](how-to-manage-private-access-profile.md).
1. [Install and configure the Global Secure Access Client on end-user devices](how-to-install-windows-client.md).

Optionally:

- [Secure Quick Access applications with Conditional Access policies](how-to-target-resource-private-access-apps.md).
- [Review the Global Secure Access logs](concept-global-secure-access-logs-monitoring.md).

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Learn about remote network connectivity](concept-remote-network-connectivity.md)
- [Configure quick access](how-to-configure-quick-access.md)
