<properties
   pageTitle="Create a VM with multiple NICs"
   description="Learn how to create and configure vms with multiple nics"
   services="virtual-network, virtual-machines"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor="tysonn"
   tags="azure-service-management,azure-resource-manager"
/>
<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/02/2016"
   ms.author="jdial" />

# Create a VM with multiple NICs

You can create virtual machines (VMs) in Azure and attach multiple network interfaces (NICs) to each of your VMs. Multi NIC is a requirement for many network virtual appliances, such as application delivery and WAN optimization solutions. Multi NIC also provides more network traffic management functionality, including isolation of traffic between a front end NIC and back end NIC(s), or separation of data plane traffic from management plane traffic.

![Multi NIC for VM](./media/virtual-networks-multiple-nics/IC757773.png)

The figure above shows a VM with three NICs, each connected to a different subnet.

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)]

- Internet-facing VIP (classic deployments) is only supported on the "default" NIC. There is only one VIP to the IP of the default NIC.
- At this time, Instance Level Public IP (LPIP) addresses (classic deployments) are not supported for multi NIC VMs.
- The order of the NICs from inside the VM will be random, and could also change across Azure infrastructure updates. However, the IP addresses, and the corresponding ethernet MAC addresses will remain the same. For example, assume **Eth1** has IP address 10.1.0.100 and MAC address 00-0D-3A-B0-39-0D; after an Azure infrastructure update and reboot, it could be changed to **Eth2**, but the IP and MAC pairing will remain the same. When a restart is customer-initiated, the NIC order will remain the same.
- The address for each NIC on each VM must be located in a subnet, multiple NICs on a single VM can each be assigned addresses that are in the same subnet.
- The VM size determines the number of NICS that you can create for a VM. The table below lists the numbers of NICs corresponding to the size of the VMs:

|VM Size (Standard SKUs)|NICs (max allowed per VM)|
|---|---|
|All Basic Sizes|1|
|A0\extra small|1|
|A1\small|1|
|A2\medium|1|
|A3\large|2|
|A4\extra large|4|
|A5|1|
|A6|2|
|A7|4|
|A8|2|
|A9|4|
|A10|2|
|A11|4|
|D1|1|
|D2|2|
|D3|4|
|D4|8|
|D11|2|
|D12|4|
|D13|8|
|D14|8|
|DS1|1|
|DS2|2|
|DS3|4|
|DS4|8|
|DS11|2|
|DS12|4|
|DS13|8|
|DS14|8|
|D1_v2|1|
|D2_v2|2|
|D3_v2|4|
|D4_v2|8|
|D5_v2|8|
|D11_v2|2|
|D12_v2|4|
|D13_v2|8|
|D14_v2|8|
|G1|1|
|G2|2|
|G3|4|
|G4|8|
|G5|8|
|All Other Sizes|1|

## Network Security Groups (NSGs)
In a Resource Manager deployment, any NIC on a VM may be associated with a Network Security Group (NSG), including any NICs on a VM that has multiple NICs enabled. If a NIC is assigned an address within a subnet where the subnet is associated with an NSG, then the rules in the subnet’s NSG also apply to that NIC. In addition to associating subnets with NSGs, you can also associate a NIC with an NSG.

If a subnet is associated with an NSG, and a NIC within that subnet is individually associated with an NSG, the associated NSG rules are applied in **flow order** according to the direction of the traffic being passed into or out of the NIC:

- **Incoming traffic** whose destination is the NIC in question flows first through the subnet, triggering the subnet’s NSG rules, before passing into the NIC, then triggering the NIC’s NSG rules.
- **Outgoing traffic** whose source is the NIC in question flows first out from the NIC, triggering the NIC’s NSG rules, before passing through the subnet, then triggering the subnet’s NSG rules.

Learn more about [Network Security Groups](virtual-networks-nsg.md) and how they are applied based on associations to subnets, VMs, and NICs..

## How to Configure a multi NIC VM in a classic deployment

