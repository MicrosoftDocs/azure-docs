<properties
	pageTitle="Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site using PowerShell (Resource Manager) | Microsoft Azure"
	description="Describes how to deploy Azure Site Recovery to orchestrate replication, failover and recovery of Hyper-V VMs in VMM clouds to a secondary VMM site using PowerShell (Resource Manager)"
	services="site-recovery"
	documentationCenter=""
	authors="sujaytalasila"
	manager="rochakm"
	editor="raynew"/>

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
- [Classic Portal](site-recovery-vmm-to-vmm-classic.md)
- [PowerShell ARM](site-recovery-vmm-to-vmm-powershell-resource-manager.md)

Welcome to Azure Site Recovery! Use this article if you want to replicate on-premises Hyper-V  virtual machines managed in System Center Virtual Machine Manager (VMM) clouds to a secondary site. 

This article shows you how to use PowerShell to automate common tasks you need to perform when you set up Azure Site Recovery to replicate Hyper-V virtual machines in System Center VMM clouds to System Center VMM clouds in secondary site.

The article includes prerequisites for the scenario, and shows you 

- How to set up a Recovery Services Vault
- Install the Azure Site Recovery Provider on the source VMM server and the target VMM server
- Register the VMM server(s) in the vault
- Configure replication policy for the VMM Cloud. The replication settings in the policy will be applied to all protected virtual machines 
- Enable protection for the virtual machines. 
- Test the failover of VMs and recovery plans to make sure everything's working as expected.
- Perform a planned or an unplanned failover of VMs and recovery plans to make sure everything's working as expected.

If you run into problems setting up this scenario, post your questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

> [AZURE.NOTE] Azure has two different [deployment models](../resource-manager-deployment-model.md) for creating and working with resources: Azure Resource Manager (ARM) and classic. Azure also has two portals – the Azure classic portal that supports the classic deployment model, and the Azure portal with support for both deployment models. 



## On-premises prerequisites

Here's what you'll need in the primary and secondary on-premises sites to deploy this scenario:

**Prerequisites** | **Details** 
--- | ---
**VMM** | We recommend you deploy a VMM server in the primary site and a VMM server in the secondary site.<br/><br/> You can also [replicate between clouds on a single VMM server](site-recovery-single-vmm.md). To do this you'll need at least two clouds configured on the VMM server.<br/><br/> VMM servers should be running at least System Center 2012 SP1 with the latest updates.<br/><br/> Each VMM server must have at one or more clouds configured and all clouds must have the Hyper-V Capacity profile set. <br/><br/>Clouds must contain one or more VMM host groups.<br/><br/>Learn more about setting up VMM clouds in [Configuring the VMM cloud fabric](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric), and [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://blogs.technet.com/b/keithmayer/archive/2013/04/18/walkthrough-creating-private-clouds-with-system-center-2012-sp1-virtual-machine-manager-build-your-private-cloud-in-a-month.aspx).<br/><br/> VMM servers should have internet access. 
**Hyper-V** | Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/>  Hyper-V host servers should be located in host groups in the primary and secondary VMM clouds.<br/><br/> If you're running Hyper-V in a cluster on Windows Server 2012 R2 you should install [update 2961977](https://support.microsoft.com/kb/2961977)<br/><br/> If you're running Hyper-V in a cluster on Windows Server 2012 note that cluster broker isn't created automatically if you have a static IP address-based cluster. You'll need to configure the cluster broker manually. [Read more](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx).
**Provider** | During Site Recovery deployment you install the Azure Site Recovery Provider on VMM servers. The Provider communicates with Site Recovery over HTTPS 443 to orchestrate replication. Data replication occurs between the primary and secondary Hyper-V servers over the LAN or a VPN connection.<br/><br/> The Provider running on the VMM server needs access to these URLs: *.hypervrecoverymanager.windowsazure.com; *.accesscontrol.windows.net; *.backup.windowsazure.com; *.blob.core.windows.net; *.store.core.windows.net.<br/><br/> In addition allow firewall communication from the VMM servers to the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and allow the HTTPS (443) protocol.

### Network mapping prerequisites
Network mapping maps between VMM VM networks on the primary and secondary VMM servers to:

- Optimally place replica VMs on secondary Hyper-V hosts after failover.
- Connect replica VMs to appropriate VM networks.
- If you don't configure network mapping replica VMs won't be connected to any network after failover.
- If you want to set up network mapping during Site Recovery deployment here's what you'll need:

	- Make sure that VMs on the source Hyper-V host server are connected to a VMM VM network. That network should be linked to a logical network that is associated with the cloud.
	- Verify that the secondary cloud that you'll use for recovery has a corresponding VM network configured. That VM network should be linked to a logical network that's associated with the secondary cloud.


Learn more about configuring VMM networks in the below articles

