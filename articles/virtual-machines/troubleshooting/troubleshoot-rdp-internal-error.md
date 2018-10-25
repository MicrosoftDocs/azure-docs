---
title: An internal error has occurred when you remote desktop to Azure VM | Microsoft Docs
description: Learn how to troubleshoot the RDP internal errors that occurs| Microsoft Docs
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
ms.date: 10/22/2018
ms.author: genli
---

#  An internal error when you connect to Azure VM through Windows Remote Desktop 

This article describes "An internal error has occurred" you may encounter when you connect a Windows VM in Microsoft Azure.
> [!NOTE] 
> Azure has two different deployment models for creating and working with resources: 
[Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article describes using the Resource Manager deployment model, which we recommend using for new deployments instead of the classic deployment model.

## Symptom 

You cannot connect to Azure Windows VM by using remote desktop protocol (RDP). The connection is stuck on the configuring remote section or the following error is received:

- RDP internal error 
- An internal error has occurred
- This computer can't be connected to the remote computer. Try connecting again. If the problem continues, contact the owner of the remote computer or your network administrator


## Cause

This issue may cause by the following reasons:

- The local RSAs keys cannot be accessed.
- TLS protocol is disabled.
- The certificate is corrupted or expired 

## Solution 

Before you follow the steps, take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).

