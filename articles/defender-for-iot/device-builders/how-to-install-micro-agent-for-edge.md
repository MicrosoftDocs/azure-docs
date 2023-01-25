---
title: Install Defender for IoT micro agent for Edge
description: Learn how to install, and authenticate the Defender Micro agent for Edge.
ms.date: 02/08/2022
ms.topic: how-to
---

# Install Defender for IoT micro agent for Edge

This article explains how to install, and authenticate the Defender micro agent for Edge.

## Prerequisites 

1. Navigate to your IoT Hub or, [create a new IoT hub](../../iot-hub/iot-hub-create-through-portal.md#create-an-iot-hub).

1. [Register an Iot Edge device in IoT Hub](../../iot-edge/how-to-register-device.md) and [retrieve connection strings](../../iot-edge/how-to-register-device.md#view-registered-devices-and-retrieve-connection-strings).
    
1. Add the appropriate Microsoft package repository. 

    1. Download the repository configuration that matches your device operating system.  
    
        - For Ubuntu 18.04
        
            ```bash
            curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
            ```
    
        - For Ubuntu 20.04
        
            ```bash
             curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > ./microsoft-prod.list
            ```
    
        - For Debian 9 (both AMD64 and ARM64)
        
            ```bash
            curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
            ```
    
    1. Copy the repository configuration to the `sources.list.d` directory.
    
        ```bash
        sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
        ```
    
    1. Update the list of packages from the repository that you added with the following command:
    
        ```bash
        sudo apt-get update
        ```

1. Install and configure [Edge runtime version 1.2](../../iot-edge/how-to-install-iot-edge.md)

## Installation 

1. Install the Defender micro agent package on Debian, and Ubuntu based Linux distributions, using the following command: 

    ```bash
    sudo apt-get install defender-iot-micro-agent-edge
    ```

1. Validate your installation.

    1. Ensure the micro agent is running properly with the following command:  
    
        ```bash
        systemctl status defender-iot-micro-agent.service
        ```

    1. Ensure that the service is stable by making sure it's `active` and that the uptime of the process is appropriate
    
        :::image type="content" source="media/quickstart-standalone-agent-binary-installation/active-running.png" alt-text="Check to make sure your service is stable and active.":::
 
1. Test the system end-to-end by creating a trigger file on the device. The trigger file will cause a baseline scan in the agent, that will detect the file as a baseline violation. 
    
    Create a file on the file system with the following command:
    
    ```bash
    sudo touch /tmp/DefenderForIoTOSBaselineTrigger.txt 
    ```

    A baseline validation failure recommendation will occur in the hub, with a `CceId` of `CIS-debian-9-DEFENDER_FOR_IOT_TEST_CHECKS-0.0`: 
    
    :::image type="content" source="media/quickstart-standalone-agent-binary-installation/validation-failure.png" alt-text="The baseline validation failure recommendation that occurs in the hub." lightbox="media/quickstart-standalone-agent-binary-installation/validation-failure-expanded.png":::

    Allow up to one hour for the recommendation to appear in the hub. 

1. Install a specific version of the Defender IoT micro agent, use the following command:
    
    ```bash
    sudo apt-get install defender-iot-micro-agent-edge=<version>
    ```

## Next steps

> [!div class="nextstepaction"]
> [Configure Microsoft Defender for IoT agent-based solution](tutorial-configure-agent-based-solution.md)
