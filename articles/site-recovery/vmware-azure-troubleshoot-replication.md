---
title: Troubleshoot replication issues for disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery | Microsoft Docs
description: This article provides troubleshooting information for common replication issues during disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery.
author: mayurigupta13
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 08/2/2019
ms.author: mayg

---
# Troubleshoot replication issues for VMware VMs and physical servers

This article describes some common issues and specific errors you might encounter when you replicate on-premises VMware VMs and physical servers to Azure using [Site Recovery](site-recovery-overview.md).

## Step 1: Monitor process server health

Site Recovery uses the [process server](vmware-physical-azure-config-process-server-overview.md#process-server) to receive and optimize replicated data, and send it to Azure.

We recommend that you monitor the health of process servers in  portal, to ensure that they are connected and working properly, and that replication is progressing for the source machines associated with the process server.

- [Learn about](vmware-physical-azure-monitor-process-server.md) monitoring process servers.
- [Review best practices](vmware-physical-azure-troubleshoot-process-server.md#best-practices-for-process-server-deployment)
- [Troubleshoot](vmware-physical-azure-troubleshoot-process-server.md#check-process-server-health) process server health.

## Step 2: Troubleshoot connectivity and replication issues

Initial and ongoing replication failures often are caused by connectivity issues between the source server and the process server or between the process server and Azure.

To solve these issues, [troubleshoot connectivity and replication](vmware-physical-azure-troubleshoot-process-server.md#check-connectivity-and-replication).




## Step 3: Troubleshoot source machines that aren't available for replication

When you try to select the source machine to enable replication by using Site Recovery, the machine might not be available for one of the following reasons:

* **Two virtual machines with same instance UUID**: If two virtual machines under the vCenter have the same instance UUID, the first virtual machine discovered by the configuration server is shown in the Azure portal. To resolve this issue, ensure that no two virtual machines have the same instance UUID. This scenario is commonly seen in instances where a backup VM becomes active and is logged into our discovery records. Refer to [Azure Site Recovery VMware-to-Azure: How to clean up duplicate or stale entries](https://social.technet.microsoft.com/wiki/contents/articles/32026.asr-vmware-to-azure-how-to-cleanup-duplicatestale-entries.aspx) to resolve.
* **Incorrect vCenter user credentials**: Ensure that you added the correct vCenter credentials when you set up the configuration server by using the OVF template or unified setup. To verify the credentials that you added during setup, see [Modify credentials for automatic discovery](vmware-azure-manage-configuration-server.md#modify-credentials-for-automatic-discovery).
* **vCenter insufficient privileges**: If the permissions provided to access vCenter don't have the required permissions, failure to discover virtual machines might occur. Ensure that the permissions described in [Prepare an account for automatic discovery](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-automatic-discovery) are added to the vCenter user account.
* **Azure Site Recovery management servers**: If the virtual machine is used as management server under one or more of the following roles - Configuration server /scale-out process server / Master target server, then you will not be able to choose the virtual machine from portal. Managements servers cannot be replicated.
* **Already protected/failed over through Azure Site Recovery services**: If the virtual machine is already protected or failed over through Site Recovery, the virtual machine isn't available to select for protection in the portal. Ensure that the virtual machine you're looking for in the portal isn't already protected by any other user or under a different subscription.
* **vCenter not connected**: Check if vCenter is in connected state. To verify, go to Recovery Services vault > Site Recovery Infrastructure > Configuration Servers > Click on respective configuration server > a blade opens on your right with details of associated servers. Check if vCenter is connected. If it's in a "Not Connected" state, resolve the issue and then [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server) on the portal. After this, virtual machine will be listed on the portal.
* **ESXi powered off**: If ESXi host under which the virtual machine resides is in powered off state, then virtual machine will not be listed or will not be selectable on the Azure portal. Power on the ESXi host, [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server) on the portal. After this, virtual machine will be listed on the portal.
* **Pending reboot**: If there is a pending reboot on the virtual machine, then you will not be able to select the machine on Azure portal. Ensure to complete the pending reboot activities, [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server). After this, virtual machine will be listed on the portal.
* **IP not found**: If the virtual machine doesn't have a valid IP address associated with it, then you will not be able to select the machine on Azure portal. Ensure to assign a valid IP address to the virtual machine, [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server). After this, virtual machine will be listed on the portal.

### Troubleshoot protected virtual machines greyed out in the portal

Virtual machines that are replicated under Site Recovery aren't available in the Azure portal if there are duplicate entries in the system. To learn how to delete stale entries and resolve the issue, refer to [Azure Site Recovery VMware-to-Azure: How to clean up duplicate or stale entries](https://social.technet.microsoft.com/wiki/contents/articles/32026.asr-vmware-to-azure-how-to-cleanup-duplicatestale-entries.aspx).

## No crash consistent recovery point available for the VM in the last 'XXX' minutes

Some of the most common issues are listed below

### Initial replication issues [error 78169]

Over an above ensuring that there are no connectivity, bandwidth or time sync related issues, ensure that:

- No anti-virus software is blocking Azure Site Recovery. Learn [more](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) on folder exclusions required for Azure Site Recovery.

### Source machines with high churn [error 78188]

Possible Causes:
- The data change rate (write bytes/sec) on the listed disks of the virtual machine is more than the [Azure Site Recovery supported limits](site-recovery-vmware-deployment-planner-analyze-report.md#azure-site-recovery-limits) for the replication target storage account type.
- There is a sudden spike in the churn rate due to which high amount of data is pending for upload.

To resolve the issue:
- Ensure that the target storage account type (Standard or Premium) is provisioned as per the churn rate requirement at source.
- If you are already replicating to a Premium managed disk (asrseeddisk type), ensure that the size of the disk supports the observed churn rate as per Site Recovery limits. You can increase the size of the asrseeddisk if required. Follow the below steps:
    - Navigate to the Disks blade of the impacted replicated machine and copy the replica disk name
    - Navigate to this replica managed disk
    - You may see a banner on the Overview blade saying that a SAS URL has been generated. Click on this banner and cancel the export. Ignore this step if you do not see the banner.
    - As soon as the SAS URL is revoked, go to Configuration blade of the Managed Disk and increase the size so that Azure Site Recovery supports the observed churn rate on source disk
- If the observed churn is temporary, wait for a few hours for the pending data upload to catch up and to create recovery points.
- If the disk contains non-critical data like temporary logs, test data etc., consider moving this data elsewhere or completely exclude this disk from replication
- If the problem continues to persist, use the Site Recovery [deployment planner](site-recovery-deployment-planner.md#overview) to help plan replication.

### Source machines with no heartbeat [error 78174]

This happens when Azure Site Recovery Mobility agent on the Source Machine is not communicating with the Configuration Server (CS).

To resolve the issue, use the following steps to verify the network connectivity from the source VM to the Config Server:

1. Verify that the Source Machine is running.
2. Sign in to the Source Machine using an account that has administrator privileges.
3. Verify that the following services are running and if not restart the services:
   - Svagents (InMage Scout VX Agent)
   - InMage Scout Application Service
4. On the Source Machine, examine the logs at the location for error details:

    *C:\Program Files (X86)\Microsoft Azure Site Recovery\agent\svagents\*.log*

### Process server with no heartbeat [error 806]
In case there is no heartbeat from the Process Server (PS), check that:
1. PS VM is up and running
2. Check following logs on the PS for error details:

    *C:\ProgramData\ASR\home\svsystems\eventmanager\*.log*\
    and\
    *C:\ProgramData\ASR\home\svsystems\monitor_protection\*.log*

### Master target server with no heartbeat [error 78022]

This happens when Azure Site Recovery Mobility agent on the Master Target is not communicating with the Configuration Server.

To resolve the issue, use the following steps to verify the service status:

1. Verify that the Master Target VM is running.
2. Sign in to the Master Target VM using an account that has administrator privileges.
    - Verify that the svagents service is running. If it is running, restart the service
    - Check the logs at the location for error details:

        *C:\Program Files (X86)\Microsoft Azure Site Recovery\agent\svagents\*.log*
3. To register master target with configuration server, navigate to folder **%PROGRAMDATA%\ASR\Agent**, and run the following on command prompt:
   ```
   cmd
   cdpcli.exe --registermt

   net stop obengine

   net start obengine

   exit
   ```

## Error ID 78144 - No app-consistent recovery point available for the VM in the last 'XXX' minutes

Enhancements have been made in mobility agent [9.23](vmware-physical-mobility-service-overview.md#mobility-service-agent-version-923-and-higher) & [9.27](site-recovery-whats-new.md#update-rollup-39) versions to handle VSS installation failure behaviors. Ensure that you are on the latest versions for best guidance on troubleshooting VSS failures.

Some of the most common issues are listed below

#### Cause 1: Known issue in SQL server 2008/2008 R2
**How to fix** : There is a known issue with SQL server 2008/2008 R2. Please refer this KB article [Azure Site Recovery Agent or other non-component VSS backup fails for a server hosting SQL Server 2008 R2](https://support.microsoft.com/help/4504103/non-component-vss-backup-fails-for-server-hosting-sql-server-2008-r2)

#### Cause 2: Azure Site Recovery jobs fail on servers hosting any version of SQL Server instances with AUTO_CLOSE DBs
**How to fix** : Refer Kb [article](https://support.microsoft.com/help/4504104/non-component-vss-backups-such-as-azure-site-recovery-jobs-fail-on-ser)


#### Cause 3: Known issue in SQL Server 2016 and 2017
**How to fix** : Refer Kb [article](https://support.microsoft.com/help/4493364/fix-error-occurs-when-you-back-up-a-virtual-machine-with-non-component)

#### Cause 4: App-Consistency not enabled on Linux servers
**How to fix** : Azure Site Recovery for Linux Operation System supports application custom scripts for app-consistency. The custom script with pre and post options will be used by the Azure Site Recovery Mobility Agent for app-consistency. [Here](/azure/site-recovery/site-recovery-faq#replication) are the steps to enable it.

### More causes due to VSS related issues:

To troubleshoot further, Check the files on the source machine to get the exact error code for failure:

*C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\Application Data\ApplicationPolicyLogs\vacp.log*

How to locate the errors in the file?
Search for the string "vacpError"  by opening the vacp.log file in an editor

`Ex: `**`vacpError`**`:220#Following disks are in FilteringStopped state [\\.\PHYSICALDRIVE1=5, ]#220|^|224#FAILED: CheckWriterStatus().#2147754994|^|226#FAILED to revoke tags.FAILED: CheckWriterStatus().#2147754994|^|`

In the above example **2147754994** is the error code that tells you about the failure as shown below

#### VSS writer is not installed - Error 2147221164

*How to fix*: To generate application consistency tag, Azure Site Recovery uses Microsoft Volume Shadow copy Service (VSS). It installs a VSS Provider for its operation to take app consistency snapshots. This VSS Provider is installed as a service. In case the VSS Provider service is not installed, the application consistency snapshot creation fails with the error ID 0x80040154  "Class not registered". </br>
Refer [article for VSS writer installation troubleshooting](./vmware-azure-troubleshoot-push-install.md#vss-installation-failures)

#### VSS writer is disabled - Error 2147943458

**How to fix**: To generate application consistency tag, Azure Site Recovery uses Microsoft Volume Shadow copy Service (VSS). It installs a VSS Provider for its operation to take app consistency snapshots. This VSS Provider is installed as a service. In case the VSS Provider service is disabled, the application consistency snapshot creation fails with the error ID "The specified service is disabled and cannot be started(0x80070422)". </br>

- If VSS is disabled,
    - Verify that the startup type of the VSS Provider service is set to **Automatic**.
    - Restart the following services:
        - VSS service
        - Azure Site Recovery VSS Provider
        - VDS service

####  VSS PROVIDER NOT_REGISTERED - Error 2147754756

**How to fix**: To generate application consistency tag, Azure Site Recovery uses Microsoft Volume Shadow copy Service (VSS).
Check if the Azure Site Recovery  VSS Provider service is installed or not. </br>

- Retry the Provider installation using the following commands:
- Uninstall existing provider: C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Uninstall.cmd
- Reinstall: C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Install.cmd

Verify that the startup type of the VSS Provider service is set to **Automatic**.
    - Restart the following services:
        - VSS service
        - Azure Site Recovery VSS Provider
        - VDS service

## Error ID 95001 - Insufficient permissions found

This error occurs when trying to enable replication and the application folders don't have enough permissions.

**How to fix**: To resolve this issue, make sure the IUSR user has owner role for all the below mentioned folders -

- *C\ProgramData\Microsoft Azure Site Recovery\private*
- The installation directory. For example, if installation directory is F drive, then provide the correct permissions to -
    - *F:\Program Files (x86)\Microsoft Azure Site Recovery\home\svsystems*
- The *\pushinstallsvc* folder in installation directory. For example, if installation directory is F drive, provide the correct permissions to -
    - *F:\Program Files (x86)\Microsoft Azure Site Recovery\home\svsystems\pushinstallsvc*
- The *\etc* folder in installation directory. For example, if installation directory is F drive, provide the correct permissions to -
    - *F:\Program Files (x86)\Microsoft Azure Site Recovery\home\svsystems\etc*
- *C:\Temp*
- *C:\thirdparty\php5nts*
- All the items under the below path -
    - *C:\thirdparty\rrdtool-1.2.15-win32-perl58\rrdtool\Release\**

## Next steps

If you need more help, post your question in the [Microsoft Q&A question page for Azure Site Recovery](/answers/topics/azure-site-recovery.html). We have an active community, and one of our engineers can assist you.
