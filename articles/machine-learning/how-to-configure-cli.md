---
title: 'Install, setup, and use the new Azure Machine Leanring CLI'
description: Learn how to use the new Azure CLI extension for Machine Learning to manage the entire ML lifecycle from the command line.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

ms.author: lostmygithubaccount
author: copeters
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

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="create_resource_group":::

## Setup

## Hello world

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/hello-world.yml":::

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: >-
  python -c "print('hello world')"
environment:
  docker:
    image: docker.io/python
compute:
  target: local
```

## Creating and using remote compute

## Removing

## Known limitations

## Tips & tricks


## Next steps

- [Command reference for the Machine Learning CLI extension](/cli/azure/ext/ml/ml).
- [Train and deploy machine learning models using Machine Learning CLI extension](how-to-train-cli.md)
- [Manage resources with the Machine Learning CLI extension](how-to-manage-resources-cli.md)
