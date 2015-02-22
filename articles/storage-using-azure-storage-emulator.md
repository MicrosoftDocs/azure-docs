<properties 
	pageTitle="Using the Azure Storage Emulator for Development and Testing" 
	description="Learn how to Azure Storage Emulator for Development and Testing." 
	services="storage" 
	documentationCenter="" 
	authors="peskount" 
	manager="adinah" 
	editor="cgronlun"/>
<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="peskount"/>

# Using the Azure Storage Emulator for Development and Testing

## Overview
The Microsoft Azure storage emulator provides a local environment that emulates the Azure Blob, Queue, and Table services for development purposes. Using the storage emulator, you can test your application against the storage services locally, without incurring any cost.

> [AZURE.NOTE] The storage emulator is available as part of the Microsoft Azure SDK. You can also install the storage emulator as a standalone package.
To configure the storage emulator, you must have administrative privileges on the computer.Note that data created in one version of the storage emulator is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it's recommended that you store that data in an Azure storage account, rather than in the storage emulator.
 
Some differences exist between the storage emulator and Azure storage services. For more information about these differences, see [Differences Between the Storage Emulator and Azure Storage Services](https://msdn.microsoft.com/en-us/library/gg433135.aspx).

The storage emulator uses a Microsoft® SQL Server™ instance and the local file system to emulate the Azure storage services. By default, the storage emulator is configured for a database in Microsoft® SQL Server™ 2012 Express LocalDB. You can install SQL Server Management Studio Express to manage your LocalDB installation. The storage emulator connects to SQL Server or LocalDB using Windows authentication. You can choose to configure the storage emulator to access a local instance of SQL Server instead of LocalDB using the Storage Emulator Command-Line Tool Reference.

##Authenticating Requests

The storage emulator supports only a single fixed account and a well-known authentication key. This account and key are the only credentials permitted for use with the storage emulator. They are:

    Account name: devstoreaccount1
    Account key: Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtrKBHBeksoGMGw==
    
> [AZURE.NOTE] The authentication key supported by the storage emulator is intended only for testing the functionality of your client authentication code. It does not serve any security purpose. You cannot use your production storage account and key with the storage emulator. Also note that you should not use the development account with production data.
 

##Start and Initialize the Storage Emulator
To start the Azure storage emulator, Select the Start button or press the Windows key. Begin typing Windows Azure Storage Emulator, and select Windows Azure Storage Emulator from the list of applications. 

Alternatively, if the Azure compute emulator is already running, you can start the storage emulator by right-clicking the system tray icon and selecting Start Storage Emulator For more information about running the compute emulator, see [Run an Azure Application in the Compute Emulator](https://msdn.microsoft.com/en-us/library/hh403990.aspx).

When the storage emulator starts, a command line will appear. You can use this command line to start and stop the storage emulator as well as clear data, get current status, and initialize the emulator. For more information, see [Storage Emulator Command-Line Tool Reference](https://msdn.microsoft.com/en-us/library/gg433005.aspx).

When the command line is closed, the storage emulator continues to run. To bring up the command line again, follow the steps above as if starting the storage emulator.

The first time you run the storage emulator, the local storage environment is initialized for you. You can use the storage emulator command-line tool to point to a different database instance or to reinitialize the existing database. The initialization process creates a database in LocalDB and reserves HTTP ports for each local storage service. This step requires administrative privileges. For details, see [Storage Emulator Command-Line Tool Reference](https://msdn.microsoft.com/en-us/library/gg433005.aspx).

##About Storage Service URIs

How you address a resource in the Azure storage services differs depending on whether the resource resides in Azure or in the storage emulator services. One URI scheme is used to address a storage resource in Azure, and another URI scheme is used to address a storage resource in the storage emulator. The difference is due to the fact that the local computer does not perform domain name resolution. Both URI schemes always include the account name and the address of the resource being requested.

##Addressing Azure Storage Resources in the Cloud

In the URI scheme for addressing storage resources in Azure, the account name is part of the URI host name, and the resource being addressed is part of the URI path. The following basic addressing scheme is used to access storage resources:

    <http|https>://<account-name>.<service-name>.core.windows.net/<resource-path>


The <account-name> is the name of your storage account. The <service-name> is the name of the service being accessed, and the <resource-path> is the path to the resource being requested. The following list shows the URI scheme for each of the storage services:

- Blob Service: <http|https>://<account-name>.blob.core.windows.net/<resource-path>
- Queue Service: <http|https>://<account-name>.queue.core.windows.net/<resource-path>
- Table Service: <http|https>://<account-name>.table.core.windows.net/<resource-path>

For example, the following address might be used for accessing a blob in the cloud:
    
    http://myaccount.blob.core.windows.net/mycontainer/myblob.txt

> [AZURE.NOTE] You can also associate a custom domain name with a storage account in the cloud, and use that custom domain name to address storage resources. 
 
##Addressing local Azure Storage Resources in the Storage Emulator

In the storage emulator, because the local computer does not perform domain name resolution, the account name is part of the URI path. The URI scheme for a resource running in the storage emulator follows this format:

    http://<local-machine-address>:<port>/<account-name>/<resource-path>

The following format is used for addressing resources running in the storage emulator:
- Blob Service: http://127.0.0.1:10000/<account-name>/<resource-path>
- Queue Service: http://127.0.0.1:10001/<account-name>/<resource-path>
- Table Service: http://127.0.0.1:10002/<account-name>/<resource-path>

For example, the following address might be used for accessing a blob in the storage emulator:

    http://127.0.0.1:10000/myaccount/mycontainer/myblob.txt

> [AZURE.NOTE]HTTPS is not a permitted protocol for addressing local storage resources.
 
##Addressing the Account Secondary with RA-GRS
Beginning with version 3.1, the storage emulator account supports read-access geo-redundant replication (RA-GRS). For storage resources both in the cloud and in the local emulator, you can access the secondary location by appending -secondary to the account name. For example, the following address might be used for accessing a blob using the read-only secondary in the storage emulator:

    http://127.0.0.1:10000/myaccount-secondary/mycontainer/myblob.txt 

> [AZURE.NOTE]For programmatic access to the secondary with the storage emulator, use the Storage Client Library for .NET version 3.2 or later. See the Storage Client Library Reference for details.
 
##Initialize the Storage Emulator by Using the Command-Line Tool
You can use the storage emulator command-line tool to initialize the storage emulator to point to a different database instance than the default. If you wish to use the default LocalDB database instance, it's not necessary to run a separate initialization step.

This tool is installed by default to the C:\Program Files(x86)\Microsoft SDKs\Azure\Storage Emulator\ directory. Initialization runs automatically the first time you start the emulator.

> [AZURE.NOTE] You must have administrative privileges to run the init command described below.

1.Click the Start button or press the Windows key. Begin typing Windows Azure Storage Emulator and select it when it appears. A command prompt window will pop up.


2.In the command prompt window, type the following command where <SQLServerInstance> is the name of the SQL Server instance. To use LocalDb, specify (localdb)\v11.0 as the SQL Server instance.

    WAStorageEmulator init /sqlInstance <SQLServerInstance> 
    
You can also use the following command, which directs the emulator to use the default SQL Server instance:

    WAStorageEmulator init /server .\\ 

Or, you can use the following command, which reinitializes the database:

    WAStorageEmulator init /forceCreate 

## Next Steps
- [Storage Emulator Command-Line Tool Reference](https://msdn.microsoft.com/en-us/library/gg433005.aspx)
- [Differences Between the Storage Emulator and Azure Storage Services](https://msdn.microsoft.com/en-us/library/gg433135.aspx)
- [Storage Emulator Release Notes](https://msdn.microsoft.com/en-us/library/dn683879.aspx) 
