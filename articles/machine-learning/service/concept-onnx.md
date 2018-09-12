---
title: ONNX and Azure Machine Learning - create and deploy models
description: Learn about ONNX and how to use Azure Machine Learning to create and deploy ONNX models 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: jmartens
author: j-martens
ms.date: 09/24/2018
---

# ONNX and Azure Machine Learning: Create and deploy interoperable AI models

The [Open Neural Network Exchange](http://onnx.ai) (ONNX) format is an open standard for representing machine learning models. ONNX is supported by a community of partners, including Microsoft, who create compatible frameworks and tools. Microsoft is committed to open and interoperable AI so that data scientists and developers can:

+ Use the framework of their choice to create and train models
+ Deploy models cross-platform with minimal integration work

Microsoft supports ONNX across its products including Azure and Windows to help you achieve these goals.  

## Why choose ONNX?
The interoperability you get with ONNX makes it possible to get great ideas into production faster. With ONNX, data scientists can choose their preferred framework for the job. Similarly, developers can spend less time getting models ready for production, and deploy across the cloud and edge.  

You can export ONNX models from many frameworks, including PyTorch, Chainer, Microsoft Cognitive Toolkit (CNTK), MXNet and ML.Net. Converters exist for other frameworks such as TensorFlow, Keras, SciKit-Learn, and more.

There is also an ecosystem of tools for visualizing and accelerating ONNX models. A number of pre-trained ONNX models are also available for common scenarios.

[ONNX models can be deployed](#deploy) to the cloud using Azure Machine Learning and the ONNX Runtime. They can also be deployed to Windows 10 devices using Windows ML. They can even be deployed to other platforms using converters that are available from the ONNX community. 

[ ![ONNX flow diagram showing training, converters, and deployment](media/concept-onnx/onnx.png) ]
(./media/concept-onnx/onnx.png#lightbox)

## Create ONNX models in Azure

You can create ONNX models in several ways:
+ Train a model in Azure Machine Learning service and convert or export it to ONNX - learn more with this [sample notebook](http://aka.ms/aml-onnx-training-notebook)

+ Get a pre-trained ONNX model from the [ONNX Model Zoo](https://github.com/onnx/models)

+ Generate a customized ONNX model from [Azure Custom Vision service](https://docs.microsoft.com/azure/cognitive-services/Custom-Vision-Service/)

Once you have an ONNX model, you can deploy it to Azure Machine Learning. You can also deploy the same ONNX model to Windows 10 devices using [Windows ML](https://docs.microsoft.com/windows/ai/).

## Export/convert your models to ONNX

You can also convert your models to ONNX.
+ For **PyTorch** models, try out [this Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/PytorchOnnxExport.ipynb)

+ For **Microsoft Cognitive Toolkit (CNTK)** models, try out [this Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/CntkOnnxExport.ipynb)

+ For **Chainer** models, try out [this Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/ChainerOnnxExport.ipynb)

+ For **MXNet** models, try out [this Jupyter notebook](https://github.com/onnx/tutorials/blob/master/tutorials/MXNetONNXExport.ipynb)

+ For **TensorFlow** models, use the [tensorflow-onnx converter](https://github.com/onnx/tensorflow-onnx).

+ For **Keras**, **ScitKit-Learn**, **CoreML**, **XGBoost**, and **libSVM** models, convert to ONNX using the [WinMLTools](https://docs.microsoft.com/windows/ai/convert-model-winmltools) package.

You can find the latest list of supported frameworks and converters at the [ONNX Tutorials site](https://github.com/onnx/tutorials).

<a name="deploy"></a>

## Deploy ONNX models in Azure

With Azure Machine Learning service, you can deploy, manage, and monitor your ONNX models. Using the standard [deployment workflow](concept-model-management-and-deployment.md) and the ONNX Runtime, you can create a REST endpoint hosted in the cloud. Download [this Jupyter notebook](https://aka.ms/aml-onnx-notebook) to try it out for yourself. 

### Install and configure the ONNX Runtime

The ONNX Runtime is a high-performance inference engine for ONNX models. It comes with a Python API and provides hardware acceleration on both CPU and GPU. It currently supports ONNX 1.2 models and runs on Ubuntu 16.04 Linux.

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

For complete API reference, see the [documentation](https://aka.ms/onnxruntime).

### Example deployment steps

Here is an example for deploying an ONNX model:

1. Initialize your Azure Machine Learning Workspace.

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

   The file `myenv.yml` describes the dependencies needed for the image. See this [tutorial](tutorial-deploy-models-with-aml.md#create-environment-file) for instructions on how to create an environment file. An example file for an ONNX model is shown below:

   ```
   name: myenv
   channels:
     - defaults
   dependencies:
     - pip:
       - onnxruntime
       # Required packages for AzureML
       - --extra-index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
       - azureml-core
   ```

4. Deploy your ONNX model with Azure Machine Learning to:
   + Azure Container Instances (ACI): [Learn how...](how-to-deploy-to-aci.md)

   + Azure Kubernetes Service (AKS): [Learn how...](how-to-deploy-to-aks.md)


## Next steps

Learn more about ONNX or contribute to the project:
+ [ONNX project website](http://onnx.ai)

+ [ONNX code on GitHub](https://github.com/onnx/onnx)