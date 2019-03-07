---
title: Develop locally with the Azure Cosmos Emulator
description: Using the Azure Cosmos Emulator, you can develop and test your application locally for free, without creating an Azure subscription.
ms.service: cosmos-db
ms.topic: tutorial
ms.date: 04/20/2018
author: deborahc
ms.author: dech

---
# Use the Azure Cosmos Emulator for local development and testing

|**Binaries**|[Download MSI](https://aka.ms/cosmosdb-emulator)|
|**Docker**|[Docker Hub](https://hub.docker.com/r/microsoft/azure-cosmosdb-emulator/)|
|**Docker source** | [GitHub](https://github.com/Azure/azure-cosmos-db-emulator-docker)|

The Azure Cosmos Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Using the Azure Cosmos Emulator, you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the Azure Cosmos Emulator, you can switch to using an Azure Cosmos account in the cloud.

At this time the Data Explorer in the emulator only fully supports clients for SQL API. The Data Explorer view and operations for Azure Cosmos DB APIs such as MongoDB, Table, Graph, and Cassandra APIs are not fully supported.

## How the emulator works

The Azure Cosmos Emulator provides a high-fidelity emulation of the Azure Cosmos DB service. It supports identical functionality as Azure Cosmos DB, including support for creating and querying JSON items, provisioning and scaling containers, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos Emulator, and deploy them to Azure at global scale by just making a single configuration change to the connection endpoint for Azure Cosmos DB.

While emulation of the Azure Cosmos DB service is faithful, the emulator's implementation is different than the service. For example, the emulator uses standard OS components such as the local file system for persistence, and the HTTPS protocol stack for connectivity. Functionality that relies on Azure infrastructure like global replication, single-digit millisecond latency for reads/writes, and tunable consistency levels are not applicable.

## Differences between the emulator and the service

Because the Azure Cosmos Emulator provides an emulated environment running on a local developer workstation, there are some differences in functionality between the emulator and an Azure Cosmos account in the cloud:

* Currently Data Explorer in the emulator supports clients for SQL API. The Data Explorer view and operations for Azure Cosmos DB APIs such as MongoDB, Table, Graph, and Cassandra APIs are not fully supported.
* The Azure Cosmos Emulator supports only a single fixed account and a well-known master key. Key regeneration is not possible in the Azure Cosmos Emulator, however the default key can be changed using the command line option.
* The Azure Cosmos Emulator is not a scalable service and will not support a large number of containers.
* The Azure Cosmos Emulator does not simulate different [Azure Cosmos DB consistency levels](consistency-levels.md).
* The Azure Cosmos Emulator does not simulate [multi-region replication](distribute-data-globally.md).
* As your copy of the Azure Cosmos Emulator might not be up-to-date with the most recent changes with the Azure Cosmos DB, you should use the [Azure Cosmos DB capacity planner](https://www.documentdb.com/capacityplanner) to accurately estimate the production throughput (RUs) needs of your application.

## System requirements

The Azure Cosmos Emulator has the following hardware and software requirements:

* Software requirements
  * Windows Server 2012 R2, Windows Server 2016, or Windows 10
  * 64-bit operating system
* Minimum Hardware requirements
  * 2-GB RAM
  * 10-GB available hard disk space

## Installation

You can download and install the Azure Cosmos Emulator from the [Microsoft Download Center](https://aka.ms/cosmosdb-emulator) or you can run the emulator on Docker for Windows. For instructions on using the emulator on Docker for Windows, see [Running on Docker](#running-on-docker).

> [!NOTE]
> To install, configure, and run the Azure Cosmos Emulator, you must have administrative privileges on the computer. The emulator will create/add a certificate and also set the firewall rules in order to run its services; therefore it's necessary for the emulator to be able to execute such operations.

## Running on Windows

To start the Azure Cosmos Emulator, select the Start button or press the Windows key. Begin typing **Azure Cosmos Emulator**, and select the emulator from the list of applications.

![Select the Start button or press the Windows key, begin typing **Azure Cosmos Emulator**, and select the emulator from the list of applications](./media/local-emulator/database-local-emulator-start.png)

When the emulator is running, you'll see an icon in the Windows taskbar notification area. ![Azure Cosmos DB local emulator taskbar notification](./media/local-emulator/database-local-emulator-taskbar.png)

The Azure Cosmos Emulator by default runs on the local machine ("localhost") listening on port 8081.

The Azure Cosmos Emulator is installed to `C:\Program Files\Azure Cosmos DB Emulator` by default. You can also start and stop the emulator from the command-line. For more information, see the [command-line tool reference](#command-line).

## Start Data Explorer

When the Azure Cosmos  Emulator launches, it automatically opens the Azure Cosmos Data Explorer in your browser. The address appears as [https://localhost:8081/_explorer/index.html](https://localhost:8081/_explorer/index.html). If you close the explorer and would like to reopen it later, you can either open the URL in your browser or launch it from the Azure Cosmos Emulator in the Windows Tray Icon as shown below.

![Azure Cosmos local emulator data explorer launcher](./media/local-emulator/database-local-emulator-data-explorer-launcher.png)

## Checking for updates

Data Explorer indicates if there is a new update available for download.

> [!NOTE]
> Data created in one version of the Azure Cosmos Emulator (see %LOCALAPPDATA%\CosmosDBEmulator or data path optional settings) is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it is recommended that you store that data in an Azure Cosmos account, rather than in the Azure Cosmos Emulator.

## Authenticating requests

As with Azure Cosmos DB in the cloud, every request that you make against the Azure Cosmos Emulator must be authenticated. The Azure Cosmos Emulator supports a single fixed account and a well-known authentication key for master key authentication. This account and key are the only credentials permitted for use with the Azure Cosmos  Emulator. They are:

    Account name: localhost:<port>
    Account key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==

> [!NOTE]
> The master key supported by the Azure Cosmos Emulator is intended for use only with the emulator. You cannot use your production Azure Cosmos DB account and key with the Azure Cosmos Emulator.

> [!NOTE]
> If you have started the emulator with the /Key option, then use the generated key instead of "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==". For more information about /Key option, see [Command-line tool reference.](#command-line-syntax)

As with the Azure Cosmos DB, the Azure Cosmos Emulator supports only secure communication via SSL.

## Running on a local network

You can run the emulator on a local network. To enable network access, specify the /AllowNetworkAccess option at the [command-line](#command-line-syntax), which also requires that you specify /Key=key_string or /KeyFile=file_name. You can use /GenKeyFile=file_name to generate a file with a random key upfront. Then you can pass that to /KeyFile=file_name or /Key=contents_of_file.

To enable network access for the first time the user should shut down the emulator and delete the emulator’s data directory (%LOCALAPPDATA%\CosmosDBEmulator).

## Developing with the emulator

Once you have the Azure Cosmos Emulator running on your desktop, you can use any supported [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md) or the [Azure Cosmos DB REST API](/rest/api/cosmos-db/) to interact with the emulator. The Azure Cosmos Emulator also includes a built-in Data Explorer that lets you create containers for SQL API or Cosmos DB for Mongo DB API, and view and edit items without writing any code.

```csharp
    // Connect to the Azure Cosmos Emulator running locally
    DocumentClient client = new DocumentClient(
        new Uri("https://localhost:8081"),
        "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==");

```

If you're using [Azure Cosmos DB wire protocol support for MongoDB](mongodb-introduction.md), use the following connection string:

```
    mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true
```

You can also migrate data between the Azure Cosmos Emulator and the Azure Cosmos DB service using the [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool).

Using the Azure Cosmos Emulator, by default, you can create up to 25 single partition containers (only supported using Azure Cosmos SDKs) or 5 partitioned containers. For more information about changing this value, see [Setting the PartitionCount value](#set-partitioncount).

## Export the SSL certificate

.NET languages and runtime use the Windows Certificate Store to securely connect to the Azure Cosmos DB local emulator. Other languages have their own method of managing and using certificates. Java uses its own [certificate store](https://docs.oracle.com/cd/E19830-01/819-4712/ablqw/index.html) whereas Python uses [socket wrappers](https://docs.python.org/2/library/ssl.html).

In order to obtain a certificate to use with languages and runtimes that do not integrate with the Windows Certificate Store, you will need to export it using the Windows Certificate Manager. You can start it by running certlm.msc or follow the step by step instructions in [Export the Azure Cosmos Emulator Certificates](./local-emulator-export-ssl-certificates.md). Once the certificate manager is running, open the Personal Certificates as shown below and export the certificate with the friendly name "DocumentDBEmulatorCertificate" as a BASE-64 encoded X.509 (.cer) file.

![Azure Cosmos DB local emulator SSL certificate](./media/local-emulator/database-local-emulator-ssl_certificate.png)

The X.509 certificate can be imported into the Java certificate store by following the instructions in [Adding a Certificate to the Java CA Certificates Store](https://docs.microsoft.com/azure/java-add-certificate-ca-store). Once the certificate is imported into the certificate store, clients for SQL and Azure Cosmos DB's API for MongoDB will be able to connect to the Azure Cosmos Emulator.

When connecting to the emulator from Python and Node.js SDKs, SSL verification is disabled.

## <a id="command-line"></a>Command-line tool reference
From the installation location, you can use the command line to start and stop the emulator, configure options, and perform other operations.

### Command-line syntax

    CosmosDB.Emulator.exe [/Shutdown] [/DataPath] [/Port] [/MongoPort] [/DirectPorts] [/Key] [/EnableRateLimiting] [/DisableRateLimiting] [/NoUI] [/NoExplorer] [/?]

To view the list of options, type `CosmosDB.Emulator.exe /?` at the command prompt.

|**Option** | **Description** | **Command**| **Arguments**|
|---|---|---|---|
|[No arguments] | Starts up the Azure Cosmos Emulator with default settings. |CosmosDB.Emulator.exe| |
|[Help] |Displays the list of supported command-line arguments.|CosmosDB.Emulator.exe /? | |
| GetStatus |Gets the status of the Azure Cosmos Emulator. The status is indicated by the exit code: 1 = Starting, 2 = Running, 3 = Stopped. A negative exit code indicates that an error occurred. No other output is produced. | CosmosDB.Emulator.exe /GetStatus| |
| Shutdown| Shuts down the Azure Cosmos Emulator.| CosmosDB.Emulator.exe /Shutdown | |
|DataPath | Specifies the path in which to store data files. Default is %LocalAppdata%\CosmosDBEmulator. | CosmosDB.Emulator.exe /DataPath=\<datapath\> | \<datapath\>: An accessible path |
|Port | Specifies the port number to use for the emulator. Default is 8081. |CosmosDB.Emulator.exe /Port=\<port\> | \<port\>: Single port number |
| MongoPort | Specifies the port number to use for MongoDB compatibility API. Default is 10255. |CosmosDB.Emulator.exe /MongoPort= \<mongoport\>|\<mongoport\>: Single port number|
| DirectPorts |Specifies the ports to use for direct connectivity. Defaults are 10251,10252,10253,10254. | CosmosDB.Emulator.exe /DirectPorts:\<directports\> | \<directports\>: Comma-delimited list of 4 ports |
| Key |Authorization key for the emulator. Key must be the base-64 encoding of a 64-byte vector. | CosmosDB.Emulator.exe /Key:\<key\> | \<key\>: Key must be the base-64 encoding of a 64-byte vector|
| EnableRateLimiting | Specifies that request rate limiting behavior is enabled. |CosmosDB.Emulator.exe /EnableRateLimiting | |
| DisableRateLimiting |Specifies that request rate limiting behavior is disabled. |CosmosDB.Emulator.exe /DisableRateLimiting | |
| NoUI | Do not show the emulator user interface. | CosmosDB.Emulator.exe /NoUI | |
| NoExplorer | Don't show data explorer on startup. |CosmosDB.Emulator.exe /NoExplorer | | 
| PartitionCount | Specifies the maximum number of partitioned containers. See [Change the number of containers](#set-partitioncount) for more information. | CosmosDB.Emulator.exe /PartitionCount=\<partitioncount\> | \<partitioncount\>: Maximum number of allowed single partition containers. Default is 25. Maximum allowed is 250.|
| DefaultPartitionCount| Specifies the default number of partitions for a partitioned container. | CosmosDB.Emulator.exe /DefaultPartitionCount=\<defaultpartitioncount\> | \<defaultpartitioncount\> Default is 25.|
| AllowNetworkAccess | Enables access to the emulator over a network. You must also pass /Key=\<key_string\> or /KeyFile=\<file_name\> to enable network access. | CosmosDB.Emulator.exe /AllowNetworkAccess /Key=\<key_string\> or  CosmosDB.Emulator.exe /AllowNetworkAccess /KeyFile=\<file_name\>| |
| NoFirewall | Don't adjust firewall rules when /AllowNetworkAccess is used. |CosmosDB.Emulator.exe /NoFirewall | |
| GenKeyFile | Generate a new authorization key and save to the specified file. The generated key can be used with the /Key or /KeyFile options. | CosmosDB.Emulator.exe /GenKeyFile=\<path to key file\> | |
| Consistency | Set the default consistency level for the account. | CosmosDB.Emulator.exe /Consistency=\<consistency\> | \<consistency\>: Value must be one of the following [consistency levels](consistency-levels.md): Session, Strong, Eventual, or BoundedStaleness. The default value is Session. |
| ? | Show the help message.| | |

## <a id="set-partitioncount"></a>Change the number of containers

By default, you can create up to 25 single partition containers, or 5 partitioned containers using the Azure Cosmos Emulator. By modifying the **PartitionCount** value, you can create up to 250 single partition containers or 50 partitioned containers, or any combination of the two that does not exceed 250 single partitions (where one partitioned container = 5 single partition container). However it's not recommended to setup the emulator to run with more than 200 single partition containers. Because of the overhead that it adds to the disk IO operations, which result in unpredictable timeouts when using the endpoint APIs. 

If you attempt to create a container after the current partition count has been exceeded, the emulator throws a ServiceUnavailable exception, with the following message.

```
    Sorry, we are currently experiencing high demand in this region,
    and cannot fulfill your request at this time. We work continuously
    to bring more and more capacity online, and encourage you to try again.
    Please do not hesitate to email askcosmosdb@microsoft.com at any time or
    for any reason. ActivityId: 12345678-1234-1234-1234-123456789abc
```

To change the number of container available to the Azure Cosmos Emulator, do the following:

1. Delete all local Azure Cosmos Emulator data by right-clicking the **Azure Cosmos DB Emulator** icon on the system tray, and then clicking **Reset Data…**.
2. Delete all emulator data in this folder C:\Users\user_name\AppData\Local\CosmosDBEmulator.
3. Exit all open instances by right-clicking the **Azure Cosmos DB Emulator** icon on the system tray, and then clicking **Exit**. It may take a minute for all instances to exit.
4. Install the latest version of the [Azure Cosmos Emulator](https://aka.ms/cosmosdb-emulator).
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

`Start-CosmosDbEmulator [-DataPath <string>] [-DefaultPartitionCount <uint16>] [-DirectPort <uint16[]>] [-MongoPort <uint16>] [-NoUI] [-NoWait] [-PartitionCount <uint16>] [-Port <uint16>] [<CommonParameters>]`

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

The Azure Cosmos Emulator can be run on Docker for Windows. The emulator does not work on Docker for Oracle Linux.

Once you have [Docker for Windows](https://www.docker.com/docker-windows) installed, switch to Windows containers by right-clicking the Docker icon on the toolbar and selecting **Switch to Windows containers**.

Next, pull the emulator image from Docker Hub by running the following command from your favorite shell.

```
docker pull microsoft/azure-cosmosdb-emulator
```
To start the image, run the following commands.

From the command-line:
```cmd

md %LOCALAPPDATA%\CosmosDBEmulator\bind-mount

docker run --name azure-cosmosdb-emulator --memory 2GB --mount "type=bind,source=%LOCALAPPDATA%\CosmosDBEmulator\bind-mount,destination=C:\CosmosDB.Emulator\bind-mount" --interactive --tty -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10256:10256 -p 10350:10350 microsoft/azure-cosmosdb-emulator
```

From PowerShell:
```powershell

md $env:LOCALAPPDATA\CosmosDBEmulator\bind-mount 2>null

docker run --name azure-cosmosdb-emulator --memory 2GB --mount "type=bind,source=$env:LOCALAPPDATA\CosmosDBEmulator\bind-mount,destination=C:\CosmosDB.Emulator\bind-mount" --interactive --tty -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10256:10256 -p 10350:10350 microsoft/azure-cosmosdb-emulator

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
cd  %LOCALAPPDATA%\CosmosDBEmulator\bind-mount
powershell .\importcert.ps1
```

From PowerShell:
```powershell
cd $env:LOCALAPPDATA\CosmosDBEmulator\bind-mount
.\importcert.ps1
```

Closing the interactive shell once the emulator has been started will shut down the emulator’s container.

To open the Data Explorer, navigate to the following URL in your browser. The emulator endpoint is provided in the response message shown above.

    https://<emulator endpoint provided in response>/_explorer/index.html


## Troubleshooting

Use the following tips to help troubleshoot issues you encounter with the Azure Cosmos Emulator:

- If you installed a new version of the emulator and are experiencing errors, ensure you reset your data. You can reset your data by right-clicking the Azure Cosmos Emulator icon on the system tray, and then clicking Reset Data…. If that does not fix the errors, you can uninstall the emulator and any older versions of the emulator if found, remove "C:\Program files\Azure Cosmos DB Emulator" directory and reinstall the emulator. See [Uninstall the local emulator](#uninstall) for instructions.

- If the Azure Cosmos Emulator crashes, collect dump files from c:\Users\user_name\AppData\Local\CrashDumps folder, compress them, and attach them to an email to [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com).

- If you experience crashes in `Microsoft.Azure.Cosmos.ComputeServiceStartupEntryPoint.exe`, this might be a sympton where the Performance Counters are in a corrupted state. Usually running the following command from an admin command prompt fixes the issue:

  ```cmd
  lodctr /R
   ```

- If you encounter a connectivity issue, [collect trace files](#trace-files), compress them, and attach them to an email to [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com).

- If you receive a **Service Unavailable** message, the emulator might be failing to initialize the network stack. Check to see if you have the Pulse secure client or Juniper networks client installed, as their network filter drivers may cause the problem. Uninstalling third-party network filter drivers typically fixes the issue. Alternatively, start the emulator with /DisableRIO, which will switch the emulator network communication to regular winsocket. 

- While the emulator is running, if your computer goes to sleep mode or runs any OS updates, you might see a **Service is currently unavailable** message. Reset the emulator's data, by right clicking on the icon that appears on the windows notification tray and select **Reset Data**.

### <a id="trace-files"></a>Collect trace files

To collect debugging traces, run the following commands from an administrative command prompt:

1. `cd /d "%ProgramFiles%\Azure Cosmos DB Emulator"`
2. `CosmosDB.Emulator.exe /shutdown`. Watch the system tray to make sure the program has shut down, it may take a minute. You can also just click **Exit** in the Azure Cosmos Emulator user interface.
3. `CosmosDB.Emulator.exe /starttraces`
4. `CosmosDB.Emulator.exe`
5. Reproduce the problem. If Data Explorer is not working, you only need to wait for the browser to open for a few seconds to catch the error.
5. `CosmosDB.Emulator.exe /stoptraces`
6. Navigate to `%ProgramFiles%\Azure Cosmos DB Emulator` and find the docdbemulator_000001.etl file.
7. Send the .etl file along with repro steps to [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com) for debugging.

### <a id="uninstall"></a>Uninstall the local emulator

1. Exit all open instances of the local emulator by right-clicking the Azure Cosmos Emulator icon on the system tray, and then clicking Exit. It may take a minute for all instances to exit.
2. In the Windows search box, type **Apps & features** and click on the **Apps & features (System settings)** result.
3. In the list of apps, scroll to **Azure Cosmos DB Emulator**, select it, click **Uninstall**, then confirm and click **Uninstall** again.
4. When the app is uninstalled, navigate to `C:\Users\<user>\AppData\Local\CosmosDBEmulator` and delete the folder.

## Next steps

In this tutorial, you've learned how to use the local emulator for free local development. You can now proceed to the next tutorial and learn how to export emulator SSL certificates.

> [!div class="nextstepaction"]
> [Export the Azure Cosmos Emulator certificates](local-emulator-export-ssl-certificates.md)
