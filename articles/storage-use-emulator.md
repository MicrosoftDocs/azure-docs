<properties 
	pageTitle="Use the Azure Storage Emulator for Development and Testing" 
	description="Learn how to use the Azure Storage Emulator for Development and Testing." 
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
	ms.date="02/20/2015" 
	ms.author="tamram"/>

# Use the Azure Storage Emulator for Development and Testing

## Overview
The Microsoft Azure storage emulator provides a local environment that emulates the Azure Blob, Queue, and Table services for development purposes. Using the storage emulator, you can test your application against the storage services locally, without incurring any cost.

> [AZURE.NOTE] The storage emulator is available as part of the Microsoft Azure SDK. You can also install the storage emulator as a standalone package.
To configure the storage emulator, you must have administrative privileges on the computer. 
> Note that data created in one version of the storage emulator is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it's recommended that you store that data in an Azure storage account, rather than in the storage emulator.
 
Some differences exist between the storage emulator and Azure storage services. For more information about these differences, see [Differences Between the Storage Emulator and Azure Storage Services](https://msdn.microsoft.com/library/azure/gg433135.aspx).

The storage emulator uses a Microsoft® SQL Server™ instance and the local file system to emulate the Azure storage services. By default, the storage emulator is configured for a database in Microsoft® SQL Server™ 2012 Express LocalDB. You can install SQL Server Management Studio Express to manage your LocalDB installation. The storage emulator connects to SQL Server or LocalDB using Windows authentication. You can choose to configure the storage emulator to access a local instance of SQL Server instead of LocalDB using the Storage Emulator Command-Line Tool Reference.

## Authenticating Requests

The storage emulator supports only a single fixed account and a well-known authentication key. This account and key are the only credentials permitted for use with the storage emulator. They are:

    Account name: devstoreaccount1
    Account key: Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtrKBHBeksoGMGw==
    
> [AZURE.NOTE] The authentication key supported by the storage emulator is intended only for testing the functionality of your client authentication code. It does not serve any security purpose. You cannot use your production storage account and key with the storage emulator. Also note that you should not use the development account with production data.
 

## Start and Initialize the Storage Emulator
To start the Azure storage emulator, Select the Start button or press the Windows key. Begin typing Azure Storage Emulator, and select Azure Storage Emulator from the list of applications. 

Alternatively, if the Azure compute emulator is already running, you can start the storage emulator by right-clicking the system tray icon and selecting Start Storage Emulator For more information about running the compute emulator, see [Run an Azure Application in the Compute Emulator](https://msdn.microsoft.com/library/azure/hh403990.aspx).

When the storage emulator starts, a command line will appear. You can use this command line to start and stop the storage emulator as well as clear data, get current status, and initialize the emulator. For more information, see [Storage Emulator Command-Line Tool Reference](https://msdn.microsoft.com/library/azure/gg433005.aspx).

When the command line window is closed, the storage emulator continues to run. To bring up the command line again, follow the steps above as if starting the storage emulator.


The first time you run the storage emulator, the local storage environment is initialized for you. You can use the storage emulator command-line tool to point to a different database instance or to reinitialize the existing database. The initialization process creates a database in LocalDB and reserves HTTP ports for each local storage service. This step requires administrative privileges. For details, see [Storage Emulator Command-Line Tool Reference](https://msdn.microsoft.com/library/azure/gg433005.aspx).

## About Storage Service URIs

How you address a resource in the Azure storage services differs depending on whether the resource resides in Azure or in the storage emulator services. One URI scheme is used to address a storage resource in Azure, and another URI scheme is used to address a storage resource in the storage emulator. The difference is due to the fact that the local computer does not perform domain name resolution. Both URI schemes always include the account name and the address of the resource being requested.

### Addressing Azure Storage Resources in the Cloud

In the URI scheme for addressing storage resources in Azure, the account name is part of the URI host name, and the resource being addressed is part of the URI path. The following basic addressing scheme is used to access storage resources:

    <http|https>://<account-name>.<service-name>.core.windows.net/<resource-path>


The `<account-name>` is the name of your storage account. The `<service-name>` is the name of the service being accessed, and the `<resource-path>` is the path to the resource being requested. The following list shows the URI scheme for each of the storage services:

	Blob Service: <http|https>://<account-name>.blob.core.windows.net/<resource-path>
	Queue Service: <http|https>://<account-name>.queue.core.windows.net/<resource-path>
	Table Service: <http|https>://<account-name>.table.core.windows.net/<resource-path>

For example, the following address might be used for accessing a blob in the cloud:
    
    http://myaccount.blob.core.windows.net/mycontainer/myblob.txt

> [AZURE.NOTE] You can also associate a custom domain name with a Blob storage endpoint in the cloud, and use that custom domain name to address blobs and containers. See 
 
### Addressing Local Azure Storage Resources in the Storage Emulator

In the storage emulator, because the local computer does not perform domain name resolution, the account name is part of the URI path. The URI scheme for a resource running in the storage emulator follows this format:

    http://<local-machine-address>:<port>/<account-name>/<resource-path>

The following format is used for addressing resources running in the storage emulator:

	Blob Service: http://127.0.0.1:10000/<account-name>/<resource-path>
	Queue Service: http://127.0.0.1:10001/<account-name>/<resource-path>
	Table Service: http://127.0.0.1:10002/<account-name>/<resource-path>

For example, the following address might be used for accessing a blob in the storage emulator:

    http://127.0.0.1:10000/myaccount/mycontainer/myblob.txt

> [AZURE.NOTE] HTTPS is not a permitted protocol for addressing local storage resources.
 
### Addressing the Account Secondary with RA-GRS
Beginning with version 3.1, the storage emulator account supports read-access geo-redundant replication (RA-GRS). For storage resources both in the cloud and in the local emulator, you can access the secondary location by appending -secondary to the account name. For example, the following address might be used for accessing a blob using the read-only secondary in the storage emulator:

    http://127.0.0.1:10000/myaccount-secondary/mycontainer/myblob.txt 

> [AZURE.NOTE] For programmatic access to the secondary with the storage emulator, use the Storage Client Library for .NET version 3.2 or later. See the Storage Client Library Reference for details.
 
## Initialize the Storage Emulator by Using the Command-Line Tool
You can use the storage emulator command-line tool to initialize the storage emulator to point to a different database instance than the default. If you wish to use the default LocalDB database instance, it's not necessary to run a separate initialization step.

This tool is installed by default to the C:\Program Files(x86)\Microsoft SDKs\Azure\Storage Emulator\ directory. Initialization runs automatically the first time you start the emulator.

> [AZURE.NOTE] You must have administrative privileges to run the `init` command described below.

1. Click the **Start** button or press the **Windows** key. Begin typing `Azure Storage Emulator` and select it when it appears. A command prompt window will pop up.


2. In the command prompt window, type the following command where `<SQLServerInstance>` is the name of the SQL Server instance. To use LocalDb, specify `(localdb)\v11.0` as the SQL Server instance.

    WAStorageEmulator init /sqlInstance <SQLServerInstance> 
    
You can also use the following command, which directs the emulator to use the default SQL Server instance:

    WAStorageEmulator init /server .\\ 

Or, you can use the following command, which re-initializes the database:

    WAStorageEmulator init /forceCreate 

## Storage Emulator Command-Line Tool Reference

Starting in version 3.0, when you launch the Storage Emulator you will see a command prompt pop up. Use the command prompt to start and stop the emulator as well as query for status and perform other operations.

> [AZURE.NOTE] If you have the Compute Emulator installed, a system tray icon will appear when you launch the Storage Emulator. Right-click on the icon to reveal a menu, which provides a graphical way to start and stop the Storage Emulator.

### Command Line Syntax

	WAStorageEmulator [/start] [/stop] [/status] [/clear] [/init] [/help]

### Options

To view the list of options, type `/help` at the command prompt.

| Option | Description                                                    | Command                                                                                                 | Arguments                                                                                                         |
|--------|----------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Start**  | Starts up the storage emulator.                                | `WAStorageEmulator start [-inprocess]`                                                                    | *-inprocess*: Start the emulator in the current process instead of creating a new process.                          |
| **Stop**   | Stops the storage emulator.                                    | `WAStorageEmulator stop`                                                                                  |                                                                                                                   |
| **Status** | Prints the status of the storage emulator.                     | `WAStorageEmulator status`                                                                                |                                                                                                                   |
| **Clear**  | Clears the data in all services specified on the command line. | `WAStorageEmulator clear [blob] [table] [queue] [all]                                                    `| *blob*: Clears blob data. <br/>*queue*: Clears queue data. <br/>*table*: Clears table data. <br/>*all*: Clears all data in all services. |
| **Init**   | Performs one-time initialization to set up the emulator.       | `WAStorageEmulator.exe init [-server serverName] [-sqlinstance instanceName] [-forcecreate] [-inprocess]` | *-server serverName*: Specifies the server hosting the SQL instance. <br/>*-sqlinstance instanceName*: Specifies the name of the SQL instance to be used. <br/>*-forcecreate*: Forces creation of the SQL database, even if it already exists. <br/>*-inprocess*: Performs initialization in the current process instead of spawning a new process. This requires the current process to have been launched with elevated permissions.                                               |
                                                                                                                  
## Differences Between the Storage Emulator and Azure Storage Services

The following general differences apply to storage services:

- The storage emulator supports only a single fixed account and a well-known authentication key. This account and key are the only credentials permitted for use with the emulated storage services. They are:

	Account name: devstoreaccount1
	Account key: Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==

>[AZURE.IMPORTANT] The authentication key supported by the storage emulator is intended only for testing the functionality of your client authentication code. It does not serve any security purpose. You cannot use your production storage account and key with the storage emulator. You should not use the emulated storage account with production data.

- The storage emulator is not a scalable storage service and will not support a large number of concurrent clients.

- The URI scheme supported by the storage emulator differs from the URI scheme supported by the cloud storage services. The development URI scheme specifies the account name as part of the hierarchical path of the URI, rather than as part of the domain name. This difference is due to the fact that domain name resolution is available in the cloud but not on the local computer.

- Beginning with version 3.1, the storage emulator account supports read-access geo-redundant replication (RA-GRS). In the emulator, all accounts have RA-GRS enabled, and there is never any lag between the primary and secondary replicas. The Get Blob Service Stats, Get Queue Service Stats, and Get Table Service Stats operations are supported on the account secondary and will always return the value of the `LastSyncTime` response element as the current time according to the underlying SQL database.

	For programmatic access to the secondary with the storage emulator, use the Storage Client Library for .NET version 3.2 or later. See the [Storage Client Library Reference](https://msdn.microsoft.com/en-us/library/azure/dn261237.aspx) for details.

- The File service and SMB protocol service endpoints are not supported in the storage emulator.

### Differences for the Blob service 

The following differences apply to the Blob service:

- The Blob service emulator only supports blob sizes up to 2 GB.

- A Put Blob operation may succeed against a blob that exists in the storage emulator and has an active lease, even if the lease ID has not been specified as part of the request. 

### Differences for the Table service 

The following differences apply to the Table service:

- Date properties in the Table service in the storage emulator support only the range supported by SQL Server 2005 (For example, they are required to be later than January 1, 1753). All dates before January 1, 1753 are changed to this value. The precision of dates is limited to the precision of SQL Server 2005, meaning that dates are precise to 1/300th of a second.

- The storage emulator supports partition key and row key property values of less than 512 bytes each. Additionally, the total size of the account name, table name, and key property names together cannot exceed 900 bytes.

- The total size of a row in a table in the storage emulator is limited to less than 1 MB.

- In the storage emulator, properties of data type `Edm.Guid` or `Edm.Binary` support only the `Equal (eq)` and `NotEqual (ne)` comparison operators in query filter strings.

### Differences for the Queue service 

There are no differences specific to the Queue service.

## Storage Emulator Release Notes

### Version 3.2
- The storage emulator now supports version 2014-02-14 of the storage services on Blob, Queue, and Table service endpoints. Note that File service endpoints are not currently supported in the storage emulator. See Versioning for the Azure Storage Services for details about version 2014-02-14.

### Version 3.1
- Read-access geo-redundant storage (RA-GRS) is now supported in the storage emulator. The Get Blob Service Stats, Get Queue Service Stats, and Get Table Service Stats APIs are supported for the account secondary and will always return the value of the LastSyncTime response element as the current time according to the underlying SQL database. For programmatic access to the secondary with the storage emulator, use the Storage Client Library for .NET version 3.2 or later. See the Storage Client Library Reference for details.

### Version 3.0
- The Azure storage emulator is no longer shipped in the same package as the Compute Emulator.

- The storage emulator graphical user interface is deprecated in favor of a scriptable command line interface. For details on the command line interface, see Storage Emulator Command-Line Tool Reference. The graphical interface will continue to be present in version 3.0, but it can only be accessed when the Compute Emulator is installed by right-clicking on the system tray icon and selecting Show Storage Emulator UI.

- Version 2013-08-15 of the Azure storage services is now fully supported. (Previously this version was only supported by Storage Emulator version 2.2.1 Preview.)

## Next Steps

- [Storage Emulator Release Notes](https://msdn.microsoft.com/library/azure/dn683879.aspx) 
