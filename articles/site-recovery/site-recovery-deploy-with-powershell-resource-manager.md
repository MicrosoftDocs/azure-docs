<properties
	pageTitle="Protect servers to Azure using Azure PowerShell with Azure Resource Manager | Microsoft Azure"
	description="Automate protection of servers to Azure with Azure Site Recovery using PowerShell and Azure Resource Manager."
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
	ms.date="03/16/2016"
	ms.author="bsiva"/>

# Replicate between on-premises Hyper-V virtual machines and Azure using PowerShell and Azure Resource Manager.

> [AZURE.SELECTOR]
- [Azure Classic Portal](site-recovery-hyper-v-site-to-azure.md)
- [PowerShell - Resource Manager](site-recovery-deploy-with-powershell-resource-manager.md)



## Overview

Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines in a number of deployment scenarios. For a full list of deployment scenarios see the [Azure Site Recovery overview](site-recovery-overview.md).

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell. It can work with two types of modules - the Azure Profile module, or the Azure Resource Manager (ARM) module.

Azure Site Recovery(ASR) PowerShell cmdlets available with Azure PowerShell for ARM lets you protect, and recover your servers in Azure.

This article describes how to use Windows PowerShell® together with ARM to deploy Azure Site Recovery to configure and orchestrate server protection to Azure with the help of an example. The example used in this article shows you how to protect, failover and recover virtual machines on a Hyper-V host to Azure using Azure PowerShell with ARM.

> [AZURE.NOTE] The Azure Site Recovery PowerShell cmdlets currently allow you to configure the VMM site to VMM site, VMM site to Azure and Hyper-V site to Azure scenarios. Support for other ASR scenarios will be added soon. 

You don't need to be a PowerShell expert to use this article, but it does assume that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/library/hh857337.aspx).
- Read more about [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).


## Key features

- Protect your servers to Azure, perform failover and recover them to Azure IaaS(ARM) or Azure IaaS(classic)
- Microsoft partners that are part of the Cloud Solution Provider(CSP) program can configure and manage protection of their customer's servers to the customer's CSP subscription(tenant subscription)

## Before you start

Make sure you have these prerequisites in place:

- You'll need a [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](pricing/free-trial/). In addition, you can read about [Azure Site Recovery Manager pricing](https://azure.microsoft.com/pricing/details/site-recovery/).
- You'll need Azure PowerShell 1.0. For information about this release and how to install it, see [Azure PowerShell 1.0.](https://azure.microsoft.com/)
- You'll need to have the [AzureRM.SiteRecovery](https://www.powershellgallery.com/packages/AzureRM.SiteRecovery/) and [AzureRM.RecoveryServices](https://www.powershellgallery.com/packages/AzureRM.RecoveryServices/) modules installed. You can get the latest versions of these modules from the [PowerShell gallery](https://www.powershellgallery.com/)

This article illustrates how to use Azure Powershell with ARM to configure and manage protection of your servers with the help of an example. The example used in this articles shows you how to protect a virtual machine running on a Hyper-V host to Azure and the prerequisites that follow are specific to this example. For a more comprehensive set of requirements for the various ASR scenarios refer to the documentation pertaining to that scenario.

