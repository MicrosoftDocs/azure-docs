---
title: 'Train models (create jobs) with the CLI (v2)'
titleSuffix: Azure Machine Learning
description: Learn how to train models (create jobs) using Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: lostmygithubaccount
ms.author: copeters
ms.date: 10/18/2021
ms.reviewer: laobri
ms.custom: devx-track-azurecli, devplatv2
---

# Train models (create jobs) with the CLI (v2)

The Azure Machine Learning CLI (v2) is an Azure CLI extension enabling you to accelerate the model training process while scaling up and out on Azure compute, with the model lifecycle tracked and auditable.

Training a machine learning model is typically an iterative process. Modern tooling makes it easier than ever to train larger models on more data faster. Previously tedious manual processes like hyperparameter tuning and even algorithm selection are often automated. With the Azure Machine Learning CLI you can track your jobs (and models) in a [workspace](concept-workspace.md) with hyperparameter sweeps, scale-up on high-performance Azure compute, and scale-out utilizing distributed training.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
- [Install and set up the Azure CLI extension for Machine Learning](how-to-configure-cli.md)

> [!TIP]
> For a full-featured development environment, use Visual Studio Code and the [Azure Machine Learning extension](how-to-setup-vs-code.md) to [manage Azure Machine Learning resources](how-to-manage-resources-vscode.md) and [train machine learning models](tutorial-train-deploy-image-classification-model-vscode.md).

### Clone examples repository

To run the training examples, first clone the examples repository and change into the `cli` directory:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/misc.sh" id="git_clone":::

Note that `--depth 1` clones only the latest commit to the repository which reduces time to complete the operation.

### Create compute

You can create an Azure Machine Learning compute cluster from the command line. For instance, the following commands will create one cluster named `cpu-cluster` and one named `gpu-cluster`.

:::code language="azurecli" source="~/azureml-examples-cli-preview/repo-setup/create-compute.sh" id="create_computes":::

Note that you are not charged for compute at this point as `cpu-cluster` and `gpu-cluster` will remain at 0 nodes until a job is submitted. Learn more about how to [manage and optimize cost for AmlCompute](how-to-manage-optimize-cost.md#use-azure-machine-learning-compute-cluster-amlcompute).

The following example jobs in this article use one of `cpu-cluster` or `gpu-cluster`. Adjust these as needed to the name of your cluster(s).

Use `az ml compute create -h` for more details on compute create options.

[!INCLUDE [arc-enabled-kubernetes](../../includes/machine-learning-create-arc-enabled-training-computer-target.md)]

## Introducing jobs

For the Azure Machine Learning CLI (v2), jobs are authored in YAML format. A job aggregates:

- What to run
- How to run it
- Where to run it

The "hello world" job has all three:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/misc/hello-world.yml":::

Which you can run:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world":::

However this is just an example job which doesn't output anything other than a line in the log file. Typically you want to generate additional artifacts, such as model binaries and accompanying metadata, in addition to the system-generated logs.

Azure Machine Learning captures the following artifacts automatically:

- The `./outputs` and `./logs` directories receive special treatment by Azure Machine Learning. If you write any files to these directories during your job, these files will get uploaded to the job's run history so that you can still access them once the job is complete. The `./outputs` folder is uploaded at the end of the job, while the files written to `./logs` are uploaded in real time. Use the latter if you want to stream logs during the job, such as TensorBoard logs.
- Azure Machine Learning integrates with MLflow's tracking functionality. You can use `mlflow.autolog()` for several common ML frameworks to log model parameters, performance metrics, model artifacts, and even feature importance graphs. You can also use the `mlflow.log_*()` methods to explicitly log parameters, metrics, and artifacts. All MLflow-logged metrics and artifacts will be saved in the job's run history.

Often, a job involves running some source code that is edited and controlled locally. You can specify a source code directory to include in the job, from which the command will be run.

For instance, look at the `jobs/train/lightgbm/iris` project directory in the examples repository:

```tree
.
├── job-sweep.yml
├── job.yml
└── src
    └── main.py
```

This directory contains two job files and a source code subdirectory `src`. While this example only has a single file under `src`, the entire subdirectory is recursively uploaded and available for use in the job.

The command job is configured via the `job.yml`:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job.yml":::

Which you can run:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="lightgbm_iris":::

## Sweep hyperparameters

Azure Machine Learning also enables you to more efficiently tune the hyperparameters for your machine learning models. You can configure a hyperparameter tuning job, called a sweep job, and submit it via the CLI.

You can modify the `job.yml` into `job-sweep.yml` to sweep over hyperparameters:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job-sweep.yml":::

Create job and open in the studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="lightgbm_iris_sweep":::

> [!TIP]
> Hyperparameter sweeps can be used with distributed command jobs.

## Building a training pipeline

## Next steps

- [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
- [Train models with REST (preview)](how-to-train-with-rest.md)
