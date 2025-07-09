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

## Transient faults

Transient faults are temporary issues that occur in cloud environments, such as network interruptions or service unavailability, and typically resolve themselves without intervention. Azure Virtual Machines handle transient faults through automatic retries and self-healing mechanisms, but applications running on VMs must implement appropriate fault-handling strategies.

- Implement retry logic in applications to handle transient errors.
- Use Azure SDKs, which include built-in retry policies.
- Monitor and log transient faults to identify patterns and optimize fault handling.

For more information, see [Transient fault handling](../architecture/best-practices/transient-faults.md).

## Availability zone support

Availability zones are physically separate groups of datacenters within each Azure region. A VM can be deployed in a zonal configuration, where it resides in a single availability zone, or spread across zones manually or using Virtual Machine Scale Sets. For more information, see [Virtual Machine Scale Sets](../virtual-machine-scale-sets/).

>[!NOTE]
> Not all VM SKUs are available in all zones. Check [VM SKU availability](regions-list.md).

Configure availability zone support and learn more about zone resiliency:

- [Availability options for VMs](/azure/virtual-machines/availability)
- [Migrate existing VMs to availability zones](migrate-vm.md)

## Multi-region support

Azure Virtual Machines are inherently single-region resources. If you want to use multiple regions, you need to deploy multiple VMs and handle replication and failover yourself.

- **Azure Site Recovery**: Enables disaster recovery by replicating VMs to a secondary region.
- **Geo-replication**: Ensures data availability across regions.

For alternative multi-region approaches, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture).

>[!IMPORTANT]
>When selecting regions for your virtual machines, ensure they comply with data residency requirements and legal jurisdictions, such as GDPR for European Union data. This ensures that the data your virtual machines interact with or store remains compliant with applicable regulations.

## Zone-down experiences

Zone-down experiences describe how Azure Virtual Machines handle outages in a single availability zone. During a zone-wide outage, Azure Virtual Machines apply self-healing mechanisms to rebalance capacity across healthy zones. However, customers are responsible for detecting and responding to zone failures.

- **Detection and response**: Use Azure Resource Health to detect zone failures and trigger failover processes.
- **Notification**: Azure Resource Health provides notifications when a zone is down.
- **Active requests**: Any active requests on the VM during the zone failure are likely to be lost.
- **Expected data loss**: VM disks are unavailable during a zone failure. To mitigate this, use zone-redundant disks. For more information, see the upcoming Disk Storage guide.
- **Expected downtime**: VMs remain down until the availability zone recovers.
- **Traffic rerouting**: Customers must reroute traffic to other VMs in healthy zones.
- **Failback**: Once the zone is healthy, VMs restart. Customers must handle failback procedures and data synchronization as required.
- **Testing for zone failures**: Use Chaos Studio to simulate zone failures and test your failover processes.

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