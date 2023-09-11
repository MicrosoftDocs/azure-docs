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

The Docker container variant of the emulator doesn't support the API for Apache Cassandra, API for Apache Gremlin, or API for Table.

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
        --publish 10251-10254:10251-10254 \
        --interactive \
        --tty \
        mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest    
    ```

### [Docker (Windows container)](#tab/docker-windows)

1. Run a new container using the container image and the following configuration:

    | | Description |
    | --- | --- |
    | **`AZURE_COSMOS_EMULATOR_PARTITION_COUNT` *(Optional)*** | *Specify the number of partitions to use.* |
    | **`AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE` *(Optional)*** | *Enable data persistence between emulator runs.* |
    | **`AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE` *(Optional)*** | *Override the emulator's default IP address.* |

    ```powershell
    $parameters = @(
        '--publish 8081:8081'
        '--publish 10251-10254:10251-10254'
        '--interactive'
        '--tty'
    )
    docker run @parameters mcr.microsoft.com/cosmosdb/windows/azure-cosmos-emulator
    ```

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

TODO

### [Docker (Linux container)](#tab/docker-linux)

TODO

1. TODO

### [Docker (Windows container)](#tab/docker-windows)

TODO

1. TODO

### [Windows (local)](#tab/windows)

TODO

1. TODO

---

## Connect to the emulator from the SDK

TODO

::: zone pivot="api-nosql"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

  ```bash

  ```

1. TODO

  ```bash

  ```

### [Node.js](#tab/nodejs)

TODO

1. TODO

  ```bash
  npm init --force
  ```

1. TODO

  ```bash
  npm install --save 
  ```

::: zone-end

::: zone pivot="api-mongodb"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

::: zone pivot="api-apache-cassandra"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

::: zone pivot="api-apache-gremlin"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

::: zone pivot="api-table"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

---

## Perform operations in the emulator using the SDK

TODO

::: zone pivot="api-nosql"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

::: zone pivot="api-mongodb"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

::: zone pivot="api-apache-cassandra"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

::: zone pivot="api-apache-gremlin"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

::: zone pivot="api-table"  

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

::: zone-end

---

## Use the emulator in a GitHub Actions CI workflow

TODO

1. TODO

1. TODO

1. TODO

### [C#](#tab/csharp)

TODO

1. TODO

### [Python](#tab/python)

TODO

1. TODO

### [Node.js](#tab/nodejs)

TODO

1. TODO

---

## Next step

> [!div class="nextstepaction"]
> [Review the emulator's release notes](emulator-release-notes.md)
