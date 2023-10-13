---
title: SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage
titleSuffix: Azure Storage
description: Optimize the performance of your SSH File Transfer Protocol (SFTP) requests by using the recommendations in this article.
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 10/20/2022
ms.custom: references_regions
ms.author: normesta
ms.reviewer: ylunagaria

---

# SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage

Blob storage now supports the SSH File Transfer Protocol (SFTP). This article contains recommendations that will help you to optimize the performance of your storage requests. To learn more about SFTP support for Azure Blob Storage, see [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md).

## Use concurrent connections to increase throughput

Azure Blob Storage scales linearly until it reaches the maximum storage account egress and ingress limit. Therefore, your applications can achieve higher throughput by using more client connections. To view storage account egress and ingress limits, see [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md).

For WinSCP, you can use a maximum of 9 concurrent connections to upload multiple files. Other common SFTP clients such as FileZilla have similar options.

> [!IMPORTANT]
> Concurrent uploads will only improve performance when uploading multiple files at the same time. Using multiple connections to upload a single file is not supported.
  
- Under the **Preferences** dialog, under **Logging**, if the **Enable session logging on level** is checked, select **Reduced** or **Normal**.

> [!CAUTION]
> Logging level **Debug 1** or **Debug 2** significantly reduces session operation performance.

## Use premium block blob storage accounts

[Azure premium block blob storage account](../common/storage-account-create.md) offers consistent low-latency and high transaction rates. The premium block blob storage account can reach maximum bandwidth with fewer threads and clients. For example, with a single client, a premium block blob storage account can achieve **2.3x** bandwidth compared to the same setup used with a standard performance general purpose v2 storage account.

## Reduce the impact of network latency

Network latency has a large impact on SFTP performance due to its reliance on small messages. By default, most clients use a message size of around 32KB.

- Increase default message size to achieve better performance
  
  - For OpenSSH on Windows, you can increase the message size to 100000 with the `-B` option: `sftp -B 100000 testaccount.user1@testaccount.blob.core.windows.net`

  - For OpenSSH on Linux, you can increase buffer size to 262000 with the `-B` option: `sftp -B 262000 -R 32 testaccount.user1@testaccount.blob.core.windows.net`

- Make storage requests from a client located in the same region as the storage account

## See also

- [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md)
- [Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-known-issues.md)
- [Host keys for SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-host-keys.md)
