---
title: 'Connect to a virtual network using P2S and RADIUS authentication: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to connect VPN clients securely to a virtual network using P2S and RADIUS authentication.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 06/23/2023
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Configure a point-to-site connection to a VNet using RADIUS authentication: PowerShell

This article shows you how to create a VNet with a point-to-site (P2S) connection that uses RADIUS authentication. This configuration is only available for the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md). You can create this configuration using PowerShell or the Azure portal.

A point-to-site VPN gateway lets you create a secure connection to your virtual network from an individual client computer. P2S VPN connections are useful when you want to connect to your VNet from a remote location, such as when you're telecommuting from home or a conference. A P2S VPN is also a useful solution to use instead of a site-to-site VPN when you have only a few clients that need to connect to a VNet.

A P2S VPN connection is started from Windows and Mac devices. This article helps you configure a P2S configuration that uses a RADIUS server for authentication. If you want to authenticate using a different method, see the following articles:

* [Certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
* [Microsoft Entra authentication](openvpn-azure-ad-tenant.md)

P2S connections don't require a VPN device or a public-facing IP address. P2S creates the VPN connection over either SSTP (Secure Socket Tunneling Protocol), OpenVPN or IKEv2.

* SSTP is a TLS-based VPN tunnel that is supported only on Windows client platforms. It can penetrate firewalls, which makes it a good option to connect Windows devices to Azure from anywhere. On the server side, we support TLS version 1.2 only. For improved performance, scalability and security, consider using OpenVPN protocol instead.

* OpenVPN® Protocol, an SSL/TLS based VPN protocol. A TLS VPN solution can penetrate firewalls, since most firewalls open TCP port 443 outbound, which TLS uses. OpenVPN can be used to connect from Android, iOS (versions 11.0 and above), Windows, Linux and Mac devices (macOS versions 10.13 and above).

* IKEv2 VPN, a standards-based IPsec VPN solution. IKEv2 VPN can be used to connect from Mac devices (macOS versions 10.11 and above).

For this configuration, connections require the following:

* A RouteBased VPN gateway.
* A RADIUS server to handle user authentication. The RADIUS server can be deployed on-premises, or in the Azure VNet. You can also configure two RADIUS servers for high availability.
* The VPN client profile configuration package. The VPN client profile configuration package is a package that you generate. It provides the settings required for a VPN client to connect over P2S.

## <a name="aboutad"></a>About Active Directory (AD) Domain Authentication for P2S VPNs

AD Domain authentication allows users to sign in to Azure using their organization domain credentials. It requires a RADIUS server that integrates with the AD server. Organizations can also leverage their existing RADIUS deployment.

The RADIUS server can reside on-premises, or in your Azure VNet. During authentication, the VPN gateway acts as a pass-through and forwards authentication messages back and forth between the RADIUS server and the connecting device. It's important for the VPN gateway to be able to reach the RADIUS server. If the RADIUS server is located on-premises, then a VPN site-to-site connection from Azure to the on-premises site is required.

Apart from Active Directory, a RADIUS server can also integrate with other external identity systems. This opens up plenty of authentication options for P2S VPNs, including MFA options. Check your RADIUS server vendor documentation to get the list of identity systems it integrates with.

:::image type="content" source="./media/point-to-site-how-to-radius-ps/radius-diagram.png" alt-text="Diagram of RADIUS authentication P2S connection." lightbox="./media/point-to-site-how-to-radius-ps/radius-diagram.png":::

> [!IMPORTANT]
> Only a site-to-site VPN connection can be used for connecting to a RADIUS server on-premises. An ExpressRoute connection can't be used.
>

## <a name="before"></a>Before beginning

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Working with Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

### <a name="example"></a>Example values

You can use the example values to create a test environment, or refer to these values to better understand the examples in this article. You can either use the steps as a walk-through and use the values without changing them, or change them to reflect your environment.

* **Name: VNet1**
* **Address space: 10.1.0.0/16** and **10.254.0.0/16**<br>For this example, we use more than one address space to illustrate that this configuration works with multiple address spaces. However, multiple address spaces aren't required for this configuration.
* **Subnet name: FrontEnd**
  * **Subnet address range: 10.1.0.0/24**
* **Subnet name: BackEnd**
  * **Subnet address range: 10.254.1.0/24**
* **Subnet name: GatewaySubnet**<br>The Subnet name *GatewaySubnet* is mandatory for the VPN gateway to work.
  * **GatewaySubnet address range: 10.1.255.0/27**
* **VPN client address pool: 172.16.201.0/24**<br>VPN clients that connect to the VNet using this P2S connection receive an IP address from the VPN client address pool.
* **Subscription:** If you've more than one subscription, verify that you're using the correct one.
* **Resource Group: TestRG1**
* **Location: East US**
* **DNS Server: IP address** of the DNS server that you want to use for name resolution for your VNet. (optional)
* **GW Name: Vnet1GW**
* **Public IP name: VNet1GWPIP**
* **VpnType: RouteBased**

## <a name="signin"></a>1. Set the variables

Declare the variables that you want to use. Use the following sample, substituting the values for your own when necessary. If you close your PowerShell/Cloud Shell session at any point during the exercise, just copy and paste the values again to redeclare the variables.

  ```azurepowershell-interactive
  $VNetName  = "VNet1"
  $FESubName = "FrontEnd"
  $BESubName = "Backend"
  $GWSubName = "GatewaySubnet"
  $VNetPrefix1 = "10.1.0.0/16"
  $VNetPrefix2 = "10.254.0.0/16"
  $FESubPrefix = "10.1.0.0/24"
  $BESubPrefix = "10.254.1.0/24"
  $GWSubPrefix = "10.1.255.0/27"
  $VPNClientAddressPool = "172.16.201.0/24"
  $RG = "TestRG1"
  $Location = "East US"
  $GWName = "VNet1GW"
  $GWIPName = "VNet1GWPIP"
  $GWIPconfName = "gwipconf1"
  ```

## 2. <a name="vnet"></a>Create the resource group, VNet, and Public IP address

The following steps create a resource group and a virtual network in the resource group with three subnets. When substituting values, it's important that you always name your gateway subnet specifically 'GatewaySubnet'. If you name it something else, your gateway creation fails;

1. Create a resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Name "TestRG1" -Location "East US"
   ```

1. Create the subnet configurations for the virtual network, naming them *FrontEnd*, *BackEnd*, and *GatewaySubnet*. These prefixes must be part of the VNet address space that you declared.

   ```azurepowershell-interactive
   $fesub = New-AzVirtualNetworkSubnetConfig -Name "FrontEnd" -AddressPrefix "10.1.0.0/24"  
   $besub = New-AzVirtualNetworkSubnetConfig -Name "Backend" -AddressPrefix "10.254.1.0/24"  
   $gwsub = New-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -AddressPrefix "10.1.255.0/27"
   ```

1. Create the virtual network.

   In this example, the -DnsServer server parameter is optional. Specifying a value doesn't create a new DNS server. The DNS server IP address that you specify should be a DNS server that can resolve the names for the resources you're connecting to from your VNet. For this example, we used a private IP address, but it's likely that this isn't the IP address of your DNS server. Be sure to use your own values. The value you specify is used by the resources that you deploy to the VNet, not by the P2S connection.

   ```azurepowershell-interactive
   New-AzVirtualNetwork -Name "VNet1" -ResourceGroupName "TestRG1" -Location "East US" -AddressPrefix "10.1.0.0/16","10.254.0.0/16" -Subnet $fesub, $besub, $gwsub -DnsServer 10.2.1.3
   ```

1. A VPN gateway must have a Public IP address. You first request the IP address resource, and then refer to it when creating your virtual network gateway. The IP address is dynamically assigned to the resource when the VPN gateway is created. VPN Gateway currently only supports *Dynamic* Public IP address allocation. You can't request a Static Public IP address assignment. However, this doesn't mean that the IP address changes after it has been assigned to your VPN gateway. The only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

   Specify the variables to request a dynamically assigned Public IP address.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name "VNet1" -ResourceGroupName "TestRG1"  
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet 
   $pip = New-AzPublicIpAddress -Name "VNet1GWPIP" -ResourceGroupName "TestRG1" -Location "East US" -AllocationMethod Dynamic 
   $ipconf = New-AzVirtualNetworkGatewayIpConfig -Name "gwipconf1" -Subnet $subnet -PublicIpAddress $pip
   ```

## 3. <a name="radius"></a>Set up your RADIUS server

Before you create and configure the virtual network gateway, your RADIUS server should be configured correctly for authentication.

1. If you don’t have a RADIUS server deployed, deploy one. For deployment steps, refer to the setup guide provided by your RADIUS vendor.  
1. Configure the VPN gateway as a RADIUS client on the RADIUS. When adding this RADIUS client, specify the virtual network GatewaySubnet that you created.
1. Once the RADIUS server is set up, get the RADIUS server's IP address and the shared secret that RADIUS clients should use to talk to the RADIUS server. If the RADIUS server is in the Azure VNet, use the CA IP of the RADIUS server VM.

The [Network Policy Server (NPS)](/windows-server/networking/technologies/nps/nps-top) article provides guidance about configuring a Windows RADIUS server (NPS) for AD domain authentication.

## 4. <a name="creategw"></a>Create the VPN gateway

Configure and create the VPN gateway for your VNet.

* The -GatewayType must be 'Vpn' and the -VpnType must be 'RouteBased'.
* A VPN gateway can take 45 minutes or more to complete, depending on the [gateway SKU](vpn-gateway-about-vpn-gateway-settings.md#gwsku) you select.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG `
-Location $Location -IpConfigurations $ipconf -GatewayType Vpn `
-VpnType RouteBased -EnableBgp $false -GatewaySku VpnGw1
```

## 5. <a name="addradius"></a>Add the RADIUS server and client address pool

* The -RadiusServer can be specified by name or by IP address. If you specify the name and the server resides on-premises, then the VPN gateway may not be able to resolve the name. If that’s the case, then it's better to specify the IP address of the server.
* The -RadiusSecret should match what is configured on your RADIUS server.
* The -VpnClientAddressPool is the range from which the connecting VPN clients receive an IP address. Use a private IP address range that doesn't overlap with the on-premises location that you'll connect from, or with the VNet that you want to connect to. Ensure that you have a large enough address pool configured.  

1. Create a secure string for the RADIUS secret.

   ```azurepowershell-interactive
   $Secure_Secret=Read-Host -AsSecureString -Prompt "RadiusSecret"
   ```

1. You're prompted to enter the RADIUS secret. The characters that you enter won't be displayed and instead will be replaced by the "*" character.

   ```azurepowershell-interactive
   RadiusSecret:***
   ```

1. Add the VPN client address pool and the RADIUS server information.

   For SSTP configurations:

    ```azurepowershell-interactive
    $Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName $RG -Name $GWName
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
    -VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol "SSTP" `
    -RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
    ```

   For OpenVPN® configurations:

    ```azurepowershell-interactive
    $Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName $RG -Name $GWName
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway -VpnClientRootCertificates @()
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
    -VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol "OpenVPN" `
    -RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
    ```

   For IKEv2 configurations:

    ```azurepowershell-interactive
    $Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName $RG -Name $GWName
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
    -VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol "IKEv2" `
    -RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
    ```

   For SSTP + IKEv2:

    ```azurepowershell-interactive
    $Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName $RG -Name $GWName
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
    -VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol @( "SSTP", "IkeV2" ) `
    -RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
    ```

   To specify **two** RADIUS servers, use the following syntax. Modify the **-VpnClientProtocol** value as needed.

    ```azurepowershell-interactive
    $radiusServer1 = New-AzRadiusServer -RadiusServerAddress 10.1.0.15 -RadiusServerSecret $radiuspd -RadiusServerScore 30
    $radiusServer2 = New-AzRadiusServer -RadiusServerAddress 10.1.0.16 -RadiusServerSecret $radiuspd -RadiusServerScore 1

    $radiusServers = @( $radiusServer1, $radiusServer2 )

    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $actual -VpnClientAddressPool 201.169.0.0/16 -VpnClientProtocol "IkeV2" -RadiusServerList $radiusServers
    ```

## 6. <a name="vpnclient"></a>Configure the VPN client and connect

The VPN client profile configuration packages contain the settings that help you configure VPN client profiles for a connection to the Azure VNet.

To generate a VPN client configuration package and configure a VPN client, see one of the following articles:

* [RADIUS - certificate authentication for VPN clients](point-to-site-vpn-client-configuration-radius-certificate.md)
* [RADIUS - password authentication for VPN clients](point-to-site-vpn-client-configuration-radius-password.md)
* [RADIUS - other authentication methods for VPN clients](point-to-site-vpn-client-configuration-radius-other.md)

After you configure the VPN client, connect to Azure.

## <a name="verify"></a>To verify your connection

1. To verify that your VPN connection is active, open an elevated command prompt, and run *ipconfig/all*.
1. View the results. Notice that the IP address you received is one of the addresses within the P2S VPN Client Address Pool that you specified in your configuration. The results are similar to this example:

   ```
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
   ```

To troubleshoot a P2S connection, see [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).

## <a name="connectVM"></a>To connect to a virtual machine

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm.md)]

* Verify that the VPN client configuration package was generated after the DNS server IP addresses were specified for the VNet. If you updated the DNS server IP addresses, generate and install a new VPN client configuration package.

* Use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you're connecting. If the IP address is within the address range of the VNet that you're connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.

## <a name="faq"></a>FAQ

For FAQ information, see the [Point-to-site - RADIUS authentication](vpn-gateway-vpn-faq.md#P2SRADIUS) section of the FAQ.

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](../index.yml). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-network/network-overview.md).
