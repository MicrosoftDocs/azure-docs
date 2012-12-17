# Using Windows Azure Storage for SQL Server Backup and Restore
The ability to write SQL Server backups to the Windows Azure Blob storage service is available in SQL Server 2012 SP1 CU2 or a later version. You can use this functionality to back up to and restore from a Windows Azure Blob service from your on-premise SQL Server database or a SQL Server database in a Windows Azure Virtual Machine. Backup to cloud offers you the benefits of availability, limitless geo-replicated off-site storage, and ease of migration of data to and from the cloud.   In the SQL Server 2012 SP1 CU2 release, you can issue BACKUP or RESTORE statements by using T-SQL or SMO. Back up to or restore from the Windows Azure Blob storage service by using SQL Server Management Studio Backup or Restore Wizard is not available.

## Benefits of Using a Windows Azure Blob Service for SQL Server Backups

Storage management, risk of storage failure, access to off-site storage, and configuring devices are some of the general backup challenges. For SQL Server running in a Windows Azure Virtual Machine, there are additional challenges of configuring and backing up VHD, or configuring attached drives. The following lists some of the key benefits of using the Windows Azure Blob storage service storage  for SQL Server backups:

* Flexible and limitless off-site storage: Backups are available from anywhere and at any time and can easily be accessed for restore. By selecting a different region for the Blob storage than your on-premises, you have an extra layer of protection in the event of a region-wide disaster.
* Built-in high availability on Windows Azure provides the extra protection and data redundancy for your backups against hardware failures. You can select the geo-replication option when you create the storage account in Windows Azure for cost effective geo replication.
* Cost Benefits: Pay only for the service that is used.
* Ease of database migration to and from Windows Azure.

For more details, see Windows Azure Storage For SQL Server Backup.

The following sections introduce the Windows Azure Blob storage service, and the SQL Server components required when backing up to or restoring from the Windows Azure Blob storage service. The Windows Azure storage account is created as the first step, followed by a container for the Windows Azure Blob storage service. SQL Server uses the storage account name and its access key values to authenticate and write and read blobs to the storage service. The SQL Server Credential stores this information required to authenticate during the backup or restore operations. For a complete walkthrough of creating a storage account and performing a simple restore, see [Getting Started withWindows Azure Storage Service for SQL Server Backup and Restore](http://go.microsoft.com/fwlink/?LinkId=271615) 

## Windows Azure Blob Storage Service Components 

**Storage Account:** The storage account is the starting point for all storage services. To access a Windows Azure Blob Storage service, first create a Windows Azure Storage account. The storage account name and its access key properties are required to authenticate to the Windows Azure Blob Storage service and its components.
**Container:**A container provides a grouping of a set of Blobs, and can store an unlimited number of Blobs. To write a SQL Server backup to a Windows Azure Blob service, you must have at least the root container created. 

**Blob**:A file of any type and size. There are two types of blobs that can be stored in the Windows Azure Blob storage service: block and page blobs.  SQL Server backup uses page Blobs as the Blob type. Blobs are addressable using the following URL format: `https://<storage account>.blob.core.windows.net/<container>/<blob>`
For more information about Windows Azure Blob storage service, see [How to use the Windows Azure Blob Storage Service](http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/)

For more information about page Blobs, see [Understanding Block and Page Blobs](http://msdn.microsoft.com/en-us/library/windowsazure/ee691964.aspx)

## SQL Server Components

**URL:**A URL specifies a Uniform Resource Identifier (URI) to a unique backup file. The URL is used to provide the location and name of the SQL Server backup file. In this implementation, the only valid URL is one that points to a page Blob in a Windows Azure Storage account. The URL must point to an actual Blob, not just a container. If the Blob does not exist, it is created. If an existing Blob is specified, BACKUP fails, unless the > WITH FORMAT option is specified. 

Following is an example of the URL you would specifiy in the BACKUP command: 
`http[s]://ACCOUNTNAME.Blob.core.windows.net/<CONTAINER>/<FILENAME.bak>`. HTTPS is not required, but is the default.

**Important:** *If you choose to copy and upload a backup file to the Windows Azure Blob storage service, you must use a page blob type as your storage option if you are planning to use this file for restore operations. RESTORE from a block blob type will fail with an error.*

**Credential:** The information that is required to connect and authenticate to Windows Azure Blob storage service is stored as a Credential.  In order for SQL Server to write backups to a Windows Azure Blob or restore from it, a SQL Server credential must be created. The Credential stores the name of the storage account and the storage account access key.  Once the credential is created, it must be specified in the WITH CREDENTIAL option when issuing the BACKUP/RESTORE statements. For more information about how to view, copy or regenerate storage account access keys, see [Storage Account Access Keys](http://msdn.microsoft.com/en-us/library/windowsazure/hh531566.aspx)

For step by step instructions about how to create a SQL Server Credential, see [Getting Started with Windows Azure Storage Service for SQL Server Backup and Restore](http://go.microsoft.com/fwlink/?LinkId=271615).

## SQL Server Database Backups and Restore with Windows Azure Blobs- Concepts and Tasks:

<table Border="2">
	<tr>
		<th>Task descriptions</th>
		<th>Link to Topics</th>
	</tr>
	<tr>
		<td>Concepts, considerations, and code samples</td>
		<td>[SQL Server Backup and Restore with Windows Azure Blob Storage Service](http://go.microsoft.com/fwlink/?LinkId=271617)</td>
	</tr>
	<tr>
		<td>Walkthrough (tutorial): Simple Backup and Restore to Windows Azure Blob service</td>
		<td>[How to use the Windows Azure Blob Storage Service](http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/)</td>
	</tr>
	<tr>
		<td>Best Practices, Troubleshooting</td>
		<td>[Back and Restore Best Practices (Windows Azure Blob Storage Service)](http://go.microsoft.com/fwlink/?LinkId=272394)</td>
	</tr>
</table>


	




