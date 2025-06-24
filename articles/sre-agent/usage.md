---
title: Create and use an Azure SRE Agent (preview)
description: Learn to use an automated agent to resolve problems and keep your apps running in Azure.
author: craigshoemaker
ms.topic: how-to
ms.date: 06/17/2025
ms.author: cshoe
ms.service: azure
---

# Create and use an Azure SRE Agent (preview)

An Azure SRE Agent helps you maintain the health and performance of your Azure resources through AI-powered monitoring and assistance. Agents continuously watch your resources for issues, provide troubleshooting help, and suggest remediation steps available through a natural language chat interface. To ensure accuracy and control, any agent action taken on your behalf requires your approval.

This article demonstrates how to  create an SRE Agent, connect it to your resources to maintain optimal application performance.

## Run modes

Azure SRE Agent operates in one of three different modes. Your agent behaves differently, depending on the mode type you select.

The three different types of modes are:

* **Read-only**: The read-only mode puts your agent in an observation mode. The agent has access to your inspect and report on your apps and can advise you on what actions to take. In this mode, the agent only has *reader* access to most services. In limited instances, the agent is granted *contributor* access to services solely to access configuration data.

* **Review**: As the agent operates in review mode, the agent can make changes to your apps and services on your behalf, but doesn't take action unless you give express approval. In this mode, the agent has  *reader* or *contributor* access to services.

* **Autonomous**: Autonomous mode gives the agent full ability to work on your behalf without the need to request approval to proceed. In this mode, the agent has *reader* or *contributor* access to services.

## Create an agent

Create an agent by associating resource groups you want to monitor to the agent.

### Prerequisites

You need to grant your agent the correct permissions and access to the right namespace.

* **Security context**: Before you can create a new agent, make sure your user account has the `Microsoft.Authorization/roleAssignments/write` permissions using either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Associate your allow list subscription ID**: Make sure your Azure CLI session is set to 
the subscription ID on the preview allow list. If you need to set the CLI context to your 
subscription ID, use the following command:

    ```azurecli  
    az account set --subscription "<SUBSCRIPTION_ID>"
    ```

* **Namespace**: Using the cloud shell in the Azure portal, run the following command:

    ```azurecli  
    az provider register --namespace "Microsoft.App"
    ```

### Create

To create an SRE Agent, follow these steps:

1. Follow the link provided in your onboarding email to access the Azure SRE Agent portal window.

1. Select **Create**.

1. Enter the following values in the *Create agent* window:

    During this step, you create a new resource group specifically for your agent which is independent of the resource group used for your application.

    In the *Project details* section, enter the following values:

    | Property | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select an existing resource group or to create a new one, enter a name. |

    In the *Agent details* section, enter the following values:

    | Property | Value |
    |---|---|
    | Agent name | Enter a name for your agent. |
    | Region | Select **Sweden Central**.<br><br>During preview, Azure SRE Agent is only available in the *Sweden Central* region, but the agent can monitor resources in any Azure region. |
    | Run mode| Select **Review**.<br><br>When in *review mode*, the agent works on your behalf only with your approval. |

1. Select **Choose resource groups**.

1. In the *Choose resource groups to monitor* window, search for the resource group you want to monitor.

    **Avoid selecting the resource group link.**

    To select a resource group, select the checkbox next to the resource group.

1. Scroll to the bottom of the dialog window and select **Save**.

1. Select **Create**.

    Once you begin the create process, a page with the message *Deployment is in progress* is displayed.

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

## Update managed resource groups

You can change the list of resource groups managed by your agent at any time. To change the list is of managed groups, go to your agent in the Azure portal and select the **Settings** tab and then **Managed resource groups**.

> [!NOTE]
> Removing resource groups from the list does not remove or otherwise adversely affect resource groups.

## Incident management

You can diagnose incidents in Azure App Service, Azure Container Apps, Azure Function, Azure Kubernetes Service and Azure Database for PostgreSQL by chatting with the agent directly or by connecting an incident management platform.

By default SRE Agent connects to Azure Monitor, but you can also connect it to PagerDuty.

### PagerDuty integration

To set up SRE Agent with PagerDuty, you need a PagerDuty API key.  

1. In your SRE Agent resource, go to the *Settings* tab and select **Incident Management**.

1. From the *Incident platform* dropdown, select **PagerDuty**.

1. Enter your API key.

1. Select **Save**.

## Related content

* [Azure SRE Agent overview](./overview.md)
