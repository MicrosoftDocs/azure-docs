---
title: Deploy a model for inference with GPU 
titleSuffix: Azure Machine Learning
description: This article teaches you how to use Azure Machine Learning to deploy a GPU-enabled Tensorflow deep learning model as a web service.service and score inference requests.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: vaidyas
author: csteegz
ms.reviewer: larryfr
ms.date: 10/25/2019
---

# Deploy a deep learning model for inference with GPU
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

This article teaches you how to use Azure Machine Learning to deploy a GPU-enabled model as a web service. The information in this article is based on deploying a model on Azure Kubernetes Service (AKS). The AKS cluster provides a GPU resource that is used by the model for inference.

Inference, or model scoring, is the phase where the deployed model is used to make predictions. Using GPUs instead of CPUs offers performance advantages on highly parallelizable computation.

> [!IMPORTANT]
> For web service deployments, GPU inference is only supported on Azure Kubernetes Service. For inference using a __machine learning pipeline__, GPUs are only supported on Azure Machine Learning Compute. For more information on using ML pipelines, see [Run batch predictions](how-to-use-parallel-run-step.md). 

> [!TIP]
> Although the code snippets in this article use a TensorFlow model, you can apply the information to any machine learning framework that supports GPUs.

> [!NOTE]
> The information in this article builds on the information in the [How to deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md) article. Where that article generally covers deployment to AKS, this article covers GPU specific deployment.

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* A Python development environment with the Azure Machine Learning SDK installed. For more information, see [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).  

