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

Azure Virtual Machines (VMs) provides on-demand, scalable compute resources. As a foundational infrastructure service, VMs are designed to deliver enterprise-grade reliability and availability for mission-critical workloads.

This article describes reliability support in [Azure Virtual Machines](/azure/virtual-machines/overview), including support for availability zones, backups, and maintaining reliability during platform maintenance.

> [!IMPORTANT]
> When you consider the reliability of a VM, also consider the reliability of your disks, your network infrastructure, and the applications that run on your VMs. Even if you increase the resiliency of a VM, that increase might not be impactful if your other resources and applications aren't also resilient. Depending on your resiliency requirements, you may need to make configuration changes across multiple areas.

## Production deployment recommendations

To learn about how to deploy VMs to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Virtual Machines and scale sets in the Azure Well-Architected Framework](/azure/well-architected/service-guides/virtual-machines).

## Reliability architecture overview

VMs are the fundamental compute unit in Azure, whether you provision the VMs yourself or use other Azure compute services that transparently provision and manage them for you.

An individual VM is sometimes called a *single instance VM*, and it runs in one place. VMs run on a *host*, which is a physical server. Most VMs run on shared hosts.

An individual VM is sometimes called a *single instance VM*. It runs on a specific host - a physical server. Most VMs share their host with other VMs.

Azure gives you control over where your virtual machines (VMs) run by letting you make tradeoffs between reliability, latency, and proximity. These options help you influence how Azure places your VM on that underlying infrastructure:

- **Region:** You can select which [Azure region](./regions-overview.md) your VM should run in. A region is a geographic area that might contain multiple datacenters, each with a large number of hosts.

