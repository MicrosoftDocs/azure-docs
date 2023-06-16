---
title: Troubleshoot Azure NAT Gateway
titleSuffix: Azure Virtual Network
description: Troubleshoot issues with NAT Gateway.
services: virtual-network
author: asudbring
ms.service: nat-gateway
ms.topic: troubleshooting
ms.date: 08/29/2022
ms.author: allensu
---

# Troubleshoot Azure NAT Gateway

This article provides guidance on how to correctly configure your NAT gateway and troubleshoot common configuration and deployment related issues.  

* [NAT gateway configuration basics](#nat-gateway-configuration-basics) 

* [NAT gateway in a failed state](#nat-gateway-in-a-failed-state) 

* [Add or remove NAT gateway](#add-or-remove-nat-gateway) 

* [Add or remove subnet](#add-or-remove-subnet) 

* [Add or remove public IPs](#add-or-remove-public-ip-addresses) 

## NAT gateway configuration basics

Check the following configurations to ensure that NAT gateway can be used to direct traffic outbound:

1. At least one public IP address or one public IP prefix is attached to NAT gateway. At least one public IP address must be associated with the NAT gateway for it to provide outbound connectivity. 

2. At least one subnet is attached to a NAT gateway. You can attach multiple subnets to a NAT gateway for going outbound, but those subnets must exist within the same virtual network. NAT gateway can't span beyond a single virtual network. 

3. No [NSG rules](../virtual-network/network-security-groups-overview.md#outbound) or [UDRs](./troubleshoot-nat-connectivity.md#virtual-appliance-udrs-and-expressroute-override-nat-gateway-for-routing-outbound-traffic) are blocking NAT gateway from directing traffic outbound to the internet.

### How to validate connectivity

[NAT gateway](./nat-overview.md#azure-nat-gateway-basics) supports IPv4 UDP and TCP protocols. ICMP isn't supported and is expected to fail. 

To validate end-to-end connectivity of NAT gateway, follow these steps: 
1. Validate that your [NAT gateway public IP address is being used](./quickstart-create-nat-gateway-portal.md#test-nat-gateway).

2. Conduct TCP connection tests and UDP-specific application layer tests.

3. Look at NSG flow logs to analyze outbound traffic flows from NAT gateway.

Refer to the table below for which tools to use to validate NAT gateway connectivity.

| Operating system | Generic TCP connection test | TCP application layer test | UDP |
|---|---|---|---|
| Linux | nc (generic connection test) | curl (TCP application layer test) | application specific |
| Windows | [PsPing](/sysinternals/downloads/psping) | PowerShell [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest) | application specific |

### How to analyze outbound connectivity

To analyze outbound traffic from NAT gateway, use NSG flow logs. NSG flow logs provide connection information for your virtual machines. The connection information contains the source IP and port and the destination IP and port and the state of the connection. The traffic flow direction and the size of the traffic in number of packets and bytes sent is also logged. The source IP and port specified in the NSG flow log will be that of the virtual machine and not of the NAT gateway.

* To learn more about NSG flow logs, see [NSG flow log overview](../network-watcher/network-watcher-nsg-flow-logging-overview.md).

* For guides on how to enable NSG flow logs, see [Enabling NSG flow logs](../network-watcher/network-watcher-nsg-flow-logging-overview.md#enabling-nsg-flow-logs).

* For guides on how to read NSG flow logs, see [Working with NSG flow logs](../network-watcher/network-watcher-nsg-flow-logging-overview.md#working-with-flow-logs).

## NAT gateway in a failed state

You may experience outbound connectivity failure if your NAT gateway resource is in a failed state. To get your NAT gateway out of a failed state, follow these instructions:

1. Once you identify the resource that is in a failed state, go to [Azure Resource Explorer](https://resources.azure.com/) and identify the resource in this state. 

2. Update the toggle on the right-hand top corner to Read/Write. 

3. Select on Edit for the resource in failed state. 

4. Select on PUT followed by GET to ensure the provisioning state was updated to Succeeded. 

5. You can then proceed with other actions as the resource is out of failed state. 

## Add or remove NAT gateway 

### Can't delete NAT gateway

NAT gateway must be detached from all subnets within a virtual network before the resource can be removed or deleted. See [Remove NAT gateway from an existing subnet and delete the resource](./manage-nat-gateway.md?tabs=manage-nat-portal#remove-a-nat-gateway-from-an-existing-subnet-and-delete-the-resource) for step by step guidance.

## Add or remove subnet 

### NAT gateway can't be attached to subnet already attached to another NAT gateway 

A subnet within a virtual network can't have more than one NAT gateway attached to it for connecting outbound to the internet. An individual NAT gateway resource can be associated to multiple subnets within the same virtual network. NAT gateway can't span beyond a single virtual network. 

### Basic SKU resources can't exist in the same subnet as NAT gateway

NAT gateway isn't compatible with basic resources, such as Basic Load Balancer or Basic Public IP. Basic resources must be placed on a subnet not associated with a NAT Gateway. Basic Load Balancer and Basic Public IP can be upgraded to standard to work with NAT gateway. 

* To upgrade a basic load balancer to standard, see [upgrade from basic public to standard public load balancer](../load-balancer/upgrade-basic-standard.md).

* To upgrade a basic public IP to standard, see [upgrade from basic public to standard public IP](../virtual-network/ip-services/public-ip-upgrade-portal.md).

* To upgrade a basic public IP with an attached VM to standard, see [upgrade a basic public IP with an attached VM](/azure/virtual-network/ip-services/public-ip-upgrade-vm).

### NAT gateway can't be attached to a gateway subnet

NAT gateway can't be deployed in a gateway subnet. A gateway subnet is used by a VPN gateway for sending encrypted traffic between an Azure virtual network and on-premises location. See [VPN gateway overview](../vpn-gateway/vpn-gateway-about-vpngateways.md) to learn more about how gateway subnets are used by VPN gateway.

### Can't attach NAT gateway to a subnet that contains a virtual machine NIC in a failed state

When associating a NAT gateway to a subnet that contains a virtual machine network interface (NIC) in a failed state, you'll receive an error message indicating that this action can't be performed. You must first resolve the VM NIC failed state before you can attach a NAT gateway to the subnet.

To get your virtual machine NIC out of a failed state, you can use one of the two following methods. 

#### Use PowerShell to get your virtual machine NIC out of a failed state

1. Determine the provisioning state of your NICs using the [Get-AzNetworkInterface PowerShell command](/powershell/module/az.network/get-aznetworkinterface#example-2-get-all-network-interfaces-with-a-specific-provisioning-state) and setting the value of the "provisioningState" to "Succeeded".

2. Perform [GET/SET PowerShell commands](/powershell/module/az.network/set-aznetworkinterface#example-1-configure-a-network-interface) on the network interface to update the provisioning state.

3. Check the results of this operation by checking the provisioning state of your NICs again (follow commands from step 1).

#### Use Azure Resource Explorer to get your virtual machine NIC out of a failed state 

1. Go to [Azure Resource Explorer](https://resources.azure.com/) (recommended to use Microsoft Edge browser) 

2. Expand Subscriptions (takes a few seconds for it to appear on the left) 

3. Expand your subscription that contains the VM NIC in the failed state 

4. Expand resourceGroups 

5. Expand the correct resource group that contains the VM NIC in the failed state 

6. Expand providers 

7. Expand Microsoft.Network 

8. Expand networkInterfaces 

9. Select on the NIC that is in the failed provisioning state 

10. Select the Read/Write button at the top 

11. Select the green GET button 

12. Select the blue EDIT button 

13. Select the green PUT button 

14. Select Read Only button at the top 

15. The VM NIC should now be in a succeeded provisioning state, you can close your browser 

## Add or remove public IP addresses

### Can't exceed 16 public IP addresses on NAT gateway 

NAT gateway can't be associated with more than 16 public IP addresses. You can use any combination of public IP addresses and prefixes with NAT gateway up to a total of 16 IP addresses. To add or remove a public IP, see [add or remove a public IP address](/azure/virtual-network/nat-gateway/manage-nat-gateway?tabs=manage-nat-portal#add-or-remove-a-public-ip-address). 

The following IP prefix sizes can be used with NAT gateway: 

* /28 (sixteen addresses) 

* /29 (eight addresses) 

* /30 (four addresses) 

* /31 (two addresses) 

### IPv6 coexistence

[NAT gateway](nat-overview.md) supports IPv4 UDP and TCP protocols. NAT gateway can't be associated to an IPv6 Public IP address or IPv6 Public IP Prefix. NAT gateway can be deployed on a dual stack subnet, but will still only use IPv4 Public IP addresses for directing outbound traffic. Deploy NAT gateway on a dual stack subnet when you need IPv6 resources to exist in the same subnet as IPv4 resources. See [Configure dual stack outbound connectivity with NAT gateway and public Load balancer](/azure/virtual-network/nat-gateway/tutorial-dual-stack-outbound-nat-load-balancer?tabs=dual-stack-outbound-portal) to learn how to provide IPv4 and IPv6 outbound connectivity from your dual stack subnet.

### Can't use basic SKU public IPs with NAT gateway 

NAT gateway is a standard SKU resource and can't be used with basic SKU resources, including basic public IP addresses. You can upgrade your basic SKU public IP address in order to use with your NAT gateway using the following guidance: [Upgrade a public IP address](../virtual-network/ip-services/public-ip-upgrade-portal.md) 

### Can't mismatch zones of public IP addresses and NAT gateway 

NAT gateway is a [zonal resource](./nat-availability-zones.md) and can either be designated to a specific zone or to ‘no zone’. When NAT gateway is placed in ‘no zone’, Azure places the NAT gateway into a zone for you, but you don't have visibility into which zone the NAT gateway is located. 

NAT gateway can be used with public IP addresses designated to a specific zone, no zone, all zones (zone-redundant) depending on its own availability zone configuration. Follow guidance below: 

| NAT gateway availability zone designation | Public IP address / prefix designation that can be used |
|---|---|
| No zone | Zone-redundant, No zone, or Zonal (the public IP zone designation can be any zone within a region in order to work with a no zone NAT gateway) |
| Designated to a specific zone | The public IP address zone must match the zone of the NAT gateway |

>[!NOTE]
>If you need to know the zone that your NAT gateway resides in, make sure to designate it to a specific availability zone. 

## Next steps

We're always looking to improve the experience of our customers. If you're experiencing issues with NAT gateway that aren't listed or resolved by this article, submit feedback through GitHub via the bottom of this page. We'll address your feedback as soon as possible. 

To learn more about NAT gateway, see:

* [Azure NAT Gateway](nat-overview.md)

* [NAT gateway resource](nat-gateway-resource.md)

* [Manage NAT gateway](./manage-nat-gateway.md)

* [Metrics and alerts for NAT gateway resources](nat-metrics.md).
