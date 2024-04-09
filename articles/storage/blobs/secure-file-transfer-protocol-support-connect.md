---
title: Connect to Azure Blob Storage from an SFTP client
titleSuffix: Azure Storage
description: Learn how to connect to Azure Blob Storage by using an SSH File Transfer Protocol (SFTP) client.
author: normesta
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 04/09/2024
ms.author: normesta
---

# Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)

You can securely connect to the Blob Storage endpoint of an Azure Storage account by using an SFTP client, and then upload and download files. This article shows you how to enable SFTP, and then connect to Blob Storage by using an SFTP client. 

To learn more about SFTP support for Azure Blob Storage, see [SSH File Transfer Protocol (SFTP) in Azure Blob Storage](secure-file-transfer-protocol-support.md).

## Prerequisites

- A standard general-purpose v2 or premium block blob storage account. You can also enable SFTP as you create the account. For more information on these types of storage accounts, see [Storage account overview](../common/storage-account-overview.md).

- The hierarchical namespace feature of the account must be enabled. To enable the hierarchical namespace feature, see [Upgrade Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities](upgrade-to-data-lake-storage-gen2-how-to.md).

- If you're connecting from an on-premises network, make sure that your client allows outgoing communication through port 22 used by SFTP.

## Connect an SFTP client

You can use any SFTP client to securely connect and then transfer files. The following screenshot shows a Windows PowerShell session that uses [Open SSH](/windows-server/administration/openssh/openssh_overview) and password authentication to connect and then upload a file named `logfile.txt`.  

> [!div class="mx-imgBorder"]
> ![Connect with Open SSH](./media/secure-file-transfer-protocol-support-connect/ssh-connect-and-transfer.png)

> [!NOTE]
> The SFTP username is `storage_account_name`.`username`.  In the example above the `storage_account_name` is "contoso4" and the `username` is "contosouser."  The combined username becomes `contoso4.contosouser` for the SFTP command.

> [!NOTE]
> You might be prompted to trust a host key. Valid host keys are published [here](secure-file-transfer-protocol-host-keys.md).  

After the transfer is complete, you can view and manage the file in the Azure portal. 

> [!div class="mx-imgBorder"]
> ![Uploaded file appears in storage account](./media/secure-file-transfer-protocol-support-connect/uploaded-file-in-storage-account.png)

> [!NOTE]
> The Azure portal uses the Blob REST API and Data Lake Storage Gen2 REST API. Being able to interact with an uploaded file in the Azure portal demonstrates the interoperability between SFTP and REST.

See the documentation of your SFTP client for guidance about how to connect and transfer files.

## Connect using a custom domain

When using custom domains the connection string is `myaccount.myuser@customdomain.com`. If home directory hasn't been specified for the user, it's `myaccount.mycontainer.myuser@customdomain.com`.
	
> [!IMPORTANT]
> Ensure your DNS provider does not proxy requests. Proxying may cause the connection attempt to time out.

## Connect using a private endpoint

When using a private endpoint the connection string is `myaccount.myuser@myaccount.privatelink.blob.core.windows.net`. If home directory hasn't been specified for the user, it's `myaccount.mycontainer.myuser@myaccount.privatelink.blob.core.windows.net`.
	
> [!NOTE]
> Ensure you change networking configuration to "Enabled from selected virtual networks and IP addresses" and select your private endpoint, otherwise the regular SFTP endpoint will still be publicly accessible.

## Related content

- [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Enable or disable SSH File Transfer Protocol (SFTP) support in Azure Blob Storage](secure-file-transfer-protocol-support-how-to.md)
- [Authorize access to Azure Blob Storage from an SSH File Transfer Protocol (SFTP) client](secure-file-transfer-protocol-support-authorize-access.md)
- [Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-known-issues.md)
- [Host keys for SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-host-keys.md)
- [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md)