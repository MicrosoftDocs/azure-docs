---
title: Troubleshooting Azure File storage issues | Microsoft Docs
description: Troubleshooting Azure File storage issues
services: storage
documentationcenter: ''
author: genlin
manager: felixwu
editor: na
tags: storage

ms.service: storage
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/24/2016
ms.author: genli

---
# Troubleshooting Azure File storage problems
This article lists common problems that are related to Microsoft Azure File storage when you connect from Windows and Linux clients. It also provides the possible causes of and resolutions for these problems.

**General problems (occur in both Windows and Linux clients)**

* [Quota error when trying to open a file](#quotaerror)
* [Slow performance when you access Azure File storage from Windows or from Linux](#slowboth)

**Windows client problems**

* [Slow performance when you access Azure File storage from Windows 8.1 or Windows Server 2012 R2](#windowsslow)
* [Error 53 attempting to mount an Azure File Share](#error53)
* [Net use was successful but I don’t see the Azure file share mounted in Windows Explorer](#netuse)
* [My storage account contains "/" and the net use command fails](#slashfails)
* [My application/service cannot access mounted Azure Files drive.](#accessfiledrive)
* [Additional recommendations to optimize performance](#additional)

**Linux client problems**

* [Error "You are copying a file to a destination that does not support encryption" when uploading/copying files to Azure Files](#encryption)
* ["Host is down" error on existing file shares, or the shell hangs when doing list commands on the mount point](#errorhold)
* [Mount error 115 when attempting to mount Azure Files on the Linux VM](#error15)
* [Linux VM experiencing random delays in commands like "ls"](#delayproblem)

## General problems
<a id="quotaerror"></a>

### Quota error when trying to open a file
In Windows, you receive error messages that resemble the following:

**1816 ERROR_NOT_ENOUGH_QUOTA <--> 0xc0000044**

**STATUS_QUOTA_EXCEEDED**

**Not enough quota is available to process this command**

**Invalid handle value GetLastError: 53**

On Linux, you receive error messages that resemble the following:

**<filename> [permission denied]**

**Disk quota exceeded**

#### Cause
The problem occurs because you have reached the upper limit of concurrent open handles that are allowed for a file.

#### Solution
Reduce the number of concurrent open handles by closing some handles,  and then retry. For more information, see [Microsoft Azure Storage Performance and Scalability Checklist](storage-performance-checklist.md).

<a id="slowboth"></a>

### Slow performance when accessing File storage from Windows or Linux
* If you don’t have a specific minimum I/O size requirement, we recommend that you use 1 MB as the I/O size for optimal performance.
* If you know the final size of a file that you are extending with writes, and your software doesn’t have compatibility issues when the not yet written tail on the file containing zeros, then set the file size in advance instead of every write being an extending write.

## Windows client problems
<a id="windowsslow"></a>

### Slow performance when accessing the File storage from Windows 8.1 or Windows Server 2012 R2
For clients who are running Windows 8.1 or Windows Server 2012 R2, make sure that the hotfix [KB3114025](https://support.microsoft.com/kb/3114025) is installed. This hotfix improves the create and close handle performance.

You can run the following script to check whether the hotfix has been installed on:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies`

If hotfix is installed, the following output is displayed:

**HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies**

**{96c345ef-3cac-477b-8fcd-bea1a564241c}    REG_DWORD    0x1**

> [!NOTE]
> Windows Server 2012 R2 images in Azure Marketplace have the hotfix KB3114025 installed by default starting in December 2015.
> 
> 

<a id="additional"></a>

### Additional recommendations to optimize performance
Never create or open a file for cached I/O that is requesting write access but not read access. That is, when you call **CreateFile()**, never specify only **GENERIC_WRITE**, but always specify **GENERIC_READ | GENERIC_WRITE**. A write-only handle cannot cache small writes locally, even when it is the only open handle for the file. This imposes a severe performance penalty on small writes. Note that the "a" mode to CRT **fopen()** opens a write-only handle.

<a id="error53"></a>

### "Error 53" when you try to mount or unmount an Azure File Share
This problem can be caused by following conditions:

#### Cause 1
"System error 53 has occurred. Access is denied." For security reasons, connections to Azure Files shares are blocked if the communication channel isn’t encrypted and the connection attempt is not made from the same data center on which Azure File shares reside. Communication channel encryption is not provided if the user’s client OS doesn’t support SMB encryption. This is indicated by a "System error 53 has occurred. Access is denied" Error message when a user tries to mount a file share from on-premises or from a different data center. Windows 8, Windows Server 2012, and later versions of each negotiate request that includes SMB 3.0, which supports encryption.

#### Solution for Cause 1
Connect from a client that meets the requirements of Windows 8, Windows Server 2012 or later versions, or that connect from a virtual machine that is on the same data center as the Azure Storage account that is used for the Azure File share.

#### Cause 2
"System Error 53" when you mount an Azure file share can occur if Port 445 outbound communication to Azure Files data center is blocked. Click [here](http://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx) to see the summary of ISPs that allow or disallow access from port 445.

Comcast and some IT organizations block this port. To understand whether this is the reason behind the "System Error 53" message, you can use Portqry to query the TCP:445 endpoint. If the TCP:445 endpoint is displayed as filtered, the TCP port is blocked. Here is an example query:

`g:\DataDump\Tools\Portqry>PortQry.exe -n [storage account name].file.core.windows.net -p TCP -e 445`

If the TCP 445 being blocked by a rule along the network path, you will see the following output:

**TCP port 445 (microsoft-ds service): FILTERED**

For more information on using Portqry, see [Description of the Portqry.exe command-line utility](https://support.microsoft.com/kb/310099).

#### Solution for Cause 2
Work with your IT organization to open Port 445 outbound to [Azure IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

#### Cause 3
"System Error 53" can also be received if NTLMv1 communication is enabled on the client. Having NTLMv1 enabled creates a less-secure client. Therefore, communication will be blocked for Azure Files. To verify whether this is the cause of the error, verify that the following registry subkey is set to a value of 3:

HKLM\SYSTEM\CurrentControlSet\Control\Lsa > LmCompatibilityLevel.

For more information, see the [LmCompatibilityLevel](https://technet.microsoft.com/library/cc960646.aspx) topic on TechNet.

#### Solution for Cause 3
To resolve this issue, revert the LmCompatibilityLevel value in the HKLM\SYSTEM\CurrentControlSet\Control\Lsa registry key to the default value of 3.

Azure Files supports only NTLMv2 authentication. Make sure that Group Policy is applied to the clients. This will prevent this error from occurring. This is also considered to be a security best practice. For more information, see [how to configure clients to use NTLMv2 using Group Policy](https://technet.microsoft.com/library/jj852207\(v=ws.11\).aspx)

The recommended policy setting is **Send NTLMv2 response only**. This corresponds to a registry value of 3. Clients use only NTLMv2 authentication, and they use NTLMv2 session security if the server supports it. Domain controllers accept LM, NTLM, and NTLMv2 authentication.

<a id="netuse"></a>

### Net use was successful but don't see the Azure file share mounted in Windows Explorer
#### Cause
By default, Windows Explorer does not run as Administrator. If you run **net use** from an Administrator command prompt, you map the network drive "As Administrator." Because mapped drives are user-centric, the user account that is logged in does not display the drives if they are mounted under a different user account.

#### Solution
Mount the share from a non-administrator command line. Alternatively, you can follow [this TechNet topic](https://technet.microsoft.com/library/ee844140.aspx) to configure the **EnableLinkedConnections** registry value.

<a id="slashfails"></a>

### My storage account contains "/" and the net use command fails
#### Cause
When the **net use** command is run under Command Prompt (cmd.exe), it’s parsed by adding "/" as a command-line option. This causes the drive mapping to fail.

#### Solution
You can use either of the following steps to work around the issue:

•    Use the following PowerShell command:

`New-SmbMapping -LocalPath y: -RemotePath \\server\share  -UserName acountName -Password "password can contain / and \ etc"`

From a batch file this can be done as

`Echo new-smbMapping ... | powershell -command –`

•    Put double quotation marks around the key to work around this issue — unless "/" is the first character. If it is, either use the interactive mode and enter your password separately or regenerate your keys to get a key that doesn't start with the forward slash (/) character.

<a id="accessfiledrive"></a>

### My application/service cannot access mounted Azure Files drive
#### Cause
Drives are mounted per user. If your application or service is running under a different user account, users won’t see the drive.

#### Solution
Mount drive from the same user account under which the application is. This can be done using tools such as psexec.

Alternatively, you can create a new user that has the same privileges as the network service or system account, and then run **cmdkey** and **net use** under that account. The user name should be the storage account name, and password should be the storage account key. Another option for **net use** is to pass in the storage account name and key in the user name and password parameters of the **net use** command.

After you follow these instructions, you may receive the following error message: "System error 1312 has occurred. A specified logon session does not exist. It may already have been terminated" when you run **net use** for the system/network service account. If this occurs, make sure that the username that is passed to **net use** includes domain information (for example: "[storage account name].file.core.windows.net").

## Linux client problems
<a id="encryption"></a>

### Error "You are copying a file to a destination that does not support encryption"
#### Cause
Bitlocker-encrypted files can be copied to Azure Files. However, the File storage does not support NTFS EFS. Therefore, you are likely using EFS in this case. If you have files that are encrypted through EFS, a copy operation to the File storage can fail unless the copy command is decrypting a copied file.

#### Workaround
To copy a file to the File storage, you must first decrypt it. You can do this by using one of the following methods:

•    Use **copy /d**.

•    Set the following registry key:

* Path=HKLM\Software\Policies\Microsoft\Windows\System
* Value type=DWORD
* Name = CopyFileAllowDecryptedRemoteDestination
* Value = 1

However, note that setting the registry key affects all copy operations to network shares.

<a id="errorhold"></a>

### "Host is down" error on existing file shares, or the shell hangs when you run list commands on the mount point
#### Cause
This error occurs on the Linux client when the client has been idle for an extended period of time. When this error occurs, the client disconnects, and the client connection times out.

#### Solution
This issue is now fixed in the Linux kernel as part of [change set](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/fs/cifs?id=4fcd1813e6404dd4420c7d12fb483f9320f0bf93), pending backport into Linux distribution.

To works around this issue, sustain the connection and avoid getting into an idle state, keep a file in the Azure File share that you write to periodically. This has to be a write operation, such as rewriting the created/modified date on the file. Otherwise, you might get cached results, and your operation might not trigger the connection.

<a id="error15"></a>

### "Mount error 115" when you try to mount Azure Files on the Linux VM
#### Cause
Linux distributions do not yet support encryption feature in SMB 3.0. In some distributions, user may receive a "115" error message if they try to mount Azure Files by using SMB 3.0 because of a missing feature.

#### Solution
If the Linux SMB client that is used does not support encryption, mount Azure Files by using SMB 2.1 from a Linux VM on the same data center as the File storage account.

<a id="delayproblem"></a>

### Linux VM experiencing random delays in commands like "ls"
#### Cause
This can occur when the mount command does not include the **serverino** option. Without **serverino**, the ls command runs a **stat** on every file.

#### Solution
Check the **serverino** in your "/etc/fstab" entry:

//azureuser.file.core.windows.net/wms/comer on /home/sampledir type cifs (rw,nodev,relatime,vers=2.1,sec=ntlmssp,cache=strict,username=xxx,domain=X,
file_mode=0755,dir_mode=0755,serverino,rsize=65536,wsize=65536,actimeo=1)

If the **serverino** option is not present, unmount and mount Azure Files again by having the **serverino** option selected.

## Learn more
* [Get started with Azure File storage on Windows](storage-dotnet-how-to-use-files.md)
* [Get started with Azure File storage on Linux](storage-how-to-use-files-linux.md)

