---
title: MLflow Tracking for ML experiments
titleSuffix: Azure Machine Learning
description:  Set up MLflow with Azure Machine Learning to log metrics and artifacts from ML models, and deploy your ML models as a web service.
services: machine-learning
author: shivp950
ms.author: shipatel
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.date: 09/08/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python
---

# Track model metrics and deploy ML models with MLflow and Azure Machine Learning (preview)

This article demonstrates how to enable MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api), to connect your MLflow experiments and Azure Machine Learning. 

With Azure Machine Learning native support for MLflow you can,

+ Track and log experiment metrics and artifacts in your [Azure Machine Learning workspace](https://docs.microsoft.com/azure/machine-learning/concept-azure-machine-learning-architecture#workspaces). If you already use MLflow Tracking for your experiments, the workspace provides a centralized, secure, and scalable location to store training metrics and models.

+ Submit training jobs with MLflow Projects with Azure Machine Learning backend support (preview). You can submit jobs locally with Azure Machine Learning tracking or migrate your runs to the cloud like via an [Azure Machine Learning Compute](https://docs.microsoft.com/azure/machine-learning/how-to-create-attach-compute-sdk#amlcompute).

+ Track and manage models in MLflow and Azure ML model registry.

+ Deploy your MLflow experiments as an Azure Machine Learning web service. By deploying as a web service, you can apply the Azure Machine Learning monitoring and data drift detection functionalities to your production models. 

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. MLFlow Tracking is a component of MLflow that logs and tracks your training run metrics and model artifacts, no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine, or an Azure Databricks cluster. 

>[!NOTE]
> As an open source library, MLflow changes frequently. As such, the functionality made available via the Azure Machine Learning and MLflow integration should be considered as a preview, and not fully supported by Microsoft.

The following diagram illustrates that with MLflow Tracking, you track an experiment's run metrics and store model artifacts in your Azure Machine Learning workspace.

![mlflow with azure machine learning diagram](./media/how-to-use-mlflow/mlflow-diagram-track.png)

> [!TIP]
> The information in this document is primarily for data scientists and developers who want to monitor the model training process. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Compare MLflow and Azure Machine Learning clients

The below table summarizes the different clients that can use Azure Machine Learning, and their respective function capabilities.

MLflow Tracking offers metric logging and artifact storage functionalities that are only otherwise available via the [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

| Capability | MLflow&nbsp;Tracking & Deployment | Azure Machine Learning Python SDK |  Azure Machine Learning CLI | Azure Machine Learning studio|
|---|---|---|---|---|
| Manage workspace |   | ✓ | ✓ | ✓ |
| Use data stores  |   | ✓ | ✓ | |
| Log metrics      | ✓ | ✓ |   | |
| Upload artifacts | ✓ | ✓ |   | |
| View metrics     | ✓ | ✓ | ✓ | ✓ |
| Manage compute   |   | ✓ | ✓ | ✓ |
| Deploy models    | ✓ | ✓ | ✓ | ✓ |
|Monitor model performance||✓|  |   |
| Detect data drift |   | ✓ |   | ✓ |

## Prerequisites

* [Install MLflow.](https://mlflow.org/docs/latest/quickstart.html)
* [Install the Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py) on your local computer  The SDK provides the connectivity for MLflow to access your workspace.
* [Create an Azure Machine Learning Workspace](how-to-manage-workspace.md).

## Track local runs

MLflow Tracking with Azure Machine Learning lets you store the logged metrics and artifacts from your local runs into your Azure Machine Learning workspace.

Install the `azureml-mlflow` package to use MLflow Tracking with Azure Machine Learning on your experiments locally run in a Jupyter Notebook or code editor.

```shell
pip install azureml-mlflow
```

Import the `mlflow` and [`Workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py) classes to access MLflow's tracking URI and configure your workspace.

In the following code, the `get_mlflow_tracking_uri()` method assigns a unique tracking URI address to the workspace, `ws`, and `set_tracking_uri()` points the MLflow tracking URI to that address.

```Python
import mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

>[!NOTE]
>The tracking URI is valid up to an hour or less. If you restart your script after some idle time, use the get_mlflow_tracking_uri API to get a new URI.

Set the MLflow experiment name with `set_experiment()` and start your training run with `start_run()`. Then use `log_metric()` to activate the MLflow logging API and begin logging your training run metrics.

```Python
experiment_name = 'experiment_with_mlflow'
mlflow.set_experiment(experiment_name)

with mlflow.start_run():
    mlflow.log_metric('alpha', 0.03)
```

## Track remote runs

MLflow Tracking with Azure Machine Learning lets you store the logged metrics and artifacts from your remote runs into your Azure Machine Learning workspace.

Remote runs let you train your models on more powerful computes, such as GPU enabled virtual machines, or Machine Learning Compute clusters. See [Use compute targets for model training](how-to-set-up-training-targets.md) to learn about different compute options.

Configure your compute and training run environment with the [`Environment`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) class. Include `mlflow` and `azureml-mlflow` pip packages in environment's [`CondaDependencies`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py) section. Then construct  [`ScriptRunConfig`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig?view=azure-ml-py) with your remote compute as the compute target.

```Python
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core import ScriptRunConfig

exp = Experiment(workspace = 'my_workspace',
                 name='my_experiment')

mlflow_env = Environment(name='mlflow-env')

cd = CondaDependencies.create(pip_packages=['mlflow', 'azureml-mlflow'])

mlflow_env.python.conda_dependencies = cd

src = ScriptRunConfig(source_directory='./my_script_location', script='my_training_script.py')

src.run_config.target = 'my-remote-compute-compute'
src.run_config.environment = mlflow_env
```

In your training script, import `mlflow` to use the MLflow logging APIs, and start logging your run metrics.

```Python
import mlflow

with mlflow.start_run():
    mlflow.log_metric('example', 1.23)
```

With this compute and training run configuration, use the `Experiment.submit('train.py')` method to submit a run. This method automatically sets the MLflow tracking URI and directs the logging from MLflow to your Workspace.

```Python
run = exp.submit(src)
```

## Train with MLflow Projects (preview)

[MLflow Projects](https://mlflow.org/docs/latest/projects.html) are a convention for organizing and describing your code to let other data scientists (or automated tools) run it. MLflow Projects with Azure Machine Learning enables you to track and manage your training runs in your workspace. 

This example shows how to submit MLflow projects locally with Azure Machine Learning tracking.

As mentioned in the previous sections, install the `azureml-mlflow` package to use MLflow Tracking with Azure Machine Learning on your experiments locally run in a Jupyter Notebook or code editor.

```shell
pip install azureml-mlflow
```

Import the `mlflow` and [`Workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py) classes to access MLflow's tracking URI and configure your workspace.

```Python
import mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

Set the MLflow experiment name with `set_experiment()` and start your training run with `start_run()`. Then use `log_metric()` to activate the MLflow logging API and begin logging your training run metrics.

```Python
experiment_name = 'experiment-with-mlflow-projects'
mlflow.set_experiment(experiment_name)
```

Create the backend configuration object to store necessary information for the integration such as, the compute target and which type of managed environment to use.

```
backend_config = {"USE_CONDA": False}
```
Add the `azureml-mlflow` package as a pip dependency to your environment configuration file in order to track metrics and key artifacts in your workspace. 

```
name: mlflow-example
channels:
  - defaults
  - anaconda
  - conda-forge
dependencies:
  - python=3.6
  - scikit-learn=0.19.1
  - pip
  - pip:
    - mlflow
    - azureml-mlflow
```
Submit it the local run and ensure you set the parameter `backend = "azureml" `. View your runs and metrics in the [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md). 

```
local_env_run = mlflow.projects.run(uri=".", 
                                    parameters={"alpha":0.3},
                                    backend = "azureml",
                                    use_conda=False,
                                    backend_config = backend_config, 
                                    )

```

## Track Azure Databricks runs

MLflow Tracking with Azure Machine Learning lets you store the logged metrics and artifacts from your Azure Databricks runs in your Azure Machine Learning workspace.

To run your Mlflow experiments with Azure Databricks, you need to first create an [Azure Databricks workspace and cluster](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal). In your cluster, be sure to install the *azureml-mlflow* library from PyPi, to ensure that your cluster has access to the necessary functions and classes.

From here, import your experiment notebook, attach it to your Azure Databricks cluster and run your experiment. 

### Install libraries

To install libraries on your cluster, navigate to the **Libraries** tab and click **Install New**

 ![mlflow with azure databricks](./media/how-to-use-mlflow/azure-databricks-cluster-libraries.png)

In the **Package** field, type azureml-mlflow and then click install. Repeat this step as necessary to install other additional packages to your cluster for your experiment.

 ![Azure DB install mlflow library](./media/how-to-use-mlflow/install-libraries.png)

### Set up your notebook and workspace

Once your cluster is set up, import your experiment notebook, open it and attach your cluster to it.

The following code should be in your experiment notebook. This code gets the details of your Azure subscription to instantiate your workspace. This code assumes you have an existing resource group and Azure Machine Learning workspace, otherwise you can [create them](how-to-manage-workspace.md). 

```python
import mlflow
import mlflow.azureml
import azureml.mlflow
import azureml.core

from azureml.core import Workspace
from azureml.mlflow import get_portal_url

subscription_id = 'subscription_id'

# Azure Machine Learning resource group NOT the managed resource group
resource_group = 'resource_group_name' 

#Azure Machine Learning workspace name, NOT Azure Databricks workspace
workspace_name = 'workspace_name'  

# Instantiate Azure Machine Learning workspace
ws = Workspace.get(name=workspace_name,
                   subscription_id=subscription_id,
                   resource_group=resource_group)
```

#### Connect your Azure Databricks and Azure Machine Learning workspaces

On the [Azure portal](https://ms.portal.azure.com), you can link your Azure Databricks (ADB) workspace to a new or existing Azure Machine Learning workspace. To do so, navigate to your ADB workspace and select the **Link Azure Machine Learning workspace** button on the bottom right. Linking your workspaces enables you to track your experiment data in the Azure Machine Learning workspace. 

### Link MLflow tracking to your workspace

After you instantiate your workspace, set the MLflow tracking URI. By doing so, you link the MLflow tracking to Azure Machine Learning workspace. After linking, all your experiments will land in the managed Azure Machine Learning tracking service.

#### Directly set MLflow Tracking in your notebook

```python
uri = ws.get_mlflow_tracking_uri()
mlflow.set_tracking_uri(uri)
```

In your training script, import mlflow to use the MLflow logging APIs, and start logging your run metrics. The following example, logs the epoch loss metric. 

```python
import mlflow 
mlflow.log_metric('epoch_loss', loss.item()) 
```

#### Automate setting MLflow Tracking

Instead of manually setting the tracking URI in every subsequent experiment notebook session on your clusters, do so automatically using this [Azure Machine Learning Tracking Cluster Init script](https://github.com/Azure/MachineLearningNotebooks/blob/3ce779063b000e0670bdd1acc6bc3a4ee707ec13/how-to-use-azureml/azure-databricks/linking/README.md).

When configured correctly, you are able to see your MLflow tracking data in the Azure Machine Learning REST API and all clients, and in Azure Databricks via the MLflow user interface or by using the MLflow client.

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are kept in your workspace. To view them anytime, navigate to your workspace and find the experiment by name in your workspace in [Azure Machine Learning studio](https://ml.azure.com).  Or run the below code. 

```python
run.get_metrics()
ws.get_details()
```

## Register and track your models in the AzureML model registry 
AzureML model registry supports the MLflow model registry. AzureML models are aligned with the MLflow model schema making it easy to export and import these models across different workflows. The MLflow related metadata such as run id is also tagged with the registered model for traceability. Users can submit training runs and register and deploy models produced from MLflow runs. To register a model from a run, use the following steps:

Once the run is complete call the following method

```python
# the model folder produced from the run will be registered. This includes the MLmodel file, model.pkl and the conda.yaml.
run.register_model(model_name = 'my-model', model_path = 'model')
```
You can view the registered in your workspace with MLflow tracking metadata tagged. 

![registered-mlflow-model](.media/...)

When you select the artifacts tab at the top, you can see all the model files that align with the MLflow model schema (conda.yaml, MLmodel, model.pkl).

![model-schema](.media/...)

Here you can see an example MLmodel file that was generated by the run.

![MLmodel-schema](.media/..)


To deploy and register a model in one step, refer to the section below. 

## Deploy and register MLflow models 

Deploying your MLflow experiments as an Azure Machine Learning web service allows you to leverage and apply the Azure Machine Learning model management and data drift detection capabilities to your production models.

To do so,

1. [Save your model](#save-your-model).
1. Determine which deployment configuration you want to use for your scenario.

    1. [Azure Container Instance (ACI)](#deploy-to-aci) is a suitable choice for a quick dev-test deployment.
    1. [Azure Kubernetes Service (AKS)](#deploy-to-aks) is suitable for scalable production deployments.

The following diagram demonstrates that with the MLflow deploy API you can deploy your existing MLflow models as an Azure Machine Learning web service, despite their frameworks--PyTorch, Tensorflow, scikit-learn, ONNX, etc., and manage your production models in your workspace.

![ deploy mlflow models with azure machine learning](./media/how-to-use-mlflow/mlflow-diagram-deploy.png)


### Deploy to ACI

Set up your deployment configuration with the [deploy_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none-) method. You can also add tags and descriptions to help keep track of your web service. Set your model path to the model folder generated by your runs.

```python
from azureml.core.webservice import AciWebservice, Webservice

# Set the model path to the model folder created by your run
model_path = "model"

# Configure 
aci_config = AciWebservice.deploy_configuration(cpu_cores=1, 
                                                memory_gb=1, 
                                                tags={'method' : 'sklearn'}, 
                                                description='Diabetes model',
                                                location='eastus2')
```

Then, register and deploy the model in one step with the Azure Machine Learning SDK [deploy](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) method. 

```python
(webservice,model) = mlflow.azureml.deploy( model_uri='runs:/{}/{}'.format(run.id, model_path),
                      workspace=ws,
                      model_name='sklearn-model', 
                      service_name='diabetes-model-1', 
                      deployment_config=aci_config, 
                      tags=None, mlflow_home=None, synchronous=True)

webservice.wait_for_deployment(show_output=True)
```

### Deploy to AKS

To deploy to AKS, first create an AKS cluster. Create an AKS cluster using the [ComputeTarget.create()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.computetarget?view=azure-ml-py#create-workspace--name--provisioning-configuration-) method. It may take 20-25 minutes to create a new cluster.

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Use the default configuration (can also provide parameters to customize)
prov_config = AksCompute.provisioning_configuration()

aks_name = 'aks-mlflow'

# Create the cluster
aks_target = ComputeTarget.create(workspace=ws, 
                                  name=aks_name, 
                                  provisioning_configuration=prov_config)

aks_target.wait_for_completion(show_output = True)

print(aks_target.provisioning_state)
print(aks_target.provisioning_errors)
```

Set up your deployment configuration with the [deploy_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none-) method. You can also add tags and descriptions to help keep track of your web service.

```python
from azureml.core.webservice import Webservice, AksWebservice

# Set the web service configuration (using default here with app insights)
aks_config = AksWebservice.deploy_configuration(enable_app_insights=True, compute_target_name='aks-mlflow')

```

Then, register and deploy the model in one step with the Azure Machine Learning SDK [deploy](/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) method. 

```python

# Webservice creation using single command
from azureml.core.webservice import AksWebservice, Webservice

# set the model path 
model_path = "model"

(webservice, model) = mlflow.azureml.deploy( model_uri='runs:/{}/{}'.format(run.id, model_path),
                      workspace=ws,
                      model_name='sklearn-model', 
                      service_name='my-aks', 
                      deployment_config=aks_config, 
                      tags=None, mlflow_home=None, synchronous=True)


webservice.wait_for_deployment()
```

The service deployment can take several minutes.

## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, the ability to delete them individually is currently unavailable. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

   ![Delete in the Azure portal](./media/how-to-use-mlflow/delete-resources.png)

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

## Example notebooks

The [MLflow with Azure ML notebooks](https://aka.ms/azureml-mlflow-examples) demonstrate and expand upon concepts presented in this article.

## Next steps
* [Manage your models](concept-model-management-and-deployment.md).
* Monitor your production models for [data drift](how-to-monitor-data-drift.md).
