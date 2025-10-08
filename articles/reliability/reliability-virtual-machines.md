---
title: Reliability in Azure Virtual Machines
description: Learn how to ensure reliability and high availability in Azure Virtual Machines by using availability zones and multi-region deployments.
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-virtual-machines
ms.date: 09/10/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who needs to understand the details of how Azure Virtual Machines works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure Virtual Machines

Azure Virtual Machines provides on-demand, scalable compute resources. As a foundational infrastructure service, it's designed to deliver enterprise-grade reliability and availability for mission-critical workloads.

This article describes reliability support in [Virtual Machines](/azure/virtual-machines/overview), including support for availability zones, backups, and maintaining reliability during platform maintenance.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

> [!IMPORTANT]
> When you consider the reliability of a virtual machine (VM), you also need to consider the reliability of your disks, network infrastructure, and applications that run on your VMs. Improving the resiliency of the VM alone might have limited impact if the other components aren't equally resilient. Depending on your resiliency requirements, you might need to make configuration changes across multiple areas.

## Production deployment recommendations

For more information about how to deploy VMs to support your solution's reliability requirements and how reliability affects other aspects of your architecture, see [Architecture best practices for Virtual Machines and scale sets in the Azure Well-Architected Framework](/azure/well-architected/service-guides/virtual-machines).

## Reliability architecture overview

VMs are the fundamental compute unit in Azure, whether you provision the VMs yourself or use other Azure compute services that transparently provision and manage them for you.

An individual VM is also known as a *single instance VM*. It runs on a specific host, which is a physical server. Most VMs share their host with other VMs.

When you create your VMs, you can influence where they run within the underlying infrastructure. Typically, you make placement decisions based on your requirements for reliability, latency, and isolation. Azure provides several configuration options that affect how your VMs are placed.

- **Region:** You can select which [Azure region](./regions-overview.md) that your VM should run in. A region is a geographic area that might contain multiple datacenters, each with a large number of hosts.

