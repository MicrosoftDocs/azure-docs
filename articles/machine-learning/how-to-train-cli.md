---
title: 'Train models with the CLI (v2)'
titleSuffix: Azure Machine Learning
description: Learn how to train models (create jobs) using Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: amibp
ms.author: amipatel
ms.date: 03/31/2022
ms.reviewer: nibaccam
ms.custom: devx-track-azurecli, devplatv2
---

# Train models with the CLI (v2) (preview)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]
[!INCLUDE [cli v2 how to update](../../includes/machine-learning-cli-v2-update-note.md)]

The Azure Machine Learning CLI (v2) is an Azure CLI extension enabling you to accelerate the model training process while scaling up and out on Azure compute, with the model lifecycle tracked and auditable.

Training a machine learning model is typically an iterative process. Modern tooling makes it easier than ever to train larger models on more data faster. Previously tedious manual processes like hyperparameter tuning and even algorithm selection are often automated. With the Azure Machine Learning CLI (v2), you can track your jobs (and models) in a [workspace](concept-workspace.md) with hyperparameter sweeps, scale-up on high-performance Azure compute, and scale-out utilizing distributed training.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- To use the CLI (v2), you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
- [Install and set up CLI (v2)](how-to-configure-cli.md).

> [!TIP]
> For a full-featured development environment with schema validation and autocompletion for job YAMLs, use Visual Studio Code and the [Azure Machine Learning extension](how-to-setup-vs-code.md).

### Clone examples repository

To run the training examples, first clone the examples repository and change into the `cli` directory:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="git_clone":::

Using `--depth 1` clones only the latest commit to the repository, which reduces time to complete the operation.

### Create compute

You can create an Azure Machine Learning compute cluster from the command line. For instance, the following commands will create one cluster named `cpu-cluster` and one named `gpu-cluster`.

:::code language="azurecli" source="~/azureml-examples-main/setup-repo/create-compute.sh" id="create_computes":::

