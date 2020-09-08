---
title: Develop locally with the Azure Cosmos DB emulator
description: Use the Azure Cosmos DB emulator, you can develop and test your application locally for free, without creating an Azure subscription.
ms.service: cosmos-db
ms.topic: how-to
author: markjbrown
ms.author: mjbrown
ms.date: 09/04/2020
ms.custom: devx-track-csharp 
---

# Use the Azure Cosmos emulator for local development and testing

The Azure Cosmos emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Using the Azure Cosmos emulator, you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the Azure Cosmos emulator, you can switch to using an Azure Cosmos account in the cloud. To get started, download and install the latest version of [Azure Cosmos emulator](https://aka.ms/cosmosdb-emulator) on your local computer. This article describes how to install and use the emulator on Windows, Linux, MacOS, and Windows docker environments.

You can develop apps using Azure Cosmos emulator with the [SQL](local-emulator.md#sql-api), [Cassandra](local-emulator.md#cassandra-api), [MongoDB](local-emulator.md#azure-cosmos-dbs-api-for-mongodb), [Gremlin](local-emulator.md#gremlin-api), and [Table](local-emulator.md#table-api) API accounts. Currently the data explorer view in the emulator fully supports SQL API clients only.



## How does the emulator work?

The Azure Cosmos emulator provides a high-fidelity emulation of the Azure Cosmos DB service. It supports identical functionality as the Azure Cosmos DB which, includes creating data, querying data, provisioning and scaling containers, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos emulator, and deploy them to Azure at global scale by updating the Azure Cosmos DB connection endpoint.

While emulation of the Azure Cosmos DB service is faithful, the emulator's implementation is different than the service. For example, the emulator uses standard OS components such as the local file system for persistence, and the HTTPS protocol stack for connectivity. Functionality that relies on the Azure infrastructure like global replication, single-digit millisecond latency for reads/writes, and tunable consistency levels are not applicable when you use the emulator.

You can migrate data between the Azure Cosmos emulator and the Azure Cosmos DB service by using the [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool).

## Differences between the emulator and the cloud service

Because the Azure Cosmos emulator provides an emulated environment running on the local developer workstation, there are some differences in functionality between the emulator and an Azure Cosmos account in the cloud:

* Currently the **Data Explorer** pane in the emulator fully supports SQL API clients only. The **Data Explorer** view and operations for Azure Cosmos DB APIs such as MongoDB, Table, Graph, and Cassandra APIs are not fully supported.

* The emulator supports only a single fixed account and a well-known master key. You can't regenerate key when using the Azure Cosmos emulator, however you can change the default key by using the command-line option.

* With the emulator you can create an Azure Cosmos account in [provisioned throughput](set-throughput.md) mode only; currently it doesn't support an Azure Cosmos account in [serverless](serverless.md) mode.

* The emulator is not a scalable service and it doesn't support a large number of containers.

* The emulator does not offer different [Azure Cosmos DB consistency levels](consistency-levels.md) like the cloud service does.

* The emulator does not offer [multi-region replication](distribute-data-globally.md).

* Because the copy of your Azure Cosmos emulator might not always be up-to-date with the most recent changes in the Azure Cosmos DB service, you should always refer to the [Azure Cosmos DB capacity planner](https://www.documentdb.com/capacityplanner) to accurately estimate the throughput (RUs) needs of your application.

* When using the Azure Cosmos emulator, by default, you can create up to 25 fixed size containers (only supported using Azure Cosmos DB SDKs), or 5 unlimited containers. For more information on how to change this value, see [Set the PartitionCount value](#set-partitioncount) article.

* The emulator supports a maximum ID property size of 254 characters.

## Install the emulator

Before you install the emulator, make sure you have the following hardware and software requirements:

* Software requirements:
  * Windows Server 2012 R2, Windows Server 2016, or Windows 10
  * 64-bit operating system

* Minimum hardware requirements:
  * 2-GB RAM
  * 10-GB available hard disk space

* To install, configure, and run the Azure Cosmos emulator, you must have administrative privileges on the computer. The emulator will create/add a certificate and also set the firewall rules in order to run its services; therefore it's necessary for the emulator to be able to execute such operations.

To get started, download and install the latest version of [Azure Cosmos emulator](https://aka.ms/cosmosdb-emulator) on your local computer. Depending upon your system requirements, you can also run the emulator on [Docker for Windows](), [Linux]() or [MacOS]() as described in next sections of this article.

### Check for updates

see this page for the latest version of the emulator and set of updates that were made https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator-release-notes

Data created in one version of the Azure Cosmos emulator (see %LOCALAPPDATA%\CosmosDBEmulator or data path optional settings) is not guaranteed to be accessible when using a different version. If you need to persist your data for the long term, it is recommended that you store that data in an Azure Cosmos account, rather than in the Azure Cosmos emulator.

## Run the emulator on Windows

The Azure Cosmos emulator is installed at `C:\Program Files\Azure Cosmos DB Emulator` location by default. To start the Azure Cosmos emulator on Windows, select the Start button or press the Windows key. Begin typing **Azure Cosmos Emulator**, and select the emulator from the list of applications.

:::image type="content" source="./media/local-emulator/database-local-emulator-start.png" alt-text="Select the Start button or press the Windows key, begin typing Azure Cosmos emulator, and select the emulator from the list of applications":::

When the emulator is running, you'll see an icon in the Windows taskbar notification area.

:::image type="content" source="./media/local-emulator/database-local-emulator-taskbar.png" alt-text="Azure Cosmos DB local emulator task bar notification":::

You can also start and stop the emulator from the command-line. For more information, see the [command-line tool reference](#command-line).

The Azure Cosmos emulator by default runs on the local machine ("localhost") listening on port 8081. When the Azure Cosmos emulator launches, it automatically opens the Azure Cosmos data explorer in your browser. The address appears as `https://localhost:8081/_explorer/index.html`. If you close the explorer and would like to reopen it later, you can either open the URL in your browser or launch it from the Azure Cosmos emulator in the Windows Tray Icon as shown below.

:::image type="content" source="./media/local-emulator/database-local-emulator-data-explorer-launcher.png" alt-text="Azure Cosmos local emulator data explorer launcher":::

## Run the emulator on Docker for Windows

You can run the Azure Cosmos emulator on the Windows Docker container. See the [Docker Hub](https://hub.docker.com/r/microsoft/azure-cosmosdb-emulator/) for the docker pull command and [GitHub](https://github.com/Azure/azure-cosmos-db-emulator-docker) for the `Dockerfile` and more information. Currently the emulator does not work on Docker for Oracle Linux.

1. After you have [Docker for Windows](https://www.docker.com/docker-windows) installed, switch to Windows containers by right-clicking the Docker icon on the toolbar and selecting **Switch to Windows containers**.

1. Next, pull the emulator image from Docker Hub by running the following command from your favorite shell.

   ```bash
   docker pull mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
   ```

1. To start the image, run the following commands depending on the command line or the PowerShell environment you are using:

   # [Command line](#tab/cli)

   ```cmd

   md %LOCALAPPDATA%\CosmosDBEmulator\bind-mount

   docker run --name azure-cosmosdb-emulator --memory 2GB --mount "type=bind,source=%LOCALAPPDATA%\CosmosDBEmulator\bind-mount,destination=C:\CosmosDB.Emulator\bind-mount" --interactive --tty -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10256:10256 -p 10350:10350 mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
   ```

   > [!NOTE]
   > If you see a port conflict error (specified port is already in use) when you run the docker run command, you can pass a custom port by altering the port numbers. For example, you can change the "-p 8081:8081" to "-p 443:8081"

   # [Powershell](#tab/powershell)

   ```powershell

   md $env:LOCALAPPDATA\CosmosDBEmulator\bind-mount 2>null

   docker run --name azure-cosmosdb-emulator --memory 2GB --mount "type=bind,source=$env:LOCALAPPDATA\CosmosDBEmulator\bind-mount,destination=C:\CosmosDB.Emulator\bind-mount" --interactive --tty -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10256:10256 -p 10350:10350 mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator

   ```

   The response looks similar to the following:

   ```cmd
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
   ---

1. Now use the endpoint and master key from the response and import the TLS/SSL certificate into your host. To import the TLS/SSL certificate, do the following from an admin command prompt:

   # [Command line](#tab/cli)

   ```cmd
   cd  %LOCALAPPDATA%\CosmosDBEmulator\bind-mount
   powershell .\importcert.ps1
   ```

   # [Powershell](#tab/powershell)

   ```powershell
   cd $env:LOCALAPPDATA\CosmosDBEmulator\bind-mount
   .\importcert.ps1
   ```
   ---

1. If you close the interactive shell after the emulator has started, it will shut down the emulator's container. To reopen the data explorer, navigate to the following URL in your browser. The emulator endpoint is provided in the response message shown above.

   `https://<emulator endpoint provided in response>/_explorer/index.html`

If you have a .NET client application running on a Linux docker container and if you are running Azure Cosmos emulator on a host machine, use the following section to import the certificate into the Linux docker container.

## Run the emulator on Linux or MacOS

Currently the Azure Cosmos emulator can only be run on Windows. If you are using Linux or MacOS, you can run the emulator in a Windows virtual machine hosted in a hypervisor such as Parallels or VirtualBox. Use the following steps to enable this.

* Run the following command from the Windows virtual machine and make note of the IPv4 address:

  ```cmd
  ipconfig.exe
  ```

* Within your application, change the endpoint URL to use the IPv4 address returned by `ipconfig.exe` instead of `localhost`.

* From the Windows VM, launch the Azure Cosmos emulator from the command line using the following options:

  ```cmd
  Microsoft.Azure.Cosmos.Emulator.exe /AllowNetworkAccess /Key=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
  ```

* Finally, you need to resolve the certificate trust process between the application running on the Linux or Mac environment and the emulator. You can use one of the following two options to resolve the certificate:

   1. [Import the emulator CA certificate into the Linux or Mac environment](#import-certificate) or
   2. [Disable the SSL validation in the application](#disable-ssl-validation)

### <a id="import-certificate"></a>Import the emulator CA certificate

The following sections show how to import the emulator CA certificate into Linux and MacOS environments.

**Linux environment**

If you are working on Linux, .NET relays on OpenSSL to do the validation:

1. [Export the certificate in PFX format](./local-emulator-export-ssl-certificates.md#how-to-export-the-azure-cosmos-db-tlsssl-certificate) (PFX is available when choosing to export the private key). 

1. Copy that PFX file into your Linux environment.

1. Convert the PFX file into a CRT file

   ```bash
   openssl pkcs12 -in YourPFX.pfx -clcerts -nokeys -out YourCTR.crt
   ```

1. Copy the CRT file to the folder that contains custom certificates in your Linux distribution. Commonly on Debian distributions, it is located on `/usr/local/share/ca-certificates/`.

   ```bash
   cp YourCTR.crt /usr/local/share/ca-certificates/
   ```

1. Update the CA certificates, which will update the `/etc/ssl/certs/` folder.

   ```bash
   update-ca-certificates
   ```

**MacOS environment**

Use the following steps if you are working on Mac:

1. [Export the certificate in PFX format](./local-emulator-export-ssl-certificates.md#how-to-export-the-azure-cosmos-db-tlsssl-certificate) (PFX is available when choosing to export the private key).

1. Copy that PFX file into your Mac environment.

1. Open the *Keychain Access* application and import the PFX file.

1. Open the list of Certificates and identify the one with the name `localhost`.

1. Open the context menu for that particular item, select *Get Item* and under *Trust* > *When using this certificate* option, select *Always Trust*. 

   :::image type="content" source="./media/local-emulator/mac-trust-certificate.png" alt-text="Open the context menu for that particular item, select Get Item and under Trust - When using this certificate option, select Always Trust":::

After following these steps, your environment will trust the certificate used by the emulator when connecting to the IP address exposes by `/AllowNetworkAccess`.
  
### <a id="disable-ssl-validation"></a>Disable the SSL validation in the application

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

You can run the emulator on a local network. To enable network access, specify the `/AllowNetworkAccess` option at the [command-line](#command-line-syntax), which also requires that you specify `/Key=key_string` or `/KeyFile=file_name`. You can use `/GenKeyFile=file_name` to generate a file with a random key upfront. Then you can pass that to `/KeyFile=file_name` or `/Key=contents_of_file`.

To enable network access for the first time the user should shut down the emulator and delete the emulator's data directory (%LOCALAPPDATA%\CosmosDBEmulator).

## Authenticating requests

As with Azure Cosmos DB in the cloud, every request that you make against the Azure Cosmos emulator must be authenticated. The Azure Cosmos emulator supports a single fixed account and a well-known authentication key for master key authentication. This account and key are the only credentials permitted for use with the Azure Cosmos Emulator. They are:

```bash
Account name: localhost:<port>
Account key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
```

> [!NOTE]
> The master key supported by the Azure Cosmos emulator is intended for use only with the emulator. You cannot use your production Azure Cosmos DB account and key with the Azure Cosmos Emulator.

> [!NOTE]
> If you have started the emulator with the /Key option, then use the generated key instead of `C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==`. For more information about /Key option, see [Command-line tool reference.](#command-line)

As with the Azure Cosmos DB, the Azure Cosmos emulator supports only secure communication via TLS.

## Developing with the emulator

### SQL API

Once you have the Azure Cosmos emulator running on your desktop, you can use any supported [Azure Cosmos DB SDK](sql-api-sdk-dotnet-standard.md) or the [Azure Cosmos DB REST API](/rest/api/cosmos-db/) to interact with the emulator. The Azure Cosmos emulator also includes a built-in Data Explorer that lets you create containers for SQL API or Cosmos DB for Mongo DB API, and view and edit items without writing any code.

```csharp
// Connect to the Azure Cosmos emulator running locally
CosmosClient client = new CosmosClient(
   "https://localhost:8081", 
    "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==");

```

### Azure Cosmos DB's API for MongoDB

Once you have the Azure Cosmos emulator running on your desktop, you can use the [Azure Cosmos DB's API for MongoDB](mongodb-introduction.md) to interact with the emulator. Start emulator from command prompt as an administrator with "/EnableMongoDbEndpoint". Then use the following connection string to connect to the MongoDB API account:

```bash
mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true
```

### Table API

Once you have the Azure Cosmos emulator running on your desktop, you can use the [Azure Cosmos DB Table API SDK](table-storage-how-to-use-dotnet.md) to interact with the emulator. Start emulator from command prompt as an administrator with "/EnableTableEndpoint". Next run the following code to connect to the table API account:

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

Start emulator from an administrator command prompt with "/EnableCassandraEndpoint". Alternatively you can also set the environment variable `AZURE_COSMOS_EMULATOR_CASSANDRA_ENDPOINT=true`.

* [Install Python 2.7](https://www.python.org/downloads/release/python-2716/)

* [Install Cassandra CLI/CQLSH](https://cassandra.apache.org/download/)

* Run the following commands in a regular command prompt window:

  ```bash
  set Path=c:\Python27;%Path%
  cd /d C:\sdk\apache-cassandra-3.11.3\bin
  set SSL_VERSION=TLSv1_2
  set SSL_VALIDATE=false
  cqlsh localhost 10350 -u localhost -p C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw== --ssl
  ```

* In the CQLSH shell, run the following commands to connect to the Cassandra endpoint:

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

Start emulator from an administrator command prompt with "/EnableGremlinEndpoint". Alternatively you can also set the environment variable `AZURE_COSMOS_EMULATOR_GREMLIN_ENDPOINT=true`

* [Install apache-tinkerpop-gremlin-console-3.3.4](https://archive.apache.org/dist/tinkerpop/3.3.4).

* In the emulator's Data Explorer create a database "db1" and a collection "coll1"; for the partition key, choose "/name"

* Run the following commands in a regular command prompt window:

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

* In the Gremlin shell run the following commands to connect to the Gremlin endpoint:

  ```bash
  :remote connect tinkerpop.server conf/remote-localcompute.yaml
  :remote console
  :> g.V()
  :> g.addV('person1').property(id, '1').property('name', 'somename1')
  :> g.addV('person2').property(id, '2').property('name', 'somename2')
  :> g.V()
  ```

## Export the TLS/SSL certificate

.NET languages and runtime use the Windows Certificate Store to securely connect to the Azure Cosmos DB local emulator. Other languages have their own method of managing and using certificates. Java uses its own [certificate store](https://docs.oracle.com/cd/E19830-01/819-4712/ablqw/index.html) whereas Python uses [socket wrappers](https://docs.python.org/2/library/ssl.html).

In order to obtain a certificate to use with languages and runtimes that do not integrate with the Windows Certificate Store, you will need to export it using the Windows Certificate Manager. You can start it by running certlm.msc or follow the step by step instructions in [Export the Azure Cosmos emulator Certificates](./local-emulator-export-ssl-certificates.md). Once the certificate manager is running, open the Personal Certificates as shown below and export the certificate with the friendly name "DocumentDBEmulatorCertificate" as a BASE-64 encoded X.509 (.cer) file.

:::image type="content" source="./media/local-emulator/database-local-emulator-ssl_certificate.png" alt-text="Azure Cosmos DB local emulator TLS/SSL certificate":::

The X.509 certificate can be imported into the Java certificate store by following the instructions in [Adding a Certificate to the Java CA Certificates Store](https://docs.microsoft.com/azure/java-add-certificate-ca-store). Once the certificate is imported into the certificate store, clients for SQL and Azure Cosmos DB's API for MongoDB will be able to connect to the Azure Cosmos Emulator.

When connecting to the emulator from Python and Node.js SDKs, TLS verification is disabled.

### <a id="uninstall"></a>Uninstall the local emulator

Use the following steps to uninstall the emulator:

1. Exit all the open instances of the local emulator by right-clicking the **Azure Cosmos emulator** icon on the system tray, and then select **Exit**. It may take a minute for all instances to exit.

1. In the Windows search box, type **Apps & features** and select **Apps & features (System settings)** result.

1. In the list of apps, scroll to the **Azure Cosmos DB Emulator**, select it, click **Uninstall**, then confirm and click **Uninstall** again.

1. When the app is uninstalled, navigate to `%LOCALAPPDATA%\CosmosDBEmulator` and delete the folder.

## Next steps

In this tutorial, you've learned how to use the local emulator for free local development. You can now proceed to the next tutorial and learn how to export emulator TLS/SSL certificates.

> [!div class="nextstepaction"]
> [Export the Azure Cosmos emulator certificates](local-emulator-export-ssl-certificates.md)
