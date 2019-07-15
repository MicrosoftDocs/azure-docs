---
title: Use MLflow with Azure Machine Learning service
titleSuffix: Azure Machine Learning service
description:  Log metrics and artifacts and deploy models to production using MLflow with Azure Machine Learning service. 
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.topic: conceptual
ms.date: 07/15/2019
ms.custom: seodec18
---

# Track metrics and deploy models with MLflow and Azure Machine Learning service (Preview)

This article demonstrates how to enable MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api), with Azure Machine Learning service. Doing so enables you to:

+ Track and log your experiment metrics and artifacts in your [Azure Machine Learning service workspace](https://docs.microsoft.com/azure/machine-learning/service/concept-azure-machine-learning-architecture#workspaces). If you already use MLflow Tracking for your experiments, the workspace provides a centralized, secure, and scalable location to store your training metrics and models.

+ Deploy your MLflow experiments as an Azure Machine Learning web service. By deploying as a web service, you can apply the Azure Machine Learning monitoring and data drift detection functionalities to your production models. 

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. MLFlow Tracking is a component of MLflow that logs and tracks your training run metrics and model artifacts, no matter your experiment's environment--locally, on a virtual machine, remote compute cluster, even on Azure Databricks.

![mlflow with azure machine learning diagram](media/how-to-use-mlflow/mlflow-diagram-track.png)

## Compare MLflow and Azure Machine Learning clients

 The below table summarizes the different clients that can use Azure Machine Learning service, and their respective function capabilities.

 MLflow Tracking offers metric logging and artifact storage functionalities that are only otherwise available via the [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

| | MLflow Tracking & Deployment | Azure Machine Learning <br> Python SDK |  Azure Machine Learning <br> CLI | Azure portal|
|-|-|-|-|-|-|
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
* [Install the Azure Machine Learning Python SDK on your local computer and create an Azure Machine Learning Workspace](setup-create-workspace.md#sdk). The SDK provides the connectivity for MLflow to access your workspace.

## Track experiment runs

MLflow Tracking with Azure Machine Learning service lets you store the logged metrics and artifacts from your local and remote runs into your Azure Machine Learning workspace.

### Local runs

Install the `azureml-contrib-run` package to use MLflow Tracking with Azure Machine Learning on your experiments locally run in a Jupyter Notebook or code editor.

```shell
pip install azureml-contrib-run
```

>[!NOTE]
>The azureml.contrib namespace changes frequently, as we work to improve the service. As such, anything in this namespace should be considered as a preview, and not fully supported by Microsoft.

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
experiment_name = "experiment_with_mlflow"
mlflow.set_experiment(experiment_name)

with mlflow.start_run():
    mlflow.log_metric('alpha', 0.03)
```

### Remote runs

Remote runs let you train your models on more powerful computes, such as GPU enabled virtual machines, or Machine Learning Compute clusters. See [Set up compute targets for model training](how-to-set-up-training-targets.md) to learn about different compute options.

Configure your compute and training run environment with the [`Environment`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) class. Include `mlflow` and `azure-contrib-run` pip packages in environment's [`CondaDependencies`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py) section. Then construct  [`ScriptRunConfig`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig?view=azure-ml-py) with your remote compute as the compute target.

```Python
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core import ScriptRunConfig

exp = Experiment(workspace = "my_workspace",
                 name = "my_experiment")

mlflow_env = Environment(name="mlflow-env")

cd = CondaDependencies.create(pip_packages = ["mlflow", "azureml-contrib-run"])

mlflow_env.python.conda_dependencies=cd

src = ScriptRunConfig(source_directory="./my_script_location", script="my_training_script.py")

src.run_config.target = "my-remote-compute-compute"
src.run_config.environment = mlflow_env
```

In your training script, import `mlflow` to use the MLflow logging APIs, and start logging your run metrics.

```Python
import mlflow

with mlflow.start_run():
    mlflow.log_metric("example", 1.23)
```

With this compute and training run configuration, use the `Experiment.submit("train.py")` method to submit a run. This automatically sets the MLflow tracking URI and directs the logging from MLflow to your Workspace.

```Python
run = exp.submit(src)
```

### MLflow with Azure Databricks runs

To run your Mlflow experiments with Azure Databricks, you need to first create an [Azure Databricks workspace and cluster](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal). 
In your cluster, be sure to install the *azureml-mlflow* library from PyPi, to ensure that your cluster has access to the necessary functions and classes.

#### Install libraries

To install libraries on your cluster, navigate to the **Libraries** tab and click **Install New**

 ![mlflow with azure machine learning diagram](media/how-to-use-mlflow/azure-databricks-cluster-libraries.png)

In the **Package** field, type azureml-mlflow and then click install. Repeat this step as necessary to install other additional packages to your cluster for your experiment.

 ![mlflow with azure machine learning diagram](media/how-to-use-mlflow/install-libraries.png)

#### Notebook and workspace set-up

Once your cluster is set up, import your experiment notebook, open it and attach your cluster to it.

The following code should be in your experiment notebook. This gets the details of your Azure subscription to instantiate your workspace. This assumes you have an existing resource group and Azure Machine Learning workspace, otherwise you can [create them](setup-create-workspace.md#portal). 

```python
import mlflow
import mlflow.azureml
import azureml.mlflow
import azureml.core

from azureml.core import Workspace
from azureml.mlflow import get_portal_url

subscription_id = "subscription_id"

# Azure Machine Learning resource group NOT the managed resource group
resource_group = "resource_group_name" 

#Azure Machine Learning workspace name, NOT Azure Databricks workspace
workspace_name = "workspace_name"  

# Instantiate Azure Machine Learning workspace
ws = Workspace.get(name = workspace_name,
                   subscription_id = subscription_id,
                   resource_group = resource_group)

```
#### Set MLflow tracking URI
After you instantiate your workspace, set the MLflow tracking URI. By doing so, you link the MLflow tracking to Azure Machine Learning workspace. After this, all your experiments will land in the managed Azure Machine Learning tracking service.

```python
uri = ws.get_mlflow_tracking_uri()
mlflow.set_tracking_uri(uri)
```

In your training script, import mlflow to use the MLflow logging APIs, and start logging your run metrics. The following example, logs the epoch loss metric. 

```python
import mlflow 
mlflow.log_metric("epoch_loss", loss.item()) 
```

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are kept in your workspace. To view them anytime, navigate to your workspace and find the experiment by name on the [Azure portal](https://portal.azure.com) or by running the below code. 

```python
run.get_metrics()
ws.get_details()
```

## Deploy MLflow models as a web service

Deploying your MLflow experiments as an Azure Machine Learning web service allows you to leverage the Azure Machine Learning model management and data drift detection capabilities and apply them to your production models.

![mlflow with azure machine learning diagram](media/how-to-use-mlflow/mlflow-diagram-deploy.png)

### Log your model
Before we can deploy, be sure that your model is saved so you can reference it and its path location for deployment. In your training script, there should be code similar to the following [mlflow.sklearn.log_model()](https://www.mlflow.org/docs/latest/python_api/mlflow.sklearn.html) method, that saves your model to the specified outputs directory. 

```python
# change sklearn to pytorch, tensorflow, etc. based on your experiment's framework 
import mlflow.sklearn

# Save the model to the outputs directory for capture
mlflow.sklearn.log_model(regression_model, model_save_path)
```
>[!NOTE]
> Include the `conda_env` parameter to pass a dictionary representation of the dependencies and environment this model should be run in.

### Retrieve model from previous run

To retrieve the desired run we need the run ID and the path in run history of where the model was saved. 

```python
# gets the list of runs for your experiment as an array
experiment_name = "experiment-with-mlflow"
exp = ws.experiments[experiment_name]
runs = list(exp.get_runs())

# get the run ID and the path in run history
runid = runs[0].id
model_save_path = "model"
```

### Create Docker image

The `mlflow.azureml.build_image()` function builds a Docker image from the saved model in a framework-aware manner. It automatically creates the framework-specific inferencing wrapper code and specifies package dependencies for you. Specify the model path, your workspace, run ID and other parameters.

In the following code, we build a docker image using *runs:/<run.id>/model* as the model_uri path for a Scikit-learn experiment.

```python
import mlflow.azureml

azure_image, azure_model = mlflow.azureml.build_image(model_uri="runs:/{}/{}".format(runid, model_save_path),
                                                      workspace=ws,
                                                      model_name='sklearn-model',
                                                      image_name='sklearn-image',
                                                      synchronous=True)
```
The creation of the Docker image can take several minutes. 

### Deploy the Docker image 

After the image is created, use the Azure Machine Learning SDK to deploy the image as a web service.

First, specify the deployment configuration. Azure Container Instance (ACI) is a suitable choice for a quick dev-test deployment, while Azure Kubernetes Service (AKS) is suitable for scalable production deployments.

#### Deploy to ACI

Set up your deployment configuration with the [deploy_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none-) method. You can also add tags and descriptions to help keep track of your web service.

```python
from azureml.core.webservice import AciWebservice, Webservice

# Configure 
aci_config = AciWebservice.deploy_configuration(cpu_cores=1, 
                                                memory_gb=1, 
                                                tags={"method" : "sklearn"}, 
                                                description='Diabetes model',
                                                location='eastus2')
```

Then, deploy the image using Azure Machine Learning SDK's [deploy_from_image()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice(class)?view=azure-ml-py#deploy-from-image-workspace--name--image--deployment-config-none--deployment-target-none-) method. 

```python
webservice = Webservice.deploy_from_image( image=azure_image, 
                                           workspace=ws, 
                                           name="diabetes-model-1", 
                                           deployment_config=aci_config)

webservice.wait_for_deployment(show_output=True)
```
#### Deploy to AKS

To deploy to AKS you need to create an AKS cluster and bring over the Docker image you want to deploy. For this example, we bring over the previously created image from our ACI deployment.

To get the image from the previous ACI deployment we use the [Image](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.image.image?view=azure-ml-py) class. 

```python
from azureml.core.image import Image

# Get the image by name, you can change this based on the image you want to deploy
myimage = Image(workspace=ws, name="sklearn-image") 
```

Create AKS compute it may take 20-25 minutes to create a new cluster

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Use the default configuration (can also provide parameters to customize)
prov_config = AksCompute.provisioning_configuration()

aks_name = 'aks-mlflow' 

# Create the cluster
aks_target = ComputeTarget.create(workspace = ws, 
                                  name = aks_name, 
                                  provisioning_configuration = prov_config)

aks_target.wait_for_completion(show_output = True)

print(aks_target.provisioning_state)
print(aks_target.provisioning_errors)
```
Set up your deployment configuration with the [deploy_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none-) method. You can also add tags and descriptions to help keep track of your web service.

```python
from azureml.core.webservice import Webservice, AksWebservice
from azureml.core.image import ContainerImage

#Set the web service configuration (using default here with app insights)
aks_config = AksWebservice.deploy_configuration(enable_app_insights=True)

#unique service name
service_name ='aks-service'
```

Then, deploy the image using Azure Machine Learning SDK's [deploy_from_image()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice(class)?view=azure-ml-py#deploy-from-image-workspace--name--image--deployment-config-none--deployment-target-none-) method. 

```python
# Webservice creation using single command
aks_service = Webservice.deploy_from_image( workspace=ws, 
                                            name=service_name,
                                            deployment_config = aks_config
                                            image = myimage,
                                            deployment_target = aks_target)

aks_service.wait_for_deployment(show_output=True)
```

The service deployment can take several minutes.

## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, the ability to delete them individually is currently unavailable. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

   ![Delete in the Azure portal](media/how-to-use-mlflow/delete-resources.png)

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.


## Example notebooks

The [MLflow with Azure ML notebooks](https://aka.ms/azureml-mlflow-examples) demonstrate and expand upon concepts presented in this article.

## Next steps
* [Manage your models](concept-model-management-and-deployment.md)
* Monitor your production models for [data drift](how-to-monitor-data-drift.md).