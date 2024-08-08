---
title: 'Configure P2S server configuration - certificate authentication: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN Gateway server settings for P2S configurations - certificate authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 06/20/2024
ms.author: cherylmc
---
# Configure server settings for P2S VPN Gateway certificate authentication

This article helps you configure the necessary VPN Gateway point-to-site (P2S) server settings to let you securely connect individual clients running Windows, Linux, or macOS to an Azure virtual network (VNet). P2S VPN connections are useful when you want to connect to your VNet from a remote location, such as when you're telecommuting from home or a conference. You can also use P2S instead of a site-to-site (S2S) VPN when you have only a few clients that need to connect to a virtual network (VNet). P2S connections don't require a VPN device or a public-facing IP address.

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png" alt-text="Diagram of point-to-site connection showing how to connect from a computer to an Azure VNet." lightbox="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png":::

There are various different configuration options available for P2S. For more information about point-to-site VPN, see [About point-to-site VPN](point-to-site-about.md). This article helps you create a P2S configuration that uses **certificate authentication** and the Azure portal. To create this configuration using the Azure PowerShell, see the [Configure P2S - Certificate - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md) article. For RADIUS authentication, see the [P2S RADIUS](point-to-site-how-to-radius-ps.md) article. For Microsoft Entra authentication, see the [P2S Microsoft Entra ID](openvpn-azure-ad-tenant.md) article.

[!INCLUDE [P2S basic architecture](../../includes/vpn-gateway-p2s-architecture.md)]

## Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### <a name="example"></a>Example values

You can use the following values to create a test environment, or refer to these values to better understand the examples in this article:

**VNet**

* **VNet Name:** VNet1
* **Address space:** 10.1.0.0/16<br>For this example, we use only one address space. You can have more than one address space for your VNet.
* **Subnet name:** FrontEnd
* **Subnet address range:** 10.1.0.0/24
* **Subscription:** If you have more than one subscription, verify that you're using the correct one.
* **Resource Group:** TestRG1
* **Location:** East US

**Virtual network gateway**

* **Virtual network gateway name:** VNet1GW
* **Gateway type:** VPN
* **VPN type:** Route-based (required for P2S)
* **SKU:** VpnGw2
* **Generation:** Generation2
* **Gateway subnet address range:** 10.1.255.0/27
* **Public IP address name:** VNet1GWpip

**Connection type and client address pool**

* **Connection type:** Point-to-site
* **Client address pool:** 172.16.201.0/24<br>VPN clients that connect to the VNet using this point-to-site connection receive an IP address from the client address pool.

## <a name="createvnet"></a>Create a VNet

