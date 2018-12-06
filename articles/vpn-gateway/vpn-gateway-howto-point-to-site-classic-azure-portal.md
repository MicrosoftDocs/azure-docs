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
ms.date: 12/04/2018
ms.author: cherylmc

---
# Configure a Point-to-Site connection to a VNet by using certificate authentication (classic): Azure portal

[!INCLUDE [deployment models](../../includes/vpn-gateway-classic-deployment-model-include.md)]

This article shows you how to create a VNet with a Point-to-Site connection. You create this Vnet with the classic deployment model by using the Azure portal. This configuration uses certificates to authenticate the connecting client, either self-signed or CA issued. 
You can also create this configuration with a different deployment tool or model by using options that are described in the following articles:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Azure portal (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
>

A Point-to-Site (P2S) VPN gateway lets you create a secure connection to your virtual network from an individual client computer. Point-to-Site VPN connections are useful when you want to connect to your VNet from a remote location. For example, when you're telecommuting from home or during a conference. When you have only a few clients that need to connect to a VNet, a P2S VPN is a useful solution to use instead of a Site-to-Site VPN. A P2S VPN connection is established by starting it from the client computer.

> [!IMPORTANT]
> The classic deployment model supports Windows VPN clients only and uses the Secure Socket Tunneling Protocol (SSTP), an SSL-based VPN protocol. In order to support non-Windows VPN clients, your VNet must be created by using the Resource Manager deployment model. The Resource Manager deployment model supports IKEv2 VPN in addition to SSTP. For more information, see [About P2S connections](point-to-site-about.md).
>
>

![Point-to-Site-diagram](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/point-to-site-connection-diagram.png)

## Prerequisites

Point-to-Site certificate authentication connections require the following prerequisites:

* A Dynamic VPN gateway.
* The public key (.cer file) for a root certificate, which is uploaded to Azure. This key is considered a trusted certificate and is used for authentication.
* A client certificate generated from the root certificate, and installed on each client computer that will connect. This certificate is used for client authentication.
* A VPN client configuration package must be generated and installed on every client computer that connects. The client configuration package configures the native VPN client that is already on the operating system with the necessary information to connect to the VNet.

Point-to-Site connections don't require a VPN device or an on-premises public-facing IP address. The VPN connection is created over SSTP (Secure Socket Tunneling Protocol). On the server side, we support SSTP versions 1.0, 1.1, and 1.2. The client decides which version to use. For Windows 8.1 and above, SSTP uses 1.2 by default. 

For more information about Point-to-Site connections, see the [Point-to-Site FAQ](#faq) at the end of this article.

### Example settings

You can use the following values to create a test environment, or refer to these values to better understand the examples in this article:

- **Create virtual network (classic) settings**
   - **Name**: Enter *VNet1*.
   - **Address space**: Enter *192.168.0.0/16*. For this example, we use only one address space. You can have more than one address space for your VNet, as shown in the diagram.
   - **Subnet name**: Enter *FrontEnd*.
   - **Subnet address range**: Enter *192.168.1.0/24*.
   - **Subscription**: Select a subscription from the list of available subscriptions.
   - **Resource group**: Enter *TestRG*. Select **Create new**, if the resource group doesn't exist.
   - **Location**: Select **East US** from the list.

 - **VPN connection settings**
   - **Connection type**: Select **Point-to-site**.
   - **Client Address Space**: Enter *172.16.201.0/24*. VPN clients that connect to the VNet by using this Point-to-Site connection receive an IP address from the specified pool.

- **Gateway configuration subnet settings**
   - **Name**: Autofilled with *GatewaySubnet*.
   - **Address range**: Enter *192.168.200.0/24*. 

- **Gateway configuration settings**:
   - **Size**: Select the gateway SKU that you want to use.
   - **Routing Type**: Select **Dynamic**.

## Create a virtual network and a VPN gateway

Before you begin, verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Part 1: Create a virtual network

If you don't already have a virtual network (VNet), create one. Screenshots are provided as examples. Be sure to replace the values with your own. To create a VNet by using the Azure portal, use the following steps:

1. Sign in to the [Azure portal](http://portal.azure.com) and select **Create a resource**. The **New** page opens. 

2. In the **Search the marketplace** field, enter *virtual network* and select **Virtual network** from the returned list. The **Virtual network** page opens.

3. Near the bottom of the **Virtual network** page, from the **Select a deployment model** list, select **Classic**, and then select **Create**.

  ![Select deployment model](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/selectmodel.png)

4. On the **Create virtual network** page, configure the VNet settings. On this page, you add your first address space and a single subnet address range. After you finish creating the VNet, you can go back and add additional subnets and address spaces.

  ![Create virtual network page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/vnet125.png)

5. Verify that the **Subscription** is the correct one. You can change subscriptions by using the drop-down.

6. Select a **Resource group**. Select an existing resource group. Or, create a new resource group by selecting **Create new** and entering its name. If you're creating a new resource group, name the resource group according to your planned configuration values. For more information about resource groups, visit [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md#resource-groups).

7. Select the **Location** settings for your VNet. The location determines the location of the resources that you deploy to this VNet.

8. Select **Create** to create the VNet. From the **Notifications** page, you'll see the **Deployment in progress** message.

8. After your virtual network has been created, the message on the **Notifications** page changes to **Deployment succeeded**. Select **Pin to dashboard** if you want to easily find your VNet on the dashboard. 

10. Add a DNS server (optional). After you create your virtual network, you can add the IP address of a DNS server for name resolution. The DNS server IP address that you specify should be the address of a DNS server that can resolve the names for the resources in your VNet.

    To add a DNS server, open the settings for your virtual network, select **DNS servers**, enter the IP address of the DNS server that you want to use, and select **Save**.

### Part 2: Create gateway subnet and a dynamic routing gateway

In this step, you create a gateway subnet and a dynamic routing gateway. In the Azure portal for the classic deployment model, you create the gateway subnet and the gateway through the same configuration pages. Use the gateway subnet for the gateway services only. Never deploy anything directly to the gateway subnet (such as VMs or other services).

1. In the Azure portal, navigate to the virtual network for which you want to create a gateway.

2. On the page for your virtual network, select **Overview**, and in the **VPN connections** section, select **Gateway**.

  ![Select to create a gateway](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/beforegw125.png)
3. On the **New VPN Connection** page, select **Point-to-site**.

  ![Point-to-Site connection type](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/newvpnconnect.png)
4. For **Client Address Space**, add the IP address range from which the VPN clients receive an IP address when connecting. Use a private IP address range that doesn't overlap with the on-premises location that you connect from, or with the VNet that you connect to. You can rewrite the autofilled range with the private IP address range that you want to use. This example shows the autofilled ranged. 

  ![Client address space](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clientaddress.png)
5. Select **Create gateway immediately**, and then select **Optional gateway configuration** to open the **Gateway configuration** page.

  ![Select optional gateway configuration](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/optsubnet125.png)
6. Select **Subnet** to add the gateway subnet. While it's possible to create a gateway subnet as small as /29, we recommend that you create a larger subnet that includes more addresses by selecting at least /28 or /27. Doing so will allow for enough addresses to accommodate possible additional configurations that you may want in the future. When working with gateway subnets, avoid associating a network security group (NSG) to the gateway subnet. Associating a network security group to this subnet may cause your VPN gateway to not function as expected.

  ![Add GatewaySubnet](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/gwsubnet125.png)
7. Select the gateway **Size**. The size is the gateway SKU for your virtual network gateway. In the Azure portal, the default SKU is **Default**. For more information about gateway SKUs, see [About VPN gateway settings](vpn-gateway-about-vpn-gateway-settings.md#gwsku).

  ![Gateway size](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/gwsize125.png)
8. Select the **Routing Type** for your gateway. P2S configurations require a **Dynamic** routing type. Select **OK** when you have finished configuring this page.

  ![Configure routing type](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/routingtype125.png)

9. On the **New VPN Connection** page, select **OK** at the bottom of the page to begin creating your virtual network gateway. A VPN gateway can take up to 45 minutes to complete, depending on the gateway sku that you select.

## Create certificates

Certificates are used by Azure to authenticate VPN clients for Point-to-Site VPNs. You upload the public key information of the root certificate to Azure. The public key is then considered *trusted*. Client certificates must be generated from the trusted root certificate, and then installed on each client computer in the *Certificates-Current User\Personal\Certificates* certificate store. The certificate is used to authenticate the client when it initiates a connection to the VNet. 

If you use self-signed certificates, they must be created by using specific parameters. You can create a self-signed certificate by using the instructions for [PowerShell and Windows 10](vpn-gateway-certificates-point-to-site.md), or [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md). It's important that you follow the steps in these instructions when working with self-signed root certificates and generating client certificates from the self-signed root certificate. Otherwise, the certificates you create won't be compatible with P2S connections and you'll receive a connection error.

### Part 1: Obtain the public key (.cer) for the root certificate

[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-p2s-rootcert-include.md)]

### Part 2: Generate a client certificate

[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-p2s-clientcert-include.md)]

## Upload the root certificate .cer file

After the gateway has been created, you can upload the .cer file (which contains the public key information) for a trusted root certificate to Azure. Don't upload the private key for the root certificate to Azure. After a .cer file is uploaded, Azure can use it to authenticate clients that have installed a client certificate that's generated from the trusted root certificate. You can later upload additional trusted root certificate files (up to 20), if needed.  

1. On the **VPN connections** section of the page for your VNet, select the **clients** graphic to open the **Point-to-site VPN connection** page.

  ![Clients](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clients125.png)

2. On the **Point-to-site connection** page, select **Manage certificates** to open the **Certificates** page.

  ![Certificates page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/ptsmanage.png)

1. On the **Certificates** page, select **Upload** to open the **Upload certificate** page.

    ![Upload certificates page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/uploadcerts.png)

4. Select the folder graphic to browse for the .cer file. Select the file, then select **OK**. Refresh the page to see the uploaded certificate on the **Certificates** page.

  ![Upload certificate](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/upload.png)


## Configure the client

To connect to a VNet by using a Point-to-Site VPN, each client must install a package to configure the native Windows VPN client. The configuration package configures the native Windows VPN client with the settings necessary to connect to the virtual network.

You can use the same VPN client configuration package on each client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the [Point-to-Site connections FAQ](#faq) at the end of this article.

### Part 1: Generate and install the VPN client configuration package

1. In the Azure portal, in the **Overview** page for your VNet, in **VPN connections**, select the client graphic to open the **Point-to-site VPN connection** page.

2. At the top of the **Point-to-site VPN connection** page, select the download package that corresponds to the client operating system on which it will be installed:

  * For 64-bit clients, select **VPN Client (64-bit)**.
  * For 32-bit clients, select **VPN Client (32-bit)**.

  ![Download VPN client configuration package](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/dlclient.png)

3. After the package generates, download and install it on your client computer. If you see a SmartScreen popup, select **More info**, then **Run anyway**. You can also save the package to install on other client computers.

### Part 2: Install the client certificate

If you want to create a P2S connection from a client computer other than the one you used to generate the client certificates, you need to install a client certificate. When installing a client certificate, you need the password that was created when the client certificate was exported. Typically, it's just a matter of double-clicking the certificate and installing it. For more information, see [Install an exported client certificate](vpn-gateway-certificates-point-to-site.md#install).

## Connect to Azure

### Connect to your VNet

>[!NOTE]
>You must have Administrator rights on the client computer from which you are connecting.
>
>

1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It has the same name as your virtual network. Select **Connect**. A pop-up message may appear that refers to using the certificate. If this message appears, select **Continue** to use elevated privileges.
2. On the **Connection** status page, select **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then select **OK**.

  ![VPN client connection](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clientconnect.png)
3. Your connection is established.

  ![Established connection](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/connected.png)

#### Troubleshooting P2S connections

[!INCLUDE [verify-client-certificates](../../includes/vpn-gateway-certificates-verify-client-cert-include.md)]

### Verify the VPN connection

1. To verify that your VPN connection is active, from your client computer, open an elevated command prompt, and run **ipconfig/all**.
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

## Connect to a virtual machine

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm-p2s-classic-include.md)]

## Add or remove trusted root certificates

You can add and remove trusted root certificates from Azure. When you remove a root certificate, clients that have a certificate generated from that root won't be able to authenticate, and thus won't be able to connect. If you want a client to authenticate and connect, you need to install a new client certificate generated from a root certificate that is trusted (uploaded) to Azure.

### To add a trusted root certificate

You can add up to 20 trusted root certificate .cer files to Azure. For instructions, see [Upload the root certificate .cer file](#upload-the-root-certificate-.cer-file).

### To remove a trusted root certificate

1. On the **VPN connections** section of the page for your VNet, select the **clients** graphic to open the **Point-to-site VPN connection** page.

  ![Clients](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clients125.png)
2. On the **Point-to-site connection** page, select **Manage certificates** to open the **Certificates** page.

  ![Certificates page](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/ptsmanage.png)

3. On the **Certificates** page, select the ellipsis next to the certificate that you want to remove, then select **Delete**.

  ![Delete root certificate](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/deleteroot.png)

## Revoke a client certificate

If necessary, you can revoke a client certificate. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. This method differs from removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. Revoking a client certificate, rather than the root certificate, allows the other certificates that were generated from the root certificate to continue to be used for authentication for the Point-to-Site connection.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

### To revoke a client certificate

You can revoke a client certificate by adding the thumbprint to the revocation list.

1. Retrieve the client certificate thumbprint. For more information, see [How to: Retrieve the Thumbprint of a Certificate](https://msdn.microsoft.com/library/ms734695.aspx).
2. Copy the information to a text editor and remove all spaces so that it's a continuous string.
3. Navigate to the **'classic virtual network name' > Point-to-site VPN connection > Certificates** page and then select **Revocation list** to open the Revocation list page. 
4. On the **Revocation list** page, select **+Add certificate** to open the **Add certificate to revocation list** page.
5. On the **Add certificate to revocation list** page, paste the certificate thumbprint as one continuous line of text, with no spaces. Select **OK** at the bottom of the page.
6. After updating has completed, the certificate can no longer be used to connect. Clients that try to connect by using this certificate receive a message saying that the certificate is no longer valid.

## Point-to-Site FAQ

[!INCLUDE [Point-to-Site FAQ](../../includes/vpn-gateway-faq-point-to-site-classic-include.md)]

## Next steps
After your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/#pivot=services&panel=Compute). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-machines/linux/azure-vm-network-overview.md).

For P2S troubleshooting information, [Troubleshoot Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).