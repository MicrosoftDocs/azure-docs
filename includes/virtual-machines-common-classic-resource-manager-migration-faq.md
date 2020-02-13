---
title: include file
description: include file
services: virtual-machines
author: singhkays
ms.service: virtual-machines
ms.topic: include
ms.date: 05/18/2018
ms.author: kasing
ms.custom: include file

---



## Does this migration plan affect any of my existing services or applications that run on Azure virtual machines? 

No. The VMs (classic) are fully supported services in general availability. You can continue to use these resources to expand your footprint on Microsoft Azure.

## What happens to my VMs if I don’t plan on migrating in the near future? 

We are not deprecating the existing classic APIs and resource model. We want to make migration easy, considering the advanced features that are available in the Resource Manager deployment model. We highly recommend that you review [some of the advancements](../articles/azure-resource-manager/management/deployment-models.md) that are part of IaaS under Resource Manager.

## What does this migration plan mean for my existing tooling? 

Updating your tooling to the Resource Manager deployment model is one of the most important changes that you have to account for in your migration plans.

## How long will the management-plane downtime be? 

It depends on the number of resources that are being migrated. For smaller deployments (a few tens of VMs), the whole migration should take less than an hour. For large-scale deployments (hundreds of VMs), the migration can take a few hours.

## Can I roll back after my migrating resources are committed in Resource Manager? 

You can abort your migration as long as the resources are in the prepared state. Rollback is not supported after the resources have been successfully migrated through the commit operation.

## Can I roll back my migration if the commit operation fails? 

You cannot abort migration if the commit operation fails. All migration operations, including the commit operation, are idempotent. So we recommend that you retry the operation after a short time. If you still face an error, create a support ticket or create a forum post with the ClassicIaaSMigration tag on our [VM forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=WAVirtualMachinesforWindows).

## Do I have to buy another express route circuit if I have to use IaaS under Resource Manager? 

No. We recently enabled [moving ExpressRoute circuits from the classic to the Resource Manager deployment model](../articles/expressroute/expressroute-move.md). You don’t have to buy a new ExpressRoute circuit if you already have one.

## What if I had configured Role-Based Access Control policies for my classic IaaS resources? 

During migration, the resources transform from classic to Resource Manager. So we recommend that you plan the RBAC policy updates that need to happen after migration.

## I backed up my classic VMs in a vault. Can I migrate my VMs from classic mode to Resource Manager mode and protect them in a Recovery Services vault?

<a name="vault">When</a> you move a VM from classic to Resource Manager mode, backups taken prior to migration will not migrate to newly migrated Resource Manager VM. However, if you wish to keep your backups of classic VMs, follow these steps before the migration. 

1. In the Recovery Services vault, go to the **Protected Items** tab and select the VM. 
2. Click Stop Protection. Leave *Delete associated backup data* option **unchecked**.

> [!NOTE]
> You will be charged backup instance cost till you retain data. Backup copies will be pruned as per retention range. However, last backup copy is always kept until you explicitly delete backup data. It is advised to check your retention range of the Virtual machine and trigger "Delete Backup Data" on the protected item in the vault once the retention range is over. 
>
>

To migrate the virtual machine to Resource Manager mode, 

1. Delete the backup/snapshot extension from the VM.
2. Migrate the virtual machine from classic mode to Resource Manager mode. Make sure the storage and network information corresponding to the virtual machine is also migrated to Resource Manager mode.

Additionally, if you want to back up the migrated VM, go to Virtual Machine management blade to [enable backup](../articles/backup/quick-backup-vm-portal.md#enable-backup-on-a-vm).

## Can I validate my subscription or resources to see if they're capable of migration? 

Yes. In the platform-supported migration option, the first step in preparing for migration is to validate that the resources are capable of migration. In case the validate operation fails, you receive messages for all the reasons the migration cannot be completed.

## What happens if I run into a quota error while preparing the IaaS resources for migration? 

We recommend that you abort your migration and then log a support request to increase the quotas in the region where you are migrating the VMs. After the quota request is approved, you can start executing the migration steps again.

## How do I report an issue? 

Post your issues and questions about migration to our [VM forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=WAVirtualMachinesforWindows), with the keyword ClassicIaaSMigration. We recommend posting all your questions on this forum. If you have a support contract, you're welcome to log a support ticket as well.

## What if I don't like the names of the resources that the platform chose during migration? 

All the resources that you explicitly provide names for in the classic deployment model are retained during migration. In some cases, new resources are created. For example: a network interface is created for every VM. We currently don't support the ability to control the names of these new resources created during migration. Log your votes for this feature on the [Azure feedback forum](https://feedback.azure.com).

## Can I migrate ExpressRoute circuits used across subscriptions with authorization links? 

ExpressRoute circuits which use cross-subscription authorization links cannot be migrated automatically without downtime. We have guidance on how these can be migrated using manual steps. See [Migrate ExpressRoute circuits and associated virtual networks from the classic to the Resource Manager deployment model](../articles/expressroute/expressroute-migration-classic-resource-manager.md) for steps and more information.

## I got the message *"VM is reporting the overall agent status as Not Ready. Hence, the VM cannot be migrated. Ensure that the VM Agent is reporting overall agent status as Ready"* or *"VM contains Extension whose Status is not being reported from the VM. Hence, this VM cannot be migrated."*

This message is received when the VM does not have outbound connectivity to the internet. The VM agent uses outbound connectivity to reach the Azure storage account for updating the agent status every five minutes.
