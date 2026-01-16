---
title: Configuring agents in Agent framework with Azure App Configuration
description: Learn how to configure agents in Agent framework with Azure App Configuration
author: MaryanneNjeri
ms.author: mgichohi
ms.topic: how-to
ms.service: azure-app-configuration
ms.date: 11/25/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
---

# Configuring agents in Agent framework with Azure App Configuration

Agents are software systems that autonomously perform tasks using Large Language Models (LLMs) to process user input and execute actions on behalf of users. Agent framework provides tools and structures to build, orchestrate, and manage AI agents. Configuring agents within this framework involves defining their instructions and toolsets through either code-based or declarative methods. Azure App Configuration serves as a centralized store for these agent configurations, keeping them in one place where they can be easily managed and shared across multiple application instances.

Here are some agent settings that can be stored on Azure App Configuration:

 - Instructions
 - Endpoint
 - Agent name
 - Model parameters - temperature, top_p, max_tokens, frequency_penalty, presence_penalty, response_format and stop sequences.
 - Tools

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free).
- An App Configuration store, as shown in the [tutorial for creating a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).


## Example agent settings
1. Follow the [Microsoft Foundry Quickstart](/azure/ai-foundry/quickstarts/get-started-code) to create a project in Foundry with a deployed gpt-4.1 model. Note down the Azure AI project endpoint for later use.

1. Navigate to your App Configuration store and add the following key-values. Leave **Label** with its default value. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

    | Key                            | Value                                                               | Content type                                 |
    |--------------------------------|---------------------------------------------------------------------|----------------------------------------------|
    | *ChatAgent:ProjectEndpoint*    | *Paste the Azure AI project endpoint*                               |                                              |
    | *ChatAgent:Spec*               | *See YAML*                                                    |                                              |


    **Value for ChatAgent:Spec**

    ```yaml
    kind: Prompt
    name: ChatAgent
    description: Agent example with web search
    instructions: You are a helpful assistant with access to web search.
    model:
        id: gpt-4.1
        connection:
            kind: remote
    tools:
      - kind: web_search
        name: WebSearchTool
        description: Search the web for live information.
    ```

1. Continue to the following instructions to implement the AI agent configuration into your application for the language or platform you're using.

    - [Python](./howto-ai-agent-config-python.md)