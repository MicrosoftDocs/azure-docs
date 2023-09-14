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

### [Docker (Windows container)](#tab/docker-windows)

To get started, get the Windows-variant of the container image from the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com).

1. Pull the `mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator` Windows container image from the container registry to the local Docker host.

    ```powershell
    docker pull mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
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

1. Install the certificate according to the process typically used for your operating system. For example, in Linux you would copy the certificate to the  `/usr/local/share/ca-certificats/` path.

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

Use the [Azure Cosmos DB API for NoSQL .NET SDK](nosql/quickstart-dotnet.md) to use the emulator from a .NET application.

1. Start in an empty folder

1. Create a new .NET console application

    ```bash
    dotnet new console
    ```

1. Add the [`Microsoft.Azure.Cosmos`](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) package from NuGet.

    ```bash
    dotnet add package Microsoft.Azure.Cosmos
    ```

1. Build your .NET project

    ```bash
    dotnet build
    ```

1. Open the **Program.cs** file.

1. Delete any existing content within the file.

1. Add a using block for the `Microsoft.Azure.Cosmos` namespace. Then, create a new instance of <xref:Microsoft.Azure.Cosmos.CosmosClient> using the emulator's credentials.

    ```csharp
    using Microsoft.Azure.Cosmos;
    
    using CosmosClient client = new(
        accountEndpoint: "https://localhost:8081/",
        authKeyOrResourceToken: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
    );
    ```

1. Create a new database and container using <xref:Microsoft.Azure.Cosmos.CosmosClient.CreateDatabaseIfNotExistsAsync%2A> and <xref:Microsoft.Azure.Cosmos.Database.CreateContainerIfNotExistsAsync%2A>.

    ```csharp
    Database database = await client.CreateDatabaseIfNotExistsAsync(
        id: "cosmicworks",
        throughput: 400
    );
    
    Container container = await database.CreateContainerIfNotExistsAsync(
        id: "products",
        partitionKeyPath: "/id"
    );
    ```

1. Create a new item in the container using <xref:Microsoft.Azure.Cosmos.Container.UpsertItemAsync%2A>.

    ```csharp
    var item = new
    {
        id = "68719518371",
        name = "Kiama classic surfboard"
    };
    
    await container.UpsertItemAsync(item);
    ```

1. Run the .NET application.

    ```bash
    dotnet run
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the client class to disable TLS/SSL validation:
    >
    > ```csharp
    > CosmosClientOptions options = new ()
    > {
    >     HttpClientFactory = () => new HttpClient(new HttpClientHandler()
    >     {
    >         ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
    >     }),
    >     ConnectionMode = ConnectionMode.Gateway
    > };
    > 
    > using CosmosClient client = new(
    >     accountEndpoint: "https://localhost:8081/",
    >     authKeyOrResourceToken: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    >     clientOptions: options
    > );
    > ```
    >

> [!TIP]
> Refer to the [.NET developer guide](nosql/how-to-dotnet-get-started.md) for more operations you can perform using the .NET SDK.

### [Python](#tab/python)

Use the [Azure Cosmos DB API for NoSQL Python SDK](nosql/quickstart-python.md) to use the emulator from a Python application.

1. Start in an empty folder

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
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the client to disable TLS/SSL validation:
    >
    > ```python
    > import urllib3
    >
    > urllib3.disable_warnings()
    > client = CosmosClient(
    >     url="https://localhost:8081",
    >     credential="C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    > )
    > ```
    >

### [Node.js](#tab/nodejs)

Use the [Azure Cosmos DB API for NoSQL Node.js SDK](nosql/quickstart-nodejs.md) to use the emulator from a Node.js/JavaScript application.

1. Start in an empty folder

1. Initialize a new module.

    ```bash
    npm init es6 --yes
    ```

