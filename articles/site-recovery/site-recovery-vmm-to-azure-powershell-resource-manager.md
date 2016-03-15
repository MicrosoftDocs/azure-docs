<properties
	pageTitle="Replicate Hyper-V virtual machines in VMM clouds using Azure Site Recovery and PowerShell (Resource Manager) | Microsoft Azure"
	description="Replicate Hyper-V virtual machines in VMM clouds using Azure Site Recovery and PowerShell"
	services="site-recovery"
	documentationCenter=""
	authors="Rajani-Janaki-Ram"
	manager="rochakm"
	editor="raynew"/>

<tags
	ms.service="site-recovery"
	ms.workload="backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/15/2016"
	ms.author="rajanaki"/>

# Replicate Hyper-V virtual machines in VMM clouds using Azure Site Recovery and PowerShell


## Overview

Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines in a number of deployment scenarios. For a full list of deployment scenarios see the [Azure Site Recovery overview](site-recovery-overview.md).

This article shows you how to use PowerShell to automate common tasks you need to perform when you set up Azure Site Recovery to replicate Hyper-V virtual machines in System Center VMM clouds to Azure storage.

The article includes prerequisites for the scenario, and shows you how to set up a Site Recovery vault, install the Azure Site Recovery Provider on the source VMM server, register the server in the vault, add an Azure storage account, install the Azure Recovery Services agent on Hyper-V host servers, configure protection settings for VMM clouds that will be applied to all protected virtual machines, and then enable protection for those virtual machines. Finish up by testing the failover to make sure everything's working as expected.

If you run into problems setting up this scenario, post your questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Before you start

Make sure you have these prerequisites in place:

### Azure prerequisites

