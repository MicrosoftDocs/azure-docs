<properties 
   pageTitle="Configure a Point-to-Site VPN Gateway connection to an Azure Virtual Network | Microsoft Azure"
   description="Securely connect to your Azure Virtual Network by creating a Point-to-Site VPN connection. This configuration is helpful when needing a cross-premises connection from a remote location with out using a VPN device and can be used with hybrid network configurations. This article contains PowerShell instructions for VNets that were created using the Resource Manager deployment model."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/12/2015"
   ms.author="cherylmc" />

# Configure a Point-to-Site connection to a virtual network using PowerShell

> [AZURE.SELECTOR]
- [PowerShell - Resource Manager](vpn-gateway-howto-point-to-site-rm-ps.md)
- [PowerShell - classic](vpn-gateway-point-to-site-create.md)

A Point-to-Site configuration allows you to create a secure connection to your virtual network from a client computer, individually. A VPN connection is established by starting the connection from the client computer. Point-to-Site is an excellent solution when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. Point-to-Site connections do not require a VPN device or a public-facing IP address to work. For more information about Point-to-Site connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) and [About cross-premises connections](vpn-gateway-cross-premises-options.md).

This article applies to VNets and VPN Gateways created using the **Azure Resource Manager** deployment model. If you want to configure a Point-to-Site connection for a VNet that was created using Service Management (also known as the classic deployment model), see [this article](vpn-gateway-point-to-site-create.md). 

