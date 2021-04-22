---
title: Troubleshoot Azure Files problems in Windows
description: Troubleshooting Azure Files problems in Windows. See common issues related to Azure Files when you connect from Windows clients, and see possible resolutions. Only for SMB shares
author: jeffpatt24
ms.service: storage
ms.topic: troubleshooting
ms.date: 09/13/2019
ms.author: jeffpatt
ms.subservice: files
---
# Troubleshoot Azure Files problems in Windows (SMB)

This article lists common problems that are related to Microsoft Azure Files when you connect from Windows clients. It also provides possible causes and resolutions for these problems. In addition to the troubleshooting steps in this article, you can also use [AzFileDiagnostics](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) to ensure that the Windows client environment has correct prerequisites. AzFileDiagnostics automates detection of most of the symptoms mentioned in this article and helps set up your environment to get optimal performance.

> [!IMPORTANT]
> The content of this article only applies to SMB shares. For details on NFS shares, see [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md).

<a id="error5"></a>
## Error 5 when you mount an Azure file share

When you try to mount a file share, you might receive the following error:

- System error 5 has occurred. Access is denied.

### Cause 1: Unencrypted communication channel

For security reasons, connections to Azure file shares are blocked if the communication channel isn't encrypted and if the connection attempt isn't made from the same datacenter where the Azure file shares reside. Unencrypted connections within the same datacenter can also be blocked if the [Secure transfer required](../common/storage-require-secure-transfer.md) setting is enabled on the storage account. An encrypted communication channel is provided only if the user's client OS supports SMB encryption.

Windows 8, Windows Server 2012, and later versions of each system negotiate requests that include SMB 3.0, which supports encryption.

### Solution for cause 1

1. Connect from a client that supports SMB encryption (Windows 8, Windows Server 2012 or later) or connect from a virtual machine in the same datacenter as the Azure storage account that is used for the Azure file share.
2. Verify the [Secure transfer required](../common/storage-require-secure-transfer.md) setting is disabled on the storage account if the client does not support SMB encryption.

### Cause 2: Virtual network or firewall rules are enabled on the storage account 

If virtual network (VNET) and firewall rules are configured on the storage account, network traffic will be denied access unless the client IP address or virtual network is allowed access.

### Solution for cause 2

Verify virtual network and firewall rules are configured properly on the storage account. To test if virtual network or firewall rules is causing the issue, temporarily change the setting on the storage account to **Allow access from all networks**. To learn more, see [Configure Azure Storage firewalls and virtual networks](../common/storage-network-security.md).

### Cause 3: Share-level permissions are incorrect when using identity-based authentication

If users are accessing the Azure file share using Active Directory (AD) or Azure Active Directory Domain Services (Azure AD DS) authentication, access to the file share will fail with "Access is denied" error if share-level permissions are incorrect. 

### Solution for cause 3

Validate that permissions are configured correctly:

- **Active Directory (AD)** see [Assign share-level permissions to an identity](./storage-files-identity-ad-ds-assign-permissions.md).

    Share-level permission assignments are supported for groups and users that have been synced from the Active Directory (AD) to Azure Active Directory (Azure AD) using Azure AD Connect.  Confirm that groups and users being assigned share-level permissions are not unsupported "cloud-only" groups.
