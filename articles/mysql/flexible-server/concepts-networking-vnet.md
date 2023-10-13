---
title: Private Network Access overview - Azure Database for MySQL - Flexible Server
description: Learn about private access networking option in the Flexible Server deployment option for Azure Database for MySQL
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 11/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Private Network Access for Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes the private connectivity option for Azure MySQL Flexible Server. You learn in detail the virtual network concepts for Azure Database for MySQL - Flexible Server to create a server securely in Azure.

## Private access (VNet Integration)

[Azure Virtual Network (VNet)](../../virtual-network/virtual-networks-overview.md) is the fundamental building block for your private network in Azure. Virtual Network (VNet) integration with Azure Database for MySQL - Flexible Server brings Azure's benefits of network security and isolation.

Virtual Network (VNet) integration for an Azure Database for MySQL - Flexible Server enables you to lock down access to the server to only your virtual network infrastructure. Your virtual network(VNet) can include all your application and database resources in a single virtual network or may stretch across different VNets in the same region or a different region. Seamless connectivity between various Virtual networks can be established by [peering](../../virtual-network/virtual-network-peering-overview.md), which uses Microsoft's low latency, high-bandwidth private backbone infrastructure. The virtual networks appear as one for connectivity purposes.

Azure Database for MySQL - Flexible Server supports client connectivity from:

- Virtual networks within the same Azure region. (locally peered VNets)
- Virtual networks across Azure regions. (Global peered VNets)

Subnets enable you to segment the virtual network into one or more subnetworks and allocate a portion of the virtual network's address space to which you can then deploy Azure resources. Azure Database for MySQL - Flexible Server requires a [delegated subnet](../../virtual-network/subnet-delegation-overview.md). A delegated subnet is an explicit identifier that a subnet can host only Azure Database for MySQL - Flexible Servers. By delegating the subnet, the service gets direct permissions to create service-specific resources to manage your Azure Database for MySQL - Flexible Server seamlessly.

> [!NOTE]  
> The smallest range you can specify for a subnet is /29, which provides eight IP addresses, of which five are utilized by Azure internally. In contrast, for an Azure Database for MySQL - Flexible server, you would require one IP address per node to be allocated from the delegated subnet when private access is enabled. HA-enabled servers would need two, and Non-HA server would need one IP address. The recommendation is to reserve at least 2 IP addresses per flexible server, keeping in mind that we can enable high availability options later.

Azure Database for MySQL: Flexible Server integrates with Azure [Private DNS zones](../../dns/private-dns-privatednszone.md) to provide a reliable, secure DNS service to manage and resolve domain names in a virtual network without the need to add a custom DNS solution. A private DNS zone can be linked to one or more virtual networks by creating [virtual network links](../../dns/private-dns-virtual-network-links.md)

:::image type="content" source="./media/concepts-networking/vnet-diagram.png" alt-text="Flexible server MySQL VNET":::

In the above diagram,

1. Flexible servers are injected into a delegated subnet - 10.0.1.0/24 of VNET **VNet-1**.
1. Applications deployed on different subnets within the same vnet can access the Flexible servers directly.
1. Applications deployed on a different VNET **VNet-2** don't have direct access to flexible servers. Before they can access the flexible server, you must perform a [private DNS zone VNET peering](#private-dns-zone-and-vnet-peering).

## Virtual network concepts

Here are some concepts to be familiar with when using virtual networks with MySQL flexible servers.

- **Virtual network** -

   An Azure Virtual Network (VNet) contains a private IP address space configured for your use. Visit the [Azure Virtual Network overview](../../virtual-network/virtual-networks-overview.md) to learn more about Azure virtual networking.

   Your virtual network must be in the same Azure region as your flexible server.

- **Delegated subnet** -

   A virtual network contains subnets (subnetworks). Subnets enable you to segment your virtual network into smaller address spaces. Azure resources are deployed into specific subnets within a virtual network.

   Your MySQL flexible server must be in a subnet that is **delegated** for MySQL flexible server use only. This delegation means that only Azure Database for MySQL - Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet. You delegate a subnet by assigning its delegation property as Microsoft.DBforMySQL/flexibleServers.

- **Network security groups (NSG)**

   Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. Review the [network security group overview](../../virtual-network/network-security-groups-overview.md) for more information.

- **Private DNS zone integration**

   Azure private DNS zone integration allows you to resolve the private DNS within the current VNET or any in-region peered VNET where the private DNS Zone is linked.

