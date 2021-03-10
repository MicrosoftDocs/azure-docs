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

* Image updates provide a higher level of confidence in the end-state of the device. It is typically easier to replicate the results of an image-update between a pre-production environment and a production environment, since it doesn’t pose the same challenges as packages and their dependencies. Due to their atomic nature, one can also adopt an A/B failover model easily. 
* Package-based updates are targeted updates that alter only a specific component or application on the device. Thus, leading to lower consumption of bandwidth and helps reduce the time to download and install the update. Package updates typically allow for less downtime of devices when applying an update and avoid the overhead of creating images. 

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

