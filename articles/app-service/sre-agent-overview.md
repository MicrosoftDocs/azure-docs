---
title: SRE Agent overview (preview)
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/06/2025
ms.author: cshoe
---

# SRE Agent overview (preview)

Site Reliability Engineering (SRE) focuses on creating reliable, scalable systems through automation and proactive management. An SRE Agent brings these principles to your cloud environment by providing AI-powered monitoring, troubleshooting, and remediation capabilities. An SRE Agent automates routine operational tasks and provides reasoned insights to help you maintain application reliability while reducing manual intervention. Available as a chatbot, you can ask questions and give natural language commands to maintain your applications and services. To ensure accuracy and control, any agent action taken on your behalf requires your approval.

Agents have access to every resource inside the resource groups associated to the agent. Therefore, agents:

- Continuously evaluate resource activity, and monitor active resources

- Send proactive notifications about unhealthy or unstable apps

- Provide a natural language interface to issue commands

An SRE Agent also integrates with [PagerDuty](https://www.pagerduty.com/) to support advanced notification solutions.

> [!NOTE]
> The SRE Agent feature is in limited preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

## Key features

The SRE Agent offers several key features that enhance the reliability and performance of your Azure resources:

- **Proactive monitoring**: Continuous resource monitoring with real-time alerts for potential issues and daily resource reports.

- **Automated mitigation:** Automatic detection and mitigation of common issues, reducing downtime and improving resource health. While agents attempt to work on your behalf, all automation requires your approval.

- **Resource visualization**: Comprehensive views of your resource dependencies and health status.

    :::image type="content" source="media/sre-agent/sre-agent-knowldege-graph.png" alt-text="Screenshot of an SRE Agent knowledge graph.":::

An SRE Agent works to proactively monitor and maintain your Azure services. Each day your agent creates daily resource reports which provide insights into the health and status of your applications. Reports include:

- **Actionable steps**: Measures you can take each day to reduce errors and harden security practices.

- **Key insights**: Summaries of important details relevant to the health and maintenance of your Azure resources.

- **Reasoning**: Summaries of analysis done by your agent helping surface possible problem areas in your apps.

- **Actions already taken by the agent**: A list of tasks the agent did on your behalf for the day.

## Scenarios

| Scenario | Possible cause | Agent mitigation |
|---|---|---|
| Application down | ▪ **Application code issues**: Bugs or errors in the application code can lead to crashes or unresponsiveness.<br><br>▪ **Bad deployment**: Incorrect configurations or failed deployments can cause the application to go down.<br><br>▪ **High CPU/memory/thread issues**: Resource exhaustion due to high CPU, memory, or thread usage can affect application performance. | The SRE Agent can detect these issues and provide actionable insights or fixes. For example, it can identify a decrease in web app availability that coincides with a recent slot swap and recommend swapping back slots as first step of mitigation. |
| Virtual machine RDP issues | ▪ **NSG rules**: Misconfigured NSG rules on the NIC or Subnet can block RDP access. | The SRE Agent can monitor virtual machine health and network configurations, providing alerts and recommendations to resolve RDP issues. Agents can also automate the application of correct firewall rules to restore access. |
| Container image pull failures | ▪ **Registry authentication issues**: Problems with authentication to the container registry can prevent image pulls.<br><br> ▪ **Network connectivity**: Network issues can disrupt the connection to the container registry.<br><br>▪ **Image availability**: The requested image might not be available or could be missing. | The SRE Agent can detect container image pull failures and provide detailed diagnostics. It can recommend solutions such as verifying registry credentials, checking network connectivity, or ensuring the image is available. |

An agent can provide detailed information about different aspects of your apps and resources. The following examples demonstrate the types of questions you could pose to your agent:

- What can you assist me with?
- Why isn't my application working?
- What services is my resource connected to?
- Can you provide best practices for my resource?
- What's the CPU and memory utilization of my app?

## Preview access

Access to an SRE Agent is only available as a limited preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).
