<properties
	pageTitle="Migrate Windows virtual machines from Amazon Web Services to Azure with Site Recovery | Microsoft Azure"
	description="This article describes how to migrate Windows virtual machines running in Amazon Web Services (AWA) to Azure using Azure Site Recovery."
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
	ms.workload="backup-recovery"
	ms.date="03/16/2016"
	ms.author="raynew"/>

#  Migrate Windows virtual machines in Amazon Web Services (AWS) to Azure with Azure Site Recovery

## Overview

This article describes how to use Site Recovery to migrate Windows instances running in AWS to Azure. Before you start, note that:

- You can migrate only at this time. That means you can fail over from AWS to Azure but you can't fail them back again.
- This article summarizes and uses many of the steps that are described in full in [Replicate VMware virtual machines or physical servers to Azure](site-recovery-vmware-to-azure-classic.md), which provides the latest enhanced instructions for setting up replication. We suggest you follow this article for detailed instructions as you migrate.
- **You should no longer use** the instructions in this [legacy article](site-recovery-vmware-to-azure-classic-legacy.md).

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr)


## Prerequisites

Here's what you need before you start:

- **Management server**: A VM running Windows Server 2012 R2 that acts as the management server. You install the Site Recovery components (including the configuration server and process server) on this server. Read more in [management server considerations](site-recovery-vmware-to-azure-classic.md#management-server-considerations) and [source prerequisites](site-recovery-vmware-to-azure-classic.md#on-premises-prerequisites).
- **EC2 VM instances**: The instances you want to migrate and then protect.

## Deployment steps

1. [Create a vault](site-recovery-vmware-to-azure-classic.md#step-1-create-a-vault)
2. [Deploy a management server](site-recovery-vmware-to-azure-classic.md#Step-5-install-the-management-server). 
3. After you've deployed the management server validate that it can communicate with the EC2 instances that you want to migrate.
4. [Create a protection group](site-recovery-vmware-to-azure-classic.md#step-8-create-a-protection-group). A protection group contains protected machines that share the same replication settings. You specify replication settings for a group and they'll be applied to all machines that you add to the group. 
5. [Install the Mobility service](site-recovery-vmware-to-azure-classic.md#step-9-install-the-mobility-service). Each VM you want to protect needs the Mobility service installed. This service sends data to the process server. The Mobility service can be installed manually or pushed and installed automatically by the process server when protection for the VM is enabled. Firewall rules on EC2 instances that you want to migrate should be configured to allow push installation of this service. The security group for EC2 instances should have the following rules:

	![firewall rules](./media/site-recovery-migrate-aws-to-azure/migrate-firewall.png)

6. [Enable protection for machines](site-recovery-vmware-to-azure-classic.md#step-10-enable-protection-for-a-machine). Add machines you want to protect to the replication group.

	![enable protection](./media/site-recovery-migrate-aws-to-azure/migrate-add-machines.png)

7. You can discover the EC2 instances that you want to migrate to Azure using the private IP address of the instance which you can get from the EC2 console. In the protection group you can add the private IP address of each instance.

	![enable protection](./media/site-recovery-migrate-aws-to-azure/migrate-machine-ip.png)

	After adding a machine to the group,  protection will be enabled and initial replication will run in accordance with the protection group settings.

8. [Run an unplanned failover](site-recovery-failover.md#run-an-unplanned-failover). After initial replication is complete you can run an unplanned failover from AWS to Azure for each VM. Optionally, you can create a recovery plan and run an unplanned failover, to migrate multiple virtual machines from AWS to Azure. [Learn more](site-recovery-create-recovery-plans.md) about recovery plans.
		
## Next steps

Learn more about other replication scenarios in [What is Azure Site Recovery?](site-recovery-overview.md)



