---
title: Run the Azure Cosmos DB emulator on Docker for Linux
description: Learn how to run and use the Azure Cosmos DB Linux Emulator on Linux, and macOS. Using the emulator you can develop and test your application locally for free, without an Azure subscription.
ms.service: cosmos-db
ms.topic: how-to
author: StefArroyo
ms.author: esarroyo
ms.date: 06/04/2021
---

# Run the emulator on Docker for Linux (Preview)

The Azure Cosmos DB Linux Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Currently, the Linux emulator only supports SQL API. Using the Azure Cosmos DB Emulator, you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the Azure Cosmos DB Linux Emulator, you can switch to using an Azure Cosmos DB account in the cloud. This article describes how to install and use the emulator on macOS and Linux environments.

> [!NOTE]
> The Cosmos DB Linux Emulator is currently in preview mode and supports only the SQL API. Users may experience slight performance degradations in terms of the number of requests per second processed by the emulator when compared to the Windows version. The default number of physical partitions which directly impacts the number of containers that can be provisioned is 10.
> 
> We do not recommend use of the emulator (Preview) in production. For heavier workloads, use our [Windows emulator](local-emulator.md).

## How does the emulator work?

The Azure Cosmos DB Linux Emulator provides a high-fidelity emulation of the Azure Cosmos DB service. It supports equivalent functionality as the Azure Cosmos DB, which includes creating data, querying data, provisioning and scaling containers, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos DB Linux Emulator, and deploy them to Azure at global scale by updating the Azure Cosmos DB connection endpoint.

Functionality that relies on the Azure infrastructure like global replication, single-digit millisecond latency for reads/writes, and tunable consistency levels are not applicable when you use the emulator.

## Differences between the Linux Emulator and the cloud service
Since the Azure Cosmos DB Emulator provides an emulated environment that runs on the local developer workstation, there are some differences in functionality between the emulator and an Azure Cosmos account in the cloud:

- Currently, the **Data Explorer** pane in the emulator fully supports SQL API clients only.

- With the Linux emulator, you can create an Azure Cosmos account in [provisioned throughput](set-throughput.md) mode only; currently it doesn't support [serverless](serverless.md) mode.

- The Linux emulator is not a scalable service and it doesn't support a large number of containers. When using the Azure Cosmos DB Emulator, by default, you can create up to 10 fixed size containers at 400 RU/s (only supported using Azure Cosmos DB SDKs), or 5 unlimited containers. For more information on how to change this value, see [Set the PartitionCount value](emulator-command-line-parameters.md#set-partitioncount) article.

- While [consistency levels](consistency-levels.md) can be adjusted using command-line arguments for testing scenarios only (default setting is Session), a user might not expect the same behavior as in the cloud service. For instance, Strong and Bounded staleness consistency has no effect on the emulator, other than signaling to the Cosmos DB SDK the default consistency of the account.

- The Linux emulator does not offer [multi-region replication](distribute-data-globally.md).

- Because the copy of your Azure Cosmos DB Linux Emulator might not always be up to date with the most recent changes in the Azure Cosmos DB service, you should always refer to the [Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md) to accurately estimate the throughput (RUs) needs of your application.

- The Linux emulator supports a maximum ID property size of 254 characters.

## <a id="run-on-macos"></a>Run the Linux Emulator on macOS

> [!NOTE]
> The emulator only supports MacBooks with Intel processors.

