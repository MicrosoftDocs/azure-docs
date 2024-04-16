---
title: 'Configure custom IPsec/IKE connection policies for S2S VPN & VNet-to-VNet: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to configure IPsec/IKE custom policy for S2S or VNet-to-VNet connections with Azure VPN Gateways using PowerShell.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 01/30/2023
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Configure custom IPsec/IKE connection policies for S2S VPN and VNet-to-VNet: PowerShell

This article walks you through the steps to configure a custom IPsec/IKE policy for VPN Gateway Site-to-Site VPN or VNet-to-VNet connections using PowerShell.

## Workflow

The instructions in this article help you set up and configure IPsec/IKE policies as shown in the following diagram.

:::image type="content" source="./media/vpn-gateway-ipsecikepolicy-rm-powershell/ipsecikepolicy.png" alt-text="Diagram showing IPsec/IKE policy architecture." border="false":::

1. Create a virtual network and a VPN gateway.
1. Create a local network gateway for cross premises connection, or another virtual network and gateway for VNet-to-VNet connection.
1. Create an IPsec/IKE policy with selected algorithms and parameters.
1. Create a connection (IPsec or VNet2VNet) with the IPsec/IKE policy.
1. Add/update/remove an IPsec/IKE policy for an existing connection.

## Policy parameters

[!INCLUDE [IPsec policy parameters](../../includes/vpn-gateway-ipsec-policy-parameters-include.md)]

### Cryptographic algorithms & key strengths

The following table lists the supported configurable cryptographic algorithms and key strengths.

[!INCLUDE [Algorithm and keys table](../../includes/vpn-gateway-ipsec-ike-algorithm-include.md)]

[!INCLUDE [Important requirements table](../../includes/vpn-gateway-ipsec-ike-requirements-include.md)]

> [!NOTE]
> IKEv2 Integrity is used for both Integrity and PRF(pseudo-random function). 
> If IKEv2 Encryption  algorithm specified is GCM*, the value passed in IKEv2 Integrity is used for PRF only and implicitly we set IKEv2 Integrity to GCM*. In all other cases, the value passed in IKEv2 Integrity is used for both IKEv2 Integrity and PRF.
>

#### Diffie-Hellman groups

The following table lists the corresponding Diffie-Hellman groups supported by the custom policy:

[!INCLUDE [Diffie-Hellman groups](../../includes/vpn-gateway-ipsec-ike-diffie-hellman-include.md)]

Refer to [RFC3526](https://tools.ietf.org/html/rfc3526) and [RFC5114](https://tools.ietf.org/html/rfc5114) for more details.

## <a name ="crossprem"></a>Create an S2S VPN connection with IPsec/IKE policy

This section walks you through the steps of creating a S2S VPN connection with an IPsec/IKE policy. The following steps create the connection as shown in the diagram:

:::image type="content" source="./media/vpn-gateway-ipsecikepolicy-rm-powershell/s2spolicy.png" alt-text="Diagram showing policy architecture." border="false":::

See [Create a S2S VPN connection](vpn-gateway-create-site-to-site-rm-powershell.md) for more detailed step-by-step instructions for creating a S2S VPN connection.

You can run the steps for this exercise using Azure Cloud Shell in your browser. If you want to use PowerShell directly from your computer instead, install the Azure Resource Manager PowerShell cmdlets. For more information about installing the PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azure/).

### <a name="createvnet1"></a>Step 1 - Create the virtual network, VPN gateway, and local network gateway resources

If you use Azure Cloud Shell, you automatically connect to your account and don't need to run the following command.

If you use PowerShell from your computer, open your PowerShell console and connect to your account. For more information, see [Using Windows PowerShell with Resource Manager](../azure-resource-manager/management/manage-resources-powershell.md). Use the following sample to help you connect:

```PowerShell
Connect-AzAccount
Select-AzSubscription -SubscriptionName <YourSubscriptionName>
```

#### 1. Declare your variables

For this exercise, we start by declaring variables. You can replace the variables with your own before running the commands.

