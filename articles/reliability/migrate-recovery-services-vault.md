---
title: Migrate Azure Recovery Services Vault to availability zone support 
description: Learn how to migrate your Azure Recovery Services Vault to availability zone support.
author: jfaurskov 
ms.service: site-recovery
ms.topic: conceptual
ms.date: 06/24/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---

# Migrate Azure Recovery Services vault to availability zone support 

This article describes how to migrate Recovery Services vault from non-availability zone support to availability zone support.

Recovery Services vault supports local redundancy, zone redundancy, and geo-redundancy for storage. Storage redundancy is a setting that must be configured *before* protecting any workloads. Once a workload is protected in Recovery Services vault, the setting is locked and can't be changed. To learn more about different storage redundancy options, see [Set storage redundancy](../backup/backup-create-rs-vault.md#set-storage-redundancy).

To change your current Recovery Services vault to availability zone support, you need to deploy a new vault. Perform the following actions to create a new vault and migrate your existing workloads.

For more detailed information about availability zone and disaster recovery support for Azure Backup services and data redundancy, see [Reliability for Azure Backup](./reliability-backup.md).

## Prerequisites

Standard SKU is supported.

## Downtime requirements

Because you're required to deploy a new Recovery Services vault and migrate your workloads to the new vault, some downtime is expected.

## Considerations

When switching recovery vaults for backup, the existing backup data is in the old recovery vault and can't be migrated to the new one. 

## Migration Step: Deploy a new Recovery Services vault

To change storage redundancy after the Recovery Services vault is locked in a specific configuration:

1. [Deploy a new Recovery Services vault](../backup/backup-create-rs-vault.md).

1. Configure the relevant storage redundancy option. Learn how to [Set storage redundancy](../backup/backup-create-rs-vault.md#set-storage-redundancy).

**Choose an Azure service:**

# [Azure Backup](#tab/backup)

If your workloads are backed-up by the old vault and you want to re-assign them to the new vault, follow these steps:

1. Stop backup for:

   1. [Virtual Machines](../backup/backup-azure-manage-vms.md#stop-protecting-a-vm).
    
   1. [SQL Server database in Azure VM](../backup/manage-monitor-sql-database-backup.md#stop-protection-for-a-sql-server-database).
    
    
   1. [Storage Files](../backup/manage-afs-backup.md#stop-protection-on-a-file-share).
    
   1. [SAP HANA database in Azure VM](../backup/sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database).
    
1. To unregister from old vault, follow these steps:

   1. [Virtual Machines](../backup/backup-azure-move-recovery-services-vault.md#move-an-azure-virtual-machine-to-a-different-recovery-service-vault).
    
   1. [SQL Server database in Azure VM](../backup/manage-monitor-sql-database-backup.md#unregister-a-sql-server-instance).
   
      Move the SQL database on Azure VM to another resource group to completely break the association with the old vault.

   1. [Storage Files](../backup/manage-afs-backup.md#unregister-a-storage-account).
    
   1. [SAP HANA database in Azure VM](../backup/sap-hana-db-manage.md#unregister-an-sap-hana-instance).

      Move the SAP HANA database on Azure VM to another resource group to completely break the association with the old vault.

1. Configure the various backup items for protection in the new vault.

>[!IMPORTANT]
>Existing recovery points in the old vault is retained and objects can be restored from these. However, as protection is stopped, backup policy no longer applies to the retained data. As a result, recovery points won't expire through policy, but must be deleted manually. If this isn't done, recovery points are retained and  indefinitely incurs cost. To avoid the cost for the remaining recovery points, see [Delete protected items in the cloud](../backup/backup-azure-delete-vault.md?tabs=portal#delete-protected-items-in-the-cloud).

# [Azure Site Recovery](#tab/site-recovery)

If you have any workloads in the old vault that are currently protected by Azure Site Recovery, see the following sections.

## Azure to Azure replication

1. Disable replication in the old vault. See [Disable protection for an Azure VM (Azure to Azure)](../site-recovery/site-recovery-manage-registration-and-protection.md#disable-protection-for-a-azure-vm-azure-to-azure).

1. Enable replication in the new vault. See [Enable replication](../site-recovery/azure-to-azure-how-to-enable-replication.md#enable-replication).

1. If you don't need the old Recovery Service vault, you can then delete it (provided it has no other active replications). To delete the old vault, see [Delete a Site Recovery Services vault](../site-recovery/delete-vault.md).

## VMware to Azure replication

Learn about [Registering a VMware configuration server with a different vault](../site-recovery/vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault).

## Physical to Azure replication

Learn about [Registering a configuration server with a different vault](../site-recovery/vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault).  


## Hyper-V Site to Azure replication

Follow these steps:

1. Unregister the server in the old vault. See [Unregister a Hyper-V host in a Hyper-V site](../site-recovery/site-recovery-manage-registration-and-protection.md#unregister-a-hyper-v-host-in-a-hyper-v-site).

1. Enable replication in the new vault.

## Hyper-V VM to Azure replication

1. Disable replication in the old vault. See [Disable protection for a Hyper-V virtual machine (Hyper-V to Azure)](../site-recovery/site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-hyper-v-to-azure).

1. Enable replication in the new vault.

## SCVMM to Azure replication

1. Disable replication in the old vault. See [Disable protection for a Hyper-V virtual machine replicating to Azure using the System Center VMM to Azure scenario](../site-recovery/site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-azure-using-the-system-center-vmm-to-azure-scenario).

1. Enable replication in the new vault.

---

## Next steps

-  [Reliability for Azure Backup](./reliability-backup.md)
-  [Azure services and regions that support availability zones](availability-zones-service-support.md)
