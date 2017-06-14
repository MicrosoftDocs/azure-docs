---
title: Silently Install Azure Backup Server v2 | Microsoft Docs
description: Use a PowerShell script to silently install Azure Backup Server v2. This type of installation is also known as an unattended install.
services: backup
documentationcenter: ' '
author: markgalioto
manager: carmonm


ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/30/2017
ms.author: markgal;masaran

---
# Run an unattended installation for Azure Backup Server v2

This article explains how to run an unattended installation for Azure Backup Server v2. You cannot use these steps to install Azure Backup Server v1.

## Installing Azure Backup Server v2

1. Create the MABSSetup.ini file and place it on the server that hosts Azure Backup Server v2. You can create the file in Notepad or another text editor.

2. Paste the following text into the file. When you're finished, save the file as MABSSetup.ini. In the following sample script, replace the text inside < > with values from your own environment. The text provided is an example.

  ```
  [OPTIONS]
  UserName=administrator
  CompanyName=<Microsoft Corporation>
  SQLMachineName=localhost
  SQLInstanceName=<SQLInstanceName>
  SQLMachineUserName=administrator
  SQLMachinePassword=<admin password>
  SQLMachineDomainName=<machine domain>
  ReportingMachineName=localhost
  ReportingInstanceName=<reporting instance name>
  SqlAccountPassword=<admin password>
  ReportingMachineUserName=<username >
  ReportingMachinePassword=<reporting admin password>
  ReportingMachineDomainName=<domain>
  VaultCredentialFilePath=<vault credential full path and complete name >
  SecurityPassphrase=<passphrase>
  PassphraseSaveLocation=<passphrase save location>
  UseExistingSQL=<1/0 use or not use existing sql>
  ```

3. After saving the file, at an elevated command prompt on the installation server, type:

  ```
  start /wait <cdlayout path>/Setup.exe /i  /f <ini file path>/setup.ini /L <log path>/setup.log
  ```

The flags you can use for the installation are:</br>
**/f** - .ini file path,</br>
**/l** - log path,</br>
**/i** - installation path,</br>
**/x** - uninstall path</br>

## Next steps
After installing Azure Backup Server, use one of the following articles to either prepare your server, or begin protecting a workload:
- [Prepare Azure Backup Server workloads](backup-azure-microsoft-azure-backup.md)
- [Use Azure Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md)
- [Use Azure Backup Server to back up SQL](backup-azure-sql-mabs.md)
