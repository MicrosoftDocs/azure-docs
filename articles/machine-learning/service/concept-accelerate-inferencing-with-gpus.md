---
title: How to deploy a deep learning model for inferencing with GPU 
titleSuffix: Azure Machine Learning service
description: earn how to deploy a deep learning model as a web service that uses a GPU for inferencing. In this article, a Tensorflow model is deployed to an Azure Kubernetes Service cluster. The AKS cluster uses a GPU-enabled VM to host the web service and score inferencing requests.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: vaidyas
author: coverste
ms.reviewer: larryfr
ms.date: 05/02/2019
---

# How to do GPU inferencing

Learn how to use GPU inferencing for a machine learning model deployed as a web service. In this article, you learn how to use the Azure Machine Learning service to deploy an example Tensorflow deep learning model. The model is deployed to an Azure Kubernetes Service (AKS) cluster that uses a GPU-enabled VM to host the service. When requests are sent to the service, the model uses the GPU to perform inferencing.

GPUs offer performance advantages over CPUs on highly parallelizable computation. Training and inferencing deep learning models (especially for large batches of requests) are excellent use cases for GPUs.  

This example will show you how to deploy a TensorFlow saved model to Azure Machine Learning. 

## Goals and Prerequisites

Follow the instructions to:
* Create a GPU enabled AKS cluster
* Deploy a model with Tensorflow-GPU

Prerequisites:
* Azure Machine Learning services workspace
* Python
* Tensorflow SavedModel registered. To learn how to register models see [Deploy Models](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-deploy-and-where#registermodel)

This article is based on [Deploying Tensorflow Models to Aks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/production-deploy-to-aks-gpu/production-deploy-to-aks-gpu.ipynb), which uses TensorFlow saved models and deploys to an AKS cluster. However, with small changes to the scoring file and environment file it is aplicaple to any machine learning framework which support GPUs.  

## Provision AKS cluster with GPUs
Azure has many different GPU options, all of which can be used for Inferencing. See [the list of N Series](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/#n-series) for a full breakdown of capabilities and costs. 

For more information on using AKS with Azure Machine Learning service, see the [How to deploy and where article](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-deploy-and-where#create-a-new-cluster)

```python
# Provision AKS cluster with GPU machine
prov_config = AksCompute.provisioning_configuration(vm_size="Standard_NC6")

# Create the cluster
aks_target = ComputeTarget.create(
    workspace=ws, name=aks_name, provisioning_configuration=prov_config
)

aks_target.wait_for_deployment()
```

> [!IMPORTANT]
> Azure will bill you as long as the AKS cluster is provisioned. Make sure to delete your AKS cluster once you are done using it.


## Write entry script

Save the following to your working directory as `score.py`. 
This file will be used to score images as they are sent to your service. 
This file loads the TensorFlow saved model, and then on each POST request passes the input image to the TensorFlow session and returns the resulting scores.
Other inferencing frameworks will require different scoring files.

```python
import tensorflow as tf
import numpy as np
import ujson
from azureml.core.model import Model
from azureml.contrib.services.aml_request import AMLRequest, rawhttp
from azureml.contrib.services.aml_response import AMLResponse

def init():
    global session
    global input_name
    global output_name
    
    session = tf.Session()

    model_path = Model.get_model_path('resnet50')
    model = tf.saved_model.loader.load(session, ['serve'], model_path)
    if len(model.signature_def['serving_default'].inputs) > 1:
        raise ValueError("This score.py only supports one input")
    if len(model.signature_def['serving_default'].outputs) > 1:
        raise ValueError("This score.py only supports one input")
    input_name = [tensor.name for tensor in model.signature_def['serving_default'].inputs.values()][0]
    output_name = [tensor.name for tensor in model.signature_def['serving_default'].outputs.values()][0]
    

@rawhttp
def run(request):
    if request.method == 'POST':
        reqBody = request.get_data(False)
        resp = score(reqBody)
        return AMLResponse(resp, 200)
    if request.method == 'GET':
        respBody = str.encode("GET is not supported")
        return AMLResponse(respBody, 405)
    return AMLResponse("bad request", 500)

def score(data):
    result = session.run(output_name, {input_name: [data]})
    return ujson.dumps(result[0])

if __name__ == "__main__":
    init()
    with open("lynx.jpg", 'rb') as f:
        content = f.read()
        print(score(content))

```

## Define Conda Environment
Create a conda environment file named `myenv.yml` to specify the dependencies for your service. It's important to specify that you are using `tensorflow-gpu` to achieve accelerated performance.
```yaml
name: aml-accel-perf
channels:
  - defaults
dependencies:
  - tensorflow-gpu = 1.12
  - numpy
  - ujson
  - pip:
    - azureml-core
    - azureml-contrib-services
```

## Define GPU InferenceConfig

Create an [`InferenceConfig`](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py) which specifies that you are enabling GPU. This will ensure that CUDA is installed with your Image.

```python
from azureml.core.model import Model
from azureml.core.model import InferenceConfig

aks_service_name ='gpu-rn'
gpu_aks_config = AksWebservice.deploy_configuration(autoscale_enabled = False, 
                                                    num_replicas = 3, 
                                                    cpu_cores=2, 
                                                    memory_gb=4)
model = Model(ws,"resnet50")

inference_config = InferenceConfig(runtime= "python", 
                                   entry_script="score.py",
                                   conda_file="myenv.yml", 
                                   gpu_enabled=True)
```

For more information see [InferenceConfig](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py) and 
[AksServiceDeploymentConfiguration](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.webservice.aks.aksservicedeploymentconfiguration?view=azure-ml-py).
## Deploy the model

Deploy the model to your AKS cluster and wait for it to create your service.

```python
aks_service = Model.deploy(ws,
                           models=[model],
                           inference_config=inference_config, 
                           deployment_config=aks_config,
                           deployment_target=aks_target,
                           name=aks_service_name)

aks_service.wait_for_deployment(show_output = True)
print(aks_service.state)
```

> [!NOTE]
> Azure Machine Learning service will not deploy a model with an `InferenceConfig` that expects GPU to a cluster without GPU.

For more information, see [Model](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

## Issue sample query to deployed model

Issue a sample query to your deployed model. This model will score any jpeg image you send to it as a post request. 

```python
scoring_url = aks_service.scoring_uri
api_key = aks_service.get_key()(0)
IMAGEURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Lynx_lynx_poing.jpg/220px-Lynx_lynx_poing.jpg"

headers = {'Authorization':('Bearer '+ api_key)}
img_data = read_image_from(IMAGEURL).read()
r = requests.post(scoring_url, data = img_data, headers=headers)
```

> [!IMPORTANT]
> To optimize latency and throughput, your client should be in the same Azure region as the endpoint.  Currently the APIs are created in the East US Azure region.

## Cleaning up the resources

Delete your resources after you are done with the demo.

> [!IMPORTANT]
> Azure will bill you based on how long the AKS cluster is deployed. Make sure to clean it up after you are done with it.

```python
aks_service.delete()
aks_target.delete()
```

## Next steps

* [Deploy model on FPGA](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-deploy-fpga-web-service)
* [Deploy model with Onnx](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-build-deploy-onnx#deploy)
* [Train Tensorflow DNN Models](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-train-tensorflow)
