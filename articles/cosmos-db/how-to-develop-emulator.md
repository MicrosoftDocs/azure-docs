---
title: Use the emulator for development and CI
titleSuffix: Azure Cosmos DB
description: Use the Azure Cosmos DB emulator to develop your applications locally and test then with a working database.
author: sajeetharan
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/11/2023
zone_pivot_groups: azure-cosmos-db-apis-nosql-mongodb-cassandra-gremlin-table
# CustomerIntent: As a developer, I want to use the Azure Cosmos DB emulator so that I can develop my application against a database during development.
---

# Develop locally using the Azure Cosmos DB emulator

A common use case for the emulator is to serve as a development database while you're building your applications. Using the emulator for development can help you learn characteristics of creating and modeling data for a database like Azure Cosmos DB without incurring any service costs. Additionally, using the emulator as part of an automation workflow can ensure that you can run the same suite of integration tests. You can ensure that the same tests run both locally on your development machine and remotely in a continuous integration job.

## Prerequisites

- [.NET 6 or later](https://dotnet.microsoft.com/download), [Node.js LTS](https://nodejs.org/en/download/), or [Python 3.7 or later](https://www.python.org/downloads/)
  - Ensure that all required executables are available in your `PATH`.
- **Windows emulator**
  - 64-bit Windows Server 2016, 2019, Windows 10, or Windows 11.
  - Minimum hardware requirements:
    - 2-GB RAM
    - 10-GB available hard disk space
- **Docker emulator**
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Install the emulator

There are multiple variations of the emulator and each variation has a relatively frictionless install process.

::: zone pivot="api-nosql"

### [Docker (Linux container)](#tab/docker-linux)

To get started, get the Linux-variant of the container image from the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com).

1. Pull the `mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator` Linux container image from the container registry to the local Docker host.

    ```bash
    docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest
    ```

1. Check to make sure that the emulator image has been pulled to your local Docker host.

    ```bash
    docker images
    ```

### [Docker (Windows container)](#tab/docker-windows)

To get started, get the Windows-variant of the container image from the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com).

1. Pull the `mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator` Windows container image from the container registry to the local Docker host.

    ```powershell
    docker pull mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
    ```

1. Check to make sure that the emulator image has been pulled to your local Docker host.

    ```powershell
    docker images
    ```

### [Windows (local)](#tab/windows)

To get started, download and install the latest version of Azure Cosmos DB Emulator on your local computer.

> [!TIP]
> The [emulator release notes](local-emulator-release-notes.md) article lists all the available versions and the feature updates that were made in each release.

1. Download the [Azure Cosmos DB emulator](https://aka.ms/cosmosdb-emulator).

1. Run the installer on your local machine with **administrative privileges**.

1. The emulator automatically installs the appropriate developer certificates and configures firewall rules on your local machine.

---

::: zone-end

::: zone pivot="api-mongodb"

### [Docker (Linux container)](#tab/docker-linux)

To get started, get the Linux-variant of the container image from the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com).

1. Pull the `mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator` Linux container image using the `mongodb` tag from the container registry to the local Docker host.

    ```bash
    docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:mongodb
    ```

1. Check to make sure that the emulator image has been pulled to your local Docker host.

    ```bash
    docker images
    ```

### [Docker (Windows container)](#tab/docker-windows)

The Docker (Windows) container image doesn't support the API for MongoDB.

### [Windows (local)](#tab/windows)

To get started, download and install the latest version of Azure Cosmos DB Emulator on your local computer.

> [!TIP]
> The [emulator release notes](local-emulator-release-notes.md) article lists all the available versions and the feature updates that were made in each release.

