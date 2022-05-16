---
title: MLflow Tracking for models
titleSuffix: Azure Machine Learning
description:  Set up MLflow Tracking with Azure Machine Learning to log metrics and artifacts from ML models.
services: machine-learning
author: blackmist
ms.author: larryfr
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/21/2021
ms.topic: how-to
ms.custom: devx-track-python, mlflow
---

# Track ML models with MLflow and Azure Machine Learning

In this article, learn how to enable MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api), to connect Azure Machine Learning as the backend of your MLflow experiments. 

> [!TIP]
> For a more streamlined experience, see how to [Track experiments with the MLflow SDK or the Azure Machine Learning CLI (v2) (preview)](how-to-use-mlflow-cli-runs.md)

Supported capabilities include: 

+ Track and log experiment metrics and artifacts in your [Azure Machine Learning workspace](./concept-azure-machine-learning-architecture.md#workspace). If you already use MLflow Tracking for your experiments, the workspace provides a centralized, secure, and scalable location to store training metrics and models.

+ [Submit training jobs with MLflow Projects with Azure Machine Learning backend support (preview)](how-to-train-mlflow-projects.md). You can submit jobs locally with Azure Machine Learning tracking or migrate your runs to the cloud like via an [Azure Machine Learning Compute](how-to-create-attach-compute-cluster.md).

+ Track and manage models in MLflow and Azure Machine Learning model registry.

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. MLflow Tracking is a component of MLflow that logs and tracks your training run metrics and model artifacts, no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine, or an [Azure Databricks cluster](how-to-use-mlflow-azure-databricks.md). 

See [MLflow and Azure Machine Learning](concept-mlflow.md) for additional MLflow and Azure Machine Learning functionality integrations.

The following diagram illustrates that with MLflow Tracking, you track an experiment's run metrics and store model artifacts in your Azure Machine Learning workspace.

![mlflow with azure machine learning diagram](./media/how-to-use-mlflow/mlflow-diagram-track.png)

> [!TIP]
> The information in this document is primarily for data scientists and developers who want to monitor the model training process. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

> [!NOTE] 
> You can use the [MLflow Skinny client](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst) which is a lightweight MLflow package without SQL storage, server, UI, or data science dependencies. This is recommended for users who primarily need the tracking and logging capabilities without importing the full suite of MLflow features including deployments. 

## Prerequisites

* Install the `azureml-mlflow` package. 
    * This package automatically brings in `azureml-core` of the [The Azure Machine Learning Python SDK](/python/api/overview/azure/ml/install), which provides the connectivity for MLflow to access your workspace.
* [Create an Azure Machine Learning Workspace](how-to-manage-workspace.md).
    * See which [access permissions you need to perform your MLflow operations with your workspace](how-to-assign-roles.md#mlflow-operations).

## Track local runs

MLflow Tracking with Azure Machine Learning lets you store the logged metrics and artifacts runs that were executed on your local machine into your Azure Machine Learning workspace. 

### Set up tracking environment

To track a local run, you need to point your local machine to the Azure Machine Learning MLflow Tracking URI. 

Import the `mlflow` and [`Workspace`](/python/api/azureml-core/azureml.core.workspace%28class%29) classes to access MLflow's tracking URI and configure your workspace.

In the following code, the `get_mlflow_tracking_uri()` method assigns a unique tracking URI address to the workspace, `ws`, and `set_tracking_uri()` points the MLflow tracking URI to that address.

```Python
import mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

### Set experiment name

All MLflow runs are logged to the active experiment, which can be set with the MLflow SDK or Azure CLI. 

Set the MLflow experiment name with [`set_experiment()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.set_experiment) command.

```Python
experiment_name = 'experiment_with_mlflow'
mlflow.set_experiment(experiment_name)
```

### Start training run

After you set the MLflow experiment name, you can start your training run with `start_run()`. Then use `log_metric()` to activate the MLflow logging API and begin logging your training run metrics.

```Python
import os
from random import random

with mlflow.start_run() as mlflow_run:
    mlflow.log_param("hello_param", "world")
    mlflow.log_metric("hello_metric", random())
    os.system(f"echo 'hello world' > helloworld.txt")
    mlflow.log_artifact("helloworld.txt")
```

## Track remote runs

Remote runs let you train your models on more powerful computes, such as GPU enabled virtual machines, or Machine Learning Compute clusters. See [Use compute targets for model training](how-to-set-up-training-targets.md) to learn about different compute options.

MLflow Tracking with Azure Machine Learning lets you store the logged metrics and artifacts from your remote runs into your Azure Machine Learning workspace. Any run with MLflow Tracking code in it will have metrics logged automatically to the workspace. 

First, you should create a `src` subdirectory and create a file with your training code in a `train.py` file in the `src` subdirectory. All your training code will go into the `src` subdirectory, including `train.py`.

The training code is taken from this [MLflow example](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/basics/src/hello-mlflow.py) in the Azure Machine Learning example repo. 

Copy this code into the file:

```Python
# imports
import os
import mlflow

from random import random

# define functions
def main():
    mlflow.log_param("hello_param", "world")
    mlflow.log_metric("hello_metric", random())
    os.system(f"echo 'hello world' > helloworld.txt")
    mlflow.log_artifact("helloworld.txt")


# run functions
if __name__ == "__main__":
    # run main function
    main()
```

Load training script to submit an experiement.

```Python
script_dir = "src"
training_script = 'train.py'
with open("{}/{}".format(script_dir,training_script), 'r') as f:
    print(f.read())
```

In your script, configure your compute and training run environment with the [`Environment`](/python/api/azureml-core/azureml.core.environment.environment) class. 

```Python
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies

env = Environment(name="mlflow-env")

# Specify conda dependencies with scikit-learn and temporary pointers to mlflow extensions
cd = CondaDependencies.create(
    conda_packages=["scikit-learn", "matplotlib"],
    pip_packages=["azureml-mlflow", "pandas", "numpy"]
    )

env.python.conda_dependencies = cd
```

Then, construct  [`ScriptRunConfig`](/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig) with your remote compute as the compute target.

```Python
from azureml.core import ScriptRunConfig

src = ScriptRunConfig(source_directory="src",
                      script=training_script,
                      compute_target="<COMPUTE_NAME>",
                      environment=env)
```

With this compute and training run configuration, use the `Experiment.submit()` method to submit a run. This method automatically sets the MLflow tracking URI and directs the logging from MLflow to your Workspace.

```Python
from azureml.core import Experiment
from azureml.core import Workspace
ws = Workspace.from_config()

experiment_name = "experiment_with_mlflow"
exp = Experiment(workspace=ws, name=experiment_name)

run = exp.submit(src)
```

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are tracked in your workspace. To view them anytime, navigate to your workspace and find the experiment by name in your workspace in [Azure Machine Learning studio](https://ml.azure.com).  Or run the below code. 

Retrieve run metric using MLflow [get_run()](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.get_run).

```Python
from mlflow.entities import ViewType
from mlflow.tracking import MlflowClient

# Retrieve run ID for the last run experiement
current_experiment=mlflow.get_experiment_by_name(experiment_name)
runs = mlflow.search_runs(experiment_ids=current_experiment.experiment_id, run_view_type=ViewType.ALL)
run_id = runs.tail(1)["run_id"].tolist()[0]

# Use MlFlow to retrieve the run that was just completed
client = MlflowClient()
finished_mlflow_run = MlflowClient().get_run(run_id)

metrics = finished_mlflow_run.data.metrics
tags = finished_mlflow_run.data.tags
params = finished_mlflow_run.data.params

print(metrics,tags,params)
```

### Retrieve artifacts with MLFLow

To view the artifacts of a run, you can use [MlFlowClient.list_artifacts()](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.list_artifacts)

```Python
client.list_artifacts(run_id)
```

To download an artifact to the current directory, you can use [MLFlowClient.download_artifacts()](https://www.mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.download_artifacts)

```Python
client.download_artifacts(run_id, "helloworld.txt", ".")
```

### Compare and query

Compare and query all MLflow runs in your Azure Machine Learning workspace with the following code. 
[Learn more about how to query runs with MLflow](https://mlflow.org/docs/latest/search-syntax.html#programmatically-searching-runs). 

```Python
from mlflow.entities import ViewType

all_experiments = [exp.experiment_id for exp in MlflowClient().list_experiments()]
query = "metrics.hello_metric > 0"
runs = mlflow.search_runs(experiment_ids=all_experiments, filter_string=query, run_view_type=ViewType.ALL)

runs.head(10)
```

## Automatic logging
With Azure Machine Learning and MLFlow, users can log metrics, model parameters and model artifacts automatically when training a model.  A [variety of popular machine learning libraries](https://mlflow.org/docs/latest/tracking.html#automatic-logging) are supported. 

To enable [automatic logging](https://mlflow.org/docs/latest/tracking.html#automatic-logging) insert the following code before your training code:

```Python
mlflow.autolog()
```

[Learn more about Automatic logging with MLflow](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.autolog). 

## Manage models 

Register and track your models with the [Azure Machine Learning model registry](concept-model-management-and-deployment.md#register-package-and-deploy-models-from-anywhere), which supports the MLflow model registry. Azure Machine Learning models are aligned with the MLflow model schema making it easy to export and import these models across different workflows. The MLflow related metadata such as, run ID is also tagged with the registered model for traceability. Users can submit training runs, register, and deploy models produced from MLflow runs. 

If you want to deploy and register your production ready model in one step, see [Deploy and register MLflow models](how-to-deploy-mlflow-models.md).

To register and view a model from a run, use the following steps:

1. Once a run is complete, call the [`register_model()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.register_model) method.

    ```Python
    # the model folder produced from a run is registered. This includes the MLmodel file, model.pkl and the conda.yaml.
    model_path = "model"
    model_uri = 'runs:/{}/{}'.format(run_id, model_path) 
    mlflow.register_model(model_uri,"registered_model_name")
    ```

1. View the registered model in your workspace with [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md).

    In the following example the registered model, `my-model` has MLflow tracking metadata tagged. 

    ![register-mlflow-model](./media/how-to-use-mlflow/registered-mlflow-model.png)

1. Select the **Artifacts** tab to see all the model files that align with the MLflow model schema (conda.yaml, MLmodel, model.pkl).

    ![model-schema](./media/how-to-use-mlflow/mlflow-model-schema.png)

1. Select MLmodel to see the MLmodel file generated by the run.

    ![MLmodel-schema](./media/how-to-use-mlflow/mlmodel-view.png)


## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, the ability to delete them individually is currently unavailable. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

   ![Delete in the Azure portal](./media/how-to-use-mlflow/delete-resources.png)

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

## Example notebooks

The [MLflow with Azure ML notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow) demonstrate and expand upon concepts presented in this article. Also see the community-driven repository, [AzureML-Examples](https://github.com/Azure/azureml-examples).

## Next steps

* [Deploy models with MLflow](how-to-deploy-mlflow-models.md).
* Monitor your production models for [data drift](./how-to-enable-data-collection.md).
* [Track Azure Databricks runs with MLflow](how-to-use-mlflow-azure-databricks.md).
* [Manage your models](concept-model-management-and-deployment.md).
