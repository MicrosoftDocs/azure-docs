Azure Blob storage is Microsoft's object storage solution for the cloud. Blobs are objects that contain unstructured data, such as text or binary data. Objects in Blob storage can be accessed from anywhere in the world via HTTP or HTTPS.

Blob storage is ideal for:

* Serving images or documents directly to a browser.
* Storing files for distributed access.
* Streaming video and audio.
* Storing data for backup and restore, disaster recovery, and archiving.
* Storing data for analysis by an on-premises or Azure-hosted service.

## Blob service concepts

Blob storage exposes three resources: your storage account, the containers in the account, and the blobs in a container. The following diagram shows the relationship between these resources.

![Diagram of Blob (object) storage architecture](./media/storage-blob-concepts-include/blob1.png)

### Storage Account

All access to data objects in Azure Storage happens through a storage account. For more information, see [About Azure storage accounts](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Container

A container organizes a set of blobs, similar to a folder in a file system. All blobs reside within a container. A storage account can contain an unlimited number of containers, and a container can store an unlimited number of blobs. Note that the container name must be lowercase.

### Blob
 
Azure Storage offers three types of data objects: block blobs, append blobs, and [page blobs](storage-blob-pageblob-overview.md).
  
- *Block blobs* are ideal for storing text or binary files, such as documents and media files.  A single block blob can contain up to 50,000 blocks of up to 100 MB each, for a total size of slightly more than 4.75 TB (100 MB X 50,000). A single append blob can contain up to 50,000 blocks of up to 4 MB each, for a total size of slightly more than 195 GB (4 MB X 50,000).
  
- Append blobs* are similar to block blobs in that they are made up of blocks, but they are optimized for append operations, so they are useful for logging scenarios.

- Page blobs* can be up to 8 TB in size, and are more efficient for frequent read/write operations. Azure Virtual Machines use page blobs as OS and data disks.
  
For details about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).
