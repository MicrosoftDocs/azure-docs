---
title: Migrate to Azure Machine Learning, general availability
description: Learn how to upgrade or migrate to the latest version of Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: raymondl
author: raymondlaghaeian
ms.reviewer: larryfr
ms.date: 09/24/2018
---

# How to deploy web services from Azure Machine Learning service to Azure Kubernetes Service

For high-scale production scenarios, you can deploy your model to the Azure Kubernetes Service (AKS). Azure ML can use an existing AKS cluster or a new cluster you can provision during deployment.

Deploying to AKS provides auto-scaling, logging, model data collection, and fast response times for your web services. 

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure Machine Learning Workspace, a local project directory and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Portal quickstart](quickstart-get-started.md).

- A trained ML model. If you don't have one, see the [train image classification model](tutorial-train-models-with-aml.md) tutorial.

## Install libraries and initialize the workspace

Why do we need these specific imports?

```python
from azureml.coreazureml  import Workspace
from azureml.core.compute import AksCompute, ComputeTarget
from azureml.core.webservice import Webservice, AksWebservice
from azureml.core.image import Image
from azureml.core.model import Model
from azureml.core.workspace import Workspace

# Load existing workspace from the config file info.
ws = Workspace.from_config()
```

## Register the model

Register an existing trained model, add description and tags.

```python
from azureml.core.model import Model
model = Model.register(model_path = "model.pkl", # this points to a local file
                        model_name = "best_model", # this is the name the model is registered as
                        tags = ["diabetes", "regression"],
                        description = "Ridge regression model to predict diabetes",
                        workspace = ws)
```

## Create an image

The following code snippet demonstrates how to create an image using the registered model. The file `score.py` contains the scoring logic, and is included in the image. This file is used to run the model in the image.

```bash
from  azureml.core.imageazureml  import ContainerImage

# Image configuration
image_config = ContainerImage.image_configuration(execution_script = "score.py",
                                                    runtime = "python",
                                                    conda_file = "myenv.yml",
                                                    description = "Image with ridge regression model",
                                                    tags = ["diabetes","regression"]
                                                    )

# Create the image
image = ContainerImage.create(name = "myimage1",
                                # this is the model object
                                models = [model],
                                image_config = image_config,
                                workspace = ws)

# Wait for the create process to complete
image.wait_for_creation(show_output = True)
```

## Create the AKS Cluster

The following code snippet demonstrates how to create the AKS cluster:

> [!IMPORTANT]
> Creating the AKS cluster is a one time process for your workspace. Once created, you can reuse this cluster for multiple deployments. If you delete the cluster or the resource group that contains it, then you must create a new cluster the next time you need to deploy.

> [!NOTE]
> This process takes approximately 20 minutes.

```python
# Use the default configuration (can also provide parameters to customize)
prov_config = AksCompute.provisioning_configuration()

aks_name = 'aml-aks-1' 
# Create the cluster
aks_target = ComputeTarget.create(workspace = ws, 
                                    name = aks_name, 
                                    provisioning_configuration = prov_config)

# Wait for the create process to complete
aks_target.wait_for_provisioning(show_output = True)
print(aks_target.provisioning_state)
print(aks_target.provisioning_errors)
```

### Attach existing AKS cluster (optional)

If you have existing AKS cluster in your Azure subscription, you can use it to deploy your web service. The following code snippet demonstrates how to attach a cluster to your workspace.

```python
# Get the resource id from https://porta..azure.com -> Find your resource group -> click on the Kubernetes service -> Properties
resource_id = '/subscriptions/<your subscription id>/resourcegroups/<your resource group>/providers/Microsoft.ContainerService/managedClusters/<your aks service name>'

# Set to the name of the cluster
cluster_name='my-existing-aks' 

# Attatch the cluster to your workgroup
aks_target = AksCompute.attach(workspace=ws, name=cluster_name, resource_id=resource_id)

# Wait for the operation to complete
aks_target.wait_for_provisioning(True)
```

## Deploy your web service

The following code snippet demonstrates how to deploy the image to the cluster:

```python
# Set configuration and service name
aks_config = AksWebservice.deploy_configuration()
aks_service_name ='aks-service-1'
# Deploy from image
aks_service = Webservice.deploy_from_image(workspace = ws, 
                                            name = aks_service_name,
                                            image = image,
                                            deployment_config = aks_config,
                                            deployment_target = aks_target)
# Wait for the deployment to complete
aks_service.wait_for_deployment(show_output = True)
print(aks_service.state)
```

> [!TIP]
> If there are errors during deployment, use `aks_service.get_logs()` to view the AKS service logs. The logged information may indicate the cause of the error.

## Test the web service

You can use `aks_service.run()` to test the web service. The following code snippet demonstrates how to pass data to the service and display the prediction:

```python
import json

test_sample = json.dumps({'data': [
    [1,2,3,4,5,6,7,8,9,10], 
    [10,9,8,7,6,5,4,3,2,1]
]})
test_sample = bytes(test_sample,encoding = 'utf8')

prediction = aks_service.run(input_data = test_sample)
print(prediction)
```

## Cleanup

To delete the service, image, and model, use the following code snippet:

```python
aks_service.delete()
image.delete()
model.delete()
```
