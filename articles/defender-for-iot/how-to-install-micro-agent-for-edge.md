---
title: Install Defender for IoT micro agent for Edge (Preview)
description: 
ms.date: 4/4/2021
ms.topic: how-to
---

# Install Defender for IoT micro agent for Edge (Preview)


## Prerequisites 

1. Install, and configure the Microsoft package using the following commands.  

    ```azurecli
    curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -  
        
    sudo apt-get install software-properties-common 
    ```
1. (Optional) For Debian 9, use the following command at this point to include a repository: that needs to be added, use the following commands to add the repository:

    ```azurecli
    sudo apt-add-repository https://packages.microsoft.com/debian/9/multiarch/prod
    ```
1. Update **---WHAT ARE WE UPDATING???**
 
    ```azurecli
    sudo apt-get update 
    ```    

1. Install and configure [Edge runtime version 1.2](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge?view=iotedge-2020-11&preserve-view=true ). 

## Installation

To install the Defender micro agent package on Debian, and Ubuntu based Linux distributions, use the following command: 

```azurecli-interactive
sudo apt-get install defender-iot-micro-agent-edge 
```

