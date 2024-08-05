---
title: 'Configure P2S VPN clients: certificate authentication: Windows native client'
titleSuffix: Azure VPN Gateway
description: Learn how to configure the native VPN client on a Windows computer for point-to-site certificate authentication connections.
author: cherylmc
ms.topic: how-to
ms.service: azure-vpn-gateway
ms.date: 05/14/2024
ms.author: cherylmc
---

# Configure native VPN client client for P2S certificate authentication connections - Windows

If your point-to-site (P2S) VPN gateway is configured to use IKEv2/SSTP and certificate authentication, you can connect to your virtual network using the native VPN client that's part of your Windows operating system. This article walks you through the steps to configure the native VPN client and connect to your virtual network.

## Before you begin

Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for VPN Gateway point-to-site VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and an IKEv2/SSTP tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](vpn-gateway-howto-point-to-site-resource-manager-portal.md#profile-files) for steps.
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Workflow

The workflow for this article is as follows:

1. Generate and install client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the native VPN client that's already installed on your Windows computer.
1. Connect to Azure.

## Generate and install client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

In many cases, you can install the client certificate directly on the client computer by double-clicking. However, for certain OpenVPN client configurations, you might need to extract information from the client certificate in order to complete the configuration.

* For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

### Install the client certificate

Each computer needs a client certificate in order to authenticate. If the client certificate isn't already installed on the local computer, you can install it using the following steps:

1. Locate the client certificate. For more information about client certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).
1. Install the client certificate. Typically, you can do this by double-clicking the certificate file and providing a password (if required).

## View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For certificate authentication and IKEv2/SSTP, you'll see the following files:

* **WindowsAmd64** and **WindowsX86** contain the Windows 64-bit and 32-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just AMD.
* **Generic** contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder isn’t present.

## Configure the VPN client profile

To connect, you'll first need to configure the VPN client with the required settings. You do this by configuring the VPN client profile using the settings contained in the VPN client configuration package. The settings in the package are specific to the VPN gateway to which you connect.

You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the point-to-site section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).

> [!NOTE]
> You must have Administrator rights on the Windows client computer from which you want to connect.

### Install the VPN client configuration package

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.
1. Double-click the package to install it. If you see a SmartScreen popup, select **More info**, then **Run anyway**.

## Connect

Connect to your virtual network via point-to-site VPN.

1. Go to the **VPN** settings and locate the VPN connection that you created. It's the same name as your virtual network. Select **Connect**. A pop-up message might appear. Select **Continue** to use elevated privileges.
1. On the **Connection status** page, select **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it isn't, use the drop-down arrow to select the correct certificate, and then select **OK**.

## Next steps

Follow up with any additional server or connection settings. See [Point-to-site configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).