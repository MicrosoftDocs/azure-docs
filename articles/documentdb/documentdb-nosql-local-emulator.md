---
title: Develop locally with the DocumentDB Emulator | Microsoft Docs
description: Using the DocumentDB Emulator, you can develop and test your application locally for free, without creating an Azure subscription. 
services: documentdb
documentationcenter: ''
keywords: DocumentDB Emulator
author: arramac
manager: jhubbard
editor: ''

ms.assetid: 90b379a6-426b-4915-9635-822f1a138656
ms.service: documentdb
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/11/2016
ms.author: arramac

---
# Use the Azure DocumentDB Emulator for Development and Testing
The Azure DocumentDB Emulator provides a local environment that emulates the Azure DocumentDB service for development purposes. Using the DocumentDB Emulator, you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the DocumentDB Emulator, you can switch to using an Azure DocumentDB account in the cloud.

## DocumentDB Emulator system requirements
The DocumentDB Emulator has the following hardware and software requirements:

* Software requirements
  * Windows Server 2012 R2, Windows Server 2016, or Windows 10
*	Minimum Hardware requirements
  *	2 GB RAM
  *	10 GB available hard disk space

## Installing the DocumentDB Emulator
You can download the DocumentDB Emulator from the [Microsoft Download Center](https://aka.ms/documentdb-emulator). To install, configure, and run the DocumentDB Emulator, you must have administrative privileges on the computer.

> [!NOTE]
> To install, configure, and run the DocumentDB Emulator, you must have administrative privileges on the computer.

## Checking for DocumentDB Emulator updates
The DocumentDB Emulator includes a built-in Azure DocumentDB Data Explorer to browse data stored within DocumentDB, craete new collections, and let you know when a new update is available for download. 

> [!NOTE]
> Data created in one version of the DocumentDB Emulator is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it is recommended that you store that data in an Azure DocumentDB account, rather than in the DocumentDB Emulator. 

## How the DocumentDB Emulator works
The DocumentDB Emulator provides a high-fidelity emulation of the DocumentDB service. It supports identical functionality as Azure DocumentDB, including support for creating and querying JSON documents, provisioning and scaling collections, and executing stored procedures and triggers. You can develop and test applications using the DocumentDB Emulator, and deploy them to Azure at global scale by just making a single configuration change to the connection endpoint for DocumentDB.

While we created a high-fidelity local emulation of the actual DocumentDB service, the implementation of the DocumentDB Emulator is different than that of the service. For example, the DocumentDB Emulator uses standard OS components such as the local file system for persistence, and HTTPS protocol stack for connectivity. This means that some functionality that relies on Azure infrastructure like global replication, single-digit millisecond latency for reads/writes, and tunable consistency levels are not available via the DocumentDB Emulator.

## Authenticating requests against the DocumentDB Emulator
Just as with Azure Document in the cloud, every request that you make against the DocumentDB Emulator must be authenticated. The DocumentDB Emulator supports a single fixed account and a well-known authentication key for master key authentication. This account and key are the only credentials permitted for use with the DocumentDB Emulator. They are:

    Account name: localhost:<port>
    Account key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==

> [!NOTE]
> The master key supported by the DocumentDB Emulator is intended for use only with the emulator. You cannot use your production DocumentDB account and key with the DocumentDB Emulator. 

Additionally, just as the Azure DocumentDB service, the DocumentDB Emulator supports only secure communication via SSL.

## Start and initialize the DocumentDB Emulator
To start the Azure DocumentDB Emulator, select the Start button or press the Windows key. Begin typing **DocumentDB Emulator**, and select the emulator from the list of applications. When the emulator is running, you'll see an icon in the Windows taskbar notification area.

The DocumentDB Emulator is installed by default to the `C:\Program Files\Microsoft SDKs\Azure\DocumentDB Emulator` directory. You can also start and stop the emulator from the command-line. Please see below for options for running the emulator from the command-line.

## Developing with the DocumentDB Emulator
Once you have the DocumentDB Emulator running on your desktop, you can use any supported [DocumentDB SDK](documentdb-sdk-dotnet.md) or the [DocumentDB REST API](https://msdn.microsoft.com/library/azure/dn781481.aspx) to interact with the Emulator. The DocumentDB Emulator also includes a built-in Data Explorer that lets you create collections, view and edit documents without writing any code. 

    // Connect to the DocumentDB Emulator running locally
    DocumentClient client = new DocumentClient(
        new Uri("https://localhost:443"), 
        "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==");

You can use existing tools like [DocumentDB Studio](https://github.com/mingaliu/DocumentDBStudio) to connect to the DocumentDB Emulator. You can also migrate data between the DocumentDB Emulator and the Azure DocumentDB service using the [DocumentDB data migration tool](https://github.com/azure/azure-documentdb-datamigrationtool).

## DocumentDB Emulator command-line tool reference
From the installation location, you can use the command-line to start and stop the emulator, configure options, and perform other operations.

### Command Line Syntax

    DocumentDB.LocalEmulator.exe [/shutdown] [/datapath] [/port] [/mongoport] [/directports] [/key] [/?]

To view the list of options, type `DocumentDB.LocalEmulator.exe /?` at the command prompt.

<table>
<tr>
  <td><strong>Option</strong></td>
  <td><strong>Description</strong></td>
  <td><strong>Command</strong></td>
  <td><strong>Arguments</strong></td>
</tr>
<tr>
  <td>[No arguments]</td>
  <td>Starts up the DocumentDB Emulator with default settings</td>
  <td>DocumentDB.LocalEmulator.exe</td>
  <td></td>
</tr>
<tr>
  <td>Shutdown</td>
  <td>Shuts down the DocumentDB Emulator</td>
  <td>DocumentDB.LocalEmulator.exe /Shutdown</td>
  <td></td>
</tr>
<tr>
  <td>Help</td>
  <td>Displays the list of command-line arguments</td>
  <td>DocumentDB.LocalEmulator.exe /?</td>
  <td>&lt;path&rt;: An accessible path</td>
</tr>
<tr>
  <td>Datapath</td>
  <td>Specifies the path in which to store data files</td>
  <td>DocumentDB.LocalEmulator.exe /datapath=<path></td>
  <td>&lt;path&rt;: An accessible path</td>
</tr>
<tr>
  <td>Port</td>
  <td>Specifies the port number to use for the emulator.  Default is 443</td>
  <td>DocumentDB.LocalEmulator.exe /port=&lt;port&rt;</td>
  <td>&lt;port&rt;: Single port number</td>
</tr>
<tr>
  <td>Mongoport</td>
  <td>Specifies the port number to use for MongoDB comptability API. Default is 10250</td>
  <td>DocumentDB.LocalEmulator.exe /mongoport=&lt;mongoport&rt;</td>
  <td>&lt;mongoport&rt;: Single port number</td>
</tr>
<tr>
  <td>Directports</td>
  <td>Specifies the ports to use for direct connectivity.  Defaults are 10251,10252,10253,10254</td>
  <td>DocumentDB.LocalEmulator.exe /directports:&lt;directports&rt;</td>
  <td>&lt;directports&rt;:Comma delimited list of 4 ports</td>
</tr>
<tr>
  <td>Key</td>
  <td>Authorization key for the emulator. Key must be the base-64 encoding of a 64-byte vector</td>
  <td>DocumentDB.LocalEmulator.exe /key:&lt;key&rt;</td>
  <td>&lt;key&rt;: Key must be the base-64 encoding of a 64-byte vector</td>
</tr>
<tr>
  <td>EnableThrottling</td>
  <td>Specifies that request throttling behavior is enabled</td>
  <td>DocumentDB.LocalEmulator.exe /enablethrottling</td>
  <td></td>
</tr>
<tr>
  <td>DisableThrottling</td>
  <td>Specifies that request throttling behavior is disabled</td>
  <td>DocumentDB.LocalEmulator.exe /disablethrottling</td>
  <td></td>
</tr>
</table>

## Differences between the DocumentDB Emulator and Azure DocumentDB 
Because the DocumentDB Emulator provides an emulated environment running on a local developer workstation, there are some differences in functionality between the emulator and an Azure DocumentDB account in the cloud:

* The DocumentDB Emulator supports only a single fixed account and a well-known master key.  Key regeneration is not possible in the DocumentDB Emulator.
* The DocumentDB Emulator is not a scalable service and will not support a large number of collections.
* The DocumentDB Emulator does not simulate different [DocumentDB consistency levels](documentdb-consistency-levels.md).
* The DocumentDB Emulator does not simulate [multi-region replication](documentdb-distribute-data-globally.md).
* The DocumentDB Emulator does not support service quota overrides which may be available in the Azure DocumentDB service (e.g. document size limits, increased partitioned collection storage).
* While the DocumentDB Emulator will return request charges similar to the Azure DocumentDB service, the emulator cannot be used to estimate provisioned throughput requirements for applications leveraging the Azure DocumentDB service. To accurately estimate production throughput needs, use the [DocumentDB capacity planner](https://www.documentdb.com/capacityplanner).
* While the DocumentDB Emulator persists data, the emulator cannot be used to estimate data and index storage requirements for applications leveraging the Azure DocumentDB service. To accurately estimate production storage needs, use the [DocumentDB capacity planner](https://www.documentdb.com/capacityplanner).


## Next steps
* To learn more about DocumentDB, see [Introduction to Azure DocumentDB](documentdb-introduction.md)
* To start developing against the DocumentDB Emulator, download one of the [supported DocumentDB SDKs](documentdb-sdk-dotnet.md)