---
title: Configure a Point-to-Site VPN gateway connection to virtual network using the Resource Manager deployment model | Microsoft Docs
description: Securely connect to your Azure Virtual Network by creating a Point-to-Site VPN gateway connection.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/17/2016
ms.author: cherylmc

---
# Configure a Point-to-Site connection to a VNet using PowerShell
> [!div class="op_single_selector"]
> * [Resource Manager - Azure Portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Classic - Azure Portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
> 
> 

A Point-to-Site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. A P2S connection is useful when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. 

Point-to-Site connections do not require a VPN device or a public-facing IP address to work. A VPN connection is established by starting the connection from the client computer. For more information about Point-to-Site connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) and [Planning and Design](vpn-gateway-plan-design.md). 

This article walks you through creating a VNet with a Point-to-Site connection in the Resource Manager deployment model using PowerShell.

### Deployment models and methods for P2S connections
[!INCLUDE [deployment models](../../includes/vpn-gateway-deployment-models-include.md)]

The following table shows the two deployment models and available deployment methods for P2S configurations. When an article with configuration steps is available, we link directly to it from this table.

[!INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-table-point-to-site-include.md)]

## Basic workflow
![Point-to-Site-diagram](./media/vpn-gateway-howto-point-to-site-rm-ps/p2srm.png "point-to-site")

In this scenario, you will create a virtual network with a Point-to-Site connection. The instructions will also help you generate certificates, which are required for this configuration. A P2S connection is composed of the following items: A VNet with a VPN gateway, a root certificate .cer file (public key), a client certificate, and the VPN configuration on the client. 

We use the following values for this configuration. We set the variables in section [1](#declare) of the article. You can either use the steps as a walk-through and use the values without changing them, or change them to reflect your environment. 

### <a name="example"></a>Example values
* **Name: VNet1**
* **Address space: 192.168.0.0/16** and **10.254.0.0/16**<br>For this example, we use more than one address space to illustrate that this configuration will work with multiple address spaces. However, multiple address spaces are not required for this configuration.
* **Subnet name: FrontEnd**
  * **Subnet address range: 192.168.1.0/24**
* **Subnet name: BackEnd**
  * **Subnet address range: 10.254.1.0/24**
* **Subnet name: GatewaySubnet**<br>The Subnet name *GatewaySubnet* is mandatory for the VPN gateway to work.
  * **Subnet address range: 192.168.200.0/24** 
* **VPN client address pool: 172.16.201.0/24**<br>VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from the VPN client address pool.
* **Subscription:** If you have more than one subscription, verify that you are using the correct one.
* **Resource Group: TestRG**
* **Location: East US**
* **DNS Server: IP address** of the DNS server that you want to use for name resolution.
* **GW Name: Vnet1GW**
* **Public IP name: VNet1GWPIP**
* **VpnType: RouteBased**

## Before beginning
* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* Install the latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets. When working with PowerShell for this configuration, make sure that you are running as administrator. 

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
        $GWName = "VNet1GW"
        $GWIPName = "VNet1GWPIP"
        $GWIPconfName = "gwipconf"

## <a name="ConfigureVNet"></a>Part 2 - Configure a VNet
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

## <a name="Certificates"></a>Part 3 - Certificates
Certificates are used by Azure to authenticate VPN clients for Point-to-Site VPNs. You export public certificate data (not the private key) as a Base-64 encoded X.509 .cer file from either a root certificate generated by an enterprise certificate solution, or a self-signed root certificate. You then import the public certificate data from the root certificate to Azure. Additionally, you need to generate a client certificate from the root certificate for clients. Each client that wants to connect to the virtual network using a P2S connection must have a client certificate installed that was generated from the root certificate.

### <a name="cer"></a>1. Obtain the .cer file for the root certificate
You will need to get the public certificate data for the root certificate that you want to use.

* If you are using an enterprise certificate system, obtain the .cer file for the root certificate that you want to use. 
* If you are not using an enterprise certificate solution, you need to generate a self-signed root certificate. For Windows 10 steps, you can refer to [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md).

1. To obtain a .cer file from a certificate, open **certmgr.msc** and locate the root certificate. Right-click the self-signed root certificate, click **all tasks**, and then click **export**. This opens the **Certificate Export Wizard**.
2. In the Wizard, click **Next**, select **No, do not export the private key**, and then click **Next**.
3. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).** Then, click **Next**. 
4. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then click **Next**.
5. Click **Finish** to export the certificate.