- **Azure Active Directory Domain Services (Azure AD DS)** see [Assign access permissions to an identity](./storage-files-identity-auth-active-directory-domain-service-enable.md?tabs=azure-portal#assign-access-permissions-to-an-identity).

<a id="error53-67-87"></a>
## Error 53, Error 67, or Error 87 when you mount or unmount an Azure file share

When you try to mount a file share from on-premises or from a different datacenter, you might receive the following errors:

- System error 53 has occurred. The network path was not found.
- System error 67 has occurred. The network name cannot be found.
- System error 87 has occurred. The parameter is incorrect.

### Cause 1: Port 445 is blocked

System error 53 or system error 67 can occur if port 445 outbound communication to an Azure Files datacenter is blocked. To see the summary of ISPs that allow or disallow access from port 445, go to [TechNet](https://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx).

To check if your firewall or ISP is blocking port 445, use the [AzFileDiagnostics](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) tool or `Test-NetConnection` cmdlet. 

To use the `Test-NetConnection` cmdlet, the Azure PowerShell module must be installed, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps) for more information. Remember to replace `<your-storage-account-name>` and `<your-resource-group-name>` with the relevant names for your storage account.

   
```azurepowershell
$resourceGroupName = "<your-resource-group-name>"
$storageAccountName = "<your-storage-account-name>"

# This command requires you to be logged into your Azure account, run Login-AzAccount if you haven't
# already logged in.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName

# The ComputerName, or host, is <storage-account>.file.core.windows.net for Azure Public Regions.
# $storageAccount.Context.FileEndpoint is used because non-Public Azure regions, such as sovereign clouds
# or Azure Stack deployments, will have different hosts for Azure file shares (and other storage resources).
Test-NetConnection -ComputerName ([System.Uri]::new($storageAccount.Context.FileEndPoint).Host) -Port 445
```
    
If the connection was successful, you should see the following output:
    
  
```azurepowershell
ComputerName     : <your-storage-account-name>
RemoteAddress    : <storage-account-ip-address>
RemotePort       : 445
InterfaceAlias   : <your-network-interface>
SourceAddress    : <your-ip-address>
TcpTestSucceeded : True
```
 

> [!Note]  
> The above command returns the current IP address of the storage account. This IP address is not guaranteed to remain the same, and may change at any time. Do not hardcode this IP address into any scripts, or into a firewall configuration.

### Solution for cause 1

#### Solution 1 - Use Azure File Sync
Azure File Sync can transform your on-premises Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. Azure File Sync works over port 443 and can thus be used as a workaround to access Azure Files from clients that have port 445 blocked. [Learn how to setup Azure File Sync](../file-sync/file-sync-extend-servers.md).

#### Solution 2 - Use VPN
By Setting up a VPN to your specific Storage Account, the traffic will go through a secure tunnel as opposed to over the internet. Follow the [instructions to setup VPN](storage-files-configure-p2s-vpn-windows.md) to access Azure Files from Windows.

#### Solution 3 - Unblock port 445 with help of your ISP/IT Admin
Work with your IT department or ISP to open port 445 outbound to [Azure IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

#### Solution 4 - Use REST API based tools like Storage Explorer/Powershell
Azure Files also supports REST in addition to SMB. REST access works over port 443 (standard tcp). There are various tools that are written using REST API which enable rich UI experience. [Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows) is one of them. [Download and Install Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) and connect to your file share backed by Azure Files. You can also use [PowerShell](./storage-how-to-use-files-powershell.md) which also user REST API.

### Cause 2: NTLMv1 is enabled

System error 53 or system error 87 can occur if NTLMv1 communication is enabled on the client. Azure Files supports only NTLMv2 authentication. Having NTLMv1 enabled creates a less-secure client. Therefore, communication is blocked for Azure Files. 

To determine whether this is the cause of the error, verify that the following registry subkey is not set to a value less than 3:

**HKLM\SYSTEM\CurrentControlSet\Control\Lsa > LmCompatibilityLevel**

For more information, see the [LmCompatibilityLevel](/previous-versions/windows/it-pro/windows-2000-server/cc960646(v=technet.10)) topic on TechNet.

### Solution for cause 2

Revert the **LmCompatibilityLevel** value to the default value of 3 in the following registry subkey:

  **HKLM\SYSTEM\CurrentControlSet\Control\Lsa**

<a id="error1816"></a>
## Error 1816 - Not enough quota is available to process this command

### Cause

Error 1816 happens when you reach the upper limit of concurrent open handles that are allowed for a file or directory on the Azure file share. For more information, see [Azure Files scale targets](./storage-files-scale-targets.md#azure-files-scale-targets).

### Solution

Reduce the number of concurrent open handles by closing some handles, and then retry. For more information, see [Microsoft Azure Storage performance and scalability checklist](../blobs/storage-performance-checklist.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

To view open handles for a file share, directory or file, use the [Get-AzStorageFileHandle](/powershell/module/az.storage/get-azstoragefilehandle) PowerShell cmdlet.  

To close open handles for a file share, directory or file, use the [Close-AzStorageFileHandle](/powershell/module/az.storage/close-azstoragefilehandle) PowerShell cmdlet.

> [!Note]  
> The Get-AzStorageFileHandle and Close-AzStorageFileHandle cmdlets are included in Az PowerShell module version 2.4 or later. To install the latest Az PowerShell module, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps).

<a id="noaaccessfailureportal"></a>
## Error "No access" when you try to access or delete an Azure File Share  
When you try to access or delete an Azure file share in the portal, you may receive the following error:

No access  
Error code: 403 

### Cause 1: Virtual network or firewall rules are enabled on the storage account

### Solution for cause 1

Verify virtual network and firewall rules are configured properly on the storage account. To test if virtual network or firewall rules is causing the issue, temporarily change the setting on the storage account to **Allow access from all networks**. To learn more, see [Configure Azure Storage firewalls and virtual networks](../common/storage-network-security.md).

### Cause 2: Your user account does not have access to the storage account

### Solution for cause 2

Browse to the storage account where the Azure file share is located, click **Access control (IAM)** and verify your user account has access to the storage account. To learn more, see [How to secure your storage account with Azure role-based access control (Azure RBAC)](../blobs/security-recommendations.md#data-protection).

<a id="open-handles"></a>
## Unable to modify, move/rename, or delete a file or directory
One of the key purposes of a file share is that multiple users and applications may simultaneously interact with files and directories in the share. To assist with this interaction, file shares provide several ways of mediating access to files and directories.

When you open a file from a mounted Azure file share over SMB, your application/operating system request a file handle, which is a reference to the file. Among other things, your application specifies a file sharing mode when it requests a file handle, which specifies the level of exclusivity of your access to the file enforced by Azure Files: 

- `None`: you have exclusive access. 
- `Read`: others may read the file while you have it open.
- `Write`: others may write to the file while you have it open. 
- `ReadWrite`: a combination of both the `Read` and `Write` sharing modes.
- `Delete`: others may delete the file while you have it open. 

Although as a stateless protocol, the FileREST protocol does not have a concept of file handles, it does provide a similar mechanism to mediate access to files and folders that your script, application, or service may use: file leases. When a file is leased, it is treated as equivalent to a file handle with a file sharing mode of `None`. 

Although file handles and leases serve an important purpose, sometimes file handles and leases may be orphaned. When this happens, this can cause problems modifying or deleting files. You may see error messages like:

- The process cannot access the file because it is being used by another process.
- The action can't be completed because the file is open in another program.
- The document is locked for editing by another user.
- The specified resource is marked for deletion by an SMB client.

The resolution to this issue depends on whether this is being caused by an orphaned file handle or lease. 

### Cause 1
A file handle is preventing a file/directory from being modified or deleted. You can use the [Get-AzStorageFileHandle](/powershell/module/az.storage/get-azstoragefilehandle) PowerShell cmdlet to view open handles. 

If all SMB clients have closed their open handles on a file/directory and the issue continues to occur, you can force close a file handle.

### Solution 1
To force a file handle to be closed, use the [Close-AzStorageFileHandle](/powershell/module/az.storage/close-azstoragefilehandle) PowerShell cmdlet. 

> [!Note]  
> The Get-AzStorageFileHandle and Close-AzStorageFileHandle cmdlets are included in Az PowerShell module version 2.4 or later. To install the latest Az PowerShell module, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps).

### Cause 2
A file lease is prevent a file from being modified or deleted. You can check if a file has a file lease with the following PowerShell, replacing `<resource-group>`, `<storage-account>`, `<file-share>`, and `<path-to-file>` with the appropriate values for your environment:

```PowerShell
# Set variables 
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"
$fileShareName = "<file-share>"
$fileForLease = "<path-to-file>"

# Get reference to storage account
$storageAccount = Get-AzStorageAccount `
        -ResourceGroupName $resourceGroupName `
        -Name $storageAccountName

# Get reference to file
$file = Get-AzStorageFile `
        -Context $storageAccount.Context `
        -ShareName $fileShareName `
        -Path $fileForLease

$fileClient = $file.ShareFileClient

# Check if the file has a file lease
$fileClient.GetProperties().Value
```

If a file has a lease, the returned object should contain the following properties:

```Output
LeaseDuration         : Infinite
LeaseState            : Leased
LeaseStatus           : Locked
```

### Solution 2
To remove a lease from a file, you can release the lease or break the lease. To release the lease, you need the LeaseId of the lease, which you set when you create the lease. You do not need the LeaseId to break the lease.

The following example shows how to break the lease for the file indicated in cause 2 (this example continues with the PowerShell variables from cause 2):

```PowerShell
$leaseClient = [Azure.Storage.Files.Shares.Specialized.ShareLeaseClient]::new($fileClient)
$leaseClient.Break() | Out-Null
```

<a id="slowfilecopying"></a>
## Slow file copying to and from Azure Files in Windows

You might see slow performance when you try to transfer files to the Azure File service.

- If you don't have a specific minimum I/O size requirement, we recommend that you use 1 MiB as the I/O size for optimal performance.
-	If you know the final size of a file that you are extending with writes, and your software doesn't have compatibility problems when the unwritten tail on the file contains zeros, then set the file size in advance instead of making every write an extending write.
-	Use the right copy method:
    -	Use [AzCopy](../common/storage-use-azcopy-v10.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for any transfer between two file shares.
    -	Use [Robocopy](./storage-how-to-create-file-share.md) between file shares on an on-premises computer.

### Considerations for Windows 8.1 or Windows Server 2012 R2

For clients that are running Windows 8.1 or Windows Server 2012 R2, make sure that the [KB3114025](https://support.microsoft.com/help/3114025) hotfix is installed. This hotfix improves the performance of create and close handles.

You can run the following script to check whether the hotfix has been installed:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies`

If hotfix is installed, the following output is displayed:

`HKEY_Local_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies {96c345ef-3cac-477b-8fcd-bea1a564241c} REG_DWORD 0x1`

> [!Note]
> Windows Server 2012 R2 images in Azure Marketplace have hotfix KB3114025 installed by default, starting in December 2015.

<a id="shareismissing"></a>
## No folder with a drive letter in "My Computer" or "This PC"

If you map an Azure file share as an administrator by using net use, the share appears to be missing.

### Cause

By default, Windows File Explorer does not run as an administrator. If you run net use from an administrative command prompt, you map the network drive as an administrator. Because mapped drives are user-centric, the user account that is logged in does not display the drives if they are mounted under a different user account.

### Solution
Mount the share from a non-administrator command line. Alternatively, you can follow [this TechNet topic](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee844140(v=ws.10)) to configure the **EnableLinkedConnections** registry value.

<a id="netuse"></a>
## Net use command fails if the storage account contains a forward slash

### Cause

The net use command interprets a forward slash (/) as a command-line option. If your user account name starts with a forward slash, the drive mapping fails.

### Solution

You can use either of the following steps to work around the problem:

- Run the following PowerShell command:

  `New-SmbMapping -LocalPath y: -RemotePath \\server\share -UserName accountName -Password "password can contain / and \ etc"`

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
- Use the cmdkey command to add the credentials into Credential Manager. Perform this from a command line under the service account context, either through an interactive login or by using `runas`.
  
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

## Slow enumeration of files and folders

### Cause

This problem can occur if there is no enough cache on client machine for large directories.

### Solution

To resolve this problem,  adjusting the **DirectoryCacheEntrySizeMax** registry value  to allow caching of larger directory listings in the client machine:

- Location: HKLM\System\CCS\Services\Lanmanworkstation\Parameters
- Value mane: DirectoryCacheEntrySizeMax 
- Value type:DWORD
 
 
For example, you can set it to 0x100000 and see if the performance become better.

## Error AadDsTenantNotFound in enabling Azure Active Directory Domain Service (Azure AD DS) authentication for Azure Files "Unable to locate active tenants with tenant ID aad-tenant-id"

### Cause

Error AadDsTenantNotFound happens when you try to [enable Azure Active Directory Domain Services (Azure AD DS) authentication on Azure Files](storage-files-identity-auth-active-directory-domain-service-enable.md) on a storage account where [Azure AD Domain Service(Azure AD DS)](../../active-directory-domain-services/overview.md) is not created on the Azure AD tenant of the associated subscription.  

### Solution

Enable Azure AD DS on the Azure AD tenant of the subscription that your storage account is deployed to. You need administrator privileges of the Azure AD tenant to create a managed domain. If you aren't the administrator of the Azure AD tenant, contact the administrator and follow the step-by-step guidance to [Create and configure an Azure Active Directory Domain Services managed domain](../../active-directory-domain-services/tutorial-create-instance.md).

[!INCLUDE [storage-files-condition-headers](../../../includes/storage-files-condition-headers.md)]

## Unable to mount Azure Files with AD credentials 

### Self diagnostics steps
First, make sure that you have followed through all four steps to [enable Azure Files AD Authentication](./storage-files-identity-auth-active-directory-enable.md).

Second, try [mounting Azure file share with storage account key](./storage-how-to-use-files-windows.md). If you failed to mount, download [AzFileDiagnostics.ps1](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) to help you validate the client running environment, detect the incompatible client configuration which would cause access failure for Azure Files, gives prescriptive guidance on self-fix and, collect the diagnostics traces.

Third, you can run the Debug-AzStorageAccountAuth cmdlet to conduct a set of basic checks on your AD configuration with the logged on AD user. This cmdlet is supported on [AzFilesHybrid v0.1.2+ version](https://github.com/Azure-Samples/azure-files-samples/releases). You need to run this cmdlet with an AD user that has owner permission on the target storage account.  
```PowerShell
$ResourceGroupName = "<resource-group-name-here>"
$StorageAccountName = "<storage-account-name-here>"

Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```
The cmdlet performs these checks below in sequence and provides guidance for failures:
1. CheckADObjectPasswordIsCorrect: Ensure that the password configured on the AD identity that represents the storage account is matching that of the storage account kerb1 or kerb2 key. If the password is incorrect, you can run [Update-AzStorageAccountADObjectPassword](./storage-files-identity-ad-ds-update-password.md) to reset the password. 
2. CheckADObject: Confirm that there is an object in the Active Directory that represents the storage account and has the correct SPN (service principal name). If the SPN isn't correctly setup, please run the Set-AD cmdlet returned in the debug cmdlet to configure the SPN.
3. CheckDomainJoined: Validate that the client machine is domain joined to AD. If your machine is not domain joined to AD, please refer to this [article](/windows-server/identity/ad-fs/deployment/join-a-computer-to-a-domain) for domain join instruction.
4. CheckPort445Connectivity: Check that Port 445 is opened for SMB connection. If the required Port is not open, please refer to the troubleshooting tool [AzFileDiagnostics.ps1](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) for connectivity issues with Azure Files.
5. CheckSidHasAadUser: Check that the logged on AD user is synced to Azure AD. If you want to look up whether a specific AD user is synchronized to Azure AD, you can specify the -UserName and -Domain in the input parameters. 
6. CheckGetKerberosTicket: Attempt to get a Kerberos ticket to connect to the storage account. If there isn't a valid Kerberos token, run the klist get cifs/storage-account-name.file.core.windows.net cmdlet and examine the error code to root-cause the ticket retrieval failure.
7. CheckStorageAccountDomainJoined: Check if the AD authentication has been enabled and the account's AD properties are populated. If not, refer to the instruction [here](./storage-files-identity-ad-ds-enable.md) to enable AD DS authentication on Azure Files. 
8. CheckUserRbacAssignment: Check if the AD user has the proper RBAC role assignment to provide share level permission to access Azure Files. If not, refer to the instruction [here](./storage-files-identity-ad-ds-assign-permissions.md) to configure the share level permission. (Supported on AzFilesHybrid v0.2.3+ version)
9. CheckUserFileAccess: Check if the AD user has the proper directory/file permission (Windows ACLs) to access Azure Files. If not, refer to the instruction [here](./storage-files-identity-ad-ds-configure-permissions.md) to configure the directory/file level permission. (Supported on AzFilesHybrid v0.2.3+ version)

## Unable to configure directory/file level permissions (Windows ACLs) with Windows File Explorer

### Symptom

You may experience either symptoms described below when trying to configure Windows ACLs with File Explorer on a mounted file share:
- After you click on Edit permission under the Security tab, the Permission wizard does not load. 
- When you try to select a new user or group, the domain location does not display the right AD DS domain. 

### Solution

We recommend you to use [icacls tool](/windows-server/administration/windows-commands/icacls) to configure the directory/file level permissions as a workaround. 

## Errors when running Join-AzStorageAccountForAuth cmdlet

### Error: "The directory service was unable to allocate a relative identifier"

This error may occur if a domain controller that holds the RID Master FSMO role is unavailable or was removed from the domain and restored from backup.  Confirm that all Domain Controllers are running and available.

### Error: "Cannot bind positional parameters because no names were given"

This error is most likely triggered by a syntax error in the Join-AzStorageAccountforAuth command.  Check the command for misspellings or syntax errors and verify that the latest version of the AzFilesHybrid module (https://github.com/Azure-Samples/azure-files-samples/releases) is installed.  

## Azure Files on-premises AD DS Authentication support for AES 256 Kerberos encryption

We introduced AES 256 Kerberos encryption support for Azure Files on-prem AD DS authentication with [AzFilesHybrid module v0.2.2](https://github.com/Azure-Samples/azure-files-samples/releases). If you have enabled AD DS authentication with a module version lower than v0.2.2, you will need to download the latest AzFilesHybrid module (v0.2.2+) and run the PowerShell below. If you have not enabled AD DS authentication on your storage account yet, you can follow this [guidance](./storage-files-identity-ad-ds-enable.md#option-one-recommended-use-azfileshybrid-powershell-module) for enablement. 

```PowerShell
$ResourceGroupName = "<resource-group-name-here>"
$StorageAccountName = "<storage-account-name-here>"

Update-AzStorageAccountAuthForAES256 -ResourceGroupName $ResourceGroupName -StorageAccountName $StorageAccountName
```


## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