1. Download the [Azure Cosmos DB emulator](https://aka.ms/cosmosdb-emulator).

1. Run the installer on your local machine with **administrative privileges**.

1. The emulator automatically installs the appropriate developer certificates and configures firewall rules on your local machine.

---

::: zone-end

::: zone pivot="api-apache-cassandra,api-apache-gremlin,api-table"

### [Docker (Linux container) / Docker (Windows container)](#tab/docker-linux+docker-windows)

The Docker container variant (Linux or Windows) of the emulator doesn't support the API for Apache Cassandra, API for Apache Gremlin, or API for Table.

### [Windows (local)](#tab/windows)

To get started, download and install the latest version of Azure Cosmos DB Emulator on your local computer.

> [!TIP]
> The [emulator release notes](local-emulator-release-notes.md) article lists all the available versions and the feature updates that were made in each release.

1. Download the [Azure Cosmos DB emulator](https://aka.ms/cosmosdb-emulator).

1. Run the installer on your local machine with **administrative privileges**.

1. The emulator automatically installs the appropriate developer certificates and configures firewall rules on your local machine.

---

::: zone-end

## Start the emulator

Once downloaded, start the emulator with your specified API enabled.

::: zone pivot="api-apache-cassandra"

### [Docker (Linux container) / Docker (Windows container)](#tab/docker-linux+docker-windows)

The Docker container variant of the emulator doesn't support the API for Apache Cassandra.

### [Windows (local)](#tab/windows)

1. Start the emulator's executable (`Microsoft.Azure.Cosmos.Emulator.exe`) at the `%ProgramFiles%\Azure Cosmos DB Emulator` path. Use these parameters to configure the emulator:

    | | Description |
    | --- | --- |
    | **`EnableCassandraEndpoint`** | *Enables API for Apache Cassandra endpoint.* |
    | **`CassandraPort`** | *Port number to use for endpoint.* |

    ```powershell
    Microsoft.Azure.Cosmos.Emulator.exe /EnableCassandraEndpoint /CassandraPort=65200
    ```

    > [!NOTE]
    > For more information on command-line arguments, see [command-line parameters](emulator-windows-arguments.md#manage-the-emulator-with-command-line-syntax).

1. The emulator automatically opens the data explorer using the URL `https://localhost:8081/_explorer/index.html`.

---

::: zone-end

::: zone pivot="api-apache-gremlin"

### [Docker (Linux container) / Docker (Windows container)](#tab/docker-linux+docker-windows)

The Docker container variant of the emulator doesn't support the API for Apache Gremlin.

### [Windows (local)](#tab/windows)

1. Start the emulator's executable (`Microsoft.Azure.Cosmos.Emulator.exe`) at the `%ProgramFiles%\Azure Cosmos DB Emulator` path. Use these parameters to configure the emulator:

    | | Description |
    | --- | --- |
    | **`EnableGremlinEndpoint`** | *Enables API for Apache Gremlin endpoint.* |
    | **`GremlinPort`** | *Port number to use for endpoint.* |

    ```powershell
    Microsoft.Azure.Cosmos.Emulator.exe /EnableGremlinEndpoint /GremlinPort=65400
    ```

    > [!NOTE]
    > For more information on command-line arguments, see [command-line parameters](emulator-windows-arguments.md#manage-the-emulator-with-command-line-syntax).

1. The emulator automatically opens the data explorer using the URL `https://localhost:8081/_explorer/index.html`.

---

::: zone-end

::: zone pivot="api-table"

### [Docker (Linux container) / Docker (Windows container)](#tab/docker-linux+docker-windows)

The Docker container variant of the emulator doesn't support the API for Table.

### [Windows (local)](#tab/windows)

1. Start the emulator's executable (`Microsoft.Azure.Cosmos.Emulator.exe`) at the `%ProgramFiles%\Azure Cosmos DB Emulator` path. Use these parameters to configure the emulator:

    | | Description |
    | --- | --- |
    | **`EnableTableEndpoint`** | *Enables API for Table endpoint.* |
    | **`TablePort`** | *Port number to use for endpoint.* |

    ```powershell
    Microsoft.Azure.Cosmos.Emulator.exe /EnableTableEndpoint /TablePort=65500
    ```

    > [!NOTE]
    > For more information on command-line arguments, see [command-line parameters](emulator-windows-arguments.md#manage-the-emulator-with-command-line-syntax).

1. The emulator automatically opens the data explorer using the URL `https://localhost:8081/_explorer/index.html`.

---

::: zone-end

::: zone pivot="api-nosql"

### [Docker (Linux container)](#tab/docker-linux)

1. Run a new container using the container image and the following configuration:

    | | Description |
    | --- | --- |
    | **`AZURE_COSMOS_EMULATOR_PARTITION_COUNT` *(Optional)*** | *Specify the number of partitions to use.* |
    | **`AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE` *(Optional)*** | *Enable data persistence between emulator runs.* |
    | **`AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE` *(Optional)*** | *Override the emulator's default IP address.* |

    ```bash
    docker run \
        --publish 8081:8081 \
        --publish 10250-10255:10250-10255 \
        --interactive \
        --tty \
        mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest    
    ```

1. Navigate to `https://localhost:8081/_explorer/index.html` to access the data explorer.

### [Docker (Windows container)](#tab/docker-windows)

1. Create a new directory for the bind mount

1. Run a new container using the container image.

    ```powershell
    $parameters = @(
        "--publish", "8081:8081"
        "--publish", "10250-10255:10250-10255"
        "--memory", "2GB"
        "--interactive"
        "--tty"
    )
    docker run @parameters mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
    ```

1. Navigate to `https://localhost:8081/_explorer/index.html` to access the data explorer.

### [Windows (local)](#tab/windows)

1. Start the emulator by selecting the application in the Windows **Start menu**.

1. Alternatively, you can start the emulator's executable (`Microsoft.Azure.Cosmos.Emulator.exe`) at the `%ProgramFiles%\Azure Cosmos DB Emulator` path.

1. Also, you can start the emulator from the command-line. Use these parameters to configure the emulator:

    | | Description |
    | --- | --- |
    | **`Port`** | *Port number to use for the API for NoSQL endpoint.* |

    ```powershell
    Microsoft.Azure.Cosmos.Emulator.exe /Port=65000
    ```

    > [!NOTE]
    > For more information on command-line arguments, see [command-line parameters](emulator-windows-arguments.md#manage-the-emulator-with-command-line-syntax).

1. The emulator automatically opens the data explorer using the URL `https://localhost:8081/_explorer/index.html`.

---

::: zone-end

::: zone pivot="api-mongodb"

### [Docker (Linux container)](#tab/docker-linux)

1. Run a new container using the container image and the following configuration:

    | | Description |
    | --- | --- |
    | **`AZURE_COSMOS_EMULATOR_ENABLE_MONGODB_ENDPOINT`** | *Specify the version of the MongoDB endpoint to use. Supported endpoints include: `3.2`, `3.6`, or `4.0`.* |
    | **`AZURE_COSMOS_EMULATOR_PARTITION_COUNT` *(Optional)*** | *Specify the number of partitions to use.* |
    | **`AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE` *(Optional)*** | *Enable data persistence between emulator runs.* |
    | **`AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE` *(Optional)*** | *Override the emulator's default IP address.* |

    ```bash
    docker run \
        --publish 8081:8081 \
        --publish 10250:10250 \
        --env AZURE_COSMOS_EMULATOR_ENABLE_MONGODB_ENDPOINT=4.0 \
        --interactive \
        --tty \
        mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:mongodb
    ```

1. Navigate to `https://localhost:8081/_explorer/index.html` to access the data explorer.

### [Docker (Windows container)](#tab/docker-windows)

The Docker (Windows) container image doesn't support the API for MongoDB.

### [Windows (local)](#tab/windows)

1. Start the emulator's executable (`Microsoft.Azure.Cosmos.Emulator.exe`) at the `%ProgramFiles%\Azure Cosmos DB Emulator` path. Use these parameters to configure the emulator:

    | | Description |
    | --- | --- |
    | **`EnableMongoDbEndpoint`** | *Enables API for MongoDB endpoint at specified MongoDB version.* |
    | **`MongoPort`** | *Port number to use for endpoint.* |

    ```powershell
    Microsoft.Azure.Cosmos.Emulator.exe /EnableMongoDbEndpoint=4.0 /MongoPort=65200
    ```

    > [!NOTE]
    > For more information on command-line arguments and MongoDB versions supported by the emulator, see [command-line parameters](emulator-windows-arguments.md#manage-the-emulator-with-command-line-syntax).

1. The emulator automatically opens the data explorer using the URL `https://localhost:8081/_explorer/index.html`.

---

::: zone-end

## Export the emulator's TLS/SSL certificate

Export the certificate for the emulator to use the emulator with your preferred developer SDK without disable TLS/SSL on the client.

::: zone pivot="api-apache-cassandra,api-apache-gremlin,api-table"

### [Docker (Linux container) / Docker (Windows container)](#tab/docker-linux+docker-windows)

The Docker container variant (Linux or Windows) of the emulator doesn't support the API for Apache Cassandra, API for Apache Gremlin, or API for Table.

### [Windows (local)](#tab/windows)

The Windows local installation of the emulator automatically imports the TLS/SSL certificates. No further action is necessary.

::: zone-end

::: zone pivot="api-mongodb"

### [Docker (Linux container)](#tab/docker-linux)

The certificate for the emulator is available in the `_explorer/emulator.pem` path on the running container. Use `curl` to download the certificate from the running container to your local machine.

```bash
curl -k https://localhost:8081/_explorer/emulator.pem > ~/emulatorcert.crt
```

### [Docker (Windows container)](#tab/docker-windows)

The Docker (Windows) container image doesn't support the API for MongoDB.

### [Windows (local)](#tab/windows)

The Windows local installation of the emulator automatically imports the TLS/SSL certificates. No further action is necessary.

::: zone-end

::: zone pivot="api-nosql"

### [Docker (Linux container) / Docker (Windows container)](#tab/docker-linux+docker-windows)

The certificate for the emulator is available in the `_explorer/emulator.pem` path on the running container.

1. Use `curl` to download the certificate from the running container to your local machine.

    ```bash
    curl -k https://localhost:8081/_explorer/emulator.pem > ~/emulatorcert.crt
    ```

    > [!NOTE]
    > You may need to change the host (or IP address) and port number if you have previously modified those values.

1. Install the certificate according to the process typically used for your operating system. For example, in Linux you would copy the certificate to the  `/usr/local/share/ca-certificates/` path.

    ```bash
    cp ~/emulatorcert.crt /usr/local/share/ca-certificates/
    ```

### [Windows (local)](#tab/windows)

The Windows local installation of the emulator automatically imports the TLS/SSL certificates. No further action is necessary.

---

::: zone-end

## Connect to the emulator from the SDK

Each SDK includes a client class typically used to connect the SDK to your Azure Cosmos DB account. Using the [emulator's credentials](emulator.md#authentication), you can connect the SDK to the emulator instance instead.

::: zone pivot="api-nosql"  

### [C#](#tab/csharp)

Use the [Azure Cosmos DB API for NoSQL .NET SDK](nosql/quickstart-dotnet.md) to connect to the emulator from a .NET application.

1. Start in an empty folder.

1. Create a new .NET console application

    ```bash
    dotnet new console
    ```

1. Add the [`Microsoft.Azure.Cosmos`](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) package from NuGet.

    ```bash
    dotnet add package Microsoft.Azure.Cosmos
    ```

1. Open the **Program.cs** file.

1. Delete any existing content within the file.

1. Add a using block for the `Microsoft.Azure.Cosmos` namespace.

    :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/601-emulator/Program.cs" id="imports":::

1. Create a new instance of <xref:Microsoft.Azure.Cosmos.CosmosClient> using the emulator's credentials.

    :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/601-emulator/Program.cs" highlight="2-3" id="client":::

1. Create a new database and container using <xref:Microsoft.Azure.Cosmos.CosmosClient.CreateDatabaseIfNotExistsAsync%2A> and <xref:Microsoft.Azure.Cosmos.Database.CreateContainerIfNotExistsAsync%2A>.

    :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/601-emulator/Program.cs" highlight="1,6" id="resources":::

1. Create a new item in the container using <xref:Microsoft.Azure.Cosmos.Container.UpsertItemAsync%2A>.

    :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/601-emulator/Program.cs" highlight="7" id="upsert":::

1. Run the .NET application.

    ```bash
    dotnet run
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the client's options to disable TLS/SSL validation before creating the client:
    >
    > ```csharp
    > CosmosClientOptions options = new ()
    > {
    >     HttpClientFactory = () => new HttpClient(new HttpClientHandler()
    >     {
    >         ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
    >     }),
    >     ConnectionMode = ConnectionMode.Gateway,
    >     LimitToEndpoint = true
    > };
    >
    > using CosmosClient client = new(
    >   ...,
    >   ...,
    >   clientOptions: options
    > );
    > ```
    >

> [!TIP]
> Refer to the [.NET developer guide](nosql/how-to-dotnet-get-started.md) for more operations you can perform using the .NET SDK.

### [Python](#tab/python)

Use the [Azure Cosmos DB API for NoSQL Python SDK](nosql/quickstart-python.md) to connect to the emulator from a Python application.

1. Start in an empty folder.

1. Import the [`azure-cosmos`](https://pypi.org/project/azure-cosmos/) package from the Python Package Index.

    ```bash
    pip install azure-cosmos
    ```

1. Create the **app.py** file.

1. Import `CosmosClient` and `PartitionKey` from the `azure.cosmos` module.

    :::code language="python" source="~/cosmos-db-nosql-python-samples/601-emulator/app.py" id="imports":::

1. Create a new <xref:azure.cosmos.CosmosClient> using the emulator's credentials.

    :::code language="python" source="~/cosmos-db-nosql-python-samples/601-emulator/app.py" highlight="2,4-5" id="client":::

1. Create a new database and container using <xref:azure.cosmos.CosmosClient.create_database_if_not_exists> and <xref:azure.cosmos.DatabaseProxy.create_container_if_not_exists>.

    :::code language="python" source="~/cosmos-db-nosql-python-samples/601-emulator/app.py" highlight="1,6" id="resources":::

1. Use <xref:azure.cosmos.ContainerProxy.upsert_item> to create a new item in the container.

    :::code language="python" source="~/cosmos-db-nosql-python-samples/601-emulator/app.py" highlight="3" id="upsert":::

1. Run the Python application.

    ```bash
    python app.py
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the application to disable TLS/SSL validation before creating the client:
    >
    > ```python
    > import urllib3
    >
    > urllib3.disable_warnings()
    > ```
    >

### [JavaScript / Node.js](#tab/javascript+nodejs)

Use the [Azure Cosmos DB API for NoSQL Node.js SDK](nosql/quickstart-nodejs.md) to connect to the emulator from a Node.js/JavaScript application.

1. Start in an empty folder.

1. Initialize a new module.

    ```bash
    npm init es6 --yes
    ```

1. Install the [`@azure/cosmos`](https://www.npmjs.com/package/@azure/cosmos) package from Node Package Manager.

    ```bash
    npm install --save @azure/cosmos
    ```

1. Create the **app.js** file.

1. Import the `CosmosClient` type from the `@azure/cosmos` module.

    :::code language="javascript" source="~/cosmos-db-nosql-javascript-samples/601-emulator/app.js" id="imports":::

1. Use [`CosmosClient`](/javascript/api/@azure/cosmos/cosmosclient) to create a new client instance using the emulator's credentials.

    :::code language="javascript" source="~/cosmos-db-nosql-javascript-samples/601-emulator/app.js" highlight="2-3" id="client":::

1. Use [`Databases.createIfNotExists`](/javascript/api/@azure/cosmos/databases#@azure-cosmos-databases-createifnotexists) and [`Containers.createIfNotExists`](/javascript/api/%40azure/cosmos/containers#@azure-cosmos-containers-createifnotexists) to create a database and container.

    :::code language="javascript" source="~/cosmos-db-nosql-javascript-samples/601-emulator/app.js" highlight="1,6" id="resources":::

1. Upsert a new item using [`Items.upsert`](/javascript/api/@azure/cosmos/items#@azure-cosmos-items-upsert).

    :::code language="javascript" source="~/cosmos-db-nosql-javascript-samples/601-emulator/app.js" highlight="6" id="upsert":::

1. Run the Node.js application.

    ```bash
    node app.js
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the application to disable TLS/SSL validation before creating the client:
    >
    > ```javascript
    > process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
    > ```
    >

---

::: zone-end

::: zone pivot="api-mongodb"  

### [C#](#tab/csharp)

Use the [MongoDB .NET driver](mongodb/quickstart-dotnet.md) to connect to the emulator from a .NET application.

1. Start in an empty folder.

1. Create a new .NET console application

    ```bash
    dotnet new console
    ```

1. Add the [`MongoDB.Driver`](https://www.nuget.org/packages/MongoDB.Driver) package from NuGet.

    ```bash
    dotnet add package MongoDB.Driver
    ```

1. Open the **Program.cs** file.

1. Delete any existing content within the file.

1. Add a using block for the [`MongoDB.Driver`](https://mongodb.github.io/mongo-csharp-driver/2.21/apidocs/html/N_MongoDB_Driver.htm) namespace.

    :::code language="csharp" source="~/cosmos-db-mongodb-dotnet-samples/601-emulator/Program.cs" id="imports":::

1. Create a new instance of [`MongoClient`](https://mongodb.github.io/mongo-csharp-driver/2.21/apidocs/html/T_MongoDB_Driver_MongoClient.htm) using the emulator's credentials.

    :::code language="csharp" source="~/cosmos-db-mongodb-dotnet-samples/601-emulator/Program.cs" highlight="2" id="client":::

1. Get the database and container using [`GetDatabase`](https://mongodb.github.io/mongo-csharp-driver/2.21/apidocs/html/M_MongoDB_Driver_MongoClient_GetDatabase.htm) and [`GetCollection<>`](https://mongodb.github.io/mongo-csharp-driver/2.21/apidocs/html/Overload_MongoDB_Driver_MongoDatabase_GetCollection.htm).

    :::code language="csharp" source="~/cosmos-db-mongodb-dotnet-samples/601-emulator/Program.cs" id="resources":::

1. Create a new item in the XXX using [`InsertOneAsync`](https://mongodb.github.io/mongo-csharp-driver/2.21/apidocs/html/Overload_MongoDB_Driver_MongoCollectionBase_1_InsertOneAsync.htm).

    :::code language="csharp" source="~/cosmos-db-mongodb-dotnet-samples/601-emulator/Program.cs" highlight="6" id="insert":::

1. Run the .NET application.

    ```bash
    dotnet run
    ```

### [Python](#tab/python)

Use the [MongoDB Python driver](mongodb/quickstart-python.md) to connect to the emulator from a Python application.

1. Start in an empty folder.

1. Import the [`pymongo`](https://pypi.org/project/pymongo/) package from the Python Package Index.

    ```bash
    pip install pymongo
    ```

1. Create the **app.py** file.

1. Import the `os`, `sys`, and `pymongo` modules.

    :::code language="python" source="~/cosmos-db-mongodb-python-samples/601-emulator/app.py" id="imports":::

1. Create a new [`MongoClient`](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient) using the emulator's credentials.

    :::code language="python" source="~/cosmos-db-mongodb-python-samples/601-emulator/app.py" highlight="3-5" id="client":::

1. Create a new database and container using [`list_database_names`](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.list_database_names) and [`list_collection_names`](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html#pymongo.database.Database.list_collection_names) along with the [`CreateDatabase`](mongodb/custom-commands.md#create-database) and [`CreateCollection`](mongodb/custom-commands.md#create-collection) custom commands.

    :::code language="python" source="~/cosmos-db-mongodb-python-samples/601-emulator/app.py" highlight="2,5,12" id="resources":::

1. Use [`update_one`](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.update_one) to create a new item in the container.

    :::code language="python" source="~/cosmos-db-mongodb-python-samples/601-emulator/app.py" highlight="3" id="upsert":::

1. Run the Python application.

    ```bash
    python app.py
    ```

### [JavaScript / Node.js](#tab/javascript+nodejs)

Use the [MongoDB Node.js driver](mongodb/quickstart-nodejs.md) to connect to the emulator from a Node.js/JavaScript application.

1. Start in an empty folder.

1. Initialize a new module.

    ```bash
    npm init es6 --yes
    ```

1. Install the [`mongodb`](https://www.npmjs.com/package/mongodb) package from Node Package Manager.

    ```bash
    npm install --save mongodb
    ```

1. Create the **app.js** file.

1. Import the `MongoClient` type from the `mongodb` module.

    :::code language="javascript" source="~/cosmos-db-mongodb-javascript-samples/601-emulator/app.js" id="imports":::

1. Use [`MongoClient`](https://mongodb.github.io/node-mongodb-native/6.1/classes/MongoClient.html) to create a new client instance using the emulator's credentials. Use [`connect`](https://mongodb.github.io/node-mongodb-native/6.1/classes/MongoClient.html#connect) to connect to the emulator.

    :::code language="javascript" source="~/cosmos-db-mongodb-javascript-samples/601-emulator/app.js" highlight="2" id="client":::

1. Use [`db`](https://mongodb.github.io/node-mongodb-native/6.1/classes/MongoClient.html#db) and [`collection`](https://mongodb.github.io/node-mongodb-native/6.1/classes/Db.html#collection) to create a database and container.

    :::code language="javascript" source="~/cosmos-db-mongodb-javascript-samples/601-emulator/app.js" id="resources":::

1. Create a new item using [`insertOne`](https://mongodb.github.io/node-mongodb-native/6.1/classes/Collection.html#insertOne).

    :::code language="javascript" source="~/cosmos-db-mongodb-javascript-samples/601-emulator/app.js" highlight="5" id="upsert":::

1. Run the Node.js application.

    ```bash
    node app.js
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the application to disable TLS/SSL validation before creating the client:
    >
    > ```javascript
    > const client = new MongoClient(
    >   ...,
    >   { tlsAllowInvalidCertificates: true }
    > )
    > ```
    >

---

::: zone-end

::: zone pivot="api-apache-cassandra"  

### [C#](#tab/csharp)

Use the [Apache Cassandra .NET driver](cassandra/manage-data-dotnet.md) to connect to the emulator from a .NET application.

1. Start in an empty folder.

1. Create a new .NET console application

    ```bash
    dotnet new console
    ```

1. Add the [`CassandraCSharpDriver`](https://www.nuget.org/packages/CassandraCSharpDriver/) package from NuGet.

    ```bash
    dotnet add package CassandraCSharpDriver
    ```

1. Open the **Program.cs** file.

1. Delete any existing content within the file.

1. Add a using block for the [`Cassandra`](https://docs.datastax.com/en/latest-csharp-driver-api/api/Cassandra.html) namespace.

    :::code language="csharp" source="~/cosmos-db-apache-cassandra-dotnet-samples/601-emulator/Program.cs" id="imports":::

1. Create a new instance of [`Cluster`](https://docs.datastax.com/en/latest-csharp-driver-api/api/Cassandra.Cluster.html) using the emulator's credentials. Create a new session using [`Connect`](https://docs.datastax.com/en/latest-csharp-driver-api/api/Cassandra.Cluster.html#Cassandra_Cluster_Connect).

    :::code language="csharp" source="~/cosmos-db-apache-cassandra-dotnet-samples/601-emulator/Program.cs" highlight="8-9" id="client":::

1. Create a new database and container using [`PrepareAsync`](https://docs.datastax.com/en/latest-csharp-driver-api/api/Cassandra.ISession.html#Cassandra_ISession_PrepareAsync_System_String_) and [`ExecuteAsync`](https://docs.datastax.com/en/latest-csharp-driver-api/api/Cassandra.ISession.html#Cassandra_ISession_ExecuteAsync_Cassandra_IStatement_).

    :::code language="csharp" source="~/cosmos-db-apache-cassandra-dotnet-samples/601-emulator/Program.cs" highlight="2,5" id="resources":::

1. Create a new item in the table using `ExecuteAsync`. Use [`Bind`](https://docs.datastax.com/en/latest-csharp-driver-api/api/Cassandra.PreparedStatement.html#Cassandra_PreparedStatement_Bind_System_Object___) to assign properties to the item.

    :::code language="csharp" source="~/cosmos-db-apache-cassandra-dotnet-samples/601-emulator/Program.cs" highlight="9,11" id="insert":::

1. Run the .NET application.

    ```bash
    dotnet run
    ```

### [Python](#tab/python)

Use the [Apache Cassandra Python driver](cassandra/manage-data-python.md) to connect to the emulator from a Python application.

1. Start in an empty folder.

1. Import the [`cassandra-driver`](https://pypi.org/project/cassandra-driver/) package from the Python Package Index.

    ```bash
    pip install cassandra-driver
    ```

1. Create the **app.py** file.

1. Import `PROTOCOL_TLS_CLIENT`, `SSLContext`, and `CERT_NONE` from the `ssl` module. Then, import `Cluster` from the `cassandra.cluster` module. Finally, import `PlainTextAuthProvider` from the `cassandra.auth` module.

    :::code language="python" source="~/cosmos-db-apache-cassandra-python-samples/601-emulator/app.py" id="imports":::

1. Create a new TLS/SSL context variable using `SSLContext`. Configure the context to not verify the emulator's self-signed certificate.

    :::code language="python" source="~/cosmos-db-apache-cassandra-python-samples/601-emulator/app.py" highlight="1" id="ssl":::

1. Create a new `session` using the emulator's credentials, `PlainTextAuthProvider`, `Cluster`, and `cluster.connect()`.

    :::code language="python" source="~/cosmos-db-apache-cassandra-python-samples/601-emulator/app.py" highlight="1,4-5,9,15" id="client":::

1. Create a new keyspace and table using `session.execute`.

    :::code language="python" source="~/cosmos-db-apache-cassandra-python-samples/601-emulator/app.py" highlight="1,6" id="resources":::

1. Use `session.execute` to create a new item in the table.

    :::code language="python" source="~/cosmos-db-apache-cassandra-python-samples/601-emulator/app.py" highlight="2" id="upsert":::

1. Run the Python application.

    ```bash
    python app.py
    ```

### [JavaScript / Node.js](#tab/javascript+nodejs)

Use the [Apache Cassandra Node.js driver](cassandra/manage-data-nodejs.md) to use the emulator from a Node.js/JavaScript application.

1. Start in an empty folder.

1. Initialize a new module.

    ```bash
    npm init es6 --yes
    ```

1. Install the [`cassandra-driver`](https://www.npmjs.com/package/cassandra-driver) package from Node Package Manager.

    ```bash
    npm install --save cassandra-driver
    ```

1. Create the **app.js** file.

1. Import the `Client` type and `auth` namespace from the `cassandra-driver` module.

    :::code language="javascript" source="~/cosmos-db-apache-cassandra-javascript-samples/601-emulator/app.js" id="imports":::

1. Use [`PlainTextAuthProvider`](https://docs.datastax.com/en/developer/nodejs-driver/4.6/api/module.auth/class.PlainTextAuthProvider/) to create a new object for the emulator's credentials. Use [`Client`](https://docs.datastax.com/en/developer/nodejs-driver/4.6/api/class.Client/) to connect to the emulator using the credentials.

    :::code language="javascript" source="~/cosmos-db-apache-cassandra-javascript-samples/601-emulator/app.js" highlight="2-3" id="client":::

1. Use [`execute`](https://docs.datastax.com/en/developer/nodejs-driver/4.6/api/class.Client/#execute) to run a command server-side to create a **keyspace** and **table**.

    :::code language="javascript" source="~/cosmos-db-apache-cassandra-javascript-samples/601-emulator/app.js" highlight="1,5" id="resources":::

1. Use `execute` again to create a new item with parameters.

    :::code language="javascript" source="~/cosmos-db-apache-cassandra-javascript-samples/601-emulator/app.js" highlight="6" id="insert":::

1. Run the Node.js application.

    ```bash
    node app.js
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the client to disable TLS/SSL validation:
    >
    > ```javascript
    > const client = new Client({
    >   ...,
    >   ...,
    >   ...,
    >   sslOptions: {
    >     rejectUnauthorized: false
    >   }
    > })
    > ```
    >

---

::: zone-end

::: zone pivot="api-apache-gremlin"  

> [!IMPORTANT]
> Prior to starting, the API for Apache Gremlin requires you to create your resources in the emulator. Create a database named `db1` and a container named `coll1`. The throughput settings are irrelevant for this guide and can be set as low as you'd like.

### [C#](#tab/csharp)

Use the [Apache Gremlin .NET driver](gremlin/quickstart-dotnet.md) to connect to the emulator from a .NET application.

1. Start in an empty folder.

1. Create a new .NET console application

    ```bash
    dotnet new console
    ```

1. Add the [`Gremlin.Net`](https://www.nuget.org/packages/Gremlin.Net) package from NuGet.

    ```bash
    dotnet add package Gremlin.Net 
    ```

1. Open the **Program.cs** file.

1. Delete any existing content within the file.

1. Add a using block for the [`Gremlin.Net.Driver`](https://tinkerpop.apache.org/dotnetdocs/3.4.6/api/Gremlin.Net.Driver.html) namespace.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/601-emulator/Program.cs" id="imports":::

1. Create a new instance of [`GremlinServer`](https://tinkerpop.apache.org/dotnetdocs/3.4.6/api/Gremlin.Net.Driver.GremlinServer.html) and [`GremlinClient`](https://tinkerpop.apache.org/dotnetdocs/3.4.6/api/Gremlin.Net.Driver.GremlinClient.html) using the emulator's credentials.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/601-emulator/Program.cs" highlight="" id="client":::

1. Clean up the graph using [`SubmitAsync`](https://tinkerpop.apache.org/dotnetdocs/3.4.6/api/Gremlin.Net.Driver.GremlinClient.html#Gremlin_Net_Driver_GremlinClient_SubmitAsync__1_RequestMessage_).

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/601-emulator/Program.cs" highlight="1" id="graph":::

1. Use `SubmitAsync` again to add a new item to the graph with the specified parameters.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/601-emulator/Program.cs" highlight="1" id="insert":::

1. Run the .NET application.

    ```bash
    dotnet run
    ```

### [Python](#tab/python)

Use the [Apache Gremlin Python driver](gremlin/quickstart-python.md) to connect to the emulator from a Python application.

1. Start in an empty folder.

1. Import the [`gremlinpython`](https://pypi.org/project/gremlinpython/) package from the Python Package Index.

    ```bash
    pip install gremlinpython
    ```

1. Create the **app.py** file.

1. Import `client` from the `gremlin_python.driver` module.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/601-emulator/app.py" id="imports":::

1. Create a new `Client` using the emulator's credentials.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/601-emulator/app.py" highlight="1" id="client":::

1. Clean up the graph using `client.submit`.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/601-emulator/app.py" id="graph":::

1. Use `client.submit` again to add a new item to the graph with the specified parameters.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/601-emulator/app.py" highlight="1" id="insert":::

1. Run the Python application.

    ```bash
    python app.py
    ```

### [JavaScript / Node.js](#tab/javascript+nodejs)

Use the [Apache Gremlin Node.js driver](gremlin/quickstart-nodejs.md) to use the emulator from a Node.js/JavaScript application.

1. Start in an empty folder.

1. Initialize a new module.

    ```bash
    npm init es6 --yes
    ```

1. Install the [`gremlin`](https://www.npmjs.com/package/gremlin) package from Node Package Manager.

    ```bash
    npm install --save gremlin
    ```

1. Create the **app.js** file.

1. Import the `gremlin` module.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/601-emulator/app.js" id="imports":::

1. Use [`PlainTextSaslAuthenticator`](https://tinkerpop.apache.org/jsdocs/3.7.0/PlainTextSaslAuthenticator.html) to create a new object for the emulator's credentials. Use [`Client`](https://tinkerpop.apache.org/jsdocs/3.7.0/Client.html) to connect to the emulator using the credentials.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/601-emulator/app.js" highlight="1" id="client":::

1. Use [`submit`](https://tinkerpop.apache.org/jsdocs/3.7.0/Client.html#submit) to run a command server-side to clear the graph if it already has data.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/601-emulator/app.js" id="graph":::

1. Use `submit` again to add a new item to the graph with the specified parameters.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/601-emulator/app.js" highlight="1" id="insert":::

1. Run the Node.js application.

    ```bash
    node app.js
    ```

---

::: zone-end

::: zone pivot="api-table"  

### [C#](#tab/csharp)

Use the [Azure Tables SDK for .NET](table/quickstart-dotnet.md) to connect to the emulator from a .NET application.

1. Start in an empty folder.

1. Create a new .NET console application

    ```bash
    dotnet new console
    ```

1. Add the [`Azure.Data.Tables`](https://www.nuget.org/packages/Azure.Data.Tables) package from NuGet.

    ```bash
    dotnet add package Azure.Data.Tables
    ```

1. Open the **Program.cs** file.

1. Delete any existing content within the file.

1. Add a using block for the [`Azure.Data.Tables`](/dotnet/api/azure.data.tables) namespace.

    :::code language="csharp" source="~/cosmos-db-table-dotnet-samples/601-emulator/Program.cs" id="imports":::

1. Create a new instance of [`TableServiceClient`](/dotnet/api/azure.data.tables.tableserviceclient) using the emulator's credentials.

    :::code language="csharp" source="~/cosmos-db-table-dotnet-samples/601-emulator/Program.cs" highlight="2" id="client":::

1. Use [`GetTableClient`](/dotnet/api/azure.data.tables.tableserviceclient.gettableclient) to create a new instance of [`TableClient`](/dotnet/api/azure.data.tables.tableclient) with the table's name. Then ensure the table exists using [`CreateIfNotExistsAsync`](/dotnet/api/azure.data.tables.tableclient.createifnotexistsasync).

    :::code language="csharp" source="~/cosmos-db-table-dotnet-samples/601-emulator/Program.cs" highlight="1,5" id="resources":::

1. Create a new `record` type for items.

    :::code language="csharp" source="~/cosmos-db-table-dotnet-samples/601-emulator/Product.cs" id="entity":::

1. Create a new item in the table using [`UpsertEntityAsync`](/dotnet/api/azure.data.tables.tableclient.upsertentityasync) and the `Replace` mode.

    :::code language="csharp" source="~/cosmos-db-table-dotnet-samples/601-emulator/Program.cs" highlight="9,11" id="upsert":::

1. Run the .NET application.

    ```bash
    dotnet run
    ```

### [Python](#tab/python)

Use the [Azure Tables Python SDK](table/quickstart-python.md) to connect to the emulator from a Python application.

1. Start in an empty folder.

1. Import the [`azure-data-tables`](https://pypi.org/project/azure-data-tables/) package from the Python Package Index.

    ```bash
    pip install azure-data-tables
    ```

1. Create the **app.py** file.

1. Import [`TableServiceClient`](/python/api/azure-data-tables/azure.data.tables.tableserviceclient) and [`UpdateMode`](/python/api/azure-data-tables/azure.data.tables.updatemode) from the `azure.data.tables` module.

    :::code language="python" source="~/cosmos-db-table-python-samples/601-emulator/app.py" id="imports":::

1. Use [`TableServiceClient.from_connection_string`](/python/api/azure-data-tables/azure.data.tables.tableserviceclient#azure-data-tables-tableserviceclient-from-connection-string) to create a new service-level client.

    :::code language="python" source="~/cosmos-db-table-python-samples/601-emulator/app.py" highlight="1" id="client":::

1. Create a new table-level client using [`create_table_if_not_exists`](/python/api/azure-data-tables/azure.data.tables.tableserviceclient#azure-data-tables-tableserviceclient-create-table-if-not-exists).

    :::code language="python" source="~/cosmos-db-table-python-samples/601-emulator/app.py" id="resources":::

1. Use [`upsert_entity`](/python/api/azure-data-tables/azure.data.tables.tableclient#azure-data-tables-tableclient-upsert-entity) to create a new item in the container.

    :::code language="python" source="~/cosmos-db-table-python-samples/601-emulator/app.py" highlight="7" id="upsert":::

1. Run the Python application.

    ```bash
    python app.py
    ```

### [JavaScript / Node.js](#tab/javascript+nodejs)

Use the [Azure Tables JavaScript SDK](cassandra/manage-data-nodejs.md) to use the emulator from a Node.js/JavaScript application.

1. Start in an empty folder.

1. Initialize a new module.

    ```bash
    npm init es6 --yes
    ```

1. Install the [`@azure/data-tables`](https://www.npmjs.com/package/@azure/data-tables) package from Node Package Manager.

    ```bash
    npm install --save @azure/data-tables
    ```

1. Create the **app.js** file.

1. Import the `TableClient` type from the `@azure/data-tables` module.

    :::code language="javascript" source="~/cosmos-db-table-javascript-samples/601-emulator/app.js" id="imports":::

1. Use [`TableClient.fromConnectionString`](/javascript/api/@azure/data-tables/tableclient#@azure-data-tables-tableclient-fromconnectionstring) to create a new client instance using the emulator's connection string.

    :::code language="javascript" source="~/cosmos-db-table-javascript-samples/601-emulator/app.js" highlight="2" id="client":::

1. Use [`createTable`](/javascript/api/@azure/data-tables/tableclient#@azure-data-tables-tableclient-createtable) to create a new table if it doesn't already exist.

    :::code language="javascript" source="~/cosmos-db-table-javascript-samples/601-emulator/app.js" id="resources":::

1. Use [`upsertEntity`](/javascript/api/%40azure/data-tables/tableclient#@azure-data-tables-tableclient-upsertentity) to create or replace the item.

    :::code language="javascript" source="~/cosmos-db-table-javascript-samples/601-emulator/app.js" highlight="7" id="upsert":::

1. Run the Node.js application.

    ```bash
    node app.js
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the client to disable TLS/SSL validation:
    >
    > ```javascript
    > const client = TableClient.fromConnectionString(
    >   ...,
    >   ...,
    >   {
    >     allowInsecureConnection: true
    >   }
    > )
    > ```
    >

---

::: zone-end

## Use the emulator in a GitHub Actions CI workflow

Use the Azure Cosmos DB emulator with a test suite from your framework of choice to run a continuous integration workload that automatically validates your application. The Azure Cosmos DB emulator is preinstalled in the [`windows-latest`](https://github.com/actions/runner-images/blob/main/images/win/Windows2022-Readme.md) variant of GitHub Action's hosted runners.

### [C#](#tab/csharp)

Run a test suite using the built-in test driver for .NET and a testing framework such as **MSTest**, **NUnit**, or **XUnit**.

1. Validate that the unit test suite for your application works as expected.

    ```bash
    dotnet test
    ```

1. Create a new workflow in your GitHub repository in a file named `.github/workflows/ci.yml`.

1. Add a job to your workflow to start the Azure Cosmos DB emulator using PowerShell and run your unit test suite.

    ```yaml
    name: Continuous Integration
    on:
      push:
        branches:
          - main
    jobs:
      unit_tests:
        name: Run .NET unit tests
        runs-on: windows-latest
        steps:
          - name: Checkout (GitHub)
            uses: actions/checkout@v3
          - name: Start Azure Cosmos DB emulator
            run: >-
              Write-Host "Launching Cosmos DB Emulator"
              Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"
              Start-CosmosDbEmulator
          - name: Run .NET tests
            run: dotnet test
    ```

    > [!NOTE]
    > Start the emulator from the command line using various arguments or PowerShell commands. For more information, see [emulator command-line arguments](emulator-windows-arguments.md).

### [Python](#tab/python)

Test your Python application and database operations using [`pytest`](https://pypi.org/project/pytest/).

1. Validate that the unit test suite for your application works as expected.

    ```bash
    pip install -U pytest

    pytest
    ```

1. Create a new workflow in your GitHub repository in a file named `.github/workflows/ci.yml`.

1. Add a job to your workflow to start the Azure Cosmos DB emulator using PowerShell and run your unit test suite.

    ```yaml
    name: Continuous Integration
    on:
      push:
        branches:
          - main
    jobs:
      unit_tests:
        name: Run Python unit tests
        runs-on: windows-latest
        steps:
          - name: Checkout (GitHub)
            uses: actions/checkout@v3
          - name: Start Azure Cosmos DB emulator
            run: >-
              Write-Host "Launching Cosmos DB Emulator"
              Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"
              Start-CosmosDbEmulator
          - name: Install test runner
            run: pip install pytest
          - name: Run Python tests
            run: pytest
    ```

    > [!NOTE]
    > Start the emulator from the command line using various arguments or PowerShell commands. For more information, see [emulator command-line arguments](emulator-windows-arguments.md).

### [JavaScript / Node.js](#tab/javascript+nodejs)

Use [`mocha`](https://www.npmjs.com/package/mocha) to test your Node.js application and its database modifications.

1. Validate that the unit test suite for your application works as expected.

    ```bash
    npm install --global mocha

    mocha
    ```

1. Create a new workflow in your GitHub repository in a file named `.github/workflows/ci.yml`.

1. Add a job to your workflow to start the Azure Cosmos DB emulator using PowerShell and run your unit test suite.

    ```yaml
    name: Continuous Integration
    on:
      push:
        branches:
          - main
    jobs:
      unit_tests:
        name: Run Node.js unit tests
        runs-on: windows-latest
        steps:
          - name: Checkout (GitHub)
            uses: actions/checkout@v3
          - name: Start Azure Cosmos DB emulator
            run: >-
              Write-Host "Launching Cosmos DB Emulator"
              Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"
              Start-CosmosDbEmulator
          - name: Install test runner
            run: npm install --global mocha
          - name: Run Node.js tests
            run: mocha
    ```

    > [!NOTE]
    > Start the emulator from the command line using various arguments or PowerShell commands. For more information, see [emulator command-line arguments](emulator-windows-arguments.md).

---

## Next step

> [!div class="nextstepaction"]
> [Review the emulator's release notes](emulator-release-notes.md)
