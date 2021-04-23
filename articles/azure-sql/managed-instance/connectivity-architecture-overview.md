---
title: Connectivity architecture
titleSuffix: Azure SQL Managed Instance 
description: Learn about Azure SQL Managed Instance communication and connectivity architecture as well as how the components direct traffic to a managed instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: fasttrack-edit
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova
ms.date: 10/22/2020
---

# Connectivity architecture for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains communication in Azure SQL Managed Instance. It also describes connectivity architecture and how the components direct traffic to a managed instance.  

SQL Managed Instance is placed inside the Azure virtual network and the subnet that's dedicated to managed instances. This deployment provides:

- A secure private IP address.
- The ability to connect an on-premises network to SQL Managed Instance.
- The ability to connect SQL Managed Instance to a linked server or another on-premises data store.
- The ability to connect SQL Managed Instance to Azure resources.

## Communication overview

The following diagram shows entities that connect to SQL Managed Instance. It also shows the resources that need to communicate with a managed instance. The communication process at the bottom of the diagram represents customer applications and tools that connect to SQL Managed Instance as data sources.  

![Entities in connectivity architecture](./media/connectivity-architecture-overview/connectivityarch001.png)

SQL Managed Instance is a platform as a service (PaaS) offering. Azure uses automated agents (management, deployment, and maintenance) to manage this service based on telemetry data streams. Because Azure is responsible for management, customers can't access the SQL Managed Instance virtual cluster machines through Remote Desktop Protocol (RDP).

Some operations started by end users or applications might require SQL Managed Instance to interact with the platform. One case is the creation of a SQL Managed Instance database. This resource is exposed through the Azure portal, PowerShell, Azure CLI, and the REST API.

SQL Managed Instance depends on Azure services such as Azure Storage for backups, Azure Event Hubs for telemetry, Azure Active Directory (Azure AD) for authentication, Azure Key Vault for Transparent Data Encryption (TDE), and a couple of Azure platform services that provide security and supportability features. SQL Managed Instance makes connections to these services.

All communications are encrypted and signed using certificates. To check the trustworthiness of communicating parties, SQL Managed Instance constantly verifies these certificates through certificate revocation lists. If the certificates are revoked, SQL Managed Instance closes the connections to protect the data.

## High-level connectivity architecture

At a high level, SQL Managed Instance is a set of service components. These components are hosted on a dedicated set of isolated virtual machines that run inside the customer's virtual network subnet. These machines form a virtual cluster.

A virtual cluster can host multiple managed instances. If needed, the cluster automatically expands or contracts when the customer changes the number of provisioned instances in the subnet.

Customer applications can connect to SQL Managed Instance and can query and update databases inside the virtual network, peered virtual network, or network connected by VPN or Azure ExpressRoute. This network must use an endpoint and a private IP address.  

![Connectivity architecture diagram](./media/connectivity-architecture-overview/connectivityarch002.png)

Azure management and deployment services run outside the virtual network. SQL Managed Instance and Azure services connect over the endpoints that have public IP addresses. When SQL Managed Instance creates an outbound connection, on the receiving end Network Address Translation (NAT) makes the connection look like it's coming from this public IP address.

Management traffic flows through the customer's virtual network. That means that elements of the virtual network's infrastructure can harm management traffic by making the instance fail and become unavailable.

> [!IMPORTANT]
> To improve customer experience and service availability, Azure applies a network intent policy on Azure virtual network infrastructure elements. The policy can affect how SQL Managed Instance works. This platform mechanism transparently communicates networking requirements to users. The policy's main goal is to prevent network misconfiguration and to ensure normal SQL Managed Instance operations. When you delete a managed instance, the network intent policy is also removed.

## Virtual cluster connectivity architecture

Let's take a deeper dive into connectivity architecture for SQL Managed Instance. The following diagram shows the conceptual layout of the virtual cluster.

![Connectivity architecture of the virtual cluster](./media/connectivity-architecture-overview/connectivityarch003.png)

