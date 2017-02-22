---
title: Replicate apps with SQL Server and Azure Site Recovery | Microsoft Docs
description: This article describes how to replicate SQL Server using Azure Site Recovery of SQL Server disaster capabilities.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: 9126f5e8-e9ed-4c31-b6b4-bf969c12c184
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/22/2017
ms.author: raynew

---
# Protect SQL Server using SQL Server disaster recovery and Azure Site Recovery

This article describes how to protect the SQL Server back end of an application using a combination of SQL Server business continuity and disaster recovery (BCDR) technologies, and [Azure Site Recovery](site-recovery-overview.md).

Before you start, make sure you understand SQL Server disaster recovery capabilities, including failover clustering, AlwaysOn availability groups, database mirroring, and log shipping.


## SQL Server deployments

Many workloads use SQL Server as a foundation, and it can be integrated with apps such as SharePoint, Dynamics, and SAP, to implement data services.  SQL Server can be deployed in a number of ways:

* **Standalone SQL Server**: SQL Server and all databases are hosted on a single machine (physical or a virtual). When virtualized, host clustering is used for local high availability. Guest-level high availability isn't implemented.
* **SQL Server Failover Clustering Instances (AlwaysOn FCI)**: Two or more nodes running SQL Server instanced with shared disks are configured in a Windows Failover cluster. If a node is down, the cluster can fail SQL Server over to another instance. This setup is typically used to implement high availability at a primary site. This deployment doesn't protect against failure or outage in the shared storage layer. A shared disk can be implemented using iSCSI, fiber channel or shared vhdx.
* **SQL AlwaysOn Availability Groups**: Two or more nodes are set up in a shared nothing cluster, with SQL Server databases configured in an availability group, with synchronous replication and automatic failover.

 This article leverages the following native SQL disaster recovery technologies for recovering databases to a remote site:

* SQL AlwaysOn Availability Groups, to provide for disaster recovery for SQL Server 2012 or 2014 Enterprise editions.
* SQL database mirroring in high safety mode, for SQL Server Standard edition (any version), or for SQL Server 2008 R2.

## Site Recovery support

### Supported scenarios
Site Recovery can protect SQL Server as summarized in the table.

**Scenario** | **To a secondary site** | **To Azure**
--- | --- | ---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes
**Physical server** | Yes | Yes

### Supported SQL Server versions
These SQL Server versions are supported, for the supported scenarios:

* SQL Server 2014 Enterprise and Standard
* SQL Server 2012 Enterprise and Standard
* SQL Server 2008 R2 Enterprise and Standard

### Supported SQL Server integration

Site Recovery can be integrated with native SQL Server BCDR technologies summarized in the table, to provide a disaster recovery solution.

**Feature** | **Details** | **SQL Server** |
--- | --- | ---
**AlwaysOn availability group** | Multiple standalone instances of SQL Server each run in a failover cluster that has multiple nodes.<br/><br/>Databases can be grouped into failover groups that can be copied (mirrored) on SQL Server instances so that no shared storage is needed.<br/><br/>Provides disaster recovery between a primary site and one or more secondary sites. Two nodes can be set up in a shared nothing cluster with SQL Server databases configured in an availability group with synchronous replication and automatic failover. | SQL Server 2014 & 2012 Enterprise edition
**Failover clustering (AlwaysOn FCI)** | SQL Server leverages Windows failover clustering for high availability of on-premises SQL Server workloads.<br/><br/>Nodes running instances of SQL Server with shared disks are configured in a failover cluster. If an instance is down the cluster fails over to different one.<br/><br/>The cluster doesn't protect against failure or outages in shared storage. The shared disk can be implemented with iSCSI, fiber channel, or shared VHDXs. | SQL Server Enterprise editions<br/><br/>SQL Server Standard edition (limited to two nodes only)
**Database mirroring (high safety mode)** | Protects a single database to a single secondary copy. Available in both high safety (synchronous) and high performance (asynchronous) replication modes. Doesn’t require a failover cluster. | SQL Server 2008 R2<br/><br/>SQL Server Enterprise all editions
**Standalone SQL Server** | The SQL Server and database are hosted on a single server (physical or virtual). Host clustering is used for high availability if the server is virtual. No guest-level high availability. | Enterprise or Standard edition

## Deployment recommendations

This table summarizes our recommendations for integrating SQL Server BCDR technologies with Site Recovery.

