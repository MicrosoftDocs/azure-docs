---
title: Get started with the Azure AI CLI
titleSuffix: Azure AI Studio
description: This article provides instructions on how to install and get started with the Azure AI CLI.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# Get started the Azure AI CLI

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

The Azure AI command-line interface (CLI) is a cross-platform command-line tool to connect to Azure AI services and execute control-plane and data-plane operations without having to write any code. The Azure AI CLI allows the execution of commands through a terminal using interactive command-line prompts or via script. 

You can easily use the Azure AI CLI to experiment with key Azure AI service features and see how they work with your use cases. Within minutes, you can set up all the required Azure resources needed, and build a customized Copilot using OpenAI's chat completions APIs and your own data. You can try it out interactively, or script larger processes to automate your own workflows and evaluations as part of your CI/CD system.

## Prerequisites

To use the Azure AI CLI, you need to install the prerequisites: 
 * The Azure AI SDK, following the instructions [here](./sdk-install.md)
 * The Azure CLI (not the Azure `AI` CLI), following the instructions [here](/cli/azure/install-azure-cli)
 * The .NET SDK, following the instructions [here](/dotnet/core/install/) for your operating system and distro

## Install the CLI

The following set of commands are provided for a few popular operating systems.

# [Windows](#tab/windows)

To install the .NET SDK, Azure CLI, and Azure AI CLI, run the following commands in a PowerShell terminal. Skip any that you don't need. 

```bash
dotnet tool install --global Microsoft.Azure.AI.CLI
```

# [Linux](#tab/linux)

On Debian and Ubuntu, run:

```
curl -sL https://aka.ms/InstallAzureAICLIDeb | bash
```

# [macOS](#tab/macos)

On macOS, you can use *homebrew* and *wget*. For example, run the following commands in a terminal:


```bash
dotnet tool install --global Microsoft.Azure.AI.CLI
```

---


## Run the Azure AI CLI without installing it

You can install the Azure AI CLI locally as described previously, or run it via an internet browser or Docker container. 

### Option 1: Using VS Code (web) in Azure AI Studio

VS Code (web) in Azure AI Studio creates and runs the development container on a compute instance. To get started with this approach, follow the instructions in [How to work with Azure AI Studio projects in VS Code (Web)](vscode-web.md).

Our prebuilt development environments are based on a docker container that has the Azure AI SDK generative packages, the Azure AI CLI, the Prompt flow SDK, and other tools. It's configured to run VS Code remotely inside of the container. The docker container is defined in [this Dockerfile](https://github.com/Azure/aistudio-copilot-sample/blob/main/.devcontainer/Dockerfile), and is based on [Microsoft's Python 3.10 Development Container Image](https://mcr.microsoft.com/en-us/product/devcontainers/python/about). 

### OPTION 2: Visual Studio Code Dev Container

You can run the Azure AI CLI in a Docker container using VS Code Dev Containers:

1. Follow the [installation instructions](https://code.visualstudio.com/docs/devcontainers/containers#_installation) for VS Code Dev Containers.
1. Clone the [aistudio-copilot-sample](https://github.com/Azure/aistudio-copilot-sample) repository and open it with VS Code:
    ```
    git clone https://github.com/azure/aistudio-copilot-sample
    code aistudio-copilot-sample
    ```
1. Select the **Reopen in Dev Containers** button. If it doesn't appear, open the command palette (`Ctrl+Shift+P` on Windows and Linux, `Cmd+Shift+P` on Mac) and run the `Dev Containers: Reopen in Container` command.


## Try the Azure AI CLI

### AI init

The `ai init` command allows interactive and non-interactive selection or creation of Azure AI resources. When an AI resource is selected or created using this command, the associated resource keys and region are retrieved and automatically stored in the local AI configuration datastore.

You can initialize the Azure AI CLI by running the following command:

```bash
ai init
```

Follow the prompts to: 
- Select or create an Azure subscription
- Select or create an Azure AI resource or Azure AI project
- Select or create a resource group
- Select a model
- Select or create Azure OpenAI model deployments


### AI chat

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


### AI help

You can interactively browse and explore the Azure AI CLI commands and options by running the following command:

```bash
ai help
```


## Next steps

- [Try the Azure AI CLI from Azure AI Studio in a browser](vscode-web.md)
