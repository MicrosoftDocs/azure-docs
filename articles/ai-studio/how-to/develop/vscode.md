---
title: Work with Azure AI Studio projects in VS Code
titleSuffix: Azure AI Studio
description: This article provides instructions on how to get started with Azure AI Studio projects in VS Code.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: lebaro
ms.author: sgilley
author: sdgilley
# customer intent: As a Developer, I want to use Azure AI Studio projects in VS Code.
---

# Get started with Azure AI Studio projects in VS Code (Preview)

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

Azure AI Studio supports developing in VS Code - Desktop and Web. In each scenario, your VS Code instance is remotely connected to a prebuilt custom container running on a virtual machine, also known as a compute instance.

## Launch VS Code from Azure AI Studio 

1. Go to [Azure AI Studio](https://ai.azure.com).
1. Open your project in Azure AI Studio.
1. On the left menu, select **Code**.
1. For **Compute**, select an existing compute instance or create a new one.
    * Select a compute instance to use. If it's stopped, select **Start compute** and wait for it to switch to **Running**. You'll see a **Ready** status when the compute is ready for use.
    * If you don't have a compute instance, enter a name and select **Create compute**. Wait until the compute instance is ready.
1. For **VS Code container**, select **Set up container** once the button enables. This configures the container on the compute for you. The container setup might take a few minutes to complete. Once you set up the container for the first time, you can directly launch subsequent times. You might need to authenticate your compute when prompted. When setup is complete, you'll see **Ready**.

    > [!WARNING]
     > Even if you [enable idle shutdown on your compute instance](../create-manage-compute.md#configure-idle-shutdown), idle shutdown will not occur for any compute that is set up with this custom VS Code container. This is to ensure the compute doesn't shut down unexpectedly while you're working within a container.

1. Open the project in VS Code:

    * If you want to work in your local VS Code instance, choose **Open project in VS Code (Desktop)**. A new local instance of VS Code opens on your local machine.
    * If you want to work in the browser instead, select the dropdown arrow and choose **Open project in VS Code (Web)**. A new browser tab connected to *vscode.dev* opens.

    :::image type="content" source="../../media/how-to/vs-code/launch-vs-code.png" alt-text="Screenshot shows Work in VS Code page ready to launch." lightbox="../../media/how-to/vs-code/launch-vs-code.png":::

## The custom container folder structure

Our prebuilt development environments are based on a docker container that has Azure AI SDKs, the prompt flow SDK, and other tools. The environment is configured to run VS Code remotely inside of the container. The container is defined in a similar way to [this Dockerfile](https://github.com/Azure-Samples/aistudio-python-quickstart-sample/blob/main/.devcontainer/Dockerfile), and is based on [Microsoft's Python 3.10 Development Container Image](https://mcr.microsoft.com/product/devcontainers/python/about).

Your file explorer is opened to the specific project directory you launched from in AI Studio. 

The container is configured with the Azure AI folder hierarchy (`afh` directory), which is designed to orient you within your current development context, and help you work with your code, data, and shared files most efficiently. This `afh` directory houses your Azure AI Studio projects, and each project has a dedicated project directory that includes `code`, `data`, and `shared` folders. 

This table summarizes the folder structure:

| Folder | Description |
| --- | --- |
| `code` | Use for working with git repositories or local code files.<br/><br/>The `code` folder is a storage location directly on your compute instance and performant for large repositories. It's an ideal location to clone your git repositories, or otherwise bring in or create your code files. |
| `data` | Use for storing local data files. We recommend you use the `data` folder to store and reference local data in a consistent way.|
| `shared` | Use for working with a project's shared files and assets such as prompt flows.<br/><br/>For example, `shared\Users\{user-name}\promptflow` is where you find the project's prompt flows. |

> [!IMPORTANT]
> It's recommended that you work within this project directory. Files, folders, and repos you include in your project directory persist on your host machine (your compute instance). Files stored in the code and data folders will persist even when the compute instance is stopped or restarted, but will be lost if the compute is deleted. However, the shared files are saved in your hub's storage account, and therefore aren't lost if the compute instance is deleted.

## Working with prompt flows

You can create, reference, and work with prompt flows.

Prompt flows already created in the Azure AI Studio can be found at `shared\Users\{user-name}\promptflow`. You can also create new flows in your `code` or `shared` folder.

Prompt flow automatically uses the Azure AI Studio connections your project has access to.

You can also work with the prompt flow extension in VS Code, which is preinstalled in this environment. Within this extension, you can set the connection provider to your project. See [consume connections from Azure AI](https://microsoft.github.io/promptflow/cloud/azureai/consume-connections-from-azure-ai.html).

For more information, see [prompt flow capabilities](https://microsoft.github.io/promptflow/reference/index.html).

## Use AI app templates
 
AI app templates are linked from the right side of the **Code** tab of your project. These samples walk you through how to use the Azure AI SDKs to:

* Set up your development environment and connect to existing resources
* Bring in your custom application code
* Run evaluations
* Deploy your code

To provision an entirely new set of resources, including a new hub and project, and deploy these sample applications, you can use the [Azure Developer CLI](/azure/developer/azure-developer-cli/) (AZD) in your local development environment. 

## Remarks

If you plan to work across multiple code and data directories, or multiple repositories, you can use the split root file explorer feature in VS Code. To try this feature, follow these steps:

1. Enter *Ctrl+Shift+p* to open the command palette. Search for and select **Workspaces: Add Folder to Workspace**.
1. Select the repository folder that you want to load. You should see a new section in your file explorer for the folder you opened. If it was a repository, you can now work with source control in VS Code.
1. If you want to save this configuration for future development sessions, again enter *Ctrl+Shift+p* and select **Workspaces: Save Workspace As**. This action saves a config file to your current folder.

For app templates and SDK samples in your preferred programming language, see [Develop apps that use Azure AI services](/azure/developer/intro/azure-ai-for-developers).

## Related content

- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Get started with Azure AI SDKs](sdk-overview.md)
