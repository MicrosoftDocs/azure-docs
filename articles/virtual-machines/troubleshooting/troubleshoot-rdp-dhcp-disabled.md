---
title: Cannot connect remotely to Azure Virtual Machines because the DHCP is disabled| Microsoft Docs
description: Learn how to troubleshoot RDP problem that is caused by DHCP client service is disabled in Microsoft Azure.| Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/13/2018
ms.author: genli
---
#  Cannot RDP to Azure Virtual Machines because the DHCP Client service is disabled

This article describes a problem in which you cannot remote desktop to Azure Windows Virtual Machines (VMs) after the DHCP Client service is disabled in the VM.


## Symptoms
You cannot make an RDP connection a VM in Azure because the DHCP Client service is disabled in the VM. When you check the screenshot in the [Boot diagnostics](../troubleshooting/boot-diagnostics.md) in the Azure portal, you see the VM boots normally and waits for credentials in the login screen. You remotely view the event logs in the VM by using Event Viewer. You see that the DHCP Client Service isn't started or fails to start. The following a sample log:

**Log Name**: System </br>
**Source**: Service Control Manager </br>
**Date**: 12/16/2015 11:19:36 AM </br>
**Event ID**: 7022 </br>
**Task Category**: None </br>
**Level**: Error </br>
**Keywords**: Classic</br>
**User**: N/A </br>
**Computer**: myvm.cosotos.com</br>
**Description**: The DHCP Client service hung on starting.</br>

For Resource Manager VMs, you can use Serial Access Console feature to query for the event logs 7022 using the following command:

    wevtutil qe system /c:1 /f:text /q:"Event[System[Provider[@Name='Service Control Manager'] and EventID=7022 and TimeCreated[timediff(@SystemTime) <= 86400000]]]" | more

For Classic VMs, you will need to work in OFFLINE mode and collect the logs manually.

## Cause

The DHCP Client Service is not running on the VM.

> [!NOTE]
> This article applies only for the DHCP Client service and not DHCP Server.

## Solution

Before you follow these steps, take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).

To resolve this problem, use Serial control to enable DHCP or [reset network interface](reset-network-interface.md) for the VM.

### Use Serial control

1. Connect to [Serial Console and open CMD instance](serial-console-windows.md#use-cmd-or-powershell-in-serial-console).
). If the Serial Console is not enabled on your VM, see [Reset network interface](reset-network-interface.md).
2. Check if the DHCP is disabled on the network interface:

        sc query DHCP
3. If the DHCP is stopped, try to start the service

        sc start DHCP

4. Query the service again to make sure that the service is started successfully.

        sc query DHCP

    Try to connect to the VM and see if the problem is resolved.
