---
title: 'Connect a computer to a virtual network using P2S: certificate authentication: Azure portal classic'
titleSuffix: Azure VPN Gateway
description: Learn how to create a classic Point-to-Site VPN Gateway connection using the Azure portal.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/31/2023
ms.author: cherylmc

---
# Configure a Point-to-Site connection by using certificate authentication (classic)

This article shows you how to create a VNet with a Point-to-Site connection using the classic (legacy) deployment model. This configuration uses certificates to authenticate the connecting client, either self-signed or CA issued. These instructions are for the classic deployment model. You can no longer create a gateway using the classic deployment model. See the [Resource Manager version of this article](vpn-gateway-howto-point-to-site-resource-manager-portal.md) instead.

> [!IMPORTANT]
> [!INCLUDE [classic gateway restrictions](../../includes/vpn-gateway-classic-gateway-restrict-create.md)]

You use a Point-to-Site (P2S) VPN gateway to create a secure connection to your virtual network from an individual client computer. Point-to-Site VPN connections are useful when you want to connect to your VNet from a remote location. When you have only a few clients that need to connect to a VNet, a P2S VPN is a useful solution to use instead of a Site-to-Site VPN. A P2S VPN connection is established by starting it from the client computer.

> [!IMPORTANT]
> The classic deployment model supports Windows VPN clients only and uses the Secure Socket Tunneling Protocol (SSTP), an SSL-based VPN protocol. To support non-Windows VPN clients, you must create your VNet with the Resource Manager deployment model. The Resource Manager deployment model supports IKEv2 VPN in addition to SSTP. For more information, see [About P2S connections](point-to-site-about.md).
>

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-classic-azure-portal/point-to-site-connection-diagram.png" alt-text="Diagram showing classic point-to-site architecture.":::

[!INCLUDE [deployment models](../../includes/vpn-gateway-classic-deployment-model-include.md)]

## Settings and requirements

### Requirements

Point-to-Site certificate authentication connections require the following items. There are steps in this article that will help you create them.

* A Dynamic VPN gateway.
* The public key (.cer file) for a root certificate, which is uploaded to Azure. This key is considered a trusted certificate and is used for authentication.
* A client certificate generated from the root certificate, and installed on each client computer that will connect. This certificate is used for client authentication.
* A VPN client configuration package must be generated and installed on every client computer that connects. The client configuration package configures the native VPN client that's already on the operating system with the necessary information to connect to the VNet.

Point-to-Site connections don't require a VPN device or an on-premises public-facing IP address. The VPN connection is created over SSTP (Secure Socket Tunneling Protocol). On the server side, we support SSTP versions 1.0, 1.1, and 1.2. The client decides which version to use. For Windows 8.1 and above, SSTP uses 1.2 by default.

