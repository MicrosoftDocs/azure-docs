---
title: Automate agentless VMware migrations in Azure Migrate
description: Describes how to use scripts to migrate a large number of VMware VMs in Azure Migrate
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.service: azure-migrate
ms.topic: how-to
ms.date: 05/11/2023
ms.custom: engagement-fy23
---


# Scale migration of VMware VMs 

This article helps you understand how to use scripts to migrate large number of VMware virtual machines (VMs) using the agentless method. To scale migrations, you use [Azure Migrate PowerShell module](./tutorial-migrate-vmware-powershell.md). 

The Azure Migrate VMware migration automation scripts are available for download in the [Azure PowerShell Samples](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/migrate-at-scale-vmware-agentles) repo on GitHub. The scripts can be used to migrate VMware VMs to Azure using the agentless migration method. The Azure Migrate PowerShell commands used in these scripts are documented [here](./tutorial-migrate-vmware-powershell.md).

## Current limitations
- These scripts support migration of VMware VMs with all its disks. You can update the scripts if you want to selectively replicate the disks attached to a VMware VM. 
- The scripts support use of assessment recommendations. If assessment recommendations aren't used, all disks attached to the VMware VM are migrated to the same managed disk type (Standard or Premium). You can update the scripts if you want to use multiple types of managed disks with the same VM.

## Prerequisites

