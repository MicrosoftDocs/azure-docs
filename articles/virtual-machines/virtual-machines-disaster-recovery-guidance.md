<properties
	pageTitle="What to do in the event that an Azure service disruption impacts Azure virtual machines | Microsoft Azure"
	description="Learn what to do in the event that an Azure service disruption impacts Azure virtual machines."
	services="virtual-machines"
	documentationCenter=""
	authors="kmouss"
	manager="drewm"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.workload="virtual-machines"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="kmouss;aglick"/>

#What to do in the event that an Azure service disruption impacts Azure virtual machines

At Microsoft, we work hard to make sure that our services are always available to you when you need them. Forces beyond our control sometimes impact us in ways that cause unplanned service disruptions.

Microsoft provides a Service Level Agreement (SLA) for its services as a commitment for uptime and connectivity. The SLA for individual Azure services can be found at [Azure Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

Azure already has many built-in platform features that support highly available applications. For more about these services, read [Disaster recovery and high availability for Azure applications](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md).

This article covers a true disaster recovery scenario, when a whole region experiences an outage due to major natural disaster or widespread service interruption. These are rare occurrences, but you must prepare for the possibility that there is an outage of an entire region. If an entire region experiences a service disruption, the locally redundant copies of your data would temporarily be unavailable. If you have enabled geo-replication, three additional copies of your Azure Storage blobs and tables are stored in a different region. In the event of a complete regional outage or a disaster in which the primary region is not recoverable, Azure remaps all of the DNS entries to the geo-replicated region.

>[AZURE.NOTE]Be aware that you do not have any control over this process, and it will only occur for region-wide service disruptions. Because of this, you must also rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data strategies for disaster recovery](../resiliency/resiliency-disaster-recovery-azure-applications.md#data-strategies-for-disaster-recovery).

To help you handle these rare occurrences, we provide the following guidance for Azure virtual machines in the case of a service disruption of the entire region where your Azure virtual machine application is deployed.

##Option 1: Wait for recovery
In this case, no action on your part is required. Know that we are working diligently to restore service availability. You can see the current service status on our [Azure Service Health Dashboard](https://azure.microsoft.com/status/).

>[AZURE.NOTE]This is the best option if you have not set up Azure Site Recovery, virtual machine backup, read-access geo-redundant storage, or geo-redundant storage prior to the disruption. If you have set up geo-redundant storage or read-access geo-redundant storage for the storage account where your VM virtual hard drives (VHDs) are stored, you can look to recover the base image VHD and try to provision a new VM from it. This is not a preferred option because there are no guarantees of synchronization of data unless Azure VM backup or Azure Site Recovery are used. Consequently, this option is not guaranteed to work.

For customers who want immediate access to virtual machines, the following two options are available.  

>[AZURE.NOTE]Be aware that both of the following options have the possibility of some data loss.     

##Option 2: Restore a VM from a backup
For customers who have configured a VM backup, you can restore the VM from its backup and recovery point.

To restore a new VM from Azure Backup, see [Restore virtual machines in Azure](../backup/backup-azure-restore-vms.md).

To help you plan for your Azure virtual machines backup infrastructure, see [Plan your VM backup infrastructure in Azure](../backup/backup-azure-vms-introduction.md).

##Option 3: Initiate a failover by using Azure Site Recovery
If you have configured Azure Site Recovery to work with your impacted Azure virtual machines, you can restore your VMs from their replicas. These replicas can reside either on Azure or on premises. In this case, you can create a new VM from its existing replica. To restore your VMs from an Azure Site Recovery replica, see [Migrate Azure IaaS virtual machines between Azure regions with Azure Site Recovery](../site-recovery/site-recovery-migrate-azure-to-azure.md).

>[AZURE.NOTE]Although Azure virtual machine operating system and data disks will be replicated to a secondary VHD, if they are in a geo-redundant storage or read-access geo-redundant storage account, each VHD is replicated independently. This level of replication doesn’t guarantee consistency across the replicated VHDs. If your application and/or databases that use these data disks have dependencies on each other, it is not guaranteed that all VHDs are replicated as one snapshot. It is also not guaranteed that the VHD replica from geo-redundant storage or read-access geo-redundant storage will result in an application consistent snapshot to boot the VM.

##Next steps
To learn more about how to implement a disaster recovery and high availability strategy, see [Disaster recovery and high availability for Azure applications](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md).

To develop a detailed technical understanding of a cloud platform’s capabilities, see [Azure resiliency technical guidance](../resiliency/resiliency-technical-guidance.md).

To learn how to back up VMs, see [Back up Azure virtual machines](../backup/backup-azure-vms.md).

Learn how to use Azure Site Recovery to orchestrate and automate protection of your physical (and virtual) Windows and Linux machines that run on VMWare and Hyper-V VMs, see [Azure Site Recovery](https://azure.microsoft.com/documentation/learning-paths/site-recovery/).

If the instructions are not clear, or if you would like Microsoft to do the operations on your behalf, contact [Customer Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
