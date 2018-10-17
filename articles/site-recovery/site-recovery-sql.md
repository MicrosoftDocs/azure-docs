---
title: Replicate applications with SQL Server and Azure Site Recovery | Microsoft Docs
description: This article describes how to replicate SQL Server using Azure Site Recovery for SQL Server disaster capabilities.
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: conceptual
ms.date: 07/22/2018
ms.author: raynew

---
# Protect SQL Server using SQL Server disaster recovery and Azure Site Recovery

This article describes how to protect the SQL Server back end of an application using a combination of SQL Server business continuity and disaster recovery (BCDR) technologies, and [Azure Site Recovery](site-recovery-overview.md).

Before you start, make sure you understand SQL Server disaster recovery capabilities, including failover clustering, Always On availability groups, database mirroring, and log shipping.


## SQL Server deployments

Many workloads use SQL Server as a foundation, and it can be integrated with apps such as SharePoint, Dynamics, and SAP, to implement data services.  SQL Server can be deployed in a number of ways:

* **Standalone SQL Server**: SQL Server and all databases are hosted on a single machine (physical or a virtual). When virtualized, host clustering is used for local high availability. Guest-level high availability isn't implemented.
* **SQL Server Failover Clustering Instances (Always On FCI)**: Two or more nodes running SQL Server instanced with shared disks are configured in a Windows Failover cluster. If a node is down, the cluster can fail SQL Server over to another instance. This setup is typically used to implement high availability at a primary site. This deployment doesn't protect against failure or outage in the shared storage layer. A shared disk can be implemented using iSCSI, fiber channel or shared vhdx.
* **SQL Always On Availability Groups**: Two or more nodes are set up in a shared nothing cluster, with SQL Server databases configured in an availability group, with synchronous replication and automatic failover.

 This article leverages the following native SQL disaster recovery technologies for recovering databases to a remote site:

* SQL Always On Availability Groups, to provide for disaster recovery for SQL Server 2012 or 2014 Enterprise editions.
* SQL database mirroring in high safety mode, for SQL Server Standard edition (any version), or for SQL Server 2008 R2.

## Site Recovery support

### Supported scenarios
Site Recovery can protect SQL Server as summarized in the table.

**Scenario** | **To a secondary site** | **To Azure**
--- | --- | ---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes
**Physical server** | Yes | Yes
**Azure**|NA| Yes

### Supported SQL Server versions
These SQL Server versions are supported, for the supported scenarios:

* SQL Server 2016 Enterprise and Standard
* SQL Server 2014 Enterprise and Standard
* SQL Server 2012 Enterprise and Standard
* SQL Server 2008 R2 Enterprise and Standard

### Supported SQL Server integration

Site Recovery can be integrated with native SQL Server BCDR technologies summarized in the table, to provide a disaster recovery solution.

**Feature** | **Details** | **SQL Server** |
--- | --- | ---
**Always On availability group** | Multiple standalone instances of SQL Server each run in a failover cluster that has multiple nodes.<br/><br/>Databases can be grouped into failover groups that can be copied (mirrored) on SQL Server instances so that no shared storage is needed.<br/><br/>Provides disaster recovery between a primary site and one or more secondary sites. Two nodes can be set up in a shared nothing cluster with SQL Server databases configured in an availability group with synchronous replication and automatic failover. | SQL Server 2016, SQL Server 2014 & SQL Server 2012 Enterprise edition
**Failover clustering (Always On FCI)** | SQL Server leverages Windows failover clustering for high availability of on-premises SQL Server workloads.<br/><br/>Nodes running instances of SQL Server with shared disks are configured in a failover cluster. If an instance is down the cluster fails over to different one.<br/><br/>The cluster doesn't protect against failure or outages in shared storage. The shared disk can be implemented with iSCSI, fiber channel, or shared VHDXs. | SQL Server Enterprise editions<br/><br/>SQL Server Standard edition (limited to two nodes only)
**Database mirroring (high safety mode)** | Protects a single database to a single secondary copy. Available in both high safety (synchronous) and high performance (asynchronous) replication modes. Doesn’t require a failover cluster. | SQL Server 2008 R2<br/><br/>SQL Server Enterprise all editions
**Standalone SQL Server** | The SQL Server and database are hosted on a single server (physical or virtual). Host clustering is used for high availability if the server is virtual. No guest-level high availability. | Enterprise or Standard edition

## Deployment recommendations

This table summarizes our recommendations for integrating SQL Server BCDR technologies with Site Recovery.

| **Version** | **Edition** | **Deployment** | **On-prem to on-prem** | **On-prem to Azure** |
| --- | --- | --- | --- | --- |
| SQL Server 2016, 2014 or 2012 |Enterprise |Failover cluster instance |Always On availability groups |Always On availability groups |
|| Enterprise |Always On availability groups for high availability |Always On availability groups |Always On availability groups | |
|| Standard |Failover cluster instance (FCI) |Site Recovery replication with local mirror |Site Recovery replication with local mirror | |
|| Enterprise or Standard |Standalone |Site Recovery replication |Site Recovery replication | |
| SQL Server 2008 R2 or 2008 |Enterprise or Standard |Failover cluster instance (FCI) |Site Recovery replication with local mirror |Site Recovery replication with local mirror |
|| Enterprise or Standard |Standalone |Site Recovery replication |Site Recovery replication | |
| SQL Server (Any version) |Enterprise or Standard |Failover cluster instance - DTC application |Site Recovery replication |Not Supported |

## Deployment prerequisites

