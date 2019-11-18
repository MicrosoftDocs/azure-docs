---
title: Automate migration of large number of VMs to Azure | Microsoft Docs
description: Describes how to use scripts to migrate a large number of VMs using Azure Site Recovery
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: article
ms.date: 04/01/2019
ms.author: snehaa
---


# Scale migration of VMs using Azure Site Recovery

This article helps you understand how to use scripts to migrate large number of VMs using Azure Site Recovery. These scripts are available for your download at [Azure PowerShell Samples](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/migrate-at-scale-with-site-recovery) repo on GitHub. The scripts can be used to migrate VMware, AWS, GCP VMs, and physical servers to managed disks in Azure. You can also use these scripts to migrate Hyper-V VMs if you migrate the VMs as physical servers. The scripts that leverage Azure Site Recovery PowerShell are documented [here](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell).

## Current Limitations:
- Support specifying the static IP address only for the primary NIC of the target VM
- The scripts do not take Azure Hybrid Benefit related inputs, you need to manually update the properties of the replicated VM in the portal

## How does it work?

### Prerequisites
Before you get started, you need to do the following steps:
- Ensure that the Site Recovery vault is created in your Azure subscription
- Ensure that the Configuration Server and Process Server are installed in the source environment and the vault is able to discover the environment
- Ensure that a Replication Policy is created and associated with the Configuration Server
- Ensure that you have added the VM admin account to the config server (that will be used to replicate the on premises VMs)
- Ensure that the target artifacts in Azure are created
    - Target Resource Group
    - Target Storage Account (and its Resource Group) - Create a premium storage account if you plan to migrate to premium-managed disks
    - Cache Storage Account (and its Resource Group) - Create a standard storage account in the same region as the vault
    - Target Virtual Network for failover (and its Resource Group)
    - Target Subnet
    - Target Virtual Network for Test failover (and its Resource Group)
    - Availability Set (if needed)
    - Target Network Security Group and its Resource Group
- Ensure that you have decided on the properties of the target VM
    - Target VM name
    - Target VM size in Azure (can be decided using Azure Migrate assessment)
    - Private IP Address of the primary NIC in the VM
- Download the scripts from [Azure PowerShell Samples](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/migrate-at-scale-with-site-recovery) repo on GitHub

### CSV Input file
Once you have all the pre-requisites completed, you need to create a CSV file, which has data for each source machine that you want to migrate. The input CSV must have a header line with the input details and a row with details for each machine that needs to be migrated. All the scripts are designed to work on the same CSV file. A sample CSV template is available in the scripts folder for your reference.

### Script execution
Once the CSV is ready, you can execute the following steps to perform migration of the on-premises VMs:

**Step #** | **Script Name** | **Description**
--- | --- | ---
1 | asr_startmigration.ps1 | Enable replication for all the VMs listed in the csv, the script creates a CSV output with the job details for each VM
2 | asr_replicationstatus.ps1 | Check the status of replication, the script creates a csv with the status for each VM
3 | asr_updateproperties.ps1 | Once the VMs are replicated/protected, use this script to update the target properties of the VM (Compute and Network properties)
4 | asr_propertiescheck.ps1 | Verify if the properties are appropriately updated
5 | asr_testmigration.ps1 |  Start the test failover of the VMs listed in the csv, the script creates a CSV output with the job details for each VM
6 | asr_cleanuptestmigration.ps1 | Once you manually validate the VMs that were test failed-over, you can use this script to clean up the test failover VMs
7 | asr_migration.ps1 | Perform an unplanned failover for the VMs listed in the csv, the script creates a CSV output with the job details for each VM. The script does not shut down the on premises VMs before triggering the failover, for application consistency, it is recommended that you manually shut down the VMs before executing the script.
8 | asr_completemigration.ps1 | Perform the commit operation on the VMs and delete the Azure Site Recovery entities
9 | asr_postmigration.ps1 | If you plan to assign network security groups to the NICs post-failover, you can use this script to do that. It assigns an NSG to any one NIC in the target VM.

## How to migrate to managed disks?
The script, by default, migrates the VMs to managed disks in Azure. If the target storage account provided is a premium storage account, premium-managed disks are created post migration. The cache storage account can still be a standard account. If the target storage account is a standard storage account, standard disks are created post migration. 

## Next steps

[Learn more](https://docs.microsoft.com/azure/site-recovery/migrate-tutorial-on-premises-azure) about migrating servers to Azure using Azure Site Recovery
