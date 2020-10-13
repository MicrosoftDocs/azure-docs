---
title: Migrate VMware VMs to Azure (agentless) - PowerShell
description: Learn how to run an agentless migration of VMware VMs with Azure Migrate through PowerShell.
services: 
author: rahugup
manager: bsiva
ms.topic: tutorial
ms.date: 10/1/2020
ms.author: rahugup
---
# Migrate VMware VMs to Azure (agentless) - PowerShell

In this article, you'll learn how to migrate discovered VMware VMs with the agentless method using Azure PowerShell for [Azure Migrate: Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool). 

You learn how to:

> [!div class="checklist"]
> * Retrieve discovered VMware VMs in an Azure Migrate project.
> * Start replicating VMs.
> * Update properties for replicating VMs.
> * Monitor replication.
> * Run a test migration to make sure everything's working as expected.
> * Run a full VM migration.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, you should:

1. [Complete the discovery tutorial](tutorial-discover-vmware.md) to prepare Azure and VMware for migration.
2. We recommend that you complete the second tutorial to [assess VMware VMs](tutorial-assess-vmware.md) before migrating them to Azure.
3. You have the Azure PowerShell `Az` module. If you need to install or upgrade Azure PowerShell, follow this [guide to install and configure Azure PowerShell](/powershell/azure/install-az-ps)

## Install Azure Migrate PowerShell module

Azure Migrate PowerShell module is available in public preview. You'll need to install the PowerShell module using the following command. 

```azurepowershell
Install-Module -Name Az.Migrate 
```

## Sign in to your Microsoft Azure subscription

Sign in to your Azure subscription with the `Connect-AzAccount` cmdlet.

```azurepowershell
Connect-AzAccount
```

Select your Azure subscription. Use the `Get-AzSubscription` cmdlet to get the list of Azure subscriptions you have access to. Select the Azure subscription that has your Azure Migrate project to work with using the `Set-AzContext` cmdlet.

```azurepowershell
Set-AzContext -SubscriptionId "xxxx-xxxx-xxxx-xxxx"
```

## Retrieve the Azure Migrate project

An Azure Migrate project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating.
In a project you can track discovered assets, orchestrate assessments, and perform migrations.

As part of prerequisites, you would have already created an Azure Migrate project. Use the `Get-AzMigrateProject` cmdlet to retrieve details of an Azure Migrate project. You'll need to specify the name of the Azure Migrate project (`Name`) and the name of the resource group of the Azure Migrate project (`ResourceGroupName`).

```azurepowershell
# Get resource group of the Azure Migrate project
$ResourceGroup = Get-AzResourceGroup -Name "MyResourceGroup"

# Get details of the Azure Migrate project
$MigrateProject = Get-AzMigrateProject -Name "MyMigrateProject" -ResourceGroupName $ResourceGroup.ResourceGroupName

# View Azure Migrate project details
$MigrateProject | ConvertTo-JSON
```

## Retrieve discovered VMs in an Azure Migrate project

Azure Migrate uses a lightweight [Azure Migrate appliance](migrate-appliance-architecture.md). As part of the prerequisites, you would have deployed the Azure Migrate appliance as a VMware VM.

To retrieve a specific VMware VM in an Azure Migrate project, specify name of the Azure Migrate project (`ProjectName`), resource group of the Azure Migrate project (`ResourceGroupName`), and the VM name (`DisplayName`). 

```azurepowershell
# Get a specific VMware VM in an Azure Migrate project
$DiscoveredServer = Get-AzMigrateServer -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName -DisplayName "MyTestVM"

# View discovered server details
$DiscoveredServer | ConvertTo-JSON
```
We'll migrate this VM as part of this tutorial.

You can also retrieve all VMware VMs in an Azure Migrate project by using the `ProjectName` and `ResourceGroupName` parameters.