To get started, visit the Docker Hub and install [Docker Desktop for macOS](https://hub.docker.com/editions/community/docker-ce-desktop-mac/). Use the following steps to run the emulator on macOS:

[!INCLUDE[linux-emulator-instructions](includes/linux-emulator-instructions.md)]

## <a id="install-certificate"></a>Install the certificate

1. After the emulator is running, using a different terminal, load the IP address of your local machine into a variable.

    ```bash
    ipaddr="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
    ```

1. Next, download the certificate for the emulator.

    ```bash
    curl -k https://$ipaddr:8081/_explorer/emulator.pem > emulatorcert.crt
    ```


## <a id="consume-endpoint-ui"></a>Consume the endpoint via UI

The emulator is using a self-signed certificate to secure the connectivity to its endpoint and needs to be manually trusted. Use the following steps to consume the endpoint via the UI using your desired web browser:

1. Make sure you've downloaded the emulator self-signed certificate

   ```bash
   curl -k https://$ipaddr:8081/_explorer/emulator.pem > emulatorcert.crt
   ```

1. Open the **Keychain Access** app on your Mac to import the emulator certificate.

1. Select **File** and **Import Items** and import the **emulatorcert.crt**.

1. After the *emulatorcert.crt* is loaded into KeyChain, double-click on the **localhost** name and change the trust settings to **Always Trust**.

1. You can now browse to `https://localhost:8081/_explorer/index.html` or `https://{your_local_ip}:8081/_explorer/index.html` and retrieve the connection string to the emulator.

Optionally, you can disable SSL validation on your application. This is only recommended for development purposes and should not be done when running in a production environment.

## <a id="run-on-linux"></a>Run the Linux Emulator on Linux OS

To get started, use the `apt` package and install the latest version of Docker.

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

If you are using Windows Subsystem for Linux (WSL), run the following command to get `ifconfig`:

```bash
sudo apt-get install net-tools
```

Use the following steps to run the emulator on Linux:

[!INCLUDE[linux-emulator-instructions](includes/linux-emulator-instructions.md)]

4. After the emulator is running, using a different terminal, load the IP address of your local machine into a variable.

    ```bash
    ipaddr="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
    ```

5. Next, download the certificate for the emulator. Alternatively, the endpoint below which downloads the self-signed emulator certificate, can also be used for signaling when the emulator endpoint is ready to receive requests from another application.

    ```bash
    curl -k https://$ipaddr:8081/_explorer/emulator.pem > ~/emulatorcert.crt
    ```

6. Copy the CRT file to the folder that contains custom certificates in your Linux distribution. Commonly on Debian distributions, it is located on `/usr/local/share/ca-certificates/`.

   ```bash
   cp ~/emulatorcert.crt /usr/local/share/ca-certificates/
   ```

7. Update the TLS/SSL certificates, which will update the `/etc/ssl/certs/` folder.

   ```bash
   update-ca-certificates
   ```

    For Java-based applications, the certificate must be imported to the [Java trusted store.](local-emulator-export-ssl-certificates.md)

    ```bash
    keytool -keystore ~/cacerts -importcert -alias  emulator_cert -file ~/emulatorcert.crt
    java -ea -Djavax.net.ssl.trustStore=~/cacerts -Djavax.net.ssl.trustStorePassword="changeit" $APPLICATION_ARGUMENTS
    ```

## <a id="config-options"></a>Configuration options

|Name  |Default  |Description  |
|---------|---------|---------|
|  Ports:  `-p`   |         |   Currently, only ports 8081 and 10251-10255 are needed by the emulator endpoint.     |
| `AZURE_COSMOS_EMULATOR_PARTITION_COUNT`    |    10     |    Controls the total number of physical partitions, which in return controls the number of containers that can be created and can exist at a given point in time. We recommend starting small to improve the emulator start up time, i.e 3.     |
|  Memory: `-m`   |         | On memory, 3 GB or more is required.     |
| Cores:   `--cpus`  |         |   Make sure to provision enough memory and CPU cores; while the emulator might run with as little as 0.5 cores (very slow though) at least 2 cores are recommended.      |
|`AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE`  | false  | This setting used by itself will help persist the data between container restarts.  |

## <a id="troubleshoot-issues"></a>Troubleshoot issues

This section provides tips to troubleshoot errors when using the Linux emulator.

### Connectivity issues

#### My app can't connect to emulator endpoint ("The SSL connection could not be established") or I can't start the Data Explorer

- Ensure the emulator is running with the following command:

    ```bash
    docker ps --all
    ```

- Verify that the specific emulator container is in a running state.

- Verify that no other applications are using emulator ports: 8081 and 10250-10255.

- Verify that the container port 8081, is mapped correctly and accessible from an environment outside of the container.  

   ```bash
   netstat -lt
   ```

- Try to access the endpoint and port for the emulator using the Docker container's IP address instead of "localhost".

- Make sure that the emulator self-signed certificate has been properly added to [KeyChain](#consume-endpoint-ui).

- For Java applications, make sure you imported the certificate to the [Java Certificates Store section](#run-on-linux).

- For .NET applications you can disable SSL validation:

# [.NET Standard 2.1+](#tab/ssl-netstd21)

For any application running in a framework compatible with .NET Standard 2.1 or later, we can leverage the `CosmosClientOptions.HttpClientFactory`:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/HttpClientFactory/Program.cs?name=DisableSSLNETStandard21)]

# [.NET Standard 2.0](#tab/ssl-netstd20)

For any application running in a framework compatible with .NET Standard 2.0, we can leverage the `CosmosClientOptions.HttpClientFactory`:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/HttpClientFactory/Program.cs?name=DisableSSLNETStandard20)]

---

#### My Node.js app is reporting a self-signed certificate error

If you attempt to connect to the emulator via an address other than `localhost`, such as the containers IP address, Node.js will raise an error about the certificate being self-signed, even if the certificate has been installed.