To troubleshoot this issue, use Serial control or [repair the VM offline](#repair-the-vm-offline) by attaching the OS disk of the VM to a recovery VM.


### Use Serial control

Connect to [Serial Console and open PowerShell instance](./serial-console-windows.md#open-cmd-or-powershell-in-serial-console
). If the Serial Console is not enabled on your VM, move to [repair the VM offline](#repair-the-vm-offline) section.

#### Step 1 Check the RDP port

1. In PowerShell instance, use the [NETSTAT](https://docs.microsoft.com/windows-server/administration/windows-commands/netstat
) to check if port 8080 is used by other applications:

        Netstat -anob |more
2. If the termservice.exe is using 8080 port, move the step 2. If another service or application is using 8080 port rather than termservice.exe, follow these steps:

    A. Stop the service for the application that is using the 3389 service: 

        Stop-Service -Name <ServiceName>

    B. Start the terminal services service: 

        Start-Service -Name Termservice

2. If the application cannot be stopped or this method does not apply to you, you can change the port for RDP:

    A. Change the port:

        Set-ItemProperty -Path 'HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name PortNumber -value <Hexportnumber>

        Stop-Service -Name Termservice Start-Service -Name Termservice
 
    B. Set firewall for the new port:

        Set-NetFirewallRule -Name "RemoteDesktop-UserMode-In-TCP" -LocalPort <NEW PORT (decimal)>

    C. [Update the network security group for the new port](../../virtual-network/security-overview) in Azure portal RDP port.

#### Step 2 Set correct permissions on the RDP Self-sign Certificate

1.	In PowerShell instance, run the following commands one by one to renew RDP self-sign certificate:

        Import-Module PKI Set-Location Cert:\LocalMachine $RdpCertThumbprint = 'Cert:\LocalMachine\Remote Desktop\'+((Get-ChildItem -Path 'Cert:\LocalMachine\Remote Desktop\').thumbprint) Remove-Item -Path $RdpCertThumbprint 

        Stop-Service -Name "SessionEnv" 

        Start-Service -Name "SessionEnv"

2. If you cannot renew the certificate by this method, try to renew the RDP Self-sign certificate remotely:

    1. From a working VM with connectivity to the VM that has problem, type **mmc** in the **Run** box to open Microsoft Management Console.
    2. On the **File** menu, select **Add/Remove Snap-in**, select **Certificates**, and then select **Add**.
    3. Select **Computer accounts**, select **Another Computer**, and then add the IP of the VM that has problems.
    4. Go to the **Remote Desktop\Certificates** folder then right click the certificate and select **Delete**.
    5. In PowerShell instance from Serial Console, restart Remote Desktop Configuration service: 

            Stop-Service -Name "SessionEnv" 

            Start-Service -Name "SessionEnv"
3. Reset the permission for MachineKeys folder.
	
        remove-module psreadline icacls 

        md c:\temp

        icacls C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c > c:\temp\BeforeScript_permissions.txt takeown /f "C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys" /a /r 

        icacls C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c /grant "NT AUTHORITY\System:(F)" 

        icacls C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c /grant "NT AUTHORITY\NETWORK SERVICE:(R)" 

        icacls C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c /grant "BUILTIN\Administrators:(F)" 

        icacls C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c > c:\temp\AfterScript_permissions.txt Restart-Service TermService -Force

4. Restart the VM, and then try to remote desktop to the VM. If the error still occurs, move to the next step.

Step 3: Enable all supported TLS versions

The RPD client uses TLS 1.0 as the default protocol, however this could be then changed to TLS 1.1 which became the new standard. If the TLS 1.1 is disabled on the VM, the connection will fail. 
1.  In CMD instance Enable the TLS protocol:

        reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled /t REG_DWORD /d 1 /f 

        reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled /t REG_DWORD /d 1 /f 

        reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled /t REG_DWORD /d 1 /f
2.	To prevent the AD policy overwriting the changes, stop the group policy update temporarily:

        REG add "HKLM\SYSTEM\CurrentControlSet\Services\gpsvc" /v Start /t REG_DWORD /d 4 /f
3.	Restart the VM so the changes. If the issue is resolved, you run the following command to reenable the group policy:

        sc config gpsvc start= auto sc start gpsvc

        gpupdate /force
    If the change is reverted, it means that there's an AD policy in your company’ domain need to change that to avoid this from happening again.

### Repair the VM Offline

#### Attach the OS disk to a recovery VM

1. [Attach the OS disk to a recovery VM](../windows/troubleshoot-recovery-disks-portal.md).
2. Once the OS disk is attached to the recovery VM, make sure that the disk is flagged as **Online** in the Disk Management console. Note the drive letter that is assigned to the attached OS disk.
3. Remote desktop to the recovery VM.

#### Enable dump log and Serial Console

To enable dump log and Serial Console, run the following script.

1. Open elevated command Prompt session (Run as administrator).
2. Run the following script:

    In this script, we assume that the drive letter that is assigned to the attached OS disk is F.  Replace it with the appropriate value in your VM.

    ```powershell
    reg load HKLM\BROKENSYSTEM F:\windows\system32\config\SYSTEM.hiv

    REM Enable Serial Console
    bcdedit /store F:\boot\bcd /set {bootmgr} displaybootmenu yes
    bcdedit /store F:\boot\bcd /set {bootmgr} timeout 5
    bcdedit /store F:\boot\bcd /set {bootmgr} bootems yes
    bcdedit /store F:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
    bcdedit /store F:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200

    REM Suggested configuration to enable OS Dump
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f

    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f

    reg unload HKLM\BROKENSYSTEM
    ```

#### Reset the permission for Machinkeys folder

1. Open elevated command Prompt session (Run as administrator).
2. Run the following script. In this script, we assume that the drive letter that is assigned to the attached OS disk is F.  Replace it with the appropriate value in your VM.

        Md F:\temp

        icacls F:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c > c:\temp\BeforeScript_permissions.txt
        takeown /f "F:\ProgramData\Microsoft\Crypto\RSA\MachineKeys" /a /r

        icacls F:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c /grant "NT AUTHORITY\System:(F)"

        icacls F:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c /grant "NT AUTHORITY\NETWORK SERVICE:(R)"

        icacls F:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c /grant "BUILTIN\Administrators:(F)"

        icacls F:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c > c:\temp\AfterScript_permissions.txt

#### Enable all supported TLS versions 

1.	Open an elevated CMD window (run as administrator), and the run the following commands.  The following script assumes that the driver letter is assigned to the attached OS disk is F. You need to change it with real value in your VM.
2.	Check which TLS is enabled:

        reg load HKLM\BROKENSYSTEM f:\windows\system32\config\SYSTEM.hiv

        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled /t REG_DWO

3.	If any of these are disable, either because the key doesn't exist, or its value is 0, enable the protocol by running the following scripts:

        REM Enable TLS 1.0, TLS 1.1 and TLS 1.2

        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled /t REG_DWORD /d 1 /f

        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled /t REG_DWORD /d 1 /f

        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled /t REG_DWORD /d 1 /f

        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled /t REG_DWORD /d 1 /f

        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled /t REG_DWORD /d 1 /f

        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled /t REG_DWORD /d 1 /f

4.	Enable NLA:

        REM Enable NLA 

        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD /d 1 /f 
    
        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 1 /f 

        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 1 /f 
        
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD /d 1 /f reg unload HKLM\BROKENSYSTEM
5.	[Detach the OS disk and recreate the VM](../windows/troubleshoot-recovery-disks-portal.md), and then check if the issue is resolved.



    
 