```azurepowershell
# Get all VMware VMs in an Azure Migrate project
$DiscoveredServers = Get-AzMigrateServer -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName | Format-Table DisplayName, Name, Type
```
If you have multiple appliances in an Azure Migrate project, you can use `ProjectName`, `ResourceGroupName`, and `ApplianceName` parameters to retrieve all VMs discovered using a specific Azure Migrate appliance. 

```azurepowershell
# Get all VMware VMs discovered by an Azure Migrate Appliance in an Azure Migrate project
$DiscoveredServers = Get-AzMigrateServer -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName -ApplianceName "MyMigrateAppliance" |Format-Table DisplayName, Name, Type

```

## Initialize replication infrastructure

[Azure Migrate: Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) leverages multiple Azure resources for migrating VMs. Server Migration provisions the following resources, in the same resource group as the project.

- **Service bus**: Server Migration uses the service bus to send replication orchestration messages to the appliance.
- **Gateway storage account**: Server Migration uses the gateway storage account to store state information about the VMs being replicated.
- **Log storage account**: The Azure Migrate appliance uploads replication logs for VMs to a log storage account. Azure Migrate applies the replication information to the replica-managed disks.
- **Key vault**: The Azure Migrate appliance uses the key vault to manage connection strings for the service bus, and access keys for the storage accounts used in replication.

Before replicating the first VM in the Azure Migrate project, run the following script to provision the replication infrastructure. This script provisions and configures the aforementioned resources so that you can start migrating your VMware VMs.

- One Azure Migrate project supports migrations to one Azure region only. Once you run this script, you can't change the target region to which you want to migrate your VMware VMs.
- You'll need to run the `Initialize-AzMigrateReplicationInfrastructure` script if you configure a new appliance in your Azure Migrate project. 

In the article, we'll initialize the replication infrastructure so that we can migrate our VMs to `Central US` region. You can [download the file](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/migrate-at-scale-vmware-agentles) from the GitHub repository or run it using the following snippet. 

```azurepowershell
# Download the script from Azure Migrate GitHub repository 
Invoke-WebRequest https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/azure-migrate/migrate-at-scale-vmware-agentles/Initialize-AzMigrateReplicationInfrastructure.ps1 -OutFile .\AzMigrateReplicationinfrastructure.ps1

# Run the script for initializing replication infrastructure for the current Migrate project
.\AzMigrateReplicationInfrastructure.ps1 -ResourceGroupName $ResourceGroup.ResourceGroupName -ProjectName $MigrateProject.Name -Scenario agentlessVMware -TargetRegion "CentralUS" 
```


## Replicate VMs

After completing discovery and initializing replication infrastructure, you can begin replication of VMware VMs to Azure. You can run up to 300 replications simultaneously.

You can specify the replication properties as follows.

- **Target subscription and resource group** - Specify the subscription and resource group that the VM should be migrated to by providing the resource group ID using the `TargetResourceGroupId` parameter. 
- **Target virtual network and subnet** - Specify the ID of the Azure Virtual Network and the name of the subnet that the VM should be migrated to by using the `TargetNetworkId` and `TargetSubnetName` parameters respectively. 
- **Target VM name** - Specify the name of the Azure VM to be created by using the `TargetVMName` parameter.
- **Target VM size** - Specify the Azure VM size to be used for the replicating VM by using `TargetVMSize` parameter. For instance, to migrate a VM to D2_v2 VM in Azure, specify the value for `TargetVMSize` as "Standard_D2_v2".  
- **License** - To use Azure Hybrid Benefit for your Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, specify the value for `LicenseType` parameter as "AHUB". Otherwise, specify the value for `LicenseType` parameter as "NoLicenseType".
- **OS Disk** - Specify the unique identifier of the disk that has the operating system bootloader and installer. The disk ID to be used is the unique identifier (UUID) property for the disk retrieved using the `Get-AzMigrateServer` cmdlet.
- **Disk Type** - Specify the value for the `DiskType` parameter as follows.
    - To use premium-managed disks, specify "Premium_LRS" as value for `DiskType` parameter. 
    - To use standard SSD disks, specify "StandardSSD_LRS" as value for `DiskType` parameter. 
    - To use standard HDD disks, specify "Standard_LRS" as value for `DiskType` parameter. 
