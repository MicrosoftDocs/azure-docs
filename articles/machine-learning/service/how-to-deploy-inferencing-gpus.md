---
title: Deploy a model for inference with GPU 
titleSuffix: Azure Machine Learning service
description: This article teaches you how to use the Azure Machine Learning service to deploy a GPU-enabled Tensorflow deep learning model as a web service.service and score inference requests.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: vaidyas
author: csteegz
ms.reviewer: larryfr
ms.date: 06/01/2019
---

# Deploy a deep learning model for inference with GPU

This article teaches you how to use the Azure Machine Learning service to deploy a GPU-enabled Tensorflow deep learning model as a web service.

Deploy your model to an Azure Kubernetes Service (AKS) cluster to do GPU-enabled inferencing. Inferencing, or model scoring, is the phase where the deployed model is used for prediction. Using GPUs instead of CPUs offer performance advantages on highly parallelizable computation.

Although this sample uses a TensorFlow model, you can apply the following steps to any machine learning framework that supports GPUs by making small changes to the scoring file and the environment file. 

In this article, you take the following steps:

* Create a GPU-enabled AKS cluster
* Deploy a Tensorflow GPU model
* Issue a sample query to your deployed model

## Prerequisites

* An Azure Machine Learning services workspace.
* A Python distro.
* A registered Tensorflow saved model.
    * To learn how to register models, see [Deploy Models](../service/how-to-deploy-and-where.md#registermodel).

You can complete part one of this how-to series, [How to Train a TensorFlow Model](how-to-train-tensorflow.md), to fulfill the necessary prerequisites.

## Provision an AKS cluster with GPUs

Azure has many different GPU options. You can use any of them for inferencing. See [the list of N-series VMs](https://azure.microsoft.com/pricing/details/virtual-machines/linux/#n-series) for a full breakdown of capabilities and costs.

For more information on using AKS with Azure Machine Learning service, see [How to deploy and where](../service/how-to-deploy-and-where.md#deploy-aks).

```Python
# Choose a name for your cluster
aks_name = "aks-gpu"

# Check to see if the cluster already exists
try:
    compute_target = ComputeTarget(workspace=ws, name=aks_name)
    print('Found existing compute target')
except ComputeTargetException:
    print('Creating a new compute target...')
    # Provision AKS cluster with GPU machine
    prov_config = AksCompute.provisioning_configuration(vm_size="Standard_NC6")

    # Create the cluster
    aks_target = ComputeTarget.create(
        workspace=ws, name=aks_name, provisioning_configuration=prov_config
    )

    aks_target.wait_for_completion(show_output=True)
```

> [!IMPORTANT]
> Azure will bill you as long as the AKS cluster is provisioned. Make sure to delete your AKS cluster when you're done with it.

## Write the entry script

Save the following code to your working directory as `score.py`. This file scores images as they're sent to your service. It loads the TensorFlow saved model, passes the input image to the TensorFlow session on each POST request, and then returns the resulting scores. Other inferencing frameworks require different scoring files.

```python
import json
import numpy as np
import os
import tensorflow as tf

from azureml.core.model import Model

def init():
    global X, output, sess
    tf.reset_default_graph()
    model_root = Model.get_model_path('tf-dnn-mnist')
    saver = tf.train.import_meta_graph(os.path.join(model_root, 'mnist-tf.model.meta'))
    X = tf.get_default_graph().get_tensor_by_name("network/X:0")
    output = tf.get_default_graph().get_tensor_by_name("network/output/MatMul:0")
    
    sess = tf.Session()
    saver.restore(sess, os.path.join(model_root, 'mnist-tf.model'))

def run(raw_data):
    data = np.array(json.loads(raw_data)['data'])
    # make prediction
    out = output.eval(session=sess, feed_dict={X: data})
    y_hat = np.argmax(out, axis=1)
    return y_hat.tolist()

```
## Define the conda environment

Create a conda environment file named `myenv.yml` to specify the dependencies for your service. It's important to specify that you're using `tensorflow-gpu` to achieve accelerated performance.

```yaml
name: project_environment
dependencies:
  # The python interpreter version.
  # Currently Azure ML only supports 3.5.2 and later.
- python=3.6.2

- pip:
  - azureml-defaults==1.0.43.*
- numpy
- tensorflow-gpu=1.12
channels:
- conda-forge
```

## Define the GPU InferenceConfig class

Create an `InferenceConfig` object that enables the GPUs and ensures that CUDA is installed with your Docker image.

```python
from azureml.core.model import Model
from azureml.core.model import InferenceConfig

aks_service_name ='aks-dnn-mnist'
gpu_aks_config = AksWebservice.deploy_configuration(autoscale_enabled = False, 
                                                    num_replicas = 3, 
                                                    cpu_cores=2, 
                                                    memory_gb=4)
model = Model(ws,"tf-dnn-mnist")

inference_config = InferenceConfig(runtime= "python", 
                                   entry_script="score.py",
                                   conda_file="myenv.yml", 
                                   enable_gpu=True)
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

## Issue a sample query to your model

Send a test query to the deployed model. When you send a jpeg image to the model, it scores the image. The following code sample uses an external utility function  to load images. You can find the relevant code at pir [TensorFlow sample on GitHub](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow/utils.py). 

```python
# Used to test your webservice
from utils import load_data 

# Load test data from model training
X_test = load_data('./data/mnist/test-images.gz', False) / 255.0
y_test = load_data('./data/mnist/test-labels.gz', True).reshape(-1)

# send a random row from the test set to score
random_index = np.random.randint(0, len(X_test)-1)
input_data = "{\"data\": [" + str(list(X_test[random_index])) + "]}"

api_key = aks_service.get_keys()[0]
headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}
resp = requests.post(aks_service.scoring_uri, input_data, headers=headers)

print("POST to url", aks_service.scoring_uri)
#print("input data:", input_data)
print("label:", y_test[random_index])
print("prediction:", resp.text)
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