[AZURE.INCLUDE [vpn-gateway-classic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

## About this configuration

In this scenario, you will create a virtual network with a Point-to-Site connection. A Point-to-Site connection is composed of the following items: VNet with a gateway, an uploaded root certificate .cer file, a client certificate, and the VPN configuration on the client side. 

We'll use the following values for this configuration:

- Name = **TestVNet**, using address spaces 192.168.0.0./16 and 10.254.0.0/16. Notice that you can use more than one address space for a VNet.
- Subnet name = **FrontEnd**, using 192.168.1.0/24
- Subnet name = **BackEnd**, using 10.254.1.0/24
- Subnet name = **GatewaySubnet**, using 192.168.200.0/24 The Subnet name *GatewaySubnet* is mandatory for the gateway to work. 
- VPN client address pool: 172.16.201.0/24. VPN clients that connect to the VNet using this Point-to-Site connection will receive an IP address from this pool.
- Subscription = Verify you have the correct subscription if you have more than one.
- Resource Group = **TestRG**
- Location = **East US**
- DNS Server = IP address of the DNS server that you want to use for name resolution.
- GW Name = **GW**
- Public IP name = **GWIP**
- VpnType = **RouteBased**


## Before beginning

Verify that you have an Azure subscription, and have installed the Azure PowerShell cmdlets needed for this configuration (1.0.2 or later). If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).
	
**About installing PowerShell cmdlet modules**

	[AZURE.INCLUDE [vpn-gateway-ps-rm-howto](../../includes/vpn-gateway-ps-rm-howto-include.md)]

## Configure a Point-to-Site connection for Azure

1. In the PowerShell console, log in to your Azure account. This cmdlet prompts you for the login credentials for your Azure Account. After logging in, it downloads your account settings so they are available to Azure PowerShell.

		Login-AzureRmAccount 

2. Get a list of your Azure subscriptions.

		Get-AzureRmSubscription

3. Specify the subscription that you want to use. 

		Select-AzureRmSubscription -SubscriptionName "Name of subscription"

4. In this configuration, the following PowerShell variables are declared with the values that you want to use. The declared values will be used in the sample scripts. Declare the values that you want to use. Use the sample below, substituting the values for your own when necessary. 

		$VNetName  = "TestVNet"
		$FESubName = "FrontEnd"
		$BESubName = "Backend"
		$GWSubName = "GatewaySubnet"
		$VNetPrefix1 = "192.168.0.0/16"
		$VNetPrefix2 = "10.254.0.0/16"
		$FESubPrefix = "192.168.1.0/24"
		$BESubPrefix = "10.254.1.0/24"
		$GWSubPrefix = "192.168.200.0/26"
		$VPNClientAddressPool = "172.16.201.0/24"
		$RG = "TestRG"
		$Location = "East US"
		$DNS = "8.8.8.8"
		$GWName = "GW"
		$GWIPName = "GWIP"
		$GWIPconfName = "gwipconf"
    	$P2SRootCertName = "ARMP2SRootCert.cer"

5. Create a new resource group.

		New-AzureRmResourceGroup -Name $RG -Location $Location

6. Create the subnet configurations for the virtual network, naming them *FrontEnd*, *BackEnd*, and *GatewaySubnet*. Note that these prefixes must be part of the VNet address space declared above.

		$fesub = New-AzureRmVirtualNetworkSubnetConfig -Name $FESubName -AddressPrefix $FESubPrefix
		$besub = New-AzureRmVirtualNetworkSubnetConfig -Name $BESubName -AddressPrefix $BESubPrefix
		$gwsub = New-AzureRmVirtualNetworkSubnetConfig -Name $GWSubName -AddressPrefix $GWSubPrefix

7. Create the virtual network. Note that the DNS server specified should be a DNS server that can resolve the names for the resources you are connecting to. For this example, we used a public IP address, but you will want to put in your own values here.

		New-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $RG -Location $Location -AddressPrefix $VNetPrefix1,$VNetPrefix2 -Subnet $fesub, $besub, $gwsub -DnsServer $DNS

8. Specify the variables for the virtual network you just created.

		$vnet   = Get-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $RG
		$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet

9. Request a dynamically assigned public IP address. This IP address is necessary for the gateway to work properly. You will later connect the gateway to the gateway IP configuration.
		
		$pip = New-AzureRmPublicIpAddress -Name $GWIPName -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic
		$ipconf = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddress $pip
		
10. Upload a root certificate .cer file to Azure. You can use a root certificate from your enterprise certificate environment, or you can use a self-signed root certificate. You can upload up to 20 root certificates. For instructions to create a self-signed root certificate using *makecert*, see the section at the end of this article. Note that the .cer file should not contain the private key of the root certificate. 
	
	Below is a sample of what this looks like. The challenging part of uploading the public certificate data is that you must copy and paste the entire string with no spaces. Otherwise, the upload will not work. You'll need to use your own certificate .cer file for this step. Don't try to copy and paste the sample from below.

		$MyP2SRootCertPubKeyBase64 = "MIIDUzCCAj+gAwIBAgIQRggGmrpGj4pCblTanQRNUjAJBgUrDgMCHQUAMDQxEjAQBgNVBAoTCU1pY3Jvc29mdDEeMBwGA1UEAxMVQnJrIExpdGUgVGVzdCBSb290IENBMB4XDTEzMDExOTAwMjQxOFoXDTIxMDExOTAwMjQxN1owNDESMBAGA1UEChMJTWljcm9zb2Z0MR4wHAYDVQQDExVCcmsgTGl0ZSBUZXN0IFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7SmE+iPULK0Rs7mQBO/6a6B6/G9BaMxHgDGzAmSG0Qsyt5e08aqgFnPdkMl3zRJw3lPKGha/JCvHRNrO8UpeAfc4IXWaqxx2iBipHjwmHPHh7+VB8lU0EJcUe7WBAI2n/sgfCwc+xKtuyRVlOhT6qw/nAi8e5don/iHPU6q7GCcnqoqtceQ/pJ8m66cvAnxwJlBFOTninhb2VjtvOfMQ07zPP+ZuYDPxvX5v3nd6yDa98yW4dZPuiGO2s6zJAfOPT2BrtyvLekItnSgAw3U5C0bOb+8XVKaDZQXbGEtOw6NZvD4L2yLd47nGkN2QXloiPLGyetrj3Z2pZYcrZBo8hAgMBAAGjaTBnMGUGA1UdAQReMFyAEOncRAPNcvJDoe4WP/gH2U+hNjA0MRIwEAYDVQQKEwlNaWNyb3NvZnQxHjAcBgNVBAMTFUJyayBMaXRlIFRlc3QgUm9vdCBDQYIQRggGmrpGj4pCblTanQRNUjAJBgUrDgMCHQUAA4IBAQCGyHhMdygS0g2tEUtRT4KFM+qqUY5HBpbIXNAav1a1dmXpHQCziuuxxzu3iq4XwnWUF1OabdDE2cpxNDOWxSsIxfEBf9ifaoz/O1ToJ0K757q2Rm2NWqQ7bNN8ArhvkNWa95S9gk9ZHZLUcjqanf0F8taJCYgzcbUSp+VBe9DcN89sJpYvfiBiAsMVqGPc/fHJgTScK+8QYrTRMubtFmXHbzBSO/KTAP5rBTxse88EGjK5F8wcedvge2Ksk6XjL3sZ19+Oj8KTQ72wihN900p1WQldHrrnbixSpmHBXbHr9U0NQigrJp5NphfuU5j81C8ixvfUdwyLmTv7rNA7GTAD"
		$p2srootcert = New-AzureRmVpnClientRootCertificate -Name $P2SRootCertName -PublicCertData $MyP2SRootCertPubKeyBase64

11. Create the virtual network gateway for your VNet. The GatewayType must be Vpn and the VpnType must be RouteBased.

		New-AzureRmVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -IpConfigurations $ipconf -GatewayType Vpn -VpnType RouteBased -EnableBgp $false -GatewaySku Standard -VpnClientAddressPool $VPNClientAddressPool -VpnClientRootCertificates $p2srootcert

## Client configuration

Each client that connects to Azure by using Point-to-Site must have two things: the VPN client must be configured to connect, and the client must have a client certificate installed. VPN client configuration packages are available for Windows clients. Please see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) for more information. 

