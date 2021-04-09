---
title: Command-line and PowerShell reference for Azure Cosmos DB Emulator 
description: Learn the command-line parameters for Azure Cosmos DB Emulator, how to control the emulator with PowerShell, and how to change the number of containers that you can create within the emulator.   
ms.service: cosmos-db
ms.topic: how-to
author: markjbrown
ms.author: mjbrown
ms.date: 09/17/2020
ms.custom: contperf-fy21q1
---

# Command-line and PowerShell reference for Azure Cosmos DB Emulator
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

The Azure Cosmos DB Emulator provides a local environment that emulates the Azure Cosmos DB service for local development purposes. After [installing the emulator](local-emulator.md), you can control the emulator with command line and PowerShell commands. This article describes how to use the command-line and PowerShell commands to start and stop the emulator, configure options, and perform other operations. You have to run the commands from the installation location.

##  <a id="command-line"></a>Manage the emulator with command-line syntax

```cmd
Microsoft.Azure.Cosmos.Emulator.exe [/Shutdown] [/DataPath] [/Port] [/MongoPort] [/DirectPorts] [/Key] [/EnableRateLimiting] [/DisableRateLimiting] [/NoUI] [/NoExplorer] [/EnableMongoDbEndpoint] [/?]
```

To view the list of options, type `Microsoft.Azure.Cosmos.Emulator.exe /?` at the command prompt.

