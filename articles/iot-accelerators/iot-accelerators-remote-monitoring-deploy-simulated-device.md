---
title: IoT deploy custom simulated devices - Azure | Microsoft Docs
description: This how-to guide shows you how to deploy custom simulated devices to the Remote Monitoring solution accelerator.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 08/15/2018
ms.topic: conceptual

# As a developer, I want to know how to deploy a new simulated device to the Remote Monitoring solution accelerator
---

# Deploy a new simulated device

The Remote Monitoring and Device Simulation solution accelerators both let you define your own simulated devices. This article shows you how to deploy a customized chiller device type and a new lightbulb device type to the Remote Monitoring solution accelerator.

The steps in this article assume you've completed the [Create and test a new simulated device](iot-accelerators-remote-monitoring-create-simulated-device.md) how-to guide and have the files that define the customized chiller and new lightbulb device types.

The steps in this how-to guide show you how to:

1. Use SSH to access the file system of the virtual machine that hosts the Remote Monitoring solution accelerator.

1. Configure Docker to load the device models from a location outside the Docker container.

1. Run the Remote Monitoring solution accelerator using custom device model files.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

To complete the steps in this how-to guide, you need an active Azure subscription.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To follow this how-to guide, you need:

- A deployed instance of the [Remote Monitoring solution accelerator](https://www.azureiotsolutions.com/Accelerators#solutions/types/RM2).
- A local **bash** shell to run the `ssh` and `scp` commands. On Windows, an easy way to install **bash** is to install [git](https://git-scm.com/download/win).
- Your custom device model files, such as the ones described in [Create and test a new simulated device](iot-accelerators-remote-monitoring-create-simulated-device.md).

[!INCLUDE [iot-solution-accelerators-access-vm](../../includes/iot-solution-accelerators-access-vm.md)]

## Configure Docker

In this section, you configure Docker to load the device model files from the **/tmp/devicemodels** folder in the virtual machine rather than from inside the Docker container. Run the commands in this section in a **bash** shell on your local machine:

In this section, you configure Docker to load the device model files from the **/tmp/devicemodels** folder in the virtual machine rather than from inside the Docker container. Run the commands in this section in a **bash** shell on your local machine:

1. Use SSH to connect to the virtual machine in Azure from your local machine. The following command assumes the public IP address of virtual machine **vm-vikxv** is **104.41.128.108** -- replace this value with the public IP address of your virtual machine from the previous section:

   ```sh
    ssh azureuser@104.41.128.108
    ```

    Follow the prompts to sign in to the virtual machine with the password you set in the previous section.

1. Configure the device simulation service to load the device models from outside the container. First open the Docker configuration file:

    ```sh
    sudo nano /app/docker-compose.yml
    ```

    Locate the settings for the **devicesimulation** container and edit the **volumes** setting as shown in the following snippet:

    ```yml
    devicesimulation:
      image: azureiotpcs/device-simulation-dotnet:1.0.0
      networks:
        - default_net
      depends_on:
        - storageadapter
      environment:
        - PCS_KEYVAULT_NAME
        - PCS_AAD_APPID
        - PCS_AAD_APPSECRET
      # How one could mount custom device models
      volumes:
        - /tmp/devicemodels:/app/webservice/data/devicemodels:ro
    ```

    Save the changes.

1. Copy the existing device model files from the container to the new location. First, find the container ID for the device simulation container:

    ```sh
    sudo docker ps
    ```

    Then copy the device model files to the **tmp** folder in the virtual machine. The following command assumes the container ID is c378d6878407 -- replace this value with your device simulation container ID:

    ```sh
    sudo docker cp c378d6878407:/app/webservice/data/devicemodels /tmp
    sudo chown -R azureuser /tmp/devicemodels/
    ```

    Keep the **bash** window with your SSH session open.

1. Copy your custom device model files into the virtual machine. Run this command in another **bash** shell on the machine where you created your custom device models. First, navigate to the local folder that contains your device model JSON files. The following commands assume the public IP address of the virtual machine is **104.41.128.108** -- replace this value with the public IP address of your virtual machine. Enter your virtual machine password when prompted:

    ```sh
    scp *json azureuser@104.41.128.108:/tmp/devicemodels
    cd scripts
    scp *js azureuser@104.41.128.108:/tmp/devicemodels/scripts
    ```

1. Restart the device simulation Docker container to use the new device models. Run the following commands in the **bash** shell with the open SSH session to the virtual machine:

    ```sh
    sudo /app/start.sh
    ```

    If you want to see status of the running Docker containers and their container IDs, use the following command:

    ```sh
    sudo docker ps
    ```

    If you want to see the log from the device simulation container, run the following command. Replace the container ID with the ID of your device simulation container:

    ```sh
    sudo docker logs -f 5d3f3e78822e
    ```

## Run simulation

You can now use your custom device models in the Remote Monitoring solution:

1. Launch your Remote Monitoring dashboard from [Microsoft Azure IoT Solution Accelerators](https://www.azureiotsolutions.com/Accelerators#dashboard).

1. Use the **Devices** page to add simulated devices. When you add a new simulated device, your new device models are available to choose.

1. You can use the dashboard to view device telemetry and call device methods.

## Clean up resources

If you plan to explore further, leave the Remote Monitoring solution accelerator deployed.

If you no longer need the solution accelerator, delete it from the [Provisioned solutions](https://www.azureiotsolutions.com/Accelerators#dashboard) page, by selecting it, and then clicking **Delete Solution**.

## Next steps

This guide showed you how to deploy custom device models to the Remote Monitoring solution accelerator. The suggested next step is to learn how to [connect a real device to your Remote Monitoring solution](iot-accelerators-connecting-devices-node.md).