- **Virtual network peering**

   A virtual network peering enables you to connect two or more Virtual Networks in Azure seamlessly. The peered virtual networks appear as one for connectivity purposes. The traffic between virtual machines in peered virtual networks uses the Microsoft backbone infrastructure. The traffic between the client application and the flexible server in peered VNets is routed only through Microsoft's private network and is isolated to that network.

## Use Private DNS Zone

- If you use the Azure portal or the Azure CLI to create flexible servers with VNET, a new private DNS zone ending with `mysql.database.azure.com` is auto-provisioned per server in your subscription using the server name provided. Alternatively, if you want to set up your own private DNS zone with the flexible server, see the [private DNS overview](../../dns/private-dns-overview.md) documentation.
- If you use Azure API, an Azure Resource Manager template (ARM template), or Terraform, create private DNS zones that end with `mysql.database.azure.com` and use them while configuring flexible servers with private access. For more information, see the [private DNS zone overview](../../dns/private-dns-overview.md).

   > [!IMPORTANT]  
   > Private DNS zone names must end with `mysql.database.azure.com`. If you are connecting to an Azure Database for MySQL flexible server with SSL and you're using an option to perform full verification (sslmode=VERIFY_IDENTITY) with certificate subject name, use \<servername\>.mysql.database.azure.com in your connection string.

Learn how to create a flexible server with private access (VNet integration) in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).

## Integration with a custom DNS server

If you're using the custom DNS server, then you must **use a DNS forwarder to resolve the FQDN of Azure Database for MySQL - Flexible Server**. The forwarder IP address should be [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md). The custom DNS server should be inside the VNet or reachable via the VNET's DNS Server setting. Refer to [name resolution that uses your DNS server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) to learn more.

> [!IMPORTANT]  
> For successful provisioning of the flexible server, even if you are using a custom DNS server, **you must not block DNS traffic to [AzurePlatformDNS](../../virtual-network/service-tags-overview.md) using [NSG](../../virtual-network/network-security-groups-overview.md)**.
## Private DNS zone and VNET peering

Private DNS zone settings and VNET peering are independent of each other. For more information on creating and using Private DNS zones, see the [Use Private DNS Zone](#use-private-dns-zone) section.

If you want to connect to the flexible server from a client that is provisioned in another VNET from the same region or a different region, you have to link the private DNS zone with the VNET. See [how to link the virtual network](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network) documentation.

> [!NOTE]  
> Private DNS zone names that end with `mysql.database.azure.com` can only be linked.

## Connect from an on-premises server to a flexible server in a Virtual Network using ExpressRoute or VPN

For workloads requiring access to flexible server in virtual network from on-premises network, you need an [ExpressRoute](/azure/architecture/reference-architectures/hybrid-networking/expressroute/) or [VPN](/azure/architecture/reference-architectures/hybrid-networking/vpn/) and virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/). With this setup in place, you need a DNS forwarder to resolve the flexible servername if you want to connect from client applications (like MySQL Workbench) running on on-premises virtual network. This DNS forwarder is responsible for resolving all the DNS queries via a server-level forwarder to the Azure-provided DNS service [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md).

To configure correctly, you need the following resources:

- On-premises network
- MySQL Flexible Server provisioned with private access (VNet integration)
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- Use DNS forwarder [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md) deployed in Azure

You can then use the flexible servername (FQDN) to connect from the client application in peered virtual network or on-premises network to flexible server.

> [!NOTE]  
> We recommend you use the fully qualified domain name (FQDN) `<servername>.mysql.database.azure.com` in connection strings when connecting to your flexible server. The server's IP address is not guaranteed to remain static. Using the FQDN will help you avoid making changes to your connection string.

## Unsupported virtual network scenarios

- Public endpoint (or public IP or DNS) - A flexible server deployed to a virtual network can't have a public endpoint
- After the flexible server is deployed to a virtual network and subnet, you can't move it to another virtual network or subnet. You can't move the virtual network into another resource group or subscription.
- Subnet size (address spaces) can't be increased once resources exist in the subnet
- Flexible server doesn't support Private Link. Instead, it uses VNet injection to make a flexible server available within a VNet.

## Next steps

- Learn how to enable private access (VNet integration) using the [Azure portal](how-to-manage-virtual-network-portal.md) or [Azure CLI](how-to-manage-virtual-network-cli.md)
- Learn how to [use TLS](how-to-connect-tls-ssl.md)
