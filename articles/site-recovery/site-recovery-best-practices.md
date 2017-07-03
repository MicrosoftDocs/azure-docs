---
title: Azure Site Recovery best practices | Microsoft Docs
description: This article describes best practices for Azure Site Recovery deployment
services: site-recovery
documentationCenter: ''
author: rayne-wiselman"
manager: cfreeman
editor: ''


ms.assetid: c413efcd-d750-4b22-b34b-15bcaa03934a
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/14/2017
ms.author: raynew
ROBOTS: NOINDEX, NOFOLLOW
redirect_url: site-recovery-support-matrix-to-azure
---

# Get ready to deploy Azure Site Recovery

This article describes how to prepare for Azure Site Recovery deployment.

## Protecting Hyper-V virtual machines

You have a couple of deployment choices for protecting Hyper-V virtual machines. You can replicate on-premises Hyper-VMs to Azure, or  to a secondary datacenter. There are different requirements for each deployment.

**Requirement** | **Replicate to Azure (with VMM)** | **Replicate Hyper-V VMs to Azure (no VMM)** | **Replicate Hyper-V VMs to secondary site (with VMM)** | **Details**
---|---|---|---|---
**VMM** | VMM running on System Center 2012 R2 <br/><br/>At least one VMM cloud that contains one or more VMM host groups. | NA | VMM servers in the primary and secondary sites running on at least System Center 2012 SP1 with latest updates. <br/><br/> At least one cloud on each VMM server. Clouds should have the Hyper-V capacity profile set.<br/><br/> The source cloud should have at least one VMM host group. | Optional. You don't need to have System Center VMM deployed in order to replicate Hyper-V virtual machines to Azure but if you do you'll need to make sure the VMM server is set up properly. That includes making sure you're running the right VMM version, and that clouds are set up.
**Hyper-V** | At least one Hyper-V host server in the on-premises site running Windows Server 2012 R2 or later | At least one Hyper-V server in the source and target sites running at least Windows Server 2012 with the latest updates installed, and connected to the internet.<br/><br/> The Hyper-V servers must be in a host group in a VMM cloud. | At least one Hyper-V server in the source and target sites running at least Windows Server 2012 with the latest updates installed, and connected to the internet.<br/><br/> The Hyper-V servers must be located in a host group in a VMM cloud. |
**Virtual machines** | At least one VM on the source Hyper-V host server | At least one VM on the Hyper-V host server in the source VMM cloud | At least one VM on the Hyper-V host server in the source VMM cloud. |  VMs replicating to Azure must conform with Azure virtual machine prerequisites
**Azure account** | You'll need an Azure account and a subscription to the Site Recovery service. | You'll need an Azure account and a subscription to the Site Recovery service. | NA | If you don't have an account, start with a free trial.
**Azure storage** | You'll need a subscription for an Azure storage account that has geo-replication enabled. | You'll need a subscription for an Azure storage account that has geo-replication enabled. | NA | The account should be in the same region as the Azure Site Recovery vault and be associated with the same subscription.
**Networking** | Set up network mapping to ensure that all machines that fail over on the same Azure network can connect to each other, irrespective of which recovery plan they are in. In addition if a network gateway is configure on the target Azure network, virtual machines can connect to other on-premises virtual machines. If you don't set up network mapping only machines that fail over in the same recovery plan can connect. | NA |  <br/><br/>Set up network mapping to ensure that virtual machines are connected to appropriate networks after failover, and that replica virtual machines are optimally placed on Hyper-V host servers. If you don't configure network mapping replicated machines won't be connected to any VM network after failover. |  To set up network mapping with VMM you'll need to make sure that VMM logical and VM networks are configured correctly.
**Providers and agents** | During deployment you'll install the Azure Site Recovery Provider on VMM servers. On Hyper-V servers in VMM clouds you'll install the Azure Recovery Services agent. | During deployment you'll install both the Azure Site Recovery Provider and the Azure Recovery Services agent on the Hyper-V host server or cluster| During deployment you'll install the Azure Site Recovery Provider on VMM servers. On Hyper-V servers in VMM clouds you'll install the Azure Recovery Services agent. | Providers and agents connect to Site Recovery over the internet using an encrypted HTTPS connection. You don't need to add firewall exceptions or create a specific proxy for the Provider connection.
**Internet connectivity** | Only the VMM servers need an internet connection | Only the Hyper-V host servers need an internet connection | Only VMM servers need an internet connection | Virtual machines don't need anything installed on them and don't connect directly to the internet.