1. Download the VPN client configuration package. In this step, use the following example to download the client configuration package.

		Get-AzureRmVpnClientPackage -ResourceGroupName $RG -VirtualNetworkGatewayName $GWName -ProcessorArchitecture Amd64

	The PowerShell cmdlet will return a URL link. Copy-paste the link that is returned to a web browser to download the package to your computer. Below is an example of what the returned URL will look like.

    	"https://mdsbrketwprodsn1prod.blob.core.windows.net/cmakexe/4a431aa7-b5c2-45d9-97a0-859940069d3f/amd64/4a431aa7-b5c2-45d9-97a0-859940069d3f.exe?sv=2014-02-14&sr=b&sig=jSNCNQ9aUKkCiEokdo%2BqvfjAfyhSXGnRG0vYAv4efg0%3D&st=2016-01-08T07%3A10%3A08Z&se=2016-01-08T08%3A10%3A08Z&sp=r&fileExtension=.exe"
	
2. Generate and install the client certificates (*.pfx) created from the root certificate on the client computers. You can use any method of installing that you are comfortable with. If you are using a self-signed root certificate and are unfamiliar with how to do this, you can refer to the instructions located at the end of this article.  

3. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you just created. It will be named the same name as your virtual network. Click **Connect**. A pop up message may appear that refers to using the certificate. If this happens, click **Continue** to use elevated privileges. 

4. On the **Connection** status page, click **Connect** in order to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.

5. Your connection should now be established. You can verify your connection by using the procedure below.

## Verify your connection

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.

2. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site VPN Client Address Pool that you specified in your configuration. The results should be something similar to this:
    
		PPP adapter VNetEast:
			Connection-specific DNS Suffix .:
			Description.....................: VNetEast
			Physical Address................:
			DHCP Enabled....................: No
			Autoconfiguration Enabled.......: Yes
			IPv4 Address....................: 172.16.201.3(Preferred)
			Subnet Mask.....................: 255.255.255.255
			Default Gateway.................:
			NetBIOS over Tcpip..............: Enabled

## To create a self-signed root certificate by using makecert

Makecert is one way of creating a self-signed root certificate. The steps below will walk you through the procedure.

1. From a computer running Windows 10, download and install the Windows 10 SDK from [this link](https://dev.windows.com/en-us/downloads/windows-10-sdk).

2. After installation, you can find the makecert.exe utility under this path: C:\Program Files (x86)\Windows Kits\10\bin\<arch>. 
		
	Example: 
	
		C:\Program Files (x86)\Windows Kits\10\bin\x64\makecert.exe

3. Next, create and install a root certificate in the Personal certificate store on your computer. The example below creates a corresponding *.cer* file that you'll later upload. Run the following command, as administrator, where *RootCertificateName* is the name that you want to use for the certificate. 

	Note: If you run the following example with no changes, the result will be a root certificate and the corresponding file *RootCertificateName.cer*. You can find the .cer file in the directory from which you ran the command. The certificate will be located in your Certificates - Current User\Personal\Certificates.

    	makecert -sky exchange -r -n "CN=RootCertificateName" -pe -a sha1 -len 2048 -ss My "RootCertificateName.cer"

	>[AZURE.NOTE] Because you have created a root certificate from which client certificates will be generated, you may want to export this certificate along with its private key and save it to a safe location where it may be recovered.

## To generate a client certificate from a self-signed root certificate

The steps below will help you generate a client certificate from a self-signed root certificate, and then export and install the client certificate. 

### Generate a client certificate

The steps below will walk you through one way to generate a client certificate from a self-signed root certificate. You may generate multiple client certificates from the same root certificate. Each client certificate can then be exported and installed on the client computer. 

1. On the same computer that you used to create the self-signed root certificate, open a command prompt as administrator.
2. Change the directory to the location to which you want to save the client certificate file. *RootCertificateName* refers to the self-signed root certificate that you generated. If you run the following example (changing the RootCertificateName to the name of your root certificate), the result will be a client certificate named "ClientCertificateName" in your Personal certificate store.
3. Type the following command:

    	makecert.exe -n "CN=ClientCertificateName" -pe -sky exchange -m 96 -ss My -in "RootCertificateName" -is my -a sha1

4. All certificates are stored in your Certificates - Current User\Personal\Certificates store on your computer. You can generate as many client certificates as needed based on this procedure.

### Export and install a client certificate

Installing a client certificate on each computer that you want to connect to the virtual network is a mandatory step. The steps below will walk you through installing the client certificate manually.

1. To export a client certificate, use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**. This will open the Certificate Export Wizard.
2. In the Wizard, click **Next**, then select **Yes, export the private key**, and then click **Next**.
3. On the **Export File Format** page, you can leave the defaults selected. Then click **Next**.  
4. On the **Security** page, you must protect the private key. If you select to use a password, make sure to record or remember the password that you set for this certificate.Then click **Next**.
5. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then click **Next**.
6. Click **Finish** to export the certificate.	
3. Locate and copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file to install. Leave the **Store Location** as **Current User**, then click **Next**.
4. On the **File** to import page, don't make any changes. Click **Next**.
5. On the **Private key protection** page, input the password for the certificate if you used one, or verify that the security principal that is installing the certificate is correct, then click **Next**.
6. On the **Certificate Store** page, leave the default location, and then click **Next**.
7. Click **Finish**. On the **Security Warning** for the certificate installation, click **Yes**. The certificate is now successfully imported.

## Next steps

You can add a virtual machine to your virtual network. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-tutorial.md) for steps.


