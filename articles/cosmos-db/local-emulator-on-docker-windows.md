---
title: Running the emulator on Docker for Windows
itleSuffix: Running the Azure Cosmos DB emulator on Docker for Windows
description: Learn how to run and use the Azure Cosmos DB Emulator on Docker for Windows. Using the emulator you can develop and test your application locally for free, without creating an Azure subscription.
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
author: StefArroyo
ms.author: esarroyo
ms.date: 04/20/2021
---

# <a id="run-on-windows-docker"></a>Use the emulator on Docker for Windows
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

You can run the Azure Cosmos DB Emulator on a Windows Docker container. See [GitHub](https://github.com/Azure/azure-cosmos-db-emulator-docker) for the `Dockerfile` and more information. Currently, the emulator does not work on Docker for Oracle Linux. Use the following instructions to run the emulator on Docker for Windows:

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
   Windows based Docker images might not be generally compatible with every Windows host OS. For instance, the default Azure Cosmos DB Emulator image is only compatible with Windows 10 and Windows Server 2016. If you need an image that is compatible with Windows Server 2019, run the following command instead:

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

If you have a .NET client application running on a Linux docker container and if you are running Azure Cosmos DB Emulator on a host machine, use the instructions in the next section to import the certificate into the Linux docker container.

## Regenerate the emulator certificates

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

## Next steps

In this article, you've learned how to use the local emulator for free local development. You can now proceed to the next articles:

* [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js apps](local-emulator-export-ssl-certificates.md)
* [Use command line parameters and PowerShell commands to control the emulator](emulator-command-line-parameters.md)
* [Debug issues with the emulator](troubleshoot-local-emulator.md)