- **Infrastructure redundancy** - Specify infrastructure redundancy option as follows. 
    - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. This option is only available if the target region selected for the migration supports Availability Zones. To use availability zones, specify the availability zone value for `TargetAvailabilityZone` parameter.
    - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets to use this option. To use availability set, specify the availability set ID for `TargetAvailabilitySet` parameter. 

In this tutorial, we'll replicate all the disks of the discovered VM and specify a new name for the VM in Azure. We specify the first disk of the discovered server as OS Disk and migrate all disks as Standard HDD. The OS disk is the disk that has the operating system bootloader and installer.

```azurepowershell
# Retrieve the resource group that you want to migrate to
$TargetResourceGroup = Get-AzResourceGroup -Name "MyTargetResourceGroup"

# Retrieve the Azure virtual network and subnet that you want to migrate to
$TargetVirtualNetwork = Get-AzVirtualNetwork -Name "MyVirtualNetwork"

# Start replication for a discovered VM in an Azure Migrate project
$MigrateJob =  New-AzMigrateServerReplication -InputObject $DiscoveredServer -TargetResourceGroupId $TargetResourceGroup.ResourceId -TargetNetworkId $TargetVirtualNetwork.Id -LicenseType "NoLicenseType" -OSDiskID $DiscoveredServer.Disk[0].Uuid -TargetSubnetName $TargetVirtualNetwork.Subnets[0].Name -DiskType "Standard_LRS" -TargetVMName "MyMigratedTestVM" -TargetVMSize "Standard_DS2_v2"

# Track job status to check for completion
while (($MigrateJob.State -eq "InProgress") -or ($MigrateJob.State -eq "NotStarted")){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $MigrateJob = Get-AzMigrateJob -InputObject $MigrateJob
}
#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
Write-Output $MigrateJob.State
```

You can also selectively replicate the disks of the discovered VM by using `New-AzMigrateDiskMapping` cmdlet and providing that as an input to the `DiskToInclude` parameter in the `New-AzMigrateServerReplication` cmdlet. You can also use `New-AzMigrateDiskMapping` cmdlet to specify different target disk types for each individual disk to be replicated. 

Specify values for the following parameters of the `New-AzMigrateDiskMapping` cmdlet.

- **DiskId** - Specify the unique identifier for the disk to be migrated. The disk ID to be used is the unique identifier (UUID) property for the disk retrieved using the `Get-AzMigrateServer` cmdlet.  
- **IsOSDisk** - Specify "true" if the disk to be migrated is the OS disk of the VM, else "false".
- **DiskType** - Specify the type of disk to be used in Azure. 

In the following example, we'll replicate only two disks of the discovered VM. we'll specify the OS disk and use different disk types for each disk to be replicated.

```azurepowershell
# View disk details of the discovered server
$DiscoveredServer.Disk | ConvertTo-JSON

# Create a new disk mapping for the disks to be replicated
$DisksToReplicate = @()
$OSDisk = New-AzMigrateDiskMapping -DiskID $DiscoveredServer.Disk[0].Uuid -DiskType "StandardSSD_LRS" -IsOSDisk "true"
$DataDisk = New-AzMigrateDiskMapping -DiskID $DiscoveredServer.Disk[1].Uuid -DiskType "Premium_LRS" -IsOSDisk "false"

$DisksToReplicate += $OSDisk
$DisksToReplicate += $DataDisk 

# Retrieve the resource group that you want to migrate to
$TargetResourceGroup = Get-AzResourceGroup -Name "MyTargetResourceGroup"

# Retrieve the Azure virtual network and subnet that you want to migrate to
$TargetVirtualNetwork = Get-AzVirtualNetwork -Name "MyVirtualNetwork"

# Start replication for the VM
$MigrateJob =  New-AzMigrateServerReplication -InputObject $DiscoveredServer -TargetResourceGroupId $TargetResourceGroup.ResourceId -TargetNetworkId $TargetVirtualNetwork.Id -LicenseType "NoLicenseType" -DiskToInclude $DisksToReplicate -TargetSubnetName $TargetVirtualNetwork.Subnets[0].Name -TargetVMName "MyMigratedTestVM" -TargetVMSize "Standard_DS2_v2"

# Track job status to check for completion
while (($MigrateJob.State -eq "InProgress") -or ($MigrateJob.State -eq "NotStarted")){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $MigrateJob = Get-AzMigrateJob -InputObject $MigrateJob
}
#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
Write-Output $MigrateJob.State
```

