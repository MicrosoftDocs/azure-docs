<properties 
	pageTitle="Disaster recovery with SQL Server and Azure Site Recovery" 
	description="Azure Site Recovery coordinates the replication, failover and recovery of SQL Server to a secondary on-premises site or Azure." 
	services="site-recovery" 
	documentationCenter="" 
	authors="rayne-wiselman" 
	manager="jwhit" 
	editor="tysonn"/>

<tags 
	ms.service="site-recovery" 
	ms.workload="backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/05/2015" 
	ms.author="raynew"/>


# Disaster recovery with SQL Server and Azure Site Recovery 

Site Recovery is an Azure service that contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Site Recovery supports a number of replication mechanisms to consistently protection, replicate and fail over of machines to Azure, or to a secondary datacenter. Get an overview of all the deployment scenarios in the [Azure Site Recovery overview](site-recovery-overview.md).

 This article describes how to protect the SQL Server backend of an application using a combination of SQL Server BCDR technologies and Site Recovery. You should have a good understanding of SQL Server BCDR features (failover clustering, AlwaysOn availability groups, database mirroring, log shipping) and Site Recovery before you deploy the scenarios described in this article.



## Overview

Many workloads use SQL Server as a foundation. Applications such as SharePoint, Dynamics, and SAP use SQL Server to implement data services. SQL Server high availability and disaster recovery features such as SQL Server availability groups to protect and recover SQL Server databases.

Site Recovery can protect SQL Server running as a Hyper-V virtual machine, a VMware virtual machine, or as a physical server.

 |**On-premises to on-premises** | **On-premises to Azure** 
---|---|---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes 
**Physical server** | Yes | Yes


## Support and integration

Site Recovery can be integrated with native SQL Server BCDR technologies summarized in the table to provide a disaster recovery solution.

**Feature** |**Details** | **SQL Server version** 
---|---|---
**AlwaysOn availability group** | <p>Multiple standalone instances of SQL Server each run in a failover cluster that has multiple nodes.</p> <p>Databases can be grouped into failover groups that can be copied (mirrored) on SQL Server instances so that no shared storage is needed.</p> <p>Provides disaster recovery between a primary site and one or more secondary sites. Two nodes can be set up in a shared nothing cluster with SQL Server databases configured in an availability group with synchronous replication and automatic failover.</p> | SQL Server 2014/2012 Enterprise edition
**Failover clustering (AlwaysOn FCI)** | <p>SQL Server leverages Windows failover clustering for high availability of on-premises SQL Server workloads.</p><p>Nodes running instances of SQL Server with shared disks are configured in a failover cluster. If an instance is down the cluster fails over to different one.</p> <p>The cluster doesn't protect against failure or outages in shared storage. The shared disk can be implemented with iSCSI, fiber channel, or shared VHDXs.</p> | SQL Server Enterprise editions</p> <p>SQL Server Standard edition (limited to two nodes only)
**Database mirroring (high safety mode)** | Protects a single database to a single secondary copy. Available in both high safety (synchronous) and high performance (asynchronous) replication modes. Doesn’t require a failover cluster. | <p>SQL Server 2008 R2</p><p>SQL Server Enterprise all editions</p>
**Standalone SQL Server** | The SQL Server and database are hosted on a single server (physical or virtual). Host clustering is used for high availability if the server is virtual. No guest-level high availability. | Enterprise or Standard edition



The following table summarizes our recommendations for integrating SQL Server BCDR technologies into Site Recovery deployment.

**Version** |**Edition** | **Deployment** | **On-prem to on-prem** | **On-prem to Azure** 
---|---|---|---|
SQL Server 2014 or 2012 | Enterprise | Failover cluster instance | AlwaysOn availability groups | AlwaysOn availability groups
 | Enterprise | AlwaysOn availability groups for high availability | AlwaysOn availability group | AlwaysOn availability group
 | Standard | Failover cluster instance | Site Recovery replication with local mirror | Site Recovery replication with local mirror
 | Enterprise or Standard | Standalone | Site Recovery replication with local mirror | Site Recovery replication with local mirror
SQL Server 2008 R2 | Enterprise or Standard | Standalone | Site Recovery replication with local mirror | Site Recovery replication with local mirror


## Deployment prerequisites

Here's what you need before you start:


- An on-premises SQL Server deployment running a supported SQL Server version. Typically you'll also need an Active Directory for your SQL server.
- The prerequisites for the scenario you want to deploy. Prerequisites can be found in each deployment article. These and listed and linked in the [Site Recovery Overview](site-recovery-overview.md).
- If you want to set up recovery in Azure, you'll need to run the [Azure Virtual Machine Readiness Assessment](http://www.microsoft.com/download/details.aspx?id=40898) tool on your SQL Server virtual machines to make sure they're compatible with Azure and Site Recovery.

