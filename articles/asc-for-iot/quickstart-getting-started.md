---
title: Get started using ASC for IoT Preview| Microsoft Docs
description: Find answers to the most frequently asked questions about ASC for IoT features and service.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 670e6d2b-e168-4b14-a9bf-51a33c2a9aad
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/05/2019
ms.author: mlottner

---
# Quickstart: Enable ASC for IoT security services

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to get started with the ASC for IoT preview, and gives an overview of key service features to explore.

## Getting started

### Prerequisites 

> [!NOTE]
> ASC for IoT currently supports standard tier IoT hubs.


Required for new customers:

|IoT hub details|||
|subscription Id|resource group Id|IoT hub name|
  
   1. IoT hub details: subscription Id, resource group Id and IoT hub name.
   
        
   2. Log Analytics (LA) details: subscription Id, resource group Id, workspace Id, workspace name
      
      To be used for storing raw events, security recommendations and alerts
      
      You can use the LA workspace already in use by ASC.
      To see which LA workspaces are used by ASC:
      go to [ASC](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/0) and click _Security policy_.
   
   **Allow at least one week for the ASC for IoT deployment cycle**, after providing us with this information.
   Only after receiving onboarding confirmation, proceed with the following steps: 
   
1. Enable security services
   1. Enable **Security** and **audit solution** in your LA workspace  
   2. Enable **ASC Standard** tier for your subscription
2. Configure your ASC for IoT solution 
   1. Access your IoT Hub and click **Security**. 
   2. Go the **Solution** tab.
   3. Pick and choose which Azure resources are a part of your IoT solution.
      You can add entire subscriptions, resource groups, or single resources.
      ASC for IoT will leverage Azure Security Center to provide security recommendations and alerts for these resources.
3. Create a _$security_ module for all devices within the hub – see [Create $security modules](/scripts/create_security_module) for instructions.
   Note: Repeat this step each time new devices are added to the IoT hub. 
4. Deploy security agents or send security data
    - Option A – **Deploy security agents**
      Download an installation script for the security agent of your choice (C# .NET or C).
      Follow the script guidelines, and run it on your devices to install the security agent.
      See [Deploy security agent](/scripts/deploy_security_agent) for instructions.
    - Option B – **Send security data**
      For unsupported IoT devices, we allow customers to send out security data to be processed by our analytics services.
      ASC for IoT can process different types of security events, as long as they are formatted in specific schema.
      See [Security message schemas](/schemas/security_message) for additional information.
1. Configure your security agents through Security Twin.
   See [Security twin](/schemas/security_module_twin) for additional information.

## Usage scenarios

| Scenario                    | Goals                                                                                 | Actions                                                                                                                                                                                                                 |
|-----------------------------|---------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Explore UI                  | Familiarize yourself with ASC for IoT UI                                              | Browse through the list of recommendations provided for Azure resources, validate their relevance to your solution                                                                                                      |
|                             |                                                                                       | Explore security alerts and their context, are there any False Positives?                                                                                                                                               |
| Agent-less device security  | Explore agent-less security capabilities for IoT device, in comparison to agent-based | Connect a few IoT devices to your IoT hub and create _$security_ modules (see [Create $security modules](/scripts/create_security_module) for instructions)                                                             |
|                             |                                                                                       | Browse through the list of recommendations provided for these devices, validate their relevance to your solution                                                                                                        |
|                             |                                                                                       | Explore security alerts and their context, are there any False Positives?                                                                                                                                               |
| Agent-based device security | Validate agent support for your devices                                               | Choose a few IoT devices, preferably of multiple different platforms                                                                                                                                                    |
|                             |                                                                                       | Run a business application on these devices, to mimic production behavior (as much as possible)                                                                                                                         |
|                             |                                                                                       | Connect these devices to your IoT hub and create _$security_ modules (see [Create $security modules](/scripts/create_security_module) for instructions)                                                                 |
|                             |                                                                                       | Deploy security agent (see [Deploy security agent](/scripts/deploy_security_agent) for instructions)                                                                                                                    |
|                             |                                                                                       | Validate agent performance and resource consumption (does the agent disturb normal device activity?)                                                                                                                    |
|                             |                                                                                       | Validate data is flowing through to ASC for IoT: go to the UI and look for a validation alert on these devices (this alert is triggered when raw security data is received from device for the first time)              |
|                             | Explore agent-based security capabilities for IoT device, in comparison to agent-less | Browse through the list of recommendations provided for these devices, validate their relevance to your solution                                                                                                        |
|                             |                                                                                       | Explore security alerts and their context, are there any False Positives?                                                                                                                                               |
|                             |                                                                                       | Trigger a security alert by running a mock “malicious executable” on your devices (see [Trigger agent events](/scripts/trigger_agent_events) for instructions) and verify that appropriate alerts are generated         |
|                             |                                                                                       | Trigger a security recommendation by listening to an HTTP port on your devices (see [Trigger agent events](/scripts/trigger_agent_events) for instructions) and verify that appropriate recommendations are generated   |
| Investigate device alerts   | Explore device alert schema in OMS and device Security Module Twin schema             | Follow through the above scenarios to generate security recommendations and alerts                                                                                                                                      |
|                             |                                                                                       | Go to device Security Module twins and explore recommendation and alert devices                                                                                                                                         |
|                             |                                                                                       | Log in to your OMS workspace, and explore device alerts in _SecurityAlert_ table                                                                                                                                        |

## Device agents

Protecting individual devices requires collecting data from the devices themselves, or from their network.
For that reason, ASC for IoT is developing an arsenal of low-footprint security agents to provide monitoring and hardening for IoT devices.

For the ASC for IoT preview, reference architecture for Linux and Windows security agents for IoT devices, both in C# .NET and C is provided.
These agents handle raw event collection from the OS, event aggregation to reduce cost, and configuration through device _$security_ module twin.
Security messages are sent through the customer’s IoT hub, into ASC for IoT analytics services.

## Supported resources

Security analytics and best practices are provided for the following resources:

- IoT leaf devices
  - Agent based – monitoring remote connections, active applications, login events and OS configuration best practices
  - Non-agent based – monitoring device identity management, device to cloud and cloud to device communication patterns
- IoT Edge devices – coming soon
- Azure IoT hub
- Non-IoT Azure resources, powered by ASC

## See Also
- [Installation for Windows](install-windows.md)
- [ASC for IoT alerts](alerts.md)
- [Data Access](dataaccess.md)
- [Recommendations](recommendations.md)