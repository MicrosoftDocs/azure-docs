---
title: Azure SQL Database managed instance connectivity architecture | Microsoft Docs
description: This article provides the Azure SQL Database managed instance communication overview and explains connectivity architecture as well as how the different components function to direct traffic to the managed instance.
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
ms.date: 02/18/2019
---

# Azure SQL Database managed instance connectivity architecture

This article provides the Azure SQL Database managed instance communication overview and explains connectivity architecture as well as how the different components function to direct traffic to the managed instance.  

The Azure SQL Database managed instance is placed inside Azure VNet and the subnet dedicated to managed instances. This deployment enables the following scenarios:

- Secure private IP address.
- Connecting to a managed instance directly from an on-premises network.
- Connecting a managed instance to linked server or another on-premises data store.
- Connecting a managed instance to Azure resources.

## Communication overview

The following diagram shows entities that connect to managed instance as well as resources that managed instance has to reach out in order to function properly.

![connectivity architecture entities](./media/managed-instance-connectivity-architecture/connectivityarch001.png)

Communication that is depicted on the bottom of the diagram represents customer applications and tools connecting to managed instance as data source.  

As managed instance is a platform-as-a-services (PaaS) offering, Microsoft manages this service using automated agents (management, deployment, and maintenance) based on telemetry data streams. As managed instance management is solely Microsoft's responsibility, customers are not able to access the managed instance virtual cluster machines through RDP.

Some SQL Server operations initiated by the end users or applications may require managed instances to interact with the platform. One case is the creation of a managed instance database - a resource that is exposed through the Azure portal, PowerShell, Azure CLI, and the REST API.

Managed instance depends on other Azure Services for its proper functioning (such as Azure Storage for backups, Azure Service Bus for telemetry, Azure AD for authentication, Azure Key Vault for TDE, and so forth) and initiates connections to them accordingly.

All communications, stated above, are encrypted and signed using certificates. To make sure that communicating parties are trusted, managed instance constantly verifies these certificates by contacting Certificate Authority. If the certificates are revoked or managed instance could not verify them, it closes the connections to protect the data.

## High-level connectivity architecture

At a high level, a managed instance is a set of service components, hosted on a dedicated set of isolated virtual machines that run inside the customer virtual network subnet and form a virtual cluster.

Multiple managed instances can be hosted in single virtual cluster. The cluster is automatically expanded or contracted if needed when the customer changes the number of provisioned instances in the subnet.

Customer applications could connect to managed instances, query and update databases only if they run inside the virtual network or peered virtual network or VPN / Express Route connected network using endpoint with private IP address.  

![connectivity architecture diagram](./media/managed-instance-connectivity-architecture/connectivityarch002.png)

Microsoft management and deployment services run outside of the virtual network so connections between a managed instance and Microsoft services goes over the endpoints with public IP addresses. When managed instance creates outbound connection, on receiving end it looks like it’s coming from this public IP due to Network Address Translation (NAT).

Management traffic flows through the customer virtual network. That means that elements of virtual network infrastructure affect and could potentially harm management traffic causing instance to enter faulty state and become unavailable.

> [!IMPORTANT]
> To improve customer experience and service availability, Microsoft applies Network Intent Policy on Azure virtual network infrastructure elements that could affect managed instance functioning. This is a platform mechanism to communicate transparently networking requirements to end users, with main goal to prevent network misconfiguration and ensure normal managed instance operations. Upon managed instance deletion Network Intent Policy is removed as well.

## Virtual cluster connectivity architecture

Let’s take a deeper dive in managed instance connectivity architecture. The following diagram shows the conceptual layout of the virtual cluster.

![connectivity architecture diagram virtual cluster](./media/managed-instance-connectivity-architecture/connectivityarch003.png)

