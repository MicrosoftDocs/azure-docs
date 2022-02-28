---
title: 'Install and set up the CLI (v2)'
titleSuffix: Azure Machine Learning
description: Learn how to install and set up the Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 02/28/2022
ms.reviewer: laobri
ms.custom: devx-track-azurecli, devplatv2
---

# Install and set up the CLI (v2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The `ml` extension (preview) to the [Azure CLI](/cli/azure/) is the enhanced interface for Azure Machine Learning. It enables you to train and deploy models from the command line, with features that accelerate scaling data science up and out while tracking the model lifecycle.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
- To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

## Installation

The new Machine Learning extension **requires Azure CLI version `>=2.15.0`**. Ensure this requirement is met:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_version":::

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

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_login":::

If you have access to multiple Azure subscriptions, you can set your active subscription:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_account_set":::

Optionally, setup common variables in your shell for usage in subsequent commands:

:::code language="azurecli" source="~/azureml-examples-main/setup-repo/azure-github.sh" id="set_variables":::

> [!WARNING]
> This uses Bash syntax for setting variables -- adjust as needed for your shell. You can also replace the values in commands below inline rather than using variables.

If it doesn't already exist, you can create the Azure resource group:

:::code language="azurecli" source="~/azureml-examples-main/setup-repo/azure-github.sh" id="az_group_create":::

And create a machine learning workspace:

:::code language="azurecli" source="~/azureml-examples-main/setup-repo/azure-github.sh" id="az_ml_workspace_create":::

Machine learning subcommands require the `--workspace/-w` and `--resource-group/-g` parameters. To avoid typing these repeatedly, configure defaults:

:::code language="azurecli" source="~/azureml-examples-main/cli/setup.sh" id="az_configure_defaults":::

> [!TIP]
> Most code examples assume you have set a default workspace and resource group. You can override these on the command line.

You can show your current defaults using `--list-defaults/-l`:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="list_defaults":::

> [!TIP]
> Combining with `--output/-o` allows for more readable output formats.

## Secure communications

The `ml` CLI extension for Azure Machine Learning sends data for _all operations_ over the _public internet_. This includes operations that may potentially contain sensitive data, such as job submissions or deploying models. For example, when using the [az ml job](/cli/azure/ml/job) commands, the YAML parameter file is sent over the public internet.

> [!TIP]
> Data stored in a data store that is secured in a virtual network is _not_ sent over the public internet. For example, if your training data is secured on the default storage account for the workspace, and the storage account is in the virtual network.

If you don't want your CLI/YAML parameter data sent over the public internet, you can use the following steps:

1. [Secure your Azure Machine Learning workspace inside a virtual network using a private endpoint](how-to-configure-private-link.md).
2. [Create a Private Link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal). 
3. [Create a private endpoint](/azure/azure-resource-manager/management/create-private-link-access-portal#create-private-endpoint) for the Private Link created in the previous step.

> [!IMPORTANT]
> To configure the private link for Azure Resource Manager, you must be the _subscription owner_ for the Azure subscription, and an _owner_ or _contributor_ of the root management group. For more information, see [Create a private link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal).

> [!NOTE]
> In the previous extension (`azure-cli-ml`), if your workspace was [secured with a private endpoint](how-to-configure-private-link.md) operations such as job submission used the private endpoint and virtual network to securely pass data to the workspace. These operations directly connected to the Azure Machine Learning service. Create, update, delete, list, and show operations for the workspace and compute resources were sent over the public internet and connected to the Azure Resource Manager.
>
> In the `ml` extension, _all_ operations communicate with the Azure Resource Manager. The communication defaults to the public internet unless you [Create a Private Link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal). 


## Next steps

- [Train models using CLI (v2)](how-to-train-cli.md)
- [Set up the Visual Studio Code Azure Machine Learning extension](how-to-setup-vs-code.md)
- [Train an image classification TensorFlow model using the Azure Machine Learning Visual Studio Code extension](tutorial-train-deploy-image-classification-model-vscode.md)
- [Explore Azure Machine Learning with examples](samples-notebooks.md)
