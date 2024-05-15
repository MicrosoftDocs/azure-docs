---
title: Test locally with Azure Event Hubs emulator
description: This article describes how to develop and test locally with Event Hubs emulator. 
ms.topic: how-to
ms.author: Saglodha
ms.date: 05/05/2024
---

# Test locally with Event Hubs emulator 

This article summarizes the steps to develop and test locally with Event hubs emulator. To read more about Event hubs,read [here](event-hubs-about.md).

## Prerequisites

- Docker emulator
  - [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/#:~:text=Install%20Docker%20Desktop%20on%20Windows%201%20Download%20the,on%20your%20choice%20of%20backend.%20...%20More%20items) 
- Minimum hardware Requirements:
  - 2GB RAM
  - 5GB of Disk space
- WSL Enablement (Only for Windows):
  - [Install Windows Subsystem for Linux (WSL) | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/install)
  -  [Configure Docker to use WSL](https://docs.docker.com/desktop/wsl/#:~:text=Turn%20on%20Docker%20Desktop%20WSL%202%201%20Download,engine%20..%20...%206%20Select%20Apply%20%26%20Restart.)

> [!NOTE]
> Before you continue with the subsequent steps, make sure Docker Desktop is operational in the background.
---
## Running the emulator 

This section highlights different steps to run Event Hubs emulator. Details are as follows:

### [Automated Script](#tab/automated-script)

 Before running automated script, clone the Event Hubs emulator GitHub [repository](https://github.com/Azure/azure-event-hubs-emulator) locally.
 
#### [Windows](#tab/Windows)
After completing the prerequisites, you can proceed with the following steps to run the Event Hubs emulator locally. 
1. Before executing the setup script, we need to allow execution of unsigned scripts. Run the below command in the powershell window:

`$>Start-Process powershell -Verb RunAs -ArgumentList 'Set-ExecutionPolicy Bypass –Scope CurrentUser’`

2. Execute setup script `LaunchEmulator.ps1`. Running the script would bring up two containers – Event Hubs emulator & Azurite (dependency for Emulator)
3. Once the steps are successful, you could find containers running in Docker Desktop.

#### [Linux](#tab/Linux)
After completing the prerequisites, you can proceed with the following steps to run the Event Hubs emulator locally. 

1. Execute the setup script `LaunchEmulator.sh` . Running the script would  bring up two containers – Event Hubs emulator & Azurite (dependency for Emulator)
2. Once the steps are successful, you could find containers running in Docker.

#### [MacOS](#tab/MacOS)
After completing the prerequisites, you can proceed with the following steps to run the Event Hubs emulator locally. 

1. Execute the setup script `LaunchEmulator.sh` . Running the script would bring up two containers – Event Hubs emulator & Azurite (dependency for Emulator)
2. Once the steps are successful, you could find containers running in Docker.
---

### [Docker (Linux Container)](#tab/docker-linux-container)

Copy the following Yaml file to spin up Event Hubs emulator along with its dependencies. 

```yaml
version: '3'
name: microsoft-azure-eventhubs
services:
  emulator:
    container_name: "emulator"
    image: "messagingemulators.azurecr.io/microsoft/azure/eventhubs/emulator:latest"
    volumes:
      - "./Config.json:/Eventhubs_Emulator/ConfigFiles/Config.json"
    ports:
      - "5672:5672"
    environment:
      BLOB_SERVER: azurite
      METADATA_SERVER: azurite
      ACCEPT_EULA: "N"
    depends_on:
      - azurite
    networks:
      eh-emulator:
        aliases:
          - "eventhub-emulator"
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
---  
## Interacting with Emulator

You can use the following connection string to connect to Azure Event Hubs emulator.
```
"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```
To get started, refer to our GitHub Samples - <add #link later>



## Next Steps

Read more about Azure event hubs emulator [here](overview-emulator.md)
