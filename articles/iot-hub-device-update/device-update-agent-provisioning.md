---
title: Provision Azure Device Update for IoT Hub agent| Microsoft Docs
description: Learn how to provision the Azure Device Update for Azure IoT Hub agent.
author: eshashah-msft
ms.author: eshashah
ms.date: 12/19/2024
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Provision Azure Device Update for IoT Hub agent

The Device Update module agent can run along with other system processes and [IoT Edge modules](../iot-edge/iot-edge-modules.md) that connect to your IoT Hub as part of the same logical device. This article describes how to provision the Device Update agent as a module identity.

>[!NOTE]
>If you use the Device Update agent, make sure you're on the version 1.0.0 general availability (GA) version. You can check the installed versions of the Device Update agent and the Delivery Optimization agent in the [properties](device-update-plug-and-play.md#device-properties) section of your [IoT device twin](../iot-hub/iot-hub-devguide-device-twins.md). For more information, see [Migrate devices and groups to the latest Device Update release](migration-public-preview-refresh-to-ga.md).

## Module identity and device identity

You can create up to 50 module identities under each Azure IoT Hub device identity. Each module identity implicitly generates a module identity twin. On the device side, you can use the IoT Hub device SDKs to create modules that each open an independent connection to IoT Hub.

Module identity and module identity twin provide similar capabilities to device identity and device twin, but at a finer granularity. For more information, see [Understand and use module twins in IoT Hub](../iot-hub/iot-hub-devguide-module-twins.md).

When you provision the Device Update agent as a module identity, all [communications](device-update-plug-and-play.md) between the device and the Device Update service must happen over the module twin. Remember to tag the module twin of the device when you create [device groups](device-update-groups.md). If you migrate from a device-level agent to adding the agent as a module identity, remove the older agent that communicated over the device twin.

## Supported update types

Device Update supports the following IoT device over the air update types:

- IoT Edge and non-IoT Edge Linux devices:
  - [Image A/B updates](device-update-raspberry-pi.md)
  - [Package updates](device-update-ubuntu-agent.md)
  - [Proxy updates for downstream devices](device-update-howto-proxy-updates.md)
- [Eclipse ThreadX Device Update agent](device-update-azure-real-time-operating-system.md)
- [Disconnected devices behind gateways](connected-cache-disconnected-device-update.md)

## Prepare for package updates

