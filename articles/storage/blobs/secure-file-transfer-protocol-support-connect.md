---
title: Connect to Azure Blob Storage from an SFTP client
titleSuffix: Azure Storage
description: Learn how to connect to Azure Blob Storage by using an SSH File Transfer Protocol (SFTP) client.
author: normesta
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 05/18/2024
ms.author: normesta
---

# Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)

This article shows you how to securely connect to the Blob Storage endpoint of an Azure Storage account by using an SFTP client. After you connect, you can then upload and download files as well as modify access control lists (ACLs) on files and folders.

To learn more about SFTP support for Azure Blob Storage, see [SSH File Transfer Protocol (SFTP) in Azure Blob Storage](secure-file-transfer-protocol-support.md).

## Prerequisites

- Enable SFTP support for Azure Blob Storage. See [Enable or disable SFTP support](secure-file-transfer-protocol-support-how-to.md).

- Authorize access to SFTP clients. See [Authorize access to clients](secure-file-transfer-protocol-support-authorize-access.md).

- If you're connecting from an on-premises network, make sure that your client allows outgoing communication through port 22 used by SFTP.

## Connect an SFTP client

You can use any SFTP client to securely connect and then transfer files. The following example shows a Windows PowerShell session that uses [Open SSH](/windows-server/administration/openssh/openssh_overview).

```console
PS C:\Users\temp> sftp contoso4.contosouser@contoso4.blob.core.windows.net
```

The SFTP username is `storage_account_name`.`username`.  In the example above the `storage_account_name` is "contoso4" and the `username` is "contosouser."  The combined username becomes "contoso4.contosouser". The blob service endpoint is "contoso4.blob.core.windows.net".

To complete the connection, you might have to respond to one or more prompts. For example, if you configured the local user with password authentication, then you are prompted to enter that password. You might also be prompted to trust a host key. Valid host keys are published [here](secure-file-transfer-protocol-host-keys.md).  

### Connect using a custom domain

If you want to connect to the blob service endpoint by using a custom domain, then the connection string is `myaccount.myuser@customdomain.com`. If the home directory isn't specified for the user, then the connection string is `myaccount.mycontainer.myuser@customdomain.com`.

> [!IMPORTANT]
> Ensure your DNS provider does not proxy requests as this might cause the connection attempt to time out.

To learn how to map a custom domain to a blob service endpoint, see [Map a custom domain to an Azure Blob Storage endpoint](storage-custom-domain-name.md).

### Connect using a private endpoint

If you want to connect to the blob service endpoint by using a private endpoint, then the connection string is `myaccount.myuser@myaccount.privatelink.blob.core.windows.net`. If the home directory isn't specified for the user, then it's `myaccount.mycontainer.myuser@myaccount.privatelink.blob.core.windows.net`.

> [!NOTE]
> Ensure that you change the networking configuration to "Enabled from selected virtual networks and IP addresses", and then select your private endpoint. Otherwise, the blob service endpoint will still be publicly accessible.

### Connect using internet routing

If you want to connect to the blob service endpoint using internet routing, then the connection string is `myaccount.myuser@myaccount-internetrouting.blob.core.windows.net`. If the home directory isn't specified for the user, then it's `myaccount.mycontainer.myuser@myaccount-internetrouting.blob.core.windows.net`.

### Transfer data

After you connect, you can upload and download files. The following example uploads a file named `logfile.txt` by using an active Open SSH session.

```console
sftp> put logfile.txt
Uploading logfile.txt to /mydirectory/logfile.txt
logfile.txt
        100%    19    0.2kb/S    00.00
```

After the transfer is complete, you can view and manage the file in the Azure portal.

> [!div class="mx-imgBorder"]
> ![Screenshot of the uploaded file appearing in storage account.](./media/secure-file-transfer-protocol-support-connect/uploaded-file-in-storage-account.png)

> [!NOTE]
> The Azure portal uses the Blob REST API and Data Lake Storage Gen2 REST API. Being able to interact with an uploaded file in the Azure portal demonstrates the interoperability between SFTP and REST.

