---
title: Azure SRE Agent overview (preview)
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: conceptual
ms.date: 06/18/2025
ms.author: cshoe
ms.service: azure
---

# Azure SRE Agent overview (preview)

Site Reliability Engineering (SRE) focuses on creating reliable, scalable systems through automation and proactive management. Azure SRE Agent brings these principles to your Azure hosted applications by providing an AI-powered tool that helps sustain production cloud environments. SRE Agent helps you respond to incidents quickly and effectively, alleviating the toil of manually managing production environments. The agent uses the reasoning capabilities of large language models (LLMs) to identify the logs and metrics necessary for rapid root cause analysis and issue mitigation. Azure SRE Agent brings you better service uptime and reduced operational costs.

Agents have access to every resource inside the resource groups associated to the agent. Therefore, agents:

- Continuously evaluate resource activity, and monitor active resources

- Send proactive notifications about unhealthy or unstable apps

Azure SRE Agent also integrates with [Azure Monitor Alerts](/azure/azure-monitor/alerts/alerts-overview) and [PagerDuty](https://www.pagerduty.com/) to support advanced notification solutions.

> [!NOTE]
> The SRE Agent feature is in public preview. To sign up for the wait list, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

By using an SRE Agent, you consent to the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key features

Azure SRE Agent offers several key features that enhance the reliability and performance of your Azure resources:

- **Welcome thread**: When you first create your agent, a new thread is created which provides initial analysis of your services. The environment analysis creates a snapshot of all the resources managed by the agent. Additionally, the agent generates a list of applications found in the managed resource groups.

- **Daily threads**: Each day, the agent creates a resource report that summarizes the state and status of the services in your managed resource groups.

- **Tooling**: Querying and operations support via Azure CLI and Kubectl.  

- **Data sources**: Access to Azure Resource Manager APIs and Azure Monitor metrics data sources.

- **Incident management**: Diagnose incidents by chatting with the agent directly or by connecting an incident management platform to the agent. Automatically respond to Azure Monitor alerts or PagerDuty incidents with initial analysis.

- **Proactive monitoring**: Continuous 24x7 resource monitoring with real-time alerts for potential issues.

- **Automated mitigation:** Automatic detection and mitigation of common issues, reducing downtime and improving resource health. While agents attempt to work on your behalf, all automation requires your approval.

- **Infrastructure best practices:** Identify and remediate resources not following security best practices and help updates.

- **Accelerates root cause analysis:** Diagnose root causes of app issues by analyzing metrics and logs and suggest mitigations.

- **Resource visualization**: Comprehensive views of your resource dependencies and health status.

    :::image type="content" source="media/overview/resources.png" alt-text="Screenshot of an SRE Agent knowledge graph." lightbox="media/overview/resources.png":::

- **Mitigation support**: SRE Agent can fix application configuration and dependent services. For code issues, the agent provides stack traces and can create GitHub issue to help resolve issues. The following items describe service-specific features of the agent:

  - *Azure App Service*: Roll back deployment, scale resources up/down, application restarts.  

  - *Azure Container Apps*: Roll back deployment, scale resources up/down, and application restarts.  

  - *Azure Kubernetes Service*: Restart pods/deployments, roll back deployments to previous revisions, scale resources up/down, and patch resource definitions.

## Reports

An SRE Agent works to proactively monitor and maintain your Azure services. Each day your agent creates daily resource reports that provide insights into the health and status of your applications.

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

Further, here are some prompts you can use to help you interact with your agent:

- Which apps have Dapr enabled?
- List replicas for my container app
- Which apps have diagnostic logging turned on?
- Give me an individual heatmap for each storage account.
- Which revision of my container app is currently active?
- What are some best practices that my app should follow?
- What is the ingress configuration for my container app?
- Are there any staging slots configured for this web app?
- What container images are used by each of my Container Apps?
- List all resource groups that you’re managing across all subscriptions.
- Draw heatmap of storage latencies over the last 14 days for storage accounts.
- Show me a visualization of response times for Container Apps for last week.
- List [Container Apps/Web Apps/etc.] that you’re managing across all subscriptions.
- Visualize split of Container Apps vs Web Apps vs AKS clusters managed across all subscriptions as a pie chart.

## Supported services

While Azure SRE Agent can help you manage and report on all Azure services, the agent features specialized tools for managing the following services:

- Azure API Management
- Azure App Service
- Azure Cache for Redis
- Azure Container Apps
- Azure Cosmos DB
- Azure Database for PostgreSQL
- Azure Functions
- Azure Kubernetes Service
- Azure SQL
- Azure Storage
- Azure Virtual Machines

To get the latest list of services with custom agent tooling, you can submit the following prompt to the agent:

```text
Which Azure services do you have specialized tooling available?
```

As you create an agent, the resource group picker indicates groups containing services from this list that feature specialized support. In the create window, a checkmark next to the resource group indicates that the group includes services with specialized support.

## Preview access

Access to an SRE Agent is only available as in preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
