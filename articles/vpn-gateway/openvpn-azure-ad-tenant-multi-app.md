---
title: 'How to create an Azure AD tenant for P2S OpenVPN protocol connections: Azure AD authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to set up an Azure AD tenant for P2S OpenVPN authentication and register multiple apps in Azure AD to allow different access for different users and groups.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 05/05/2021
ms.author: cherylmc

---
# Create an Active Directory (AD) tenant for P2S OpenVPN protocol connections

When you connect to your VNet using Point-to-Site, you have a choice of which protocol to use. The protocol you use determines the authentication options that are available to you. If you want to use Azure Active Directory authentication, you can do so when using the OpenVPN protocol. If you want different set of users to be able to connect to different VPN gateways, you can register multiple apps in AD and link them to different VPN gateways. This article helps you set up an Azure AD tenant for P2S OpenVPN and create and register multiple apps in Azure AD for allowing different access for different users and groups. For more information about Point-to-Site protocols and authentication, see [About Point-to-Site VPN](point-to-site-about.md).

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

[!INCLUDE [create](../../includes/openvpn-azure-ad-tenant-multi-app.md)]

## <a name="enable-authentication"></a>6. Enable authentication on the gateway

In this step, you will enable Azure AD authentication on the VPN gateway.

1. Enable Azure AD authentication on the VPN gateway by navigating to **Point-to-site configuration** and picking **OpenVPN (SSL)** as the **Tunnel type**. Select **Azure Active Directory** as the **Authentication type** then fill in the information under the **Azure Active Directory** section.

    ![Azure portal view](./media/openvpn-azure-ad-tenant-multi-app/azure-ad-auth-portal.png)

    > [!NOTE]
    > Do not use the Azure VPN client's application ID: It will grant all users access to the VPN gateway. Use the ID of the application(s) you registered.

2. Create and download the profile by clicking on the **Download VPN client** link.

3. Extract the downloaded zip file.

4. Browse to the unzipped “AzureVPN” folder.

5. Make a note of the location of the “azurevpnconfig.xml” file. The azurevpnconfig.xml contains the setting for the VPN connection and can be imported directly into the Azure VPN Client application. You can also distribute this file to all the users that need to connect via e-mail or other means. The user will need valid Azure AD credentials to connect successfully.

## Next steps

In order to connect to your virtual network, you must create and configure a VPN client profile. See [Configure a VPN client for P2S VPN connections](openvpn-azure-ad-client.md).
