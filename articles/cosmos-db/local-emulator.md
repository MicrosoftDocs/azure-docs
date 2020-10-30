---
title: Install and develop locally with Azure Cosmos DB emulator
description: Learn how to install and use the Azure Cosmos DB emulator on Windows, Linux, macOS, and Windows docker environments. Using the emulator you can develop and test your application locally for free, without creating an Azure subscription.
ms.service: cosmos-db
ms.topic: how-to
author: markjbrown
ms.author: mjbrown
ms.date: 09/22/2020
ms.custom: devx-track-csharp, contperfq1
---

# Install and use the Azure Cosmos emulator for local development and testing
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

The Azure Cosmos emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Using the Azure Cosmos emulator, you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the Azure Cosmos emulator, you can switch to using an Azure Cosmos account in the cloud. This article describes how to install and use the emulator on Windows, Linux, macOS, and Windows docker environments.

## Download the emulator

To get started, download and install the latest version of Azure Cosmos emulator on your local computer. The [emulator release notes](local-emulator-release-notes.md) article lists all the available versions and the feature updates that were made in each release.

:::image type="icon" source="media/local-emulator/download-icon.png" border="false":::**[Download the Azure Cosmos emulator](https://aka.ms/cosmosdb-emulator)**

You can develop applications using Azure Cosmos emulator with the [SQL](local-emulator.md#sql-api), [Cassandra](local-emulator.md#cassandra-api), [MongoDB](local-emulator.md#azure-cosmos-dbs-api-for-mongodb), [Gremlin](local-emulator.md#gremlin-api), and [Table](local-emulator.md#table-api) API accounts. Currently the data explorer in the emulator fully supports viewing SQL data only; the data created using MongoDB, Gremlin/Graph and Cassandra client applications it is not viewable at this time. To learn more, see [how to connect to the emulator endpoint](#connect-with-emulator-apis) from different APIs.

## How does the emulator work?

The Azure Cosmos emulator provides a high-fidelity emulation of the Azure Cosmos DB service. It supports equivalent functionality as the Azure Cosmos DB, which includes creating data, querying data, provisioning and scaling containers, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos emulator, and deploy them to Azure at global scale by updating the Azure Cosmos DB connection endpoint.

While emulation of the Azure Cosmos DB service is faithful, the emulator's implementation is different than the service. For example, the emulator uses standard OS components such as the local file system for persistence, and the HTTPS protocol stack for connectivity. Functionality that relies on the Azure infrastructure like global replication, single-digit millisecond latency for reads/writes, and tunable consistency levels are not applicable when you use the emulator.

You can migrate data between the Azure Cosmos emulator and the Azure Cosmos DB service by using the [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool).

## Differences between the emulator and the cloud service

Because the Azure Cosmos emulator provides an emulated environment that runs on the local developer workstation, there are some differences in functionality between the emulator and an Azure Cosmos account in the cloud:

* Currently the **Data Explorer** pane in the emulator fully supports SQL API clients only. The **Data Explorer** view and operations for Azure Cosmos DB APIs such as MongoDB, Table, Graph, and Cassandra APIs are not fully supported.

* The emulator supports only a single fixed account and a well-known primary key. You can't regenerate key when using the Azure Cosmos emulator, however you can change the default key by using the [command-line](emulator-command-line-parameters.md) option.

* With the emulator, you can create an Azure Cosmos account in [provisioned throughput](set-throughput.md) mode only; currently it doesn't support [serverless](serverless.md) mode.

* The emulator is not a scalable service and it doesn't support a large number of containers. When using the Azure Cosmos emulator, by default, you can create up to 25 fixed size containers at 400 RU/s (only supported using Azure Cosmos DB SDKs), or 5 unlimited containers. For more information on how to change this value, see [Set the PartitionCount value](emulator-command-line-parameters.md#set-partitioncount) article.

* The emulator does not offer different [Azure Cosmos DB consistency levels](consistency-levels.md) like the cloud service does.

* The emulator does not offer [multi-region replication](distribute-data-globally.md).

* Because the copy of your Azure Cosmos emulator might not always be up to date with the most recent changes in the Azure Cosmos DB service, you should always refer to the [Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md) to accurately estimate the throughput (RUs) needs of your application.

* The emulator supports a maximum ID property size of 254 characters.

## Install the emulator

Before you install the emulator, make sure you have the following hardware and software requirements:

* Software requirements:
  * Currently Windows Server 2012 R2, Windows Server 2016, 2019 or Windows 8, 10 host OS are supported. The host OS with Active Directory enabled is currently not supported.
  * 64-bit operating system

* Minimum hardware requirements:
  * 2-GB RAM
  * 10-GB available hard disk space

* To install, configure, and run the Azure Cosmos emulator, you must have administrative privileges on the computer. The emulator will add a certificate and also set the firewall rules in order to run its services. Therefore admin rights are necessary for the emulator to be able to execute such operations.

To get started, download and install the latest version of [Azure Cosmos emulator](https://aka.ms/cosmosdb-emulator) on your local computer. If you run into any issues when installing the emulator, see the [emulator troubleshooting](troubleshoot-local-emulator.md) article to debug.

Depending upon your system requirements, you can run the emulator on [Windows](#run-on-windows), [Docker for Windows](#run-on-windows-docker), [Linux, or macOS](#run-on-linux-macos) as described in next sections of this article.

## Check for emulator updates

Each version of emulator comes with a set of feature updates or bug fixes. To see the available versions, read the [emulator release notes](local-emulator-release-notes.md) article.

After installation, if you have used the default settings, the data corresponding to the emulator is saved at %LOCALAPPDATA%\CosmosDBEmulator location. You can configure a different location by using the optional data path settings; that is the `/DataPath=PREFERRED_LOCATION` as the [command-line parameter](emulator-command-line-parameters.md). The data created in one version of the Azure Cosmos emulator is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it is recommended that you store that data in an Azure Cosmos account, instead of the Azure Cosmos emulator.

## <a id="run-on-windows"></a>Use the emulator on Windows

The Azure Cosmos emulator is installed at `C:\Program Files\Azure Cosmos DB Emulator` location by default. To start the Azure Cosmos emulator on Windows, select the **Start** button or press the Windows key. Begin typing **Azure Cosmos Emulator**, and select the emulator from the list of applications.

:::image type="content" source="./media/local-emulator/database-local-emulator-start.png" alt-text="Select the Start button or press the Windows key, begin typing Azure Cosmos emulator, and select the emulator from the list of applications":::

When the emulator has started, you'll see an icon in the Windows taskbar notification area. It automatically opens the Azure Cosmos data explorer in your browser at this URL `https://localhost:8081/_explorer/index.html` URL.

:::image type="content" source="./media/local-emulator/database-local-emulator-taskbar.png" alt-text="Azure Cosmos DB local emulator task bar notification":::

You can also start and stop the emulator from the command-line or PowerShell commands. For more information, see the [command-line tool reference](emulator-command-line-parameters.md) article.

The Azure Cosmos emulator by default runs on the local machine ("localhost") listening on port 8081. The address appears as `https://localhost:8081/_explorer/index.html`. If you close the explorer and would like to reopen it later, you can either open the URL in your browser or launch it from the Azure Cosmos emulator in the Windows Tray Icon as shown below.

:::image type="content" source="./media/local-emulator/database-local-emulator-data-explorer-launcher.png" alt-text="Azure Cosmos local emulator data explorer launcher":::

## <a id="run-on-windows-docker"></a>Use the emulator on Docker for Windows

You can run the Azure Cosmos emulator on the Windows Docker container. See the [Docker Hub](https://hub.docker.com/r/microsoft/azure-cosmosdb-emulator/) for the docker pull command and [GitHub](https://github.com/Azure/azure-cosmos-db-emulator-docker) for the `Dockerfile` and more information. Currently the emulator does not work on Docker for Oracle Linux. Use the following instructions to run the emulator on Docker for Windows:

1. After you have [Docker for Windows](https://www.docker.com/docker-windows) installed, switch to Windows containers by right-clicking the Docker icon on the toolbar and selecting **Switch to Windows containers**.

1. Next, pull the emulator image from Docker Hub by running the following command from your favorite shell.

   ```bash
   docker pull mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
   ```

1. To start the image, run the following commands depending on the command line or the PowerShell environment:

   # [Command line](#tab/cli)

   ```bash

   md %LOCALAPPDATA%\CosmosDBEmulator\bind-mount

   docker run --name azure-cosmosdb-emulator --memory 2GB --mount "type=bind,source=%LOCALAPPDATA%\CosmosDBEmulator\bind-mount,destination=C:\CosmosDB.Emulator\bind-mount" --interactive --tty -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10256:10256 -p 10350:10350 mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
   ```
   Windows based Docker images might not be generally compatible with every Windows host OS. For instance, the default Azure Cosmos emulator image is only compatible with Windows 10 and Windows Server 2016. If you need an image that is compatible with Windows Server 2019, run the following command instead:

   ```bash
   docker run --name azure-cosmosdb-emulator --memory 2GB --mount "type=bind,source=%hostDirectory%,destination=C:\CosmosDB.Emulator\bind-mount" --interactive --tty -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10256:10256 -p 10350:10350 mcr.microsoft.com/cosmosdb/winsrv2019/azure-cosmos-emulator:latest
   ```

   # [PowerShell](#tab/powershell)

   ```powershell

   md $env:LOCALAPPDATA\CosmosDBEmulator\bind-mount 2>null

   docker run --name azure-cosmosdb-emulator --memory 2GB --mount "type=bind,source=$env:LOCALAPPDATA\CosmosDBEmulator\bind-mount,destination=C:\CosmosDB.Emulator\bind-mount" --interactive --tty -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10256:10256 -p 10350:10350 mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator

   ```

   The response looks similar to the following:

   ```bash
   Starting emulator
   Emulator Endpoint: https://172.20.229.193:8081/
   Primary Key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
   Exporting SSL Certificate
   You can import the SSL certificate from an administrator command prompt on the host by running:
   cd /d %LOCALAPPDATA%\CosmosDBEmulatorCert
   powershell .\importcert.ps1
   --------------------------------------------------------------------------------------------------
   Starting interactive shell
   ```
   ---

   > [!NOTE]
   > When executing the `docker run` command, if you see a port conflict error (that is if the specified port is already in use), pass a custom port by altering the port numbers. For example, you can change the "-p 8081:8081" parameter to "-p 443:8081"

1. Now use the emulator endpoint and primary key from the response and import the TLS/SSL certificate into your host. To import the TLS/SSL certificate, run the following steps from an admin command prompt:

   # [Command line](#tab/cli)

   ```bash
   cd  %LOCALAPPDATA%\CosmosDBEmulator\bind-mount
   powershell .\importcert.ps1
   ```

   # [PowerShell](#tab/powershell)

   ```powershell
   cd $env:LOCALAPPDATA\CosmosDBEmulator\bind-mount
   .\importcert.ps1
   ```
   ---

1. If you close the interactive shell after the emulator has started, it will shut down the emulator's container. To reopen the data explorer, navigate to the following URL in your browser. The emulator endpoint is provided in the response message shown above.

   `https://<emulator endpoint provided in response>/_explorer/index.html`

If you have a .NET client application running on a Linux docker container and if you are running Azure Cosmos emulator on a host machine, use the instructions in the next section to import the certificate into the Linux docker container.

### Regenerate the emulator certificates when running on a Docker container

When running the emulator in a Docker container, the certificates associated with the emulator are regenerated every time you stop and restart the respective container. Because of that you have to re-import the certificates after each container start. To work around this limitation, you can use a Docker compose file to bind the Docker container to a particular IP address and a container image.

For example, you can use the following configuration within the Docker compose file, make sure to format it per your requirement: 

```yml
version: '2.4' # Do not upgrade to 3.x yet, unless you plan to use swarm/docker stack: https://github.com/docker/compose/issues/4513

networks:
  default:
    external: false
    ipam:
      driver: default
      config:
        - subnet: "172.16.238.0/24"

services:

  # First create a directory that will hold the emulator traces and certificate to be imported
  # set hostDirectory=C:\emulator\bind-mount
  # mkdir %hostDirectory%

  cosmosdb:
    container_name: "azurecosmosemulator"
    hostname: "azurecosmosemulator"
    image: 'mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator'
    platform: windows
    tty: true
    mem_limit: 3GB
    ports:
        - '8081:8081'
        - '8900:8900'
        - '8901:8901'
        - '8902:8902'
        - '10250:10250'
        - '10251:10251'
        - '10252:10252'
        - '10253:10253'
        - '10254:10254'
        - '10255:10255'
        - '10256:10256'
        - '10350:10350'
    networks:
      default:
        ipv4_address: 172.16.238.246
    volumes:
        - '${hostDirectory}:C:\CosmosDB.Emulator\bind-mount'
```

## <a id="run-on-linux-macos"></a>Use the emulator on Linux or macOS

Currently the Azure Cosmos emulator can only be run on Windows. If you are using Linux or macOS, you can run the emulator in a Windows virtual machine hosted in a hypervisor such as Parallels or VirtualBox.

> [!NOTE]
> Every time you restart the Windows virtual machine that is hosted in a hypervisor, you have to reimport the certificate because the IP address of the virtual machine changes. Importing the certificate isn't required in case you have configured the virtual machine to preserve the IP address.

Use the following steps to use the emulator on Linux or macOS environments:

1. Run the following command from the Windows virtual machine and make a note of the IPv4 address:

   ```bash
   ipconfig.exe
   ```

1. Within your application, change the endpoint URL to use the IPv4 address returned by `ipconfig.exe` instead of `localhost`.

1. From the Windows VM, launch the Azure Cosmos emulator from the command line using the following options. For details on the parameters supported by the command line, see the [emulator command-line tool reference](emulator-command-line-parameters.md):

   ```bash
   Microsoft.Azure.Cosmos.Emulator.exe /AllowNetworkAccess /Key=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
   ```

1. Finally, you need to resolve the certificate trust process between the application running on the Linux or Mac environment and the emulator. You can use one of the following two options to resolve the certificate:

   1. [Import the emulator TLS/SSL certificate into the Linux or Mac environment](#import-certificate) or
   2. [Disable the TLS/SSL validation in the application](#disable-ssl-validation)

### <a id="import-certificate"></a>Option 1: Import the emulator TLS/SSL certificate

The following sections show how to import the emulator TLS/SSL certificate into Linux and macOS environments.

#### Linux environment

If you are working on Linux, .NET relays on OpenSSL to do the validation:

1. [Export the certificate in PFX format](local-emulator-export-ssl-certificates.md#export-emulator-certificate). The PFX option is available when choosing to export the private key.

1. Copy that PFX file into your Linux environment.

1. Convert the PFX file into a CRT file

   ```bash
   openssl pkcs12 -in YourPFX.pfx -clcerts -nokeys -out YourCTR.crt
   ```

1. Copy the CRT file to the folder that contains custom certificates in your Linux distribution. Commonly on Debian distributions, it is located on `/usr/local/share/ca-certificates/`.

   ```bash
   cp YourCTR.crt /usr/local/share/ca-certificates/
   ```

1. Update the TLS/SSL certificates, which will update the `/etc/ssl/certs/` folder.

   ```bash
   update-ca-certificates
   ```

#### macOS environment

Use the following steps if you are working on Mac:

1. [Export the certificate in PFX format](local-emulator-export-ssl-certificates.md#export-emulator-certificate). The PFX option is available when choosing to export the private key.

1. Copy that PFX file into your Mac environment.

1. Open the *Keychain Access* application and import the PFX file.

1. Open the list of Certificates and identify the one with the name `localhost`.

1. Open the context menu for that particular item, select *Get Item* and under *Trust* > *When using this certificate* option, select *Always Trust*. 

   :::image type="content" source="./media/local-emulator/mac-trust-certificate.png" alt-text="Open the context menu for that particular item, select Get Item and under Trust - When using this certificate option, select Always Trust":::
  
### <a id="disable-ssl-validation"></a>Option 2: Disable the SSL validation in the application

Disabling SSL validation is only recommended for development purposes and should not be done when running in a production environment. The following examples show how to disable SSL validation for .NET and Node.js applications.

# [.NET Standard 2.1+](#tab/ssl-netstd21)

For any application running in a framework compatible with .NET Standard 2.1 or later, we can leverage the `CosmosClientOptions.HttpClientFactory`:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/HttpClientFactory/Program.cs?name=DisableSSLNETStandard21)]

# [.NET Standard 2.0](#tab/ssl-netstd20)

For any application running in a framework compatible with .NET Standard 2.0, we can leverage the `CosmosClientOptions.HttpClientFactory`:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/HttpClientFactory/Program.cs?name=DisableSSLNETStandard20)]

# [Node.js](#tab/ssl-nodejs)

For Node.js applications, you can modify your `package.json` file to set the `NODE_TLS_REJECT_UNAUTHORIZED` while starting the application:

```json
"start": NODE_TLS_REJECT_UNAUTHORIZED=0 node app.js
```
--- 

## Enable access to emulator on a local network

If you have multiple machines using a single network, and if you set up the emulator on one machine and want to access it from other machine. In such case, you need to enable access to the emulator on a local network.

You can run the emulator on a local network. To enable network access, specify the `/AllowNetworkAccess` option at the [command-line](emulator-command-line-parameters.md), which also requires that you specify `/Key=key_string` or `/KeyFile=file_name`. You can use `/GenKeyFile=file_name` to generate a file with a random key upfront. Then you can pass that to `/KeyFile=file_name` or `/Key=contents_of_file`.

To enable network access for the first time, the user should shut down the emulator and delete the emulator's data directory *%LOCALAPPDATA%\CosmosDBEmulator*.

## <a id="authenticate-requests"></a>Authenticate connections when using emulator

As with Azure Cosmos DB in the cloud, every request that you make against the Azure Cosmos emulator must be authenticated. The Azure Cosmos emulator supports only secure communication via TLS. The Azure Cosmos emulator supports a single fixed account and a well-known authentication key for primary key authentication. This account and key are the only credentials permitted for use with the Azure Cosmos Emulator. They are:

```bash
Account name: localhost:<port>
Account key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
```

> [!NOTE]
> The primary key supported by the Azure Cosmos emulator is intended for use only with the emulator. You cannot use your production Azure Cosmos DB account and key with the Azure Cosmos Emulator.

> [!NOTE]
> If you have started the emulator with the /Key option, then use the generated key instead of the default key `C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==`. For more information about /Key option, see [Command-line tool reference.](emulator-command-line-parameters.md)

## <a id="connect-with-emulator-apis"></a>Connect to different APIs with the emulator

### SQL API

Once you have the Azure Cosmos emulator running on your desktop, you can use any supported [Azure Cosmos DB SDK](sql-api-sdk-dotnet-standard.md) or the [Azure Cosmos DB REST API](/rest/api/cosmos-db/) to interact with the emulator. The Azure Cosmos emulator also includes a built-in data explorer that lets you create containers for SQL API or Azure Cosmos DB for Mongo DB API. By using the data explorer, you can view and edit items without writing any code.

```csharp
// Connect to the Azure Cosmos emulator running locally
CosmosClient client = new CosmosClient(
   "https://localhost:8081", 
    "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==");

```

### Azure Cosmos DB's API for MongoDB

Once you have the Azure Cosmos emulator running on your desktop, you can use the [Azure Cosmos DB's API for MongoDB](mongodb-introduction.md) to interact with the emulator. Start the emulator from [command prompt](emulator-command-line-parameters.md) as an administrator with "/EnableMongoDbEndpoint". Then use the following connection string to connect to the MongoDB API account:

```bash
mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true
```

### Table API

Once you have the Azure Cosmos emulator running on your desktop, you can use the [Azure Cosmos DB Table API SDK](./tutorial-develop-table-dotnet.md) to interact with the emulator. Start the emulator from [command prompt](emulator-command-line-parameters.md) as an administrator with "/EnableTableEndpoint". Next run the following code to connect to the table API account:

```csharp
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using CloudTable = Microsoft.WindowsAzure.Storage.Table.CloudTable;
using CloudTableClient = Microsoft.WindowsAzure.Storage.Table.CloudTableClient;

string connectionString = "DefaultEndpointsProtocol=http;AccountName=localhost;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==;TableEndpoint=http://localhost:8902/;";

CloudStorageAccount account = CloudStorageAccount.Parse(connectionString);
CloudTableClient tableClient = account.CreateCloudTableClient();
CloudTable table = tableClient.GetTableReference("testtable");
table.CreateIfNotExists();
table.Execute(TableOperation.Insert(new DynamicTableEntity("partitionKey", "rowKey")));
```

### Cassandra API

Start emulator from an administrator [command prompt](emulator-command-line-parameters.md) with "/EnableCassandraEndpoint". Alternatively you can also set the environment variable `AZURE_COSMOS_EMULATOR_CASSANDRA_ENDPOINT=true`.

1. [Install Python 2.7](https://www.python.org/downloads/release/python-2716/)

1. [Install Cassandra CLI/CQLSH](https://cassandra.apache.org/download/)

1. Run the following commands in a regular command prompt window:

   ```bash
   set Path=c:\Python27;%Path%
   cd /d C:\sdk\apache-cassandra-3.11.3\bin
   set SSL_VERSION=TLSv1_2
   set SSL_VALIDATE=false
   cqlsh localhost 10350 -u localhost -p C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw== --ssl
   ```

1. In the CQLSH shell, run the following commands to connect to the Cassandra endpoint:

   ```bash
   CREATE KEYSPACE MyKeySpace WITH replication = {'class':'MyClass', 'replication_factor': 1};
   DESCRIBE keyspaces;
   USE mykeyspace;
   CREATE table table1(my_id int PRIMARY KEY, my_name text, my_desc text);
   INSERT into table1 (my_id, my_name, my_desc) values( 1, 'name1', 'description 1');
   SELECT * from table1;
   EXIT
   ```

### Gremlin API

Start emulator from an administrator [command prompt](emulator-command-line-parameters.md)with "/EnableGremlinEndpoint". Alternatively you can also set the environment variable `AZURE_COSMOS_EMULATOR_GREMLIN_ENDPOINT=true`

1. [Install apache-tinkerpop-gremlin-console-3.3.4](https://archive.apache.org/dist/tinkerpop/3.3.4).

1. From the emulator's data explorer create a database "db1" and a collection "coll1"; for the partition key, choose "/name"

1. Run the following commands in a regular command prompt window:

   ```bash
   cd /d C:\sdk\apache-tinkerpop-gremlin-console-3.3.4-bin\apache-tinkerpop-gremlin-console-3.3.4
  
   copy /y conf\remote.yaml conf\remote-localcompute.yaml
   notepad.exe conf\remote-localcompute.yaml
     hosts: [localhost]
     port: 8901
     username: /dbs/db1/colls/coll1
     password: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
     connectionPool: {
     enableSsl: false}
     serializer: { className: org.apache.tinkerpop.gremlin.driver.ser.GraphSONMessageSerializerV1d0,
     config: { serializeResultToString: true  }}

   bin\gremlin.bat
   ```

1. In the Gremlin shell, run the following commands to connect to the Gremlin endpoint:

   ```bash
   :remote connect tinkerpop.server conf/remote-localcompute.yaml
   :remote console
   :> g.V()
   :> g.addV('person1').property(id, '1').property('name', 'somename1')
   :> g.addV('person2').property(id, '2').property('name', 'somename2')
   :> g.V()
   ```

## <a id="uninstall"></a>Uninstall the local emulator

Use the following steps to uninstall the emulator:

1. Exit all the open instances of the local emulator by right-clicking the **Azure Cosmos emulator** icon on the system tray, and then select **Exit**. It may take a minute for all instances to exit.

1. In the Windows search box, type **Apps & features** and select **Apps & features (System settings)** result.

1. In the list of apps, scroll to the **Azure Cosmos DB Emulator**, select it, click **Uninstall**, then confirm and select **Uninstall** again.

## Next steps

In this article, you've learned how to use the local emulator for free local development. You can now proceed to the next articles:

* [Export the Azure Cosmos emulator certificates for use with Java, Python, and Node.js apps](local-emulator-export-ssl-certificates.md)
* [Use command line parameters and PowerShell commands to control the emulator](emulator-command-line-parameters.md)
* [Debug issues with the emulator](troubleshoot-local-emulator.md)