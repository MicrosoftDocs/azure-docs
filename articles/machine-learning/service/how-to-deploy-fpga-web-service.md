---
title: Deploy models on FPGAs
titleSuffix: Azure Machine Learning service
description: Learn how to deploy a web service with a model running on an FPGA with Azure Machine Learning service for ultra-low latency inference. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: larryfr
ms.author: tedway
author: tedway
ms.date: 05/02/2019
ms.custom: seodec18
---

# Deploy a model as a web service on an FPGA with Azure Machine Learning service

You can deploy a model as a web service on [field programmable gate arrays (FPGAs)](concept-accelerate-with-fpgas.md) with Azure Machine Learning Hardware Accelerated Models. Using FPGAs provides ultra-low latency inference, even with a single batch size. Inference, or model scoring, is the phase where the deployed model is used for prediction, most commonly on production data.

These models are currently available:
  - ResNet 50
  - ResNet 152
  - DenseNet-121
  - VGG-16
  - SSD-VGG

FPGAs are available in these Azure regions:
  - East US
  - Southeast Asia
  - West Europe
  - West US 2

> [!IMPORTANT]
> To optimize latency and throughput, your client sending data to the FPGA model should be in one of the regions above (the one you deployed the model to).

## Prerequisites

- An Azure subscription.  If you do not have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