* A registered model that uses a GPU.

    * To learn how to register models, see [Deploy Models](how-to-deploy-and-where.md#registermodel).

    * To create and register the Tensorflow model used to create this document, see [How to Train a TensorFlow Model](how-to-train-tensorflow.md).

* A general understanding of [How and where to deploy models](how-to-deploy-and-where.md).

## Connect to your workspace

To connect to an existing workspace, use the following code:

> [!IMPORTANT]
> This code snippet expects the workspace configuration to be saved in the current directory or its parent. For more information on creating a workspace, see [Create and manage Azure Machine Learning workspaces](how-to-manage-workspace.md).   For more information on saving the configuration to file, see [Create a workspace configuration file](how-to-configure-environment.md#workspace).

```python
from azureml.core import Workspace

# Connect to the workspace
ws = Workspace.from_config()
```

## Create a Kubernetes cluster with GPUs

Azure Kubernetes Service provides many different GPU options. You can use any of them for model inference. See [the list of N-series VMs](https://azure.microsoft.com/pricing/details/virtual-machines/linux/#n-series) for a full breakdown of capabilities and costs.

The following code demonstrates how to create a new AKS cluster for your workspace:

```python
from azureml.core.compute import ComputeTarget, AksCompute
from azureml.exceptions import ComputeTargetException

# Choose a name for your cluster
aks_name = "aks-gpu"

# Check to see if the cluster already exists
try:
    aks_target = ComputeTarget(workspace=ws, name=aks_name)
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
> Azure will bill you as long as the AKS cluster exists. Make sure to delete your AKS cluster when you're done with it.

For more information on using AKS with Azure Machine Learning, see [How to deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md).

## Write the entry script

The entry script receives data submitted to the web service, passes it to the model, and returns the scoring results. The following script loads the Tensorflow model on startup, and then uses the model to score data.

> [!TIP]
> The entry script is specific to your model. For example, the script must know the framework to use with your model, data formats, etc.

```python
import json
import numpy as np
import os
import tensorflow as tf

from azureml.core.model import Model


def init():
    global X, output, sess
    tf.reset_default_graph()
    model_root = os.getenv('AZUREML_MODEL_DIR')
    # the name of the folder in which to look for tensorflow model files
    tf_model_folder = 'model'
    saver = tf.train.import_meta_graph(
        os.path.join(model_root, tf_model_folder, 'mnist-tf.model.meta'))
    X = tf.get_default_graph().get_tensor_by_name("network/X:0")
    output = tf.get_default_graph().get_tensor_by_name("network/output/MatMul:0")

    sess = tf.Session()
    saver.restore(sess, os.path.join(model_root, tf_model_folder, 'mnist-tf.model'))


def run(raw_data):
    data = np.array(json.loads(raw_data)['data'])
    # make prediction
    out = output.eval(session=sess, feed_dict={X: data})
    y_hat = np.argmax(out, axis=1)
    return y_hat.tolist()
```

This file is named `score.py`. For more information on entry scripts, see [How and where to deploy](how-to-deploy-and-where.md).

## Define the conda environment

The conda environment file specifies the dependencies for the service. It includes dependencies required by both the model and the entry script. Please note that you must indicate azureml-defaults with verion >= 1.0.45 as a pip dependency, because it contains the functionality needed to host the model as a web service. The following YAML defines the environment for a Tensorflow model. It specifies `tensorflow-gpu`, which will make use of the GPU used in this deployment:

```yaml
name: project_environment
dependencies:
  # The python interpreter version.
  # Currently Azure ML only supports 3.5.2 and later.
- python=3.6.2

- pip:
  # You must list azureml-defaults as a pip dependency
  - azureml-defaults>=1.0.45
- numpy
- tensorflow-gpu=1.12
channels:
- conda-forge
```

For this example, the file is saved as `myenv.yml`.

## Define the deployment configuration

The deployment configuration defines the Azure Kubernetes Service environment used to run the web service:

```python
from azureml.core.webservice import AksWebservice

gpu_aks_config = AksWebservice.deploy_configuration(autoscale_enabled=False,
                                                    num_replicas=3,
                                                    cpu_cores=2,
                                                    memory_gb=4)
```

For more information, see the reference documentation for [AksService.deploy_configuration](/python/api/azureml-core/azureml.core.webservice.akswebservice?view=azure-ml-py#deploy-configuration-autoscale-enabled-none--autoscale-min-replicas-none--autoscale-max-replicas-none--autoscale-refresh-seconds-none--autoscale-target-utilization-none--collect-model-data-none--auth-enabled-none--cpu-cores-none--memory-gb-none--enable-app-insights-none--scoring-timeout-ms-none--replica-max-concurrent-requests-none--max-request-wait-time-none--num-replicas-none--primary-key-none--secondary-key-none--tags-none--properties-none--description-none--gpu-cores-none--period-seconds-none--initial-delay-seconds-none--timeout-seconds-none--success-threshold-none--failure-threshold-none--namespace-none--token-auth-enabled-none--compute-target-name-none-).

## Define the inference configuration

The inference configuration points to the entry script and an environment object, which uses a docker image with GPU support. Please note that the YAML file used for environment definition must list azureml-defaults with version >= 1.0.45 as a pip dependency, because it contains the functionality needed to host the model as a web service.

```python
from azureml.core.model import InferenceConfig
from azureml.core.environment import Environment, DEFAULT_GPU_IMAGE

myenv = Environment.from_conda_specification(name="myenv", file_path="myenv.yml")
myenv.docker.base_image = DEFAULT_GPU_IMAGE
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
```

For more information on environments, see [Create and manage environments for training and deployment](how-to-use-environments.md).
For more information, see the reference documentation for [InferenceConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py).

## Deploy the model

Deploy the model to your AKS cluster and wait for it to create your service.

```python
from azureml.core.model import Model

# Name of the web service that is deployed
aks_service_name = 'aks-dnn-mnist'
# Get the registerd model
model = Model(ws, "tf-dnn-mnist")
# Deploy the model
aks_service = Model.deploy(ws,
                           models=[model],
                           inference_config=inference_config,
                           deployment_config=gpu_aks_config,
                           deployment_target=aks_target,
                           name=aks_service_name)

aks_service.wait_for_deployment(show_output=True)
print(aks_service.state)
```

> [!NOTE]
> If the `InferenceConfig` object has `enable_gpu=True`, then the `deployment_target` parameter must reference a cluster that provides a GPU. Otherwise, the deployment will fail.

For more information, see the reference documentation for [Model](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

## Issue a sample query to your service

Send a test query to the deployed model. When you send a jpeg image to the model, it scores the image. The following code sample downloads test data and then selects a random test image to send to the service.

```python
# Used to test your webservice
import os
import urllib
import gzip
import numpy as np
import struct
import requests

# load compressed MNIST gz files and return numpy arrays
def load_data(filename, label=False):
    with gzip.open(filename) as gz:
        struct.unpack('I', gz.read(4))
        n_items = struct.unpack('>I', gz.read(4))
        if not label:
            n_rows = struct.unpack('>I', gz.read(4))[0]
            n_cols = struct.unpack('>I', gz.read(4))[0]
            res = np.frombuffer(gz.read(n_items[0] * n_rows * n_cols), dtype=np.uint8)
            res = res.reshape(n_items[0], n_rows * n_cols)
        else:
            res = np.frombuffer(gz.read(n_items[0]), dtype=np.uint8)
            res = res.reshape(n_items[0], 1)
    return res

# one-hot encode a 1-D array
def one_hot_encode(array, num_of_classes):
    return np.eye(num_of_classes)[array.reshape(-1)]

# Download test data
os.makedirs('./data/mnist', exist_ok=True)
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz', filename='./data/mnist/test-images.gz')
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz', filename='./data/mnist/test-labels.gz')

# Load test data from model training
X_test = load_data('./data/mnist/test-images.gz', False) / 255.0
y_test = load_data('./data/mnist/test-labels.gz', True).reshape(-1)

# send a random row from the test set to score
random_index = np.random.randint(0, len(X_test)-1)
input_data = "{\"data\": [" + str(list(X_test[random_index])) + "]}"

api_key = aks_service.get_keys()[0]
headers = {'Content-Type': 'application/json',
           'Authorization': ('Bearer ' + api_key)}
resp = requests.post(aks_service.scoring_uri, input_data, headers=headers)

print("POST to url", aks_service.scoring_uri)
print("label:", y_test[random_index])
print("prediction:", resp.text)
```

For more information on creating a client application, see [Create client to consume deployed web service](how-to-consume-web-service.md).

## Clean up the resources

If you created the AKS cluster specifically for this example, delete your resources after you're done.

> [!IMPORTANT]
> Azure bills you based on how long the AKS cluster is deployed. Make sure to clean it up after you are done with it.

```python
aks_service.delete()
aks_target.delete()
```

## Next steps

* [Deploy model on FPGA](how-to-deploy-fpga-web-service.md)
* [Deploy model with ONNX](concept-onnx.md#deploy-onnx-models-in-azure)
* [Train Tensorflow DNN Models](how-to-train-tensorflow.md)