For more information, see [About Point-to-Site connections](point-to-site-about.md) and the [FAQ](#faq).

### Example settings

Use the following values to create a test environment, or refer to these values to better understand the examples in this article:

* **Resource Group:** TestRG
* **VNet Name:** VNet1
* **Address space:** 192.168.0.0/16 <br>For this example, we use only one address space. You can have more than one address space for your VNet.
* **Subnet name:** FrontEnd
* **Subnet address range:** 192.168.1.0/24
* **GatewaySubnet:** 192.168.200.0/24
* **Region:** (US) East US
* **Client address space:** 172.16.201.0/24 <br> VPN clients that connect to the VNet by using this Point-to-Site connection receive an IP address from the specified pool.
* **Connection type**: Select **Point-to-site**.

Before you begin, verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

## <a name="vnet"></a>Create a virtual network

If you already have a VNet, verify that the settings are compatible with your VPN gateway design. Pay particular attention to any subnets that might overlap with other networks.

[!INCLUDE [basic classic vnet](../../includes/vpn-gateway-vnet-classic.md)]

[!INCLUDE [basic classic DNS](../../includes/vpn-gateway-dns-classic.md)]

## <a name="gateway"></a>Create a VPN gateway

1. Navigate to the VNet that you created.
1. On the VNet page, under Settings, select **Gateway**. On the **Gateway** page, you can view the gateway for your virtual network. This virtual network doesn't yet have a gateway. Click the note that says **Click here to add a connection and a gateway**.
1. On the **Configure a VPN connection and gateway** page, select the following settings:

   * Connection type: Point-to-site
   * Client address space: Add the IP address range from which the VPN clients receive an IP address when connecting. Use a private IP address range that doesn't overlap with the on-premises location that you connect from, or with the VNet that you connect to.
1. Leave the checkbox for **Do not configure a gateway at this time** unselected. We will create a gateway.
1. At the bottom of the page, select **Next: Gateway >**.
1. On the **Gateway** tab, select the following values:

   * **Size:** The size is the gateway SKU for your virtual network gateway. In the Azure portal, the default SKU is **Default**. For more information about gateway SKUs, see [About VPN gateway settings](vpn-gateway-about-vpn-gateway-settings.md#gwsku).
   * **Routing Type:** You must select **Dynamic** for a point-to-site configuration. Static routing won't work.
   * **Gateway subnet:** This field is already autofilled. You can't change the name. If you try to change the name using PowerShell or any other means, the gateway won't work properly.
   * **Address range (CIDR block):** While it's possible to create a gateway subnet as small as /29, we recommend that you create a larger subnet that includes more addresses by selecting at least /28 or /27. Doing so will allow for enough addresses to accommodate possible additional configurations that you might want in the future. When working with gateway subnets, avoid associating a network security group (NSG) to the gateway subnet. Associating a network security group to this subnet might cause your VPN gateway to not function as expected.
1. Select **Review + create** to validate your settings.
1. Once validation passes, select **Create**. A VPN gateway can take up to 45 minutes to complete, depending on the gateway SKU that you select.

## <a name="generatecerts"></a>Create certificates

Azure uses certificates to authenticate VPN clients for Point-to-Site VPNs. You upload the public key information of the root certificate to Azure. The public key is then considered *trusted*. Client certificates must be generated from the trusted root certificate, and then installed on each client computer in the Certificates-Current User\Personal\Certificates certificate store. The certificate is used to authenticate the client when it connects to the VNet. 

If you use self-signed certificates, they must be created by using specific parameters. You can create a self-signed certificate by using the instructions for [PowerShell and Windows 10 or later](vpn-gateway-certificates-point-to-site.md), or [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md). It's important to follow the steps in these instructions when you use self-signed root certificates and generate client certificates from the self-signed root certificate. Otherwise, the certificates you create won't be compatible with P2S connections and you'll receive a connection error.

### Acquire the public key (.cer) for the root certificate

[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-p2s-rootcert-include.md)]

### Generate a client certificate

[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-p2s-clientcert-include.md)]

## Upload the root certificate .cer file

After the gateway has been created, upload the .cer file (which contains the public key information) for a trusted root certificate to the Azure server. Don't upload the private key for the root certificate. After you upload the certificate, Azure uses it to authenticate clients that have installed a client certificate generated from the trusted root certificate. You can later upload additional trusted root certificate files (up to 20), if needed.

1. Navigate to the virtual network you created.
1. Under **Settings**, select **Point-to-site connections**.
1. Select **Manage certificate**.
1. Select **Upload**.
1. On the **Upload a certificate** pane, select the folder icon and navigate to the certificate you want to upload.
1. Select **Upload**.
1. After the certificate has uploaded successfully, you can view it on the Manage certificate page. You might need to select **Refresh** to view the certificate you just uploaded.

## Configure the client

To connect to a VNet by using a Point-to-Site VPN, each client must install a package to configure the native Windows VPN client. The configuration package configures the native Windows VPN client with the settings necessary to connect to the virtual network.

