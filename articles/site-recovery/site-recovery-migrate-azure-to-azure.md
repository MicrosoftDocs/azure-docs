<properties
	pageTitle="Migrate Azure IaaS virtual machines from one Azure region to another with Site Recovery | Microsoft Azure"
	description="Use Azure Site Recovery to migrate Azure IaaS virtual machines from one Azure region to another."
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
	ms.date="02/22/2016"
	ms.author="raynew"/>

#  Migrate Azure IaaS virtual machines between Azure regions with Site Recovery

The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Machines can be replicated to Azure, or to a secondary on-premises data center. For a quick overview read [What is Azure Site Recovery?](site-recovery-overview.md).

## Overview

This article describes how to use Site Recovery to migrate or fail over Windows instances running in AWS to Azure. It summarizes the steps that are described in full in [Replicate VMware virtual machines or physical servers to Azure](site-recovery-vmware-to-azure-classic.md). The linked article is the latest enhanced version of scenario that replicates VMware VMs or Windows/Linux physical servers to Azure. We suggest you follow the linked article for detailed instructions on each step in the deployment.

>[AZURE.NOTE] For migration between regions you should **no longer use** the instructions in this [legacy article](site-recovery-vmware-to-azure-classic-legacy.md).

## Get started

Here's what you need before you start:

- **Management server**: An on-premises VM running Windows Server 2012 R2 that acts as the management server. You install the Site Recovery components (including the configuration server and process server) on this server. Read more in [management server considerations](site-recovery-vmware-to-azure-classic.md#management-server-considerations) and [on-premises prerequisites](site-recovery-vmware-to-azure-classic.md#on-premises-prerequisites).
- **IaaS virtual machines**: The VMs you want to migrate.

## Deployment steps

1. [Create a vault](site-recovery-vmware-to-azure-classic.md#step-1-create-a-vault).
2. [Deploy a management server](site-recovery-vmware-to-azure-classic.md#Step-5-install-the-management-server).
3. After you've deployed the management server validate that it can communicate with the VMs that you want to migrate.
4. [Create a protection group](site-recovery-vmware-to-azure-classic.md#step-8-create-a-protection-group). A protection group contains protected machines that share the same replication settings. You specify replication settings for a group and they'll be applied to all machines that you add to the group.
5. [Install the Mobility service](site-recovery-vmware-to-azure-classic.md#step-9-install-the-mobility-service). Each VM you want to protect needs the Mobility service installed. This service sends data to the process server. The Mobility service can be installed manually or pushed and installed automatically by the process server when protection for the VM is enabled. Note that firewall rules on IaaS virtual machines that you want to migrate should be configured to allow push installation of this service.
6. [Enable protection for machines](site-recovery-vmware-to-azure-classic.md#step-10-enable-protection-for-a-machine). Add machines you want to protect to the replication group. 
7. You can discover the IaaS virtual machines that you want to migrate to Azure using the private IP address of the virtual machines. Find this address on the virtual machine dashboard in Azure.
8. On the tab for the protection group you created, click **Add Machines** > **Physical Machines**.

	![EC2 discovery](./media/site-recovery-migrate-azure-to-azure/migrate-add-machines.png)

9. Specify the private IP address of the virtual machine.

	![EC2 discovery](./media/site-recovery-migrate-azure-to-azure/migrate-machine-ip.png)
	
After adding a machine to the group,  protection will be enabled and initial replication will run in accordance with the protection group settings.

10. [ Run an unplanned failover](site-recovery-failover.md#run-an-unplanned-failover). After initial replication is complete you can run an unplanned failover from one Azure region to another. Optionally, you can create a recovery plan and run an unplanned failover, to migrate multiple virtual machines between regions. [Learn more](site-recovery-create-recovery-plans.md) about recovery plans.
		
## Next steps

Post any comments or questions in the [Site Recovery forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr)


