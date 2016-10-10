<properties 
   pageTitle="Configure a Point-to-Site VPN gateway connection to virtual network using the Resource Manager deployment model | Microsoft Azure"
   description="Securely connect to your Azure Virtual Network by creating a Point-to-Site VPN gateway connection."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="10/06/2016"
   ms.author="cherylmc" />

# Configure a Point-to-Site connection to a VNet using PowerShell

> [AZURE.SELECTOR]
- [Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
- [Classic - Azure Portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
- [Classic - Classic Portal](vpn-gateway-point-to-site-create.md)

A Point-to-Site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. A P2S connection is useful when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. 

This article walks you through creating a VNet with a Point-to-Site connection in the **Resource Manager deployment model**. The steps require PowerShell. Currently, you cannot create this solution end-to-end in the Azure portal.

Point-to-Site connections do not require a VPN device or a public-facing IP address to work. A VPN connection is established by starting the connection from the client computer. For more information about Point-to-Site connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) and [Planning and Design](vpn-gateway-plan-design.md).



**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

**Deployment models and tools for Point-to-Site connections**

[AZURE.INCLUDE [vpn-gateway-table-point-to-site](../../includes/vpn-gateway-table-point-to-site-include.md)] 

![Point-to-Site-diagram](./media/vpn-gateway-howto-point-to-site-rm-ps/p2srm.png "point-to-site")


## About this configuration

In this scenario, you create a virtual network with a Point-to-Site connection. The instructions will also help you generate certificates, which are required for this configuration. A P2S connection is composed of the following items: A VNet with a VPN gateway, a root certificate .cer file (public key), a client certificate, and the VPN configuration on the client. 

We use the following values for this configuration. We set the variables in section [1](#declare) of the article. You can either use the steps as a walk-through and use the values without changing them, or change them to reflect your environment. 

- Name: **VNet1**, using address spaces **192.168.0.0/16** and **10.254.0.0/16**. Notice that you can use more than one address space for a VNet.
- Subnet name: **FrontEnd**, using **192.168.1.0/24**
- Subnet name: **BackEnd**, using **10.254.1.0/24**
- Subnet name: **GatewaySubnet**, using **192.168.200.0/24**. The Subnet name *GatewaySubnet* is mandatory for the gateway to work. 
- VPN client address pool: **172.16.201.0/24**. VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from this pool.
- Subscription: Verify that you have the correct subscription if you have more than one.
- Resource Group: **TestRG**
- Location: **East US**
- DNS Server: **IP address** of the DNS server that you want to use for name resolution.
- GW Name: **GW**
- Public IP name: **GWIP**
- VpnType: **RouteBased**


## Before beginning

- Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
	
- Install the Azure Resource Manager PowerShell cmdlets (1.0.2 or later). See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets. When working with PowerShell for this configuration, make sure that you are running as administrator. 

## <a name="declare"></a>Part 1 - Log in and set variables

In this section, you log in and declare the values used for this configuration. The declared values are used in the sample scripts. Change the values to reflect your own environment. Or, you can use the declared values and go through the steps as an exercise.

1. In the PowerShell console, log in to your Azure account. This cmdlet prompts you for the login credentials for your Azure Account. After logging in, it downloads your account settings so that they are available to Azure PowerShell.

		Login-AzureRmAccount 

2. Get a list of your Azure subscriptions.

		Get-AzureRmSubscription

3. Specify the subscription that you want to use. 

		Select-AzureRmSubscription -SubscriptionName "Name of subscription"

4. Declare the variables that you want to use. Use the following sample, substituting the values for your own when necessary.

		$VNetName  = "VNet1"
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


## Part 2 - Configure a VNet 


1. Create a resource group.

		New-AzureRmResourceGroup -Name $RG -Location $Location

2. Create the subnet configurations for the virtual network, naming them *FrontEnd*, *BackEnd*, and *GatewaySubnet*. These prefixes must be part of the VNet address space that you declared.

		$fesub = New-AzureRmVirtualNetworkSubnetConfig -Name $FESubName -AddressPrefix $FESubPrefix
		$besub = New-AzureRmVirtualNetworkSubnetConfig -Name $BESubName -AddressPrefix $BESubPrefix
		$gwsub = New-AzureRmVirtualNetworkSubnetConfig -Name $GWSubName -AddressPrefix $GWSubPrefix

3. Create the virtual network. The DNS server specified should be a DNS server that can resolve the names for the resources you are connecting to. For this example, we used a public IP address. Be sure to use your own values.
	
		New-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $RG -Location $Location -AddressPrefix $VNetPrefix1,$VNetPrefix2 -Subnet $fesub, $besub, $gwsub -DnsServer $DNS

4. Specify the variables for the virtual network you created.

		$vnet = Get-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $RG
		$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet

5. Request a dynamically assigned public IP address. This IP address is necessary for the gateway to work properly. You later connect the gateway to the gateway IP configuration.
		
		$pip = New-AzureRmPublicIpAddress -Name $GWIPName -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic
		$ipconf = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddress $pip

## Part 3 - Add trusted certificates

Azure authenticates clients that want to connect via P2S by using certificates. You import the .cer file (the public key) for a root certificate to Azure. When you add a Base64-encoded X.509 (.cer) file to Azure, you are telling Azure to trust the root certificate that the file represents.

If you are using an enterprise solution, you can use your existing certificate chain. If you aren't using an enterprise CA solution, you can create a self-signed root cert. One method for creating a self-signed cert is makecert. For instructions to create a self-signed root certificate using *makecert*, see [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md).

No matter how you obtain the cert, you upload the .cer file for the certificate to Azure, and also generate client certificates to install on the clients that want to connect. You don't install the self-signed certificate directly on the client. You can generate client certificates later, in the [Client Configuration](#cc) section of this article.
		
You can add up to 20 trusted certificates to Azure. To get the public key, export the certificate as a Base64-encoded X.509 (.cer) file. One way to export to cer. is to open **certmger.msc**, locate the certificate in the Personal/Certificates. Right click and export without the private key as "Base-64 encoded X.509(.CER)". Make note of the file path where you exported to .cer file. This is a sample of obtaining the Base64 string representation of your certificate. 

Add the trusted certificate to Azure. You need to use your own .cer file path for this step. Pay particular attention to the $P2SRootCertName = "ARMP2SRootCert.cer" variable that you set in Part 1 of this article. If the name of your certificate is different, adjust the variable accordingly.
    
		$filePathForCert = "pasteYourCerFilePathHere"
		$cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2($filePathForCert)
		$CertBase64 = [system.convert]::ToBase64String($cert.RawData)
		$p2srootcert = New-AzureRmVpnClientRootCertificate -Name $P2SRootCertName -PublicCertData $CertBase64

## Part 4 - Create the VPN gateway

Configure and create the virtual network gateway for your VNet. The *-GatewayType* must be **Vpn** and the *-VpnType* must be **RouteBased**. This can take up to 45 minutes to complete.

		New-AzureRmVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG `
		-Location $Location -IpConfigurations $ipconf -GatewayType Vpn `
		-VpnType RouteBased -EnableBgp $false -GatewaySku Standard `
		-VpnClientAddressPool $VPNClientAddressPool -VpnClientRootCertificates $p2srootcert

## Part 5 - Download the VPN client configuration package

Clients connecting to Azure using P2S must have both a client certificate and a VPN client configuration package installed. VPN client configuration packages are available for Windows clients. The VPN client package contains information to configure the VPN client software that is built into Windows and is specific to the VPN that you want to connect to. The package does not install additional software. See the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) for more information.

1. After the gateway has been created, use the following example to download the client configuration package:

		Get-AzureRmVpnClientPackage -ResourceGroupName $RG `
		-VirtualNetworkGatewayName $GWName -ProcessorArchitecture Amd64

2. The PowerShell cmdlet returns a URL link. This is an example of what the returned URL looks like:

    	"https://mdsbrketwprodsn1prod.blob.core.windows.net/cmakexe/4a431aa7-b5c2-45d9-97a0-859940069d3f/amd64/4a431aa7-b5c2-45d9-97a0-859940069d3f.exe?sv=2014-02-14&sr=b&sig=jSNCNQ9aUKkCiEokdo%2BqvfjAfyhSXGnRG0vYAv4efg0%3D&st=2016-01-08T07%3A10%3A08Z&se=2016-01-08T08%3A10%3A08Z&sp=r&fileExtension=.exe"

3. Copy and paste the link that is returned to a web browser to download the package. Then install the package on the client computer.

4. On the client computer, navigate to **Network Settings** and click **VPN**. You will see the connection listed. It will show the name of the virtual network that it will connect to and looks similar to this example: 

	![VPN client](./media/vpn-gateway-howto-point-to-site-rm-ps/vpn.png "VPN client")

## <a name="cc"></a>Part 6 - Generate the client certificate

Next, generate the client certificates. You can either generate a unique certificate for each client that will connect, or you can use the same certificate on multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate if needed. Otherwise, if everyone is using the same client certificate and you find that you need to revoke the certificate for one client, you will need to generate and install new certificates for all of the clients that use the certificate to authenticate.

- If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the NetBIOS 'DOMAIN\username' format. 

- If you are using a self-signed certificate, see [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md) to generate a client certificate.

## Part 7 - Install the client certificate

Install a client certificate on each computer that you want to connect to the virtual network. A client certificate is required for authentication. You can automate installing the client certificate, or you can install manually. The following steps walk you through exporting and installing the client certificate manually.

1. To export a client certificate, you can use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**.
2. Export the client certificate with the private key. This is a *.pfx* file. Make sure to record or remember the password (key) that you set for this certificate.
3. Copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file to install it. Enter the password when requested. Do not modify the installation location.


## Part 8 - Connect to Azure

1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It is named the same name as your virtual network. Click **Connect**. A pop-up message may appear that refers to using the certificate. If this happens, click **Continue** to use elevated privileges. 

2. On the **Connection** status page, click **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.

	![VPN client 2](./media/vpn-gateway-howto-point-to-site-rm-ps/clientconnect.png "VPN client connection")

3. Your connection should now be established.

	![VPN client 3](./media/vpn-gateway-howto-point-to-site-rm-ps/connected.png "VPN client connection 2")

## Part 9 - Verify your connection

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

## To add or remove a trusted root certificate

Certificates are used to authenticate VPN clients for Point-to-Site VPNs. The following steps walk you through adding and removing root certificates. When you add a Base64-encoded X.509 (.cer) file to Azure, you are telling Azure to trust the root certificate that the file represents. 

You can add or remove trusted root certificates by using PowerShell, or in the Azure portal. If you want to do this using the Azure portal, go to your **virtual network gateway > settings > Point-to-site configuration > Root certificates**. The following steps walk you through these tasks using PowerShell. 

### Add a trusted root certificate

You can add up to 20 trusted root certificate .cer files to Azure. Follow the steps below to add a root certificate.

1. Create and prepare the new root certificate that you will add to Azure. Export the public key as a Base-64 encoded X.509 (.CER) and open it with a text editor. Then copy only the section shown below. 
 
	Copy the values, as shown in the following example:

	![certificate](./media/vpn-gateway-howto-point-to-site-rm-ps/copycert.png "certificate")
	
2. Specify the certificate name and key information as a variable. Replace the information with your own, as shown in the following example:

		$P2SRootCertName2 = "ARMP2SRootCert2.cer"
		$MyP2SCertPubKeyBase64_2 = "MIIC/zCCAeugAwIBAgIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAMBgxFjAUBgNVBAMTDU15UDJTUm9vdENlcnQwHhcNMTUxMjE5MDI1MTIxWhcNMzkxMjMxMjM1OTU5WjAYMRYwFAYDVQQDEw1NeVAyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyjIXoWy8xE/GF1OSIvUaA0bxBjZ1PJfcXkMWsHPzvhWc2esOKrVQtgFgDz4ggAnOUFEkFaszjiHdnXv3mjzE2SpmAVIZPf2/yPWqkoHwkmrp6BpOvNVOpKxaGPOuK8+dql1xcL0eCkt69g4lxy0FGRFkBcSIgVTViS9wjuuS7LPo5+OXgyFkAY3pSDiMzQCkRGNFgw5WGMHRDAiruDQF1ciLNojAQCsDdLnI3pDYsvRW73HZEhmOqRRnJQe6VekvBYKLvnKaxUTKhFIYwuymHBB96nMFdRUKCZIiWRIy8Hc8+sQEsAML2EItAjQv4+fqgYiFdSWqnQCPf/7IZbotgQIDAQABo00wSzBJBgNVHQEEQjBAgBAkuVrWvFsCJAdK5pb/eoCNoRowGDEWMBQGA1UEAxMNTXlQMlNSb290Q2VydIIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAA4IBAQA223veAZEIar9N12ubNH2+HwZASNzDVNqspkPKD97TXfKHlPlIcS43TaYkTz38eVrwI6E0yDk4jAuPaKnPuPYFRj9w540SvY6PdOUwDoEqpIcAVp+b4VYwxPL6oyEQ8wnOYuoAK1hhh20lCbo8h9mMy9ofU+RP6HJ7lTqupLfXdID/XevI8tW6Dm+C/wCeV3EmIlO9KUoblD/e24zlo3YzOtbyXwTIh34T0fO/zQvUuBqZMcIPfM1cDvqcqiEFLWvWKoAnxbzckye2uk1gHO52d8AVL3mGiX8wBJkjc/pMdxrEvvCzJkltBmqxTM6XjDJALuVh16qFlqgTWCIcb7ju"


3. Add the new root certificate. You can only add one certificate at a time.

		Add-AzureRmVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName2 -VirtualNetworkGatewayname "GW" -ResourceGroupName "TestRG" -PublicCertData $MyP2SCertPubKeyBase64_2


4. You can verify that the new certificate was added correctly by using the following cmdlet.

		Get-AzureRmVpnClientRootCertificate -ResourceGroupName "TestRG" `
		-VirtualNetworkGatewayName "GW"

### To remove a trusted root certificate

You can remove trusted root certificate from Azure. When you remove a trusted certificate, the client certificates that were generated from the root certificate will no longer be able to connect to Azure via Point-to-Site. If you want clients to connect, they need to install a new client certificate that is generated from a certificate that is trusted in Azure.

1. To remove a trusted root certificate, modify the following sample:

	Declare the variables.

		$P2SRootCertName2 = "ARMP2SRootCert2.cer"
		$MyP2SCertPubKeyBase64_2 = "MIIC/zCCAeugAwIBAgIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAMBgxFjAUBgNVBAMTDU15UDJTUm9vdENlcnQwHhcNMTUxMjE5MDI1MTIxWhcNMzkxMjMxMjM1OTU5WjAYMRYwFAYDVQQDEw1NeVAyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyjIXoWy8xE/GF1OSIvUaA0bxBjZ1PJfcXkMWsHPzvhWc2esOKrVQtgFgDz4ggAnOUFEkFaszjiHdnXv3mjzE2SpmAVIZPf2/yPWqkoHwkmrp6BpOvNVOpKxaGPOuK8+dql1xcL0eCkt69g4lxy0FGRFkBcSIgVTViS9wjuuS7LPo5+OXgyFkAY3pSDiMzQCkRGNFgw5WGMHRDAiruDQF1ciLNojAQCsDdLnI3pDYsvRW73HZEhmOqRRnJQe6VekvBYKLvnKaxUTKhFIYwuymHBB96nMFdRUKCZIiWRIy8Hc8+sQEsAML2EItAjQv4+fqgYiFdSWqnQCPf/7IZbotgQIDAQABo00wSzBJBgNVHQEEQjBAgBAkuVrWvFsCJAdK5pb/eoCNoRowGDEWMBQGA1UEAxMNTXlQMlNSb290Q2VydIIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAA4IBAQA223veAZEIar9N12ubNH2+HwZASNzDVNqspkPKD97TXfKHlPlIcS43TaYkTz38eVrwI6E0yDk4jAuPaKnPuPYFRj9w540SvY6PdOUwDoEqpIcAVp+b4VYwxPL6oyEQ8wnOYuoAK1hhh20lCbo8h9mMy9ofU+RP6HJ7lTqupLfXdID/XevI8tW6Dm+C/wCeV3EmIlO9KUoblD/e24zlo3YzOtbyXwTIh34T0fO/zQvUuBqZMcIPfM1cDvqcqiEFLWvWKoAnxbzckye2uk1gHO52d8AVL3mGiX8wBJkjc/pMdxrEvvCzJkltBmqxTM6XjDJALuVh16qFlqgTWCIcb7ju"

2. Remove the certificate

		Remove-AzureRmVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName2 -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -PublicCertData $MyP2SCertPubKeyBase64_2
 
3. Use the following cmdlet to verify that the certificate was removed successfully. 

		Get-AzureRmVpnClientRootCertificate -ResourceGroupName "TestRG" `
		-VirtualNetworkGatewayName "GW"

## To manage the list of revoked client certificates

You can revoke client certificates. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. If you remove a root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. If you want to revoke a particular client certificate, not the root, you can do so. That way the other certificates that were generated from the root certificate will still be valid. The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

### Revoke a client certificate

1. Get the thumbprint of the client certificate to revoke.

		$RevokedClientCert1 = "ClientCert1"
		$RevokedThumbprint1 = "‎ef2af033d0686820f5a3c74804d167b88b69982f"

2. Add the thumbprint to the list of revoked thumbprint.

		Add-AzureRmVpnClientRevokedCertificate -VpnClientRevokedCertificateName $RevokedClientCert1 `
		-VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -Thumbprint $RevokedThumbprint1

3. Verify that the thumbprint was added to the certificate revocation list. You must add one thumbprint at a time.

		Get-AzureRmVpnClientRevokedCertificate -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG

### Reinstate a client certificate

You can reinstate a client certificate by removing the thumbprint from the list of revoked client certificates.

1.  Remove the thumbprint from the list of revoked client certificate thumbprint.

		Remove-AzureRmVpnClientRevokedCertificate -VpnClientRevokedCertificateName $RevokedClientCert1 `
		-VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -Thumbprint $RevokedThumbprint1

2. Check if the thumbprint is removed from the revoked list.

		Get-AzureRmVpnClientRevokedCertificate -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG

## Next steps

You can add a virtual machine to your virtual network. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md) for steps.


