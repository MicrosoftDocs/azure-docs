---
title: Silent installation of Azure Backup Server V2
description: Use a PowerShell script to silently install Azure Backup Server V2. This kind of installation is also called an unattended installation.
ms.topic: conceptual
ms.date: 11/13/2018
---
# Run an unattended installation of Azure Backup Server

Learn how to run an unattended installation of Azure Backup Server.

These steps don't apply if you're installing Azure Backup Server V1.

## Install Backup Server

1. On the server that hosts Azure Backup Server V2 or later, create a text file. (You can create the file in Notepad or in another text editor.) Save the file as MABSSetup.ini.

2. Paste the following code in the MABSSetup.ini file. Replace the text inside the brackets (\< \>) with values from your environment. The following text is an example:

   ```text
   [OPTIONS]
   UserName=administrator
   CompanyName=<Microsoft Corporation>
   SQLMachineName=localhost
   SQLInstanceName=<SQL instance name>
   SQLMachineUserName=administrator
   SQLMachinePassword=<admin password>
   SQLMachineDomainName=<machine domain>
   ReportingMachineName=localhost
   ReportingInstanceName=<reporting instance name>
   SqlAccountPassword=<admin password>
   ReportingMachineUserName=<username>
   ReportingMachinePassword=<reporting admin password>
   ReportingMachineDomainName=<domain>
   VaultCredentialFilePath=<vault credential full path and complete name>
   SecurityPassphrase=<passphrase>
   PassphraseSaveLocation=<passphrase save location>
   UseExistingSQL=<1/0 use or do not use existing SQL>
   ```

3. Save the file. Then, at an elevated command prompt on the installation server, enter this command:

   ```cmd
   start /wait <cdlayout path>/Setup.exe /i  /f <.ini file path>/setup.ini /L <log path>/setup.log
   ```

You can use these flags for the installation:</br>
**/f**: .ini file path</br>
**/l**: Log path</br>
**/i**: Installation path</br>
**/x**: Uninstall path</br>

## Next steps

After you install Backup Server, learn how to prepare your server, or begin protecting a workload.

- [Prepare Backup Server workloads](backup-azure-microsoft-azure-backup.md)
- [Use Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md)
- [Use Backup Server to back up SQL Server](backup-azure-sql-mabs.md)
- [Add Modern Backup Storage to Backup Server](backup-mabs-add-storage.md)
