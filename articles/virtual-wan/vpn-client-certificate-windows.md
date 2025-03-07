---
title: 'Configure User VPN clients: certificate authentication: Azure VPN client: Windows'
titleSuffix: Azure Virtual WAN
description: Learn how to configure the Azure VPN Client on a Windows operating system for P2S configurations that use certificate authentication.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 02/07/2025
ms.author: cherylmc
---

# Configure Azure VPN Client for User VPN P2S certificate authentication connections - Windows

If your User VPN point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the Azure VPN Client. This article walks you through the steps to configure the **Azure VPN Client** and connect to your virtual network.

This article applies to Windows operating system clients. For more information about other VPN client configuration articles, see the following table:

## Before you begin

Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for Virtual WAN point-to-site VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

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
1. Configure the Azure VPN Client.
1. Connect to Azure.

## <a name="certificates"></a>Install client certificates

When your User VPN configuration settings are configured for certificate authentication, in order to authenticate, a client certificate must be installed on each connecting client computer. Later in this article, you specify the client certificates that you install in this section. The client certificate that you install must have been exported with its private key, and must contain all certificates in the certification path.

* For steps to generate a client certificate, see [Generate and export certificates](certificates-point-to-site.md#clientcert).

* For steps to install a client certificate see [Install client certificates](install-client-certificates.md).

* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

## <a name="generate"></a>View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the P2S VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For Certificate authentication and OpenVPN, you'll see the **AzureVPN** folder. In this folder, you'll see either the **azurevpnconfig_cert.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. The .xml file contains the settings you use to configure the VPN client profile.

If you don't see either file, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that certificate authentication is selected.

### Download the Azure VPN Client

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

### Configure the Azure VPN Client profile

[!INCLUDE [Configure the Azure VPN client](../../includes/vpn-gateway-vwan-configure-azure-vpn-client-certificate.md)]

## Next steps

To modify additional P2S User VPN connection settings, see [Tutorial: Create a P2S User VPN connection](virtual-wan-point-to-site-portal.md).
