---
title: 'Connect a computer to an Azure virtual network using Point-to-Site: PowerShell | Microsoft Docs'
description: Securely connect a computer to your Azure Virtual Network by creating a Point-to-Site VPN gateway connection.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 3eddadf6-2e96-48c4-87c6-52a146faeec6
ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/10/2017
ms.author: cherylmc

---
# Configure a Point-to-Site connection to a VNet using PowerShell
> [!div class="op_single_selector"]
> * [Resource Manager - Azure Portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Classic - Azure Portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
> 
> 

A Point-to-Site (P2S) configuration lets you create a secure connection from an individual client computer to a virtual network. P2S is a VPN connection over SSTP (Secure Socket Tunneling Protocol). Point-to-Site connections are useful when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a virtual network. P2S connections do not require a VPN device or a public-facing IP address. You establish the VPN connection from the client computer.

This article walks you through creating a VNet with a Point-to-Site connection in the Resource Manager deployment model using PowerShell. For more information about Point-to-Site connections, see the [Point-to-Site FAQ](#faq) at the end of this article.

### Deployment models and methods for P2S connections
[!INCLUDE [deployment models](../../includes/vpn-gateway-deployment-models-include.md)]

The following table shows the two deployment models and available deployment methods for P2S configurations. When an article with configuration steps is available, we link directly to it from this table.

[!INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-table-point-to-site-include.md)]

## Basic workflow
![Connect a computer to an Azure VNet - Point-to-Site connection diagram](./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png)

In this scenario, you create a virtual network with a Point-to-Site connection. The instructions also help you generate certificates, which are required for this configuration. A P2S connection is composed of the following items: A VNet with a VPN gateway, a root certificate .cer file (public key), a client certificate, and the VPN configuration on the client. 

We use the following values for this configuration. We set the variables in section [1](#declare) of the article. You can either use the steps as a walk-through and use the values without changing them, or change them to reflect your environment. 

### <a name="example"></a>Example values
* **Name: VNet1**
* **Address space: 192.168.0.0/16** and **10.254.0.0/16**<br>For this example, we use more than one address space to illustrate that this configuration works with multiple address spaces. However, multiple address spaces are not required for this configuration.
* **Subnet name: FrontEnd**
  * **Subnet address range: 192.168.1.0/24**
* **Subnet name: BackEnd**
  * **Subnet address range: 10.254.1.0/24**
* **Subnet name: GatewaySubnet**<br>The Subnet name *GatewaySubnet* is mandatory for the VPN gateway to work.
  * **GatewaySubnet address range: 192.168.200.0/24** 
* **VPN client address pool: 172.16.201.0/24**<br>VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from the VPN client address pool.
* **Subscription:** If you have more than one subscription, verify that you are using the correct one.
* **Resource Group: TestRG**
* **Location: East US**
* **DNS Server: IP address** of the DNS server that you want to use for name resolution.
* **GW Name: Vnet1GW**
* **Public IP name: VNet1GWPIP**
* **VpnType: RouteBased**

## Before beginning
* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* Install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information about installing PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azure/overview). 

## <a name="declare"></a>Part 1 - Log in and set variables
In this section, you log in and declare the values used for this configuration. The declared values are used in the sample scripts. Change the values to reflect your own environment. Or, you can use the declared values and go through the steps as an exercise.

1. Open your PowerShell console with elevated privileges, and log in to your Azure account. This cmdlet prompts you for the login credentials. After logging in, it downloads your account settings so that they are available to Azure PowerShell.

  ```powershell
  Login-AzureRmAccount
  ```
2. Get a list of your Azure subscriptions.

  ```powershell  
  Get-AzureRmSubscription
  ```
3. Specify the subscription that you want to use.

  ```powershell
  Select-AzureRmSubscription -SubscriptionName "Name of subscription"
  ```
4. Declare the variables that you want to use. Use the following sample, substituting the values for your own when necessary.

  ```powershell
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
  ```

## <a name="ConfigureVNet"></a>Part 2 - Configure a VNet
1. Create a resource group.

  ```powershell
  New-AzureRmResourceGroup -Name $RG -Location $Location
  ```
2. Create the subnet configurations for the virtual network, naming them *FrontEnd*, *BackEnd*, and *GatewaySubnet*. These prefixes must be part of the VNet address space that you declared.

  ```powershell
  $fesub = New-AzureRmVirtualNetworkSubnetConfig -Name $FESubName -AddressPrefix $FESubPrefix
  $besub = New-AzureRmVirtualNetworkSubnetConfig -Name $BESubName -AddressPrefix $BESubPrefix
  $gwsub = New-AzureRmVirtualNetworkSubnetConfig -Name $GWSubName -AddressPrefix $GWSubPrefix
  ```
3. Create the virtual network. The DNS server specified should be a DNS server that can resolve the names for the resources you are connecting to. For this example, we used a public IP address. Be sure to use your own values.

  ```powershell
  New-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $RG -Location $Location -AddressPrefix $VNetPrefix1,$VNetPrefix2 -Subnet $fesub, $besub, $gwsub -DnsServer $DNS
  ```
4. Specify the variables for the virtual network you created.

  ```powershell
  $vnet = Get-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $RG
  $subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
  ```
5. Request a dynamically assigned public IP address. This IP address is necessary for the gateway to work properly. You later connect the gateway to the gateway IP configuration.

  ```powershell
  $pip = New-AzureRmPublicIpAddress -Name $GWIPName -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic
  $ipconf = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddress $pip
  ```


## <a name="Certificates"></a>Part 3 - Certificates

Certificates are used by Azure to authenticate VPN clients for Point-to-Site VPNs. After creating the root certificate, you export the public certificate data (not the private key) as a Base-64 encoded X.509 .cer file. You then upload the public certificate data from the root certificate to Azure.

Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. The client certificate is generated from the root certificate and installed on each client computer. If a valid client certificate is not installed and the client tries to connect to the VNet, authentication fails.

### <a name="cer"></a>Step 1 - Obtain the .cer file for the root certificate

#### Enterprise certificate
 
If you are using an enterprise solution, you can use your existing certificate chain. Obtain the .cer file for the root certificate that you want to use.

#### Self-signed root certificate

If you are not using an enterprise certificate solution, you need to create a self-signed root certificate. To create a self-signed root certificate that contains the necessary fields for P2S authentication, you can use PowerShell. [Create a self-signed root certificate for Point-to-Site connections using PowerShell](vpn-gateway-certificates-point-to-site.md) walks you through the steps to create a self-signed root certificate.

> [!NOTE]
> Previously, makecert was the recommended method to create self-signed root certificates and generate client certificates for Point-to-Site connections. You can now use PowerShell to create these certificates. One benefit of using PowerShell is the ability to create SHA-2 certificates. See [Create a self-signed root certificate for Point-to-Site connections using PowerShell](vpn-gateway-certificates-point-to-site.md) for the required values.
>
>

#### To export the public key for a self-signed root certificate

Point-to-Site connections require the public key (.cer) to be uploaded to Azure. The following steps help you export the .cer file for your self-signed root certificate.

1. To obtain a .cer file from the certificate, open **Manage user certificates**.
2. Locate the 'P2SRootCert' self-signed root certificate in 'Certificates - Current User\Personal\Certificates', and right-click. Click **All Tasks**, and then click **Export** to open the **Certificate Export Wizard**.
3. In the Wizard, click **Next**. Select **No, do not export the private key**, and then click **Next**.
4. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).**, then click **Next**. 
5. On the **File to Export** page, Browse to 'C:', create a subdirectory called 'cert' and select it. Name the certificate file 'P2SRootCert.cer', then click **Save**. 
6. Click **Next**, then **Finish** to export the certificate. **The export was successful** appears. Click **OK** to close the wizard.

