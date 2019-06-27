---
title: Set up disaster recovery for SQL Server with SQL Server and Azure Site Recovery | Microsoft Docs
description: This article describes how to set up disaster recovery for SQL Server using SQL Server and Azure Site Recovery .
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 06/27/2019
ms.author: sutalasi

---
# Set up disaster recovery for SQL Server

This article describes how to protect the SQL Server back end of an application using a combination of SQL Server business continuity and disaster recovery (BCDR) technologies, and [Azure Site Recovery](site-recovery-overview.md).

Before you start, make sure you understand SQL Server disaster recovery capabilities, including failover clustering, Always On availability groups, database mirroring, and log shipping.

<!---
## SQL Server deployments

Many workloads use SQL Server as a foundation, and it can be integrated with apps such as SharePoint, Dynamics, and SAP, to implement data services.  SQL Server can be deployed in a number of ways:

* **Standalone SQL Server**: SQL Server and all databases are hosted on a single machine (physical or a virtual). When virtualized, host clustering is used for local high availability. Guest-level high availability isn't implemented.
* **SQL Server Failover Clustering Instances (Always On FCI)**: Two or more nodes running SQL Server instanced with shared disks are configured in a Windows Failover cluster. If a node is down, the cluster can fail SQL Server over to another instance. This setup is typically used to implement high availability at a primary site. This deployment doesn't protect against failure or outage in the shared storage layer. A shared disk can be implemented using iSCSI, fiber channel or shared vhdx.
* **SQL Always On Availability Groups**: Two or more nodes are set up in a shared nothing cluster, with SQL Server databases configured in an availability group, with synchronous replication and automatic failover.

All the above deployment modes are available for Azure IaaS VMs as well. Following are few advanced deployments available in Azure:

* **SQL Database Managed Instances**: A managed instance in Azure SQL Database is a fully managed SQL Server Database Engine Instance hosted in Azure. It is designed for customers looking to migrate a large number of apps from on-premises or IaaS, self-built, or ISV provided environment to fully managed PaaS cloud environment, with as low migration effort as possible.
* **SQL Server PaaS**: Azure SQL Database is a fully managed Platform as a Service (PaaS) Database Engine that handles most of the database management functions such as upgrading, patching, backups, and monitoring without user involvement.
* **Elastic Pools of SQL Database**: SQL Database elastic pools are a simple, cost-effective solution for managing and scaling multiple databases that have varying and unpredictable usage demands.
--->

## SQL Server BCDR technologies

Site Recovery can be integrated with native SQL Server BCDR technologies summarized in the table, to provide a disaster recovery solution.

**Feature** | **Details** | **SQL Server Deployment Model** |
--- | --- | ---
**Always On availability group** | Multiple standalone instances of SQL Server each run in a failover cluster that has multiple nodes.<br/><br/>Databases can be grouped into failover groups that can be copied (mirrored) on SQL Server instances so that no shared storage is needed.<br/><br/>Provides disaster recovery between a primary site and one or more secondary sites. Two nodes can be set up in a shared nothing cluster with SQL Server databases configured in an availability group with synchronous replication and automatic failover. | SQL Server 2017, SQL Server 2016, SQL Server 2014 & SQL Server 2012 Enterprise edition <br/><br/>SQL Server Enterprise editions
**Failover clustering (Always On FCI)** | SQL Server leverages Windows failover clustering for high availability of on-premises SQL Server workloads.<br/><br/>Nodes running instances of SQL Server with shared disks or storage spaces direct are configured in a failover cluster. If an instance is down the cluster fails over to different one.<br/><br/>The cluster doesn't protect against failure or outages in shared storage. | SQL Server Enterprise editions<br/><br/>SQL Server Standard edition (limited to two nodes only)
**Database mirroring (high safety mode)** | Protects a single database to a single secondary copy. Available in both high safety (synchronous) and high performance (asynchronous) replication modes. Doesn’t require a failover cluster. | SQL Server 2008 R2 or older (Not supported for SQL Server 2008 or SQL Server 2008 R2 on an Azure VM) <br/><br/>SQL Server Enterprise editions
**Standalone SQL Server** | The SQL Server and database are hosted on a single server (physical or virtual). Host clustering is used for high availability if the server is virtual. No guest-level high availability. | Enterprise or Standard edition
**Active Geo-replication** | Active geo-replication is Azure SQL Database feature that allows you to create readable secondary databases of individual databases on a SQL Database server in the same or different data center (region). <br/><br/> Active geo-replication leverages the Always On technology of SQL Server to asynchronously replicate committed transactions on the primary database to a secondary database using snapshot isolation.| Elastic pools, SQL database servers
**Auto-failover groups** | Auto-failover groups is a SQL Database feature that allows you to manage replication and failover of a group of databases on a SQL Database server or all databases in a managed instance to another region. <br><br/>You can initiate failover manually or you can delegate it to the SQL Database service based on a user-defined policy. The latter option allows you to automatically recover multiple related databases in a secondary region after a catastrophic failure or other unplanned event that results in full or partial loss of the SQL Database service’s availability in the primary region.  | SQL Database Managed Instance, Elastic pools, SQL database servers

