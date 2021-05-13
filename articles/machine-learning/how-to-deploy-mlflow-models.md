---
title: Deploy MLflow models as web services
titleSuffix: Azure Machine Learning
description:  Set up MLflow with Azure Machine Learning to deploy your ML models as an Azure web service.
services: machine-learning
author: shivp950
ms.author: shipatel
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.date: 12/23/2020
ms.topic: how-to
ms.custom: devx-track-python
---

# Deploy MLflow models as Azure web services (preview)

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model as an Azure web service, so you can leverage and apply Azure Machine Learning's model management and data drift detection capabilities to your production models.

Azure Machine Learning offers deployment configurations for:
* Azure Container Instance (ACI) which is a suitable choice for a quick dev-test deployment.
* Azure Kubernetes Service (AKS) which is recommended for scalable production deployments.
> [!TIP]
> The information in this document is primarily for data scientists and developers who want to deploy their MLflow model to an Azure Machine Learning web service endpoint. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).
## MLflow with Azure Machine Learning deployment

MLflow is an open-source library for managing the life cycle of your machine learning experiments. Its integration with Azure Machine Learning allows for you to extend this management beyond model training to the deployment phase of your production model.

The following diagram demonstrates that with the MLflow deploy API and Azure Machine Learning, you can deploy models created with popular frameworks, like PyTorch, Tensorflow, scikit-learn, etc., as Azure web services and manage them in your workspace. 

![ deploy mlflow models with azure machine learning](./media/how-to-deploy-mlflow-models/mlflow-diagram-deploy.png)


>[!NOTE]
> As an open source library, MLflow changes frequently. As such, the functionality made available via the Azure Machine Learning and MLflow integration should be considered as a preview, and not fully supported by Microsoft.

## Prerequisites

* A machine learning model. If you don't have a trained model, find the notebook example that best fits your compute scenario in [this repo](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks/using-mlflow) and follow its instructions. 
* [Set up the MLflow Tracking URI to connect Azure Machine Learning](how-to-use-mlflow.md#track-local-runs).
* Install the `azureml-mlflow` package. 
    * This package automatically brings in `azureml-core` of the [The Azure Machine Learning Python SDK](/python/api/overview/azure/ml/install), which provides the connectivity for MLflow to access your workspace.
* See which [access permissions you need to perform your MLflow operations with your workspace](how-to-assign-roles.md#mlflow-operations). 

## Deploy to Azure Container Instance (ACI)

To deploy your MLflow model to an Azure Machine Learning web service, your model must be set up with the [MLflow Tracking URI to connect with Azure Machine Learning](how-to-use-mlflow.md). 

Set up your deployment configuration with the [deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none-) method. You can also add tags and descriptions to help keep track of your web service.

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

Then, register and deploy the model in one step with MLflow's [deploy](https://www.mlflow.org/docs/latest/python_api/mlflow.azureml.html#mlflow.azureml.deploy) method for Azure Machine Learning. 

```python
(webservice,model) = mlflow.azureml.deploy( model_uri='runs:/{}/{}'.format(run.id, model_path),
                      workspace=ws,
                      model_name='sklearn-model', 
                      service_name='diabetes-model-1', 
                      deployment_config=aci_config, 
                      tags=None, mlflow_home=None, synchronous=True)

webservice.wait_for_deployment(show_output=True)
```

## Deploy to Azure Kubernetes Service (AKS)

To deploy your MLflow model to an Azure Machine Learning web service, your model must be set up with the [MLflow Tracking URI to connect with Azure Machine Learning](how-to-use-mlflow.md). 

To deploy to AKS, first create an AKS cluster. Create an AKS cluster using the [ComputeTarget.create()](/python/api/azureml-core/azureml.core.computetarget#create-workspace--name--provisioning-configuration-) method. It may take 20-25 minutes to create a new cluster.

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
Set up your deployment configuration with the [deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none-) method. You can also add tags and descriptions to help keep track of your web service.

```python
from azureml.core.webservice import Webservice, AksWebservice

# Set the web service configuration (using default here with app insights)
aks_config = AksWebservice.deploy_configuration(enable_app_insights=True, compute_target_name='aks-mlflow')

```

Then, register and deploy the model in one step with MLflow's [deploy](https://www.mlflow.org/docs/latest/python_api/mlflow.azureml.html#mlflow.azureml.deploy) method for Azure Machine Learning. 

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

If you don't plan to use your deployed web service, use `service.delete()` to delete it from your notebook.  For more information, see the documentation for [WebService.delete()](/python/api/azureml-core/azureml.core.webservice%28class%29#delete--).

## Example notebooks

The [MLflow with Azure Machine Learning notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks/using-mlflow) demonstrate and expand upon concepts presented in this article.

> [!NOTE]
> A community-driven repository of examples using mlflow can be found at https://github.com/Azure/azureml-examples.

## Next steps

* [Manage your models](concept-model-management-and-deployment.md).
* Monitor your production models for [data drift](./how-to-enable-data-collection.md).
* [Track Azure Databricks runs with MLflow](how-to-use-mlflow-azure-databricks.md).

