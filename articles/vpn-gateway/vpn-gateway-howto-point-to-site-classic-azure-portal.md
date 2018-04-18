---
title: 'Connect a computer to a virtual network using Point-to-Site and certificate authentication: Azure Portal classic | Microsoft Docs'
description: Create a classic a Point-to-Site VPN gateway connection using the Azure portal.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: jpconnock
editor: ''
tags: azure-service-management

ms.assetid: 65e14579-86cf-4d29-a6ac-547ccbd743bd
ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/12/2018
ms.author: cherylmc

---
# Configure a Point-to-Site connection to a VNet using certificate authentication (classic): Azure portal

[!INCLUDE [deployment models](../../includes/vpn-gateway-classic-deployment-model-include.md)]

This article shows you how to create a VNet with a Point-to-Site connection in the classic deployment model using the Azure portal. This configuration uses certificates to authenticate the connecting client, either self-signed or CA issued. You can also create this configuration using a different deployment tool or deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Azure portal (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
>

A Point-to-Site (P2S) VPN gateway lets you create a secure connection to your virtual network from an individual client computer. Point-to-Site VPN connections are useful when you want to connect to your VNet from a remote location, such when you are telecommuting from home or a conference. A P2S VPN is also a useful solution to use instead of a Site-to-Site VPN when you have only a few clients that need to connect to a VNet. A P2S VPN connection is established by starting it from the client computer.

> [!IMPORTANT]
> The classic deployment model supports Windows VPN clients only and uses the Secure Socket Tunneling Protocol (SSTP), an SSL-based VPN protocol. In order to support non-Windows VPN clients, your VNet must be created using the Resource Manager deployment model. The Resource Manager deployment model supports IKEv2 VPN in addition to SSTP. For more information, see [About P2S connections](point-to-site-about.md).
>
>

![Point-to-Site-diagram](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/point-to-site-connection-diagram.png)


Point-to-Site certificate authentication connections require the following:

* A Dynamic VPN gateway.
* The public key (.cer file) for a root certificate, which is uploaded to Azure. This is considered a trusted certificate and is used for authentication.
* A client certificate generated from the root certificate, and installed on each client computer that will connect. This certificate is used for client authentication.
* A VPN client configuration package must be generated and installed on every client computer that connects. The client configuration package configures the native VPN client that is already on the operating system with the necessary information to connect to the VNet.

Point-to-Site connections do not require a VPN device or an on-premises public-facing IP address. The VPN connection is created over SSTP (Secure Socket Tunneling Protocol). On the server side, we support SSTP versions 1.0, 1.1, and 1.2. The client decides which version to use. For Windows 8.1 and above, SSTP uses 1.2 by default. 

For more information about Point-to-Site connections, see the [Point-to-Site FAQ](#faq) at the end of this article.

### Example settings

You can use the following values to create a test environment, or refer to these values to better understand the examples in this article:

* **Name: VNet1**
* **Address space: 192.168.0.0/16**<br>For this example, we use only one address space. You can have more than one address space for your VNet, as shown in the diagram.
* **Subnet name: FrontEnd**
* **Subnet address range: 192.168.1.0/24**
* **Subscription:** If you have more than one subscription, verify that you are using the correct one.
* **Resource Group: TestRG**
* **Location: East US**
* **Connection type: Point-to-site**
* **Client Address Space: 172.16.201.0/24**. VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from the specified pool.
* **GatewaySubnet: 192.168.200.0/24**. The Gateway subnet must use the name 'GatewaySubnet'.
* **Size:** Select the gateway SKU that you want to use.
* **Routing Type: Dynamic**

## <a name="vnetvpn"></a>1. Create a virtual network and a VPN gateway

Before beginning, verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### <a name="createvnet"></a>Part 1: Create a virtual network

If you don't already have a virtual network, create one. Screenshots are provided as examples. Be sure to replace the values with your own. To create a VNet by using the Azure portal, use the following steps:

1. From a browser, navigate to the [Azure portal](http://portal.azure.com) and, if necessary, sign in with your Azure account.
2. Click **Create a resource** > **Networking** > **Virtual Network**. 
3. Near the bottom of the Virtual Network page, from the **Select a deployment model** list, select **Classic**, and then click **Create**.

  ![Select deployment model](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/selectmodel.png)
4. On the **Create virtual network** page, configure the VNet settings. On this page, you add your first address space and a single subnet address range. After you finish creating the VNet, you can go back and add additional subnets and address spaces.

  ![Create virtual network page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/vnet125.png)
5. Verify that the **Subscription** is the correct one. You can change subscriptions by using the drop-down.
6. Click **Resource group** and either select an existing resource group, or create a new one by typing a name for your new resource group. If you are creating a new resource group, name the resource group according to your planned configuration values. For more information about resource groups, visit [Azure Resource Manager Overview](../azure-resource-manager/resource-group-overview.md#resource-groups).
7. Next, select the **Location** settings for your VNet. The location determines where the resources that you deploy to this VNet will reside.
8. Select **Pin to dashboard** if you want to be able to find your VNet easily on the dashboard, and then click **Create**.

  ![Pin to dashboard](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/pintodashboard150.png)
9. After clicking Create, a tile appears on your dashboard that will reflect the progress of your VNet. The tile changes as the VNet is being created.

  ![Creating virtual network tile](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/deploying150.png)
10. Once your virtual network has been created, you see **Created**.
11. Add a DNS server (optional). After you create your virtual network, you can add the IP address of a DNS server for name resolution. The DNS server IP address that you specify should be the address of a DNS server that can resolve the names for the resources in your VNet.<br>To add a DNS server, open the settings for your virtual network, click DNS servers, and add the IP address of the DNS server that you want to use.

### <a name="gateway"></a>Part 2: Create gateway subnet and a dynamic routing gateway

In this step, you create a gateway subnet and a Dynamic routing gateway. In the Azure portal for the classic deployment model, creating the gateway subnet and the gateway can be done through the same configuration pages. The gateway subnet is used for the gateway services only. Never deploy anything directly to the gateway subnet (such as VMs or other services).

1. In the portal, navigate to the virtual network for which you want to create a gateway.
2. On the page for your virtual network, on the **Overview** page, in the VPN connections section, click **Gateway**.

  ![Click to create a gateway](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/beforegw125.png)
3. On the **New VPN Connection** page, select **Point-to-site**.

  ![Point-to-Site connection type](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/newvpnconnect.png)
4. For **Client Address Space**, add the IP address range. This is the range from which the VPN clients receive an IP address when connecting. Use a private IP address range that does not overlap with the on-premises location that you will connect from, or with the VNet that you want to connect to. You can delete the auto-filled range, then add the private IP address range that you want to use. This example shows the auto-filled ranged. Delete it to add the value that you want.

  ![Client address space](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clientaddress.png)
5. Select the **Create gateway immediately** checkbox. Click **Optional gateway configuration** to open the **Gateway configuration** page.

  ![Click optional gateway configuration](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/optsubnet125.png)
6. Click **Subnet Configure required settings** to add the **gateway subnet**. While it is possible to create a gateway subnet as small as /29, we recommend that you create a larger subnet that includes more addresses by selecting at least /28 or /27. This will allow for enough addresses to accommodate possible additional configurations that you may want in the future. When working with gateway subnets, avoid associating a network security group (NSG) to the gateway subnet. Associating a network security group to this subnet may cause your VPN gateway to stop functioning as expected.

  ![Add GatewaySubnet](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/gwsubnet125.png)
7. Select the gateway **Size**. The size is the gateway SKU for your virtual network gateway. In the portal, the Default SKU is **Basic**. For more information about gateway SKUs, see [About VPN Gateway Settings](vpn-gateway-about-vpn-gateway-settings.md#gwsku).

  ![Gateway size](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/gwsize125.png)
8. Select the **Routing Type** for your gateway. P2S configurations require a **Dynamic** routing type. Click **OK** when you have finished configuring this page.

  ![Configure routing type](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/routingtype125.png)
9. On the **New VPN Connection** page, click **OK** at the bottom of the page to begin creating your virtual network gateway. A VPN gateway can take up to 45 minutes to complete, depending on the gateway sku that you select.

## <a name="generatecerts"></a>2. Create certificates

Certificates are used by Azure to authenticate VPN clients for Point-to-Site VPNs. You upload the public key information of the root certificate to Azure. The public key is then considered 'trusted'. Client certificates must be generated from the trusted root certificate, and then installed on each client computer in the Certificates-Current User/Personal certificate store. The certificate is used to authenticate the client when it initiates a connection to the VNet. 

If you use self-signed certificates, they must be created using specific parameters. You can create a self-signed certificate using the instructions for [PowerShell and Windows 10](vpn-gateway-certificates-point-to-site.md), or [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md). It's important that you follow the steps in these instructions when working with self-signed root certificates and generating client certificates from the self-signed root certificate. Otherwise, the certificates you create will not be compatible with P2S connections and you will receive a connection error.

### <a name="cer"></a>Part 1: Obtain the public key (.cer) for the root certificate

[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-p2s-rootcert-include.md)]

### <a name="genclientcert"></a>Part 2: Generate a client certificate

[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-p2s-clientcert-include.md)]

## <a name="upload"></a>3. Upload the root certificate .cer file

After the gateway has been created, you can upload the .cer file (which contains the public key information) for a trusted root certificate to Azure. You do not upload the private key for the root certificate to Azure. Once a.cer file is uploaded, Azure can use it to authenticate clients that have installed a client certificate generated from the trusted root certificate. You can upload additional trusted root certificate files - up to a total of 20 - later, if needed.  

1. On the **VPN connections** section of the page for your VNet, click the **clients** graphic to open the **Point-to-site VPN connection** page.

  ![Clients](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clients125.png)
2. On the **Point-to-site connection** page, click **Manage certificates** to open the **Certificates** page.<br>

  ![Certificates page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/ptsmanage.png)<br><br>
3. On the **Certificates** page, click **Upload** to open the **Upload certificate** page.<br>

    ![Upload certificates page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/uploadcerts.png)<br>
4. Click the folder graphic to browse for the .cer file. Select the file, then click **OK**. Refresh the page to see the uploaded certificate on the **Certificates** page.

  ![Upload certificate](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/upload.png)<br>

## <a name="vpnclientconfig"></a>4. Configure the client

To connect to a VNet using a Point-to-Site VPN, each client must install a package to configure the native Windows VPN client. The configuration package configures the native Windows VPN client with the settings necessary to connect to the virtual network.

You can use the same VPN client configuration package on each client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the [Point-to-Site connections FAQ](#faq) at the end of this article.

### <a name="generateconfigpackage"></a>Part 1: Generate and install the VPN client configuration package

1. In the Azure portal, in the **Overview** page for your VNet, in **VPN connections**, click the client graphic to open the **Point-to-site VPN connection** page.
2. At the top of the **Point-to-site VPN connection** page, click the download package that corresponds to the client operating system on which it will be installed:

  * For 64-bit clients, select **VPN Client (64-bit)**.
  * For 32-bit clients, select **VPN Client (32-bit)**.

  ![Download VPN client configuration package](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/dlclient.png)<br>
3. Once the packaged generates, download and install it on your client computer. If you see a SmartScreen popup, click **More info**, then **Run anyway**. You can also save the package to install on other client computers.

### <a name="installclientcert"></a>Part 2: Install the client certificate

If you want to create a P2S connection from a client computer other than the one you used to generate the client certificates, you need to install a client certificate. When installing a client certificate, you need the password that was created when the client certificate was exported. Typically, this is just a matter of double-clicking the certificate and installing it. For more information, see [Install an exported client certificate](vpn-gateway-certificates-point-to-site.md#install).

## <a name="connect"></a>5. Connect to Azure

### Connect to your VNet

>[!NOTE]
>You must have Administrator rights on the client computer from which you are connecting.
>
>

1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It is named the same name as your virtual network. Click **Connect**. A pop-up message may appear that refers to using the certificate. If this happens, click **Continue** to use elevated privileges.
2. On the **Connection** status page, click **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.

  ![VPN client connection](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clientconnect.png)
3. Your connection is established.

  ![Established connection](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/connected.png)

#### Troubleshooting P2S connections

[!INCLUDE [verify-client-certificates](../../includes/vpn-gateway-certificates-verify-client-cert-include.md)]

### <a name="verifyvpnconnect"></a>Verify the VPN connection

1. To verify that your VPN connection is active, from your client computer, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site connectivity address range that you specified when you created your VNet. The results should be similar to this example:

  ```
    PPP adapter VNet1:
        Connection-specific DNS Suffix .:
        Description.....................: VNet1
        Physical Address................:
        DHCP Enabled....................: No
        Autoconfiguration Enabled.......: Yes
        IPv4 Address....................: 192.168.130.2(Preferred)
        Subnet Mask.....................: 255.255.255.255
        Default Gateway.................:
        NetBIOS over Tcpip..............: Enabled
  ```

## <a name="connectVM"></a>Connect to a virtual machine

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm-p2s-classic-include.md)]

## <a name="add"></a>Add or remove trusted root certificates

You can add and remove trusted root certificates from Azure. When you remove a root certificate, clients that have a certificate generated from that root won't be able to authenticate, and thus will not be able to connect. If you want a client to authenticate and connect, you need to install a new client certificate generated from a root certificate that is trusted (uploaded) to Azure.

### <a name="addtrustedroot"></a>To add a trusted root certificate

You can add up to 20 trusted root certificate .cer files to Azure. For instructions, see [Section 3 - Upload the root certificate .cer file](#upload).

### <a name="removetrustedroot"></a>To remove a trusted root certificate

1. On the **VPN connections** section of the page for your VNet, click the **clients** graphic to open the **Point-to-site VPN connection** page.

  ![Clients](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clients125.png)
2. On the **Point-to-site connection** page, click **Manage certificates** to open the **Certificates** page.<br>

  ![Certificates page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/ptsmanage.png)<br><br>
3. On the **Certificates** page, click the ellipsis next to the certificate that you want to remove, then click **Delete**.

  ![Delete root certificate](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/deleteroot.png)<br>

## <a name="revokeclient"></a>Revoke a client certificate

You can revoke client certificates. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. This differs from removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. Revoking a client certificate, rather than the root certificate, allows the other certificates that were generated from the root certificate to continue to be used for authentication for the Point-to-Site connection.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

### <a name="revokeclientcert"></a>To revoke a client certificate

You can revoke a client certificate by adding the thumbprint to the revocation list.

1. Retrieve the client certificate thumbprint. For more information, see [How to: Retrieve the Thumbprint of a Certificate](https://msdn.microsoft.com/library/ms734695.aspx).
2. Copy the information to a text editor and remove all spaces so that it is a continuous string.
3. Navigate to the **'classic virtual network name' > Point-to-site VPN connection > Certificates** page and then click **Revocation list** to open the Revocation list page. 
4. On the **Revocation list** page, click **+Add certificate** to open the **Add certificate to revocation list** page.
5. On the **Add certificate to revocation list** page, paste the certificate thumbprint as one continuous line of text, with no spaces. Click **OK** at the bottom of the page.
6. After updating has completed, the certificate can no longer be used to connect. Clients that try to connect using this certificate receive a message saying that the certificate is no longer valid.

## <a name="faq"></a>Point-to-Site FAQ

[!INCLUDE [Point-to-Site FAQ](../../includes/vpn-gateway-faq-point-to-site-classic-include.md)]

## Next steps
Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/#pivot=services&panel=Compute). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-machines/linux/azure-vm-network-overview.md).

For P2S troubleshooting information, [Troubleshoot Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).