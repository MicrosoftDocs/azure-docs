<properties
	pageTitle="Determine Azure Backup storage redundancy options | Microsoft Azure"
	description="Understand the difference between geo redundant storage and locally redundant storage to determine your Azure Backup storage redundancy option."
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/05/2016"
	ms.author="jimpark; markgal"/>


# Storage redundancy options for Azure Backup

Your business needs will determine the appropriate storage redundancy option for Azure Backup storage. If you are using Azure as a primary backup storage endpoint (e.g. you are backing up to Azure from a Windows Server), you should consider picking (the default) geo-redundant storage option. If you are using Azure as a tertiary backup storage endpoint (e.g. you are using SCDPM to have a local backup copy on-premises and using Azure for your long term retention needs), you should consider choosing locally redundant storage

## Geo-redundant storage (GRS)

Geo-redundant storage maintains six copies of your data. With GRS, your data is replicated three times within the primary region, and is also replicated three times in a secondary region hundreds of miles away from the primary region, providing the highest level of durability. In the event of a failure at the primary region, by storing data in GRS, Azure Backup ensures that your data is durable in two separate regions.

## Locally Redundant Storage (LRS)

Locally redundant storage maintains three copies of your data. LRS is replicated three times within a single facility in a single region. LRS protects your data from normal hardware failures, but not from the failure of an entire Azure facility. This brings down the cost of storing data in Azure, while providing a lower level of durability for your data that might be acceptable for tertiary copies.

You can select the appropriate option for your needs from the **Configure** option of your backup vault.

## Next steps

- Make sure your environment is [prepared to back up a Windows server or client machine](backup-configure-vault.md)
- If you still have unanswered questions, take a look at the [Azure Backup FAQ](backup-azure-backup-faq.md).
- Visit the [Azure Backup forum](http://go.microsoft.com/fwlink/p/?LinkId=290933)
