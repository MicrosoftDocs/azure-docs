---
title: Get started with the Azure AI CLI
titleSuffix: Azure AI Studio
description: This article provides instructions on how to install and get started with the Azure AI CLI.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# Get started with the Azure AI CLI

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

The Azure AI command-line interface (CLI) is a cross-platform command-line tool to connect to Azure AI services and execute control-plane and data-plane operations without having to write any code. The Azure AI CLI allows the execution of commands through a terminal using interactive command-line prompts or via script. 

You can easily use the Azure AI CLI to experiment with key Azure AI features and see how they work with your use cases. Within minutes, you can set up all the required Azure resources needed, and build a customized copilot using Azure OpenAI chat completions APIs and your own data. You can try it out interactively, or script larger processes to automate your own workflows and evaluations as part of your CI/CD system.

## Prerequisites

To use the Azure AI CLI, you need to install the prerequisites: 
 * The Azure AI SDK, following the instructions [here](./sdk-install.md)
 * The Azure CLI (not the Azure `AI` CLI), following the instructions [here](/cli/azure/install-azure-cli)
 * The .NET SDK, following the instructions [here](/dotnet/core/install/) for your operating system and distro

> [!NOTE]
> If you launched VS Code from the Azure AI Studio, you don't need to install the prerequisites. See options without installing later in this article.

## Install the CLI

The following set of commands are provided for a few popular operating systems.

# [Windows](#tab/windows)

To install the .NET SDK, Azure CLI, and Azure AI CLI, run the following command. 

```bash
dotnet tool install --prerelease --global Azure.AI.CLI
```

To update the Azure AI CLI, run the following command:

```bash
dotnet tool update --prerelease --global Azure.AI.CLI
```

# [Linux](#tab/linux)

To install the .NET SDK, Azure CLI, and Azure AI CLI on Debian and Ubuntu, run the following command:

```
curl -sL https://aka.ms/InstallAzureAICLIDeb | bash
```

Alternatively, you can run the following command:

```bash
dotnet tool install --prerelease --global Azure.AI.CLI
```

To update the Azure AI CLI, run the following command:

```bash
dotnet tool update --prerelease --global Azure.AI.CLI
```

# [macOS](#tab/macos)

To install the .NET SDK, Azure CLI, and Azure AI CLI on macOS 10.14 or later, run the following command:

```bash
dotnet tool install --prerelease --global Azure.AI.CLI
```

To update the Azure AI CLI, run the following command:

```bash
dotnet tool update --prerelease --global Azure.AI.CLI
```

---

## Run the Azure AI CLI without installing it

You can install the Azure AI CLI locally as described previously, or run it using a preconfigured Docker container in VS Code.

### Option 1: Using VS Code (web) in Azure AI Studio

VS Code (web) in Azure AI Studio creates and runs the development container on a compute instance. To get started with this approach, follow the instructions in [How to work with Azure AI Studio projects in VS Code (Web)](vscode-web.md).

