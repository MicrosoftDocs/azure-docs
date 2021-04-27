---
title: Running the emulator on Docker for Linux
description: Learn how to run and use the Azure Cosmos DB Linux Emulator on Linux, and macOS. Using the emulator you can develop and test your application locally for free, without creating an Azure subscription.
ms.service: cosmos-db
ms.topic: how-to
author: StefArroyo
ms.author: esarroyo
ms.date: 04/20/2021
---

The Azure Cosmos DB Linux Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Currently, the Linux emulator only supports SQL API. Using the Azure Cosmos DB Emulator, you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the Azure Cosmos DB Emulator, you can switch to using an Azure Cosmos account in the cloud. This article describes how to install and use the emulator on macOS and Linux environments.

> [!NOTE]
> The Cosmos DB Linux Emulator is currently in preview mode and supports only the SQL API. A known limitation when comparing with the Windows emulator is that the Linux emulator data will not be retained between container restarts. Users may experience slight performance degradations in terms of the number of requests per second processed by the emulator when compared to the Windows version. The default number of physical partitions which directly impacts the number of containers that can be provisioned is 10.
> 
> For more heavy workloads, please use our [Windows emulator](local-emulator.md).


# How does the emulator work?
The Azure Cosmos DB Emulator provides a high-fidelity emulation of the Azure Cosmos DB service. It supports equivalent functionality as the Azure Cosmos DB, which includes creating data, querying data, provisioning and scaling containers, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos DB Linux Emulator, and deploy them to Azure at global scale by updating the Azure Cosmos DB connection endpoint.

Functionality that relies on the Azure infrastructure like global replication, single-digit millisecond latency for reads/writes, and tunable consistency levels are not applicable when you use the emulator.

# Differences between the Linux Emulator and the cloud service
Since the Azure Cosmos DB Emulator provides an emulated environment that runs on the local developer workstation, there are some differences in functionality between the emulator and an Azure Cosmos account in the cloud:

- Currently, the **Data Explorer** pane in the emulator fully supports SQL API clients only.

- With the Linux emulator, you can create an Azure Cosmos account in [provisioned throughput](set-throughput.md) mode only; currently it doesn't support [serverless](serverless.md) mode.

- The Linux emulator is not a scalable service and it doesn't support a large number of containers. When using the Azure Cosmos DB Emulator, by default, you can create up to 10 fixed size containers at 400 RU/s (only supported using Azure Cosmos DB SDKs), or 5 unlimited containers. For more information on how to change this value, see [Set the PartitionCount value](emulator-command-line-parameters.md#set-partitioncount) article.

- While [consistency levels](consistency-levels.md) like the cloud service does. can be adjusted using command-line arguments for testing scenarios only (default setting is Session), a user might not expect the same behavior as in the cloud service. For instance, Strong and Bounded staleness consistency has no effect on the emulator, other than signaling to the Cosmos DB SDK the default consistency of the account.

- The Linux emulator does not offer [multi-region replication](distribute-data-globally.md).

- Because the copy of your Azure Cosmos DB Linux Emulator might not always be up to date with the most recent changes in the Azure Cosmos DB service, you should always refer to the [Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md) to accurately estimate the throughput (RUs) needs of your application. <add link>

- The Linux emulator supports a maximum ID property size of 254 characters.

# Run Cosmos DB Linux Emulator on macOS

1. To get started, visit Docker Hub and install Docker Desktop for macOS. More details here: https://hub.docker.com/editions/community/docker-ce-desktop-mac/ 


2. Next, retrieve the IP address of your local machine. This step is required when the Direct mode setting is configured when using Cosmos DB SDKs (.NET, Java).

    ```bash
    ipaddr="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
    ```

3. Pull the Docker image from the registry.
    ```bash
    docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
    ```

4. Run the Docker image with the following configurations:

    ```bash
    docker run -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10350:10350  -m 3g --cpus=2.0 --name=test-linux-emulator -e AZURE_COSMOS_EMULATOR_PARTITION_COUNT=10 -e AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE=$ipaddr -it mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
    ```

    Alternatively, you can use the Docker compose file available at <ADD GIST LINK>.


## Installing the Certificate
 
1. Once the emulator is running, using a different terminal, load the IP address of your local machine into a variable.

    ```bash
    ipaddr="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
    ```


