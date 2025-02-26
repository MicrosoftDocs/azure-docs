---
title: 'Configure VPN gateway for P2S certificate authentication: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN Gateway server settings for point-to-site configurations - certificate authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 11/07/2024
ms.author: cherylmc
---
# Configure server settings for P2S VPN Gateway certificate authentication

This article helps you configure the necessary VPN Gateway point-to-site (P2S) server settings to let you securely connect individual clients running Windows, Linux, or macOS to an Azure virtual network (VNet). P2S VPN connections are useful when you want to connect to your virtual network from a remote location, such as when you're telecommuting from home or a conference. You can also use P2S instead of a site-to-site (S2S) VPN when you have only a few clients that need to connect to a virtual network.

P2S connections don't require a VPN device or a public-facing IP address. There are various different configuration options available for P2S. For more information about point-to-site VPN, see [About point-to-site VPN](point-to-site-about.md).

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png" alt-text="Diagram of point-to-site connection showing how to connect from a computer to an Azure virtual network." lightbox="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png":::

The steps in this article use the Azure portal to configure your Azure VPN gateway for point-to-site **certificate authentication**.

[!INCLUDE [P2S basic architecture](../../includes/vpn-gateway-p2s-architecture.md)]

## Prerequisites

This article assumes the following prerequisites:

* An Azure virtual network.
* A route-based VPN gateway that's compatible with the P2S configuration that you want to create and the connecting VPN clients. To help determine the P2S configuration that you need, see the [VPN client table](#type). If your gateway uses the Basic SKU, understand that the Basic SKU has P2S limitations and doesn't support IKEv2 or RADIUS authentication. For more information, see [About gateway SKUs](about-gateway-skus.md).

If you don't yet have a functioning VPN gateway that's compatible with the P2S configuration that you want to create, see [Create and manage a VPN gateway](tutorial-create-gateway-portal.md). Create a compatible VPN gateway, then return to this article to configure P2S settings.

## <a name="generatecert"></a>Generate certificates

Certificates are used by Azure to authenticate clients connecting to a virtual network over a point-to-site VPN connection. Once you obtain a root certificate, you upload the public key information to Azure. The root certificate is then considered 'trusted' by Azure for connection over P2S to the virtual network.

You also generate client certificates from the trusted root certificate, and then install them on each client computer. The client certificate is used to authenticate the client when it initiates a connection to the virtual network.

The root certificate must be generated and extracted before you configure the point-to-site gateway settings.

### <a name="getcer"></a>Generate a root certificate

[!INCLUDE [root-certificate](../../includes/vpn-gateway-p2s-rootcert-include.md)]

### <a name="generateclientcert"></a>Generate client certificates

[!INCLUDE [generate-client-cert](../../includes/vpn-gateway-p2s-clientcert-include.md)]

## <a name="addresspool"></a>Add the VPN client address pool

[!INCLUDE [Configure a client address pool](../../includes/vpn-gateway-client-address-pool.md)]

## <a name="type"></a>Specify the tunnel and authentication type

In this section, you specify the tunnel type and the authentication type. These settings can become complex. You can select options that contain multiple tunnel types from the dropdown, such as *IKEv2 and OpenVPN(SSL)* or *IKEv2 and SSTP (SSL)*. Only certain combinations of tunnel types and authentication types are available.

The tunnel type and the authentication type must correspond to the VPN client software you want use to connect to Azure. When you have various VPN clients connecting from different operating systems, planning the tunnel type and authentication type is important. The following table shows available tunnel types and authentication types as they relate to VPN client software.

**VPN client table**

[!INCLUDE [Azure VPN Client install link table](../../includes/vpn-gateway-vpn-client-install-articles.md)]

> [!NOTE]
> If you don't see tunnel type or authentication type on the **Point-to-site configuration** page, your gateway is using the Basic SKU. The Basic SKU doesn't support IKEv2 or RADIUS authentication. If you want to use these settings, you need to delete and re-create the gateway using a different gateway SKU.

1. For **Tunnel type**, select the tunnel type that you want to use. For this exercise, from the dropdown, select **IKEv2 and OpenVPN(SSL)**.

1. For **Authentication type**, from the dropdown, select **Azure certificate**.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/authentication.png" alt-text="Screenshot of Point-to-site configuration page - authentication type." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/authentication.png":::

## <a name="publicip3"></a>Add another public IP address

[!INCLUDE [Add public IP address](../../includes/vpn-gateway-third-public-ip.md)]

## <a name="uploadfile"></a>Upload root certificate public key information

In this section, you upload public root certificate data to Azure. Once the public certificate data is uploaded, Azure uses it to authenticate connecting clients. The connecting clients have an installed client certificate generated from the trusted root certificate.

1. Make sure that you exported the root certificate as a **Base-64 encoded X.509 (.CER)** file in the previous steps. You need to export the certificate in this format so you can open the certificate with text editor. You don't need to export the private key.

1. Open the certificate with a text editor, such as Notepad. When copying the certificate data, make sure that you copy the text as one continuous line:

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/certificate.png" alt-text="Screenshot of data in the certificate." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/certificate-expand.png":::
1. Go to your **Virtual network gateway -> Point-to-site configuration** page in the **Root certificate** section. This section is only visible if you have selected **Azure certificate** for the authentication type.
1. In the **Root certificate** section, you can add up to 20 trusted root certificates.

   * Paste the certificate data into the **Public certificate data** field.
   * **Name** the certificate.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/public-certificate-data.png" alt-text="Screenshot of certificate data field." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/public-certificate-data.png":::

1. Additional routes aren't necessary for this exercise. For more information about the custom routing feature, see [Advertise custom routes](vpn-gateway-p2s-advertise-custom-routes.md).
1. Select **Save** at the top of the page to save all of the configuration settings.

## <a name="profile-files"></a>Generate VPN client profile configuration files

All the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. VPN client profile configuration files are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

You can generate client profile configuration files using PowerShell, or by using the Azure portal. The following examples show both methods. Either method returns the same zip file.

### Azure portal

[!INCLUDE [Generate profile configuration files - Azure portal](../../includes/vpn-gateway-generate-profile-portal.md)]

## <a name="clientconfig"></a>Configure VPN clients and connect to Azure

For steps to configure your VPN clients and connect to Azure, see the **VPN client table** in the [Specify tunnel and authentication type](#type) section. The table contains links to articles that provide detailed steps to configure the VPN client software.

## <a name="add"></a>Add or remove trusted root certificates

You can add and remove trusted root certificates from Azure. When you remove a root certificate, clients that have a certificate generated from that root won't be able to authenticate, and as a result, can't connect. If you want a client to authenticate and connect, you need to install a new client certificate generated from a root certificate that is trusted (uploaded) to Azure.

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

Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](../index.yml). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-network/network-overview.md).

For P2S troubleshooting information, [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
