---
title: Private access (preview) - Hyperscale (Citus) - Azure Database for PostgreSQL
description: This article describes private access for Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 9/20/2021
---

# Private access (preview) in Azure Database for PostgreSQL - Hyperscale (Citus)

[!INCLUDE [azure-postgresql-hyperscale-access](../../includes/azure-postgresql-hyperscale-access.md)]

This page describes the private access option. For public access, see
[here](concepts-hyperscale-firewall-rules.md).

## Definitions

**Virtual network**. Azure Virtual Network (VNet) is the fundamental building
block for your private network in Azure. Virtual network enables many types of
Azure resources, such as database servers and Azure Virtual Machines (VM), to
securely communicate with each other. Azure virtual network supports on-prem
connections, allows hosts in multiple virtual networks to interact with each
other through peering and provides added benefits of scale, security options,
and isolation. You need to select a virtual network for each private endpoint
created for your Hyperscale (Citus) server group.

**Subnet**. Subnets enable you to segment the virtual network into one or more
sub-networks and allocate a portion of the virtual network's address space to
each subnet. This also improves address allocation efficiency. You can secure
resources within subnets using Network Security Groups. For more information,
see Network security groups.

When you select a subnet for Hyperscale (Citus)’s private endpoint you need to
make sure enough private IP addresses are available in that subnet for your
current and future needs.

**Private endpoint**. A private endpoint is a network interface that uses a
private IP address from your virtual network. This network interface connects
you privately and securely to a service powered by Azure Private Link. By
enabling a private endpoint, you're bringing the service into your virtual
network.

With private access selected, you create a private endpoint for your server
group’s coordinator node. This private endpoint allows hosts in the selected
virtual network to access Hyperscale (Citus) coordinator. You can also
optionally create additional private endpoints for worker nodes.

**Private DNS zone**. Azure private DNS zone integration allows you to resolve
the private DNS names within the current virtual network or any peered virtual
network where the private DNS zone is linked. Domain records for Hyperscale
(Citus) nodes are created in a private DNS zone selected for your server group.
You should use fully qualified domain names (FQDN) for Hyperscale (Citus) nodes
in connection strings.

## Private link

You can use [private
endpoints](/azure/private-link/private-endpoint-overview)
for your Hyperscale (Citus) server groups to allow hosts on a virtual network
(VNet) to securely access data over a [Private
Link](/azure/private-link/private-link-overview).

The private endpoint uses an IP address from the virtual network address space
for the nodes in your Hyperscale (Citus) server group. Network traffic between
the hosts on the virtual network and the Hyperscale (Citus) nodes traverses
over the virtual network and a private link on the Microsoft backbone network,
eliminating exposure from the public Internet.

Applications in the virtual network can connect to the Hyperscale (Citus) nodes
over the private endpoint seamlessly, using the same connection strings and
authorization mechanisms that they would use otherwise.

You can select private access connectivity method during Hyperscale (Citus)
server group creation, or you can switch from public access to private access
at any point.

### Using a private DNS zone

A new private DNS zone is automatically provisioned for each private endpoint
unless you select one of the private DNS zones previously created by Hyperscale
(Citus) service. For more information, see the [private DNS zones
overview](/azure/dns/private-dns-overview).

Hyperscale (Citus) service creates DNS records such as
`c.private.mygroup01.postgres.database.azure.com` for each node with a private
endpoint in the selected private DNS zone. The CNAME record allows to keep
connection string the same when public access is switched to private access.

When you connect to a Hyperscale (Citus) node from an Azure VM via private
endpoint, Azure DNS would resolve node’s FQDN into a private IP address.

If you're using a custom DNS server, you must use a DNS forwarder to resolve
the FQDN of Hyperscale (Citus) nodes. The forwarder IP address should be
168.63.129.16. The custom DNS server should be inside the virtual network or
reachable via the virtual network's DNS server setting. To learn more, see
[Name resolution that uses your own DNS
server](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances#name-resolution-that-uses-your-own-dns-server).

### Recommendations

When you enable private access for your Hyperscale (Citus) server group
consider the following:

* **Subnet size**: When selecting subnet size for Hyperscale (Citus) server
  group, consider current needs such as IP addresses for coordinator or all
  nodes in that server group and future needs such as growth of that server
  group. Make sure you have enough private IP addresses for the current and
  future needs. Note that Azure reserves 5 IP addresses in each subnet. See
  more details [in this
  FAQ](/azure/virtual-network/virtual-networks-faq#configuration).
* **Private DNS zone**: DNS records with private IP addresses are going to be
  maintained by Hyperscale (Citus) service. Make sure you don’t delete private
  DNS zone used for Hyperscale (Citus) server groups.

## Limits and limitations

See Hyperscale (Citus) [limits and limitations](concepts-hyperscale-limits.md)
page.

## Next steps

* Learn how to enable and manage private access
* Learn about [private
  endpoints](/azure/private-link/private-endpoint-overview)
* Learn about [virtual
  networks](/azure/virtual-network/concepts-and-best-practices)
* Learn about [private DNS zones](/azure/dns/private-dns-overview)
