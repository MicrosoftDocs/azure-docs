<properties
	pageTitle="Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site using PowerShell (Resource Manager) | Microsoft Azure"
	description="Describes how to deploy Azure Site Recovery to orchestrate replication, failover and recovery of Hyper-V VMs in VMM clouds to a secondary VMM site using PowerShell (Resource Manager)"
	services="site-recovery"
	documentationCenter=""
	authors="sutalasi"
	manager="rochakm"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.workload="backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="sutalasi"/>

# Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site using PowerShell (Resource Manager)

> [AZURE.SELECTOR]
- [Azure Portal](site-recovery-vmm-to-vmm.md)
- [PowerShell ARM](site-recovery-vmm-to-vmm-powershell-resource-manager.md)
- [Classic Portal](site-recovery-vmm-to-vmm-classic.md)

Welcome to Azure Site Recovery! Use this article if you want to replicate on-premises Hyper-V  virtual machines managed in System Center Virtual Machine Manager (VMM) clouds to a secondary site. 

This article shows you how to use PowerShell to automate common tasks you need to perform when you set up Azure Site Recovery to replicate Hyper-V virtual machines in System Center VMM clouds to Azure storage.

The article includes prerequisites for the scenario, and shows you 

- How to set up a Recovery Services Vault
- Install the Azure Site Recovery Provider on the source VMM server and the target VMM server
- Register the server in the vault
- Configure replicaiton policy for the VMM Cloud. The replication settings in the policy will be applied to all protected virtual machines 
- Enable protection for the virtual machines. 
- Test the fail-over of VMs and recovery plans to make sure everything's working as expected.
- Perform a planned or an unplanned fail-over of VMs and recovery plans to make sure everything's working as expected.

If you run into problems setting up this scenario, post your questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

> [AZURE.NOTE] Azure has two different [deployment models](../resource-manager-deployment-model.md) for creating and working with resources: Azure Resource Manager (ARM) and classic. Azure also has two portals – the Azure classic portal that supports the classic deployment model, and the Azure portal with support for both deployment models. 



## On-premises prerequisites

Here's what you'll need in the primary and secondary on-premises sites to deploy this scenario:

**Prerequisites** | **Details** 
--- | ---
**VMM** | We recommend you deploy a VMM server in the primary site and a VMM server in the secondary site.<br/><br/> You can also [replicate between clouds on a single VMM server](site-recovery-single-vmm.md). To do this you'll need at least two clouds configured on the VMM server.<br/><br/> VMM servers should be running at least System Center 2012 SP1 with the latest updates.<br/><br/> Each VMM server must have at one or more clouds configured and all clouds must have the Hyper-V Capacity profile set. <br/><br/>Clouds must contain one or more VMM host groups.<br/><br/>Learn more about setting up VMM clouds in [Configuring the VMM cloud fabric](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric), and [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://blogs.technet.com/b/keithmayer/archive/2013/04/18/walkthrough-creating-private-clouds-with-system-center-2012-sp1-virtual-machine-manager-build-your-private-cloud-in-a-month.aspx).<br/><br/> VMM servers need internet access. 
**Hyper-V** | Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/>  Hyper-V host servers should be located in host groups in the primary and secondary VMM clouds.<br/><br/> If you're running Hyper-V in a cluster on Windows Server 2012 R2 you should install [update 2961977](https://support.microsoft.com/kb/2961977)<br/><br/> If you're running Hyper-V in a cluster on Windows Server 2012 note that cluster broker isn't created automatically if you have a static IP address-based cluster. You'll need to configure the cluster broker manually. [Read more](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx).
**Provider** | During Site Recovery deployment you install the Azure Site Recovery Provider on VMM servers. The Provider communicates with Site Recovery over HTTPS 443 to orchestrate replication. Data replication occurs between the primary and secondary Hyper-V servers over the LAN or a VPN connection.<br/><br/> The Provider running on the VMM server needs access to these URLs: *.hypervrecoverymanager.windowsazure.com; *.accesscontrol.windows.net; *.backup.windowsazure.com; *.blob.core.windows.net; *.store.core.windows.net.<br/><br/> In addition allow firewall communication from the VMM servers to the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and allow the HTTPS (443) protocol.