Clients connect to SQL Managed Instance by using a host name that has the form `<mi_name>.<dns_zone>.database.windows.net`. This host name resolves to a private IP address, although it's registered in a public Domain Name System (DNS) zone and is publicly resolvable. The `zone-id` is automatically generated when you create the cluster. If a newly created cluster hosts a secondary managed instance, it shares its zone ID with the primary cluster. For more information, see [Use auto failover groups to enable transparent and coordinated failover of multiple databases](../database/auto-failover-group-overview.md#enabling-geo-replication-between-managed-instances-and-their-vnets).

This private IP address belongs to the internal load balancer for SQL Managed Instance. The load balancer directs traffic to the SQL Managed Instance gateway. Because multiple managed instances can run inside the same cluster, the gateway uses the SQL Managed Instance host name to redirect traffic to the correct SQL engine service.

Management and deployment services connect to SQL Managed Instance by using a [management endpoint](#management-endpoint) that maps to an external load balancer. Traffic is routed to the nodes only if it's received on a predefined set of ports that only the management components of SQL Managed Instance use. A built-in firewall on the nodes is set up to allow traffic only from Microsoft IP ranges. Certificates mutually authenticate all communication between management components and the management plane.

## Management endpoint

Azure manages SQL Managed Instance by using a management endpoint. This endpoint is inside an instance's virtual cluster. The management endpoint is protected by a built-in firewall on the network level. On the application level, it's protected by mutual certificate verification. To find the endpoint's IP address, see [Determine the management endpoint's IP address](management-endpoint-find-ip-address.md).

When connections start inside SQL Managed Instance (as with backups and audit logs), traffic appears to start from the management endpoint's public IP address. You can limit access to public services from SQL Managed Instance by setting firewall rules to allow only the IP address for SQL Managed Instance. For more information, see [Verify the SQL Managed Instance built-in firewall](management-endpoint-verify-built-in-firewall.md).

> [!NOTE]
> Traffic that goes to Azure services that are inside the SQL Managed Instance region is optimized and for that reason not NATed to the public IP address for the management endpoint. For that reason if you need to use IP-based firewall rules, most commonly for storage, the service needs to be in a different region from SQL Managed Instance.

## Service-aided subnet configuration

To address customer security and manageability requirements, SQL Managed Instance is transitioning from manual to service-aided subnet configuration.

With service-aided subnet configuration, the user is in full control of data (TDS) traffic, while SQL Managed Instance takes responsibility to ensure uninterrupted flow of management traffic in order to fulfill an SLA.

Service-aided subnet configuration builds on top of the virtual network [subnet delegation](../../virtual-network/subnet-delegation-overview.md) feature to provide automatic network configuration management and enable service endpoints. 

Service endpoints could be used to configure virtual network firewall rules on storage accounts that keep backups and audit logs. Even with service endpoints enabled, customers are encouraged to use [private link](../../private-link/private-link-overview.md) that provides additional security over service endpoints.

> [!IMPORTANT]
> Due to control plane configuration specificities, service-aided subnet configuration would not enable service endpoints in national clouds. 

### Network requirements

Deploy SQL Managed Instance in a dedicated subnet inside the virtual network. The subnet must have these characteristics:

