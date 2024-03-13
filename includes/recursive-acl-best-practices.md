---
title: "include file"
description: "include file"
services: storage
author: normesta
ms.service: storage
ms.topic: "include"
ms.date: 02/03/2021
ms.author: normesta
ms.custom: "include file"
---

## Best practices

This section provides you some best practice guidelines for setting ACLs recursively. 

#### Handling runtime errors

A runtime error can occur for many reasons (For example: an outage or a client connectivity issue). If you encounter a runtime error, restart the recursive ACL process. ACLs can be reapplied to items without causing a negative impact. 

#### Handling permission errors (403)

If you encounter an access control exception while running a recursive ACL process, your AD [security principal](../articles/role-based-access-control/overview.md#security-principal) might not have sufficient permission to apply an ACL to one or more of the child items in the directory hierarchy. When a permission error occurs, the process stops and a continuation token is provided. Fix the permission issue, and then use the continuation token to process the remaining dataset. The directories and files that have already been successfully processed won't have to be processed again. You can also choose to restart the recursive ACL process. ACLs can be reapplied to items without causing a negative impact. 

#### Credentials 

We recommend that you provision a Microsoft Entra security principal that has been assigned the [Storage Blob Data Owner](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of the target storage account or container. 

#### Performance 

To reduce latency, we recommend that you run the recursive ACL process in an Azure Virtual Machine (VM) that is located in the same region as your storage account. 

#### ACL limits

The maximum number of ACLs that you can apply to a directory or file is 32 access ACLs and 32 default ACLs. For more information, see [Access control in Azure Data Lake Storage Gen2](../articles/storage/blobs/data-lake-storage-access-control.md).
