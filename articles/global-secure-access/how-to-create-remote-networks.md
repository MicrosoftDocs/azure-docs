---
title: How to create remote networks
description: Learn how to create remote networks for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 06/01/2023
ms.service: network-access
ms.custom: 
---
# Create remote networks

Remote networks are remote locations, such as a branch location, or networks that require internet connectivity. Setting up remote networks connects your users in remote locations to Global Secure Access. Once a remote network is configured, you can assign a traffic forwarding profile to manage your corporate network traffic.

This article explains how to create a remote network for Global Secure Access.

> [!IMPORTANT]
> At this time, remote networks can only be assigned to the Microsoft 365 traffic forwarding profile. The Private access traffic forwarding profile requires that your end users connect to Global Secure Access with the Global Secure Access client.

## Prerequisites

- **Microsoft Entra Internet Access Premium license** for your Microsoft Entra ID tenant
- **Global Secure Access Administrator** role in Microsoft Entra ID
- The **Microsoft Graph** module must be installed to use PowerShell
- Administrator consent is required when using Microsoft Graph Explorer for the Microsoft Graph API

## Create a remote network
Global Secure Access provides remote network connectivity so you can connect a remote network to Global Secure Access. Network security policies are then applied on all outbound traffic. 

There are multiple ways to connect remote networks to Global Secure Access. In a nutshell, you're creating an Internet Protocol Security (IPSec) tunnel between a core router at your remote network and the nearest Microsoft VPN service. The network traffic is routed with the core router at the remote network so installation of a client isn't required on individual devices.

Remote networks are configured on three tabs. To work through each tab, either select the tab from the top of the page, or select the **Next** button at the bottom of the page.

### Basics
The first step is to provide the basic details of your remote network, including the name, location, and bandwidth capacity. Completing this tab is required to create a new remote network.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Secure Access Administrator. 
1. Browse to **Devices** > **Remote networks**.
1. Select the **Create remote network** button and provide the following details:
    - **Name**
    - **Region**
    - **Bandwidth capacity** must be 250, 500, 750, or 1000 mbps.

### Connectivity

The connectivity tab is where you add the device links for the remote network. You need to provide the device type, IP address, border gateway protocol (BGP) address, and autonomous system number (ASN) for each device link. You can add device links after creating the remote network. For more information on device links, see [How to manage remote network device links](how-to-manage-remote-network-device-links.md).

1. Select the **Add a link** button. The **Add a link pane** opens with three tabs to complete.

**General**

1. Enter the following details: 
    - **Link name**: Name of your CPE.
    - **Device type**: Choose one of the options from the dropdown list.
    - **IP address**: Public IP address of your device.
    - **Link BGP address**: The border gateway protocol address of the CPE.
    - **Link ASN**: Provide the autonomous system number of the CPE. For more information, see the **Valid ASNs** section of the [Remote network configurations](reference-remote-network-configurations.md) article.
1. Select the **Next** button.

**Details**

1. Select either **IKEv2** or **IKEv1**. 
1. The IPSec/IKE policy is set to **Default** but you can change to **Custom**.
    - If you select **Custom** you must use a combination of settings that are supported by Global Secure Access.
    - The valid configurations you can use are mapped out in the [Remote network valid configurations](reference-remote-network-configurations.md) reference article.

1. Select the **Next** button.

**Security**

1. Enter a pre-shared key to be used on your CPE.
1. Select the **Add link** button. 

### Traffic profiles

You can assign the remote network to a traffic forwarding profile when you create the remote network. You can also assign the remote network at a later time. For more information, see [Traffic forwarding profiles](concept-traffic-forwarding.md).

1. Select the appropriate traffic forwarding profile.
1. Select the **Review + Create** button.

## Next steps

- [List remote networks](how-to-list-remote-networks.md)
- [Manage remote networks](how-to-manage-remote-networks.md)
- [Learn how to add remote network device links](how-to-manage-remote-network-device-links.md)
