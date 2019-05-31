---
title: Deploy a model for inference with GPU 
titleSuffix: Azure Machine Learning service
description: Learn how to deploy a deep learning model as a web service that uses a GPU for inference. In this article, a Tensorflow model is deployed to an Azure Kubernetes Service cluster. The cluster uses a GPU-enabled VM to host the web service and score inference requests.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: vaidyas
author: csteegz
ms.reviewer: larryfr
ms.date: 05/02/2019
---

# Deploy a deep learning model for inference with GPU

Learn how to use GPU inference for a machine learning model deployed as a web service. Inference, or model scoring, is the phase where the deployed model is used for prediction, most commonly on production data.

This article teaches you how to use the Azure Machine Learning service to deploy an example Tensorflow deep learning model to an Azure Kubernetes Service (AKS) cluster on a GPU-enabled virtual machine (VM). When requests are sent to the service, the model uses the GPU to run the inference workloads.

GPUs offer performance advantages over CPUs on highly parallelizable computation. Excellent use cases for GPU-enabled VMs include deep learning model training and inference, especially for large batches of requests.

This example demonstrates how to deploy a TensorFlow saved model to Azure Machine Learning. You take the following steps:

* Create a GPU-enabled AKS cluster
* Deploy a Tensorflow GPU model

## Prerequisites

* An Azure Machine Learning services workspace
* A Python distro
* A registered Tensorflow saved model. To learn how to register models, see [Deploy Models](../service/how-to-deploy-and-where.md#registermodel).

This article is based on the Jupyter notebook, [Deploying Tensorflow Models to AKS](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/production-deploy-to-aks-gpu/production-deploy-to-aks-gpu.ipynb). The Jupyter notebook uses TensorFlow saved models and deploys them to an AKS cluster. You can also apply the notebook to any machine learning framework that supports GPUs by making small changes to the scoring file and the environment file.  

## Provision an AKS cluster with GPUs

Azure has many different GPU options. You can use any of them for inferencing. See [the list of N-series VMs](https://azure.microsoft.com/pricing/details/virtual-machines/linux/#n-series) for a full breakdown of capabilities and costs.

For more information on using AKS with Azure Machine Learning service, see [How to deploy and where](../service/how-to-deploy-and-where.md#deploy-aks).

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
> Azure will bill you as long as the AKS cluster is provisioned. Make sure to delete your AKS cluster when you're done with it.

## Write the entry script

Save the following code to your working directory as `score.py`. This file scores images as they're sent to your service. It loads the TensorFlow saved model, passes the input image to the TensorFlow session on each POST request, and then returns the resulting scores. Other inferencing frameworks require different scoring files.

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
    input_name = [tensor.name for tensor in model.signature_def['serving_default'].inputs.values()][0]
    output_name = [tensor.name for tensor in model.signature_def['serving_default'].outputs.values()]
    

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
    return ujson.dumps(result[1])

if __name__ == "__main__":
    init()
    with open("lynx.jpg", 'rb') as f: #load file for testing locally
        content = f.read()
        print(score(content))

```

## Define the conda environment

Create a conda environment file named `myenv.yml` to specify the dependencies for your service. It's important to specify that you're using `tensorflow-gpu` to achieve accelerated performance.

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

## Define the GPU InferenceConfig class

Create an `InferenceConfig` object that enables the GPUs and ensures that CUDA is installed with your Docker image.

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

For more information, see:

- [InferenceConfig class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py)
- [AksServiceDeploymentConfiguration class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aks.aksservicedeploymentconfiguration?view=azure-ml-py)

## Deploy the model

Deploy the model to your AKS cluster and wait for it to create your service.

```python
aks_service = Model.deploy(ws,
                           models=[model],
                           inference_config=inference_config, 
                           deployment_config=gpu_aks_config,
                           deployment_target=aks_target,
                           name=aks_service_name)

aks_service.wait_for_deployment(show_output = True)
print(aks_service.state)
```

> [!NOTE]
> Azure Machine Learning service won't deploy a model with an `InferenceConfig` object that expects GPU to be enabled to a cluster that doesn't have a GPU.

For more information, see [Model class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

## Issue a sample query to your deployed model

Send a test query to the deployed model. When you send a jpeg image to the model, it scores the image.

```python
scoring_url = aks_service.scoring_uri
api_key = aks_service.get_key()(0)
IMAGEURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Lynx_lynx_poing.jpg/220px-Lynx_lynx_poing.jpg"

headers = {'Authorization':('Bearer '+ api_key)}
img_data = read_image_from(IMAGEURL).read()
r = requests.post(scoring_url, data = img_data, headers=headers)
```

> [!IMPORTANT]
> To minimize latency and optimize throughput, make sure your client is in the same Azure region as the endpoint. In this example, the APIs are created in the East US Azure region.

## Clean up the resources

Delete your resources after you're done with this example.

> [!IMPORTANT]
> Azure bills you based on how long the AKS cluster is deployed. Make sure to clean it up after you are done with it.

```python
aks_service.delete()
aks_target.delete()
```

## Next steps

* [Deploy model on FPGA](../service/how-to-deploy-fpga-web-service.md)
* [Deploy model with ONNX](../service/concept-onnx.md#deploy-onnx-models-in-azure)
* [Train Tensorflow DNN Models](../service/how-to-train-tensorflow.md)
