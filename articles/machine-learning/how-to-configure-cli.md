---
title: 'Install and set up the new Azure Machine Learning CLI'
description: Learn how to install and set up the new Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 05/25/2021
---

# Install and set up the new Azure Machine Learning CLI

The new `ml` extension to the [Azure CLI](/cli/azure/) is the next generation interface for the Azure Machine Learning service. It allows you to train and deploy models from the command line, with features that accelerate scaling data science up and out while tracking the model lifecycle.

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

- To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

    If you use the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/), the CLI is accessed through the browser and lives in the cloud.

## Installation

The new Machine Learning extension requires Azure CLI version `>=2.15.0`. Ensure this requirement is met:

```azurecli
az version
```

If required, upgrade the Azure CLI:

```azurecli
az upgrade
```

Check the extensions installed:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_extension_list":::

Ensure no conflicting `ml` extension installed, including the old `azure-cli-ml` which uses the same namespace:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_extension_remove":::

Now, install the new Machine Learning extension:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_install":::

You can upgrade the extension to newer version:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_update":::

Run the help command to verify your installation and see available subcommands:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_verify":::

## Set up

Login:

```azurecli
az login
```

If you have access to multiple Azure subscriptions, you can set your active subscription:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_account_set":::

Export your workspace name, resource group, and Azure location:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="export_variables_placeholders":::

If it doesn't already exist, you can create the Azure resource group:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_group_create":::

Similarly for the machine learning workspace:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_workspace_create":::

Nearly all machine learning subcommands require the `--workspace/-w` and `--resource-group/-g` parameters to be specified. To avoid typing these parameters repeatedly, you may configure defaults:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_configure_defaults":::

Note: most code examples assume you have set a default workspace and resource group. You can override these on the command line.

## Next steps

- [Train models using Machine Learning CLI extension](how-to-train-cli.md)
- [Deploy models using Machine Learning CLI extension](how-to-deploy-cli.md)
- [Command reference for the Machine Learning CLI extension](/cli/azure/ext/ml/ml)