See the documentation of your SFTP client for guidance about how to connect and transfer files.

### Modify the ACL of a file or directory

You can modify the permission level of the owning user, owning group, and all other users of an ACL by using an SFTP client. You can also change the ID of the owning user and the owning group. To learn more about ACL support for SFTP clients, see [ACLs](secure-file-transfer-protocol-support.md#access-control-lists-acls).

#### Modify permissions

To change the permission level of the owning user, owning group, or all other users of an ACL, the local user must have `Modify Permission` permission. See [Give permission to containers](secure-file-transfer-protocol-support-authorize-access.md#give-permission-to-containers).

The following example prints the ACL of a directory to the console. It then, uses the `chmod` command to set the ACL to `777`. Each `7` is the numeric form of `rwx` (read, write, and execute). So `777` gives read, write, and execute permission to the owning user, owning group, and all other users. This example then prints the updated ACL to the console. To learn more about numeric and short forms of an ACL, see [Short forms for permissions](data-lake-storage-access-control.md#short-forms-for-permissions).

```console
sftp> ls -l
drwxr-x---     1234     5678                0 Mon, 08 Jan 2024 16:53:25 GMT dir1
drwxr-x---        0        0                0 Mon, 16 Oct 2023 12:18:08 GMT dir2
sftp> chmod 777 dir1
Changing mode on /dir1
sftp> ls -l
drwxrwxrwx     1234     5678                0 Mon, 08 Jan 2024 16:54:06 GMT dir1
drwxr-x---        0        0                0 Mon, 16 Oct 2023 12:18:08 GMT dir2
```

> [!NOTE]
> Adding or modifying ACL entries for named users, named groups, and named security principals is not yet supported.

#### Change the owning user

To change the owning user of a directory or blob, the local user must have `Modify Ownership` permission. See [Give permission to containers](secure-file-transfer-protocol-support-authorize-access.md#give-permission-to-containers).

The following example prints the ACL of a directory to the console. The ID of the owning user is `0`. This example uses the `chown` command to set the ID of the owning user to `1234` and prints the change to the console.

```console
sftp> ls -l
drwxr-x---        0        0                0 Mon, 08 Jan 2024 16:00:12 GMT dir1
drwxr-x---        0        0                0 Mon, 16 Oct 2023 12:18:08 GMT dir2
sftp> chown 1234 dir1
Changing owner on /dir1
sftp> ls -l
drwxr-x---     1234        0                0 Mon, 08 Jan 2024 16:52:52 GMT dir1
drwxr-x---        0        0                0 Mon, 16 Oct 2023 12:18:08 GMT dir2
sftp>
```

#### Change the owning group

To change the owning group of a directory or blob, the local user must have `Modify Ownership` permission. See [Give permission to containers](secure-file-transfer-protocol-support-authorize-access.md#give-permission-to-containers).

The following example prints the ACL of a directory to the console. The ID of the owning group is `0`. This example uses the `chgrp` command to set the ID of the owning group to `5678` and prints the change to the console.

```console
sftp> ls -l
drwxr-x---     1234        0                0 Mon, 08 Jan 2024 16:52:52 GMT dir1
drwxr-x---        0        0                0 Mon, 16 Oct 2023 12:18:08 GMT dir2
sftp> chgrp 5678 dir1
Changing group on /dir1
sftp> ls -l
drwxr-x---     1234     5678                0 Mon, 08 Jan 2024 16:53:25 GMT dir1
drwxr-x---        0        0                0 Mon, 16 Oct 2023 12:18:08 GMT dir2
```

## Related content

- [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Enable or disable SSH File Transfer Protocol (SFTP) support in Azure Blob Storage](secure-file-transfer-protocol-support-how-to.md)
- [Authorize access to Azure Blob Storage from an SSH File Transfer Protocol (SFTP) client](secure-file-transfer-protocol-support-authorize-access.md)
- [Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-known-issues.md)
- [Host keys for SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-host-keys.md)
- [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md)
