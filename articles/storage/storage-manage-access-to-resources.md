<properties 
	pageTitle="Manage Access to Azure Storage Resources | Microsoft Azure" 
	description="Learn how to manage how users access your Azure Storage resources." 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="jdial" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/28/2015" 
	ms.author="micurd;tamram"/>

# Manage Access to Azure Storage Resources

## Overview

By default, only the owner of the storage account may access storage resources within that account. If your service or application needs to make these resources available to other clients without sharing your access key, you have the following options for permitting access:

- You can set a container's permissions to permit anonymous read access to the container and its blobs. Anonymous read access is available only for containers and blobs. 

- You can expose a resource via a shared access signature, which enables you to delegate restricted access to a container, blob, table, queue, file share, or file by specifying the interval for which the resources are available and the permissions that a client will have to it.

- You can use a stored access policy to manage shared access signatures for a container or its blobs, for a queue, for a table, or for a file share or its files. The stored access policy gives you an additional measure of control over your shared access signatures and also provides a straightforward means to revoke them.

## Restrict Access to Containers and Blobs

By default, a container and any blobs within it may be accessed only by the owner of the storage account. To give anonymous users read permissions to a container and its blobs, you can set the container permissions to allow public access. Anonymous users can read blobs within a publicly accessible container without authenticating the request.

Containers provide the following options for managing container access:

- **Full public read access:** Container and blob data can be read via anonymous request. Clients can enumerate blobs within the container via anonymous request, but cannot enumerate containers within the storage account.

- **Public read access for blobs only:** Blob data within this container can be read via anonymous request, but container data is not available. Clients cannot enumerate blobs within the container via anonymous request.

- **No public read access:** Container and blob data can be read by the account owner only.

>[AZURE.NOTE]If your service requires that you exercise more granular control over blob resources, or if you wish to provide permissions for operations other than read operations, you can use a Shared Access Signature to make a resource accessible to users. 

### Features Available to Anonymous Users
The following table shows which operations may be called by anonymous users when a container's ACL is set to allow public access.

| REST Operation                                         | Permission with full public read access | Permission with public read access for blobs only |
|--------------------------------------------------------|-----------------------------------------|---------------------------------------------------|
| List Containers                                        | Owner only                              | Owner only                                        |
| Create Container                                       | Owner only                              | Owner only                                        |
| Get Container Properties                               | All                                     | Owner only                                        |
| Get Container Metadata                                 | All                                     | Owner only                                        |
| Set Container Metadata                                 | Owner only                              | Owner only                                        |
| Get Container ACL                                      | Owner only                              | Owner only                                        |
| Set Container ACL                                      | Owner only                              | Owner only                                        |
| Delete Container                                       | Owner only                              | Owner only                                        |
| List Blobs                                             | All                                     | Owner only                                        |
| Put Blob                                               | Owner only                              | Owner only                                        |
| Get Blob                                               | All                                     | All                                               |
| Get Blob Properties                                    | All                                     | All                                               |
| Set Blob Properties                                    | Owner only                              | Owner only                                        |
| Get Blob Metadata                                      | All                                     | All                                               |
| Set Blob Metadata                                      | Owner only                              | Owner only                                        |
| Put Block                                              | Owner only                              | Owner only                                        |
| Get Block List (committed blocks only)                 | All                                     | All                                               |
| Get Block List (uncommitted blocks only or all blocks) | Owner only                              | Owner only                                        |
| Put Block List                                         | Owner only                              | Owner only                                        |
| Delete Blob                                            | Owner only                              | Owner only                                        |
| Copy Blob                                              | Owner only                              | Owner only                                        |
| Snapshot Blob                                          | Owner only                              | Owner only                                        |
| Lease Blob                                             | Owner only                              | Owner only                                        |
| Put Page                                               | Owner only                              | Owner only                                        |
| Get Page Ranges                                        | All                                     | All                                                  |


## See Also

- [Authentication for the Azure Storage Services](https://msdn.microsoft.com/library/azure/dd179428.aspx)
- [Shared access signatures: Understanding the SAS Model](storage-dotnet-shared-access-signature-part-1.md)
- [Delegating Access with a Shared Access Signature](https://msdn.microsoft.com/library/azure/ee395415.aspx) 