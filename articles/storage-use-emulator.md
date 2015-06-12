<properties 
	pageTitle="Use the Azure Storage Emulator for Development and Testing | Microsoft Azure" 
	description="The Azure storage emulator provides a free local development environment for developing and testing against Azure Storage. Learn about the storage emulator, including how requests are authenticated, how to connect to the emulator from your application, and how to use the command-line tool." 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>
<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/11/2015" 
	ms.author="tamram"/>

# Use the Azure Storage Emulator for Development and Testing

## Overview

The Microsoft Azure storage emulator provides a local environment that emulates the Azure Blob, Queue, and Table services for development purposes. Using the storage emulator, you can test your application against the storage services locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the emulator, you can switch to using an Azure storage account in the cloud.

> [AZURE.NOTE] The storage emulator is available as part of the [Microsoft Azure SDK](https://azure.microsoft.com/downloads/). You can also install the storage emulator as a standalone package. To configure the storage emulator, you must have administrative privileges on the computer.
>  
> Note that data created in one version of the storage emulator is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it's recommended that you store that data in an Azure storage account, rather than in the storage emulator.

## How the storage emulator works
 
The storage emulator uses a local Microsoft SQL Server instance and the local file system to emulate the Azure storage services. By default, the storage emulator uses a database in Microsoft SQL Server 2012 Express LocalDB.  You can choose to configure the storage emulator to access a local instance of SQL Server instead of the LocalDB instance. See [Start and initialize the storage emulator](#start-and-initialize-the-storage-emulator) below for more information.

You can install SQL Server Management Studio Express to manage your LocalDB installation. The storage emulator connects to SQL Server or LocalDB using Windows authentication. 

Some differences in functionality exist between the storage emulator and Azure storage services. For more information about these differences, see [Differences between the storage emulator and Azure Storage](#differences-between-the-storage-emulator-and-azure-storage).

## Authenticating requests against the storage emulator

Just as with Azure Storage in the cloud, every request that you make against the storage emulator must be authenticated, unless it is an anonymous request.  

The storage emulator supports a single fixed account and a well-known authentication key for Shared Key authentication. This account and key are the only Shared Key credentials permitted for use with the storage emulator. They are:

    Account name: devstoreaccount1
    Account key: Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtrKBHBeksoGMGw==
    
> [AZURE.NOTE] The authentication key supported by the storage emulator is intended only for testing the functionality of your client authentication code. It does not serve any security purpose. You cannot use your production storage account and key with the storage emulator. Also note that you should not use the development account with production data.

### Connecting to the storage emulator account from your application

To connect to the storage emulator from your application, configure a connection string from within your application's configuration file. For details on how to configure and store the connection string, see [Storing your connection string](storage-configure-connection-string.md#storing-your-connection-string) and [Create a connection string to the storage emulator](storage-configure-connection-string.md#create-a-connection-string-to-the-storage-emulator). 

Note that you can use a shortcut string format, `UseDevelopmentStorage=true`, to refer to the storage emulator from within a connection string. Here's an example of a connection string to the storage emulator in an app.config file: 

    <appSettings>
      <add key="StorageConnectionString" value="UseDevelopmentStorage=true" />
    </appSettings>

You can also use the full account name and key for the emulator account in the connection string.

### Using the storage emulator with the Xamarin client library

If you are using the Azure Storage Client Library for Xamarin, you must authenticate a request to the storage emulator using a shared access signature (SAS). For more information, see [Get started with Azure Blob Storage on Xamarin](storage-xamarin-blob-storage.md). 

## Start and initialize the storage emulator

To start the Azure storage emulator, select the Start button or press the Windows key. Begin typing **Azure Storage Emulator**, and select the emulator from the list of applications. 

When the emulator is running, you'll see an icon in the Windows taskbar notification area.

When the storage emulator starts, a command-line window will appear. You can use this command-line window to start and stop the storage emulator as well as clear data, get current status, and initialize the emulator. For more information, see [Storage Emulator Command-Line Tool Reference](#storage-emulator-command-line-tool-reference).

When the command line window is closed, the storage emulator continues to run. To bring up the command line again, follow the steps above as if starting the storage emulator.

The first time you run the storage emulator, the local storage environment is initialized for you. The initialization process creates a database in LocalDB and reserves HTTP ports for each local storage service. 

The storage emulator is installed by default to the C:\Program Files (x86)\Microsoft SDKs\Azure\Storage Emulator directory. 

### Initialize the storage emulator to use a different SQL database

You can use the storage emulator command-line tool to initialize the storage emulator to point to a SQL database instance other than the default LocalDB instance. Note that you must be running the command-line tool with administrative privileges to initialize the back-end database for the storage emulator:

1. Click the **Start** button or press the **Windows** key. Begin typing `Azure Storage Emulator` and select it when it appears to bring up the storage emulator command-line tool.
2. In the command prompt window, type the following command, where `<SQLServerInstance>` is the name of the SQL Server instance. To use LocalDb, specify `(localdb)\v11.0` as the SQL Server instance.

		WAStorageEmulator init /sqlInstance <SQLServerInstance> 
    
	You can also use the following command, which directs the emulator to use the default SQL Server instance:

    	WAStorageEmulator init /server .\\ 

	Or, you can use the following command, which re-initializes the database to the default LocalDB instance:

    	WAStorageEmulator init /forceCreate 

For more information about these commands, see [Storage Emulator Command-Line Tool Reference](#storage-emulator-command-line-tool-reference).

## Addressing resources in the storage emulator

The service endpoints for the storage emulator are different from those of an Azure storage account. The difference is due to the fact that the local computer does not perform domain name resolution, so the storage emulator endpoints require a local address rather than a domain name.

When you address a resource in an Azure storage account, you use the following scheme, where the account name is part of the URI host name, and the resource being addressed is part of the URI path:

    <http|https>://<account-name>.<service-name>.core.windows.net/<resource-path>

For example, the following URI is a valid address for a blob in an Azure storage account:

	https://myaccount.blob.core.windows.net/mycontainer/myblob.txt

In the storage emulator, because the local computer does not perform domain name resolution, the account name is part of the URI path instead of the host name. You use the following scheme for a resource running in the storage emulator:

    http://<local-machine-address>:<port>/<account-name>/<resource-path>

For example, the following address might be used for accessing a blob in the storage emulator:

    http://127.0.0.1:10000/myaccount/mycontainer/myblob.txt

The service endpoints for the storage emulator are:

	Blob Service: http://127.0.0.1:10000/<account-name>/<resource-path>
	Queue Service: http://127.0.0.1:10001/<account-name>/<resource-path>
	Table Service: http://127.0.0.1:10002/<account-name>/<resource-path>

> [AZURE.NOTE] You cannot use HTTPS with the storage emulator, although HTTPS is the recommended protocol for accessing resources in Azure storage.
 
### Addressing the account secondary with RA-GRS

Beginning with version 3.1, the storage emulator account supports read-access geo-redundant replication (RA-GRS). For storage resources both in the cloud and in the local emulator, you can access the secondary location by appending -secondary to the account name. For example, the following address might be used for accessing a blob using the read-only secondary in the storage emulator:

    http://127.0.0.1:10000/myaccount-secondary/mycontainer/myblob.txt 

> [AZURE.NOTE] For programmatic access to the secondary with the storage emulator, use the Storage Client Library for .NET version 3.2 or later. See the [Storage Client Library Reference](https://msdn.microsoft.com/library/azure/dn261237.aspx) for details.

## Storage emulator command-line tool reference

Starting in version 3.0, when you launch the Storage Emulator, you will see a command-line window pop up. Use the command-line window to start and stop the emulator as well as to query for status and perform other operations.

> [AZURE.NOTE] If you have the Microsoft Azure compute emulator installed, a system tray icon will appear when you launch the Storage Emulator. Right-click on the icon to reveal a menu, which provides a graphical way to start and stop the Storage Emulator.

### Command Line Syntax

	AzureStorageEmulator [/start] [/stop] [/status] [/clear] [/init] [/help]

### Options

To view the list of options, type `/help` at the command prompt.

| Option | Description                                                    | Command                                                                                                 | Arguments                                                                                                         |
|--------|----------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Start**  | Starts up the storage emulator.                                | `AzureStorageEmulator start [-inprocess]`                                                                    | *-inprocess*: Start the emulator in the current process instead of creating a new process.                          |
| **Stop**   | Stops the storage emulator.                                    | `AzureStorageEmulator stop`                                                                                  |                                                                                                                   |
| **Status** | Prints the status of the storage emulator.                     | `AzureStorageEmulator status`                                                                                |                                                                                                                   |
| **Clear**  | Clears the data in all services specified on the command line. | `AzureStorageEmulator clear [blob] [table] [queue] [all]                                                    `| *blob*: Clears blob data. <br/>*queue*: Clears queue data. <br/>*table*: Clears table data. <br/>*all*: Clears all data in all services. |
| **Init**   | Performs one-time initialization to set up the emulator.       | `AzureStorageEmulator.exe init [-server serverName] [-sqlinstance instanceName] [-forcecreate] [-inprocess]` | *-server serverName*: Specifies the server hosting the SQL instance. <br/>*-sqlinstance instanceName*: Specifies the name of the SQL instance to be used. <br/>*-forcecreate*: Forces creation of the SQL database, even if it already exists. <br/>*-inprocess*: Performs initialization in the current process instead of spawning a new process. This requires the current process to have been launched with elevated permissions.                                               |
                                                                                                                  
## Differences between the storage emulator and Azure Storage

Because the storage emulator is an emulated enviroment running in a local SQL instance, there are some differences in functionality between the emulator and an Azure storage account in the cloud:

- The storage emulator supports only a single fixed account and a well-known authentication key.

- The storage emulator is not a scalable storage service and will not support a large number of concurrent clients.

- As described in [Addressing resources in the storage emulator](#addressing-resources-in-the-storage-emulator), resources are addressed differently in the storage emulator versus an Azure storage account. This difference is due to the fact that domain name resolution is available in the cloud but not on the local computer.

- Beginning with version 3.1, the storage emulator account supports read-access geo-redundant replication (RA-GRS). In the emulator, all accounts have RA-GRS enabled, and there is never any lag between the primary and secondary replicas. The Get Blob Service Stats, Get Queue Service Stats, and Get Table Service Stats operations are supported on the account secondary and will always return the value of the `LastSyncTime` response element as the current time according to the underlying SQL database.

	For programmatic access to the secondary with the storage emulator, use the Storage Client Library for .NET version 3.2 or later. See the [Storage Client Library Reference](https://msdn.microsoft.com/library/azure/dn261237.aspx) for details.

- The File service and SMB protocol service endpoints are not currently supported in the storage emulator.

### Differences for Blob storage 

The following differences apply to Blob storage in the emulator:

- The storage emulator only supports blob sizes up to 2 GB.

- A Put Blob operation may succeed against a blob that exists in the storage emulator and has an active lease, even if the lease ID has not been specified as part of the request. 

### Differences for Table storage 

The following differences apply to Table storage in the emulator:

- Date properties in the Table service in the storage emulator support only the range supported by SQL Server 2005 (*i.e.*, they are required to be later than January 1, 1753). All dates before January 1, 1753 are changed to this value. The precision of dates is limited to the precision of SQL Server 2005, meaning that dates are precise to 1/300th of a second.

- The storage emulator supports partition key and row key property values of less than 512 bytes each. Additionally, the total size of the account name, table name, and key property names together cannot exceed 900 bytes.

- The total size of a row in a table in the storage emulator is limited to less than 1 MB.

- In the storage emulator, properties of data type `Edm.Guid` or `Edm.Binary` support only the `Equal (eq)` and `NotEqual (ne)` comparison operators in query filter strings.

### Differences for Queue storage

There are no differences specific to Queue storage in the emulator.

## Storage emulator release notes

### Version 3.2
- The storage emulator now supports version 2014-02-14 of the storage services on Blob, Queue, and Table service endpoints. Note that File service endpoints are not currently supported in the storage emulator. See [Versioning for the Azure Storage Services](https://msdn.microsoft.com/library/azure/dd894041.aspx) for details about version 2014-02-14.

### Version 3.1
- Read-access geo-redundant storage (RA-GRS) is now supported in the storage emulator. The Get Blob Service Stats, Get Queue Service Stats, and Get Table Service Stats APIs are supported for the account secondary and will always return the value of the LastSyncTime response element as the current time according to the underlying SQL database. For programmatic access to the secondary with the storage emulator, use the Storage Client Library for .NET version 3.2 or later. See the Storage Client Library Reference for details.

### Version 3.0
- The Azure storage emulator is no longer shipped in the same package as the compute emulator.

- The storage emulator graphical user interface is deprecated in favor of a scriptable command line interface. For details on the command line interface, see Storage Emulator Command-Line Tool Reference. The graphical interface will continue to be present in version 3.0, but it can only be accessed when the Compute Emulator is installed by right-clicking on the system tray icon and selecting Show Storage Emulator UI.

- Version 2013-08-15 of the Azure storage services is now fully supported. (Previously this version was only supported by Storage Emulator version 2.2.1 Preview.)



