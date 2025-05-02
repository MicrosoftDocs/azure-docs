---
title: SRE Agent overview (preview)
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/02/2025
ms.author: cshoe
---

# Azure SRE Agent overview

An SRE Agent is AI-enabled service that works on your behalf as you build resilient and self-healing systems. Available as a chatbot, you can ask questions and give natural language commands to maintain your applications and services.

Agents have access to every resource inside the resource groups associated to the agent. Therefore, agents:

- Continuously evaluate resource activity, and monitor active resources

- Send proactive notifications about unhealthy or unstable apps

- Provide a natural language interface to issue commands

An Azure SRE Agent also integrates with [PagerDuty](https://www.pagerduty.com/) to support advanced notification solutions.

> [!NOTE]
> The SRE Agent feature is in limited preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

## Key features

The Azure SRE Agent offers several key features that enhance the reliability and performance of your Azure resources:

- **Proactive monitoring**: Continuous resource monitoring with real-time alerts for potential issues and daily resource reports.

- **Automated mitigation:** Automatic detection and mitigation of common issues, reducing downtime and improving resource health.

- **Resource visualization**: Comprehensive views of your resource dependencies and health status

## Scenarios

| Scenario | Possible cause | Agent mitigation |
|---|---|---|
| Application down | ▪ **Application code issues**: Bugs or errors in the application code can lead to crashes or unresponsiveness.<br><br>▪ **Bad deployment**: Incorrect configurations or failed deployments can cause the application to go down.<br><br>▪ **High CPU/memory/thread issues**: Resource exhaustion due to high CPU, memory, or thread usage can affect application performance. | The Azure SRE Agent can detect these issues and provide actionable insights or automated fixes. For example, it can identify high CPU usage and recommend scaling up the resources or suggest code optimizations. |
| Virtual machine RDP issues | ▪ **Network configuration problems**: Incorrect network settings can prevent Remote Desktop Protocol (RDP) access to virtual machines.<br><br> ▪ **Firewall rules**: Misconfigured firewall rules can block RDP access.<br><br> ▪ **Resource health**: Virtual machine health issues can affect RDP connectivity. | The Azure SRE Agent can monitor virtual machine health and network configurations, providing alerts and recommendations to resolve RDP issues. Agents can also automate the application of correct firewall rules to restore access. |
| Container image pull failures | ▪ **Registry authentication issues**: Problems with authentication to the container registry can prevent image pulls.<br><br> ▪ **Network connectivity**: Network issues can disrupt the connection to the container registry.<br><br>▪ **Image availability**: The requested image might not be available or could be missing. | The Azure SRE Agent can detect container image pull failures and provide detailed diagnostics. It can recommend solutions such as verifying registry credentials, checking network connectivity, or ensuring the image is available. |

## Security context

An SRE Agent works on your behalf to evaluate and make changes to your Azure resources. Before you can create an agent, you need to make sure you're using an account that has the appropriate security context.

The user account used to create an agent needs `Microsoft.Authorization/roleAssignments/write` permissions using either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

## Preview access

Access to an SRE Agent is only available as a limited preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).
