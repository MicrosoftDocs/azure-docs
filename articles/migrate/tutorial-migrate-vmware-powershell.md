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


In this article, you will learn how to migrate discovered VMware VMs using Azure PowerShell for VMware agentless migration using [Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool). 

You learn how to:

> [!div class="checklist"]
> *Retrieve discovered VMware VMs  in an Azure Migrate project.
> *Start replicating VMs.
> *Run a test migration to make sure everything's working as expected.
> *Run a full VM migration.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, you should:

1. [Complete the first tutorial](tutorial-prepare-vmware.md) to prepare Azure and VMware for migration.
2. We recommend that you complete the second tutorial to [assess VMware VMs](tutorial-assess-vmware.md) before migrating them to Azure, but you don't have to.
3. You have the Azure PowerShell `Az` module. If you need to install or upgrade Azure PowerShell, follow this [Guide to install and configure Azure PowerShell](/powershell/azure/install-az-ps)

## Sign in to your Microsoft Azure subscription

Sign in to your Azure subscription with the `Connect-AzAccount` cmdlet.

```azurepowershell
Connect-AzAccount
```

Select your Azure subscription. Use the `Get-AzSubscription` cmdlet to get the list of Azure subscriptions you have access to. Select the Azure subscription to work with using the `Set-AzContext` cmdlet.

```azurepowershell
Set-AzContext -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

## Retrieve the Azure Migrate project

```azurepowershell
# Get details of the Azure Migrate project
$MigrateProject = Get-AzMigrateProject -Name TestProject -ResourceGroupName $RGName
```

## Retrieve discovered VMs in an Azure Migrate project

To retrieve all VMware VMs in an Azure Migrate project, use the following cmdlet.

```azurepowershell
# Get all VMware VMs in an Azure Migrate project
$DiscoveredServers = Get-AzMigrateDiscoveredServer -ProjectName $MigrateProject.Name -ResourceGroupName $MigrateProject.ResourceGroupName
```

To retrieve a specific VMware VM in an Azure Migrate project, specify the VM name using the `Name` parameter. If you have multiple appliances in an Azure Migrate project, you can also use the `ApplianceName` parameter to retrieve all VMs discovered using a specific Azure Migrate appliance. 

```azurepowershell
# Get a specific VMware VM in an Azure Migrate project
$DiscoveredServers = Get-AzMigrateDiscoveredServer -ProjectName $MigrateProject.Name -ResourceGroupName $MigrateProject.ResourceGroupName -Name "DemoVM"

# Get all VMware VMs discovered by an Azure Migrate Appliance in an Azure Migrate project
$DiscoveredServers = Get-AzMigrateDiscoveredServer -ProjectName $MigrateProject.Name -ResourceGroupName $MigrateProject.ResourceGroupName -ApplianceName "DemoAppliance"
```

## Setup replication infrastructure

[Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) leverages multiple Azure artefacts for migrating VMs. These artefacts include an Azure Key Vault, Service Bus, 2 storage accounts and a Recovery Services vault. Setting up this replication infrastructure is a one-time activity in an Azure Migrate project and performed before enabling replication for the first VM.
To setup the replication infrastructure, use the following subscription


##Replicate VMs
After setting up the appliance and completing discovery, you can begin replication of VMware VMs to Azure. 

- You can run up to 300 replications simultaneously.

```azurepowershell
# Start replication for a discovered VM in an Azure Migrate project
$MigrateJob =  New-AzMigrateServerReplication -InputObject $DiscoveredServers[0] -TargetNetworkId $TargetVNetId -LicenseType "NoLicenseType" -OSDiskID $DiscoveredServers[0].Disk[0].Uuid -TargetSubnetName "default" -DiskType "Standard_LRS" -TargetVMName "newtestvm" -TargetVMSize "Standard_DS2_v2"

# Track job status to check for completion
while (($MigrateJob.State -eq "InProgress") -or ($MigrateJob.State -eq "NotStarted")){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $TempASRJob = Get-AzMigrateJob -InputObject $MigrateJob
```

##Update properties of a replicating VM

```azurepowershell
#Retrieve the replicating VM
$ReplicatingServer = Get-AzMigrateServerReplication -TargetObjectId $DiscoveredServers[0].Id 

#To list all replicating servers in an Azure Migrate Project
$ReplicatingServerList = Get-AzMigrateServerReplication -ProjectName $MigrateProject -ResourceGroupName $RGName

#To update properties of a replicating VM
$UpdateJob = Set-AzMigrateServerReplication -InputObject $ReplicatingServer -TargetVMSize "Standard_DS13_v2" -TargetVMName "TestVM"

#To update NICs of a replicating VM
$NicMapping = @()
$NicMapping1 = New-AzMigrateNicMapping -NicId $ReplicatingServer.ProviderSpecificDetail.VMNic[0].NicId -TargetNicIP "xxx.xxx.xxx.xxx"
$NicMapping2 = New-AzMigrateNicMapping -NicId $ReplicatingServer.ProviderSpecificDetail.VMNic[1].NicId -TargetNicIP "xxx.xxx.xxx.xxx"

$NicMapping += $NicMapping1
$NicMapping += $NicMapping2

$UpdateJob = Set-AzMigrateServerReplication -InputObject $ReplicatingServer -TargetVMSize "Standard_DS13_v2" -TargetVMName "TestVM" -NicToUpdate $NicMapping
```

##Run a test migration

When delta replication begins, you can run a test migration for the VMs, before running a full migration to Azure. We highly recommend that you do this at least once for each machine, before you migrate it.

- Running a test migration checks that migration will work as expected, without impacting the on-premises machines, which remain operational, and continue replicating. 
- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

```azurepowershell
#Start test migration for a replicating server
$TestMigrationJob = Start-AzMigrateTestMigration -InputObject $ReplicatingServer
```

After testing is complete, clean-up the test migration using the following cmdlet

```azurepowershell
#Clean-up test migration for a replicating server
$CleanupTestMigrationJob = Start-AzMigrateTestMigrationCleanup -InputObject $ReplicatingServer
```

## Migrate VMs

After you've verified that the test migration works as expected, you can migrate the replicating server using the following cmdlet.

```azurepowershell
#Start migration for a replicating server
$MigrateJob = Start-AzMigrateServerMigration -InputObject $ReplicatingServer -TurnOffSourceServer "yes"
```

## Complete the migration

1. After the migration is done, stop replication for the on-premises machine and clean up replication state information for the VM using the following cmdlet.

```azurepowershell
#Stop replication for a migrated server
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

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework
