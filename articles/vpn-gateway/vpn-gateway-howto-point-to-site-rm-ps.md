---
title: 'Connect to a VNet from a computer - P2S VPN and native Azure certificate authentication: PowerShell'
description: Connect Windows and Mac OS X clients securely to Azure virtual network using P2S and self-signed or CA issued certificates. This article uses PowerShell.
titleSuffix: Azure VPN Gateway
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/29/2020
ms.author: cherylmc

---
# Configure a Point-to-Site VPN connection to a VNet using native Azure certificate authentication: PowerShell

This article helps you securely connect individual clients running Windows, Linux, or Mac OS X to an Azure VNet. Point-to-site VPN connections are useful when you want to connect to your VNet from a remote location, such when you are telecommuting from home or a conference. You can also use P2S instead of a Site-to-Site VPN when you have only a few clients that need to connect to a VNet. Point-to-site connections do not require a VPN device or a public-facing IP address. P2S creates the VPN connection over either SSTP (Secure Socket Tunneling Protocol), or IKEv2.

:::image type="content" source="./media/vpn-gateway-how-to-point-to-site-rm-ps/point-to-site-diagram.png" alt-text="Connect from a computer to an Azure VNet - point-to-site connection diagram":::

For more information about point-to-site VPN, see [About point-to-site VPN](point-to-site-about.md). To create this configuration using the Azure portal, see [Configure a point-to-site VPN using the Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md).

## Architecture

Point-to-site native Azure certificate authentication connections use the following items, which you configure in this exercise:

* A RouteBased VPN gateway.
* The public key (.cer file) for a root certificate, which is uploaded to Azure. Once the certificate is uploaded, it is considered a trusted certificate and is used for authentication.
* A client certificate that is generated from the root certificate. The client certificate installed on each client computer that will connect to the VNet. This certificate is used for client authentication.
* A VPN client configuration. The VPN client configuration files contain the necessary information for the client to connect to the VNet. The files configure the existing VPN client that is native to the operating system. Each client that connects must be configured using the settings in the configuration files.

## Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Azure PowerShell

>[!IMPORTANT]
> Many of the steps in this article can use the Azure Cloud Shell. However, you can't use Cloud Shell to generate certificates. Additionally, to upload the root certificate public key, you must either use Azure PowerShell locally, or the Azure portal.
>