###PowerShell prerequisites
Make sure you have Azure PowerShell ready to go. If you are already using PowerShell, you'll need to upgrade to version 0.8.10 or later. For information about setting up PowerShell, see the [Guide to install and configure Azure PowerShell](../powershell-install-configure.md). Once you have set up and configured PowerShell, you can view all of the available cmdlets for the service [here](https://msdn.microsoft.com/library/dn850420.aspx). 

To learn about tips that can help you use the cmdlets, such as how parameter values, inputs, and outputs are typically handled in Azure PowerShell, see the [Guide to get Started with Azure Cmdlets](https://msdn.microsoft.com/library/azure/jj554332.aspx).

## Step 1: Set the subscription 

1. From Azure powershell, login to your Azure account: using the following cmdlets
 
		$UserName = "<user@live.com>"
		$Password = "<password>"
		$SecurePassword = ConvertTo-SecureString -AsPlainText $Password -Force
		$Cred = New-Object System.Management.Automation.PSCredential -ArgumentList $UserName, $SecurePassword
		Login-AzureRmAccount #-Credential $Cred 
	

2. Get a list of your subscriptions. This will also list the subscriptionIDs for each of the subscriptions. Note down the subscriptionID of the subscription in which you wish to create the recovery services vault	

		Get-AzureRmSubscription 

3. Set the subscription in which the recovery services vault is to be created by mentioning the subscription ID

		Set-AzureRmContext –SubscriptionID <subscriptionId>


## Step 2: Create a Recovery Services vault 

1. Create an ARM resource group if you don't have one already

		New-AzureRmResourceGroup -Name #ResourceGroupName -Location #location

2. Create a new Recovery Services vault and save the created ASR vault object in a variable (will be used later). You can also retrieve the ASR vault object post creation using the Get-AzureRMRecoveryServicesVault cmdlet:-

		$vault = New-AzureRmRecoveryServicesVault -Name #vaultname -ResouceGroupName #ResourceGroupName -Location #location 

## Step 3: Set the Recovery Services Vault context

1.  If you have a vault already created, run the below command to get the vault.

		$vault = Get-AzureRmRecoveryServicesVault -Name #vaultname

2.  Set the vault context by running the below command.

		Set-AzureRmSiteRecoveryVaultSettings -ARSVault $vault



## Step 4: Install the Azure Site Recovery Provider

1.	On the VMM machine, create a directory by running the following command:
	
		New-Item c:\ASR -type directory
		
2.	Extract the files using the downloaded provider by running the following command
	
		pushd C:\ASR\
		.\AzureSiteRecoveryProvider.exe /x:. /q

	
3.	Install the provider using the following commands:
	
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

    Wait for the installation to finish.
	
4.	Register the server in the vault using the following command:
	
		$BinPath = $env:SystemDrive+"\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin"
		pushd $BinPath
		$encryptionFilePath = "C:\temp\".\DRConfigurator.exe /r /Credentials $VaultSettingFilePath /vmmfriendlyname $env:COMPUTERNAME /dataencryptionenabled $encryptionFilePath /startvmmservice


## Step 5: Create and associate a replication policy

1.	Create a Hyper-V 2012 R2 replication policy by running the following command:

	
		$ReplicationFrequencyInSeconds = "300";    	#options are 30,300,900
		$PolicyName = “replicapolicy”
		$RepProvider = HyperVReplica2012R2
		$Recoverypoints = 24            		#specify the number of hours to retain recovery pints
		$AppConsistentSnapshotFrequency = 4 #specify the frequency (in hours) at which app consistent snapshots are taken
		$AuthMode = "Kerberos"  #options are "Kerberos" or "Certificate"
		$AuthPort = "8083"  #specify the port number that will be used for replciation traffic on Hyper-V hosts
		$InitialRepMethod = "Online" #options are "Online" or "Offline"

		$policryresult = New-AzureRmSiteRecoveryPolicy -Name $policyname -ReplicationProvider $RepProvider -ReplicationFrequencyInSeconds $Replicationfrequencyinseconds -RecoveryPoints $recoverypoints -ApplicationConsistentSnapshotFrequencyInHours $AppConsistentSnapshotFrequency -Authentication $AuthMode -ReplicationPort $AuthPort -ReplicationMethod $InitialRepMethod 

	> [AZURE.NOTE] The VMM cloud can contain Hyper-V hosts running different (supported)versions of Windows Server, but a replication policy is applied hosts running the same operating system. If you have hosts running more than one operating system version (2012 R2 and 2012) then create separate replication policies.

2.	Get the primary protection container (primary VMM Cloud) and recovery protection container (recovery VMM Cloud) by running the following commands:
	
		$PrimaryCloud = "testprimarycloud"
		$primaryprotectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $PrimaryCloud;  

		$RecoveryCloud = "testrecoverycloud"
		$recoveryprotectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $RecoveryCloud;  
  
3.	Get the policy details to a variable using the job that was created and mentioning the friendly policy name:

		$policy = Get-AzureRmSiteRecoveryPolicy -FriendlyName $policyname

4.	Start the association of the protection container (VMM Cloud) with the replication policy:

		$associationJob  = Start-AzureRmSiteRecoveryPolicyAssociationJob -Policy     $Policy -PrimaryProtectionContainer $primaryprotectionContainer -RecoveryProtectionContainer $recoveryprotectionContainer

5.	After the job has finished, run the following command:
   
		$job = Get-AzureRmSiteRecoveryJob -Job $associationJob
   		if($job -eq $null -or $job.StateDescription -ne "Completed")
   		 {
        	$isJobLeftForProcessing = $true;
    	}

6.	After the job has finished processing, run the following command:

		if($isJobLeftForProcessing)
    	{
    	Start-Sleep -Seconds 60
    	}
        }While($isJobLeftForProcessing)

