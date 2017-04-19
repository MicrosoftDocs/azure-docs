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
ms.custom: H1Hack27Feb2017

---
# SAP HANA (large instances) infrastructure and connectivity on Azure 

After the purchase of SAP HANA on Azure (Large Instances) is finalized between you and the Microsoft enterprise account team, the following information is required by Microsoft:

- Customer name
- Business contact information (including e-mail address and phone number)
- Technical contact information (including e-mail address and phone number)
- Technical networking contact information (including e-mail address and phone number)
- Azure deployment region (West US or East US as of September 2016)
- Confirm SAP HANA on Azure (Large Instances) SKU (configuration)
- As already detailed in the Overview and Architecture document for HANA Large Instances, for every Azure Region being deployed to:
  - A /29 IP address range for ER-P2P Connections that connect Azure VNets to HANA Large Instances
  - A /24 CIDR Block used for the HANA Large Instances Server IP Pool
- ng: NAms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/01/2016
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# SAP HANA (large instances) infrastructure and connectivity on Azure 

After the purchase of SAP HANA on Azure (Large Instances) is finalized between you and the Microsoft enterprise account team, the following information is required by Microsoft:

- Customer name
- Business contact information (including e-mail address and phone number)
- Technical contact information (including e-mail address and phone number)
- Technical networking contact information (including e-mail address and phone number)
- Azure deployment region (West US or East US as of September 2016)
- Confirm SAP HANA on Azure (Large Instances) SKU (configuration)
- As already detailed in the Overview and Architecture document for HANA Large Instances, for every Azure Region being deployed to:
  - A /29 IP address range for ER-P2P Connections that connect Azure VNets to HANA Large Instances
  - A /24 CIDR Block used for the HANA Large Instances Server IP Pool
- The IP address range values used in the VNet Address Space attribute of every Azure VNet that will connect to the HLI
- Data for each of HANA Large Instances system:
  - Desired hostname
  - Desired IP address for the HANA Large Instance unit out of the Server IP Pool address range - Please keep in mind that the first 30 IP addresses in the Server IP Pool address range are reserved for internal usage within HANA Large Instances
  - SAP HANA SID name for the SAP HANA instance (required to create the necessary SAP HANA-related disk volumes)
  - The groupid the hana-sidadm user has in the Linux OS is required to create the necessary SAP HANA-related disk volumes. The SAP HANA installation usually creates the sapsys group with a group id of 1001. the hana-sidadm user is part of that group
  - The userid the hana-sidadm user has in the Linux OS is required to create the necessary SAP HANA-related disk volumes.
- Azure subscription ID for the Azure subscription to which SAP HANA on Azure HANA Large Instances will be directly connected

After you provide the information, Microsoft provisions SAP HANA on Azure (Large Instances) and will return the information necessary to link your Azure VNets to HANA Large Instances and to access the HANA Large Instance units.



## Connecting Azure VMs to HANA Large Instances

As already mentioned in [SAP HANA (large instances) overview and architecture on Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/hana-overview-architecture) the minimal deployment of HANA Large Instances with the SAP application layer in Azure looks like:

![Azure VNet connected to SAP HANA on Azure (Large Instances) and on-premises](./media/hana-overview-architecture/image3-on-premises-infrastructure.png)

Looking closer on the Azure VNet side, we realize the need for:

- The definition of an Azure VNet that will be used to deploy the VMs of the SAP application layer into.
- That automatically means that a default subnet in the Azure Vnet is defined that is really the one used to deploy the VMs into.
- The Azure VNet that&#39;s created needs to have at least one VM subnet and one ExpressRoute Gateway subnet. These should be assigned the IP address ranges as specified and discussed below.

Therefore let's look a bit closer into the Azure VNet creation for HANA Large Instances

### Creating the Azure VNet for HANA Large Instances

>[!Note]
>The Azure VNet for HANA Large Instance must be created using the Azure Resource Manager deployment model. The old Azure deployment model, commonly known as ASM, is not supported with the HANA Large Instance solution.

