---
title: Migrate Azure Recovery Services Vault to availability zone support 
description: Learn how to migrate your Azure Recovery Services Vault to availability zone support.
author: anaharris-ms
ms.service: site-recovery
ms.topic: conceptual
ms.date: 06/24/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions
---
 
# Migrate Azure Recovery Services Vault to availability zone support 

This guide describes how to migrate Recovery Services Vault from non-availability zone support to availability zone support.

Recovery Services Vault supports local redundancy, zone redundancy, and geo-redundancy for storage. Storage redundancy is a setting that must be configured *before* protecting any workloads. As soon as a workload is protected in Recovery Vault the setting is locked and cannot be changed. To learn more about the different storage redundancy options see [Set storage redundancy](../backup/backup-create-rs-vault.md#set-storage-redundancy).  

To change your current Recovery Services Vault to availability zone support, you'll need to deploy a new vault. Follow the steps in this article to create a new vault and migrate your existing workloads.

## Prerequisites

- Standard SKU is supported.
 
## Downtime requirements

Because you will be required to deploy a new Recovery Services Vault and you will be migrating your workloads to the new vault, some downtime should be expected.

## Considerations

When switching recovery vaults for backup, the existing backup data is in the old recovery vault and can't be migrated to the new one. 

## Migration Step 1: Deploy a new Recovery Vault

To change storage redundancy after the Recovery Vault has been locked into a specific configuration:

1. [Deploy a new Recovery Services Vault](../backup/backup-create-rs-vault.md).

1. Configure the relevant storage redundancy option as described in [Set storage redundancy](../backup/backup-create-rs-vault.md#set-storage-redundancy).


## Migration Step 2: Backup

If your workloads are backed up by the old vault and you want to re-assign them to the new vault, perform the following stops:

1. Stop backup for:

    1. [Virtual Machines](../backup/backup-azure-manage-vms.md#stop-protecting-a-vm).
    
    1. [SQL Server database in Azure VM](../backup/manage-monitor-sql-database-backup.md#stop-protection-for-a-sql-server-database). 
    
    
    1. [Storage Files](../backup/manage-afs-backup.md#stop-protection-on-a-file-share).
    
    1. [SAP HANA database in Azure VM](../backup/sap-hana-db-manage.md#stop-protection-for-an-sap-hana-database) . 
    
1. To unregister from old vault, perform the following steps: 

    1. [Virtual Machines](../backup/backup-azure-move-recovery-services-vault.md#move-an-azure-virtual-machine-to-a-different-recovery-service-vault).
    
    1. [SQL Server database in Azure VM](../backup/manage-monitor-sql-database-backup.md#unregister-a-sql-server-instance).
    
    1. [Storage Files](../backup/manage-afs-backup.md#unregister-a-storage-account). 
    
    1. [SAP HANA database in Azure VM](../backup/sap-hana-db-manage.md#unregister-an-sap-hana-instance).

        1. Move the SAP Azure VM to another resource group to completely break the association with the old recovery vault.

1. Configure the various backup items for protection in the new vault.

>[!IMPORTANT]
>Existing recovery points in the old recovery vault will be retained and objects can be restored from these. However, since protection has been stopped, backup policy no longer applies to the retained data. As a result, recovery points won't expire through policy, but must be deleted manually. If this isn't done, recovery points will be retained and billed indefinitely. To avoid getting billed for the remaining recovery points, see [Delete protected items in the cloud](../backup/backup-azure-delete-vault.md?tabs=portal.md#delete-protected-items-in-the-cloud.).

## Migration Step 3: Site Recovery

If you have any workloads in the old vault that are currently protected by Azure Site Recovery, follow the steps in the applicable sections below.

### Azure to Azure replication

1. Disable replication in the old vault by following the steps in [Disable protection for an Azure VM (Azure to Azure)](../site-recovery/site-recovery-manage-registration-and-protection.md#disable-protection-for-a-azure-vm-azure-to-azure).

1. Enable replication in the new vault by following the steps in [Enable replication](../site-recovery/azure-to-azure-how-to-enable-replication.md#enable-replication).

1. If you don't need the old recovery service vault, you can then delete it (provided it has no other active replications). To delete the old vault, follow the steps in [Delete a Site Recovery Services vault](../site-recovery/delete-vault.md).

### VMWare to Azure replication

Follow the steps in [Register a VMware configuration server with a different vault](../site-recovery/vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault).

### Physical to Azure replication

Follow the steps in [Register a configuration server with a different vault](../site-recovery/vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault).  


### Hyper-V Site to Azure replication

1. Unregister the server in the old vault by following the steps in [Unregister a Hyper-V host in a Hyper-V site](../site-recovery/site-recovery-manage-registration-and-protection.md#unregister-a-hyper-v-host-in-a-hyper-v-site).

1. Enable replication in the new vault.

### Hyper-V VM to Azure replication

1. Disable replication in the old vault by following the steps in [Disable protection for a Hyper-V virtual machine (Hyper-V to Azure)](../site-recovery/site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-hyper-v-to-azure).

1. Enable replication in the new vault.

### SCVMM to Azure replication

1. Disable replication in the old vault by following the steps in [Disable protection for a Hyper-V virtual machine replicating to Azure using the System Center VMM to Azure scenario](../site-recovery/site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-azure-using-the-system-center-vmm-to-azure-scenario).

1. Enable replication in the new vault.

## Next Steps

Learn more about:

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)

> [!div class="nextstepaction"]
> [Azure Services that support Availability Zones](az-region.md)