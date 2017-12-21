---

title: Troubleshoot System Center Data Protection Manager | Microsoft Docs
description: Troubleshoot issues in System Center Data Protection Manager.
services: backup
documentationcenter: ''
author: adigan
manager: shreeshd
editor: ''

ms.assetid: 2d73c349-0fc8-4ca8-afd8-8c9029cb8524
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/24/2017
ms.author: pullabhk;markgal;adigan

---

You can find the latest Release Notes for SC DPM [here](https://docs.microsoft.com/en-us/system-center/dpm/dpm-release-notes?view=sc-dpm-2016).
The Protection Support Matrix can be found [here](https://docs.microsoft.com/en-us/system-center/dpm/dpm-protection-matrix?view=sc-dpm-2016).

## Replica is inconsistent

This error could happen for various reasons such as - replica creation job failed, issues with change journal, volume level filter bitmap errors, source machine was shutdown unexpectedly, overflow of the synchronization log or the replica is truly inconsistent. Follow these steps to resolve this issue:
- To remove the inconsistent status, run consistency check manually or schedule daily consistency check.
- Ensure you are on latest version of MAB Server, or System Center DPM
- Ensure Automatic Consistency checks is enabled
- Try restarting the services from command Prompt ("net stop dpmra" followed by "net start dpmra")
- Ensure network connectivity and bandwidth requirements are met
- Check if the source machine was shutdown unexpectedly
- Ensure disk is healthy and there is enough space for replica
- Ensure no duplicate backup job are running concurrently

## Online Recovery Point Creation Failed

Follow these steps to resolve this issue:
- Ensure you are on latest version of Azure Backup Agent
- Try manually creating a recovery point in the protection task area
- Ensure that you run consistency check on the data source
- Ensure network connectivity and bandwidth requirements are met
- Replica data is in inconsistent state. Please create a disk recovery point of this data source
- Ensure replica is present and not missing
- Replica is having enough space to create USN journal

## Unable to configure protection

This error appears when the DPM server is unable to contact the protected server. 
Follow these steps to resolve this issue:
- Ensure you are on the latest version of Azure Backup Agent
- Ensure there is connectivity (network/firewall/proxy) between your DPM server and protected server
- If you are protecting SQL Server, ensure NT AUTHORITY\SYSTEM has sysadmin enabled from Login Properties

## This server is not registered to the vault specified by the vault credential

This error appears when the vault credential file selected does not belong to the Recovery Services vault associated with System Center DPM / Azure Backup Server on which the recovery is attempted. Follow these steps to resolve this issue:
- Download the vault credential file from the Recovery Services vault to which the System Center DPM / Azure Backup Server is registered.
- Try registering the server with the vault using the latest downloaded vault credential file.

## Either the recoverable data is not available, or the selected server is not a DPM server
This error appears when there are no other System Center DPM / Azure Backup Servers registered to the Recovery Services vault, or the servers have not yet uploaded the metadata, or the selected server is not a System Center DPM / Azure Backup Server.
- If there are other System Center DPM / Azure Backup Servers registered to the Recovery Services vault, ensure that the latest Azure Backup agent is installed.
- If there are other System Center DPM / Azure Backup Servers registered to the Recovery Services vault, wait for a day after installation to start the recovery process. The nightly job will upload the metadata for all the protected backups to cloud. The data will be available for recovery.

## The encryption passphrase provided does not match with passphrase associated with the following server
This error appears when the encryption passphrase used in the process of encrypting the data from the System Center DPM / Azure Backup Server’s data that is being recovered does not match the encryption passphrase provided. The agent is unable to decrypt the data. Hence the recovery fails. Follow these steps to resolve this issue:
- Please provide the exact same encryption passphrase associated with the System Center DPM / Azure Backup Server whose data is being recovered. 
Note: If you forgot/lost the encryption passphrase then there is no option to recover the data. Your only option is to regenerate the passphrase and use to encrypting future backup data.