```azurepowershell-interactive
$RG1           = "TestRG1"
$Location1     = "EastUS"
$VNetName1     = "TestVNet1"
$FESubName1    = "FrontEnd"
$BESubName1    = "Backend"
$GWSubName1    = "GatewaySubnet"
$VNetPrefix11  = "10.1.0.0/16"
$FESubPrefix1  = "10.1.0.0/24"
$BESubPrefix1  = "10.1.1.0/24"
$GWSubPrefix1  = "10.1.255.0/27"
$DNS1          = "8.8.8.8"
$GWName1       = "VNet1GW"
$GW1IPName1    = "VNet1GWIP1"
$GW1IPconf1    = "gw1ipconf1"
$Connection16  = "VNet1toSite6"
$LNGName6      = "Site6"
$LNGPrefix61   = "10.61.0.0/16"
$LNGPrefix62   = "10.62.0.0/16"
$LNGIP6        = "131.107.72.22"
```

#### 2. Create the virtual network, VPN gateway, and local network gateway

The following samples create the virtual network, TestVNet1, with three subnets, and the VPN gateway. When substituting values, it's important that you always name your gateway subnet specifically GatewaySubnet. If you name it something else, your gateway creation fails. It can take 45 minutes or more for the virtual network gateway to create. During this time, if you are using Azure Cloud Shell, your connection may time out. This doesn't affect the gateway create command.

```azurepowershell-interactive
New-AzResourceGroup -Name $RG1 -Location $Location1

$fesub1 = New-AzVirtualNetworkSubnetConfig -Name $FESubName1 -AddressPrefix $FESubPrefix1
$besub1 = New-AzVirtualNetworkSubnetConfig -Name $BESubName1 -AddressPrefix $BESubPrefix1
$gwsub1 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName1 -AddressPrefix $GWSubPrefix1

New-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1 -Location $Location1 -AddressPrefix $VNetPrefix11 -Subnet $fesub1,$besub1,$gwsub1

$gw1pip1 = New-AzPublicIpAddress -Name $GW1IPName1 -ResourceGroupName $RG1 -Location $Location1 -AllocationMethod Dynamic
$vnet1 = Get-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1
$subnet1 = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet1
$gw1ipconf1 = New-AzVirtualNetworkGatewayIpConfig -Name $GW1IPconf1 -Subnet $subnet1 -PublicIpAddress $gw1pip1

New-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1 -Location $Location1 -IpConfigurations $gw1ipconf1 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw1
```

Create the local network gateway. You may need to reconnect and declare the following variables again if Azure Cloud Shell timed out.

Declare variables.

```azurepowershell-interactive
$RG1           = "TestRG1"
$Location1     = "EastUS"
$LNGName6      = "Site6"
$LNGPrefix61   = "10.61.0.0/16"
$LNGPrefix62   = "10.62.0.0/16"
$LNGIP6        = "131.107.72.22"
$GWName1       = "VNet1GW"
$Connection16  = "VNet1toSite6"
```

Create local network gateway Site6.

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name $LNGName6 -ResourceGroupName $RG1 -Location $Location1 -GatewayIpAddress $LNGIP6 -AddressPrefix $LNGPrefix61,$LNGPrefix62
```

### <a name="s2sconnection"></a>Step 2 - Create a S2S VPN connection with an IPsec/IKE policy

#### 1. Create an IPsec/IKE policy

The following sample script creates an IPsec/IKE policy with the following algorithms and parameters:

* IKEv2: AES256, SHA384, DHGroup24
* IPsec: AES256, SHA256, PFS None, SA Lifetime 14400 seconds & 102400000KB

```azurepowershell-interactive
$ipsecpolicy6 = New-AzIpsecPolicy -IkeEncryption AES256 -IkeIntegrity SHA384 -DhGroup DHGroup24 -IpsecEncryption AES256 -IpsecIntegrity SHA256 -PfsGroup None -SALifeTimeSeconds 14400 -SADataSizeKilobytes 102400000
```

If you use GCMAES for IPsec, you must use the same GCMAES algorithm and key length for both IPsec encryption and integrity. For example above, the corresponding parameters will be "-IpsecEncryption GCMAES256 -IpsecIntegrity GCMAES256" when using GCMAES256.

#### 2. Create the S2S VPN connection with the IPsec/IKE policy

Create an S2S VPN connection and apply the IPsec/IKE policy created earlier.

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1  -ResourceGroupName $RG1
$lng6 = Get-AzLocalNetworkGateway  -Name $LNGName6 -ResourceGroupName $RG1

New-AzVirtualNetworkGatewayConnection -Name $Connection16 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng6 -Location $Location1 -ConnectionType IPsec -IpsecPolicies $ipsecpolicy6 -SharedKey 'AzureA1b2C3'
```

