<properties
   pageTitle="Configure a Point-to-Site VPN gateway connection to an Azure Virtual Network using the Azure portal | Microsoft Azure"
   description="Securely connect to your Azure Virtual Network by creating a Point-to-Site VPN gateway connection using the Azure portal."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-service-management"/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="10/06/2016"
   ms.author="cherylmc"/>

# Configure a Point-to-Site connection to a VNet using the Azure portal

> [AZURE.SELECTOR]
- [Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
- [Classic - Azure Portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
- [Classic - Classic Portal](vpn-gateway-point-to-site-create.md)

This article walks you through creating a VNet with a Point-to-Site connection in the classic deployment model using the Azure portal. A Point-to-Site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. A P2S connection is useful when you want to connect to your VNet from a remote location, such as from home or a conference. Or, when you only have a few clients that need to connect to a virtual network.

Point-to-Site connections do not require a VPN device or a public-facing IP address to work. A VPN connection is established by starting the connection from the client computer. For more information about Point-to-Site connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) and [About VPN Gateway](vpn-gateway-about-vpngateways.md#point-to-site).


### Deployment models and methods for P2S connections

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)]

The following table shows the two deployment models and the available deployment tools for each deployment model. When an article is available, we link to it.

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-table-point-to-site-include.md)] 

## Basic workflow 

![Point-to-Site-diagram](./media/vpn-gateway-howto-point-to-site-rm-ps/p2srm.png "point-to-site")


The following sections walk you through the steps to create a secure Point-to-Site connection to a virtual network. 

1. Create a virtual network and VPN gateway
2. Generate certificates
3. Upload the .cer file
4. Generate the VPN client configuration package
5. Configure the client computer
6. Connect to Azure

### Example settings

You can use the following example settings:

- **Name: VNet1**
- **Address space: 192.168.0.0/16**
- **Subnet name: FrontEnd**
- **Subnet address range: 192.168.1.0/24**
- **Subscription:** Verify that you have the correct subscription if you have more than one.
- **Resource Group: TestRG**
- **Location: East US**
- **Connection type: Point-to-site**
- **Client Address Space: 172.16.201.0/24**. VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from the specified pool.
- **GatewaySubnet: 192.168.200.0/24**. The Gateway subnet must use the name "GatewaySubnet".
- **Size:** Select the gateway SKU that you want to use.
- **Routing Type: Dynamic**

## <a name="vnetvpn"></a>Section 1 - Create a virtual network and a VPN gateway

### Part 1: Create a virtual network

To create a VNet by using the Azure portal, use the following steps. Screenshots are provided as examples. Be sure to replace the values with your own.

