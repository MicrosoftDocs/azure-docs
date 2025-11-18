---
title: Create subagents in Azure SRE Agent overview Preview
description: Learn how to use subagent builder in Azure SRE Agent to create and manage intelligent subagents for automating operational workflows.
author: craigshoemaker
ms.author: cshoe
ms.topic: how-to
ms.date: 11/10/2025
ms.service: azure-sre-agent
---

# Create subagents in Azure SRE Agent overview Preview

Azure SRE Agent features a subagent builder to help you create, customize, and manage intelligent subagents for your operational workflows. Use subagent builder to design subagents that can automatically respond to incidents, run scheduled tasks, connect to observability tools, and use your organization's knowledge base to improve decision-making.

## What you can build with subagent builder

Agent builder empowers you to create sophisticated automation solutions for your operational workflows:

| Capability | Description | Example use cases |
|--|--|--|
| Custom subagents | Build specialized subagents with tailored instructions and behaviors | • RCA specialists for specific services<br>• Monitoring subagents for resource health<br>• Compliance checkers for security policies |
| Data integration | Connect your observability tools and knowledge sources | • Azure Monitor for metrics and logs<br>• File uploads for documentation<br>• External APIs through MCP connectors |
| Automated triggers | Set up incident response plans and scheduled tasks | • Automatic incident investigation<br>• Daily health reports<br>• Weekly compliance scans |
| Actions | Communicate with external resources. | • Send email with Outlook<br>• Send Teams notifications<br>• Integrate with custom MCP tools on other SaaS systems |

## Work with subagent builder

To create a new subagent, start by defining the subagent’s primary purpose and operational scope so its responsibilities are clear. Then connect the data sources the subagent uses to expand its content. Potential sources include observability connectors or organizational knowledge (runbooks, procedures).

You can extend the subagent's capabilities by associating system tools and any MCP integrations, and provide custom instructions that guide analytical and operational behavior. Finally, define handoff rules that control when processing should transition to other subagents or human operators.

Incident response plans or scheduled tasks trigger subagents.

Once running, continuously monitor and refine your subagent. Regularly review performance and decision quality, adjust instructions, tune tool selections, and expand capabilities as needs evolve.

## Create your first subagent

Agent builder makes it easy to design and deploy your first intelligent subagent in just a few steps. The following section shows you how to create a new subagent and connect it to tools and data sources.

### Prerequisites

Before using subagent builder, ensure you have:

- **Azure subscription**: A subscription with permissions to create and manage SRE Agent resources.
- **Operational context**: An understanding of your incident response procedures and operational workflows.
- **Data sources**: Access to observability tools and knowledge repositories.

### Create the subagent

1. Go to your Azure SRE Agent in the Azure portal.

1. Select the **Subagent builder** tab.

1. Select **Create**.

1. Select **Subagent**.

1. Provide values for the following settings:

    | Property | Value |
    |--|--|
    | Name | Enter a descriptive name for your subagent. |
    | Instructions | Provide clear, custom instructions that define how the subagent should behave. |
    | Handoff Description | Explain the scenarios when other subagents should transfer processing to this subagent, and why. |
    | Custom Tools (optional) | Choose one or more custom tools for the subagent to use during its operations. |
    | Built-in Tools (optional) | Select any built-in system tools you want the subagent to have access to. |
    | Handoff Agents (optional) | Specify which subagent should take over processing after this subagent completes its tasks. |

    Optionally, you can enable the *Knowledge base* feature. This allows you to [upload files](subagent-builder-scenarios.md#supported-file-types) that your subagent can use as reference material when answering queries.

## Related content

- [agent builder scenarios](./subagent-builder-scenarios.md)
