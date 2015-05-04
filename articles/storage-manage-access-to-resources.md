<properties 
	pageTitle="Manage Access to Azure Storage Resources | Microsoft Azure" 
	description="Learn how to manage how users access your Azure Storage resources." 
	services="storage" 
	documentationCenter="" 
	authors="micurd" 
	manager="jahogg" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="micurd;tamram"/>

# Manage Access to Azure Storage Resources

## Overview

By default, only the owner of the storage account may access storage resources within that account. If your service or application needs to make these resources available to other clients without sharing your access key, you have the following options for permitting access:

- You can set a container's permissions to permit anonymous read access to the container and its blobs. This is not allowed for tables or queues.

- You can expose a resource via a shared access signature, which enables you to delegate restricted access to a container, blob, table or queue resource by specifying the interval for which the resources are available and the permissions that a client will have to it.

- You can use a stored access policy to manage shared access signatures for a container or its blobs, for a queue, or for a table. The stored access policy gives you an additional measure of control over your shared access signatures and also provides a straightforward means to revoke them.

## Restrict Access to Containers and Blobs

By default, a container and any blobs within it may be accessed only by the owner of the storage account. If you want to give anonymous users read permissions to a container and its blobs, you can set the container permissions to allow public access. Anonymous users can read blobs within a publicly accessible container without authenticating the request.

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

## Create and Use a Shared Access Signature
A shared access signature is a URI that grants restricted access rights to containers, blobs, queues, and tables for a specific time interval. By providing a client with a shared access signature, you can enable them to access resources in your storage account without sharing your account key with them.

>[AZURE.NOTE] For an in-depth conceptual overview and tutorial on shared access signatures, see [Shared Access Signatures](storage-dotnet-shared-access-signature-part-1.md).

Supported operations using shared access signatures include:

- Reading and writing page or block blob content, block lists, properties, and metadata

- Deleting, leasing, and creating a snapshot of a blob

- Listing the blobs within a container

- Adding, removing, updating, and deleting queue messages (in Storage Client Library 2.0 and newer)

- Getting queue metadata, including the message count (in Storage Client Library 2.0 and newer)

- Querying, adding, updating, deleting, and upserting table entities (in Storage Client Library 2.0 and newer)

The shared access signature URI query parameters incorporate all of the information necessary to grant controlled access to a storage resource. The URI query parameters specify the time interval over which the shared access signature is valid, the permissions that it grants, the resource that is to be made available, and the signature that the storage services should use to authenticate the request.

Additionally, the shared access signature URI can reference a stored access policy that provides an additional level of control over a set of signatures, including the ability to modify or revoke access to the resource if necessary. 