Clients connect to managed instance using the host name that has a form `<mi_name>.<dns_zone>.database.windows.net`. This host name resolves to private IP address although it is registered in public DNS zone and is publicly resolvable. The `zone-id` is automatically generated when the cluster is created. If a newly created cluster is hosting a secondary managed instance, it shares its zone ID with the primary cluster. For more information, see [Auto-failover groups](sql-database-auto-failover-group.md##enabling-geo-replication-between-managed-instances-and-their-vnets)

This private IP address belongs to the managed instance internal load balancer (ILB) that directs traffic to the managed instance gateway (GW). As multiple managed instances could potentially run inside the same cluster, the GW uses the managed instance host name to redirect traffic to the correct SQL Engine service.

Management and deployment services connect to a managed instance using a [management endpoint](#management-endpoint) that maps to an external load balancer. Traffic is routed to the nodes only if received on a predefined set of ports that are used exclusively by the managed instance management components. Built-in firewall on the nodes is configured to allow traffic only from Microsoft specific IP ranges. All communication between management components and management plane is mutually certificate authenticated.

## Management endpoint

The managed instance virtual cluster contains a management endpoint that Microsoft uses for managing the managed instance. The management endpoint is protected with built-in firewall on network level and mutual certificate verification on application level. You can [find management endpoint ip address](sql-database-managed-instance-find-management-endpoint-ip-address.md).

When connections are initiated from inside the managed instance (backup, audit log) it appears that traffic originates from management endpoint public IP address. You could limit access to public services from a managed instance by setting firewall rules to allow the managed instance IP address only. Find more information about the method that can [verify the managed instance built-in firewall](sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md).

> [!NOTE]
> This doesn’t apply to setting firewall rules for Azure services that are in the same region as the managed instance as the Azure platform has an optimization for the traffic that goes between the services that are collocated.

## Network requirements

You deploy a managed instance in a dedicated subnet (the managed instance subnet) inside the virtual network that conforms to the following requirements:

- **Dedicated subnet**: The managed instance subnet must not contain any other cloud service associated with it, and it must not be a Gateway subnet. You won’t be able to create a managed instance in a subnet that contains resources other than the managed instance, and you can not later add other resources in the subnet.
- **Network Security Group (NSG)**: An NSG associated with the virtual network must contain these defined mandatory [inbound security rules](#mandatory-inbound-security-rules) and [outbound security rules](#mandatory-outbound-security-rules) in front of any other rules. You can use an NSG to fully control access to the managed instance data endpoint by filtering traffic on port 1433.
- **User-defined route table (UDR)**: A user-defined route table associated with the virtual network must have these [entries](#user-defined-routes) in a user-defined route table.
- **No service endpoints**: The managed instance subnet must not have a service endpoint associated to it. Make sure that service endpoints option is disabled when creating the virtual network.
- **Sufficient IP addresses**: The managed instance subnet must have the bare minimum of 16 IP addresses (recommended minimum is 32 IP addresses). For more information, see [determine the size of subnet for managed instances](sql-database-managed-instance-determine-size-vnet-subnet.md). You can deploy managed instances in [the existing network](sql-database-managed-instance-configure-vnet-subnet.md) once you configure it to satisfy [managed instance networking requirements](#network-requirements), or create a [new network and subnet](sql-database-managed-instance-create-vnet-subnet.md).

> [!IMPORTANT]
> You won’t be able to deploy a new managed instance if the destination subnet is not compatible with all of these requirements. When a managed instance is created, a *Network Intent Policy* is applied on the subnet to prevent non-compliant changes to networking configuration. After the last instance is removed from the subnet, the *Network Intent Policy* is removed as well

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

\* MI SUBNET refers to the IP Address range for the subnet in the form 10.x.x.x/y. This information can be found in the Azure portal (via subnet properties).

> [!IMPORTANT]
> Although mandatory inbound security rules allow traffic from _Any_ source on ports 9000, 9003, 1438, 1440, 1452 these ports are protected by built-in firewall. This [article](sql-database-managed-instance-find-management-endpoint-ip-address.md) shows how you can discover management endpoint IP address and verify firewall rules.
> [!NOTE]
> If you are using transactional replication in a managed instance and any instance database is used as a publisher or a distributor, port 445 (TCP outbound) also needs to be open in the security rules of the subnet to access the Azure file share.

### User-defined routes

|Name|Address prefix|Net Hop|
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

In addition, you can add entries to the route table routes traffic that has on-premises private IP ranges as a destination through virtual network gateway or virtual network appliance (NVA).

- **Optional custom DNS**: If a custom DNS is specified on the virtual network, Azure's recursive resolver IP address (such as 168.63.129.16) must be added to the list. For more information, see [Configuring Custom DNS](sql-database-managed-instance-custom-dns.md). The custom DNS server must be able to resolve host names in the following domains and their subdomains: *microsoft.com*, *windows.net*, *windows.com*, *msocsp.com*, *digicert.com*, *live.com*, *microsoftonline.com*, and *microsoftonline-p.com*.

## Next steps

- For an overview, see [what is a managed instance](sql-database-managed-instance.md)
- Learn how to [configure new VNet](sql-database-managed-instance-create-vnet-subnet.md) or [configure existing VNet](sql-database-managed-instance-configure-vnet-subnet.md) where you can deploy managed instances.
- [Calculate out the size of the subnet](sql-database-managed-instance-determine-size-vnet-subnet.md) where you will deploy the managed instances.
- For quickstarts, see how to create managed instance:
  - From the [Azure portal](sql-database-managed-instance-get-started.md)
  - Using [PowerShell](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/27/quick-start-script-create-azure-sql-managed-instance-using-powershell/)
  - using [Azure Resource Manager template](https://azure.microsoft.com/resources/templates/101-sqlmi-new-vnet/)
  - using [Azure Resource Manager template (jumpbox with SSMS included)](https://portal.azure.com/)
