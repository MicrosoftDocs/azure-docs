---
title: Troubleshoot authentication errors when you use RDP to connect to Azure VM | Microsoft Docs
description: 
services: virtual-machines-windows
documentationcenter: ''
author: Deland-Han
manager: cshepard
editor: ''
tags: ''

ms.service: virtual-machines
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: azurecli
ms.date: 11/01/2018
ms.author: delhan

---

# Troubleshoot authentication errors when you use RDP to connect to Azure VM

This article can help you troubleshoot authentication errors that occur when you use Remote Desktop Protocol (RDP) connection to connect to an Azure virtual machine (VM).

## Symptoms

You capture a screenshot of an Azure VM that shows the Welcome screen and indicates that the operating system is running. However, when you try to connect to the VM by using Remote Desktop Connection, you receive one of the following error messages.

### Error message 1

**An authentication error has occurred. The Local Security Authority cannot be contacted.**

### Error message 2

**The remote computer that you are trying to connect to requires Network Level Authentication (NLA), but your Windows domain controller cannot be contacted to perform NLA. If you are an administrator on the remote computer, you can disable NLA by using the options on the Remote tab of the System Properties dialog box.**

### Error message 3 (generic connection error)

**This computer can't connect to the remote computer. Try connecting again, if the problem continues, contact the owner of the remote computer or your network administrator.**

## Cause

There are multiple reasons why NLA might block the RDP access to a VM.

### Cause 1

The VM cannot communicate with the domain controller (DC). This problem could prevent an RDP session from accessing a VM by using domain credentials. However, you would still be able to log on by using the Local Administrator credentials. This problem may occur in the following situations:

1. The Active Directory Security Channel between this VM and the DC is broken.

2. The VM has an old copy of the account password and the DC has a newer copy.

3. The DC that this VM is connecting to is unhealthy.

### Cause 2

The encryption level of the VM is higher than the one that’s used by the client computer.

### Cause 3

The TLS 1.0, 1.1, or 1.2 (server) protocols are disabled on the VM.

### Cause 4

The VM was set up to disable logging on by using domain credentials, and the Local Security Authority (LSA) is set up incorrectly.

### Cause 5

The VM was set up to accept only Federal Information Processing Standard (FIPS)-compliant algorithm connections. This is usually done by using Active Directory policy. This is a rare configuration, but FIPS can be enforced for Remote Desktop connections only.

## Before you troubleshoot

### Create a backup snapshot

To create a backup snapshot, follow the steps in [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).

### Connect to the VM remotely

To connect to the VM remotely , use one of the methods in [How to use remote tools to troubleshoot Azure VM issues](remote-tools-troubleshoot-azure-vm-issues.md).

### Group policy client service

If this is a domain-joined VM, first stop the Group Policy Client service to prevent any Active Directory Policy from overwriting the changes. To do this, run the following command:

```cmd
REM Disable the member server to retrieve the latest GPO from the domain upon start
REG add "HKLM\SYSTEM\CurrentControlSet\Services\gpsvc" /v Start /t REG_DWORD /d 4 /f
```

After the problem is fixed, restore the ability of this VM to contact the domain to retrieve the latest GPO from the domain. To do this, run the following commands:

```cmd
sc config gpsvc start= auto
sc start gpsvc

gpupdate /force
```

If the change is reverted, it means that an Active Directory policy is causing the problem. 

### Workaround

To work around this problem, run the following commands in the command window to disable NLA:

```cmd
REM Disable the Network Level Authentication
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD /d 0
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 0
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD /d 0
```

Then, restart the VM.

To re-enable NLA, run the following command, and then restart the VM:

```cmd
REG add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v disabledomaincreds /t REG_DWORD /d 0 /f

REG add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD /d 1 /f
REG add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 1 /f
REG add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD /d 1 /f
```

## Troubleshooting

### For domain-joined VMs

To troubleshoot this problem, first check whether the VM can connect to a DC, and whether the DC has a status of "healthy" and can handle requests from the VM.

>[!Note] 
>To test the DC health, you can use another VM on the same VNET and Subnet that share the same logon server.

Connect to the VM that has the problem by using Serial console, remote CMD, or remote PowerShell, according to the steps in the “Connect to the VM remotely” section.

To determine which DC the VM is connecting to, run the following command in the console: 

```cmd
set | find /i "LOGONSERVER"
```

Then, check the health of the secure channel between the VM and the DC. To do this, run the following command in an elevated PowerShell instance. This command returns a Boolean flag that indicates whether the secure channel is alive:

```powershell
Test-ComputerSecureChannel -verbose
```

If the channel is broken, run the following command to repair it:

```powershell
Test-ComputerSecureChannel -repair
```

