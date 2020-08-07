---
title: 'VPN Gateway: Azure AD tenant for different user groups: Azure AD authentication'
description: You can use P2S VPN to connect to your VNet using Azure AD authentication
services: vpn-gateway
author: anzaman

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 06/25/2020
ms.author: alzam

---
# Create an Azure Active Directory tenant for P2S OpenVPN protocol connections

When connecting to your VNet, you can use certificate-based authentication or RADIUS authentication. However, when you use the Open VPN protocol, you can also use Azure Active Directory authentication. If you want different set of users to be able to connect to different VPN gateways, you can register multiple apps in AD and link them to different VPN gateways. This article helps you set up an Azure AD tenant for P2S OpenVPN authentication and create and register multiple apps in Azure AD for allowing different access for different users and groups.

> [!NOTE]
> Azure AD authentication is supported only for OpenVPN® protocol connections.
>

[!INCLUDE [create](../../includes/openvpn-azure-ad-tenant-multi-app.md)]

## <a name="enable-authentication"></a>6. Enable authentication on the gateway

In this step, you will enable Azure AD authentication on the VPN gateway.

1. Enable Azure AD authentication on the VPN gateway by navigating to **Point-to-site configuration** and picking **OpenVPN (SSL)** as the **Tunnel type**. Select **Azure Active Directory** as the **Authentication type** then fill in the information under the **Azure Active Directory** section.

    ![Azure VPN](./media/openvpn-azure-ad-tenant-multi-app/azure-ad-auth-portal.png)

    > [!NOTE]
    > Do not use the Azure VPN client's application ID: It will grant all users access to the VPN gateway. Use the ID of the application(s) you registered.

2. Create and download the profile by clicking on the **Download VPN client** link.

3. Extract the downloaded zip file.

4. Browse to the unzipped “AzureVPN” folder.

5. Make a note of the location of the “azurevpnconfig.xml” file. The azurevpnconfig.xml contains the setting for the VPN connection and can be imported directly into the Azure VPN Client application. You can also distribute this file to all the users that need to connect via e-mail or other means. The user will need valid Azure AD credentials to connect successfully.

## Next steps

In order to connect to your virtual network, you must create and configure a VPN client profile. See [Configure a VPN client for P2S VPN connections](openvpn-azure-ad-client.md).
