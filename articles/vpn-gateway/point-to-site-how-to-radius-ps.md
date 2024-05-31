---
title: 'Connect to a virtual network using P2S and RADIUS authentication: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to connect VPN clients securely to a virtual network using P2S and RADIUS authentication.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/29/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Configure P2S VPN Gateway server settings - RADIUS authentication

This article helps you create a point-to-site (P2S) connection that uses RADIUS authentication. You can create this configuration using either PowerShell, or the Azure portal. If you want to authenticate using a different method, see the following articles:

* [Certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
* [Microsoft Entra ID authentication](openvpn-azure-ad-tenant.md)

For more information about point-to-site VPN connections, see [About P2S VPN](point-to-site-about.md).

This type of connection requires:

* A RouteBased VPN gateway.
* A RADIUS server to handle user authentication. The RADIUS server can be deployed on-premises, or in the Azure virtual network (VNet). You can also configure two RADIUS servers for high availability.
* The VPN client profile configuration package. The VPN client profile configuration package is a package that you generate. It contains the settings required for a VPN client to connect over P2S.

## <a name="aboutad"></a>About Active Directory (AD) Domain Authentication for P2S VPNs

AD Domain authentication allows users to sign in to Azure using their organization domain credentials. It requires a RADIUS server that integrates with the AD server. Organizations can also use their existing RADIUS deployment.

The RADIUS server can reside on-premises, or in your Azure VNet. During authentication, the VPN gateway acts as a pass-through and forwards authentication messages back and forth between the RADIUS server and the connecting device. It's important for the VPN gateway to be able to reach the RADIUS server. If the RADIUS server is located on-premises, then a VPN site-to-site connection from Azure to the on-premises site is required.

Apart from Active Directory, a RADIUS server can also integrate with other external identity systems. This opens up plenty of authentication options for P2S VPNs, including MFA options. Check your RADIUS server vendor documentation to get the list of identity systems it integrates with.

:::image type="content" source="./media/point-to-site-how-to-radius-ps/radius-diagram.png" alt-text="Diagram of RADIUS authentication P2S connection." lightbox="./media/point-to-site-how-to-radius-ps/radius-diagram.png":::

> [!IMPORTANT]
> An ExpressRoute connection can't be used to connect to an on-premises RADIUS server.
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

## <a name="vnet"></a>Create the resource group, VNet, and Public IP address

The following steps create a resource group and a virtual network in the resource group with three subnets. When substituting values, it's important that you always name your gateway subnet specifically **GatewaySubnet**. If you name it something else, your gateway creation fails.

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

## Request a public IP address

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

## <a name="radius"></a>Set up your RADIUS server

Before you create and configure the virtual network gateway, your RADIUS server should be configured correctly for authentication.

1. If you don’t have a RADIUS server deployed, deploy one. For deployment steps, refer to the setup guide provided by your RADIUS vendor.  
1. Configure the VPN gateway as a RADIUS client on the RADIUS. When adding this RADIUS client, specify the virtual network GatewaySubnet that you created.
1. Once the RADIUS server is set up, get the RADIUS server's IP address and the shared secret that RADIUS clients should use to talk to the RADIUS server. If the RADIUS server is in the Azure VNet, use the CA IP of the RADIUS server VM.

The [Network Policy Server (NPS)](/windows-server/networking/technologies/nps/nps-top) article provides guidance about configuring a Windows RADIUS server (NPS) for AD domain authentication.

## <a name="creategw"></a>Create the VPN gateway

In this step, you configure and create the virtual network gateway for your VNet. For more complete information about authentication and tunnel type, see [Specify tunnel and authentication type](vpn-gateway-howto-point-to-site-resource-manager-portal.md#type) in the Azure portal version of this article.

* The -GatewayType must be 'Vpn' and the -VpnType must be 'RouteBased'.
* A VPN gateway can take 45 minutes or more to build, depending on the [Gateway SKU](about-gateway-skus.md) you select.

In the following example, we use the VpnGw2, Generation 2 SKU. If you see ValidateSet errors regarding the GatewaySKU value and are running these commands locally, verify that you have installed the [latest version of the PowerShell cmdlets](/powershell/azure/). The latest version contains the new validated values for the latest Gateway SKUs.

Create the virtual network gateway with the gateway type "Vpn" using [New-AzVirtualNetworkGateway](/powershell/module/az.network/new-azvirtualnetworkgateway).

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1" `
-Location "EastUS" -IpConfigurations $gwipconfig -GatewayType Vpn `
-VpnType RouteBased -EnableBgp $false -GatewaySku VpnGw2 -VpnGatewayGeneration "Generation2"
```

## <a name="addradius"></a>Add the RADIUS server

* The -RadiusServer can be specified by name or by IP address. If you specify the name and the server resides on-premises, then the VPN gateway might not be able to resolve the name. If that’s the case, then it's better to specify the IP address of the server.
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

## Add the client address pool and RADIUS server values

In this section, you add the VPN client address pool and the RADIUS server information. There are multiple possible configurations. Select the example that you want to configure.

### SSTP configurations

```azurepowershell-interactive
$Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName "TestRG1" -Name "VNet1GW"
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
-VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol "SSTP" `
-RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
```

### OpenVPN® configurations

```azurepowershell-interactive
$Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName "TestRG1" -Name "VNet1GW"
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway -VpnClientRootCertificates @()
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
-VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol "OpenVPN" `
-RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
```

### IKEv2 configurations

```azurepowershell-interactive
$Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName "TestRG1" -Name "VNet1GW"
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
-VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol "IKEv2" `
-RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
```

### SSTP + IKEv2

```azurepowershell-interactive
$Gateway = Get-AzVirtualNetworkGateway -ResourceGroupName "TestRG1" -Name "VNet1GW"
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway `
-VpnClientAddressPool "172.16.201.0/24" -VpnClientProtocol @( "SSTP", "IkeV2" ) `
-RadiusServerAddress "10.51.0.15" -RadiusServerSecret $Secure_Secret
```

### Specify two RADIUS servers

To specify **two** RADIUS servers, use the following syntax. Modify the **-VpnClientProtocol** value as needed.

```azurepowershell-interactive
$radiusServer1 = New-AzRadiusServer -RadiusServerAddress 10.1.0.15 -RadiusServerSecret $radiuspd -RadiusServerScore 30
$radiusServer2 = New-AzRadiusServer -RadiusServerAddress 10.1.0.16 -RadiusServerSecret $radiuspd -RadiusServerScore 1

$radiusServers = @( $radiusServer1, $radiusServer2 )

Set-AzVirtualNetworkGateway -VirtualNetworkGateway $actual -VpnClientAddressPool 201.169.0.0/16 -VpnClientProtocol "IkeV2" -RadiusServerList $radiusServers
```

## <a name="vpnclient"></a>Configure the VPN client and connect

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
