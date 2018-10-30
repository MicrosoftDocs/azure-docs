---
title: Remote Desktop Services isn't starting on an Azure VM | Microsoft Docs
description: Learn how to troubleshoot issues with Remote Desktop Services when you connect to a virtual machine | Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: cshepard
editor: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 10/23/2018
ms.author: genli
---

# Remote Desktop Services isn't starting on an Azure VM

This article describes how to troubleshoot issues when you connect to an Azure virtual machine (VM) and Remote Desktop Services, or TermService, isn't starting or fails to start.

> [!NOTE]  
> Azure has two different deployment models to create and work with resources: [Azure Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article describes using the Resource Manager deployment model. We recommend that you use this model for new deployments instead of the classic deployment model.

## Symptoms

When you try to connect to a VM, you experience the following scenarios:

- The VM screenshot shows the operating system is fully loaded and waiting for credentials.

    ![Screenshot of the VM status](./media/troubleshoot-remote-desktop-services-issues/login-page.png)

- You remotely view the event logs in the VM by using Event Viewer. You see that Remote Desktop Services, TermServ, isn't starting or is failing to start. The following log is a sample:

    **Log Name**:      System </br>
    **Source**:        Service Control Manager </br>
    **Date**:          12/16/2017 11:19:36 AM</br>
    **Event ID**:      7022</br>
    **Task Category**: None</br>
    **Level**:         Error</br>
    **Keywords**:      Classic</br>
    **User**:          N/A</br>
    **Computer**:      vm.contoso.com</br>
    **Description**: 
    The Remote Desktop Services service hung on starting.​ 

    You can also use the Serial Access Console feature to look for these errors by using the following query: 

        wevtutil qe system /c:1 /f:text /q:"Event[System[Provider[@Name='Service Control Manager'] and EventID=7022 and TimeCreated[timediff(@SystemTime) <= 86400000]]]" | more 

## Cause
 
This problem occurs because Remote Desktop Services isn't running on the VM. The cause can depend on the following scenarios: 

- The TermService service is set to **Disabled**. 
- The TermService service is crashing or hanging. 

## Solution

To troubleshoot this issue, use the Serial Console or [repair the VM offline](#repair-the-vm-offline) by attaching the OS disk of the VM to a recovery VM.

### Use Serial Console

1. Access the [Serial Console](serial-console-windows.md) by selecting **Support & Troubleshooting** > **Serial console**. If the feature is enabled on the VM, you can connect the VM successfully.

2. Create a new channel for a CMD instance. Enter **CMD** to start the channel and get the channel name.

3. Switch to the channel that runs the CMD instance. In this case, it should be channel 1:

   ```
   ch -si 1
   ```

4. Select **Enter** again and enter a valid username and password, local or domain ID, for the VM.

5. Query the status of the TermService service:

   ```
   sc query TermService
   ```

6. If the service status shows **Stopped**, try to start the service:

    ```
    sc start TermService
     ``` 

7. Query the service again to make sure that the service is started successfully:

   ```
   sc query TermService
   ```
    If the service fails to start, follow the solution based on the error you received:

    |  Error |  Suggestion |
    |---|---|
    |5- ACCESS DENIED |See [TermService service is stopped because of an Access Denied error](#termService-service-is-stopped-because-of-an-access-denied-error). |
    |1058 - ERROR_SERVICE_DISABLED  |See [TermService service is disabled.](#termService-service-is-disabled).  |
    |1059 - ERROR_CIRCULAR_DEPENDENCY |[Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.|
    |1068 - ERROR_SERVICE_DEPENDENCY_FAIL|[Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.|
    |1069 - ERROR_SERVICE_LOGON_FAILED  |[Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.    |
    |1070 - ERROR_SERVICE_START_HANG   | [Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.  |
    |1077 - ERROR_SERVICE_NEVER_STARTED   | See [TermService service is disabled](#termService-service-is-disabled).  |
    |1079 - ERROR_DIFERENCE_SERVICE_ACCOUNT   |[Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly. |
    |1753   |[Contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.   |

#### TermService service is stopped because of an Access Denied error

1. Connect to [Serial Console](serial-console-windows.md#) and open a PowerShell instance.
2. Download the Process Monitor tool by running the following script:

        remove-module psreadline  
        $source = "https://download.sysinternals.com/files/ProcessMonitor.zip" 
        $destination = "c:\temp\ProcessMonitor.zip" 
        $wc = New-Object System.Net.WebClient 
        $wc.DownloadFile($source,$destination) 
3. Now start a **procmon** trace:

        procmon /Quiet /Minimized /BackingFile c:\temp\ProcMonTrace.PML 
4. Reproduce the problem by starting the service that's giving access deny: 

        sc start TermService 
        
    When it fails, terminate the Process Monitor trace:

        procmon /Terminate 
5. Collect the file **c:\temp\ProcMonTrace.PML**, open it by using **procmon**. Then filter by **Result is ACCESS DENIED** as shown in the following screenshot：

    ![Filter by Result in Process Monitor](./media/troubleshoot-remote-desktop-services-issues/process-monitor-access-denined.png)

 
6. Fix the registry keys, folders, or files that are on the output. Usually, this problem is caused when the sign in account that's used on the service doesn't have ACL permission to access these objects. To know the correct ACL permission for the sign in account, you can check on a healthy VM. 

#### TermService service is disabled

1.	Restore the service to its default startup value:

        sc config TermService start= demand 
        
2.	Start the service:

        sc start TermService 
3.	Query its status again to ensure the service is running:
        sc query TermService 
4.	Try to conntet to VM by using Remote desktop.


### Repair the VM offline

#### Attach the OS disk to a recovery VM

1. [Attach the OS disk to a recovery VM](../windows/troubleshoot-recovery-disks-portal.md).
2. Start a Remote Desktop connection to the recovery VM. Make sure that the attached disk is flagged as **Online** in the Disk Management console. Note the drive letter that is assigned to the attached OS disk.
3.  Open an elevated command prompt instance (**Run as administrator**), and then run the following script. We assume that the drive letter that is assigned to the attached OS disk is F. Replace it with the appropriate value in your VM. 

        reg load HKLM\BROKENSYSTEM F:\windows\system32\config\SYSTEM.hiv
        
        REM Set default values back on the broken service 
        reg add "HKLM\BROKENSYSTEM\ControlSet001\services\TermService" /v start /t REG_DWORD /d 3 /f
        reg add "HKLM\BROKENSYSTEM\ControlSet001\services\TermService" /v ObjectName /t REG_SZ /d "NT Authority\NetworkService“ /f
        reg add "HKLM\BROKENSYSTEM\ControlSet001\services\TermService" /v type /t REG_DWORD /d 16 /f
        reg add "HKLM\BROKENSYSTEM\ControlSet002\services\TermService" /v start /t REG_DWORD /d 3 /f
        reg add "HKLM\BROKENSYSTEM\ControlSet002\services\TermService" /v ObjectName /t REG_SZ /d "NT Authority\NetworkService" /f
        reg add "HKLM\BROKENSYSTEM\ControlSet002\services\TermService" /v type /t REG_DWORD /d 16 /f
4. [Detach the OS disk and recreate the VM](../windows/troubleshoot-recovery-disks-portal.md), and then check whether the issue is resolved.

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved.
