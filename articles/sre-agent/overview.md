---
title: Overview of Azure SRE Agent Preview
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: overview
ms.date: 07/30/2025
ms.author: cshoe
ms.service: azure
---

# What is Azure SRE Agent Preview?

Site reliability engineering (SRE) focuses on creating reliable, scalable systems through automation and proactive management. Azure SRE Agent brings these principles to your Azure-hosted applications by providing an AI-powered tool that helps sustain production cloud environments.

SRE Agent helps you respond to incidents quickly and effectively, so you don't need to manage production environments manually. The agent uses the reasoning capabilities of large language models (LLMs) to identify the necessary logs and metrics for rapid root-cause analysis and problem mitigation. SRE Agent can help you improve service uptime and reduce operational costs.

The agent has access to every resource inside resource groups associated with that agent. This access enables the agent to:

- Continuously evaluate resource activity and monitor active resources.
- Send proactive notifications about unhealthy or unstable apps.

SRE Agent also integrates with [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview) and [PagerDuty](https://www.pagerduty.com/) to support advanced notification solutions.

> [!NOTE]
> SRE Agent is in preview. To sign up for the waitlist, fill out [this application](https://go.microsoft.com/fwlink/?linkid=2319540).
>
> By using SRE Agent, you consent to the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key features

Azure SRE Agent offers features that enhance the reliability and performance of your Azure resources:

- **Welcome thread**: When you first create your agent, you also create a new thread that provides an initial analysis of your services. The environment analysis creates a snapshot of all the resources that the agent manages. The agent generates a list of applications that it finds in the managed resource groups.

- **Daily threads**: Each day, the agent creates a resource report that summarizes the state and status of the services in your managed resource groups.

- **Tooling**: SRE Agent provides querying and operations support via the Azure CLI and Kubectl.

- **Data sources**: SRE Agent provides access to Azure Resource Manager APIs and Azure Monitor metrics data sources.

- **Incident management**: You can diagnose incidents by chatting with the agent directly or by connecting an incident management platform to the agent. You can automatically respond to Azure Monitor alerts or PagerDuty incidents by using the initial analysis.

- **Proactive monitoring**: SRE Agent provides continuous resource monitoring with real-time alerts for potential problems.

- **Automated mitigation**: SRE Agent provides automatic detection and mitigation of common problems, to help reduce downtime and improve resource health. Although agents attempt to work on your behalf, all automation requires your approval.

- **Infrastructure best practices**: You can identify and remediate resources that aren't following security best practices and help updates.

- **Root cause analysis**: SRE Agent provides can help diagnose root causes of app problems by analyzing metrics and logs and suggesting mitigations.

- **Resource visualization**: Get comprehensive views of your resource dependencies and health status.

  :::image type="content" source="media/overview/resources.png" alt-text="Screenshot of a SRE Agent knowledge graph." lightbox="media/overview/resources.png":::

- **Mitigation support**: SRE Agent can fix application configuration and dependent services. For code problems, the agent provides stack traces and can create GitHub issues to help resolve problems. Service-specific features of the agent include:

  - *Azure App Service*: Roll back deployment, scale resources up or down, and restart applications.
  - *Azure Container Apps*: Roll back deployment, scale resources up or down, and restart applications.
  - *Azure Kubernetes Service*: Restart pods or deployments, roll back deployments to previous revisions, scale resources up or down, and patch resource definitions.

## Reports

SRE Agent works to proactively monitor and maintain your Azure services. Each day, your agent creates daily resource reports that provide insights into the health and status of your applications.

Reports include:

- **Incident summary**: Information about incidents that SRE Agent raised on the previous day. Categories are active, mitigated, and resolved.

- **Application group performance and health**: Key metrics for each application group to assess system stability and performance. Metrics include availability, CPU usage, and memory usage.

- **Action summary**: Summaries of important details and insights that are relevant to the health and maintenance of your Azure resources.

## Scenarios

| Scenario | Possible cause | Agent mitigation |
|---|---|---|
| Application down | ▪ **Application code**: Bugs or errors in the application code can lead to unresponsiveness.<br><br>▪ **Deployment**: Incorrect configurations or failed deployments can cause the application to go down.<br><br>▪ **CPU, memory, or thread**: Resource exhaustion due to high CPU, memory, or thread usage can affect application performance. | SRE Agent can detect these problems and provide actionable insights or fixes. For example, it can identify a decrease in web app availability that coincides with a recent slot swap and recommend swapping back slots as the first step of mitigation. |
| Container image pull failures | ▪ **Image availability**: The requested image might unavailable or missing.<br><br>▪ **Network connectivity**: Network problems can disrupt the connection to the container app.<br><br>▪ **Registry connectivity**: Problems with connecting to the container registry can prevent image pulls. | SRE Agent can detect failures of container image pulls and provide detailed diagnostics. It can recommend solutions such as rolling back to the last-known healthy revision and updating the image reference. |

An agent can provide detailed information about aspects of your apps and resources. The following examples demonstrate the types of questions that you can ask your agent:

- What can you assist me with?
- Why isn't my application working?
- What services is my resource connected to?
- Can you provide best practices for my resource?
- What's the CPU and memory utilization of my app?

Here are some prompts that can help you interact with your agent:

- Which apps have Dapr enabled?
- List replicas for my container app.
- Which apps have diagnostic logging turned on?
- Give me an individual heatmap for each storage account.
- Which revision of my container app is currently active?
- What are some best practices that my app should follow?
- What is the ingress configuration for my container app?
- Are any staging slots configured for this web app?
- What container images are used by each of my container apps?
- List all resource groups that you're managing across all subscriptions.
- Draw a heatmap of storage latencies over the last 14 days for storage accounts.
- Show me a visualization of response times for container apps for last week.
- List [container apps, web apps, or other app types] that you're managing across all subscriptions.
- Visualize the split of container apps versus web apps versus AKS clusters managed across all subscriptions as a pie chart.

## Supported services

Although Azure SRE Agent can help you manage and report on all Azure services, the agent features specialized tools for managing the following services:

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
Which Azure services do you have specialized tooling available for?
```

### Identify resource groups

As you create an agent, the resource group picker indicates groups that have instances of services with specialized tooling. In the resource group picker, a check mark (:::image type="icon" source="media/blue-check.png" border="false":::) next to the group name indicates that the group includes services with specialized support.

## Considerations

Keep in mind the following considerations as you use Azure SRE Agent:

- English is the only supported language in the chat interface.
- During the preview, you can deploy the agent to the Sweden Central region, but the agent can monitor and remediate problems for services in any region.
- For more information on how data is managed in SRE Agent, see the [Microsoft privacy statement](https://www.microsoft.com/privacy/privacystatement).

## Next step

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
