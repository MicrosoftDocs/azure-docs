---
title: Azure SQL Database Managed Instance Connectivity Architecture | Microsoft Docs
description: This article provides the Azure SQL Database Managed Instance communication overview and explains connectivity architecture as well as how the different components function to direct traffic to the Managed Instance.
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
ms.date: 12/10/2018
---

# Azure SQL Database Managed Instance Connectivity Architecture

This article provides the Azure SQL Database Managed Instance communication overview and explains connectivity architecture as well as how the different components function to direct traffic to the Managed Instance.  

The Azure SQL Database Managed Instance is placed inside Azure VNet and the subnet dedicated to Managed Instances. This deployment enables the following scenarios: 
- Secure private IP address.
- Connecting to a Managed Instance directly from an on-premises network.
- Connecting a Managed Instance to linked server or another on-premises data store.
- Connecting a Managed Instance to Azure resources.

## Communication overview

The following diagram shows entities that connect to Managed Instance as well as resources that Managed Instance has to reach out in order to function properly.

![connectivity architecture entities](./media/managed-instance-connectivity-architecture/connectivityarch001.png)

Communication that is depicted on the bottom of the diagram represents customer applications and tools connecting to Managed Instance as data source.  

As Managed Instance is platform-as-a-services (PaaS) offering, Microsoft manages this service using automated agents (management, deployment, and maintenance) based on telemetry data streams. As Managed Instance management is solely Microsoft responsibility, customers are not able to access Managed Instance virtual cluster machines through RDP.

Some SQL Server operations initiated by the end users or applications may require Managed Instance to interact with the platform. One case is the creation of a Managed Instance database - a resource that is exposed through the portal, PowerShell, and Azure CLI.

Managed Instance depends on other Azure Services for its proper functioning (such as Azure Storage for backups, Azure Service Bus for telemetry, Azure AD for authentication, Azure Key Vault for TDE, and so forth) and initiates connections to them accordingly.

All communications, stated above, are encrypted and signed using certificates. To make sure that communicating parties are trusted, Managed Instance constantly verifies these certificates by contacting Certificate Authority. If the certificates are revoked or Managed Instance could not verify them, it closes the connections to protect the data.

## High-level connectivity architecture

At a high level, Managed Instance is a set of service components, hosted on a dedicated set of isolated virtual machines that run inside the customer virtual network subnet and form a virtual cluster.

Multiple Managed Instances could be hosted in single virtual cluster. The cluster is automatically expanded or contracted if needed when the customer changes the number of provisioned instances in the subnet.

Customer applications could connect to Managed Instance, query and update databases only if they run inside the virtual network or peered virtual network or VPN / Express Route connected network using endpoint with private IP address.  

![connectivity architecture diagram](./media/managed-instance-connectivity-architecture/connectivityarch002.png)

Microsoft management and deployment services run outside of the virtual network so connection between Managed Instance and Microsoft services goes over the endpoints with public IP addresses. When Managed Instance creates outbound connection, on receiving end it looks like it’s coming from this public IP due to Network Address Translation (NAT).

Management traffic flows through the customer virtual network. That means that elements of virtual network infrastructure affect and could potentially harm management traffic causing instance to enter faulty state and become unavailable.

> [!IMPORTANT]
> To improve customer experience and service availability, Microsoft applies Network Intent Policy on Azure virtual network infrastructure elements that could affect Managed Instance functioning. This is a platform mechanism to communicate transparently networking requirements to end users, with main goal to prevent network misconfiguration and ensure normal Managed Instance operations. Upon Managed Instance deletion Network Intent Policy is removed as well.

## Virtual cluster connectivity architecture

Let’s take a deeper dive in Managed Instance connectivity architecture. The following diagram shows the conceptual layout of the virtual cluster.

![connectivity architecture diagram virtual cluster](./media/managed-instance-connectivity-architecture/connectivityarch003.png)

