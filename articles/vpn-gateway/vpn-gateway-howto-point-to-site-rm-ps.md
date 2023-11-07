---
title: 'Configure P2S server configuration - certificate authentication: PowerShell'
description: Learn how to connect Windows and macOS clients securely to Azure virtual network using P2S and self-signed or CA issued certificates.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 08/07/2023
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Configure server settings for P2S VPN certificate authentication - PowerShell

This article helps you configure a point-to-site (P2S) VPN to securely connect individual clients running Windows, Linux, or macOS to an Azure virtual network (VNet). P2S VPN connections are useful when you want to connect to your VNet from a remote location, such when you're telecommuting from home or a conference.

You can also use P2S instead of a Site-to-Site VPN when you have only a few clients that need to connect to a VNet. P2S connections don't require a VPN device or a public-facing IP address. P2S creates the VPN connection over either SSTP (Secure Socket Tunneling Protocol), or IKEv2.

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png" alt-text="Diagram of a point-to-site connection.":::

For more information about P2S VPN, see [About P2S VPN](point-to-site-about.md). To create this configuration using the Azure portal, see [Configure a point-to-site VPN using the Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md).

[!INCLUDE [P2S basic architecture](../../includes/vpn-gateway-p2s-architecture.md)]

## Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Azure PowerShell

You can either use Azure Cloud Shell, or you can run PowerShell locally. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/).

* Many of the steps in this article can use the Azure Cloud Shell. However, you can't use Cloud Shell to generate certificates. Additionally, to upload the root certificate public key, you must either use Azure PowerShell locally, or the Azure portal.

* You may see warnings saying "The output object type of this cmdlet will be modified in a future release". This is expected behavior and you can safely ignore these warnings.

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## <a name="ConfigureVNet"></a>Create a VNet

1. Create a resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).

   ```azurepowershell-interactive
   New-AzResourceGroup -Name "TestRG1" -Location "EastUS"
   ```

1. Create the virtual network using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork).

   ```azurepowershell-interactive
   $vnet = New-AzVirtualNetwork `
   -ResourceGroupName "TestRG1" `
   -Location "EastUS" `
   -Name "VNet1" `
   -AddressPrefix 10.1.0.0/16
   ```

1. Create subnets using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) with the following names: FrontEnd and GatewaySubnet (a gateway subnet must be named *GatewaySubnet*).

   ```azurepowershell-interactive
   $subnetConfigFrontend = Add-AzVirtualNetworkSubnetConfig `
     -Name Frontend `
     -AddressPrefix 10.1.0.0/24 `
     -VirtualNetwork $vnet

   $subnetConfigGW = Add-AzVirtualNetworkSubnetConfig `
     -Name GatewaySubnet `
     -AddressPrefix 10.1.255.0/27 `
     -VirtualNetwork $vnet
   ```

1. Write the subnet configurations to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork), which creates the subnets in the virtual network:

   ```azurepowershell-interactive
   $vnet | Set-AzVirtualNetwork
   ```

## <a name="creategateway"></a>Create the VPN gateway

### Request a public IP address

A VPN gateway must have a Public IP address. You first request the IP address resource, and then refer to it when creating your virtual network gateway. The IP address is statically assigned to the resource when the VPN gateway is created. The only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

1. Request a public IP address for your VPN gateway using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

   ```azurepowershell-interactive
   $gwpip = New-AzPublicIpAddress -Name "GatewayIP" -ResourceGroupName "TestRG1" -Location "EastUS" -AllocationMethod Static -Sku Standard
   ```

