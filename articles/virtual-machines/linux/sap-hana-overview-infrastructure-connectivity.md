---
title: Infrastructure and Connectivity to SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Configure required connectivity infrastructure to use SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: timlt
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/01/2016
ms.author: rclaus

---
# SAP HANA (large instances) infrastructure and connectivity on Azure 

After the purchase of SAP HANA on Azure (Large Instances) is finalized between you and the Microsoft enterprise account team, the following information is required:

- Customer name
- Business contact information (including e-mail address and phone number)
- Technical contact information (including e-mail address and phone number)
- Technical networking contact information (including e-mail address and phone number)
- Azure deployment region (West US or East US as of September 2016)
- Confirm SAP HANA on Azure (Large Instances) SKU (configuration)
- For every Azure Region being deployed to:
  - A /29 IP address range for P2P Connections
  - A CIDR Block (used for the HANA Large Instances NAT pool; /24 recommended)
- For every Azure VNet connecting to HANA Large Instances, independent of the Azure region:
  - One or more /28s or /27 IP address ranges (for customer VNet gateway subnet)
  - One or more CIDR blocks (for customer VNet tenant subnet; /24 recommended)
- Data for each of HANA Large Instances system:
  - Desired hostname
  - Desired IP address from the NAT pool
- Azure subscription number for the Azure subscription to which SAP HANA on Azure HANA Large Instances will be directly connected
- SAP HANA SID name for the SAP HANA instance (required to create the necessary SAP HANA-related disk volumes)

After you provide the information, Microsoft provisions SAP HANA on Azure (Large Instances).

Networking setup information is then provided to you for:

- Connecting your Azure VNet(s) to the ExpressRoute circuit that connects Azure VNets to HANA Large Instances
  - For Azure Resource Manager:
     - Authorization key(s)
     - ExpressRoute PeerID
- Accessing HANA Large Instances with the established ExpressRoute circuit and Azure VNet

## Creating an Azure VNet

This Azure VNet should be created using the Azure Resource Manager deployment model. The old Azure deployment model, commonly known as ASM, is not supported for this solution.

The Azure VNet that&#39;s created should have at least one tenant subnet and a gateway subnet. These should be assigned the IP address ranges as specified, and submitted to Microsoft.

> [!IMPORTANT] 
> Only tenant and gateway address blocks should be assigned to the VNet in the Azure subscription. P2P and NAT pool address blocks must be separate from the VNet and Subnet address spaces as they exist outside of the Azure subscription.

Multiple tenant subnets may be used (even utilizing non-contiguous address ranges), but as mentioned previously, these address ranges must be submitted to Microsoft beforehand.

You can use any naming standard you like for these tenant subnets. However, **there must always be one, and only one, gateway subnet for each VNet** that connects to the SAP HANA on Azure (Large Instances) ExpressRoute circuit, and **this gateway subnet must always be named &quot;GatewaySubnet&quot;** to ensure proper placement of the ExpressRoute gateway.

> [!WARNING] 
> It is critical that the gateway subnet always be named &quot;GatewaySubnet&quot;.

The VNet can be created using the Azure Portal, PowerShell, Azure template, or Azure CLI (see [Create a virtual network using the Azure portal](../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)).

## Creating a gateway subnet

Once the Azure VNet is created, an ExpressRoute gateway must be created on the VNet to link the VNet to the ExpressRoute circuit that connects to the customer tenant on the Large Instance stamp.

> [!NOTE] 
> This step can take up to 30 minutes to complete, as the new gateway is created in the designated Azure subscription and then connected to the specified Azure VNet.

If a gateway already exists, check whether it is an ExpressRoute gateway or not. If not, the gateway must be deleted and recreated as an ExpressRoute gateway. If an ExpressRoute gateway is already established, since the Azure VNet is already connected to the ExpressRoute circuit for on-premises connectivity, proceed to the Linking VNets section below.