## Monitor replication 

Replication occurs as follows:

- When the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica-managed disks in Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.

Track the status of the replication by using the `Get-AzMigrateServerReplication` cmdlet. 

> [!NOTE]
> The discovered VM ID and replicating VM ID are two different unique identifiers. Both these identifiers can be used to retrieve details of a replicating server.  

### Monitor replication using discovered VM identifier
```azurepowershell
# Retrieve the replicating VM details by using the discovered VM identifier
$ReplicatingServer = Get-AzMigrateServerReplication -DiscoveredMachineId $DiscoveredServer.ID
```

### Monitor replication using replicating VM identifier

```azurepowershell
# List all replicating VMs in an Azure Migrate project and filter the result for selecting the replication VM. This cmdlet will not return all properties of the replicating VM.
$ReplicatingServer = Get-AzMigrateServerReplication -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName | where MachineName -eq $DiscoveredServer.DisplayName

# Retrieve replicating VM details using replicating VM identifier
$ReplicatingServer = Get-AzMigrateServerReplication -TargetObjectID $ReplicatingServer.Id 
```

You can track the "Migration State" and "Migration State Description" properties in the output. 
- For initial replication, the values for migration state and migration state description properties will be "InitialSeedingInProgress" and "Initial replication" respectively. 
- During delta replication, the values for migrate state and migration state description properties will be "Replicating" and "Ready to migrate" respectively.
- After you complete the migration, the values for migrate state and migration state description properties will be "Migration succeeded" and "Migrated" respectively.

```Output
AllowedOperation            : {DisableMigration, TestMigrate, Migrate}
CurrentJobId                : /Subscriptions/xxx/resourceGroups/xxx/providers/Micr
                              osoft.RecoveryServices/vaults/xxx/replicationJobs/None
CurrentJobName              : None
CurrentJobStartTime         : 1/1/1753 1:01:01 AM
EventCorrelationId          : 9d435c55-4660-41a5-a8ed-dd74213d85fa
Health                      : Normal
HealthError                 : {}
Id                          : /Subscriptions/xxx/resourceGroups/xxx/providers/Micr
                              osoft.RecoveryServices/vaults/xxx/replicationFabrics/xxx/replicationProtectionContainers/xxx/
                              replicationMigrationItems/10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_5009e941-3e40-
                              39b2-1e14-f90584522703
LastTestMigrationStatus     :
LastTestMigrationTime       :
Location                    :
MachineName                 : MyTestVM
MigrationState              : InitialSeedingInProgress
MigrationStateDescription   : Initial replication
Name                        : 10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_5009e941-3e40-39b2-1e14-f90584522703
PolicyFriendlyName          : xxx
PolicyId                    : /Subscriptions/xxx/resourceGroups/xxx/providers/Micr
                              osoft.RecoveryServices/vaults/xxx/replicationPolicies/xxx
ProviderSpecificDetail      : Microsoft.Azure.PowerShell.Cmdlets.Migrate.Models.Api20180110.VMwareCbtMigrationDetails
TestMigrateState            : None
TestMigrateStateDescription : None
Type                        : Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems
```

For details on replication progress, run the following cmdlet.

