---
title: GitHub Copilot with VS Code extension to discover APIs
description: Discover APIs and API definitions from your Azure API center using GitHub Copilot Chat and the Azure API Center extension for Visual Studio Code (preview)
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 04/23/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As a developer, I want to use GitHub Copilot Chat in my Visual Studio Code environment to discover and consume APIs in my organization's API centers.
---

# Discover APIs with GitHub Copilot Chat and Azure API Center extension for Visual Studio Code (preview)

To discover APIs and API definitions in your Azure [API center](overview.md), you can use a GitHub Copilot Chat agent with the [Azure API Center extension](use-vscode-extension.md) for Visual Studio Code. The `@apicenter` chat agent and other Azure API Center extension capabilities help developers discover, try, and consume APIs from their API centers.

GitHub Copilot Chat provides a conversational interface for accomplishing developer tasks in Visual Studio Code. It uses GitHub Copilot to provide code completions and suggestions based on the context of your conversation. For more information, see [Getting started with GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/getting-started-with-github-copilot).


> [!NOTE]
> The Azure API Center extension for Visual Studio Code and the `@apicenter` chat agent are in preview. Currently this feature is only available in the Visual Studio Code insiders build.

## Prerequisites

* One or more API centers in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

    Currently, you need to be assigned the Contributor role or higher permissions to the API centers to access API centers with the Azure API Center extension.

* An active [GitHub Copilot subscription](https://docs.github.com/billing/managing-billing-for-github-copilot/about-billing-for-github-copilot)
* [Visual Studio Code - Insiders](https://apps.microsoft.com/detail/XP8LFCZM790F6B) (version after 2024-01-19)
* [Azure API Center extension](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)
* [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
* [GitHub Copilot Chat extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) 

## Setup

1. Install the Azure API Center extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center) in the Visual Studio Code insiders build. 
1. Install the GitHub Copilot extension and GitHub Copilot Chat extension.
1. In Visual Studio Code, in the Activity Bar on the left, select API Center.
1. If you're not signed in to your Azure account, select **Sign in to Azure...**, and follow the prompts to sign in. 
    Select an Azure account with the API center (or API centers) you wish to view APIs from. You can also filter on specific subscriptions if you have many to view from.

## Explore your API centers

Your API center resources appear in the tree view on the left-hand side. Expand an API center resource to see APIs, versions, definitions, environments, and deployments.

:::image type="content" source="media/use-vscode-extension/explore-api-centers.png" alt-text="Screenshot of Azure API Center tree view in Visual Studio Code.":::

> [!NOTE]
> Currently, all APIs and other entities shown in the tree view are read-only. You can't create, update, or delete entities in an API center from the extension.

## Search for APIs using GitHub Copilot Chat

Use GitHub Copilot Chat to search for APIs and API definitions based on semantic search queries. 

1. In Visual Studio Code, in the Activity Bar, select GitHub Copilot Chat.
1. Type `@apicenter /` to see available commands:

    * `@apicenter /list` - Lists available APIs
    * `@apicenter /search` - Searches APIs and API specifications
1. Search for APIs in Copilot Chat. For example, enter `@apicenter /search weather` to find APIs related to weather.

## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Get started with the Azure API Center extension for Visual Studio Code](use-vscode-extension.md)
* [Getting started with GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/getting-started-with-github-copilot)
