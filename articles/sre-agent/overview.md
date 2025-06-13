---
title: Azure SRE Agent overview (preview)
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: conceptual
ms.date: 06/13/2025
ms.author: cshoe
ms.service: azure
---

# Azure SRE Agent overview (preview)

Site Reliability Engineering (SRE) focuses on creating reliable, scalable systems through automation and proactive management. Azure SRE Agent brings these principles to your Azure hosted applications by providing an AI-powered tool that helps sustain production cloud environments. SRE Agent helps you respond to incidents quickly and effectively, alleviating the toil of manually managing production environments. The agent leverages the reasoning capabilities of LLMs to identify the logs and metrics necessary for rapid root cause analysis and issue mitigation. Azure SRE Agent brings you better service uptime and reduced operational costs.

Agents have access to every resource inside the resource groups associated to the agent. Therefore, agents:

- Continuously evaluate resource activity, and monitor active resources

- Send proactive notifications about unhealthy or unstable apps

An SRE Agent also integrates with [Azure Monitor Alerts](/azure/azure-monitor/alerts/alerts-overview) and [PagerDuty](https://www.pagerduty.com/) to support advanced notification solutions.

> [!NOTE]
> The SRE Agent feature is in limited preview. To sign up for the wait list, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

By using an SRE Agent, you consent the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key features

The SRE Agent offers several key features that enhance the reliability and performance of your Azure resources:

- **Proactive monitoring**: Continuous 24x7 resource monitoring with real-time alerts for potential issues and daily resource reports.

- **Automated mitigation:** Automatic detection and mitigation of common issues, reducing downtime and improving resource health. While agents attempt to work on your behalf, all automation requires your approval.

- **Infrastructure best practices:** Identify and remediate resources not following security best practices and help updates.

- **Automates incident response:** Automatically respond to Azure Monitor alerts or PagerDuty incidents with initial analysis.

- **Accelerates root cause analysis:** Diagnose root causes of app issues by analyzing metrics and logs and suggest mitigations.

- **Resource visualization**: Comprehensive views of your resource dependencies and health status.

    :::image type="content" source="media/overview/resources.png" alt-text="Screenshot of an SRE Agent knowledge graph.":::

An SRE Agent works to proactively monitor and maintain your Azure services. Each day your agent creates daily resource reports which provide insights into the health and status of your applications.

Reports include:

- **Incident summary:** Generates information about incidents raised by the SRE Agent on the previous day. Categories include: active, mitigated, or resolved.

- **Application group performance and health:** Key metrics for each application group to assess system stability and performance. Metrics include: availability, CPU usage, and memory usage.

- **Action summary:** Summaries of important details and insights relevant to the health and maintenance of your Azure resources.

## Scenarios

| Scenario | Possible cause | Agent mitigation |
|---|---|---|
| Application down | ▪ **Application code issues**: Bugs or errors in the application code can lead to crashes or unresponsiveness.<br><br>▪ **Bad deployment**: Incorrect configurations or failed deployments can cause the application to go down.<br><br>▪ **High CPU/memory/thread issues**: Resource exhaustion due to high CPU, memory, or thread usage can affect application performance. | The SRE Agent can detect these issues and provide actionable insights or fixes. For example, it can identify a decrease in web app availability that coincides with a recent slot swap and recommend swapping back slots as the first step of mitigation. |
| Container image pull failures | ▪ **Image availability**: The requested image might not be available or could be missing.<br><br>▪ **Network connectivity**: Network issues can disrupt the connection to the container app.<br><br>▪ **Registry connectivity issues**: Problems with connecting to the container registry can prevent image pulls. | The SRE Agent can detect container image pull failures and provide detailed diagnostics. It can recommend solutions such as rolling back to the last known healthy revision and updating the image reference. |

An agent can provide detailed information about different aspects of your apps and resources. The following examples demonstrate the types of questions you could pose to your agent:

- What can you assist me with?
- Why isn't my application working?
- What services is my resource connected to?
- Can you provide best practices for my resource?
- What's the CPU and memory utilization of my app?

## Preview access

Access to an SRE Agent is only available as a limited preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
