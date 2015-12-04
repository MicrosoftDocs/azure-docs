<properties
	pageTitle="Protect VMs from one VMM site to another  with PowerShell and Microsoft Azure Resource Manager"
	description="Automate protection between two on-premises VMM site and Azure using PowerShell and Azure Resource Manager."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor="tysonn"/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="backup-recovery"
	ms.date="08/26/2015"
	ms.author="raynew"/>
	

#  VMM site to VMM site with PowerShell and Azure Resource Manager


## Overview

Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines in a number of deployment scenarios. For a full list of deployment scenarios see the [Azure Site Recovery overview](site-recovery-overview.md).

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell. It can work with two types of modules - the Azure Profile module, or the Azure Resource Manager (ARM) module. 

This article describes how to use Windows PowerShell® together with ARM to deploy Azure Site Recovery to configure and orchestrate virtual machine protection between two VMM sites. Virtual machines running on Hyper-V host servers that are located in VMM private clouds in a primary site will replicate and fail over to a secondary VMM site using Hyper-V Replica.

You don't need to be a PowerShell expert to use this article, but it does assume that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/library/hh857337.aspx).
- Read more about [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md).

The article includes prerequisites for the scenario, and shows you how to set up Azure PowerShell to work with Site Recovery, create a Site Recovery vault, install the Azure Site Recovery Provider on VMM servers and register them  vault, configure protection settings for VMM clouds that will be applied to all protected virtual machines, and then enable protection for those virtual machines. You'll finish up by testing the failover to make sure everything's working as expected.


## Before you start

Make sure you have these prerequisites in place:

