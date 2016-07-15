<properties
   pageTitle="Running VMs in multiple datacenters for high availability | Reference Architecture | Microsoft Azure"
   description="How to deploy VMs in multiple datacenters on Azure for high availability and resiliency."
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
   ms.date="07/06/2016"
   ms.author="mikewasson"/>

# Running VMs in multiple datacenters on Azure for high availability

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

> [AZURE.SELECTOR]
- [Running VMs in multiple datacenters (Linux)](guidance-compute-multiple-datacenters-linux.md)
- [Running VMs in multiple datacenters (Windows)](guidance-compute-multiple-datacenters.md)

In this article, we recommend a set of practices to run Windows virtual machines (VMs) in multiple Azure datacenters, to achieve availability and a robust disaster recovery infrastructure.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource groups] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.

A multi-datacenter architecture can provide higher availability than deploying to a single datacenter. If a regional outage affects the primary datacenter, you can use [Traffic Manager][traffic-manager] to fail over to the secondary datacenter. This architecture can also help if an individual subsystem of the application fails.  
     
There are several general approaches to achieving high availability across data centers:      

- Active/passive with hot standby. Traffic goes to one datacenter, while the other waits on standby. VMs in the secondary datacenter are allocated and running at all times.

- Active/passive with cold standby. The same, but VMs in the secondary datacenter are not allocated until needed for failover. This approach costs less to run, but will generally have longer down time during a failure.

- Active/active. Both datacenters are active, and requests are load balanced between them. If one data center becomes unavailable, it is taken out of rotation. 

This architecture focuses on active/passive with hot standby, using Traffic Manager for failover. Note that you could deploy a small number of VMs for hot standby and then scale out as needed.

## Architecture diagram

The following diagram builds on the architecture shown in [Adding reliability to an N-tier architecture on Azure](guidance-compute-n-tier-vm.md).

[![0]][0]

- **Primary and secondary datacenters**. This architecture uses two datacenters to achieve higher availability. One is the primary datacenter. During normal operations, network traffic is routed to the primary datacenter. But if that becomes unavailable, traffic is routed to the secondary datacenter.

