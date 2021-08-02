---
title: 'Connect to a VNet using P2S VPN & certificate authentication: portal'
titleSuffix: Azure VPN Gateway
description: Learn how to connect Windows, macOS, and Linux clients securely to a VNet using VPN Gateway Point-to-Site connections and self-signed or CA issued certificates.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/21/2021
ms.author: cherylmc

---
# Configure a Point-to-Site VPN connection using Azure certificate authentication: Azure portal

This article helps you securely connect individual clients running Windows, Linux, or macOS to an Azure VNet. Point-to-Site VPN connections are useful when you want to connect to your VNet from a remote location, such when you are telecommuting from home or a conference. You can also use P2S instead of a Site-to-Site VPN when you have only a few clients that need to connect to a VNet. Point-to-Site connections do not require a VPN device or a public-facing IP address. P2S creates the VPN connection over either SSTP (Secure Socket Tunneling Protocol), or IKEv2. For more information about Point-to-Site VPN, see [About Point-to-Site VPN](point-to-site-about.md).

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/point-to-site-diagram.png" alt-text="Connect from a computer to an Azure VNet - point-to-site connection diagram.":::

For more information about point-to-site VPN, see [About point-to-site VPN](point-to-site-about.md). To create this configuration using the Azure PowerShell, see [Configure a point-to-site VPN using Azure PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md).

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
* **Subscription:** If you have more than one subscription, verify that you are using the correct one.
* **Resource Group:** TestRG1
* **Location:** East US

**Virtual network gateway**

* **Virtual network gateway name:** VNet1GW
* **Gateway type:** VPN
* **VPN type:** Route-based
* **SKU:** VpnGw2
* **Generation:** Generation2
* **Gateway subnet address range:** 10.1.255.0/27
* **Public IP address name:** VNet1GWpip

**Connection type and client address pool**

* **Connection type:** Point-to-site
* **Client address pool:** 172.16.201.0/24<br>VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from the client address pool.

## <a name="createvnet"></a>Create a VNet

In this section, you create a virtual network.

[!INCLUDE [About cross-premises addresses](../../includes/vpn-gateway-cross-premises.md)]

[!INCLUDE [Basic Point-to-Site VNet](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## <a name="creategw"></a>Create the VPN gateway

In this step, you create the virtual network gateway for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

>[!NOTE]
>The Basic gateway SKU does not support IKEv2 or RADIUS authentication. If you plan on having Mac clients connect to your virtual network, do not use the Basic SKU.
>

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-portal-include.md)]

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal-include.md)]

You can see the deployment status on the Overview page for your gateway. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="generatecert"></a>Generate certificates

