---
title: 'Install, set up, and use the 2.0 CLI'
titleSuffix: Azure Machine Learning
description: Learn how to install, set up, and use the Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 05/25/2021
ms.reviewer: laobri
ms.custom: devx-track-azurecli, devplatv2
---

# Install, set up, and use the 2.0 CLI (preview)

The `ml` extension (preview) to the [Azure CLI](/cli/azure/) is the enhanced interface for Azure Machine Learning. It enables you to train and deploy models from the command line, with features that accelerate scaling data science up and out while tracking the model lifecycle.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
- To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

    > [!TIP]
    > If you use the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/), the CLI is accessed through the browser and lives in the cloud.

## Installation

The new Machine Learning extension **requires Azure CLI version `>=2.15.0`**. Ensure this requirement is met:

```azurecli
az version
```

If it isn't, [upgrade your Azure CLI](/cli/azure/update-azure-cli).

Check the Azure CLI extensions you've installed:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_extension_list":::

Ensure no conflicting extension using the `ml` namespace is installed, including the `azure-cli-ml` extension:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_extension_remove":::

Now, install the `ml` extension:

:::code language="azurecli" source="~/azureml-examples-main/cli/setup.sh" id="az_ml_install":::

Run the help command to verify your installation and see available subcommands:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_ml_verify":::

You can upgrade the extension to the latest version:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_ml_update":::

### Installation on Linux

If you're using Linux, the fastest way to install the necessary CLI version and the Machine Learning extension is:

:::code language="bash" source="~/azureml-examples-main/cli/misc.sh" id="az_extension_install_linux":::

For more, see [Install the Azure CLI for Linux](/cli/azure/install-azure-cli-linux).

## Set up

Login:

```azurecli
az login
```

If you have access to multiple Azure subscriptions, you can set your active subscription:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_account_set":::

If it doesn't already exist, you can create the Azure resource group:

:::code language="azurecli" source="~/azureml-examples-main/cli/setup.sh" id="az_group_create":::

Machine learning subcommands require the `--workspace/-w` and `--resource-group/-g` parameters. To avoid typing these repeatedly, configure defaults:

:::code language="azurecli" source="~/azureml-examples-main/cli/setup.sh" id="az_configure_defaults":::

> [!TIP]
> Most code examples assume you have set a default workspace and resource group. You can override these on the command line.

Now create the machine learning workspace:

:::code language="azurecli" source="~/azureml-examples-main/cli/setup.sh" id="az_ml_workspace_create":::

## Hello world

To follow along, clone the examples repository and change into the `cli` subdirectory:

```azurecli-interactive
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

To run hello world locally via Python, see the example in the `jobs` subdirectory:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/hello-world.yml":::

> [!IMPORTANT]
> [Docker](https://docker.io) needs to be installed and running locally.

Submit the job, streaming the logs to the console output, and opening the run in the Azure Machine Learning studio:

:::code language="azurecli" source="~/azureml-examples-main/cli/hello-world.sh" id="hello_world":::

> [!IMPORTANT]
> This may take a few minutes to run the first time, as the Docker image is pulled locally and the Azure ML job is run. Subsequent runs will have the image cached locally and complete quicker.

## Next steps

- [Train models using Machine Learning CLI extension (preview)](how-to-train-cli.md)
- [Set up the Visual Studio Code Azure Machine Learning extension](how-to-setup-vs-code.md)
- [Train an image classification TensorFlow model using the Azure Machine Learning Visual Studio Code extension](tutorial-train-deploy-image-classification-model-vscode.md)
