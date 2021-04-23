---
title: 'Train models (create jobs) with the new Azure Machine Learning CLI'
description: Learn how to train models (create jobs) using Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: lostmygithubaccount
ms.author: copeters
ms.date: 05/24/2021
---

# Train models (create jobs) with the new Azure Machine Learning CLI

Training a machine learning model is generally an iterative process. Modern tooling makes it easier than ever to train larger models on more data faster. Previously tedious manual processes like hyperparameter tuning and even algorithm selection are often automated.


The Azure CLI extension for Machine Learning enables you to accelerate the iterative model training process while easily scaling up and out on Azure compute.

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

- [Install and setup the Azure CLI extension for Machine Learning](how-to-configure-cli.md)

- Clone the examples repository:

    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli
    ```

## Introducing jobs

For the Azure Machine Learning CLI, jobs are authored in YAML format. A job aggregates:

- What to run
- How to run it
- Where to run it

The simple "hello world" job has all three:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/hello-world.yml":::

But it's not a useful job since it doesn't produce anything other than a line in the log file. While jobs which only print out information to logs can be useful, typically you want to generate additional artifacts, such as model binaries and accompanying metadata, in addition to logs.

Artifacts produced by an Azure Machine Learning job which should be retained should be written to the special `./outputs` directory from the job.

Additionally, you can use MLflow logging, including `mlflow.autolog()` for a number of common machine learning frameworks. This will generally log model parameters, performance metrics, model artifacts, and even feature importance graphs. Other metrics, parameters, or artifacts logged through `mlflow.log*` are kept with the job.

Often, a job involves running some source code which is edited and controlled locally. You can specify a source code directory to include in the job, from which the command will be run.

For instance, look at the `jobs/train/lightgbm/iris` project directory in the examples repository:

```bash
|
 -- job.yml
 -- job-sweep.yml
 -- environment.yml
 -- src
   |
    -- main.py