In this section, you create a VNet. Refer to the [Example values](#example) section for the suggested values to use for this configuration.

[!INCLUDE [About cross-premises addresses](../../includes/vpn-gateway-cross-premises.md)]

[!INCLUDE [Basic point-to-site VNet](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## Create a gateway subnet

The virtual network gateway requires a specific subnet named **GatewaySubnet**. The gateway subnet is part of the IP address range for your virtual network and contains the IP addresses that the virtual network gateway resources and services use. Specify a gateway subnet that's /27 or larger.

[!INCLUDE [Create gateway subnet](../../includes/vpn-gateway-create-gateway-subnet-portal-include.md)]

## <a name="creategw"></a>Create the VPN gateway

In this step, you create the virtual network gateway for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

> [!NOTE]
> The Basic gateway SKU does not support IKEv2 or RADIUS authentication. If you plan on having Mac clients connect to your VNet, do not use the Basic SKU.


[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal-include.md)]

You can see the deployment status on the **Overview** page for your gateway. After the gateway is created, you can view the IP address that has been assigned to it by looking at the VNet in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="generatecert"></a>Generate certificates

Certificates are used by Azure to authenticate clients connecting to a VNet over a point-to-site VPN connection. Once you obtain a root certificate, you [upload](#uploadfile) the public key information to Azure. The root certificate is then considered 'trusted' by Azure for connection over P2S to the VNet.

You also generate client certificates from the trusted root certificate, and then install them on each client computer. The client certificate is used to authenticate the client when it initiates a connection to the VNet.

The root certificate must be generated and extracted before you configure the point-to-site gateway settings.

### <a name="getcer"></a>Generate a root certificate

[!INCLUDE [root-certificate](../../includes/vpn-gateway-p2s-rootcert-include.md)]

### <a name="generateclientcert"></a>Generate client certificates

[!INCLUDE [generate-client-cert](../../includes/vpn-gateway-p2s-clientcert-include.md)]

## <a name="addresspool"></a>Add the address pool

The **Point-to-site configuration** page contains the configuration information that's needed for the P2S VPN. Once all the P2S settings have been configured and the gateway has been updated, the Point-to-site configuration page is used to view or change P2S VPN settings.

1. Go to the gateway you created in the previous section.
1. In the left pane, select **Point-to-site configuration**.
1. Click **Configure now** to open the configuration page.

The client address pool is a range of private IP addresses that you specify. The clients that connect over a point-to-site VPN dynamically receive an IP address from this range. Use a private IP address range that doesn't overlap with the on-premises location that you connect from, or the VNet that you want to connect to. If you configure multiple protocols and SSTP is one of the protocols, then the configured address pool is split between the configured protocols equally.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-address-pool.png" alt-text="Screenshot of Point-to-site configuration page - address pool." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-address-pool.png":::

1. On the **Point-to-site configuration** page, in the **Address pool** box, add the private IP address range that you want to use. VPN clients dynamically receive an IP address from the range that you specify. The minimum subnet mask is 29 bit for active/passive and 28 bit for active/active configuration.

1. Next, configure the tunnel and authentication type.

## <a name="type"></a>Specify tunnel and authentication type

> [!NOTE]
> If you don't see tunnel type or authentication type on the **Point-to-site configuration** page, your gateway is using the Basic SKU. The Basic SKU doesn't support IKEv2 or RADIUS authentication. If you want to use these settings, you need to delete and re-create the gateway using a different gateway SKU.
>

In this section, you specify the tunnel type and the authentication type. These settings can become complex, depending on the tunnel type you require and the VPN client software that will be used to make the connection from the user's operating system. The steps in this article walk you through basic configuration settings and choices.

You can select options that contain multiple tunnel types from the dropdown - such as *IKEv2 and OpenVPN(SSL)* or *IKEv2 and SSTP (SSL)*, however, only certain combinations of tunnel types and authentication types are supported. For example, Microsoft Entra authentication can only be used when you select *OpenVPN (SSL)* from the tunnel type dropdown, and not *IKEv2 and OpenVPN(SSL)*.

Additionally, the tunnel type and the authentication type correspond to the VPN client software that can be used to connect to Azure. For example, one VPN client software application might be only able to connect via IKEv2, while another can only connect via OpenVPN. And some client software, while it supports a certain tunnel type, might not support the authentication type you choose.

As you can tell, planning the tunnel type and authentication type is important when you have various VPN clients connecting from different operating systems. Consider the following criteria when you choose your tunnel type in combination with **Azure certificate** authentication. Other authentication types have different considerations.

* **Windows**:

  * Windows computers connecting via the native VPN client already installed in the operating system try IKEv2 first and, if that doesn't connect, they fall back to SSTP (if you selected both IKEv2 and SSTP from the tunnel type dropdown).
  * If you select the OpenVPN tunnel type, you can connect using an OpenVPN Client or the Azure VPN Client.
  * The Azure VPN Client can support [optional configuration settings](azure-vpn-client-optional-configurations.md) such as custom routes and forced tunneling.

* **macOS and iOS**:

  * The native VPN client for iOS and macOS can only use the IKEv2 tunnel type to connect to Azure.
  * The Azure VPN Client isn't supported for certificate authentication at this time, even if you select the OpenVPN tunnel type.
  * If you want to use the OpenVPN tunnel type with certificate authentication, you can use an OpenVPN client.
  * For macOS, you can use the Azure VPN Client with the OpenVPN tunnel type and Microsoft Entra ID authentication (not certificate authentication).

* **Linux**:

  * The Azure VPN Client for Linux supports the OpenVPN tunnel type.
  * The strongSwan client on Android and Linux can use only the IKEv2 tunnel type to connect.

### <a name="tunneltype"></a>Tunnel type

On the **Point-to-site configuration** page, select the **Tunnel type**. For this exercise, from the dropdown, select **IKEv2 and OpenVPN(SSL)**.

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-tunnel-type.png" alt-text="Screenshot of Point-to-site configuration page - tunnel type." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-tunnel-type.png":::

### <a name="authenticationtype"></a>Authentication type

For this exercise, select **Azure certificate** for the authentication type. If you're interested in other authentication types, see the articles for [Microsoft Entra ID](openvpn-azure-ad-tenant.md) and [RADIUS](point-to-site-how-to-radius-ps.md).

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-authentication-type.png" alt-text="Screenshot of Point-to-site configuration page - authentication type." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-authentication-type.png":::

## <a name="uploadfile"></a>Upload root certificate public key information

In this section, you upload public root certificate data to Azure. Once the public certificate data is uploaded, Azure can use it to authenticate clients that have installed a client certificate generated from the trusted root certificate.

1. Make sure that you exported the root certificate as a **Base-64 encoded X.509 (.CER)** file in the previous steps. You need to export the certificate in this format so you can open the certificate with text editor. You don't need to export the private key.

1. Open the certificate with a text editor, such as Notepad. When copying the certificate data, make sure that you copy the text as one continuous line without carriage returns or line feeds. You might need to modify your view in the text editor to 'Show Symbol/Show all characters' to see the carriage returns and line feeds. Copy only the following section as one continuous line:

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/notepad-root-cert.png" alt-text="Screenshot showing root certificate information in Notepad." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/notepad-root-cert-expand.png":::
1. Navigate to your **Virtual network gateway -> Point-to-site configuration** page in the **Root certificate** section. This section is only visible if you have selected **Azure certificate** for the authentication type.
1. In the **Root certificate** section, you can add up to 20 trusted root certificates.

   * Paste the certificate data into the **Public certificate data** field.
   * **Name** the certificate.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/root-certificate.png" alt-text="Screenshot of certificate data field." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/root-certificate.png":::
1. Additional routes aren't necessary for this exercise. For more information about the custom routing feature, see [Advertise custom routes](vpn-gateway-p2s-advertise-custom-routes.md).
1. Select **Save** at the top of the page to save all of the configuration settings.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/save-configuration.png" alt-text="Screenshot of P2S configuration with Save selected." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/save-configuration.png" :::

## <a name="profile-files"></a>Generate VPN client profile configuration files

All the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. VPN client profile configuration files are specific to the P2S VPN gateway configuration for the VNet. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

You can generate client profile configuration files using PowerShell, or by using the Azure portal. The following examples show both methods. Either method returns the same zip file.

### Azure portal

[!INCLUDE [Generate profile configuration files - Azure portal](../../includes/vpn-gateway-generate-profile-portal.md)]

### PowerShell

[!INCLUDE [Generate profile configuration files - PowerShell](../../includes/vpn-gateway-generate-profile-powershell.md)]

## <a name="clientconfig"></a>Configure VPN clients and connect to Azure

For steps to configure your VPN clients and connect to Azure, see the following articles:

[!INCLUDE [Azure VPN Client install link table](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## <a name="verify"></a>Verify your connection

These instructions apply to Windows clients.

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
1. View the results. Notice that the IP address you received is one of the addresses within the point-to-site VPN Client Address Pool that you specified in your configuration. The results are similar to this example:

   ```
   PPP adapter VNet1:
      Connection-specific DNS Suffix .:
      Description.....................: VNet1
      Physical Address................:
      DHCP Enabled....................: No
      Autoconfiguration Enabled.......: Yes
      IPv4 Address....................: 172.16.201.3(Preferred)
      Subnet Mask.....................: 255.255.255.255
      Default Gateway.................:
      NetBIOS over Tcpip..............: Enabled
   ```

## <a name="connectVM"></a>Connect to a virtual machine

These instructions apply to Windows clients.

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm.md)]

* Verify that the VPN client configuration package was generated after the DNS server IP addresses were specified for the VNet. If you updated the DNS server IP addresses, generate and install a new VPN client configuration package.

* Use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you're connecting. If the IP address is within the address range of the VNet that you're connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.

## <a name="add"></a>Add or remove trusted root certificates

You can add and remove trusted root certificates from Azure. When you remove a root certificate, clients that have a certificate generated from that root won't be able to authenticate, and thus won't be able to connect. If you want a client to authenticate and connect, you need to install a new client certificate generated from a root certificate that is trusted (uploaded) to Azure.

You can add up to 20 trusted root certificate .cer files to Azure. For instructions, see the section [Upload a trusted root certificate](#uploadfile).

To remove a trusted root certificate:

1. Navigate to the **Point-to-site configuration** page for your virtual network gateway.
1. In the **Root certificate** section of the page, locate the certificate that you want to remove.
1. Select the ellipsis next to the certificate, and then select **Remove**.

## <a name="revokeclient"></a>Revoke a client certificate

You can revoke client certificates. The certificate revocation list allows you to selectively deny P2S connectivity based on individual client certificates. This is different than removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. When you revoke a client certificate, rather than the root certificate, it allows the other certificates that were generated from the root certificate to continue to be used for authentication.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

You can revoke a client certificate by adding the thumbprint to the revocation list.

1. Retrieve the client certificate thumbprint. For more information, see [How to retrieve the Thumbprint of a Certificate](/dotnet/framework/wcf/feature-details/how-to-retrieve-the-thumbprint-of-a-certificate).
1. Copy the information to a text editor and remove all spaces so that it's a continuous string.
1. Navigate to the virtual network gateway **Point-to-site-configuration** page. This is the same page that you used to [upload a trusted root certificate](#uploadfile).
1. In the **Revoked certificates** section, input a friendly name for the certificate (it doesn't have to be the certificate CN).
1. Copy and paste the thumbprint string to the **Thumbprint** field.
1. The thumbprint validates and is automatically added to the revocation list. A message appears on the screen that the list is updating.
1. After updating has completed, the certificate can no longer be used to connect. Clients that try to connect using this certificate receive a message saying that the certificate is no longer valid.

## <a name="faq"></a>Point-to-site FAQ

For frequently asked questions, see the [FAQ](vpn-gateway-vpn-faq.md#P2S).

## Next steps

Once your connection is complete, you can add virtual machines to your VNets. For more information, see [Virtual Machines](../index.yml). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-network/network-overview.md).

For P2S troubleshooting information, [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