- [Complete the discovery tutorial](tutorial-discover-vmware.md) to prepare Azure and VMware for migration.
- We recommend that you complete the second tutorial to [assess VMware VMs](./tutorial-assess-vmware-azure-vm.md) before migrating them to Azure.
- You must have the Azure PowerShell `Az` module. If you need to install or upgrade Azure PowerShell, follow this [guide to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

## Install Azure Migrate PowerShell module

The Azure Migrate PowerShell module is available in preview. You'll need to install the PowerShell module using the following command. 

```azurepowershell
Install-Module -Name Az.Migrate 
```

## CSV input file
Once you have completed all the pre-requisites, you need to create a CSV file that has data of each source VM that you want to migrate. All the scripts are designed to work on the same CSV file. A sample CSV template is available in the scripts folder for your reference. 
The csv file is configurable so that you can use assessment recommendations and even specify if certain operations are not to be triggered for a particular VM. 

> [!NOTE]
> The same csv file can be used to migrate VMs in multiple Azure Migrate projects.

### CSV file schema

**Column Header** | **Description**
--- | ---
AZMIGRATEPROJECT_SUBSCRIPTION_ID | Provide Azure Migrate project subscription ID.
AZMIGRATEPROJECT_RESOURCE_GROUP_NAME | Provide Azure Migrate resource group name.
AZMIGRATEPROJECT_NAME | Provide the name of the Azure Migrate project in that you want to migrate servers. 
SOURCE_MACHINE_NAME | Provide a friendly name (display name) for the discovered VM in the Azure Migrate project.
AZMIGRATEASSESSMENT_NAME | Provide the name of the assessment that needs to be leveraged for migration.
AZMIGRATEGROUP_NAME | Provide the name of the group that was used for the Azure Migrate assessment.
TARGET_RESOURCE_GROUP_NAME | Provide the name of the Azure resource group to which the VM needs to be migrated to.
TARGET_VNET_NAME| Provide the name of the Azure Virtual Network that the migrated VM should use.
TARGET_SUBNET_NAME | Provide the name of the subnet in the target virtual network that the migrated VM should use. If left blank, “default” subnet will be used.
TARGET_MACHINE_NAME | Provide the name that the migrated VM should use in Azure. If left blank, the source machine name will be used.  
TARGET_MACHINE_SIZE | Provide the Stock Keeping Unit (SKU) that the VM should use in Azure. To migrate a VM to D2_v2 VM in Azure, specify the value in this field as "Standard_D2_v2". If you use an assessment, this value will be derived based on the assessment recommendation.
LICENSE_TYPE | Specify if you want to use Azure Hybrid Benefit for Windows Server VMs. Use value "WindowsServer" to take advantage of Azure Hybrid Benefit. Otherwise, leave it blank or use "NoLicenseType".
OS_DISK_ID | Provide the OS disk ID for the VM to be migrated. The disk ID to be used is the unique identifier (UUID) property for the disk retrieved using the Get-AzMigrateServer cmdlet. The script will use the first disk of the VM as the OS disk in case no value is provided.
TARGET_DISKTYPE | Provide the disk type to be used for all disks of the VM in Azure. Use 'Premium_LRS' for premium-managed disks, 'StandardSSD_LRS' for standard SSD disks and 'Standard_LRS' to use standard HDD disks. If you choose to use an assessment, the script will prioritize using recommended disk types for each disk of the VM. If you don't use assessment or specify any value, the script will use standard HDD disks by default.    
AVAILABILITYZONE_NUMBER | Specify the availability zone number to be used for the migrated VM. You can leave this blank if you don't want to use availability zones. 
AVAILABILITYSET_NAME | Specify the name of the availability set to be used for the migrated VM. You can leave this blank if you don't want to use availability set.
TURNOFF_SOURCESERVER | Specify 'Y' if you want to turn off the source VM at the time of migration. Use 'N' otherwise. If left blank, the script assumes the value as 'N'.
TESTMIGRATE_VNET_NAME | Specify the name of the virtual network to be used for test migration.
UPDATED_TARGET_RESOURCE_GROUP_NAME | If you want to update the resource group to be used by the migrated VM in Azure, specify the name of the Azure resource group, else leave it blank. 
UPDATED_TARGET_VNET_NAME | If you want to update the Virtual Network to be used by the migrated VM in Azure, specify the name of the Azure Virtual Network, else leave it blank.
UPDATED_TARGET_MACHINE_NAME | If you want to update the name to be used by the migrated VM in Azure, specify the new name to be used, else leave it blank.
UPDATED_TARGET_MACHINE_SIZE | If you want to update the SKU to be used by the migrated VM in Azure, specify the new SKU to be used, else leave it blank.
UPDATED_AVAILABILITYZONE_NUMBER | If you want to update the availability zone to be used by the migrated VM in Azure, specify the new availability zone to be used, else leave it blank.
UPDATED_AVAILABILITYSET_NAME | If you want to update the availability set to be used by the migrated VM in Azure, specify the new availability set to be used, else leave it blank.
UPDATE_NIC1_ID | Specify the ID of the NIC to be updated. If left blank, the script assumes the value to be the first NIC of the discovered VM. If you don't want to update the NIC of the VM, leave all the fields containing NIC name blank. 
UPDATED_TARGET_NIC1_SELECTIONTYPE | Specify the value to be used for this NIC. Use "Primary","Secondary", or "DoNotCreate" to specify if this NIC should be the primary, secondary, or should not be created on the migrated VM. Only one NIC can be specified as the primary NIC for the VM. Leave blank if you don't want to update.
UPDATED_TARGET_NIC1_SUBNET_NAME | Specify the name of the subnet to use for the NIC on the migrated VM. Leave blank if you don't want to update.
UPDATED_TARGET_NIC1_IP | Specify the IPv4 address to be used by the NIC on the migrated VM if you want to use static IP. Use "auto" if you want to automatically assign the IP. Leave blank if you don't want to update.
UPDATE_NIC2_ID | Specify the ID of the NIC to be updated. If left blank, then the script assumes the value to be the second NIC of the discovered VM. If you don't want to update the NIC of the VM, then leave all the fields containing NIC name blank.
UPDATED_TARGET_NIC2_SELECTIONTYPE | Specify the value to be used for this NIC. Use "Primary","Secondary" or "DoNotCreate" to specify if this NIC should be the primary, secondary, or should not be created on the migrated VM. Only one NIC can be specified as the primary NIC for the VM. Leave blank if you don't want to update.
UPDATED_TARGET_NIC2_SUBNET_NAME | Specify the name of the subnet to use for the NIC on the migrated VM. Leave blank if you don't want to update.
UPDATED_TARGET_NIC2_IP | Specify the IPv4 address to be used by the NIC on the migrated VM if you want to use static IP. Use "auto" if you want to automatically assign the IP. Leave blank if you don't want to update.
OK_TO_UPDATE | Use 'Y' to indicate whether the VM properties need to be updated when you run the AzMigrate_UpdateMachineProperties script. Use 'N' or leave blank otherwise.
OK_TO_MIGRATE | Use 'Y' to indicate whether the VM should be migrated when you run the AzMigrate_StartMigration script. Use 'N' or leave blank if you don't want to migrate the VM. 
OK_TO_USE_ASSESSMENT | Use 'Y' to indicate whether the VM should start replication using assessment recommendations when you run the AzMigrate_StartReplication script. This will override the TARGET_MACHINE_SIZE and TARGET_DISKTYPE values in the csv file. Use 'N' or leave blank if you don't want to use assessment recommendations.
OK_TO_TESTMIGRATE | Use 'Y' to indicate whether the VM should be test migrated when you run the AzMigrate_StartTestMigration script. Use 'N' or leave blank if you don't want to test migrate the VM. 
OK_TO_RETRIEVE_REPLICATIONSTATUS | Use 'Y' to indicate whether the replication status of the VM should be updated when you run the AzMigrate_ReplicationStatus script. Use 'N' or leave blank if you don't want to update the replication status.
OK_TO_CLEANUP | Use 'Y' to indicate whether the replication for the VM should be cleaned up when you run the AzMigrate_StopReplication script. Use 'N' or leave blank otherwise.
OK_TO_TESTMIGRATE_CLEANUP | Use 'Y' to indicate whether the test migration for the VM should be cleaned up when you run the AzMigrate_CleanUpTestMigration script. Use 'N' or leave blank otherwise.


## Script execution

Once the CSV is ready, you can execute the following steps to migrate your on-premises VMware VMs.

**Step #** | **Script Name** | **Description**
--- | --- | ---
1 | AzMigrate_StartReplication.ps1 | Enable replication for all the VMs listed in the csv, the script creates a CSV output and a log file for troubleshooting.
2 | AzMigrate_ReplicationStatus.ps1 | Check the status of replication, the script creates a csv output with the status for each VM and a log file for troubleshooting.
3 | AzMigrate_UpdateMachineProperties.ps1 | Once the VMs have completed initial replication, use this script to update the target properties of the VM (Compute and Network properties). The script creates a CSV output with the job details for each VM.
4 | AzMigrate_StartTestMigration.ps1 |  Start the test failover for all VMs listed in the csv that are configured for test migration. The script creates a CSV output with the job details for each VM.
5 | AzMigrate_CleanUpTestMigration.ps1 | Once you manually validate the VMs that were test failed-over, use this script to clean up the test failover VMs for all VMs listed in the csv that are configured for test migration cleanup. The script creates a CSV output with the job details for each VM.
6 | AzMigrate_StartMigration.ps1 | Start the migration for all VMs listed in the csv that are configured for migration. The script creates a CSV output with the job details for each VM.
7 | AzMigrate_StopReplication.ps1 | Stops the replication for the VM after it has been successfully migrated or if you want to cancel the replication due to other reasons. The script creates a CSV output with the job details for each VM.


The following scripts are invoked by other scripts for all Azure Migrate operations like enabling replication, starting test migration, updating VM properties and so on. Ensure that all the scripts are present in the same folder/path. 

**Step #** | **Script Name** | **Description**
--- | --- | ---
1 | AzMigrate_Shared.ps1 | Common script containing functions for retrieving assessment properties (through API), discovered VMs, and replicating VMs. 
2 | AzMigrate_CSV_Processor.ps1 | Common script containing functions used for csv file operations including loading, reading, and printing for logs. 
3 | AzMigrate_Logger.ps1 | Common script invoked for generating the log file for Azure Migrate automation operations. The log file will be of the format log.Scriptname.Datetime.txt.

In addition to the above, the folder also contains AzMigrate_Template.ps1 that contains the skeleton framework for building custom scripts for different Azure Migrate operations. 

### Script execution syntax

Once you have downloaded the scripts, the scripts can be executed as follows.

If you want to execute the script to start replication for VMs using the Input.csv file, use the following syntax. 

```azurepowershell
".\AzMigrate_StartReplication.ps1" .\Input.csv 
```

To learn more about using Azure PowerShell for migrating VMware VMs with Azure Migrate, follow the [tutorial](./tutorial-migrate-vmware-powershell.md).