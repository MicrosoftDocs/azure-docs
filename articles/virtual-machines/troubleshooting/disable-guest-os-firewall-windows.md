---
title: Disable the guest OS Firewall in Azure VM | Microsoft Docs
description: 
services: virtual-machines-windows
documentationcenter: ''
author: Deland-Han
manager: willchen
editor: ''
tags: ''

ms.service: virtual-machines
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: azurecli
ms.date: 11/22/2018
ms.author: delhan

---

# Disable the guest OS Firewall in Azure VM

This article provides a reference for situations in which you suspect that the guest operating system firewall is filtering partial or complete traffic to a virtual machine (VM). This could occur if changes were deliberately made to the firewall that caused RDP connections to fail.

## Solution

The process that is described in this article is intended to be used as a workaround so that you can focus on fixing your real issue, which is how to set up the firewall rules correctly. It\rquote s a Microsoft Best Practice to have the Windows Firewall component enabled. How you configure the firewall rules \cf3 depends on the level of access to the VM that\rquote s required.

### Online Solutions 

If the VM is online and can be accessed on another VM on the same virtual network, you can make these mitigations by using the other VM.

#### Mitigation 1: Custom Script Extension or Run Command feature

If you have a working Azure agent, you can use [Custom Script Extension](../extensions/custom-script-windows.md) or the [Run Commands](../windows/run-command.md) feature (Resource Manager VMs only) to remotely run the following scripts.

> [!Note]
> * If the firewall is set locally, run the following script:
>   ```
>   Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\DomainProfile' -name "EnableFirewall" -Value 0
>   Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\PublicProfile' -name "EnableFirewall" -Value 0
>   Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\Standardprofile' -name "EnableFirewall" -Value 0 
>   Restart-Service -Name mpssvc
>   ```
> * If the firewall is set through an Active Directory policy, you can use run the following script for temporary access. 
>   ```
>   Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile' -name "EnableFirewall" -Value 0
>   Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile' -name "EnableFirewall" -Value 0
>   Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\StandardProfile' name "EnableFirewall" -Value 0
>   Restart-Service -Name mpssvc
>   ```
>   However, as soon as the policy is applied again, you’ll be kicked out of the remote session. The permanent fix for this issue is to modify the policy that's applied on this computer.

#### Mitigation 2: Remote PowerShell

1.	Connect to a VM that’s located on the same virtual network as the VM that you cannot reach by using RDP connection.

2.	Open a PowerShell console window.

3.	Run the following commands:

    ```powershell
    Enter-PSSession (New-PSSession -ComputerName "<HOSTNAME>" -Credential (Get-Credential) -SessionOption (New-PSSessionOption -SkipCACheck -SkipCNCheck)) 
    netsh advfirewall set allprofiles state off
    Restart-Service -Name mpssvc 
    exit
    ```

> [!Note]
> If the firewall is set through a Group Policy Object, this method may not work because this command changes only the local registry entries. If a policy is in place, it will override this change. 

#### Mitigation 3: PSTools commands

1.	On the troubleshooting VM, download [PSTools](https://docs.microsoft.com/sysinternals/downloads/pstools).

2.	Open a CMD instance, and then access the VM through its DIP.

3.	Run the following commands:

    ```cmd
    psexec \\<DIP> ​-u <username> cmd
    netsh advfirewall set allprofiles state off
    psservice restart mpssvc
    ```

#### Mitigation 4: Remote Registry 

Follow these steps to use [Remote Registry](https://support.microsoft.com/help/314837/how-to-manage-remote-access-to-the-registry).

1.	On the troubleshooting VM, start registry editor, and then go to **File** > **Connect Network Registry**.

2.	Open up the *TARGET MACHINE*\SYSTEM branch, and specify the following values:

    ```
    <TARGET MACHINE>\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\DomainProfile\EnableFirewall           -->        0 
    <TARGET MACHINE>\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\PublicProfile\EnableFirewall           -->        0 
    <TARGET MACHINE>\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\StandardProfile\EnableFirewall         -->        0
    ```

3.	Restart the service. Because you cannot do that by using the remote registry, you must use Remove Service Console.

4.	Open an instance of **Services.msc**.

5.	Click **Services (Local)**.

6.	Select **Connect to another computer**.

7.	Enter the **Private IP Address (DIP)** of the problem VM.

8.	Restart the local firewall policy.

9.	Try to connect to the VM through RDP again from your local computer.

### Offline Solutions 

If you have a situation in which you cannot reach the VM by any method, Custom Script Extension will fail, and you will have to work in OFFLINE mode by working directly through the system disk. To do that, follow these steps:

1.  [Attach the system disk to a recovery VM](troubleshoot-recovery-disks-portal-windows.md).

2.	Start a Remote Desktop connection to the recovery VM.

3.	Make sure that the disk is flagged as Online in the Disk Management console. Note the drive letter that’s assigned to the attached system disk.

4.	Before you make any changes, create a copy of the \windows\system32\config folder in case a rollback of the changes is necessary.

5.	On the troubleshooting VM, start the registry editor (regedit.exe). 

6.	For this troubleshooting procedure, we are mounting the hives as BROKENSYSTEM and BROKENSOFTWARE.

7.	Highlight the HKEY_LOCAL_MACHINE key, and then select File > Load Hive from the menu.

8.	Locate the \windows\system32\config\SYSTEM file on the attached system disk.

9.	Open an elevated PowerShell instance, and then run the following commands:

    ```cmd
    # Load the hives - If your attached disk is not F, replace the letter assignment here
    reg load HKLM\BROKENSYSTEM f:\windows\system32\config\SYSTEM
    reg load HKLM\BROKENSOFTWARE f:\windows\system32\config\SOFTWARE 
    # Disable the firewall on the local policy
    $ControlSet = (get-ItemProperty -Path 'HKLM:\BROKENSYSTEM\Select' -name "Current").Current
    $key = 'BROKENSYSTEM\ControlSet00'+$ControlSet+'\services\SharedAccess\Parameters\FirewallPolicy\DomainProfile'
    Set-ItemProperty -Path $key -name 'EnableFirewall' -Value 0 -Type Dword -force
    $key = 'BROKENSYSTEM\ControlSet00'+$ControlSet+'\services\SharedAccess\Parameters\FirewallPolicy\PublicProfile'
    Set-ItemProperty -Path $key -name 'EnableFirewall' -Value 0 -Type Dword -force
    $key = 'BROKENSYSTEM\ControlSet00'+$ControlSet+'\services\SharedAccess\Parameters\FirewallPolicy\StandardProfile'
    Set-ItemProperty -Path $key -name 'EnableFirewall' -Value 0 -Type Dword -force
    # To ensure the firewall is not set thru AD policy, check if the following registry entries exist and if they do, then check if the following entries exist:
    $key = 'HKLM:\BROKENSOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile'
    Set-ItemProperty -Path $key -name 'EnableFirewall' -Value 0 -Type Dword -force
    $key = 'HKLM:\BROKENSOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile'
    Set-ItemProperty -Path $key -name 'EnableFirewall' -Value 0 -Type Dword -force
    $key = 'HKLM:\BROKENSOFTWARE\Policies\Microsoft\WindowsFirewall\StandardProfile'
    Set-ItemProperty -Path $key -name 'EnableFirewall' -Value 0 -Type Dword -force
    # Unload the hives
    reg unload HKLM\BROKENSYSTEM
    reg unload HKLM\BROKENSOFTWARE
    ```

10.	[Detach the system disk and re-create the VM](troubleshoot-recovery-disks-portal-windows.md).

11.	Check whether the issue is resolved.
