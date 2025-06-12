---
title: Create and use an Azure SRE Agent (preview)
description: Learn to use an automated agent to resolve problems and keep your apps running in Azure.
author: craigshoemaker
ms.topic: how-to
ms.date: 06/12/2025
ms.author: cshoe
ms.service: azure
---

# Create and use an Azure SRE Agent (preview)

An Azure SRE Agent helps you maintain the health and performance of your Azure resources through AI-powered monitoring and assistance. Agents continuously watch your resources for issues, provide troubleshooting help, and suggest remediation steps available through a natural language chat interface. To ensure accuracy and control, any agent action taken on your behalf requires your approval.

This article demonstrates how to  create an SRE Agent, connect it to your resources to maintain optimal application performance.

## Create an agent

Create an agent by pointing it to the resource groups you want to monitor.

### Prerequisites

You need to grant your agent permissions so that it can access the Azure resources.

Before you can create a new agent, make sure your user account has correct permissions. Your account needs `Microsoft.Authorization/roleAssignments/write` permissions using either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

### Create

To create an SRE Agent, follow these steps:

1. Go to the Azure portal and search for and select **SRE Agent**.

1. Select **Create**.

1. Enter the following values in the *Create agent* window:

    | Property | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select an existing resource group or to create a new one, enter a name.  |
    | Name | Enter a name for your agent. |
    | Region | Select **Sweden Central**.<br><br>During preview, SRE Agents are only available in the *Sweden Central* region, but they can monitor resources in any Azure region.|
    | Choose role | Select **Contributor role**. |

1. Select the **Select resource groups** button.

1. In the *Select resource groups to monitor* window, search for the resource group you want to monitor.

    Avoid selecting the resource group name link. To select a resource group, check the checkbox next to the resource group.

1. Scroll to the bottom of the dialog window and select **Save**.

1. Select **Create**.

## Chat with your agent

Your agent has access to any resource inside the resource group associated with the agent. Use the chat feature to help you inquire about and resolve issues related to your resources.

1. Go to the Azure portal, search for and select **Azure SRE Agent**.

1. Locate your agent in the list and select the agent name.

Once the chat window loads, you can begin asking your agent questions. Here's a series of questions that can help you get started:

- What can you help me with?
- What subscriptions/resource groups/resources are you managing?
- What alerts should I set up for `<RESOURCE_NAME>`?
- Show me visualization of `2xx` requests vs HTTP errors for my web apps across all subscriptions

If you have a specific problem in mind, you could ask questions like:

- Why is `<RESOURCE_NAME>` slow?
- Why is `<RESOURCE_NAME>` not working?
- Can you investigate `<RESOURCE_NAME>`?
- Can you get me the `<METRIC>` of `<RESOURCE_NAME>`?

## Related content

- [Azure SRE Agent overview](./overview.md)
