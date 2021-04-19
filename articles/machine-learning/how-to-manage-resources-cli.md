---
title: 'Manage resources with the new Azure Machine Leanring CLI'
description: Learn how to manage resources (Workspace, Data, Environment, etc.) using the Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 05/24/2021
---

# Manage resources

Words

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Workspace


:::code language="yaml" source="~/azureml-examples-cli-preview/cli/assets/workspace/basic-ws-1.yml":::

## Data

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/assets/data/iris-url.yml":::

## Environment

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/assets/environment/python-ml-basic-cpu.yml":::

## Model

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/assets/model/lightgbm-iris.yml":::

## Next steps

- [Command reference for the Machine Learning CLI extension](/cli/azure/ext/ml/ml).
- [Train models (create jobs) with the Machine Learning CLI extension](how-to-train-cli.md)
- [Deploy models with the Machine Learning CLI extension](how-to-deploy-cli.md)
