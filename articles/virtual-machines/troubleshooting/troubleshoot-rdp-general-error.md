---
title: Troubleshoot an RDP general error to a Windows VM in Azure | Microsoft Docs
description: Learn how to troubleshoot an RDP general error to a Windows VM in Azure | Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 10/31/2018
ms.author: genli
---

# Troubleshoot an RDP general error in Azure VM

This article describes a general error you may experience when you make a Remote Desktop Protocol (RDP) connection to a Windows Virtual Machine (VM) in Azure.

## Symptom

When you make an RDP connection to a Window VM in Azure, you may receive the following general error message:

**Remote Desktop can't connect to the remote computer for one of these reasons:**

1. **Remote access to the server is not enabled**

2. **The remote Computer is turned off**

3. **The remote computer is not available on the network**

**Make sure the remote computer is turned on and connected to the network, and that remote access is enabled.**

## Cause

This problem may occur because of the following causes:

### Cause 1

The RDP component is disabled as follows:

- At the component level
- At the listener level
- On the terminal server
- On the Remote Desktop Session Host role

### Cause 2

Remote Desktop Services (TermService) isn't running.

### Cause 3

The RDP listener is misconfigured.

## Solution

Before you follow these steps, take a snapshot of the OS disk of the affected VM as a backup. To resolve this problem, use Serial control or repair the VM offline.

### Serial Console

#### Step 1: Open CMD instance in Serial console

1. Access the [Serial Console](serial-console-windows.md) by selecting **Support & Troubleshooting** > **Serial console (Preview)**. If the feature is enabled on the VM, you can connect the VM successfully.

2. Create a new channel for a CMD instance. Type **CMD** to start the channel to get the channel name.

3. Switch to the channel that running the CMD instance, in this case it should be channel 1.

   ```
   ch -si 1
   ```

#### Step 2: Check the values of RDP registry keys:

1. Check if the RDP is disabled by group polices.

    ```
    REM Get the group policy setting
    reg query "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDenyTSConnections
    ```
    If the group policy states that RDP is disabled (fDenyTSConnections value is 0x1), run the following command to enable the TermService service. If the registry key is not found, there is no group policy configured to disabled the RDP. You can move to the next step.

    ```
    REM update the fDenyTSConnections value to enable TermService service
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDenyTSConnections /t REG_DWORD /d 0 /f
    ```
    > [!NOTE]
    > This step enables the TermService service temporarily. The change will be reset when the group policy settings are refreshed. To resolve the issue, you need to check if the TermService service is disabled by the local group policy or the domain group policy, and then update the policy settings correspondingly.
    
2. Check the current remote connection configuration.
    ```
    REM Get the local remote connection setting
    reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections
    ```
    If the command returns 0x1, the VM is not allowing remote connection. Then, allow remote connection using the following command:
     ```
     reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
     ```
    
1. Check the current configuration of the terminal server.

    ```
    REM Get the local remote connection setting
    reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSEnabled
    ```

      If the command returns 0, the terminal server is disabled. Then, enable the terminal server as follows:

      ```
      reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSEnabled /t REG_DWORD /d 1 /f
      ```

3. The Terminal Server module is set to drain mode if the server is on a terminal server farm (RDS or Citrix). Check the current mode of the Terminal Server module.

      ```
      reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSServerDrainMode
      ```

      If the command returns 1, the Terminal Server module is set to drain mode. Then, set the module to working mode as follows:

      ```
      reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSServerDrainMode /t REG_DWORD /d 0 /f
      ```

4. Check whether you can connect to the terminal server.

      ```
      reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSUserEnabled
      ```

      If the command returns 1, you can't connect to the terminal server. Then, enable the connection as follows:

      ```
      reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSUserEnabled /t REG_DWORD /d 0 /f
      ```
5. Check the current configuration of the RDP listener.

      ```
      reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation
      ```

      If the command returns 0, the RDP listener is disabled. Then, enable the listener as follows:

      ```
      reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation /t REG_DWORD /d 1 /f
      ```

6. Check whether you can connect to the RDP listener.

      ```
      reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled
      ```

   If the command returns 1, you can't connect to the RDP listener. Then, enable the connection as follows:

      ```
      reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled /t REG_DWORD /d 0 /f
      ```

7. Restart the VM.

8. Exit from the CMD instance by typing `exit`, and then press **Enter** two times.

9. Restart the VM by typing `restart`, and then connect to the VM.

