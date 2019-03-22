---
title: Get started using Azure IoT Security Preview| Microsoft Docs
description: Getting started by understanding the basic workflow of Azure IoT Security features and service.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 55c8d3b6-3126-4246-8d07-ef88fe5ea84f
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/22/2019
ms.author: mlottner

---
# Getting started with Azure IoT Security 

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of the different building blocks of the Azure IoT Security service and how to get started with [testing and onboarding](quickstart-onboard-iot-hub.md). 

One of the many benefits of the Azure IoT Security solution is the ability to either quickly onboard in a bring-your-own-agent mode, or choose additional security capabilities in our Azure IoT Security agent driven model. 

## Azure IoT Security working with device agents

When attempting to protect your individual IoT devices, the ability to collect data directly from the devices, or from their network is required. To support this effort, Azure IoT Security offers an arsenal of low-footprint security agents to provide device monitoring and hardening.

In Azure IoT Security preview, reference architecture for Linux and Windows security agents, both in C# and C are provided.
The agents handle raw event collection from the device operating system, event aggregation to reduce cost, and configuration through a device  module twin.
Security messages are sent through your IoT hub, into Azure IoT Security analytics services.

## Azure IoT Security 

Choose the testing and onboarding scenario that best meets your device and environment requirements:

## Get started without Azure IoT Security agents 

For fast service onboarding to monitoring your device identity management, device to cloud, and cloud to device communication patterns, use  following basic workflow for testing and eventual service onboarding. This workflow enables you to use the service without using Azure IoT Security security agents:

1. Onboard Azure IoT Security service to your IoT Hub
1. Add a device.
1. Create a AzureIoTSecurity module for the device. 
1. Create custom alerts. 
1. Define normal device and system behavior. 
1. Perform system testing to verify service and device status. 
1. Explore alerts and deep dive using log analytics using IoT Hub. 


## Get started with Azure IoT Security agents

To make use of Azure IoT Security agents and additional security capabilities, such as; monitoring remote connections, active applications, login events and OS configuration best practices, use the following basic workflow for testing and eventual service onboarding. 

1. Onboard Azure IoT Security service in IoT Hub
2. In IoT Hub, create a new device identity. 
3. Create an AzureIoTSecurity module for the new identity. 
4. [Spin up a new Azure Virtual Machine (VM)](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal) in an available zone. 
5. Install the Azure IoT Security agent on the new VM using the [credentials](how-to-configure-authentication-methods.md) defined in the Azure IoT Security  module.
6. Run [sample script](sample-script.md) to simulate an attack.
7. Verify alerts in IoT Hub up to 5 minutes after running the script. 
8. Explore alert and remediation recommendations along with deeper investigation using log analytics in IoT Hub. 


## Get started with Azure IoT Security with a hybrid agent model

In certain scenarios, you may decide to run certain devices in your IoT solution with Microsoft Azure IoT Security agents, and other devices with your own custom agents. 

In that type of hybrid  scenario, follow the previous instructions for onboarding each type of device and required agent. 
 

## Next steps
Add devices to IoT Hub. (Use IoT Hub docs for this)
IoT Identify device group with shared attributes or commonality. 
Define a security group in IoT Hub, Security, Custom Alert. Define group behavior/custom alerts. Add a new groups Group devices Define custom alerts 


## See Also
- [Azure IoT Security preview](overview.md)
- [Prerequisites](prerequisites.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [Azure IoT Security FAQ](resources-frequently-asked-questions.md)
- [Azure IoT Security alerts](concepts-security-alerts.md)