- Use either the (new) [Azure Portal](https://portal.azure.com/) or PowerShell to create an ExpressRoute VPN gateway connected to your VNet.
  - If you use Azure Portal, add a new **Virtual Network Gateway** and then select **ExpressRoute** as the gateway type.
  - If you chose PowerShell instead, first download and use the latest [Azure PowerShell SDK](https://azure.microsoft.com/downloads/) to ensure an optimal experience. The following commands create an ExpressRoute gateway. The text preceded by a _$_ are user defined variables that need to be updated with your specific information.

```
# These Values should already exist, update to match your environment
$myAzureRegion = "eastus"
$myGroupName = "SAP-East-Coast"
$myVNetName = "VNet01"

# These values are used to create the gateway, update for how you wish the GW components to be named
$myGWName = "VNet01GW"
$myGWConfig = "VNet01GWConfig"
$myGWPIPName = "VNet01GWPIP"
$myGWSku = "HighPerformance" # Supported values for HANA Large Instances are: HighPerformance or UltraPerformance

# These Commands create the Public IP and ExpressRoute Gateway
$vnet = Get-AzureRmVirtualNetwork -Name $myVNetName -ResourceGroupName $myGroupName
$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
New-AzureRmPublicIpAddress -Name $myPIPName -ResourceGroupName $myGroupName `
-Location $myAzureRegion -AllocationMethod Dynamic
$gwpip = Get-AzureRmPublicIpAddress -Name $myPIPName -ResourceGroupName $myGroupName
$gwipconfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name $myGWConfig -SubnetId $subnet.Id `
-PublicIpAddressId $gwpip.Id

New-AzureRmVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName -Location $myAzureRegion `
-IpConfigurations $gwipconfig -GatewayType ExpressRoute `
-GatewaySku $myGWSku -VpnType PolicyBased -EnableBgp $true
```

In this example, HighPerformance gateway SKU was used. Your options are HighPerformance or UltraPerformance—the only gateway SKUs that are supported for SAP HANA on Azure (Large Instances).

## Linking VNets

Now that the Azure VNet has an ExpressRoute gateway, you use the authorization information provided by Microsoft to connect the ExpressRoute gateway to the SAP HANA on Azure (Large Instances) ExpressRoute circuit created for this connectivity. This can only be performed using PowerShell (it is not currently supported through the Azure Portal).

- You do the following for each VNet gateway using a different AuthGUID for each connection. The first two entries shown below come from the information provided by Microsoft. Also, the AuthGUID is specific for every VNet and its gateway.

```
# Populate with information provided by Microsoft Onboarding team
$PeerID = "/subscriptions/9cb43037-9195-4420-a798-f87681a0e380/resourceGroups/Customer-USE-Circuits/providers/Microsoft.Network/expressRouteCircuits/Customer-USE01-5Gb"
$AuthGUID = "76d40466-c458-4d14-adcf-3d1b56d1cd61"

# Your ExpressRoute Gateway Information
$myGroupName = "SAP-East-Coast"
$myGWName = "VNet01GW"
$myGWLocation = "East US"

# Define the name for your connection
$myConnectionName = "VNet01GWConnection"

# Create a new connection between the ER Circuit and your Gateway using the Authorization
$gw = Get-AzureRmVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName
    
New-AzureRmVirtualNetworkGatewayConnection -Name $myConnectionName `
-ResourceGroupName $myGroupName -Location $myGWLocation -VirtualNetworkGateway1 $gw `
-PeerId $PeerID -ConnectionType ExpressRoute -AuthorizationKey $AuthGUID
```

You may need to execute this step more than once if you want to connect the gateway to multiple different ExpressRoute circuits that are associated with your subscription.

## Adding more IP addresses or subnets

Use either the Azure Portal, PowerShell or CLI when adding more IP addresses or subnets.

If you have not yet declared the additional IP address space range with SAP HANA on Azure Service Management, open an Azure support request to get it added. After you receive confirmation, perform the next steps.

To create an additional subnet from the Azure portal, see the article [Create a virtual network using the Azure portal](../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), and to create from PowerShell, see [Create a virtual network using PowerShell](../../virtual-network/virtual-networks-create-vnet-arm-ps.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Adding VNets

After initially connecting one or more Azure VNets, you might want to add additional ones that access SAP HANA on Azure (Large Instances). First, submit an Azure support request, in that request include both the specific information identifying the particular Azure deployment, and the IP address space ranges for the tenant subnet(s) and the gateway subnet(s) of the additional Azure VNets. SAP HANA on Azure Service Management then provides the necessary information you need to connect the additional VNets and ExpressRoute.

Steps to add a new Azure VNet:

1. Complete the first step in the onboarding process, see the _Creating Azure VNet_ section above.
2. Complete the second step in the onboarding process, see the _Creating gateway subnet_ section above.
3. Open an Azure support request with information on the new VNet and request a new Authorization Key to connect your additional VNets to the HANA Large Instance ExpressRoute circuit.
4. Once notified that the authorization is complete, use the Microsoft-provided authorization information to complete the third step in the onboarding process, see the _Linking VNets_ section above.

## Increasing ExpressRoute circuit bandwidth

Consult with SAP HANA on Azure Service Management. If you are advised to increase the bandwidth of the SAP HANA on Azure (Large Instances) ExpressRoute circuit, create an Azure support request. (You can request an increase for a single circuit bandwidth up to a maximum of 10 Gbps.) You then receive notification after the operation is complete; no additional action needed to enable this higher speed in Azure.

## Adding an additional ExpressRoute circuit

Consult with SAP HANA on Azure Service Management, if you are advised that an additional ExpressRoute circuit is needed, make an Azure support request to create a new ExpressRoute circuit (and to get authorization information to connect to it). The address space that will be used on the VNets must be defined before making the request, in order for SAP HANA on Azure Service Management to provide authorization.

Once the new circuit is created and the SAP HANA on Azure Service Management configuration is complete, you will receive notification with the information you need to proceed. Follow the steps provided above for creating and connecting the new VNet to this additional circuit. You will not be able to connect Azure VNets to this additional circuit if they already connected to another ExpressRoute circuit.

## Deleting a subnet

To remove a VNet subnet, either the Azure Portal, PowerShell or CLI can be used. If an address space is removed, SAP HANA on Azure Service Management should be notified about the address space change in order to remove it from the ranges that SAP HANA on Azure (Large Instances) is allowed to communicate with.

While there isn&#39;t yet specific, dedicated Azure.com guidance on removing subnets, the process for removing subnets is the reverse of the process for adding them. See the article Azure portal [Create a virtual network using the Azure portal](../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information on creating subnets.

## Deleting a VNet

Use either the Azure Portal, PowerShell or CLI when deleting a VNet. SAP HANA on Azure Service Management removes the existing authorizations on the SAP HANA on Azure (Large Instances) ExpressRoute circuit and remove the IP address ranges (both the tenant and gateway ranges) for the communication with HANA Large Instances.

Once the VNet has been removed, open an Azure support request to provide the IP address space ranges to be removed.

While there isn&#39;t yet specific, dedicated Azure.com guidance on removing VNets, the process for removing VNets is the reverse of the process for adding them, which is described above. See the articles [Create a virtual network using the Azure portal](../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Create a virtual network using PowerShell](../../virtual-network/virtual-networks-create-vnet-arm-ps.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information on creating VNets.

To ensure everything is removed, delete the following items:

- **For Azure Resource Manager:** The ExpressRoute connection, VNet Gateway, VNet Gateway Public IP and VNet
- **For Classic VM:** The VNet Gateway and VNet

## Deleting an ExpressRoute circuit

To remove an additional SAP HANA on Azure (Large Instances) ExpressRoute circuit, open an Azure support request with SAP HANA on Azure Service Management and request that the circuit be deleted. Within the Azure subscription, you may delete or keep the VNet as necessary. However, you must either delete the connection (if Azure Resource Manager), or unlink the connection (if Classic) between the HANA Large Instances ExpressRoute circuit and the linked VNet gateway.

If you also want to remove a VNet, follow the guidance on Deleting a VNet in the section above.


