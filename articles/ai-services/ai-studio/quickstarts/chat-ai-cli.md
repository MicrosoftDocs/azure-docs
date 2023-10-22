---
title: Chat with your data via the Azure AI CLI
titleSuffix: Azure OpenAI
description: Use this article to chat with your data via the Azure AI CLI.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 10/1/2023
ms.author: eur
---

# Quickstart: Chat with your data via the Azure AI CLI

, you can use your own data with Azure OpenAI models. Using Azure OpenAI's models on your data can provide you with a powerful conversational AI platform that enables faster and more accurate communication.


## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.


## AI init

The `ai init` command allows interactive and non-interactive selection or creation of Azure AI resources. When an AI resource is selected or created using this command, the associated resource keys and region are retrieved and automatically stored in the local AI configuration datastore.

You can initialize the Azure AI CLI by running the following command:

```bash
ai init
```

Follow the prompts to: 
- Select or create an Azure subscription
- Select or create an Azure AI resource
- Select or create a resource group
- Select a model
- Select or create a deployment


## AI chat

Once you have initialized resources and have a deployment, you can chat interactively or non-interactively with the AI language model using the `ai chat` command.

# [Terminal](#tab/terminal)

Here's an example of interactive chat:

```bash
ai chat --interactive --system @prompt.txt
```

Here's an example of non-interactive chat:

```bash
ai chat --system @prompt.txt --user "Tell me about Azure AI Studio"
```


# [PowerShell](#tab/powershell)

Here's an example of interactive chat:

```powershell
ai --% chat --interactive --system @prompt.txt
```

Here's an example of non-interactive chat:

```powershell
ai --% chat --system @prompt.txt --user "Tell me about Azure AI Studio"
```

> [!NOTE]
> If you're using PowerShell, use the `--%` stop-parsing token to prevent the terminal from interpreting the `@` symbol as a special character. 

---


## Remarks

You can interactively browse and explore the Azure AI CLI commands and options by running the following command:

```bash
ai help
```

## Next steps

- [Quickstart: Generate product name ideas in the Azure AI Studio playground](../quickstarts/playground-completions.md)