- [How to configure logical networks in VMM](http://go.microsoft.com/fwlink/p/?LinkId=386307)
- [How to configure VM networks and gateways in VMM](http://go.microsoft.com/fwlink/p/?LinkId=386308)

[Learn more](site-recovery-network-mapping.md) about how network mapping works.

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
		$AuthPort = "8083"  #specify the port number that will be used for replication traffic on Hyper-V hosts
		$InitialRepMethod = "Online" #options are "Online" or "Offline"

		$policyresult = New-AzureRmSiteRecoveryPolicy -Name $policyname -ReplicationProvider $RepProvider -ReplicationFrequencyInSeconds $Replicationfrequencyinseconds -RecoveryPoints $recoverypoints -ApplicationConsistentSnapshotFrequencyInHours $AppConsistentSnapshotFrequency -Authentication $AuthMode -ReplicationPort $AuthPort -ReplicationMethod $InitialRepMethod 

	> [AZURE.NOTE] The VMM cloud can contain Hyper-V hosts running different (supported)versions of Windows Server, but a replication policy is applied to hosts running the same operating system version. If you have hosts running more than one operating system version (2012 R2 and 2012) then create another replication policy for Hyper-V 2012 R2 hosts.

2.	Get the primary protection container (primary VMM Cloud) and recovery protection container (recovery VMM Cloud) by running the following commands:
	
		$PrimaryCloud = "testprimarycloud"
		$primaryprotectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $PrimaryCloud;  

		$RecoveryCloud = "testrecoverycloud"
		$recoveryprotectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $RecoveryCloud;  
  
3.	Retrieve the policy you created in step 1 using the friendly name of the policy

		$policy = Get-AzureRmSiteRecoveryPolicy -FriendlyName $policyname

4.	Start the association of the protection container (VMM Cloud) with the replication policy:

		$associationJob  = Start-AzureRmSiteRecoveryPolicyAssociationJob -Policy     $Policy -PrimaryProtectionContainer $primaryprotectionContainer -RecoveryProtectionContainer $recoveryprotectionContainer

5.	Wait for the policy association job to complete. You can check if the job has completed using the following PowerShell snippet.
   
		$job = Get-AzureRmSiteRecoveryJob -Job $associationJob
   		if($job -eq $null -or $job.StateDescription -ne "Completed")
   		 {
        	$isJobLeftForProcessing = $true;
    	}

 	After the job has finished processing, run the following command:

		if($isJobLeftForProcessing)
    	{
    	Start-Sleep -Seconds 60
    	}
        }While($isJobLeftForProcessing)


To check the completion of the operation, follow the steps in [Monitor Activity](#monitor).

## Step 5: Configure network mapping

1. The first command gets servers for the current Azure Site Recovery vault. The command stores the Microsoft Azure Site Recovery servers in the $Servers array variable.

		$Servers = Get-AzureRmSiteRecoveryServer

2. The below commands get the site recovery network for the source VMM server and the target VMM server.

    	$PrimaryNetworks = Get-AzureRmSiteRecoveryNetwork -Server $Servers[0]

		$RecoveryNetworks = Get-AzureRmSiteRecoveryNetwork -Server $Servers[1]

	
	> [AZURE.NOTE] The source VMM server can be the first one or the second one in the servers array. Check the names of the VMM servers and get the networks appropriately


4. The final cmdlet creates a mapping between the primary network and the recovery network. The cmdlet specifies the primary network as the first element of $PrimaryNetworks and the recovery network as the first element of $RecoveryNetworks.

		New-AzureRmSiteRecoveryNetworkMapping -PrimaryNetwork $PrimaryNetworks[0] -RecoveryNetwork $RecoveryNetworks[0]

## Step 6: Enable protection for virtual machines

After the servers, clouds and networks are configured correctly, you can enable protection for virtual machines in the cloud. 


  1. To enable protection, run the following command to get the protection container:
	
			$PrimaryProtectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $PrimaryCloudName
	
  2. Get the protection entity (VM) by running the following command:
	
	 		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -friendlyName $VMName -ProtectionContainer $PrimaryProtectionContainer
		
  3. Enable replication for the VM by running the following command:

			$jobResult = Set-AzureRmSiteRecoveryProtectionEntity -ProtectionEntity $protectionentity -Protection Enable -Policy $policy


## Test your deployment

To test your deployment you can run a test failover for a single virtual machine, or create a recovery plan consisting of multiple virtual machines and run a test failover for the plan. Test failover simulates your failover and recovery mechanism in an isolated network. 

> [AZURE.NOTE] You can create a recovery plan for your application in Azure portal.

To check the completion of the operation, follow the steps in [Monitor Activity](#monitor).


### Run a test failover

1.	Run the below cmdlets to get the VM network to which you want to test failover your VMs to.

		$Servers = Get-AzureRmSiteRecoveryServer
		$RecoveryNetworks = Get-AzureRmSiteRecoveryNetwork -Server $Servers[1]

2.	Perform a test failover of a VM by doing the following:
	
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -FriendlyName $VMName -ProtectionContainer $PrimaryprotectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryTestFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity -VMNetwork $RecoveryNetworks[1] 

2.	Perform a test failover of a recovery plan by doing the following:
	
		$recoveryplanname = "test-recovery-plan"

		$recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

		$jobIDResult =  Start-AzureRmSiteRecoveryTestFailoverJob -Direction PrimaryToRecovery -Recoveryplan $recoveryplan -VMNetwork $RecoveryNetworks[1] 

### Run a planned failover

1. Perform a planned failover of a VM by doing the following:
	
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity

2. Perform a planned failover of a recovery plan by doing the following:
	
		$recoveryplanname = "test-recovery-plan"

		$recoveryplan = Get-AzureRmSiteRecoveryRecoveryPlan -FriendlyName $recoveryplanname

		$jobIDResult =  Start-AzureRmSiteRecoveryPlannedFailoverJob -Direction PrimaryToRecovery -Recoveryplan $recoveryplan

### Run an unplanned failover

1. Perform a unplanned failover of a VM by doing the following:
		
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $PrimaryprotectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryUnPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity 

2.Perform a unplanned failover of a recovery plan by doing the following:
		
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

