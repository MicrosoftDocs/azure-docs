---
title: 'ONNX models: Optimize inference'
titleSuffix: Azure Machine Learning
description: Learn how using the Open Neural Network Exchange (ONNX) can help optimize the inference of your machine learning model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: osomorog
author: abeomor
ms.reviewer: mopeakande
ms.date: 11/04/2022
ms.custom: seodec18
---

# ONNX and Azure Machine Learning: Create and accelerate ML models

Learn how using the [Open Neural Network Exchange](https://onnx.ai) (ONNX) can help optimize the inference of your machine learning model. Inference, or model scoring, is the phase where the deployed model is used for prediction, most commonly on production data. 

Optimizing machine learning models for inference (or model scoring) is difficult since you need to tune the model and the inference library to make the most of the hardware capabilities. The problem becomes extremely hard if you want to get optimal performance on different kinds of platforms (cloud/edge, CPU/GPU, etc.), since each one has different capabilities and characteristics. The complexity increases if you have models from a variety of frameworks that need to run on a variety of platforms. It's very time consuming to optimize all the different combinations of frameworks and hardware. A solution to train once in your preferred framework and run anywhere on the cloud or edge is needed. This is where ONNX comes in.

Microsoft and a community of partners created ONNX as an open standard for representing machine learning models. Models from [many frameworks](https://onnx.ai/supported-tools) including TensorFlow, PyTorch, SciKit-Learn, Keras, Chainer, MXNet, MATLAB, and SparkML can be exported or converted to the standard ONNX format. Once the models are in the ONNX format, they can be run on a variety of platforms and devices.

[ONNX Runtime](https://onnxruntime.ai) is a high-performance inference engine for deploying ONNX models to production. It's optimized for both cloud and edge and works on Linux, Windows, and Mac. Written in C++, it also has C, Python, C#, Java, and JavaScript (Node.js) APIs for usage in a variety of environments. ONNX Runtime supports both DNN and traditional ML models and integrates with accelerators on different hardware such as TensorRT on NVidia GPUs, OpenVINO on Intel processors, DirectML on Windows, and more. By using ONNX Runtime, you can benefit from the extensive production-grade optimizations, testing, and ongoing improvements.

ONNX Runtime is used in high-scale Microsoft services such as Bing, Office, and Azure AI. Performance gains are dependent on a number of factors, but these Microsoft services have seen an __average 2x performance gain on CPU__. In addition to Azure Machine Learning services, ONNX Runtime also runs in other products that support Machine Learning workloads, including:
+ Windows: The runtime is built into Windows as part of [Windows Machine Learning](/windows/ai/windows-ml/) and runs on hundreds of millions of devices. 
+ Azure SQL product family: Run native scoring on data in [Azure SQL Edge](../azure-sql-edge/onnx-overview.md) and [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/machine-learning-services-overview).
+ ML.NET: [Run ONNX models in ML.NET](/dotnet/machine-learning/tutorials/object-detection-onnx).


[![ONNX flow diagram showing training, converters, and deployment](./media/concept-onnx/onnx.png)](././media/concept-onnx/onnx.png#lightbox)

## Get ONNX models

You can obtain ONNX models in several ways:
+ Train a new ONNX model in Azure Machine Learning (see examples at the bottom of this article) or by using [automated Machine Learning capabilities](concept-automated-ml.md#automl--onnx)
+ Convert existing model from another format to ONNX (see the [tutorials](https://github.com/onnx/tutorials)) 
+ Get a pre-trained ONNX model from the [ONNX Model Zoo](https://github.com/onnx/models)
+ Generate a customized ONNX model from [Azure AI Custom Vision service](../ai-services/custom-vision-service/index.yml) 

Many models including image classification, object detection, and text processing can be represented as ONNX models. If you run into an issue with a model that cannot be converted successfully, please file an issue in the GitHub of the respective converter that you used. You can continue using your existing format model until the issue is addressed.

## Deploy ONNX models in Azure

With Azure Machine Learning, you can deploy, manage, and monitor your ONNX models. Using the standard [deployment workflow](concept-model-management-and-deployment.md) and ONNX Runtime, you can create a REST endpoint hosted in the cloud. See example Jupyter notebooks at the end of this article to try it out for yourself. 

### Install and use ONNX Runtime with Python

Python packages for ONNX Runtime are available on [PyPi.org](https://pypi.org) ([CPU](https://pypi.org/project/onnxruntime), [GPU](https://pypi.org/project/onnxruntime-gpu)). Please read [system requirements](https://github.com/Microsoft/onnxruntime#system-requirements) before installation.    

 To install ONNX Runtime for Python, use one of the following commands:    
```python    
pip install onnxruntime          # CPU build
pip install onnxruntime-gpu   # GPU build
```

To call ONNX Runtime in your Python script, use:    
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
results = session.run(["output1", "output2"], {
                      "input1": indata1, "input2": indata2})
results = session.run([], {"input1": indata1, "input2": indata2})
```

For the complete Python API reference, see the [ONNX Runtime reference docs](https://onnxruntime.ai/docs/api/python/api_summary.html).    

## Examples
See [how-to-use-azureml/deployment/onnx](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/onnx) for example Python notebooks that create and deploy ONNX models.

[!INCLUDE [aml-clone-in-azure-notebook](includes/aml-clone-for-examples.md)]

Samples for usage in other languages can be found in the [ONNX Runtime GitHub](https://github.com/microsoft/onnxruntime/tree/master/samples).

## More info

Learn more about **ONNX** or contribute to the project:
+ [ONNX project website](https://onnx.ai)
+ [ONNX code on GitHub](https://github.com/onnx/onnx)

Learn more about **ONNX Runtime** or contribute to the project:
+ [ONNX Runtime project website](https://onnxruntime.ai)
+ [ONNX Runtime GitHub Repo](https://github.com/Microsoft/onnxruntime)
