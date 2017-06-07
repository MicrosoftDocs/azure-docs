---
title: Troubleshooting Azure File storage problems in Windows | Microsoft Docs
description: Troubleshooting Azure File storage issues in Windows
services: storage
documentationcenter: ''
author: genlin
manager: willchen
editor: na
tags: storage

ms.service: storage
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/24/2017
ms.author: genli

---
# Troubleshooting Azure File storage problems in Windows

This article lists common problems and resolutions that are related to Microsoft Azure File storage when you connect from Windows clients. It also provides possible causes of and resolutions for these problems.

<a id="error53-67-87"></a>
##  Error 53, Error 67, or Error 87 when you mount or unmount an Azure File Share

When you try to mount a file share from on-premises or from a different data center, you may receive the following errors:

- System error 53 has occurred. The network path was not found
- System error 67 has occurred. The network name cannot be found
- System error 87 has occurred. The parameter is incorrect

### Cause 1: Unencrypted communication channel

For security reasons, connections to Azure Files shares are blocked if the communication channel isn’t encrypted and the connection attempt is not made from the same data center on which the Azure File shares reside. Communication channel encryption is not provided if the user’s client OS doesn’t support SMB encryption.
Windows 8, Windows Server 2012, and later versions of each system negotiate requests that include SMB 3.0, which supports encryption.

### Solution for Cause 1

Connect from a client that meets the requirements of Windows 8, Windows Server 2012 or later versions, or that connects from a virtual machine that is on the same data center as the Azure Storage account that is used for the Azure File share.

### Cause 2: Port 445 is blocked

