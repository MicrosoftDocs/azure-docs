---
title: Mount Azure file share to an AD DS-joined VM
description: Learn how to mount an Azure file share to your on-premises Active Directory Domain Services domain-joined machines.
author: khdownie
ms.service: storage
ms.subservice: files
ms.topic: how-to
ms.date: 09/27/2022
ms.author: kendownie
---

# Part four: mount a file share from a domain-joined VM

Before you begin this article, make sure you complete the previous article, [configure directory and file level permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md).

The process described in this article verifies that your SMB file share and access permissions are set up correctly and that you can access an Azure file share from a domain-joined VM. Share-level role assignment can take some time to take effect.

Sign in to the client by using the credentials that you granted permissions to, as shown in the following image.

![Screenshot showing Azure AD sign-in screen for user authentication](media/storage-files-aad-permissions-and-mounting/azure-active-directory-authentication-dialog.png)

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Mounting prerequisites

Before you can mount the Azure file share, make sure you've gone through the following prerequisites:

- If you're mounting the file share from a client that has previously connected to the file share using your storage account key, make sure that you've disconnected the share, removed the persistent credentials of the storage account key, and are currently using AD DS credentials for authentication. For instructions on how to remove cached credentials with storage account key and delete existing SMB connections before initializing new connection with Azure AD or AD credentials, follow the two-step process on the [FAQ page](./storage-files-faq.md#ad-ds--azure-ad-ds-authentication).
- Your client must have line of sight to your AD DS. If your machine or VM is outside of the network managed by your AD DS, you'll need to enable VPN to reach AD DS for authentication.

## Mount the file share

Run the PowerShell script below or [use the Azure portal](storage-files-quick-create-use-windows.md#map-the-azure-file-share-to-a-windows-drive) to persistently mount the Azure file share and map it to drive Z: on Windows. If Z: is already in use, replace it with an available drive letter. The script will check to see if this storage account is accessible via TCP port 445, which is the port SMB uses. Remember to replace the placeholder values with your own values. For more information, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md).

Always mount Azure file shares using file.core.windows.net, even if you set up a private endpoint for your share. Using CNAME for file share mount isn't supported for identity-based authentication.

```powershell
$connectTestResult = Test-NetConnection -ComputerName <storage-account-name>.file.core.windows.net -Port 445
if ($connectTestResult.TcpTestSucceeded) {
    cmd.exe /C "cmdkey /add:`"<storage-account-name>.file.core.windows.net`" /user:`"localhost\<storage-account-name>`""
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\<file-share-name>" -Persist
} else {
    Write-Error -Message "Unable to reach the Azure storage account via port 445. Check to make sure your organization or ISP is not blocking port 445, or use Azure P2S VPN, Azure S2S VPN, or Express Route to tunnel SMB traffic over a different port."
}
```

If you run into issues mounting with AD DS credentials, refer to [Unable to mount Azure Files with AD credentials](storage-troubleshoot-windows-file-connection-problems.md#unable-to-mount-azure-files-with-ad-credentials) for guidance.

If mounting your file share succeeded, then you've successfully enabled and configured on-premises AD DS authentication for your Azure file share.

## Next steps

If the identity you created in AD DS to represent the storage account is in a domain or OU that enforces password rotation, continue to the next article for instructions on updating your password:

[Update the password of your storage account identity in AD DS](storage-files-identity-ad-ds-update-password.md)