- FPGA quota.  Use the Azure CLI to check whether you have quota.
    ```shell
    az vm list-usage --location "eastus" -o table
    ```

    The other locations are ``southeastasia``, ``westeurope``, and ``westus2``.

    Under the "Name" column, look for "Standard PBS Family vCPUs" and ensure you have at least 6 vCPUs under "CurrentValue."

    If you do not have quota, then submit a request form [here](https://aka.ms/accelerateAI).

- An Azure Machine Learning service workspace and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [How to configure a development environment](how-to-configure-environment.md) document.
 
- The Python SDK for hardware-accelerated models:

    ```shell
    pip install --upgrade azureml-accel-models
    ```

## Sample notebooks

For your convenience, [sample notebooks](https://aka.ms/aml-accel-models-notebooks) are available for the example below and other examples.

## Create and containerize your model

This document will describe how to create a TensorFlow graph to preprocess the input image, make it a featurizer using ResNet 50 on an FPGA, and then run the features through a classifier trained on the ImageNet data set.

Follow the instructions to:

* Define the TensorFlow model
* Convert the model
* Deploy the model
* Consume the deployed model
* Delete deployed services

### Load Azure ML workspace

Load your Azure ML workspace.

```python
import os
import tensorflow as tf
 
from azureml.core import Workspace

ws = Workspace.from_config()
print(ws.name, ws.resource_group, ws.location, ws.subscription_id, sep = '\n')
```

### Preprocess image

The input to the web service is a JPEG image.  The first step is to decode the JPEG image and preprocess it.  The JPEG images are treated as strings and the result are tensors that will be the input to the ResNet 50 model.

```python
# Input images as a two-dimensional tensor containing an arbitrary number of images represented a strings
import azureml.accel.models.utils as utils
tf.reset_default_graph()

in_images = tf.placeholder(tf.string)
image_tensors = utils.preprocess_array(in_images)
print(image_tensors.shape)
```

### Load featurizer

Initialize the model and download a TensorFlow checkpoint of the quantized version of ResNet50 to be used as a featurizer.  You may replace "QuantizedResnet50" in the code snippet below with by importing other deep neural networks:

- QuantizedResnet152
- QuantizedVgg16
- Densenet121

```python
from azureml.accel.models import QuantizedResnet50
save_path = os.path.expanduser('~/models')
model_graph = QuantizedResnet50(save_path, is_frozen = True)
feature_tensor = model_graph.import_graph_def(image_tensors)
print(model_graph.version)
print(feature_tensor.name)
print(feature_tensor.shape)
```

### Add classifier

This classifier has been trained on the ImageNet data set.  Examples for transfer learning and training your customized weights are available in the set of [sample notebooks](https://aka.ms/aml-notebooks).

```python
classifier_output = model_graph.get_default_classifier(feature_tensor)
print(classifier_output)
```

### Save the model

Now that the preprocessor, ResNet 50 featurizer, and the classifier have been loaded, save the graph and associated variables as a model.

```python
model_name = "resnet50"
model_save_path = os.path.join(save_path, model_name)
print("Saving model in {}".format(model_save_path))

with tf.Session() as sess:
    model_graph.restore_weights(sess)
    tf.saved_model.simple_save(sess, model_save_path,
                                   inputs={'images': in_images},
                                   outputs={'output_alias': classifier_output})
```

### Save input and output tensors
The input and output tensors that were created during the preprocessing and classifier steps will be needed for model conversion and inference.

```python
input_tensors = in_images.name
output_tensors = classifier_output.name

print(input_tensors)
print(output_tensors)
```

> [!IMPORTANT]
> Save the input and output tensors because you will need them for model conversion and inference requests.

The available models and the corresponding default classifier output tensors are below, which is what you would use for inference if you used the default classifier.

+ Resnet50, QuantizedResnet50
  ```
  output_tensors = "classifier_1/resnet_v1_50/predictions/Softmax:0"
  ```
+ Resnet152, QuantizedResnet152
  ```
  output_tensors = "classifier/resnet_v1_152/predictions/Softmax:0"
  ```
+ Densenet121, QuantizedDensenet121
  ```
  output_tensors = "classifier/densenet121/predictions/Softmax:0"
  ```
+ Vgg16, QuantizedVgg16
  ```
  output_tensors = "classifier/vgg_16/fc8/squeezed:0"
  ```
+ SsdVgg, QuantizedSsdVgg
  ```
  output_tensors = ['ssd_300_vgg/block4_box/Reshape_1:0', 'ssd_300_vgg/block7_box/Reshape_1:0', 'ssd_300_vgg/block8_box/Reshape_1:0', 'ssd_300_vgg/block9_box/Reshape_1:0', 'ssd_300_vgg/block10_box/Reshape_1:0', 'ssd_300_vgg/block11_box/Reshape_1:0', 'ssd_300_vgg/block4_box/Reshape:0', 'ssd_300_vgg/block7_box/Reshape:0', 'ssd_300_vgg/block8_box/Reshape:0', 'ssd_300_vgg/block9_box/Reshape:0', 'ssd_300_vgg/block10_box/Reshape:0', 'ssd_300_vgg/block11_box/Reshape:0']
  ```

### Register model

[Register](./concept-model-management-and-deployment.md) the model that you created.  Adding tags and other metadata about the model helps you keep track of your trained models.

```python
from azureml.core.model import Model

registered_model = Model.register(workspace = ws,
                                  model_path = model_save_path,
                                  model_name = model_name)

print("Successfully registered: ", registered_model.name, registered_model.description, registered_model.version, sep = '\t')
```

If you've already registered a model and want to load it, you may retrieve it.

```python
from azureml.core.model import Model
model_name = "resnet50"
# By default, the latest version is retrieved. You can specify the version, i.e. version=1
registered_model = Model(ws, name="resnet50")
print(registered_model.name, registered_model.description, registered_model.version, sep = '\t')
```

### Convert model

Convert the TensorFlow graph to the Open Neural Network Exchange format ([ONNX](https://onnx.ai/)).  You will need to provide the names of the input and output tensors, and these names will be used by your client when you consume the web service.

```python
from azureml.accel import AccelOnnxConverter

convert_request = AccelOnnxConverter.convert_tf_model(ws, registered_model, input_tensors, output_tensors)

# If it fails, you can run wait_for_completion again with show_output=True.
convert_request.wait_for_completion(show_output = False)

# If the above call succeeded, get the converted model
converted_model = convert_request.result
print("\nSuccessfully converted: ", converted_model.name, converted_model.url, converted_model.version, 
      converted_model.id, converted_model.created_time, '\n')
```

### Create Docker image

The converted model and all dependencies are added to a Docker image.  This Docker image can then be deployed and instantiated.  Supported deployment targets include AKS in the cloud or an  edge device such as [Azure Data Box Edge](https://docs.microsoft.com/azure/databox-online/data-box-edge-overview).  You can also add tags and descriptions for your registered Docker image.

```python
from azureml.core.image import Image
from azureml.accel import AccelContainerImage

image_config = AccelContainerImage.image_configuration()
# Image name must be lowercase
image_name = "{}-image".format(model_name)

image = Image.create(name = image_name,
                     models = [converted_model],
                     image_config = image_config, 
                     workspace = ws)
image.wait_for_creation(show_output = False)
```

List the images by tag and get the detailed logs for any debugging.

```python
for i in Image.list(workspace = ws):
    print('{}(v.{} [{}]) stored at {} with build log {}'.format(i.name, i.version, i.creation_state, i.image_location, i.image_build_log_uri))
```

## Model deployment

### Deploy to the cloud

To deploy your model as a high-scale production web service, use Azure Kubernetes Service (AKS). You can create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Specify the Standard_PB6s Azure VM
prov_config = AksCompute.provisioning_configuration(vm_size = "Standard_PB6s",
                                                    agent_count = 1)

aks_name = 'my-aks-cluster'
# Create the cluster
aks_target = ComputeTarget.create(workspace = ws, 
                                  name = aks_name, 
                                  provisioning_configuration = prov_config)
```

The AKS deployment may take around 15 minutes.  Check to see if the deployment succeeded.

```python
aks_target.wait_for_completion(show_output = True)
print(aks_target.provisioning_state)
print(aks_target.provisioning_errors)
```

Deploy the container to the AKS cluster.
```python
from azureml.core.webservice import Webservice, AksWebservice

# For this deployment, set the web service configuration without enabling auto-scaling or authentication for testing
aks_config = AksWebservice.deploy_configuration(autoscale_enabled=False,
                                                num_replicas=1,
                                                auth_enabled = False)

aks_service_name ='my-aks-service'

aks_service = Webservice.deploy_from_image(workspace = ws,
                                           name = aks_service_name,
                                           image = image,
                                           deployment_config = aks_config,
                                           deployment_target = aks_target)
aks_service.wait_for_deployment(show_output = True)
```

#### Test the cloud service
The Docker image supports gRPC and the TensorFlow Serving "predict" API.  Use the sample client to call into the Docker image to get predictions from the model.  Sample client code is available:
- [Python](https://github.com/Azure/aml-real-time-ai/blob/master/pythonlib/amlrealtimeai/client.py)
- [C#](https://github.com/Azure/aml-real-time-ai/blob/master/sample-clients/csharp)

If you want to use TensorFlow Serving, you can [download a sample client](https://www.tensorflow.org/serving/setup).

```python
# Using the grpc client in Azure ML Accelerated Models SDK package
from azureml.accel import PredictionClient

address = aks_service.scoring_uri
ssl_enabled = address.startswith("https")
address = address[address.find('/')+2:].strip('/')
port = 443 if ssl_enabled else 80

# Initialize AzureML Accelerated Models client
client = PredictionClient(address=address,
                          port=port,
                          use_ssl=ssl_enabled,
                          service_name=aks_service.name)
```

Since this classifier was trained on the [ImageNet](http://www.image-net.org/) data set, map the classes to human-readable labels.

```python
import requests
classes_entries = requests.get("https://raw.githubusercontent.com/Lasagne/Recipes/master/examples/resnet50/imagenet_classes.txt").text.splitlines()

# Score image with input and output tensor names
results = client.score_file(path="./snowleopardgaze.jpg", 
                             input_name=input_tensors, 
                             outputs=output_tensors)

# map results [class_id] => [confidence]
results = enumerate(results)
# sort results by confidence
sorted_results = sorted(results, key=lambda x: x[1], reverse=True)
# print top 5 results
for top in sorted_results[:5]:
    print(classes_entries[top[0]], 'confidence:', top[1])
```

### Clean-up the service
Delete your web service, image, and model (must be done in this order since there are dependencies).

```python
aks_service.delete()
aks_target.delete()
image.delete()
registered_model.delete()
converted_model.delete()
```

## Deploy to a local edge server

All [Azure Data Box Edge devices](https://docs.microsoft.com/azure/databox-online/data-box-edge-overview
) contain an FPGA for running the model.  Only one model can be running on the FPGA at one time.  To run a different model, just deploy a new container. Instructions and sample code can be found in [this Azure Sample](https://github.com/Azure-Samples/aml-hardware-accelerated-models).

## Secure FPGA web services

For information on securing FPGA web services, see the [Secure web services](how-to-secure-web-service.md) document.

## PBS Family VMs

The PBS Family of Azure VMs contains Intel Arria 10 FPGAs.  It will show as "Standard PBS Family vCPUs" when you check your Azure quota allocation.  The PB6 VM has six vCPUs and one FPGA, and it will automatically be provisioned by Azure ML as part of deploying a model to an FPGA.  It is only used with Azure ML, and it cannot run arbitrary bitstreams.  For example, you will not be able to flash the FPGA with bitstreams to do encryption, encoding, etc. 
