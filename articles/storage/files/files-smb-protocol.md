---
title: SMB file shares in Azure Files
description: Learn about file shares hosted in Azure Files using the Server Message Block (SMB) protocol.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 06/25/2021
ms.author: rogarana
ms.subservice: files

---

# SMB file shares in Azure Files
Azure Files offers two industry-standard protocols for mounting Azure file share: the [Server Message Block (SMB)](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) protocol and the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol (preview). Azure Files enables you to pick the file system protocol that is the best fit for your workload. Azure file shares don't support accessing an individual Azure file share with both the SMB and NFS protocols, although you can create SMB and NFS file shares within the same storage account. For all file shares, Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

This article covers SMB Azure file shares. For information about NFS Azure file shares, see [NFS file shares in Azure Files](files-nfs-protocol.md).

## Common scenarios
SMB file shares are used for a variety of applications including end-user file shares and file shares that back databases and applications. SMB file shares are often used in the following scenarios:

- End-user file shares such as team shares, home directories, etc.
- Backing storage for Windows-based applications, such as SQL Server databases or line-of-business applications written for Win32 or .NET local file system APIs. 
- New application and service development, particularly if that application or service has a requirement for random IO and hierarchical storage.

## Features
Azure Files supports the major features of SMB and Azure needed for production deployments of SMB file shares:

- AD domain join and discretionary access control lists (DACLs).
- Integrated serverless backup with Azure Backup.
- Network isolation with Azure private endpoints.
- High network throughput using SMB Multichannel (premium file shares only).
- SMB channel encryption including AES-256-GCM, AES-128-GCM, and AES-128-CCM.
- Previous version support through VSS integrated share snapshots.
- Automatic soft delete on Azure file shares to prevent accidental deletes.
- Optionally internet-accessible file shares with internet-safe SMB 3.0+.

SMB file shares can be mounted directly on-premises or can also be [cached on-premises with Azure File Sync](../file-sync/file-sync-introduction.md).  

## Security
All data stored in Azure Files is encrypted at rest using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: data is encrypted beneath the file system level. Because data is encrypted beneath the Azure file share's file system, as it's encoded to disk, you don't have to have access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

By default, all Azure storage accounts have encryption in transit enabled. This means that when you mount a file share over SMB (or access it via the FileREST protocol), Azure Files will only allow the connection if it is made with SMB 3.x with encryption or HTTPS. Clients that do not support SMB 3.x with SMB channel encryption will not be able to mount the Azure file share if encryption in transit is enabled. 

Azure Files supports industry leading AES-256-GCM with SMB 3.1.1 when used with Windows 10, version 21H1. SMB 3.1.1 also supports AES-128-GCM and SMB 3.0 supports AES-128-CCM. AES-128-GCM is negotiated by default on Windows 10, version 21H1 for performance reasons.

You can disable encryption in transit for an Azure storage account. When encryption is disabled, Azure Files will also allow SMB 2.1 and SMB 3.x without encryption. The primary reason to disable encryption in transit is to support a legacy application that must be run on an older operating system, such as Windows Server 2008 R2 or older Linux distribution. Azure Files only allows SMB 2.1 connections within the same Azure region as the Azure file share; an SMB 2.1 client outside of the Azure region of the Azure file share, such as on-premises or in a different Azure region, will not be able to access the file share.

## SMB protocol settings
Azure Files offers multiple settings for the SMB protocol.

- **SMB Multichannel**: Enable/disable SMB Multichannel (premium file shares only). To learn how to enable SMB Multichannel, see [Enable SMB Multichannel on a FileStorage storage account](storage-files-enable-smb-multichannel.md). The default value for SMB Multichannel is disabled.
- **SMB versions**: Which versions of SMB are allowed. Supported protocol versions are SMB 3.1.1, SMB 3.0, and SMB 2.1. By default, all SMB versions are allowed, although SMB 2.1 is disallowed if "require secure transit" is enabled, since SMB 2.1 does not support encryption in transit.
- **Authentication methods**: Which SMB authentication methods are allowed. Supported authentication methods are NTLMv2 and Kerberos. By default, all authentication methods are allowed. Removing NTLMv2 disallows using the storage account key to mount the Azure file share.
- **Kerberos ticket encryption**: Which encryption algorithms are allowed. Supported encryption algorithms are RC4-HMAC and AES-256.
- **SMB channel encryption**: Which SMB channel encryption algorithms are allowed. Supported encryption algorithms are AES-256-GCM, AES-128-GCM, and AES-128-CCM.

SMB protocol settings can be toggled via the Azure PowerShell module.

# [Portal](#tab/azure-portal)
The SMB protocol settings can be viewed and changed using PowerShell or CLI. Please select the desired tab to see the steps on how to get and set the SMB protocol settings.