### <a name="generate"></a>2. Generate the client certificate
Next, generate the client certificates. You can either generate a unique certificate for each client that will connect, or you can use the same certificate on multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate if needed. Otherwise, if everyone is using the same client certificate and you find that you need to revoke the certificate for one client, you will need to generate and install new certificates for all of the clients that use the certificate to authenticate. The client certificates are installed on each client computer later in this exercise.

* If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the NetBIOS 'DOMAIN\username' format. 
* If you are using a self-signed certificate, see [Working with self-signed root certificates for Point-to-Site configurations](vpn-gateway-certificates-point-to-site.md) to generate a client certificate.

### <a name="exportclientcert"></a>3. Export the client certificate
A client certificate is required for authentication. After generating the client certificate, export it. The client certificate you export will be installed later on each client computer.

1. To export a client certificate, you can use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**.
2. Export the client certificate with the private key. This is a *.pfx* file. Make sure to record or remember the password (key) that you set for this certificate.

### <a name="upload"></a>4. Upload the root certificate .cer file
Declare the variable for your certificate name, replacing the value with your own:

        $P2SRootCertName = "Mycertificatename.cer"

Add the public certificate data for the root certificate to Azure. You can upload files for up to 20 root certificates. You do not upload the private key for the root certificate to Azure. Once the .cer file is uploaded, Azure uses it to authenticate clients that connect to the virtual network. 

Replace the file path with your own, and then run the cmdlets.

        $filePathForCert = "C:\cert\Mycertificatename.cer"
        $cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2($filePathForCert)
        $CertBase64 = [system.convert]::ToBase64String($cert.RawData)
        $p2srootcert = New-AzureRmVpnClientRootCertificate -Name $P2SRootCertName -PublicCertData $CertBase64

## <a name="creategateway"></a>Part 4 - Create the VPN gateway
Configure and create the virtual network gateway for your VNet. The *-GatewayType* must be **Vpn** and the *-VpnType* must be **RouteBased**. This can take up to 45 minutes to complete.

        New-AzureRmVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG `
        -Location $Location -IpConfigurations $ipconf -GatewayType Vpn `
        -VpnType RouteBased -EnableBgp $false -GatewaySku Standard `
        -VpnClientAddressPool $VPNClientAddressPool -VpnClientRootCertificates $p2srootcert

## <a name="clientconfig"></a>Part 5 - Download the VPN client configuration package
Clients connecting to Azure using P2S must have both a client certificate and a VPN client configuration package installed. VPN client configuration packages are available for Windows clients. The VPN client package contains information to configure the VPN client software that is built into Windows and is specific to the VPN that you want to connect to. The package does not install additional software. See the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#point-to-site-connections) for more information.

1. After the gateway has been created, you can download the client configuration package. This example downloads the package for 64-bit clients. If you want to download the 32-bit client, replace 'Amd64' with 'x86'. You can also download the VPN client by using the Azure portal.
   
        Get-AzureRmVpnClientPackage -ResourceGroupName $RG `
        -VirtualNetworkGatewayName $GWName -ProcessorArchitecture Amd64
2. The PowerShell cmdlet returns a URL link. This is an example of what the returned URL looks like:
   
        "https://mdsbrketwprodsn1prod.blob.core.windows.net/cmakexe/4a431aa7-b5c2-45d9-97a0-859940069d3f/amd64/4a431aa7-b5c2-45d9-97a0-859940069d3f.exe?sv=2014-02-14&sr=b&sig=jSNCNQ9aUKkCiEokdo%2BqvfjAfyhSXGnRG0vYAv4efg0%3D&st=2016-01-08T07%3A10%3A08Z&se=2016-01-08T08%3A10%3A08Z&sp=r&fileExtension=.exe"
3. Copy and paste the link that is returned to a web browser to download the package. Then install the package on the client computer. If you get a SmartScreen popup, click **More info**, then **Run anyway** in order to install the package.
4. On the client computer, navigate to **Network Settings** and click **VPN**. You will see the connection listed. It will show the name of the virtual network that it will connect to and looks similar to this example: 
   
    ![VPN client](./media/vpn-gateway-howto-point-to-site-rm-ps/vpn.png "VPN client")

## <a name="clientcertificate"></a>Part 6 - Install the client certificate
Each client computer must have a client certificate in order to authenticate. When installing the client certificate, you will need the password that was created when the client certificate was exported.

1. Copy the .pfx file to the client computer.
2. Double-click the .pfx file to install it. Do not modify the installation location.

## <a name="connect"></a>Part 7 - Connect to Azure
1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It is named the same name as your virtual network. Click **Connect**. A pop-up message may appear that refers to using the certificate. If this happens, click **Continue** to use elevated privileges. 
2. On the **Connection** status page, click **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.
   
    ![VPN client connection](./media/vpn-gateway-howto-point-to-site-rm-ps/clientconnect.png "VPN client connection")
