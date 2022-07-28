---
title: Train models with the Azure ML Python SDK v2 (preview)
titleSuffix: Azure Machine Learning
description: Configure and submit Azure Machine Learning jobs to train your models with SDK v2.
services: machine-learning
author: balapv
ms.author: balapv
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 06/10/2022
ms.topic: how-to
ms.custom: sdkv2, event-tier1-build-2022
---

# Train models with the Azure ML Python SDK v2 (preview)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
> [!div class="op_single_selector" title1="Select the Azure Machine Learning SDK version you are using:"]
> * [v1](v1/how-to-attach-compute-targets.md)
> * [v2 (preview)](how-to-train-sdk.md)


> [!IMPORTANT]
> SDK v2 is currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to configure and submit Azure Machine Learning jobs to train your models. Snippets of code explain the key parts of configuration and submission of a training     job. Then use one of the [example notebooks](https://github.com/Azure/azureml-examples/tree/sdk-preview/sdk) to find the full end-to-end working examples.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today
* The Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install)
* An Azure Machine Learning workspace

### Clone examples repository

To run the training examples, first clone the examples repository and change into the `sdk` directory:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/sdk
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

## Start on your local machine

Start by running a script, which trains a model using `lightgbm`. The script file is available [here](https://github.com/Azure/azureml-examples/blob/sdk-preview/sdk/jobs/single-step/lightgbm/iris/src/main.py). The script needs three inputs

* _input data_: You'll use data from a web location for your run - [web location](https://azuremlexamples.blob.core.windows.net/datasets/iris.csv). In this example, we're using a file in a remote location for brevity, but you can use a local file as well.
* _learning-rate_: You'll use a learning rate of _0.9_
* _boosting_: You'll use the Gradient Boosting _gdbt_

Run this script file as follows

```bash
cd jobs/single-step/lightgbm/iris

python src/main.py --iris-csv https://azuremlexamples.blob.core.windows.net/datasets/iris.csv  --learning-rate 0.9 --boosting gbdt
```

The output expected is as follows:

```terminal
2022/04/21 15:02:44 INFO mlflow.tracking.fluent: Autologging successfully enabled for lightgbm.
2022/04/21 15:02:44 INFO mlflow.tracking.fluent: Autologging successfully enabled for sklearn.
2022/04/21 15:02:45 INFO mlflow.utils.autologging_utils: Created MLflow autologging run with ID 'a1d5f652796e4d88961176166de52253', which will track hyperparameters, performance metrics, model artifacts, and lineage information for the current lightgbm workflow
lightgbm\engine.py:177: UserWarning: Found `num_iterations` in params. Will use it instead of argument
[LightGBM] [Warning] Auto-choosing col-wise multi-threading, the overhead of testing was 0.000164 seconds.
You can set `force_col_wise=true` to remove the overhead.
[LightGBM] [Warning] No further splits with positive gain, best gain: -inf
[LightGBM] [Warning] No further splits with positive gain, best gain: -inf
[LightGBM] [Warning] No further splits with positive gain, best gain: -inf
```

## Move to the cloud

Now that the local run works, move this run to an Azure Machine Learning workspace. To run this on Azure ML, you need:

* A workspace to run
* A compute on which to run it
* An environment on the compute to ensure you have the required packages to run your script

Let us tackle these steps below

### 1. Connect to the workspace

To connect to the workspace, you need identifier parameters - a subscription, resource group and workspace name. You'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. To authenticate, you use the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true). Check this [example](https://github.com/Azure/azureml-examples/blob/sdk-preview/sdk/jobs/configuration.ipynb) for more details on how to configure credentials and connect to a workspace.

```python
#import required libraries
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

#Enter details of your AzureML workspace
subscription_id = '<SUBSCRIPTION_ID>'
resource_group = '<RESOURCE_GROUP>'
workspace = '<AZUREML_WORKSPACE_NAME>'

#connect to the workspace
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
```

### 2. Create compute

You'll create a compute called `cpu-cluster` for your job, with this code:


[!notebook-python[] (~/azureml-examples-main/sdk/jobs/configuration.ipynb?name=create-cpu-compute)]


### 3. Environment to run the script

To run your script on `cpu-cluster`, you need an environment, which has the required packages and dependencies to run your script. There are a few options available for environments:

* Use a curated environment in your workspace - Azure ML offers several curated [environments](https://ml.azure.com/environments), which cater to various needs.
* Use a custom environment - Azure ML allows you to create your own environment using 
   * A docker image
   * A base docker image with a conda YAML to customize further
   * A docker build context

   Check this [example](https://github.com/Azure/azureml-examples/blob/main/sdk/assets/environment/environment.ipynb) on how to create custom environments.

You'll use a curated environment provided by Azure ML for `lightgm` called `AzureML-lightgbm-3.2-ubuntu18.04-py37-cpu`

### 4. Submit a job to run the script

To run this script, you'll use a `command`. The command will be run by submitting it as a `job` to Azure ML. 

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb?name=create-command)]

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb?name=run-command)]


