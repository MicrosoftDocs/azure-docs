---
title: Reliability in Azure Virtual Machines
description: Find out about reliability in Azure Virtual Machines 
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-virtual-machines
ms.date: 07/08/2025
---

# Reliability in Virtual Machines

Azure Virtual Machines (VMs) provide reliability through built-in redundancy and support for availability zones. Key components include:

- **Availability zones**: Physically separate locations within an Azure region, each with independent power, cooling, and networking.
- **Zone-redundant resources**: Automatically distributed across availability zones to ensure resiliency against zone failures.
- **Zonal resources**: Deployed into a single, customer-selected availability zone, requiring customer-managed failover for resiliency.
- **Availability sets**: Logical groupings of VMs that ensure redundancy by distributing VMs across fault domains and upgrade domains. For more information, see [Availability sets](../virtual-machines/availability-set-overview.md).

For more information, see [Azure services with availability zones](availability-zones-service-support.md).

> [!IMPORTANT]
> When you consider the reliability of a VM, also consider the reliability of your disks, your network infrastructure, and the applications that run on your VMs. Even if you increase the resiliency of a VM, that increase might not be impactful if your other resources and applications aren't also resilient. Depending on your resiliency requirements, you may need to make configuration changes across multiple areas.

## Production deployment recommendations

To learn about how to deploy VMs to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Virtual Machines and scale sets in the Azure Well-Architected Framework](/azure/well-architected/service-guides/virtual-machines).

## Reliability architecture overview

VMs are the fundamental unit of compute in Azure. You can provision a VM yourself to run your own applications, or you can use other Azure compute services, many of which create and manage VMs transparently to you.

A single VM runs in one place. Azure provides you the ability to control exactly where a VM runs, and to make tradeoffs between different factors like reliability and latency:

- **Region:** You can select which [Azure region](./regions-overview.md) your VM should run in.

