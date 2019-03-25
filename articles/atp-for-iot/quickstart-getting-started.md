---
title: Get started using ATP for IoT Preview| Microsoft Docs
description: Getting started by understanding the basic workflow of ATP for IoT features and service.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 55c8d3b6-3126-4246-8d07-ef88fe5ea84f
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---
# Getting started with ATP for IoT 

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of the different building blocks of the ATP for IoT service and how to get started with [onboarding](quickstart-onboard-iot-hub.md). 

ATP for IoT can be seamlessly integrated into your IoT Hub to provide security analysis of IoT hub configuration, device identity and hub-device communication patterns.
For enhanced security capabilities, ATP for IoT provides agent-based collection of security data from your IoT devices.

## ATP for IoT seamless IoT hub integration

When attempting to protect your individual IoT devices, the ability to collect data directly from the devices, or from their network is required. To support this effort, ATP for IoT offers an arsenal of low-footprint security agents to provide device monitoring and hardening.

In ATP for IoT preview, reference architecture for Linux and Windows security agents, both in C# and C are provided.
The agents handle raw event collection from the device operating system, event aggregation to reduce cost, and configuration through a device  module twin.
Security messages are sent through your IoT hub, into ATP for IoT analytics services.

## ATP for IoT 

Choose the onboarding scenario that best meets your device and environment requirements:

### Get started with ATP for IoT seamless IoT Hub integration 

For fast service onboarding to monitoring your device identity management, device to cloud, and cloud to device communication patterns, use following basic workflow for testing and eventual service onboarding. This workflow enables you to use the service without using ATP for IoT security agents:

1. [Onboard ATP for IoT service to your IoT Hub](quickstart-onboard-iot-hub.md)
1. In case your IoT Hub has no registered devices, [Register a new device](https://docs.microsoft.com/en-us/azure/iot-accelerators/quickstart-device-simulation-deploy).
1. [Create an azureiotsecurity security module](quickstart-create-security-twin.md) for your devices. 
1. Define normal device and system behavior through [custom alerts](quickstart-create-custom-alerts.md). 
1. Perform system testing to verify service and device status. 
1. Explore [alerts](concept-security-alerts.md) and [recommendations](concept-recommendations.md), and [deep dive using Log Analytics](how-to-security-data-access.md) using IoT Hub. 


### Get started with ATP for IoT security agents

To make use of ATP for IoT enhanced security capabilities, such as; monitoring remote connections, active applications, login events and OS configuration best practices, use the following basic workflow for testing and eventual service onboarding. 

1. [Onboard ATP for IoT service to your IoT Hub](quickstart-onboard-iot-hub.md)
1. In case your IoT Hub has no registered devices, [Register a new device](https://docs.microsoft.com/en-us/azure/iot-accelerators/quickstart-device-simulation-deploy).
1. [Create an azureiotsecurity security module](quickstart-create-security-twin.md) for your devices.
1. In case you would like to install the agent on a simulated device on Azure and not an actual IoT device, [spin up a new Azure Virtual Machine (VM)](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal) in an available zone. 
1. [Deploy an ATP for IoT security agent](quickstart-linux-cs-installation.md) on your IoT device, or new VM.
1. Following the instructions on [trigger_events](https://aka.ms/iot-security-github-trigger-events) to run a simulation of a harmless attack.
1. Verify alerts in IoT Hub up to 5 minutes after running the script. 
1. Explore [alerts](concept-security-alerts.md) and [recommendations](concept-recommendations.md), and [deep dive using Log Analytics](how-to-security-data-access.md) using IoT Hub. 


## Next steps

1. Onboard [ATP for IoT](quickstart-onboard-iot-hub.md).
1. Configure your [solution](quickstart-configure-your-solution.md).
1. [Create security modules](quickstart-create-security-twin.md).
1. Configure [custom alerts](quickstart-create-custom-alerts.md).
1. Deploy a security agent for [Windows](quickstart-windows-installation.md) or [Linux](quickstart-linux-cs-installation.md), or [Send security messages using the SDK](tutorial-send-security-messages.md) directly.


## See Also
- [Overview](overview.md)
- [Architecture](architecture.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)