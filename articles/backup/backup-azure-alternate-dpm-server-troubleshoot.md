---
title: Troubleshoot data recovery from Microsoft Azure Backup Server by using Azure Backup
description: Learn how to troubleshoot data recovery from Microsoft Azure Backup Server.
ms.topic: troubleshooting
ms.date: 01/31/2025
ms.service: azure-backup
ms.custom: engagement-fy24
author: jyothisuri
ms.author: jsuri
---

# Troubleshoot data recovery from Microsoft Azure Backup Server 

This article provides recommendations for troubleshooting common errors encountered during data recovery from Microsoft Azure Backup Server.


## Troubleshoot error messages

| Error Message | Cause | Recommendation |
|:--- |:--- |:--- |
|This server is not registered to the vault specified by the vault credential. | This error appears when the vault credential file selected doesn't belong to the Recovery Services vault associated with Azure Backup Server on which the recovery is attempted. | Download the vault credential file from the Recovery Services vault to which the Azure Backup Server is registered. |
|Either the recoverable data isn't available or the selected server isn't a DPM server. | There are no other Azure Backup Servers registered to the Recovery Services vault, or the servers haven't yet uploaded the metadata, or the selected server isn't an Azure Backup Server (using Windows Server or Windows Client). | If there are other Azure Backup Servers registered to the Recovery Services vault, ensure that the latest Azure Backup agent is installed. <br>If there are other Azure Backup Servers registered to the Recovery Services vault, wait for a day after installation to start the recovery process. The nightly job will upload the metadata for all the protected backups to cloud. The data will be available for recovery. |
|No other DPM server is registered to this vault. | There are no other Azure Backup Servers  that are registered to the vault from which the recovery is being attempted. | If there are other Azure Backup Servers registered to the Recovery Services vault, ensure that the latest Azure Backup agent is installed.<br>If there are other Azure Backup Servers registered to the Recovery Services vault, wait for a day after installation to start the recovery process. The nightly job uploads the metadata for all protected backups to cloud. The data will be available for recovery. |
|The encryption passphrase provided does not match with passphrase associated with the following server: **\<server name>** | The encryption passphrase used in the process of encrypting the data from the Azure Backup Server’s data that's being recovered doesn't match the encryption passphrase provided. The agent is unable to decrypt the data, and so the recovery fails. | Provide the exact same encryption passphrase associated with the Azure Backup Server whose data is being recovered. |

## Next steps

- [Common questions](backup-azure-vm-backup-faq.yml) about Azure VM backups.
- [Common questions](backup-azure-file-folder-backup-faq.yml) about the Azure Backup agent.
- [Recover data from Azure Backup Server](backup-azure-alternate-dpm-server.md).