1. Install the [`@azure/cosmos`](https://www.npmjs.com/package/@azure/cosmos) package from Node Package Manager.

    ```bash
    npm install --save @azure/cosmos
    ```

1. Create the **index.js** file.

1. Import the `CosmosClient` type from the `@azure/cosmos` module.

    ```javascript
    import { CosmosClient } from "@azure/cosmos";
    ```

1. Use [`CosmosClient`](/javascript/api/@azure/cosmos/cosmosclient) to create a new client instance using the emulator's credentials.

    ```javascript
    const cosmosClient = new CosmosClient({
        endpoint: 'https://localhost:8081/',
        key: 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=='
    });
    ```

1. Use [`Databases.createIfNotExists`](/javascript/api/@azure/cosmos/databases#@azure-cosmos-databases-createifnotexists) and [`Containers.createIfNotExists`](/javascript/api/%40azure/cosmos/containers#@azure-cosmos-containers-createifnotexists) to create a database and container.

    ```javascript
    const { database } = await cosmosClient.databases.createIfNotExists({ 
        id: 'cosmicworks',
        throughput: 400
    });
    
    const { container } = await database.containers.createIfNotExists({
        id: 'products',
        partitionKey: {
            paths: ["/id"]
        }
    });
    ```

1. Upsert a new item using [`Items.upsert`](/javascript/api/@azure/cosmos/items#@azure-cosmos-items-upsert).

    ```javascript
    var item = {
        "id": "68719518371",
        "name": "Kiama classic surfboard"
    };
    
    await container.items.upsert(item);
    ```

1. Run the Node.js application.

    ```bash
    node index.js
    ```

    > [!WARNING]
    > If you get a SSL error, you may need to disable TLS/SSL for your application. This commonly occurs if you are developing on your local machine, using the Azure Cosmos DB emulator in a container, and have not [imported the container's SSL certificate](#export-the-emulators-tlsssl-certificate). To resolve this, configure the client class to disable TLS/SSL validation:
    >
    > ```javascript
    > process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    > const cosmosClient = new CosmosClient({
    >     endpoint: '<https://localhost:8081/>',
    >     key: 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=='
    > });
    > ```
    >

---

::: zone-end

::: zone pivot="api-mongodb"  

### [C#](#tab/csharp)

Use the [MongoDB .NET driver](mongodb/quickstart-dotnet.md) to use the emulator from a .NET application.

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```csharp
    
    ```

### [Python](#tab/python)

Use the [MongoDB Python driver](mongodb/quickstart-python.md) to use the emulator from a Python application.

1. Start in an empty folder

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

### [Node.js](#tab/nodejs)

Use the [MongoDB Node.js driver](mongodb/quickstart-nodejs.md) to use the emulator from a Node.js/JavaScript application.

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```javascript
    
    ```

---

::: zone-end

::: zone pivot="api-apache-cassandra"  

### [C#](#tab/csharp)

TODO

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```csharp
    
    ```

### [Python](#tab/python)

Use the [Apache Cassandra Python driver](cassandra/manage-data-python.md) to use the emulator from a Python application.

1. Start in an empty folder

1. Import the [`cassandra-driver`](https://pypi.org/project/cassandra-driver/) package from the Python Package Index.

    ```bash
    pip install cassandra-driver
    ```

1. Create the **app.py** file.

1. Import `PROTOCOL_TLS_CLIENT`, `SSLContext`, and `CERT_NONE` from the `ssl` module. Then, import `Cluster` from the `cassandra.cluster` module. Finally, import `PlainTextAuthProvider` from the `cassandra.auth` module.

    :::code language="python" source="~/cosmos-db-nosql-apache-cassandra-samples/601-emulator/app.py" id="imports":::

1. Create a new TLS/SSL context variable using `SSLContext`. Configure the context to not verify the emulator's self-signed certificate.

    :::code language="python" source="~/cosmos-db-nosql-apache-cassandra-samples/601-emulator/app.py" highlight="1" id="ssl":::

1. Create a new `session` using the emulator's credentials, `PlainTextAuthProvider`, `Cluster`, and `cluster.connect()`.

    :::code language="python" source="~/cosmos-db-nosql-apache-cassandra-samples/601-emulator/app.py" highlight="1,4-5,9,15" id="client":::

1. Create a new keyspace and table using `session.execute`.

    :::code language="python" source="~/cosmos-db-nosql-apache-cassandra-samples/601-emulator/app.py" highlight="1,6" id="resources":::

1. Use `session.execute` to create a new item in the table.

    :::code language="python" source="~/cosmos-db-nosql-apache-cassandra-samples/601-emulator/app.py" highlight="2" id="upsert":::

1. Run the Python application.

    ```bash
    python app.py
    ```

### [Node.js](#tab/nodejs)

TODO

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```javascript
    
    ```

---

::: zone-end

::: zone pivot="api-apache-gremlin"  

### [C#](#tab/csharp)

TODO

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```csharp
    
    ```

### [Python](#tab/python)

Use the [Apache Gremlin Python driver](gremlin/quickstart-python.md) to use the emulator from a Python application.

1. Start in an empty folder

1. Import the [`gremlinpython`](https://pypi.org/project/gremlinpython/) package from the Python Package Index.

    ```bash
    pip install gremlinpython
    ```

1. Create the **app.py** file.

1. Import `client` from the `gremlin_python.driver` module.

    :::code language="python" source="~/cosmos-db-nosql-apache-gremlin-samples/601-emulator/app.py" id="imports":::

1. Create a new `Client` using the emulator's credentials.

    :::code language="python" source="~/cosmos-db-nosql-apache-gremlin-samples/601-emulator/app.py" highlight="1" id="client":::

1. Clean up the graph using `client.submit`.

    :::code language="python" source="~/cosmos-db-nosql-apache-gremlin-samples/601-emulator/app.py" id="graph":::

1. Use `client.submit` to add a new item.

    :::code language="python" source="~/cosmos-db-nosql-apache-gremlin-samples/601-emulator/app.py" highlight="1" id="insert":::

1. Run the Python application.

    ```bash
    python app.py
    ```

### [Node.js](#tab/nodejs)

TODO

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```javascript
    
    ```

---

::: zone-end

::: zone pivot="api-table"  

### [C#](#tab/csharp)

TODO

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```csharp
    
    ```

### [Python](#tab/python)

Use the [Azure Tables Python SDK](table/quickstart-python.md) to use the emulator from a Python application.

1. Start in an empty folder

1. Import the [`azure-data-tables`](https://pypi.org/project/azure-data-tables/) package from the Python Package Index.

    ```bash
    pip install azure-data-tables
    ```

1. Create the **app.py** file.

1. Import [`TableServiceClient`](/python/api/azure-data-tables/azure.data.tables.tableserviceclient) and [`UpdateMode`](/python/api/azure-data-tables/azure.data.tables.updatemode) from the `azure.data.tables` module.

    ```python
    from azure.data.tables import TableServiceClient, UpdateMode
    ```

1. Use [`TableServiceClient.from_connection_string`](/python/api/azure-data-tables/azure.data.tables.tableserviceclient#azure-data-tables-tableserviceclient-from-connection-string) to create a new service-level client.

    ```python
    service = TableServiceClient.from_connection_string(
        conn_str="DefaultEndpointsProtocol=http;AccountName=localhost;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==;TableEndpoint=http://localhost:8902/;"
    )
    ```

1. Create a new table-level client using [`create_table_if_not_exists`](/python/api/azure-data-tables/azure.data.tables.tableserviceclient#azure-data-tables-tableserviceclient-create-table-if-not-exists).

    ```python
    client = service.create_table_if_not_exists(
        table_name="cosmicworksproducts"
    )
    ```

1. Use [`upsert_entity`](/python/api/azure-data-tables/azure.data.tables.tableclient#azure-data-tables-tableclient-upsert-entity) to create a new item in the container.

    ```python
    item = {
        "PartitionKey": "68719518371",
        "RowKey": "Surfboards",
        "name": "Kiama classic surfboard"
    }

    client.upsert_entity(
        entity=item,
        mode=UpdateMode.REPLACE
    )
    ```

1. Run the Python application.

    ```bash
    python app.py
    ```

### [Node.js](#tab/nodejs)

TODO

1. Start in an empty folder

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```javascript
    
    ```

---

::: zone-end

## Use the emulator in a GitHub Actions CI workflow

Use the Azure Cosmos DB emulator with a test suite from your framework of choice to run a continuous integration workload that automatically validates your application. The Azure Cosmos DB emulator is preinstalled in the [`windows-latest`](https://github.com/actions/runner-images/blob/main/images/win/Windows2022-Readme.md) variant of GitHub Action's hosted runners.

### [C#](#tab/csharp)

Run a test suite using the built-in test driver for .NET and a testing framework such as **MSTest**, **NUnit**, or **XUnit**.

1. Validate that the test suite for your application works as expected.

    ```bash
    
    ```

1. TODO

1. TODO

    ```yaml
    
    ```

### [Python](#tab/python)

Test your Python application and database operations using [`pytest`](https://pypi.org/project/pytest/).

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```yaml
    
    ```

### [Node.js](#tab/nodejs)

Use [`mocha`](https://www.npmjs.com/package/mocha) to test your Node.js application and its database modifications.

1. TODO

    ```bash
    
    ```

1. TODO

1. TODO

    ```yaml
    
    ```

---

## Next step

> [!div class="nextstepaction"]
> [Review the emulator's release notes](emulator-release-notes.md)
