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

The following example jobs in this article use one of `cpu-cluster` or `gpu-cluster`. Adjust these as needed to the name of your cluster(s). Use `az ml compute create -h` for more details on compute create options.

[!INCLUDE [arc-enabled-kubernetes](../../includes/machine-learning-create-arc-enabled-training-computer-target.md)]

## Introducing jobs

For the Azure Machine Learning CLI (v2), jobs are authored in YAML format. A job aggregates:

- What to run
- How to run it
- Where to run it

The "hello world" job has all three:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/basics/hello-world.yml":::

>[!WARNING] Python must be installed in the environment used for jobs. Run `apt-get update -y && apt-get install python3 -y` in your Dockerfile to install if needed, or derive from a base image with Python installed already. This limitation will be removed in a future release.

Which you can run:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world":::

>[!TIP] The `--web` parameter will attempt to open your job in the Azure Machine Learning studio using your default web browser. The `--stream` parameter can be used to stream logs to the console and block further commands.

However this is just an example job which doesn't output anything other than a line in the log file. Typically you want to generate additional artifacts, such as model binaries and accompanying metadata, in addition to the system-generated logs.

### Overriding values with `--set`

YAML job specification values can be overridden using `--set` when creating or updating a job. For instance:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_set":::

>[!TIP] `--set` is useful for changing the compute target or training parameters when experimenting. It can also be used with `az ml job update`, which is shown below.

### Tags, environment variables, display name, and description

You can specify tags, environment variables, a description, and a display name for your job. Descriptions support markdown syntax in the studio. Tags, display name, and description are mutable after the job is created. A full example:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/single-step/basics/hello-world-full.yml":::

You can run this job, where these details (except environment variables) will be immediately visible in the studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_full":::

Using `--set` we can update the mutable values after the job is created:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_full_set":::

>[!TIP] Replace `$run_id` with your job's name, in the command above. [See the section below](###job-names) for details.

### Job names

Most `az ml job` commands other than `create` and `list` require `--name/-n`, which is a job's name or "Run ID" in the studio. It is strongly discouraged to directly set a job's `name` property as it must be unique per workspace. Azure Machine Learning generates a random GUID for the job name if it is not set which can be obtained from the output of job creation in the CLI or by copying the "Run ID" property in the studio.

For organization of jobs, set a `display_name` instead which does not have to be unique.

For automation you can capture the job's name when it is created by querying and stripping the output by adding `--query name -o tsv`. The specifics will vary by shell, but for Bash:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_full_name":::

Then use `$run_id` in subsequent commands like `update`, `show`, or `stream`:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_full_show":::

## Tracking models and their source code

Production machine learning models need to be auditable if not reproducible. It is crucial to keep track of the source code for a given model. Azure Machine Learning takes a snapshot of your source code and keeps it with the job. Additionally, the source repository and commit are kept if you are running jobs from a Git repository.

>[!TIP] If you're following along and running from the examples repository, you can see the source repository and commit in the studio on any of the jobs run so far.

You can specify the `code.local_path` key in a job with the value as the path to a source code directory. A snapshot of the directory is taken and uploaded with the job. The contents of the directory are directly available from the working directory of the job.

