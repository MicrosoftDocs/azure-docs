---
title: Set up disaster recovery for SQL Server with SQL Server and Azure Site Recovery | Microsoft Docs
description: This article describes how to set up disaster recovery for SQL Server using SQL Server and Azure Site Recovery .
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 06/30/2019
ms.author: sutalasi

---
# Set up disaster recovery for SQL Server

This article describes how to protect the SQL Server back end of an application using a combination of SQL Server business continuity and disaster recovery (BCDR) technologies, and [Azure Site Recovery](site-recovery-overview.md).

Before you start, make sure you understand SQL Server disaster recovery capabilities, including failover clustering, Always On availability groups, database mirroring, log shipping, active-geo replication and auto-failover groups.

## DR recommendation for integration of SQL Server BCDR technologies with Site Recovery

Choice of a BCDR technology to recovery SQL servers should be based on your RTO and RPO needs as per the below table. Once that choice is made, Site Recovery can be integrated with the failover operation of that technology to orchestrate recovery of your entire application.

**Deployment Type** | **BCDR Technology** | **Expected RTO for SQL** | **Expected RPO for SQL** |
--- | --- | --- | ---
SQL Server on Azure IaaS VM or at on-premises| **[Always On Availability Group](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server?view=sql-server-2017)** | Equivalent to the time taken to make the Secondary replica as Primary | Replication is asynchronous to the secondary replica, hence there is some data loss.
SQL Server on Azure IaaS VM or at on-premises| **[Failover clustering (Always On FCI)](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/windows-server-failover-clustering-wsfc-with-sql-server?view=sql-server-2017)** | Equivalent to the time taken to failover between the nodes | It uses shared storage, hence the same view of storage instance is available on failover.
SQL Server on Azure IaaS VM or at on-premises| **[Database mirroring (high-performance mode)](https://docs.microsoft.com/sql/database-engine/database-mirroring/database-mirroring-sql-server?view=sql-server-2017)** | Equivalent to the time taken to forcing service, which uses the mirror server as a warm standby server. | Replication is asynchronous. The mirror database might lag somewhat behind the principal database. The gap is typically small, howvever, can become substantial if the principal or mirror server's system is under a heavy load.<br></br>Log shipping can be a supplement to database mirroring and is a favorable alternative to asynchronous database mirroring
SQL as PaaS on Azure<br></br>(Elastic pools, SQL database servers) | **Active Geo-replication** | 30 seconds once it is triggered<br></br>When failover is activated to one of the secondary databases, all other secondaries are automatically linked to the new primary. | RPO of 5 seconds<br></br>Active geo-replication leverages the Always On technology of SQL Server to asynchronously replicate committed transactions on the primary database to a secondary database using snapshot isolation. <br></br>The secondary data is guaranteed to never have partial transactions.
SQL as PaaS configured with Active geo-replication on Azure<br></br>(SQL Database Managed Instance, Elastic pools, SQL database servers) | **Auto-failover groups** | RTO of 1 hour | RPO of 5 seconds<br></br>Auto-failover groups provide the group semantics on top of active geo-replication but the same asynchronous replication mechanism is used.
SQL Server on Azure IaaS VM or at on-premises| **Replication with Azure Site Recovery** | Typically less than 15 minutes. [Read more](https://azure.microsoft.com/support/legal/sla/site-recovery/v1_2/) to learn about the RTO SLA provided by Azure Site Recovery. | 1 hour for application consistency and 5 minutes for crash consistency. 

> [!NOTE]
> A few important considerations when protecting SQL workloads with Azure Site Recovery:
> * Azure Site Recovery is application agnostic and hence, any version of SQL server that is deployed on a supported operating system can be protected by Azure Site Recovery. [Learn more](vmware-physical-azure-support-matrix.md#replicated-machines).
> * You can choose to use Site Recovery for any deployment at Azure, Hyper-V, VMware or Physical infrastructure. Please follow the [guidance](site-recovery-sql.md#how-to-protect-a-sql-server-cluster-standard-editionsql-server-2008-r2) at the end of the document on how to protect SQL Server Cluster with Azure Site Recovery.
> * Ensure that the data change rate (Write bytes per sec) observed on the machine is within [Site Recovery limits](vmware-physical-azure-support-matrix.md#churn-limits). For windows machines, you can view this under Performance tab on Task Manager. Observe Write speed for each disk.
> * Azure Site Recovery supports replication of Failover Cluster Instances on Storage Spaces Direct. [Learn more](azure-to-azure-how-to-enable-replication-s2d-vms.md).
 

## Disaster recovery of application

**Azure Site Recovery orchestrates the test failover and failover of your entire application with the help of Recovery Plans.** 

There are some pre-requisites to ensure Recovery Plan is fully customized as per your need. Any SQL Server deployment typically needs an Active Directory. It also needs connectivity for your application tier.

### Step 1: Set up Active Directory

Set up Active Directory, in the secondary recovery site, for SQL Server to run properly.

* **Small enterprise**—With a small number of applications, and single domain controller for the on-premises site, if you want to fail over the entire site, we recommend you use Site Recovery replication to replicate the domain controller to the secondary datacenter, or to Azure.
* **Medium to large enterprise**—If you have a large number of applications, an Active Directory forest, and you want to fail over by application or workload, we recommend you set up an additional domain controller in the secondary datacenter, or in Azure. If you're using Always On availability groups to recover to a remote site, we recommend you set up another additional domain controller on the secondary site or in Azure, to use for the recovered SQL Server instance.

The instructions in this article presume that a domain controller is available in the secondary location. [Read more](site-recovery-active-directory.md) about protecting Active Directory with Site Recovery.

### Step 2: Ensure connectivity with other application tier(s) and web tier

Ensure that once the database tier is up and running in target Azure region, you have connectivity with the application and the web tier. Necessary steps should be taken in advance to validate connectivity with test failover.

Understand how you can design applications for connectivity considerations with a couple of examples:
* [Design an application for cloud disaster recovery](../sql-database/sql-database-designing-cloud-solutions-for-disaster-recovery.md)
* [Elastic pool Disaster Recovery strategies](../sql-database/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md)

### Step 3: Integrate with Always On, Active-Geo replication or Auto-failover groups for application failover

BCDR technologies Always On, Active-Geo replication and auto-failover groups have secondary replicas of SQL server running in target Azure region. Hence, the first step for your application failover is to make this replica as Primary (assuming you already have a domain controller in secondary). This step may not be necessary if you choose to do an auto-failover. Only after the database failover is completed, you should failover your web or application tiers.

> [!NOTE] 
> If you have protected the SQL machines with Azure Site Recovery, you just need to create a recovery group of these machines and add their failover in the recovery plan.

[Create a Recovery Plan](site-recovery-create-recovery-plans.md) with application and web tier virtual machines. Follow the below steps to add failover of database tier:

1. Import scripts into your Azure Automation account. This contains the scripts to failover SQL Availability Group in a [Resource Manager virtual machine](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/asr-automation-recovery/scripts/ASR-SQL-FailoverAG.ps1) and a [Classic virtual machine](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/asr-automation-recovery/scripts/ASR-SQL-FailoverAGClassic.ps1).

	[![Deploy to Azure](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/c4803408-340e-49e3-9a1f-0ed3f689813d.png)](https://aka.ms/asr-automationrunbooks-deploy)


1. Add ASR-SQL-FailoverAG as a pre action of the first group of the recovery plan.

1. Follow the instructions available in the script to create an automation variable to provide the name of the availability groups.

### Step 4: Conduct a test failover

Some BCDR technologies like SQL Always On don’t natively support test failover. Therefore, we recommend the following approach **only when integrating with such technologies**:

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

1. Add failover of your application tier, followed by web tier in this recovery plan in subsequent recovery groups. 
1. Do a test failover of the recovery plan to test end-to-end failover of application.

## Steps to do a failover

Once you have added the script in the recovery plan in Step 3 and validated it by doing a test failover with a specialized approach in Step 4, you can do failover of the recovery plan created in Step 3.

Note that the failover steps for application and web tiers should be the same in both test failover and failover recovery plans.

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
Azure Site Recovery replication for SQL Server is covered under the Software Assurance – Disaster Recovery benefit, for all Azure Site Recovery scenarios (on-premises to Azure disaster recovery, or cross-region Azure IaaS disaster recovery). [Read more](https://azure.microsoft.com/pricing/details/site-recovery/)

### Will Azure Site Recovery support my SQL version?
Azure Site Recovery is application agnostic. Hence, any version of SQL server that is deployed on a supported operating system can be protected by Azure Site Recovery. [Learn more](vmware-physical-azure-support-matrix.md#replicated-machines)

## Next steps
* [Learn more](site-recovery-components.md) about Site Recovery architecture.
* For SQL Servers in Azure, learn more about [high availability solutions](../virtual-machines/windows/sql/virtual-machines-windows-sql-high-availability-dr.md#azure-only-high-availability-solutions) for recovery in secondary Azure region.
* For SQL Database in Azure, learn more about the [business continuity](../sql-database/sql-database-business-continuity.md) and [high availability](../sql-database/sql-database-high-availability.md) options for recovery in secondary Azure region.
* For SQL server machines at on-premises, [learn more](../virtual-machines/windows/sql/virtual-machines-windows-sql-high-availability-dr.md#hybrid-it-disaster-recovery-solutions) about the high availability options for recovery in Azure Virtual Machines.
