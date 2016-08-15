<properties
   pageTitle="Adding reliability to an N-tier architecture on Azure | Microsoft Azure"
   description="How to run Linux VMs for an N-tier architecture in Microsoft Azure."
   services=""
   documentationCenter="na"
   authors="mikewasson"
   manager="roshar"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/12/2016"
   ms.author="mikewasson"/>

# Adding reliability to an N-tier architecture on Azure

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

> [AZURE.SELECTOR]
- [Adding reliability to an N-tier architecture (Linux)](guidance-compute-n-tier-vm-linux.md)
- [Adding reliability to an N-tier architecture (Windows)](guidance-compute-n-tier-vm.md)

This article outlines a set of proven practices for running a reliable N-tier architecture on Linux virtual machines (VMs) in Microsoft Azure. This article builds on [Running VMs for an N-tier architecture on Azure][blueprints-3-tier]. In this article, we include additional components that can increase the reliability of the application:

- A network virtual appliance for greater network security.

- An Apache Cassandra database, deployed in an availability set for high availability in the data tier.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.

## Architecture diagram

This article is focused on VM and network infrastructure, not application design. The following diagram shows an abstraction of an N-tier application:

![[0]][0]

This diagram builds on the architecture shown in [Running Linux VMs for an N-tier architecture on Azure][blueprints-3-tier], adding the following components:

- **Network virtual appliance (NVA)**. A VM running software that performs network and security functions. Typical features of an NVA include:

	- Firewall.

	- Traffic optimization, such as WAN optimization.

	- Packet inspection.

	- SSL offloading.

	- Layer 7 load balancing.

	- Logging and reporting

- **Apache Cassandra database**. Provides high availability at the data tier, by enabling replication and failover.

- **Service A** and **Service B**. These are two example services that constitute the application. They might be web apps or web APIs. Client requests are routed either to service A or to service B, depending on the content of the request (for example, the URL path). Service A writes to the Cassandra database. Service B sends data to an external service, such as Redis cache or a message queue, which is outside the scope of this article.

	These general characteristics imply some high-level requirements for the system:

	- Intelligent load balancing, to route requests based on URLs or message content. (Layer-7 load balancing.)

	- Logging and monitoring of network traffic.

	- Network packet inspection.

	- Multiple storage technologies might be used.

## Recommendations

### Network recommendations

- Put each service or app tier into its own subnet. For more information about designing VNets and subnets, see [Plan and design Azure Virtual Networks][plan-network].

- In the configuration shown here, network traffic within the VNet (between VMs) is _not_ routed through the network virtual appliance. If you need network traffic within the VNet to go through the appliance &mdash; for example, for compliance reasons &mdash; create user defined routes (UDRs) to route the traffic. For more information, see [What are User Defined Routes and IP Forwarding?][udr].

### Cassandra recommendations

We recommend [DataStax Enterprise][datastax] for production use. For more information on running DataStax in Azure, see [DataStax Enterprise Deployment Guide for Azure][cassandra-in-azure]. The following general recommendations apply to any Cassandra edition.

- Put the VMs for a Cassandra cluster in an availability set, to ensure that the Cassandra replicas are distributed across multiple fault domains and upgrade domains. For more information about fault domains and upgrade domains, see [Manage the availability of virtual machines][availability-sets]. 

- Configure 3 fault domains (the maximum) per availability set. 

- Configure 18 upgrade domains per availability set. This gives you the maximum number of upgrade domains than can still be distributed evenly across the fault domains.   

- Configure nodes in rack-aware mode. Map fault domains to racks in the `cassandra-rackdc.properties` file.

- You don't need a load balancer in front of the cluster. The client connects directly to a node in the cluster.

## Availability considerations

- To increase availability of the application services, place two or more NVAs in an availability set. Use an external load balancer to distribute incoming Internet requests across the NVAs.

## Security considerations

- The NVA should have two separate NICs, placed in different subnets. One NIC is for Internet traffic, and the other is for network traffic to the other subnets within the VNet. Configure IP forwarding on the appliance to forward Internet traffic from the front-end NIC to the back-end NIC. Note that some NVA do not support multiple NICs.

- Use [network security groups][nsg] (NSGs) to isolate subnets. For example, in the previous diagram, the NSG for service A allows network traffic only from the NVA and the management subnet. Of course, the details will depend on your application.

## Next steps

- If you need higher availability than the SLAs provide, replicate the application across two datacenters and use Azure Traffic Manager for failover. For more information, see [Running VMs in multiple datacenters on Azure for high availability][multi-dc].    

- To learn more about setting up a DMZ with a virtual appliance, see [Virtual appliance scenario][virtual-appliance-scenario].

<!-- links -->
[availability-sets]: ../virtual-machines/virtual-machines-windows-manage-availability.md
[azure-cli]: ../virtual-machines-command-line-tools.md
[blueprints-3-tier]: guidance-compute-3-tier-vm.md
[cassandra-in-azure]: https://docs.datastax.com/en/datastax_enterprise/4.5/datastax_enterprise/install/installAzure.html
[cassandra-consistency]: http://docs.datastax.com/en/cassandra/2.0/cassandra/dml/dml_config_consistency_c.html
[cassandra-replication]: http://www.planetcassandra.org/data-replication-in-nosql-databases-explained/
[cassandra-consistency-usage]: http://medium.com/@foundev/cassandra-how-many-nodes-are-talked-to-with-quorum-also-should-i-use-it-98074e75d7d5#.b4pb4alb2
[datastax]: http://www.datastax.com/products/datastax-enterprise
[multi-dc]: guidance-compute-multiple-datacenters-linux.md
[nsg]: ../virtual-network/virtual-networks-nsg.md
[plan-network]: ../virtual-network/virtual-network-vnet-plan-design-arm.md
[resource-manager-overview]: ../resource-group-overview.md
[udr]: ../virtual-network/virtual-networks-udr-overview.md
[virtual-appliance-scenario]: ../virtual-network/virtual-network-scenario-udr-gw-nva.md
[0]: ./media/blueprints/compute-n-tier-linux.png "Architecture for a reliable Azure application based on Linux and Cassandra"
