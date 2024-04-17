# Test Event Hubs Locally with Event hubs emulator 

This article summarizes the steps to develop and test with local event hubs emulator. TO read more about Event hubs read :

## What is Event Hubs emulator?

Azure Event Hubs is a cloud native data streaming service that can stream millions of events per second, with low latency, from any source to any destination. The Emulator is designed to offer a local development experience for Azure Event Hubs, enabling customers to develop and test code against our services in isolation, free from cloud interference.

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
