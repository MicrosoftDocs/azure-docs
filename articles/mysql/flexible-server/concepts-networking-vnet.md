---
title: Private Network Access overview - Azure Database for MySQL Flexible Server
description: Learn about private access networking option in the Flexible Server deployment option for Azure Database for MySQL
author: Madhusoodanan
ms.author: dimadhus
ms.service: mysql
ms.topic: conceptual
ms.date: 8/6/2021
---

# Private Network Access for Azure Database for MySQL - Flexible Server (Preview)

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes the private connectivity option for Azure MySQL Flexible Server. You will learn in detail the vitrual network concepts for Azure Database for MySQL Flexible server to create a server securely in Azure.

> [!IMPORTANT]
> Azure Database for MySQL - Flexible server is in preview.

## Private access (VNet Integration)

Private access with virtual network (vnet) integration provides private and secure communication for your MySQL flexible server.

:::image type="content" source="./media/concepts-networking/vnet-diagram.png" alt-text="Flexible server MySQL VNET":::

In the above diagram,
1. Flexible servers are injected into a delegated subnet - 10.0.1.0/24 of VNET **VNet-1**.
2. Applications that are deployed on different subnets within the same vnet can access the Flexible servers directly.
3. Applications that are deployed on a different VNET **VNet-2** do not have direct access to flexible servers. You have to perform [private DNS zone VNET peering](#private-dns-zone-and-vnet-peering) before they can access the flexible server.

### Virtual network concepts

Here are some concepts to be familiar with when using virtual networks with MySQL flexible servers.

* **Virtual network** - 
   An Azure Virtual Network (VNet) contains a private IP address space that is configured for your use. Visit the [Azure Virtual Network overview](../../virtual-network/virtual-networks-overview.md) to learn more about Azure virtual networking.

    Your virtual network must be in the same Azure region as your flexible server.

* **Delegated subnet** - 
   A virtual network contains subnets (sub-networks). Subnets enable you to segment your virtual network into smaller address spaces. Azure resources are deployed into specific subnets within a virtual network. 

   Your MySQL flexible server must be in a subnet that is **delegated** for MySQL flexible server use only. This delegation means that only Azure Database for MySQL Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet. You delegate a subnet by assigning its delegation property as Microsoft.DBforMySQL/flexibleServers.

* **Network security groups (NSG)**
   Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. Review the [network security group overview](../../virtual-network/network-security-groups-overview.md) for more information.

* **Private DNS zone integration** - 
   Azure private DNS zone integration allows you to resolve the private DNS within the current VNET or any in-region peered VNET where the private DNS Zone is linked. 

* **Virtual network peering**
   Virtual network peering enables you to seamlessly connect two or more Virtual Networks in Azure. The peered virtual networks appear as one for connectivity purposes. The traffic between virtual machines in peered virtual networks uses the Microsoft backbone infrastructure. The traffic between client application and flexible server in peered VNets is routed through Microsoft's private network only and is isolated to that network only.

### Using Private DNS Zone

* If you use the Azure portal or the Azure CLI to create flexible servers with VNET, a new private DNS zone is auto-provisioned per server in your subscription using the server name provided. Alternatively, if you want to setup your own private DNS zone to use with the flexible server, please see the [private DNS overview](../../dns/private-dns-overview.md) documentation. 
* If you use Azure API, an Azure Resource Manager template (ARM template), or Terraform, please create private DNS zones that end with `mysql.database.azure.com` and use them while configuring flexible servers with private access. For more information, see the [private DNS zone overview](../../dns/private-dns-overview.md).

   > [!IMPORTANT]
   > Private DNS zone names must end with `mysql.database.azure.com`.

Learn how to create a flexible server with private access (VNet integration) in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).

### Integration with custom DNS server

If you are using the custom DNS server then you must use a DNS forwarder to resolve the FQDN of Azure Database for MySQL - Flexible Server. The forwarder IP address should be [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md). The custom DNS server should be inside the VNet or reachable via the VNET's DNS Server setting. Refer to [name resolution that uses your own DNS server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) to learn more.

### Private DNS zone and VNET peering

Private DNS zone settings and VNET peering are independent of each other. Please refer to the [Using Private DNS Zone](concepts-networking-vnet.md#using-private-dns-zone) section above for more details on creating and using Private DNS zones. 

If you want to connect to the flexible server from a client that is provisioned in another VNET from the same region or a different region, you have to link the private DNS zone with the VNET. See [how to link the virtual network](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network) documentation.

> [!NOTE]
> Private DNS zone names that end with `mysql.database.azure.com` can only be linked.

### Connecting from on-premises to flexible server in Virtual Network using ExpressRoute or VPN

For workloads requiring access to flexible server in virtual network from on-premises network, you will require [ExpressRoute](/azure/architecture/reference-architectures/hybrid-networking/expressroute/) or [VPN](/azure/architecture/reference-architectures/hybrid-networking/vpn/) and virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/). With this setup in place, you will require a DNS forwarder to resolve the flexible servername if you would like to connect from client application (like MySQL Workbench) running on on-premises virtual network. This DNS forwarder is responsible for resolving all the DNS queries via a server-level forwarder to the Azure-provided DNS service [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md).

To configure properly, you need the following resources:

- On-premises network
- MySQL Flexible Server provisioned with private access (VNet integration)
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- Use DNS forwarder [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md) deployed in Azure

You can then use the flexible servername (FQDN) to connect from the client application in peered virtual network or on-premises network to flexible server.

### Unsupported virtual network scenarios

* Public endpoint (or public IP or DNS) - A flexible server deployed to a virtual network cannot have a public endpoint
* After the flexible server is deployed to a virtual network and subnet, you cannot move it to another virtual network or subnet. You cannot move the virtual network into another resource group or subscription.
* Subnet size (address spaces) cannot be increased once resources exist in the subnet
* Flexible server doesn't support Private Link. Instead, it uses VNet injection to make flexible server available within a VNet. 

> [!NOTE]
> If you are using the custom DNS server then you must use a DNS forwarder to resolve the FQDN of Azure Database for MySQL - Flexible Server. Refer to [name resolution that uses your own DNS server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) to learn more.


## Next steps
* Learn how to enable private access (vnet integration) using the [Azure portal](how-to-manage-virtual-network-portal.md) or [Azure CLI](how-to-manage-virtual-network-cli.md)
* Learn how to [use TLS](how-to-connect-tls-ssl.md)