## Set up protection

You'll need to perform a couple of steps:

- Set up Active Directory
- Set up protection for a SQL Server cluster or standalone server

### Set up Active Directory

You'll need Active Directory on the secondary recovery site for SQL Server to run properly. there are a couple of options:

- **Small enterprise**—If you have a small number of applications and a single domain controller for the on-premises site, and you want to fail over the entire site, we recommend that you use Site Recovery repication to replicate the domain controller to the secondary datacenter or to Azure.

- **Medium to large enterprise**—If you have a large number of application, you're running an Active Directory forest, and you want to fail over by application or workload, we recommend you set up an additional domain controller in the secondary datacenter or in Azure. Note that if you're using AlwaysOn availability groups to recover to a remote site we recommend you set up another additional domain controller on the secondary site or Azure, to use for the recovered SQL Server instance.

The instructions in this document presume that a domain controller is available in the secondary location. 

### Set up protection for a standalone SQL Server


In this configuration we recommend you use Site Recovery replication to protect the SQL Server machine. The exact steps will depend whether SQL Server is set up as a virtual machine or physical server, and whether you want to replicate to Azure or a secondary on-premises site. Get instructions for all deployment scenarios in the [Site Recovery Overview](site-recovery-overview.md).


### Set up protection for SQL Server cluster (2012 or 2014 Enterprise)

If the SQL Server is using availability groups for high availability, or a failover cluster instance, we recommend using availability groups on the recovery site as well. Note that this guidance is for applications that don't use distributed transactions.

##### On-premises to on-premises

