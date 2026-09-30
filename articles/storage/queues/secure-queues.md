---
title: Secure your Azure Queue Storage
description: Learn how to secure Azure Queue Storage, with best practices specific to queues and messages.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-queue-storage
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/19/2026
ai-usage: ai-assisted
# Customer intent: As a developer using Azure Queue Storage, I want to implement queue-specific security best practices.
---

# Secure your Azure Queue Storage

Azure Queue Storage provides message queuing between application components. Because messages often carry references to sensitive resources - object identifiers, callback URLs, and application state - you must secure both queue authorization and message content handling.

> [!NOTE]
> This article covers security practices specific to Azure Queue Storage. For account-level security guidance, see [Secure your Azure Storage account](../common/secure-storage.md).

## Identity and access management

- **Use Microsoft Entra ID with managed identities for queue producers and consumers**: Assign the built-in **Storage Queue Data Message Sender**, **Storage Queue Data Message Processor**, and **Storage Queue Data Reader** roles to the managed identity of each service that interacts with the queue. Choose the role that matches the operation. A message-sending service shouldn't hold processor rights. For more information, see [Authorize access to queues using Microsoft Entra ID](authorize-access-azure-active-directory.md).

- **Scope role-based access control (RBAC) role assignments to the specific queue**: Queue-level scope is supported for the built-in queue data roles. Assign at the queue level rather than the storage account when a service needs access to only one queue in a multi-queue account.

- **Scope SAS tokens to a single queue and specific message operations**: Queue shared access signature (SAS) supports `add`, `update`, `process`, and `read` permissions separately. Grant only what the caller needs. A webhook receiver that enqueues events should get `add` only, not `process`. For more information, see [Delegate access with a shared access signature](/rest/api/storageservices/delegate-access-with-shared-access-signature).

## Data protection

Messages are protected at rest and in transit by the account's encryption and TLS settings, but they aren't individually access-controlled beyond queue-level authorization. Design message content to avoid concentrating sensitive data in the queue.

- **Don't put secrets or credentials in queue messages**: Store secrets in Azure Key Vault and put a reference (secret identifier) in the message. Consumers retrieve the secret at processing time under their own identity. Anything placed in a message is visible to every principal with `process` or `read` on the queue and is written to storage logs.

- **Encrypt sensitive message payloads at the application layer**: For messages that must carry sensitive data, encrypt the payload with a key from Key Vault before enqueueing. This adds a layer independent of storage-side encryption and limits exposure if a consumer is compromised. For more information, see [Client-side encryption for Azure Storage](../queues/client-side-encryption.md).

- **Set a reasonable message time-to-live (TTL)**: Messages persist until they're processed, expire, or the queue is drained. A long TTL increases the window during which stale sensitive data is retrievable. Match TTL to the expected processing latency plus a safety margin.

## Logging and monitoring

- **Enable diagnostic settings for queue operations**: Send `StorageRead`, `StorageWrite`, and `StorageDelete` categories to Log Analytics so that individual queue operations are auditable. Track authorization method (Entra ID, Shared Key, SAS, anonymous) to detect misuse. For more information, see [Monitoring Azure Queue Storage](../queues/monitor-queue-storage.md).

- **Move poison messages to a dedicated poison queue**: Configure your consumer to detect messages that exceed the dequeue-count threshold and move them to a `<queue-name>-poison` queue for offline investigation. Poison-queue accumulation is a security signal, not just an operational one. For more information, see [Handle poison messages in queue-triggered functions](/azure/azure-functions/functions-bindings-storage-queue-trigger#poison-messages).

- **Alert on poison-queue growth**: Configure Azure Monitor alerts on the message count in each poison queue so that unexpected growth triggers investigation.

- **Alert on unusual dequeue and delete patterns**: Bursts of `DeleteMessage` operations from unexpected identities, or high volumes of dequeue-only activity with no downstream processing, can indicate an attacker draining a queue to hide activity. Alert on deviations from the queue's normal traffic profile.

## Related security articles

- [Secure your Azure Storage account](../common/secure-storage.md) - Cross-cutting Azure Storage security guidance.
- [Secure your Azure Blob Storage](../blobs/secure-blobs.md) - Blob-specific security.
- [Secure your Azure Files](../files/secure-files.md) - File share security.
- [Secure your Azure Table Storage](../tables/secure-tables.md) - Table-specific security.

## Next steps

- [Introduction to Azure Queue Storage](../queues/storage-queues-introduction.md)
- [Authorize access to queues using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [Azure Queue Storage monitoring data reference](../queues/monitor-queue-storage-reference.md)
