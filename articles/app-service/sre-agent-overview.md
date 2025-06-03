---
title: Azure SRE Agent overview (preview)
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: conceptual
ms.date: 05/16/2025
ms.author: cshoe
ms.custom:
  - build-2025
---

# Azure SRE Agent overview (preview)

Site Reliability Engineering (SRE) focuses on creating reliable, scalable systems through automation and proactive management. Azure SRE Agent brings these principles to your Azure hosted applications by providing AI-powered monitoring, troubleshooting, and remediation capabilities to your app environments. The agent automates routine operational tasks and provides reasoned insights to help you maintain application reliability while reducing manual intervention. Available as a chat interface, you can ask questions and give natural language commands to maintain your applications and services. To ensure accuracy and control, any agent action taken on your behalf requires your approval.

Agents have access to every resource inside the resource groups associated to the agent. Therefore, agents:

- Continuously evaluate resource activity, and monitor active resources

- Send proactive notifications about unhealthy or unstable apps

- Provide a natural language interface to issue commands

An SRE Agent also integrates with [PagerDuty](https://www.pagerduty.com/) to support advanced notification solutions.

> [!NOTE]
> The SRE Agent feature is in limited preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

By using an SRE Agent, you consent the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key features

The SRE Agent offers several key features that enhance the reliability and performance of your Azure resources:

- **Proactive monitoring**: Continuous 24x7 resource monitoring with real-time alerts for potential issues and daily resource reports.

- **Automated mitigation:** Automatic detection and mitigation of common issues, reducing downtime and improving resource health. While agents attempt to work on your behalf, all automation requires your approval.

- **Infrastructure best practices:** Identify and remediate resources not following security best practices and help updates.

- **Automates incident response:** Automatically respond to Azure Monitor alerts or PagerDuty incidents with initial analysis.

- **Accelerates root cause analysis:** Diagnose root causes of app issues by analyzing metrics and logs and suggest mitigations.

- **Resource visualization**: Comprehensive views of your resource dependencies and health status.

    :::image type="content" source="media/sre-agent/sre-agent-knowldege-graph.png" alt-text="Screenshot of an SRE Agent knowledge graph.":::

An SRE Agent works to proactively monitor and maintain your Azure services. Each day your agent creates daily resource reports which provide insights into the health and status of your applications.

Reports include:

- **Incident summary:** Generates information about incidents raised by the SRE Agent on the previous day. Categories include: active, mitigated, or resolved.

- **Application group performance and health:** Key metrics for each application group to assess system stability and performance. Metrics include: availability, CPU usage, and memory usage.

- **Action summary:** Summaries of important details and insights relevant to the health and maintenance of your Azure resources.

## Scenarios

| Scenario | Possible cause | Agent mitigation |
|---|---|---|
| Application down | ▪ **Application code issues**: Bugs or errors in the application code can lead to crashes or unresponsiveness.<br><br>▪ **Bad deployment**: Incorrect configurations or failed deployments can cause the application to go down.<br><br>▪ **High CPU/memory/thread issues**: Resource exhaustion due to high CPU, memory, or thread usage can affect application performance. | The SRE Agent can detect these issues and provide actionable insights or fixes. For example, it can identify a decrease in web app availability that coincides with a recent slot swap and recommend swapping back slots as first step of mitigation. |
| Virtual machine RDP issues | ▪ **NSG rules**: Misconfigured NSG rules on the NIC or Subnet can block RDP access. | The SRE Agent can detect misconfigurations of NSG rules that block RDP access. Agents can also apply the correct NSG rules to restore access. |
| Container image pull failures | ▪ **Image availability**: The requested image might not be available or could be missing.<br><br>▪ **Network connectivity**: Network issues can disrupt the connection to the container app.<br><br>▪ **Registry connectivity issues**: Problems with connecting to the container registry can prevent image pulls. | The SRE Agent can detect container image pull failures and provide detailed diagnostics. It can recommend solutions such as rolling back to the last known healthy revision and updating the image reference. |

An agent can provide detailed information about different aspects of your apps and resources. The following examples demonstrate the types of questions you could pose to your agent:

- What can you assist me with?
- Why isn't my application working?
- What services is my resource connected to?
- Can you provide best practices for my resource?
- What's the CPU and memory utilization of my app?

## Preview access

Access to an SRE Agent is only available as a limited preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

## Frequently asked questions

### What is Azure SRE Agent, what can it do, and what are its intended uses?

The Azure SRE Agent is a system designed to assist Site Reliability Engineers (SREs) in managing their Azure resources. Agents perform tasks such as monitoring, diagnosing, and mitigating issues.

The system takes your input on the resources it manages, the health or status of specific resources, and any issues to those resources.

Outputs from the agent include:

- Information about resources
- Mitigations and solutions to issues
- Recommendations on best practices
- Actions to resolve issues or implement best practices with user approval

The Azure SRE Agent offers functionalities to assist SREs in managing Azure resources. Agents monitor system metrics and logs to detect issues early, diagnose the root causes of problems, and implement fixes and preventive measures to avoid future incidents. Examples of tasks the agent can handle include:

- Diagnosing and troubleshooting "application down" scenarios
- Getting resource availability information
- Ensuring Azure resources are following best practices.

The agent performs actions on behalf of the user with the right approvals and permissions, ensuring that humans remain in control.

The intended use of the SRE Agent is to help you monitor, diagnose issues, and maintain your Azure resources. The agent is designed to improve the reliability and efficiency of software systems by handling tasks like:

- Reading customer resource metrics and logs
- Provide mitigations or recommendations
- Perform actions on the customer's behalf with the right approvals and permissions

The agent aims to reduce the toil of SREs by automating routine tasks and providing insights and recommendations to enhance system reliability.

### How was SRE Agent evaluated? What metrics are used to measure performance?

The SRE Agent was evaluated through various assessment activities, including user validation, measurement, and mitigations. Metrics used to measure performance include the accuracy of diagnostics, the effectiveness of mitigations, and user feedback on the agent's recommendations.

The evaluation process involved testing the agent's capabilities across different scenarios, such as app availability and incident response, to ensure its reliability and effectiveness. Results are generalizable across use cases that weren't part of the initial evaluation. The agent's design allows it to adapt to different situations and provide consistent performance.

### What are the limitations of SRE Agent? How can impact of SRE Agent’s limitations be minimized?

The known limitations of the SRE Agent include its reliance on user approval for performing actions, which can slow down the response time in critical situations. Additionally, the agent might not be able to solve all problems or could produce inaccurate recommendations due to limitations in its knowledge base.

You can minimize the impact of these limitations by providing detailed and accurate inputs, regularly updating the agent's configuration, and closely monitoring its actions. Ensuring a human SRE reviews and validates the agent's recommendations also helps mitigate potential errors.

### What operational factors and settings allow for effective and responsible use of SRE Agent?

Effective and responsible use of the SRE Agent requires configuring the system to manage the appropriate resources and setting up permissions and approvals for actions. Ensuring that the agent operates within defined parameters and regularly reviewing its actions can help maintain reliability and safety.

### How do I provide feedback?

The current feedback system for the Azure SRE Agent includes thumbs-up and thumbs-down buttons for you to rate the quality of the agent's responses.

When you select either the thumbs-up or thumbs-down button, a small pop-up appears in the same view containing a text box for free-form text feedback. You can enter submit comments here to help the development identify areas for improvement.
