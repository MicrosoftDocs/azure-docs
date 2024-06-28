---
title: Azure NetApp Files backup FAQs | Microsoft Docs
description: Answers frequently asked questions (FAQs) about using the Azure NetApp Files backup feature.
ms.service: azure-netapp-files
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 09/10/2022
---
# Azure NetApp Files backup FAQs

This article answers frequently asked questions (FAQs) about using the [Azure NetApp Files backup](backup-introduction.md) feature. 

## When do my backups occur?   

Azure NetApp Files backups start within a randomized time frame after the frequency of a backup policy is entered. For example, weekly backups are initiated Sunday within a randomly assigned interval after 12:00 a.m. midnight. This timing can't be modified by the users at this time. The baseline backup is initiated as soon as you assign the backup policy to the volume.

## What happens if a backup operation encounters a problem?

If a problem occurs during a backup operation, Azure NetApp Files backup automatically retries the operation, without requiring user interaction. If the retries continue to fail, Azure NetApp Files backup reports the failure of the operation.

## Can I change the location or storage tier of my backup vault?

No, Azure NetApp Files automatically manages the backup data location within Azure storage. This location or Azure storage tier can't be modified by the user.

## What types of security are provided for the backup data?

Azure NetApp Files uses AES-256 bit encryption during the encoding of the received backup data. In addition, the encrypted data is securely transmitted to Azure storage using HTTPS TLSv1.2 connections. Azure NetApp Files backup depends on the Azure Storage account’s built-in encryption at rest functionality for storing the backup data.

## What happens to the backups when I delete a volume or backup vault? 

When you delete an Azure NetApp Files volume, the backups are retained under the backup vault. If you don’t want to retain the backups, first delete the older backups followed by the most recent backup.

If you wish to delete the backup vault, ensure that all the backups under the backup vault are deleted before deleting the backup vault.

## What’s the system’s maximum backup retries for a volume?  

The system makes 10 retries when processing a scheduled backup job. If the job fails, then the system fails the backup operation. For scheduled backups (based on the configured policy), the system tries to back up the data once every hour. If new snapshots are available that weren't transferred (or failed during the last try), those snapshots are considered for transfer. 

## Next steps  

- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)
