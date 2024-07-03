---
title: Map of SFTP commands to REST operations (Azure Blob Storage)
titleSuffix: Azure Storage
description: Find the REST operations used by each SFTP command.
author: normesta

ms.service: azure-blob-storage
ms.topic: reference
ms.date: 07/03/2024
ms.author: normesta
---

# Map of SFTP commands to Azure Blob Storage REST operations for Azure Blob Storage

This article contains a list of valid host keys used to connect to Azure Blob Storage from SFTP clients.

Blob storage now supports the SSH File Transfer Protocol (SFTP). This support provides the ability to securely connect to Blob Storage via an SFTP endpoint, allowing you to leverage SFTP for file access, file transfer, as well as file management. For more information, see [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md).

When you connect to Blob Storage by using an SFTP client, you might be prompted to trust a host key. You can verify the host key by finding that key in the list presented in this article. 

# Map of SFTP commands to Azure Blob Storage REST operations for Azure Blob Storage

When you run an SFTP command that operates on data in your storage account, that command is translated into a REST operation. This article maps SFTP commands to Azure Blob Storage REST operations.  

## Command mapping

The following table shows the operations that are used by each SFTP command. To determine the price of each operation, see [Map each REST operation to a price](../blobs/map-rest-apis-transaction-categories.md).

### Commands that target the Blob Service Endpoint

| Command | Scenario | Operations |
|---------|----------|-----------------------------------------|
| | | |

### Commands that target the Data Lake Storage endpoint

| Command | Scenario | Operations |
|---------|----------|-----------------------------------------|
| | | |

## See also

- [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md)
- [Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-known-issues.md)
- [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md)
