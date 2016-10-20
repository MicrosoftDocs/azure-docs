<properties
	pageTitle="Troubleshooting Azure File storage issues | Microsoft Azure"
	description="Troubleshooting Azure File storage issues"
	services="storage"
	documentationCenter=""
	authors="genlin"
	manager="felixwu"
	editor="na"
	tags="storage"/>

<tags
	ms.service="storage"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/12/2016"
	ms.author="genli"/>

## Troubleshooting Azure File storage issues

This article lists common issues related to Microsoft Azure File storage when connecting from Windows and Linux clients, their possible causes and resolutions.

**General troubleshooting (Windows and Linux)**

[Quota error when trying to open a file](#quotaerror)

**Windows troubleshooting**

[Slow performance when you access Azure File storage from Windows 8.1 or Server 2012 R2](#windowsslow)

[Error 53 attempting to mount an Azure File Share](#error53)

[Net use was successful but I don’t see the Azure file share mounted in Windows Explorer](#netuse)

[My storage account contains “/” and the net use command fails](#slashfails)

[My application/service cannot access mounted Azure Files drive.](#accessfiledrive)

**Linux troubleshooting**

[“Host is down” error on existing file shares, or the shell hangs when doing list commands on the mount point](#errorhold)

[Mount error 115 when attempting to mount Azure Files on the Linux VM](#error15)

[Linux VM experiencing random delays in commands like “ls”](#delayproblem)

[Error "You are copying a file to a destination that does not support encryption" when uploading/copying files to Azure Files](#encryption)

## General Troubleshooting (Windows and Linux)

### Quota error when trying to open a file**

In Windows you will see errors such as:

1816 ERROR_NOT_ENOUGH_QUOTA <--> 0xc0000044 STATUS_QUOTA_EXCEEDED
Not enough quota is available to process this command
Invalid handle value GetLastError: 53

On Linux you may see errors like:
<filename> [permission denied]
Disk quota exceeded

**Cause**

This indicates you have reached the limit on the number of concurrent open handles for a file.   

**Workaround**

Reduce the number of concurrent open handles by closing some handles and retry. For more information, see [Microsoft Azure Storage Performance and Scalability Checklist](storage-performance-checklist.md).

### Slow performance when you access Azure File storage from Windows 8.1 or Server 2012 R2 or from Linux

- If you don’t have a specific small IO size requirement, we recommend that you use 1MB as the IO size for optimal performance.

- If you know the final size of a file you are extending with writes, and your software doesn’t have compatibility issues when the not yet written tail on the file containing zeros, then set the file size in advance instead of every write being an extending write.

## Windows troubleshooting

### Slow performance when you access Azure File storage from Windows 8.1 or Server 2012 R2

For clients running Windows 8.1 or Server 2012 R2 (Blue client), make sure the hotfix KB3114025: Slow performance when you access Azure File storage from Windows 8.1 or Server 2012 R2 is installed. This improves create/close handle performance.

Run the following script to check whether the hotfix has been installed on the Blue client:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies`

If you see:

HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies
{96c345ef-3cac-477b-8fcd-bea1a564241c}    REG_DWORD    0x1

then the hotfix is installed.  

If not, install the hotfix KB3114025: Slow performance when you access Azure File storage from Windows 8.1 or Server 2012 R2.

> [AZURE.NOTE] IaaS Srv2012R2 gallery based VMs created since December 2015 should have this installed by default.

**Additional recommendations to optimize performance**

Never create/open a file for cached I/O requesting write but not read access, i.e. when calling CreateFile() never specific only GENERIC_WRITE, always specify GENERIC_READ | GENERIC_WRITE.  A write-only handle cannot cache small writes locally, even when it is the only open handle to the file.  This imposes a severe performance penalty on small writes.  Note that the “a” mode to CRT fopen() opens a write only handle.

### Error 53 attempting to mount or unmount an Azure File Share

**Cause**

This can occur for several reasons; below are workarounds for each.

“System error 53 has occurred.  Access is denied.” For security reasons, connections to Azure Files shares will be blocked if the communication channel isn’t encrypted and the connection attempt is not made from the same data center where Azure File shares reside in. Communication channel encryption is not provided if the user’s client OS doesn’t support SMB encryption.  This will represent itself with “System error 53 has occurred.  Access is denied.” when a user attempts to mount a file share from on premises or from a different data center. The Windows 8 / Windows Server 2012 and higher negotiate request includes SMB 3.0, which supports encryption.

**Workaround**

Connect from a client that meets the requirements of Windows 8, Windows Server 2012 or higher, or connect from a Virtual Machine that is on the same data center as the Azure Storage account used for the Azure File share.

“System Error 53” when mounting a Azure File share can occur If Port 445 outbound communication to Azure Files data center is blocked. Comcast and some IT organizations block this port. To understand if this is the reason behind “System Error 53”, you can use Portqry to query the TCP:445 endpoint. If it shows as filtered, it means the TCP port is blocked.
Here is an example query:

g:\DataDump\Tools\Portqry>PortQry.exe -n [storage account name].file.core.windows.net -p TCP -e 445
If the result is

TCP port 445 (microsoft-ds service): FILTERED

This indicates TCP 445 being blocked by a rule along the network path.
For more information on using Portqry, see [Description of the Portqry.exe command-line utility](https://support.microsoft.com/kb/310099).

**Workaround**

Work with your IT organization to open Port 445 outbound to Azure IP ranges

3. “System Error 53” can also be received if NTLMv1 communication is enabled on the client. Having NTLMv1 enabled creates a less secure client and therefore communication will be blocked for Azure Files. To confirm if this is the reason, verify the registry key is set to a value of 3:
HKLM\SYSTEM\CurrentControlSet\Control\Lsa > LmCompatibilityLevel
Refer to the LmCompatibilityLevel article on TechNet for more information.

**Resolution**
Change the LmCompatibilityLevel value in the registry key HKLM\SYSTEM\CurrentControlSet\Control\Lsa back to the default (3).

Azure Files only supports NTLMv2 authentication. Ensuring Group Policy is applied to the clients will prevent this error from occurring and is also considered a security best practice. The following article describes how to configure clients to use NTLMv2 using Group Policy:

https://technet.microsoft.com/en-us/library/jj852207(v=ws.11).aspx

The recommended policy setting is Send NTLMv2 response only. This corresponds to a registry value of 3. Clients use only NTLMv2 authentication, and they use NTLMv2 session security if the server supports it. Domain controllers accept LM, NTLM, and NTLMv2 authentication.

### Net use was successful but I don’t see the Azure file share mounted in Windows Explorer

**Cause**

By default, Windows Explorer does not run as Administrator. If you executed net use from an Administrator command prompt, you would have mapped the network drive "As Administrator".
Since mapped drives are user-centric, the logged in user context will not display the drives if they are mounted under different user context.

**Workaround**

Mount the share from a non-administrator command line.
Alternatively, you can follow this TechNet article and configure the EnableLinkedConnections registry value.

### My storage account contains “/” and the net use command fails

**Cause**

When the net use command is executed under Windows Command Interpreter (cmd.exe) it’s parsed with “/” as a command line option and causes the drive mapping to fail.

**Workaround**

Either of these steps can use used to work around the issue:

•	Use the following powershell command:

New-SmbMapping -LocalPath y: -RemotePath \\server\share  -UserName acountName -Password “/password can contain / and \ etc.”

From a batch file this can be done as
Echo new-smbMapping ... | powershell -command –

•	Using double quotes around the key will also work around this unless “/” is the first character. In that case, either use the interactive mode and enter your password separately or regenerate your keys to generate a key that doesn't start with the “/” character.

### My application/service cannot access mounted Azure Files drive.

**Cause**

Drives are mounted per user, if your application/service is running under different user context, they won’t see the drive.

**Workaround**

Mount drive from the same user context the application is running under. This can be
done using tools such as psexec.

Alternatively, you can create a new user with the same privileges as the network service or system account, and run cmdkey and net use under that user. The username should be the storage account name, and password should be the storage account key. Another option for net use is to pass in the storage account name and key  in the username and password parameters of the net use command.
After following these instructions, if you receive error “System error 1312 has occurred. A specified logon session does not exist. It may already have been terminated.” with net use for the system/network service account, ensure that the username passed to net use includes domain information e.g. “[storage account name].file.core.windows.net”.

### Error “"You are copying a file to a destination that does not support encryption" when uploading/copying files to Azure Files

**Cause**

Bitlocker encrypted files can be copied to Azure Files. But, Azure Files do not support NTFS EFS so it seems that you are using EFS in this case. If you have files encrypted via EFS, then copy to Azure Files can fail unless the copy command is decrypting copied file.

**Workaround**

To copy a file to Azure Files, you will need to decrypt it first. You can do so using one of the following methods:

•	Use copy /d.
•	Set the following registry key: HKLM\Software\Policies\Microsoft\Windows\System
DWORD, name = CopyFileAllowDecryptedRemoteDestination
Value = 1

However, note that setting the registry key will affect all copy operations to network shares.  

## Linux troubleshooting

### “Host is down” error on existing file shares, or the shell hangs when doing list commands on the mount point.

**Cause**

This error occurs with the Linux client when the client has been idle for an extended period of time. It disconnects and the client connection times out.

**Workaround**

Keep a file in the Azure File share that you write to periodically to sustain the connection and avoid getting into an idle state. This has to be write operation such as, rewriting the created/modified date on the file, otherwise you might get cached results and your operation might not trigger the connection.

**Resolution**

This issue is now fixed in the Linux kernel as part of change set, pending backport into Linux distribution.

## Mount error 115 when attempting to mount Azure Files on the Linux VM

**Cause**

Linux distributions do not support encryption feature in SMB 3.0 yet. In some distributions user may get error 115 if attempting to mount using SMB 3.0 due to missing feature.

**Workaround**

If the Linux SMB client used doesn’t support encryption, instead mount using SMB 2.1 from a Linux VM on the same data center as the Azure File storage account.

## Linux VM experiencing random delays in commands like “ls”

**Cause**

This can occur when the mount command doesn’t include the serverino option. Without serverino, the ls command will do a stat on each file, and cause this to take longer.

**Solution**

Check the serverino in your /etc/fstab entry
//azureuser.file.core.windows.net/wms/comer on /home/sampledir type cifs (rw,nodev,relatime,vers=2.1,sec=ntlmssp,cache=strict,username=xxx,domain=X,,file_mode=0755,dir_mode=0755,serverino,rsize=65536,wsize=65536,actimeo=1)

If the serverino option is not present, unmount and mount again with the serverino option.