If the problem still happens, move to the step 2.

#### Step 2: Enable remote desktop services

For more information, see [Remote Desktop Services isn't starting on an Azure VM](troubleshoot-remote-desktop-services-issues.md).

#### Step 3: Reset RDP listener

For more information, see [Remote Desktop disconnects frequently in Azure VM](troubleshoot-rdp-intermittent-connectivity.md).

### Offline repair

#### Step 1: Turn on Remote Desktop

1. [Attach the OS disk to a recovery VM](./troubleshoot-recovery-disks-portal-windows.md).
2. Start a Remote Desktop connection to the recovery VM.
3. Make sure that the disk is flagged as **Online** in the Disk Management console. Note the drive letter that is assigned to the attached OS disk.
4. Start a Remote Desktop connection to the recovery VM.
5. Open an elevated command prompt session (**Run as administrator**). Run the following scripts. In this script, we assume that the drive letter that is assigned to the attached OS disk is F. Replace this drive letter with the appropriate value for your VM.

      ```
      reg load HKLM\BROKENSYSTEM F:\windows\system32\config\SYSTEM.hiv 
      reg load HKLM\BROKENSOFTWARE F:\windows\system32\config\SOFTWARE.hiv 
 
      REM Ensure that Terminal Server is enabled 

      reg add "HKLM\BROKENSYSTEM\ControlSet001\control\Terminal Server" /v TSEnabled /t REG_DWORD /d 1 /f 
      reg add "HKLM\BROKENSYSTEM\ControlSet002\control\Terminal Server" /v TSEnabled /t REG_DWORD /d 1 /f 

      REM Ensure Terminal Service is not set to Drain mode 
      reg add "HKLM\BROKENSYSTEM\ControlSet001\control\Terminal Server" /v TSServerDrainMode /t REG_DWORD /d 0 /f 
      reg add "HKLM\BROKENSYSTEM\ControlSet002\control\Terminal Server" /v TSServerDrainMode /t REG_DWORD /d 0 /f 

      REM Ensure Terminal Service has logon enabled 
      reg add "HKLM\BROKENSYSTEM\ControlSet001\control\Terminal Server" /v TSUserEnabled /t REG_DWORD /d 0 /f 
      reg add "HKLM\BROKENSYSTEM\ControlSet002\control\Terminal Server" /v TSUserEnabled /t REG_DWORD /d 0 /f 

      REM Ensure the RDP Listener is not disabled 
      reg add "HKLM\BROKENSYSTEM\ControlSet001\control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation /t REG_DWORD /d 1 /f 
      reg add "HKLM\BROKENSYSTEM\ControlSet002\control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation /t REG_DWORD /d 1 /f 

      REM Ensure the RDP Listener accepts logons 
      reg add "HKLM\BROKENSYSTEM\ControlSet001\control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled /t REG_DWORD /d 0 /f 
      reg add "HKLM\BROKENSYSTEM\ControlSet002\control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled /t REG_DWORD /d 0 /f 

      REM RDP component is enabled 
      reg add "HKLM\BROKENSYSTEM\ControlSet001\control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f 
      reg add "HKLM\BROKENSYSTEM\ControlSet002\control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f 
      reg add "HKLM\BROKENSOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDenyTSConnections /t REG_DWORD /d 0 /f 

      reg unload HKLM\BROKENSYSTEM 
      reg unload HKLM\BROKENSOFTWARE 
      ```

6. If the VM is domain joined, check the following registry key to see if there is a group policy that will disable RDP. 

      ```
      HKLM\BROKENSOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\fDenyTSConnectionS
      ```

      If this key value is set to 1 that means RDP is disabled by the policy. To enable Remote Desktop through the GPO policy, change the following policy from domain controller:

   
      **Computer Configuration\Policies\Administrative Templates:**

      Policy definitions\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Connections\Allow users to connect remotely by using Remote Desktop Services
  
1. Detach the disk from the rescue VM.
1. [Create a new VM from the disk](../windows/create-vm-specialized.md).

If the problem still happens, move to the step 2.

#### Step 2: Enable remote desktop services

For more information, see [Remote Desktop Services isn't starting on an Azure VM](troubleshoot-remote-desktop-services-issues.md).

#### Step 3: Reset RDP listener

For more information, see [Remote Desktop disconnects frequently in Azure VM](troubleshoot-rdp-intermittent-connectivity.md).

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