- You'll need a Hyper-V host running Windows Server 2012 R2 containing one or more virtual machines.
- Hyper-V servers should be connected to the Internet, either directly or via a proxy.
- Virtual machines you want to protect should conform with [Virtual Machine prerequisites](site-recovery-best-practices.md#virtual-machines).
	

## Step 1: Login to your Azure account


1. Open a PowerShell console and run this command to login to your Azure account. The cmdlet brings up a web page that will prompt you for your account credentials.

    	Login-AzureRmAccount

	Alternately, you could also include your account credentials as a parameter to the `Login-AzureRmAccount` cmdlet using the `-Credential` parameter.
	
	If you are CSP partner working on behalf of a tenant you'll need to specify the customer as a tenant using their tenantID or tenant primary domain name

		Login-AzureRmAccount -Tenant "fabrikam.com"

2. An account can have several subscriptions so you'll need to associate the subscription you want to use with the account.

    	Select-AzureRmSubscription -SubscriptionName $SubscriptionName

3.  Verify that your subscription is registered to use the Azure Providers for Recovery Services and Site Recovery using the following commands:-

	- `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.RecoveryServices`
	-  `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.SiteRecovery`

	If the RegistrationState is set to Registered in the output of the above two commands you can proceed to Step 2. If not you'll need to register the missing provider in your subscription.


	To register the Azure provider for Site Recovery do the following:

    	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.SiteRecovery
	
	Similarly, if you are using the Recovery Services cmdlets for the first time in your subscription, you'll need to register the Azure provider for Recovery Services. Before you can do this you'll need to first enable access to the Recovery Services provider on your subscription by executing the following command:

		Register-AzureRmProviderFeature -FeatureName betaAccess -ProviderNamespace Microsoft.RecoveryServices

	>[AZURE.TIP] It may take upto an hour to enable access to the Recovery Services provider on your subscription after successful completion of the above command. Attempts to register the Recovery Services provider in your subscription using the `Register-AzureRmResourceProvider -ProviderNamespace Microsoft.RecoveryServices` command might fail in the interim. If this happens, wait for an hour and retry.

	Once you've enabled access to the Recovery Services provider on your subscription, register the provider in your subscription by executing the following command

		Register-AzureRmResourceProvider -ProviderNamespace Microsoft.RecoveryServices

	Verify that the providers registered successfully using the `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.RecoveryServices` and `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.SiteRecovery` commands 

	

## Step 2: Set up the Recovery Services vault

1. Create an ARM resource group in which you'll create the vault or use an existing resource group. You can create a new ARM resource group by using the following command:

		New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Geo  

	where the $ResourceGroupName variable contains the name of the ARM resource group you want to create and the $Geo variable contains the Azure region in which to create the resource group (for eg: Brazil South)

	You can obtain a list of ARM resource groups in your subscription using the `Get-AzureRmResourceGroup` cmdlet.

2. Create a new Azure Recovery Services vault as follows:-
 
		$vault = New-AzureRmRecoveryServicesVault -Name <string> -ResourceGroupName <string> -Location <string>

	You can retrieve a list of existing vaults using the `Get-AzureRmRecoveryServicesVault` cmdlet.

> [AZURE.NOTE] If you wish to perform operations on ASR vaults created using the classic portal or the Azure Service Management PowerShell module, you can retrieve a list of such vaults using the `Get-AzureRmSiteRecoveryVault` cmdlet. It is recommended that for all new operations you create a new Recovery Services vault. The Site Recovery vaults you've created earlier will continue to be supported but will not have the latest features.

## Step 3: Set the Recovery Services Vault context

1.  Set the vault context by running the below command.

		Set-AzureRmSiteRecoveryVaultSettings -ARSVault $vault

## Step 4: Create a Hyper-V Site and generate a new vault registration key for the site.

1. Create a new Hyper-V site as follows:
		
		$sitename = "MySite"                #Specify site friendly name
		New-AzureRmSiteRecoverySite -Name $sitename

	This cmdlet starts an ASR Job to create the site and returns an ASR Job object. Wait for the Job to complete and verify that the job completed successfully.

	You can retrieve the ASR Job object and thereby check the current status of the job status using the Get-AzureRmSiteRecoveryJob cmdlet 
2. Generate and download a registration key for the site :-

		$SiteIdentifier = Get-AzureRmSiteRecoverySite -Name $sitename | Select -ExpandProperty SiteIdentifier
		Get-AzureRmRecoveryServicesVaultSettingsFile -Vault $vault -SiteIdentifier $SiteIdentifier -SiteFriendlyName $sitename -Path $Path
	
	Copy the downloaded key to the Hyper-V host. You'll need the key to register the Hyper-V host to the site 

	
## Step 5: Install the Azure Site Recovery Provider and Azure Recovery Services Agent on your Hyper-V host

1. Download the installer for the latest version of the Provider from [here](https://aka.ms/downloaddra)

2. Run the installer on your Hyper-V host and at the end of the installation continue to the Register step

3. Provide the downloaded site registration key when prompted and complete registration of the Hyper-V host to the site

4. Verify that the Hyper-V host got registered to the site using the following:

		$server =  Get-AzureRmSiteRecoveryServer -FriendlyName $server-friendlyname 

## Step 6: Create a Replication Policy and associate it with the Protection Container

1. Create a Replication Policy:-

		$ReplicationFrequencyInSeconds = "300";    	#options are 30,300,900
		$PolicyName = “replicapolicy”
		$Recoverypoints = 6            		#specify the number of recovery points
		$storageaccountID = Get-AzureRmStorageAccount -Name "mystorea" -ResourceGroupName "MyRG" | Select -ExpandProperty Id 

		$PolicyResult = New-AzureRmSiteRecoveryPolicy -Name $PolicyName -ReplicationProvider “HyperVReplicaAzure” -ReplicationFrequencyInSeconds $ReplicationFrequencyInSeconds  -RecoveryPoints $Recoverypoints -ApplicationConsistentSnapshotFrequencyInHours 1 -RecoveryAzureStorageAccountId $storageaccountID

	Check the returned job to ensure that replication policy creation succeeds.

	>[AZURE.IMPORTANT] The Storage Account specified should be in the same Azure region as your recovery services vault and should have Geo-replication enabled.
	>
	> - If the specified Recovery storage account is of type Azure Storage(Classic), failover of the protected machines will recover the machine to Azure IaaS (Classic)
	> - If the specified Recovery storage account is of type Azure Storage(ARM), failover of the protected machines will recover the machine to Azure IaaS (ARM)
	
 
2. Get the protection container corresponding to the site:-
		
		$protectionContainer = Get-AzureRmSiteRecoveryProtectionContainer
3.	Start the association of the protection container with the replication policy:

		$Policy = Get-AzureRmSiteRecoveryPolicy -FriendlyName $PolicyName
		$associationJob  = Start-AzureRmSiteRecoveryPolicyAssociationJob -Policy $Policy -PrimaryProtectionContainer $protectionContainer

	Wait for the association job to complete and ensure that it completed successfully

##Step 7: Enable protection for virtual machines

1. Get the Protection Entity corresponding to the VM you want to protect:-
		
		$VMFriendlyName = "Fabrikam-app"                    #Name of the VM 
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName

2. Start protecting the virtual machine:
		
		$Ostype = "Windows"                                 # "Windows" or "Linux"
		$DRjob = Set-AzureRmSiteRecoveryProtectionEntity -ProtectionEntity $protectionEntity -Policy $Policy -Protection Enable -RecoveryAzureStorageAccountId $storageaccountID  -OS $OStype -OSDiskName $protectionEntity.Disks[0].Name

	>[AZURE.IMPORTANT] The Storage Account specified should be in the same Azure region as your recovery services vault and should have Geo-replication enabled.
	>
	> - If the specified Recovery storage account is of type Azure Storage(Classic), failover of the protected machines will recover the machine to Azure IaaS (Classic)
	> - If the specified Recovery storage account is of type Azure Storage(ARM), failover of the protected machines will recover the machine to Azure IaaS (ARM)

	> If the VM you are protecting has more than one disk attached to it you'll need to specify the Operating System disk using the OSDiskName parameter.

3. Wait for the virtual machines to reach a protected state post initial replication. This will take a while depending on factors such as amount of data to be replicated and the available upstream bandwidth to Azure.The job State and StateDescription will be updated as follows upon the VM reaching a protected state.

		
		PS C:\> $DRjob = Get-AzureRmSiteRecoveryJob -Job $DRjob

		PS C:\> $DRjob | Select-Object -ExpandProperty State
		Succeeded

		PS C:\> $DRjob | Select-Object -ExpandProperty StateDescription
		Completed

4. Update recovery properties such as the the VM Role size and Azure network to attach the VM's NIC's to upon failover.

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

1. Run a test failover job:
		
		$nw = Get-AzureRmVirtualNetwork -Name "TestFailoverNw" -ResourceGroupName "MyRG" #Specify Azure vnet name and resource group
		
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -FriendlyName $VMFriendlyName -ProtectionContainer $protectionContainer

		$TFjob = Start-AzureRmSiteRecoveryTestFailoverJob -ProtectionEntity $protectionEntity -Direction PrimaryToRecovery -AzureVMNetworkId $nw.Id

2. Verify that the Test VM is created in Azure (The Test Failover job is suspended, after creating the test VM in Azure. The job will complete by cleaning up the created artefacts upon resuming the job as illustrated in the next step)

3. Complete the Test Failover

    	$TFjob = Resume-AzureRmSiteRecoveryJob -Job $TFjob