1. [Configure databases](https://msdn.microsoft.com/library/hh213078.aspx) into availability groups.
2. Create a new virtual network on secondary site.
3. Set up a site-to-site VPN between the new virtual network and the primary site.
4. Create a virtual machine on the recovery site and install SQL Server on it.
5. Extend the existing AlwaysOn availability groups to the new SQL Server virtual machine. Configure this SQL Server instance as an asynchronous replica copy.
6. Create an availability group listener, or update the existing listener to include the asynchronous replica virtual machine.
7. Make sure that the application farm is setup using the listener. If It's setup up using the database server name, please update it to use the listener so you don't need to reconfigure it after the failover.

#### On-premises to Azure

When you replicate to Azure configuring multiple availability groups is challenging because each availability group needs a dedicated listener, and configuring each listener requires a separate cloud service. We recommend that you configure one availability group with all the databases included.

1. Create an Azure virtual network.
2. Set up a site-to-site VPN between the on-premises site and this network.
3. Create a new SQL Server Azure virtual machine in the network and configure it as an asynchronous availability group replica. If you need high availability for SQL Server tier after failover to Azure then configure two asynchronous replica copies in Azure.
4. Set up a replica of the domain controller in the virtual network.
5. Make sure that virtual machine extensions are enabled on the virtual machine. This is needed to push scripts specific to SQL Server in a recovery plan.
6. Configure a SQL Server listener for the availability group using Azure's internal load balancer.
7. Configure the application tier to use the listener to access the database tier. For applications that use distributed transactions we recommendation you use Site Recovery with SAN replication or VMWare site-to-site replication.

### Set up protection for SQL Server cluster (Standard or 2008 R2)

For a cluster running SQL Server Standard edition or SQL Server 2008 R2 we recommend you use Site Recovery replication to protect SQL Server.

#### On-premises to on-premises

- For a Hyper-V environment, if the application's uses distributed transactions we recommend you deploy [Site Recovery with SAN replication](site-recovery-vmm-san.md).

- For a VMware environment we recommend you deploy [VMware to VMware](site-recovery-vmware-to-vmware.md) protection.

#### On-premises to Azure

Site recovery doesn't support guest cluster support when replicating to Azure. SQL Server also doesn't provide a low-cost disaster recovery solution for Standard edition. We recommend you protect the on-premises SQL Server cluster to a standalone SQL Server and recover it in Azure.


1. Configure an additional standalone SQL Server instance in the on-premises site.
2. Configure this instance to serve as a mirror for the databases that need protection. Configure the mirroring in high safety mode.
3.	Configure Site Recovery on the on-premises site based on the environment ([Hyper-V](site-recovery-hyper-v-site-to-azure.md) or [VMware](site-recovery-vmware-to-azure.md).
4.	Use Site Recovery replication to replicate the new SQL Server instance to Azure. It's a high safety mirror copy so it'll be synchronized with the primary cluster, but it'll be replicated to Azure using Site Recovery replication.

The following graphic illustrates this setup.

![Standard cluster](./media/site-recovery-sql/BCDRStandaloneClusterLocal.png)



##Create recovery plans

Recovery plans group machines that should fail over together. Learn more about [recovery plans](site-recovery-create-recovery-plans.md) and [failover](site-recovery-failover.md) before you start.


### Create a recovery plan for SQL Server clusters (SQL Server 2012/2014 Enterprise)

#### Configure SQL Server scripts for failover to Azure

In this scenario we leverage custom scripts and Azure automation for recovery plans, to configure a scripted failover of SQL Server availability groups.

1.	Create a local file for the script to fail over an availability group. This sample script specifies a path to the availability group on the Azure replica and fails it over to that replica instance. This script will be run on the SQL Server replica virtual machine by passing is with the custom script extension.



    	Param(
    	[string]$SQLAvailabilityGroupPath
    	)
    	import-module sqlps
    	Switch-SqlAvailabilityGroup -Path $SQLAvailabilityGroupPath -AllowDataLoss -force

2.	Upload the script to a blob in an Azure storage account. Use this example:

    	$context = New-AzureStorageContext -StorageAccountName "Account" -StorageAccountKey "Key"
    	Set-AzureStorageBlobContent -Blob "AGFailover.ps1" -Container "script-container" -File "ScriptLocalFilePath" -context $context

3.	Create an Azure automation runbook to invoke the scripts on the SQL Server replica virtual machine in Azure. Use this sample script to do this. [Learn more](site-recovery-runbook-automation.md) about using automation runbooks in recovery plans. 

    	workflow SQLAvailabilityGroupFailover
    	{
    		param (
        		[Object]$RecoveryPlanContext
    		)

    		$Cred = Get-AutomationPSCredential -name 'AzureCredential'
	
    		#Connect to Azure
    		$AzureAccount = Add-AzureAccount -Credential $Cred
    		$AzureSubscriptionName = Get-AutomationVariable –Name ‘AzureSubscriptionName’
    		Select-AzureSubscription -SubscriptionName $AzureSubscriptionName
    
    		InLineScript
    		{
     		#Update the script with name of your storage account, key and blob name
     		$context = New-AzureStorageContext -StorageAccountName "Account" -StorageAccountKey "Key";
     		$sasuri = New-AzureStorageBlobSASToken -Container "script-container"- Blob "AGFailover.ps1" -Permission r -FullUri -Context $context;
     
     		Write-output "failovertype " + $Using:RecoveryPlanContext.FailoverType;
               
     		if ($Using:RecoveryPlanContext.FailoverType -eq "Test")
       			{
           		#Skipping TFO in this version.
           		#We will update the script in a follow-up post with TFO support
           		Write-output "tfo: Skipping SQL Failover";
       			}
     		else
       			{
           		Write-output "pfo/ufo";
           		#Get the SQL Azure Replica VM.
           		#Update the script to use the name of your VM and Cloud Service
           		$VM = Get-AzureVM -Name "SQLAzureVM" -ServiceName "SQLAzureReplica";     
       
           		Write-Output "Installing custom script extension"
           		#Install the Custom Script Extension on teh SQL Replica VM
           		Set-AzureVMExtension -ExtensionName CustomScriptExtension -VM $VM -Publisher Microsoft.Compute -Version 1.3| Update-AzureVM; 
                    
           		Write-output "Starting AG Failover";
           		#Execute the SQL Failover script
           		#Pass the SQL AG path as the argument.
       
           		$AGArgs="-SQLAvailabilityGroupPath sqlserver:\sql\sqlazureVM\default\availabilitygroups\testag";
       
           		Set-AzureVMCustomScriptExtension -VM $VM -FileUri $sasuri -Run "AGFailover.ps1" -Argument $AGArgs | Update-AzureVM;
       
           		Write-output "Completed AG Failover";

       			}
        
    		}
    	}

4.	When you create a recovery plan for the application add a "pre-Group 1 boot" scripted step that invokes the automation runbook to fail over availability groups.

#### Configure SQL Server scripts for failover to a secondary site

1. Add this sample script to the VMM library on the primary and secondary sites.

    	Param(
    	[string]$SQLAvailabilityGroupPath
    	)
    	import-module sqlps
    	Switch-SqlAvailabilityGroup -Path $SQLAvailabilityGroupPath -AllowDataLoss -force

2. When you create a recovery plan for the application add a "pre-Group 1 boot" scripted step that invokes the script to fail over availability groups.

### Create a recovery plan for SQL Server clusters (Standard)

#### Configure SQL Server scripts for failover to Azure

1.	Create a local file for the script to fail over the SQL Server database mirror. Use this sample script.

    	Param(
    	[string]$database
    	)
    	Import-module sqlps
    	Invoke-sqlcmd –query “ALTER DATABASE $database SET PARTNER FORCE_SERVICE_ALLOW_DATA_LOSS”

2.	Upload the script to a blob in an Azure storage account. Use this sample script.

    	$context = New-AzureStorageContext -StorageAccountName "Account" -StorageAccountKey "Key"
    	Set-AzureStorageBlobContent -Blob "AGFailover.ps1" -Container "script-container" -File "ScriptLocalFilePath" -context $context

3.	Create an Azure automation runbook to invoke the script on the SQL Server replica virtual machine in Azure. Use this sample script to do this. [Learn more](site-recovery-runbook-automation.md) about using automation runbooks in recovery plans.Make sure the virtual machine agent in running on the failed over SQL Server virtual machine before you do this.

    	workflow SQLAvailabilityGroupFailover
		{
    		param (
        		[Object]$RecoveryPlanContext
    		)

    	$Cred = Get-AutomationPSCredential -name 'AzureCredential'
	
    	#Connect to Azure
    	$AzureAccount = Add-AzureAccount -Credential $Cred
    	$AzureSubscriptionName = Get-AutomationVariable –Name ‘AzureSubscriptionName’
    	Select-AzureSubscription -SubscriptionName $AzureSubscriptionName
    
    	InLineScript
    	{
     	#Update the script with name of your storage account, key and blob name
     	$context = New-AzureStorageContext -StorageAccountName "Account" -StorageAccountKey "Key";
     	$sasuri = New-AzureStorageBlobSASToken -Container "script-container" -Blob "AGFailover.ps1" -Permission r -FullUri -Context $context;
     
     	Write-output "failovertype " + $Using:RecoveryPlanContext.FailoverType;
               
     	if ($Using:RecoveryPlanContext.FailoverType -eq "Test")
       		{
           		#Skipping TFO in this version.
           		#We will update the script in a follow-up post with TFO support
           		Write-output "tfo: Skipping SQL Failover";
       		}
     	else
       			{
           		Write-output "pfo/ufo";
           		#Get the SQL Azure Replica VM.
           		#Update the script to use the name of your VM and Cloud Service
           		$VM = Get-AzureVM -Name "SQLAzureVM" -ServiceName "SQLAzureReplica";     
       
           		Write-Output "Installing custom script extension"
           		#Install the Custom Script Extension on teh SQL Replica VM
           		Set-AzureVMExtension -ExtensionName CustomScriptExtension -VM $VM -Publisher Microsoft.Compute -Version 1.3| Update-AzureVM; 
                    
           		Write-output "Starting AG Failover";
           		#Execute the SQL Failover script
           		#Pass the SQL AG path as the argument.
       
           		$AGArgs="-SQLAvailabilityGroupPath sqlserver:\sql\sqlazureVM\default\availabilitygroups\testag";
       
           		Set-AzureVMCustomScriptExtension -VM $VM -FileUri $sasuri -Run "AGFailover.ps1" -Argument $AGArgs | Update-AzureVM;
       
           		Write-output "Completed AG Failover";

       			}
        
    		}
		}



4. Add these steps in the recovery plan to fail over the SQL Server tier:

	- For planned failover add a primary side script to shut down the primary cluster after “Group shutdown”.
	- Add the SQL Server database mirror virtual machine to the recovery plan, preferably in the first boot group.
3.	Add a post failover script to fail over the mirror copy inside this virtual machine using the automation script above. Note that since the database instance name will have changed the application tier will have to be reconfigured to use the new database.


#### Configure SQL Server scripts for failover to a secondary site

1.	Add this sample script to the VMM library on the primary and secondary sites.

    	Param(
    	[string]$database
    	)
    	Import-module sqlps
    	Invoke-sqlcmd –query “ALTER DATABASE $database SET PARTNER FORCE_SERVICE_ALLOW_DATA_LOSS”

2.	Add the SQL Server database mirror virtual machine to the recovery plan, preferably in the first boot group.
3.	Add a post failover script to fail over the mirror copy inside this virtual machine using the VMM script above. Note that since the database instance name will have changed the application tier will have to be reconfigured to use the new database.





## Test failover considerations

If you're using AlwaysOn availability groups, you can't do a test failover of the SQL Server tier. Consider these options as an alternative:

- Option 1

	1. Perform a test failover of the application and front-end tiers.
	2. Update the application tier to access the replica copy in read-only mode, and perform a read-only test of the application.

- Option 2
1.	Create a copy of the replica SQL Server virtual machine instance (using VMM clone for site-to-site or Azure Backup) and bring it up in a test network
2.	Perform the test failover using the recovery plan.

## Failback considerations

For SQL standard clusters, failback after an unplanned failover will require a SQL Server backup and restore from the mirror instance to the original cluster, and then reestablishing the mirror.





 