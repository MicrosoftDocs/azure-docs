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

# ONNX and Azure Machine Learning: Interchangeable AI models

The Open Neural Network Exchange format (ONNX) is an open-source project for representing deep learning AI models that can easily be transferred between frameworks. 

ONNX models are supported in Azure Machine Learning, PyTorch, Caffe2, Microsoft Cognitive Toolkit, MXNet, and more. Additionally, connectors exist for many other [common frameworks and libraries](http://onnx.ai/supported-tools). This open ecosystem enables you to easily move between the best combination of state-of-the-art tools and frameworks for your work. 

Include a diagram with full model flow including AML training, deployment, and also Windows ML tools. Send a draft so that professional art resources can create something professional for you.

## ONNX in Azure

How does ONNX relate to Azure Machine Learning.

Microsoft also has native ONNX inference capabilities built into Windows ML Windows 10 RS4. For more information, read "[Get ONNX models for Windows ML](https://docs.microsoft.com/en-us/windows/ai/get-onnx-model)".


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