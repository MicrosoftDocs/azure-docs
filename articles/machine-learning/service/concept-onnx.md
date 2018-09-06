---
title: ONNX for AI models with Azure Machine Learning service
description: Learn how to use ONNX and Azure Machine Learning together. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: prasantp
author: prasanthpul
ms.date: 09/24/2018
---

# Open and Interoperable AI

Microsoft is committed to open and interoperable AI. We aim to: 
* Enable data scientists to use the framework of their choice to create and train models 
* Enable developers to deploy models cross-platform with minimal integration work 

The Open Neural Network Exchange (ONNX) format is an open standard for representing machine learning models. ONNX is supported by a community of partners who create compatible frameworks and tools. Microsoft supports ONNX across its products including Azure and Windows. You can learn more about ONNX at http://onnx.ai. 

## Benefits of ONNX

Enabling interoperability makes it possible to get great ideas into production faster. With ONNX, data scientists can choose the framework they are comfortable with and thats fits the needs of the job. Developers can spend less time on converting models to be production-ready and be able to deploy across the cloud and edge.  

Frameworks like PyTorch, Chainer, Microsoft Cognitive Toolkit (CNTK), and MXNet support exporting ONNX format models. Converters exist for many other frameworks such as TensorFlow, Keras, and SciKit-Learn. There is also an ecosystem of tools for visualizing and accelerating ONNX models. A number of pre-trained ONNX models are also available for common scenarios.


Include a diagram with full model flow including AML training, deployment, and also Windows ML tools. Send a draft so that professional art resources can create something professional for you.

## Creating ONNX models in Azure

You can create ONNX models in several ways:
1. Obtain a pre-trained ONNX model from [Azure AI Model Gallery](https://gallery.azure.ai/models)
2. Generate a customized ONNX model from [Azure Custom Vision Service](https://docs.microsoft.com/en-us/azure/cognitive-services/Custom-Vision-Service/)
3. Convert a model you obtained from somewhere else using [WinMLTools](https://docs.microsoft.com/en-us/windows/ai/convert-model-winmltools)
4. Train a model in Azure Machine Learning services and convert or export it to ONNX - learn more with this [tutorial](http://aka.ms/aml-onnx-training-notebook)
 
Once you have an ONNX model, you can deploy it to Azure. You can also deploy the same ONNX model to Windows 10 devices using Windows ML - for more information, read "[Get ONNX models for Windows ML](https://docs.microsoft.com/en-us/windows/ai/)".

## Deploying ONNX models in Azure

Azure Machine Learning services enable you to deploy, manage, and monitor your ONNX models. Using the standard [deployment pipeline](https://docs.microsoft.com/en-us/azure/machine-learning/service/concept-model-management-and-deployment) and the ONNX Runtime you can create a REST endpoint hosted in the cloud.

Below is an example for deploying to AKS:

### Initialize the workspace

```python
from azureml.core import Workspace

ws = Workspace.from_config()
print(ws.name, ws.resource_group, ws.location, ws.subscription_id, sep = '\n')
```

### Register the model

```python
from azureml.core.model import Model

model = Model.register(model_path = "model.onnx",
                       model_name = "MyONNXmodel",
                       tags = ["onnx"],
                       description = "test",
                       workspace = ws)
```

### Create an image

The following code snippet demonstrates how to create an image using the registered model.

```python
from azureml.core.image import ContainerImage

image_config = ContainerImage.image_configuration(execution_script = "score.py",
                                                  runtime = "python",
                                                  conda_file = "myenv.yml",
                                                  description = "test",
                                                  tags = ["onnx"]
                                                 )

image = ContainerImage.create(name = "myonnxmodelimage",
                              # this is the model object
                              models = [model],
                              image_config = image_config,
                              workspace = ws)

image.wait_for_creation(show_output = True)


The file `score.py` contains the scoring logic and is included in the image. This file is used to run the model in the image. An example file for an ONNX model is shown below:

```python
import json
import numpy as np
import onnxruntime
import sys
from azureml.core.model import Model

def init():
    global model_path
    model_path = Model.get_model_path(model_name = 'MyONNXmodel')

# note you can pass in multiple rows for scoring
def run(raw_data):
    try:
        data = json.loads(raw_data)['data']
        data = np.array(data)
        
        sess = onnxruntime.InferenceSession(model_path)
        result = sess.run(["outY"], {"inX": data})
        
        return json.dumps({"result": result.tolist()})
    except Exception as e:
        result = str(e)
        return json.dumps({"error": result})
```

### Create the AKS Cluster

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

#### Attach existing AKS cluster (optional)

If you have existing AKS cluster in your Azure subscription, you can use it to deploy your web service. The following code snippet demonstrates how to attach a cluster to your workspace.

```python
# Get the resource id from https://portal.azure.com -> Find your resource group -> click on the Kubernetes service -> Properties
resource_id = '/subscriptions/<your subscription id>/resourcegroups/<your resource group>/providers/Microsoft.ContainerService/managedClusters/<your aks service name>'

# Set to the name of the cluster
cluster_name='my-existing-aks' 

# Attatch the cluster to your workgroup
aks_target = AksCompute.attach(workspace=ws, name=cluster_name, resource_id=resource_id)

# Wait for the operation to complete
aks_target.wait_for_provisioning(True)
```

### Deploy your web service

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

Your ONNX model is now hosted in the cloud and ready to be called!


Download [this Jupyter notebook](https://aka.ms/aml-onnx-notebook) to try it out for yourself. 

## Next steps

Learn more about ONNX or contribute to the project:
+ [ONNX.ai project website](http://ONNX.ai)
+ [ONNX code on GitHub](https://github.com/onnx/onnx)