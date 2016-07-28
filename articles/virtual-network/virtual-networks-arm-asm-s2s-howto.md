<properties 
   pageTitle="How to connect classic VNets to ARM VNets in Azure"
   description="Learn how to create a VPN connection between classic VNets and new VNets"
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/22/2016"
   ms.author="cherylmc" />

# Connecting classic VNets to new VNets

Azure currently has two management modes: Azure Service Manager (referred to as classic), and Azure Resource Manager (ARM). If you have been using Azure for some time, you probably have Azure VMs and instance roles running on a classic VNet. And your newer VMs and role instances may be running on a VNet created in ARM.

In such situations, you will want to ensure the new infrastructure is able to communicate with your classic resources. You can do so by creating a VPN connection between the two VNets. 

In this article, you will learn how to create a site-to-site (S2S) VPN connection between a classic VNet and an ARM VNet.

>[AZURE.NOTE] This article assumes you already have classic VNets, and ARM VNets, and that you are familiar with configuring a S2S VPN connection for classic VNets. For a detailed end-to-end solution on S2S VPN connectivity between classic and ARM VNets, visit [Solution Guide - Connect a classic VNet to and ARM VNet by using a S2S VPN](virtual-networks-arm-asm-s2s.md).

You can see an overview of tasks to be done to create a S2S VPN connection between a classic VNet and an ARM VNet by using Azure gateways below.

1 - [Create a VPN gateway for the classic VNet](#Step-1:-Create-a-VPN-gateway-for-the-classic-VNet)

2 - [Create a VPN gateway for the ARM VNet](#Step-2:-Create-a-VPN-gateway-for-the-ARM-VNet)

3 - [Create a connection between the gateways](#Step-3:-Create-a-connection-between-the-gateways)

## Step 1: Create a VPN gateway for the classic VNet

To create the VPN gateway for the classic VNet, follow the instructions below.

1. Open the classic portal from https://manage.windowsazure.com, and enter your credentials, if necessary.
2. On the bottom left hand corner of the screen, click on the **NEW** button, then click **NETWORK SERVICES**, then click **VIRTUAL NETWORKS**, and then click **ADD LOCAL NETWORK**.
3. In the **Specify your local network details** window, type a name for the ARM VNet you want to connect to, and then on the bottom right hand corner of the window, click on the arrow button.
3. In the address space **STARTING IP** text box, type the network prefix for the ARM VNet you want to connect to. 
4. In the **CIDR (ADDRESS COUNT)** drop down, select the number of bits used for the network portion of the CIDR block used by the ARM VNet you want to connect to.
5. In **VPN DEVICE IP ADDRESS (OPTIONAL)**, type any valid public IP address. We will change this IP address later. Then click on the checkmark button on the bottom right of the screen. The figure below shows sample settings for this page.

	![Local netowrk settings](.\media\virtual-networks-arm-asm-s2s-howto\figurex1.png)

5. On the **networks** page, click on **VIRTUAL NETWORKS**, then click on your classic VNet, and then click on **CONFIGURE**.
6. Under **site-to-site connectivity** enable the **connect to the local network** checkbox.
7. Select the local network you created in step 4 from the list of available networks from the **LOCAL NETWORK** drop down, and then click **SAVE**.
8. Once the settings are saved, click on **DASHBOARD**, then on the bottom of the page, click **CREATE GATEWAY**, then click **DYNAMIC ROUTING**, and then click **YES**.
9. Wait for the gateway to be created and copy its public IP address. You will need it to setup the gateway in the ARM VNet.

## Step 2: Create a VPN gateway for the ARM VNet

To create a VPN gateway for the ARM VNet, follow the instructions below.

1. From a PowerShell console, create a local network by running the command below. The local network must use the CIDR block of the classic VNet you want to connect to, and the public IP address of the gateway created in step 1 above.

		New-AzureRmLocalNetworkGateway -Name VNetClassicNetwork `
			-Location "East US" -AddressPrefix "10.0.0.0/20" `
			-GatewayIpAddress "168.62.190.190" -ResourceGroupName RG1

3. Create a public IP address for the gateway by running the command below.

		$ipaddress = New-AzureRmPublicIpAddress -Name gatewaypubIP `
			-ResourceGroupName RG1 -Location "East US" `
			-AllocationMethod Dynamic

4. Retrieve the subnet used for the gateway by running the command below.

		$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name GatewaySubnet `
			-VirtualNetwork (Get-AzureRMVirtualNetwork -Name VNetARM -ResourceGroupName RG1) 

	>[AZURE.IMPORTANT] The gateway subnet must already exist, and it must be named GatewaySubnet.

5. Create an IP configuration object for the gateway by running the command below. Notice the id for a gateway subnet. That subnet must exist in the VNet.

		$ipconfig = New-AzureRmVirtualNetworkGatewayIpConfig `
			-Name ipconfig -PrivateIpAddress 10.1.2.4 `
			-SubnetId $subnet.id -PublicIpAddressId $ipaddress.id

	>[AZURE.IMPORTANT] The *SubnetId* and *PublicIpAddressId* parameters must be passed the id property from the subnet, and IP adress objects, repectively. You cannot use a simple string.
	
5. Create the ARM VNet gateway by running the command below.

		New-AzureRmVirtualNetworkGateway -Name v1v2Gateway -ResourceGroupName RG1 `
			-Location "East US" -GatewaySKU Standard -GatewayType Vpn -IpConfigurations $ipconfig `
			-EnableBgp $false -VpnType RouteBased

6. Once the VPN gateway is created, retrieve its public IP address by running the command below. Copy the IP address, you will need it to configure the local network for the classic VNet.

		Get-AzureRmPublicIpAddress -Name gatewaypubIP -ResourceGroupName RG1

## Step 3: Create a connection between the gateways

1. Open the classic portal from https://manage.windowsazure.com, and enter your credentials, if necessary.
2. In the classic portal, scroll down and click **NETWORKS**, then click **LOCAL NETWORKS**, then click the ARM VNet you want to connect to, and then click on the **EDIT** button.
3. In **VPN DEVICE IP ADDRESS (OPTIONAL)**, type the IP address for the ARM VNet gateway retrieve in step 2 above, then click the right arrow on teh bottom right hand corner, and then click the checkmark button.
4. From a PowerShell console, setup a shared key by running the command below. Make sure you change the names of the VNets to the your own VNet names.

		Set-AzureVNetGatewayKey -VNetName VNetClassic `
			-LocalNetworkSiteName VNetARM -SharedKey abc123

7. Create the VPN connection by running the commands below.

		$vnet01gateway = Get-AzureRmLocalNetworkGateway -Name VNetClassic -ResourceGroupName RG1
		$vnet02gateway = Get-AzureRmVirtualNetworkGateway -Name v1v2Gateway -ResourceGroupName RG1
		
		New-AzureRmVirtualNetworkGatewayConnection -Name arm-asm-s2s-connection `
			-ResourceGroupName RG1 -Location "East US" -VirtualNetworkGateway1 $vnet02gateway `
			-LocalNetworkGateway2 $vnet01gateway -ConnectionType IPsec `
			-RoutingWeight 10 -SharedKey 'abc123'

## Next Steps

- Learn more about [the Network Resource Provider (NRP) for ARM](resource-groups-networking.md).
- Create an [end-to-end solution connecting a classic VNet to an ARM VNet by using a S2S VPN](virtual-networks-arm-asm-s2s.md).
