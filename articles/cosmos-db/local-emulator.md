---
title: Develop locally with the Azure Cosmos DB Emulator | Microsoft Docs
description: Using the Azure Cosmos DB Emulator, you can develop and test your application locally for free, without creating an Azure subscription. 
services: cosmos-db
keywords: Azure Cosmos DB Emulator
author: David-Noble-at-work
manager: kfile
editor: ''

ms.service: cosmos-db
ms.devlang: na
ms.topic: tutorial
ms.date: 04/20/2018
ms.author: danoble

---
# Use the Azure Cosmos DB Emulator for local development and testing

<table>
<tr>
  <td><strong>Binaries</strong></td>
  <td>[Download MSI](https://aka.ms/cosmosdb-emulator)</td>
</tr>
<tr>
  <td><strong>Docker</strong></td>
  <td>[Docker Hub](https://hub.docker.com/r/microsoft/azure-cosmosdb-emulator/)</td>
</tr>
<tr>
  <td><strong>Docker source</strong></td>
  <td>[Github](https://github.com/Azure/azure-cosmos-db-emulator-docker)</td>
</tr>
</table>
  
The Azure Cosmos DB Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Using the Azure Cosmos DB Emulator, you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the Azure Cosmos DB Emulator, you can switch to using an Azure Cosmos DB account in the cloud. 

At this time the Data Explorer in the emulator only fully supports SQL API collections and MongoDB collections. Table, Graph, and Cassandra containers are not fully supported. 

This article covers the following tasks: 

> [!div class="checklist"]
> * Installing the emulator
> * Authenticating requests
> * Using the Data Explorer in the emulator
> * Exporting SSL certificates
> * Calling the emulator from the command-line
> * Running the emulator on Docker for Windows
> * Collecting trace files
> * Troubleshooting

## How the emulator works

The Azure Cosmos DB Emulator provides a high-fidelity emulation of the Azure Cosmos DB service. It supports identical functionality as Azure Cosmos DB, including support for creating and querying JSON documents, provisioning and scaling collections, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos DB emulator, and deploy them to Azure at global scale by just making a single configuration change to the connection endpoint for Azure Cosmos DB.

While emulation of the Azure Cosmos DB service is faithful, the emulator's implementation is different than the service. For example, the emulator uses standard OS components such as the local file system for persistence, and the HTTPS protocol stack for connectivity. Functionality that relies on Azure infrastructure like global replication, single-digit millisecond latency for reads/writes, and tunable consistency levels are unavailable.

## Differences between the emulator and the service 
Because the Azure Cosmos DB Emulator provides an emulated environment running on a local developer workstation, there are some differences in functionality between the emulator and an Azure Cosmos DB account in the cloud:

* Currently Data Explorer in the emulator supports SQL API collections and MongoDB collections only. Table, Graph, and Cassandra APIs are not yet supported.  
* The Azure Cosmos DB Emulator supports only a single fixed account and a well-known master key.  Key regeneration is not possible in the Azure Cosmos DB Emulator.
* The Azure Cosmos DB Emulator is not a scalable service and will not support a large number of collections.
* The Azure Cosmos DB Emulator does not simulate different [Azure Cosmos DB consistency levels](consistency-levels.md).
* The Azure Cosmos DB Emulator does not simulate [multi-region replication](distribute-data-globally.md).
* The Azure Cosmos DB Emulator does not support the service quota overrides that are available in the Azure Cosmos DB service (for example, document size limits, increased partitioned collection storage).
* As your copy of the Azure Cosmos DB Emulator might not be up-to-date with the most recent changes with the Azure Cosmos DB service, you should use the [Azure Cosmos DB capacity planner](https://www.documentdb.com/capacityplanner) to accurately estimate the production throughput (RUs) needs of your application.

## System requirements
The Azure Cosmos DB Emulator has the following hardware and software requirements:

* Software requirements
  * Windows Server 2012 R2, Windows Server 2016, or Windows 10
*	Minimum Hardware requirements
  *	2-GB RAM
  *	10-GB available hard disk space

## Installation
You can download and install the Azure Cosmos DB Emulator from the [Microsoft Download Center](https://aka.ms/cosmosdb-emulator) or you can run the emulator on Docker for Windows. For instructions on using the emulator on Docker for Windows, see [Running on Docker](#running-on-docker). 

> [!NOTE]
> To install, configure, and run the Azure Cosmos DB Emulator, you must have administrative privileges on the computer.

## Running on Windows

To start the Azure Cosmos DB Emulator, select the Start button or press the Windows key. Begin typing **Azure Cosmos DB Emulator**, and select the emulator from the list of applications. 

![Select the Start button or press the Windows key, begin typing **Azure Cosmos DB Emulator**, and select the emulator from the list of applications](./media/local-emulator/database-local-emulator-start.png)

When the emulator is running, you'll see an icon in the Windows taskbar notification area. ![Azure Cosmos DB local emulator taskbar notification](./media/local-emulator/database-local-emulator-taskbar.png)

The Azure Cosmos DB Emulator by default runs on the local machine ("localhost") listening on port 8081.

The Azure Cosmos DB Emulator is installed to `C:\Program Files\Azure Cosmos DB Emulator` by default. You can also start and stop the emulator from the command-line. For more information, see the [command-line tool reference](#command-line).

## Start Data Explorer

When the Azure Cosmos DB Emulator launches, it automatically opens the Azure Cosmos DB Data Explorer in your browser. The address appears as [https://localhost:8081/_explorer/index.html](https://localhost:8081/_explorer/index.html). If you close the explorer and would like to reopen it later, you can either open the URL in your browser or launch it from the Azure Cosmos DB Emulator in the Windows Tray Icon as shown below.

![Azure Cosmos DB local emulator data explorer launcher](./media/local-emulator/database-local-emulator-data-explorer-launcher.png)

## Checking for updates
Data Explorer indicates if there is a new update available for download. 

> [!NOTE]
> Data created in one version of the Azure Cosmos DB Emulator is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it is recommended that you store that data in an Azure Cosmos DB account, rather than in the Azure Cosmos DB Emulator. 

## Authenticating requests
As with Azure Cosmos DB in the cloud, every request that you make against the Azure Cosmos DB Emulator must be authenticated. The Azure Cosmos DB Emulator supports a single fixed account and a well-known authentication key for master key authentication. This account and key are the only credentials permitted for use with the Azure Cosmos DB Emulator. They are:

    Account name: localhost:<port>
    Account key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==

> [!NOTE]
> The master key supported by the Azure Cosmos DB Emulator is intended for use only with the emulator. You cannot use your production Azure Cosmos DB account and key with the Azure Cosmos DB Emulator. 

> [!NOTE] 
> If you have started the emulator with the /Key option, then use the generated key instead of "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="

As with the Azure Cosmos DB service, the Azure Cosmos DB Emulator supports only secure communication via SSL.

## Running on a local network

You can run the emulator on a local network. To enable network access, specify the /AllowNetworkAccess option at the [command-line](#command-line-syntax), which also requires that you specify /Key=key_string or /KeyFile=file_name. You can use /GenKeyFile=file_name to generate a file with a random key upfront.  Then you can pass that to /KeyFile=file_name or /Key=contents_of_file.

To enable network access for the first time the user should shut down the emulator and delete the emulator’s data directory (C:\Users\user_name\AppData\Local\CosmosDBEmulator).

## Developing with the emulator
Once you have the Azure Cosmos DB Emulator running on your desktop, you can use any supported [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md) or the [Azure Cosmos DB REST API](/rest/api/cosmos-db/) to interact with the emulator. The Azure Cosmos DB Emulator also includes a built-in Data Explorer that lets you create collections for the SQL and MongoDB APIs, and view and edit documents without writing any code.   

    // Connect to the Azure Cosmos DB Emulator running locally
    DocumentClient client = new DocumentClient(
        new Uri("https://localhost:8081"), 
        "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==");

If you're using [Azure Cosmos DB protocol support for MongoDB](mongodb-introduction.md), use the following connection string:

    mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true

You can use existing tools like [Azure DocumentDB Studio](https://github.com/mingaliu/DocumentDBStudio) to connect to the Azure Cosmos DB Emulator. You can also migrate data between the Azure Cosmos DB Emulator and the Azure Cosmos DB service using the [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool).

> [!NOTE] 
> If you have started the emulator with the /Key option, then use the generated key instead of "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="

Using the Azure Cosmos DB Emulator, by default, you can create up to 25 single partition collections or 1 partitioned collection. For more information about changing this value, see [Setting the PartitionCount value](#set-partitioncount).

## Export the SSL certificate

.NET languages and runtime use the Windows Certificate Store to securely connect to the Azure Cosmos DB local emulator. Other languages have their own method of managing and using certificates. Java uses its own [certificate store](https://docs.oracle.com/cd/E19830-01/819-4712/ablqw/index.html) whereas Python uses [socket wrappers](https://docs.python.org/2/library/ssl.html).

In order to obtain a certificate to use with languages and runtimes that do not integrate with the Windows Certificate Store, you will need to export it using the Windows Certificate Manager. You can start it by running certlm.msc or follow the step by step instructions in [Export the Azure Cosmos DB Emulator Certificates](./local-emulator-export-ssl-certificates.md). Once the certificate manager is running, open the Personal Certificates as shown below and export the certificate with the friendly name "DocumentDBEmulatorCertificate" as a BASE-64 encoded X.509 (.cer) file.

![Azure Cosmos DB local emulator SSL certificate](./media/local-emulator/database-local-emulator-ssl_certificate.png)

The X.509 certificate can be imported into the Java certificate store by following the instructions in [Adding a Certificate to the Java CA Certificates Store](https://docs.microsoft.com/azure/java-add-certificate-ca-store). Once the certificate is imported into the certificate store, Java and MongoDB applications will be able to connect to the Azure Cosmos DB Emulator.

When connecting to the emulator from Python and Node.js SDKs, SSL verification is disabled.

## <a id="command-line"></a>Command-line tool reference
From the installation location, you can use the command line to start and stop the emulator, configure options, and perform other operations.

### Command-line syntax

    CosmosDB.Emulator.exe [/Shutdown] [/DataPath] [/Port] [/MongoPort] [/DirectPorts] [/Key] [/EnableRateLimiting] [/DisableRateLimiting] [/NoUI] [/NoExplorer] [/?]

To view the list of options, type `CosmosDB.Emulator.exe /?` at the command prompt.

<table>
<tr>
  <td><strong>Option</strong></td>
  <td><strong>Description</strong></td>
  <td><strong>Command</strong></td>
  <td><strong>Arguments</strong></td>
</tr>
<tr>
  <td>[No arguments]</td>
  <td>Starts up the Azure Cosmos DB Emulator with default settings.</td>
  <td>CosmosDB.Emulator.exe</td>
  <td></td>
</tr>
<tr>
  <td>[Help]</td>
  <td>Displays the list of supported command-line arguments.</td>
  <td>CosmosDB.Emulator.exe /?</td>
  <td></td>
</tr>
<tr>
  <td>GetStatus</td>
  <td>Gets the status of the Azure Cosmos DB Emulator. The status is indicated by the exit code: 1 = Starting, 2 = Running, 3 = Stopped. A negative exit code indicates that an error occurred. No other output is produced.</td>
  <td>CosmosDB.Emulator.exe /GetStatus</td>
  <td></td>
<tr>
  <td>Shutdown</td>
  <td>Shuts down the Azure Cosmos DB Emulator.</td>
  <td>CosmosDB.Emulator.exe /Shutdown</td>
  <td></td>
</tr>
<tr>
  <td>DataPath</td>
  <td>Specifies the path in which to store data files. Default is %LocalAppdata%\CosmosDBEmulator.</td>
  <td>CosmosDB.Emulator.exe /DataPath=&lt;datapath&gt;</td>
  <td>&lt;datapath&gt;: An accessible path</td>
</tr>
<tr>
  <td>Port</td>
  <td>Specifies the port number to use for the emulator.  Default is 8081.</td>
  <td>CosmosDB.Emulator.exe /Port=&lt;port&gt;</td>
  <td>&lt;port&gt;: Single port number</td>
</tr>
<tr>
  <td>MongoPort</td>
  <td>Specifies the port number to use for MongoDB compatibility API. Default is 10255.</td>
  <td>CosmosDB.Emulator.exe /MongoPort=&lt;mongoport&gt;</td>
  <td>&lt;mongoport&gt;: Single port number</td>
</tr>
<tr>
  <td>DirectPorts</td>
  <td>Specifies the ports to use for direct connectivity. Defaults are 10251,10252,10253,10254.</td>
  <td>CosmosDB.Emulator.exe /DirectPorts:&lt;directports&gt;</td>
  <td>&lt;directports&gt;: Comma-delimited list of 4 ports</td>
</tr>
<tr>
  <td>Key</td>
  <td>Authorization key for the emulator. Key must be the base-64 encoding of a 64-byte vector.</td>
  <td>CosmosDB.Emulator.exe /Key:&lt;key&gt;</td>
  <td>&lt;key&gt;: Key must be the base-64 encoding of a 64-byte vector</td>
</tr>
<tr>
  <td>EnableRateLimiting</td>
  <td>Specifies that request rate limiting behavior is enabled.</td>
  <td>CosmosDB.Emulator.exe /EnableRateLimiting</td>
  <td></td>
</tr>
<tr>
  <td>DisableRateLimiting</td>
  <td>Specifies that request rate limiting behavior is disabled.</td>
  <td>CosmosDB.Emulator.exe /DisableRateLimiting</td>
  <td></td>
</tr>
<tr>
  <td>NoUI</td>
  <td>Do not show the emulator user interface.</td>
  <td>CosmosDB.Emulator.exe /NoUI</td>
  <td></td>
</tr>
<tr>
  <td>NoExplorer</td>
  <td>Don't show data explorer on startup.</td>
  <td>CosmosDB.Emulator.exe /NoExplorer</td>
  <td></td>
</tr>
<tr>
  <td>PartitionCount</td>
  <td>Specifies the maximum number of partitioned collections. See [Change the number of collections](#set-partitioncount) for more information.</td>
  <td>CosmosDB.Emulator.exe /PartitionCount=&lt;partitioncount&gt;</td>
  <td>&lt;partitioncount&gt;: Maximum number of allowed single partition collections. Default is 25. Maximum allowed is 250.</td>
</tr>
<tr>
  <td>DefaultPartitionCount</td>
  <td>Specifies the default number of partitions for a partitioned collection.</td>
  <td>CosmosDB.Emulator.exe /DefaultPartitionCount=&lt;defaultpartitioncount&gt;</td>
  <td>&lt;defaultpartitioncount&gt; Default is 25.</td>
</tr>
<tr>
  <td>AllowNetworkAccess</td>
  <td>Enables access to the emulator over a network. You must also pass /Key=&lt;key_string&gt; or /KeyFile=&lt;file_name&gt; to enable network access.</td>
  <td>CosmosDB.Emulator.exe /AllowNetworkAccess /Key=&lt;key_string&gt;<br><br>or<br><br>CosmosDB.Emulator.exe /AllowNetworkAccess /KeyFile=&lt;file_name&gt;</td>
  <td></td>
</tr>
<tr>
  <td>NoFirewall</td>
  <td>Don't adjust firewall rules when /AllowNetworkAccess is used.</td>
  <td>CosmosDB.Emulator.exe /NoFirewall</td>
  <td></td>
</tr>
<tr>
  <td>GenKeyFile</td>
  <td>Generate a new authorization key and save to the specified file. The generated key can be used with the /Key or /KeyFile options.</td>
  <td>CosmosDB.Emulator.exe  /GenKeyFile=&lt;path to key file&gt;</td>
  <td></td>
</tr>
<tr>
  <td>Consistency</td>
  <td>Set the default consistency level for the account.</td>
  <td>CosmosDB.Emulator.exe /Consistency=&lt;consistency&gt;</td>
  <td>&lt;consistency&gt;: Value must be one of the following [consistency levels](consistency-levels.md): Session, Strong, Eventual, or BoundedStaleness.  The default value is Session.</td>
</tr>
<tr>
  <td>?</td>
  <td>Show the help message.</td>
  <td></td>
  <td></td>
</tr>
</table>

## <a id="set-partitioncount"></a>Change the number of collections

By default, you can create up to 25 single partition collections, or 1 partitioned collection using the Azure Cosmos DB emulator. By modifying the **PartitionCount** value, you can create up to 250 single partition collections or 10 partitioned collections, or any combination of the two that does not exceed 250 single partitions (where one partitioned collection = 25 single partition collection).

If you attempt to create a collection after the current partition count has been exceeded, the emulator throws a ServiceUnavailable exception, with the following message.

    Sorry, we are currently experiencing high demand in this region, 
    and cannot fulfill your request at this time. We work continuously 
    to bring more and more capacity online, and encourage you to try again. 
    Please do not hesitate to email askcosmosdb@microsoft.com at any time or
    for any reason. ActivityId: 29da65cc-fba1-45f9-b82c-bf01d78a1f91

To change the number of collections available to the Azure Cosmos DB Emulator, do the following:

1. Delete all local Azure Cosmos DB Emulator data by right-clicking the **Azure Cosmos DB Emulator** icon on the system tray, and then clicking **Reset Data…**.
2. Delete all emulator data in this folder C:\Users\user_name\AppData\Local\CosmosDBEmulator.
3. Exit all open instances by right-clicking the **Azure Cosmos DB Emulator** icon on the system tray, and then clicking **Exit**. It may take a minute for all instances to exit.
4. Install the latest version of the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator).
5. Launch the emulator with the PartitionCount flag by setting a value <= 250. For example: `C:\Program Files\Azure Cosmos DB Emulator> CosmosDB.Emulator.exe /PartitionCount=100`.

## Controlling the emulator

The emulator comes with a PowerShell module for starting, stopping, uninstalling, and retrieving the status of the service. To use it:

```powershell
Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"
```

or put the `PSModules` directory on your `PSModulesPath` and import it like this:

```powershell
$env:PSModulesPath += "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules"
Import-Module Microsoft.Azure.CosmosDB.Emulator
```

Here is a summary of the commands for controlling the emulator from PowerShell:

### `Get-CosmosDbEmulatorStatus`

#### Syntax

`Get-CosmosDbEmulatorStatus`

#### Remarks

Returns one of these ServiceControllerStatus values: ServiceControllerStatus.StartPending, ServiceControllerStatus.Running, or ServiceControllerStatus.Stopped.

### `Start-CosmosDbEmulator`

#### Syntax

`Start-CosmosDbEmulator [-DataPath <string>] [-DefaultPartitionCount <uint16>] [-DirectPort <uint16[]>] [-MongoPort <uint16>] [-NoUI] [-NoWait] [-PartitionCount <uint16>] [-Port <uint16>]  [<CommonParameters>]`

#### Remarks

Starts the emulator. By default, the command waits until the emulator is ready to accept requests. Use the -NoWait option, if you wish the cmdlet to return as soon as it starts the emulator.

### `Stop-CosmosDbEmulator`

#### Syntax

 `Stop-CosmosDbEmulator [-NoWait]`

#### Remarks

Stops the emulator. By default, this command waits until the emulator is fully shut down. Use the -NoWait option, if you wish the cmdlet to return as soon as the emulator begins to shut down.

### `Uninstall-CosmosDbEmulator`

#### Syntax

`Uninstall-CosmosDbEmulator [-RemoveData]`

#### Remarks

Uninstalls the emulator and optionally removes the full contents of $env:LOCALAPPDATA\CosmosDbEmulator.
The cmdlet ensures the emulator is stopped before uninstalling it.

## Running on Docker

The Azure Cosmos DB Emulator can be run on Docker for Windows. The emulator does not work on Docker for Oracle Linux.

Once you have [Docker for Windows](https://www.docker.com/docker-windows) installed, switch to Windows containers by right-clicking the Docker icon on the toolbar and selecting **Switch to Windows containers**.

Next, pull the emulator image from Docker Hub by running the following command from your favorite shell.

```     
docker pull microsoft/azure-cosmosdb-emulator 
```
To start the image, run the following commands.

From the command-line:
```cmd 
md %LOCALAPPDATA%\CosmosDBEmulatorCert 2>null
docker run -v %LOCALAPPDATA%\CosmosDBEmulatorCert:C:\CosmosDB.Emulator\CosmosDBEmulatorCert -P -t -i -m 2GB microsoft/azure-cosmosdb-emulator 
```

From PowerShell:
```powershell
md $env:LOCALAPPDATA\CosmosDBEmulatorCert 2>null
docker run -v $env:LOCALAPPDATA\CosmosDBEmulatorCert:C:\CosmosDB.Emulator\CosmosDBEmulatorCert -P -t -i -m 2GB microsoft/azure-cosmosdb-emulator 
```

The response looks similar to the following:

```
Starting emulator
Emulator Endpoint: https://172.20.229.193:8081/
Master Key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
Exporting SSL Certificate
You can import the SSL certificate from an administrator command prompt on the host by running:
cd /d %LOCALAPPDATA%\CosmosDBEmulatorCert
powershell .\importcert.ps1
--------------------------------------------------------------------------------------------------
Starting interactive shell
``` 

Now use the endpoint and master key-in from the response in your client and import the SSL certificate into your host. To import the SSL certificate, do the following from an admin command prompt:

From the command-line:
```cmd 
cd %LOCALAPPDATA%\CosmosDBEmulatorCert
powershell .\importcert.ps1
```

From PowerShell:
```powershell
cd $env:LOCALAPPDATA\CosmosDBEmulatorCert
.\importcert.ps1
```

Closing the interactive shell once the emulator has been started will shut down the emulator’s container.

To open the Data Explorer, navigate to the following URL in your browser. The emulator endpoint is provided in the response message shown above.

    https://<emulator endpoint provided in response>/_explorer/index.html


## Troubleshooting

Use the following tips to help troubleshoot issues you encounter with the Azure Cosmos DB Emulator:

- If you installed a new version of the emulator and are experiencing errors, ensure you reset your data. You can reset your data by right-clicking the Azure Cosmos DB Emulator icon on the system tray, and then clicking Reset Data…. If that does not fix the errors, you can uninstall and reinstall the app. See [Uninstall the local emulator](#uninstall) for instructions.

- If the Azure Cosmos DB Emulator crashes, collect dump files from c:\Users\user_name\AppData\Local\CrashDumps folder, compress them, and attach them to an email to [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com).

- If you experience crashes in CosmosDB.StartupEntryPoint.exe, run the following command from an admin command prompt:
`lodctr /R` 

- If you encounter a connectivity issue, [collect trace files](#trace-files), compress them, and attach them to an email to [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com).

- If you receive a **Service Unavailable** message, the emulator might be failing to initialize the network stack. Check to see if you have the Pulse secure client or Juniper networks client installed, as their network filter drivers may cause the problem. Uninstalling third-party network filter drivers typically fixes the issue.

- While the emulator is running, if your computer goes to sleep mode or runs any OS updates, you might see a **Service is currently unavailable** message. Reset the emulator, by right clicking on the icon that appears on the windows notification tray and select **Reset Data**.

### <a id="trace-files"></a>Collect trace files

To collect debugging traces, run the following commands from an administrative command prompt:

1. `cd /d "%ProgramFiles%\Azure Cosmos DB Emulator"`
2. `CosmosDB.Emulator.exe /shutdown`. Watch the system tray to make sure the program has shut down, it may take a minute. You can also just click **Exit** in the Azure Cosmos DB Emulator user interface.
3. `CosmosDB.Emulator.exe /starttraces`
4. `CosmosDB.Emulator.exe`
5. Reproduce the problem. If Data Explorer is not working, you only need to wait for the browser to open for a few seconds to catch the error.
5. `CosmosDB.Emulator.exe /stoptraces`
6. Navigate to `%ProgramFiles%\Azure Cosmos DB Emulator` and find the docdbemulator_000001.etl file.
7. Send the .etl file along with repro steps to [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com) for debugging.

### <a id="uninstall"></a>Uninstall the local emulator

1. Exit all open instances of the local emulator by right-clicking the Azure Cosmos DB Emulator icon on the system tray, and then clicking Exit. It may take a minute for all instances to exit.
2. In the Windows search box, type **Apps & features** and click on the **Apps & features (System settings)** result.
3. In the list of apps, scroll to **Azure Cosmos DB Emulator**, select it, click **Uninstall**, then confirm and click **Uninstall** again.
4. When the app is uninstalled, navigate to `C:\Users\<user>\AppData\Local\CosmosDBEmulator` and delete the folder. 

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Installed the local Emulator
> * Ran the Emulator on Docker for Windows
> * Authenticated requests
> * Used the Data Explorer in the Emulator
> * Exported SSL certificates
> * Called the Emulator from the command-line
> * Collected trace files

In this tutorial, you've learned how to use the local emulator for free local development. You can now proceed to the next tutorial and learn how to export emulator SSL certificates. 

> [!div class="nextstepaction"]
> [Export the Azure Cosmos DB Emulator certificates](local-emulator-export-ssl-certificates.md)
