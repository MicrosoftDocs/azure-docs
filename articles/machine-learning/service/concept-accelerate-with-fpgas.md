---
title: What is an FPGA? – Project Brainwave – Azure Machine Learning
description: Learn how to accelerate models and deep neural networks with FPGAs. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: tedway
author: tedway
ms.date: 05/31/2018

# What is an FPGA and what is it used for in Azure Machine learning?
---

# What is FPGA and Project Brainwave?

This article provides an introduction to field-programmable gate arrays (FPGA) and how FPGA is integrated with Azure machine learning to provide real-time AI.

## FPGAs vs. CPU, GPU, and ASIC

FPGAs contain an array of programmable logic blocks, and a hierarchy of reconfigurable interconnects that allow the blocks to be configured in different ways after manufacturing.

FPGAs provide a combination of programmability and performance comparing to other chips:

![Azure Machine Learning FPGA comparison](./media/concept-accelerate-with-fpgas/azure-machine-learning-fpga-comparison.png)

- **Central processing units (CPU)** are general-purpose processors. CPU performance is not ideal for graphics and video processing.
- **Graphics processing units (GPU)** offer parallel processing and are a popular choice for AI computations. The parallel processing with GPUs result in faster image rendering than CPUs.
- **Application-specific integrated circuits (ASIC)**, such as Google’s TensorFlow Processor Units, are customized circuits. While these chips provide the highest efficiency, ASICs are inflexible.
- **FPGAs**, such as those available on Azure, provide the performance close to ASIC, but offer the flexibility to be reconfigured later.

FPGAs are now in every new Azure server. Microsoft is already using FPGAs for Bing search ranking, deep neural network (DNN) evaluation, and software defined networking (SDN) acceleration. These FPGA implementations reduce latency while freeing CPUs for other tasks.

## Project Brainwave on Azure

Project Brainwave is a hardware architecture that is designed based on Intel's FPGA devices and used to accelerate real-time AI calculations. With this economical FPGA-enabled architecture, a trained neural network can be run as quickly as possible and with lower latency. Project Brainwave can parallelize pre-trained DNNs across FPGAs to scale out your service.

- Performance

    FPGAs make it possible to achieve low latency for real-time inferencing requests. Batching means breaking up a request into smaller pieces and feeding them to a processor to improve hardware utilization. Batching is not efficient and can cause latency. Brainwave doesn't require batching; therefore the latency is 10 times lower compared to CPU and GPU.

- Flexibility

    FPGAs can be reconfigured for different types of machine learning models. This flexibility makes it easier to accelerate the applications based on the most optimal numerical precision and memory model being used.

    New machine learning techniques are being developed on a regular basis, and Project Brainwave's hardware design is also evolving rapidly. Since FPGAs are reconfigurable, it is possible to stay current with the requirements of the rapidly changing AI algorithms.

- Scale

    Microsoft Azure is the world's largest cloud investment in FPGAs. You can run Brainwave on Azure's scale infrastructure.

A preview of Project Brainwave integrated with Azure Machine Learning is currently available. And a limited preview is also available to bring Project Brainwave to the edge so that you can take advantage of that computing speed in your own businesses and facilities.

In current preview, Brainwave is limited to the TensorFlow deployment and the ResNet50-based neural networks on Intel FPGA hardware for image classification and recognition. There are plans to support more gallery models and other frameworks.

The following scenarios use FPGA on Project Brainwave architecture:

- Automated optical inspection system. See [Real-time AI: Microsoft announces preview of Project Brainwave](https://blogs.microsoft.com/ai/build-2018-project-brainwave/).
- Land cover mapping. See [How to Use FPGAs for Deep Learning Inference to Perform Land Cover Mapping on Terabytes of Aerial Images](https://blogs.technet.microsoft.com/machinelearning/2018/05/29/how-to-use-fpgas-for-deep-learning-inference-to-perform-land-cover-mapping-on-terabytes-of-aerial-images/).

## How to deploy a web service to an FPGA?

The high-level flow for creating an image recognition service in Azure using ResNet50 as a featurizer is as follows:

1. ResNet50 is already deployed in Brainwave. You can build other graphs (date input, classification, and so on) with TensorFlow, and define a pipeline (input -> featurize -> classify) using a service definition json file. Compress the definition and graphs into a zip file, and upload the zip file to Azure Blob storage.
2. Register the model using Azure ML Model Management API with the zip file in the Blob storage.
3. Deploy the service with the registered model using Azure ML Model Management API.

Learn more about this process in the article, [Deploy a model as a web service on an FPGA with Azure Machine Learning](how-to-deploy-fpga-web-service.md).


## Start using FPGA

Azure Machine Learning Hardware Accelerated Models allow you to deploy trained DNN models to FPGAs in the Azure cloud. To get started, see:

- [Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md)
- [Microsoft Azure Machine Learning Hardware Accelerated Models Powered by Project Brainwave](https://github.com/azure/aml-real-time-ai).

## Next steps

[Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md)

[Learn how to install the FPGA SDK](reference-fpga-package-overview.md)

[Hyperscale hardware: ML at scale on top of Azure + FPGA : Build 2018 (video)](https://www.youtube.com/watch?v=BMgQAHIx2eY)

[Inside the Microsoft FPGA-based configurable cloud (video)](https://channel9.msdn.com/Events/Build/2017/B8063)

[Microsoft unveils Project Brainwave for real-time AI](https://www.microsoft.com/research/blog/microsoft-unveils-project-brainwave/)