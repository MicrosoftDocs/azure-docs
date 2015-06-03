## What is Azure File storage?

File storage offers shared storage for applications using the standard SMB 2.1 protocol. Microsoft Azure virtual machines and cloud services can share file data across application components via mounted shares, and on-premises applications can access file data in a share via the File storage API.

Applications running in Azure virtual machines or cloud services can mount a File storage share to access file data, just as a desktop application would mount a typical SMB share. Any number of Azure virtual machines or roles can mount and access the File storage share simultaneously.

Since a File storage share is a standard SMB 2.1 file share, applications running in Azure can access data in the share via file I/O APIs. Developers can therefore leverage their existing code and skills to migrate existing applications. IT Pros can use PowerShell cmdlets to create, mount, and manage File storage shares as part of the administration of Azure applications. This guide will show examples of both.

Common uses of File storage include:

- Migrating on-premises applications that rely on file shares to run on Azure virtual machines or cloud services, without expensive rewrites
- Storing shared application settings, for example in configuration files
- Storing diagnostic data such as logs, metrics, and crash dumps in a shared location 
- Storing tools and utilities needed for developing or administering Azure virtual machines or cloud services

## File storage concepts

File storage contains the following components:

![files-concepts][files-concepts]

-   **Storage Account:** All access to Azure Storage is done
    through a storage account. See [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/library/azure/dn249410.aspx) for details about storage account capacity.

-   **Share:** A File storage share is an SMB 2.1 file share in Azure. 
    All directories and files must be created in a parent share. An account can contain an
    unlimited number of shares, and a share can store an unlimited
    number of files, up to the capacity limits of the storage account.

-   **Directory:** An optional hierarchy of directories. 

-	**File:** A file in the share. A file may be up to 1 TB in size.

-   **URL format:** Files are addressable using the following URL
    format:   
    https://`<storage
    account>`.file.core.windows.net/`<share>`/`<directory/directories>`/`<file>`  
    
    The following example URL could be used to address one of the files in the
    diagram above:  
    `http://samples.file.core.windows.net/logs/CustomLogs/Log1.txt`

For details about how to name shares, directories, and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](http://msdn.microsoft.com/library/azure/dn167011.aspx).

[files-concepts]: ./media/storage-file-concepts-include/files-concepts.png