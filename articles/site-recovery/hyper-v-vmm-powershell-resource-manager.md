---
title: Set up Hyper-V (with VMM) disaster recovery to a secondary site with Azure Site Recovery/PowerShell
description: Describes how to set up disaster recovery of Hyper-V VMs in VMM clouds to a secondary VMM site using Azure Site Recovery and PowerShell.
services: site-recovery
author: ankitaduttaMSFT
manager: rochakm
ms.topic: article
ms.date: 1/10/2020
ms.author: ankitadutta
ms.custom: devx-track-azurepowershell
---

# Set up disaster recovery of Hyper-V VMs to a secondary site by using PowerShell (Resource Manager)

This article shows how to automate the steps for replication of Hyper-V VMs in System Center Virtual Machine Manager clouds to a Virtual Machine Manager cloud in a secondary on-premises site by using [Azure Site Recovery](site-recovery-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

- Review the [scenario architecture and components](hyper-v-vmm-architecture.md).
- Review the [support requirements](./vmware-physical-secondary-support-matrix.md) for all components.
- Make sure that Virtual Machine Manager servers and Hyper-V hosts comply with [support requirements](./vmware-physical-secondary-support-matrix.md).
- Check that the VMs you want to replicate comply with [replicated machine support](./vmware-physical-secondary-support-matrix.md).

## Prepare for network mapping

[Network mapping](hyper-v-vmm-network-mapping.md) maps between on-premises Virtual Machine Manager VM networks in source and target clouds. Mapping does the following:

- Connects VMs to appropriate target VM networks after failover.
- Optimally places replica VMs on target Hyper-V host servers.
- If you don't configure network mapping, replica VMs won't be connected to a VM network after failover.

Prepare Virtual Machine Manager as follows:

- Make sure you have [Virtual Machine Manager logical networks](/system-center/vmm/network-logical) on the source and target Virtual Machine Manager servers:
  - The logical network on the source server should be associated with the source cloud in which Hyper-V hosts are located.
  - The logical network on the target server should be associated with the target cloud.
- Make sure you have [VM networks](/system-center/vmm/network-virtual) on the source and target Virtual Machine Manager servers. VM networks should be linked to the logical network in each location.
- Connect VMs on the source Hyper-V hosts to the source VM network.

## Prepare for PowerShell

Make sure you have Azure PowerShell ready to go:

- If you already use PowerShell, upgrade to version 0.8.10 or later. [Learn more](/powershell/azure/) about how to set up PowerShell.
- After you set up and configure PowerShell, review the [service cmdlets](/powershell/azure/).
- To learn more about how to use parameter values, inputs, and outputs in PowerShell, read the [Get started](/powershell/azure/get-started-azureps) guide.

## Set up a subscription

1. From PowerShell, sign in to your Azure account.

   ```azurepowershell
   $UserName = "<user@live.com>"
   $Password = "<password>"
   $SecurePassword = ConvertTo-SecureString -AsPlainText $Password -Force
   $Cred = New-Object System.Management.Automation.PSCredential -ArgumentList $UserName, $SecurePassword
   Connect-AzAccount #-Credential $Cred
   ```

1. Retrieve a list of your subscriptions, with the subscription IDs. Note the ID of the subscription in which you want to create the Recovery Services vault.

   ```azurepowershell
   Get-AzSubscription
   ```

1. Set the subscription for the vault.

   ```azurepowershell
   Set-AzContext –SubscriptionID <subscriptionId>
   ```

## Create a Recovery Services vault

1. Create an Azure Resource Manager resource group if you don't have one.

   ```azurepowershell
   New-AzResourceGroup -Name #ResourceGroupName -Location #location
   ```

1. Create a new Recovery Services vault. Save the vault object in a variable to be used later.

   ```azurepowershell
   $vault = New-AzRecoveryServicesVault -Name #vaultname -ResourceGroupName #ResourceGroupName -Location #location
   ```

   You can retrieve the vault object after you create it by using the `Get-AzRecoveryServicesVault` cmdlet.

## Set the vault context

1. Retrieve an existing vault.

   ```azurepowershell
   $vault = Get-AzRecoveryServicesVault -Name #vaultname
   ```

1. Set the vault context.

   ```azurepowershell
   Set-AzRecoveryServicesAsrVaultContext -Vault $vault
   ```

## Install the Site Recovery provider

1. On the Virtual Machine Manager machine, create a directory by running the following command:

   ```azurepowershell
   New-Item -Path C:\ASR -ItemType Directory
   ```

1. Extract the files by using the downloaded provider setup file.

   ```console
   pushd C:\ASR\
   .\AzureSiteRecoveryProvider.exe /x:. /q
   ```

1. Install the provider, and wait for installation to finish.

   ```console
   .\SetupDr.exe /i
   $installationRegPath = "HKLM:\Software\Microsoft\Microsoft System Center Virtual Machine Manager Server\DRAdapter"
   do
   {
     $isNotInstalled = $true;
     if(Test-Path $installationRegPath)
     {
       $isNotInstalled = $false;
     }
   }While($isNotInstalled)
   ```

1. Register the server in the vault.

   ```console
   $BinPath = $env:SystemDrive+"\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin"
   pushd $BinPath
   $encryptionFilePath = "C:\temp\".\DRConfigurator.exe /r /Credentials $VaultSettingFilePath /vmmfriendlyname $env:COMPUTERNAME /dataencryptionenabled $encryptionFilePath /startvmmservice
   ```

## Create and associate a replication policy

1. Create a replication policy, in this case for Hyper-V 2012 R2, as follows:

   ```azurepowershell
   $ReplicationFrequencyInSeconds = "300";        #options are 30,300,900
   $PolicyName = “replicapolicy”
   $RepProvider = HyperVReplica2012R2
   $Recoverypoints = 24                    #specify the number of hours to retain recovery points
   $AppConsistentSnapshotFrequency = 4 #specify the frequency (in hours) at which app consistent snapshots are taken
   $AuthMode = "Kerberos"  #options are "Kerberos" or "Certificate"
   $AuthPort = "8083"  #specify the port number that will be used for replication traffic on Hyper-V hosts
   $InitialRepMethod = "Online" #options are "Online" or "Offline"

   $policyresult = New-AzRecoveryServicesAsrPolicy -Name $policyname -ReplicationProvider $RepProvider -ReplicationFrequencyInSeconds $Replicationfrequencyinseconds -NumberOfRecoveryPointsToRetain $recoverypoints -ApplicationConsistentSnapshotFrequencyInHours $AppConsistentSnapshotFrequency -Authentication $AuthMode -ReplicationPort $AuthPort -ReplicationMethod $InitialRepMethod
   ```

   > [!NOTE]
   > The Virtual Machine Manager cloud can contain Hyper-V hosts running different versions of Windows Server, but the replication policy is for a specific version of an operating system. If you have different hosts running on different operating systems, create separate replication policies for each system. For example, if you have five hosts running on Windows Server 2012 and three hosts running on Windows Server 2012 R2, create two replication policies. You create one for each type of operating system.

1. Retrieve the primary protection container (primary Virtual Machine Manager cloud) and recovery protection container (recovery Virtual Machine Manager cloud).

   ```azurepowershell
   $PrimaryCloud = "testprimarycloud"
   $primaryprotectionContainer = Get-AzRecoveryServicesAsrProtectionContainer -FriendlyName $PrimaryCloud;

   $RecoveryCloud = "testrecoverycloud"
   $recoveryprotectionContainer = Get-AzRecoveryServicesAsrProtectionContainer -FriendlyName $RecoveryCloud;
   ```

1. Retrieve the replication policy you created by using the friendly name.

   ```azurepowershell
   $policy = Get-AzRecoveryServicesAsrPolicy -FriendlyName $policyname
   ```

1. Start the association of the protection container (Virtual Machine Manager cloud) with the replication policy.

   ```azurepowershell
   $associationJob  = New-AzRecoveryServicesAsrProtectionContainerMapping -Policy $Policy -PrimaryProtectionContainer $primaryprotectionContainer -RecoveryProtectionContainer $recoveryprotectionContainer
   ```

1. Wait for the policy association job to finish. To check if the job is finished, use the following PowerShell snippet:

   ```azurepowershell
   $job = Get-AzRecoveryServicesAsrJob -Job $associationJob

   if($job -eq $null -or $job.StateDescription -ne "Completed")
   {
     $isJobLeftForProcessing = $true;
   }
   ```

1. After the job finishes processing, run the following command:

   ```azurepowershell
   if($isJobLeftForProcessing)
   {
     Start-Sleep -Seconds 60
   }
   While($isJobLeftForProcessing)
   ```

To check the completion of the operation, follow the steps in [Monitor activity](#monitor-activity).

##  Configure network mapping

1. Use this command to retrieve servers for the current vault. The command stores the Site Recovery servers in the `$Servers` array variable.

   ```azurepowershell
   $Servers = Get-AzRecoveryServicesAsrFabric
   ```

1. Run this command to retrieve the networks for the source Virtual Machine Manager server and the target Virtual Machine Manager server.

   ```azurepowershell
   $PrimaryNetworks = Get-AzRecoveryServicesAsrNetwork -Fabric $Servers[0]

   $RecoveryNetworks = Get-AzRecoveryServicesAsrNetwork -Fabric $Servers[1]
   ```

   > [!NOTE]
   > The source Virtual Machine Manager server can be the first or second one in the server array. Check Virtual Machine Manager server names, and retrieve the networks appropriately.

1. This cmdlet creates a mapping between the primary network and the recovery network. It specifies the primary network as the first element of `$PrimaryNetworks`. It specifies the recovery network as the first element of `$RecoveryNetworks`.

   ```azurepowershell
   New-AzRecoveryServicesAsrNetworkMapping -PrimaryNetwork $PrimaryNetworks[0] -RecoveryNetwork $RecoveryNetworks[0]
   ```

## Enable protection for VMs

After the servers, clouds, and networks are configured correctly, enable protection for VMs in the cloud.

1. To enable protection, run the following command to retrieve the protection container:

   ```azurepowershell
   $PrimaryProtectionContainer = Get-AzRecoveryServicesAsrProtectionContainer -FriendlyName $PrimaryCloudName
   ```

1. Get the protection entity (VM), as follows:

   ```azurepowershell
   $protectionEntity = Get-AzRecoveryServicesAsrProtectableItem -FriendlyName $VMName -ProtectionContainer $PrimaryProtectionContainer
   ```

1. Enable replication for the VM.

   ```azurepowershell
   $jobResult = New-AzRecoveryServicesAsrReplicationProtectedItem -ProtectableItem $protectionentity -ProtectionContainerMapping $policy -VmmToVmm
   ```

> [!NOTE]
> If you wish to replicate to CMK enabled managed disks in Azure, do the following steps using Az PowerShell 3.3.0 onwards:
>
> 1. Enable failover to managed disks by updating VM properties
> 1. Use the `Get-AzRecoveryServicesAsrReplicationProtectedItem` cmdlet to fetch the disk ID for each disk of the protected item
> 1. Create a dictionary object using `New-Object "System.Collections.Generic.Dictionary``2[System.String,System.String]"` cmdlet to contain the mapping of disk ID to disk encryption set. These disk encryption sets are to be pre-created by you in the target region.
> 1. Update the VM properties using `Set-AzRecoveryServicesAsrReplicationProtectedItem` cmdlet by passing the dictionary object in **DiskIdToDiskEncryptionSetMap** parameter.

## Run a test failover

To test your deployment, run a test failover for a single virtual machine. You also can create a recovery plan that contains multiple VMs and run a test failover for the plan. Test failover simulates your failover and recovery mechanism in an isolated network.

1. Retrieve the VM into which VMs will fail over.

   ```azurepowershell
   $Servers = Get-AzRecoveryServicesASRFabric
   $RecoveryNetworks = Get-AzRecoveryServicesAsrNetwork -Name $Servers[1]
   ```

1. Perform a test failover.

   For a single VM:

   ```azurepowershell
   $protectionEntity = Get-AzRecoveryServicesAsrProtectableItem -FriendlyName $VMName -ProtectionContainer $PrimaryprotectionContainer

   $jobIDResult = Start-AzRecoveryServicesAsrTestFailoverJob -Direction PrimaryToRecovery -ReplicationProtectedItem $protectionEntity -VMNetwork $RecoveryNetworks[1]
   ```

   For a recovery plan:

   ```azurepowershell
   $recoveryplanname = "test-recovery-plan"

   $recoveryplan = Get-AzRecoveryServicesAsrRecoveryPlan -FriendlyName $recoveryplanname

   $jobIDResult = Start-AzRecoveryServicesAsrTestFailoverJob -Direction PrimaryToRecovery -RecoveryPlan $recoveryplan -VMNetwork $RecoveryNetworks[1]
   ```

To check the completion of the operation, follow the steps in [Monitor activity](#monitor-activity).

## Run planned and unplanned failovers

1. Perform a planned failover.

   For a single VM:

   ```azurepowershell
   $protectionEntity = Get-AzRecoveryServicesAsrProtectableItem -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

   $jobIDResult = Start-AzRecoveryServicesAsrPlannedFailoverJob -Direction PrimaryToRecovery -ReplicationProtectedItem $protectionEntity
   ```

   For a recovery plan:

   ```azurepowershell
   $recoveryplanname = "test-recovery-plan"

   $recoveryplan = Get-AzRecoveryServicesAsrRecoveryPlan -FriendlyName $recoveryplanname

   $jobIDResult = Start-AzRecoveryServicesAsrPlannedFailoverJob -Direction PrimaryToRecovery -RecoveryPlan $recoveryplan
   ```

1. Perform an unplanned failover.

   For a single VM:

   ```azurepowershell
   $protectionEntity = Get-AzRecoveryServicesAsrProtectableItem -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

   $jobIDResult = Start-AzRecoveryServicesAsrUnplannedFailoverJob -Direction PrimaryToRecovery -ReplicationProtectedItem $protectionEntity
   ```

   For a recovery plan:

   ```azurepowershell
   $recoveryplanname = "test-recovery-plan"

   $recoveryplan = Get-AzRecoveryServicesAsrRecoveryPlan -FriendlyName $recoveryplanname

   $jobIDResult = Start-AzRecoveryServicesAsrUnplannedFailoverJob -Direction PrimaryToRecovery -RecoveryPlan $recoveryplan
   ```

## Monitor activity

Use the following commands to monitor failover activity. Wait for the processing to finish in between jobs.

```azurepowershell
Do
{
    $job = Get-AzRecoveryServicesAsrJob -TargetObjectId $associationJob.JobId;
    Write-Host "Job State:{0}, StateDescription:{1}" -f Job.State, $job.StateDescription;
    if($job -eq $null -or $job.StateDescription -ne "Completed")
    {
        $isJobLeftForProcessing = $true;
    }

if($isJobLeftForProcessing)
    {
        Start-Sleep -Seconds 60
    }
}While($isJobLeftForProcessing)
```

## Next steps

[Learn more](/powershell/module/az.recoveryservices) about Site Recovery with Resource Manager PowerShell cmdlets.