System Error 53 or System Error 67 can occur if Port 445 outbound communication to Azure Files data center is blocked. Click [here](http://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx) to see the summary of ISPs that allow or disallow access from port 445.

To understand whether this is the reason behind the "System Error 53" message, you can use Portqry to query the TCP:445 endpoint. If the TCP:445 endpoint is displayed as filtered, the TCP port is blocked. Here is an example query:

  `g:\DataDump\Tools\Portqry>PortQry.exe -n [storage account name].file.core.windows.net -p TCP -e 445`

If the TCP 445 is blocked by a rule along the network path, you will see the following output:

  **TCP port 445 (microsoft-ds service): FILTERED**

For more information about how to use Portqry, see [Description of the Portqry.exe command-line utility](https://support.microsoft.com/help/310099).

### Solution for Cause 2

Work with your IT department to open Port 445 outbound to [Azure IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

### Cause 3 NTLMv1 is enabled

System Error 53 or System error 87 can also be received if NTLMv1 communication is enabled on the client. Azure Files supports only NTLMv2 authentication. Having NTLMv1 enabled creates a less-secure client. Therefore, communication will be blocked for Azure Files. To determine whether this is the cause of the error, verify that the following registry subkey is set to a value of 3:

HKLM\SYSTEM\CurrentControlSet\Control\Lsa > LmCompatibilityLevel.

For more information, see the [LmCompatibilityLevel](https://technet.microsoft.com/library/cc960646.aspx) topic on TechNet.

### Solution for Cause 3

To resolve this issue, revert the **LmCompatibilityLevel** value to the default value of 3 in the following registry subkey:

  **HKLM\SYSTEM\CurrentControlSet\Control\Lsa**

<a id="error1816"></a>
## Error 1816 “Not enough quota is available to process this command” when you copy to an Azure file share

### Cause

The problem occurs because you have reached the upper limit of concurrent open handles that are allowed for a file on the computer on which the file share is being mounted.

### Solution

Reduce the number of concurrent open handles by closing some handles, and then retry. For more information, see [Microsoft Azure Storage Performance and Scalability Checklist](storage-performance-checklist.md).

<a id="slowfilecopying"></a>
## Slow file copying to and from Azure file storage on Windows

You may see slow performance when you try to transfer files to the Azure File service.

-	 If you don’t have a specific minimum I/O size requirement, we recommend that you use 1 MB as the I/O size for optimal performance.
-	If you know the final size of a file that you are extending with writes, and your software doesn’t have compatibility issues when the not yet written tail on the file containing zeros, then set the file size in advance instead of every write being an extending write.
-	Use the right copy method:

  -	Use AZCopy for any transfer between two file shares. See [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md#file-copy) for more details.

  -	Use Robocopy between a file share an on-premises computer. See [Multi-threaded robocopy for faster copies](https://blogs.msdn.microsoft.com/granth/2009/12/07/multi-threaded-robocopy-for-faster-copies/) for more details.

**Considerations for Windows 8.1 or Windows Server 2012 R2**

For clients who are running Windows 8.1 or Windows Server 2012 R2, make sure that the [KB3114025](https://support.microsoft.com/help/3114025) hotfix is installed. This hotfix improves the create and close handle performance.

You can run the following script to check whether the hotfix has been installed on:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies`

If hotfix is installed, the following output is displayed:

**HKEY_Local_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies {96c345ef-3cac-477b-8fcd-bea1a564241c} REG_DWORD 0x1**

> [!Note]
> Windows Server 2012 R2 images in Azure Marketplace have the hotfix KB3114025 installed by default starting in December 2015.

<a id="shareismissing"></a>
## If you map an Azure file share as an Administrator by using net use, the share appears to be missing:  no folder with a drive letter in “My Computer”

### Cause

By default, Windows File Explorer does not run as Administrator. If you run net use from an Administrator command prompt, you map the network drive "As Administrator." Because mapped drives are user-centric, the user account that is logged in does not display the drives if they are mounted under a different user account.

### Solution
Mount the share from a non-administrator command line. Alternatively, you can follow [this TechNet topic](https://technet.microsoft.com/library/ee844140.aspx) to configure the EnableLinkedConnections registry value.

<a id="netuse"></a>
## Net use command fails if the Storage account contains a forward slash ( / )

### Cause

The net use command interprets a forward slash ( / ) as a command-line option. If your user account name starts with a forward slash, this causes the drive mapping to fail.

### Solution

You can use either of the following steps to work around the issue:

- Run the following PowerShell command:

`New-SmbMapping -LocalPath y: -RemotePath \\server\share -UserName accountName -Password "password can contain / and \ etc" `

From a batch file this can be done as the following:

`Echo new-smbMapping ... | powershell -command –`

- Put double quotation marks around the key to work around this issue — unless "/" is the first character. If it is, either use the interactive mode and enter your password separately or regenerate your keys to get a key that doesn't start with the forward slash (/) character.

<a id="cannotaccess"></a>
## Application or service cannot access mounted Azure Files drive

### Cause

Drives are mounted per user. If your application or service is running under a different user account than the one that mounted the drive, the application will not see the drive.

### Solution

One of the following solutions can be user:

-	Mount drive from the same user account under which the application is. This can be done using tools such as psexec.

- Another option for net use is to pass in the storage account name and key in the user name and password parameters of the net use command.

After you follow these instructions, you may receive the following error message: "System error 1312 has occurred. A specified logon session does not exist. It may already have been terminated" when you run net use for the system/network service account. If this occurs, make sure that the username that is passed to net use includes domain information (for example: "[storage account name].file.core.windows.net").

<a id="doesnotsupportencryption"></a>
## Error "You are copying a file to a destination that does not support encryption"

In order to copy a file over the network, the file is decrypted on the source computer, transmitted in plain-text, and re-encrypted on the destination. However, you may see the following error when trying to copy an encrypted file:
You are copying the file to a destination that does not support encryption

### Cause
This can occur if you are using Encrypted File System (EFS). Bitlocker-encrypted files can be copied to Azure Files. However, Azure File storage does not support NTFS EFS.

### Workaround
To copy a file over the network, you must first decrypt it. You can do this by using one of the following methods:

- Use copy /d (this allows the encrypted files that are being copied to be saved as decrypted files at the destination)
- Set the following registry key:

  - Path=HKLM\Software\Policies\Microsoft\Windows\System
  - Value type=DWORD
  - Name = CopyFileAllowDecryptedRemoteDestination
  - Value = 1

However, be aware that setting the registry key affects all copy operations that are made to network shares.

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.