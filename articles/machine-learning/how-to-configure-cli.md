---
title: 'Install, setup, and use the new Azure Machine Learning CLI'
description: Learn how how to install, setup, and use the new Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 05/24/2021
---

# Install, setup, and use the new Azure Machine Learning CLI

The Azure Machine Learning CLI is an extension to the [Azure CLI](/cli/azure/), a cross-platform command-line interface for the Azure platform. This extension provides commands for working with Azure Machine Learning. 

It allows you to train and deploy models from the command line, with features that accelerate scaling data science up and out.

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

- To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

    If you use the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/), the CLI is accessed through the browser and lives in the cloud.

## Installation

The new Machine Learning extension requires Azure CLI version `>=2.15.0`. Check your version:

```azurecli
az version
```

If required, upgrade the Azure CLI:

```azurecli
az upgrade
```

Check the extensions you have installed:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_extension_list":::

Ensure you do not have conflicting `ml` extensions installed, including the old `azure-cli-ml` and old versions of `ml`:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_extension_remove":::

Now, install the new Machine Learning extension:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_install":::

You can upgrade the extension to newer version:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_update":::

Run the help command to verify your installation and see available subcommands:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_verify":::

## Setup

Login:

```azurecli
az login
```

If you have access to multiple Azure subscriptions, you can set your active subscription:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_account_set":::

Export your workspace name, resource group, and Azure location: 

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="export_variables_placeholders":::

If it does not already exist, you can create the Azure resource group:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_group_create":::

Similarly for the machine learning workspace:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_workspace_create":::

Nearly all machine learning subcommands require the `--workspace/-w` and `--resource-group/-g` flags to be specified. To avoid typing this repeatedly, you may configure defaults:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_configure_defaults":::

Note: most/all code examples assume you have set a default workspace and resource group. You can override these on the command line.

## Hello world

To follow along, clone and change into the Azure ML CLI examples:

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

To simply run hello world via Python, see the example in the `jobs` subdirectory:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/hello-world.yml":::

And submit:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="hello_world":::

This will generate a GUID/UUID for the job name. You can capture it for use in later commands with `--query`:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="hello_world_output":::

PM note: this can be useful for automation. In future, should have state machine/context i.e. `az ml job show` will show the last job referenced without needing to specify job name, which needs to be random since its an ARM resource hence GUIDs.

Then open the job in the studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="show_job_in_studio":::

Or, stream to the logs, which will block the console:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="stream_job_logs_to_console":::

Check the status:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="check_job_status":::

## Next steps

- [Train models using Machine Learning CLI extension](how-to-train-cli.md)
- [Deploy models using Machine Learning CLI extension](how-to-deploy-cli.md)
- [Manage resources with the Machine Learning CLI extension](how-to-manage-resources-cli.md)
- [Command reference for the Machine Learning CLI extension](/cli/azure/ext/ml/ml).