## Protect VMware virtual machines or physical servers

You have a couple of deployment choices for protecting VMware virtual machines or Windows/Linux physical servers. You can replicate them to Azure, or  to a secondary datacenter. There are different requirements for each deployment.

**Requirement** | **Replicate VMware VMs/physical servers to Azure)** | * **Replicate VMware VMs/physical servers to secondary site**  
---|---|---
**Primary site** | **Process server**: a dedicated Windows server (physical or virtual) | **Process server**: a dedicated Windows server (physical or VMware virtual machine<br/><br/>  
**Secondary on-premises site** | NA | **Configuration server**: a dedicated Windows server (physical or virtual) <br/><br/> **Master target server**: a dedicated server (physical or virtual). Configure with Windows to protect Windows machines, or Linux to protect Linux.
**Azure** | **Subscription**: You'll need a subscription for the Site Recovery service. <br/><br/> **Storage account**: You'll need a storage account with geo-replication enabled. The account should be in the same region as the Site Recovery vault and be associated with the same subscription. <br/><br/> **Configuration server**: You'll need to set up the configuration server as an Azure VM <br/><br/> **Master target server**: You'll need to set up the master target server as an Azure VM <br/><br/> Configure with Windows to protect Windows machines, or Linux to protect Linux.<br/><br/> **Azure virtual network**:  You'll need an Azure virtual network on which the configuration server and master target server will be deployed. It should be in the same subscription and region as the Azure Site Recovery vault | NA  
**Virtual machines/physical servers** | At least one VMware virtual machine or physical Windows/Linux server.<br/><br/>During deployment the Mobility service will be installed on each machine| At least one VMware VM or physical Windows/Linux server.<br/><br/> During deployment the Unified agent is installed on each machine.




## Azure virtual machine requirements

You can deploy Site Recovery to replicate virtual machines and physical servers running any operating system supported by Azure. This includes most versions of Windows and Linux. You will need to make sure that on-premises virtual machines that you want to protect conform with Azure requirements.


## Optimizing your deployment

Use the following tips to help you optimize and scale your deployment.

- **Operating system volume size**: When you replicate a virtual machine to Azure the operating system volume must be less than 1TB. If you have more volumes than this you can manually move them to a different disk before you start deployment.
- **Data disk size**: If you're replicating to Azure you can have up to 32 data disks on a virtual machine, each with a maximum of 1 TB. You can effectively replicate and fail over a ~32 TB virtual machine.
- **Recovery plan limits**: Site Recovery can scale to thousands of virtual machines. Recovery plans are designed as a model for applications that should fail over together so we limit the number of machines in a recovery plan to 50.
- **Azure service limits**: Every Azure subscription comes with a set of default limits on cores, cloud services etc. We recommend that you run a test failover to validate the availability of resources in your subscription. You can modify these limits via Azure support.
- **Capacity planning**: Plan for scaling and performance.
- **Replication bandwidth**: If you're short on replication bandwidth note that:
	- **ExpressRoute**: Site Recovery works with Azure ExpressRoute and WAN optimizers such as Riverbed.
	- **Replication traffic**: Site Recovery uses performs a smart initial replication using only data blocks and not the entire VHD. Only changes are replicated during ongoing replication.
	- **Network traffic**: You can control network traffic used for replication by setting up Windows QoS with a policy based on the destination IP address and port.  In addition if you're replicating to Azure Site Recovery using the Azure Backup agent. You can configure throttling for that agent.
- **RTO**: If you want to measure the recovery time objective (RTO) you can expect with Site Recovery we suggest you run a test failover and view the Site Recovery jobs to analyze how much time it takes to complete the operations. If you're failing over to Azure, for the best RTO we recommend that you automate all manual actions by integrating with Azure automation and recovery plans.
- **RPO**: Site Recovery supports a near-synchronous recovery point objective (RPO) when you replicate to Azure. This assumes sufficient bandwidth between your datacenter and Azure.
