---
title: Get started using Azure Security Center (ASC) for IoT Preview| Microsoft Docs
description: Get started in understanding the basic workflow of Azure Security Center for IoT features and service.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 55c8d3b6-3126-4246-8d07-ef88fe5ea84f
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/26/2019
ms.author: mlottner

---
# Get started with Azure Security Center for IoT 

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of the different building blocks of the Azure Security Center (ASC) for IoT service and explains how to get started with [enabling the service](quickstart-onboard-iot-hub.md). 

ASC for IoT can be seamlessly integrated into your IoT Hub to provide security analysis of IoT hub configuration, device identity and hub-device communication patterns.
For enhanced security capabilities, ASC for IoT provides agent-based collection of security data from your IoT devices.

## ASC for IoT seamless IoT Hub integration

When attempting to protect your individual IoT devices, the ability to collect data directly from the devices, or from their network is required. To support this effort, ASC for IoT offers an arsenal of low-footprint security agents to provide device monitoring and hardening.

In ASC for IoT preview, reference architecture for Linux and Windows security agents, both in C# and C are provided.
The agents handle raw event collection from the device operating system, event aggregation to reduce cost, and configuration through a device  module twin.
Security messages are sent through your IoT Hub, into ASC for IoT analytics services.

## ASC for IoT basics

Choose the workflow scenario that best meets your IoT device and environment requirements:

### Get started with ASC for IoT seamless IoT Hub integration 

>[!Note]
>This workflow enables you to use the service without using ASC for IoT security agents. 

To enable monitoring your device identity management, device to cloud, and cloud to device communication patterns,use following basic workflow for testing and to start the  service: 

1. [Enable ASC for IoT service on your IoT Hub](quickstart-onboard-iot-hub.md)
1. If your IoT Hub has no registered devices, [Register a new device](https://docs.microsoft.com/azure/iot-accelerators/quickstart-device-simulation-deploy).
1. [Create an azureiotsecurity security module for your devices](quickstart-create-security-twin.md) for your devices. 
1. Define normal device and system behavior through [custom alerts](quickstart-create-custom-alerts.md). 
1. Perform system testing to verify service and device status. 
1. Explore [alerts](concept-security-alerts.md), [recommendations](concept-recommendations.md), and [deep dive using Log Analytics](how-to-security-data-access.md) using IoT Hub. 


### Get started with ASC for IoT security agents

Make use of ASC for IoT enhanced security capabilities, such as monitoring remote connections, active applications, login events, and OS configuration best practices by using the following basic workflow to test and enable the service: 

1. [Enable ASC for IoT service to your IoT Hub](quickstart-onboard-iot-hub.md)
1. If your IoT Hub has no registered devices, [Register a new device](https://docs.microsoft.com/azure/iot-accelerators/quickstart-device-simulation-deploy).
1. [Create an azureiotsecurity security module](quickstart-create-security-twin.md) for your devices.
1. To install the agent on an Azure simulated device instead of installing on an actual device, [spin up a new Azure Virtual Machine (VM)](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal) in an available zone. 
1. [Deploy an ASC for IoT security agent](how-to-deploy-linux-cs.md) on your IoT device, or new VM.
1. Follow the instructions for [trigger_events](https://aka.ms/iot-security-github-trigger-events) to run a simulation of a harmless attack.
1. Verify ASC for IoT alerts in response to the simulated attack in the previous step. Begin verification five minutes after running the script.
1. Explore [alerts](concept-security-alerts.md), [recommendations](concept-recommendations.md), and [deep dive using Log Analytics](how-to-security-data-access.md) using IoT Hub. 

## Next steps

- Enable [ASC for IoT](quickstart-onboard-iot-hub.md)
- Configure your [solution](quickstart-configure-your-solution.md)
- [Create security modules](quickstart-create-security-twin.md)
- Configure [custom alerts](quickstart-create-custom-alerts.md)
- [Deploy a security agent](how-to-deploy-agent.md)
