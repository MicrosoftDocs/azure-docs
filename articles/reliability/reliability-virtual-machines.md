---
title: Reliability in Azure Virtual Machines
description: Find out about reliability in Azure Virtual Machines 
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-virtual-machines
ms.date: 10/31/2024
---

# Reliability in Virtual Machines

This article contains detailed information on VM regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). 


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Virtual machines support availability zones with three availability zones per supported Azure region and are also zone-redundant and zonal. For more information, see [Azure services with availability zones](availability-zones-service-support.md). The customer is responsible for configuring and migrating their virtual machines for availability. 

To learn more about availability zone readiness options, see:

- See [availability options for VMs](/azure/virtual-machines/availability)
- Review [availability zone service support](./availability-zones-service-support.md) and [region support](availability-zones-region-support.md)
- [Migrate existing VMs](migrate-vm.md) to availability zones

 
### Prerequisites

- Your virtual machine SKUs must be available across the zones in for your region. To review which regions support availability zones, see the [list of supported regions](availability-zones-region-support.md).

- Your VM SKUs must be available across the zones in your region. To check for VM SKU availability, use one of the following methods:

    - Use PowerShell to [Check VM SKU availability](/azure/virtual-machines/windows/create-powershell-availability-zone#check-vm-sku-availability).
    - Use the Azure CLI to [Check VM SKU availability](/azure/virtual-machines/linux/create-cli-availability-zone#check-vm-sku-availability).
    - Go to [Azure services with availability zone support](availability-zones-service-support.md#compute).
    

### SLA improvements

Because availability zones are physically separate and provide distinct power source, network, and cooling, SLAs (Service-level agreements) increase. For more information, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/).

### Create a resource with availability zones enabled

Get started by creating a virtual machine (VM) with availability zone enabled from the following deployment options below:
- [Azure CLI](/azure/virtual-machines/linux/create-cli-availability-zone)
- [PowerShell](/azure/virtual-machines/windows/create-powershell-availability-zone)
- [Azure portal](/azure/virtual-machines/create-portal-availability-zone)

### Zonal failover support

You can set up virtual machines to fail over to another zone using the Site Recovery service. For more information, see [Site Recovery](../site-recovery/site-recovery-overview.md).

### Fault tolerance

Virtual machines can fail over to another server in a cluster, with the VM's operating system restarting on the new server. You should refer to the failover process for disaster recovery, gathering virtual machines in recovery planning, and running disaster recovery drills to ensure their fault tolerance solution is successful.

For more information, see the [site recovery processes](../site-recovery/site-recovery-failover.md#before-you-start).


### Zone down experience

During a zone-wide outage, you should expect a brief degradation of performance until the virtual machine service self-healing rebalances underlying capacity to adjust to healthy zones. Self-healing isn't dependent on zone restoration; it's expected that the Microsoft-managed service self-healing state compensates for a lost zone, using capacity from other zones.

You should also prepare for the possibility that there's an outage of an entire region. If there's a service disruption for an entire region, the locally redundant copies of your data would temporarily be unavailable. If geo-replication is enabled, three other copies of your Azure Storage blobs and tables are stored in a different region. When there's a complete regional outage or a disaster in which the primary region isn't recoverable, Azure remaps all of the DNS entries to the geo-replicated region.

#### Zone outage preparation and recovery

The following guidance is provided for Azure virtual machines during a service disruption of the entire region where your Azure virtual machine application is deployed:

- Configure [Azure Site Recovery](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-1-initiate-a-failover-by-using-azure-site-recovery) for your VMs
- Check the [Azure Service Health Dashboard](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-2-wait-for-recovery) status if Azure Site Recovery hasn't been configured
- Review how the [Azure Backup service](../backup/backup-azure-vms-introduction.md) works for VMs
    - See the [support matrix](../backup/backup-support-matrix-iaas.md) for Azure VM backups
- Determine which [VM restore option and scenario](../backup/about-azure-vm-restore.md) works best for your environment

### Low-latency design

Cross Region (secondary region), Cross Subscription (preview), and Cross Zonal (preview) are available options to consider when designing a low-latency virtual machine solution. For more information on these options, see the [supported restore methods](../backup/backup-support-matrix-iaas.md#supported-restore-methods).

>[!IMPORTANT]
>By opting out of zone-aware deployment, you forego protection from isolation of underlying faults. Use of SKUs that don't support availability zones or opting out from availability zone configuration forces reliance on resources that don't obey zone placement and separation (including underlying dependencies of these resources). These resources shouldn't be expected to survive zone-down scenarios. Solutions that leverage such resources should define a disaster recovery strategy and configure a recovery of the solution in another region.

### Safe deployment techniques

When you opt for availability zones isolation, you should utilize safe deployment techniques for application code and application upgrades. In addition to [configuring Azure Site Recovery](#zone-outage-preparation-and-recovery), and implement any one of the following safe deployment techniques for VMs:

- [Virtual Machine Scale Sets](/azure/virtual-machines/flexible-virtual-machine-scale-sets)
- [Azure Load Balancer](../load-balancer/load-balancer-overview.md)
- [Azure Storage Redundancy](../storage/common/storage-redundancy.md)


As Microsoft periodically performs planned maintenance updates, there may be rare instances when these updates require a reboot of your virtual machine to apply the required updates to the underlying infrastructure. To learn more, see [availability considerations](/azure/virtual-machines/maintenance-and-updates#availability-considerations-during-scheduled-maintenance) during scheduled maintenance. 

Before you upgrade your next set of nodes in another zone, you should perform the following tasks:

- Check the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) for the virtual machines service status for your expected regions.
- Ensure that [replication](../site-recovery/azure-to-azure-quickstart.md) is enabled on your VMs.


### Migrate to availability zone support

To learn how to migrate a VM to availability zone support, see [Migrate Virtual Machines and Virtual Machine Scale Sets to availability zone support](./migrate-vm.md).

- Move a VM to another subscription or resource group
    - [CLI](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-cli)
    - [PowerShell](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-powershell)
- [Azure Resource Mover](/azure/resource-mover/tutorial-move-region-virtual-machines)
- [Move Azure VMs to availability zones](../site-recovery/move-azure-vms-avset-azone.md)
- [Move region maintenance configuration resources](/azure/virtual-machines/move-region-maintenance-configuration-resources)
  
## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

You can use Cross Region restore to restore Azure VMs via paired regions. With Cross Region restore, you can restore all the Azure VMs for the selected recovery point if the backup is done in the secondary region. For more information on Cross Region restore, refer to the Cross Region table row entry in our [restore options](../backup/backup-azure-arm-restore-vms.md#restore-options).

### Disaster recovery in multi-region geography


In the case of a region-wide service disruption, Microsoft works diligently to restore the virtual machine service. However, you still must rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data strategies for disaster recovery](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan).

#### Outage detection, notification, and management

Hardware or physical infrastructure for the virtual machine may fail unexpectedly. Unexpected failures can include local network failures, local disk failures, or other rack level failures. When detected, the Azure platform automatically migrates (heals) your virtual machine to a healthy physical machine in the same data center. During the healing procedure, virtual machines experience downtime (reboot) and in some cases loss of the temporary drive. The attached OS and data disks are always preserved.

For more detailed information on virtual machine service disruptions, see [disaster recovery guidance](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance).

#### Set up disaster recovery and outage detection 

When setting up disaster recovery for virtual machines, understand what [Azure Site Recovery provides](../site-recovery/site-recovery-overview.md#what-does-site-recovery-provide). Enable disaster recovery for virtual machines with the below methods:

- Set up disaster recovery to a [secondary Azure region for an Azure VM](../site-recovery/azure-to-azure-quickstart.md)
- Create a Recovery Services vault
    - [Bicep](../site-recovery/quickstart-create-vault-bicep.md)
    - [ARM template](../site-recovery/quickstart-create-vault-template.md)
- Enable disaster recovery for [Linux virtual machines](/azure/virtual-machines/linux/tutorial-disaster-recovery)
- Enable disaster recovery for [Windows virtual machines](/azure/virtual-machines/windows/tutorial-disaster-recovery)
- Fail over virtual machines to [another region](../site-recovery/azure-to-azure-tutorial-failover-failback.md)
- Fail over virtual machines to the [primary region](../site-recovery/azure-to-azure-tutorial-failback.md#fail-back-to-the-primary-region)

### Disaster recovery in single-region geography

With disaster recovery setup, Azure VMs continuously replicate to a different target region. If an outage occurs, you can fail over VMs to the secondary region, and access them from there.

When you replicate Azure VMs using [Site Recovery](../site-recovery/site-recovery-overview.md), all the VM disks are continuously replicated to the target region asynchronously. The recovery points are created every few minutes, which grants you a Recovery Point Objective (RPO) in the order of minutes. You can conduct disaster recovery drills as many times as you want, without affecting the production application or the ongoing replication. For more information, see [Run a disaster recovery drill to Azure](../site-recovery/tutorial-dr-drill-azure.md).

For more information, see [Azure VMs architectural components](../site-recovery/azure-to-azure-architecture.md#architectural-components) and [region pairing](/azure/virtual-machines/regions#region-pairs).

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the [Shared Responsibility Model](./availability-zones-overview.md#shared-responsibility-model). Shared responsibility means that for customer-enabled DR (customer-responsible services), you must address DR for any service they deploy and control. To ensure that recovery is proactive, you should always pre-deploy secondaries because there's no guarantee of capacity at time of impact for those who haven't preallocated.

For deploying virtual machines, you can use [flexible orchestration](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#scale-sets-with-flexible-orchestration) mode on Virtual Machine Scale Sets. All VM sizes can be used with flexible orchestration mode. Flexible orchestration mode also offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains either within a region or within an availability zone.

## Next steps

- [Well-Architected Framework for virtual machines](/azure/architecture/framework/services/compute/virtual-machines/virtual-machines-review)
- [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture)
- [Accelerated networking with Azure VM disaster recovery](/azure/site-recovery/azure-vm-disaster-recovery-with-accelerated-networking)
- [Express Route with Azure VM disaster recovery](../site-recovery/azure-vm-disaster-recovery-with-expressroute.md)
- [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)
- [Reliability in Azure](/azure/reliability/availability-zones-overview)