You can optionally add "-UsePolicyBasedTrafficSelectors $True" to the create connection cmdlet to enable Azure VPN gateway to connect to policy-based on-premises VPN devices.

> [!IMPORTANT]
> Once an IPsec/IKE policy is specified on a connection, the Azure VPN gateway will only send or accept
> the IPsec/IKE proposal with specified cryptographic algorithms and key strengths on that particular
> connection. Make sure your on-premises VPN device for the connection uses or accepts the exact
> policy combination, otherwise the S2S VPN tunnel will not establish.

## <a name ="vnet2vnet"></a>Create a VNet-to-VNet connection with IPsec/IKE policy

The steps of creating a VNet-to-VNet connection with an IPsec/IKE policy are similar to that of a S2S VPN connection. The following sample scripts create the connection as shown in the diagram:

:::image type="content" source="./media/vpn-gateway-ipsecikepolicy-rm-powershell/v2vpolicy.png" alt-text="Diagram shows vnet-to-vnet architecture." border="false":::

See [Create a VNet-to-VNet connection](vpn-gateway-vnet-vnet-rm-ps.md) for more detailed steps for creating a VNet-to-VNet connection.

### Step 1: Create the second virtual network and VPN gateway

#### 1. Declare your variables

```azurepowershell-interactive
$RG2          = "TestRG2"
$Location2    = "EastUS"
$VNetName2    = "TestVNet2"
$FESubName2   = "FrontEnd"
$BESubName2   = "Backend"
$GWSubName2   = "GatewaySubnet"
$VNetPrefix21 = "10.21.0.0/16"
$VNetPrefix22 = "10.22.0.0/16"
$FESubPrefix2 = "10.21.0.0/24"
$BESubPrefix2 = "10.22.0.0/24"
$GWSubPrefix2 = "10.22.255.0/27"
$DNS2         = "8.8.8.8"
$GWName2      = "VNet2GW"
$GW2IPName1   = "VNet2GWIP1"
$GW2IPconf1   = "gw2ipconf1"
$Connection21 = "VNet2toVNet1"
$Connection12 = "VNet1toVNet2"
```

#### 2. Create the second virtual network and VPN gateway

```azurepowershell-interactive
New-AzResourceGroup -Name $RG2 -Location $Location2

$fesub2 = New-AzVirtualNetworkSubnetConfig -Name $FESubName2 -AddressPrefix $FESubPrefix2
$besub2 = New-AzVirtualNetworkSubnetConfig -Name $BESubName2 -AddressPrefix $BESubPrefix2
$gwsub2 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName2 -AddressPrefix $GWSubPrefix2

New-AzVirtualNetwork -Name $VNetName2 -ResourceGroupName $RG2 -Location $Location2 -AddressPrefix $VNetPrefix21,$VNetPrefix22 -Subnet $fesub2,$besub2,$gwsub2

$gw2pip1    = New-AzPublicIpAddress -Name $GW2IPName1 -ResourceGroupName $RG2 -Location $Location2 -AllocationMethod Dynamic
$vnet2      = Get-AzVirtualNetwork -Name $VNetName2 -ResourceGroupName $RG2
$subnet2    = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet2
$gw2ipconf1 = New-AzVirtualNetworkGatewayIpConfig -Name $GW2IPconf1 -Subnet $subnet2 -PublicIpAddress $gw2pip1

New-AzVirtualNetworkGateway -Name $GWName2 -ResourceGroupName $RG2 -Location $Location2 -IpConfigurations $gw2ipconf1 -GatewayType Vpn -VpnType RouteBased -VpnGatewayGeneration Generation2 -GatewaySku VpnGw2
```