- **Dedicated subnet:** The SQL Managed Instance subnet can't contain any other cloud service that's associated with it, and it can't be a gateway subnet. The subnet can't contain any resource but SQL Managed Instance, and you can't later add other types of resources in the subnet.
- **Subnet delegation:** The SQL Managed Instance subnet needs to be delegated to the `Microsoft.Sql/managedInstances` resource provider.
- **Network security group (NSG):** An NSG needs to be associated with the SQL Managed Instance subnet. You can use an NSG to control access to the SQL Managed Instance data endpoint by filtering traffic on port 1433 and ports 11000-11999 when SQL Managed Instance is configured for redirect connections. The service will automatically provision and keep current [rules](#mandatory-inbound-security-rules-with-service-aided-subnet-configuration) required to allow uninterrupted flow of management traffic.
- **User defined route (UDR) table:** A UDR table needs to be associated with the SQL Managed Instance subnet. You can add entries to the route table to route traffic that has on-premises private IP ranges as a destination through the virtual network gateway or virtual network appliance (NVA). Service will automatically provision and keep current [entries](#user-defined-routes-with-service-aided-subnet-configuration) required to allow uninterrupted flow of management traffic.
- **Sufficient IP addresses:** The SQL Managed Instance subnet must have at least 32 IP addresses. For more information, see [Determine the size of the subnet for SQL Managed Instance](vnet-subnet-determine-size.md). You can deploy managed instances in [the existing network](vnet-existing-add-subnet.md) after you configure it to satisfy [the networking requirements for SQL Managed Instance](#network-requirements). Otherwise, create a [new network and subnet](virtual-network-subnet-create-arm-template.md).

> [!IMPORTANT]
> When you create a managed instance, a network intent policy is applied on the subnet to prevent noncompliant changes to networking setup. After the last instance is removed from the subnet, the network intent policy is also removed. Rules below are for the informational purposes only, and you should not deploy them using ARM template / PowerShell / CLI. If you want to use the latest official template you could always [retrieve it from the portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

### Mandatory inbound security rules with service-aided subnet configuration

| Name       |Port                        |Protocol|Source           |Destination|Action|
|------------|----------------------------|--------|-----------------|-----------|------|
|management  |9000, 9003, 1438, 1440, 1452|TCP     |SqlManagement    |MI SUBNET  |Allow |
|            |9000, 9003                  |TCP     |CorpnetSaw       |MI SUBNET  |Allow |
|            |9000, 9003                  |TCP     |CorpnetPublic    |MI SUBNET  |Allow |
|mi_subnet   |Any                         |Any     |MI SUBNET        |MI SUBNET  |Allow |
|health_probe|Any                         |Any     |AzureLoadBalancer|MI SUBNET  |Allow |

### Mandatory outbound security rules with service-aided subnet configuration

| Name       |Port          |Protocol|Source           |Destination|Action|
|------------|--------------|--------|-----------------|-----------|------|
|management  |443, 12000    |TCP     |MI SUBNET        |AzureCloud |Allow |
|mi_subnet   |Any           |Any     |MI SUBNET        |MI SUBNET  |Allow |

### User defined routes with service-aided subnet configuration

|Name|Address prefix|Next hop|
|----|--------------|-------|
|subnet-to-vnetlocal|MI SUBNET|Virtual network|
|mi-azurecloud-REGION-internet|AzureCloud.REGION|Internet|
|mi-azurecloud-REGION_PAIR-internet|AzureCloud.REGION_PAIR|Internet|
|mi-azuremonitor-internet|AzureMonitor|Internet|
|mi-corpnetpublic-internet|CorpNetPublic|Internet|
|mi-corpnetsaw-internet|CorpNetSaw|Internet|
|mi-eventhub-REGION-internet|EventHub.REGION|Internet|
|mi-eventhub-REGION_PAIR-internet|EventHub.REGION_PAIR|Internet|
|mi-sqlmanagement-internet|SqlManagement|Internet|
|mi-storage-internet|Storage|Internet|
|mi-storage-REGION-internet|Storage.REGION|Internet|
|mi-storage-REGION_PAIR-internet|Storage.REGION_PAIR|Internet|
||||

\* MI SUBNET refers to the IP address range for the subnet in the form x.x.x.x/y. You can find this information in the Azure portal, in subnet properties.

\** If the destination address is for one of Azure's services, Azure routes the traffic directly to the service over Azure's backbone network, rather than routing the traffic to the Internet. Traffic between Azure services does not traverse the Internet, regardless of which Azure region the virtual network exists in, or which Azure region an instance of the Azure service is deployed in. For more details check [UDR documentation page](../../virtual-network/virtual-networks-udr-overview.md).

In addition, you can add entries to the route table to route traffic that has on-premises private IP ranges as a destination through the virtual network gateway or virtual network appliance (NVA).

If the virtual network includes a custom DNS, the custom DNS server must be able to resolve public DNS records. Using additional features like Azure AD Authentication might require resolving additional FQDNs. For more information, see [Set up a custom DNS](custom-dns-configure.md).

### Networking constraints

**TLS 1.2 is enforced on outbound connections**: In January 2020 Microsoft enforced TLS 1.2 for intra-service traffic in all Azure services. For Azure SQL Managed Instance, this resulted in TLS 1.2 being enforced on outbound connections used for replication and linked server connections to SQL Server. If you are using versions of SQL Server older than 2016 with SQL Managed Instance, please ensure that [TLS 1.2 specific updates](https://support.microsoft.com/help/3135244/tls-1-2-support-for-microsoft-sql-server) have been applied.

The following virtual network features are currently *not supported* with SQL Managed Instance:

- **Microsoft peering**: Enabling [Microsoft peering](../../expressroute/expressroute-faqs.md#microsoft-peering) on ExpressRoute circuits peered directly or transitively with a virtual network where SQL Managed Instance resides affects traffic flow between SQL Managed Instance components inside the virtual network and services it depends on, causing availability issues. SQL Managed Instance deployments to virtual network with Microsoft peering already enabled are expected to fail.
- **Global virtual network peering**: [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md) connectivity across Azure regions doesn't work for SQL Managed Instances placed in subnets created before 9/22/2020.
- **AzurePlatformDNS**: Using the AzurePlatformDNS [service tag](../../virtual-network/service-tags-overview.md) to block platform DNS resolution would render SQL Managed Instance unavailable. Although SQL Managed Instance supports customer-defined DNS for DNS resolution inside the engine, there is a dependency on platform DNS for platform operations.
- **NAT gateway**: Using [Azure Virtual Network NAT](../../virtual-network/nat-overview.md) to control outbound connectivity with a specific public IP address would render SQL Managed Instance unavailable. The SQL Managed Instance service is currently limited to use of basic load balancer that doesn't provide coexistence of inbound and outbound flows with Virtual Network NAT.
- **IPv6 for Azure Virtual Network**: Deploying SQL Managed Instance to [dual stack IPv4/IPv6 virtual networks](../../virtual-network/ipv6-overview.md) is expected to fail. Associating network security group (NSG) or route table (UDR) containing IPv6 address prefixes to SQL Managed Instance subnet, or adding IPv6 address prefixes to NSG or UDR that is already associated with Managed instance subnet, would render SQL Managed Instance unavailable. SQL Managed Instance deployments to a subnet with NSG and UDR that already have IPv6 prefixes are expected to fail.
- **Azure DNS private zones with a name reserved for Microsoft services**: Following is the list of reserved names: windows.net, database.windows.net, core.windows.net, blob.core.windows.net, table.core.windows.net, management.core.windows.net, monitoring.core.windows.net, queue.core.windows.net, graph.windows.net, login.microsoftonline.com, login.windows.net, servicebus.windows.net, vault.azure.net. Deploying SQL Managed Instance to a virtual network with associated [Azure DNS private zone](../../dns/private-dns-privatednszone.md) with a name reserved for Microsoft services would fail. Associating Azure DNS private zone with reserved name with a virtual network containing Managed Instance, would render SQL Managed Instance unavailable. Please folow [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md) for the proper Private Link configuration.

## Next steps

- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- Learn how to [set up a new Azure virtual network](virtual-network-subnet-create-arm-template.md) or an [existing Azure virtual network](vnet-existing-add-subnet.md) where you can deploy SQL Managed Instance.
- [Calculate the size of the subnet](vnet-subnet-determine-size.md) where you want to deploy SQL Managed Instance.
- Learn how to create a managed instance:
  - From the [Azure portal](instance-create-quickstart.md).
  - By using [PowerShell](scripts/create-configure-managed-instance-powershell.md).
  - By using [an Azure Resource Manager template](https://azure.microsoft.com/resources/templates/101-sqlmi-new-vnet/).
  - By using [an Azure Resource Manager template (using JumpBox, with SSMS included)](https://azure.microsoft.com/resources/templates/201-sqlmi-new-vnet-w-jumpbox/).
