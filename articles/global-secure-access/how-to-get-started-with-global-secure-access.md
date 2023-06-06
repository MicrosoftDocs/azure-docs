---
title: Get started with Global Secure Access
description: Get started with Global Secure Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 05/26/2023
ms.service: network-access
ms.custom: 
---

# Get started with Global Secure Access

Global Secure Access is the centralized location in the Microsoft Entra admin center where you can configure and manage Microsoft Entra Private Access and Microsoft Entra Internet Access. Many features and settings apply to both services, but some are specific to one or the other.

This guide will help you get started configuring both services for the first time.

## Microsoft Entra Private Access

Microsoft Entra Private Access provides a secure, zero-trust access solution for accessing internal resources without requiring a VPN. You determine the sites and applications that you want routed through Microsoft Entra Private Access by configuring quick access and enabling the private access traffic forwarding profile. At this time, the Global Secure Access client must be installed on end-user devices to use Microsoft Entra Private Access.

To set up Microsoft Entra Private Access, complete the following steps:

1. [Configure quick access to your private resources](how-to-configure-quick-access.md)
1. [Manage the Private access traffic forwarding profile](how-to-manage-private-access-profile.md)
1. [Install the Global Secure Access client on end-user devices](how-to-install-windows-client.md)

## Microsoft Entra Internet Access

Microsoft Entra Internet Access isolates the traffic for Microsoft 365 applications and resources, such as Exchange Online and SharePoint Online. Users can access these resources by connecting to the Global Secure Access client or through a remote network, such as in a branch office location.

To set up Microsoft Entra Internet Access, complete the following steps:

1. [Manage the Microsoft 365 traffic forwarding profile](how-to-manage-microsoft-365-profile.md)
1. [Create a remote network](how-to-manage-remote-networks.md)
1. [Add device links to your remote network](how-to-manage-remote-network-device-links.md)
1. [Install the Global Secure Access client on end-user devices](how-to-install-windows-client.md)

## Common platform settings

With your core settings configured you should take advantage of the following features to help you get the most of the Global Secure Access services.

- [Configure Conditional Access policies](how-to-target-resource.md)
- [Enable source IP restoration](how-to-source-ip-restoration.md)
- [Review the Global Secure Access logs](concept-global-secure-access-logs-monitoring.md)

## Get started wizard

When setting up the features of Global Secure Access for the first time, you can use the "Getting Started Wizard" in the Microsoft Entra admin center.

The wizard is organized into required tasks and recommended tasks. The required tasks are the minimum configuration needed to get started with Global Secure Access. The recommended tasks are optional, but are recommended to get the most out of the service.

### Required tasks

The required tasks are broken down into two categories:
- Determine *which* traffic is forwarded
- Determine *how* traffic is forwarded

#### Enable traffic forwarding profiles

**Traffic forwarding profiles** are used to manage the network traffic that you want to route through Global Secure Access. Select the link to configure your traffic forwarding profiles.

For more information, see [Global Secure Access traffic forwarding profiles](concept-traffic-forwarding.md).

![Screenshot of the enable traffic forwarding profiles options.](media/how-to-get-started-with-global-secure-access/wizard-start-traffic-forwarding-profiles.png)

**To enable traffic forwarding profiles**:

1. Select the **Enable Forwarding profiles** link to configure your traffic forwarding profiles.
1. Follow the documentation to configure your [Microsoft 365 profile](how-to-manage-microsoft-365-profile.md) or your [private access profile](how-to-manage-private-access-profile.md).
1. Either select the breadcrumb at the top of the page or close the window using the **X** in the upper-right corner.

#### Install the client or configure remote networks

For traffic to get routed through Global Secure Access, your users must either be connected to a **remote networks** that is configured to use Global Secure Access or **install the Global Secure Access client** on their Windows devices. Select the link to configure your remote networks or install the Global Secure Access client. For Microsoft Entra Private Access, you must install the Windows client on end-user devices.

- [How to configure remote networks](how-to-manage-remote-networks.md)
- [How to install the Windows client](how-to-install-windows-client.md)

![Screenshot of the install client and create remote networks options.](media/how-to-get-started-with-global-secure-access/wizard-client-install-branch-locations.png)

**To install the Windows client**:

1. Select the **Install Global Secure Access Client** link.
1. Follow the steps in the [How to install the Windows client](how-to-install-windows-client.md) article.
1. Either select the breadcrumb at the top of the page or close the window using the **X** in the upper-right corner.

**To configure remote networks**:

1. Select the **Configure remote networks** link.
1. Follow the steps in the [How to configure remote networks](how-to-manage-remote-networks.md) article.
1. Either select the breadcrumb at the top of the page or close the window using the **X** in the upper-right corner.

### Recommended tasks

With your core settings in place, you can configure access controls and security measures. You can also set up log streaming to send logs to your SIEM or other log management solution.

#### Apps, access control, and session management

Select the **Apply Conditional Access to the network** link to configure adaptive access controls. Enabling this setting creates a new Named Location in Conditional Access and silently enables source IP restoration. For more information on these concepts, se the following articles:

- [How to enable compliant network check](how-to-compliant-network.md)
- [How to enable source IP restoration](how-to-source-ip-restoration.md)

Select the **Prevent data exfiltration using tenant restrictions** to enable tenant restrictions. Enabling this feature prevents external, unsanctioned users from accessing your internal resources. For more information, see [How to enable tenant restrictions](how-to-universal-tenant-restrictions.md).

You can configure adaptive access controls and universal tenant restrictions from **Global Secure Access** > **Global settings** > **Session management**.

![Screenshot of the session management options in Global Secure Access.](media/how-to-get-started-with-global-secure-access/session-management.png)

Select the **Enable Quick Access to your private resources** to configure your Quick access settings. Quick access provides the ability to identify the internal, private apps and websites that you want to include in your private access traffic profile. For more information, see the following articles:

- [Learn about traffic forwarding profiles](concept-traffic-forwarding.md)
- [How to configure quick access](how-to-configure-quick-access.md)

#### Configure enhanced monitoring and logging

Select the link.

## Next steps

- [Learn about remote network connectivity](concept-remote-network-connectivity.md)
- [Configure quick access](how-to-configure-quick-access.md)

