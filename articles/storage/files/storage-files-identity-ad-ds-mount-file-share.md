---
title: Mount Azure file share to an AD DS-joined VM
description: Learn how to mount a file share to your on-premises Active Directory Domain Services-joined machines.
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: how-to
ms.date: 06/22/2020
ms.author: rogarana
---

# Part four: mount a file share from a domain-joined VM

Before you begin this article, make sure you complete the previous article, [configure directory and file level permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md).

The process described in this article verifies that your file share and access permissions are set up correctly and that you can access an Azure File share from a domain-joined VM. Share-level RBAC role assignment can take some time to take effect. 

Sign in to the client by using the credentials that you granted permissions to, as shown in the following image.

![Screenshot showing Azure AD sign-in screen for user authentication](media/storage-files-aad-permissions-and-mounting/azure-active-directory-authentication-dialog.png)

## Mounting prerequisites

Before you can mount the file share, make sure you've gone through the following pre-requisites:

- If you are mounting the file share from a client that has previously mounted the file share using your storage account key, make sure that you have disconnected the share, removed the persistent credentials of the storage account key, and are currently using AD DS credentials for authentication.
- Your client must have line of sight to your AD DS. If your machine or VM is out of the network managed by your AD DS, you will need to enable VPN to reach AD DS for authentication.

Replace the placeholder values with your own values, then use the following command to mount the Azure file share:

```cli
# Always mount your share using.file.core.windows.net, even if you setup a private endpoint for your share.
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>
```

If you run into issues mounting with AD DS credentials, refer to [Unable to mount Azure Files with AD credentials](storage-troubleshoot-windows-file-connection-problems.md#unable-to-mount-azure-files-with-ad-credentials) for guidance.

If mounting your file share succeeded, then you have successfully enabled and configured on-premises AD DS authentication for your Azure file shares.

## Next steps

If the identity you created in AD DS to represent the storage account is in a domain or OU that enforces password rotation, continue to the next article for instructions on updating your password:

[Update the password of your storage account identity in AD DS](storage-files-identity-ad-ds-update-password.md)