- **Availability zone:** [Availability zones](/azure/reliability/availability-zones-overview) are physically separate groups of datacenters within each Azure region. [In regions that support availability zones](./availability-zones-overview.md), you can select which zone the VM runs in. For more information, see [Availability zone support](#availability-zone-support).

- **Availability sets:** An availability set is a logical grouping of VMs that allows Azure to understand how your application is built to provide for redundancy and availability.

    When you use availability sets, Azure distributes a group of VMs across different [fault domains](/azure/virtual-machines/availability-set-overview#fault-domains). This distribution minimizes the risk of localized hardware failures by grouping VMs that share a common power source and network switch.

    Availability sets can also place different VMs in different [update domains](/azure/virtual-machines/availability-set-overview#update-domains), which controls how the Azure platform rolls out platform updates. By using update domains, you can ensure that only a subset of your VMs is restarted for updates at one time.

- **Proximity placement groups:** For workloads that need to achieve the lowest possible latency between VMs, you can use a [proximity placement group](/azure/virtual-machines/co-location) to ensure that Azure places the VMs physically close to each other. However, proximity placement means that an outage of the datacenter can affect all of the VMs in the group. To achieve high reliability, you might need to provision multiple proximity placement groups in different availability zones.

- **Dedicated hosts:** You can use [Azure Dedicated Host](/azure/virtual-machines/dedicated-hosts) to provision your own physical server that runs one or more VMs, such as for strict compliance requirements. However, when you provision a dedicated host, an outage in its datacenter can affect all of the VMs on that host. To achieve high reliability, you might need to provision multiple dedicated hosts in different availability zones.

If you create a set of VMs that perform similar functions, consider using [Azure Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview) to create and manage the VMs as a group. Scale sets also provide more reliability options, such as spreading the VMs across multiple availability zones.

For more information about availability for VMs, see [Availability options for Virtual Machines](/azure/virtual-machines/availability).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Applications that run on your VMs should implement appropriate fault-handling strategies to ensure that any temporary interruptions in service don't affect your workload.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

An individual VM can be deployed in a *zonal* configuration, which means that it's pinned to a single availability zone that you select. By itself, a zonal VM isn't resilient to zone outages. However, you can create multiple VMs and place them in different availability zones, then spread your applications and data across the VM instances. Alternatively, you can use [virtual machine scale sets](/azure/virtual-machine-scale-sets/overview) to deploy a set of VMs across multiple availability zones.

If you don't configure a VM to be zonal, it's considered *nonzonal* or *regional*. Nonzonal VMs might be placed in any availability zone within the region. If any availability zone in the region experiences an outage, nonzonal VMs might be in the affected zone and can experience downtime.

### Region support

Zonal VMs can be deployed into [any region that supports availability zones](./regions-list.md).

However, some VM types and sizes are only available in specific regions, or specific zones within a region. To check which regions and zones support the VM types that you need, use the following resources:

- To check the VM types available in each region, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

- To check the supported VM types and sizes within each zone of a specific region, see [Check VM SKU availability](/azure/virtual-machines/linux/create-cli-availability-zone#check-vm-sku-availability).

### Cost

There's no cost difference between a zonal and nonzonal VM.

### Configure availability zone support

This section explains how to configure availability zone support for your VM instance.

> [!NOTE]
> [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Create a zonal VM.** You can create a zonal VM by using the following guides:

    - [Create VMs in an availability zone by using the Azure portal](/azure/virtual-machines/create-portal-availability-zone)
    - [Create a VM in an availability zone by using the Azure CLI](/azure/virtual-machines/linux/create-cli-availability-zone)
    - [Create a VM in an availability zone by using Azure PowerShell](/azure/virtual-machines/windows/create-powershell-availability-zone)

- **Convert existing VMs to a zonal configuration.** You can move from a nonzonal VM to a zonal VM. This process creates a new VM in the target availability zone and requires that the VM be stopped during the move process. For more information, see [Move Azure single instance VMs from regional to zonal target availability zones](/azure/virtual-machines/move-virtual-machines-regional-zonal-portal).

- **Change the availability zone of an existing zonal VM.** Zonal VMs can't be moved to a different availability zone. You need to deploy a new zonal VM in the desired availability zone instead.

- **Convert a zonal VM to a nonzonal configuration.** Zonal VMs can't be converted to a nonzonal configuration. You need to deploy a new nonzonal VM instead.

### Normal operations

This section describes what to expect when VM instances are configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** You're responsible for routing traffic between VMs, including VMs that are in different availability zones. Common approaches include Azure Load Balancer and Azure Application Gateway. For more information, see [Load balancing options](/azure/architecture/guide/technology-choices/load-balancing-overview).

- **Data replication between zones:** You're responsible for any data replication that needs to happen between VMs, including across VMs in different availability zones. Databases and other similar stateful applications that run on VMs often provide capabilities to replicate data.

### Zone-down experience

This section describes what to expect when VM instances are configured with availability zone support and there's an outage in their availability zones.

- **Detection and response:** You're responsible for detecting and responding to zone failures that affect your VMs.

- **Notification:** Use [Azure Resource Health](/azure/service-health/resource-health-overview) to detect zone failures and trigger failover processes.

- **Active requests:** Any active requests or other work that occurs on the VM during the zone failure are likely to be terminated.

- **Expected data loss:** Zonal VM disks might be unavailable during a zone failure.

    If you use zone-redundant storage (ZRS) disks and an outage affects your VM, you can [force detach](/rest/api/compute/virtual-machines/attach-detach-data-disks?tabs=HTTP#diskdetachoptiontypes) your ZRS disks from the failed VM. This approach allows you to attach the ZRS disks to another VM.

- **Expected downtime:** VMs remain down until the availability zone recovers.

- **Traffic rerouting:** You're responsible for rerouting traffic to other VMs in healthy zones.

    If you configure a zone-resilient load balancer and it performs health checks, the load balancer typically detects failed VMs and can route traffic to other VM instances in healthy zones.

### Zone recovery

After the zone is healthy, VMs in the zone restart. You're responsible for any zone recovery procedures and data synchronization that your workloads require.

### Testing for zone failures

You can use Azure Chaos Studio to simulate the loss of a VM as part of an experiment. Chaos Studio provides [built-in faults for VMs](/azure/chaos-studio/chaos-studio-fault-library#virtual-machines-service-direct), including the ability to shut down a VM. You can use these capabilities to simulate zone-level failures and test your failover processes.

### Alternative multi-zone approaches

When you deploy multiple VMs into different zones, you're responsible for configuring and managing replication, load balancing, failover, and failback processes.

Some applications provide built-in capabilities that can help when you deploy across multiple VMs. For example, [SQL Server on Azure VMs](/azure/azure-sql/virtual-machines/windows/business-continuity-high-availability-disaster-recovery-hadr-overview) provides a set of capabilities to simplify your configuration and management processes across availability zones.

You can consider using [Azure Site Recovery zone-to-zone disaster recovery (DR)](/azure/site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery) when your application runs in a single zone at a time and you don't require near-instant failover between zones. Zone-to-zone DR has some important limitations, so review your requirements thoroughly.

## Multi-region support

Azure VMs are single-region resources. If the region becomes unavailable, your VM is also unavailable.

### Alternative multi-region approaches

You can deploy multiple VMs into different regions, but you need to implement replication, load balancing, and failover processes.

Site Recovery is a service that enables DR by replicating VMs and their data to a secondary region. You can select almost any Azure region as your secondary region, including nonpaired region combinations. For more information, see [Azure to Azure DR architecture](/azure/site-recovery/azure-to-azure-architecture).

Some applications create clusters or other constructs to replicate data and distribute work across multiple VMs, including in different regions. These applications can simplify the configuration of a multi-region solution.

For an example architecture that illustrates using VMs across multiple regions, see [Multi-region load balancing with Azure Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Reliability during service maintenance

Azure performs regular periodic maintenance on VMs to ensure reliability. There are multiple ways that you can ensure your workloads remain operational during maintenance activities:

- When you use availability sets or virtual machine scale sets, you can configure update domains. Update domains help distribute maintenance activities across different VMs at different times, so your VMs don't all restart simultaneously.

- You can customize the timing that maintenance is applied to your VMs by using *maintenance control*. You can use maintenance configurations to schedule it at a time that suits your workload.

- You can receive notifications of upcoming maintenance activities.

For more information, see [Guest updates and host maintenance overview](/azure/virtual-machines/updates-maintenance-overview).

## Backup

Virtual Machines natively supports backup through Azure Backup. Azure Backup provides a native solution for protecting Virtual Machines by creating and managing backups, with application-consistent protection for the entire VM, including all attached disks. This approach is ideal when you need coordinated backup of multiple disks or application-aware backups. For database workloads, consider application-specific backup solutions that provide transaction-consistent protection and faster recovery options.

You can customize the backup frequency, retention duration, and storage configuration to suit your needs. For more information, see [Azure Backup for VMs](../backup/backup-azure-vms-introduction.md).

Backup also supports disks that are attached to VMs. For more information, see [Overview of Azure Disk Backup](/azure/backup/disk-backup-overview).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

For VMs, the SLA provides a base level of availability. The uptime percentage defined in the SLA increases when you have two or more VMs and you take the following actions:

- Configure those VMs to be deployed across two or more availability zones.
- Configure those VMs to be deployed into an availability set.

For more information, see [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Next steps

- [VMs in Azure](/azure/virtual-machines/overview)
- [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview)

## Related resource

- [Reliability in Azure](./overview.md)
