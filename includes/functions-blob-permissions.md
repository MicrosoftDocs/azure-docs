---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/08/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to your blob container at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Blob Storage extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                |
|----------------|---------------------------------------|
| Trigger        | [Storage Blob Data Owner] **and** [Storage Queue Data Contributor]<sup>1</sup><br/><br/>Additional permissions must also be granted to the AzureWebJobsStorage connection.<sup>2</sup> |
| Input binding  | [Storage Blob Data Reader]            |
| Output binding | [Storage Blob Data Owner]             |

<sup>1</sup> The blob trigger handles failure across multiple retries by writing [poison blobs] to a queue on the storage account specified by the connection.

<sup>2</sup> The AzureWebJobsStorage connection is used internally for blobs and queues that enable the trigger. If it is configured to use an identity-based connection, it will need additional permissions beyond the default requirement. These are covered by the [Storage Blob Data Owner], [Storage Queue Data Contributor], and [Storage Account Contributor] roles. To learn more, see [Connecting to host storage with an identity][webjobs-permissions].

[Storage Blob Data Reader]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-reader
[Storage Blob Data Owner]: ../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner
[Storage Queue Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor

[poison blobs]: ../articles/azure-functions/functions-bindings-storage-blob-trigger.md#poison-blobs

[Storage Account Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-account-contributor
[webjobs-permissions]: ../articles/azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity-preview