3. Your connection should now be established.
   
    ![Connection established](./media/vpn-gateway-howto-point-to-site-rm-ps/connected.png "Connection established")

## <a name="verify"></a>Part 8 - Verify your connection
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

## <a name="addremovecert"></a>To add or remove a trusted root certificate
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
   
        Add-AzureRmVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName2 -VirtualNetworkGatewayname "VNet1GW" -ResourceGroupName "TestRG" -PublicCertData $MyP2SCertPubKeyBase64_2
4. You can verify that the new certificate was added correctly by using the following cmdlet.
   
        Get-AzureRmVpnClientRootCertificate -ResourceGroupName "TestRG" `
        -VirtualNetworkGatewayName "VNet1GW"

### To remove a trusted root certificate
You can remove trusted root certificate from Azure. When you remove a trusted certificate, the client certificates that were generated from the root certificate will no longer be able to connect to Azure via Point-to-Site. If you want clients to connect, they need to install a new client certificate that is generated from a certificate that is trusted in Azure.

1. To remove a trusted root certificate, modify the following sample:
   
    Declare the variables.
   
        $P2SRootCertName2 = "ARMP2SRootCert2.cer"
        $MyP2SCertPubKeyBase64_2 = "MIIC/zCCAeugAwIBAgIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAMBgxFjAUBgNVBAMTDU15UDJTUm9vdENlcnQwHhcNMTUxMjE5MDI1MTIxWhcNMzkxMjMxMjM1OTU5WjAYMRYwFAYDVQQDEw1NeVAyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyjIXoWy8xE/GF1OSIvUaA0bxBjZ1PJfcXkMWsHPzvhWc2esOKrVQtgFgDz4ggAnOUFEkFaszjiHdnXv3mjzE2SpmAVIZPf2/yPWqkoHwkmrp6BpOvNVOpKxaGPOuK8+dql1xcL0eCkt69g4lxy0FGRFkBcSIgVTViS9wjuuS7LPo5+OXgyFkAY3pSDiMzQCkRGNFgw5WGMHRDAiruDQF1ciLNojAQCsDdLnI3pDYsvRW73HZEhmOqRRnJQe6VekvBYKLvnKaxUTKhFIYwuymHBB96nMFdRUKCZIiWRIy8Hc8+sQEsAML2EItAjQv4+fqgYiFdSWqnQCPf/7IZbotgQIDAQABo00wSzBJBgNVHQEEQjBAgBAkuVrWvFsCJAdK5pb/eoCNoRowGDEWMBQGA1UEAxMNTXlQMlNSb290Q2VydIIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAA4IBAQA223veAZEIar9N12ubNH2+HwZASNzDVNqspkPKD97TXfKHlPlIcS43TaYkTz38eVrwI6E0yDk4jAuPaKnPuPYFRj9w540SvY6PdOUwDoEqpIcAVp+b4VYwxPL6oyEQ8wnOYuoAK1hhh20lCbo8h9mMy9ofU+RP6HJ7lTqupLfXdID/XevI8tW6Dm+C/wCeV3EmIlO9KUoblD/e24zlo3YzOtbyXwTIh34T0fO/zQvUuBqZMcIPfM1cDvqcqiEFLWvWKoAnxbzckye2uk1gHO52d8AVL3mGiX8wBJkjc/pMdxrEvvCzJkltBmqxTM6XjDJALuVh16qFlqgTWCIcb7ju"
2. Remove the certificate.
   
        Remove-AzureRmVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName2 -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -PublicCertData $MyP2SCertPubKeyBase64_2
3. Use the following cmdlet to verify that the certificate was removed successfully. 
   
        Get-AzureRmVpnClientRootCertificate -ResourceGroupName "TestRG" `
        -VirtualNetworkGatewayName "VNet1GW"

## <a name="revoke"></a>To manage the list of revoked client certificates
You can revoke client certificates. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. If you remove a root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. If you want to revoke a particular client certificate, not the root, you can do so. That way the other certificates that were generated from the root certificate will still be valid.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

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

1. Remove the thumbprint from the list of revoked client certificate thumbprint.
   
       Remove-AzureRmVpnClientRevokedCertificate -VpnClientRevokedCertificateName $RevokedClientCert1 `
       -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -Thumbprint $RevokedThumbprint1
2. Check if the thumbprint is removed from the revoked list.
   
        Get-AzureRmVpnClientRevokedCertificate -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG

## Next steps
You can add a virtual machine to your virtual network. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md) for steps.

