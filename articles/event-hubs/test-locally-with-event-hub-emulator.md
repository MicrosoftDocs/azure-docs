---
title: Test locally by using the Azure Event Hubs emulator
description: This article describes how to develop and test locally by using the Event Hubs emulator. 
ms.topic: how-to
ms.author: Saglodha
ms.date: 05/05/2024
---

# Test locally by using the Azure Event Hubs emulator

This article summarizes the steps to develop and test locally by using the Azure Event Hubs emulator.

## Prerequisites

- [Docker desktop](https://docs.docker.com/desktop/install/windows-install/#:~:text=Install%20Docker%20Desktop%20on%20Windows%201%20Download%20the,on%20your%20choice%20of%20backend.%20...%20More%20items) 
- Minimum hardware requirements:
  - 2 GB of RAM
  - 5 GB of disk space
- Windows Subsystem for Linux (WSL) configuration (only for Windows):
  - [Install WSL](/windows/wsl/install)
  - [Configure Docker to use WSL](https://docs.docker.com/desktop/wsl/#:~:text=Turn%20on%20Docker%20Desktop%20WSL%202%201%20Download,engine%20..%20...%206%20Select%20Apply%20%26%20Restart)

> [!NOTE]
> Before you continue with the steps in this article, make sure Docker Desktop is operational in the background.

## Run the emulator

To run the Event Hubs emulator, you can use an automated script or a Linux container:

### [Automated script](#tab/automated-script)

Before you run an automated script, clone the emulator's [GitHub installer repository](https://github.com/Azure/azure-event-hubs-emulator-installer) locally.

### Windows

Use the following steps to run the Event Hubs emulator locally on Windows:

1. Allow the execution of unsigned scripts by running this command in the PowerShell window:

   `$>Start-Process powershell -Verb RunAs -ArgumentList 'Set-ExecutionPolicy Bypass –Scope CurrentUser'`

1. Run the setup script *LaunchEmulator.ps1*. Running the script brings up two containers: the Event Hubs emulator and Azurite (a dependency for the emulator).

### Linux and macOS

To run the Event Hubs emulator locally on Linux or macOS:

- Run the setup script *LaunchEmulator.sh*. Running the script brings up two containers: the Event Hubs emulator and Azurite (a dependency for the emulator).

### [Docker (Linux container)](#tab/docker-linux-container)

1. To start the emulator, supply a configuration for the entities that you want to use. Save the following JSON file locally as *config.json*:

   ```JSON
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

1. Save the following .yaml file as *docker-compose.yaml* to spin up containers for the Event Hubs emulator:

   ```
   name: microsoft-azure-eventhubs
   services:
     emulator:
       container_name: "eventhubs-emulator"
       image: "mcr.microsoft.com/azure-messaging/eventhubs-emulator:latest"
       volumes:
         - "${CONFIG_PATH}:/Eventhubs_Emulator/ConfigFiles/Config.json"
       ports:
         - "5672:5672"
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

1. Create an .env file to declare the environment variables for the Event Hubs emulator:

   ```
   # Centralized environment variables store for docker-compose
 
   # 1. CONFIG_PATH: Path to config.json file
   CONFIG_PATH="<Replace with path to config.json file>" 
 
   # 2. ACCEPT_EULA: Pass 'Y' to accept license terms. 
   ACCEPT_EULA="N"

   ```

   The argument `ACCEPT_EULA` confirms the [Microsoft Software License Terms](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EMULATOR_EULA.md). Be sure to place the .env file in the same directory as the *docker-compose.yaml* file.
   
   > [!IMPORTANT]
   > When you're specifying file paths in Windows, use double backslashes (`\\`) instead of single backslashes (`\`) to avoid confusion with escape characters.

1. Run the following command to run the emulator:

   ```
    docker compose -f <PathToDockerComposeFile> up -d
   ```

   ---

After the steps are successful, you can find the containers running in Docker.

:::image type="content" source="./media/test-locally-with-event-hub-emulator/test-locally-with-event-hub-emulator.png" alt-text="Screenshot that shows the Event Hubs emulator running in a container.":::

## Interact with the emulator

You can use the following connection string to connect to the Event Hubs emulator:

```
"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```

With the latest client SDK releases, you can interact with the emulator in various programming languages. For details, see
[Client SDKs](./sdks.md).

To get started, refer to the [Event Hubs emulator samples on GitHub](https://github.com/Azure/azure-event-hubs-emulator-installer/tree/main/Sample-Code-Snippets/.NET/EventHubs-Emulator-Demo).

## Related content

[Overview of the Azure Event Hubs emulator](overview-emulator.md)
