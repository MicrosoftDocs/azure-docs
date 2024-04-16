---
title: Windows emulator command-line and PowerShell reference
titleSuffix: Azure Cosmos DB 
description: Manage the Azure Cosmos DB emulator with the command line or PowerShell and change the configuration of the emulator.   
author: sajeetharan
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: reference
ms.date: 09/11/2023
---

# Command-line and PowerShell reference for Windows (local) emulator

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

The Azure Cosmos DB emulator provides a local environment that emulates the Azure Cosmos DB service for local development purposes. After installing the emulator, you can control the emulator with command line and PowerShell commands. This article describes how to use the command-line and PowerShell commands to start and stop the emulator, configure options, and perform other operations. You have to run the commands from the installation location.

> [!IMPORTANT]
> This article only includes command-line arguments for the Windows local emulator.

## Manage the emulator with command-line syntax

```powershell
Microsoft.Azure.Cosmos.Emulator.exe 
    [/Shutdown] [/DataPath] [/Port] [/MongoPort] 
    [/DirectPorts] [/Key] [/EnableRateLimiting] 
    [/DisableRateLimiting] [/NoUI] [/NoExplorer] 
    [/EnableMongoDbEndpoint] 
    [/?]
```

To view the list of parameters, type `Microsoft.Azure.Cosmos.Emulator.exe /?` at the command prompt.