- **Availability zone:** [Availability zones](/azure/reliability/availability-zones-overview) are physically separate groups of datacenters within each Azure region. [In regions that support availability zones](./availability-zones-overview.md), you can select which zone the VM runs in. To learn more, see [Availability zone support](#availability-zone-support) later in this article.

- **Availability sets:** An availability set is a logical grouping of VMs that allows Azure to understand how your application is built to provide for redundancy and availability.

    When you use availability sets, you tell Azure to distribute a group of VMs across different [fault domains](/azure/virtual-machines/availability-set-overview#fault-domains). This distribution minimizes the risk of localized hardware failures by grouping virtual machines that share a common power source and network switch.

    Availabilty sets can also place different VMs in different [update domains](/azure/virtual-machines/availability-set-overview#update-domains), which controls how the Azure platform rolls out platform updates. By using update domains, you can ensure that only a subset of your VMs is restarted for updates at one time.

- **Proximity placement groups:** For workloads that need to achieve the lowest possible latency between VMs, you can use a [proximity placement group](/azure/virtual-machines/co-location) to ensure Azure places the VMs physically close to each other. However, proximity placement means that an outage of the datacenter can affect all of the VMs in the group. To achieve high reliability you might need to provision multiple proximity placement groups in different availability zones.

- **Dedicated hosts:** You can use [Azure Dedicated Hosts](/azure/virtual-machines/dedicated-hosts) to provision your own physical server that runs one or more VMs, such as for strict compliance requirements. However, when you provision a dedicated host, an outage in its datacenter can affect all of the VMs on that host. To achieve high reliability you might need to provision multiple dedicated hosts in different availability zones.

If you're creating a set of VMs that perform similar functions, consider using [virtual machine scale sets](/azure/virtual-machine-scale-sets/overview) to create and manage the VMs as a group. Scale sets also provide more reliability options, such as spreading the VMs across multiple availability zones for you.

To learn more about availability for VMs, see [Availability options for Azure Virtual Machines](/azure/virtual-machines/availability).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Applications running on your VMs should implement appropriate fault-handling strategies to ensure that any temporary interruptions in service don't impact your workload.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

An individual VM can be deployed in a *zonal* configuration, which means it's pinned to a single availability zone that you select. By itself, a zonal VM isn't resilient to zone outages. However, you can create multiple VMs and place them in different availability zones, then spread your applications and data across the VM instances. Alternatively, you can use [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview) to create a set of virtual machines and spread them across zones.

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

- **Create a zonal virtual machine**: You can create a zonal virtual machine using the following guides:
    - Azure portal: [Create virtual machines in an availability zone using the Azure portal](/azure/virtual-machines/create-portal-availability-zone)
    - Azure CLI: [Create a virtual machine in an availability zone using Azure CLI](/azure/virtual-machines/linux/create-cli-availability-zone)
    - Azure PowerShell: [Create a virtual machine in an availability zone using Azure PowerShell](/azure/virtual-machines/windows/create-powershell-availability-zone)

- **Convert existing virtual machines to a zonal configuration:** You can move from a nonzonal VM to a zonal VM. This process creates a new VM in the target availability zone, and requires that the VM be stopped during the move process. To learn more, see [Move Azure single instance VMs from regional to zonal target availability zones](/azure/virtual-machines/move-virtual-machines-regional-zonal-portal).

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

- **Expected data loss**: Zonal VM disks might be unavailable during a zone failure.

    If you use zone-redundant disks and your VM is affected by an outage, ou can [force detach](/rest/api/compute/virtual-machines/attach-detach-data-disks?tabs=HTTP#diskdetachoptiontypes) your ZRS disks from the failed VM, allowing you to then attach the ZRS disks to another VM.

- **Expected downtime**: VMs remain down until the availability zone recovers.

- **Traffic rerouting**: You're responsible for reroute traffic to other VMs in healthy zones.

    If you've configured a zone-resilient load balancer and it performs health checks, the load balancer typically detects failed VMs and can route traffic to other VM instances in healthy zones.

### Failback

Once the zone is healthy, VMs in the zone restart. You're responsible for any failback procedures and data synchronization as required by your workloads.

### Testing for zone failures

You can use Azure Chaos Studio to simulate the loss of a VM as part of an experiment. Chaos Studio provides [built-in faults for VMs](/azure/chaos-studio/chaos-studio-fault-library#virtual-machines-service-direct), including to shut down a VM. You can use these capabilities to simulate zone failures and test your failover processes.

## Multi-region support

Azure Virtual Machines are single-region resources. If the region becomes unavailable, your VM is also unavailable.

### Alternative multi-region approaches

You can deploy multiple VMs into different regions, but you need to implement replication, load balancing, and failover processes.

Azure Site Recovery is a service that enables disaster recovery by replicating VMs and their data to a secondary region. To learn more, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture).

Some applications create clusters or other constructs to replicate data and distribute work across multiple VMs, including in different regions. These applications can simplify the configuration of a multi-region solution.

For an example architecture that illustrates using VMs across multiple regions, see [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Reliability during service maintenance

Azure performs regular periodic maintenance on VMs to ensure reliability. There are multiple ways you can ensure your workloads remain operational during maintenance activities:

- When you use availability sets or virtual machine scale sets, you can configure update domains. Update domains help to distribute maintenance activities across different VMs at different times, so that your VMs don't all restart simultaneously.

- You can customise the timing that maintenance is applied to your VMs by using *maintenance control*. You can use maintenance configurations to schedule it at a time that suits your workload.

- You can receive notifications of upcoming maintenance activities.

For more information, see [Guest updates and host maintenance overview](/azure/virtual-machines/updates-maintenance-overview).

## Backup

Azure Virtual Machines natively support backup through the Azure Backup service. Azure Backup provides a native solution for protecting Azure Virtual Machines by creating and managing backups, with application-consistent protection for the entire virtual machine including all attached disks. This approach is ideal when you need coordinated backup of multiple disks or application-aware backups. For database workloads, consider application-specific backup solutions that provide transaction-consistent protection and faster recovery options.

You can customize how frequently backups are taken, how long they're retained for, and how the backups are stored. For more information, see [Azure Backup for VMs](../backup/backup-azure-vms-introduction.md).

Azure Backup also supports disks that are attached to VMs. To learn more, see [Azure Disk Backup](/azure/backup/disk-backup-overview).

## SLAs

The service-level agreement (SLA) for Azure Virutal Machines describes the expected availability of the service and the conditions that must be met to achieve that availability expectation.

The SLA provides a base level of availability for VMs. The uptime percentage defined in the SLA increases when you have two or more VMs, and you:
- Configure those VMs to be deployed across two or more availability zones, or
- Configure those VMs to be deployed into an availability set

For more information, see [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Next steps

- [Virtual machines in Azure](/azure/virtual-machines/overview)
- [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview)
- [Reliability in Azure](./overview.md)
