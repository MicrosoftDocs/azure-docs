---
title: Migrate VMs from AWS to Azure| Microsoft Docs
description: This article describes how to migrate virtual machines running in Amazon Web Services (AWS) to Azure using Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: bsiva
manager: jwhit
editor: ''

ms.assetid: ddb412fd-32a8-4afa-9e39-738b11b91118
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: backup-recovery
ms.date: 02/12/2017
ms.author: bsiva

---
# Migrate virtual machines in Amazon Web Services (AWS) to Azure with Azure Site Recovery

This article describes how to migrate AWS Windows instances to Azure virtual machines with the [Azure Site Recovery](site-recovery-overview.md) service.

Migration is effectively a failover from AWS to Azure. You can't fail machines back, and there's no ongoing replication. This article describes the steps for migration in the Azure portal, and are based on the instructions for [replicating a physical machine to Azure](site-recovery-vmware-to-azure.md).

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr)

## Supported operating systems

Site Recovery can be used to migrate EC2 instances running any of the following operating systems:

- Windows(64 bit only)
    - Windows Server 2008 R2 SP1+ (Citrix PV drivers or AWS PV drivers only. **Instances running RedHat PV drivers are not supported**)
    Windows Server 2012
    Windows Server 2012 R2
- Linux (64 bit only)
    - Red Hat Enterprise Linux 6.7 (HVM virtualized instances only)

## Prerequisites

Here's what you need for this deployment

* **Configuration server**: An on-premises VM running Windows Server 2012 R2 is deployed as the configuration server. By default, the other You Site Recovery components (process server and master target server) are installed when you deploy the configuration server. [Learn more](site-recovery-components.md#replicate-vmware-vmsphysical-servers-to-azure)
* **EC2 instances**: The EC2 virtual machines instances that you want to migrate.

## Deployment steps

1. Create a vault
2. Deploy the configuration server
3. After you've deployed the configuration server, validate that it can communicate with the VMs that you want to migrate.
4. Set up replication settings.
5. Install the Mobility service. Each VM you want to protect needs the Mobility service installed. This service sends data to the process server. The Mobility service can be installed manually or pushed and installed automatically by the process server when protection for the VM is enabled. Firewall rules on EC2 instances that you want to migrate should be configured to allow push installation of this service. The security group for EC2 instances should have the following rules:

    ![firewall rules](./media/site-recovery-migrate-aws-to-azure/migrate-firewall.png)
6. Enable replication. Enable replication for the VMs you want to migrate. You can discover the EC2 instances using the private IP addresses, which you can get from the EC2 console.
7. Run an unplanned failover). After initial replication is complete, you can run an unplanned failover from AWS to Azure for each VM. Optionally, you can create a recovery plan and run an unplanned failover, to migrate multiple virtual machines from AWS to Azure. [Learn more](site-recovery-create-recovery-plans.md) about recovery plans.

Get detailed instructions for the [deployment steps](site-recovery-vmware-to-azure.md), and for running an [unplanned failover](site-recovery-failover.md#run-an-unplanned-failover).