- **[Azure Traffic Manager][traffic-manager]** routes incoming requests to the primary datacenter. If that datacenter becomes unavailable, Traffic Manager fails over to the secondary datacenter. For more information, see the section [Configuring Traffic Manager](#configuring-traffic-manager).

- **Resource groups**. Create separate [resource groups][resource groups] for the primary datacenter, the secondary datacenter, and for Traffic Manager. This gives you the flexibility to manage each datacenter as a single collection of resources. For example, you could redeploy one datacenter, without taking down the other one. [Link the resource groups][resource-group-links], so that you can run a query to list all the resources for the application.

- **VNets**. Create a separate VNet for each datacenter. Make sure the address spaces do not overlap. 

- **SQL Server AlwaysOn Availability Group**. If you are using SQL Server, we recommend [SQL AlwaysOn Availabilty Groups][sql-always-on] for high availability. Create a single availability group that includes the SQL Server instances in both datacenters. For more information, see the section [Configuring the SQL Server AlwaysOn availability group](#configuring-the-sql-server-alwayson-availability-group ).

    > [AZURE.NOTE] Also consider [Azure SQL Database][azure-sql-db], which provides a relational database as a cloud service. With SQL Database, you don't need to configure an Availability Group or manage failover.  

- **VPN Gateways**: Create a [VPN gateway][vpn-gateway] in each VNet, and configure a [VNet-to-VNet connection][vnet-to-vnet], to enable network traffic between the two VNets. This is required for the SQL AlwaysOn availability group.

## Recommendations

### Datacenters and regional pairing

Each Azure region is paired with another region within the same geography. In general, choose regions from the same regional pair (for example, East US 2 and US Central). Benefits of doing so include:

- If there is a broad outage, recovery of at least one region out of every pair is prioritized.

- Planned Azure system updates are rolled out to paired regions sequentially, to minimize possible downtime.

- Pairs reside within the same geography, to meet data residency requirements.

However, make sure that both regions support all of the Azure services needed for your application (see [Services by region][services-by-region]). For more information about regional pairs, see [Business continuity and disaster recovery (BCDR): Azure Paired Regions][regional-pairs].

### Traffic Manager configuration

Consider the following points when configuring traffic manager for your scenario:

- **Routing.** Traffic Manager supports several [routing algorithms][tm-routing]. For the scenario described in this article, use _priority_ routing (formerly called _failover_ routing). With this setting, Traffic Manager sends all requests to the primary datacenter, unless the primary datacenter becomes unreachable. At that point, it automatically fails over to the secondary datacenter. See [Configure Failover routing method][tm-configure-failover].

- **Health probe.** Traffic Manager uses an HTTP (or HTTPS) [probe][tm-monitoring] to monitor the availability of each datacenter. The probe checks for an HTTP 200 response for a specified URL path. As a best practice, create an endpoint that reports the overall health of the application, and use this endpoint for the health probe. Otherwise, the probe might report a "healthy" endpoint when critical parts of the application are actually failing. For more information,see [Health Endpoint Monitoring Pattern][health-endpoint-monitoring-pattern].   

When Traffic Manager fails over, there is a period of time when clients cannot reach the application, which can be several minutes. Two factors affect the total duration:

- The health probe must detect that the primary data center has become unreachable.

- DNS servers must update the cached DNS records for the IP address, which depends on the DNS time-to-live (TTL). The default TTL is 300 seconds (5 minutes), but you can configure this value when you create the Traffic Manager profile.

For details, see [About Traffic Manager Monitoring][tm-monitoring]. 

If Traffic Manager fails over, we recommend performing a manual failback, rather than automatically failing back. Verify that all application subsystems are healthy first. Otherwise, you can create a situation where the application flips back and forth between data centers.

By default, Traffic Manager automatically fails back. To prevent this, manually lower the priority of the primary datacenter after a failover event. For example, suppose the primary datacenter is priority 1 and the secondary is priority 2. After a failover, set the primary datacenter to priority 3, to prevent automatic failback. When you are ready to switch back, update the priority to 1.

The following Azure CLI command updates the priority:

```bat
azure network traffic-manager  endpoint set --resource-group <resource-group> --profile-name <profile>
    --name <traffic-manager-name> --type AzureEndpoints --priority 3
```    

Another way to avoid flip-flop is to temporarily disable the endpoint:

```bat
azure network traffic-manager  endpoint set --resource-group <resource-group> --profile-name <profile>
    --name <traffic-manager-name> --type AzureEndpoints --status Disabled
```    

Depending on the cause of a failover, you might need to redploy the resources within a datacenter. Before failing back, perform an operational readiness test. The test should verify things like:

- VMs are configured correctly. (All required software is installed, IIS is running, etc.)

- Application subsystems are healthy. 

- Functional testing. (For example, the database tier is reachable from the web tier.)

### SQL Server AlwaysOn configuration

SQL Server AlwaysOn availability groups require a domain controller. All nodes in the availability group must be in the same AD domain. The following points provide guidance concerning how to configure a SQL Server AlwaysOn availability group:

- At a minimum, place two domain controllers in each datacenter. 

- Give each domain controller a static IP address.

- Create a VNet-to-VNet connection to enable communication between the VNets.

- For each VNet, add the IP addresses of the domain controllers (from both datacenters) to the DNS server list. You can use the following CLI command. More more information, see [Manage DNS servers used by a virtual network (VNet)][vnet-dns].

    ```bat
    azure network vnet set --resource-group dc01-rg --name dc01-vnet --dns-servers "10.0.0.4,10.0.0.6,172.16.0.4,172.16.0.6"
    ```

- Create a [Windows Server Failover Clustering][wsfc] (WSFC) cluster that includes the SQL Server instances in both datacenters. 

- Create a SQL Server AlwaysOn availability group that includes the SQL Server instances in both the primary and secondary datacenters. See [Extending AlwaysOn Availability Group to Remote Azure Datacenter (PowerShell)](https://blogs.msdn.microsoft.com/sqlcat/2014/09/22/extending-alwayson-availability-group-to-remote-azure-datacenter-powershell/) for the steps. 

    - Put the primary replica in the primary datacenter.

    - Put one or more secondary replicas in the primary datacenter. Configure these to use synchronous commit with automatic failover.

    - Put one or more secondary replicas in the secondary datacenter. Configure these to use *asynchronous* commit, for performance reasons. (Otherwise, all SQL transactions have to wait on a round trip over the network to the secondary region.) 

    > [AZURE.NOTE] Asynchronous commit replicas do not support automatic failover. 

For more information, see [Azure reference architecture: Virtual datacenter](guidance-compute-n-tier-vm.md#SQL-AlwaysOn-Availability-Group).

## Availability considerations

With a complex N-tier app, you may not need to replicate the entire application in the secondary datacenter. Instead, you might just replicate a critical subsystem that is needed to support business continuity.

Traffic Manager is a possible failure point in the system. If the service fails, clients cannot access your application during the downtime. Review the [Traffic Manager SLA][tm-sla], and determine whether using Traffic Manager alone meets your business requirements for high availability. If not, consider adding another traffic management solution as a failback. If the Azure Traffic Manager service fails, change your CNAME records in DNS to point to the other traffic management service. (This step must be performed manually, and your application will be unavailable until the DNS changes are propagated.) 

For the SQL Server cluster, there are two failover scenarios to consider:

1. All of the SQL replicas in the primary datacenter fail. For example, this could happen during a regional outage. In that case, you must manually fail over the SQL availability group, even though Traffic Manager automatically fails over on the front end. Follow the steps in [Perform a Forced Manual Failover of a SQL Server Availability Group](https://msdn.microsoft.com/library/ff877957.aspx), which describes how to perform a forced failover by using SQL Server Management Studio, Transact-SQL, or PowerShell in SQL Server 2016. 

    > [AZURE.WARNING] With forced failover, there is a risk of data loss. Once the primary datacenter is back online, take a snapshot of the database and use [tablediff] to find the differences.

2. Traffic Manager fails over to the secondary datacenter, but the primary SQL replica is still available. For example, the front-end tier might fail, without affecting the SQL VMs. In that case, Internet traffic is routed to the secondary datacenter, and that datacenter can still connect to the primary SQL replica. However, there will be increased latency, because the SQL connections are going across datacenters. In this situation, you should perform a manual failover as follows: 

    - Temporarily switch a SQL replica in the secondary datacenter to *synchronous* commit. This ensures there won't be data loss during the failover.
    
    - Fail over to that SQL replica. 
    
    - When you fail back to primary datacenter, restore the asynchronous commit setting. 

## Manageability considerations

When you update your deployment, update one datacenter at a time, to reduce the chance of a global failure from an incorrect configuration or an error in the application.

Test the resiliency of the system to failures. Here are some common failure scenarios to test:

- Shut down VM instances.

- Pressure resources such as CPU and memory.

- Disconnect/delay network.

- Crash processes.

- Expire certificates.

- Simulate hardware faults.

- Shut down the DNS service on the domain controllers.

Measure the recovery times and verify they meet your business requirements. Test combinations of failure modes, as well.

## Next steps

- This series has focused on pure cloud deployments. Enterprise scenarios often require a hybrid network, connecting an on-premises network with an Azure virtual network. To learn how to build such a hybrid network, see [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][hybrid-vpn].

<!-- Links -->

[azure-sla]: https://azure.microsoft.com/support/legal/sla/
[azure-sql-db]: https://azure.microsoft.com/en-us/documentation/services/sql-database/
[health-endpoint-monitoring-pattern]: https://msdn.microsoft.com/library/dn589789.aspx
[hybrid-vpn]: guidance-hybrid-network-vpn.md
[regional-pairs]: ../best-practices-availability-paired-regions.md
[resource groups]: ../resource-group-overview.md
[resource-group-links]: ../resource-group-link-resources.md
[services-by-region]: https://azure.microsoft.com/en-us/regions/#services
[sql-always-on]: https://msdn.microsoft.com/en-us/library/hh510230.aspx
[tablediff]: https://msdn.microsoft.com/en-us/library/ms162843.aspx
[tm-configure-failover]: ../traffic-manager/traffic-manager-configure-failover-routing-method.md
[tm-monitoring]: ../traffic-manager/traffic-manager-monitoring.md
[tm-routing]: ../traffic-manager/traffic-manager-routing-methods.md
[tm-sla]: https://azure.microsoft.com/en-us/support/legal/sla/traffic-manager/v1_0/
[traffic-manager]: https://azure.microsoft.com/en-us/services/traffic-manager/
[vnet-dns]: ../virtual-network/virtual-networks-manage-dns-in-vnet.md
[vnet-to-vnet]: ../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md
[vpn-gateway]: ../vpn-gateway/vpn-gateway-about-vpngateways.md
[wsfc]: https://msdn.microsoft.com/en-us/library/hh270278.aspx
[0]: ./media/blueprints/compute-multi-dc.png "Highly available network architecture for Azure N-tier applications"