---
title: 'Connect a computer to an Azure virtual network using Point-to-Site: Portal | Microsoft Docs'
description: Securely connect to your Azure Virtual Network by creating a Point-to-Site VPN gateway connection using Resource Manager and the Azure portal.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: a15ad327-e236-461f-a18e-6dbedbf74943
ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/17/2017
ms.author: cherylmc

---
# Configure a Point-to-Site connection to a VNet using the Azure portal
> [!div class="op_single_selector"]
> * [Resource Manager - Azure Portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Classic - Azure Portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
> 
> 

A Point-to-Site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. A P2S connection is useful when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. 

Point-to-Site connections do not require a VPN device or a public-facing IP address to work. A VPN connection is established by starting the connection from the client computer. For more information about Point-to-Site connections, see the [Point-to-Site FAQ](#faq) at the end of this article.

This article walks you through creating a VNet with a Point-to-Site connection using the Azure portal. The steps apply to the Resource Manager deployment model.

### Deployment models and methods for P2S connections
[!INCLUDE [deployment models](../../includes/vpn-gateway-deployment-models-include.md)]

The following table shows the two deployment models and available deployment methods for P2S configurations. When an article with configuration steps is available, we link directly to it from this table.

[!INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-table-point-to-site-include.md)]

## Basic workflow
![Point-to-Site-diagram](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/point-to-site-connection-diagram.png)

### <a name="example"></a>Example values
* **Name: VNet1**
* **Address space: 192.168.0.0/16**<br>For this example, we use only one address space. You can have more than one address space for your VNet.
* **Subnet name: FrontEnd**
* **Subnet address range: 192.168.1.0/24**
* **Subscription:** If you have more than one subscription, verify that you are using the correct one.
* **Resource Group: TestRG**
* **Location: East US**
* **GatewaySubnet: 192.168.200.0/24**
* **Virtual network gateway name: VNet1GW**
* **Gateway type: VPN**
* **VPN type: Route-based**
* **Public IP address: VNet1GWpip**
* **Connection type: Point-to-site**
* **Client address pool: 172.16.201.0/24**<br>VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from the client address pool.

## Before beginning
* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

## <a name="createvnet"></a>Part 1 - Create a virtual network
If you are creating this configuration as an exercise, you can refer to the [example values](#example).

[!INCLUDE [vpn-gateway-basic-vnet-rm-portal](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## <a name="address"></a>Part 2 - Specify address space and subnets
You can add additional address space and subnets to your VNet once it has been created.

[!INCLUDE [vpn-gateway-additional-address-space](../../includes/vpn-gateway-additional-address-space-include.md)]

## <a name="gatewaysubnet"></a>Part 3 - Add a gateway subnet

Before connecting your virtual network to a gateway, you first need to create the gateway subnet for the virtual network to which you want to connect. The gateway services use the IP addresses specified in the gateway subnet. If possible, create a gateway subnet using a CIDR block of /28 or /27 to provide enough IP addresses to accommodate additional future configuration requirements.

The screenshots in this section are provided as a reference example. Be sure to use the GatewaySubnet address range that corresponds with the required values for your configuration.

###To create a gateway subnet

[!INCLUDE [vpn-gateway-add-gwsubnet-rm-portal](../../includes/vpn-gateway-add-gwsubnet-rm-portal-include.md)]

## <a name="dns"></a>Part 4 - Specify a DNS server (optional)
[!INCLUDE [vpn-gateway-add-dns-rm-portal](../../includes/vpn-gateway-add-dns-rm-portal-include.md)]

## <a name="creategw"></a>Part 5 - Create a virtual network gateway
Point-to-site connections require the following settings:

* Gateway type: VPN
* VPN type: Route-based

### To create a virtual network gateway
[!INCLUDE [vpn-gateway-add-gw-rm-portal](../../includes/vpn-gateway-add-gw-rm-portal-include.md)]

## <a name="generatecert"></a>Part 6 - Generate certificates
Certificates are used by Azure to authenticate VPN clients for Point-to-Site VPNs. You export public certificate data (not the private key) as a Base-64 encoded X.509 .cer file from either a root certificate generated by an enterprise certificate solution, or a self-signed root certificate. You then import the public certificate data from the root certificate to Azure. Additionally, you need to generate a client certificate from the root certificate for clients. Each client that wants to connect to the virtual network using a P2S connection must have a client certificate installed that was generated from the root certificate.

### <a name="getcer"></a>Step 1 - Obtain the .cer file for the root certificate

You need to obtain the .cer file for the root certificate. You can either use a root certificate from an enterprise solution, or you can [create a self-signed root certificate using makecert](vpn-gateway-certificates-point-to-site.md). While it is possible to use PowerShell to create self-signed certificates, the certificate that is generated by using PowerShell does not contain the fields necessary for P2S connections.

1. To obtain a .cer file from a certificate, open **certmgr.msc** and locate the root certificate. Right-click the self-signed root certificate, click **all tasks**, and then click **export**. The **Certificate Export Wizard** will open.
2. In the Wizard, click **Next**, select **No, do not export the private key**, and then click **Next**.
3. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).** Then, click **Next**. 
4. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then click **Next**.
5. Click **Finish** to export the certificate.

### <a name="generateclientcert"></a>Step 2 - Generate a client certificate
You can either generate a unique certificate for each client that will connect to the virtual network, or you can use the same certificate on multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate if needed. Otherwise, if everyone is using the same client certificate and you find that you need to revoke the certificate for one client, you will need to generate and install new certificates for all the clients that use that certificate to authenticate.

####Enterprise certificate
- If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the 'domain name\username' format.
- Make sure the client certificate that you issue is based on the 'User' certificate template that has 'Client Authentication' as the first item in the use list, rather than Smart Card Logon, etc. You can check the certificate by double-clicking the client certificate and viewing **Details > Enhanced Key Usage**.

####Self-signed certificate 
If you are using a self-signed certificate, see [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md) to generate a client certificate.

### <a name="exportclientcert"></a>Step 3 - Export the client certificate
A client certificate is required for authentication. After generating the client certificate, export it. The client certificate you export will be installed later on each client computer.

1. To export a client certificate, you can use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**.
2. Export the client certificate with the private key. This is a *.pfx* file. Make sure to record or remember the password (key) that you set for this certificate.

## <a name="addresspool"></a>Part 7 - Add the client address pool
1. Once the virtual network gateway has been created, navigate to the **Settings** section of the virtual network gateway blade. In the **Settings** section, click **Point-to-site configuration** to open the **Configuration** blade.
   
    ![Point-to-Site blade](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration.png)
2. **Address pool** is the pool of IP addresses from which clients that connect will receive an IP address. Add the address pool, and then click **Save**.
   
    ![Client address pool](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/ipaddresspool.png)

## <a name="uploadfile"></a>Part 8 - Upload the root certificate .cer file
After the gateway has been created, you can upload the .cer file for a trusted root certificate to Azure. You can upload files for up to 20 root certificates. You do not upload the private key for the root certificate to Azure. Once the .cer file is uploaded, Azure uses it to authenticate clients that connect to the virtual network.

1. Certificates are added on the **Point-to-site configuration** blade in the **Root certificate** section.  
2. Make sure that you exported the root certificate as a Base-64 encoded X.509 (.cer) file. You need to export it in this format so that you can open the certificate with text editor.
3. Open the certificate with a text editor, such as Notepad. Copy only the following section as one continuous line:
   
    ![Certificate data](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/copycert.png)

	> [!NOTE]
	> When copying the certificate data, make sure that you copy the text as one continuous line without carriage returns or line feeds. You may need to modify your view in the text editor to 'Show Symbol/Show all characters' to see the carriage returns and line feeds.                                                                                                                                                                            
	>
	>

4. Paste the certificate data into the **Public Certificate Data** field. **Name** the certificate, and then click **Save**. You can add up to 20 trusted root certificates.
   
    ![Certificate upload](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/rootcertupload.png)

## <a name="clientconfig"></a>Part 9 - Download and install the VPN client configuration package
Clients connecting to Azure using P2S must have both a client certificate, and a VPN client configuration package installed. VPN client configuration packages are available for Windows clients. 

The VPN client package contains information to configure the VPN client software that is built into Windows. The configuration is specific to the VPN that you want to connect to. The package does not install additional software.

1. On the **Point-to-site configuration** blade, click **Download VPN client** to open the **Download VPN client** blade.
   
    ![VPN client download 1](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/downloadvpnclient1.png)
2. Select the correct package for your client, then click **Download**. For 64-bit clients, select **AMD64**. For 32-bit clients, select **x86**.

	![VPN client download 2](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/client.png)
3. Install the package on the client computer. If you get a SmartScreen popup, click **More info**, then **Run anyway** to install the package.
4. On the client computer, navigate to **Network Settings** and click **VPN**. You will see the connection listed. It will show the name of the virtual network that it will connect to and looks similar to this example: 
   
    ![VPN client](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/vpn.png)


## <a name="installclientcert"></a>Part 10 - Install the client certificate
Each client computer must have a client certificate to authenticate. When installing the client certificate, you will need the password that was created when the client certificate was exported.

1. Copy the .pfx file to the client computer.
2. Double-click the .pfx file to install it. Do not modify the installation location.

## <a name="connect"></a>Part 11 - Connect to Azure
1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It is named the same name as your virtual network. Click **Connect**. A pop-up message may appear that refers to using the certificate. If this happens, click **Continue** to use elevated privileges. 
2. On the **Connection** status page, click **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.
   
    ![VPN client connecting to Azure](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/clientconnect.png)

	
3. Your connection should now be established.
   
    ![VPN client connected to Azure](./media/vpn-gateway-howto-point-to-site-resource-manager-portal/connected.png)
                                                                                                                                                                           

> [!NOTE]
> If you are using a certificate that was issued using an Enterprise CA solution and are having trouble authenticating, check the authentication order on the client certificate. You can check the authentication list order by double-clicking the client certificate, and going to **Details > Enhanced Key Usage**. Make sure the list shows 'Client Authentication' as the first item. If not, you need to issue a client certificate based on the User template that has Client Authentication as the first item in the list. 
>
>

## <a name="verify"></a>Part 12 - Verify your connection
1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site VPN Client Address Pool that you specified in your configuration. The results should be something similar to this:
   
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

## <a name="add"></a>To add or remove trusted root certificates
You can remove trusted root certificate from Azure. When you remove a trusted certificate, the client certificates that were generated from the root certificate will no longer be able to connect to Azure via Point-to-Site. If you want clients to connect, they need to install a new client certificate that is generated from a certificate that is trusted in Azure.

You can manage the list of revoked client certificates on the **Point-to-site configuration** blade. This is the blade that you used to [upload a trusted root certificate](#uploadfile).

## <a name="revokeclient"></a>To manage the list of revoked client certificates
You can revoke client certificates. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. If you remove a root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. If you want to revoke a particular client certificate, not the root, you can do so. That way the other certificates that were generated from the root certificate will still be valid. 

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

You can manage the list of revoked client certificates on the **Point-to-site configuration** blade. This is the blade that you used to [upload a trusted root certificate](#uploadfile). Add the certificate name and thumbprint, then save.

## <a name="faq"></a>Point-to-Site FAQ

[!INCLUDE [Point-to-Site FAQ](../../includes/vpn-gateway-point-to-site-faq-include.md)]

## Next steps
Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/#pivot=services&panel=Compute).