For information on the URI format of a shared access signature, see [Delegating Access with a Shared Access Signature](https://msdn.microsoft.com/library/ee395415.aspx).

### Secure use of Shared Access Signatures
A shared access signature grants access to the resource specified by the URI's granted permissions. You should always use HTTPS to construct a shared access signature URI. Using HTTP with shared access signatures can make your storage account vulnerable to malicious use.

If a shared access signature grants access that is not intended for the general public, then it should be constructed with the fewest possible permissions. In addition, a shared access signature should be distributed securely to clients over a secure connection, should be associated with a stored access policy for the purpose of revocation, and should specify the shortest possible lifetime for the signature.

>[AZURE.NOTE] A shared access signature URI is associated with the account key used to create the signature, and the associated stored access policy (if any). If no stored access policy is specified, the only way to revoke a shared access signature is to change the account key. 

### Creating a Shared Access Signature
The following code example creates an access policy on a container and then generates a shared access signature for the container. This shared access signature can then be given to clients:

    // The connection string for the storage account.  Modify for your account.
    string storageConnectionString =
       "DefaultEndpointsProtocol=https;" +
       "AccountName=myaccount;" +
       "AccountKey=<account-key>";
    
    // As an alternative, you can retrieve storage account information from an app.config file. 
    // This is one way to store and retrieve a connection string if you are 
    // writing an application that will run locally, rather than in Microsoft Azure.
    
    // string storageConnectionString = ConfigurationManager.AppSettings["StorageAccountConnectionString"];
    
    // Create the storage account with the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);
       
    // Create the blob client object.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
    
    // Get a reference to the container for which shared access signature will be created.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");
    container.CreateIfNotExists();
    
    // Create blob container permissions, consisting of a shared access policy 
    // and a public access setting. 
    BlobContainerPermissions blobPermissions = new BlobContainerPermissions();
    
    // The shared access policy provides 
    // read/write access to the container for 10 hours.
    blobPermissions.SharedAccessPolicies.Add("mypolicy", new SharedAccessBlobPolicy()
    {
       // To ensure SAS is valid immediately, don’t set start time.
       // This way, you can avoid failures caused by small clock differences.
       SharedAccessExpiryTime = DateTime.UtcNow.AddHours(10),
       Permissions = SharedAccessBlobPermissions.Write |
      SharedAccessBlobPermissions.Read
    });
    
    // The public access setting explicitly specifies that 
    // the container is private, so that it can't be accessed anonymously.
    blobPermissions.PublicAccess = BlobContainerPublicAccessType.Off;
    
    // Set the permission policy on the container.
    container.SetPermissions(blobPermissions);
    
    // Get the shared access signature to share with users.
    string sasToken =
       container.GetSharedAccessSignature(new SharedAccessBlobPolicy(), "mypolicy");

### Using a Shared Access Signature
A client who receives a shared access signature can use it from their code to construct an object of type [StorageCredentials](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.auth.storagecredentials.aspx). Those credentials can then be used to construct a [CloudStorageAccount](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.cloudstorageaccount.aspx) or a [CloudBlobClient](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.blob.cloudblobclient.aspx) object for working with the resource, as shown in this example:

    Uri blobUri = new Uri("https://myaccount.blob.core.windows.net/mycontainer/myblob.txt");
    
    // Create credentials with the SAS token. The SAS token was created in previous example.
    StorageCredentials credentials = new StorageCredentials(sasToken);
    
    // Create a new blob.
    CloudBlockBlob blob = new CloudBlockBlob(blobUri, credentials);
    
    // Upload the blob. 
    // If the blob does not yet exist, it will be created. 
    // If the blob does exist, its existing content will be overwritten.
    using (var fileStream = System.IO.File.OpenRead(@"c:\Test\myblob.txt"))
    {
    blob.UploadFromStream(fileStream);
    }

## Use a Stored Access Policy
A stored access policy provides an additional level of control over shared access signatures on the server side. Establishing a stored access policy serves to group shared access signatures and to provide additional restrictions for signatures that are bound by the policy. You can use a stored access policy to change the start time, expiry time, or permissions for a signature, or to revoke it after it has been issued.

A stored access policy gives you greater control over shared access signatures you have released. Instead of specifying the signature's lifetime and permissions on the URL, you can specify these parameters within the stored access policy stored on the blob, container, queue, or table that is being shared. To change these parameters for one or more signatures, you can modify the stored access policy, rather than reissuing the signatures. You can also quickly revoke the signature by modifying the stored access policy.

For example, suppose you have issued a shared access signature that's associated with a stored access policy. If you've specified the expiry time within the stored access policy, you can modify the access policy to extend the life of the signature, without having to reissue a new signature.

Best practices recommend specifying a stored access policy for any signed resource for which you are issuing a shared access signature, as the stored policy can be used to modify or revoke the signature after it has been issued. If you don't specify a stored policy, it's recommended that you limit the lifetime of your signature in order to minimize any risk to your storage account resources. 

### Associating a Shared Access Signature with a Stored Access Policy
A stored access policy includes a name up to 64 characters long that is unique within the container, queue, or table. To associate a shared access signature with a stored access policy, you specify this identifier when creating the shared access signature. On the shared access signature URI, the *signedidentifier* field specifies the identifier for the stored access policy.

A container, queue, or table can include up to 5 stored access policies. Each policy can be used by any number of shared access signatures.

>[AZURE.NOTE]When you establish a stored access policy on a container, queue, or table, it may take up to 30 seconds to take effect. During this interval, a shared access signature that is associated with the stored access policy will fail with status code 403 (Forbidden), until the access policy becomes active.

### Specifying Access Policy Parameters for a Shared Access Policy
The stored access policy can specify the following access policy parameters for the signatures with which it's associated:

- Start time

- Expiry time

- Permissions

Depending on how you want to control access to your storage resource, you can specify all of these parameters within the stored access policy, and omit them from the URL for the shared access signature. Doing so permits you to modify the associated signature's behavior at any time, as well as to revoke it. Or you can specify one or more of the access policy parameters within the stored access policy, and the others on the URL. Finally, you can specify all of the parameters on the URL. In this case, you can use the stored access policy to revoke the signature, but not to modify its behavior.

Together the shared access signature and the stored access policy must include all fields required to authenticate the signature. If any required fields are missing, the request will fail with status code 403 (Forbidden). Likewise, if a field is specified both in the shared access signature URL and in the stored access policy, the request will fail with status code 403 (Bad Request). See Create and Use a Shared Access Signature for more information about the fields that comprise the signature.

### Modifying or Revoking a Stored Access Policy

To revoke access to shared access signatures that use the same stored access policy, remove the stored policy from the storage resource by overwriting the stored policy list with a new list that does not contain the policy name. To change access settings of a stored access policy, overwrite the stored policy list with a new list that contains a policy of the same name that has new access control details.
