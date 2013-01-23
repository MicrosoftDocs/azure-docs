## <a name="what-is"> </a>What is Blob Storage

Windows Azure Blob storage is a service for storing large amounts of
unstructured data that can be accessed from anywhere in the world via
HTTP or HTTPS. A single blob can be hundreds of gigabytes in size, and a
single storage account can contain up to 100TB of blobs. Common uses of
Blob storage include:

-   Serving images or documents directly to a browser
-   Storing files for distributed access
-   Streaming video and audio
-   Performing secure backup and disaster recovery
-   Storing data for analysis by an on-premises or Windows Azure-hosted
    service

You can use Blob storage to expose data publicly to the world or
privately for internal application storage.

## <a name="concepts"> </a>Concepts

The Blob service contains the following components:

![Blob1][]

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. This is the highest level of the
    namespace for accessing blobs. An account can contain an unlimited
    number of containers, as long as their total size is under 100TB.

-   **Container:** A container provides a grouping of a set of blobs.
    All blobs must be in a container. An account can contain an
    unlimited number of containers. A container can store an unlimited
    number of blobs.

-   **Blob:** A file of any type and size. There are two types of blobs
    that can be stored in Windows Azure Storage: block and page blobs.
    Most files are block blobs. A single block blob can be up to 200GB
    in size. This tutorial uses block blobs. Page blobs, another blob
    type, can be up to 1TB in size, and are more efficient when ranges
    of bytes in a file are modified frequently. For more information
    about blobs, see [Understanding Block Blobs and Page Blobs][].

-   **URL format:** Blobs are addressable using the following URL
    format:   
    http://`<storage
    account>`.blob.core.windows.net/`<container>`/`<blob>`  
      
    The following URL could be used to address one of the blobs in the
    diagram above:  
    http://sally.blob.core.windows.net/movies/MOV1.AVI

[Blob1]: ../../../DevCenter/Shared/Media/blob1.jpg
  [Understanding Block Blobs and Page Blobs]: http://msdn.microsoft.com/en-us/library/windowsazure/ee691964.aspx