In the above, you configured:
- `code` - path where the code to run the command is located
- `command` -  command that needs to be run
- `inputs` - dictionary of inputs using name value pairs to the command. The key is a name for the input within the context of the job and the value is the input value. Inputs are referenced in the `command` using the `${{inputs.<input_name>}}` expression. To use files or folders as inputs, you can use the `Input` class.

For more details, refer to the [reference documentation](/python/api/azure-ai-ml/azure.ai.ml#azure-ai-ml-command).

## Improve the model using hyperparameter sweep

Now that you have run a job on Azure, let us make it better using Hyperparameter tuning. Also called hyperparameter optimization, this is the process of finding the configuration of hyperparameters that results in the best performance. Azure Machine Learning provides a `sweep` function on the `command` to do hyperparameter tuning.

To perform a sweep, there needs to be input(s) against which the sweep needs to be performed. These inputs can have a discrete or continuous value. The `sweep` function will run the `command` multiple times using different combination of input values specified. Each input is a dictionary of name value pairs. The key is the name of the hyperparameter and the value is the parameter expression. 

Let us improve our model by sweeping on `learning_rate` and `boosting` inputs to the script. In the previous step, you used a specific value for these parameters, but now you'll use a range or  choice of values.

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb?name=search-space)]


Now that you've defined the parameters, run the sweep

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb?name=configure-sweep)]

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb?name=run-sweep)]


As seen above, the `sweep` function allows user to configure the following key aspects:

* `sampling_algorithm`- The hyperparameter sampling algorithm to use over the search_space. Allowed values are `random`, `grid` and `bayesian`.
* `objective` - the objective of the sweep
  * `primary_metric` - The name of the primary metric reported by each trial job. The metric must be logged in the user's training script using `mlflow.log_metric()` with the same corresponding metric name.
  * `goal` - The optimization goal of the objective.primary_metric. The allowed values are `maximize` and `minimize`.
* `compute` - Name of the compute target to execute the job on.
* `limits` - Limits for the sweep job

Once this job completes, you can look at the metrics and the job details in the [Azure ML Portal](https://ml.azure.com/). The job details page will identify the best performing child run.

:::image type="content" source="media/how-to-train-sdk/sweep-best-run.jpg" alt-text="Best run of the sweep":::
 
## Distributed training

Azure Machine Learning supports PyTorch, TensorFlow, and MPI-based distributed training. Let us look at how to configure a command for distribution for the `command_job` you created earlier

```python
# Distribute using PyTorch
from azure.ai.ml import PyTorchDistribution
command_job.distribution = PyTorchDistribution(process_count_per_instance=4)

# Distribute using TensorFlow
from azure.ai.ml import TensorFlowDistribution
command_job.distribution = TensorFlowDistribution(parameter_server_count=1, worker_count=2)

# Distribute using MPI
from azure.ai.ml import MpiDistribution
job.distribution = MpiDistribution(process_count_per_instance=3)
```

## Next steps

Try these next steps to learn how to use the Azure Machine Learning SDK (v2) for Python:

* Use pipelines with the Azure ML Python SDK (v2)