To set up an IoT device or IoT Edge device to install [package based updates](./understand-device-update.md#support-for-a-wide-range-of-update-artifacts), add `packages.microsoft.com` to your machine's repositories by following these steps:

1. Open a Terminal window on the machine or IoT device where you want to install the Device Update agent.

1. Install the repository configuration that matches your device's operating system, for example:

   ```shell
   curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
   ```

1. Copy the generated list to your *sources.list.d* directory.

   ```shell
   sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```

1. Install the Microsoft GPG public key.

   ```shell
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   ```

   ```shell
   sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

## Provision the Device Update agent

You can provision the Device Update agent as a module identity on IoT Edge enabled devices or non-IoT Edge IoT devices. To check if you have IoT Edge enabled on your device, see [View registered devices and retrieve provisioning information](../iot-edge/how-to-provision-single-device-linux-symmetric.md?preserve-view=true&view=iotedge-2020-11#view-registered-devices-and-retrieve-provisioning-information).

You can download sample images to use from the **Assets** section on the [Releases](https://github.com/Azure/iot-hub-device-update/releases) page. In *Tutorial_RaspberryPi3.zip*, the *swUpdate* file is the base image that you can flash onto a Raspberry Pi B3+ board. The *.gz* file is the update you can import through Device Update. For more information, see [Azure Device Update for IoT Hub using a Raspberry Pi image](./device-update-raspberry-pi.md#use-bmaptool-to-flash-the-sd-card).

### On IoT Edge enabled devices

Follow these instructions to provision the Device Update agent on [IoT Edge enabled devices](../iot-edge/index.yml):

1. Follow the instructions at [Manually provision a single Linux IoT Edge device](../iot-edge/how-to-provision-single-device-linux-symmetric.md?preserve-view=true&view=iotedge-2020-11#install-iot-edge).

1. Install the Device Update image update agent by running the following command:

   ```shell
   sudo apt-get install deviceupdate-agent
   ```

1. Install the Device Update package update agent.

   - For latest agent versions from packages.microsoft.com, update package lists on your device and install the Device Update agent package and its dependencies using:

     ```shell
     sudo apt-get update
     ```

     ```shell
     sudo apt-get install deviceupdate-agent
     ```

   - For release candidate (rc) agent versions, download the *.deb* file  from [Releases](https://github.com/Azure/iot-hub-device-update/releases) to the machine you want to install the Device Update agent on, and then run the following command:

     ```shell
     sudo apt-get install -y ./"<PATH TO FILE>"/"<.DEB FILE NAME>"
     ```

   - If you're setting up a [Microsoft Connected Cache (MCC) for a disconnected device scenario](connected-cache-disconnected-device-update.md), install the Delivery Optimization APT plugin as follows:

     ```shell
     sudo apt-get install deliveryoptimization-plugin-apt
     ```

### On non-IoT Edge enabled devices

Follow these instructions to provision the Device Update agent on Linux IoT devices without IoT Edge installed.

1. Install the latest version of the IoT Identity Service by following instructions in [Installing the Azure IoT Identity Service](https://azure.github.io/iot-identity-service/installation.html#install-from-packagesmicrosoftcom).

1. Configure the IoT Identity Service by following the instructions in [Configuring the Azure IoT Identity Service](https://azure.github.io/iot-identity-service/configuration.html).

1. Install the Device Update agent by running the following command:

   ```shell
   sudo apt-get install deviceupdate-agent
   ```

>[!NOTE]
>If your IoT device isn't able to run the IoT Identity Service or IoT Edge, which bundles the IoT Identity Service, you can still install the Device Update agent and configure it by [using a connection string](#use-a-connection-string).

## Configure the Device Update agent

After you install the device update agent, edit the Device Update configuration file by running the following command.

   ```shell
   sudo nano /etc/adu/du-config.json
   ```
  
In the *du-config.json* file, set all values that have a `Place value here` placeholder. For agents that use the IoT Identity Service for provisioning, change the `connectionType` to `AIS`, and set the `ConnectionData` field to an empty string. For an example, see [Example "du-config.json" file contents](./device-update-configuration-file.md#example-du-configjson-file-contents).

### Use a connection string

For testing or on constrained devices, you can configure the Device Update agent without using the IoT Identity service. You can use a connection string to provision the Device Update agent from the module or device.

1. In the Azure portal, copy the primary connection string. If the Device Update agent is configured as a module identity, copy the module's primary connection string. Otherwise, copy the device's primary connection string.

1. In a Terminal window on the machine or IoT device where you installed the Device Update agent, edit the [Device Update configuration file](device-update-configuration-file.md) by running the following command:

   - For an [Ubuntu agent](device-update-ubuntu-agent.md): `sudo nano /etc/adu/du-config.json`.
   - For a [Yocto reference image](device-update-raspberry-pi.md): `sudo nano /adu/du-config.json`.

1. In the *du-config.json* file, set all values that have a `Place value here` placeholder, and enter the copied primary connection string as the `connectionData` field value. For an example, see [Example "du-config.json" file contents](./device-update-configuration-file.md#example-du-configjson-file-contents).

## Start the Device Update agent

Start the Device Update agent and verify that it's running successfully on your device.

1. In a Terminal window on the machine or IoT device where you installed the Device Update agent, restart the agent by running the following command:

   ```shell
   sudo systemctl restart deviceupdate-agent
   ```

1. Check the agent status by running the following command.

   ```shell
   sudo systemctl status deviceupdate-agent
   ```

   You should see status `OK`.

1. On the IoT Hub portal page, go to **Devices** or **IoT Edge** to find the device that you configured, and see the Device Update agent running as a module. For example:

   :::image type="content" source="media/understand-device-update/device-update-module.png" alt-text="Diagram of Device Update module name showing Connected status.":::

## Enable Device Update agent behind a proxy server

Devices running the Device Update agent send HTTPS requests to communicate with IoT Hub. If you connected your device to a network that uses a proxy server, you need to configure the Device Update systemd service to communicate through the server.

Before configuring Device Update, ensure that you have the the Proxy URL. Proxy URL is in the format protocol://proxy_host:proxy_port.

Navigate to the Device Update configuration by running the following command:

   ```shell
   sudo systemctl edit deviceupdate-agent.service
   ```

Add the proxy details to the configuration

   ```shell
   [Service]
   Environment="https_proxy=<Proxy URL>"
   ```

Restart the agent to apply the changes:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart deviceupdate-agent
   sudo systemctl status deviceupdate-agent
   ```

## Build and run a Device Update agent

You can also build and modify your own custom Device Update agent. Follow the instructions at [How To Build the Device Update Agent](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md) to build the Device Update Agent from source.

Once the agent successfully builds, follow [Running the Device Update for IoT Hub Reference Agent](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-run-agent.md) to run the agent. To make changes needed to incorporate the agent into your image, follow [How To Modify the Device Update Agent Code](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-modify-the-agent-code.md).

## Troubleshooting

If you run into issues, review the [Device Update for IoT Hub Troubleshooting Guide](troubleshoot-device-update.md) to help resolve the issues and collect necessary information to provide to Microsoft.

## Related content

- [Device Update for IoT Hub Troubleshooting Guide](troubleshoot-device-update.md)
- [Azure Device Update for IoT Hub using a Raspberry Pi image](device-update-raspberry-pi.md)
- [Azure Device Update for IoT Hub using the Ubuntu package agent](device-update-ubuntu-agent.md)
- [Tutorial: Complete a proxy update by using Device Update for Azure IoT Hub](device-update-howto-proxy-updates.md)
- [Azure Device Update for IoT Hub using a simulator agent](device-update-simulator.md)
- [Device Update for Azure IoT Hub using Eclipse ThreadX](device-update-azure-real-time-operating-system.md)