1. From a browser, navigate to the [Azure portal](http://portal.azure.com) and, if necessary, sign in with your Azure account.

2. Click **New**. In the **Search the marketplace** field, type "Virtual Network". Locate **Virtual Network** from the returned list and click to open the **Virtual Network** blade.

	![Search for virtual network blade](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/newvnetportal700.png "Search for virtual network blade")

3. Near the bottom of the Virtual Network blade, from the **Select a deployment model** list, select **Classic**, and then click **Create**.

	![Select deployment model](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/selectmodel.png "Select deployment model")

4. On the **Create virtual network** blade, configure the VNet settings. In this blade, you'll add your first address space and a single subnet address range. After you finish creating the VNet, you can go back and add additional subnets and address spaces.

	![Create virtual network blade](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/vnet125.png "Create virtual network blade")

5. Verify that the **Subscription** is the correct one. You can change subscriptions by using the drop-down.

6. Click **Resource group** and either select an existing resource group, or create a new one by typing a name for your new resource group. If you are creating a new group, name the resource group according to your planned configuration values. For more information about resource groups, visit [Azure Resource Manager Overview](resource-group-overview.md#resource-groups).

7. Next, select the **Location** settings for your VNet. The location will determine where the resources that you deploy to this VNet will reside.

8. Select **Pin to dashboard** if you want to be able to find your VNet easily on the dashboard, and then click **Create**.
	
	![Pin to dashboard](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/pintodashboard150.png "Pin to dashboard")


9. After clicking Create, you will see a tile on your dashboard that will reflect the progress of your VNet. The tile changes as the VNet is being created.

	![Creating virtual network tile](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/deploying150.png "Creating virtual network tile")

10. After you create your virtual network, you can add the IP address of a DNS server in order to handle name resolution. Open the settings for your virtual network, click DNS servers, and add the IP address of the DNS server that you want to use. This setting does not create a new DNS server. Be sure to add a DNS server that your resources can communicate with.

Once your virtual network has been created, you will see **Created** listed under **Status** on the networks page in the Azure classic portal.

### Part 2: Create gateway subnet and a dynamic routing gateway

In this step, you will create a gateway subnet and a Dynamic routing gateway. In the Azure portal for the classic deployment model, creating the gateway subnet and the gateway can be done through the same configuration blades.

1. In the portal, navigate to the virtual network for which you want to create a gateway.

2. On the blade for your virtual network, on the **Overview** blade, in the VPN connections section, click **Gateway**.

	![Click here to create a gateway](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/beforegw125.png "Click here to create a gateway")


3. On the **New VPN Connection** blade, select **Point-to-site**.

	![P2S connection type](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/newvpnconnect.png "P2S connection type")

4. For **Client Address Space**, add the IP address range. This is the range from which the VPN clients will receive an IP address when connecting. Delete the auto-filled range and add your own.

	![Client address space](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clientaddress.png "Client address space")

5. Select the **Create gateway immediately** checkbox.

	![Create gateway immediately](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/creategwimm.png "Create gateway immediately")

6. Click **Optional gateway configuration** to open the **Gateway configuration** blade.

	![Click optional gateway configuration](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/optsubnet125.png "Click optional gateway configuration")

7. Click **Subnet Configure required settings** to add the gateway subnet. While it is possible to create a GatewaySubnet of /29, we recommend that you create a larger subnet that includes more addresses by selecting at least /28 or /27.

	![Add GatewaySubnet](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/gwsubnet125.png "Add GatewaySubnet")

8. Select the gateway **Size**. This is the gateway SKU that you will use to create your virtual network gateway. In the portal, the Default SKU is **Basic**. For more information about gateway SKUs, see [About VPN Gateway Settings](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsku).

	![gateway size](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/gwsize125.png)

9. Select the **Routing Type** for your gateway. P2S configurations require a **Dynamic** routing type. Click **OK** when you have finished configuring this blade.

	![Configure routing type](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/routingtype125.png "Configure routing type")

10. On the **New VPN Connection** blade, click **OK** at the bottom of the blade to begin creating your virtual network gateway. This can take up to 45 minutes to complete. 


## <a name="generatecerts"></a>Section 2 - Generate certificates

Certificates are used by Azure to authenticate VPN clients for Point-to-Site VPNs. You can use the .cer file from either a root certificate generated by an enterprise certificate solution, or a self-signed root certificate. In this section, you will obtain the .cer file for the root certificate and a client certificate generated from the root cert.

### <a name="root"></a>Part 1: Obtain the .cer file for the root certificate

- If you are using an enterprise certificate system, obtain the .cer file for the root certificate that you want to use. 

- If you are not using an enterprise certificate solution, you need to generate a self-signed root certificate. For Windows 10 steps, you can refer to [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md). The article walks you through using makecert to generate a self-signed certificate, and then export the .cer file.

### Part 2: Generate a client certificate

You can either generate a unique certificate for each client that will connect, or you can use the same certificate on multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate if needed. Otherwise, if everyone is using the same client certificate and you find that you need to revoke the certificate for one client, you will need to generate and install new certificates for all of the clients that use that certificate to authenticate.

- If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the 'domain name\username' format. 

- If you are using a self-signed certificate, see [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md) to generate a client certificate.

### Part 3: Export the client certificate

Install a client certificate on each computer that you want to connect to the virtual network. A client certificate is required for authentication. You can automate installing the client certificate, or you can install it manually. The following steps walk you through exporting and installing the client certificate manually.

1. To export a client certificate, you can use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**.
2. Export the client certificate with the private key. This is a *.pfx* file. Make sure to record or remember the password (key) that you set for this certificate.

## <a name="upload"></a>Section 3 - Upload the .cer file

After the gateway has been created, you can upload the .cer file for a trusted root certificate to Azure. You can upload files for up to 20 root certificates. You do not upload the private key for the certificate to Azure. Once the .cer file is uploaded, Azure uses it to authenticate clients that connect to the virtual network.

1. On the **VPN connections** section of the blade for your VNet, click the **clients** graphic to open the **Point-to-site VPN connection** blade.

	![Clients](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clients125.png "Clients")

2. On the **Point-to-site connection** blade, click **Manage certificates** to open the **Certificates** blade.<br>

	![Certificates blade](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/ptsmanage.png "Certificates blade")<br><br>


3. On the **Certificates** blade, click **Upload** to open the **Upload certificate** blade.<br>

	![Upload certificates blade](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/uploadcerts.png "Upload certificates blade")<br>


4. Click the folder graphic to browse for the .cer file. Select the file, then click **OK**. Refresh the page to see the uploaded certificate on the **Certificates** blade.

	![Upload certificate](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/upload.png "Upload certificate")<br>
	

## <a name="vpnclientconfig"></a>Section 4 - Generate the VPN client configuration package

To connect to the virtual network, you also need to configure a VPN client. The client computer requires both a client certificate and the proper VPN client configuration package in order to connect.

The VPN client package contains configuration information to configure the VPN client software built into Windows. The package does not install additional software. The settings are specific to the virtual network that you want to connect to. For the list of client operating systems that are supported, see the [Point-to-Site connections](vpn-gateway-vpn-faq.md#point-to-site-connections) section of the VPN Gateway FAQ. 

### To generate the VPN client configuration package

1. In the Azure portal, in the **Overview** blade for your VNet, in **VPN connections**, click the client graphic to open the **Point-to-site VPN connection** blade.
2. At the top of the **Point-to-site VPN connection** blade, click the download package that corresponds to the client operating system on which it will be installed:

 - For 64-bit clients, select **VPN Client (64-bit)**.
 - For 32-bit clients, select **VPN Client (32-bit)**.

	![Download VPN client configuration package](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/dlclient.png "Download VPN client configuration package")<br>


3. You will see a message that Azure is generating the VPN client configuration package for the virtual network. After a few minutes, the package is generated and you will see a message on your local computer that the package has been downloaded. Save the configuration package file. You will install this on each client computer that will connect to the virtual network using P2S.


## Section 5 - Configure the client computer

### Part 1: Install the client certificate

Each client computer must have a client certificate in order to authenticate. When installing the client certificate, you will need the password that was created when the client certificate was exported.

1. Copy the .pfx file to the client computer.
2. Double-click the .pfx file to install it. 

### Part 2: Install the VPN client configuration package

You can use the same VPN client configuration package on each client computer, provided that the version matches the architecture for the client.

1. Copy the configuration file locally to the computer that you want to connect to your virtual network and double-click the .exe file. 

2. Once the package has installed, you can start the VPN connection. The configuration package is not signed by Microsoft. You may want to sign the package using your organization's signing service, or sign it yourself using [SignTool]( http://go.microsoft.com/fwlink/p/?LinkId=699327). It's OK to use the package without signing. However, if the package isn't signed, a warning appears when you install the package.

3. On the client computer, navigate to **Network Settings** and click **VPN**. You will see the connection listed. It shows the name of the virtual network that it will connect to and will look similar to this: 

	![VPN client](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/vpn.png "VNet VPN client")

## Section 6 - Connect to Azure

### Connect to your VNet

1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It is named the same name as your virtual network. Click **Connect**. A pop-up message may appear that refers to using the certificate. If this happens, click **Continue** to use elevated privileges. 

2. On the **Connection** status page, click **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.

	![Connect](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/clientconnect.png "VPN client connection")

3. Your connection should now be established.

	![Established connection](./media/vpn-gateway-howto-point-to-site-classic-azure-portal/connected.png "Connection established")

### Verify the VPN connection

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site connectivity address range that you specified when you created your VNet. The results should be something similar to this:

Example:



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

## Next steps

You can add virtual machines to your virtual network. See [How to create a custom virtual machine](../virtual-machines/virtual-machines-windows-classic-createportal.md).