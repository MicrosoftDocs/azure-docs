---
title: Replicate Hyper-V VMs in Virtual Machine Manager clouds to a secondary site with PowerShell (Azure Resource Manager) | Microsoft Docs
description: Describes how to replicate Hyper-V VMs in Virtual Machine Manager clouds to a secondary Virtual Machine Manager site by using PowerShell (Resource Manager)
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: sutalasi
---

# Replicate Hyper-V VMs to a secondary site by using PowerShell (Resource Manager)

This article shows how to automate the steps for replication of Hyper-V VMs in System Center Virtual Machine Manager clouds to a Virtual Machine Manager cloud in a secondary on-premises site by using [Azure Site Recovery](site-recovery-overview.md).

## Prerequisites

- Review the [scenario architecture and components](hyper-v-vmm-architecture.md).
- Review the [support requirements](site-recovery-support-matrix-to-sec-site.md) for all components.
- Make sure that Virtual Machine Manager servers and Hyper-V hosts comply with [support requirements](site-recovery-support-matrix-to-sec-site.md).
- Check that the VMs you want to replicate comply with [replicated machine support](site-recovery-support-matrix-to-sec-site.md).


## Prepare for network mapping

[Network mapping](hyper-v-vmm-network-mapping.md) maps between on-premises Virtual Machine Manager VM networks in source and target clouds. Mapping does the following:

- Connects VMs to appropriate target VM networks after failover. 
- Optimally places replica VMs on target Hyper-V host servers. 
- If you don't configure network mapping, replica VMs won't be connected to a VM network after failover.

Prepare Virtual Machine Manager as follows:

* Make sure you have [Virtual Machine Manager logical networks](https://docs.microsoft.com/system-center/vmm/network-logical) on the source and target Virtual Machine Manager servers:

    - The logical network on the source server should be associated with the source cloud in which Hyper-V hosts are located.
    - The logical network on the target server should be associated with the target cloud.
* Make sure you have [VM networks](https://docs.microsoft.com/system-center/vmm/network-virtual) on the source and target Virtual Machine Manager servers. VM networks should be linked to the logical network in each location.
* Connect VMs on the source Hyper-V hosts to the source VM network. 

## Prepare for PowerShell

Make sure you have Azure PowerShell ready to go:

- If you already use PowerShell, upgrade to version 0.8.10 or later. [Learn more](/powershell/azureps-cmdlets-docs) about how to set up PowerShell.
- After you set up and configure PowerShell, review the [service cmdlets](/powershell/azure/overview).
- To learn more about how to use parameter values, inputs, and outputs in PowerShell, read the [Get started](/powershell/azure/get-started-azureps) guide.

## Set up a subscription
1. From PowerShell, sign in to your Azure account.

        $UserName = "<user@live.com>"
        $Password = "<password>"
        $SecurePassword = ConvertTo-SecureString -AsPlainText $Password -Force
        $Cred = New-Object System.Management.Automation.PSCredential -ArgumentList $UserName, $SecurePassword
        Connect-AzureRmAccount #-Credential $Cred
2. Retrieve a list of your subscriptions, with the subscription IDs. Note the ID of the subscription in which you want to create the Recovery Services vault. 

        Get-AzureRmSubscription
3. Set the subscription for the vault.

        Set-AzureRmContext –SubscriptionID <subscriptionId>

## Create a Recovery Services vault
1. Create an Azure Resource Manager resource group if you don't have one.

        New-AzureRmResourceGroup -Name #ResourceGroupName -Location #location
2. Create a new Recovery Services vault. Save the vault object in a variable to be used later. 

        $vault = New-AzureRmRecoveryServicesVault -Name #vaultname -ResouceGroupName #ResourceGroupName -Location #location
   
    You can retrieve the vault object after you create it by using the Get-AzureRMRecoveryServicesVault cmdlet.

## Set the vault context
1. Retrieve an existing vault.

       $vault = Get-AzureRmRecoveryServicesVault -Name #vaultname
2. Set the vault context.

       Set-AzureRmSiteRecoveryVaultSettings -ARSVault $vault

## Install the Site Recovery provider
1. On the Virtual Machine Manager machine, create a directory by running the following command:

       New-Item c:\ASR -type directory
2. Extract the files by using the downloaded provider setup file.

       pushd C:\ASR\
       .\AzureSiteRecoveryProvider.exe /x:. /q
3. Install the provider, and wait for installation to finish.

       .\SetupDr.exe /i
       $installationRegPath = "hklm:\software\Microsoft\Microsoft System Center Virtual Machine Manager Server\DRAdapter"
       do
       {
         $isNotInstalled = $true;
         if(Test-Path $installationRegPath)
         {
           $isNotInstalled = $false;
         }
       }While($isNotInstalled)

4. Register the server in the vault.

       $BinPath = $env:SystemDrive+"\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin"
       pushd $BinPath
       $encryptionFilePath = "C:\temp\".\DRConfigurator.exe /r /Credentials $VaultSettingFilePath /vmmfriendlyname $env:COMPUTERNAME /dataencryptionenabled $encryptionFilePath /startvmmservice

## Create and associate a replication policy
1. Create a replication policy, in this case for Hyper-V 2012 R2, as follows:

        $ReplicationFrequencyInSeconds = "300";        #options are 30,300,900
        $PolicyName = “replicapolicy”
        $RepProvider = HyperVReplica2012R2
        $Recoverypoints = 24                    #specify the number of hours to retain recovery pints
        $AppConsistentSnapshotFrequency = 4 #specify the frequency (in hours) at which app consistent snapshots are taken
        $AuthMode = "Kerberos"  #options are "Kerberos" or "Certificate"
        $AuthPort = "8083"  #specify the port number that will be used for replication traffic on Hyper-V hosts
        $InitialRepMethod = "Online" #options are "Online" or "Offline"

        $policyresult = New-AzureRmSiteRecoveryPolicy -Name $policyname -ReplicationProvider $RepProvider -ReplicationFrequencyInSeconds $Replicationfrequencyinseconds -RecoveryPoints $recoverypoints -ApplicationConsistentSnapshotFrequencyInHours $AppConsistentSnapshotFrequency -Authentication $AuthMode -ReplicationPort $AuthPort -ReplicationMethod $InitialRepMethod

    > [!NOTE]
    > The Virtual Machine Manager cloud can contain Hyper-V hosts running different versions of Windows Server, but the replication policy is for a specific version of an operating system. If you have different hosts running on different operating systems, create separate replication policies for each system. For example, if you have five hosts running on Windows Server 2012 and three hosts running on Windows Server 2012 R2, create two replication policies. You create one for each type of operating system.

2. Retrieve the primary protection container (primary Virtual Machine Manager cloud) and recovery protection container (recovery Virtual Machine Manager cloud).

       $PrimaryCloud = "testprimarycloud"
       $primaryprotectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $PrimaryCloud;  

       $RecoveryCloud = "testrecoverycloud"
       $recoveryprotectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $RecoveryCloud;  
3. Retrieve the replication policy you created by using the friendly name.

       $policy = Get-AzureRmSiteRecoveryPolicy -FriendlyName $policyname
4. Start the association of the protection container (Virtual Machine Manager cloud) with the replication policy.

       $associationJob  = Start-AzureRmSiteRecoveryPolicyAssociationJob -Policy     $Policy -PrimaryProtectionContainer $primaryprotectionContainer -RecoveryProtectionContainer $recoveryprotectionContainer
5. Wait for the policy association job to finish. To check if the job is finished, use the following PowerShell snippet:

       $job = Get-AzureRmSiteRecoveryJob -Job $associationJob

       if($job -eq $null -or $job.StateDescription -ne "Completed")
       {
         $isJobLeftForProcessing = $true;
       }

6. After the job finishes processing, run the following command:

       if($isJobLeftForProcessing)
       {
         Start-Sleep -Seconds 60
       }
       }While($isJobLeftForProcessing)

To check the completion of the operation, follow the steps in [Monitor activity](#monitor-activity).

##  Configure network mapping
1. Use this command to retrieve servers for the current vault. The command stores the Site Recovery servers in the $Servers array variable.

        $Servers = Get-AzureRmSiteRecoveryServer
2. Run this command to retrieve the networks for the source Virtual Machine Manager server and the target Virtual Machine Manager server.

        $PrimaryNetworks = Get-AzureRmSiteRecoveryNetwork -Server $Servers[0]        

        $RecoveryNetworks = Get-AzureRmSiteRecoveryNetwork -Server $Servers[1]

    > [!NOTE]
    > The source Virtual Machine Manager server can be the first or second one in the server array. Check Virtual Machine Manager server names, and retrieve the networks appropriately.


3. This cmdlet creates a mapping between the primary network and the recovery network. It specifies the primary network as the first element of $PrimaryNetworks. It specifies the recovery network as the first element of $RecoveryNetworks.

        New-AzureRmSiteRecoveryNetworkMapping -PrimaryNetwork $PrimaryNetworks[0] -RecoveryNetwork $RecoveryNetworks[0]


## Enable protection for VMs
After the servers, clouds, and networks are configured correctly, enable protection for VMs in the cloud.

1. To enable protection, run the following command to retrieve the protection container:

          $PrimaryProtectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $PrimaryCloudName
2. Get the protection entity (VM), as follows:

           $protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -friendlyName $VMName -ProtectionContainer $PrimaryProtectionContainer
3. Enable replication for the VM.

          $jobResult = Set-AzureRmSiteRecoveryProtectionEntity -ProtectionEntity $protectionentity -Protection Enable -Policy $policy

## Run a test failover

To test your deployment, run a test failover for a single virtual machine. You also can create a recovery plan that contains multiple VMs and run a test failover for the plan. Test failover simulates your failover and recovery mechanism in an isolated network.

1. Retrieve the VM into which VMs will fail over.

       $Servers = Get-AzureRmSiteRecoveryServer
       $RecoveryNetworks = Get-AzureRmSiteRecoveryNetwork -Server $Servers[1]

2. Perform a test failover.

   For a single VM:

        $protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -FriendlyName $VMName -ProtectionContainer $PrimaryprotectionContainer

        $jobIDResult =  Start-AzureRmSiteRecoveryTestFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity -VMNetwork $RecoveryNetworks[1]
    
   For a recovery plan:

        $recoveryplanname = "test-recovery-plan"

        $recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

        $jobIDResult =  Start-AzureRmSiteRecoveryTestFailoverJob -Direction PrimaryToRecovery -Recoveryplan $recoveryplan -VMNetwork $RecoveryNetworks[1]

To check the completion of the operation, follow the steps in [Monitor activity](#monitor-activity).

## Run planned and unplanned failovers

1. Perform a planned failover.

   For a single VM:

        $protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

        $jobIDResult =  Start-AzureRmSiteRecoveryPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity

   For a recovery plan:

        $recoveryplanname = "test-recovery-plan"

        $recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

        $jobIDResult =  Start-AzureRmSiteRecoveryPlannedFailoverJob -Direction PrimaryToRecovery -Recoveryplan $recoveryplan

2. Perform an unplanned failover.

   For a single VM:
        
        $protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

        $jobIDResult =  Start-AzureRmSiteRecoveryUnPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity

   For a recovery plan:

        $recoveryplanname = "test-recovery-plan"

        $recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

        $jobIDResult =  Start-AzureRmSiteRecoveryUnPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity

## Monitor activity
Use the following commands to monitor failover activity. Wait for the processing to finish in between jobs.

    Do
    {
        $job = Get-AzureSiteRecoveryJob -Id $associationJob.JobId;
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



## Next steps

[Learn more](/powershell/module/azurerm.recoveryservices.backup/#recovery) about Site Recovery with Resource Manager PowerShell cmdlets.