2. Next, download the certificate of the emulator.

    ```bash
    curl -k https://$ipaddr:8081/_explorer/emulator.pem > emulatorcert.crt
    ```
    Alternatively, the endpoint above which downloads the self-signed emulator certificate, it can also be used for signaling when the emulator endpoint is ready to receive requests from another application.

3. Copy the CRT file to the folder that contains custom certificates in your Linux distribution. Commonly on Debian distributions, it is located on `/usr/local/share/ca-certificates/`.

   ```bash
   cp YourCTR.crt /usr/local/share/ca-certificates/
   ```

4. Update the TLS/SSL certificates, which will update the `/etc/ssl/certs/` folder.

   ```bash
   update-ca-certificates
   ```

Alternatively, for Java-based applications, the certificate must be imported in the Java trusted store. For more information on how to do this, see: <add link>

## Consuming endpoint via UI

The emulator is using a self-signed certificate to secure the connectivity to its endpoint and needs to be manually trusted.

In order to consume the endpoint via the UI using your desired web browser, follow the below steps:

-	Open Keychain Access
-	File > Import Items > emulatorcert.crt
-	Once the emulatorcert.crt is loaded into KeyChain
-	Double-click on the name, it should be easy identified as "localhost"
-	Change the trust settings to "Always Trust"

You can now browse https://localhost:8081/_explorer/index.html or https://{your_local_ip}:8081/_explorer/index.html and get the connection string to your Cosmos DB emulator.

# Run Cosmos DB Linux Emulator on Linux

1. To get started, use `apt` package and install the latest version of Docker. 

    ```bash
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    ```

2. Next, retrieve the IP address of your local machine, this link allows you to communicate directly from SDKs (.NET, Java) in direct mode.

    ```bash
    ipaddr="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
    ```

3. Pull the Docker image from the registry.
    ```bash
    docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
    ```

4. Run the Docker image with the following configurations:

    ```bash
    docker run -p 8081:8081 -p 8900:8900 -p 8901:8901 -p 8902:8902 -p 10250:10250 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -p 10255:10255 -p 10350:10350  -m 4g --cpus=2.0 --name=test-linux-emulator -e AZURE_COSMOS_EMULATOR_PARTITION_COUNT=3 -e AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE=$ipaddr -it mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
   ```
    Alternatively, the endpoint above which downloads the self-signed emulator certificate, it can also be used for signaling when the emulator endpoint is ready to receive requests from another application.

5. Copy the CRT file to the folder that contains custom certificates in your Linux distribution. Commonly on Debian distributions, it is located on `/usr/local/share/ca-certificates/`.

   ```bash
   cp YourCTR.crt /usr/local/share/ca-certificates/
   ```

6. Update the TLS/SSL certificates, which will update the `/etc/ssl/certs/` folder.

   ```bash
   update-ca-certificates
   ```

Alternatively, for Java-based applications, the certificate must be imported in the Java trusted store. For more information on how to do this, see: <add link>    

## Options

|Name  |Default  |Description  |
|---------|---------|---------|
|  Ports:  `-p`   |         |   Currently, only ports 8081 and 10251-10255 are needed by the emulator endpoint.     |
| `AZURE_COSMOS_EMULATOR_PARTITION_COUNT`    |    10     |    Controls the total number of physical partitions, which in return controls the number of containers that can be created and can exist at a given point in time. We recommend to start small to improve the emulator start up time, i.e 3.     |
|  Memory: `-m`   |         | On memory, 3 GB or more is required.     |
| Cores:   `--cpus`  |         |   Make sure to provision enough memory and CPU cores; while the emulator might run with as little as 0.5 cores (very slow though) at least 2 cores are recommended.      |

## Troubleshooting

# Connectivity
1. I can't start data explorer. (ip address setting)
1. My app can't connect to emulator endpoint.
1. My app received too many connectivity-related timeouts. 
1. My app can't provision databases/containers.

# Reliability/Crashes
1. Emulator fails to start.
2. Emulator is crashing.
3. I can't view my data.
1. Data explorer errors.

# Performance
1. Number of requests per second is low, latency of the requests is high. 

# Refresh Linux Container
pull the latest image


docker ps --all


docker rm ID_OF_CONTAINER_FROM_ABOVE


docker images


docker rmi ID_OF_IMAGE_FROM_ABOVE



docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator

docker start -ai ID_OF_CONTAINER