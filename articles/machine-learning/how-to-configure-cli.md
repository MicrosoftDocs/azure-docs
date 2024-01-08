---
title: 'Install and set up the CLI (v2)'
titleSuffix: Azure Machine Learning
description: Learn how to install and set up the Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
author: balapv
ms.author: balapv
ms.date: 01/03/2024
ms.reviewer: larryfr
ms.custom: devx-track-azurecli, devplatv2, event-tier1-build-2022, ignite-2022
---

# Install and set up the CLI (v2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]



The `ml` extension to the [Azure CLI](/cli/azure/) is the enhanced interface for Azure Machine Learning. It enables you to train and deploy models from the command line, with features that accelerate scaling data science up and out while tracking the model lifecycle.

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
- To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

## Installation

The new Machine Learning extension **requires Azure CLI version `>=2.38.0`**. Ensure this requirement is met:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_version":::

If it isn't, [upgrade your Azure CLI](/cli/azure/update-azure-cli).

Check the Azure CLI extensions you've installed:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_extension_list":::

Remove any existing installation of the `ml` extension and also the CLI v1 `azure-cli-ml` extension:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_extension_remove":::

Now, install the `ml` extension:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_ml_install":::

Run the help command to verify your installation and see available subcommands:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_ml_verify":::

You can upgrade the extension to the latest version:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_ml_update":::

### Installation on Linux

If you're using Debian or Ubuntu, the fastest way to install the necessary CLI version and the Machine Learning extension is:

:::code language="bash" source="~/azureml-examples-main/cli/misc.sh" id="az_extension_install_linux":::

For information on how to install on other Linux distributions, visit [Install the Azure CLI for Linux](/cli/azure/install-azure-cli-linux).

## Set up

Login:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_login":::

If you have access to multiple Azure subscriptions, you can set your active subscription:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_account_set":::

Optionally, setup common variables in your shell for usage in subsequent commands:

:::code language="azurecli" source="~/azureml-examples-main/setup/setup-repo/azure-github.sh" id="set_variables":::

> [!WARNING]
> This uses Bash syntax for setting variables -- adjust as needed for your shell. You can also replace the values in commands below inline rather than using variables.

If it doesn't already exist, you can create the Azure resource group:

:::code language="azurecli" source="~/azureml-examples-main/setup/setup-repo/azure-github.sh" id="az_group_create":::

And create a machine learning workspace:

:::code language="azurecli" source="~/azureml-examples-main/setup/setup-repo/azure-github.sh" id="az_ml_workspace_create":::

Machine learning subcommands require the `--workspace/-w` and `--resource-group/-g` parameters. To avoid typing these repeatedly, configure defaults:

:::code language="azurecli" source="~/azureml-examples-main/cli/setup.sh" id="az_configure_defaults":::

> [!TIP]
> Most code examples assume you have set a default workspace and resource group. You can override these on the command line.

You can show your current defaults using `--list-defaults/-l`:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="list_defaults":::

> [!TIP]
> Combining with `--output/-o` allows for more readable output formats.

## Secure communications

The `ml` CLI extension (sometimes called 'CLI v2') for Azure Machine Learning sends operational data (YAML parameters and metadata) over the public internet. All the `ml` CLI extension commands communicate with the Azure Resource Manager. This communication is secured using HTTPS/TLS 1.2.

Data in a data store that is secured in a virtual network is _not_ sent over the public internet. For example, if your training data is located in the default storage account for the workspace, and the storage account is in a virtual network.

> [!NOTE]
> With the previous extension (`azure-cli-ml`, sometimes called 'CLI v1'), only some of the commands communicate with the Azure Resource Manager. Specifically, commands that create, update, delete, list, or show Azure resources. Operations such as submitting a training job communicate directly with the Azure Machine Learning workspace. If your workspace is [secured with a private endpoint](how-to-configure-private-link.md), that is enough to secure commands provided by the `azure-cli-ml` extension.

# [Public workspace](#tab/public)

If your Azure Machine Learning workspace is public (that is, not behind a virtual network), then there is no additional configuration required. Communications are secured using HTTPS/TLS 1.2

# [Private workspace](#tab/private)

If your Azure Machine Learning workspace uses a private endpoint and virtual network, choose one of the following configurations to use:

* If you are __OK__ with the CLI v2 communication over the public internet, use the following `--public-network-access` parameter for the `az ml workspace update` command to enable public network access. For example, the following command updates a workspace for public network access:

    ```azurecli
    az ml workspace update --name myworkspace --public-network-access enabled
    ```

* If you are __not OK__ with the CLI v2 communication over the public internet, you can use an Azure Private Link to increase security of the communication. Use the following links to secure communications with Azure Resource Manager by using Azure Private Link.

    1. [Secure your Azure Machine Learning workspace inside a virtual network using a private endpoint](how-to-configure-private-link.md).
    2. [Create a Private Link for managing Azure resources](../azure-resource-manager/management/create-private-link-access-portal.md). 
    3. [Create a private endpoint](../azure-resource-manager/management/create-private-link-access-portal.md#create-private-endpoint) for the Private Link created in the previous step.

    > [!IMPORTANT]
    > To configure the private link for Azure Resource Manager, you must be the _subscription owner_ for the Azure subscription, and an _owner_ or _contributor_ of the root management group. For more information, see [Create a private link for managing Azure resources](../azure-resource-manager/management/create-private-link-access-portal.md).

---

## Next steps

- [Train models using CLI (v2)](how-to-train-model.md)
- [Set up the Visual Studio Code Azure Machine Learning extension](how-to-setup-vs-code.md)
- [Train an image classification TensorFlow model using the Azure Machine Learning Visual Studio Code extension](tutorial-train-deploy-image-classification-model-vscode.md)
- [Explore Azure Machine Learning with examples](samples-notebooks.md)
