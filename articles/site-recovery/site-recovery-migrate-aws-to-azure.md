<properties
	pageTitle="Migrate Windows virtual machines from Amazon Web Services to Microsoft Azure"
	description="Use Azure Site Recovery to migrate Windows virtual machines running in Amazon Web Services (AWA) to Azure."
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
	ms.date="08/26/2015"
	ms.author="raynew"/>

#  Migrate Windows virtual machines in Amazon Web Services (AWS) to Azure


## Overview

Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines in a number of deployments. For a full list of deployment scenarios see the [Azure Site Recovery overview](site-recovery-overview.md).

This article describes how to use Site Recovery to migrate or fail over Windows instances running in AWS to Azure. The articles uses most of the steps described in [Set up protection between on-premises VMware virtual machines or physical servers and Azure](site-recovery-vmware-to-azure.md). We suggest you read through that article for detailed instructions on each step in the deployment.

## Get started

Here's what you need before you start:

- **Configuration server**: An Azure virtual machine that acts as the configuration server. The configuration server coordinates communication between on-premises machines and Azure servers.
- **Master target server**: An Azure virtual machine that acts as the master target server. This server receives and retains replicated data from protected machines.
- **A process server**: A virtual machine running Windows Server 2012 R2. Protected virtual machines send replication data to this server.
- **EC2 VM instances**: The instances you want to migrate and then protect.

- Read more about these components in [what do I need?](site-recovery-vmware-to-azure.md#what-do-i-need)
- You should also read the guidelines on [capacity planning](site-recovery-vmware-to-azure.md#capacity-planning) and make sure you have all the [deployment prerequisites](site-recovery-vmware-to-azure.md#before-you-start) in place before you start.

## Deployment steps

1. [Create a vault](site-recovery-vmware-to-azure.md#step-1-create-a-vault)
2. [Deploy a configuration server](site-recovery-vmware-to-azure.md#step-2-deploy-a-configuration-server) as an Azure VM.
3. [Deploy the master target server](site-recovery-vmware-to-azure.md#step-2-deploy-a-configuration-server) as an Azure VM.
4. [Deploy a process server](site-recovery-vmware-to-azure.md#step-4-deploy-the-on-premises-process-server). Note that:

	- You should deploy the process server on the same subnet/Amazon Virtual Private Cloud as your EC2 instances. 
		![EC2 instances](./media/site-recovery-migrate-aws-to-azure/ASR_AWSMigration1.png)

	- After you've deployed the process server validate that it can communicate with the EC2 instances that you want to migrate.
	- Each VM you want to protect needs the Mobility service installed. This service sends data to the process server. The Mobility service can be installed manually or pushed and installed automatically by the process server when protection for the VM is enabled. Firewall rules on EC2 instances that you want to migrate should be configured to allow push installation of this service. The security group for EC2 instances should have the following rules:

		![firewall rules](./media/site-recovery-migrate-aws-to-azure/ASR_AWSMigration2.png)

	- After the process server is deployed and registered with the configuration server in the Site Recovery vault it should show up under the **Configuration Servers** tab in the Site Recovery console. This can take up to 15 minutes.
	
		![process server](./media/site-recovery-migrate-aws-to-azure/ASR_AWSMigration3.png)

5. [Install the latest updates](site-recovery-vmware-to-azure.md#step-5-install-latest-updates). Make sure all the component servers you've installed are up-to-date.
6. [Create a protection group](site-recovery-vmware-to-azure.md#step-7-create-a-protection-group). In order to starting protecting migrated instances using Site Recovery you need to set up a protection group. You specify replication settings for a group and they'll be applied to all instances that you add to that group. 
7. [Set up virtual machines](site-recovery-vmware-to-azure.md#step-8-set-up-machines-you-want-to-protect). You'll need to get the Mobility service installed on each instance (either automatically or manually).
8. [Enable protection for virtual machines](site-recovery-vmware-to-azure.md#step-9-enable-protection). You enable protection for instances by adding them to a protection group. Note that:

	- You can discover the EC2 instances that you want to migrate to Azure using the private IP address of the instance which you can get from the EC2 console.
	-  On the tab for the protection group you created, click Add Machines > Physical Machines
		![EC2 discovery](./media/site-recovery-migrate-aws-to-azure/ASR_AWSMigration4.png)
	- Specify the private IP address of the instance.
		- ![EC2 discovery](./media/site-recovery-migrate-aws-to-azure/ASR_AWSMigration5.png)
	- Protection will be enabled and the initial replication will run in accordance with the initial replication settings for the protection group
9. [Run an unplanned failover](site-recovery-failover.md#run-an-unplanned-failover). After initial replication is complete you can run an unplanned failover from AWS to Azure. Optionally, you can create a recovery plan and run an unplanned failover, to migrate multiple virtual machines from AWS to Azure. [Learn more](site-recovery-create-recovery-plans.md) about recovery plans.
		
## Next steps

Post any comments or questions in the [Site Recovery forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr)


