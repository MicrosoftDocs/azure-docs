<properties
   pageTitle="Configure a Point-to-Site VPN connection to an Azure Virtual Network using the classic portal | Microsoft Azure"
   description="Securely connect to your Azure Virtual Network by creating a Point-to-Site VPN connection. Instructions for VNets that were created using the Service Management (classic) deployment model."
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
   ms.date="07/18/2016"
   ms.author="cherylmc"/>

# Configure a Point-to-Site VPN connection to a VNet using the classic portal

> [AZURE.SELECTOR]
- [PowerShell - Resource Manager](vpn-gateway-howto-point-to-site-rm-ps.md)
- [Portal - Classic](vpn-gateway-point-to-site-create.md)

A Point-to-Site configuration allows you to create a secure connection to your virtual network from a client computer, individually. A VPN connection is established by starting the connection from the client computer. Point-to-Site is an excellent solution when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. 

Point-to-Site connections do not require a VPN device or a public-facing IP address to work. For more information about Point-to-Site connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) and [About cross-premises connections](vpn-gateway-cross-premises-options.md).

This article applies to Point-to-Site VPN Gateway connections to a virtual network created using the **classic deployment model** (Service Management) and the classic portal. When we have steps for the Azure portal, we will link to that article from this page.

**Deployment models and tools for Point-to-Site connections**

[AZURE.INCLUDE [vpn-gateway-table-point-to-site](../../includes/vpn-gateway-table-point-to-site-include.md)] 


**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

![Point-to-Site-diagram](./media/vpn-gateway-point-to-site-create/point2site.png "point-to-site")



## About creating a Point-to-Site connection
 
The following steps will walk you through the steps to create a secure Point-to-Site connection to a virtual network. Although configuring a Point-to-Site connection requires multiple steps, it's a great way to have a secure connection from your computer to your virtual network without acquiring and configuring a VPN device. 

The configuration for a Point-to-Site connection is broken down into 4 sections. The order in which you configure each of these is important, so don't skip steps or jump ahead.


- **Section 1** will walk you through creating a virtual network and VPN gateway.
- **Section 2** will help you create the certificates used for authentication and upload them.
- **Section 3** will walk you through the steps to export and install your client certificates.
- **Section 4** will walk you through the steps to configure your VPN client.

## Section 1 - Create a virtual network and a VPN gateway


### Part 1: Create a virtual network