Clients connect to Managed Instance using the host name that has a form `<mi_name>.<dns_zone>.database.windows.net`. This host name resolves to private IP address although it is registered in public DNS zone and is publicly resolvable. The `zone-id` is automatically generated when the cluster is created. If a newly created cluster is hosting a secondary managed instance, it shares its zone id with the primary cluster. For more information, see [Auto-failover groups](sql-database-auto-failover-group.md##enabling-geo-replication-between-managed-instances-and-their-vnets)

This private IP address belongs to the Managed Instance Internal Load Balancer (ILB) that directs traffic to the Managed Instance Gateway (GW). As multiple Managed Instances could potentially run inside the same cluster, GW uses Managed Instance host name to redirect traffic to the correct SQL Engine service.

Management and deployment services connect to Managed Instance using [management endpoint](#management-endpoint) that maps to external load balancer. Traffic is routed to the nodes only if received on a predefined set of ports that are used exclusively by Managed Instance management components. Built-in firewall on the nodes is configured to allow traffic only from Microsoft specific IP ranges. All communication between management components and management plane is mutually certificate authenticated.

## Management endpoint

The Azure SQL Database Managed Instance virtual cluster contains a management endpoint that Microsoft uses for managing the Managed Instance. The management endpoint is protected with built-in firewall on network level and mutual certificate verification on application level. You can [find management endpoint ip address](sql-database-managed-instance-find-management-endpoint-ip-address.md).

When connections are initiated from inside the Managed Instance (backup, audit log) it appears that traffic originates from management endpoint public IP address. You could limit access to public services from Managed Instance by setting firewall rules to allow the Managed Instance IP address only. Find mor einformation about the method that can [verify the Managed Instance built-in firewall](sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md).

> [!NOTE]
> This doesn’t apply to setting firewall rules for Azure services that are in the same region as Managed Instance as the Azure platform has an optimization for the traffic that goes between the services that are collocated.

## Network requirements

You can deploy Managed Instance in a dedicated subnet (the Managed Instance subnet) inside the virtual network that conforms to the following requirements:
- **Dedicated subnet**: The Managed Instance subnet must not contain any other cloud service associated with it, and it must not be a Gateway subnet. You won’t be able to create a Managed Instance in a subnet that contains resources other than Managed Instance, and you can not later add other resources in the subnet.
- **Compatible Network Security Group (NSG)**: An NSG associated with a Managed Instance subnet must contain rules shown in the following tables (Mandatory inbound security rules and Mandatory outbound security rules) in front of any other rules. You can use an NSG to fully control access to the Managed Instance data endpoint by filtering traffic on port 1433. 
- **Compatible user-defined route table (UDR)**: The Managed Instance subnet must have a user route table with **0.0.0.0/0 Next Hop Internet** as the mandatory UDR assigned to it. In addition, you can add a UDR that routes traffic that has on-premises private IP ranges as a destination through virtual network gateway or virtual network appliance (NVA). 
- **Optional custom DNS**: If a custom DNS is specified on the virtual network, Azure's recursive resolver IP address (such as 168.63.129.16) must be added to the list. For more information, see [Configuring Custom DNS](sql-database-managed-instance-custom-dns.md). The custom DNS server must be able to resolve host names in the following domains and their subdomains: *microsoft.com*, *windows.net*, *windows.com*, *msocsp.com*, *digicert.com*, *live.com*, *microsoftonline.com*, and *microsoftonline-p.com*. 
- **No service endpoints**: The Managed Instance subnet must not have a service endpoint associated to it. Make sure that service endpoints option is disabled when creating the virtual network.
- **Sufficient IP addresses**: The Managed Instance subnet must have the bare minimum of 16 IP addresses (recommended minimum is 32 IP addresses). For more information, see [Determine the size of subnet for Managed Instances](sql-database-managed-instance-determine-size-vnet-subnet.md). You can deploy Managed Instances in [the existing network](sql-database-managed-instance-configure-vnet-subnet.md) once you configure it to satisfy [Managed Instance networking requirements](#network-requirements), or create a [new network and subnet](sql-database-managed-instance-create-vnet-subnet.md).

> [!IMPORTANT]
> You won’t be able to deploy a new Managed Instance if the destination subnet is not compatible with all of these requirements. When a Managed Instance is created, a *Network Intent Policy* is applied on the subnet to prevent non-compliant changes to networking configuration. After the last instance is removed from the subnet, the *Network Intent Policy* is removed as well

### Mandatory inbound security rules 

| Name       |Port                        |Protocol|Source           |Destination|Action|
|------------|----------------------------|--------|-----------------|-----------|------|
|management  |9000, 9003, 1438, 1440, 1452|TCP     |Any              |Any        |Allow |
|mi_subnet   |Any                         |Any     |MI SUBNET        |Any        |Allow |
|health_probe|Any                         |Any     |AzureLoadBalancer|Any        |Allow |

### Mandatory outbound security rules 

| Name       |Port          |Protocol|Source           |Destination|Action|
|------------|--------------|--------|-----------------|-----------|------|
|management  |80, 443, 12000|TCP     |Any              |Any        |Allow |
|mi_subnet   |Any           |Any     |Any              |MI SUBNET  |Allow |

  > [!Note]
  > Although mandatory inbound security rules allow traffic from _Any_ source on ports 9000, 9003, 1438, 1440, 1452 these ports are protected by built-in firewall. This [article](sql-database-managed-instance-find-management-endpoint-ip-address.md) shows how you can discover management endpoint IP address and verify firewall rules. 
  
  > [!Note]
  > If you are using transactional replication in Managed Instance and any database in Managed Instance is used as publisher or distributor, port 445 (TCP outbound) also needs to be open in the security rules of the subnet to access the Azure file share.
  
## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md)
- Learn how to [configure new VNet](sql-database-managed-instance-create-vnet-subnet.md) or [configure existing VNet](sql-database-managed-instance-configure-vnet-subnet.md) where you can deploy Managed Instances.
- [Calculate out the size of the subnet](sql-database-managed-instance-determine-size-vnet-subnet.md) where you will deploy Managed Instances. 
- For a quickstart see how to create Managed Instance:
  - From the [Azure portal](sql-database-managed-instance-get-started.md)
  - Using [PowerShell](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/27/quick-start-script-create-azure-sql-managed-instance-using-powershell/)
  - using [Azure Resource Manager template](https://azure.microsoft.com/resources/templates/101-sqlmi-new-vnet/)
  - using [Azure Resource Manager template (jumpbox with SSMS included)](https://portal.azure.com/)
