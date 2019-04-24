---
title: Deploy models on FPGAs
titleSuffix: Azure Machine Learning service
description: Learn how to deploy a web service with a model running on an FPGA with Azure Machine Learning service for ultra-low latency inferencing. 
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

You can deploy a model as a web service on [field programmable gate arrays (FPGAs)](concept-accelerate-with-fpgas.md) with Azure ML Hardware Accelerated Models powered by Project Brainwave.  Using FPGAs provides ultra-low latency inferencing, even with a single batch size.

These models are currently available:
  - ResNet 50
  - ResNet 152
  - DenseNet-121
  - VGG-16
  - SSD-VGG

The FPGAs are available in these Azure regions:
  - East US
  - West US
  - West Europe
  - Southeast Asia

## Prerequisites

- If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

- An Azure Machine Learning service workspace and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [How to configure a development environment](how-to-configure-environment.md) document.
 
  - Install the Python SDK for hardware-accelerated models:

    ```shell
    pip install --upgrade azureml-accel-models
    ```
## Sample notebooks

For your convenience, [sample notebooks](https://aka.ms/aml-notebooks) are available for the example below and other examples.

## Create and containerize your model

This document will describe how to create a TensorFlow graph to preprocess the input image, make it a feature using ResNet 50 on an FPGA, and then run the features through a classifier trained on the ImageNet data set.

Follow the instructions to:

* Define the TensorFlow model
* Deploy the model
* Consume the deployed model
* Delete deployed services

> [!IMPORTANT]
> To optimize latency and throughput, your client should be in the same Azure region as the endpoint.

### Load Azure ML workspace

Load your Azure ML workspace.

```python
from azureml.core import Workspace
 
ws = Workspace.from_config()
print(ws.name, ws.resource_group, ws.location, ws.subscription_id, sep = '\n')
```

### Preprocess image
The input to the web service is a JPEG image.  The first step is to decode the JPEG images and preprocess them.  The JPEG images are treated as strings and the result are tensors that will be the input to the ResNet 50 model.

```python
import os
import tensorflow as tf

# Input images as a two-dimensional tensor containing an arbitrary number of images represented a strings
import azureml.brainwave.models.utils as utils
in_images = tf.placeholder(tf.string)
image_tensors = utils.preprocess_array(in_images)
print(image_tensors.shape)
```

### Load featurizer
Initialize the model and download a TensorFlow checkpoint of the quantized version of ResNet50 to be used as a featurizer.  You may replace "QuantizedResnet50" in the code snippet below and import other deep neural networks:

- QuantizedResnet152
- QuantizedVgg16
- Densenet121

```python
from azureml.brainwave.models import QuantizedResnet50
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
model_def_path = os.path.join(save_path, model_graph.model_path, "saved_model")
print("Saving model in {}".format(model_def_path))

with tf.Session() as sess:
    model_graph.restore_weights(sess)
    tf.saved_model.simple_save(sess, model_def_path,
                                   inputs={'images': in_images},
                                   outputs={'output_alias': classifier_output})
```

### Register model
[Register](./concept-model-management-and-deployment.md) the model that you created.  Adding tags and other metadata about the model helps you keep track of your trained models.

```python
from azureml.core.model import Model

registered_model = Model.register(model_path = model_def_path,
                       model_name = model_name,
                       workspace = ws)
print("Successfully registered: ", registered_model.name, registered_model.description, registered_model.version, sep = '\t')
```

If you've already registered a model and want to load it, you can retrieve it.

```python
from azureml.core.model import Model
model_name = "resnet50"
# By default, the latest version is retrieved. You can specify the version, i.e. version=1
registered_model = Model(ws, name="resnet50")
print(registered_model.name, registered_model.description, registered_model.version, sep = '\t')
```

### Convert model
The TensorFlow graph needs to be converted to the Open Neural Network Exchange format ([ONNX](https://onnx.ai/)).  You will need to provide the names of the input and output tensors, and these names will be used by your client when you consume the web service.

```python
input_tensors = in_images.name
output_tensors = classifier_output.name

print(input_tensors)
print(output_tensors)

from azureml.brainwave.brainwave_onnx_converter import BrainwaveOnnxConverter

convert_request = BrainwaveOnnxConverter.convert_tf_model(ws, registered_model, input_tensors, output_tensors)
print(convert_request._operation_id)
convert_request.wait_for_completion(show_output=True)

# If the above call succeeded, get the converted model
converted_model = convert_request.result
print(converted_model.name, converted_model.url, converted_model.version, converted_model.id,converted_model.created_time)
```

### Create Docker image
The converted model and all dependencies are all added to a Docker image.  This Docker image can then be deployed to the cloud or a supported edge device.  You can also add tags and descriptions for your registered Docker image.

```python
from azureml.core.image import Image
from azureml.brainwave.brainwave_container_image import BrainwaveContainerImage

image_config = BrainwaveContainerImage.image_configuration()
image_name = "{}-image".format(model_name)

image = Image.create(name = image_name,
                     models = [converted_model],
                     image_config = image_config, 
                     workspace = ws)


image.wait_for_creation(show_output = True)
```

List the images by tag and get the detailed logs for any debugging.

```python
for i in Image.list(workspace = ws):
    print('{}(v.{} [{}]) stored at {} with build log {}'.format(i.name, i.version, i.creation_state, i.image_location, i.image_build_log_uri))
```

## Deploy to the cloud
To deploy your model as a high-scale production web service, use Azure Kubernetes Service (AKS). You can create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.

## Deploy to the edge

All [Azure Data Box Edge devices](https://docs.microsoft.com/azure/databox-online/data-box-edge-overview
) have an FPGA for running the model.  Only one model can be running on the FPGA at one time.

## Secure FPGA web services

For information on securing FPGA web services, see the [Secure web services](how-to-secure-web-service.md) document.