It can take about 45 minutes or more to create the VPN gateway.

### Step 2: Create a VNet-toVNet connection with the IPsec/IKE policy

Similar to the S2S VPN connection, create an IPsec/IKE policy, then apply the policy to the new connection. If you used Azure Cloud Shell, your connection may have timed out. If so, re-connect and state the necessary variables again.

```azurepowershell-interactive
$GWName1 = "VNet1GW"
$GWName2 = "VNet2GW"
$RG1     = "TestRG1"
$RG2     = "TestRG2"
$Location1     = "EastUS"
$Location2    = "EastUS"
$Connection21 = "VNet2toVNet1"
$Connection12 = "VNet1toVNet2"
```

#### 1. Create the IPsec/IKE policy

The following sample script creates a different IPsec/IKE policy with the following algorithms and parameters:

* IKEv2: AES128, SHA1, DHGroup14
* IPsec: GCMAES128, GCMAES128, PFS24, SA Lifetime 14400 seconds & 102400000KB

```azurepowershell-interactive
$ipsecpolicy2 = New-AzIpsecPolicy -IkeEncryption AES128 -IkeIntegrity SHA1 -DhGroup DHGroup14 -IpsecEncryption GCMAES128 -IpsecIntegrity GCMAES128 -PfsGroup PFS24 -SALifeTimeSeconds 14400 -SADataSizeKilobytes 102400000
```

#### 2. Create VNet-to-VNet connections with the IPsec/IKE policy

Create a VNet-to-VNet connection and apply the IPsec/IKE policy you created. In this example, both gateways are in the same subscription. So it's possible to create and configure both connections with the same IPsec/IKE policy in the same PowerShell session.

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1  -ResourceGroupName $RG1
$vnet2gw = Get-AzVirtualNetworkGateway -Name $GWName2  -ResourceGroupName $RG2

New-AzVirtualNetworkGatewayConnection -Name $Connection12 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -VirtualNetworkGateway2 $vnet2gw -Location $Location1 -ConnectionType Vnet2Vnet -IpsecPolicies $ipsecpolicy2 -SharedKey 'AzureA1b2C3'

New-AzVirtualNetworkGatewayConnection -Name $Connection21 -ResourceGroupName $RG2 -VirtualNetworkGateway1 $vnet2gw -VirtualNetworkGateway2 $vnet1gw -Location $Location2 -ConnectionType Vnet2Vnet -IpsecPolicies $ipsecpolicy2 -SharedKey 'AzureA1b2C3'
```

> [!IMPORTANT]
> Once an IPsec/IKE policy is specified on a connection, the Azure VPN gateway will only send or accept
> the IPsec/IKE proposal with specified cryptographic algorithms and key strengths on that particular
> connection. Make sure the IPsec policies for both connections are the same, otherwise the
> VNet-to-VNet connection will not establish.

After you complete these steps, the connection is established in a few minutes, and you'll have the following network topology as shown in the beginning:

:::image type="content" source="./media/vpn-gateway-ipsecikepolicy-rm-powershell/ipsecikepolicy.png" alt-text="Diagram shows IPsec/IKE policy." border="false":::

## <a name="managepolicy"></a>Update IPsec/IKE policy for a connection

The last section shows you how to manage IPsec/IKE policy for an existing S2S or VNet-to-VNet connection. The following exercise walks you through the following operations on a connection:

1. Show the IPsec/IKE policy of a connection
1. Add or update the IPsec/IKE policy to a connection
1. Remove the IPsec/IKE policy from a connection

The same steps apply to both S2S and VNet-to-VNet connections.

> [!IMPORTANT]
> IPsec/IKE policy is supported on *Standard* and *HighPerformance* route-based VPN gateways only. It does not work on the Basic gateway SKU or the policy-based VPN gateway.

### 1. Show an IPsec/IKE policy for a connection

The following example shows how to get the IPsec/IKE policy configured on a connection. The scripts also continue from the exercises above.

```azurepowershell-interactive
$RG1          = "TestRG1"
$Connection16 = "VNet1toSite6"
$connection6  = Get-AzVirtualNetworkGatewayConnection -Name $Connection16 -ResourceGroupName $RG1
$connection6.IpsecPolicies
```

The last command lists the current IPsec/IKE policy configured on the connection, if existing. The following example is a sample output for the connection:

```azurepowershell-interactive
SALifeTimeSeconds   : 14400
SADataSizeKilobytes : 102400000
IpsecEncryption     : AES256
IpsecIntegrity      : SHA256
IkeEncryption       : AES256
IkeIntegrity        : SHA384
DhGroup             : DHGroup24
PfsGroup            : PFS24
```

If there isn't a configured IPsec/IKE policy, the command (PS> $connection6.IpsecPolicies) gets an empty return. It doesn't mean IPsec/IKE isn't configured on the connection, but that there's no custom IPsec/IKE policy. The actual connection uses the default policy negotiated between your on-premises VPN device and the Azure VPN gateway.

### 2. Add or update an IPsec/IKE policy for a connection

The steps to add a new policy or update an existing policy on a connection are the same: create a new policy then apply the new policy to the connection.

```azurepowershell-interactive
$RG1          = "TestRG1"
$Connection16 = "VNet1toSite6"
$connection6  = Get-AzVirtualNetworkGatewayConnection -Name $Connection16 -ResourceGroupName $RG1

