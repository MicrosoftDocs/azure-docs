---
title: Install Defender for IoT micro agent for Edge (Preview)
description: 
ms.date: 4/4/2021
ms.topic: how-to
---

# Install Defender for IoT micro agent for Edge (Preview)


## Prerequisites 

1. Install, and configure the Microsoft package repository by following these instructions. 

For Debian 9, the instructions do not include the repository that needs to be added, use the following commands to add the repository: 

    ```azurecli
    curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -  
    
    sudo apt-get install software-properties-common 
    
    sudo apt-add-repository https://packages.microsoft.com/debian/9/multiarch/prod 
    
    sudo apt-get update 
    ```
1. Install and configure [Edge runtime version 1.2](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge?view=iotedge-2020-11&preserve-view=true ). 

## Installation

To install the Defender micro agent package on Debian, and Ubuntu based Linux distributions, use the following command: 

```azurecli-interactive
sudo apt-get install defender-iot-micro-agent-edge 
```

