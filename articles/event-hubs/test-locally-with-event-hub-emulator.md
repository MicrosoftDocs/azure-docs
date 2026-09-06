---
title: Test Applications Locally with the Azure Event Hubs Emulator  
description: Learn how to test your applications locally using the Azure Event Hubs emulator. Follow step-by-step instructions to set up, run, and interact with the emulator using Docker or scripts.
#customer intent: As a developer, I want to test my application locally using the Azure Event Hubs emulator so that I can validate its functionality without connecting to the cloud.  
ms.topic: how-to
author: spelluru
ms.author: spelluru
ms.date: 08/25/2026
ai-usage: ai-assisted
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/28/2025
  - ai-gen-description
  - sfi-ropc-nochange
---

# Test locally by using the Azure Event Hubs emulator

The Azure Event Hubs emulator lets you test and validate your applications locally, without connecting to the cloud. This article shows you how to set up, run, and interact with the emulator by using Docker or an automated script.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)
- Minimum hardware requirements:
  - 2 GB of RAM
  - 5 GB of disk space
- Windows Subsystem for Linux (WSL) configuration (Windows only):
  - [Install WSL](/windows/wsl/install)
  - [Configure Docker Desktop to use WSL](https://docs.docker.com/desktop/wsl/)

> [!NOTE]
> Before you continue with the steps in this article, ensure Docker Desktop is running.

## Run the Azure Event Hubs emulator

Run the Azure Event Hubs emulator by using either an automated script or a Linux container. Choose the method that best fits your development environment.

### [Automated script](#tab/automated-script)

Before you run an automated script, clone the emulator's [GitHub installer repository](https://github.com/Azure/azure-event-hubs-emulator-installer) locally.

### Windows

Use the following steps to run the Event Hubs emulator locally on Windows.

1. Open PowerShell and go to the directory where you cloned the [common scripts folder](https://github.com/Azure/azure-event-hubs-emulator-installer/tree/main/EventHub-Emulator/Scripts/Common), by using `cd`.

   ```powershell
   cd <path to your common scripts folder> # Update this path
   ```

1. Enter the `wsl` command to open WSL in this directory.

   ```powershell
   wsl
   ```

1. Run the setup script `LaunchEmulator.sh`. The script brings up two containers: the Event Hubs emulator and Azurite, a dependency for the emulator.

   ```bash
   ./LaunchEmulator.sh
   ```

### Linux and macOS

To run the Event Hubs emulator locally on Linux or macOS:

- Run the setup script *LaunchEmulator.sh*. Running the script brings up two containers: the Event Hubs emulator and Azurite (a dependency for the emulator).

### [Docker (Linux container)](#tab/docker-linux-container)

1. To start the emulator, provide a configuration for the entities that you want to use. Save the following JSON locally as *config.json*:

   ```json
   {
       "UserConfig": {
           "NamespaceConfig": [
           {
               "Type": "EventHub",
               "Name": "emulatorNs1",
               "Entities": [
               {
                   "Name": "eh1",
                   "PartitionCount": "2",
                   "ConsumerGroups": [
                   {
                       "Name": "cg1"
                   }
                   ]
               }
               ]
           }
           ],
           "LoggingConfig": {
               "Type": "File"
           }
       }
   }
   ```

1. To spin up the containers for the Event Hubs emulator, save the following file as *docker-compose.yaml*:

   ```yaml
   name: microsoft-azure-eventhubs
   services:
     emulator:
       container_name: "eventhubs-emulator"
       image: "mcr.microsoft.com/azure-messaging/eventhubs-emulator:latest"
       pull_policy: always
       volumes:
         - "${CONFIG_PATH}:/Eventhubs_Emulator/ConfigFiles/Config.json"
       ports:
         - "5672:5672"
         - "9092:9092"
         - "5300:5300"
       environment:
         BLOB_SERVER: azurite
         METADATA_SERVER: azurite
         ACCEPT_EULA: ${ACCEPT_EULA}
       depends_on:
         - azurite
       networks:
         eh-emulator:
           aliases:
             - "eventhubs-emulator"
     azurite:
       container_name: "azurite"
       image: "mcr.microsoft.com/azure-storage/azurite:latest"
       pull_policy: always
       ports:
         - "10000:10000"
         - "10001:10001"
         - "10002:10002"
       networks:
         eh-emulator:
           aliases:
             - "azurite"
   networks:
     eh-emulator:
   ```

1. Create an *.env* file to declare the environment variables for the Event Hubs emulator:

   ```text
   # Centralized environment variables store for docker-compose

   # 1. CONFIG_PATH: Path to the config.json file
   CONFIG_PATH="<Replace with path to config.json file>"

   # 2. ACCEPT_EULA: Pass 'Y' to accept the license terms.
   ACCEPT_EULA="N"
   ```

   The `ACCEPT_EULA` argument confirms the [Microsoft Software License Terms](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EMULATOR_EULA.md). Set it to `Y` to accept the terms and start the emulator. Place the *.env* file in the same directory as the *docker-compose.yaml* file.

   > [!IMPORTANT]
   > When you specify file paths in Windows, use double backslashes (`\\`) instead of single backslashes (`\`) to avoid confusion with escape characters.

1. To run the emulator, run the following command:

   ```bash
   docker compose -f <PathToDockerComposeFile> up -d
   ```

   ---

After the steps are successful, you can find the containers running in Docker.

:::image type="content" source="./media/test-locally-with-event-hub-emulator/test-locally-with-event-hub-emulator.png" alt-text="Screenshot of the Azure Event Hubs emulator running in a container.":::

## Interact with the emulator

By default, the emulator uses the [config.json](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EventHub-Emulator/Config/Config.json) configuration file. You can configure entities, such as event hubs and Kafka topics, by editing this file. For more information, see [Quota configuration changes](overview-emulator.md#quota-configuration-changes).

The connection string that you use to connect to the Event Hubs emulator depends on where your application runs:

- When the emulator container and your application run natively on the local machine, use this connection string:

  ```text
  "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
  ```

- When your application runs on a different machine on the same local network (containerized or not), connect to the emulator by using the IPv4 address of the host machine:

  ```text
  "Endpoint=sb://192.168.y.z;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
  ```

- When your application container runs on the same bridge network, connect to the emulator by using its alias or IP address. This connection string assumes that the emulator uses the default name, `eventhubs-emulator`:

  ```text
  "Endpoint=sb://eventhubs-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
  ```

- When your application container runs on a different bridge network, connect to the emulator by using `host.docker.internal` as the host:

  ```text
  "Endpoint=sb://host.docker.internal;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
  ```

### [Using Kafka](#tab/using-kafka)

To interact with Kafka, set the producer and consumer configuration as follows:

```csharp
{
    BootstrapServers =  // The value depends on the connection string that you use.
    SecurityProtocol = SecurityProtocol.SaslPlaintext,
    SaslMechanism = SaslMechanism.Plain,
    SaslUsername = "$ConnectionString",
    SaslPassword =  // The value depends on your topology.
};
```

The values of `BootstrapServers` and `SaslPassword` depend on your setup topology. For details, see the [Interact with the emulator](#interact-with-the-emulator) section.

> [!IMPORTANT]
> When you use Kafka, only the producer and consumer APIs are compatible with the Event Hubs emulator.

### [Using AMQP](#tab/using-amqp)

By using the latest client SDK releases, you can interact with the emulator in various programming languages. For details, see
[Client SDKs](./sdks.md).


---

To get started, see the [Event Hubs emulator samples on GitHub](https://github.com/Azure/azure-event-hubs-emulator-installer/tree/main/Sample-Code-Snippets/dotnet/EventHubs-Emulator-Demo/EventHubs-Emulator-Demo).

## Related content

- [Overview of the Azure Event Hubs emulator](overview-emulator.md)
- [Event Hubs emulator samples on GitHub](https://github.com/Azure/azure-event-hubs-emulator-installer/tree/main/Sample-Code-Snippets/dotnet/EventHubs-Emulator-Demo/EventHubs-Emulator-Demo)
