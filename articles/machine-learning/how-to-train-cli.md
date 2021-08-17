---
title: 'Train models (create jobs) with the 2.0 CLI'
titleSuffix: Azure Machine Learning
description: Learn how to train models (create jobs) using Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: lostmygithubaccount
ms.author: copeters
ms.date: 06/18/2021
ms.reviewer: laobri
ms.custom: devx-track-azurecli, devplatv2
---

# Train models (create jobs) with the 2.0 CLI (preview)

The Azure 2.0 CLI extension for Machine Learning (preview) enables you to accelerate the model training process while scaling up and out on Azure compute, with the model lifecycle tracked and auditable.

Training a machine learning model is typically an iterative process. Modern tooling makes it easier than ever to train larger models on more data faster. Previously tedious manual processes like hyperparameter tuning and even algorithm selection are often automated. With the Azure Machine Learning CLI you can track your jobs (and models) in a [workspace](concept-workspace.md) with hyperparameter sweeps, scale-up on high-performance Azure compute, and scale-out utilizing distributed training.

> [!TIP]
> For a full-featured development environment, use Visual Studio Code and the [Azure Machine Learning extension](how-to-setup-vs-code.md) to [manage Azure Machine Learning resources](how-to-manage-resources-vscode.md) and [train machine learning models](tutorial-train-deploy-image-classification-model-vscode.md).

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
- [Install and set up the Azure CLI extension for Machine Learning](how-to-configure-cli.md)
- Clone the examples repository:

    ```azurecli-interactive
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli
    ```

## Introducing jobs

For the Azure Machine Learning CLI, jobs are authored in YAML format. A job aggregates:

- What to run
- How to run it
- Where to run it

The "hello world" job has all three:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/hello-world.yml":::

This is just an example job which doesn't output anything other than a line in the log file. Typically you want to generate additional artifacts, such as model binaries and accompanying metadata, in addition to the system-generated logs.

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

The basic command job is configured via the `job.yml`:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/train/lightgbm/iris/job.yml":::

This job can be created and run via `az ml job create` using the `--file/-f` parameter. However, the job targets a compute named `cpu-cluster` which does not yet exist. To run the job locally first, you can override the compute target with `--set`:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="lightgbm_iris_local":::

While running this job locally is slower than running `python main.py` in a local Python environment with the required packages, the above allows you to:

- Save the run history in the Azure Machine Learning studio
- Reproduce the run on remote compute targets (scale up, scale out, sweep hyperparameters)
- Track run submission details, including source code git repository and commit
- Track model metrics, metadata, and artifacts
- Avoid installation and package management in your local environment