| **Version** | **Edition** | **Deployment** | **On-prem to on-prem** | **On-prem to Azure** |
| --- | --- | --- | --- | --- |
| SQL Server 2014 or 2012 |Enterprise |Failover cluster instance |AlwaysOn availability groups |AlwaysOn availability groups |
|| Enterprise |AlwaysOn availability groups for high availability |AlwaysOn availability groups |AlwaysOn availability groups | |
|| Standard |Failover cluster instance (FCI) |Site Recovery replication with local mirror |Site Recovery replication with local mirror | |
|| Enterprise or Standard |Standalone |Site Recovery replication |Site Recovery replication | |
| SQL Server 2008 R2 |Enterprise or Standard |Failover cluster instance (FCI) |Site Recovery replication with local mirror |Site Recovery replication with local mirror |
|| Enterprise or Standard |Standalone |Site Recovery replication |Site Recovery replication | |
| SQL Server (Any version) |Enterprise or Standard |Failover cluster instance - DTC application |Site Recovery replication |Not Supported |

## Deployment prerequisites

* An on-premises SQL Server deployment, running a supported SQL Server version. Typically, you also need Active Directory for your SQL server.
* The requirements for the scenario you want to deploy. Learn more about support requirements for [replication to Azure](site-recovery-support-matrix-to-azure.md) and [on-premises](site-recovery-support-matrix.md), and [deployment prerequisites](site-recovery-prereq.md).
* To set up recovery in Azure, run the [Azure Virtual Machine Readiness Assessment](http://www.microsoft.com/download/details.aspx?id=40898) tool on your SQL Server virtual machines, to make sure they're compatible with Azure and Site Recovery.

## Set up Active Directory

Set up Active Directory, in the secondary recovery site, for SQL Server to run properly.

* **Small enterprise**—With a small number of applications, and single domain controller for the on-premises site, if you want to fail over the entire site, we recommend you use Site Recovery replication to replicate the domain controller to the secondary datacenter, or to Azure.
* **Medium to large enterprise**—If you have a large number of applications, an Active Directory forest, and you want to fail over by application or workload, we recommend you set up an additional domain controller in the secondary datacenter, or in Azure. If you're using AlwaysOn availability groups to recover to a remote site, we recommend you set up another additional domain controller on the secondary site or in Azure, to use for the recovered SQL Server instance.

The instructions in this article presume that a domain controller is available in the secondary location. [Read more](site-recovery-active-directory.md) about protecting Active Directory with Site Recovery.

## Integrate with SQL Server AlwaysOn for replication to Azure (classic portal with a VMM/configuration server)


Site Recovery natively supports SQL AlwaysOn. If you've created a SQL Availability Group with an Azure virtual machine set up as secondary location, then you can use Site Recovery to manage the failover of the Availability Groups.

> [!NOTE]
> This capability is currently in preview. It's available when the primary site has Hyper-V host servers managed in System Center VMM clouds, or when you've set up [VMware replication](site-recovery-vmware-to-azure.md). The functionality isn't currently available in the new Azure portal. Follow the steps in [this section](site-recovery-sql.md#integrate-with-sql-server-alwayson-for-replication-to-azure-azure-portalclassic-portal-with-no-vmmconfiguration-server) if you are using new Azure portal.
>
>


#### Before you start

To integrate SQL AlwaysOn with Site Recovery you need:

* An on-premises SQL Server (standalone server or a failover cluster).
* One or more Azure virtual machines, with SQL Server installed.
* A SQL Server Availability Group, set up between an on-premises SQL Server and SQL Server running in Azure.
* PowerShell remoting enabled on the on-premises SQL Server. The VMM server or the configuration server should be able to make remote PowerShell calls to the SQL Server machine.
* A user account should be added to the on-premises SQL Server machine. Add in a SQL Server group with at least these permissions:
  * ALTER AVAILABILITY GROUP: permissions [here](https://msdn.microsoft.com/library/hh231018.aspx), and [here](https://msdn.microsoft.com/library/ff878601.aspx#Anchor_3)
  * ALTER DATABASE - permissions [here](https://msdn.microsoft.com/library/ff877956.aspx#Security)
* If you're running VMM, A RunAs account should be created on VMM server
- If you're running VMware, an account should be created on the configuration server using the CSPSConfigtool.exe
* The SQL PS module should be installed on SQL Servers running on-premises, and on Azure VMs.
* The VM agent should be installed on Azure VMs.
* NTAUTHORITY\System should have following permissions in SQL Server running on Azure VMs.
  * ALTER AVAILABILITY GROUP: permissions [here](https://msdn.microsoft.com/library/hh231018.aspx), and [here](https://msdn.microsoft.com/library/ff878601.aspx#Anchor_3)
  * ALTER DATABASE - permissions [here](https://msdn.microsoft.com/library/ff877956.aspx#Security)

### Add a SQL Server
1. Click **Add SQL** to add a new SQL Server.

    ![Add SQL](./media/site-recovery-sql/add-sql.png)
2. In **Configure SQL Settings** > **Name** provide a friendly name for the SQL Server.
3. **In SQL Server (FQDN)**, specify the FQDN of the source SQL Server that you want to add. If SQL Server is installed on a failover cluster, provide the FQDN of the cluster, and not of the cluster nodes.  
4. In **SQL Server Instance**, choose the default instance or provide the custom name.
5. In **Management Server**, select a VMM server or configuration server, registered in the vault. Site Recovery uses this server to communicate with the SQL Server.
6. In **Run as Account**, provide the name of the VMM RunAs account, or the configuration server account. This account is used to access the SQL Server, and should have Read and Failover permissions for the availability groups on the SQL Server machine.

    ![Add SQL Dialog](./media/site-recovery-sql/add-sql-dialog.png)

After you add the SQL Server, it appears in the **SQL Servers** tab.

![SQL Server List](./media/site-recovery-sql/sql-server-list.png)

### Add a SQL Availability Group

1. In the SQL Server you added, click **Add SQL Availability Group**.

    ![Add SQL AG](./media/site-recovery-sql/add-sqlag.png)
2. The Availability Group can be replicating to one or more Azure VMs. When you add the group, you need to provide the name and subscription of the Azure VM to which you want to the group to be failed over by Site Recovery.

    ![Add SQL AG Dialog](./media/site-recovery-sql/add-sqlag-dialog.png)
3. In this example, Availability Group DB1-AG will become primary, on virtual machine SQLAGVM2 running inside subscription DevTesting2 on a failover.

> [!NOTE]
> Only the Availability Groups that are primary on the added SQL Server can be added to Site Recovery. If you've made an Availability Group primary on the SQL Server, or you've added more Availability Groups on the SQL Server after it was added, refresh the group on the SQL Server.
>
>

### Create a recovery plan

Create a recovery plan using both virtual machines, and the availability groups. Select the VMM server, or configuration server, as the source, and Azure as the target.

![Create Recovery Plan](./media/site-recovery-sql/create-rp1.png)

![Create Recovery Plan](./media/site-recovery-sql/create-rp2.png)

In the example, the Sharepoint app consists of three virtual machines which use a SQL Availability Group as a backend. In this recovery plan, we can select both the availability group, and the app VMs. You can further customize the recovery plan by moving VMs to different failover groups, to sequence the failover order. The Availability Group is always failed over first, because it's used as the app backend.

![Customize Recovery Plan](./media/site-recovery-sql/customize-rp.png)

### Failover

After the Availability Group is added to a recovery plan, different failover options are available.

**Failover** | **Details**
--- | ---
**Planned failover** | Planned failover implies a no data loss failover. To achieve that, the SQL Availability Group mode is set to synchronous, and then a failover is triggered to make the availability group primary on the virtual machine provided, while adding the group to Site Recovery. After the failover is complete, Availability Mode is set to the same value as it was before the planned failover was triggered.
**Unplanned failover** | Unplanned Failover can result in data loss. While triggering unplanned failover, the availability mode of the group isn't changed. It's made into primary on the virtual machine provided, while adding the availability group to Site Recovery. After unplanned failover is complete, and the on-premises server running SQL Server is available again, reverse replication has to be triggered on the Availability Group. This action is available in **SQL Servers** > **SQL Availability Group**, and not on the recovery plan.
**Test failover** |nTest failover for SQL Availability Group isn't supported. If you trigger a test failover, failover is skipped for the Availability Group.

Try these failover options.

**Option** | **Details**
--- | ---
**Option 1** | 1. Perform a test failover of the application and front-end tiers.<br/><br/>2. Update the application tier to access the replica copy in read-only mode, and perform a read-only test of the application.
**Option 2** | 1. Create a copy of the replica SQL Server virtual machine instance (using VMM clone for site-to-site, or Azure Backup) and bring it up in a test network<br/><br/> 2. Perform the test failover using the recovery plan.

### Fail back

If you want to make the Availability Group primary again on the on-premises SQL Server, then you can trigger a planned failover on the recovery plan, and select the direction from Microsoft Azure to the on-premises server.

> [!NOTE]
> After an unplanned failover, reverse replication should be triggered on the Availability Group, to resume replication.  Replication remains suspended until this is done.
>
>

## Integrate with SQL Server AlwaysOn for replication to Azure (Azure portal/classic portal with no VMM/configuration server)

These instructions are relevant if you're integrating with SQL Server Availability Groups in the new Azure portal, or in the classic portal if you're not using a VMM server, or configuration server. In this scenario, Azure Automation Runbooks can be used to configure a scripted failover of SQL Availability Groups.

Here's what you need to do:

1. Create a local file for a script that fails over an availability group. This sample script specifies a path to the availability group on the Azure replica, and fails it over to that replica instance. This script is run on the SQL Server replica virtual machine, by passing it with the custom script extension.

    	``Param(
   		[string]$SQLAvailabilityGroupPath
    	)
    	import-module sqlps
    	Switch-SqlAvailabilityGroup -Path $SQLAvailabilityGroupPath -AllowDataLoss -force``

2. Upload the script to a blob in an Azure storage account. Use this example:

    	``$context = New-AzureStorageContext -StorageAccountName "Account" -StorageAccountKey "Key"
    	Set-AzureStorageBlobContent -Blob "AGFailover.ps1" -Container "script-container" -File "ScriptLocalFilePath" -context $context``

3. Create an Azure automation runbook to invoke the scripts, on the SQL Server replica virtual machine in Azure. Use this sample script to do this. [Learn more](site-recovery-runbook-automation.md) about using automation runbooks in recovery plans.

4. When you create a recovery plan for the application, add a "pre-Group 1 boot" script step that invokes the automation runbook to fail over the availability group.


5. SQL AlwaysOn doesn’t natively support test failover. Therefore, we recommend the following:
	1. Set up [Azure Backup](../backup/backup-azure-vms.md) on the virtual machine that hosts the availability group replica in Azure.
	1. Before triggering test failover of the recovery plan, recover the virtual machine from the backup taken in the previous step.
	1. Do a test failover of the recovery plan.


> [!NOTE]
> The script below assumes that the SQL Availability Group is hosted in a classic Azure VM, and that the name of restored virtual machine in Step-2 is SQLAzureVM-Test. Modify the script, based on the name you use for the recovered virtual machine.
>
>


     ``workflow SQLAvailabilityGroupFailover
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
                    Write-output "tfo"

                    Write-Output "Creating ILB"
                    Add-AzureInternalLoadBalancer -InternalLoadBalancerName SQLAGILB -SubnetName Subnet-1 -ServiceName SQLAzureVM-Test -StaticVNetIPAddress #IP
                    Write-Output "ILB Created"

					#Update the script with name of the virtual machine recovered using Azure Backup
                    Write-Output "Adding SQL AG Endpoint"
                    Get-AzureVM -ServiceName "SQLAzureVM-Test" -Name "SQLAzureVM-Test"| Add-AzureEndpoint -Name sqlag -LBSetName sqlagset -Protocol tcp -LocalPort 1433 -PublicPort 1433 -ProbePort 59999 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 -InternalLoadBalancerName SQLAGILB | Update-AzureVM

                    Write-Output "Added Endpoint"

                    $VM = Get-AzureVM -Name "SQLAzureVM-Test" -ServiceName "SQLAzureVM-Test"

                    Write-Output "UnInstalling custom script extension"
                    Set-AzureVMCustomScriptExtension -Uninstall -ReferenceName CustomScriptExtension -VM $VM |Update-AzureVM
                    Write-Output "Installing custom script extension"
                    Set-AzureVMExtension -ExtensionName CustomScriptExtension -VM $vm -Publisher Microsoft.Compute -Version 1.*| Update-AzureVM   

                    Write-output "Starting AG Failover"
                    Set-AzureVMCustomScriptExtension -VM $VM -FileUri $sasuri -Run "AGFailover.ps1" -Argument "-Path sqlserver:\sql\sqlazureVM\default\availabilitygroups\testag"  | Update-AzureVM
                    Write-output "Completed AG Failover"
                }
          else
                {
                Write-output "pfo/ufo";
                #Get the SQL Azure Replica VM.
                #Update the script to use the name of your VM and Cloud Service
                $VM = Get-AzureVM -Name "SQLAzureVM" -ServiceName "SQLAzureReplica";     

                Write-Output "Installing custom script extension"
                #Install the Custom Script Extension on teh SQL Replica VM
                Set-AzureVMExtension -ExtensionName CustomScriptExtension -VM $VM -Publisher Microsoft.Compute -Version 1.*| Update-AzureVM;

                Write-output "Starting AG Failover";
                #Execute the SQL Failover script
                #Pass the SQL AG path as the argument.

                $AGArgs="-SQLAvailabilityGroupPath sqlserver:\sql\sqlazureVM\default\availabilitygroups\testag";

                Set-AzureVMCustomScriptExtension -VM $VM -FileUri $sasuri -Run "AGFailover.ps1" -Argument $AGArgs | Update-AzureVM;

                Write-output "Completed AG Failover";

                }

         }
     }``

## Integrate with SQL Server AlwaysOn for replication to a secondary on-premises site

If the SQL Server is using availability groups for high availability (or an FCI), we recommend using availability groups on the recovery site as well. Note that this applies to apps that don't use distributed transactions.

1. [Configure databases](https://msdn.microsoft.com/library/hh213078.aspx) into availability groups.
2. Create a virtual network on the secondary site.
3. Set up a site-to-site VPN connection between the virtual network, and the primary site.
4. Create a virtual machine on the recovery site, and install SQL Server on it.
5. Extend the existing AlwaysOn availability groups to the new SQL Server VM. Configure this SQL Server instance as an asynchronous replica copy.
6. Create an availability group listener, or update the existing listener to include the asynchronous replica virtual machine.
7. Make sure that the application farm is set up using the listener. If it's setup up using the database server name, update it to use the listener, so you don't need to reconfigure it after the failover.

For applications that use distributed transactions, we recommend you deploy Site Recovery with [SAN replication](site-recovery-vmm-san.md), or [VMware/physical server site-to-site replication](site-recovery-vmware-to-vmware.md).

### Recovery plan considerations
1. Add this sample script to the VMM library, on the primary and secondary sites.

        ``Param(
        [string]$SQLAvailabilityGroupPath
        )
        import-module sqlps
        Switch-SqlAvailabilityGroup -Path $SQLAvailabilityGroupPath -AllowDataLoss -force``
2. When you create a recovery plan for the application, add a "pre-Group 1 boot" scripted step, that invokes the script to fail over availability groups.

## Protect a standalone SQL Server

In this scenario, we recommend that you use Site Recovery replication to protect the SQL Server machine. The exact steps will depend whether SQL Server is a VM or a physical server, and whether you want to replicate to Azure or a secondary on-premises site. Learn about [Site Recovery scenarios](site-recovery-overview.md).

## Protect a SQL Server cluster (standard edition/Windows Server 2008 R2)

For a cluster running SQL Server Standard edition, or SQL Server 2008 R2, we recommend you use Site Recovery replication to protect SQL Server.

### On-premises to on-premises

* If the app uses distributed transactions we recommend you deploy [Site Recovery with SAN replication](site-recovery-vmm-san.md) for a Hyper-V environment, or [VMware/physical server to VMware](site-recovery-vmware-to-vmware.md) for a VMware environment.
* For non-DTC applications, use the above approach to recover the cluster as a standalone server, by leveraging a local high safety DB mirror.

### On-premises to Azure

Site Recovery doesn't provide guest cluster support when replicating to Azure. SQL Server also doesn't provide a low-cost disaster recovery solution for Standard edition. In this scenario, we recommend you protect the on-premises SQL Server cluster to a standalone SQL Server, and recover it in Azure.

1. Configure an additional standalone SQL Server instance on the on-premises site.
2. Configure the instance to serve as a mirror for the databases you want to protect. Configure mirroring in high safety mode.
3. Configure Site Recovery on the on-premises site, for ([Hyper-V](site-recovery-hyper-v-site-to-azure.md) or [VMware VMs/physical servers](site-recovery-vmware-to-azure-classic.md).
4. Use Site Recovery replication to replicate the new SQL Server instance to Azure. Since it's a high safety mirror copy, it will be synchronized with the primary cluster, but it will be replicated to Azure using Site Recovery replication.


![Standard cluster](./media/site-recovery-sql/BCDRStandaloneClusterLocal.png)

### Failback considerations

For SQL Server Standard clusters, failback after an unplanned failover requires a SQL server backup and restore, from the mirror instance to the original cluster, with reestablishment of the mirror.

## Next steps
[Learn more](site-recovery-components.md) about Site Recovery architecture.
