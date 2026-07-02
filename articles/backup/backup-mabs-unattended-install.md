---
title: Run a silent or unattended installation of Azure Backup Server V4
description: Learn how to run a silent, unattended, or non-interactive installation of Azure Backup Server (MABS) V4 by using a setup.ini file and command-line installation switches.
ms.service: azure-backup
ms.topic: how-to
ms.date: 07/14/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a system administrator, I want to execute a silent installation of Azure Backup Server V4 using PowerShell, so that I can streamline the setup process without manual intervention.
---
# Run a silent or unattended installation of Azure Backup Server

This article describes how to run a silent (unattended) installation of Azure Backup Server (MABS) V4 or later by using a setup.ini file and command-line switches.

These steps don't apply if you're installing older version of Azure Backup Server like MABS V1, V2 and V3.

## When to use unattended installation

Use unattended installation when you need one or more of these outcomes:

- Deploy MABS in repeated or standardized environments.
- Reduce manual installation time and operator input.
- Automate setup in controlled server provisioning workflows.

## Quick command flow

Use this high-level sequence before you start:

1. Create the required folder under Program Files.
2. Enable required Windows features.
3. Create and populate `MABSSetup.ini`.
4. Run Setup.exe with `/f`, `/l`, and `/i` switches.
5. Validate installation status and logs.

## Prerequisites

Before you run unattended setup, confirm the following:

- You're installing Azure Backup Server V4 or later.
- You run commands from an elevated command prompt.
- The server can restart during prerequisites installation.
- You have required credentials and values for SQL, reporting, vault credentials, and passphrase paths.
- Paths used for vault credential and passphrase locations are valid and accessible.

## Install Backup Server

To install the Backup Server, run the following command:

1. Ensure that there's a directory under Program Files called "Microsoft Azure Recovery Services Agent" by running the following command in an elevated command prompt.
   ```cmd
   mkdir "C:\Program Files\Microsoft Azure Recovery Services Agent"
   ```
2. Install the pre-requisites for MABS ahead of time in an elevated command prompt. The following command can result in an automatic server restart, but if that does not happen, a manual restart is recommended.
   ```cmd
   start /wait dism.exe /Online /Enable-feature /All /FeatureName:Microsoft-Hyper-V /FeatureName:Microsoft-Hyper-V-Management-PowerShell /quiet
   ```
3. On the server that hosts Azure Backup Server V4 or later, create a text file. (You can create the file in Notepad or in another text editor.) Save the file as MABSSetup.ini.
4. Paste the following code in the MABSSetup.ini file. Replace the text inside the brackets (\< \>) with values from your environment. The following text is an example:

   >[!Caution]
   >Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. Ensure that you delete the **MABSSetup.ini** file once the installation is complete.

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
   ReportingInstanceName=SSRS
   SqlAccountPassword=<admin password>
   ReportingMachineUserName=<username>
   ReportingMachinePassword=<reporting admin password>
   ReportingMachineDomainName=<domain>
   VaultCredentialFilePath=<vault credential full path and complete name, without spaces in both>
   SecurityPassphrase=<passphrase>
   PassphraseSaveLocation=<passphrase save location, an existing directory where the passphrase file can be created>
   UseExistingSQL=<1/0 use or do not use existing SQL>
   ```
5. Save the file. Then, at an elevated command prompt on the installation server, enter this command:

   ```cmd
   start /wait <cdlayout path>/Setup.exe /i  /f <.ini file path>/setup.ini /L <log path>/setup.log
   ```

You can use these flags for the installation:</br>
**/f**: .ini file path</br>
**/l**: Log path</br>
**/i**: Installation path</br>
**/x**: Uninstall path</br>

## Validate installation

After setup completes, verify that installation succeeded:

1. Review the setup log that you specified with the `/l` switch.
2. Open the Azure Backup Server console and confirm that services and workloads load as expected.
3. Verify that the MABS server is registered and that you can proceed with protection configuration.

## Troubleshoot common unattended setup issues

If setup fails or behaves unexpectedly, check these common causes:

- Invalid setup.ini values, missing required fields, or incorrect paths.
- SQL instance name, credentials, or reporting settings are incorrect.
- Vault credential file path or passphrase save location isn't valid.
- Required Windows features weren't enabled successfully, or restart is pending.
- Setup was started without elevation.

If Microsoft Azure Backup Server fails with errors during setup, backup, or restore, see [Azure Backup Server error codes](https://support.microsoft.com/kb/3041338).

## Next steps

After you install Backup Server, learn how to prepare your server, or begin protecting a workload.

- [Prepare Backup Server workloads](backup-azure-microsoft-azure-backup.md).
- [Use Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md).
- [Use Backup Server to back up SQL Server](backup-azure-sql-mabs.md).
- [Add Modern Backup Storage to Backup Server](backup-mabs-add-storage.md).
- [Manage telemetry settings in MABS](manage-telemetry.md).