>[!TIP] The source code should not include large data inputs for model training. Instead, [use data inputs](###data-inputs). You can use a `.gitignore` file in the source code directory to exclude files from the snapshot.

Let's look at a job which specifies code:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/basics/hello-mlflow.yml":::

The Python script is in the local source code directory. The command then invokes `python` to run the script. The same pattern can be applied for other programming languages.

>[!WARNING] The "hello" family of jobs shown in this article are for demonstration purposes do not necessarily follow recommended best practices. Using `&&` or similar to run many jobs in a sequence is not recommended - instead, consider writing the commands to a script file in the source code directory and invoking the script in your `command`. Installing dependencies in the `command`, as shown above via `pip install`, is not recommended - instead, all job dependencies should be specified as part of your environment. See [how to manage environments with the CLI (v2)](TODO) for details.

While iterating on models, data scientists need to be able to keep track of model parameters and training metrics. Azure Machine Learning integrates with MLflow tracking to enable the logging of models, artifacts, metrics, and parameters to a job. To use MLflow in your Python scripts just `import mlflow` and call `mlflow.log_*` or `mlflow.autolog()` APIs in your training code.

>[!TIP] `mlflow.autolog()` is supported for many popular frameworks and takes care of the majority of logging for you.

Let's take a look at Python script invoked in the job above which uses `mlflow` to log a parameter, a metric, and an artifact:

:::code language="python" source="~/azureml-examples-cli-preview/cli/jobs/basics/src/hello-mlflow.py":::

We can run this job in the cloud via Azure Machine Learning, where it is tracked and auditable:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="mlflow_remote":::

## Inputs and outputs

### Literal inputs

Literal inputs are directly inferred in the command. We can modify our "hello world" job to use literal inputs:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/basics/hello-world.yml":::

You can run this job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_input":::

You can use `--set` to override inputs:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_input_set":::

>[!TIP] `--set` can be used to override all keys in the YAML job specification.

Literal inputs to jobs can easily be [converted to search space inputs](###sweep-inputs) for hyperparameter sweeps on model training.

### Default outputs

Jobs will typically have inputs and outputs. Outputs do not need to be explicitly specified. Azure Machine Learning captures the following artifacts automatically:

- The `./outputs` and `./logs` directories receive special treatment by Azure Machine Learning. If you write any files to these directories during your job, these files will get uploaded to the job's run history so that you can still access them once the job is complete. The `./outputs` folder is uploaded at the end of the job, while the files written to `./logs` are uploaded in real time. Use the latter if you want to stream logs during the job, such as TensorBoard logs.
- Azure Machine Learning integrates with MLflow's tracking functionality. You can use `mlflow.autolog()` for several common ML frameworks to log model parameters, performance metrics, model artifacts, and even feature importance graphs. You can also use the `mlflow.log_*()` methods to explicitly log parameters, metrics, and artifacts. All MLflow-logged metrics and artifacts will be saved in the job's run history. See the [MLflow tracking](##mlflow-tracking) section for details.

>[!WARNING] The `mlflow` and `azureml-mlflow` packages must be installed in your Python environment for MLflow tracking features.

With this, we can easily modify the "hello world" job to output to a file in the default outputs directory instead of printing to `stdout`:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/basics/hello-world-output.yml":::

You can run this job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_output":::

And download the logs, where `helloworld.txt` will be present in the `<run_id>/outputs/` directory:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="hello_world_download":::

All inputs are inferred in a job's `command` string. Literal and search space inputs are directly substituted, while data inputs are converted into a path on the local compute where the data is mounted or downloaded (`ro_mount` by default). We'll use a simple Python script which takes the Iris CSV file as input, prints out the first 5 lines, and saves it to an `outputs` directory.

:::code language="python" source="~/azureml-examples-cli-preview/cli/jobs/basics/src/hello-iris.py":::

### Data inputs

Data inputs are inferred as a path on the job compute's local filesystem. Let's demonstrate with the classic Iris dataset, which is hosted publicly in a blob container at `https://azuremlexamples.blob.core.windows.net/datasets/iris.csv`.

We can take a simple Python script which takes the path to the Iris CSV file as an argument, reads it into a dataframe, prints out the first 5 lines, and saves it to the `outputs` directory.

:::code language="python" source="~/azureml-examples-cli-preview/cli/jobs/basics/src/hello-iris.py":::

You can run this locally if you have Python and `pandas` installed:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="iris_local":::

We can easily convert this to a job which runs on the cloud:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/basics/hello-iris-literal.yml":::

Which you can run:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="iris_literal":::

Azure storage inputs can be specified as a dataset which will mount or download data to the local filesystem. This can be more reliable. You can specify a single file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/basics/hello-iris-file.yml":::

And run:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="iris_file":::

Or specify an entire folder:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/basics/hello-iris-folder.yml":::

And run:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="iris_folder":::

### Search space inputs

One reason for using literal inputs is they can easily be converted into search space inputs for hyperparameter sweeps.

>[!WARNING] Sweeps are not currently supported in pipeline jobs.

### Named outputs

>[!WARNING] Using a previous job's default outputs and MLflow-logged artifacts are not currently supported.

## Multistep jobs (pipelines)

Pipeline jobs can run multiple jobs.

>[!WARNING] The full functionality of pipelines is not currently available.

## Train a model

At this point, we still haven't trained a model. Let's add some `scikit-learn` code into a Python script with MLflow tracking to train a model on the Iris CSV:

:::code language="python" source="~/azureml-examples-cli-preview/cli/jobs/single-step/scikit-learn/iris/src/main.py":::

The scikit-learn framework is supported by MLflow for autologging, so a single `mlflow.autolog()` call in the script will log all model parameters, training metrics, model artifacts, and some additional artifacts (in this case a confusion matrix). Notice this code has no cloud dependencies so you can run it locally if you have the required packages installed:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="sklearn_local":::

As before, a local MLflow run is generated. To run this in the cloud, specify as a job:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/single-step/basics/hello-mlflow.yml":::

And run it:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="sklearn_remote":::

To register a model, you can download the outputs and create a model from the local directory:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/train.sh" id="sklearn_download_register_model":::

## Distributed training

## Distributed training


> [!TIP]
> Hyperparameter sweeps can be used with distributed command jobs.


## Build a training pipeline

## Next steps

- [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
- [Train models with REST (preview)](how-to-train-with-rest.md)
