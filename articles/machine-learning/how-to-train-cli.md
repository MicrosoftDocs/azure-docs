---
title: 'Train models (create jobs) with the new Azure Machine Learning CLI'
description: Learn how to trian models (create jobs) using Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 05/24/2021
---

# Train models (create jobs)

words

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

- [Install and setup the Azure CLI extension for Machine Learning](how-to-configure-cli.md)

- Clone the examples repository:

    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli
    ```

## Best practices

- colocate data and compute
- use prebuilt environments/images
- ... 

## YAML authoring

words

- vscode?

## Create remote compute

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="create_computes":::

## Basic Python job

A classic machine learning example is classification on the Iris dataset. We'll use it for demonstrating the basic concepts of training models, or creating jobs, with Azure Machine Learning, starting locally, progressing to the cloud, and sweeping hyperparameters.

From the cloned examples repository, there is a 

YAML file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job.yml":::

Create job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="lightgbm_iris":::

Show in studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="show_job_in_studio":::

Stream logs to console:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="stream_job_logs_to_console":::

## Sweeping hyperparameters

YAML file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job-sweep.yml":::

Create job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="lightgbm_iris_sweep":::

Show in studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="show_job_in_studio":::

## Distributed training

Words

Currently supported:

- pytorch
- tensorflow
- mpi

### PyTorch

Download, extract/remove, and relocate CIFAR-10 dataset locally:

:::code language="bash" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="download_cifar":::

YAML file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/pytorch/cifar-distributed/job.yml":::

Create the job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="pytorch_cifar":::

### Tensorflow

YAML file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/tensorflow/mnist-distributed/job.yml":::

Create the job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="tensorflow_mnist":::

### MPI

YAML file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/tensorflow/mnist-distributed-horovod/job.yml":::

Create the job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="tensorflow_mnist_horovod":::

## Tracking metrics

words

## Next steps

- [Command reference for the Machine Learning CLI extension](/cli/azure/ext/ml/ml).
- [Manage resources with the Machine Learning CLI extension](how-to-manage-resources-cli.md)
- [Deploy models with the Machine Leanring CLI extension](how-to-deploy-cli.md)
