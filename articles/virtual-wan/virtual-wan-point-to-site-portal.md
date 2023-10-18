---

title: 'Tutorial: Create a User VPN connection to Azure using Azure Virtual WAN'
description: In this tutorial, learn how to use Azure Virtual WAN to create a User VPN (point-to-site) connection to Azure.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: tutorial
ms.date: 08/09/2023
ms.author: cherylmc

---
# Tutorial: Create a P2S User VPN connection using Azure Virtual WAN

This tutorial shows you how to use Virtual WAN to connect to your resources in Azure. In this tutorial, you create a point-to-site User VPN connection over OpenVPN or IPsec/IKE (IKEv2) using the Azure portal. This type of connection requires the native VPN client to be configured on each connecting client computer.

* This article applies to certificate and RADIUS authentication. For Azure AD authentication, see [Configure a User VPN connection - Azure Active Directory authentication](virtual-wan-point-to-site-azure-ad.md).
* For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual WAN
> * Create the User VPN configuration
> * Create the virtual hub and gateway
> * Generate client configuration files
> * Configure VPN clients
> * Connect to a VNet
> * View your virtual WAN
> * Modify settings

:::image type="content" source="./media/virtual-wan-about/virtualwanp2s.png" alt-text="Virtual WAN diagram.":::

## Prerequisites

[!INCLUDE [Before beginning](../../includes/virtual-wan-before-include.md)]

## <a name="wan"></a>Create a virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="p2sconfig"></a>Create a User VPN configuration

The User VPN (P2S) configuration defines the parameters for remote clients to connect. You create User VPN configurations before you create the P2S gateway in the hub. You can create multiple User VPN configurations. When you create the P2S gateway, you select the User VPN configuration that you want to use.

The instructions you follow depend on the authentication method you want to use. For this exercise, we select **OpenVpn and IKEv2** and certificate authentication. However, other configurations are available. Each authentication method has specific requirements.

* **Azure certificates:** For this configuration, certificates are required. You need to either generate or obtain certificates. A client certificate is required for each client. Additionally, the root certificate information (public key) needs to be uploaded. For more information about the required certificates, see [Generate and export certificates](certificates-point-to-site.md).

* **Radius-based authentication:** Obtain the Radius server IP, Radius server secret, and certificate information.

* **Azure Active Directory authentication:** See [Configure a User VPN connection - Azure Active Directory authentication](virtual-wan-point-to-site-azure-ad.md).

### Configuration steps

[!INCLUDE [Create P2S configuration](../../includes/virtual-wan-p2s-configuration-include.md)]

## <a name="hub"></a>Create a virtual hub and gateway

### Basics page

[!INCLUDE [Create hub basics page](../../includes/virtual-wan-hub-basics.md)]

### Point to site page

[!INCLUDE [Point to site page](../../includes/virtual-wan-p2s-gateway-include.md)]

[!INCLUDE [Point to site page](../../includes/virtual-wan-hub-router-provisioning-warning.md)]

## <a name="download"></a>Generate client configuration files

When you connect to VNet using User VPN (P2S), you can use the VPN client that is natively installed on the operating system from which you're connecting. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients. The VPN client configuration files that you generate are specific to the User VPN configuration for your gateway. In this section, you generate and download the files used to configure your VPN clients.

There are two different types of configuration profiles that you can download: global and hub. The global profile is a WAN-level configuration profile. When you download the WAN-level configuration profile, you get a built-in Traffic Manager-based User VPN profile. When you use a global profile, if for some reason a hub is unavailable, the built-in traffic management provided by the service ensures connectivity (via a different hub) to Azure resources for point-to-site users. For more information, or to download a hub-level profile VPN client configuration package, see [Global and hub profiles](global-hub-profile.md).

[!INCLUDE [Download profile](../../includes/virtual-wan-p2s-download-profile-include.md)]

## <a name="configure-client"></a>Configure VPN clients

Use the downloaded profile package to configure the native VPN client on your computer. The procedure for each operating system is different. Follow the instructions that apply to your system.
Once you have finished configuring your client, you can connect.

[!INCLUDE [Configure clients](../../includes/virtual-wan-p2s-configure-clients-include.md)]

## <a name="connect-vnet"></a>Connect VNet to hub

In this section, you create a connection between your virtual hub and your VNet. For this tutorial, you don't need to configure the routing settings.

[!INCLUDE [Connect virtual network](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## <a name="viewwan"></a>Point to site sessions dashboard

To view your active point to site sessions, click on **Point-to-site Sessions**. This will show you all active point to site users that are connected to your User VPN gateway.
  :::image type="content" source="../../includes/media/virtual-wan-p2s-sessions-dashboard/point-to-site-sessions-button.png" alt-text="Screenshot shows point to site blade in Virtual WAN." lightbox="../../includes/media/virtual-wan-p2s-sessions-dashboard/point-to-site-sessions-button.png":::

## Modify settings

### <a name="address-pool"></a>Modify client address pool

[!INCLUDE [Modify client address pool](../../includes/virtual-wan-client-address-pool-include.md)]

### <a name="dns"></a>Modify DNS servers

1. Navigate to your **Virtual HUB -> User VPN (Point to site)**.

1. Click the value next to **Custom DNS Servers** to open the **Edit User VPN gateway** page.

1. On the **Edit User VPN gateway** page, edit the **Custom DNS Servers** field. Enter the DNS server IP addresses in the **Custom DNS Servers** text boxes. You can specify up to five DNS Servers.

1. Click **Edit** at the bottom of the page to validate your settings.

1. Click **Confirm** to save your settings. Any changes on this page could take up to 30 minutes to complete.

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

[!INCLUDE [Delete resources](../../includes/virtual-wan-resource-cleanup.md)]

## Next steps

> [!div class="nextstepaction"]
> * [Manage secure access to resources in spoke VNets](manage-secure-access-resources-spoke-p2s.md)