$newpolicy6   = New-AzIpsecPolicy -IkeEncryption AES128 -IkeIntegrity SHA1 -DhGroup DHGroup14 -IpsecEncryption AES256 -IpsecIntegrity SHA256 -PfsGroup None -SALifeTimeSeconds 14400 -SADataSizeKilobytes 102400000

Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection6 -IpsecPolicies $newpolicy6
```

To enable "UsePolicyBasedTrafficSelectors" when connecting to an on-premises policy-based VPN device, add the "-UsePolicyBaseTrafficSelectors" parameter to the cmdlet, or set it to $False to disable the option:

```azurepowershell-interactive
Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection6 -IpsecPolicies $newpolicy6 -UsePolicyBasedTrafficSelectors $True
```

Similar to "UsePolicyBasedTrafficSelectors", configuring DPD timeout can be performed outside of the IPsec policy being applied:

```azurepowershell-interactive
Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection6 -IpsecPolicies $newpolicy6 -DpdTimeoutInSeconds 30
```

Either/both **Policy-based traffic selector** and **DPD timeout** options can be specified with **Default** policy, without a custom IPsec/IKE policy, if desired.

```azurepowershell-interactive
Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection6 -UsePolicyBasedTrafficSelectors $True -DpdTimeoutInSeconds 30 
```

You can get the connection again to check if the policy is updated. To check the connection for the updated policy, run the following command.

```azurepowershell-interactive
$connection6  = Get-AzVirtualNetworkGatewayConnection -Name $Connection16 -ResourceGroupName $RG1
$connection6.IpsecPolicies
```

Example output:

```azurepowershell-interactive
SALifeTimeSeconds   : 14400
SADataSizeKilobytes : 102400000
IpsecEncryption     : AES256
IpsecIntegrity      : SHA256
IkeEncryption       : AES128
IkeIntegrity        : SHA1
DhGroup             : DHGroup14
PfsGroup            : None
```

### 3. Remove an IPsec/IKE policy from a connection

Once you remove the custom policy from a connection, the Azure VPN gateway reverts back to the [default list of IPsec/IKE proposals](vpn-gateway-about-vpn-devices.md) and renegotiates again with your on-premises VPN device.

```azurepowershell-interactive
$RG1           = "TestRG1"
$Connection16  = "VNet1toSite6"
$connection6   = Get-AzVirtualNetworkGatewayConnection -Name $Connection16 -ResourceGroupName $RG1

$currentpolicy = $connection6.IpsecPolicies[0]
$connection6.IpsecPolicies.Remove($currentpolicy)

Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection6
```

You can use the same script to check if the policy has been removed from the connection.

## IPsec/IKE policy FAQ

To view frequently asked questions, go to the IPsec/IKE policy section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#ipsecike).

## Next steps

See [Connect multiple on-premises policy-based VPN devices](vpn-gateway-connect-multiple-policybased-rm-ps.md) for more details regarding policy-based traffic selectors.