[!INCLUDE [powershell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>1. Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## <a name="declare"></a>2. Declare variables

We use variables for this article so that you can easily change the values to apply to your own environment without having to change the examples themselves. Declare the variables that you want to use. You can use the following sample, substituting the values for your own when necessary. If you close your PowerShell/Cloud Shell session at any point during the exercise, just copy and paste the values again to re-declare the variables.

```azurepowershell-interactive
$VNetName  = "VNet1"
$FESubName = "FrontEnd"
$GWSubName = "GatewaySubnet"
$VNetPrefix = "10.1.0.0/16"
$FESubPrefix = "10.1.0.0/24"
$GWSubPrefix = "10.1.255.0/27"
$VPNClientAddressPool = "172.16.201.0/24"
$RG = "TestRG1"
$Location = "EastUS"
$GWName = "VNet1GW"
$GWIPName = "VNet1GWpip"
$GWIPconfName = "gwipconf"
$DNS = "10.2.1.4"
```

## <a name="ConfigureVNet"></a>3. Configure a VNet

1. Create a resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Name $RG -Location $Location
   ```

1. Create the subnet configurations for the virtual network, naming them *FrontEnd* and *GatewaySubnet*. These prefixes must be part of the VNet address space that you declared.

   ```azurepowershell-interactive
   $fesub = New-AzVirtualNetworkSubnetConfig -Name $FESubName -AddressPrefix $FESubPrefix
   $gwsub = New-AzVirtualNetworkSubnetConfig -Name $GWSubName -AddressPrefix $GWSubPrefix
   ```

1. Create the virtual network.

   In this example, the -DnsServer server parameter is optional. Specifying a value does not create a new DNS server. The DNS server IP address that you specify should be a DNS server that can resolve the names for the resources you are connecting to from your VNet. This example uses a private IP address, but it is likely that this is not the IP address of your DNS server. Be sure to use your own values. The value you specify is used by the resources that you deploy to the VNet, not by the P2S connection or the VPN client.

   ```azurepowershell-interactive
       New-AzVirtualNetwork `
      -ResourceGroupName $RG `
      -Location $Location `
      -Name $VNetName `
      -AddressPrefix $VNetPrefix `
      -Subnet $fesub, $gwsub `
      -DnsServer $DNS
   ```

1. Specify the variables for the virtual network you created.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
   ```

1. A VPN gateway must have a Public IP address. You first request the IP address resource, and then refer to it when creating your virtual network gateway. The IP address is dynamically assigned to the resource when the VPN gateway is created. VPN Gateway currently only supports *Dynamic* Public IP address allocation. You cannot request a Static Public IP address assignment. However, it doesn't mean that the IP address changes after it has been assigned to your VPN gateway. The only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

   Request a dynamically assigned public IP address.

   ```azurepowershell-interactive
   $pip = New-AzPublicIpAddress -Name $GWIPName -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic
   $ipconf = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddress $pip
   ```

## <a name="creategateway"></a>4. Create the VPN gateway

In this step, you configure and create the virtual network gateway for your VNet.

* The -GatewayType must be **Vpn** and the -VpnType must be **RouteBased**.
* The -VpnClientProtocol is used to specify the types of tunnels that you would like to enable. The  tunnel options are **OpenVPN, SSTP**, and **IKEv2**. You can choose to enable one of them or any supported combination. If you want to enable multiple types, then specify the names separated by a comma. OpenVPN and SSTP cannot be enabled together. The strongSwan client on Android and Linux and the native IKEv2 VPN client on iOS and OSX will use only the IKEv2 tunnel to connect. Windows clients try IKEv2 first and if that doesn’t connect, they fall back to SSTP. You can use the OpenVPN client to connect to OpenVPN tunnel type.
* The virtual network gateway 'Basic' SKU does not support IKEv2, OpenVPN or RADIUS authentication. If you are planning on having Mac clients connect to your virtual network, do not use the Basic SKU.
* A VPN gateway can take up to 45 minutes to complete, depending on the [gateway sku](vpn-gateway-about-vpn-gateway-settings.md) you select. This example uses IKEv2.

1. Configure and create the virtual network gateway for your VNet. It takes approximately 45 minutes for the gateway to create.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG `
   -Location $Location -IpConfigurations $ipconf -GatewayType Vpn `
   -VpnType RouteBased -EnableBgp $false -GatewaySku VpnGw1 -VpnClientProtocol "IKEv2"
   ```

1. Once your gateway is created, you can view it using the following example. If you closed PowerShell or it timed out while your gateway was being created, you can [declare your variables](#declare) again.

   ```azurepowershell-interactive
   Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroup $RG
   ```

## <a name="addresspool"></a>5. Add the VPN client address pool

After the VPN gateway finishes creating, you can add the VPN client address pool. The VPN client address pool is the range from which the VPN clients receive an IP address when connecting. Use a private IP address range that does not overlap with the on-premises location that you connect from, or with the VNet that you want to connect to.

In this example, the VPN client address pool is declared as a [variable](#declare) in an earlier step.

```azurepowershell-interactive
$Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName $RG -Name $GWName
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway -VpnClientAddressPool $VPNClientAddressPool
```

## <a name="Certificates"></a>6. Generate certificates

>[!IMPORTANT]
> You can't generate certificates using Azure Cloud Shell. You must use one of the methods outlined in this section. If you want to use PowerShell, you must install it locally.
>

Certificates are used by Azure to authenticate VPN clients for point-to-site VPNs. You upload the public key information of the root certificate to Azure. The public key is then considered 'trusted'. Client certificates must be generated from the trusted root certificate, and then installed on each client computer in the Certificates-Current User/Personal certificate store. The certificate is used to authenticate the client when it initiates a connection to the VNet. 

If you use self-signed certificates, they must be created using specific parameters. You can create a self-signed certificate using the instructions for [PowerShell and Windows 10](vpn-gateway-certificates-point-to-site.md), or, if you don't have Windows 10, you can use [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md). It's important that you follow the steps in the instructions when generating self-signed root certificates and client certificates. Otherwise, the certificates you generate will not be compatible with P2S connections and you receive a connection error.

### <a name="cer"></a>Root certificate

1. [!INCLUDE [Root certificate](../../includes/vpn-gateway-p2s-rootcert-include.md)]

1. After you create the root certificate, [export](vpn-gateway-certificates-point-to-site.md#cer) the public certificate data (not the private key) as a Base64 encoded X.509 .cer file.

### <a name="generate"></a>Client certificate

1. [!INCLUDE [Generate a client certificate](../../includes/vpn-gateway-p2s-clientcert-include.md)]

1. After you create client certificate, [export](vpn-gateway-certificates-point-to-site.md#clientexport) it. The client certificate will be distributed to the client computers that will connect.

## <a name="upload"></a>7. Upload the root certificate public key information

Verify that your VPN gateway has finished creating. Once it has completed, you can upload the .cer file (which contains the public key information) for a trusted root certificate to Azure. Once a.cer file is uploaded, Azure can use it to authenticate clients that have installed a client certificate generated from the trusted root certificate. You can upload additional trusted root certificate files - up to a total of 20 - later, if needed.

>[!NOTE]
> You can't upload the .cer file using Azure Cloud Shell. You can either use PowerShell locally on your computer, or you can use the [Azure portal steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md#uploadfile).
>

1. Declare the variable for your certificate name, replacing the value with your own.

   ```azurepowershell
   $P2SRootCertName = "P2SRootCert.cer"
   ```

1. Replace the file path with your own, and then run the cmdlets.

   ```azurepowershell
   $filePathForCert = "C:\cert\P2SRootCert.cer"
   $cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2($filePathForCert)
   $CertBase64 = [system.convert]::ToBase64String($cert.RawData)
   ```

1. Upload the public key information to Azure. Once the certificate information is uploaded, Azure considers it to be a trusted root certificate. When uploading, make sure you are running PowerShell locally on your computer, or instead, you can use the [Azure portal steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md#uploadfile). You can't upload using Azure Cloud Shell.

   ```azurepowershell
   Add-AzVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName -VirtualNetworkGatewayname "VNet1GW" -ResourceGroupName "TestRG1" -PublicCertData $CertBase64
   ```

## <a name="clientcertificate"></a>8. Install an exported client certificate

The following steps help you install on a Windows client. For additional clients and more information, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

[!INCLUDE [Install on Windows](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

Make sure the client certificate was exported as a .pfx along with the entire certificate chain (which is the default). Otherwise, the root certificate information isn't present on the client computer and the client won't be able to authenticate properly.

## <a name="clientconfig"></a>9. Configure the VPN client

In this section, you configure the native client for your computer to connect to the virtual network gateway. For example, when you go to VPN settings on your Windows computer, you can add VPN connections. A point-to-site connection requires specific configuration settings. These steps help you create a package with the specific settings your native VPN client needs to be able connect to the virtual network over a point-to-site connection.

You can use the following quick examples to generate and install the client configuration package. For more information about package contents and additional instructions about to generate and install VPN client configuration files, see [Create and install VPN client configuration files](point-to-site-vpn-client-configuration-azure-cert.md).

If you need to declare your variables again, you can find them [here](#declare).

### To generate configuration files

```azurepowershell-interactive
$profile=New-AzVpnClientConfiguration -ResourceGroupName $RG -Name $GWName -AuthenticationMethod "EapTls"

$profile.VPNProfileSASUrl
```

### To install the client configuration package

[!INCLUDE [Windows instructions](../../includes/vpn-gateway-p2s-client-configuration-windows.md)]

## <a name="connect"></a>10. Connect to Azure

### Windows VPN client

[!INCLUDE [Connect from Windows client](../../includes/vpn-gateway-p2s-connect-windows-client.md)]

[!INCLUDE [Client certificates](../../includes/vpn-gateway-certificates-verify-client-cert-include.md)]

### Mac VPN client

From the Network dialog box, locate the client profile that you want to use, then click **Connect**.
Check [Install - Mac (OS X)](https://docs.microsoft.com/azure/vpn-gateway/point-to-site-vpn-client-configuration-azure-cert#installmac) for detailed instructions. If you are having trouble connecting, verify that the virtual network gateway is not using a Basic SKU. Basic SKU is not supported for Mac clients.

  ![Mac connection](./media/vpn-gateway-howto-point-to-site-rm-ps/applyconnect.png)

## <a name="verify"></a>To verify a connection

These instructions apply to Windows clients.

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the point-to-site VPN Client Address Pool that you specified in your configuration. The results are similar to this example:

   ```
   PPP adapter VNet1:
      Connection-specific DNS Suffix .:
      Description.....................: VNet1
      Physical Address................:
      DHCP Enabled....................: No
      Autoconfiguration Enabled.......: Yes
      IPv4 Address....................: 172.16.201.13(Preferred)
      Subnet Mask.....................: 255.255.255.255
      Default Gateway.................:
      NetBIOS over Tcpip..............: Enabled
   ```

## <a name="connectVM"></a>To connect to a virtual machine

These instructions apply to Windows clients.

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm.md)]

* Verify that the VPN client configuration package was generated after the DNS server IP addresses were specified for the VNet. If you updated the DNS server IP addresses, generate and install a new VPN client configuration package.

* Use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you are connecting. If the IP address is within the address range of the VNet that you are connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.

## <a name="addremovecert"></a>To add or remove a root certificate

You can add and remove trusted root certificates from Azure. When you remove a root certificate, clients that have a certificate generated from the root certificate can't authenticate and won't be able to connect. If you want a client to authenticate and connect, you need to install a new client certificate generated from a root certificate that is trusted (uploaded) to Azure. These steps require Azure PowerShell cmdlets installed locally on your computer (not Azure Cloud Shell). You can also use the Azure portal to add root certificates.

**To add:**

You can add up to 20 root certificate .cer files to Azure. The following steps help you add a root certificate. 

1. Prepare the .cer file to upload:

   ```azurepowershell
   $filePathForCert = "C:\cert\P2SRootCert3.cer"
   $cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2($filePathForCert)
   $CertBase64_3 = [system.convert]::ToBase64String($cert.RawData)
   ```

1. Upload the file. You can only upload one file at a time.

   ```azurepowershell
   Add-AzVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName -VirtualNetworkGatewayname "VNet1GW" -ResourceGroupName "TestRG1" -PublicCertData $CertBase64_3
   ```

1. To verify that the certificate file uploaded:

   ```azurepowershell
   Get-AzVpnClientRootCertificate -ResourceGroupName "TestRG1" `
   -VirtualNetworkGatewayName "VNet1GW"
   ```

**To remove:**

1. Declare the variables. Modify the variables in the example to match the certificate that you want to remove.

   ```azurepowershell-interactive
   $GWName = "Name_of_virtual_network_gateway"
   $RG = "Name_of_resource_group"
   $P2SRootCertName2 = "ARMP2SRootCert2.cer"
   $MyP2SCertPubKeyBase64_2 = "MIIC/zCCAeugAwIBAgIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAMBgxFjAUBgNVBAMTDU15UDJTUm9vdENlcnQwHhcNMTUxMjE5MDI1MTIxWhcNMzkxMjMxMjM1OTU5WjAYMRYwFAYDVQQDEw1NeVAyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyjIXoWy8xE/GF1OSIvUaA0bxBjZ1PJfcXkMWsHPzvhWc2esOKrVQtgFgDz4ggAnOUFEkFaszjiHdnXv3mjzE2SpmAVIZPf2/yPWqkoHwkmrp6BpOvNVOpKxaGPOuK8+dql1xcL0eCkt69g4lxy0FGRFkBcSIgVTViS9wjuuS7LPo5+OXgyFkAY3pSDiMzQCkRGNFgw5WGMHRDAiruDQF1ciLNojAQCsDdLnI3pDYsvRW73HZEhmOqRRnJQe6VekvBYKLvnKaxUTKhFIYwuymHBB96nMFdRUKCZIiWRIy8Hc8+sQEsAML2EItAjQv4+fqgYiFdSWqnQCPf/7IZbotgQIDAQABo00wSzBJBgNVHQEEQjBAgBAkuVrWvFsCJAdK5pb/eoCNoRowGDEWMBQGA1UEAxMNTXlQMlNSb290Q2VydIIQKazxzFjMkp9JRiX+tkTfSzAJBgUrDgMCHQUAA4IBAQA223veAZEIar9N12ubNH2+HwZASNzDVNqspkPKD97TXfKHlPlIcS43TaYkTz38eVrwI6E0yDk4jAuPaKnPuPYFRj9w540SvY6PdOUwDoEqpIcAVp+b4VYwxPL6oyEQ8wnOYuoAK1hhh20lCbo8h9mMy9ofU+RP6HJ7lTqupLfXdID/XevI8tW6Dm+C/wCeV3EmIlO9KUoblD/e24zlo3YzOtbyXwTIh34T0fO/zQvUuBqZMcIPfM1cDvqcqiEFLWvWKoAnxbzckye2uk1gHO52d8AVL3mGiX8wBJkjc/pMdxrEvvCzJkltBmqxTM6XjDJALuVh16qFlqgTWCIcb7ju"
   ```

1. Remove the certificate.

   ```azurepowershell-interactive
   Remove-AzVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName2 -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -PublicCertData $MyP2SCertPubKeyBase64_2
   ```

1. Use the following example to verify that the certificate was removed successfully.

   ```azurepowershell-interactive
   Get-AzVpnClientRootCertificate -ResourceGroupName "TestRG1" `
   -VirtualNetworkGatewayName "VNet1GW"
   ```

## <a name="revoke"></a>To revoke or reinstate a client certificate

You can revoke client certificates. The certificate revocation list allows you to selectively deny point-to-site connectivity based on individual client certificates. This is different than removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. Revoking a client certificate, rather than the root certificate, allows the other certificates that were generated from the root certificate to continue to be used for authentication.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

**To revoke:**

1. Retrieve the client certificate thumbprint. For more information, see [How to retrieve the Thumbprint of a Certificate](https://msdn.microsoft.com/library/ms734695.aspx).

1. Copy the information to a text editor and remove all spaces so that it is a continuous string. This string is declared as a variable in the next step.

1. Declare the variables. Make sure to declare the thumbprint you retrieved in the previous step.

   ```azurepowershell-interactive
   $RevokedClientCert1 = "NameofCertificate"
   $RevokedThumbprint1 = "‎51ab1edd8da4cfed77e20061c5eb6d2ef2f778c7"
   $GWName = "Name_of_virtual_network_gateway"
   $RG = "Name_of_resource_group"
   ```

1. Add the thumbprint to the list of revoked certificates. You see "Succeeded" when the thumbprint has been added.

   ```azurepowershell-interactive
   Add-AzVpnClientRevokedCertificate -VpnClientRevokedCertificateName $RevokedClientCert1 `
   -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG `
   -Thumbprint $RevokedThumbprint1
   ```

1. Verify that the thumbprint was added to the certificate revocation list.

   ```azurepowershell-interactive
   Get-AzVpnClientRevokedCertificate -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG
   ```

1. After the thumbprint has been added, the certificate can no longer be used to connect. Clients that try to connect using this certificate receive a message saying that the certificate is no longer valid.

**To reinstate:**

You can reinstate a client certificate by removing the thumbprint from the list of revoked client certificates.

1. Declare the variables. Make sure you declare the correct thumbprint for the certificate that you want to reinstate.

   ```azurepowershell-interactive
   $RevokedClientCert1 = "NameofCertificate"
   $RevokedThumbprint1 = "‎51ab1edd8da4cfed77e20061c5eb6d2ef2f778c7"
   $GWName = "Name_of_virtual_network_gateway"
   $RG = "Name_of_resource_group"
   ```

1. Remove the certificate thumbprint from the certificate revocation list.

   ```azurepowershell-interactive
   Remove-AzVpnClientRevokedCertificate -VpnClientRevokedCertificateName $RevokedClientCert1 `
   -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG -Thumbprint $RevokedThumbprint1
   ```

1. Check if the thumbprint is removed from the revoked list.

   ```azurepowershell-interactive
   Get-AzVpnClientRevokedCertificate -VirtualNetworkGatewayName $GWName -ResourceGroupName $RG
   ```

## <a name="faq"></a>Point-to-Site FAQ

For additional point-to-site information, see the [VPN Gateway point-to-site FAQ](vpn-gateway-vpn-faq.md#P2S)

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-machines/linux/azure-vm-network-overview.md).

For P2S troubleshooting information, [Troubleshooting: Azure point-to-site connection problems](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
