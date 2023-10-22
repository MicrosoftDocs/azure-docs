---
title: How to install the Azure AI CLI
titleSuffix: Azure AI services
description: This article provides instructions on how to install the Azure AI CLI.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to install the Azure AI CLI

The Azure AI command-line interface (CLI) is a cross-platform command-line tool to connect to Azure AI services and execute control-plane and data-plane operations without having to write any code. The Azure AI CLI allows the execution of commands through a terminal using interactive command-line prompts or via script. 

You can easily use the Azure AI CLI to experiment with key Azure AI service features and see how they work with your use cases. Within minutes, you can set up all the required Azure resources needed, and build a customized Copilot using OpenAI's chat completions APIs and your own data. You can try it out interactively, or script larger processes to automate your own workflows and evaluations as part of your CI/CD system.

In the future, you can use the Azure AI CLI to dynamically create code in the programming language of your choice to integrate with your own applications.

## Prerequisites

To use the Azure AI CLI, you need to install the prerequisites: 
 * The Azure AI SDK, following the instructions [here](./sdk-install.md)
 * The Azure CLI (not the Azure `AI` CLI), following the instructions [here](/cli/azure/install-azure-cli)
 * The .NET SDK, following the instructions [here](/dotnet/core/install/) for your operating system and distro

## Install the CLI

The following set of commands are provided for a few popular operating systems.

# [Windows](#tab/windows)

To install the .NET SDK, Azure CLI, and Azure AI CLI, run the following commands in a PowerShell terminal. Skip any that you don't need. 

```pwsh
winget install Microsoft.AzureCLI
winget install Microsoft.DotNet.SDK.7
Start-BitsTransfer -Source https://csspeechstorage.blob.core.windows.net/drop/private/ai/Azure.AI.CLI.1.0.0-alpha1018.1.nupkg
dotnet tool install --global --add-source . Azure.AI.CLI --version 1.0.0-alpha1018.1
Remove-Item Azure.AI.CLI.1.0.0-alpha1018.1.nupkg
```

# [Linux](#tab/linux)

On Debian and Ubuntu, run:

```
curl -sL https://aka.ms/InstallAzureAICLIDeb | bash
```

# [macOS](#tab/macos)

On macOS, you can use *homebrew* and *wget*. For example, run the following commands in a terminal:

```bash
brew install azure-cli
brew install dotnet
curl -O https://csspeechstorage.blob.core.windows.net/drop/private/ai/Azure.AI.CLI.1.0.0-alpha1018.1.nupkg
dotnet tool install --global --add-source . Azure.AI.CLI --version 1.0.0-alpha1018.1
rm Azure.AI.CLI.1.0.0-alpha1018.1.nupkg
```

---

## Try the Azure AI CLI

Now that you have the Azure AI CLI installed, you can try the following quickstart:

> [!div class="nextstepaction"]
> [Quickstart: Chat with your data via the Azure AI CLI](../quickstarts/chat-ai-cli.md)

## Run the Azure AI CLI without installing it

You can install the Azure AI CLI locally as described previously, or run it via an internet browser or Docker container. 

Start with a containerized development environment. Our prebuilt development environments are based on a docker container that has the Azure AI SDK generative packages, the Azure AI CLI, the Prompt flow SDK, and other tools. It's configured to run VS Code remotely inside of the container. The docker container is defined in [this Dockerfile](https://github.com/Azure/aistudio-copilot-sample/blob/main/.devcontainer/Dockerfile), and is based on [Microsoft's Python 3.10 Development Container Image](https://mcr.microsoft.com/en-us/product/devcontainers/python/about). 

### OPTION 1: GitHub Codespaces

During this public preview, we recommend using the Azure AI SDK through GitHub Codespaces. This option helps you quickly get started without having to install anything locally.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure/aistudio-copilot-sample?quickstart=1)


### OPTION 2: Visual Studio Code Dev Container

You can run the Azure AI CLI in a Docker container using VS Code Dev Containers:

1. Follow the [installation instructions](https://code.visualstudio.com/docs/devcontainers/containers#_installation) for VS Code Dev Containers.
1. Clone the [aistudio-copilot-sample](https://github.com/Azure/aistudio-copilot-sample) repository and open it with VS Code:
    ```
    git clone https://github.com/azure/aistudio-copilot-sample
    code aistudio-copilot-sample
    ```
1. Select the **Reopen in Dev Containers** button. If it doesn't appear, open the command palette (`Ctrl+Shift+P` on Windows and Linux, `Cmd+Shift+P` on Mac) and run the `Dev Containers: Reopen in Container` command.

### Option 3: Using VS Code (web) in Azure AI Studio

VS Code (web) in Azure AI Studio creates and runs the development container on a compute instance. To get started with this approach, follow the instructions in [How to work with Azure AI Studio projects in VS Code (Web)](vscode-web.md).


## Next steps

- [Quickstart: Chat with your data via the Azure AI CLI](../quickstarts/chat-ai-cli.md)