1. Create the gateway IP address configuration using [New-AzVirtualNetworkGatewayIpConfig](/powershell/module/az.network/new-azvirtualnetworkgatewayipconfig). This configuration is referenced when you create the VPN gateway.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name "VNet1" -ResourceGroupName "TestRG1"
   $gwsubnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
   $gwipconfig = New-AzVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $gwsubnet.Id -PublicIpAddressId $gwpip.Id
   ```

### Create the VPN gateway

In this step, you configure and create the virtual network gateway for your VNet. For more complete information about authentication and tunnel type, see [Specify tunnel and authentication type](vpn-gateway-howto-point-to-site-resource-manager-portal.md#type) in the Azure portal version of this article.

* The -GatewayType must be **Vpn** and the -VpnType must be **RouteBased**.
* The -VpnClientProtocol is used to specify the types of tunnels that you would like to enable. The  tunnel options are **OpenVPN, SSTP**, and **IKEv2**. You can choose to enable one of them or any supported combination. If you want to enable multiple types, then specify the names separated by a comma. OpenVPN and SSTP can't be enabled together. The strongSwan client on Android and Linux and the native IKEv2 VPN client on iOS and macOS will use only the IKEv2 tunnel to connect. Windows clients try IKEv2 first and if that doesn’t connect, they fall back to SSTP. You can use the OpenVPN client to connect to OpenVPN tunnel type.
* The virtual network gateway 'Basic' SKU doesn't support IKEv2, OpenVPN, or RADIUS authentication. If you're planning on having Mac clients connect to your virtual network, don't use the Basic SKU.
* A VPN gateway can take 45 minutes or more to build, depending on the [gateway sku](vpn-gateway-about-vpn-gateway-settings.md) you select.

1. Create the virtual network gateway with the gateway type "Vpn" using [New-AzVirtualNetworkGateway](/powershell/module/az.network/new-azvirtualnetworkgateway).

   In this example, we use the VpnGw2, Generation 2 SKU. If you see ValidateSet errors regarding the GatewaySKU value and are running these commands locally, verify that you have installed the [latest version of the PowerShell cmdlets](/powershell/azure/). The latest version contains the new validated values for the latest Gateway SKUs.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1" `
   -Location "EastUS" -IpConfigurations $gwipconfig -GatewayType Vpn `
   -VpnType RouteBased -EnableBgp $false -GatewaySku VpnGw2 -VpnGatewayGeneration "Generation2" -VpnClientProtocol IkeV2,OpenVPN
   ```

1. Once your gateway is created, you can view it using the following example.

   ```azurepowershell-interactive
   Get-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroup TestRG1
   ```

## <a name="addresspool"></a>Add the VPN client address pool

After the VPN gateway finishes creating, you can add the VPN client address pool. The VPN client address pool is the range from which the VPN clients receive an IP address when connecting. Use a private IP address range that doesn't overlap with the on-premises location that you connect from, or with the VNet that you want to connect to.

1. Declare the following variables:

   ```azurepowershell-interactive
   $VNetName  = "VNet1"
   $VPNClientAddressPool = "172.16.201.0/24"
   $RG = "TestRG1"
   $Location = "EastUS"
   $GWName = "VNet1GW"
   ```

1. Add the VPN client address pool:

   ```azurepowershell-interactive
   $Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName $RG -Name $GWName
   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway -VpnClientAddressPool $VPNClientAddressPool
   ```

## <a name="Certificates"></a>Generate certificates

>[!IMPORTANT]
> You can't generate certificates using Azure Cloud Shell. You must use one of the methods outlined in this section. If you want to use PowerShell, you must install it locally.
>

Certificates are used by Azure to authenticate VPN clients for P2S VPNs. You upload the public key information of the root certificate to Azure. The public key is then considered 'trusted'. Client certificates must be generated from the trusted root certificate, and then installed on each client computer in the Certificates-Current User/Personal certificate store. The certificate is used to authenticate the client when it initiates a connection to the VNet.

If you use self-signed certificates, they must be created using specific parameters. You can create a self-signed certificate using the instructions for [PowerShell](vpn-gateway-certificates-point-to-site.md) for Windows computers running Windows 10 or later. If you aren't running Windows 10 or later, use [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) instead. 

It's important that you follow the steps in the instructions when generating self-signed root certificates and client certificates. Otherwise, the certificates you generate won't be compatible with P2S connections and you receive a connection error.

### <a name="cer"></a>Root certificate

1. [!INCLUDE [Root certificate](../../includes/vpn-gateway-p2s-rootcert-include.md)]