- You'll need a [Microsoft Azure](https://azure.microsoft.com/) account. If you don't have one, start with a [free trial](http://aka.ms/try-azure). In addition, you can read about Azure Site Recovery Manager pricing.[Azure Site Recovery Manager pricing](http://go.microsoft.com/fwlink/?LinkId=378268)
- A CSP subscription if you are trying out the replication to a CSP subscription scenario
- You'll need an Azure v2 storage (ARM) account to store data replicated to Azure. The account needs geo-replication enabled. It should be in the same region as the Azure Site Recovery service, and be associated with the same subscription or the CSP subscription. To learn more about setting up Azure storage, see [Introduction to Microsoft Azure Storage.](http://go.microsoft.com/fwlink/?LinkId=398704 "Introduction to Microsoft Azure Storag")
- You'll need to make sure that virtual machines you want to protect comply with [Azure virtual machine prerequisites](site-recovery-best-practices.md#virtual-machines).

NOTE: At present only VM level operations are possible through Powershell. Support for recovery plan level operations will be made soon.  For now, you are limited to performing failovers only at a ‘protected VM’ granularity and not at a Recovery Plan level.

### VMM prerequisites
- You'll need VMM server running on System Center 2012 R2.
- Any VMM server containing virtual machines you want to protect must be running the Azure Site Recovery Provider. This is installed during the Azure Site Recovery deployment.
- You'll need at least one cloud on the VMM server you want to protect. The cloud should contain:
	- One or more VMM host groups.
	- One or more Hyper-V host servers or clusters in each host group.
	- One or more virtual machines on the source Hyper-V server.
- Learn more about setting up VMM clouds:
	- Read more about private VMM clouds in [What’s New in Private Cloud with System Center 2012 R2 VMM](http://go.microsoft.com/fwlink/?LinkId=324952) and in [VMM 2012 and the clouds](http://go.microsoft.com/fwlink/?LinkId=324956).
	- Learn about [Configuring the VMM cloud fabric](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric)
	- After your cloud fabric elements are in place learn about creating private clouds in [Creating a private cloud in VMM](http://go.microsoft.com/fwlink/?LinkId=324953) and [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://go.microsoft.com/fwlink/?LinkId=324954).


### Hyper-V prerequisites

- The host Hyper-V servers must be running at least Windows Server 2012 with Hyper-V role and have the latest updates installed.
- If you're running Hyper-V in a cluster note that cluster broker isn't created automatically if you have a static IP address-based cluster. You'll need to configure the cluster broker manually. For instructions see [Configure Hyper-V Replica Broker](http://go.microsoft.com/fwlink/?LinkId=403937).
- Any Hyper-V host server or cluster for which you want to manage protection must be included in a VMM cloud.

### Network mapping prerequisites
When you protect virtual machines in Azure network mapping maps between VM networks on the source VMM server and target Azure networks to enable the following:

- All machines which fail over on the same network can connect to each other, irrespective of which recovery plan they are in.
- If a network gateway is setup on the target Azure network, virtual machines can connect to other on-premises virtual machines.
- If you don’t configure network mapping only virtual machines that fail over in the same recovery plan will be able to connect to each other after failover to Azure.

If you want to deploy network mapping you'll need the following:

- The virtual machines you want to protect on the source VMM server should be connected to a VM network. That network should be linked to a logical network that is associated with the cloud.
- An Azure network to which replicated virtual machines can connect after failover. You'll select this network at the time of failover. The network should be in the same region as your Azure Site Recovery subscription.
- Learn more about network mapping:
	- [Configuring logical networking in VMM](http://go.microsoft.com/fwlink/?LinkId=386307)
	- [Configuring VM networks and gateways in VMM](http://go.microsoft.com/fwlink/?LinkId=386308)
	- [Configure and monitor virtual networks in Azure](http://go.microsoft.com/fwlink/?LinkId=402555)


###PowerShell prerequisites
Make sure you have Azure PowerShell ready to go. If you are already using PowerShell, you'll need to upgrade to version 0.8.10 or later. For information about setting up PowerShell, see [How to install and configure Azure PowerShell](powershell-install-configure.md). Once you have set up and configured PowerShell, you can view all of the available cmdlets for the service [here](https://msdn.microsoft.com/library/dn850420.aspx). 

To learn about tips that can help you use the cmdlets, such as how parameter values, inputs, and outputs are typically handled in Azure PowerShell, see [Get Started with Azure Cmdlets](https://msdn.microsoft.com/library/azure/jj554332.aspx).

## Step 1: Set the subscription 

From Azure powershell, login to your Azure account: using the following cmdlets
 
	$UserName = "<user@live.com>"
	$Password = "<password>"
	$SecurePassword = ConvertTo-SecureString -AsPlainText $Password -Force
	$Cred = New-Object System.Management.Automation.PSCredential -ArgumentList $UserName, $SecurePassword
	Login-AzureRmAccount #-Credential $Cred 
	

Get a list of your subscriptions. This will also list the subscriptionIDs for each of the subscriptions. Note down the subscriptionID of the subscription in which you wish to create the recovery services vault	

	Get-AzureRmSubscription 

Set the subscription in which the recovery services vault is to be created by mentioning the subscription ID

	Set-AzureRmContext –SubscriptionID <subscriptionId>


Replace the elements within the "< >" with your specific information.

## Step 2: Create a Recovery Services vault

Create an ARM resource group if you don't have one already

	New-AzureRmResourceGroup -Name #ResourceGroupName -Location #location

Create a new Recovery services vault and save the created ASR vault object in a variable (will be used later). You can also retrieve the ASR vault object post creation using the Get-AzureRMRecoveryServicesVault cmdlet:-

	$vault = New-AzureRmRecoveryServicesVault -Name #vaultname -ResouceGroupName #ResourceGroupName -Location #location 



## Step 3: Generate a vault registration key

Generate a registration key in the vault. After you download the Azure Site Recovery Provider and install it on the VMM server, you'll use this key to register the VMM server in the vault.

1.	Get the vault setting file and set the context:
	

		Get-AzureRmRecoveryServicesVaultSettingsFile -Vault vaultname -Path #VaultSettingFilePath
	
	
2.	Set the vault context by running the following commands:
	
		Import-AzureRmSiteRecoveryVaultSettingsFile -Path $VaultSettingFilePath

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

	
## Step 5: Create an Azure storage account

If you don't have an Azure storage account, create a geo-replication enabled account in the same geo as the vault by running the following command:

	$StorageAccountName = "teststorageacc1"	#StorageAccountname
	$StorageAccountGeo  = "Southeast Asia" 	
	$ResourceGroupName =  “myRG” 			#ResourceGroupName 


	$RecoveryStorageAccount = New-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -Type “StandardGRS” -Location $StorageAccountGeo

Note that the storage account must be in the same region as the Azure Site Recovery service, and be associated with the same subscription.



## Step 6: Install the Azure Recovery Services Agent

Download the Azure Recovery Services agent at [http:/aka.ms/latestmarsagent](http:/aka.ms/latestmarsagent "http:/aka.ms/latestmarsagent")
and install it on each Hyper-V host server located in the VMM clouds you want to protect.

Run the following command on all VMM hosts:

	marsagentinstaller.exe /q /nu


## Step 7: Configure cloud protection settings

1.	Create a replication policy to Azure by running the following command:

	
		$ReplicationFrequencyInSeconds = "300";    	#options are 30,300,900
		$PolicyName = “replicapolicy”
		$Recoverypoints = 6            		#specify the number of recovery points 

		$policryresult = New-AzureRmSiteRecoveryPolicy -Name $policyname -ReplicationProvider HyperVReplicaAzure -ReplicationFrequencyInSeconds $replicationfrequencyinseconds -RecoveryPoints $recoverypoints -ApplicationConsistentSnapshotFrequencyInHours 1 -RecoveryAzureStorageAccountId "/subscriptions/q1345667/resourceGroups/test/providers/Microsoft.Storage/storageAccounts/teststorageacc1"

2.	Get a protection container by running the following commands:
	
		$PrimaryCloud = "testcloud"
		$protectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $PrimaryCloud;  
  
3.	Get the policy details to a variable using the job that was created and mentioning the friendly policy name:

		$policy = Get-AzureRmSiteRecoveryPolicy -FriendlyName $policyname

4.	Start the association of the protection container with the replication policy:

		$associationJob  = Start-AzureRmSiteRecoveryPolicyAssociationJob -Policy     $Policy -PrimaryProtectionContainer $protectionContainer  

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

To check the completion of the operation, follow the steps in [Monitor Activity](site-recovery-deploy-with-powershell.md#monitor).


## Step 8: Configure network mapping

Before you begin network mapping verify that virtual machines on the source VMM server are connected to a VM network. In addition, create one or more Azure virtual networks. 

For more information, click [here](vpn-gateway-create-site-to-site-rm-powershell.md)

Note that multiple Virtual Machine networks can be mapped to a single Azure network.
Note that if the target network has multiple subnets and one of those subnets has the same name as subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there is not a target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.

The first command gets servers for the current Azure Site Recovery vault. The command stores the Microsoft Azure Site Recovery servers in the $Servers array variable.

	$Servers = Get-AzureRmSiteRecoveryServer

The second command gets the site recovery network for the first server in the $Servers array. The command stores the networks in the $Networks variable.


    $Networks = Get-AzureRmSiteRecoveryNetwork -Server $Servers[0]

The third command gets Azure virtual networks, and then that value in the $AzureVmNetworks variable.
   
	$AzureVmNetworks =  Get-AzureRmVirtualNetwork

The final cmdlet creates a mapping between the primary network and the Azure virtual machine network. The cmdlet specifies the primary network as the first element of $Networks. The cmdlet specifies a virtual machine network as the first element of $AzureVmNetworks. 

	New-AzureRmSiteRecoveryNetworkMapping -PrimaryNetwork $Networks[0] -AzureVMNetworkId $AzureVmNetworks[0]


## Step 9: Enable protection for virtual machines

After servers, clouds, and networks are configured correctly, you can enable protection for virtual machines in the cloud. 

Note the following:



- Virtual machines must meet Azure requirements. Check these in [Prerequisites and support](http://go.microsoft.com/fwlink/?LinkId=402602) in the Planning guide.

- To enable protection, the operating system and operating system disk properties must be set for the virtual machine. When you create a virtual machine in VMM using a virtual machine template you can set the property. You can also set these properties for existing virtual machines on the **General** and **Hardware Configuration** tabs of the virtual machine properties. If you don't set these properties in VMM you'll be able to configure them in the Azure Site Recovery portal.



	
1.To enable protection, run the following command to get the protection container:

		$ProtectionContainer = Get-AzureRmSiteRecoveryProtectionContainer -friendlyName $CloudName
	
2.Get the protection entity (VM) by running the following command:
	
	$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -friendlyName $VMName -ProtectionContainer $protectionContainer
		
3.Enable the DR for the VM by running the following command:

	$jobResult = Set-AzureRmSiteRecoveryProtectionEntity -ProtectionEntity $protectionentity -Protection Enable –Force -Policy $policy -RecoveryAzureStorageAccountId  $storageID "/subscriptions/217653172865hcvkchgvd/resourceGroups/rajanirgps/providers/Microsoft.Storage/storageAccounts/teststorageacc1

## Test your deployment

To test your deployment you can run a test fail-over for a single virtual machine, or create a recovery plan consisting of multiple virtual machines and run a test fail-over for the plan. Test fail-over simulates your fail-over and recovery mechanism in an isolated network. Note that:

- If you want to connect to the virtual machine in Azure using Remote Desktop after the fail-over, enable Remote Desktop Connection on the virtual machine before you run the test failover.
- After fail-over, you'll use a public IP address to connect to the virtual machine in Azure using Remote Desktop. If you want to do this, ensure you don't have any domain policies that prevent you from connecting to a virtual machine using a public address.

To check the completion of the operation, follow the steps in [Monitor Activity](#monitor).


### Run a test failover

1.	Start the test failover by running the following comm
2.	and:
	
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $protectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryTestFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity -AzureVMNetworkId <string>  
### Run a planned failover

Start the planned failover by running the following command:
	
		$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $protectionContainer

		$jobIDResult =  Start-AzureRmSiteRecoveryPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity -AzureVMNetworkId <string>  
### Run an unplanned failover

Start the planned failover by running the following command:
		
	$protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -Name $VMName -ProtectionContainer $protectionContainer

	$jobIDResult =  Start-AzureRmSiteRecoveryUnPlannedFailoverJob -Direction PrimaryToRecovery -ProtectionEntity $protectionEntity -AzureVMNetworkId <string>  

	
## <a name=monitor></a> Monitor Activity

Use the following commands to monitor the activity. Note that you have to wait in between jobs for the processing to finish.

```

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

```


## Next steps

[Read more](https://msdn.microsoft.com/library/dn850420.aspx) about Azure Site Recovery PowerShell cmdlets</a>.