* An on-premises SQL Server deployment, running a supported SQL Server version. Typically, you also need Active Directory for your SQL server.
* The requirements for the scenario you want to deploy. Learn more about support requirements for [replication to Azure](site-recovery-support-matrix-to-azure.md) and [on-premises](site-recovery-support-matrix.md), and [deployment prerequisites](site-recovery-prereq.md).

## Set up Active Directory

Set up Active Directory, in the secondary recovery site, for SQL Server to run properly.

* **Small enterprise**—With a small number of applications, and single domain controller for the on-premises site, if you want to fail over the entire site, we recommend you use Site Recovery replication to replicate the domain controller to the secondary datacenter, or to Azure.
* **Medium to large enterprise**—If you have a large number of applications, an Active Directory forest, and you want to fail over by application or workload, we recommend you set up an additional domain controller in the secondary datacenter, or in Azure. If you're using Always On availability groups to recover to a remote site, we recommend you set up another additional domain controller on the secondary site or in Azure, to use for the recovered SQL Server instance.

The instructions in this article presume that a domain controller is available in the secondary location. [Read more](site-recovery-active-directory.md) about protecting Active Directory with Site Recovery.


## Integrate with SQL Server Always On for replication to Azure

Here's what you need to do:

1. Import scripts into your Azure Automation account. This contains the scripts to failover SQL Availability Group in a [Resource Manager virtual machine](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/asr-automation-recovery/scripts/ASR-SQL-FailoverAG.ps1) and a [Classic virtual machine](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/asr-automation-recovery/scripts/ASR-SQL-FailoverAGClassic.ps1).

	[![Deploy to Azure](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/c4803408-340e-49e3-9a1f-0ed3f689813d.png)](https://aka.ms/asr-automationrunbooks-deploy)


1. Add ASR-SQL-FailoverAG as a pre action of the first group of the recovery plan.

1. Follow the instructions available in the script to create an automation variable to provide the name of the availability groups.

### Steps to do a test failover

SQL Always On doesn’t natively support test failover. Therefore, we recommend the following:

1. Set up [Azure Backup](../backup/backup-azure-arm-vms.md) on the virtual machine that hosts the availability group replica in Azure.

1. Before triggering test failover of the recovery plan, recover the virtual machine from the backup taken in the previous step.

	![Restore from Azure Backup ](./media/site-recovery-sql/restore-from-backup.png)

1. [Force a quorum](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/force-a-wsfc-cluster-to-start-without-a-quorum#PowerShellProcedure) in the virtual machine restored from backup.

1. Update IP of the listener to an IP available in the test failover network.

	![Update Listener IP](./media/site-recovery-sql/update-listener-ip.png)

1. Bring listener online.

	![Bring Listener Online](./media/site-recovery-sql/bring-listener-online.png)

1. Create a load balancer with one IP created under frontend IP pool corresponding to each availability group listener and with the SQL virtual machine added in the backend pool.

	 ![Create Load Balancer - Frontend IP pool ](./media/site-recovery-sql/create-load-balancer1.png)

	![Create Load Balancer - Backend pool ](./media/site-recovery-sql/create-load-balancer2.png)

1. Do a test failover of the recovery plan.

### Steps to do a failover

Once you have added the script in the recovery plan and validated the recovery plan by doing a test failover, you can do failover of the recovery plan.


## Integrate with SQL Server Always On for replication to a secondary on-premises site

If the SQL Server is using availability groups for high availability (or an FCI), we recommend using availability groups on the recovery site as well. Note that this applies to apps that don't use distributed transactions.

1. [Configure databases](https://msdn.microsoft.com/library/hh213078.aspx) into availability groups.
1. Create a virtual network on the secondary site.
1. Set up a site-to-site VPN connection between the virtual network, and the primary site.
1. Create a virtual machine on the recovery site, and install SQL Server on it.
1. Extend the existing Always On availability groups to the new SQL Server VM. Configure this SQL Server instance as an asynchronous replica copy.
1. Create an availability group listener, or update the existing listener to include the asynchronous replica virtual machine.
1. Make sure that the application farm is set up using the listener. If it's setup up using the database server name, update it to use the listener, so you don't need to reconfigure it after the failover.

For applications that use distributed transactions, we recommend you deploy Site Recovery with [VMware/physical server site-to-site replication](site-recovery-vmware-to-vmware.md).

### Recovery plan considerations
1. Add this sample script to the VMM library, on the primary and secondary sites.

        Param(
        [string]$SQLAvailabilityGroupPath
        )
        import-module sqlps
        Switch-SqlAvailabilityGroup -Path $SQLAvailabilityGroupPath -AllowDataLoss -force

1. When you create a recovery plan for the application, add a pre action to Group-1 scripted step, that invokes the script to fail over availability groups.

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
1. Configure the instance to serve as a mirror for the databases you want to protect. Configure mirroring in high safety mode.
1. Configure Site Recovery on the on-premises site, for ([Hyper-V](site-recovery-hyper-v-site-to-azure.md) or [VMware VMs/physical servers)](site-recovery-vmware-to-azure-classic.md).
1. Use Site Recovery replication to replicate the new SQL Server instance to Azure. Since it's a high safety mirror copy, it will be synchronized with the primary cluster, but it will be replicated to Azure using Site Recovery replication.


![Standard cluster](./media/site-recovery-sql/standalone-cluster-local.png)

### Failback considerations

For SQL Server Standard clusters, failback after an unplanned failover requires a SQL server backup and restore, from the mirror instance to the original cluster, with reestablishment of the mirror.

## Next steps
[Learn more](site-recovery-components.md) about Site Recovery architecture.
