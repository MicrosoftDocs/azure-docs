---
title: Troubleshoot Azure Files problems in Windows | Microsoft Docs
description: Troubleshooting Azure Files problems in Windows
services: storage
author: jeffpatt24
tags: storage
ms.service: storage
ms.topic: article
ms.date: 05/11/2018
ms.author: jeffpatt
ms.component: files
---
# Troubleshoot Azure Files problems in Windows

This article lists common problems that are related to Microsoft Azure Files when you connect from Windows clients. It also provides possible causes and resolutions for these problems. In addition to the troubleshooting steps in this article, you can also use [AzFileDiagnostics](https://gallery.technet.microsoft.com/Troubleshooting-tool-for-a9fa1fe5) to ensure that the Windows client environment has correct prerequisites. AzFileDiagnostics automates detection of most of the symptoms mentioned in this article and helps set up your environment to get optimal performance. You can also find this information in the [Azure Files shares Troubleshooter](https://support.microsoft.com/help/4022301/troubleshooter-for-azure-files-shares) that provides steps to assist you with problems connecting/mapping/mounting Azure Files shares.


<a id="error53-67-87"></a>
## Error 53, Error 67, or Error 87 when you mount or unmount an Azure file share

When you try to mount a file share from on-premises or from a different datacenter, you might receive the following errors:

- System error 53 has occurred. The network path was not found.
- System error 67 has occurred. The network name cannot be found.
- System error 87 has occurred. The parameter is incorrect.

### Cause 1: Unencrypted communication channel

For security reasons, connections to Azure file shares are blocked if the communication channel isn't encrypted and if the connection attempt isn't made from the same datacenter where the Azure file shares reside. Communication channel encryption is provided only if the user's client OS supports SMB encryption.

Windows 8, Windows Server 2012, and later versions of each system negotiate requests that include SMB 3.0, which supports encryption.

### Solution for cause 1

Connect from a client that does one of the following:

- Meets the requirements of Windows 8 and Windows Server 2012 or later versions
- Connects from a virtual machine in the same datacenter as the Azure storage account that is used for the Azure file share

### Cause 2: Port 445 is blocked

System error 53 or system error 67 can occur if port 445 outbound communication to an Azure Files datacenter is blocked. To see the summary of ISPs that allow or disallow access from port 445, go to [TechNet](http://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx).

To understand whether this is the reason behind the "System error 53" message, you can use Portqry to query the TCP:445 endpoint. If the TCP:445 endpoint is displayed as filtered, the TCP port is blocked. Here is an example query:

  `g:\DataDump\Tools\Portqry>PortQry.exe -n [storage account name].file.core.windows.net -p TCP -e 445`

If TCP port 445 is blocked by a rule along the network path, you will see the following output:

  `TCP port 445 (microsoft-ds service): FILTERED`

For more information about how to use Portqry, see [Description of the Portqry.exe command-line utility](https://support.microsoft.com/help/310099).

### Solution for cause 2

Work with your IT department to open port 445 outbound to [Azure IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

### Cause 3: NTLMv1 is enabled

System error 53 or system error 87 can occur if NTLMv1 communication is enabled on the client. Azure Files supports only NTLMv2 authentication. Having NTLMv1 enabled creates a less-secure client. Therefore, communication is blocked for Azure Files. 

To determine whether this is the cause of the error, verify that the following registry subkey is set to a value of 3:

**HKLM\SYSTEM\CurrentControlSet\Control\Lsa > LmCompatibilityLevel**

For more information, see the [LmCompatibilityLevel](https://technet.microsoft.com/library/cc960646.aspx) topic on TechNet.

### Solution for cause 3

Revert the **LmCompatibilityLevel** value to the default value of 3 in the following registry subkey:

  **HKLM\SYSTEM\CurrentControlSet\Control\Lsa**

<a id="error1816"></a>
## Error 1816 "Not enough quota is available to process this command" when you copy to an Azure file share

### Cause

Error 1816 happens when you reach the upper limit of concurrent open handles that are allowed for a file on the computer where the file share is being mounted.

### Solution

Reduce the number of concurrent open handles by closing some handles, and then retry. For more information, see [Microsoft Azure Storage performance and scalability checklist](../common/storage-performance-checklist.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

<a id="slowfilecopying"></a>
## Slow file copying to and from Azure Files in Windows

You might see slow performance when you try to transfer files to the Azure File service.

- If you don't have a specific minimum I/O size requirement, we recommend that you use 1 MiB as the I/O size for optimal performance.
-	If you know the final size of a file that you are extending with writes, and your software doesn't have compatibility problems when the unwritten tail on the file contains zeros, then set the file size in advance instead of making every write an extending write.
-	Use the right copy method:
    -	Use [AzCopy](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for any transfer between two file shares.
    -	Use [Robocopy](https://blogs.msdn.microsoft.com/granth/2009/12/07/multi-threaded-robocopy-for-faster-copies/) between file shares on an on-premises computer.

### Considerations for Windows 8.1 or Windows Server 2012 R2

For clients that are running Windows 8.1 or Windows Server 2012 R2, make sure that the [KB3114025](https://support.microsoft.com/help/3114025) hotfix is installed. This hotfix improves the performance of create and close handles.

You can run the following script to check whether the hotfix has been installed:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies`

If hotfix is installed, the following output is displayed:

`HKEY_Local_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies {96c345ef-3cac-477b-8fcd-bea1a564241c} REG_DWORD 0x1`

> [!Note]
> Windows Server 2012 R2 images in Azure Marketplace have hotfix KB3114025 installed by default, starting in December 2015.

<a id="shareismissing"></a>
## No folder with a drive letter in **My Computer**

If you map an Azure file share as an administrator by using net use, the share appears to be missing.

### Cause

By default, Windows File Explorer does not run as an administrator. If you run net use from an administrative command prompt, you map the network drive as an administrator. Because mapped drives are user-centric, the user account that is logged in does not display the drives if they are mounted under a different user account.

### Solution
Mount the share from a non-administrator command line. Alternatively, you can follow [this TechNet topic](https://technet.microsoft.com/library/ee844140.aspx) to configure the **EnableLinkedConnections** registry value.

<a id="netuse"></a>
## Net use command fails if the storage account contains a forward slash

### Cause

The net use command interprets a forward slash (/) as a command-line option. If your user account name starts with a forward slash, the drive mapping fails.

### Solution

You can use either of the following steps to work around the problem:

- Run the following PowerShell command:

  `New-SmbMapping -LocalPath y: -RemotePath \\server\share -UserName accountName -Password "password can contain / and \ etc" `

  From a batch file, you can run the command this way:

  `Echo new-smbMapping ... | powershell -command –`

- Put double quotation marks around the key to work around this problem--unless the forward slash is the first character. If it is, either use the interactive mode and enter your password separately or regenerate your keys to get a key that doesn't start with a forward slash.

<a id="cannotaccess"></a>
## Application or service cannot access a mounted Azure Files drive

### Cause

Drives are mounted per user. If your application or service is running under a different user account than the one that mounted the drive, the application will not see the drive.

### Solution

Use one of the following solutions:

-	Mount the drive from the same user account that contains the application. You can use a tool such as PsExec.
- Pass the storage account name and key in the user name and password parameters of the net use command.
- Use the cmdkey command to add the credentials into Credential Manager. Perform this from a command line under the service account context, either through an interactive login or by using runas.
  
  `cmdkey /add:<storage-account-name>.file.core.windows.net /user:AZURE\<storage-account-name> /pass:<storage-account-key>`
- Map the share directly without using a mapped drive letter. Some applications may not reconnect to the drive letter properly, so using the full UNC path may be more reliable. 

  `net use * \\storage-account-name.file.core.windows.net\share`

After you follow these instructions, you might receive the following error message when you run net use for the system/network service account: "System error 1312 has occurred. A specified logon session does not exist. It may already have been terminated." If this occurs, make sure that the username that is passed to net use includes domain information (for example: "[storage account name].file.core.windows.net").

<a id="doesnotsupportencryption"></a>
## Error "You are copying a file to a destination that does not support encryption"

When a file is copied over the network, the file is decrypted on the source computer, transmitted in plaintext, and re-encrypted at the destination. However, you might see the following error when you're trying to copy an encrypted file: "You are copying the file to a destination that does not support encryption."

### Cause
This problem can occur if you are using Encrypting File System (EFS). BitLocker-encrypted files can be copied to Azure Files. However, Azure Files does not support NTFS EFS.

### Workaround
To copy a file over the network, you must first decrypt it. Use one of the following methods:

- Use the **copy /d** command. It allows the encrypted files to be saved as decrypted files at the destination.
- Set the following registry key:
  - Path = HKLM\Software\Policies\Microsoft\Windows\System
  - Value type = DWORD
  - Name = CopyFileAllowDecryptedRemoteDestination
  - Value = 1

Be aware that setting the registry key affects all copy operations that are made to network shares.

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
