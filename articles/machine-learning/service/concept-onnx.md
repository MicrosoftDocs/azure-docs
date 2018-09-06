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

![ONNX flow diagram showing training, converters, and deployment](media/concept-onnx/onnx.png)

## Creating ONNX models in Azure

You can create ONNX models in several ways:
1. Obtain a pre-trained ONNX model from [Azure AI Model Gallery](https://gallery.azure.ai/models)
2. Generate a customized ONNX model from [Azure Custom Vision Service](https://docs.microsoft.com/en-us/azure/cognitive-services/Custom-Vision-Service/)
3. Train a model in Azure Machine Learning services and convert or export it to ONNX - learn more with this [tutorial](http://aka.ms/aml-onnx-training-notebook)
4. Convert a model you obtained from somewhere else

Once you have an ONNX model, you can deploy it to Azure. You can also deploy the same ONNX model to Windows 10 devices using Windows ML - for more information, read "[Get ONNX models for Windows ML](https://docs.microsoft.com/en-us/windows/ai/)".

### Converting TensorFlow models

To convert TensorFlow models, use the [tensorflow-onnx converter](https://github.com/onnx/tensorflow-onnx).

### Converting Keras, ScitKit-Learn, and other models

Use the [WinMLTools](https://docs.microsoft.com/en-us/windows/ai/convert-model-winmltools) package if you have a model in one of the following formats:
* Keras
* SciKit-Learn
* xgboost
* libSVM
* CoreML

## Deploying ONNX models in Azure

Azure Machine Learning services enable you to deploy, manage, and monitor your ONNX models. Using the standard [deployment pipeline](https://docs.microsoft.com/en-us/azure/machine-learning/service/concept-model-management-and-deployment) and the ONNX Runtime you can create a REST endpoint hosted in the cloud.

Below is an example for deploying an ONNX model:

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
```

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

### Deploy your web service

You can deploy your ONNX model to:
* [Azure Container Instances (ACI)](how-to-deploy-to-aci.md)
* [Azure Kubernetes Service (AKS)](how-to-deploy-to-aks.md)

Click the above to see the instructions for each.

Once deployed, your ONNX model is hosted in the cloud and ready to be called!

Download [this Jupyter notebook](https://aka.ms/aml-onnx-notebook) to try it out for yourself. 

## Next steps

Learn more about ONNX or contribute to the project:
+ [ONNX project website](http://onnx.ai)
+ [ONNX code on GitHub](https://github.com/onnx/onnx)