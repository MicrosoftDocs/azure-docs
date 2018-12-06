---
title: What is FPGA and Project Brainwave? - Azure Machine Learning service
description: Learn how to accelerate models and deep neural networks with FPGAs on Azure. This article provides an introduction to field-programmable gate arrays (FPGA), and how the Azure Machine Learning service provides real-time artificial intelligence (AI) when you deploy your model to an Azure FPGA.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: tedway
author: tedway
ms.reviewer: jmartens
ms.date: 10/24/2018
---

# What is FPGA and Project Brainwave?

This article provides an introduction to field-programmable gate arrays (FPGA), and how the Azure Machine Learning service provides real-time artificial intelligence (AI) when you deploy your model to an Azure FPGA.

FPGAs contain an array of programmable logic blocks, and a hierarchy of reconfigurable interconnects. The interconnects allow these blocks to be configured in various ways after manufacturing. Compared to other chips, FPGAs provide a combination of programmability and performance.

## Compare FPGAs to other processors

The following diagram and table show how FPGAs compare to other processors.

![Diagram of Azure Machine Learning service FPGA comparison](./media/concept-accelerate-with-fpgas/azure-machine-learning-fpga-comparison.png)

|Processor||Description|
|---|:-------:|------|
|Application-specific integrated circuits|ASICs|Custom circuits, such as Google's TensorFlow Processor Units (TPU), provide the highest efficiency. They can't be reconfigured as your needs change.|
|Field-programmable gate arrays|FPGAs|FPGAs, such as those available on Azure, provide performance close to ASICs. They are also flexible and reconfigurable over time, to implement new logic.|
|Graphics processing units|GPUs|A popular choice for AI computations. GPUs offer parallel processing capabilities, making it faster at image rendering than CPUs.|
|Central processing units|CPUs|General-purpose processors, the performance of which isn't ideal for graphics and video processing.|

## Project Brainwave on Azure

[Project Brainwave](https://www.microsoft.com/research/project/project-brainwave/) is a hardware architecture from Microsoft. It's based on Intel's FPGA devices, which data scientists and developers use to accelerate real-time AI calculations. This FPGA-enabled architecture offers performance, flexibility, and scale, and is available on Azure.

FPGAs make it possible to achieve low latency for real-time inferencing requests. Asynchronous requests (batching) aren't needed. Batching can cause latency, because more data needs to be processed. Project Brainwave implementations of neural processing units don't require batching; therefore the latency can be many times lower, compared to CPU and GPU processors.

### Reconfigurable power
You can reconfigure FPGAs for different types of machine learning models. This flexibility makes it easier to accelerate the applications based on the most optimal numerical precision and memory model being used. Because FPGAs are reconfigurable, you can stay current with the requirements of rapidly changing AI algorithms.

### What's supported on Azure
Microsoft Azure is the world's largest cloud investment in FPGAs. You can run Project Brainwave on Azure's scale infrastructure.

Today, Project Brainwave supports:
+ Image classification and recognition scenarios
+ TensorFlow deployment
+ DNNs: ResNet 50, ResNet 152, VGG-16, SSD-VGG, and DenseNet-121
+ Intel FPGA hardware 

Using this FPGA-enabled hardware architecture, trained neural networks run quickly and with lower latency. Project Brainwave can parallelize pre-trained deep neural networks (DNN) across FPGAs to scale out your service. The DNNs can be pre-trained, as a deep featurizer for transfer learning, or fine-tuned with updated weights.

### Scenarios and applications

Project Brainwave is integrated with Azure Machine Learning. Microsoft uses FPGAs for DNN evaluation, Bing search ranking, and software defined networking (SDN) acceleration to reduce latency, while freeing CPUs for other tasks.

The following scenarios use FPGA on Project Brainwave architecture:
+ [Automated optical inspection system](https://blogs.microsoft.com/ai/build-2018-project-brainwave/)

+ [Land cover mapping](https://blogs.technet.microsoft.com/machinelearning/2018/05/29/how-to-use-fpgas-for-deep-learning-inference-to-perform-land-cover-mapping-on-terabytes-of-aerial-images/)

## Deploy to FPGAs on Azure

To create an image recognition service in Azure, you can use supported DNNs as a featurizer for deployment on Azure FPGAs:

1. Use the [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) to create a service definition. A service definition is a file describing a pipeline of graphs (input, featurizer, and classifier) based on TensorFlow. The deployment command automatically compresses the definition and graphs into a ZIP file, and uploads the ZIP to Azure Blob storage. The DNN is already deployed on Project Brainwave to run on the FPGA.

1. Register the model by using the SDK with the ZIP file in Azure Blob storage.

1. Deploy the service with the registered model by using the SDK.

To get started deploying trained DNN models to FPGAs in the Azure cloud, see [Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md).


## Next steps

Check out these videos and blogs:

+ [Hyperscale hardware: ML at scale on top of Azure + FPGA : Build 2018 (video)](https://www.youtube.com/watch?v=BMgQAHIx2eY)

+ [Inside the Microsoft FPGA-based configurable cloud (video)](https://channel9.msdn.com/Events/Build/2017/B8063)

+ [Project Brainwave for real-time AI: project home page](https://www.microsoft.com/research/project/project-brainwave/)
