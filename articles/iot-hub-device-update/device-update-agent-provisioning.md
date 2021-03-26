---
title: Provisioning Device Update for Azure IoT Hub Agent| Microsoft Docs
description: Provisioning Device Update for Azure IoT Hub Agent
author: ValOlson
ms.author: valls
ms.date: 2/16/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Device Update Agent

Device Update for IoT Hub supports two forms of updates – image-based and package-based. 

* Current supported IoT device types with Device Update:
1.	Linux device (IoT Edge and Non-IoT Edge):
    * Image A/B update:
      - Yocto - ARM64 (reference image), but you can build you own images for other architecture as needed. 
      - Ubuntu 18.04 simulator
    * Package Agent supported builds for the following platforms/architectures.
      - Ubuntu Server 18.04 x64 Package Agent 
      - Debian 9 
2.	Constrained devices:
    * AzureRTOS Device Update agent samples: [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](
3.	Disconnected devices: Understand support for disconnected device update using Microsoft Connected Cache - Device Update for Azure IoT Hub | Microsoft Docs


Follow the links below on how to Build, Run and Modify the Device Update Agent.

## Build the Device Update Agent

Follow the instructions to [build](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md) the Device Update Agent
from source.

## Run the Device Update Agent

Once the agent is successfully building, it's time [run](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-run-agent.md)
the agent.

## Modifying the Device Update Agent

Now, make the changes needed to incorporate the agent into your image.  Look at how to
[modify](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-modify-the-agent-code.md) the Device Update Agent for guidance.

### Troubleshooting Guide

If you run into issues, review the Device Update for IoT Hub [Troubleshooting Guide](troubleshoot-device-update.md) to help unblock any possible issues and collect necessary information to provide to Microsoft.

## Next Steps

Use below pre-built images and binaries for an easy demonstration of Device Update for IoT Hub.  

[Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md)

[Image Update:Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

[Package Update:Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)