```azurepowershell
$replicatingserver.ProviderSpecificDetail | convertto-json
```
You can track the initial replication progress using the "Initial Seeding Progress Percentage" properties in the output.

```output
    "DataMoverRunAsAccountId": "/subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.OffAzure/VMwareSites/xxx/runasaccounts/xxx",
    "FirmwareType":  "BIOS",
    "InitialSeedingProgressPercentage": 20,
    "InstanceType":  "VMwareCbt",
    "LastRecoveryPointReceived":  "\/Date(1601733591427)\/",
    "LicenseType":  "NoLicenseType",
    "MigrationProgressPercentage":  null,
    "MigrationRecoveryPointId":  null,
    "OSType":  "Windows",
    "PerformAutoResync":  "true",
```

Replication occurs as follows:

- When the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica-managed disks in Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.

## Update properties of a replicating VM

[Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) allows you to change target properties, such as name, size, resource group, NIC configuration and so on, for a replicating VM. 

```azurepowershell
# Retrieve the replicating VM details by using the discovered VM identifier
$ReplicatingServer = Get-AzMigrateServerReplication -DiscoveredMachineId $DiscoveredServer.ID

# View NIC details of the replicating server
Write-Output $ReplicatingServer.ProviderSpecificDetail.VMNic 
```
The following properties can be updated for a VM.

- **VM Name** - Specify the name of the Azure VM to be created by using the `TargetVMName` parameter.
- **VM size** - Specify the Azure VM size to be used for the replicating VM by using `TargetVMSize` parameter. For instance, to migrate a VM to D2_v2 VM in Azure, specify the value for `TargetVMSize` as "Standard_D2_v2".  
- **Virtual Network** - Specify the ID of the Azure Virtual Network that the VM should be migrated to by using the `TargetNetworkId` parameter. 
- **Resource Group** - Specify the ID of the resource group that the VM should be migrated to by providing the resource group ID using the `TargetResourceGroupId` parameter.
- **Network Interface** - NIC configuration can be specified using the `New-AzMigrateNicMapping` cmdlet. The object is then passed an input to the `NicToUpdate` parameter in the `Set-AzMigrateServerReplication` cmdlet. 

    - **Change IP allocation** -To specify a static IP for a NIC, provide the IPv4 address to be used as static IP for the VM using the `TargetNicIP` parameter. To dynamically assign an IP for a NIC, provide "auto" as the value for the `TargetNicIP` parameter.
    - Use values "Primary", "Secondary" or "DoNotCreate" for `TargetNicSelectionType` parameter to specify whether the NIC should be primary, secondary, or is not to be created on the migrated VM. Only one NIC can be specified as the primary NIC for the VM. 
    - To make a NIC primary, you'll also need to specify the other NICs that should be made secondary or are not to be created on the migrated VM.  
    - To change the subnet for the NIC, specify the name of the subnet by using the `TargetNicSubnet` parameter.

 - **Availability Zone** - To use availability zones, specify the availability zone value for `TargetAvailabilityZone` parameter.
 - **Availability Set** - To use availability set, specify the availability set ID for `TargetAvailabilitySet` parameter.

In the following example, we'll update the NIC configuration by making the first NIC as primary and assigning a static IP to it. we'll discard the second NIC for migration and update the target VM name and size. 

```azurepowershell
# Specify the NIC properties to be updated for a replicating VM. 
$NicMapping = @()
$NicMapping1 = New-AzMigrateNicMapping -NicId $ReplicatingServer.ProviderSpecificDetail.VMNic[0].NicId -TargetNicIP "xxx.xxx.xxx.xxx" -TargetNicSelectionType "Primary"
$NicMapping2 = New-AzMigrateNicMapping -NicId $ReplicatingServer.ProviderSpecificDetail.VMNic[1].NicId -TargetNicSelectionType "DoNotCreate"

$NicMapping += $NicMapping1
$NicMapping += $NicMapping2

# Update the name, size and NIC configuration of a replicating server
$UpdateJob = Set-AzMigrateServerReplication -InputObject $ReplicatingServer -TargetVMSize "Standard_DS13_v2" -TargetVMName "MyMigratedVM" -NicToUpdate $NicMapping
```