|**Option** | **Description** | **Command**| **Arguments**|
|---|---|---|---|
|[No arguments] | Starts up the Azure Cosmos DB Emulator with default settings. |Microsoft.Azure.Cosmos.Emulator.exe| |
|[Help] |Displays the list of supported command-line arguments.|Microsoft.Azure.Cosmos.Emulator.exe /? | |
| GetStatus |Gets the status of the Azure Cosmos DB Emulator. The status is indicated by the exit code: 1 = Starting, 2 = Running, 3 = Stopped. A negative exit code indicates that an error occurred. No other output is produced. | Microsoft.Azure.Cosmos.Emulator.exe /GetStatus| |
| Shutdown| Shuts down the Azure Cosmos DB Emulator.| Microsoft.Azure.Cosmos.Emulator.exe /Shutdown | |
|DataPath | Specifies the path in which to store data files. Default value is %LocalAppdata%\CosmosDBEmulator. | Microsoft.Azure.Cosmos.Emulator.exe /DataPath=\<datapath\> | \<datapath\>: An accessible path |
|Port | Specifies the port number to use for the emulator. Default value is 8081. |Microsoft.Azure.Cosmos.Emulator.exe /Port=\<port\> | \<port\>: Single port number |
| ComputePort | Specified the port number to use for the Compute Interop Gateway service. The Gateway's HTTP endpoint probe port is calculated as ComputePort + 79. Hence, ComputePort and ComputePort + 79 must be open and available. The default value is 8900. | Microsoft.Azure.Cosmos.Emulator.exe /ComputePort=\<computeport\> | \<computeport\>: Single port number |
| EnableMongoDbEndpoint=3.2 | Enables MongoDB API 3.2 | Microsoft.Azure.Cosmos.Emulator.exe /EnableMongoDbEndpoint=3.2 | |
| EnableMongoDbEndpoint=3.6 | Enables MongoDB API 3.6 | Microsoft.Azure.Cosmos.Emulator.exe /EnableMongoDbEndpoint=3.6 | |
| MongoPort | Specifies the port number to use for MongoDB compatibility API. Default value is 10255. |Microsoft.Azure.Cosmos.Emulator.exe /MongoPort=\<mongoport\>|\<mongoport\>: Single port number|
| EnableCassandraEndpoint | Enables Cassandra API | Microsoft.Azure.Cosmos.Emulator.exe /EnableCassandraEndpoint | |
| CassandraPort | Specifies the port number to use for the Cassandra endpoint. Default value is 10350. | Microsoft.Azure.Cosmos.Emulator.exe /CassandraPort=\<cassandraport\> | \<cassandraport\>: Single port number |
| EnableGremlinEndpoint | Enables Gremlin API | Microsoft.Azure.Cosmos.Emulator.exe /EnableGremlinEndpoint | |
| GremlinPort | Port number to use for the Gremlin Endpoint. Default value is 8901. | Microsoft.Azure.Cosmos.Emulator.exe /GremlinPort=\<port\> | \<port\>: Single port number |
|EnableTableEndpoint | Enables Azure Table API | Microsoft.Azure.Cosmos.Emulator.exe /EnableTableEndpoint | |
|TablePort | Port number to use for the Azure Table Endpoint. Default value is 8902. | Microsoft.Azure.Cosmos.Emulator.exe /TablePort=\<port\> | \<port\>: Single port number|
| KeyFile | Read authorization key from the specified file. Use the /GenKeyFile option to generate a keyfile | Microsoft.Azure.Cosmos.Emulator.exe /KeyFile=\<file_name\> | \<file_name\>: Path to the file |
| ResetDataPath | Recursively removes all the files in the specified path. If you don't specify a path, it defaults to %LOCALAPPDATA%\CosmosDbEmulator | Microsoft.Azure.Cosmos.Emulator.exe /ResetDataPath=\<path> | \<path\>: File path  |
| StartTraces  |  Start collecting debug trace logs using LOGMAN. | Microsoft.Azure.Cosmos.Emulator.exe /StartTraces | |
| StopTraces     | Stop collecting debug trace logs using LOGMAN. | Microsoft.Azure.Cosmos.Emulator.exe /StopTraces  | |
| StartWprTraces  |  Start collecting debug trace logs using Windows Performance Recording tool. | Microsoft.Azure.Cosmos.Emulator.exe /StartWprTraces | |
| StopWprTraces     | Stop collecting debug trace logs using Windows Performance Recording tool. | Microsoft.Azure.Cosmos.Emulator.exe /StopWprTraces  | |
|FailOnSslCertificateNameMismatch | By default the emulator regenerates its self-signed TLS/SSL certificate, if the certificate's SAN does not include the emulator host's domain name, local IPv4 address, 'localhost', and '127.0.0.1'. With this option, the emulator will fail at startup instead. You should then use the /GenCert option to create and install a new self-signed TLS/SSL certificate. | Microsoft.Azure.Cosmos.Emulator.exe /FailOnSslCertificateNameMismatch  | |
| GenCert | Generate and install a new self-signed TLS/SSL certificate. optionally including a comma-separated list of additional DNS names for accessing the emulator over the network. | Microsoft.Azure.Cosmos.Emulator.exe /GenCert=\<dns-names\> |\<dns-names\>: Optional comma-separated list of additional dns names  |
| DirectPorts |Specifies the ports to use for direct connectivity. Defaults are 10251,10252,10253,10254. | Microsoft.Azure.Cosmos.Emulator.exe /DirectPorts:\<directports\> | \<directports\>: Comma-delimited list of 4 ports |
| Key |Authorization key for the emulator. Key must be the base-64 encoding of a 64-byte vector. | Microsoft.Azure.Cosmos.Emulator.exe /Key:\<key\> | \<key\>: Key must be the base-64 encoding of a 64-byte vector|
| EnableRateLimiting | Specifies that request rate limiting behavior is enabled. |Microsoft.Azure.Cosmos.Emulator.exe /EnableRateLimiting | |
| DisableRateLimiting |Specifies that request rate limiting behavior is disabled. |Microsoft.Azure.Cosmos.Emulator.exe /DisableRateLimiting | |
| NoUI | Do not show the emulator user interface. | Microsoft.Azure.Cosmos.Emulator.exe /NoUI | |
| NoExplorer | Don't show data explorer on startup. |Microsoft.Azure.Cosmos.Emulator.exe /NoExplorer | | 
| PartitionCount | Specifies the maximum number of partitioned containers. See [Change the number of containers](#set-partitioncount) for more information. | Microsoft.Azure.Cosmos.Emulator.exe /PartitionCount=\<partitioncount\> | \<partitioncount\>: Maximum number of allowed single partition containers. Default value is 25. Maximum allowed is 250.|
| DefaultPartitionCount| Specifies the default number of partitions for a partitioned container. | Microsoft.Azure.Cosmos.Emulator.exe /DefaultPartitionCount=\<defaultpartitioncount\> | \<defaultpartitioncount\> Default value is 25.|
| AllowNetworkAccess | Enables access to the emulator over a network. You must also pass /Key=\<key_string\> or /KeyFile=\<file_name\> to enable network access. | Microsoft.Azure.Cosmos.Emulator.exe /AllowNetworkAccess /Key=\<key_string\> or  Microsoft.Azure.Cosmos.Emulator.exe /AllowNetworkAccess /KeyFile=\<file_name\>| |
| NoFirewall | Don't adjust firewall rules when /AllowNetworkAccess option is used. |Microsoft.Azure.Cosmos.Emulator.exe /NoFirewall | |
| GenKeyFile | Generate a new authorization key and save to the specified file. The generated key can be used with the /Key or /KeyFile options. | Microsoft.Azure.Cosmos.Emulator.exe /GenKeyFile=\<path to key file\> | |
| Consistency | Set the default consistency level for the account. | Microsoft.Azure.Cosmos.Emulator.exe /Consistency=\<consistency\> | \<consistency\>: Value must be one of the following [consistency levels](consistency-levels.md): Session, Strong, Eventual, or BoundedStaleness. The default value is Session. |
| ? | Show the help message.| | |

## Manage the emulator with PowerShell

The emulator comes with a PowerShell module to start, stop, uninstall, and retrieve the status of the service. Run the following cmdlet to use the PowerShell module:

```powershell
Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"
```

or place the `PSModules` directory on your `PSModulePath` and import it as shown in the following command:

```powershell
$env:PSModulePath += "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules"
Import-Module Microsoft.Azure.CosmosDB.Emulator
```

Here is a summary of the commands for controlling the emulator from PowerShell:

### `Get-CosmosDbEmulatorStatus`

**Syntax**

`Get-CosmosDbEmulatorStatus`

**Remarks**

Returns one of these ServiceControllerStatus values: ServiceControllerStatus.StartPending, ServiceControllerStatus.Running, or ServiceControllerStatus.Stopped.

### `Start-CosmosDbEmulator`

**Syntax**

`Start-CosmosDbEmulator [-DataPath <string>] [-DefaultPartitionCount <uint16>] [-DirectPort <uint16[]>] [-MongoPort <uint16>] [-NoUI] [-NoWait] [-PartitionCount <uint16>] [-Port <uint16>] [<CommonParameters>]`

**Remarks**

Starts the emulator. By default, the command waits until the emulator is ready to accept requests. Use the -NoWait option, if you wish the cmdlet to return as soon as it starts the emulator.

### `Stop-CosmosDbEmulator`

**Syntax**

 `Stop-CosmosDbEmulator [-NoWait]`

**Remarks**

Stops the emulator. By default, this command waits until the emulator is fully shut down. Use the -NoWait option, if you wish the cmdlet to return as soon as the emulator begins to shut down.

### `Uninstall-CosmosDbEmulator`

**Syntax**

`Uninstall-CosmosDbEmulator [-RemoveData]`

**Remarks**

Uninstalls the emulator and optionally removes the full contents of $env:LOCALAPPDATA\CosmosDbEmulator.
The cmdlet ensures the emulator is stopped before uninstalling it.

## <a id="set-partitioncount"></a>Change the number of default containers

By default, you can create up to 25 fixed size containers (only supported using Azure Cosmos DB SDKs), or 5 unlimited containers using the Azure Cosmos DB Emulator. By modifying the **PartitionCount** value, you can create up to 250 fixed size containers or 50 unlimited containers, or any combination of the two that does not exceed 250 fixed size containers (where one unlimited container = 5 fixed size containers). However it's not recommended to set up the emulator to run with more than 200 fixed size containers. Because of the overhead that it adds to the disk IO operations, which result in unpredictable timeouts when using the endpoint APIs.

If you attempt to create a container after the current partition count has been exceeded, the emulator throws a ServiceUnavailable exception, with the following message.

> Sorry, we are currently experiencing high demand in this region, and cannot fulfill your request at this time. We work continuously to bring more and more capacity online, and encourage you to try again.
> ActivityId: 12345678-1234-1234-1234-123456789abc

To change the number of containers available in the Azure Cosmos DB Emulator, run the following steps:

1. Delete all local Azure Cosmos DB Emulator data by right-clicking the **Azure Cosmos DB Emulator** icon on the system tray, and then clicking **Reset Data…**.

1. Delete all emulator data in this folder `%LOCALAPPDATA%\CosmosDBEmulator`.

1. Exit all open instances by right-clicking the **Azure Cosmos DB Emulator** icon on the system tray, and then clicking **Exit**. It may take a minute for all instances to exit.

1. Install the latest version of the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator).

1. Launch the emulator with the PartitionCount flag by setting a value <= 250. For example: `C:\Program Files\Azure Cosmos DB Emulator> Microsoft.Azure.Cosmos.Emulator.exe /PartitionCount=100`.
 
## Next steps

* [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js apps](local-emulator-export-ssl-certificates.md)
* [Debug issues with the emulator](troubleshoot-local-emulator.md)