- You'll need a [Microsoft Azure](http://azure.microsoft.com/) account. You'll need a [Microsoft Azure](http://azure.microsoft.com/) account. You can start with a [free trial](pricing/free-trial/). In addition, you can read about [Azure Site Recovery Manager pricing](http://azure.microsoft.com/pricing/details/site-recovery/).
- You'll need a VMM server in the primary and secondary sites running on System Center 2012 R2.
- Each VMM server should have at least one cloud that contains:
	- One or more VMM host groups.
	- One or more Hyper-V host servers or clusters in each host group .
	- One or more virtual machines on the source Hyper-V server.
	- Learn more about setting up VMM clouds:

		- [What’s New in Private Cloud with System Center 2012 R2 VMM](https://channel9.msdn.com/Events/TechEd/NorthAmerica/2013/MDC-B357#fbid=dfgvHAmYryA) and in [VMM 2012 and the clouds](http://www.server-log.com/blog/2011/8/26/vmm-2012-and-the-clouds.html).
		- [Configuring the VMM cloud fabric](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric)
		- [Creating a private cloud in VMM](https://technet.microsoft.com/library/jj860425.aspx) and [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://blogs.technet.com/b/keithmayer/archive/2013/04/18/walkthrough-creating-private-clouds-with-system-center-2012-sp1-virtual-machine-manager-build-your-private-cloud-in-a-month.aspx).
- One or more Hyper-V servers running at least Windows Server 2012 with Hyper-V role with the latest updates installed. The server or cluster must be included in a VMM cloud.
- If you're running Hyper-V in a cluster note that cluster broker isn't created automatically if you have a static IP address-based cluster. You'll need to configure the cluster broker manually. For instructions see [Configure Hyper-V Replica Broker](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx).

	- You'll needed Azure PowerShell. Make sure you're running Azure PowerShell version 0.9.6 or later. Read [How to install and configure Azure PowerShell](powershell-install-configure.md). 
	- Installing Azure PowerShell installs a customized console. You can run the PowerShell commands from this console or from any other host program, such as Windows PowerShell ISE.

## Step 1: Set up PowerShell


1. Open a PowerShell console and run this command to switch to the ARM module:

    `Switch-AzureMode AzureResourceManager`

3. Now run this command to add your Azure account to the PowerShell session. The cmdlet prompts you for login credentials for your account.

    `Add-AzureAccount` 

	Note that if you're a CSP partner working on behalf of a tenant you'll need to specify the customer as a tenant when you add the Azure account: 

    `Add-AzureAccount-Tenant "customer"`

5. An account can have several subscriptions so you'll need to associate the subscription you want to use with the account.

    `Select-AzureSubscription -SubscriptionName $SubscriptionName`

6. If you're using Site Recovery cmdlets for the first time in the subscription, you need to register the Azure provider for Site Recovery:

    `Register-AzureProvider -ProviderNamespace Microsoft.SiteRecovery`

## Step 2: Set up the Site Recovery vault

1. If you haven't currently got a Site Recovery vault you'll need to create one by running the [New-AzureSiteRecoveryVault](https://msdn.microsoft.com/library/azure/dn954225.aspx) cmdlet:

    `New-AzureSiteRecoveryVault -Location $VaultGeo -Name $VaultName;
    $vault = Get-AzureSiteRecoveryVault -Name $VaultName;`

## Step 3: Generate a vault registration key

1. Run the [Get-AzureSiteRecoveryVaultSettingsFile](https://msdn.microsoft.com/library/azure/dn850404.aspx) cmdlet to get a vault registration key. You need this key to register VMM servers in the vault:

    `$VaultSettingsFile = Get-AzureSiteRecoveryVaultSettingsFile -Location $VaultGeo -Name $VaultName -Path $OutputPathForSettingsFile;`

## Step 4: Install the Azure Site Recovery Provider

1. Download the Provider installation file from the Quick Start page in the Site Recovery vault.
2. On each VMM server create a folder using this command:

    `pushd C:\ASR\`

3. Run this command to extract the files from the downloaded Provider:

    `AzureSiteRecoveryProvider.exe /x:. /q`

4. Install the provider by running:

    `.\SetupDr.exe /i`
    `$installationRegPath = "hklm:\software\Microsoft\Microsoft System Center Virtual Machine Manager Server\DRAdapter"
	do
	{
                $isNotInstalled = $true;
                if(Test-Path $installationRegPath)
                {
                                $isNotInstalled = $false;
                }
	}While($isNotInstalled)`

5. Wait for the installation to finish and then register the server in the vault:

    `$BinPath = $env:SystemDrive+"\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin"
	pushd $BinPath
	$encryptionFilePath = "C:\temp\"
	.\DRConfigurator.exe /r /Credentials $VaultSettingFilePath /vmmfriendlyname $env:COMPUTERNAME /dataencryptionenabled $encryptionFilePath /startvmmservice`

## Step 5: Set up the vault context

1. Run the Get-AzureSiteRecoveryVault cmdlet to make sure all commands run under the specific vault:

    `$Vault = Get-AzureSiteRecoveryVault -ResouceGroupName $ResourceGroupName | where { $_.Name -eq $VaultName}`

2. Download the vault settings: 

    `$VaultSettingsFile = Get-AzureSiteRecoveryVaultSettingsFile -Vault $Vault -Path $OutputPathForSettingsFile`

3. To make sure the cmdlets run under the vault run:

    `Import-AzureSiteRecoveryVaultSettingsFile -Path $VaultSetingsFile.FilePath`

## Step 3: Configure cloud protection settings

After the VMM server is registered in the vault you can configure cloud protection settings that will be applied to all virtual machines on Hyper-V hosts located in clouds on registered VMM server.

1. Create a container in the vault for the primary and secondary clouds:

    `$PrimaryContainer = Get-AzureSiteRecoveryProtectionContainer -FriendlyName  $PrimaryCloudName`
    `$$RecoveryContainer = Get-AzureSiteRecoveryProtectionContainer -FriendlyName  $RecoveryCloudName`

2. Configure protection settings to apply to the clouds:

    `New-AzureSiteRecoveryProtectionProfile -Name $ProtectionProfileName -ReplicationProvider HyperVReplica -ReplicationMethod Online -ReplicationFrequencyInSeconds 30 -RecoveryPoints 1 -ApplicationConsistentSnapshotFrequencyInHours 0 -ReplicationPort 8083 -Authentication Kerberos -AllowReplicaDeletion`

3. Start a job to associate the cloud containers with the cloud protection settings:

    `Start-AzureSiteRecoveryProtectionProfileAssociationJob -ProtectionProfile $ProtectionProfile -PrimaryProtectionContainer $PrimaryContainer -RecoveryProtectionContainer $RecoveryContainer`


## Step 4: Enable VM protection

Enable protection for VMs in the VMM clouds:

1. Get the VM you want to protect:

    `$VM = Get-AzureSiteRecoveryProtectionEntity -ProtectionContainer $PrimaryContainer -FriendlyName $VMName `

2. Enable protection for the VM:

    `Set-AzureSiteRecoveryProtectionEntity -ProtectionEntity $VM -Protection Enable`


## Step 5: Run a test failover

1.	Select the VM you want to fail over:

    `$VM = Get-AzureSiteRecoveryProtectionEntity -ProtectionContainer $PrimaryContainer -FriendlyName  $VMName`

2. Run a test failover job:

    `$ currentJob = Start-AzureSiteRecoveryTestFailoverJob -ProtectionEntity $VM -Direction PrimaryToRecovery`

3. Check that the failed over VM appears in the secondary site and complete the failover:

    `Resume-AzureSiteRecoveryJob -Id $currentJob.Name`


## Next steps

For questions and comments on this scenario visit the [Site Recovery forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr/)
