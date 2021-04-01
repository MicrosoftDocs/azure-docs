---
title: Provisioning Device Update for Azure IoT Hub Agent| Microsoft Docs
description: Provisioning Device Update for Azure IoT Hub Agent
author: ValOlson
ms.author: valls
ms.date: 2/16/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Device Update Agent Provisioning
The Device Update Module agent can run alongside other system processes and [IoT Edge modules](https://docs.microsoft.com/azure/iot-edge/iot-edge-modules) that connect to your IoT Hub as part of the same logical device. This section describes how to provision the Device Update agent as a module identity. 
Module Identity vs Device Identity: In IoT Hub, under each device identity, you can create up to 50 module identities. Each module identity implicitly generates a module twin. On the device side, the IoT Hub device SDKs enable you to create modules where each one opens an independent connection to IoT Hub. Module identity and module twin provide the similar capabilities as device identity and device twin but at a finer granularity. [Learn more about Module Identities in IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-module-twins)

Currently supported IoT device types with Device Update:
*	Linux devices (IoT Edge and Non-IoT Edge devices):
    + Image A/B update:
      - Yocto - ARM64 (reference image), extensible via open source to [build you own images](device-update-agent-provisioning.md#how-to-build-and-run-device-update-agent) for other architecture as needed.
      - Ubuntu 18.04 simulator
    + Package Agent supported builds for the following platforms/architectures.
      - Ubuntu Server 18.04 x64 Package Agent 
      - Debian 9 
*	Constrained devices:
    + AzureRTOS Device Update agent samples: [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
*	Disconnected devices: 
    + [Understand support for disconnected device update](connected-cache-disconnected-device-update.md)

## Pre-Requisite  
If you are setting up the IoT device/IoT Edge device for [package based updates](https://docs.microsoft.com/azure/iot-hub-device-update/understand-device-update#support-for-a-wide-range-of-update-artifacts), add packages.microsoft.com to your machine’s repositories by following the steps below:
1.	Log onto the machine or IoT device on which you intend to install the Device Update agent.
2.	Open a Terminal window.
3.	Install the repository configuration that matches your device’s operating system.
      ```shell
      curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
      ```
4.	Copy the generated list to the sources.list.d directory.
      ```shell
      sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
      ```
5.	Install the Microsoft GPG public key.
      ```shell
      curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
      ```
      ```shell
      sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
      ```

## How to provision the Device Update agent as a Module Identity
This section describes how to provision the Device Update agent as a module identity on IoT Edge enabled devices, non-Edge IoT devices, and other IoT devices.

### On IoT Edge enabled devices
Follow these instructions to provision the Device Update agent on [IoT Edge enabled devices](https://docs.microsoft.com/azure/iot-edge).
1.	Follow the instructions to [Install and provision the Azure IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge?view=iotedge-2020-11&preserve-view=true).
2.	Then install the Device Update agent from [Artifacts](https://github.com/Azure/iot-hub-device-update/releases) and you are now ready to start the Device Update agent on your IoT Edge device.

### On non-Edge IoT Linux devices
Follow these instructions to provision the Device Update agent on your IoT Linux devices.
1.	Install the IoT Identity Service and add the latest version to your IoT device. 
    * Log onto the machine or IoT device.
    * Open a terminal window.
    *	Install the latest [IoT Identity Service](https://github.com/Azure/iot-identity-service/blob/main/docs/packaging.md#installing-and-configuring-the-package) on your IoT device using the command below.
      ```shell
      sudo apt-get install aziot-identity-service
      ```
2.	Provisioning IoT Identity service to get the IoT device information.
    * Create a custom copy of the configuration template so we can add the provisioning information. In a terminal, enter the below command.
      ```shell
      sudo cp /etc/aziot/config.toml.template /etc/aziot/config.toml 
      ```
   
3. Next edit the configuration file to include the connection string of the device you wish to act as the provisioner for this device or machine. In a terminal, enter the below command.
      ```shell
      sudo nano /etc/aziot/config.toml
      ```
   
4. You should be greeted with a view like below:
:::image type="content" source="media/understand-device-update/config.png" alt-text="Diagram of IoT Identity Service config file." lightbox="media/understand-device-update/config.png"::: 
    * In the same nano window, find the block with “Manual provisioning with connection string”.
    * In the window, delete the “#” symbol ahead of 'provisioning'
    * In the window, delete the “#” symbol ahead of 'source' 
    * In the window, delete the “#” symbol ahead of 'connection_string'
    * In the window, delete the string within the quotes to the right of 'connection_string' and then add your connection string there 
    * Save your changes to the file with 'Ctrl+X' and then 'Y' and hit the 'enter' key to save your changes. 
5.	Now apply and restart the IoT Identity service with the command below. You should now see a “Done!” printout that means you have successfully configured the IoT Identity Service. Note: The IoT Identity service registers    module identities with IoT Hub using symmetric keys currently.
      ```shell
      sudo aziotctl config apply
      ```
6.	Finally install the Device Update agent from [Artifacts](https://github.com/Azure/iot-hub-device-update/releases) and you are now ready to start the Device Update agent on your IoT Edge device.

### Other IoT devices
The Device Update agent can also be configured without the IoT Identity service for testing or on constrained devices. Follow the below steps to provision the Device Update agent using a connection string (from the Module or Device).
1.	Install Device Update agent from [Artifacts](https://github.com/Azure/iot-hub-device-update/releases).
2.	Log onto the machine or IoT Edge device/IoT device.
3.	Open a terminal window.
4.	Add the connection string to the [Device Update configuration file](device-update-configuration-file.md):
    * Enter the below in the terminal window:
       - [Package updates](device-update-ubuntu-agent.md) use: sudo nano /etc/adu/adu-conf.txt
       - [Image updates](device-update-raspberry-pi.md) use: sudo nano /adu/adu-conf.txt
    * You should see a window open with some text in it. Delete the entire string following 'connection_String=' the first-time you provision the Device Update agent on the IoT device. It is just place holder text.
    * In the terminal, replace <your-connection-string> with the connection string of the device for your instance of Device Update agent (NOTE DO NOT ADD QUOTES AROUND THE CONNECTION STRING)
       - connection_string=<your-connection-string>
    * Enter and save.
5.	Now you are now ready to start the Device Update agent on your IoT Edge device. 

## How to start the Device Update Agent
This section describes how to start and verify the Device Update agent as a module identity running successfully on your IoT device.
1.	Log into the machine or device that has the Device Update agent installed.
2.	Open a Terminal window, and enter the command below.
      ```shell
      sudo systemctl restart adu-agent
      ```
3.	You can check the status of the agent using the command below. If you see any issues, refer to this [troubleshooting guide](troubleshoot-device-update.md).
      ```shell
      sudo systemctl status adu-agent
      ```
4.	You should see status OK.
5.	On the IoT Hub portal,  go to IoT device or IoT Edge devices to find the device that you configured with Device Update agent. There you will see the Device Update agent running as a module, For example:
:::image type="content" source="media/understand-device-update/device-update-module.png " alt-text="Diagram of Device Update module name." lightbox="media/understand-device-update/device-update-module.png":::

## How to build and run Device Update Agent
You can also build and modify your own customer Device Update agent.

Follow the instructions to [build](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md) the Device Update Agent
from source.

Once the agent is successfully building, it's time [run](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-run-agent.md)
the agent.

Now, make the changes needed to incorporate the agent into your image.  Look at how to
[modify](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-modify-the-agent-code.md) the Device Update Agent for guidance.

## Troubleshooting Guide

If you run into issues, review the Device Update for IoT Hub [Troubleshooting Guide](troubleshoot-device-update.md) to help unblock any possible issues and collect necessary information to provide to Microsoft.

## Next Steps

Use below pre-built images and binaries for an easy demonstration of Device Update for IoT Hub.  

[Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build you own images for other architecture as needed.

[Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

[Package Update:Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)

[Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)