```

This contains two jobs, a conda environment file, and a source code directory `src`. While this example only has a single file under `src`, the entire subdirectory is recursively uploaded and available for use in the job.

The basic command job is configured via the `job.yml`:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job.yml":::

This can be created via `az ml job create` using the `--file/-f` parameter. However for the job to succeed, we first need to create the `cpu-cluster`.

## Create compute

You can create an Azure Machine Learning compute cluster from the command line. For instance, the following will create one cluster named `cpu-cluster` and one named `gpu-cluster`.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="create_computes":::

Note that you are not charged for compute at this point, refer to compute cost guide?

Use `az ml compute create -h` or refer to the reference documentation for more details on compute create options.

## Basic Python job

With `cpu-cluster` created, you can run the basic LightGBM on Iris job. Let's review the job YAML file in detail:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job.yml":::

`$schema:` specifies the YAML schema. You can view the schema in the above example in a browser to see all available options for a command job YAML file. Also, if using VS Code (and the extension?) this will ?

`code:/local_path:` specifies the local path to the source directory, relative to the YAML file, to be uploaded and used with the job. Consider using `src` in the same directory as the job file(s) for consistency.

`command:` specifies the command to execute. The `>- ` convention allows for easily authoring multiline commands. Inputs can be written into the command or inferred from other sections, specifically `inputs` or `search_space`.

`inputs:` specifies the data inputs. This can be existing Azure Machine Learning data assets by using the `azureml:` prefix, for instance `azureml:iris-url:1` would point to version 1 of a dataset named "iris-url". Data can be uploaded from the local file system or point to existing cloud resources. An input can be referred to in the command by its name like `{inputs.my_input_name}`.

`environment:` specifies the environment to execute the command on the compute target with. It generally consists of a docker context. You can also refer to an existing registered environment, or one of Azure ML's curated environments, using the `azureml:` prefix. For instance `azureml:AzureML-TensorFlow2.4-Cuda11-OpenMpi4.1.0-py36:1` would refer to version 1 of a curated environment for tensorflow on GPUs.

[!IMPORTANT] Python must be installed in the environment. Run `apt-get update -y && apt-get install python3 -y` in your dockerfile to install if needed.

`compute:/target:` specifies the compute target. It can be `local` for local execution, or use the `azureml:` prefix. For instance, `azureml:cpu-cluster` would point to a compute target named "cpu-cluster".

`experiment_name:` tags the job for better organization in the Azure Machine Learning studio - it will default to the name of the working directory when the job is created.

Creating this job uploads any specified local assets, like the source code directory, validates the YAML file, and if this succeeds submits the run. If needed, the environment is built, then the compute is scaled up and configured for running the job.

Unless a name is specified either in the YAML file via `name:` or the command line via `--name/-n`, a GUID/UUID is automatically generated and used for the name. For CI/CD workflows, it is useful to capture this information when creating the job.

To run the lightgbm/iris training job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="lightgbm_iris":::

You can then monitor the progress of the job in the studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="show_job_in_studio":::

You can also stream the logs to the console through the CLI:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="stream_job_logs_to_console":::

Note this will block further commands in the terminal unless run in the background, which can be useful in CI/CD workflows to wait for a job to complete.

Once the job is complete, you can download the outputs:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="download_outputs":::

This will download the logs and any captured artifacts locally in a directory named `$job_id`. For this example, the mlflow model subdirectory will be downloaded.

## Sweeping hyperparameters

Often after training...

Let's see how we can modify the `job.yml` from before to now sweep over hyperparameters:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job-sweep.yml":::

`$schema:` notice this has changed and now points to a sweep job schema, which refers to the command job schema under `trial:`.

`type:` specifies the job type.

`algorithm:` specifies the search algorithm - "random" is often a good choice, see the schema for the enumeration of options.

`trial:` specifies the command job, with the command modified to use parameters from the `search_space:`.

`search_space:` specifies the parameters to sweep over. See the schema for the enumeration of options.

`objective:/primary_metric:` specifies the metric, which must match the name of a metric logged in the run, for optimization and `goal:` specifies the direction. See the schema for the full enumeration of options.

`max_total_trials:` specifies the maximum number of runs of individual trials.

`max_concurrent_trials:` specifies the maximum number nodes in the compute target to use concurrently.

`timeout_minutes:` specifies the maximum number of minutes to run the sweep job for.

A sweep job can be specified for searching hyperparameters used in the command.

Create job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="lightgbm_iris_sweep":::

Show in studio:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="show_job_in_studio":::

## Distributed training

You can specify the `distributed:` section in a command job, which currently supports: PyTorch, TensorFlow, and MPI.

PyTorch and Tensorflow respectively enable native distributed training from the frameworks, for instance using `tf.distributed.Strategy` APIs.

Be sure to set the `compute:/instance_count:`, which defaults to 1, to the desired number of nodes to run the job on.

### PyTorch

An example YAML file for distributed PyTorch training on the CIFAR-10 dataset:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/pytorch/cifar-distributed/job.yml":::

Notice this refers to local data, which is not present in the cloned examples repository. You first need to download, extract, and relocate the CIFAR-10 dataset locally, placing it in the proper location in the project directory:

:::code language="bash" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="download_cifar":::

Now you can submit the job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="pytorch_cifar":::

### TensorFlow

An example YAML file for distributed TensorFlow training on the MNIST dataset:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/tensorflow/mnist-distributed/job.yml":::

Create the job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="tensorflow_mnist":::

### MPI

Azure ML supports launching an MPI job across multiple nodes and multiple processes per node. It launches the job via `mpirun`. If your training code uses the Horovod framework for distributed training, for example, you can leverage this job type to train on Azure ML.

To launch an MPI job, specify `mpi` as the type and the number of processes per node to launch (`process_count_per_instance`) in the `distribution:` section. If this field is not specified, Azure ML will default to launching one process per node. To run a multi-node job, specify the `node_count` field in the `compute:` section.

An example YAML specification, which runs a TensorFlow job on MNIST using Horovod:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/tensorflow/mnist-distributed-horovod/job.yml":::

Create the job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-train-cli.sh" id="tensorflow_mnist_horovod":::

## Best practices

Colocate data and compute in the same Azure region whenever possible. While this does not matter much using the Iris dataset from a public blob in `eastus`, it quickly becomes both inefficient and costly when running jobs on large data.

Use prebuilt Docker images where possible for your environment to reduce job preparation time. The Azure Machine Learning studio environments tab (preview) has prebuilt environments for common frameworks.

If using VS Code, consider configuring to autopopulate options when authoring YAML files with a `$schema` specified. For more information, see [JSON schemas and settings](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings).

## Next steps

- [Deploy models with the Machine Learning CLI extension](how-to-deploy-cli.md)
- [Command reference for the Machine Learning CLI extension](/cli/azure/ext/ml/ml).
