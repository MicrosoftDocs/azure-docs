---
title: What is an FPGA and Project Brainwave? - Azure Machine Learning service
description: Learn how to accelerate models and deep neural networks with FPGAs on Azure. This article provides an introduction to field-programmable gate arrays (FPGA) and how Azure Machine Learning Service provides real-time artificial intelligence (AI) when you deploy your model to an Azure FPGA.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: tedway
author: tedway
ms.reviewer: jmartens
ms.date: 9/24/2018
---

# What is FPGA and Project Brainwave?

This article provides an introduction to field-programmable gate arrays (FPGA) and how Azure Machine Learning service provides real-time artificial intelligence (AI) when you deploy your model to an Azure FPGA.

FPGAs contain an array of programmable logic blocks and a hierarchy of reconfigurable interconnects. The interconnects allow these blocks to be configured in various ways post-manufacturing. FPGAs provide a combination of programmability and performance compared to other chips.

## FPGAs vs. CPU, GPU, and ASIC

![Azure Machine Learning service FPGA comparison](./media/concept-accelerate-with-fpgas/azure-machine-learning-fpga-comparison.png)

|Processor||Description|
|---|:-------:|------|
|Application-specific integrated circuits|ASICs|Custom circuits, such as Google's TensorFlow Processor Units (TPU), provide the highest efficiency. They cannot be reconfigured as your needs change.|
|Field-programmable gate arrays|FPGAs|FPGAs, such as those available on Azure, provide performance close to ASICs, but are flexible and reconfigurable over time to implement new logic.|
|Graphics processing units|GPUs|A popular choice for AI computations offering parallel processing capabilities making it faster at image rendering than CPUs.|
|Central processing units|CPUs|General-purpose processors whose performance is not ideal for graphics and video processing.|

## Project Brainwave on Azure

[Project Brainwave](https://www.microsoft.com/research/project/project-brainwave/) is Microsoft's economical hardware architecture, based on Intel's FPGA devices, that data scientists and developers use to accelerate real-time AI calculations.  This FPGA-enabled architecture offers **performance**, **flexibility**, and **scale** and is available on Azure.

**FPGAs make it possible to achieve low latency for real-time inferencing requests.** Batching means collecting a large amount of data and feeding it to a processor to improve hardware utilization. Batching can cause latency because more data needs to be processed, but it can improve throughput. Project Brainwave implementations of neural processing units don't require batching; therefore the latency can be many times lower compared to CPU and GPU.

### Reconfigurable power
**FPGAs can be reconfigured for different types of machine learning models.** This flexibility makes it easier to accelerate the applications based on the most optimal numerical precision and memory model being used.

New machine learning techniques are being developed on a regular basis, and Project Brainwave's hardware design is also evolving rapidly. Since FPGAs are reconfigurable, it is possible to stay current with the requirements of the rapidly changing AI algorithms.

### What's supported on Azure
**Microsoft Azure is the world's largest cloud investment in FPGAs.** You can run Project Brainwave on Azure's scale infrastructure.

Today, Project Brainwave supports:
+ Image classification and recognition scenarios
+ TensorFlow deployment
+ DNNs: ResNet 50, ResNet 152, VGG-16, SSD-VGG, and DenseNet-121
+ Intel FPGA hardware 

Using this FPGA-enabled hardware architecture, trained neural networks run quickly and with lower latency. Project Brainwave can parallelize pre-trained deep neural networks (DNN) across FPGAs to scale out your service. The DNNs can be pre-trained, as a deep featurizer for transfer learning, or fine-tuned with updated weights.

### Scenarios and applications

Project Brainwave is integrated with Azure Machine Learning. Microsoft uses FPGAs for DNN evaluation, Bing search ranking, and software defined networking (SDN) acceleration to reduce latency while freeing CPUs for other tasks.

The following scenarios use FPGA on Project Brainwave architecture:
+ [Automated optical inspection system](https://blogs.microsoft.com/ai/build-2018-project-brainwave/)

+ [Land cover mapping](https://blogs.technet.microsoft.com/machinelearning/2018/05/29/how-to-use-fpgas-for-deep-learning-inference-to-perform-land-cover-mapping-on-terabytes-of-aerial-images/)

## Deploy to FPGAs on Azure

Here is the workflow for creating an image recognition service in Azure using supported DNNs as a featurizer for deployment on Azure FPGAs:

1. Use the Azure Machine Learning SDK for Python to create a service definition, which is a file describing a pipeline of graphs (input, featurizer, and classifier) based on TensorFlow. The deployment command will automatically compress the definition and graphs into a ZIP file and upload the ZIP to Azure Blob storage.  The DNN is already deployed on Project Brainwave to run on the FPGA.

1. Register the model using the SDK with the ZIP file in Azure Blob storage.

1. Deploy the service with the registered model using SDK.

You can get started deploying trained DNN models to FPGAs in the Azure cloud with this article, **"[Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md)"**.


## Next steps

Check out these videos and blogs:

+ [Hyperscale hardware: ML at scale on top of Azure + FPGA : Build 2018 (video)](https://www.youtube.com/watch?v=BMgQAHIx2eY)

+ [Inside the Microsoft FPGA-based configurable cloud (video)](https://channel9.msdn.com/Events/Build/2017/B8063)

+ [Project Brainwave for real-time AI: project home page](https://www.microsoft.com/research/project/project-brainwave/)
