<properties
   pageTitle="Configure a point-to-site VPN connection to an Azure Virtual Network | Microsoft Azure"
   description="Securely connect to your Azure Virtual Network by creating a point-to-site VPN connection."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="jdial"
   editor="tysonn"/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/11/2015"
   ms.author="cherylmc"/>

# Configure a point-to-site VPN connection to an Azure Virtual Network


>[AZURE.NOTE] This article applies to point-to-site connections for virtual networks that are created in the classic deployment mode. At this time, point-to-site connections to a virtual network created in the Azure Resource Manager deployment mode are not supported.

The following procedure will walk you through the steps to create a secure point-to-site connection to a virtual network. Although configuring a point-to-site connection requires multiple steps, it's a great way to have a secure connection from your computer to your virtual network without acquiring and configuring a VPN device. There are three main parts to configuring a point-to-site VPN: the virtual network and VPN gateway, the certificates used for authentication, and the VPN client that is used to connect to your virtual network. The order in which you configure each of these is important, so don't skip steps or jump ahead.


1. [Create a virtual network and a VPN gateway](#create-a-virtual-network-and-a-vpn-gateway).
2. [Create your certificates](#create-your-certificates).
3. [Configure your VPN client](#configure-your-vpn-client).

## Create a virtual network and a VPN gateway



A point-to-site connection requires a virtual network with a dynamic routing gateway. The following steps will walk you through creating both.

### Create a virtual network

1. Log in to the **Azure portal**.
1. In the lower left corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.
1. On the **Virtual Network Details** page, enter the following information, and then click the next arrow on the lower right.
	- **Name**: Name your virtual network. For example "VNetEast". This will be the name that you'll refer to when you deploy VMs and PaaS instances to this VNet.
	- **Location**: The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in East US, select that location. You can't change the region associated with your virtual network after you create it.
1. On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the next arrow on the lower right.
	- **DNS Servers**: Enter the DNS server name and IP address, or select a previously registered DNS server from the shortcut menu. This setting does not create a DNS server, it allows you to specify the DNS servers that you want to use for name resolution for this virtual network. If you want to use the Azure default name resolution service, leave this section blank.
	- **Configure Point-To-Site VPN**: Select the checkbox.
1. On the  **Point-To-Site Connectivity** page, specify the IP address range from which your VPN clients will receive an IP address when connected. There are a few rules regarding the address ranges that you are able to specify. It's very important to verify that the range that you specify doesn't overlap with any of the ranges located on your on-premises network.
1. Enter the following information, and then click the next arrow.
 - **Address Space**: Include the Starting IP and CIDR (Address Count).
 - **Add address space**: Add only if required for your network design.
1. On the **Virtual Network Address Spaces** page, specify the address range that you want to use for your virtual network. These are the dynamic IP addresses (DIPS) that will be assigned to the VMs and other role instances that you deploy to this virtual network. It's especially important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You'll need to coordinate with your network administrator, who may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.
1. Enter the following information, and then click the checkmark to begin creating your virtual network.
 - **Address Space**: Add the internal IP address range that you want to use for this virtual network, including Starting IP and Count. It's important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You'll need to coordinate with your network administrator, who may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.
 - **Add subnet**: Additional subnets are not required, but you may want to create a separate subnet for VMs that will have static DIPS. Or you might want to have your VMs in a subnet that's separate from your other role instances.
 - **Add gateway subnet**: The gateway subnet is required for a point-to-site VPN. Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway.
1. When your virtual network has been created, you will see **Created** listed under **Status** on the networks page in the Azure portal. Once your virtual network has been created, you can create your dynamic routing gateway.

### Create a dynamic routing gateway

1. In the Azure portal, on the **Networks** page, click the virtual network that you just created, and navigate to the **Dashboard** page.
1. Click **Create Gateway**, located at the bottom of the **Dashboard** page. A message will appear asking **Do you want to create a gateway for virtual network "yournetwork"**. Click **Yes** to begin creating the gateway. It can take around 15 minutes for the gateway to create.

## Create your certificates

Certificates are used to authenticate VPN clients for point-to-site VPNs. This procedure has multiple steps. Use the following links to complete each step, in order.

1. [Generate a self-signed root certificate](#generate-a-self-signed-root-certificate) - Only self-signed root certificates are supported at this time.
2. [Upload the root certificate file to the Azure portal](#upload-the-root-certificate-file-to-the-management-portal).
3. [Generate a client certificate](#generate-a-client-certificate).
4. [Export and install the client certificate](#export-and-install-the-client-certificate).

### Generate a self-signed root certificate

1. One way to create an X.509 certificate is by using the Certificate Creation Tool (makecert.exe). To use makecert, download and install [Microsoft Visual Studio Express 2013 for Windows Desktop](https://www.visualstudio.com/products/visual-studio-express-vs.aspx), which is free of charge.
2. Navigate to the Visual Studio Tools folder and start the command prompt as Administrator.
3. The command in the following example will create and install a root certificate in the Personal certificate store on your computer and also create a corresponding *.cer* file that you'll later upload to the Azure portal.
4. Change to the directory that you want the .cer file to be located in and run the following command, where *RootCertificateName* is the name that you want to use for the certificate. If you run the following example with no changes, the result will be a root certificate and the corresponding file *RootCertificateName.cer*.

>[AZURE.NOTE] Because you have created a root certificate from which client certificates will be generated, you may want to export this certificate along with its private key and save it to a safe location where it may be recovered.

    makecert -sky exchange -r -n "CN=RootCertificateName" -pe -a sha1 -len 2048 -ss My "RootCertificateName.cer"

### Upload the root certificate file to the Azure portal

1. When you generated a self-signed root certificate in the earlier procedure, you also created a *.cer* file. You'll now upload that file to the Azure portal. Note that the .cer file doesn't contain the private key of the root certificate.
1. In the Azure portal, on the **Certificates** page for your virtual network, click **Upload a root certificate**.
1. On the **Upload Certificate** page, browse for the .cer root certificate, and then click the checkmark.

### Generate a client certificate

1. On the same computer that you used to create the self-signed root certificate, open a Visual Studio command prompt window as administrator.
2. Change the directory to the location where you want to save the client certificate file. *RootCertificateName* refers to the self-signed root certificate that you generated. If you run the following example (changing the RootCertificateName to the name of your root certificate), the result will be a client certificate named "ClientCertificateName" in your Personal certificate store.
3. Type the following command:

    makecert.exe -n "CN=ClientCertificateName" -pe -sky exchange -m 96 -ss My -in "RootCertificateName" -is my -a sha1

4. All certificates are stored in your Personal certificate store on your computer. Check *certmgr* to verify. You can generate as many client certificates as needed based on this procedure. We recommend that you create unique client certificates for each computer that you want to connect to the virtual network.

### Export and install the client certificate

1. A client certificate must be installed on each computer that you want to connect to the virtual network. This means you will probably create multiple client certificates and then need to export them. To export the client certificates, use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**.
2. Export the *client certificate* with the private key. This will be a *.pfx* file. Make sure to record or remember the password (key) that you set for this certificate.
3. Copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file in order to install it. Enter the password when requested. Do not modify the installation location.

## Configure your VPN client

To connect to the virtual network, you'll also need to configure your VPN client. The client requires both a client certificate and the proper VPN client configuration in order to connect.

### Create the VPN client configuration package

1. In the Azure portal, on the **Dashboard** page for your virtual network, navigate to the quick glance menu in the right corner and click the VPN package that pertains to the client that you want to connect to your virtual network.
The following client operating systems are supported:
 - Windows 7 (32-bit and 64-bit)
 - Windows Server 2008 R2 (64-bit only)
 - Windows 8 (32-bit and 64-bit)
 - Windows 8.1 (32-bit and 64-bit)
 - Windows Server 2012 (64-bit only)
 - Windows Server 2012 R2 (64-bit only)

1. Select the download package that corresponds to the client operating system on which it will be installed:
 - For 32-bit clients, select **Download the 32-bit Client VPN Package**.
 - For 64-bit clients, select **Download the 64-bit Client VPN Package**.
1. It will take a few minutes to create your client package. Once the package has been completed, you will be able to download the file. The *.exe* file that you download can be safely stored on your local computer.
1. After you generate and download the VPN client package from the Azure portal, you can install the client package on the client computer from which you want to connect to your virtual network. If you plan to install the VPN client package to multiple client computers, make sure that they each also have a client certificate installed. The VPN client package contains configuration information to configure the VPN client software built into Windows. The package does not install additional software.

### Install the VPN configuration package on the client and start the connection

1. Copy the configuration file locally to the computer that you want to connect to your virtual network and double click the .exe file. Once the package has installed, you can start the VPN connection.
Note that the configuration package is not signed by Microsoft. You may want to sign the package using your organization's signing service, or sign it yourself using [SignTool](https://msdn.microsoft.com/library/windows/desktop/aa387764(v=vs.85).aspx). It's OK to use the package without signing. However, if the package isn't signed, a warning will appear when you install the package.
2. On the client computer, navigate to VPN connections and locate the VPN connection that you just created. It will be named the same name as your virtual network. Click **Connect**.
3. A pop up message will appear which is used to create a self-signed cert for the Gateway endpoint. Click **Continue** to use elevated privileges.
4. On the **Connection** status page, click **Connect** in order to start the connection.
5. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.
6. You are now connected to your virtual network and have full access to any service and virtual machine hosted in your virtual network.

### Verify the VPN connection

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the point-to-site connectivity address range that you specified when you created your VNet. The results should be something similar to this:

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


You can learn more about virtual network cross-premises connectivity in this article: [About virtual network secure cross-premises connectivity](vpn-gateway-cross-premises-options.md).

If you want to configure a site-to-site VPN connection, see [Configure a virtual network with a site-to-site VPN gateway connection](vpn-gateway-site-to-site-create.md).

You can add virtual machines to your virtual network. See [How to create a custom virtual machine](../virtual-machines/virtual-machines-create-custom.md).
