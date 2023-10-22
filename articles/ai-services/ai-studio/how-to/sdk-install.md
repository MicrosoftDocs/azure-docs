---
title: How to install the Azure AI SDK
titleSuffix: Azure AI services
description: This article provides instructions on how to install the Azure AI SDK.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to install the Azure AI SDK

To use the Azure AI SDK for generative AI applications, you can either:
- [Install the SDK into an existing development environment](#install-the-sdk-into-an-existing-development-environment) or
- [Use the Azure AI SDK without installing it](#use-the-azure-ai-sdk-without-installing-it)

Start with a containerized development environment. The prebuilt development environments are based on a docker container that has the generative AI SDK and CLI, and configured to run VS Code remotely inside of the container.

## Install the SDK into an existing development environment

> [!WARNING]
> The Azure AI SDK generative AI packages are experimental, require careful installation to avoid dependency issues, and will update frequently. These packages have not yet been thoroughly tested outside of the development container image, which uses Python 3.10 running on Debian 12.

### Install Python

First, install Python 3.10 or higher, create a virtual environment or conda environment, and install your packages into that virtual or conda environment. DO NOT install the Generative AI SDK into your global python installation. You should always use a virtual or conda environment when installing python packages, otherwise you can break your system install of Python.

#### Install Python via virtual environments

Follow the instructions in the [VS Code Python Tutorial](https://code.visualstudio.com/docs/python/python-tutorial#_install-a-python-interpreter) for the easiest way of installing Python and creating a virtual environment on your operating system.

If you already have Python 3.10 or higher installed, you can create a virtual environment using the following commands:

# [Windows](#tab/windows)

```bash
py -3 -m venv .venv
.venv\scripts\activate
```

# [Linux](#tab/linux)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

# [macOS](#tab/macos)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---


#### Install Python via Conda environments

First, install miniconda following the instructions [here](https://docs.conda.io/en/latest/miniconda.html).

Then, create and activate a new Python 3.10 environment:

```bash
conda create --name ai_env python=3.10
conda activate ai_env
```

### Install Azure AI SDK generative packages

Currently to use the generative packages of the Azure AI SDK, you install a set of packages as described in this section. A single `azure-ai-generative` installation package will be available soon.

Copy the following text into a `requirements.txt` file. You can also copy the latest `requirements.txt` file from the [Azure/aistudio-copilot-sample](https://github.com/Azure/aistudio-copilot-sample/blob/main/requirements.txt) repository on GitHub.

```txt
# other app dependencies
ipykernel
python-dotenv 

# generative ai SDK dependencies
openai
pydantic<2
azureml-metrics[prompt-flow,evaluate] @https://azuremlsdktestpypi.blob.core.windows.net/repo/sdk-release/master/588E708E0DF342C4A80BD954289657CF/azureml_metrics-0.1.0.105204596-py3-none-any.whl
azure-ai-generative @https://azuremlsdktestpypi.blob.core.windows.net/repo/test-azure-ai-generative/azure_ai_generative-0.7.0-py3-none-any.whl
azureml-rag[document_parsing,cognitive_search]==0.2.10
azureml-telemetry

# promptflow dependencies, these should be optional in the future
# hardcoded the version of azureml-mlflow here for faster Docker image building speed
azureml-mlflow==1.53.0
promptflow[azure]==0.1.0b7.post1
promptflow-tools==0.1.0b8
keyring
pytest

# langchain dependencies, it's used in chat demo notebook
langchain==0.0.312
semantic-kernel
```

Enter the following command to install the packages from the `requirements.txt` file:

> [!IMPORTANT]
> It's recommended to run this command either in a virtual environment, conda environment, or docker container. If you do not do this, you may run into dependency issues with the packages you have installed on your system.

```bash
pip install -r requirements.txt
```

The Azure AI SDK should now be installed and ready to use!


## Use the Azure AI SDK without installing it

You can install the Azure AI SDK locally as described previously, or run it via an internet browser or Docker container. 

Start with a containerized development environment. Our prebuilt development environments are based on a docker container that has the Azure AI SDK generative packages, the Azure AI CLI, the Prompt flow SDK, and other tools. It's configured to run VS Code remotely inside of the container. The docker container is defined in [this Dockerfile](https://github.com/Azure/aistudio-copilot-sample/blob/main/.devcontainer/Dockerfile), and is based on [Microsoft's Python 3.10 Development Container Image](https://mcr.microsoft.com/en-us/product/devcontainers/python/about). 

### OPTION 1: GitHub Codespaces

During this public preview, we recommend using the Azure AI SDK through GitHub Codespaces. This option helps you quickly get started without having to install anything locally.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure/aistudio-copilot-sample?quickstart=1)


### OPTION 2: Visual Studio Code Dev Container

You can run the Azure AI SDK in a Docker container using VS Code Dev Containers:

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

