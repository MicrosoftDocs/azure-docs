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

# ONNX and Azure Machine Learning: Open and Interoperable AI

The Open Neural Network Exchange (ONNX) format is an open standard for representing machine learning models. ONNX is supported by a community of partners who create compatible frameworks and tools. Microsoft supports ONNX across its products including Azure and Windows. You can learn more about ONNX at http://onnx.ai.

Microsoft is committed to open and interoperable AI. We aim to:

+ Enable data scientists to use the framework of their choice to create and train models
+ Enable developers to deploy models cross-platform with minimal integration work

Adding support for ONNX in Azure Machine Learning helps you achieve these goals.  


ONNX models are supported in Azure Machine Learning, PyTorch, Caffe2, Microsoft Cognitive Toolkit, MXNet, and more. Additionally, connectors exist for many other [common frameworks and libraries](http://onnx.ai/supported-tools). This open ecosystem enables you to easily move between the best combination of state-of-the-art tools and frameworks for your work. 

## Benefits of ONNX

Enabling interoperability makes it possible to get great ideas into production faster. With ONNX, data scientists can choose the framework they are comfortable with and thats fits the needs of the job. Developers can spend less time on converting models to be production-ready and be able to deploy across the cloud and edge.

## ONNX in Azure

How does ONNX relate to Azure Machine Learning.

Microsoft also has native ONNX inference capabilities built into Windows ML Windows 10 RS4. For more information, read "[Get ONNX models for Windows ML](https://docs.microsoft.com/windows/ai/get-onnx-model)".


## How it works?

Here is a code snippet that illustrates how ONNX is natively supported: 

```Python
# Load ONNX model and classify the input image 
model = C.Function.load(filename, format=C.ModelFormat.ONNX) 
image_data = np.ascontiguousarray(np.transpose(image_data, (2, 0, 1))) 
result = np.squeeze(model.eval({model.arguments[0]:[image_data]})) 

# Save a model to ONNX format 
mymodel = create_my_model() 
output_file_path = R”mymodel.onnx“ 
mymodel.save(output_file_path, format=C.ModelFormat.ONNX) 
```

Download [this Jupyter notebook](https://aka.ms/aml-onnx-notebook) to try it out. 

## Next steps

Learn more about ONNX or contribute to the project:
+ [ONNX.ai project website](http://ONNX.ai)
+ [ONNX code on GitHub](https://github.com/onnx/onnx)