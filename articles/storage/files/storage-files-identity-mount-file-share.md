---
title: Mount SMB Azure file share with identity-based access
description: Learn how to mount an SMB Azure file share on Windows using Active Directory (AD) or Microsoft Entra credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 10/18/2024
ms.author: kendownie
ms.custom: engagement-fy23
recommendations: false
---

# Mount an SMB Azure file share

The process described in this article verifies that your SMB file share and access permissions are set up correctly and that you can mount your SMB Azure file share.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Mounting prerequisites

Before you can mount the Azure file share, make sure you've gone through the following prerequisites:

- Make sure you've [assigned share-level permissions](storage-files-identity-assign-share-level-permissions.md) and [configured directory and file-level permissions](storage-files-identity-configure-file-level-permissions.md). Remember that share-level role assignment can take some time to take effect.
- If you're mounting the file share from a client that has previously connected to the file share using your storage account key, make sure that you've disconnected the share and removed the persistent credentials of the storage account key. For instructions on how to remove cached credentials and delete existing SMB connections before initializing a new connection with Active Directory Domain Services (AD DS) or Microsoft Entra credentials, follow the two-step process on the [FAQ page](./storage-files-faq.md#identity-based-authentication).
- If your AD source is AD DS or Microsoft Entra Kerberos, your client must have unimpeded network connectivity to your AD DS. If your machine or VM is outside of the network managed by your AD DS, you'll need to enable VPN to reach AD DS for authentication.
- Sign in to the client using the credentials of the AD DS or Microsoft Entra identity that you granted permissions to.

## Mount the file share from a domain-joined VM

Run the following PowerShell script or [use the Azure portal](storage-files-quick-create-use-windows.md#map-the-azure-file-share-to-a-windows-drive) to persistently mount the Azure file share and map it to drive Z: on Windows. If Z: is already in use, replace it with an available drive letter. Because you've been authenticated, you won't need to provide the storage account key. The script will check to see if this storage account is accessible via TCP port 445, which is the port SMB uses. Remember to replace the placeholder values with your own values. For more information, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md).

Unless you're using [custom domain names](#mount-file-shares-using-custom-domain-names), you should mount Azure file shares using the suffix `file.core.windows.net`, even if you set up a private endpoint for your share.

```powershell
$connectTestResult = Test-NetConnection -ComputerName <storage-account-name>.file.core.windows.net -Port 445
if ($connectTestResult.TcpTestSucceeded) {
    cmd.exe /C "cmdkey /add:`"<storage-account-name>.file.core.windows.net`" /user:`"localhost\<storage-account-name>`""
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\<file-share-name>" -Persist -Scope global
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

If your AD source is on-premises AD DS, then non-domain-joined VMs or VMs that are joined to a different AD domain than the storage account can access Azure file shares if they have unimpeded network connectivity to the AD domain controllers and provide explicit credentials (username and password). The user accessing the file share must have an identity and credentials in the AD domain that the storage account is joined to.

If your AD source is Microsoft Entra Domain Services, the VM must have unimpeded network connectivity to the domain controllers for Microsoft Entra Domain Services, which are located in Azure. This usually requires setting up a site-to-site or point-to-site VPN. The user accessing the file share must have an identity (a Microsoft Entra identity synced from Microsoft Entra ID to Microsoft Entra Domain Services) in the Microsoft Entra Domain Services managed domain.

To mount a file share from a non-domain-joined VM, use the notation **username@domainFQDN**, where **domainFQDN** is the fully qualified domain name. This will allow the client to contact the domain controller to request and receive Kerberos tickets. You can get the value of **domainFQDN** by running `(Get-ADDomain).Dnsroot` in Active Directory PowerShell.

For example:

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:<username@domainFQDN>
```

If your AD source is Microsoft Entra Domain services, you can also provide credentials such as **DOMAINNAME\username** where **DOMAINNAME** is the Microsoft Entra Domain Services domain and **username** is the identity's user name in Microsoft Entra Domain Services:

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:<DOMAINNAME\username>
```


> [!NOTE]
> Azure Files doesn't support SID to UPN translation for users and groups from a non-domain joined VM or a VM joined to a different domain via Windows File Explorer. If you want to view file/directory owners or view/modify NTFS permissions via Windows File Explorer, you can do so only from domain-joined VMs.

## Mount file shares using custom domain names

If you don't want to mount Azure file shares using the suffix `file.core.windows.net`, you can modify the suffix of the storage account name associated with the Azure file share, and then add a canonical name (CNAME) record to route the new suffix to the endpoint of the storage account. The following instructions are for single-forest environments only. To learn how to configure environments that have two or more forests, see [Use Azure Files with multiple Active Directory forests](storage-files-identity-multiple-forests.md).

> [!NOTE]
> Azure Files only supports configuring CNAMES using the storage account name as a domain prefix. If you don't want to use the storage account name as a prefix, consider using [DFS namespaces](files-manage-namespaces.md).

In this example, we have the Active Directory domain *onpremad1.com*, and we have a storage account called *mystorageaccount* which contains SMB Azure file shares. First, we need to modify the SPN suffix of the storage account to map *mystorageaccount.onpremad1.com* to *mystorageaccount.file.core.windows.net*.

This will allow clients to mount the share with `net use \\mystorageaccount.onpremad1.com` because clients in *onpremad1* will know to search *onpremad1.com* to find the proper resource for that storage account.

To use this method, complete the following steps:

1. Make sure you've set up identity-based authentication. If your AD source is AD DS or Microsoft Entra Kerberos, make sure you've synced your AD user account(s) to Microsoft Entra ID.

2. Modify the SPN of the storage account using the `setspn` tool. You can find `<DomainDnsRoot>` by running the following Active Directory PowerShell command: `(Get-AdDomain).DnsRoot`

   ```
   setspn -s cifs/<storage-account-name>.<DomainDnsRoot> <storage-account-name>
   ```

3. Add a CNAME entry using Active Directory DNS Manager and follow the steps below for each storage account in the domain that the storage account is joined to. If you're using a private endpoint, add the CNAME entry to map to the private endpoint name.

   1. Open Active Directory DNS Manager.
   1. Go to your domain (for example, **onpremad1.com**).
   1. Go to "Forward Lookup Zones".
   1. Select the node named after your domain (for example, **onpremad1.com**) and right-click **New Alias (CNAME)**.
   1. For the alias name, enter your storage account name.
   1. For the fully qualified domain name (FQDN), enter **`<storage-account-name>`.`<domain-name>`**, such as **mystorageaccount.onpremad1.com**. The hostname part of the FQDN must match the storage account name. Otherwise you'll get an access denied error during the SMB session setup.  
   1. For the target host FQDN, enter **`<storage-account-name>`.file.core.windows.net**
   1. Select **OK**.

You should now be able to mount the file share using *storageaccount.domainname.com*. You can also mount the file share using the storage account key.

## Next step

If the identity you created in AD DS to represent the storage account is in a domain or OU that enforces password rotation, you might need to [update the password of your storage account identity in AD DS](storage-files-identity-ad-ds-update-password.md).