> [!IMPORTANT]
> [Docker](https://docker.io) needs to be installed and running locally. Python needs to be installed in the job's environment. For local runs which use `inputs`, the Python package `azureml-dataprep` needs to be installed in the job's environment.

> [!TIP]
> This will take a few minutes to pull the base Docker image. Use prebuilt Docker images to avoid the image build time.

## Create compute

You can create an Azure Machine Learning compute cluster from the command line. For instance, the following commands will create one cluster named `cpu-cluster` and one named `gpu-cluster`.

:::code language="azurecli" source="~/azureml-examples-main/cli/create-compute.sh" id="create_computes":::

Note that you are not charged for compute at this point as `cpu-cluster` and `gpu-cluster` will remain at 0 nodes until a job is submitted. Learn more about how to [manage and optimize cost for AmlCompute](how-to-manage-optimize-cost.md#use-azure-machine-learning-compute-cluster-amlcompute).

Use `az ml compute create -h` for more details on compute create options.

[!INCLUDE [arc-enabled-kubernetes](../../includes/machine-learning-create-arc-enabled-training-computer-target.md)]

## Basic Python training job

With `cpu-cluster` created you can run the basic training job, which outputs a model and accompanying metadata. Let's review the job YAML file in detail:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/train/lightgbm/iris/job.yml":::

| Key | Description |
| --- | ----------- |
| `$schema` | [Optional] The YAML schema. You can view the [schema](https://azuremlschemas.azureedge.net/latest/commandJob.schema.json) in the above example in a browser to see all available options for a command job YAML file. If you use the Azure Machine Learning VS Code extension to author the YAML file, including this `$schema` property at the top of your file enables you to invoke schema and resource completions. |
| `code.local_path` | [Optional] The local path to the source directory, relative to the YAML file, to be uploaded and used with the job. Consider using `src` in the same directory as the job file(s) for consistency. |
| `command` | The command to execute. The `>` convention allows for authoring readable multiline commands by folding newlines to spaces. Command-line arguments can be explicitly written into the command or inferred from other sections, specifically `inputs` or `search_space`, using curly braces notation. |
| `inputs` | [Optional] A dictionary of the input data bindings, where the key is a name that you specify for the input binding. The value for each element is the input binding, which consists of `data` and `mode` fields. `data` can either be 1) a reference to an existing versioned Azure Machine Learning data asset by using the `azureml:` prefix (e.g. `azureml:iris-url:1` to point to version 1 of a data asset named "iris-url") or 2) an inline definition of the data. Use `data.path` to specify a cloud location. Use `data.local_path` to specify data from the local filesystem which will be uploaded to the default datastore. `mode` indicates how you want the data made available on the compute for the job. "mount" and "download" are the two supported options. <br><br> An input can be referred to in the command by its name, such as `{inputs.my_input_name}`. Azure Machine Learning will then resolve that parameterized notation in the command to the location of that data on the compute target during runtime. For example, if the data is configured to be mounted, `{inputs.my_input_name}` will resolve to the mount point. |
| `environment` | The environment to execute the command on the compute target with. You can define the environment inline by specifying the Docker image to use or the Dockerfile for building the image. You can also refer to an existing versioned environment in the workspace, or one of Azure ML's curated environments, using the `azureml:` prefix. For instance, `azureml:AzureML-TensorFlow2.4-Cuda11-OpenMpi4.1.0-py36:1` would refer to version 1 of a curated environment for TensorFlow with GPU support. <br><br> Python must be installed in the environment used for training. Run `apt-get update -y && apt-get install python3 -y` in your Dockerfile to install if needed. |
| `compute.target` | The compute target. Specify `local` for local execution, or use the `azureml:` prefix to reference an existing compute resource in your workspace. For instance, `azureml:cpu-cluster` would point to a compute target named "cpu-cluster". |
| `experiment_name` | [Optional] Tags the job for better organization in the Azure Machine Learning studio. Each job's run record will be organized under the corresponding experiment in the studio's "Experiment" tab. If omitted, it will default to the name of the working directory where the job was created. |
| `name` | [Optional] The name of the job, which must be unique across all jobs in a workspace. Unless a name is specified either in the YAML file via the `name` field or the command line via `--name/-n`, a GUID/UUID is automatically generated and used for the name. The job name corresponds to the Run ID in the studio UI of the job's run record. |

Creating this job uploads any specified local assets, like the source code directory, validates the YAML file, and submits the run. If needed, the environment is built, then the compute is scaled up and configured for running the job.

To run the lightgbm/iris training job:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="lightgbm_iris":::

Once the job is complete, you can download the outputs:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="download_outputs":::

> [!IMPORTANT]
> Replace `$run_id` with your run ID, which can be found in the console output or in the studio's run details page.

This will download the logs and any captured artifacts locally in a directory named `$run_id`. For this example, the MLflow-logged model subdirectory will be downloaded.

## Sweep hyperparameters

Azure Machine Learning also enables you to more efficiently tune the hyperparameters for your machine learning models. You can configure a hyperparameter tuning job, called a sweep job, and submit it via the CLI.

You can modify the `job.yml` into `job-sweep.yml` to sweep over hyperparameters:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/train/lightgbm/iris/job-sweep.yml":::

| Key | Description |
| --- | ----------- |
| `$schema` | [Optional] The YAML schema, which has changed and now points to the sweep job [schema](https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json). |
| `type` | The job type. |
| `algorithm` | The sampling algorithm - "random" is often a good choice. See the schema for the enumeration of options. |
| `trial` | The command job configuration for each trial to be run. The command (`trial.command`) has been modified from the previous example to use the `{search_space.<hyperparameter_name>}` notation to reference the hyperparameters defined in the `search_space`. Azure Machine Learning will then resolve each parameterized notation to the value for the corresponding hyperparameter that it generates for each trial. |
| `search_space` | A dictionary of the hyperparameters to sweep over. The key is a name for the hyperparameter, for example, `search_space.learning_rate`. Note that the name does not have to match the training script's argument itself, it just has to match the search space reference in the curly braces notation in the command, e.g. `{search_space.learning_rate}`. The value is the hyperparameter distribution. See the schema for the enumeration of options. |
| `objective.primary_metric` | The optimization metric, which must match the name of a metric logged from the training code. `objective.goal` specifies the direction ("minimize"/"maximize"). See the schema for the full enumeration of options. |
| `max_total_trials` | The maximum number of individual trials to run. |
| `max_concurrent_trials` | [Optional] The maximum number of trials to run concurrently on your compute cluster. |
| `timeout_minutes` | [Optional] The maximum number of minutes to run the sweep job for. |
| `experiment_name` | [Optional] The experiment to track the sweep job under. If omitted, it will default to the name of the working directory when the job is created. |

Create job and open in the studio:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="lightgbm_iris_sweep":::

> [!TIP]
> Hyperparameter sweeps can be used with distributed command jobs.

## Distributed training

You can specify the `distribution` section in a command job. Azure ML supports distributed training for PyTorch, Tensorflow, and MPI compatible frameworks. PyTorch and TensorFlow enable native distributed training for the respective frameworks, such as `tf.distributed.Strategy` APIs for TensorFlow.

Be sure to set the `compute.instance_count`, which defaults to 1, to the desired number of nodes for the job.

### PyTorch

An example YAML file for distributed PyTorch training on the CIFAR-10 dataset:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/train/pytorch/cifar-distributed/job.yml":::

Notice this refers to local data, which is not present in the cloned examples repository. You first need to download, extract, and relocate the CIFAR-10 dataset locally, placing it in the proper location in the project directory:

:::code language="bash" source="~/azureml-examples-main/cli/train.sh" id="download_cifar":::

Create the job and open in the studio:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="pytorch_cifar":::

### TensorFlow

An example YAML file for distributed TensorFlow training on the MNIST dataset:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/train/tensorflow/mnist-distributed/job.yml":::

Create the job and open in the studio:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="tensorflow_mnist":::

### MPI

Azure ML supports launching an MPI job across multiple nodes and multiple processes per node. It launches the job via `mpirun`. If your training code uses the Horovod framework for distributed training, for example, you can leverage this job type to train on Azure ML.

To launch an MPI job, specify `mpi` as the type and the number of processes per node to launch (`process_count_per_instance`) in the `distribution` section. If this field is not specified, Azure ML will default to launching one process per node.

An example YAML specification, which runs a TensorFlow job on MNIST using Horovod:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/train/tensorflow/mnist-distributed-horovod/job.yml":::

Create the job and open in the studio:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="tensorflow_mnist_horovod":::

## Next steps

- [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
- [Train models with REST (preview)](how-to-train-with-rest.md)
