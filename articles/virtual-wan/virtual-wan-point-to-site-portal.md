---

title: 'Tutorial: Use Azure Virtual WAN to create a Point-to-Site connection to Azure'
description: In this tutorial, learn how to use Azure Virtual WAN to create a User VPN (point-to-site) connection to Azure.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: tutorial
ms.date: 08/02/2021
ms.author: cherylmc

---
# Tutorial: Create a User VPN connection using Azure Virtual WAN

This tutorial shows you how to use Virtual WAN to connect to your resources in Azure over an OpenVPN or IPsec/IKE (IKEv2) VPN connection using a User VPN (P2S) configuration. This type of connection requires the native VPN client to be configured on each connecting client computer. For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md).

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

## <a name="wan"></a>Create virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="p2sconfig"></a>Create User VPN configuration

The User VPN (P2S) configuration defines the parameters for remote clients to connect. The instructions you follow depend on the authentication method you want to use.

In the following steps, when selecting the authentication method, you have three choices. Each method has specific requirements. Select one of the following methods, and then complete the steps.

* **Azure Active Directory authentication:** Obtain the following information:

   * The **Application ID** of the Azure VPN Enterprise Application registered in your Azure AD tenant.
   * The **Issuer**. Example: `https://sts.windows.net/your-Directory-ID`.
   * The **Azure AD tenant**. Example: `https://login.microsoftonline.com/your-Directory-ID`.

   For more information, see [Configure Azure AD authentication](virtual-wan-point-to-site-azure-ad.md) and [Prepare Azure AD tenant - OpenVPN](openvpn-azure-ad-tenant.md)

* **Radius-based authentication:** Obtain the Radius server IP, Radius server secret, and certificate information.

* **Azure certificates:** For this configuration, certificates are required. You need to either generate or obtain certificates. A client certificate is required for each client. Additionally, the root certificate information (public key) needs to be uploaded. For more information about the required certificates, see [Generate and export certificates](certificates-point-to-site.md).

[!INCLUDE [Create P2S configuration](../../includes/virtual-wan-p2s-configuration-include.md)]

## <a name="hub"></a>Create virtual hub and gateway

[!INCLUDE [Create hub](../../includes/virtual-wan-p2s-hub-include.md)]

## <a name="download"></a>Generate client configuration files

When you connect to VNet using User VPN (P2S), you use the VPN client that is natively installed on the operating system from which you are connecting. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients. The VPN client configuration files that you generate are specific to the User VPN configuration for your gateway. In this section, you generate and download the files used to configure your VPN clients.

[!INCLUDE [Download profile](../../includes/virtual-wan-p2s-download-profile-include.md)]

## <a name="configure-client"></a>Configure VPN clients

Use the downloaded profile package to configure the remote access VPN clients. The procedure for each operating system is different. Follow the instructions that apply to your system.
Once you have finished configuring your client, you can connect.

[!INCLUDE [Configure clients](../../includes/virtual-wan-p2s-configure-clients-include.md)]

## <a name="connect-vnet"></a>Connect to VNet

In this section, you create a connection between your virtual hub and your VNet. For this tutorial, you do not need to configure the routing settings.

[!INCLUDE [Connect virtual network](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## <a name="viewwan"></a>View virtual WAN

1. Navigate to your **virtual WAN**.

1. On the **Overview** page, each point on the map represents a hub.

1. In the **Hubs and connections** section, you can view hub status, site, region, VPN connection status, and bytes in and out.

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
