---
title: Frequently asked questions for ASC for IoT Preview| Microsoft Docs
description: Find answers to the most frequently asked questions about ASC for IoT features and service.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 97fda6c2-1ecb-491f-b48d-41788bd7e0d3
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/07/2019
ms.author: mlottner

---
# ASC for IoT frequently asked questions  

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides a list of frequently asked questions and answers about ASC for IoT divided into the following catergories: 
- [What is ASC for IoT](#what-is-azure-atp)
- [Licensing and privacy](#licensing-and-privacy)
- [Deployment](#deployment)
- [Operations](#operation)
- [Troubleshooting](#troubleshooting)

## Does Azure provide support for IoT security?

Azure provides an integrated view for monitoring and managing your IoT security as part of your overall security solution through Azure Security Center. If you are an application developer, you can use IoT Hub view to manage your IoT application security.
## What is ASC for IoT

### What is Azure’s unique value proposition for IoT security?

Azure enables enterprises to extend their cyber security view to their entire IoT solution. Azure provides an end to end view of your business solution, enabling you to take business related actions and decisions based on your enterprise security posture and collected data. Azure IoT, Azure Edge, Azure Sphere, Azure Central and Azure Security Center enable you to create the solution you want with the security you need.

### Who is ASC for IoT made for? 

Azure IoT security serves two personas:

* Enterprise IT Security and SecOps (Azure Security Center personas):

o Task: manage and monitor the security of the IoT Solution as part of enterprise security

o Experience: integration with Azure Security Center

* OT and IoT solution DevOps and solution providers:

o Task: manage and monitor the security of the IoT Solution

o Experience: dedicated IoT Security blade that shows state, recommendations, alerts and policy configuration

Azure IoT security UI integrated within Azure IoT hub security blade provides management for the day to day business solution security operations, while ASC IoT capabilities provide an integrated view for monitoring and managing your IoT security as part of your overall security solution

Who are the competitors?

One major competitor for Azure IoT Security is AWS IoT defender, - which provides customers with capabilities to build their security monitoring solution. AWS IoT Defender enables customers to audit and monitor their connected IoT devices posture and behavior. It is best suited to customers who want to do sic security monitoring and like to have precise understanding on what they are monitoring.

How does ASoT compare to the competition?

While AWS IoT defender provides set of capabilities for the customer to create his solution, Azure provides an IoT security solution that gives a wide view across the security of all relevant Azure resources. Azure enables fast deployment and full integration with IoT Hub Twins for easy integration with existing devices management tools.

## Do I have to be an Azure Security Center (ASC) customer?

Yes. Microsoft Azure IoT security is an extension of ASC, it extends enterprise cloud resources security posture to include IoT resources. This provides security professionals a single pane to monitor their security posture including the security of machines, networks, Azure services and Azure IoT solution (from edge devices to applications).

## Do I have to be an Azure IoT customer?

Yes. Azure IoT Security solution relays on Azure IoT connectivity infrastructure.

## Do I have to install an agent?

Agent installation on your IoT device is not mandatory in order to enable Microsoft Azure IoT Security service. You can choose between the following three options and gain different levels of security monitoring and management capabilities:

1. Install Microsoft Azure IoT Security agent with or without modifications: This option provides enhanced security insights into device behavior & access.

2. Create your agent or implement Microsoft Azure IoT security message schema: Enables the usage of Microsoft Azure IoT security analysis tools on top of customer device security agent

3. No security agent on IoT devices: Enables IoT Hub communication monitoring, with reduced security monitoring & management capabilities

### What does the ASC for IoT agent do?

ASC for IoT Security Agent provides device level threat coverage for:device configuration, behavior & access by scanning its configuration, process & connectivity. Azure IoT security agent does not scan business related data or activity.

## Where I can get the ASC for IoT agent?

The Asc for IoT security agent is open source and available in GitHub in 32 and 64bit Windows and Linux versions: https://github.com/Azure/Azure-Security-IoT-Preview

## Where does the ASC for IoT agent get installed? 

Detailed installation and agent deployment information can be found in GitHub: https://github.com/Azure/Azure-Security-IoT-Preview

## What are the minimal hardware requirements for the ASC for IoT agent?

The agent is easily deployable on 4G flash, 512M RAM, ARM v7 Cortex-A8 1Ghz systems. We recommend integrating the agent in a lab environment to learn and set device specific configuration that meets your needs before production deployment.

## What are the dependencies and prerequisites of the agent?

1. C# agent: Ubuntu 16.04 x64 or similar; Debian 9 & 8 x64

2. C agent: Debian 9 & 8 x32 bit 3. AuditD framework is required

## Which data is collected by the agent?

Connectivity, access, firewall configuration, process list & OS baseline are collected by the agent.

## How much data will the agent generate?

Agent data generation is driven by device configuration, application and its connectivity type and customer agent configuration. Due to this high variability between devices and IoT solutions, Microsoft Azure IoT security team recommends to deploy the agent first in the lab to learn and set specific configuration that fits your needs and measure the amount of generated data. Azure IoT security agent also provides operational recommendation for optimizing agent throughput to help you with the process.

## How can I control my billing?

You have the ability to configure agent scans, data buffers and create custom alerts to increase or reduce the amount of data generated by the agent.

## Do agent messages use up quota from IoT Hub?

Yes. Agent transmitted data is counted in Hub quota.

## What next? I've installed an agent and do not see any activities or logs

1. Check agent type fits the designated OS platform & the agent is running on the device

2. Check proper on boarding to Azure IoT security service in IoT Hub

3. Check that the device is configured in IoT hub with security module

4. Contact Azure security CSS

## What happens when the internet connection stops working?

The agent continues to run and store data as long as the machine is running. Data is stored to security message cache per its size configuration. Upon regaining connectivity security messages will be sent again.

## If the machine was restarted, will the agent self-recover?

The agent will re-run with machine restart automatically.

## Can the agent effect the performance of the machine or other installed software?

The agent consumes machine resources as any other application/process and should not disrupt device’s normal activity. The resource consumption on the machine agent is running is coupled with its set up and configuration. It is highly recommended to test your agent configuration in a contained environment and its interoperability with IoT application functionality.

## I'm making some maintenance on the machine. Can I turn the agent off?

The agent cannot be turned off.

## Is there a way to test if the agent is working correctly? 

If the agent stops communicating / sending security messages; an alert of “Device is silent” will be generated.

## Can I create my own alerts?

Yes. You can set a custom alert on pre-determined set of parameters such as IP address & open ports. For more information on how to create alerts please visit: - place a link to webinar

## Where can I see logs? Can I customize log writings?

a. Alerts and recommendation can be seen in customer Log Analytics connected account. You can configure storage size and duration.

b. Agent raw data can be stored in customer Log Analytics account if you decide (optional and can be set from Azure IoT security blade). You can configure storage size and duration.

## Why should I add the "Microsoft.Security" to the Module Identity? What is it for?

Microsoft.Security module is used for agent configuration & management.


## Next steps
To learn more about ASC for IoT, see the following articles:
- [Introducing ASC for IoT](introducing-asc-for-iot.md).
- [ASC for IoT architecture](architecture.md) 
- [Get started](get-started.md).
