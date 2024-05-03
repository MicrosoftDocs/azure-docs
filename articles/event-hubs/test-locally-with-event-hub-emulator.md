# Test Event Hubs Locally with Event Hubs emulator 

This article summarizes the steps to develop and test locally with local event hubs emulator. TO read more about Event hubs read :

## Pre-Requisites

- Docker emulator
  - [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/#:~:text=Install%20Docker%20Desktop%20on%20Windows%201%20Download%20the,on%20your%20choice%20of%20backend.%20...%20More%20items) 
- Minimum hardware Requirements:
  - 2 GB RAM
  - 5 GB of Disk space
- WSL Enablement (Only for Windows):
  - [Install WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/install)
  -  [Configure Docker to use WSL](https://docs.docker.com/desktop/wsl/#:~:text=Turn%20on%20Docker%20Desktop%20WSL%202%201%20Download,engine%20..%20...%206%20Select%20Apply%20%26%20Restart.)

> [!NOTE]
> Before you continue with the subsequent steps, make sure Docker Desktop is operational in the background.

## Installation

### [GitHub](#tab/GitHub) 

1. Clone the Git Repo -(Emulator Public Repo link) 

### [Docker](#tab/Docker) 

1. Event Hub emulator is available as docker container image. You can download the latest image from MCR endpoint
2. Emulator has dependency on Azurite so we should spin up Azurite as well. 

---
## Running the emulator 

This section highlights different steps to run Event Hubs emulator. Details are shared below:

### [Automated Script](#tab/automated-script)

### Windows
Once the pre-requisites are complete, you could follow below manual steps to run Event Hubs emulator locally.

1. Before executing the setup script, we need to allow execution of unsigned scripts. Run the below command in the powershell window:

`$>Start-Process powershell -Verb RunAs -ArgumentList 'Set-ExecutionPolicy Bypass –Scope CurrentUser’`

2. Download the repository and execute `~\Messaging-Emulator\EventHub\Execution_Scripts\Windows\LaunchEmulator.ps1`.This would fetch images and bring up 2 containers – Event Hubs emulator & Azurite (dependency for Emulator)
3. Once the steps are successful, you could find containers running in Docker Desktop.

### Linux
Once the pre-requisites  are complete, you could follow below manual steps to run Event Hubs emulator locally. 

1. Execute the setup script `~/EventHub/Execution_Scripts/Linux/LaunchEmulator.sh` .This would fetch images and bring up 2 containers – Event Hubs emulator & Azurite (dependency for Emulator)
2. Once the steps are successful, you could find containers running in Docker.

### MacOS
Once the pre-requisites  are complete, you could follow below manual steps to run Event Hubs emulator locally. 

1. Execute the setup script `~/EventHub/Execution_Scripts/Linux/LaunchEmulator.sh` .This would fetch images and bring up 2 containers – Event Hubs emulator & Azurite (dependency for Emulator)
2. Once the steps are successful, you could find containers running in Docker.


### [Docker (Linux Container)](#tab/docker-linux-container)

You could use below Yaml file to spin up EH emulator along with its dependencies. 

```yaml
version: '3'
name: microsoft-azure-eventhubs
services:
  emulator:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: "emulator"
    image: "messagingemulators.azurecr.io/microsoft/azure/eventhubs/emulator:latest"
    ports:
      - "5672:5672"
      - "8090:8090"
    environment:
      BLOB_SERVER: azurite
      METADATA_SERVER: azurite
      SQL_SERVER: sqledge
    depends_on:
      - azurite
      - azuresqledge
    networks:
      eh-emulator:
        aliases:
          - "eventhub-emulator"
  azurite:
    container_name: "azurite"
    image: "mcr.microsoft.com/azure-storage/azurite:latest"
    volumes:
      - ./azurite:/data
    ports:
      - "10000:10000"
      - "10001:10001"
      - "10002:10002"
    networks:
      eh-emulator:
        aliases:
          - "azurite"
  azuresqledge:
    container_name: "azuresqledge"
    image: "mcr.microsoft.com/azure-sql-edge:latest"
    cap_add:
      - SYS_PTRACE
    environment:
      MSSQL_SA_PASSWORD: "P@ss1234"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
    networks:
      eh-emulator:
        aliases:
          - sqledge
networks:
  eh-emulator:


```
---  
## Interacting with Emulator

For connecting to Emulator, you could use below connection string : 
```
"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```
To get started, refer to our GitHub Samples - <add #link later>

#Add Table for SDK details

## Next Steps

Read more about Azure event hubs emulator - ##
