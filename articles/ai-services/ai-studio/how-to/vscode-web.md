---
title: How to work with Azure AI Studio projects in VS Code (Web)
titleSuffix: Azure AI services
description: This article provides instructions on how to work with Azure AI Studio projects in VS Code (Web).
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to work with Azure AI Studio projects in VS Code (Web)

Azure AI Studio supports developing in VS Code for the Web. In this scenario, VS Code is remotely connected to a prebuilt custom container running on a virtual machine, also known as a compute instance. To work in your local environment instead, or to learn more, follow the steps in [Install the Azure AI SDK](sdk-install.md) and [Install the Azure AI CLI](cli-install.md).

## Launch VS Code (Web) from Azure AI Studio

1. Go to the AI Studio homepage at [aka.ms/AzureAIStudio](https://aka.ms/AzureAIStudio)

1. Got to **Build** > **Projects** and select or create the project you want to work with.

1. At the top-right of any page in the **Build** tab, select **Open project in VS Code (Web)**

1. Select or create the compute instance that you want to use. 

1. Once the compute is running, select **Set up** which configures the container on your compute for you. The compute setup might take a few minutes to complete. Once you set up the compute the first time, you can directly launch subsequent times. You might need follow steps to authenticate your compute when prompted.

    > [!WARNING]
    > Even if you enable and configure idle shutdown on your compute instance, any computes that host this custom container for VS Code (Web) won't idle shutdown. This is to ensure the compute doesn't shut down unexpectedly while you're working within a container. We are working to improve this experience. Scheduled startup and shutdown should still work as expected.

1. Once the container is ready, select **Launch**. A new browser tab opens and VS Code (Web) connects to *vscode.dev*. 


## The custom container folder structure

Our prebuilt development environments are based on a docker container that has the Azure AI SDK generative packages, the Azure AI CLI, the Prompt flow SDK, and other tools. It's configured to run VS Code remotely inside of the container. The container is defined in a similar way to [this Dockerfile](https://github.com/Azure/aistudio-copilot-sample/blob/main/.devcontainer/Dockerfile), and is based on [Microsoft's Python 3.10 Development Container Image](https://mcr.microsoft.com/en-us/product/devcontainers/python/about). 

Your file explorer is opened to the specific project directory you launched from in AI Studio. 

The container is configured with the Azure AI folder hierarchy (`afh` directory), which is designed to orient you within your current development context, and help you work with your code, data and shared files most efficiently. This `afh` directory houses your Azure AI projects, and each project has a dedicated project directory that includes `code`, `data` and `shared` folders. 

This table summarizes the folder structure:

| Folder | Description |
| --- | --- |
| `code` | Use for working with git repositories or local code files.<br/><br/>The `code` folder is a storage location directly on your compute instance and performant for large repositories. It's an ideal location to clone your git repositories, or otherwise bring in or create your code files. |
| `data` | Use for storing local data files. We recommend you use the `data` folder to store and reference local data in a consistent way.|
| `shared` | Use for working with a project's shared files and assets such as prompt flows.<br/><br/>For example, `shared\Users\{user-name}\promptflow` is where you find the project's prompt flows. |

> [!IMPORTANT]
> It's recommended that you work within this project directory. Files, folders, and repos you include in your project directory persist on your host machine (your compute instance). Files stored in the code and data folders will persist even when the compute instance is stopped or restarted, but will be lost if the compute is deleted. However, the shared files are saved in your Azure AI resource's storage account, and therefore aren't lost if the compute instance is deleted.

## Get started with the Azure AI Generative SDK

To get started with the [Azure AI Generative SDK](./sdk-install.md), try out an example notebook from the [aistudio-copilot-sample](https://github.com/Azure/aistudio-copilot-sample) repository.

1. Open a terminal
1. Clone the [aistudio-copilot-sample](https://github.com/Azure/aistudio-copilot-sample) repository into your project's `code` folder. You might be prompted to authenticate.

    ```bash
    cd code
    git clone https://github.com/azure/aistudio-copilot-sample
    ```

1. To work with LangChain, open the sample notebook (that you cloned from [/aistudio-copilot-sample/src/langchain/langchain_qna.ipynb](https://github.com/Azure/aistudio-copilot-sample/blob/main/src/langchain/langchain_qna.ipynb)) at `/code/aistudio-copilot-sample/src/langchain/langchain_qna.ipynb` and run through the notebook cells.

## Get started with the Azure AI CLI

If you prefer to work interactively, pen a terminal to get started with the Azure AI CLI.
1. The `ai help` command guides you through Azure AI CLI capabilities.
1. The `ai init` command guides you to configure your resources in your development environment.

## Remarks

For prompt flow specific capabilities that aren't present in the Azure AI SDK and CLI, you can work directly with the Prompt flow CLI, SDK, or VS Code extension (that are all preinstalled in the VS Code (Web) environment). For more information about prompt flow, see [prompt flow reference](https://microsoft.github.io/promptflow/reference/index.html).

If you plan to work across multiple code and data directories, or multiple repositories, you can use the split root file explorer feature in VS Code. To try this feature, follow these steps:
1. Enter *Ctrl+Shift+p* to open the command palette. Search for and select **Workspaces: Add Folder to Workspace**.
1. Select the repository folder that you want to load. You should see a new section in your file explorer for the folder you opened. If it was a repository, you can now work with source control in VS Code.
1. If you want to save this configuration for future development sessions, again enter *Ctrl+Shift+p* and select **Workspaces: Save Workspace As**. This action saves a config file to your current folder.
    
For cross-language compatibility and seamless integration of Azure AI capabilities, explore the Azure AI Hub at [https://aka.ms/azai](https://aka.ms/azai). Discover app templates and SDK samples in your preferred programming language.

## Next steps

- [Get started with the Azure AI CLI](cli-install.md)
- [Quickstart: Generate product name ideas in the Azure AI Studio playground](../quickstarts/playground-completions.md)
