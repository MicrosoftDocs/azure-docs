---
title: Move Azure Resources across regions
description: In this article, you'll learn how to ensure continued backups after moving the resources across regions.
ms.topic: conceptual
ms.date: 07/23/2021
ms.assetid: 5ffc4115-0ae5-4b85-a18c-8a942f6d4870
---
# Move Azure Backup resources and protect workloads

Azure Resource Mover supports the movement of multiple resources across regions and Azure Backup can protect several workloads.

The following steps helps you ensure continued backups after moving the resources across regions.  

## Azure Virtual Machine 

When an Azure Virtual Machine is backed up in a Recovery Services Vault and moved from one region to another: 

- The backups in the old Recovery Services Vault start failing with the error **BCMV2VMNotFound** or **ResourceNotFound**. 
- The existing recovery points remain in the vault and are deleted as per the policy. 
- No new backups happen in the earlier region.  

So, to ensure that backups are continued in the new region as well, follow these steps: 

1. Before moving the Virtual Machine, use stop protection and retain/delete data. When the protection for a Virtual Machine is stopped with retain data, the recovery points remain forever and do not adhere to any policy. 
1. Move your Virtual Machine to the new region. 
1. Start protecting the Virtual Machine in any Recovery Services Vault in the new region. You can also create a new Recovery Services Vault and modify the settings as required. 
1. You can restore from recovery points in the earlier region.  

 

## Azure File Share 

When Azure File Shares are moved to another region, backups start failing in the old region. 

To avoid this scenario, before moving to another region, choose **Stop protection** and select: 

- **Retain data**: Will retain the snapshots.
- **Delete Data**: Will delete the snapshots.

In the new region where you have moved the resource, you need to protect it with the new/existing vault in the new region to continue taking backups. 

>[!Note]
>- Once the resource has been moved to another region, Azure Backup doesn’t support the restore operation from the old recovery points. 
>- However, you can restore from the snapshots if you choose Stop protection and Retain data. 

## SQL Server in Azure VM/SAP HANA in Azure VM 

When you move a VM running SQL Server/SAP HANA to another region in a different resource group, its identity changes. 

To continue taking backups in the new region within the same resource group or in a different resource group, follow these steps: 

1. Before moving to the new region, stop protection with retain/delete data. 
1. Move the VM to the new region. 
1. Start taking backups in the new region using an existing/new vault. 

>[!Note]
>- You can use the recovery points in the old vault for restore purpose if you have used Stop protection with Retain data in step 1.  
>- If you have used Stop protection and Retain data and no longer wish to retain data to avoid billing, you need to delete the recovery points manually. 

 