You can use the same VPN client configuration package on each client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see [About Point-to-Site connections](point-to-site-about.md) and the [FAQ](#faq).

### Generate and install a VPN client configuration package

1. Navigate to the **Point-to-site connections** settings for your VNet.
1. At the top of the page, select the download package that corresponds to the client operating system where it will be installed:

   * For 64-bit clients, select **VPN client (64-bit)**.
   * For 32-bit clients, select **VPN client (32-bit)**.

1. Azure generates a package with the specific settings that the client requires. Each time you make changes to the VNet or gateway, you need to download a new client configuration package and install them on your client computers.
1. After the package generates, select **Download**.
1. Install the client configuration package on your client computer. When installing, if you see a SmartScreen popup saying Windows protected your PC, select **More info**, then select **Run anyway**. You can also save the package to install on other client computers.

### Install a client certificate

For this exercise, when you generated the client certificate, it was automatically installed on your computer. To create a P2S connection from a different client computer than the one used to generate the client certificates, you must install the generated client certificate on that computer.

When you install a client certificate, you need the password that was created when the client certificate was exported. Typically, you can install the certificate by just double-clicking it. For more information, see [Install an exported client certificate](vpn-gateway-certificates-point-to-site.md#install).

## Connect to your VNet

>[!NOTE]
>You must have Administrator rights on the client computer from which you are connecting.
>

1. On the client computer, go to VPN settings.
1. Select the VPN that you created. If you used the example settings, the connection will be labeled **Group TestRG VNet1**.
1. Select **Connect**.
1. In the Windows Azure Virtual Network box, select **Connect**. If a pop-up message about the certificate appears, select **Continue** to use elevated privileges and **Yes** to accept configuration changes.
1. When your connection succeeds, you'll see a **Connected** notification.

[!INCLUDE [verify-client-certificates](../../includes/vpn-gateway-certificates-verify-client-cert-include.md)]

## Verify the VPN connection

1. Verify that your VPN connection is active. Open an elevated command prompt on your client computer, and run **ipconfig/all**.
1. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site connectivity address range that you specified when you created your VNet. The results should be similar to this example:

   ```
    PPP adapter VNet1:
        Connection-specific DNS Suffix .:
        Description.....................: VNet1
        Physical Address................:
        DHCP Enabled....................: No
        Autoconfiguration Enabled.......: Yes
        IPv4 Address....................: 172.16.201.11 (Preferred)
        Subnet Mask.....................: 255.255.255.255
        Default Gateway.................:
        NetBIOS over Tcpip..............: Enabled
   ```

## To connect to a virtual machine

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm-p2s-classic-include.md)]

## To add or remove trusted root certificates

You can add and remove trusted root certificates from Azure. When you remove a root certificate, clients that have a certificate generated from that root can no longer authenticate and connect. For those clients to authenticate and connect again, you must install a new client certificate generated from a root certificate that's trusted by Azure.

### Add a trusted root certificate

You can add up to 20 trusted root certificate .cer files to Azure by using the same process that you used to add the first trusted root certificate.

### Remove a trusted root certificate

1. On the **Point-to-site connections** section of the page for your VNet, select **Manage certificate**.
1. Select the ellipsis next to the certificate that you want to remove, then select **Delete**.

## To revoke a client certificate

If necessary, you can revoke a client certificate. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. This method differs from removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. Revoking a client certificate, rather than the root certificate, allows the other certificates that were generated from the root certificate to continue to be used for authentication for the Point-to-Site connection.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

You can revoke a client certificate by adding the thumbprint to the revocation list.

1. Retrieve the client certificate thumbprint. For more information, see [How to: Retrieve the Thumbprint of a Certificate](/dotnet/framework/wcf/feature-details/how-to-retrieve-the-thumbprint-of-a-certificate).
1. Copy the information to a text editor and remove its spaces so that it's a continuous string.
1. Navigate to **Point-to-site VPN connection**, then select **Manage certificate**.
1. Select **Revocation list** to open the **Revocation list** page.
1. In **Thumbprint**, paste the certificate thumbprint as one continuous line of text, with no spaces.
1. Select **+ Add to list** to add the thumbprint to the certificate revocation list (CRL).

After updating completes, the certificate can no longer be used to connect. Clients that try to connect by using this certificate receive a message saying that the certificate is no longer valid.

## <a name="faq"></a>FAQ

[!INCLUDE [Point-to-Site FAQ](../../includes/vpn-gateway-faq-point-to-site-classic-include.md)]

## Next steps

* After your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](../index.yml).

* To understand more about networking and Linux virtual machines, see [Azure and Linux VM network overview](../virtual-network/network-overview.md).

* For P2S troubleshooting information, [Troubleshoot Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