# [PowerShell](#tab/azure-powershell)
To get or set the SMB protocol settings, you must provide a reference to a storage account, either directly by providing the resource group and storage account names, or by providing a storage account object you've acquired from the `Get-AzStorageAccount` cmdlet. The following examples use the latter method to get and set the SMB protocol settings.

Remember to replace `<resource-group>` and `<storage-account>` with the appropriate values for your environment before running these PowerShell commands.

```PowerShell
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"

$storageAccount = Get-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName
```

To get the SMB protocol settings, use the `Get-AzStorageFileServiceProperty` cmdlet. If you've never modified the SMB protocol settings, the values returned by the cmdlet will be null. Null returned values should be interpreted as "default settings are in effect". To make this more user-friendly, the following PowerShell commands replace null values with the human-readable default values. 

```PowerShell
# Replacement values for null parameters. If you copy this into your own 
# scripts, you will need to ensure that you keep these variables up-to-date with any new 
# options we may add to these parameters in the future.
$smbMultichannelEnabled = $false
$smbProtocolVersions = "SMB2.1", "SMB3.0", "SMB3.1.1"
$smbAuthenticationMethods = "NTLMv2", "Kerberos"
$smbKerberosTicketEncryption = "RC4-HMAC", "AES-256"
$smbChannelEncryption = "AES-128-CCM", "AES-128-GCM", "AES-256-GCM"

Get-AzStorageFileServiceProperty -StorageAccount $storageAccount | `
    Select-Object -Property `
        ResourceGroupName, `
        StorageAccountName, `
        @{ 
            Name = "SmbMultichannelEnabled"; 
            Expression = { 
                if ($null -eq $_.ProtocolSettings.Smb.Multichannel.Enabled) { 
                    $smbMultichannelEnabled 
                } else { 
                    $_.ProtocolSettings.Smb.Multichannel.Enabled 
                } 
            } 
        }, 
        @{ 
            Name = "SmbProtocolVersions";
            Expression = {
                if ($null -eq $_.ProtocolSettings.Smb.Versions) {
                    [String]::Join(", ", $smbProtocolVersions)
                } else {
                    [String]::Join(", ", $_.ProtocolSettings.Smb.Versions)
                }
            }
        },
        @{
            Name = "SmbChannelEncryption";
            Expression = {
                if ($null -eq $_.ProtocolSettings.Smb.ChannelEncryption) {
                    [String]::Join(", ", $smbChannelEncryption)
                } else {
                    [String]::Join(", ", $_.ProtocolSettings.Smb.ChannelEncryption)
                }
            }
        },
        @{
            Name = "SmbAuthenticationMethods";
            Expression = {
                if ($null -eq $_.ProtocolSettings.Smb.AuthenticationMethods) {
                    [String]::Join(", ", $smbAuthenticationMethods)
                } else {
                    [String]::Join(", ", $_.ProtocolSettings.Smb.AuthenticationMethods)
                }
            }
        },
        @{
            Name = "SmbKerberosTicketEncryption";
            Expression = {
                if ($null -eq $_.ProtocolSettings.Smb.KerberosTicketEncryption) {
                    [String]::Join(", ", $smbKerberosTicketEncryption)
                } else {
                    [String]::Join(", ", $_.ProtocolSettings.Smb.KerberosTicketEncryption)
                }
            }
        }
```

Depending on your organization's security, performance, and compatibility requirements, you may wish to modify the SMB protocol settings. The following PowerShell command restricts your SMB file shares to only the most secure options.

> [!Important]  
> Restricting SMB Azure file shares to only the most secure options may result in some clients not being able to connect if they do not meet the requirements. For example, AES-256-GCM was introduced as an option for SMB channel encryption starting in Windows 10, version 21H1. This means that older clients that do not support AES-256-GCM will not be able to connect.

```PowerShell
Update-AzStorageFileServiceProperty `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -SmbAuthenticationMethod "Kerberos" `
    -SmbChannelEncryption "AES-256-GCM" `
    -SmbKerberosTicketEncryption "AES-256" `
    -SmbProtocolVersion "SMB3.1.1"
```

# [Azure CLI](#tab/azure-cli)
To get the SMB protocol settings, use the `az storage account file-service-properties show` command. If you've never modified the SMB protocol settings, the values returned by the command will be null. Null returned values should be interpreted as "default settings are in effect". To make this more user-friendly, the following Bash commands replace null values with the human-readable default values. 

