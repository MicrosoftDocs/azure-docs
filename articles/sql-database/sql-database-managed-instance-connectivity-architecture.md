---
title: Connectivity architecture for a managed instance in Azure SQL Database  | Microsoft Docs
description: Learn about Azure SQL Database managed instance communication and connectivity architecture as well as how the components direct traffic to the managed instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: bonova, carlrab
manager: craigg
ms.date: 02/26/2019
---

# Connectivity architecture for a managed instance in Azure SQL Database 

This article explains communication in an Azure SQL Database managed instance. It also describes connectivity architecture and how the components direct traffic to the managed instance.  

The SQL Database managed instance is placed inside the Azure virtual network and the subnet that's dedicated to managed instances. This deployment provides:

- A secure private IP address.
- The ability to connect an on-premises network to a managed instance.
- The ability to connect a managed instance to a linked server or another on-premises data store.
- The ability to connect a managed instance to Azure resources.

## Communication overview

The following diagram shows entities that connect to a managed instance. It also shows the resources that need to communicate with the managed instance. The communication process at the bottom of the diagram represents customer applications and tools that connect to the managed instance as data sources.  

![Entities in connectivity architecture](./media/managed-instance-connectivity-architecture/connectivityarch001.png)

A managed instance is a platform as a service (PaaS) offering. Microsoft uses automated agents (management, deployment, and maintenance) to manage this service based on telemetry data streams. Because Microsoft is responsible for management, customers can't access the managed instance virtual cluster machines through Remote Desktop Protocol (RDP).

Some SQL Server operations started by end users or applications might require managed instances to interact with the platform. One case is the creation of a managed instance database. This resource is exposed through the Azure portal, PowerShell, Azure CLI, and the REST API.

Managed instances depend on Azure services such as Azure Storage for backups, Azure Service Bus for telemetry, Azure Active Directory for authentication, and Azure Key Vault for Transparent Data Encryption (TDE). The managed instances make connections to these services.

All communications use certificates for encryption and signing. To check the trustworthiness of communicating parties, managed instances constantly verify these certificates by contacting a certificate authority. If the certificates are revoked or can't be verified, the managed instance closes the connections to protect the data.

## High-level connectivity architecture

At a high level, a managed instance is a set of service components. These components are hosted on a dedicated set of isolated virtual machines that run inside the customer's virtual network subnet. These machines form a virtual cluster.

A virtual cluster can host multiple managed instances. If needed, the cluster automatically expands or contracts when the customer changes the number of provisioned instances in the subnet.

Customer applications can connect to managed instances and can query and update databases only if they run inside the virtual network, peered virtual network, or network connected by VPN or Azure ExpressRoute. This network must use an endpoint and a private IP address.  

![Connectivity architecture diagram](./media/managed-instance-connectivity-architecture/connectivityarch002.png)

Microsoft management and deployment services run outside the virtual network. A managed instance and Microsoft services connect over the endpoints that have public IP addresses. When a managed instance creates an outbound connection, on receiving end Network Address Translation (NAT) makes the connection look like it’s coming from this public IP address.

Management traffic flows through the customer's virtual network. That means that elements of the virtual network's infrastructure can harm management traffic by making the instance fail and become unavailable.

> [!IMPORTANT]
> To improve customer experience and service availability, Microsoft applies a network intent policy on Azure virtual network infrastructure elements. The policy can affect how the managed instance works. This platform mechanism transparently communicates networking requirements to users. The policy's main goal is to prevent network misconfiguration and to ensure normal managed instance operations. When you delete a managed instance, the network intent policy is also removed.

## Virtual cluster connectivity architecture

Let’s take a deeper dive into connectivity architecture for managed instances. The following diagram shows the conceptual layout of the virtual cluster.

![Connectivity architecture of the virtual cluster](./media/managed-instance-connectivity-architecture/connectivityarch003.png)

Clients connect to a managed instance by using a host name that has the form `<mi_name>.<dns_zone>.database.windows.net`. This host name resolves to a private IP address although it's registered in a public Domain Name System (DNS) zone and is publicly resolvable. The `zone-id` is automatically generated when you create the cluster. If a newly created cluster hosts a secondary managed instance, it shares its zone ID with the primary cluster. For more information, see [Use auto failover groups to enable transparent and coordinated failover of multiple databases](sql-database-auto-failover-group.md##enabling-geo-replication-between-managed-instances-and-their-vnets).

