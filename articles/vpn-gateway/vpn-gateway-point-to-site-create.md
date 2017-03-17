---
title: 'Connect a computer to an Azure virtual network using Point-to-Site: classic portal| Microsoft Docs'
description: Securely connect to your classic Azure Virtual Network by creating a Point-to-Site VPN gateway connection using the classic portal.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 4f5668a5-9b3d-4d60-88bb-5d16524068e0
ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/08/2017
ms.author: cherylmc

---
# Configure a Point-to-Site connection to a VNet using the classic portal (classic)
> [!div class="op_single_selector"]
> * [Resource Manager - Azure Portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Classic - Azure Portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
> * [Classic - Classic Portal](vpn-gateway-point-to-site-create.md)
> 
> 

A Point-to-Site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. P2S is a VPN connection over SSTP (Secure Socket Tunneling Protocol). Point-to-Site connections are useful when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. P2S connections do not require a VPN device or a public-facing IP address. You establish the VPN connection from the client computer.

This article walks you through creating a VNet with a Point-to-Site connection in the classic deployment model using the classic portal. For more information about Point-to-Site connections, see the [Point-to-Site FAQ](#faq) at the end of this article.



### Deployment models and methods for P2S connections
[!INCLUDE [deployment models](../../includes/vpn-gateway-deployment-models-include.md)]

The following table shows the two deployment models and available deployment methods for P2S configurations. When an article with configuration steps is available, we link directly to it from this table.

[!INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-table-point-to-site-include.md)]

## Basic workflow
![Point-to-Site-diagram](./media/vpn-gateway-point-to-site-create/p2sclassic.png "point-to-site")

The following steps walk you through the steps to create a secure Point-to-Site connection to a virtual network. The configuration for a Point-to-Site connection is broken down into four sections. The order in which you configure each of these sections is important. Don't skip steps or jump ahead.

* **Section 1** Create a virtual network and VPN gateway.
* **Section 2** Create the certificates used for authentication and upload them.
* **Section 3** Export and install your client certificates.
* **Section 4** Configure your VPN client.



## <a name="vnetvpn"></a>Section 1 - Create a virtual network and a VPN gateway

Before beginning, verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Part 1: Create a virtual network
1. Log in to the [Azure classic portal](https://manage.windowsazure.com). These steps use the classic portal, not the Azure portal. Currently, you cannot create a P2S connection using the Azure portal.
2. In the lower left corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.
3. On the **Virtual Network Details** page, enter the following information, and then click the next arrow on the lower right.
   
   * **Name**: Name your virtual network. For example, 'VNet1'. This is the name that you'll refer to when you deploy VMs to this VNet.
   * **Location**: The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in East US, select that location. You can't change the region associated with your virtual network after you create it.
4. On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the next arrow on the lower right.
   
   * **DNS Servers**: Enter the DNS server name and IP address, or select a previously registered DNS server from the shortcut menu. This setting does not create a DNS server. It allows you to specify the DNS servers that you want to use for name resolution for this virtual network. If you want to use the Azure default name resolution service, leave this section blank.
   * **Configure Point-To-Site VPN**: Select the checkbox.
5. On the **Point-To-Site Connectivity** page, specify the IP address range from which your VPN clients will receive an IP address when connected. There are a few rules regarding the address ranges that you can specify. It's important to verify that the range that you specify doesn't overlap with any of the ranges located on your on-premises network.
6. Enter the following information, and then click the next arrow.
   
   * **Address Space**: Include the Starting IP and CIDR (Address Count).
   * **Add address space**: Add address space only if it is required for your network design.
7. On the **Virtual Network Address Spaces** page, specify the address range that you want to use for your virtual network. These are the dynamic IP addresses (DIPS) that will be assigned to the VMs and other role instances that you deploy to this virtual network.<br><br>It's especially important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You must coordinate with your network administrator, who may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.
8. Enter the following information, and then click the checkmark to begin creating your virtual network.
   
   * **Address Space**: Add the internal IP address range that you want to use for this virtual network, including Starting IP and Count. It's important to select a range that does not overlap with any of the ranges that are used for your on-premises network. 
   * **Add subnet**: Additional subnets are not required, but you may want to create a separate subnet for VMs that will have static DIPS. Or you might want to have your VMs in a subnet that's separate from your other role instances.
   * **Add gateway subnet**: The gateway subnet is required for a Point-to-Site VPN. Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway.
9. Once your virtual network has been created, you will see **Created** listed under **Status** on the networks page in the Azure classic portal. Once your virtual network has been created, you can create your dynamic routing gateway.

### Part 2: Create a dynamic routing gateway
The gateway type must be configured as dynamic. Static routing gateways do not work with this feature.

1. In the Azure classic portal, on the **Networks** page, click the virtual network that you created, and navigate to the **Dashboard** page.
2. At the bottom of the **Dashboard** page, click **Create Gateway**. A message appears asking **Do you want to create a gateway for virtual network "VNet1"**. Click **Yes** to begin creating the gateway. It can take up to 45 minutes for the gateway to create.

## <a name="generate"></a>Section 2 - Generate and upload certificates
Certificates are used by Azure to authenticate VPN clients for Point-to-Site VPNs. After creating the root certificate, you export the public certificate data (not the private key) as a Base-64 encoded X.509 .cer file. You then upload the public certificate data from the root certificate to Azure.

Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. The client certificate is generated from the root certificate and installed on each client computer. If a valid client certificate is not installed and the client tries to connect to the VNet, authentication fails.

In this section you will do the following:

* Obtain the .cer file for a root certificate. This can either be a self-signed root certificate, or you can use your enterprise certificate system.
* Upload the .cer file to Azure.
* Generate client certificates.

### <a name="root"></a>Part 1: Obtain the .cer file for the root certificate


If you are using an enterprise solution, you can use your existing certificate chain. Obtain the .cer file for the root certificate that you want to use.


If you are not using an enterprise certificate solution, you need to create a self-signed root certificate. To create a self-signed root certificate that contains the necessary fields for P2S authentication, you can use PowerShell. [Create a self-signed root certificate for Point-to-Site connections using PowerShell](vpn-gateway-certificates-point-to-site.md) walks you through the steps to create a self-signed root certificate.

> [!NOTE]
> Previously, makecert was the recommended method to create self-signed root certificates and generate client certificates for Point-to-Site connections. You can now use PowerShell to create these certificates. One benefit of using PowerShell is the ability to create SHA-2 certificates. See [Create a self-signed root certificate for Point-to-Site connections using PowerShell](vpn-gateway-certificates-point-to-site.md) for the required values.
>
>


#### To export the public key for a self-signed root certificate.

Point-to-Site connections require the public key (.cer) to be uploaded to Azure. The following steps help you export the .cer file for your self-signed root certificate.

1. To obtain a .cer file from the certificate, open **certmgr.msc**. Locate the self-signed root certificate, typically in 'Certificates - Current User\Personal\Certificates', and right-click. Click **All Tasks**, and then click **Export**. This opens the **Certificate Export Wizard**.
2. In the Wizard, click **Next**. Select **No, do not export the private key**, and then click **Next**.
3. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).**, and then click **Next**. 
4. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then click **Next**.
5. Click **Finish** to export the certificate. You will see **The export was successful**. Click **OK** to close the wizard.

### <a name="upload"></a>Part 2: Upload the root certificate .cer file to the Azure classic portal

Add a trusted certificate to Azure. When you add a Base64-encoded X.509 (.cer) file to Azure, you are telling Azure to trust the root certificate that the file represents. You can upload files for up to 20 root certificates. You do not upload the private key for the root certificate to Azure. Once the .cer file is uploaded, Azure uses it to authenticate clients that connect to the virtual network.

1. In the Azure classic portal, on the **Certificates** page for your virtual network, click **Upload a root certificate**.
2. On the **Upload Certificate** page, browse for the .cer root certificate, and then click the checkmark.

### <a name="createclientcert"></a>Part 3: Generate a client certificate
You can either generate a unique certificate for each client that will connect, or you can use the same certificate on multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate if needed. Otherwise, if everyone is using the same client certificate and you find that you need to revoke the certificate for one client, you will need to generate and install new certificates for all of the clients that use that certificate to authenticate.

####Enterprise certificate
- If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the 'domain name\username' format.
- Make sure the client certificate that you issue is based on the 'User' certificate template that has 'Client Authentication' as the first item in the use list, rather than Smart Card Logon, etc. You can check the certificate by double-clicking the client certificate and viewing **Details > Enhanced Key Usage**.

####Self-signed root root certificate 
If you are using a self-signed root certificate, see [Generate a client certificate using PowerShell](vpn-gateway-certificates-point-to-site.md#clientcert) for steps to generate a client certificate that is compatible with Point-to-Site connections.


## <a name="installclientcert"></a>Section 3 - Export and install the client certificate

After generating a client certificate, you must export the certificate as a .pfx file, and then install it on the client computer. Each client computer must have a client certificate to authenticate. You can automate installing the client certificate, or you can install the certificate manually. The following steps walk you through exporting and installing the client certificate manually.

### Export the client certificate

1. To export a client certificate, open **certmgr.msc**. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**. This opens the **Certificate Export Wizard**.
2. In the Wizard, click **Next**, then select **Yes, export the private key**, and then click **Next**.
3. On the **Export File Format** page, you can leave the defaults selected. Then click **Next**. 
4. On the **Security** page, you must protect the private key. If you select to use a password, make sure to record or remember the password that you set for this certificate. Then click **Next**.
5. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then click **Next**.
6. Click **Finish** to export the certificate.

### Install the client certificate

When installing the client certificate, you will need the password that was created when the client certificate was exported.

1. Locate and copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file to install. Leave the **Store Location** as **Current User**, then click **Next**.
2. On the **File** to import page, don't make any changes. Click **Next**.
3. On the **Private key protection** page, input the password for the certificate if you used one, or verify that the security principal that is installing the certificate is correct, then click **Next**.
4. On the **Certificate Store** page, leave the default location, and then click **Next**.
5. Click **Finish**. On the **Security Warning** for the certificate installation, click **Yes**. You can feel comfortable clicking 'Yes' because you generated the certificate. The certificate is now successfully imported.

## <a name="vpnclientconfig"></a>Section 4 - Configure your VPN client
To connect to the virtual network, you also need to configure a VPN client. The client requires both a client certificate and the proper VPN client configuration package to connect successfully. To configure a VPN client, perform the following steps, in order.

### Part 1: Create the VPN client configuration package
1. In the Azure classic portal, on the **Dashboard** page for your virtual network, navigate to the quick glance menu in the right corner. The VPN client package contains configuration information to configure the VPN client software built into Windows. The package does not install additional software. The settings are specific to the virtual network that you want to connect to. For the list of client operating systems that are supported, see the [Point-to-Site connections FAQ](#faq) at the end of this article.<br><br>Select the download package that corresponds to the client operating system on which it will be installed:
   
   * For 32-bit clients, select **Download the 32-bit Client VPN Package**.
   * For 64-bit clients, select **Download the 64-bit Client VPN Package**.
2. It takes a few minutes to create your client package. Once the package has been completed, you can download the file. The *.exe* file that you download can be safely stored on your local computer.
3. After you generate and download the VPN client package from the Azure classic portal, you can install the client package on the client computer from which you want to connect to your virtual network. If you plan to install the VPN client package to multiple client computers, make sure that they each also have a client certificate installed.

### Part 2: Install the VPN configuration package on the client
1. Copy the configuration file locally to the computer that you want to connect to your virtual network and double-click the .exe file. 
2. Once the package has installed, you can start the VPN connection. The configuration package is not signed by Microsoft. You may want to sign the package using your organization's signing service, or sign it yourself using [SignTool](http://go.microsoft.com/fwlink/p/?LinkId=699327). It's OK to use the package without signing. However, if the package isn't signed, a warning appears when you install the package.
3. On the client computer, navigate to **Network Settings** and click **VPN**. You will see the connection listed. It will show the name of the virtual network that it will connect to and will look similar to this: 
   
    ![VPN client](./media/vpn-gateway-point-to-site-create/vpn.png "VPN client")

### Part 3: Connect to Azure
1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It is named the same name as your virtual network. Click **Connect**. A pop-up message may appear that refers to using the certificate. If this happens, click **Continue** to use elevated privileges. 
2. On the **Connection** status page, click **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.
   
    ![VPN client 2](./media/vpn-gateway-point-to-site-create/clientconnect.png "VPN client connection")
3. Your connection should now be established.
   
    ![VPN client 3](./media/vpn-gateway-point-to-site-create/connected.png "VPN client connection 2")

> [!NOTE]
> If you are using a certificate that was issued using an Enterprise CA solution and are having trouble authenticating, check the authentication order on the client certificate. You can check the authentication list order by double-clicking the client certificate, and going to **Details > Enhanced Key Usage**. Make sure the list shows 'Client Authentication' as the first item. If not, you need to issue a client certificate based on the User template that has Client Authentication as the first item in the list. 
>
>

### Part 4: Verify the VPN connection
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

## <a name="faq"></a>Point-to-Site FAQ

[!INCLUDE [Point-to-Site FAQ](../../includes/vpn-gateway-point-to-site-faq-include.md)]

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/#pivot=services&panel=Compute). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-machines/virtual-machines-linux-azure-vm-network-overview.md).