| Parameter | Description | Example Command |
| --- | --- | --- |
| *[No arguments]* | Starts up the emulator with default settings. | Microsoft.Azure.Cosmos.Emulator.exe|
| *[Help]* | Displays the list of supported command-line arguments.| `Microsoft.Azure.Cosmos.Emulator.exe /?` |
| `GetStatus` | Gets the status of the emulator. Each exit code indicates a status: `1` = **Starting**, `2` = **Running**, and `3` = **Stopped**. A negative exit code indicates that an error occurred. No other output is produced. | `Microsoft.Azure.Cosmos.Emulator.exe /GetStatus` |
| `Shutdown` | Shuts down the emulator. | `Microsoft.Azure.Cosmos.Emulator.exe /Shutdown` |
| `DataPath` | Specifies the path in which to store data files. The default value is `%LocalAppdata%\CosmosDBEmulator`. | `Microsoft.Azure.Cosmos.Emulator.exe /DataPath=E:\SomeDataFolder` |
| `Port` | Specifies the port number to use for the emulator. The default value is `8081`. | `Microsoft.Azure.Cosmos.Emulator.exe /Port=65000` |
| `ComputePort` | Specifies the port number to use for the compute interop gateway service. The gateway's HTTP endpoint probe port is calculated as `ComputePort + 79`. Hence, `ComputePort` and `ComputePort + 79` must be open and available. The default value is `8900`. | `Microsoft.Azure.Cosmos.Emulator.exe /ComputePort=65100` |
| `EnableMongoDbEndpoint=3.2` | Enables API for MongoDB version 3.2. | `Microsoft.Azure.Cosmos.Emulator.exe /EnableMongoDbEndpoint=3.2` |
| `EnableMongoDbEndpoint=3.6` | Enables API for MongoDB version 3.6. | `Microsoft.Azure.Cosmos.Emulator.exe /EnableMongoDbEndpoint=3.6` |
| `EnableMongoDbEndpoint=4.0` | Enables API for MongoDB version 4.0. | `Microsoft.Azure.Cosmos.Emulator.exe /EnableMongoDbEndpoint=4.0` |
| `MongoPort` | Specifies the port number to use for API for MongoDB. Default value is `10255`. | `Microsoft.Azure.Cosmos.Emulator.exe /MongoPort=65200` |
| `EnableCassandraEndpoint` | Enables API for Apache Cassandra. | `Microsoft.Azure.Cosmos.Emulator.exe /EnableCassandraEndpoint` |
| `CassandraPort` | Specifies the port number to use for the API for Cassandra endpoint. Default value is `10350`. | `Microsoft.Azure.Cosmos.Emulator.exe /CassandraPort=65300` |
| `EnableGremlinEndpoint` | Enables API for Apache Gremlin. | `Microsoft.Azure.Cosmos.Emulator.exe /EnableGremlinEndpoint` |
| `GremlinPort` | Port number to use for the API for Apache Gremlin Endpoint. Default value is `8901`. | `Microsoft.Azure.Cosmos.Emulator.exe /GremlinPort=65400` |
| `EnableTableEndpoint` | Enables API for Table. | `Microsoft.Azure.Cosmos.Emulator.exe /EnableTableEndpoint` |
| `TablePort` | Port number to use for the API for Table Endpoint. Default value is `8902`. | `Microsoft.Azure.Cosmos.Emulator.exe /TablePort=65500` |
| `KeyFile` | Read authorization key from the specified file. Use the `/GenKeyFile` option to generate a keyfile. | `Microsoft.Azure.Cosmos.Emulator.exe /KeyFile=D:\Keys\keyfile` |
| `ResetDataPath` | Recursively removes all the files in the specified path. If you don't specify a path, it defaults to `%LOCALAPPDATA%\CosmosDbEmulator`. | `Microsoft.Azure.Cosmos.Emulator.exe /ResetDataPath` |
| `StartTraces` | Start collecting debug trace logs using **LOGMAN**. | `Microsoft.Azure.Cosmos.Emulator.exe /StartTraces` |
| `StopTraces` | Stop collecting debug trace logs using **LOGMAN**. | `Microsoft.Azure.Cosmos.Emulator.exe /StopTraces` |
| `StartWprTraces` | Start collecting debug trace logs using **Windows Performance Recording** tool. | `Microsoft.Azure.Cosmos.Emulator.exe /StartWprTraces` |
| `StopWprTraces` | Stop collecting debug trace logs using **Windows Performance Recording** tool. | `Microsoft.Azure.Cosmos.Emulator.exe /StopWprTraces` |
| `FailOnSslCertificateNameMismatch` | By default the emulator regenerates its self-signed TLS/SSL certificate, if the certificate's SAN doesn't include the emulator host's domain name, local IP address ([v4](https://wikipedia.org/wiki/Internet_Protocol_version_4)), `localhost`, and `127.0.0.1`. With this option, the emulator instead fails at startup. You should then use the `/GenCert` option to create and install a new self-signed TLS/SSL certificate. | `Microsoft.Azure.Cosmos.Emulator.exe /FailOnSslCertificateNameMismatch` |
| `GenCert` | Generate and install a new self-signed TLS/SSL certificate. optionally including a comma-separated list of extra DNS names for accessing the emulator over the network. | `Microsoft.Azure.Cosmos.Emulator.exe /GenCert`  |
| `DirectPorts` | Specifies the ports to use for direct connectivity. Defaults are `10251`, `10252`, `10253`, and `10254`. | `Microsoft.Azure.Cosmos.Emulator.exe /DirectPorts:65600,65700` |
| `Key` | Authorization key for the emulator. Key must be the base-64 encoding of a 64-byte vector. | `Microsoft.Azure.Cosmos.Emulator.exe /Key:D67PoU0bcK/kgPKFHu4W+3SUY9LNcwcFLIUHnwrkA==` |
| `EnableRateLimiting` | Specifies that request rate limiting behavior is enabled. | `Microsoft.Azure.Cosmos.Emulator.exe /EnableRateLimiting` |
| `DisableRateLimiting` |Specifies that request rate limiting behavior is disabled. | `Microsoft.Azure.Cosmos.Emulator.exe /DisableRateLimiting` |
| `NoUI` | Don't show the emulator user interface. | `Microsoft.Azure.Cosmos.Emulator.exe /NoUI` |
| `NoExplorer` | Don't show data explorer on startup. | `Microsoft.Azure.Cosmos.Emulator.exe /NoExplorer` |
| `PartitionCount` | Specifies the maximum number of partitioned containers. For more information, see [change the number of containers](#change-the-number-of-default-containers). The default value is `25`. The maximum allowed is `250`. | `Microsoft.Azure.Cosmos.Emulator.exe /PartitionCount=15` |
| `DefaultPartitionCount` | Specifies the default number of partitions for a partitioned container. The default value is `25`. | `Microsoft.Azure.Cosmos.Emulator.exe /DefaultPartitionCount=50` |
| `AllowNetworkAccess` | Enables access to the emulator over a network. You must also pass `/Key=<key_string>` or /`KeyFile=<file_name>` to enable network access. | `Microsoft.Azure.Cosmos.Emulator.exe /AllowNetworkAccess /Key=D67PoU0bcK/kgPKFHu4W+3SUY9LNcwcFLIUHnwrkA==` |
| `NoFirewall` | Don't adjust firewall rules when `/AllowNetworkAccess` option is used. | `Microsoft.Azure.Cosmos.Emulator.exe /NoFirewall` |
| `GenKeyFile` | Generate a new authorization key and save to the specified file. The generated key can be used with the `/Key` or `/KeyFile` options. | `Microsoft.Azure.Cosmos.Emulator.exe /GenKeyFile=D:\Keys\keyfile` |
| `Consistency` | Set the default consistency level for the account. The default value is **Session**. | `Microsoft.Azure.Cosmos.Emulator.exe /Consistency=Strong` |
| `?` | Show the help message. | |

## Manage the emulator with PowerShell cmdlets

The emulator comes with a PowerShell module to start, stop, uninstall, and retrieve the status of the service. Run the following cmdlet to use the PowerShell module:

```powershell
Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"
```

or place the `PSModules` directory on your `PSModulePath` and import it as shown in the following command:

```powershell
$env:PSModulePath += ";$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules"
Import-Module Microsoft.Azure.CosmosDB.Emulator
```

Here's a summary of the commands for controlling the emulator from PowerShell:

### `Get-CosmosDbEmulatorStatus`

Gets the status of the emulator. Returns one of these `ServiceControllerStatus` values:

- `ServiceControllerStatus.StartPending`
- `ServiceControllerStatus.Running`
- `ServiceControllerStatus.Stopped`

If an error is encountered, no value is returned.

#### Syntax

```powershell
Get-CosmosDbEmulatorStatus 
    [[-AlternativeInstallLocation] <String>] 
    [<CommonParameters>]
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `AlternativeInstallLocation` | `String` | |

#### Examples

- Get the status of an emulator installed in the `D:\SomeFolder\AzureCosmosDBEmulator` folder.

    ```powershell
    @parameters = {
        AlternativeInstallLocation = "D:\SomeFolder\AzureCosmosDBEmulator"
    }
    Get-CosmosDbEmulatorStatus @parameters
    ```

### `Start-CosmosDbEmulator`

Starts the emulator on the local computer. By default, the command waits until the emulator is ready to accept requests. Use the `-NoWait` option, if you wish the cmdlet to return as soon as it starts the emulator. Use the parameters of `Start-CosmosDbEmulator` to specify options, such as the NoSQL port, direct port, and MongoDB port numbers.

#### Syntax

```powershell
Start-CosmosDbEmulator [-AllowNetworkAccess]
    [-AlternativeInstallLocation <String>] [-CassandraPort <UInt16>]
    [-ComputePort <UInt16>] [-Consistency <String>] [-Credential
    <PSCredential>] [-DataPath <String>] [-DefaultPartitionCount
    <UInt16>] [-DirectPort <UInt16[]>] [-EnableMongoDb]
    [-EnableCassandra] [-EnableGremlin] [-EnableTable]
    [-EnableSqlCompute] [-EnablePreview]
    [-FailOnSslCertificateNameMismatch] [-GremlinPort <UInt16>]
    [-TablePort <UInt16>] [-SqlComputePort <UInt16>] [-Key <String>]
    [-MongoPort <UInt16>] [-MongoApiVersion <String>] [-NoFirewall]
    [-NoTelemetry] [-NoUI] [-NoWait] [-PartitionCount <UInt16>] [-Port
    <UInt16>] [-SimulateRateLimiting] [-Timeout <UInt32>] [-Trace]
    [<CommonParameters>]
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `AllowNetworkAccess` | `SwitchParameter` | Allow access from all IP Addresses assigned to the emulator's host. You must also specify a value for Key or KeyFile to allow network access. |
| `AlternativeInstallLocation` | `String` | Alternative location path to the emulator executable. |
| `CassandraPort` | `UInt16` | Port number to use for the API for Cassandra. The default port is `10350`. |
| `ComputePort` | `UInt16` | Port to use for the compute interop gateway service. The gateway's HTTP endpoint probe port is calculated as `ComputePort + 79`. Hence, `ComputePort` and `ComputePort + 79` must be open and available. The default ports are `8900`, `8979`. |
| `Consistency` | `String` | Sets the default consistency level for the emulator to **Session**, **Strong**, **Eventual**, or **BoundedStaleness**. The default level is **Session.** |
| `Credential` | `PSCredential` | Specifies a user account that has permission to perform this action. Use a username, such as `User01` or `Domain01\User01`, or enter a [`PSCredential`](/dotnet/api/system.management.automation.pscredential) object, such as one from the [`Get-Credential`](/powershell/module/microsoft.powershell.security/get-credential/) cmdlet. By default, the cmdlet uses the credentials of the current user. |
| `DataPath` | `String` | Path to store data files. The default location for data files is `$env:LocalAppData\CosmosDbEmulator`. |
| `DefaultPartitionCount` | `UInt16` | The number of partitions to reserve per partitioned collection. The default is **25**, which is the same as default value of the total partition count. |
| `DirectPort` | `UInt16` | A list of four ports to use for direct connectivity to the emulator's backend. The default list is `10251`, `10252`, `10253`, and `10254`. |
| `EnableMongoDb` | `SwitchParameter` | Specifies that API for MongoDB endpoint is enabled. The default is **false**. |
| `EnableCassandra` | `SwitchParameter` | Specifies that API for Apache Cassandra endpoint is enabled. The default is **false**. |
| `EnableGremlin` | `SwitchParameter` | Specifies that API for Apache Gremlin endpoint is enabled. The default is **false**. |
| `EnableTable` | `SwitchParameter` | Specifies that API for Table endpoint is enabled. The default is **false**. |
| `EnableSqlCompute` | `SwitchParameter` | Specifies that API for NoSQL endpoint is enabled. The default is **false**. |
| `EnablePreview` | `SwitchParameter` | Enables emulator features that are in preview and not fully matured to be on by default. |
| `FailOnSslCertificateNameMismatch` | `SwitchParameter` | By default the emulator regenerates its self-signed TLS/SSL certificate, if the certificate's SAN doesn't include the emulator host's domain name, local IP address ([v4](https://wikipedia.org/wiki/Internet_Protocol_version_4)), `localhost`, and `127.0.0.1`. This option causes the emulator to fail at startup instead. You should then use the `New-CosmosDbEmulatorCertificate` option to create and install a new self-signed TLS/SSL certificate. |
| `GremlinPort` | `UInt16` | Port number to use for the API for Apache Gremlin. The default port number is `8901`. |
| `TablePort` | `UInt16` | Port number to use for the API for Table. The default port number is `8902`. |
| `SqlComputePort` | `UInt16` | Port number to use for the API for NoSQL. The default port number is `8903`. |
| `Key` | `String` | Authorization key for the emulator. This value must be the base 64 encoding of a 64-byte vector. |
| `MongoPort` | `UInt16` | Port number to use for the API for MongoDB. The default port number is `10250`. |
| `MongoApiVersion` | `String` | Specifies which version to use for the API for MongoDB. The default version is `4.0`. |
| `NoFirewall` | `SwitchParameter` | Specifies that no inbound port rules should be added to the emulator host's firewall. |
| `NoTelemetry` | `SwitchParameter` | Specifies that the cmdlet shouldn't collect data for the current emulator session. |
| `NoUI` | `SwitchParameter` | Specifies that the cmdlet shouldn't present the user interface or taskbar icon. |
| `NoWait` | `SwitchParameter` | Specifies that the cmdlet should return as soon as the emulator begins to start. By default the cmdlet waits until startup is complete and the emulator is ready to receive requests before returning. |
| `PartitionCount` | `UInt16` | The total number of partitions allocated by the emulator. |
| `Port` | `UInt16` | Port number for the emulator Gateway Service and Web UI. The default port number is `8081`. |
| `SimulateRateLimiting` | `SwitchParameter` | |
| `Timeout` | `UInt32` | |
| `Trace` | `SwitchParameter` | |

#### Examples

- Start the emulator and wait until it's fully started and ready to accept requests.

    ```powershell
    Start-CosmosDbEmulator
    ```

- Start the emulator with **5** partitions reserved for each partitioned collection. The total number of partitions is set to the default: **25**. Hence, the total number of partitioned collections that can be created is `5 = 25 partitions / 5 partitions/collection`. Each partitioned collection is capped at `50 GB = 5 partitions * 10 GB / partiton`.

    ```powershell
    @parameters = {
        DefaultPartitionCount = 5
    }
    Start-CosmosDbEmulator @parameters
    ```

- Starts the emulator with alternative port numbers.

    ```powershell
    @parameters = {
        Port = 443 
        MongoPort = 27017 
        DirectPort = 20001,20002,20003,20004
    }
    Start-CosmosDbEmulator @parameters
    ```

### `Stop-CosmosDbEmulator`

Stops the emulator. By default, this command waits until the emulator is fully shut down. Use the -NoWait option, if you wish the cmdlet to return as soon as the emulator begins to shut down.

#### Syntax

```powershell
Stop-CosmosDbEmulator 
    [[-AlternativeInstallLocation] <String>]
    [-NoWait] [[-Timeout] <UInt32>] [-Trace] 
    [<CommonParameters>]
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `AlternativeInstallLocation` | `String` | |
| `Timeout` | `UInt32` | |
| `NoWait` | `SwitchParameter` | Specifies that the cmdlet should return as soon as the shutdown begins. |
| `Trace` | `SwitchParameter` | |

#### Examples

```powershell
@parameters = {
    NoWait = $true
}
Stop-CosmosDbEmulator @parameters
```

### `Uninstall-CosmosDbEmulator`

Uninstalls the emulator and optionally removes the full contents of `$env:LOCALAPPDATA\CosmosDbEmulator`. The cmdlet ensures the emulator is stopped before uninstalling it.

#### Syntax

```powershell
Uninstall-CosmosDbEmulator 
    [-RemoveData] 
    [<CommonParameters>]
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `RemoveData` | `SwitchParameter` | Specifies that the cmdlet should delete all data after it removes the emulator. |

#### Examples

```powershell
@parameters = {
    RemoveData = $false
}
Uninstall-CosmosDbEmulator @parameters
```

## Change the number of default containers

By default, you can create up to 25 fixed size containers (only supported using Azure Cosmos DB SDKs), or 5 unlimited containers using the emulator. By modifying the **PartitionCount** value, you can create up to 250 fixed size containers or 50 unlimited containers, or any combination of the two that doesn't exceed 250 fixed size containers (where one unlimited container = 5 fixed size containers). However it's not recommended to set up the emulator to run with more than 200 fixed size containers. Because of the overhead that it adds to the disk IO operations, which result in unpredictable timeouts when using the endpoint APIs.

If you attempt to create a container after the current partition count has been exceeded, the emulator throws a ServiceUnavailable exception, with the following message.

```output
Sorry, we are currently experiencing high demand in this region, and cannot fulfill your request at this time. We work continuously to bring more and more capacity online, and encourage you to try again.
ActivityId: 12345678-1234-1234-1234-123456789abc
```

To change the number of containers available in the emulator, run the following steps:

1. Delete all local emulator data by right-clicking the **emulator** icon on the system tray, and then clicking **Reset Data…**.

1. Delete all emulator data in this folder `%LOCALAPPDATA%\CosmosDBEmulator`.

1. Exit all open instances by right-clicking the **emulator** icon on the system tray, and then clicking **Exit**. It may take a minute for all instances to exit.

1. Install the latest version of the [emulator](https://cosmosdbportalstorage.azureedge.net/emulator/2023_01_30_2.14.11-dfad83c1/azure-cosmosdb-emulator-2.14.11-dfad83c1.msi).

1. Launch the emulator with the PartitionCount flag by setting a value <= 250. For example: `C:\Program Files\emulator> Microsoft.Azure.Cosmos.Emulator.exe /PartitionCount=100`.

## Next steps

- [Learn more about the Azure Cosmos DB emulator](emulator.md)
- [Review the emulator's release notes](emulator-release-notes.md)