Certificates are used by Azure to authenticate clients connecting to a VNet over a Point-to-Site VPN connection. Once you obtain a root certificate, you [upload](#uploadfile) the public key information to Azure. The root certificate is then considered 'trusted' by Azure for connection over P2S to the virtual network. You also generate client certificates from the trusted root certificate, and then install them on each client computer. The client certificate is used to authenticate the client when it initiates a connection to the VNet.

### <a name="getcer"></a>Generate a root certificate

[!INCLUDE [root-certificate](../../includes/vpn-gateway-p2s-rootcert-include.md)]

### <a name="generateclientcert"></a>Generate client certificates

[!INCLUDE [generate-client-cert](../../includes/vpn-gateway-p2s-clientcert-include.md)]

## <a name="addresspool"></a>Add the VPN client address pool

The client address pool is a range of private IP addresses that you specify. The clients that connect over a Point-to-Site VPN dynamically receive an IP address from this range. Use a private IP address range that does not overlap with the on-premises location that you connect from, or the VNet that you want to connect to. If you configure multiple protocols and SSTP is one of the protocols, then the configured address pool is split between the configured protocols equally.

1. Once the virtual network gateway has been created, navigate to the **Settings** section of the virtual network gateway page. In **Settings**, select **Point-to-site configuration**. Select **Configure now** to open the configuration page.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configure-now.png" alt-text="Point-to-site configuration page." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configure-now.png":::
1. On the **Point-to-site configuration** page, in the **Address pool** box, add the private IP address range that you want to use. VPN clients dynamically receive an IP address from the range that you specify. The minimum subnet mask is 29 bit for active/passive and 28 bit for active/active configuration.
1. Continue to the next section to configure authentication and tunnel types.

## <a name="type"></a>Specify tunnel type and authentication type

In this section, you specify the tunnel type and the authentication type. If you don't see tunnel type or authentication type on the Point-to-site configuration page, your gateway is using the Basic SKU. The Basic SKU does not support IKEv2 or RADIUS authentication. If you want to use these settings, you need to delete and recreate the gateway using a different gateway SKU.

### <a name="tunneltype"></a>Tunnel type

On the **Point-to-site configuration** page, select the **Tunnel type**. When selecting the tunnel type, note the following:

* The strongSwan client on Android and Linux and the native IKEv2 VPN client on iOS and macOS will use only the IKEv2 tunnel type to connect.
* Windows clients will try IKEv2 first and if that doesn't connect, they fall back to SSTP.
* You can use the OpenVPN client to connect to the OpenVPN tunnel type.

### <a name="authenticationtype"></a>Authentication type

For **Authentication type**, select **Azure certificate**.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/authentication.png" alt-text="Screenshot of authentication type with Azure certificate selected." :::

## <a name="uploadfile"></a>Upload root certificate public key information

In this section, you upload public root certificate data to Azure. Once the public certificate data is uploaded, Azure can use it to authenticate clients that have installed a client certificate generated from the trusted root certificate.

1. Navigate to your **Virtual network gateway -> Point-to-site configuration** page in the **Root certificate** section. This section is only visible if you have selected **Azure certificate** for the authentication type.
1. Make sure that you exported the root certificate as a **Base-64 encoded X.509 (.CER)** file in the previous steps. You need to export the certificate in this format so you can open the certificate with text editor. You don't need to export the private key.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/base-64.png" alt-text="Screenshot showing export as Base-64 encoded X.509." :::
1. Open the certificate with a text editor, such as Notepad. When copying the certificate data, make sure that you copy the text as one continuous line without carriage returns or line feeds. You may need to modify your view in the text editor to 'Show Symbol/Show all characters' to see the carriage returns and line feeds. Copy only the following section as one continuous line:

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/notepadroot.png" alt-text="Screenshot showing root certificate information in Notepad." border="false":::
1. In the **Root certificate** section, you can add up to 20 trusted root certificates.

   * Paste the certificate data into the **Public certificate data** field. 
   * **Name** the certificate. 

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/root-certificate.png" alt-text="Screenshot of certificate data field." :::
1. Select **Save** at the top of the page to save all of the configuration settings.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/save-configuration.png" alt-text="Screenshot of P2S configuration with Save selected." :::

## <a name="installclientcert"></a>Install exported client certificate

If you want to create a P2S connection from a client computer other than the one you used to generate the client certificates, you need to install a client certificate. When installing a client certificate, you need the password that was created when the client certificate was exported.

Make sure the client certificate was exported as a .pfx along with the entire certificate chain (which is the default). Otherwise, the root certificate information isn't present on the client computer and the client won't be able to authenticate properly.

For install steps, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

## <a name="clientconfig"></a>Configure settings for VPN clients

To connect to the virtual network gateway using P2S, each computer uses the VPN client that is natively installed as a part of the operating system. For example, when you go to VPN settings on your Windows computer, you can add VPN connections without installing a separate VPN client. You configure each VPN client by using a client configuration package. The client configuration package contains settings that are specific to the VPN gateway that you created. 

For steps to generate and install VPN client configuration files, see [Create and install VPN client configuration files for Azure certificate authentication P2S configurations](point-to-site-vpn-client-configuration-azure-cert.md).

## <a name="connect"></a>Connect to Azure

### To connect from a Windows VPN client

[!INCLUDE [Connect from a Windows client](../../includes/vpn-gateway-p2s-connect-windows-client.md)]

[!INCLUDE [verifies client certificates](../../includes/vpn-gateway-certificates-verify-client-cert-include.md)]

### To connect from a Mac VPN client

From the Network dialog box, locate the client profile that you want to use, specify the settings from the [VpnSettings.xml](point-to-site-vpn-client-configuration-azure-cert.md#installmac), and then select **Connect**.

Check [Install - macOS](./point-to-site-vpn-client-configuration-azure-cert.md#installmac) for detailed instructions. If you are having trouble connecting, verify that the virtual network gateway is not using a Basic SKU. Basic SKU is not supported for Mac clients.

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-rm-ps/applyconnect.png" alt-text="Mac VPN client connection." border="false":::

## <a name="verify"></a>To verify your connection

These instructions apply to Windows clients.

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site VPN Client Address Pool that you specified in your configuration. The results are similar to this example:

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

## <a name="connectVM"></a>To connect to a virtual machine

These instructions apply to Windows clients.

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm.md)]

* Verify that the VPN client configuration package was generated after the DNS server IP addresses were specified for the VNet. If you updated the DNS server IP addresses, generate and install a new VPN client configuration package.

* Use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you are connecting. If the IP address is within the address range of the VNet that you are connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.

## <a name="add"></a>To add or remove trusted root certificates

You can add and remove trusted root certificates from Azure. When you remove a root certificate, clients that have a certificate generated from that root won't be able to authenticate, and thus will not be able to connect. If you want a client to authenticate and connect, you need to install a new client certificate generated from a root certificate that is trusted (uploaded) to Azure.

You can add up to 20 trusted root certificate .cer files to Azure. For instructions, see the section [Upload a trusted root certificate](#uploadfile).

To remove a trusted root certificate:

1. Navigate to the **Point-to-site configuration** page for your virtual network gateway.
1. In the **Root certificate** section of the page, locate the certificate that you want to remove.
1. Select the ellipsis next to the certificate, and then select **Remove**.

## <a name="revokeclient"></a>To revoke a client certificate

You can revoke client certificates. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. This is different than removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. Revoking a client certificate, rather than the root certificate, allows the other certificates that were generated from the root certificate to continue to be used for authentication.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

You can revoke a client certificate by adding the thumbprint to the revocation list.

1. Retrieve the client certificate thumbprint. For more information, see [How to retrieve the Thumbprint of a Certificate](/dotnet/framework/wcf/feature-details/how-to-retrieve-the-thumbprint-of-a-certificate).
1. Copy the information to a text editor and remove all spaces so that it is a continuous string.
1. Navigate to the virtual network gateway **Point-to-site-configuration** page. This is the same page that you used to [upload a trusted root certificate](#uploadfile).
1. In the **Revoked certificates** section, input a friendly name for the certificate (it doesn't have to be the certificate CN).
1. Copy and paste the thumbprint string to the **Thumbprint** field.
1. The thumbprint validates and is automatically added to the revocation list. A message appears on the screen that the list is updating. 
1. After updating has completed, the certificate can no longer be used to connect. Clients that try to connect using this certificate receive a message saying that the certificate is no longer valid.

## <a name="faq"></a>Point-to-Site FAQ

For frequently asked questions, see the [FAQ](vpn-gateway-vpn-faq.md#P2S).

## Next steps
Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](../index.yml). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-machines/network-overview.md).

For P2S troubleshooting information, [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
