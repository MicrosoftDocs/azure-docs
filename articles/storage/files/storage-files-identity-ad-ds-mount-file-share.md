---
title: Mount Azure file share to an AD DS-joined VM
description: Learn how to mount an Azure file share to your on-premises Active Directory Domain Services domain-joined machines.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 07/12/2023
ms.author: kendownie
ms.custom: engagement-fy23
recommendations: false
---

# Mount an Azure file share

Before you begin this article, make sure you've read [configure directory and file-level permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md).

The process described in this article verifies that your SMB file share and access permissions are set up correctly and that you can access an Azure file share from a domain-joined VM. Remember that share-level role assignment can take some time to take effect.

Sign in to the client using the credentials of the identity that you granted permissions to.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Mounting prerequisites

Before you can mount the Azure file share, make sure you've gone through the following prerequisites:

- If you're mounting the file share from a client that has previously connected to the file share using your storage account key, make sure that you've disconnected the share, removed the persistent credentials of the storage account key, and are currently using AD DS credentials for authentication. For instructions on how to remove cached credentials with storage account key and delete existing SMB connections before initializing a new connection with AD DS or Azure AD credentials, follow the two-step process on the [FAQ page](./storage-files-faq.md#identity-based-authentication).
- Your client must have line of sight to your AD DS. If your machine or VM is outside of the network managed by your AD DS, you'll need to enable VPN to reach AD DS for authentication.

> [!NOTE]
> Using the canonical name (CNAME) to mount an Azure file share isn't currently supported while using identity-based authentication in single-forest AD environments.

## Mount the file share from a domain-joined VM

Run the PowerShell script below or [use the Azure portal](storage-files-quick-create-use-windows.md#map-the-azure-file-share-to-a-windows-drive) to persistently mount the Azure file share and map it to drive Z: on Windows. If Z: is already in use, replace it with an available drive letter. The script will check to see if this storage account is accessible via TCP port 445, which is the port SMB uses. Remember to replace the placeholder values with your own values. For more information, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md).

Mount Azure file shares using `file.core.windows.net`, even if you set up a private endpoint for your share.

```powershell
$connectTestResult = Test-NetConnection -ComputerName <storage-account-name>.file.core.windows.net -Port 445
if ($connectTestResult.TcpTestSucceeded) {
    cmd.exe /C "cmdkey /add:`"<storage-account-name>.file.core.windows.net`" /user:`"localhost\<storage-account-name>`""
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\<file-share-name>" -Persist
} else {
    Write-Error -Message "Unable to reach the Azure storage account via port 445. Check to make sure your organization or ISP is not blocking port 445, or use Azure P2S VPN, Azure S2S VPN, or Express Route to tunnel SMB traffic over a different port."
}
```

You can also use the `net-use` command from a Windows prompt to mount the file share. Remember to replace `<YourStorageAccountName>` and `<FileShareName>` with your own values.

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName>
```

If you run into issues, see [Unable to mount Azure file shares with AD credentials](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#unable-to-mount-azure-file-shares-with-ad-credentials).

## Mount the file share from a non-domain-joined VM or a VM joined to a different AD domain

Non-domain-joined VMs or VMs that are joined to a different AD domain than the storage account can access Azure file shares if they have line-of-sight to the domain controllers and provide explicit credentials. The user accessing the file share must have an identity and credentials in the AD domain that the storage account is joined to.

To mount a file share from a non-domain-joined VM, use the notation **username@domainFQDN**, where **domainFQDN** is the fully qualified domain name. This will allow the client to contact the domain controller to request and receive Kerberos tickets. You can get the value of **domainFQDN** by running `(Get-ADDomain).Dnsroot` in Active Directory PowerShell.

For example:

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:<username@domainFQDN>
```

## Next steps

If the identity you created in AD DS to represent the storage account is in a domain or OU that enforces password rotation, you might need to [update the password of your storage account identity in AD DS](storage-files-identity-ad-ds-update-password.md).