Our prebuilt development environments are based on a docker container that has the Azure AI SDK generative packages, the Azure AI CLI, the Prompt flow SDK, and other tools. It's configured to run VS Code remotely inside of the container. The docker container is similar to [this Dockerfile](https://github.com/Azure/aistudio-copilot-sample/blob/main/.devcontainer/Dockerfile), and is based on [Microsoft's Python 3.10 Development Container Image](https://mcr.microsoft.com/en-us/product/devcontainers/python/about). 

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
The AI CLI offers many capabilities, including an interactive chat experience, tools to work with prompt flows and search and speech services, and tools to manage AI services. 

If you plan to use the AI CLI as part of your development, we recommend you start by running `ai init`, which guides you through setting up your AI resources and connections in your development environment.

Try `ai help` to learn more about these capabilities.

### ai init

The `ai init` command allows interactive and non-interactive selection or creation of Azure AI resources. When an AI resource is selected or created, the associated resource keys and region are retrieved and automatically stored in the local AI configuration datastore.

You can initialize the Azure AI CLI by running the following command:

```bash
ai init
```

If you run the Azure AI CLI with VS Code (Web) coming from Azure AI Studio, your development environment will already be configured. The `ai init` command takes fewer steps: you confirm the existing project and attached resources.

If your development environment hasn't already been configured with an existing project, or you select the **Initialize something else** option, there will be a few flows you can choose when running `ai init`: **Initialize a new AI project**, **Initialize an existing AI project**, or **Initialize standalone resources**.

The following table describes the scenarios for each flow.

| Scenario | Description |
| --- | --- |
| Initialize a new AI project | Choose if you don't have an existing AI project that you have been working with in the Azure AI Studio. The `ai init` command walks you through creating or attaching resources. |
| Initialize an existing AI project | Choose if you have an existing AI project you want to work with. The `ai init` command checks your existing linked resources, and ask you to set anything that hasn't been set before. |
| Initialize standalone resources| Choose if you're building a simple solution connected to a single AI service, or if you want to attach more resources to your development environment |

Working with an AI project is recommended when using the Azure AI Studio and/or connecting to multiple AI services. Projects come with an AI Resource that houses related projects and shareable resources like compute and connections to services. Projects also allow you to connect code to cloud resources (storage and model deployments), save evaluation results, and host code behind online endpoints. You're prompted to create and/or attach Azure AI Services to your project.

Initializing standalone resources is recommended when building simple solutions connected to a single AI service. You can also choose to initialize more standalone resources after initializing a project.

The following resources can be initialized standalone, or attached to projects:

- Azure AI services: Includes Azure AI Speech, Azure AI Vision, and Azure OpenAI
- Azure OpenAI: Provides access to OpenAI's powerful language models.
- Azure AI Search: Provides keyword, vector, and hybrid search capabilities.
- Azure AI Speech: Provides speech recognition, synthesis, and translation.

#### Initializing a new AI project

1. Run `ai init` and choose **Initialize new AI project**.
1. Select your subscription. You might be prompted to sign in through an interactive flow.
1. Select your Azure AI Resource, or create a new one. An AI Resource can have multiple projects that can share resources.
1. Select the name of your new project. There are some suggested names, or you can enter a custom one. Once you submit, the project might take a minute to create.
1. Select the resources you want to attach to the project. You can skip resource types you don't want to attach.
1. `ai init` checks you have the connections you need for the attached resources, and your development environment is configured with your new project.

#### Initializing an existing AI project

1. Enter `ai init` and choose "Initialize an existing AI project".
1. Select your subscription. You might be prompted to sign in through an interactive flow.
1. Select the project from the list.
1. Select the resources you want to attach to the project. There should be a default selection based on what is already attached to the project. You can choose to create new resources to attach.
1. `ai init` checks you have the connections you need for the attached resources, and your development environment is configured with the project.

#### Initializing standalone resources

1. Enter `ai init` and choose "Initialize standalone resources".
1. Select the type of resource you want to initialize.
1. Select your subscription. You might be prompted to sign in through an interactive flow.
1. Choose the desired resources from the list(s). You can create new resources to attach inline.
1. `ai init` checks you have the connections you need for the attached resources, and your development environment is configured with attached resources.

## Project connections

When working the Azure AI CLI, you want to use your project's connections. Connections are established to attached resources and allow you to integrate services with your project. You can have project-specific connections, or connections shared at the Azure AI resource level. For more information, see [Azure AI resources](../concepts/ai-resources.md) and [connections](../concepts/connections.md).

When you run `ai init` your project connections get set in your development environment, allowing seamless integration with AI services. You can view these connections by running `ai service connection list`, and further manage these connections with `ai service connection` subcommands.

Any updates you make to connections in the Azure AI CLI is reflected in [Azure AI Studio](https://ai.azure.com), and vice versa.

## ai dev

`ai dev` helps you configure the environment variables in your development environment. 

After running `ai init`, you can run the following command to set a `.env` file populated with environment variables you can reference in your code.

```bash
ai dev new .env
```

## ai service

`ai service` helps you manage your connections to resources and services.

- `ai service resource` lets you list, create or delete AI Resources.
- `ai service project` lets you list, create, or delete AI Projects.
- `ai service connection` lets you list, create, or delete connections. These are the connections to your attached services.

## ai flow

`ai flow` lets you work with prompt flows in an interactive way. You can create new flows, invoke and test existing flows, serve a flow locally to test an application experience, upload a local flow to the Azure AI Studio, or deploy a flow to an endpoint.

The following steps help you test out each capability. They assume you have run `ai init`.

1. Run `ai flow new --name mynewflow` to create a new flow folder based on a template for a chat flow.
1. Open the `flow.dag.yaml` file that was created in the previous step.
    1. Update the `deployment_name` to match the chat deployment attached to your project. You can run `ai config @chat.deployment` to get the correct name.
    1. Update the connection field to be **Default_AzureOpenAI**. You can run `ai service connection list` to verify your connection names.
1. `ai flow invoke --name mynewflow --input question=hello` - this runs the flow with provided input and return a response.
1. `ai flow serve --name mynewflow` - this will locally serve the application and you can test interactively in a new window.
1. `ai flow package --name mynewflow` - this packages the flow as a Dockerfile.
1. `ai flow upload --name mynewflow` - this uploads the flow to the AI Studio, where you can continue working on it with the prompt flow UI.
1. You can deploy an uploaded flow to an online endpoint for inferencing via the Azure AI Studio UI, see [Deploy a flow for real-time inference](./flow-deploy.md) for more details.
  
### Project connections with flows

As mentioned in step 2 above, your flow.dag.yaml should reference connection and deployment names matching those attached to your project.

If you're working in your own development environment (including Codespaces), you might need to manually update these fields so that your flow runs connected to Azure resources.

If you launched VS Code from the AI Studio, you are in an Azure-connected custom container experience, and you can work directly with flows stored in the `shared` folder. These flow files are the same underlying files prompt flow references in the Studio, so they should already be configured with your project connections and deployments. To learn more about the folder structure in the VS Code container experience, see [Get started with Azure AI projects in VS Code (Web)](vscode-web.md)

## ai chat

Once you have initialized resources and have a deployment, you can chat interactively or non-interactively with the AI language model using the `ai chat` command. The CLI has more examples of ways to use the `ai chat` capabilities, simply enter `ai chat` to try them. Once you have tested the chat capabilities, you can add in your own data.

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

#### Chat with your data
Once you have tested the basic chat capabilities, you can add your own data using an Azure AI Search vector index.

1. Create a search index based on your data
1. Interactively chat with an AI system grounded in your data
1. Clear the index to prepare for other chat explorations

```bash
ai search index update --name <index_name> --files "*.md"
ai chat --index-name <index_name> --interactive
```

When you use `search index update` to create or update an index (the first step above), `ai config` stores that index name. Run `ai config` in the CLI to see more usage details.

If you want to set a different existing index for subsequent chats, use:
```bash
ai config --set search.index.name <index_name>
```

If you want to clear the set index name, use
```bash 
ai config --clear search.index.name
```

## ai help

The Azure AI CLI is interactive with extensive `help` commands. You can explore capabilities not covered in this document by running:

```bash
ai help
```

## Next steps

- [Try the Azure AI CLI from Azure AI Studio in a browser](vscode-web.md)












