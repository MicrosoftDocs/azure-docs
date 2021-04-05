---
title: Install Defender for IoT micro agent for Edge (Preview)
description: 
ms.date: 4/4/2021
ms.topic: how-to
---

# Install Defender for IoT micro agent for Edge (Preview)

This article provides an explanation of how to install, and authenticate the Defender micro agent for Edge.

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

1. Install the Defender micro agent package on Debian, and Ubuntu based Linux distributions, useing the following command: 

    ```azurecli-interactive
    sudo apt-get install defender-iot-micro-agent-edge 
    ```

Continue with [validating your installation](quickstart-standalone-agent-binary-installation.md#validate-your-installation), testing the system [end-to-end](quickstart-standalone-agent-binary-installation.md#testing-the-system-end-to-end) and installing a specific[Micro agent version](quickstart-standalone-agent-binary-installation.md#micro-agent-versioning).



**Or it can be a repeat of information like below**


### Validate your installation

To validate your installation:

1. Making sure the micro agent is running properly with the following command:  

    ```azurecli
    systemctl status defender-iot-micro-agent.service
    ```
1. Ensure that the service is stable by making sure it is `active` and that the uptime of the process is appropriate

    :::image type="content" source="media/quickstart-standalone-agent-binary-installation/active-running.png" alt-text="Check to make sure your service is stable and active.":::
 
## Testing the system end-to-end 

You can test the system from end to end by creating a trigger file on the device. The trigger file will cause the baseline scan in the agent to detect the file as a baseline violation. 

Create a file on the file system with the following command:

```azurecli
sudo touch /tmp/DefenderForIoTOSBaselineTrigger.txt 
```
A baseline validation failure recommendation will occur in the hub, with a `CceId` of CIS-debian-9-DEFENDER_FOR_IOT_TEST_CHECKS-0.0: 

:::image type="content" source="media/quickstart-standalone-agent-binary-installation/validation-failure.png" alt-text="The baseline validation failure recommendation that occurs in the hub." lightbox="media/quickstart-standalone-agent-binary-installation/validation-failure-expanded.png":::

Allow up to one hour for the recommendation to appear in the hub. 

## Micro agent versioning 

To install a specific version of the Defender IoT micro agent, run the following command: 

```azurecli
sudo apt-get install defender-iot-micro-agent=<version>
```

## Next steps

[Building the Defender micro agent from source code](quickstart-building-the-defender-micro-agent-from-source.md)
