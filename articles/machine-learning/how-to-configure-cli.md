---
title: 'Install, setup, and use the new Azure Machine Leanring CLI'
description: Learn how to use the new Azure CLI extension for Machine Learning to manage the entire ML lifecycle from the command line.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 05/24/2021
---

# Install, setup, and use the new Azure Machine Learning CLI

The Azure Machine Learning CLI is an extension to the [Azure CLI](/cli/azure/), a cross-platform command-line interface for the Azure platform. This extension provides commands for working with Azure Machine Learning. It allows you to automate your machine learning activities. The following list provides some example actions that you can do with the CLI extension:

- Run experiments to create machine learning models
- Register machine learning models for customer usage
- Package, deploy, and track the lifecycle of your machine learning models

The CLI is not a replacement for the Azure Machine Learning SDK. It is a complementary tool that is optimized to handle highly parameterized tasks which suit themselves well to automation.

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

- To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

    If you use the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/), the CLI is accessed through the browser and lives in the cloud.

## Installation

The new Machine Learning extension requires Azure CLI version `>=2.15.0`. Check your version:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_version":::

If required, upgrade the Azure CLI:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_upgrade":::

Check the extensions you have installed:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_extension_list":::

Ensure you do not have conflicting `ml` extensions installed, including the old `azure-cli-ml` and previous preview versions of `ml`:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_extension_remove":::

Finally, install the new Machine Learning extension:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_install":::

Trust but verify:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_verify":::

## Setup

If you have access to multiple Azure subscriptions, you can set your active subscription:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_account_set":::

where `$ID` is your subscription.

Export your workspace name, resource group, and Azure location: 

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="export_variables_placeholder":::

If it does not already exist, you can create the Azure resource group:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_group_create":::

Similarly for the machine learning workspace:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_workspace_create":::

Nearly all machine learning subcommands require the `--workspace/-w` and `--resource-group/-g` flags to be specified. To avoid typing this repeatedly, you may set defaults:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_configure_defaults":::

## Hello world

To follow along, download and change into the Azure ML CLI examples:

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

To simply run hello world via Python:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/hello-world.yml":::

And submit:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="hello_world":::

This will generate a GUID/UUID for the job name. You can capture it for use in later commands with `--query`:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="hello_world_output":::

Then open the job in the studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="show_job_in_studio":::

Or, stream to the logs, which will block the console:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="show_job_in_studio":::

Check the status:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="check_job_status":::

## Known limitations

- python required on image
- azureml-dataprep required for local runs using remote data
- CLI list operations on many resources is not performant

## Next steps

- [Command reference for the Machine Learning CLI extension](/cli/azure/ext/ml/ml).
- [Train and deploy machine learning models using Machine Learning CLI extension](how-to-train-cli.md)
- [Manage resources with the Machine Learning CLI extension](how-to-manage-resources-cli.md)
