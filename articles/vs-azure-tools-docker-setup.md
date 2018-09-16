---
title: Configure a Docker Host with VirtualBox | Microsoft Docs
description: Step-by-step instructions to configure a default Docker instance using Docker Machine and VirtualBox
services: azure-container-service
documentationcenter: na
author: mlearned
manager: douge
editor: ''

ms.assetid: 0b1335a2-7720-42a8-8260-4e06fc00c9f6
ms.service: multiple
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 06/08/2016
ms.author: mlearned

---
# Configure a Docker Host with VirtualBox
## Overview
This article guides you through configuring a default Docker instance using Docker Machine and VirtualBox. 
If you’re using the [Docker for Windows](https://www.docker.com/products/docker-desktop), this configuration is not necessary.

## Prerequisites
The following tools need to be installed.

* [Docker Toolbox](https://github.com/docker/toolbox/releases)

## Configuring the Docker client with Windows PowerShell
To configure a Docker client, simply open Windows PowerShell, and perform the following steps:

1. Create a default docker host instance.
   
    ```PowerShell
    docker-machine create --driver virtualbox default
    ```
2. Verify the default instance is configured and running. (You should see an instance named `default' running.
   
    ```PowerShell
    docker-machine ls 
    ```
   
    ![docker-machine ls output][0]
3. Set default as the current host, and configure your shell.
   
    ```PowerShell
    docker-machine env default | Invoke-Expression
    ```
4. Display the active Docker containers. The list should be empty.
   
    ```PowerShell
    docker ps
    ```
   
    ![docker ps output][1]

> [!NOTE]
> Each time you reboot your development machine, you’ll need to restart your local docker host.
> To do this, issue the following command at a command prompt: `docker-machine start default`.
> 
> 

[0]: ./media/vs-azure-tools-docker-setup/docker-machine-ls.png
[1]: ./media/vs-azure-tools-docker-setup/docker-ps.png