To check the completion of the operation, follow the steps in [Monitor Activity](#monitor).


## Step 6: Enable protection for virtual machines

After the servers, clouds and networks are configured correctly, you can enable protection for virtual machines in the cloud. 


  1. To enable protection, run the following command to get the protection container:
	
			$PrimaryProtectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $PrimaryCloudName
	
  2. Get the protection entity (VM) by running the following command:
	
	 		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -friendlyName $VMName -ProtectionContainer $PrimaryProtectionContainer
		
  3. Enable the DR for the VM by running the following command:

			$jobResult = Set-AzureRmSiteRecoveryProtectionEntity -ProtectionEntity $protectionentity -Protection Enable -Policy $policy


## Test your deployment

To test your deployment you can run a test fail-over for a single virtual machine, or create a recovery plan consisting of multiple virtual machines and run a test fail-over for the plan. Test fail-over simulates your fail-over and recovery mechanism in an isolated network. 

> [AZURE.NOTE] You can create a recovery plan for your application in Azure portal.

To check the completion of the operation, follow the steps in [Monitor Activity](#monitor).


### Run a test failover

1.	Start the test failover of a VM by running the following command:
	
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -FriendlyName $VMName -ProtectionContainer $PrimaryprotectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryTestFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity 

2.	Start the test failover of a recovery plan by running the following command:
	
		$recoveryplanname = "test-recovery-plan"

		$recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

		$jobIDResult =  Start-AzureRmSiteRecoveryTestFailoverJob -Direction PrimaryToRecovery -Recoveryplan $recoveryplan

### Run a planned failover

1. Start the planned failover of a VM by running the following command:
	
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity

2. Start the planned failover of a recovery plan by running the following command:
	
		$recoveryplanname = "test-recovery-plan"

		$recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

		$jobIDResult =  Start-AzureRmSiteRecoveryPlannedFailoverJob -Direction PrimaryToRecovery -Recoveryplan $recoveryplan

### Run an unplanned failover

1. Start the unplanned failover of a VM by running the following command:
		
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryUnPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity 

2. Start the unplanned failover of a recovery plan by running the following command:
		
		$recoveryplanname = "test-recovery-plan"

		$recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

		$jobIDResult =  Start-AzureRmSiteRecoveryUnPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity 
	
## <a name=monitor></a> Monitor Activity

Use the following commands to monitor the activity. Note that you have to wait in between jobs for the processing to finish.

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

[Read more](https://msdn.microsoft.com/library/azure/mt637930.aspx) about Azure Site Recovery with Azure Resource Manager PowerShell cmdlets.