1. Log in to the [Azure classic portal](https://manage.windowsazure.com/). Note that these steps use the classic portal, not the Azure portal.

2. In the lower left corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.

3. On the **Virtual Network Details** page, enter the following information, and then click the next arrow on the lower right.
	- **Name**: Name your virtual network. For example, "VNetEast". This will be the name that you'll refer to when you deploy VMs and PaaS instances to this VNet.
	- **Location**: The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in East US, select that location. You can't change the region associated with your virtual network after you create it.

4. On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the next arrow on the lower right.
	- **DNS Servers**: Enter the DNS server name and IP address, or select a previously registered DNS server from the shortcut menu. This setting does not create a DNS server, it allows you to specify the DNS servers that you want to use for name resolution for this virtual network. If you want to use the Azure default name resolution service, leave this section blank.
	- **Configure Point-To-Site VPN**: Select the checkbox.

5. On the  **Point-To-Site Connectivity** page, specify the IP address range from which your VPN clients will receive an IP address when connected. There are a few rules regarding the address ranges that you can specify. It's very important to verify that the range that you specify doesn't overlap with any of the ranges located on your on-premises network.

6. Enter the following information, and then click the next arrow.
 - **Address Space**: Include the Starting IP and CIDR (Address Count).
 - **Add address space**: Add address space only if it is required for your network design.

7. On the **Virtual Network Address Spaces** page, specify the address range that you want to use for your virtual network. These are the dynamic IP addresses (DIPS) that will be assigned to the VMs and other role instances that you deploy to this virtual network. It's especially important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You'll need to coordinate with your network administrator, who may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.

8. Enter the following information, and then click the checkmark to begin creating your virtual network.
 - **Address Space**: Add the internal IP address range that you want to use for this virtual network, including Starting IP and Count. It's important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You'll need to coordinate with your network administrator, who may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.
 - **Add subnet**: Additional subnets are not required, but you may want to create a separate subnet for VMs that will have static DIPS. Or you might want to have your VMs in a subnet that's separate from your other role instances.
 - **Add gateway subnet**: The gateway subnet is required for a Point-to-Site VPN. Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway.

9. When your virtual network has been created, you will see **Created** listed under **Status** on the networks page in the Azure classic portal. Once your virtual network has been created, you can create your dynamic routing gateway.

### Part 2: Create a dynamic routing gateway

The gateway type must be configured as dynamic. Static routing gateways will not work with this feature.

1. In the Azure classic portal, on the **Networks** page, click the virtual network that you just created, and navigate to the **Dashboard** page.

2. Click **Create Gateway**, located at the bottom of the **Dashboard** page. A message will appear asking **Do you want to create a gateway for virtual network "yournetwork"**. Click **Yes** to begin creating the gateway. It can take around 15 minutes for the gateway to create.

## Section 2 - Generate and upload certificates

Certificates are used to authenticate VPN clients for Point-to-Site VPNs. You can use certificates generated by an enterprise certificate solution, as well as self-signed certificates. You can upload up to 20 root certificates to Azure.

If you want to use a self-signed certificate, the steps below will walk you through the process. If you are planning to use an enterprise certificate solution, the steps within each section will be different, but you'll still need to perform the following steps:

### Part 1: Identify or generate a root certificate

If you are not using an enterprise certificate solution, you'll need to generate a self-signed root certificate. The steps in this section were written for Windows 8. For Windows 10 steps, you can refer to [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md).

One way to create an X.509 certificate is by using the Certificate Creation Tool (makecert.exe). To use makecert, download and install [Microsoft Visual Studio Express](https://www.visualstudio.com/products/visual-studio-express-vs.aspx), which is free of charge.

1. Navigate to the Visual Studio Tools folder and start the command prompt as Administrator.

2. The command in the following example will create and install a root certificate in the Personal certificate store on your computer and also create a corresponding *.cer* file that you'll later upload to the Azure classic portal.

3. Change to the directory that you want the .cer file to be located in and run the following command, where *RootCertificateName* is the name that you want to use for the certificate. If you run the following example with no changes, the result will be a root certificate and the corresponding file *RootCertificateName.cer*.

>[AZURE.NOTE] Because you have created a root certificate from which client certificates will be generated, you may want to export this certificate along with its private key and save it to a safe location where it may be recovered.

    makecert -sky exchange -r -n "CN=RootCertificateName" -pe -a sha1 -len 2048 -ss My "RootCertificateName.cer"

### Part 2: Upload the root certificate .cer file to the Azure classic portal

You'll need to upload the corresponding .cer file for each root certificate to Azure. You can upload up to 20 certificates.

1. When you generated a root certificate in the earlier procedure, you also created a *.cer* file. You'll now upload that file to the Azure classic portal. Note that the .cer file doesn't contain the private key of the root certificate. You can upload up to 20 root certificates.

2. In the Azure classic portal, on the **Certificates** page for your virtual network, click **Upload a root certificate**.

3. On the **Upload Certificate** page, browse for the .cer root certificate, and then click the checkmark.

### Part 3: Generate a client certificate

The steps below are for generating a client certificate from the self-signed root certificate. The steps in this section were written for Windows 8. For Windows 10 steps, you can refer to [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md). If you are using an enterprise certificate solution, follow the guidelines for the solution you are using. 

1. On the same computer that you used to create the self-signed root certificate, open a Visual Studio command prompt window as administrator.

2. Change the directory to the location where you want to save the client certificate file. *RootCertificateName* refers to the self-signed root certificate that you generated. If you run the following example (changing the RootCertificateName to the name of your root certificate), the result will be a client certificate named "ClientCertificateName" in your Personal certificate store.

3. Type the following command:

    	makecert.exe -n "CN=ClientCertificateName" -pe -sky exchange -m 96 -ss My -in "RootCertificateName" -is my -a sha1

4. All certificates are stored in your Personal certificate store on your computer. Check *certmgr* to verify. You can generate as many client certificates as needed based on this procedure. We recommend that you create unique client certificates for each computer that you want to connect to the virtual network.

## Section 3 - Export and install the client certificate

Installing a client certificate on each computer that you want to connect to the virtual network is a mandatory step. The steps below will walk you through installing the client certificate manually.

1. A client certificate must be installed on each computer that you want to connect to the virtual network. This means you will probably create multiple client certificates and then need to export them. To export the client certificates, use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**.
2. Export the *client certificate* with the private key. This will be a *.pfx* file. Make sure to record or remember the password (key) that you set for this certificate.
3. Copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file in order to install it. Enter the password when requested. Do not modify the installation location.

## Section 4 - Configure your VPN client

To connect to the virtual network, you'll also need to configure your VPN client. The client requires both a client certificate and the proper VPN client configuration in order to connect. To configure your VPN client, perform the following steps, in order.

### Part 1: Create the VPN client configuration package

1. In the Azure classic portal, on the **Dashboard** page for your virtual network, navigate to the quick glance menu in the right corner and click the VPN package that pertains to the client that you want to connect to your virtual network.

2. 
The following client operating systems are supported:
 - Windows 7 (32-bit and 64-bit)
 - Windows Server 2008 R2 (64-bit only)
 - Windows 8 (32-bit and 64-bit)
 - Windows 8.1 (32-bit and 64-bit)
 - Windows Server 2012 (64-bit only)
 - Windows Server 2012 R2 (64-bit only)
 - Windows 10

3. Select the download package that corresponds to the client operating system on which it will be installed:
 - For 32-bit clients, select **Download the 32-bit Client VPN Package**.
 - For 64-bit clients, select **Download the 64-bit Client VPN Package**.

4. It will take a few minutes to create your client package. Once the package has been completed, you will be able to download the file. The *.exe* file that you download can be safely stored on your local computer.

5. After you generate and download the VPN client package from the Azure classic portal, you can install the client package on the client computer from which you want to connect to your virtual network. If you plan to install the VPN client package to multiple client computers, make sure that they each also have a client certificate installed. The VPN client package contains configuration information to configure the VPN client software built into Windows. The package does not install additional software.

### Part 2: Install the VPN configuration package on the client and start the connection

1. Copy the configuration file locally to the computer that you want to connect to your virtual network and double click the .exe file. Once the package has installed, you can start the VPN connection.
Note that the configuration package is not signed by Microsoft. You may want to sign the package using your organization's signing service, or sign it yourself using [SignTool]( http://go.microsoft.com/fwlink/p/?LinkId=699327). It's OK to use the package without signing. However, if the package isn't signed, a warning will appear when you install the package.
2. On the client computer, navigate to VPN connections and locate the VPN connection that you just created. It will be named the same name as your virtual network. Click **Connect**.
3. A pop-up message will appear which is used to create a self-signed cert for the Gateway endpoint. Click **Continue** to use elevated privileges.
4. On the **Connection** status page, click **Connect** in order to start the connection.
5. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.
6. You are now connected to your virtual network and have full access to any service and virtual machine hosted in your virtual network.

### Part 3: Verify the VPN connection

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site connectivity address range that you specified when you created your VNet. The results should be something similar to this:

Example:



    PPP adapter VNetEast:
		Connection-specific DNS Suffix .:
		Description.....................: VNetEast
		Physical Address................:
		DHCP Enabled....................: No
		Autoconfiguration Enabled.......: Yes
		IPv4 Address....................: 192.168.130.2(Preferred)
		Subnet Mask.....................: 255.255.255.255
		Default Gateway.................:
		NetBIOS over Tcpip..............: Enabled

## Next steps

You can add virtual machines to your virtual network. See [How to create a custom virtual machine](../virtual-machines/virtual-machines-windows-classic-createportal.md).

If you want more information about Virtual Networks, see the [Virtual Network Documentation](https://azure.microsoft.com/documentation/services/virtual-network/) page.
