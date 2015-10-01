<properties
	pageTitle="Introduction to Azure Backup | Microsoft Azure"
	description="This article provides an overview of the Azure Backup service which enables customers to backup data to Azure and in Azure"
	services="backup"
	documentationCenter=""
	authors="trinadhk"
	manager="shreeshd"
	editor="tysonn"/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/01/2015"
	ms.author="aashishr"; "trinadhk"; "jimpark"/>

# Introduction to Azure Backup
This article provides a high level overview of Microsoft's cloud integrated backup solution that enables customers to back up their data present either on-premises or in Azure.

## What is Azure Backup?
Azure Backup is a multi-tenanted Azure service that enables you to back up your data present anywhere: on-premises or in Azure. It replaces your existing on-premises or offsite backup solution with a reliable, secure and cost competitive cloud based offering. It also provides the flexibility of protecting assets running in the cloud. Azure Backup is built on top of a world class infrastructure that is scalable, durable and highly available. Using this solution, you can back up data and applications from their System Center Data Protection Manager (SCDPM) servers, Windows servers, Windows client machines or Azure IaaS virtual machines. Azure Backup and SCDPM are the fundamental technologies which make up Microsoft's cloud-integrated backup solution.

> [AZURE.VIDEO what-is-azure-backup]

## Cloud Design point
Traditional backup solutions have evolved to treat the cloud as an endpoint similar to disk or tape. While this approach is simple, easy to deploy and provides a consistent experience, it has limited uses and does not take full advantage of the underlying platform. This translates to an inefficient, expensive solution for end customers. By treating Azure as "just as a storage endpoint", backup solutions are unable to tap into the richness and power of the public cloud platform. Azure Backup, on the other hand, delivers a true service which uses the cloud to deliver a powerful & affordable backup solution. It integrates with your on-premises backup solution (SCDPM) to provide an end-to-end hybrid solution.

The advantages to this approach are:

- Efficient cloud storage architecture that provides low-cost, resilient data storage
- Nonintrusive, auto scaling of the service with high availability guarantees
- Consistent way to back up on premise, hybrid and IaaS deployments

The key features of this solution are:

1. **Reliable service**: By adopting Azure Backup, you get a backup service which is highly available. The service is multi-tenanted and you do not have to worry about managing the underlying compute or storage.

2. **Reliable storage**: Azure Backup is built on top of reliable cloud storage which is backed by high SLAs. You do not have to worry about capital or operation expenses in maintaining the storage. Furthermore you have the choice of backing up to LRS (Locally Redundant Storage) or GRS (Geo Replication storage) storage. While LRS enables 3 copies of the data in the same geo which protects against local hardware failures; GRS provides 3 additional copies (a total of 6 copies) in a paired data center. This ensures that your backup data is highly available. Even if there is an Azure-site-level disaster, the backup data is safe with us.

3. **Secure**: Azure backup data is encrypted at source, during transmission and stored encrypted in Azure.  The encryption key is stored at source and is never transmitted or stored in Azure. The encryption key is required to restore any of the data and only the customer has full access to the data in the service.

4. **Offsite protection**: Rather than paying for offsite tape backup solutions, customers can backup to Azure which provides a compelling solution with tape-like-semantics at a very low cost.

5. **Simplicity**: Azure Backup provides a familiar interface that can scale to protect a deployment of any size.  As the service evolves, features like central management will allow you to manage your backup infrastructure from a single location.

6. **Cost effective**:  Azure Backup pricing includes a per-instance backup management fee and cost of storage (block blob price) consumed on Azure.  Unlike other cloud based backup offering, Azure Backup does not charge its customers for any restore operation. Furthermore, customers are not charged for any egress (outbound) data transfer cost during a restore operation.

7. **Backup in Cloud**: Azure Backup provides VSS-based application-consistent backup of Azure IaaS virtual machines running without the need to shut down the virtual machine. It can also backup Linux virtual machines in Azure with filesystem consistency.


## Application and workloads

| Workload | Source machine | Azure Backup solution |
| --- | --- |---|
| File & folders | Windows Server, Windows client | Azure Backup agent |
| File & folders | Windows Server, Windows client | System Center DPM |
| Hyper-V Virtual machine (Windows) | Windows Server | System Center DPM |
| Hyper-V Virtual machine (Linux) | Windows Server | System Center DPM |
| Microsoft SQL Server | Windows Server | System Center DPM |
| Microsoft SharePoint | Windows Server | System Center DPM |
| Microsoft Exchange |  Windows Server | System Center DPM |
| Azure IaaS VMs (Windows)|  - | Azure Backup |
| Azure IaaS VMs (Linux) | - | Azure Backup |

## Next steps
- [Try Azure Backup](backup-try-azure-backup-in-10-mins.md)
- Frequently asked question on the Azure Backup service is listed [here](backup-azure-backup-faq.md).
- Visit the [Azure Backup Forum](http://go.microsoft.com/fwlink/p/?LinkId=290933).