TLS verification can be disabled by setting the environment variable `NODE_TLS_REJECT_UNAUTHORIZED` to `0`:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```

This flag is only recommended for local development as it disables TLS for Node.js. More information can be found on in [Node.js documentation](https://nodejs.org/api/cli.html#cli_node_tls_reject_unauthorized_value) and the [Cosmos DB Emulator Certificates documentation](local-emulator-export-ssl-certificates.md#how-to-use-the-certificate-in-nodejs).

#### The Docker container failed to start

The emulator errors out with the following message:

```bash
/palrun: ERROR: Invalid mapping of address 0x40037d9000 in reserved address space below 0x400000000000. Possible causes:
1. The process (itself, or via a wrapper) starts up its own running environment sets the stack size limit to unlimited via syscall setrlimit(2);
2. The process (itself, or via a wrapper) adjusts its own execution domain and flag the system its legacy personality via syscall personality(2);
3. Sysadmin deliberately sets the system to run on legacy VA layout mode by adjusting a sysctl knob vm.legacy_va_layout.
```

This error is likely because the current Docker Host processor type is incompatible with our Docker image; that is, the computer is a MacBook with a M1 chipset.

#### My app received too many connectivity-related timeouts

- The Docker container is not provisioned with enough resources [(cores or memory)](#config-options). We recommend increasing the number of cores and alternatively, reduce the number of physical partitions provisioned upon startup.

- Ensure the number of TCP connections does not exceed your current OS settings.

- Try reducing the size of the documents in your application.
    
#### My app could not provision databases/containers

The number of physical partitions provisioned on the emulator is too low. Either delete your unused databases/collections or start the emulator with a [larger number of physical partitions](#config-options).

### Reliability and crashes

- The emulator fails to start:

  - Make sure you are [running the latest image of the Cosmos DB emulator for Linux](#refresh-linux-container). Otherwise, see the section above regarding connectivity-related issues.

  - If the Cosmos DB emulator data folder is "volume mounted", ensure that the volume has enough space and is read/write.

  - Confirm that creating a container with the recommended settings works. If yes, most likely the cause of failure was the additional settings passed via the respective Docker command upon starting the container.

  - If the emulator fails to start with the following error:
  
    ```bash
    "Failed loading Emulator secrets certificate. Error: 0x8009000f or similar, a new policy might have been added to your host that prevents an application such as Azure Cosmos DB emulator from creating and adding self signed certificate files into your certificate store."
    ```

    This can be the case even when you run in Administrator context, since the specific policy usually added by your IT department takes priority over the local Administrator. Using a Docker image for the emulator instead might help in this case, as long as you still have the permission to add the self-signed emulator SSL certificate into your host machine context (this is required by Java and .NET Cosmos SDK client application).

- The emulator is crashing:

  - Confirm that creating a container with the [recommended settings](#run-on-linux) works. If yes, most likely the cause of failure is the additional settings passed via the respective Docker command upon starting the container.

  - Start the emulator's Docker container in an attached mode (see `docker start -it`).

  - Collect the crash-related dump/data and follow the [steps outlined](#report-an-emulator-issue) to report the issue.  

### Data explorer errors

- I can't view my data:

  - See section regarding connectivity-related issues above.

  - Make sure that the self-signed emulator certificate is properly imported and manually trusted in order for your browser to access the data explorer page.

  - Try creating a database/container and inserting an item using the Data Explorer. If successful, most likely the cause of the issue resides within your application. If not, [contact the Cosmos DB team](#report-an-emulator-issue).

### Performance issues

Number of requests per second is low, latency of the requests is high:

- The Docker container is not provisioned with enough resources [(cores or memory)](#config-options). We recommend increasing the number of cores and alternatively, reduce the number of physical partitions provisioned upon startup.

## <a id="refresh-linux-container"></a>Refresh Linux container

Use the following steps to refresh the Linux container:

1. Run the following command to view all Docker containers.

   ```bash
   docker ps --all
   ```

1. Remove the container using the ID retrieved from above command.

   ```bash
   docker rm ID_OF_CONTAINER_FROM_ABOVE
   ```

1. Next list all Docker images.

   ```bash
   docker images
   ```

1. Remove the image using the ID retrieved from previous step.

   ```bash
   docker rmi ID_OF_IMAGE_FROM_ABOVE
   ```

1. Pull the latest image of the Cosmos DB Linux Emulator.

   ```bash
   docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
   ```

1. To start a stopped container run the following:

   ```bash
   docker start -ai ID_OF_CONTAINER
   ```

## Report an emulator issue

When reporting an issue with the Linux emulator, provide as much information as possible about your issue. These details include:

- Description of the error/issue encountered
- Environment (OS, host configuration)
- Computer and processor type
- Command used to create and start the emulator (YML file if Docker compose is used)
- Description of the workload
- Sample of the database/collection and item used
- Include the console output from starting the Docker container for the emulator in attached mode
- Send all of the above to [Azure Cosmos DB team](mailto:cdbportalfeedback@microsoft.com).

## Next steps

In this article, you've learned how to use the Azure Cosmos DB Linux emulator for free local development. You can now proceed to the next articles:

- [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js apps](local-emulator-export-ssl-certificates.md)
- [Debug issues with the emulator](troubleshoot-local-emulator.md)