The instructions below will help you create a multi NIC VM containing 3 NICs: a default NIC and two additional NICs. The configuration steps will create a VM that will be configured according to the service configuration file fragment below:

	<VirtualNetworkSite name="MultiNIC-VNet" Location="North Europe">
	<AddressSpace>
	  <AddressPrefix>10.1.0.0/16</AddressPrefix>
	    </AddressSpace>
	    <Subnets>
	      <Subnet name="Frontend">
	        <AddressPrefix>10.1.0.0/24</AddressPrefix>
	      </Subnet>
	      <Subnet name="Midtier">
	        <AddressPrefix>10.1.1.0/24</AddressPrefix>
	      </Subnet>
	      <Subnet name="Backend">
	        <AddressPrefix>10.1.2.0/23</AddressPrefix>
	      </Subnet>
	      <Subnet name="GatewaySubnet">
	        <AddressPrefix>10.1.200.0/28</AddressPrefix>
	      </Subnet>
	    </Subnets>
	… Skip over the remainder section …
	</VirtualNetworkSite>


You need the following prerequisites before trying to run the PowerShell commands in the example.

- An Azure subscription.
- A configured virtual network. See [Virtual Network Overview](virtual-networks-overview.md) for more information about VNets.
- The latest version of Azure PowerShell downloaded and installed. See [How to install and configure Azure PowerShell](../powershell-install-configure.md).

To create a VM with multiple NICs, follow the steps below:

1. Select a VM image from Azure VM image gallery. Note that images change frequently and are available by region. The image specified in the example below may change or might not be in your region, so be sure to specify the image you need.

		$image = Get-AzureVMImage `
	    	-ImageName "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201410.01-en.us-127GB.vhd"

1. Create a VM configuration.

		$vm = New-AzureVMConfig -Name "MultiNicVM" -InstanceSize "ExtraLarge" `
			-Image $image.ImageName –AvailabilitySetName "MyAVSet"