You can also list all replicating servers in an Azure Migrate project and then use the replicating VM identifier to update VM properties.

```azurepowershell
# List all replicating VMs in an Azure Migrate project and filter the result for selecting the replication VM. This cmdlet will not return all properties of the replicating VM.
$ReplicatingServer = Get-AzMigrateServerReplication -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName | where MachineName -eq $DiscoveredServer.DisplayName

# Retrieve replicating VM details using replicating VM identifier
$ReplicatingServer = Get-AzMigrateServerReplication -TargetObjectID $ReplicatingServer.Id 
```


## Run a test migration

When delta replication begins, you can run a test migration for the VMs before running a full migration to Azure. We highly recommend that you do test migration at least once for each machine before you migrate it.

- Running a test migration checks that migration will work as expected. Test migration doesn't impact the on-premises machine, which remains operational, and continues replicating. 
- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

Select the Azure Virtual Network to be used for testing by specifying the ID of the virtual network using the `TestNetworkID` parameter.

```azurepowershell
# Retrieve the Azure virtual network created for testing 
$TestVirtualNetwork = Get-AzVirtualNetwork -Name MyTestVirtualNetwork

# Start test migration for a replicating server
$TestMigrationJob = Start-AzMigrateTestMigration -InputObject $ReplicatingServer -TestNetworkID $TestVirtualNetwork.Id
```

After testing is complete, clean-up the test migration using the `Start-AzMigrateTestMigrationCleanup` cmdlet.

```azurepowershell
# Clean-up test migration for a replicating server
$CleanupTestMigrationJob = Start-AzMigrateTestMigrationCleanup -InputObject $ReplicatingServer
```

## Migrate VMs

After you've verified that the test migration works as expected, you can migrate the replicating server using the following cmdlet.

```azurepowershell
# Start migration for a replicating server and turn off source server as part of migration
$MigrateJob = Start-AzMigrateServerMigration -InputObject $ReplicatingServer -TurnOffSourceServer 
```
If you don't want to turn-off the source server, then don't use `TurnOffSourceServer` parameter.

## Complete the migration

1. After the migration is done, stop replication for the on-premises machine and clean-up replication state information for the VM using the following cmdlet.

```azurepowershell
# Stop replication for a migrated server
$StopReplicationJob = Remove-AzMigrateServerReplication -InputObject $ReplicatingServer 
```

2. Install the Azure VM [Windows](../virtual-machines/extensions/agent-windows.md) or [Linux](../virtual-machines/extensions/agent-linux.md) agent on the migrated machines.
3. Perform any post-migration app tweaks, such as updating database connection strings, and web server configurations.
4. Perform final application and migration acceptance testing on the migrated application now running in Azure.
5. Cut over traffic to the migrated Azure VM instance.
6. Remove the on-premises VMs from your local VM inventory.
7. Remove the on-premises VMs from local backups.
8. Update any internal documentation to show the new location and IP address of the Azure VMs. 

## Post-migration best practices

- For increased resilience:
    - Keep data secure by backing up Azure VMs using the Azure Backup service. [Learn more](../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Azure Security Center - Just in time administration](../security-center/security-center-just-in-time.md).
    - Restrict network traffic to management endpoints with [Network Security Groups](../virtual-network/security-overview.md).
    - Deploy [Azure Disk Encryption](../security/fundamentals/azure-disk-encryption-vms-vmss.md) to help secure disks, and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/), and visit the [Azure Security Center](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
-  Consider deploying [Azure Cost Management](../cost-management-billing/cloudyn/overview.md) to monitor resource usage and spending.


## Next steps

Investigate the cloud migration journey in the Azure Cloud Adoption Framework.