5. If the service does not start, use the following appropriate solution, based on the error message that you received:

    | Error  |  Solution |
    |---|---|
    | 5- ACCESS DENIED  | See [DHCP Client service is stopped because of an Access Denied error](#dhcp-client-service-is-stopped-because-of-an-access-denied-error).  |
    |1053 - ERROR_SERVICE_REQUEST_TIMEOUT   | See [DHCP Client service crashes or hangs](#dhcp-client-service-crashes-or-hangs).  |
    | 1058 - ERROR_SERVICE_DISABLED  | See [DHCP Client service is disabled](#dhcp-client-service-is-disabled).  |
    | 1059 - ERROR_CIRCULAR_DEPENDENCY  |[Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.   |
    | 1067 - ERROR_PROCESS_ABORTED |See [DHCP Client service crashes or hangs](#dhcp-client-service-crashes-or-hangs).   |
    |1068 - ERROR_SERVICE_DEPENDENCY_FAIL   | [Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.  |
    |1069 - ERROR_SERVICE_LOGON_FAILED   |  See [DHCP Client service fails because of logon failure](#dhcp-client-service-fails-because-of-logon-failure) |
    | 1070 - ERROR_SERVICE_START_HANG  | See [DHCP Client service crashes or hangs](#dhcp-client-service-crashes-or-hangs).  |
    | 1077 - ERROR_SERVICE_NEVER_STARTED  | See [DHCP Client service is disabled](#dhcp-client-service-is-disabled).  |
    |1079 - ERROR_DIFERENCE_SERVICE_ACCOUNT   | [Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.  |
    |1053 | [Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.  |


#### DHCP Client service is stopped because of an Access Denied error

1. Connect to [Serial Console](serial-console-windows.md) and open a PowerShell instance.
2. Download the Process Monitor tool by running the following script:

   ```powershell
   remove-module psreadline
   $source = "https://download.sysinternals.com/files/ProcessMonitor.zip"
   $destination = "c:\temp\ProcessMonitor.zip"
   $wc = New-Object System.Net.WebClient
   $wc.DownloadFile($source,$destination)
   ```
3. Now start a **procmon** trace:

   ```
   procmon /Quiet /Minimized /BackingFile c:\temp\ProcMonTrace.PML
   ```
4. Reproduce the problem by starting the service that's generating the **Access Denied** message:

   ```
   sc start DHCP
   ```

   When it fails, terminate the Process Monitor trace:

   ```
   procmon /Terminate
   ```
5. Collect the **c:\temp\ProcMonTrace.PML** file:

    1. [Attach a data disk to the VM](../windows/attach-managed-disk-portal.md
).
    2. Use Serial Console you can copy the file to the new drive. For example, `copy C:\temp\ProcMonTrace.PML F:\`. In this command, F is the driver letter of the attached data disk. Replace the letter as appropriate with the correct value.
    3. Detach the data drive and then attach it to a working VM that has Process Monitor ubstakke installed.

6. Open **ProcMonTrace.PML** by using Process Monitor on the working VM. Then filter by **Result is ACCESS DENIED**, as shown in the following screenshot：

    ![Filter by result in Process Monitor](./media/troubleshoot-remote-desktop-services-issues/process-monitor-access-denined.png)

7. Fix the registry keys, folders, or files that are on the output. Usually, this problem is caused when the sign-in account that's used on the service doesn't have ACL permission to access these objects. To determine the correct ACL permission for the sign-in account, you can check on a healthy VM.

#### DHCP Client service is disabled

1. Restore the service to its default startup value:

   ```
   sc config DHCP start= auto
   ```

2. Start the service:

   ```
   sc start DHCP
   ```

3. Query the service status again to make sure it's running:

   ```
   sc query DHCP
   ```

4. Try to connect to the VM by using Remote Desktop.

#### DHCP Client service fails because of logon failure

1. Because this problem occurs if the startup account of this service was changed, revert the account to its default status:

        sc config DHCP obj= 'NT Authority\Localservice'
2. Start the service:

        sc start DHCP
3. Try to connect to the VM by using Remote Desktop.

#### DHCP Client service crashes or hangs

1. If the service status is stuck in the **Starting** or **Stopping** state, try to stop the service:

        sc stop DHCP
2. Isolate the service on its own ‘svchost’ container:

        sc config DHCP type= own
3. Start the service:

        sc start DHCP
4. If the service still does not start, [Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

### Repair the VM offline

#### Attach the OS disk to a recovery VM

1. [Attach the OS disk to a recovery VM](../windows/troubleshoot-recovery-disks-portal.md).
2. Start a Remote Desktop connection to the recovery VM. Make sure that the attached disk is flagged as **Online** in the Disk Management console. Note the drive letter that's assigned to the attached OS disk.
3.  Open an elevated command prompt instance (**Run as administrator**). Then run the following script. This script assumes that the drive letter that's assigned to the attached OS disk is **F**. Replace the letter as appropriate with the value in your VM.

    ```
    reg load HKLM\BROKENSYSTEM F:\windows\system32\config\SYSTEM

    REM Set default values back on the broken service
    reg add "HKLM\BROKENSYSTEM\ControlSet001\services\DHCP" /v start /t REG_DWORD /d 2 /f
    reg add "HKLM\BROKENSYSTEM\ControlSet001\services\DHCP" /v ObjectName /t REG_SZ /d "NT Authority\LocalService" /f
    reg add "HKLM\BROKENSYSTEM\ControlSet001\services\DHCP" /v type /t REG_DWORD /d 16 /f
    reg add "HKLM\BROKENSYSTEM\ControlSet002\services\DHCP" /v start /t REG_DWORD /d 2 /f
    reg add "HKLM\BROKENSYSTEM\ControlSet002\services\DHCP" /v ObjectName /t REG_SZ /d "NT Authority\LocalService" /f
    reg add "HKLM\BROKENSYSTEM\ControlSet002\services\DHCP" /v type /t REG_DWORD /d 16 /f

    reg unload HKLM\BROKENSYSTEM
    ```

4. [Detach the OS disk and recreate the VM](../windows/troubleshoot-recovery-disks-portal.md). Then check whether the problem is resolved.

## Next steps

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved.