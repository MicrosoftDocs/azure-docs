<properties 
	pageTitle="Prerequisites for setting up protection between VMM sites" 
	description="Describes the prerequisites for setting up protection between VMM sites with Azure Site Recovery." 
	services="site-recovery" 
	documentationCenter="" 
	authors="raynew" 
	manager="jwhit" 
	editor="tysonn"/>

<tags 
	ms.service="site-recovery" 
	ms.workload="backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/19/2015" 
	ms.author="raynew"/>

# Prerequisites for setting up protection between VMM sites


## Azure requirements

- You'll need a [Microsoft Azure](http://azure.microsoft.com/) account. If you don't have one, start with a [free trial](http://aka.ms/try-azure). In addition you can read about [Azure Site Recovery Manager pricing](http://go.microsoft.com/fwlink/?LinkId=378268).
- To understand how information and data are used, read the [Microsoft Azure Privacy Statement](http://go.microsoft.com/fwlink/?LinkId=324899) and additional [Privacy information for Azure Site Recovery](../hyper-v-recovery-manager-privacy.md)

## VMM requirements
- You'll need at least one VMM server.
- The VMM server should be running at least System Center 2012 SP1 with the latest cumulative updates. 
- Any VMM server containing virtual machines you want to protect must be running the Azure Site Recovery Provider. This is installed during the Azure Site Recovery deployment.
- If you want to set up protection with a single VMM server you'll need at least two clouds configured on the server.
- If you want to deploy protection with two VMM servers each server must have at least one cloud configured on the primary VMM server you want to protect and one cloud configured on the secondary VMM server you want to use for protection and recovery
- All VMM clouds must have the Hyper-V Capacity profile set.
- The source cloud that you want to protect must contain the following:
	- One or more VMM host groups.
	- One or more Hyper-V host servers in each host group .
	- One or more virtual machines on the host server. 
- Learn more about setting up VMM clouds:
	- Read more about private VMM clouds in [What’s New in Private Cloud with System Center 2012 R2 VMM](http://go.microsoft.com/fwlink/?LinkId=324952) and in [VMM 2012 and the clouds](http://go.microsoft.com/fwlink/?LinkId=324956). 
	- Learn about [Configuring the VMM cloud fabric](https://msdn.microsoft.com/en-us/library/azure/dn469075.aspx#BKMK_Fabric)
	- After you cloud fabric elements are in place learn about creating private clouds in  [Creating a private cloud in VMM](http://go.microsoft.com/fwlink/?LinkId=324953)and [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://go.microsoft.com/fwlink/?LinkId=324954).

## Hyper-V requirements

- The host and target Hyper-V servers must be running at least Windows Server 2012 with Hyper-V role and have the latest updates installed.
- If you're running Hyper-V in a cluster note that cluster broker isn't created automatically if you have a static IP address-based cluster. You'll need to configure the cluster broker manually. For instructions see [Configure Hyper-V Replica Broker](hhttp://go.microsoft.com/fwlink/?LinkId=403937).
- Any Hyper-V host server or cluster for which you want to manage protection must be included in a VMM cloud.
 
## Network mapping requirements
- Network mapping ensures that replica virtual machines are optimally places on Hyper-V host servers after failover and that they can connect to appropriate VM networks. If you don't configure network mapping replica virtual machines won't be connected to VM networks after failover. If you want to deploy network mapping you'll need the following:
	- The virtual machines you want to protect on the source VMM server should be connected to a VM network. That network should be linked to a logical network that is associated with the cloud.
	- The target cloud on the secondary VMM server that you use for recovery should have a corresponding VM network configured, and it in turn should be linked to a corresponding logical network that is associated with the target cloud. 
## Storage mapping requirements
By default when you replicate a virtual machine on a source Hyper-V host server to a target Hyper-V host server, replicated data is stored in the default location that’s indicated for the target Hyper-V host in Hyper-V Manager. For more control over where replicated data is stored, you can configure storage mapping. To do this you'll need to set up storage classifications on the source and target VMM servers before you begin deployment.
For instructions see [How to create storage classifications in VMM](http://go.microsoft.com/fwlink/?LinkId=400937).