1. After you create the root certificate, [export](vpn-gateway-certificates-point-to-site.md#cer) the public certificate data (not the private key) as a Base64 encoded X.509 .cer file.

### <a name="generate"></a>Client certificate

1. [!INCLUDE [Generate a client certificate](../../includes/vpn-gateway-p2s-clientcert-include.md)]

1. After you create client certificate, [export](vpn-gateway-certificates-point-to-site.md#clientexport) it. Each client computer requires a client certificate in order to connect and authenticate.

## <a name="upload"></a>Upload root certificate public key information

Verify that your VPN gateway has finished creating. Once it has completed, you can upload the .cer file (which contains the public key information) for a trusted root certificate to Azure. Once a .cer file is uploaded, Azure can use it to authenticate clients that have installed a client certificate generated from the trusted root certificate. You can upload additional trusted root certificate files - up to a total of 20 - later, if needed.

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

1. Upload the public key information to Azure. Once the certificate information is uploaded, Azure considers it to be a trusted root certificate. When uploading, make sure you're running PowerShell locally on your computer, or instead, you can use the [Azure portal steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md#uploadfile). When the upload is complete, you'll see a PowerShell return showing PublicCertData. It takes about 10 minutes for the certificate upload process to complete.

   ```azurepowershell
   Add-AzVpnClientRootCertificate -VpnClientRootCertificateName $P2SRootCertName -VirtualNetworkGatewayname "VNet1GW" -ResourceGroupName "TestRG1" -PublicCertData $CertBase64
   ```

## <a name="clientcertificate"></a>Install an exported client certificate

The following steps help you install on a Windows client. For additional clients and more information, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

[!INCLUDE [Install on Windows](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

Make sure the client certificate was exported as a .pfx along with the entire certificate chain (which is the default). Otherwise, the root certificate information isn't present on the client computer and the client won't be able to authenticate properly.

## <a name="connect"></a>Configure VPN clients and connect to Azure

Each VPN client is configured using the files in a VPN client profile configuration package that you generate and download. The configuration package contains settings that are specific to the VPN gateway that you created. If you make changes to the gateway, such as changing a tunnel type, certificate, or authentication type, you must generate another VPN client profile configuration package and install it on each client. Otherwise, your VPN clients may not be able to connect.

For steps to generate a VPN client profile configuration package, configure your VPN clients, and connect to Azure, see the following articles:

* [Windows](point-to-site-vpn-client-cert-windows.md)
* [macOS-iOS](point-to-site-vpn-client-cert-mac.md)
* [Linux](point-to-site-vpn-client-cert-linux.md)

## <a name="verify"></a>To verify a connection

These instructions apply to Windows clients.

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
2. View the results. Notice that the IP address you received is one of the addresses within the P2S VPN Client Address Pool that you specified in your configuration. The results are similar to this example:

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

* Use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you're connecting. If the IP address is within the address range of the VNet that you're connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.

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

You can revoke client certificates. The certificate revocation list allows you to selectively deny P2S connectivity based on individual client certificates. This is different than removing a trusted root certificate. If you remove a trusted root certificate .cer from Azure, it revokes the access for all client certificates generated/signed by the revoked root certificate. Revoking a client certificate, rather than the root certificate, allows the other certificates that were generated from the root certificate to continue to be used for authentication.

The common practice is to use the root certificate to manage access at team or organization levels, while using revoked client certificates for fine-grained access control on individual users.

**To revoke:**

1. Retrieve the client certificate thumbprint. For more information, see [How to retrieve the Thumbprint of a Certificate](/dotnet/framework/wcf/feature-details/how-to-retrieve-the-thumbprint-of-a-certificate).

1. Copy the information to a text editor and remove all spaces so that it's a continuous string. This string is declared as a variable in the next step.

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

## <a name="faq"></a>P2S FAQ

For additional P2S information, see the [VPN Gateway P2S FAQ](vpn-gateway-vpn-faq.md#P2S)

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](../index.yml). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-network/network-overview.md).

For P2S troubleshooting information, [Troubleshooting: Azure P2S connection problems](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
