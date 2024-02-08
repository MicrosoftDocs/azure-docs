---
title: Troubleshoot Windows upgrade issues
description: Provides an overview of known issues in the Windows OS upgrade feature
author: AnuragMehrotra
ms.author: anuragm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/11/2023
ms.custom: engagement-fy24
---

# Troubleshoot Windows OS upgrade issues  

This article describes some common issues that you might encounter when you upgrade the Windows OS using the Migration and modernization tool.  

## Cannot attach the OS setup disk as VM reached maximum disk allowed

The Test Migration and Migration will fail in the prerequisite stage if the VM already has the maximum number of data disks based on its SKU. Since the workflow creates an additional data disk temporarily, it's mandatory to have n-1 (n represents maximum number of disks supported for the respective SKU of the VM) disks to complete the upgrade successfully.    

### Recommended action

Select a different target Azure VM SKU that can attach more data disks and retry the operation. Since Azure Migrate completed the migration and created a VM in Azure, retry the operation by following these steps:    

1. Clean up the migration:   
   1. Test Migration: Right-click the Azure VM in **Replications** and select **Clean up test migration**.  
   1. Migration: Since the VM is already migrated to Azure, follow [these](/azure/virtual-machines/windows-in-place-upgrade) steps here to upgrade the OS.

2. Update the target VM SKU settings:    
   1. In the Azure portal, select the Azure Migrate project.    
   2. Go to **Migration tools** > **Replications** > Azure VM count.    
   3. Select the Replicating machine.    
   4. Go to **Compute and network**.    
   5. In **Compute**, change the VM size to support more data disks.    

3. Verify that the operating system disk has enough [free space](/windows-server/get-started/hardware-requirements#storage-controller-and-disk-space-requirements) to perform the in-place upgrade. The minimum disk space requirement is 32 GB. If more space is needed, follow [these](/azure/virtual-machines/windows/expand-os-disk) steps to expand the operating system disk attached to the VM for a successful OS upgrade.    

## Migration fails for Private endpoint enabled Azure Migrate projects  

The migration fails if the storage account that you select for replicating VMs doesn't have the Firewall settings of the target VNET. 

### Recommended action

Add the target VNET into the firewall in the storage account that you select in the above step for replicating VMs:  

1. Go to **Networking** > **Firewall and Virtual Networks** > **Public Network Access – Enabled from selected Virtual Network and IP address** > **Virtual Network** > Add existing Virtual Network and add your target VNET. Then proceed with the Test Migration/Migration.    

2. Perform the initial replication by following [these](migrate-servers-to-azure-using-private-link.md?pivots=agentlessvmware#replicate-vms) steps.  

## Server is migrated without OS upgrade with status “Completed with errors”  

If the source OS version and the OS version to be upgraded are the same, the server migrates without an OS upgrade with the status **Completed with errors**. For example, if the source OS version is Windows 2019 and the upgrade option selected is Windows 2019, then the server is migrated without an OS upgrade with the status **Completed with errors**. 

### Recommended action

Ensure the current OS version is different from the target OS version.    

## Next steps

[Learn more](tutorial-migrate-vmware.md) about migrating VMware VMs.