You are not charged for compute at this point as `cpu-cluster` and `gpu-cluster` will remain at zero nodes until a job is submitted. Learn more about how to [manage and optimize cost for AmlCompute](how-to-manage-optimize-cost.md#use-azure-machine-learning-compute-cluster-amlcompute).

The following example jobs in this article use one of `cpu-cluster` or `gpu-cluster`. Adjust these names in the example jobs throughout this article as needed to the name of your cluster(s). Use `az ml compute create -h` for more details on compute create options.

## Hello world

For the Azure Machine Learning CLI (v2), jobs are authored in YAML format. A job aggregates:

- What to run
- How to run it
- Where to run it

The "hello world" job has all three:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world.yml":::

> [!WARNING]
> Python must be installed in the environment used for jobs. Run `apt-get update -y && apt-get install python3 -y` in your Dockerfile to install if needed, or derive from a base image with Python installed already.

> [!TIP]
> The `$schema:` throughout examples allows for schema validation and autocompletion if authoring YAML files in [VSCode with the Azure Machine Learning extension](how-to-setup-vs-code.md).

Which you can run:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world":::

> [!TIP]
> The `--web` parameter will attempt to open your job in the Azure Machine Learning studio using your default web browser. The `--stream` parameter can be used to stream logs to the console and block further commands.

## Overriding values on create or update

YAML job specification values can be overridden using `--set` when creating or updating a job. For instance:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_set":::

## Job names

Most `az ml job` commands other than `create` and `list` require `--name/-n`, which is a job's name or "Run ID" in the studio. You typically should not directly set a job's `name` property during creation as it must be unique per workspace. Azure Machine Learning generates a random GUID for the job name if it is not set that can be obtained from the output of job creation in the CLI or by copying the "Run ID" property in the studio and MLflow APIs.

To automate jobs in scripts and CI/CD flows, you can capture a job's name when it is created by querying and stripping the output by adding `--query name -o tsv`. The specifics will vary by shell, but for Bash:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_name":::

Then use `$run_id` in subsequent commands like `update`, `show`, or `stream`:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_show":::

## Organize jobs

To organize jobs, you can set a display name, experiment name, description, and tags. Descriptions support markdown syntax in the studio. These properties are mutable after a job is created. A full example:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml":::

You can run this job, where these properties will be immediately visible in the studio:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_org":::

Using `--set` you can update the mutable values after the job is created:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_org_set":::

## Environment variables

You can set environment variables for use in your job:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-env-var.yml":::

You can run this job:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_env_var":::

> [!WARNING]
> You should use `inputs` for parameterizing arguments in the `command`. See [inputs and outputs](#inputs-and-outputs).

## Track models and source code

Production machine learning models need to be auditable (if not reproducible). It is crucial to keep track of the source code for a given model. Azure Machine Learning takes a snapshot of your source code and keeps it with the job. Additionally, the source repository and commit are tracked if you are running jobs from a Git repository.

> [!TIP]
> If you're following along and running from the examples repository, you can see the source repository and commit in the studio on any of the jobs run so far.

You can specify the `code` field in a job with the value as the path to a source code directory. A snapshot of the directory is taken and uploaded with the job. The contents of the directory are directly available from the working directory of the job.

> [!WARNING]
> The source code should not include large data inputs for model training. Instead, [use data inputs](#data-inputs). You can use a `.gitignore` file in the source code directory to exclude files from the snapshot. The limits for snapshot size are 300 MB or 2000 files.

Let's look at a job that specifies code:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-mlflow.yml":::

The Python script is in the local source code directory. The command then invokes `python` to run the script. The same pattern can be applied for other programming languages.

> [!WARNING]
> The "hello" family of jobs shown in this article are for demonstration purposes and do not necessarily follow recommended best practices. Using `&&` or similar to run many commands in a sequence is not recommended -- instead, consider writing the commands to a script file in the source code directory and invoking the script in your `command`. Installing dependencies in the `command`, as shown above via `pip install`, is not recommended -- instead, all job dependencies should be specified as part of your environment. See [how to manage environments with the CLI (v2)](how-to-manage-environments-v2.md) for details.

### Model tracking with MLflow

While iterating on models, data scientists need to be able to keep track of model parameters and training metrics. Azure Machine Learning integrates with MLflow tracking to enable the logging of models, artifacts, metrics, and parameters to a job. To use MLflow in your Python scripts add `import mlflow` and call `mlflow.log_*` or `mlflow.autolog()` APIs in your training code.

> [!WARNING]
> The `mlflow` and `azureml-mlflow` packages must be installed in your Python environment for MLflow tracking features.

> [!TIP]
> The `mlflow.autolog()` call is supported for many popular frameworks and takes care of the majority of logging for you.

Let's take a look at Python script invoked in the job above that uses `mlflow` to log a parameter, a metric, and an artifact:

:::code language="python" source="~/azureml-examples-main/cli/jobs/basics/src/hello-mlflow.py":::

You can run this job in the cloud via Azure Machine Learning, where it is tracked and auditable:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_mlflow":::

### Query metrics with MLflow

After running jobs, you might want to query the jobs' run results and their logged metrics. Python is better suited for this task than a CLI. You can query runs and their metrics via `mlflow` and load into familiar objects like Pandas dataframes for analysis.

First, retrieve the MLflow tracking URI for your Azure Machine Learning workspace:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="mlflow_uri":::

Use the output of this command in `mlflow.set_tracking_uri(<YOUR_TRACKING_URI>)` from a Python environment with MLflow imported. MLflow calls will now correspond to jobs in your Azure Machine Learning workspace.

## Inputs and outputs

Jobs typically have inputs and outputs. Inputs can be model parameters, which might be swept over for hyperparameter optimization, or cloud data inputs that are mounted or downloaded to the compute target. Outputs (ignoring metrics) are artifacts that can be written or copied to the default outputs or a named data output.

### Literal inputs

Literal inputs are directly resolved in the command. You can modify our "hello world" job to use literal inputs:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-input.yml":::

You can run this job:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_input":::

You can use `--set` to override inputs:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_input_set":::

Literal inputs to jobs can be [converted to search space inputs](#search-space-inputs) for hyperparameter sweeps on model training.

### Search space inputs

For a sweep job, you can specify a search space for literal inputs to be chosen from. For the full range of options for search space inputs, see the [sweep job YAML syntax reference](reference-yaml-job-sweep.md).

Let's demonstrate the concept with a simple Python script that takes in arguments and logs a random metric:

:::code language="python" source="~/azureml-examples-main/cli/jobs/basics/src/hello-sweep.py":::

And create a corresponding sweep job:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-sweep.yml":::

And run it:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_sweep":::

### Data inputs

Data inputs are resolved to a path on the job compute's local filesystem. Let's demonstrate with the classic Iris dataset, which is hosted publicly in a blob container at `https://azuremlexamples.blob.core.windows.net/datasets/iris.csv`.

You can author a Python script that takes the path to the Iris CSV file as an argument, reads it into a dataframe, prints the first 5 lines, and saves it to the `outputs` directory.

:::code language="python" source="~/azureml-examples-main/cli/jobs/basics/src/hello-iris.py":::

Azure storage URI inputs can be specified, which will mount or download data to the local filesystem. You can specify a single file:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-file.yml":::

And run:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="iris_file":::

Or specify an entire folder:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-folder.yml":::

And run:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="iris_folder":::

Make sure you accurately specify the input `type` field to either `type: uri_file` or `type: uri_folder` corresponding to whether the data points to a single file or a folder. The default if the `type` field is omitted is `uri_folder`.

#### Private data

For private data in Azure Blob Storage or Azure Data Lake Storage connected to Azure Machine Learning through a datastore, you can use Azure Machine Learning URIs of the format `azureml://datastores/<DATASTORE_NAME>/paths/<PATH_TO_DATA>` for input data. For instance, if you upload the Iris CSV to a directory named `/example-data/` in the Blob container corresponding to the datastore named `workspaceblobstore` you can modify a previous job to use the file in the datastore:

> [!WARNING]
> Running these jobs will fail for you if you have not copied the Iris CSV to the same location in `workspaceblobstore`.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-datastore-file.yml":::

Or the entire directory:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-datastore-folder.yml":::

### Default outputs

The `./outputs` and `./logs` directories receive special treatment by Azure Machine Learning. If you write any files to these directories during your job, these files will get uploaded to the job so that you can still access them once the job is complete. The `./outputs` folder is uploaded at the end of the job, while the files written to `./logs` are uploaded in real time. Use the latter if you want to stream logs during the job, such as TensorBoard logs.

In addition, any files logged from MLflow via autologging or `mlflow.log_*` for artifact logging will get automatically persisted as well. Collectively with the aforementioned `./outputs` and `./logs` directories, this set of files and directories will be persisted to a directory that corresponds to that job's default artifact location.

You can modify the "hello world" job to output to a file in the default outputs directory instead of printing to `stdout`:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-output.yml":::

You can run this job:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_output":::

And download the logs, where `helloworld.txt` will be present in the `<RUN_ID>/outputs/` directory:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_output_download":::

### Data outputs

You can specify named data outputs. This will create a directory in the default datastore which will be read/write mounted by default.

You can modify the earlier "hello world" job to write to a named data output:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-output-data.yml":::

## Hello pipelines

Pipeline jobs can run multiple jobs in parallel or in sequence. If there are input/output dependencies between steps in a pipeline, the dependent step will run after the other completes.

You can split a "hello world" job into two jobs:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline.yml":::

And run it:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_pipeline":::

The "hello" and "world" jobs respectively will run in parallel if the compute target has the available resources to do so.

To pass data between steps in a pipeline, define a data output in the "hello" job and a corresponding input in the "world" job, which refers to the prior's output:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-io.yml":::

And run it:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_pipeline_io":::

This time, the "world" job will run after the "hello" job completes.

To avoid duplicating common settings across jobs in a pipeline, you can set them outside the jobs:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-settings.yml":::

You can run this:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_pipeline_settings":::

The corresponding setting on an individual job will override the common settings for a pipeline job. The concepts so far can be combined into a three-step pipeline job with jobs "A", "B", and "C". The "C" job has a data dependency on the "B" job, while the "A" job can run independently. The "A" job will also use an individually set environment and bind one of its inputs to a top-level pipeline job input:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-abc.yml":::

You can run this:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_pipeline_abc":::

## Train a model

At this point, a model still hasn't been trained. Let's add some `sklearn` code into a Python script with MLflow tracking to train a model on the Iris CSV:

:::code language="python" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/src/main.py":::

The scikit-learn framework is supported by MLflow for autologging, so a single `mlflow.autolog()` call in the script will log all model parameters, training metrics, model artifacts, and some extra artifacts (in this case a confusion matrix image).

To run this in the cloud, specify as a job:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/job.yml":::

And run it:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="sklearn_iris":::

To register a model, you can upload the model files from the run to the model registry:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="sklearn_download_register_model":::

For the full set of configurable options for running command jobs, see the [command job YAML schema reference](reference-yaml-job-command.md).

## Sweep hyperparameters

You can modify the previous job to sweep over hyperparameters:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/job-sweep.yml":::

And run it:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="sklearn_sweep":::

> [!TIP]
> Check the "Child runs" tab in the studio to monitor progress and view parameter charts..

For the full set of configurable options for sweep jobs, see the [sweep job YAML schema reference](reference-yaml-job-sweep.md).

## Distributed training

Azure Machine Learning supports PyTorch, TensorFlow, and MPI-based distributed training. See the [distributed section of the command job YAML syntax reference](reference-yaml-job-command.md#distribution-configurations) for details.

As an example, you can train a convolutional neural network (CNN) on the CIFAR-10 dataset using distributed PyTorch. The full script is [available in the examples repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step/pytorch/cifar-distributed).

The CIFAR-10 dataset in `torchvision` expects as input a directory that contains the `cifar-10-batches-py` directory. You can download the zipped source and extract into a local directory:

:::code language="azurecli" source="~/azureml-examples-main/setup-repo/create-datasets.sh" id="download_untar_cifar":::

Then create an Azure Machine Learning data asset from the local directory, which will be uploaded to the default datastore:

:::code language="azurecli" source="~/azureml-examples-main/setup-repo/create-datasets.sh" id="create_cifar":::

Optionally, remove the local file and directory:

:::code language="azurecli" source="~/azureml-examples-main/setup-repo/create-datasets.sh" id="cleanup_cifar":::

Registered data assets can be used as inputs to job using the `path` field for a job input. The format is `azureml:<data_name>:<data_version>`, so for the CIFAR-10 dataset just created, it is `azureml:cifar-10-example:1`. You can optionally use the `azureml:<data_name>@latest` syntax instead if you want to reference the latest version of the data asset. Azure ML will resolve that reference to the explicit version.

With the data asset in place, you can author a distributed PyTorch job to train our model:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/pytorch/cifar-distributed/job.yml":::

And run it:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="pytorch_cifar":::

## Build a training pipeline

The CIFAR-10 example above translates well to a pipeline job. The previous job can be split into three jobs for orchestration in a pipeline:

- "get-data" to run a Bash script to download and extract `cifar-10-batches-py`
- "train-model" to take the data and train a model with distributed PyTorch
- "eval-model" to take the data and the trained model and evaluate accuracy

Both "train-model" and "eval-model" will have a dependency on the "get-data" job's output. Additionally, "eval-model" will have a dependency on the "train-model" job's output. Thus the three jobs will run sequentially.
<!-- 
You can orchestrate these three jobs within a pipeline job:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/cifar-10/job.yml":::

And run:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="pipeline_cifar"::: -->

Pipelines can also be written using reusable components. For more, see [Create and run components-based machine learning pipelines with the Azure Machine Learning CLI (Preview)](how-to-create-component-pipelines-cli.md).

## Next steps

- [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