- **Availability zone:** [Availability zones](/azure/reliability/availability-zones-overview) are physically separate groups of datacenters within each Azure region. [In regions that support availability zones](./availability-zones-overview.md), you can select which zone the VM runs in. To learn more, see [Availability zone support](#availability-zone-support) later in this article.

- **Availability sets:** An availability set is a logical grouping of VMs that allows Azure to understand how your application is built to provide for redundancy and availability.

    When you use availability sets, you can place different VMs in different [fault domains](/azure/virtual-machines/availability-set-overview#fault-domains). This distribution minimizes the risk of localized hardware failures by grouping virtual machines that share a common power source and network switch.

    You can also place different VMs in different [update domains](/azure/virtual-machines/availability-set-overview#update-domains), which controls how the Azure platform rolls out upgrades. By using upgrade domains, you can ensure that only a subset of your VMs are restarted for updates at one time.

- **Proximity placement groups:** For workloads that need to achieve the lowest possible latency between VMs, you can use a [proximity placement group](/azure/virtual-machines/co-location) to ensure Azure places the VMs physically close to each other. However, proximity placement means that an outage of the datacenter can affect all of the VMs in the group. To achieve high reliability you might need to provision multiple proximity placement groups in different availability zones.

- **Dedicated hosts:** You can use [Azure Dedicated Hosts](/azure/virtual-machines/dedicated-hosts) to provision your own physical server that runs one or more VMs. When you provision a dedicated host, an outage in the datacenter can affect all of the VMs on that host. To achieve high reliability you might need to provision multiple dedicated hosts in different availability zones.

If you're creating a set of VMs that perform similar functions, consider using virtual machine scale sets to create and manage the VMs as a group. Scale sets also provide more reliability options, such as spreading the VMs across multiple availability zones for you.

To learn more about availability for VMs, see [Availability options for Azure Virtual Machines](/azure/virtual-machines/availability).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Applications running on VMs should implement appropriate fault-handling strategies to ensure that any temporary interruptions in service don't impact your workload.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

An individual VM can be deployed in a *zonal* configuration, which means it's pinned to single availability zone that you select. By itself, a zonal VM isn't resilient to zone outages. However, you can create multiple VMs and place them in different availability zones, then spread your applications and data across the VM instances. Alternatively, you can use [Virtual Machine Scale Sets](../virtual-machine-scale-sets/) to create a set of virtual machines and spread them across zones.

If you don't configure a VM to be zonal then it's considered to be *nonzonal* or *regional*. Nonzonal VMs can be placed in any availability zone within the region. If any availability zone in the region experiences an outage, nonzonal VMs might be in the affected zone and could experience downtime.

### Region support

Zonal VMs can be deployed into [any region that supports availability zones](./regions-list.md).

However, some VM types and sizes are only available in specific regions, or specific zones within a region. To check which regions and zones support the VM types you need, use these resources:

- [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) to check the VM types available in each region.
- [Check VM SKU availability](/azure/virtual-machines/linux/create-cli-availability-zone#check-vm-sku-availability) to check the supported VM types and sizes within each zone of a specific region.

### Cost

There is no cost difference between a zonal and nonzonal VM.

### Configure availability zone support

This section explains how to configure availability zone support for your virtual machine instance.

> [!NOTE]
> [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Create a zonal virtual machine**: TODO
    - CLI https://learn.microsoft.com/en-us/azure/virtual-machines/linux/create-cli-availability-zone
    - PowerShell https://learn.microsoft.com/en-us/azure/virtual-machines/windows/create-powershell-availability-zone
    - Portal https://learn.microsoft.com/en-us/azure/virtual-machines/create-portal-availability-zone

- **Convert existing virtual machines to a zonal configuration:** 
    - https://learn.microsoft.com/en-us/azure/virtual-machines/move-virtual-machines-regional-zonal-portal

- **Change the availability zone of an existing zonal virtual machine:** Zonal VMs can't be moved to a different availability zone. You need to deploy a new zonal VM in the desired availability zone instead.

- **Convert a zonal VM to nonzonal:** Zonal VMs can't be converted to a nonzonal configuration. You need to deploy a new nonzonal VM instead.

### Normal operations

This section describes what to expect when virtual machine instances are configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** You're responsible for routing traffic between VMs, including VMs that are in different availability zones. Common approaches include Azure Load Balancer and Azure Application Gateway.

- **Data replication between zones:** You're responsible for any data replication that needs to happen between VMs, including across VMs in different availability zones. Databases and other similar stateful applications that run on VMs often provide capabilities to replicate data.

### Zone-down experience

This section describes what to expect when virtual machine instances are configured with availability zone support and there's an outage in its availability zone.

- **Detection and response**: You're responsible for detecting and responding to zone failures that affect your virtual machines.

- **Notification**: Use Azure Resource Health to detect zone failures and trigger failover processes.

- **Active requests**: Any active requests or other work happening on the VM during the zone failure are likely to be terminated.

- **Expected data loss**: Zonal VM disks might be unavailable during a zone failure. You can use zone-redundant disks to TODO force detach.

- **Expected downtime**: VMs remain down until the availability zone recovers.

- **Traffic rerouting**: You're responsible for reroute traffic to other VMs in healthy zones.

    If you use a zone-resilient load balancer and it's configured to perform health checks, the load balancer typically detects failed VMs and can route traffic to other VM instances in healthy zones.

### Failback

Once the zone is healthy, VMs in the zone restart. You're responsible for any failback procedures and data synchronization as required by your workloads. <!-- TODO is this automatic? Is there a timeframe? -->

### Testing for zone failures

Use Chaos Studio to simulate zone failures and test your failover processes. TODO MORE

## Multi-region support

Azure Virtual Machines are single-region resources. If the region becomes unavailable, your VM is also unavailable.

### Alternative multi-region approaches

You can deploy multiple VMs into different regions, but you need to implement replication, load balancing, and failover processes.

**Azure Site Recovery** is a service that enables disaster recovery by replicating VMs and their data to a secondary region. To learn more, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture).

Some applications create clusters or other constructs to replicate data and distribute work across multiple VMs, including in different regions. These applications can simplify the configuration of a multi-region solution.

For an example architecture that illustrates using VMs across multiple regions, see [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Reliability during service maintenance

Azure Virtual Machines undergo periodic maintenance to ensure reliability. Customers can control maintenance timing using [customer-controlled maintenance](../virtual-machines/maintenance.md). For more information, see [VM maintenance](../virtual-machines/maintenance.md).

## Backup

Azure Virtual Machines natively support backup through the Azure Backup service. This provides a native solution for protecting Azure Virtual Machines by creating and managing backups.

- **Backup frequency**: Configure daily or weekly backups.
- **Retention policies**: Define how long backups are retained.

>[!NOTE]
>Backup performance may vary based on VM size and region. For more information, see [Azure Backup for VMs](../backup/backup-azure-vms-introduction.md).

## SLAs

Service-Level Agreements (SLAs) outline customers' expectations for Azure Virtual Machines, including uptime guarantees and conditions. SLAs vary based on configuration.

- **Higher SLAs with availability zones**: Configuring VMs with availability zones increases SLA guarantees due to enhanced fault isolation and redundancy.
- **Conditions for SLA eligibility**: Customers must ensure proper configuration, such as using zone-redundant or zonal deployments, to qualify for higher SLAs.
- **Limitations**: SLAs don't cover scenarios involving customer misconfigurations or unsupported VM SKUs.

For detailed SLA terms and conditions, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/).

## Next steps

- [Well-Architected Framework for virtual machines](/azure/architecture/framework/services/compute/virtual-machines/virtual-machines-review)
- [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture)
- [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)
- [Reliability in Azure](/azure/reliability/availability-zones-overview)