Make sure that the computer account password in Active Directory is updated on the VM and the DC:

```powershell
Reset-ComputerMachinePassword -Server "<COMPUTERNAME>" -Credential <DOMAIN CREDENTIAL WITH DOMAIN ADMIN LEVEL>
```

If the communication between the DC and the VM is good, but the DC is not healthy enough to open an RDP session, you can try to restart the DC.

If the preceding commands did not fix the communication problem to the domain, you can rejoin this VM to the domain. To do this, follow these steps:

1. Create a script that’s named Unjoin.ps1 by using the following content, and then deploy the script as a Custom Script Extension on the Azure portal:

    ```cmd
    cmd /c "netdom remove <<MachineName>> /domain:<<DomainName>> /userD:<<DomainAdminhere>> /passwordD:<<PasswordHere>> /reboot:10 /Force"
    ```
    
    This script takes the VM out of the domain forcibly and restarts it 10 seconds later. Then, you have to clean up the Computer object on the domain side.

2.	After the cleanup is done, rejoin this VM to the domain. To do this, create a script that’s named JoinDomain.ps1 by using the following content, and then deploy the script as a Custom Script Extension on the Azure portal: 

    ```cmd
    cmd /c "netdom join <<MachineName>> /domain:<<DomainName>> /userD:<<DomainAdminhere>> /passwordD:<<PasswordHere>> /reboot:10"
    ```

    >[!Note] 
    >This joins the VM on the domain by using the specified credentials.

If the Active Directory channel is healthy, the computer password is updated, and the domain controller is working as expected, try the following steps.

If the problem persists, check whether the domain credential is disabled. To do this, open an elevated Command Prompt window, and then run the following command to determine whether the VM is set up to disable domain accounts for logging on to the VM:

```cmd
REG query "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v disabledomaincreds
```

If the key is set to **1**, this means that the server was set up not to allow domain credentials. Change this key to **0**.

### For standalone VMs

#### Check MinEncryptionLevel

In an CMD instance, run the following command to query the **MinEncryptionLevel** registry value:

```cmd
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v MinEncryptionLevel
```

Based on the registry value, follow these steps:

* 4 (FIPS): Go to [Check FIPs compliant algorithms connections](#fips-compliant).

* 3 (128-bit encryption): Set the severity to **2** by running the following command:

    ```cmd
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v MinEncryptionLevel /t REG_DWORD /d 2 /f
    ```

* 2 (Highest encryption possible, as dictated by the client): You can try to set the encryption to the minimum value of **1** by running the following command:

    ```cmd
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v MinEncryptionLevel /t REG_DWORD /d 1 /f
    ```
    
Restart the VM so that the changes to the registry take effect.

#### TLS version

Depending on the system, RDP uses the TLS 1.0, 1.1, or 1.2 (server) protocol. To query how these protocols are set up on the VM, open a CMD instance, and then run the following commands:

```cmd
reg query "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled
reg query "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled
reg query "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled
```

If the returned values are not all **1**, this means that the protocol is disabled. To enable these protocols, run the following commands:

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled /t REG_DWORD /d 1 /f
```

For other protocol versions, you can run the following commands:

<pre lang="bat">
reg query "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS <i>x.x</i>\Server" /v Enabled
reg query "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS <i>x.x</i>\Server" /v Enabled
</pre>

> [!Note]
> Get the SSH/TLS version x.x from the Guest OS Logs on the SCHANNEL errors.

#### <a name="fips-compliant"></a> Check FIPs compliant algorithms connections

Remote desktop can be enforced to use only FIPs-compliant algorithm connections. This can be set by using a registry key. To do this, open an elevated Command Prompt window, and then query the following keys:

```cmd
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Lsa\FIPSAlgorithmPolicy" /v Enabled
```

If the command returns **1**, change the registry value to **0**.

```cmd
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Lsa\FIPSAlgorithmPolicy" /v Enabled /t REG_DWORD /d 0
```

Check which is the current MinEncryptionLevel on the VM:

```cmd
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v MinEncryptionLevel
```

If the command returns **4**, change the registry value to **2**

```cmd
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v MinEncryptionLevel /t REG_DWORD /d 2
```

Restart the VM so that the changes to the registry take effect.

## Next steps

[SetEncryptionLevel method of the Win32_TSGeneralSetting class](https://docs.microsoft.com/windows/desktop/TermServ/win32-tsgeneralsetting-setencryptionlevel)

[Configure Server Authentication and Encryption Levels](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc770833(v=ws.11))

[Win32_TSGeneralSetting class](https://docs.microsoft.com/windows/desktop/TermServ/win32-tsgeneralsetting)