The VNet can be created using the Azure Portal, PowerShell, Azure template, or Azure CLI (see [Create a virtual network using the Azure portal](../../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). In the example following we look into a VNet created through Azure Portal.

If we look into the definitions of an Azure VNet through the Azure Portal, let's look into some of the definitions and how those relate to what we list below. As we are talking about the **Address Space** we mean the address space that the Azure VNet is allowed to use. This is also the address range that the VNet will use for BGP route propagation. This **Address Space** can be seen here:

![Address Space of Azure VNet displayed in the Azure Portal](./media/hana-overview-connectivity/image1-azure-vnet-address-space.png)

In the case above, with 10.16.0.0/16, the Azure VNet was given a rather large and wide IP address range to use. Means all the IP address ranges of subsequent subnets within this VNet can have their ranges within that 'Address Space'. Usually we are not recommending such a large address range for single VNet in Azure. But getting a step further, let's look into the subnets defined in the Azure VNet:

![Azure VNet Subnets and their IP address ranges](./media/hana-overview-connectivity/image2-vnet-subnets.png)

As you can see we look at a VNet with a first VM subnet (here called 'tenant') and a subnet called 'GatewaySubnet'.
In the following section we refer to the IP address range of the subnet which was called tenant in the graphics as **Azure VM subnet IP address range**. In the following sections, we refer to the IP address range of the Gateway Subnet as **VNet Gateway Subnet IP address range**. 

In the case demonstrated by the two graphics above, you see that the **VNet Address Space** covers both, the **Azure VM subnet IP address range** and the **VNet Gateway Subnet IP address range**. 

In other cases where you as a customer need to household with IP address ranges, you want to restrict the **VNet Address Space** of a VNet to what really is being used. For that case, you can define the **VNet Address Space** of a VNet out of different ranges as shown here:

![Azure VNet Address Space with two spaces](./media/hana-overview-connectivity/image3-azure-vnet-address-space_alternate.png)

In this case the **VNet Address Space** has two spaces defined. These are exactly equivalent to the IP address ranges defined for **Azure VM subnet IP address range** and the **VNet Gateway Subnet IP address range**.

You can use any naming standard you like for these tenant subnets (VM subnets). However, **there must always be one, and only one, gateway subnet for each VNet** that connects to the SAP HANA on Azure (Large Instances) ExpressRoute circuit, and **this gateway subnet must always be named &quot;GatewaySubnet&quot;** to ensure proper placement of the ExpressRoute gateway.

> [!WARNING] 
> It is critical that the gateway subnet always be named &quot;GatewaySubnet&quot;.

Multiple VM subnets may be used, even utilizing non-contiguous address ranges. But as mentioned previously, these address ranges must be covered by the **VNet Address Space** of the VNet either in aggregated form or in a list of the exact ranges of the VM subnets and the gateway subnet.

Summarizing the important fact about an Azure VNet that connects to HANA Large Instances:

- You will need to submit to Microsoft the **VNet Address Space** when performing an initial deployment of HANA Large Instances. 
- The **VNet Address Space** can be one larger range that covers the range for Azure VM subnet IP address range(s) and the VNet Gateway Subnet IP address range.
- Or you can submit as **VNet Address Space** multiple ranges that cover the different IP address ranges of VM subnet IP address range(s) and the VNet Gateway Subnet IP address range.
- The defined **VNet Address Space** is used BGP routing propagation.
- The name of the Gateway subnet must be: **&quot;GatewaySubnet&quot;**.
- The **VNet Address Space** is used as a filter on the HANA Large Instance side to allow or disallow traffic to the HANA Large Instance units from Azure. If the BGP routing information of the Azure VNet and the IP address ranges configured for filtering on the HANA Large Instance side do not match, issues in connectivity do arise.
- There are some details about the Gateway subnet that are discussed further down in Section 'Connecting a VNet to HANA Large Instance ExpressRoute'



### Different IP address ranges to be defined 

We already introduced some of the IP address ranges necessary to deploy HANA Large Instances above. But there are some more IP address ranges which are important. Let's go through some further details. The following IP addresses of which not all need to be submitted to Microsoft need to be defined, before sending a request for initial deployment:

**VNet Address Space:** This IP address range, as we discussed above already, is the one you have assigned (or plan to assign) to your address space parameter in the Azure Virtual Network(s) (VNet) connecting to the SAP HANA Large Instance environment. It is recommended that this Address Space parameter is a multi-line value comprised of the Azure VM Subnet range(s) and the Azure Gateway subnet range as shown in the graphics above. This range must NOT overlap with your on-premise or Server IP Pool or ER-P2P address ranges. How to get this? Your corporate network team or service provider should provide an IP Address Range which is not used inside your network. Example: If your Azure VM Subnet (see above) is 10.0.1.0/24, and your Azure Gateway Subnet (see below) is 10.0.2.0/28, then your Azure VNet Address Space is recommended to be two lines; 10.0.1.0/24 and 10.0.2.0/28. Although the Address Space values can be aggregated it is recommend to match them to the subnet ranges to avoid accidental overuse in the future elsewhere in your network. **This is an IP address range which needs to be submitted to Microsoft when asking for an initial deployment**

**Azure VM subnet IP address range:** This IP address range, as discussed above already, is the one you have assigned (or plan to assign) to the Azure VNet subnet parameter in your Azure VNET connecting to the SAP HANA Large Instance environment. This IP address range is used to assign IP addresses to your Azure VMs. This range will be allowed to connect to your SAP HANA Large Instance servers. If needed, multiple Azure VM subnets may be used. A /24 CIDR block is recommended by Microsoft for each Azure VM Subnet. This address range must be a part of the values used in the Azure VNet IP address range or Address Space values that you need to submit to Microsoft. How to get this? Your corporate network team or service provider should provide an IP Address Range which is not currently used inside your network.

- **VNet Gateway Subnet IP address range:** Depending on your features you plan to use, the recommended size would be:
   - Ultra-performance ER gateway: /26 address block
   - Co-existence with VPN and ER using a High-performance ER Gateway (or smaller): /27 address block
   - All other situations: /28 address block. This address range must be a part of the values used in the “VNet Address Space” values. This address range must be a part of the values used in the Azure VNet IP address range or Address Space values that you need to submit to Microsoft. How to get this? Your corporate network team or service provider should provide an IP Address Range which is not currently used inside your network. 

- **Address range for ER-P2P connectivity:** This is the IP range for your SAP HANA Large Instance ExpressRoute (ER) P2P connection. This range of IP addresses must be a /29 CIDR IP address range. This range must NOT overlap with your on-premise or other Azure IP addresses. This is used to setup the ER connectivity from your Azure VNet ER Gateway to the SAP HANA Large Instance servers. How to get this? Your corporate network team or service provider should provide an IP Address Range which is not currently used inside your network. **This is an IP address range which needs to be submitted to Microsoft when asking for an initial deployment**
  
- **Server IP Pool Address Range:** This IP address range is used to assign the individual IP address to HANA large instance servers. The recommended subnet size is a /24 CIDR block - but if needed it can be smaller to a minimum of providing 64 IP addresses. From this range, the first 30 IP addresses will be reserved for use by Microsoft, ensure this is accounted for when choosing the size of the range. This range must NOT overlap with your on-premise or other Azure IP addresses. How to get this? Your corporate network team or service provider should provide an IP Address Range which is not currently used inside your network. A /24 (recommended) unique CIDR block to be used for assigning the specific IP addresses needed for SAP HANA on Azure (Large Instances). **This is an IP address range which needs to be submitted to Microsoft when asking for an initial deployment**
 
Though you need to define and plan the IP address ranges above, not all them need to be transmitted to Microsoft. To summarize the above, the IP address ranges required by Microsoft are:

- Azure VNet IP Address Range/VNet Address Space
- Address range for ER-P2P connectivity
- Server IP Pool Address Range

Adding new, additional VNets that need to connect to HANA Large Instances, requires you to submit a new Azure VNet IP Address Range/VNet Address Space. 

Below an example of the different ranges and some example ranges as you need to configure and eventually provide to Microsoft. As you can see, the values for the Azure VNet IP Address Range/VNet Address Space did not get aggregated in the first example, but is defined on the Azure side out of the ranges of the first Azure VM subnet IP address range and the VNet Gateway Subnet IP address range. Using multiple VM subnets within the Azure VNet would work accordingly by configuring and submitting the additional IP address ranges of the additional VM subnet(s) as part of the Azure VNet IP Address Range/VNet Address Space.

![IP address ranges required in SAP HANA on Azure (Large Instances) minimal deployment](./media/hana-overview-connectivity/image4b-ip-addres-ranges-necessary.png)

You also have the possibility of aggregating the data you submit to Microsoft. In that case the Address Space of the Azure VNet only would include one space. Using the IP address ranges used in the example above. This could look like:

![Second possibility of IP address ranges required in SAP HANA on Azure (Large Instances) minimal deployment](./media/hana-overview-connectivity/image5b-ip-addres-ranges-necessary-one-value.png)

As you can see above, instead of two smaller ranges that defined the address space of the Azure VNet, we have one larger range that covers 4096 IP addresses. As you also see out of the definition of the Address Space of the VNet, you leave some rather large ranges unused. As mentioned before the VNet, no matter whether you use the complete range or not for subnets, will use this large IP Address Space for BGP routing propagation. Use some ranges that are not used within this VNet to assign for other subnets in other Azure VNets or on-premise can cause routing issues.
 
> [!IMPORTANT] 
> Each IP address range of ER-P2P, Server IP Pool, Azure VNet IP Address Range/VNet Address Space must **NOT** overlap with each other range or any other range used somewhere else; each must be discrete and as the two graphics above show not a subnet of any other range. If overlaps occur between ranges, the Azure VNet may not connect to the ExpressRoute circuit.

### Next steps after the ranges have been decided and checked
After the IP address ranges got all figured out and checked the following activity needs to happen:

1. You submit the IP address ranges for Azure VNet IP Address Range/VNet Address Space, Address range for ER-P2P connectivity and Server IP Pool Address Range to Microsoft, together with other data that has been listed at the beginning of the document. At this point in time you also could start to create the VNet and the VM Subnets. 
2. An Express Route circuit is created by Microsoft between your Azure subscription and the Large Instance stamp.
3. A network tenant is created on the Large Instance stamp by Microsoft.
4. Microsoft will configure networking in the SAP HANA on Azure (Large Instances) infrastructure to accept IP addresses from your Azure VNet IP Address Range/VNet Address Space, that will communicate with HANA Large Instances.
5. Depending on the specific SAP HANA on Azure (Large Instances) SKU purchased, Microsoft will assign a compute unit in a tenant network, allocate and mount storage, and install the operating system (SUSE or RedHat Linux). IP addresses for these units are taken out of the Server IP Pool address Range you submitted to Microsoft.

At the end of the deployment process, Microsoft delivers the following data to you:
- Data to connect your Azure VNet(s) to the ExpressRoute circuit that connects Azure VNets to HANA Large Instances
     - Authorization key(s)
     - ExpressRoute PeerID
- Data to access HANA Large Instances with the established ExpressRoute circuit and Azure VNet


## Connecting a VNet to HANA Large Instance ExpressRoute

As you defined all the IP address ranges and now got the data back from Microsoft, you can start connecting the VNet you created before to HANA Large Instances. Once the Azure VNet is created, an ExpressRoute gateway must be created on the VNet to link the VNet to the ExpressRoute circuit that connects to the customer tenant on the Large Instance stamp.

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
New-AzureRmPublicIpAddress -Name $myGWPIPName -ResourceGroupName $myGroupName `
-Location $myAzureRegion -AllocationMethod Dynamic
$gwpip = Get-AzureRmPublicIpAddress -Name $myGWPIPName -ResourceGroupName $myGroupName
$gwipconfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name $myGWConfig -SubnetId $subnet.Id `
-PublicIpAddressId $gwpip.Id

New-AzureRmVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName -Location $myAzureRegion `
-IpConfigurations $gwipconfig -GatewayType ExpressRoute `
-GatewaySku $myGWSku -VpnType PolicyBased -EnableBgp $true
```

In this example, the HighPerformance gateway SKU was used. Your options are HighPerformance or UltraPerformance as the only gateway SKUs that are supported for SAP HANA on Azure (Large Instances).

### Linking VNets

Now that the Azure VNet has an ExpressRoute gateway, you use the authorization information provided by Microsoft to connect the ExpressRoute gateway to the SAP HANA on Azure (Large Instances) ExpressRoute circuit created for this connectivity. This can only be performed using PowerShell (it is not currently supported through the Azure Portal).

- You do the following for each VNet gateway using a different AuthGUID for each connection. The first two entries shown below come from the information provided by Microsoft. Also, the AuthGUID is specific for every VNet and its gateway. Means you need to get another AuthID for your ExpressRoute circuit that connects HANA Large Instances into Azure if you want to add another Azure VNet. 

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

You may need to execute this step more than once if you want to connect the gateway to multiple different ExpressRoute circuits that are associated with your subscription. E.g. you likely need to connect the same VNet Gateway to your ExpressRoute circuit that connects the VNet to your on-premise network.

## Adding more IP addresses or subnets

Use either the Azure Portal, PowerShell or CLI when adding more IP addresses or subnets.

In this case the recommendation is to add the new IP address range as new range to the Azure VNet IP address range or Address Space instead of generating a new aggregated range. In either case, you need to submit this change to Microsoft to allow connectivity out of that new IP address range to the HANA Large Instance units in your client. You can open an Azure support request to get it added. After you receive confirmation, perform the next steps.

To create an additional subnet from the Azure portal, see the article [Create a virtual network using the Azure portal](../../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), and to create from PowerShell, see [Create a virtual network using PowerShell](../../../virtual-network/virtual-networks-create-vnet-arm-ps.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Adding VNets

After initially connecting one or more Azure VNets, you might want to add additional ones that access SAP HANA on Azure (Large Instances). First, submit an Azure support request, in that request include both the specific information identifying the particular Azure deployment, and the IP address space range(s) of the Azure VNet IP address range/Azure VNet Address Space. SAP HANA on Azure Service Management then provides the necessary information you need to connect the additional VNets and ExpressRoute. Usually for every Vnet you get a new Authorization Key for the ExpressRoute Circuit to HANA Large Instances. That new Authorization Key would be used in concjunction with the ExpressRoute Peer ID you got initially to connect the new VNet.

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

To remove a VNet subnet, either the Azure Portal, PowerShell or CLI can be used. In case your Azure VNet IP address range/Azure VNet Address Space was an aggregated range, there is no follow up for you with Microsoft. Except that you need to be aware that the VNet is still propagating BGP route address space that includes the deleted subnet. If you defined the Azure VNet IP address range/Azure VNet Address Space as multiple IP address ranges of which one was assigned to your deleted subnet, you should delete that out of your VNet Address Space and subsequently inform  SAP HANA on Azure Service Management to remove it from the ranges that SAP HANA on Azure (Large Instances) is allowed to communicate with.

While there isn&#39;t yet specific, dedicated Azure.com guidance on removing subnets, the process for removing subnets is the reverse of the process for adding them. See the article Azure portal [Create a virtual network using the Azure portal](../../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information on creating subnets.

## Deleting a VNet

Use either the Azure Portal, PowerShell or CLI when deleting a VNet. SAP HANA on Azure Service Management removes the existing authorizations on the SAP HANA on Azure (Large Instances) ExpressRoute circuit and remove the Azure VNet IP address range/Azure VNet Address Space for the communication with HANA Large Instances.

Once the VNet has been removed, open an Azure support request to provide the IP address space range(s) to be removed.

While there isn&#39;t yet specific, dedicated Azure.com guidance on removing VNets, the process for removing VNets is the reverse of the process for adding them, which is described above. See the articles [Create a virtual network using the Azure portal](../../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Create a virtual network using PowerShell](../../../virtual-network/virtual-networks-create-vnet-arm-ps.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information on creating VNets.

To ensure everything is removed, delete the following items:

- **For Azure Resource Manager:** The ExpressRoute connection, VNet Gateway, VNet Gateway Public IP and VNet

## Deleting an ExpressRoute circuit

To remove an additional SAP HANA on Azure (Large Instances) ExpressRoute circuit, open an Azure support request with SAP HANA on Azure Service Management and request that the circuit be deleted. Within the Azure subscription, you may delete or keep the VNet as necessary. However, you must delete the connection between the HANA Large Instances ExpressRoute circuit and the linked VNet gateway.

If you also want to remove a VNet, follow the guidance on Deleting a VNet in the section above.


