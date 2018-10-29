---
title: Troubleshoot an RDP general error to a Windows VM in Azure | Microsoft Docs
description: Learn how to troubleshoot an RDP general error to a Windows VM in Azure | Microsoft Docs
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
ms.date: 10/30/2018
ms.author: genli
---

# Troubleshoot an RDP general error to a Windows VM in Azure

This article describes a general error you may experience when you make a Remote Desktop Protocol (RDP) connection to a Windows Virtual Machine (VM) in Azure.

## Symptoms

When you make an RDP connection to a Window VM in Azure, you may receive the following general error message:

```
Remote Desktop can't connect to the remote computer for one of these reasons:

1. Remote access to the server is not enabled

2. The remote Computer is turned off

3. The remote computer is not available on the network

Make sure the remote computer is turned on and connected to the network, and that remote access is enabled.
```

## Cause

This problem may occur because of the following causes:

### Cause 1

The RDP component is disabled in the component level, listener level, terminal server, or Remote Desktop Session Host role.

### Cause 2

Remote Desktop Services (TermService) isn't running.

### Cause 3

The RDP listener is misconfigured.

## Solutions

To resolve this problem, [back up the OS disk](../windows/snapshot-copy-managed-disk.md), and [attach the OS disk to a rescue VM](troubleshoot-recovery-disks-portal-windows.md), and then follow the solution options accordingly, or try the solutions one by one.

### Solution 1: Using the Serial Console

1. Access the [Serial Console](serial-console-windows.md) by selecting **Support & Troubleshooting** > **Serial console (Preview)**. If the feature is enabled on the VM, you can connect the VM successfully.

2. Create a new channel for a CMD instance. Type **CMD** to start the channel to get the channel name.

3. Switch to the channel that running the CMD instance, in this case it should be channel 1.

  ```
  ch -si 1
  ```

4. Enable Remote Desktop through the GPO policy by changing the following policy:

   ```
   Computer Configuration\Policies\Administrative Templates: Policy definitions\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Connections\Allow users to connect remotely by using Remote Desktop Services
   ```

5. Some other registry keys that could cause this problem, check the values of the registry keys as follows:

   1. Make sure that the RDP component is enabled.

   ```
   REM Get the local policy
   reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server " /v fDenyTSConnections

   REM Get the domain policy if any
   reg query "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDenyTSConnections
   ```

   If the domain policy exists, the setup on the local policy is overwritten.

      - If the domain policy states that RDP is disabled (1), then update the AD policy.
      - If the domain policy states that RDP is enabled (0), then no update is needed.

   If the domain policy doesn't exist and the local policy states that RDP is disabled (1), enable RDP by using the following command:

   ```
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
   ```

   2. Check the current configuration of the terminal server.

   ```
   reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSEnabled
   ```

   3. If the command returns 0, the terminal server is disabled. Then, enable the terminal server as follows:

   ```
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSEnabled /t REG_DWORD /d 1 /f
   ```

   4. The Terminal Server module is set to drain mode if the server is on a terminal server farm (RDS or citrix). Check the current mode of the Terminal Server module.

   ```
   reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSServerDrainMode
   ```

   5. If the command returns 1, the Terminal Server module is set to drain mode. Then, set the module to working mode as follows:

   ```
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSServerDrainMode /t REG_DWORD /d 0 /f
   ```

   6. Check the logon process of the terminal server.

   ```
   reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSUserEnabled
   ```

   7. If the command returns 1, the terminal server is set to disabled logon process. Then, enable the logon as follows:

   ```
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v TSUserEnabled /t REG_DWORD /d 0 /f
   ```

   8. Check the current configuration of the RDP listener.

   ```
   reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation
   ```

   9. If the command returns 0, the RDP listener is disabled. Then, enable the listener as follows:

   ```
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation /t REG_DWORD /d 1 /f
   ```

   10. Check the logon process of the RDP listener.

   ```
   reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled
   ```

   11. If the command returns 1, the RDP listener is set to disabled logon process. Then, enable the logon as follows:

   ```
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled /t REG_DWORD /d 0 /f
   ```

6. Restart the VM.

7. Exist from the CMD instance by typing `exit`, and then press **Enter** two times.

8. Restart the VM by typing `restart`.

### Solution 2: offline approaches

> [!NOTE]  
> We assume that the drive letter that is assigned to the attached OS disk is F. Replace it with the appropriate value in your VM. The SYSTEM and SOFTWARE hives needs to be unmounted and then mounted.

1. Open an elevated CMD instance and run the following scripts on the rescue VM:

   ```
   reg load HKLM\BROKENSYSTEM f:\windows\system32\config\SYSTEM.hiv
   reg load HKLM\BROKENSOFTWARE f:\windows\system32\config\SOFTWARE.hiv

   REM Ensure that Terminal Server is enabled
   reg add "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server" /v TSEnabled /t REG_DWORD /d 1 /f
   reg add "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server" /v TSEnabled /t REG_DWORD /d 1 /f

   REM Ensure Terminal Service is not set to Drain mode
   reg add "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server" /v TSServerDrainMode /t REG_DWORD /d 0 /f
   reg add "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server" /v TSServerDrainMode /t REG_DWORD /d 0 /f

   REM Ensure Terminal Service has logon enabled
   reg add "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server" /v TSUserEnabled /t REG_DWORD /d 0 /f

   REM Ensure the RDP Listener is not disabled
   reg add "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation /t REG_DWORD /d 1 /f
   reg add "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server\Winstations\RDP-Tcp" /v fEnableWinStation /t REG_DWORD /d 1 /f

   REM Ensure the RDP Listener accepts logons
   reg add "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled /t REG_DWORD /d 0 /f
   reg add "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server\Winstations\RDP-Tcp" /v fLogonDisabled /t REG_DWORD /d 0 /f

   REM RDP component is enabled
   reg add "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
   reg add "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
   reg add "HKLM\BROKENSOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDenyTSConnections /t REG_DWORD /d 0 /f

   reg unload HKLM\BROKENSYSTEM
   reg unload HKLM\BROKENSOFTWARE
   ```

2. Mount the SYSTEM and SOFTWARE hives.

   ```
   reg load HKLM\BROKENSYSTEM f:\windows\system32\config\SYSTEM
   reg load HKLM\BROKENSOFTWARE f:\windows\system32\config\SOFTWARE
   ```

3. If the virtual machine is domain joined, RDP could be disabled at a policy level. To validate if it is the case, check the following registry key:

```
HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\fDenyTSConnectionS
```

4. If this key value is set to 1, RDP is disabled by the policy.

5. Enable Remote Desktop through the GPO policy by changing the following policy:

```
Computer Configuration\Policies\Administrative Templates: Policy definitions\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Connections\Allow users to connect remotely by using Remote Desktop Services
```

6. If this registry key doesn't exist, check the following registry key:

```
HKLM\System\CurrentControlSet\Control\Terminal Server\fDenyTSConnections
```

7. If this key is set to 1, RDP is turn off. Change the key value to 0.
8. Detach the disk from the rescue VM and wait about two minutes for Azure to release the disk.
9. [Create a new VM from the disk](../windows/create-vm-specialized.md).

## Additional resources

[Remote Desktop Services isn't starting on an Azure VM](troubleshoot-remote-desktop-services-issues.md)

[Remote Desktop disconnects frequently in Azure VM](troubleshoot-rdp-intermittent-connectivity.md)

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
