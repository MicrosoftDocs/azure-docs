---
title: Troubleshoot error ID 78144 - No app-consistent recovery point available for the VM in the last 'XXX' minutes
description: This article provides troubleshooting information for error ID 78144 - No app-consistent recovery point available for the VM in the last 'XXX' minutes.
ms.service: azure-site-recovery
ms.topic: troubleshooting
ms.date: 12/09/2025
author: Jeronika-MS
ms.author: v-gajeronika 

# Customer intent: As a cloud operations manager, I want to troubleshoot replication issues of VMware VMs and physical servers to Azure, so that I can ensure consistent disaster recovery performance and maintain business continuity.
---

# Troubleshoot error ID 78144 - No app-consistent recovery point available for the VM in the last 'XXX' minutes

Enhancements have been made in mobility agent [9.23](vmware-physical-mobility-service-overview.md#mobility-service-agent-version-923-and-later) & [9.27](site-recovery-whats-new-archive.md#update-rollup-39) versions to handle VSS installation failure behaviors. Ensure that you're on the latest versions for best guidance on troubleshooting VSS failures.

Some of the most common issues are listed:

## Cause 1: Known issue in SQL server 2008/2008 R2

**Workaround**: There is a known issue with SQL server 2008/2008 R2. Please refer this KB article [Azure Site Recovery Agent or other non-component VSS backup fails for a server hosting SQL Server 2008 R2](https://support.microsoft.com/help/4504103/non-component-vss-backup-fails-for-server-hosting-sql-server-2008-r2)

## Cause 2: Azure Site Recovery jobs fail on servers hosting any version of SQL Server instances with AUTO_CLOSE DBs

**Workaround**: Refer to Kb [article](https://support.microsoft.com/help/4504104/non-component-vss-backups-such-as-azure-site-recovery-jobs-fail-on-ser)

## Cause 3: Known issue in SQL Server 2016 and 2017

**Workaround**: Refer to Kb [article](https://support.microsoft.com/help/4493364/fix-error-occurs-when-you-back-up-a-virtual-machine-with-non-component)

## Cause 4: App-Consistency not enabled on Linux servers

**Workaround**: Azure Site Recovery for Linux Operation System supports application custom scripts for app-consistency. The custom script with pre and post options will be used by the Azure Site Recovery Mobility Agent for app-consistency. [Here](./site-recovery-faq.yml) are the steps to enable it.

## More causes due to VSS related issues

To troubleshoot further, Check the files on the source machine to get the exact error code for failure:

*C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\Application Data\ApplicationPolicyLogs\vacp.log*

**How to locate the errors in the file?**
Search for the string "vacpError"  by opening the vacp.log file in an editor

`Ex: `**`vacpError`**`:220#Following disks are in FilteringStopped state [\\.\PHYSICALDRIVE1=5, ]#220|^|224#FAILED: CheckWriterStatus().#2147754994|^|226#FAILED to revoke tags.FAILED: CheckWriterStatus().#2147754994|^|`

In the preceding  example **2147754994** is the error code that tells you about the failure as shown:

### VSS writer is not installed - Error 2147221164


**Workaround**: To generate an application consistency tag, Azure Site Recovery uses Microsoft Volume Shadow copy Service (VSS). It installs a VSS Provider for its operation to take app consistency snapshots. This VSS Provider is installed as a service. In case the VSS Provider service isn't installed, the application consistency snapshot creation fails with the error ID 0x80040154  "Class not registered". </br>

Refer [article for VSS writer installation troubleshooting](./vmware-azure-troubleshoot-push-install.md#vss-installation-failures)

### VSS writer is disabled - Error 2147943458

**Workaround**: To generate an application consistency tag, Azure Site Recovery uses Microsoft Volume Shadow copy Service (VSS). It installs a VSS Provider for its operation to take app consistency snapshots. This VSS Provider is installed as a service. In case the VSS Provider service is disabled, the application consistency snapshot creation fails with the error ID "The specified service is disabled and cannot be started(0x80070422)". </br>


- If VSS is disabled,
    - Verify that the startup type of the VSS Provider service is set to **Automatic**.
    - Restart the following services:
        - VSS service
        - Azure Site Recovery VSS Provider
        - VDS service

###  VSS PROVIDER NOT_REGISTERED - Error 2147754756

**Workaround**: To generate an application consistency tag, Azure Site Recovery uses Microsoft Volume Shadow copy Service (VSS).
Check if the Azure Site Recovery  VSS Provider service is installed or not. </br>

- Retry the Provider installation using the following commands:
- Uninstall existing provider: C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Uninstall.cmd
- Reinstall: C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Install.cmd

Verify that the startup type of the VSS Provider service is set to **Automatic**.
    - Restart the following services:
        - VSS service
        - Azure Site Recovery VSS Provider
        - VDS service

## Next steps

If you need more help, post your question on the [Microsoft Q&A question page for Azure Site Recovery](/answers/topics/azure-site-recovery.html). We have an active community, and one of our engineers can assist you.
