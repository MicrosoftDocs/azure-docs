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

Azure Virtual Machines provide reliability through built-in redundancy and support for availability zones. Key components include:

- **Availability zones**: Physically separate locations within an Azure region, each with independent power, cooling, and networking.
- **Zone-redundant resources**: Automatically distributed across availability zones to ensure resiliency against zone failures.
- **Zonal resources**: Deployed into a single, customer-selected availability zone, requiring customer-managed failover for resiliency.

For more information, see [Azure services with availability zones](availability-zones-service-support.md).

## Prerequisites

To ensure reliability for your Azure Virtual Machine host, the following prerequisites must be met. These prerequisites apply to the Azure VM host itself and not the software running on the VM.

- **Supported VM SKUs**: Ensure that your VM SKU is supported in the desired region and availability zones. Check [VM SKU availability](regions-list.md).
- **Availability zone readiness**: Verify that your region supports availability zones and that your VM SKU is available across all zones in the region.
- **Configuration for redundancy**: Configure your VM for zone-redundant or zonal deployment to achieve higher reliability.

For a list of supported services, see [Azure services with availability zones](availability-zones-service-support.md).

## Transient faults

Transient faults are temporary issues that occur in cloud environments, such as network interruptions or service unavailability, and typically resolve themselves without intervention. Azure Virtual Machines handle transient faults through automatic retries and self-healing mechanisms, but some software can be adversely affected.

- Implement retry logic in applications to handle transient errors.
- Use Azure SDKs, which include built-in retry policies.
- Monitor and log transient faults to identify patterns and optimize fault handling.

For more details, see [Transient fault handling](../architecture/best-practices/transient-faults.md).

## Availability zone support

Availability zones are physically separate groups of datacenters within each Azure region. When one zone fails, services can fail over to one of the remaining zones.

Azure Virtual Machines support both zonal and zone-redundant configurations:

- **Zonal**: Resources are deployed into a single availability zone. Customers can achieve zone resiliency by deploying multiple instances across zones and managing failover.
- **Zone-redundant**: Resources are automatically distributed across availability zones, ensuring resiliency against zone failures.

>[!NOTE]
> Not all VM SKUs are available in all zones. Check [VM SKU availability](regions-list.md).

Configure availability zone support and learn more about zone-redundancy:

- [Availability options for VMs](/azure/virtual-machines/availability)
- [Migrate existing VMs to availability zones](migrate-vm.md)

## Multi-region support

Multi-region support helps ensure that data and services remain available even if one Azure region experiences an outage. Azure Virtual Machines achieve this redundancy through various features.

- **Azure Site Recovery**: Enables disaster recovery by replicating VMs to a secondary region.
- **Geo-replication**: Ensures data availability across regions.

Multi-region support requires customer configuration and management. It is not enabled by default. For more information, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture).

>[!IMPORTANT]
>When selecting regions for your virtual machines, ensure they comply with data residency requirements and legal jurisdictions, such as GDPR for European Union data. This ensures that the data your virtual machines interact with or store remains compliant with applicable regulations.

## Backup

Azure Virtual Machines natively support backup through the Azure Backup service. This provides a native solution for protecting Azure Virtual Machines by creating and managing backups.

- **Backup frequency**: Configure daily or weekly backups.
- **Retention policies**: Define how long backups are retained.

>[!NOTE]
>Backup performance may vary based on VM size and region. For more details, see [Azure Backup for VMs](../backup/backup-azure-vms-introduction.md).

## Capacity and proactive disaster recovery resiliency

Proactive disaster recovery ensures that resources are pre-allocated and configured to handle potential failures. Azure Virtual Machines operate under the [Shared Responsibility Model](./concept-shared-responsibility.md), which means customers are responsible for ensuring disaster recovery (DR) for the services they deploy and control.

- **Pre-deploy secondary resources**: Ensure secondary resources are pre-allocated to guarantee capacity during an impact event.
- **Flexible orchestration mode**: Use [flexible orchestration mode](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#scale-sets-with-flexible-orchestration) in Virtual Machine Scale Sets to distribute VMs across fault domains within a region or availability zone.

Flexible orchestration mode supports all VM sizes and provides high availability guarantees by spreading VMs across fault domains, ensuring resiliency for up to 1,000 VMs.

For more information, see [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/).

## Zone-down experiences

Zone-down experiences describe how Azure Virtual Machines handle outages in a single availability zone. During a zone-wide outage, Azure Virtual Machines leverage self-healing mechanisms to rebalance capacity across healthy zones.

- **Performance degradation**: Temporary performance degradation may occur until the self-healing process completes.
- **Self-healing**: Microsoft-managed services automatically compensate for a lost zone by reallocating capacity from other zones. This process is independent of zone restoration.

For scenarios involving regional outages, geo-replication ensures data availability in a secondary region.

- Enable [geo-replication](../backup/backup-azure-vms-introduction.md) for critical data.
- Configure [Azure Site Recovery](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-1-initiate-a-failover-by-using-azure-site-recovery) to prepare for regional disruptions.

For more information, see [Azure Backup for VMs](../backup/backup-azure-vms-introduction.md).

## SLAs

Service-Level Agreements (SLAs) outline customers' expectations for Azure Virtual Machines, including uptime guarantees and conditions. SLAs vary based on configuration.

- **Higher SLAs with availability zones**: Configuring VMs with availability zones increases SLA guarantees due to enhanced fault isolation and redundancy.
- **Conditions for SLA eligibility**: Customers must ensure proper configuration, such as using zone-redundant or zonal deployments, to qualify for higher SLAs.
- **Limitations**: SLAs do not cover scenarios involving customer misconfigurations or unsupported VM SKUs.

For detailed SLA terms and conditions, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/).

## Next steps

- [Well-Architected Framework for virtual machines](/azure/architecture/framework/services/compute/virtual-machines/virtual-machines-review)
- [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture)
- [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)
- [Reliability in Azure](/azure/reliability/availability-zones-overview)