1. Create the default administrator login.

		Add-AzureProvisioningConfig –VM $vm -Windows -AdminUserName "<YourAdminUID>" `
			-Password "<YourAdminPassword>"

1. Add additional NICs to the VM configuration.

		Add-AzureNetworkInterfaceConfig -Name "Ethernet1" `
			-SubnetName "Midtier" -StaticVNetIPAddress "10.1.1.111" -VM $vm
		Add-AzureNetworkInterfaceConfig -Name "Ethernet2" `
			-SubnetName "Backend" -StaticVNetIPAddress "10.1.2.222" -VM $vm

1. Specify the subnet and IP address for the default NIC.

		Set-AzureSubnet -SubnetNames "Frontend" -VM $vm
		Set-AzureStaticVNetIP -IPAddress "10.1.0.100" -VM $vm

1. Create the VM in your virtual network.

		New-AzureVM -ServiceName "MultiNIC-CS" –VNetName "MultiNIC-VNet" –VMs $vm

>[AZURE.NOTE] The VNet that you specify here must already exist (as mentioned in the prerequisites). The example below specifies a virtual network named **MultiNIC-VNet**.

## Limitations

The following limitations are applicable when using the multi NIC feature:

- Multi NIC VMs must be created in Azure virtual networks (VNets). Non-VNet VMs cannot be configured with Multi NICs.
- All VMs in an availability set need to use either multi NIC or single NIC. There cannot be a mixture of multi NIC VMs and single NIC VMs within an availability set. Same rules apply for VMs in a cloud service.
- A VM with single NIC cannot be configured with multi NICs (and vice-versa) once it is deployed, without deleting and re-creating it.


## Secondary NICs access to other subnets

By default secondary NICs will not be configured with a default gateway, due to which the traffic flow on the secondary NICs will be limited to be within the same subnet. If the users want to enable secondary NICs to talk outside their own subnet, they will need to add an entry in the routing table to configure the gateway as described below.

>[AZURE.NOTE] VMs created before July 2015 may have a default gateway configured for all NICs. The default gateway for secondary NICs will not be removed until these VMs are rebooted. In Operating systems that use the weak host routing model, such as Linux, Internet connectivity can break if the ingress and egress traffic use different NICs.

### Configure Windows VMs

Suppose that you have a Windows VM with two NICs as follows:

- Primary NIC IP address: 192.168.1.4
- Secondary NIC IP address: 192.168.2.5

The IPv4 route table for this VM would look like this:

	IPv4 Route Table
	===========================================================================
	Active Routes:
	Network Destination        Netmask          Gateway       Interface  Metric
	          0.0.0.0          0.0.0.0      192.168.1.1      192.168.1.4      5
	        127.0.0.0        255.0.0.0         On-link         127.0.0.1    306
	        127.0.0.1  255.255.255.255         On-link         127.0.0.1    306
	  127.255.255.255  255.255.255.255         On-link         127.0.0.1    306
	    168.63.129.16  255.255.255.255      192.168.1.1      192.168.1.4      6
	      192.168.1.0    255.255.255.0         On-link       192.168.1.4    261
	      192.168.1.4  255.255.255.255         On-link       192.168.1.4    261
	    192.168.1.255  255.255.255.255         On-link       192.168.1.4    261
	      192.168.2.0    255.255.255.0         On-link       192.168.2.5    261
	      192.168.2.5  255.255.255.255         On-link       192.168.2.5    261
	    192.168.2.255  255.255.255.255         On-link       192.168.2.5    261
	        224.0.0.0        240.0.0.0         On-link         127.0.0.1    306
	        224.0.0.0        240.0.0.0         On-link       192.168.1.4    261
	        224.0.0.0        240.0.0.0         On-link       192.168.2.5    261
	  255.255.255.255  255.255.255.255         On-link         127.0.0.1    306
	  255.255.255.255  255.255.255.255         On-link       192.168.1.4    261
	  255.255.255.255  255.255.255.255         On-link       192.168.2.5    261
	===========================================================================

Notice that the default route (0.0.0.0) is only available to the primary NIC. You will not be able to access resources outside the subnet for the secondary NIC, as seen below:

	C:\Users\Administrator>ping 192.168.1.7 -S 192.165.2.5

	Pinging 192.168.1.7 from 192.165.2.5 with 32 bytes of data:
	PING: transmit failed. General failure.
	PING: transmit failed. General failure.
	PING: transmit failed. General failure.
	PING: transmit failed. General failure.

To add a default route on the secondary NIC, follow the steps below:

1. From a command prompt, run the command below to identify the index number for the secondary NIC:

		C:\Users\Administrator>route print
		===========================================================================
		Interface List
		 29...00 15 17 d9 b1 6d ......Microsoft Virtual Machine Bus Network Adapter #16
		 27...00 15 17 d9 b1 41 ......Microsoft Virtual Machine Bus Network Adapter #14
		  1...........................Software Loopback Interface 1
		 14...00 00 00 00 00 00 00 e0 Teredo Tunneling Pseudo-Interface
		 20...00 00 00 00 00 00 00 e0 Microsoft ISATAP Adapter #2
		===========================================================================

2. Notice the second entry in the table, with an index of 27 (in this example).
3. From the command prompt, run the **route add** command as shown below. In this example, you are specifying 192.168.2.1 as the default gateway for the secondary NIC:

		route ADD -p 0.0.0.0 MASK 0.0.0.0 192.168.2.1 METRIC 5000 IF 27

4. To test connectivity, go back to the command prompt and try to ping a different subnet from the secondary NIC as shown int eh example below:

		C:\Users\Administrator>ping 192.168.1.7 -S 192.165.2.5

		Reply from 192.168.1.7: bytes=32 time<1ms TTL=128
		Reply from 192.168.1.7: bytes=32 time<1ms TTL=128
		Reply from 192.168.1.7: bytes=32 time=2ms TTL=128
		Reply from 192.168.1.7: bytes=32 time<1ms TTL=128

5. You can also check your route table to check the newly added route, as shown below:

		C:\Users\Administrator>route print

		...

		IPv4 Route Table
		===========================================================================
		Active Routes:
		Network Destination        Netmask          Gateway       Interface  Metric
		          0.0.0.0          0.0.0.0      192.168.1.1      192.168.1.4      5
		          0.0.0.0          0.0.0.0      192.168.2.1      192.168.2.5   5005
		        127.0.0.0        255.0.0.0         On-link         127.0.0.1    306

### Configure Linux VMs

For Linux VMs, since the default behavior uses weak host routing, we recommend that the secondary NICs are restricted to traffic flows only within the same subnet. However if certain scenarios demand connectivity outside the subnet, users should enable policy based routing to ensure that the ingress and egress traffic uses the same NIC.

## Next steps

- Deploy [MultiNIC VMs in a 2-tier application scenario in a Resource Manager deployment](virtual-network-deploy-multinic-arm-template.md).
- Deploy [MultiNIC VMs in a 2-tier application scenario in a classic deployment](virtual-network-deploy-multinic-classic-ps.md).
