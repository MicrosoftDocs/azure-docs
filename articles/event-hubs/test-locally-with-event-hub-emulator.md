# Test Event Hubs Locally with Event Hubs emulator 

This article summarizes the steps to develop and test with local event hubs emulator. TO read more about Event hubs read :



## Pre-Requisites

- Docker emulator
  - [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/#:~:text=Install%20Docker%20Desktop%20on%20Windows%201%20Download%20the,on%20your%20choice%20of%20backend.%20...%20More%20items) 
- Minimum hardware Requirements:
  - 2 GB RAM
  - 5 GB of Disk space
- WSL Enablement (Only for Windows):
  - [Install WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/install)
  -  [Configure Docker to use WSL](https://docs.docker.com/desktop/wsl/#:~:text=Turn%20on%20Docker%20Desktop%20WSL%202%201%20Download,engine%20..%20...%206%20Select%20Apply%20%26%20Restart.)

Note: Kindly ensure to have docker desktop running in background prior to proceeding with the following steps.

# Installation

### 1. GitHub 

1. Clone the Git Repo -(Emulator Public Repo link) 

### 2. Docker 

1. Event Hub emulator is available as docker container image. You can download the latest image from MCR endpoint
2. You can run the image with docker run commands as shown below
3. Emulator has dependency on Azurite so we should spin up Azurite as well. 




## Running the emulator 
This section highlights different steps to follow to Install Event Hubs emulator in your machine. Details are shared below:

## [Automated Script](#tab/automated-script)

### Windows
Once the pre-requisites are complete, you could follow below manual steps to run Event Hubs emulator locally.

1. Before executing the setup script, we need to allow execution of unsigned scripts. Run the below command in the powershell window:

`$>Start-Process powershell -Verb RunAs -ArgumentList 'Set-ExecutionPolicy Bypass –Scope CurrentUser’`

2. Download the repository and execute `~\Messaging-Emulator\EventHub\Execution_Scripts\Windows\LaunchEmulator.ps1` ; This script would fetch images and bring up 3 containers – EH Emulator, Azurite and SQL Edge (Dependencies for Emulator)
3. Once the steps are successful, you could find containers running in Docker Desktop.

### Linux
Once the pre-requisites (Docker & Azure CLI) are complete, you could follow below manual steps to run Event Hubs emulator locally. 

1. Execute the setup script `~/EventHub/Execution_Scripts/Linux/LaunchEmulator.sh` ; this would fetch images and bring up 3 containers – EH Emulator, Azurite and SQL Edge (Dependencies for Emulator)
2. Once the steps are successful, you could find containers running in Docker.

## [Docker (Linux Container)](#tab/docker-linux-container)


   
## Interacting with Emulator

### Send and Receive Events with Emulator
Once the emulator is running in docker, we could interact with it using client-side code. Emulator support through the C# Event-Hubs SDK is generally avalaible from version 5.11 for "Azure.Messaging.EventHubs" & "Azure.Messaging.EventHubs.Processor" NuGet packages.

*Bonus*: To make first round of testing easy, we have packaged a sample .NET Console application in [directory](EventHub/Samples/.NET/EventHubs-Emulator-Demo)


## We love feedback!
Want to suggest improvement or report a bug? You could open a new GitHub issue and we would be happy to assist you. Have any additional questions/concerns, reach out to us at **ehemulatorteam@microsoft.com**
