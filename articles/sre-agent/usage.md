---
title: Create and Use an agent in Azure SRE Agent Preview
description: Learn how to use an automated agent to resolve problems and keep your apps running in Azure.
author: craigshoemaker
ms.topic: how-to
ms.date: 10/28/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Create and use an agent in Azure SRE Agent Preview

Azure SRE Agent helps you maintain the health and performance of your Azure resources through AI-powered monitoring and assistance. Agents continuously watch your resources for problems, provide troubleshooting help, and suggest remediation steps in a natural-language chat interface. To ensure accuracy and control, any action that an agent takes on your behalf requires your approval.

This article demonstrates how to create an agent and connect it to your resources to maintain optimal application performance.



## Prerequisites

[!INCLUDE [prerequisites](includes/prerequisites.md)]

## Create an agent

Create an agent by associating resource groups that you want to monitor with the agent:

1. Open the [Azure portal](https://aka.ms/sreagent/portal).

1. Select **Create**.

1. On the **Create agent** pane, enter the following values. During this step, you create a new resource group specifically for your agent. It's independent of the resource group for your application.

    In the **Project details** section, enter these values:

    | Property | Value |
    |---|---|
    | **Subscription** | Select your Azure subscription. |
    | **Resource group** | Select an existing resource group, or enter a name to create a new one. |

    In the **Agent details** section, enter these values:

    | Property | Value |
    |---|---|
    | **Agent name** | Enter a name for your agent. |
    | **Region** | Select **East US 2**. |

1. Select **Choose resource groups**.

1. On the **Choose resource groups to monitor** pane, search for the resource group that you want to monitor.

    > [!NOTE]
    > Avoid selecting the resource group link.

    In the resource group picker, a check mark (:::image type="icon" source="media/blue-check.png" border="false":::) next to the group name indicates that the group includes services with specialized support.

    To select a resource group, select the checkbox next to it.

1. Scroll to the bottom of the pane and select **Save**.

1. Select **Create**.

    After you begin the creation process, a **Deployment is in progress** message appears.

## Chat with your agent

Your agent has access to any resource inside the resource group that's associated with the agent. Use the chat feature to inquire about and resolve problems related to your resources:

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. Locate your agent in the list and select it.

When the chat window appears, you can begin asking your agent questions. Here's a series of questions that can help you get started:

* What can you help me with?
* What subscriptions/resource groups/resources are you managing?
* What alerts should I set up for `<RESOURCE_NAME>`?
* Show me a visualization of `2xx` requests versus HTTP errors for my web apps across all subscriptions.

If you have a specific problem in mind, you might ask questions like:

* Why is `<RESOURCE_NAME>` slow?
* Why is `<RESOURCE_NAME>` not working?
* Can you investigate `<RESOURCE_NAME>`?
* Can you get me the `<METRIC>` of `<RESOURCE_NAME>`?

## Update managed resource groups

You can change the list of resource groups that your agent manages at any time. To change it, go to your agent in the Azure portal, select the **Settings** tab, and then select **Managed resource groups**.

> [!NOTE]
> Removing resource groups from the list does not remove or adversely affect resource groups.

## Manage incidents

You can diagnose incidents your Azure services by setting up an incident response plan.

SRE Agent connects to Azure Monitor alerts by default, but you can also use the following steps to connect it to PagerDuty. To set up SRE Agent with PagerDuty, you need a PagerDuty API key.

1. In your SRE Agent resource, select the **Incident management** tab.

1. Select **Incident platform**

1. In the *Incident platform* dropdown list, select **PagerDuty**.

1. Enter your API key.

1. Select **Save**.

## Related content

* [Azure SRE Agent overview](./overview.md)
