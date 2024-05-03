---
title: 'ONNX models: Optimize inference'
titleSuffix: Azure Machine Learning
description: Learn how using the Open Neural Network Exchange (ONNX) can help optimize the inference of your machine learning model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: concept-article
ms.author: kritifaujdar
author: fkriti
ms.reviewer: mopeakande
ms.date: 03/18/2024

#customer intent: As a data scientist, I want learn how to use ONNX to create machine learning models and accelerate inferencing.
---

# ONNX and Azure Machine Learning

Learn how use of the [Open Neural Network Exchange](https://onnx.ai) (ONNX) can help to optimize the inference of your machine learning model. _Inference_ or _model scoring_, is the process of using a deployed model to generate predictions on production data.

Optimizing machine learning models for inference requires you to tune the model and the inference library to make the most of the hardware capabilities. This task becomes complex if you want to get optimal performance on different kinds of platforms such as cloud or edge, CPU or GPU, and so on, since each platform has different capabilities and characteristics. The complexity increases if you have models from various frameworks that need to run on different platforms. It can be time-consuming to optimize all the different combinations of frameworks and hardware. Therefore, a useful solution is to train your model once in your preferred framework and then run it anywhere on the cloud or edge—this solution is where ONNX comes in.

## What is ONNX?

Microsoft and a community of partners created ONNX as an open standard for representing machine learning models. Models from [many frameworks](https://onnx.ai/supported-tools) including TensorFlow, PyTorch, scikit-learn, Keras, Chainer, MXNet, and MATLAB can be exported or converted to the standard ONNX format. Once the models are in the ONNX format, they can be run on various platforms and devices.

[ONNX Runtime](https://onnxruntime.ai) is a high-performance inference engine for deploying ONNX models to production. It's optimized for both cloud and edge and works on Linux, Windows, and Mac. While ONNX is written in C++, it also has C, Python, C#, Java, and JavaScript (Node.js) APIs for usage in many environments. ONNX Runtime supports both deep neural networks (DNN) and traditional machine learning models, and it integrates with accelerators on different hardware such as TensorRT on Nvidia GPUs, OpenVINO on Intel processors, and DirectML on Windows. By using ONNX Runtime, you can benefit from the extensive production-grade optimizations, testing, and ongoing improvements.

ONNX Runtime is used in high-scale Microsoft services such as Bing, Office, and Azure AI. Although performance gains depend on many factors, these Microsoft services report an __average 2x performance gain on CPU__. In addition to Azure Machine Learning services, ONNX Runtime also runs in other products that support Machine Learning workloads, including:

- __Windows__: The runtime is built into Windows as part of [Windows Machine Learning](/windows/ai/windows-ml/) and runs on hundreds of millions of devices. 
- __Azure SQL product family__: Run native scoring on data in [Azure SQL Edge](../azure-sql-edge/onnx-overview.md) and [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/machine-learning-services-overview).
- __ML.NET__: [Run ONNX models in ML.NET](/dotnet/machine-learning/tutorials/object-detection-onnx).

:::image type="content" source="media/concept-onnx/onnx.png" alt-text="ONNX flow diagram showing training, converters, and deployment." lightbox="media/concept-onnx/onnx.png":::

## How to obtain ONNX models

You can obtain ONNX models in several ways:

- Train a new ONNX model in Azure Machine Learning (as described in the [examples](#examples) section of this article) or by using [automated machine learning capabilities](concept-automated-ml.md#automl--onnx).
- Convert an existing model from another format to ONNX as shown in these [tutorials](https://github.com/onnx/tutorials).
- Get a pretrained ONNX model from the [ONNX Model Zoo](https://github.com/onnx/models).
- Generate a customized ONNX model from [Azure AI Custom Vision service](../ai-services/custom-vision-service/index.yml).

Many models, including image classification, object detection, and text processing models can be represented as ONNX models. If you run into an issue with a model that can't be converted successfully, file a GitHub issue in the repository of the converter that you used. You can continue using your existing model format until the issue is addressed.

## ONNX model deployment in Azure

With Azure Machine Learning, you can deploy, manage, and monitor your ONNX models. Using the standard [MLOps deployment workflow](concept-model-management-and-deployment.md) and ONNX Runtime, you can create a REST endpoint hosted in the cloud. For hands-on examples, see these [Jupyter notebooks](#examples).

### Installation and use of ONNX Runtime with Python

Python packages for ONNX Runtime are available on [PyPi.org](https://pypi.org) ([CPU](https://pypi.org/project/onnxruntime) and [GPU](https://pypi.org/project/onnxruntime-gpu)). Be sure to review the [system requirements](https://github.com/Microsoft/onnxruntime#system-requirements) before installation.

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

The documentation accompanying the model usually tells you the inputs and outputs for using the model. You can also use a visualization tool such as [Netron](https://github.com/lutzroeder/Netron) to view the model. ONNX Runtime also lets you query the model metadata, inputs, and outputs as follows:

```python
session.get_modelmeta()
first_input_name = session.get_inputs()[0].name
first_output_name = session.get_outputs()[0].name
```

To perform inferencing on your model, use `run` and pass in the list of outputs you want returned (or leave the list empty if you want all of them) and a map of the input values. The result is a list of the outputs.

```python
results = session.run(["output1", "output2"], {
                      "input1": indata1, "input2": indata2})
results = session.run([], {"input1": indata1, "input2": indata2})
```

For the complete Python API reference, see the [ONNX Runtime reference docs](https://onnxruntime.ai/docs/api/python/api_summary.html).

## Examples

- For example Python notebooks that create and deploy ONNX models, see [how-to-use-azureml/deployment/onnx](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/onnx).
- [!INCLUDE [aml-clone-in-azure-notebook](includes/aml-clone-for-examples.md)]
- For samples that show ONNX usage in other languages, see the [ONNX Runtime GitHub](https://github.com/microsoft/onnxruntime/tree/master/samples).

## Related content

Learn more about **ONNX** or contribute to the project:
- [ONNX project website](https://onnx.ai)
- [ONNX code on GitHub](https://github.com/onnx/onnx)

Learn more about **ONNX Runtime** or contribute to the project:
- [ONNX Runtime project website](https://onnxruntime.ai)
- [ONNX Runtime GitHub Repo](https://github.com/Microsoft/onnxruntime)
