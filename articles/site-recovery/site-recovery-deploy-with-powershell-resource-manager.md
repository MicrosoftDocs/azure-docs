<properties
	pageTitle="Protect servers to Azure by using Azure PowerShell with Azure Resource Manager | Microsoft Azure"
	description="Automate protection of servers to Azure with Azure Site Recovery by using PowerShell and Azure Resource Manager."
	services="site-recovery"
	documentationCenter=""
	authors="bsiva"
	manager="abhiag"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="backup-recovery"
	ms.date="07/12/2016"
	ms.author="bsiva"/>

# Replicate between on-premises Hyper-V virtual machines and Azure by using PowerShell and Azure Resource Manager

> [AZURE.SELECTOR]
- [Azure Portal](site-recovery-hyper-v-site-to-azure.md)
- [PowerShell - Resource Manager](site-recovery-deploy-with-powershell-resource-manager.md)
- [Classic Portal](site-recovery-hyper-v-site-to-azure-classic.md)



## Overview

Azure Site Recovery contributes to your business continuity and disaster recovery strategy by orchestrating replication, failover, and recovery of virtual machines in a number of deployment scenarios. For a full list of deployment scenarios, see the [Azure Site Recovery overview](site-recovery-overview.md).

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell. It can work with two types of modules: the Azure Profile module, or the Azure Resource Manager module.

Site Recovery PowerShell cmdlets, available with Azure PowerShell for Azure Resource Manager, help you protect and recover your servers in Azure.

This article describes how to use Windows PowerShell, together with Azure Resource Manager, to deploy Site Recovery to configure and orchestrate server protection to Azure. The example used in this article shows you how to protect, fail over, and recover virtual machines on a Hyper-V host to Azure, by using Azure PowerShell with Azure Resource Manager.

> [AZURE.NOTE] The Site Recovery PowerShell cmdlets currently allow you to configure the following: one Virtual Machine Manager site to another, a Virtual Machine Manager site to Azure, and a Hyper-V site to Azure.

You don't need to be a PowerShell expert to use this article, but you do need to understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/library/hh857337.aspx).

You can also read more about [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).

> [AZURE.NOTE] Microsoft partners that are part of the Cloud Solution Provider (CSP) program can configure and manage protection of their customers' servers to their customers' respective CSP subscriptions (tenant subscriptions).

## Before you start

Make sure you have these prerequisites in place:

- A [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). In addition, you can read about [Azure Site Recovery Manager pricing](https://azure.microsoft.com/pricing/details/site-recovery/).
- Azure PowerShell 1.0. For information about this release and how to install it, see [Azure PowerShell 1.0.](https://azure.microsoft.com/)
- The [AzureRM.SiteRecovery](https://www.powershellgallery.com/packages/AzureRM.SiteRecovery/) and [AzureRM.RecoveryServices](https://www.powershellgallery.com/packages/AzureRM.RecoveryServices/) modules. You can get the latest versions of these modules from the [PowerShell gallery](https://www.powershellgallery.com/)

This article illustrates how to use Azure Powershell with Azure Resource Manager to configure and manage protection of your servers. The example used in this article shows you how to protect a virtual machine, running on a Hyper-V host, to Azure. The following prerequisites are specific to this example. For a more comprehensive set of requirements for the various Site Recovery scenarios, refer to the documentation pertaining to that scenario.

- A Hyper-V host running Windows Server 2012 R2, containing one or more virtual machines.
- Hyper-V servers connected to the Internet, either directly or through a proxy.
- The virtual machines you want to protect should conform with [Virtual Machine prerequisites](site-recovery-best-practices.md#virtual-machines).


## Step 1: Sign in to your Azure account


1. Open a PowerShell console and run this command to sign in to your Azure account. The cmdlet brings up a web page that will prompt you for your account credentials.

    	Login-AzureRmAccount

	Alternately, you could also include your account credentials as a parameter to the `Login-AzureRmAccount` cmdlet, by using the `-Credential` parameter.

	If you are CSP partner working on behalf of a tenant, specify the customer as a tenant, by using their tenantID or tenant primary domain name.

		Login-AzureRmAccount -Tenant "fabrikam.com"

2. An account can have several subscriptions, so you should associate the subscription you want to use with the account.

    	Select-AzureRmSubscription -SubscriptionName $SubscriptionName

3.  Verify that your subscription is registered to use the Azure providers for Recovery Services and Site Recovery, by using the following commands:

	- `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.RecoveryServices`
	-  `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.SiteRecovery`

	In the output of these commands, if the **RegistrationState** is set to **Registered**, you can proceed to Step 2. If not, you should register the missing provider in your subscription.

	To register the Azure provider for Site Recovery and Recovery Services, run the following commands:

    	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.SiteRecovery
    	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.RecoveryServices

	Verify that the providers registered successfully by using the following commands: `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.RecoveryServices` and `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.SiteRecovery`.



## Step 2: Set up the Recovery Services vault

1. Create an Azure Resource Manager resource group in which you'll create the vault, or use an existing resource group. You can create a new resource group by using the following command:

		New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Geo  

	where the $ResourceGroupName variable contains the name of the resource group you want to create, and the $Geo variable contains the Azure region in which to create the resource group (for example, "Brazil South").

	You can obtain a list of resource groups in your subscription by using the `Get-AzureRmResourceGroup` cmdlet.

2. Create a new Azure Recovery Services vault as follows:

		$vault = New-AzureRmRecoveryServicesVault -Name <string> -ResourceGroupName <string> -Location <string>

	You can retrieve a list of existing vaults by using the `Get-AzureRmRecoveryServicesVault` cmdlet.

> [AZURE.NOTE] If you wish to perform operations on Site Recovery vaults created using the classic portal or the Azure Service Management PowerShell module, you can retrieve a list of such vaults by using the `Get-AzureRmSiteRecoveryVault` cmdlet. You should create a new Recovery Services vault for all new operations. The Site Recovery vaults you've created earlier are supported, but don't have the latest features.

## Step 3: Set the Recovery Services vault context

1.  Set the vault context by running the following command:

		Set-AzureRmSiteRecoveryVaultSettings -ARSVault $vault

## Step 4: Create a Hyper-V site and generate a new vault registration key for the site.

1. Create a new Hyper-V site as follows:

		$sitename = "MySite"                #Specify site friendly name
		New-AzureRmSiteRecoverySite -Name $sitename

	This cmdlet starts a Site Recovery job to create the site, and returns a Site Recovery job object. Wait for the job to complete and verify that the job completed successfully.

	You can retrieve the job object, and thereby check the current status of the job, by using the Get-AzureRmSiteRecoveryJob cmdlet.
2. Generate and download a registration key for the site, as follows:

		$SiteIdentifier = Get-AzureRmSiteRecoverySite -Name $sitename | Select -ExpandProperty SiteIdentifier
		Get-AzureRmRecoveryServicesVaultSettingsFile -Vault $vault -SiteIdentifier $SiteIdentifier -SiteFriendlyName $sitename -Path $Path

	Copy the downloaded key to the Hyper-V host. You need the key to register the Hyper-V host to the site.

## Step 5: Install the Azure Site Recovery provider and Azure Recovery Services Agent on your Hyper-V host

1. Download the installer for the latest version of the provider from [Microsoft](https://aka.ms/downloaddra).

2. Run the installer on your Hyper-V host, and at the end of the installation continue to the registration step.

3. When prompted, provide the downloaded site registration key, and complete registration of the Hyper-V host to the site.

4. Verify that the Hyper-V host is registered to the site by using the following command:

		$server =  Get-AzureRmSiteRecoveryServer -FriendlyName $server-friendlyname

## Step 6: Create a replication policy and associate it with the protection container

1. Create a replication policy as follows:

		$ReplicationFrequencyInSeconds = "300";    	#options are 30,300,900
		$PolicyName = “replicapolicy”
		$Recoverypoints = 6            		#specify the number of recovery points
		$storageaccountID = Get-AzureRmStorageAccount -Name "mystorea" -ResourceGroupName "MyRG" | Select -ExpandProperty Id

		$PolicyResult = New-AzureRmSiteRecoveryPolicy -Name $PolicyName -ReplicationProvider “HyperVReplicaAzure” -ReplicationFrequencyInSeconds $ReplicationFrequencyInSeconds  -RecoveryPoints $Recoverypoints -ApplicationConsistentSnapshotFrequencyInHours 1 -RecoveryAzureStorageAccountId $storageaccountID

	Check the returned job to ensure that the replication policy creation succeeds.

	>[AZURE.IMPORTANT] The storage account specified should be in the same Azure region as your Recovery Services vault, and should have geo-replication enabled.
	>
	> - If the specified Recovery storage account is of type Azure Storage (Classic), failover of the protected machines recover the machine to Azure IaaS (Classic).
	> - If the specified Recovery storage account is of type Azure Storage (Azure Resource Manager), failover of the protected machines recover the machine to Azure IaaS (Azure Resource Manager).

2. Get the protection container corresponding to the site, as follows:

		$protectionContainer = Get-AzureRmSiteRecoveryProtectionContainer
3.	Start the association of the protection container with the replication policy, as follows:

		$Policy = Get-AzureRmSiteRecoveryPolicy -FriendlyName $PolicyName
		$associationJob  = Start-AzureRmSiteRecoveryPolicyAssociationJob -Policy $Policy -PrimaryProtectionContainer $protectionContainer

	Wait for the association job to complete, and ensure that it completed successfully.

##Step 7: Enable protection for virtual machines

1. Get the protection entity corresponding to the VM you want to protect, as follows:

		$VMFriendlyName = "Fabrikam-app"                    #Name of the VM
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName

2. Start protecting the virtual machine, as follows:

		$Ostype = "Windows"                                 # "Windows" or "Linux"
		$DRjob = Set-AzureRmSiteRecoveryProtectionEntity -ProtectionEntity $protectionEntity -Policy $Policy -Protection Enable -RecoveryAzureStorageAccountId $storageaccountID  -OS $OStype -OSDiskName $protectionEntity.Disks[0].Name

	>[AZURE.IMPORTANT] The storage account specified should be in the same Azure region as your Recovery Services vault, and should have geo-replication enabled.
	>
	> - If the specified Recovery storage account is of type Azure Storage (Classic), failover of the protected machines recover the machine to Azure IaaS (Classic).
	> - If the specified Recovery storage account is of type Azure Storage (Azure Resource Manager), failover of the protected machines recover the machine to Azure IaaS (Azure Resource Manager).

	> If the VM you are protecting has more than one disk attached to it, specify the operating system disk by using the *OSDiskName* parameter.

3. Wait for the virtual machines to reach a protected state after the initial replication. This can take a while, depending on factors such as the amount of data to be replicated and the available upstream bandwidth to Azure. The job State and StateDescription are updated as follows, upon the VM reaching a protected state.

		PS C:\> $DRjob = Get-AzureRmSiteRecoveryJob -Job $DRjob

		PS C:\> $DRjob | Select-Object -ExpandProperty State
		Succeeded

		PS C:\> $DRjob | Select-Object -ExpandProperty StateDescription
		Completed

4. Update recovery properties, such as the VM role size, and the Azure network to attach the virtual machine's network interface cards to upon failover.

		PS C:\> $nw1 = Get-AzureRmVirtualNetwork -Name "FailoverNw" -ResourceGroupName "MyRG"

		PS C:\> $VMFriendlyName = "Fabrikam-App"

		PS C:\> $VM = Get-AzureRmSiteRecoveryVM -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName

		PS C:\> $UpdateJob = Set-AzureRmSiteRecoveryVM -VirtualMachine $VM -PrimaryNic $VM.NicDetailsList[0].NicId -RecoveryNetworkId $nw1.Id -RecoveryNicSubnetName $nw1.Subnets[0].Name

		PS C:\> $UpdateJob = Get-AzureRmSiteRecoveryJob -Job $UpdateJob

		PS C:\> $UpdateJob


		Name             : b8a647e0-2cb9-40d1-84c4-d0169919e2c5
		ID               : /Subscriptions/a731825f-4bf2-4f81-a611-c331b272206e/resourceGroups/MyRG/providers/Microsoft.RecoveryServices/vault
		                   s/MyVault/replicationJobs/b8a647e0-2cb9-40d1-84c4-d0169919e2c5
		Type             : Microsoft.RecoveryServices/vaults/replicationJobs
		JobType          : UpdateVmProperties
		DisplayName      : Update the virtual machine
		ClientRequestId  : 805a22a3-be86-441c-9da8-f32685673112-2015-12-10 17:55:51Z-P
		State            : Succeeded
		StateDescription : Completed
		StartTime        : 10-12-2015 17:55:53 +00:00
		EndTime          : 10-12-2015 17:55:54 +00:00
		TargetObjectId   : 289682c6-c5e6-42dc-a1d2-5f9621f78ae6
		TargetObjectType : ProtectionEntity
		TargetObjectName : Fabrikam-App
		AllowedActions   : {Restart}
		Tasks            : {UpdateVmPropertiesTask}
		Errors           : {}



## Step 8: Run a test failover

1. Run a test failover job, as follows:

		$nw = Get-AzureRmVirtualNetwork -Name "TestFailoverNw" -ResourceGroupName "MyRG" #Specify Azure vnet name and resource group

		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -FriendlyName $VMFriendlyName -ProtectionContainer $protectionContainer

		$TFjob = Start-AzureRmSiteRecoveryTestFailoverJob -ProtectionEntity $protectionEntity -Direction PrimaryToRecovery -AzureVMNetworkId $nw.Id

2. Verify that the test VM is created in Azure. (The test failover job is suspended, after creating the test VM in Azure. The job completes by cleaning up the created artefacts upon resuming the job, as illustrated in the next step.)

3. Complete the test failover, as follows:

    	$TFjob = Resume-AzureRmSiteRecoveryJob -Job $TFjob


##Next Steps

[Read more](https://msdn.microsoft.com/library/azure/mt637930.aspx) about Azure Site Recovery with Azure Resource Manager PowerShell cmdlets.

