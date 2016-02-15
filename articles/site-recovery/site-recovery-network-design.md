<properties
	pageTitle="Network infrastructure considerations for Site Recovery | Microsoft Azure"
	description="This article discusses practical network design considerations for failover with Site Recovery"
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="02/15/2016"
	ms.author="raynew"/>

#  Deployment considerations for VMM and Site Recovery

The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Machines can be replicated to Azure, or to a secondary on-premises data center. For a quick overview read [What is Azure Site Recovery?](site-recovery-overview.md).


## Overview

This article is helps you to architect and implement a BCDR solution and infrastructure that includes System Center VMM and Azure Site Recovery.

The purpose of your BCDR strategy is to keep your business applications running, and to  restore failed workloads and services so the organization can quickly resume normal operations. Developing disaster recovery strategies is challenging, due to the inherent difficulty of predicting unforeseen events, and the high cost of implementing adequate protection against far-reaching failures. Site Recovery helps you implement protection and failover from your primary data center to a secondary data center or to Azure) by initially copying (replicating) your primary data, and then periodically refreshing the replicas.

As a crucial part of your BCDR planning you need to define your Recovery Time Objective (RTO) and Recovery Point Objective (RPO) so that can you get your organization data back online as quickly as possible (with a low RTO) and with minimum data loss (low RPO). The network design in your organization is a potential bottleneck to your RTO and RPO objectives and solid design planning can help avoid this bottleneck.


If you're deploying Site Recovery to replicate Hyper-V VMs in VMM clouds you'll need to consider how VMM integrates into your Site Recovery replication and failover strategy.  

## Integrating a standalone VMM server

In this topology, you'll deploy a VMM server on a virtual machine in the primary site, and then replicate this virtual machine to a secondary site with Site Recovery and Hyper-V Replica. You might consider installing the VMM server and its supporting SQL Server on the same virtual machine can reduce downtime, because only one VM has to be instantiated. When the VMM service is using a remote SQL Server you'll need to recover the SQL Server instance before recovering the VMM server.

To deploy a single VMM on a VM with Hyper-V Replica:

1. Set up the VMM on a VM with SQL Server installed.
2. Add the hosts to be managed to clouds on this VMM server.
3. Log in to the Azure portal and then configure clouds for protection.
4. Enable replication for all the VMs that need to be protected by the VMM server.
5. Go to the Hyper-V Manager console, choose Hyper-V Replica, and then enable replication on the VMM VM.
6. Ensure that the VMM VM is not added to the clouds that are protected by ASR service so that the Hyper-V Replication settings are not overridden by ASR.

In the event of a disaster, workloads can be recovered as follows:

1. Fail over the replica VMM VM to the recovery site, using Hyper-V Manager.
2. After the VMM VM has been recovered, the user can login to the Hyper-V Recovery Manager from the secondary site.
3. After the unplanned failover is complete, the user can access all the resources at the primary site.
4. Note that the VMM VM will need to be failed over manually to the secondary site before workloads can be failed over.


### Integrating a VMM cluster


[Deploying VMM in a cluster](https://technet.microsoft.com/library/gg610675.aspx) provides high availability and protection against hardware failover. If you're deploying your VMM cluster with Site Recovery note that:

- The VMM server should be deployed in a stretched cluster across geographically separate sites.
- The SQL Server database used by VMM should be protected with SQL Server AlwaysOn availability groups with a replica on the secondary site.
- If disaster occurs the VMM server and its corresponding SQL Server will automatically fail over to the recovery site. You can then fail over workloads using Site Recovery.

	![Stretched VMM cluster](./media/site-recovery-network-design/network-design1.png)


## Next Steps

[Learn](site-recovery-network-mapping.md) how Site Recovery maps source and target networks.