## DR recommendations for integration with Azure Site Recovery

Few important considerations when protecting SQL workloads with Azure Site Recovery:
1. Azure Site Recovery is application agnostic and hence, any version of SQL server that is deployed on a supported operating system can be protected by Azure Site Recovery. [Learn more](vmware-physical-azure-support-matrix#replicated-machines.md).
2. Ensure that the data change rate (Write bytes per sec) observed on the machine is within [Site Recovery limits](vmware-physical-azure-support-matrix.md#churn-limits). For windows machines, you can view this under Performance tab on Task Manager. Observe Write speed for each disk.
3. Azure Site Recovery supports replication of Failover Cluster Instances on Storage Spaces Direct. [Learn more](azure-to-azure-how-to-enable-replication-s2d-vms.md)
4. Azure Site Recovery can be leveraged for both application and crash consistent recovery points. Application consistent snapshot is taken every 1 hour. [Read more](https://azure.microsoft.com/en-au/support/legal/sla/site-recovery/v1_2/) to learn about the RTO SLA provided by Azure Site Recovery. Note that Azure Site Recovery does not provide Application consistent recovery points for Linux machines. 

The tables below summarize our recommendations **to achieve lowest RTO**. However, you can choose to use Site Recovery for any deployment, including Standalone SQL server at Azure, Hyper-V, VMware or Physical. Please follow the [guidance](site-recovery-sql.md#how-to-protect-a-sql-server-cluster-standard-editionsql-server-2008-r2) at the end of the document on how to protect SQL Server Cluster with Azure Site Recovery.

**Azure to Azure**

**Always On** | **FCI (Non-DTC application)** | **Active Geo-Replication** | **Auto-failover Groups** | **Recommendation for lowest RTO**
--- | --- | --- | --- | --- | ---
Yes | Yes | Yes | Yes | Auto-failover groups
Yes | Yes | Yes | No | Active Geo-replication
Yes | Yes | No | No | Always On availability groups
Yes | No | No | No | Always On availability groups
No | Yes | No | No | Site recovery replication
No | No | No | No | Site recovery replication

Learn more about the [business continuity](../sql-database/sql-database-business-continuity.md) and [high availability](../sql-database/sql-database-high-availability.md) options to recover SQL Server in Azure Virtual Machines.

**On-premises to Azure**

**Always On** | **FCI (Non-DTC application)** | **Recommendation for lowest RTO** | 
--- | --- | --- | ---
Yes |Yes | Always On availability groups
No | Yes | Site Recovery replication with local mirror 
No | No | Site recovery replication 

[Learn more](../virtual-machines/windows/sql/virtual-machines-windows-sql-high-availability-dr.md#hybrid-it-disaster-recovery-solutions) about the high availability options to recover SQL Server in Azure Virtual Machines. 

## Disaster Recovery of Application

**Azure Site Recovery orchestrates the test failover and failover of your entire application with the help of Recovery Plans. There are some pre-requisites to ensure Recovery Plan is fully customized as per your need.** 

Any SQL Server deployment typically needs an Active Directory. It also needs connectivity for your application tier.

### Step 1: Set up Active Directory

Set up Active Directory, in the secondary recovery site, for SQL Server to run properly.

* **Small enterprise**—With a small number of applications, and single domain controller for the on-premises site, if you want to fail over the entire site, we recommend you use Site Recovery replication to replicate the domain controller to the secondary datacenter, or to Azure.
* **Medium to large enterprise**—If you have a large number of applications, an Active Directory forest, and you want to fail over by application or workload, we recommend you set up an additional domain controller in the secondary datacenter, or in Azure. If you're using Always On availability groups to recover to a remote site, we recommend you set up another additional domain controller on the secondary site or in Azure, to use for the recovered SQL Server instance.

The instructions in this article presume that a domain controller is available in the secondary location. [Read more](site-recovery-active-directory.md) about protecting Active Directory with Site Recovery.

### Step 2: Ensure connectivity with other application tier(s)

Understand how you can design applications for connectivity considerations with a couple of examples:
* [Design an application for cloud disaster recovery](../sql-database/sql-database-designing-cloud-solutions-for-disaster-recovery.md)
* [Elastic pool Disaster Recovery strategies](../sql-database/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md)

### Step 3: Integrate with Always On, Active-Geo replication or Auto-failover groups for application failover

BCDR technologies Always On, Active-Geo replication and auto-failover groups have secondary replicas of SQL server running in target Azure region. Hence, the first step for your application failover is to make this replica as Primary (assuming you already have a domain controller in secondary). This step may not be necessary if you choose to do an auto-failover. Only after the database failover is completed, you should failover your web or application tiers.

[Note!] If you have protected the SQL machines with Azure Site Recovery, you just need to create a recovery group of these machines and add their failover in the recovery plan.

[Create a Recovery Plan](site-recovery-create-recovery-plans.md) with application and web tier virtual machines. Follow the below steps to add failover of database tier:

1. Import scripts into your Azure Automation account. This contains the scripts to failover SQL Availability Group in a [Resource Manager virtual machine](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/asr-automation-recovery/scripts/ASR-SQL-FailoverAG.ps1) and a [Classic virtual machine](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/asr-automation-recovery/scripts/ASR-SQL-FailoverAGClassic.ps1).

	[![Deploy to Azure](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/c4803408-340e-49e3-9a1f-0ed3f689813d.png)](https://aka.ms/asr-automationrunbooks-deploy)


1. Add ASR-SQL-FailoverAG as a pre action of the first group of the recovery plan.

1. Follow the instructions available in the script to create an automation variable to provide the name of the availability groups.

### Step 4: Conduct a test failover

Some BCDR technologies like SQL Always On don’t natively support test failover. Therefore, we recommend the following **only when integrating with such technologies**:

1. Set up [Azure Backup](../backup/backup-azure-arm-vms.md) on the virtual machine that hosts the availability group replica in Azure.

1. Before triggering test failover of the recovery plan, recover the virtual machine from the backup taken in the previous step.

	![Restore from Azure Backup](./media/site-recovery-sql/restore-from-backup.png)

1. [Force a quorum](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/force-a-wsfc-cluster-to-start-without-a-quorum#PowerShellProcedure) in the virtual machine restored from backup.

1. Update IP of the listener to an IP available in the test failover network.

	![Update Listener IP](./media/site-recovery-sql/update-listener-ip.png)

1. Bring listener online.

	![Bring Listener Online](./media/site-recovery-sql/bring-listener-online.png)

1. Create a load balancer with one IP created under frontend IP pool corresponding to each availability group listener and with the SQL virtual machine added in the backend pool.

	 ![Create Load Balancer - Frontend IP pool](./media/site-recovery-sql/create-load-balancer1.png)

	![Create Load Balancer - Backend pool](./media/site-recovery-sql/create-load-balancer2.png)

1. Do a test failover of the recovery plan.

## Steps to do a failover

Once you have added the script in the recovery plan and validated the recovery plan by doing a test failover, you can do failover of the recovery plan.

## How to protect a SQL Server cluster (standard edition/SQL Server 2008 R2)

For a cluster running SQL Server Standard edition, or SQL Server 2008 R2, we recommend you use Site Recovery replication to protect SQL Server.

### Azure to Azure and On-premises to Azure

Site Recovery doesn't provide guest cluster support when replicating to an Azure region. SQL Server also doesn't provide a low-cost disaster recovery solution for Standard edition. In this scenario, we recommend you protect the SQL Server cluster to a standalone SQL Server in primary location, and recover it in the secondary.

1. Configure an additional standalone SQL Server instance on the primary Azure region or at on-premises site.
1. Configure the instance to serve as a mirror for the databases you want to protect. Configure mirroring in high safety mode.
1. Configure Site Recovery on the primary site ([Azure](azure-to-azure-tutorial-enable-replication.md), [Hyper-V](site-recovery-hyper-v-site-to-azure.md) or [VMware VMs/physical servers)](site-recovery-vmware-to-azure-classic.md).
1. Use Site Recovery replication to replicate the new SQL Server instance to secondary site. Since it's a high safety mirror copy, it will be synchronized with the primary cluster, but it will be replicated using Site Recovery replication.


![Standard cluster](./media/site-recovery-sql/standalone-cluster-local.png)

### Failback considerations

For SQL Server Standard clusters, failback after an unplanned failover requires a SQL server backup and restore, from the mirror instance to the original cluster, with reestablishment of the mirror.

## Frequently Asked Questions

### How does SQL get licensed when protected with Azure Site Recovery?
Azure Site Recovery replication for SQL Server is covered under the Software Assurance – Disaster Recovery benefit, for all Azure Site Recovery scenarios (on-premises to Azure disaster recovery, or cross-region Azure IaaS disaster recovery). [Read more](https://azure.microsoft.com/en-in/pricing/details/site-recovery/)

### Will Azure Site Recovery support my SQL version?
Azure Site Recovery is application agnostic. Hence, any version of SQL server that is deployed on a supported operating system can be protected by Azure Site Recovery. [Learn more](vmware-physical-azure-support-matrix#replicated-machines.md)

## Next steps
[Learn more](site-recovery-components.md) about Site Recovery architecture.