### <a name="generate"></a>Step 2 - Generate a client certificate
You can either generate a unique certificate for each client, or you can use the same certificate on multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate. Otherwise, if everyone is using the same client certificate and you need to revoke it, you have to generate and install new certificates for all the clients that use that certificate to authenticate.

#### Enterprise certificate
- If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the 'domain name\username' format.
- Make sure the client certificate is based on the 'User' certificate template that has 'Client Authentication' as the first item in the use list, rather than Smart Card Logon, etc. You can check the certificate by double-clicking the client certificate and viewing **Details > Enhanced Key Usage**.

#### Self-signed root certificate 
If you are using a self-signed root certificate, see [Generate a client certificate using PowerShell](vpn-gateway-certificates-point-to-site.md#clientcert) for steps to generate a client certificate that is compatible with Point-to-Site connections.


### <a name="exportclientcert"></a>Step 3 - Export the client certificate

If you generate a client certificate from a self-signed root certificate using the [PowerShell](vpn-gateway-certificates-point-to-site.md#clientcert) instructions, it's automatically installed on the computer that you used to generate it. If you want to install a client certificate on another client computer, you need to export it.
 
1. To export a client certificate, open **Manage user certificates**. Right-click the client certificate that you want to export, click **all tasks**, and then click **export** to open the **Certificate Export Wizard**.
2. In the Wizard, click **Next**, then select **Yes, export the private key**, and then click **Next**.
3. On the **Export File Format** page, leave the defaults selected. Make sure **Include all certificates in the certification path if possible** is selected to also export the required root certificate information. Then, click **Next**.
4. On the **Security** page, you must protect the private key. If you select to use a password, make sure to record or remember the password that you set for this certificate. Then, click **Next**.
5. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.
6. Click **Finish** to export the certificate.

### <a name="upload"></a>Step 4 - Upload the root certificate .cer file

After the gateway has been created, you can upload the .cer file for a trusted root certificate to Azure. You can upload files for up to 20 root certificates. You do not upload the private key for the root certificate to Azure. Once the .cer file is uploaded, Azure uses it to authenticate clients that connect to the virtual network.

1. Declare the variable for your certificate name, replacing the value with your own:

  ```powershell
  $P2SRootCertName = "Mycertificatename.cer"
  ```
2. Replace the file path with your own, and then run the cmdlets.

  ```powershell
  $filePathForCert = "C:\cert\Mycertificatename.cer"
  $cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2($filePathForCert)
  $CertBase64 = [system.convert]::ToBase64String($cert.RawData)
  $p2srootcert = New-AzureRmVpnClientRootCertificate -Name $P2SRootCertName -PublicCertData $CertBase64
  ```


## <a name="creategateway"></a>Part 4 - Create the VPN gateway
Configure and create the virtual network gateway for your VNet. The *-GatewayType* must be **Vpn** and the *-VpnType* must be **RouteBased**. A VPN gateway can take up to 45 minutes to complete.

```powershell
New-AzureRmVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG `
-Location $Location -IpConfigurations $ipconf -GatewayType Vpn `
-VpnType RouteBased -EnableBgp $false -GatewaySku Standard `
-VpnClientAddressPool $VPNClientAddressPool -VpnClientRootCertificates $p2srootcert
```


## <a name="clientconfig"></a>Part 5 - Download the VPN client configuration package
To connect to a VNet using a Point-to-Site VPN, each client must install a VPN client configuration package. The package does not install a VPN client. It configures the native Windows VPN client with the settings necessary to connect to the virtual network. For the list of client operating systems that are supported, see the [Point-to-Site connections FAQ](#faq) at the end of this article.

1. After the gateway has been created, you can generate and download the client configuration package. This example downloads the package for 64-bit clients. If you want to download the 32-bit client, replace 'Amd64' with 'x86'. You can also download the VPN client by using the Azure portal.

  ```powershell
  Get-AzureRmVpnClientPackage -ResourceGroupName $RG `
  -VirtualNetworkGatewayName $GWName -ProcessorArchitecture Amd64
  ```
2. Copy and paste the link that is returned to a web browser to download the package, taking care to remove the """ surrounding the link. 
3. Download and install the package on the client computer. If you see a SmartScreen popup, click **More info**, then **Run anyway**. You can also save the package to install on other client computers.
4. On the client computer, navigate to **Network Settings** and click **VPN**. The VPN connection shows the name of the virtual network that it connects to.



## <a name="clientcertificate"></a>Part 6 - Install an exported client certificate

If you want to create a P2S connection from a client computer other than the one you used to generate the client certificates, you need to install a client certificate. When installing a client certificate, you need the password that was created when the client certificate was exported.

1. Locate and copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file to install. Leave the **Store Location** as **Current User**, and then click **Next**.
2. On the **File** to import page, don't make any changes. Click **Next**.
3. On the **Private key protection** page, input the password for the certificate, or verify that the security principal is correct, and then click **Next**.
4. On the **Certificate Store** page, leave the default location, and then click **Next**.
5. Click **Finish**. On the **Security Warning** for the certificate installation, click **Yes**. You can feel comfortable clicking 'Yes' because you generated the certificate. The certificate is now successfully imported.

## <a name="connect"></a>Part 7 - Connect to Azure
1. To connect to your VNet, on the client computer, navigate to VPN connections and locate the VPN connection that you created. It is named the same name as your virtual network. Click **Connect**. A pop-up message may appear that refers to using the certificate. Click **Continue** to use elevated privileges. 
2. On the **Connection** status page, click **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then click **OK**.
   
    ![VPN client connects to Azure](./media/vpn-gateway-howto-point-to-site-rm-ps/clientconnect.png)
3. Your connection is established.
   
    ![Connection established](./media/vpn-gateway-howto-point-to-site-rm-ps/connected.png)

If you are having trouble connecting, check the following things:

- Open **Manage user certificates** and navigate to **Trusted Root Certification Authorities\Certificates**. Verify that the root certificate is listed. The root certificate must be present in order for authentication to work. When you export a client certificate .pfx using the default value 'Include all certificates in the certification path if possible', the root certificate information is also exported. When you install the client certificate, the root certificate is then also installed on the client computer. 

- If you are using a certificate that was issued using an Enterprise CA solution and are having trouble authenticating, check the authentication order on the client certificate. You can check the authentication list order by double-clicking the client certificate, and going to **Details > Enhanced Key Usage**. Make sure the list shows 'Client Authentication' as the first item. If not, you need to issue a client certificate based on the User template that has Client Authentication as the first item in the list.  


## <a name="verify"></a>Part 8 - Verify your connection
1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the Point-to-Site VPN Client Address Pool that you specified in your configuration. The results are similar to this example:
   
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


## <a name="connectVM"></a>Connect to a virtual machine

1. After connecting to your VNet, you can connect to a VM over your P2S connection. To connect to the VM, you need the private IP address of the virtual machine. The following example helps you get the private IP address with [Get-AzureRmNetworkInterface](/powershell/module/azurerm.network/get-azurermnetworkinterface). The results return a list of VMs and corresponding private IP addresses in all your Resource Groups. 

  ```powershell   
  $vms = get-azurermvm
  $nics = get-azurermnetworkinterface | where VirtualMachine -NE $null #skip Nics with no VM
  
  foreach($nic in $nics)
  {
    $vm = $vms | where-object -Property Id -EQ $nic.VirtualMachine.id
    $prv =  $nic.IpConfigurations | select-object -ExpandProperty PrivateIpAddress
    $alloc =  $nic.IpConfigurations | select-object -ExpandProperty PrivateIpAllocationMethod
    Write-Output "$($vm.Name) : $prv , $alloc"
  }
  ```
2. Use the following command to create a remote desktop session with the virtual machine. Replace the IP address with the private IP address associated with the VM that you want to connect to. When prompted, enter the credentials used when creating the virtual machine. 

  ```powershell   
  mstsc /v:192.168.1.4
  ```

If you are having trouble connecting to a virtual machine over P2S, use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you are connecting. If the IP address is within the address range of the VNet that you are connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network. If your network address spaces don't overlap and you still can't connect to your VM, see [Troubleshoot Remote Desktop connections to a VM](../virtual-machines/windows/troubleshoot-rdp-connection.md).

## <a name="addremovecert"></a>Add or remove a trusted root certificate

You can add and remove trusted root certificates from Azure. When you remove a trusted certificate, the client certificates that were generated from the root certificate can't connect to Azure via Point-to-Site. If you want clients to connect, you need to install a new client certificate that is generated from a certificate that is trusted in Azure.

### To add a trusted root certificate
You can add up to 20 trusted root certificate .cer files to Azure. The following steps help you add a root certificate:

1. Create and prepare the new root certificate to add to Azure. Export the public key as a Base-64 encoded X.509 (.CER) and open it with a text editor. Copy the values, as shown in the following example:
   
  ![certificate](./media/vpn-gateway-howto-point-to-site-rm-ps/copycert.png)

	> [!NOTE]
	> When copying the certificate data, make sure that you copy the text as one continuous line without carriage returns or line feeds. You may need to modify your view in the text editor to 'Show Symbol/Show all characters' to see the carriage returns and line feeds.
  >
  >

2. Specify the certificate name and key information as a variable. Replace the information with your own, as shown in the following example:

  ```powershell
  $P2SRootCertName2 = "ARMP2SRootCert2.cer"
  $MyP2SCertPubKeyBase64_2 = "MIIC/zCCAeugAwIBAgIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAMBgxFjAUBgNVBAMTDU15UDJTUm9vdENlcnQwHhcNMTUxMjE5MDI1MTIxWhcNMzkxMjMxMjM1OTU5WjAYMRYwFAYDVQQDEw1NeVAyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyjIXoWy8xE/GF1OSIvUaA0bxBjZ1PJfcXkMWsHPzvhWc2esOKrVQtgFgDz4ggAnOUFEkFaszjiHdnXv3mjzE2SpmAVIZPf2/yPWqkoHwkmrp6BpOvNVOpKxaGPOuK8+dql1xcL0eCkt69g4lxy0FGRFkBcSIgVTViS9wjuuS7LPo5+OXgyFkAY3pSDiMzQCkRGNFgw5WGMHRDAiruDQF1ciLNojAQCsDdLnI3pDYsvRW73HZEhmOqRRnJQe6VekvBYKLvnKaxUTKhFIYwuymHBB96nMFdRUKCZIiWRIy8Hc8+sQEsAML2EItAjQv4+fqgYiFdSWqnQCPf/7IZbotgQIDAQABo00wSzBJBgNVHQEEQjBAgBAkuVrWvFsCJAdK5pb/eoCNoRowGDEWMBQGA1UEAxMNTXlQMlNSb290Q2VydIIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAA4IBAQA223veAZEIar9N12ubNH2+HwZASNzDVNqspkPKD97TXfKHlPlIcS43TaYkTz38eVrwI6E0yDk4jAuPaKnPuPYFRj9w540SvY6PdOUwDoEqpIcAVp+b4VYwxPL6oyEQ8wnOYuoAK1hhh20lCbo8h9mMy9ofU+RP6HJ7lTqupLfXdID/XevI8tW6Dm+C/wCeV3EmIlO9KUoblD/e24zlo3YzOtbyXwTIh34T0fO/zQvUuBqZMcIPfM1cDvqcqiEFLWvWKoAnxbzckye2uk1gHO52d8AVL3mGiX8wBJkjc/pMdxrEvvCzJkltBmqxTM6XjDJALuVh16qFlqgTWCIcb7ju"
  ```
3. Add the new root certificate. You can only add one certificate at a time.

  ```powershell
  Add-AzureRmVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName2 -VirtualNetworkGatewayname "VNet1GW" -ResourceGroupName "TestRG" -PublicCertData $MyP2SCertPubKeyBase64_2
  ```
4. You can verify that the new certificate was added correctly by using the following example:

  ```powershell
  Get-AzureRmVpnClientRootCertificate -ResourceGroupName "TestRG" `
  -VirtualNetworkGatewayName "VNet1GW"
  ```


### To remove a trusted root certificate


1. Declare the variables.

  ```powershell
  $GWName = "Name_of_virtual_network_gateway"
  $RG = "Name_of_resource_group"
  $P2SRootCertName2 = "ARMP2SRootCert2.cer"
  $MyP2SCertPubKeyBase64_2 = "MIIC/zCCAeugAwIBAgIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAMBgxFjAUBgNVBAMTDU15UDJTUm9vdENlcnQwHhcNMTUxMjE5MDI1MTIxWhcNMzkxMjMxMjM1OTU5WjAYMRYwFAYDVQQDEw1NeVAyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyjIXoWy8xE/GF1OSIvUaA0bxBjZ1PJfcXkMWsHPzvhWc2esOKrVQtgFgDz4ggAnOUFEkFaszjiHdnXv3mjzE2SpmAVIZPf2/yPWqkoHwkmrp6BpOvNVOpKxaGPOuK8+dql1xcL0eCkt69g4lxy0FGRFkBcSIgVTViS9wjuuS7LPo5+OXgyFkAY3pSDiMzQCkRGNFgw5WGMHRDAiruDQF1ciLNojAQCsDdLnI3pDYsvRW73HZEhmOqRRnJQe6VekvBYKLvnKaxUTKhFIYwuymHBB96nMFdRUKCZIiWRIy8Hc8+sQEsAML2EItAjQv4+fqgYiFdSWqnQCPf/7IZbotgQIDAQABo00wSzBJBgNVHQEEQjBAgBAkuVrWvFsCJAdK5pb/eoCNoRowGDEWMBQGA1UEAxMNTXlQMlNSb290Q2VydIIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAA4IBAQA223veAZEIar9N12ubNH2+HwZASNzDVNqspkPKD97TXfKHlPlIcS43TaYkTz38eVrwI6E0yDk4jAuPaKnPuPYFRj9w540SvY6PdOUwDoEqpIcAVp+b4VYwxPL6oyEQ8wnOYuoAK1hhh20lCbo8h9mMy9ofU+RP6HJ7lTqupLfXdID/XevI8tW6Dm+C/wCeV3EmIlO9KUoblD/e24zlo3YzOtbyXwTIh34T0fO/zQvUuBqZMcIPfM1cDvqcqiEFLWvWKoAnxbzckye2uk1gHO52d8AVL3mGiX8wBJkjc/pMdxrEvvCzJkltBmqxTM6XjDJALuVh16qFlqgTWCIcb7ju"
  ```
2. Remove the certificate.

  ```powershell
  Remove-AzureRmVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName2 -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -PublicCertData $MyP2SCertPubKeyBase64_2
  ```
3. Use the following example to verify that the certificate was removed successfully.

  ```powershell
  Get-AzureRmVpnClientRootCertificate -ResourceGroupName "TestRG" `
  -VirtualNetworkGatewayName "VNet1GW"
  ```

## <a name="revoke"></a>Revoke a client certificate
You can revoke client certificates. The certificate revocation list allows you to selectively deny Point-to-Site connectivity based on individual client certificates. This differs from removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. Revoking a client certificate, rather than the root certificate, allows the other certificates that were generated from the root certificate to continue to be used for authentication.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

### To revoke a client certificate

1. Retrieve the client certificate thumbprint. For more information, see [How to retrieve the Thumbprint of a Certificate](https://msdn.microsoft.com/library/ms734695.aspx).
2. Copy the information to a text editor and remove all spaces so that it is a continuous string. This is declared as a variable in the next step.
3. Declare the variables. Make sure to declare the thumbprint you retrieved in the previous step.

  ```powershell
  $RevokedClientCert1 = "NameofCertificate"
  $RevokedThumbprint1 = "‎51ab1edd8da4cfed77e20061c5eb6d2ef2f778c7"
  $GWName = "Name_of_virtual_network_gateway"
  $RG = "Name_of_resource_group"
  ```
4. Add the thumbprint to the list of revoked certificates. You see "Succeeded" when the thumbprint has been added.

  ```powershell
  Add-AzureRmVpnClientRevokedCertificate -VpnClientRevokedCertificateName $RevokedClientCert1 `
  -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG `
  -Thumbprint $RevokedThumbprint1
  ```
5. Verify that the thumbprint was added to the certificate revocation list.

  ```powershell
  Get-AzureRmVpnClientRevokedCertificate -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG
  ```
6. After the thumbprint has been added, the certificate can no longer be used to connect. Clients that try to connect using this certificate receive a message saying that the certificate is no longer valid.

### To reinstate a client certificate
You can reinstate a client certificate by removing the thumbprint from the list of revoked client certificates.

1. Declare the variables. Make sure you declare the correct thumbprint for the certificate that you want to reinstate.

  ```powershell
  $RevokedClientCert1 = "NameofCertificate"
  $RevokedThumbprint1 = "‎51ab1edd8da4cfed77e20061c5eb6d2ef2f778c7"
  $GWName = "Name_of_virtual_network_gateway"
  $RG = "Name_of_resource_group"
  ```
2. Remove the certificate thumbprint from the certificate revocation list.

  ```powershell
  Remove-AzureRmVpnClientRevokedCertificate -VpnClientRevokedCertificateName $RevokedClientCert1 `
  -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -Thumbprint $RevokedThumbprint1
  ```
3. Check if the thumbprint is removed from the revoked list.

  ```powershell
  Get-AzureRmVpnClientRevokedCertificate -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG
  ```

## <a name="faq"></a>Point-to-Site FAQ

[!INCLUDE [Point-to-Site FAQ](../../includes/vpn-gateway-point-to-site-faq-include.md)]

## Next steps
Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/#pivot=services&panel=Compute). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-machines/linux/azure-vm-network-overview.md).
