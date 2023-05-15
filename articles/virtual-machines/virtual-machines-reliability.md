---
title: Reliability in Azure Virtual Machines
description: Find out about reliability in Azure Virtual Machines 
author: ericd-mst-github
ms.author: erd
ms.topic: overview
ms.custom: subject-reliability
ms.service: virtual-machines
ms.date: 01/12/2023
---

# What is reliability in Virtual Machines?

This article describes reliability support in Virtual Machines (VM), and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.

Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Virtual machines support availability zones with three availability zones per supported Azure region and are also zone-redundant and zonal. For more information, see [availability zones support](../reliability/availability-zones-service-support.md). The customer will be responsible for configuring and migrating their virtual machines for availability. Refer to the following readiness options below for availability zone enablement:

- See [availability options for VMs](./availability.md)
- Review [availability zone service and region support](../reliability/availability-zones-service-support.md)
- [Migrate existing VMs](../reliability/migrate-vm.md) to availability zones


### Prerequisites

Your virtual machine SKUs must be available across the zones in for your region. To review which regions support availability zones, see the [list of supported regions](../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support). Check for VM SKU availability by using PowerShell, the Azure CLI, or review list of foundational services. For more information, see [reliability prerequisites](../reliability/migrate-vm.md#prerequisites).

### SLA improvements

Because availability zones are physically separate and provide distinct power source, network, and cooling, SLAs (Service-level agreements) increase. For more information, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/).

#### Create a resource with availability zone enabled

Get started by creating a virtual machine (VM) with availability zone enabled from the following deployment options below:
- [Azure CLI](./linux/create-cli-availability-zone.md)
- [PowerShell](./windows/create-powershell-availability-zone.md)
- [Azure portal](./create-portal-availability-zone.md)

### Zonal failover support

Customers can set up virtual machines to failover to another zone using the Site Recovery service. For more information, see [Site Recovery](../site-recovery/site-recovery-overview.md).

### Fault tolerance

Virtual machines can failover to another server in a cluster, with the VM's operating system restarting on the new server. Customers should refer to the failover process for disaster recovery, gathering virtual machines in recovery planning, and running disaster recovery drills to ensure their fault tolerance solution is successful.

