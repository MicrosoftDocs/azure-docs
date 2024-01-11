---
title: Work with Azure AI projects in VS Code
titleSuffix: Azure AI Studio
description: This article provides instructions on how to get started with Azure AI projects in VS Code.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 1/10/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Get started with Azure AI projects in VS Code

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Azure AI Studio supports developing in VS Code - Web and Desktop. In each scenario, your VS Code instance is remotely connected to a prebuilt custom container running on a virtual machine, also known as a compute instance. To work in your local environment instead, or to learn more, follow the steps in [Install the Azure AI SDK](sdk-install.md) and [Install the Azure AI CLI](cli-install.md).

## Launch VS Code from Azure AI Studio

1. Go to [Azure AI Studio](https://ai.azure.com).

1. Go to **Build** > **Projects** and select or create the project you want to work with.

1. At the top-right of any page in the **Build** tab, select **Open project in VS Code (Web)** if you want to work in the browser. If you want to work in your local VS Code instance instead, select the dropdown arrow and choose **Open project in VS Code (Desktop)**.

1. Within the dialog that opened following the previous step, select or create the compute instance that you want to use.

1. Once the compute is running, select **Set up** which configures the container on your compute for you. The compute setup might take a few minutes to complete. Once you set up the compute the first time, you can directly launch subsequent times. You might need to authenticate your compute when prompted.

    > [!WARNING]
    > Even if you [enable and configure idle shutdown on your compute instance](./create-manage-compute.md#configure-idle-shutdown), any computes that host this custom container for VS Code won't idle shutdown. This is to ensure the compute doesn't shut down unexpectedly while you're working within a container. We are working to improve this experience. Scheduled startup and shutdown of the compute should still work as expected.

1. Once the container is ready, select **Launch**. This launches your previously selected VS Code experience, remotely connected to a custom development environment running on your compute instance.
    1. If you selected VS Code (Web), a new browser tab connected to *vscode.dev* opens. If you selected VS Code (Desktop), a new local instance of VS Code opens on your local machine.

## The custom container folder structure

Our prebuilt development environments are based on a docker container that has the Azure AI SDK generative packages, the Azure AI CLI, the Prompt flow SDK, and other tools. The environment is configured to run VS Code remotely inside of the container. The container is defined in a similar way to [this Dockerfile](https://github.com/Azure/aistudio-copilot-sample/blob/main/.devcontainer/Dockerfile), and is based on [Microsoft's Python 3.10 Development Container Image](https://mcr.microsoft.com/product/devcontainers/python/about). 

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

### The Azure AI SDK

To get started with the AI SDK, we recommend the [aistudio-copilot-sample repo](https://github.com/azure/aistudio-copilot-sample) as a comprehensive starter repository that includes a few different copilot implementations. For the full list of samples, check out the [Azure AI Samples repository](https://github.com/azure-samples/azureai-samples).

1. Open a terminal
1. Clone a sample repo into your project's `code` folder. You might be prompted to authenticate to GitHub

    ```bash
    cd code
    git clone https://github.com/azure/aistudio-copilot-sample
    ```

1. If you have existing notebooks or code files, you can import `import azure.ai.generative` and use intellisense to browse capabilities included in that package

### The Azure AI CLI

If you prefer to work interactively, the Azure AI CLI has everything you need to build generative AI solutions.

1. Open a terminal to get started
1. `ai help` guides you through CLI capabilities
1. `ai init` configures your resources in your development environment

### Working with prompt flows

You can use the Azure AI SDK and Azure AI CLI to create, reference and work with prompt flows.

Prompt flows already created in the Azure AI Studio can be found at `shared\Users\{user-name}\promptflow`. You can also create new flows in your `code` or `shared` folder using the Azure AI CLI and SDK.

- To reference an existing flow using the AI CLI, use `ai flow invoke`.
- To create a new flow using the AI CLI, use `ai flow new`.

Prompt flow will automatically use the Azure AI connections your project has access to when you use the AI CLI or SDK.

You can also work with the prompt flow extension in VS Code, which is preinstalled in this environment. Within this extension, you can set the connection provider to your Azure AI project. See [consume connections from Azure AI](https://microsoft.github.io/promptflow/cloud/azureai/consume-connections-from-azure-ai.html).

For prompt flow specific capabilities that aren't present in the AI SDK and CLI, you can work directly with the prompt flow CLI or SDK. For more information, see [prompt flow capabilities](https://microsoft.github.io/promptflow/reference/index.html).

## Remarks

If you plan to work across multiple code and data directories, or multiple repositories, you can use the split root file explorer feature in VS Code. To try this feature, follow these steps:

1. Enter *Ctrl+Shift+p* to open the command palette. Search for and select **Workspaces: Add Folder to Workspace**.
1. Select the repository folder that you want to load. You should see a new section in your file explorer for the folder you opened. If it was a repository, you can now work with source control in VS Code.
1. If you want to save this configuration for future development sessions, again enter *Ctrl+Shift+p* and select **Workspaces: Save Workspace As**. This action saves a config file to your current folder.

For cross-language compatibility and seamless integration of Azure AI capabilities, explore the Azure AI Hub at [https://aka.ms/azai](https://aka.ms/azai). Discover app templates and SDK samples in your preferred programming language.

## Next steps

- [Get started with the Azure AI CLI](cli-install.md)
- [Quickstart: Generate product name ideas in the Azure AI Studio playground](../quickstarts/playground-completions.md)