---
title: Enable Active Directory authentication over SMB for Azure Files
description: Learn how to enable identity-based authentication over SMB for Azure file shares through Active Directory. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using AD credentials. 
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 04/20/2020
ms.author: rogarana
---

# Mount a file share from a domain-joined VM

Before you begin this article, make sure you complete the previous article, [Configure NTFS permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md).

The process described in this article verifies that your file share and access permissions were set up correctly and that you can access an Azure File share from a domain-joined VM. Be aware that the share-level RBAC role assignment can take some time to take effect. 

Sign in to the VM by using the AD DS credentials to which you have granted permissions, as shown in the following image.

![Screenshot showing Azure AD sign-in screen for user authentication](media/storage-files-aad-permissions-and-mounting/azure-active-directory-authentication-dialog.png)

Use the following command to mount the Azure file share. Remember to replace the placeholder values with your own values. Because you've been authenticated, you don't need to provide a credential. Single sign-on experience is supported for authentication with AD DS.

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>
```

If you run into issues mounting with AD DS credentials, refer to [Troubleshoot Azure Files problems in Windows](https://docs.microsoft.com/azure/storage/files/storage-troubleshoot-windows-file-connection-problems) for guidance.

At this point, if your mount succeeded, then you have successfully enabled and configured on-premises AD DS authentication for your Azure file shares.

## Next steps

The upcoming article contains instructions for updating your password, if your AD DS requires that you rotate your password, continue to the next article.

[Update the password of your storage account identity in AD DS](storage-files-identity-ad-ds-update-password.md)