For more information, see the [site recovery processes](../site-recovery/site-recovery-failover.md#before-you-start).


### Zone down experience

During a zone-wide outage, the customer should expect brief degradation of performance, until the virtual machine service self-healing re-balances underlying capacity to adjust to healthy zones. This isn't dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones.

Customers should also prepare for the possibility that there's an outage of an entire region. If there's a service disruption for an entire region, the locally redundant copies of your data would temporarily be unavailable. If geo-replication is enabled, three additional copies of your Azure Storage blobs and tables are stored in a different region. In the event of a complete regional outage or a disaster in which the primary region isn't recoverable, Azure remaps all of the DNS entries to the geo-replicated region.




#### Zone outage preparation and recovery

The following guidance is provided for Azure virtual machines in the case of a service disruption of the entire region where your Azure virtual machine application is deployed:

- Configure [Azure Site Recovery](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-1-initiate-a-failover-by-using-azure-site-recovery) for your VMs
- Check the [Azure Service Health Dashboard](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-2-wait-for-recovery) status if Azure Site Recovery hasn't been configured
- Review how the [Azure Backup service](../backup/backup-azure-vms-introduction.md) works for VMs
    - See the [support matrix](../backup/backup-support-matrix-iaas.md) for Azure VM backups
- Determine which [VM restore option and scenario](../backup/about-azure-vm-restore.md) will work best for your environment



### Low-latency design

Cross Region (secondary region), Cross Subscription (preview), and Cross Zonal (preview) are available options to consider when designing a low-latency virtual machine solution. For more information on these options, see the [supported restore methods](../backup/backup-support-matrix-iaas.md#supported-restore-methods).

>[!IMPORTANT]
>By opting out of zone-aware deployment, you forego protection from isolation of underlying faults. Use of SKUs that don't support availability zones or opting out from availability zone configuration forces reliance on resources that don't obey zone placement and separation (including underlying dependencies of these resources). These resources shouldn't be expected to survive zone-down scenarios. Solutions that leverage such resources should define a disaster recovery strategy and configure a recovery of the solution in another region.

### Safe deployment techniques

When you opt for availability zones isolation, you should utilize safe deployment techniques for application code, as well as application upgrades. In addition to configuring Azure Site Recovery, below are recommended safe deployment techniques for VMs:

- [Virtual Machine Scale Sets](/azure/virtual-machines/flexible-virtual-machine-scale-sets)
- [Availability Sets](./availability-set-overview.md)
- [Azure Load Balancer](../load-balancer/load-balancer-overview.md)
- [Azure Storage Redundancy](../storage/common/storage-redundancy.md)



 As Microsoft periodically performs planned maintenance updates, there may be rare instances when these updates require a reboot of your virtual machine to apply the required updates to the underlying infrastructure. To learn more, see [availability considerations](./maintenance-and-updates.md#availability-considerations-during-scheduled-maintenance) during scheduled maintenance. 

Follow the health signals below for monitoring before upgrading your next set of nodes in another zone:

- Check the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) for the virtual machines service status for your expected regions
- Ensure that [replication](../site-recovery/azure-to-azure-quickstart.md) is enabled on your VMs




### Availability zone redeployment and migration

For migrating existing virtual machine resources to a zone redundant configuration, refer to the below resources:

- Move a VM to another subscription or resource group
    - [CLI](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-cli)
    - [PowerShell](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-powershell)
- [Azure Resource Mover](/azure/resource-mover/tutorial-move-region-virtual-machines)
- [Move Azure VMs to availability zones](../site-recovery/move-azure-vms-avset-azone.md)
- [Move region maintenance configuration resources](./move-region-maintenance-configuration-resources.md)

## Disaster recovery: cross-region failover

In the case of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](../site-recovery/azure-to-azure-architecture.md).

Customers can use Cross Region to restore Azure VMs via paired regions. You can restore all the Azure VMs for the selected recovery point if the backup is done in the secondary region. For more details on Cross Region restore, refer to the Cross Region table row entry in our [restore options](../backup/backup-azure-arm-restore-vms.md#restore-options).


### Cross-region disaster recovery in multi-region geography

While Microsoft is working diligently to restore the virtual machine service for region-wide service disruptions, customers will have to rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data strategies for disaster recovery](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan).

#### Outage detection, notification, and management

When the hardware or the physical infrastructure for the virtual machine fails unexpectedly. This can include local network failures, local disk failures, or other rack level failures. When detected, the Azure platform automatically migrates (heals) your virtual machine to a healthy physical machine in the same data center. During the healing procedure, virtual machines experience downtime (reboot) and in some cases loss of the temporary drive. The attached OS and data disks are always preserved.

For more detailed information on virtual machine service disruptions, see [disaster recovery guidance](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance).

#### Set up disaster recovery and outage detection

When setting up disaster recovery for virtual machines, understand what [Azure Site Recovery provides](../site-recovery/site-recovery-overview.md#what-does-site-recovery-provide). Enable disaster recovery for virtual machines with the below methods:

- Set up disaster recovery to a [secondary Azure region for an Azure VM](../site-recovery/azure-to-azure-quickstart.md)
- Create a Recovery Services vault
    - [Bicep](../site-recovery/quickstart-create-vault-bicep.md)
    - [ARM template](../site-recovery/quickstart-create-vault-template.md)
- Enable disaster recovery for [Linux virtual machines](./linux/tutorial-disaster-recovery.md)
- Enable disaster recovery for [Windows virtual machines](./windows/tutorial-disaster-recovery.md)
- Failover virtual machines to [another region](../site-recovery/azure-to-azure-tutorial-failover-failback.md)
- Failover virtual machines to the [primary region](../site-recovery/azure-to-azure-tutorial-failback.md#fail-back-to-the-primary-region)

### Single-region geography disaster recovery


With disaster recovery set up, Azure VMs will continuously replicate to a different target region. If an outage occurs, you can fail over VMs to the secondary region, and access them from there.

For more information, see [Azure VMs architectural components](../site-recovery/azure-to-azure-architecture.md#architectural-components) and [region pairing](./regions.md#region-pairs).

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the Shared responsibility model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there's no guarantee of capacity at time of impact for those who haven't pre-allocated.

For deploying virtual machines, customers can use [flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration) mode on Virtual Machine Scale Sets. All VM sizes can be used with flexible orchestration mode. Flexible orchestration mode also offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone.

## Additional guidance

- [Well-Architected Framework for virtual machines](/azure/architecture/framework/services/compute/virtual-machines/virtual-machines-review)
- [Azure to Azure disaster recovery architecture](../site-recovery/azure-to-azure-architecture.md)
- [Accelerated networking with Azure VM disaster recovery](/azure/site-recovery/azure-vm-disaster-recovery-with-accelerated-networking)
- [Express Route with Azure VM disaster recovery](../site-recovery/azure-vm-disaster-recovery-with-expressroute.md)
- [Virtual Machine Scale Sets](../virtual-machine-scale-sets/index.yml)

## Next steps
> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/reliability/availability-zones-overview)
