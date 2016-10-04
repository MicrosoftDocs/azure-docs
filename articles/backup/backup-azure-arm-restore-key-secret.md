<properties
	pageTitle="Restore Key Vault key and secret using Azure Backup | Microsoft Azure"
	description="Learn how to restore Key Vault key and secret in Azure Backup using PowerShell"
	services="backup"
	documentationCenter=""
	authors="JPallavi"
	manager="vijayts"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/10/2016"
	ms.author="JPallavi" />

# Restore Key Vault key and secret using Azure Backup
This article talks about using Azure VM Backup to perform restore of encrypted Azure VMs, if your key and secret do not exist in the key vault.

## Pre-requisites

1. **Backup of encrypted VMs** - Encrypted Azure VMs have been backed up using Azure Backup – Please refer the article [Deploy and manage backups using Azure PowerShell](https://azure.microsoft.com/documentation/articles/backup-azure-vms-automation/) for details about how to backup encrypted Azure VMs.

2. **Configure Azure Key Vault** – Ensure that key vault to which keys and secrets need to be restored is already present. Please refer the article [Get Started with Azure Key Vault](https://azure.microsoft.com/documentation/articles/key-vault-get-started/) for details about key vault management.

## Restore Azure key vault key and secret
Use the following steps in Azure PowerShell to restore key and secret back to Azure key vault, if they do not exist.

### Login to Azure PowerShell and set subscription context

1. Login to Azure account using the below cmdlet

```
PS C:\> Login-AzureRmAccount
```
2. Once logged in, use the below cmdlet to get the list of your available subscriptions

```
PS C:\> Get-AzureRmSubscription
```
3. Select the subscription in which resources are available

```
PS C:\> Set-AzureRmContext -SubscriptionId "subscription-id"
```

