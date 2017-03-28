---
title: Configure Reports for Azure Backup
description: This article talks about configuring Power BI reports for Azure Backup using Recovery Services vault.
services: backup
documentationcenter: ''
author: JPallavi
manager: vijayts
editor: ''

ms.assetid: 86e465f1-8996-4a40-b582-ccf75c58ab87
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 03/27/2017
ms.author: pajosh;markgal;trinadhk
ms.custom: H1Hack27Feb2017

---
# How to get started with reports for Azure Backup 
This article talks about steps to configure reports for Azure Backup using Recovery Services vault. Once, the configuration is complete, you can go to Power BI to view all the reports, customize them and create new reports. 

## Supported Scenarios
1. Azure Backup reports are supported for Azure virtual machine backup and for Azure Recovery Services Agent.
2. You can view reports across vaults and across subscriptions, if same storage account is configured for each of the vaults.

## Pre-requisites
1. Create a storage account to configure it for reports. This storage account is used for storing reports related data.
2. [Create a Power BI account](https://powerbi.microsoft.com/landing/signin/) to view, customize and create your own reports.

## Configure storage account for reports
Use the following steps to configure storage account for Recovery Services vault using Azure Portal. You can use the same storage account across multiple vaults, if you intend to view reports across vaults. 
1. Navigate to recovery services vault. If there is no recovery services vault present, [create a recovery services vault](backup-azure-arm-vms-prepare.md#create-a-recovery-services-vault-for-a-vm). 
