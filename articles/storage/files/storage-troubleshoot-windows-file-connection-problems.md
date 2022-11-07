---
title: Troubleshoot Azure Files problems in Windows
description: Troubleshoot problems with SMB Azure file shares in Windows. See common issues related to Azure Files when you connect from Windows clients, and see possible resolutions.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 11/04/2022
ms.author: kendownie
ms.subservice: files 
ms.custom: devx-track-azurepowershell
---
# Troubleshoot Azure Files problems in Windows (SMB)

This article lists common problems that are related to Microsoft Azure Files when you connect from Windows clients. It also provides possible causes and resolutions for these problems. In addition to the troubleshooting steps in this article, you can also use [`AzFileDiagnostics`](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) to ensure that the Windows client environment has correct prerequisites. `AzFileDiagnostics` automates detection of most of the symptoms mentioned in this article and helps set up your environment to get optimal performance.

> [!IMPORTANT]
> The content of this article only applies to SMB shares. For details on NFS shares, see [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

<a id="error5"></a>
## Error 5 when you mount an Azure file share

When you try to mount a file share, you might receive the following error:

- System error 5 has occurred. Access is denied.

### Cause 1: Unencrypted communication channel

For security reasons, connections to Azure file shares are blocked if the communication channel isn't encrypted and if the connection attempt isn't made from the same datacenter where the Azure file shares reside. If the [Secure transfer required](../common/storage-require-secure-transfer.md) setting is enabled on the storage account, unencrypted connections within the same datacenter are also blocked. An encrypted communication channel is provided only if the end-user's client OS supports SMB encryption.

Windows 8, Windows Server 2012, and later versions of each system negotiate requests that include SMB 3.x, which supports encryption.

### Solution for cause 1

1. Connect from a client that supports SMB encryption (Windows 8/Windows Server 2012 or later).
2. Connect from a virtual machine (VM) in the same datacenter as the Azure storage account that is used for the Azure file share.
3. Verify the [Secure transfer required](../common/storage-require-secure-transfer.md) setting is disabled on the storage account if the client doesn't support SMB encryption.

### Cause 2: Virtual network or firewall rules are enabled on the storage account 
Network traffic is denied if virtual network (VNET) and firewall rules are configured on the storage account, unless the client IP address or virtual network is allow-listed.

### Solution for cause 2

Verify that virtual network and firewall rules are configured properly on the storage account. To test if virtual network or firewall rules is causing the issue, temporarily change the setting on the storage account to **Allow access from all networks**. To learn more, see [Configure Azure Storage firewalls and virtual networks](../common/storage-network-security.md).

### Cause 3: Share-level permissions are incorrect when using identity-based authentication

If end users are accessing the Azure file share using Active Directory (AD) or Azure Active Directory Domain Services (Azure AD DS) authentication, access to the file share fails with "Access is denied" error if share-level permissions are incorrect. 

### Solution for cause 3

Validate that permissions are configured correctly:

- **Active Directory Domain Services (AD DS)** see [Assign share-level permissions to an identity](./storage-files-identity-ad-ds-assign-permissions.md).

    Share-level permission assignments are supported for groups and users that have been synced from AD DS to Azure Active Directory (Azure AD) using Azure AD Connect sync or Azure AD Connect cloud sync. Confirm that groups and users being assigned share-level permissions are not unsupported "cloud-only" groups.
- **Azure Active Directory Domain Services (Azure AD DS)** see [Assign share-level permissions to an Azure AD identity](./storage-files-identity-auth-active-directory-domain-service-enable.md?tabs=azure-portal#assign-share-level-permissions-to-an-azure-ad-identity).

<a id="error53-67-87"></a>
## Error 53, Error 67, or Error 87 when you mount or unmount an Azure file share

When you try to mount a file share from on-premises or from a different datacenter, you might receive the following errors:

- System error 53 has occurred. The network path was not found.
- System error 67 has occurred. The network name cannot be found.
- System error 87 has occurred. The parameter is incorrect.

### Cause 1: Port 445 is blocked

System error 53 or system error 67 can occur if port 445 outbound communication to an Azure Files datacenter is blocked. To see the summary of ISPs that allow or disallow access from port 445, go to [TechNet](https://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx).

To check if your firewall or ISP is blocking port 445, use the [`AzFileDiagnostics`](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) tool or `Test-NetConnection` cmdlet. 

To use the `Test-NetConnection` cmdlet, the Azure PowerShell module must be installed. See [Install Azure PowerShell module](/powershell/azure/install-Az-ps) for more information. Remember to replace `<your-storage-account-name>` and `<your-resource-group-name>` with the relevant names for your storage account.

   
```azurepowershell
$resourceGroupName = "<your-resource-group-name>"
$storageAccountName = "<your-storage-account-name>"

# This command requires you to be logged into your Azure account and set the subscription your storage account is under, run:
# Connect-AzAccount -SubscriptionId ‘xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx’
# if you haven't already logged in.
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
> The above command returns the current IP address of the storage account. This IP address is not guaranteed to remain the same, and may change at any time. Don't hardcode this IP address into any scripts, or into a firewall configuration.

### Solution for cause 1

#### Solution 1 — Use Azure File Sync as a QUIC endpoint
You can use Azure File Sync as a workaround to access Azure Files from clients that have port 445 blocked. Although Azure Files doesn't directly support SMB over QUIC, Windows Server 2022 Azure Edition does support the QUIC protocol. You can create a lightweight cache of your Azure file shares on a Windows Server 2022 Azure Edition VM using Azure File Sync. This uses port 443, which is widely open outbound to support HTTPS, instead of port 445. To learn more about this option, see [SMB over QUIC with Azure File Sync](storage-files-networking-overview.md#smb-over-quic).

#### Solution 2 — Use VPN or ExpressRoute
By setting up a VPN or ExpressRoute from on-premises to your Azure storage account, with Azure Files exposed on your internal network using private endpoints, the traffic will go through a secure tunnel as opposed to over the internet. Follow the [instructions to setup VPN](storage-files-configure-p2s-vpn-windows.md) to access Azure Files from Windows.

#### Solution 3 — Unblock port 445 with help of your ISP/IT Admin
Work with your IT department or ISP to open port 445 outbound to [Azure IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

#### Solution 4 — Use REST API-based tools like Storage Explorer/PowerShell
Azure Files also supports REST in addition to SMB. REST access works over port 443 (standard tcp). There are various tools that are written using REST API that enable a rich UI experience. [Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows) is one of them. [Download and Install Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) and connect to your file share backed by Azure Files. You can also use [PowerShell](./storage-how-to-use-files-portal.md) which also uses REST API.

### Cause 2: NTLMv1 is enabled

System error 53 or system error 87 can occur if NTLMv1 communication is enabled on the client. Azure Files supports only NTLMv2 authentication. Having NTLMv1 enabled creates a less-secure client. Therefore, communication is blocked for Azure Files. 

To determine whether this is the cause of the error, verify that the following registry subkey isn't set to a value less than 3:

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
> The `Get-AzStorageFileHandle` and `Close-AzStorageFileHandle` cmdlets are included in Az PowerShell module version 2.4 or later. To install the latest Az PowerShell module, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps).

<a id="networkerror59"></a>
## ERROR_UNEXP_NET_ERR (59) when doing any operations on a handle

### Cause

If you cache/hold a large number of open handles for a long time, you might see this server-side failure due to throttling reasons. When a large number of handles are cached by the client, many of those handles can go into a reconnect phase at the same time, building up a queue on the server which needs to be throttled. The retry logic and the throttling on the backend for reconnect takes longer than the client's timeout. This situation manifests itself as a client not being able to use an existing handle for any operation, with all operations failing with ERROR_UNEXP_NET_ERR (59).

There are also edge cases in which the client handle becomes disconnected from the server (for example, a network outage lasting several minutes) that could cause this error.

### Solution

Don’t keep a large number of handles cached. Close handles and then retry. See preceding troubleshooting entry for PowerShell cmdlets to view/close open handles.

<a id="noaaccessfailureportal"></a>
## Error "No access" when you try to access or delete an Azure File Share
When you try to access or delete an Azure file share in the portal, you might receive the following error:

No access  
Error code: 403

### Cause 1: Virtual network or firewall rules are enabled on the storage account

### Solution for cause 1

Verify virtual network and firewall rules are configured properly on the storage account. To test if virtual network or firewall rules is causing the issue, temporarily change the setting on the storage account to **Allow access from all networks**. To learn more, see [Configure Azure Storage firewalls and virtual networks](../common/storage-network-security.md).

### Cause 2: Your user account does not have access to the storage account

### Solution for cause 2

Browse to the storage account where the Azure file share is located, click **Access control (IAM)** and verify your user account has access to the storage account. To learn more, see [How to secure your storage account with Azure role-based access control (Azure RBAC)](../blobs/security-recommendations.md#data-protection).

## Unable to modify or delete an Azure file share (or share snapshots) because of locks or leases
Azure Files provides two ways to prevent accidental modification or deletion of Azure file shares and share snapshots: 

- **Storage account resource locks**: All Azure resources, including the storage account, support [resource locks](../../azure-resource-manager/management/lock-resources.md). Locks might put on the storage account by an administrator, or by value-added services such as Azure Backup. Two variations of resource locks exist: **modify**, which prevents all modifications to the storage account and its resources, and **delete**, which only prevent deletes of the storage account and its resources. When modifying or deleting shares through the `Microsoft.Storage` resource provider, resource locks are enforced on Azure file shares and share snapshots. Most portal operations, Azure PowerShell cmdlets for Azure Files with `Rm` in the name (i.e. `Get-AzRmStorageShare`), and Azure CLI commands in the `share-rm` command group (i.e. `az storage share-rm list`) use the `Microsoft.Storage` resource provider. Some tools and utilities such as Storage Explorer, legacy Azure Files PowerShell management cmdlets without `Rm` in the name (i.e. `Get-AzStorageShare`), and legacy Azure Files CLI commands under the `share` command group (i.e. `az storage share list`) use legacy APIs in the FileREST API that bypass the `Microsoft.Storage` resource provider and resource locks. For more information on legacy management APIs exposed in the FileREST API, see [control plane in Azure Files](/rest/api/storageservices/file-service-rest-api#control-plane).

- **Share/share snapshot leases**: Share leases are a kind of proprietary lock for Azure file shares and file share snapshots. Leases might be put on individual Azure file shares or file share snapshots by administrators by calling the API through a script, or by value-added services such as Azure Backup. When a lease is put on an Azure file share or file share snapshot, modifying or deleting the file share/share snapshot can be done with the *lease ID*. Admins can also release the lease before modification operations, which requires the lease ID, or break the lease, which does not require the lease ID. For more information on share leases, see [lease share](/rest/api/storageservices/lease-share).

Because resource locks and leases might interfere with intended administrator operations on your storage account/Azure file shares, you might wish to remove any resource locks/leases that have been put on your resources manually or automatically by value-added services such as Azure Backup. The following script removes all resource locks and leases. Remember to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment.

To run the following script, you must [install the 3.10.1-preview version](https://www.powershellgallery.com/packages/Az.Storage/3.10.1-preview) of the Azure Storage PowerShell module.

> [!Important]  
> Value-added services that take resource locks and share/share snapshot leases on your Azure Files resources may periodically reapply locks and leases. Modifying or deleting locked resources by value-added services may impact regular operation of those services, such as deleting share snapshots that were managed by Azure Backup.

```PowerShell
# Parameters for storage account resource
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"

# Get reference to storage account
$storageAccount = Get-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName

# Remove resource locks
Get-AzResourceLock `
        -ResourceType "Microsoft.Storage/storageAccounts" `
        -ResourceGroupName $storageAccount.ResourceGroupName `
        -ResourceName $storageAccount.StorageAccountName | `
    Remove-AzResourceLock -Force | `
    Out-Null

# Remove share and share snapshot leases
Get-AzStorageShare -Context $storageAccount.Context | `
    Where-Object { $_.Name -eq $fileShareName } | `
    ForEach-Object {
        try {
            $leaseClient = [Azure.Storage.Files.Shares.Specialized.ShareLeaseClient]::new($_.ShareClient)
            $leaseClient.Break() | Out-Null
        } catch { }
    }
```

<a id="open-handles"></a>
## Unable to modify, move/rename, or delete a file or directory
One of the key purposes of a file share is that multiple users and applications may simultaneously interact with files and directories in the share. To assist with this interaction, file shares provide several ways of mediating access to files and directories.

When you open a file from a mounted Azure file share over SMB, your application/operating system request a file handle, which is a reference to the file. Among other things, your application specifies a file sharing mode when it requests a file handle, which specifies the level of exclusivity of your access to the file enforced by Azure Files: 

- `None`: you have exclusive access. 
- `Read`: others may read the file while you have it open.
- `Write`: others may write to the file while you have it open. 
- `ReadWrite`: a combination of both the `Read` and `Write` sharing modes.
- `Delete`: others may delete the file while you have it open. 

Although as a stateless protocol, the FileREST protocol doesn't have a concept of file handles, it does provide a similar mechanism to mediate access to files and folders that your script, application, or service may use: file leases. When a file is leased, it's treated as equivalent to a file handle with a file sharing mode of `None`. 

Although file handles and leases serve an important purpose, sometimes file handles and leases might be orphaned. When this happens, this can cause problems modifying or deleting files. You may see error messages like:

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
A file lease is preventing a file from being modified or deleted. You can check if a file has a file lease with the following PowerShell, replacing `<resource-group>`, `<storage-account>`, `<file-share>`, and `<path-to-file>` with the appropriate values for your environment:

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
To remove a lease from a file, you can release the lease or break the lease. To release the lease, you need the LeaseId of the lease, which you set when you create the lease. You don't need the LeaseId to break the lease.

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

If you map an Azure file share as an administrator by using the `net use` command, the share appears to be missing.

### Cause

By default, Windows File Explorer doesn't run as an administrator. If you run `net use` from an administrative command prompt, you map the network drive as an administrator. Because mapped drives are user-centric, the user account that is logged in doesn't display the drives if they're mounted under a different user account.

### Solution
Mount the share from a non-administrator command line. Alternatively, you can follow [this TechNet topic](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee844140(v=ws.10)) to configure the **EnableLinkedConnections** registry value.

<a id="netuse"></a>
## Net use command fails if the storage account contains a forward slash

### Cause

The `net use` command interprets a forward slash (/) as a command-line option. If your user account name starts with a forward slash, the drive mapping fails.

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
- Pass the storage account name and key in the user name and password parameters of the `net use` command.
- Use the `cmdkey` command to add the credentials into Credential Manager. Perform this from a command line under the service account context, either through an interactive login or by using `runas`.
  
  `cmdkey /add:<storage-account-name>.file.core.windows.net /user:AZURE\<storage-account-name> /pass:<storage-account-key>`
- Map the share directly without using a mapped drive letter. Some applications may not reconnect to the drive letter properly, so using the full UNC path might more reliable. 

  `net use * \\storage-account-name.file.core.windows.net\share`

After you follow these instructions, you might receive the following error message when you run net use for the system/network service account: "System error 1312 has occurred. A specified logon session does not exist. It may already have been terminated." If this occurs, make sure that the username that is passed to net use includes domain information (for example: "[storage account name].file.core.windows.net").

<a id="doesnotsupportencryption"></a>
## Error "You are copying a file to a destination that does not support encryption"

When a file is copied over the network, the file is decrypted on the source computer, transmitted in plaintext, and re-encrypted at the destination. However, you might see the following error when you're trying to copy an encrypted file: "You are copying the file to a destination that does not support encryption."

### Cause
This problem can occur if you are using Encrypting File System (EFS). BitLocker-encrypted files can be copied to Azure Files. However, Azure Files doesn't support NTFS EFS.

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

This problem can occur if there isn't enough cache on the client machine for large directories.

### Solution

To resolve this problem, adjust the **DirectoryCacheEntrySizeMax** registry value to allow caching of larger directory listings in the client machine:

- Location: `HKLM\System\CCS\Services\Lanmanworkstation\Parameters`
- Value name: `DirectoryCacheEntrySizeMax` 
- Value type: `DWORD` 
 
For example, you can set it to `0x100000` and see if the performance improves.

## Error AadDsTenantNotFound in enabling Azure Active Directory Domain Service (Azure AD DS) authentication for Azure Files "Unable to locate active tenants with tenant ID aad-tenant-id"

### Cause

Error AadDsTenantNotFound happens when you try to [enable Azure Active Directory Domain Services (Azure AD DS) authentication on Azure Files](storage-files-identity-auth-active-directory-domain-service-enable.md) on a storage account where [Azure AD Domain Service(Azure AD DS)](../../active-directory-domain-services/overview.md) isn't created on the Azure AD tenant of the associated subscription.  

### Solution

Enable Azure AD DS on the Azure AD tenant of the subscription that your storage account is deployed to. You need administrator privileges of the Azure AD tenant to create a managed domain. If you aren't the administrator of the Azure AD tenant, contact the administrator and follow the step-by-step guidance to [Create and configure an Azure Active Directory Domain Services managed domain](../../active-directory-domain-services/tutorial-create-instance.md).

[!INCLUDE [storage-files-condition-headers](../../../includes/storage-files-condition-headers.md)]

## Unable to mount Azure Files with AD credentials 

### Self diagnostics steps
First, make sure that you've followed through all four steps to [enable Azure Files AD DS Authentication](./storage-files-identity-auth-active-directory-enable.md).

Second, try [mounting Azure file share with storage account key](./storage-how-to-use-files-windows.md). If the share fails to mount, download [`AzFileDiagnostics`](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) to help you validate the client running environment, detect the incompatible client configuration which would cause access failure for Azure Files, give prescriptive guidance on self-fix, and collect the diagnostics traces.

Third, you can run the `Debug-AzStorageAccountAuth` cmdlet to conduct a set of basic checks on your AD configuration with the logged on AD user. This cmdlet is supported on [AzFilesHybrid v0.1.2+ version](https://github.com/Azure-Samples/azure-files-samples/releases). You need to run this cmdlet with an AD user that has owner permission on the target storage account.  
```PowerShell
$ResourceGroupName = "<resource-group-name-here>"
$StorageAccountName = "<storage-account-name-here>"

Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```
The cmdlet performs these checks below in sequence and provides guidance for failures:
1. CheckADObjectPasswordIsCorrect: Ensure that the password configured on the AD identity that represents the storage account is matching that of the storage account kerb1 or kerb2 key. If the password is incorrect, you can run [Update-AzStorageAccountADObjectPassword](./storage-files-identity-ad-ds-update-password.md) to reset the password. 
2. CheckADObject: Confirm that there is an object in the Active Directory that represents the storage account and has the correct SPN (service principal name). If the SPN isn't correctly set up, please run the Set-AD cmdlet returned in the debug cmdlet to configure the SPN.
3. CheckDomainJoined: Validate that the client machine is domain joined to AD. If your machine is not domain joined to AD, please refer to this [article](/windows-server/identity/ad-fs/deployment/join-a-computer-to-a-domain) for domain join instruction.
4. CheckPort445Connectivity: Check that Port 445 is opened for SMB connection. If the required Port is not open, please refer to the troubleshooting tool [`AzFileDiagnostics`](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) for connectivity issues with Azure Files.
5. CheckSidHasAadUser: Check that the logged on AD user is synced to Azure AD. If you want to look up whether a specific AD user is synchronized to Azure AD, you can specify the -UserName and -Domain in the input parameters. 
6. CheckGetKerberosTicket: Attempt to get a Kerberos ticket to connect to the storage account. If there isn't a valid Kerberos token, run the klist get cifs/storage-account-name.file.core.windows.net cmdlet and examine the error code to root-cause the ticket retrieval failure.
7. CheckStorageAccountDomainJoined: Check if the AD authentication has been enabled and the account's AD properties are populated. If not, refer to the instruction [here](./storage-files-identity-ad-ds-enable.md) to enable AD DS authentication on Azure Files. 
8. CheckUserRbacAssignment: Check if the AD identity has the proper RBAC role assignment to provide share level permission to access Azure Files. If not, refer to the instruction [here](./storage-files-identity-ad-ds-assign-permissions.md) to configure the share level permission. (Supported on AzFilesHybrid v0.2.3+ version)
9. CheckUserFileAccess: Check if the AD identity has the proper directory/file permission (Windows ACLs) to access Azure Files. If not, refer to the instruction [here](./storage-files-identity-ad-ds-configure-permissions.md) to configure the directory/file level permission. (Supported on AzFilesHybrid v0.2.3+ version)

## Unable to configure directory/file level permissions (Windows ACLs) with Windows File Explorer

### Symptom

You may experience either symptoms described below when trying to configure Windows ACLs with File Explorer on a mounted file share:
- After you click on **Edit permission** under the Security tab, the Permission wizard doesn't load. 
- When you try to select a new user or group, the domain location doesn't display the right AD DS domain. 

### Solution

We recommend that you [configure directory/file level permissions using icacls](storage-files-identity-ad-ds-configure-permissions.md#configure-windows-acls-with-icacls) as a workaround.

## Errors when running Join-AzStorageAccountForAuth cmdlet

### Error: "The directory service was unable to allocate a relative identifier"

This error might occur if a domain controller that holds the RID Master FSMO role is unavailable or was removed from the domain and restored from backup.  Confirm that all Domain Controllers are running and available.

### Error: "Cannot bind positional parameters because no names were given"

This error is most likely triggered by a syntax error in the `Join-AzStorageAccountforAuth` command.  Check the command for misspellings or syntax errors and verify that the latest version of the **AzFilesHybrid** module (https://github.com/Azure-Samples/azure-files-samples/releases) is installed.  

## Azure Files on-premises AD DS Authentication support for AES-256 Kerberos encryption

Azure Files supports AES-256 Kerberos encryption for AD DS authentication beginning with the AzFilesHybrid module v0.2.2. AES-256 is the recommended authentication method. If you've enabled AD DS authentication with a module version lower than v0.2.2, you'll need to [download the latest AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases) and run the PowerShell below. If you haven't enabled AD DS authentication on your storage account yet, follow this [guidance](./storage-files-identity-ad-ds-enable.md#option-one-recommended-use-azfileshybrid-powershell-module) for enablement. 

```PowerShell
$ResourceGroupName = "<resource-group-name-here>"
$StorageAccountName = "<storage-account-name-here>"

Update-AzStorageAccountAuthForAES256 -ResourceGroupName $ResourceGroupName -StorageAccountName $StorageAccountName
```

## User identity formerly having the Owner or Contributor role assignment still has storage account key access
The storage account Owner and Contributor roles grant the ability to list the storage account keys. The storage account key enables full access to the storage account's data including file shares, blob containers, tables, and queues, and limited access to the Azure Files management operations via the legacy management APIs exposed through the FileREST API. If you're changing role assignments, you should consider that the users being removed from the Owner or Contributor roles may continue to maintain access to the storage account through saved storage account keys.

### Solution 1
You can remedy this issue easily by rotating the storage account keys. We recommend rotating the keys one at a time, switching access from one to the other as they are rotated. There are two types of shared keys the storage account provides: the storage account keys, which provide super-administrator access to the storage account's data, and the Kerberos keys, which function as a shared secret between the storage account and the Windows Server Active Directory domain controller for Windows Server Active Directory scenarios.

To rotate the Kerberos keys of a storage account, see [Update the password of your storage account identity in AD DS](./storage-files-identity-ad-ds-update-password.md).

# [Portal](#tab/azure-portal)
Navigate to the desired storage account in the Azure portal. In the table of contents for the desired storage account, select **Access keys** under the **Security + networking** heading. In the **Access key** pane, select **Rotate key** above the desired key. 

![A screenshot of the access key pane](./media/storage-troubleshoot-windows-file-connection-problems/access-keys-1.png)

# [PowerShell](#tab/azure-powershell)
The following script will rotate both keys for the storage account. If you desire to swap out keys during rotation, you'll need to provide additional logic in your script to handle this scenario. Remember to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment.

```PowerShell
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"

# Rotate primary key (key 1). You should switch to key 2 before rotating key 1.
New-AzStorageAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -KeyName "key1"

# Rotate secondary key (key 2). You should switch to the new key 1 before rotating key 2.
New-AzStorageAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -KeyName "key2"
```

# [Azure CLI](#tab/azure-cli)
The following script will rotate both keys for the storage account. If you desire to swap out keys during rotation, you'll need to provide additional logic in your script to handle this scenario. Remember to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment.

```bash
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"

# Rotate primary key (key 1). You should switch to key 2 before rotating key 1.
az storage account keys renew \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --key "primary"

# Rotate secondary key (key 2). You should switch to the new key 1 before rotating key 2.
az storage account keys renew \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --key "secondary"
```

---

## Set the API permissions on a newly created application

After enabling Azure AD Kerberos authentication, you'll need to explicitly grant admin consent to the new Azure AD application registered in your Azure AD tenant to complete your configuration. You can configure the API permissions from the [Azure portal](https://portal.azure.com) by following these steps.

1. Open **Azure Active Directory**.
2. Select **App registrations** in the left pane.
3. Select **All Applications** in the right pane.

   :::image type="content" source="media/storage-troubleshoot-windows-file-connection-problems/azure-portal-azuread-app-registrations.png" alt-text="Screenshot of the Azure portal. Azure Active Directory is open. App registrations is selected in the left pane. All applications is highlighted in the right pane." lightbox="media/storage-troubleshoot-windows-file-connection-problems/azure-portal-azuread-app-registrations.png":::

4. Select the application with the name matching **[Storage Account] $storageAccountName.file.core.windows.net**.
5. Select **API permissions** in the left pane.
6. Select **Add permissions** at the bottom of the page.
7. Select **Grant admin consent for "DirectoryName"**.

## Potential errors when enabling Azure AD Kerberos authentication for hybrid users

You might encounter the following errors when trying to enable Azure AD Kerberos authentication for hybrid user accounts.

### Error - Grant admin consent disabled

In some cases, Azure AD admin may disable the ability to grant admin consent to Azure AD applications. Below is the screenshot of what this may look like in the Azure portal.

   :::image type="content" source="media/storage-troubleshoot-windows-file-connection-problems/grant-admin-consent-disabled.png" alt-text="Screenshot of the Azure portal configured permissions blade displaying a warning that some actions may be disabled due to your permissions." lightbox="media/storage-troubleshoot-windows-file-connection-problems/grant-admin-consent-disabled.png":::

If this is the case, ask your Azure AD admin to grant admin consent to the new Azure AD application. To find and view your administrators, select **roles and administrators**, then select **Cloud application administrator**.

### Error - "The request to AAD Graph failed with code BadRequest"

####  Cause 1: an application management policy is preventing credentials from being created

When enabling Azure AD Kerberos authentication, you might encounter this error if the following conditions are met:

1. You're using the beta/preview feature of [application management policies](/graph/api/resources/applicationauthenticationmethodpolicy?view=graph-rest-beta).
2. You (or your administrator) have set a [tenant-wide policy](/graph/api/resources/tenantappmanagementpolicy?view=graph-rest-beta) that:
    - Has no start date, or has a start date before 2019-01-01
    - Sets a restriction on service principal passwords, which either disallows custom passwords or sets a maximum password lifetime of less than 365.5 days

There is currently no workaround for this error.

#### Cause 2: an application already exists for the storage account

You might also encounter this error if you previously enabled Azure AD Kerberos authentication through manual limited preview steps. To delete the existing application, the customer or their IT admin can run the following script. Running this script will remove the old manually created application and allow the new experience to auto-create and manage the newly created application.

> [!IMPORTANT]
> This script must be run in PowerShell 5 because the AzureAD module doesn't work in PowerShell 7. This PowerShell snippet uses Azure AD Graph.

```powershell
$storageAccount = "exampleStorageAccountName"
$tenantId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
Import-Module AzureAD
Connect-AzureAD -TenantId $tenantId

$application = Get-AzureADApplication -Filter "DisplayName eq '${storageAccount}'"
if ($null -ne $application) {
   Remove-AzureADApplication -ObjectId $application.ObjectId
}
```

### Error - Service principal password has expired in Azure AD

If you've previously enabled Azure AD Kerberos authentication through manual limited preview steps, the password for the storage account's service principal is set to expire every six months. Once the password expires, users won't be able to get Kerberos tickets to the file share.

To mitigate this, you have two options: either rotate the service principal password in Azure AD every six months, or disable Azure AD Kerberos, delete the existing application, and reconfigure Azure AD Kerberos.

#### Option 1: Update the service principal password using PowerShell

1. Install the latest Az.Storage and AzureAD modules. Use PowerShell 5.1, because currently the AzureAD module doesn't work in PowerShell 7. Azure Cloud Shell won't work in this scenario. For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/install-Az-ps).

To install the modules, open PowerShell with elevated privileges and run the following commands:

```azurepowershell
Install-Module -Name Az.Storage 
Install-Module -Name AzureAD
```

2. Set the required variables for your tenant, subscription, storage account name, and resource group name by running the following cmdlets, replacing the values with the ones relevant to your environment.

```azurepowershell
$tenantId = "<MyTenantId>" 
$subscriptionId = "<MySubscriptionId>" 
$resourceGroupName = "<MyResourceGroup>" 
$storageAccountName = "<MyStorageAccount>"
```

3. Generate a new kerb1 key and password for the service principal.

```azurepowershell
Connect-AzAccount -Tenant $tenantId -SubscriptionId $subscriptionId 
$kerbKeys = New-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName -KeyName "kerb1" -ErrorAction Stop | Select-Object -ExpandProperty Keys 
$kerbKey = $kerbKeys | Where-Object { $_.KeyName -eq "kerb1" } | Select-Object -ExpandProperty Value 
$azureAdPasswordBuffer = [System.Linq.Enumerable]::Take([System.Convert]::FromBase64String($kerbKey), 32); 
$password = "kk:" + [System.Convert]::ToBase64String($azureAdPasswordBuffer);
```

4. Connect to Azure AD and retrieve the tenant information, application, and service principal.

```azurepowershell
Connect-AzureAD 
$azureAdTenantDetail = Get-AzureADTenantDetail; 
$azureAdTenantId = $azureAdTenantDetail.ObjectId 
$azureAdPrimaryDomain = ($azureAdTenantDetail.VerifiedDomains | Where-Object {$_._Default -eq $true}).Name 
$application = Get-AzureADApplication -Filter "DisplayName eq '$($storageAccountName)'" -ErrorAction Stop; 
$servicePrincipal = Get-AzureADServicePrincipal -Filter "AppId eq '$($application.AppId)'" 
if ($servicePrincipal -eq $null) { 
  Write-Host "Could not find service principal corresponding to application with app id $($application.AppId)" 
  Write-Error -Message "Make sure that both service principal and application exist and are correctly configured" -ErrorAction Stop 
} 
```

5. Set the password for the storage account's service principal.

```azurepowershell
$Token = ([Microsoft.Open.Azure.AD.CommonLibrary.AzureSession]::AccessTokens['AccessToken']).AccessToken; 
$Uri = ('https://graph.windows.net/{0}/{1}/{2}?api-version=1.6' -f $azureAdPrimaryDomain, 'servicePrincipals', $servicePrincipal.ObjectId) 
$json = @' 
{ 
  "passwordCredentials": [ 
  { 
    "customKeyIdentifier": null, 
    "endDate": "<STORAGEACCOUNTENDDATE>", 
    "value": "<STORAGEACCOUNTPASSWORD>", 
    "startDate": "<STORAGEACCOUNTSTARTDATE>" 
  }] 
} 
'@ 
 
$now = [DateTime]::UtcNow 
$json = $json -replace "<STORAGEACCOUNTSTARTDATE>", $now.AddHours(-12).ToString("s") 
 $json = $json -replace "<STORAGEACCOUNTENDDATE>", $now.AddMonths(6).ToString("s") 
$json = $json -replace "<STORAGEACCOUNTPASSWORD>", $password 
 
$Headers = @{'authorization' = "Bearer $($Token)"} 
 
try { 
  Invoke-RestMethod -Uri $Uri -ContentType 'application/json' -Method Patch -Headers $Headers -Body $json  
  Write-Host "Success: Password is set for $storageAccountName" 
} catch { 
  Write-Host $_.Exception.ToString() 
  Write-Host "StatusCode: " $_.Exception.Response.StatusCode.value 
  Write-Host "StatusDescription: " $_.Exception.Response.StatusDescription 
}
```

#### Option 2: Disable Azure AD Kerberos, delete the existing application, and reconfigure

If you don't want to rotate the service principal password every six months, you can follow these steps. Be sure to save domain properties (domainName and domainGUID) before disabling Azure AD Kerberos, as you'll need them during reconfiguration if you want to configure directory and file-level permissions using Windows File Explorer. If you didn't save domain properties, you can still [configure directory/file-level permissions using icacls](storage-files-identity-ad-ds-configure-permissions.md#configure-windows-acls-with-icacls) as a workaround.

1. [Disable Azure AD Kerberos](storage-files-identity-auth-azure-active-directory-enable.md#disable-azure-ad-authentication-on-your-storage-account)
1. [Delete the existing application](#cause-2-an-application-already-exists-for-the-storage-account)
1. [Reconfigure Azure AD Kerberos via the Azure portal](storage-files-identity-auth-azure-active-directory-enable.md#enable-azure-ad-kerberos-authentication-for-hybrid-user-accounts)

Once you've reconfigured Azure AD Kerberos, the new experience will auto-create and manage the newly created application.

## Need help?
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
