---
title: ONNX and Azure Machine Learning | Create and deploy models
description: Learn about ONNX and how to use Azure Machine Learning to create and deploy ONNX models 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: prasantp
author: prasanthpul
ms.date: 09/24/2018
---

# ONNX and Azure Machine Learning: Create and deploy interoperable AI models

The [Open Neural Network Exchange](http://onnx.ai) (ONNX) format is an open standard for representing machine learning models. ONNX is supported by a [community of partners](http://onnx.ai/supported-tools), including Microsoft, who create compatible frameworks and tools. Microsoft is committed to open and interoperable AI so that data scientists and developers can:

+ Use the framework of their choice to create and train models
+ Deploy models cross-platform with minimal integration work

Microsoft supports ONNX across its products including Azure and Windows to help you achieve these goals.  

## Why choose ONNX?
The interoperability you get with ONNX makes it possible to get great ideas into production faster. With ONNX, data scientists can choose their preferred framework for the job. Similarly, developers can spend less time getting models ready for production, and deploy across the cloud and edge.  

You can create ONNX models from many frameworks, including PyTorch, Chainer, Microsoft Cognitive Toolkit (CNTK), MXNet, ML.Net, TensorFlow, Keras, SciKit-Learn, and more.

There is also an ecosystem of tools for visualizing and accelerating ONNX models. A number of pre-trained ONNX models are also available for common scenarios.

[ONNX models can be deployed](#deploy) to the cloud using Azure Machine Learning and the ONNX Runtime. They can also be deployed to Windows 10 devices using [Windows ML](https://docs.microsoft.com/windows/ai/). They can even be deployed to other platforms using converters that are available from the ONNX community. 

[ ![ONNX flow diagram showing training, converters, and deployment](media/concept-onnx/onnx.png) ]
(./media/concept-onnx/onnx.png#lightbox)

## Get ONNX models

You can obtain ONNX models in several ways:
+ Get a pre-trained ONNX model from the [ONNX Model Zoo](https://github.com/onnx/models) (see example at the bottom of this article)
+ Generate a customized ONNX model from [Azure Custom Vision service](https://docs.microsoft.com/azure/cognitive-services/Custom-Vision-Service/) 
+ Convert existing model from another format to ONNX (see example at the bottom of this article) 
+ Train a new ONNX model in Azure Machine Learning service (see example at the bottom of this article)

## Save/convert your models to ONNX

You can convert existing models to ONNX or save them as ONNX at the end of your training.

|Framework for model|Conversion example or tool|
|-----|-------|
|PyTorch|[Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/PytorchOnnxExport.ipynb)|
|Microsoft&nbsp;Cognitive&nbsp;Toolkit&nbsp;(CNTK)|[Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/CntkOnnxExport.ipynb)|
|TensorFlow|[tensorflow-onnx converter](https://github.com/onnx/tensorflow-onnx)|
|Chainer|[Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/ChainerOnnxExport.ipynb)|
|MXNet|[Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/MXNetONNXExport.ipynb)|
|Keras, ScitKit-Learn, CoreML<br/>XGBoost, and libSVM|[WinMLTools](https://docs.microsoft.com/windows/ai/convert-model-winmltools)|

You can find the latest list of supported frameworks and converters at the [ONNX Tutorials site](https://github.com/onnx/tutorials).

<a name="deploy"></a>

## Deploy ONNX models in Azure

With Azure Machine Learning service, you can deploy, manage, and monitor your ONNX models. Using the standard [deployment workflow](concept-model-management-and-deployment.md) and the ONNX Runtime, you can create a REST endpoint hosted in the cloud. See a full example Jupyter notebook at the end of this article to try it out for yourself. 

### Install and configure the ONNX Runtime

The ONNX Runtime is a high-performance inference engine for ONNX models. It comes with a Python API and provides hardware acceleration on both CPU and GPU. It currently supports ONNX 1.2 models and runs on Ubuntu 16.04 Linux. Both [CPU](https://pypi.org/project/onnxruntime) and [GPU](https://pypi.org/project/onnxruntime-gpu) packages are available on [PyPi.org](https://pypi.org).

To install the ONNX Runtime, use:
```python
pip install onnxruntime
```

To call the ONNX Runtime in your Python script, use:
```python
import onnxruntime

session = onnxruntime.InferenceSession("path to model")
```

The documentation accompanying the model usually tells you the inputs and outputs for using the model. You can also use a visualization tool such as [Netron](https://github.com/lutzroeder/Netron) to view the model. ONNX Runtime also lets you query the model metadata, inputs, and outputs:
```python
session.get_modelmeta()
first_input_name = session.get_inputs()[0].name
first_output_name = session.get_outputs()[0].name
```

To inference your model, use `run` and pass in the list of outputs you want returned (leave empty if you want all of them) and a map of the input values. The result is a list of the outputs.
```python
results = session.run(["output1", "output2"], {"input1": indata1, "input2": indata2})
results = session.run([], {"input1": indata1, "input2": indata2})
```

For the complete API reference, see the [ONNX Runtime reference docs](https://aka.ms/onnxruntime-python).

### Example deployment steps

Here is an example for deploying an ONNX model:

1. Initialize your Azure Machine Learning service workspace. If you don't have one yet, learn how to create a workspace in [this quickstart](quickstart-get-started.md).

   ```python
   from azureml.core import Workspace

   ws = Workspace.from_config()
   print(ws.name, ws.resource_group, ws.location, ws.subscription_id, sep = '\n')
   ```

2. Register the model with Azure Machine Learning.

   ```python
   from azureml.core.model import Model

   model = Model.register(model_path = "model.onnx",
                          model_name = "MyONNXmodel",
                          tags = ["onnx"],
                          description = "test",
                          workspace = ws)
   ```

3. Create an image with the model and any dependencies.

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

   The file `score.py` contains the scoring logic and needs to be included in the image. This file is used to run the model in the image. See this [tutorial](tutorial-deploy-models-with-aml.md#create-scoring-script) for instructions on how to create a scoring script. An example file for an ONNX model is shown below:

   ```python
   import onnxruntime
   import json
   import numpy as np
   import sys
   from azureml.core.model import Model

   def init():
       global model_path
       model_path = Model.get_model_path(model_name = 'MyONNXmodel')

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

   The file `myenv.yml` describes the dependencies needed for the image. See this [tutorial](tutorial-deploy-models-with-aml.md#create-environment-file) for instructions on how to create an environment file, such as this sample file:

   ```python
   from azureml.core.conda_dependencies import CondaDependencies 

   myenv = CondaDependencies()
   myenv.add_pip_package("numpy")
   myenv.add_pip_package("azureml-core")
   myenv.add_pip_package("onnxruntime")

   with open("myenv.yml","w") as f:
    f.write(myenv.serialize_to_string())
   ```

4. Deploy your ONNX model with Azure Machine Learning to:
   + Azure Container Instances (ACI): [Learn how...](how-to-deploy-to-aci.md)

   + Azure Kubernetes Service (AKS): [Learn how...](how-to-deploy-to-aks.md)


## Examples
 
The following notebooks demonstrate how to create ONNX models and deploy them with Azure Machine Learning: 
+ `/onnx/onnx-modelzoo-aml-deploy-resnet50.ipynb` 
+ `/onnx/onnx-convert-aml-deploy-tinyyolo.ipynb`
+ `/onnx/onnx-train-pytorch-aml-deploy-mnist.ipynb`

The following notebooks demonstrate how to deploy existing ONNX models with Azure Machine Learning: 
+ [onnx/onnx-inference-mnist.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/onnx/onnx-inference-mnist.ipynb) 
+ [onnx/onnx-inference-emotion-recognition.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/onnx/onnx-inference-emotion-recognition.ipynb)
 
Get these notebooks:
 
[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## More info

Learn more about ONNX or contribute to the project:
+ [ONNX project website](http://onnx.ai)

+ [ONNX code on GitHub](https://github.com/onnx/onnx)
