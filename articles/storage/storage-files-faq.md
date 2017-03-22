---
title: Introduction to Azure File Storage | Microsoft Docs
description: An overview of Azure File Storage, Microsoft's cloud file system. Learn how to mount Azure File shares over SMB and lift classic on-premises workloads to the cloud without rewriting any code.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: a4a1bc58-ea14-4bf5-b040-f85114edc1f1
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/21/2017
ms.author: renash
---

File storage FAQ

General Capabilities

1.  **Is a "File Share Witness" for a failover cluster one of the use cases for
    Azure File Storage?**

This is not supported currently.

1.  **File storage is replicated only via LRS or GRS right now, right?**

We plan to support RA-GRS but there is no timeline to share yet.

1.  **Will a Rename operation also be added to the REST API?**

Rename is not yet supported in our REST API.

1.  **When can I use existing storage accounts for Azure File Storage?**

Azure File Storage is now enabled for all storage accounts.

1.  **Can you have nested shares, in other words, a share under a share?**

No. The file share is the virtual driver that you can mount, so nested shares
are not supported.

1.  **Is it possible to specify read-only or write-only permissions on folders
    within the share?**

You don’t have this level of control over permissions if you mount the file
share via SMB. However, you can achieve this by creating a shared access
signature (SAS) via the REST API or client libraries.

1.  **Using Azure File Storage with IBM MQ**

IBM has released a document to guide IBM MQ customers when configuring Azure
File Storage with their service. For more information, please check out [How to
setup IBM MQ Multi instance queue manager with Microsoft Azure File
Service](https://github.com/ibm-messaging/mq-azure/wiki/How-to-setup-IBM-MQ-Multi-instance-queue-manager-with-Microsoft-Azure-File-Service).

1.  **Is Active Directory-based authentication supported by File storage?**

We currently do not support AD-based authentication or ACLs, but do have it in
our list of feature requests. For now, the Azure Storage account keys are used
to provide authentication to the file share. We do offer a workaround using
shared access signatures (SAS) via the REST API or the client libraries. Using
SAS, you can generate tokens with specific permissions that are valid over a
specified time interval. For example, you can generate a token with read-only
access to a given file. Anyone who possesses this token while it is valid has
read-only access to that file.

SAS is only supported via the REST API or client libraries. When you mount the
file share via the SMB protocol, you can’t use a SAS to delegate access to its
contents.

Connectivity

1.  **Are Azure File shares visible publicly over the Internet, or are they only
    reachable from Azure?**

As long as port 445 (TCP Outbound) is open and your client supports the SMB 3.0
protocol (*e.g.*, Windows 8 or Windows Server 2012), your file share is
available via the Internet.

1.  **Does the network traffic between an Azure virtual machine and a file share
    count as external bandwidth that is charged to the subscription?**

If the file share and virtual machine are in different regions, the traffic
between them will be charged as external bandwidth.
