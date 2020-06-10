---
title: Frequently asked questions
description: Find answers to the most frequently asked questions about Azure Security Center for IoT features and service.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 97fda6c2-1ecb-491f-b48d-41788bd7e0d3
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/23/2019
ms.author: mlottner
---

# Azure Security Center for IoT frequently asked questions

This article provides a list of frequently asked questions and answers about Azure Security Center for IoT.

## Does Azure provide support for IoT security?

Azure provides an integrated view for monitoring and managing your IoT security as part of your overall security solution through Azure Security Center. If you are an application developer, you can use IoT Hub view to manage your IoT application security.

## What is Azure's unique value proposition for IoT security?

Azure Security Center for IoT enables enterprises to extend their existing cyber security view to their entire IoT solution. Azure provides an end to end view of your business solution, enabling you to take business-related actions and decisions based on your enterprise security posture and collected data. Combined security using Azure IoT, Azure IoT Edge, and Azure Security Center enable you to create the solution you want with the security you need.

## Who is Azure Security Center for IoT made for?

Azure Security Center for IoT is integrated within Azure IoT Hub Security and provides management for the day to day business solution security operations. Azure Security Center for IoT is also integrated into Azure Security Center capabilities and provide an integrated view for monitoring and managing your IoT security as part of your overall security solution.

## How does Azure Security Center for IoT compare to the competition?

While other solutions provide a set of capabilities that allow customers to create their own solutions, Azure Security Center for IoT provides a unique end-to-end IoT security solution that provides a wide view across the security of all of your related Azure resources. Azure enables fast deployment and full integration with IoT Hub module twins for easy integration with existing device management tools.

## Do I have to be an Azure Security Center customer to use this service?

No, but it is recommended. Without Azure Security Center, Azure Security Center for IoT receives limited connected resource data and provides a limited analysis of your potential attack surface, threats, and potential attacks.

## Do I have to be an Azure IoT customer?

Yes. Azure Security Center for IoT relies on Azure IoT connectivity and infrastructure.

## Do I have to install an agent?

Agent installation on your IoT devices isn't mandatory in order to enable the Microsoft Azure Security Center for IoT. You can choose between the following three options, gaining different levels of security monitoring and management capabilities according to your selection:

1. Install the Azure Security Center for IoT security agent with or without modifications. This option provides the highest level of enhanced security insights into device behavior and access.

1. Create your own agent and implement Microsoft Azure Security Center for IoT security message schema. This option enables usage of Microsoft Azure Security Center for IoT analysis tools on top of your device security agent.

1. No security agent installation on your IoT devices. This option enables IoT Hub communication monitoring, with reduced security monitoring  and management capabilities.

## What does the Azure Security Center for IoT agent do?

Azure Security Center for IoT agent provides device level threat coverage for device configuration, behavior, and access (by scanning the configuration), process & connectivity. The Azure Security Center for IoT security agent does not scan business-related data or activity.

## Where can I get the Azure Security Center for IoT security agent?

The Azure Security Center for IoT security agent is open source and available on GitHub in 32 bit and 64-bit Windows and Linux versions: https://github.com/Azure/Azure-IoT-Security.

## Where does the Azure Security Center for IoT agent get installed?

Detailed installation and agent deployment information can be found in GitHub: https://github.com/Azure/Azure-IoT-Security.

## What are the dependencies and prerequisites of the agent?

Azure Security Center for IoT supports a wide variety of platforms. See [Supported Device platforms](how-to-deploy-agent.md) to verify support for your specific devices.

## Which data is collected by the agent?

Connectivity, access, firewall configuration, process list & OS baseline are collected by the agent.

## How much data will the agent generate?

Agent data generation is driven by device, application, connectivity type, and customer agent configuration. Due to the high variability between devices and IoT solutions, we recommend first deploying the agent in a lab or test setting to observe, learn, and set the specific configuration that fits your needs, while measuring the amount of generated data. After starting the service, the Azure Security Center for IoT agent provides operational recommendations for optimizing agent throughput to help you with the configuration and customization process.

## How can I control my billing?

Azure Security Center for IoT provides configurable agent scans, data buffers, and the ability to create custom alerts that increase or reduce the amount of data generated by the agent.

## Do agent messages use up quota from IoT Hub?

Yes. Agent transmitted data is counted in your IoT Hub quota.

## What next? I've installed an agent and don't see any activities or logs...

1. Check the [agent type fits the designated OS platform of your device](how-to-deploy-agent.md)

1. Confirm the [agent is running on the device](how-to-agent-configuration.md).

1. Check the [service was enabled successfully](quickstart-onboard-iot-hub.md) to **Security** in your IoT Hub.

1. Check that the device is [configured in IoT Hub with the Azure Security Center for IoT module](quickstart-create-security-twin.md).

If the activities or logs are still unavailable, contact your Azure Security Center for IoT partner for additional help.

## What happens when the internet connection stops working?

The agent continues to run and store data as long as the device is running. Data is stored in the security message cache according to size configuration. When the device regains connectivity, security messages resume sending.

## If the device is restarted, will the security agent self-recover?

The security agent is designed to rerun automatically with each device restart.

## Can the agent affect the performance of the device or other installed software?

The agent consumes machine resources as any other application/process and should not disrupt normal device activity. Resource consumption on the device the agent runs on is coupled with its setup and configuration. We recommend testing your agent configuration in a contained environment, along with interoperability with your other IoT applications and functionality, before attempting to deploy in a production environment.

## I'm making some maintenance on the device. Can I turn off the agent?

The agent cannot be turned off.

## Is there a way to test if the agent is working correctly?

If the agent stops communicating or fails to send security messages, a **Device is silent** alert is generated.

## Can I create my own alerts?

Yes. You can set a customized alert on pre-determined set of behaviors such as IP address and open ports. See [Create custom alerts](quickstart-create-custom-alerts.md) to learn more about custom alerts and how to make them.

## Where can I see logs? Can I customize logs?

- View alerts and recommendations using your connected Log Analytics workspace. Configure storage size and duration in the workspace.

- Raw data from your security agent can also be stored in your Log Analytics account. Consider size, duration, storage requirements, and associated costs before changing the configuration of this option.

## Why should I add Azure Security Center for IoT to the module identity? What is it used for?

The Azure Security Center for IoT module is used for agent configuration and management.

## Next steps

To learn more about how to get started with Azure Security Center for IoT, see the following articles:

- Read the Azure Security Center for IoT [overview](overview.md)
- Verify the [Service prerequisites](service-prerequisites.md)
- Learn more about how to [Get started](getting-started.md)
- Understand [Azure Security Center for IoT security alerts](concept-security-alerts.md)
