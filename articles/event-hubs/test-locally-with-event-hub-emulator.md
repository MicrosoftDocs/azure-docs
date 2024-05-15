---
title: Test locally with Azure Event Hubs emulator
description: This article describes how to develop and test locally with Event Hubs emulator. 
ms.topic: how-to
ms.author: Saglodha
ms.date: 05/05/2024
---

# Test locally with Event Hubs emulator 

This article summarizes the steps to develop and test locally with Event hubs emulator. To read more about Event hubs, read [here](event-hubs-about.md).

## Prerequisites

- Docker emulator
  - [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/#:~:text=Install%20Docker%20Desktop%20on%20Windows%201%20Download%20the,on%20your%20choice%20of%20backend.%20...%20More%20items) 
- Minimum hardware Requirements:
  - 2GB RAM
  - 5GB of Disk space
- WSL Enablement (Only for Windows):
  - [Install Windows Subsystem for Linux (WSL) | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/install)
  -  [Configure Docker to use WSL](https://docs.docker.com/desktop/wsl/#:~:text=Turn%20on%20Docker%20Desktop%20WSL%202%201%20Download,engine%20..%20...%206%20Select%20Apply%20%26%20Restart.)

>[!NOTE]
>Before you continue with the subsequent steps, make sure Docker Desktop is operational in the background.
---
## Running the emulator 

This section highlights different steps to run Event Hubs emulator. Details are as follows:

### [Automated Script](#tab/automated-script)

 Before running automated script, clone the Event Hubs emulator GitHub [repository](https://github.com/Azure/azure-event-hubs-emulator) locally.
 
### Windows
After completing the prerequisites, you can proceed with the following steps to run the Event Hubs emulator locally. 
1. Before executing the setup script, we need to allow execution of unsigned scripts. Run the below command in the powershell window:

`$>Start-Process powershell -Verb RunAs -ArgumentList 'Set-ExecutionPolicy Bypass –Scope CurrentUser’`

2. Execute setup script `LaunchEmulator.ps1`. Running the script would bring up two containers – Event Hubs emulator & Azurite (dependency for Emulator)
3. Once the steps are successful, you could find containers running in Docker Desktop.

### Linux & MacOS
After completing the prerequisites, you can proceed with the following steps to run the Event Hubs emulator locally. 

1. Execute the setup script `LaunchEmulator.sh` . Running the script would  bring up two containers – Event Hubs emulator & Azurite (dependency for Emulator)
2. Once the steps are successful, you could find containers running in Docker.



### [Docker (Linux Container)](#tab/docker-linux-container)
1. To start the emulator, you should supply configuration for the entities you want to use. Save the below config locally as config.json

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

2. Save below yaml file as docker-compose.yaml to spin up containers for Event Hubs emulator.
```
name: microsoft-azure-eventhubs
services:
  emulator:
    container_name: "eventhubs-emulator"
    image: "messagingemulators.azurecr.io/microsoft/azure/eventhubs/emulator:latest"
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
3. Create .env file to declare the environment variables for event hubs emulator. 

```
# Centralized environment variables store for docker-compose
 
# 1. CONFIG_PATH: Path to config.json file
CONFIG_PATH="<Replace with path to config.json file>" 
 
# 2. ACCEPT_EULA: Pass 'Y' to accept license terms. 
ACCEPT_EULA="N"

```

>[!IMPORTANT]
>Argument 'ACCEPT_EULA' is to confirm on the license terms, read more about the license [here](https://github.com/Azure/azure-event-hubs-emulator/blob/main/LICENSE)
>. Ensure to place .env file in same directory to docker-compose.yaml file.
>. When specifying file paths in Windows, use double backslashes (`\\`) instead of single backslashes (`\`) to avoid issues with escape characters.

4. **Run below command to run emulator**

```
 docker compose -f <PathToDockerComposeFile> up -d
```
---  
## Interacting with Emulator

You can use the following connection string to connect to Azure Event Hubs emulator.
```
"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```
To get started, refer to our GitHub Samples [here](https://github.com/Azure/azure-event-hubs-emulator/tree/main/Sample-Code-Snippets)

## Next Steps

Read more about Azure event hubs emulator [here](overview-emulator.md)
