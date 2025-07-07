---
title: Configure User VPN P2S clients - certificate authentication - Windows native client
titleSuffix: Azure Virtual WAN
description: Learn how to configure the native VPN client on a Windows computer for User VPN (point-to-site) certificate authentication connections.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 02/07/2025
ms.author: cherylmc
---

# Configure native VPN client for User VPN P2S certificate authentication connections - Windows

If your User VPN point-to-site (P2S) gateway is configured to use IKEv2/SSTP and certificate authentication, you can connect to your virtual network using the native VPN client that's part of your Windows operating system. This article walks you through the steps to configure the native VPN client and connect to your virtual network.

The VPN client configuration files that you generate are specific to the P2S User VPN gateway configuration. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect.

## Before you begin

This article applies to Windows operating system clients. Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for User VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Create User VPN point-to-site connections](virtual-wan-point-to-site-portal.md) article. Your User VPN configuration must use certificate authentication and the OpenVPN tunnel type.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Generate VPN client configuration files](virtual-wan-point-to-site-portal.md#download).
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Workflow

The workflow for this article is as follows:

1. Generate and install client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the native VPN client that's already installed on your Windows computer.
1. Connect to Azure.

## <a name="certificates"></a>Install client certificates

When your User VPN configuration settings are configured for certificate authentication, in order to authenticate, a client certificate must be installed on each connecting client computer. Later in this article, you specify the client certificates that you install in this section. The client certificate that you install must have been exported with its private key, and must contain all certificates in the certification path.

* For steps to generate a client certificate, see [Generate and export certificates](certificates-point-to-site.md#clientcert).

* For steps to install a client certificate see [Install client certificates](install-client-certificates.md).

* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

## <a name="generate"></a>View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For certificate authentication and IKEv2/SSTP, you'll see the following files:

* **WindowsAmd64** and **WindowsX86** contain the Windows 64-bit and 32-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just AMD.
* **Generic** contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder isn’t present.

## <a name="native"></a>Connect

If you specified the IKEv2 VPN tunnel type for the User VPN configuration, you can connect using the Windows native VPN client already installed on your computer.

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.

1. Double-click the package to install it. If you see a SmartScreen popup, select **More info**, then **Run anyway**.

1. On the client computer, go to your VPN page and select the connection that you configured. Then, click **Connect**.

## Next steps

To modify additional P2S User VPN connection settings, see [Tutorial: Create a P2S User VPN connection](virtual-wan-point-to-site-portal.md).
