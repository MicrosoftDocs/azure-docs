---
title: 'Configure User VPN P2S clients: certificate authentication: OpenVPN Client 2.x - Windows'
titleSuffix: Azure Virtual WAN
description: Learn how to configure User VPN clients for P2S configurations that use certificate authentication. This article applies to Windows and the OpenVPN Client 2.x series.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 01/29/2025
ms.author: cherylmc
---

# Configure OpenVPN 2.x client for P2S User VPN certificate authentication connections - Windows

If your point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the OpenVPN Client. This article walks you through the steps to configure the **OpenVPN client 2.4 and higher** and connect to your virtual network. For OpenVPN Connect 3.x clients, see [Configure OpenVPN 3.x client for P2S User VPN certificate authentication connections - Windows](point-to-site-vpn-client-certificate-windows-openvpn-client-version-3.md).

> [!NOTE]
> The OpenVPN client is independently managed and not under Microsoft's control. This means Microsoft doesn't oversee its code, builds, roadmap, or legal aspects. Should customers encounter any bugs or issues with the OpenVPN client, they should directly contact OpenVPN Inc. support. The guidelines in this article are provided 'as is' and haven't been validated by OpenVPN Inc. They are intended to assist customers who are already familiar with the client and wish to use it to connect to the Azure VPN Gateway in a Point-to-Site VPN setup.

## Before you begin

Before beginning, make sure you've configured a virtual WAN according to the steps in the [Create User VPN point-to-site connections](virtual-wan-point-to-site-portal.md) article. Your User VPN configuration must use certificate authentication.

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Create User VPN point-to-site connections](virtual-wan-point-to-site-portal.md) article. Your User VPN configuration must use certificate authentication.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Generate VPN client configuration files](virtual-wan-point-to-site-portal.md#p2sconfig).
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Connection requirements

To connect to Azure using the OpenVPN client using certificate authentication, each connecting client computer requires the following items:

* The Open VPN Client software must be installed and configured on each client computer.
* The client computer must have a client certificate that's installed locally.

### Workflow

The workflow for this article is:

1. Generate and install client certificates if you haven't done so already.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN client.
1. Connect to Azure.

## Generate and install client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

In many cases, you can install the client certificate directly on the client computer by double-clicking. However, for certain OpenVPN client configurations, you might need to extract information from the client certificate in order to complete the configuration.

* For steps to generate a client certificate, see [Generate and export certificates](certificates-point-to-site.md#clientcert).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

### Install the client certificate

Each computer needs a client certificate in order to authenticate. If the client certificate isn't already installed on the local computer, you can install it using the following steps:

1. Locate the client certificate. For more information about client certificates, see [Install client certificates](install-client-certificates.md).
1. Install the client certificate. Typically, you can install a certificate by double-clicking the certificate file and providing a password (if required).
1. You'll also use the client certificate later in this exercise to configure the OpenVPN Connect client profile settings.

## View client profile configuration files

The [VPN client profile configuration package](virtual-wan-point-to-site-portal.md#p2sconfig) contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For Certificate authentication and OpenVPN, you should see  the **OpenVPN** folder. If you don't see the folder, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra ID authentication, you might not have an OpenVPN folder. See the [Microsoft Entra ID](openvpn-azure-ad-client.md) configuration article instead.

## Configure the client

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-windows.md)]

## Next steps

To modify additional P2S User VPN connection settings, see [Tutorial: Create a P2S User VPN connection](virtual-wan-point-to-site-portal.md).
