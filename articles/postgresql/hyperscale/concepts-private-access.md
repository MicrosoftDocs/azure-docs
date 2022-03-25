---
title: Private access - Hyperscale (Citus) - Azure Database for PostgreSQL
description: This article describes private access for Azure Database for PostgreSQL - Hyperscale (Citus).
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 10/15/2021
---

# Private access in Azure Database for PostgreSQL - Hyperscale (Citus)

[!INCLUDE [azure-postgresql-hyperscale-access](../../../includes/azure-postgresql-hyperscale-access.md)]

This page describes the private access option. For public access, see
[here](concepts-firewall-rules.md).

## Definitions

**Virtual network**. An Azure Virtual Network (VNet) is the fundamental
building block for private networking in Azure. Virtual networks enable many
types of Azure resources, such as database servers and Azure Virtual Machines
(VM), to securely communicate with each other. Virtual networks support on-prem
connections, allow hosts in multiple virtual networks to interact with each
other through peering, and provide added benefits of scale, security options,
and isolation. Each private endpoint for a Hyperscale (Citus) server group
requires an associated virtual network.

**Subnet**. Subnets segment a virtual network into one or more subnetworks.
Each subnetwork gets a portion of the address space, improving address
allocation efficiency.  You can secure resources within subnets using Network
Security Groups. For more information, see Network security groups.

When you select a subnet for a Hyperscale (Citus)’s private endpoint, make sure
enough private IP addresses are available in that subnet for your current and
future needs.

**Private endpoint**. A private endpoint is a network interface that uses a
private IP address from a virtual network. This network interface connects
privately and securely to a service powered by Azure Private Link. Private
endpoints bring the services into your virtual network.

Enabling private access for Hyperscale (Citus) creates a private endpoint for
the server group’s coordinator node. The endpoint allows hosts in the selected
virtual network to access the coordinator. You can optionally create private
endpoints for worker nodes too.

**Private DNS zone**. An Azure private DNS zone resolves hostnames within a
linked virtual network, and within any peered virtual network. Domain records
for Hyperscale (Citus) nodes are created in a private DNS zone selected for
their server group.  Be sure to use fully qualified domain names (FQDN) for
nodes' PostgreSQL connection strings.

## Private link

You can use [private endpoints](../../private-link/private-endpoint-overview.md)
for your Hyperscale (Citus) server groups to allow hosts on a virtual network
(VNet) to securely access data over a [Private
Link](../../private-link/private-link-overview.md).

The server group's private endpoint uses an IP address from the virtual
network's address space. Traffic between hosts on the virtual network and
Hyperscale (Citus) nodes goes over a private link on the Microsoft backbone
network, eliminating exposure to the public Internet.

Applications in the virtual network can connect to the Hyperscale (Citus) nodes
over the private endpoint seamlessly, using the same connection strings and
authorization mechanisms that they would use otherwise.

You can select private access during Hyperscale (Citus) server group creation,
and you can switch from public access to private access at any point.

### Using a private DNS zone

A new private DNS zone is automatically provisioned for each private endpoint,
unless you select one of the private DNS zones previously created by Hyperscale
(Citus). For more information, see the [private DNS zones
overview](../../dns/private-dns-overview.md).

Hyperscale (Citus) service creates DNS records such as
`c.privatelink.mygroup01.postgres.database.azure.com`  in the selected private
DNS zone for each node with a private endpoint. When you connect to a
Hyperscale (Citus) node from an Azure VM via private endpoint, Azure DNS
resolves the node’s FQDN into a private IP address.

Private DNS zone settings and virtual network peering are independent of each
other. If you want to connect to a node in the server group from a client
that's provisioned in another virtual network (from the same region or a
different region), you have to link the private DNS zone with the virtual
network. For more information, see [Link the virtual
network](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network).

> [!NOTE]
>
> The service also always creates public CNAME records such as
> `c.mygroup01.postgres.database.azure.com` for every node. However, selected
> computers on the public internet can connect to the public hostname only if
> the database administrator enables [public
> access](concepts-firewall-rules.md) to the server group.

If you're using a custom DNS server, you must use a DNS forwarder to resolve
the FQDN of Hyperscale (Citus) nodes. The forwarder IP address should be
168.63.129.16. The custom DNS server should be inside the virtual network or
reachable via the virtual network's DNS server setting. To learn more, see
[Name resolution that uses your own DNS
server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

### Recommendations

When you enable private access for your Hyperscale (Citus) server group,
consider:

* **Subnet size**: When selecting subnet size for Hyperscale (Citus) server
  group, consider current needs such as IP addresses for coordinator or all
  nodes in that server group, and future needs such as growth of that server
  group. Make sure you have enough private IP addresses for the current and
  future needs. Keep in mind, Azure reserves five IP addresses in each subnet.
  See more details [in this
  FAQ](../../virtual-network/virtual-networks-faq.md#configuration).
* **Private DNS zone**: DNS records with private IP addresses are going to be
  maintained by Hyperscale (Citus) service. Make sure you don’t delete private
  DNS zone used for Hyperscale (Citus) server groups.

## Limits and limitations

See Hyperscale (Citus) [limits and limitations](reference-limits.md)
page.

## Next steps

* Learn how to [enable and manage private access](howto-private-access.md)
* Follow a [tutorial](tutorial-private-access.md) to see private access in
  action.
* Learn about [private
  endpoints](../../private-link/private-endpoint-overview.md)
* Learn about [virtual
  networks](../../virtual-network/concepts-and-best-practices.md)
* Learn about [private DNS zones](../../dns/private-dns-overview.md)
