Azure Blob storage is a service for storing large amounts of unstructured object data, such as text or binary data. Clients can access data in Blob storage over HTTP or HTTPS from anywhere in the world.

Common uses of Blob storage include:

* Serving images or documents directly to a browser.
* Storing files for distributed access.
* Streaming video and audio.
* Storing data for backup and restore, disaster recovery, and archiving.
* Storing data for analysis by an on-premises or Azure-hosted service.

## Blob service concepts

Here's a diagram that shows the types of objects available in Blob storage:

![Diagram of Blob service architecture](./media/storage-blob-concepts-include/blob1.png)

* **Storage account:** All access to Azure Storage is done through a storage account. This storage account can be a **General-purpose storage account** or a **Blob storage account**, which is specialized for storing objects or blobs. For more information, see [About Azure storage accounts](../articles/storage/common/storage-create-storage-account.md).
* **Container:** A container provides a grouping for a set of blobs. All blobs must be in a container. An account can contain an unlimited number of containers. A container can store an unlimited number of blobs. The container name must be lowercase.
* **Blob:** A file of any type and size. Azure Storage offers three types of blobs: block blobs, append blobs, and page blobs.
  
    *Block blobs* are ideal for storing text or binary data, such as documents and media files. A single block blob can contain up to 50,000 blocks of up to 100 MB each, for a total size of slightly more than 4.75 TB (100 MB X 50,000). 

    *Append blobs* are similar to block blobs in that they are made up of blocks, but they are optimized for append operations, so they are useful for logging scenarios. A single append blob can contain up to 50,000 blocks of up to 4 MB each, for a total size of slightly more than 195 GB (4 MB X 50,000).
  
    *Page blobs* can be up to 1 TB in size, and are designed for frequent read/write operations. Azure Virtual Machines use page blobs as operating system and data disks (VHDs). Microsoft recommends using page blobs for VHDs only, as the storage cost may be significantly greater if you store other types of data in page blobs.
  
    For details about naming containers and blobs, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