This private IP address belongs to the managed instance's internal load balancer. The load balancer directs traffic to the managed instance's gateway. Because multiple managed instances can run inside the same cluster, the gateway uses the managed instance's host name to redirect traffic to the correct SQL engine service.

Management and deployment services connect to a managed instance by using a [management endpoint](#management-endpoint) that maps to an external load balancer. Traffic is routed to the nodes only if it's received on a predefined set of ports that only the managed instance's management components use. A built-in firewall on the nodes is set up to allow traffic only from Microsoft IP ranges. Certificates mutually authenticate all communication between management components and the management plane.

## Management endpoint

Microsoft manages the managed instance by using a management endpoint. This endpoint is inside the instance's virtual cluster. The management endpoint is protected by a built-in firewall on the network level. On the application level, it's protected by mutual certificate verification. To find the endpoint's IP address, see [Determine the management endpoint's IP address](sql-database-managed-instance-find-management-endpoint-ip-address.md).

When connections start inside the managed instance (as with backups and audit logs), traffic appears to start from the management endpoint's public IP address. You can limit access to public services from a managed instance by setting firewall rules to allow only the managed instance's IP address. For more information, see [Verify the managed instance's built-in firewall](sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md).

> [!NOTE]
> Unlike the firewall for connections that start inside the managed instance, the Azure services that are inside the managed instance's region have a firewall that's optimized for the traffic that goes between these services.

## Network requirements

Deploy a managed instance in a dedicated subnet inside the virtual network. The subnet must have these characteristics:

- **Dedicated subnet:** The managed instance's subnet can't contain any other cloud service that's associated with it, and it can't be a gateway subnet. The subnet can't contain any resource but the managed instance, and you can't later add resources in the subnet.
- **Network security group (NSG):** An NSG that's associated with the virtual network must  define [inbound security rules](#mandatory-inbound-security-rules) and [outbound security rules](#mandatory-outbound-security-rules) before any other rules. You can use an NSG to control access to the managed instance's data endpoint by filtering traffic on port 1433.
- **User defined route (UDR) table:** A UDR table that's associated with the virtual network must include specific [entries](#user-defined-routes).
- **No service endpoints:** No service endpoint should be associated with the managed instance's subnet. Make sure that the service endpoints option is disabled when you create the virtual network.
- **Sufficient IP addresses:** The managed instance subnet must have at least 16 IP addresses. The recommended minimum is 32 IP addresses. For more information, see [Determine the size of the subnet for managed instances](sql-database-managed-instance-determine-size-vnet-subnet.md). You can deploy managed instances in [the existing network](sql-database-managed-instance-configure-vnet-subnet.md) after you configure it to satisfy [the networking requirements for managed instances](#network-requirements). Otherwise, create a [new network and subnet](sql-database-managed-instance-create-vnet-subnet.md).

> [!IMPORTANT]
> You can't deploy a new managed instance if the destination subnet lacks these characteristics. When you create a managed instance, a network intent policy is applied on the subnet to prevent noncompliant changes to networking setup. After the last instance is removed from the subnet, the network intent policy is also removed.

### Mandatory inbound security rules

| Name       |Port                        |Protocol|Source           |Destination|Action|
|------------|----------------------------|--------|-----------------|-----------|------|
|management  |9000, 9003, 1438, 1440, 1452|TCP     |Any              |Any        |Allow |
|mi_subnet   |Any                         |Any     |MI SUBNET        |Any        |Allow |
|health_probe|Any                         |Any     |AzureLoadBalancer|Any        |Allow |

### Mandatory outbound security rules

| Name       |Port          |Protocol|Source           |Destination|Action|
|------------|--------------|--------|-----------------|-----------|------|
|management  |80, 443, 12000|TCP     |Any              |Internet   |Allow |
|mi_subnet   |Any           |Any     |Any              |MI SUBNET*  |Allow |

\* MI SUBNET refers to the IP address range for the subnet in the form 10.x.x.x/y. You can find this information in the Azure portal, in subnet properties.

> [!IMPORTANT]
> Although required inbound security rules allow traffic from _any_ source on ports 9000, 9003, 1438, 1440, and 1452, these ports are protected by a built-in firewall. For more information, see [Determine the management endpoint address](sql-database-managed-instance-find-management-endpoint-ip-address.md).

> [!NOTE]
> If you use transactional replication in a managed instance, and if you use any instance database as a publisher or a distributor, open port 445 (TCP outbound) in the subnet's security rules. This port will allow access to the Azure file share.

### User defined routes

|Name|Address prefix|Next Hop|
|----|--------------|-------|
|subnet_to_vnetlocal|[mi_subnet]|Virtual network|
|mi-0-5-next-hop-internet|0.0.0.0/5|Internet|
|mi-11-8-nexthop-internet|11.0.0.0/8|Internet|
|mi-12-6-nexthop-internet|12.0.0.0/6|Internet|
|mi-128-3-nexthop-internet|128.0.0.0/3|Internet|
|mi-16-4-nexthop-internet|16.0.0.0/4|Internet|
|mi-160-5-nexthop-internet|160.0.0.0/5|Internet|
|mi-168-6-nexthop-internet|168.0.0.0/6|Internet|
|mi-172-12-nexthop-internet|172.0.0.0/12|Internet|
|mi-172-128-9-nexthop-internet|172.128.0.0/9|Internet|
|mi-172-32-11-nexthop-internet|172.32.0.0/11|Internet|
|mi-172-64-10-nexthop-internet|172.64.0.0/10|Internet|
|mi-173-8-nexthop-internet|173.0.0.0/8|Internet|
|mi-174-7-nexthop-internet|174.0.0.0/7|Internet|
|mi-176-4-nexthop-internet|176.0.0.0/4|Internet|
|mi-192-128-11-nexthop-internet|192.128.0.0/11|Internet|
|mi-192-160-13-nexthop-internet|192.160.0.0/13|Internet|
|mi-192-169-16-nexthop-internet|192.169.0.0/16|Internet|
|mi-192-170-15-nexthop-internet|192.170.0.0/15|Internet|
|mi-192-172-14-nexthop-internet|192.172.0.0/14|Internet|
|mi-192-176-12-nexthop-internet|192.176.0.0/12|Internet|
|mi-192-192-10-nexthop-internet|192.192.0.0/10|Internet|
|mi-192-9-nexthop-internet|192.0.0.0/9|Internet|
|mi-193-8-nexthop-internet|193.0.0.0/8|Internet|
|mi-194-7-nexthop-internet|194.0.0.0/7|Internet|
|mi-196-6-nexthop-internet|196.0.0.0/6|Internet|
|mi-200-5-nexthop-internet|200.0.0.0/5|Internet|
|mi-208-4-nexthop-internet|208.0.0.0/4|Internet|
|mi-224-3-nexthop-internet|224.0.0.0/3|Internet|
|mi-32-3-nexthop-internet|32.0.0.0/3|Internet|
|mi-64-2-nexthop-internet|64.0.0.0/2|Internet|
|mi-8-7-nexthop-internet|8.0.0.0/7|Internet|
||||

In addition, you can add entries to the route table to route traffic that has on-premises private IP ranges as a destination through the virtual network gateway or virtual network appliance (NVA).

If the virtual network includes a custom DNS, add an entry for the Azure recursive resolver IP address (such as 168.63.129.16). For more information, see [Set up a custom DNS](sql-database-managed-instance-custom-dns.md). The custom DNS server must be able to resolve host names in these domains and their subdomains: *microsoft.com*, *windows.net*, *windows.com*, *msocsp.com*, *digicert.com*, *live.com*, *microsoftonline.com*, and *microsoftonline-p.com*.

## Next steps

- For an overview, see [SQL Database advanced data security](sql-database-managed-instance.md).
- Learn how to [set up a new Azure virtual network](sql-database-managed-instance-create-vnet-subnet.md) or an [existing Azure virtual network](sql-database-managed-instance-configure-vnet-subnet.md) where you can deploy managed instances.
- [Calculate the size of the subnet](sql-database-managed-instance-determine-size-vnet-subnet.md) where you want to deploy the managed instances.
- Learn how to create a managed instance:
  - From the [Azure portal](sql-database-managed-instance-get-started.md).
  - By using [PowerShell](scripts/sql-database-create-configure-managed-instance-powershell.md).
  - By using [an Azure Resource Manager template](https://azure.microsoft.com/resources/templates/101-sqlmi-new-vnet/).
  - By using [an Azure Resource Manager template (using JumpBox, with SSMS included)](https://portal.azure.com/).