```bash
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"

# Values to be replaced
replaceSmbMultichannel="\"smbMultichannelEnabled\": null"
replaceSmbProtocolVersion="\"smbProtocolVersions\": null"
replaceSmbChannelEncryption="\"smbChannelEncryption\": null"
replaceSmbAuthenticationMethods="\"smbAuthenticationMethods\": null"
replaceSmbKerberosTicketEncryption="\"smbKerberosTicketEncryption\": null"

# Replacement values for null parameters. If you copy this into your own 
# scripts, you will need to ensure that you keep these variables up-to-date with any new 
# options we may add to these parameters in the future.
defaultSmbMultichannelEnabled="\"smbMultichannelEnabled\": false"
defaultSmbProtocolVersions="\"smbProtocolVersions\": \"SMB2.1;SMB3.0;SMB3.1.1\""
defaultSmbChannelEncryption="\"smbChannelEncryption\": \"AES-128-CCM;AES-128-GCM;AES-256-GCM\""
defaultSmbAuthenticationMethods="\"smbAuthenticationMethods\": \"NTLMv2;Kerberos\""
defaultSmbKerberosTicketEncryption="\"smbKerberosTicketEncryption\": \"RC4-HMAC;AES-256\""

# Build JMESPath query string
query="{" 
query="${query}smbMultichannelEnabled: protocolSettings.smb.multichannel.enabled,"
query="${query}smbProtocolVersions: protocolSettings.smb.versions,"
query="${query}smbChannelEncryption: protocolSettings.smb.channelEncryption,"
query="${query}smbAuthenticationMethods: protocolSettings.smb.authenticationMethods,"
query="${query}smbKerberosTicketEncryption: protocolSettings.smb.kerberosTicketEncryption"
query="${query}}"

# Get protocol settings from the Azure Files FileService object
protocolSettings=$(az storage account file-service-properties show \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --query "${query}")

# Replace returned values if null with default values 
protocolSettings="${protocolSettings/$replaceSmbMultichannel/$defaultSmbMultichannelEnabled}"
protocolSettings="${protocolSettings/$replaceSmbProtocolVersion/$defaultSmbProtocolVersion}"
protocolSettings="${protocolSettings/$replaceSmbChannelEncryption/$defaultSmbChannelEncryption}"
protocolSettings="${protocolSettings/$replaceSmbAuthenticationMethods/$defaultSmbAuthenticationMethods}"
protocolSettings="${protocolSettings/$replaceSmbKerberosTicketEncryption/$defaultSmbKerberosTicketEncryption}"

# Print returned settings
echo $protocolSettings
```

Depending on your organizations security, performance, and compatibility requirements, you may wish to modify the SMB protocol settings. The following Azure CLI command restricts your SMB file shares to only the most secure options.

> [!Important]  
> Restricting SMB Azure file shares to only the most secure options may result in some clients not being able to connect if they do not meet the requirements. For example, AES-256-GCM was introduced as an option for SMB channel encryption starting in Windows 10, version 21H1. This means that older clients that do not support AES-256-GCM will not be able to connect.

```bash
az storage account file-service-properties update \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --versions "SMB3.1.1" \
    --channel-encryption "AES-256-GCM" \
    --auth-methods "Kerberos" \
    --kerb-ticket-encryption "AES-256"
```
---

## Limitations
SMB file shares in Azure Files support a subset of features supported by SMB protocol and the NTFS file system. Although most use cases and applications do not require these features, some applications may not work properly with Azure Files if they rely on unsupported features. The following features are not supported:

- [SMB Direct](/windows-server/storage/file-server/smb-direct)  
- SMB directory leasing
- [VSS for SMB file shares](/archive/blogs/clausjor/vss-for-smb-file-shares) (this enables VSS providers to flush their data to the SMB file share before a snapshot is taken)
- Alternate data streams
- Extended attributes
- Object identifiers
- [Hard links](/windows/win32/fileio/hard-links-and-junctions)
- [Soft links](/windows/win32/fileio/creating-symbolic-links)  
- [Reparse points](/windows/win32/fileio/reparse-points)  
- [Sparse files](/windows/win32/fileio/sparse-files)
- [Short file names (8.3 alias)](/windows/win32/fileio/naming-a-file#short-vs-long-names)  
- [Compression](https://techcommunity.microsoft.com/t5/itops-talk-blog/smb-compression-deflate-your-io/ba-p/1183552)

## Regional availability
SMB Azure file shares are available in every Azure region, including all public and sovereign regions. Premium SMB file shares are available in [a subset of regions](https://azure.microsoft.com/global-infrastructure/services/?products=storage).

## Next steps
- [Plan for an Azure Files deployment](storage-files-planning.md)
- [Create an Azure file share](storage-how-to-create-file-share.md)
- Mount SMB file shares on your preferred operating system:
    - [Mounting SMB file shares on Windows](storage-how-to-use-files-windows.md)
    - [Mounting SMB file shares on Linux](storage-how-to-use-files-linux.md)
    - [Mounting SMB file shares on macOS](storage-how-to-use-files-mac.md)